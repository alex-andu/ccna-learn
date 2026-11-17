import type { TopicModule } from '../types';
import { AttacksSection, EnterpriseSection, FamilySection, Intro, PersonalSection, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet59 } from './CheatSheet';

export const T5_9: TopicModule = {
  id: '5.9',
  subtitle: 'Securitate wireless: WPA, WPA2, WPA3; Personal vs Enterprise',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.9' },
    { id: 'why', label: 'De ce și istoric', code: '5.9' },
    { id: 'family', label: 'WPA, WPA2, WPA3', code: '5.9' },
    { id: 'personal', label: 'Personal: PSK vs SAE', code: '5.9' },
    { id: 'enterprise', label: 'Enterprise: 802.1X/EAP', code: '5.9' },
    { id: 'attacks', label: 'Atacuri și bune practici', code: '5.9' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><WhySection /><FamilySection /><PersonalSection /><EnterpriseSection /><AttacksSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet59,
};
