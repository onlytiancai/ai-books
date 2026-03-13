# 第5章：字典 (dict)

字典（dict）是 Redis 最核心的数据结构，用于实现数据库键空间、哈希键等多种功能。它基于哈希表实现，支持高效的键值存储和查找。

## 5.1 哈希表结构设计

### 5.1.1 哈希表节点

```c
// dict.h:45-49
typedef struct dictEntry {
    void *key;              // 键
    void *val;              // 值
    struct dictEntry *next; // 下一个节点（链地址法解决冲突）
} dictEntry;
```

### 5.1.2 哈希表

```c
// dict.h:62-67
typedef struct dictht {
    dictEntry **table;      // 哈希表数组
    unsigned long size;     // 哈希表大小
    unsigned long sizemask; // 哈希表大小掩码，用于计算索引
    unsigned long used;     // 已有节点数量
} dictht;
```

### 5.1.3 字典结构

```c
// dict.h:69-75
typedef struct dict {
    dictType *type;     // 类型特定函数
    void *privdata;     // 私有数据
    dictht ht[2];       // 两个哈希表（用于 rehash）
    int rehashidx;      // rehash 索引，-1 表示未进行 rehash
    int iterators;      // 当前运行的迭代器数量
} dict;
```

### 5.1.4 类型特定函数

```c
// dict.h:51-58
typedef struct dictType {
    unsigned int (*hashFunction)(const void *key);
    void *(*keyDup)(void *privdata, const void *key);
    void *(*valDup)(void *privdata, const void *obj);
    int (*keyCompare)(void *privdata, const void *key1, const void *key2);
    void (*keyDestructor)(void *privdata, void *key);
    void (*valDestructor)(void *privdata, void *obj);
} dictType;
```

### 5.1.5 结构图示

```
dict 结构
┌───────────────────────────────────────────────────────┐
│ type │ privdata │ ht[0] │ ht[1] │ rehashidx │ iterators│
└──────┴──────────┴───│───┴───│───┴───────────┴──────────┘
                      │       │
                      v       v (通常为空，rehash 时使用)
              ┌─────────────┐
              │ dictht ht[0]│
              ├─────────────┤
              │ size = 4    │
              │ sizemask = 3│
              │ used = 3    │
              │ table ──────│───┐
              └─────────────┘   │
                                v
    table 数组：
    索引   0       1       2       3
         ┌───┐   ┌───┐   ┌───┐   ┌───┐
         │ * │──►│nil│   │ * │   │nil│
         └─│─┘   └───┘   └─│─┘   └───┘
           │               │
           v               v
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │key│val│next │ │key│val│next │ │key│val│next │
    │k1 │v1 │ nil │ │k2 │v2 │─────│──►│k3 │v3 │ nil│
    └─────────────┘ └─────────────┘ └─────────────┘
```

## 5.2 哈希函数

Redis 使用 MurmurHash 或 djb2 等算法计算哈希值：

### 5.2.1 通用哈希函数

```c
// dict.c:111-117
unsigned int dictGenHashFunction(const unsigned char *buf, int len) {
    unsigned int hash = 5381;

    while (len--)
        hash = ((hash << 5) + hash) + (*buf++); // hash * 33 + c

    return hash;
}
```

这是 Bernstein 的 djb2 算法变种，特点：

- 计算速度快
- 分布均匀
- 碰撞率低

### 5.2.2 整数哈希函数

```c
// dict.c:92-101 (Thomas Wang's 32 bit Mix Function)
unsigned int dictIntHashFunction(unsigned int key) {
    key += ~(key << 15);
    key ^=  (key >> 10);
    key +=  (key << 3);
    key ^=  (key >> 6);
    key += ~(key << 11);
    key ^=  (key >> 16);
    return key;
}
```

## 5.3 渐进式 rehash

当哈希表负载因子过高或过低时，需要对哈希表进行扩展或收缩。Redis 采用**渐进式 rehash**，将 rehash 分摊到多次操作中，避免一次性 rehash 造成服务暂停。

### 5.3.1 为什么需要渐进式 rehash？

传统哈希表 rehash：

```
一次性 rehash：
时间 ─────────────────────────────────────►
     │         rehash 期间暂停服务          │
     ├─────────────────────────────────────┤
              用户请求被阻塞
```

渐进式 rehash：

```
渐进式 rehash：
时间 ─────────────────────────────────────►
     │rehash│处理│rehash│处理│rehash│处理│
     ├──────┼────┼──────┼────┼──────┼────┤
           分摊到多次操作，不影响服务
```

### 5.3.2 rehash 过程

