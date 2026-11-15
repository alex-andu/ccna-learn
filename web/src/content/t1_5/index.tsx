import type { TopicModule } from '../types';
import { Intro, Ports, TcpConnection, Reliability, Udp, Compare, Quic } from './Theory';
import { ConfigExamples } from './Config';
import { GuidedLab, SoloLab } from './Labs';
import { CheatSheet15 } from './CheatSheet';

export const T1_5: TopicModule = {
  id: '1.5',
  subtitle: 'TCP vs UDP — porturi, 3-way handshake, fiabilitate, windowing',
  studyTime: '≈3–4 h studiu + laburi',
  labs: 2,
  sections: [
    { id: 'intro', label: 'Imaginea de ansamblu (OSI, încapsulare)', code: '1.5' },
    { id: 'ports', label: 'Porturi și socket-uri', code: '1.5' },
    { id: 'tcp-conn', label: 'TCP — header, handshake, închidere', code: '1.5' },
    { id: 'reliability', label: 'TCP — seq/ack, retransmisie, windowing', code: '1.5' },
    { id: 'udp', label: 'UDP', code: '1.5' },
    { id: 'compare', label: 'TCP vs UDP + porturi', code: '1.5' },
    { id: 'quic', label: 'Extra: QUIC / HTTP/3', code: 'extra' },
    { id: 'config', label: 'Exemple de verificare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
  Body: () => (<><Intro /><Ports /><TcpConnection /><Reliability /><Udp /><Compare /><Quic /><ConfigExamples /></>),
  Labs: () => (<><GuidedLab /><SoloLab /></>),
  CheatSheet: CheatSheet15,
};
