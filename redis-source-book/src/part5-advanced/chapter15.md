# 第15章：RDB 持久化

RDB（Redis Database）是 Redis 的持久化方式之一，将内存中的数据保存到磁盘的二进制文件。

## 15.1 RDB 文件格式

### 15.1.1 文件结构

```
┌─────────┬──────────┬──────────┬─────────┬─────────┐
│  REDIS  │ version  │  数据...  │  EOF    │  CRC64  │
│ 5字节   │ 4字节    │          │ 1字节   │ 8字节   │
└─────────┴──────────┴──────────┴─────────┴─────────┘

REDIS: "REDIS"
version: "0006" (2.0.0)
EOF: 0xFF
CRC64: 校验和
```

### 15.1.2 数据存储格式

```
每个 key-value 对:
┌─────────┬──────────┬─────────┬─────────┬─────────┐
│  type   │  key     │  value  │ expire  │         │
│ 1字节   │ 长度+内容 │ 类型相关│ 可选    │         │
└─────────┴──────────┴─────────┴─────────┴─────────┘

字符串编码:
00xxxxxx - 6位长度
01xxxxxx xxxxxxxx - 14位长度
10xxxxxx + 32位长度 - 32位长度
11xxxxxx - 特殊编码
```

## 15.2 SAVE/BGSAVE 实现

### 15.2.1 SAVE 命令

```c
static void saveCommand(redisClient *c) {
    if (server.bgsavechildpid != -1) {
        addReplyError(c, "Background save already in progress");
        return;
    }

    if (rdbSave(server.dbfilename) == REDIS_OK) {
        addReply(c, shared.ok);
    } else {
        addReply(c, shared.err);
    }
}
```

### 15.2.2 BGSAVE 命令

```c
static void bgsaveCommand(redisClient *c) {
    if (server.bgsavechildpid != -1) {
        addReplyError(c, "Background save already in progress");
    } else if (server.bgrewritechildpid != -1) {
        addReplyError(c, "Can't BGSAVE while AOF log rewriting is in progress");
    } else {
        if (rdbSaveBackground(server.dbfilename) == REDIS_OK) {
            addReply(c, shared.ok);
        } else {
            addReply(c, shared.err);
        }
    }
}
```

### 15.2.3 后台保存实现

```c
static int rdbSaveBackground(char *filename) {
    pid_t childpid;

    if ((childpid = fork()) == 0) {
        // 子进程
        if (rdbSave(filename) == REDIS_OK) {
            exit(0);
        } else {
            exit(1);
        }
    } else {
        // 父进程
        server.bgsavechildpid = childpid;
        server.lastsave = time(NULL);
        server.dirty_before_bgsave = server.dirty;
        return REDIS_OK;
    }
}
```

## 15.3 rdbSave/rdbLoad 源码分析

### 15.3.1 rdbSave

```c
static int rdbSave(char *filename) {
    FILE *fp;
    char tmpfile[256];
    int j;

    // 创建临时文件
    snprintf(tmpfile, 256, "temp-%d.rdb", (int)getpid());
    fp = fopen(tmpfile, "w");
    if (!fp) return REDIS_ERR;

    // 写入文件头
    if (fwrite("REDIS0006", 9, 1, fp) == 0) goto werr;

    // 遍历所有数据库
    for (j = 0; j < server.dbnum; j++) {
        redisDb *db = server.db + j;
        if (dictSize(db->dict) == 0) continue;

        // 写入数据库选择标记
        if (rdbSaveType(fp, REDIS_SELECTDB) == -1) goto werr;
        if (rdbSaveLen(fp, j) == -1) goto werr;

        // 写入所有 key-value
        dictIterator *di = dictGetIterator(db->dict);
        dictEntry *de;
        while ((de = dictNext(di)) != NULL) {
            robj *key = dictGetEntryKey(de);
            robj *val = dictGetEntryVal(de);

            // 写入过期时间
            time_t expire = getExpire(db, key);
            if (expire != -1) {
                if (rdbSaveType(fp, REDIS_EXPIRETIME) == -1) goto werr;
                if (rdbSaveTime(fp, expire) == -1) goto werr;
            }

            // 写入类型
            if (rdbSaveType(fp, val->type) == -1) goto werr;

            // 写入 key
            if (rdbSaveStringObject(fp, key) == -1) goto werr;

            // 写入 value
            if (rdbSaveObject(fp, val) == -1) goto werr;
        }
        dictReleaseIterator(di);
    }

    // 写入 EOF
    if (rdbSaveType(fp, REDIS_EOF) == -1) goto werr;

    // 写入校验和
    // ...

    fclose(fp);

    // 重命名文件
    if (rename(tmpfile, filename) == -1) {
        unlink(tmpfile);
        return REDIS_ERR;
    }

    return REDIS_OK;

werr:
    fclose(fp);
    unlink(tmpfile);
    return REDIS_ERR;
}
```

### 15.3.2 rdbLoad

```c
static int rdbLoad(char *filename) {
    FILE *fp;
    robj *key, *val;
    uint32_t dbid;
    int type;

    fp = fopen(filename, "r");
    if (!fp) return REDIS_ERR;

    // 检查文件头
    char buf[9];
    if (fread(buf, 9, 1, fp) == 0) goto eoferr;
    buf[9] = '\0';
    if (memcmp(buf, "REDIS0006", 9) != 0) {
        fclose(fp);
        return REDIS_ERR;
    }

    // 读取数据
    while (1) {
        robj *key, *val;
        time_t expiretime = -1;

        // 读取类型
        if ((type = rdbLoadType(fp)) == -1) goto eoferr;

        if (type == REDIS_EOF) break;

        // 处理过期时间
        if (type == REDIS_EXPIRETIME) {
            if ((expiretime = rdbLoadTime(fp)) == -1) goto eoferr;
            type = rdbLoadType(fp);
        }

        // 处理数据库选择
        if (type == REDIS_SELECTDB) {
            if ((dbid = rdbLoadLen(fp, NULL)) == REDIS_RDB_LENERR)
                goto eoferr;
            selectDb(server.db + dbid);
            continue;
        }

        // 读取 key
        if ((key = rdbLoadStringObject(fp)) == NULL) goto eoferr;

        // 读取 value
        if ((val = rdbLoadObject(type, fp)) == NULL) goto eoferr;

        // 添加到数据库
        setKey(server.db + dbid, key, val);

        // 设置过期时间
        if (expiretime != -1) {
            setExpire(server.db + dbid, key, expiretime);
        }
    }

    fclose(fp);
    return REDIS_OK;

eoferr:
    fclose(fp);
    return REDIS_ERR;
}
```

## 15.4 自动保存触发

```c
// serverCron 中检查保存条件
static int serverCron(struct aeEventLoop *eventLoop, long long id, void *clientData) {
    // ...

    // 检查是否满足自动保存条件
    if (server.bgsavechildpid == -1 &&
        server.dirty >= server.saveparams[0].changes &&
        server.unixtime - server.lastsave >= server.saveparams[0].seconds) {
        rdbSaveBackground(server.dbfilename);
    }

    // ...
}
```

## 15.5 小结

本章分析了 Redis RDB 持久化的实现：

1. **文件格式**：二进制格式，包含数据和校验
2. **SAVE/BGSAVE**：同步和异步保存
3. **fork 子进程**：利用写时复制实现后台保存
4. **自动保存**：根据配置自动触发