import type { TopicModule } from '../types';
import { GuardsSec, Intro, PortFast, RolesStates, RootBridge } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet25 } from './CheatSheet';

export const T2_5: TopicModule = {
  id: '2.5',
  subtitle: 'Rapid PVST+: root bridge, roluri și stări, PortFast, BPDU Guard, Root/Loop Guard, BPDU Filter',
  studyTime: '≈6–8 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '2.5' },
    { id: 'root', label: 'Root bridge, root port, primary/secondary', code: '2.5.a' },
    { id: 'roles', label: 'Roluri și stări', code: '2.5.b' },
    { id: 'portfast', label: 'PortFast', code: '2.5.c' },
    { id: 'guards', label: 'Root guard, loop guard, BPDU filter, BPDU guard', code: '2.5.d' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><RootBridge /><RolesStates /><PortFast /><GuardsSec /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet25,
};
