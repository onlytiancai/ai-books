# 第4章：双向链表 (adlist)

链表是一种经典的数据结构，Redis 使用自己实现的双向链表（adlist）来实现列表类型和其他功能。

## 4.1 listNode 与 list 结构

### 4.1.1 链表节点

链表节点定义在 `adlist.h:36-40`：

```c
typedef struct listNode {
    struct listNode *prev;  // 前驱节点
    struct listNode *next;  // 后继节点
    void *value;            // 值（void 指针，可存储任意类型）
} listNode;
```

### 4.1.2 链表结构

链表结构定义在 `adlist.h:47-54`：

```c
typedef struct list {
    listNode *head;         // 头节点
    listNode *tail;         // 尾节点
    void *(*dup)(void *ptr);    // 复制函数
    void (*free)(void *ptr);    // 释放函数
    int (*match)(void *ptr, void *key);  // 比较函数
    unsigned int len;       // 链表长度
} list;
```

### 4.1.3 结构图示

```
                list 结构
┌─────────────────────────────────────────────┐
│ head            tail            len  dup    │
│  │               │               │   ...    │
└──│───────────────│───────────────│──────────┘
   │               │               │
   v               v               3
┌─────┐   ┌─────┐   ┌─────┐
│node1│◄─►│node2│◄─►│node3│
│value│   │value│   │value│
└─────┘   └─────┘   └─────┘

每个节点：
┌──────────────┐
│ prev │ next  │
│ ─────┼─────► │
│      │ value │
└──────────────┘
```

## 4.2 迭代器设计

Redis 为链表设计了迭代器，支持正向和反向遍历。

### 4.2.1 迭代器结构

```c
// adlist.h:42-45
typedef struct listIter {
    listNode *next;     // 下一个要访问的节点
    int direction;      // 迭代方向
} listIter;

// 迭代方向常量
#define AL_START_HEAD 0  // 从头到尾
#define AL_START_TAIL 1  // 从尾到头
```

### 4.2.2 迭代器操作

```c
// adlist.c:149-160
listIter *listGetIterator(list *list, int direction) {
    listIter *iter;

    iter = zmalloc(sizeof(*iter));
    if (iter == NULL) return NULL;

    if (direction == AL_START_HEAD)
        iter->next = list->head;  // 从头开始
    else
        iter->next = list->tail;  // 从尾开始

    iter->direction = direction;
    return iter;
}

// adlist.c:192-203
listNode *listNext(listIter *iter) {
    listNode *current = iter->next;

    if (current != NULL) {
        if (iter->direction == AL_START_HEAD)
            iter->next = current->next;  // 向后移动
        else
            iter->next = current->prev;  // 向前移动
    }
    return current;
}
```

### 4.2.3 迭代器使用示例

```c
// 正向遍历
listIter *iter = listGetIterator(list, AL_START_HEAD);
listNode *node;
while ((node = listNext(iter)) != NULL) {
    printf("Value: %s\n", (char*)node->value);
}
listReleaseIterator(iter);

// 反向遍历
iter = listGetIterator(list, AL_START_TAIL);
while ((node = listNext(iter)) != NULL) {
    printf("Value: %s\n", (char*)node->value);
}
listReleaseIterator(iter);
```

## 4.3 多态实现

链表通过三个回调函数实现多态，支持存储不同类型的数据：

### 4.3.1 回调函数

| 函数 | 用途 |
|------|------|
| `dup` | 复制节点值 |
| `free` | 释放节点值 |
| `match` | 比较节点值 |

### 4.3.2 设置回调函数

```c
// adlist.h:64-66
#define listSetDupMethod(l,m) ((l)->dup = (m))
#define listSetFreeMethod(l,m) ((l)->free = (m))
#define listSetMatchMethod(l,m) ((l)->match = (m))
```

### 4.3.3 使用示例

```c
// 存储字符串的链表
list *strList = listCreate();
listSetFreeMethod(strList, zfree);  // 设置释放函数

// 存储对象的链表
list *objList = listCreate();
listSetDupMethod(objList, dupObject);
listSetFreeMethod(objList, freeObject);
listSetMatchMethod(objList, compareObject);
```

## 4.4 源码分析：adlist.c

### 4.4.1 创建链表

```c
// adlist.c:41-53
list *listCreate(void) {
    struct list *list;

    if ((list = zmalloc(sizeof(*list))) == NULL)
        return NULL;

    list->head = list->tail = NULL;
    list->len = 0;
    list->dup = NULL;
    list->free = NULL;
    list->match = NULL;

    return list;
}
```

### 4.4.2 头部插入

```c
// adlist.c:80-98
list *listAddNodeHead(list *list, void *value) {
    listNode *node;

    if ((node = zmalloc(sizeof(*node))) == NULL)
        return NULL;

    node->value = value;

    if (list->len == 0) {
        // 空链表：头尾都指向新节点
        list->head = list->tail = node;
        node->prev = node->next = NULL;
    } else {
        // 非空：插入头部
        node->prev = NULL;
        node->next = list->head;
        list->head->prev = node;
        list->head = node;
    }

    list->len++;
    return list;
}
```

操作图示：

```
插入前：NULL ◄── [A] ◄──► [B] ──► NULL
                 head            tail

插入 C 后：
NULL ◄── [C] ◄──► [A] ◄──► [B] ──► NULL
          head                  tail
```

### 4.4.3 尾部插入

