import type { TopicModule } from '../types';
import { AdSection, Forwarding, Intro, Lpm, MetricSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet32 } from './CheatSheet';

export const T3_2: TopicModule = {
  id: '3.2',
  subtitle: 'Decizia de transmitere: longest prefix match, administrative distance și metrică',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '3.2' },
    { id: 'lpm', label: 'Longest prefix match', code: '3.2.a' },
    { id: 'ad', label: 'Administrative distance', code: '3.2.b' },
    { id: 'metric', label: 'Routing protocol metric', code: '3.2.c' },
    { id: 'forward', label: 'După decizie: transmiterea', code: '3.2' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Lpm /><AdSection /><MetricSection /><Forwarding /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet32,
};
