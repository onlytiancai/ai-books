#!/usr/bin/env python3
"""List all chapters in the Game of Thrones source file."""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from parser import list_chapters
from config import SOURCE_FILE


def main():
    """List all chapters."""
    print(f"Reading from: {SOURCE_FILE}\n")

    try:
        chapters = list_chapters(str(SOURCE_FILE))
    except FileNotFoundError:
        print(f"Error: Source file not found: {SOURCE_FILE}")
        print("Please check the SOURCE_FILE path in your .env file or config.py")
        sys.exit(1)
    except Exception as e:
        print(f"Error parsing chapters: {e}")
        sys.exit(1)

    print(f"Found {len(chapters)} chapters:\n")
    print("=" * 60)

    for i, chapter in enumerate(chapters, 1):
        pov_str = f" - {chapter['pov']}" if chapter['pov'] else ""
        print(f"{i:3}. {chapter['id']}{pov_str} ({chapter['paragraph_count']} paragraphs)")

    print("=" * 60)
    print(f"\nTotal: {len(chapters)} chapters")
    print("\nTo generate a chapter, run:")
    print(f"  python scripts/generate_chapter.py --chapter \"PROLOGUE\"")
    print(f"  python scripts/generate_chapter.py --chapter \"1 - BRAN\"")


if __name__ == "__main__":
    main()
