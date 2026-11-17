import type { TopicModule } from '../types';
import { ApConn, Intro, TrunkLag, WlcSec } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet27 } from './CheatSheet';

export const T2_7: TopicModule = {
  id: '2.7',
  subtitle: 'Conexiuni fizice WLAN: AP, WLC, porturi access/trunk, service port și LAG',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.7' },
    { id: 'ap', label: 'Conectarea AP-urilor', code: '2.7' },
    { id: 'wlc', label: 'Porturile și interfețele WLC', code: '2.7' },
    { id: 'trunklag', label: 'Trunk și LAG', code: '2.7' },
    { id: 'config', label: 'Exemple' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><ApConn /><WlcSec /><TrunkLag /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet27,
};
