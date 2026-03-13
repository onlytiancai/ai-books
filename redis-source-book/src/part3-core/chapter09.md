# 第9章：内存管理 (zmalloc)

Redis 实现了自己的内存管理模块 zmalloc，在标准 malloc 基础上增加了内存使用统计功能。

## 9.1 内存分配封装

### 9.1.1 为什么需要 zmalloc？

标准 malloc 的不足：

1. 无法统计总内存使用量
2. 无法设置内存上限
3. 缺乏线程安全保护

zmalloc 的解决方案：

1. 记录每个分配块的大小
2. 维护全局内存使用计数器
3. 支持线程安全模式

### 9.1.2 头文件

```c
// zmalloc.h
void *zmalloc(size_t size);
void *zrealloc(void *ptr, size_t size);
void zfree(void *ptr);
char *zstrdup(const char *s);
size_t zmalloc_used_memory(void);
void zmalloc_enable_thread_safeness(void);
```

## 9.2 内存使用统计

### 9.2.1 实现原理

zmalloc 在每个分配块前添加一个头部，记录分配大小：

```
                用户指针
                    │
                    v
┌──────────┬───────────────────────────────────┐
│   size   │         用户数据区                 │
│ (前缀)   │                                    │
└──────────┴───────────────────────────────────┘
│<- PREFIX_SIZE ->│
```

### 9.2.2 前缀大小

```c
// zmalloc.c:37-41
#if defined(__sun)
#define PREFIX_SIZE sizeof(long long)
#else
#define PREFIX_SIZE sizeof(size_t)
#endif
```

### 9.2.3 全局变量

```c
// zmalloc.c:67-69
static size_t used_memory = 0;          // 已使用内存总量
static int zmalloc_thread_safe = 0;     // 线程安全标志
pthread_mutex_t used_memory_mutex = PTHREAD_MUTEX_INITIALIZER;  // 互斥锁
```

### 9.2.4 更新内存计数

```c
// zmalloc.c:43-53
#define increment_used_memory(__n) do { \
    size_t _n = (__n); \
    // 内存对齐
    if (_n&(sizeof(long)-1)) _n += sizeof(long)-(_n&(sizeof(long)-1)); \
    if (zmalloc_thread_safe) { \
        pthread_mutex_lock(&used_memory_mutex);  \
        used_memory += _n; \
        pthread_mutex_unlock(&used_memory_mutex); \
    } else { \
        used_memory += _n; \
    } \
} while(0)

// zmalloc.c:55-65
#define decrement_used_memory(__n) do { \
    size_t _n = (__n); \
    if (_n&(sizeof(long)-1)) _n += sizeof(long)-(_n&(sizeof(long)-1)); \
    if (zmalloc_thread_safe) { \
        pthread_mutex_lock(&used_memory_mutex);  \
        used_memory -= _n; \
        pthread_mutex_unlock(&used_memory_mutex); \
    } else { \
        used_memory -= _n; \
    } \
} while(0)
```

## 9.3 线程安全

### 9.3.1 启用线程安全

```c
// zmalloc.c:156-158
void zmalloc_enable_thread_safeness(void) {
    zmalloc_thread_safe = 1;
}
```

### 9.3.2 线程安全的内存统计

启用线程安全后，所有内存统计操作都会使用互斥锁保护：

```c
size_t zmalloc_used_memory(void) {
    size_t um;

    if (zmalloc_thread_safe)
        pthread_mutex_lock(&used_memory_mutex);
    um = used_memory;
    if (zmalloc_thread_safe)
        pthread_mutex_unlock(&used_memory_mutex);

    return um;
}
```

## 9.4 源码分析：zmalloc.c

### 9.4.1 内存分配

```c
// zmalloc.c:78-90
void *zmalloc(size_t size) {
    void *ptr = malloc(size + PREFIX_SIZE);

    if (!ptr) zmalloc_oom(size);

#ifdef HAVE_MALLOC_SIZE
    // macOS 等平台有 malloc_size 函数
    increment_used_memory(redis_malloc_size(ptr));
    return ptr;
#else
    // 记录大小到前缀
    *((size_t*)ptr) = size;
    increment_used_memory(size + PREFIX_SIZE);
    // 返回用户数据区指针
    return (char*)ptr + PREFIX_SIZE;
#endif
}
```

### 9.4.2 内存重分配

```c
// zmalloc.c:92-119
void *zrealloc(void *ptr, size_t size) {
#ifndef HAVE_MALLOC_SIZE
    void *realptr;
#endif
    size_t oldsize;
    void *newptr;

    if (ptr == NULL) return zmalloc(size);

#ifdef HAVE_MALLOC_SIZE
    // 使用系统提供的 malloc_size
    oldsize = redis_malloc_size(ptr);
    newptr = realloc(ptr, size);
    if (!newptr) zmalloc_oom(size);

    decrement_used_memory(oldsize);
    increment_used_memory(redis_malloc_size(newptr));
    return newptr;
#else
    // 获取真实指针和旧大小
    realptr = (char*)ptr - PREFIX_SIZE;
    oldsize = *((size_t*)realptr);

    // 重新分配
    newptr = realloc(realptr, size + PREFIX_SIZE);
    if (!newptr) zmalloc_oom(size);

    // 更新大小
    *((size_t*)newptr) = size;
    decrement_used_memory(oldsize);
    increment_used_memory(size);

    return (char*)newptr + PREFIX_SIZE;
#endif
}
```

