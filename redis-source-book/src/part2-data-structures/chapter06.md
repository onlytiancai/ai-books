# 第6章：Redis 对象系统

Redis 使用对象系统将不同类型的数据统一封装，通过 `redisObject` 结构实现对数据的抽象管理。

## 6.1 redisObject 结构

`redisObject` 是 Redis 对象系统的核心结构，定义在 `redis.c:257-271`：

```c
typedef struct redisObject {
    void *ptr;              // 指向实际数据的指针
    unsigned char type;     // 类型
    unsigned char encoding; // 编码方式
    unsigned char storage;  // 存储位置（VM 相关）
    unsigned char vtype;    // 值类型（VM 相关）
    int refcount;           // 引用计数
    struct redisObjectVM vm; // VM 信息
} robj;
```

### 结构图示

```
redisObject
┌─────────────────────────────────────────────────────┐
│ ptr ──────────────────────────────────────┐         │
│ type: REDIS_STRING (0)                    │         │
│ encoding: REDIS_ENCODING_RAW (0)          │         │
│ storage: REDIS_VM_MEMORY (0)              │         │
│ refcount: 1                               │         │
│ vm: {...}                                 │         │
└───────────────────────────────────────────│─────────┘
                                            │
                                            v
                                    ┌───────────────┐
                                    │   sdshdr      │
                                    │ len=5 free=0  │
                                    │ "Hello"       │
                                    └───────────────┘
```

## 6.2 类型与编码

### 6.2.1 对象类型

```c
// redis.c:118-122
#define REDIS_STRING 0
#define REDIS_LIST 1
#define REDIS_SET 2
#define REDIS_ZSET 3
#define REDIS_HASH 4
```

### 6.2.2 编码方式

```c
// redis.c:127-130
#define REDIS_ENCODING_RAW 0     // 原始 SDS
#define REDIS_ENCODING_INT 1     // 整数编码
#define REDIS_ENCODING_ZIPMAP 2  // zipmap 编码
#define REDIS_ENCODING_HT 3      // 哈希表编码
```

### 6.2.3 类型与编码对应关系

```
┌─────────────┬─────────────────────────────────────────────┐
│    类型      │                   编码                      │
├─────────────┼─────────────────────────────────────────────┤
│   STRING    │  INT: 整数值（long）                         │
│             │  RAW: SDS 字符串                             │
├─────────────┼─────────────────────────────────────────────┤
│    LIST     │  双向链表 (adlist)                           │
├─────────────┼─────────────────────────────────────────────┤
│    SET      │  哈希表 (dict)                               │
├─────────────┼─────────────────────────────────────────────┤
│    ZSET     │  跳表 + 哈希表                               │
├─────────────┼─────────────────────────────────────────────┤
│    HASH     │  ZIPMAP: 小规模                              │
│             │  HT: 哈希表 (dict)                           │
└─────────────┴─────────────────────────────────────────────┘
```

### 6.2.4 编码名称

```c
// redis.c:132-134
static char* strencoding[] = {
    "raw", "int", "zipmap", "hashtable"
};
```

使用 `OBJECT ENCODING` 命令查看编码：

```
redis> SET msg "hello"
OK
redis> OBJECT ENCODING msg
"raw"

redis> SET num 100
OK
redis> OBJECT ENCODING num
"int"
```

## 6.3 引用计数

Redis 使用引用计数管理对象的生命周期，避免内存泄漏。

### 6.3.1 引用计数操作

```c
// 增加引用计数
static void incrRefCount(robj *o) {
    o->refcount++;
}

// 减少引用计数，为 0 时释放
static void decrRefCount(void *o) {
    robj *obj = o;

    if (obj->refcount <= 0) redisPanic("decrRefCount against refcount <= 0");
    if (--obj->refcount == 0) {
        switch(obj->type) {
        case REDIS_STRING: freeStringObject(obj); break;
        case REDIS_LIST: freeListObject(obj); break;
        case REDIS_SET: freeSetObject(obj); break;
        case REDIS_ZSET: freeZsetObject(obj); break;
        case REDIS_HASH: freeHashObject(obj); break;
        default: redisPanic("Unknown object type"); break;
        }
        zfree(o);
    }
}
```

