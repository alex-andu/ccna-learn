import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.8 Describe network device management access.
// Obiectivul oficial nu are sub-puncte; `sub` este '2.8'. Fiecare variantă are explicație (why).
const T = '2.8';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_8: Question[] = [
  // ======================= Metode de acces =======================
  single({ id: '2.8-001' }, 1, 'Care dintre aceste metode de administrare transmit parolele în clar?', [
    ['Telnet', true, 'Telnet nu criptează; parola se vede cu un analizor de pachete.'],
    ['SSH', false, 'SSH este criptat.'],
    ['HTTPS', false, 'HTTPS folosește TLS.'],
    ['Console', false, 'Console este conexiune locală, nu trece prin rețea.'],
  ], 'Telnet = în clar.'),
  single({ id: '2.8-002' }, 1, 'Care sunt porturile TCP implicite pentru Telnet, SSH, HTTP și HTTPS?', [
    ['23, 22, 80, 443', true, 'Valorile standard.'],
    ['22, 23, 443, 80', false, 'Telnet și SSH, respectiv HTTP și HTTPS, sunt inversate.'],
    ['21, 25, 53, 110', false, 'Sunt porturi ale altor servicii (FTP, SMTP, DNS, POP3).'],
    ['20, 22, 69, 161', false, 'Nu corespund.'],
  ], '23 / 22 / 80 / 443.'),
  single({ id: '2.8-003' }, 1, 'Ce caracterizează accesul prin console?', [
    ['Conexiune locală, out-of-band, nu cere IP', true, 'Utilă la configurare inițială și recuperare.'],
    ['Acces prin Internet, criptat', false, 'Console este locală.'],
    ['Acces doar prin HTTPS', false, 'Nu are legătură.'],
    ['Cere obligatoriu SSH', false, 'Nu are legătură cu SSH.'],
  ], 'Console = local OOB.'),
  single({ id: '2.8-004' }, 2, 'De ce este SSH preferat în locul Telnet?', [
    ['Criptează sesiunea, inclusiv parolele, și autentifică serverul', true, 'Protejează de interceptare și impersonare.'],
    ['Este mai rapid decât Telnet', false, 'Nu viteza este motivul.'],
    ['Folosește UDP', false, 'SSH folosește TCP.'],
    ['Nu necesită IP', false, 'Cere conectivitate IP.'],
  ], 'Criptare.'),
  single({ id: '2.8-005' }, 2, 'Care combinație este necesară pentru ca SSH să funcționeze pe un router Cisco IOS?', [
    ['Hostname, ip domain-name, chei RSA, utilizator local/AAA și transport input ssh', true, 'Cheile RSA se generează din hostname + domain-name.'],
    ['Doar parola de enable', false, 'Nu este suficientă.'],
    ['Un server DNS extern', false, 'Nu este obligatoriu.'],
    ['Telnet activat în prealabil', false, 'SSH nu depinde de Telnet.'],
  ], 'Cerințe SSH.'),
  single({ id: '2.8-006' }, 2, 'Ce comandă generează cheile pentru SSH?', [
    ['crypto key generate rsa', true, 'Creează perechea de chei RSA.'],
    ['ip ssh generate keys', false, 'Nu există această comandă.'],
    ['ssh key create', false, 'Nu este IOS.'],
    ['enable secret', false, 'Setează o parolă, nu chei.'],
  ], 'crypto key generate rsa.'),
  single({ id: '2.8-007' }, 2, 'Ce face „transport input ssh” pe liniile vty?', [
    ['Acceptă doar sesiuni SSH; Telnet este respins', true, 'Interzice protocolul în clar.'],
    ['Activează și Telnet', false, 'Telnet nu mai este permis.'],
    ['Criptează consola', false, 'Nu se aplică la console.'],
    ['Pornește serverul HTTPS', false, 'Nu are legătură.'],
  ], 'Doar SSH.'),
  single({ id: '2.8-008' }, 2, 'Ce comandă aplică o ACL pe liniile vty pentru a limita sursele permise?', [
    ['access-class', true, 'Se aplică pe linii.'],
    ['ip access-group', false, 'Se aplică pe interfețe.'],
    ['ip access-list', false, 'Definește lista, nu o aplică pe linii.'],
    ['transport input', false, 'Alege protocolul, nu sursele.'],
  ], 'access-class.'),
  single({ id: '2.8-009' }, 2, 'Ce înseamnă „out-of-band management”?', [
    ['Management pe o cale independentă de rețeaua de producție (console, port dedicat)', true, 'Funcționează când producția e căzută.'],
    ['Management prin SSH prin rețeaua de producție', false, 'Aceea este in-band.'],
    ['Management prin SNMP doar', false, 'SNMP poate fi in-band sau OOB.'],
    ['Management fără parolă', false, 'Nu are legătură.'],
  ], 'OOB.'),
  single({ id: '2.8-010' }, 2, 'Ce face „no ip http server” împreună cu „ip http secure-server”?', [
    ['Dezactivează GUI în clar (80) și activează GUI cu TLS (443)', true, 'Trecerea la HTTPS.'],
    ['Dezactivează tot accesul web, inclusiv HTTPS', false, 'HTTPS rămâne.'],
    ['Activează HTTP pe 443', false, '443 este HTTPS.'],
    ['Activează SSH', false, 'Nu are legătură.'],
  ], 'HTTPS în loc de HTTP.'),
  single({ id: '2.8-011' }, 2, 'Ce este „enable secret” comparativ cu „enable password”?', [
    ['Parola modului privilegiat stocată ca hash, mai sigură decât enable password', true, 'Secret se stochează hash.'],
    ['Aceeași, doar cu alt nume', false, 'Diferă prin stocare.'],
    ['Parolă pentru console', false, 'Pentru console se folosește line console.'],
    ['Parolă pentru SSH', false, 'Nu are legătură.'],
  ], 'secret = hash.'),
  { id: '2.8-012', topicId: T, sub: T, type: 'match', difficulty: 1,
    stem: 'Potrivește metoda cu portul și proprietatea ei.',
    leftLabel: 'Metodă', rightLabel: 'Descriere',
    pairs: [
      { left: 'Telnet', right: 'TCP 23, în clar', why: 'Nu criptează.' },
      { left: 'SSH', right: 'TCP 22, criptat', why: 'CLI securizat.' },
      { left: 'HTTP', right: 'TCP 80, în clar', why: 'GUI necriptat.' },
      { left: 'HTTPS', right: 'TCP 443, TLS', why: 'GUI criptat.' },
    ],
    distractors: [{ text: 'UDP 161, SNMP', why: 'SNMP nu este o metodă de CLI/GUI aici.' }],
    explanation: 'Telnet/HTTP în clar; SSH/HTTPS criptate.' },

  // ======================= AAA =======================
  single({ id: '2.8-013' }, 1, 'Ce înseamnă cele trei A din AAA?', [
    ['Authentication, Authorization, Accounting', true, 'Cine ești, ce ai voie, ce ai făcut.'],
    ['Access, Allow, Audit', false, 'Nu corespund.'],
    ['Address, Authenticate, Alert', false, 'Nu corespund.'],
    ['Antivirus, Antispam, Antimalware', false, 'Nu sunt AAA.'],
  ], 'AAA.'),
  single({ id: '2.8-014' }, 2, 'Ce funcție AAA decide ce comenzi poate rula un administrator?', [
    ['Authorization', true, 'Drepturile după autentificare.'],
    ['Authentication', false, 'Verifică identitatea.'],
    ['Accounting', false, 'Înregistrează activitatea.'],
    ['Encryption', false, 'Nu este componentă AAA.'],
  ], 'Authorization.'),
  single({ id: '2.8-015' }, 2, 'Care protocol AAA folosește TCP 49?', [
    ['TACACS+', true, 'Transport TCP.'],
    ['RADIUS', false, 'Folosește UDP 1812/1813.'],
    ['LDAP', false, 'Alt protocol de director.'],
    ['Kerberos', false, 'Folosește alte porturi.'],
  ], 'TACACS+ = TCP 49.'),
  single({ id: '2.8-016' }, 2, 'Care protocol AAA folosește UDP 1812 și 1813?', [
    ['RADIUS', true, 'Autentificare și contabilizare.'],
    ['TACACS+', false, 'Folosește TCP 49.'],
    ['SNMP', false, 'Folosește UDP 161/162.'],
    ['Syslog', false, 'Folosește UDP 514.'],
  ], 'RADIUS.'),
  single({ id: '2.8-017' }, 2, 'Care protocol criptează tot conținutul pachetului, nu doar parola?', [
    ['TACACS+', true, 'Criptează corpul pachetului.'],
    ['RADIUS', false, 'Criptează doar parola.'],
    ['Telnet', false, 'Nu criptează.'],
    ['HTTP', false, 'Nu criptează.'],
  ], 'TACACS+.'),
  single({ id: '2.8-018' }, 2, 'Care protocol AAA este potrivit pentru autentificarea 802.1X a utilizatorilor pe un WLAN enterprise?', [
    ['RADIUS', true, 'Standardul folosit în 802.1X.'],
    ['TACACS+', false, 'Pentru administrarea echipamentelor.'],
    ['Telnet', false, 'Nu este AAA.'],
    ['SNMP', false, 'Nu este AAA.'],
  ], 'RADIUS pentru 802.1X.'),
  single({ id: '2.8-019' }, 3, 'De ce se adaugă „local” la finalul listei „aaa authentication login default group tacacs+ local”?', [
    ['Ca să poți intra cu un cont local dacă serverul TACACS+ nu răspunde', true, 'Fallback.'],
    ['Pentru a cripta parolele', false, 'Nu are legătură.'],
    ['Pentru a dezactiva TACACS+', false, 'TACACS+ rămâne metoda principală.'],
    ['Pentru a activa SSH', false, 'Nu are legătură.'],
  ], 'Fallback local.'),
  single({ id: '2.8-020' }, 3, 'Ce comandă activează modelul AAA pe IOS?', [
    ['aaa new-model', true, 'Prerequisit pentru listele de metode.'],
    ['aaa enable', false, 'Nu există.'],
    ['tacacs enable', false, 'Nu există.'],
    ['login aaa', false, 'Nu este comanda globală.'],
  ], 'aaa new-model.'),
  multi({ id: '2.8-021' }, 2, 'Care sunt diferențe corecte între TACACS+ și RADIUS? (alege trei)', [
    ['TACACS+ folosește TCP; RADIUS folosește UDP', true, 'Transport diferit.'],
    ['TACACS+ criptează tot corpul; RADIUS doar parola', true, 'Diferență de criptare.'],
    ['TACACS+ separă autentificare, autorizare și contabilizare', true, 'Granularitate mai mare.'],
    ['RADIUS este proprietar Cisco', false, 'RADIUS este standard deschis.'],
    ['TACACS+ este standard IEEE', false, 'Nu este IEEE.'],
  ], 'Transport, criptare, separare.'),
  { id: '2.8-022', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește componenta AAA cu rolul ei.',
    leftLabel: 'Componentă', rightLabel: 'Rol',
    pairs: [
      { left: 'Authentication', right: 'Verifică identitatea utilizatorului', why: 'Cine ești.' },
      { left: 'Authorization', right: 'Stabilește drepturile și comenzile permise', why: 'Ce ai voie.' },
      { left: 'Accounting', right: 'Înregistrează sesiuni și comenzi', why: 'Ce ai făcut.' },
      { left: 'NAS', right: 'Echipamentul care trimite cererea serverului AAA', why: 'Network Access Server / client AAA.' },
    ],
    distractors: [{ text: 'Criptează conținutul cadrelor', why: 'Nu este rol AAA.' }],
    explanation: 'Cele trei A + NAS.' },

  // ======================= Cloud =======================
  single({ id: '2.8-023' }, 1, 'Ce este un echipament „cloud-managed” (de exemplu Meraki)?', [
    ['Echipament administrat dintr-un dashboard în cloud, fără CLI pe fiecare', true, 'Configurare centralizată prin web.'],
    ['Echipament care rulează doar în cloud, fără hardware', false, 'Hardware-ul este local.'],
    ['Echipament fără acces la Internet', false, 'Are nevoie de Internet pentru management.'],
    ['Echipament care trimite traficul clienților prin cloud', false, 'Datele rămân locale.'],
  ], 'Cloud-managed.'),
  single({ id: '2.8-024' }, 2, 'Un AP Meraki pierde conexiunea la cloud. Ce se întâmplă cu clienții deja conectați?', [
    ['Rețeaua continuă să funcționeze; nu mai poți schimba configurația până revine legătura', true, 'Planul de date este local.'],
    ['Toți clienții sunt deconectați imediat', false, 'Nu este comportamentul normal.'],
    ['AP-ul devine autonom și se reconfigurează', false, 'Nu se reconfigurează singur.'],
    ['Traficul trece prin WLC', false, 'Nu există WLC aici.'],
  ], 'Management ≠ date.'),
  single({ id: '2.8-025' }, 2, 'Cine inițiază conexiunea într-o arhitectură cloud-managed?', [
    ['Echipamentul, spre cloud', true, 'Nu e nevoie de porturi deschise spre exterior.'],
    ['Cloud-ul, spre fiecare echipament', false, 'Echipamentul inițiază.'],
    ['Administratorul, direct prin Telnet', false, 'Se folosește dashboard-ul.'],
    ['Un WLC local', false, 'Nu are legătură.'],
  ], 'Echipamentul inițiază.'),

  // ======================= CLI =======================
  { id: '2.8-026', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Pe liniile vty, permite doar SSH.',
    prompt: 'R1(config-line)#', canonical: 'transport input ssh', answers: ['transport input ssh'], hint: 'transport …',
    wrong: [
      { text: 'transport input telnet', why: 'Permite doar Telnet.' },
      { text: 'transport input all', why: 'Permite și Telnet.' },
      { text: 'login local', why: 'Setează autentificarea, nu protocolul.' },
    ],
    explanation: 'transport input ssh.' },
  { id: '2.8-027', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Generează chei RSA cu modulul 2048 biți.',
    prompt: 'R1(config)#', canonical: 'crypto key generate rsa modulus 2048', answers: ['crypto key generate rsa modulus 2048'], hint: 'crypto key …',
    wrong: [
      { text: 'crypto key generate rsa', why: 'Fără modulus; va întreba interactiv, nu fixează 2048.' },
      { text: 'ip ssh rsa keysize 2048', why: 'Sintaxă diferită, nu generează cheile.' },
      { text: 'crypto key zeroize rsa', why: 'Șterge cheile.' },
    ],
    explanation: 'crypto key generate rsa modulus 2048.' },
  { id: '2.8-028', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Dezactivează serverul HTTP (necriptat) al echipamentului.',
    prompt: 'SW1(config)#', canonical: 'no ip http server', answers: ['no ip http server'], hint: 'no ip …',
    wrong: [
      { text: 'no ip http secure-server', why: 'Aceasta oprește HTTPS.' },
      { text: 'ip http server', why: 'Pornește HTTP.' },
      { text: 'no http server', why: 'Lipsește „ip”.' },
    ],
    explanation: 'no ip http server.' },
  { id: '2.8-029', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Activează modelul AAA pe router.',
    prompt: 'R1(config)#', canonical: 'aaa new-model', answers: ['aaa new-model'], hint: 'aaa …',
    wrong: [
      { text: 'aaa authentication login default local', why: 'Presupune modelul deja activ.' },
      { text: 'aaa enable', why: 'Comanda nu există în IOS; modelul AAA se activează cu aaa new-model.' },
      { text: 'tacacs server TAC1', why: 'Definește serverul, nu activează AAA.' },
    ],
    explanation: 'aaa new-model.' },

  // ======================= Scenarii =======================
  single({ id: '2.8-030' }, 2, 'Rețeaua de producție a căzut și nu mai poți folosi SSH. Ce cale de acces rămâne?', [
    ['Console (out-of-band) sau un port de management dedicat', true, 'Independente de producție.'],
    ['Telnet prin aceeași rețea', false, 'Tot in-band.'],
    ['HTTPS pe aceeași rețea', false, 'Tot in-band.'],
    ['Niciuna', false, 'Console rămâne.'],
  ], 'OOB.'),
  single({ id: '2.8-031' }, 3, 'Un administrator a configurat AAA TACACS+ fără „local”, iar serverul este căzut. Ce se întâmplă?', [
    ['Nu poate intra pe vty; trebuie să folosească console sau să recupereze serverul', true, 'Lipsa fallback-ului blochează accesul.'],
    ['Intră cu orice parolă', false, 'Nu există această regulă.'],
    ['Echipamentul trece pe RADIUS automat', false, 'Nu fără configurare.'],
    ['Se dezactivează AAA singur', false, 'Nu se întâmplă.'],
  ], 'Fallback.'),
  single({ id: '2.8-032' }, 3, 'Care combinație de metode pentru un router în producție este cea mai bună?', [
    ['SSH v2 pe vty + HTTPS + AAA cu fallback local + ACL de management', true, 'Criptat, centralizat, restricționat.'],
    ['Telnet + HTTP + parolă comună', false, 'Nesigur.'],
    ['Doar console', false, 'Nepractic pentru multe echipamente.'],
    ['SSH v1 + HTTP', false, 'Versiuni/protocoale mai slabe.'],
  ], 'Combinația securizată.'),
  single({ id: '2.8-033' }, 2, 'De ce se folosește „login block-for 120 attempts 3 within 60”?', [
    ['Ca să încetinească atacurile prin forță brută asupra login-ului', true, 'Blochează încercările după eșecuri repetate.'],
    ['Ca să activeze SSH', false, 'Nu are legătură.'],
    ['Ca să cripteze parolele', false, 'Nu are legătură.'],
    ['Ca să limiteze lățimea de bandă', false, 'Nu are legătură.'],
  ], 'Protecție la forță brută.'),
  single({ id: '2.8-034' }, 2, 'Ce reprezintă „service password-encryption”?', [
    ['Ascunde parolele din configurație cu o criptare slabă (reversibilă)', true, 'Nu este protecție puternică.'],
    ['Criptează traficul SSH', false, 'Nu are legătură.'],
    ['Convertește enable password în enable secret', false, 'Nu face asta.'],
    ['Activează AAA', false, 'Nu are legătură.'],
  ], 'Doar ascunde.'),
  single({ id: '2.8-035' }, 3, 'Unde se potrivește mai bine TACACS+ decât RADIUS?', [
    ['Autorizare pe comandă pentru administratorii de rețea', true, 'Granularitate mare.'],
    ['Autentificarea 802.1X a laptopurilor', false, 'Pentru 802.1X se folosește RADIUS.'],
    ['VPN pentru utilizatori', false, 'Tipic RADIUS.'],
    ['Alocarea de adrese IP', false, 'Aceea este DHCP.'],
  ], 'TACACS+ pentru admin.'),
  single({ id: '2.8-036' }, 2, 'La ce folosește „exec-timeout 5 0” pe linii?', [
    ['Închide sesiunile inactive după 5 minute', true, 'Reduce riscul sesiunilor uitate.'],
    ['Limitează sesiunea la 5 secunde', false, 'Sunt 5 minute și 0 secunde.'],
    ['Activează SSH', false, 'Nu are legătură.'],
    ['Setează parola', false, 'Nu are legătură.'],
  ], 'Timeout.'),
  { id: '2.8-037', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii pentru a activa SSH pe un router.',
    items: [
      { text: 'Setezi hostname-ul și ip domain-name', why: 'Cheile RSA se denumesc din ele.' },
      { text: 'Generezi cheile RSA (crypto key generate rsa)', why: 'Pornește serverul SSH.' },
      { text: 'Creezi un utilizator local (username … secret …)', why: 'Autentificare cu login local.' },
      { text: 'Pe line vty: login local și transport input ssh', why: 'Doar SSH, cu utilizator.' },
      { text: 'Verifici cu show ip ssh și o conexiune de test', why: 'Verifici că SSH este activ și că sesiunea se stabilește.' },
    ],
    explanation: 'Nume → chei → utilizator → vty → verificare.' },
  { id: '2.8-038', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii unei autentificări AAA a unui administrator.',
    items: [
      { text: 'Administratorul deschide o sesiune SSH către echipament', why: 'Începutul fluxului.' },
      { text: 'Echipamentul (NAS) trimite cererea serverului AAA', why: 'RADIUS/TACACS+.' },
      { text: 'Serverul verifică identitatea și drepturile', why: 'Authentication + authorization.' },
      { text: 'Serverul răspunde accept/reject', why: 'Serverul decide: accept sau reject, eventual cu atribute de autorizare.' },
      { text: 'Echipamentul acordă accesul și poate trimite accounting', why: 'Pasul final: după decizia serverului, accesul este acordat sau refuzat.' },
    ],
    explanation: 'Sesiune → cerere → verificare → răspuns → acces.' },
  multi({ id: '2.8-039' }, 2, 'Care sunt metode de acces criptate? (alege două)', [
    ['SSH', true, 'CLI criptat.'],
    ['HTTPS', true, 'GUI criptat.'],
    ['Telnet', false, 'În clar.'],
    ['HTTP', false, 'În clar.'],
  ], 'SSH și HTTPS.'),
  multi({ id: '2.8-040' }, 3, 'Care măsuri cresc securitatea accesului de management? (alege trei)', [
    ['access-class pe vty cu rețeaua de management', true, 'Limitează sursele.'],
    ['AAA centralizat cu fallback local', true, 'Identități individuale + audit.'],
    ['Dezactivarea HTTP și folosirea HTTPS', true, 'Elimină canalul în clar.'],
    ['Aceeași parolă „cisco” pe toate echipamentele', false, 'Parola comună este un risc major.'],
    ['Telnet cu parolă lungă', false, 'Traficul tot în clar.'],
  ], 'Restricționare, AAA, HTTPS.'),
];
