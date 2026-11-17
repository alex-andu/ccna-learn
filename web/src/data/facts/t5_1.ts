import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.1 concepte de securitate
export const FACTS: Fact[] = [
  { topicId: '5.1', id: 'f-5.1-01', front: 'Ce înseamnă CIA?', back: 'Confidentiality, Integrity, Availability', detail: 'Cele trei proprietăți de protejat.' },
  { topicId: '5.1', id: 'f-5.1-02', front: 'Vulnerability vs threat vs exploit', back: 'Vulnerability = slăbiciune · Threat = cine/ce poate face rău · Exploit = metoda care folosește slăbiciunea', detail: 'Mitigarea reduce riscul.' },
  { topicId: '5.1', id: 'f-5.1-03', front: 'Cum se definește riscul?', back: 'Probabilitatea ca o amenințare să exploateze o vulnerabilitate × impactul', detail: 'Se tratează prin mitigare, acceptare, transfer sau evitare.' },
  { topicId: '5.1', id: 'f-5.1-04', front: 'Virus vs worm', back: 'Virusul necesită acțiune a utilizatorului; wormul se propagă singur prin rețea', detail: 'Trojanul pare legitim; ransomware criptează date.' },
  { topicId: '5.1', id: 'f-5.1-05', front: 'Phishing, spear phishing, whaling', back: 'Generic · țintit · către conducere', detail: 'Vishing = voce; smishing = SMS.' },
  { topicId: '5.1', id: 'f-5.1-06', front: 'Ce lovește un DoS/DDoS?', back: 'Disponibilitatea', detail: 'DDoS vine din multe surse (botnet).' },
  { topicId: '5.1', id: 'f-5.1-07', front: 'Reflecție și amplificare', back: 'Sursa falsificată (a victimei) + răspunsuri mult mai mari decât cererile', detail: 'Tipic pe servicii UDP deschise.' },
  { topicId: '5.1', id: 'f-5.1-08', front: 'Ce este un zero-day?', back: 'Vulnerabilitate exploatată înainte să existe un patch', detail: 'Mitigări: segmentare, IPS, monitorizare.' },
  { topicId: '5.1', id: 'f-5.1-09', front: 'Ce este defense in depth?', back: 'Mai multe straturi de protecție diferite și independente', detail: 'Politici, fizic, perimetru, rețea, gazdă, aplicație/date.' },
  { topicId: '5.1', id: 'f-5.1-10', front: 'Ce este least privilege?', back: 'Doar drepturile strict necesare fiecărui cont/proces', detail: 'Limitează efectul unui cont compromis.' },
  { topicId: '5.1', id: 'f-5.1-11', front: 'Ce control sprijină confidențialitatea?', back: 'Criptarea și controlul accesului', detail: 'TLS, SSH, IPsec.' },
  { topicId: '5.1', id: 'f-5.1-12', front: 'Ce control sprijină integritatea?', back: 'Hash-uri și semnături digitale', detail: 'Un hash diferit = datele s-au modificat.' },
  { topicId: '5.1', id: 'f-5.1-13', front: 'Ce control sprijină disponibilitatea?', back: 'Redundanță, backup, protecție anti-DDoS', detail: 'FHRP, EtherChannel, căi duble.' },
  { topicId: '5.1', id: 'f-5.1-14', front: 'Tipuri de controale după funcție', back: 'Preventive · detective · corective', detail: 'Firewall/patch · IPS/log-uri · backup/restaurare.' },
  { topicId: '5.1', id: 'f-5.1-15', front: 'Cum se oprește serverul HTTP pe IOS?', back: 'no ip http server (și no ip http secure-server)', detail: 'Două comenzi separate.' },
  { topicId: '5.1', id: 'f-5.1-16', front: 'Cum permiți doar SSH pe VTY?', back: 'transport input ssh', detail: 'Necesită SSH configurat (4.8).' },
  { topicId: '5.1', id: 'f-5.1-17', front: 'Ce este suprafața de atac?', back: 'Totalitatea punctelor prin care se poate încerca intrarea', detail: 'Se reduce prin hardening.' },
  { topicId: '5.1', id: 'f-5.1-18', front: 'Ce este un insider threat?', back: 'Daune produse de cineva cu acces legitim', detail: 'Intenționat sau din greșeală.' },
  { topicId: '5.1', id: 'f-5.1-19', front: 'Cum se apără un ransomware?', back: 'Backup-uri testate offline/imutabile, patch-uri, segmentare, instruire', detail: 'Backup-urile conectate permanent pot fi criptate.' },
];
