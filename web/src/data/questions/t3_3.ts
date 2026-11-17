import type { Question } from '../../lib/types';

// Banca de întrebări pentru 3.3 Configure and verify IPv4 and IPv6 static routing.
// Sub-puncte oficiale: a default route · b network route · c host route · d floating static. Fiecare variantă are explicație (why).
const T = '3.3';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, sub: string, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_3_3: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '3.3-001' }, '3.3', 1, 'Ce este o rută statică?', [
    ['O rută scrisă manual de administrator, care nu se schimbă singură', true, 'Aceasta este definiția: nu e învățată de la vecini și nu se adaptează la schimbări.'],
    ['O rută învățată automat de la un vecin prin OSPF', false, 'Aceea este o rută dinamică; are alt cod (O) și alt AD.'],
    ['O rută care apare automat pentru fiecare interfață activă', false, 'Aceea e ruta connected (C), nu o rută statică.'],
    ['O rută care nu poate fi ștearsă fără reload', false, 'Se șterge oricând cu no ip route.'],
  ], 'Statica = configurată manual.'),
  single({ id: '3.3-002' }, '3.3', 2, 'Pe o legătură Ethernet, care formă de rută statică este recomandată?', [
    ['Cu adresa next hop (sau interfață + next hop)', true, 'Routerul face un singur ARP, pentru next hop, și nu depinde de proxy ARP.'],
    ['Doar cu interfața de ieșire', false, 'Funcționează doar prin proxy ARP și umple tabela ARP cu o intrare pe destinație.'],
    ['Doar cu adresa de destinație, fără next hop', false, 'Comanda cere obligatoriu un next hop și/sau o interfață.'],
    ['Nu se folosesc rute statice pe Ethernet', false, 'Se folosesc frecvent; contează doar forma.'],
  ], 'Next hop IP sau fully specified.'),
  single({ id: '3.3-003' }, '3.3', 2, 'O rută statică este în running-config, dar nu apare în show ip route. Care cauză este probabilă?', [
    ['Next hop-ul nu e accesibil sau interfața de ieșire e down', true, 'Routerul instalează ruta doar dacă next hop-ul se rezolvă printr-o rută existentă / interfața e up.'],
    ['Masca a fost scrisă în format zecimal', false, 'Formatul zecimal este cel corect pentru ip route.'],
    ['Ruta are AD 1', false, 'AD 1 este valoarea implicită, nu o problemă.'],
    ['Rutele statice apar doar după copy run start', false, 'Apar imediat în tabelă dacă sunt valide.'],
  ], 'Rută nevalidă: next hop inaccesibil.'),
  multi({ id: '3.3-004' }, '3.3', 2, 'Care sunt avantaje ale rutelor statice față de protocoalele dinamice? (alege toate corecte)', [
    ['Nu consumă lățime de bandă pentru mesaje de protocol', true, 'Nu există hello-uri sau actualizări.'],
    ['Sunt previzibile: traficul merge exact unde ai scris', true, 'Nu există recalculări automate.'],
    ['Se adaptează automat când un link cade', false, 'Acesta e dezavantajul: nu se adaptează (în afară de retragerea la interfață down).'],
    ['Sunt ușor de întreținut în rețele cu zeci de routere', false, 'Dimpotrivă: mentenanța manuală devine imposibilă la scară mare.'],
  ], 'Simple și previzibile, dar manuale.'),

  // ======================= 3.3.a — Default route =======================
  single({ id: '3.3-005' }, '3.3.a', 1, 'Care comandă configurează o rută implicită IPv4 către 203.0.113.1?', [
    ['ip route 0.0.0.0 0.0.0.0 203.0.113.1', true, 'Prefix 0.0.0.0 cu mască 0.0.0.0 = lungime 0: se potrivește cu orice.'],
    ['ip route 0.0.0.0 255.255.255.255 203.0.113.1', false, 'Aceea e o rută de gazdă pentru adresa 0.0.0.0.'],
    ['ip route 203.0.113.1 0.0.0.0 0.0.0.0', false, 'Argumentele sunt inversate: destinația vine prima, next hop ultimul.'],
    ['ip default-route 203.0.113.1', false, 'Nu există o astfel de comandă pe router.'],
  ], 'Rută implicită = 0.0.0.0/0.'),
  single({ id: '3.3-006' }, '3.3.a', 1, 'Care este echivalentul IPv6 al rutei implicite 0.0.0.0/0?', [
    ['::/0', true, 'Prefix de lungime 0 în IPv6.'],
    ['::1/128', false, 'Este adresa de loopback, o rută de gazdă.'],
    ['fe80::/10', false, 'Este prefixul adreselor link-local.'],
    ['2000::/3', false, 'Este spațiul global unicast, nu o rută implicită.'],
  ], '::/0.'),
  multi({ id: '3.3-007' }, '3.3.a', 2, 'Care afirmații despre o rută implicită sunt adevărate? (alege toate corecte)', [
    ['Se potrivește cu orice adresă de destinație', true, 'Fiind /0, toți biții sunt ignorați la comparare.'],
    ['Este folosită doar dacă nu există o rută mai specifică', true, 'Longest prefix match: lungimea 0 este cea mai slabă potrivire.'],
    ['Are AD 1 dacă este statică', true, 'Aceeași valoare implicită ca la orice rută statică.'],
    ['Bate orice altă rută din tabelă', false, 'Dimpotrivă: orice rută mai specifică o bate.'],
  ], 'Ultima alegere, AD 1.'),
  single({ id: '3.3-008' }, '3.3.a', 2, 'Ce înseamnă codul S* în show ip route?', [
    ['Rută statică candidată ca rută implicită (gateway of last resort)', true, 'S = statică, * = candidată ca rută implicită.'],
    ['Rută statică flotantă', false, 'O flotantă apare ca S normal, doar când se instalează.'],
    ['Rută statică redistribuită în OSPF', false, 'Redistribuirea nu e marcată cu *.'],
    ['Rută statică învățată de la ISP prin DHCP', false, 'Nu are legătură cu DHCP; * marchează doar candidatul de implicită.'],
  ], 'S* = implicită statică.'),
  single({ id: '3.3-009' }, '3.3.a', 2, 'R1 are S* 0.0.0.0/0 via ISP și S 10.20.0.0/16 via R2. Încotro merge un pachet pentru 10.20.4.4?', [
    ['Spre R2, prin ruta /16', true, '/16 este mai specifică decât /0 (longest prefix match).'],
    ['Spre ISP, prin ruta implicită', false, 'Implicita se folosește doar când nu există altceva mai specific.'],
    ['Pe ambele, în paralel', false, 'ECMP presupune același prefix.'],
    ['Pachetul e aruncat', false, 'Există rută potrivită (două chiar).'],
  ], 'Specific bate implicit.'),
  single({ id: '3.3-010' }, '3.3.a', 2, 'Ai configurat ipv6 route ::/0 2001:db8:0:1::1, dar routerul nu transmite pachete IPv6 între interfețe. Ce lipsește?', [
    ['ipv6 unicast-routing', true, 'Fără această comandă globală routerul nu rutează IPv6, deși acceptă comanda ipv6 route.'],
    ['ip routing', false, 'Aceea e pentru IPv4 și e activă implicit.'],
    ['ipv6 enable pe fiecare PC', false, 'Nu are legătură cu rutarea pe router.'],
    ['no ipv6 cef', false, 'CEF nu e cauza; dezactivarea lui nu activează rutarea.'],
  ], 'ipv6 unicast-routing.'),
  { id: '3.3-011', topicId: T, sub: '3.3.a', type: 'cli', difficulty: 1,
    stem: 'Configurează pe R1 o rută implicită IPv4 cu next hop 203.0.113.1.',
    prompt: 'R1(config)#', canonical: 'ip route 0.0.0.0 0.0.0.0 203.0.113.1', answers: ['ip route 0.0.0.0 0.0.0.0 203.0.113.1'], hint: 'prefix 0.0.0.0, mască 0.0.0.0',
    wrong: [
      { text: 'ip route 0.0.0.0 255.255.255.255 203.0.113.1', why: 'Masca 255.255.255.255 face din ea o rută de gazdă pentru adresa 0.0.0.0.' },
      { text: 'ip route 203.0.113.1 0.0.0.0 0.0.0.0', why: 'Destinația și next hop-ul sunt inversate.' },
      { text: 'ipv6 route ::/0 203.0.113.1', why: 'Comanda e pentru IPv6; 203.0.113.1 nu este o adresă IPv6.' },
    ],
    explanation: 'Implicita IPv4 este 0.0.0.0 0.0.0.0 și next hop-ul.' },

  // ======================= 3.3.b — Network route =======================
  single({ id: '3.3-012' }, '3.3.b', 1, 'PC1 (LAN R1) dă ping către PC2 (LAN R2). R1 are ruta către LAN-ul lui R2, dar R2 nu are ruta către LAN-ul lui R1. Ce vede PC1?', [
    ['Request timed out', true, 'Cererea ajunge la PC2, dar R2 nu poate întoarce răspunsul și îl aruncă.'],
    ['Reply from PC2', false, 'Răspunsul nu are cum ajunge înapoi fără ruta de întoarcere.'],
    ['Destination host unreachable de la R1', false, 'R1 are ruta dus, deci o transmite; unreachable ar apărea dacă lipsea ea.'],
    ['TTL expired in transit', false, 'Nu există o buclă de rutare în scenariu.'],
  ], 'Rută de întoarcere lipsă ⇒ timeout.'),
  single({ id: '3.3-013' }, '3.3.b', 2, 'PC1 primește „Destination host unreachable” de la 192.168.10.1 (R1). Care este cauza cea mai probabilă?', [
    ['R1 nu are nicio rută potrivită pentru destinație', true, 'Routerul care nu găsește rută aruncă pachetul și trimite ICMP unreachable sursei.'],
    ['Lipsește ruta de întoarcere pe R2', false, 'Ar produce timeout, nu mesaj de unreachable de la R1.'],
    ['PC2 are firewall pornit', false, 'Ar produce timeout, nu un mesaj de la R1.'],
    ['Cablul dintre R1 și R2 e inversat', false, 'Un cablu greșit ar face interfața down, ceea ce poate sta în spatele lipsei rutei, dar mesajul în sine indică lipsa unei rute pe R1.'],
  ], 'Unreachable ⇒ rută lipsă pe routerul care îl trimite.'),
  single({ id: '3.3-014' }, '3.3.b', 2, 'Care comandă configurează corect o rută către rețeaua 192.168.20.0/24 prin 10.0.12.2?', [
    ['ip route 192.168.20.0 255.255.255.0 10.0.12.2', true, 'Adresa de rețea, masca zecimală și next hop-ul.'],
    ['ip route 192.168.20.0/24 10.0.12.2', false, 'ip route nu acceptă notația /24 (la IPv6 se folosește, la ip route nu).'],
    ['ip route 192.168.20.5 255.255.255.0 10.0.12.2', false, 'Are biți de gazdă nenuli: IOS respinge comanda cu „Inconsistent address and mask”.'],
    ['ip route 10.0.12.2 192.168.20.0 255.255.255.0', false, 'Ordinea argumentelor este greșită.'],
  ], 'rețea mască next hop.'),
  single({ id: '3.3-015' }, '3.3.b', 3, 'De ce este slabă pe Ethernet o rută statică scrisă doar cu interfața de ieșire?', [
    ['Routerul face ARP pentru fiecare destinație și depinde de proxy ARP la celălalt capăt', true, 'Ruta e tratată ca „directly connected”, deci destinația e căutată direct pe segment.'],
    ['Ruta nu apare în tabelă', false, 'Apare, ca „directly connected”, cu cod S.'],
    ['AD-ul devine 0', false, 'Rămâne 1, cu cod S.'],
    ['Nu se poate folosi pe interfețe Gigabit', false, 'Nu există o astfel de restricție.'],
  ], 'Doar interfață ⇒ ARP pentru fiecare destinație.'),
  single({ id: '3.3-016' }, '3.3.b', 3, 'Care este ruta statică de rezumat pentru 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24 și 192.168.3.0/24, toate în spatele aceluiași next hop?', [
    ['192.168.0.0 255.255.252.0', true, 'Primii 22 de biți sunt comuni; /22 acoperă 192.168.0.0–192.168.3.255.'],
    ['192.168.0.0 255.255.255.0', false, 'Acoperă doar prima subrețea.'],
    ['192.168.0.0 255.255.254.0', false, 'Un /23 acoperă doar două subrețele (192.168.0 și 192.168.1).'],
    ['192.168.0.0 255.255.248.0', false, 'Un /21 acoperă și 192.168.4–192.168.7, care nu sunt în spatele acelui next hop.'],
  ], 'Rezumat exact: /22.'),
  multi({ id: '3.3-017' }, '3.3.b', 2, 'Când nu se instalează o rută statică în tabelă? (alege toate corecte)', [
    ['Next hop-ul nu e accesibil printr-o rută existentă', true, 'Căutarea recursivă eșuează.'],
    ['Interfața de ieșire este down', true, 'Ruta este retrasă cât timp interfața nu e up/up.'],
    ['Aceeași destinație există cu un AD mai mic din altă sursă', true, 'Cea cu AD mai mic intră în tabelă.'],
    ['Comanda a fost introdusă după ora 18:00', false, 'Ora nu are legătură.'],
  ], 'Next hop inaccesibil, interfață down sau AD pierzător.'),
  { id: '3.3-018', topicId: T, sub: '3.3', type: 'match', difficulty: 1,
    stem: 'Potrivește tipul de rută statică cu comanda care o exemplifică.',
    leftLabel: 'Tip', rightLabel: 'Comandă',
    pairs: [
      { left: 'Default route', right: 'ip route 0.0.0.0 0.0.0.0 203.0.113.1', why: 'Prefix /0: se potrivește cu orice.' },
      { left: 'Network route', right: 'ip route 10.2.0.0 255.255.0.0 10.1.1.2', why: 'O rețea întreagă, cu masca ei.' },
      { left: 'Host route', right: 'ip route 10.2.2.2 255.255.255.255 10.1.1.2', why: 'Mască /32: o singură adresă.' },
      { left: 'Floating static', right: 'ip route 10.2.0.0 255.255.0.0 10.9.9.2 130', why: 'AD mărit (130) la sfârșit: rută de rezervă.' },
    ],
    distractors: [{ text: 'router ospf 1', why: 'Pornește un protocol dinamic, nu o rută statică.' }],
    explanation: 'Fiecare tip are o formă caracteristică.' },
  { id: '3.3-019', topicId: T, sub: '3.3.b', type: 'cli', difficulty: 2,
    stem: 'Configurează pe R1 o rută către 192.168.20.0/24 cu next hop 10.0.12.2.',
    prompt: 'R1(config)#', canonical: 'ip route 192.168.20.0 255.255.255.0 10.0.12.2', answers: ['ip route 192.168.20.0 255.255.255.0 10.0.12.2'], hint: 'ip route <rețea> <mască> <next hop>',
    wrong: [
      { text: 'ip route 192.168.20.0 0.0.0.255 10.0.12.2', why: 'Wildcard mask se folosește în OSPF/ACL, nu la ip route.' },
      { text: 'ip route 10.0.12.2 192.168.20.0 255.255.255.0', why: 'Ordinea argumentelor este greșită: destinația vine prima.' },
      { text: 'ip route 192.168.20.0 255.255.255.0', why: 'Lipsește next hop-ul sau interfața de ieșire; comanda e incompletă.' },
    ],
    explanation: 'Sintaxa: ip route rețea mască next hop.' },
  single({ id: '3.3-020' }, '3.3.b', 2, 'Care este AD-ul implicit al unei rute statice configurate doar cu interfața de ieșire?', [
    ['1', true, 'Cu next hop sau cu interfață, AD implicit este tot 1; ruta arată „directly connected”, dar are cod S.'],
    ['0', false, '0 este AD-ul rutelor connected reale.'],
    ['110', false, 'Aceea este valoarea OSPF.'],
    ['5', false, 'Nu există o astfel de valoare implicită; 5 e AD pentru EIGRP summary.'],
  ], 'AD implicit 1.'),

  // ======================= 3.3.c — Host route =======================
  single({ id: '3.3-021' }, '3.3.c', 1, 'Care mască o folosești la o rută de gazdă IPv4?', [
    ['255.255.255.255', true, 'Toți cei 32 de biți trebuie să coincidă: o singură adresă.'],
    ['255.255.255.0', false, 'Este un /24, adică 254 de adrese de gazdă.'],
    ['0.0.0.0', false, 'Aceea este masca rutei implicite.'],
    ['255.255.255.252', false, 'Este un /30, cu 2 adrese utilizabile.'],
  ], '/32.'),
  single({ id: '3.3-022' }, '3.3.c', 1, 'Care prefix descrie o rută de gazdă IPv6?', [
    ['/128', true, 'Toți cei 128 de biți: o singură adresă.'],
    ['/64', false, 'Este lungimea tipică a unei subrețele, nu a unei gazde.'],
    ['/48', false, 'Este un prefix de site.'],
    ['/0', false, 'Este ruta implicită.'],
  ], '/128.'),
  single({ id: '3.3-023' }, '3.3.c', 2, 'R1 are S 10.2.0.0/16 via R2 și S 10.2.2.2/32 via R3. Încotro merge un pachet pentru 10.2.2.2?', [
    ['Spre R3', true, '/32 este mai specifică decât /16; AD-ul este același, dar prefixul decide.'],
    ['Spre R2', false, 'R2 e next hop doar pentru restul rețelei 10.2.0.0/16.'],
    ['Pe ambele, în paralel', false, 'Sunt prefixe diferite, deci nu se aplică ECMP.'],
    ['Pachetul este aruncat', false, 'Există rute potrivite.'],
  ], 'Host route = excepție.'),
  single({ id: '3.3-024' }, '3.3.c', 2, 'Care este un motiv bun pentru o rută de gazdă statică?', [
    ['Un server anume trebuie să ia altă cale decât restul rețelei', true, '/32 creează o excepție fără să modifice celelalte rute.'],
    ['Pentru a rezuma o întreagă rețea', false, 'Rezumarea se face cu prefix mai scurt, nu cu /32.'],
    ['Pentru a înlocui ruta implicită', false, 'Ruta implicită are lungimea 0; nu se înlocuiește cu o rută de gazdă.'],
    ['Pentru a reduce AD-ul sub 1', false, 'AD nu are legătură cu lungimea prefixului.'],
  ], 'Excepție pentru o singură adresă.'),
  { id: '3.3-025', topicId: T, sub: '3.3.c', type: 'cli', difficulty: 2,
    stem: 'Configurează o rută de gazdă IPv4 pentru 10.2.2.2 cu next hop 10.1.1.2.',
    prompt: 'R1(config)#', canonical: 'ip route 10.2.2.2 255.255.255.255 10.1.1.2', answers: ['ip route 10.2.2.2 255.255.255.255 10.1.1.2'], hint: 'mască /32',
    wrong: [
      { text: 'ip route 10.2.2.2 255.255.255.0 10.1.1.2', why: 'Cu /24 adresa are biți de gazdă nenuli: comanda e respinsă sau acoperă alt prefix.' },
      { text: 'ip route 10.2.2.2 0.0.0.0 10.1.1.2', why: 'Masca 0.0.0.0 este a rutei implicite.' },
      { text: 'ipv6 route 10.2.2.2/32 10.1.1.2', why: 'Comanda ipv6 route cere adrese IPv6.' },
    ],
    explanation: 'Host route: mască 255.255.255.255.' },

  // ======================= 3.3.d — Floating static =======================
  single({ id: '3.3-026' }, '3.3.d', 1, 'Ce este o rută statică flotantă?', [
    ['O rută statică de rezervă cu AD mărit, instalată doar când ruta preferată dispare', true, 'AD mai mare = pierde cât timp există ruta principală.'],
    ['O rută care își schimbă singură next hop-ul', false, 'Rutele statice nu se schimbă singure.'],
    ['O rută care nu apare niciodată în show running-config', false, 'Apare în configurație; nu apare în tabelă cât timp e în rezervă.'],
    ['O rută cu metrică 0 învățată prin OSPF', false, 'Aceasta nu e statică.'],
  ], 'Flotanta = rezervă prin AD mărit.'),
  single({ id: '3.3-027' }, '3.3.d', 2, 'Ce AD este potrivit pentru o rută statică flotantă care trebuie să fie rezervă pentru o rută OSPF?', [
    ['130', true, 'Mai mare de 110 (OSPF), deci rămâne în rezervă.'],
    ['100', false, 'Mai mic de 110: statica ar bate OSPF și ar deveni ruta principală.'],
    ['1', false, 'AD implicit al statice: ar bate OSPF.'],
    ['255', false, '255 înseamnă rută nefolosită: nu se instalează niciodată.'],
  ], 'AD flotant > AD acoperit.'),
  single({ id: '3.3-028' }, '3.3.d', 2, 'R1 are în configurație două rute statice către 192.168.30.0/24: una fără AD și una cu AD 5. Ce apare în show ip route cât timp ambele next hop-uri sunt accesibile?', [
    ['Doar ruta cu AD 1', true, 'Din două rute pentru același prefix intră în tabelă cea cu AD mai mic.'],
    ['Doar ruta cu AD 5', false, 'AD 5 > AD 1, deci pierde.'],
    ['Ambele, cu ECMP', false, 'ECMP presupune AD și metrică egale.'],
    ['Nicio rută, din cauza conflictului', false, 'Nu există conflict: AD decide.'],
  ], 'AD mai mic câștigă.'),
  single({ id: '3.3-029' }, '3.3.d', 2, 'În comanda ip route, unde se scrie AD-ul rutei flotante?', [
    ['La sfârșit, după next hop', true, 'ip route 10.2.0.0 255.255.0.0 10.9.9.2 130.'],
    ['Imediat după cuvântul route', false, 'Acolo vine adresa de rețea.'],
    ['Între rețea și mască', false, 'Rețeaua și masca sunt scrise împreună.'],
    ['În comanda ip route nu se poate seta AD', false, 'AD-ul este argument opțional al comenzii.'],
  ], 'Ultimul argument.'),
  multi({ id: '3.3-030' }, '3.3.d', 3, 'Care situații fac ca o rută flotantă să NU preia traficul când te aștepți? (alege toate corecte)', [
    ['Legătura principală rămâne up/up, deși ceva mai departe pe cale e defect', true, 'Ruta principală rămâne instalată; routerul nu detectează problema.'],
    ['AD-ul flotantei este mai mic decât al rutei principale', true, 'Atunci flotanta devine principala (sau bate OSPF).'],
    ['Next hop-ul flotantei nu e accesibil', true, 'Nici ea nu se poate instala.'],
    ['Ruta principală și cea flotantă sunt în running-config', false, 'Acesta e scenariul normal: flotanta se află în configurație, dar nu în tabelă.'],
  ], 'Flotanta depinde de dispariția rutei principale.'),
  { id: '3.3-031', topicId: T, sub: '3.3.d', type: 'cli', difficulty: 2,
    stem: 'Configurează o rută statică de rezervă pentru 192.168.30.0/24 cu next hop 10.0.13.2 și AD 5.',
    prompt: 'R1(config)#', canonical: 'ip route 192.168.30.0 255.255.255.0 10.0.13.2 5', answers: ['ip route 192.168.30.0 255.255.255.0 10.0.13.2 5'], hint: 'AD-ul este ultimul argument',
    wrong: [
      { text: 'ip route 192.168.30.0 255.255.255.0 5 10.0.13.2', why: 'AD-ul vine după next hop, nu înainte.' },
      { text: 'ip route 192.168.30.0 255.255.255.0 10.0.13.2', why: 'Fără AD explicit e o rută cu AD 1, deci nu e flotantă.' },
      { text: 'ip route 192.168.30.0 255.255.255.0 10.0.13.2 metric 5', why: 'Nu există cuvântul cheie metric în ip route; AD-ul se scrie ca număr.' },
    ],
    explanation: 'Flotanta: AD ca ultim argument.' },
  { id: '3.3-032', topicId: T, sub: '3.3.d', type: 'order', difficulty: 2,
    stem: 'Ordonează evenimentele când legătura principală cade și există o rută flotantă.',
    items: [
      { text: 'Ambele rute statice sunt în configurație; în tabelă este doar cea cu AD mai mic', why: 'Starea normală: cea flotantă este în rezervă.' },
      { text: 'Interfața principală devine down', why: 'Evenimentul care declanșează schimbarea.' },
      { text: 'Next hop-ul principal devine inaccesibil și ruta principală este retrasă din tabelă', why: 'Fără ruta connected a interfeței, căutarea recursivă eșuează.' },
      { text: 'Ruta flotantă (AD mai mare) este instalată în tabelă', why: 'Acum este singura candidată pentru prefix.' },
      { text: 'Traficul curge pe calea de rezervă', why: 'Consecința instalării rutei de rezervă.' },
    ],
    explanation: 'Retragerea rutei principale declanșează instalarea celei flotante.' },

  // ======================= IPv6 =======================
  single({ id: '3.3-033' }, '3.3', 1, 'Care comandă este necesară pentru ca un router Cisco să ruteze pachete IPv6?', [
    ['ipv6 unicast-routing', true, 'Comandă de configurare globală; fără ea routerul nu transmite IPv6.'],
    ['ipv6 enable', false, 'Activează IPv6 pe o interfață, nu rutarea la nivel de router.'],
    ['ip routing ipv6', false, 'Nu există o astfel de comandă.'],
    ['ipv6 address autoconfig', false, 'Configurează o interfață prin SLAAC, nu activează rutarea.'],
  ], 'ipv6 unicast-routing.'),
  single({ id: '3.3-034' }, '3.3', 3, 'Care comandă este acceptată pentru un next hop link-local IPv6?', [
    ['ipv6 route 2001:db8:2::/64 g0/1 fe80::2', true, 'Pentru link-local, interfața este obligatorie.'],
    ['ipv6 route 2001:db8:2::/64 fe80::2', false, 'Fără interfață routerul nu știe pe ce interfață să trimită; comanda e respinsă.'],
    ['ipv6 route 2001:db8:2::/64 fe80::/10', false, 'Next hop-ul trebuie să fie o adresă, nu un prefix.'],
    ['ip route 2001:db8:2::/64 fe80::2', false, 'ip route este pentru IPv4.'],
  ], 'Link-local ⇒ interfață + next hop.'),
  { id: '3.3-035', topicId: T, sub: '3.3', type: 'cli', difficulty: 3,
    stem: 'Configurează o rută statică IPv6 pentru 2001:db8:2::/64 cu next hop link-local fe80::2 pe interfața GigabitEthernet0/1.',
    prompt: 'R1(config)#', canonical: 'ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 fe80::2', answers: ['ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 fe80::2', 'ipv6 route 2001:db8:2::/64 g0/1 fe80::2', 'ipv6 route 2001:db8:2::/64 gi0/1 fe80::2'], hint: 'interfața vine înaintea next hop-ului',
    wrong: [
      { text: 'ipv6 route 2001:db8:2::/64 fe80::2', why: 'Next hop link-local fără interfață: routerul nu știe pe ce interfață.' },
      { text: 'ipv6 route 2001:db8:2:: 255.255.255.0 g0/1 fe80::2', why: 'IPv6 folosește prefix/lungime, nu mască zecimală.' },
      { text: 'ip route 2001:db8:2::/64 g0/1 fe80::2', why: 'ip route este pentru IPv4.' },
    ],
    explanation: 'ipv6 route prefix/lungime interfață next-hop.' },
  single({ id: '3.3-036' }, '3.3', 2, 'Ce comandă afișează doar rutele statice IPv6?', [
    ['show ipv6 route static', true, 'Filtrează tabela IPv6 după codul S.'],
    ['show ip route static', false, 'Afișează rutele IPv4.'],
    ['show ipv6 interface brief', false, 'Listează adresele interfețelor, nu rutele.'],
    ['show running-config ipv6', false, 'Nu este o comandă validă.'],
  ], 'show ipv6 route static.'),
  { id: '3.3-037', topicId: T, sub: '3.3', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii recomandați pentru a pune în funcțiune o rută statică între două LAN-uri.',
    items: [
      { text: 'Configurează adresele IP și pornește interfețele (no shutdown)', why: 'Fără interfețe up/up next hop-ul nu e accesibil.' },
      { text: 'Adaugă ruta „dus” pe primul router', why: 'Primul router trebuie să știe unde să trimită.' },
      { text: 'Adaugă ruta „dus” pe routerii intermediari și ruta de întoarcere pe ultimul router', why: 'Fiecare router de pe cale are nevoie de o rută spre destinație și spre sursă.' },
      { text: 'Verifică tabela cu show ip route', why: 'Confirmi că ruta apare cu codul S.' },
      { text: 'Testează cu ping și traceroute', why: 'Verifică conectivitatea reală end-to-end.' },
    ],
    explanation: 'Interfețe → rute → verificare tabelă → test.' },
  { id: '3.3-038', topicId: T, sub: '3.3', type: 'match', difficulty: 2,
    stem: 'Potrivește simptomul cu cauza cea mai probabilă.',
    leftLabel: 'Simptom', rightLabel: 'Cauză',
    pairs: [
      { left: 'Destination host unreachable de la R1', right: 'R1 nu are rută pentru destinație', why: 'Routerul care generează unreachable nu are o rută potrivită.' },
      { left: 'Request timed out, deși R1 are ruta', right: 'Lipsește ruta de întoarcere pe un router de pe cale', why: 'Cererea ajunge, răspunsul se pierde.' },
      { left: 'Ruta e în running-config, nu în tabelă', right: 'Next hop inaccesibil sau interfață down', why: 'Ruta nu se poate instala.' },
      { left: 'Flotanta devine rută principală', right: 'AD-ul ei este mai mic decât al rutei acoperite', why: 'AD-ul trebuie să fie mai mare.' },
    ],
    distractors: [{ text: 'Masca de subrețea a PC-ului este /24', why: 'Nu explică niciunul dintre simptome.' }],
    explanation: 'Simptomele indică locul problemei.' },
  single({ id: '3.3-039' }, '3.3.d', 3, 'R1 are două rute statice către 192.168.30.0/24, ambele cu AD 1 (via 10.0.12.2 și via 10.0.13.2). Ce face routerul?', [
    ['Instalează ambele și împarte traficul (ECMP)', true, 'Același prefix, același AD și aceeași metrică: ambele sunt instalate.'],
    ['Instalează doar prima configurată', false, 'Pentru AD egal nu se alege după ordinea configurării.'],
    ['Folosește a doua doar ca rezervă', false, 'Rezerva cere un AD diferit (mai mare).'],
    ['Respinge a doua comandă', false, 'IOS acceptă ambele rute.'],
  ], 'AD egal ⇒ ECMP, nu rezervă.'),
  single({ id: '3.3-040' }, '3.3.a', 2, 'Ce afișează show ip route dacă routerul nu are nicio rută implicită?', [
    ['Gateway of last resort is not set', true, 'Mesajul standard când nu există o rută candidată ca implicită.'],
    ['Gateway of last resort is 0.0.0.0', false, 'Nu este un mesaj real; când implicita lipsește, apare „not set”.'],
    ['% Default route missing', false, 'Nu este un mesaj standard IOS.'],
    ['Nimic, linia nu apare niciodată', false, 'Linia apare mereu în antet: fie cu gateway, fie „not set”.'],
  ], 'Antetul spune dacă există gateway of last resort.'),
];