### 6.3.2 引用计数流程

```
创建对象：
    robj *obj = createObject(REDIS_STRING, sdsnew("hello"));
    obj->refcount = 1

共享对象：
    incrRefCount(obj);
    obj->refcount = 2

释放引用：
    decrRefCount(obj);
    obj->refcount = 1

最后释放：
    decrRefCount(obj);
    obj->refcount = 0 → 释放内存
```

## 6.4 对象共享

Redis 会共享一些常用对象，减少内存分配和垃圾回收开销。

### 6.4.1 共享整数

```c
// redis.c:516
#define REDIS_SHARED_INTEGERS 10000

struct sharedObjectsStruct {
    robj *crlf, *ok, *err, *emptybulk, *czero, *cone, *pong, *space,
    *colon, *nullbulk, *nullmultibulk, *queued,
    // ... 其他共享对象
    *integers[REDIS_SHARED_INTEGERS];  // 0-9999 的整数
} shared;
```

### 6.4.2 共享对象初始化

```c
static void createSharedObjects(void) {
    int j;

    shared.crlf = createObject(REDIS_STRING,sdsnew("\r\n"));
    shared.ok = createObject(REDIS_STRING,sdsnew("+OK\r\n"));
    shared.err = createObject(REDIS_STRING,sdsnew("-ERR\r\n"));
    shared.emptybulk = createObject(REDIS_STRING,sdsnew("$0\r\n\r\n"));
    shared.czero = createObject(REDIS_STRING,sdsnew(":0\r\n"));
    shared.cone = createObject(REDIS_STRING,sdsnew(":1\r\n"));
    // ...

    // 创建 0-9999 的共享整数
    for (j = 0; j < REDIS_SHARED_INTEGERS; j++) {
        shared.integers[j] = createObject(REDIS_STRING,(void*)(long)j);
        shared.integers[j]->encoding = REDIS_ENCODING_INT;
    }
}
```

### 6.4.3 使用共享对象

当设置整数值时，Redis 会优先使用共享对象：

```c
robj *createStringObjectFromLongLong(long long value) {
    robj *o;

    // 在共享范围内，使用共享对象
    if (value >= 0 && value < REDIS_SHARED_INTEGERS) {
        incrRefCount(shared.integers[value]);
        o = shared.integers[value];
    } else {
        // 超出范围，创建新对象
        if (value >= LONG_MIN && value <= LONG_MAX) {
            o = createObject(REDIS_STRING, NULL);
            o->encoding = REDIS_ENCODING_INT;
            o->ptr = (void*)((long)value);
        } else {
            o = createObject(REDIS_STRING,sdsfromlonglong(value));
        }
    }
    return o;
}
```

## 6.5 内存回收

### 6.5.1 创建对象

```c
// redis.c
static robj *createObject(int type, void *ptr) {
    robj *o;

    if (server.vm_enabled) {
        // VM 启用时分配更多空间
        o = zmalloc(sizeof(*o));
    } else {
        // VM 未启用，分配更小的空间
        o = zmalloc(sizeof(*o) - sizeof(struct redisObjectVM));
    }

    o->type = type;
    o->encoding = REDIS_ENCODING_RAW;
    o->ptr = ptr;
    o->refcount = 1;

    if (server.vm_enabled) {
        o->vm.atime = server.unixtime;
        o->storage = REDIS_VM_MEMORY;
    }

    return o;
}
```

### 6.5.2 释放字符串对象

```c
static void freeStringObject(robj *o) {
    if (o->encoding == REDIS_ENCODING_RAW) {
        sdsfree(o->ptr);  // 释放 SDS
    }
    // INT 编码不需要释放 ptr，因为它存储的是整数本身
}
```

### 6.5.3 释放列表对象

```c
static void freeListObject(robj *o) {
    listRelease((list*)o->ptr);
}
```

### 6.5.4 释放集合对象