```
初始状态（ht[0] 满，需要扩容）：

ht[0]                    ht[1]
┌───────────────┐        ┌───────────────┐
│ size = 4      │        │ size = 0      │
│ used = 4      │        │ used = 0      │
│ [k1][k2][k3][k4]       │ []            │
└───────────────┘        └───────────────┘

步骤1：为 ht[1] 分配空间（size = 8）

ht[0]                    ht[1]
┌───────────────┐        ┌───────────────┐
│ size = 4      │        │ size = 8      │
│ used = 4      │        │ used = 0      │
│ [k1][k2][k3][k4]       │ [][][][][][][][]│
└───────────────┘        └───────────────┘
rehashidx = 0

步骤2：逐步迁移（每次操作迁移一个索引）

迁移索引 0 后：
ht[0]: [][k2][k3][k4]    ht[1]: [k1][][][][][][][]
rehashidx = 1

迁移索引 1 后：
ht[0]: [][][k3][k4]      ht[1]: [k1][k2][][][][][][]
rehashidx = 2

...

步骤3：迁移完成，释放 ht[0]，ht[1] 变为 ht[0]

ht[0] (原 ht[1])         ht[1]
┌───────────────┐        ┌───────────────┐
│ size = 8      │        │ size = 0      │
│ used = 4      │        │ used = 0      │
│ [k1][k2][k3][k4]...    │ []            │
└───────────────┘        └───────────────┘
rehashidx = -1
```

### 5.3.3 rehash 源码

```c
// dict.c:203-239
int dictRehash(dict *d, int n) {
    if (!dictIsRehashing(d)) return 0;

    while(n--) {
        dictEntry *de, *nextde;

        // 检查是否完成
        if (d->ht[0].used == 0) {
            zfree(d->ht[0].table);
            d->ht[0] = d->ht[1];
            _dictReset(&d->ht[1]);
            d->rehashidx = -1;
            return 0;
        }

        // 找到非空索引
        while(d->ht[0].table[d->rehashidx] == NULL)
            d->rehashidx++;

        de = d->ht[0].table[d->rehashidx];

        // 迁移该索引下所有节点
        while(de) {
            unsigned int h;

            nextde = de->next;

            // 计算在新表中的索引
            h = dictHashKey(d, de->key) & d->ht[1].sizemask;

            // 头插法插入新表
            de->next = d->ht[1].table[h];
            d->ht[1].table[h] = de;

            d->ht[0].used--;
            d->ht[1].used++;

            de = nextde;
        }

        d->ht[0].table[d->rehashidx] = NULL;
        d->rehashidx++;
    }
    return 1;
}
```

### 5.3.4 渐进式 rehash 触发

每次增删改查操作都会执行一步 rehash：

```c
// dict.c:268-270
static void _dictRehashStep(dict *d) {
    if (d->iterators == 0) dictRehash(d, 1);
}
```

在 `dictAdd`、`dictFind`、`dictDelete` 等函数中调用：

```c
// dict.c:279
if (dictIsRehashing(d)) _dictRehashStep(d);
```

### 5.3.5 扩容条件

```c
// dict.c:523-534
static int _dictExpandIfNeeded(dict *d) {
    if (dictIsRehashing(d)) return DICT_OK;

    // 初始化时扩容
    if (d->ht[0].size == 0)
        return dictExpand(d, DICT_HT_INITIAL_SIZE);

    // 负载因子 >= 1 且允许扩容，则扩容
    if (d->ht[0].used >= d->ht[0].size && dict_can_resize)
        return dictExpand(d, ((d->ht[0].size > d->ht[0].used) ?
                              d->ht[0].size : d->ht[0].used) * 2);

    return DICT_OK;
}
```

## 5.4 迭代器

### 5.4.1 迭代器结构

```c
// dict.h:77-82
typedef struct dictIterator {
    dict *d;            // 字典指针
    int table;          // 当前遍历的表（0 或 1）
    int index;          // 当前索引
    dictEntry *entry;   // 当前节点
    dictEntry *nextEntry; // 下一个节点
} dictIterator;
```

### 5.4.2 迭代器创建与遍历

```c
// dict.c:433-443
dictIterator *dictGetIterator(dict *d) {
    dictIterator *iter = zmalloc(sizeof(*iter));

    iter->d = d;
    iter->table = 0;
    iter->index = -1;
    iter->entry = NULL;
    iter->nextEntry = NULL;

    return iter;
}

// dict.c:445-473
dictEntry *dictNext(dictIterator *iter) {
    while (1) {
        if (iter->entry == NULL) {
            dictht *ht = &iter->d->ht[iter->table];

            // 首次调用时增加迭代器计数
            if (iter->index == -1 && iter->table == 0)
                iter->d->iterators++;

            iter->index++;

            // 当前表遍历完毕
            if (iter->index >= (signed)ht->size) {
                // 如果正在 rehash，继续遍历 ht[1]
                if (dictIsRehashing(iter->d) && iter->table == 0) {
                    iter->table++;
                    iter->index = 0;
                    ht = &iter->d->ht[1];
                } else {
                    break;
                }
            }

            iter->entry = ht->table[iter->index];
        } else {
            iter->entry = iter->nextEntry;
        }

        if (iter->entry) {
            iter->nextEntry = iter->entry->next;
            return iter->entry;
        }
    }
    return NULL;
}
```

