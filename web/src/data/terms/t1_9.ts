import type { GlossaryEntry } from '../../lib/types';

// Termeni noi introduși de topicul 1.9 Describe IPv6 address types.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'unicast', abbr: 'Unicast', full: 'Unicast address', ro: 'adresă către un singur destinatar',
    what: 'Tipul de adresă care identifică o singură interfață: un pachet trimis la ea ajunge la un singur dispozitiv.',
    how: 'În IPv6 există mai multe tipuri de adrese unicast: global (GUA, 2000::/3), unique local (ULA, fc00::/7) și link-local (fe80::/10), plus adresele speciale ::1 (loopback) și :: (nespecificată).',
    where: 'Aproape tot traficul obișnuit: web, e-mail, SSH. Opusul lui multicast (către un grup) și anycast (către cel mai apropiat).',
    std: 'RFC 4291', layer: 'L3', topics: ['1.9', '1.8'],
  },
  {
    id: 'ula', abbr: 'ULA', full: 'Unique Local Address', ro: 'adresă locală unică',
    what: 'Adresă IPv6 pentru uz intern, nerutată pe Internet, din blocul fc00::/7 (în practică fd00::/8); echivalentul IPv6 al adreselor private RFC 1918.',
    how: 'Structură: prefix fd + Global ID de 40 de biți (generat pseudo-aleatoriu) + Subnet ID de 16 biți + Interface ID de 64 de biți. Global ID aleatoriu face improbabile suprapunerile între organizații.',
    where: 'Comunicare internă (management, servicii interne, laburi), adrese stabile independente de ISP; de regulă coexistă cu o adresă globală, nu se folosește NAT.',
    std: 'RFC 4193', layer: 'L3', topics: ['1.9', '1.7'], aliases: ['unique local', 'fd00::/8', 'fc00::/7'],
  },
  {
    id: 'link-local', abbr: 'Link-local', full: 'Link-local address', ro: 'adresă valabilă doar pe legătura locală',
    what: 'Adresă IPv6 din fe80::/10 (în practică fe80::/64), generată automat pe orice interfață IPv6 și valabilă doar pe legătura (segmentul) locală.',
    how: 'Nu este rutată de routere. Este folosită de NDP, ca sursă a Router Advertisement-urilor și ca gateway implicit al hostilor. Poate fi aceeași pe interfețe diferite (de exemplu fe80::1), fiind unică doar pe propria legătură.',
    where: 'Pe orice interfață IPv6; scrisă cu zonă (%interfață) pe hosturi, ex. fe80::1%12.',
    std: 'RFC 4291', layer: 'L3', topics: ['1.9', '1.8', '1.7'], aliases: ['LLA', 'fe80::/10', 'link local'],
  },
  {
    id: 'anycast', abbr: 'Anycast', full: 'Anycast address', ro: 'adresă către cel mai apropiat',
    what: 'Adresă configurată pe mai multe dispozitive; un pachet trimis la ea ajunge la cel mai apropiat dintre ele (după metrica de rutare).',
    how: 'Nu are prefix propriu: se ia din spațiul unicast și se marchează în configurare (pe Cisco cu cuvântul-cheie anycast). Fiecare subrețea are și o adresă Subnet-Router anycast (prefixul cu Interface ID zero).',
    where: 'Servicii distribuite (DNS rădăcină, CDN) și redundanță de gateway.',
    std: 'RFC 4291', layer: 'L3', topics: ['1.9'],
  },
  {
    id: 'multicast', abbr: 'Multicast', full: 'Multicast address', ro: 'adresă către un grup',
    what: 'Adresă din ff00::/8 care identifică un grup de interfețe; un pachet trimis la ea ajunge la toți membrii grupului.',
    how: 'Format: ff + 4 biți de flag-uri + 4 biți de scope + 112 biți de group ID. Scope: 1 interfață, 2 link-local, 5 site, 8 organizație, e global. Exemple: ff02::1 (toate nodurile), ff02::2 (toate routerele), ff02::5/6 (OSPF), ff02::9 (RIPng), ff02::a (EIGRP), ff02::1:2 (DHCPv6).',
    where: 'Înlocuiește broadcast-ul din IPv4: NDP, DHCPv6, protocoale de rutare, streaming.',
    std: 'RFC 4291', layer: 'L3', topics: ['1.9', '1.8'], aliases: ['ff00::/8'],
  },
  {
    id: 'solicited-node', abbr: 'Solicited-node', full: 'Solicited-node multicast address', ro: 'grup multicast al nodului solicitat',
    what: 'Grup multicast ff02::1:ffXX:XXXX, unde XX:XXXX sunt ultimii 24 de biți ai unei adrese unicast sau anycast a nodului. Fiecare nod aderă automat la grupul fiecărei adrese ale sale.',
    how: 'Neighbor Solicitation (echivalentul ARP request) este trimis la acest grup, deci aproape doar nodul căutat îl primește. Placa de rețea filtrează în hardware, folosind MAC-ul multicast 33:33:ff:XX:XX:XX.',
    where: 'Rezolvarea adresei MAC a unui vecin și DAD, pe orice legătură IPv6.',
    std: 'RFC 4291', layer: 'L3', topics: ['1.9', '1.8'], aliases: ['ff02::1:ff00:0/104'],
  },
  {
    id: 'eui64', abbr: 'EUI-64', full: 'Modified EUI-64', ro: 'Interface ID derivat din adresa MAC',
    what: 'Metoda de a construi un Interface ID de 64 de biți dintr-o adresă MAC de 48 de biți.',
    how: 'Trei pași: împarte MAC-ul în două jumătăți, inserează FFFE la mijloc și inversează al 7-lea bit (U/L, valoarea 0x02) al primului octet. Ex.: 00:11:22:33:44:55 → 0211:22ff:fe33:4455.',
    where: 'Routerele Cisco: adresa link-local automată și comanda „ipv6 address prefix/64 eui-64”. Hostii moderni folosesc de regulă identificatori aleatori (RFC 7217/8981) din motive de confidențialitate.',
    std: 'RFC 4291 (Anexa A)', layer: 'L3', topics: ['1.9', '1.8'], aliases: ['Modified EUI 64', 'EUI 64'],
  },
];
