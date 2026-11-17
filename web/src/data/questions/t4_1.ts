import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.1 Configure and verify inside source NAT using static and pools.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.1'. Fiecare variantă are explicație (why).
const T = '4.1';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_1: Question[] = [
  // ======================= Concepte și terminologie =======================
  single({ id: '4.1-001' }, 1, 'Ce înseamnă „inside source NAT”?', [
    ['Se traduce adresa sursă a pachetelor care pleacă din rețeaua interioară spre exterior', true, 'Sursa pachetelor din interior (privată) este înlocuită cu o adresă publică.'],
    ['Se traduce adresa destinație a pachetelor care vin din Internet', false, 'Aceea este traducerea destinației (cum se întâmplă, la întoarcere, ca efect al aceleiași reguli), nu definiția „source NAT”.'],
    ['Se criptează adresele sursă din antetul IP', false, 'NAT nu criptează; doar înlocuiește adrese.'],
    ['Se blochează pachetele cu sursă privată', false, 'Blocarea ar fi o funcție de ACL/firewall, nu de NAT.'],
  ], 'Inside source NAT: se schimbă sursa pachetelor care vin din inside.'),
  single({ id: '4.1-002' }, 1, 'Care este motivul principal pentru care NAT a devenit necesar în rețelele IPv4?', [
    ['Adresele IPv4 publice sunt limitate, iar adresele private nu se rutează în Internet', true, 'NAT permite ca multe gazde private să iasă prin puține adrese publice.'],
    ['IPv4 nu poate fi folosit fără NAT', false, 'IPv4 funcționează și fără NAT, cât timp ai adrese publice.'],
    ['NAT accelerează traficul prin router', false, 'Traducerea adaugă procesare; nu accelerează.'],
    ['NAT înlocuiește DHCP', false, 'Sunt funcții diferite: DHCP atribuie adrese, NAT le traduce.'],
  ], 'NAT = răspunsul la lipsa adreselor IPv4 publice.'),
  single({ id: '4.1-003' }, 1, 'Un PC are adresa 192.168.1.10, iar routerul NAT îl traduce în 203.0.113.10. Cum se numește 203.0.113.10?', [
    ['Inside local', false, 'Inside local este adresa privată configurată pe gazdă (192.168.1.10).'],
    ['Inside global', true, 'Adresa publică prin care Internetul vede gazda din interior.'],
    ['Outside local', false, 'Se referă la gazda din exterior, așa cum o vede interiorul.'],
    ['Outside global', false, 'Este adresa reală a gazdei din exterior.'],
  ], 'Inside global = adresa publică a gazdei din interior.'),
  single({ id: '4.1-004' }, 1, 'În NAT-ul obișnuit (inside source), care două adrese din cele patru DIFERĂ pentru aceeași conexiune?', [
    ['Inside local și inside global', true, 'Doar gazda din interior este tradusă; cele două nume descriu adresa ei privată și pe cea publică.'],
    ['Outside local și outside global', false, 'Gazda din exterior nu este tradusă în inside source NAT, deci cele două coincid.'],
    ['Inside local și outside local', false, 'Sunt adresele a două gazde diferite, nu două vederi ale aceleiași gazde.'],
    ['Toate patru diferă', false, 'Doar adresa inside diferă; exteriorul rămâne nemodificat.'],
  ], 'Inside local ≠ inside global; outside local = outside global.'),
  match({ id: '4.1-005' }, 1, 'Potrivește fiecare termen NAT cu descrierea lui.', [
    { left: 'Inside local', right: 'Adresa privată configurată pe gazda din interior', why: 'Așa o vede rețeaua interioară.' },
    { left: 'Inside global', right: 'Adresa publică prin care Internetul vede gazda din interior', why: 'Rezultatul traducerii.' },
    { left: 'Outside global', right: 'Adresa reală a gazdei din exterior', why: 'Așa o vede Internetul.' },
    { left: 'Outside local', right: 'Adresa gazdei din exterior, așa cum o vede interiorul', why: 'În NAT-ul obișnuit coincide cu outside global.' },
  ], [
    { text: 'Adresa de broadcast a rețelei publice', why: 'Nu este un termen NAT.' },
  ], 'Inside = gazda ta; outside = cealaltă; local = vedere interioară; global = vedere exterioară.'),
  single({ id: '4.1-006' }, 2, 'PC1 (192.168.1.10) trimite un pachet către serverul 198.51.100.5 prin R-NAT, care traduce sursa în 203.0.113.10. Care sunt adresele sursă/destinație ale pachetului pe segmentul DINSPRE exterior?', [
    ['sursă 203.0.113.10, destinație 198.51.100.5', true, 'Sursa a fost tradusă în inside global; destinația rămâne neschimbată.'],
    ['sursă 192.168.1.10, destinație 198.51.100.5', false, 'Aceasta este forma pachetului înainte de traducere (pe segmentul inside).'],
    ['sursă 198.51.100.5, destinație 203.0.113.10', false, 'Aceasta este forma pachetului de răspuns, nu a cererii.'],
    ['sursă 203.0.113.10, destinație 192.168.1.10', false, 'Destinația nu poate fi o adresă privată a propriului PC într-un pachet care pleacă spre server.'],
  ], 'Spre exterior: sursa e inside global; destinația e neschimbată.'),

  // ======================= Static NAT =======================
  single({ id: '4.1-007' }, 1, 'Care afirmație descrie corect static NAT?', [
    ['Mapează o adresă privată la o singură adresă publică, permanent, 1:1', true, 'Intrarea există cât timp comanda e în configurație.'],
    ['Mapează mai multe adrese private la o singură adresă publică folosind porturi', false, 'Aceea este PAT.'],
    ['Alocă dinamic adrese dintr-un pool, la cerere', false, 'Aceea este dynamic NAT.'],
    ['Traduce doar destinația pachetelor', false, 'Static NAT traduce și sursa, în sensul de la interior spre exterior, și destinația la întoarcere.'],
  ], 'Static NAT: mapare 1:1 fixă.'),
  single({ id: '4.1-008' }, 2, 'Care tip de NAT permite unui client din Internet să INIȚIEZE o conexiune către un server din rețeaua privată?', [
    ['Static NAT', true, 'Intrarea există permanent în tabelă, deci un pachet din exterior către inside global poate fi tradus.'],
    ['PAT fără alte reguli', false, 'Intrarea PAT apare doar după ce o gazdă interioară trimite un pachet.'],
    ['Dynamic NAT cu pool', false, 'Intrările apar doar la trafic inițiat din interior.'],
    ['Niciunul — NAT nu permite niciodată conexiuni din exterior', false, 'Static NAT (sau port forwarding) permite exact asta.'],
  ], 'Pentru servere accesibile din Internet: static NAT / port forwarding.'),
  cli({ id: '4.1-009' }, 1, 'Ești în R1(config-if)#, pe interfața Gi0/0 care este dinspre LAN. Marchează-o ca interfață interioară NAT.', 'R1(config-if)#', 'ip nat inside', ['ip nat inside'], [
    { text: 'ip nat outside', why: 'Aceasta marchează interfața dinspre Internet, nu cea dinspre LAN.' },
    { text: 'nat inside', why: 'Comanda IOS începe cu ip nat; „nat inside” nu există.' },
    { text: 'ip nat inside source', why: 'Aceasta este începutul comenzilor globale de traducere, nu comanda de interfață.' },
  ], 'ip nat inside pe interfața LAN, ip nat outside pe interfața spre ISP.', 'ip nat …'),
  single({ id: '4.1-010' }, 2, 'Care sunt cele trei componente necesare pentru dynamic NAT cu pool?', [
    ['Pool-ul de adrese publice, un ACL pentru gazdele traduse și comanda care le leagă', true, 'ip nat pool + access-list + ip nat inside source list … pool …'],
    ['O adresă statică, un VLAN și un trunk', false, 'Acestea nu fac parte din NAT.'],
    ['Două pool-uri și o rută implicită', false, 'Un singur pool este suficient; ruta e separată.'],
    ['Un server DHCP, un ACL extins și un route-map obligatoriu', false, 'DHCP nu e necesar, iar route-map nu este obligatoriu.'],
  ], 'Pool + ACL + legătura dintre ele (+ ip nat inside/outside pe interfețe).'),
  single({ id: '4.1-011' }, 2, 'Ce rol are ACL-ul folosit în ip nat inside source list 1 pool POOL1?', [
    ['Identifică gazdele interioare care vor fi traduse (permit = traduce)', true, 'Nu filtrează traficul; doar selectează sursele pentru NAT.'],
    ['Blochează traficul nedorit din Internet', false, 'Filtrarea traficului este rolul unui ACL aplicat pe interfață, nu al celui din NAT.'],
    ['Definește adresele publice din pool', false, 'Pool-ul se definește cu ip nat pool.'],
    ['Alege portul sursă pentru PAT', false, 'Porturile le alege routerul.'],
  ], 'ACL în NAT = selector de adrese de tradus.'),
  single({ id: '4.1-012' }, 2, 'Pool-ul are 11 adrese publice, fără overload, iar 12 gazde interioare trimit trafic simultan. Ce se întâmplă cu a 12-a gazdă?', [
    ['Nu primește traducere; pachetele ei sunt aruncate până se eliberează o adresă', true, 'Dynamic NAT 1:1 nu poate depăși numărul de adrese din pool.'],
    ['Primește o adresă din afara pool-ului', false, 'Routerul folosește doar adresele din pool.'],
    ['Folosește PAT automat', false, 'PAT se activează doar cu overload.'],
    ['Routerul șterge cea mai veche intrare activă', false, 'Intrările active nu se șterg automat.'],
  ], 'Dynamic NAT fără overload se epuizează; soluția este overload.'),
  multi({ id: '4.1-013' }, 2, 'Ce trebuie configurat pentru ca dynamic NAT cu pool să funcționeze? (alege toate variantele corecte)', [
    ['ip nat inside pe interfața dinspre LAN', true, 'Marchează sursa de trafic care se traduce.'],
    ['ip nat outside pe interfața spre ISP', true, 'Marchează destinația traficului tradus.'],
    ['ip nat pool …', true, 'Definește adresele publice disponibile.'],
    ['Un ACL care permite gazdele de tradus', true, 'Selectează sursele.'],
    ['overload', false, 'Nu este necesar pentru NAT dinamic 1:1; este necesar pentru PAT.'],
  ], 'Două marcaje de interfață, pool, ACL, regula de legătură.'),

  // ======================= PAT =======================
  single({ id: '4.1-014' }, 1, 'Cum deosebește routerul gazdele interioare când toate folosesc aceeași adresă publică (PAT)?', [
    ['După portul sursă (sau identificatorul ICMP) din tabela de traduceri', true, 'Perechea adresă:port devine unică.'],
    ['După adresa MAC a gazdelor', false, 'MAC-ul este de nivel 2 și nu trece de router.'],
    ['După TTL-ul pachetelor', false, 'TTL nu are rol în NAT.'],
    ['După VLAN-ul din care vin', false, 'VLAN-ul nu este criteriu NAT.'],
  ], 'PAT = NAT + porturi.'),
  single({ id: '4.1-015' }, 1, 'Care comandă configurează PAT pe adresa interfeței Gi0/1, pentru gazdele permise de ACL 1?', [
    ['ip nat inside source list 1 interface g0/1 overload', true, 'Overload = PAT; interface = adresa interfeței.'],
    ['ip nat inside source list 1 interface g0/1', false, 'Fără overload este NAT dinamic 1:1 cu o singură adresă.'],
    ['ip nat outside source list 1 interface g0/1 overload', false, 'Outside source traduce sursele din exterior, nu din interior.'],
    ['ip nat pool g0/1 overload', false, 'Nu este sintaxa unui pool.'],
  ], 'PAT: …list N interface <if> overload.'),
  single({ id: '4.1-016' }, 2, 'Câte gazde interioare poate susține, în principiu, PAT pe o singură adresă publică?', [
    ['Zeci de mii de conexiuni, limitate de porturile disponibile (în jur de 64 000)', true, 'Fiecare conexiune folosește un port global distinct.'],
    ['O singură gazdă', false, 'Asta ar fi static NAT.'],
    ['Exact 254, ca o subrețea /24', false, 'Nu există legătură cu dimensiunea subrețelei private.'],
    ['Doar atâtea câte adrese are pool-ul', false, 'La PAT nu e obligatoriu un pool; limita sunt porturile.'],
  ], 'PAT scalează prin porturi, nu prin adrese.'),
  cli({ id: '4.1-017' }, 2, 'Ești în R1(config)#. Creează ACL-ul numerotat 1 care permite toată rețeaua 192.168.1.0/24 pentru NAT.', 'R1(config)#', 'access-list 1 permit 192.168.1.0 0.0.0.255', ['access-list 1 permit 192.168.1.0 0.0.0.255'], [
    { text: 'access-list 1 permit 192.168.1.0 255.255.255.0', why: 'ACL folosește wildcard, nu mască de subrețea.' },
    { text: 'access-list 1 deny 192.168.1.0 0.0.0.255', why: 'deny înseamnă „nu traduce”; vrem să traducem.' },
    { text: 'ip access-list 1 permit 192.168.1.0 0.0.0.255', why: 'Forma „ip access-list” cere ACL numit/extins în alt format; la numerotat se folosește access-list.' },
  ], 'Wildcard 0.0.0.255 = ultimul octet liber.', 'access-list <nr> permit <rețea> <wildcard>'),
  order({ id: '4.1-018' }, 2, 'Ordonează ce face routerul cu un pachet venit din LAN spre un server din Internet (inside source NAT).', [
    { text: 'Pachetul intră pe o interfață cu ip nat inside', why: 'Aici începe procesarea.' },
    { text: 'Routerul consultă tabela de rutare și alege interfața de ieșire', why: 'Rutarea are loc înainte de NAT pe drumul inside → outside.' },
    { text: 'Routerul traduce adresa sursă (și portul, la PAT) și creează intrarea în tabelă', why: 'Inside local devine inside global.' },
    { text: 'Pachetul iese pe interfața cu ip nat outside', why: 'Pachetul tradus pleacă spre ISP.' },
  ], 'Inside → outside: rutare, apoi NAT.'),
  single({ id: '4.1-019' }, 3, 'Care este ordinea corectă a operațiilor pentru un pachet care vine din exterior către o adresă inside global?', [
    ['Întâi NAT (destinația devine inside local), apoi rutare', true, 'Rutarea se face cu adresa privată, nu cu cea publică.'],
    ['Întâi rutare cu adresa publică, apoi NAT', false, 'Aceasta este ordinea pentru sensul inside → outside.'],
    ['Doar NAT, fără rutare', false, 'Routerul tot trebuie să știe pe ce interfață să trimită pachetul.'],
    ['Doar rutare, NAT nu mai intervine', false, 'Fără NAT, destinația ar rămâne publică și n-ar ajunge la gazdă.'],
  ], 'Outside → inside: NAT, apoi rutare.'),
  multi({ id: '4.1-020' }, 2, 'Care afirmații despre static NAT sunt adevărate? (alege toate variantele corecte)', [
    ['Consumă o adresă publică pentru fiecare gazdă mapată', true, 'Raport 1:1.'],
    ['Intrarea apare în tabelă fără să circule trafic', true, 'Este în configurație din start.'],
    ['Permite inițierea conexiunilor din exterior', true, 'Destinația publică poate fi tradusă imediat.'],
    ['Folosește porturi pentru a deosebi gazdele', false, 'Doar PAT și static PAT folosesc porturi.'],
    ['Expiră după 24 de ore de inactivitate', false, 'Intrările statice nu expiră.'],
  ], 'Static NAT: 1:1, permanent, bidirecțional.'),

  // ======================= Verificare și depanare =======================
  single({ id: '4.1-021' }, 1, 'Ce comandă afișează tabela curentă de traduceri NAT?', [
    ['show ip nat translations', true, 'Arată coloanele inside global/local și outside local/global.'],
    ['show ip route nat', false, 'Nu există o astfel de comandă; ruta nu arată traducerile.'],
    ['show nat table', false, 'Nu este sintaxa IOS.'],
    ['show ip interface brief', false, 'Arată starea interfețelor, nu traducerile.'],
  ], 'show ip nat translations.'),
  single({ id: '4.1-022' }, 2, 'În show ip nat statistics, ce înseamnă „Misses”?', [
    ['Pachete care nu au avut intrare în tabelă și au creat una nouă', true, 'Prima dată când o conexiune e văzută, routerul creează intrarea (miss).'],
    ['Pachete aruncate din cauza unui ACL', false, 'ACL-urile nu sunt numărate aici.'],
    ['Adrese din pool nefolosite', false, 'Utilizarea pool-ului apare separat (allocated/total).'],
    ['Erori de checksum', false, 'Nu este contor NAT.'],
  ], 'Hits = intrare existentă; Misses = intrare nouă creată.'),
  single({ id: '4.1-023' }, 2, 'R1 are regula NAT corectă, dar show ip nat translations este gol deși PC-ul pornește ping. Ce verifici primul?', [
    ['Că interfețele au ip nat inside / ip nat outside și sunt cele corecte', true, 'Fără marcaje (sau cu ele inversate), nu se creează nicio traducere.'],
    ['Versiunea IOS a ISP-ului', false, 'Nu are legătură: traducerea ar trebui să apară oricum în R1.'],
    ['Dacă PC-ul are adresă MAC unică', false, 'MAC-ul nu influențează NAT.'],
    ['Lungimea parolei enable', false, 'Nu are legătură.'],
  ], 'Tabela goală = NAT nu pornește: interfețe sau ACL.'),
  single({ id: '4.1-024' }, 2, 'ACL 1 conține permit 192.168.2.0 0.0.0.255, dar LAN-ul este 192.168.20.0/24. Ce observi?', [
    ['show access-lists arată 0 potriviri și gazdele nu sunt traduse', true, 'ACL-ul nu cuprinde LAN-ul real, deci gazdele nu intră în NAT.'],
    ['Gazdele sunt traduse, dar mai lent', false, 'Nu există traducere parțială; fără potrivire, nu se traduce.'],
    ['Routerul cade în loop', false, 'Nu se întâmplă așa ceva.'],
    ['NAT funcționează doar pentru gazda .10', false, 'ACL-ul nu include deloc 192.168.20.x.'],
  ], 'ACL greșit ⇒ 0 matches și lipsa traducerii.'),
  multi({ id: '4.1-025' }, 2, 'Care sunt limitări sau dezavantaje ale NAT/PAT? (alege toate variantele corecte)', [
    ['Conexiunile inițiate din exterior nu ajung la gazdele din spatele PAT, fără regulă statică', true, 'Nu există intrare în tabelă.'],
    ['Unele protocoale care includ adrese IP în date (FTP activ, SIP) pot avea nevoie de ALG', true, 'NAT nu modifică adresa din datele aplicației.'],
    ['Adaugă procesare pe router și trebuie depanat în plus', true, 'Fiecare conexiune trece prin tabelă.'],
    ['Face traficul criptat', false, 'NAT nu criptează.'],
    ['Elimină necesitatea rutei de întoarcere', false, 'Ruta de întoarcere rămâne necesară.'],
  ], 'NAT nu e transparent pentru toate aplicațiile.'),
  cli({ id: '4.1-026' }, 1, 'Ești în R1(config-if)#, pe interfața Gi0/1 spre ISP. Marchează-o ca interfață exterioară NAT.', 'R1(config-if)#', 'ip nat outside', ['ip nat outside'], [
    { text: 'ip nat inside', why: 'Aceasta marchează interfața dinspre LAN.' },
    { text: 'nat outside', why: 'Comanda IOS începe cu ip nat.' },
    { text: 'ip nat outside source', why: 'Este început de comandă globală (traducerea surselor din exterior).' },
  ], 'ip nat outside pe interfața spre ISP.', 'ip nat …'),
  cli({ id: '4.1-027' }, 2, 'Ești în R1(config)#. Mapează static adresa privată 192.168.1.10 la adresa publică 203.0.113.10.', 'R1(config)#', 'ip nat inside source static 192.168.1.10 203.0.113.10', ['ip nat inside source static 192.168.1.10 203.0.113.10'], [
    { text: 'ip nat inside source static 203.0.113.10 192.168.1.10', why: 'Ordinea e inversată: întâi inside local (privată), apoi inside global (publică).' },
    { text: 'ip nat static 192.168.1.10 203.0.113.10', why: 'Sintaxa corectă include inside source.' },
    { text: 'ip nat source static 192.168.1.10 203.0.113.10', why: 'Lipsește cuvântul „inside”.' },
  ], 'ip nat inside source static <local> <global>.', 'ip nat inside source static …'),
  cli({ id: '4.1-028' }, 2, 'Ești în R1(config)#. Definește pool-ul POOL1 cu adresele 203.0.113.20–203.0.113.30 și masca 255.255.255.0.', 'R1(config)#', 'ip nat pool POOL1 203.0.113.20 203.0.113.30 netmask 255.255.255.0', ['ip nat pool POOL1 203.0.113.20 203.0.113.30 netmask 255.255.255.0', 'ip nat pool POOL1 203.0.113.20 203.0.113.30 prefix-length 24'], [
    { text: 'ip nat pool POOL1 203.0.113.20 203.0.113.30 0.0.0.255', why: 'Pool-ul folosește mască (netmask), nu wildcard.' },
    { text: 'ip nat pool POOL1 203.0.113.20 255.255.255.0 203.0.113.30', why: 'Ordinea e: nume, adresa de început, adresa de final, apoi masca.' },
    { text: 'ip pool POOL1 203.0.113.20 203.0.113.30 netmask 255.255.255.0', why: 'Comanda este ip nat pool.' },
  ], 'ip nat pool <nume> <start> <end> netmask <mască>.', 'ip nat pool …'),
  cli({ id: '4.1-029' }, 2, 'Ești în R1(config)#. Configurează PAT pentru gazdele din ACL 1, folosind adresa interfeței g0/1.', 'R1(config)#', 'ip nat inside source list 1 interface g0/1 overload', ['ip nat inside source list 1 interface g0/1 overload', 'ip nat inside source list 1 interface gigabitethernet0/1 overload'], [
    { text: 'ip nat inside source list 1 interface g0/1', why: 'Fără overload nu este PAT.' },
    { text: 'ip nat inside source list 1 pool g0/1 overload', why: 'g0/1 nu este un pool; pool-ul se definește cu ip nat pool.' },
    { text: 'ip nat inside destination list 1 interface g0/1 overload', why: 'Nu există „inside destination”; traducerea se face pe sursă.' },
  ], 'Overload = PAT.', 'ip nat inside source list …'),
  match({ id: '4.1-030' }, 2, 'Potrivește comanda cu rolul ei.', [
    { left: 'ip nat inside', right: 'Marchează interfața dinspre LAN', why: 'Pachetele care intră aici sunt candidate pentru traducerea sursei.' },
    { left: 'ip nat pool', right: 'Definește adresele publice disponibile', why: 'Un interval de adrese.' },
    { left: 'overload', right: 'Transformă regula în PAT', why: 'Permite refolosirea adresei cu porturi diferite.' },
    { left: 'show ip nat translations', right: 'Afișează tabela de traduceri', why: 'Arată adresele (și porturile) traduse.' },
  ], [
    { text: 'Ștergerea tabelei MAC', why: 'Nu are legătură cu NAT.' },
  ], 'Fiecare comandă NAT are un rol distinct.'),
  single({ id: '4.1-031' }, 3, 'Ai o singură adresă publică (pe interfața Gi0/1) și vrei ca un server web intern 192.168.1.10 să fie accesibil din Internet pe portul 80. Ce folosești?', [
    ['Static PAT (port forwarding): ip nat inside source static tcp 192.168.1.10 80 interface g0/1 80', true, 'Mapează doar portul 80 al adresei interfeței către server.'],
    ['Dynamic NAT cu pool', false, 'Nu există pool, iar conexiunile din exterior nu creează intrări.'],
    ['PAT standard cu overload', false, 'Nu permite conexiuni inițiate din exterior.'],
    ['Un al doilea ACL pe Gi0/0', false, 'ACL-urile filtrează, nu traduc adrese.'],
  ], 'Pentru publicare cu o singură adresă: static PAT.'),
  single({ id: '4.1-032' }, 2, 'ISP-ul nu mai are adrese IPv4 pentru clienți și pune un NAT la nivelul lui, peste NAT-ul tău. Cum se numește acest mecanism?', [
    ['CGNAT (Carrier-Grade NAT)', true, 'NAT la scară de operator, peste cel al clientului.'],
    ['Static NAT', false, 'Static NAT este o mapare 1:1 pe router, nu la nivel de operator.'],
    ['NAT64', false, 'NAT64 traduce între IPv6 și IPv4 (alt scop).'],
    ['Proxy ARP', false, 'Proxy ARP nu este un tip de NAT.'],
  ], 'CGNAT = NAT la operator.'),
  single({ id: '4.1-033' }, 3, 'ISP-ul trebuie să facă ceva pentru ca răspunsurile către adresele publice ale pool-ului tău să ajungă la R1. Ce?', [
    ['Să aibă o rută către pool prin R1 (sau pool-ul să fie în subrețeaua legăturii)', true, 'Fără rută, răspunsurile către adresele traduse nu ajung la R1.'],
    ['Să configureze ip nat inside pe propriile interfețe', false, 'Ar traduce în plus; nu este necesar.'],
    ['Să dezactiveze rutarea', false, 'Ar opri tot traficul.'],
    ['Să copieze ACL-ul tău', false, 'ACL-ul nu e legat de livrarea răspunsurilor.'],
  ], 'Adresele publice trebuie să fie rutate spre tine.'),
  order({ id: '4.1-034' }, 2, 'Ordonează pașii de configurare a PAT pe interfață.', [
    { text: 'Marchează interfețele cu ip nat inside și ip nat outside', why: 'Fără ele, nicio regulă nu are efect.' },
    { text: 'Creează ACL-ul care permite rețeaua privată', why: 'Selectează gazdele de tradus.' },
    { text: 'Adaugă ip nat inside source list … interface … overload', why: 'Leagă ACL-ul de adresa de ieșire și activează PAT.' },
    { text: 'Verifică cu show ip nat translations și show ip nat statistics', why: 'Confirmi că apar intrări și contoarele cresc.' },
  ], 'Interfețe, ACL, regula, verificare.'),
  single({ id: '4.1-035' }, 2, 'În show ip nat translations, o intrare arată doar „--- 203.0.113.10 192.168.1.10 --- ---”, fără porturi. Ce tip de intrare este?', [
    ['Intrare simplă (static sau dinamică 1:1), fără porturi', true, 'Porturile apar doar la PAT / traduceri extended.'],
    ['Intrare PAT', false, 'PAT arată adresă:port.'],
    ['Intrare de tip outside source', false, 'Coloanele outside sunt „---”, deci exteriorul nu este tradus.'],
    ['O intrare eronată care trebuie ștearsă', false, 'Este formatul normal pentru NAT 1:1.'],
  ], 'Fără porturi = NAT 1:1.'),
  single({ id: '4.1-036' }, 2, 'Ce efect are clear ip nat translation * asupra unei intrări create cu ip nat inside source static?', [
    ['Nu o șterge: intrările statice rămân cât timp există comanda în configurație', true, 'Doar traducerile dinamice se șterg.'],
    ['O șterge definitiv din configurație', false, 'Comanda din configurație (running-config) rămâne.'],
    ['Reîncarcă routerul', false, 'Nu repornește nimic.'],
    ['O transformă în PAT', false, 'Nu schimbă tipul regulii.'],
  ], 'Doar traducerile dinamice sunt curățate.'),
  single({ id: '4.1-037' }, 1, 'NAT este, în sine, un firewall?', [
    ['Nu: ascunde adresele private, dar nu filtrează traficul; pentru asta ai ACL/firewall', true, 'Static NAT chiar expune gazda la exterior.'],
    ['Da, blochează orice trafic din exterior', false, 'Blocarea e efect secundar al PAT (lipsa intrării), nu o funcție de securitate garantată.'],
    ['Da, criptează traficul', false, 'NAT nu criptează.'],
    ['Da, dar doar pentru UDP', false, 'Nu există o astfel de regulă.'],
  ], 'NAT ≠ securitate.'),
  single({ id: '4.1-038' }, 2, 'Care adresă apare în coloana „Inside global” a unei intrări PAT cu overload pe interfață?', [
    ['Adresa IP a interfeței outside (plus un port)', true, 'Toate gazdele partajează adresa interfeței.'],
    ['Adresa privată a gazdei', false, 'Aceea este inside local.'],
    ['Adresa serverului din Internet', false, 'Aceea este outside global/local.'],
    ['Adresa de broadcast', false, 'Nu are legătură cu traducerea.'],
  ], 'PAT pe interfață: inside global = IP-ul interfeței outside.'),
  single({ id: '4.1-039' }, 3, 'Un coleg a inversat ip nat inside și ip nat outside pe cele două interfețe. Ce se întâmplă cu traficul PC → server?', [
    ['Nu se traduce sursa sau se traduce greșit, deci răspunsurile nu se întorc', true, 'Pachetul intră pe o interfață marcată outside, deci nu intră în regula inside source.'],
    ['Funcționează identic', false, 'Direcția traducerii depinde de aceste marcaje.'],
    ['Routerul traduce destinația în loc de sursă', false, 'Nu schimbă tipul traducerii, ci doar nu o declanșează corect.'],
    ['ACL-ul permite traficul automat', false, 'ACL-ul nu e legat de marcaje.'],
  ], 'Marcajele inside/outside definesc direcția.'),
  single({ id: '4.1-040' }, 2, 'Din ISP faci ping către adresa publică PAT (203.0.113.2) a lui R1 și răspunde R1, nu un PC din LAN. De ce?', [
    ['Adresa aparține interfeței lui R1; PAT nu creează intrări pentru conexiuni inițiate din exterior', true, 'Ping-ul ajunge la router; nu există mapare spre un PC.'],
    ['PAT a stricat tabela de rutare', false, 'Nu are legătură.'],
    ['ISP-ul trebuie să facă și el NAT', false, 'Nu este necesar.'],
    ['R1 nu are rută spre LAN', false, 'LAN-ul este conectat direct; problema este lipsa unei intrări PAT.'],
  ], 'PAT nu expune gazde interne fără regulă statică.'),
];
