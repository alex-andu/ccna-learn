import type { Question } from '../../lib/types';
import { Q_1_11 } from './t1_11';

export const QUESTIONS: Question[] = [...Q_1_11];
export const questionById = new Map(QUESTIONS.map((q) => [q.id, q]));
export const questionsForTopic = (topicId: string) => QUESTIONS.filter((q) => q.topicId === topicId);
