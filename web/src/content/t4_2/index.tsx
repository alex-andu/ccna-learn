import type { TopicModule } from '../types';
import { Intro, ModesSection, StratumSection, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet42 } from './CheatSheet';

export const T4_2: TopicModule = {
  id: '4.2',
  subtitle: 'NTP în mod client și server: stratum, configurare și verificare',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.2' },
    { id: 'why', label: 'De ce contează ora', code: '4.2' },
    { id: 'stratum', label: 'Ierarhia de straturi', code: '4.2' },
    { id: 'modes', label: 'Moduri NTP și schimbul de mesaje', code: '4.2' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><WhySection /><StratumSection /><ModesSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet42,
};
