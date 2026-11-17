import type { TopicModule } from '../types';
import { Intro, PatSection, PoolSection, StaticSection, TermsSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet41 } from './CheatSheet';

export const T4_1: TopicModule = {
  id: '4.1',
  subtitle: 'Inside source NAT: static, pool și PAT (overload)',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.1' },
    { id: 'terms', label: 'Inside/outside, local/global', code: '4.1' },
    { id: 'static', label: 'Static NAT', code: '4.1' },
    { id: 'pool', label: 'Dynamic NAT cu pool', code: '4.1' },
    { id: 'pat', label: 'PAT (overload)', code: '4.1' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><TermsSection /><StaticSection /><PoolSection /><PatSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet41,
};
