import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 3.3 Rute statice IPv4/IPv6. Doar referiți (definiți în 3.1–3.2 sau mai devreme): `static-route`, `default-route`, `host-route`, `floating-static-route`, `administrative-distance`, `next-hop`, `exit-interface`, `recursive-lookup`, `gateway-of-last-resort`, `longest-prefix-match`, `link-local`, `default-gateway`, `summarization`, `ecmp`.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'network-route', abbr: 'Network route', full: 'Network route (static)', ro: 'rută de rețea',
    what: 'Rută (de obicei statică) care duce traficul către o rețea sau subrețea întreagă, identificată prin adresa de rețea și mască (sau prefix/lungime).',
    how: 'Se scrie cu adresa de rețea (biții de gazdă 0) și masca: ip route 192.168.20.0 255.255.255.0 10.0.12.2. Pentru comunicație bidirecțională, fiecare router de pe cale are nevoie de ruta spre destinație și de ruta de întoarcere spre sursă. Mai multe subrețele consecutive din spatele aceluiași next hop pot fi rezumate într-o singură rută.',
    where: 'Rețele mici, legături între site-uri, rețele în spatele unui router fără protocol dinamic.',
    layer: 'L3', aliases: ['rută de rețea', 'network static route'], topics: ['3.3'],
  },
  {
    id: 'fully-specified-route', abbr: 'Fully specified static route', full: 'Fully specified static route', ro: 'rută statică complet specificată',
    what: 'Rută statică în care se scriu atât interfața de ieșire, cât și adresa next hop: ip route 10.2.0.0 255.255.0.0 g0/1 10.1.1.2.',
    how: 'Routerul nu mai face căutare recursivă pentru a afla interfața și știe exact pe ce interfață și către ce adresă să trimită (un singur ARP/ND pentru next hop). La IPv6 este forma obligatorie atunci când next hop-ul este o adresă link-local, pentru că aceeași adresă fe80:: poate exista pe mai multe interfețe.',
    where: 'Legături Ethernet unde vrei zero ambiguitate; IPv6 cu next hop link-local.',
    layer: 'L3', aliases: ['fully specified', 'interface and next hop static route'], topics: ['3.3'],
  },
  {
    id: 'stub-network', abbr: 'Stub network', full: 'Stub network / stub router', ro: 'rețea stub (cu o singură ieșire)',
    what: 'Rețea sau router care are o singură cale către restul rețelei. Pentru el este suficientă o rută implicită.',
    how: 'Deoarece nu există alternative, nu are rost să cunoască toate rețelele externe: ruta implicită către singurul vecin trimite tot traficul necunoscut acolo. De aceea sucursalele mici cu un singur link folosesc de obicei rute statice și o implicită, fără protocol de rutare.',
    where: 'Sucursale cu un singur uplink către sediu sau ISP; marginea rețelei unei firme mici.',
    layer: 'L3', aliases: ['stub', 'rețea stub', 'stub router'], topics: ['3.3'],
  },
  {
    id: 'return-route', abbr: 'Return route', full: 'Return route', ro: 'rută de întoarcere',
    what: 'Ruta de pe routerul dinspre destinație către rețeaua sursă, necesară ca răspunsul să se întoarcă.',
    how: 'Fiecare router rutează independent, folosind propria tabelă, fiecare pachet. Cererea ping poate ajunge la destinație, dar dacă un router de pe drumul de întoarcere nu are rută către LAN-ul sursă, răspunsul se pierde și sursa vede doar „Request timed out”.',
    where: 'Orice comunicație între două rețele conectate prin rute statice.',
    layer: 'L3', aliases: ['ruta inversă', 'reverse route'], topics: ['3.3'],
  },
  {
    id: 'proxy-arp', abbr: 'Proxy ARP', full: 'Proxy ARP', ro: 'ARP prin procură',
    what: 'Funcție prin care un router răspunde la o cerere ARP în numele unei adrese aflate în altă rețea, oferind propriul MAC.',
    how: 'Dacă o stație sau un router cere prin ARP o adresă care nu e în segmentul local, routerul care știe ruta către acea adresă răspunde cu MAC-ul său și apoi retransmite traficul. Face posibil ca o rută statică scrisă doar cu interfața de ieșire pe Ethernet să funcționeze, dar umple tabela ARP (câte o intrare pe destinație) și depinde de proxy ARP activ.',
    where: 'Rute statice „directly attached” pe Ethernet; rețele vechi cu măști greșite.',
    layer: 'L2/L3', aliases: ['ARP proxy'], topics: ['3.3'],
  },
  {
    id: 'ipv6-unicast-routing', abbr: 'ipv6 unicast-routing', full: 'ipv6 unicast-routing (global command)', ro: 'comanda care activează rutarea IPv6',
    what: 'Comandă în modul de configurare globală care permite unui router Cisco să transmită pachete IPv6 și să folosească tabela de rutare IPv6.',
    how: 'Fără ea, routerul poate avea adrese IPv6 și poate comunica el însuși, dar nu retransmite pachetele altora și nu trimite Router Advertisements. Rutele ipv6 route sunt acceptate în configurație chiar și fără ea, dar rutarea nu funcționează. La IPv4, rutarea este activă implicit.',
    where: 'Orice router Cisco care trebuie să ruteze IPv6 (rute statice, OSPFv3, SLAAC către gazde).',
    layer: 'L3', aliases: ['ipv6 routing', 'rutare IPv6'], topics: ['3.3'],
  },
];
