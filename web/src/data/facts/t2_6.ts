import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.6 Arhitecturi wireless Cisco și moduri AP
export const FACTS: Fact[] = [
  { topicId: '2.6', id: 'f-2.6-01', front: 'Cele patru arhitecturi wireless Cisco', back: 'Autonomous · Lightweight + WLC · Cloud-based (Meraki) · Embedded (EWC)', detail: 'Diferă prin locul în care stă controlul.' },
  { topicId: '2.6', id: 'f-2.6-02', front: 'Autonomous AP: caracteristică principală', back: 'Fiecare AP se configurează individual; fără controller și fără CAPWAP', detail: 'Potrivit pentru foarte puține AP-uri.' },
  { topicId: '2.6', id: 'f-2.6-03', front: 'Avantajele lightweight + WLC', back: 'Configurare, RRM, securitate și roaming centralizate', detail: 'AP-urile se alătură WLC-ului prin CAPWAP.' },
  { topicId: '2.6', id: 'f-2.6-04', front: 'Cloud-based: ce trece prin cloud?', back: 'Doar managementul; traficul clienților rămâne local', detail: 'Exemplu: Cisco Meraki; licență + acces Internet.' },
  { topicId: '2.6', id: 'f-2.6-05', front: 'Ce este EWC?', back: 'Controller wireless integrat într-un AP sau switch Catalyst', detail: 'Pentru rețele mici.' },
  { topicId: '2.6', id: 'f-2.6-06', front: 'Porturile CAPWAP', back: 'UDP 5246 control (DTLS) · UDP 5247 date (DTLS opțional)', detail: 'RFC 5415; LWAPP este istoric.' },
  { topicId: '2.6', id: 'f-2.6-07', front: 'Ce înseamnă split-MAC?', back: 'Timp real pe AP; management pe WLC', detail: 'AP: beacons, ACK, criptare. WLC: autentificare, config, RRM, roaming.' },
  { topicId: '2.6', id: 'f-2.6-08', front: 'Pașii de join ai unui AP', back: 'IP (DHCP) → descoperire WLC → DTLS + join → imagine/config → Run', detail: 'Descoperire: salvat, option 43, DNS, broadcast.' },
  { topicId: '2.6', id: 'f-2.6-09', front: 'Option 43 DHCP la AP-uri Cisco', back: 'Conține adresa WLC în hexazecimal (f1 + lungime + IP)', detail: 'Exemplu: f104.c0a8.640a = 192.168.100.10.' },
  { topicId: '2.6', id: 'f-2.6-10', front: 'Modul implicit al AP-ului lightweight', back: 'Local: servește clienți, tunelează datele la WLC', detail: 'Central switching.' },
  { topicId: '2.6', id: 'f-2.6-11', front: 'FlexConnect: ce face?', back: 'Local switching și autonomie la pierderea WLC', detail: 'Port trunk; pentru sucursale/WAN lent.' },
  { topicId: '2.6', id: 'f-2.6-12', front: 'Monitor mode', back: 'AP nu servește clienți; ascultă pentru IDS, rogue și localizare', detail: 'Securitate.' },
  { topicId: '2.6', id: 'f-2.6-13', front: 'Sniffer mode', back: 'AP nu servește clienți; captează 802.11 și trimite la un analizor (Wireshark)', detail: 'Depanare.' },
  { topicId: '2.6', id: 'f-2.6-14', front: 'Rogue Detector mode', back: 'Ascultă rețeaua cablată (ARP) ca să identifice rogue APs', detail: 'Conectat la trunk, vede toate VLAN-urile.' },
  { topicId: '2.6', id: 'f-2.6-15', front: 'SE-Connect mode', back: 'Analiză de spectru (interferențe non-802.11)', detail: 'Nu servește clienți.' },
  { topicId: '2.6', id: 'f-2.6-16', front: 'Bridge / Mesh mode', back: 'Backhaul wireless: legături punct-la-punct sau mesh exterior', detail: 'Flex+Bridge: combinație.' },
  { topicId: '2.6', id: 'f-2.6-17', front: 'Port de switch pentru AP Local vs FlexConnect', back: 'Local: access · FlexConnect: trunk', detail: 'Flex termină VLAN-urile clienților local.' },
  { topicId: '2.6', id: 'f-2.6-18', front: 'Ce se întâmplă cu un AP Local dacă WLC-ul cade?', back: 'Pierde tunelul și nu mai poate servi clienți (spre deosebire de FlexConnect)', detail: 'Motivul pentru FlexConnect la sucursale.' },
  { topicId: '2.6', id: 'f-2.6-19', front: 'De ce DTLS pe tunelul de control?', back: 'Protejează chei și comenzi de management', detail: 'Criptarea tunelului de date este opțională.' },
  { topicId: '2.6', id: 'f-2.6-20', front: 'Ce poate împiedica un AP să facă join?', back: 'Fără IP/DHCP, fără rută spre WLC, UDP 5246/5247 blocate, licență', detail: 'Verifică PoE, VLAN, DHCP, ACL.' },
];
