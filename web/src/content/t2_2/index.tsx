import type { TopicModule } from '../types';
import { Dot1q, Intro, NativeVlan, TrunkPorts } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet22 } from './CheatSheet';

export const T2_2: TopicModule = {
  id: '2.2',
  subtitle: 'Conectivitate între switch-uri: trunk, DTP, allowed VLANs, 802.1Q, native VLAN',
  studyTime: '≈5–6 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.2' },
    { id: 'trunk', label: 'Trunk ports', code: '2.2.a' },
    { id: 'dot1q', label: '802.1Q', code: '2.2.b' },
    { id: 'native', label: 'Native VLAN', code: '2.2.c' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><TrunkPorts /><Dot1q /><NativeVlan /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet22,
};
