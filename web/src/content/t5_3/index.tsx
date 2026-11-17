import type { TopicModule } from '../types';
import { EnableSection, HardeningSection, Intro, LayersSection, LinePasswordSection, UsersSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet53 } from './CheatSheet';

export const T5_3: TopicModule = {
  id: '5.3',
  subtitle: 'Controlul accesului la dispozitiv cu parole locale: console, VTY, enable, utilizatori',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.3' },
    { id: 'layers', label: 'Căile de acces', code: '5.3' },
    { id: 'linepw', label: 'Parole pe linii și login', code: '5.3' },
    { id: 'enable', label: 'enable secret și tipuri de parole', code: '5.3' },
    { id: 'users', label: 'Utilizatori locali', code: '5.3' },
    { id: 'hardening', label: 'Protecții', code: '5.3' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><LayersSection /><LinePasswordSection /><EnableSection /><UsersSection /><HardeningSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet53,
};
