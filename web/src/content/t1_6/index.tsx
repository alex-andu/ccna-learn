import type { TopicModule } from '../types';
import { Intro, Binary, Structure, Classful, Masks, Calc, Magic, Flsm, Vlsm, Edge, Special } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet16 } from './CheatSheet';

export const T1_6: TopicModule = {
  id: '1.6',
  subtitle: 'Adresarea IPv4 și subnetting — binar, măști, VLSM, configurare IOS',
  studyTime: '≈6–8 h studiu + laburi + drill zilnic',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.6' },
    { id: 'binary', label: 'Binar ↔ zecimal', code: '1.6' },
    { id: 'structure', label: 'Structura adresei și antetul', code: '1.6' },
    { id: 'classful', label: 'Clase → CIDR', code: '1.6' },
    { id: 'masks', label: 'Mască, prefix, wildcard', code: '1.6' },
    { id: 'calc', label: 'Rețea, broadcast, gazde', code: '1.6' },
    { id: 'magic', label: 'Metoda magic number', code: '1.6' },
    { id: 'flsm', label: 'FLSM', code: '1.6' },
    { id: 'vlsm', label: 'VLSM (+ sumarizare)', code: '1.6' },
    { id: 'edge', label: '/30, /31, /32', code: '1.6' },
    { id: 'special', label: 'Adrese speciale', code: '1.6' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Binary /><Structure /><Classful /><Masks /><Calc /><Magic /><Flsm /><Vlsm /><Edge /><Special /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet16,
};
