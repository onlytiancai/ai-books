#!/usr/bin/env python3
"""Generate learning material for a single chapter."""

import sys
import json
import argparse
from pathlib import Path
from typing import List, Dict, Optional, Any

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from parser import parse_chapters, Chapter
from config import SOURCE_FILE, CHAPTERS_DIR, API_KEY, API_BASE_URL, MODEL


def load_prompt(template_name: str) -> str:
    """Load a prompt template from file."""
    prompt_file = Path(__file__).parent.parent / "prompts" / f"{template_name}.txt"
    with open(prompt_file, 'r', encoding='utf-8') as f:
        return f.read()


def fill_prompt(template: str, **kwargs) -> str:
    """Fill in a prompt template with values."""
    result = template
    for key, value in kwargs.items():
        result = result.replace(f"{{{{{key.upper()}}}}}", value)
    return result


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
        "max_tokens": 4096,
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


def parse_json_response(text: str) -> Any:
    """Parse JSON from LLM response, handling potential markdown wrapping."""
    # Remove markdown code blocks if present
    if text.startswith("```"):
        text = text.split("```", 1)[1]
        if "```" in text:
            text = text.rsplit("```", 1)[0]
        text = text.strip()

    # Sometimes JSON is wrapped in json language identifier
    if text.startswith("json"):
        text = text[4:].strip()

    return json.loads(text)


def translate_paragraph(paragraph: str) -> str:
    """Translate a paragraph to Chinese."""
    template = load_prompt("translate")
    prompt = fill_prompt(template, paragraph=paragraph)
    return call_llm(prompt)


def extract_vocabulary(paragraph: str) -> List[Dict]:
    """Extract vocabulary words from a paragraph."""
    template = load_prompt("vocabulary")
    prompt = fill_prompt(template, paragraph=paragraph)
    response = call_llm(prompt)
    return parse_json_response(response)


def extract_phrases(paragraph: str) -> List[Dict]:
    """Extract phrases/idioms from a paragraph."""
    template = load_prompt("phrases")
    prompt = fill_prompt(template, paragraph=paragraph)
    response = call_llm(prompt)
    return parse_json_response(response)


def analyze_paragraph(paragraph: str) -> str:
    """Generate analysis notes for a paragraph."""
    template = load_prompt("analysis")
    prompt = fill_prompt(template, paragraph=paragraph)
    return call_llm(prompt)


def generate_chapter_content(chapter: Chapter, start_paragraph: int = 0,
                             end_paragraph: Optional[int] = None) -> Dict:
    """
    Generate complete learning content for a chapter.

    Args:
        chapter: The chapter to process
        start_paragraph: Starting paragraph index (for incremental processing)
        end_paragraph: Ending paragraph index (for incremental processing)

    Returns:
        Dictionary with complete chapter learning material
    """
    paragraphs_to_process = chapter.paragraphs[start_paragraph:end_paragraph]

    print(f"\nProcessing chapter: {chapter.id}")
    print(f"POV: {chapter.pov or 'N/A'}")
    print(f"Processing paragraphs {start_paragraph} to {end_paragraph or len(chapter.paragraphs)}")
    print(f"Total paragraphs in chapter: {len(chapter.paragraphs)}")

    processed_paragraphs = []

    for i, para in enumerate(paragraphs_to_process, start_paragraph):
        para_num = i + 1
        print(f"\n  Paragraph {para_num}/{len(chapter.paragraphs)}...")

        try:
            # Translate
            print(f"    Translating...")
            translation = translate_paragraph(para)

            # Extract vocabulary
            print(f"    Extracting vocabulary...")
            vocabulary = extract_vocabulary(para)

            # Extract phrases
            print(f"    Extracting phrases...")
            phrases = extract_phrases(para)

            # Analyze
            print(f"    Analyzing...")
            notes = analyze_paragraph(para)

            processed_paragraphs.append({
                "id": para_num,
                "original": para,
                "translation": translation,
                "vocabulary": vocabulary,
                "phrases": phrases,
                "notes": notes
            })

        except Exception as e:
            print(f"    Error processing paragraph: {e}")
            # Continue with next paragraph, store error info
            processed_paragraphs.append({
                "id": para_num,
                "original": para,
                "translation": f"[Error: {e}]",
                "vocabulary": [],
                "phrases": [],
                "notes": ""
            })

    # Generate chapter summary
    print("\nGenerating chapter summary...")
    chapter_summary = generate_chapter_summary(chapter)

    # Generate character notes
    print("Generating character notes...")
    character_notes = generate_character_notes(chapter)

    return {
        "chapter": chapter.id,
        "pov": chapter.pov,
        "paragraphs": processed_paragraphs,
        "chapter_summary": chapter_summary,
        "character_notes": character_notes,
        "total_paragraphs": len(chapter.paragraphs),
        "processed_range": {
            "start": start_paragraph,
            "end": end_paragraph or len(chapter.paragraphs)
        }
    }


def generate_chapter_summary(chapter: Chapter) -> str:
    """Generate a summary of the chapter."""
    # Use first 10 paragraphs for context
    context = "\n".join(chapter.paragraphs[:10])

    prompt = f"""You are a literature teacher and expert on "Game of Thrones" by George R.R. Martin.

Write a brief summary (2-4 sentences) of what happens in this chapter based on the opening paragraphs.

Opening of the chapter:
{context}

Return ONLY the summary in Chinese, no other text."""

    return call_llm(prompt)


def generate_character_notes(chapter: Chapter) -> str:
    """Generate notes about characters in the chapter."""
    if not chapter.pov:
        return "序幕章节，主要介绍守夜人巡逻的场景。"

    prompt = f"""You are a literature teacher and expert on "Game of Thrones" by George R.R. Martin.

Provide brief character notes for this chapter narrated by {chapter.pov}.

Return ONLY the character notes in Chinese (1-3 sentences), no other text."""

    return call_llm(prompt)


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
        end_paragraph=args.end
    )

    # Merge with existing if needed
    if existing and args.merge and existing.get('paragraphs'):
        # Adjust paragraph IDs to avoid duplicates
        existing_ids = {p['id'] for p in existing['paragraphs']}
        for para in content['paragraphs']:
            if para['id'] in existing_ids:
                para['id'] = para['id'] + 10000  # Offset to avoid collision
        content['paragraphs'] = existing['paragraphs'] + content['paragraphs']
        content['chapter_summary'] = existing.get('chapter_summary', content['chapter_summary'])
        content['character_notes'] = existing.get('character_notes', content['character_notes'])

    # Save
    save_content(content, chapter.id)


if __name__ == "__main__":
    main()
