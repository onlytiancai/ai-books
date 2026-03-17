// State
let currentStartLine = 0;
let pageSize = 10;
let totalLines = 0;
let currentData = [];
let showTranslation = true;
let currentUtterance = null;
let currentSpeakerBtn = null;

// DOM Elements
const contentEl = document.getElementById('content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfoEl = document.getElementById('page-info');
const chapterInfoEl = document.getElementById('chapter-info');
const pageSizeSelect = document.getElementById('page-size');
const jumpInput = document.getElementById('jump-input');
const jumpBtn = document.getElementById('jump-btn');
const bookmarkBtn = document.getElementById('bookmark-btn');
const showTranslationCheckbox = document.getElementById('show-translation');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadTotalLines();
  loadFromURL();
  loadTranslationPreference();
  await loadLines(currentStartLine);

  // Update jump input
  jumpInput.value = currentStartLine;
});

// Event Listeners
prevBtn.addEventListener('click', () => {
  if (currentStartLine > 0) {
    currentStartLine = Math.max(0, currentStartLine - pageSize);
    loadLines(currentStartLine);
    updateURL();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentStartLine + pageSize < totalLines) {
    currentStartLine += pageSize;
    loadLines(currentStartLine);
    updateURL();
  }
});

pageSizeSelect.addEventListener('change', (e) => {
  pageSize = parseInt(e.target.value, 10);
  loadLines(currentStartLine);
});

jumpBtn.addEventListener('click', () => {
  const lineNum = parseInt(jumpInput.value, 10);
  if (!isNaN(lineNum) && lineNum >= 0 && lineNum < totalLines) {
    currentStartLine = Math.floor(lineNum / pageSize) * pageSize;
    loadLines(currentStartLine);
    updateURL();
  }
});

jumpInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    jumpBtn.click();
  }
});

bookmarkBtn.addEventListener('click', () => {
  saveBookmark();
  showNotification('Bookmark saved!');
});

showTranslationCheckbox.addEventListener('change', (e) => {
  showTranslation = e.target.checked;
  localStorage.setItem('got-reader-show-translation', showTranslation);
  updateTranslationVisibility();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
    prevBtn.click();
  } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
    nextBtn.click();
  }
});

// API Functions
async function loadTotalLines() {
  try {
    const response = await fetch('/api/total');
    const data = await response.json();
    totalLines = data.total;
  } catch (err) {
    console.error('Error loading total lines:', err);
  }
}

async function loadLines(start) {
  contentEl.innerHTML = '<div class="loading">Loading...</div>';

  // Stop any ongoing speech
  stopSpeaking();

  // Clear previous data to free memory
  currentData = [];

  try {
    const response = await fetch(`/api/lines?start=${start}&count=${pageSize}`);
    currentData = await response.json();

    if (currentData.length === 0) {
      contentEl.innerHTML = `
        <div class="empty-state">
          <h2>No content found</h2>
          <p>The requested lines could not be loaded.</p>
        </div>
      `;
      return;
    }

    renderLines(currentData);
    updateNavigation();
    updateChapterInfo();

    // Scroll to top
    contentEl.scrollTop = 0;

    // Update jump input
    jumpInput.value = start;
  } catch (err) {
    console.error('Error loading lines:', err);
    contentEl.innerHTML = `
      <div class="empty-state">
        <h2>Error loading content</h2>
        <p>Please check if the server is running.</p>
      </div>
    `;
  }
}

function renderLines(lines) {
  let html = '';

  lines.forEach((line) => {
    html += renderLine(line);
  });

  contentEl.innerHTML = html;

  // Add click handlers for speaker buttons
  document.querySelectorAll('.speaker-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = btn.dataset.text;
      speakText(text, btn);
    });
  });

  // Add click handlers for word highlights
  document.querySelectorAll('.word-highlight').forEach(el => {
    el.addEventListener('click', (e) => {
      // Toggle active state for mobile
      document.querySelectorAll('.word-highlight.active').forEach(active => {
        active.classList.remove('active');
      });
      el.classList.toggle('active');
    });
  });

  // Close active highlights when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.word-highlight')) {
      document.querySelectorAll('.word-highlight.active').forEach(el => {
        el.classList.remove('active');
      });
    }
  });
}

function renderLine(line) {
  const lineNum = line.line_number !== undefined ? line.line_number : '-';
  const translationHidden = showTranslation ? '' : 'hidden';
  const originalText = line.original || '';

  // Highlight vocabulary words in original text
  const highlightedOriginal = highlightVocabulary(originalText, line.vocabulary);

  return `
    <div class="line-container">
      <div class="left-panel">
        <div class="original-section">
          <div class="line-number">Line ${lineNum}${line.chapter_id ? ' | ' + line.chapter_id : ''}</div>
          <div class="original-text">
            ${highlightedOriginal}
            <button class="speaker-btn speaker-btn-line" data-text="${escapeAttr(originalText)}" title="Read original text">🔊</button>
          </div>
        </div>
        <div class="translation-section ${translationHidden}">
          <div class="translation-text">${escapeHtml(line.translation || '')}</div>
        </div>
      </div>
      <div class="right-panel">
        ${renderPhrases(line.phrases)}
        ${renderNotes(line.notes)}
      </div>
    </div>
  `;
}

