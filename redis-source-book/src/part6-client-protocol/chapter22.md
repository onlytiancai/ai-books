# 第22章：客户端实现

本章分析 Redis 客户端的实现细节。

## 22.1 redisClient 结构

```c
typedef struct redisClient {
    int fd;                 // socket 描述符
    redisDb *db;            // 当前数据库
    int dictid;             // 数据库 ID

    sds querybuf;           // 查询缓冲区
    robj **argv;            // 命令参数
    int argc;               // 参数数量

    int bulklen;            // bulk 读取长度
    int multibulk;          // multi-bulk 计数

    list *reply;            // 回复链表
    int sentlen;            // 已发送长度

    time_t lastinteraction; // 最后交互时间
    int flags;              // 客户端标志

    multiState mstate;      // 事务状态
    // ...
} redisClient;
```

## 22.2 连接处理

### 22.2.1 接受连接

```c
static void acceptHandler(aeEventLoop *el, int fd, void *privdata, int mask) {
    char cip[128];
    int cport, cfd;

    cfd = anetAccept(server.neterr, fd, cip, &cport);
    if (cfd == AE_ERR) return;

    redisLog(REDIS_VERBOSE, "Accepted %s:%d", cip, cport);

    if (createClient(cfd) == NULL) {
        redisLog(REDIS_WARNING, "Error allocating resources for the client");
        close(cfd);
    }
}
```

### 22.2.2 创建客户端

```c
static redisClient *createClient(int fd) {
    redisClient *c = zmalloc(sizeof(*c));

    // 设置非阻塞
    anetNonBlock(NULL, fd);
    anetTcpNoDelay(NULL, fd);

    // 初始化字段
    c->fd = fd;
    c->db = server.db;
    c->querybuf = sdsempty();
    c->argc = 0;
    c->argv = NULL;
    c->bulklen = -1;
    c->multibulk = 0;
    c->reply = listCreate();
    c->sentlen = 0;
    c->flags = 0;
    c->lastinteraction = time(NULL);

    // 注册读事件
    if (aeCreateFileEvent(server.el, fd, AE_READABLE,
        readQueryFromClient, c) == AE_ERR) {
        close(fd);
        zfree(c);
        return NULL;
    }

    // 添加到客户端列表
    listAddNodeTail(server.clients, c);

    return c;
}
```

## 22.3 回复缓冲区

### 22.3.1 添加回复

```c
static void addReply(redisClient *c, robj *obj) {
    if (listLength(c->reply) == 0 &&
        sdslen(obj->ptr) < REDIS_REPLY_CHUNK_BYTES) {
        // 小回复直接添加
        c->reply_bytes += sdslen(obj->ptr);
        listAddNodeTail(c->reply, obj);
        incrRefCount(obj);
    } else {
        // 大回复分块添加
        // ...
    }

    // 注册写事件
    if (aeCreateFileEvent(server.el, c->fd, AE_WRITABLE,
        sendReplyToClient, c) == AE_ERR) {
        freeClient(c);
    }
}
```

### 22.3.2 发送回复

```c
static void sendReplyToClient(aeEventLoop *el, int fd, void *privdata, int mask) {
    redisClient *c = privdata;
    int nwritten = 0, totwritten = 0;

    while (listLength(c->reply)) {
        robj *o = listNodeValue(listFirst(c->reply));
        int objlen = sdslen(o->ptr);

        if (objlen == 0) {
            listDelNode(c->reply, listFirst(c->reply));
            continue;
        }

        nwritten = write(fd, (char*)o->ptr + c->sentlen, objlen - c->sentlen);
        if (nwritten <= 0) break;

        c->sentlen += nwritten;
        totwritten += nwritten;

        if (c->sentlen == objlen) {
            listDelNode(c->reply, listFirst(c->reply));
            c->sentlen = 0;
        }

        // 限制每次发送的数据量
        if (totwritten > REDIS_MAX_WRITE_PER_EVENT) break;
    }

    if (listLength(c->reply) == 0) {
        c->sentlen = 0;
        aeDeleteFileEvent(server.el, c->fd, AE_WRITABLE);
    }
}
```

## 22.4 客户端生命周期

```
┌──────────────┐
│  连接建立     │ acceptHandler
└──────┬───────┘
       │
       v
┌──────────────┐
│  创建客户端   │ createClient
└──────┬───────┘
       │
       v
┌──────────────┐
│  处理请求     │ readQueryFromClient
└──────┬───────┘
       │
       v
┌──────────────┐
│  发送回复     │ sendReplyToClient
└──────┬───────┘
       │
       v
┌──────────────┐
│  断开连接     │ freeClient
└──────────────┘
```

## 22.5 小结

本章分析了 Redis 客户端的实现：

1. **redisClient 结构**：存储客户端状态
2. **连接处理**：接受和创建客户端
3. **回复缓冲区**：管理待发送的数据
4. **生命周期**：从连接到断开