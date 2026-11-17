import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 3.2 Decizia de transmitere. Sunt doar referiți (definiți în 3.1 sau în topicuri anterioare): `routing-table`, `administrative-distance`, `route-metric`, `route-prefix`, `next-hop`, `default-route`, `static-route`, `ecmp`, `arp`, `ttl`, `cef`, `fib`, `icmp`, `exit-interface`, `recursive-lookup`.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'longest-prefix-match', abbr: 'Longest prefix match', full: 'Longest prefix match (LPM)', ro: 'potrivirea cu cel mai lung prefix',
    what: 'Regula prin care un router, dintre toate rutele care se potrivesc cu adresa de destinație a unui pachet, o alege pe cea cu masca cea mai lungă (cea mai specifică).',
    how: 'Routerul compară adresa de destinație cu fiecare prefix, pe primii n biți (n = lungimea prefixului). Dacă mai multe rute se potrivesc, câștigă cea cu n maxim: un /32 bate un /24, care bate un /16, care bate 0.0.0.0/0. Regula e independentă de sursa rutei și de AD: o rută /24 OSPF (AD 110) bate o rută /16 statică (AD 1) pentru adresele din /24.',
    where: 'Fiecare decizie de transmitere IPv4 și IPv6; implementată în hardware prin FIB/CEF.',
    layer: 'L3', aliases: ['LPM', 'cea mai lungă potrivire', 'longest match'], topics: ['3.2'],
  },
  {
    id: 'forwarding-decision', abbr: 'Forwarding decision', full: 'Router forwarding decision', ro: 'decizia de transmitere a routerului',
    what: 'Procesul prin care routerul stabilește, pentru fiecare pachet, next hop-ul și interfața de ieșire: longest prefix match, apoi (la instalarea rutelor) AD și metrică.',
    how: 'Se aplică pe adresa IP de destinație a pachetului. Dacă nicio rută nu se potrivește, pachetul este aruncat și sursa primește ICMP destination unreachable. După decizie, routerul scade TTL, rescrie antetul L2 (MAC sursă și destinație) și transmite cadrul; adresele IP rămân neschimbate.',
    where: 'Planul de date al oricărui router sau switch L3.',
    layer: 'L3', aliases: ['forwarding', 'routing decision', 'decizie de rutare'], topics: ['3.2'],
  },
  {
    id: 'floating-static-route', abbr: 'Floating static route', full: 'Floating static route', ro: 'rută statică flotantă (rută de rezervă)',
    what: 'Rută statică la care s-a mărit intenționat AD-ul peste cel al unei alte surse (de exemplu 130 > OSPF 110), astfel încât să rămână ascunsă cât timp ruta preferată există.',
    how: 'Se configurează cu un parametru final de AD: ip route 192.168.3.0 255.255.255.0 10.0.12.2 130. Cât timp OSPF oferă același prefix (AD 110), ruta flotantă nu intră în tabelă; când OSPF dispare, ea „iese la suprafață” și preia traficul. Detaliile de configurare sunt în 3.3.',
    where: 'Rute de backup pe un uplink secundar, de exemplu un link de rezervă către alt ISP.',
    layer: 'L3', aliases: ['floating static', 'backup static route'], topics: ['3.2'],
  },
  {
    id: 'host-route', abbr: 'Host route', full: 'Host route (/32 or /128)', ro: 'rută de gazdă (/32 sau /128)',
    what: 'Rută cu masca /32 (IPv4) sau /128 (IPv6) care acoperă exact o singură adresă.',
    how: 'Fiind cea mai specifică posibilă, câștigă în fața oricărei alte rute potrivite prin longest prefix match. Rutele L din tabelă (adresele proprii ale interfețelor) sunt rute de gazdă; un administrator poate adăuga una statică pentru a trimite traficul unei singure gazde pe altă cale.',
    where: 'Rute L automate; excepții pentru o gazdă (server, loopback); rute către loopback-uri.',
    layer: 'L3', aliases: ['/32 route', 'rută /32'], topics: ['3.2'],
  },
  {
    id: 'mac-rewrite', abbr: 'L2 rewrite', full: 'Layer 2 header rewrite', ro: 'rescrierea antetului L2 la fiecare hop',
    what: 'Operația prin care, la fiecare router, cadrul Ethernet primit este desfăcut și se construiește unul nou: MAC sursă = interfața de ieșire, MAC destinație = next hop (aflat prin ARP).',
    how: 'După decizia de transmitere, routerul scade TTL cu 1, recalculează checksum-ul antetului IP și încapsulează pachetul într-un cadru nou. Adresele IP sursă și destinație nu se modifică (în afara NAT), de aceea pe tot traseul IP-urile rămân aceleași, iar MAC-urile se schimbă la fiecare hop.',
    where: 'Fiecare hop de nivel 3 dintre sursă și destinație.',
    layer: 'L2', aliases: ['MAC rewrite', 'rescriere L2'], topics: ['3.2'],
  },
];
