# 第3章：简单动态字符串 (SDS)

简单动态字符串（Simple Dynamic String，简称 SDS）是 Redis 自行实现的字符串类型，用于替代 C 语言的原生字符串。

## 3.1 为什么不用 C 字符串

C 语言原生字符串存在以下问题：

| 问题 | 说明 |
|------|------|
| 长度计算 O(N) | `strlen()` 需要遍历整个字符串 |
| 二进制不安全 | 以 `\0` 作为结束符，无法存储包含 `\0` 的数据 |
| 内存操作频繁 | 每次追加都需要重新分配内存 |
| 缓冲区溢出风险 | 操作不当可能造成内存越界 |

### 示例：C 字符串拼接的问题

```c
// C 字符串拼接
char *str = "Hello";
strcat(str, " World");  // 危险！可能导致缓冲区溢出

// 需要先分配足够空间
char *str = malloc(20);
strcpy(str, "Hello");
strcat(str, " World");  // 正确，但需要手动管理内存
```

Redis 需要频繁进行字符串操作，C 字符串的低效会成为性能瓶颈。

## 3.2 sdshdr 结构体

SDS 的核心结构定义在 `sds.h:38-42`：

```c
typedef char *sds;  // SDS 指针，指向 buf 的起始位置

struct sdshdr {
    long len;      // 已使用长度（不含结束符）
    long free;     // 剩余可用长度
    char buf[];    // 柔性数组，存储实际字符串
};
```

### 内存布局

```
                SDS 指针 (sds)
                      │
                      v
┌─────────┬─────────┬───────────────────────────────┬─────┐
│   len   │  free   │        buf (字符数组)          │ '\0'│
│  (8字节) │ (8字节)  │                               │     │
└─────────┴─────────┴───────────────────────────────┴─────┘
│<───────────── sdshdr 结构体 ──────────────────────>│

示例：存储 "Redis"
┌─────────┬─────────┬─────────────────────────┬─────┐
│  len=5  │ free=0  │ R │ e │ d │ i │ s │ ... │ '\0'│
└─────────┴─────────┴─────────────────────────┴─────┘
```

### 关键设计点

1. **兼容 C 字符串**：`buf` 以 `\0` 结尾，可以直接使用部分 C 字符串函数
2. **O(1) 获取长度**：直接读取 `len` 字段
3. **二进制安全**：通过 `len` 确定长度，不以 `\0` 判断结束
4. **空间预分配**：预留空间减少内存分配次数

## 3.3 内存分配策略

### 3.3.1 创建 SDS

```c
// sds.c:46-63
sds sdsnewlen(const void *init, size_t initlen) {
    struct sdshdr *sh;

    // 分配内存：结构体大小 + 字符串长度 + 1（结束符）
    sh = zmalloc(sizeof(struct sdshdr) + initlen + 1);

    sh->len = initlen;
    sh->free = 0;

    if (initlen) {
        if (init)
            memcpy(sh->buf, init, initlen);  // 复制内容
        else
            memset(sh->buf, 0, initlen);      // 清零
    }
    sh->buf[initlen] = '\0';  // 添加结束符

    return (char*)sh->buf;  // 返回 buf 指针，而非结构体指针
}
```

### 3.3.2 扩展空间

当需要扩展字符串时，SDS 会按策略预分配额外空间：

```c
// sds.c:100-118
static sds sdsMakeRoomFor(sds s, size_t addlen) {
    struct sdshdr *sh, *newsh;
    size_t free = sdsavail(s);
    size_t len, newlen;

    // 如果剩余空间足够，直接返回
    if (free >= addlen) return s;

    len = sdslen(s);
    sh = (void*)(s - sizeof(struct sdshdr));

    // 新长度 = 当前长度 + 需要增加的长度
    newlen = (len + addlen);

    // 关键策略：新长度翻倍
    // 如果最终长度 < 1MB，分配 2 倍空间
    // 如果最终长度 >= 1MB，分配额外 1MB 空间
    newlen *= 2;

    // 重新分配内存
    newsh = zrealloc(sh, sizeof(struct sdshdr) + newlen + 1);
    newsh->free = newlen - len;  // 更新剩余空间

    return newsh->buf;
}
```

### 3.3.3 内存分配策略图示

```
追加操作：sds = "Hello" (len=5, free=0)，追加 " World" (6字符)

1. 检查空间：free=0 < 6，需要扩展
2. 计算新长度：(5+6) * 2 = 22
3. 重新分配：len=5, free=17
4. 追加后：len=11, free=11

                    追加前                          追加后
┌───────────────────────┐         ┌─────────────────────────────────┐
│ len=5  │ free=0       │         │ len=11 │ free=11                │
├────────┴──────────────┤         ├────────┴────────────────────────┤
│ Hello │\0             │   ───►  │ Hello World │\0                 │
└───────────────────────┘         └─────────────────────────────────┘
```

这种 **2 倍扩容策略** 的好处：

- 减少内存分配次数
- 空间换时间，提高性能
- 后续追加操作可能不需要重新分配

## 3.4 常用操作函数

### 3.4.1 获取长度

```c
// sds.c:74-77
size_t sdslen(const sds s) {
    struct sdshdr *sh = (void*)(s - sizeof(struct sdshdr));
    return sh->len;
}
```

通过指针运算，从 `sds` 指针反向找到 `sdshdr` 结构体，O(1) 时间获取长度。

