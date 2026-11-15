import type { TopicModule } from '../types';
import { Intro, States, Counters, Collisions, Duplex, Speed, Cable, Flow } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet14 } from './CheatSheet';

export const T1_4: TopicModule = {
  id: '1.4',
  subtitle: 'Probleme de interfață și cablu — stări, contoare de erori, coliziuni, duplex și speed mismatch',
  studyTime: '≈3 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.4' },
    { id: 'states', label: 'Stările interfeței', code: '1.4' },
    { id: 'counters', label: 'Contoarele (errors)', code: '1.4' },
    { id: 'collisions', label: 'Coliziuni', code: '1.4' },
    { id: 'duplex', label: 'Duplex mismatch', code: '1.4' },
    { id: 'speed', label: 'Speed mismatch', code: '1.4' },
    { id: 'cable', label: 'Defecte de cablu', code: '1.4' },
    { id: 'flow', label: 'Flowchart troubleshooting', code: '1.4' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><States /><Counters /><Collisions /><Duplex /><Speed /><Cable /><Flow /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet14,
};
