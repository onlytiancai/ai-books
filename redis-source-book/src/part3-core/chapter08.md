# 第8章：网络层 (anet)

anet（ANSI Network）是 Redis 的网络抽象层，封装了 TCP socket 操作，简化网络编程。

## 8.1 TCP 连接封装

anet 提供了简单的 TCP 客户端和服务端连接创建函数。

### 8.1.1 头文件概览

```c
// anet.h
#define ANET_OK 0
#define ANET_ERR -1
#define ANET_ERR_LEN 256

// 主要函数
int anetTcpConnect(char *err, char *addr, int port);
int anetTcpNonBlockConnect(char *err, char *addr, int port);
int anetTcpServer(char *err, int port, char *bindaddr);
int anetAccept(char *err, int serversock, char *ip, int *port);
int anetNonBlock(char *err, int fd);
int anetTcpNoDelay(char *err, int fd);
int anetTcpKeepAlive(char *err, int fd);
int anetRead(int fd, char *buf, int count);
int anetWrite(int fd, char *buf, int count);
int anetResolve(char *err, char *host, char *ipbuf);
```

### 8.1.2 错误处理

anet 使用统一的错误处理方式：

```c
// anet.c:48-56
static void anetSetError(char *err, const char *fmt, ...)
{
    va_list ap;

    if (!err) return;
    va_start(ap, fmt);
    vsnprintf(err, ANET_ERR_LEN, fmt, ap);
    va_end(ap);
}
```

使用示例：

```c
char err[ANET_ERR_LEN];
int fd = anetTcpServer(err, 6379, NULL);
if (fd == ANET_ERR) {
    printf("Error: %s\n", err);
    exit(1);
}
```

## 8.2 非阻塞 I/O

非阻塞 I/O 对于高并发服务器至关重要，避免了 accept/read/write 操作阻塞整个服务。

### 8.2.1 设置非阻塞

```c
// anet.c:58-74
int anetNonBlock(char *err, int fd)
{
    int flags;

    // 获取当前标志
    if ((flags = fcntl(fd, F_GETFL)) == -1) {
        anetSetError(err, "fcntl(F_GETFL): %s\n", strerror(errno));
        return ANET_ERR;
    }

    // 添加非阻塞标志
    if (fcntl(fd, F_SETFL, flags | O_NONBLOCK) == -1) {
        anetSetError(err, "fcntl(F_SETFL,O_NONBLOCK): %s\n", strerror(errno));
        return ANET_ERR;
    }

    return ANET_OK;
}
```

### 8.2.2 非阻塞连接

```c
// anet.c:128-168
#define ANET_CONNECT_NONE 0
#define ANET_CONNECT_NONBLOCK 1

static int anetTcpGenericConnect(char *err, char *addr, int port, int flags)
{
    int s, on = 1;
    struct sockaddr_in sa;

    // 创建 socket
    if ((s = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        anetSetError(err, "creating socket: %s\n", strerror(errno));
        return ANET_ERR;
    }

    // 设置地址复用
    setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));

    // 解析地址
    sa.sin_family = AF_INET;
    sa.sin_port = htons(port);
    if (inet_aton(addr, &sa.sin_addr) == 0) {
        struct hostent *he;
        he = gethostbyname(addr);
        if (he == NULL) {
            anetSetError(err, "can't resolve: %s\n", addr);
            close(s);
            return ANET_ERR;
        }
        memcpy(&sa.sin_addr, he->h_addr, sizeof(struct in_addr));
    }

    // 如果是非阻塞模式，先设置非阻塞
    if (flags & ANET_CONNECT_NONBLOCK) {
        if (anetNonBlock(err, s) != ANET_OK)
            return ANET_ERR;
    }

    // 发起连接
    if (connect(s, (struct sockaddr*)&sa, sizeof(sa)) == -1) {
        // 非阻塞连接可能返回 EINPROGRESS
        if (errno == EINPROGRESS && flags & ANET_CONNECT_NONBLOCK)
            return s;

        anetSetError(err, "connect: %s\n", strerror(errno));
        close(s);
        return ANET_ERR;
    }

    return s;
}
```

### 8.2.3 阻塞 vs 非阻塞

```
阻塞模式：
┌─────────┐                    ┌─────────┐
│  客户端  │ ──── connect() ──► │  服务端  │
└─────────┘      等待...        └─────────┘
                  │
                  v
             连接成功或失败

非阻塞模式：
┌─────────┐                    ┌─────────┐
│  客户端  │ ──── connect() ──► │  服务端  │
└─────────┘     立即返回         └─────────┘
     │        EINPROGRESS
     │            │
     └── 做其他事情 ──► 使用 select/poll/epoll 检测连接状态
```

