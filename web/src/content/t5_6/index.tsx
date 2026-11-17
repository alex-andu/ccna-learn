import type { TopicModule } from '../types';
import { HowSection, Intro, PlacementSection, TroubleSection, TypesSection, WildcardSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet56 } from './CheatSheet';

export const T5_6: TopicModule = {
  id: '5.6',
  subtitle: 'Liste de control al accesului (ACL): standard, extended, named',
  studyTime: '≈5–6 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.6' },
    { id: 'how', label: 'Cum funcționează un ACL', code: '5.6' },
    { id: 'wildcard', label: 'Wildcard mask', code: '5.6' },
    { id: 'types', label: 'Standard, extended, named', code: '5.6' },
    { id: 'placement', label: 'Plasare, interfață, VTY', code: '5.6' },
    { id: 'trouble', label: 'Verificare și depanare', code: '5.6' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><HowSection /><WildcardSection /><TypesSection /><PlacementSection /><TroubleSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet56,
};
