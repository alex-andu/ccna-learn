import type { TopicModule } from '../types';
import { Cgnat, History, Intro, Ipv6Answer, NatConcept, Rfc1918, SpecialRanges } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet17 } from './CheatSheet';

export const T1_7: TopicModule = {
  id: '1.7',
  subtitle: 'Adrese IPv4 private — RFC 1918, NAT/PAT, CGNAT și alte adrese speciale',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.7' },
    { id: 'history', label: 'De ce s-au terminat adresele', code: '1.7' },
    { id: 'rfc1918', label: 'RFC 1918 — cele trei blocuri', code: '1.7' },
    { id: 'nat', label: 'NAT și PAT (concept)', code: '1.7 → 4.1' },
    { id: 'cgnat', label: 'CGNAT și 100.64.0.0/10', code: '1.7' },
    { id: 'special', label: 'Privat vs. adrese speciale', code: '1.7 ↔ 1.6' },
    { id: 'ipv6', label: 'IPv6 — răspunsul pe termen lung', code: '1.7 → 1.8' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><History /><Rfc1918 /><NatConcept /><Cgnat /><SpecialRanges /><Ipv6Answer /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet17,
};
