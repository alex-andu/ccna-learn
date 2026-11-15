import type { TopicModule } from '../types';
import { Intro, Standards, Copper, Fiber, Connections, Choose } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet13 } from './CheatSheet';

export const T1_3: TopicModule = {
  id: '1.3',
  subtitle: 'Cupru, fibră monomod și multimod; mediu partajat vs punct-la-punct',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.3' },
    { id: 'standards', label: 'Evoluția standardelor Ethernet', code: '1.3.a' },
    { id: 'copper', label: 'Cupru: UTP/STP, pinout, cabluri', code: '1.3.a' },
    { id: 'fiber', label: 'Fibră: SMF vs MMF, conectori, SFP', code: '1.3.a' },
    { id: 'connections', label: 'Shared media vs point-to-point', code: '1.3.b' },
    { id: 'choose', label: 'Alege cablul potrivit', code: '1.3.a/b' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Standards /><Copper /><Fiber /><Connections /><Choose /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet13,
};
