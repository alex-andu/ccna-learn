// Backup consistent al bazei SQLite (folosește API-ul de backup, sigur și cu aplicația pornită).
// Rulare: npm run backup -w server   (sau din systemd timer)
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(process.env.DATA_DIR ?? path.join(here, '../../data'));
const KEEP = Number(process.env.BACKUP_KEEP ?? 14);
const dir = path.join(DATA_DIR, 'backups');
fs.mkdirSync(dir, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'ccna.db'), { readonly: true });
const file = path.join(dir, `ccna-${new Date().toISOString().replace(/[:.]/g, '-')}.db`);
await db.backup(file);
db.close();
console.log('Backup salvat:', file);

const old = fs.readdirSync(dir).filter((f) => f.endsWith('.db')).sort().reverse().slice(KEEP);
for (const f of old) fs.unlinkSync(path.join(dir, f));
