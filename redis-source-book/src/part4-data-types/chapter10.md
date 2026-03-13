# 第10章：字符串命令

字符串是 Redis 最基础的数据类型，本章将分析字符串命令的实现原理。

## 10.1 SET/GET 实现

### 10.1.1 SET 命令

```c
// redis.c
static void setCommand(redisClient *c) {
    robj *key = c->argv[1];
    robj *val = c->argv[2];

    // 设置键值
    setKey(c->db, key, val);

    // 更新 dirty 计数（用于触发保存）
    server.dirty++;

    addReply(c, shared.ok);
}

static void setKey(redisDb *db, robj *key, robj *val) {
    // 添加或替换键值对
    if (dictAdd(db->dict, key, val) == DICT_ERR) {
        dictReplace(db->dict, key, val);
    }
    incrRefCount(val);  // 增加引用计数

    // 移除过期时间
    removeExpire(db, key);
}
```

### 10.1.2 GET 命令

```c
// redis.c
static void getCommand(redisClient *c) {
    robj *o;

    // 查找 key
    if ((o = lookupKeyRead(c->db, c->argv[1])) == NULL) {
        addReply(c, shared.nullbulk);
        return;
    }

    // 类型检查
    if (o->type != REDIS_STRING) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    // 返回值
    addReplyBulk(c, o);
}
```

## 10.2 编码转换

字符串对象有两种编码方式：

### 10.2.1 INT 编码

当字符串可以表示为整数时，使用 INT 编码：

```c
// redis.c
static robj *createStringObjectFromLongLong(long long value) {
    robj *o;

    // 在共享范围内，使用共享对象
    if (value >= 0 && value < REDIS_SHARED_INTEGERS) {
        incrRefCount(shared.integers[value]);
        o = shared.integers[value];
    } else {
        // 创建新的整数对象
        if (value >= LONG_MIN && value <= LONG_MAX) {
            o = createObject(REDIS_STRING, NULL);
            o->encoding = REDIS_ENCODING_INT;
            o->ptr = (void*)((long)value);
        } else {
            // 超出 long 范围，使用 SDS
            o = createObject(REDIS_STRING, sdsfromlonglong(value));
        }
    }
    return o;
}
```

### 10.2.2 编码转换图示

```
SET num 100

┌─────────────────────────────────────┐
│ value = "100"                       │
│                                     │
│ 检查是否可表示为整数                  │
│         │                           │
│         v                           │
│ isStringRepresentableAsLong()       │
│         │                           │
│         v                           │
│ ┌───────────────────────────────┐   │
│ │ 编码: REDIS_ENCODING_INT      │   │
│ │ ptr = (void*)100L             │   │
│ │ (无需分配 SDS)                │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘

SET msg "hello"

┌─────────────────────────────────────┐
│ value = "hello"                     │
│                                     │
│ 检查是否可表示为整数                  │
│         │                           │
│         v                           │
│ 不是整数                            │
│         │                           │
│         v                           │
│ ┌───────────────────────────────┐   │
│ │ 编码: REDIS_ENCODING_RAW      │   │
│ │ ptr ──► sds "hello"           │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 10.3 INCR/DECR 实现

### 10.3.1 INCR 命令

```c
// redis.c
static void incrCommand(redisClient *c) {
    incrDecrCommand(c, 1);
}

static void decrCommand(redisClient *c) {
    incrDecrCommand(c, -1);
}