```
sds 指针
    │
    v                           sizeof(struct sdshdr)
┌───┴───┬───┬───┬───┬───┬───┬───┬───────────────────────
│ len   │free│ R │ e │ d │ i │ s │ ...
└───────┴───┴───┴───┴───┴───┴───┴───────────────────────
        │<─────────────────────>│
              s - sizeof(struct sdshdr)
```

### 3.4.2 字符串拼接

```c
// sds.c:120-132
sds sdscatlen(sds s, void *t, size_t len) {
    struct sdshdr *sh;
    size_t curlen = sdslen(s);

    // 扩展空间
    s = sdsMakeRoomFor(s, len);
    if (s == NULL) return NULL;

    sh = (void*)(s - sizeof(struct sdshdr));
    memcpy(s + curlen, t, len);  // 追加内容
    sh->len = curlen + len;      // 更新长度
    sh->free = sh->free - len;   // 更新剩余空间
    s[curlen + len] = '\0';      // 添加结束符

    return s;
}

// 拼接 C 字符串
sds sdscat(sds s, char *t) {
    return sdscatlen(s, t, strlen(t));
}
```

### 3.4.3 字符串复制

```c
// sds.c:138-157
sds sdscpylen(sds s, char *t, size_t len) {
    struct sdshdr *sh = (void*)(s - sizeof(struct sdshdr));
    size_t totlen = sh->free + sh->len;

    // 如果空间不足，扩展
    if (totlen < len) {
        s = sdsMakeRoomFor(s, len - sh->len);
        sh = (void*)(s - sizeof(struct sdshdr));
        totlen = sh->free + sh->len;
    }

    memcpy(s, t, len);
    s[len] = '\0';
    sh->len = len;
    sh->free = totlen - len;

    return s;
}
```

### 3.4.4 其他常用函数

| 函数 | 功能 |
|------|------|
| `sdsnew()` | 创建 SDS |
| `sdsempty()` | 创建空 SDS |
| `sdsdup()` | 复制 SDS |
| `sdsfree()` | 释放 SDS |
| `sdsavail()` | 获取剩余空间 |
| `sdscatprintf()` | 格式化拼接 |
| `sdstrim()` | 去除首尾指定字符 |
| `sdsrange()` | 截取子串 |
| `sdscmp()` | 比较两个 SDS |

## 3.5 源码分析：sds.c

### 3.5.1 去除首尾字符

```c
// sds.c:187-202
sds sdstrim(sds s, const char *cset) {
    struct sdshdr *sh = (void*)(s - sizeof(struct sdshdr));
    char *start, *end, *sp, *ep;
    size_t len;

    sp = start = s;
    ep = end = s + sdslen(s) - 1;

    // 从头扫描，跳过指定字符
    while(sp <= end && strchr(cset, *sp)) sp++;

    // 从尾扫描，跳过指定字符
    while(ep > start && strchr(cset, *ep)) ep--;

    // 计算新长度
    len = (sp > ep) ? 0 : ((ep - sp) + 1);

    // 移动内容到开头
    if (sh->buf != sp) memmove(sh->buf, sp, len);
    sh->buf[len] = '\0';
    sh->free = sh->free + (sh->len - len);
    sh->len = len;

    return s;
}
```

示例：

```c
sds s = sdsnew("xxRedisxx");
sdstrim(s, "x");  // 结果：Redis
// len: 9 → 5
// free: 0 → 4
```

### 3.5.2 范围截取

```c
// sds.c:204-230
sds sdsrange(sds s, long start, long end) {
    struct sdshdr *sh = (void*)(s - sizeof(struct sdshdr));
    size_t newlen, len = sdslen(s);

    if (len == 0) return s;

    // 处理负索引
    if (start < 0) {
        start = len + start;
        if (start < 0) start = 0;
    }
    if (end < 0) {
        end = len + end;
        if (end < 0) end = 0;
    }

    newlen = (start > end) ? 0 : (end - start) + 1;

    // 边界检查
    if (newlen != 0) {
        if (start >= (signed)len) start = len - 1;
        if (end >= (signed)len) end = len - 1;
        newlen = (start > end) ? 0 : (end - start) + 1;
    } else {
        start = 0;
    }

    // 移动内容
    if (start != 0) memmove(sh->buf, sh->buf + start, newlen);
    sh->buf[newlen] = 0;
    sh->free = sh->free + (sh->len - newlen);
    sh->len = newlen;

    return s;
}
```

## 3.6 SDS vs C 字符串对比

| 特性 | C 字符串 | SDS |
|------|----------|-----|
| 获取长度 | O(N) | O(1) |
| 二进制安全 | 否 | 是 |
| 缓冲区溢出 | 可能 | 自动扩容 |
| 内存重分配 | N 次操作可能 N 次重分配 | 预分配减少次数 |
| 兼容性 | - | 兼容部分 C 字符串函数 |

## 3.7 小结

本章详细分析了 Redis 的简单动态字符串（SDS）：

1. **设计目标**：解决 C 字符串的效率和安全问题
2. **核心结构**：`sdshdr` 包含 `len`、`free` 和 `buf`
3. **内存策略**：2 倍扩容，减少内存分配次数
4. **关键优势**：O(1) 长度获取、二进制安全、自动扩容

SDS 是 Redis 中最基础的数据结构，几乎所有需要字符串的地方都使用了 SDS。下一章我们将学习 Redis 的双向链表实现。