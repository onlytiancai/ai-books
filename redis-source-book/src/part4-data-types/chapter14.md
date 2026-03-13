# 第14章：哈希命令

哈希（Hash）是 Redis 的数据类型之一，用于存储字段-值对。

## 14.1 HSET/HGET/HGETALL 实现

### 14.1.1 编码方式

Redis 哈希有两种编码：

- **REDIS_ENCODING_ZIPMAP**：小规模数据，紧凑存储
- **REDIS_ENCODING_HT**：大规模数据，使用字典

```c
#define REDIS_HASH_MAX_ZIPMAP_ENTRIES 64  // 最大元素数
#define REDIS_HASH_MAX_ZIPMAP_VALUE 512   // 最大值长度
```

### 14.1.2 HSET 命令

```c
static void hsetCommand(redisClient *c) {
    int update = 0;
    robj *o = lookupKeyWrite(c->db, c->argv[1]);

    if (o == NULL) {
        // 创建新哈希
        o = createHashObject();
        dictAdd(c->db->dict, c->argv[1], o);
        incrRefCount(c->argv[1]);
    } else {
        if (o->type != REDIS_HASH) {
            addReply(c, shared.wrongtypeerr);
            return;
        }
    }

    // 检查是否需要转换为字典编码
    hashTypeTryConversion(o, c->argv, 2, 3);

    // 设置字段值
    update = hashTypeSet(o, c->argv[2], c->argv[3]);

    server.dirty++;
    addReply(c, update ? shared.czero : shared.cone);
}

static int hashTypeSet(robj *o, robj *field, robj *value) {
    int update = 0;

    if (o->encoding == REDIS_ENCODING_ZIPMAP) {
        // zipmap 编码
        unsigned char *zm = o->ptr;
        zm = zipmapSet(zm, field->ptr, sdslen(field->ptr),
                       value->ptr, sdslen(value->ptr), &update);
        o->ptr = zm;

        // 检查是否需要转换为字典
        if (zipmapLen(zm) > server.hash_max_zipmap_entries)
            hashTypeConvert(o, REDIS_ENCODING_HT);
    } else {
        // 字典编码
        dictEntry *de = dictFind(o->ptr, field);
        if (de != NULL) {
            dictReplace(o->ptr, field, value);
            update = 1;
        } else {
            dictAdd(o->ptr, field, value);
        }
        incrRefCount(field);
        incrRefCount(value);
    }

    return update;
}
```

### 14.1.3 HGET 命令

```c
static void hgetCommand(redisClient *c) {
    robj *o = lookupKeyRead(c->db, c->argv[1]);

    if (o == NULL) {
        addReply(c, shared.nullbulk);
        return;
    }

    if (o->type != REDIS_HASH) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    robj *value = hashTypeGet(o, c->argv[2]);
    if (value == NULL) {
        addReply(c, shared.nullbulk);
    } else {
        addReplyBulk(c, value);
        decrRefCount(value);
    }
}

static robj *hashTypeGet(robj *o, robj *field) {
    if (o->encoding == REDIS_ENCODING_ZIPMAP) {
        unsigned char *zm = o->ptr;
        unsigned char *val;
        unsigned int vlen;

        if (zipmapGet(zm, field->ptr, sdslen(field->ptr), &val, &vlen)) {
            return createStringObject((char*)val, vlen);
        }
        return NULL;
    } else {
        dictEntry *de = dictFind(o->ptr, field);
        if (de == NULL) return NULL;
        return dictGetEntryVal(de);
    }
}
```

### 14.1.4 HGETALL 命令

```c
static void hgetallCommand(redisClient *c) {
    robj *o = lookupKeyRead(c->db, c->argv[1]);

    if (o == NULL) {
        addReply(c, shared.emptymultibulk);
        return;
    }

    if (o->type != REDIS_HASH) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    if (o->encoding == REDIS_ENCODING_ZIPMAP) {
        unsigned char *zm = o->ptr;
        unsigned char *p = zipmapRewind(zm);
        unsigned char *field, *val;
        unsigned int flen, vlen;
        int count = 0;

        // 先计算元素数量
        while ((p = zipmapNext(p, &field, &flen, &val, &vlen)) != NULL)
            count *= 2;

        addReplyMultiBulkLen(c, count * 2);
        p = zipmapRewind(zm);
        while ((p = zipmapNext(p, &field, &flen, &val, &vlen)) != NULL) {
            addReplyBulkCString(c, (char*)field);
            addReplyBulkCString(c, (char*)val);
        }
    } else {
        dict *dict = o->ptr;
        addReplyMultiBulkLen(c, dictSize(dict) * 2);

        dictIterator *di = dictGetIterator(dict);
        dictEntry *de;
        while ((de = dictNext(di)) != NULL) {
            addReplyBulk(c, dictGetEntryKey(de));
            addReplyBulk(c, dictGetEntryVal(de));
        }
        dictReleaseIterator(di);
    }
}
```

## 14.2 zipmap 编码优化

### 14.2.1 zipmap 结构

zipmap 是一种紧凑的哈希表实现，适合小规模数据：

```
zipmap 内存布局:
┌──────┬────────┬─────────┬────────┬─────────┬─────┬─────┐
│ len  │ field1 │ value1  │ field2 │ value2  │ ... │ end │
│ 1字节│ flen   │ vlen    │ flen   │ vlen    │     │0xFF │
└──────┴────────┴─────────┴────────┴─────────┴─────┴─────┘

每个 entry:
┌───────┬─────────┬───────┬─────────┬─────────┐
│ flen  │ field   │ vlen  │ value   │ free    │
│ 1字节 │ flen字节 │ 1字节 │ vlen字节│ 1字节   │
└───────┴─────────┴───────┴─────────┴─────────┘
```

