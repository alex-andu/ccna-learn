import type { TopicModule } from '../types';
import { FtpSection, Intro, IosSection, TftpSection, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet49 } from './CheatSheet';

export const T4_9: TopicModule = {
  id: '4.9',
  subtitle: 'TFTP și FTP: backup, restaurare și upgrade de IOS',
  studyTime: '≈3 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.9' },
    { id: 'why', label: 'De ce transferăm fișiere', code: '4.9' },
    { id: 'tftp', label: 'TFTP', code: '4.9' },
    { id: 'ftp', label: 'FTP: control și date', code: '4.9' },
    { id: 'ios', label: 'Comenzi pe IOS și upgrade', code: '4.9' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><WhySection /><TftpSection /><FtpSection /><IosSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet49,
};
