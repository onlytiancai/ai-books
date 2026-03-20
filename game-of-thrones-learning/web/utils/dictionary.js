const Database = require('better-sqlite3');
const path = require('path');

// Dictionary database path
const DB_PATH = '/Users/huhao/src/codesnip/node/wawakeji-wx-app/nuxt4-dashboard-demo/prisma/dictionary.db';

let db = null;

function getDb() {
  if (!db) {
    try {
      db = new Database(DB_PATH, { readonly: true });
    } catch (err) {
      console.error('Failed to open dictionary database:', err.message);
      return null;
    }
  }
  return db;
}

// Common suffix patterns for lemma finding
const SUFFIX_PATTERNS = [
  // Plurals
  { pattern: /^(\w+)ies$/, base: '$1y' },      // stories -> story
  { pattern: /^(\w+)es$/, base: '$1' },        // watches -> watch, buses -> bus
  { pattern: /^(\w+)s$/, base: '$1' },         // cats -> cat
  // Past tense
  { pattern: /^(\w+)ied$/, base: '$1y' },      // studied -> study
  { pattern: /^(\w+)ed$/, base: '$1' },        // watched -> watch
  { pattern: /^(\w{2,})ed$/, base: '$1e' },    // moved -> move (try removing 'd' first, then 'ed')
  // Present participle / gerund
  { pattern: /^(\w+)ying$/, base: '$1ie' },    // dying -> die
  { pattern: /^(\w+)ing$/, base: '$1' },       // watching -> watch
  { pattern: /^(\w{2,})ing$/, base: '$1e' },   // moving -> move
  // Comparatives / superlatives
  { pattern: /^(\w+)ier$/, base: '$1y' },      // happier -> happy
  { pattern: /^(\w+)ier$/, base: '$1' },       // happier (also try as base)
  { pattern: /^(\w+)est$/, base: '$1' },       // fastest -> fast
  { pattern: /^(\w{2,})er$/, base: '$1' },     // faster -> fast
  { pattern: /^(\w{2,})er$/, base: '$1e' },    // nicer -> nice
  // Adverbs
  { pattern: /^(\w+)ily$/, base: '$1y' },      // happily -> happy
  { pattern: /^(\w+)ly$/, base: '$1' },        // quickly -> quick
];

/**
 * Find base form of a word (lemma finding)
 */
function findLemmas(word) {
  const candidates = [word.toLowerCase()];

  // Try removing common suffixes
  for (const { pattern, base } of SUFFIX_PATTERNS) {
    if (pattern.test(word.toLowerCase())) {
      const baseWord = word.toLowerCase().replace(pattern, base);
      if (baseWord.length >= 2) {
        candidates.push(baseWord);
      }
    }
  }

  // Add specific transformations
  const lower = word.toLowerCase();

  // -ied -> -y (studied -> study)
  if (lower.endsWith('ied') && lower.length > 4) {
    candidates.push(lower.slice(0, -3) + 'y');
  }

  // -ying -> -ie (dying -> die) or -y (studying -> study)
  if (lower.endsWith('ying') && lower.length > 5) {
    candidates.push(lower.slice(0, -4) + 'ie');
    candidates.push(lower.slice(0, -4) + 'y');
  }

  // Double consonant + ing/ed: stopped -> stop
  if (/(\w)\1(ed|ing)$/.test(lower)) {
    const match = lower.match(/^(\w+)(.)\2(ed|ing)$/);
    if (match) {
      candidates.push(match[1] + match[2]);
    }
  }

  // Remove duplicates while preserving order
  return [...new Set(candidates)];
}

/**
 * Look up a word in the dictionary
 */
function lookupWord(word) {
  const database = getDb();
  if (!database) {
    return null;
  }

  const lowerWord = word.toLowerCase().trim();
  if (!lowerWord) {
    return null;
  }

  // Try exact match first
  try {
    const stmt = database.prepare('SELECT * FROM Dictionary WHERE word = ? COLLATE NOCASE');
    const result = stmt.get(lowerWord);

    if (result) {
      return formatResult(result);
    }

    // Try lemma variants
    const lemmas = findLemmas(lowerWord);
    for (const lemma of lemmas) {
      if (lemma !== lowerWord) {
        const lemmaResult = stmt.get(lemma);
        if (lemmaResult) {
          return formatResult(lemmaResult);
        }
      }
    }

    return null;
  } catch (err) {
    console.error('Dictionary lookup error:', err.message);
    return null;
  }
}

/**
 * Format dictionary result
 */
function formatResult(row) {
  // Convert escaped newlines to actual newlines
  const definition = (row.definition || '').replace(/\\n/g, '\n');
  const translation = (row.translation || '').replace(/\\n/g, '\n');

  return {
    word: row.word,
    phonetic: row.phonetic || '',
    definition: definition,
    translation: translation,
    pos: row.pos || '',
    collins: row.collins || 0,
    oxford: row.oxford || 0,
    tag: row.tag || '',
    bnc: row.bnc || null,
    frq: row.frq || null,
    exchange: row.exchange || '',
    // Youdao audio URLs
    audioUs: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(row.word)}&type=1`,
    audioUk: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(row.word)}&type=2`
  };
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
  lookupWord,
  findLemmas,
  getDb,
  closeDb
};