### 9.4.3 内存释放

```c
// zmalloc.c:121-137
void zfree(void *ptr) {
#ifndef HAVE_MALLOC_SIZE
    void *realptr;
    size_t oldsize;
#endif

    if (ptr == NULL) return;

#ifdef HAVE_MALLOC_SIZE
    decrement_used_memory(redis_malloc_size(ptr));
    free(ptr);
#else
    // 计算真实指针
    realptr = (char*)ptr - PREFIX_SIZE;
    oldsize = *((size_t*)realptr);
    decrement_used_memory(oldsize + PREFIX_SIZE);
    free(realptr);
#endif
}
```

### 9.4.4 字符串复制

```c
// zmalloc.c:139-145
char *zstrdup(const char *s) {
    size_t l = strlen(s) + 1;
    char *p = zmalloc(l);

    memcpy(p, s, l);
    return p;
}
```

### 9.4.5 内存不足处理

```c
// zmalloc.c:71-76
static void zmalloc_oom(size_t size) {
    fprintf(stderr, "zmalloc: Out of memory trying to allocate %zu bytes\n",
        size);
    fflush(stderr);
    abort();
}
```

## 9.5 内存对齐

### 9.5.1 为什么要对齐？

内存对齐可以提高 CPU 访问内存的效率：

```
未对齐：
地址:  0   1   2   3   4   5   6   7
      [      data1      ][  data2  ]
               ↑
           跨越两个内存块，需要两次访问

对齐后：
地址:  0   1   2   3   4   5   6   7
      [  padding  ][      data      ]
                      ↑
                 单次访问即可
```

### 9.5.2 对齐计算

```c
// 将大小对齐到 sizeof(long) 的倍数
if (_n&(sizeof(long)-1))
    _n += sizeof(long)-(_n&(sizeof(long)-1));
```

示例：

```
原始大小    对齐后 (sizeof(long) = 8)
    1           8
    7           8
    8           8
    9          16
   15          16
   16          16
```

## 9.6 不同平台的实现

### 9.6.1 HAVE_MALLOC_SIZE

某些平台（如 macOS）提供了 `malloc_size()` 函数，可以查询已分配内存块的实际大小：

```c
#ifdef HAVE_MALLOC_SIZE
#define redis_malloc_size(p) malloc_size(p)
#endif
```

这种情况下：

1. 不需要在分配块前存储大小
2. 减少了 PREFIX_SIZE 的开销
3. 使用系统提供的大小更准确

### 9.6.2 条件编译

```c
#ifdef HAVE_MALLOC_SIZE
    // 使用 malloc_size 的实现
#else
    // 使用前缀记录大小的实现
#endif
```

## 9.7 内存统计流程

```
分配内存：
┌─────────────────────────────────────────────────────┐
│ zmalloc(size)                                       │
│                                                     │
│  1. malloc(size + PREFIX_SIZE)                      │
│  2. 记录 size 到前缀                                 │
│  3. increment_used_memory(size + PREFIX_SIZE)       │
│  4. 返回用户数据区指针                               │
└─────────────────────────────────────────────────────┘

释放内存：
┌─────────────────────────────────────────────────────┐
│ zfree(ptr)                                          │
│                                                     │
│  1. 计算真实指针: realptr = ptr - PREFIX_SIZE       │
│  2. 读取 size = *realptr                            │
│  3. decrement_used_memory(size + PREFIX_SIZE)       │
│  4. free(realptr)                                   │
└─────────────────────────────────────────────────────┘

查询总内存：
┌─────────────────────────────────────────────────────┐
│ zmalloc_used_memory()                               │
│                                                     │
│  return used_memory;  // 线程安全时加锁             │
└─────────────────────────────────────────────────────┘
```

## 9.8 Redis 中的使用

### 9.8.1 创建对象

```c
// redis.c
robj *createObject(int type, void *ptr) {
    robj *o = zmalloc(sizeof(*o));
    // ...
    return o;
}
```

### 9.8.2 内存使用监控

```c
// redis.c (INFO 命令)
sds genRedisInfoString(void) {
    // ...
    info = sdscatprintf(info,
        "used_memory:%zu\r\n"
        "used_memory_human:%s\r\n",
        zmalloc_used_memory(),
        // ...
    );
    // ...
}
```

### 9.8.3 内存限制

```c
// redis.c
static void freeMemoryIfNeeded(void) {
    // 检查内存使用是否超过 maxmemory
    if (zmalloc_used_memory() <= server.maxmemory)
        return;

    // 执行内存回收
    // ...
}
```

## 9.9 内存使用统计的优势

| 功能 | 说明 |
|------|------|
| 内存监控 | 实时了解内存使用情况 |
| 内存限制 | 支持 maxmemory 配置 |
| 内存预警 | 内存使用过高时触发警告 |
| 调试支持 | 检测内存泄漏 |

## 9.10 小结

本章分析了 Redis 的内存管理模块 zmalloc：

1. **内存统计**：记录每个分配块大小，维护全局计数器
2. **线程安全**：可选的线程安全模式
3. **内存对齐**：提高 CPU 访问效率
4. **跨平台**：支持不同平台的实现方式

zmalloc 为 Redis 提供了精确的内存使用统计能力，是 Redis 内存管理的基础设施。

至此，我们已经完成了 Redis 核心机制的学习。接下来，我们将深入分析各种数据类型的命令实现。