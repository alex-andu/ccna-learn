import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.3 Compare physical interface and cabling types.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
const T = '1.3';

export const Q_1_3: Question[] = [
  // ======================= standarde Ethernet =======================
  {
    id: '1.3-001', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'Ce înseamnă denumirea `1000BASE-T`?',
    options: [
      { id: 'a', text: '1000 Mb/s, transmisie baseband, pe cablu torsadat (twisted pair)', correct: true, why: 'Viteza în Mb/s + BASE (baseband: semnalul ocupă tot mediul) + sufixul mediului: T = twisted pair (cupru, RJ-45). Este standardul IEEE 802.3ab.' },
      { id: 'b', text: '1000 Mb/s pe fibră, cu bază de timp T', correct: false, why: 'Gigabit-ul pe fibră are sufixe precum SX sau LX (802.3z). „T” nu are legătură cu timpul, ci cu twisted pair.' },
      { id: 'c', text: 'Segment de 1000 m pe cablu coaxial gros', correct: false, why: 'Cifra indică lungimea segmentului doar la standardele coaxiale vechi (10BASE5 = 500 m, 10BASE2 ≈ 185 m). La 1000BASE-T, 1000 este viteza.' },
      { id: 'd', text: '1000 Mb/s pe cablu de tip Twinax', correct: false, why: 'Twinax/DAC nu se notează cu -T. Gigabit-ul pe cupru ecranat de tip twinax era 1000BASE-CX (25 m), un standard rar.' },
    ],
    explanation: 'Formula numelui: viteză + BASE + mediu. T/TX = cupru torsadat; SX/SR = fibră multimod 850 nm (short); LX/LR = 1310 nm (long); ER = 1550 nm (extended).',
  },
  {
    id: '1.3-002', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'Care este lungimea maximă a unui segment [[utp|UTP]] 1000BASE-T între un switch și un PC?',
    options: [
      { id: 'a', text: '100 m', correct: true, why: 'Toate standardele pe cupru torsadat, de la 10BASE-T la 10GBASE-T (pe Cat6A), au limita de 100 m: 90 m de cablu fix + 10 m de patch cord-uri.' },
      { id: 'b', text: '185 m', correct: false, why: '185 m era lungimea maximă a unui segment 10BASE2 (coaxial subțire), nu a cuprului torsadat.' },
      { id: 'c', text: '500 m', correct: false, why: '500 m era segmentul 10BASE5 (coaxial gros). Aproape de această valoare e și 1000BASE-SX pe OM2 (550 m), dar acela e fibră.' },
      { id: 'd', text: '1000 m', correct: false, why: 'Cifra 1000 din nume este viteza (Mb/s), nu distanța.' },
    ],
    explanation: '100 m este „regula de aur” a cuprului torsadat. Pentru distanțe mai mari: un switch intermediar sau fibră optică.',
  },
  {
    id: '1.3-003', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Vrei 10GBASE-T între două rack-uri aflate la 90 m. Ce categorie minimă de cablu folosești?',
    options: [
      { id: 'a', text: 'Cat6A', correct: true, why: 'Cat6A (500 MHz) este categoria specificată pentru 10GBASE-T pe întreaga distanță de 100 m.' },
      { id: 'b', text: 'Cat6', correct: false, why: 'Pe Cat6, 10GBASE-T este garantat doar până la ≈55 m. La 90 m ar fi peste limită.' },
      { id: 'c', text: 'Cat5e', correct: false, why: 'Cat5e e potrivit pentru 1000BASE-T și 2.5GBASE-T, nu pentru 10GBASE-T.' },
      { id: 'd', text: 'Cat8', correct: false, why: 'Cat8 e gândit pentru 25/40GBASE-T, dar doar până la 30 m. La 90 m nu e soluția, iar pentru 10G nu e nevoie de el.' },
    ],
    explanation: '10GBASE-T (802.3an, 2006): Cat6A → 100 m, Cat6 → ≈55 m. Frecvențele mari fac diafonia (inclusiv „alien crosstalk” între cabluri) critică.',
  },
  {
    id: '1.3-004', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Ce problemă majoră a rețelelor 10BASE2 a rezolvat 10BASE-T?',
    options: [
      { id: 'a', text: 'Un singur cablu defect sau un conector desfăcut oprea toată rețeaua', correct: true, why: 'La 10BASE2 (magistrală coaxială), o întrerupere sau un terminator lipsă producea reflexii și oprea tot segmentul. 10BASE-T a introdus topologia stea: fiecare stație are cablul ei până la hub, deci un defect afectează un singur dispozitiv.' },
      { id: 'b', text: 'Coliziunile — 10BASE-T cu hub nu mai are coliziuni', correct: false, why: 'Un hub 10BASE-T e tot un mediu partajat: un singur domeniu de coliziune, half-duplex, CSMA/CD. Coliziunile au dispărut abia odată cu switch-urile și full-duplex.' },
      { id: 'c', text: 'Viteza — 10BASE-T rula la 100 Mb/s', correct: false, why: 'Ambele rulează la 10 Mb/s (cifra 10 din nume). 100 Mb/s a venit cu 100BASE-TX (802.3u, 1995).' },
      { id: 'd', text: 'Distanța — 10BASE-T permitea segmente de 500 m', correct: false, why: 'Dimpotrivă, 10BASE-T are 100 m între hub și stație, mai puțin decât 185 m la 10BASE2.' },
    ],
    explanation: 'Fiecare pas al Ethernetului a rezolvat o problemă: 10BASE-T a adus cablarea stea (izolarea defectelor, cablu ieftin de telefonie), nu viteză sau eliminarea coliziunilor.',
  },
  {
    id: '1.3-005', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'De ce a fost creat standardul IEEE 802.3bz ([[nbase-t|2.5GBASE-T / 5GBASE-T]])?',
    options: [
      { id: 'a', text: 'Ca AP-urile Wi-Fi rapide să poată depăși 1 Gb/s pe cablarea Cat5e/Cat6 existentă, fără recablare la Cat6A', correct: true, why: 'AP-urile 802.11ac Wave 2 și Wi-Fi 6 pot genera mai mult de 1 Gb/s. 10GBASE-T ar fi cerut Cat6A; 2.5/5GBASE-T merg până la 100 m pe cablul deja instalat.' },
      { id: 'b', text: 'Ca să înlocuiască fibra între clădiri', correct: false, why: 'Rămâne cupru torsadat, cu limita de 100 m. Între clădiri se folosește în continuare fibra.' },
      { id: 'c', text: 'Ca să furnizeze alimentare PoE', correct: false, why: 'PoE este definit de 802.3af/at/bt. 802.3bz definește doar vitezele de 2.5 și 5 Gb/s.' },
      { id: 'd', text: 'Ca să permită half-duplex la viteze mari', correct: false, why: 'Vitezele multi-gigabit sunt full-duplex. Half-duplex-ul e practic istorie.' },
    ],
    explanation: '802.3bz (2016) = „multigigabit” (Cisco: mGig): 2.5/5 Gb/s pe Cat5e/Cat6, 100 m, folosind toate cele 4 perechi.',
  },
  {
    id: '1.3-006', topicId: T, sub: '1.3.a', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare standard Ethernet cu amendamentul IEEE care l-a definit.',
    leftLabel: 'Standard', rightLabel: 'Amendament IEEE',
    pairs: [
      { left: '10BASE-T', right: '802.3i', why: '802.3i (1990) a definit Ethernetul pe cablu torsadat, în topologie stea.' },
      { left: '100BASE-TX', right: '802.3u', why: '802.3u (1995) = Fast Ethernet, plus autonegocierea.' },
      { left: '1000BASE-SX / LX', right: '802.3z', why: '802.3z (1998) = Gigabit Ethernet pe fibră, bazat pe optica Fibre Channel.' },
      { left: '1000BASE-T', right: '802.3ab', why: '802.3ab (1999) = Gigabit pe cupru Cat5, cu toate cele 4 perechi.' },
      { left: '10GBASE-SR / LR / ER', right: '802.3ae', why: '802.3ae (2002) = 10 Gigabit pe fibră, doar full-duplex.' },
    ],
    distractors: [
      { text: '802.3af', why: '802.3af este primul standard PoE (Power over Ethernet), nu un standard de viteză.' },
      { text: '802.11ac', why: '802.11ac este un standard Wi-Fi (familia 802.11), nu Ethernet (802.3).' },
    ],
    explanation: 'Nu trebuie să memorezi toate literele, dar perechile 802.3u (Fast Ethernet), 802.3z/ab (Gigabit fibră/cupru) și 802.3ae (10G) apar frecvent în materialele CCNA.',
  },
  {
    id: '1.3-007', topicId: T, sub: '1.3.a', type: 'single', difficulty: 3,
    stem: 'Cum reușește 1000BASE-T să transmită 1 Gb/s pe un cablu Cat5, același cablu pe care 100BASE-TX duce doar 100 Mb/s?',
    options: [
      { id: 'a', text: 'Folosește toate cele 4 perechi, în ambele sensuri simultan (cu anularea ecoului), și o modulație cu mai mulți biți pe simbol (PAM-5)', correct: true, why: 'Fiecare pereche duce 250 Mb/s, la aceeași frecvență de simboluri ca 100BASE-TX (125 MBd). Circuitele hibride și anularea ecoului permit emisie și recepție pe aceeași pereche.' },
      { id: 'b', text: 'Folosește tot 2 perechi, dar la o frecvență de 10 ori mai mare', correct: false, why: 'Cablul Cat5 (100 MHz) nu ar suporta o frecvență de 10 ori mai mare. Tocmai de aceea s-au folosit toate perechile și o modulație mai densă.' },
      { id: 'c', text: 'Comprimă datele înainte de transmisie', correct: false, why: 'Ethernetul nu comprimă datele la nivelul fizic. Viteza vine din paralelism (4 perechi) și din codare.' },
      { id: 'd', text: 'Funcționează doar half-duplex, ca să elibereze o pereche', correct: false, why: '1000BASE-T funcționează practic întotdeauna full-duplex. Pe echipamentele Cisco, gigabit-ul este doar full-duplex.' },
    ],
    explanation: 'Consecințe: nu rămân perechi libere pentru alte servicii, autonegocierea devine obligatorie, iar un cablu cu o pereche defectă poate negocia doar 100 Mb/s.',
  },
  {
    id: '1.3-008', topicId: T, sub: '1.3.a', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ standarde folosesc fibră optică?',
    options: [
      { id: 'a', text: '1000BASE-LX', correct: true, why: 'LX = long wavelength (1310 nm), pe fibră monomod (5 km) sau multimod (550 m). 802.3z.' },
      { id: 'b', text: '10GBASE-SR', correct: true, why: 'SR = short range, 850 nm, pe fibră multimod (300 m OM3 / 400 m OM4). 802.3ae.' },
      { id: 'c', text: '1000BASE-T', correct: false, why: '„T” = twisted pair: cupru, RJ-45, 100 m.' },
      { id: 'd', text: '100BASE-TX', correct: false, why: 'Cupru torsadat Cat5, 2 perechi. Varianta pe fibră a Fast Ethernetului se numește 100BASE-FX.' },
      { id: 'e', text: '10GBASE-T', correct: false, why: '10 Gb/s pe cupru torsadat Cat6A (802.3an).' },
    ],
    explanation: 'Litere de fibră: S (short, 850 nm, multimod), L (long, 1310 nm), E (extended, 1550 nm), F în 100BASE-FX. Litera T înseamnă întotdeauna cupru torsadat.',
  },

  // ======================= cupru =======================
  {
    id: '1.3-009', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'De ce sunt răsucite firele din fiecare pereche a unui cablu [[utp|UTP]]?',
    options: [
      { id: 'a', text: 'Ca să anuleze interferențele electromagnetice și diafonia dintre perechi', correct: true, why: 'Semnalul e diferențial (+ și −). Răsucirea face ca zgomotul să afecteze ambele fire la fel, iar receptorul îl elimină prin scădere. Pașii diferiți de răsucire reduc [[crosstalk|diafonia]] dintre perechi.' },
      { id: 'b', text: 'Ca cablul să fie mai flexibil', correct: false, why: 'Flexibilitatea e un efect secundar. Scopul răsucirii este electric, nu mecanic.' },
      { id: 'c', text: 'Ca să crească viteza luminii în cablu', correct: false, why: 'Cablul de cupru transportă semnal electric, nu lumină. Viteza de propagare nu e scopul răsucirii.' },
      { id: 'd', text: 'Ca să identifice ușor perechile după culoare', correct: false, why: 'Perechile se identifică după culori (portocaliu, verde, albastru, maro). Răsucirea are rol de protecție la zgomot.' },
    ],
    explanation: 'UTP nu are ecran: protecția la zgomot vine exclusiv din răsucire (anulare prin semnal diferențial). STP adaugă un ecran metalic pentru medii foarte zgomotoase.',
  },
  {
    id: '1.3-010', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'Ce tip de cablu folosești, clasic, între placa de rețea a unui PC și un port de switch?',
    options: [
      { id: 'a', text: '[[straight-through|Straight-through]]', correct: true, why: 'PC-ul are port MDI (emite pe 1-2), switch-ul are port MDI-X (recepționează pe 1-2). Un cablu drept leagă direct emisia de recepție.' },
      { id: 'b', text: '[[crossover|Crossover]]', correct: false, why: 'Crossover-ul e pentru dispozitive de același tip (switch–switch, PC–PC). Între PC și switch ar încrucișa perechile de două ori (o dată în cablu, o dată în port).' },
      { id: 'c', text: '[[rollover|Rollover]]', correct: false, why: 'Rollover-ul este cablul de consolă (comunicație serială), nu un cablu Ethernet.' },
      { id: 'd', text: 'Cablu serial DCE', correct: false, why: 'Cablurile seriale DCE/DTE leagă interfețe seriale de router, nu plăci Ethernet.' },
    ],
    explanation: 'Dispozitive diferite (MDI ↔ MDI-X) → straight-through. Este cablul folosit în marea majoritate a cazurilor.',
  },
  {
    id: '1.3-011', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Două switch-uri vechi, FĂRĂ [[auto-mdix|Auto-MDIX]], trebuie legate prin porturile lor 10/100 de cupru. Ce cablu folosești?',
    options: [
      { id: 'a', text: 'Crossover', correct: true, why: 'Ambele porturi sunt MDI-X: emit pe 3-6 și recepționează pe 1-2. Crossover-ul (T568A la un capăt, T568B la celălalt) duce emisia unuia în recepția celuilalt.' },
      { id: 'b', text: 'Straight-through', correct: false, why: 'Cu un cablu drept, emisia de pe 3-6 a unui switch ar ajunge pe 3-6 la celălalt, tot emisie. Fără Auto-MDIX, legătura nu se ridică.' },
      { id: 'c', text: 'Rollover', correct: false, why: 'Rollover-ul inversează toți pinii și este doar pentru consolă. Nu e un cablu Ethernet.' },
      { id: 'd', text: 'Orice cablu, switch-urile se adaptează mereu', correct: false, why: 'Doar porturile cu Auto-MDIX se adaptează. Enunțul spune explicit că nu există Auto-MDIX.' },
    ],
    explanation: 'Același tip de port (MDI-X ↔ MDI-X sau MDI ↔ MDI) → crossover. Cu Auto-MDIX, orice cablu funcționează.',
  },
  {
    id: '1.3-012', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Legi direct un PC de portul GigabitEthernet al unui router, fără switch între ele. Porturile NU au Auto-MDIX. Ce cablu folosești?',
    options: [
      { id: 'a', text: 'Crossover', correct: true, why: 'Portul Ethernet al routerului e MDI, la fel ca placa PC-ului. Două porturi MDI au nevoie de încrucișare.' },
      { id: 'b', text: 'Straight-through', correct: false, why: 'Straight-through se folosește între router și switch. Între router și PC, ambele emit pe 1-2 — capcană clasică de examen.' },
      { id: 'c', text: 'Rollover', correct: false, why: 'Rollover-ul se leagă la portul CONSOLE al routerului, pentru CLI, nu la o interfață GigabitEthernet.' },
      { id: 'd', text: 'Serial DTE', correct: false, why: 'Cablurile seriale se folosesc pe interfețele seriale ale routerului, iar PC-ul nu are o astfel de interfață.' },
    ],
    explanation: 'Gândește-te la router ca la „un PC cu mai multe plăci de rețea”: MDI. Router–PC = crossover; router–switch = straight; router–router (Ethernet) = crossover.',
  },
  {
    id: '1.3-013', topicId: T, sub: '1.3.a', type: 'multi', difficulty: 2,
    stem: 'Fără [[auto-mdix|Auto-MDIX]], care DOUĂ legături necesită un cablu crossover?',
    options: [
      { id: 'a', text: 'Switch ↔ hub', correct: true, why: 'Ambele au porturi MDI-X. (Unele hub-uri vechi aveau un port „uplink” special, care permitea straight-through.)' },
      { id: 'b', text: 'PC ↔ PC', correct: true, why: 'Ambele plăci de rețea sunt MDI: emit pe 1-2 și recepționează pe 3-6.' },
      { id: 'c', text: 'PC ↔ switch', correct: false, why: 'MDI ↔ MDI-X: cablu straight-through.' },
      { id: 'd', text: 'Router ↔ switch', correct: false, why: 'Routerul (MDI) se leagă la switch (MDI-X) cu straight-through.' },
      { id: 'e', text: 'Access point ↔ switch', correct: false, why: 'Portul Ethernet al AP-ului e MDI, ca un PC: straight-through spre switch.' },
    ],
    explanation: 'MDI: PC, server, router, firewall, AP. MDI-X: switch, hub. Același grup → crossover; grupuri diferite → straight-through.',
  },
  {
    id: '1.3-014', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'Configurezi un switch nou, fără adresă IP, de pe laptop. Ce cablu și ce setări de terminal folosești, implicit?',
    options: [
      { id: 'a', text: 'Cablu de consolă (rollover) în portul CONSOLE; 9600 baud, 8 biți de date, fără paritate, 1 bit de stop, fără flow control', correct: true, why: 'Portul de consolă oferă acces serial direct la CLI, fără rețea IP. Setarea implicită Cisco este 9600 8N1.' },
      { id: 'b', text: 'Cablu crossover într-un port Ethernet; 115200 baud', correct: false, why: 'Un port Ethernet nu oferă CLI fără IP configurat (și Telnet/SSH). 115200 e o viteză posibilă pe unele echipamente, dar nu valoarea implicită Cisco.' },
      { id: 'c', text: 'Cablu straight-through în portul CONSOLE; 9600 baud', correct: false, why: 'Consola folosește cablul rollover (pinii inversați 1↔8…), nu straight-through.' },
      { id: 'd', text: 'Cablu rollover; 1200 baud, 7 biți, paritate pară', correct: false, why: 'Aceste setări nu sunt cele implicite pe Cisco. Valorile corecte sunt 9600, 8, None, 1, None.' },
    ],
    explanation: 'Consola = acces out-of-band, cablu [[rollover]] (sau USB), terminal 9600 8N1. E metoda pentru configurarea inițială și recuperarea parolei.',
  },
  {
    id: '1.3-015', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Prin ce diferă schemele de terminare [[t568a|T568A]] și [[t568b|T568B]]?',
    options: [
      { id: 'a', text: 'Perechile portocalie și verde își schimbă locul (pinii 1-2 cu 3-6)', correct: true, why: 'În T568B portocaliul e pe 1-2 și verdele pe 3-6; în T568A invers. Albastrul (4-5) și maroul (7-8) rămân pe loc.' },
      { id: 'b', text: 'T568B este pentru gigabit, T568A doar pentru 10/100', correct: false, why: 'Ambele scheme suportă orice viteză. Contează doar ca ambele capete să fie la fel (sau diferite, dacă vrei crossover).' },
      { id: 'c', text: 'Perechile albastră și maro își schimbă locul', correct: false, why: 'Albastrul și maroul sunt în aceeași poziție în ambele scheme.' },
      { id: 'd', text: 'T568A folosește 4 fire, T568B folosește 8', correct: false, why: 'Ambele scheme definesc toate cele 8 fire.' },
    ],
    explanation: 'T568B: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro. T568A: inversezi verdele cu portocaliul. A la un capăt + B la celălalt = crossover 10/100.',
  },
  {
    id: '1.3-016', topicId: T, sub: '1.3.a', type: 'order', difficulty: 2,
    stem: 'Ordonează culorile firelor în conectorul RJ-45 conform [[t568b|T568B]], de la pinul 1 la pinul 8.',
    items: [
      { text: 'alb-portocaliu', why: 'Pinul 1 — TX+ la 10/100 pe un port MDI.' },
      { text: 'portocaliu', why: 'Pinul 2 — TX−. Perechea portocalie ocupă pinii 1-2 în T568B.' },
      { text: 'alb-verde', why: 'Pinul 3 — RX+.' },
      { text: 'albastru', why: 'Pinul 4 — perechea albastră stă în mijloc (4-5).' },
      { text: 'alb-albastru', why: 'Pinul 5.' },
      { text: 'verde', why: 'Pinul 6 — RX−. Perechea verde „încadrează” albastrul: pinii 3 și 6.' },
      { text: 'alb-maro', why: 'Pinul 7.' },
      { text: 'maro', why: 'Pinul 8.' },
    ],
    explanation: 'Mnemonic T568B: „albO-O, albV-Al, albAl-V, albM-M”. Pinii se numără cu clema în jos și contactele spre tine, de la stânga.',
  },
  {
    id: '1.3-017', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Ce face funcția [[auto-mdix|Auto-MDIX]] pe un port de switch?',
    options: [
      { id: 'a', text: 'Detectează dacă perechile trebuie încrucișate și le comută intern, astfel încât să funcționeze atât un cablu drept, cât și unul crossover', correct: true, why: 'Portul alternează între configurațiile MDI și MDI-X până detectează vecinul, apoi rămâne pe cea care funcționează.' },
      { id: 'b', text: 'Negociază automat viteza și duplexul', correct: false, why: 'Asta face [[autonegotiation|autonegocierea]] (speed/duplex auto). Auto-MDIX se ocupă doar de pinii de emisie/recepție.' },
      { id: 'c', text: 'Convertește automat un port de cupru în port de fibră', correct: false, why: 'Mediul fizic e dat de port sau de modulul SFP. Pe porturile combo alegi mediul cu `media-type`.' },
      { id: 'd', text: 'Detectează și repară firele rupte din cablu', correct: false, why: 'Niciun port nu poate repara fizic un cablu. Unele switch-uri pot doar diagnostica cablul (TDR).' },
    ],
    explanation: 'Pe Cisco: comanda de interfață `mdix auto` (implicită pe multe Catalyst; pe unele platforme cere speed/duplex auto). La examen, fără mențiunea Auto-MDIX, aplici regula clasică.',
  },
  {
    id: '1.3-018', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Pe un port [[mdi|MDI]] (de exemplu placa de rețea a unui PC) la 100BASE-TX, pe ce pini se transmite și pe ce pini se recepționează?',
    options: [
      { id: 'a', text: 'Transmite pe 1 și 2, recepționează pe 3 și 6', correct: true, why: 'Așa e definit portul MDI la 10BASE-T/100BASE-TX. Portul MDI-X (switch, hub) face invers.' },
      { id: 'b', text: 'Transmite pe 3 și 6, recepționează pe 1 și 2', correct: false, why: 'Acesta este comportamentul portului MDI-X (switch, hub).' },
      { id: 'c', text: 'Transmite pe 4 și 5, recepționează pe 7 și 8', correct: false, why: 'La 10/100 Mb/s pinii 4, 5, 7, 8 nu sunt folosiți pentru date. Gigabit-ul îi folosește pe toți, bidirecțional.' },
      { id: 'd', text: 'Transmite și recepționează pe toți cei 8 pini simultan', correct: false, why: 'Acesta e modul 1000BASE-T (4 perechi bidirecționale), nu 100BASE-TX.' },
    ],
    explanation: '10/100: doar pinii 1, 2, 3, 6. MDI: TX 1-2 / RX 3-6. MDI-X: RX 1-2 / TX 3-6. De aici regula straight vs crossover.',
  },
  {
    id: '1.3-019', topicId: T, sub: '1.3.a', type: 'single', difficulty: 3,
    stem: 'Într-o hală cu motoare electrice mari, un tehnician propune cablu [[stp-cable|STP]] în locul celui UTP pentru legăturile de 60 m. Ce condiție e esențială ca STP-ul să-și facă efectul?',
    options: [
      { id: 'a', text: 'Ecranul trebuie legat corect la împământare, cu conectori și echipamente ecranate', correct: true, why: 'Ecranul blochează interferențele doar dacă e conectat la masă; un ecran „plutitor” poate chiar capta zgomot ca o antenă.' },
      { id: 'b', text: 'Cablul trebuie să fie crossover', correct: false, why: 'Ecranarea nu are legătură cu ordinea pinilor. Tipul de cablu (drept/încrucișat) se alege după dispozitive.' },
      { id: 'c', text: 'Lungimea trebuie să depășească 100 m', correct: false, why: 'Limita de 100 m se aplică și cablului STP. Ecranarea nu prelungește distanța.' },
      { id: 'd', text: 'Perechile trebuie desfăcute (netorsadate)', correct: false, why: 'Și STP-ul are perechi torsadate — ecranul se adaugă răsucirii, nu o înlocuiește.' },
    ],
    explanation: 'În medii cu EMI puternic ai două opțiuni: STP corect împământat sau fibră optică (complet imună la EMI și cu izolare electrică).',
  },
  {
    id: '1.3-020', topicId: T, sub: '1.3.a', type: 'single', difficulty: 3,
    stem: 'Un cablu crossover „complet” pentru gigabit încrucișează, pe lângă 1↔3 și 2↔6, ce alți pini?',
    options: [
      { id: 'a', text: '4↔7 și 5↔8', correct: true, why: 'La 1000BASE-T toate perechile transportă date, așa că se încrucișează și perechea albastră (4-5) cu cea maro (7-8).' },
      { id: 'b', text: '4↔5 și 7↔8', correct: false, why: 'Asta ar inversa firele în interiorul aceleiași perechi (polaritate), nu ar încrucișa perechile.' },
      { id: 'c', text: 'Niciunul — gigabit-ul nu folosește pinii 4, 5, 7, 8', correct: false, why: 'Gigabit-ul folosește toate cele 4 perechi, bidirecțional.' },
      { id: 'd', text: '1↔8, 2↔7, 3↔6, 4↔5', correct: false, why: 'Aceasta e schema rollover-ului (cablul de consolă).' },
    ],
    explanation: 'În practică, crossover-ul de gigabit e rar: 1000BASE-T are aproape întotdeauna Auto-MDIX, iar orice cablu drept funcționează.',
  },

  // ======================= fibră =======================
  {
    id: '1.3-021', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'Care afirmație despre diametrul miezului este corectă?',
    options: [
      { id: 'a', text: '[[smf|SMF]] are miezul de ≈9 µm, iar [[mmf|MMF]] de 50 sau 62.5 µm; ambele au învelișul de 125 µm', correct: true, why: 'Miezul subțire al monomodului permite un singur mod de propagare. Învelișul standard de 125 µm este același la ambele.' },
      { id: 'b', text: 'SMF are miezul mai mare, de aceea merge mai departe', correct: false, why: 'Invers: SMF are miezul MAI MIC (≈9 µm). Distanța mare vine din faptul că un singur mod nu produce dispersie modală.' },
      { id: 'c', text: 'Ambele au miezul de 125 µm', correct: false, why: '125 µm este diametrul învelișului (cladding), nu al miezului.' },
      { id: 'd', text: 'MMF are miezul de 9 µm, SMF de 50 µm', correct: false, why: 'Valorile sunt inversate.' },
    ],
    explanation: 'Notații uzuale: 9/125 (monomod), 50/125 și 62.5/125 (multimod). Paradoxul de reținut: miez mai mic = distanță mai mare.',
  },
  {
    id: '1.3-022', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'Trebuie să legi două clădiri aflate la 8 km, la 10 Gb/s. Ce alegi?',
    options: [
      { id: 'a', text: 'Fibră monomod cu 10GBASE-LR (1310 nm, până la 10 km)', correct: true, why: 'LR = long reach pe monomod, 10 km. Monomodul nu are dispersie modală, deci acoperă kilometri.' },
      { id: 'b', text: 'Fibră multimod OM4 cu 10GBASE-SR', correct: false, why: '10GBASE-SR ajunge doar la ≈400 m pe OM4.' },
      { id: 'c', text: 'Cablu Cat6A cu 10GBASE-T', correct: false, why: 'Cuprul torsadat e limitat la 100 m. În plus, între clădiri fibra oferă izolare electrică.' },
      { id: 'd', text: 'Cablu DAC SFP+', correct: false, why: 'DAC-urile (twinax) merg doar câțiva metri, în același rack sau între rack-uri vecine.' },
    ],
    explanation: 'Ghid rapid: ≤100 m cupru; sute de metri multimod (SR/SX); până la 10 km monomod LR/LX; ≈40 km monomod ER (1550 nm).',
  },
  {
    id: '1.3-023', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Ce fenomen limitează în principal distanța pe fibra multimod?',
    options: [
      { id: 'a', text: '[[modal-dispersion|Dispersia modală]] — modurile parcurg trasee de lungimi diferite și impulsul se lățește', correct: true, why: 'Razele care ricoșează mult ajung mai târziu decât cele care merg drept. După o anumită distanță, impulsurile vecine se suprapun și biții nu mai pot fi distinși.' },
      { id: 'b', text: 'Interferențele electromagnetice', correct: false, why: 'Fibra (orice tip) transportă lumină și este imună la EMI.' },
      { id: 'c', text: 'Diafonia dintre perechi', correct: false, why: 'Diafonia (crosstalk) este o problemă a cuprului torsadat, nu a fibrei.' },
      { id: 'd', text: 'Coliziunile', correct: false, why: 'Legăturile pe fibră sunt punct-la-punct, de regulă full-duplex: nu au coliziuni. Distanța e o limită fizică a mediului.' },
    ],
    explanation: 'Fibra graded-index (OM2+) reduce dispersia modală, iar OM3/OM4 (laser-optimized) au lățime de bandă modală mare. Monomodul o elimină complet.',
  },
  {
    id: '1.3-024', topicId: T, sub: '1.3.a', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre fibra [[mmf|multimod]] sunt corecte?',
    options: [
      { id: 'a', text: 'Folosește de obicei surse ieftine, LED sau [[vcsel|VCSEL]], la 850 nm', correct: true, why: 'Miezul mare permite surse mai ieftine și mai puțin precise decât laserele pentru monomod.' },
      { id: 'b', text: 'Are miezul mai mare decât fibra monomod', correct: true, why: '50 sau 62.5 µm, față de ≈9 µm la monomod.' },
      { id: 'c', text: 'Ajunge mai departe decât fibra monomod', correct: false, why: 'Invers: multimodul merge sute de metri, monomodul kilometri.' },
      { id: 'd', text: 'Este singurul tip de fibră imun la interferențe electromagnetice', correct: false, why: 'Ambele tipuri de fibră sunt imune la EMI — lumina nu e afectată de câmpuri electromagnetice.' },
      { id: 'e', text: 'Are mantaua galbenă', correct: false, why: 'Mantaua galbenă indică fibra monomod. Multimodul e portocaliu (OM1/OM2), aqua (OM3/OM4) sau verde-lime (OM5).' },
    ],
    explanation: 'MMF: miez mare, optică ieftină (850 nm), sute de metri, folosită în clădiri și centre de date. SMF: miez mic, laser 1310/1550 nm, kilometri.',
  },
  {
    id: '1.3-025', topicId: T, sub: '1.3.a', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare conector de fibră cu descrierea lui.',
    leftLabel: 'Descriere', rightLabel: 'Conector',
    pairs: [
      { left: 'Mic (ferulă 1.25 mm), cu clemă ca RJ-45; standard pe modulele SFP/SFP+', right: 'LC', why: '[[lc-connector|LC]] este conectorul de fibră cel mai comun azi, folosit de obicei duplex.' },
      { left: 'Pătrat, ferulă 2.5 mm, se cuplează prin împingere și se scoate prin tragere', right: 'SC', why: '[[sc-connector|SC]] (push-pull) — întâlnit pe GBIC-uri și la operatori/FTTH.' },
      { left: 'Rotund, cu prindere tip baionetă (împingi și răsucești)', right: 'ST', why: '[[st-connector|ST]] — instalații multimod mai vechi.' },
      { left: 'Dreptunghiular, cuplează 8–24 de fibre deodată', right: 'MPO', why: '[[mpo|MPO/MTP]] — folosit de transceiverele paralele 40/100G SR4.' },
    ],
    distractors: [
      { text: 'RJ-45', why: 'RJ-45 (8P8C) este conectorul cablului de cupru torsadat, nu de fibră.' },
      { text: 'BNC', why: 'BNC este conectorul cablului coaxial (10BASE2), nu de fibră.' },
    ],
    explanation: 'Pentru examen, cel mai important: LC pe SFP/SFP+. SC și ST sunt mai mari și mai vechi; MPO apare la 40/100G în centrele de date.',
  },
  {
    id: '1.3-026', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Ce format de transceiver se folosește tipic pentru un port de 40 Gb/s?',
    options: [
      { id: 'a', text: '[[qsfp|QSFP+]]', correct: true, why: 'QSFP+ = Quad SFP: patru canale de 10G în paralel = 40G.' },
      { id: 'b', text: '[[sfp|SFP]]', correct: false, why: 'SFP este, tipic, pentru 1 Gb/s.' },
      { id: 'c', text: '[[sfp-plus|SFP+]]', correct: false, why: 'SFP+ este pentru 10 Gb/s.' },
      { id: 'd', text: '[[gbic|GBIC]]', correct: false, why: 'GBIC este predecesorul mare al SFP-ului, pentru 1 Gb/s.' },
    ],
    explanation: 'SFP 1G · SFP+ 10G · SFP28 25G · QSFP+ 40G (4×10) · QSFP28 100G (4×25). Formatele sunt definite de acorduri MSA între producători.',
  },
  {
    id: '1.3-027', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'După instalarea unui patch cord de fibră duplex nou între două switch-uri, interfețele rămân down/down. Modulele sunt identice (1000BASE-SX) și fibra e multimod. Care e cea mai probabilă cauză?',
    options: [
      { id: 'a', text: 'Fibrele TX și RX sunt inversate: TX-ul unui capăt ajunge în TX-ul celuilalt', correct: true, why: 'Pe o legătură duplex, TX trebuie să ajungă în RX. Dacă fibrele nu sunt încrucișate corect, niciun capăt nu primește lumină → down/down. Se inversează cele două fibre la un singur capăt.' },
      { id: 'b', text: 'Lipsește Auto-MDIX pe porturile de fibră', correct: false, why: 'Auto-MDIX este o funcție a porturilor de cupru RJ-45. Pe fibră, polaritatea se corectează fizic.' },
      { id: 'c', text: 'Cablul trebuie să fie crossover T568A/T568B', correct: false, why: 'T568A/B sunt scheme de culori pentru cuprul torsadat, nu pentru fibră.' },
      { id: 'd', text: 'Interferențe electromagnetice din tavan', correct: false, why: 'Fibra este imună la EMI.' },
    ],
    explanation: 'Cauze frecvente de down/down pe fibră: polaritate TX/RX inversată, module incompatibile (SX cu LX), fibră de tip greșit, conectori murdari, fibră ruptă.',
  },
  {
    id: '1.3-028', topicId: T, sub: '1.3.a', type: 'single', difficulty: 3,
    stem: 'Între două clădiri ai o singură fibră monomod liberă. Cum obții totuși o legătură de 1 Gb/s full-duplex?',
    options: [
      { id: 'a', text: 'Cu o pereche de module [[bidi|BiDi]] complementare, care emit și recepționează pe lungimi de undă diferite (de exemplu 1310/1490 nm) pe aceeași fibră', correct: true, why: 'Exemplu standard: 1000BASE-BX10 (802.3ah), 10 km. Un capăt emite pe 1310 și recepționează pe 1490 nm, celălalt invers.' },
      { id: 'b', text: 'Cu două module 1000BASE-LX obișnuite, pe aceeași fibră', correct: false, why: 'Modulele LX obișnuite au nevoie de două fibre (TX și RX). Pe o singură fibră ar lipsi calea de recepție.' },
      { id: 'c', text: 'Imposibil — full-duplex cere întotdeauna două fibre', correct: false, why: 'Multiplexarea după lungime de undă permite ambele sensuri pe aceeași fibră.' },
      { id: 'd', text: 'Setând interfețele pe half-duplex', correct: false, why: 'Half-duplex nu rezolvă lipsa căii fizice de recepție și nici nu e suportat pe gigabit-ul de fibră uzual.' },
    ],
    explanation: 'BiDi economisește fibre (utile când fibrele sunt închiriate). Modulele se montează în perechi: „U” (upstream) la un capăt și „D” (downstream) la celălalt.',
  },
  {
    id: '1.3-029', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Ai nevoie de 10GBASE-SR pe o distanță de 350 m într-un centru de date. Ce fibră multimod minimă folosești?',
    options: [
      { id: 'a', text: 'OM4', correct: true, why: '10GBASE-SR este specificat până la 400 m pe OM4.' },
      { id: 'b', text: 'OM3', correct: false, why: 'Pe OM3, 10GBASE-SR ajunge până la 300 m — insuficient pentru 350 m.' },
      { id: 'c', text: 'OM2', correct: false, why: 'Pe OM2, 10GBASE-SR ajunge doar la 82 m.' },
      { id: 'd', text: 'OM1', correct: false, why: 'Pe OM1 (62.5 µm), 10GBASE-SR ajunge doar la 33 m.' },
    ],
    explanation: '10GBASE-SR: 33 m (OM1) · 82 m (OM2) · 300 m (OM3) · 400 m (OM4). Pentru mai mult: monomod cu 10GBASE-LR.',
  },
  {
    id: '1.3-030', topicId: T, sub: '1.3.a', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare standard de fibră cu lungimea de undă și distanța lui tipică.',
    leftLabel: 'Standard', rightLabel: 'Lungime de undă / mediu / distanță',
    pairs: [
      { left: '1000BASE-SX', right: '850 nm · multimod · până la 550 m', why: 'S = short wavelength: VCSEL 850 nm pe multimod (275 m OM1, 550 m OM2).' },
      { left: '1000BASE-LX', right: '1310 nm · monomod · 5 km', why: 'L = long wavelength: laser 1310 nm; pe multimod doar 550 m.' },
      { left: '10GBASE-LR', right: '1310 nm · monomod · 10 km', why: 'LR = long reach, 10 km pe monomod.' },
      { left: '10GBASE-ER', right: '1550 nm · monomod · 40 km', why: 'ER = extended reach; la 1550 nm atenuarea fibrei e minimă.' },
    ],
    distractors: [
      { text: '2.4 GHz · aer · 100 m', why: 'Aceasta descrie o bandă Wi-Fi (1.11), nu un standard de fibră.' },
      { text: '850 nm · monomod · 80 km', why: 'Combinație fără sens: 850 nm e folosit pe multimod, pentru distanțe scurte.' },
    ],
    explanation: '850 nm = multimod, distanțe scurte · 1310 nm = monomod (LX/LR) · 1550 nm = monomod, distanțe lungi (ER, ZX/ZR).',
  },
  {
    id: '1.3-031', topicId: T, sub: '1.3.a', type: 'single', difficulty: 1,
    stem: 'Care este un avantaj al fibrei optice față de cuprul torsadat, pe lângă distanța mai mare?',
    options: [
      { id: 'a', text: 'Este imună la interferențe electromagnetice și oferă izolare electrică între clădiri', correct: true, why: 'Fibra transportă lumină: nu e afectată de motoare sau cabluri de forță și nu creează bucle de masă ori nu aduce supratensiuni între clădiri.' },
      { id: 'b', text: 'Poate transporta alimentare PoE pentru AP-uri', correct: false, why: 'PoE funcționează doar pe cupru. Fibra nu transportă curent electric.' },
      { id: 'c', text: 'Este mai ieftin de terminat și nu cere unelte speciale', correct: false, why: 'Dimpotrivă: terminarea fibrei cere unelte și pregătire, iar modulele optice costă mai mult.' },
      { id: 'd', text: 'Se poate îndoi oricât fără pierderi', correct: false, why: 'Fibra are o rază minimă de curbură; îndoirea excesivă produce pierderi sau o poate rupe.' },
    ],
    explanation: 'Fibra: distanță, imunitate EMI, izolare electrică, securitate. Cuprul: cost mic, ușor de terminat, PoE.',
  },

  // ======================= 1.3.b — conexiuni =======================
  {
    id: '1.3-032', topicId: T, sub: '1.3.b', type: 'single', difficulty: 1,
    stem: 'Patru PC-uri sunt conectate la un [[hub]]. Câte domenii de coliziune există?',
    options: [
      { id: 'a', text: '1', correct: true, why: 'Hub-ul (nivel 1) repetă semnalul pe toate porturile: toate dispozitivele împart același mediu → un singur [[collision-domain|domeniu de coliziune]].' },
      { id: 'b', text: '4', correct: false, why: '4 ar fi răspunsul pentru un switch, unde fiecare port este un domeniu de coliziune separat.' },
      { id: 'c', text: '5', correct: false, why: 'Hub-ul nu se numără separat; el face parte din același mediu partajat.' },
      { id: 'd', text: '0', correct: false, why: 'Pe un hub, coliziunile sunt posibile — deci există un domeniu de coliziune.' },
    ],
    explanation: 'Hub: 1 domeniu de coliziune și 1 domeniu de broadcast, half-duplex, CSMA/CD.',
  },
  {
    id: '1.3-033', topicId: T, sub: '1.3.b', type: 'single', difficulty: 2,
    stem: 'Un switch are 8 PC-uri conectate, toate în același VLAN. Câte domenii de coliziune și câte domenii de broadcast există?',
    options: [
      { id: 'a', text: '8 domenii de coliziune, 1 domeniu de broadcast', correct: true, why: 'Fiecare port de switch este un domeniu de coliziune separat. Switch-ul propagă broadcast-urile pe toate porturile din VLAN → un singur [[broadcast-domain|domeniu de broadcast]].' },
      { id: 'b', text: '1 domeniu de coliziune, 8 domenii de broadcast', correct: false, why: 'Invers. Un singur domeniu de coliziune ar fi la un hub; 8 domenii de broadcast ar cere 8 VLAN-uri sau 8 interfețe de router.' },
      { id: 'c', text: '8 domenii de coliziune, 8 domenii de broadcast', correct: false, why: 'Switch-ul nu oprește broadcast-urile (fără VLAN-uri diferite).' },
      { id: 'd', text: '1 domeniu de coliziune, 1 domeniu de broadcast', correct: false, why: 'Acesta e răspunsul pentru un hub, nu pentru un switch.' },
    ],
    explanation: 'Switch: separă domeniile de coliziune (per port), nu și pe cele de broadcast. Doar routerele și VLAN-urile separă domeniile de broadcast.',
  },
  {
    id: '1.3-034', topicId: T, sub: '1.3.b', type: 'single', difficulty: 3,
    stem: 'Un router are două interfețe LAN. Interfața 1 e legată la SW-A, care are 3 PC-uri. Interfața 2 e legată la SW-B, la care e conectat un singur hub cu 4 PC-uri. Câte domenii de coliziune și de broadcast există?',
    options: [
      { id: 'a', text: '6 domenii de coliziune, 2 domenii de broadcast', correct: true, why: 'Coliziune: router–SW-A (1), router–SW-B (2), cele 3 PC-uri pe SW-A (3, 4, 5), SW-B–hub cu toate PC-urile hub-ului (6). Broadcast: câte unul pe fiecare interfață de router (2).' },
      { id: 'b', text: '9 domenii de coliziune, 2 domenii de broadcast', correct: false, why: 'Ai numărat separat fiecare PC al hub-ului. Tot ce e în spatele unui hub formează un singur domeniu de coliziune.' },
      { id: 'c', text: '4 domenii de coliziune, 1 domeniu de broadcast', correct: false, why: 'Ai uitat legăturile router–switch (sunt și ele domenii de coliziune) și faptul că routerul separă broadcast-urile.' },
      { id: 'd', text: '6 domenii de coliziune, 3 domenii de broadcast', correct: false, why: 'Hub-ul și switch-ul nu creează domenii de broadcast noi. Doar cele 2 interfețe de router contează.' },
    ],
    explanation: 'Metodă: numără fiecare legătură care pornește dintr-un port de switch sau de router; segmentul din spatele unui hub contează o singură dată. Broadcast: interfețele de router (sau VLAN-urile).',
  },
  {
    id: '1.3-035', topicId: T, sub: '1.3.b', type: 'single', difficulty: 2,
    stem: 'Ce condiție este necesară pentru ca o legătură Ethernet să funcționeze [[full-duplex]]?',
    options: [
      { id: 'a', text: 'Legătura trebuie să fie punct-la-punct (de exemplu port de switch ↔ un singur dispozitiv), fără hub', correct: true, why: 'Full-duplex înseamnă emisie și recepție simultane pe căi separate. Este posibil doar când pe mediu sunt exact două capete; pe un hub mediul e partajat.' },
      { id: 'b', text: 'Ambele capete trebuie să folosească CSMA/CD', correct: false, why: 'În full-duplex, CSMA/CD este dezactivat — nu există coliziuni de detectat.' },
      { id: 'c', text: 'Cablul trebuie să fie crossover', correct: false, why: 'Tipul de cablu ține de MDI/MDI-X, nu de duplex. Legăturile straight-through PC–switch sunt full-duplex.' },
      { id: 'd', text: 'Viteza trebuie să fie 10 Mb/s', correct: false, why: 'Full-duplex funcționează la orice viteză; de la 10G în sus Ethernetul este chiar exclusiv full-duplex.' },
    ],
    explanation: 'Point-to-point + full-duplex = fără coliziuni, lățime de bandă completă pe fiecare sens. Shared media (hub, coaxial) = half-duplex + CSMA/CD.',
  },
  {
    id: '1.3-036', topicId: T, sub: '1.3.b', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii [[csma-cd|CSMA/CD]] pentru o stație care vrea să transmită pe un mediu partajat și întâlnește o coliziune.',
    items: [
      { text: 'Ascultă mediul (carrier sense) până când e liber', why: 'Stația nu transmite dacă detectează deja un semnal pe fir.' },
      { text: 'Începe transmisia cadrului', why: 'Mediul pare liber, așa că transmite — dar o altă stație poate face același lucru aproape simultan.' },
      { text: 'Detectează coliziunea în timp ce încă transmite', why: 'Compară ce trimite cu ce „vede” pe fir; o diferență înseamnă coliziune.' },
      { text: 'Trimite semnalul de jam', why: 'Toate stațiile de pe segment află sigur că a avut loc o coliziune.' },
      { text: 'Așteaptă un timp aleatoriu (backoff)', why: 'Timpii aleatorii diferiți reduc șansa unei noi coliziuni între aceleași stații.' },
      { text: 'Reia procesul ascultând din nou mediul', why: 'După backoff, stația reîncearcă; după 16 eșecuri, cadrul e abandonat.' },
    ],
    explanation: 'CSMA/CD = Carrier Sense, Multiple Access, Collision Detection. Folosit doar în half-duplex (hub, coaxial). Wi-Fi folosește CSMA/CA.',
  },
  {
    id: '1.3-037', topicId: T, sub: '1.3.b', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ caracteristici descriu o rețea Ethernet pe mediu partajat ([[shared-media|shared media]], de exemplu un hub)?',
    options: [
      { id: 'a', text: 'Dispozitivele funcționează half-duplex', correct: true, why: 'Pe un mediu comun, doar un dispozitiv poate transmite la un moment dat.' },
      { id: 'b', text: 'Accesul la mediu este reglat de CSMA/CD', correct: true, why: 'Stațiile ascultă înainte să transmită și detectează coliziunile.' },
      { id: 'c', text: 'Fiecare dispozitiv are propriul domeniu de coliziune', correct: false, why: 'Asta e caracteristica unui switch. Pe un hub, toate dispozitivele sunt într-un singur domeniu de coliziune.' },
      { id: 'd', text: 'Broadcast-urile sunt oprite la fiecare port', correct: false, why: 'Hub-ul repetă tot, inclusiv broadcast-urile, pe toate porturile.' },
      { id: 'e', text: 'Toate dispozitivele pot transmite simultan fără coliziuni', correct: false, why: 'Asta descrie full-duplex pe legături punct-la-punct, nu un mediu partajat.' },
    ],
    explanation: 'Shared media: half-duplex, CSMA/CD, un domeniu de coliziune, lățime de bandă împărțită. Exemple: 10BASE5, 10BASE2, hub 10BASE-T.',
  },
  {
    id: '1.3-038', topicId: T, sub: '1.3.b', type: 'single', difficulty: 2,
    stem: 'Pe o [[serial-link|legătură serială]] punct-la-punct de laborator între două routere, care capăt trebuie să furnizeze semnalul de ceas cu `clock rate`?',
    options: [
      { id: 'a', text: 'Capătul DCE', correct: true, why: 'DCE (Data Communications Equipment) dă ceasul — în rețeaua reală, echipamentul operatorului; în laborator, routerul la care e conectat capătul DCE al cablului.' },
      { id: 'b', text: 'Capătul DTE', correct: false, why: 'DTE (routerul clientului) primește ceasul de la DCE.' },
      { id: 'c', text: 'Ambele capete, cu aceeași valoare', correct: false, why: 'Doar DCE-ul generează ceasul; pe DTE comanda `clock rate` nu are efect.' },
      { id: 'd', text: 'Niciunul — legăturile seriale nu folosesc ceas', correct: false, why: 'Legăturile seriale sincrone au nevoie de un ceas comun ca să delimiteze biții.' },
    ],
    explanation: '`show controllers serial 0/0/0` arată ce capăt de cablu (DCE/DTE) e conectat. Încapsulare implicită Cisco: [[hdlc|HDLC]]; alternativa standard: [[ppp|PPP]].',
  },

  // ======================= CLI =======================
  {
    id: '1.3-039', topicId: T, sub: '1.3.a', type: 'cli', difficulty: 2,
    stem: 'Ești în modul de configurare al unei interfețe de switch Cisco. Ce comandă activează [[auto-mdix|Auto-MDIX]]?',
    prompt: 'SW1(config-if)#', canonical: 'mdix auto',
    answers: ['mdix auto'],
    hint: 'patru litere + „auto”',
    wrong: [
      { text: 'auto-mdix', why: 'Nu există această comandă. Sintaxa IOS este `mdix auto`.' },
      { text: 'speed auto', why: 'Activează autonegocierea vitezei, nu detecția tipului de cablu (deși pe unele platforme Auto-MDIX cere speed auto).' },
      { text: 'duplex auto', why: 'Negociază duplexul, nu comutarea pinilor MDI/MDI-X.' },
      { text: 'media-type auto', why: '`media-type` alege conectorul pe un port combo (RJ-45 sau SFP), nu încrucișarea perechilor.' },
    ],
    explanation: '`mdix auto` / `no mdix auto` în modul interfață. Pe multe switch-uri Catalyst este activ implicit.',
  },
  {
    id: '1.3-040', topicId: T, sub: '1.3.a', type: 'cli', difficulty: 2,
    stem: 'Ce comandă din privileged EXEC afișează, pentru toate porturile unui switch, starea, VLAN-ul, duplexul, viteza și tipul de mediu (de exemplu `10/100/1000BaseTX` sau `1000BaseSX SFP`)?',
    prompt: 'SW1#', canonical: 'show interfaces status',
    answers: ['show interfaces status', 'show interface status', 'sh int status', 'sh interfaces status', 'sh int stat', 'show int status'],
    hint: 'show interfaces + un cuvânt',
    wrong: [
      { text: 'show ip interface brief', why: 'Arată IP-ul și starea L1/L2 a interfețelor, dar nu duplexul, viteza sau tipul de mediu.' },
      { text: 'show interfaces', why: 'Afișează detaliat fiecare interfață (inclusiv duplex/viteză), dar nu sub forma unui tabel rezumat cu VLAN și Type.' },
      { text: 'show vlan brief', why: 'Arată VLAN-urile și porturile alocate, fără duplex, viteză sau tipul mediului.' },
    ],
    explanation: 'În `show interfaces status`, prefixul „a-” (a-full, a-1000) indică valori obținute prin autonegociere; fără „a-” valorile sunt setate manual.',
  },
  {
    id: '1.3-041', topicId: T, sub: '1.3.a', type: 'cli', difficulty: 3,
    stem: 'Suspectezi un conector de fibră murdar pe un uplink SFP+. Ce comandă din privileged EXEC afișează puterea optică emisă și recepționată (DOM) a modulelor?',
    prompt: 'SW1#', canonical: 'show interfaces transceiver',
    answers: ['show interfaces transceiver', 'show interface transceiver', 'sh int transceiver', 'sh int trans', 'show int transceiver', 'show interfaces transceiver detail', 'sh int transceiver detail'],
    hint: 'show interfaces + numele modulului',
    wrong: [
      { text: 'show inventory', why: 'Arată ce module sunt introduse (PID, serie), dar nu valorile de putere optică.' },
      { text: 'show interfaces status', why: 'Arată starea, viteza și tipul modulului, nu puterea TX/RX.' },
      { text: 'show controllers', why: 'Pe switch-uri arată detalii despre controller/PHY, nu valorile [[dom|DOM]] ale modulelor optice.' },
    ],
    explanation: '`show interfaces transceiver [detail]` afișează temperatura, tensiunea, curentul laserului și puterea TX/RX în dBm, cu praguri de avertizare. O putere RX foarte mică = conector murdar, fibră îndoită sau distanță prea mare.',
  },
  {
    id: '1.3-042', topicId: T, sub: '1.3.a', type: 'cli', difficulty: 2,
    stem: 'Un server vechi are placa de rețea fixată la 100 Mb/s. Ești în modul interfață pe portul de switch. Ce comandă fixează viteza portului la 100 Mb/s?',
    prompt: 'SW1(config-if)#', canonical: 'speed 100',
    answers: ['speed 100'],
    hint: 'un cuvânt-cheie + valoarea în Mb/s',
    wrong: [
      { text: 'bandwidth 100000', why: '`bandwidth` schimbă doar valoarea folosită de protocoalele de rutare pentru metrică (în kb/s); nu modifică viteza fizică a portului.' },
      { text: 'speed 100000', why: 'Valoarea pentru `speed` se dă în Mb/s: 10, 100, 1000.' },
      { text: 'duplex 100', why: '`duplex` acceptă doar auto, full sau half.' },
    ],
    explanation: 'Setarea manuală (speed + duplex) dezactivează autonegocierea pe port. Regula Cisco: ambele capete pe auto sau ambele setate identic — altfel apare un duplex mismatch (1.4).',
  },
  {
    id: '1.3-043', topicId: T, sub: '1.3.a', type: 'single', difficulty: 2,
    stem: 'Trebuie să legi un switch dintr-o hală de producție cu motoare și aparate de sudură de switch-ul din birou, la 80 m. Care este cea mai bună alegere de mediu?',
    options: [
      { id: 'a', text: 'Fibră optică (de exemplu multimod cu 1000BASE-SX)', correct: true, why: 'Fibra este imună la EMI, deci zgomotul electric al motoarelor nu produce erori. Distanța de 80 m e acoperită lejer de multimod.' },
      { id: 'b', text: 'UTP Cat5e, pentru că distanța e sub 100 m', correct: false, why: 'Distanța e în limită, dar EMI puternic ar induce zgomot și erori CRC pe un cablu neecranat.' },
      { id: 'c', text: 'Fibră monomod cu 10GBASE-ER', correct: false, why: 'Ar funcționa, dar ER (40 km) e o optică scumpă, complet nepotrivită pentru 80 m.' },
      { id: 'd', text: 'Cablu coaxial 10BASE2', correct: false, why: 'Tehnologie învechită (10 Mb/s, magistrală), nesuportată de switch-urile moderne.' },
    ],
    explanation: 'Alegerea mediului: distanța (cupru ≤100 m) + mediul (EMI, între clădiri → fibră) + costul (multimodul e cea mai ieftină optică). O alternativă acceptabilă: STP corect împământat.',
  },
];
