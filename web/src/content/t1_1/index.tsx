import type { TopicModule } from '../types';
import { AccessPoints, Controllers, Endpoints, Firewalls, Intro, Poe, Routers, Servers, Switches } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet11 } from './CheatSheet';

export const T1_1: TopicModule = {
  id: '1.1',
  subtitle: 'Rolul componentelor de rețea — router, switch, firewall, AP, controller, endpoint, server, PoE',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Ce este o rețea · OSI pe scurt', code: '1.1' },
    { id: 'endpoints', label: 'Endpoints', code: '1.1.f' },
    { id: 'servers', label: 'Servers', code: '1.1.g' },
    { id: 'switches', label: 'Switch-uri L2 și L3', code: '1.1.b' },
    { id: 'routers', label: 'Routere', code: '1.1.a' },
    { id: 'firewalls', label: 'NGFW și IPS', code: '1.1.c' },
    { id: 'ap', label: 'Access points', code: '1.1.d' },
    { id: 'controllers', label: 'Controllere (WLC, Catalyst Center)', code: '1.1.e' },
    { id: 'poe', label: 'PoE', code: '1.1.h' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Endpoints /><Servers /><Switches /><Routers /><Firewalls /><AccessPoints /><Controllers /><Poe /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet11,
};
