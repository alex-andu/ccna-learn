import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.7 Explain the forwarding PHB for QoS (classification, marking, queuing, congestion, policing, shaping).
// Obiectivul oficial nu are sub-puncte; `sub` = '4.7'. Fiecare variantă are explicație (why).
const T = '4.7';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_7: Question[] = [
  // ======================= Concepte =======================
  single({ id: '4.7-001' }, 1, 'Când are efect QoS?', [
    ['Când există congestie și resursele nu ajung pentru tot traficul', true, 'QoS decide cine primește întâi resursele limitate.'],
    ['Oricând, chiar pe o legătură complet liberă', false, 'Pe o legătură liberă toate pachetele trec oricum fără așteptare.'],
    ['Doar la pornirea routerului', false, 'Nu are legătură cu boot-ul.'],
    ['Doar în rețele wireless', false, 'QoS se aplică și pe cablu.'],
  ], 'QoS lucrează la congestie.'),
  single({ id: '4.7-002' }, 1, 'Ce este un PHB (Per-Hop Behavior)?', [
    ['Comportamentul pe care un router îl aplică local unei clase de trafic marcate', true, 'Este definit per hop, pe baza marcajului.'],
    ['Un protocol de rutare', false, 'PHB nu este protocol de rutare.'],
    ['Un tip de cablu', false, 'Nu are legătură cu cablarea.'],
    ['Un câmp din antetul TCP', false, 'PHB este un comportament, iar marcajul stă în antetul IP.'],
  ], 'PHB = tratamentul local al unei clase.'),
  single({ id: '4.7-003' }, 1, 'Care tip de trafic este cel mai sensibil la întârziere și jitter?', [
    ['Vocea în timp real (VoIP)', true, 'Pachetele de voce trebuie redate la intervale regulate.'],
    ['Copierea unui fișier mare', false, 'TCP tolerează întârzierea și retransmiterile.'],
    ['Backup-ul nocturn', false, 'Nu are cerințe de timp real.'],
    ['Descărcarea unui update', false, 'Este trafic bulk, tolerant la întârziere.'],
  ], 'Voce = delay, jitter, loss critice.'),
  single({ id: '4.7-004' }, 1, 'Ce este jitter-ul?', [
    ['Variația întârzierii între pachetele consecutive ale unui flux', true, 'Pachetele ajung la intervale neregulate.'],
    ['Numărul de pachete pierdute', false, 'Aceasta este rata de pierderi (loss).'],
    ['Viteza maximă a legăturii', false, 'Aceasta este banda (bandwidth).'],
    ['Timpul total dus-întors', false, 'Aceasta este latența/RTT; jitter este variația ei.'],
  ], 'Jitter = variația delay-ului.'),
  single({ id: '4.7-005' }, 2, 'Care model QoS marchează pachetele în clase și lasă fiecare router să aplice un PHB?', [
    ['DiffServ', true, 'Model scalabil, pe clase.'],
    ['IntServ', false, 'IntServ rezervă resurse per flux (RSVP).'],
    ['Best effort', false, 'Best effort nu diferențiază clase.'],
    ['Port mirroring', false, 'Nu este un model QoS.'],
  ], 'DiffServ = clase + PHB.'),
  single({ id: '4.7-006' }, 1, 'Câți biți are câmpul DSCP și unde este?', [
    ['6 biți, în octetul ToS/Traffic Class al antetului IP', true, 'Primii 6 biți ai octetului; ultimii 2 sunt ECN.'],
    ['3 biți, în eticheta 802.1Q', false, 'Aceasta este descrierea CoS/PCP.'],
    ['8 biți, în antetul TCP', false, 'DSCP este în antetul IP, nu TCP.'],
    ['16 biți, în antetul Ethernet', false, 'Ethernet nu conține DSCP.'],
  ], 'DSCP: 6 biți, 0–63.'),
  single({ id: '4.7-007' }, 1, 'Care este valoarea DSCP a PHB-ului EF (voce)?', [
    ['46', true, 'EF = 101110 = 46.'],
    ['34', false, 'Aceasta este AF41.'],
    ['26', false, 'Aceasta este AF31.'],
    ['0', false, 'Aceasta este best effort (DF).'],
  ], 'EF = 46.'),
  single({ id: '4.7-008' }, 2, 'Care este valoarea DSCP pentru AF41?', [
    ['34', true, 'AF41 = 8 × 4 + 2 × 1 = 34.'],
    ['41', false, 'Numărul din nume nu este valoarea DSCP.'],
    ['46', false, 'Aceasta este EF.'],
    ['40', false, 'Aceasta este CS5 (8 × 5), nu AF41.'],
  ], 'AFxy = 8x + 2y.'),
  single({ id: '4.7-009' }, 2, 'Ce limitare are marcajul CoS (802.1Q)?', [
    ['Există doar pe cadre cu etichetă și dispare când cadrul trece printr-un router', true, 'După rutare, marcajul care rămâne este DSCP.'],
    ['Are 6 biți', false, 'CoS are 3 biți.'],
    ['Se păstrează end-to-end pe Internet', false, 'Se pierde la router.'],
    ['Funcționează doar în wireless', false, 'Se aplică pe trunk-uri cablate.'],
  ], 'CoS este L2, local.'),
  single({ id: '4.7-010' }, 2, 'Ce este trust boundary?', [
    ['Punctul până la care marcajele QoS sunt considerate de încredere', true, 'Dincolo de el se resetează/verifică marcajele.'],
    ['Limita de viteză a unei interfețe', false, 'Aceea nu este trust boundary.'],
    ['Numărul maxim de clase QoS', false, 'Nu are legătură.'],
    ['Perimetrul firewall-ului', false, 'Este un concept de QoS, nu de firewall.'],
  ], 'Trust boundary = granița de încredere a marcajelor.'),
  single({ id: '4.7-011' }, 2, 'Ce înseamnă LLQ?', [
    ['CBWFQ plus o coadă prioritară strictă (de exemplu pentru voce)', true, 'Coada prioritară este servită prima, dar limitată ca bandă.'],
    ['Un protocol de rutare cu latență mică', false, 'LLQ este un mecanism de coadă.'],
    ['O coadă FIFO simplă', false, 'FIFO nu are priorități.'],
    ['Un tip de policing', false, 'LLQ este queuing, nu policing.'],
  ], 'LLQ = CBWFQ + priority queue.'),
  single({ id: '4.7-012' }, 3, 'Ce este sincronizarea globală TCP?', [
    ['Multe sesiuni TCP își reduc simultan ferestrele după tail drop și apoi cresc toate odată', true, 'Legătura alternează între supraîncărcare și subutilizare.'],
    ['Sincronizarea ceasurilor prin NTP', false, 'Aceea este NTP.'],
    ['Replicarea tabelei MAC între switch-uri', false, 'Nu are legătură.'],
    ['Un tip de handshake în trei pași', false, 'Handshake-ul este altceva.'],
  ], 'Tail drop duce la oscilații TCP.'),
  single({ id: '4.7-013' }, 2, 'Ce face WRED?', [
    ['Aruncă pachete aleatoriu și devreme, mai agresiv pentru prioritățile mici, înainte ca coada să fie plină', true, 'Previne tail drop și sincronizarea TCP.'],
    ['Aruncă toate pachetele la umplerea cozii', false, 'Aceea este tail drop.'],
    ['Garantează banda vocii', false, 'Aceea este LLQ/CBWFQ.'],
    ['Marchează pachetele cu DSCP', false, 'Marcarea este altceva.'],
  ], 'WRED = drop timpuriu ponderat.'),
  single({ id: '4.7-014' }, 2, 'Ce oferă CBWFQ unei clase?', [
    ['O bandă minimă garantată în congestie', true, 'Parametrul bandwidth.'],
    ['Prioritate strictă nelimitată', false, 'Prioritatea strictă este LLQ, cu limită.'],
    ['Criptare', false, 'QoS nu criptează.'],
    ['Eliminarea oricărei întârzieri', false, 'Nu poate garanta zero delay.'],
  ], 'CBWFQ = bandă garantată per clasă.'),
  single({ id: '4.7-015' }, 1, 'Care mecanism adaugă întârziere traficului pentru a respecta o rată?', [
    ['Shaping', true, 'Excesul este bufferizat și transmis mai târziu.'],
    ['Policing', false, 'Policing aruncă, nu amână.'],
    ['Marcarea DSCP', false, 'Nu adaugă întârziere.'],
    ['Clasificarea', false, 'Doar recunoaște tipul de trafic.'],
  ], 'Shaping delays; policing drops.'),
  single({ id: '4.7-016' }, 2, 'În ce direcție se aplică shaping?', [
    ['Doar la ieșire (output)', true, 'Excesul se poate amâna doar înainte de transmitere.'],
    ['Doar la intrare', false, 'Nu poți încetini ce ai primit deja.'],
    ['Oricare direcție', false, 'Shaping este doar la ieșire.'],
    ['Doar pe interfețe loopback', false, 'Nu are legătură.'],
  ], 'Shaping = output.'),
  single({ id: '4.7-017' }, 2, 'Ce poate face policing cu traficul care depășește rata?', [
    ['Îl aruncă sau îl re-marchează', true, 'Nu există buffer.'],
    ['Îl pune într-o coadă mare și îl trimite mai târziu', false, 'Aceea este shaping.'],
    ['Îl criptează', false, 'Nu are legătură.'],
    ['Îl duplică', false, 'Nu are sens.'],
  ], 'Policing = drop / remark.'),
  single({ id: '4.7-018' }, 3, 'Unde se folosește tipic shaping?', [
    ['La client, înainte de o legătură WAN cu rată contractată mai mică decât viteza interfeței', true, 'Evită ca ISP-ul să facă policing și să arunce.'],
    ['Pe portul de acces al unui PC', false, 'Nu este scenariul tipic.'],
    ['Doar pe legături de 10 Gb/s', false, 'Nu depinde de viteza maximă.'],
    ['Nicăieri în rețelele reale', false, 'Este frecvent folosit.'],
  ], 'Shaping la ieșirea clientului spre WAN.'),
  single({ id: '4.7-019' }, 2, 'De ce se marchează traficul cât mai aproape de sursă?', [
    ['Ca restul hop-urilor să aplice PHB direct pe marcaj, fără reclasificare', true, 'Clasificarea costisitoare se face o singură dată.'],
    ['Pentru că marcajele nu pot fi schimbate ulterior', false, 'Pot fi schimbate la orice hop.'],
    ['Pentru a reduce numărul de VLAN-uri', false, 'Nu are legătură.'],
    ['Pentru a cripta traficul', false, 'Marcarea nu criptează.'],
  ], 'Marcare la margine, PHB în rest.'),
  single({ id: '4.7-020' }, 3, 'Un pachet este marcat EF, dar un router intermediar nu are politică QoS. Cum îl tratează?', [
    ['Ca best effort: PHB-ul este per-hop și trebuie configurat pe fiecare router', true, 'Marcajul singur nu garantează tratamentul.'],
    ['Cu prioritate, deoarece EF este universal', false, 'Fără politică, marcajul este ignorat.'],
    ['Îl aruncă', false, 'Nu îl aruncă din cauza marcajului.'],
    ['Îl re-marchează automat', false, 'Nu are loc o re-marcare automată.'],
  ], 'QoS trebuie configurat pe fiecare hop.'),
  single({ id: '4.7-021' }, 2, 'Care este ordinea elementelor MQC?', [
    ['class-map → policy-map → service-policy', true, 'Clasifici, definești acțiunile, aplici pe interfață.'],
    ['service-policy → class-map → policy-map', false, 'Politica trebuie definită înainte să fie aplicată.'],
    ['policy-map → service-policy → class-map', false, 'Clasele trebuie definite înainte de politică.'],
    ['class-map → service-policy → policy-map', false, 'service-policy aplică o politică deja definită.'],
  ], 'MQC: class → policy → service-policy.'),
  single({ id: '4.7-022' }, 2, 'Ce comandă arată contoarele pe clase ale politicii aplicate pe o interfață?', [
    ['show policy-map interface', true, 'Afișează clasele, contoarele și drop-urile.'],
    ['show running-config | include qos', false, 'Arată configurația, nu contoarele.'],
    ['show ip route', false, 'Este tabela de rutare.'],
    ['show vlan brief', false, 'Nu are legătură.'],
  ], 'show policy-map interface.'),
  single({ id: '4.7-023' }, 3, 'Care este valoarea DSCP a AF31?', [
    ['26', true, '8 × 3 + 2 × 1 = 26.'],
    ['31', false, 'Numărul din nume nu este DSCP.'],
    ['24', false, 'Aceasta este CS3.'],
    ['28', false, 'Aceasta este AF32 (8 × 3 + 2 × 2).'],
  ], 'AF31 = 26.'),
  single({ id: '4.7-024' }, 2, 'Care este valoarea DSCP pentru CS6 (control de rețea)?', [
    ['48', true, 'CSx = 8 × x → 8 × 6 = 48.'],
    ['46', false, 'Aceasta este EF.'],
    ['6', false, 'Aceasta este numărul clasei, nu DSCP.'],
    ['56', false, 'Aceasta este CS7.'],
  ], 'CS6 = 48.'),
  single({ id: '4.7-025' }, 3, 'Care este valoarea întregului octet ToS pentru DSCP 46 (ECN = 0)?', [
    ['184', true, '46 × 4 = 184 (0xB8).'],
    ['46', false, 'Aceasta este valoarea DSCP, nu octetul.'],
    ['92', false, 'Ar corespunde unui DSCP de 23.'],
    ['368', false, 'Depășește 8 biți.'],
  ], 'Octet ToS = DSCP × 4.'),
  single({ id: '4.7-026' }, 3, 'Ce valoare IP Precedence corespunde lui EF (DSCP 46 = 101110)?', [
    ['5', true, 'Primii 3 biți sunt 101 = 5.'],
    ['6', false, 'Ar corespunde primilor biți 110.'],
    ['46', false, 'Aceasta este valoarea DSCP.'],
    ['7', false, 'Ar corespunde primilor biți 111.'],
  ], 'IPP = primii 3 biți ai DSCP.'),
  single({ id: '4.7-027' }, 3, 'Ce se întâmplă cu marcajul CoS când cadrul trece printr-un router?', [
    ['Dispare, pentru că eticheta 802.1Q nu există în pachetul rutat', true, 'Rămâne doar marcajul DSCP.'],
    ['Se copiază automat în DSCP, mereu', false, 'Maparea trebuie configurată.'],
    ['Se dublează', false, 'Nu se întâmplă.'],
    ['Rămâne neschimbat până la destinație', false, 'Eticheta L2 nu supraviețuiește rutării.'],
  ], 'CoS este doar L2.'),
  single({ id: '4.7-028' }, 3, 'De ce coada prioritară din LLQ este limitată?', [
    ['Ca să nu „înfometeze” celelalte clase în caz de trafic prioritar excesiv', true, 'Este policed în congestie.'],
    ['Pentru că routerul nu poate face coadă mai mare', false, 'Motivul este echitatea, nu o limită tehnică.'],
    ['Pentru a economisi energie', false, 'Nu are legătură.'],
    ['Pentru a elimina DSCP', false, 'Nu are legătură.'],
  ], 'Limitare = protecție împotriva starvation.'),

  // ======================= Multi =======================
  multi({ id: '4.7-029' }, 2, 'Care sunt instrumente QoS? (alege toate variantele corecte)', [
    ['Clasificarea și marcarea', true, 'Primii pași ai lanțului QoS.'],
    ['Cozile (queuing) și evitarea congestiei', true, 'Gestionează congestia.'],
    ['Policing', true, 'Limitează rata prin drop/re-marcare.'],
    ['Shaping', true, 'Limitează rata prin bufferizare.'],
    ['Spanning Tree', false, 'Previne bucle L2; nu este QoS.'],
  ], 'Clasificare, marcare, cozi, policing, shaping.'),
  multi({ id: '4.7-030' }, 2, 'Care sunt caracteristicile unei rețele care afectează calitatea traficului în timp real? (alege toate variantele corecte)', [
    ['Delay (întârziere)', true, 'Prea mare = conversație nenaturală.'],
    ['Jitter', true, 'Variația delay-ului strică redarea.'],
    ['Loss (pierderi)', true, 'Pachete lipsă = goluri în sunet.'],
    ['Numărul de VLAN-uri configurate', false, 'Nu este o metrică QoS.'],
  ], 'Delay, jitter, loss (și banda).'),
  multi({ id: '4.7-031' }, 3, 'Care afirmații despre policing sunt adevărate? (alege toate variantele corecte)', [
    ['Poate arunca excesul', true, 'Acțiunea de bază.'],
    ['Poate re-marca excesul într-o clasă mai slabă', true, 'Variantă frecventă, în loc de drop.'],
    ['Nu adaugă întârziere de buffer', true, 'Nu există buffer.'],
    ['Se aplică doar la ieșire', false, 'Policing se poate aplica și la intrare.'],
  ], 'Policing: drop/remark, fără buffer.'),

  // ======================= Match =======================
  match({ id: '4.7-032' }, 2, 'Potrivește PHB-ul cu valoarea DSCP.', [
    { left: 'EF', right: '46', why: 'Voce.' },
    { left: 'AF41', right: '34', why: '8 × 4 + 2.' },
    { left: 'AF31', right: '26', why: '8 × 3 + 2.' },
    { left: 'CS6', right: '48', why: '8 × 6.' },
    { left: 'DF', right: '0', why: 'Best effort.' },
  ], [
    { text: '64', why: 'DSCP are doar 6 biți: maximum 63.' },
  ], 'EF 46, AF41 34, AF31 26, CS6 48, DF 0.'),
  match({ id: '4.7-033' }, 2, 'Potrivește conceptul cu descrierea lui.', [
    { left: 'Policing', right: 'Aruncă sau re-marchează excesul', why: 'Fără buffer.' },
    { left: 'Shaping', right: 'Bufferizează excesul și îl amână', why: 'Adaugă întârziere.' },
    { left: 'LLQ', right: 'CBWFQ cu coadă prioritară strictă', why: 'Pentru voce.' },
    { left: 'WRED', right: 'Drop timpuriu, ponderat pe prioritate', why: 'Evită tail drop.' },
  ], [
    { text: 'Criptează traficul', why: 'QoS nu criptează.' },
  ], 'Fiecare mecanism cu rolul lui.'),

  // ======================= Order =======================
  order({ id: '4.7-034' }, 2, 'Ordonează lanțul QoS aplicat unui pachet.', [
    { text: 'Clasificare', why: 'Se recunoaște tipul de trafic.' },
    { text: 'Marcare', why: 'Se scrie DSCP/CoS.' },
    { text: 'Policing (opțional)', why: 'Se limitează rata clasei.' },
    { text: 'Queuing și evitarea congestiei', why: 'LLQ/CBWFQ/WRED la ieșire.' },
    { text: 'Shaping (opțional)', why: 'Se netezește la rata contractată.' },
  ], 'Clasificare → marcare → policing → cozi → shaping.'),
  order({ id: '4.7-035' }, 2, 'Ordonează valorile DSCP de la cea mai mică la cea mai mare.', [
    { text: 'DF = 0', why: 'Cel mai mic.' },
    { text: 'AF11 = 10', why: '8 × 1 + 2.' },
    { text: 'AF31 = 26', why: '8 × 3 + 2.' },
    { text: 'AF41 = 34', why: '8 × 4 + 2.' },
    { text: 'EF = 46', why: 'Voce.' },
    { text: 'CS6 = 48', why: '8 × 6.' },
  ], '0 < 10 < 26 < 34 < 46 < 48.'),

  // ======================= CLI =======================
  cli({ id: '4.7-036' }, 2, 'Ești în R1(config)#. Creează clasa „VOICE” care cere îndeplinirea tuturor condițiilor.', 'R1(config)#', 'class-map match-all VOICE', ['class-map match-all VOICE'], [
    { text: 'class-map VOICE match-all', why: 'Cuvântul match-all vine înaintea numelui.' },
    { text: 'policy-map VOICE', why: 'Creează o politică, nu o clasă.' },
    { text: 'class VOICE', why: 'class se folosește în interiorul unui policy-map.' },
  ], 'class-map match-all <nume>.', 'class-map …'),
  cli({ id: '4.7-037' }, 2, 'Ești în R1(config-cmap)#. Clasifică traficul marcat EF.', 'R1(config-cmap)#', 'match dscp ef', ['match dscp ef', 'match dscp 46'], [
    { text: 'match ef', why: 'Trebuie specificat tipul de câmp (dscp).' },
    { text: 'match precedence ef', why: 'IP Precedence nu acceptă cuvântul ef.' },
    { text: 'set dscp ef', why: 'set marchează; match clasifică.' },
  ], 'match dscp ef.', 'match dscp …'),
  cli({ id: '4.7-038' }, 3, 'Ești în R1(config-pmap-c)#. Dă clasei o coadă prioritară de 20% din bandă.', 'R1(config-pmap-c)#', 'priority percent 20', ['priority percent 20'], [
    { text: 'bandwidth percent 20', why: 'Dă bandă garantată (CBWFQ), nu coadă prioritară.' },
    { text: 'priority 20 percent', why: 'Ordinea cuvintelor este priority percent <valoare>.' },
    { text: 'llq 20', why: 'Nu este o comandă IOS.' },
  ], 'priority percent <n> = LLQ.', 'priority …'),
  cli({ id: '4.7-039' }, 2, 'Ești în R1(config-if)#. Aplică politica WAN-OUT pe traficul care iese pe interfață.', 'R1(config-if)#', 'service-policy output WAN-OUT', ['service-policy output WAN-OUT'], [
    { text: 'service-policy WAN-OUT out', why: 'Direcția vine înaintea numelui.' },
    { text: 'policy-map WAN-OUT output', why: 'policy-map definește politica, nu o aplică.' },
    { text: 'service-policy input WAN-OUT', why: 'input aplică pe traficul care intră.' },
  ], 'service-policy output <politică>.', 'service-policy … '),
  cli({ id: '4.7-040' }, 2, 'Ești în R1# (EXEC). Afișează contoarele politicii QoS aplicate pe Gi0/0.', 'R1#', 'show policy-map interface gigabitEthernet 0/0', ['show policy-map interface gigabitEthernet 0/0', 'show policy-map interface g0/0', 'show policy-map interface gi0/0'], [
    { text: 'show class-map gigabitEthernet 0/0', why: 'show class-map arată definițiile claselor, nu contoarele pe interfață.' },
    { text: 'show qos interface g0/0', why: 'Nu este comanda IOS pentru MQC.' },
    { text: 'show policy-map', why: 'Arată doar politicile definite, nu contoarele pe o interfață.' },
  ], 'show policy-map interface <if>.', 'show policy-map …'),
];
