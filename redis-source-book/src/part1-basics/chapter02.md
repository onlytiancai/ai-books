# 第2章：整体架构

本章从宏观层面分析 Redis 的整体架构设计，帮助你建立对 Redis 工作原理的整体认识。

## 2.1 单线程模型

Redis 采用单线程模型处理客户端请求，这是 Redis 设计的核心特点之一。

### 2.1.1 为什么是单线程？

单线程模型的优势：

1. **无锁竞争**：不需要为共享数据加锁，避免了锁带来的开销
2. **无上下文切换**：没有多线程切换的开销
3. **实现简单**：代码逻辑清晰，易于维护
4. **CPU 缓存友好**：单线程可以更好地利用 CPU 缓存

### 2.1.2 单线程为什么还很快？

Redis 之所以快速，主要原因：

1. **纯内存操作**：数据存储在内存中，访问速度极快
2. **非阻塞 IO**：使用多路复用技术，高效处理大量连接
3. **高效的数据结构**：为不同场景选择最优的数据结构
4. **避免不必要的系统调用**：尽量减少内核态和用户态的切换

### 2.1.3 单线程的限制

单线程模型也有一些限制：

- **CPU 密集型操作**：大 key 的操作会阻塞其他请求
- **无法利用多核**：单个 Redis 实例只能使用一个 CPU 核心

## 2.2 事件驱动架构概览

Redis 基于 **事件驱动（Event-Driven）** 架构，核心是事件循环（Event Loop）。

```
┌─────────────────────────────────────────────────────────┐
│                     Event Loop                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              aeProcessEvents()                    │  │
│  │                                                   │  │
│  │   ┌─────────────┐      ┌─────────────────────┐  │  │
│  │   │ File Events │      │   Time Events       │  │  │
│  │   │ (IO 操作)    │      │   (定时任务)         │  │  │
│  │   └──────┬──────┘      └──────────┬──────────┘  │  │
│  │          │                        │              │  │
│  │          v                        v              │  │
│  │   ┌─────────────────────────────────────────┐   │  │
│  │   │         Multiplexing (多路复用)          │   │  │
│  │   │      epoll / kqueue / select            │   │  │
│  │   └─────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 文件事件（File Event）

文件事件处理网络 IO 操作：

- **可读事件（AE_READABLE）**：有数据可读（客户端发来请求）
- **可写事件（AE_WRITABLE）**：可以写数据（向客户端发送响应）

### 时间事件（Time Event）

时间事件处理定时任务：

- **serverCron**：每秒执行多次，处理过期 key、保存数据等

## 2.3 核心数据结构关系图

Redis 的核心数据结构之间的关系：

```
┌─────────────────────────────────────────────────────────────┐
│                      redisServer                            │
│  (全局服务器状态)                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  db[] ──────► ┌─────────────────────────────────────────┐  │
│               │              redisDb                    │  │
│               │  (数据库，默认16个)                       │  │
│               ├─────────────────────────────────────────┤  │
│               │  dict *dict;   ──► 键空间（存储所有key）  │  │
│               │  dict *expires; ──► 过期时间表           │  │
│               └─────────────────────────────────────────┘  │
│                                                             │
│  clients ───► list ──► redisClient ──► redisClient ──► ... │
│               (客户端链表)                                   │
│                                                             │
│  el ────────► aeEventLoop (事件循环)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### redisObject 结构

所有 Redis 值都封装在 `redisObject` 中：

```c
typedef struct redisObject {
    void *ptr;           // 指向实际数据的指针
    unsigned char type;  // 类型：STRING, LIST, SET, ZSET, HASH
    unsigned char encoding; // 编码方式
    unsigned char storage;  // 存储位置（VM 相关）
    unsigned char vtype;    // 值类型（VM 相关）
    int refcount;        // 引用计数
    struct redisObjectVM vm; // VM 信息
} robj;
```

### 数据类型与编码

```
┌─────────────┬──────────────────────────────────────────────┐
│   类型       │              可能的编码                       │
├─────────────┼──────────────────────────────────────────────┤
│  STRING     │  REDIS_ENCODING_INT (整数)                   │
│             │  REDIS_ENCODING_RAW (SDS 字符串)              │
├─────────────┼──────────────────────────────────────────────┤
│  LIST       │  双向链表 (adlist)                           │
├─────────────┼──────────────────────────────────────────────┤
│  SET        │  哈希表 (dict)                               │
├─────────────┼──────────────────────────────────────────────┤
│  ZSET       │  跳表 (skiplist) + 哈希表                    │
├─────────────┼──────────────────────────────────────────────┤
│  HASH       │  zipmap (小规模) / 哈希表 (dict)             │
└─────────────┴──────────────────────────────────────────────┘
```

## 2.4 请求处理流程

从客户端发送命令到服务器返回结果，完整流程如下：

