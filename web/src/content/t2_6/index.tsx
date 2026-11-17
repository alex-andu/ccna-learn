import type { TopicModule } from '../types';
import { Arch, Capwap, Intro, Modes } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet26 } from './CheatSheet';

export const T2_6: TopicModule = {
  id: '2.6',
  subtitle: 'Arhitecturi wireless Cisco (autonomous, lightweight+WLC, cloud, embedded), CAPWAP și modurile AP',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.6' },
    { id: 'arch', label: 'Arhitecturi', code: '2.6' },
    { id: 'capwap', label: 'CAPWAP și split-MAC', code: '2.6' },
    { id: 'modes', label: 'Moduri AP', code: '2.6' },
    { id: 'config', label: 'Exemple' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Arch /><Capwap /><Modes /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet26,
};
