import type { Fact } from '../flashcards';

// Fapte esențiale pentru 3.5 FHRP
export const FACTS: Fact[] = [
  { topicId: '3.5', id: 'f-3.5-01', front: 'Ce problemă rezolvă un FHRP?', back: 'Gateway-ul implicit al gazdelor nu mai este un singur punct de defecțiune', detail: 'Mai multe routere partajează o adresă IP și un MAC virtuale; gazdele nu se reconfigurează la failover.' },
  { topicId: '3.5', id: 'f-3.5-02', front: 'Ce adresă configurează gazdele ca default gateway într-un grup FHRP?', back: 'Adresa IP virtuală (nu adresa reală a unui router)', detail: 'Adresa virtuală e în aceeași subrețea cu interfețele reale.' },
  { topicId: '3.5', id: 'f-3.5-03', front: 'Cele trei FHRP-uri de cunoscut la CCNA', back: 'HSRP (Cisco) · VRRP (standard IETF) · GLBP (Cisco)', detail: 'Cerința: purpose, functions, concepts; HSRP are cea mai mare adâncime.' },
  { topicId: '3.5', id: 'f-3.5-04', front: 'Rolurile în HSRP / VRRP / GLBP', back: 'HSRP Active/Standby · VRRP Master/Backup · GLBP AVG/AVF', detail: 'AVG = Active Virtual Gateway, AVF = Active Virtual Forwarder.' },
  { topicId: '3.5', id: 'f-3.5-05', front: 'Timerele implicite HSRP', back: 'Hello 3 s · Hold 10 s', detail: 'Failover-ul durează în ordinea hold time-ului pe valorile implicite.' },
  { topicId: '3.5', id: 'f-3.5-06', front: 'Prioritatea implicită HSRP și criteriul de alegere a Active', back: 'Implicit 100 (0–255); cea mai mare prioritate, apoi cea mai mare adresă IP', detail: 'La egalitate de prioritate câștigă adresa IP cea mai mare de pe interfață.' },
  { topicId: '3.5', id: 'f-3.5-07', front: 'Preempt implicit la HSRP și VRRP', back: 'HSRP: dezactivat · VRRP: activat', detail: 'La HSRP, un router cu prioritate mai mare nu ia rolul Active fără standby <grup> preempt.' },
  { topicId: '3.5', id: 'f-3.5-08', front: 'Adrese multicast HSRP', back: 'v1: 224.0.0.2 · v2: 224.0.0.102 (UDP 1985)', detail: 'GLBP folosește tot 224.0.0.102, dar pe UDP 3222.' },
  { topicId: '3.5', id: 'f-3.5-09', front: 'Multicast și protocol VRRP', back: '224.0.0.18, protocolul IP 112 (fără UDP/TCP)', detail: 'Standard: RFC 5798.' },
  { topicId: '3.5', id: 'f-3.5-10', front: 'MAC virtual HSRPv1', back: '0000.0C07.ACxx (xx = grupul, în hexazecimal)', detail: 'Grupul 1 → 0000.0C07.AC01. HSRPv2: 0000.0C9F.Fxxx.' },
  { topicId: '3.5', id: 'f-3.5-11', front: 'MAC virtual VRRP și GLBP', back: 'VRRP 0000.5E00.01xx · GLBP 0007.B400.xxyy', detail: 'La VRRP xx = VRID; la GLBP xx = grupul, yy = numărul AVF.' },
  { topicId: '3.5', id: 'f-3.5-12', front: 'Intervalul grupurilor HSRP', back: 'v1: 0–255 · v2: 0–4095', detail: 'GLBP: 0–1023; VRRP: 1–255.' },
  { topicId: '3.5', id: 'f-3.5-13', front: 'Pot HSRPv1 și HSRPv2 să lucreze împreună?', back: 'Nu — versiunile nu interoperează', detail: 'Un mismatch de versiune poate duce la doi routere Active în același grup.' },
  { topicId: '3.5', id: 'f-3.5-14', front: 'Stările HSRP, în ordine', back: 'Initial → Learn → Listen → Speak → Standby → Active', detail: 'Doar un Active și un Standby per grup.' },
  { topicId: '3.5', id: 'f-3.5-15', front: 'Ce face standby 1 track GigabitEthernet0/1 20?', back: 'Scade prioritatea cu 20 când Gi0/1 devine down', detail: 'Pentru ca rolul să se mute, celălalt router trebuie să aibă preempt.' },
  { topicId: '3.5', id: 'f-3.5-16', front: 'Comenzile de configurare HSRP de bază (pe interfață)', back: 'standby 1 ip <vIP> · standby 1 priority <n> · standby 1 preempt', detail: 'Opțional: standby version 2, standby 1 track …' },
  { topicId: '3.5', id: 'f-3.5-17', front: 'Comanda de verificare HSRP', back: 'show standby [brief]', detail: 'Arată grup, prioritate, stare, Active, Standby și adresa virtuală.' },
  { topicId: '3.5', id: 'f-3.5-18', front: 'Cum distribui traficul cu HSRP între două routere?', back: 'Două grupuri (de exemplu pe VLAN-uri diferite) cu Active diferiți', detail: 'Fiecare router e Active pentru un grup și Standby pentru celălalt.' },
  { topicId: '3.5', id: 'f-3.5-19', front: 'Ce îl distinge pe GLBP de HSRP și VRRP?', back: 'Echilibrare nativă: AVG dă MAC-uri virtuale diferite gazdelor', detail: 'Metode: round-robin (implicit), weighted, host-dependent.' },
  { topicId: '3.5', id: 'f-3.5-20', front: 'De ce rămâne valid cache-ul ARP al gazdei după failover?', back: 'Adresa IP și MAC-ul virtuale se mută pe noul Active, neschimbate', detail: 'Gazda nu observă schimbarea; doar noul Active răspunde.' },
];
