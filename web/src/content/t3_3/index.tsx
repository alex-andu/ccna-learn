import type { TopicModule } from '../types';
import { DefaultSection, FloatingSection, HostSection, Intro, Ipv6Section, NetworkSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet33 } from './CheatSheet';

export const T3_3: TopicModule = {
  id: '3.3',
  subtitle: 'Rute statice IPv4 și IPv6: implicită, de rețea, de gazdă și flotantă',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '3.3' },
    { id: 'default', label: 'Default route', code: '3.3.a' },
    { id: 'network', label: 'Network route', code: '3.3.b' },
    { id: 'host', label: 'Host route', code: '3.3.c' },
    { id: 'floating', label: 'Floating static', code: '3.3.d' },
    { id: 'ipv6', label: 'Particularități IPv6', code: '3.3' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><DefaultSection /><NetworkSection /><HostSection /><FloatingSection /><Ipv6Section /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet33,
};
