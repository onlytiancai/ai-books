# 第16章：AOF 持久化

AOF（Append Only File）是 Redis 的另一种持久化方式，记录所有写命令。

## 16.1 AOF 原理

### 16.1.1 工作流程

```
写命令 ──► AOF 缓冲区 ──► 写入文件 ──► 同步到磁盘
              │
              └── 根据策略定期同步
```

### 16.1.2 同步策略

```c
#define APPENDFSYNC_NO 0        // 不主动同步，由操作系统决定
#define APPENDFSYNC_ALWAYS 1    // 每个命令都同步
#define APPENDFSYNC_EVERYSEC 2  // 每秒同步一次
```

## 16.2 命令追加

### 16.2.1 AOF 缓冲区

```c
// redis.c
struct redisServer {
    // ...
    sds aofbuf;       // AOF 缓冲区
    int appendfd;     // AOF 文件描述符
    int appendfsync;  // 同步策略
    time_t lastfsync; // 上次同步时间
    // ...
};
```

### 16.2.2 追加命令

```c
static void feedAppendOnlyFile(struct redisCommand *cmd, int dictid, robj **argv, int argc) {
    sds buf = sdsempty();

    // 选择数据库
    if (dictid != server.appendseldb) {
        buf = sdscatprintf(buf, "*2\r\n$6\r\nSELECT\r\n$%d\r\n%d\r\n",
                          (int)strlen(buf), dictid);
        server.appendseldb = dictid;
    }

    // 生成命令格式
    buf = sdscatprintf(buf, "*%d\r\n", argc);
    for (int j = 0; j < argc; j++) {
        buf = sdscatprintf(buf, "$%zu\r\n", sdslen(argv[j]->ptr));
        buf = sdscatlen(buf, argv[j]->ptr, sdslen(argv[j]->ptr));
        buf = sdscatlen(buf, "\r\n", 2);
    }

    // 追加到缓冲区
    server.aofbuf = sdscatlen(server.aofbuf, buf, sdslen(buf));
    sdsfree(buf);
}
```

## 16.3 AOF 重写

### 16.3.1 重写原理

AOF 文件会随着命令增加而变大，重写可以压缩文件大小：

```
重写前:
SET key1 value1
SET key1 value2
SET key1 value3
LPUSH mylist a
LPUSH mylist b
LPUSH mylist c

重写后:
SET key1 value3
LPUSH mylist c b a
```

### 16.3.2 BGREWRITEAOF 实现

```c
static void bgrewriteaofCommand(redisClient *c) {
    if (server.bgrewritechildpid != -1) {
        addReplyError(c, "Background append only file rewriting already in progress");
    } else if (server.bgsavechildpid != -1) {
        addReplyError(c, "Can't BGREWRITEAOF while BGSAVE is in progress");
    } else {
        if (rewriteAppendOnlyFileBackground() == REDIS_OK) {
            addReply(c, shared.ok);
        } else {
            addReply(c, shared.err);
        }
    }
}

static int rewriteAppendOnlyFileBackground(void) {
    pid_t childpid;

    if ((childpid = fork()) == 0) {
        // 子进程执行重写
        if (rewriteAppendOnlyFile(server.appendfilename) == REDIS_OK) {
            exit(0);
        } else {
            exit(1);
        }
    } else {
        server.bgrewritechildpid = childpid;
        return REDIS_OK;
    }
}
```

### 16.3.3 重写过程

```c
static int rewriteAppendOnlyFile(char *filename) {
    FILE *fp;
    char tmpfile[256];

    snprintf(tmpfile, 256, "temp-rewriteaof-%d.aof", (int)getpid());
    fp = fopen(tmpfile, "w");

    // 遍历所有数据库
    for (j = 0; j < server.dbnum; j++) {
        // 写入 SELECT 命令
        // ...

        // 遍历所有 key-value
        dictIterator *di = dictGetIterator(db->dict);
        dictEntry *de;
        while ((de = dictNext(di)) != NULL) {
            robj *key = dictGetEntryKey(de);
            robj *val = dictGetEntryVal(de);

            // 根据类型生成命令
            if (val->type == REDIS_STRING) {
                // 生成 SET 命令
            } else if (val->type == REDIS_LIST) {
                // 生成 RPUSH 命令
            } else if (val->type == REDIS_SET) {
                // 生成 SADD 命令
            }
            // ...
        }
    }

    fclose(fp);
    rename(tmpfile, filename);
    return REDIS_OK;
}
```

## 16.4 AOF 加载

```c
static int loadAppendOnlyFile(char *filename) {
    FILE *fp = fopen(filename, "r");
    robj *key, *val;
    sds argsds;
    int argc;
    robj **argv;

    while (1) {
        // 读取命令
        argc = readArgc(fp);
        argv = zmalloc(sizeof(robj*) * argc);

        for (int j = 0; j < argc; j++) {
            argsds = readString(fp);
            argv[j] = createObject(REDIS_STRING, argsds);
        }

        // 查找并执行命令
        struct redisCommand *cmd = lookupCommand(argv[0]->ptr);
        cmd->proc(fakeClient);  // 执行命令
    }

    fclose(fp);
    return REDIS_OK;
}
```

## 16.5 小结

本章分析了 Redis AOF 持久化的实现：

1. **命令追加**：记录所有写命令
2. **同步策略**：支持不同级别的数据安全
3. **AOF 重写**：压缩文件大小
4. **fork 子进程**：后台重写不影响服务