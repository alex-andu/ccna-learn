import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.4 Describe security password policy elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics).
// Obiectivul oficial nu are sub-puncte; `sub` = '5.4'. Fiecare variantă are explicație (why).
const T = '5.4';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_4: Question[] = [
  // ======================= Concepte generale =======================
  single({ id: '5.4-001' }, 1, 'Care dintre acestea sunt alternative sau completări ale parolelor menționate în obiectivul 5.4?', [
    ['Autentificarea multifactor, certificatele și biometria', true, 'Sunt cele trei alternative enumerate în obiectiv.'],
    ['ACL-urile, NAT și VLAN-urile', false, 'Sunt controale de rețea, nu metode de autentificare.'],
    ['SNMP, syslog și NTP', false, 'Sunt servicii de administrare.'],
    ['RIP, OSPF și EIGRP', false, 'Sunt protocoale de rutare.'],
  ], 'MFA, certificate, biometrie.'),
  single({ id: '5.4-002' }, 1, 'Ce este autentificarea multifactor (MFA)?', [
    ['Folosirea a cel puțin doi factori din categorii diferite (știi, ai, ești)', true, 'Compromiterea unui singur factor nu ajunge pentru acces.'],
    ['Folosirea a două parole diferite', false, 'Ambele ar fi „ceva ce știi”: aceeași categorie.'],
    ['Autentificarea pe mai multe echipamente deodată', false, 'Nu are legătură cu factorii.'],
    ['Criptarea parolelor cu mai mulți algoritmi', false, 'Aceasta este stocarea, nu autentificarea multifactor.'],
  ], 'MFA = categorii diferite de factori.'),

  // ======================= Politica =======================
  single({ id: '5.4-003' }, 2, 'Care dintre acestea este un element de complexitate a parolei?', [
    ['Lungimea și combinarea literelor mari, mici, cifrelor și simbolurilor', true, 'Extinde spațiul de căutare pentru atacator.'],
    ['Rotirea periodică a parolei', false, 'Rotirea este un element de management.'],
    ['Blocarea contului după eșecuri', false, 'Blocarea este o măsură de management/apărare.'],
    ['Folosirea unui manager de parole', false, 'Este o unealtă de management.'],
  ], 'Complexitate: lungime + tipuri de caractere.'),
  single({ id: '5.4-004' }, 2, 'Care dintre acestea este un element de management al parolelor?', [
    ['Nereutilizarea parolelor vechi și schimbarea lor la compromitere', true, 'Istoricul și rotirea țin de management.'],
    ['Folosirea simbolurilor în parolă', false, 'Aceasta este complexitate.'],
    ['Parola de minimum 8 caractere', false, 'Lungimea este complexitate.'],
    ['Evitarea cuvintelor din dicționar', false, 'Aceasta ține de complexitate/imprevizibilitate.'],
  ], 'Management: rotire, istoric, stocare, blocare, resetare.'),
  single({ id: '5.4-005' }, 2, 'De ce este recomandat să folosești o parolă diferită pe fiecare serviciu?', [
    ['Pentru ca o scurgere de la un site să nu compromită conturile de pe alte site-uri', true, 'Previne credential stuffing.'],
    ['Pentru că parolele identice sunt invalide', false, 'Sunt valide, dar riscante.'],
    ['Pentru că routerul le respinge', false, 'Nu depinde de router.'],
    ['Pentru a economisi spațiu', false, 'Nu are legătură.'],
  ], 'Unicitate = izolarea breșelor.'),

  // ======================= Atacuri =======================
  single({ id: '5.4-006' }, 2, 'Care este diferența dintre brute force și dictionary attack?', [
    ['Brute force încearcă sistematic toate combinațiile; dictionary încearcă parole uzuale și variații', true, 'Dictionary profită de alegerile previzibile ale oamenilor.'],
    ['Nu există nicio diferență', false, 'Metodele diferă prin spațiul încercat.'],
    ['Dictionary folosește doar biometrie', false, 'Nu are legătură cu biometria.'],
    ['Brute force funcționează doar pe certificate', false, 'Se folosește pe parole și chei.'],
  ], 'Brute force = tot; dictionary = uzuale.'),
  single({ id: '5.4-007' }, 2, 'Ce rol are salt-ul în stocarea parolelor?', [
    ['Face hash-urile diferite pentru aceeași parolă și face inutile tabelele precalculate', true, 'Un salt unic per parolă anulează rainbow tables.'],
    ['Face parola mai lungă pentru utilizator', false, 'Salt-ul e adăugat de sistem, nu de utilizator.'],
    ['Criptează conexiunea', false, 'Nu are legătură cu transportul.'],
    ['Reține parola în clar', false, 'Nu stochează parola în clar.'],
  ], 'Salt = valoare aleatoare unică per parolă.'),
  single({ id: '5.4-008' }, 3, 'Care modificare crește cel mai mult entropia unei parole aleatoare?', [
    ['Creșterea lungimii', true, 'Fiecare caracter nou multiplică spațiul de căutare cu mărimea alfabetului.'],
    ['Adăugarea unui singur simbol într-o parolă scurtă', false, 'Extinde alfabetul, dar mai puțin decât lungimea.'],
    ['Folosirea numai a majusculelor', false, 'Restrânge alfabetul.'],
    ['Schimbarea fontului', false, 'Nu are efect.'],
  ], 'Lungimea domină.'),

  // ======================= MFA =======================
  single({ id: '5.4-009' }, 1, 'Care sunt cele trei categorii clasice de factori de autentificare?', [
    ['Ceva ce știi, ceva ce ai, ceva ce ești', true, 'Knowledge, possession, inherence.'],
    ['Ceva scurt, ceva lung, ceva complex', false, 'Nu sunt factori de autentificare.'],
    ['Username, parolă, domeniu', false, 'Sunt elemente de cont, nu categorii de factori.'],
    ['Local, remote, cloud', false, 'Nu sunt factori.'],
  ], 'Know / have / are.'),
  single({ id: '5.4-010' }, 2, 'Parola și răspunsul la o întrebare secretă reprezintă MFA?', [
    ['Nu: ambele sunt „ceva ce știi”, deci aceeași categorie', true, 'MFA cere categorii diferite.'],
    ['Da, sunt doi factori diferiți', false, 'Sunt doi pași, dar un singur tip de factor.'],
    ['Da, dacă sunt lungi', false, 'Lungimea nu schimbă categoria.'],
    ['Da, dacă întrebarea e criptată', false, 'Criptarea nu schimbă categoria.'],
  ], 'Același tip de factor ≠ MFA.'),
  single({ id: '5.4-011' }, 2, 'Ce este un TOTP?', [
    ['Un cod de unică folosință, calculat din timp și o cheie partajată, valabil scurt timp', true, 'Aplicațiile de autentificare generează astfel de coduri.'],
    ['Un tip de parolă statică', false, 'Este de unică folosință.'],
    ['Un protocol de rutare', false, 'Nu este protocol de rutare.'],
    ['Un hash MD5 al parolei', false, 'Nu este un hash de parolă.'],
  ], 'TOTP = Time-based One-Time Password.'),
  single({ id: '5.4-012' }, 3, 'Care metodă de al doilea factor este în general cea mai rezistentă la phishing?', [
    ['O cheie de securitate FIDO2 (passkey)', true, 'Este legată de domeniul real al site-ului și nu poate fi „dată” unui site fals.'],
    ['Cod prin SMS', false, 'Poate fi interceptat sau redirecționat (SIM swapping) și cerut de un site fals.'],
    ['O întrebare secretă', false, 'Este un factor de cunoaștere ușor de aflat sau de păcălit.'],
    ['O a doua parolă', false, 'Aceeași categorie de factor și tot phishable.'],
  ], 'FIDO2/passkeys = rezistente la phishing.'),

  // ======================= Certificate =======================
  single({ id: '5.4-013' }, 2, 'Ce rol are o autoritate de certificare (CA)?', [
    ['Semnează certificate care leagă o identitate de o cheie publică', true, 'Clienții au încredere în CA și, prin extensie, în certificatele emise.'],
    ['Stochează parolele utilizatorilor', false, 'Nu stochează parole.'],
    ['Rutează traficul între site-uri', false, 'Nu are rol de rutare.'],
    ['Atribuie adrese IP', false, 'Aceasta este DHCP.'],
  ], 'CA = autoritate care semnează certificatele.'),
  single({ id: '5.4-014' }, 2, 'Care cheie nu trebuie să părăsească niciodată proprietarul unui certificat?', [
    ['Cheia privată', true, 'Dovedește identitatea; dacă e furată, certificatul e compromis.'],
    ['Cheia publică', false, 'Este inclusă în certificat și se distribuie liber.'],
    ['Numele CA', false, 'Nu este o cheie.'],
    ['Perioada de valabilitate', false, 'Nu este o cheie.'],
  ], 'Privată = secretă; publică = în certificat.'),
  single({ id: '5.4-015' }, 2, 'Un browser refuză un certificat cu semnătură corectă pentru că data curentă este după „notAfter”. Care este motivul?', [
    ['Certificatul a expirat', true, 'Validarea verifică perioada de valabilitate.'],
    ['Cheia publică este prea scurtă', false, 'Nu aceasta e problema descrisă.'],
    ['Certificatul este self-signed', false, 'Descrierea nu spune asta; este vorba despre dată.'],
    ['Serverul folosește IPv6', false, 'Nu are legătură.'],
  ], 'Valabilitate depășită = expirat.'),

  // ======================= Biometrie =======================
  single({ id: '5.4-016' }, 2, 'Ce măsoară FAR (False Acceptance Rate) la un sistem biometric?', [
    ['Cât de des este acceptat un intrus (persoană neautorizată)', true, 'Este rata acceptărilor false.'],
    ['Cât de des este respins un utilizator legitim', false, 'Aceasta este FRR.'],
    ['Viteza de scanare', false, 'Nu este un indicator FAR.'],
    ['Costul senzorului', false, 'Nu este un indicator FAR.'],
  ], 'FAR = intruși acceptați.'),
  single({ id: '5.4-017' }, 2, 'Ce măsoară FRR (False Rejection Rate)?', [
    ['Cât de des este respins un utilizator autorizat', true, 'Este rata respingerilor false.'],
    ['Cât de des este acceptat un intrus', false, 'Aceasta este FAR.'],
    ['Cât timp ține o parolă', false, 'Nu are legătură.'],
    ['Numărul de amprente stocate', false, 'Nu este FRR.'],
  ], 'FRR = utilizatori reali respinși.'),
  single({ id: '5.4-018' }, 3, 'Dacă strângi pragul de potrivire al unui sistem biometric (mai strict), ce se întâmplă de obicei?', [
    ['FAR scade, dar FRR crește', true, 'Mai puțini intruși acceptați, dar mai mulți utilizatori legitimi respinși.'],
    ['FAR crește, FRR scade', false, 'Acesta este efectul relaxării pragului.'],
    ['Ambele scad la zero', false, 'Nu pot ajunge ambele la zero.'],
    ['Nu se schimbă nimic', false, 'Pragul influențează ambele rate.'],
  ], 'Compromis FAR ↔ FRR.'),

  // ======================= Configurare =======================
  cli({ id: '5.4-019' }, 2, 'Ești în R1(config)#. Respinge parolele noi mai scurte de 12 caractere.', 'R1(config)#', 'security passwords min-length 12', ['security passwords min-length 12'], [
    { text: 'password min-length 12', why: 'Comanda începe cu security passwords.' },
    { text: 'security password min-length 12', why: 'Cuvântul corect este passwords (plural).' },
    { text: 'security passwords length 12', why: 'Cuvântul cheie este min-length.' },
  ], 'security passwords min-length <n>.', 'security …'),
  single({ id: '5.4-020' }, 2, 'Ce NU poate impune un router cu autentificare strict locală (fără server AAA)?', [
    ['Autentificarea multifactor și expirarea/rotirea parolelor', true, 'Acestea cer un server AAA sau un furnizor de identitate.'],
    ['Lungimea minimă a parolelor noi', false, 'Se poate cu security passwords min-length.'],
    ['Stocarea parolelor ca hash', false, 'Se poate cu secret.'],
    ['Blocarea după încercări eșuate', false, 'Se poate cu login block-for.'],
  ], 'MFA și rotire = AAA central.'),

  // ======================= Recapitulare =======================
  single({ id: '5.4-021' }, 2, 'De ce se descurajează în ghidurile moderne rotirea forțată periodică a parolelor, fără motiv?', [
    ['Duce adesea la variații previzibile (Parola1!, Parola2!) și parole mai slabe', true, 'Schimbarea la compromitere e mai eficientă.'],
    ['Pentru că parolele nu pot fi schimbate', false, 'Pot fi schimbate oricând.'],
    ['Pentru că rotirea strică hash-urile', false, 'Nu strică hash-urile.'],
    ['Pentru că este interzisă de lege peste tot', false, 'Nu există o interdicție universală.'],
  ], 'Rotire la compromitere, nu forțată fără motiv.'),
  single({ id: '5.4-022' }, 2, 'Care este principalul beneficiu al unui manager de parole?', [
    ['Permite parole lungi, aleatoare și unice, fără să le memorezi', true, 'Reduce reutilizarea și parolele slabe.'],
    ['Elimină necesitatea MFA', false, 'MFA rămâne recomandat.'],
    ['Face parolele vizibile tuturor', false, 'Păstrează parolele criptate.'],
    ['Înlocuiește firewall-ul', false, 'Nu are legătură.'],
  ], 'Manager de parole = unicitate + lungime.'),
  single({ id: '5.4-023' }, 2, 'De ce este dificil să „resetezi” o biometrie compromisă?', [
    ['Trăsătura fizică nu se poate schimba ca o parolă', true, 'Nu îți poți emite o nouă amprentă.'],
    ['Pentru că biometria nu folosește șabloane', false, 'Folosește șabloane.'],
    ['Pentru că routerul blochează resetarea', false, 'Nu are legătură.'],
    ['Pentru că biometria e întotdeauna publică în clar în rețea', false, 'Nu este transmisă în clar de sisteme corecte.'],
  ], 'Biometria nu e revocabilă.'),
  single({ id: '5.4-024' }, 2, 'Ce înseamnă certificat self-signed?', [
    ['Este semnat de propria cheie, nu de un CA terț în care clienții au încredere', true, 'Nu poate fi verificat prin lanț, decât dacă este instalat manual ca de încredere.'],
    ['Este semnat de un CA public', false, 'Acesta este un certificat obișnuit.'],
    ['Nu are cheie publică', false, 'Are cheie publică.'],
    ['Este un certificat revocat', false, 'Revocarea e altceva.'],
  ], 'Self-signed = fără CA terț.'),
  single({ id: '5.4-025' }, 2, 'Cum verifică un client dacă un certificat a fost anulat înainte de expirare?', [
    ['Consultă o listă de revocare (CRL) sau un serviciu OCSP', true, 'Aceste mecanisme semnalează certificatele revocate.'],
    ['Nu poate verifica', false, 'Există mecanisme de revocare.'],
    ['Cu ping către server', false, 'Ping-ul nu verifică revocarea.'],
    ['Cu comanda show vlan', false, 'Nu are legătură.'],
  ], 'CRL / OCSP.'),
  single({ id: '5.4-026' }, 2, 'Care este un dezavantaj al codurilor MFA prin SMS?', [
    ['Pot fi interceptate sau redirecționate (de exemplu SIM swapping)', true, 'Sunt mai slabe decât aplicațiile sau cheile.'],
    ['Nu pot fi folosite deloc', false, 'Pot fi folosite, dar sunt mai slabe.'],
    ['Necesită certificat de server', false, 'Nu cer certificat.'],
    ['Nu sunt de unică folosință', false, 'De obicei sunt de unică folosință.'],
  ], 'SMS = factor slab.'),
  single({ id: '5.4-027' }, 3, 'Ce este „push fatigue” la MFA prin notificare?', [
    ['Atacatorul trimite repetat cereri de aprobare până când utilizatorul acceptă din greșeală sau de enervare', true, 'Exploatează oboseala utilizatorului.'],
    ['Epuizarea bateriei telefonului', false, 'Nu este vorba despre baterie.'],
    ['Un tip de DDoS', false, 'Nu este un DDoS.'],
    ['Un algoritm de hash', false, 'Nu este un algoritm.'],
  ], 'Push fatigue = spam de cereri.'),
  single({ id: '5.4-028' }, 3, 'Un angajat folosește „Parola2024!” (majusculă, cifre, simbol). De ce poate fi totuși slabă?', [
    ['Urmează un tipar uzual, încercat devreme de atacatori (cuvânt + an + simbol)', true, 'Complexitatea formală nu înseamnă imprevizibilitate.'],
    ['Pentru că simbolurile sunt interzise', false, 'Nu sunt interzise.'],
    ['Pentru că parolele cu cifre nu funcționează', false, 'Funcționează.'],
    ['Pentru că majusculele se ignoră', false, 'Nu se ignoră.'],
  ], 'Tiparele uzuale slăbesc parola.'),
  multi({ id: '5.4-029' }, 2, 'Care sunt exemple de factori „ceva ce ai”? (alege toate variantele corecte)', [
    ['Token hardware', true, 'Dispozitiv fizic.'],
    ['Telefon cu aplicație de autentificare', true, 'Dispozitivul deține cheia pentru codurile TOTP.'],
    ['Smart card', true, 'Card cu cheie privată.'],
    ['PIN-ul', false, 'Este ceva ce știi.'],
    ['Amprenta', false, 'Este ceva ce ești.'],
  ], 'Possession: token, telefon, card.'),
  multi({ id: '5.4-030' }, 2, 'Care dintre acestea sunt elemente de management al parolelor într-o politică? (alege toate variantele corecte)', [
    ['Stocarea ca hash cu salt', true, 'Protejează parolele în caz de scurgere.'],
    ['Interzicerea reutilizării parolelor recente', true, 'Istoric.'],
    ['Blocarea sau întârzierea după încercări eșuate', true, 'Frânează ghicirea online.'],
    ['Folosirea parolei implicite a producătorului', false, 'Este o slăbiciune, nu o practică bună.'],
    ['Partajarea parolei de administrator între colegi', false, 'Elimină responsabilitatea individuală.'],
  ], 'Management = stocare, istoric, blocare.'),
  multi({ id: '5.4-031' }, 3, 'Care sunt pași ai validării unui certificat de către client? (alege toate variantele corecte)', [
    ['Verificarea lanțului până la un CA de încredere', true, 'Fără încredere în CA, nu există încredere în certificat.'],
    ['Verificarea perioadei de valabilitate', true, 'Expirat = respins.'],
    ['Potrivirea numelui din certificat cu adresa accesată', true, 'Previne folosirea certificatului altcuiva.'],
    ['Compararea certificatului cu parola utilizatorului', false, 'Nu face parte din validarea certificatului.'],
    ['Pornirea unui VLAN nou', false, 'Nu are legătură.'],
  ], 'Lanț, valabilitate, nume, revocare.'),
  match({ id: '5.4-032' }, 2, 'Potrivește factorul cu categoria lui.', [
    { left: 'Parola', right: 'Ceva ce știi', why: 'Cunoaștere.' },
    { left: 'Token hardware', right: 'Ceva ce ai', why: 'Posesie.' },
    { left: 'Amprenta', right: 'Ceva ce ești', why: 'Inerență (biometrie).' },
    { left: 'PIN', right: 'Ceva ce știi', why: 'Cunoaștere.' },
  ], [
    { text: 'Ceva ce ești nevoit să plătești', why: 'Nu este o categorie de factori.' },
  ], 'Know / have / are.'),
  match({ id: '5.4-033' }, 2, 'Potrivește termenul cu sensul lui.', [
    { left: 'Salt', right: 'Valoare aleatoare adăugată înainte de hash', why: 'Anulează tabelele precalculate.' },
    { left: 'CA', right: 'Autoritate care semnează certificate', why: 'Rădăcina încrederii.' },
    { left: 'FAR', right: 'Rata acceptării intrușilor', why: 'False Acceptance Rate.' },
    { left: 'TOTP', right: 'Cod de unică folosință bazat pe timp', why: 'Folosit în aplicațiile de autentificare.' },
  ], [
    { text: 'VLAN trunk', why: 'Nu este un concept de autentificare.' },
  ], 'Salt, CA, FAR, TOTP.'),
  order({ id: '5.4-034' }, 3, 'Ordonează pașii obținerii și folosirii unui certificat de server.', [
    { text: 'Serverul generează o pereche de chei (privată și publică)', why: 'Cheia privată rămâne la server.' },
    { text: 'Trimite o cerere de certificat (CSR) către CA', why: 'Conține cheia publică și numele.' },
    { text: 'CA verifică identitatea și emite certificatul semnat', why: 'Semnătura CA oferă încrederea.' },
    { text: 'Clientul primește certificatul la conectare și îl validează', why: 'Lanț, date, nume, revocare.' },
  ], 'Chei → CSR → certificat → validare.'),
  order({ id: '5.4-035' }, 3, 'Ordonează pașii autentificării unui utilizator cu parolă hashuită cu salt.', [
    { text: 'Utilizatorul introduce parola', why: 'Parola în clar ajunge la sistem (prin canal criptat).' },
    { text: 'Sistemul adaugă salt-ul stocat pentru acel cont', why: 'Salt-ul e unic per parolă.' },
    { text: 'Calculează hash-ul', why: 'Cu un algoritm lent.' },
    { text: 'Compară cu hash-ul stocat', why: 'Se acceptă dacă sunt identice.' },
  ], 'Parolă → +salt → hash → comparare.'),
  cli({ id: '5.4-036' }, 3, 'Ești în R1(config)#. După 5 încercări eșuate în 120 de secunde, blochează logările 600 de secunde.', 'R1(config)#', 'login block-for 600 attempts 5 within 120', ['login block-for 600 attempts 5 within 120'], [
    { text: 'login block-for 120 attempts 5 within 600', why: 'Valorile sunt inversate: blocarea este 600, fereastra 120.' },
    { text: 'login block 600 attempts 5 within 120', why: 'Cuvântul cheie este block-for.' },
    { text: 'login quiet-mode 600 5 120', why: 'Nu este sintaxa IOS.' },
  ], 'login block-for <blocare> attempts <n> within <fereastră>.', 'login block-for …'),
  cli({ id: '5.4-037' }, 2, 'Ești în R1(config)#. Șterge contul local „cisco”.', 'R1(config)#', 'no username cisco', ['no username cisco'], [
    { text: 'delete username cisco', why: 'Nu este comandă IOS.' },
    { text: 'no user cisco', why: 'Comanda este username.' },
    { text: 'username cisco delete', why: 'Se folosește no în față.' },
  ], 'no username <nume>.', 'no …'),
  cli({ id: '5.4-038' }, 2, 'Ești în R1(config)#. Generează mesaje syslog pentru încercările de login eșuate.', 'R1(config)#', 'login on-failure log', ['login on-failure log'], [
    { text: 'login failure log', why: 'Cuvântul cheie este on-failure.' },
    { text: 'logging login failure', why: 'Nu este sintaxa IOS.' },
    { text: 'login on-success log', why: 'Aceasta jurnalizează logările reușite.' },
  ], 'login on-failure log.', 'login on-…'),
  cli({ id: '5.4-039' }, 3, 'Ești în R1(config)#. Permite listei de acces ADMIN-HOSTS să se autentifice chiar și în quiet mode.', 'R1(config)#', 'login quiet-mode access-class ADMIN-HOSTS', ['login quiet-mode access-class ADMIN-HOSTS'], [
    { text: 'login quiet-mode access-list ADMIN-HOSTS', why: 'Cuvântul corect este access-class.' },
    { text: 'quiet-mode access-class ADMIN-HOSTS', why: 'Comanda începe cu login.' },
    { text: 'access-class ADMIN-HOSTS in', why: 'Aceasta se aplică pe linia VTY, nu setează quiet mode.' },
  ], 'login quiet-mode access-class <ACL>.', 'login quiet-mode …'),
  cli({ id: '5.4-040' }, 2, 'Ești în R1(config)#. Creează utilizatorul op cu parola hashuită Op3r@torPass12.', 'R1(config)#', 'username op secret Op3r@torPass12', ['username op secret Op3r@torPass12', 'username op secret 0 Op3r@torPass12'], [
    { text: 'username op password Op3r@torPass12', why: 'password stochează parola în clar sau tip 7.' },
    { text: 'user op secret Op3r@torPass12', why: 'Comanda este username.' },
    { text: 'username op Op3r@torPass12', why: 'Lipsește cuvântul secret (sau password).' },
  ], 'username <nume> secret <parola>.', 'username …'),
];
