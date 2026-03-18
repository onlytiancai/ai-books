# 线性代数小书 - 中文翻译版

> 原书：[The Little Book of Linear Algebra](https://github.com/little-book-of/linear-algebra)

## 项目说明

本项目将英文版线性代数教程翻译为中文，特点：
- **重写而非直译** - 用适合中文读者的表达方式呈现
- **练习题详解** - 所有 "Try It Yourself" 练习配有完整解答
- **Python 代码示例** - 每节包含 numpy 代码演示

## 目录结构

```
linear-algebra/
├── .env                    # API 配置（需自行创建）
├── .env.example            # API 配置模板
├── translate.py            # 翻译脚本
├── translation-progress.json  # 翻译进度
├── requirements.txt        # Python 依赖
├── src/
│   ├── SUMMARY.md          # 英文版目录
│   ├── chapter-XX/         # 英文章节
│   └── zh/                 # 中文翻译
│       ├── SUMMARY.md      # 中文版目录
│       └── chapter-XX/     # 中文章节
└── book.toml               # mdBook 配置
```

## 快速开始

### 1. 创建虚拟环境

```bash
python3 -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置 API

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API 配置：

```env
OPENAI_API_KEY=your-api-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
```

支持任何兼容 OpenAI 接口的服务，如：
- OpenAI: `https://api.openai.com/v1`
- 阿里云通义千问: `https://coding.dashscope.aliyuncs.com/v1`
- 其他兼容服务...

### 4. 运行翻译

```bash
# 查看当前进度
python translate.py --status

# 翻译所有剩余章节
python translate.py

# 翻译指定章节
python translate.py --section 1

# 强制重新翻译
python translate.py --section 1 --force

# 从上次中断处继续
python translate.py --resume
```

### 5. 构建书籍

```bash
# 安装 mdBook
cargo install mdbook

# 构建中文版
cd src/zh && mdbook build
```

## 翻译说明

翻译脚本会：
1. 读取英文原文章节
2. 调用 AI API 进行翻译改写
3. 保持 LaTeX 公式不变
4. 添加练习题解答
5. 添加 Python 代码示例
6. 保存到 `src/zh/` 目录

## 进度追踪

翻译进度保存在 `translation-progress.json`：

```json
{
  "total": 100,
  "completed": [1, 2, 3],
  "in_progress": null,
  "failed": [],
  "last_updated": "2024-01-01T12:00:00"
}
```

## 许可证

遵循原书许可证。