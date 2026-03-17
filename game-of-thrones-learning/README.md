# Game of Thrones English Learning Book Generator

生成《冰与火之歌》英语学习材料 - 像一个老师带读英文原版书。

## 功能特性

- **章节划分**: 按 POV 角色分章（PROLOGUE + 38 章）
- **段落级翻译**: 每个自然段独立翻译
- **重点单词**: 音标、释义、例句
- **短语/习语**: 常用表达讲解
- **剧情分析**: 段落级剧情讲解和拆解
- **交互式 HTML**: 点击显示翻译、单词卡片

## 安装

### 1. 创建虚拟环境（使用 pyenv）

```bash
cd /Volumes/data/src/ai-books/game-of-thrones-learning
pyenv local game-of-thrones-learning
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置 API Key

获取阿里云 DashScope API Key: https://dashscope.console.aliyun.com/apiKey

编辑 `.env` 文件：

```bash
# 将你的 API key 填入这里
API_KEY=sk-your-actual-api-key-here
```

## 使用方法

### 1. 列出所有章节

```bash
python scripts/list_chapters.py
```

输出示例：
```
Found 39 chapters:

  1. PROLOGUE (109 paragraphs)
  2. 1 - BRAN - BRAN (92 paragraphs)
  3. 2 - CATELYN - CATELYN (48 paragraphs)
  ...
```

### 2. 生成单个章节的学习材料

推荐使用优化版（批量处理，更快）：

```bash
# 生成 PROLOGUE（每次处理 10 个段落）
python scripts/generate_chapter_v2.py --chapter "PROLOGUE" --start 0 --end 10 --batch-size 5

# 生成第一章 (BRAN)
python scripts/generate_chapter_v2.py --chapter "1 - BRAN" --start 0 --end 20 --batch-size 10

# 分批生成整个章节
python scripts/generate_chapter_v2.py --chapter "PROLOGUE" --batch-size 10
```

### 3. 渲染为 HTML

```bash
python scripts/render_html.py --chapter "PROLOGUE"

# 直接在浏览器中打开
python scripts/render_html.py --chapter "PROLOGUE" --open
```

## 项目结构

```
game-of-thrones-learning/
├── scripts/
│   ├── list_chapters.py    # 列出章节清单
│   ├── generate_chapter.py # 生成章节学习材料
│   ├── render_html.py      # 渲染 HTML
│   └── test.py             # 测试脚本
├── prompts/
│   ├── translate.txt       # 翻译模板
│   ├── vocabulary.txt      # 词汇模板
│   ├── phrases.txt         # 短语模板
│   └── analysis.txt        # 分析模板
├── data/
│   ├── chapters/           # 生成的 JSON 内容
│   └── html/               # 生成的 HTML 文件
├── templates/
│   └── chapter.html        # HTML 模板
├── parser.py               # 章节解析器
├── config.py               # 配置
├── .env                    # 环境变量配置
├── .env.example            # 配置示例
└── requirements.txt        # 依赖
```

## 输出示例

每个章节生成的 JSON 包含：

```json
{
  "chapter": "PROLOGUE",
  "pov": null,
  "paragraphs": [
    {
      "id": 1,
      "original": "We should start back,\" Gared urged...",
      "translation": "「我们该回去了，」盖瑞催促道...",
      "vocabulary": [
        {"word": "urge", "phonetic": "/ɜːrdʒ/", "meaning": "敦促，力劝", "example": "He urged them to leave."}
      ],
      "phrases": [
        {"phrase": "start back", "meaning": "返回，回去"}
      ],
      "notes": "场景设定：三个守夜人巡逻归来，气氛阴森。"
    }
  ],
  "chapter_summary": "本章概要...",
  "character_notes": "人物说明..."
}
```

## HTML 功能

- 点击"显示翻译"查看中英文对照
- 点击单词芯片查看详细信息（音标、释义、例句）
- 短语/习语悬停显示释义
- 段落级剧情分析

## 故障排除

### API Key 错误

确保你的 API key 正确配置：

```bash
# 测试 API 连接
python -c "import dashscope; dashscope.api_key='sk-xxx'; print(dashscope.Generation.call(model='qwen-plus', messages=[{'role': 'user', 'content': 'hello'}]))"
```

### 章节未找到

确认章节 ID 正确（大小写敏感）：

```bash
python scripts/list_chapters.py  # 查看可用章节
```

## 使用示例

```bash
# 完整流程示例
cd /Volumes/data/src/ai-books/game-of-thrones-learning

# 1. 查看章节列表
python scripts/list_chapters.py

# 2. 生成序幕
python scripts/generate_chapter.py --chapter "PROLOGUE"

# 3. 渲染 HTML 并打开
python scripts/render_html.py --chapter "PROLOGUE" --open

# 4. 继续生成下一章
python scripts/generate_chapter.py --chapter "1 - BRAN"
python scripts/render_html.py --chapter "1-BRAN" --open
```
