import type { Question } from '../../lib/types';

// Fiecare topic are fișierul lui (t1_11.ts, t1_1.ts…) care exportă un array de întrebări.
const mods = import.meta.glob('./t*.ts', { eager: true }) as Record<string, Record<string, unknown>>;
const byTopicFile = Object.keys(mods).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

export const QUESTIONS: Question[] = byTopicFile.flatMap((k) =>
  Object.values(mods[k]).filter(Array.isArray).flat() as Question[],
);
export const questionById = new Map(QUESTIONS.map((q) => [q.id, q]));
export const questionsForTopic = (topicId: string) => QUESTIONS.filter((q) => q.topicId === topicId);
