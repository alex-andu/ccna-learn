import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.6 Configure and verify IPv4 addressing and subnetting.
// Toate rezultatele numerice au fost verificate cu lib/subnet.ts (calc).
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
const T = '1.6';
const S = '1.6';

export const Q_1_6: Question[] = [
  // ======================= binar ↔ zecimal =======================
  {
    id: '1.6-001', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['binar'],
    stem: 'Cât este în zecimal octetul binar `10101100`?',
    options: [
      { id: 'a', text: '172', correct: true, why: 'Biții aprinși au valorile 128, 32, 8 și 4. 128 + 32 + 8 + 4 = 172.' },
      { id: 'b', text: '170', correct: false, why: '170 = 10101010 (128 + 32 + 8 + 2). Ai citit penultimul bit în loc de antepenultimul.' },
      { id: 'c', text: '188', correct: false, why: '188 = 10111100 (128 + 32 + 16 + 8 + 4). Ai adăugat bitul de 16, care în `10101100` este 0.' },
      { id: 'd', text: '53', correct: false, why: '53 = 00110101 — este exact octetul citit invers (de la dreapta la stânga). Bitul cel mai din stânga are valoarea 128, nu 1.' },
    ],
    explanation: 'Valorile pozițiilor sunt 128 64 32 16 8 4 2 1. Pune-le deasupra biților și adună-le pe cele de sub care e 1.',
  },
  {
    id: '1.6-002', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['binar'],
    stem: 'Cum se scrie în binar numărul zecimal **200**?',
    options: [
      { id: 'a', text: '11001000', correct: true, why: '200 − 128 = 72 → 72 − 64 = 8 → 8 − 8 = 0. Biții aprinși: 128, 64, 8 → 11001000.' },
      { id: 'b', text: '11000100', correct: false, why: '11000100 = 128 + 64 + 4 = 196. Bitul de 8 a fost pus pe poziția lui 4.' },
      { id: 'c', text: '10101000', correct: false, why: '10101000 = 128 + 32 + 8 = 168. Ai folosit 32 în loc de 64.' },
      { id: 'd', text: '11101000', correct: false, why: '11101000 = 128 + 64 + 32 + 8 = 232. Bitul de 32 nu încape: după 128 + 64 rămâne 8, mai puțin decât 32.' },
    ],
    explanation: 'Metoda scăderii: de la stânga la dreapta, dacă valoarea poziției încape în rest, pui 1 și o scazi; altfel pui 0.',
  },
  {
    id: '1.6-003', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['binar', 'mască'],
    stem: 'Ce valoare zecimală are octetul de mască `11111000`?',
    options: [
      { id: 'a', text: '248', correct: true, why: '128 + 64 + 32 + 16 + 8 = 248. Este octetul de mască pentru 5 biți de rețea în acel octet (de exemplu /29 în ultimul octet).' },
      { id: 'b', text: '240', correct: false, why: '240 = 11110000, doar 4 biți de 1.' },
      { id: 'c', text: '252', correct: false, why: '252 = 11111100, 6 biți de 1.' },
      { id: 'd', text: '224', correct: false, why: '224 = 11100000, 3 biți de 1.' },
    ],
    explanation: 'Șirul valorilor de mască trebuie știut pe de rost: 0, 128, 192, 224, 240, 248, 252, 254, 255 — fiecare adaugă următoarea putere a lui 2.',
  },
  {
    id: '1.6-004', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['mască'],
    stem: 'Care dintre următoarele NU este o [[subnet-mask|mască de subrețea]] validă?',
    options: [
      { id: 'a', text: '255.255.255.228', correct: true, why: '228 = 11100100: după cei trei biți de 1 vine un 0 și apoi iar un 1. Biții de 1 trebuie să fie consecutivi, din stânga — 228 nu e în lista 0/128/192/224/240/248/252/254/255.' },
      { id: 'b', text: '255.255.255.248', correct: false, why: 'Validă: /29 (11111000 în ultimul octet).' },
      { id: 'c', text: '255.255.254.0', correct: false, why: 'Validă: /23. Un octet 254 urmat de 0 respectă regula „toți 1 la stânga”.' },
      { id: 'd', text: '255.255.192.0', correct: false, why: 'Validă: /18 (11000000 în al treilea octet).' },
    ],
    explanation: 'O mască este o succesiune de 1 urmată de o succesiune de 0. Orice octet care nu e una din cele 9 valori, sau un octet nenul după un octet care nu e 255, face masca invalidă. IOS respinge astfel de măști cu un mesaj „Bad mask”.',
  },
  {
    id: '1.6-005', topicId: T, sub: S, type: 'match', difficulty: 1, tags: ['mască'],
    stem: 'Potrivește fiecare prefix cu masca zecimală corespunzătoare.',
    leftLabel: 'Prefix', rightLabel: 'Mască',
    pairs: [
      { left: '/25', right: '255.255.255.128', why: '24 de biți în primii trei octeți + 1 bit în ultimul (128).' },
      { left: '/27', right: '255.255.255.224', why: '3 biți în ultimul octet: 128 + 64 + 32 = 224.' },
      { left: '/20', right: '255.255.240.0', why: '16 biți + 4 biți în al treilea octet (240); ultimul octet e 0.' },
      { left: '/30', right: '255.255.255.252', why: '6 biți în ultimul octet: 252. Rămân 2 biți de gazdă → 2 gazde.' },
    ],
    distractors: [
      { text: '255.255.255.240', why: 'Aceasta este masca /28 (4 biți în ultimul octet), nu apare în listă.' },
      { text: '255.255.224.0', why: 'Aceasta este /19 (3 biți în al treilea octet) — ușor de confundat cu /27, care are 224 în ultimul octet.' },
    ],
    explanation: 'Metoda: scade multiplii de 8 (/24 = trei octeți de 255), apoi numărul de biți rămași dă octetul parțial din șirul 128, 192, 224, 240, 248, 252, 254, 255.',
  },

  // ======================= structură, antet =======================
  {
    id: '1.6-006', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['structură'],
    stem: 'Câți biți are o adresă [[ipv4|IPv4]] și cum se scrie de obicei?',
    options: [
      { id: 'a', text: '32 de biți, ca 4 octeți zecimali separați prin puncte', correct: true, why: '4 × 8 = 32 de biți. Fiecare octet poate lua valori între 0 și 255 (dotted decimal).' },
      { id: 'b', text: '48 de biți, în hexazecimal', correct: false, why: '48 de biți în hexazecimal descrie o adresă [[mac|MAC]] (de exemplu 00:1a:2b:3c:4d:5e), nu IPv4.' },
      { id: 'c', text: '128 de biți, în 8 grupuri hexazecimale', correct: false, why: 'Aceasta este o adresă [[ipv6|IPv6]].' },
      { id: 'd', text: '64 de biți, ca 8 octeți zecimali', correct: false, why: 'IPv4 are doar 4 octeți. Un octet cu valoare peste 255 (de exemplu 192.168.256.1) este invalid.' },
    ],
    explanation: '2^32 ≈ 4,29 miliarde de adrese în total — prea puține pentru Internetul de azi, de unde NAT (1.7) și IPv6 (1.8).',
  },
  {
    id: '1.6-007', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['antet'],
    stem: 'Ce câmp din antetul IPv4 este scăzut cu 1 de fiecare router, pentru ca pachetele prinse în bucle să nu circule la nesfârșit?',
    options: [
      { id: 'a', text: '[[ttl|TTL]] (Time To Live)', correct: true, why: 'Fiecare router scade TTL-ul cu 1; la 0 aruncă pachetul și trimite un ICMP Time Exceeded. traceroute exploatează exact acest mecanism.' },
      { id: 'b', text: 'Header Checksum', correct: false, why: 'Checksum-ul se recalculează la fiecare hop (tocmai pentru că TTL-ul se schimbă), dar nu limitează durata de viață.' },
      { id: 'c', text: 'Protocol', correct: false, why: 'Protocol spune ce e în interior (1 ICMP, 6 TCP, 17 UDP). Nu se modifică pe drum.' },
      { id: 'd', text: 'Identification', correct: false, why: 'Identification leagă fragmentele aceluiași pachet. Nu are legătură cu buclele.' },
    ],
    explanation: 'Antetul IPv4 are minimum 20 de octeți. Câmpurile cele mai importante pentru CCNA: Version, TTL, Protocol, Source și Destination Address.',
  },

  // ======================= classful → CIDR =======================
  {
    id: '1.6-008', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['classful'],
    stem: 'În adresarea [[classful]] istorică, din ce clasă face parte adresa 172.32.10.5 și ce mască implicită avea?',
    options: [
      { id: 'a', text: 'Clasa B, 255.255.0.0 (/16)', correct: true, why: 'Primul octet 172 este între 128 și 191 → clasa B, mască implicită /16. (Faptul că 172.32 nu e privat — 172.16–172.31 sunt private — e altă întrebare, din 1.7.)' },
      { id: 'b', text: 'Clasa A, 255.0.0.0 (/8)', correct: false, why: 'Clasa A înseamnă primul octet 1–126.' },
      { id: 'c', text: 'Clasa C, 255.255.255.0 (/24)', correct: false, why: 'Clasa C începe de la 192.' },
      { id: 'd', text: 'Clasa B, dar privată RFC 1918', correct: false, why: 'Clasa e corectă, dar blocul privat este 172.16.0.0/12 = 172.16.0.0–172.31.255.255. 172.32.x.x este o adresă publică.' },
    ],
    explanation: 'Clasele după primul octet: A 1–126, B 128–191, C 192–223, D 224–239 (multicast), E 240–255. Clasele sunt doar istorie și vocabular, dar se întreabă.',
  },
  {
    id: '1.6-009', topicId: T, sub: S, type: 'match', difficulty: 1, tags: ['classful'],
    stem: 'Potrivește fiecare clasă istorică cu intervalul primului octet.',
    leftLabel: 'Clasă', rightLabel: 'Primul octet',
    pairs: [
      { left: 'Clasa A', right: '1 – 126', why: 'Bitul de început 0. 0 și 127 sunt rezervate („această rețea” și loopback).' },
      { left: 'Clasa B', right: '128 – 191', why: 'Biții de început 10.' },
      { left: 'Clasa C', right: '192 – 223', why: 'Biții de început 110.' },
      { left: 'Clasa D (multicast)', right: '224 – 239', why: 'Biții de început 1110; folosită pentru multicast, nu pentru gazde.' },
    ],
    distractors: [{ text: '240 – 255', why: 'Clasa E (biții 1111) — rezervată/experimentală. Nu apare în stânga.' }],
    explanation: 'Trucul: clasa e dată de câți biți de 1 sunt la început înainte de primul 0 (A: 0, B: 10, C: 110, D: 1110).',
  },
  {
    id: '1.6-010', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['cidr'],
    stem: 'Ce problemă principală a rezolvat [[cidr|CIDR]] (1993)?',
    options: [
      { id: 'a', text: 'Risipa de adrese și creșterea explozivă a tabelelor de rutare cauzate de clasele fixe', correct: true, why: 'CIDR permite prefixe de orice lungime (alocări pe măsură) și agregarea mai multor rețele într-o singură rută. RFC 1519 descrie exact aceste probleme: epuizarea clasei B și tabelele de rutare care creșteau peste puterea echipamentelor.' },
      { id: 'b', text: 'A mărit spațiul de adrese de la 32 la 128 de biți', correct: false, why: 'Aceasta este IPv6. CIDR a lucrat cu aceiași 32 de biți; a amânat epuizarea, nu a eliminat-o.' },
      { id: 'c', text: 'A introdus criptarea pachetelor IP', correct: false, why: 'Criptarea la nivel IP vine din IPsec, fără legătură cu CIDR.' },
      { id: 'd', text: 'A introdus adresele private 10/8, 172.16/12, 192.168/16', correct: false, why: 'Adresele private vin din RFC 1918 (1996), alt mecanism de economisire (topicul 1.7).' },
    ],
    explanation: 'O firmă cu 300 de calculatoare primea un clasa B (65.534 de adrese, peste 99% irosite) sau mai multe clase C, fiecare cu propria rută în Internet. CIDR i-ar da un /23 (510 gazde).',
  },

  // ======================= calcul network/broadcast/hosts =======================
  {
    id: '1.6-011', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['calcul'],
    stem: 'Care este [[network-address|adresa de rețea]] a gazdei 10.1.1.100/27?',
    options: [
      { id: 'a', text: '10.1.1.96', correct: true, why: '/27 → ultimul octet al măștii 224 → bloc 32. Multiplii: 0, 32, 64, 96, 128. 96 ≤ 100 < 128 → rețeaua 10.1.1.96.' },
      { id: 'b', text: '10.1.1.64', correct: false, why: '64 este multiplu de 32, dar nu cel mai mare ≤ 100. Subrețeaua 10.1.1.64/27 se termină la .95.' },
      { id: 'c', text: '10.1.1.0', correct: false, why: 'Ar fi rețeaua dacă prefixul ar fi /24 (sau /25). Cu /27 ultimul octet contează.' },
      { id: 'd', text: '10.1.1.100', correct: false, why: '.100 are biți de gazdă nenuli (100 − 96 = 4), deci e o adresă de gazdă, nu de rețea.' },
    ],
    explanation: 'Rețeaua 10.1.1.96/27: gazde .97–.126, broadcast .127, 30 de gazde utilizabile.',
  },
  {
    id: '1.6-012', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['calcul'],
    stem: 'Care este [[broadcast-address|adresa de broadcast]] a subrețelei din care face parte 172.16.77.200/19?',
    options: [
      { id: 'a', text: '172.16.95.255', correct: true, why: '/19 → al treilea octet al măștii 224 → bloc 32. 64 ≤ 77 < 96 → rețeaua 172.16.64.0; broadcast = 64 + 32 − 1 = 95 în octetul 3 și 255 în octetul 4.' },
      { id: 'b', text: '172.16.77.255', correct: false, why: 'Ar fi broadcast-ul pentru /24. Cu /19, granița e în al treilea octet, nu în al patrulea.' },
      { id: 'c', text: '172.16.63.255', correct: false, why: 'Acesta e broadcast-ul subrețelei anterioare (172.16.32.0/19).' },
      { id: 'd', text: '172.16.95.254', correct: false, why: 'Aceasta este ultima gazdă utilizabilă, nu broadcast-ul.' },
    ],
    explanation: 'Când octetul interesant nu e ultimul, octeții din dreapta lui devin 0 la rețea și 255 la broadcast. Subrețeaua: 172.16.64.0 – 172.16.95.255, 8.190 de gazde.',
  },
  {
    id: '1.6-013', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['calcul'],
    stem: 'Care dintre următoarele adrese poate fi atribuită unei gazde din subrețeaua 10.10.10.64/26?',
    options: [
      { id: 'a', text: '10.10.10.100', correct: true, why: 'Subrețeaua 10.10.10.64/26 se întinde de la .64 (rețea) la .127 (broadcast). Gazdele valide sunt .65–.126, deci .100 e valid.' },
      { id: 'b', text: '10.10.10.64', correct: false, why: 'Este adresa de rețea (toți biții de gazdă 0). Nu poate fi dată unei gazde.' },
      { id: 'c', text: '10.10.10.127', correct: false, why: 'Este adresa de broadcast (toți biții de gazdă 1).' },
      { id: 'd', text: '10.10.10.130', correct: false, why: 'Este o gazdă validă, dar în ALTĂ subrețea (10.10.10.128/26).' },
    ],
    explanation: '„Este X o gazdă validă?” → calculezi rețeaua și broadcast-ul; X trebuie să fie strict între ele și în același bloc.',
  },
  {
    id: '1.6-014', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['calcul'],
    stem: 'Câte gazde utilizabile are o subrețea /28?',
    options: [
      { id: 'a', text: '14', correct: true, why: '32 − 28 = 4 biți de gazdă → 2^4 = 16 adrese − 2 (rețea și broadcast) = 14.' },
      { id: 'b', text: '16', correct: false, why: '16 este numărul total de adrese. Prima și ultima nu pot fi date gazdelor.' },
      { id: 'c', text: '30', correct: false, why: '30 este pentru /27 (5 biți de gazdă).' },
      { id: 'd', text: '6', correct: false, why: '6 este pentru /29 (3 biți de gazdă).' },
    ],
    explanation: 'Gazde = 2^h − 2, h = 32 − prefix. Excepții: /31 (2 gazde, legături punct-la-punct) și /32 (o singură adresă).',
  },
  {
    id: '1.6-015', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['calcul'],
    stem: 'Un LAN are nevoie de **500** de gazde. Care este cel mai lung prefix (cea mai mică subrețea) care le acoperă?',
    options: [
      { id: 'a', text: '/23', correct: true, why: '9 biți de gazdă: 2^9 − 2 = 510 ≥ 500. Masca 255.255.254.0.' },
      { id: 'b', text: '/24', correct: false, why: '/24 oferă doar 254 de gazde.' },
      { id: 'c', text: '/22', correct: false, why: '/22 (1.022 de gazde) încape, dar risipește. Întrebarea cere cea mai mică subrețea suficientă.' },
      { id: 'd', text: '/25', correct: false, why: '/25 are doar 126 de gazde.' },
    ],
    explanation: 'Caută cel mai mic h cu 2^h − 2 ≥ N: 2^8 − 2 = 254 < 500, 2^9 − 2 = 510 ≥ 500 → h = 9 → prefix 32 − 9 = /23.',
  },
  {
    id: '1.6-016', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['calcul'],
    stem: 'Care este adresa de rețea pentru 10.200.3.4/11?',
    options: [
      { id: 'a', text: '10.192.0.0', correct: true, why: '/11 → masca 255.224.0.0, octetul interesant e al doilea, bloc 256 − 224 = 32. Multiplii lui 32: …160, 192, 224. 192 ≤ 200 < 224 → 10.192.0.0. Broadcast: 10.223.255.255.' },
      { id: 'b', text: '10.200.0.0', correct: false, why: '200 nu e multiplu de 32. Ai copiat octetul în loc să-l rotunjești în jos la multiplu de bloc.' },
      { id: 'c', text: '10.0.0.0', correct: false, why: 'Ar fi rețeaua pentru /8 (masca clasei A). Prefixul /11 merge 3 biți mai departe.' },
      { id: 'd', text: '10.224.0.0', correct: false, why: '224 > 200 — aceasta este rețeaua URMĂTOARE. Rotunjim mereu în jos.' },
    ],
    explanation: 'Metoda magic number funcționează în orice octet: găsești octetul în care masca nu e 255 sau 0, iar dimensiunea blocului e 256 minus valoarea măștii din acel octet.',
  },
  {
    id: '1.6-017', topicId: T, sub: S, type: 'multi', difficulty: 2, tags: ['calcul'],
    stem: 'Care DOUĂ adrese sunt în aceeași subrețea cu 172.16.17.30/20?',
    options: [
      { id: 'a', text: '172.16.28.15', correct: true, why: '/20 → bloc 16 în al treilea octet. 16 ≤ 28 < 32 → aceeași rețea 172.16.16.0/20 (exemplul clasic din documentația Cisco).' },
      { id: 'b', text: '172.16.31.254', correct: true, why: 'Rețeaua 172.16.16.0/20 se termină la 172.16.31.255. .31.254 este ultima gazdă utilizabilă.' },
      { id: 'c', text: '172.16.32.1', correct: false, why: '32 este începutul blocului următor: 172.16.32.0/20.' },
      { id: 'd', text: '172.16.15.255', correct: false, why: 'Este broadcast-ul subrețelei anterioare, 172.16.0.0/20 (0–15).' },
    ],
    explanation: '172.16.17.30/20 → rețeaua 172.16.16.0, broadcast 172.16.31.255. Orice adresă cu al treilea octet 16–31 (și nu rețea/broadcast) e în aceeași subrețea.',
  },
  {
    id: '1.6-018', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['calcul'],
    stem: 'Care este ultima gazdă utilizabilă din subrețeaua lui 192.168.5.130/26?',
    options: [
      { id: 'a', text: '192.168.5.190', correct: true, why: '/26 → bloc 64. 128 ≤ 130 < 192 → rețea .128, broadcast .191, ultima gazdă .190.' },
      { id: 'b', text: '192.168.5.191', correct: false, why: '.191 este broadcast-ul.' },
      { id: 'c', text: '192.168.5.254', correct: false, why: 'Ar fi ultima gazdă cu /24 (sau a subrețelei .192/26).' },
      { id: 'd', text: '192.168.5.126', correct: false, why: 'Este ultima gazdă a subrețelei anterioare (.64/26).' },
    ],
    explanation: 'Ultima gazdă = broadcast − 1; broadcast = următoarea rețea − 1. Rețeaua următoare după .128/26 este .192.',
  },
  {
    id: '1.6-019', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['calcul'],
    stem: 'Un PC are 192.168.1.75 cu masca 255.255.255.248. Care sunt adresa de rețea și broadcast-ul?',
    options: [
      { id: 'a', text: '192.168.1.72 și 192.168.1.79', correct: true, why: '248 → /29, bloc 8. Multiplii: …64, 72, 80. 72 ≤ 75 < 80 → rețea .72, broadcast .79, gazde .73–.78.' },
      { id: 'b', text: '192.168.1.64 și 192.168.1.79', correct: false, why: '.64 ar fi rețeaua cu bloc 16 (/28). Rețeaua și broadcast-ul trebuie să fie din același bloc.' },
      { id: 'c', text: '192.168.1.75 și 192.168.1.80', correct: false, why: '.75 e o gazdă, iar .80 e rețeaua următoare.' },
      { id: 'd', text: '192.168.1.72 și 192.168.1.255', correct: false, why: '.255 ar fi broadcast-ul pentru /24. Cu /29, broadcast-ul e rețea + 8 − 1.' },
    ],
    explanation: 'Verificare rapidă: rețeaua e pară (multiplu de bloc), broadcast-ul e impar, iar distanța dintre ele e bloc − 1 (79 − 72 = 7).',
  },
  {
    id: '1.6-020', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['mască'],
    stem: 'Care este [[wildcard-mask|wildcard mask]]-ul corespunzător prefixului /26?',
    options: [
      { id: 'a', text: '0.0.0.63', correct: true, why: 'Masca /26 este 255.255.255.192. Wildcard = 255 − fiecare octet: 0.0.0.(255 − 192) = 0.0.0.63.' },
      { id: 'b', text: '0.0.0.64', correct: false, why: '64 este dimensiunea blocului. Wildcard-ul este bloc − 1.' },
      { id: 'c', text: '255.255.255.192', correct: false, why: 'Aceasta este masca de subrețea, nu inversul ei.' },
      { id: 'd', text: '0.0.0.192', correct: false, why: 'Ai copiat ultimul octet al măștii în loc să-l scazi din 255.' },
    ],
    explanation: 'Wildcard-ul se folosește în ACL-uri și în comanda `network` OSPF, nu în `ip address`. Regula: wildcard = bloc − 1 în octetul interesant.',
  },
  {
    id: '1.6-021', topicId: T, sub: S, type: 'order', difficulty: 2, tags: ['magic'],
    stem: 'Ordonează pașii metodei „magic number” pentru a afla subrețeaua unei adrese IP/prefix.',
    items: [
      { text: 'Scrie masca în zecimal și găsește octetul „interesant” (nici 255, nici 0)', why: 'De exemplu /19 → 255.255.224.0 → octetul 3 (224).' },
      { text: 'Calculează dimensiunea blocului: 256 − valoarea măștii din acel octet', why: '256 − 224 = 32. Subrețelele încep la 0, 32, 64, 96…' },
      { text: 'Găsește cel mai mare multiplu al blocului ≤ valoarea IP-ului în acel octet → adresa de rețea', why: 'Octeții din stânga se copiază, cei din dreapta devin 0.' },
      { text: 'Broadcast = rețea + bloc − 1 în acel octet, iar octeții din dreapta devin 255', why: 'Echivalent: următoarea rețea − 1.' },
      { text: 'Prima gazdă = rețea + 1, ultima gazdă = broadcast − 1', why: 'Abia acum ai intervalul complet de gazde utilizabile.' },
    ],
    explanation: 'Cu exercițiu, metoda devine mentală: 5–10 secunde pe întrebare. Exersează la nesfârșit în drill-ul de pe pagina Subnetting.',
  },

  // ======================= FLSM / VLSM =======================
  {
    id: '1.6-022', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['flsm'],
    stem: 'Rețeaua 192.168.1.0/24 este împărțită ([[flsm|FLSM]]) în 4 subrețele egale. Care este a TREIA subrețea?',
    options: [
      { id: 'a', text: '192.168.1.128/26', correct: true, why: '4 subrețele = 2 biți împrumutați → /26, bloc 64: .0, .64, .128, .192. A treia este .128/26 (gazde .129–.190).' },
      { id: 'b', text: '192.168.1.96/27', correct: false, why: '/27 ar da 8 subrețele, nu 4.' },
      { id: 'c', text: '192.168.1.64/26', correct: false, why: 'Aceasta este a doua subrețea (prima e .0/26).' },
      { id: 'd', text: '192.168.1.192/26', correct: false, why: 'Aceasta este a patra (ultima).' },
    ],
    explanation: 'Subrețele = 2^s (s = biți împrumutați). Subrețeaua zero (.0) se numără — e folosibilă pe IOS modern (`ip subnet-zero` activ implicit).',
  },
  {
    id: '1.6-023', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['flsm'],
    stem: 'Câte subrețele obții dintr-un /24 dacă folosești masca /27?',
    options: [
      { id: 'a', text: '8', correct: true, why: '27 − 24 = 3 biți împrumutați → 2^3 = 8 subrețele, fiecare cu 30 de gazde.' },
      { id: 'b', text: '6', correct: false, why: '6 = 2^3 − 2, regula veche care excludea subrețeaua zero și pe cea cu toți biții 1. Cisco și examenul actual le numără pe toate.' },
      { id: 'c', text: '30', correct: false, why: '30 este numărul de gazde per subrețea, nu de subrețele.' },
      { id: 'd', text: '32', correct: false, why: '32 este dimensiunea blocului (adrese per subrețea).' },
    ],
    explanation: 'Nu confunda formulele: subrețele = 2^(biți împrumutați), gazde = 2^(biți de gazdă) − 2.',
  },
  {
    id: '1.6-024', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['vlsm'],
    stem: 'Împarți 192.168.10.0/24 cu [[vlsm|VLSM]] pentru LAN-uri de 60, 28 și 12 gazde plus o legătură WAN de 2 gazde, alocând de la cel mai mare la cel mai mic, fără găuri. Ce subrețea primește LAN-ul de 12 gazde?',
    options: [
      { id: 'a', text: '192.168.10.96/28', correct: true, why: '60 → /26 la .0 (până la .63); 28 → /27 la .64 (până la .95); 12 → /28 (14 gazde) la .96 (gazde .97–.110, broadcast .111).' },
      { id: 'b', text: '192.168.10.64/28', correct: false, why: '.64 este ocupat de LAN-ul de 28 de gazde (/27, .64–.95), alocat înainte.' },
      { id: 'c', text: '192.168.10.96/29', correct: false, why: 'Un /29 are doar 6 gazde — prea puțin pentru 12.' },
      { id: 'd', text: '192.168.10.112/28', correct: false, why: 'Este aliniat corect, dar lasă gaura .96–.111 nefolosită. Primul bloc liber de 16 este .96.' },
    ],
    explanation: 'Planul complet: .0/26, .64/27, .96/28, .112/30 (WAN: .113 și .114). De la .116 la .255 rămâne liber pentru creștere.',
  },
  {
    id: '1.6-025', topicId: T, sub: S, type: 'order', difficulty: 2, tags: ['vlsm'],
    stem: 'Ordonează pașii unui plan VLSM corect.',
    items: [
      { text: 'Listează toate subrețelele necesare și numărul de gazde al fiecăreia (inclusiv legăturile WAN)', why: 'Fără inventar complet, planul va trebui refăcut.' },
      { text: 'Sortează cerințele descrescător', why: 'Blocurile mari se aliniază primele, fără găuri.' },
      { text: 'Pentru fiecare, alege cel mai mic h cu 2^h − 2 ≥ gazde → prefix = 32 − h', why: 'Exemplu: 28 de gazde → h = 5 (30) → /27.' },
      { text: 'Plasează blocul la prima adresă liberă care este multiplu al mărimii lui', why: 'Un /27 poate începe doar la multipli de 32.' },
      { text: 'Calculează rețeaua, intervalul de gazde și broadcast-ul și verifică să nu existe suprapuneri', why: 'Documentezi tabelul de adresare; IOS ar refuza oricum o suprapunere pe același router.' },
    ],
    explanation: 'Regula de aur din documentația Cisco: „assign the largest first”. Încearcă alocatorul interactiv din lecție cu ordinea inversă și vezi găurile.',
  },
  {
    id: '1.6-026', topicId: T, sub: S, type: 'multi', difficulty: 2, tags: ['vlsm'],
    stem: 'De ce se alocă subrețelele VLSM de la cea mai mare la cea mai mică? (alege DOUĂ)',
    options: [
      { id: 'a', text: 'Fiecare bloc trebuie să înceapă la un multiplu al propriei dimensiuni; blocurile mari puse primele rămân aliniate fără găuri', correct: true, why: 'După un /26 (64), următoarea adresă (.64) e multiplu și de 32, și de 16, și de 4 — orice bloc mai mic se potrivește imediat.' },
      { id: 'b', text: 'Spațiul liber rămâne la final într-o singură bucată contiguă, ușor de folosit și de sumarizat', correct: true, why: 'Exemplul din lecție: totul liber de la .116 la .255.' },
      { id: 'c', text: 'Routerele cer ca subrețelele mari să aibă adresele cele mai mici', correct: false, why: 'Routerele nu au o asemenea cerință; ordinea e o tehnică de planificare, nu o regulă de protocol.' },
      { id: 'd', text: 'Altfel subrețelele mici ar primi o mască greșită', correct: false, why: 'Masca depinde doar de numărul de gazde, nu de ordinea alocării. Ordinea afectează doar poziția.' },
    ],
    explanation: 'Dacă pui /30 la .0, un /26 nu poate începe la .4 — trebuie să sară la .64, lăsând o gaură de 60 de adrese.',
  },
  {
    id: '1.6-027', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['vlsm'],
    stem: 'Un coleg a alocat deja 192.168.10.0/30 pentru o legătură WAN. Acum vrea un /26 pentru un LAN de 60 de gazde, cât mai jos posibil în 192.168.10.0/24. Unde poate începe?',
    options: [
      { id: 'a', text: '192.168.10.64', correct: true, why: 'Un /26 (bloc 64) poate începe doar la .0, .64, .128 sau .192. .0 e ocupat parțial de /30, deci primul start legal e .64. Adresele .4–.63 rămân o gaură.' },
      { id: 'b', text: '192.168.10.4', correct: false, why: '.4 nu este multiplu de 64. 192.168.10.4 cu masca /26 ar avea, de fapt, rețeaua .0 — care se suprapune cu /30.' },
      { id: 'c', text: '192.168.10.8', correct: false, why: 'Tot nealiniat: rețeaua lui .8/26 este .0/26.' },
      { id: 'd', text: '192.168.10.32', correct: false, why: '.32 e multiplu de 32, nu de 64. Ar fi start valid pentru un /27, nu pentru un /26.' },
    ],
    explanation: 'Acesta este exact motivul pentru care VLSM se face descrescător. Reparație: mută WAN-ul după LAN-uri (de exemplu .112/30).',
  },

  // ======================= /31, /32, speciale =======================
  {
    id: '1.6-028', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['/31'],
    stem: 'Ce este adevărat despre un prefix /31 configurat pe o legătură între două routere?',
    options: [
      { id: 'a', text: 'Ambele adrese sunt adrese de gazdă (fără rețea și broadcast), conform RFC 3021 — economisește jumătate din adrese față de /30', correct: true, why: 'Pe o legătură [[point-to-point]] nu e nevoie de broadcast direcționat. RFC 3021 interpretează cele 2 adrese ca gazde.' },
      { id: 'b', text: 'Nu are nicio gazdă utilizabilă (2 − 2 = 0), deci e invalid', correct: false, why: 'Formula 2^h − 2 nu se aplică la /31. IOS acceptă /31 pe legături punct-la-punct (cu un avertisment pe unele platforme).' },
      { id: 'c', text: 'Are 2 gazde, dar și o adresă de broadcast separată', correct: false, why: 'Un /31 are în total doar 2 adrese — ambele sunt gazde. Nu rămâne loc pentru broadcast.' },
      { id: 'd', text: 'Se folosește pentru interfețele Loopback', correct: false, why: 'Loopback-urile folosesc /32 (o singură adresă).' },
    ],
    explanation: '/30 = 4 adrese (2 gazde + rețea + broadcast). /31 = 2 adrese, ambele gazde, doar pe legături punct-la-punct. /32 = o adresă (loopback, rută de gazdă).',
  },
  {
    id: '1.6-029', topicId: T, sub: S, type: 'single', difficulty: 1, tags: ['/32'],
    stem: 'Unde folosești de obicei o mască 255.255.255.255 (/32)?',
    options: [
      { id: 'a', text: 'Pe o interfață Loopback a routerului sau ca rută către o singură gazdă', correct: true, why: 'Un /32 identifică exact o adresă. Loopback-ul (vezi [[loopback]]) nu are vecini, deci nu are nevoie de subrețea.' },
      { id: 'b', text: 'Pe interfața LAN spre PC-uri', correct: false, why: 'Un /32 nu lasă loc pentru alte gazde: PC-urile n-ar avea în aceeași subrețea nicio adresă, nici gateway.' },
      { id: 'c', text: 'Pe o legătură WAN între două routere', correct: false, why: 'O legătură cu doi capete are nevoie de cel puțin 2 adrese: /30 sau /31.' },
      { id: 'd', text: 'Ca rută implicită', correct: false, why: 'Ruta implicită este 0.0.0.0/0 — opusul complet: prefix de lungime 0, se potrivește cu orice destinație.' },
    ],
    explanation: 'Rutele L din tabela de rutare sunt tot /32: adresa proprie a fiecărei interfețe.',
  },
  {
    id: '1.6-030', topicId: T, sub: S, type: 'match', difficulty: 2, tags: ['speciale'],
    stem: 'Potrivește fiecare adresă sau bloc special cu rolul lui.',
    leftLabel: 'Rol', rightLabel: 'Adresă / bloc',
    pairs: [
      { left: '„Eu însumi” — traficul nu părăsește dispozitivul', right: '127.0.0.1', why: 'Loopback, din 127.0.0.0/8. `ping 127.0.0.1` testează doar stiva TCP/IP locală.' },
      { left: 'Auto-configurare când DHCP nu răspunde', right: '169.254.0.0/16', why: '[[apipa|APIPA]] / link-local (RFC 3927). Fără gateway.' },
      { left: 'Broadcast limitat la segmentul local, nu trece de router', right: '255.255.255.255', why: 'Limited broadcast. DHCP DISCOVER îl folosește ca destinație.' },
      { left: 'Multicast (fostă clasă D)', right: '224.0.0.0/4', why: '224–239 în primul octet. Exemplu: 224.0.0.5 — routerele OSPF.' },
      { left: 'Rută implicită (se potrivește cu orice destinație)', right: '0.0.0.0/0', why: 'Prefix de lungime 0. Diferit de 0.0.0.0/8 („această rețea”).' },
    ],
    distractors: [
      { text: '10.0.0.0/8', why: 'Bloc privat [[rfc1918|RFC 1918]] — reutilizabil în orice rețea internă, dar nu corespunde niciunui rol din listă (topicul 1.7).' },
      { text: '192.0.2.0/24', why: 'TEST-NET-1, rezervat pentru documentație și exemple (RFC 5737).' },
    ],
    explanation: 'Adresele speciale nu se atribuie gazdelor obișnuite. Lista autoritară este registrul IANA IPv4 Special-Purpose.',
  },
  {
    id: '1.6-031', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['speciale'],
    stem: 'Un utilizator raportează că nu are Internet. `ipconfig` arată IPv4 169.254.33.7, mască 255.255.0.0, fără default gateway. Care este cauza cea mai probabilă?',
    options: [
      { id: 'a', text: 'PC-ul nu a primit răspuns de la un server [[dhcp|DHCP]] și și-a dat singur o adresă APIPA', correct: true, why: '169.254.x.x/16 fără gateway = semnătura APIPA. Verifică cablul/Wi-Fi-ul, VLAN-ul portului, serverul DHCP sau `ip helper-address` pe router.' },
      { id: 'b', text: 'Serverul DNS este oprit', correct: false, why: 'O problemă DNS nu schimbă adresa IP; ai avea o adresă normală și ping la IP-uri ar merge.' },
      { id: 'c', text: 'Administratorul a configurat static o adresă privată', correct: false, why: '169.254.0.0/16 nu este un bloc RFC 1918 și nu se configurează manual în mod normal.' },
      { id: 'd', text: 'Gateway-ul este într-o altă subrețea', correct: false, why: 'Aici nu există deloc gateway — exact ce face APIPA.' },
    ],
    explanation: 'Reflex de depanare: 169.254 = „DHCP a eșuat”. Detaliat în 1.10 (Client OS) și 4.3 (DHCP).',
  },
  {
    id: '1.6-032', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['sumarizare'],
    stem: 'Ce rută rezumă exact rețelele 172.16.0.0/24, 172.16.1.0/24, 172.16.2.0/24 și 172.16.3.0/24?',
    options: [
      { id: 'a', text: '172.16.0.0/22', correct: true, why: 'Al treilea octet: 0–3 = 000000|00 … 000000|11. Primii 16 + 6 = 22 de biți sunt comuni → /22 (255.255.252.0), exact 4 × /24.' },
      { id: 'b', text: '172.16.0.0/16', correct: false, why: 'Include cele 4 rețele, dar și alte 252 de /24 care nu sunt ale tale — prea larg.' },
      { id: 'c', text: '172.16.0.0/23', correct: false, why: '/23 acoperă doar 172.16.0.0–172.16.1.255 (două /24).' },
      { id: 'd', text: '172.16.0.0/21', correct: false, why: '/21 acoperă 8 × /24 (0–7), dublu față de necesar.' },
    ],
    explanation: '[[summarization|Sumarizarea]] curată: numărul de rețele e putere a lui 2 (4 = 2^2 → prefix 24 − 2 = 22) și prima rețea e multiplu de 4 în octetul respectiv.',
  },

  // ======================= configurare și verificare IOS =======================
  {
    id: '1.6-033', topicId: T, sub: S, type: 'cli', difficulty: 1, tags: ['ios'],
    stem: 'Ești pe interfața G0/0 a routerului. Configurează adresa **192.168.10.1/26** (în IOS clasic masca se dă în zecimal).',
    prompt: 'R1(config-if)#', canonical: 'ip address 192.168.10.1 255.255.255.192',
    answers: ['ip address 192.168.10.1 255.255.255.192', 'ip add 192.168.10.1 255.255.255.192', 'ip addr 192.168.10.1 255.255.255.192', 'ip addre 192.168.10.1 255.255.255.192', 'ip ad 192.168.10.1 255.255.255.192'],
    hint: 'ip address <adresă> <mască zecimală>',
    wrong: [
      { text: 'ip address 192.168.10.1/26', why: 'IOS-ul clasic (și Packet Tracer) cere masca în format zecimal: 255.255.255.192.' },
      { text: 'ip address 192.168.10.1 255.255.255.224', why: '255.255.255.224 este /27, nu /26.' },
      { text: 'ip address 192.168.10.0 255.255.255.192', why: '.0 este adresa de rețea a subrețelei — IOS o refuză cu „Bad mask /26 for address…”.' },
    ],
    explanation: 'După `ip address` nu uita `no shutdown`: interfețele de router sunt oprite implicit.',
  },
  {
    id: '1.6-034', topicId: T, sub: S, type: 'cli', difficulty: 1, tags: ['ios'],
    stem: 'Interfața are adresă, dar `show ip interface brief` o arată „administratively down”. Ce comandă dai în modul interfață?',
    prompt: 'R1(config-if)#', canonical: 'no shutdown',
    answers: ['no shutdown', 'no shut', 'no shu', 'no sh', 'no shutd'],
    hint: 'negația comenzii care oprește interfața',
    wrong: [
      { text: 'enable', why: '`enable` intră în modul privileged EXEC; nu pornește interfețe.' },
      { text: 'shutdown', why: 'Exact invers: `shutdown` oprește administrativ interfața.' },
      { text: 'interface up', why: 'Nu există o asemenea comandă în IOS.' },
    ],
    explanation: 'Pe routere, interfețele sunt implicit `shutdown`. Pe switch-urile Catalyst porturile fizice sunt implicit active, dar SVI-urile (`interface vlan 1`) pot fi oprite.',
  },
  {
    id: '1.6-035', topicId: T, sub: S, type: 'cli', difficulty: 2, tags: ['ios'],
    stem: 'Ce comandă din privileged EXEC afișează într-un tabel scurt toate interfețele, cu adresa IP, metoda și starea Status/Protocol?',
    prompt: 'R1#', canonical: 'show ip interface brief',
    answers: ['show ip interface brief', 'sh ip int br', 'sh ip int brief', 'show ip int brief', 'show ip int br', 'sh ip interface brief', 'sh ip int bri', 'show ip interface br'],
    hint: 'show ip … brief',
    wrong: [
      { text: 'show interfaces', why: 'Afișează detalii complete (contoare, erori, MTU) pentru fiecare interfață — mult text, nu tabelul scurt.' },
      { text: 'show ip interface', why: 'Varianta detaliată: prefix, secondary, ACL-uri, helper — fără „brief” nu e un tabel.' },
      { text: 'show running-config', why: 'Arată configurația, nu starea operațională (up/down).' },
    ],
    explanation: '`show ip interface brief` nu afișează masca și nici adresele secondary. Pentru ele: `show ip interface` sau `show running-config interface`.',
  },
  {
    id: '1.6-036', topicId: T, sub: S, type: 'cli', difficulty: 3, tags: ['ios'],
    stem: 'G0/1 are deja 192.168.10.65/27. Adaugă ÎN PLUS subrețeaua 192.168.10.96/28, cu routerul pe prima adresă utilizabilă, fără să înlocuiești adresa existentă.',
    prompt: 'R1(config-if)#', canonical: 'ip address 192.168.10.97 255.255.255.240 secondary',
    answers: ['ip address 192.168.10.97 255.255.255.240 secondary', 'ip add 192.168.10.97 255.255.255.240 secondary', 'ip addr 192.168.10.97 255.255.255.240 secondary', 'ip address 192.168.10.97 255.255.255.240 sec', 'ip add 192.168.10.97 255.255.255.240 sec', 'ip address 192.168.10.97 255.255.255.240 second'],
    hint: 'aceeași comandă, plus un cuvânt-cheie la final',
    wrong: [
      { text: 'ip address 192.168.10.97 255.255.255.240', why: 'Fără `secondary`, comanda ÎNLOCUIEȘTE adresa primară .65/27 — LAN-ul existent ar rămâne fără gateway.' },
      { text: 'ip address 192.168.10.96 255.255.255.240 secondary', why: '.96 este adresa de rețea a /28 — refuzată.' },
      { text: 'ip address 192.168.10.97 255.255.255.224 secondary', why: 'Cu masca /27, subrețeaua devine 192.168.10.96/27 (.96–.127), nu /28-ul cerut: ocupi dublu de adrese și intri peste blocul următor din plan (.112/30).' },
    ],
    explanation: '`secondary` adaugă încă o subrețea pe aceeași interfață (de exemplu când un LAN a crescut). Apar câte o pereche de rute C + L pentru fiecare adresă.',
  },
  {
    id: '1.6-037', topicId: T, sub: S, type: 'cli', difficulty: 2, tags: ['ios'],
    stem: 'Ce comandă afișează doar rutele direct conectate (C) și locale (L) din tabela de rutare?',
    prompt: 'R1#', canonical: 'show ip route connected',
    answers: ['show ip route connected', 'sh ip route connected', 'sh ip ro conn', 'show ip route conn', 'sh ip route conn', 'sh ip ro connected', 'show ip ro connected'],
    hint: 'show ip route + un filtru',
    wrong: [
      { text: 'show ip route', why: 'Corectă, dar afișează toată tabela (inclusiv statice, OSPF…), nu doar rutele conectate.' },
      { text: 'show ip interface brief', why: 'Arată interfețele și starea lor, nu tabela de rutare.' },
      { text: 'show ip route local', why: 'Pe IOS-urile care o acceptă afișează doar rutele L, nu și C.' },
    ],
    explanation: 'Fiecare interfață cu adresă și stare up/up produce: C = subrețeaua (de exemplu 192.168.10.0/26) și L = adresa proprie /32 (192.168.10.1/32).',
  },
  {
    id: '1.6-038', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['ios', 'verificare'],
    stem: '`show ip interface brief` arată pentru G0/1: Status **administratively down**, Protocol **down**. Ce înseamnă?',
    options: [
      { id: 'a', text: 'Interfața este oprită din configurație (`shutdown`) — lipsește `no shutdown`', correct: true, why: '„administratively down” înseamnă o decizie de configurare, nu o defecțiune. Vezi [[admin-down]].' },
      { id: 'b', text: 'Cablul este deconectat', correct: false, why: 'Un cablu lipsă dă „down / down” (fără „administratively”).' },
      { id: 'c', text: 'Adresa IP este greșită', correct: false, why: 'O adresă greșită nu schimbă starea interfeței; interfața poate fi up/up cu o adresă greșită.' },
      { id: 'd', text: 'Problemă de nivel 2 (encapsulare)', correct: false, why: 'O problemă de nivel 2 apare ca „up / down”.' },
    ],
    explanation: 'up/up = OK; administratively down/down = `shutdown`; down/down = nivel 1 (cablu, capătul celălalt oprit); up/down = nivel 2.',
  },
  {
    id: '1.6-039', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['ios', 'erori'],
    stem: 'Pe G0/1 tastezi `ip address 192.168.10.64 255.255.255.224` și IOS răspunde cu „Bad mask /27 for address 192.168.10.64”. De ce?',
    options: [
      { id: 'a', text: '192.168.10.64 este adresa de rețea a subrețelei 192.168.10.64/27 și nu poate fi atribuită unei interfețe', correct: true, why: 'Toți biții de gazdă sunt 0. Aceeași eroare apare și cu broadcast-ul (.95). Folosește .65–.94.' },
      { id: 'b', text: 'Masca 255.255.255.224 nu există', correct: false, why: '255.255.255.224 este o mască validă (/27).' },
      { id: 'c', text: 'Subrețeaua se suprapune cu altă interfață', correct: false, why: 'Suprapunerea dă alt mesaj: „% … overlaps with …”.' },
      { id: 'd', text: 'Trebuie folosit formatul /27', correct: false, why: 'IOS clasic cere chiar formatul zecimal folosit aici.' },
    ],
    explanation: 'Textul exact al mesajelor poate varia ușor între versiuni IOS și Packet Tracer; ideea rămâne: adresa nu e o gazdă validă pentru masca dată.',
  },
  {
    id: '1.6-040', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['ios', 'erori'],
    stem: 'R1 are G0/0 = 192.168.10.1/26. Pe G0/1 configurezi `ip address 192.168.10.30 255.255.255.192` și primești „% 192.168.10.0 overlaps with GigabitEthernet0/0”. Ce înseamnă?',
    options: [
      { id: 'a', text: '192.168.10.30/26 face parte din 192.168.10.0/26, subrețea folosită deja pe G0/0; un router nu poate avea aceeași subrețea pe două interfețe', correct: true, why: '.30 e în blocul .0–.63. Pentru G0/1 alege altă subrețea, de exemplu 192.168.10.64/27.' },
      { id: 'b', text: 'Adresa .30 este broadcast-ul', correct: false, why: 'Broadcast-ul lui .0/26 este .63, nu .30.' },
      { id: 'c', text: 'Masca /26 nu e permisă pe G0/1', correct: false, why: 'Orice mască validă e permisă pe orice interfață; problema este suprapunerea.' },
      { id: 'd', text: 'Trebuie folosit cuvântul-cheie `secondary`', correct: false, why: '`secondary` adaugă o subrețea pe ACEEAȘI interfață. Nici cu el nu poți pune aceeași subrețea pe altă interfață.' },
    ],
    explanation: 'Fiecare interfață de router = un domeniu de broadcast = o subrețea distinctă. Suprapunerea ar face rutarea ambiguă.',
  },
  {
    id: '1.6-041', topicId: T, sub: S, type: 'single', difficulty: 2, tags: ['verificare'],
    stem: 'În `show ip route` apare linia `L 192.168.10.65/32 is directly connected, GigabitEthernet0/1`. Ce reprezintă?',
    options: [
      { id: 'a', text: 'Adresa proprie a routerului pe G0/1, ca rută /32, ca pachetele destinate routerului să fie livrate local', correct: true, why: 'Rutele L (local) apar automat pentru fiecare adresă de interfață (pe IOS 15+).' },
      { id: 'b', text: 'Toată subrețeaua conectată pe G0/1', correct: false, why: 'Subrețeaua apare ca rută C (de exemplu C 192.168.10.64/27).' },
      { id: 'c', text: 'O rută statică configurată manual', correct: false, why: 'Rutele statice au codul S.' },
      { id: 'd', text: 'O gazdă vecină învățată prin ARP', correct: false, why: 'Vecinii apar în tabela ARP (`show ip arp`), nu ca rute L.' },
    ],
    explanation: 'Fiecare adresă de interfață up/up = o pereche C (subrețeaua) + L (adresa proprie /32).',
  },
  {
    id: '1.6-042', topicId: T, sub: S, type: 'single', difficulty: 3, tags: ['gateway', 'depanare'],
    stem: 'PC-B1 are 192.168.10.70/27 cu default gateway 192.168.10.62. Poate face ping la alte PC-uri din LAN, dar nu și la alte subrețele. Care e problema?',
    options: [
      { id: 'a', text: 'Gateway-ul .62 nu este în subrețeaua PC-ului (192.168.10.64/27, gazde .65–.94)', correct: true, why: '[[default-gateway|Gateway-ul]] trebuie să fie în aceeași subrețea. .62 aparține lui 192.168.10.32/27. Corect ar fi interfața routerului, de exemplu .65.' },
      { id: 'b', text: 'Masca PC-ului ar trebui să fie /24', correct: false, why: 'Masca trebuie să fie aceeași cu a interfeței routerului (/27). Cu /24 PC-ul ar crede că alte subrețele sunt locale și nu le-ar trimite la gateway.' },
      { id: 'c', text: 'Adresa .70 este broadcast-ul', correct: false, why: 'Broadcast-ul lui .64/27 este .95.' },
      { id: 'd', text: 'Problema e DNS', correct: false, why: 'Ping-ul se face aici la adrese IP; DNS nu intervine.' },
    ],
    explanation: 'Simptomul „merge local, nu merge în afară” indică gateway-ul (sau rutarea). Verifică mereu că IP-ul, masca și gateway-ul gazdei sunt în aceeași subrețea.',
  },
  {
    id: '1.6-043', topicId: T, sub: S, type: 'multi', difficulty: 2, tags: ['verificare'],
    stem: 'Care DOUĂ afirmații despre `show ip interface brief` sunt adevărate?',
    options: [
      { id: 'a', text: 'Nu afișează masca / prefixul interfeței', correct: true, why: 'Coloanele sunt Interface, IP-Address, OK?, Method, Status, Protocol — fără mască. Pentru prefix: `show ip interface` sau `show run interface`.' },
      { id: 'b', text: 'Nu afișează adresele secondary', correct: true, why: 'Doar adresa primară. Secondary apar în `show ip interface` și în running-config.' },
      { id: 'c', text: 'Afișează rutele C și L', correct: false, why: 'Rutele sunt în `show ip route`.' },
      { id: 'd', text: 'Method „manual” înseamnă că adresa a venit prin DHCP', correct: false, why: '„manual” = configurată cu `ip address`. Prin DHCP ar apărea „DHCP”; „unset” = fără adresă.' },
    ],
    explanation: 'Combinația de verificare completă: `show ip interface brief` (stare) + `show ip interface X` (prefix, secondary) + `show ip route connected` (C/L) + `ping`.',
  },
];
