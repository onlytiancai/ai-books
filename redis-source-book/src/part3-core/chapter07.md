# 第7章：事件驱动 (ae)

Redis 基于 **ae (Asynchronous Events)** 库实现事件驱动架构，这是 Redis 高性能的关键之一。

## 7.1 事件循环设计

ae 库实现了一个简单高效的事件循环，处理两种事件：

- **文件事件（File Event）**：网络 IO 事件
- **时间事件（Time Event）**：定时任务

### 7.1.1 事件循环结构

```c
// ae.h:89-98
typedef struct aeEventLoop {
    int maxfd;                          // 最大文件描述符
    long long timeEventNextId;          // 下一个时间事件 ID
    aeFileEvent events[AE_SETSIZE];     // 注册的文件事件数组
    aeFiredEvent fired[AE_SETSIZE];     // 已触发的文件事件数组
    aeTimeEvent *timeEventHead;         // 时间事件链表头
    int stop;                           // 停止标志
    void *apidata;                      // 多路复用 API 数据
    aeBeforeSleepProc *beforesleep;     // 休眠前回调
} aeEventLoop;

#define AE_SETSIZE (1024*10)  // 最大 10240 个连接
```

### 7.1.2 文件事件结构

```c
// ae.h:64-69
typedef struct aeFileEvent {
    int mask;                   // 事件掩码 (AE_READABLE | AE_WRITABLE)
    aeFileProc *rfileProc;      // 读事件回调
    aeFileProc *wfileProc;      // 写事件回调
    void *clientData;           // 用户数据
} aeFileEvent;
```

### 7.1.3 时间事件结构

```c
// ae.h:72-80
typedef struct aeTimeEvent {
    long long id;               // 事件 ID
    long when_sec;              // 秒
    long when_ms;               // 毫秒
    aeTimeProc *timeProc;       // 回调函数
    aeEventFinalizerProc *finalizerProc; // 结束回调
    void *clientData;           // 用户数据
    struct aeTimeEvent *next;   // 下一个时间事件
} aeTimeEvent;
```

### 7.1.4 事件类型

```c
// ae.h:41-48
#define AE_NONE 0           // 无事件
#define AE_READABLE 1       // 可读事件
#define AE_WRITABLE 2       // 可写事件

#define AE_FILE_EVENTS 1    // 文件事件标志
#define AE_TIME_EVENTS 2    // 时间事件标志
#define AE_ALL_EVENTS (AE_FILE_EVENTS|AE_TIME_EVENTS)
#define AE_DONT_WAIT 4      // 不阻塞
```

## 7.2 文件事件 (File Event)

文件事件用于处理网络 IO，主要通过多路复用机制实现。

### 7.2.1 文件事件流程

```
                    ┌─────────────────────┐
                    │   aeEventLoop       │
                    └──────────┬──────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       v                       v                       v
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ socket fd=4  │      │ socket fd=5  │      │ socket fd=6  │
│ (客户端连接) │      │ (客户端连接) │      │ (监听 socket)│
└──────────────┘      └──────────────┘      └──────────────┘
       │                       │                       │
       │                       │                       │
       v                       v                       v
┌──────────────────────────────────────────────────────────────┐
│                     多路复用 (epoll/kqueue/select)            │
│                                                              │
│  返回就绪的 fd 列表                                          │
└──────────────────────────────────────────────────────────────┘
                               │
                               v
                    ┌─────────────────────┐
                    │   调用回调函数       │
                    │   rfileProc /       │
                    │   wfileProc         │
                    └─────────────────────┘
```

### 7.2.2 创建文件事件

```c
// ae.c:86-101
int aeCreateFileEvent(aeEventLoop *eventLoop, int fd, int mask,
        aeFileProc *proc, void *clientData)
{
    if (fd >= AE_SETSIZE) return AE_ERR;

    aeFileEvent *fe = &eventLoop->events[fd];

    // 注册到多路复用
    if (aeApiAddEvent(eventLoop, fd, mask) == -1)
        return AE_ERR;

    fe->mask |= mask;
    if (mask & AE_READABLE) fe->rfileProc = proc;
    if (mask & AE_WRITABLE) fe->wfileProc = proc;
    fe->clientData = clientData;

    // 更新最大 fd
    if (fd > eventLoop->maxfd)
        eventLoop->maxfd = fd;

    return AE_OK;
}
```

