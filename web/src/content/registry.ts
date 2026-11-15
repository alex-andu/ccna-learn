import type { TocItem, TopicModule } from './types';
import { T1_11 } from './t1_11';

export type { TocItem, TopicModule };

/** Toate topicurile cu conținut. Ca să adaugi unul: creează content/<tX_Y>/index.tsx și pune-l aici. */
export const TOPICS: TopicModule[] = [T1_11];

export const TOPIC_MODULES: Record<string, TopicModule> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** Secțiunile fiecărui topic disponibil — folosite pentru TOC și pentru calculul progresului. */
export const TOPIC_SECTIONS: Record<string, TocItem[]> = Object.fromEntries(TOPICS.map((t) => [t.id, t.sections]));

export const topicProgress = (topicId: string, done: Set<string> | undefined) => {
  const s = TOPIC_SECTIONS[topicId];
  if (!s) return 0;
  return s.filter((x) => done?.has(x.id)).length / s.length;
};
