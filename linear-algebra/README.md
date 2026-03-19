# 线性代数小书 - 中文翻译版

> 原书：[The Little Book of Linear Algebra](https://github.com/little-book-of/linear-algebra)

## 项目说明

本项目将英文版线性代数教程翻译为中文，特点：
- **重写而非直译** - 用适合中文读者的表达方式呈现
- **练习题详解** - 所有 "Try It Yourself" 练习配有完整解答
- **Python 代码示例** - 每节包含 numpy 代码演示
- **标准术语** - 使用规范的中文数学术语

## 翻译进度

✅ **全部完成** - 100 章节、10 章

| 章节 | 内容 | 状态 |
|------|------|------|
| 第1章 | 向量、标量与几何 | ✅ |
| 第2章 | 矩阵与基本运算 | ✅ |
| 第3章 | 线性方程组与消元法 | ✅ |
| 第4章 | 向量空间与子空间 | ✅ |
| 第5章 | 线性变换与结构 | ✅ |
| 第6章 | 行列式与体积 | ✅ |
| 第7章 | 特征值、特征向量与动力学 | ✅ |
| 第8章 | 正交性、最小二乘与QR分解 | ✅ |
| 第9章 | SVD、PCA与条件数 | ✅ |
| 第10章 | 应用与计算 | ✅ |

## 目录结构

```
linear-algebra/
├── .env                    # API 配置
├── .env.example            # API 配置模板
├── translate.py            # 翻译脚本
├── translation-progress.json  # 翻译进度
├── requirements.txt        # Python 依赖
├── README.md               # 说明文档
├── src/
│   ├── SUMMARY.md          # 英文版目录
│   ├── chapter-XX/         # 英文章节
│   └── zh/                 # 中文翻译
│       ├── SUMMARY.md      # 中文版目录
│       ├── intro.md        # 中文简介
│       ├── chapter-01.md   # 章节索引页
│       └── chapter-XX/     # 中文章节内容
│           └── section-XX.md
└── book.toml               # mdBook 配置
```

## 阅读方式

### 在线阅读

直接浏览 `src/zh/` 目录下的 Markdown 文件。

### 构建 HTML 书籍

```bash
# 安装 mdBook
cargo install mdbook

# 构建中文版
cd src/zh
mdbook build

# 本地预览
mdbook serve
```

## 重新翻译

如需重新翻译或修改翻译内容：

### 1. 创建虚拟环境

```bash
python3 -m venv .venv
source .venv/bin/activate  # Linux/macOS
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

支持任何兼容 OpenAI 接口的服务：
- OpenAI: `https://api.openai.com/v1`
- 阿里云通义千问: `https://coding.dashscope.aliyuncs.com/v1`
- DeepSeek: `https://api.deepseek.com/v1`
- 其他兼容服务...

### 4. 运行翻译

```bash
# 查看当前进度
python translate.py --status

# 翻译指定章节
python translate.py --section 1

# 强制重新翻译
python translate.py --section 1 --force

# 翻译所有未完成章节
python translate.py
```

## 翻译说明

翻译脚本会：
1. 读取英文原文章节
2. 调用 AI API 进行翻译改写
3. 保持 LaTeX 公式不变
4. 添加练习题解答
5. 添加 Python 代码示例
6. 保存到 `src/zh/` 目录

## 示例章节

每个章节包含：
- 概念解释（中文重写）
- 数学公式（LaTeX 格式）
- 练习题解答
- Python 代码示例

```markdown
### 1. 标量、向量与坐标系

当我们开始学习线性代数时，一切始于最基础的构建模块：**标量**（Scalars）和**向量**（Vectors）。

**标量**只是一个单独的数字，例如 $3$、$-7$ 或 $\pi$。

#### Python 代码演示

```python
import numpy as np

v1 = np.array([2, 3])
v2 = np.array([-1, 4])

length_v1 = np.linalg.norm(v1)
print(f"向量 v1 的长度：{length_v1:.4f}")
```
```

## 许可证

遵循原书许可证。