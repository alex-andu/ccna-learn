import type { TopicModule } from '../types';
import { Dot1xSection, FunctionsSection, Intro, MethodsSection, ProtocolsSection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet58 } from './CheatSheet';

export const T5_8: TopicModule = {
  id: '5.8',
  subtitle: 'AAA: autentificare, autorizare, contabilizare; RADIUS vs TACACS+; 802.1X',
  studyTime: '≈4–5 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.8' },
    { id: 'functions', label: 'Cele trei funcții și fluxul', code: '5.8' },
    { id: 'protocols', label: 'Local/server, RADIUS vs TACACS+', code: '5.8' },
    { id: 'methods', label: 'Liste de metode și fallback', code: '5.8' },
    { id: 'dot1x', label: '802.1X', code: '5.8' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><FunctionsSection /><ProtocolsSection /><MethodsSection /><Dot1xSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet58,
};
