# 附录：参考资料

## 官方资源

- [Redis 官网](https://redis.io/)
- [Redis GitHub](https://github.com/redis/redis)
- [Redis 文档](https://redis.io/documentation)

## 源码阅读

- Redis 2.0.0 源码：`git clone https://github.com/redis/redis.git && git checkout 2.0.0`

## 推荐书籍

- 《Redis 设计与实现》- 黄健宏
- 《Redis 开发与运维》- 付磊、张益军

## 相关文章

- Redis 官方博客
- antirez 的博客

## 社区资源

- Redis GitHub Discussions
- Stack Overflow redis 标签

## 版本历史

| 版本 | 发布时间 | 主要特性 |
|------|----------|----------|
| 1.0.0 | 2009 | 初始版本 |
| 2.0.0 | 2010 | 虚拟内存、阻塞操作 |
| 3.0.0 | 2015 | Redis Cluster |
| 4.0.0 | 2017 | 模块系统 |
| 5.0.0 | 2018 | Streams |
| 6.0.0 | 2020 | 多线程 IO |
| 7.0.0 | 2022 | Functions |

## 调试技巧

### 使用 GDB

```bash
# 编译调试版本
make CFLAGS="-g -O0"

# 启动调试
gdb ./redis-server

# 常用命令
(gdb) break main
(gdb) break setCommand
(gdb) run redis.conf
```

### 打印日志

```c
redisLog(REDIS_WARNING, "Debug: key = %s", key->ptr);
```

## 关于本书

本书基于 Redis 2.0.0 源码编写，旨在帮助读者理解 Redis 的核心设计与实现。

---

感谢阅读！