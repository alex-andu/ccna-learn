import type { TocItem, TopicModule } from './types';
import { T1_1 } from './t1_1';
import { T1_2 } from './t1_2';
import { T1_3 } from './t1_3';
import { T1_4 } from './t1_4';
import { T1_5 } from './t1_5';
import { T1_6 } from './t1_6';
import { T1_7 } from './t1_7';
import { T1_8 } from './t1_8';
import { T1_9 } from './t1_9';
import { T1_10 } from './t1_10';
import { T1_11 } from './t1_11';
import { T1_12 } from './t1_12';
import { T1_13 } from './t1_13';
import { T2_1 } from './t2_1';
import { T2_2 } from './t2_2';
import { T2_3 } from './t2_3';
import { T2_4 } from './t2_4';
import { T2_5 } from './t2_5';
import { T2_6 } from './t2_6';
import { T2_7 } from './t2_7';
import { T2_8 } from './t2_8';
import { T2_9 } from './t2_9';

export type { TocItem, TopicModule };

/** Toate topicurile cu conținut. Ca să adaugi unul: creează content/<tX_Y>/index.tsx și pune-l aici. */
export const TOPICS: TopicModule[] = [T1_1, T1_2, T1_3, T1_4, T1_5, T1_6, T1_7, T1_8, T1_9, T1_10, T1_11, T1_12, T1_13, T2_1, T2_2, T2_3, T2_4, T2_5, T2_6, T2_7, T2_8, T2_9];

export const TOPIC_MODULES: Record<string, TopicModule> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** Secțiunile fiecărui topic disponibil — folosite pentru TOC și pentru calculul progresului. */
export const TOPIC_SECTIONS: Record<string, TocItem[]> = Object.fromEntries(TOPICS.map((t) => [t.id, t.sections]));

export const topicProgress = (topicId: string, done: Set<string> | undefined) => {
  const s = TOPIC_SECTIONS[topicId];
  if (!s) return 0;
  return s.filter((x) => done?.has(x.id)).length / s.length;
};
