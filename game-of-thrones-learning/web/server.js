const express = require('express');
const path = require('path');
const session = require('express-session');
const { readLinesRange, getTotalLines, getLineByNumber, getVocabularyForWord } = require('./utils/jsonl-reader');
const { lookupWord } = require('./utils/dictionary');
const db = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
db.initDb();

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'got-reader-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ==================== Middleware ====================

/**
 * Require authentication middleware
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

/**
 * Require admin middleware
 */
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ==================== Auth Routes ====================

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, password, passwordHint } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = db.createUser(username, password, passwordHint || null);

    // Auto-login first user
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = user.is_admin;

    res.json({ user });
  } catch (err) {
    console.error('Registration error:', err.message);
    if (err.message === 'Username already exists') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = db.authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = user.is_admin;

    res.json({ user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.json({ success: true });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.json({ user: null });
  }

  const user = db.getUserById(req.session.userId);
  if (!user) {
    req.session.destroy();
    return res.json({ user: null });
  }

  res.json({ user });
});

// ==================== User Management Routes (Admin) ====================

// Get all users
app.get('/api/users', requireAdmin, (req, res) => {
  try {
    const users = db.getAllUsers();
    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Reset password
app.post('/api/users/:id/reset-password', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { newPassword, passwordHint } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const success = db.resetPassword(userId, newPassword, passwordHint || null);

    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Delete user
app.delete('/api/users/:id', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Prevent admin from deleting themselves
    if (userId === req.session.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const success = db.deleteUser(userId);

    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ==================== Favorites Routes ====================

// Get user's favorites
app.get('/api/favorites', requireAuth, (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 20;

    const result = db.getFavorites(req.session.userId, page, pageSize);

    res.json(result);
  } catch (err) {
    console.error('Get favorites error:', err.message);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// Add favorite
app.post('/api/favorites', requireAuth, (req, res) => {
  try {
    const { word, lineNumber, chapterId, sentence } = req.body;

    if (!word || lineNumber === undefined) {
      return res.status(400).json({ error: 'Word and line number required' });
    }

    const favorite = db.addFavorite(
      req.session.userId,
      word,
      lineNumber,
      chapterId || null,
      sentence || null
    );

    if (favorite.already_exists) {
      return res.json({
        favorite: null,
        already_exists: true,
        message: favorite.message || 'Word already in favorites'
      });
    }

    res.json({ favorite });
  } catch (err) {
    console.error('Add favorite error:', err.message);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove favorite
app.delete('/api/favorites/:id', requireAuth, (req, res) => {
  try {
    const favoriteId = parseInt(req.params.id, 10);

    // Verify ownership
    const favorite = db.getFavoriteById(favoriteId, req.session.userId);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    const success = db.removeFavorite(favoriteId, req.session.userId);

    res.json({ success });
  } catch (err) {
    console.error('Remove favorite error:', err.message);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Check if word is favorite
app.get('/api/favorites/check/:word/:lineNumber', requireAuth, (req, res) => {
  try {
    const word = decodeURIComponent(req.params.word);
    const lineNumber = parseInt(req.params.lineNumber, 10);

    const favorite = db.isFavorite(req.session.userId, word, lineNumber);

    res.json({ isFavorite: !!favorite, favorite });
  } catch (err) {
    console.error('Check favorite error:', err.message);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

// API: Get total line count
app.get('/api/total', async (req, res) => {
  try {
    const total = await getTotalLines();
    res.json({ total });
  } catch (err) {
    console.error('Error getting total lines:', err);
    res.status(500).json({ error: 'Failed to get total lines' });
  }
});

// API: Get lines by range
app.get('/api/lines', async (req, res) => {
  try {
    const start = parseInt(req.query.start, 10) || 0;
    const count = parseInt(req.query.count, 10) || 10;

    if (start < 0 || count < 1 || count > 100) {
      return res.status(400).json({ error: 'Invalid parameters. start >= 0, 1 <= count <= 100' });
    }

    const lines = await readLinesRange(start, count);
    res.json(lines);
  } catch (err) {
    console.error('Error reading lines:', err);
    res.status(500).json({ error: 'Failed to read lines' });
  }
});

// API: Dictionary lookup
app.get('/api/dictionary/lookup', (req, res) => {
  try {
    const word = (req.query.word || '').trim();
    if (!word) {
      return res.status(400).json({ error: 'Word parameter required' });
    }

    const result = lookupWord(word);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Word not found in dictionary' });
    }
  } catch (err) {
    console.error('Dictionary lookup error:', err);
    res.status(500).json({ error: 'Failed to lookup word' });
  }
});

// API: Get single line
app.get('/api/line/:num', async (req, res) => {
  try {
    const lineNum = parseInt(req.params.num, 10);

    if (isNaN(lineNum) || lineNum < 0) {
      return res.status(400).json({ error: 'Invalid line number' });
    }

    const line = await getLineByNumber(lineNum);

    if (!line) {
      return res.status(404).json({ error: 'Line not found' });
    }

    res.json(line);
  } catch (err) {
    console.error('Error getting line:', err);
    res.status(500).json({ error: 'Failed to get line' });
  }
});

// API: Get vocabulary context for a word at specific line
app.get('/api/vocabulary/context', async (req, res) => {
  try {
    const { word, line } = req.query;
    if (!word || line === undefined) {
      return res.status(400).json({ error: 'Word and line parameters required' });
    }

    const lineNum = parseInt(line, 10);
    const vocabData = await getVocabularyForWord(lineNum, word);

    if (vocabData) {
      res.json(vocabData);
    } else {
      res.status(404).json({ error: 'Vocabulary entry not found' });
    }
  } catch (err) {
    console.error('Error getting vocabulary context:', err);
    res.status(500).json({ error: 'Failed to get vocabulary context' });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});