## 8.3 accept/read/write 封装

### 8.3.1 创建 TCP 服务器

```c
// anet.c:210-246
int anetTcpServer(char *err, int port, char *bindaddr)
{
    int s, on = 1;
    struct sockaddr_in sa;

    // 创建 socket
    if ((s = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        anetSetError(err, "socket: %s\n", strerror(errno));
        return ANET_ERR;
    }

    // 设置地址复用
    if (setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on)) == -1) {
        anetSetError(err, "setsockopt SO_REUSEADDR: %s\n", strerror(errno));
        close(s);
        return ANET_ERR;
    }

    // 绑定地址和端口
    memset(&sa, 0, sizeof(sa));
    sa.sin_family = AF_INET;
    sa.sin_port = htons(port);
    sa.sin_addr.s_addr = htonl(INADDR_ANY);
    if (bindaddr) {
        if (inet_aton(bindaddr, &sa.sin_addr) == 0) {
            anetSetError(err, "Invalid bind address\n");
            close(s);
            return ANET_ERR;
        }
    }

    // 绑定
    if (bind(s, (struct sockaddr*)&sa, sizeof(sa)) == -1) {
        anetSetError(err, "bind: %s\n", strerror(errno));
        close(s);
        return ANET_ERR;
    }

    // 监听（backlog = 511，来自 nginx）
    if (listen(s, 511) == -1) {
        anetSetError(err, "listen: %s\n", strerror(errno));
        close(s);
        return ANET_ERR;
    }

    return s;
}
```

### 8.3.2 接受连接

```c
// anet.c:248-270
int anetAccept(char *err, int serversock, char *ip, int *port)
{
    int fd;
    struct sockaddr_in sa;
    unsigned int saLen;

    while(1) {
        saLen = sizeof(sa);
        fd = accept(serversock, (struct sockaddr*)&sa, &saLen);
        if (fd == -1) {
            if (errno == EINTR)  // 被信号中断，重试
                continue;
            else {
                anetSetError(err, "accept: %s\n", strerror(errno));
                return ANET_ERR;
            }
        }
        break;
    }

    // 返回客户端 IP 和端口
    if (ip) strcpy(ip, inet_ntoa(sa.sin_addr));
    if (port) *port = ntohs(sa.sin_port);

    return fd;
}
```

### 8.3.3 完整读取

```c
// anet.c:182-193
int anetRead(int fd, char *buf, int count)
{
    int nread, totlen = 0;
    while(totlen != count) {
        nread = read(fd, buf, count - totlen);
        if (nread == 0) return totlen;  // EOF
        if (nread == -1) return -1;      // 错误
        totlen += nread;
        buf += nread;
    }
    return totlen;
}
```

### 8.3.4 完整写入

```c
// anet.c:197-208
int anetWrite(int fd, char *buf, int count)
{
    int nwritten, totlen = 0;
    while(totlen != count) {
        nwritten = write(fd, buf, count - totlen);
        if (nwritten == 0) return totlen;
        if (nwritten == -1) return -1;
        totlen += nwritten;
        buf += nwritten;
    }
    return totlen;
}
```

## 8.4 TCP 选项设置

### 8.4.1 TCP_NODELAY

禁用 Nagle 算法，减少小包延迟：

```c
// anet.c:76-85
int anetTcpNoDelay(char *err, int fd)
{
    int yes = 1;
    if (setsockopt(fd, IPPROTO_TCP, TCP_NODELAY, &yes, sizeof(yes)) == -1)
    {
        anetSetError(err, "setsockopt TCP_NODELAY: %s\n", strerror(errno));
        return ANET_ERR;
    }
    return ANET_OK;
}
```

### 8.4.2 SO_KEEPALIVE

启用 TCP 保活机制：

```c
// anet.c:97-105
int anetTcpKeepAlive(char *err, int fd)
{
    int yes = 1;
    if (setsockopt(fd, SOL_SOCKET, SO_KEEPALIVE, &yes, sizeof(yes)) == -1) {
        anetSetError(err, "setsockopt SO_KEEPALIVE: %s\n", strerror(errno));
        return ANET_ERR;
    }
    return ANET_OK;
}
```

### 8.4.3 SO_SNDBUF

设置发送缓冲区大小：

