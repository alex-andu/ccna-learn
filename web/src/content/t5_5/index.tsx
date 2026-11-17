import type { TopicModule } from '../types';
import { ComponentsSection, FlowSection, Intro, ModesSection, RelatedSection, RemoteSection, TypesSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet55 } from './CheatSheet';

export const T5_5: TopicModule = {
  id: '5.5',
  subtitle: 'VPN-uri IPsec: site-to-site și remote access',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.5' },
    { id: 'types', label: 'De ce VPN și tipurile', code: '5.5' },
    { id: 'components', label: 'Componentele IPsec', code: '5.5' },
    { id: 'flow', label: 'Negocierea pas cu pas', code: '5.5' },
    { id: 'modes', label: 'Moduri, ESP/AH, NAT-T', code: '5.5' },
    { id: 'remote', label: 'Remote access', code: '5.5' },
    { id: 'related', label: 'GRE, VTI, DMVPN', code: '5.5' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><TypesSection /><ComponentsSection /><FlowSection /><ModesSection /><RemoteSection /><RelatedSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet55,
};
