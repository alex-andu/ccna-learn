import type { TopicModule } from '../types';
import { ConceptsSection, HsrpSection, Intro, ProtocolsSection, PurposeSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet35 } from './CheatSheet';

export const T3_5: TopicModule = {
  id: '3.5',
  subtitle: 'First hop redundancy: scop, concepte, HSRP / VRRP / GLBP',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '3.5' },
    { id: 'purpose', label: 'De ce avem nevoie de FHRP' },
    { id: 'concepts', label: 'Conceptele FHRP' },
    { id: 'protocols', label: 'HSRP, VRRP, GLBP' },
    { id: 'hsrp', label: 'HSRP în detaliu' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><PurposeSection /><ConceptsSection /><ProtocolsSection /><HsrpSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet35,
};
