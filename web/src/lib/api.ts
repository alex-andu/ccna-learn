import { localDay } from './day';

async function req<T>(method: string, url: string, body?: unknown): Promise<T> {
  const r = await fetch(url, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`${method} ${url} → ${r.status}`);
  return r.json() as Promise<T>;
}

export type Stats = {
  totals: { total: number; correct: number };
  perTopic: { topicId: string; total: number; correct: number }[];
  perQuestion: { questionId: string; total: number; correct: number; lastCorrect: number }[];
  days: { day: string; questions: number; correct: number; minutes: number }[];
  exams: { id: number; config: any; total: number; correct: number; durationS: number; ts: string }[];
  streak: number;
  bestStreak: number;
  today: { day: string; questions: number; correct: number; minutes: number } | null;
};

export type SrsRow = { id: string; kind: string; ref: string; card: any; due: string; updated: string };

export const api = {
  progress: () => req<{ topicId: string; section: string; doneAt: string }[]>('GET', '/api/progress'),
  setProgress: (topicId: string, section: string, done: boolean) => req('POST', '/api/progress', { topicId, section, done }),
  attempt: (a: { questionId: string; topicId: string; mode: string; correct: boolean; answer?: unknown }) =>
    req('POST', '/api/attempts', { ...a, day: localDay() }),
  ping: () => req('POST', '/api/activity/ping', { day: localDay(), minutes: 1 }),
  stats: () => req<Stats>('GET', `/api/stats?today=${localDay()}`),
  saveExam: (e: { config: unknown; total: number; correct: number; durationS: number; details?: unknown }) => req('POST', '/api/exams', e),
  srsCards: (kind?: string) => req<SrsRow[]>('GET', `/api/srs/cards${kind ? `?kind=${kind}` : ''}`),
  putSrs: (id: string, row: { kind: string; ref: string; card: unknown; rating?: number }) => req('PUT', `/api/srs/cards/${encodeURIComponent(id)}`, row),
  note: (topicId: string) => req<{ topicId: string; body: string; updated: string | null }>('GET', `/api/notes/${encodeURIComponent(topicId)}`),
  notes: () => req<{ topicId: string; body: string; updated: string }[]>('GET', '/api/notes'),
  saveNote: (topicId: string, body: string) => req('PUT', `/api/notes/${encodeURIComponent(topicId)}`, { body }),
  bookmarks: () => req<{ topicId: string; created: string }[]>('GET', '/api/bookmarks'),
  bookmark: (topicId: string, on: boolean) => req(on ? 'PUT' : 'DELETE', `/api/bookmarks/${encodeURIComponent(topicId)}`),
  settings: () => req<Record<string, any>>('GET', '/api/settings'),
  saveSettings: (s: Record<string, unknown>) => req('PUT', '/api/settings', s),
  importBackup: (data: unknown) => req('POST', '/api/import', data),
};
