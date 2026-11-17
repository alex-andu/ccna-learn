import type { TopicModule } from '../types';
import { Intro, ProblemSection, HowSection, ImpactSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet61 } from './CheatSheet';

export const T6_1: TopicModule = {
  id: '6.1',
  subtitle: 'Cum schimbă automatizarea managementul rețelei',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '6.1' },
    { id: 'problem', label: 'Problema: managementul manual', code: '6.1' },
    { id: 'how', label: 'Cum funcționează automatizarea', code: '6.1' },
    { id: 'impact', label: 'Impact: beneficii și riscuri', code: '6.1' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><ProblemSection /><HowSection /><ImpactSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet61,
};
