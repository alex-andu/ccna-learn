import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.5 Rapid PVST+
export const FACTS: Fact[] = [
  { topicId: '2.5', id: 'f-2.5-01', front: 'De ce există STP?', back: 'Previne bucle de nivel 2: cadrul Ethernet nu are TTL, deci broadcast storm', detail: 'Blochează logic linkurile redundante și le păstrează ca rezervă.' },
  { topicId: '2.5', id: 'f-2.5-02', front: 'Rapid PVST+ vs PVST+', back: 'Rapid PVST+ = RSTP (802.1w) per VLAN; PVST+ = STP 802.1D per VLAN', detail: 'spanning-tree mode rapid-pvst.' },
  { topicId: '2.5', id: 'f-2.5-03', front: 'Cine câștigă alegerea root bridge?', back: 'Cel mai mic Bridge ID (prioritate, apoi MAC)', detail: 'Prioritatea mai mică câștigă.' },
  { topicId: '2.5', id: 'f-2.5-04', front: 'Prioritatea implicită STP și pasul de configurare', back: '32768; multipli de 4096', detail: 'La PVST+ i se adaugă numărul VLAN (32778 pentru VLAN 10).' },
  { topicId: '2.5', id: 'f-2.5-05', front: 'Ce este extended system ID?', back: 'Numărul VLAN-ului inclus în cei 12 biți din prioritate', detail: 'Prioritate afișată = configurată + VLAN.' },
  { topicId: '2.5', id: 'f-2.5-06', front: 'Cost STP „short” per viteză', back: '10 Mbps 100 · 100 Mbps 19 · 1 Gbps 4 · 10 Gbps 2', detail: 'Metoda long: 2 000 000 · 200 000 · 20 000 · 2 000.' },
  { topicId: '2.5', id: 'f-2.5-07', front: 'Criteriile root port (în ordine)', back: 'Cost spre root → Sender BID → Sender port priority → Sender port number', detail: 'Cel mai mic câștigă la fiecare pas.' },
  { topicId: '2.5', id: 'f-2.5-08', front: 'Câte root port-uri are un switch non-root? Dar root bridge-ul?', back: 'Unul; root bridge-ul niciunul', detail: 'Toate porturile root-ului sunt designated.' },
  { topicId: '2.5', id: 'f-2.5-09', front: 'Câte designated port-uri pe un segment?', back: 'Exact unul', detail: 'Switch-ul cu calea mai bună spre root.' },
  { topicId: '2.5', id: 'f-2.5-10', front: 'Rolurile RSTP', back: 'Root, Designated, Alternate, Backup, Disabled', detail: 'Alternate = vechiul blocking; Backup = al doilea port pe același segment.' },
  { topicId: '2.5', id: 'f-2.5-11', front: 'Stările RSTP vs 802.1D', back: 'Discarding, Learning, Forwarding (RSTP); Disabled/Blocking/Listening/Learning/Forwarding (802.1D)', detail: 'Discarding unește Disabled + Blocking + Listening.' },
  { topicId: '2.5', id: 'f-2.5-12', front: 'Timere STP implicite', back: 'Hello 2 s · Forward delay 15 s · Max age 20 s', detail: 'Convergență 802.1D: 30–50 s; RSTP: ≈1–2 s.' },
  { topicId: '2.5', id: 'f-2.5-13', front: 'Cum converge RSTP rapid?', back: 'Handshake proposal/agreement pe linkuri punct-la-punct', detail: 'Pe linkuri shared (half duplex) revine la timere.' },
  { topicId: '2.5', id: 'f-2.5-14', front: 'Ce face PortFast?', back: 'Port edge: trece direct în Forwarding, fără handshake sau TCN', detail: 'Doar spre hosturi. spanning-tree portfast / portfast default.' },
  { topicId: '2.5', id: 'f-2.5-15', front: 'Ce face BPDU Guard?', back: 'Port edge care primește BPDU ⇒ err-disabled', detail: 'Recuperare: shutdown/no shutdown sau errdisable recovery cause bpduguard.' },
  { topicId: '2.5', id: 'f-2.5-16', front: 'Ce face Root Guard?', back: 'Port care primește BPDU superior ⇒ root-inconsistent (blocat); revine singur', detail: 'spanning-tree guard root, spre switch-uri care nu trebuie să fie root.' },
  { topicId: '2.5', id: 'f-2.5-17', front: 'Ce face Loop Guard?', back: 'Port root/alternate fără BPDU ⇒ loop-inconsistent, nu devine designated', detail: 'spanning-tree guard loop / loopguard default.' },
  { topicId: '2.5', id: 'f-2.5-18', front: 'BPDU Filter pe interfață: efect', back: 'Portul nu trimite/primește BPDU: STP efectiv oprit pe port', detail: 'Periculos; global (cu PortFast) e mai sigur.' },
  { topicId: '2.5', id: 'f-2.5-19', front: 'Ce fac root primary / root secondary?', back: 'Macro care setează prioritatea pentru ca switch-ul să fie root / rezervă', detail: 'De obicei 24576 / 28672; calculate la rulare.' },
  { topicId: '2.5', id: 'f-2.5-20', front: 'Adresa multicast a BPDU', back: '0180.C200.0000', detail: 'Cadrele nu sunt retransmise ca trafic normal.' },
];
