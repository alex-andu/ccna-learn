import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.2 (perechi și cifre care trebuie știute pe de rost)
export const FACTS: Fact[] = [
  { topicId: '1.2', id: 'f-1.2-01', front: 'Cele trei straturi ale campusului ierarhic', back: 'Access · Distribution · Core', detail: 'Access = dispozitive finale; distribution = agregare + granița L2/L3; core = transport rapid' },
  { topicId: '1.2', id: 'f-1.2-02', front: 'Alt nume pentru two-tier', back: 'Collapsed core', detail: 'Core și distribution sunt aceleași switch-uri' },
  { topicId: '1.2', id: 'f-1.2-03', front: 'Unde e de obicei granița L2/L3 în campus?', back: 'La distribution', detail: 'SVI-uri ca default gateway + FHRP' },
  { topicId: '1.2', id: 'f-1.2-04', front: 'Ce NU face core-ul?', back: 'Politici costisitoare (ACL complexe, inspecție) și nu are dispozitive finale', detail: 'Doar transport rapid și redundant' },
  { topicId: '1.2', id: 'f-1.2-05', front: 'Când adaugi un core separat?', back: 'Când ai mai multe blocuri de distribuție / clădiri', detail: 'Fără core legăturile dintre blocuri cresc ≈ pătratic; cu core, liniar' },
  { topicId: '1.2', id: 'f-1.2-06', front: 'Regula de cablare spine-leaf', back: 'Fiecare leaf ↔ fiecare spine; fără leaf ↔ leaf și fără spine ↔ spine', detail: 'Servere doar pe leaf' },
  { topicId: '1.2', id: 'f-1.2-07', front: 'Hop count leaf → alt leaf', back: 'Leaf → spine → leaf (3 switch-uri), pentru orice pereche', detail: 'Latență previzibilă' },
  { topicId: '1.2', id: 'f-1.2-08', front: 'Pentru ce trafic e optimizat spine-leaf?', back: 'East-west (server ↔ server)', detail: 'North-south = client ↔ datacenter' },
  { topicId: '1.2', id: 'f-1.2-09', front: 'ECMP', back: 'Equal-Cost Multi-Path: mai multe căi de cost egal folosite simultan', detail: 'În spine-leaf: căi = numărul de spine-uri' },
  { topicId: '1.2', id: 'f-1.2-10', front: 'De ce a înlocuit spine-leaf three-tier în datacenter?', back: 'Trafic east-west + STP bloca legături + hopuri inegale', detail: 'Spine-leaf: L3 + ECMP, toate legăturile active, scale-out' },
  { topicId: '1.2', id: 'f-1.2-11', front: 'Formula oversubscription + exemplu', back: '(porturi × viteză) : (uplink-uri × viteză) — 48×1G / 2×10G = 2.4:1', detail: '1:1 = non-blocking' },
  { topicId: '1.2', id: 'f-1.2-12', front: 'Cum crești banda între leaf-uri?', back: 'Adaugi spine-uri', detail: 'Mai multe porturi pentru servere → adaugi leaf-uri' },
  { topicId: '1.2', id: 'f-1.2-13', front: 'Legături full mesh cu n noduri', back: 'n(n−1)/2', detail: '5 → 10 · 6 → 15 · 10 → 45' },
  { topicId: '1.2', id: 'f-1.2-14', front: 'Hub-and-spoke: trafic filială → filială', back: 'Trece prin hub', detail: 'n − 1 legături; hub = punct unic de defectare' },
  { topicId: '1.2', id: 'f-1.2-15', front: 'Single / dual-homed / multihomed / dual-multihomed', back: '1 leg.·1 ISP / 2 leg.·1 ISP / 1 leg. la fiecare din 2 ISP / 2 leg. la fiecare din 2 ISP', detail: '' },
  { topicId: '1.2', id: 'f-1.2-16', front: 'Rolurile routerelor MPLS', back: 'CE (client) · PE (marginea providerului) · P (interiorul providerului)', detail: 'Clientul vede doar PE-ul' },
  { topicId: '1.2', id: 'f-1.2-17', front: 'E-Line / E-LAN / E-Tree', back: 'Point-to-point / any-to-any / rădăcină–frunze (hub-and-spoke)', detail: 'Servicii Metro Ethernet (MEF)' },
  { topicId: '1.2', id: 'f-1.2-18', front: 'Funcțiile unui router SOHO', back: 'Router + NAT/PAT, firewall, switch, AP Wi-Fi, DHCP/DNS (+ modem/ONT)', detail: 'Un dispozitiv, multe funcții' },
  { topicId: '1.2', id: 'f-1.2-19', front: 'Cele 5 caracteristici NIST ale cloud-ului', back: 'On-demand self-service · broad network access · resource pooling · rapid elasticity · measured service', detail: 'NIST SP 800-145 (2011)' },
  { topicId: '1.2', id: 'f-1.2-20', front: 'În ce model cloud administrezi OS-ul?', back: 'IaaS', detail: 'PaaS: doar app + date; SaaS: doar date/utilizatori' },
  { topicId: '1.2', id: 'f-1.2-21', front: 'Exemple IaaS / PaaS / SaaS', back: 'AWS EC2, Azure VMs / Google App Engine, Azure App Service / Microsoft 365, Webex', detail: '' },
  { topicId: '1.2', id: 'f-1.2-22', front: 'Cele 4 modele de implementare NIST', back: 'Public · Private · Community · Hybrid', detail: 'Private poate fi și găzduit de un terț; hybrid = ≥ 2 clouduri legate' },
  { topicId: '1.2', id: 'f-1.2-23', front: 'On-prem vs cloud — cost', back: 'On-prem = CapEx · Cloud = OpEx', detail: 'Cloud: elasticitate; on-prem: control total' },
];
