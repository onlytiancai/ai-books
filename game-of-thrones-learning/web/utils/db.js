const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// App database path
const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

let db = null;

/**
 * Initialize the application database
 */
function initDb() {
  if (db) {
    return db;
  }

  try {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');

    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        password_hint TEXT,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create word_favorites table
    db.exec(`
      CREATE TABLE IF NOT EXISTS word_favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        word TEXT NOT NULL,
        line_number INTEGER NOT NULL,
        chapter_id TEXT,
        sentence TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, word, line_number)
      )
    `);

    // Add sentence column to existing tables (if needed)
    try {
      db.exec(`
        ALTER TABLE word_favorites ADD COLUMN sentence TEXT;
      `);
    } catch (err) {
      // Column may already exist, ignore error
    }

    // Create indexes for better query performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON word_favorites(user_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_word ON word_favorites(word);
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
    throw err;
  }
}

/**
 * Get database instance
 */
function getDb() {
  if (!db) {
    return initDb();
  }
  return db;
}

// ==================== User Functions ====================

/**
 * Create a new user
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @param {string} [passwordHint] - Optional password hint
 * @returns {object} - Created user (without password hash)
 */
function createUser(username, password, passwordHint = null) {
  const database = getDb();

  // Check if user already exists
  const existingUser = database.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash password
  const passwordHash = bcrypt.hashSync(password, 10);

  // Check if this is the first user (make them admin)
  const firstUser = database.prepare('SELECT id FROM users LIMIT 1').get();
  const isAdmin = firstUser ? 0 : 1;

  const stmt = database.prepare(`
    INSERT INTO users (username, password_hash, password_hint, is_admin)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(username, passwordHash, passwordHint, isAdmin);

  return {
    id: result.lastInsertRowid,
    username,
    is_admin: isAdmin,
    created_at: new Date().toISOString()
  };
}

/**
 * Authenticate user
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {object|null} - User object (without password hash) or null
 */
function authenticateUser(username, password) {
  const database = getDb();

  const stmt = database.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);

  if (!user) {
    return null;
  }

  // Verify password
  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    is_admin: user.is_admin,
    created_at: user.created_at
  };
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {object|null} - User object (without password hash) or null
 */
function getUserById(id) {
  const database = getDb();

  const stmt = database.prepare('SELECT id, username, is_admin, created_at FROM users WHERE id = ?');
  return stmt.get(id);
}

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {object|null} - User object (without password hash) or null
 */
function getUserByUsername(username) {
  const database = getDb();

  const stmt = database.prepare('SELECT id, username, is_admin, created_at FROM users WHERE username = ?');
  return stmt.get(username);
}

/**
 * Get all users (admin only)
 * @returns {array} - Array of user objects
 */
function getAllUsers() {
  const database = getDb();

  const stmt = database.prepare('SELECT id, username, is_admin, password_hint, created_at FROM users ORDER BY created_at');
  return stmt.all();
}

/**
 * Reset user password
 * @param {number} userId - User ID
 * @param {string} newPassword - New plain text password
 * @param {string} [passwordHint] - New password hint
 * @returns {boolean} - Success status
 */
function resetPassword(userId, newPassword, passwordHint = null) {
  const database = getDb();

  const passwordHash = bcrypt.hashSync(newPassword, 10);

  const stmt = database.prepare(`
    UPDATE users
    SET password_hash = ?, password_hint = ?
    WHERE id = ?
  `);

  const result = stmt.run(passwordHash, passwordHint, userId);
  return result.changes > 0;
}

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {boolean} - Success status
 */
function deleteUser(userId) {
  const database = getDb();

  // First delete associated favorites
  database.prepare('DELETE FROM word_favorites WHERE user_id = ?').run(userId);

  const stmt = database.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(userId);
  return result.changes > 0;
}

// ==================== Word Favorites Functions ====================

/**
 * Add a word to favorites
 * @param {number} userId - User ID
 * @param {string} word - The word
 * @param {number} lineNumber - Line number where word was found
 * @param {string} [chapterId] - Chapter ID
 * @param {string} [sentence] - The sentence where the word was found
 * @returns {object} - Created favorite
 */
function addFavorite(userId, word, lineNumber, chapterId = null, sentence = null) {
  const database = getDb();

  try {
    const stmt = database.prepare(`
      INSERT INTO word_favorites (user_id, word, line_number, chapter_id, sentence)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, word, line_number) DO UPDATE SET sentence = excluded.sentence
    `);

    const result = stmt.run(userId, word.toLowerCase(), lineNumber, chapterId, sentence);

    if (result.changes === 0) {
      // Favorite already exists
      const existing = database.prepare(`
        SELECT * FROM word_favorites
        WHERE user_id = ? AND word = ? AND line_number = ?
      `).get(userId, word.toLowerCase(), lineNumber);

      return { ...existing, already_exists: true };
    }

    return {
      id: result.lastInsertRowid,
      user_id: userId,
      word: word.toLowerCase(),
      line_number: lineNumber,
      chapter_id: chapterId,
      sentence: sentence,
      created_at: new Date().toISOString()
    };
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      const existing = database.prepare(`
        SELECT * FROM word_favorites
        WHERE user_id = ? AND word = ? AND line_number = ?
      `).get(userId, word.toLowerCase(), lineNumber);
      return { ...existing, already_exists: true };
    }
    throw err;
  }
}

// Remove favorite by ID
function removeFavorite(favoriteId, userId) {
  const database = getDb();

  const stmt = database.prepare(`
    DELETE FROM word_favorites
    WHERE id = ? AND user_id = ?
  `);

  const result = stmt.run(favoriteId, userId);
  return result.changes > 0;
}

/**
 * Get user's favorites with pagination
 * @param {number} userId - User ID
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Items per page
 * @returns {object} - { favorites, total, page, pageSize, totalPages }
 */
function getFavorites(userId, page = 1, pageSize = 20) {
  const database = getDb();
  const dictionaryDb = require('./dictionary').getDb();

  const offset = (page - 1) * pageSize;

  // Get total count
  const countStmt = database.prepare(`
    SELECT COUNT(*) as total FROM word_favorites WHERE user_id = ?
  `);
  const { total } = countStmt.get(userId);

  // Get favorites with pagination
  const favoritesStmt = database.prepare(`
    SELECT id, word, line_number, chapter_id, sentence, created_at
    FROM word_favorites
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);

  const favorites = favoritesStmt.all(userId, pageSize, offset);

  // Enrich with dictionary data
  const enrichedFavorites = favorites.map(fav => {
    let dictData = null;
    if (dictionaryDb) {
      try {
        const dictStmt = dictionaryDb.prepare('SELECT * FROM Dictionary WHERE word = ? COLLATE NOCASE');
        dictData = dictStmt.get(fav.word);
      } catch (err) {
        console.error('Dictionary query error for word', fav.word, ':', err.message);
      }
    }

    const result = {
      ...fav,
      phonetic: dictData?.phonetic || '',
      translation: dictData?.translation ? dictData.translation.replace(/\\n/g, '\n') : '',
      pos: dictData?.pos || ''
    };
    return result;
  });

  return {
    favorites: enrichedFavorites,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

/**
 * Check if a word is in user's favorites
 * @param {number} userId - User ID
 * @param {string} word - The word
 * @param {number} lineNumber - Line number
 * @returns {object|null} - Favorite object or null
 */
function isFavorite(userId, word, lineNumber) {
  const database = getDb();

  const stmt = database.prepare(`
    SELECT * FROM word_favorites
    WHERE user_id = ? AND word = ? AND line_number = ?
  `);

  return stmt.get(userId, word.toLowerCase(), lineNumber);
}

/**
 * Get favorite by ID and user
 * @param {number} favoriteId - Favorite ID
 * @param {number} userId - User ID
 * @returns {object|null} - Favorite object or null
 */
function getFavoriteById(favoriteId, userId) {
  const database = getDb();

  const stmt = database.prepare(`
    SELECT * FROM word_favorites
    WHERE id = ? AND user_id = ?
  `);

  return stmt.get(favoriteId, userId);
}

/**
 * Close database connection
 */
function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  // Database management
  initDb,
  getDb,
  closeDb,

  // User functions
  createUser,
  authenticateUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  resetPassword,
  deleteUser,

  // Favorites functions
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  getFavoriteById
};
