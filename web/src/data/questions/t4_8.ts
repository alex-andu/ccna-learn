import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.8 Configure network devices for remote access using SSH.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.8'. Fiecare variantă are explicație (why).
const T = '4.8';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_8: Question[] = [
  // ======================= Concepte =======================
  single({ id: '4.8-001' }, 1, 'Care este scopul principal al SSH pe un router sau switch?', [
    ['Acces securizat (criptat) la CLI de la distanță', true, 'SSH criptează sesiunea și autentifică serverul.'],
    ['Transfer de fișiere necriptat', false, 'Nu este scopul SSH; TFTP/FTP fac transfer.'],
    ['Alocarea automată de adrese IP', false, 'Aceasta este DHCP.'],
    ['Sincronizarea ceasului', false, 'Aceasta este NTP.'],
  ], 'SSH = administrare securizată.'),
  single({ id: '4.8-002' }, 1, 'Ce tip de acces este SSH față de consolă?', [
    ['In-band (prin rețea), spre deosebire de consola out-of-band', true, 'SSH folosește rețeaua; consola este un cablu direct.'],
    ['Out-of-band, ca și consola', false, 'SSH depinde de rețea, deci este in-band.'],
    ['Acces fizic prin port USB', false, 'USB nu este SSH.'],
    ['Acces doar prin wireless', false, 'SSH merge pe orice transport IP.'],
  ], 'SSH = in-band.'),
  single({ id: '4.8-003' }, 1, 'Ce port TCP folosește SSH?', [
    ['22', true, 'Portul standard SSH.'],
    ['23', false, 'Acesta este Telnet.'],
    ['80', false, 'Acesta este HTTP.'],
    ['443', false, 'Acesta este HTTPS.'],
  ], 'SSH = TCP 22.'),
  single({ id: '4.8-004' }, 1, 'De ce este Telnet considerat nesigur?', [
    ['Trimite totul, inclusiv parolele, în text clar', true, 'Oricine captează traficul le poate citi.'],
    ['Folosește UDP', false, 'Telnet folosește TCP 23.'],
    ['Este prea lent', false, 'Problema este securitatea, nu viteza.'],
    ['Nu funcționează pe routere', false, 'Funcționează, dar nesigur.'],
  ], 'Telnet = text clar.'),
  single({ id: '4.8-005' }, 2, 'Care versiune de SSH se recomandă pe echipamentele Cisco?', [
    ['SSHv2', true, 'Mai sigură decât v1; se forțează cu ip ssh version 2.'],
    ['SSHv1', false, 'Are slăbiciuni cunoscute.'],
    ['SSHv0', false, 'Nu există.'],
    ['Oricare, sunt echivalente', false, 'v1 și v2 diferă mult ca securitate.'],
  ], 'Folosește SSHv2.'),
  single({ id: '4.8-006' }, 2, 'Care este rolul cheii RSA generate pe router?', [
    ['Autentifică serverul (routerul) față de client și ajută la schimbul de chei', true, 'Cheia publică identifică routerul; datele se criptează cu chei de sesiune.'],
    ['Criptează fiecare pachet de date direct', false, 'Datele folosesc chei simetrice de sesiune.'],
    ['Autentifică utilizatorul', false, 'Utilizatorul se autentifică cu parolă/AAA.'],
    ['Înlocuiește parola enable', false, 'Nu are legătură.'],
  ], 'Cheia RSA = identitatea serverului.'),
  single({ id: '4.8-007' }, 2, 'Care sunt cerințele pentru ca „crypto key generate rsa” să fie acceptată?', [
    ['Hostname diferit de „Router” și un ip domain-name configurat', true, 'Numele cheii este hostname.domeniu.'],
    ['Doar o parolă de enable', false, 'Nu este suficientă și nu e cerința.'],
    ['Un server RADIUS', false, 'Nu este necesar.'],
    ['Un ACL pe VTY', false, 'Nu are legătură cu generarea cheii.'],
  ], 'Hostname + domain-name.'),
  single({ id: '4.8-008' }, 2, 'Ce vezi la prima conectare SSH la un echipament necunoscut?', [
    ['Clientul afișează amprenta cheii serverului și cere confirmare', true, 'La următoarele conectări compară amprenta cu cea reținută.'],
    ['Routerul cere certificat de la client', false, 'Nu este mecanismul implicit.'],
    ['Conexiunea merge fără nicio verificare', false, 'SSH verifică host key.'],
    ['Se cere automat parola de enable', false, 'Nu este pasul inițial.'],
  ], 'Fingerprint la prima conectare.'),
  single({ id: '4.8-009' }, 3, 'Cum sunt criptate datele efective ale unei sesiuni SSH?', [
    ['Cu chei simetrice de sesiune derivate printr-un schimb de chei', true, 'Rapide și negociate pe sesiune.'],
    ['Direct cu cheia publică RSA, pentru fiecare pachet', false, 'RSA e prea lent pentru volum; servește la autentificare/schimb.'],
    ['Deloc, doar parola este criptată', false, 'Întreaga sesiune este criptată.'],
    ['Cu cheia VLAN', false, 'Nu există o astfel de cheie.'],
  ], 'Chei simetrice de sesiune.'),
  single({ id: '4.8-010' }, 2, 'Care este rolul comenzii transport input ssh pe line vty?', [
    ['Permite doar conexiuni SSH pe liniile VTY (Telnet este respins)', true, 'Elimină accesul în text clar.'],
    ['Pornește serverul SSH', false, 'Serverul pornește doar cu chei RSA.'],
    ['Generează cheile RSA', false, 'Aceasta o face crypto key generate rsa.'],
    ['Activează consola', false, 'Nu are legătură cu consola.'],
  ], 'transport input ssh = doar SSH.'),
  single({ id: '4.8-011' }, 2, 'Ce face comanda login local pe VTY?', [
    ['Cere autentificare cu baza locală de utilizatori (username … secret …)', true, 'Cere utilizator și parolă locală.'],
    ['Cere doar parola de linie', false, 'Aceasta este comanda login simplă.'],
    ['Dezactivează autentificarea', false, 'Acesta ar fi no login.'],
    ['Folosește un server RADIUS', false, 'RADIUS necesită AAA, nu login local.'],
  ], 'login local = utilizatori locali.'),
  single({ id: '4.8-012' }, 2, 'show ip ssh afișează „SSH Disabled”. Care este cauza cea mai probabilă?', [
    ['Nu au fost generate chei RSA (sau lipsesc hostname/domain-name)', true, 'Fără chei serverul SSH nu pornește.'],
    ['Interfața este în shutdown', false, 'Aceasta ar afecta conectivitatea, nu starea serverului SSH.'],
    ['Lipsește comanda ip routing', false, 'Nu are legătură.'],
    ['VLAN-ul de management este în STP blocking', false, 'Nu afectează starea serverului SSH.'],
  ], 'SSH Disabled = lipsa cheilor.'),
  single({ id: '4.8-013' }, 3, 'Care este dimensiunea minimă a modulului RSA pentru SSHv2 pe IOS?', [
    ['768 biți', true, 'Sub 768, nu se poate folosi v2; în practică se folosesc 2048.'],
    ['256 biți', false, 'Prea mic.'],
    ['4096 biți', false, 'Nu este minimul.'],
    ['64 biți', false, 'Nesigur și nepermis.'],
  ], 'Minim 768, recomandat 2048.'),
  single({ id: '4.8-014' }, 2, 'Pe un switch L2, ce trebuie configurat suplimentar față de un router pentru ca SSH să fie accesibil din alte subrețele?', [
    ['Un SVI cu adresă IP și ip default-gateway', true, 'Switch-ul nu are IP pe porturi; are nevoie de SVI și gateway.'],
    ['Adrese IP pe fiecare port de acces', false, 'Porturile L2 nu au IP.'],
    ['OSPF', false, 'Nu este necesar.'],
    ['Un pool DHCP', false, 'Nu are legătură.'],
  ], 'SVI + default-gateway.'),
  single({ id: '4.8-015' }, 2, 'Cum se restricționează sursele care pot deschide sesiuni VTY?', [
    ['Cu un ACL standard aplicat prin access-class pe line vty', true, 'access-class filtrează sesiunile către dispozitiv.'],
    ['Cu ip access-group pe line vty', false, 'access-group se aplică pe interfețe.'],
    ['Cu spanning-tree', false, 'Nu are legătură.'],
    ['Cu ip helper-address', false, 'Aceasta este relay DHCP.'],
  ], 'access-class pe VTY.'),
  single({ id: '4.8-016' }, 2, 'Ce face exec-timeout 5 0?', [
    ['Închide sesiunea după 5 minute de inactivitate', true, 'Format: minute secunde.'],
    ['Închide sesiunea după 5 secunde', false, 'Primul număr sunt minutele.'],
    ['Limitează la 5 conexiuni simultane', false, 'Nu este o limită de conexiuni.'],
    ['Dezactivează timeout-ul', false, 'Aceasta este exec-timeout 0 0.'],
  ], 'exec-timeout minute secunde.'),
  single({ id: '4.8-017' }, 2, 'Care parolă este stocată cu hash în configurație?', [
    ['enable secret', true, 'secret folosește hash; password este mai slab protejat.'],
    ['enable password (în clar)', false, 'Se stochează reversibil.'],
    ['Parola de pe consolă (password)', false, 'Este stocată în clar dacă nu e criptată.'],
    ['Niciuna', false, 'secret este stocat cu hash.'],
  ], 'secret > password.'),
  single({ id: '4.8-018' }, 2, 'Ce comandă forțează utilizarea doar a SSHv2?', [
    ['ip ssh version 2', true, 'Dezactivează compatibilitatea cu v1.'],
    ['ssh version 2', false, 'Sintaxa corectă începe cu ip.'],
    ['crypto ssh v2', false, 'Nu există.'],
    ['transport input ssh2', false, 'Nu există această valoare.'],
  ], 'ip ssh version 2.'),
  single({ id: '4.8-019' }, 2, 'Ce comandă arată sesiunile SSH active?', [
    ['show ssh', true, 'Afișează sesiunile, versiunea și criptarea.'],
    ['show ip route', false, 'Este tabela de rutare.'],
    ['show vlan', false, 'Arată VLAN-urile.'],
    ['show ip interface brief', false, 'Arată interfețele.'],
  ], 'show ssh.'),
  single({ id: '4.8-020' }, 2, 'Ce arată „SSH Enabled - version 2.0” în show ip ssh?', [
    ['Serverul SSH rulează și acceptă doar v2', true, 'Cheile există și v2 este forțat.'],
    ['Telnet este dezactivat pe VTY', false, 'Aceasta depinde de transport input, nu de show ip ssh.'],
    ['Utilizatorul este autentificat', false, 'Arată starea serverului, nu a unui utilizator.'],
    ['Conexiunea este în progres', false, 'Aceea se vede în show ssh.'],
  ], 'show ip ssh = starea serverului.'),
  single({ id: '4.8-021' }, 2, 'Cum te conectezi la un router din OpenSSH/Windows?', [
    ['ssh admin@192.168.1.1', true, 'Format utilizator@adresă.'],
    ['telnet admin 192.168.1.1', false, 'Telnet este altceva.'],
    ['ssh -p 23 admin@192.168.1.1', false, '23 este Telnet.'],
    ['connect ssh 192.168.1.1', false, 'Nu este o comandă validă.'],
  ], 'ssh utilizator@adresă.'),
  single({ id: '4.8-022' }, 3, 'Ce se întâmplă dacă VTY are transport input all și SSH este configurat?', [
    ['Telnet rămâne activ pe lângă SSH', true, 'Se acceptă ambele protocoale.'],
    ['Doar SSH funcționează', false, 'all include Telnet.'],
    ['Nimic nu funcționează', false, 'Ambele funcționează.'],
    ['Telnet este criptat automat', false, 'Telnet rămâne necriptat.'],
  ], 'all = și Telnet.'),
  single({ id: '4.8-023' }, 3, 'Ce face crypto key zeroize rsa?', [
    ['Șterge cheile RSA, ceea ce dezactivează SSH', true, 'Fără chei serverul SSH se oprește.'],
    ['Generează chei noi', false, 'Aceea este generate.'],
    ['Exportă cheile', false, 'Nu le exportă.'],
    ['Șterge parolele', false, 'Nu are legătură.'],
  ], 'zeroize = ștergere chei.'),
  single({ id: '4.8-024' }, 3, 'Clientul SSH afișează un avertisment că host key s-a schimbat. Ce poate indica?', [
    ['Cheie regenerată pe router sau un posibil atac man-in-the-middle', true, 'Amprenta nu mai corespunde cu cea reținută.'],
    ['Parola este expirată', false, 'Nu are legătură cu amprenta.'],
    ['Lease DHCP expirat', false, 'Nu are legătură.'],
    ['STP a schimbat root-ul', false, 'Nu are legătură.'],
  ], 'Host key schimbat = verifică.'),
  single({ id: '4.8-025' }, 3, 'Ce limitare are SSH în privința autentificării utilizatorilor?', [
    ['Protejează canalul, dar utilizatorul trebuie autentificat separat (local sau AAA)', true, 'SSH nu garantează că parola este a persoanei legitime.'],
    ['Autentifică automat orice utilizator', false, 'Nu există autentificare automată.'],
    ['Nu permite utilizatori locali', false, 'Permite, cu login local.'],
    ['Funcționează doar cu RADIUS', false, 'Merge și cu baza locală.'],
  ], 'Canal sigur ≠ utilizator autentificat.'),
  single({ id: '4.8-026' }, 2, 'Care este diferența dintre login și login local pe VTY?', [
    ['login cere parola de linie; login local cere utilizator și parolă din baza locală', true, 'Două moduri diferite de autentificare.'],
    ['Nu există nicio diferență', false, 'Sunt comportamente diferite.'],
    ['login este mai sigur', false, 'login local oferă utilizatori individuali.'],
    ['login local folosește TACACS+', false, 'AAA este altceva.'],
  ], 'login ≠ login local.'),
  single({ id: '4.8-027' }, 3, 'Ce mesaj apare dacă VTY are login (fără local) și nu s-a setat password pe linie?', [
    ['Password required, but none set', true, 'Linia cere o parolă care nu există.'],
    ['SSH Disabled', false, 'Aceasta este starea serverului, nu a liniei.'],
    ['Connection timed out', false, 'Ar indica o problemă de rețea.'],
    ['Invalid key', false, 'Nu este mesajul tipic.'],
  ], 'login fără password pe linie.'),
  single({ id: '4.8-028' }, 2, 'Care protocol AAA centralizat poate înlocui utilizatorii locali pe VTY?', [
    ['TACACS+ sau RADIUS', true, 'Servere AAA centralizate (2.8).'],
    ['NTP', false, 'Este pentru timp.'],
    ['CDP', false, 'Este protocol de descoperire.'],
    ['DHCP', false, 'Este pentru adrese IP.'],
  ], 'AAA centralizat = TACACS+/RADIUS.'),

  // ======================= Multi =======================
  multi({ id: '4.8-029' }, 2, 'Care sunt cerințe pentru activarea SSH pe IOS? (alege toate variantele corecte)', [
    ['Hostname diferit de „Router”', true, 'Necesar la generarea cheii.'],
    ['ip domain-name', true, 'Completează numele cheii.'],
    ['Chei RSA generate', true, 'Pornesc serverul SSH.'],
    ['Un utilizator local sau AAA și login pe VTY', true, 'Fără autentificare nu poți intra.'],
    ['Un server DNS', false, 'Nu este obligatoriu.'],
  ], 'Hostname, domain-name, chei, utilizator, VTY.'),
  multi({ id: '4.8-030' }, 3, 'Care măsuri întăresc accesul SSH? (alege toate variantele corecte)', [
    ['ACL standard pe VTY cu access-class', true, 'Limitează sursele.'],
    ['exec-timeout', true, 'Închide sesiunile inactive.'],
    ['ip ssh version 2', true, 'Elimină v1.'],
    ['transport input ssh', true, 'Dezactivează Telnet.'],
    ['transport input all', false, 'Păstrează Telnet activ.'],
  ], 'Surse, timeout, v2, doar SSH.'),
  multi({ id: '4.8-031' }, 3, 'Care sunt cauze posibile pentru o conexiune SSH refuzată? (alege toate variantele corecte)', [
    ['Lipsesc cheile RSA', true, 'Serverul SSH nu rulează.'],
    ['transport input telnet pe VTY', true, 'SSH este respins.'],
    ['access-class nu permite sursa clientului', true, 'Sesiunea este refuzată.'],
    ['Un ACL pe drum blochează TCP 22', true, 'Pachetele nu ajung.'],
    ['Routerul are mai multe interfețe loopback', false, 'Nu afectează SSH.'],
  ], 'Chei, VTY, ACL, filtrare.'),

  // ======================= Match =======================
  match({ id: '4.8-032' }, 2, 'Potrivește comanda cu rolul ei în configurarea SSH.', [
    { left: 'crypto key generate rsa', right: 'Creează cheile și pornește SSH', why: 'Fără chei nu există server SSH.' },
    { left: 'ip ssh version 2', right: 'Forțează SSHv2', why: 'Dezactivează v1.' },
    { left: 'transport input ssh', right: 'Acceptă doar SSH pe VTY', why: 'Respinge Telnet.' },
    { left: 'login local', right: 'Autentificare cu utilizatori locali', why: 'Folosește username … secret ….' },
    { left: 'access-class 10 in', right: 'Restricționează sursa sesiunilor VTY', why: 'ACL standard pe linie.' },
  ], [
    { text: 'Activează DHCP relay', why: 'Aceasta este ip helper-address.' },
  ], 'Fiecare comandă are un rol precis.'),
  match({ id: '4.8-033' }, 3, 'Potrivește simptomul cu cauza cea mai probabilă.', [
    { left: 'show ip ssh = „SSH Disabled”', right: 'Nu există chei RSA', why: 'Serverul nu a pornit.' },
    { left: '„Password required, but none set”', right: 'login fără parolă de linie (nu login local)', why: 'Linia cere o parolă inexistentă.' },
    { left: 'SSH respins, Telnet merge', right: 'transport input telnet / lipsă chei', why: 'VTY nu acceptă SSH.' },
    { left: 'Sursa dintr-o altă subrețea e refuzată', right: 'access-class o blochează', why: 'ACL-ul VTY nu o permite.' },
  ], [
    { text: 'Spanning-tree blocat', why: 'Ar afecta conectivitatea L2, nu mesajele de acest tip.' },
  ], 'Simptom → cauză.'),

  // ======================= Order =======================
  order({ id: '4.8-034' }, 2, 'Ordonează pașii de configurare SSH pe IOS.', [
    { text: 'hostname (diferit de Router)', why: 'Necesar pentru numele cheii.' },
    { text: 'ip domain-name', why: 'Completează numele cheii.' },
    { text: 'crypto key generate rsa modulus 2048', why: 'Generează cheile; necesită cei doi pași de mai sus.' },
    { text: 'username … secret …', why: 'Utilizator pentru login local.' },
    { text: 'line vty: login local + transport input ssh', why: 'Activează accesul și restricționează protocolul.' },
  ], 'Hostname → domain → chei → utilizator → VTY.'),
  order({ id: '4.8-035' }, 3, 'Ordonează stabilirea unei sesiuni SSH.', [
    { text: 'Conexiune TCP pe portul 22', why: 'Primul pas.' },
    { text: 'Negocierea versiunii și a algoritmilor', why: 'Părțile se pun de acord.' },
    { text: 'Schimb de chei și criptarea canalului', why: 'De aici tot traficul este criptat.' },
    { text: 'Autentificarea serverului (host key)', why: 'Clientul verifică amprenta.' },
    { text: 'Autentificarea utilizatorului', why: 'În interiorul canalului criptat.' },
  ], 'TCP → negociere → chei → host key → utilizator.'),

  // ======================= CLI =======================
  cli({ id: '4.8-036' }, 2, 'Ești în R1(config)#. Configurează domeniul example.local.', 'R1(config)#', 'ip domain-name example.local', ['ip domain-name example.local'], [
    { text: 'domain-name example.local', why: 'Comanda începe cu ip.' },
    { text: 'ip domain example.local', why: 'Cuvântul complet este domain-name.' },
    { text: 'hostname example.local', why: 'Setează numele echipamentului, nu domeniul.' },
  ], 'ip domain-name <domeniu>.', 'ip domain-name …'),
  cli({ id: '4.8-037' }, 2, 'Ești în R1(config)#. Generează chei RSA de 2048 biți.', 'R1(config)#', 'crypto key generate rsa modulus 2048', ['crypto key generate rsa modulus 2048'], [
    { text: 'crypto key generate rsa 2048', why: 'Cuvântul modulus este necesar înaintea valorii.' },
    { text: 'ip ssh generate rsa 2048', why: 'Nu este sintaxa IOS.' },
    { text: 'crypto key rsa generate modulus 2048', why: 'Ordinea cuvintelor este generate rsa.' },
  ], 'crypto key generate rsa modulus <n>.', 'crypto key generate …'),
  cli({ id: '4.8-038' }, 2, 'Ești în R1(config-line)# pe line vty 0 15. Permite doar SSH.', 'R1(config-line)#', 'transport input ssh', ['transport input ssh'], [
    { text: 'transport ssh', why: 'Lipsește cuvântul input.' },
    { text: 'transport input all', why: 'Permite și Telnet.' },
    { text: 'ssh only', why: 'Nu este sintaxă IOS.' },
  ], 'transport input ssh.', 'transport input …'),
  cli({ id: '4.8-039' }, 2, 'Ești în R1(config-line)#. Folosește utilizatorii locali pentru autentificare.', 'R1(config-line)#', 'login local', ['login local'], [
    { text: 'login', why: 'Cere parola de linie, nu utilizatori.' },
    { text: 'login users', why: 'Nu este sintaxă IOS.' },
    { text: 'aaa login local', why: 'Nu se scrie așa în modul de linie.' },
  ], 'login local.', 'login …'),
  cli({ id: '4.8-040' }, 3, 'Ești în R1(config-line)#. Permite sesiuni VTY doar de la sursele din ACL-ul 10.', 'R1(config-line)#', 'access-class 10 in', ['access-class 10 in'], [
    { text: 'ip access-group 10 in', why: 'access-group se aplică pe interfețe, nu pe VTY.' },
    { text: 'access-class 10', why: 'Lipsește direcția (in).' },
    { text: 'access-list 10 in', why: 'access-list definește ACL-ul global, nu îl aplică pe linie.' },
  ], 'access-class <acl> in.', 'access-class …'),
];
