import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file location
const dbDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'seresdeluz.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    crmv TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL,
    patient_name TEXT,
    species TEXT,
    tutor_name TEXT,
    prescription_data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS drafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'dra.nilceia',
    draft_data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default user for Dra. Nilcéia Silva if not exists
const checkUser = db.prepare('SELECT id FROM users WHERE username = ?').get('dra.nilceia');
if (!checkUser) {
  const insertUser = db.prepare(`
    INSERT INTO users (username, password, name, crmv, phone)
    VALUES (?, ?, ?, ?, ?)
  `);
  // Default credentials: username 'dra.nilceia', password '16442' (also accepts 'seresdeluz')
  insertUser.run('dra.nilceia', '16442', 'Dra. Nilcéia Silva', 'CRMV-SC 16442', '(49) 99955-5421');
}

export default db;
