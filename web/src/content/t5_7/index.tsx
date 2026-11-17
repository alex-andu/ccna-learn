import type { TopicModule } from '../types';
import { DaiSection, Intro, PortSecSection, SnoopingSection, TogetherSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet57 } from './CheatSheet';

export const T5_7: TopicModule = {
  id: '5.7',
  subtitle: 'Securitate Layer 2: port security, DHCP snooping, DAI',
  studyTime: '≈5–6 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.7' },
    { id: 'portsec', label: 'Port security', code: '5.7' },
    { id: 'snooping', label: 'DHCP snooping', code: '5.7' },
    { id: 'dai', label: 'Dynamic ARP Inspection', code: '5.7' },
    { id: 'together', label: 'Împreună și depanare', code: '5.7' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><PortSecSection /><SnoopingSection /><DaiSection /><TogetherSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet57,
};
