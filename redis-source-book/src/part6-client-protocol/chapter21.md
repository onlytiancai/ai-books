# 第21章：协议解析

Redis 使用自定义的文本协议，简单高效。

## 21.1 协议类型

### 21.1.1 Inline 协议

简单命令使用空格分隔：

```
SET mykey myvalue
GET mykey
```

### 21.1.2 Bulk 协议

二进制安全的字符串传输：

```
$6\r\nmyvalue\r\n
```

### 21.1.3 Multi-bulk 协议

命令的标准格式：

```
*3\r\n$3\r\nSET\r\n$5\r\nmykey\r\n$7\r\nmyvalue\r\n
```

## 21.2 命令解析

### 21.2.1 processInputBuffer

```c
static void processInputBuffer(redisClient *c) {
    while (sdslen(c->querybuf)) {
        // 判断协议类型
        if (c->bulklen == -1) {
            // 查找换行符
            char *p = strchr(c->querybuf, '\n');
            if (p == NULL) break;

            if (c->querybuf[0] == '*') {
                // Multi-bulk 协议
                c->multibulk = atoi(c->querybuf + 1);
            } else {
                // Inline 协议
                c->multibulk = 1;
            }
        }

        // 解析参数
        if (c->multibulk > 0) {
            if (c->bulklen == -1) {
                // 解析参数长度
                char *p = strchr(c->querybuf, '\n');
                if (p == NULL) break;

                if (c->querybuf[0] == '$') {
                    c->bulklen = atoi(c->querybuf + 1);
                }
                // 移除已解析的数据
                c->querybuf = sdsrange(c->querybuf, (p - c->querybuf) + 1, -1);
            } else {
                // 读取参数内容
                if (sdslen(c->querybuf) < (unsigned)c->bulklen + 2) break;

                c->argv[c->argc++] = createStringObject(c->querybuf, c->bulklen);
                c->querybuf = sdsrange(c->querybuf, c->bulklen + 2, -1);
                c->bulklen = -1;
                c->multibulk--;
            }
        }

        // 执行命令
        if (c->multibulk == 0) {
            if (processCommand(c) == REDIS_OK)
                resetClient(c);
        }
    }
}
```

## 21.3 响应格式

### 21.3.1 状态回复

```
+OK\r\n
```

### 21.3.2 错误回复

```
-ERR unknown command\r\n
```

### 21.3.3 整数回复

```
:100\r\n
```

### 21.3.4 批量回复

```
$6\r\nmyvalue\r\n
```

### 21.3.5 多条批量回复

```
*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n
```

## 21.4 小结

本章分析了 Redis 协议的设计和解析：

1. **协议类型**：Inline、Bulk、Multi-bulk
2. **命令解析**：processInputBuffer
3. **响应格式**：状态、错误、整数、批量