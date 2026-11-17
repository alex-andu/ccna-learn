import type { TopicModule } from '../types';
import { AdjacencySection, DrBdrSection, Intro, PointToPointSection, RouterIdSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet34 } from './CheatSheet';

export const T3_4: TopicModule = {
  id: '3.4',
  subtitle: 'OSPFv2 cu o singură zonă: vecini, point-to-point, DR/BDR și Router ID',
  studyTime: '≈5–6 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '3.4' },
    { id: 'adjacency', label: 'Vecini și adiacențe', code: '3.4.a' },
    { id: 'p2p', label: 'Point-to-point', code: '3.4.b' },
    { id: 'broadcast', label: 'Broadcast și DR/BDR', code: '3.4.c' },
    { id: 'rid', label: 'Router ID', code: '3.4.d' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><AdjacencySection /><PointToPointSection /><DrBdrSection /><RouterIdSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet34,
};
