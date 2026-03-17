#!/usr/bin/env python3
"""Generate learning material for a single chapter - optimized version using single API call."""

import sys
import json
import argparse
from pathlib import Path
from typing import List, Dict, Optional, Any

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from parser import parse_chapters, Chapter
from config import SOURCE_FILE, CHAPTERS_DIR, API_KEY, API_BASE_URL, MODEL


def call_llm(prompt: str) -> str:
    """Call the LLM API and return the response using OpenAI-compatible API."""
    if not API_KEY:
        raise ValueError("API_KEY not set. Please configure it in .env file or environment.")

    import requests

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "max_tokens": 8192,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    session = requests.Session()
    response = session.post(
        f"{API_BASE_URL}/chat/completions",
        headers=headers,
        json=payload,
        timeout=120
    )
    response.raise_for_status()

    result = response.json()
    return result["choices"][0]["message"]["content"]


def generate_paragraph_data(paragraphs: List[str]) -> List[Dict]:
    """
    Generate learning material for multiple paragraphs in a single API call.
    Returns a list of processed paragraphs with translation, vocabulary, phrases, and notes.
    """
    # Create numbered paragraphs text
    numbered_text = ""
    for i, para in enumerate(paragraphs, 1):
        numbered_text += f"=== Paragraph {i} ===\n{para}\n\n"

    prompt = f"""You are an English language teacher helping Chinese speakers learn English through "Game of Thrones".

For each paragraph below, provide:
1. **translation**: Chinese translation
2. **vocabulary**: 3-5 important words with word, phonetic (IPA), meaning (Chinese), example sentence
3. **phrases**: 1-3 useful phrases/idioms with phrase and meaning (Chinese)
4. **notes**: Brief analysis/notes in Chinese (1-2 sentences)

Paragraphs to analyze:
{numbered_text}

Return the result as a JSON array in this exact format:
[
  {{
    "id": 1,
    "original": "paragraph text",
    "translation": "中文翻译",
    "vocabulary": [
      {{"word": "word", "phonetic": "/wɜːrd/", "meaning": "意思", "example": "Example sentence."}}
    ],
    "phrases": [
      {{"phrase": "phrase", "meaning": "意思"}}
    ],
    "notes": "分析笔记"
  }}
]

Return ONLY the JSON array, no other text."""

    response = call_llm(prompt)

    # Parse JSON response
    if response.startswith("```"):
        response = response.split("```", 1)[1]
        if "```" in response:
            response = response.rsplit("```", 1)[0]
        response = response.strip()

    if response.startswith("json"):
        response = response[4:].strip()

    return json.loads(response)


def generate_chapter_summary(paragraphs: List[str]) -> str:
    """Generate a summary of the chapter."""
    context = "\n".join(paragraphs[:15])

    prompt = f"""You are a literature teacher and expert on "Game of Thrones" by George R.R. Martin.

Write a brief summary (2-4 sentences) in Chinese of what happens in this chapter based on the opening paragraphs.

Opening of the chapter:
{context}

Return ONLY the summary in Chinese, no other text."""

    return call_llm(prompt)


def generate_character_notes(pov: Optional[str]) -> str:
    """Generate notes about characters in the chapter."""
    if not pov:
        return "序幕章节，主要介绍守夜人巡逻的场景。"

    prompt = f"""You are a literature teacher and expert on "Game of Thrones" by George R.R. Martin.

Provide brief character notes for this chapter narrated by {pov}.

Return ONLY the character notes in Chinese (1-3 sentences), no other text."""

    return call_llm(prompt)


