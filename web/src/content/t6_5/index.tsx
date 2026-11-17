import type { TopicModule } from '../types';
import { Intro, RestSection, HttpSection, AuthSection, EncodingSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet65 } from './CheatSheet';

export const T6_5: TopicModule = {
  id: '6.5',
  subtitle: 'API-uri REST: HTTP, CRUD, autentificare, codificarea datelor',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '6.5' },
    { id: 'rest', label: 'Ce este REST', code: '6.5' },
    { id: 'http', label: 'HTTP și CRUD', code: '6.5' },
    { id: 'auth', label: 'Autentificare', code: '6.5' },
    { id: 'encoding', label: 'Codificarea datelor', code: '6.5' },
    { id: 'config', label: 'Exemple practice' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><RestSection /><HttpSection /><AuthSection /><EncodingSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet65,
};
