import type { Fact } from '../flashcards';

// Fapte esențiale pentru 3.2 Decizia de transmitere
export const FACTS: Fact[] = [
  { topicId: '3.2', id: 'f-3.2-01', front: 'Ordinea în care routerul alege o rută', back: '1) longest prefix match · 2) AD cel mai mic · 3) metrica cea mai mică', detail: 'Prefixul mai lung câștigă înaintea AD și a metricii.' },
  { topicId: '3.2', id: 'f-3.2-02', front: 'Ce este longest prefix match?', back: 'Dintre rutele care conțin destinația, se alege cea cu masca cea mai lungă', detail: '/32 > /24 > /16 > /8 > /0.' },
  { topicId: '3.2', id: 'f-3.2-03', front: 'Ruta implicită în raport cu alte rute', back: '0.0.0.0/0 se potrivește cu orice, dar are lungimea 0: se folosește doar dacă nu există nicio altă potrivire', detail: 'Nu strică rutele specifice existente.' },
  { topicId: '3.2', id: 'f-3.2-04', front: 'Ruta /24 OSPF (AD 110) vs ruta /16 statică (AD 1), destinație în /24', back: 'Câștigă /24 OSPF', detail: 'Lungimea prefixului decide înaintea AD.' },
  { topicId: '3.2', id: 'f-3.2-05', front: 'Când se compară AD?', back: 'Doar pentru același prefix și aceeași mască oferit de surse diferite', detail: 'AD mai mic câștigă.' },
  { topicId: '3.2', id: 'f-3.2-06', front: 'Când se compară metricile?', back: 'Doar între rute din același protocol către același prefix', detail: 'Metricile protocoalelor diferite nu se compară.' },
  { topicId: '3.2', id: 'f-3.2-07', front: 'Ce se întâmplă la metrici egale?', back: 'Ambele căi se instalează (ECMP) și traficul se împarte', detail: 'Egalitatea trebuie să fie exactă.' },
  { topicId: '3.2', id: 'f-3.2-08', front: 'Ce este o rută statică flotantă?', back: 'Rută statică cu AD mărit peste al protocolului (ex. 130 > 110), activă doar ca rezervă', detail: 'ip route … <next hop> 130.' },
  { topicId: '3.2', id: 'f-3.2-09', front: 'Ordinea de rezervă OSPF 110 · RIP 120 · statică flotantă 130', back: 'Se folosește OSPF; dacă dispare → RIP; dacă și RIP dispare → statica 130', detail: 'AD mai mic întâi.' },
  { topicId: '3.2', id: 'f-3.2-10', front: 'Metrica OSPF cu referința implicită', back: 'Cost = 100 Mbps ÷ bandă; FE/GE/10G = 1; sumă pe drum', detail: 'ip ospf cost schimbă costul interfeței.' },
  { topicId: '3.2', id: 'f-3.2-11', front: 'Metrica RIP', back: 'Număr de hop-uri (max 15; 16 = inaccesibil)', detail: 'Ignoră viteza legăturilor.' },
  { topicId: '3.2', id: 'f-3.2-12', front: 'Ce rută câștigă pentru 10.1.1.77 între /8, /16, /24, /26, /32?', back: 'Ruta /32 dacă există; altfel cea mai lungă din cele care conțin adresa', detail: 'Host route = cea mai specifică.' },
  { topicId: '3.2', id: 'f-3.2-13', front: 'Ce face routerul după ce alege ruta?', back: 'Scade TTL cu 1, face ARP pentru next hop, rescrie antetul L2 și trimite cadrul', detail: 'Checksum-ul antetului IP se recalculează.' },
  { topicId: '3.2', id: 'f-3.2-14', front: 'Ce rămâne neschimbat pe tot traseul (fără NAT)?', back: 'Adresele IP sursă și destinație', detail: 'MAC-urile se schimbă la fiecare hop.' },
  { topicId: '3.2', id: 'f-3.2-15', front: 'Fără nicio rută potrivită și fără rută implicită', back: 'Pachet aruncat; sursa primește ICMP destination unreachable', detail: 'În ping pe router: U.' },
  { topicId: '3.2', id: 'f-3.2-16', front: 'TTL ajunge la 0', back: 'Pachet aruncat; sursa primește ICMP time exceeded', detail: 'Mecanismul din spatele traceroute.' },
  { topicId: '3.2', id: 'f-3.2-17', front: 'Pentru ce adresă face ARP routerul?', back: 'Pentru next hop; la o rută connected, pentru destinația finală', detail: 'IP-ul destinației rămâne în pachet.' },
  { topicId: '3.2', id: 'f-3.2-18', front: 'Ce comandă arată ruta aleasă pentru o adresă?', back: 'show ip route <adresă>', detail: 'Arată sursa, AD, metrica, next hop.' },
  { topicId: '3.2', id: 'f-3.2-19', front: 'Care e diferența dintre RIB și FIB?', back: 'RIB = tabela de rutare (show ip route); FIB = copia optimizată pentru transmitere (CEF, show ip cef)', detail: 'Decizia efectivă pe pachet o ia FIB-ul.' },
  { topicId: '3.2', id: 'f-3.2-20', front: 'Ruta implicită IPv6', back: '::/0', detail: 'Aceeași logică longest prefix match în IPv6.' },
];
