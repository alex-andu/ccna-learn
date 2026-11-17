import type { Question } from '../../lib/types';

// Banca de întrebări pentru 6.3 Describe controller-based, software defined architecture (overlay, underlay, and fabric).
// Sub-puncte: 6.3.a (separarea control/data plane), 6.3.b (API northbound/southbound); restul = '6.3'.
const T = '6.3';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
type Sub = '6.3' | '6.3.a' | '6.3.b';
const single = ({ id, sub = '6.3' }: { id: string; sub?: Sub }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id, sub = '6.3' }: { id: string; sub?: Sub }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id, sub = '6.3' }: { id: string; sub?: Sub }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id, sub = '6.3' }: { id: string; sub?: Sub }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id, sub = '6.3' }: { id: string; sub?: Sub }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_6_3: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '6.3-001' }, 1, 'Care dintre următoarele descrie corect o arhitectură SDN bazată pe controller?', [
    ['Logica de control este centralizată într-un controller, iar echipamentele execută forwarding-ul', true, 'Aceasta este ideea separării planurilor: decizie centralizată, execuție distribuită.'],
    ['Fiecare echipament decide singur, fără niciun punct central', false, 'Aceasta este rețeaua tradițională cu control distribuit.'],
    ['Tot traficul utilizatorilor trece prin controller', false, 'Data plane rămâne pe echipamente; controller-ul nu transportă traficul.'],
    ['Nu mai există echipamente fizice', false, 'Echipamentele rămân pentru forwarding.'],
  ], 'SDN = control centralizat, forwarding distribuit.'),
  single({ id: '6.3-002' }, 1, 'Ce este underlay-ul într-un fabric?', [
    ['Rețeaua de transport (legături, switch-uri/routere, IP și rutare) peste care se construiește overlay-ul', true, 'Underlay = infrastructura de transport.'],
    ['Rețeaua virtuală a gazdelor, creată prin tuneluri', false, 'Aceasta este overlay-ul.'],
    ['Interfața grafică a controller-ului', false, 'GUI este o interfață de management, nu underlay.'],
    ['Un tip de cablu coaxial', false, 'Underlay nu desemnează un tip de cablu.'],
  ], 'Underlay = transport IP.'),
  single({ id: '6.3-003' }, 1, 'Un script Python cere unui controller lista echipamentelor, printr-o cerere HTTPS. Ce tip de API este folosit?', [
    ['Northbound', true, 'Aplicația vorbește „în sus” cu controller-ul.', ],
    ['Southbound', false, 'Southbound este între controller și echipamente.'],
    ['East-west', false, 'East-west este între controller-e/instanțe.'],
    ['Niciunul: nu este un API', false, 'O cerere REST către controller este exact un API northbound.'],
  ], 'Aplicație → controller = northbound.'),

  // ======================= 6.3.a Planuri =======================
  single({ id: '6.3-004', sub: '6.3.a' }, 1, 'Care plan decide încotro trebuie trimise pachetele (construiește tabelele)?', [
    ['Control plane', true, 'Rulează protocoalele care construiesc tabelele de rutare și comutare.'],
    ['Data plane', false, 'Data plane doar execută forwarding-ul pe baza tabelelor.'],
    ['Management plane', false, 'Management plane servește administrării echipamentului.'],
    ['Planul fizic', false, 'Nu este un plan din modelul standard.'],
  ], 'Control plane = decizia.'),
  single({ id: '6.3-005', sub: '6.3.a' }, 2, 'Într-o arhitectură SDN, ce rămâne pe echipamentele de rețea?', [
    ['Data plane (forwarding-ul pachetelor, la viteza liniei)', true, 'Forwarding-ul rămâne în hardware-ul echipamentului.'],
    ['Toată logica de rutare, ca în rețeaua tradițională', false, 'În SDN logica de control este centralizată (în grade diferite).'],
    ['Nimic: echipamentele sunt doar cabluri', false, 'Echipamentele continuă să trimită efectiv pachetele.'],
    ['Doar management plane', false, 'Data plane este tocmai ce rămâne.'],
  ], 'Echipament = data plane.'),
  single({ id: '6.3-006', sub: '6.3.a' }, 2, 'Care este un avantaj al centralizării control plane-ului?', [
    ['Controller-ul are imaginea globală a topologiei și poate lua decizii optime la nivel de rețea', true, 'Vedere globală și politică unică.'],
    ['Fiecare echipament își calculează singur calea, independent', false, 'Aceasta este caracteristica control plane-ului distribuit.'],
    ['Nu mai este nevoie de nicio legătură fizică', false, 'Legăturile rămân necesare.'],
    ['Timpul de forwarding scade la zero', false, 'Forwarding-ul rămâne în hardware; nu este afectat în acest fel.'],
  ], 'Avantaj: vedere globală.'),
  single({ id: '6.3-007', sub: '6.3.a' }, 2, 'Care este un risc al control plane-ului centralizat?', [
    ['Dependența de controller și de conexiunea cu el; un controller compromis poate reprograma rețeaua', true, 'Un punct central înseamnă un punct critic și o țintă de securitate.'],
    ['Echipamentele nu mai pot fi configurate prin SSH', false, 'SSH rămâne disponibil.'],
    ['Creșterea numărului de VLAN-uri disponibile', false, 'Nu are legătură cu centralizarea.'],
    ['Pachetele își schimbă formatul', false, 'Formatul pachetelor nu depinde de modelul de control.'],
  ], 'Riscuri: disponibilitate, scalare, securitate.'),
  single({ id: '6.3-008', sub: '6.3.a' }, 3, 'Care afirmație despre Cisco Catalyst Center este corectă?', [
    ['Este un controller de management/orchestrare; echipamentele clasice își păstrează o parte din control plane', true, 'Nu este un SDN „pur” cu control plane complet centralizat; în SD-Access fabric-ul are control plane propriu (LISP).'],
    ['Preia complet toate protocoalele de rutare de pe echipamente', false, 'Nu înlocuiește OSPF/BGP pe echipamentele clasice.'],
    ['Transportă tot traficul de date al utilizatorilor', false, 'Traficul circulă prin echipamente, nu prin Catalyst Center.'],
    ['Funcționează doar ca server DHCP', false, 'DHCP este doar unul dintre serviciile de rețea; Catalyst Center face management și orchestrare.'],
  ], 'Catalyst Center = management/orchestrare.'),

  // ======================= Overlay / underlay / fabric =======================
  single({ id: '6.3-009' }, 1, 'Ce este un overlay?', [
    ['O rețea virtuală construită peste underlay prin încapsulare (tuneluri)', true, 'Gazdele și segmentele lor trăiesc în overlay.'],
    ['Rețeaua fizică de cabluri', false, 'Aceasta este stratul fizic/underlay.'],
    ['O aplicație de monitorizare', false, 'Nu este o aplicație, ci o rețea logică.'],
    ['Un protocol de rutare', false, 'Overlay nu desemnează un protocol de rutare.'],
  ], 'Overlay = rețea virtuală prin tuneluri.'),
  single({ id: '6.3-010' }, 2, 'Ce este un fabric?', [
    ['Underlay + overlay administrate ca un singur sistem', true, 'Include nodurile, rutarea de transport și rețeaua virtuală.'],
    ['Doar rețeaua virtuală, fără underlay', false, 'Overlay-ul nu poate exista fără underlay.'],
    ['Doar un switch cu multe porturi', false, 'Fabric-ul este un sistem de noduri, nu un singur switch.'],
    ['O țesătură din fibră optică', false, 'Termenul nu se referă la material.'],
  ], 'Fabric = underlay + overlay.'),
  single({ id: '6.3-011' }, 2, 'Ce adrese rutează routerele intermediare din underlay?', [
    ['Adresele exterioare ale nodurilor (de exemplu loopback/RLOC), nu adresele gazdelor din overlay', true, 'Gazdele sunt ascunse în interiorul pachetului încapsulat.'],
    ['Adresele tuturor gazdelor din overlay', false, 'Exact acest lucru evită un overlay: underlay-ul rămâne simplu.'],
    ['Doar adresele MAC ale gazdelor', false, 'Underlay-ul L3 rutează adrese IP.'],
    ['Niciuna: underlay-ul nu rutează', false, 'Underlay-ul rutat IP trebuie să ducă pachetele între noduri.'],
  ], 'Underlay: doar infrastructura.'),
  single({ id: '6.3-012' }, 2, 'Ce port UDP folosește VXLAN (destinație)?', [
    ['4789', true, 'Portul UDP destinație alocat pentru VXLAN.'],
    ['4500', false, 'UDP 4500 este NAT-T pentru IPsec.'],
    ['830', false, '830 este portul NETCONF (TCP).'],
    ['161', false, '161 este SNMP.'],
  ], 'VXLAN = UDP 4789.'),
  single({ id: '6.3-013' }, 2, 'Câți biți are identificatorul de segment VXLAN (VNI) și ce înseamnă asta?', [
    ['24 de biți, adică ≈16 milioane de segmente', true, '2^24 ≈ 16,7 milioane, față de 4094 la VLAN.'],
    ['12 biți, adică 4094 de segmente', false, 'Aceasta este valoarea VLAN-ului 802.1Q.'],
    ['8 biți, adică 256 de segmente', false, 'Nu este dimensiunea VNI.'],
    ['64 de biți', false, 'Nu este dimensiunea VNI.'],
  ], 'VNI = 24 biți.'),
  single({ id: '6.3-014' }, 2, 'Ce tehnologii folosește SD-Access pentru control plane și data plane?', [
    ['LISP pentru control plane și VXLAN pentru data plane', true, 'LISP ține corespondența identitate → locație; VXLAN încapsulează traficul.'],
    ['OSPF pentru control plane și GRE pentru data plane', false, 'OSPF poate fi în underlay, dar SD-Access folosește LISP/VXLAN în fabric.'],
    ['STP pentru control plane și Telnet pentru data plane', false, 'Nu sunt componente ale fabric-ului.'],
    ['RIP pentru ambele', false, 'RIP nu are acest rol.'],
  ], 'SD-Access: LISP + VXLAN (+ SGT).'),
  single({ id: '6.3-015' }, 2, 'Ce rol are SGT (Scalable Group Tag) în SD-Access?', [
    ['Etichetează traficul cu grupul sursei, ca politicile să se bazeze pe grupuri, nu pe IP-uri', true, 'Politica spune ce grup poate comunica cu ce alt grup.'],
    ['Criptează conținutul pachetelor', false, 'SGT este o etichetă de politică, nu o metodă de criptare.'],
    ['Alocă adrese IP gazdelor', false, 'Aceasta este DHCP.'],
    ['Stabilește costul OSPF', false, 'Nu are legătură cu rutarea.'],
  ], 'SGT = grup pentru politică.'),

  // ======================= 6.3.b API-uri =======================
  single({ id: '6.3-016', sub: '6.3.b' }, 1, 'Încotro este orientat un API northbound?', [
    ['Spre aplicații și automatizări', true, 'Northbound = în sus, spre cei care consumă serviciile controller-ului.'],
    ['Spre echipamentele de rețea', false, 'Aceasta este direcția southbound.'],
    ['Spre cabluri', false, 'Nu este o direcție de API.'],
    ['Spre alt controller exclusiv', false, 'Comunicarea între controller-e este east-west.'],
  ], 'Northbound = spre aplicații.'),
  single({ id: '6.3-017', sub: '6.3.b' }, 2, 'Care dintre următoarele este, de obicei, un protocol southbound?', [
    ['NETCONF', true, 'Controller-ul îl folosește ca să configureze echipamente.'],
    ['REST peste HTTPS către o aplicație', false, 'REST este tipic northbound.'],
    ['HTML', false, 'Nu este un protocol de management către echipamente.'],
    ['DNS', false, 'DNS rezolvă nume.'],
  ], 'NETCONF = southbound.'),
  single({ id: '6.3-018', sub: '6.3.b' }, 2, 'Pe ce transport și port rulează NETCONF?', [
    ['SSH, TCP 830', true, 'NETCONF folosește mesaje XML peste SSH.'],
    ['HTTP, TCP 80', false, 'NETCONF nu folosește HTTP.'],
    ['UDP 161', false, 'UDP 161 este SNMP.'],
    ['UDP 514', false, 'UDP 514 este syslog.'],
  ], 'NETCONF = SSH 830, XML.'),
  single({ id: '6.3-019', sub: '6.3.b' }, 2, 'Care este diferența principală dintre NETCONF și RESTCONF?', [
    ['NETCONF folosește XML peste SSH; RESTCONF folosește HTTPS cu metode HTTP și JSON/XML', true, 'Ambele folosesc modele YANG, dar cu transporturi și stiluri diferite.'],
    ['NETCONF este nesigur, RESTCONF este criptat', false, 'Ambele sunt securizate (SSH, respectiv TLS).'],
    ['RESTCONF nu folosește modele YANG', false, 'RESTCONF folosește aceleași modele YANG.'],
    ['Sunt același protocol', false, 'Sunt protocoale distincte.'],
  ], 'Același model YANG, transport diferit.'),
  single({ id: '6.3-020', sub: '6.3.b' }, 2, 'Ce este YANG?', [
    ['Un limbaj de modelare a datelor care descrie structura configurației și stării echipamentelor', true, 'Este „schema” folosită de NETCONF/RESTCONF.'],
    ['Un protocol de transport', false, 'YANG nu transportă date; le descrie.'],
    ['Un tip de cablu', false, 'Nu are legătură cu cablarea.'],
    ['Un algoritm de criptare', false, 'Nu este un algoritm criptografic.'],
  ], 'YANG = model de date.'),
  single({ id: '6.3-021', sub: '6.3.b' }, 2, 'Ce face OpenFlow?', [
    ['Permite controller-ului să programeze tabelele de flux ale unui switch (potrivire → acțiune)', true, 'Este un protocol southbound SDN care separă control plane de data plane.'],
    ['Cripteaza Wi-Fi-ul', false, 'Securitatea Wi-Fi este la 5.9.'],
    ['Atribuie adrese IP prin DHCP', false, 'DHCP este alt protocol.'],
    ['Sincronizează ceasul', false, 'Aceasta este NTP.'],
  ], 'OpenFlow = tabele de flux.'),

  // ======================= Config / verificare =======================
  single({ id: '6.3-022' }, 2, 'Ce condiție trebuie îndeplinită ca un tunel GRE să treacă în „up”?', [
    ['Adresa de destinație a tunelului trebuie să fie accesibilă în tabela de rutare (underlay)', true, 'Fără rută către destinație, tunelul nu se ridică.'],
    ['Adresa de destinație trebuie să fie în aceeași rețea cu LAN-ul gazdei', false, 'Destinația este o adresă de underlay, nu din LAN.'],
    ['Trebuie activat VXLAN', false, 'GRE nu necesită VXLAN.'],
    ['Trebuie dezactivat OSPF', false, 'OSPF poate fi exact modul în care se învață destinația.'],
  ], 'Destinația tunelului trebuie rutabilă.'),
  single({ id: '6.3-023' }, 2, 'De ce se folosește adesea o interfață loopback ca sursă/destinație a tunelului?', [
    ['Este o adresă stabilă, care rămâne accesibilă și dacă o legătură fizică cade', true, 'Loopback-ul nu depinde de o singură interfață fizică.'],
    ['Pentru că loopback-ul are bandă mai mare', false, 'Loopback-ul nu are legătură cu banda.'],
    ['Pentru că tunelurile nu pot folosi interfețe fizice', false, 'Pot folosi interfețe fizice; loopback-ul este o bună practică.'],
    ['Pentru că loopback-ul criptează traficul', false, 'Loopback nu criptează.'],
  ], 'Loopback = endpoint stabil.'),
  single({ id: '6.3-024' }, 2, 'Ce trebuie activat, pe lângă comanda restconf, ca RESTCONF să funcționeze pe IOS XE?', [
    ['Serverul HTTPS (ip http secure-server) și un cont cu privilegii', true, 'RESTCONF rulează peste HTTPS și cere autentificare.'],
    ['Telnet', false, 'Telnet nu este necesar și este nesigur.'],
    ['Un server DHCP', false, 'DHCP nu este o precondiție.'],
    ['STP în mod PVST', false, 'STP nu are legătură.'],
  ], 'RESTCONF: HTTPS + utilizator.'),

  // ======================= Multi =======================
  multi({ id: '6.3-025' }, 2, 'Care sunt caracteristici ale unui underlay? (alege toate variantele corecte)', [
    ['Rutat la nivel IP între noduri', true, 'Transportă pachetele exterioare între nodurile fabric-ului.'],
    ['Stabil și simplu, schimbat rar', true, 'Serviciile flexibile sunt la nivel de overlay.'],
    ['Nu cunoaște adresele gazdelor din overlay', true, 'Vede doar antetele exterioare ale pachetelor încapsulate.'],
    ['Conține segmentele virtuale ale utilizatorilor', false, 'Segmentele virtuale sunt în overlay.'],
  ], 'Underlay: IP rutat, stabil, ignorant de overlay.'),
  multi({ id: '6.3-026' }, 2, 'Care dintre acestea pot fi folosite pentru a construi un overlay? (alege toate variantele corecte)', [
    ['VXLAN', true, 'Încapsulează cadre L2 în UDP peste IP.'],
    ['GRE', true, 'Încapsulare simplă peste IP; folosită și în laborator.'],
    ['IPsec (în mod tunel)', true, 'Un tunel criptat este tot un tip de overlay.'],
    ['CDP', false, 'CDP este un protocol de descoperire a vecinilor.'],
  ], 'VXLAN, GRE, IPsec.'),
  multi({ id: '6.3-027' }, 2, 'Care dintre acestea sunt exemple de interfețe/protocoale southbound? (alege toate variantele corecte)', [
    ['NETCONF', true, 'Configurare programatică a echipamentelor.'],
    ['RESTCONF', true, 'Același tip de acces, prin HTTPS.'],
    ['SNMP', true, 'Folosit și de controller-e pentru inventar și monitorizare.'],
    ['Intent API REST expus aplicațiilor', false, 'Aceasta este o interfață northbound.'],
  ], 'Northbound spre aplicații, southbound spre echipamente.'),

  // ======================= Match / Order =======================
  match({ id: '6.3-028' }, 2, 'Potrivește rolul din SD-Access cu funcția lui.', [
    { left: 'Fabric edge node', right: 'Conectează gazdele; încapsulează/decapsulează VXLAN', why: 'Este VTEP-ul de la margine.' },
    { left: 'Fabric border node', right: 'Conectează fabric-ul cu exteriorul (WAN, Internet, data center)', why: 'Face legătura cu lumea din afara fabric-ului.' },
    { left: 'Control plane node', right: 'Ține corespondența gazdă → locație (LISP map-server/resolver)', why: 'Edge-urile îl interoghează.' },
    { left: 'Intermediate node', right: 'Transportă IP între noduri, fără să cunoască overlay-ul', why: 'Face parte doar din underlay.' },
  ], [
    { text: 'Stochează parolele utilizatorilor', why: 'Nu este un rol de fabric.' },
    { text: 'Convertește voce în date', why: 'Nu are legătură cu rolurile fabric.' },
  ], 'Edge, border, control plane, intermediate.'),
  match({ id: '6.3-029' }, 2, 'Potrivește protocolul cu transportul/portul lui.', [
    { left: 'NETCONF', right: 'SSH, TCP 830', why: 'Mesaje XML peste SSH.' },
    { left: 'RESTCONF', right: 'HTTPS (TLS), metode HTTP', why: 'Stil REST peste HTTPS.' },
    { left: 'VXLAN', right: 'UDP 4789', why: 'Încapsulare în UDP.' },
    { left: 'OpenFlow', right: 'TCP 6653', why: 'Conexiune controller-switch.' },
  ], [
    { text: 'UDP 161', why: 'Este SNMP.' },
    { text: 'UDP 514', why: 'Este syslog.' },
  ], 'NETCONF 830 · RESTCONF HTTPS · VXLAN 4789 · OpenFlow 6653.'),
  order({ id: '6.3-030' }, 3, 'Ordonează drumul unui pachet între două gazde printr-un fabric VXLAN.', [
    { text: 'Gazda A trimite pachetul obișnuit către nodul edge', why: 'Gazda nu știe de fabric.' },
    { text: 'Nodul edge află locația destinației și încapsulează pachetul (VXLAN în UDP în IP)', why: 'Se adaugă antetele exterioare.' },
    { text: 'Underlay-ul rutează pachetul exterior către nodul edge de ieșire', why: 'Routerele văd doar IP-ul exterior.' },
    { text: 'Nodul edge de ieșire decapsulează pachetul', why: 'Antetele exterioare sunt eliminate.' },
    { text: 'Gazda B primește pachetul original', why: 'Overlay-ul este transparent pentru gazde.' },
  ], 'Gazdă → encapsulare → underlay → decapsulare → gazdă.'),
  order({ id: '6.3-031' }, 2, 'Ordonează pașii construirii unui overlay GRE peste un underlay OSPF în laborator.', [
    { text: 'Configurezi adresele și loopback-urile', why: 'Ai nevoie de adrese înainte de rutare.' },
    { text: 'Configurezi OSPF în underlay și verifici rutele către loopback-uri', why: 'Destinația tunelului trebuie rutabilă.' },
    { text: 'Creezi interfața tunnel (source, destination, adresă)', why: 'Abia acum există un transport pe care să-l încapsulezi.' },
    { text: 'Adaugi rutele care trimit LAN-urile prin tunel', why: 'Trafic din overlay către next hop-ul din tunel.' },
    { text: 'Verifici cu ping, traceroute și show interfaces tunnel', why: 'Confirmi funcționarea.' },
  ], 'Underlay întâi, apoi tunelul, apoi rutele prin tunel.'),

  // ======================= Scenarii =======================
  single({ id: '6.3-032' }, 3, 'Ping-ul între gazde prin overlay merge, dar un transfer de fișier mare se blochează. Care este o cauză probabilă?', [
    ['MTU: încapsularea adaugă antete, iar pachetele mari depășesc MTU-ul underlay-ului', true, 'Pachetele mici trec, cele mari sunt fragmentate sau pierdute.'],
    ['OSPF nu este configurat', false, 'Fără OSPF nici ping-ul nu ar funcționa.'],
    ['Cablurile sunt prea lungi', false, 'Ar afecta și pachetele mici.'],
    ['Adresele sunt duplicate', false, 'Ar produce simptome diferite.'],
  ], 'MTU și overhead de încapsulare.'),
  single({ id: '6.3-033' }, 2, 'Pe R1, traceroute către LAN-ul din spatele tunelului arată doar două salturi, deși între R1 și R4 sunt două routere. Ce ilustrează?', [
    ['Pachetul este încapsulat: routerele din underlay nu sunt vizibile în overlay', true, 'TTL-ul pachetului original nu scade în underlay; tunelul apare ca un singur salt.'],
    ['R2 și R3 sunt defecte', false, 'Funcționează, dar sunt invizibile pentru pachetul original.'],
    ['OSPF a rutat greșit', false, 'Nu este o eroare de rutare.'],
    ['Traceroute nu funcționează cu IP', false, 'Funcționează; rezultatul este normal pentru tuneluri.'],
  ], 'Tunelul ascunde saltul din underlay.'),

  // ======================= CLI =======================
  cli({ id: '6.3-034' }, 1, 'În global configuration mode: creează interfața tunnel 0.', 'R1(config)#', 'interface tunnel 0', ['interface tunnel 0', 'int tunnel 0', 'int tu 0'], [
    { text: 'tunnel 0', why: 'Lipsește cuvântul interface.' },
    { text: 'interface tun0 create', why: 'Nu există parametrul create.' },
    { text: 'create interface tunnel 0', why: 'Sintaxa IOS nu începe cu create.' },
  ], 'interface tunnel <număr>.', 'interface …'),
  cli({ id: '6.3-035' }, 2, 'În config-if pe Tunnel0: folosește Loopback0 ca sursă a tunelului.', 'R1(config-if)#', 'tunnel source loopback 0', ['tunnel source loopback 0', 'tunnel source Loopback0', 'tunnel source loopback0'], [
    { text: 'tunnel destination loopback 0', why: 'destination primește adresa capătului îndepărtat, nu o interfață locală.' },
    { text: 'source tunnel loopback 0', why: 'Ordinea cuvintelor este greșită.' },
    { text: 'tunnel source 1.1.1.1/32', why: 'Sintaxa IOS nu acceptă prefix (/32) aici; adresa s-ar scrie fără mască, iar cerința era să folosești interfața Loopback0.' },
  ], 'tunnel source <interfață|adresă>.', 'tunnel …'),
  cli({ id: '6.3-036' }, 2, 'În config-if pe Tunnel0: setează destinația tunelului la 4.4.4.4.', 'R1(config-if)#', 'tunnel destination 4.4.4.4', ['tunnel destination 4.4.4.4'], [
    { text: 'tunnel destination 4.4.4.4 255.255.255.255', why: 'Comanda primește doar adresa, fără mască.' },
    { text: 'destination 4.4.4.4', why: 'Lipsește cuvântul tunnel.' },
    { text: 'tunnel dest-ip 4.4.4.4', why: 'Nu este sintaxa IOS.' },
  ], 'tunnel destination <adresă>.', 'tunnel destination …'),
  cli({ id: '6.3-037' }, 1, 'În privileged EXEC: afișează starea și parametrii interfeței Tunnel0.', 'R1#', 'show interfaces tunnel 0', ['show interfaces tunnel 0', 'show interface tunnel 0', 'show int tunnel 0', 'show int tu 0'], [
    { text: 'show tunnel 0', why: 'Nu este comanda corectă pentru starea interfeței.' },
    { text: 'show ip tunnel', why: 'Nu este o comandă standard IOS.' },
    { text: 'show running-config interface tunnel', why: 'Arată configurația, nu starea (up/down, sursă/destinație efective).' },
  ], 'show interfaces tunnel <n>.', 'show interfaces …'),
  cli({ id: '6.3-038' }, 2, 'În global configuration mode pe IOS XE: activează interfața RESTCONF.', 'Switch(config)#', 'restconf', ['restconf'], [
    { text: 'netconf-yang', why: 'Activează NETCONF (SSH), nu RESTCONF.' },
    { text: 'ip restconf', why: 'Comanda nu are prefixul ip.' },
    { text: 'ip http secure-server', why: 'Pornește HTTPS, necesar pentru RESTCONF, dar nu activează RESTCONF.' },
  ], 'restconf (plus ip http secure-server).', 'rest…'),

  // ======================= Recunoaștere finală =======================
  single({ id: '6.3-039', sub: '6.3.b' }, 2, 'Un portal de tichete creează o politică de acces cerând controller-ului prin REST. Ce direcție de API este?', [
    ['Northbound', true, 'Aplicația cere un serviciu controller-ului.'],
    ['Southbound', false, 'Southbound este între controller și echipamente.'],
    ['Niciuna', false, 'Este un API northbound clasic.'],
    ['Peer-to-peer între echipamente', false, 'Nu este comunicare între echipamente.'],
  ], 'Aplicație → controller = northbound.'),
  single({ id: '6.3-040', sub: '6.3.b' }, 2, 'Controller-ul citește contoarele unui router prin SNMP. Ce direcție de API este?', [
    ['Southbound', true, 'Controller-ul vorbește cu echipamentul.'],
    ['Northbound', false, 'Northbound este spre aplicații.'],
    ['Niciuna: SNMP nu este API', false, 'SNMP este una dintre interfețele de management folosite southbound.'],
    ['East-west', false, 'East-west este între controller-e.'],
  ], 'Controller → echipament = southbound.'),
];
