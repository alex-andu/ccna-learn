import type { TopicModule } from '../types';
import { HardeningSection, HowSection, Intro, RequirementsSection, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet48 } from './CheatSheet';

export const T4_8: TopicModule = {
  id: '4.8',
  subtitle: 'Acces de la distanță cu SSH: chei RSA, VTY, utilizatori și întărire',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.8' },
    { id: 'why', label: 'De ce SSH și nu Telnet', code: '4.8' },
    { id: 'how', label: 'Cum se stabilește o sesiune', code: '4.8' },
    { id: 'requirements', label: 'Cerințe și pași de configurare', code: '4.8' },
    { id: 'hardening', label: 'Întărirea accesului', code: '4.8' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><WhySection /><HowSection /><RequirementsSection /><HardeningSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet48,
};
