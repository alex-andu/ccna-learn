import type { Fact } from '../flashcards';

// Fapte esențiale pentru 6.3 — arhitectura SDN: planuri, underlay/overlay/fabric, API-uri
export const FACTS: Fact[] = [
  { topicId: '6.3', id: 'f-6.3-01', front: 'Separarea control plane de data plane (6.3.a)', back: 'Logica de decizie se mută într-un controller; echipamentele păstrează data plane-ul (forwarding)', detail: 'Pachetele utilizatorilor nu trec prin controller.' },
  { topicId: '6.3', id: 'f-6.3-02', front: 'Cele trei planuri', back: 'Data (mută pachete) · Control (decide unde) · Management (administrare)', detail: 'Management: SSH/SNMP/NETCONF; Control: OSPF/STP/ARP; Data: forwarding/ACL/NAT/QoS.' },
  { topicId: '6.3', id: 'f-6.3-03', front: 'Ce este underlay?', back: 'Rețeaua de transport: legături, switch-uri/routere, IP + protocol de rutare', detail: 'Stabil, rutat (L3); nu cunoaște adresele gazdelor din overlay.' },
  { topicId: '6.3', id: 'f-6.3-04', front: 'Ce este overlay?', back: 'Rețea virtuală creată prin tuneluri (încapsulare) peste underlay', detail: 'Exemple: VXLAN, GRE, IPsec.' },
  { topicId: '6.3', id: 'f-6.3-05', front: 'Ce este un fabric?', back: 'Underlay + overlay privite ca un singur sistem administrat central', detail: 'Exemplu: Cisco SD-Access.' },
  { topicId: '6.3', id: 'f-6.3-06', front: 'SD-Access: tehnologiile', back: 'Control plane LISP · data plane VXLAN · politică SGT (TrustSec) · orchestrare Catalyst Center + ISE', detail: 'Control, date, politică și management ca componente separate.' },
  { topicId: '6.3', id: 'f-6.3-07', front: 'Rolurile nodurilor SD-Access', back: 'Edge (gazde, VXLAN) · Border (spre exterior) · Control plane (LISP map-server) · Intermediate (doar underlay)', detail: 'Catalyst Center nu e pe calea pachetelor de date.' },
  { topicId: '6.3', id: 'f-6.3-08', front: 'VXLAN: port și identificator', back: 'UDP 4789 · VNI pe 24 de biți (≈16 milioane de segmente)', detail: 'VLAN: 12 biți, 4094 de segmente.' },
  { topicId: '6.3', id: 'f-6.3-09', front: 'Ce face un VTEP?', back: 'Încapsulează/decapsulează pachetele VXLAN la capătul tunelului', detail: 'În SD-Access, fiecare fabric edge este VTEP.' },
  { topicId: '6.3', id: 'f-6.3-10', front: 'LISP într-o frază', back: 'Separă identitatea gazdei (EID) de locația ei (RLOC); ține corespondența în control plane', detail: 'Mobilitate fără reconfigurarea underlay-ului.' },
  { topicId: '6.3', id: 'f-6.3-11', front: 'Northbound API', back: 'Controller ↔ aplicații/scripturi; de obicei REST (HTTPS + JSON)', detail: 'Northbound = în sus.' },
  { topicId: '6.3', id: 'f-6.3-12', front: 'Southbound API', back: 'Controller ↔ echipamente: NETCONF, RESTCONF, OpenFlow, CLI/SSH, SNMP, OpFlex', detail: 'Southbound = în jos.' },
  { topicId: '6.3', id: 'f-6.3-13', front: 'NETCONF', back: 'SSH, TCP 830, XML, modele YANG; operații get-config/edit-config', detail: 'Nu folosește HTTP.' },
  { topicId: '6.3', id: 'f-6.3-14', front: 'RESTCONF', back: 'HTTPS, JSON/XML, modele YANG, metode HTTP', detail: 'Pe IOS XE: restconf + ip http secure-server.' },
  { topicId: '6.3', id: 'f-6.3-15', front: 'YANG', back: 'Limbaj de modelare a datelor (schema), nu protocol', detail: 'NETCONF și RESTCONF transportă date conforme cu modele YANG.' },
  { topicId: '6.3', id: 'f-6.3-16', front: 'OpenFlow', back: 'Protocol southbound SDN care programează tabele de flux (potrivire → acțiune); TCP 6653', detail: 'Exemplu de separare completă a control plane-ului.' },
  { topicId: '6.3', id: 'f-6.3-17', front: 'Ce rutează underlay-ul?', back: 'Doar adresele exterioare ale nodurilor (RLOC/loopback-uri), nu adresele gazdelor', detail: 'De aceea R2/R3 din lab nu au rute 192.168.x.x.' },
  { topicId: '6.3', id: 'f-6.3-18', front: 'Overlay și MTU', back: 'Încapsularea adaugă antete: MTU-ul underlay-ului trebuie să fie mai mare', detail: 'Simptom: ping merge, transferuri mari eșuează.' },
  { topicId: '6.3', id: 'f-6.3-19', front: 'Catalyst Center: pur SDN?', back: 'Nu: e controller de management/orchestrare; fabric-ul SD-Access are control plane propriu (LISP)', detail: 'Echipamentele clasice își păstrează o parte din control plane.' },
];
