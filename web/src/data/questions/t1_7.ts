import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.7 Describe private IPv4 addressing.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
// Obiectivul oficial 1.7 nu are sub-puncte, deci `sub` = '1.7'.
const T = '1.7';

export const Q_1_7: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  {
    id: '1.7-001', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Care dintre următoarele adrese IPv4 este o adresă privată conform [[rfc1918|RFC 1918]]?',
    options: [
      { id: 'a', text: '10.45.2.9', correct: true, why: 'Face parte din 10.0.0.0/8, primul bloc privat. Orice adresă care începe cu 10 este privată.' },
      { id: 'b', text: '172.32.0.1', correct: false, why: 'Blocul privat din mijloc se termină la 172.31.255.255. 172.32.x.x este deja adresă publică.' },
      { id: 'c', text: '192.169.1.1', correct: false, why: 'Blocul privat este 192.168.0.0/16. Un singur număr în plus (169) scoate adresa din bloc: este publică.' },
      { id: 'd', text: '169.254.1.5', correct: false, why: 'Este o adresă link-local (APIPA, RFC 3927), alocată automat când DHCP nu răspunde. Nu face parte din RFC 1918.' },
    ],
    explanation: 'RFC 1918 definește exact trei blocuri: 10.0.0.0/8, 172.16.0.0/12 și 192.168.0.0/16. Tot ce nu se află în ele (inclusiv APIPA, loopback, CGNAT) nu este „privat” în sens RFC 1918.',
  },
  {
    id: '1.7-002', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Câte adrese distincte poate avea teoretic IPv4, având în vedere că o adresă are 32 de biți?',
    options: [
      { id: 'a', text: 'Aproximativ 4,3 miliarde (2³²)', correct: true, why: '2³² = 4.294.967.296. Din ele o parte sunt rezervate (multicast, loopback, clasa E etc.), deci numărul utilizabil pe Internet este și mai mic.' },
      { id: 'b', text: 'Aproximativ 340 de sextilioane (2¹²⁸)', correct: false, why: 'Aceasta este dimensiunea spațiului IPv6, care folosește adrese de 128 de biți.' },
      { id: 'c', text: 'Aproximativ 16,7 milioane (2²⁴)', correct: false, why: '2²⁴ este numărul de adrese dintr-un singur bloc /8 (de exemplu 10.0.0.0/8), nu din tot spațiul IPv4.' },
      { id: 'd', text: 'Exact 4.294.967.296 adrese publice utilizabile', correct: false, why: 'Numărul total este corect, dar nu toate sunt publice și utilizabile: multicast, rezervate, loopback și adresele private reduc numărul real.' },
    ],
    explanation: 'IPv4 = 32 de biți → 2³² ≈ 4,3 miliarde. Faptul că populația lumii și numărul de dispozitive depășesc această valoare este rădăcina problemei rezolvate de adresele private, NAT și IPv6.',
  },
  {
    id: '1.7-003', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Ce eveniment a avut loc pe 3 februarie 2011?',
    options: [
      { id: 'a', text: 'IANA și-a epuizat rezerva de blocuri /8 libere', correct: true, why: 'IANA a alocat ultimele blocuri /8 către registrele regionale (RIR). De atunci, adresele noi vin doar din rezervele rămase la RIR-uri.' },
      { id: 'b', text: 'RIPE NCC a făcut ultima alocare IPv4 din rezerva liberă', correct: false, why: 'Aceasta s-a întâmplat pe 25 noiembrie 2019, nu în 2011.' },
      { id: 'c', text: 'A fost publicat RFC 1918', correct: false, why: 'RFC 1918 a apărut în februarie 1996, deci cu 15 ani mai devreme.' },
      { id: 'd', text: 'Toate adresele IPv4 din lume au încetat să funcționeze', correct: false, why: 'Epuizarea înseamnă doar că rezerva liberă s-a golit. Adresele deja alocate funcționează normal.' },
    ],
    explanation: 'Reperele de memorat: IANA epuizată pe 3 februarie 2011; RIPE NCC (Europa, inclusiv România) ultima alocare pe 25 noiembrie 2019. Epuizat nu înseamnă oprit, ci „nu mai există adrese noi libere”.',
  },
  {
    id: '1.7-004', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Care este soluția pe termen lung la epuizarea adreselor IPv4?',
    options: [
      { id: 'a', text: 'IPv6, cu adrese de 128 de biți', correct: true, why: 'IPv6 oferă un spațiu atât de mare încât fiecare dispozitiv poate avea o adresă globală, fără NAT. Celelalte soluții doar amână problema.' },
      { id: 'b', text: 'NAT/PAT', correct: false, why: 'NAT permite refolosirea adreselor, deci amână epuizarea, dar nu creează adrese noi și rupe conectivitatea end-to-end. Este o soluție de moment.' },
      { id: 'c', text: 'CIDR', correct: false, why: 'CIDR (1993) elimină risipa claselor, deci încetinește consumul, dar nu mărește numărul total de adrese.' },
      { id: 'd', text: 'Folosirea blocului 100.64.0.0/10', correct: false, why: 'Este un bloc pentru CGNAT, o soluție tot de tip NAT, deci tot temporară.' },
    ],
    explanation: 'Trei răspunsuri la problemă: CIDR (mai puțină risipă), adrese private + NAT (refolosire) și IPv6 (spațiu nou). Doar ultimul rezolvă problema de fond.',
  },
  {
    id: '1.7-005', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Ce a anunțat RIPE NCC pe 25 noiembrie 2019?',
    options: [
      { id: 'a', text: 'Ultima alocare IPv4 (un /22) din rezerva liberă; după aceea au rămas doar adrese recuperate, pe listă de așteptare', correct: true, why: 'Din acel moment, un LIR nou primește doar un /24 din adrese recuperate, pe lista de așteptare. Pentru un ISP nou asta înseamnă practic CGNAT, cumpărare de adrese sau IPv6.' },
      { id: 'b', text: 'Interzicerea adreselor private în Europa', correct: false, why: 'Adresele private nu pot fi „interzise”: sunt folosite local și nu sunt gestionate de niciun registru.' },
      { id: 'c', text: 'Trecerea obligatorie la IPv6 pentru toți operatorii', correct: false, why: 'Tranziția la IPv6 este voluntară și graduală, nu impusă printr-un anunț al registrului.' },
      { id: 'd', text: 'Lansarea blocului 100.64.0.0/10', correct: false, why: 'Blocul 100.64.0.0/10 a fost rezervat de RFC 6598 în 2012, nu de RIPE NCC în 2019.' },
    ],
    explanation: 'RIPE NCC acoperă Europa, Orientul Mijlociu și Asia Centrală. Ultima alocare din rezerva liberă (un /22) a fost pe 25 noiembrie 2019.',
  },
  {
    id: '1.7-006', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'De ce nu pot fi rutate adresele private pe Internet?',
    options: [
      { id: 'a', text: 'Nu sunt unice global: aceleași adrese sunt folosite simultan de milioane de rețele, iar ISP-urile le filtrează', correct: true, why: 'Rutarea globală cere ca fiecare prefix să aibă un singur proprietar. Dacă două firme anunță 10.1.1.0/24, niciun router nu ar ști care este destinația corectă.' },
      { id: 'b', text: 'Routerele nu știu să trimită pachete cu adrese care încep cu 10, 172 sau 192', correct: false, why: 'Routerele din interiorul unei organizații rutează perfect adrese private. Limitarea este de politică (filtrare la ISP), nu tehnică.' },
      { id: 'c', text: 'Pentru că sunt mai scurte decât adresele publice', correct: false, why: 'Sunt tot adrese de 32 de biți, exact ca cele publice.' },
      { id: 'd', text: 'Pentru că nu pot fi folosite cu DHCP', correct: false, why: 'DHCP distribuie frecvent adrese private (192.168.x.x în rețelele casnice). Nu există nicio incompatibilitate.' },
    ],
    explanation: 'Adresele private se rutează liber în interiorul unei organizații, dar nu și pe Internet. Ca să ajungă acolo, au nevoie de NAT.',
  },

  // ======================= RFC 1918 =======================
  {
    id: '1.7-007', topicId: T, sub: '1.7', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ dintre următoarele adrese sunt private conform RFC 1918?',
    options: [
      { id: 'a', text: '172.20.4.4', correct: true, why: 'Al doilea octet (20) este între 16 și 31, deci adresa se află în 172.16.0.0/12.' },
      { id: 'b', text: '192.168.200.1', correct: true, why: 'Se află în 192.168.0.0/16, blocul tipic pentru rețele casnice și SOHO.' },
      { id: 'c', text: '172.32.1.1', correct: false, why: 'Al doilea octet este 32, în afara intervalului 16–31, deci adresa este publică.' },
      { id: 'd', text: '100.64.1.1', correct: false, why: 'Aparține blocului Shared Address Space (100.64.0.0/10, RFC 6598), destinat CGNAT. Nu este RFC 1918.' },
    ],
    explanation: 'Verifică mereu întâi blocul: 10.x.x.x, 172.16–31.x.x și 192.168.x.x. Distractorii uzuali sunt 172.32, 172.15, 192.169 și 100.64.',
  },
  {
    id: '1.7-008', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Care este intervalul exact al blocului privat 172.16.0.0/12?',
    options: [
      { id: 'a', text: '172.16.0.0 – 172.31.255.255', correct: true, why: '/12 fixează 4 biți în al doilea octet (0001), deci acesta ia valori de la 16 (00010000) la 31 (00011111).' },
      { id: 'b', text: '172.16.0.0 – 172.16.255.255', correct: false, why: 'Aceasta ar fi un /16, adică doar o rețea de clasă B. Blocul real are 16 asemenea rețele.' },
      { id: 'c', text: '172.0.0.0 – 172.255.255.255', correct: false, why: 'Aceasta ar fi un /8. Doar o parte (16–31) a lui 172.x.x.x este privată.' },
      { id: 'd', text: '172.16.0.0 – 172.32.255.255', correct: false, why: 'Greșeala clasică: 172.32.x.x este public. Capătul blocului este 172.31.255.255.' },
    ],
    explanation: 'Truc: 172 de la 16 la 31. Masca /12 = 255.240.0.0, iar 256 − 240 = 16 = mărimea pasului în al doilea octet; blocul începe la 16 și se termină la 16 + 16 − 1 = 31.',
  },
  {
    id: '1.7-009', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Care este masca de subrețea a blocului privat 172.16.0.0/12, în notație zecimală?',
    options: [
      { id: 'a', text: '255.240.0.0', correct: true, why: '/12 = 8 biți în primul octet + 4 biți în al doilea: 11110000 = 240.' },
      { id: 'b', text: '255.255.0.0', correct: false, why: 'Aceasta este masca unui /16, nu a unui /12.' },
      { id: 'c', text: '255.248.0.0', correct: false, why: '248 = 11111000 corespunde unui /13. Ar acoperi doar 8 valori (16–23) în al doilea octet.' },
      { id: 'd', text: '255.0.0.0', correct: false, why: 'Este masca unui /8, adică masca blocului 10.0.0.0/8.' },
    ],
    explanation: 'Cele trei blocuri RFC 1918 au măștile 255.0.0.0 (/8), 255.240.0.0 (/12) și 255.255.0.0 (/16).',
  },
  {
    id: '1.7-010', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Un administrator configurează interfața unui router cu 172.15.255.254/16. Este adresa privată?',
    options: [
      { id: 'a', text: 'Nu — 172.15.x.x este în afara blocului 172.16.0.0/12 și este adresă publică', correct: true, why: 'Blocul privat începe exact la 172.16.0.0. Cu un octet mai jos, 172.15.x.x aparține spațiului public.' },
      { id: 'b', text: 'Da, pentru că începe cu 172', correct: false, why: 'Prefixul „172” nu este suficient: doar al doilea octet 16–31 este privat.' },
      { id: 'c', text: 'Da, pentru că masca /16 este specifică adreselor private', correct: false, why: 'Masca nu are legătură cu caracterul privat al adresei; contează doar blocul în care se află adresa.' },
      { id: 'd', text: 'Nu — este adresă APIPA', correct: false, why: 'APIPA este 169.254.0.0/16, un bloc complet diferit.' },
    ],
    explanation: '172.15.x.x și 172.32.x.x sunt publice: sunt „vecinii” blocului privat și cele mai folosite distractori de la examen.',
  },
  {
    id: '1.7-011', topicId: T, sub: '1.7', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare descriere cu blocul de adrese corespunzător.',
    leftLabel: 'Descriere', rightLabel: 'Bloc',
    pairs: [
      { left: 'Cel mai mare bloc privat (16.777.216 adrese)', right: '10.0.0.0/8', why: '2²⁴ = 16.777.216 adrese. Apare des în rețele enterprise, campus și data center.' },
      { left: 'Bloc privat cu 1.048.576 de adrese, de la 172.16 la 172.31', right: '172.16.0.0/12', why: '2²⁰ = 1.048.576 adrese; echivalent cu 16 rețele de clasă B.' },
      { left: 'Cel mai mic bloc privat, tipic pentru rețele casnice (65.536 adrese)', right: '192.168.0.0/16', why: '2¹⁶ = 65.536 adrese; echivalent cu 256 de rețele de clasă C.' },
      { left: 'Shared Address Space, folosit între ISP și routerele abonaților (CGNAT)', right: '100.64.0.0/10', why: 'Definit de RFC 6598 în 2012; nu este RFC 1918.' },
      { left: 'Adrese auto-configurate când DHCP nu răspunde', right: '169.254.0.0/16', why: 'Link-local / APIPA (RFC 3927); nu se rutează nici măcar de un router.' },
    ],
    distractors: [{ text: '127.0.0.0/8', why: 'Este blocul loopback („eu însumi”), folosit pentru testarea stivei locale. Nu corespunde niciuneia dintre descrieri.' }],
    explanation: 'Trei blocuri private și două blocuri „speciale” cu care sunt confundate frecvent la examen.',
  },
  {
    id: '1.7-012', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Ce document IETF definește adresele private IPv4 și a devenit BCP 5?',
    options: [
      { id: 'a', text: 'RFC 1918 (februarie 1996)', correct: true, why: 'RFC 1918, „Address Allocation for Private Internets”, a înlocuit RFC 1597 din 1994 și are statut BCP 5.' },
      { id: 'b', text: 'RFC 791', correct: false, why: 'RFC 791 (1981) definește protocolul IPv4 în sine, nu adresele private.' },
      { id: 'c', text: 'RFC 6598', correct: false, why: 'RFC 6598 (2012) rezervă 100.64.0.0/10 pentru CGNAT, nu cele trei blocuri private clasice.' },
      { id: 'd', text: 'RFC 3927', correct: false, why: 'RFC 3927 descrie adresele link-local IPv4 (APIPA), 169.254.0.0/16.' },
    ],
    explanation: 'RFC 1918 = blocurile private. RFC 6598 = CGNAT. RFC 3927 = APIPA. RFC 5737 = adrese de documentație.',
  },
  {
    id: '1.7-013', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Care este wildcard mask-ul potrivit pentru a descrie în ACL întregul bloc 172.16.0.0/12?',
    options: [
      { id: 'a', text: '0.15.255.255', correct: true, why: 'Wildcard-ul este inversul măștii 255.240.0.0: 255 − 240 = 15 în al doilea octet, deci 0.15.255.255. Acoperă 172.16 – 172.31.' },
      { id: 'b', text: '0.0.255.255', correct: false, why: 'Acesta este wildcard-ul unui /16 și ar acoperi doar o singură rețea 172.16.x.x.' },
      { id: 'c', text: '0.255.255.255', correct: false, why: 'Este wildcard-ul unui /8; ar acoperi tot 172.x.x.x, inclusiv adrese publice.' },
      { id: 'd', text: '0.16.255.255', correct: false, why: 'Valoarea 16 nu este de forma 2ⁿ − 1, deci nu descrie un bloc contiguu aliniat; corect este 15.' },
    ],
    explanation: 'În ACL: 10.0.0.0 0.255.255.255 · 172.16.0.0 0.15.255.255 · 192.168.0.0 0.0.255.255. Wildcard = inversul măștii de subrețea.',
  },
  {
    id: '1.7-014', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'O interfață este configurată cu 10.5.5.5/30. Este adresa privată?',
    options: [
      { id: 'a', text: 'Da — contează blocul în care se află adresa, nu masca folosită', correct: true, why: '10.5.5.5 se află în 10.0.0.0/8. Subdivizarea ei în subrețele /30 nu schimbă faptul că este privată.' },
      { id: 'b', text: 'Nu — doar adresele cu masca /8 sunt private', correct: false, why: 'Masca nu determină caracterul privat. Din orice bloc privat poți crea subrețele de orice mărime.' },
      { id: 'c', text: 'Nu — o mască /30 este rezervată adreselor publice', correct: false, why: 'Un /30 este o mască obișnuită pentru legături punct-la-punct, publice sau private.' },
      { id: 'd', text: 'Depinde de ISP', correct: false, why: 'Statutul de adresă privată este definit de RFC 1918, nu de ISP.' },
    ],
    explanation: 'Prefixul din RFC (/8, /12, /16) descrie blocul, nu masca subrețelei tale. Din 10.0.0.0/8 poți decupa 10.1.20.0/24, 10.5.5.4/30 etc. — toate rămân private.',
  },
  {
    id: '1.7-015', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Cum se clasifică adresa 192.168.256.1?',
    options: [
      { id: 'a', text: 'Invalidă — un octet nu poate depăși 255', correct: true, why: 'Un octet are 8 biți, deci valori de la 0 la 255. 256 nu este posibil, deci adresa nu este nici privată, nici publică.' },
      { id: 'b', text: 'Privată, pentru că începe cu 192.168', correct: false, why: 'Începutul „192.168” nu salvează adresa: trebuie să fie validă ca întreg.' },
      { id: 'c', text: 'Publică', correct: false, why: 'O adresă invalidă nu poate fi publică.' },
      { id: 'd', text: 'APIPA', correct: false, why: 'APIPA este 169.254.x.x, nu 192.168.x.x.' },
    ],
    explanation: 'La examen verifică întâi validitatea (octeți ≤ 255) și abia apoi blocul.',
  },
  {
    id: '1.7-016', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Un router de acasă are, implicit, LAN-ul 192.168.1.0/24. În ce categorie se află această adresă de rețea?',
    options: [
      { id: 'a', text: 'Adresă privată din blocul 192.168.0.0/16', correct: true, why: 'Este cel mai mic bloc RFC 1918, cel mai des folosit în rețele casnice și SOHO.' },
      { id: 'b', text: 'Adresă publică alocată de ISP', correct: false, why: 'Adresa publică se află pe interfața WAN a routerului, nu pe LAN.' },
      { id: 'c', text: 'Adresă de documentație (RFC 5737)', correct: false, why: 'Documentația folosește 192.0.2.0/24, 198.51.100.0/24 și 203.0.113.0/24, nu 192.168.x.x.' },
      { id: 'd', text: 'Adresă de loopback', correct: false, why: 'Loopback este 127.0.0.0/8.' },
    ],
    explanation: 'Acasă: 192.168.0.0/24 sau 192.168.1.0/24 în LAN (privat) + o adresă publică (sau CGNAT) pe WAN, cu NAT între ele.',
  },
  {
    id: '1.7-017', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Care dintre următoarele adrese este publică?',
    options: [
      { id: 'a', text: '172.32.0.1', correct: true, why: 'Este chiar după capătul blocului privat 172.16.0.0 – 172.31.255.255, deci publică.' },
      { id: 'b', text: '172.31.255.1', correct: false, why: 'Este ultima porțiune a blocului privat (172.31.x.x), deci privată.' },
      { id: 'c', text: '10.255.255.254', correct: false, why: 'Se află în 10.0.0.0/8, deci privată.' },
      { id: 'd', text: '192.168.0.254', correct: false, why: 'Se află în 192.168.0.0/16, deci privată.' },
    ],
    explanation: 'Capcana „la limită”: 172.31.x.x privată, 172.32.x.x publică; 172.15.x.x publică, 172.16.x.x privată.',
  },

  // ======================= NAT / PAT =======================
  {
    id: '1.7-018', topicId: T, sub: '1.7', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii prin care un PC dintr-un LAN privat comunică cu un server de pe Internet printr-un router cu [[pat|PAT]].',
    items: [
      { text: 'PC-ul trimite pachetul cu adresa sursă privată către gateway', why: 'Pachetul pleacă normal din LAN; PC-ul nu știe nimic despre NAT.' },
      { text: 'Routerul identifică pachetul ca fiind de tradus și creează o intrare în tabela de traduceri', why: 'Intrarea reține adresa și portul privat și perechea publică aleasă, pentru a ști cum să traducă răspunsul.' },
      { text: 'Routerul rescrie adresa sursă (și portul) în adresa publică și trimite pachetul spre Internet', why: 'De acum pachetul arată ca și cum ar veni de la adresa publică a routerului.' },
      { text: 'Serverul răspunde către adresa publică a routerului', why: 'Serverul nu vede niciodată adresa privată; răspunde către adresa și portul pe care le-a primit.' },
      { text: 'Routerul caută răspunsul în tabelă și rescrie adresa destinație în adresa privată a PC-ului', why: 'Portul din tabelă identifică exact conversația și, deci, PC-ul căruia îi aparține.' },
    ],
    explanation: 'NAT este un proces cu stare: fără intrarea din tabela de traduceri, răspunsul nu ar ști cărui PC îi aparține.',
  },
  {
    id: '1.7-019', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Un coleg afirmă că NAT/PAT îi protejează rețeaua și deci un firewall nu mai este necesar. Care este afirmația corectă?',
    options: [
      { id: 'a', text: 'NAT nu este un firewall: blocarea conexiunilor din exterior este doar un efect secundar, iar protecția reală vine din reguli de firewall stateful', correct: true, why: 'PAT nu are intrare în tabelă pentru conexiuni inițiate din exterior, deci acestea eșuează, dar nu există inspecție, politici sau logare. Un port forward anulează chiar și acest efect.' },
      { id: 'b', text: 'NAT inspectează aplicațiile și blochează programele malițioase', correct: false, why: 'NAT doar rescrie adrese și porturi. Inspecția de aplicații ține de NGFW/IPS.' },
      { id: 'c', text: 'NAT este un firewall de nivel 7', correct: false, why: 'NAT lucrează cu antetele IP și TCP/UDP; nu este un firewall și nu operează ca unul la nivel 7.' },
      { id: 'd', text: 'NAT criptează traficul', correct: false, why: 'NAT nu criptează nimic; adresele sunt doar rescrise.' },
    ],
    explanation: 'NAT nu înlocuiește un firewall. În IPv6 NAT nu mai este necesar, iar protecția rămâne în sarcina unui firewall stateful.',
  },
  {
    id: '1.7-020', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Ce element suplimentar folosește [[pat|PAT]] (NAT overload) față de NAT static pentru a lăsa mai mulți hosti să împartă o singură adresă publică?',
    options: [
      { id: 'a', text: 'Numărul de port (TCP/UDP sau ICMP Identifier)', correct: true, why: 'Fiecare conversație primește propria pereche adresă + port în tabelă, iar portul diferențiază clienții care partajează aceeași adresă publică.' },
      { id: 'b', text: 'Adresa MAC a hostului', correct: false, why: 'MAC-ul rămâne local, în segmentul Layer 2, și nu este folosit pentru traducere.' },
      { id: 'c', text: 'Valoarea TTL', correct: false, why: 'TTL limitează numărul de hopuri și nu are rol în identificarea conversațiilor.' },
      { id: 'd', text: 'VLAN ID', correct: false, why: 'VLAN ID există doar în cadrele Ethernet trunk și nu identifică traducerile NAT.' },
    ],
    explanation: 'PAT = „NAT overload” = mulți-la-unu, diferențiat prin port. Este tipul de NAT folosit de routerul de acasă.',
  },
  {
    id: '1.7-021', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'În terminologia Cisco NAT, ce reprezintă adresa „inside local”?',
    options: [
      { id: 'a', text: 'Adresa reală, de regulă privată, a hostului din LAN', correct: true, why: 'Este adresa configurată pe PC (de exemplu 192.168.1.10), așa cum o văd hostii din interior.' },
      { id: 'b', text: 'Adresa publică sub care hostul din LAN apare pe Internet', correct: false, why: 'Aceasta este „inside global”.' },
      { id: 'c', text: 'Adresa reală a serverului de pe Internet', correct: false, why: 'Aceasta este „outside global”.' },
      { id: 'd', text: 'Adresa interfeței LAN a routerului', correct: false, why: 'Adresa routerului este gateway-ul; nu este denumită „inside local” în tabela de traduceri.' },
    ],
    explanation: 'Inside/outside = unde se află hostul. Local/global = din ce parte privești adresa. Inside local = privată reală; inside global = publică sub care apare.',
  },
  {
    id: '1.7-022', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Un PC (192.168.1.10) accesează un server (198.51.100.10) prin PAT pe un router a cărui interfață WAN are 203.0.113.2. Care este adresa „inside global” a PC-ului?',
    options: [
      { id: 'a', text: '203.0.113.2 (cu un port ales de router)', correct: true, why: 'Inside global este adresa publică sub care hostul din LAN este văzut în Internet; cu PAT este adresa interfeței WAN.' },
      { id: 'b', text: '192.168.1.10', correct: false, why: 'Aceasta este adresa „inside local”.' },
      { id: 'c', text: '198.51.100.10', correct: false, why: 'Aceasta este adresa serverului („outside global”).' },
      { id: 'd', text: '192.168.1.1', correct: false, why: 'Este gateway-ul LAN, nu adresa unei traduceri.' },
    ],
    explanation: 'În show ip nat translations, pentru acest exemplu: Inside global = 203.0.113.2:port, Inside local = 192.168.1.10:port, iar adresele outside sunt cele ale serverului.',
  },
  {
    id: '1.7-023', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Un utilizator din Internet încearcă să se conecteze la un server web din LAN-ul privat, fără NAT static sau port forwarding configurat. Ce se întâmplă?',
    options: [
      { id: 'a', text: 'Conexiunea eșuează: în tabela PAT nu există nicio intrare pentru traficul inițiat din exterior', correct: true, why: 'PAT creează intrări doar pentru conexiuni pornite din interior. Pachetul din Internet nu se potrivește cu nicio intrare și este aruncat.' },
      { id: 'b', text: 'Routerul alege automat un host din LAN și îi trimite pachetul', correct: false, why: 'Routerul nu ghicește destinația; fără intrare nu există niciun host țintă.' },
      { id: 'c', text: 'Conexiunea reușește, pentru că adresa privată este rutabilă pe Internet', correct: false, why: 'Adresele private nu sunt rutate pe Internet și nu există nici o rută înapoi.' },
      { id: 'd', text: 'Conexiunea reușește doar prin IPv6', correct: false, why: 'Întrebarea este despre IPv4 cu PAT; cu IPv6 nu mai există NAT, dar nici nu este vorba despre același scenariu.' },
    ],
    explanation: 'Pentru acces din exterior spre un host privat ai nevoie de NAT static sau port forwarding (o intrare în tabelă făcută manual).',
  },
  {
    id: '1.7-024', topicId: T, sub: '1.7', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ dintre următoarele sunt dezavantaje ale NAT?',
    options: [
      { id: 'a', text: 'Rupe conectivitatea end-to-end pentru conexiuni inițiate din exterior', correct: true, why: 'Hosturile din Internet nu pot iniția o conexiune spre un host privat fără o intrare statică în tabelă.' },
      { id: 'b', text: 'Routerul trebuie să țină o tabelă de stare cu fiecare conversație', correct: true, why: 'Tabela consumă memorie și CPU, iar la repornirea routerului conexiunile active se pierd.' },
      { id: 'c', text: 'Creează adrese publice noi', correct: false, why: 'NAT nu creează adrese: doar permite refolosirea lor.' },
      { id: 'd', text: 'Înlocuiește complet nevoia de firewall', correct: false, why: 'NAT nu este un firewall; securitatea cere reguli explicite.' },
    ],
    explanation: 'Costurile NAT: end-to-end pierdut, protocoale complicate (FTP activ, SIP, IPsec), stare de menținut și urmărire mai grea în loguri.',
  },
  {
    id: '1.7-025', topicId: T, sub: '1.7', type: 'cli', difficulty: 2,
    stem: 'Pe un router Cisco, ce comandă afișează tabela cu traducerile NAT active (coloanele Inside global / Inside local / Outside local / Outside global)?',
    prompt: 'R-HOME#', canonical: 'show ip nat translations',
    answers: ['show ip nat translations', 'show ip nat translation', 'show ip nat trans', 'sh ip nat translations', 'sh ip nat trans'],
    hint: 'începe cu show ip nat …',
    wrong: [
      { text: 'show ip nat statistics', why: 'Arată contoarele (traduceri active, interfețe inside/outside, Hits/Misses), nu lista conversațiilor.' },
      { text: 'show ip route', why: 'Afișează tabela de rutare, nu traducerile NAT.' },
      { text: 'show ip interface brief', why: 'Listează interfețele și adresele lor, utile pentru a vedea cele două „lumi”, dar nu traducerile.' },
    ],
    explanation: 'show ip nat translations = fiecare rând este o conversație activă. Intrările ICMP expiră repede, deci rulează comanda imediat după ping.',
  },
  {
    id: '1.7-026', topicId: T, sub: '1.7', type: 'cli', difficulty: 2,
    stem: 'Ce comandă afișează contoarele NAT (traduceri totale, interfețe inside/outside, Hits și Misses)?',
    prompt: 'R-HOME#', canonical: 'show ip nat statistics',
    answers: ['show ip nat statistics', 'show ip nat statistic', 'show ip nat stat', 'sh ip nat statistics', 'sh ip nat stat'],
    hint: 'show ip nat … cu același cuvânt-cheie ca pentru contoare',
    wrong: [
      { text: 'show ip nat translations', why: 'Afișează fiecare traducere în parte, nu totalurile și interfețele inside/outside.' },
      { text: 'show interfaces', why: 'Arată contoare pe interfețe (erori, pachete), nu statistici NAT.' },
      { text: 'show access-lists', why: 'Arată regulile ACL și numărul de potriviri, nu starea NAT.' },
    ],
    explanation: 'Un „Miss” înseamnă un pachet pentru care s-a creat o traducere nouă. Un „Hit” înseamnă un pachet tradus după o intrare existentă.',
  },
  {
    id: '1.7-027', topicId: T, sub: '1.7', type: 'cli', difficulty: 2,
    stem: 'În configurarea PAT, interfața conectată la LAN-ul privat trebuie marcată ca „inside”. Ce comandă dai în modul de configurare a interfeței?',
    prompt: 'R-HOME(config-if)#', canonical: 'ip nat inside',
    answers: ['ip nat inside'],
    hint: 'ip nat …',
    wrong: [
      { text: 'ip nat outside', why: 'Aceasta se aplică interfeței spre Internet (WAN), nu celei spre LAN.' },
      { text: 'ip nat inside source list 1 interface GigabitEthernet0/1 overload', why: 'Este comanda globală care definește regula de traducere, nu cea care marchează interfața.' },
      { text: 'ip address 192.168.1.1 255.255.255.0', why: 'Setează adresa interfeței, dar nu o marchează pentru NAT.' },
    ],
    explanation: 'Trei pași PAT: marchezi interfețele (ip nat inside / ip nat outside), definești cine se traduce (ACL) și legi totul cu ip nat inside source list … overload. Detaliile sunt la obiectivul 4.1.',
  },
  {
    id: '1.7-028', topicId: T, sub: '1.7', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare tip de NAT cu descrierea lui.',
    leftLabel: 'Descriere', rightLabel: 'Tip',
    pairs: [
      { left: 'Traducere fixă 1:1, permanentă, configurată manual; permite conexiuni inițiate din Internet', right: 'NAT static', why: 'Se folosește pentru servere interne care trebuie să fie accesibile din exterior.' },
      { left: 'Traducere 1:1 temporară, dintr-un pool de adrese publice', right: 'NAT dinamic', why: 'Când pool-ul se golește, următorii hosti nu mai pot ieși.' },
      { left: 'Mulți hosti partajează una sau câteva adrese publice, deosebiți prin port', right: 'PAT (NAT overload)', why: 'Tipul cel mai răspândit: de la rețele casnice până la operatori.' },
    ],
    distractors: [{ text: 'NAT64', why: 'NAT64 traduce între IPv6 și IPv4; este alt subiect, nu apare în descrierile date.' }],
    explanation: 'La 1.7 contează conceptul: static = 1:1 fix, dinamic = 1:1 din pool, PAT = N:1 cu port. Configurarea este la 4.1.',
  },

  // ======================= CGNAT =======================
  {
    id: '1.7-029', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Pentru ce este rezervat blocul 100.64.0.0/10?',
    options: [
      { id: 'a', text: 'Shared Address Space: legătura dintre CGN-ul ISP-ului și routerele abonaților (RFC 6598)', correct: true, why: 'Un bloc separat evită conflictul cu adresele private alese de abonat în propria casă.' },
      { id: 'b', text: 'Al patrulea bloc privat din RFC 1918', correct: false, why: 'RFC 1918 are exact trei blocuri. 100.64/10 vine dintr-un alt document (RFC 6598).' },
      { id: 'c', text: 'Adrese de documentație', correct: false, why: 'Documentația folosește 192.0.2.0/24, 198.51.100.0/24 și 203.0.113.0/24.' },
      { id: 'd', text: 'Adrese link-local pentru auto-configurare', correct: false, why: 'Link-local IPv4 este 169.254.0.0/16.' },
    ],
    explanation: '100.64.0.0/10 = Shared Address Space, destinat CGNAT. Este rutat în rețeaua ISP-ului, dar nu pe Internet.',
  },
  {
    id: '1.7-030', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Care este ultima adresă din blocul 100.64.0.0/10?',
    options: [
      { id: 'a', text: '100.127.255.255', correct: true, why: '/10 fixează primii 2 biți din al doilea octet (01); octetul 2 ia valori de la 64 (01000000) la 127 (01111111).' },
      { id: 'b', text: '100.64.255.255', correct: false, why: 'Aceasta ar fi ultima adresă a unui /16 (100.64.0.0/16), nu a întregului /10.' },
      { id: 'c', text: '100.128.255.255', correct: false, why: '100.128.x.x se află deja în afara blocului, deci este publică.' },
      { id: 'd', text: '100.255.255.255', correct: false, why: 'Aceasta ar fi capătul unui /8 (100.0.0.0/8), mult mai mare decât blocul de 4.194.304 adrese.' },
    ],
    explanation: 'Interval: 100.64.0.0 – 100.127.255.255. 100.63.x.x și 100.128.x.x sunt adrese publice obișnuite.',
  },
  {
    id: '1.7-031', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Routerul unui abonat primește pe interfața WAN adresa 100.72.15.4. Ce înseamnă acest lucru?',
    options: [
      { id: 'a', text: 'ISP-ul folosește CGNAT: abonatul se află în spatele unui al doilea NAT, al operatorului', correct: true, why: '100.64.0.0/10 este folosit între CGN și routerele abonaților. Adresa publică a abonatului este una împărțită cu mulți alții.' },
      { id: 'b', text: 'Abonatul are o adresă publică statică', correct: false, why: 'Adresele publice nu se află în 100.64/10; acesta este un spațiu partajat, nerutat pe Internet.' },
      { id: 'c', text: 'Routerul nu a primit răspuns de la DHCP', correct: false, why: 'În acest caz ar fi apărut o adresă APIPA 169.254.x.x, nu 100.72.x.x.' },
      { id: 'd', text: 'Adresa este o adresă RFC 1918', correct: false, why: '100.64/10 nu face parte din RFC 1918; are propriul RFC (6598).' },
    ],
    explanation: 'Dacă adresa WAN a routerului începe cu 100.64–100.127 (sau este privată) și diferă de adresa publică văzută pe un site „what is my IP”, ești în spatele CGNAT: nu poți găzdui servere accesibile din exterior.',
  },
  {
    id: '1.7-032', topicId: T, sub: '1.7', type: 'single', difficulty: 3,
    stem: 'De ce nu a folosit ISP-ul pur și simplu blocul 10.0.0.0/8 între CGN și routerele abonaților?',
    options: [
      { id: 'a', text: 'Abonatul poate avea deja 10.x.x.x în LAN, iar routerul ar ajunge cu aceeași rețea pe două interfețe, ceea ce strică rutarea', correct: true, why: 'Abonatul își alege liber adresele private. Un bloc rezervat separat (100.64.0.0/10) nu intră în conflict cu LAN-ul lui.' },
      { id: 'b', text: 'Blocul 10.0.0.0/8 este prea mic pentru milioane de abonați', correct: false, why: '10.0.0.0/8 are 16,7 milioane de adrese, mai multe decât cele 4,19 milioane din 100.64/10. Mărimea nu este motivul.' },
      { id: 'c', text: 'Adresele 10.x.x.x sunt rutate pe Internet', correct: false, why: 'Nu sunt rutate; sunt private și filtrate la fel ca orice alt bloc RFC 1918.' },
      { id: 'd', text: 'Pentru că CGNAT funcționează doar cu adrese publice', correct: false, why: 'CGNAT folosește tocmai adrese nepublice pe partea abonaților.' },
    ],
    explanation: 'Un bloc dedicat evită suprapunerea cu orice LAN de abonat. Alegerea 100.64.0.0/10 vine din RFC 6598 (BCP 153).',
  },

  // ======================= Alte adrese speciale =======================
  {
    id: '1.7-033', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Un PC afișează adresa 169.254.18.3. Ce indică acest lucru?',
    options: [
      { id: 'a', text: 'PC-ul nu a primit răspuns de la un server DHCP și și-a auto-atribuit o adresă [[apipa|APIPA]]', correct: true, why: 'APIPA (link-local IPv4, RFC 3927) apare după ce DHCP eșuează. Adresa funcționează doar în segmentul local, fără gateway.' },
      { id: 'b', text: 'PC-ul are o adresă privată de rezervă, utilizabilă pe Internet prin NAT', correct: false, why: 'APIPA nu este RFC 1918 și nu poate ieși din segment: nu are gateway, deci nici NAT nu ajută.' },
      { id: 'c', text: 'PC-ul este în spatele CGNAT', correct: false, why: 'CGNAT folosește 100.64.0.0/10, nu 169.254.0.0/16.' },
      { id: 'd', text: 'PC-ul folosește adresa de loopback', correct: false, why: 'Loopback este 127.0.0.0/8.' },
    ],
    explanation: '169.254.x.x = DHCP a eșuat (cablu, server oprit, scope epuizat). Verifică conectivitatea și serverul DHCP, nu „adresa privată”.',
  },
  {
    id: '1.7-034', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Ce testează comanda ping 127.0.0.1 pe un host?',
    options: [
      { id: 'a', text: 'Doar stiva TCP/IP locală (adresa [[loopback|loopback]] nu părăsește hostul)', correct: true, why: '127.0.0.0/8 este adresa „eu însumi”: pachetele nu ajung la placa de rețea, deci nu testează cablul sau rețeaua.' },
      { id: 'b', text: 'Placa de rețea și cablul', correct: false, why: 'Pachetele către loopback nu ies pe cablu; funcționează chiar și fără cablu conectat.' },
      { id: 'c', text: 'Conectivitatea spre gateway', correct: false, why: 'Pentru gateway se face ping la adresa lui (de exemplu 192.168.1.1).' },
      { id: 'd', text: 'Conectivitatea spre Internet', correct: false, why: 'Pentru Internet se testează o adresă publică (de exemplu un server DNS).' },
    ],
    explanation: '127.0.0.1 nu este o adresă privată în sens RFC 1918. Este loopback: validează doar stiva de rețea a sistemului de operare.',
  },
  {
    id: '1.7-035', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Adresele 192.0.2.0/24, 198.51.100.0/24 și 203.0.113.0/24 apar în cărți și laburi. Care este rolul lor?',
    options: [
      { id: 'a', text: 'Sunt rezervate pentru documentație și exemple (RFC 5737) și nu ar trebui folosite în producție', correct: true, why: 'Permit autorilor să dea exemple de adrese „publice” fără a folosi adresele reale ale altcuiva.' },
      { id: 'b', text: 'Sunt cele trei blocuri private RFC 1918', correct: false, why: 'Blocurile RFC 1918 sunt 10/8, 172.16/12 și 192.168/16.' },
      { id: 'c', text: 'Sunt rezervate pentru multicast', correct: false, why: 'Multicast IPv4 este 224.0.0.0/4.' },
      { id: 'd', text: 'Sunt adrese de loopback', correct: false, why: 'Loopback este 127.0.0.0/8.' },
    ],
    explanation: 'TEST-NET-1/2/3. În această lecție, adresele „publice” din exemple (203.0.113.2, 198.51.100.10) sunt din acest spațiu.',
  },
  {
    id: '1.7-036', topicId: T, sub: '1.7', type: 'multi', difficulty: 3,
    stem: 'Care DOUĂ dintre următoarele adrese NU fac parte din RFC 1918?',
    options: [
      { id: 'a', text: '169.254.10.1', correct: true, why: 'Link-local / APIPA (RFC 3927), un bloc separat de cele private.' },
      { id: 'b', text: '100.100.1.1', correct: true, why: 'Se află în 100.64.0.0/10 (Shared Address Space, RFC 6598), nu în RFC 1918.' },
      { id: 'c', text: '10.0.0.1', correct: false, why: 'Se află în 10.0.0.0/8, deci face parte din RFC 1918.' },
      { id: 'd', text: '192.168.5.5', correct: false, why: 'Se află în 192.168.0.0/16, deci face parte din RFC 1918.' },
    ],
    explanation: 'Adresele „speciale” care nu sunt RFC 1918: APIPA, CGNAT, loopback, documentație, multicast, clasa E.',
  },

  // ======================= IPv6 și recapitulare =======================
  {
    id: '1.7-037', topicId: T, sub: '1.7', type: 'single', difficulty: 1,
    stem: 'Câți biți are o adresă IPv6, față de cei 32 de biți ai unei adrese IPv4?',
    options: [
      { id: 'a', text: '128 de biți', correct: true, why: '2¹²⁸ ≈ 3,4 × 10³⁸ adrese: suficiente ca fiecare dispozitiv să aibă o adresă globală, fără NAT.' },
      { id: 'b', text: '64 de biți', correct: false, why: '64 de biți este lungimea tipică a părții de rețea (prefix) a unei adrese IPv6, nu a adresei întregi.' },
      { id: 'c', text: '48 de biți', correct: false, why: '48 de biți este lungimea unei adrese MAC.' },
      { id: 'd', text: '256 de biți', correct: false, why: 'IPv6 nu are adrese de 256 de biți.' },
    ],
    explanation: 'IPv4 = 32 de biți (≈4,3 miliarde), IPv6 = 128 de biți. Adresarea IPv6 se configurează la 1.8, iar tipurile de adrese se compară la 1.9.',
  },
  {
    id: '1.7-038', topicId: T, sub: '1.7', type: 'single', difficulty: 2,
    stem: 'Care este echivalentul IPv6 pentru „adrese pentru uz intern” (rolul pe care RFC 1918 îl are în IPv4)?',
    options: [
      { id: 'a', text: 'Unique Local Addresses (ULA), fc00::/7 (în practică fd00::/8)', correct: true, why: 'ULA sunt destinate comunicării interne. De regulă un host IPv6 le folosește în paralel cu o adresă globală, nu în locul ei.' },
      { id: 'b', text: 'Adresele link-local, fe80::/10', correct: false, why: 'Link-local sunt valabile doar pe un singur segment (link) și sunt folosite de protocoalele de bază; nu sunt echivalentul unui bloc privat rutabil intern.' },
      { id: 'c', text: 'Adresa loopback ::1', correct: false, why: 'Este echivalentul lui 127.0.0.1: o singură adresă „eu însumi”.' },
      { id: 'd', text: 'Adresele multicast ff00::/8', correct: false, why: 'Multicast identifică grupuri de receptori; nu are legătură cu adresarea privată.' },
    ],
    explanation: 'ULA = cel mai apropiat echivalent al adreselor private. Diferența: în IPv6 nu se presupune NAT; hostii au adrese globale în paralel.',
  },
  {
    id: '1.7-039', topicId: T, sub: '1.7', type: 'order', difficulty: 3,
    stem: 'Ordonează cronologic răspunsurile la problema epuizării adreselor IPv4.',
    items: [
      { text: 'CIDR (RFC 1518/1519, 1993)', why: 'Elimină risipa claselor: fiecare organizație primește exact cât are nevoie.' },
      { text: 'NAT (RFC 1631, 1994)', why: 'Primul document care descrie traducerea adreselor ca soluție pentru lipsa de adrese.' },
      { text: 'RFC 1918 — adrese private (1996)', why: 'Standardizează blocurile 10/8, 172.16/12 și 192.168/16 pentru refolosire în orice rețea.' },
      { text: 'IPv6 (RFC 2460, 1998)', why: 'Prima specificație IPv6, cu adrese de 128 de biți; revizuită ulterior prin RFC 8200 (2017).' },
      { text: 'RFC 6598 — Shared Address Space pentru CGNAT (2012)', why: 'Rezervă 100.64.0.0/10 pentru NAT la scara operatorului, după epuizarea rezervei IANA din 2011.' },
    ],
    explanation: 'Ordinea corectă după an: 1993 CIDR, 1994 NAT, 1996 RFC 1918, 1998 IPv6, 2012 RFC 6598. Reține logica: mai întâi „mai puțină risipă”, apoi „refolosire”, apoi „spațiu nou” și, la final, NAT la scara operatorului.',
  },
  {
    id: '1.7-040', topicId: T, sub: '1.7', type: 'single', difficulty: 3,
    stem: 'În tabela de traduceri a unui router, ce folosește PAT în loc de număr de port atunci când traduce un ping (ICMP echo)?',
    options: [
      { id: 'a', text: 'ICMP Identifier', correct: true, why: 'ICMP nu are porturi; routerul folosește câmpul Identifier ca să deosebească conversațiile ping, de aceea vezi intrări de forma icmp 203.0.113.2:1.' },
      { id: 'b', text: 'Valoarea TTL a pachetului', correct: false, why: 'TTL se decrementează la fiecare hop și nu identifică o conversație.' },
      { id: 'c', text: 'Adresa MAC sursă', correct: false, why: 'MAC-ul este schimbat la fiecare router și nu intră în traducerea NAT.' },
      { id: 'd', text: 'Portul 80', correct: false, why: 'Portul 80 este HTTP (TCP); ICMP nu folosește deloc porturi.' },
    ],
    explanation: 'Pentru TCP/UDP PAT deosebește conversațiile prin port; pentru ICMP, prin Identifier. Intrările ICMP expiră repede, deci verifică tabela imediat după ping.',
  },
];
