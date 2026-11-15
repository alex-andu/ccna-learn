import { GLOSSARY } from './glossary';
import { AVAILABLE } from './curriculum';

export type Flashcard = { id: string; topicId: string; front: string; back: string; detail?: string; kind: 'term' | 'fact' };
export type Fact = Omit<Flashcard, 'kind'>;

// Fapte per topic: data/facts/<tX_Y>.ts exportă `FACTS`.
const facts = import.meta.glob('./facts/*.ts', { eager: true, import: 'FACTS' }) as Record<string, Fact[]>;
const factFiles = Object.keys(facts).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// Un termen de glosar devine un singur card, atașat primului topic disponibil din lista lui.
const termCards: Flashcard[] = GLOSSARY.flatMap((g) => {
  const t = g.topics?.find((x) => AVAILABLE.has(x));
  return t ? [{ id: `g-${g.id}`, topicId: t, kind: 'term' as const, front: g.abbr, back: [g.full, g.ro].filter(Boolean).join(' — '), detail: g.what }] : [];
});

export const FLASHCARDS: Flashcard[] = [
  ...factFiles.flatMap((k) => facts[k].map((f) => ({ ...f, kind: 'fact' as const }))),
  ...termCards,
];
