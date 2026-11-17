import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.7 Private IPv4 addressing
export const FACTS: Fact[] = [
  { topicId: '1.7', id: 'f-1.7-01', front: 'Cele trei blocuri RFC 1918', back: '10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16', detail: 'RFC 1918 = BCP 5, februarie 1996 (a înlocuit RFC 1597, 1994).' },
  { topicId: '1.7', id: 'f-1.7-02', front: 'Intervalul blocului privat 172.16.0.0/12', back: '172.16.0.0 – 172.31.255.255', detail: '172.15.x.x și 172.32.x.x sunt publice. Mască 255.240.0.0, wildcard 0.15.255.255.' },
  { topicId: '1.7', id: 'f-1.7-03', front: 'Câte adrese are fiecare bloc privat?', back: '10/8: 16.777.216 · 172.16/12: 1.048.576 · 192.168/16: 65.536', detail: 'Total 17.891.328 de adrese, ≈0,42% din spațiul IPv4.' },
  { topicId: '1.7', id: 'f-1.7-04', front: 'Câte adrese are IPv4 în total?', back: '2³² = 4.294.967.296 (≈4,3 miliarde)', detail: 'IPv6 are 128 de biți: ≈3,4 × 10³⁸.' },
  { topicId: '1.7', id: 'f-1.7-05', front: 'Când a epuizat IANA rezerva de /8?', back: '3 februarie 2011', detail: 'Primul RIR care a atins ultimul /8: APNIC, aprilie 2011.' },
  { topicId: '1.7', id: 'f-1.7-06', front: 'Ultima alocare IPv4 din rezerva liberă RIPE NCC', back: '25 noiembrie 2019 (un /22)', detail: 'După aceea: listă de așteptare cu adrese recuperate, câte un /24 pentru LIR-uri noi.' },
  { topicId: '1.7', id: 'f-1.7-07', front: 'Trei răspunsuri la epuizarea IPv4', back: 'CIDR (1993) · adrese private + NAT (1994–96) · IPv6', detail: 'Doar IPv6 rezolvă problema de fond; celelalte amână.' },
  { topicId: '1.7', id: 'f-1.7-08', front: 'De ce nu se rutează adresele private pe Internet?', back: 'Nu sunt unice global; ISP-urile le filtrează (bogons)', detail: 'Se rutează liber în interiorul unei organizații.' },
  { topicId: '1.7', id: 'f-1.7-09', front: 'Ce face NAT?', back: 'Rescrie adresele IP (sursă la ieșire, destinație la intrare) după o tabelă de traduceri', detail: 'Rescrie și checksum-ul antetului IP.' },
  { topicId: '1.7', id: 'f-1.7-10', front: 'Static NAT vs dinamic vs PAT', back: 'Static: 1:1 fix · Dinamic: 1:1 din pool · PAT: N:1 cu port', detail: 'PAT = NAT overload; cel mai folosit (routerul de acasă).' },
  { topicId: '1.7', id: 'f-1.7-11', front: 'Inside local vs inside global', back: 'Local: adresa privată reală a hostului · Global: adresa publică sub care apare', detail: 'Outside global = adresa reală a hostului din Internet.' },
  { topicId: '1.7', id: 'f-1.7-12', front: 'Ce folosește PAT pentru ping?', back: 'ICMP Identifier (în loc de port)', detail: 'Vezi icmp 203.0.113.2:1 în show ip nat translations.' },
  { topicId: '1.7', id: 'f-1.7-13', front: 'NAT este firewall?', back: 'Nu', detail: 'Blocarea conexiunilor din exterior e un efect secundar; protecția reală e un firewall stateful.' },
  { topicId: '1.7', id: 'f-1.7-14', front: 'Ce rupe NAT?', back: 'Conectivitatea end-to-end pentru conexiuni inițiate din exterior', detail: 'Soluție: port forwarding / static NAT. Complică FTP activ, SIP, IPsec AH.' },
  { topicId: '1.7', id: 'f-1.7-15', front: '100.64.0.0/10', back: 'Shared Address Space (RFC 6598) — CGNAT, nu RFC 1918', detail: 'Interval 100.64.0.0 – 100.127.255.255; ISP ↔ routerul abonatului.' },
  { topicId: '1.7', id: 'f-1.7-16', front: 'Ce înseamnă o adresă WAN 100.64.x.x?', back: 'ISP-ul face CGNAT (NAT444): nu poți găzdui servere din exterior', detail: 'Compară adresa WAN cu cea văzută pe un site „what is my IP”.' },
  { topicId: '1.7', id: 'f-1.7-17', front: '169.254.0.0/16', back: 'Link-local / APIPA (RFC 3927) — DHCP a eșuat', detail: 'Nu este RFC 1918, nu are gateway, nu iese din segment.' },
  { topicId: '1.7', id: 'f-1.7-18', front: '127.0.0.0/8', back: 'Loopback — „eu însumi”', detail: 'ping 127.0.0.1 testează doar stiva TCP/IP locală.' },
  { topicId: '1.7', id: 'f-1.7-19', front: 'Adrese de documentație (RFC 5737)', back: '192.0.2.0/24 · 198.51.100.0/24 · 203.0.113.0/24', detail: 'TEST-NET-1/2/3; folosite în exemple și laburi.' },
  { topicId: '1.7', id: 'f-1.7-20', front: 'Echivalentul IPv6 al adreselor private', back: 'ULA — fc00::/7 (în practică fd00::/8)', detail: 'Hostii IPv6 au de regulă și adresă globală; fără NAT.' },
  { topicId: '1.7', id: 'f-1.7-21', front: 'PAT pe Cisco IOS — trei pași', back: 'ip nat inside / ip nat outside · ACL · ip nat inside source list N interface X overload', detail: 'Configurarea completă: obiectivul 4.1.' },
];