static void incrDecrCommand(redisClient *c, long long incr) {
    robj *o;
    long long value;

    // 获取当前值
    o = lookupKeyWrite(c->db, c->argv[1]);
    if (o == NULL) {
        // key 不存在，从 0 开始
        o = createStringObjectFromLongLong(0);
        setKey(c->db, c->argv[1], o);
    } else {
        // 类型检查
        if (o->type != REDIS_STRING) {
            addReply(c, shared.wrongtypeerr);
            return;
        }

        // 获取整数值
        if (getLongLongFromObject(o, &value) != REDIS_OK) {
            addReplyError(c, "value is not an integer or out of range");
            return;
        }
    }

    // 检查溢出
    value += incr;
    if (o->encoding == REDIS_ENCODING_INT && value < 0) {
        // 负数可能需要转换为 RAW 编码
        // ...
    }

    // 更新值
    o = createStringObjectFromLongLong(value);
    setKey(c->db, c->argv[1], o);
    server.dirty++;

    addReplyLongLong(c, value);
}
```

### 10.3.2 INCRBY/DECRBY

```c
static void incrbyCommand(redisClient *c) {
    long long incr;

    if (getLongLongFromObject(c->argv[2], &incr) != REDIS_OK) {
        addReplyError(c, "value is not an integer or out of range");
        return;
    }
    incrDecrCommand(c, incr);
}

static void decrbyCommand(redisClient *c) {
    long long incr;

    if (getLongLongFromObject(c->argv[2], &incr) != REDIS_OK) {
        addReplyError(c, "value is not an integer or out of range");
        return;
    }
    incrDecrCommand(c, -incr);
}
```

## 10.4 APPEND/STRLEN 实现

### 10.4.1 APPEND 命令

```c
static void appendCommand(redisClient *c) {
    size_t totlen;
    robj *o;

    o = lookupKeyWrite(c->db, c->argv[1]);
    if (o == NULL) {
        // key 不存在，相当于 SET
        setKey(c->db, c->argv[1], c->argv[2]);
        totlen = stringObjectLen(c->argv[2]);
    } else {
        // 类型检查
        if (o->type != REDIS_STRING) {
            addReply(c, shared.wrongtypeerr);
            return;
        }

        // 追加内容
        o = getDecodedObject(o);  // 确保是 RAW 编码
        o->ptr = sdscatlen(o->ptr, c->argv[2]->ptr, sdslen(c->argv[2]->ptr));
        totlen = sdslen(o->ptr);

        decrRefCount(o);
        server.dirty++;
    }

    addReplyLongLong(c, totlen);
}
```

### 10.4.2 STRLEN 命令

```c
static void strlenCommand(redisClient *c) {
    robj *o;

    if ((o = lookupKeyRead(c->db, c->argv[1])) == NULL) {
        addReplyLongLong(c, 0);
        return;
    }

    if (o->type != REDIS_STRING) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    addReplyLongLong(c, stringObjectLen(o));
}

