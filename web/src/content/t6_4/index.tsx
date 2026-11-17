import type { TopicModule } from '../types';
import { Intro, BasicsSection, PredictiveSection, GenerativeSection, OpsSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet64 } from './CheatSheet';

export const T6_4: TopicModule = {
  id: '6.4',
  subtitle: 'AI generativ și predictiv, machine learning în operațiunile de rețea',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '6.4' },
    { id: 'basics', label: 'Bazele ML', code: '6.4' },
    { id: 'predictive', label: 'AI predictiv', code: '6.4' },
    { id: 'generative', label: 'AI generativ', code: '6.4' },
    { id: 'ops', label: 'AI în operațiuni', code: '6.4' },
    { id: 'config', label: 'Exemple practice' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><BasicsSection /><PredictiveSection /><GenerativeSection /><OpsSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet64,
};
