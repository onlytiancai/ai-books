// State
let currentStartLine = 0;
let pageSize = 10;
let totalLines = 0;
let currentData = [];
let showTranslation = true;
let showNotes = true;
let currentUtterance = null;
let currentSpeakerBtn = null;
let dictionaryCache = new Map(); // Cache dictionary lookups
let activePopup = null;
let popupTimeout = null;

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
const bookmarkInfoEl = document.getElementById('bookmark-info');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize authentication first
  if (window.auth) {
    await window.auth.init();
    window.auth.initAuthListeners();
  }

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
  updateBookmarkInfo();
  showNotification('Bookmark saved at line ' + currentStartLine);
});

bookmarkInfoEl.addEventListener('click', () => {
  const saved = localStorage.getItem('got-reader-bookmark');
  if (saved) {
    const bookmark = JSON.parse(saved);
    currentStartLine = Math.floor(bookmark.line / pageSize) * pageSize;
    loadLines(currentStartLine);
    updateURL();
  }
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

  // Add click handlers for word highlights (vocabulary words)
  document.querySelectorAll('.word-highlight').forEach(el => {
    el.addEventListener('click', (e) => {
      document.querySelectorAll('.word-highlight.active').forEach(active => {
        active.classList.remove('active');
      });
      el.classList.toggle('active');
      adjustTooltipPosition(el);
      // Load dictionary data for vocabulary word
      loadVocabDictData(el);
    });

  });

  // Add click handlers for dict-words (non-vocabulary words)
  document.querySelectorAll('.dict-word').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const word = el.dataset.word;
      // Get line number from parent container
      const lineContainer = el.closest('.line-container');
      const lineNumText = lineContainer?.querySelector('.line-number')?.textContent || '';
      const lineNumMatch = lineNumText.match(/Line (\d+)/);
      const lineNumber = lineNumMatch ? parseInt(lineNumMatch[1], 10) : currentStartLine;
      // Get chapter ID
      const chapterIdMatch = lineNumText.match(/\| (.+)$/);
      const chapterId = chapterIdMatch ? chapterIdMatch[1].trim() : null;

      if (word) {
        showDictionaryPopup(el, word, lineNumber, chapterId);
      }
    });
  });

  // Close active highlights when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.word-highlight')) {
      document.querySelectorAll('.word-highlight.active').forEach(el => {
        el.classList.remove('active');
      });
    }

    // Close dict popup when clicking elsewhere
    if (!e.target.closest('.dict-word') && !e.target.closest('.dict-popup')) {
      if (activePopup) {
        activePopup.remove();
        activePopup = null;
      }
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
  if (!text) {
    return '';
  }

  // Sort by word length (longest first) to avoid partial matches
  const sortedVocab = [...(vocabulary || [])].sort((a, b) => {
    return (b.word || '').length - (a.word || '').length;
  });

  // Create a map for quick lookup
  const vocabMap = new Map();
  sortedVocab.forEach(item => {
    if (item.word) {
      vocabMap.set(item.word.toLowerCase(), item);
    }
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
          item: item,
          isVocab: true
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
    // Add text before this match - wrap non-highlighted words
    result += wrapNonHighlightWords(text.slice(lastEnd, match.start));

    // Add highlighted word with tooltip
    const tooltipHtml = renderWordTooltip(match.item, match.word);
    result += `<span class="word-highlight" data-word="${escapeAttr(match.word)}">${escapeHtml(match.word)}${tooltipHtml}</span>`;

    lastEnd = match.end;
  });

  // Add remaining text - wrap non-highlighted words
  result += wrapNonHighlightWords(text.slice(lastEnd));

  return result;
}

/**
 * Wrap non-highlighted words in spans for dictionary lookup
 */
