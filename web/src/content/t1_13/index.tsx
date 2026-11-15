import type { TopicModule } from '../types';
import { Flooding, Intro, Learning, Switching, Table113 } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet113 } from './CheatSheet';

export const T1_13: TopicModule = {
  id: '1.13',
  subtitle: 'Switching: învățare MAC și aging, comutarea cadrelor, flooding, tabela MAC',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.13' },
    { id: 'learning', label: 'MAC learning and aging', code: '1.13.a' },
    { id: 'switching', label: 'Frame switching', code: '1.13.b' },
    { id: 'flooding', label: 'Frame flooding', code: '1.13.c' },
    { id: 'table', label: 'MAC address table', code: '1.13.d' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Learning /><Switching /><Flooding /><Table113 /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet113,
};
