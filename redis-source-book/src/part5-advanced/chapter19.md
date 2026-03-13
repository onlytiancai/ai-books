# 第19章：发布订阅 (Pub/Sub)

Redis 提供了发布订阅功能，允许客户端订阅频道接收消息。

## 19.1 频道订阅

### 19.1.1 数据结构

```c
// 服务器维护频道到订阅者的映射
dict *pubsub_channels;  // channel -> list of clients

// 客户端维护订阅的频道
dict *pubsub_channels;  // client 订阅的频道
list *pubsub_patterns;  // client 订阅的模式
```

### 19.1.2 SUBSCRIBE 命令

```c
static void subscribeCommand(redisClient *c) {
    for (int j = 1; j < c->argc; j++) {
        pubsubSubscribeChannel(c, c->argv[j]);
    }
}

static int pubsubSubscribeChannel(redisClient *c, robj *channel) {
    dictEntry *de;
    list *clients = NULL;
    int retval = 0;

    // 添加到客户端的订阅列表
    if (dictAdd(c->pubsub_channels, channel, NULL) == DICT_OK) {
        retval = 1;
        incrRefCount(channel);

        // 添加到服务器的频道映射
        de = dictFind(server.pubsub_channels, channel);
        if (de == NULL) {
            clients = listCreate();
            dictAdd(server.pubsub_channels, channel, clients);
            incrRefCount(channel);
        } else {
            clients = dictGetEntryVal(de);
        }
        listAddNodeTail(clients, c);
    }

    // 返回确认消息
    addReply(c, shared.mbulk3);
    addReply(c, shared.subscribebulk);
    addReplyBulk(c, channel);
    addReplyLongLong(c, dictSize(c->pubsub_channels) + listLength(c->pubsub_patterns));

    return retval;
}
```

## 19.2 模式订阅

### 19.2.1 PSUBSCRIBE 命令

```c
static void psubscribeCommand(redisClient *c) {
    for (int j = 1; j < c->argc; j++) {
        pubsubSubscribePattern(c, c->argv[j]);
    }
}

static int pubsubSubscribePattern(redisClient *c, robj *pattern) {
    if (listSearchKey(c->pubsub_patterns, pattern) == NULL) {
        pubsubPattern *pat;

        // 添加到客户端的模式列表
        listAddNodeTail(c->pubsub_patterns, pattern);
        incrRefCount(pattern);

        // 添加到服务器的模式列表
        pat = zmalloc(sizeof(*pat));
        pat->pattern = getDecodedObject(pattern);
        pat->client = c;
        listAddNodeTail(server.pubsub_patterns, pat);
    }

    // 返回确认消息
    // ...
}
```

## 19.3 消息发布

### 19.3.1 PUBLISH 命令

```c
static void publishCommand(redisClient *c) {
    int receivers = pubsubPublishMessage(c->argv[1], c->argv[2]);
    addReplyLongLong(c, receivers);
}

static int pubsubPublishMessage(robj *channel, robj *message) {
    int receivers = 0;
    dictEntry *de;
    listNode *ln;
    listIter li;

    // 发送给订阅该频道的客户端
    de = dictFind(server.pubsub_channels, channel);
    if (de) {
        list *list = dictGetEntryVal(de);
        listRewind(list, &li);
        while ((ln = listNext(&li)) != NULL) {
            redisClient *c = ln->value;
            addReply(c, shared.mbulk3);
            addReply(c, shared.messagebulk);
            addReplyBulk(c, channel);
            addReplyBulk(c, message);
            receivers++;
        }
    }

    // 发送给匹配模式的客户端
    if (listLength(server.pubsub_patterns)) {
        listRewind(server.pubsub_patterns, &li);
        while ((ln = listNext(&li)) != NULL) {
            pubsubPattern *pat = ln->value;
            if (stringmatchlen((char*)pat->pattern->ptr,
                               sdslen(pat->pattern->ptr),
                               (char*)channel->ptr,
                               sdslen(channel->ptr), 0)) {
                addReply(pat->client, shared.mbulk4);
                addReply(pat->client, shared.pmessagebulk);
                addReplyBulk(pat->client, pat->pattern);
                addReplyBulk(pat->client, channel);
                addReplyBulk(pat->client, message);
                receivers++;
            }
        }
    }

    return receivers;
}
```

## 19.4 退订

### 19.4.1 UNSUBSCRIBE 命令

```c
static void unsubscribeCommand(redisClient *c) {
    if (c->argc == 1) {
        pubsubUnsubscribeAllChannels(c, 1);
    } else {
        for (int j = 1; j < c->argc; j++) {
            pubsubUnsubscribeChannel(c, c->argv[j], 1);
        }
    }
}
```

## 19.5 小结

本章分析了 Redis 发布订阅功能的实现：

1. **频道订阅**：SUBSCRIBE/UNSUBSCRIBE
2. **模式订阅**：PSUBSCRIBE/PUNSUBSCRIBE
3. **消息发布**：PUBLISH
4. **数据结构**：字典和链表维护订阅关系