# 第12章：集合命令

集合（Set）是 Redis 的数据类型之一，底层使用字典实现，具有唯一性和高效查找的特点。

## 12.1 SADD/SREM/SMEMBERS 实现

### 12.1.1 SADD 命令

```c
static void saddCommand(redisClient *c) {
    robj *set;
    int j, added = 0;

    set = lookupKeyWrite(c->db, c->argv[1]);

    if (set == NULL) {
        // 创建空集合
        set = createSetObject();
        dictAdd(c->db->dict, c->argv[1], set);
        incrRefCount(c->argv[1]);
    } else {
        if (set->type != REDIS_SET) {
            addReply(c, shared.wrongtypeerr);
            return;
        }
    }

    // 添加元素
    for (j = 2; j < c->argc; j++) {
        if (dictAdd(set->ptr, c->argv[j], NULL) == DICT_OK) {
            added++;
            incrRefCount(c->argv[j]);
        }
    }

    if (added) server.dirty++;
    addReplyLongLong(c, added);
}
```

### 12.1.2 SREM 命令

```c
static void sremCommand(redisClient *c) {
    robj *set;
    int j, deleted = 0;

    if ((set = lookupKeyWrite(c->db, c->argv[1])) == NULL ||
        checkType(c, set, REDIS_SET))
        return;

    for (j = 2; j < c->argc; j++) {
        if (dictDelete(set->ptr, c->argv[j]) == DICT_OK) {
            deleted++;
            if (dictSize(set->ptr) == 0) {
                // 集合为空，删除 key
                deleteKey(c->db, c->argv[1]);
                break;
            }
        }
    }

    if (deleted) server.dirty++;
    addReplyLongLong(c, deleted);
}
```

### 12.1.3 SMEMBERS 命令

```c
static void smembersCommand(redisClient *c) {
    robj *set;

    if ((set = lookupKeyRead(c->db, c->argv[1])) == NULL ||
        checkType(c, set, REDIS_SET))
        return;

    addReplyMultiBulkLen(c, dictSize(set->ptr));

    dictIterator *di = dictGetIterator(set->ptr);
    dictEntry *de;
    while ((de = dictNext(di)) != NULL) {
        addReplyBulk(c, dictGetEntryKey(de));
    }
    dictReleaseIterator(di);
}
```

## 12.2 集合运算

### 12.2.1 SINTER 交集

```c
static void sinterCommand(redisClient *c) {
    sinterGenericCommand(c, c->argv + 1, c->argc - 1, NULL);
}

static void sinterGenericCommand(redisClient *c, robj **setkeys, int setnum, robj *dstkey) {
    robj **sets = zmalloc(sizeof(robj*) * setnum);
    int j, cardinality = 0;

    // 获取所有集合
    for (j = 0; j < setnum; j++) {
        robj *setobj = lookupKeyRead(c->db, setkeys[j]);
        if (setobj == NULL) {
            // 任一集合不存在，结果为空
            zfree(sets);
            if (dstkey) {
                deleteKey(c->db, dstkey);
                addReply(c, shared.czero);
            } else {
                addReply(c, shared.emptymultibulk);
            }
            return;
        }
        if (setobj->type != REDIS_SET) {
            zfree(sets);
            addReply(c, shared.wrongtypeerr);
            return;
        }
        sets[j] = setobj;
    }

    // 选择最小的集合进行遍历
    int minsize = dictSize(sets[0]->ptr);
    int minindex = 0;
    for (j = 1; j < setnum; j++) {
        if (dictSize(sets[j]->ptr) < minsize) {
            minsize = dictSize(sets[j]->ptr);
            minindex = j;
        }
    }

    // 遍历最小集合，检查是否在其他集合中
    dictIterator *di = dictGetIterator(sets[minindex]->ptr);
    dictEntry *de;

    while ((de = dictNext(di)) != NULL) {
        robj *ele = dictGetEntryKey(de);
        int found = 1;

        for (j = 0; j < setnum; j++) {
            if (j == minindex) continue;
            if (dictFind(sets[j]->ptr, ele) == NULL) {
                found = 0;
                break;
            }
        }

        if (found) cardinality++;
    }
    dictReleaseIterator(di);

    // ... 输出结果
}
```

### 12.2.2 SUNION 并集

