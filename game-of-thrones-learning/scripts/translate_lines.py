#!/usr/bin/env python3
"""Translate Game of Thrones text line by line to JSONL format."""

import sys
import json
import time
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from parser import parse_chapters
from config import SOURCE_FILE, DATA_DIR, API_KEY, API_BASE_URL, MODEL


# Output paths
DEFAULT_OUTPUT_FILE = DATA_DIR / "translated_lines.jsonl"
PROGRESS_FILE = DATA_DIR / ".translate_progress.json"


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


def call_llm(prompt: str, max_retries: int = 5, max_tokens: int = 4096) -> str:
    """Call the LLM API with retry logic.

    Args:
        prompt: The prompt to send to the LLM
        max_retries: Maximum number of retry attempts
        max_tokens: Maximum tokens in response

    Returns:
        The LLM response text

    Raises:
        ValueError: If all retry attempts fail
    """
    if not API_KEY:
        raise ValueError("API_KEY not set. Please configure it in .env file or environment.")

    import requests

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "max_tokens": max_tokens,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    for attempt in range(max_retries):
        try:
            session = requests.Session()
            start_time = time.time()
            response = session.post(
                f"{API_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=240
            )
            response.raise_for_status()

            result = response.json()
            elapsed = time.time() - start_time
            print(f"    LLM response time: {elapsed:.2f}s")
            return result["choices"][0]["message"]["content"]

        except requests.Timeout as e:
            wait_time = 5 * (2 ** attempt)
            print(f"    Timeout (attempt {attempt + 1}/{max_retries}): Retrying in {wait_time}s...")
            time.sleep(wait_time)
        except requests.RequestException as e:
            wait_time = 5 * (2 ** attempt)
            print(f"    Request error (attempt {attempt + 1}/{max_retries}): {e}")
            print(f"    Retrying in {wait_time}s...")
            time.sleep(wait_time)
        except Exception as e:
            wait_time = 5 * (2 ** attempt)
            print(f"    Error (attempt {attempt + 1}/{max_retries}): {e}")
            print(f"    Retrying in {wait_time}s...")
            time.sleep(wait_time)

    raise ValueError(f"Failed to get LLM response after {max_retries} attempts")


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
    try:
        return parse_json_response(response)
    except json.JSONDecodeError:
        print(f"    Warning: Failed to parse vocabulary JSON")
        return []


def analyze_paragraph(paragraph: str) -> str:
    """Generate analysis notes for a paragraph."""
    template = load_prompt("analysis")
    prompt = fill_prompt(template, paragraph=paragraph)
    return call_llm(prompt)


def process_line(line: str, line_idx: int) -> dict:
    """Process a single line: translate, extract vocab, analyze.

    Args:
        line: The line content to process
        line_idx: The index of the line (0-based)

    Returns:
        Dictionary with id, original, translation, vocabulary, notes
    """
    try:
        print("    Translating...")
        translation = translate_paragraph(line)

        print("    Extracting vocabulary...")
        vocabulary = extract_vocabulary(line)

        print("    Analyzing...")
        notes = analyze_paragraph(line)

        return {
            "id": line_idx + 1,
            "original": line,
            "translation": translation,
            "vocabulary": vocabulary,
            "notes": notes
        }
    except Exception as e:
        # Return partial result on error
        print(f"    Error processing: {e}")
        return {
            "id": line_idx + 1,
            "original": line,
            "translation": f"[Error: {e}]",
            "vocabulary": [],
            "notes": ""
        }


def process_batch(batch_items: List[tuple], max_retries: int = 3) -> List[dict]:
    """Process a batch of lines in one API call.

    Args:
        batch_items: List of (line_idx, line_content) tuples
        max_retries: Maximum number of retry attempts for invalid JSON

    Returns:
        List of result dictionaries with id, original, translation, vocabulary, notes
    """
    if not batch_items:
        return []

    # Build numbered lines text
    lines_text = "\n".join(f"[{i+1}] {content}" for i, (idx, content) in enumerate(batch_items))

    # Call LLM with batch prompt
    template = load_prompt("batch_translate")
    prompt = fill_prompt(template, lines=lines_text)

    for attempt in range(max_retries):
        try:
            response = call_llm(prompt, max_tokens=8192)

            # Parse JSON response
            results = parse_json_response(response)

            if not isinstance(results, list):
                raise ValueError(f"Expected JSON array, got {type(results)}")

            # Validate each result has required fields
            for r in results:
                if not isinstance(r, dict):
                    raise ValueError(f"Expected dict, got {type(r)}")
                if "id" not in r:
                    raise ValueError("Missing required field: id")
                if "translation" not in r:
                    raise ValueError("Missing required field: translation")
                if "vocabulary" not in r:
                    r["vocabulary"] = []
                if "notes" not in r:
                    r["notes"] = ""

            # Build a lookup by id
            results_by_id = {r.get("id"): r for r in results if isinstance(r, dict)}

            # Merge with original line info
            output = []
            for i, (line_idx, line_content) in enumerate(batch_items):
                result = results_by_id.get(i + 1, {})
                output.append({
                    "id": line_idx + 1,
                    "original": line_content,
                    "translation": result.get("translation", "[Missing translation]"),
                    "vocabulary": result.get("vocabulary", []),
                    "notes": result.get("notes", "")
                })

            return output

        except (json.JSONDecodeError, ValueError) as e:
            print(f"    JSON validation error (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print(f"    Retrying...")
                time.sleep(2)
            else:
                print(f"    All retries exhausted, falling back to single-line processing...")
                return [process_line(content, idx) for idx, content in batch_items]

    # Should not reach here, but fallback just in case
    return [process_line(content, idx) for idx, content in batch_items]


def load_progress() -> Dict:
    """Load translation progress from file."""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_progress(last_line: int, total_lines: int):
    """Save translation progress to file."""
    progress = {
        "last_line": last_line,
        "total_lines": total_lines,
        "last_updated": datetime.now().isoformat()
    }
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)


