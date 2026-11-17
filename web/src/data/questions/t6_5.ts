import type { Question } from '../../lib/types';

// Banca de întrebări pentru 6.5 Describe characteristics of REST-based APIs (authentication types, CRUD, HTTP verbs, and data encoding).
// Obiectivul oficial nu are sub-puncte; `sub` = '6.5'. Fiecare variantă are explicație (why).
const T = '6.5';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_6_5: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '6.5-001' }, 1, 'Ce este un API?', [
    ['Un set de reguli și puncte de acces prin care un program cere servicii altui program', true, 'Aplicația apelantă nu are nevoie să cunoască implementarea internă.'],
    ['Un tip de cablu pentru echipamente de rețea', false, 'Nu are legătură cu stratul fizic.'],
    ['Un protocol de rutare', false, 'API-urile nu rutează pachete.'],
    ['Un algoritm de criptare', false, 'Un API nu este un algoritm de criptare.'],
  ], 'API = interfață de programare.'),
  single({ id: '6.5-002' }, 1, 'Ce este REST?', [
    ['Un stil arhitectural pentru API-uri, bazat de obicei pe HTTP, cu resurse, URI-uri și verbe standard', true, 'Nu este un protocol, ci un set de principii.'],
    ['Un protocol de nivel 2', false, 'REST funcționează la nivel de aplicație.'],
    ['Un limbaj de programare', false, 'Nu este limbaj de programare.'],
    ['Un tip de bază de date', false, 'Nu este o bază de date.'],
  ], 'REST = stil arhitectural.'),
  single({ id: '6.5-003' }, 1, 'Ce temă NU face parte din obiectivul 6.5 (REST)?', [
    ['Configurarea protocolului OSPF', true, 'OSPF ține de domeniul 3; 6.5 vorbește despre autentificare, CRUD, verbe HTTP și codificarea datelor.'],
    ['Tipurile de autentificare', false, 'Face parte din 6.5.'],
    ['CRUD și verbele HTTP', false, 'Face parte din 6.5.'],
    ['Codificarea datelor', false, 'Face parte din 6.5.'],
  ], '6.5: autentificare, CRUD, verbe, codificare.'),

  // ======================= Ce este REST =======================
  single({ id: '6.5-004' }, 2, 'Ce înseamnă că un API REST este „stateless”?', [
    ['Serverul nu păstrează sesiunea clientului între cereri; fiecare cerere conține tot ce îi trebuie', true, 'De aceea tokenul se trimite la fiecare cerere.'],
    ['Serverul nu are nicio stare internă, nici date', false, 'Serverul are date (resurse); „stateless” se referă la sesiunea clientului.'],
    ['Clientul nu poate trimite mai mult de o cerere', false, 'Poate trimite oricâte cereri.'],
    ['Serverul nu folosește HTTP', false, 'REST folosește de obicei HTTP.'],
  ], 'Stateless = fără sesiune pe server.'),
  single({ id: '6.5-005' }, 2, 'Care dintre acestea este o constrângere REST?', [
    ['Separarea client-server', true, 'Clientul și serverul evoluează independent.'],
    ['Serverul trebuie să păstreze o sesiune pentru fiecare client', false, 'REST este stateless.'],
    ['Toate cererile folosesc doar GET', false, 'REST folosește mai multe metode.'],
    ['Datele trebuie să fie exclusiv XML', false, 'REST nu impune un format.'],
  ], 'Client-server, stateless, cacheable, interfață uniformă, straturi.'),
  single({ id: '6.5-006' }, 2, 'Care URI respectă cel mai bine convențiile REST pentru a șterge interfața 2?', [
    ['DELETE /api/v1/interfaces/2', true, 'Calea numește resursa (substantiv); metoda spune acțiunea.'],
    ['GET /api/v1/deleteInterface?id=2', false, 'Verbul în cale și GET pentru ștergere încalcă convențiile.'],
    ['POST /api/v1/removeInterface/2', false, 'Acțiunea trebuie dată de metodă, nu de cale.'],
    ['PUT /api/v1/interfaces/delete', false, 'Calea nu identifică resursa, iar PUT nu este pentru ștergere.'],
  ], 'Substantive în URI; verbul este metoda.'),
  single({ id: '6.5-007' }, 2, 'Ce este query string-ul din URI-ul /interfaces?enabled=true?', [
    ['Partea după ? care filtrează sau parametrizează cererea', true, 'Perechi cheie=valoare, separate prin &.'],
    ['Corpul cererii', false, 'Corpul este separat de antete, după linia goală.'],
    ['Versiunea API-ului', false, 'Versiunea apare de obicei în cale (v1).'],
    ['Numele serverului', false, 'Numele serverului este în Host/URL înaintea căii.'],
  ], 'Query string = filtre.'),
  single({ id: '6.5-008' }, 2, 'Pe ce protocol de transport se bazează, de obicei, un API REST?', [
    ['HTTP sau HTTPS', true, 'REST folosește verbele și codurile HTTP; HTTPS adaugă criptare.'],
    ['ICMP', false, 'ICMP este pentru diagnostic IP.'],
    ['CDP', false, 'CDP descoperă vecini Cisco.'],
    ['STP', false, 'STP previne bucle L2.'],
  ], 'REST peste HTTP(S).'),

  // ======================= HTTP și CRUD =======================
  single({ id: '6.5-009' }, 1, 'Ce metodă HTTP corespunde operației CRUD „Create”?', [
    ['POST', true, 'POST creează o resursă nouă.'],
    ['GET', false, 'GET citește.'],
    ['DELETE', false, 'DELETE șterge.'],
    ['HEAD', false, 'HEAD este ca GET, fără corp.'],
  ], 'Create = POST.'),
  single({ id: '6.5-010' }, 1, 'Ce metodă HTTP corespunde operației CRUD „Read”?', [
    ['GET', true, 'GET citește o resursă sau o colecție, fără să o modifice.'],
    ['POST', false, 'POST creează.'],
    ['PUT', false, 'PUT înlocuiește.'],
    ['PATCH', false, 'PATCH modifică parțial.'],
  ], 'Read = GET.'),
  single({ id: '6.5-011' }, 2, 'Care este diferența dintre PUT și PATCH?', [
    ['PUT înlocuiește întreaga resursă; PATCH modifică doar câmpurile trimise', true, 'PUT cere reprezentarea completă; PATCH este actualizare parțială.'],
    ['PUT șterge resursa, PATCH o creează', false, 'Ștergerea este DELETE, crearea este POST.'],
    ['Nu există nicio diferență', false, 'Diferența este importantă.'],
    ['PATCH este folosit doar pentru citire', false, 'Citirea este GET.'],
  ], 'PUT = înlocuire; PATCH = parțial.'),
  single({ id: '6.5-012' }, 2, 'Care dintre aceste metode HTTP NU este idempotentă?', [
    ['POST', true, 'Două cereri POST pot crea două resurse.'],
    ['GET', false, 'GET este idempotentă (și sigură).'],
    ['PUT', false, 'PUT este idempotentă: aceeași înlocuire repetată dă aceeași stare.'],
    ['DELETE', false, 'DELETE este idempotentă: după prima ștergere, starea rămâne „inexistent”.'],
  ], 'POST nu este idempotent.'),
  single({ id: '6.5-013' }, 2, 'Ce cod de stare întoarce, de obicei, un POST care a creat o resursă?', [
    ['201 Created', true, 'Indică faptul că resursa a fost creată; adesea cu antetul Location.'],
    ['404 Not Found', false, 'Resursa nu a fost găsită; nu este un succes de creare.'],
    ['301 Moved Permanently', false, 'Este o redirecționare permanentă.'],
    ['503 Service Unavailable', false, 'Este o eroare a serverului.'],
  ], 'POST reușit → 201.'),
  single({ id: '6.5-014' }, 2, 'Un client trimite un token valid, dar tokenul are doar drept de citire și clientul încearcă DELETE. Ce cod este probabil?', [
    ['403 Forbidden', true, 'Clientul este autentificat, dar nu are permisiunea (autorizare).'],
    ['401 Unauthorized', false, '401 înseamnă autentificare lipsă sau invalidă; aici tokenul este valid.'],
    ['404 Not Found', false, 'Resursa există; problema este permisiunea.'],
    ['201 Created', false, 'Nu s-a creat nimic.'],
  ], '401 = autentificare; 403 = autorizare.'),
  single({ id: '6.5-015' }, 2, 'Ai trimis POST pe /api/v1/interfaces/2 (o resursă individuală) și ai primit 405. Ce înseamnă?', [
    ['Resursa există, dar metoda POST nu este permisă pe acest URI', true, 'Antetul Allow arată metodele permise (de exemplu GET, PUT, PATCH, DELETE).'],
    ['Resursa nu există', false, 'Aceasta ar fi 404.'],
    ['Tokenul a expirat', false, 'Aceasta ar fi 401.'],
    ['Serverul este oprit', false, 'Aceasta ar fi 5xx.'],
  ], '405 = metodă nepermisă.'),

  // ======================= Autentificare =======================
  single({ id: '6.5-016' }, 2, 'De ce nu este sigur HTTP Basic peste HTTP simplu (fără HTTPS)?', [
    ['Utilizatorul și parola sunt doar codificate Base64, nu criptate, deci pot fi citite de oricine interceptează', true, 'Base64 este reversibil; de aceea Basic se folosește doar peste HTTPS.'],
    ['Pentru că Basic nu poate transporta parole', false, 'Transportă, dar nesigur.'],
    ['Pentru că Base64 este o criptare puternică', false, 'Base64 nu este criptare.'],
    ['Pentru că HTTP Basic funcționează doar pe IPv6', false, 'Nu depinde de versiunea IP.'],
  ], 'Base64 ≠ criptare.'),
  single({ id: '6.5-017' }, 2, 'Ce este un token Bearer?', [
    ['Un token temporar de acces; oricine îl deține poate folosi API-ul în limita permisiunilor lui', true, '„Bearer” = purtătorul; tokenul trebuie protejat.'],
    ['O parolă veșnică, fără expirare', false, 'Tokenurile au de regulă durată limitată.'],
    ['Un tip de certificat de server', false, 'Nu este certificat.'],
    ['Un protocol de rutare', false, 'Nu are legătură cu rutarea.'],
  ], 'Token Bearer = purtătorul are acces.'),
  single({ id: '6.5-018' }, 2, 'Care este riscul principal al unei API key statice?', [
    ['Dacă se scurge, oricine o poate folosi până când este revocată', true, 'Nu expiră implicit și nu este legată de un utilizator anume.'],
    ['Nu poate fi trimisă într-un antet', false, 'Se trimite frecvent într-un antet.'],
    ['Face imposibilă folosirea HTTPS', false, 'Se folosește tocmai peste HTTPS.'],
    ['Se schimbă la fiecare cerere', false, 'Este statică, nu se schimbă la fiecare cerere.'],
  ], 'Cheie scursă = acces până la revocare.'),
  single({ id: '6.5-019' }, 2, 'Ce oferă OAuth 2.0?', [
    ['Autorizare delegată prin access token-uri cu permisiuni limitate (scope) și durată scurtă', true, 'Aplicația nu vede parola utilizatorului.'],
    ['Criptarea traficului de la nivel 2', false, 'OAuth este un cadru de autorizare, nu criptare L2.'],
    ['Alocarea de adrese IP', false, 'Aceasta este DHCP.'],
    ['Sincronizarea ceasului', false, 'Aceasta este NTP.'],
  ], 'OAuth = autorizare delegată.'),
  single({ id: '6.5-020' }, 2, 'De ce trebuie API-urile REST folosite peste HTTPS?', [
    ['Credențialele și tokenurile circulă în antete; fără criptare pot fi interceptate', true, 'HTTPS asigură confidențialitate și integritate.'],
    ['Pentru că HTTPS face cererile mai rapide', false, 'Securitatea, nu viteza, este motivul.'],
    ['Pentru că HTTP nu poate transporta JSON', false, 'HTTP poate transporta JSON; nu este motivul.'],
    ['Pentru că REST nu funcționează peste HTTP', false, 'Funcționează, dar fără protecție.'],
  ], 'HTTPS = protecție pentru credențiale și date.'),
  single({ id: '6.5-021' }, 2, 'Care descrie corect un tipar frecvent de autentificare la un controller?', [
    ['Cerere cu Basic către un endpoint de autentificare → primești un token → îl trimiți în antet la cererile următoare', true, 'Parola circulă o dată; apoi tokenul.'],
    ['Trimiți parola în URL la fiecare cerere', false, 'Secretele în URL ajung în log-uri și sunt nerecomandate.'],
    ['Nu te autentifici niciodată', false, 'API-urile de management cer autentificare.'],
    ['Folosești Telnet pentru autentificare', false, 'Telnet nu este mecanismul unui API REST.'],
  ], 'Basic → token → antet.'),

  // ======================= Codificarea datelor =======================
  single({ id: '6.5-022' }, 1, 'Ce format de date este acesta: { "name": "Gi1", "enabled": true }?', [
    ['JSON', true, 'Acolade, perechi „cheie”: valoare, ghilimele duble, true cu litere mici.'],
    ['XML', false, 'XML folosește etichete <tag>.'],
    ['YAML', false, 'YAML folosește indentare și nu are acolade în stilul acesta.'],
    ['CSV', false, 'CSV este text separat prin virgule.'],
  ], 'JSON = { "cheie": valoare }.'),
  single({ id: '6.5-023' }, 1, 'Ce format de date folosește etichete de forma <name>Gi1</name>?', [
    ['XML', true, 'XML încadrează datele între etichete deschise și închise.'],
    ['JSON', false, 'JSON folosește acolade.'],
    ['YAML', false, 'YAML folosește indentare.'],
    ['Binar', false, 'Eticheta este text, nu binar.'],
  ], 'XML = etichete.'),
  single({ id: '6.5-024' }, 2, 'Ce format de date folosește indentare cu spații și liniuțe pentru liste (de exemplu în playbook-uri Ansible)?', [
    ['YAML', true, 'Structura se exprimă prin indentare.'],
    ['JSON', false, 'JSON folosește acolade și paranteze drepte.'],
    ['XML', false, 'XML folosește etichete.'],
    ['ASN.1 binar', false, 'Nu este formatul Ansible.'],
  ], 'YAML = indentare.'),
  single({ id: '6.5-025' }, 2, 'Care este diferența dintre antetele Content-Type și Accept?', [
    ['Content-Type: formatul corpului trimis; Accept: formatul dorit în răspuns', true, 'Primul descrie ce trimiți, al doilea ce vrei să primești.'],
    ['Sunt identice', false, 'Au roluri diferite.'],
    ['Content-Type este numele serverului', false, 'Numele serverului este în Host.'],
    ['Accept conține parola', false, 'Parola/tokenul este în Authorization.'],
  ], 'Content-Type = ce trimiți; Accept = ce vrei.'),
  single({ id: '6.5-026' }, 2, 'Trimiți un POST cu corp JSON valid, dar fără antetul Content-Type, și primești 415. Ce a observat serverul?', [
    ['Nu poate identifica formatul corpului: tipul de conținut lipsește sau nu este acceptat', true, '415 Unsupported Media Type.'],
    ['Metoda POST este interzisă oriunde', false, 'Aceasta ar fi 405.'],
    ['Tokenul este invalid', false, 'Aceasta ar fi 401.'],
    ['Resursa nu există', false, 'Aceasta ar fi 404.'],
  ], '415 = tip de conținut.'),

  // ======================= Exemple practice =======================
  single({ id: '6.5-027' }, 2, 'În curl, ce face opțiunea -d \'{"title":"x"}\' împreună cu -X POST?', [
    ['Trimite textul dat ca corp (payload) al cererii POST', true, '-d specifică datele trimise în corp.'],
    ['Șterge resursa', false, 'Ștergerea este -X DELETE.'],
    ['Afișează antetele răspunsului', false, 'Aceasta este opțiunea -i.'],
    ['Dezactivează verificarea certificatului', false, 'Aceasta este -k.'],
  ], '-d = corpul cererii.'),
  single({ id: '6.5-028' }, 2, 'De ce se apelează raise_for_status() într-un script Python după o cerere?', [
    ['Ca un cod de stare 4xx/5xx să devină o eroare vizibilă, nu date valide', true, 'Evită procesarea unui mesaj de eroare ca și cum ar fi date.'],
    ['Pentru a cripta răspunsul', false, 'Nu criptează nimic.'],
    ['Pentru a trimite o a doua cerere automat', false, 'Nu retrimite cererea.'],
    ['Pentru a schimba metoda HTTP', false, 'Nu schimbă metoda.'],
  ], 'Verifică întotdeauna statusul.'),
  single({ id: '6.5-029' }, 2, 'Corpul cererii este {"name":"Lo0","ip":"1.1.1.1",} și serverul răspunde 400. Care este cauza probabilă?', [
    ['JSON invalid: virgula de la final nu este permisă', true, 'JSON nu acceptă virgule la final.'],
    ['Metoda POST nu există', false, 'POST există.'],
    ['Serverul este oprit', false, 'Ar fi 5xx sau lipsă de răspuns.'],
    ['Tokenul a expirat', false, 'Ar fi 401.'],
  ], 'JSON invalid → 400.'),
  single({ id: '6.5-030' }, 2, 'În curl -i https://api.lab/v1/devices, ce afișează -i în plus față de comanda fără -i?', [
    ['Linia de stare și antetele răspunsului', true, 'Utile pentru a vedea codul de stare și Content-Type.'],
    ['Doar corpul, mai scurt', false, 'Corpul apare oricum.'],
    ['Parola utilizatorului', false, 'Nu afișează parole.'],
    ['Nimic', false, '-i adaugă antetele.'],
  ], '-i = include antetele răspunsului.'),

  // ======================= Multi =======================
  multi({ id: '6.5-031' }, 2, 'Care dintre perechile CRUD ↔ verb HTTP sunt corecte? (alege toate variantele corecte)', [
    ['Create ↔ POST', true, 'POST creează resurse noi.'],
    ['Read ↔ GET', true, 'GET citește.'],
    ['Delete ↔ DELETE', true, 'DELETE șterge.'],
    ['Update ↔ GET', false, 'GET nu modifică resursa; actualizarea folosește PUT sau PATCH.'],
  ], 'POST, GET, PUT/PATCH, DELETE.'),
  multi({ id: '6.5-032' }, 3, 'Care metode HTTP sunt idempotente? (alege toate variantele corecte)', [
    ['GET', true, 'Citirea nu schimbă starea.'],
    ['PUT', true, 'Aceeași înlocuire repetată dă aceeași stare finală.'],
    ['DELETE', true, 'După prima ștergere, resursa rămâne ștearsă.'],
    ['POST', false, 'POST poate crea resurse noi la fiecare cerere.'],
  ], 'GET, PUT, DELETE: idempotente; POST: nu.'),
  multi({ id: '6.5-033' }, 3, 'Care sunt constrângeri ale arhitecturii REST? (alege toate variantele corecte)', [
    ['Client-server', true, 'Separarea rolurilor.'],
    ['Stateless', true, 'Serverul nu păstrează sesiunea clientului.'],
    ['Interfață uniformă', true, 'Resurse, URI-uri și verbe standard.'],
    ['Serverul păstrează sesiunea fiecărui client', false, 'Contrazice constrângerea stateless.'],
  ], 'Client-server, stateless, cacheable, interfață uniformă, straturi.'),

  // ======================= Match / Order =======================
  match({ id: '6.5-034' }, 2, 'Potrivește codul de stare cu semnificația lui.', [
    { left: '201', right: 'Resursa a fost creată', why: 'Răspuns tipic la POST reușit.' },
    { left: '401', right: 'Autentificare lipsă sau invalidă', why: 'Serverul nu știe cine ești.' },
    { left: '403', right: 'Autentificat, dar fără permisiune', why: 'Autorizare insuficientă.' },
    { left: '404', right: 'Resursa nu a fost găsită', why: 'Calea sau identificatorul nu există.' },
  ], [
    { text: 'Eroare internă a serverului', why: 'Aceasta este 500.' },
    { text: 'Redirecționare permanentă', why: 'Aceasta este 301.' },
  ], '201 · 401 · 403 · 404.'),
  match({ id: '6.5-035' }, 2, 'Potrivește mecanismul de autentificare cu descrierea lui.', [
    { left: 'HTTP Basic', right: 'Utilizator:parolă codificat Base64 în antetul Authorization', why: 'Doar peste HTTPS; Base64 nu criptează.' },
    { left: 'API key', right: 'Cheie secretă statică atribuită unei aplicații', why: 'Trimisă de obicei într-un antet.' },
    { left: 'Token Bearer', right: 'Token temporar trimis la fiecare cerere', why: 'Cine îl deține are acces.' },
    { left: 'OAuth 2.0', right: 'Autorizare delegată cu access token și scope', why: 'Aplicația nu vede parola utilizatorului.' },
  ], [
    { text: 'Criptare între două switch-uri', why: 'Nu este un mecanism de autentificare API.' },
    { text: 'Protocol de rutare', why: 'Nu are legătură.' },
  ], 'Basic, API key, Bearer, OAuth.'),
  order({ id: '6.5-036' }, 2, 'Ordonează părțile unei cereri HTTP.', [
    { text: 'Linia de cerere (metodă, cale, versiune)', why: 'Prima linie a cererii.' },
    { text: 'Antetele (Host, Authorization, Content-Type…)', why: 'Urmează liniei de cerere.' },
    { text: 'Linie goală', why: 'Separă antetele de corp.' },
    { text: 'Corpul (payload), dacă există', why: 'Ultimul element al cererii.' },
  ], 'Linie → antete → linie goală → corp.'),
  order({ id: '6.5-037' }, 3, 'Ordonează pașii folosirii unui API cu autentificare prin token.', [
    { text: 'Trimiți credențialele (de exemplu Basic) către endpointul de autentificare', why: 'Parola circulă o dată, peste HTTPS.' },
    { text: 'Primești tokenul în răspuns', why: 'Serverul emite tokenul.' },
    { text: 'Trimiți cererea de date cu tokenul în antet', why: 'REST este stateless: tokenul însoțește fiecare cerere.' },
    { text: 'Verifici codul de stare și parsezi corpul JSON', why: 'Nu folosești datele fără să verifici succesul.' },
  ], 'Credențiale → token → cerere cu token → verificare.'),

  // ======================= CLI =======================
  cli({ id: '6.5-038' }, 2, 'În terminal: șterge resursa /api/v1/interfaces/2 de pe serverul api.lab (HTTPS), cu curl.', '$', 'curl -X DELETE https://api.lab/api/v1/interfaces/2', ['curl -X DELETE https://api.lab/api/v1/interfaces/2', 'curl --request DELETE https://api.lab/api/v1/interfaces/2'], [
    { text: 'curl -X REMOVE https://api.lab/api/v1/interfaces/2', why: 'REMOVE nu este o metodă HTTP; metoda este DELETE.' },
    { text: 'curl -X GET https://api.lab/api/v1/interfaces/2', why: 'GET citește resursa, nu o șterge.' },
    { text: 'curl DELETE https://api.lab/api/v1/interfaces/2', why: 'Metoda se indică cu opțiunea -X (sau --request).' },
  ], 'curl -X DELETE <URL>.', 'curl -X …'),
  cli({ id: '6.5-039' }, 2, 'În terminal: cere lista interfețelor de la https://api.lab/api/v1/interfaces, precizând că vrei răspunsul în JSON (antetul Accept).', '$', 'curl -H "Accept: application/json" https://api.lab/api/v1/interfaces', ['curl -H "Accept: application/json" https://api.lab/api/v1/interfaces', 'curl https://api.lab/api/v1/interfaces -H "Accept: application/json"'], [
    { text: 'curl -H "Content-Type: application/json" https://api.lab/api/v1/interfaces', why: 'Content-Type descrie corpul trimis; formatul dorit în răspuns se cere cu Accept.' },
    { text: 'curl -d "Accept: application/json" https://api.lab/api/v1/interfaces', why: '-d trimite date în corp, nu adaugă un antet.' },
    { text: 'curl -X Accept application/json https://api.lab/api/v1/interfaces', why: '-X alege metoda HTTP, nu un antet.' },
  ], 'curl -H "Accept: application/json" <URL>.', 'curl -H …'),
  cli({ id: '6.5-040' }, 2, 'În global configuration mode pe IOS XE: pornește serverul HTTPS al echipamentului (necesar pentru RESTCONF și alte API-uri HTTPS).', 'Switch(config)#', 'ip http secure-server', ['ip http secure-server'], [
    { text: 'ip http server', why: 'Pornește HTTP necriptat; API-urile de management trebuie folosite peste HTTPS.' },
    { text: 'http secure-server', why: 'Lipsește cuvântul ip.' },
    { text: 'ip https server', why: 'Nu este sintaxa IOS; comanda este ip http secure-server.' },
  ], 'ip http secure-server.', 'ip http …'),
];
