import type { TopicModule } from '../types';
import { AwarenessSection, Intro, PhysicalSection, ProgramSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet52 } from './CheatSheet';

export const T5_2: TopicModule = {
  id: '5.2',
  subtitle: 'Programul de securitate: conștientizare, instruire și controlul accesului fizic',
  studyTime: '≈2–3 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.2' },
    { id: 'program', label: 'Programul și politicile', code: '5.2' },
    { id: 'awareness', label: 'Awareness și training', code: '5.2' },
    { id: 'physical', label: 'Controlul accesului fizic', code: '5.2' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><ProgramSection /><AwarenessSection /><PhysicalSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet52,
};
