const fs = require('fs');
const readline = require('readline');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/translated_lines.jsonl');

/**
 * Read a range of lines from JSONL file using streaming
 * @param {number} start - Starting line number (0-indexed)
 * @param {number} count - Number of lines to read
 * @returns {Promise<Array>} - Array of parsed JSON objects
 */
async function readLinesRange(start, count) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(DATA_FILE);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const results = [];
    let currentLine = 0;
    let ended = false;

    rl.on('line', (line) => {
      if (ended) return;

      if (currentLine >= start && currentLine < start + count) {
        try {
          results.push(JSON.parse(line));
        } catch (e) {
          console.error(`Error parsing line ${currentLine}:`, e.message);
        }
      }

      currentLine++;

      if (currentLine >= start + count) {
        ended = true;
        rl.close();
        fileStream.destroy();
      }
    });

    rl.on('close', () => {
      resolve(results);
    });

    rl.on('error', (err) => {
      reject(err);
    });

    fileStream.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Get total number of lines in the JSONL file
 * @returns {Promise<number>} - Total line count
 */
async function getTotalLines() {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(DATA_FILE);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let count = 0;

    rl.on('line', () => {
      count++;
    });

    rl.on('close', () => {
      resolve(count);
    });

    rl.on('error', (err) => {
      reject(err);
    });

    fileStream.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Get a single line by its line number
 * @param {number} lineNum - Line number (0-indexed)
 * @returns {Promise<Object|null>} - Parsed JSON object or null
 */
async function getLineByNumber(lineNum) {
  const results = await readLinesRange(lineNum, 1);
  return results[0] || null;
}

module.exports = {
  readLinesRange,
  getTotalLines,
  getLineByNumber
};