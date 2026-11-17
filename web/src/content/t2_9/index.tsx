import type { TopicModule } from '../types';
import { AdvancedSec, General, Intro, QosSec, SecuritySec } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet29 } from './CheatSheet';

export const T2_9: TopicModule = {
  id: '2.9',
  subtitle: 'Interfața grafică a WLC: crearea WLAN-ului, securitate, profiluri QoS și setări avansate',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.9' },
    { id: 'general', label: 'Crearea WLAN-ului (General)', code: '2.9' },
    { id: 'security', label: 'Securitate', code: '2.9' },
    { id: 'qos', label: 'Profiluri QoS', code: '2.9' },
    { id: 'advanced', label: 'Setări avansate', code: '2.9' },
    { id: 'config', label: 'Exemple' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><General /><SecuritySec /><QosSec /><AdvancedSec /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet29,
};
