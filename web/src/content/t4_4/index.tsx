import type { TopicModule } from '../types';
import { ArchitectureSection, Intro, OperationsSection, VersionsSection, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet44 } from './CheatSheet';

export const T4_4: TopicModule = {
  id: '4.4',
  subtitle: 'Funcția SNMP în operarea rețelei: manager, agent, MIB, traps și versiuni',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.4' },
    { id: 'why', label: 'De ce SNMP', code: '4.4' },
    { id: 'architecture', label: 'Manager, agent, MIB, OID', code: '4.4' },
    { id: 'operations', label: 'Operațiile SNMP', code: '4.4' },
    { id: 'versions', label: 'Versiuni și securitate', code: '4.4' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><WhySection /><ArchitectureSection /><OperationsSection /><VersionsSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet44,
};
