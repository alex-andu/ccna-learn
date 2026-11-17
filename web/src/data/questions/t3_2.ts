import type { Question } from '../../lib/types';

// Banca de întrebări pentru 3.2 Determine how a router makes a forwarding decision by default.
// Sub-puncte oficiale: a longest prefix match · b administrative distance · c routing protocol metric. Fiecare variantă are explicație (why).
const T = '3.2';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_3_2: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '3.2-001' }, '3.2', 1, 'În ce ordine alege un router, în mod implicit, între mai multe rute către aceeași destinație?', [
    ['Cel mai lung prefix, apoi AD cel mai mic, apoi metrica cea mai mică', true, 'Ordinea standard de examen: prefix mai lung → AD → metrică.'],
    ['AD cel mai mic, apoi cel mai lung prefix, apoi metrica', false, 'AD nu poate înlocui un prefix mai lung: un /24 OSPF bate un /16 static.'],
    ['Metrica cea mai mică, apoi AD, apoi prefixul', false, 'Metrica e ultimul criteriu și se compară doar în același protocol.'],
    ['Prima rută din tabelă, în ordine alfabetică', false, 'Ordinea afișării nu are legătură cu decizia.'],
  ], 'Prefix mai lung → AD → metrică.'),
  single({ id: '3.2-002' }, '3.2', 1, 'Care adresă din pachet folosește routerul pentru a alege ruta (în rutarea implicită)?', [
    ['Adresa IP de destinație', true, 'Routerul compară destinația cu prefixurile din tabelă.'],
    ['Adresa IP sursă', false, 'Rutarea implicită nu se bazează pe sursă (policy-based routing e altceva).'],
    ['Adresa MAC sursă', false, 'MAC-ul e de nivel 2; routerul decide la nivelul 3.'],
    ['Portul TCP de destinație', false, 'Porturile nu intervin în decizia de rutare normală.'],
  ], 'Se folosește destinația.'),
  single({ id: '3.2-003' }, '3.2', 2, 'R1 are O 10.1.1.0/24 [110/2] și S 10.1.0.0/16 [1/0]. Încotro merge un pachet pentru 10.1.1.9?', [
    ['Pe ruta OSPF 10.1.1.0/24', true, '/24 este mai specifică decât /16; AD nu mai este comparat.'],
    ['Pe ruta statică 10.1.0.0/16, pentru că are AD 1', false, 'Static bate OSPF doar pentru același prefix; aici prefixele diferă.'],
    ['Pe ambele rute, în paralel', false, 'ECMP presupune același prefix și aceeași metrică.'],
    ['Pachetul este aruncat din cauza conflictului', false, 'Nu există conflict: câștigă cea mai specifică.'],
  ], 'Longest prefix match.'),
  single({ id: '3.2-004' }, '3.2', 2, 'Care dintre aceste cauze duce la aruncarea unui pachet de către un router?', [
    ['Nicio rută potrivită și nicio rută implicită', true, 'Fără rută, routerul nu are unde să-l trimită: drop + ICMP unreachable.'],
    ['Există mai multe rute care se potrivesc', false, 'Routerul alege cea mai bună; nu aruncă pachetul.'],
    ['Ruta aleasă are metrică mare', false, 'Metrica influențează alegerea, nu aruncarea.'],
    ['Adresa de destinație e într-o rețea connected', false, 'Pachetul se livrează direct; nu se aruncă.'],
  ], 'Fără rută ⇒ drop.'),

  // ======================= 3.2.a — Longest prefix match =======================
  single({ id: '3.2-005' }, '3.2.a', 1, 'Ce spune regula longest prefix match?', [
    ['Dintre rutele care conțin adresa de destinație, se alege cea cu masca cea mai lungă', true, 'Cea mai specifică rută câștigă.'],
    ['Se alege ruta cu prefixul scris primul în tabelă', false, 'Ordinea de afișare nu contează.'],
    ['Se alege ruta cu cea mai mică metrică', false, 'Metrica e al treilea criteriu.'],
    ['Se alege întotdeauna ruta implicită', false, 'Ruta implicită se folosește doar când nu există altă potrivire.'],
  ], 'Cea mai lungă mască.'),
  multi({ id: '3.2-006' }, '3.2.a', 2, 'Care dintre aceste rute se potrivesc cu destinația 10.1.1.77? (alege patru)', [
    ['0.0.0.0/0', true, 'Se potrivește cu orice adresă.'],
    ['10.0.0.0/8', true, 'Conține toate adresele 10.x.x.x.'],
    ['10.1.1.64/26', true, 'Blocul 10.1.1.64–10.1.1.127 conține .77.'],
    ['10.1.1.0/25', true, 'Blocul 10.1.1.0–10.1.1.127 conține .77.'],
    ['10.1.1.128/25', false, 'Blocul 10.1.1.128–10.1.1.255 nu conține .77.'],
  ], 'Patru rute se potrivesc; câștigă /26.'),
  single({ id: '3.2-007' }, '3.2.a', 2, 'Tabela conține 10.0.0.0/8, 10.1.0.0/16, 10.1.1.0/24 și 10.1.1.64/26. Pentru 10.1.1.70, care rută câștigă?', [
    ['10.1.1.64/26', true, '.70 e în 64–127; /26 e cea mai lungă potrivire.'],
    ['10.1.1.0/24', false, 'Se potrivește, dar /24 e mai puțin specifică decât /26.'],
    ['10.1.0.0/16', false, 'Se potrivește, dar e mai generală.'],
    ['10.0.0.0/8', false, 'Cea mai generală dintre cele patru.'],
  ], '/26 > /24 > /16 > /8.'),
  { id: '3.2-008', topicId: T, sub: '3.2.a', type: 'match', difficulty: 2,
    stem: 'Rutele sunt 0.0.0.0/0, 10.0.0.0/8, 10.1.0.0/16, 10.1.1.0/24 și 10.1.1.77/32. Potrivește destinația cu ruta câștigătoare.',
    leftLabel: 'Destinație', rightLabel: 'Ruta aleasă',
    pairs: [
      { left: '10.1.1.77', right: '10.1.1.77/32', why: 'Host route: cea mai specifică.' },
      { left: '10.1.1.10', right: '10.1.1.0/24', why: 'Se potrivește cu /24; /32 nu (alt host).' },
      { left: '10.1.9.9', right: '10.1.0.0/16', why: '10.1.9 nu e în 10.1.1.0/24; rămâne /16.' },
      { left: '10.200.1.1', right: '10.0.0.0/8', why: 'Nu e în 10.1.x.x; /8 e cea mai lungă potrivire.' },
      { left: '8.8.8.8', right: '0.0.0.0/0', why: 'Nicio altă rută nu se potrivește.' },
    ],
    distractors: [{ text: '192.168.1.0/24', why: 'Nu este în lista de rute a exemplului.' }],
    explanation: 'Fiecare destinație ia cea mai lungă potrivire.' },
  single({ id: '3.2-009' }, '3.2.a', 3, 'R1 are S 10.1.0.0/16 [1/0] via A și O 10.1.1.0/24 [110/2] via B. Un pachet pentru 10.1.1.20 pleacă via B. Ce explică alegerea?', [
    ['Prefixul /24 este mai lung decât /16, iar AD nu a fost comparat', true, 'Longest prefix match se aplică înaintea AD.'],
    ['OSPF are AD mai mic decât ruta statică', false, 'AD static (1) este mai mic decât OSPF (110); alegerea nu depinde de AD.'],
    ['Metrica 2 e mai mică decât metrica 0', false, 'Metricile nu se compară între protocoale; metrica statică este 0, mai mică.'],
    ['Routerul alege mereu rutele dinamice', false, 'Nu există o astfel de regulă.'],
  ], 'Prefix mai lung înainte de AD.'),
  single({ id: '3.2-010' }, '3.2.a', 1, 'Când este folosită ruta implicită 0.0.0.0/0?', [
    ['Doar când nicio rută mai specifică nu se potrivește cu destinația', true, 'Fiind /0, are cea mai mică specificitate.'],
    ['Pentru toate pachetele, înaintea rutelor specifice', false, 'Rutele specifice câștigă prin longest prefix match.'],
    ['Doar pentru pachetele ICMP', false, 'Nu depinde de protocol.'],
    ['Doar când interfața de ieșire e Gigabit', false, 'Tipul interfeței nu contează.'],
  ], 'Default = ultima alegere.'),
  single({ id: '3.2-011' }, '3.2.a', 2, 'Ce efect are adăugarea unei rute statice /32 pentru un server, când există deja o rută /24 pentru rețeaua lui?', [
    ['Traficul către acel server folosește ruta /32; restul rețelei rămâne pe /24', true, 'Host route este cea mai specifică, deci câștigă doar pentru acea adresă.'],
    ['Ruta /24 este ștearsă din tabelă', false, 'Ambele rute coexistă.'],
    ['Tot traficul din /24 folosește acum /32', false, '/32 acoperă o singură adresă.'],
    ['Routerul alege ruta cu next hop-ul mai mic ca valoare', false, 'Nu există o astfel de regulă.'],
  ], '/32 = excepție pentru o singură gazdă.'),
  { id: '3.2-012', topicId: T, sub: '3.2.a', type: 'cli', difficulty: 2,
    stem: 'Configurează o rută de gazdă pentru 10.1.1.77 cu next hop 10.9.9.5.',
    prompt: 'R1(config)#', canonical: 'ip route 10.1.1.77 255.255.255.255 10.9.9.5', answers: ['ip route 10.1.1.77 255.255.255.255 10.9.9.5'], hint: 'mască /32 = 255.255.255.255',
    wrong: [
      { text: 'ip route 10.1.1.77 255.255.255.0 10.9.9.5', why: 'Cu /24, adresa 10.1.1.77 are biți de gazdă nenuli: comanda e respinsă sau acoperă alt prefix.' },
      { text: 'ip route 10.1.1.77 0.0.0.0 10.9.9.5', why: 'Masca 0.0.0.0 este pentru ruta implicită, nu pentru o gazdă.' },
      { text: 'ip route 10.9.9.5 255.255.255.255 10.1.1.77', why: 'Prefixul și next hop-ul sunt inversate.' },
    ],
    explanation: 'Host route: mască 255.255.255.255.' },

  // ======================= 3.2.b — Administrative distance =======================
  single({ id: '3.2-013' }, '3.2.b', 1, 'R1 învață 10.2.0.0/16 prin OSPF și prin EIGRP. Care intră în tabelă?', [
    ['EIGRP (AD 90 < 110)', true, 'Același prefix, surse diferite: AD mai mic câștigă.'],
    ['OSPF (AD 110)', false, 'AD 110 este mai mare decât 90, deci pierde.'],
    ['Ambele, cu ECMP', false, 'ECMP presupune aceeași sursă și metrici egale.'],
    ['Cea cu metrica mai mică', false, 'Metricile OSPF și EIGRP nu se compară.'],
  ], 'EIGRP 90 < OSPF 110.'),
  single({ id: '3.2-014' }, '3.2.b', 1, 'Pentru același prefix, o rută statică (AD implicit) și o rută RIP. Care intră în tabelă?', [
    ['Ruta statică (AD 1 < 120)', true, 'Static are AD 1; RIP 120.'],
    ['Ruta RIP', false, 'AD 120 este mai mare.'],
    ['Niciuna', false, 'Una câștigă mereu.'],
    ['Ambele', false, 'Se instalează o singură sursă per prefix identic.'],
  ], 'Static 1 < RIP 120.'),
  single({ id: '3.2-015' }, '3.2.b', 2, 'Ce este o rută statică flotantă?', [
    ['O rută statică cu AD mărit peste cel al unui protocol, folosită doar ca rezervă', true, 'Rămâne ascunsă cât timp ruta preferată există.'],
    ['O rută care își schimbă singură next hop-ul', false, 'Next hop-ul rămâne fix, cel configurat.'],
    ['O rută care apare doar prin DHCP', false, 'Nu are legătură cu DHCP.'],
    ['O rută statică cu metrica 255', false, 'Rutele statice nu au metrică reglabilă; se reglează AD.'],
  ], 'Flotantă = AD mai mare.'),
  { id: '3.2-016', topicId: T, sub: '3.2.b', type: 'cli', difficulty: 2,
    stem: 'Configurează o rută statică de rezervă pentru 192.168.3.0/24 via 10.0.12.2, cu AD 130.',
    prompt: 'R1(config)#', canonical: 'ip route 192.168.3.0 255.255.255.0 10.0.12.2 130', answers: ['ip route 192.168.3.0 255.255.255.0 10.0.12.2 130'], hint: 'AD-ul este ultimul argument',
    wrong: [
      { text: 'ip route 130 192.168.3.0 255.255.255.0 10.0.12.2', why: 'AD-ul se pune la sfârșit, nu la început.' },
      { text: 'ip route 192.168.3.0 255.255.255.0 10.0.12.2 metric 130', why: 'ip route nu are cuvântul „metric”; valoarea finală este AD.' },
      { text: 'ip route 192.168.3.0 255.255.255.0 10.0.12.2', why: 'Fără număr final, AD rămâne 1: ruta nu mai e flotantă.' },
    ],
    explanation: 'Ultimul număr = AD.' },
  single({ id: '3.2-017' }, '3.2.b', 3, 'De ce 130 este o valoare potrivită pentru o rută flotantă care trebuie să acopere OSPF?', [
    ['Pentru că este mai mare decât AD-ul OSPF (110)', true, 'Doar un AD mai mare decât al protocolului ține ruta în rezervă.'],
    ['Pentru că 130 este AD-ul implicit pentru rute de rezervă', false, 'Nu există un AD „implicit pentru rezervă”.'],
    ['Pentru că 130 este mai mic decât 110', false, '130 este mai mare decât 110.'],
    ['Pentru că AD trebuie să fie multiplu de 10', false, 'Nu există o astfel de regulă.'],
  ], 'AD flotant > AD protocol.'),
  multi({ id: '3.2-018' }, '3.2.b', 3, 'Care afirmații sunt adevărate despre rutele care pierd după AD? (alege două)', [
    ['Rămân în baza de date a sursei lor', true, 'De exemplu în LSDB-ul OSPF.'],
    ['Intră în tabelă dacă ruta câștigătoare dispare', true, 'Asta permite failover-ul.'],
    ['Sunt șterse definitiv', false, 'Nu se șterg; doar nu sunt instalate.'],
    ['Se afișează în show ip route cu un asterisc', false, 'Rutele neinstalate nu apar în show ip route.'],
  ], 'Rezervă păstrată de sursă.'),

  // ======================= 3.2.c — Metric =======================
  single({ id: '3.2-019' }, '3.2.c', 2, 'OSPF oferă două căi către 192.168.3.0/24: cost 2 și cost 3. Ce se instalează?', [
    ['Ruta cu cost 2', true, 'Metrica mai mică câștigă în același protocol.'],
    ['Ruta cu cost 3', false, 'Cost mai mare = cale mai proastă.'],
    ['Ambele', false, 'Doar metricile egale dau ECMP.'],
    ['Niciuna', false, 'Una se instalează.'],
  ], 'Cost mai mic.'),
  single({ id: '3.2-020' }, '3.2.c', 1, 'Când se compară metricile a două rute?', [
    ['Când sunt din același protocol și pentru același prefix', true, 'Doar atunci numerele au aceeași semnificație.'],
    ['Oricând există două rute pentru aceeași rețea', false, 'Dacă sursele diferă, se compară AD.'],
    ['Când AD sunt diferite', false, 'Dacă AD diferă, decide AD.'],
    ['Când prefixele au lungimi diferite', false, 'Decide lungimea prefixului.'],
  ], 'Același protocol, același prefix.'),
  single({ id: '3.2-021' }, '3.2.c', 2, 'Două căi OSPF către același prefix au amândouă metrica 3. Ce face routerul?', [
    ['Le instalează pe amândouă și împarte traficul (ECMP)', true, 'Metrici egale ⇒ load balancing pe căi cu cost egal.'],
    ['Alege una aleator și o șterge pe cealaltă', false, 'Ambele rămân instalate.'],
    ['Instalează doar ruta cu next hop-ul mai mic ca adresă', false, 'Nu există o astfel de regulă.'],
    ['Aruncă pachetele din cauza ambiguității', false, 'Nu există ambiguitate: ECMP este un comportament normal.'],
  ], 'Egale ⇒ ECMP.'),
  single({ id: '3.2-022' }, '3.2.c', 3, 'R1 și R2 sunt legate direct printr-o legătură de 10 Mbps și, indirect, prin R3 cu două legături de 100 Mbps. Ce cale alege RIP și ce cale alege OSPF (referință 100 Mbps)?', [
    ['RIP: legătura directă (1 hop); OSPF: prin R3 (cost 2 față de 10)', true, 'RIP numără hop-urile; OSPF costul din bandă.'],
    ['RIP: prin R3; OSPF: legătura directă', false, 'Invers: RIP preferă mai puține hop-uri, OSPF viteza.'],
    ['Ambele aleg legătura directă', false, 'OSPF ține cont de lățimea de bandă: 10 Mbps = cost 10.'],
    ['Ambele aleg calea prin R3', false, 'RIP alege 1 hop (direct), nu 2 hop-uri.'],
  ], 'Metrici diferite ⇒ căi diferite.'),
  { id: '3.2-023', topicId: T, sub: '3.2', type: 'order', difficulty: 2,
    stem: 'Ordonează criteriile aplicate de un router când alege între rute, de la primul la ultimul.',
    items: [
      { text: 'Care rute se potrivesc cu adresa de destinație?', why: 'Fără potrivire nu există candidate.' },
      { text: 'Se alege ruta cu cel mai lung prefix', why: 'Longest prefix match (3.2.a).' },
      { text: 'Pentru același prefix din surse diferite: AD cel mai mic', why: '3.2.b.' },
      { text: 'Pentru același prefix din același protocol: metrica cea mai mică', why: '3.2.c.' },
      { text: 'Metrici egale: instalează toate căile (ECMP)', why: 'Ultima regulă: egalitate ⇒ împărțirea traficului.' },
    ],
    explanation: 'Potrivire → prefix → AD → metrică → ECMP.' },
  { id: '3.2-024', topicId: T, sub: '3.2', type: 'match', difficulty: 1,
    stem: 'Potrivește criteriul cu situația în care decide.',
    leftLabel: 'Criteriu', rightLabel: 'Situația',
    pairs: [
      { left: 'Longest prefix match', right: 'Rute cu lungimi de prefix diferite care acoperă destinația', why: 'Ruta mai specifică câștigă.' },
      { left: 'Administrative distance', right: 'Același prefix oferit de protocoale/surse diferite', why: 'Se alege sursa cea mai de încredere.' },
      { left: 'Metrică', right: 'Același prefix din același protocol pe căi diferite', why: 'Se alege calea cu cost mai mic.' },
      { left: 'ECMP', right: 'Metrici egale pe căi diferite', why: 'Se instalează ambele căi.' },
    ],
    distractors: [{ text: 'Adresa MAC a next hop-ului', why: 'MAC-ul nu intervine în alegerea rutei.' }],
    explanation: 'Fiecare criteriu are domeniul lui.' },

  // ======================= După decizie =======================
  single({ id: '3.2-025' }, '3.2', 1, 'Ce se întâmplă cu TTL-ul unui pachet la fiecare router pe care îl traversează?', [
    ['Scade cu 1', true, 'Previne buclele infinite.'],
    ['Crește cu 1', false, 'TTL scade.'],
    ['Rămâne neschimbat', false, 'Fiecare hop îl decrementează.'],
    ['Se resetează la 255', false, 'Nu se resetează la fiecare hop.'],
  ], 'TTL − 1.'),
  single({ id: '3.2-026' }, '3.2', 2, 'Ce câmpuri se schimbă când un router transmite un pachet (fără NAT)?', [
    ['MAC sursă, MAC destinație și TTL', true, 'Antetul L2 se rescrie, iar TTL scade; IP-urile rămân.'],
    ['IP sursă și IP destinație', false, 'Adresele IP se schimbă doar cu NAT.'],
    ['Doar IP destinație', false, 'IP destinație rămâne cel al destinației finale.'],
    ['Nimic, pachetul trece neschimbat', false, 'Cel puțin MAC-urile și TTL se modifică.'],
  ], 'L2 se rescrie; TTL scade; IP-urile rămân.'),
  single({ id: '3.2-027' }, '3.2', 2, 'Un pachet are TTL 1 când ajunge la un router. Ce face routerul?', [
    ['Îl aruncă și trimite sursei ICMP time exceeded', true, 'TTL ar ajunge la 0 la transmitere.'],
    ['Îl transmite mai departe cu TTL 0', false, 'Un pachet cu TTL 0 nu se transmite.'],
    ['Îl trimite înapoi pe aceeași interfață', false, 'Nu există o astfel de regulă.'],
    ['Îl ține într-un buffer', false, 'Se aruncă imediat.'],
  ], 'TTL expirat ⇒ drop + time exceeded.'),
  multi({ id: '3.2-028' }, '3.2', 3, 'Care dintre acestea sunt pași ai unui router care transmite un pachet? (alege patru)', [
    ['Verifică MAC-ul destinație și îndepărtează antetul Ethernet', true, 'Decapsularea cadrului primit.'],
    ['Caută cea mai lungă potrivire pentru adresa IP de destinație', true, 'Decizia de transmitere.'],
    ['Scade TTL și recalculează checksum-ul antetului IP', true, 'Operație obligatorie la fiecare hop.'],
    ['Află MAC-ul next hop-ului prin ARP și încapsulează într-un cadru nou', true, 'Rescrierea antetului L2.'],
    ['Trimite pachetul în broadcast pe toate interfețele', false, 'Routerul nu face flooding.'],
  ], 'Decapsulare, LPM, TTL, rescriere L2.'),
  single({ id: '3.2-029' }, '3.2', 2, 'Pentru ce adresă IP face R1 ARP când ruta aleasă este „S 192.168.3.0/24 via 10.0.12.2”?', [
    ['10.0.12.2, next hop-ul', true, 'Cadrul trebuie livrat următorului router.'],
    ['192.168.3.10, destinația finală', false, 'Destinația nu e pe acest link.'],
    ['Adresa de broadcast 255.255.255.255', false, 'ARP cere o anumită adresă.'],
    ['Adresa propriei interfețe', false, 'Routerul își știe propriul MAC.'],
  ], 'ARP pentru next hop.'),
  single({ id: '3.2-030' }, '3.2', 1, 'Care comandă arată ruta pe care routerul o va folosi pentru 192.168.3.10?', [
    ['show ip route 192.168.3.10', true, 'Face aceeași căutare ca pentru un pachet.'],
    ['show ip interface brief', false, 'Arată interfețele, nu rutele.'],
    ['show mac address-table', false, 'Arată tabela MAC a unui switch.'],
    ['show arp', false, 'Arată cache-ul ARP, nu ruta.'],
  ], 'show ip route <adresă>.'),
  { id: '3.2-031', topicId: T, sub: '3.2.c', type: 'cli', difficulty: 2,
    stem: 'Setează costul OSPF al interfeței la 100.',
    prompt: 'R1(config-if)#', canonical: 'ip ospf cost 100', answers: ['ip ospf cost 100'], hint: 'ip ospf …',
    wrong: [
      { text: 'ospf cost 100', why: 'Lipsește cuvântul „ip” la început.' },
      { text: 'ip ospf metric 100', why: 'Nu există „metric” în această comandă: cuvântul corect este „cost”.' },
      { text: 'bandwidth 100', why: 'Schimbă lățimea de bandă a interfeței (și indirect costul), dar nu setează costul direct.' },
    ],
    explanation: 'ip ospf cost <n>.' },
  single({ id: '3.2-032' }, '3.2.c', 2, 'Calea prin R3 are cost 3, iar calea prin R2 cost 3. După ce setezi ip ospf cost 3 pe interfața către R3 (cost total prin R3 devine 4), ce rămâne în tabelă?', [
    ['Doar calea prin R2 (cost 3)', true, 'Metricile nu mai sunt egale; câștigă cea mai mică.'],
    ['Ambele căi', false, 'ECMP necesită metrici identice; acum sunt 3 și 4.'],
    ['Doar calea prin R3', false, 'Are cost mai mare.'],
    ['Niciuna', false, 'Ruta rămâne prin R2.'],
  ], 'Egalitatea exactă este necesară.'),
  single({ id: '3.2-033' }, '3.2.b', 3, 'Un router are pentru 192.168.3.0/24 OSPF (110), RIP (120) și o statică flotantă (130). OSPF și RIP dispar, în această ordine. Ce rută este activă la final?', [
    ['Ruta statică flotantă (130)', true, 'Rămâne singura sursă pentru prefix.'],
    ['Ruta OSPF', false, 'A dispărut.'],
    ['Ruta RIP', false, 'A dispărut și ea.'],
    ['Niciuna', false, 'Ruta flotantă se activează.'],
  ], 'Se parcurge ordinea AD: OSPF → RIP → statică.'),
  multi({ id: '3.2-034' }, '3.2.a', 3, 'Care afirmații despre longest prefix match sunt adevărate? (alege trei)', [
    ['Nu ține cont de AD', true, 'AD se compară doar pentru același prefix.'],
    ['Funcționează la fel în IPv6', true, 'Același principiu, cu prefixe de până la /128.'],
    ['Face ca ruta implicită să fie folosită ultima', true, 'Are lungimea 0.'],
    ['Alege ruta cu cea mai mică metrică dintre toate cele potrivite', false, 'Metrica e al treilea criteriu.'],
    ['Alege întotdeauna ruta statică', false, 'Statică sau nu, contează lungimea.'],
  ], 'LPM: fără AD, la fel în IPv6, default ultima.'),
  single({ id: '3.2-035' }, '3.2.a', 2, 'Care rută câștigă pentru 172.16.5.9 între S 172.16.0.0/16 [1/0], O 172.16.5.0/24 [110/10] și D 172.16.0.0/12 [90/3072]?', [
    ['O 172.16.5.0/24', true, '/24 este cel mai lung prefix care conține adresa.'],
    ['S 172.16.0.0/16', false, 'Mai general; AD 1 nu contează.'],
    ['D 172.16.0.0/12', false, 'Cel mai general dintre cele trei.'],
    ['Niciuna, intră în conflict', false, 'Routerul alege cea mai specifică.'],
  ], '/24 > /16 > /12.'),
  single({ id: '3.2-036' }, '3.2', 3, 'Care e legătura dintre RIB și FIB?', [
    ['FIB este copia optimizată a tabelei de rutare (RIB), folosită la transmiterea rapidă (CEF)', true, 'Decizia efectivă pe pachet se ia din FIB.'],
    ['FIB este tabela MAC a routerului', false, 'Tabela MAC aparține switch-urilor.'],
    ['FIB conține rutele pierzătoare ale protocoalelor', false, 'Conține doar rutele instalate.'],
    ['FIB este identic cu cache-ul ARP', false, 'ARP rezolvă MAC-uri, FIB conține prefixe.'],
  ], 'RIB → FIB.'),
  single({ id: '3.2-037' }, '3.2', 3, 'Ruta aleasă este „C 192.168.3.0/24 … Gi0/1”. Pentru ce adresă face routerul ARP?', [
    ['Pentru destinația finală (ex. 192.168.3.10), pentru că este pe același link', true, 'La rutele connected nu există next hop: livrare directă.'],
    ['Pentru adresa de broadcast', false, 'ARP cere o anumită adresă.'],
    ['Pentru adresa propriei interfețe', false, 'O cunoaște deja.'],
    ['Nu face ARP, cadrul se trimite în broadcast', false, 'Routerul trimite un cadru unicast după ce află MAC-ul.'],
  ], 'Connected ⇒ ARP pentru destinație.'),
  { id: '3.2-038', topicId: T, sub: '3.2', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii unui router care primește și transmite un pachet.',
    items: [
      { text: 'Primește cadrul și îndepărtează antetul Ethernet', why: 'Decapsularea.' },
      { text: 'Citește IP-ul de destinație și TTL-ul', why: 'Pregătește decizia.' },
      { text: 'Alege ruta (longest prefix match) și află next hop-ul și interfața', why: 'Decizia de transmitere.' },
      { text: 'Scade TTL și recalculează checksum-ul', why: 'Înainte de retrimitere.' },
      { text: 'Află MAC-ul next hop-ului (ARP), încapsulează și trimite', why: 'Ultimul pas: rescrierea L2 și transmiterea.' },
    ],
    explanation: 'Decapsulare → citire → decizie → TTL → rescriere L2.' },
  single({ id: '3.2-039' }, '3.2', 2, 'Cum se schimbă antetele pe tot traseul PC1 → R1 → R2 → PC3 (fără NAT)?', [
    ['IP-urile rămân, MAC-urile se schimbă la fiecare hop', true, 'IP identifică capetele; MAC identifică următorul hop.'],
    ['IP-urile se schimbă, MAC-urile rămân', false, 'Invers față de realitate.'],
    ['Nimic nu se schimbă', false, 'MAC-urile și TTL se schimbă.'],
    ['Se schimbă toate adresele', false, 'IP-urile se păstrează.'],
  ], 'L3 stabil, L2 pe segment.'),
  single({ id: '3.2-040' }, '3.2.a', 2, 'Cum se aplică longest prefix match în IPv6?', [
    ['La fel ca în IPv4: se alege cel mai lung prefix care conține adresa (::/0 este ruta implicită)', true, 'Principiu identic, cu prefixe de până la /128.'],
    ['Nu se aplică; IPv6 folosește doar rute implicite', false, 'IPv6 folosește tabele de rutare complete.'],
    ['Se alege cea mai scurtă mască', false, 'Se alege cea mai lungă.'],
    ['Se alege ruta cu cea mai mare adresă', false, 'Nu există o astfel de regulă.'],
  ], 'Același LPM în IPv6.'),
];
