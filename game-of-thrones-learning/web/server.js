const express = require('express');
const path = require('path');
const { readLinesRange, getTotalLines, getLineByNumber } = require('./utils/jsonl-reader');
const { lookupWord } = require('./utils/dictionary');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});