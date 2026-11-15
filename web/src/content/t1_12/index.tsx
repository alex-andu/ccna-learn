import type { TopicModule } from '../types';
import { Compare, Containers, Intro, Server, Vrf } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, RealLab, SoloLab } from './Labs';
import { CheatSheet112 } from './CheatSheet';

export const T1_12: TopicModule = {
  id: '1.12',
  subtitle: 'Virtualizare: servere (hypervisor, VM), containere și VRF',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 3,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.12' },
    { id: 'server', label: 'Virtualizarea serverelor', code: '1.12' },
    { id: 'containers', label: 'Containere', code: '1.12' },
    { id: 'vrf', label: 'VRF', code: '1.12' },
    { id: 'compare', label: 'Comparație', code: '1.12' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
    { id: 'lab-real', label: 'Lab pe calculatoarele tale' },
  ],
  Body: () => (<><Intro /><Server /><Containers /><Vrf /><Compare /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /><RealLab /></>),
  CheatSheet: CheatSheet112,
};
