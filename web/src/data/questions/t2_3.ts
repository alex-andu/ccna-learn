import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.3 Configure and verify Layer 2 discovery protocols (CDP and LLDP).
// Obiectivul oficial nu are sub-puncte; `sub` este '2.3'. Fiecare variantă are explicație (why).
const T = '2.3';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_3: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '2.3-001' }, 1, 'La ce folosește un protocol de descoperire de nivel 2, precum CDP sau LLDP?', [
    ['Echipamentele își anunță vecinii direct conectați (nume, model, port, capabilități) și află aceleași informații despre ei', true, 'Rezultatul este o tabelă de vecini utilă pentru documentare și depanare.'],
    ['Pentru a rula rutarea dinamică între routere', false, 'Rutarea dinamică folosește protocoale precum OSPF; CDP/LLDP doar informează.'],
    ['Pentru a cripta traficul dintre switch-uri', false, 'Nu oferă criptare; anunțurile sunt chiar în clar.'],
    ['Pentru a aloca adrese IP hosturilor', false, 'Aceasta este rolul DHCP.'],
  ], 'Descoperire de vecini direcți; informativ.'),
  single({ id: '2.3-002' }, 1, 'Un switch SW1 este conectat la SW2, iar SW2 la SW3. Ce vecini CDP are SW1?', [
    ['Doar SW2, vecinul direct', true, 'Anunțurile CDP nu depășesc un salt.'],
    ['SW2 și SW3', false, 'SW3 nu este conectat direct; cadrele CDP nu sunt retransmise.'],
    ['Toate echipamentele din aceeași subrețea', false, 'CDP este de nivel 2 și nu depinde de subrețele.'],
    ['Niciunul, dacă nu există adrese IP', false, 'CDP funcționează fără IP.'],
  ], 'Doar vecini direcți.'),
  single({ id: '2.3-003' }, 2, 'La ce nivel OSI funcționează CDP și LLDP și ce implică asta?', [
    ['Nivelul 2: nu au nevoie de adrese IP și nu trec de un router', true, 'Cadrele sunt L2 și rămân pe legătura directă.'],
    ['Nivelul 3: necesită adrese IP pe ambele capete', false, 'Nu folosesc IP.'],
    ['Nivelul 4: folosesc porturi TCP', false, 'Nu folosesc TCP/UDP.'],
    ['Nivelul 7: sunt aplicații client-server', false, 'Sunt protocoale de legătură, nu aplicații.'],
  ], 'Layer 2 discovery = direct, fără IP.'),
  multi({ id: '2.3-004' }, 2, 'Care afirmații sunt adevărate atât pentru CDP, cât și pentru LLDP? (alege trei)', [
    ['Anunțurile se trimit periodic și au un hold time', true, 'Intrarea expiră dacă nu mai vine un anunț.'],
    ['Funcționează între echipamente direct conectate, la nivelul 2', true, 'Nu cer adrese IP și nu trec de un router.'],
    ['Pot fi dezactivate global și pe interfață', true, 'Ambele au comenzi globale și per interfață.'],
    ['Autentifică și criptează anunțurile', false, 'Ambele trimit informațiile în clar.'],
    ['Sunt standarde IEEE', false, 'Doar LLDP este standard IEEE; CDP este proprietar Cisco.'],
  ], 'Periodic, direct, controlabil; nu criptează.'),
  single({ id: '2.3-005' }, 1, 'Pe un switch Cisco IOS nou, nemodificat, care este starea implicită a celor două protocoale?', [
    ['CDP activat, LLDP dezactivat', true, 'LLDP trebuie pornit cu lldp run.'],
    ['CDP dezactivat, LLDP activat', false, 'Invers față de realitate.'],
    ['Ambele activate', false, 'LLDP este implicit oprit pe IOS.'],
    ['Ambele dezactivate', false, 'CDP este implicit pornit.'],
  ], 'Default: CDP on, LLDP off.'),
  single({ id: '2.3-006' }, 1, 'Care dintre protocoale este proprietar Cisco?', [
    ['CDP', true, 'Cisco Discovery Protocol.'],
    ['LLDP', false, 'LLDP este standard IEEE 802.1AB.'],
    ['Ambele', false, 'Doar CDP este proprietar.'],
    ['Niciunul', false, 'CDP este proprietar.'],
  ], 'CDP = proprietar; LLDP = IEEE.'),

  // ======================= CDP =======================
  single({ id: '2.3-007' }, 1, 'Care sunt valorile implicite ale timerului și ale holdtime-ului în CDP?', [
    ['60 s și 180 s', true, 'Anunț la fiecare 60 s; vecinul păstrează informația 180 s.'],
    ['30 s și 120 s', false, 'Sunt valorile uzuale LLDP.'],
    ['10 s și 30 s', false, 'Nu sunt valorile implicite.'],
    ['180 s și 60 s', false, 'Sunt inversate.'],
  ], 'CDP: 60/180.'),
  single({ id: '2.3-008' }, 2, 'Care comandă arată adresa IP și versiunea de IOS a unui vecin?', [
    ['show cdp neighbors detail', true, 'Arată IP, versiune, native VLAN și duplex pentru fiecare vecin.'],
    ['show cdp neighbors', false, 'Arată doar tabela scurtă (fără IP).'],
    ['show cdp traffic', false, 'Arată doar contoare de pachete CDP.'],
    ['show cdp interface', false, 'Arată interfețele cu CDP activ și timerele.'],
  ], 'IP și versiune: detail (sau entry).'),
  single({ id: '2.3-009' }, 2, 'În „show cdp neighbors”, ce reprezintă coloana „Local Intrfce” și ce reprezintă „Port ID”?', [
    ['Local Intrfce = portul echipamentului pe care rulezi comanda; Port ID = portul vecinului', true, 'Cele două capete ale cablului.'],
    ['Local Intrfce = portul vecinului; Port ID = portul tău', false, 'Inversat.'],
    ['Ambele sunt porturile tale', false, 'Port ID este al vecinului.'],
    ['Ambele sunt porturile vecinului', false, 'Local Intrfce este al tău.'],
  ], 'Local = tu; Port ID = vecinul.'),
  single({ id: '2.3-010' }, 1, 'Cum dezactivezi CDP pe tot echipamentul?', [
    ['no cdp run', true, 'Comandă globală.'],
    ['no cdp enable', false, 'Aceasta este comanda de interfață.'],
    ['cdp disable', false, 'Nu există această comandă.'],
    ['no cdp timer', false, 'Nu oprește protocolul.'],
  ], 'Global: no cdp run.'),
  { id: '2.3-011', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare comandă CDP cu efectul ei.',
    leftLabel: 'Comandă', rightLabel: 'Efect',
    pairs: [
      { left: 'show cdp neighbors', right: 'Tabelă scurtă de vecini', why: 'Device ID, Local Intrfce, Holdtme, Capability, Platform, Port ID.' },
      { left: 'show cdp neighbors detail', right: 'IP, versiune IOS, native VLAN și duplex ale vecinilor', why: 'Cea mai utilă comandă CDP.' },
      { left: 'no cdp enable (pe interfață)', right: 'Oprește CDP pe acel port', why: 'Comanda de interfață.' },
      { left: 'cdp timer 30', right: 'Anunț la 30 s', why: 'Schimbă intervalul implicit de 60 s.' },
    ],
    distractors: [{ text: 'Pornește LLDP', why: 'LLDP se pornește cu lldp run.' }],
    explanation: 'Show-uri pentru verificare; enable/run/timer pentru control.' },
  single({ id: '2.3-012' }, 2, 'Ai rulat „no cdp enable” pe interfața Fa0/10. Ce se întâmplă?', [
    ['CDP se oprește doar pe Fa0/10; pe celelalte porturi rămâne activ', true, 'Comanda este per interfață.'],
    ['CDP se oprește pe tot echipamentul', false, 'Aceasta se face cu no cdp run.'],
    ['Portul Fa0/10 intră în shutdown', false, 'Starea administrativă a portului nu se schimbă.'],
    ['LLDP se activează pe Fa0/10', false, 'Nu are legătură cu LLDP.'],
  ], 'no cdp enable = per interfață.'),
  single({ id: '2.3-013' }, 2, 'Un switch Cisco primește un cadru CDP de la un vecin. Ce face cu el?', [
    ['Îl procesează local (îl pune în tabela de vecini) și nu îl retransmite mai departe', true, 'Anunțurile CDP sunt link-local, adresate unui multicast rezervat.'],
    ['Îl inundă pe toate celelalte porturi', false, 'Nu este retransmis ca un broadcast obișnuit.'],
    ['Îl rutează către Internet', false, 'Nu este trafic IP.'],
    ['Îl ignoră pentru că nu are IP', false, 'CDP funcționează fără IP.'],
  ], 'CDP = link-local, nu se retransmite.'),
  multi({ id: '2.3-014' }, 2, 'Ce informații poți vedea în „show cdp neighbors detail”? (alege trei)', [
    ['Adresa IP a vecinului', true, 'Adresă de management anunțată de vecin.'],
    ['Versiunea de software (IOS)', true, 'Anunțată în detail.'],
    ['Native VLAN și duplex', true, 'Permit detectarea nepotrivirilor.'],
    ['Parola de enable a vecinului', false, 'Niciodată anunțată.'],
    ['Tabela de rutare a vecinului', false, 'Nu face parte din anunț.'],
  ], 'IP, versiune, native VLAN/duplex.'),
  single({ id: '2.3-015' }, 2, 'În coloana Capability a lui show cdp neighbors, ce literă indică un telefon IP?', [
    ['P', true, 'P = Phone.'],
    ['S', false, 'S = Switch.'],
    ['H', false, 'H = Host.'],
    ['R', false, 'R = Router.'],
  ], 'P = Phone.'),
  single({ id: '2.3-016' }, 3, 'Ce mesaj generează CDP când două capete au duplex diferit?', [
    ['%CDP-4-DUPLEX_MISMATCH', true, 'CDP compară duplexul anunțat de vecin cu cel local.'],
    ['%LINK-3-UPDOWN', false, 'Anunță doar că link-ul a căzut/urcat.'],
    ['%STP-2-ROOTCHANGE', false, 'Aparține STP.'],
    ['%SYS-5-RESTART', false, 'Anunță repornirea.'],
  ], 'DUPLEX_MISMATCH vine de la CDP.'),

  // ======================= LLDP =======================
  single({ id: '2.3-017' }, 1, 'Ce standard definește LLDP?', [
    ['IEEE 802.1AB', true, 'LLDP este standard deschis.'],
    ['IEEE 802.1Q', false, '802.1Q este tag-ul VLAN.'],
    ['IEEE 802.3af', false, '802.3af este PoE.'],
    ['IEEE 802.1D', false, '802.1D este STP.'],
  ], 'LLDP = 802.1AB.'),
  single({ id: '2.3-018' }, 1, 'Cum pornești LLDP global pe un switch Cisco IOS?', [
    ['lldp run', true, 'Comandă globală; LLDP e implicit oprit.'],
    ['cdp run', false, 'Aceasta pornește CDP.'],
    ['enable lldp', false, 'Nu este o comandă IOS.'],
    ['lldp enable', false, 'Nu este comanda globală.'],
  ], 'lldp run.'),
  single({ id: '2.3-019' }, 2, 'Care sunt valorile uzuale ale timerului și hold time-ului LLDP pe IOS?', [
    ['30 s și 120 s', true, 'Valorile obișnuite (verifică cu show lldp pe platforma ta).'],
    ['60 s și 180 s', false, 'Sunt valorile CDP.'],
    ['10 s și 40 s', false, 'Nu sunt valorile uzuale.'],
    ['300 s și 900 s', false, 'Nu sunt valorile uzuale.'],
  ], 'LLDP: 30/120.'),
  single({ id: '2.3-020' }, 2, 'La ce folosesc „lldp transmit” și „lldp receive” pe o interfață?', [
    ['Controlează separat dacă portul trimite anunțuri și dacă le primește', true, 'Poți permite doar o direcție.'],
    ['Pornesc LLDP global', false, 'Pornirea globală se face cu lldp run.'],
    ['Setează timerul de anunț', false, 'Timerul se setează cu lldp timer.'],
    ['Pornesc CDP pe port', false, 'Nu au legătură cu CDP.'],
  ], 'Control pe direcție, per interfață.'),
  single({ id: '2.3-021' }, 3, 'Ce EtherType identifică cadrele LLDP?', [
    ['0x88CC', true, 'Valoarea rezervată pentru LLDP.'],
    ['0x0800', false, 'IPv4.'],
    ['0x8100', false, 'TPID 802.1Q.'],
    ['0x0806', false, 'ARP.'],
  ], 'LLDP = 0x88CC.'),
  single({ id: '2.3-022' }, 3, 'Care TLV-uri sunt obligatorii într-un cadru LLDP?', [
    ['Chassis ID, Port ID și TTL (plus End of LLDPDU)', true, 'Sunt cele minime; restul sunt opționale.'],
    ['System Name, System Description și Management Address', false, 'Sunt TLV-uri opționale.'],
    ['VLAN ID și MAC sursă', false, 'MAC-ul sursă este în antet, nu un TLV obligatoriu.'],
    ['Nu există TLV-uri obligatorii', false, 'Există trei, plus marcatorul de sfârșit.'],
  ], 'Chassis ID, Port ID, TTL.'),
  multi({ id: '2.3-023' }, 2, 'Care afirmații despre LLDP sunt adevărate? (alege trei)', [
    ['Este standard IEEE 802.1AB, folosit în rețele multi-vendor', true, 'Spre deosebire de CDP.'],
    ['Pe IOS e dezactivat implicit; se pornește cu lldp run', true, 'Altfel nu apare niciun vecin LLDP.'],
    ['Folosește TLV-uri (Type-Length-Value) pentru informații', true, 'Fiecare informație e un TLV.'],
    ['Este proprietar Cisco', false, 'Este standard.'],
    ['Este activ implicit pe IOS', false, 'Este dezactivat implicit.'],
  ], 'Standard, oprit implicit, TLV-uri.'),
  single({ id: '2.3-024' }, 2, 'La ce folosește extensia LLDP-MED?', [
    ['Anunță endpoint-urilor media (telefoane) VLAN-ul de voce, QoS și necesarul de putere PoE', true, 'Echivalentul funcțional al părții de telefon din CDP.'],
    ['Criptează anunțurile LLDP', false, 'Nu criptează.'],
    ['Înlocuiește STP', false, 'Nu are legătură.'],
    ['Alocă adrese IP telefoanelor', false, 'DHCP face asta.'],
  ], 'LLDP-MED = voce/PoE pentru telefoane.'),
  { id: '2.3-025', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare comandă LLDP cu efectul ei.',
    leftLabel: 'Comandă', rightLabel: 'Efect',
    pairs: [
      { left: 'lldp run', right: 'Pornește LLDP global', why: 'Implicit LLDP e oprit.' },
      { left: 'show lldp neighbors', right: 'Listează vecinii LLDP', why: 'Device ID, Local Intf, Hold-time, Capability, Port ID.' },
      { left: 'no lldp receive (pe interfață)', right: 'Portul ignoră anunțurile primite', why: 'Controlul direcției.' },
      { left: 'lldp holdtime 120', right: 'Setează hold time-ul anunțat', why: 'TTL-ul din anunț.' },
    ],
    distractors: [{ text: 'Oprește CDP pe port', why: 'CDP se oprește cu no cdp enable.' }],
    explanation: 'run / show / transmit-receive / timer-holdtime.' },
  single({ id: '2.3-026' }, 1, 'Care comandă listează vecinii LLDP?', [
    ['show lldp neighbors', true, 'Tabela vecinilor LLDP.'],
    ['show cdp neighbors', false, 'Arată vecinii CDP.'],
    ['show lldp interface neighbors', false, 'Nu este sintaxa corectă.'],
    ['show neighbors', false, 'Nu este o comandă IOS.'],
  ], 'show lldp neighbors.'),

  // ======================= Comparație, securitate, depanare =======================
  single({ id: '2.3-027' }, 2, 'Într-o rețea cu switch-uri de la mai mulți producători, care protocol e potrivit pentru descoperirea vecinilor?', [
    ['LLDP, fiind standard IEEE', true, 'Multi-vendor.'],
    ['CDP, fiind mai vechi', false, 'CDP funcționează doar cu echipamente care îl implementează (Cisco).'],
    ['DTP', false, 'DTP negociază trunk, nu descoperă vecini.'],
    ['VTP', false, 'VTP propagă VLAN-uri.'],
  ], 'Multi-vendor ⇒ LLDP.'),
  single({ id: '2.3-028' }, 2, 'Pot rula CDP și LLDP simultan pe același echipament?', [
    ['Da; fiecare își ține propria tabelă de vecini', true, 'Este frecvent în rețele mixte.'],
    ['Nu, se exclud reciproc', false, 'Nu se exclud.'],
    ['Doar pe routere', false, 'Și pe switch-uri.'],
    ['Doar dacă ai licență specială', false, 'Nu depinde de licență pentru acest comportament.'],
  ], 'Pot coexista.'),
  single({ id: '2.3-029' }, 2, 'Care este principalul risc de securitate al lui CDP/LLDP lăsat activ pe toate porturile?', [
    ['Un atacator care primește anunțuri află modelul, versiunea de IOS, IP-urile și native VLAN-ul', true, 'Informații utile pentru alegerea unui atac.'],
    ['Traficul de date este criptat greșit', false, 'Nu are legătură.'],
    ['Switch-ul își pierde tabela MAC', false, 'Nu are legătură.'],
    ['Porturile devin trunk', false, 'DTP face asta, nu CDP.'],
  ], 'Expunere de informații.'),
  multi({ id: '2.3-030' }, 2, 'Ce măsuri reduc expunerea prin CDP/LLDP? (alege trei)', [
    ['no cdp enable pe porturile spre utilizatori', true, 'Oprește anunțurile acolo unde nu e necesar.'],
    ['no lldp transmit și no lldp receive pe porturile externe', true, 'Același principiu pentru LLDP.'],
    ['Păstrezi descoperirea doar pe legăturile dintre echipamentele de infrastructură', true, 'Unde o folosești efectiv.'],
    ['Pornești lldp run pe toate porturile pentru transparență', false, 'Mărește expunerea.'],
    ['Setezi un timer mai mare ca să fie criptat', false, 'Timerul nu criptează.'],
  ], 'Dezactivare selectivă.'),
  single({ id: '2.3-031' }, 2, 'Un vecin non-Cisco este conectat și linkul e up, dar nu apare în „show lldp neighbors”. Ce verifici mai întâi?', [
    ['Că lldp run este activ pe ambele echipamente (LLDP e implicit oprit)', true, 'Fără el nu există tabelă LLDP.'],
    ['Că ai pornit DTP', false, 'DTP nu are legătură.'],
    ['Că VLAN 1 este șters', false, 'Nu poate fi șters și nu e relevant.'],
    ['Că timerul CDP e 60 s', false, 'CDP nu influențează LLDP.'],
  ], 'Prima verificare: LLDP pornit.'),
  single({ id: '2.3-032' }, 3, 'SW-A rulează doar CDP, iar SW-B doar LLDP. Ce vor vedea în tabelele de vecini?', [
    ['Niciunul nu-l vede pe celălalt', true, 'Fiecare trimite și ascultă un alt protocol.'],
    ['Se văd prin CDP', false, 'SW-B nu rulează CDP.'],
    ['Se văd prin LLDP', false, 'SW-A nu rulează LLDP.'],
    ['Se văd doar prin cabluri crossover', false, 'Cablul nu schimbă situația.'],
  ], 'Același protocol pe ambele capete.'),
  { id: '2.3-033', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează verificările când un vecin CDP „lipsește” din tabelă.',
    items: [
      { text: 'Verifici că link-ul fizic este up/up', why: 'Fără link nu se schimbă anunțuri.' },
      { text: 'Verifici că CDP este pornit global (show cdp / cdp run)', why: 'no cdp run oprește tot.' },
      { text: 'Verifici că CDP este activ pe interfață (show cdp interface)', why: 'no cdp enable oprește portul.' },
      { text: 'Verifici că vecinul rulează același protocol (CDP, nu doar LLDP)', why: 'Un echipament non-Cisco poate vorbi doar LLDP.' },
      { text: 'Verifici contoarele (show cdp traffic)', why: 'Arată dacă se primesc cadre.' },
    ],
    explanation: 'Fizic → global → interfață → același protocol → contoare.' },
  single({ id: '2.3-034' }, 2, 'Ce înseamnă „CDP walking”?', [
    ['Citești IP-ul vecinului din show cdp neighbors detail, te conectezi la el și repeți ca să descoperi topologia', true, 'Fiecare echipament arată doar vecinii lui.'],
    ['Pornești un scan automat de porturi', false, 'Nu are legătură.'],
    ['Plimbi un cablu între porturi', false, 'Este despre topologie logică, nu fizică.'],
    ['Activezi CDP doar o dată pe zi', false, 'Nu este un mod de funcționare.'],
  ], 'Detail ⇒ IP ⇒ salt la următorul.'),

  // ======================= CLI și scenarii =======================
  { id: '2.3-035', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Afișează detaliile complete (inclusiv IP-ul) ale vecinilor CDP.',
    prompt: 'SW1#', canonical: 'show cdp neighbors detail', answers: ['show cdp neighbors detail', 'sh cdp nei detail', 'show cdp neighbor detail'], hint: 'show cdp neighbors ...',
    wrong: [
      { text: 'show cdp neighbors', why: 'Arată tabela scurtă, fără IP.' },
      { text: 'show cdp detail', why: 'Nu este sintaxa corectă.' },
      { text: 'show lldp neighbors detail', why: 'Aceasta este varianta LLDP.' },
    ],
    explanation: 'show cdp neighbors detail.' },
  { id: '2.3-036', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Dezactivează CDP pe tot echipamentul (din configurarea globală).',
    prompt: 'SW1(config)#', canonical: 'no cdp run', answers: ['no cdp run'], hint: 'no cdp ...',
    wrong: [
      { text: 'no cdp enable', why: 'Este comanda de interfață.' },
      { text: 'cdp disable', why: 'Nu există.' },
      { text: 'no lldp run', why: 'Oprește LLDP, nu CDP.' },
    ],
    explanation: 'no cdp run.' },
  { id: '2.3-037', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Pornește LLDP pe echipament (din configurarea globală).',
    prompt: 'SW1(config)#', canonical: 'lldp run', answers: ['lldp run'], hint: 'lldp ...',
    wrong: [
      { text: 'lldp enable', why: 'Nu este comanda globală.' },
      { text: 'cdp run', why: 'Pornește CDP.' },
      { text: 'lldp transmit', why: 'Comandă de interfață pentru direcție, nu pornirea globală.' },
    ],
    explanation: 'lldp run.' },
  { id: '2.3-038', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Pe interfața curentă, dezactivează CDP doar pentru acest port.',
    prompt: 'SW1(config-if)#', canonical: 'no cdp enable', answers: ['no cdp enable'], hint: 'no cdp ...',
    wrong: [
      { text: 'no cdp run', why: 'Oprește CDP global, nu pe port.' },
      { text: 'cdp disable', why: 'Nu există.' },
      { text: 'shutdown', why: 'Oprește portul, nu doar CDP.' },
    ],
    explanation: 'no cdp enable pe interfață.' },
  single({ id: '2.3-039' }, 3, 'Pe SW1, show cdp neighbors afișează: „R1 — Local Intrfce Fas 0/24 — Port ID Gig 0/0”. Care afirmație este corectă?', [
    ['Fa0/24 este portul lui SW1, iar Gi0/0 este portul lui R1', true, 'Local = tu, Port ID = vecinul.'],
    ['Fa0/24 este portul lui R1, iar Gi0/0 este portul lui SW1', false, 'Inversat.'],
    ['Ambele porturi sunt pe SW1', false, 'Port ID este al vecinului.'],
    ['Ambele porturi sunt pe R1', false, 'Local Intrfce este al tău.'],
  ], 'Local Intrfce = portul tău.'),
  { id: '2.3-040', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii pentru a activa și a verifica LLDP între SW1 și SW2.',
    items: [
      { text: 'lldp run pe SW1 și pe SW2', why: 'Fără pornire globală LLDP este oprit.' },
      { text: 'Verifici că porturile trimit și primesc (lldp transmit / lldp receive)', why: 'Ambele direcții trebuie active.' },
      { text: 'Aștepți un interval de anunț (implicit ~30 s)', why: 'Anunțurile sunt periodice.' },
      { text: 'show lldp neighbors pe SW1', why: 'Verifici că SW2 apare.' },
      { text: 'show lldp neighbors detail pentru IP și descriere', why: 'Citești TLV-urile opționale.' },
    ],
    explanation: 'Pornire → direcții → așteptare → verificare → detalii.' },
];
