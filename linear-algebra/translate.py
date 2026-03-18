#!/usr/bin/env python3
"""
Chinese Translation Script for Linear Algebra Book

Usage:
    python translate.py              # Translate all remaining sections
    python translate.py --section N # Translate specific section (1-100)
    python translate.py --resume    # Resume from where it stopped (default)
    python translate.py --status    # Show progress status
    python translate.py --force     # Force re-translate (use with --section)
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")

# Paths
PROJECT_ROOT = Path(__file__).parent
SRC_DIR = PROJECT_ROOT / "src"
ZH_DIR = SRC_DIR / "zh"
PROGRESS_FILE = PROJECT_ROOT / "translation-progress.json"

# Translation prompt template
TRANSLATION_PROMPT = """你是一位资深的线性代数教育专家，精通中英文教学。请将以下英文章节改写为中文版本。

要求：
1. **不要逐字翻译** - 理解概念后用适合中国学生的表达方式重写
2. **保持所有 LaTeX 数学公式不变** - 包括行内公式 `$...$` 和独立公式 `$$...$$`
3. **保持 Markdown 格式结构** - 包括标题层级（###、####）、列表、引用等
4. **为 "Try It Yourself" 练习题添加详细答案和解答过程** - 如果有练习题，必须给出完整解答
5. **在适当位置添加 Python 代码示例** - 使用 numpy 演示数值计算，帮助理解概念
6. **使用标准中文数学术语** - 如：向量、矩阵、线性变换、特征值、行列式、线性组合等
7. **添加必要的解释和注记** - 在关键概念处添加"注意"或"提示"帮助理解
8. **保持章节编号格式** - 如 "### 1. Scalars, Vectors..." 改为 "### 1. 标量、向量和坐标系"

原文章节内容：
{content}

请输出改写后的中文版本（直接输出内容，不要添加额外说明）："""


def get_client() -> OpenAI:
    """Create OpenAI client with configuration."""
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY not found in .env file")
    return OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)


def load_progress() -> dict:
    """Load translation progress from JSON file."""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "total": 100,
        "completed": [],
        "in_progress": None,
        "failed": [],
        "last_updated": None,
    }


def save_progress(progress: dict):
    """Save translation progress to JSON file."""
    progress["last_updated"] = datetime.now().isoformat()
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=2, ensure_ascii=False)


def get_section_path(section_num: int, lang: str = "en") -> Path:
    """Get the file path for a section number."""
    # Section numbering: 1-10 -> chapter-01, 11-20 -> chapter-02, etc.
    chapter_num = (section_num - 1) // 10 + 1
    chapter_dir = f"chapter-{chapter_num:02d}"
    filename = f"section-{section_num:02d}.md"

    if lang == "zh":
        return ZH_DIR / chapter_dir / filename
    else:
        return SRC_DIR / chapter_dir / filename


def read_section(section_num: int) -> Optional[str]:
    """Read English section content."""
    path = get_section_path(section_num, "en")
    if path.exists():
        return path.read_text(encoding="utf-8")
    return None


def write_section(section_num: int, content: str):
    """Write Chinese section content."""
    path = get_section_path(section_num, "zh")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def translate_section(client: OpenAI, section_num: int, content: str) -> str:
    """Translate a section using OpenAI API."""
    prompt = TRANSLATION_PROMPT.format(content=content)

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,  # Lower temperature for more consistent output
        max_tokens=4000,
    )

    return response.choices[0].message.content


def show_status(progress: dict):
    """Display translation progress status."""
    total = progress["total"]
    completed = len(progress["completed"])
    failed = len(progress["failed"])
    remaining = total - completed - failed

    print(f"\nTranslation Progress:")
    print(f"  Total sections: {total}")
    print(f"  Completed: {completed} ({completed/total*100:.1f}%)")
    print(f"  Failed: {failed}")
    print(f"  Remaining: {remaining}")

    if progress["completed"]:
        print(f"\n  Last completed: section {max(progress['completed'])}")

    if progress["failed"]:
        print(f"  Failed sections: {progress['failed']}")

    if progress["in_progress"]:
        print(f"  Currently in progress: section {progress['in_progress']}")


def translate_all(client: OpenAI, progress: dict, start: int = 1, force: bool = False):
    """Translate all remaining sections."""
    total = progress["total"]

    for section_num in range(start, total + 1):
        if not force and section_num in progress["completed"]:
            continue

        print(f"\n{'='*60}")
        print(f"Translating section {section_num}/{total}...")

        # Read source content
        content = read_section(section_num)
        if content is None:
            print(f"  ERROR: Source file not found for section {section_num}")
            progress["failed"].append(section_num)
            save_progress(progress)
            continue

        # Update progress
        progress["in_progress"] = section_num
        save_progress(progress)

        try:
            # Translate
            translated = translate_section(client, section_num, content)

            # Save translation
            write_section(section_num, translated)

            # Update progress
            if section_num in progress["failed"]:
                progress["failed"].remove(section_num)
            progress["completed"].append(section_num)
            progress["in_progress"] = None
            save_progress(progress)

            print(f"  SUCCESS: Section {section_num} translated and saved")

        except Exception as e:
            print(f"  ERROR: {e}")
            if section_num not in progress["failed"]:
                progress["failed"].append(section_num)
            progress["in_progress"] = None
            save_progress(progress)


def main():
    parser = argparse.ArgumentParser(
        description="Translate Linear Algebra book from English to Chinese"
    )
    parser.add_argument(
        "--section", "-s", type=int, help="Translate specific section (1-100)"
    )
    parser.add_argument(
        "--resume", "-r", action="store_true", help="Resume from where it stopped"
    )
    parser.add_argument(
        "--status", action="store_true", help="Show translation progress status"
    )
    parser.add_argument(
        "--force", "-f", action="store_true", help="Force re-translate"
    )

    args = parser.parse_args()

    # Load progress
    progress = load_progress()

    # Show status
    if args.status:
        show_status(progress)
        return

    # Initialize OpenAI client
    try:
        client = get_client()
    except ValueError as e:
        print(f"Error: {e}")
        print("Please create a .env file with your OpenAI API key:")
        print("  cp .env.example .env")
        print("  # Edit .env and add your API key")
        sys.exit(1)

    # Determine start point
    if args.section:
        if args.section < 1 or args.section > 100:
            print(f"Error: Section must be between 1 and 100")
            sys.exit(1)
        translate_all(client, progress, start=args.section, force=args.force)
    elif args.resume or not args.section:
        # Resume from last completed + 1
        start = 1
        if progress["completed"]:
            start = max(progress["completed"]) + 1
        if progress["in_progress"]:
            start = progress["in_progress"]

        if start > progress["total"]:
            print("All sections have been translated!")
            show_status(progress)
            return

        translate_all(client, progress, start=start, force=args.force)

    # Show final status
    show_status(progress)


if __name__ == "__main__":
    main()