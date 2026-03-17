"""Chapter parser for Game of Thrones text."""

import re
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class Chapter:
    """Represents a chapter in the book."""
    id: str
    title: str
    pov: Optional[str]
    start_line: int
    end_line: int
    content: str
    paragraphs: List[str]


def parse_chapters(file_path: str) -> List[Chapter]:
    """
    Parse the Game of Thrones text file and extract chapters.

    Chapters are organized by POV characters with headers like:
    - PROLOGUE
    - 1 - BRAN
    - 2 - CATELYN
    - 3 - DAENERYS
    """

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    chapters = []
    current_chapter = None
    current_content = []
    # Match both formats: "PROLOGUE", "1 - BRAN", and standalone POV names like "TYRION", "EDDARD"
    pov_names = r'(?:BRAN|CATELYN|DAENERYS|EDDARD|JON|ARYA|TYRION|SANSA)'
    chapter_pattern = re.compile(rf'^(PROLOGUE|\d+\s*-\s*{pov_names}|{pov_names})$')

    for i, line in enumerate(lines):
        line_stripped = line.strip()
        match = chapter_pattern.match(line_stripped)

        if match:
            # Save previous chapter
            if current_chapter and current_content:
                current_chapter.content = '\n'.join(current_content)
                current_chapter.paragraphs = split_paragraphs(current_chapter.content)
                current_chapter.end_line = i - 1
                chapters.append(current_chapter)

            # Start new chapter
            chapter_id = line_stripped
            pov = extract_pov(chapter_id)
            current_chapter = Chapter(
                id=chapter_id,
                title=f"Chapter {chapter_id}",
                pov=pov,
                start_line=i,
                end_line=-1,
                content="",
                paragraphs=[]
            )
            current_content = []
        elif current_chapter:
            current_content.append(line.rstrip())

    # Don't forget the last chapter
    if current_chapter and current_content:
        current_chapter.content = '\n'.join(current_content)
        current_chapter.paragraphs = split_paragraphs(current_chapter.content)
        current_chapter.end_line = len(lines) - 1
        chapters.append(current_chapter)

    return chapters


def extract_pov(chapter_id: str) -> Optional[str]:
    """Extract POV character name from chapter ID."""
    if chapter_id == "PROLOGUE":
        return None

    # Try format "1 - BRAN" first
    match = re.match(r'\d+\s*-\s*([A-Z]+)', chapter_id)
    if match:
        return match.group(1)

    # Try standalone POV name format (e.g., "TYRION", "EDDARD")
    pov_names = ['BRAN', 'CATELYN', 'DAENERYS', 'EDDARD', 'JON', 'ARYA', 'TYRION', 'SANSA']
    if chapter_id in pov_names:
        return chapter_id

    return None


def split_paragraphs(content: str) -> List[str]:
    """Split chapter content into paragraphs."""
    # Each line is a paragraph in this format
    lines = content.split('\n')

    # Clean up and filter empty lines
    result = []
    for line in lines:
        line = line.strip()
        if line:
            # Normalize whitespace within paragraph
            line = re.sub(r'\s+', ' ', line)
            result.append(line)

    return result


def list_chapters(file_path: str) -> List[Dict]:
    """List all chapters with basic info."""
    chapters = parse_chapters(file_path)

    result = []
    for chapter in chapters:
        result.append({
            'id': chapter.id,
            'title': chapter.title,
            'pov': chapter.pov,
            'paragraph_count': len(chapter.paragraphs)
        })

    return result


if __name__ == "__main__":
    # Test the parser
    import json

    chapters = list_chapters("/Volumes/data/src/ai-books/game-of-thrones/game_of_thrones.txt")

    print(f"Found {len(chapters)} chapters:\n")
    for chapter in chapters:
        pov_str = f"({chapter['pov']})" if chapter['pov'] else ""
        print(f"  {chapter['id']} {pov_str} - {chapter['paragraph_count']} paragraphs")
