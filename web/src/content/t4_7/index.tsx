import type { TopicModule } from '../types';
import { Intro, MarkingSection, PipelineSection, PolicingSection, QueuingSection, WhySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet47 } from './CheatSheet';

export const T4_7: TopicModule = {
  id: '4.7',
  subtitle: 'QoS: PHB, clasificare, marcare, cozi, congestie, policing și shaping',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '4.7' },
    { id: 'why', label: 'De ce avem nevoie de QoS', code: '4.7' },
    { id: 'marking', label: 'Clasificare și marcare', code: '4.7' },
    { id: 'queuing', label: 'Cozi și evitarea congestiei', code: '4.7' },
    { id: 'policing', label: 'Policing vs shaping', code: '4.7' },
    { id: 'pipeline', label: 'Imaginea completă', code: '4.7' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><WhySection /><MarkingSection /><QueuingSection /><PolicingSection /><PipelineSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet47,
};
