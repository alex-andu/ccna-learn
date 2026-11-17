import type { TopicModule } from '../types';
import { DestinationsSection, Intro, MessageSection, SeveritySection, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet45 } from './CheatSheet';

export const T4_5: TopicModule = {
  id: '4.5',
  subtitle: 'Syslog: format, facilities, niveluri de severitate și destinații',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.5' },
    { id: 'why', label: 'De ce syslog', code: '4.5' },
    { id: 'message', label: 'Anatomia unui mesaj', code: '4.5' },
    { id: 'severity', label: 'Nivelurile de severitate', code: '4.5' },
    { id: 'destinations', label: 'Destinații și facilities', code: '4.5' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><WhySection /><MessageSection /><SeveritySection /><DestinationsSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet45,
};
