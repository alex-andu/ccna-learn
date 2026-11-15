import type { TopicModule } from '../types';
import { Intro, Layers, Negotiation, Verify } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet24 } from './CheatSheet';

export const T2_4: TopicModule = {
  id: '2.4',
  subtitle: 'EtherChannel (LACP) de nivel 2 și 3: negociere, configurare, load balancing, verificare',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.4' },
    { id: 'negotiation', label: 'LACP, PAgP, static', code: '2.4' },
    { id: 'layers', label: 'EtherChannel L2 și L3', code: '2.4' },
    { id: 'verify', label: 'Load balancing, verificare, depanare', code: '2.4' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Negotiation /><Layers /><Verify /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet24,
};
