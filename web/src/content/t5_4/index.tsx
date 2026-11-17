import type { TopicModule } from '../types';
import { AttacksSection, BiometricSection, CertsSection, Intro, MfaSection, PolicySection } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet54 } from './CheatSheet';

export const T5_4: TopicModule = {
  id: '5.4',
  subtitle: 'Politici de parole, MFA, certificate și biometrie',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '5.4' },
    { id: 'policy', label: 'Politica de parole', code: '5.4' },
    { id: 'attacks', label: 'Atacuri și entropie', code: '5.4' },
    { id: 'mfa', label: 'MFA', code: '5.4' },
    { id: 'certs', label: 'Certificate și PKI', code: '5.4' },
    { id: 'bio', label: 'Biometrie și alternative', code: '5.4' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><PolicySection /><AttacksSection /><MfaSection /><CertsSection /><BiometricSection /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet54,
};
