import type { TopicModule } from '../types';
import { Intro, RF, Channels, SSID, Encryption } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet111 } from './CheatSheet';

export const T1_11: TopicModule = {
  id: '1.11',
  subtitle: 'Principiile rețelelor wireless — RF, canale, SSID, criptare',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.11' },
    { id: 'rf', label: 'RF și standardele 802.11', code: '1.11.c' },
    { id: 'channels', label: 'Canale care nu se suprapun', code: '1.11.a' },
    { id: 'ssid', label: 'SSID, BSS, ESS', code: '1.11.b' },
    { id: 'encryption', label: 'Criptare WEP → WPA3', code: '1.11.d' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><RF /><Channels /><SSID /><Encryption /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet111,
};
