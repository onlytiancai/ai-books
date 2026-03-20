# Game of Thrones Bilingual Reader - Web App

A bilingual (English-Chinese) reading application for Game of Thrones with vocabulary learning features.

## Tech Stack

- **Frontend**: Vue 3.5 + Vite + Tailwind CSS + Vue Router
- **Backend**: Express.js with better-sqlite3
- **Database**: SQLite (better-sqlite3 for app data, external SQLite for dictionary)

## Features

- **Bilingual Display**: Original English text with Chinese translation
- **Vocabulary Highlighting**: Key vocabulary words are highlighted
- **Dictionary Lookup**: Click any word to see definition, pronunciation, and usage
- **Text-to-Speech**: Audio pronunciation for words (US/UK English)
- **User Authentication**: Registration, login, session management
- **Admin Panel**: First registered user becomes admin, can manage other users
- **Word Favorites**: Save words to your favorites with phonetic, translation, and sentence context
- **Translation Toggle**: Show/hide all translations in favorites, or click individual words to reveal
- **Responsive Design**: Mobile-friendly layout
- **Notes**: Additional context and grammar notes

## Project Structure

```
webapp/
├── src/
│   ├── components/
│   │   ├── Reader.vue       # Main reading component
│   │   ├── WordPopup.vue    # Word dictionary popup
│   │   ├── AuthModal.vue    # Login/Register modal
│   │   ├── Favorites.vue    # User's favorite words
│   │   └── admin/
│   │       └── Users.vue    # Admin user management
│   ├── composables/
│   │   └── auth.js          # Authentication logic
│   ├── router/
│   │   └── index.js         # Vue Router configuration
│   ├── App.vue              # Root component
│   ├── main.js              # Application entry point
│   └── style.css            # Tailwind CSS imports
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (proxy to backend at localhost:3001)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Backend Setup

The backend server runs separately on port 3001. See the parent directory for backend setup instructions.

```bash
# From the web/ directory
cd ..
node server.js
```

## Default Admin Account

The first user to register becomes an admin. If you need to reset:

```bash
# In the web/ directory
node -e "
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'data', 'app.db'));
const hash = bcrypt.hashSync('admin123', 10);
db.prepare('UPDATE users SET password_hash = ? WHERE username = ?').run(hash, 'admin');
console.log('Password reset to: admin123');
db.close();
"
```

## Routes

- `/` - Main reader (default)
- `/favorites` - User's favorite words (requires authentication)
- `/admin/users` - User management (admin only)

## API Proxy

The Vite dev server proxies API requests to the backend:

```js
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

## License

MIT
