#!/usr/bin/env python3
"""Render chapter learning material as HTML."""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config import CHAPTERS_DIR, HTML_DIR, TEMPLATES_DIR

try:
    from jinja2 import Environment, FileSystemLoader
except ImportError:
    print("Please install dependencies: pip install -r requirements.txt")
    sys.exit(1)


def load_chapter_content(chapter_id: str) -> Dict:
    """Load chapter content from JSON file."""
    content_file = CHAPTERS_DIR / f"{chapter_id.replace(' ', '_')}.json"

    if not content_file.exists():
        raise FileNotFoundError(f"Chapter content not found: {content_file}")

    with open(content_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def render_html(content: Dict, output_file: Path) -> Path:
    """Render chapter content as HTML."""
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    template = env.get_template("chapter.html")

    html = template.render(
        chapter=content['chapter'],
        pov=content.get('pov'),
        paragraphs=content.get('paragraphs', []),
        chapter_summary=content.get('chapter_summary', ''),
        character_notes=content.get('character_notes', '')
    )

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)

    return output_file


def main():
    parser = argparse.ArgumentParser(description="Render Game of Thrones chapter as HTML")
    parser.add_argument("--chapter", required=True, help="Chapter ID (e.g., 'PROLOGUE', '1 - BRAN')")
    parser.add_argument("--output", help="Output HTML file path (default: data/html/{chapter}.html)")
    parser.add_argument("--open", action="store_true", help="Open in browser after rendering")

    args = parser.parse_args()

    # Load content
    try:
        content = load_chapter_content(args.chapter)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("\nMake sure to generate the chapter first:")
        print(f"  python scripts/generate_chapter.py --chapter \"{args.chapter}\"")
        sys.exit(1)

    # Determine output path
    if args.output:
        output_file = Path(args.output)
    else:
        output_file = HTML_DIR / f"{args.chapter.replace(' ', '_')}.html"

    # Ensure output directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Render
    print(f"Rendering {args.chapter}...")
    render_html(content, output_file)
    print(f"HTML saved to: {output_file}")

    # Open in browser
    if args.open:
        import subprocess
        subprocess.run(['open', str(output_file)])
        print("Opened in browser.")


if __name__ == "__main__":
    main()
