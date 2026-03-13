# 第1章：Redis 概述与环境搭建

## 1.1 Redis 是什么

Redis（Remote Dictionary Server）是一个开源的、基于内存的键值对存储系统。它可以用作：

- **数据库**：持久化存储数据
- **缓存**：加速数据访问
- **消息队列**：支持发布订阅模式

Redis 的主要特点：

| 特点 | 说明 |
|------|------|
| 高性能 | 基于内存操作，单机 QPS 可达 10 万+ |
| 丰富数据类型 | 支持字符串、列表、集合、有序集合、哈希等 |
| 原子操作 | 所有操作都是原子性的 |
| 持久化 | 支持 RDB 和 AOF 两种持久化方式 |
| 主从复制 | 支持一主多从的复制架构 |

## 1.2 版本选择：为什么选择 2.0.0

Redis 的版本演进：

```
1.0.0 (2009)  → 初始版本，基本功能
2.0.0 (2010)  → 稳定版本，包含核心特性
3.0.0 (2015)  → 引入 Redis Cluster
4.0.0 (2017)  → 引入模块系统
5.0.0 (2018)  → 引入 Streams 数据类型
6.0.0 (2020)  → 引入多线程 IO
7.0.0 (2022)  → 引入 Functions
```

选择 Redis 2.0.0 的原因：

1. **代码量适中**：核心代码约 1 万行，易于整体把握
2. **功能完整**：包含了 Redis 的核心特性
3. **结构清晰**：没有后续版本引入的复杂性
4. **设计精髓**：体现了 Redis 的核心设计哲学

## 1.3 源码目录结构

Redis 2.0.0 采用扁平的目录结构，所有源文件都在根目录：

```
redis-2.0.0/
├── redis.c          # 主程序，核心逻辑 (~10800行)
├── redis.h          # 主头文件
├── sds.c/h          # 简单动态字符串 (~300行)
├── adlist.c/h       # 双向链表 (~200行)
├── dict.c/h         # 字典/哈希表 (~500行)
├── ae.c/h           # 事件驱动库 (~400行)
├── ae_epoll.c       # epoll 实现
├── ae_kqueue.c      # kqueue 实现
├── ae_select.c      # select 实现
├── anet.c/h         # 网络抽象层 (~300行)
├── zmalloc.c/h      # 内存管理 (~150行)
├── zipmap.c/h       # 压缩映射 (~400行)
├── lzf.c/h          # LZF 压缩库
├── pqsort.c/h       # 部分快速排序
├── sha1.c/h         # SHA1 实现
├── config.h         # 配置检测
├── fmacros.h        # 功能宏
├── Makefile         # 构建文件
└── redis.conf       # 配置文件示例
```

### 核心文件说明

| 文件 | 功能 | 关键内容 |
|------|------|----------|
| redis.c | 主程序 | main()、命令处理、服务器逻辑 |
| sds.c | 动态字符串 | 字符串操作、内存管理 |
| adlist.c | 双向链表 | 列表数据结构实现 |
| dict.c | 字典 | 哈希表、渐进式 rehash |
| ae.c | 事件驱动 | 文件事件、时间事件 |
| anet.c | 网络 | TCP 连接、非阻塞 IO |
| zmalloc.c | 内存 | 内存分配、使用统计 |

## 1.4 编译与调试环境搭建

### 1.4.1 获取源码

```bash
# 从 GitHub 克隆
git clone https://github.com/redis/redis.git
cd redis
git checkout 2.0.0
```

### 1.4.2 编译

```bash
make
```

编译后会生成 `redis-server` 和 `redis-cli` 两个可执行文件。

### 1.4.3 运行 Redis

```bash
# 启动服务器（前台运行）
./redis-server

# 使用配置文件启动
./redis-server redis.conf

# 启动客户端连接
./redis-cli
```

### 1.4.4 调试环境

使用 GDB 调试 Redis：

```bash
# 编译调试版本
make CFLAGS="-g -O0"

# 使用 GDB 启动
gdb ./redis-server

# 常用 GDB 命令
(gdb) break main          # 在 main 函数设置断点
(gdb) break acceptHandler # 在连接处理函数设置断点
(gdb) run redis.conf      # 运行程序
(gdb) bt                  # 查看调用栈
(gdb) next                # 单步执行
(gdb) print variable      # 打印变量值
```

## 1.5 第一个 Redis 命令

让我们通过一个简单的例子来感受 Redis：

```bash
# 启动 redis-cli 连接到服务器
$ ./redis-cli

# 设置一个键值对
redis> SET mykey "Hello Redis"
OK

# 获取键值
redis> GET mykey
"Hello Redis"

# 查看键的类型
redis> TYPE mykey
string

# 查看服务器的信息
redis> INFO
```

### 命令执行流程概览

当你执行 `SET mykey "Hello Redis"` 时，Redis 内部发生了什么？

```
[客户端]                    [服务器]
   |                           |
   |--- "SET mykey ..." -----> |  1. 读取请求数据
   |                           |  2. 解析命令
   |                           |  3. 查找命令表
   |                           |  4. 执行 setCommand()
   |                           |  5. 存储键值到字典
   |<--- "+OK\r\n" ----------- |  6. 返回响应
   |                           |
```

我们将在后续章节详细分析每一步的实现细节。

## 1.6 小结

本章介绍了 Redis 的基本概念、为什么选择 2.0.0 版本进行学习，以及如何搭建编译和调试环境。接下来，我们将深入分析 Redis 的整体架构。