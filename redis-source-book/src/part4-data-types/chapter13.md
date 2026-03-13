# 第13章：有序集合 (ZSET)

有序集合（ZSET）是 Redis 最复杂的数据类型之一，结合了哈希表和跳表的特性。

## 13.1 跳表 (skiplist) 实现

跳表是有序集合的核心数据结构，提供 O(logN) 的查找效率。

### 13.1.1 跳表结构

```c
// redis.c:495-507
typedef struct zskiplistNode {
    struct zskiplistNode **forward;  // 前进指针数组
    struct zskiplistNode *backward;  // 后退指针
    unsigned int *span;              // 跨度数组
    double score;                    // 分值
    robj *obj;                       // 成员对象
} zskiplistNode;

typedef struct zskiplist {
    struct zskiplistNode *header, *tail;  // 头尾节点
    unsigned long length;                  // 节点数量
    int level;                             // 最大层数
} zskiplist;
```

### 13.1.2 跳表原理图

```
层数
 3 ──► [HEAD] ───────────────────────────► [score=90] ──► NULL
                │                            │
 2 ──► [HEAD] ──┼───────► [score=30] ───────┼──► [score=50] ──► NULL
                │           │                │        │
 1 ──► [HEAD] ──┼───────► [score=30] ───────┼──► [score=50] ──► [score=70] ──► NULL
                │           │                │        │             │
 0 ──► [HEAD] ──┼──► [10] ─┼──► [30] ───────┼──► [50] ──────► [70] ──► [90] ──► NULL
              (哨兵)      (数据节点)

查找 score=50:
1. 从最高层开始，50 > 30，前进到 30
2. 下一层，50 < 70，下降一层
3. 下一层，50 == 50，找到！
```

### 13.1.3 跳表插入

```c
// redis.c
static void zslInsert(zskiplist *zsl, double score, robj *obj) {
    zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
    unsigned int rank[ZSKIPLIST_MAXLEVEL];
    int i, level;

    x = zsl->header;
    // 从最高层向下查找插入位置
    for (i = zsl->level - 1; i >= 0; i--) {
        rank[i] = i == zsl->level - 1 ? 0 : rank[i + 1];
        while (x->forward[i] &&
               (x->forward[i]->score < score ||
                (x->forward[i]->score == score &&
                 compareStringObjects(x->forward[i]->obj, obj) < 0))) {
            rank[i] += x->span[i];
            x = x->forward[i];
        }
        update[i] = x;  // 记录每层的前驱节点
    }

    // 随机生成层数
    level = zslRandomLevel();
    if (level > zsl->level) {
        for (i = zsl->level; i < level; i++) {
            rank[i] = 0;
            update[i] = zsl->header;
            update[i]->span[i] = zsl->length;
        }
        zsl->level = level;
    }

    // 创建新节点
    x = zslCreateNode(level, score, obj);
    for (i = 0; i < level; i++) {
        x->forward[i] = update[i]->forward[i];
        update[i]->forward[i] = x;
        x->span[i] = update[i]->span[i] - (rank[0] - rank[i]);
        update[i]->span[i] = (rank[0] - rank[i]) + 1;
    }

    for (i = level; i < zsl->level; i++) {
        update[i]->span[i]++;
    }

    x->backward = (update[0] == zsl->header) ? NULL : update[0];
    if (x->forward[0])
        x->forward[0]->backward = x;
    else
        zsl->tail = x;

    zsl->length++;
}
```

### 13.1.4 随机层数

```c
#define ZSKIPLIST_MAXLEVEL 32
#define ZSKIPLIST_P 0.25

static int zslRandomLevel(void) {
    int level = 1;
    while ((random() & 0xFFFF) < (ZSKIPLIST_P * 0xFFFF))
        level += 1;
    return (level < ZSKIPLIST_MAXLEVEL) ? level : ZSKIPLIST_MAXLEVEL;
}
```

## 13.2 ZSET 结构

```c
// redis.c:509-512
typedef struct zset {
    dict *dict;        // 字典：成员 -> 分值
    zskiplist *zsl;    // 跳表：按分值排序
} zset;
```

### 13.2.1 双重索引

```
ZSET 结构:
┌───────────────────────────────────────────────────────┐
│                       zset                            │
├──────────────────────────┬────────────────────────────┤
│        dict              │        zskiplist           │
│   (成员 → 分值)          │    (按分值排序)            │
├──────────────────────────┼────────────────────────────┤
│  "apple"  →  10         │  HEAD ──► 10 ──► 30 ──► 50 │
│  "banana" →  30         │           ↑      ↑      ↑  │
│  "cherry" →  50         │         apple  banana cherry│
└──────────────────────────┴────────────────────────────┘

优点:
- dict 提供 O(1) 成员查找
- zskiplist 提供范围查询
```

## 13.3 ZADD/ZRANGE/ZRANK 实现

### 13.3.1 ZADD 命令

