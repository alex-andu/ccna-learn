import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.3 DHCP și DNS. `dhcp`, `dns`, `dhcp-lease`, `dns-cache`, `fqdn`, `dhcp-option-43`, `slaac`, `dhcpv6`, `udp`, `apipa` (1.6) sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'dora', abbr: 'DORA', full: 'Discover, Offer, Request, Acknowledge', ro: 'cele patru mesaje DHCP pentru obținerea unei adrese',
    what: 'Secvența de patru mesaje prin care un client DHCP obține un lease: Discover, Offer, Request, Acknowledge.',
    how: 'Clientul trimite Discover (broadcast, sursă 0.0.0.0, UDP 67); serverul răspunde cu Offer; clientul alege și trimite Request (tot broadcast); serverul confirmă cu Ack și clientul configurează adresa.',
    where: 'Oricând o gazdă pornește sau se conectează la o rețea cu DHCP; se vede în Simulation Mode din Packet Tracer sau cu o captură de pachete.',
    std: 'RFC 2131', topics: ['4.3'],
  },
  {
    id: 'dhcp-pool', abbr: 'DHCP pool', ro: 'intervalul de adrese și parametrii oferiți de un server DHCP',
    what: 'Definiția serverului DHCP pentru o subrețea: rețeaua din care se dau adrese, plus gateway, DNS, domeniu și durata lease-ului.',
    how: 'Pe IOS: ip dhcp pool NUME, apoi network, default-router, dns-server, domain-name, lease. Adresele rezervate se exclud global cu ip dhcp excluded-address.',
    where: 'Pe routere/switch-uri Cisco care funcționează ca server DHCP; pe servere dedicate se numește „scope”.',
    topics: ['4.3'],
  },
  {
    id: 'excluded-address', abbr: 'excluded-address', full: 'ip dhcp excluded-address', ro: 'adrese pe care serverul DHCP nu le oferă',
    what: 'Adrese (sau interval) pe care serverul DHCP nu le oferă niciodată, de obicei cele statice: gateway, servere, imprimante.',
    how: 'Se declară în configurarea globală, în afara pool-ului: ip dhcp excluded-address <de la> [<până la>].',
    where: 'Fără excluderi, serverul poate oferi o adresă deja folosită static, cu conflict de IP.',
    topics: ['4.3'],
  },
  {
    id: 'dhcp-relay', abbr: 'DHCP relay', full: 'DHCP relay agent', ro: 'agent care transmite cererile DHCP între subrețele',
    what: 'Funcție a unui router sau switch L3 care preia broadcast-ul DHCP al clienților și îl transformă în unicast către un server aflat în altă subrețea.',
    how: 'Se configurează pe interfața dinspre clienți cu ip helper-address <adresa serverului>; routerul adaugă adresa interfeței (giaddr) ca serverul să aleagă pool-ul potrivit. Configurarea detaliată: 4.6.',
    where: 'Rețele cu un server DHCP centralizat și mai multe VLAN-uri.',
    topics: ['4.3'],
  },
  {
    id: 'dns-resolver', abbr: 'DNS resolver', ro: 'componenta care rezolvă numele în numele clientului',
    what: 'Software sau server care primește o cerere de rezolvare și obține răspunsul: stub resolver pe gazdă și server recursiv în rețea.',
    how: 'Stub-ul verifică cache-ul și fișierul hosts, apoi întreabă serverul DNS configurat (recursiv). Acesta consultă cache-ul sau interoghează iterativ root, TLD și serverul autoritativ.',
    where: 'Pe orice gazdă; serverele recursive sunt la ISP, în firmă sau publice (de exemplu 8.8.8.8).',
    topics: ['4.3'],
  },
  {
    id: 'dns-authoritative', abbr: 'Authoritative DNS', full: 'Authoritative DNS server', ro: 'serverul DNS care deține zona unui domeniu',
    what: 'Server DNS care conține înregistrările originale ale unei zone și dă răspunsul final pentru ea.',
    how: 'Este indicat prin înregistrări NS; răspunde cu A/AAAA/MX etc. și un TTL. Nu face rezolvare recursivă pentru clienți generali.',
    where: 'Ultimul pas al rezoluției unui nume, la furnizorul de DNS al domeniului.',
    topics: ['4.3'],
  },
  {
    id: 'dns-record', abbr: 'DNS record', full: 'DNS resource record', ro: 'înregistrare DNS (A, AAAA, CNAME, MX, NS, PTR, SOA)',
    what: 'Unitatea de informație dintr-o zonă DNS: un nume, un tip, o valoare și un TTL.',
    how: 'A: nume → IPv4; AAAA: nume → IPv6; CNAME: alias; MX: server de e-mail (cu prioritate); NS: servere autoritative; PTR: adresă → nume; SOA: parametrii zonei.',
    where: 'La interogări cu nslookup/dig și la administrarea zonelor DNS.',
    std: 'RFC 1035', topics: ['4.3'],
  },
  {
    id: 'dns-ttl', abbr: 'DNS TTL', full: 'DNS Time To Live', ro: 'durata pentru care un răspuns DNS poate fi reținut în cache',
    what: 'Valoare în secunde, atașată unei înregistrări DNS, care spune cât timp poate fi păstrat răspunsul în cache.',
    how: 'După expirare, resolver-ul reface interogarea. TTL scurt = schimbări vizibile repede, dar mai mult trafic; TTL lung = invers. Nu are legătură cu TTL-ul din antetul IP.',
    where: 'La mutarea unui serviciu pe altă adresă: clienții pot vedea adresa veche până expiră TTL-ul.',
    topics: ['4.3'],
  },
  {
    id: 'dhcp-renew-rebind', abbr: 'Renew / Rebind', full: 'DHCP renewal (T1) and rebinding (T2)', ro: 'reînnoirea lease-ului la 50% și la 87,5%',
    what: 'Cele două momente la care un client încearcă să-și prelungească lease-ul: T1 (50%) Request unicast către serverul inițial; T2 (87,5%) Request broadcast către orice server.',
    how: 'Dacă reînnoirea reușește, lease-ul reîncepe; dacă expiră (100%) clientul renunță la adresă și reia DORA.',
    where: 'La depanarea adreselor care „dispar” după câteva zile sau la schimbarea configurației unui pool.',
    std: 'RFC 2131', topics: ['4.3'],
  },
];
