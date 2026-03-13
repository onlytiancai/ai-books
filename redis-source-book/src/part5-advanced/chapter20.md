# 第20章：事务 (MULTI/EXEC)

Redis 通过 MULTI/EXEC 命令提供事务支持，保证一组命令的原子性执行。

## 20.1 事务状态

### 20.1.1 客户端事务状态

```c
typedef struct multiCmd {
    robj **argv;
    int argc;
    struct redisCommand *cmd;
} multiCmd;

typedef struct multiState {
    multiCmd *commands;     // 命令数组
    int count;              // 命令数量
} multiState;

// redisClient 中
typedef struct redisClient {
    // ...
    int flags;              // REDIS_MULTI 表示在事务中
    multiState mstate;      // 事务状态
    // ...
} redisClient;
```

### 20.1.2 事务流程

```
客户端                    服务器
  │                         │
  │  MULTI                  │
  │ ───────────────────────►│ 设置 REDIS_MULTI 标志
  │                         │
  │  SET key1 value1        │
  │ ───────────────────────►│ 命令入队
  │                         │
  │  SET key2 value2        │
  │ ───────────────────────►│ 命令入队
  │                         │
  │  EXEC                   │
  │ ───────────────────────►│ 执行队列中的所有命令
  │                         │
  │ ◄───────────────────── │ 返回结果
```

## 20.2 命令入队

### 20.2.1 MULTI 命令

```c
static void multiCommand(redisClient *c) {
    if (c->flags & REDIS_MULTI) {
        addReplyError(c, "MULTI calls can not be nested");
        return;
    }

    c->flags |= REDIS_MULTI;
    addReply(c, shared.ok);
}
```

### 20.2.2 命令入队

```c
static void queueMultiCommand(redisClient *c, struct redisCommand *cmd) {
    multiCmd *mc;

    // 扩展命令数组
    c->mstate.commands = zrealloc(c->mstate.commands,
                                   sizeof(multiCmd) * (c->mstate.count + 1));

    mc = c->mstate.commands + c->mstate.count;

    // 保存命令
    mc->cmd = cmd;
    mc->argc = c->argc;
    mc->argv = zmalloc(sizeof(robj*) * c->argc);
    for (int j = 0; j < c->argc; j++) {
        mc->argv[j] = c->argv[j];
        incrRefCount(c->argv[j]);
    }

    c->mstate.count++;
}
```

## 20.3 执行与回滚

### 20.3.1 EXEC 命令

```c
static void execCommand(redisClient *c) {
    if (!(c->flags & REDIS_MULTI)) {
        addReplyError(c, "EXEC without MULTI");
        return;
    }

    // 检查是否有被监视的 key 被修改
    if (c->flags & REDIS_DIRTY_CAS) {
        // 放弃事务
        discardTransaction(c);
        addReply(c, shared.nullmultibulk);
        return;
    }

    // 执行所有命令
    execTransaction(c);
}

static void execTransaction(redisClient *c) {
    int j;
    robj **orig_argv = c->argv;
    int orig_argc = c->argc;

    addReplyMultiBulkLen(c, c->mstate.count);

    for (j = 0; j < c->mstate.count; j++) {
        c->argc = c->mstate.commands[j].argc;
        c->argv = c->mstate.commands[j].argv;

        // 调用命令
        c->mstate.commands[j].cmd->proc(c);
    }

    c->argv = orig_argv;
    c->argc = orig_argc;

    // 清理事务状态
    discardTransaction(c);
}
```

### 20.3.2 DISCARD 命令

```c
static void discardCommand(redisClient *c) {
    if (!(c->flags & REDIS_MULTI)) {
        addReplyError(c, "DISCARD without MULTI");
        return;
    }

    discardTransaction(c);
    addReply(c, shared.ok);
}

static void discardTransaction(redisClient *c) {
    // 释放命令队列
    freeClientMultiState(c);
    initClientMultiState(c);

    // 清除标志
    c->flags &= ~(REDIS_MULTI | REDIS_DIRTY_CAS | REDIS_DIRTY_EXEC);
}
```

## 20.4 WATCH 命令

### 20.4.1 乐观锁

```c
static void watchCommand(redisClient *c) {
    for (int j = 1; j < c->argc; j++) {
        // 添加到监视列表
        if (dictAdd(c->db->watched_keys, c->argv[j], c) == DICT_OK) {
            incrRefCount(c->argv[j]);
        }
    }

    addReply(c, shared.ok);
}
```

### 20.4.2 检查修改

当 key 被修改时，标记所有监视该 key 的客户端：

```c
static void touchWatchedKey(redisDb *db, robj *key) {
    list *clients = dictFetchValue(db->watched_keys, key);
    if (!clients) return;

    listIter li;
    listNode *ln;
    listRewind(clients, &li);

    while ((ln = listNext(&li))) {
        redisClient *c = ln->value;
        c->flags |= REDIS_DIRTY_CAS;
    }
}
```

## 20.5 小结

本章分析了 Redis 事务的实现：

1. **MULTI/EXEC**：事务的开始和执行
2. **命令入队**：事务期间的命令被缓存
3. **DISCARD**：放弃事务
4. **WATCH**：乐观锁机制
5. **原子性**：事务中的命令顺序执行