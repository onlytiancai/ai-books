# 第11章：列表命令

列表是 Redis 的基础数据类型之一，底层使用双向链表实现。

## 11.1 LPUSH/RPUSH/LPOP/RPOP 实现

### 11.1.1 LPUSH/RPUSH 命令

```c
static void lpushCommand(redisClient *c) {
    pushGenericCommand(c, REDIS_HEAD);
}

static void rpushCommand(redisClient *c) {
    pushGenericCommand(c, REDIS_TAIL);
}

static void pushGenericCommand(redisClient *c, int where) {
    robj *lobj = lookupKeyWrite(c->db, c->argv[1]);

    if (lobj == NULL) {
        // 创建新列表
        lobj = createListObject();
        dictAdd(c->db->dict, c->argv[1], lobj);
        incrRefCount(c->argv[1]);
    } else {
        if (lobj->type != REDIS_LIST) {
            addReply(c, shared.wrongtypeerr);
            return;
        }
    }

    // 添加元素
    list *list = lobj->ptr;
    if (where == REDIS_HEAD) {
        listAddNodeHead(list, c->argv[2]);
    } else {
        listAddNodeTail(list, c->argv[2]);
    }
    incrRefCount(c->argv[2]);

    server.dirty++;
    addReplyLongLong(c, listLength(list));
}
```

### 11.1.2 LPOP/RPOP 命令

```c
static void lpopCommand(redisClient *c) {
    popGenericCommand(c, REDIS_HEAD);
}

static void rpopCommand(redisClient *c) {
    popGenericCommand(c, REDIS_TAIL);
}

static void popGenericCommand(redisClient *c, int where) {
    robj *o = lookupKeyWrite(c->db, c->argv[1]);

    if (o == NULL) {
        addReply(c, shared.nullbulk);
        return;
    }

    if (o->type != REDIS_LIST) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    list *list = o->ptr;
    listNode *ln;

    if (where == REDIS_HEAD) {
        ln = listFirst(list);
    } else {
        ln = listLast(list);
    }

    if (ln == NULL) {
        addReply(c, shared.nullbulk);
    } else {
        robj *ele = ln->value;
        addReplyBulk(c, ele);
        listDelNode(list, ln);

        // 列表为空时删除 key
        if (listLength(list) == 0) {
            deleteKey(c->db, c->argv[1]);
        }

        server.dirty++;
    }
}
```

## 11.2 阻塞操作 BLPOP/BRPOP

BLPOP/BRPOP 是 Redis 2.0.0 引入的重要特性，允许客户端在列表为空时阻塞等待。

### 11.2.1 实现原理

```
BLPOP mylist 5  (阻塞 5 秒)

场景 1：列表有元素
┌─────────────┐
│   mylist    │ ──► 立即返回元素
│ [A] [B]     │
└─────────────┘

场景 2：列表为空
┌─────────────┐
│   mylist    │ ──► 阻塞等待
│    (空)     │     │
└─────────────┘     │
                    v
              ┌──────────────┐
              │ blockingkeys │  记录等待的 key
              │ mylist → c   │
              └──────────────┘
                    │
                    v (另一个客户端 LPUSH mylist X)
              ┌──────────────┐
              │ 解除阻塞      │  返回 X
              └──────────────┘
```

### 11.2.2 BLPOP 实现

```c
static void blpopCommand(redisClient *c) {
    blockingPopGenericCommand(c, REDIS_HEAD);
}

static void blockingPopGenericCommand(redisClient *c, int where) {
    robj *key;
    int j;

    // 检查所有 key
    for (j = 1; j < c->argc - 1; j++) {
        key = c->argv[j];
        robj *o = lookupKeyWrite(c->db, key);

        if (o != NULL && o->type == REDIS_LIST) {
            list *list = o->ptr;
            if (listLength(list) > 0) {
                // 列表非空，立即弹出
                popGenericCommand(c, where);
                return;
            }
        }
    }

    // 所有列表都为空，阻塞等待
    long timeout;
    if (getLongFromObjectOrReply(c, c->argv[j], &timeout, NULL) != REDIS_OK)
        return;

    if (timeout == 0) {
        // 超时为 0，不阻塞
        addReply(c, shared.nullmultibulk);
        return;
    }

    // 设置阻塞状态
    c->flags |= REDIS_BLOCKED;
    c->blockingkeys = zmalloc(sizeof(robj*) * (c->argc - 1));
    c->blockingkeysnum = c->argc - 1;

    for (j = 1; j < c->argc - 1; j++) {
        c->blockingkeys[j - 1] = c->argv[j];
        incrRefCount(c->argv[j]);

        // 记录到 db->blockingkeys
        dictEntry *de = dictFind(c->db->blockingkeys, c->argv[j]);
        if (de == NULL) {
            list *clients = listCreate();
            dictAdd(c->db->blockingkeys, c->argv[j], clients);
            incrRefCount(c->argv[j]);
        }
        list *clients = dictGetEntryVal(de);
        listAddNodeTail(clients, c);
    }

    c->blockingto = time(NULL) + timeout;
    server.blpop_blocked_clients++;
}
```

