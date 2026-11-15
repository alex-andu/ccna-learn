import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb, TABLES } from './db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8080);
const HOST = process.env.HOST ?? '0.0.0.0';
const DATA_DIR = path.resolve(process.env.DATA_DIR ?? path.join(here, '../../data'));
const WEB_DIST = path.resolve(process.env.WEB_DIST ?? path.join(here, '../../web/dist'));

const db = openDb(DATA_DIR);
const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'warn' }, bodyLimit: 20 * 1024 * 1024 });
const now = () => new Date().toISOString();
const isDay = (d: unknown): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);

// ---------- health ----------
app.get('/api/health', async () => ({ ok: true, time: now() }));

// ---------- progres pe topic/secțiune ----------
app.get('/api/progress', async () =>
  db.prepare('SELECT topic_id AS topicId, section, done_at AS doneAt FROM topic_progress').all());

app.post<{ Body: { topicId: string; section: string; done: boolean } }>('/api/progress', async (req) => {
  const { topicId, section, done } = req.body;
  if (done) {
    db.prepare('INSERT OR REPLACE INTO topic_progress (topic_id, section, done_at) VALUES (?, ?, ?)').run(topicId, section, now());
  } else {
    db.prepare('DELETE FROM topic_progress WHERE topic_id = ? AND section = ?').run(topicId, section);
  }
  return { ok: true };
});

// ---------- încercări la întrebări ----------
const bumpActivity = db.prepare(`
  INSERT INTO activity (day, questions, correct, minutes) VALUES (@day, @q, @c, @m)
  ON CONFLICT(day) DO UPDATE SET questions = questions + @q, correct = correct + @c, minutes = minutes + @m`);

app.post<{ Body: { questionId: string; topicId: string; mode: string; correct: boolean; answer?: unknown; day: string } }>(
  '/api/attempts', async (req, reply) => {
    const b = req.body;
    if (!isDay(b.day)) return reply.code(400).send({ error: 'day invalid' });
    db.prepare('INSERT INTO attempts (question_id, topic_id, mode, correct, answer, day, ts) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(b.questionId, b.topicId, b.mode, b.correct ? 1 : 0, JSON.stringify(b.answer ?? null), b.day, now());
    bumpActivity.run({ day: b.day, q: 1, c: b.correct ? 1 : 0, m: 0 });
    return { ok: true };
  });

// ---------- timp de studiu (ping din client la fiecare minut activ) ----------
app.post<{ Body: { day: string; minutes?: number } }>('/api/activity/ping', async (req, reply) => {
  if (!isDay(req.body.day)) return reply.code(400).send({ error: 'day invalid' });
  const m = Math.max(0, Math.min(5, Math.round(req.body.minutes ?? 1)));
  bumpActivity.run({ day: req.body.day, q: 0, c: 0, m });
  return { ok: true };
});

// ---------- statistici ----------
app.get<{ Querystring: { today?: string } }>('/api/stats', async (req) => {
  const today = isDay(req.query.today) ? req.query.today : new Date().toISOString().slice(0, 10);
  const totals = db.prepare('SELECT COUNT(*) AS total, COALESCE(SUM(correct),0) AS correct FROM attempts').get() as { total: number; correct: number };
  const perTopic = db.prepare(`SELECT topic_id AS topicId, COUNT(*) AS total, SUM(correct) AS correct FROM attempts GROUP BY topic_id`).all();
  const perQuestion = db.prepare(`
    SELECT question_id AS questionId, COUNT(*) AS total, SUM(correct) AS correct,
           (SELECT a2.correct FROM attempts a2 WHERE a2.question_id = a.question_id ORDER BY a2.id DESC LIMIT 1) AS lastCorrect
    FROM attempts a GROUP BY question_id`).all();
  const days = db.prepare('SELECT day, questions, correct, minutes FROM activity ORDER BY day DESC LIMIT 90').all() as
    { day: string; questions: number; correct: number; minutes: number }[];
  const exams = db.prepare('SELECT id, config, total, correct, duration_s AS durationS, ts FROM exam_sessions ORDER BY id DESC LIMIT 30').all()
    .map((e: any) => ({ ...e, config: JSON.parse(e.config) }));

  // streak: zile consecutive (până azi sau ieri) cu activitate
  const active = new Set(days.filter((d) => d.questions > 0 || d.minutes > 0).map((d) => d.day));
  const shift = (d: string, n: number) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  let cursor = active.has(today) ? today : shift(today, -1);
  let streak = 0;
  while (active.has(cursor)) { streak++; cursor = shift(cursor, -1); }
  let best = 0, run = 0, prev = '';
  for (const d of [...active].sort()) { run = prev && shift(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }

  return { totals, perTopic, perQuestion, days, exams, streak, bestStreak: best, today: days.find((d) => d.day === today) ?? null };
});

// ---------- sesiuni de simulare ----------
app.post<{ Body: { config: unknown; total: number; correct: number; durationS: number; details?: unknown } }>('/api/exams', async (req) => {
  const b = req.body;
  const r = db.prepare('INSERT INTO exam_sessions (config, total, correct, duration_s, details, ts) VALUES (?, ?, ?, ?, ?, ?)')
    .run(JSON.stringify(b.config ?? {}), b.total, b.correct, b.durationS, JSON.stringify(b.details ?? null), now());
  return { id: r.lastInsertRowid };
});

// ---------- spaced repetition (FSRS — algoritmul rulează în client, aici doar stocăm) ----------
app.get<{ Querystring: { kind?: string } }>('/api/srs/cards', async (req) => {
  const rows = (req.query.kind
    ? db.prepare('SELECT * FROM srs_cards WHERE kind = ?').all(req.query.kind)
    : db.prepare('SELECT * FROM srs_cards').all()) as any[];
  return rows.map((r) => ({ id: r.id, kind: r.kind, ref: r.ref, card: JSON.parse(r.card), due: r.due, updated: r.updated }));
});

app.put<{ Params: { id: string }; Body: { kind: string; ref: string; card: { due: string }; rating?: number } }>(
  '/api/srs/cards/:id', async (req) => {
    const { kind, ref, card, rating } = req.body;
    db.prepare(`INSERT INTO srs_cards (id, kind, ref, card, due, updated) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET card = excluded.card, due = excluded.due, updated = excluded.updated`)
      .run(req.params.id, kind, ref, JSON.stringify(card), String(card.due), now());
    if (typeof rating === 'number') db.prepare('INSERT INTO srs_log (card_id, rating, ts) VALUES (?, ?, ?)').run(req.params.id, rating, now());
    return { ok: true };
  });

app.delete<{ Params: { id: string } }>('/api/srs/cards/:id', async (req) => {
  db.prepare('DELETE FROM srs_cards WHERE id = ?').run(req.params.id);
  return { ok: true };
});

// ---------- notițe ----------
app.get('/api/notes', async () => db.prepare('SELECT topic_id AS topicId, body, updated FROM notes').all());
app.get<{ Params: { topicId: string } }>('/api/notes/:topicId', async (req) =>
  db.prepare('SELECT topic_id AS topicId, body, updated FROM notes WHERE topic_id = ?').get(req.params.topicId) ?? { topicId: req.params.topicId, body: '', updated: null });
app.put<{ Params: { topicId: string }; Body: { body: string } }>('/api/notes/:topicId', async (req) => {
  const body = String(req.body.body ?? '');
  if (body.trim() === '') db.prepare('DELETE FROM notes WHERE topic_id = ?').run(req.params.topicId);
  else db.prepare('INSERT OR REPLACE INTO notes (topic_id, body, updated) VALUES (?, ?, ?)').run(req.params.topicId, body, now());
  return { ok: true };
});

// ---------- bookmark-uri ----------
app.get('/api/bookmarks', async () => db.prepare('SELECT topic_id AS topicId, created FROM bookmarks ORDER BY created DESC').all());
app.put<{ Params: { topicId: string } }>('/api/bookmarks/:topicId', async (req) => {
  db.prepare('INSERT OR IGNORE INTO bookmarks (topic_id, created) VALUES (?, ?)').run(req.params.topicId, now());
  return { ok: true };
});
app.delete<{ Params: { topicId: string } }>('/api/bookmarks/:topicId', async (req) => {
  db.prepare('DELETE FROM bookmarks WHERE topic_id = ?').run(req.params.topicId);
  return { ok: true };
});

// ---------- setări ----------
app.get('/api/settings', async () => {
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value)]));
});
app.put<{ Body: Record<string, unknown> }>('/api/settings', async (req) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  db.transaction(() => { for (const [k, v] of Object.entries(req.body ?? {})) stmt.run(k, JSON.stringify(v)); })();
  return { ok: true };
});