```c
static void freeSetObject(robj *o) {
    dictRelease((dict*)o->ptr);
}
```

### 6.5.5 释放有序集合对象

```c
static void freeZsetObject(robj *o) {
    zset *zs = o->ptr;
    dictRelease(zs->dict);
    zslFree(zs->zsl);
    zfree(zs);
}
```

### 6.5.6 释放哈希对象

```c
static void freeHashObject(robj *o) {
    switch (o->encoding) {
    case REDIS_ENCODING_HT:
        dictRelease((dict*)o->ptr);
        break;
    case REDIS_ENCODING_ZIPMAP:
        zfree((unsigned char*)o->ptr);
        break;
    default:
        redisPanic("Unknown hash encoding type");
        break;
    }
}
```

## 6.6 对象编码转换

Redis 会根据实际情况自动转换对象的编码，以优化内存使用或性能。

### 6.6.1 字符串编码转换

```c
// redis.c
static robj *tryObjectEncoding(robj *o) {
    long value;
    sds s = o->ptr;

    // 检查是否可以编码为整数
    if (isStringRepresentableAsLong(s,&value)) {
        // 在共享范围内，使用共享对象
        if (value >= 0 && value < REDIS_SHARED_INTEGERS) {
            decrRefCount(o);
            incrRefCount(shared.integers[value]);
            return shared.integers[value];
        } else {
            // 转换为 INT 编码
            if (o->encoding == REDIS_ENCODING_RAW) sdsfree(s);
            o->encoding = REDIS_ENCODING_INT;
            o->ptr = (void*) value;
            return o;
        }
    }

    // 如果字符串过长，不尝试进一步优化
    if (sdslen(s) > 32) return o;

    // 尝试压缩
    // ...

    return o;
}
```

### 6.6.2 哈希编码转换

```c
// 当元素数量或值大小超过阈值时，转换为哈希表
#define REDIS_HASH_MAX_ZIPMAP_ENTRIES 64
#define REDIS_HASH_MAX_ZIPMAP_VALUE 512

static void convertToRealHash(robj *o) {
    // zipmap → dict
}
```

## 6.7 类型检查与多态

Redis 命令在执行前会检查对象类型：

```c
static void getCommand(redisClient *c) {
    robj *o;

    // 查找 key
    o = lookupKeyRead(c->db, c->argv[1]);
    if (o == NULL) {
        addReply(c, shared.nullbulk);
        return;
    }

    // 类型检查
    if (o->type != REDIS_STRING) {
        addReply(c, shared.wrongtypeerr);
        return;
    }

    // 执行命令
    // ...
}
```

### 类型检查流程

```
命令请求
    │
    v
┌────────────────┐
│ 查找 key       │
└───────┬────────┘
        │
        v
┌────────────────┐    key 不存在
│ key 存在？     │────────────────► 返回空
└───────┬────────┘
        │ 存在
        v
┌────────────────┐    类型不匹配
│ 类型检查       │────────────────► 返回错误
└───────┬────────┘
        │ 匹配
        v
┌────────────────┐
│ 执行命令       │
└────────────────┘
```

## 6.8 对象空转时间

对象的 `lru` 字段记录最后访问时间（Redis 2.0.0 中使用 VM 的 atime 字段）：

```c
// 获取对象空转时间
unsigned long long estimateObjectIdleTime(robj *o) {
    if (server.lruclock >= o->lru) {
        return (server.lruclock - o->lru) * LRU_CLOCK_RESOLUTION;
    } else {
        return ((LRU_CLOCK_MAX - o->lru) + server.lruclock) * LRU_CLOCK_RESOLUTION;
    }
}
```

## 6.9 小结

本章介绍了 Redis 的对象系统：

1. **redisObject**：统一封装所有类型的数据
2. **类型与编码**：支持多种编码方式，根据情况自动转换
3. **引用计数**：自动管理内存生命周期
4. **对象共享**：共享常用对象，减少内存分配
5. **类型检查**：命令执行前检查对象类型

对象系统是 Redis 数据类型的基础。接下来，我们将深入分析 Redis 的核心机制，从事件驱动开始。