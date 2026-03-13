# 第17章：主从复制

Redis 支持主从复制，允许从服务器复制主服务器的数据。

## 17.1 复制流程

```
┌─────────────┐                    ┌─────────────┐
│    Master   │                    │    Slave    │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │         1. SYNC 命令             │
       │ ◄────────────────────────────────│
       │                                  │
       │         2. BGSAVE                │
       │         (生成 RDB)               │
       │                                  │
       │         3. 发送 RDB              │
       │─────────────────────────────────►│
       │                                  │
       │         4. 加载 RDB              │
       │                                  │
       │         5. 发送积压命令           │
       │─────────────────────────────────►│
       │                                  │
       │         6. 持续同步               │
       │◄────────────────────────────────►│
```

## 17.2 SYNC 命令

### 17.2.1 从服务器发起同步

```c
static void syncCommand(redisClient *c) {
    if (!server.isslave) {
        // 主服务器收到 SYNC 命令
        if (server.bgsavechildpid != -1) {
            // 已有 BGSAVE 在进行，等待完成
            // 将客户端加入等待列表
        } else {
            // 开始 BGSAVE
            if (rdbSaveBackground(server.dbfilename) == REDIS_OK) {
                // 将客户端加入等待列表
            }
        }
    } else {
        // 从服务器发起 SYNC
        // ...
    }
}
```

### 17.2.2 主服务器处理

```c
static void updateSlavesWaitingBgsave(int bgsaveerr) {
    listNode *ln;
    listIter li;

    listRewind(server.slaves, &li);
    while ((ln = listNext(&li))) {
        redisClient *slave = ln->value;

        if (slave->replstate == REDIS_REPL_WAIT_BGSAVE_END) {
            if (bgsaveerr == REDIS_OK) {
                // 发送 RDB 文件
                slave->replstate = REDIS_REPL_SEND_BULK;
                slave->repldboff = 0;
                slave->repldbsize = ...;
            } else {
                // 同步失败
                freeClient(slave);
            }
        }
    }
}
```

## 17.3 增量同步

### 17.3.1 命令传播

主服务器执行写命令后，会传播给所有从服务器：

```c
static void replicationFeedSlaves(list *slaves, int dictid, robj **argv, int argc) {
    listNode *ln;
    listIter li;
    robj *cmdargv[argc];

    // 构建命令
    // ...

    // 发送给所有从服务器
    listRewind(slaves, &li);
    while ((ln = listNext(&li))) {
        redisClient *slave = ln->value;

        if (slave->replstate == REDIS_REPL_ONLINE) {
            // 从服务器在线，发送命令
            for (int j = 0; j < argc; j++) {
                addReplyBulk(slave, argv[j]);
            }
        }
    }
}
```

## 17.4 从服务器连接

### 17.4.1 连接主服务器

```c
static int syncWithMaster(void) {
    int fd;

    // 连接主服务器
    fd = anetTcpConnect(server.neterr, server.masterhost, server.masterport);
    if (fd == ANET_ERR) return REDIS_ERR;

    // 发送 SYNC 命令
    anetWrite(fd, "SYNC\r\n", 6);

    // 创建伪客户端接收数据
    server.master = createClient(fd);
    server.master->flags |= REDIS_MASTER;
    server.replstate = REDIS_REPL_CONNECTED;

    return REDIS_OK;
}
```

## 17.5 小结

本章分析了 Redis 主从复制的实现：

1. **同步流程**：SYNC 命令触发完整同步
2. **RDB 传输**：通过 RDB 文件传输数据
3. **命令传播**：持续同步写命令
4. **状态管理**：追踪复制状态