import type { TopicModule } from '../types';
import { Intro, PlanSection, SecuritySection, VerifySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet510 } from './CheatSheet';

export const T5_10: TopicModule = {
  id: '5.10',
  subtitle: 'WLAN în GUI cu WPA2-PSK: configurare, verificare, depanare',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.10' },
    { id: 'plan', label: 'Planificare și pași', code: '5.10' },
    { id: 'security', label: 'Securitate: WPA2, AES, PSK', code: '5.10' },
    { id: 'verify', label: 'Verificare și depanare', code: '5.10' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><PlanSection /><SecuritySection /><VerifySection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet510,
};
