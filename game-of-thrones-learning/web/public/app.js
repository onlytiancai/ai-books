// State
let currentStartLine = 0;
let pageSize = 10;
let totalLines = 0;
let currentData = [];
let showTranslation = true;
let showNotes = true;
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
const showNotesCheckbox = document.getElementById('show-notes');
const stopSpeakingBtn = document.getElementById('stop-speaking-btn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadTotalLines();
  loadFromURL();
  loadPreferences();
  await loadLines(currentStartLine);
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
  if (e.key === 'Enter') jumpBtn.click();
});

bookmarkBtn.addEventListener('click', () => {
  saveBookmark();
  showNotification('Bookmark saved!');
});

showTranslationCheckbox.addEventListener('change', (e) => {
  showTranslation = e.target.checked;
  localStorage.setItem('got-reader-show-translation', showTranslation);
  updateVisibility();
});

showNotesCheckbox.addEventListener('change', (e) => {
  showNotes = e.target.checked;
  localStorage.setItem('got-reader-show-notes', showNotes);
  updateVisibility();
});

stopSpeakingBtn.addEventListener('click', stopSpeaking);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.key === 'ArrowLeft' && !prevBtn.disabled) prevBtn.click();
  else if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
  else if (e.key === 'Escape') stopSpeaking();
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
  stopSpeaking();
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
    contentEl.scrollTop = 0;
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
      speakText(btn.dataset.text, btn);
    });
  });

  // Add click handlers for word highlights
  document.querySelectorAll('.word-highlight').forEach(el => {
    el.addEventListener('click', (e) => {
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
  const notesHidden = showNotes ? '' : 'hidden';
  const originalText = line.original || '';

  const highlightedOriginal = highlightVocabulary(originalText, line.vocabulary);

  return `
    <div class="line-container">
      <div class="line-header">
        <div class="line-number">Line ${lineNum}${line.chapter_id ? ' | ' + line.chapter_id : ''}</div>
      </div>
      <div class="section original-section">
        <div class="original-text">
          ${highlightedOriginal}
          <button class="speaker-btn speaker-btn-line" data-text="${escapeAttr(originalText)}" title="Read aloud">🔊</button>
        </div>
      </div>
      <div class="section translation-section ${translationHidden}">
        <div class="translation-text">${escapeHtml(line.translation || '')}</div>
      </div>
      ${line.notes ? `
        <div class="section notes-section ${notesHidden}">
          <div class="note-text">${escapeHtml(line.notes)}</div>
        </div>
      ` : ''}
    </div>
  `;
}

function highlightVocabulary(text, vocabulary) {
  if (!vocabulary || vocabulary.length === 0 || !text) {
    return escapeHtml(text || '');
  }

  // Sort by word length (longest first) to avoid partial matches
  const sortedVocab = [...vocabulary].sort((a, b) => {
    return (b.word || '').length - (a.word || '').length;
  });

  // Find all word positions in original text
  const matches = [];
  const replacedWords = new Set();

  sortedVocab.forEach((item) => {
    const word = item.word;
    if (!word || replacedWords.has(word.toLowerCase())) return;

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');

    let match;
    while ((match = regex.exec(text)) !== null) {
      // Check if this position overlaps with existing matches
      const overlaps = matches.some(m =>
        (match.index >= m.start && match.index < m.end) ||
        (match.index + match[0].length > m.start && match.index + match[0].length <= m.end)
      );

      if (!overlaps) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          word: match[0],
          item: item
        });
      }
    }
    replacedWords.add(word.toLowerCase());
  });

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Build result string
  let result = '';
  let lastEnd = 0;

  matches.forEach((match) => {
    // Add text before this match
    result += escapeHtml(text.slice(lastEnd, match.start));

    // Add highlighted word with tooltip
    const tooltipHtml = renderWordTooltip(match.item);
    result += `<span class="word-highlight">${escapeHtml(match.word)}${tooltipHtml}</span>`;

    lastEnd = match.end;
  });

  // Add remaining text
  result += escapeHtml(text.slice(lastEnd));

  return result;
}

function renderWordTooltip(item) {
  // Escape all content in tooltip to prevent HTML injection
  const word = escapeHtml(item.word || '');
  const phonetic = item.phonetic ? escapeHtml(item.phonetic) : '';
  const meaning = item.meaning ? escapeHtml(item.meaning) : '';
  const example = item.example ? escapeHtml(item.example) : '';
  const exampleAttr = item.example ? escapeAttr(item.example) : '';

  return `
    <span class="word-tooltip" onclick="event.stopPropagation()">
      <div class="word-head">
        <span class="word-text">${word}</span>
        ${phonetic ? `<span class="phonetic">${phonetic}</span>` : ''}
      </div>
      ${meaning ? `<div class="meaning">${meaning}</div>` : ''}
      ${example ? `
        <div class="example-row">
          <span class="example">${example}</span>
          <button class="speaker-btn" data-text="${exampleAttr}" title="Read aloud">🔊</button>
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

// Text-to-Speech Functions
function speakText(text, btn) {
  stopSpeaking();

  if (!('speechSynthesis' in window)) {
    showNotification('Speech synthesis not supported');
    return;
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentSpeakerBtn = btn;

  currentUtterance.lang = 'en-US';
  currentUtterance.rate = 0.9;

  if (btn) btn.classList.add('speaking');
  stopSpeakingBtn.style.display = 'flex';

  currentUtterance.onend = () => {
    if (btn) btn.classList.remove('speaking');
    stopSpeakingBtn.style.display = 'none';
    currentUtterance = null;
    currentSpeakerBtn = null;
  };

  currentUtterance.onerror = () => {
    if (btn) btn.classList.remove('speaking');
    stopSpeakingBtn.style.display = 'none';
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
  stopSpeakingBtn.style.display = 'none';
  currentUtterance = null;
  currentSpeakerBtn = null;
}

function updateVisibility() {
  document.querySelectorAll('.translation-section').forEach(el => {
    el.classList.toggle('hidden', !showTranslation);
  });
  document.querySelectorAll('.notes-section').forEach(el => {
    el.classList.toggle('hidden', !showNotes);
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
    const savedBookmark = localStorage.getItem('got-reader-bookmark');
    if (savedBookmark) {
      const bookmark = JSON.parse(savedBookmark);
      currentStartLine = Math.floor(bookmark.line / pageSize) * pageSize;
    }
  }
}

function loadPreferences() {
  const savedTranslation = localStorage.getItem('got-reader-show-translation');
  if (savedTranslation !== null) {
    showTranslation = savedTranslation === 'true';
    showTranslationCheckbox.checked = showTranslation;
  }

  const savedNotes = localStorage.getItem('got-reader-show-notes');
  if (savedNotes !== null) {
    showNotes = savedNotes === 'true';
    showNotesCheckbox.checked = showNotes;
  }
}

function saveBookmark() {
  localStorage.setItem('got-reader-bookmark', JSON.stringify({
    line: currentStartLine,
    timestamp: Date.now()
  }));
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