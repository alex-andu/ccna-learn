import type { TopicModule } from '../types';
import { Ad, Codes, DefaultRoute, Intro, Metric, NextHop, PrefixMask } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet31 } from './CheatSheet';

export const T3_1: TopicModule = {
  id: '3.1',
  subtitle: 'Citirea tabelei de rutare: cod, prefix, mască, next hop, AD, metrică și gateway of last resort',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '3.1' },
    { id: 'codes', label: 'Routing protocol code', code: '3.1.a' },
    { id: 'prefix', label: 'Prefix și network mask', code: '3.1.b/c' },
    { id: 'nexthop', label: 'Next hop', code: '3.1.d' },
    { id: 'ad', label: 'Administrative distance', code: '3.1.e' },
    { id: 'metric', label: 'Metric', code: '3.1.f' },
    { id: 'default', label: 'Gateway of last resort', code: '3.1.g' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Codes /><PrefixMask /><NextHop /><Ad /><Metric /><DefaultRoute /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet31,
};
