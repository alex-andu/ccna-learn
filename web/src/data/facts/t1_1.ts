import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.1 Network components
export const FACTS: Fact[] = [
  { topicId: '1.1', id: 'f-1.1-01', front: 'Switch L2 — după ce decide și din ce învață?', back: 'Decide după MAC destinație · învață din MAC sursă', detail: 'Destinație necunoscută / broadcast → flood în VLAN. Aging implicit 300 s.' },
  { topicId: '1.1', id: 'f-1.1-02', front: 'Router — după ce decide?', back: 'IP destinație, longest prefix match în tabela de rutare', detail: 'Apoi AD (același prefix), apoi metrica. TTL − 1, cadru L2 nou.' },
  { topicId: '1.1', id: 'f-1.1-03', front: 'Ce se schimbă la fiecare router (fără NAT)?', back: 'MAC-urile (antetul L2); IP-urile rămân aceleași', detail: 'MAC = hop-by-hop, IP = end-to-end.' },
  { topicId: '1.1', id: 'f-1.1-04', front: 'Hub vs switch vs router — domenii', back: 'Hub: 1 coliziune · Switch: 1 coliziune/port, 1 broadcast/VLAN · Router: 1 broadcast/interfață', detail: '' },
  { topicId: '1.1', id: 'f-1.1-05', front: 'Evoluția comutării', back: 'Hub (L1) → Bridge (L2, software) → Switch (L2, ASIC) → Switch multilayer (L3)', detail: 'DEC LANBridge 100 (1983), Kalpana EtherSwitch (≈1990)' },
  { topicId: '1.1', id: 'f-1.1-06', front: 'Ce activează rutarea pe un switch L3?', back: 'ip routing (+ SVI: interface vlan X, sau routed port: no switchport)', detail: '' },
  { topicId: '1.1', id: 'f-1.1-07', front: 'CEF — ce două tabele folosește?', back: 'FIB + adjacency table', detail: 'Derivate din RIB (control plane); folosite de data plane. show ip cef' },
  { topicId: '1.1', id: 'f-1.1-08', front: 'Evoluția firewall-urilor', back: 'Packet filter (stateless) → Stateful → NGFW', detail: 'NGFW = stateful + AVC + IPS + malware + URL + identitate + TLS decryption' },
  { topicId: '1.1', id: 'f-1.1-09', front: 'IDS vs IPS', back: 'IDS: copie (SPAN/TAP), doar alertă · IPS: inline, blochează', detail: 'IPS adaugă latență; fail-open/bypass' },
  { topicId: '1.1', id: 'f-1.1-10', front: 'Ce face un firewall „stateful”?', back: 'Ține tabela de stare a conexiunilor și permite automat traficul de întoarcere', detail: 'Un ACL pe router este stateless.' },
  { topicId: '1.1', id: 'f-1.1-11', front: 'Talos', back: 'Echipa Cisco de threat intelligence', detail: 'Semnături IPS (Snort), reputație IP/URL/DNS' },
  { topicId: '1.1', id: 'f-1.1-12', front: 'Zonele unui firewall', back: 'inside (încredere mare) · DMZ (servere publice) · outside (Internet)', detail: '' },
  { topicId: '1.1', id: 'f-1.1-13', front: 'AP — nivel OSI și rol', back: 'L2 — bridge între 802.11 și 802.3', detail: 'Autonom: singur · Lightweight: are nevoie de WLC' },
  { topicId: '1.1', id: 'f-1.1-14', front: 'CAPWAP — porturi', back: 'UDP 5246 control (DTLS) · UDP 5247 date', detail: 'Tunel AP lightweight ↔ WLC' },
  { topicId: '1.1', id: 'f-1.1-15', front: 'Numele actual al Cisco DNA Center', back: 'Cisco Catalyst Center (din 2023)', detail: 'Design · Policy · Provision · Assurance; nu transportă trafic de utilizator' },
  { topicId: '1.1', id: 'f-1.1-16', front: 'WLC vs Catalyst Center — scop', back: 'WLC: AP-uri și WLAN-uri · Catalyst Center: toată rețeaua enterprise', detail: '' },
  { topicId: '1.1', id: 'f-1.1-17', front: '802.3af — nume și putere', back: 'PoE (Type 1) · 15.4 W la PSE · 12.95 W la PD', detail: '2003, 2 perechi, clase 0–3' },
  { topicId: '1.1', id: 'f-1.1-18', front: '802.3at — nume și putere', back: 'PoE+ (Type 2) · 30 W la PSE · 25.5 W la PD', detail: '2009, 2 perechi, clasa 4' },
  { topicId: '1.1', id: 'f-1.1-19', front: '802.3bt — Type 3 / Type 4', back: '60 W / 90 W la PSE · 51 W / 71.3 W la PD', detail: '2018, 4 perechi, clasele 5–6 / 7–8' },
  { topicId: '1.1', id: 'f-1.1-20', front: 'Cisco UPOE / UPOE+', back: 'UPOE: 60 W, proprietar (2011) · UPOE+: 90 W, compatibil 802.3bt', detail: '4 perechi' },
  { topicId: '1.1', id: 'f-1.1-21', front: 'PSE vs PD', back: 'PSE = sursa (switch, injector) · PD = consumatorul (AP, telefon, cameră)', detail: 'Endspan = switch PoE · Midspan = injector' },
  { topicId: '1.1', id: 'f-1.1-22', front: 'Etapele pornirii PoE', back: 'Detection (≈25 kΩ) → Classification → Power-up → CDP/LLDP → MPS', detail: 'Puterea se negociază prin CDP/LLDP, nu prin DHCP.' },
  { topicId: '1.1', id: 'f-1.1-23', front: 'Comenzi PoE pe interfață', back: 'power inline auto | never | static max <mW> | police', detail: 'Verificare: show power inline' },
  { topicId: '1.1', id: 'f-1.1-24', front: 'Server = ?', back: 'Un rol (oferă un serviciu), nu un tip de hardware', detail: 'Servere publice în DMZ, cu IP static' },
];
