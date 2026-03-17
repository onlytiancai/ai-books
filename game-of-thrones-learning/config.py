"""Configuration for Game of Thrones English Learning Book Generator."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directories
PROJECT_ROOT = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"
CHAPTERS_DIR = DATA_DIR / "chapters"
HTML_DIR = DATA_DIR / "html"
PROMPTS_DIR = PROJECT_ROOT / "prompts"
TEMPLATES_DIR = PROJECT_ROOT / "templates"

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
CHAPTERS_DIR.mkdir(parents=True, exist_ok=True)
HTML_DIR.mkdir(parents=True, exist_ok=True)

# API Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL", "qwen3.5-plus")

# Source file
SOURCE_FILE = Path(os.getenv("SOURCE_FILE", "/Volumes/data/src/ai-books/game-of-thrones/game_of_thrones.txt"))

# Output directory
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", str(DATA_DIR)))