```c
// anet.c:87-95
int anetSetSendBuffer(char *err, int fd, int buffsize)
{
    if (setsockopt(fd, SOL_SOCKET, SO_SNDBUF, &buffsize, sizeof(buffsize)) == -1)
    {
        anetSetError(err, "setsockopt SO_SNDBUF: %s\n", strerror(errno));
        return ANET_ERR;
    }
    return ANET_OK;
}
```

## 8.5 DNS 解析

```c
// anet.c:107-124
int anetResolve(char *err, char *host, char *ipbuf)
{
    struct sockaddr_in sa;

    sa.sin_family = AF_INET;
    // 尝试直接解析 IP 地址
    if (inet_aton(host, &sa.sin_addr) == 0) {
        struct hostent *he;

        // 使用 DNS 解析域名
        he = gethostbyname(host);
        if (he == NULL) {
            anetSetError(err, "can't resolve: %s\n", host);
            return ANET_ERR;
        }
        memcpy(&sa.sin_addr, he->h_addr, sizeof(struct in_addr));
    }

    // 转换为字符串形式的 IP
    strcpy(ipbuf, inet_ntoa(sa.sin_addr));
    return ANET_OK;
}
```

## 8.6 Redis 中的使用

### 8.6.1 创建监听 socket

```c
// redis.c:1742
server.fd = anetTcpServer(server.neterr, server.port, server.bindaddr);
if (server.fd == -1) {
    redisLog(REDIS_WARNING, "Opening TCP port: %s", server.neterr);
    exit(1);
}
```

### 8.6.2 接受客户端连接

```c
// redis.c (acceptHandler)
static void acceptHandler(aeEventLoop *el, int fd, void *privdata, int mask) {
    char cip[128];
    int cport, cfd;

    // 接受连接
    cfd = anetAccept(server.neterr, fd, cip, &cport);
    if (cfd == AE_ERR) {
        redisLog(REDIS_VERBOSE,"Accepting client connection: %s", server.neterr);
        return;
    }

    redisLog(REDIS_VERBOSE,"Accepted %s:%d", cip, cport);

    // 创建客户端
    if (createClient(cfd) == NULL) {
        redisLog(REDIS_WARNING,"Error allocating resources for the client");
        close(cfd);
        return;
    }
}
```

### 8.6.3 创建客户端

```c
// redis.c
static redisClient *createClient(int fd) {
    redisClient *c = zmalloc(sizeof(*c));

    // 设置非阻塞
    anetNonBlock(NULL, fd);
    anetTcpNoDelay(NULL, fd);

    // ... 其他初始化

    // 注册读事件
    if (aeCreateFileEvent(server.el, fd, AE_READABLE,
        readQueryFromClient, c) == AE_ERR)
    {
        close(fd);
        zfree(c);
        return NULL;
    }

    return c;
}
```

## 8.7 网络流程图

```
服务器启动流程：
┌─────────────────┐
│ anetTcpServer() │ ──► 创建 socket, bind, listen
└────────┬────────┘
         │ fd (listening socket)
         v
┌─────────────────┐
│ aeCreateFileEvent│ ──► 注册读事件
└────────┬────────┘
         │
         v
┌─────────────────┐
│   aeMain()      │ ──► 进入事件循环
└─────────────────┘


接受连接流程：
┌─────────────────┐
│ acceptHandler() │ ◄─── 读事件触发
└────────┬────────┘
         │
         v
┌─────────────────┐
│ anetAccept()    │ ──► accept() 获取新连接
└────────┬────────┘
         │ fd (client socket)
         v
┌─────────────────┐
│ anetNonBlock()  │ ──► 设置非阻塞
└────────┬────────┘
         │
         v
┌─────────────────┐
│ createClient()  │ ──► 创建客户端对象
└────────┬────────┘
         │
         v
┌─────────────────┐
│ aeCreateFileEvent│ ──► 注册客户端读事件
└─────────────────┘
```

## 8.8 小结

本章分析了 Redis 的网络抽象层 anet：

1. **TCP 封装**：简化 socket 创建、连接、监听
2. **非阻塞 IO**：支持高并发连接处理
3. **完整读写**：确保数据完整发送/接收
4. **TCP 选项**：TCP_NODELAY、SO_KEEPALIVE 等优化
5. **错误处理**：统一的错误信息返回机制

anet 为 Redis 提供了简洁高效的网络编程接口，配合 ae 事件驱动库实现了高性能的网络服务。下一章我们将学习 Redis 的内存管理模块 zmalloc。