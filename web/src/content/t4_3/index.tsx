import type { TopicModule } from '../types';
import { DhcpDetailsSection, DhcpRoleSection, DnsDetailsSection, DnsRoleSection, Intro } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet43 } from './CheatSheet';

export const T4_3: TopicModule = {
  id: '4.3',
  subtitle: 'Rolul DHCP și DNS: DORA, lease, rezoluția numelor, înregistrări',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.3' },
    { id: 'dhcp-role', label: 'Rolul DHCP (DORA)', code: '4.3' },
    { id: 'dhcp-details', label: 'DHCP în detaliu', code: '4.3' },
    { id: 'dns-role', label: 'Rolul DNS', code: '4.3' },
    { id: 'dns-details', label: 'DNS în detaliu', code: '4.3' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><DhcpRoleSection /><DhcpDetailsSection /><DnsRoleSection /><DnsDetailsSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet43,
};
