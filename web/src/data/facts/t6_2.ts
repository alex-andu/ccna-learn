import type { Fact } from '../flashcards';

// Fapte esențiale pentru 6.2 — rețele tradiționale vs bazate pe controller
export const FACTS: Fact[] = [
  { topicId: '6.2', id: 'f-6.2-01', front: 'Rețea tradițională: unde rulează control plane?', back: 'Distribuit: pe fiecare router/switch', detail: 'Fiecare echipament își calculează singur rutele/tabela MAC și rulează STP.' },
  { topicId: '6.2', id: 'f-6.2-02', front: 'Rețea tradițională: cum administrezi?', back: 'Per echipament: CLI (SSH/console), SNMP, syslog', detail: 'Politica se repetă pe fiecare echipament; risc de drift.' },
  { topicId: '6.2', id: 'f-6.2-03', front: 'Ce este un controller de rețea?', back: 'Sistem software central care proiectează, configurează și monitorizează echipamentele prin API-uri', detail: 'Echipamentele continuă să transmită traficul (data plane).' },
  { topicId: '6.2', id: 'f-6.2-04', front: 'Avantaje ale modelului cu controller', back: 'Administrare centrală · consecvență · vizibilitate · schimbări rapide · API-uri', detail: 'Compromis: nou punct critic (controller redundant) și competențe noi.' },
  { topicId: '6.2', id: 'f-6.2-05', front: 'Avantaje ale modelului tradițional', back: 'Autonomie, tehnologie matură, cost inițial mic, fără dependență de un sistem central pentru management', detail: 'Potrivit pentru rețele mici și schimbări rare.' },
  { topicId: '6.2', id: 'f-6.2-06', front: 'Controller indisponibil: ce se întâmplă?', back: 'Forwarding-ul existent continuă; nu mai poți schimba politici central sau vedea starea centralizat', detail: 'Pentru controller de management (ex. Catalyst Center).' },
  { topicId: '6.2', id: 'f-6.2-07', front: 'Etapele de lucru în Catalyst Center', back: 'Design → Policy → Provision → Assurance', detail: 'Assurance alimentează din nou designul și politicile.' },
  { topicId: '6.2', id: 'f-6.2-08', front: 'Ce este Catalyst Center?', back: 'Controller Cisco pentru campus (fost DNA Center): automatizare, politici, assurance', detail: 'Expune API REST northbound; folosește CLI/SNMP/NETCONF southbound; baza SD-Access.' },
  { topicId: '6.2', id: 'f-6.2-09', front: 'Cum cer aplicațiile servicii controller-ului?', back: 'Prin API northbound, de obicei REST (HTTPS + JSON)', detail: 'Detalii la 6.3 (northbound/southbound) și 6.5 (REST).' },
  { topicId: '6.2', id: 'f-6.2-10', front: 'Cele trei funcții IBN', back: 'Translation · Activation · Assurance', detail: 'Intenție → politici → aplicare → măsurare/corecție.' },
  { topicId: '6.2', id: 'f-6.2-11', front: 'Single pane of glass', back: 'Un singur panou unde vezi și administrezi întreaga rețea', detail: 'Opusul vizibilității fragmentate per echipament.' },
  { topicId: '6.2', id: 'f-6.2-12', front: 'Politici: tradițional vs controller', back: 'Tradițional: legate de IP/VLAN/port · Controller: la nivel de intenție (utilizator, grup, aplicație)', detail: 'De aceea ACL-urile tradiționale se rup mai ușor la mutări.' },
  { topicId: '6.2', id: 'f-6.2-13', front: 'Exemple de controller-e Cisco', back: 'Catalyst Center (campus) · Catalyst SD-WAN · Meraki Dashboard (cloud) · WLC (wireless) · ACI (data center)', detail: 'Domenii diferite, aceeași idee de control central.' },
  { topicId: '6.2', id: 'f-6.2-14', front: 'Când rămâne potrivită rețeaua tradițională?', back: 'Rețele mici, schimbări rare, echipamente fără API-uri', detail: 'Costul unui controller nu se justifică la scară mică.' },
  { topicId: '6.2', id: 'f-6.2-15', front: 'Ce rămâne necesar chiar cu controller?', back: 'Acces de management pe echipamente (SSH, SNMP, NETCONF) și CLI pentru depanare', detail: 'Controller-ul folosește interfețele southbound ale echipamentelor.' },
  { topicId: '6.2', id: 'f-6.2-16', front: 'Plug and Play / ZTP', back: 'Echipamentul nou se descoperă și se configurează automat de către controller', detail: 'Util în filiale și la implementări mari.' },
];
