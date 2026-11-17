import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.6 ACL
export const FACTS: Fact[] = [
  { topicId: '5.6', id: 'f-5.6-01', front: 'Cum procesează un router un ACL?', back: 'De sus în jos; prima linie potrivită decide; la final există un deny implicit', detail: 'Ordinea liniilor contează: liniile specifice înaintea celor generale.' },
  { topicId: '5.6', id: 'f-5.6-02', front: 'Intervalele de numere ACL', back: 'Standard 1–99 și 1300–1999 · Extended 100–199 și 2000–2699', detail: 'ACL-urile named folosesc nume în loc de număr.' },
  { topicId: '5.6', id: 'f-5.6-03', front: 'Ce potrivește un ACL standard?', back: 'Doar adresa IP sursă', detail: 'Extended: protocol, sursă, destinație, porturi TCP/UDP, flag-uri.' },
  { topicId: '5.6', id: 'f-5.6-04', front: 'Unde se plasează standard și extended?', back: 'Standard: aproape de destinație · Extended: aproape de sursă', detail: 'Extended oprește traficul interzis devreme; standard e grosier și ar bloca prea mult lângă sursă.' },
  { topicId: '5.6', id: 'f-5.6-05', front: 'Wildcard mask: sens', back: '0 = bitul trebuie să fie egal · 1 = nu contează (inversul măștii)', detail: 'Exemplu: /24 → 0.0.0.255; /26 → 0.0.0.63.' },
  { topicId: '5.6', id: 'f-5.6-06', front: 'host și any', back: 'host x = x 0.0.0.0 · any = 0.0.0.0 255.255.255.255', detail: 'Se pot scrie și complet; host/any sunt prescurtări.' },
  { topicId: '5.6', id: 'f-5.6-07', front: 'Câte ACL pe o interfață?', back: 'Unul per interfață, per direcție (in/out), per protocol (IPv4/IPv6)', detail: 'Alte ACL-uri trebuie combinate în același ACL.' },
  { topicId: '5.6', id: 'f-5.6-08', front: 'Aplicarea unui ACL pe interfață și pe VTY', back: 'Interfață: ip access-group <ACL> in|out · VTY: access-class <ACL> in', detail: 'IPv6: ipv6 traffic-filter și ipv6 access-class.' },
  { topicId: '5.6', id: 'f-5.6-09', front: 'ACL doar cu deny', back: 'Blochează tot (deny implicit)', detail: 'Adaugă permit ip any any la final dacă vrei să permiți restul.' },
  { topicId: '5.6', id: 'f-5.6-10', front: 'ACL aplicat, dar inexistent/gol', back: 'Nu filtrează nimic (toate pachetele trec)', detail: 'Nu confunda cu un ACL existent, care are deny implicit.' },
  { topicId: '5.6', id: 'f-5.6-11', front: 'Cum inserezi o linie într-un ACL named?', back: 'Cu număr de secvență: ip access-list extended NUME → 15 permit …', detail: 'Fără număr, linia se adaugă la sfârșit; ștergere: no 20.' },
  { topicId: '5.6', id: 'f-5.6-12', front: 'Verificare ACL', back: 'show access-lists · show ip access-lists · show ip interface <if> · show running-config | section access', detail: 'Contoarele (N matches) arată ce linii se potrivesc.' },
  { topicId: '5.6', id: 'f-5.6-13', front: 'ACL inbound vs outbound', back: 'Inbound: înainte de rutare · Outbound: după rutare, la ieșire', detail: 'Outbound nu filtrează traficul generat de router.' },
  { topicId: '5.6', id: 'f-5.6-14', front: 'ACL stateful sau stateless?', back: 'Stateless: fiecare pachet e judecat izolat; „established” e doar o aproximare pentru TCP', detail: 'Pentru stare reală: firewall (ZBF/NGFW).' },
  { topicId: '5.6', id: 'f-5.6-15', front: 'Specificitatea liniilor', back: 'Pune întâi regulile cele mai specifice, apoi cele generale', detail: 'Un permit ip any any pus prea sus anulează deny-urile de sub el.' },
  { topicId: '5.6', id: 'f-5.6-16', front: 'ACL IPv6', back: 'ipv6 access-list NUME · prefixe, nu wildcard · ipv6 traffic-filter NUME in|out', detail: 'Au permit implicit pentru ND (nd-na/nd-ns) înaintea deny implicit.' },
  { topicId: '5.6', id: 'f-5.6-17', front: 'Ce nu filtrează un ACL outbound?', back: 'Pachetele generate de router însuși', detail: 'De exemplu ping-ul pornit din router nu e supus ACL-ului out.' },
  { topicId: '5.6', id: 'f-5.6-18', front: 'ICMP în ACL extended', back: 'permit icmp any any echo-reply · echo · ttl-exceeded · unreachable', detail: 'Dacă blochezi tot ICMP, ping și traceroute nu mai merg.' },
];