### 7.2.3 删除文件事件

```c
// ae.c:103-119
void aeDeleteFileEvent(aeEventLoop *eventLoop, int fd, int mask)
{
    if (fd >= AE_SETSIZE) return;

    aeFileEvent *fe = &eventLoop->events[fd];
    if (fe->mask == AE_NONE) return;

    fe->mask = fe->mask & (~mask);

    // 如果该 fd 没有事件了，更新 maxfd
    if (fd == eventLoop->maxfd && fe->mask == AE_NONE) {
        int j;
        for (j = eventLoop->maxfd - 1; j >= 0; j--)
            if (eventLoop->events[j].mask != AE_NONE) break;
        eventLoop->maxfd = j;
    }

    // 从多路复用中移除
    aeApiDelEvent(eventLoop, fd, mask);
}
```

## 7.3 时间事件 (Time Event)

时间事件用于执行定时任务，如服务器定时任务 `serverCron`。

### 7.3.1 创建时间事件

```c
// ae.c:144-161
long long aeCreateTimeEvent(aeEventLoop *eventLoop, long long milliseconds,
        aeTimeProc *proc, void *clientData,
        aeEventFinalizerProc *finalizerProc)
{
    long long id = eventLoop->timeEventNextId++;
    aeTimeEvent *te;

    te = zmalloc(sizeof(*te));
    if (te == NULL) return AE_ERR;

    te->id = id;
    // 计算触发时间
    aeAddMillisecondsToNow(milliseconds, &te->when_sec, &te->when_ms);
    te->timeProc = proc;
    te->finalizerProc = finalizerProc;
    te->clientData = clientData;
    // 头插法加入链表
    te->next = eventLoop->timeEventHead;
    eventLoop->timeEventHead = te;

    return id;
}
```

### 7.3.2 处理时间事件

```c
// ae.c:212-260
static int processTimeEvents(aeEventLoop *eventLoop) {
    int processed = 0;
    aeTimeEvent *te;
    long long maxId;

    te = eventLoop->timeEventHead;
    maxId = eventLoop->timeEventNextId - 1;

    while(te) {
        long now_sec, now_ms;
        long long id;

        // 跳过新注册的事件
        if (te->id > maxId) {
            te = te->next;
            continue;
        }

        aeGetTime(&now_sec, &now_ms);

        // 检查是否到期
        if (now_sec > te->when_sec ||
            (now_sec == te->when_sec && now_ms >= te->when_ms))
        {
            int retval;

            id = te->id;
            // 执行回调
            retval = te->timeProc(eventLoop, id, te->clientData);
            processed++;

            // 如果返回 AE_NOMORE，删除事件
            // 否则重新设置时间（周期性任务）
            if (retval != AE_NOMORE) {
                aeAddMillisecondsToNow(retval, &te->when_sec, &te->when_ms);
            } else {
                aeDeleteTimeEvent(eventLoop, id);
            }
            // 重新从头开始遍历
            te = eventLoop->timeEventHead;
        } else {
            te = te->next;
        }
    }
    return processed;
}
```

### 7.3.3 serverCron 时间事件

Redis 在初始化时注册 `serverCron` 时间事件：

```c
// redis.c:1771
aeCreateTimeEvent(server.el, 1, serverCron, NULL, NULL);
```

`serverCron` 执行的任务：

- 更新服务器时间
- 处理过期 key
- 执行 BGSAVE / BGREWRITEAOF
- 处理客户端超时
- 同步主从数据
- 其他定时任务

## 7.4 多路复用：select/epoll/kqueue

ae 库支持三种多路复用机制：

