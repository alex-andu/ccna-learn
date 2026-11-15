import type { TopicModule } from '../types';
import { Aaa, CloudSec, Intro, Methods } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet28 } from './CheatSheet';

export const T2_8: TopicModule = {
  id: '2.8',
  subtitle: 'Acces de management: console, Telnet, SSH, HTTP/HTTPS, AAA (TACACS+/RADIUS) și cloud-managed',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.8' },
    { id: 'methods', label: 'Console, Telnet, SSH, HTTP, HTTPS', code: '2.8' },
    { id: 'aaa', label: 'AAA: TACACS+ și RADIUS', code: '2.8' },
    { id: 'cloud', label: 'Cloud-managed', code: '2.8' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Methods /><Aaa /><CloudSec /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet28,
};
