import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.3 DHCP și DNS
export const FACTS: Fact[] = [
  { topicId: '4.3', id: 'f-4.3-01', front: 'Rolul DHCP', back: 'Atribuie automat IP, mască, gateway, DNS și alți parametri', detail: 'Lease = perioada pentru care adresa e închiriată.' },
  { topicId: '4.3', id: 'f-4.3-02', front: 'Cele patru mesaje DHCP', back: 'DORA: Discover · Offer · Request · Acknowledge', detail: 'Discover și Request sunt broadcast de la client.' },
  { topicId: '4.3', id: 'f-4.3-03', front: 'Porturile DHCP', back: 'UDP 67 (server) · UDP 68 (client)', detail: 'Discover: 0.0.0.0:68 → 255.255.255.255:67.' },
  { topicId: '4.3', id: 'f-4.3-04', front: 'Momentele de reînnoire a lease-ului', back: '50% (renew, unicast) · 87,5% (rebind, broadcast) · 100% expiră', detail: 'La expirare, clientul reia DORA.' },
  { topicId: '4.3', id: 'f-4.3-05', front: 'Lease implicit pe IOS', back: '1 zi', detail: 'Se schimbă cu comanda lease în pool.' },
  { topicId: '4.3', id: 'f-4.3-06', front: 'Ce indică o adresă 169.254.x.x?', back: 'Clientul nu a primit răspuns DHCP (APIPA / link-local)', detail: 'Verifică serverul, relay-ul, VLAN-ul, cablul.' },
  { topicId: '4.3', id: 'f-4.3-07', front: 'Opțiuni DHCP uzuale', back: '3 = gateway · 6 = DNS · 15 = domeniu · 43 = adresa WLC pentru AP-uri Cisco', detail: 'Opțiunea 150 e folosită de telefoane IP Cisco.' },
  { topicId: '4.3', id: 'f-4.3-08', front: 'Unde declari adresele excluse în IOS?', back: 'Global: ip dhcp excluded-address <de la> <până la>', detail: 'Nu în interiorul pool-ului.' },
  { topicId: '4.3', id: 'f-4.3-09', front: 'Comenzile unui pool DHCP pe IOS', back: 'ip dhcp pool N → network · default-router · dns-server · domain-name · lease', detail: 'Verificare: show ip dhcp binding / pool / conflict.' },
  { topicId: '4.3', id: 'f-4.3-10', front: 'Rolul DNS', back: 'Traduce nume în adrese IP (și invers)', detail: 'Sistem distribuit și ierarhic: root → TLD → autoritativ.' },
  { topicId: '4.3', id: 'f-4.3-11', front: 'Porturile DNS', back: 'UDP 53 pentru interogări · TCP 53 pentru răspunsuri mari și zone transfer', detail: 'Interogările obișnuite sunt UDP.' },
  { topicId: '4.3', id: 'f-4.3-12', front: 'Tipuri de înregistrări DNS', back: 'A (IPv4) · AAAA (IPv6) · CNAME (alias) · MX (e-mail) · NS · PTR (invers) · SOA', detail: 'PTR trăiește în zona in-addr.arpa.' },
  { topicId: '4.3', id: 'f-4.3-13', front: 'Interogare recursivă vs iterativă', back: 'Recursivă: „adu răspunsul final” · Iterativă: „spune cine știe mai departe”', detail: 'Clientul cere recursiv; serverul recursiv interoghează iterativ ierarhia.' },
  { topicId: '4.3', id: 'f-4.3-14', front: 'Ce este TTL-ul în DNS?', back: 'Durata (în secunde) cât răspunsul poate sta în cache', detail: 'Nu este același lucru cu TTL-ul din antetul IP.' },
  { topicId: '4.3', id: 'f-4.3-15', front: 'Ping la IP merge, la nume nu — ce suspectezi?', back: 'DNS (server greșit/inaccesibil), nu conectivitatea IP', detail: 'Testează cu ping 8.8.8.8 și nslookup.' },
  { topicId: '4.3', id: 'f-4.3-16', front: 'Comenzi IOS DNS', back: 'ip name-server · ip domain-name · ip host · no ip domain-lookup · show hosts', detail: 'no ip domain-lookup evită așteptarea la comenzi tastate greșit.' },
  { topicId: '4.3', id: 'f-4.3-17', front: 'Comenzi client Windows', back: 'ipconfig /all · /release · /renew · /displaydns · /flushdns · nslookup', detail: 'Linux/macOS: dig.' },
  { topicId: '4.3', id: 'f-4.3-18', front: 'Ce face un DHCP relay?', back: 'Transformă broadcast-ul DHCP în unicast către un server din altă subrețea (ip helper-address)', detail: 'Se configurează pe interfața dinspre clienți (4.6).' },
];