def clear_progress():
    """Clear the progress file."""
    if PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()


def build_line_mapping() -> list:
    """Build a mapping of line numbers to chapter info.

    Returns:
        List of tuples: (line_number, chapter_id, pov, line_content)
    """
    chapters = parse_chapters(str(SOURCE_FILE))
    line_mapping = []

    # Read source file to get line content
    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for chapter in chapters:
        for line_num in range(chapter.start_line, chapter.end_line + 1):
            line_content = lines[line_num].rstrip()
            # Skip empty lines
            if line_content.strip():
                line_mapping.append((line_num, chapter.id, chapter.pov, line_content))

    return line_mapping


def translate_lines(start_line: int = 0, output_file: Optional[str] = None, batch_size: int = 5):
    """Main translation function.

    Args:
        start_line: Starting line number (0-based)
        output_file: Output JSONL file path
        batch_size: Number of lines to process per API call (default: 5)
    """
    output_path = Path(output_file) if output_file else DEFAULT_OUTPUT_FILE
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Check for existing progress
    progress = load_progress()
    if progress and start_line == 0:
        last_line = progress.get('last_line', 0)
        total_lines = progress.get('total_lines', 0)
        print(f"Found existing progress: {last_line}/{total_lines} lines translated")
        print(f"Continuing from line {last_line + 1}")
        start_line = last_line + 1

    # Build line mapping
    print("Parsing chapters and building line mapping...")
    line_mapping = build_line_mapping()
    total_lines = len(line_mapping)

    print(f"Total lines to translate: {total_lines}")
    print(f"Starting from line: {start_line}")
    print(f"Batch size: {batch_size}")
    print(f"Output file: {output_path}")
    print()

    # Open output file in append mode
    with open(output_path, 'a', encoding='utf-8') as f:
        batch_items = []

        for i, (line_num, chapter_id, pov, line_content) in enumerate(line_mapping):
            # Skip already translated lines
            if i < start_line:
                continue

            # Add to current batch
            batch_items.append((i, line_content))

            # Process batch when full or at the end
            if len(batch_items) >= batch_size or i == total_lines - 1:
                batch_start_idx = batch_items[0][0]
                batch_end_idx = batch_items[-1][0]

                try:
                    print(f"Batch {batch_start_idx + 1}-{batch_end_idx + 1}/{total_lines} ({len(batch_items)} lines)...")

                    # Process the batch (1 LLM call for all lines in batch)
                    results = process_batch(batch_items)

                    # Write each result to JSONL
                    for j, result in enumerate(results):
                        line_idx = batch_items[j][0]
                        line_num_actual = line_mapping[line_idx][0]
                        chapter_id_actual = line_mapping[line_idx][1]
                        pov_actual = line_mapping[line_idx][2]

                        record = {
                            "line_number": line_num_actual + 1,
                            "chapter_id": chapter_id_actual,
                            "pov": pov_actual,
                            **result  # id, original, translation, vocabulary, phrases, notes
                        }
                        f.write(json.dumps(record, ensure_ascii=False) + '\n')

                    f.flush()

                    # Save progress AFTER successful processing
                    save_progress(batch_end_idx, total_lines)

                    # Clear batch for next iteration
                    batch_items = []

                except KeyboardInterrupt:
                    print("\n\nInterrupted by user.")
                    # Progress is saved after each successful batch completion
                    saved_progress = load_progress()
                    if saved_progress:
                        print(f"Last saved progress: {saved_progress.get('last_line', 0) + 1}/{total_lines} lines")
                    print("Run the script again to continue from where you left off.")
                    sys.exit(0)
                except Exception as e:
                    print(f"Error processing batch: {e}")
                    # Save progress and continue with next batch
                    save_progress(batch_end_idx, total_lines)
                    batch_items = []
                    continue

    print(f"\nTranslation complete!")
    print(f"Output: {output_path}")

    # Clear progress file on completion
    clear_progress()
    print("Progress file cleared.")


def main():
    parser = argparse.ArgumentParser(
        description="Translate Game of Thrones text line by line to JSONL format"
    )
    parser.add_argument(
        "--start-line",
        type=int,
        default=0,
        help="Starting line number (0-based, default: 0 or continue from last progress)"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output JSONL file path (default: data/translated_lines.jsonl)"
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=5,
        help="Number of lines to process per API call (default: 5)"
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Clear progress and start from beginning"
    )

    args = parser.parse_args()

    if args.reset:
        print("Clearing progress file...")
        clear_progress()
        args.start_line = 0

    translate_lines(start_line=args.start_line, output_file=args.output, batch_size=args.batch_size)


if __name__ == "__main__":
    main()