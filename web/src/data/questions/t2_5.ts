import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.5 Interpret basic operations of Rapid PVST+.
// Sub-puncte oficiale: 2.5.a root port/bridge, 2.5.b porturi roluri/stări, 2.5.c PortFast, 2.5.d guards.
const T = '2.5';
const subOf = (id: string) => {
  const n = Number(id.slice(4));
  return n >= 6 && n <= 13 ? '2.5.a' : n >= 14 && n <= 21 ? '2.5.b' : n >= 22 && n <= 27 ? '2.5.c' : n >= 28 && n <= 36 ? '2.5.d' : '2.5';
};
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: subOf(id), type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: subOf(id), type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_5: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '2.5-001' }, 1, 'De ce este necesar STP într-o rețea de switch-uri cu linkuri redundante?', [
    ['Cadrele Ethernet nu au TTL, deci o buclă de nivel 2 produce broadcast storm', true, 'Cadrul circulă la nesfârșit și se multiplică; STP blochează logic căile în plus.'],
    ['Pentru a cripta traficul între switch-uri', false, 'STP nu criptează nimic.'],
    ['Pentru a atribui adrese IP porturilor', false, 'Nu are legătură cu adresarea IP.'],
    ['Pentru a crește viteza linkurilor', false, 'STP nu crește viteza; chiar blochează linkuri.'],
  ], 'STP previne buclele L2.'),
  single({ id: '2.5-002' }, 1, 'Care este relația dintre Rapid PVST+ și RSTP?', [
    ['Rapid PVST+ rulează câte o instanță RSTP (802.1w) pentru fiecare VLAN', true, 'Este implementarea Cisco per VLAN.'],
    ['Rapid PVST+ este STP 802.1D cu timere mai mici', false, 'Rapid PVST+ se bazează pe 802.1w, nu doar pe timere.'],
    ['Rapid PVST+ rulează o singură instanță pentru toate VLAN-urile', false, 'Aceea este CST (sau MST pentru grupuri).'],
    ['Rapid PVST+ este un protocol de rutare', false, 'Este un protocol de nivel 2.'],
  ], 'Rapid PVST+ = RSTP per VLAN.'),
  single({ id: '2.5-003' }, 1, 'Ce comandă activează Rapid PVST+ pe un switch Cisco?', [
    ['spanning-tree mode rapid-pvst', true, 'Sintaxa corectă.'],
    ['spanning-tree rapid enable', false, 'Nu există această comandă.'],
    ['spanning-tree mode pvst', false, 'Aceasta este varianta clasică.'],
    ['spanning-tree portfast', false, 'Este comandă de interfață pentru edge ports.'],
  ], 'spanning-tree mode rapid-pvst.'),
  single({ id: '2.5-004' }, 2, 'Ce înseamnă „Interpret” din obiectivul 2.5?', [
    ['Trebuie să poți citi un output (de exemplu show spanning-tree) și să deduci root-ul, rolurile și stările', true, 'Întrebările cer analiză a unui output sau a unei topologii.'],
    ['Doar să memorezi comenzi', false, 'Verbul cere înțelegere și citirea output-ului.'],
    ['Să implementezi MST', false, 'MST nu face parte din cerințele CCNA.'],
    ['Să configurezi VTP', false, 'VTP nu este cerut aici.'],
  ], 'Interpretarea outputului este esențială.'),
  multi({ id: '2.5-005' }, 2, 'Care sunt diferențe reale între STP 802.1D și RSTP 802.1w? (alege trei)', [
    ['RSTP converge în secunde, prin handshake proposal/agreement', true, '802.1D se bazează pe timere (30–50 s).'],
    ['RSTP are trei stări (Discarding, Learning, Forwarding)', true, 'Blocking și Listening sunt unite în Discarding.'],
    ['RSTP introduce rolurile Alternate și Backup', true, 'În 802.1D nu există.'],
    ['RSTP elimină nevoia unui root bridge', false, 'RSTP alege tot un root bridge.'],
    ['RSTP funcționează fără BPDU', false, 'RSTP folosește BPDU (la fiecare hello).'],
  ], 'Convergență rapidă, 3 stări, roluri noi.'),

  // ======================= 2.5.a =======================
  single({ id: '2.5-006' }, 1, 'Cum se alege root bridge-ul?', [
    ['Cel mai mic Bridge ID (prioritate, apoi MAC)', true, 'Prioritatea mai mică câștigă; la egalitate, MAC-ul mai mic.'],
    ['Cel mai mare Bridge ID', false, 'Invers față de regulă.'],
    ['Switch-ul cu cele mai multe porturi', false, 'Numărul de porturi nu contează.'],
    ['Switch-ul cu adresa IP cea mai mică', false, 'STP nu folosește IP.'],
  ], 'Lowest BID.'),
  single({ id: '2.5-007' }, 2, 'Care dintre valorile de prioritate este configurabilă direct pe un switch?', [
    ['24576', true, '24576 = 6 × 4096; este multiplu de 4096.'],
    ['30000', false, 'Nu este multiplu de 4096.'],
    ['32770', false, 'Nu este multiplu de 4096.'],
    ['1000', false, 'Nu este multiplu de 4096.'],
  ], 'Priorități în multipli de 4096.'),
  single({ id: '2.5-008' }, 2, 'Prioritatea configurată este 8192 pentru VLAN 20. Ce prioritate afișează show spanning-tree?', [
    ['8212', true, '8192 + 20 (extended system ID).'],
    ['8192', false, 'Se adaugă numărul VLAN-ului.'],
    ['8213', false, 'VLAN-ul este 20, nu 21.'],
    ['4116', false, 'Aceasta ar corespunde configurării 4096.'],
  ], 'Prioritate + VLAN.'),
  single({ id: '2.5-009' }, 2, 'Trei switch-uri: SW-A 32778 / 0000.AAAA, SW-B 24586 / 0000.FFFF, SW-C 24586 / 0000.1111 (același VLAN). Cine este root?', [
    ['SW-C', true, 'SW-B și SW-C au aceeași prioritate (cea mai mică); decide MAC-ul mai mic (0000.1111).'],
    ['SW-A', false, 'Are prioritatea cea mai mare, deci pierde.'],
    ['SW-B', false, 'Egal cu SW-C la prioritate, dar MAC-ul lui este mai mare.'],
    ['Niciunul, se face alegere manuală', false, 'Alegerea este automată.'],
  ], 'Prioritate, apoi MAC.'),
  single({ id: '2.5-010' }, 2, 'SW3 are Gi0/1 direct la root (1 Gbps) și Gi0/2 spre SW2, care are cost 4 spre root, tot 1 Gbps. Ce port este Root Port pe SW3?', [
    ['Gi0/1, cu cost 4', true, 'Calea directă costă 4; prin SW2 ar costa 4 + 4 = 8.'],
    ['Gi0/2, cu cost 8', false, 'Costul mai mare pierde.'],
    ['Ambele sunt Root Port', false, 'Un switch non-root are un singur Root Port.'],
    ['Niciunul, SW3 este root', false, 'Root-ul este switch-ul spre care duce calea directă.'],
  ], 'Cost mai mic = root port.'),
  single({ id: '2.5-011' }, 2, 'Un switch non-root are două linkuri paralele de 1 Gbps către root. Costuri și BID identice. Ce decide Root Port-ul?', [
    ['Sender port priority, apoi sender port number (cele ale root-ului)', true, 'Criteriile finale: prioritatea și numărul portului expeditorului.'],
    ['Adresa MAC a portului local', false, 'Nu este criteriul.'],
    ['Port aleatoriu, la fiecare convergență', false, 'Alegerea este deterministă.'],
    ['Portul cu numărul cel mai mare', false, 'Câștigă numărul cel mai mic.'],
  ], 'Tie-breakers: cost, sender BID, port priority, port number.'),
  single({ id: '2.5-012' }, 2, 'Ce face „spanning-tree vlan 10 root primary”?', [
    ['Setează prioritatea switch-ului suficient de mică pentru a deveni root pentru VLAN 10', true, 'Macro care calculează prioritatea la rulare (de obicei 24576).'],
    ['Setează prioritatea la 32768', false, 'Este valoarea implicită.'],
    ['Face portul root port pentru toate VLAN-urile', false, 'Este per VLAN și se referă la bridge, nu la un port.'],
    ['Activează PortFast pe VLAN 10', false, 'Nu are legătură.'],
  ], 'Root primary = macro de prioritate.'),
  { id: '2.5-013', topicId: T, sub: subOf('2.5-013'), type: 'match', difficulty: 2,
    stem: 'Potrivește viteza portului cu costul STP „short” implicit.',
    leftLabel: 'Viteză', rightLabel: 'Cost',
    pairs: [
      { left: '10 Mbps', right: '100', why: 'Cost short pentru Ethernet 10 Mbps.' },
      { left: '100 Mbps', right: '19', why: 'Fast Ethernet.' },
      { left: '1 Gbps', right: '4', why: 'Gigabit Ethernet.' },
      { left: '10 Gbps', right: '2', why: '10 Gigabit Ethernet.' },
    ],
    distractors: [{ text: '20 000', why: 'Este costul „long” pentru 1 Gbps, nu cel implicit short.' }],
    explanation: '100 / 19 / 4 / 2.' },

  // ======================= 2.5.b =======================
  single({ id: '2.5-014' }, 1, 'Care sunt rolurile unui port în RSTP?', [
    ['Root, Designated, Alternate, Backup, Disabled', true, 'Cele cinci roluri RSTP.'],
    ['Blocking, Listening, Learning, Forwarding, Disabled', false, 'Acestea sunt stările 802.1D, nu rolurile.'],
    ['Root, Leaf, Spine', false, 'Termeni din alte arhitecturi.'],
    ['Master, Slave', false, 'Nu sunt roluri STP.'],
  ], 'Roluri ≠ stări.'),
  single({ id: '2.5-015' }, 2, 'Un port Alternate RSTP este în ce stare și ce reprezintă?', [
    ['Discarding; calea de rezervă spre root', true, 'Corespunde vechiului port blocking.'],
    ['Forwarding; calea principală spre root', false, 'Aceea este Root Port.'],
    ['Learning; port nou', false, 'Alternate nu este în tranziție.'],
    ['Disabled; port administrativ oprit', false, 'Disabled este alt rol.'],
  ], 'Alternate = rezervă, discarding.'),
  single({ id: '2.5-016' }, 2, 'Care stare 802.1D corespunde, în RSTP, stării Discarding? (cea mai completă variantă)', [
    ['Disabled, Blocking și Listening', true, 'Toate nu transmit date și nu învață MAC.'],
    ['Doar Blocking', false, 'Se unesc trei stări.'],
    ['Learning și Forwarding', false, 'Acestea rămân ca atare.'],
    ['Doar Listening', false, 'Și Blocking, și Disabled intră.'],
  ], 'Discarding unește trei stări.'),
  multi({ id: '2.5-017' }, 2, 'Care roluri sunt în starea Forwarding? (alege două)', [
    ['Root', true, 'Calea activă spre root.'],
    ['Designated', true, 'Trimite BPDU și date pe segment.'],
    ['Alternate', false, 'Discarding.'],
    ['Backup', false, 'Discarding.'],
  ], 'Root și Designated forwarding.'),
  single({ id: '2.5-018' }, 2, 'Pe un segment dintre SW-B (cost spre root 4) și SW-C (cost spre root 8), cine are portul designated?', [
    ['SW-B', true, 'Switch-ul cu calea mai bună spre root.'],
    ['SW-C', false, 'Are cost mai mare; portul lui va fi Root sau Alternate.'],
    ['Ambele', false, 'Un singur designated pe segment.'],
    ['Niciunul', false, 'Orice segment are un designated.'],
  ], 'Un designated pe segment.'),
  single({ id: '2.5-019' }, 2, 'Care este timpul tipic de convergență pentru RSTP pe linkuri punct-la-punct?', [
    ['≈ 1–2 secunde', true, 'Prin handshake proposal/agreement.'],
    ['30–50 secunde', false, 'Aceasta este valoarea 802.1D.'],
    ['5 minute', false, 'Mult prea mult pentru STP.'],
    ['Instantaneu, mereu', false, 'Nu există convergență instantanee garantată; depinde de topologie.'],
  ], 'RSTP rapid.'),
  single({ id: '2.5-020' }, 2, 'Pe ce tip de link funcționează handshake-ul rapid proposal/agreement?', [
    ['Punct-la-punct (full duplex)', true, 'Pe linkuri shared (half duplex) revine la timere.'],
    ['Shared (half duplex, hub)', false, 'Acolo handshake-ul nu este folosit.'],
    ['Doar pe linkuri de 10 Gbps', false, 'Viteza nu contează.'],
    ['Numai pe porturile access', false, 'Contează tipul de link, nu modul switchport.'],
  ], 'Point-to-point.'),
  { id: '2.5-021', topicId: T, sub: subOf('2.5-021'), type: 'order', difficulty: 2,
    stem: 'Ordonează pașii handshake-ului RSTP pe un link nou.',
    items: [
      { text: 'Portul designated trimite un BPDU cu flagul Proposal', why: 'Cere permisiunea de a trece în Forwarding.' },
      { text: 'Switch-ul vecin sincronizează: pune porturile non-edge în Discarding', why: 'Evită bucla temporară.' },
      { text: 'Vecinul răspunde cu Agreement și își marchează portul Root Port', why: 'Confirmă că poate accepta.' },
      { text: 'Portul designated trece imediat în Forwarding', why: 'Fără 2 × 15 s.' },
      { text: 'Handshake-ul se propagă către switch-urile din aval', why: 'Procesul continuă în cascadă.' },
    ],
    explanation: 'Proposal → sync → agreement → forwarding → propagare.' },

  // ======================= 2.5.c =======================
  single({ id: '2.5-022' }, 1, 'Ce face PortFast?', [
    ['Portul trece direct în Forwarding la link up', true, 'Este edge port.'],
    ['Portul crește viteza', false, 'PortFast nu schimbă viteza.'],
    ['Portul dezactivează STP complet pe tot switch-ul', false, 'Afectează doar acel port, iar STP continuă să asculte BPDU.'],
    ['Portul criptează cadrele', false, 'Nu are legătură.'],
  ], 'Edge port.'),
  single({ id: '2.5-023' }, 1, 'Pe ce tip de port se configurează PortFast?', [
    ['Spre hosturi (PC, server, imprimantă)', true, 'Acolo nu pot apărea bucle de switch.'],
    ['Spre alt switch', false, 'Poate crea bucle temporare.'],
    ['Pe toate trunk-urile dintre switch-uri', false, 'Greșit; trunk-urile spre switch-uri nu sunt edge.'],
    ['Doar pe porturile root', false, 'Root port nu este edge.'],
  ], 'PortFast = edge.'),
  single({ id: '2.5-024' }, 2, 'Un port cu PortFast primește un BPDU. Ce se întâmplă, fără BPDU Guard?', [
    ['Pierde starea edge și lucrează ca port STP normal', true, 'PortFast nu oprește STP.'],
    ['Intră în err-disabled', false, 'Aceasta cere BPDU Guard.'],
    ['Ignoră BPDU-ul', false, 'Portul nu îl ignoră.'],
    ['Devine root port automat', false, 'Rolul depinde de calculul STP.'],
  ], 'Fără Guard, portul revine la STP normal.'),
  single({ id: '2.5-025' }, 2, 'Ce efect are „spanning-tree portfast default” global?', [
    ['Activează PortFast pe toate porturile access', true, 'Nu pe trunk-uri.'],
    ['Activează PortFast pe toate porturile, inclusiv trunk', false, 'Se aplică doar porturilor access.'],
    ['Dezactivează STP', false, 'STP rămâne activ.'],
    ['Activează BPDU Guard automat pe orice port', false, 'BPDU Guard are comandă separată (portfast bpduguard default).'],
  ], 'Global: access ports.'),
  single({ id: '2.5-026' }, 2, 'De ce PortFast ajută un client DHCP?', [
    ['Portul intră imediat în Forwarding, deci clientul nu așteaptă STP și primește IP la timp', true, 'Fără PortFast clientul poate ajunge la timeout DHCP.'],
    ['PortFast mărește durata lease-ului DHCP', false, 'Nu are legătură.'],
    ['PortFast alocă adrese IP', false, 'Rolul DHCP.'],
    ['PortFast activează DHCP snooping', false, 'Funcții diferite.'],
  ], 'Fără așteptare STP.'),
  { id: '2.5-027', topicId: T, sub: subOf('2.5-027'), type: 'cli', difficulty: 1,
    stem: 'Activează PortFast pe interfața curentă (port spre un PC).',
    prompt: 'SW3(config-if)#', canonical: 'spanning-tree portfast', answers: ['spanning-tree portfast'], hint: 'spanning-tree …',
    wrong: [
      { text: 'spanning-tree portfast default', why: 'Aceasta este comanda globală.' },
      { text: 'portfast enable', why: 'Nu este sintaxa IOS.' },
      { text: 'spanning-tree bpduguard enable', why: 'Aceasta este BPDU Guard, nu PortFast.' },
    ],
    explanation: 'spanning-tree portfast.' },

  // ======================= 2.5.d =======================
  single({ id: '2.5-028' }, 1, 'Ce face BPDU Guard când un port edge primește un BPDU?', [
    ['Pune portul în err-disabled', true, 'Protejează topologia.'],
    ['Ignoră BPDU-ul', false, 'Asta ar face BPDU Filter.'],
    ['Face portul root port', false, 'Nu este efectul.'],
    ['Transmite BPDU-ul mai departe', false, 'Nu este comportamentul.'],
  ], 'Err-disabled.'),
  single({ id: '2.5-029' }, 2, 'Cum recuperezi un port în err-disabled din BPDU Guard?', [
    ['shutdown / no shutdown, după ce ai scos cauza, sau errdisable recovery', true, 'Recuperare manuală sau automată după interval.'],
    ['Așteaptă, revine singur mereu', false, 'Fără errdisable recovery, nu revine singur.'],
    ['Ștergi VLAN-ul', false, 'Nu are legătură.'],
    ['Schimbi prioritatea STP', false, 'Nu rezolvă starea portului.'],
  ], 'Err-disabled necesită recuperare.'),
  single({ id: '2.5-030' }, 2, 'Care funcție împiedică un switch nou conectat să devină root bridge?', [
    ['Root Guard', true, 'Un BPDU superior pune portul în root-inconsistent.'],
    ['PortFast', false, 'Nu protejează alegerea root-ului.'],
    ['Loop Guard', false, 'Previne bucle prin lipsă de BPDU.'],
    ['BPDU Filter', false, 'Ar ascunde BPDU, nu ar proteja root-ul.'],
  ], 'Root Guard.'),
  single({ id: '2.5-031' }, 2, 'Ce stare apare pe un port blocat de Root Guard?', [
    ['root-inconsistent', true, 'Revine automat când dispare BPDU-ul superior.'],
    ['loop-inconsistent', false, 'Aceea este Loop Guard.'],
    ['err-disabled', false, 'Aceea este BPDU Guard.'],
    ['forwarding', false, 'Portul este blocat.'],
  ], 'Root-inconsistent.'),
  single({ id: '2.5-032' }, 3, 'Care funcție previne o buclă când un link devine unidirecțional și un port alternate încetează să primească BPDU?', [
    ['Loop Guard', true, 'Ține portul loop-inconsistent în loc să-l lase designated.'],
    ['Root Guard', false, 'Se ocupă de BPDU superior.'],
    ['PortFast', false, 'Nu protejează de acest caz.'],
    ['BPDU Guard', false, 'Se aplică porturilor edge.'],
  ], 'Loop Guard.'),
  multi({ id: '2.5-033' }, 3, 'Alege afirmațiile corecte despre BPDU Filter. (alege două)', [
    ['Pe interfață, portul nu mai trimite și nu mai primește BPDU', true, 'STP este efectiv oprit pe port.'],
    ['Poate permite bucle nedetectate', true, 'Fără BPDU, STP nu vede bucla.'],
    ['Pune portul în err-disabled la primirea unui BPDU', false, 'Aceea este BPDU Guard.'],
    ['Este recomandat pe toate trunk-urile', false, 'Ar dezactiva protecția STP între switch-uri.'],
  ], 'Filter ≠ Guard.'),
  single({ id: '2.5-034' }, 2, 'Un administrator vrea să oprească automat orice switch conectat la porturile de utilizator. Ce combinație este potrivită?', [
    ['PortFast + BPDU Guard', true, 'Edge port + err-disabled la primul BPDU.'],
    ['Root Guard + Loop Guard', false, 'Pentru porturi între switch-uri.'],
    ['BPDU Filter pe interfață', false, 'Ar ignora BPDU și ar permite bucle.'],
    ['Doar PortFast', false, 'Nu oprește un switch conectat.'],
  ], 'PortFast + BPDU Guard.'),
  { id: '2.5-035', topicId: T, sub: subOf('2.5-035'), type: 'match', difficulty: 2,
    stem: 'Potrivește mecanismul cu efectul.',
    leftLabel: 'Mecanism', rightLabel: 'Efect',
    pairs: [
      { left: 'BPDU Guard', right: 'Port edge cu BPDU ⇒ err-disabled', why: 'Protecție pentru porturile spre utilizatori.' },
      { left: 'Root Guard', right: 'BPDU superior ⇒ root-inconsistent', why: 'Împiedică root-ul extern.' },
      { left: 'Loop Guard', right: 'Lipsă BPDU pe port root/alternate ⇒ loop-inconsistent', why: 'Previne bucle din linkuri unidirecționale.' },
      { left: 'BPDU Filter (interfață)', right: 'Nu trimite și nu primește BPDU', why: 'Efectiv oprește STP pe port.' },
    ],
    distractors: [{ text: 'Trece portul imediat în Forwarding', why: 'Aceasta este PortFast.' }],
    explanation: 'Guard-uri vs filter.' },
  { id: '2.5-036', topicId: T, sub: subOf('2.5-036'), type: 'cli', difficulty: 2,
    stem: 'Activează BPDU Guard pe interfața curentă.',
    prompt: 'SW3(config-if)#', canonical: 'spanning-tree bpduguard enable', answers: ['spanning-tree bpduguard enable'], hint: 'spanning-tree bpduguard …',
    wrong: [
      { text: 'spanning-tree guard root', why: 'Aceasta este Root Guard.' },
      { text: 'spanning-tree portfast bpduguard default', why: 'Este comanda globală.' },
      { text: 'bpduguard enable', why: 'Lipsește prefixul spanning-tree.' },
    ],
    explanation: 'spanning-tree bpduguard enable.' },

  // ======================= Mixt =======================
  { id: '2.5-037', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Setează modul STP al switch-ului la Rapid PVST+.',
    prompt: 'SW1(config)#', canonical: 'spanning-tree mode rapid-pvst', answers: ['spanning-tree mode rapid-pvst'], hint: 'spanning-tree mode …',
    wrong: [
      { text: 'spanning-tree mode pvst', why: 'Este PVST+ clasic.' },
      { text: 'spanning-tree mode mst', why: 'Este MST, nu Rapid PVST+.' },
      { text: 'spanning-tree rapid', why: 'Nu este comandă validă.' },
    ],
    explanation: 'spanning-tree mode rapid-pvst.' },
  { id: '2.5-038', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Fă acest switch root primary pentru VLAN 10 (din configurarea globală).',
    prompt: 'SW1(config)#', canonical: 'spanning-tree vlan 10 root primary', answers: ['spanning-tree vlan 10 root primary'], hint: 'spanning-tree vlan …',
    wrong: [
      { text: 'spanning-tree vlan 10 root secondary', why: 'Aceea setează rezerva.' },
      { text: 'spanning-tree root primary vlan 10', why: 'Ordinea cuvintelor este greșită.' },
      { text: 'spanning-tree vlan 10 priority primary', why: 'priority cere o valoare numerică.' },
    ],
    explanation: 'spanning-tree vlan 10 root primary.' },
  multi({ id: '2.5-039' }, 3, 'Într-un show spanning-tree, care indicii arată că SW1 este root pentru VLAN 10? (alege două)', [
    ['Mesajul „This bridge is the root”', true, 'Apare în blocul Root ID.'],
    ['Root ID Address coincide cu Bridge ID Address', true, 'Același MAC și aceeași prioritate.'],
    ['Toate porturile sunt Altn', false, 'Pe root toate porturile sunt Designated.'],
    ['Apare un Root Port', false, 'Root-ul nu are root port.'],
  ], 'Root: Root ID = Bridge ID.'),
  { id: '2.5-040', topicId: T, sub: T, type: 'order', difficulty: 3,
    stem: 'Ordonează pașii pentru a determina rolurile porturilor dintr-o topologie.',
    items: [
      { text: 'Găsește root bridge-ul (cel mai mic Bridge ID)', why: 'Punctul de referință.' },
      { text: 'Marchează toate porturile root-ului ca Designated', why: 'Root-ul are doar porturi designated.' },
      { text: 'Pe fiecare switch non-root calculează costul spre root și alege Root Port-ul', why: 'Un singur root port per switch.' },
      { text: 'Pe fiecare segment rămas alege Designated după cost/BID', why: 'Un designated pe segment.' },
      { text: 'Porturile rămase devin Alternate (Discarding)', why: 'Calea de rezervă.' },
    ],
    explanation: 'Root → desg pe root → root ports → desg pe segmente → alternate.' },
];