function wrapNonHighlightWords(text) {
  if (!text) return '';

  // Match words (including contractions like don't, it's)
  const wordRegex = /\b([a-zA-Z]+(?:'[a-zA-Z]+)?)\b/g;
  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    // Add non-word text
    result += escapeHtml(text.slice(lastIndex, match.index));
    // Add wrapped word
    const word = match[1];
    result += `<span class="dict-word" data-word="${escapeAttr(word)}">${escapeHtml(word)}</span>`;
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  result += escapeHtml(text.slice(lastIndex));

  return result;
}

function renderWordTooltip(item, word) {
  // Escape all content in tooltip to prevent HTML injection
  const wordText = escapeHtml(word || item.word || '');
  const phonetic = item.phonetic ? escapeHtml(item.phonetic) : '';
  const meaning = item.meaning ? escapeHtml(item.meaning) : '';

  // Audio URLs from Youdao
  const audioUs = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(item.word)}&type=1`;
  const audioUk = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(item.word)}&type=2`;

  return `
    <span class="word-tooltip" onclick="event.stopPropagation()">
      <div class="word-head">
        <span class="word-text">${wordText}</span>
        ${phonetic ? `<span class="phonetic">${phonetic}</span>` : ''}
        <button class="close-btn" onclick="closeActivePopup()" title="Close">✕</button>
      </div>
      <div class="audio-buttons">
        <button class="audio-btn" onclick="event.stopPropagation(); playWordAudio('${escapeAttr(audioUs)}', this)" title="US pronunciation"><span class="audio-icon">🔊</span><span class="audio-label">US</span></button>
        <button class="audio-btn" onclick="event.stopPropagation(); playWordAudio('${escapeAttr(audioUk)}', this)" title="UK pronunciation"><span class="audio-icon">🔊</span><span class="audio-label">UK</span></button>
      </div>
      ${meaning ? `<div class="meaning-context"><span class="meaning-label">Context meaning:</span> ${meaning}</div>` : ''}
      <div class="dict-extra" data-word="${escapeAttr(item.word)}"></div>
    </span>
  `;
}

/**
 * Play word audio from Youdao
 */
function playWordAudio(url, btn) {
  const audio = new Audio(url);
  if (btn) {
    btn.classList.add('playing');
    audio.onended = () => btn.classList.remove('playing');
    audio.onerror = () => btn.classList.remove('playing');
  }
  audio.play().catch(err => console.error('Audio play error:', err));
}

/**
 * Lookup word in dictionary via API
 */
async function fetchDictionaryData(word) {
  const lowerWord = word.toLowerCase();

  // Check cache first
  if (dictionaryCache.has(lowerWord)) {
    return dictionaryCache.get(lowerWord);
  }

  try {
    const response = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(word)}`);
    if (response.ok) {
      const data = await response.json();
      dictionaryCache.set(lowerWord, data);
      return data;
    }
    return null;
  } catch (err) {
    console.error('Dictionary lookup error:', err);
    return null;
  }
}

/**
 * Load dictionary data into vocabulary word tooltip
 */
async function loadVocabDictData(wordEl) {
  const tooltip = wordEl.querySelector('.word-tooltip');
  if (!tooltip) return;

  const dictExtra = tooltip.querySelector('.dict-extra');
  if (!dictExtra || dictExtra.dataset.loaded) return;

  const word = dictExtra.dataset.word;
  if (!word) return;

  // Mark as loading
  dictExtra.innerHTML = '<div class="dict-loading-text">Loading dictionary...</div>';

  const data = await fetchDictionaryData(word);
  dictExtra.dataset.loaded = 'true';

  if (!data) {
    dictExtra.innerHTML = '';
    return;
  }

  // Render dictionary definitions
  const translation = data.translation || '';
  const definition = data.definition || '';

  const transLines = translation ? translation.split('\n').filter(t => t.trim()) : [];
  const defLines = definition ? definition.split('\n').filter(d => d.trim()) : [];

  let html = '';

  if (transLines.length > 0) {
    const transHtml = renderCollapsibleLines(transLines, 'trans-item', 'translation-inline');
    html += transHtml;
  }

  if (defLines.length > 0) {
    const defHtml = renderCollapsibleLines(defLines, 'def-item', 'definition-inline');
    html += defHtml;
  }

  dictExtra.innerHTML = html;

  // Re-position tooltip after content load
  adjustTooltipPosition(wordEl);
}

/**
 * Show dictionary popup for a word
 */
async function showDictionaryPopup(wordEl, word, lineNumber, chapterId) {
  // Clear any pending hide timeout
  if (popupTimeout) {
    clearTimeout(popupTimeout);
    popupTimeout = null;
  }

  // Remove existing popup
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }

  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'dict-popup';
  popup.innerHTML = '<div class="dict-loading-text">Loading...</div>';
  document.body.appendChild(popup);
  activePopup = popup;

  // Position popup
  positionPopup(popup, wordEl);

  // Fetch dictionary data
  const data = await fetchDictionaryData(word);

  if (!data) {
    popup.innerHTML = `
      <div class="word-head">
        <span class="word-text">${escapeHtml(word)}</span>
        <button class="close-btn" onclick="closeActivePopup()" title="Close">✕</button>
      </div>
      <div class="dict-not-found">Word not found in dictionary</div>
    `;
    return;
  }

  // Render full dictionary data
  popup.innerHTML = renderDictionaryPopup(data, word, lineNumber, chapterId);

  // Add event handlers for audio buttons
  popup.querySelectorAll('.audio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playWordAudio(btn.dataset.url, btn);
    });
  });

  // Add event handler for favorite button
  const favBtn = popup.querySelector('.favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await toggleFavorite(favBtn, word, lineNumber, chapterId);
    });
  }

  // Check if word is already a favorite
  checkIfFavorite(word, lineNumber);

  // Re-position after content load
  positionPopup(popup, wordEl);
}

/**
 * Render dictionary popup content
 */
function renderDictionaryPopup(data, word, lineNumber, chapterId) {
  const wordText = escapeHtml(data.word || '');
  const phonetic = data.phonetic ? escapeHtml(data.phonetic) : '';
  const translation = data.translation || '';
  const definition = data.definition || '';
  const pos = data.pos ? escapeHtml(data.pos) : '';
  const tag = data.tag ? escapeHtml(data.tag) : '';
  const collins = data.collins || 0;
  const oxford = data.oxford || 0;

  // Parse translation lines
  const transLines = translation ? translation.split('\n').filter(t => t.trim()) : [];
  const transHtml = renderCollapsibleLines(transLines, 'trans-item', 'translation');

  // Parse definition lines
  const defLines = definition ? definition.split('\n').filter(d => d.trim()) : [];
  const defHtml = renderCollapsibleLines(defLines, 'def-item', 'definition');

  // Render stars
  const collinsStars = '★'.repeat(Math.min(collins, 5));
  const oxfordBadge = oxford ? '<span class="oxford-badge">OXFORD</span>' : '';

  // Check if user is logged in
  const user = window.auth?.getCurrentUser?.();
  const favoriteBtnHtml = user ? `
    <button class="favorite-btn" data-word="${escapeAttr(word)}" data-line="${lineNumber}" title="Add to favorites">
      <span class="favorite-icon">☆</span>
      <span class="favorite-label">Add to favorites</span>
    </button>
  ` : '';

  return `
    <div class="word-head">
      <span class="word-text">${wordText}</span>
      ${phonetic ? `<span class="phonetic">${phonetic}</span>` : ''}
      <button class="close-btn" onclick="closeActivePopup()" title="Close">✕</button>
    </div>
    <div class="audio-buttons">
      <button class="audio-btn" data-url="${escapeAttr(data.audioUs)}" title="US pronunciation"><span class="audio-icon">🔊</span><span class="audio-label">US</span></button>
      <button class="audio-btn" data-url="${escapeAttr(data.audioUk)}" title="UK pronunciation"><span class="audio-icon">🔊</span><span class="audio-label">UK</span></button>
    </div>
    ${pos ? `<div class="pos">${pos}</div>` : ''}
    ${transHtml}
    ${defHtml}
    <div class="word-meta">
      ${collinsStars ? `<span class="collins">${collinsStars}</span>` : ''}
      ${oxfordBadge}
      ${tag ? `<span class="tag">${escapeHtml(tag)}</span>` : ''}
    </div>
    ${favoriteBtnHtml}
  `;
}

/**
 * Render collapsible lines (show 2 by default, more on click)
 */
function renderCollapsibleLines(lines, itemClass, sectionClass) {
  if (!lines || lines.length === 0) return '';

  const maxVisible = 2;
  const hasMore = lines.length > maxVisible;

  // Escape HTML for each line
  const escapedLines = lines.map(l => escapeHtml(l.trim()));

  // Visible lines
  const visibleHtml = escapedLines.slice(0, maxVisible).map(l =>
    `<div class="${itemClass}">${l}</div>`
  ).join('');

  // Hidden lines
  const hiddenHtml = hasMore ? escapedLines.slice(maxVisible).map(l =>
    `<div class="${itemClass} hidden-line">${l}</div>`
  ).join('') : '';

  // Show more button
  const moreBtn = hasMore ?
    `<button class="show-more-btn" onclick="toggleShowMore(this)">Show more (${lines.length - maxVisible} more)</button>` :
    '';

  return `<div class="${sectionClass}">${visibleHtml}${hiddenHtml}${moreBtn}</div>`;
}

/**
 * Toggle show more/less for collapsed content
 */
function toggleShowMore(btn) {
  const container = btn.parentElement;
  const hiddenLines = container.querySelectorAll('.hidden-line');
  const isExpanded = btn.classList.contains('expanded');

  if (isExpanded) {
    hiddenLines.forEach(el => el.style.display = 'none');
    btn.textContent = btn.dataset.originalText;
    btn.classList.remove('expanded');
  } else {
    hiddenLines.forEach(el => el.style.display = 'block');
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Show less';
    btn.classList.add('expanded');
  }
}

/**
 * Position the popup near the word element
 */
function positionPopup(popup, wordEl) {
  const rect = wordEl.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();

  let left = rect.left;
  let top = rect.bottom + 8;

  // Adjust if overflowing right
  if (left + popupRect.width > window.innerWidth - 10) {
    left = window.innerWidth - popupRect.width - 10;
  }

  // Adjust if overflowing bottom
  if (top + popupRect.height > window.innerHeight - 10) {
    top = rect.top - popupRect.height - 8;
  }

  // Ensure minimum left
  if (left < 10) left = 10;

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

/**
 * Hide dictionary popup with delay
 */
function hideDictionaryPopup() {
  popupTimeout = setTimeout(() => {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
    popupTimeout = null;
  }, 300);
}

/**
 * Close active popup immediately
 */
function closeActivePopup() {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
  // Also remove active class from word highlights
  document.querySelectorAll('.word-highlight.active').forEach(el => {
    el.classList.remove('active');
  });
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

  // Show bookmark info
  updateBookmarkInfo();
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

function updateBookmarkInfo() {
  const saved = localStorage.getItem('got-reader-bookmark');
  if (saved) {
    const bookmark = JSON.parse(saved);
    const date = new Date(bookmark.timestamp);
    const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bookmarkInfoEl.textContent = `📌 Line ${bookmark.line} (${timeStr})`;
    bookmarkInfoEl.style.display = 'inline';
    bookmarkInfoEl.title = 'Click to jump to bookmark';
  } else {
    bookmarkInfoEl.style.display = 'none';
  }
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

// Adjust tooltip position to prevent overflow
function adjustTooltipPosition(wordEl) {
  const tooltip = wordEl.querySelector('.word-tooltip');
  if (!tooltip) return;

  // Get word position
  const wordRect = wordEl.getBoundingClientRect();

  // Temporarily show tooltip for measurement
  tooltip.style.visibility = 'hidden';
  tooltip.style.opacity = '1';
  tooltip.style.pointerEvents = 'none';

  // Get tooltip dimensions
  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width;
  const tooltipHeight = tooltipRect.height;

  // Calculate initial position (below the word)
  let left = wordRect.left;
  let top = wordRect.bottom + 4;

  // Adjust horizontal position if overflowing right
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = wordRect.right - tooltipWidth;
    if (left < 10) left = 10;
  }

  // Adjust vertical position if overflowing bottom
  if (top + tooltipHeight > window.innerHeight - 10) {
    top = wordRect.top - tooltipHeight - 4;
    if (top < 10) top = 10;
  }

  // Apply position
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;

  // Restore visibility
  tooltip.style.visibility = '';
  tooltip.style.opacity = '';
  tooltip.style.pointerEvents = '';
}

// ==================== Favorites Functions ====================

/**
 * Toggle favorite status for a word
 */
async function toggleFavorite(btn, word, lineNumber, chapterId) {
  const user = window.auth?.getCurrentUser?.();
  if (!user) {
    window.auth?.showLoginModal?.();
    return;
  }

  const isFav = btn.classList.contains('active');

  if (isFav) {
    await removeFavorite(btn, word, lineNumber);
  } else {
    await addFavorite(btn, word, lineNumber, chapterId);
  }
}

/**
 * Add a word to favorites
 */
async function addFavorite(btn, word, lineNumber, chapterId) {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, lineNumber, chapterId })
    });

    if (!response.ok) {
      throw new Error('Failed to add favorite');
    }

    btn.classList.add('active');
    btn.querySelector('.favorite-icon').textContent = '★';
    btn.querySelector('.favorite-label').textContent = 'Remove from favorites';
    btn.title = 'Remove from favorites';

    showNotification('Added to favorites!');
  } catch (err) {
    console.error('Add favorite error:', err);
    showNotification('Error: ' + err.message);
  }
}

/**
 * Remove a word from favorites
 */
async function removeFavorite(btn, word, lineNumber) {
  // First, find the favorite ID
  try {
    const checkResponse = await fetch(`/api/favorites/check/${encodeURIComponent(word)}/${lineNumber}`);
    if (checkResponse.ok) {
      const data = await checkResponse.json();
      if (data.favorite && data.favorite.id) {
        const deleteResponse = await fetch(`/api/favorites/${data.favorite.id}`, {
          method: 'DELETE'
        });

        if (deleteResponse.ok) {
          btn.classList.remove('active');
          btn.querySelector('.favorite-icon').textContent = '☆';
          btn.querySelector('.favorite-label').textContent = 'Add to favorites';
          btn.title = 'Add to favorites';
          showNotification('Removed from favorites');
        } else {
          throw new Error('Failed to remove favorite');
        }
      }
    }
  } catch (err) {
    console.error('Remove favorite error:', err);
    showNotification('Error: ' + err.message);
  }
}

/**
 * Check if word is already a favorite
 */
async function checkIfFavorite(word, lineNumber) {
  const user = window.auth?.getCurrentUser?.();
  if (!user) return;

  try {
    const response = await fetch(`/api/favorites/check/${encodeURIComponent(word)}/${lineNumber}`);
    if (response.ok) {
      const data = await response.json();
      if (data.isFavorite && activePopup) {
        const btn = activePopup.querySelector('.favorite-btn');
        if (btn) {
          btn.classList.add('active');
          btn.querySelector('.favorite-icon').textContent = '★';
          btn.querySelector('.favorite-label').textContent = 'Remove from favorites';
          btn.title = 'Remove from favorites';
        }
      }
    }
  } catch (err) {
    console.error('Check favorite error:', err);
  }
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  loadFromURL();
  loadLines(currentStartLine);
});