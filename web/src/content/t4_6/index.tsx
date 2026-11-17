import type { TopicModule } from '../types';
import { ClientSection, HowSection, Intro, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet46 } from './CheatSheet';

export const T4_6: TopicModule = {
  id: '4.6',
  subtitle: 'DHCP client pe router și DHCP relay (ip helper-address)',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.6' },
    { id: 'client', label: 'Routerul ca client DHCP', code: '4.6' },
    { id: 'why', label: 'De ce avem nevoie de relay', code: '4.6' },
    { id: 'how', label: 'Cum funcționează relay-ul', code: '4.6' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><ClientSection /><WhySection /><HowSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet46,
};
