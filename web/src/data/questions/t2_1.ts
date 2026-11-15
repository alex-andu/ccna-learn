import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.1 Configure and verify VLANs (normal range) spanning multiple switches
// (a. Access ports data/voice · b. Default VLAN · c. InterVLAN connectivity). Fiecare variantă are explicație (why).
const T = '2.1';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_1: Question[] = [
  // ======================= 2.1 imaginea de ansamblu =======================
  single({ id: '2.1-001' }, '2.1', 1, 'Ce este un VLAN?', [
    ['Un domeniu de broadcast logic, separat, creat pe unul sau mai multe switch-uri', true, 'Fiecare VLAN este propriul domeniu de broadcast, de regulă cu propria subrețea IP; porturile sunt grupate logic, nu fizic.'],
    ['Un cablu virtual între două routere', false, 'VLAN-ul nu este un cablu și nu leagă routere; separă porturi de switch în rețele logice.'],
    ['O adresă IP rezervată pentru management', false, 'Adresa de management a unui switch este un SVI, nu VLAN-ul în sine.'],
    ['Un protocol care alege switch-ul root', false, 'Alegerea root bridge-ului ține de Spanning Tree, nu de VLAN-uri.'],
  ], 'VLAN = domeniu de broadcast logic; de regulă un VLAN corespunde unei subrețele IP.'),
  single({ id: '2.1-002' }, '2.1', 1, 'PC1 este în VLAN 10 și PC2 în VLAN 20, ambele pe același switch. Ce este necesar pentru ca ele să comunice?', [
    ['Un dispozitiv de nivel 3 (router sau switch L3) care rutează între VLAN-uri', true, 'Fiecare VLAN este o subrețea diferită; traficul între subrețele necesită rutare.'],
    ['Nimic: un switch comută oricum între toate porturile', false, 'Switch-ul comută doar în interiorul unui VLAN; separarea VLAN-urilor este tocmai scopul lor.'],
    ['Un al doilea switch conectat prin Ethernet', false, 'Încă un switch L2 nu rutează; VLAN-urile ar rămâne separate.'],
    ['Activarea CDP pe ambele porturi', false, 'CDP descoperă vecini; nu transferă trafic între VLAN-uri.'],
  ], 'Între VLAN-uri e nevoie de un dispozitiv L3: router-on-a-stick sau switch multilayer cu SVI.'),
  single({ id: '2.1-003' }, '2.1', 2, 'Care interval reprezintă VLAN-urile „normal range” la obiectivul 2.1?', [
    ['1–1005 (cu 1 și 1002–1005 speciale)', true, 'Normal range este 1–1005; 1 este default VLAN, iar 1002–1005 sunt rezervate legacy.'],
    ['1006–4094', false, 'Acesta este extended range, în afara scopului obiectivului 2.1.'],
    ['0–4095', false, '0 și 4095 sunt rezervate și nu se pot folosi pentru trafic obișnuit.'],
    ['100–999', false, 'Nu este un interval definit; VLAN-uri folosibile există și sub 100 (de exemplu 10, 20).'],
  ], 'Normal range = 1–1005; extended = 1006–4094; 0 și 4095 rezervate.'),
  multi({ id: '2.1-004' }, '2.1', 2, 'Care sunt avantaje reale ale folosirii VLAN-urilor? (alege trei)', [
    ['Domenii de broadcast mai mici', true, 'Un broadcast rămâne în VLAN-ul lui, deci mai puțin zgomot pe rețea.'],
    ['Grupare logică independentă de poziția fizică a cablului', true, 'Un utilizator poate fi mutat în alt VLAN schimbând doar configurația portului.'],
    ['Izolare și securitate între grupuri (HR, vizitatori, servere)', true, 'Traficul între VLAN-uri trece printr-un punct de control L3 unde se pot aplica reguli.'],
    ['Fiecare VLAN dublează viteza fizică a cablului', false, 'VLAN-urile nu măresc viteza legăturii; cel mult o partajează pe trunk.'],
    ['Nu mai este nevoie de adrese IP', false, 'Hosturile au în continuare adrese IP, câte o subrețea per VLAN.'],
  ], 'VLAN-urile reduc broadcast-ul, grupează logic și izolează; nu schimbă viteza și nu elimină IP-ul.'),
  single({ id: '2.1-005' }, '2.1', 2, 'Ai rulat „write erase” și „reload” pe un switch Catalyst. Ce se întâmplă de regulă cu VLAN-urile din normal range?', [
    ['Rămân, deoarece sunt păstrate în vlan.dat din flash', true, 'Normal range se salvează în vlan.dat; trebuie șters separat fișierul pentru a elimina VLAN-urile (verifică pe platforma ta).'],
    ['Dispar toate, ca restul configurației', false, 'Nu: startup-config nu conține VLAN-urile din normal range pe aceste platforme.'],
    ['Se mută automat în VLAN 1', false, 'VLAN-urile nu se „mută”; ele fie există, fie nu.'],
    ['Se salvează doar dacă ai pornit VTP server', false, 'Salvarea în vlan.dat nu depinde de VTP server pentru VLAN-urile locale.'],
  ], 'VLAN-urile normale sunt în vlan.dat, separat de startup-config.'),
  single({ id: '2.1-006' }, '2.1', 3, 'Care dintre următoarele VLAN-uri nu poate fi șters?', [
    ['VLAN 1 (default) și VLAN-urile 1002–1005', true, 'Sunt predefinite; VLAN 1 și 1002–1005 nu se pot șterge.'],
    ['VLAN 10, dacă are porturi atribuite', false, 'Un VLAN creat de tine se poate șterge oricând, chiar cu porturi atribuite; ele devin inactive.'],
    ['Orice VLAN cu nume', false, 'Numele nu protejează un VLAN de ștergere.'],
    ['VLAN 99, dacă este VLAN de management', false, 'Poate fi șters, cu pierderea managementului asociat.'],
  ], 'Doar VLAN-urile predefinite (1 și 1002–1005) nu pot fi șterse.'),

  // ======================= 2.1.a Access ports (data and voice) =======================
  single({ id: '2.1-007' }, '2.1.a', 1, 'Care comandă atribuie interfața curentă VLAN-ului 20 ca port access?', [
    ['switchport access vlan 20', true, 'Atribuie portul access VLAN-ului 20 (VLAN-ul trebuie să existe).'],
    ['vlan 20 access', false, 'Nu este o comandă validă de interfață; „vlan 20” se dă în config global.'],
    ['switchport trunk allowed vlan 20', false, 'Aceasta este pentru trunk și limitează VLAN-urile permise.'],
    ['switchport voice vlan 20', false, 'Aceasta setează VLAN-ul de voce, nu cel de date.'],
  ], 'switchport access vlan N atribuie VLAN-ul de date al portului.'),
  single({ id: '2.1-008' }, '2.1.a', 2, 'Un port trunk între două switch-uri nu apare în ieșirea comenzii show vlan brief. De ce?', [
    ['Pentru că show vlan brief listează doar porturile access; un trunk nu aparține unui singur VLAN', true, 'Trunk-ul transportă mai multe VLAN-uri; verifici cu show interfaces trunk.'],
    ['Pentru că portul este în shutdown', false, 'Un trunk activ lipsește oricum din listă; shutdown nu e cauza.'],
    ['Pentru că trunk-urile sunt întotdeauna în VLAN 1', false, 'Un trunk nu este „în” VLAN 1; poartă VLAN 1 doar ca VLAN permis/nativ.'],
    ['Pentru că show vlan brief afișează doar VLAN-urile fără nume', false, 'Comanda afișează toate VLAN-urile, cu nume și porturi access.'],
  ], 'show vlan brief = VLAN-uri + porturi access; trunk-urile se văd cu show interfaces trunk.'),
  single({ id: '2.1-009' }, '2.1.a', 2, 'Porturile Fa0/3 și Fa0/4 sunt atribuite VLAN-ului 20. Administratorul rulează „no vlan 20”. Ce se întâmplă cu porturile?', [
    ['Rămân atribuite VLAN-ului 20 și devin inactive', true, 'Configurația portului nu se schimbă; fără VLAN, portul nu poate comuta cadre. Recrearea VLAN-ului îl reactivează.'],
    ['Sunt mutate automat în VLAN 1', false, 'IOS nu mută porturile în VLAN 1 la ștergerea unui VLAN.'],
    ['Devin trunk', false, 'Modul portului nu se schimbă la ștergerea unui VLAN.'],
    ['Se șterge și configurația lor din running-config', false, 'Liniile switchport access vlan 20 rămân în configurație.'],
  ], 'Ștergerea unui VLAN lasă porturile orfane și inactive.'),
  single({ id: '2.1-010' }, '2.1.a', 2, 'Cum trimite un PC obișnuit cadrele către un port access?', [
    ['Fără tag 802.1Q; PC-ul nu știe că există VLAN-uri', true, 'Etichetarea o face switch-ul pe trunk; pe port access cadrul este netaggat.'],
    ['Cu tag 802.1Q având VID-ul portului', false, 'Un PC obișnuit nu etichetează cadrele; doar anumite dispozitive (telefon IP, server cu NIC configurat) o fac.'],
    ['Cu tag ISL', false, 'ISL este învechit și nu e folosit de PC-uri.'],
    ['Doar cu antet IP, fără antet Ethernet', false, 'Orice cadru pe Ethernet are antet Ethernet.'],
  ], 'Pe port access cadrele sunt fără tag; VLAN-ul îl determină portul.'),
  { id: '2.1-011', topicId: T, sub: '2.1.a', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare comandă cu rolul ei.',
    leftLabel: 'Comandă', rightLabel: 'Rol',
    pairs: [
      { left: 'vlan 10', right: 'Creează VLAN-ul 10 în baza de date', why: 'Comandă din configurare globală; intră în config-vlan.' },
      { left: 'switchport mode access', right: 'Forțează portul în modul access', why: 'Evită negocierea unui trunk prin DTP.' },
      { left: 'switchport voice vlan 40', right: 'Asociază portului VLAN-ul de voce', why: 'Se aplică pe un port access cu telefon IP.' },
      { left: 'show vlan brief', right: 'Listează VLAN-urile și porturile access', why: 'Porturile trunk nu apar în listă.' },
    ],
    distractors: [{ text: 'Activează rutarea între VLAN-uri', why: 'Rutarea se activează cu ip routing pe un switch L3, nu cu comenzile din listă.' }],
    explanation: 'Creezi VLAN-ul, setezi portul access, atribui VLAN-ul și verifici.' },
  single({ id: '2.1-012' }, '2.1.a', 2, 'Un port access are „switchport access vlan 10” și „switchport voice vlan 20”. Ce trafic circulă cu tag 802.1Q pe segmentul switch–telefon?', [
    ['Traficul de voce al telefonului (VLAN 20)', true, 'Telefonul își etichetează vocea; traficul PC-ului care trece prin telefon rămâne fără tag.'],
    ['Traficul PC-ului (VLAN 10)', false, 'Datele PC-ului sunt netaggate și intră în VLAN-ul de date al portului.'],
    ['Niciun trafic: portul access nu folosește niciodată tag', false, 'Excepția este tocmai voice VLAN: vocea telefonului este etichetată.'],
    ['Ambele, cu același VID', false, 'Cele două VLAN-uri sunt diferite și au tratamente diferite: voce cu tag, date fără.'],
  ], 'Voce = cu tag (VID 20); date = fără tag în VLAN-ul de date.'),
  multi({ id: '2.1-013' }, '2.1.a', 2, 'Care afirmații despre voice VLAN sunt adevărate? (alege trei)', [
    ['Se configurează pe un port care este deja access', true, 'Comanda switchport voice vlan se dă pe un port configurat ca access.'],
    ['Telefonul află VLAN-ul de voce prin CDP sau LLDP-MED', true, 'Switch-ul îl anunță pe acest canal de descoperire.'],
    ['Permite ca telefonul și PC-ul să împartă un singur cablu, în rețele separate', true, 'Vocea și datele sunt în VLAN-uri diferite.'],
    ['Face portul un al doilea VLAN de date', false, 'Voice VLAN este dedicat voce; datele rămân în access vlan.'],
    ['Cere obligatoriu ca portul să fie trunk', false, 'Portul rămâne access (mod administrativ).'],
  ], 'Voice VLAN: port access, anunțat prin CDP/LLDP-MED, separare voce/date pe același cablu.'),
  single({ id: '2.1-014' }, '2.1.a', 2, 'Cum află un telefon IP Cisco în ce VLAN trebuie să-și trimită traficul de voce?', [
    ['Switch-ul îl anunță prin CDP (sau LLDP-MED)', true, 'Protocolul de descoperire transportă VLAN-ul de voce către telefon.'],
    ['Printr-un server DNS', false, 'DNS rezolvă nume, nu comunică VLAN-ul de voce.'],
    ['Telefonul îl află din adresa MAC a switch-ului', false, 'MAC-ul nu conține informație despre VLAN.'],
    ['Administratorul îl introduce întotdeauna manual, fără alternativă', false, 'Se poate configura manual, dar mecanismul standard este anunțul prin CDP/LLDP-MED.'],
  ], 'Voice VLAN este comunicat prin CDP / LLDP-MED.'),
  single({ id: '2.1-015' }, '2.1.a', 3, 'Un port are switchport mode access, access vlan 10 și voice vlan 40. Ce linii vei vedea în show interfaces fa0/3 switchport?', [
    ['Access Mode VLAN: 10 și Voice VLAN: 40', true, 'Cele două VLAN-uri apar separat în ieșire.'],
    ['Access Mode VLAN: 40 și Voice VLAN: 10', false, 'Valorile sunt inversate față de configurare.'],
    ['Operational Mode: trunk și Native VLAN: 40', false, 'Portul rămâne access; voice VLAN nu schimbă modul în trunk.'],
    ['Doar Voice VLAN: 40; Access Mode VLAN dispare', false, 'Access Mode VLAN rămâne 10.'],
  ], 'Access Mode VLAN = date; Voice VLAN = voce.'),

  // ======================= 2.1.b Default VLAN =======================
  single({ id: '2.1-016' }, '2.1.b', 1, 'Ce număr are default VLAN-ul și poate fi șters?', [
    ['VLAN 1; nu poate fi șters', true, 'VLAN 1 este predefinit, nu se șterge și nu se redenumește.'],
    ['VLAN 0; se poate șterge', false, 'VLAN 0 este rezervat.'],
    ['VLAN 1; se șterge cu no vlan 1', false, 'IOS refuză ștergerea VLAN 1.'],
    ['VLAN 100; nu poate fi șters', false, 'VLAN 100 nu este default VLAN.'],
  ], 'Default VLAN = 1; nu se șterge.'),
  single({ id: '2.1-017' }, '2.1.b', 2, 'Un switch Cisco nou, neconfigurat, este conectat la patru PC-uri. În ce VLAN sunt porturile?', [
    ['În VLAN 1 (default)', true, 'Toate porturile access sunt atribuite VLAN 1 din fabrică.'],
    ['Fiecare port în propriul VLAN, numerotate după port', false, 'Nu există atribuire automată pe VLAN-uri separate.'],
    ['Niciun port nu e în vreun VLAN până nu configurezi', false, 'Porturile sunt deja în VLAN 1.'],
    ['În VLAN 1005', false, '1005 este rezervat (legacy), nu e VLAN-ul implicit.'],
  ], 'Din fabrică, toate porturile sunt în VLAN 1.'),
  single({ id: '2.1-018' }, '2.1.b', 2, 'Care este practica recomandată pentru porturile nefolosite ale unui switch?', [
    ['Le muți într-un VLAN neutilizat (fără SVI) și le pui în shutdown', true, 'Dublă protecție: chiar dacă cineva le reactivează, ajunge într-un VLAN izolat.'],
    ['Le lași în VLAN 1, pregătite pentru viitor', false, 'Un port liber în VLAN 1 este o ușă deschisă în rețeaua implicită.'],
    ['Le pui trunk, ca să fie flexibile', false, 'Un trunk liber este și mai riscant.'],
    ['Le ștergi din configurație', false, 'Porturile fizice nu se șterg; se configurează.'],
  ], 'Porturi nefolosite: VLAN de parcare + shutdown.'),
  multi({ id: '2.1-019' }, '2.1.b', 2, 'De ce este recomandat să NU folosești VLAN 1 pentru utilizatori sau management? (alege trei)', [
    ['Domeniu de broadcast mare, în care ajung și porturile uitate', true, 'Orice port rămas în VLAN 1 se adaugă la același domeniu.'],
    ['Managementul switch-ului ar fi în aceeași rețea cu utilizatorii', true, 'Un port neprotejat dă acces la rețeaua de administrare.'],
    ['VLAN 1 este VLAN nativ implicit și transportă trafic de control, amestecat cu datele', true, 'Amestecul crește riscurile (de exemplu VLAN hopping, 2.2).'],
    ['VLAN 1 nu suportă adrese IP', false, 'VLAN 1 poate avea SVI cu adresă IP.'],
    ['VLAN 1 este mai lent', false, 'Viteza nu depinde de numărul VLAN-ului.'],
  ], 'Motivele sunt de securitate și de ordine, nu de viteză.'),
  single({ id: '2.1-020' }, '2.1.b', 3, 'Care afirmație este corectă?', [
    ['VLAN 1, VLAN-ul nativ și VLAN-ul de management sunt concepte diferite care pot coincide, dar nu trebuie', true, 'Pot fi configurate separat; coincidența în VLAN 1 e implicită, nu obligatorie.'],
    ['VLAN 1 este întotdeauna VLAN de management', false, 'Managementul se poate muta în orice VLAN (de exemplu 99).'],
    ['VLAN nativ trebuie să fie VLAN 1', false, 'Poate fi schimbat (2.2.c).'],
    ['VLAN de management trebuie să fie același cu VLAN nativ', false, 'Nu există o astfel de cerință.'],
  ], 'Trei concepte separate: default VLAN, native VLAN, management VLAN.'),
  { id: '2.1-021', topicId: T, sub: '2.1.b', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii pentru a „parca” porturile nefolosite Fa0/9–24.',
    items: [
      { text: 'Creezi VLAN-ul de parcare (vlan 999)', why: 'VLAN-ul trebuie să existe înainte de atribuire.' },
      { text: 'interface range fa0/9-24', why: 'Selectezi toate porturile libere.' },
      { text: 'switchport mode access', why: 'Setezi portul access, ca să nu poată negocia trunk.' },
      { text: 'switchport access vlan 999', why: 'Mută porturile în VLAN-ul izolat.' },
      { text: 'shutdown', why: 'Oprești administrativ porturile.' },
    ],
    explanation: 'VLAN → range → mode access → access vlan → shutdown.' },

  // ======================= 2.1.c InterVLAN connectivity =======================
  single({ id: '2.1-022' }, '2.1.c', 1, 'De ce nu pot comunica direct două stații din VLAN-uri diferite?', [
    ['Sunt în domenii de broadcast și, de regulă, subrețele IP diferite; au nevoie de un dispozitiv L3', true, 'Switch-ul L2 nu rutează între VLAN-uri.'],
    ['Pentru că au viteze diferite', false, 'Viteza nu are legătură cu VLAN-urile.'],
    ['Pentru că adresele MAC sunt diferite', false, 'MAC-urile diferă în orice rețea; VLAN-ul este motivul.'],
    ['Pentru că VLAN-urile nu suportă ARP', false, 'ARP funcționează în interiorul fiecărui VLAN.'],
  ], 'Fără L3, VLAN-urile rămân izolate.'),
  single({ id: '2.1-023' }, '2.1.c', 1, 'Care NU este o metodă de inter-VLAN routing?', [
    ['VTP transparent mode', true, 'VTP propagă VLAN-uri; nu rutează între ele.'],
    ['Router-on-a-stick', false, 'Este o metodă clasică, cu subinterfețe pe un trunk.'],
    ['Switch L3 cu SVI', false, 'Este metoda standard în campus.'],
    ['Un port de router per VLAN', false, 'Metodă învechită, dar validă.'],
  ], 'VTP nu face rutare.'),
  single({ id: '2.1-024' }, '2.1.c', 2, 'În router-on-a-stick, ce adresă IP are interfața fizică GigabitEthernet0/0?', [
    ['Nu are adresă; adresele sunt pe subinterfețe', true, 'Interfața fizică trebuie doar să fie pornită (no shutdown).'],
    ['Adresa gateway-ului VLAN-ului 1', false, 'VLAN 1 nu are un rol special aici.'],
    ['Toate adresele VLAN-urilor, ca secundare', false, 'Se folosesc subinterfețe, nu adrese secundare.'],
    ['O adresă APIPA 169.254.x.x', false, 'APIPA e pentru hosturi fără DHCP, nu pentru gateway-uri.'],
  ], 'Fizic: fără IP; subinterfețe: IP-urile.'),
  single({ id: '2.1-025' }, '2.1.c', 2, 'Care comandă asociază subinterfața Gi0/0.20 cu VLAN-ul 20?', [
    ['encapsulation dot1Q 20', true, 'Spune routerului să prelucreze cadrele cu tag 802.1Q VID 20 pe subinterfață.'],
    ['switchport access vlan 20', false, 'Aceasta e comandă de switch, nu de router.'],
    ['vlan 20 dot1q', false, 'Nu este o comandă validă.'],
    ['ip vlan 20', false, 'Nu există această comandă.'],
  ], 'encapsulation dot1Q <VID> pe subinterfață.'),
  single({ id: '2.1-026' }, '2.1.c', 2, 'În ce mod trebuie configurat portul switch-ului legat de routerul din router-on-a-stick?', [
    ['Trunk 802.1Q, cu VLAN-urile necesare permise', true, 'Routerul primește mai multe VLAN-uri pe același cablu, deci portul trebuie să fie trunk.'],
    ['Access în VLAN 1', false, 'Un port access transportă un singur VLAN de date.'],
    ['Shutdown', false, 'Portul trebuie să fie activ.'],
    ['Routed port', false, 'Un routed port ar elimina VLAN-urile; routerul are nevoie de trunk.'],
  ], 'Port către router în ROAS = trunk.'),
  single({ id: '2.1-027' }, '2.1.c', 2, 'Un switch L3 are SVI-uri up/up pentru VLAN 10 și 20, cu IP-uri corecte, dar hosturile din cele două VLAN-uri nu comunică. Ce lipsește cel mai probabil?', [
    ['Comanda globală ip routing', true, 'Fără ip routing, switch-ul nu rutează între SVI-uri.'],
    ['switchport mode trunk pe SVI', false, 'SVI-urile nu sunt porturi; nu au mod trunk.'],
    ['no switchport pe SVI', false, 'no switchport se aplică porturilor fizice, nu SVI-urilor.'],
    ['VTP server', false, 'VTP nu are legătură cu rutarea.'],
  ], 'ip routing e necesar pe switch-ul L3.'),
  single({ id: '2.1-028' }, '2.1.c', 2, 'interface vlan 30 este up/down pe un switch L3 pe care ai creat SVI-ul. Care este cauza probabilă?', [
    ['VLAN 30 nu există sau nu are niciun port activ (autostate)', true, 'SVI-ul este up/up doar dacă VLAN-ul există și are cel puțin un port activ.'],
    ['Lipsește default gateway-ul hosturilor', false, 'Configurația hosturilor nu afectează starea SVI-ului.'],
    ['Lipsește comanda ip routing', false, 'ip routing nu determină starea SVI-ului up/down.'],
    ['VLAN 30 este în extended range', false, '30 este în normal range.'],
  ], 'Autostate: VLAN existent + port activ.'),
  { id: '2.1-029', topicId: T, sub: '2.1.c', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare scenariu cu metoda de inter-VLAN routing cea mai potrivită.',
    leftLabel: 'Scenariu', rightLabel: 'Metodă',
    pairs: [
      { left: 'Filială mică: un router, un switch, un singur cablu liber', right: 'Router-on-a-stick', why: 'Un trunk și subinterfețe sunt suficiente.' },
      { left: 'Campus cu zeci de VLAN-uri și trafic intens', right: 'Switch L3 cu SVI', why: 'Rutare în hardware, fără cablu extern.' },
      { left: 'Rețea din anii ’90, un VLAN, un port de router', right: 'Un port de router per VLAN', why: 'Metodă istorică, un cablu pe VLAN.' },
    ],
    distractors: [{ text: 'VTP server', why: 'VTP propagă baza de date de VLAN-uri; nu rutează.' }],
    explanation: 'Alege metoda după scară și cost.' },
  single({ id: '2.1-030' }, '2.1.c', 2, 'Care trebuie să fie default gateway-ul unui host din VLAN 10 (192.168.10.0/24) cu inter-VLAN prin router-on-a-stick?', [
    ['Adresa IP a subinterfeței pentru VLAN 10 (de exemplu 192.168.10.1)', true, 'Gateway-ul trebuie să fie în aceeași subrețea, accesibil la nivel 2.'],
    ['Adresa IP a PC-ului din VLAN 20', false, 'Un PC nu este gateway; nu rutează.'],
    ['Adresa de loopback a switch-ului', false, 'Nu e în subrețeaua VLAN-ului.'],
    ['Adresa 255.255.255.255', false, 'Este adresa de broadcast, nu un gateway.'],
  ], 'Gateway = IP-ul interfeței L3 din VLAN-ul hostului.'),
  single({ id: '2.1-031' }, '2.1.c', 3, 'Care este principalul dezavantaj al router-on-a-stick?', [
    ['Traficul inter-VLAN trece de două ori pe același cablu, deci banda lui devine limita', true, 'Cadrul intră și iese pe aceeași interfață fizică.'],
    ['Nu funcționează cu mai mult de un VLAN', false, 'Tocmai pentru mai multe VLAN-uri se folosește.'],
    ['Cere un switch L3', false, 'ROAS folosește un router simplu.'],
    ['Nu suportă 802.1Q', false, 'Folosește 802.1Q.'],
  ], 'ROAS: limitat de banda unui singur link.'),
  multi({ id: '2.1-032' }, '2.1.c', 3, 'Inter-VLAN prin router-on-a-stick nu merge. Ce verifici? (alege patru)', [
    ['Interfața fizică a routerului este în no shutdown', true, 'Altfel subinterfețele sunt jos.'],
    ['Subinterfețele au encapsulation dot1Q cu VID corect', true, 'Un VID greșit duce la cadre neprelucrate.'],
    ['Portul switch-ului spre router este trunk și permite VLAN-urile', true, 'Allowed list lipsă taie un VLAN.'],
    ['Gateway-ul hosturilor corespunde IP-ului subinterfeței', true, 'Gateway greșit ⇒ ieșirea din subrețea eșuează.'],
    ['Numărul de ore de la pornirea switch-ului', false, 'Uptime-ul nu influențează rutarea.'],
  ], 'Fizic up, encapsulation, trunk permis, gateway corect.'),
  { id: '2.1-033', topicId: T, sub: '2.1.c', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii prin care PC1 (VLAN 10) ajunge la PC2 (VLAN 20) prin router-on-a-stick.',
    items: [
      { text: 'PC1 trimite cadrul către MAC-ul gateway-ului (fără tag)', why: 'Destinația e în altă subrețea.' },
      { text: 'Switch-ul adaugă tag VID 10 și îl trimite pe trunk către router', why: 'Pe trunk cadrul este etichetat.' },
      { text: 'Routerul îl primește pe Gi0/0.10 și face rutarea', why: 'Subinterfața .10 prelucrează VLAN 10.' },
      { text: 'Routerul îl trimite înapoi pe trunk cu tag VID 20', why: 'Rețeaua 192.168.20.0/24 e conectată pe Gi0/0.20.' },
      { text: 'Switch-ul scoate tag-ul și livrează cadrul la PC2', why: 'Portul access al lui PC2 e netaggat.' },
    ],
    explanation: 'Trunk traversat de două ori, de aceea „on a stick”.' },
  single({ id: '2.1-034' }, '2.1.c', 3, 'Pe un switch L3, ce face comanda „no switchport” pe un port fizic?', [
    ['Îl transformă în port routed (L3), pe care poți pune direct o adresă IP', true, 'Portul nu mai aparține unui VLAN.'],
    ['Îl pune în VLAN 1', false, 'no switchport scoate portul din modul L2.'],
    ['Îl transformă în trunk', false, 'Trunk este tot un mod switchport.'],
    ['Îl oprește (shutdown)', false, 'Starea administrativă e separată.'],
  ], 'no switchport = port L3.'),

  // ======================= CLI și scenarii mixte =======================
  { id: '2.1-035', topicId: T, sub: '2.1', type: 'cli', difficulty: 1,
    stem: 'Creează VLAN-ul 30 (din configurarea globală).',
    prompt: 'SW1(config)#', canonical: 'vlan 30', answers: ['vlan 30'], hint: 'vlan ...',
    wrong: [
      { text: 'vlan id 30', why: 'Sintaxa IOS este vlan 30, fără cuvântul id.' },
      { text: 'create vlan 30', why: 'IOS nu are comanda create vlan.' },
      { text: 'switchport access vlan 30', why: 'Atribuie un port, nu creează VLAN-ul.' },
    ],
    explanation: 'vlan 30 în configurare globală.' },
  { id: '2.1-036', topicId: T, sub: '2.1.a', type: 'cli', difficulty: 1,
    stem: 'Pe interfața curentă, atribuie portul VLAN-ului 10 (port deja în mod access).',
    prompt: 'SW1(config-if)#', canonical: 'switchport access vlan 10', answers: ['switchport access vlan 10', 'sw acc vlan 10'], hint: 'switchport ...',
    wrong: [
      { text: 'switchport vlan 10', why: 'Lipsește cuvântul access.' },
      { text: 'access vlan 10', why: 'Comanda trebuie să înceapă cu switchport.' },
      { text: 'switchport mode vlan 10', why: 'mode primește access/trunk, nu un VLAN.' },
    ],
    explanation: 'switchport access vlan N.' },
  { id: '2.1-037', topicId: T, sub: '2.1.a', type: 'cli', difficulty: 2,
    stem: 'Configurează VLAN-ul de voce 40 pe interfața curentă.',
    prompt: 'SW1(config-if)#', canonical: 'switchport voice vlan 40', answers: ['switchport voice vlan 40'], hint: 'switchport voice ...',
    wrong: [
      { text: 'switchport access vlan 40', why: 'Aceasta setează VLAN-ul de date, nu pe cel de voce.' },
      { text: 'voice vlan 40', why: 'Comanda trebuie să înceapă cu switchport.' },
      { text: 'switchport mode voice 40', why: 'Nu există mod voice.' },
    ],
    explanation: 'switchport voice vlan N.' },
  { id: '2.1-038', topicId: T, sub: '2.1.c', type: 'cli', difficulty: 2,
    stem: 'Pe subinterfața Gi0/0.30 a routerului, asociază traficul VLAN-ului 30.',
    prompt: 'R1(config-subif)#', canonical: 'encapsulation dot1Q 30', answers: ['encapsulation dot1q 30', 'encapsulation dot1Q 30'], hint: 'encapsulation ...',
    wrong: [
      { text: 'encapsulation 30', why: 'Lipsește tipul de encapsulare dot1Q.' },
      { text: 'switchport access vlan 30', why: 'Comandă de switch; un router nu o are pe subinterfețe.' },
      { text: 'dot1q 30', why: 'Comanda completă este encapsulation dot1Q 30.' },
    ],
    explanation: 'encapsulation dot1Q <VID>.' },
  single({ id: '2.1-039' }, '2.1.c', 3, 'Hostul PC2 (192.168.20.11/24) este conectat la un port atribuit VLAN-ului 10. Gateway-ul 192.168.20.1 este subinterfața .20. Ce se întâmplă?', [
    ['PC2 nu poate ajunge la gateway, pentru că portul lui e în VLAN 10, iar subinterfața .20 este în VLAN 20', true, 'VLAN-ul portului trebuie să corespundă subrețelei IP a hostului.'],
    ['Totul funcționează, VLAN-ul portului nu contează', false, 'VLAN-ul portului determină cu cine ești în același domeniu de broadcast.'],
    ['PC2 primește automat un IP din 192.168.10.0/24', false, 'IP-ul static rămâne cel configurat; fără DHCP nu se schimbă.'],
    ['Switch-ul mută portul în VLAN 20', false, 'Switch-ul nu își schimbă singur configurația.'],
  ], 'Portul în VLAN greșit ⇒ gateway inaccesibil.'),
  single({ id: '2.1-040' }, '2.1.c', 2, 'Care comandă verifică stările și adresele subinterfețelor unui router în router-on-a-stick?', [
    ['show ip interface brief', true, 'Listează fiecare interfață/subinterfață, adresa IP și starea.'],
    ['show vlan brief', false, 'Este o comandă de switch pentru VLAN-uri și porturi access.'],
    ['show interfaces trunk', false, 'Se rulează pe switch pentru trunk-uri, nu pe router.'],
    ['show mac address-table', false, 'Tabela MAC este pe switch; nu arată adresele IP ale subinterfețelor.'],
  ], 'show ip interface brief pe router; show interfaces trunk pe switch.'),
];
