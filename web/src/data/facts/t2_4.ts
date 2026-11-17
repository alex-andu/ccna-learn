import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.4 EtherChannel (LACP)
export const FACTS: Fact[] = [
  { topicId: '2.4', id: 'f-2.4-01', front: 'Ce rezolvă EtherChannel?', back: 'Grupează linkuri paralele într-un singur link logic: bandă agregată + redundanță, fără blocaj STP', detail: 'STP vede port-channel-ul, nu membrii.' },
  { topicId: '2.4', id: 'f-2.4-02', front: 'Moduri LACP', back: 'active (inițiază) și passive (răspunde)', detail: 'active–active și active–passive formează canal; passive–passive nu.' },
  { topicId: '2.4', id: 'f-2.4-03', front: 'Moduri PAgP', back: 'desirable (inițiază) și auto (răspunde)', detail: 'desirable–desirable și desirable–auto formează canal; auto–auto nu.' },
  { topicId: '2.4', id: 'f-2.4-04', front: 'Ce face modul „on”?', back: 'EtherChannel static, fără negociere; se potrivește doar cu „on”', detail: 'Nu vorbește cu LACP sau PAgP.' },
  { topicId: '2.4', id: 'f-2.4-05', front: 'LACP: standard și număr de porturi', back: 'IEEE 802.3ad / 802.1AX; până la 16 porturi, 8 active + 8 standby', detail: 'PAgP: maxim 8.' },
  { topicId: '2.4', id: 'f-2.4-06', front: 'PAgP: cine îl folosește?', back: 'Proprietar Cisco; doar între echipamente Cisco', detail: 'Nu este compatibil cu LACP.' },
  { topicId: '2.4', id: 'f-2.4-07', front: 'Comanda care pune un port în canal', back: 'channel-group N mode {active|passive|desirable|auto|on}', detail: 'Creează automat interface port-channel N.' },
  { topicId: '2.4', id: 'f-2.4-08', front: 'Unde configurezi trunk-ul / VLAN-urile unui EtherChannel L2?', back: 'Pe interface port-channel N (se propagă la membri)', detail: 'Membrii trebuie să aibă setări identice.' },
  { topicId: '2.4', id: 'f-2.4-09', front: 'Ce trebuie să coincidă pe membri?', back: 'Viteză, duplex, mod switchport, VLAN access / native / allowed', detail: 'Altfel membrul e suspendat sau exclus.' },
  { topicId: '2.4', id: 'f-2.4-10', front: 'EtherChannel L3: ce comenzi?', back: 'no switchport pe membri și pe Po; ip address doar pe port-channel', detail: 'Pe switch multilayer, cu ip routing.' },
  { topicId: '2.4', id: 'f-2.4-11', front: 'Numerele de port-channel trebuie să fie egale pe cele două switch-uri?', back: 'Nu, sunt locale; se recomandă totuși aceleași', detail: 'Contează modurile și parametrii, nu numărul.' },
  { topicId: '2.4', id: 'f-2.4-12', front: 'Comanda principală de verificare', back: 'show etherchannel summary', detail: 'Alte: show etherchannel port-channel, show lacp neighbor, show pagp neighbor.' },
  { topicId: '2.4', id: 'f-2.4-13', front: 'Flaguri port-channel în summary', back: 'SU = L2 în uz; RU = L3 în uz; SD = L2 down', detail: 'S = Layer 2, R = Layer 3, U = in use, D = down.' },
  { topicId: '2.4', id: 'f-2.4-14', front: 'Flaguri membru în summary', back: 'P bundled · s suspended · I stand-alone · D down · H hot-standby', detail: 'P este starea dorită.' },
  { topicId: '2.4', id: 'f-2.4-15', front: 'Cum se repartizează traficul pe membri?', back: 'Hash pe câmpuri din antet (MAC / IP / porturi): un flux rămâne pe același link', detail: 'Nu se trimite pachet cu pachet pe linkuri diferite.' },
  { topicId: '2.4', id: 'f-2.4-16', front: 'Cum setezi metoda de load balancing?', back: 'port-channel load-balance <metodă> (global); verificare: show etherchannel load-balance', detail: 'Metoda implicită depinde de platformă.' },
  { topicId: '2.4', id: 'f-2.4-17', front: 'Un singur flux de 1 Gbps pe un bundle de 4 × 1 Gbps: ce viteză maximă?', back: '1 Gbps — fluxul rămâne pe un singur membru', detail: 'Capacitatea agregată ajută mai multe fluxuri.' },
  { topicId: '2.4', id: 'f-2.4-18', front: 'LACP: cine decide porturile active când sunt >8?', back: 'Echipamentul cu prioritatea de sistem mai mică (implicit 32768), după prioritatea portului', detail: 'Valoarea mai mică câștigă.' },
  { topicId: '2.4', id: 'f-2.4-19', front: 'Cum fixezi protocolul pe un port?', back: 'channel-protocol lacp (sau pagp)', detail: 'Moduri incompatibile sunt apoi refuzate.' },
  { topicId: '2.4', id: 'f-2.4-20', front: 'Ce înseamnă Po1(SD) în show etherchannel summary?', back: 'Port-channel de nivel 2 (S) căzut (D): niciun membru bundled', detail: 'Verifică modurile (passive+passive?), parametrii membrilor, cablurile.' },
];
