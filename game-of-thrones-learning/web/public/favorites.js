// Favorites management module
let currentPage = 1;
const pageSize = 20;
let totalPages = 1;
let favorites = [];

/**
 * Initialize favorites page
 */
async function initFavorites() {
  // Check authentication
  await window.auth.checkAuth();

  if (!window.auth.getCurrentUser()) {
    // Redirect to login
    window.location.href = '/?login=required';
    window.auth.showLoginModal();
    return;
  }

  updateAuthUI();
  await loadFavorites();
  initEventListeners();
}

/**
 * Load favorites from API
 */
async function loadFavorites(page = 1) {
  const contentEl = document.getElementById('favorites-content');

  try {
    const response = await fetch(`/api/favorites?page=${page}&pageSize=${pageSize}`);

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/?login=required';
        window.auth.showLoginModal();
        return;
      }
      throw new Error('Failed to load favorites');
    }

    const data = await response.json();
    favorites = data.favorites;
    totalPages = data.totalPages;

    if (favorites.length === 0) {
      contentEl.innerHTML = `
        <div class="empty-state">
          <h2>No favorites yet</h2>
          <p>Click on highlighted words while reading to add them to your favorites.</p>
          <a href="/" class="back-to-reader">Start Reading →</a>
        </div>
      `;
    } else {
      renderFavorites();
    }

    updatePagination();
  } catch (err) {
    console.error('Load favorites error:', err);
    contentEl.innerHTML = `
      <div class="empty-state">
        <h2>Error loading favorites</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
}

/**
 * Render favorites list
 */
function renderFavorites() {
  const contentEl = document.getElementById('favorites-content');

  let html = '<div class="favorites-list">';

  favorites.forEach((favorite) => {
    html += `
      <div class="favorite-item" data-id="${favorite.id}" data-word="${favorite.word}" data-line="${favorite.line_number}">
        <div class="favorite-header">
          <span class="favorite-word">${escapeHtml(favorite.word)}</span>
          <button class="remove-favorite-btn" title="Remove from favorites" data-id="${favorite.id}">✕</button>
        </div>
        <div class="favorite-meta">
          ${favorite.chapter_id ? `<span class="favorite-chapter">${escapeHtml(favorite.chapter_id)}</span>` : ''}
          <span class="favorite-line">Line ${favorite.line_number}</span>
          <span class="favorite-date">${formatDate(favorite.created_at)}</span>
        </div>
        <div class="favorite-actions">
          <button class="lookup-btn" data-word="${favorite.word}">Lookup</button>
          <button class="jump-btn" data-line="${favorite.line_number}">Jump to Line</button>
        </div>
        <div class="favorite-dict" id="dict-${favorite.id}"></div>
      </div>
    `;
  });

  html += '</div>';
  contentEl.innerHTML = html;

  // Add event listeners
  contentEl.querySelectorAll('.remove-favorite-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const favoriteId = btn.dataset.id;
      await removeFavorite(favoriteId);
    });
  });

  contentEl.querySelectorAll('.lookup-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const word = btn.dataset.word;
      const dictEl = btn.parentElement.parentElement.querySelector('.favorite-dict');
      await lookupWord(word, dictEl);
    });
  });

  contentEl.querySelectorAll('.jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const line = parseInt(btn.dataset.line, 10);
      // Navigate back to reader with line parameter
      window.location.href = `/?line=${line}`;
    });
  });
}

/**
 * Lookup word dictionary
 */
async function lookupWord(word, dictEl) {
  if (!dictEl) return;

  dictEl.innerHTML = '<span class="loading-text">Loading...</span>';

  try {
    const response = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(word)}`);

    if (response.ok) {
      const data = await response.json();
      dictEl.innerHTML = `
        <div class="dict-result">
          <div class="dict-word-head">
            <span class="dict-word-text">${escapeHtml(data.word)}</span>
            ${data.phonetic ? `<span class="dict-phonetic">${escapeHtml(data.phonetic)}</span>` : ''}
          </div>
          ${data.pos ? `<div class="dict-pos">${escapeHtml(data.pos)}</div>` : ''}
          <div class="dict-translation">${escapeHtml(data.translation || '').replace(/\n/g, '<br>')}</div>
          <div class="dict-definition">${escapeHtml(data.definition || '').replace(/\n/g, '<br>')}</div>
        </div>
      `;
    } else {
      dictEl.innerHTML = '<span class="not-found">Word not found in dictionary</span>';
    }
  } catch (err) {
    dictEl.innerHTML = '<span class="error">Error loading dictionary</span>';
  }
}

/**
 * Remove favorite
 */
async function removeFavorite(favoriteId) {
  if (!confirm('Remove this word from favorites?')) {
    return;
  }

  try {
    const response = await fetch(`/api/favorites/${favoriteId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }

    // Remove from list
    const itemEl = document.querySelector(`.favorite-item[data-id="${favoriteId}"]`);
    if (itemEl) {
      itemEl.style.opacity = '0';
      itemEl.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        itemEl.remove();
        // Check if list is empty
        if (document.querySelectorAll('.favorite-item').length === 0) {
          loadFavorites(1);
        }
      }, 300);
    }
  } catch (err) {
    console.error('Remove favorite error:', err);
    alert('Failed to remove favorite: ' + err.message);
  }
}

/**
 * Update pagination controls
 */
function updatePagination() {
  const pageInfoEl = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  pageInfoEl.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
  document.getElementById('prev-page-btn')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadFavorites(currentPage);
    }
  });

  document.getElementById('next-page-btn')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadFavorites(currentPage);
    }
  });
}

/**
 * Update auth UI
 */
function updateAuthUI() {
  const user = window.auth.getCurrentUser();
  const userMenu = document.getElementById('user-menu');
  const usernameDisplay = document.getElementById('username-display');
  const adminBadge = document.getElementById('admin-badge');

  if (userMenu) {
    userMenu.style.display = user ? 'flex' : 'none';
  }

  if (usernameDisplay && user) {
    usernameDisplay.textContent = user.username;
  }

  if (adminBadge && user) {
    adminBadge.style.display = user.is_admin ? 'inline' : 'none';
  }

  // User menu button
  document.getElementById('user-menu-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('user-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown && !e.target.closest('#user-menu-btn') && !e.target.closest('#user-dropdown')) {
      dropdown.style.display = 'none';
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await window.auth.logout();
    window.location.href = '/';
  });
}

/**
 * Format date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFavorites);