```c
// adlist.c:106-124
list *listAddNodeTail(list *list, void *value) {
    listNode *node;

    if ((node = zmalloc(sizeof(*node))) == NULL)
        return NULL;

    node->value = value;

    if (list->len == 0) {
        list->head = list->tail = node;
        node->prev = node->next = NULL;
    } else {
        // 插入尾部
        node->prev = list->tail;
        node->next = NULL;
        list->tail->next = node;
        list->tail = node;
    }

    list->len++;
    return list;
}
```

### 4.4.4 删除节点

```c
// adlist.c:130-143
void listDelNode(list *list, listNode *node) {
    // 更新前驱节点的 next 指针
    if (node->prev)
        node->prev->next = node->next;
    else
        list->head = node->next;  // 删除的是头节点

    // 更新后继节点的 prev 指针
    if (node->next)
        node->next->prev = node->prev;
    else
        list->tail = node->prev;  // 删除的是尾节点

    // 释放节点值
    if (list->free) list->free(node->value);

    zfree(node);
    list->len--;
}
```

### 4.4.5 查找节点

```c
// adlist.c:256-277
listNode *listSearchKey(list *list, void *key) {
    listIter *iter;
    listNode *node;

    iter = listGetIterator(list, AL_START_HEAD);
    while ((node = listNext(iter)) != NULL) {
        // 使用自定义比较函数或直接比较指针
        if (list->match) {
            if (list->match(node->value, key)) {
                listReleaseIterator(iter);
                return node;
            }
        } else {
            if (key == node->value) {
                listReleaseIterator(iter);
                return node;
            }
        }
    }
    listReleaseIterator(iter);
    return NULL;
}
```

### 4.4.6 索引访问

```c
// adlist.c:284-296
listNode *listIndex(list *list, int index) {
    listNode *n;

    if (index < 0) {
        // 负索引从尾部开始
        index = (-index) - 1;
        n = list->tail;
        while (index-- && n) n = n->prev;
    } else {
        // 正索引从头部开始
        n = list->head;
        while (index-- && n) n = n->next;
    }
    return n;
}
```

示例：

```c
// 链表：[A] -> [B] -> [C] -> [D]
listIndex(list, 0);   // A
listIndex(list, 2);   // C
listIndex(list, -1);  // D
listIndex(list, -2);  // C
```

### 4.4.7 复制链表

```c
// adlist.c:213-245
list *listDup(list *orig) {
    list *copy;
    listIter *iter;
    listNode *node;

    if ((copy = listCreate()) == NULL)
        return NULL;

    // 复制回调函数
    copy->dup = orig->dup;
    copy->free = orig->free;
    copy->match = orig->match;

    // 遍历原链表，逐个复制节点
    iter = listGetIterator(orig, AL_START_HEAD);
    while ((node = listNext(iter)) != NULL) {
        void *value;

        if (copy->dup) {
            value = copy->dup(node->value);
            if (value == NULL) {
                listRelease(copy);
                listReleaseIterator(iter);
                return NULL;
            }
        } else {
            value = node->value;
        }

        if (listAddNodeTail(copy, value) == NULL) {
            listRelease(copy);
            listReleaseIterator(iter);
            return NULL;
        }
    }
    listReleaseIterator(iter);
    return copy;
}
```

## 4.5 常用宏定义

adlist.h 中定义了许多便捷的宏：

```c
// adlist.h:57-70
#define listLength(l) ((l)->len)
#define listFirst(l) ((l)->head)
#define listLast(l) ((l)->tail)
#define listPrevNode(n) ((n)->prev)
#define listNextNode(n) ((n)->next)
#define listNodeValue(n) ((n)->value)

#define listSetDupMethod(l,m) ((l)->dup = (m))
#define listSetFreeMethod(l,m) ((l)->free = (m))
#define listSetMatchMethod(l,m) ((l)->match = (m))

#define listGetDupMethod(l) ((l)->dup)
#define listGetFree(l) ((l)->free)
#define listGetMatchMethod(l) ((l)->match)
```

## 4.6 时间复杂度分析

| 操作 | 时间复杂度 | 说明 |
|------|------------|------|
| 头部插入 | O(1) | 直接操作头指针 |
| 尾部插入 | O(1) | 直接操作尾指针 |
| 头部删除 | O(1) | 直接操作头指针 |
| 尾部删除 | O(1) | 直接操作尾指针 |
| 按索引访问 | O(N) | 需要遍历 |
| 按值查找 | O(N) | 需要遍历 |
| 获取长度 | O(1) | 直接读取 len 字段 |

## 4.7 Redis 中链表的使用场景

| 使用场景 | 说明 |
|----------|------|
| 列表键 | 存储列表类型的值 |
| 发布订阅 | 存储订阅客户端列表 |
| 服务器状态 | 存储客户端连接列表 |
| 慢查询日志 | 存储慢查询记录 |
| 监视器 | 存储监视器客户端列表 |

## 4.8 小结

本章详细分析了 Redis 的双向链表（adlist）：

1. **结构设计**：`list` + `listNode`，带长度计数
2. **迭代器**：支持正向和反向遍历
3. **多态实现**：通过回调函数支持不同类型数据
4. **操作效率**：头尾操作 O(1)，随机访问 O(N)

链表是 Redis 中列表类型的底层实现之一。下一章我们将学习 Redis 最核心的数据结构——字典（dict）。