// ---------- export / import (backup manual în JSON) ----------
app.get('/api/export', async (_req, reply) => {
  const dump: Record<string, unknown[]> = {};
  for (const t of TABLES) dump[t] = db.prepare(`SELECT * FROM ${t}`).all();
  reply.header('Content-Disposition', `attachment; filename="ccna-learn-backup-${now().slice(0, 10)}.json"`);
  return { app: 'ccna-learn', version: 1, exportedAt: now(), tables: dump };
});

app.post<{ Body: { app?: string; tables?: Record<string, Record<string, unknown>[]> } }>('/api/import', async (req, reply) => {
  const { app: appName, tables } = req.body ?? {};
  if (appName !== 'ccna-learn' || !tables) return reply.code(400).send({ error: 'Fișier de backup invalid' });
  db.transaction(() => {
    for (const t of TABLES) {
      const rows = tables[t];
      if (!Array.isArray(rows)) continue;
      db.prepare(`DELETE FROM ${t}`).run();
      for (const row of rows) {
        const cols = Object.keys(row).filter((c) => /^[a-z_]+$/.test(c));
        if (!cols.length) continue;
        db.prepare(`INSERT INTO ${t} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`).run(...cols.map((c) => row[c] as any));
      }
    }
  })();
  return { ok: true };
});

// ---------- frontend static (SPA) ----------
if (fs.existsSync(WEB_DIST)) {
  await app.register(fastifyStatic, {
    root: WEB_DIST,
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  });
  app.setNotFoundHandler((req, reply) => {
    if (req.url.startsWith('/api/')) return reply.code(404).send({ error: 'Not found' });
    return reply.sendFile('index.html');
  });
} else {
  app.log.warn(`WEB_DIST inexistent (${WEB_DIST}) — rulează "npm run build -w web"`);
}

const shutdown = async () => { await app.close(); db.close(); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await app.listen({ port: PORT, host: HOST });
console.log(`CCNA Learn rulează pe http://${HOST}:${PORT}  (date: ${DATA_DIR})`);