```c
static void zaddCommand(redisClient *c) {
    double score;
    robj *ele;
    zset *zs;

    // 解析分值
    if (getDoubleFromObjectOrReply(c, c->argv[2], &score, NULL) != REDIS_OK)
        return;

    ele = c->argv[3];

    // 查找或创建 ZSET
    robj *zobj = lookupKeyWrite(c->db, c->argv[1]);
    if (zobj == NULL) {
        zobj = createZsetObject();
        dictAdd(c->db->dict, c->argv[1], zobj);
        incrRefCount(c->argv[1]);
    } else {
        if (checkType(c, zobj, REDIS_ZSET)) return;
    }

    zs = zobj->ptr;

    // 检查成员是否存在
    dictEntry *de = dictFind(zs->dict, ele);
    if (de == NULL) {
        // 新成员，添加
        zslInsert(zs->zsl, score, ele);
        dictAdd(zs->dict, ele, NULL);
        incrRefCount(ele);
        server.dirty++;
        addReply(c, shared.cone);
    } else {
        // 成员存在，更新分值
        // ... 需要先删除再插入
    }
}
```

### 13.3.2 ZRANGE 命令

```c
static void zrangeCommand(redisClient *c) {
    zrangeGenericCommand(c, 0);
}

static void zrangeGenericCommand(redisClient *c, int reverse) {
    robj *o;
    long start, end;
    int withscores = 0;

    // 解析参数
    if ((getLongFromObjectOrReply(c, c->argv[2], &start, NULL) != REDIS_OK) ||
        (getLongFromObjectOrReply(c, c->argv[3], &end, NULL) != REDIS_OK))
        return;

    if (c->argc > 4 && !strcasecmp(c->argv[4]->ptr, "withscores"))
        withscores = 1;

    // 查找 ZSET
    if ((o = lookupKeyRead(c->db, c->argv[1])) == NULL ||
        checkType(c, o, REDIS_ZSET))
        return;

    zset *zs = o->ptr;
    zskiplist *zsl = zs->zsl;
    long llen = zsl->length;

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

    // 定位到起始位置
    zskiplistNode *ln = zsl->header->forward[0];
    while (start--) ln = ln->forward[0];

    // 输出结果
    addReplyMultiBulkLen(c, withscores ? rangelen * 2 : rangelen);
    while (rangelen--) {
        addReplyBulk(c, ln->obj);
        if (withscores) addReplyDouble(c, ln->score);
        ln = ln->forward[0];
    }
}
```

### 13.3.3 ZRANK 命令

```c
static void zrankCommand(redisClient *c) {
    zrankGenericCommand(c, 0);
}

static void zrankGenericCommand(redisClient *c, int reverse) {
    robj *o = lookupKeyRead(c->db, c->argv[1]);

    if (o == NULL || checkType(c, o, REDIS_ZSET)) return;

    zset *zs = o->ptr;
    dictEntry *de = dictFind(zs->dict, c->argv[2]);

    if (de == NULL) {
        addReply(c, shared.nullbulk);
        return;
    }

    // 获取分值
    double score = *(double*)dictGetEntryVal(de);

    // 在跳表中查找排名
    unsigned long rank = zslGetRank(zs->zsl, score, c->argv[2]);

    if (reverse) {
        rank = zs->zsl->length - rank;
    } else {
        rank--;
    }

    addReplyLongLong(c, rank);
}
```

## 13.4 ZSCORE/ZCOUNT 实现

### 13.4.1 ZSCORE

```c
static void zscoreCommand(redisClient *c) {
    robj *o = lookupKeyRead(c->db, c->argv[1]);

    if (o == NULL) {
        addReply(c, shared.nullbulk);
        return;
    }

    if (checkType(c, o, REDIS_ZSET)) return;

    zset *zs = o->ptr;
    dictEntry *de = dictFind(zs->dict, c->argv[2]);

    if (de == NULL) {
        addReply(c, shared.nullbulk);
    } else {
        double *score = dictGetEntryVal(de);
        addReplyDouble(c, *score);
    }
}
```

### 13.4.2 ZCOUNT

```c
static void zcountCommand(redisClient *c) {
    robj *o;
    double min, max;

    if ((getDoubleFromObjectOrReply(c, c->argv[2], &min, NULL) != REDIS_OK) ||
        (getDoubleFromObjectOrReply(c, c->argv[3], &max, NULL) != REDIS_OK))
        return;

    if ((o = lookupKeyRead(c->db, c->argv[1])) == NULL ||
        checkType(c, o, REDIS_ZSET))
        return;

    zset *zs = o->ptr;

    // 使用跳表范围查询
    unsigned long count = 0;
    zskiplistNode *zn = zslFirstInRange(zs->zsl, min, max);

    while (zn && zn->score <= max) {
        count++;
        zn = zn->forward[0];
    }

    addReplyLongLong(c, count);
}
```

## 13.5 时间复杂度分析

| 命令 | 时间复杂度 | 说明 |
|------|------------|------|
| ZADD | O(logN) | 跳表插入 |
| ZREM | O(logN) | 跳表删除 |
| ZSCORE | O(1) | 字典查找 |
| ZRANK | O(logN) | 跳表查找 |
| ZRANGE | O(logN + M) | M 为返回元素数 |
| ZCOUNT | O(logN + M) | M 为范围内元素数 |

## 13.6 小结

本章分析了 Redis 有序集合的实现：

1. **跳表**：高效的有序数据结构，O(logN) 操作
2. **双重索引**：dict + skiplist，兼顾查找和范围查询
3. **ZADD/ZRANGE**：添加元素和范围查询
4. **ZRANK/ZSCORE**：排名和分值查询

下一章我们将学习哈希命令的实现。