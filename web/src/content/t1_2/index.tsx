import type { TopicModule } from '../types';
import { Intro, ThreeTier, TwoTier, SpineLeaf, Wan, Soho, Cloud } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet12 } from './CheatSheet';

export const T1_2: TopicModule = {
  id: '1.2',
  subtitle: 'Arhitecturi de topologie — campus two-/three-tier, spine-leaf, WAN, SOHO, on-prem și cloud',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.2' },
    { id: 'three-tier', label: 'Three-tier', code: '1.2.b' },
    { id: 'two-tier', label: 'Two-tier (collapsed core)', code: '1.2.a' },
    { id: 'spine-leaf', label: 'Spine-leaf', code: '1.2.c' },
    { id: 'wan', label: 'WAN', code: '1.2.d' },
    { id: 'soho', label: 'SOHO', code: '1.2.e' },
    { id: 'cloud', label: 'On-premises și cloud', code: '1.2.f' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><ThreeTier /><TwoTier /><SpineLeaf /><Wan /><Soho /><Cloud /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet12,
};
