import type { Question } from '../../lib/types';

// Banca de întrebări pentru 3.4 Configure and verify single area OSPFv2.
// Sub-puncte oficiale: a neighbor adjacencies · b point-to-point · c broadcast (DR/BDR) · d router ID. Fiecare variantă are explicație (why).
const T = '3.4';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub, type: 'match', difficulty, stem, pairs, distractors, explanation });

export const Q_3_4: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '3.4-001' }, '3.4', 1, 'Ce tip de algoritm de rutare folosește OSPF?', [
    ['Link-state: fiecare router construiește harta completă și calculează singur căile', true, 'OSPF trimite descrieri ale legăturilor (LSA), nu tabele de rutare, și rulează SPF pe harta comună.'],
    ['Distance-vector: fiecare router ia tabelele vecinilor ca adevăr', false, 'Acesta este modelul RIP; OSPF nu transmite tabele de rutare.'],
    ['Path-vector: rutele conțin lista sistemelor autonome parcurse', false, 'Acesta este modelul BGP.'],
    ['Static: rutele sunt scrise manual de administrator', false, 'Ruta statică nu are protocol; OSPF se adaptează automat.'],
  ], 'OSPF = link-state. Harta comună permite calcul independent și convergență rapidă.'),
  single({ id: '3.4-002' }, '3.4', 2, 'Ce număr de protocol IP folosește OSPFv2?', [
    ['89', true, 'OSPF rulează direct peste IP, cu protocolul 89, nu peste TCP sau UDP.'],
    ['6', false, 'Protocolul 6 este TCP.'],
    ['17', false, 'Protocolul 17 este UDP; RIP folosește UDP 520, nu OSPF.'],
    ['88', false, 'Protocolul 88 este EIGRP, nu OSPF.'],
  ], 'OSPF = protocolul IP 89.'),

  // ======================= 3.4.a — Neighbor adjacencies =======================
  single({ id: '3.4-003' }, '3.4.a', 1, 'Pe ce adresă multicast trimite OSPF pachetele Hello?', [
    ['224.0.0.5 (AllSPFRouters)', true, 'Toate routerele OSPF ascultă pe această adresă.'],
    ['224.0.0.9', false, 'Aceasta este adresa RIPv2, nu OSPF.'],
    ['224.0.0.10', false, 'Aceasta este adresa EIGRP.'],
    ['255.255.255.255', false, 'Aceasta este broadcast, nu multicast OSPF.'],
  ], 'Hello → 224.0.0.5.'),
  single({ id: '3.4-004' }, '3.4.a', 1, 'Care sunt valorile implicite Hello și Dead pe o interfață Ethernet cu OSPF?', [
    ['Hello 10 s, Dead 40 s', true, 'Dead este de 4 ori Hello pe broadcast și point-to-point.'],
    ['Hello 30 s, Dead 120 s', false, 'Aceste valori sunt pentru NBMA și point-to-multipoint.'],
    ['Hello 5 s, Dead 20 s', false, 'Nu sunt valorile implicite; apar doar dacă le setezi manual.'],
    ['Hello 1 s, Dead 4 s', false, 'Nu sunt valori implicite OSPF.'],
  ], 'Ethernet: 10/40.'),
  single({ id: '3.4-005' }, '3.4.a', 2, 'Între doi routere OSPF apare starea 2-WAY. Ce înseamnă?', [
    ['Fiecare a primit Hello de la celălalt și și-a văzut propriul RID în lista vecinului', true, 'Aceasta este comunicarea bidirecțională; schimbul de baze de date nu a început încă.'],
    ['Schimbul LSDB s-a încheiat și relația este Full', false, 'Full este starea finală; 2-WAY apare mai devreme.'],
    ['Nu primesc niciun Hello', false, 'În acel caz vecinul ar fi Down sau Init.'],
    ['Au MTU diferit și sunt blocați', false, 'Blocajul MTU apare în ExStart/Exchange, nu în 2-WAY.'],
  ], '2-WAY = văzut reciproc.'),
  single({ id: '3.4-006' }, '3.4.a', 2, 'În ce stare se stabilește master și slave pentru schimbul de DBD-uri?', [
    ['ExStart', true, 'În ExStart routerele aleg master (RID mai mare) și slave, apoi încep schimbul.'],
    ['Init', false, 'În Init routerul doar a primit un Hello.'],
    ['Loading', false, 'În Loading se cer și se primesc LSA-urile lipsă.'],
    ['Full', false, 'Full e starea finală, după sincronizare.'],
  ], 'ExStart = master/slave.'),
  single({ id: '3.4-007' }, '3.4.a', 2, 'Un vecin rămâne blocat în ExStart sau Exchange. Care este cauza cea mai probabilă?', [
    ['MTU diferit între cele două interfețe', true, 'Pachetele DBD sunt prea mari pentru un capăt; de aceea adiacența nu avansează.'],
    ['Costuri OSPF diferite', false, 'Costul nu influențează formarea adiacenței; afectează doar alegerea căii.'],
    ['Priorități diferite', false, 'Prioritatea afectează doar alegerea DR/BDR.'],
    ['Interfață pasivă pe un capăt', false, 'Pasiv oprește Hello-urile; în acel caz vecinul nu apare deloc, nu rămâne în ExStart.'],
  ], 'ExStart/Exchange blocat ⇒ MTU.'),
  multi({ id: '3.4-008' }, '3.4.a', 2, 'Care parametri trebuie să se potrivească între doi vecini OSPF pe Ethernet? (alege toate corecte)', [
    ['Area ID', true, 'Vecinii trebuie să fie în aceeași zonă pe segmentul comun.'],
    ['Timerele Hello și Dead', true, 'O diferență împiedică formarea adiacenței.'],
    ['Subrețeaua și masca', true, 'Ambele IP-uri trebuie să fie în aceeași subrețea.'],
    ['Router ID-ul', false, 'RID-ul trebuie să fie unic, nu identic.'],
    ['Costul interfeței', false, 'Costul poate diferi; el decide doar calea preferată.'],
  ], 'Area, timere, subrețea (și MTU, autentificare, flag stub).'),
  match({ id: '3.4-009' }, '3.4.a', 2, 'Potrivește tipul de pachet OSPF cu rolul lui.', [
    { left: 'Hello', right: 'Descoperă vecinii și confirmă că sunt activi', why: 'Primul pachet; se trimite periodic.' },
    { left: 'DBD', right: 'Trimite rezumatul LSDB-ului în Exchange', why: 'Listează ce LSA-uri are expeditorul, fără conținutul lor complet.' },
    { left: 'LSR', right: 'Cere LSA-urile lipsă', why: 'Solicită explicit ceea ce vecinul a anunțat în DBD.' },
    { left: 'LSU', right: 'Transportă LSA-urile cerute', why: 'Conține conținutul complet al LSA-urilor.' },
    { left: 'LSAck', right: 'Confirmă primirea LSU', why: 'Asigură livrarea fiabilă a LSA-urilor.' },
  ], [{ text: 'ICMP Echo Reply', why: 'Este un mesaj ICMP, nu un pachet OSPF.' }], 'Cinci tipuri, cinci roluri.'),
  { id: '3.4-010', topicId: T, sub: '3.4.a', type: 'order', difficulty: 2,
    stem: 'Ordonează stările prin care trece un vecin OSPF până devine Full.',
    items: [
      { text: 'Down', why: 'Punctul de plecare: niciun Hello recent de la vecin.' },
      { text: 'Init', why: 'Am primit primul Hello de la vecin.' },
      { text: '2-WAY', why: 'Vecinul a listat RID-ul meu: comunicare bidirecțională.' },
      { text: 'ExStart', why: 'Se aleg master și slave, înainte de schimbul de DBD.' },
      { text: 'Exchange', why: 'Se schimbă DBD-urile cu rezumatul LSDB-ului.' },
      { text: 'Loading', why: 'Se cer și se primesc LSA-urile lipsă.' },
      { text: 'Full', why: 'LSDB sincronizat: adiacența este completă.' },
    ],
    explanation: 'Down → Init → 2-WAY → ExStart → Exchange → Loading → Full.' },
  { id: '3.4-011', topicId: T, sub: '3.4.a', type: 'cli', difficulty: 2,
    stem: 'Afișează vecinii OSPF ai lui R1 (starea și rolul fiecărui vecin).',
    prompt: 'R1#', canonical: 'show ip ospf neighbor', answers: ['show ip ospf neighbor', 'sh ip ospf neighbor', 'show ip ospf neighbors'], hint: 'show ip ospf …',
    wrong: [
      { text: 'show ip ospf interface brief', why: 'Arată interfețele și costurile, nu lista vecinilor.' },
      { text: 'show ip route ospf', why: 'Arată rutele învățate prin OSPF, nu starea vecinilor.' },
      { text: 'show ip protocols', why: 'Arată configurația protocolului (RID, rețele), nu vecinii.' },
    ],
    explanation: 'show ip ospf neighbor: Neighbor ID, Pri, State (de ex. FULL/DR), Dead Time, Address, Interface.' },

  // ======================= 3.4.b — Point-to-point =======================
  single({ id: '3.4-012' }, '3.4.b', 1, 'Care este tipul de rețea OSPF implicit pe o interfață Ethernet?', [
    ['Broadcast', true, 'Ethernet folosește DR și BDR; de aceea apare FULL/DR sau FULL/BDR în show.'],
    ['Point-to-point', false, 'Acesta este implicit pe serial cu HDLC sau PPP, nu pe Ethernet.'],
    ['NBMA', false, 'NBMA este tipul pentru Frame Relay pe interfața fizică.'],
    ['Point-to-multipoint', false, 'Nu este tipul implicit pe Ethernet.'],
  ], 'Ethernet = broadcast.'),
  single({ id: '3.4-013' }, '3.4.b', 2, 'Pe care interfață tipul implicit OSPF este point-to-point?', [
    ['Serial cu HDLC sau PPP', true, 'Doar două capete; nu are rost un DR.'],
    ['Ethernet', false, 'Ethernet este implicit broadcast.'],
    ['Frame Relay pe interfața fizică', false, 'Acela este NBMA.'],
    ['GigabitEthernet', false, 'Gigabit este Ethernet, deci broadcast implicit.'],
  ], 'Serial HDLC/PPP ⇒ point-to-point.'),
  single({ id: '3.4-014' }, '3.4.b', 2, 'Pe o legătură point-to-point, ce NU există?', [
    ['Alegerea DR și BDR', true, 'Sunt doar două routere; nu există segment cu mai mulți vecini de coordonat.'],
    ['Pachetele Hello', false, 'Hello-urile există și pe point-to-point, la 224.0.0.5.'],
    ['Adiacența completă', false, 'Vecinii ajung și pe point-to-point în starea Full.'],
    ['Timerele Hello și Dead', false, 'Sunt setate și pe point-to-point (10 s / 40 s implicit).'],
  ], 'Point-to-point ⇒ fără DR/BDR.'),
  single({ id: '3.4-015' }, '3.4.b', 2, 'Care comandă face o interfață Ethernet să fie tratată ca point-to-point de OSPF?', [
    ['ip ospf network point-to-point', true, 'Se scrie în modul de configurare a interfeței, cu prefixul ip ospf.'],
    ['ospf network point-to-point', false, 'Lipsește prefixul ip; comanda nu există în această formă.'],
    ['network point-to-point area 0', false, 'Comanda network se scrie în router ospf și folosește wildcard mask.'],
    ['ip ospf type p2p', false, 'Nu există o astfel de comandă în IOS.'],
  ], 'ip ospf network point-to-point, pe interfață.'),
  single({ id: '3.4-016' }, '3.4.b', 3, 'Pe R1 ai setat ip ospf network point-to-point pe Gi0/1, dar pe R2 nu. Ce trebuie să știi?', [
    ['Ambele capete trebuie configurate la fel: tipul de rețea diferit poate produce DR/BDR și rute neașteptate', true, 'Tipul de rețea trebuie consecvent pe segmentul comun; verifici cu show ip ospf interface.'],
    ['Nu se întâmplă nimic: tipul de rețea nu contează', false, 'Tipul de rețea schimbă comportamentul (DR/BDR, rutele); contează.'],
    ['R1 devine automat DR pe segment', false, 'Setarea point-to-point nu alege DR; pe p2p nu există DR.'],
    ['Adiacența este imposibilă în toate cazurile', false, 'Adiacența poate forma, dar comportamentul diferă; de aceea se verifică ambele capete.'],
  ], 'Consistență pe ambele capete.'),
  multi({ id: '3.4-017' }, '3.4.b', 2, 'Care afirmații despre tipul point-to-point sunt adevărate? (alege toate corecte)', [
    ['Nu există alegere DR/BDR, deci nici întârzierea ei', true, 'Adiacența se stabilește direct între cele două routere.'],
    ['Pe un link are un singur vecin, deci o singură adiacență', true, 'Un singur vecin pe segment, deci și o singură adiacență.'],
    ['Hello-urile merg la 224.0.0.6', false, 'Pe point-to-point Hello-urile merg la 224.0.0.5 (AllSPFRouters).'],
    ['Costul este întotdeauna 1', false, 'Costul rămâne calculat din referință/viteză, ca la orice interfață.'],
  ], 'Point-to-point: fără DR, un vecin, Hello la 224.0.0.5.'),
  { id: '3.4-018', topicId: T, sub: '3.4.b', type: 'cli', difficulty: 2,
    stem: 'Ești în R1(config-if)#, pe interfața Gi0/1. Setează OSPF să trateze această interfață ca point-to-point.',
    prompt: 'R1(config-if)#', canonical: 'ip ospf network point-to-point', answers: ['ip ospf network point-to-point'], hint: 'ip ospf network …',
    wrong: [
      { text: 'ospf network point-to-point', why: 'Lipsește prefixul ip; comanda nu e validă pe interfață.' },
      { text: 'network point-to-point area 0', why: 'Comanda network se scrie în router ospf, nu pe interfață.' },
      { text: 'ip ospf point-to-point', why: 'Nu există un astfel de cuvânt cheie după ip ospf.' },
    ],
    explanation: 'Pe interfață: ip ospf network point-to-point (și la celălalt capăt).' },

  // ======================= 3.4.c — Broadcast (DR/BDR) =======================
  single({ id: '3.4-019' }, '3.4.c', 1, 'Cum se alege DR-ul pe un segment broadcast?', [
    ['Cea mai mare prioritate OSPF câștigă; la egalitate, cel mai mare Router ID', true, 'Prioritatea se compară prima, apoi RID-ul.'],
    ['Cel mai mic Router ID', false, 'Se alege cel mai mare RID, nu cel mai mic.'],
    ['Cel mai mare cost pe interfață', false, 'Costul nu participă la alegerea DR.'],
    ['Cea mai mică adresă MAC', false, 'OSPF nu folosește adresele MAC pentru alegerea DR.'],
  ], 'Priority, apoi RID.'),
  single({ id: '3.4-020' }, '3.4.c', 2, 'Un router are ip ospf priority 0. Ce face OSPF cu el la alegerea DR?', [
    ['Nu candidează niciodată la DR sau BDR, deși formează adiacență cu ei', true, 'Priority 0 exclude routerul din alegere, dar nu îl scoate din adiacențe.'],
    ['Devine DR dacă are cel mai mare RID', false, 'Priority 0 înseamnă că nu candidează, indiferent de RID.'],
    ['Devine automat BDR', false, 'Priority 0 exclude și BDR.'],
    ['Nu mai formează nicio adiacență', false, 'Routerul rămâne vecin cu DR și BDR, în starea Full.'],
  ], 'Priority 0 = never DR/BDR.'),
  single({ id: '3.4-021' }, '3.4.c', 2, 'Doi DROTHER-i sunt pe același segment broadcast. În ce stare se află relația dintre ei?', [
    ['2-WAY (normal)', true, 'DROTHER-ii nu formează adiacență completă între ei; 2-WAY este starea finală corectă.'],
    ['Full', false, 'Full apare doar între DROTHER și DR sau BDR.'],
    ['Down', false, 'Down înseamnă că nu se mai aud Hello-uri; aici se aud.'],
    ['ExStart blocat', false, 'ExStart blocat indică MTU diferit, nu o relație normală între DROTHER-i.'],
  ], '2-WAY între DROTHER-i este normal.'),
  single({ id: '3.4-022' }, '3.4.c', 2, 'Către ce adresă multicast trimit DROTHER-ii LSU-urile, ca să ajungă doar la DR și BDR?', [
    ['224.0.0.6 (AllDRouters)', true, 'Doar DR și BDR ascultă pe această adresă; reduce traficul pe segment.'],
    ['224.0.0.5 (AllSPFRouters)', false, 'Ajunge la toate routerele, nu doar la DR și BDR.'],
    ['224.0.0.9', false, 'Aceasta este RIPv2.'],
    ['224.0.0.10', false, 'Aceasta este EIGRP.'],
  ], '224.0.0.6 = AllDRouters.'),
  single({ id: '3.4-023' }, '3.4.c', 3, 'Ai configurat ip ospf priority 255 pe R1 într-o rețea care rulează deja, iar DR-ul este R4. Ce se întâmplă?', [
    ['Nimic până la un reset al procesului sau un flap de interfață: alegerea DR nu este preemptivă', true, 'DR-ul ales rămâne, chiar dacă apare un candidat cu prioritate mai mare.'],
    ['R1 devine imediat DR', false, 'Alegerea nu este preemptivă; R1 devine DR abia după un reset.'],
    ['Prioritatea 255 este invalidă', false, '255 este valoarea maximă permisă (interval 0–255).'],
    ['R1 trebuie să aibă și loopback', false, 'Loopback-ul influențează RID-ul, nu prioritatea DR.'],
  ], 'Non-preemptiv: clear ip ospf process pentru o nouă alegere.'),
  single({ id: '3.4-024' }, '3.4.c', 2, 'DR-ul de pe un segment cade. Ce se întâmplă?', [
    ['BDR-ul devine DR, iar se alege un nou BDR dintre DROTHER-i', true, 'Rezerva preia rolul imediat; apoi se completează rezerva.'],
    ['Segmentul rămâne fără DR până la reload', false, 'Rezerva preia rolul automat.'],
    ['Toate routerele devin DR', false, 'Un singur DR există pe segment.'],
    ['Routerul cu RID cel mai mic devine DR', false, 'Se alege după prioritate și apoi RID-ul cel mai mare, nu cel mai mic.'],
  ], 'BDR ⇒ DR, apoi nou BDR.'),
  single({ id: '3.4-025' }, '3.4.c', 1, 'Pe un segment broadcast, cu cine formează un DROTHER adiacență completă (Full)?', [
    ['Cu DR și cu BDR', true, 'Acesta este modelul DR/BDR: DROTHER-ii vorbesc complet doar cu cei doi.'],
    ['Cu toți ceilalți routerele din segment', false, 'Dacă ar fi așa, numărul de adiacențe ar crește pătratic.'],
    ['Cu niciunul', false, 'Ar rămâne fără rute prin segment.'],
    ['Doar cu routerul cu cel mai mic cost', false, 'Costul nu influențează adiacența completă.'],
  ], 'DROTHER ⇒ Full cu DR și BDR.'),
  multi({ id: '3.4-026' }, '3.4.c', 2, 'Care afirmații despre DR și BDR sunt adevărate? (alege toate corecte)', [
    ['Alegerea se face după prioritate și apoi după Router ID', true, 'Ordinea criteriilor este prioritatea, apoi RID-ul.'],
    ['Pe point-to-point nu există DR', true, 'Un link cu doi vecini nu are nevoie de coordonator.'],
    ['DR-ul reduce numărul de adiacențe complete pe segment', true, 'Fiecare DROTHER formează Full doar cu DR și BDR.'],
    ['DR-ul se schimbă automat când apare un router cu prioritate mai mare', false, 'Alegerea este non-preemptivă.'],
  ], 'Priority → RID; non-preemptiv; DR reduce adiacențele.'),
  match({ id: '3.4-027' }, '3.4.c', 2, 'Potrivește rezultatul din show ip ospf neighbor cu semnificația lui.', [
    { left: 'FULL/DR', right: 'Vecinul este DR pe segment și adiacența e completă', why: 'Starea este Full, iar rolul vecinului este DR.' },
    { left: 'FULL/BDR', right: 'Vecinul este BDR pe segment și adiacența e completă', why: 'Starea este Full, iar rolul vecinului este BDR.' },
    { left: '2WAY/DROTHER', right: 'Vecin DROTHER: relație normală, fără adiacență completă', why: 'Între doi DROTHER-i starea rămâne 2-WAY.' },
    { left: 'FULL/ -', right: 'Vecin pe un link point-to-point, fără rol DR/BDR', why: 'Pe point-to-point nu există DR sau BDR, deci rolul apare ca liniuță.' },
  ], [{ text: 'Down/DR', why: 'Un vecin Down nu mai apare cu rol DR; nu sunt compatibile.' }], 'Starea și rolul se citesc împreună.'),
  { id: '3.4-028', topicId: T, sub: '3.4.c', type: 'order', difficulty: 2,
    stem: 'Ordonează ce se întâmplă când un router nou pornește OSPF pe un segment Ethernet cu DR și BDR deja alese.',
    items: [
      { text: 'Trimite Hello la 224.0.0.5 și află vecinii (Init)', why: 'Primul pas: descoperă cine e pe segment.' },
      { text: 'Vede propriul RID în Hello-ul vecinului (2-WAY)', why: 'Stabilește comunicarea bidirecțională.' },
      { text: 'Participă la alegerea DR și BDR, dacă e nevoie', why: 'Pe un segment cu DR existent, rolul se respectă; nu se preemptează.' },
      { text: 'Formează adiacență completă cu DR și BDR (ExStart → Full)', why: 'Sincronizează LSDB-ul cu cei doi; cu DROTHER-ii rămâne în 2-WAY.' },
    ],
    explanation: 'Init → 2-WAY (alegerea DR/BDR) → adiacență completă cu DR și BDR.' },

  // ======================= 3.4.d — Router ID =======================
  single({ id: '3.4-029' }, '3.4.d', 1, 'Ce este Router ID-ul (RID) în OSPF?', [
    ['Un identificator unic de 32 de biți, scris ca o adresă IP, pentru fiecare router', true, 'RID identifică routerul în OSPF; nu trebuie să fie o adresă reală folosită în rețea.'],
    ['Adresa MAC a primei interfețe', false, 'OSPF nu folosește MAC-urile pentru identificare.'],
    ['Numărul procesului din router ospf 1', false, 'Acela este process ID, și e local routerului.'],
    ['Costul interfeței principale', false, 'Costul are altă semnificație.'],
  ], 'RID = identificator unic, format IP.'),
  single({ id: '3.4-030' }, '3.4.d', 2, 'Nu ai configurat router-id. Ce RID folosește OSPF?', [
    ['Cel mai mare IP de pe o interfață loopback up/up; altfel cel mai mare IP de pe o interfață fizică up/up', true, 'Ordinea implicită: loopback, apoi interfață fizică.'],
    ['Cel mai mic IP de pe o interfață fizică', false, 'Se alege cel mai mare IP, nu cel mai mic.'],
    ['Adresa MAC a routerului', false, 'OSPF nu folosește MAC-ul.'],
    ['Un număr aleatoriu, schimbat la fiecare reload', false, 'RID-ul este determinist, din configurație și starea interfețelor.'],
  ], 'Loopback, apoi interfață fizică, cel mai mare IP.'),
  single({ id: '3.4-031' }, '3.4.d', 2, 'Ai schimbat router-id, dar show ip ospf încă arată vechiul RID. Ce lipsește?', [
    ['clear ip ospf process (sau reload), ca noul RID să fie aplicat', true, 'Procesul OSPF trebuie resetat pentru ca noul RID să fie folosit.'],
    ['copy running-config startup-config', false, 'Salvează configurația, dar nu aplică RID-ul procesului care rulează.'],
    ['ip ospf router-id în interfață', false, 'Nu este o comandă validă în forma aceasta.'],
    ['Nimic: RID-ul se schimbă instant', false, 'Schimbarea nu se aplică instant pe un proces care rulează.'],
  ], 'Schimbarea RID cere reset al procesului.'),
  single({ id: '3.4-032' }, '3.4.d', 2, 'De ce se recomandă un loopback pentru Router ID?', [
    ['Loopback-ul este mereu up/up și nu depinde de un link fizic, deci RID-ul rămâne stabil', true, 'Un RID care depinde de o interfață fizică se poate schimba când cade acel link.'],
    ['Loopback-ul are cost 0, deci RID-ul e mai mic', false, 'Costul nu influențează RID-ul.'],
    ['Loopback-ul e obligatoriu în OSPF', false, 'Nu este obligatoriu, doar recomandat.'],
    ['Loopback-ul ocolește DR/BDR', false, 'DR/BDR depind de prioritate și RID, nu de faptul că există loopback.'],
  ], 'Loopback = stabil.'),
  { id: '3.4-033', topicId: T, sub: '3.4.d', type: 'cli', difficulty: 2,
    stem: 'Ești în R1(config-router)#, în procesul OSPF 1. Setează manual Router ID-ul 1.1.1.1.',
    prompt: 'R1(config-router)#', canonical: 'router-id 1.1.1.1', answers: ['router-id 1.1.1.1'], hint: 'router-id <adresă>',
    wrong: [
      { text: 'ospf router-id 1.1.1.1', why: 'Comanda nu se scrie cu prefixul ospf.' },
      { text: 'ip ospf router-id 1.1.1.1', why: 'Este un prefix de interfață, nu de router ospf.' },
      { text: 'router-id 1.1.1.1 area 0', why: 'RID-ul nu are area; acel cuvânt nu aparține comenzii.' },
    ],
    explanation: 'În router ospf: router-id 1.1.1.1.' },
  match({ id: '3.4-034' }, '3.4.d', 2, 'Potrivește comanda din configurația OSPF cu efectul ei.', [
    { left: 'router ospf 1', right: 'Pornește procesul OSPF 1 pe router', why: 'Intră în modul de configurare OSPF.' },
    { left: 'network 10.0.0.0 0.0.0.255 area 0', right: 'Activează OSPF pe interfețele cu IP în 10.0.0.0/24, area 0', why: 'Wildcard-ul definește domeniul de adrese, iar area-ul zona.' },
    { left: 'passive-interface gi0/1', right: 'Nu trimite Hello-uri pe Gi0/1, dar anunță rețeaua ei', why: 'Interfața rămâne în OSPF, fără vecini pe ea.' },
    { left: 'auto-cost reference-bandwidth 1000', right: 'Schimbă referința de calcul a costului la 1000 Mbps', why: 'Costul devine referință / viteză, cu minim 1.' },
  ], [{ text: 'ip route 0.0.0.0 0.0.0.0 10.0.0.1', why: 'Este o rută statică, nu o comandă OSPF.' }], 'Fiecare comandă OSPF are un efect precis.'),

  // ======================= Configurare (mix) =======================
  single({ id: '3.4-035' }, '3.4', 2, 'Ce face comanda network 10.0.0.0 0.0.0.255 area 0 în router ospf?', [
    ['Activează OSPF pe interfețele al căror IP se află în 10.0.0.0/24 și le pune în area 0', true, 'Wildcard-ul 0.0.0.255 înseamnă că ultimii 8 biți contează.'],
    ['Anunță toată rețeaua 10.0.0.0/8', false, 'Masca wildcard nu are sensul unei măști /8.'],
    ['Creează adiacențe cu toți vecinii din 10.0.0.0/24', false, 'Adiacențele apar după Hello; comanda doar activează interfețele.'],
    ['Setează masca /24 pe toate interfețele', false, 'Comanda nu schimbă masca interfețelor.'],
  ], 'Wildcard + area.'),
  single({ id: '3.4-036' }, '3.4', 3, 'Care este wildcard mask-ul pentru subrețeaua 10.0.0.0/30?', [
    ['0.0.0.3', true, 'Inversul măștii 255.255.255.252: biții de gazdă devin 1.'],
    ['255.255.255.252', false, 'Aceasta este masca de subrețea, nu wildcard.'],
    ['0.0.0.252', false, 'Nu este inversul măștii /30.'],
    ['255.255.255.3', false, 'Nu corespunde niciunei măști valide.'],
  ], 'Wildcard = inversul măștii.'),
  single({ id: '3.4-037' }, '3.4', 2, 'Ce face passive-interface Gi0/1 în OSPF?', [
    ['Oprește Hello-urile pe Gi0/1, dar rețeaua acelei interfețe rămâne anunțată', true, 'Potrivit pentru LAN-uri cu PC-uri, unde nu vrei vecini.'],
    ['Dezactivează complet OSPF pe Gi0/1, inclusiv rețeaua', false, 'Rețeaua rămâne în OSPF; doar Hello-urile se opresc.'],
    ['Setează costul interfeței la 0', false, 'Costul nu se schimbă prin pasivitate.'],
    ['Oprește fizic interfața', false, 'Interfața rămâne up; se schimbă doar comportamentul OSPF.'],
  ], 'Passive = fără Hello, dar rețea anunțată.'),
  single({ id: '3.4-038' }, '3.4', 2, 'Care este costul OSPF implicit al unei interfețe GigabitEthernet?', [
    ['1', true, '100 Mbps / 1000 Mbps = 0,1, rotunjit la minimum 1.'],
    ['10', false, 'Acela ar fi costul la o referință de 1000 Mbps, dar implicit referința e 100.'],
    ['100', false, 'Costul ar fi 100 doar dacă interfața ar avea 1 Mbps.'],
    ['0', false, 'Costul minim este 1, nu 0.'],
  ], 'Referință 100 Mbps; Gi = 1 implicit.'),
  { id: '3.4-039', topicId: T, sub: '3.4', type: 'cli', difficulty: 2,
    stem: 'Ești în R1(config-router)#. Setează referința de calcul a costului la 1000 Mbps.',
    prompt: 'R1(config-router)#', canonical: 'auto-cost reference-bandwidth 1000', answers: ['auto-cost reference-bandwidth 1000'], hint: 'auto-cost reference-bandwidth <Mbps>',
    wrong: [
      { text: 'bandwidth 1000', why: 'Comanda bandwidth setează viteza interfeței, nu referința OSPF.' },
      { text: 'ip ospf cost 1000', why: 'Se scrie pe interfață, nu în router ospf, și setează costul direct.' },
      { text: 'auto-cost 1000', why: 'Lipsește cuvântul reference-bandwidth.' },
    ],
    explanation: 'auto-cost reference-bandwidth 1000, aplicat pe toate routerele.' },
  { id: '3.4-040', topicId: T, sub: '3.4', type: 'cli', difficulty: 3,
    stem: 'Ești în R1(config-if)#, pe Gi0/1. Setează costul OSPF al interfeței la 10.',
    prompt: 'R1(config-if)#', canonical: 'ip ospf cost 10', answers: ['ip ospf cost 10'], hint: 'ip ospf cost <1–65535>',
    wrong: [
      { text: 'ospf cost 10', why: 'Lipsește prefixul ip.' },
      { text: 'bandwidth 10', why: 'Schimbă viteza raportată, nu costul OSPF direct.' },
      { text: 'cost 10', why: 'Nu există comanda cost fără prefixele ip ospf.' },
    ],
    explanation: 'ip ospf cost 10 are prioritate față de calculul din referință.' },
];