## 5.5 源码分析：dict.c

### 5.5.1 创建字典

```c
// dict.c:132-139
dict *dictCreate(dictType *type, void *privDataPtr) {
    dict *d = zmalloc(sizeof(*d));

    _dictInit(d, type, privDataPtr);
    return d;
}

// dict.c:142-152
int _dictInit(dict *d, dictType *type, void *privDataPtr) {
    _dictReset(&d->ht[0]);
    _dictReset(&d->ht[1]);
    d->type = type;
    d->privdata = privDataPtr;
    d->rehashidx = -1;
    d->iterators = 0;
    return DICT_OK;
}
```

### 5.5.2 添加元素

```c
// dict.c:273-297
int dictAdd(dict *d, void *key, void *val) {
    int index;
    dictEntry *entry;
    dictht *ht;

    // 执行一步 rehash
    if (dictIsRehashing(d)) _dictRehashStep(d);

    // 获取索引，-1 表示 key 已存在
    if ((index = _dictKeyIndex(d, key)) == -1)
        return DICT_ERR;

    // 选择哈希表（rehash 中用 ht[1]）
    ht = dictIsRehashing(d) ? &d->ht[1] : &d->ht[0];

    // 创建节点，头插法
    entry = zmalloc(sizeof(*entry));
    entry->next = ht->table[index];
    ht->table[index] = entry;
    ht->used++;

    // 设置键值
    dictSetHashKey(d, entry, key);
    dictSetHashVal(d, entry, val);

    return DICT_OK;
}
```

### 5.5.3 查找元素

```c
// dict.c:405-424
dictEntry *dictFind(dict *d, const void *key) {
    dictEntry *he;
    unsigned int h, idx, table;

    if (d->ht[0].size == 0) return NULL;

    // 执行一步 rehash
    if (dictIsRehashing(d)) _dictRehashStep(d);

    h = dictHashKey(d, key);

    // 查找两个表
    for (table = 0; table <= 1; table++) {
        idx = h & d->ht[table].sizemask;
        he = d->ht[table].table[idx];

        while(he) {
            if (dictCompareHashKeys(d, key, he->key))
                return he;
            he = he->next;
        }

        // 如果不在 rehash，只需查找 ht[0]
        if (!dictIsRehashing(d)) break;
    }

    return NULL;
}
```

### 5.5.4 删除元素

```c
// dict.c:326-361
static int dictGenericDelete(dict *d, const void *key, int nofree) {
    unsigned int h, idx;
    dictEntry *he, *prevHe;
    int table;

    if (d->ht[0].size == 0) return DICT_ERR;

    if (dictIsRehashing(d)) _dictRehashStep(d);
    h = dictHashKey(d, key);

    for (table = 0; table <= 1; table++) {
        idx = h & d->ht[table].sizemask;
        he = d->ht[table].table[idx];
        prevHe = NULL;

        while(he) {
            if (dictCompareHashKeys(d, key, he->key)) {
                // 从链表中移除
                if (prevHe)
                    prevHe->next = he->next;
                else
                    d->ht[table].table[idx] = he->next;

                if (!nofree) {
                    dictFreeEntryKey(d, he);
                    dictFreeEntryVal(d, he);
                }

                zfree(he);
                d->ht[table].used--;
                return DICT_OK;
            }
            prevHe = he;
            he = he->next;
        }
        if (!dictIsRehashing(d)) break;
    }

    return DICT_ERR;
}
```

## 5.6 时间复杂度分析

| 操作 | 平均时间复杂度 | 最坏时间复杂度 |
|------|----------------|----------------|
| 添加 | O(1) | O(N) |
| 查找 | O(1) | O(N) |
| 删除 | O(1) | O(N) |
| 扩容 | O(N)（分摊） | - |

最坏情况发生在所有 key 哈希冲突，形成长链表。

## 5.7 Redis 中字典的使用场景

| 场景 | 说明 |
|------|------|
| 数据库键空间 | 存储所有 key-value |
| 哈希键 | 当元素较多时作为底层实现 |
| 过期字典 | 存储 key 的过期时间 |
| 阻塞字典 | BLPOP 等阻塞命令 |
| 发布订阅 | 存储频道与订阅者映射 |

## 5.8 小结

本章详细分析了 Redis 的字典（dict）实现：

1. **结构设计**：双哈希表支持渐进式 rehash
2. **哈希函数**：djb2 算法，分布均匀
3. **渐进式 rehash**：分摊迁移开销，避免阻塞
4. **迭代器**：安全遍历正在 rehash 的字典

字典是 Redis 最核心的数据结构，几乎所有功能都依赖它。下一章我们将学习 Redis 的对象系统。