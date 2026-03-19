// Authentication module
let currentUser = null;

/**
 * Initialize authentication
 */
async function initAuth() {
  await checkAuth();
  updateAuthUI();
}

/**
 * Check if user is authenticated
 */
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me');
    const data = await response.json();
    currentUser = data.user;
    return currentUser;
  } catch (err) {
    console.error('Auth check error:', err);
    currentUser = null;
    return null;
  }
}

/**
 * Register new user
 */
async function register(username, password, passwordHint) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, passwordHint })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    currentUser = data.user;
    updateAuthUI();
    return { success: true, user: data.user };
  } catch (err) {
    console.error('Registration error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Login user
 */
async function login(username, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    currentUser = data.user;
    updateAuthUI();
    return { success: true, user: data.user };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Logout user
 */
async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    currentUser = null;
    updateAuthUI();
    return { success: true };
  } catch (err) {
    console.error('Logout error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get current user
 */
function getCurrentUser() {
  return currentUser;
}

/**
 * Check if user is admin
 */
function isAdmin() {
  return currentUser && currentUser.is_admin === 1;
}

/**
 * Update auth UI elements
 */
function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const userMenu = document.getElementById('user-menu');
  const usernameDisplay = document.getElementById('username-display');
  const adminBadge = document.getElementById('admin-badge');

  if (loginBtn) {
    loginBtn.style.display = currentUser ? 'none' : 'block';
  }

  if (userMenu) {
    userMenu.style.display = currentUser ? 'flex' : 'none';
  }

  if (usernameDisplay && currentUser) {
    usernameDisplay.textContent = currentUser.username;
  }

  if (adminBadge && currentUser) {
    adminBadge.style.display = currentUser.is_admin ? 'inline' : 'none';
  }
}

/**
 * Show login modal
 */
function showLoginModal() {
  const modal = document.getElementById('auth-modal');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (modal) {
    modal.style.display = 'flex';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  }
}

/**
 * Show register modal
 */
function showRegisterModal() {
  const modal = document.getElementById('auth-modal');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (modal) {
    modal.style.display = 'flex';
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

/**
 * Close auth modal
 */
function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  // Clear forms
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const registerUsername = document.getElementById('register-username');
  const registerPassword = document.getElementById('register-password');
  const registerPasswordHint = document.getElementById('register-password-hint');
  const authError = document.getElementById('auth-error');

  if (loginUsername) loginUsername.value = '';
  if (loginPassword) loginPassword.value = '';
  if (registerUsername) registerUsername.value = '';
  if (registerPassword) registerPassword.value = '';
  if (registerPasswordHint) registerPasswordHint.value = '';
  if (authError) authError.textContent = '';
}

/**
 * Toggle between login and register forms
 */
function toggleAuthForm() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const errorEl = document.getElementById('auth-error');

  if (errorEl) errorEl.textContent = '';

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

/**
 * Show user menu dropdown
 */
function showUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }
}

/**
 * Close user menu
 */
function closeUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

/**
 * Initialize auth event listeners
 */
function initAuthListeners() {
  // Login button
  document.getElementById('login-btn')?.addEventListener('click', showLoginModal);

  // User menu button
  document.getElementById('user-menu-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showUserMenu();
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#user-menu-btn') && !e.target.closest('#user-dropdown')) {
      closeUserMenu();
    }
  });

  // Login form submit
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('auth-error');

    const result = await login(username, password);

    if (result.success) {
      closeAuthModal();
      showNotification('Welcome back, ' + username + '!');
    } else {
      if (errorEl) errorEl.textContent = result.error;
    }
  });

  // Register form submit
  document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordHint = document.getElementById('register-password-hint').value.trim();
    const errorEl = document.getElementById('auth-error');

    const result = await register(username, password, passwordHint);

    if (result.success) {
      closeAuthModal();
      showNotification('Welcome, ' + username + '! You are now logged in.');
    } else {
      if (errorEl) errorEl.textContent = result.error;
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await logout();
    closeUserMenu();
    showNotification('You have been logged out.');
  });

  // Favorites link
  document.getElementById('favorites-link')?.addEventListener('click', () => {
    if (currentUser) {
      window.location.href = '/favorites.html';
    }
  });

  // Modal close
  document.getElementById('auth-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'auth-modal') {
      closeAuthModal();
    }
  });

  // Toggle auth form
  document.getElementById('toggle-auth-form')?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthForm();
  });

  // Keyboard handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      closeUserMenu();
    }
  });
}

/**
 * Show notification
 */
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
    z-index: 10000;
    transition: opacity 0.3s;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Export for use in other modules
window.auth = {
  init: initAuth,
  checkAuth,
  login,
  register,
  logout,
  getCurrentUser,
  isAdmin,
  showLoginModal,
  showRegisterModal,
  closeAuthModal,
  updateAuthUI,
  initAuthListeners
};