### 14.2.2 zipmap 优势

| 特点 | 说明 |
|------|------|
| 内存紧凑 | 无指针开销 |
| 顺序存储 | 缓存友好 |
| 小数据高效 | 元素少时比字典更省内存 |

### 14.2.3 编码转换

```c
static void hashTypeTryConversion(robj *o, robj **argv, int start, int end) {
    if (o->encoding != REDIS_ENCODING_ZIPMAP) return;

    for (int i = start; i <= end; i++) {
        // 如果值太长，转换为字典
        if (sdslen(argv[i]->ptr) > server.hash_max_zipmap_value) {
            hashTypeConvert(o, REDIS_ENCODING_HT);
            break;
        }
    }
}

static void hashTypeConvert(robj *o, int enc) {
    if (o->encoding == REDIS_ENCODING_ZIPMAP && enc == REDIS_ENCODING_HT) {
        unsigned char *zm = o->ptr;
        dict *dict = dictCreate(&hashDictType, NULL);

        unsigned char *p = zipmapRewind(zm);
        unsigned char *field, *val;
        unsigned int flen, vlen;

        while ((p = zipmapNext(p, &field, &flen, &val, &vlen)) != NULL) {
            robj *key = createStringObject((char*)field, flen);
            robj *value = createStringObject((char*)val, vlen);
            dictAdd(dict, key, value);
        }

        zipmapFree(zm);
        o->ptr = dict;
        o->encoding = REDIS_ENCODING_HT;
    }
}
```

## 14.3 其他哈希命令

### 14.3.1 HMSET/HMGET

```c
static void hmsetCommand(redisClient *c) {
    int i, set;
    robj *o = lookupKeyWrite(c->db, c->argv[1]);

    if (o == NULL) {
        o = createHashObject();
        dictAdd(c->db->dict, c->argv[1], o);
        incrRefCount(c->argv[1]);
    } else if (o->type != REDIS_HASH) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    hashTypeTryConversion(o, c->argv, 2, c->argc - 1);

    for (i = 2; i < c->argc; i += 2) {
        hashTypeSet(o, c->argv[i], c->argv[i + 1]);
    }

    server.dirty++;
    addReply(c, shared.ok);
}
```

### 14.3.2 HDEL

```c
static void hdelCommand(redisClient *c) {
    robj *o = lookupKeyWrite(c->db, c->argv[1]);
    int deleted = 0, j;

    if (o == NULL || checkType(c, o, REDIS_HASH)) {
        addReply(c, shared.czero);
        return;
    }

    for (j = 2; j < c->argc; j++) {
        if (hashTypeDelete(o, c->argv[j])) {
            deleted++;
            if (hashTypeLength(o) == 0) {
                deleteKey(c->db, c->argv[1]);
                break;
            }
        }
    }

    if (deleted) server.dirty++;
    addReplyLongLong(c, deleted);
}
```

### 14.3.3 HEXISTS

```c
static void hexistsCommand(redisClient *c) {
    robj *o = lookupKeyRead(c->db, c->argv[1]);

    if (o == NULL) {
        addReply(c, shared.czero);
        return;
    }

    if (checkType(c, o, REDIS_HASH)) return;

    if (hashTypeExists(o, c->argv[2]))
        addReply(c, shared.cone);
    else
        addReply(c, shared.czero);
}
```

### 14.3.4 HLEN

```c
static void hlenCommand(redisClient *c) {
    robj *o = lookupKeyRead(c->db, c->argv[1]);

    if (o == NULL) {
        addReply(c, shared.czero);
        return;
    }

    if (checkType(c, o, REDIS_HASH)) return;

    addReplyLongLong(c, hashTypeLength(o));
}
```

### 14.3.5 HINCRBY

```c
static void hincrbyCommand(redisClient *c) {
    long long value, incr;
    robj *o, *current, *new;

    if (getLongLongFromObjectOrReply(c, c->argv[3], &incr, NULL) != REDIS_OK)
        return;

    o = lookupKeyWrite(c->db, c->argv[1]);
    if (o == NULL) {
        o = createHashObject();
        dictAdd(c->db->dict, c->argv[1], o);
        incrRefCount(c->argv[1]);
    } else if (checkType(c, o, REDIS_HASH)) {
        return;
    }

    current = hashTypeGet(o, c->argv[2]);
    if (current == NULL) {
        value = 0;
    } else {
        if (getLongLongFromObject(current, &value) != REDIS_OK) {
            addReplyError(c, "hash value is not an integer");
            return;
        }
    }

    value += incr;
    new = createStringObjectFromLongLong(value);
    hashTypeSet(o, c->argv[2], new);

    server.dirty++;
    addReplyLongLong(c, value);
}
```

## 14.4 时间复杂度分析

| 命令 | zipmap | HT | 说明 |
|------|--------|-----|------|
| HSET | O(N) | O(1) | N 为元素数 |
| HGET | O(N) | O(1) | N 为元素数 |
| HDEL | O(N) | O(1) | N 为元素数 |
| HGETALL | O(N) | O(N) | N 为元素数 |
| HLEN | O(1) | O(1) | 直接读取 |

## 14.5 小结

本章分析了 Redis 哈希命令的实现：

1. **双重编码**：zipmap 和 HT 两种编码方式
2. **自动转换**：根据数据规模自动选择编码
3. **基本操作**：HSET、HGET、HGETALL
4. **批量操作**：HMSET、HMGET
5. **其他命令**：HDEL、HEXISTS、HLEN、HINCRBY

至此，我们已经完成了所有数据类型的学习。下一部分将介绍 Redis 的高级特性。