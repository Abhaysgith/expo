import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { schema } from './schema';

const DATA_DIR = process.env.DB_DIR || path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'expo.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    runMigrations(_db);
  }
  return _db;
}

function runMigrations(db: Database.Database) {
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    db.exec(stmt + ';');
  }

  // Additive column migrations — safe to run on existing databases
  const alterations = [
    `ALTER TABLE leads ADD COLUMN preferred_location TEXT`,
  ];
  for (const stmt of alterations) {
    try { db.exec(stmt + ';'); } catch { /* column already exists — ignore */ }
  }
}