```
  客户端                              服务器
    │                                   │
    │  1. 发送命令                       │
    │  ──────────────────────────────►  │
    │                                   │
    │                          ┌───────┴───────┐
    │                          │  acceptHandler │  接收连接
    │                          └───────┬───────┘
    │                                  │
    │                          ┌───────┴───────┐
    │                          │ createClient  │  创建客户端
    │                          └───────┬───────┘
    │                                  │
    │                          ┌───────┴───────────┐
    │                          │ readQueryFromClient│  读取请求
    │                          └───────┬───────────┘
    │                                  │
    │                          ┌───────┴──────────┐
    │                          │processInputBuffer│  解析命令
    │                          └───────┬──────────┘
    │                                  │
    │                          ┌───────┴───────┐
    │                          │ processCommand│  处理命令
    │                          └───────┬───────┘
    │                                  │
    │                          ┌───────┴───────┐
    │                          │  setCommand   │  执行具体命令
    │                          │  getCommand   │
    │                          │  ...          │
    │                          └───────┬───────┘
    │                                  │
    │                          ┌───────┴───────┐
    │                          │   addReply    │  添加响应
    │                          └───────┬───────┘
    │                                  │
    │  6. 接收响应              ┌───────┴──────────┐
    │  ◄──────────────────────  │sendReplyToClient │  发送响应
    │                          └──────────────────┘
    │                                   │
```

## 2.5 main() 函数分析

让我们看一下 Redis 的启动流程，`main()` 函数位于 `redis.c:10821`：

```c
int main(int argc, char **argv) {
    time_t start;

    // 1. 初始化服务器配置
    initServerConfig();

    // 2. 加载配置文件
    if (argc == 2) {
        resetServerSaveParams();
        loadServerConfig(argv[1]);
    }

    // 3. 守护进程模式
    if (server.daemonize) daemonize();

    // 4. 初始化服务器
    initServer();

    // 5. 加载数据
    if (server.appendonly) {
        loadAppendOnlyFile(server.appendfilename);
    } else {
        rdbLoad(server.dbfilename);
    }

    // 6. 进入事件循环
    aeSetBeforeSleepProc(server.el, beforeSleep);
    aeMain(server.el);

    // 7. 清理
    aeDeleteEventLoop(server.el);
    return 0;
}
```

启动流程图：

```
┌────────────────────┐
│ initServerConfig() │  初始化默认配置
└─────────┬──────────┘
          │
          v
┌────────────────────┐
│ loadServerConfig() │  加载配置文件
└─────────┬──────────┘
          │
          v
┌────────────────────┐
│    daemonize()     │  可选：转为守护进程
└─────────┬──────────┘
          │
          v
┌────────────────────┐
│   initServer()     │  初始化服务器
└─────────┬──────────┘
          │
          v
┌────────────────────┐
│ rdbLoad() /        │  从磁盘加载数据
│ loadAppendOnlyFile │
└─────────┬──────────┘
          │
          v
┌────────────────────┐
│    aeMain()        │  进入事件循环
└────────────────────┘
```

## 2.6 initServer() 初始化流程

`initServer()` 函数（`redis.c:1722`）完成服务器的初始化工作：

```c
static void initServer() {
    int j;

    // 1. 信号处理
    signal(SIGHUP, SIG_IGN);
    signal(SIGPIPE, SIG_IGN);
    setupSigSegvAction();

    // 2. 创建数据结构
    server.clients = listCreate();
    server.slaves = listCreate();
    server.monitors = listCreate();
    server.objfreelist = listCreate();

    // 3. 创建共享对象
    createSharedObjects();

    // 4. 创建事件循环
    server.el = aeCreateEventLoop();

    // 5. 初始化数据库
    server.db = zmalloc(sizeof(redisDb) * server.dbnum);
    for (j = 0; j < server.dbnum; j++) {
        server.db[j].dict = dictCreate(&dbDictType, NULL);
        server.db[j].expires = dictCreate(&keyptrDictType, NULL);
        server.db[j].blockingkeys = dictCreate(&keylistDictType, NULL);
        server.db[j].id = j;
    }

    // 6. 创建 TCP 监听 socket
    server.fd = anetTcpServer(server.neterr, server.port, server.bindaddr);

    // 7. 注册时间事件（定时任务）
    aeCreateTimeEvent(server.el, 1, serverCron, NULL, NULL);

    // 8. 注册文件事件（接受连接）
    aeCreateFileEvent(server.el, server.fd, AE_READABLE, acceptHandler, NULL);

    // 9. 初始化 AOF
    if (server.appendonly) {
        server.appendfd = open(server.appendfilename, O_WRONLY|O_APPEND|O_CREAT, 0644);
    }

    // 10. 初始化 VM（如果启用）
    if (server.vm_enabled) vmInit();
}
```

初始化完成后的状态：

```
┌─────────────────────────────────────────────────────────┐
│                     server (redisServer)                │
├─────────────────────────────────────────────────────────┤
│  fd = 6 (listening socket)                              │
│  port = 6379                                            │
│  dbnum = 16                                             │
│  db[0..15] ──► redisDb { dict, expires }               │
│  el ──► aeEventLoop                                     │
│         ├── timeEventHead ──► serverCron               │
│         └── events[6] ──► acceptHandler (AE_READABLE)  │
│  clients = empty list                                   │
└─────────────────────────────────────────────────────────┘
```

## 2.7 小结

本章介绍了 Redis 的整体架构：

- **单线程模型**：简洁高效，避免了锁的开销
- **事件驱动**：基于文件事件和时间事件处理所有 IO 和定时任务
- **核心数据结构**：redisServer、redisDb、redisObject 构成了 Redis 的骨架
- **启动流程**：从配置加载到事件循环的完整过程

接下来，我们将深入分析 Redis 的基础数据结构，从简单动态字符串（SDS）开始。