```c
static void sunionCommand(redisClient *c) {
    sunionGenericCommand(c, c->argv + 1, c->argc - 1, NULL);
}

static void sunionGenericCommand(redisClient *c, robj **setkeys, int setnum, robj *dstkey) {
    dict *dstset = dictCreate(&setDictType, NULL);
    robj *ele;

    for (j = 0; j < setnum; j++) {
        robj *setobj = lookupKeyRead(c->db, setkeys[j]);
        if (setobj == NULL) continue;

        if (setobj->type != REDIS_SET) {
            dictRelease(dstset);
            addReply(c, shared.wrongtypeerr);
            return;
        }

        // 将元素添加到结果集
        dictIterator *di = dictGetIterator(setobj->ptr);
        dictEntry *de;
        while ((de = dictNext(di)) != NULL) {
            ele = dictGetEntryKey(de);
            dictAdd(dstset, ele, NULL);
            incrRefCount(ele);
        }
        dictReleaseIterator(di);
    }

    // 输出结果
    // ...
}
```

### 12.2.3 SDIFF 差集

```c
static void sdiffCommand(redisClient *c) {
    sdiffGenericCommand(c, c->argv + 1, c->argc - 1, NULL);
}

static void sdiffGenericCommand(redisClient *c, robj **setkeys, int setnum, robj *dstkey) {
    robj **sets = zmalloc(sizeof(robj*) * setnum);

    // 获取所有集合
    // ...

    // 遍历第一个集合，检查是否在其他集合中
    dictIterator *di = dictGetIterator(sets[0]->ptr);
    dictEntry *de;

    while ((de = dictNext(di)) != NULL) {
        robj *ele = dictGetEntryKey(de);
        int found = 0;

        for (j = 1; j < setnum; j++) {
            if (dictFind(sets[j]->ptr, ele) != NULL) {
                found = 1;
                break;
            }
        }

        if (!found) {
            // 不在其他集合中，属于差集
            // ...
        }
    }
}
```

## 12.3 其他集合命令

### 12.3.1 SISMEMBER

```c
static void sismemberCommand(redisClient *c) {
    robj *set;

    if ((set = lookupKeyRead(c->db, c->argv[1])) == NULL) {
        addReply(c, shared.czero);
        return;
    }

    if (checkType(c, set, REDIS_SET)) return;

    if (dictFind(set->ptr, c->argv[2]))
        addReply(c, shared.cone);
    else
        addReply(c, shared.czero);
}
```

### 12.3.2 SCARD

```c
static void scardCommand(redisClient *c) {
    robj *set = lookupKeyRead(c->db, c->argv[1]);

    if (set == NULL) {
        addReply(c, shared.czero);
        return;
    }

    if (checkType(c, set, REDIS_SET)) return;

    addReplyLongLong(c, dictSize(set->ptr));
}
```

### 12.3.3 SRANDMEMBER

```c
static void srandmemberCommand(redisClient *c) {
    robj *set;

    if ((set = lookupKeyRead(c->db, c->argv[1])) == NULL ||
        checkType(c, set, REDIS_SET))
        return;

    // 随机获取一个元素
    dictEntry *de = dictGetRandomKey(set->ptr);
    if (de == NULL) {
        addReply(c, shared.nullbulk);
    } else {
        addReplyBulk(c, dictGetEntryKey(de));
    }
}
```

### 12.3.4 SPOP

```c
static void spopCommand(redisClient *c) {
    robj *set = lookupKeyWrite(c->db, c->argv[1]);

    if (set == NULL) {
        addReply(c, shared.nullbulk);
        return;
    }

    if (checkType(c, set, REDIS_SET)) return;

    // 随机获取并删除一个元素
    dictEntry *de = dictGetRandomKey(set->ptr);
    if (de == NULL) {
        addReply(c, shared.nullbulk);
    } else {
        robj *ele = dictGetEntryKey(de);
        addReplyBulk(c, ele);
        dictDelete(set->ptr, ele);

        if (dictSize(set->ptr) == 0) {
            deleteKey(c->db, c->argv[1]);
        }

        server.dirty++;
    }
}
```

## 12.4 时间复杂度分析

| 命令 | 时间复杂度 | 说明 |
|------|------------|------|
| SADD | O(N) | N 为添加元素数 |
| SREM | O(N) | N 为删除元素数 |
| SISMEMBER | O(1) | 哈希表查找 |
| SMEMBERS | O(N) | N 为集合大小 |
| SCARD | O(1) | 直接读取 dictSize |
| SINTER | O(N*M) | N 为最小集合大小，M 为集合数 |
| SUNION | O(N) | N 为所有集合总大小 |
| SDIFF | O(N) | N 为第一个集合大小 |

## 12.5 小结

本章分析了 Redis 集合命令的实现：

1. **基本操作**：SADD、SREM、SMEMBERS
2. **集合运算**：SINTER、SUNION、SDIFF
3. **其他命令**：SISMEMBER、SCARD、SRANDMEMBER、SPOP
4. **底层实现**：使用字典存储，O(1) 的查找效率

下一章我们将学习有序集合（ZSET）的实现。