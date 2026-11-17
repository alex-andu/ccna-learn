import type { TopicModule } from '../types';
import { Compare, Intro, Linux, MacOS, Troubleshoot, Windows } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, RealLab, SoloLab } from './Labs';
import { CheatSheet110 } from './CheatSheet';

export const T1_10: TopicModule = {
  id: '1.10',
  subtitle: 'Verificarea parametrilor IP pe clienți — Windows, macOS, Linux',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 3,
  sections: [
    { id: 'intro', label: 'Parametrii unui host', code: '1.10' },
    { id: 'windows', label: 'Windows', code: '1.10' },
    { id: 'macos', label: 'macOS', code: '1.10' },
    { id: 'linux', label: 'Linux', code: '1.10' },
    { id: 'compare', label: 'Comparație între sisteme', code: '1.10' },
    { id: 'troubleshoot', label: 'Depanare metodică', code: '1.10' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
    { id: 'lab-real', label: 'Lab pe calculatoarele tale' },
  ],
  Body: () => (<><Intro /><Windows /><MacOS /><Linux /><Compare /><Troubleshoot /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /><RealLab /></>),
  CheatSheet: CheatSheet110,
};
