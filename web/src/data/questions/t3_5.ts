import type { Question } from '../../lib/types';

// Banca de întrebări pentru 3.5 Describe the purpose, functions, and concepts of first hop redundancy protocols.
// Obiectivul oficial nu are sub-puncte; `sub` = '3.5'. Fiecare variantă are explicație (why).
const T = '3.5';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });

export const Q_3_5: Question[] = [
  // ======================= Scop: de ce există FHRP =======================
  single({ id: '3.5-001' }, 1, 'Care este scopul principal al unui First Hop Redundancy Protocol (FHRP)?', [
    ['Să schimbe automat calea spre destinații în funcție de metrică', false, 'Asta fac protocoalele de rutare (de exemplu OSPF), nu FHRP.'],
    ['Să elimine default gateway-ul ca singur punct de defecțiune pentru gazdele dintr-o subrețea', true, 'Mai multe routere prezintă gazdelor un gateway virtual; dacă unul cade, altul preia fără reconfigurarea gazdelor.'],
    ['Să prevină buclele de nivel 2 între switch-uri', false, 'Aceasta este funcția STP, nu a FHRP.'],
    ['Să atribuie automat adrese IP gazdelor', false, 'Aceasta este funcția DHCP.'],
  ], 'FHRP = redundanță pentru default gateway. Gazdele nu sunt reconfigurate la failover.'),
  single({ id: '3.5-002' }, 1, 'Un PC are configurat ca default gateway adresa reală a lui R1. R1 cade, deși R2 din aceeași subrețea funcționează. Ce se întâmplă fără FHRP?', [
    ['PC-ul trece automat pe R2, pentru că îl descoperă prin ARP', false, 'PC-ul nu are motiv să folosească R2: ARP rezolvă doar adresa gateway-ului configurat, adică a lui R1.'],
    ['Switch-ul redirecționează traficul către R2', false, 'Switch-ul de nivel 2 nu schimbă destinația IP a pachetelor.'],
    ['PC-ul nu mai poate ieși din subrețea până când administratorul schimbă gateway-ul', true, 'Gateway-ul este configurat static pe gazdă; fără FHRP nu există mecanism automat de schimbare.'],
    ['R2 răspunde automat la adresa lui R1', false, 'R2 nu preia adresa lui R1 fără un protocol FHRP.'],
  ], 'Fără FHRP, gateway-ul configurat devine punct unic de defecțiune.'),
  single({ id: '3.5-003' }, 1, 'Ce adresă configurează gazdele ca default gateway într-un grup FHRP?', [
    ['Adresa reală a routerului Active', false, 'Adresa reală se schimbă între routere; gazdele ar trebui reconfigurate la failover.'],
    ['Adresa IP virtuală partajată de grup', true, 'Adresa virtuală rămâne aceeași indiferent care router este Active.'],
    ['Adresa de broadcast a subrețelei', false, 'Broadcast-ul nu este o adresă de gateway.'],
    ['Adresa multicast a protocolului (de exemplu 224.0.0.102)', false, 'Aceea este adresa folosită între routere pentru Hello-uri, nu un gateway.'],
  ], 'Gazdele folosesc adresa IP virtuală ca default gateway.'),
  single({ id: '3.5-004' }, 2, 'De ce nu este suficient să configurezi două gateway-uri pe gazde, în loc să folosești un FHRP?', [
    ['Gazdele nu pot avea mai mult de o adresă IP', false, 'Problema nu e numărul de adrese; e comportamentul gateway-ului.'],
    ['Gazdele folosesc de obicei un singur gateway și nu detectează fiabil când acesta cade; configurarea ar trebui făcută manual pe fiecare gazdă', true, 'FHRP mută rolul în rețea, o dată, fără atingerea gazdelor.'],
    ['Routerele nu acceptă două gateway-uri pe aceeași subrețea', false, 'Routerele pot avea ambele interfețe în aceeași subrețea; asta face posibil FHRP.'],
    ['Cache-ul ARP nu poate reține două gateway-uri', false, 'Cache-ul ARP reține orice număr de intrări; motivul e lipsa unui mecanism de detectare.'],
  ], 'FHRP centralizează redundanța în routere, nu în gazde.'),
  multi({ id: '3.5-005' }, 1, 'Care dintre acestea sunt protocoale FHRP? (alege toate variantele corecte)', [
    ['HSRP', true, 'Hot Standby Router Protocol — Cisco.'],
    ['VRRP', true, 'Virtual Router Redundancy Protocol — standard IETF.'],
    ['GLBP', true, 'Gateway Load Balancing Protocol — Cisco.'],
    ['STP', false, 'Spanning Tree Protocol previne buclele L2; nu oferă redundanță de gateway.'],
    ['OSPF', false, 'OSPF este protocol de rutare, nu FHRP.'],
  ], 'FHRP: HSRP, VRRP, GLBP.'),
  single({ id: '3.5-006' }, 2, 'Unde se configurează un FHRP?', [
    ['Pe gazde, în setările de rețea', false, 'Gazdele doar folosesc adresa virtuală ca gateway.'],
    ['Pe interfețele routerelor sau switch-urilor L3 care sunt gateway pentru subrețea', true, 'Dispozitivele de nivel 3 participă la grup și schimbă mesajele de protocol.'],
    ['Pe switch-urile de acces, de nivel 2', false, 'Un switch L2 nu e gateway; el doar transportă cadrele.'],
    ['Pe serverul DHCP', false, 'DHCP poate oferi adresa virtuală ca gateway, dar nu rulează FHRP.'],
  ], 'FHRP rulează pe dispozitive L3 (routere, switch-uri L3, de obicei SVI).'),
  single({ id: '3.5-007' }, 2, 'Ce cerință trebuie îndeplinită de adresa IP virtuală a unui grup FHRP?', [
    ['Trebuie să fie în aceeași subrețea cu adresele reale ale interfețelor din grup și neatribuită altui dispozitiv', true, 'Gazdele o accesează direct, deci e în subrețeaua lor; un duplicat ar produce conflicte de IP.'],
    ['Trebuie să fie într-o subrețea diferită de a gazdelor', false, 'Gateway-ul trebuie să fie accesibil direct din subrețeaua gazdelor.'],
    ['Trebuie să fie adresa reală a routerului cu prioritatea cea mai mare', false, 'Dacă ar fi adresa reală, ar depinde de un router, ceea ce anulează scopul.'],
    ['Trebuie să fie o adresă multicast', false, 'Gateway-ul este o adresă unicast obișnuită.'],
  ], 'Adresa virtuală: în subrețeaua LAN-ului, unică.'),
  single({ id: '3.5-008' }, 2, 'Ce rol are adresa MAC virtuală?', [
    ['Înlocuiește definitiv adresele MAC reale ale interfețelor', false, 'Interfețele își păstrează MAC-urile reale pentru traficul propriu.'],
    ['Permite ca ARP pentru adresa virtuală să primească mereu același MAC, indiferent care router este Active', true, 'Cache-ul ARP al gazdei rămâne valid după failover, pentru că MAC-ul virtual se mută cu rolul.'],
    ['Este folosită doar pentru autentificarea între routere', false, 'Nu are rol de autentificare.'],
    ['Este adresa pe care switch-ul o folosește ca ID de bridge', false, 'Bridge ID ține de STP, nu de FHRP.'],
  ], 'Virtual IP + virtual MAC = gateway stabil pentru gazde.'),
  single({ id: '3.5-009' }, 1, 'Care router răspunde la cererile ARP pentru adresa virtuală într-un grup HSRP?', [
    ['Ambele routere, fiecare cu MAC-ul lui real', false, 'Ar însemna răspunsuri contradictorii; HSRP evită asta.'],
    ['Routerul Standby', false, 'Standby ascultă și așteaptă; nu răspunde pentru adresa virtuală.'],
    ['Routerul Active, cu MAC-ul virtual', true, 'Doar Active răspunde la ARP pentru adresa virtuală și forwardează traficul.'],
    ['Switch-ul de acces', false, 'Un switch L2 nu răspunde la ARP pentru adrese ale altor dispozitive.'],
  ], 'Active răspunde la ARP cu MAC-ul virtual.'),
  { id: '3.5-010', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează evenimentele unui failover HSRP, de la căderea routerului Active până la reluarea traficului.',
    items: [
      { text: 'Routerul Active cade sau își pierde interfața spre LAN', why: 'Punctul de plecare: gazdele ar rămâne fără gateway.' },
      { text: 'Standby nu mai primește Hello-uri de la Active', why: 'Absența Hello-urilor este singurul semnal pe care îl are Standby.' },
      { text: 'Expiră hold timer-ul (implicit 10 s)', why: 'După această perioadă fără Hello, Active este declarat picat.' },
      { text: 'Standby devine Active și preia adresa și MAC-ul virtuale', why: 'Noul Active începe să răspundă la ARP și să forwardeze.' },
      { text: 'Gazdele continuă să trimită la aceeași adresă virtuală', why: 'Nu e nevoie de reconfigurare: adresa și MAC-ul virtuale nu s-au schimbat.' },
    ],
    explanation: 'Cădere → fără Hello → hold timer expirat → Standby devine Active → traficul continuă către aceeași adresă virtuală.' },

  // ======================= Concepte HSRP: priority, preempt, timere =======================
  single({ id: '3.5-011' }, 1, 'Care sunt timerele implicite HSRP Hello și Hold?', [
    ['Hello 1 s, Hold 3 s', false, 'Acestea sunt valorile uzuale la alte protocoale sau valori ajustate manual, nu cele implicite HSRP.'],
    ['Hello 10 s, Hold 40 s', false, 'Acestea sunt valorile implicite OSPF pe Ethernet, nu HSRP.'],
    ['Hello 3 s, Hold 10 s', true, 'Valorile implicite HSRP; Hold este aproximativ de 3 ori Hello.'],
    ['Hello 30 s, Hold 120 s', false, 'Sunt valorile OSPF pentru NBMA, nu HSRP.'],
  ], 'HSRP: 3/10 s.'),
  single({ id: '3.5-012' }, 1, 'Care este prioritatea HSRP implicită și care router devine Active?', [
    ['Implicit 100; devine Active cel cu prioritatea cea mai mare', true, 'Prioritatea merge de la 0 la 255; cea mai mare câștigă.'],
    ['Implicit 1; devine Active cel cu prioritatea cea mai mică', false, 'Valoarea implicită este 100, iar cea mai mare câștigă.'],
    ['Implicit 0; routerul cu MAC-ul cel mai mic', false, 'MAC-ul real nu decide alegerea Active.'],
    ['Implicit 255; primul router care pornește', false, '255 este maximul, nu valoarea implicită; ordinea pornirii contează doar fără preempt.'],
  ], 'Priority 100 implicit; cea mai mare câștigă.'),
  single({ id: '3.5-013' }, 3, 'R1 (192.168.10.1) și R2 (192.168.10.2) au ambele priority 100 și pornesc în același timp. Care devine Active?', [
    ['R1, pentru că are adresa IP mai mică', false, 'La egalitate nu câștigă adresa mai mică.'],
    ['R2, pentru că are adresa IP mai mare', true, 'La prioritate egală, câștigă adresa IP cea mai mare de pe interfață.'],
    ['Niciunul: ambele devin Active', false, 'Alegerea produce un singur Active; dublu-Active apare doar din greșeli de configurare.'],
    ['Cel cu MAC-ul real mai mare', false, 'Adresa MAC reală nu este criteriu de alegere HSRP.'],
  ], 'Prioritate, apoi adresa IP cea mai mare.'),
  single({ id: '3.5-014' }, 2, 'R1 are priority 110 fără preempt. R2 (priority 100) este deja Active. R1 pornește. Ce se întâmplă?', [
    ['R1 devine Active imediat, pentru că are prioritatea mai mare', false, 'Fără preempt, un router nu preia rolul Active de la unul care îl deține deja.'],
    ['R2 rămâne Active, iar R1 devine Standby', true, 'HSRP implicit nu preemptează; R1 așteaptă ca Active să cadă.'],
    ['Ambele routere devin Standby', false, 'Un grup are un Active; R2 îl deține deja.'],
    ['R1 forțează o realegere cu clear standby', false, 'Nu există o astfel de comandă, iar alegerea nu se reia singură.'],
  ], 'Preempt dezactivat implicit la HSRP.'),
  single({ id: '3.5-015' }, 2, 'Ce comandă face ca un router cu prioritate mai mare să preia rolul Active de la unul cu prioritate mai mică?', [
    ['standby 1 preempt', true, 'Activează preemption pentru grupul 1.'],
    ['standby 1 priority 255', false, 'Prioritatea mărită nu e suficientă fără preempt.'],
    ['standby 1 timers 1 3', false, 'Timerele schimbă viteza de detecție, nu regula de preempt.'],
    ['standby version 2', false, 'Schimbă versiunea protocolului, nu comportamentul de preemption.'],
  ], 'Pentru preluare forțată: standby <grup> preempt.'),
  single({ id: '3.5-016' }, 2, 'Ce stare au routerele dintr-un grup HSRP care nu sunt nici Active, nici Standby (dar cunosc adresa virtuală)?', [
    ['Initial', false, 'Initial este starea de început, înainte de participarea la alegere.'],
    ['Listen', true, 'În Listen, routerul cunoaște adresa virtuală și ascultă Hello-urile; nu e Active sau Standby.'],
    ['Backup', false, 'Backup este termenul VRRP, nu o stare HSRP.'],
    ['Master', false, 'Master este rolul din VRRP.'],
  ], 'Într-un grup: un Active, un Standby, restul în Listen.'),
  { id: '3.5-017', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează stările HSRP prin care trece un router care pornește și devine Active.',
    items: [
      { text: 'Initial', why: 'Punctul de plecare: HSRP tocmai a pornit.' },
      { text: 'Learn', why: 'Așteaptă să învețe adresa virtuală de la Active, dacă nu o are configurată.' },
      { text: 'Listen', why: 'Cunoaște adresa virtuală și ascultă Hello-urile celorlalți.' },
      { text: 'Speak', why: 'Trimite Hello-uri și participă la alegere.' },
      { text: 'Standby', why: 'Este candidatul de rezervă ales.' },
      { text: 'Active', why: 'Preia rolul și forwardează traficul gazdelor.' },
    ],
    explanation: 'Initial → Learn → Listen → Speak → Standby → Active.' },

  // ======================= Comparație HSRP / VRRP / GLBP =======================
  match({ id: '3.5-018' }, 1, 'Asociază fiecare FHRP cu rolurile lui.', [
    { left: 'HSRP', right: 'Active / Standby', why: 'HSRP are un router Active și unul Standby.' },
    { left: 'VRRP', right: 'Master / Backup', why: 'VRRP folosește termenii Master și Backup.' },
    { left: 'GLBP', right: 'AVG / AVF', why: 'GLBP: Active Virtual Gateway și Active Virtual Forwarder.' },
  ], [
    { text: 'Root / Designated', why: 'Roluri din STP, nu FHRP.' },
    { text: 'DR / BDR', why: 'Roluri din OSPF pe segmente broadcast.' },
  ], 'HSRP Active/Standby · VRRP Master/Backup · GLBP AVG/AVF.'),
  single({ id: '3.5-019' }, 1, 'Care dintre FHRP-uri este un standard deschis (IETF), nu proprietar Cisco?', [
    ['HSRP', false, 'HSRP este proprietar Cisco.'],
    ['GLBP', false, 'GLBP este proprietar Cisco.'],
    ['VRRP', true, 'VRRP este definit în RFC 5798 și funcționează între producători.'],
    ['STP', false, 'STP nu este FHRP.'],
  ], 'VRRP = standard deschis.'),
  single({ id: '3.5-020' }, 2, 'Ce adresă multicast și ce protocol de transport folosește VRRP?', [
    ['224.0.0.18, direct peste IP (protocolul 112)', true, 'VRRP nu folosește TCP sau UDP, ci protocolul IP 112.'],
    ['224.0.0.102, UDP 1985', false, 'Aceasta este HSRPv2.'],
    ['224.0.0.5, protocolul 89', false, 'Aceasta este OSPF.'],
    ['224.0.0.10, protocolul 88', false, 'Aceasta este EIGRP.'],
  ], 'VRRP: 224.0.0.18, IP 112.'),
  single({ id: '3.5-021' }, 2, 'Care sunt adresele multicast folosite de HSRPv1 și HSRPv2?', [
    ['v1: 224.0.0.102 · v2: 224.0.0.2', false, 'Valorile sunt inversate.'],
    ['v1: 224.0.0.2 · v2: 224.0.0.102', true, 'Ambele rulează peste UDP 1985.'],
    ['Ambele: 224.0.0.18', false, 'Aceasta este adresa VRRP.'],
    ['Ambele: 224.0.0.5', false, 'Aceasta este adresa OSPF.'],
  ], 'HSRPv1 224.0.0.2, HSRPv2 224.0.0.102, UDP 1985.'),
  single({ id: '3.5-022' }, 2, 'Care FHRP distribuie nativ gazdele între mai multe routere pentru aceeași adresă virtuală?', [
    ['HSRP', false, 'HSRP are un singur Active per grup; distribuția cere mai multe grupuri.'],
    ['VRRP', false, 'La fel: un Master per grup.'],
    ['GLBP', true, 'AVG răspunde la ARP cu MAC-uri virtuale diferite, deci gazdele sunt împărțite între AVF.'],
    ['Niciunul', false, 'GLBP a fost creat tocmai pentru echilibrare.'],
  ], 'GLBP = redundanță + load balancing nativ.'),
  multi({ id: '3.5-023' }, 2, 'Care afirmații despre GLBP sunt adevărate? (alege toate variantele corecte)', [
    ['Este proprietar Cisco', true, 'Nu este standard IETF.'],
    ['AVG atribuie MAC-uri virtuale diferite membrilor grupului', true, 'Fiecare AVF primește un MAC virtual propriu.'],
    ['Metoda implicită de distribuție este round-robin', true, 'Alte metode: weighted și host-dependent.'],
    ['Folosește aceeași adresă MAC virtuală pentru toate gazdele', false, 'Tocmai MAC-urile diferite permit echilibrarea.'],
    ['Folosește protocolul IP 112', false, 'Aceea este VRRP; GLBP folosește UDP 3222.'],
  ], 'GLBP: Cisco, AVG/AVF, mai multe MAC-uri virtuale, round-robin implicit.'),
  single({ id: '3.5-024' }, 2, 'Care este comportamentul implicit al preempt la HSRP și la VRRP?', [
    ['HSRP: dezactivat; VRRP: activat', true, 'Diferență clasică de examen.'],
    ['HSRP: activat; VRRP: dezactivat', false, 'Este invers.'],
    ['Ambele: activat', false, 'HSRP cere comanda explicită.'],
    ['Ambele: dezactivat', false, 'La VRRP preempt este activ implicit.'],
  ], 'HSRP preempt off, VRRP preempt on.'),
  match({ id: '3.5-025' }, 3, 'Asociază fiecare FHRP cu formatul MAC-ului virtual.', [
    { left: 'HSRPv1 (grup 1)', right: '0000.0C07.AC01', why: 'Prefixul HSRPv1 este 0000.0C07.AC, urmat de grup în hexazecimal.' },
    { left: 'VRRP (VRID 1)', right: '0000.5E00.0101', why: 'Prefixul VRRP este 0000.5E00.01, urmat de VRID.' },
    { left: 'GLBP (grup 1, AVF 1)', right: '0007.B400.0101', why: 'Prefixul GLBP este 0007.B4; următorii octeți sunt grupul și numărul AVF.' },
  ], [
    { text: 'FFFF.FFFF.FFFF', why: 'Aceasta este adresa MAC de broadcast.' },
  ], 'HSRPv1 0000.0C07.ACxx · VRRP 0000.5E00.01xx · GLBP 0007.B400.xxyy.'),
  single({ id: '3.5-026' }, 2, 'Pot un router HSRPv1 și unul HSRPv2 să facă parte din același grup funcțional?', [
    ['Da, versiunile sunt compatibile', false, 'Nu sunt: folosesc formate de pachet, adrese multicast și MAC-uri virtuale diferite.'],
    ['Nu: versiunile nu interoperează și trebuie potrivite pe toate routerele grupului', true, 'Un mismatch poate lăsa doi routere Active simultan.'],
    ['Da, dar doar dacă prioritatea este 100', false, 'Prioritatea nu rezolvă incompatibilitatea.'],
    ['Da, dacă preempt este activ', false, 'Preempt nu ține de interoperabilitate.'],
  ], 'Aceeași versiune HSRP pe toți membrii grupului.'),
  single({ id: '3.5-027' }, 2, 'Care este intervalul numerelor de grup HSRP la versiunile 1 și 2?', [
    ['v1: 0–255 · v2: 0–4095', true, 'v2 extinde intervalul și acceptă IPv6.'],
    ['v1: 1–255 · v2: 1–4094', false, 'Grupul 0 este valid; intervalele sunt 0–255 și 0–4095.'],
    ['Ambele: 0–255', false, 'v2 a extins intervalul.'],
    ['v1: 0–4095 · v2: 0–255', false, 'Este invers.'],
  ], 'HSRPv1 0–255, HSRPv2 0–4095.'),
  multi({ id: '3.5-028' }, 3, 'Ce trebuie să fie identic pe routerele aceluiași grup HSRP ca să funcționeze corect? (alege toate variantele corecte)', [
    ['Numărul grupului', true, 'Grupuri diferite nu se văd între ele.'],
    ['Adresa IP virtuală', true, 'Altfel nu prezintă același gateway gazdelor.'],
    ['Versiunea HSRP', true, 'Versiunile nu interoperează.'],
    ['Prioritatea', false, 'Prioritățile diferă intenționat, pentru a alege Active.'],
    ['Adresa IP reală a interfeței', false, 'Fiecare router are propria adresă reală, în aceeași subrețea.'],
  ], 'Grup, adresă virtuală, versiune: identice; prioritate și IP real: diferite.'),

  // ======================= Adâncime HSRP: tracking, load sharing, practică =======================
  single({ id: '3.5-029' }, 3, 'R1 are priority 110 și standby 1 track Gi0/1 20; R2 are priority 100 cu preempt. Gi0/1 (uplink R1) cade. Ce se întâmplă?', [
    ['R1 rămâne Active, deoarece 110 e mai mare decât 100', false, 'Prioritatea lui R1 a scăzut la 90 după tracking.'],
    ['Prioritatea lui R1 devine 90 și R2 (cu preempt) preia rolul Active', true, '110 − 20 = 90 < 100; R2 are preempt, deci preia rolul.'],
    ['R1 își oprește HSRP complet', false, 'HSRP continuă; doar prioritatea scade.'],
    ['Prioritatea lui R1 devine 0', false, 'Scade cu decrementul configurat (20), nu la 0.'],
  ], 'Tracking scade prioritatea; preempt pe R2 permite preluarea.'),
  single({ id: '3.5-030' }, 3, 'Aceeași situație ca mai sus (R1 are tracking cu 20 și uplinkul cade), dar R2 NU are preempt. Ce se întâmplă?', [
    ['R2 preia rolul Active deoarece are prioritatea mai mare', false, 'Fără preempt, R2 nu preia rolul de la un Active care încă trimite Hello-uri.'],
    ['R1 rămâne Active și gazdele pierd conectivitatea spre exterior', true, 'R1 trimite în continuare Hello, deci rămâne Active deși a pierdut uplinkul; de aceea tracking-ul se folosește împreună cu preempt.'],
    ['Ambele routere devin Standby', false, 'Un grup are exact un Active.'],
    ['HSRP se oprește singur', false, 'HSRP nu se oprește la schimbarea priorității.'],
  ], 'Tracking fără preempt pe celălalt router nu mută rolul.'),
  single({ id: '3.5-031' }, 2, 'Cum poți distribui traficul între două routere folosind HSRP?', [
    ['Prin două grupuri HSRP cu Active diferiți, pe gazde sau VLAN-uri diferite', true, 'Fiecare router este Active pentru un grup și Standby pentru celălalt.'],
    ['Activând round-robin în HSRP', false, 'Round-robin ține de GLBP.'],
    ['Setând aceeași prioritate pe ambele routere, pentru ca amândouă să fie Active', false, 'Un grup are un singur Active; prioritățile egale se rezolvă după IP.'],
    ['Folosind HSRP numai cu versiunea 1', false, 'Versiunea nu influențează distribuția.'],
  ], 'Load sharing HSRP = mai multe grupuri.'),
  single({ id: '3.5-032' }, 3, 'Într-o rețea cu mai multe VLAN-uri, ce bună practică leagă HSRP de STP?', [
    ['Routerul Active al unui VLAN să fie și root bridge-ul STP pentru acel VLAN', true, 'Traficul de la gazde spre gateway merge pe calea cea mai scurtă, fără un salt suplimentar între switch-uri.'],
    ['Routerul Active să fie root bridge pentru alt VLAN', false, 'Ar adăuga un salt inutil pe calea spre gateway.'],
    ['STP să fie dezactivat pe interfețele HSRP', false, 'STP rămâne necesar pentru prevenirea buclelor.'],
    ['Active să fie întotdeauna routerul cu cel mai mic MAC real', false, 'MAC-ul real nu este criteriu.'],
  ], 'Aliniază Active HSRP cu root bridge STP, per VLAN.'),
  single({ id: '3.5-033' }, 2, 'La ce folosește comanda standby 1 timers 1 3?', [
    ['Schimbă prioritatea', false, 'Prioritatea se setează cu standby <grup> priority.'],
    ['Setează Hello la 1 s și Hold la 3 s, pentru failover mai rapid', true, 'Valori mai mici scurtează detecția căderii, cu cost mai mare de trafic și risc de instabilitate.'],
    ['Activează tracking-ul', false, 'Tracking-ul folosește standby <grup> track.'],
    ['Pornește HSRPv2', false, 'Versiunea se setează cu standby version 2.'],
  ], 'standby <grup> timers <hello> <hold>.'),
  single({ id: '3.5-034' }, 3, 'Ieșirea show standby brief arată pe Gi0/0 grupul 1, priority 100, State „Standby”, Active „192.168.10.1”, Standby „local”, Virtual IP 192.168.10.254. Ce concluzie e corectă?', [
    ['Routerul local este Active', false, 'Starea locală este Standby; Active este 192.168.10.1.'],
    ['Routerul cu adresa 192.168.10.1 este Active; routerul local este Standby', true, 'Coloana Active arată cine forwardează; „local” la Standby înseamnă routerul pe care rulezi comanda.'],
    ['Nu există Active în grup', false, 'Coloana Active arată 192.168.10.1.'],
    ['192.168.10.254 este adresa reală a routerului Active', false, '192.168.10.254 este adresa virtuală.'],
  ], 'Citește coloanele State, Active, Standby și Virtual IP.'),
  single({ id: '3.5-035' }, 3, 'Ambele routere afișează State „Active” pentru același grup, cu aceeași adresă virtuală. Care este o cauză probabilă?', [
    ['Prioritățile sunt diferite', false, 'Prioritățile diferite sunt normale și duc la alegerea unui singur Active.'],
    ['Versiunile HSRP diferite sau comunicarea Hello între routere nu funcționează (de exemplu un switch între ele blochează multicast-ul)', true, 'Dacă routerele nu se aud, fiecare crede că e singurul și devine Active.'],
    ['Preempt este dezactivat', false, 'Preempt nu produce doi Active.'],
    ['Timerele sunt implicite', false, 'Valorile implicite sunt cele normale.'],
  ], 'Doi Active = routerele nu se aud sau nu sunt de acord (versiune, grup).'),
  single({ id: '3.5-036' }, 3, 'Cu HSRP versiunea 1, grupul 10 va folosi ce MAC virtual? (10 zecimal = 0A hexazecimal)', [
    ['0000.0C07.AC0A', true, 'Prefixul HSRPv1 este 0000.0C07.AC, iar ultimul octet este grupul în hexazecimal: 10 = 0A.'],
    ['0000.0C07.AC10', false, 'Ar fi grupul 16 (0x10), nu 10.'],
    ['0000.5E00.010A', false, 'Aceasta ar fi forma VRRP.'],
    ['0007.B400.0A01', false, 'Aceasta ar fi forma GLBP.'],
  ], 'HSRPv1 grup 10 → 0000.0C07.AC0A.'),

  // ======================= CLI =======================
  { id: '3.5-037', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Ești în R1(config-if)#, pe interfața Gi0/0 (LAN). Configurează adresa virtuală 192.168.10.254 pentru grupul HSRP 1.',
    prompt: 'R1(config-if)#', canonical: 'standby 1 ip 192.168.10.254', answers: ['standby 1 ip 192.168.10.254'], hint: 'standby <grup> ip <adresă>',
    wrong: [
      { text: 'hsrp 1 ip 192.168.10.254', why: 'Nu există comanda hsrp; la IOS se folosește cuvântul cheie standby.' },
      { text: 'standby ip 192.168.10.254', why: 'Lipsește numărul grupului după standby.' },
      { text: 'ip address 192.168.10.254 255.255.255.0', why: 'Aceasta ar atribui adresa ca adresă reală a interfeței, nu ca adresă virtuală HSRP.' },
    ],
    explanation: 'standby <grup> ip <adresă virtuală>.' },
  { id: '3.5-038', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Ești în R1(config-if)#. Setează prioritatea HSRP 110 pentru grupul 1.',
    prompt: 'R1(config-if)#', canonical: 'standby 1 priority 110', answers: ['standby 1 priority 110'], hint: 'standby <grup> priority …',
    wrong: [
      { text: 'standby priority 110', why: 'Lipsește numărul grupului.' },
      { text: 'ip ospf priority 110', why: 'Aceasta este prioritatea OSPF pentru alegerea DR, nu HSRP.' },
      { text: 'standby 1 preempt 110', why: 'Comanda preempt nu primește o valoare de prioritate în acest mod.' },
    ],
    explanation: 'standby <grup> priority <valoare>.' },
  { id: '3.5-039', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Ești în R1(config-if)#. Permite routerului să preia rolul Active când are prioritate mai mare, pentru grupul 1.',
    prompt: 'R1(config-if)#', canonical: 'standby 1 preempt', answers: ['standby 1 preempt'], hint: 'standby <grup> preempt',
    wrong: [
      { text: 'standby 1 priority preempt', why: 'preempt este o comandă separată, nu un parametru al priority.' },
      { text: 'preempt', why: 'Comanda trebuie scrisă pe interfață, cu standby <grup>.' },
      { text: 'standby preempt 1', why: 'Numărul grupului vine imediat după standby.' },
    ],
    explanation: 'standby <grup> preempt.' },
  { id: '3.5-040', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Afișează un rezumat al stării HSRP (grup, prioritate, stare, Active, Standby, adresă virtuală).',
    prompt: 'R1#', canonical: 'show standby brief', answers: ['show standby brief', 'sh standby brief', 'show standby bri'], hint: 'show standby …',
    wrong: [
      { text: 'show hsrp brief', why: 'Nu există show hsrp pe IOS; comanda folosește cuvântul standby.' },
      { text: 'show ip route', why: 'Arată tabela de rutare, nu starea HSRP.' },
      { text: 'show ip interface brief', why: 'Arată starea și adresele interfețelor, nu rolurile HSRP.' },
    ],
    explanation: 'show standby brief: Grp, Pri, State, Active, Standby, Virtual IP.' },
];
