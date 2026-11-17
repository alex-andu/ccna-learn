import type { TopicModule } from '../types';
import { Intro, MitigationSection, ThreatsSection, VocabSection, VulnSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet51 } from './CheatSheet';

export const T5_1: TopicModule = {
  id: '5.1',
  subtitle: 'Amenințări, vulnerabilități, exploit-uri și tehnici de mitigare',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.1' },
    { id: 'vocab', label: 'Vocabularul și CIA', code: '5.1' },
    { id: 'threats', label: 'Amenințări și atacuri', code: '5.1' },
    { id: 'vulns', label: 'Vulnerabilități și exploit-uri', code: '5.1' },
    { id: 'mitigation', label: 'Mitigare și apărare în adâncime', code: '5.1' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><VocabSection /><ThreatsSection /><VulnSection /><MitigationSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet51,
};
