import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.6 Configure and verify access control lists.
// Obiectivul oficial nu are sub-puncte; `sub` = '5.6'. Fiecare variantă are explicație (why).
const T = '5.6';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_6: Question[] = [
  // ======================= Concepte =======================
  single({ id: '5.6-001' }, 1, 'Ce este un ACL (Access Control List)?', [
    ['O listă ordonată de reguli permit/deny pe care routerul o aplică pachetelor', true, 'Fiecare pachet este comparat cu regulile; prima potrivire decide soarta lui.'],
    ['Un protocol care distribuie rute între routere', false, 'Aceea este funcția unui protocol de rutare (OSPF, EIGRP).'],
    ['O bază de date cu parolele utilizatorilor', false, 'Parolele sunt gestionate local sau prin AAA, nu prin ACL.'],
    ['O metodă de criptare a traficului', false, 'ACL filtrează, nu criptează; criptarea este rolul VPN/IPsec.'],
  ], 'ACL = reguli permit/deny aplicate în ordine pachetelor.'),
  single({ id: '5.6-002' }, 1, 'Cum evaluează un router liniile unui ACL?', [
    ['De sus în jos, oprindu-se la prima linie care se potrivește', true, 'Regulile următoare nu mai sunt citite; de aceea ordinea contează.'],
    ['Toate liniile, apoi alege cea mai restrictivă', false, 'Nu există „cea mai restrictivă”: contează doar prima potrivire.'],
    ['De jos în sus', false, 'Evaluarea începe de la prima linie (cel mai mic număr de secvență).'],
    ['În ordine aleatorie, pentru echilibrare', false, 'Procesarea este deterministă.'],
  ], 'Top-down, first match wins.'),
  single({ id: '5.6-003' }, 1, 'Un ACL conține o singură linie: „deny host 10.1.1.5”. Ce se întâmplă cu traficul de la celelalte adrese?', [
    ['Este blocat și el, din cauza deny-ului implicit de la final', true, 'Orice ACL se termină cu un „deny ip any any” invizibil; fără un permit explicit, restul traficului este aruncat.'],
    ['Trece normal, pentru că nu se potrivește cu linia deny', false, 'Nepotrivirea duce la regula implicită, care este deny.'],
    ['Este permis doar dacă are TTL mare', false, 'TTL nu influențează evaluarea unui ACL.'],
    ['Routerul refuză să aplice ACL-ul', false, 'ACL-ul se aplică; problema este lipsa unui permit.'],
  ], 'Un ACL cu doar deny blochează tot.'),
  single({ id: '5.6-004' }, 1, 'Ce poate potrivi un ACL standard?', [
    ['Doar adresa IP sursă', true, 'Standard = filtrare după sursă; de aceea este simplu, dar grosier.'],
    ['Adresa sursă, adresa destinație și porturile', false, 'Acestea sunt criteriile unui ACL extended.'],
    ['Numele utilizatorului', false, 'ACL-urile lucrează la L3/L4, nu cunosc utilizatori.'],
    ['Conținutul paginii web', false, 'ACL-urile nu inspectează aplicațiile (L7).'],
  ], 'Standard: doar sursa.'),
  single({ id: '5.6-005' }, 1, 'Care dintre numerele de mai jos identifică un ACL extended?', [
    ['101', true, 'Extended: 100–199 și 2000–2699.'],
    ['10', false, 'Standard: 1–99 (și 1300–1999).'],
    ['99', false, 'Tot standard.'],
    ['1350', false, 'Intră în intervalul standard extins 1300–1999.'],
  ], 'Extended = 100–199 / 2000–2699.'),
  single({ id: '5.6-006' }, 2, 'Care linie este un ACL standard numerotat valid care permite rețeaua 192.168.1.0/24?', [
    ['access-list 10 permit 192.168.1.0 0.0.0.255', true, '10 este în intervalul standard, iar 0.0.0.255 este wildcard-ul corect pentru /24.'],
    ['access-list 110 permit 192.168.1.0 0.0.0.255', false, '110 este un număr extended, care cere protocol, sursă și destinație.'],
    ['access-list 10 permit 192.168.1.0 255.255.255.0', false, '255.255.255.0 este o mască, nu un wildcard: ar potrivi cu totul alte adrese.'],
    ['ip access-list 10 permit 192.168.1.0', false, 'Aceasta nu este o sintaxă IOS validă.'],
  ], 'access-list <1-99> permit <rețea> <wildcard>.'),
  single({ id: '5.6-007' }, 2, 'Care este avantajul principal al unui ACL named față de unul numerotat (modul clasic)?', [
    ['Poți insera sau șterge linii individuale folosind numere de secvență', true, 'Permite modificări punctuale fără a reface tot ACL-ul; plus un nume descriptiv.'],
    ['Filtrează mai rapid pachetele', false, 'Performanța este aceeași.'],
    ['Poate filtra și Layer 2', false, 'ACL-urile IP rămân L3/L4, indiferent dacă au nume sau număr.'],
    ['Nu are deny implicit', false, 'Orice ACL are deny implicit la final.'],
  ], 'Named = nume + editare prin secvență.'),
  single({ id: '5.6-008' }, 2, 'Câte ACL IPv4 poți aplica pe o interfață, pe o direcție?', [
    ['Unul singur', true, 'Regula: un ACL per interfață, per direcție, per protocol. Regulile suplimentare se combină în același ACL.'],
    ['Câte vrei, evaluate în ordinea creării', false, 'Routerul acceptă doar unul pe direcție.'],
    ['Maximum două, unul standard și unul extended', false, 'Tipul nu schimbă limita: tot unul.'],
    ['Zero, ACL-urile se aplică doar pe VTY', false, 'Se aplică și pe interfețe cu ip access-group.'],
  ], 'Un ACL / interfață / direcție / protocol.'),

  // ======================= Wildcard =======================
  single({ id: '5.6-009' }, 1, 'Care este wildcard mask-ul pentru o rețea cu masca 255.255.255.0?', [
    ['0.0.0.255', true, 'Wildcard = 255.255.255.255 − masca; octetul fix devine 0, cel variabil 255.'],
    ['255.255.255.0', false, 'Aceasta este masca, nu wildcard-ul.'],
    ['0.0.0.0', false, 'Aceasta potrivește exact o singură adresă (host).'],
    ['255.255.255.255', false, 'Aceasta potrivește orice adresă (any).'],
  ], 'Wildcard = inversul măștii.'),
  single({ id: '5.6-010' }, 2, 'Care este wildcard mask-ul pentru o rețea /26 (255.255.255.192)?', [
    ['0.0.0.63', true, '255 − 192 = 63; ultimul octet are 6 biți variabili (64 de adrese).'],
    ['0.0.0.31', false, 'Aceasta corespunde unui /27.'],
    ['0.0.0.127', false, 'Aceasta corespunde unui /25.'],
    ['0.0.0.192', false, 'Aceasta este reprezentarea greșită a măștii, nu wildcard-ul.'],
  ], '/26 → 0.0.0.63.'),
  single({ id: '5.6-011' }, 1, 'Ce echivalează cuvântul-cheie „host 10.1.1.5” într-un ACL?', [
    ['10.1.1.5 0.0.0.0', true, 'Toți cei 32 de biți trebuie să fie egali: o singură adresă.'],
    ['10.1.1.5 255.255.255.255', false, 'Aceasta ar ignora toți biții, deci ar potrivi orice adresă.'],
    ['10.1.1.0 0.0.0.255', false, 'Aceasta este rețeaua /24, nu o singură gazdă.'],
    ['0.0.0.0 255.255.255.255', false, 'Aceasta este „any”.'],
  ], 'host x = x 0.0.0.0.'),
  single({ id: '5.6-012' }, 1, 'Ce echivalează cuvântul-cheie „any”?', [
    ['0.0.0.0 255.255.255.255', true, 'Niciun bit nu trebuie să fie egal: orice adresă se potrivește.'],
    ['0.0.0.0 0.0.0.0', false, 'Aceasta ar potrivi doar adresa 0.0.0.0.'],
    ['255.255.255.255 0.0.0.0', false, 'Aceasta ar potrivi doar adresa de broadcast limitat.'],
    ['127.0.0.1 0.0.0.0', false, 'Aceasta ar potrivi doar loopback-ul.'],
  ], 'any = 0.0.0.0 255.255.255.255.'),
  single({ id: '5.6-013' }, 2, 'Ce linie potrivește toate adresele de la 192.168.4.0 la 192.168.7.255?', [
    ['permit 192.168.4.0 0.0.3.255', true, 'Al treilea octet variază în 4 valori (4–7): wildcard 3; ultimul octet variază complet: 255.'],
    ['permit 192.168.4.0 0.0.7.255', false, 'Ar acoperi 192.168.4.0 – 192.168.11.255, adică 8 valori.'],
    ['permit 192.168.4.0 0.0.0.255', false, 'Ar acoperi doar 192.168.4.0/24.'],
    ['permit 192.168.4.0 0.0.4.255', false, 'Un wildcard de 4 nu corespunde unui bloc contiguu (0100 în binar).'],
  ], 'Blocuri de 4 în octetul 3 → 0.0.3.255.'),
  single({ id: '5.6-014' }, 2, 'Linia „permit 10.1.1.0 0.0.0.15” — ce adrese potrivește?', [
    ['10.1.1.0 până la 10.1.1.15', true, 'Ultimii 4 biți sunt liberi: 16 adrese consecutive.'],
    ['10.1.1.0 până la 10.1.1.255', false, 'Aceasta ar fi wildcard 0.0.0.255.'],
    ['Doar 10.1.1.15', false, 'Valoarea 15 este wildcard-ul, nu adresa.'],
    ['10.1.1.16 până la 10.1.1.31', false, 'Adresa de bază este 10.1.1.0, deci intervalul începe acolo.'],
  ], '0.0.0.15 → 16 adrese.'),
  single({ id: '5.6-015' }, 3, 'Care este wildcard mask-ul care potrivește rețeaua 172.16.32.0/20?', [
    ['0.0.15.255', true, '/20 are 12 biți de gazdă: ultimii 4 biți ai octetului 3 și tot octetul 4 → 15 și 255. Interval: 172.16.32.0–172.16.47.255.'],
    ['0.0.31.255', false, 'Ar corespunde unui /19.'],
    ['0.0.7.255', false, 'Ar corespunde unui /21.'],
    ['0.0.16.255', false, '16 nu este o valoare de wildcard contiguă validă (10000 în binar).'],
  ], '/20 → 0.0.15.255.'),

  // ======================= Plasare și direcție =======================
  single({ id: '5.6-016' }, 1, 'Unde se plasează, de regulă, un ACL standard?', [
    ['Cât mai aproape de destinație', true, 'Fiind grosier (doar sursa), lângă sursă ar bloca și traficul legitim către alte destinații.'],
    ['Cât mai aproape de sursă', false, 'Aceasta este regula pentru extended.'],
    ['Oriunde, nu contează', false, 'Contează: plasarea afectează cât de mult trafic e blocat sau irosit.'],
    ['Doar pe switch-uri L2', false, 'ACL-urile IP se aplică pe interfețe L3.'],
  ], 'Standard → destinație.'),
  single({ id: '5.6-017' }, 1, 'Unde se plasează, de regulă, un ACL extended?', [
    ['Cât mai aproape de sursă', true, 'Poate fi precis, deci oprește traficul interzis devreme, economisind banda rețelei.'],
    ['Cât mai aproape de destinație', false, 'Aceasta este regula pentru standard.'],
    ['Pe linia VTY', false, 'VTY are propriul mecanism (access-class); nu este regula generală.'],
    ['Doar pe interfața loopback', false, 'Loopback-ul nu este locul obișnuit pentru filtrare.'],
  ], 'Extended → sursă.'),
  single({ id: '5.6-018' }, 2, 'De ce un ACL standard NU se pune lângă sursă?', [
    ['Ar bloca tot traficul acelei surse către toate destinațiile, nu doar către cea vizată', true, 'Standard nu poate spune „doar către serverul X”.'],
    ['Pentru că routerul sursă nu suportă ACL', false, 'Orice router suportă ACL.'],
    ['Pentru că devine extended automat', false, 'Un ACL nu își schimbă tipul.'],
    ['Pentru că TTL scade la zero', false, 'TTL nu are legătură cu plasarea ACL.'],
  ], 'Standard = prea grosier lângă sursă.'),
  single({ id: '5.6-019' }, 2, 'Ce înseamnă „ip access-group 101 in”?', [
    ['ACL-ul 101 verifică pachetele care intră pe acea interfață, înainte de rutare', true, '„in” este judecat din punctul de vedere al routerului: pachetul intră pe interfață.'],
    ['ACL-ul verifică pachetele care ies din rețeaua locală spre Internet', false, 'Direcția se raportează la interfață, nu la „interior/exterior”.'],
    ['ACL-ul 101 se aplică pe linia VTY', false, 'Pentru VTY se folosește access-class.'],
    ['ACL-ul este șters de pe interfață', false, 'Ștergerea se face cu forma „no ip access-group”.'],
  ], 'in = pachetele care intră pe interfață.'),
  single({ id: '5.6-020' }, 2, 'Ai aplicat un ACL outbound pe Gi0/1 care blochează ICMP. Un ping pornit din router (extended ping) spre o gazdă din spatele Gi0/1 va fi…', [
    ['Nefiltrat de ACL-ul outbound, pentru că ACL-urile outbound nu filtrează traficul generat de router', true, 'Pachetele proprii ale routerului nu sunt verificate de ACL-urile outbound.'],
    ['Blocat, pentru că ACL-ul se aplică tuturor pachetelor', false, 'Există această excepție: traficul generat local.'],
    ['Dublat', false, 'Nu există un asemenea comportament.'],
    ['Redirecționat spre VTY', false, 'Nu are legătură cu VTY.'],
  ], 'Outbound nu filtrează traficul generat de router.'),

  // ======================= Sintaxă, ordine, VTY =======================
  single({ id: '5.6-021' }, 2, 'Care comandă restricționează accesul la liniile VTY folosind ACL-ul 10?', [
    ['access-class 10 in (în line vty 0 15)', true, 'Pe linii se folosește access-class, nu access-group.'],
    ['ip access-group 10 in (în line vty 0 15)', false, 'ip access-group este pentru interfețe.'],
    ['ip access-class 10 in (în interfața Gi0/0)', false, 'access-class se configurează sub linie, nu sub interfață.'],
    ['transport input 10', false, 'transport input alege protocoalele (ssh/telnet), nu un ACL.'],
  ], 'VTY → access-class.'),
  single({ id: '5.6-022' }, 2, 'Care linie permite DOAR HTTP de la 192.168.1.0/24 către serverul 10.0.0.80?', [
    ['permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.80 eq 80', true, 'Protocol TCP, sursa /24, destinația un host, port destinație 80.'],
    ['permit ip 192.168.1.0 0.0.0.255 host 10.0.0.80', false, '„ip” permite toate protocoalele, nu doar web.'],
    ['permit tcp host 10.0.0.80 192.168.1.0 0.0.0.255 eq 80', false, 'Sursa și destinația sunt inversate.'],
    ['permit udp 192.168.1.0 0.0.0.255 host 10.0.0.80 eq 80', false, 'HTTP folosește TCP, nu UDP.'],
  ], 'Extended: protocol, sursă, destinație, port.'),
  single({ id: '5.6-023' }, 2, 'Un ACL are pe prima linie „permit ip any any”, iar pe a doua „deny tcp any host 10.1.1.80 eq 23”. Ce efect are a doua linie?', [
    ['Niciunul: primul permit potrivește orice pachet, deci a doua linie nu este citită niciodată', true, 'Prima potrivire decide; ordinea greșită anulează deny-ul.'],
    ['Blochează Telnet către 10.1.1.80', false, 'Ar bloca doar dacă ar fi evaluată înaintea permit-ului.'],
    ['Blochează tot traficul', false, 'Primul permit lasă să treacă tot.'],
    ['ACL-ul este respins la aplicare', false, 'Sintaxa este validă; defectul este logic, nu sintactic.'],
  ], 'Liniile specifice se pun înaintea celor generale.'),
  single({ id: '5.6-024' }, 2, 'Adaugi într-un ACL named existent o linie nouă fără număr de secvență. Unde apare?', [
    ['La sfârșitul ACL-ului, după toate liniile existente', true, 'Primește următorul număr liber (de exemplu 50 după 40).'],
    ['La început', false, 'Doar un număr mic de secvență ar plasa-o la început.'],
    ['Înaintea ultimului deny', false, 'Nu există o asemenea logică automată.'],
    ['Nu se adaugă', false, 'Se adaugă, dar la final.'],
  ], 'Fără secvență → la sfârșit.'),
  single({ id: '5.6-025' }, 3, 'Pe interfața Gi0/0 (in) ai ACL-ul „permit tcp any any eq 80”. Un PC din acea rețea nu mai reușește nici ping, nici rezolvare DNS. De ce?', [
    ['Deny-ul implicit de la final aruncă tot ce nu este HTTP: ICMP, DNS (UDP 53) etc.', true, 'Singura linie permite doar TCP 80; restul cade pe regula implicită.'],
    ['ICMP și DNS sunt blocate de default pe routere', false, 'Nu sunt blocate fără un ACL.'],
    ['TCP 80 consumă toată banda', false, 'Nu există un asemenea efect.'],
    ['ACL-ul s-a aplicat pe interfața greșită, dar fără efect', false, 'Efectul există, chiar este cel descris.'],
  ], 'Un singur permit + deny implicit = restul blocat.'),
  single({ id: '5.6-026' }, 2, '„show ip interface Gi0/0” afișează „Inbound access list is not set”, deși ai creat ACL-ul WEB. Ce lipsește?', [
    ['Aplicarea ACL-ului pe interfață: ip access-group WEB in', true, 'Un ACL creat dar neaplicat nu filtrează nimic.'],
    ['Comanda reload', false, 'Nu este necesară repornirea.'],
    ['O rută statică', false, 'Rutele nu leagă ACL-ul de interfață.'],
    ['Activarea CEF', false, 'Nu are legătură cu ACL-ul.'],
  ], 'Creat ≠ aplicat.'),
  single({ id: '5.6-027' }, 3, 'Ai aplicat „ip access-group BLOCK in” pe o interfață, dar ACL-ul BLOCK nu există în configurație. Ce se întâmplă cu traficul?', [
    ['Trece nefiltrat: un ACL referit dar inexistent (gol) nu blochează nimic', true, 'Deny-ul implicit se aplică doar unui ACL care există și are cel puțin o linie.'],
    ['Este blocat complet, din cauza deny-ului implicit', false, 'Un ACL inexistent este tratat ca „permite tot”.'],
    ['Interfața intră în err-disabled', false, 'err-disabled este un mecanism de securitate pe porturi de switch, fără legătură.'],
    ['Routerul repornește', false, 'Nu există un asemenea efect.'],
  ], 'ACL inexistent = permit all.'),

  // ======================= Multi =======================
  multi({ id: '5.6-028' }, 2, 'Ce criterii poate potrivi un ACL extended? (alege toate variantele corecte)', [
    ['Protocolul (ip, tcp, udp, icmp …)', true, 'Primul câmp al unei linii extended.'],
    ['Adresa IP sursă', true, 'Cu wildcard, host sau any.'],
    ['Adresa IP destinație', true, 'Poate fi diferită de sursă ca precizie.'],
    ['Portul TCP/UDP', true, 'Cu operatorii eq, neq, gt, lt, range.'],
    ['Numele utilizatorului autentificat', false, 'ACL-urile nu cunosc utilizatori.'],
  ], 'Extended: protocol, sursă, destinație, porturi.'),
  multi({ id: '5.6-029' }, 2, 'Care dintre următoarele comenzi pot verifica ACL-urile? (alege toate variantele corecte)', [
    ['show access-lists', true, 'Afișează toate ACL-urile cu contoarele de potriviri.'],
    ['show ip access-lists', true, 'Doar ACL-urile IPv4.'],
    ['show ip interface GigabitEthernet0/0', true, 'Arată ce ACL este aplicat in/out pe interfață.'],
    ['show running-config | section access', true, 'Afișează liniile de configurare legate de ACL.'],
    ['show acl brief', false, 'Nu este o comandă IOS.'],
  ], 'show access-lists, show ip interface, show run.'),
  multi({ id: '5.6-030' }, 2, 'Care afirmații despre ACL sunt adevărate? (alege toate variantele corecte)', [
    ['ACL-urile sunt stateless: fiecare pachet este judecat separat', true, 'Nu țin tabelă de conexiuni.'],
    ['Orice ACL se termină cu un deny implicit', true, 'Regula invizibilă „deny ip any any”.'],
    ['Un ACL named poate fi editat cu numere de secvență', true, 'Insert/șterge fără a reface ACL-ul.'],
    ['Un ACL devine activ imediat după creare, fără să fie aplicat', false, 'Trebuie aplicat cu access-group sau access-class.'],
    ['Un ACL standard poate filtra după portul destinație', false, 'Doar extended poate.'],
  ], 'Stateless, deny implicit, editabil prin secvență.'),
  multi({ id: '5.6-031' }, 3, 'Care situații pot face ca un ACL să blocheze traficul dorit? (alege toate variantele corecte)', [
    ['ACL-ul conține doar linii deny', true, 'Deny-ul implicit blochează restul.'],
    ['Un deny general este plasat înaintea unui permit specific', true, 'Deny-ul prinde pachetul primul.'],
    ['Lipsește un permit pentru traficul de întoarcere sau pentru ICMP/DNS necesare', true, 'Orice nu e permis explicit cade pe deny implicit.'],
    ['Wildcard-ul folosit este o mască (255.255.255.0) în loc de 0.0.0.255', true, 'Potrivește alte adrese decât cele intenționate.'],
    ['ACL-ul referit de access-group nu există în configurație', false, 'Acesta permite tot, nu blochează.'],
  ], 'Doar deny, ordine greșită, permit lipsă, wildcard greșit.'),

  // ======================= Match / Order =======================
  match({ id: '5.6-032' }, 2, 'Potrivește prefixul cu wildcard mask-ul corespunzător.', [
    { left: '/24', right: '0.0.0.255', why: '8 biți de gazdă → ultimul octet 255.' },
    { left: '/26', right: '0.0.0.63', why: '6 biți de gazdă → 64 de adrese → wildcard 63.' },
    { left: '/28', right: '0.0.0.15', why: '4 biți de gazdă → 16 adrese → wildcard 15.' },
    { left: '/30', right: '0.0.0.3', why: '2 biți de gazdă → 4 adrese → wildcard 3.' },
  ], [
    { text: '0.0.0.31', why: 'Corespunde lui /27.' },
    { text: '0.0.0.127', why: 'Corespunde lui /25.' },
  ], 'Wildcard = 2^(32−prefix) − 1 în ultimul octet variabil.'),
  match({ id: '5.6-033' }, 2, 'Potrivește comanda cu rolul ei.', [
    { left: 'ip access-group ACL in', right: 'Aplică un ACL pe o interfață', why: 'Se dă în modul de configurare al interfeței.' },
    { left: 'access-class 10 in', right: 'Aplică un ACL pe liniile VTY', why: 'Se dă sub line vty.' },
    { left: 'show access-lists', right: 'Afișează liniile ACL și contoarele de potriviri', why: 'Principala comandă de verificare.' },
    { left: 'ip access-list resequence NAME 10 10', right: 'Renumerotează liniile unui ACL', why: 'Util când nu mai ai spații libere între numere.' },
  ], [
    { text: 'Șterge toate ACL-urile din router', why: 'Nu există o asemenea comandă simplă; ștergerea se face cu no ip access-list.' },
    { text: 'Activează NAT pe o interfață', why: 'NAT se activează cu ip nat inside/outside.' },
  ], 'access-group → interfață; access-class → VTY.'),
  order({ id: '5.6-034' }, 3, 'Ordonează ce se întâmplă cu un pachet care intră pe o interfață cu ACL inbound și iese printr-o interfață cu ACL outbound.', [
    { text: 'Pachetul intră pe interfața de intrare', why: 'Începutul procesării.' },
    { text: 'Se evaluează ACL-ul inbound, de sus în jos', why: 'Dacă este refuzat, pachetul este aruncat aici.' },
    { text: 'Routerul caută destinația în tabela de rutare', why: 'Se alege interfața de ieșire, doar pentru pachetele permise.' },
    { text: 'Se evaluează ACL-ul outbound al interfeței de ieșire', why: 'Al doilea punct de filtrare.' },
    { text: 'Pachetul este trimis pe interfața de ieșire', why: 'Doar după ce a trecut ambele filtre.' },
  ], 'In → rutare → out.'),
  order({ id: '5.6-035' }, 2, 'Ordonează pașii recomandați pentru a introduce un ACL nou în rețea.', [
    { text: 'Stabilește exact ce trafic trebuie permis și ce trebuie blocat', why: 'Cerința guvernează toate deciziile.' },
    { text: 'Scrie ACL-ul cu liniile specifice înaintea celor generale', why: 'Prima potrivire decide, deci ordinea este critică.' },
    { text: 'Alege interfața și direcția după regula de plasare', why: 'Extended lângă sursă, standard lângă destinație.' },
    { text: 'Aplică ACL-ul cu ip access-group', why: 'Abia acum devine activ.' },
    { text: 'Testează traficul și verifică contoarele cu show access-lists', why: 'Confirmi că liniile potrivite sunt cele așteptate.' },
  ], 'Cerință → scriere → plasare → aplicare → verificare.'),

  // ======================= CLI =======================
  cli({ id: '5.6-036' }, 2, 'Ești în R1(config)#. Creează un ACL standard numerotat 10 care permite rețeaua 192.168.1.0/24.', 'R1(config)#', 'access-list 10 permit 192.168.1.0 0.0.0.255', ['access-list 10 permit 192.168.1.0 0.0.0.255'], [
    { text: 'access-list 10 permit 192.168.1.0 255.255.255.0', why: 'A doua valoare trebuie să fie wildcard (0.0.0.255), nu masca.' },
    { text: 'access-list 110 permit 192.168.1.0 0.0.0.255', why: '110 este un număr extended; ar cere protocol și destinație.' },
    { text: 'ip access-list 10 permit 192.168.1.0 0.0.0.255', why: 'Forma numerotată clasică începe cu access-list, nu ip access-list.' },
  ], 'access-list <număr> permit <rețea> <wildcard>.', 'access-list …'),
  cli({ id: '5.6-037' }, 2, 'Ești în R1(config)#. Creează un ACL extended cu numele WEB și intră în modul lui de configurare.', 'R1(config)#', 'ip access-list extended WEB', ['ip access-list extended WEB'], [
    { text: 'access-list extended WEB', why: 'Lipsește cuvântul ip.' },
    { text: 'ip access-list WEB extended', why: 'Ordinea corectă este tip apoi nume.' },
    { text: 'ip access-list standard WEB', why: 'Creează un ACL standard, nu extended.' },
  ], 'ip access-list extended <nume>.', 'ip access-list …'),
  cli({ id: '5.6-038' }, 2, 'Ești în R1(config-if)# pe Gi0/0. Aplică ACL-ul WEB pe pachetele care intră.', 'R1(config-if)#', 'ip access-group WEB in', ['ip access-group WEB in'], [
    { text: 'ip access-class WEB in', why: 'access-class este pentru liniile VTY.' },
    { text: 'access-group WEB in', why: 'Lipsește ip la început.' },
    { text: 'ip access-group in WEB', why: 'Numele ACL-ului vine înaintea direcției.' },
  ], 'ip access-group <ACL> in|out.', 'ip access-group …'),
  cli({ id: '5.6-039' }, 2, 'Ești în R1(config-line)# pe line vty 0 15. Restricționează accesul folosind ACL-ul 10 pentru conexiunile care intră.', 'R1(config-line)#', 'access-class 10 in', ['access-class 10 in'], [
    { text: 'ip access-group 10 in', why: 'Nu este disponibilă pe linii; acolo se folosește access-class.' },
    { text: 'access-class in 10', why: 'Numărul ACL-ului vine înaintea direcției.' },
    { text: 'transport input 10', why: 'transport input selectează protocoale, nu un ACL.' },
  ], 'access-class <ACL> in.', 'access-class …'),
  cli({ id: '5.6-040' }, 1, 'Ești în R1#. Afișează toate ACL-urile cu contoarele de potriviri.', 'R1#', 'show access-lists', ['show access-lists'], [
    { text: 'show acl', why: 'Nu este o comandă IOS.' },
    { text: 'show ip acl all', why: 'Nu este sintaxa IOS.' },
    { text: 'show running-config access', why: 'Comanda corectă este show running-config, eventual cu filtrare prin | section; „access” nu este un parametru.' },
  ], 'show access-lists (sau show ip access-lists).', 'show …'),
];
