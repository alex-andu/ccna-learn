import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export type DB = Database.Database;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS topic_progress (
  topic_id TEXT NOT NULL,
  section  TEXT NOT NULL,
  done_at  TEXT NOT NULL,
  PRIMARY KEY (topic_id, section)
);
CREATE TABLE IF NOT EXISTS attempts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT NOT NULL,
  topic_id    TEXT NOT NULL,
  mode        TEXT NOT NULL,
  correct     INTEGER NOT NULL,
  answer      TEXT,
  day         TEXT NOT NULL,
  ts          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attempts_q ON attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_attempts_day ON attempts(day);
CREATE TABLE IF NOT EXISTS exam_sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  config     TEXT NOT NULL,
  total      INTEGER NOT NULL,
  correct    INTEGER NOT NULL,
  duration_s INTEGER NOT NULL,
  details    TEXT,
  ts         TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS srs_cards (
  id      TEXT PRIMARY KEY,
  kind    TEXT NOT NULL,
  ref     TEXT NOT NULL,
  card    TEXT NOT NULL,
  due     TEXT NOT NULL,
  updated TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_srs_due ON srs_cards(due);
CREATE TABLE IF NOT EXISTS srs_log (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT NOT NULL,
  rating  INTEGER NOT NULL,
  ts      TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notes (
  topic_id TEXT PRIMARY KEY,
  body     TEXT NOT NULL,
  updated  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookmarks (
  topic_id TEXT PRIMARY KEY,
  created  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS activity (
  day       TEXT PRIMARY KEY,
  questions INTEGER NOT NULL DEFAULT 0,
  correct   INTEGER NOT NULL DEFAULT 0,
  minutes   INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

export const TABLES = [
  'topic_progress', 'attempts', 'exam_sessions', 'srs_cards', 'srs_log',
  'notes', 'bookmarks', 'activity', 'settings',
] as const;

export function openDb(dataDir: string): DB {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(path.join(dataDir, 'ccna.db'));
  // WAL: citiri concurente + mai puține scrieri pe card/SSD; NORMAL e sigur în WAL.
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.exec(SCHEMA);
  return db;
}
