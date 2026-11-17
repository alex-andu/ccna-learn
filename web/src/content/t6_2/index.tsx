import type { TopicModule } from '../types';
import { Intro, TraditionalSection, ControllerSection, CompareSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet62 } from './CheatSheet';

export const T6_2: TopicModule = {
  id: '6.2',
  subtitle: 'Rețele tradiționale vs rețele bazate pe controller',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '6.2' },
    { id: 'trad', label: 'Rețeaua tradițională', code: '6.2' },
    { id: 'ctrl', label: 'Rețeaua bazată pe controller', code: '6.2' },
    { id: 'compare', label: 'Comparația completă', code: '6.2' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><TraditionalSection /><ControllerSection /><CompareSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet62,
};
