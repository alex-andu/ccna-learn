import type { Question } from '../../lib/types';

// Banca de întrebări pentru 3.1 Interpret the components of routing table.
// Sub-puncte oficiale: a cod · b prefix · c mască · d next hop · e AD · f metric · g gateway of last resort. Fiecare variantă are explicație (why).
const T = '3.1';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'multi', difficulty, stem, options: opts(o), explanation });

const ROUTE_SAMPLE = 'O 10.2.2.0/24 [110/20] via 10.1.1.2, 00:01:10, GigabitEthernet0/0';

export const Q_3_1: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '3.1-001' }, '3.1', 1, 'Ce este tabela de rutare a unui router?', [
    ['O listă de rețele cunoscute, cu informații despre cum se ajunge la fiecare', true, 'Exact: fiecare rută spune ce rețea acoperă și încotro se trimite pachetul.'],
    ['Lista adreselor MAC învățate pe porturi', false, 'Aceea este tabela MAC a unui switch (1.13).'],
    ['Lista adreselor IP alocate prin DHCP', false, 'Aceea este baza de date (binding-urile) serverului DHCP.'],
    ['Lista conexiunilor TCP active', false, 'Conexiunile TCP sunt ținute de gazde, nu de tabela de rutare.'],
  ], 'Tabela de rutare = rețele cunoscute + cum se ajunge la ele; se vede cu show ip route.'),
  single({ id: '3.1-002' }, '3.1', 1, 'Cum se numește comanda IOS care afișează tabela de rutare IPv4?', [
    ['show ip route', true, 'Comanda standard pentru tabela de rutare IPv4.'],
    ['show route table', false, 'Nu este comandă IOS validă.'],
    ['show ip interface brief', false, 'Arată starea și adresele interfețelor, nu rutele.'],
    ['show mac address-table', false, 'Arată tabela MAC a unui switch.'],
  ], 'show ip route.'),
  single({ id: '3.1-003' }, '3.1', 2, `Din linia „${ROUTE_SAMPLE}”, care este next hop-ul?`, [
    ['10.1.1.2', true, 'Adresa de după „via” este next hop-ul.'],
    ['10.2.2.0', false, 'Este prefixul (rețeaua de destinație), nu next hop-ul.'],
    ['110', false, 'Este AD-ul sursei (OSPF).'],
    ['GigabitEthernet0/0', false, 'Este interfața de ieșire, nu adresa de next hop.'],
  ], 'După „via” se găsește next hop-ul.'),
  single({ id: '3.1-004' }, '3.1', 1, 'Care dintre următoarele NU este o componentă a unei rute din tabela de rutare?', [
    ['Adresa MAC a gazdei de destinație', true, 'Rutele nu conțin MAC-uri; MAC-ul se află la transmitere, prin ARP.'],
    ['Prefixul și masca', false, 'Sunt componente de bază: definesc rețeaua de destinație.'],
    ['Next hop-ul', false, 'Este adresa următorului router (lipsește doar la rutele connected).'],
    ['Distanța administrativă și metrica', false, 'Apar în paranteza [AD/metric].'],
  ], 'Rutele au cod, prefix, mască, next hop, AD, metrică; nu MAC.'),

  // ======================= 3.1.a — Coduri =======================
  single({ id: '3.1-005' }, '3.1.a', 1, 'Ce înseamnă codul S* în show ip route?', [
    ['Rută statică marcată ca rută implicită candidată (candidate default)', true, 'S = static, * = candidat pentru ruta implicită.'],
    ['Rută învățată prin OSPF', false, 'OSPF folosește codul O.'],
    ['Rută connected', false, 'Connected este C.'],
    ['Rută învățată prin RIP', false, 'RIP este R.'],
  ], 'S* = rută statică implicită candidată.'),
  multi({ id: '3.1-006' }, '3.1.a', 2, 'Care două tipuri de rute apar AUTOMAT în tabelă când configurezi o adresă IP pe o interfață up/up? (alege două)', [
    ['C — rețeaua interfeței', true, 'Rută connected, creată automat din adresă și mască.'],
    ['L — adresa interfeței (/32)', true, 'Rută locală, creată automat în IOS 15 și IOS XE.'],
    ['S — rută statică', false, 'Se creează doar prin ip route, manual.'],
    ['O — rută OSPF', false, 'Apare doar dacă rulează OSPF și există un vecin.'],
  ], 'Interfața up/up cu IP generează C și L.'),
  single({ id: '3.1-007' }, '3.1.a', 2, 'La ce folosește ruta L (de exemplu L 192.168.1.1/32)?', [
    ['Spune routerului că adresa îi aparține, deci pachetele către ea se livrează local', true, 'Pachetele cu acea destinație se predau procesului local (ping, SSH, protocoale).'],
    ['Trimite pachetele spre LAN-ul 192.168.1.0/24', false, 'Aceea este ruta C, nu L.'],
    ['Reprezintă ruta implicită', false, 'Ruta implicită este 0.0.0.0/0 (S*).'],
    ['Reprezintă o rută învățată dintr-un vecin', false, 'L este generată local, nu învățată.'],
  ], 'L = adresa routerului însuși.'),
  { id: '3.1-008', topicId: T, sub: '3.1.a', type: 'match', difficulty: 1,
    stem: 'Potrivește codul cu sursa rutei.',
    leftLabel: 'Cod', rightLabel: 'Sursa',
    pairs: [
      { left: 'C', right: 'Connected (rețeaua interfeței)', why: 'C = directly connected.' },
      { left: 'S', right: 'Rută statică', why: 'S = configurată manual cu ip route.' },
      { left: 'O', right: 'OSPF', why: 'O = OSPF.' },
      { left: 'D', right: 'EIGRP', why: 'D = DUAL/EIGRP.' },
      { left: 'R', right: 'RIP', why: 'R = RIP.' },
    ],
    distractors: [{ text: 'Rută generată de DHCP', why: 'Nu există un cod unic „DHCP”; ruta primită prin DHCP apare ca rută statică implicită.' }],
    explanation: 'C connected · S static · O OSPF · D EIGRP · R RIP.' },
  single({ id: '3.1-009' }, '3.1.a', 2, 'Un router are în tabelă o rută O IA și una O E2. Ce AD au?', [
    ['Ambele 110', true, 'AD este o proprietate a protocolului (OSPF = 110), nu a sub-tipului.'],
    ['O IA 110 și O E2 170', false, '170 este AD pentru EIGRP extern, nu pentru OSPF extern.'],
    ['O IA 90 și O E2 110', false, '90 este AD pentru EIGRP intern.'],
    ['Depinde de metrica rutei', false, 'AD nu depinde de metrică; este fix pe sursă.'],
  ], 'Toate rutele OSPF au AD 110.'),
  single({ id: '3.1-010' }, '3.1.a', 2, 'Pe R1 dai shutdown pe Gi0/1 (10.0.12.1/30). Ce dispare din tabelă?', [
    ['C 10.0.12.0/30, L 10.0.12.1/32 și rutele care au next hop în 10.0.12.0/30', true, 'Fără interfață up/up dispar C și L, iar rutele cu next hop rezolvat prin ea devin inutilizabile.'],
    ['Nimic, rutele rămân până expiră', false, 'Rutele connected nu expiră: dispar imediat când interfața cade.'],
    ['Doar ruta L', false, 'C dispare și ea.'],
    ['Doar rutele OSPF', false, 'Dispar toate rutele care depind de interfața căzută, nu doar cele OSPF.'],
  ], 'Interfața down ⇒ C și L dispar, plus rutele dependente.'),

  // ======================= 3.1.b / 3.1.c — Prefix și mască =======================
  single({ id: '3.1-011' }, '3.1.c', 2, 'Care adrese acoperă ruta 192.168.3.128/26?', [
    ['192.168.3.128 – 192.168.3.191 (64 de adrese)', true, '/26 = blocuri de 64; blocul care începe la 128 se termină la 191.'],
    ['192.168.3.128 – 192.168.3.255 (128 de adrese)', false, 'Acesta ar fi /25.'],
    ['192.168.3.128 – 192.168.3.159 (32 de adrese)', false, 'Acesta ar fi /27.'],
    ['192.168.3.0 – 192.168.3.255 (256 de adrese)', false, 'Acesta ar fi /24.'],
  ], '/26 → bloc de 64: .128–.191.'),
  single({ id: '3.1-012' }, '3.1.b', 2, 'Ce este linia „10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks” din tabelă?', [
    ['Un antet de grupare, nu o rută', true, 'Grupează rutele din rețeaua clasică 10.0.0.0/8; nu transmite pachete.'],
    ['O rută către 10.0.0.0/8', false, 'Nu e rută; rutele reale apar sub ea, cu propriile coduri.'],
    ['Un mesaj de eroare de rutare', false, 'Este doar informație de afișare.'],
    ['Ruta implicită', false, 'Ruta implicită este 0.0.0.0/0.'],
  ], 'Antet de grupare.'),
  single({ id: '3.1-013' }, '3.1.c', 1, 'Care dintre aceste rute este cea mai specifică?', [
    ['10.1.1.0/24', true, 'Masca /24 este cea mai lungă, deci acoperă cele mai puține adrese.'],
    ['10.1.0.0/16', false, 'Mai generală decât /24.'],
    ['10.0.0.0/8', false, 'Mai generală decât /16.'],
    ['0.0.0.0/0', false, 'Acoperă tot spațiul IPv4; cea mai puțin specifică.'],
  ], 'Mască mai lungă ⇒ rută mai specifică.'),
  { id: '3.1-014', topicId: T, sub: '3.1.c', type: 'order', difficulty: 2,
    stem: 'Ordonează rutele de la cea MAI PUȚIN specifică la cea MAI specifică.',
    items: [
      { text: '0.0.0.0/0', why: 'Lungime 0: se potrivește cu orice.' },
      { text: '10.0.0.0/8', why: 'Lungime 8.' },
      { text: '10.1.0.0/16', why: 'Lungime 16.' },
      { text: '10.1.1.0/24', why: 'Lungime 24.' },
      { text: '10.1.1.5/32', why: 'Lungime 32: exact o gazdă; cea mai specifică.' },
    ],
    explanation: 'Specificitatea crește cu lungimea prefixului.' },
  single({ id: '3.1-015' }, '3.1.b', 2, 'Destinația 192.168.3.200 NU se potrivește cu care dintre aceste rute?', [
    ['192.168.3.0/25', true, '/25 din .0 acoperă .0–.127; adresa .200 e în afara lui.'],
    ['192.168.3.128/25', false, 'Acoperă .128–.255, deci include .200.'],
    ['192.168.3.0/24', false, 'Acoperă .0–.255.'],
    ['0.0.0.0/0', false, 'Se potrivește cu orice adresă.'],
  ], '.200 e în .128–.255.'),
  { id: '3.1-016', topicId: T, sub: '3.1.b', type: 'cli', difficulty: 1,
    stem: 'Afișează ruta pe care routerul o folosește pentru adresa 192.168.3.10.',
    prompt: 'R1#', canonical: 'show ip route 192.168.3.10', answers: ['show ip route 192.168.3.10'], hint: 'show ip route + adresa',
    wrong: [
      { text: 'show ip route', why: 'Afișează toată tabela, nu ruta pentru o singură adresă.' },
      { text: 'show ip interface brief', why: 'Arată interfețele, nu rutele.' },
      { text: 'ping 192.168.3.10', why: 'Testează conectivitatea, nu afișează ruta.' },
    ],
    explanation: 'show ip route <adresă> arată sursa, AD, metrica și next hop-ul.' },

  // ======================= 3.1.d — Next hop =======================
  single({ id: '3.1-017' }, '3.1.d', 1, 'Ce reprezintă next hop-ul unei rute?', [
    ['Adresa IP a următorului router de pe drumul către destinație', true, 'Routerul îi pasează pachetul; acela continuă decizia.'],
    ['Adresa IP a destinației finale', false, 'Destinația finală rămâne în antetul IP; next hop-ul e doar următorul pas.'],
    ['Adresa MAC a routerului', false, 'Next hop-ul e IP; MAC-ul îl află ARP.'],
    ['Masca de rețea a rutei', false, 'Masca definește prefixul, nu next hop-ul.'],
  ], 'Next hop = IP-ul următorului router.'),
  multi({ id: '3.1-018' }, '3.1.d', 2, 'Care două tipuri de rute NU au un next hop IP afișat? (alege două)', [
    ['C (connected)', true, 'Rețeaua e atașată direct: livrare directă, fără next hop.'],
    ['L (local)', true, 'Este adresa routerului însuși; nu se trimite nicăieri.'],
    ['S cu „via 10.0.12.2”', false, 'Are next hop-ul 10.0.12.2.'],
    ['O cu „via 10.1.1.2”', false, 'Are next hop-ul 10.1.1.2.'],
  ], 'C și L nu au next hop.'),
  single({ id: '3.1-019' }, '3.1.d', 2, 'R1 are S 192.168.3.0/24 [1/0] via 10.0.12.2. Un pachet pentru 192.168.3.10 trebuie trimis pe Ethernet. Pentru ce adresă IP face R1 ARP?', [
    ['10.0.12.2 (next hop-ul)', true, 'Cadrul trebuie livrat următorului router; ARP rezolvă MAC-ul next hop-ului.'],
    ['192.168.3.10 (destinația finală)', false, 'Destinația nu e pe link-ul lui R1; ar răspunde doar prin proxy ARP, ceea ce nu e mecanismul normal.'],
    ['192.168.3.1', false, 'Nu e adresa de pe link-ul lui R1.'],
    ['Nu face ARP, folosește tabela MAC', false, 'Tabela MAC e a switch-urilor; un router folosește ARP.'],
  ], 'ARP pentru next hop; IP-ul destinației rămâne în pachet.'),
  { id: '3.1-020', topicId: T, sub: '3.1.d', type: 'cli', difficulty: 2,
    stem: 'Configurează o rută statică către 192.168.3.0/24 cu next hop 10.0.12.2.',
    prompt: 'R1(config)#', canonical: 'ip route 192.168.3.0 255.255.255.0 10.0.12.2', answers: ['ip route 192.168.3.0 255.255.255.0 10.0.12.2'], hint: 'ip route prefix mască next-hop',
    wrong: [
      { text: 'ip route 192.168.3.0/24 10.0.12.2', why: 'IOS cere masca în notație zecimală pe ip route, nu /24.' },
      { text: 'ip route 192.168.3.0 0.0.0.255 10.0.12.2', why: '0.0.0.255 este wildcard, nu mască de rețea.' },
      { text: 'ip route 10.0.12.2 255.255.255.0 192.168.3.0', why: 'Ordinea e prefix, mască, apoi next hop; aici sunt inversate.' },
    ],
    explanation: 'ip route <prefix> <mască> <next hop>.' },
  single({ id: '3.1-021' }, '3.1.d', 3, 'Ai configurat ip route 192.168.3.0 255.255.255.0 10.0.99.2, dar routerul nu are nicio rută connected către 10.0.99.0/24. Ce se întâmplă?', [
    ['Ruta nu se instalează în tabelă, pentru că next hop-ul nu se poate rezolva', true, 'Căutarea recursivă a lui 10.0.99.2 eșuează, deci ruta nu poate fi folosită.'],
    ['Ruta apare ca S și pachetele pleacă prin interfața implicită', false, 'Nu există „interfață implicită”: fără rezolvare nu se instalează.'],
    ['Ruta apare cu AD 255', false, 'AD rămâne 1; ruta pur și simplu nu intră în tabelă.'],
    ['Routerul folosește ARP ca să găsească 10.0.99.2 oriunde', false, 'ARP funcționează doar pe un link atașat direct.'],
  ], 'Next hop trebuie rezolvabil recursiv.'),
  { id: '3.1-022', topicId: T, sub: '3.1.d', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii căutării recursive pentru un pachet către 192.168.3.10.',
    items: [
      { text: 'Routerul caută destinația 192.168.3.10 și găsește S 192.168.3.0/24 via 10.0.12.2', why: 'Prima căutare: după adresa de destinație a pachetului.' },
      { text: 'Routerul caută next hop-ul 10.0.12.2 în tabelă', why: 'A doua căutare: cum ajunge la next hop.' },
      { text: 'Găsește C 10.0.12.0/30 pe Gi0/1 și află interfața de ieșire', why: 'Ruta connected oferă interfața de ieșire.' },
      { text: 'Face ARP pentru 10.0.12.2 și construiește cadrul', why: 'Abia acum are MAC-ul next hop-ului.' },
      { text: 'Trimite cadrul pe Gi0/1', why: 'Ultimul pas: transmiterea.' },
    ],
    explanation: 'Destinație → next hop → connected → ARP → trimitere.' },

  // ======================= 3.1.e — Administrative distance =======================
  single({ id: '3.1-023' }, '3.1.e', 1, 'Ce arată administrative distance (AD)?', [
    ['Cât de mult are încredere routerul în sursa rutei (mai mic = mai de încredere)', true, 'AD ordonează sursele de rute după credibilitate.'],
    ['Câți hop-uri sunt până la destinație', false, 'Aceea este metrica RIP.'],
    ['Distanța fizică a cablului', false, 'AD nu are legătură cu lungimea cablului.'],
    ['Lățimea de bandă a legăturii', false, 'Lățimea de bandă intră în metrica OSPF/EIGRP, nu în AD.'],
  ], 'AD = încrederea în sursă.'),
  { id: '3.1-024', topicId: T, sub: '3.1.e', type: 'match', difficulty: 2,
    stem: 'Potrivește sursa rutei cu AD-ul implicit Cisco.',
    leftLabel: 'Sursa', rightLabel: 'AD implicit',
    pairs: [
      { left: 'Connected', right: '0', why: 'Cea mai de încredere sursă.' },
      { left: 'Static', right: '1', why: 'Ruta configurată manual are AD 1.' },
      { left: 'EIGRP intern', right: '90', why: 'EIGRP bate OSPF și RIP.' },
      { left: 'OSPF', right: '110', why: 'Valoare standard Cisco pentru OSPF.' },
      { left: 'RIP', right: '120', why: 'RIP e mai puțin de încredere decât OSPF.' },
    ],
    distractors: [{ text: '200', why: 'Este AD-ul pentru iBGP, nu pentru surse din listă.' }],
    explanation: '0 / 1 / 90 / 110 / 120.' },
  single({ id: '3.1-025' }, '3.1.e', 2, 'R1 învață 192.168.3.0/24 prin OSPF și prin RIP. Care ruta intră în tabelă?', [
    ['Cea OSPF (AD 110 < 120)', true, 'AD mai mic câștigă; metricile nu se compară între protocoale.'],
    ['Cea RIP, pentru că metrica ei e mai mică', false, 'Metricile nu se compară între protocoale; decide AD.'],
    ['Ambele, cu load balancing', false, 'Doar rutele din aceeași sursă și cu aceeași metrică pot fi echilibrate.'],
    ['Niciuna, apare conflict', false, 'Routerul rezolvă conflictul automat prin AD.'],
  ], 'OSPF 110 < RIP 120.'),
  single({ id: '3.1-026' }, '3.1.e', 2, 'În „S 192.168.3.0/24 [1/0] via 10.0.12.2”, ce reprezintă numărul 1?', [
    ['AD-ul rutei statice', true, 'Primul număr din paranteza pătrată este AD.'],
    ['Metrica rutei', false, 'Metrica e al doilea număr (aici 0).'],
    ['Numărul de hop-uri', false, 'Hop-urile sunt metrica RIP, nu acest număr.'],
    ['Numărul interfeței de ieșire', false, 'Interfața nu e codificată ca număr în paranteză.'],
  ], '[AD/metric]: AD este primul.'),
  single({ id: '3.1-027' }, '3.1.e', 2, 'R1 are o rută statică (AD implicit) și una OSPF pentru același 10.9.0.0/24. Care este folosită?', [
    ['Cea statică (AD 1 < 110)', true, 'Ruta statică, cu AD mai mic, câștigă; OSPF rămâne în baza lui, ca rezervă.'],
    ['Cea OSPF, pentru că e dinamică', false, 'Dinamic nu înseamnă preferat: decide AD.'],
    ['Ambele', false, 'Doar o sursă per prefix identic intră în tabelă (în afara ECMP din aceeași sursă).'],
    ['Cea cu metrica mai mică', false, 'Metrica nu se compară între surse diferite.'],
  ], 'Static 1 < OSPF 110.'),
  multi({ id: '3.1-028' }, '3.1.e', 3, 'Care afirmații despre AD sunt adevărate? (alege trei)', [
    ['O valoare mai mică înseamnă mai multă încredere', true, 'Ordinea de preferință este crescătoare.'],
    ['Se folosește când aceeași rețea e oferită de surse diferite', true, 'Exact situația pentru care a fost creat.'],
    ['Poate fi modificată (de exemplu la o rută statică flotantă)', true, 'ip route … 130 mărește AD-ul.'],
    ['Se compară între rute cu prefixe de lungimi diferite', false, 'Lungimea prefixului decide înaintea AD.'],
    ['Este egală cu metrica protocolului', false, 'AD și metrica sunt valori distincte.'],
  ], 'AD: mai mic = preferat; între surse; modificabil.'),

  // ======================= 3.1.f — Metric =======================
  single({ id: '3.1-029' }, '3.1.f', 2, 'Cu referința implicită OSPF de 100 Mbps, ce cost are o interfață Ethernet de 10 Mbps?', [
    ['10', true, '100 Mbps ÷ 10 Mbps = 10.'],
    ['1', false, 'Cost 1 au interfețele de 100 Mbps sau mai rapide.'],
    ['100', false, 'Acesta ar fi un cost pentru 1 Mbps.'],
    ['64', false, '64 este costul unei linii T1 (1,544 Mbps).'],
  ], 'Cost = 100 Mbps ÷ banda.'),
  single({ id: '3.1-030' }, '3.1.f', 2, 'Ce metrică folosește RIP și care e valoarea care înseamnă „inaccesibil”?', [
    ['Număr de hop-uri; 16', true, 'Maximum utilizabil 15; 16 = infinit.'],
    ['Cost din lățime de bandă; 65535', false, 'Aceea e logica OSPF, iar 65535 nu e limita RIP.'],
    ['Delay cumulat; 255', false, 'Nu este metrica RIP.'],
    ['Număr de hop-uri; 255', false, '255 e valoarea maximă de AD, nu metrica „infinit” RIP.'],
  ], 'RIP: hop count, 16 = inaccesibil.'),
  single({ id: '3.1-031' }, '3.1.f', 2, 'De ce nu se pot compara metricile OSPF cu metricile RIP?', [
    ['Fiecare protocol măsoară altceva (cost din bandă vs. număr de hop-uri)', true, 'Numerele nu au aceeași semnificație sau scară; de aceea se compară mai întâi AD.'],
    ['OSPF nu are metrică', false, 'OSPF are cost.'],
    ['RIP nu are metrică', false, 'RIP are hop count.'],
    ['Routerul le compară doar când sunt egale', false, 'Între protocoale se compară AD, nu metrici.'],
  ], 'Metricile protocoalelor diferite nu sunt comparabile.'),
  { id: '3.1-032', topicId: T, sub: '3.1.f', type: 'cli', difficulty: 1,
    stem: 'Afișează doar rutele învățate prin OSPF.',
    prompt: 'R1#', canonical: 'show ip route ospf', answers: ['show ip route ospf'], hint: 'show ip route + protocol',
    wrong: [
      { text: 'show ip ospf', why: 'Arată informații despre procesul OSPF, nu rutele din tabelă.' },
      { text: 'show ip protocols', why: 'Arată protocoalele de rutare active, nu rutele.' },
      { text: 'show ip route static', why: 'Filtrează rutele statice, nu OSPF.' },
    ],
    explanation: 'show ip route ospf filtrează rutele O.' },
  single({ id: '3.1-033' }, '3.1.f', 1, 'Ce metrică se afișează pentru o rută statică în show ip route?', [
    ['0', true, 'Nu există un calcul de metrică; se afișează 0 (de exemplu [1/0]).'],
    ['1', false, '1 este AD-ul implicit, nu metrica.'],
    ['110', false, '110 este AD-ul OSPF.'],
    ['Numărul de hop-uri până la destinație', false, 'Hop count e specific RIP.'],
  ], 'Static: [1/0].'),

  // ======================= 3.1.g — Gateway of last resort =======================
  single({ id: '3.1-034' }, '3.1.g', 2, 'Ce este un gateway of last resort?', [
    ['Destinația către care se trimit pachetele fără rută specifică, dată de ruta implicită', true, 'Este next hop-ul rutei 0.0.0.0/0.'],
    ['Adresa unui server DNS', false, 'DNS rezolvă nume, nu determină rutarea.'],
    ['Interfața de loopback a routerului', false, 'Loopback-ul nu are legătură cu ruta implicită.'],
    ['O rută care apare doar în caz de eroare', false, 'Este o rută normală (0.0.0.0/0).'],
  ], 'Gateway of last resort = next hop-ul rutei implicite.'),
  single({ id: '3.1-035' }, '3.1.g', 1, 'Ce prefix are ruta implicită IPv4?', [
    ['0.0.0.0/0', true, 'Lungime 0: se potrivește cu orice adresă.'],
    ['255.255.255.255/32', false, 'Aceea e adresa de broadcast limitat.'],
    ['127.0.0.0/8', false, 'Loopback.'],
    ['169.254.0.0/16', false, 'Link-local (APIPA).'],
  ], '0.0.0.0/0.'),
  { id: '3.1-036', topicId: T, sub: '3.1.g', type: 'cli', difficulty: 2,
    stem: 'Configurează ruta implicită statică spre ISP, next hop 203.0.113.1.',
    prompt: 'R1(config)#', canonical: 'ip route 0.0.0.0 0.0.0.0 203.0.113.1', answers: ['ip route 0.0.0.0 0.0.0.0 203.0.113.1'], hint: 'ip route 0.0.0.0 0.0.0.0 …',
    wrong: [
      { text: 'ip default-gateway 203.0.113.1', why: 'Se folosește pe switch-uri L2, nu instalează o rută pe un router.' },
      { text: 'ip route 0.0.0.0 255.255.255.255 203.0.113.1', why: 'Masca 255.255.255.255 ar face un host route, nu ruta implicită.' },
      { text: 'ip route 203.0.113.1 0.0.0.0 0.0.0.0', why: 'Argumentele sunt în ordine greșită.' },
    ],
    explanation: 'ip route 0.0.0.0 0.0.0.0 <next hop>.' },
  single({ id: '3.1-037' }, '3.1.g', 2, 'Antetul spune „Gateway of last resort is not set”. Ce se întâmplă cu un pachet pentru care nu există rută?', [
    ['Este aruncat și sursa primește ICMP destination unreachable', true, 'Fără rută și fără default, nu are unde să-l trimită.'],
    ['Este trimis în broadcast', false, 'Routerele nu fac broadcast pe nivelul 3.'],
    ['Este trimis pe prima interfață activă', false, 'Nu există o astfel de regulă.'],
    ['Este păstrat într-un buffer până apare o rută', false, 'Pachetele fără rută se aruncă.'],
  ], 'Fără rută ⇒ drop + ICMP unreachable.'),
  multi({ id: '3.1-038' }, '3.1.g', 2, 'Prin ce modalități poate ajunge o rută implicită în tabelă? (alege trei)', [
    ['Configurată static cu ip route 0.0.0.0 0.0.0.0 …', true, 'Metoda cea mai simplă.'],
    ['Anunțată de un protocol dinamic (de exemplu OSPF default-information originate)', true, 'Un router o poate propaga către restul.'],
    ['Primită prin DHCP pe o interfață', true, 'DHCP poate instala ruta implicită.'],
    ['Învățată automat prin ARP', false, 'ARP rezolvă MAC-uri, nu instalează rute implicite.'],
    ['Învățată din CDP', false, 'CDP descoperă vecini, nu instalează rute.'],
  ], 'Static, dinamic sau DHCP.'),
  single({ id: '3.1-039' }, '3.1.g', 3, 'Care e diferența dintre default gateway al unui PC și gateway of last resort al unui router?', [
    ['Ambele sunt „încotro merg când nu știu”, dar la router provine dintr-o rută implicită din tabelă', true, 'Routerul folosește 0.0.0.0/0 din tabela de rutare, nu o setare separată de gateway.'],
    ['Nu există nicio legătură între ele', false, 'Au aceeași idee, aplicată pe dispozitive diferite.'],
    ['Gateway of last resort este MAC-ul gateway-ului PC-ului', false, 'Este o adresă IP de next hop, nu MAC.'],
    ['Default gateway există doar pe routere', false, 'Default gateway este o setare a gazdelor (PC, server).'],
  ], 'Același concept, implementat diferit.'),
  single({ id: '3.1-040' }, '3.1.g', 3, 'Care este echivalentul IPv6 al rutei implicite 0.0.0.0/0?', [
    ['::/0', true, 'Prefix de lungime 0, se potrivește cu orice adresă IPv6.'],
    ['::1/128', false, 'Este adresa de loopback IPv6.'],
    ['FE80::/10', false, 'Este spațiul link-local.'],
    ['FF00::/8', false, 'Este spațiul multicast.'],
  ], '::/0.'),
];