| 机制 | 平台 | 性能 |
|------|------|------|
| select | 跨平台 | 一般 |
| epoll | Linux | 高 |
| kqueue | BSD/macOS | 高 |

### 7.4.1 多路复用选择

```c
// ae.c:45-53
#ifdef HAVE_EPOLL
#include "ae_epoll.c"
#else
    #ifdef HAVE_KQUEUE
    #include "ae_kqueue.c"
    #else
    #include "ae_select.c"
    #endif
#endif
```

### 7.4.2 API 抽象

ae 库定义了统一的多路复用 API：

```c
// 各平台实现这些函数
int aeApiCreate(aeEventLoop *eventLoop);
void aeApiFree(aeEventLoop *eventLoop);
int aeApiAddEvent(aeEventLoop *eventLoop, int fd, int mask);
void aeApiDelEvent(aeEventLoop *eventLoop, int fd, int mask);
int aeApiPoll(aeEventLoop *eventLoop, struct timeval *tvp);
char *aeApiName(void);
```

### 7.4.3 select 实现

```c
// ae_select.c (简化版)
typedef struct aeApiState {
    fd_set rfds, wfds;
    fd_set _rfds, _wfds;
} aeApiState;

int aeApiPoll(aeEventLoop *eventLoop, struct timeval *tvp) {
    aeApiState *state = eventLoop->apidata;
    int retval, j, numevents = 0;

    memcpy(&state->_rfds, &state->rfds, sizeof(fd_set));
    memcpy(&state->_wfds, &state->wfds, sizeof(fd_set));

    retval = select(eventLoop->maxfd + 1,
                    &state->_rfds, &state->_wfds, NULL, tvp);

    if (retval > 0) {
        for (j = 0; j <= eventLoop->maxfd; j++) {
            int mask = 0;
            aeFileEvent *fe = &eventLoop->events[j];

            if (fe->mask == AE_NONE) continue;

            if (fe->mask & AE_READABLE && FD_ISSET(j, &state->_rfds))
                mask |= AE_READABLE;
            if (fe->mask & AE_WRITABLE && FD_ISSET(j, &state->_wfds))
                mask |= AE_WRITABLE;

            if (mask) {
                eventLoop->fired[numevents].fd = j;
                eventLoop->fired[numevents].mask = mask;
                numevents++;
            }
        }
    }
    return numevents;
}
```

### 7.4.4 epoll 实现（简化）

```c
// ae_epoll.c (简化版)
typedef struct aeApiState {
    int epfd;
    struct epoll_event events[AE_SETSIZE];
} aeApiState;

int aeApiPoll(aeEventLoop *eventLoop, struct timeval *tvp) {
    aeApiState *state = eventLoop->apidata;
    int retval, numevents = 0;

    retval = epoll_wait(state->epfd, state->events, AE_SETSIZE,
                        tvp ? (tvp->tv_sec * 1000 + tvp->tv_usec / 1000) : -1);

    if (retval > 0) {
        numevents = retval;
        for (int j = 0; j < numevents; j++) {
            int mask = 0;
            struct epoll_event *e = state->events + j;

            if (e->events & EPOLLIN) mask |= AE_READABLE;
            if (e->events & EPOLLOUT) mask |= AE_WRITABLE;

            eventLoop->fired[j].fd = e->data.fd;
            eventLoop->fired[j].mask = mask;
        }
    }
    return numevents;
}
```

## 7.5 主事件循环

### 7.5.1 aeProcessEvents

