import type { GlossaryEntry } from '../../lib/types';

// Termeni noi introduși de topicul 1.8 Configure and verify IPv6 addressing and prefix.
// ula, link-local, anycast, multicast, eui64, solicited-node aparțin lui 1.9.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'ipv6', abbr: 'IPv6', full: 'Internet Protocol version 6', ro: 'protocolul IP versiunea 6',
    what: 'Versiunea de IP cu adrese de 128 de biți (≈3,4 × 10³⁸ adrese), creată pentru a înlocui IPv4, ale cărui adrese de 32 de biți s-au epuizat.',
    how: 'Adresa se scrie ca 8 hextete hexazecimale separate prin două puncte. Antetul de bază are 40 de octeți fixi, fără checksum și fără fragmentare în routere. Hostii își pot genera singuri adresa (SLAAC) iar NAT nu mai este necesar.',
    where: 'Rețele de operatori, centre de date, rețele mobile și tot mai multe rețele casnice, de obicei în paralel cu IPv4 (dual stack).',
    std: 'RFC 8200 (STD 86)', layer: 'L3', topics: ['1.8', '1.7', '1.9'], aliases: ['IPng', 'IP Next Generation'],
  },
  {
    id: 'gua', abbr: 'GUA', full: 'Global Unicast Address', ro: 'adresă unicast globală',
    what: 'Adresă IPv6 unică în tot Internetul, rutabilă global; echivalentul adreselor publice IPv4.',
    how: 'Se alocă din blocul 2000::/3. Structura tipică: prefix global (de regulă 48 de biți, de la ISP), Subnet ID (16 biți, alegerea ta) și Interface ID (64 de biți).',
    where: 'Pe interfețele routerelor și pe hosturi care trebuie să comunice pe Internet; în exemple se folosește prefixul de documentație 2001:db8::/32.',
    std: 'RFC 4291', layer: 'L3', topics: ['1.8', '1.9'], aliases: ['adresă globală'],
  },
  {
    id: 'hextet', abbr: 'Hextet', full: 'IPv6 hextet (16-bit group)', ro: 'grup de 16 biți dintr-o adresă IPv6',
    what: 'Un grup de 16 biți dintr-o adresă IPv6, scris cu până la 4 cifre hexazecimale. Adresa are 8 hextete.',
    how: 'Zerourile de la început se pot elimina din fiecare hextet (0db8 → db8), iar o singură secvență de hextete 0 consecutive se poate înlocui cu „::”.',
    where: 'La citirea, scrierea și abrevierea adreselor; la numărarea lungimii prefixului (4 hextete = 64 de biți).',
    topics: ['1.8'], aliases: ['hexet', 'quartet', 'grup hexa'],
  },
  {
    id: 'global-routing-prefix', abbr: 'Global Routing Prefix', full: 'Global Routing Prefix', ro: 'prefix global de rutare',
    what: 'Partea din față a unei adrese IPv6 globale, alocată unei organizații de ISP; de obicei 48 de biți (/48).',
    how: 'Este identic pentru toate adresele din același site. Routerele Internetului rutează după el, nu după restul adresei.',
    where: 'Primele 3 hextete ale unei adrese ca 2001:db8:acad:1::1 (2001:db8:acad).',
    std: 'RFC 4291', layer: 'L3', topics: ['1.8'],
  },
  {
    id: 'subnet-id', abbr: 'Subnet ID', full: 'Subnet ID', ro: 'identificator de subrețea',
    what: 'Biții dintre prefixul global și Interface ID, pe care administratorul îi folosește ca să numeroteze subrețelele site-ului.',
    how: 'Dintr-un /48, Subnet ID are 16 biți (un hextet), deci 65.536 de subrețele /64. Se numără în hexazecimal: după 9 vine a.',
    where: 'Al 4-lea hextet al unei adrese dintr-un /48 (ex. „1” în 2001:db8:acad:1::/64).',
    layer: 'L3', topics: ['1.8'],
  },
  {
    id: 'interface-id', abbr: 'Interface ID', full: 'Interface Identifier (IID)', ro: 'identificator de interfață',
    what: 'Ultimii 64 de biți ai unei adrese IPv6 de LAN: identifică interfața în subrețeaua ei.',
    how: 'Poate fi configurat manual, generat din MAC (Modified EUI-64) sau generat aleatoriu. La SLAAC, hostul lipește Interface ID-ul său la prefixul primit din RA.',
    where: 'Ultimele 4 hextete ale adresei; la /64, tot ce urmează după prefix.',
    std: 'RFC 4291', layer: 'L3', topics: ['1.8', '1.9'], aliases: ['IID', 'Interface Identifier'],
  },
  {
    id: 'slaac', abbr: 'SLAAC', full: 'Stateless Address Autoconfiguration', ro: 'autoconfigurare fără stare a adresei',
    what: 'Metoda prin care un host IPv6 își construiește singur o adresă globală, fără server DHCP.',
    how: 'Hostul primește prin Router Advertisement un prefix /64 cu bitul A activ, adaugă un Interface ID propriu și verifică unicitatea cu DAD. Routerul nu ține evidența adreselor (de aceea „stateless”).',
    where: 'Aproape orice LAN IPv6; gateway-ul implicit al hostului vine tot din RA.',
    std: 'RFC 4862', layer: 'L3', topics: ['1.8', '1.9'], aliases: ['autoconfigurare'],
  },
  {
    id: 'dhcpv6', abbr: 'DHCPv6', full: 'Dynamic Host Configuration Protocol for IPv6', ro: 'DHCP pentru IPv6',
    what: 'Protocolul prin care un server poate oferi hostilor adrese IPv6 (stateful) sau doar alte informații, precum DNS (stateless).',
    how: 'Clientul trimite cererea la adresa multicast ff02::1:2. DHCPv6 nu oferă gateway implicit: acesta vine întotdeauna din Router Advertisement.',
    where: 'Rețele care vor control central asupra adreselor sau care distribuie DNS prin DHCP; completează SLAAC.',
    std: 'RFC 8415', layer: 'L7', topics: ['1.8', '4.3'],
  },
  {
    id: 'ndp', abbr: 'NDP', full: 'Neighbor Discovery Protocol', ro: 'protocolul de descoperire a vecinilor',
    what: 'Protocolul IPv6 care înlocuiește ARP și descoperirea de routere din IPv4: găsește vecini, MAC-uri, routere și prefixe.',
    how: 'Rulează peste ICMPv6 cu cinci mesaje: Router Solicitation (133), Router Advertisement (134), Neighbor Solicitation (135), Neighbor Advertisement (136) și Redirect (137).',
    where: 'Pe orice legătură IPv6: rezolvarea adresei MAC a gateway-ului, SLAAC, verificarea adreselor duplicate.',
    std: 'RFC 4861', layer: 'L3', topics: ['1.8', '1.9'], aliases: ['Neighbor Discovery'],
  },
  {
    id: 'ra', abbr: 'RA', full: 'Router Advertisement', ro: 'anunț de router',
    what: 'Mesaj NDP (ICMPv6 tip 134) trimis periodic de un router și la cerere (ca răspuns la un RS), care anunță prefixele și parametrii legăturii.',
    how: 'Conține prefixul (cu flag-urile L și A), flag-urile M și O (DHCPv6) și durata de viață ca router implicit. Hostii își iau gateway-ul din adresa sursă (link-local) a RA-ului.',
    where: 'Trimis de routerele cu ipv6 unicast-routing, pe fiecare interfață cu adresă IPv6; fără el, SLAAC nu funcționează.',
    std: 'RFC 4861', layer: 'L3', topics: ['1.8', '1.9'], aliases: ['Router Advertisement'],
  },
  {
    id: 'dad', abbr: 'DAD', full: 'Duplicate Address Detection', ro: 'detectarea adreselor duplicate',
    what: 'Verificarea prin care un host (sau router) se asigură că nimeni altcineva din legătură nu folosește deja o adresă înainte de a o activa.',
    how: 'Trimite un Neighbor Solicitation cu sursa „::” și ținta egală cu adresa verificată, către grupul solicited-node. Dacă primește un Neighbor Advertisement, adresa este duplicat și nu se folosește.',
    where: 'La activarea oricărei adrese unicast IPv6 (manuală sau SLAAC).',
    std: 'RFC 4862', layer: 'L3', topics: ['1.8', '1.9'],
  },
  {
    id: 'icmpv6', abbr: 'ICMPv6', full: 'Internet Control Message Protocol for IPv6', ro: 'ICMP pentru IPv6',
    what: 'Versiunea IPv6 a ICMP (Next Header 58); este obligatoriu în IPv6 pentru că poartă și NDP.',
    how: 'Transportă mesaje de eroare (de ex. „Packet Too Big”), ping (echo request/reply) și mesajele NDP (RS, RA, NS, NA, Redirect). Are checksum care include un pseudo-antet cu adresele.',
    where: 'ping, traceroute, descoperirea MTU-ului căii, NDP.',
    std: 'RFC 4443', layer: 'L3', topics: ['1.8', '1.9'],
  },
  {
    id: 'dual-stack', abbr: 'Dual stack', full: 'IPv4/IPv6 dual stack', ro: 'IPv4 și IPv6 simultan',
    what: 'Configurație în care o interfață sau un dispozitiv are în paralel adrese IPv4 și IPv6.',
    how: 'Hostul folosește IPv6 sau IPv4 în funcție de ce este disponibil (de regulă preferă IPv6). Comenzile IPv4 și IPv6 de pe aceeași interfață coexistă.',
    where: 'Metoda de tranziție cea mai răspândită în rețele de firmă și la operatori.',
    topics: ['1.8', '1.7'], aliases: ['dual-stack'],
  },
];