### 11.2.3 解除阻塞

当其他客户端向列表 PUSH 元素时，解除阻塞：

```c
static int handleClientsWaitingListPush(redisClient *c, robj *key, robj *ele) {
    dictEntry *de = dictFind(c->db->blockingkeys, key);

    if (de == NULL) return 0;

    list *clients = dictGetEntryVal(de);
    if (listLength(clients) == 0) return 0;

    // 取出第一个等待的客户端
    listNode *ln = listFirst(clients);
    redisClient *receiver = ln->value;

    // 从等待列表中移除
    listDelNode(clients, ln);

    // 弹出元素发送给等待的客户端
    addReplyMultiBulkLen(receiver, 2);
    addReplyBulk(receiver, key);
    addReplyBulk(receiver, ele);

    // 清除客户端阻塞状态
    unblockClientWaitingData(receiver);

    return 1;
}
```

## 11.3 LRANGE 实现

```c
static void lrangeCommand(redisClient *c) {
    robj *o;
    long start, end;

    if ((getLongFromObjectOrReply(c, c->argv[2], &start, NULL) != REDIS_OK) ||
        (getLongFromObjectOrReply(c, c->argv[3], &end, NULL) != REDIS_OK))
        return;

    if ((o = lookupKeyRead(c->db, c->argv[1])) == NULL ||
        checkType(c, o, REDIS_LIST))
        return;

    list *list = o->ptr;
    long llen = listLength(list);

    // 调整索引
    if (start < 0) start = llen + start;
    if (end < 0) end = llen + end;
    if (start < 0) start = 0;

    if (start > end || start >= llen) {
        addReply(c, shared.emptymultibulk);
        return;
    }

    if (end >= llen) end = llen - 1;
    long rangelen = end - start + 1;

    // 返回结果
    addReplyMultiBulkLen(c, rangelen);

    listNode *ln = listIndex(list, start);
    while (rangelen--) {
        addReplyBulk(c, ln->value);
        ln = ln->next;
    }
}
```

## 11.4 LINDEX/LLEN/LSET 实现

### 11.4.1 LINDEX

```c
static void lindexCommand(redisClient *c) {
    robj *o;
    long index;

    if ((getLongFromObjectOrReply(c, c->argv[2], &index, NULL) != REDIS_OK))
        return;

    if ((o = lookupKeyRead(c->db, c->argv[1])) == NULL ||
        checkType(c, o, REDIS_LIST))
        return;

    listNode *ln = listIndex(o->ptr, index);
    if (ln == NULL) {
        addReply(c, shared.nullbulk);
    } else {
        addReplyBulk(c, ln->value);
    }
}
```

### 11.4.2 LLEN

```c
static void llenCommand(redisClient *c) {
    robj *o = lookupKeyRead(c->db, c->argv[1]);

    if (o == NULL) {
        addReply(c, shared.czero);
        return;
    }

    if (checkType(c, o, REDIS_LIST)) return;

    addReplyLongLong(c, listLength(o->ptr));
}
```

### 11.4.3 LSET

```c
static void lsetCommand(redisClient *c) {
    robj *o;
    long index;

    if ((getLongFromObjectOrReply(c, c->argv[2], &index, NULL) != REDIS_OK))
        return;

    if ((o = lookupKeyWrite(c->db, c->argv[1])) == NULL ||
        checkType(c, o, REDIS_LIST))
        return;

    listNode *ln = listIndex(o->ptr, index);
    if (ln == NULL) {
        addReply(c, shared.outofrangeerr);
        return;
    }

    // 更新值
    decrRefCount(ln->value);
    ln->value = c->argv[3];
    incrRefCount(c->argv[3]);

    server.dirty++;
    addReply(c, shared.ok);
}
```

## 11.5 小结

本章分析了 Redis 列表命令的实现：

1. **LPUSH/RPUSH/LPOP/RPOP**：列表的基本操作
2. **BLPOP/BRPOP**：阻塞式弹出，是 Redis 的特色功能
3. **LRANGE**：范围查询
4. **LINDEX/LLEN/LSET**：索引访问、长度、更新

列表使用双向链表实现，头部和尾部操作都是 O(1)。下一章我们将学习集合命令。