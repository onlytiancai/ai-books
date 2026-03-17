#!/usr/bin/env python3
"""Test the chapter parser and HTML rendering without API calls."""

import sys
import json
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from parser import parse_chapters, list_chapters
from config import SOURCE_FILE, CHAPTERS_DIR, HTML_DIR

def test_parser():
    """Test the chapter parser."""
    print("=" * 60)
    print("Testing Chapter Parser")
    print("=" * 60)

    chapters = list_chapters(str(SOURCE_FILE))

    print(f"\nFound {len(chapters)} chapters:\n")
    for i, chapter in enumerate(chapters[:5], 1):
        pov_str = f" - {chapter['pov']}" if chapter['pov'] else ""
        print(f"  {i}. {chapter['id']}{pov_str} ({chapter['paragraph_count']} paragraphs)")
    print("  ...")

    return chapters


def create_mock_content(chapter):
    """Create mock content for testing HTML rendering."""
    paragraphs = []
    for i, para_text in enumerate(chapter.paragraphs[:10], 1):
        paragraphs.append({
            "id": i,
            "original": para_text,
            "translation": f"[翻译] {para_text[:50]}...",
            "vocabulary": [
                {"word": "test", "phonetic": "/test/", "meaning": "测试", "example": "This is a test."}
            ],
            "phrases": [
                {"phrase": "test phrase", "meaning": "测试短语"}
            ],
            "notes": "这是测试注释。"
        })

    return {
        "chapter": chapter.id,
        "pov": chapter.pov,
        "paragraphs": paragraphs,
        "chapter_summary": "这是一个测试章节概要。",
        "character_notes": "这是测试人物说明。",
        "total_paragraphs": len(chapter.paragraphs),
        "processed_range": {"start": 0, "end": 10}
    }


def test_html_render(chapter):
    """Test HTML rendering with mock content."""
    print("\n" + "=" * 60)
    print("Testing HTML Rendering")
    print("=" * 60)

    # Create mock content
    content = create_mock_content(chapter)

    # Save mock content
    output_file = CHAPTERS_DIR / f"{chapter.id.replace(' ', '_')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    print(f"\nSaved mock content to: {output_file}")

    # Render HTML
    from jinja2 import Environment, FileSystemLoader

    templates_dir = Path(__file__).parent.parent / "templates"
    env = Environment(loader=FileSystemLoader(str(templates_dir)))
    template = env.get_template("chapter.html")

    html = template.render(
        chapter=content['chapter'],
        pov=content.get('pov'),
        paragraphs=content.get('paragraphs', []),
        chapter_summary=content.get('chapter_summary', ''),
        character_notes=content.get('character_notes', '')
    )

    html_file = HTML_DIR / f"{chapter.id.replace(' ', '_')}.html"
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Saved HTML to: {html_file}")

    return html_file


def main():
    """Run all tests."""
    # Test parser
    chapters = test_parser()

    # Test HTML rendering with PROLOGUE
    # list_chapters returns dicts, parse_chapters returns Chapter objects
    from parser import parse_chapters
    all_chapters = parse_chapters(str(SOURCE_FILE))
    prologue = all_chapters[0]
    html_file = test_html_render(prologue)

    print("\n" + "=" * 60)
    print("Test Complete!")
    print("=" * 60)
    print(f"\nTo view the HTML, open: {html_file}")
    print("\nNote: This is mock content. To generate real learning material,")
    print("configure a valid API key in .env and run:")
    print("  python scripts/generate_chapter.py --chapter \"PROLOGUE\"")


if __name__ == "__main__":
    main()
