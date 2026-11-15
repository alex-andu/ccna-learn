import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.4 Identify interface and cable issues
export const FACTS: Fact[] = [
  { topicId: '1.4', id: 'f-1.4-01', front: 'Cum citești „X is up, line protocol is down”?', back: 'primul cuvânt = nivelul 1 · line protocol = nivelul 2', detail: 'up/down = fizic OK, L2 nu (serial: HDLC vs PPP, clock rate, keepalive)' },
  { topicId: '1.4', id: 'f-1.4-02', front: 'administratively down / down', back: 'comanda shutdown', detail: 'Se repară cu no shutdown. În show interfaces status: „disabled”.' },
  { topicId: '1.4', id: 'f-1.4-03', front: 'down / down (notconnect) — cauze', back: 'cablu lipsă/defect, cablu greșit, capăt oprit, speed mismatch', detail: 'Fibră: TX/RX inversate, SFP nepotrivit, conectori murdari' },
  { topicId: '1.4', id: 'f-1.4-04', front: 'err-disabled — ce este și cum recuperezi', back: 'port oprit automat de switch · cauza → shutdown + no shutdown', detail: 'Cauze: port security, BPDU Guard, UDLD, EtherChannel, link-flap. Automat: errdisable recovery cause … (interval implicit 300 s)' },
  { topicId: '1.4', id: 'f-1.4-05', front: 'runts', back: 'cadre < 64 octeți, cu CRC greșit', detail: 'Fragmente de coliziuni; pe partea full a unui duplex mismatch' },
  { topicId: '1.4', id: 'f-1.4-06', front: 'giants', back: 'cadre > 1518 octeți (fără jumbo)', detail: '1518 = 14 antet + 1500 date + 4 FCS. Cauze: NIC defect, MTU/jumbo nepotrivit' },
  { topicId: '1.4', id: 'f-1.4-07', front: 'CRC', back: 'checksum calculat ≠ FCS primit → cadru corupt', detail: 'Fără coliziuni = cablu/EMI/conector/port. Cu runts pe port full = duplex mismatch' },
  { topicId: '1.4', id: 'f-1.4-08', front: 'late collision', back: 'coliziune după primii 512 biți (64 octeți)', detail: '51,2 µs la 10 Mb/s. Cauze: duplex mismatch (partea half) sau cablu/segment prea lung' },
  { topicId: '1.4', id: 'f-1.4-09', front: 'Coliziuni pe un port full-duplex', back: 'nu trebuie să apară niciodată', detail: 'Normale doar pe half-duplex; dacă apar → verifică duplexul' },
  { topicId: '1.4', id: 'f-1.4-10', front: 'Duplex mismatch — semnătura pe fiecare capăt', back: 'HALF: collisions + late collisions · FULL: CRC + runts', detail: 'Legătura e up/up, ping-ul merge, transferurile sunt lente' },
  { topicId: '1.4', id: 'f-1.4-11', front: 'Fix 100/full ↔ auto → ?', back: 'partea auto: 100/half → duplex mismatch', detail: 'Parallel detection află viteza, nu și duplexul → presupune half (la 10/100)' },
  { topicId: '1.4', id: 'f-1.4-12', front: 'Speed mismatch (ambele fixate diferit)', back: 'link down/down pe ambele capete', detail: 'Duplex mismatch = up; speed mismatch = down' },
  { topicId: '1.4', id: 'f-1.4-13', front: 'Recomandarea Cisco pentru speed/duplex', back: 'auto pe ambele capete SAU aceleași valori fixe pe ambele', detail: 'Niciodată un capăt fix și celălalt auto' },
  { topicId: '1.4', id: 'f-1.4-14', front: '„a-full a-1000” în show interfaces status', back: 'valori negociate automat („a-” = auto)', detail: 'Fără „a-” = hard-codat' },
  { topicId: '1.4', id: 'f-1.4-15', front: 'Output drops', back: 'coada de ieșire plină = congestie (NU cablu)', detail: '≠ output errors. Remedii: link mai rapid, EtherChannel, QoS' },
  { topicId: '1.4', id: 'f-1.4-16', front: 'ignored / no buffer / overrun', back: 'lipsă de buffere/capacitate la recepție', detail: 'Tipic la broadcast storm (buclă L2) sau rafale' },
  { topicId: '1.4', id: 'f-1.4-17', front: 'input errors', back: 'total al erorilor de recepție', detail: 'Include runts, giants, no buffer, CRC, frame, overrun, ignored; sub-contoarele nu se adună obligatoriu exact' },
  { topicId: '1.4', id: 'f-1.4-18', front: 'Limita de lungime pentru Ethernet pe UTP', back: '100 m', detail: '90 m cablare fixă + 10 m patch cord-uri. Peste: CRC, flap-uri, late collisions' },
  { topicId: '1.4', id: 'f-1.4-19', front: 'Mesajul CDP pentru duplex diferit', back: '%CDP-4-DUPLEX_MISMATCH', detail: 'Doar raportează, nu corectează' },
  { topicId: '1.4', id: 'f-1.4-20', front: 'Excessive collisions', back: 'cadru aruncat după 16 coliziuni consecutive', detail: 'Cisco: coliziunile peste ≈0,1% din pachetele trimise sunt excesive' },
  { topicId: '1.4', id: 'f-1.4-21', front: 'Half-duplex la 1 Gb/s pe Cisco?', back: 'nu — doar full-duplex la 1000 Mb/s', detail: 'Pentru half trebuie speed 100 sau 10' },
];
