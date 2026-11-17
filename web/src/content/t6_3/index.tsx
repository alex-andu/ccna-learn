import type { TopicModule } from '../types';
import { Intro, PlanesSection, FabricSection, ApiSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet63 } from './CheatSheet';

export const T6_3: TopicModule = {
  id: '6.3',
  subtitle: 'Arhitectura SDN: overlay, underlay, fabric, planuri, API northbound/southbound',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '6.3' },
    { id: 'planes', label: 'Separarea control/data plane', code: '6.3.a' },
    { id: 'fabric', label: 'Underlay, overlay, fabric', code: '6.3' },
    { id: 'apis', label: 'API-uri northbound/southbound', code: '6.3.b' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><PlanesSection /><FabricSection /><ApiSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet63,
};
