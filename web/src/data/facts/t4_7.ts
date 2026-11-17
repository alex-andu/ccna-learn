import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.7 QoS / PHB
export const FACTS: Fact[] = [
  { topicId: '4.7', id: 'f-4.7-01', front: 'Ce face QoS?', back: 'Tratează diferit tipuri de trafic când resursele nu ajung (nu creează bandă)', detail: 'Are efect doar la congestie.' },
  { topicId: '4.7', id: 'f-4.7-02', front: 'Ce este PHB?', back: 'Per-Hop Behavior: comportamentul local al unui router față de o clasă marcată', detail: 'Baza modelului DiffServ.' },
  { topicId: '4.7', id: 'f-4.7-03', front: 'DSCP: câți biți și unde?', back: '6 biți, primii din octetul ToS / Traffic Class (0–63)', detail: 'Ultimii 2 biți = ECN.' },
  { topicId: '4.7', id: 'f-4.7-04', front: 'CoS/PCP: câți biți și unde?', back: '3 biți (0–7) în eticheta 802.1Q', detail: 'Dispare la router; se mapează la DSCP.' },
  { topicId: '4.7', id: 'f-4.7-05', front: 'IP Precedence', back: 'Primii 3 biți ai octetului ToS (0–7)', detail: 'Vechi; CS = 8 × x e compatibil.' },
  { topicId: '4.7', id: 'f-4.7-06', front: 'DSCP pentru voce (EF)', back: '46 (binar 101110)', detail: 'Octet ToS = 184 (0xB8).' },
  { topicId: '4.7', id: 'f-4.7-07', front: 'Formula AF', back: 'DSCP = 8 × clasă + 2 × drop (AFxy)', detail: 'AF41 = 34, AF31 = 26, AF21 = 18, AF11 = 10.' },
  { topicId: '4.7', id: 'f-4.7-08', front: 'Formula CS', back: 'DSCP = 8 × x (CS6 = 48)', detail: 'Compatibil cu IP Precedence.' },
  { topicId: '4.7', id: 'f-4.7-09', front: 'LLQ', back: 'CBWFQ + o coadă prioritară strictă (voce), limitată ca bandă', detail: 'Prioritatea strictă e policed în congestie.' },
  { topicId: '4.7', id: 'f-4.7-10', front: 'CBWFQ', back: 'Cozi pe clase cu bandă garantată (bandwidth)', detail: 'Clasa implicită primește restul.' },
  { topicId: '4.7', id: 'f-4.7-11', front: 'Tail drop', back: 'Pachetele noi sunt aruncate când coada e plină', detail: 'Duce la sincronizare globală TCP.' },
  { topicId: '4.7', id: 'f-4.7-12', front: 'WRED', back: 'Drop timpuriu, aleatoriu, ponderat pe prioritate', detail: 'Previne tail drop și sincronizarea TCP.' },
  { topicId: '4.7', id: 'f-4.7-13', front: 'Policing', back: 'Aruncă sau re-marchează excesul; fără întârziere', detail: 'Intrare sau ieșire.' },
  { topicId: '4.7', id: 'f-4.7-14', front: 'Shaping', back: 'Bufferizează excesul; adaugă întârziere; doar la ieșire', detail: 'Netezește curba de trafic.' },
  { topicId: '4.7', id: 'f-4.7-15', front: 'Trust boundary', back: 'Punctul până unde marcajele sunt de încredere', detail: 'De obicei telefonul IP / switch-ul de acces.' },
  { topicId: '4.7', id: 'f-4.7-16', front: 'Cele trei modele QoS', back: 'Best effort · IntServ (rezervări, RSVP) · DiffServ (clase, PHB)', detail: 'DiffServ scalează cel mai bine.' },
  { topicId: '4.7', id: 'f-4.7-17', front: 'MQC în trei pași', back: 'class-map → policy-map → service-policy (input/output)', detail: 'Verificare: show policy-map interface.' },
  { topicId: '4.7', id: 'f-4.7-18', front: 'Cerințe uzuale ale vocii', back: 'Delay ≈ sub 150 ms, jitter ≈ sub 30 ms, loss ≈ sub 1%', detail: 'Repere de proiectare Cisco, nu garanții.' },
  { topicId: '4.7', id: 'f-4.7-19', front: 'Jitter', back: 'Variația întârzierii între pachete', detail: 'Distruge voce și video în timp real.' },
];