static size_t stringObjectLen(robj *o) {
    if (o->encoding == REDIS_ENCODING_INT) {
        char buf[32];
        return ll2string(buf, 32, (long)o->ptr);
    } else {
        return sdslen(o->ptr);
    }
}
```

## 10.5 GETRANGE/SETRANGE 实现

### 10.5.1 GETRANGE 命令

```c
static void getrangeCommand(redisClient *c) {
    robj *o;
    long start, end;

    // 获取参数
    if ((getLongFromObjectOrReply(c, c->argv[2], &start, NULL) != REDIS_OK) ||
        (getLongFromObjectOrReply(c, c->argv[3], &end, NULL) != REDIS_OK))
        return;

    if ((o = lookupKeyRead(c->db, c->argv[1])) == NULL) {
        addReply(c, shared.emptybulk);
        return;
    }

    if (o->type != REDIS_STRING) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    // 获取字符串内容
    o = getDecodedObject(o);

    // 调整范围
    if (start < 0) start = sdslen(o->ptr) + start;
    if (end < 0) end = sdslen(o->ptr) + end;
    if (start < 0) start = 0;
    if (end < 0 || start > end || (size_t)start >= sdslen(o->ptr)) {
        addReply(c, shared.emptybulk);
        decrRefCount(o);
        return;
    }
    if ((size_t)end >= sdslen(o->ptr)) end = sdslen(o->ptr) - 1;

    // 返回子串
    addReplySds(c, sdscatprintf(sdsempty(), "$%lu\r\n", end - start + 1));
    addReplySds(c, sdsnewlen((char*)o->ptr + start, end - start + 1));
    addReply(c, shared.crlf);

    decrRefCount(o);
}
```

### 10.5.2 SETRANGE 命令

```c
static void setrangeCommand(redisClient *c) {
    robj *o;
    long offset;

    if ((getLongFromObjectOrReply(c, c->argv[2], &offset, NULL) != REDIS_OK))
        return;

    if (offset < 0) {
        addReplyError(c, "offset is out of range");
        return;
    }

    o = lookupKeyWrite(c->db, c->argv[1]);
    if (o == NULL) {
        // key 不存在，创建空字符串
        o = createObject(REDIS_STRING, sdsempty());
        setKey(c->db, c->argv[1], o);
    } else {
        if (o->type != REDIS_STRING) {
            addReply(c, shared.wrongtypeerr);
            return;
        }
        o = getDecodedObject(o);
    }

    // 扩展字符串
    size_t len = sdslen(o->ptr);
    size_t newlen = offset + sdslen(c->argv[3]->ptr);
    if (newlen > len) {
        o->ptr = sdsgrowzero(o->ptr, newlen);
    }

    // 写入数据
    memcpy((char*)o->ptr + offset, c->argv[3]->ptr, sdslen(c->argv[3]->ptr));

    server.dirty++;
    addReplyLongLong(c, sdslen(o->ptr));
}
```

## 10.6 MSET/MGET 批量操作

### 10.6.1 MSET 命令

```c
static void msetCommand(redisClient *c) {
    int j;

    for (j = 1; j < c->argc; j += 2) {
        setKey(c->db, c->argv[j], c->argv[j + 1]);
    }

    server.dirty += (c->argc - 1) / 2;
    addReply(c, shared.ok);
}
```

### 10.6.2 MGET 命令

```c
static void mgetCommand(redisClient *c) {
    int j;

    addReplySds(c, sdscatprintf(sdsempty(), "*%d\r\n", c->argc - 1));

    for (j = 1; j < c->argc; j++) {
        robj *o = lookupKeyRead(c->db, c->argv[j]);

        if (o == NULL) {
            addReply(c, shared.nullbulk);
        } else {
            if (o->type != REDIS_STRING) {
                addReply(c, shared.nullbulk);
            } else {
                addReplyBulk(c, o);
            }
        }
    }
}
```

## 10.7 源码追踪：完整 SET 流程

让我们追踪 `SET mykey myvalue` 的完整执行流程：

```
1. 客户端发送命令
   "SET mykey myvalue\r\n"

2. 服务器读取命令 (readQueryFromClient)
   └─► 解析协议

3. 命令处理 (processCommand)
   └─► 查找命令表 → setCommand
   └─► 执行 setCommand(c)

4. setCommand 执行
   ┌────────────────────────────────────────┐
   │ key = c->argv[1] = "mykey"             │
   │ val = c->argv[2] = "myvalue"           │
   │                                        │
   │ setKey(db, key, val)                   │
   │   └─► dictAdd(db->dict, key, val)      │
   │   └─► incrRefCount(val)                │
   │                                        │
   │ server.dirty++                         │
   │ addReply(c, shared.ok)                 │
   └────────────────────────────────────────┘

5. 返回响应
   "+OK\r\n"
```

## 10.8 小结

本章分析了 Redis 字符串命令的实现：

1. **SET/GET**：基本的键值存取
2. **编码转换**：INT 和 RAW 编码的自动转换
3. **数值操作**：INCR/DECR 等原子递增操作
4. **字符串操作**：APPEND、STRLEN、GETRANGE、SETRANGE
5. **批量操作**：MSET/MGET 提高效率

下一章我们将学习列表命令的实现。