```c
// ae.c:275-349
int aeProcessEvents(aeEventLoop *eventLoop, int flags)
{
    int processed = 0, numevents;

    if (!(flags & AE_TIME_EVENTS) && !(flags & AE_FILE_EVENTS))
        return 0;

    if (eventLoop->maxfd != -1 ||
        ((flags & AE_TIME_EVENTS) && !(flags & AE_DONT_WAIT))) {
        int j;
        aeTimeEvent *shortest = NULL;
        struct timeval tv, *tvp;

        // 查找最近的时间事件
        if (flags & AE_TIME_EVENTS && !(flags & AE_DONT_WAIT))
            shortest = aeSearchNearestTimer(eventLoop);

        if (shortest) {
            // 计算阻塞时间
            long now_sec, now_ms;
            aeGetTime(&now_sec, &now_ms);
            tvp = &tv;
            tvp->tv_sec = shortest->when_sec - now_sec;
            // ... 计算毫秒
        } else {
            if (flags & AE_DONT_WAIT) {
                tv.tv_sec = tv.tv_usec = 0;
                tvp = &tv;
            } else {
                tvp = NULL;  // 永久阻塞
            }
        }

        // 调用多路复用等待事件
        numevents = aeApiPoll(eventLoop, tvp);

        // 处理文件事件
        for (j = 0; j < numevents; j++) {
            aeFileEvent *fe = &eventLoop->events[eventLoop->fired[j].fd];
            int mask = eventLoop->fired[j].mask;
            int fd = eventLoop->fired[j].fd;
            int rfired = 0;

            if (fe->mask & mask & AE_READABLE) {
                rfired = 1;
                fe->rfileProc(eventLoop, fd, fe->clientData, mask);
            }
            if (fe->mask & mask & AE_WRITABLE) {
                if (!rfired || fe->wfileProc != fe->rfileProc)
                    fe->wfileProc(eventLoop, fd, fe->clientData, mask);
            }
            processed++;
        }
    }

    // 处理时间事件
    if (flags & AE_TIME_EVENTS)
        processed += processTimeEvents(eventLoop);

    return processed;
}
```

### 7.5.2 aeMain

```c
// ae.c:375-382
void aeMain(aeEventLoop *eventLoop) {
    eventLoop->stop = 0;
    while (!eventLoop->stop) {
        if (eventLoop->beforesleep != NULL)
            eventLoop->beforesleep(eventLoop);
        aeProcessEvents(eventLoop, AE_ALL_EVENTS);
    }
}
```

### 7.5.3 事件循环流程图

```
┌───────────────────────────────────────────────────────────┐
│                      aeMain()                             │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          v
┌───────────────────────────────────────────────────────────┐
│                  stop == 0 ?                              │
└─────────────────────────┬─────────────────────────────────┘
                          │ 是
                          v
┌───────────────────────────────────────────────────────────┐
│                  beforesleep()                            │
│                  (休眠前的处理)                            │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          v
┌───────────────────────────────────────────────────────────┐
│                aeProcessEvents()                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 1. 查找最近的时间事件                                │  │
│  │ 2. 计算阻塞超时                                      │  │
│  │ 3. aeApiPoll() 等待文件事件                          │  │
│  │ 4. 处理触发的文件事件                                │  │
│  │ 5. 处理到期的时间事件                                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          └──────────► (返回循环)
```

## 7.6 Redis 中的使用

### 7.6.1 注册监听 socket 事件

```c
// redis.c:1772-1773
if (aeCreateFileEvent(server.el, server.fd, AE_READABLE,
    acceptHandler, NULL) == AE_ERR) oom("creating file event");
```

### 7.6.2 注册客户端 socket 事件

```c
// redis.c (acceptHandler 中)
aeCreateFileEvent(server.el, fd, AE_READABLE,
    readQueryFromClient, c);
```

### 7.6.3 beforesleep 回调

```c
// redis.c:10851
aeSetBeforeSleepProc(server.el, beforeSleep);

// beforeSleep 处理：
// - 刷新 AOF 缓冲区
// - 处理 VM 就绪的客户端
// - 等等
```

## 7.7 小结

本章详细分析了 Redis 的事件驱动库 ae：

1. **事件循环**：统一管理文件事件和时间事件
2. **文件事件**：基于多路复用处理网络 IO
3. **时间事件**：执行定时任务，如 serverCron
4. **多路复用**：支持 select/epoll/kqueue
5. **主循环**：beforesleep + aeProcessEvents

ae 库是 Redis 高性能的核心，通过事件驱动架构实现了单线程下的高并发处理能力。下一章我们将学习 Redis 的网络抽象层 anet。