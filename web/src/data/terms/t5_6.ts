import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 5.6 (ACL). `acl` (1.1), `wildcard-mask`, `access-class`, `vty`, `packet-filter` sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'ace', abbr: 'ACE', full: 'Access Control Entry', ro: 'o linie dintr-un ACL',
    what: 'O singură regulă (permit sau deny) dintr-un ACL, cu criteriile ei de potrivire: protocol, sursă, destinație, porturi.',
    how: 'Fiecare ACE are un număr de secvență (10, 20, 30…). Routerul le citește în ordine crescătoare a numărului; primul ACE care se potrivește cu pachetul decide, iar ceilalți nu mai sunt evaluați. În output-ul show access-lists, fiecare ACE are un contor de potriviri.',
    where: 'Oriunde se folosește un ACL: interfețe, linii VTY, NAT, QoS.',
    topics: ['5.6'], aliases: ['access list entry', 'linie ACL'],
  },
  {
    id: 'implicit-deny', abbr: 'Implicit deny', full: 'deny ip any any (implicit)', ro: 'refuzul implicit de la finalul ACL-ului',
    what: 'Regula invizibilă „deny ip any any” care există la sfârșitul oricărui ACL: tot ce nu s-a potrivit cu nicio linie explicită este aruncat.',
    how: 'Routerul nu o afișează în configurație. Consecință: un ACL care conține doar linii deny blochează TOT traficul; trebuie ca un permit explicit (de exemplu permit ip any any) să urmeze pentru traficul permis. Excepție: un ACL aplicat dar inexistent/gol nu filtrează nimic (permite tot).',
    where: 'Fiecare ACL IPv4/IPv6 (IPv6 mai adaugă implicit permit pentru Neighbor Discovery înaintea lui).',
    topics: ['5.6'], aliases: ['deny any implicit', 'implicit deny any'],
  },
  {
    id: 'standard-acl', abbr: 'Standard ACL', ro: 'ACL standard',
    what: 'ACL care filtrează doar după adresa IP sursă (numere 1–99 și 1300–1999, sau nume).',
    how: 'Are o singură informație de potrivire: sursa (adresă + wildcard, host sau any). Fiind grosier, se plasează cât mai aproape de destinație, ca să nu blocheze sursa către alte destinații. Sintaxa: access-list 10 permit 192.168.10.0 0.0.0.255.',
    where: 'Filtrare simplă după sursă, restricționarea accesului VTY (access-class), selecția de adrese pentru NAT.',
    topics: ['5.6'],
  },
  {
    id: 'extended-acl', abbr: 'Extended ACL', ro: 'ACL extins',
    what: 'ACL care poate potrivi protocolul, adresa sursă, adresa destinație și porturile TCP/UDP (numere 100–199 și 2000–2699, sau nume).',
    how: 'Sintaxă: permit|deny protocol sursă wildcard [port] destinație wildcard [port]. Operatori pentru porturi: eq, neq, gt, lt, range. Fiind precis, se plasează cât mai aproape de sursă, ca traficul interzis să nu traverseze rețeaua.',
    where: 'Politici de securitate pe interfețele de graniță, filtrare după serviciu (web, SSH, ICMP).',
    topics: ['5.6'],
  },
  {
    id: 'named-acl', abbr: 'Named ACL', ro: 'ACL cu nume',
    what: 'ACL identificat printr-un nume (ip access-list standard|extended NUME) în loc de un număr, cu editare comodă prin numere de secvență.',
    how: 'După comanda de creare intri într-un submod unde fiecare linie primește (sau i se atribuie manual) un număr de secvență; poți insera o linie între 10 și 20 cu „15 permit …” sau șterge o linie cu „no 20”, fără a reface tot ACL-ul.',
    where: 'Practica modernă; ACL-urile numerice pot fi editate la fel intrând cu ip access-list extended <număr>.',
    topics: ['5.6'],
  },
  {
    id: 'acl-sequence-number', abbr: 'Număr de secvență ACL', ro: 'ordinea liniilor dintr-un ACL',
    what: 'Numărul care stabilește poziția unei linii într-un ACL; implicit liniile se numerotează din 10 în 10.',
    how: 'Permite inserarea unei linii în mijlocul unui ACL existent (de exemplu 15 între 10 și 20) și ștergerea selectivă (no 20). O linie nouă fără număr se adaugă la sfârșit, DUPĂ celelalte (deci după un eventual deny ip any any explicit, unde nu mai are nicio șansă). ip access-list resequence renumerotează.',
    where: 'Editarea ACL-urilor named și a celor numerice în submodul ip access-list.',
    topics: ['5.6'], aliases: ['sequence number', 'resequence'],
  },
  {
    id: 'access-group', abbr: 'ip access-group', ro: 'aplicarea unui ACL pe o interfață',
    what: 'Comanda de interfață care leagă un ACL de o interfață și o direcție (in sau out).',
    how: 'Sintaxă: ip access-group <număr|nume> in|out. Poți avea cel mult un ACL per interfață, per direcție, per protocol (IPv4/IPv6). Un ACL creat dar neaplicat nu filtrează nimic. Pentru liniile VTY se folosește access-class, nu access-group.',
    where: 'Interfețele routerelor și ale switch-urilor L3 (inclusiv SVI).',
    topics: ['5.6'], aliases: ['ip access-group'],
  },
  {
    id: 'acl-direction', abbr: 'Direcția ACL (in/out)', ro: 'inbound și outbound',
    what: 'Sensul în care ACL-ul este evaluat față de router: inbound = pachetul intră pe interfață; outbound = pachetul iese pe interfață.',
    how: 'Inbound: verificarea are loc înainte de căutarea în tabela de rutare. Outbound: după decizia de rutare, chiar înainte de ieșire. Un ACL outbound nu filtrează pachetele generate chiar de router.',
    where: 'Parametrul final al lui ip access-group.',
    topics: ['5.6'], aliases: ['inbound', 'outbound'],
  },
  {
    id: 'established-keyword', abbr: 'established', ro: 'cuvântul-cheie „established”',
    what: 'Opțiune de ACL extended pentru TCP care potrivește doar segmentele cu flag-ul ACK sau RST setat, adică răspunsurile unei conexiuni deja pornite din interior.',
    how: 'Un ACL nu ține stare (este stateless); established este un „truc” aproximativ: permite pachetele care NU sunt SYN inițial. Nu este un firewall stateful: un atacator poate forja pachete cu ACK. Nu are echivalent pentru UDP.',
    where: 'Permiterea traficului de întoarcere TCP pe un ACL inbound dinspre exterior.',
    topics: ['5.6'],
  },
  {
    id: 'acl-remark', abbr: 'remark', ro: 'comentariu în ACL',
    what: 'Linie de comentariu într-un ACL (remark text), afișată în configurație, fără efect asupra traficului.',
    how: 'Se introduce în submodul named sau cu access-list <număr> remark text. Ajută la documentarea scopului fiecărei reguli.',
    where: 'ACL-uri lungi, întreținute de mai mulți administratori.',
    topics: ['5.6'],
  },
  {
    id: 'acl-log', abbr: 'log (ACL)', ro: 'logarea potrivirilor din ACL',
    what: 'Cuvântul-cheie log la finalul unei linii ACL: routerul generează un mesaj syslog la potrivire.',
    how: 'Mesajul (%SEC-6-IPACCESSLOGP) conține linia, sursa, destinația și numărul de pachete. Poate încărca CPU-ul dacă traficul potrivit este mare, deci se folosește selectiv, de obicei pe deny.',
    where: 'Depanare și monitorizare a încercărilor blocate.',
    topics: ['5.6'],
  },
  {
    id: 'ipv6-acl', abbr: 'ACL IPv6', ro: 'listă de acces IPv6',
    what: 'ACL pentru IPv6, mereu „named”, configurat cu ipv6 access-list și aplicat cu ipv6 traffic-filter.',
    how: 'Folosește prefixe (2001:db8:10::/64) în loc de wildcard. La finalul oricărui ACL IPv6 există, în afara lui deny ip any any implicit, două permit implicite pentru Neighbor Discovery (nd-na, nd-ns) — dacă adaugi explicit deny ipv6 any any, trebuie să permiți tu ND, altfel pierzi rezoluția adreselor.',
    where: 'Filtrare IPv6 pe interfețe; pe linii VTY se folosește ipv6 access-class.',
    topics: ['5.6', '1.8'],
  },
];
