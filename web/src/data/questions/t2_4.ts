import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.4 Configure and verify (Layer 2/Layer 3) EtherChannel (LACP).
// Obiectivul oficial nu are sub-puncte; `sub` este '2.4'. Fiecare variantă are explicație (why).
const T = '2.4';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_4: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '2.4-001' }, 1, 'Două switch-uri sunt legate prin două cabluri Gigabit paralele, fără EtherChannel. Ce face STP?', [
    ['Blochează unul dintre cele două linkuri, ca să evite bucla', true, 'Două căi între aceleași switch-uri formează o buclă L2; STP lasă una în forwarding și o blochează pe cealaltă.'],
    ['Le folosește pe amândouă și însumează banda', false, 'STP nu agregă; agregarea o face EtherChannel.'],
    ['Dezactivează ambele linkuri', false, 'STP blochează doar cât e necesar pentru a elimina bucla; un link rămâne activ.'],
    ['Nu face nimic, pentru că ambele linkuri au aceeași viteză', false, 'Viteza nu contează; existența a două căi creează bucla.'],
  ], 'Fără EtherChannel, linkul redundant este blocat de STP.'),
  single({ id: '2.4-002' }, 1, 'Care este scopul principal al EtherChannel?', [
    ['Să combine mai multe linkuri fizice paralele într-un singur link logic, cu bandă agregată și redundanță', true, 'Exact definiția: un port-channel peste mai mulți membri.'],
    ['Să cripteze traficul dintre două switch-uri', false, 'EtherChannel nu oferă criptare.'],
    ['Să separe traficul în VLAN-uri', false, 'VLAN-urile sunt altă tehnologie (2.1).'],
    ['Să aloce adrese IP porturilor', false, 'Adresarea IP nu are legătură cu agregarea.'],
  ], 'Agregare de linkuri.'),
  single({ id: '2.4-003' }, 2, 'Cum tratează STP un EtherChannel format din două linkuri între aceleași două switch-uri?', [
    ['Îl vede ca pe un singur link logic (port-channel) și nu blochează membrii', true, 'STP rulează pe interfața logică, nu pe membri.'],
    ['Blochează unul dintre membri', false, 'Asta se întâmplă doar fără EtherChannel.'],
    ['Blochează ambii membri', false, 'Nu are motiv: bucla nu mai există din perspectiva STP.'],
    ['Rulează o instanță STP separată pe fiecare membru', false, 'Instanța este pe port-channel.'],
  ], 'STP vede port-channel-ul.'),
  multi({ id: '2.4-004' }, 2, 'Care sunt avantaje reale ale unui EtherChannel? (alege două)', [
    ['Bandă agregată pentru mai multe fluxuri', true, 'Fluxurile diferite se repartizează pe membri.'],
    ['Redundanță: dacă un membru cade, restul continuă fără reconvergență STP', true, 'Canalul rămâne up cu membrii rămași.'],
    ['Un singur flux poate depăși viteza unui membru', false, 'Un flux merge pe un singur link; nu se poate depăși viteza lui.'],
    ['Criptare automată a cadrelor', false, 'EtherChannel nu criptează.'],
  ], 'Capacitate totală și rezistență, nu viteză per flux.'),
  single({ id: '2.4-005' }, 2, 'Un bundle are 4 × 1 Gbps. Un singur transfer între două hosturi poate atinge teoretic cel mult:', [
    ['1 Gbps', true, 'Fluxul este hash-uit pe un singur membru.'],
    ['4 Gbps', false, 'Ar însemna împărțirea unui flux pe linkuri; nu se face.'],
    ['2 Gbps', false, 'Nu există o regulă de împărțire în doi.'],
    ['0,25 Gbps', false, 'Un flux are acces la întreaga viteză a membrului său.'],
  ], 'Hash pe flux.'),
  single({ id: '2.4-006' }, 1, 'Ce este un port-channel?', [
    ['Interfața logică care reprezintă grupul de linkuri agregate', true, 'Pe ea se aplică setările de trunk/VLAN sau IP.'],
    ['Un tip de cablu', false, 'Este un concept logic, nu fizic.'],
    ['Un protocol de negociere', false, 'Protocoalele sunt LACP și PAgP.'],
    ['Un VLAN special', false, 'Nu are legătură cu VLAN-urile.'],
  ], 'Interfața logică a EtherChannel.'),

  // ======================= Negociere =======================
  single({ id: '2.4-007' }, 1, 'Ce protocol standard IEEE negociază un EtherChannel?', [
    ['LACP (802.3ad / 802.1AX)', true, 'Este standardul multi-vendor.'],
    ['PAgP', false, 'Este proprietar Cisco.'],
    ['DTP', false, 'DTP negociază trunking, nu agregarea.'],
    ['CDP', false, 'CDP descoperă vecini.'],
  ], 'LACP.'),
  single({ id: '2.4-008' }, 1, 'Care sunt modurile LACP?', [
    ['active și passive', true, 'active inițiază, passive răspunde.'],
    ['desirable și auto', false, 'Acestea sunt PAgP.'],
    ['on și off', false, 'on este static, nu LACP; off nu e un mod de canal.'],
    ['dynamic și static', false, 'Nu sunt moduri EtherChannel.'],
  ], 'active/passive.'),
  single({ id: '2.4-009' }, 1, 'SW1 are „mode active”, SW2 are „mode passive”, LACP. Rezultatul?', [
    ['Se formează un canal LACP', true, 'Capătul active inițiază și passive răspunde.'],
    ['Nu se formează: ambele trebuie să fie active', false, 'Este suficient ca unul să fie active.'],
    ['Se formează PAgP', false, 'active/passive sunt LACP, nu PAgP.'],
    ['Se formează un canal static', false, 'Static înseamnă „on”.'],
  ], 'active + passive ✔.'),
  { id: '2.4-010', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare mod cu protocolul sau comportamentul lui.',
    leftLabel: 'Mod', rightLabel: 'Descriere',
    pairs: [
      { left: 'active', right: 'LACP, inițiază negocierea', why: 'Trimite LACPDU fără să aștepte.' },
      { left: 'passive', right: 'LACP, doar răspunde', why: 'Nu inițiază; necesită un partener active.' },
      { left: 'desirable', right: 'PAgP, inițiază negocierea', why: 'Echivalentul Cisco pentru active.' },
      { left: 'on', right: 'Static, fără protocol de negociere', why: 'Se formează doar cu „on” pe celălalt capăt.' },
    ],
    distractors: [{ text: 'Protocol IEEE care negociază trunking', why: 'Aceasta nu este negociere de EtherChannel.' }],
    explanation: 'active/passive = LACP; desirable/auto = PAgP; on = static.' },
  single({ id: '2.4-011' }, 2, 'SW1: mode passive. SW2: mode passive (LACP). Ce se întâmplă?', [
    ['Canalul nu se formează', true, 'Niciun capăt nu inițiază negocierea.'],
    ['Se formează canalul, deoarece ambele folosesc LACP', false, 'Este nevoie ca cel puțin unul să fie active.'],
    ['Se formează un canal PAgP', false, 'passive este LACP.'],
    ['Portul intră în err-disabled imediat', false, 'Doar rămân linkuri separate (stand-alone).'],
  ], 'passive + passive ✘.'),
  single({ id: '2.4-012' }, 2, 'SW1: mode active (LACP). SW2: mode desirable (PAgP). Rezultat?', [
    ['Nu se formează: LACP și PAgP nu sunt compatibile', true, 'Fiecare protocol vorbește doar cu el însuși.'],
    ['Se formează canal LACP', false, 'SW2 nu înțelege LACPDU.'],
    ['Se formează canal PAgP', false, 'SW1 nu înțelege PAgP.'],
    ['Se formează un canal static', false, 'Static necesită „on” pe ambele.'],
  ], 'LACP ≠ PAgP.'),
  single({ id: '2.4-013' }, 2, 'SW1: mode on. SW2: mode active. Ce rezultă?', [
    ['Canalul nu se formează corect: „on” nu negociază și LACP așteaptă negociere', true, '„on” se potrivește doar cu „on”.'],
    ['Canal LACP funcțional', false, '„on” nu trimite și nu înțelege LACPDU.'],
    ['Canal PAgP funcțional', false, 'Nu este implicat PAgP.'],
    ['Se formează, dar fără redundanță', false, 'Nu se formează deloc ca EtherChannel stabil.'],
  ], 'on + active ✘.'),
  multi({ id: '2.4-014' }, 2, 'Care combinații formează un canal? (alege trei)', [
    ['active – passive', true, 'LACP: un capăt inițiază.'],
    ['desirable – auto', true, 'PAgP: un capăt inițiază.'],
    ['on – on', true, 'Static pe ambele capete.'],
    ['passive – passive', false, 'Nimeni nu inițiază.'],
    ['auto – auto', false, 'Nimeni nu inițiază.'],
  ], 'Un inițiator în aceeași familie, sau on–on.'),

  // ======================= Configurare L2/L3 =======================
  single({ id: '2.4-015' }, 1, 'Ce comandă pune interfața în canalul 1 cu LACP activ?', [
    ['channel-group 1 mode active', true, 'Sintaxa corectă.'],
    ['channel-group 1 mode desirable', false, 'desirable este PAgP.'],
    ['port-channel 1 mode active', false, 'port-channel nu este comandă de interfață cu acest rol.'],
    ['etherchannel 1 active', false, 'Nu există această comandă.'],
  ], 'channel-group N mode active.'),
  single({ id: '2.4-016' }, 2, 'După ce membrii sunt în canal, unde configurezi trunk-ul și VLAN-urile permise?', [
    ['Pe interface port-channel N', true, 'Configurația se propagă la membri.'],
    ['Individual, pe fiecare membru, cu valori diferite', false, 'Membrii trebuie să fie identici.'],
    ['Doar pe un membru', false, 'Ar crea inconsistențe.'],
    ['Global, în configurația de VLAN', false, 'Trunk-ul este setare de interfață.'],
  ], 'Setările merg pe Po.'),
  single({ id: '2.4-017' }, 2, 'Un membru are viteza forțată la 100 Mbps, ceilalți la 1000 Mbps. Efect probabil?', [
    ['Membrul nepotrivit nu intră în canal (stand-alone sau suspendat)', true, 'Viteza/duplexul trebuie să coincidă.'],
    ['Canalul funcționează normal', false, 'Parametrii nepotriviți sunt respinși.'],
    ['Toți membrii coboară la 100 Mbps', false, 'Switch-ul nu face acest compromis.'],
    ['Canalul trece pe L3', false, 'Nu se schimbă nivelul.'],
  ], 'Parametrii trebuie să fie identici.'),
  multi({ id: '2.4-018' }, 2, 'Care elemente trebuie să fie identice pe porturile membre? (alege trei)', [
    ['Viteza și duplexul', true, 'Condiție de compatibilitate.'],
    ['Modul switchport (access/trunk)', true, 'Nu poți mixa.'],
    ['VLAN-ul de access / native / allowed', true, 'Trebuie să coincidă.'],
    ['Descrierea (description) portului', false, 'Nu este condiție.'],
    ['Numărul portului fizic', false, 'Porturile sunt, evident, diferite.'],
  ], 'Viteza, duplexul, modul, VLAN-urile.'),
  single({ id: '2.4-019' }, 2, 'Care configurație este corectă pentru un EtherChannel L3 între două switch-uri multilayer?', [
    ['no switchport pe membri și pe Po, adresa IP pe port-channel', true, 'IP se pune pe interfața logică.'],
    ['switchport mode trunk pe Po și ip address pe membri', false, 'Trunk-ul este L2; IP-ul nu se pune pe membri.'],
    ['ip address pe fiecare membru', false, 'Membrii sunt agregați și nu au IP.'],
    ['channel-group fără no switchport, dar cu ip address pe Po', false, 'Membrii trebuie să fie rutați pentru un canal L3.'],
  ], 'no switchport + IP pe Po.'),
  { id: '2.4-020', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii recomandați pentru un EtherChannel L2 trunk nou.',
    items: [
      { text: 'Alegi membrii și te asiguri că au aceleași setări (viteză, duplex, modul)', why: 'Nepotrivirile fac membrul inutilizabil.' },
      { text: 'Pui membrii în canal: channel-group N mode …', why: 'Creează port-channel-ul.' },
      { text: 'Configurezi interface port-channel N (trunk, native, allowed VLAN)', why: 'Setările se propagă la membri.' },
      { text: 'Repeți pe celălalt switch, cu un mod compatibil', why: 'Ambele capete trebuie să se potrivească.' },
      { text: 'Verifici cu show etherchannel summary', why: 'Confirmi Po(SU) cu membrii (P).' },
    ],
    explanation: 'Pregătire → grupare → configurare Po → celălalt capăt → verificare.' },

  // ======================= Load balancing, verificare =======================
  single({ id: '2.4-021' }, 2, 'Cum alege un switch pe ce membru trimite un cadru?', [
    ['Printr-un hash pe câmpuri din antet; același flux merge mereu pe același membru', true, 'Păstrează ordinea cadrelor.'],
    ['Alternează cadrele: unul pe fiecare link', false, 'Ar produce reordonări.'],
    ['Alege mereu linkul cu cea mai mică încărcare, cadru cu cadru', false, 'Nu este mecanismul folosit.'],
    ['Trimite pe toate linkurile simultan', false, 'Ar duplica traficul.'],
  ], 'Hash pe flux.'),
  single({ id: '2.4-022' }, 1, 'Unde se setează metoda de load balancing?', [
    ['Global (port-channel load-balance …)', true, 'Se aplică tuturor canalelor.'],
    ['Pe fiecare port-channel în parte, ca setare de interfață', false, 'Nu este setare de interfață.'],
    ['Pe fiecare membru', false, 'Este globală.'],
    ['Numai pe celălalt switch', false, 'Fiecare echipament decide pentru traficul pe care îl trimite el.'],
  ], 'Global.'),
  single({ id: '2.4-023' }, 2, 'Tot traficul trece printr-un router, deci toate cadrele au același MAC sursă sau destinație. Ce metodă împrăștie mai bine traficul?', [
    ['O metodă bazată pe IP (de exemplu src-dst-ip)', true, 'IP-urile diferă între fluxuri chiar dacă MAC-ul este același.'],
    ['O metodă doar pe MAC destinație', false, 'MAC-ul este același ⇒ un singur link.'],
    ['Nicio metodă ajută', false, 'Alegerea contează.'],
    ['Dezactivarea hash-ului', false, 'Nu se poate dezactiva.'],
  ], 'IP când MAC-ul e constant.'),
  { id: '2.4-024', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește flagul din show etherchannel summary cu sensul.',
    leftLabel: 'Flag', rightLabel: 'Sens',
    pairs: [
      { left: '(P)', right: 'Port bundled în canal', why: 'Starea dorită a unui membru.' },
      { left: '(s)', right: 'Port suspendat', why: 'Nepotrivire sau lipsă de LACPDU.' },
      { left: '(I)', right: 'Stand-alone', why: 'Nu e în canal; lucrează individual.' },
      { left: 'Po1(SU)', right: 'Canal L2 în uz', why: 'S = Layer 2, U = in use.' },
    ],
    distractors: [{ text: 'Canal L3 în uz', why: 'Ar fi RU.' }],
    explanation: 'P bundled, s suspended, I stand-alone, SU L2.' },
  single({ id: '2.4-025' }, 2, 'show etherchannel summary afișează Po2(RU). Ce înseamnă?', [
    ['Canal de nivel 3, în uz', true, 'R = Layer 3, U = in use.'],
    ['Canal de nivel 2, căzut', false, 'Acela ar fi SD.'],
    ['Canal suspendat', false, 's este flag de membru.'],
    ['Canal PAgP', false, 'Protocolul apare în altă coloană.'],
  ], 'RU = L3.'),
  single({ id: '2.4-026' }, 2, 'Ce comandă arată vecinul LACP și prioritățile?', [
    ['show lacp neighbor', true, 'Afișează informațiile partenerului.'],
    ['show cdp neighbors', false, 'CDP nu arată LACP.'],
    ['show spanning-tree', false, 'Arată STP.'],
    ['show vlan brief', false, 'Nu afișează LACP.'],
  ], 'show lacp neighbor.'),
  single({ id: '2.4-027' }, 3, 'Un membru apare ca Gi0/2(I). Care este cauza cea mai probabilă?', [
    ['Nu a negociat canalul (de exemplu modul lipsă/incompatibil pe celălalt capăt)', true, 'I = stand-alone.'],
    ['Portul este bundled și funcționează normal', false, 'Aceea ar fi (P).'],
    ['Portul este L3', false, 'Nu indică acest lucru.'],
    ['Portul este hot-standby', false, 'Aceea ar fi (H).'],
  ], 'Stand-alone = canal nenegociat.'),
  single({ id: '2.4-028' }, 3, 'Po1(SD) cu membrii Gi0/1(I) Gi0/2(I). SW1 active, SW2 passive pe ambele porturi, dar SW2 are Gi0/2 în VLAN 20 access. Ce corectezi?', [
    ['Aducerea membrilor de pe SW2 la aceeași configurație (trunk), apoi reset negociere', true, 'Un membru nepotrivit blochează formarea/ consistența bundle-ului.'],
    ['Schimbi SW1 în passive', false, 'Ar face-o și mai rău (passive–passive).'],
    ['Pui IP pe port-channel', false, 'Nu este relevant la L2.'],
    ['Schimbi load-balance', false, 'Nu are legătură cu formarea canalului.'],
  ], 'Parametri identici înainte de formarea canalului.'),

  // ======================= CLI =======================
  { id: '2.4-029', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Pe interfețele selectate, pune-le în canalul 1 cu LACP activ.',
    prompt: 'SW1(config-if-range)#', canonical: 'channel-group 1 mode active', answers: ['channel-group 1 mode active'], hint: 'channel-group …',
    wrong: [
      { text: 'channel-group 1 mode desirable', why: 'desirable este PAgP.' },
      { text: 'channel-group 1 mode passive', why: 'passive nu inițiază; cerința spune activ.' },
      { text: 'channel-group 1 mode on', why: 'on este static, fără LACP.' },
    ],
    explanation: 'channel-group N mode active.' },
  { id: '2.4-030', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Afișează rezumatul tuturor EtherChannel-urilor.',
    prompt: 'SW1#', canonical: 'show etherchannel summary', answers: ['show etherchannel summary', 'sh etherchannel summary', 'show etherchannel sum', 'sh etherchannel sum'], hint: 'show etherchannel …',
    wrong: [
      { text: 'show etherchannel', why: 'Incomplet pe multe versiuni; cere un subcomand.' },
      { text: 'show port-channel summary', why: 'Aceasta este sintaxa NX-OS, nu IOS clasic.' },
      { text: 'show interfaces trunk', why: 'Nu arată membrii canalului.' },
    ],
    explanation: 'show etherchannel summary.' },
  { id: '2.4-031', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Setează metoda de load balancing pe IP sursă și destinație (din configurarea globală).',
    prompt: 'SW1(config)#', canonical: 'port-channel load-balance src-dst-ip', answers: ['port-channel load-balance src-dst-ip'], hint: 'port-channel load-balance …',
    wrong: [
      { text: 'load-balance src-dst-ip', why: 'Lipsește prefixul port-channel.' },
      { text: 'port-channel load-balance src-dst-mac', why: 'Este alta metodă, pe MAC.' },
      { text: 'etherchannel load-balance src-dst-ip', why: 'Nu este comanda IOS.' },
    ],
    explanation: 'port-channel load-balance src-dst-ip.' },
  { id: '2.4-032', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Pe interfața port-channel 2 a unui switch multilayer, fă portul rutat (nivel 3).',
    prompt: 'SW-D1(config-if)#', canonical: 'no switchport', answers: ['no switchport'], hint: 'no …',
    wrong: [
      { text: 'switchport mode routed', why: 'Nu există această comandă.' },
      { text: 'ip routing', why: 'Este comandă globală, nu face portul rutat.' },
      { text: 'no shutdown', why: 'Doar activează interfața.' },
    ],
    explanation: 'no switchport.' },

  // ======================= Scenarii =======================
  single({ id: '2.4-033' }, 2, 'Un administrator pune pe două switch-uri „channel-group 1 mode on” și pe unul din ele „channel-group 1 mode active”. Ce principiu a încălcat?', [
    ['Un mod static „on” nu negociază și nu se potrivește cu LACP', true, '„on” funcționează doar cu „on”.'],
    ['LACP trebuie să fie activat cu spanning-tree', false, 'Nu există această cerință.'],
    ['Numerele de canal trebuie să fie diferite', false, 'Numărul este local.'],
    ['Numai PAgP acceptă „on”', false, '„on” este static, nu PAgP.'],
  ], 'on doar cu on.'),
  single({ id: '2.4-034' }, 1, 'Câte porturi poate avea un bundle LACP (maxim) și câte sunt active simultan?', [
    ['16 porturi; 8 active, 8 standby', true, 'Standardul definește acest comportament; implementările sunt în linie.'],
    ['8 porturi; toate active', false, 'Aceasta descrie mai degrabă PAgP.'],
    ['4 porturi', false, 'Nu este limita.'],
    ['32 porturi', false, 'Depășește limita.'],
  ], 'LACP: 16 = 8 + 8.'),
  single({ id: '2.4-035' }, 2, 'Numărul port-channel-ului de pe SW1 este 1, iar pe SW2 este 5. Ce efect?', [
    ['Niciun efect: numerele sunt locale', true, 'Contează modurile și parametrii.'],
    ['Canalul nu se formează', false, 'Nu depinde de număr.'],
    ['STP blochează un membru', false, 'Nu este legat de numere.'],
    ['Canalul devine L3', false, 'Nivelul este dat de no switchport.'],
  ], 'Numere locale.'),
  single({ id: '2.4-036' }, 2, 'De ce este util „channel-protocol lacp” pe un port?', [
    ['Refuză moduri incompatibile (PAgP) pe acel port', true, 'Previne amestecul accidental.'],
    ['Crește viteza', false, 'Nu afectează viteza.'],
    ['Activează load balancing', false, 'Nu are legătură.'],
    ['Transformă canalul în L3', false, 'Nu schimbă nivelul.'],
  ], 'Fixează protocolul.'),
  single({ id: '2.4-037' }, 2, 'Un membru dintr-un canal LACP trece în „s” (suspended). Cum este cel mai probabil?', [
    ['Nu primește LACPDU de la partener sau parametrii nu se potrivesc', true, 'LACP suspendă membrul în aceste cazuri.'],
    ['A fost pus în hot-standby', false, 'Aceea e (H).'],
    ['Canalul e L3', false, 'Nu se vede din flagul s.'],
    ['STP l-a blocat', false, 'STP nu blochează membrii individuali.'],
  ], 's = suspendat.'),
  single({ id: '2.4-038' }, 3, 'Care afirmație despre PAgP vs LACP este corectă?', [
    ['LACP este standard IEEE; PAgP este proprietar Cisco', true, 'Din acest motiv LACP se folosește multi-vendor.'],
    ['PAgP este standard, LACP proprietar', false, 'Invers.'],
    ['Ambele sunt proprietar Cisco', false, 'LACP este IEEE.'],
    ['Pot fi mixate pe același canal', false, 'Sunt incompatibile.'],
  ], 'LACP = standard.'),
  { id: '2.4-039', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii de depanare când Po1 este (SD).',
    items: [
      { text: 'show etherchannel summary — vezi flagurile membrilor', why: 'Punctul de plecare.' },
      { text: 'Verifici modurile pe ambele capete (nu passive+passive, nu LACP+PAgP)', why: 'Cauza cea mai frecventă.' },
      { text: 'Compari configurația membrilor (trunk, VLAN, viteză, duplex)', why: 'Nepotrivirile suspendă membri.' },
      { text: 'show lacp neighbor — vezi dacă apare partenerul', why: 'Confirmă că vin LACPDU.' },
      { text: 'După corectare, shutdown / no shutdown pe port-channel', why: 'Resetează negocierea.' },
    ],
    explanation: 'Summary → moduri → parametri → vecin → reset.' },
  multi({ id: '2.4-040' }, 3, 'Ce afirmații despre un EtherChannel de nivel 3 sunt corecte? (alege trei)', [
    ['Membrii au no switchport', true, 'Sunt porturi rutate.'],
    ['Adresa IP se pune pe interfața port-channel', true, 'Nu pe membri.'],
    ['În summary, canalul apare cu flagul RU', true, 'R = Layer 3, U = in use.'],
    ['Trunk-ul 802.1Q se configurează pe Po', false, 'Pe un port rutat nu există trunk.'],
    ['STP blochează un membru', false, 'Linkurile rutate nu participă la STP.'],
  ], 'L3: no switchport, IP pe Po, RU.'),
];