def generate_chapter_content(chapter: Chapter, start_paragraph: int = 0,
                             end_paragraph: Optional[int] = None,
                             batch_size: int = 10) -> Dict:
    """
    Generate complete learning content for a chapter using batch processing.

    Args:
        chapter: The chapter to process
        start_paragraph: Starting paragraph index
        end_paragraph: Ending paragraph index
        batch_size: Number of paragraphs to process in each API call

    Returns:
        Dictionary with complete chapter learning material
    """
    paragraphs_to_process = chapter.paragraphs[start_paragraph:end_paragraph]
    total = len(paragraphs_to_process)

    print(f"\nProcessing chapter: {chapter.id}")
    print(f"POV: {chapter.pov or 'N/A'}")
    print(f"Processing {total} paragraphs in batches of {batch_size}...")

    all_processed = []

    for batch_start in range(0, total, batch_size):
        batch_end = min(batch_start + batch_size, total)
        batch = paragraphs_to_process[batch_start:batch_end]

        print(f"\n  Processing paragraphs {batch_start + 1}-{batch_end}...")

        try:
            batch_result = generate_paragraph_data(batch)
            # Adjust IDs
            for item in batch_result:
                item['id'] = batch_start + item['id']
            all_processed.extend(batch_result)
            print(f"    ✓ Completed")
        except Exception as e:
            print(f"    ✗ Error: {e}")
            # Add placeholder for failed batch
            for i, para in enumerate(batch):
                all_processed.append({
                    "id": batch_start + i + 1,
                    "original": para,
                    "translation": f"[Error: {e}]",
                    "vocabulary": [],
                    "phrases": [],
                    "notes": ""
                })

    # Generate chapter summary
    print("\nGenerating chapter summary...")
    chapter_summary = generate_chapter_summary(chapter.paragraphs[:15])

    # Generate character notes
    print("Generating character notes...")
    character_notes = generate_character_notes(chapter.pov)

    return {
        "chapter": chapter.id,
        "pov": chapter.pov,
        "paragraphs": all_processed,
        "chapter_summary": chapter_summary,
        "character_notes": character_notes,
        "total_paragraphs": len(chapter.paragraphs),
        "processed_range": {
            "start": start_paragraph,
            "end": end_paragraph or len(chapter.paragraphs)
        }
    }


def load_existing_content(chapter_id: str) -> Optional[Dict]:
    """Load existing chapter content if it exists."""
    output_file = CHAPTERS_DIR / f"{chapter_id.replace(' ', '_')}.json"
    if output_file.exists():
        with open(output_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None


def save_content(content: Dict, chapter_id: str) -> Path:
    """Save chapter content to JSON file."""
    output_file = CHAPTERS_DIR / f"{chapter_id.replace(' ', '_')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    print(f"\nSaved to: {output_file}")
    return output_file


def main():
    parser = argparse.ArgumentParser(description="Generate learning material for a Game of Thrones chapter")
    parser.add_argument("--chapter", required=True, help="Chapter ID (e.g., 'PROLOGUE', '1 - BRAN')")
    parser.add_argument("--start", type=int, default=0, help="Starting paragraph index")
    parser.add_argument("--end", type=int, help="Ending paragraph index (default: end of chapter)")
    parser.add_argument("--batch-size", type=int, default=10, help="Number of paragraphs per batch")
    parser.add_argument("--merge", action="store_true", help="Merge with existing content")

    args = parser.parse_args()

    # Find the chapter
    chapters = parse_chapters(str(SOURCE_FILE))
    chapter = None
    for c in chapters:
        if c.id == args.chapter:
            chapter = c
            break

    if not chapter:
        print(f"Error: Chapter '{args.chapter}' not found")
        print("\nAvailable chapters:")
        for c in chapters[:10]:
            print(f"  - {c.id}")
        print("  ...")
        sys.exit(1)

    # Check for existing content
    existing = None
    if args.merge:
        existing = load_existing_content(chapter.id)

    if existing and args.merge:
        print(f"Merging with existing content for {chapter.id}")
        print(f"Existing paragraphs: {len(existing.get('paragraphs', []))}")

    # Generate content
    content = generate_chapter_content(
        chapter,
        start_paragraph=args.start,
        end_paragraph=args.end,
        batch_size=args.batch_size
    )

    # Merge with existing if needed
    if existing and args.merge and existing.get('paragraphs'):
        existing_ids = {p['id'] for p in existing['paragraphs']}
        for para in content['paragraphs']:
            if para['id'] in existing_ids:
                para['id'] = para['id'] + 10000
        content['paragraphs'] = existing['paragraphs'] + content['paragraphs']
        content['chapter_summary'] = existing.get('chapter_summary', content['chapter_summary'])
        content['character_notes'] = existing.get('character_notes', content['character_notes'])

    # Save
    save_content(content, chapter.id)


if __name__ == "__main__":
    main()
