import type { TopicModule } from '../types';
import { Cdp, Compare, Intro, Lldp } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet23 } from './CheatSheet';

export const T2_3: TopicModule = {
  id: '2.3',
  subtitle: 'Protocoale de descoperire de nivel 2: CDP și LLDP — configurare, verificare, securitate',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.3' },
    { id: 'cdp', label: 'CDP', code: '2.3' },
    { id: 'lldp', label: 'LLDP', code: '2.3' },
    { id: 'compare', label: 'CDP vs LLDP, securitate, depanare', code: '2.3' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Cdp /><Lldp /><Compare /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet23,
};
