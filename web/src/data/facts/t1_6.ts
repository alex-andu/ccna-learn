import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.6 (cifre și reguli care trebuie știute pe de rost)
export const FACTS: Fact[] = [
  { topicId: '1.6', id: 'f-1.6-01', front: 'Valorile pozițiilor într-un octet', back: '128 64 32 16 8 4 2 1', detail: 'Bitul din stânga = 128' },
  { topicId: '1.6', id: 'f-1.6-02', front: 'Cele 9 valori posibile ale unui octet de mască', back: '0 128 192 224 240 248 252 254 255', detail: 'Fiecare adaugă următoarea putere a lui 2' },
  { topicId: '1.6', id: 'f-1.6-03', front: 'Formula gazdelor utilizabile', back: '2^h − 2 (h = 32 − prefix)', detail: 'Excepții: /31 = 2 gazde, /32 = 1 adresă' },
  { topicId: '1.6', id: 'f-1.6-04', front: 'Formula numărului de subrețele', back: '2^s (s = biți împrumutați)', detail: 'Subnet zero se numără (ip subnet-zero)' },
  { topicId: '1.6', id: 'f-1.6-05', front: 'Magic number (dimensiunea blocului)', back: '256 − valoarea măștii în octetul interesant', detail: '/27 → 256 − 224 = 32' },
  { topicId: '1.6', id: 'f-1.6-06', front: '/25 /26 /27 /28 /29 /30 — gazde', back: '126 · 62 · 30 · 14 · 6 · 2', detail: 'Blocuri: 128 · 64 · 32 · 16 · 8 · 4' },
  { topicId: '1.6', id: 'f-1.6-07', front: '/20 — mască, bloc, gazde', back: '255.255.240.0 · bloc 16 în octetul 3 · 4.094 gazde', detail: 'Aceleași valori ca /28, cu un octet mai la stânga' },
  { topicId: '1.6', id: 'f-1.6-08', front: '/23 — mască și gazde', back: '255.255.254.0 · 510 gazde', detail: 'Cea mai mică subrețea pentru 255–510 gazde' },
  { topicId: '1.6', id: 'f-1.6-09', front: 'Clasele A / B / C — primul octet și mască implicită', back: 'A 1–126 /8 · B 128–191 /16 · C 192–223 /24', detail: 'D 224–239 multicast · E 240–255 rezervat' },
  { topicId: '1.6', id: 'f-1.6-10', front: 'Ce a rezolvat CIDR (1993)?', back: 'Risipa claselor fixe și creșterea tabelelor de rutare', detail: 'Prefixe de orice lungime + agregare (RFC 1518/1519, acum RFC 4632)' },
  { topicId: '1.6', id: 'f-1.6-11', front: 'Regula de aur VLSM', back: 'Alocă cele mai mari subrețele primele', detail: 'Fiecare bloc începe la un multiplu al mărimii lui' },
  { topicId: '1.6', id: 'f-1.6-12', front: 'VLSM 192.168.10.0/24 pentru 60/28/12/2', back: '.0/26 · .64/27 · .96/28 · .112/30', detail: 'Liber de la .116' },
  { topicId: '1.6', id: 'f-1.6-13', front: '/31 — câte gazde și unde', back: '2 gazde, fără rețea/broadcast — legături punct-la-punct', detail: 'RFC 3021' },
  { topicId: '1.6', id: 'f-1.6-14', front: '/32 — unde se folosește', back: 'Loopback, rută de gazdă, rutele L', detail: '255.255.255.255' },
  { topicId: '1.6', id: 'f-1.6-15', front: '169.254.0.0/16', back: 'APIPA / link-local — DHCP a eșuat', detail: 'RFC 3927, fără gateway' },
  { topicId: '1.6', id: 'f-1.6-16', front: '127.0.0.0/8', back: 'Loopback („eu însumi”)', detail: 'ping 127.0.0.1 testează doar stiva TCP/IP' },
  { topicId: '1.6', id: 'f-1.6-17', front: 'Adresele de documentație (RFC 5737)', back: '192.0.2.0/24 · 198.51.100.0/24 · 203.0.113.0/24', detail: 'TEST-NET-1/2/3' },
  { topicId: '1.6', id: 'f-1.6-18', front: 'Antetul IPv4 — lungime', back: 'minimum 20 de octeți, maximum 60', detail: 'IHL = 5…15 cuvinte de 32 de biți' },
  { topicId: '1.6', id: 'f-1.6-19', front: 'Câmpul Protocol — valori uzuale', back: '1 ICMP · 6 TCP · 17 UDP · 89 OSPF', detail: '' },
  { topicId: '1.6', id: 'f-1.6-20', front: 'Rute C vs L', back: 'C = subrețeaua conectată · L = adresa proprie /32', detail: 'Apar doar pentru interfețe up/up' },
  { topicId: '1.6', id: 'f-1.6-21', front: 'administratively down / down', back: 'Interfața are shutdown → no shutdown', detail: 'down/down = L1 · up/down = L2' },
  { topicId: '1.6', id: 'f-1.6-22', front: 'ip address fără secondary pe o interfață cu adresă', back: 'Înlocuiește adresa primară', detail: 'secondary = încă o subrețea pe aceeași interfață' },
  { topicId: '1.6', id: 'f-1.6-23', front: 'Sumarizarea 172.16.0.0/24 … 172.16.3.0/24', back: '172.16.0.0/22', detail: '4 rețele = 2² → prefix − 2' },
];
