import type { TopicModule } from '../types';
import { Header, HostConfig, Intro, Notation, Prefix, Subnetting, Why } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet18 } from './CheatSheet';

export const T1_8: TopicModule = {
  id: '1.8',
  subtitle: 'Configurarea și verificarea adresării IPv6 — notație, prefix, subnetting, SLAAC, comenzi IOS',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.8' },
    { id: 'why', label: 'De ce IPv6', code: '1.8' },
    { id: 'header', label: 'Antetul IPv6', code: '1.8' },
    { id: 'notation', label: 'Notația și abrevierea', code: '1.8' },
    { id: 'prefix', label: 'Prefixul și Interface ID', code: '1.8' },
    { id: 'subnetting', label: 'Alocare și subnetting', code: '1.8' },
    { id: 'hosts', label: 'Static, SLAAC, DHCPv6', code: '1.8' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Why /><Header /><Notation /><Prefix /><Subnetting /><HostConfig /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet18,
};
