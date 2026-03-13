# 第23章：完整请求处理流程

本章将从 socket 到命令执行，完整追踪一个 Redis 请求的处理流程。

## 23.1 流程概览

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Redis 服务器                                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        事件循环 (aeMain)                         │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │                     aeProcessEvents                       │  │   │
│  │  │                                                           │  │   │
│  │  │  ┌─────────────────┐      ┌─────────────────────────────┐ │  │   │
│  │  │  │   文件事件       │      │     时间事件                │ │  │   │
│  │  │  │ acceptHandler   │      │     serverCron             │ │  │   │
│  │  │  │ readQueryFrom...│      │                             │ │  │   │
│  │  │  │ sendReplyTo...  │      │                             │ │  │   │
│  │  │  └─────────────────┘      └─────────────────────────────┘ │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## 23.2 步骤详解

### 23.2.1 接受连接

```
客户端连接 ──► acceptHandler()
                    │
                    v
              anetAccept() ──► 获取 socket fd
                    │
                    v
              createClient()
                    │
                    ├──► 设置非阻塞
                    ├──► 初始化 redisClient
                    └──► 注册读事件 (readQueryFromClient)
```

### 23.2.2 读取请求

```
客户端发送数据 ──► readQueryFromClient()
                          │
                          v
                    read() ──► 读取到 querybuf
                          │
                          v
                    processInputBuffer()
                          │
                          ├──► 解析协议
                          └──► 提取命令参数到 argv
```

### 23.2.3 处理命令

```
processCommand()
    │
    v
lookupCommand() ──► 查找命令表
    │
    v
检查参数数量
    │
    v
检查权限 (requirepass)
    │
    v
检查内存限制
    │
    v
执行命令 ──► cmd->proc(c)
    │
    v
记录脏计数
    │
    v
传播到 AOF/从服务器
```

### 23.2.4 返回响应

```
addReply()
    │
    v
格式化响应
    │
    v
添加到 reply 链表
    │
    v
注册写事件 (sendReplyToClient)
    │
    v
sendReplyToClient()
    │
    v
write() ──► 发送到客户端
```

## 23.3 源码追踪：SET 命令

让我们追踪 `SET mykey myvalue` 的完整执行：

```c
// 1. 客户端发送数据
// "*3\r\n$3\r\nSET\r\n$5\r\nmykey\r\n$7\r\nmyvalue\r\n"

// 2. readQueryFromClient 读取
static void readQueryFromClient(aeEventLoop *el, int fd, void *privdata, int mask) {
    redisClient *c = privdata;
    char buf[REDIS_IOBUF_LEN];
    int nread;

    nread = read(fd, buf, REDIS_IOBUF_LEN);
    if (nread == -1) {
        if (errno == EAGAIN) return;
        freeClient(c);
        return;
    }
    if (nread == 0) {
        freeClient(c);
        return;
    }

    c->querybuf = sdscatlen(c->querybuf, buf, nread);
    processInputBuffer(c);
}

// 3. processInputBuffer 解析
static void processInputBuffer(redisClient *c) {
    // 解析 multi-bulk 协议
    // argc = 3
    // argv[0] = "SET"
    // argv[1] = "mykey"
    // argv[2] = "myvalue"

    processCommand(c);
}

// 4. processCommand 执行
static int processCommand(redisClient *c) {
    // 查找命令
    struct redisCommand *cmd = lookupCommand(c->argv[0]->ptr);

    // 执行命令
    cmd->proc(c);  // setCommand
}

// 5. setCommand
static void setCommand(redisClient *c) {
    setKey(c->db, c->argv[1], c->argv[2]);
    server.dirty++;
    addReply(c, shared.ok);
}

// 6. addReply
static void addReply(redisClient *c, robj *obj) {
    listAddNodeTail(c->reply, obj);
    aeCreateFileEvent(server.el, c->fd, AE_WRITABLE, sendReplyToClient, c);
}

// 7. sendReplyToClient
static void sendReplyToClient(aeEventLoop *el, int fd, void *privdata, int mask) {
    redisClient *c = privdata;
    // 发送 "+OK\r\n"
    write(fd, "+OK\r\n", 5);
}
```

## 23.4 小结

本章完整追踪了 Redis 请求的处理流程：

1. **接受连接**：acceptHandler → createClient
2. **读取请求**：readQueryFromClient → processInputBuffer
3. **处理命令**：processCommand → cmd->proc
4. **返回响应**：addReply → sendReplyToClient

理解这个流程对于掌握 Redis 的工作原理至关重要。