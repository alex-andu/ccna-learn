import type { ComponentType } from 'react';

export type TocItem = { id: string; label: string; code?: string; sub?: boolean };

/** Tot ce are nevoie TopicPage ca să afișeze un topic. Un fișier `content/<tX_Y>/index.tsx` per topic. */
export type TopicModule = {
  id: string;
  /** subtitlu în română sub titlul oficial */
  subtitle: string;
  /** ex. „≈3–4 h studiu + laburi” */
  studyTime: string;
  /** câte laburi are (badge) */
  labs: number;
  /** TOC + calcul progres; trebuie să includă 'questions' și id-urile laburilor */
  sections: TocItem[];
  /** teorie + exemple de configurare (tot ce vine înainte de banca de întrebări) */
  Body: ComponentType;
  /** laburile (după banca de întrebări) */
  Labs: ComponentType;
  CheatSheet?: ComponentType;
};
