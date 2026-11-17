import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.1 NAT
export const FACTS: Fact[] = [
  { topicId: '4.1', id: 'f-4.1-01', front: 'Ce înseamnă „inside source NAT”?', back: 'Se traduce adresa SURSĂ a pachetelor care pleacă din rețeaua interioară spre exterior', detail: 'La întoarcere, aceeași intrare traduce destinația înapoi.' },
  { topicId: '4.1', id: 'f-4.1-02', front: 'Inside local vs inside global', back: 'Local = adresa privată a gazdei; global = adresa publică prin care e văzută', detail: 'Doar aceste două diferă în inside source NAT.' },
  { topicId: '4.1', id: 'f-4.1-03', front: 'Outside local vs outside global', back: 'Coincid în NAT-ul obișnuit (exteriorul nu e tradus)', detail: 'Ambele sunt adresa serverului din Internet.' },
  { topicId: '4.1', id: 'f-4.1-04', front: 'Trei tipuri de inside source NAT', back: 'Static (1:1 fix) · Dynamic cu pool (1:1 la cerere) · PAT/overload (mulți:1)', detail: 'PAT folosește porturi pentru a deosebi gazdele.' },
  { topicId: '4.1', id: 'f-4.1-05', front: 'Comenzi de interfață obligatorii', back: 'ip nat inside (spre LAN) · ip nat outside (spre ISP)', detail: 'Fără ele nicio traducere nu pornește.' },
  { topicId: '4.1', id: 'f-4.1-06', front: 'Sintaxa static NAT', back: 'ip nat inside source static <inside local> <inside global>', detail: 'Ordinea: întâi privata, apoi publica.' },
  { topicId: '4.1', id: 'f-4.1-07', front: 'Sintaxa pool', back: 'ip nat pool NUME <start> <end> netmask <mască>', detail: 'Capetele sunt incluse; se poate scrie și prefix-length.' },
  { topicId: '4.1', id: 'f-4.1-08', front: 'Legarea ACL ↔ pool', back: 'ip nat inside source list <ACL> pool NUME [overload]', detail: 'Fără overload: 1:1; cu overload: PAT.' },
  { topicId: '4.1', id: 'f-4.1-09', front: 'PAT pe adresa interfeței', back: 'ip nat inside source list <ACL> interface <if> overload', detail: 'Adresa publică = IP-ul interfeței outside.' },
  { topicId: '4.1', id: 'f-4.1-10', front: 'Ce rol are ACL-ul în NAT?', back: 'Selectează gazdele de tradus (permit = traduce); nu filtrează trafic', detail: 'Se scrie cu wildcard, nu mască.' },
  { topicId: '4.1', id: 'f-4.1-11', front: 'Ordinea operațiilor', back: 'Inside → outside: rutare apoi NAT · Outside → inside: NAT apoi rutare', detail: 'De aceea ruta către rețeaua privată trebuie să existe.' },
  { topicId: '4.1', id: 'f-4.1-12', front: 'Comenzi de verificare', back: 'show ip nat translations · show ip nat statistics · clear ip nat translation * · debug ip nat', detail: 'clear șterge doar traducerile dinamice.' },
  { topicId: '4.1', id: 'f-4.1-13', front: 'Cine poate iniția o conexiune către o gazdă din spatele NAT?', back: 'Doar static NAT / static PAT permit conexiuni din exterior', detail: 'PAT și pool creează intrări doar la trafic din interior.' },
  { topicId: '4.1', id: 'f-4.1-14', front: 'Ce se întâmplă când pool-ul fără overload se epuizează?', back: 'Gazdele în plus nu primesc traducere; pachetele sunt aruncate', detail: 'Soluția: overload (PAT).' },
  { topicId: '4.1', id: 'f-4.1-15', front: 'Cum arată o intrare PAT în tabelă?', back: 'tcp 203.0.113.2:1024 192.168.1.10:51000 198.51.100.5:80 198.51.100.5:80', detail: 'Aceeași adresă inside global, port global diferit per conexiune.' },
  { topicId: '4.1', id: 'f-4.1-16', front: 'Static PAT / port forwarding', back: 'ip nat inside source static tcp <ip> <port> <ip|interface> <port>', detail: 'Publică un singur port al unei singure adrese publice.' },
  { topicId: '4.1', id: 'f-4.1-17', front: 'Primul lucru de verificat când NAT nu traduce nimic', back: 'Marcajele ip nat inside/outside și ACL-ul (show access-lists)', detail: 'Apoi pool-ul, overload-ul și ruta de întoarcere la ISP.' },
];
