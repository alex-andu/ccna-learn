import type { TopicModule } from '../types';
import { AccessPorts, DefaultVlan, InterVlan, Intro } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet21 } from './CheatSheet';

export const T2_1: TopicModule = {
  id: '2.1',
  subtitle: 'VLAN-uri (normal range) pe mai multe switch-uri: porturi access, default VLAN, inter-VLAN routing',
  studyTime: '≈5–6 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.1' },
    { id: 'access', label: 'Access ports (data and voice)', code: '2.1.a' },
    { id: 'default', label: 'Default VLAN', code: '2.1.b' },
    { id: 'intervlan', label: 'InterVLAN connectivity', code: '2.1.c' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><AccessPorts /><DefaultVlan /><InterVlan /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet21,
};