function highlightVocabulary(text, vocabulary) {
  if (!vocabulary || vocabulary.length === 0 || !text) {
    return escapeHtml(text || '');
  }

  // Sort by word length (longest first) to avoid partial matches
  const sortedVocab = [...vocabulary].sort((a, b) => {
    const aWord = (a.word || '').toLowerCase();
    const bWord = (b.word || '').toLowerCase();
    return bWord.length - aWord.length;
  });

  let result = escapeHtml(text);
  const replacedWords = new Set();

  sortedVocab.forEach((item) => {
    const word = item.word;
    if (!word || replacedWords.has(word.toLowerCase())) return;

    // Create case-insensitive regex for whole word match
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');

    if (regex.test(result)) {
      const tooltipHtml = renderWordTooltip(item);
      result = result.replace(regex, `<span class="word-highlight">$1${tooltipHtml}</span>`);
      replacedWords.add(word.toLowerCase());
    }
  });

  return result;
}

function renderWordTooltip(item) {
  return `
    <span class="word-tooltip" onclick="event.stopPropagation()">
      <div class="word-head">
        <span class="word-text">${escapeHtml(item.word || '')}</span>
        ${item.phonetic ? `<span class="phonetic">${escapeHtml(item.phonetic)}</span>` : ''}
      </div>
      ${item.meaning ? `<div class="meaning">${escapeHtml(item.meaning)}</div>` : ''}
      ${item.example ? `
        <div class="example-row">
          <span class="example">${escapeHtml(item.example)}</span>
          <button class="speaker-btn" data-text="${escapeAttr(item.example)}" title="Read aloud">🔊</button>
        </div>
      ` : ''}
    </span>
  `;
}

function escapeAttr(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderPhrases(phrases) {
  if (!phrases || phrases.length === 0) return '';

  let html = '<div class="section"><div class="section-title">Phrases</div><div class="phrase-list">';

  phrases.forEach((item) => {
    html += `
      <div class="phrase-item">
        ${escapeHtml(item.phrase || '')}
        <div class="phrase-tooltip">
          <div class="phrase-text">${escapeHtml(item.phrase || '')}</div>
          ${item.meaning ? `<div class="phrase-meaning">${escapeHtml(item.meaning)}</div>` : ''}
        </div>
      </div>
    `;
  });

  html += '</div></div>';
  return html;
}

function renderNotes(notes) {
  if (!notes) return '';

  return `
    <div class="section">
      <div class="section-title">Notes</div>
      <div class="note-text">${escapeHtml(notes)}</div>
    </div>
  `;
}

// Text-to-Speech Functions
function speakText(text, btn) {
  // Stop any current speech
  stopSpeaking();

  // Check if speech synthesis is available
  if (!('speechSynthesis' in window)) {
    showNotification('Speech synthesis not supported');
    return;
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentSpeakerBtn = btn;

  // Set language to English
  currentUtterance.lang = 'en-US';
  currentUtterance.rate = 0.9;

  // Add class for animation
  btn.classList.add('speaking');

  currentUtterance.onend = () => {
    btn.classList.remove('speaking');
    currentUtterance = null;
    currentSpeakerBtn = null;
  };

  currentUtterance.onerror = () => {
    btn.classList.remove('speaking');
    currentUtterance = null;
    currentSpeakerBtn = null;
  };

  speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  if (currentSpeakerBtn) {
    currentSpeakerBtn.classList.remove('speaking');
  }
  currentUtterance = null;
  currentSpeakerBtn = null;
}

function updateTranslationVisibility() {
  const sections = document.querySelectorAll('.translation-section');
  sections.forEach((section) => {
    section.classList.toggle('hidden', !showTranslation);
  });
}

function updateNavigation() {
  const currentPage = Math.floor(currentStartLine / pageSize) + 1;
  const totalPages = Math.ceil(totalLines / pageSize);

  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;

  prevBtn.disabled = currentStartLine <= 0;
  nextBtn.disabled = currentStartLine + pageSize >= totalLines;
}

function updateChapterInfo() {
  if (currentData.length > 0 && currentData[0].chapter_id) {
    chapterInfoEl.textContent = `Chapter: ${currentData[0].chapter_id}`;
  } else {
    chapterInfoEl.textContent = 'Chapter: -';
  }
}

// URL & Bookmark Functions
function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set('line', currentStartLine);
  window.history.pushState({}, '', url);

  // Auto-save bookmark
  saveBookmark();
}

function loadFromURL() {
  const url = new URL(window.location);
  const lineParam = url.searchParams.get('line');

  if (lineParam) {
    const lineNum = parseInt(lineParam, 10);
    if (!isNaN(lineNum) && lineNum >= 0) {
      currentStartLine = Math.floor(lineNum / pageSize) * pageSize;
    }
  } else {
    // Try to load from localStorage
    const savedBookmark = localStorage.getItem('got-reader-bookmark');
    if (savedBookmark) {
      const bookmark = JSON.parse(savedBookmark);
      currentStartLine = Math.floor(bookmark.line / pageSize) * pageSize;
    }
  }
}

function loadTranslationPreference() {
  const saved = localStorage.getItem('got-reader-show-translation');
  if (saved !== null) {
    showTranslation = saved === 'true';
    showTranslationCheckbox.checked = showTranslation;
  }
}

function saveBookmark() {
  const bookmark = {
    line: currentStartLine,
    timestamp: Date.now()
  };
  localStorage.setItem('got-reader-bookmark', JSON.stringify(bookmark));
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: #27ae60;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 1000;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Utility Functions
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  loadFromURL();
  loadLines(currentStartLine);
});