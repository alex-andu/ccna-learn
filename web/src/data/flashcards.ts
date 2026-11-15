import { GLOSSARY } from './glossary';

export type Flashcard = { id: string; topicId: string; front: string; back: string; detail?: string; kind: 'term' | 'fact' };

// Fapte esențiale pentru 1.11 (cifre și perechi care trebuie știute pe de rost)
const FACTS_1_11: Omit<Flashcard, 'kind' | 'topicId'>[] = [
  { id: 'f-1.11-01', front: 'Canalele care nu se suprapun în 2.4 GHz', back: '1, 6, 11', detail: 'Distanța între canale e de 5 MHz, iar un canal ocupă ≈22 MHz.' },
  { id: 'f-1.11-02', front: 'Lungimea maximă a SSID-ului', back: '32 de octeți', detail: 'Face diferența între literele mari și mici. Parola PSK are 8–63 de caractere.' },
  { id: 'f-1.11-03', front: '802.11b — bandă și viteză', back: '2.4 GHz · 11 Mbps · DSSS', detail: '1999' },
  { id: 'f-1.11-04', front: '802.11a — bandă și viteză', back: '5 GHz · 54 Mbps · OFDM', detail: '1999' },
  { id: 'f-1.11-05', front: '802.11g — bandă și viteză', back: '2.4 GHz · 54 Mbps · OFDM', detail: '2003, compatibil cu 802.11b' },
  { id: 'f-1.11-06', front: '802.11n — generație, benzi, viteză', back: 'Wi-Fi 4 · 2.4 + 5 GHz · 600 Mbps', detail: 'MIMO, până la 4 fluxuri, canale de 40 MHz' },
  { id: 'f-1.11-07', front: '802.11ac — generație, benzi, viteză', back: 'Wi-Fi 5 · doar 5 GHz · ≈6.9 Gbps', detail: '256-QAM, 160 MHz, MU-MIMO pe downlink (Wave 2)' },
  { id: 'f-1.11-08', front: '802.11ax — generație, benzi, viteză', back: 'Wi-Fi 6 (2.4/5) · Wi-Fi 6E (+6 GHz) · ≈9.6 Gbps', detail: 'OFDMA, 1024-QAM, MU-MIMO pe uplink și downlink, BSS Coloring, TWT' },
  { id: 'f-1.11-09', front: '802.11be — generație, benzi, viteză', back: 'Wi-Fi 7 · 2.4/5/6 GHz · ≈46 Gbps', detail: '320 MHz, 4096-QAM, MLO' },
  { id: 'f-1.11-10', front: '0 / 10 / 20 / 30 dBm în mW', back: '1 mW / 10 mW / 100 mW / 1 W', detail: '+3 dB ≈ ×2 · +10 dB = ×10' },
  { id: 'f-1.11-11', front: 'Formula SNR', back: 'SNR = semnal (dBm) − zgomot (dBm)', detail: 'Exemplu: −65 − (−92) = 27 dB' },
  { id: 'f-1.11-12', front: 'Formula EIRP', back: 'EIRP = TX (dBm) − pierderi cablu (dB) + câștig antenă (dBi)', detail: '' },
  { id: 'f-1.11-13', front: 'RSSI minim recomandat pentru voce', back: '−67 dBm (cu SNR ≥ 25 dB)', detail: '' },
  { id: 'f-1.11-14', front: 'Lungimea de undă la 2.4 GHz / 5 GHz', back: '≈12.5 cm / ≈6 cm', detail: 'λ = c / f' },
  { id: 'f-1.11-15', front: 'Metoda de acces la mediu Wi-Fi', back: 'CSMA/CA (half-duplex)', detail: 'Ethernet half-duplex folosește CSMA/CD' },
  { id: 'f-1.11-16', front: 'WEP / WPA / WPA2 — criptare', back: 'RC4 / TKIP (RC4) / AES-CCMP', detail: '' },
  { id: 'f-1.11-17', front: 'Ce aduce WPA3', back: 'SAE · PMF obligatoriu · mod Enterprise 192-bit (GCMP-256)', detail: '' },
  { id: 'f-1.11-18', front: 'Cele 4 mesaje ale 4-way handshake', back: '1 ANonce → 2 SNonce+MIC → 3 GTK+MIC → 4 ACK', detail: 'PMK nu circulă prin aer' },
  { id: 'f-1.11-19', front: 'Canale de 40/80/160 MHz = câte canale de 20 MHz?', back: '2 / 4 / 8', detail: 'Channel bonding' },
  { id: 'f-1.11-20', front: 'Canalele de 5 GHz cu DFS', back: '52–144 (U-NII-2A și 2C)', detail: 'Fără DFS: 36–48 (și 149–165 în SUA)' },
  { id: 'f-1.11-21', front: 'BSS vs ESS vs IBSS', back: '1 AP · mai multe AP-uri cu același SSID · fără AP (ad hoc)', detail: '' },
  { id: 'f-1.11-22', front: 'Notația MIMO 4×4:3', back: '4 TX · 4 RX · 3 fluxuri spațiale', detail: '' },
  { id: 'f-1.11-23', front: 'Fenomenele RF', back: 'absorption · reflection · refraction · diffraction · scattering', detail: 'Metalul reflectă, apa absoarbe' },
  { id: 'f-1.11-24', front: 'Benzile Wi-Fi în UE', back: '2.4 GHz (ch 1–13) · 5 GHz (36–64, 100–140) · 6 GHz (5945–6425 MHz)', detail: 'În România: ANCOM' },
];

export const FLASHCARDS: Flashcard[] = [
  ...FACTS_1_11.map((f) => ({ ...f, topicId: '1.11', kind: 'fact' as const })),
  ...GLOSSARY.filter((g) => g.topics?.includes('1.11')).map((g) => ({
    id: `g-${g.id}`, topicId: '1.11', kind: 'term' as const,
    front: g.abbr, back: [g.full, g.ro].filter(Boolean).join(' — '), detail: g.what,
  })),
];
