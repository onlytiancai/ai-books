# Game of Thrones English Learning Book Generator - 项目说明

## 项目完成状态

✅ **已完成功能**：
1. 章节解析 - 成功解析 39 个章节（PROLOGUE + 38 章）
2. 批量生成 - 使用优化的 API 调用（每批 10 段）
3. HTML 渲染 - 支持交互式翻译、单词卡片
4. 虚拟环境 - pyenv 配置完成

## 快速开始

```bash
# 进入项目目录
cd /Volumes/data/src/ai-books/game-of-thrones-learning

# 激活虚拟环境（已自动激活）
pyenv local game-of-thrones-learning

# 查看章节列表
python scripts/list_chapters.py

# 生成 PROLOGUE 前 10 段测试
python scripts/generate_chapter_v2.py --chapter "PROLOGUE" --start 0 --end 10 --batch-size 5

# 渲染 HTML 并查看
python scripts/render_html.py --chapter "PROLOGUE" --open
```

## 生成进度

| 章节 | 状态 | 段落数 |
|------|------|--------|
| PROLOGUE | 部分完成 | 10/109 |

## API 配置

当前配置：
- API Base URL: https://coding.dashscope.aliyuncs.com/v1
- Model: qwen3.5-plus
- API Key: 已配置

## 文件结构

```
game-of-thrones-learning/
├── scripts/
│   ├── list_chapters.py       # 列出章节
│   ├── generate_chapter.py    # 原始版本（单段调用）
│   ├── generate_chapter_v2.py # 优化版本（批量调用）✅
│   ├── render_html.py         # 渲染 HTML
│   └── test.py                # 测试脚本
├── prompts/
│   ├── translate.txt          # 翻译模板
│   ├── vocabulary.txt         # 词汇模板
│   ├── phrases.txt            # 短语模板
│   └── analysis.txt           # 分析模板
├── data/
│   ├── chapters/              # JSON 输出
│   │   └── PROLOGUE.json      # 已生成
│   └── html/                  # HTML 输出
│       └── PROLOGUE.html      # 已生成
├── templates/
│   └── chapter.html           # HTML 模板
├── parser.py                  # 章节解析器
├── config.py                  # 配置
├── .env                       # 环境变量
└── requirements.txt           # 依赖
```

## 使用示例

### 生成整个章节

```bash
# 生成整个 PROLOGUE（109 段，约需 11 次 API 调用）
python scripts/generate_chapter_v2.py --chapter "PROLOGUE" --batch-size 10

# 生成第一章 BRAN（92 段）
python scripts/generate_chapter_v2.py --chapter "1 - BRAN" --batch-size 10
```

### 分批生成（推荐）

```bash
# 第一次：生成前 30 段
python scripts/generate_chapter_v2.py --chapter "PROLOGUE" --start 0 --end 30 --batch-size 10

# 第二次：生成 30-60 段
python scripts/generate_chapter_v2.py --chapter "PROLOGUE" --start 30 --end 60 --batch-size 10 --merge

# 第三次：生成 60-109 段
python scripts/generate_chapter_v2.py --chapter "PROLOGUE" --start 60 --batch-size 10 --merge
```

## 输出格式

### JSON 输出 (data/chapters/{chapter}.json)

```json
{
  "chapter": "PROLOGUE",
  "pov": null,
  "paragraphs": [
    {
      "id": 1,
      "original": "英文原文",
      "translation": "中文翻译",
      "vocabulary": [
        {"word": "word", "phonetic": "/wɜːrd/", "meaning": "意思", "example": "例句"}
      ],
      "phrases": [
        {"phrase": "phrase", "meaning": "短语意思"}
      ],
      "notes": "剧情分析"
    }
  ],
  "chapter_summary": "本章概要",
  "character_notes": "人物说明"
}
```

### HTML 输出 (data/html/{chapter}.html)

- 响应式设计，支持桌面和移动设备
- 点击显示/隐藏翻译
- 点击单词查看详细信息
- 悬停显示短语释义
- 使用 Tailwind CSS 美化界面

## 成本估算

以 qwen-plus 计费（约 0.002 元/1K tokens）：
- 每段约 500 tokens
- 每章平均 100 段
- 单章成本：约 1 元

## 故障排除

### JSON 解析错误

如果 API 返回的 JSON 格式不正确，脚本会继续处理下一批，已处理的段落会被保存。

### API 超时

增加超时时间或减少 batch-size。

## 下一步

1. 完成 PROLOGUE 章节的全部生成
2. 继续生成其他章节
3. 添加更多学习功能（如测验、跟读等）
