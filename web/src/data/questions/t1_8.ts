import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.8 Configure and verify IPv6 addressing and prefix.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
// Obiectivul oficial 1.8 nu are sub-puncte, deci `sub` = '1.8'.
const T = '1.8';

export const Q_1_8: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  {
    id: '1.8-001', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Câți biți are o adresă IPv6 și cum se scrie?',
    options: [
      { id: 'a', text: '128 de biți, scrisă ca 8 grupuri hexazecimale de 16 biți separate prin două puncte', correct: true, why: 'Fiecare grup (hextet) are 4 cifre hexa = 16 biți; 8 × 16 = 128. Exemplu: 2001:db8:acad:1::1.' },
      { id: 'b', text: '32 de biți, scrisă ca 4 numere zecimale separate prin puncte', correct: false, why: 'Aceasta este adresa IPv4 (de exemplu 192.168.1.10).' },
      { id: 'c', text: '64 de biți, scrisă ca 4 grupuri hexazecimale', correct: false, why: '64 de biți este lungimea tipică a Interface ID-ului sau a prefixului unui LAN, nu a adresei întregi.' },
      { id: 'd', text: '48 de biți, scrisă ca 6 perechi hexazecimale', correct: false, why: 'Este formatul adresei MAC, nu al adresei IPv6.' },
    ],
    explanation: 'IPv6 = 128 de biți = 8 hextete. Scrierea este hexazecimală, iar literele A–F pot fi mari sau mici.',
  },
  {
    id: '1.8-002', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Ce folosește IPv6 în locul măștii de subrețea zecimale (de tip 255.255.255.0)?',
    options: [
      { id: 'a', text: 'Lungimea prefixului, scrisă după slash (de exemplu /64)', correct: true, why: 'Primii n biți identifică rețeaua; restul identifică hostul. Nu există mască în notație zecimală.' },
      { id: 'b', text: 'O mască hexazecimală de 128 de biți, scrisă complet', correct: false, why: 'Nu se scrie nicio mască separată; informația este doar lungimea prefixului.' },
      { id: 'c', text: 'Adresa de broadcast a rețelei', correct: false, why: 'IPv6 nu are broadcast; folosește multicast pentru funcțiile care în IPv4 foloseau broadcast.' },
      { id: 'd', text: 'Clasa adresei (A, B sau C)', correct: false, why: 'IPv6 nu folosește clase de adrese; folosește prefixe de lungime variabilă.' },
    ],
    explanation: 'Notația este adresă/lungime-prefix, ca la CIDR: 2001:db8:acad:1::1/64.',
  },

  // ======================= De ce IPv6 =======================
  {
    id: '1.8-003', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Care este principalul avantaj al IPv6 față de IPv4, în contextul epuizării adreselor?',
    options: [
      { id: 'a', text: 'Spațiu de adrese practic nelimitat (2¹²⁸), care permite adrese globale pentru toate dispozitivele, fără NAT', correct: true, why: 'Fiecare dispozitiv poate avea o adresă unică global, iar conectivitatea end-to-end este restabilită; securitatea o asigură un firewall, nu traducerea adreselor.' },
      { id: 'b', text: 'Folosește adrese mai scurte, deci pachete mai mici', correct: false, why: 'Adresele IPv6 sunt de patru ori mai lungi (128 vs. 32 de biți).' },
      { id: 'c', text: 'Elimină complet nevoia de firewall', correct: false, why: 'Un firewall rămâne necesar; fără NAT, protecția depinde și mai mult de regulile de firewall.' },
      { id: 'd', text: 'Este compatibil direct cu IPv4, fără niciun mecanism de tranziție', correct: false, why: 'IPv4 și IPv6 nu comunică direct; se folosesc dual stack sau mecanisme de traducere.' },
    ],
    explanation: 'IPv6 rezolvă epuizarea prin spațiu de adrese uriaș; NAT doar a amânat problema.',
  },
  {
    id: '1.8-004', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Ce RFC definește versiunea actuală a specificației IPv6 (Internet Standard, STD 86)?',
    options: [
      { id: 'a', text: 'RFC 8200 (2017)', correct: true, why: 'RFC 8200 a înlocuit RFC 2460 și a marcat IPv6 ca Internet Standard (STD 86).' },
      { id: 'b', text: 'RFC 1918', correct: false, why: 'RFC 1918 definește adresele private IPv4.' },
      { id: 'c', text: 'RFC 791', correct: false, why: 'RFC 791 (1981) specifică IPv4.' },
      { id: 'd', text: 'RFC 3927', correct: false, why: 'RFC 3927 descrie adresele link-local IPv4 (APIPA).' },
    ],
    explanation: 'Cronologie: RFC 1883 (1995) → RFC 2460 (1998) → RFC 8200 (2017).',
  },
  {
    id: '1.8-005', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Ce înseamnă „dual stack”?',
    options: [
      { id: 'a', text: 'O interfață (sau un dispozitiv) are în paralel adrese IPv4 și IPv6', correct: true, why: 'Este metoda de tranziție cea mai răspândită: hostul folosește protocolul disponibil, de regulă preferând IPv6.' },
      { id: 'b', text: 'O interfață are două adrese IPv6 de același tip', correct: false, why: 'O interfață poate avea mai multe adrese IPv6, dar „dual stack” se referă la IPv4 + IPv6.' },
      { id: 'c', text: 'Două routere formează o pereche redundantă', correct: false, why: 'Aceasta este redundanța first-hop sau alt mecanism, nu dual stack.' },
      { id: 'd', text: 'IPv6 încapsulat în IPv4 pe toată calea', correct: false, why: 'Aceasta este tunelarea (altă metodă de tranziție), nu dual stack.' },
    ],
    explanation: 'Dual stack = ambele protocole active simultan, fiecare cu adresele și rutarea lui.',
  },

  // ======================= Antetul IPv6 =======================
  {
    id: '1.8-006', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Ce dimensiune are antetul de bază IPv6?',
    options: [
      { id: 'a', text: '40 de octeți, fixă', correct: true, why: '8 octeți de câmpuri (versiune, traffic class, flow label, payload length, next header, hop limit) + 2 × 16 octeți de adrese = 40.' },
      { id: 'b', text: '20 de octeți, fixă', correct: false, why: '20 de octeți este dimensiunea minimă a antetului IPv4.' },
      { id: 'c', text: 'Între 20 și 60 de octeți, în funcție de opțiuni', correct: false, why: 'Aceasta este dimensiunea variabilă a antetului IPv4 (cu opțiuni).' },
      { id: 'd', text: '128 de octeți', correct: false, why: '128 este numărul de biți ai unei adrese, nu dimensiunea antetului.' },
    ],
    explanation: 'Antetul IPv6 are dimensiune fixă (40 de octeți), ceea ce simplifică procesarea în hardware.',
  },
  {
    id: '1.8-007', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Care câmp din antetul IPv4 NU mai există în antetul de bază IPv6?',
    options: [
      { id: 'a', text: 'Header Checksum', correct: true, why: 'A fost eliminat: erorile sunt prinse la nivel 2 (FCS) și 4 (checksum TCP/UDP), iar routerele nu mai recalculează nimic la fiecare hop.' },
      { id: 'b', text: 'TTL', correct: false, why: 'Există, dar a fost redenumit Hop Limit.' },
      { id: 'c', text: 'Protocol', correct: false, why: 'Există, sub numele Next Header.' },
      { id: 'd', text: 'Adresa sursă', correct: false, why: 'Există, dar are 128 de biți.' },
    ],
    explanation: 'Au dispărut: Header Checksum, IHL, Options și câmpurile de fragmentare. TTL → Hop Limit, Protocol → Next Header, ToS → Traffic Class.',
  },
  {
    id: '1.8-008', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Un router IPv6 primește un pachet prea mare pentru MTU-ul legăturii următoare. Ce face?',
    options: [
      { id: 'a', text: 'Îl aruncă și trimite sursei un mesaj ICMPv6 „Packet Too Big”', correct: true, why: 'În IPv6 doar hostul-sursă fragmentează; sursa află astfel MTU-ul căii și își micșorează pachetele.' },
      { id: 'b', text: 'Îl fragmentează și îl trimite mai departe', correct: false, why: 'Așa se întâmpla în IPv4; în IPv6 routerele nu fragmentează pachetele în tranzit.' },
      { id: 'c', text: 'Îl trimite oricum, cu bitul DF setat', correct: false, why: 'Bitul DF și câmpurile de fragmentare nu există în antetul de bază IPv6.' },
      { id: 'd', text: 'Îl ține în coadă până când MTU-ul crește', correct: false, why: 'MTU este o proprietate a legăturii, nu se schimbă în timp util; pachetul ar fi blocat inutil.' },
    ],
    explanation: 'Fiecare legătură IPv6 trebuie să accepte cel puțin 1280 de octeți. Fragmentarea e responsabilitatea sursei.',
  },

  // ======================= Notația =======================
  {
    id: '1.8-009', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Care este forma cea mai scurtă corectă pentru 2001:0db8:0000:0000:0000:ff00:0042:8329?',
    options: [
      { id: 'a', text: '2001:db8::ff00:42:8329', correct: true, why: 'Se elimină zerourile din față (0db8 → db8, 0042 → 42) și cele trei hextete 0000 consecutive se înlocuiesc cu „::”.' },
      { id: 'b', text: '2001:db8:0:0:0:ff00:42:8329', correct: false, why: 'Zerourile din față sunt eliminate, dar secvența de hextete 0 nu este scurtată cu „::”: nu este forma cea mai scurtă.' },
      { id: 'c', text: '2001:db8::ff:42:8329', correct: false, why: 'Greșit: „ff00” nu poate deveni „ff”. Se elimină doar zerourile de la început, nu cele de la sfârșit.' },
      { id: 'd', text: '2001::db8::ff00:42:8329', correct: false, why: 'Două „::” fac adresa invalidă.' },
    ],
    explanation: 'Reguli: (1) zerourile din fața hextetului se pot elimina; (2) o singură secvență de hextete 0 se înlocuiește cu „::”.',
  },
  {
    id: '1.8-010', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Care dintre următoarele este o adresă IPv6 VALIDĂ?',
    options: [
      { id: 'a', text: '2001:db8:0:1::5', correct: true, why: 'Are un singur „::”, hextete cu cel mult 4 cifre hexa și cel mult 8 hextete după extindere.' },
      { id: 'b', text: '2001::db8::1', correct: false, why: 'Conține două „::”: ar fi imposibil de știut câte hextete de zero ascunde fiecare.' },
      { id: 'c', text: '2001:db8:12345::1', correct: false, why: '„12345” are 5 cifre; un hextet are cel mult 4.' },
      { id: 'd', text: '2001:db8:g::1', correct: false, why: '„g” nu este cifră hexazecimală (0–9, a–f).' },
    ],
    explanation: 'Verifică: maximum un „::”, cel mult 4 cifre hexa per hextet, doar caractere 0–9 și a–f, maximum 8 hextete.',
  },
  {
    id: '1.8-011', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Care este forma completă (8 hextete cu 4 cifre) a adresei fe80::1?',
    options: [
      { id: 'a', text: 'fe80:0000:0000:0000:0000:0000:0000:0001', correct: true, why: 'Sunt 2 hextete prezente (fe80 și 1); „::” ascunde 8 − 2 = 6 hextete de zero.' },
      { id: 'b', text: 'fe80:0000:0000:0000:0001:0000:0000:0000', correct: false, why: 'Pune „1” în mijloc. În forma scurtă, „1” este după „::”, deci este ultimul hextet.' },
      { id: 'c', text: 'fe80:0001:0000:0000:0000:0000:0000:0000', correct: false, why: 'Ar corespunde formei fe80:1::, nu fe80::1.' },
      { id: 'd', text: 'fe80:0000:0000:0000:0000:0000:0001:0000', correct: false, why: 'Ar corespunde lui fe80::1:0; hextetul 1 trebuie să fie ultimul.' },
    ],
    explanation: 'Pentru a extinde: numeri hextetele prezente, iar „::” umple până la 8, în locul în care apare.',
  },
  {
    id: '1.8-012', topicId: T, sub: '1.8', type: 'single', difficulty: 3,
    stem: 'Care este forma scurtă corectă pentru 2001:0db8:0100:0000:0000:0000:0000:0010?',
    options: [
      { id: 'a', text: '2001:db8:100::10', correct: true, why: '0100 → 100 (zeroul din față se elimină, nu cele de la sfârșit); 0010 → 10; cele 4 hextete de zero devin „::”.' },
      { id: 'b', text: '2001:db8:1::1', correct: false, why: 'Ar însemna eliminarea și a zerourilor de la sfârșitul hextetelor, ceea ce schimbă valoarea (0100 ≠ 1).' },
      { id: 'c', text: '2001:db8:100:0:0:0:0:10', correct: false, why: 'Este corectă ca valoare, dar nu este forma cea mai scurtă: lipsește „::”.' },
      { id: 'd', text: '2001:db8:0100::0010', correct: false, why: 'Zerourile din față pot fi eliminate; forma cu ele păstrate nu este cea mai scurtă.' },
    ],
    explanation: 'Capcana clasică: se elimină doar zerourile din față. 0100 → 100, 0010 → 10.',
  },
  {
    id: '1.8-013', topicId: T, sub: '1.8', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare adresă completă cu forma ei scurtă corectă.',
    leftLabel: 'Adresă completă', rightLabel: 'Formă scurtă',
    pairs: [
      { left: '2001:0db8:0000:0001:0000:0000:0000:0001', right: '2001:db8:0:1::1', why: 'Se scurtează secvența cea mai lungă de zerouri (trei hextete), nu cea de un singur hextet.' },
      { left: '0000:0000:0000:0000:0000:0000:0000:0001', right: '::1', why: 'Adresa de loopback.' },
      { left: 'fe80:0000:0000:0000:0000:0000:0000:0001', right: 'fe80::1', why: 'Șase hextete de zero în mijloc devin „::”.' },
      { left: '2001:0db8:aaaa:0000:0000:0000:0000:0000', right: '2001:db8:aaaa::', why: '„::” poate fi și la sfârșit.' },
    ],
    distractors: [{ text: '2001:db8:aaaa::0', why: 'Nu este forma scurtă corectă: „::” acoperă deja zerourile finale, un „0” după el nu are sens.' }],
    explanation: 'Verifică mereu: zerouri din față eliminate, „::” o singură dată, pe cea mai lungă secvență.',
  },
  {
    id: '1.8-014', topicId: T, sub: '1.8', type: 'single', difficulty: 3,
    stem: 'Cum se scurtează corect 2001:0db8:0000:0001:0001:0001:0001:0001?',
    options: [
      { id: 'a', text: '2001:db8:0:1:1:1:1:1', correct: true, why: 'Există un singur hextet 0000; în forma canonică (RFC 5952) „::” nu se folosește pentru un singur hextet de zero.' },
      { id: 'b', text: '2001:db8::1:1:1:1:1', correct: false, why: 'Ar fi acceptată de un parser, dar nu este forma recomandată: „::” nu se folosește pentru un singur hextet 0.' },
      { id: 'c', text: '2001:db8::1', correct: false, why: 'Schimbă complet adresa: ar ascunde multe hextete și ar dispărea cele de valoare 1.' },
      { id: 'd', text: '2001:db8:0:1::', correct: false, why: 'Schimbă valoarea: ar însemna că hextetele finale sunt zero, deși sunt 1.' },
    ],
    explanation: 'RFC 5952: „::” nu se folosește pentru un singur hextet de 0; se scurtează secvența cea mai lungă, iar la egalitate prima.',
  },
  {
    id: '1.8-015', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Câte hextete de zero ascunde „::” în adresa 2001:db8:a::b:c?',
    options: [
      { id: 'a', text: '3', correct: true, why: 'Sunt 5 hextete prezente (2001, db8, a, b, c); 8 − 5 = 3.' },
      { id: 'b', text: '2', correct: false, why: 'Ar rezulta doar 7 hextete în total.' },
      { id: 'c', text: '4', correct: false, why: 'Ar rezulta 9 hextete în total, mai mult decât are o adresă IPv6.' },
      { id: 'd', text: '5', correct: false, why: '5 este numărul de hextete prezente, nu cel de zerouri ascunse.' },
    ],
    explanation: 'Formula: hextete ascunse de „::” = 8 − hextete scrise. Adresa extinsă este 2001:0db8:000a:0000:0000:0000:000b:000c.',
  },
  {
    id: '1.8-016', topicId: T, sub: '1.8', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre scrierea adreselor IPv6 sunt corecte?',
    options: [
      { id: 'a', text: '2001:DB8::1 și 2001:db8::1 reprezintă aceeași adresă', correct: true, why: 'Literele hexa nu diferențiază majusculele de minuscule; echipamentele Cisco le afișează de obicei cu litere mari.' },
      { id: 'b', text: 'O adresă cu port se scrie cu paranteze drepte, de exemplu [2001:db8::1]:80', correct: true, why: 'Fără paranteze, ultimul grup ar fi ambiguu între port și hextet.' },
      { id: 'c', text: '„::” poate apărea de două ori, dacă sunt două secvențe de zerouri', correct: false, why: 'Nu poate: două „::” fac adresa ambiguă, deci invalidă.' },
      { id: 'd', text: 'Zerourile de la sfârșitul unui hextet pot fi eliminate (0100 → 1)', correct: false, why: 'Se elimină doar zerourile din față; 0100 devine 100.' },
    ],
    explanation: 'Reguli sigure: un singur „::”, doar zerourile din față, majuscule = minuscule, paranteze drepte când adresa are port.',
  },

  // ======================= Prefix =======================
  {
    id: '1.8-017', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Care este prefixul de rețea al adresei 2001:db8:acad:1::1/64?',
    options: [
      { id: 'a', text: '2001:db8:acad:1::/64', correct: true, why: 'Primii 64 de biți (primele 4 hextete) formează prefixul; restul biților se pun pe zero.' },
      { id: 'b', text: '2001:db8:acad::/64', correct: false, why: 'Ar fi rețeaua cu Subnet ID 0; adresa dată are Subnet ID 1.' },
      { id: 'c', text: '2001:db8:acad:1::1/128', correct: false, why: 'Un /128 identifică o singură adresă, nu rețeaua.' },
      { id: 'd', text: '2001:db8::/32', correct: false, why: 'Este prefixul alocat (documentație), mult mai scurt decât prefixul LAN-ului.' },
    ],
    explanation: 'La /64 păstrezi primele 4 hextete și completezi cu zerouri: 2001:db8:acad:1::/64.',
  },
  {
    id: '1.8-018', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Câți biți are Interface ID-ul unei adrese IPv6 dintr-un LAN cu prefix /64?',
    options: [
      { id: 'a', text: '64', correct: true, why: '128 − 64 = 64; Interface ID-ul ocupă ultimele 4 hextete.' },
      { id: 'b', text: '48', correct: false, why: '48 este lungimea tipică a prefixului global alocat unei organizații.' },
      { id: 'c', text: '16', correct: false, why: '16 biți este lungimea Subnet ID-ului dintr-un /48.' },
      { id: 'd', text: '128', correct: false, why: 'Aceasta este lungimea întregii adrese.' },
    ],
    explanation: 'Structura tipică: 48 prefix global + 16 Subnet ID + 64 Interface ID = 128.',
  },
  {
    id: '1.8-019', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'De ce se folosește /64 pe LAN-urile IPv6?',
    options: [
      { id: 'a', text: 'SLAAC are nevoie de un Interface ID de 64 de biți, iar prefix + Interface ID trebuie să dea 128', correct: true, why: 'Cu alte lungimi de prefix, autoconfigurarea nu funcționează; în plus, nu mai trebuie să economisim adrese.' },
      { id: 'b', text: 'Pentru că un /64 are exact 254 de hosti', correct: false, why: 'Un /64 are 2⁶⁴ adrese. Cifra 254 aparține unui /24 din IPv4.' },
      { id: 'c', text: 'Pentru că /64 este singura lungime acceptată de routere', correct: false, why: 'Routerele acceptă orice lungime; /64 este convenția pentru LAN-uri, nu o limită hardware.' },
      { id: 'd', text: 'Pentru a economisi adrese', correct: false, why: 'Tocmai invers: IPv6 nu mai economisește adrese în LAN; spațiul este foarte mare.' },
    ],
    explanation: 'Regula practică: /64 pe orice LAN; /127 pe legături punct-la-punct între routere (RFC 6164).',
  },
  {
    id: '1.8-020', topicId: T, sub: '1.8', type: 'single', difficulty: 1,
    stem: 'Care afirmație despre IPv6 este corectă?',
    options: [
      { id: 'a', text: 'IPv6 nu are adrese de broadcast', correct: true, why: 'Funcțiile broadcast din IPv4 sunt preluate de multicast (de exemplu ff02::1 pentru toate nodurile).' },
      { id: 'b', text: 'Prima adresă a fiecărei subrețele este rezervată pentru broadcast', correct: false, why: 'Aceasta este o idee din IPv4 (ultima adresă), nu din IPv6.' },
      { id: 'c', text: 'IPv6 folosește măști de subrețea de forma 255.255.255.0', correct: false, why: 'IPv6 folosește doar lungimea prefixului.' },
      { id: 'd', text: 'IPv6 folosește ARP pentru a afla adresele MAC', correct: false, why: 'ARP este înlocuit de NDP (mesajele NS/NA).' },
    ],
    explanation: 'IPv6: fără broadcast, fără mască zecimală, fără ARP; în locul lor: multicast, prefix-length și NDP.',
  },

  // ======================= Alocare și subnetting =======================
  {
    id: '1.8-021', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Câte subrețele /64 se pot crea dintr-un prefix /48?',
    options: [
      { id: 'a', text: '65.536 (2¹⁶)', correct: true, why: '64 − 48 = 16 biți de Subnet ID → 2¹⁶ = 65.536.' },
      { id: 'b', text: '256', correct: false, why: '256 = 2⁸ este rezultatul pentru un /56.' },
      { id: 'c', text: '16', correct: false, why: '16 este numărul de biți de Subnet ID, nu numărul de subrețele.' },
      { id: 'd', text: '4.294.967.296', correct: false, why: '2³² este numărul total de adrese IPv4.' },
    ],
    explanation: 'Număr de /64 dintr-un prefix /n: 2^(64 − n). Din /48: 2¹⁶ = 65.536; din /56: 2⁸ = 256.',
  },
  {
    id: '1.8-022', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Un client rezidențial primește de la ISP un prefix /56. Câte LAN-uri /64 poate crea?',
    options: [
      { id: 'a', text: '256', correct: true, why: '64 − 56 = 8 biți → 2⁸ = 256 de subrețele /64.' },
      { id: 'b', text: '65.536', correct: false, why: 'Aceasta este valoarea pentru un /48.' },
      { id: 'c', text: '8', correct: false, why: '8 este numărul de biți de subrețea, nu numărul de subrețele.' },
      { id: 'd', text: '1', correct: false, why: 'Un singur /64 ai primi dacă ISP-ul ți-ar da un /64; un /56 permite 256.' },
    ],
    explanation: 'RIPE-690 recomandă /48 pentru business și /56 pentru clienți rezidențiali.',
  },
  {
    id: '1.8-023', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Dintr-un prefix 2001:db8:acad::/48, care este subrețeaua /64 care urmează după 2001:db8:acad:9::/64?',
    options: [
      { id: 'a', text: '2001:db8:acad:a::/64', correct: true, why: 'Subnet ID se numără în hexazecimal: după 9 urmează a (adică 10 în zecimal).' },
      { id: 'b', text: '2001:db8:acad:10::/64', correct: false, why: '10 în hexazecimal este 16 zecimal; după 9 vine a, nu 10.' },
      { id: 'c', text: '2001:db8:acad:9::1/64', correct: false, why: 'Aceasta este o adresă din aceeași subrețea, nu următoarea subrețea.' },
      { id: 'd', text: '2001:db8:acad:100::/64', correct: false, why: '100 hexa = 256 zecimal; este mult mai departe de „următoarea”.' },
    ],
    explanation: 'Capcana hexazecimală: …:9, …:a, …:b, … …:f, …:10 (=16). Subrețeaua cu numărul zecimal 10 este :a:.',
  },
  {
    id: '1.8-024', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Care este prefixul /64 al adresei 2001:db8:acad:12:abcd::5/64?',
    options: [
      { id: 'a', text: '2001:db8:acad:12::/64', correct: true, why: 'Primele 4 hextete (2001:db8:acad:12) formează prefixul; restul se pune pe zero.' },
      { id: 'b', text: '2001:db8:acad:12:abcd::/64', correct: false, why: 'Ar fi un prefix de 80 de biți; la /64 ultimele 64 de biți sunt Interface ID, inclusiv „abcd”.' },
      { id: 'c', text: '2001:db8:acad::/64', correct: false, why: 'Ar ignora Subnet ID-ul 12.' },
      { id: 'd', text: '2001:db8:acad:c::/64', correct: false, why: 'Subnet ID este „12” scris deja în hexazecimal; nu se convertește din zecimal.' },
    ],
    explanation: 'La /64 contează doar primele 4 hextete; hextetele 5–8 sunt Interface ID.',
  },
  {
    id: '1.8-025', topicId: T, sub: '1.8', type: 'single', difficulty: 3,
    stem: 'Care este rețeaua /64 a adresei 2001:db8:acad::aaaa:1234/64?',
    options: [
      { id: 'a', text: '2001:db8:acad::/64 (Subnet ID = 0)', correct: true, why: 'Expandată: 2001:0db8:acad:0000:0000:0000:aaaa:1234. „::” ascunde chiar Subnet ID-ul, care este 0000.' },
      { id: 'b', text: '2001:db8:acad:aaaa::/64', correct: false, why: '„aaaa” este în Interface ID (hextetul 7), nu în Subnet ID.' },
      { id: 'c', text: '2001:db8:acad:1234::/64', correct: false, why: '„1234” este ultimul hextet al Interface ID-ului.' },
      { id: 'd', text: 'Nu se poate afla fără masca de subrețea', correct: false, why: 'Prefixul /64 este dat în adresă; mască separată nu există în IPv6.' },
    ],
    explanation: 'Atenție: „::” poate ascunde Subnet ID-ul. Expandează întotdeauna adresa înainte de a determina rețeaua.',
  },
  {
    id: '1.8-026', topicId: T, sub: '1.8', type: 'order', difficulty: 2,
    stem: 'Ordonează lanțul tipic de alocare a prefixelor IPv6, de la sus în jos.',
    items: [
      { text: 'IANA (alocă blocuri mari registrelor regionale)', why: 'IANA distribuie din blocul 2000::/3 către cele cinci RIR-uri.' },
      { text: 'RIR (de exemplu RIPE NCC pentru Europa)', why: 'Registrul regional alocă ISP-urilor și organizațiilor din regiunea lui.' },
      { text: 'ISP / LIR (prefix tipic /32)', why: 'ISP-ul primește un bloc mare, din care alocă clienților.' },
      { text: 'Organizația clientă (/48 pentru business, /56 pentru rezidențial)', why: 'Clientul primește un prefix stabil, din care își creează subrețele.' },
      { text: 'Fiecare LAN al organizației (/64)', why: 'Ultimul nivel: câte un /64 pe segment (VLAN).' },
    ],
    explanation: 'IANA → RIR → ISP/LIR → organizație (/48 sau /56) → /64 pe LAN.',
  },

  // ======================= Cum își iau hostii adresa =======================
  {
    id: '1.8-027', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'De unde află un host IPv6 configurat automat gateway-ul implicit?',
    options: [
      { id: 'a', text: 'Din Router Advertisement (adresa link-local a routerului)', correct: true, why: 'RA conține și durata de viață ca router implicit; hostul folosește adresa sursă (link-local) a RA-ului ca gateway.' },
      { id: 'b', text: 'Din DHCPv6', correct: false, why: 'DHCPv6 nu are o opțiune pentru gateway implicit; poate oferi adrese și DNS, dar gateway-ul vine din RA.' },
      { id: 'c', text: 'Din ARP', correct: false, why: 'IPv6 nu folosește ARP.' },
      { id: 'd', text: 'Dintr-un mesaj de broadcast', correct: false, why: 'IPv6 nu are broadcast.' },
    ],
    explanation: 'Gateway-ul implicit vine din RA, indiferent dacă adresa globală vine din SLAAC sau din DHCPv6.',
  },
  {
    id: '1.8-028', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Ce indică flag-ul A (Autonomous) din opțiunea Prefix Information a unui Router Advertisement?',
    options: [
      { id: 'a', text: 'Hostii pot construi singuri o adresă din acel prefix (SLAAC)', correct: true, why: 'Cu A=1, hostul lipește propriul Interface ID la prefixul /64 anunțat.' },
      { id: 'b', text: 'Adresa trebuie obținută de la un server DHCPv6', correct: false, why: 'Aceasta este semnificația flag-ului M (Managed), la nivel de RA.' },
      { id: 'c', text: 'Alte informații (DNS) se obțin din DHCPv6', correct: false, why: 'Aceasta este flag-ul O (Other config).' },
      { id: 'd', text: 'Routerul este un router implicit', correct: false, why: 'Acest lucru este indicat de durata de viață ca router (Router Lifetime), nu de flag-ul A.' },
    ],
    explanation: 'A = SLAAC, O = alte opțiuni din DHCPv6, M = adresa din DHCPv6.',
  },
  {
    id: '1.8-029', topicId: T, sub: '1.8', type: 'single', difficulty: 3,
    stem: 'Ce tip ICMPv6 are un mesaj Router Advertisement?',
    options: [
      { id: 'a', text: '134', correct: true, why: 'RS = 133, RA = 134, NS = 135, NA = 136, Redirect = 137.' },
      { id: 'b', text: '133', correct: false, why: '133 este Router Solicitation (hostul cere un RA).' },
      { id: 'c', text: '135', correct: false, why: '135 este Neighbor Solicitation (echivalentul ARP request).' },
      { id: 'd', text: '136', correct: false, why: '136 este Neighbor Advertisement (echivalentul ARP reply).' },
    ],
    explanation: 'Reținere: 133 RS, 134 RA, 135 NS, 136 NA, 137 Redirect — în ordinea în care apar într-o conversație tipică.',
  },
  {
    id: '1.8-030', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'Un PC configurat pe „Automatic” (SLAAC) are doar adresă link-local (FE80::…) și niciun prefix global. Routerul are adrese IPv6 configurate corect. Care este cea mai probabilă cauză?',
    options: [
      { id: 'a', text: 'Pe router lipsește comanda ipv6 unicast-routing, deci nu se trimit Router Advertisement', correct: true, why: 'Fără RA, hostul nu află prefixul global și nici gateway-ul; adresa link-local se formează totuși local.' },
      { id: 'b', text: 'Lipsește ruta implicită pe PC', correct: false, why: 'Gateway-ul vine din RA; și fără el, PC-ul ar primi totuși prefixul global dacă RA ar fi trimis.' },
      { id: 'c', text: 'Pe router lipsește masca de subrețea', correct: false, why: 'IPv6 nu folosește mască; prefixul se scrie în adresa /64.' },
      { id: 'd', text: 'Serverul DHCP este oprit', correct: false, why: 'SLAAC nu folosește server DHCP; chiar și fără DHCPv6, prefixul ar veni prin RA.' },
    ],
    explanation: 'Simptom clasic: link-local da, global nu → verifică dacă routerul trimite RA (ipv6 unicast-routing) și dacă prefixul este /64.',
  },
  {
    id: '1.8-031', topicId: T, sub: '1.8', type: 'match', difficulty: 2,
    stem: 'Potrivește mesajul NDP cu rolul lui.',
    leftLabel: 'Rol', rightLabel: 'Mesaj',
    pairs: [
      { left: 'Hostul întreabă „există vreun router pe legătură?”', right: 'Router Solicitation (RS)', why: 'Trimis la pornirea interfeței, ca să nu aștepte următorul RA periodic.' },
      { left: 'Routerul anunță prefixul, flag-urile M/O/A și durata de viață ca gateway', right: 'Router Advertisement (RA)', why: 'Trimis periodic și ca răspuns la un RS.' },
      { left: 'Echivalentul ARP request: „cine are această adresă IPv6?”', right: 'Neighbor Solicitation (NS)', why: 'Folosit și pentru DAD, cu sursa „::”.' },
      { left: 'Echivalentul ARP reply: oferă adresa MAC', right: 'Neighbor Advertisement (NA)', why: 'Răspunsul la un NS.' },
    ],
    distractors: [{ text: 'DHCPv6 Solicit', why: 'Este mesajul DHCPv6 prin care clientul caută un server DHCPv6; nu face parte din NDP.' }],
    explanation: 'NDP înlocuiește ARP și descoperirea de routere din IPv4, și rulează peste ICMPv6.',
  },
  {
    id: '1.8-032', topicId: T, sub: '1.8', type: 'multi', difficulty: 3,
    stem: 'Care DOUĂ afirmații despre DHCPv6 sunt corecte?',
    options: [
      { id: 'a', text: 'Nu oferă gateway implicit; acesta vine din Router Advertisement', correct: true, why: 'DHCPv6 nu are o opțiune de gateway; gateway-ul se învață din RA.' },
      { id: 'b', text: 'În modul stateless poate oferi doar alte informații (de exemplu DNS), în timp ce adresa vine din SLAAC', correct: true, why: 'Este situația flag-ului O=1 cu A=1: SLAAC pentru adresă, DHCPv6 pentru DNS.' },
      { id: 'c', text: 'Înlocuiește complet Router Advertisement', correct: false, why: 'RA rămâne necesar chiar și cu DHCPv6 stateful, cel puțin pentru gateway.' },
      { id: 'd', text: 'Flag-ul M din RA înseamnă „folosește SLAAC”', correct: false, why: 'M (Managed) înseamnă că adresele sunt disponibile prin DHCPv6; SLAAC este controlat de flag-ul A.' },
    ],
    explanation: 'Trei metode: SLAAC (A), SLAAC + DHCPv6 stateless (A + O), DHCPv6 stateful (M).',
  },

  // ======================= Configurare și verificare =======================
  {
    id: '1.8-033', topicId: T, sub: '1.8', type: 'cli', difficulty: 1,
    stem: 'Ce comandă de configurare globală activează rutarea IPv6 pe un router Cisco (și trimiterea RA-urilor)?',
    prompt: 'R1(config)#', canonical: 'ipv6 unicast-routing',
    answers: ['ipv6 unicast-routing'],
    hint: 'ipv6 …-routing',
    wrong: [
      { text: 'ip routing', why: 'Activează rutarea IPv4 (pe un switch L3); nu pornește rutarea IPv6.' },
      { text: 'ipv6 enable', why: 'Se aplică pe interfață și generează doar adresa link-local; nu activează rutarea.' },
      { text: 'ipv6 route ::/0', why: 'Definește o rută implicită statică IPv6; nu activează rutarea.' },
    ],
    explanation: 'Fără ipv6 unicast-routing routerul se comportă ca un host IPv6: nu rutează între interfețe și nu trimite RA.',
  },
  {
    id: '1.8-034', topicId: T, sub: '1.8', type: 'cli', difficulty: 2,
    stem: 'Pe interfața G0/0 a lui R1 vrei adresa globală statică 2001:db8:acad:1::1 cu prefix /64. Ce comandă dai în modul de configurare a interfeței?',
    prompt: 'R1(config-if)#', canonical: 'ipv6 address 2001:db8:acad:1::1/64',
    answers: ['ipv6 address 2001:db8:acad:1::1/64', 'ipv6 address 2001:DB8:ACAD:1::1/64'],
    hint: 'ipv6 address adresă/prefix',
    wrong: [
      { text: 'ip address 2001:db8:acad:1::1/64', why: '„ip address” este comanda IPv4 și nu acceptă adrese IPv6.' },
      { text: 'ipv6 address 2001:db8:acad:1::1 255.255.255.0', why: 'IPv6 nu folosește mască zecimală; se scrie prefix-length după slash.' },
      { text: 'ipv6 address 2001:db8:acad:1::/64 eui-64', why: 'Aceasta cere IOS să calculeze Interface ID din MAC; nu setează adresa ::1 cerută.' },
    ],
    explanation: 'Forma generală: ipv6 address <adresă>/<prefix>. Adresa link-local se generează automat, dacă nu o setezi tu.',
  },
  {
    id: '1.8-035', topicId: T, sub: '1.8', type: 'cli', difficulty: 1,
    stem: 'Ce comandă afișează pe scurt toate interfețele cu starea lor și adresele IPv6 (inclusiv link-local)?',
    prompt: 'R1#', canonical: 'show ipv6 interface brief',
    answers: ['show ipv6 interface brief', 'show ipv6 int brief', 'show ipv6 int br', 'sh ipv6 int br', 'sh ipv6 interface brief'],
    hint: 'echivalentul IPv6 al lui show ip interface brief',
    wrong: [
      { text: 'show ip interface brief', why: 'Arată doar adresele IPv4.' },
      { text: 'show ipv6 route', why: 'Afișează tabela de rutare IPv6, nu lista interfețelor.' },
      { text: 'show ipv6 neighbors', why: 'Arată vecinii descoperiți prin NDP (echivalentul tabelei ARP).' },
    ],
    explanation: 'show ipv6 interface brief arată starea [up/up], adresa link-local (prima) și adresele globale, sau „unassigned”.',
  },
  {
    id: '1.8-036', topicId: T, sub: '1.8', type: 'cli', difficulty: 2,
    stem: 'Ce comandă setează manual adresa link-local fe80::1 pe interfața curentă?',
    prompt: 'R1(config-if)#', canonical: 'ipv6 address fe80::1 link-local',
    answers: ['ipv6 address fe80::1 link-local', 'ipv6 address FE80::1 link-local'],
    hint: 'adresa urmată de cuvântul-cheie care îi spune IOS tipul',
    wrong: [
      { text: 'ipv6 address fe80::1/64', why: 'Fără cuvântul-cheie link-local, IOS ar trata-o ca pe o adresă obișnuită cu prefix, nu ca pe link-local.' },
      { text: 'ipv6 enable', why: 'Generează doar o link-local automată (din MAC); nu setează valoarea fe80::1.' },
      { text: 'ipv6 link-local fe80::1', why: 'Nu este o comandă validă IOS pentru această setare.' },
    ],
    explanation: 'O link-local setată manual (de exemplu fe80::1) este ușor de reținut și poate fi aceeași pe fiecare interfață a routerului, pentru că este valabilă doar pe legătura ei.',
  },
  {
    id: '1.8-037', topicId: T, sub: '1.8', type: 'single', difficulty: 2,
    stem: 'În show ipv6 route apar liniile „C 2001:DB8:ACAD:1::/64” și „L 2001:DB8:ACAD:1::1/128”. Ce reprezintă fiecare?',
    options: [
      { id: 'a', text: 'C = rețeaua conectată (/64); L = adresa proprie a routerului, ca rută /128', correct: true, why: 'La fel ca la IPv4 (C și L), L este adresa locală, un /128 care indică „această adresă este a mea”.' },
      { id: 'b', text: 'C = rută configurată manual; L = rută învățată dinamic', correct: false, why: 'Rutele statice sunt S, cele învățate au coduri de protocol (O, D etc.).' },
      { id: 'c', text: 'C = rută implicită; L = rută către link-local', correct: false, why: 'Ruta implicită apare ca ::/0 (cu cod S sau ND); adresele link-local nu apar în tabelă.' },
      { id: 'd', text: 'C = rută către cloud; L = rută către LAN', correct: false, why: 'Codurile au sensuri fixe în IOS: C = Connected, L = Local.' },
    ],
    explanation: 'C = Connected (prefixul /64 al interfeței), L = Local (adresa routerului, /128). Adresele link-local nu apar în tabelă.',
  },
  {
    id: '1.8-038', topicId: T, sub: '1.8', type: 'single', difficulty: 3,
    stem: 'Ce scrii în comanda „ipv6 address … eui-64” ca să fie corectă?',
    options: [
      { id: 'a', text: 'Doar prefixul, de exemplu 2001:db8:acad:2::/64 — IOS completează Interface ID-ul din MAC', correct: true, why: 'Cu eui-64 nu scrii o adresă completă; IOS calculează ultimii 64 de biți din adresa MAC a interfeței.' },
      { id: 'b', text: 'O adresă completă, de exemplu 2001:db8:acad:2::1/64', correct: false, why: 'Nu este forma prevăzută: cu eui-64 Interface ID-ul este calculat de IOS din MAC, deci nu scrii tu partea de host (::1).' },
      { id: 'c', text: 'Adresa MAC a interfeței', correct: false, why: 'MAC-ul este citit automat de IOS; nu se scrie în comandă.' },
      { id: 'd', text: 'Doar lungimea prefixului, de exemplu /64', correct: false, why: 'Comanda are nevoie și de prefixul de rețea, nu doar de lungime.' },
    ],
    explanation: 'Sintaxa: ipv6 address <prefix>/64 eui-64. Algoritmul EUI-64 se studiază la 1.9.d.',
  },
  {
    id: '1.8-039', topicId: T, sub: '1.8', type: 'order', difficulty: 2,
    stem: 'Ordonează o succesiune logică pentru a configura un router astfel încât un LAN IPv6 cu hosti SLAAC să funcționeze.',
    items: [
      { text: 'Activezi rutarea IPv6 cu ipv6 unicast-routing', why: 'Altfel routerul nu trimite RA și nu rutează IPv6.' },
      { text: 'Intri în configurarea interfeței LAN (interface g0/0)', why: 'Adresele se configurează pe interfață.' },
      { text: 'Configurezi adresa ipv6 address 2001:db8:acad:1::1/64', why: 'Prefixul /64 al acestei adrese devine prefixul anunțat în RA.' },
      { text: 'Pornești interfața cu no shutdown', why: 'Interfețele routerelor sunt oprite implicit.' },
      { text: 'Verifici cu show ipv6 interface brief și ipconfig pe un PC', why: 'Confirmi starea interfeței și că hostul a primit prefix și gateway.' },
    ],
    explanation: 'Ordinea comenzilor de configurare poate varia, dar verificarea vine la final; condiția esențială pentru SLAAC este ipv6 unicast-routing.',
  },
  {
    id: '1.8-040', topicId: T, sub: '1.8', type: 'single', difficulty: 3,
    stem: 'Un router are ipv6 address 2001:db8:acad:1::1/64 pe G0/0, dar show ipv6 interface g0/0 nu listează grupul FF02::2 printre „Joined group address(es)”. Ce înseamnă?',
    options: [
      { id: 'a', text: 'Rutarea IPv6 nu este activată (lipsește ipv6 unicast-routing); routerul nu trimite RA', correct: true, why: 'FF02::2 (toate routerele) apare doar după ipv6 unicast-routing; fără el, routerul se comportă ca un host.' },
      { id: 'b', text: 'Interfața este „administratively down”', correct: false, why: 'Starea interfeței nu este legată direct de apartenența la FF02::2; o interfață oprită ar arăta clar „administratively down”.' },
      { id: 'c', text: 'Adresa globală este duplicată', correct: false, why: 'Un duplicat ar fi detectat de DAD și ar apărea ca atare în starea adresei.' },
      { id: 'd', text: 'Prefixul /64 este prea scurt', correct: false, why: '/64 este lungimea corectă pentru un LAN; nu influențează apartenența la FF02::2.' },
    ],
    explanation: 'FF02::1 = toate nodurile (mereu); FF02::2 = toate routerele (după ipv6 unicast-routing). Lipsa FF02::2 este un semn clasic de depanare.',
  },
];
