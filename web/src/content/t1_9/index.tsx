import type { TopicModule } from '../types';
import { Anycast, Eui64, GlobalUnicast, Intro, LinkLocal, Multicast, SolicitedNode, Ula } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet19 } from './CheatSheet';

export const T1_9: TopicModule = {
  id: '1.9',
  subtitle: 'Tipuri de adrese IPv6 — unicast (global, ULA, link-local), anycast, multicast, Modified EUI-64',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Harta tipurilor de adrese', code: '1.9' },
    { id: 'gua', label: 'Unicast global (GUA) și adrese speciale', code: '1.9.a' },
    { id: 'ula', label: 'Unique Local (ULA)', code: '1.9.a' },
    { id: 'linklocal', label: 'Link-local', code: '1.9.a' },
    { id: 'anycast', label: 'Anycast', code: '1.9.b' },
    { id: 'multicast', label: 'Multicast', code: '1.9.c' },
    { id: 'solicited', label: 'Solicited-node', code: '1.9.c' },
    { id: 'eui64', label: 'Modified EUI-64', code: '1.9.d' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><GlobalUnicast /><Ula /><LinkLocal /><Anycast /><Multicast /><SolicitedNode /><Eui64 /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet19,
};
