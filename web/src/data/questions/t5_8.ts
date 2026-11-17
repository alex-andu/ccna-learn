import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.8 Compare authentication, authorization, and accounting concepts.
// Obiectivul oficial nu are sub-puncte; `sub` = '5.8'. Fiecare variantă are explicație (why).
const T = '5.8';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_8: Question[] = [
  // ======================= Cele trei funcții =======================
  single({ id: '5.8-001' }, 1, 'Ce înseamnă AAA?', [
    ['Authentication, Authorization, Accounting', true, 'Cele trei funcții: cine ești, ce ai voie, ce ai făcut.'],
    ['Access, Availability, Authority', false, 'Nu este denumirea acestui cadru de securitate.'],
    ['Authentication, Availability, Auditing', false, 'Disponibilitatea nu face parte din AAA.'],
    ['Address, Access, Allocation', false, 'Nu are legătură cu securitatea de acces.'],
  ], 'AAA = Authentication, Authorization, Accounting.'),
  single({ id: '5.8-002' }, 1, 'Care funcție AAA răspunde la întrebarea „Cine ești?”', [
    ['Authentication', true, 'Verifică identitatea cu parolă, certificat sau MFA.'],
    ['Authorization', false, 'Aceasta stabilește ce ai voie să faci.'],
    ['Accounting', false, 'Aceasta înregistrează ce ai făcut.'],
    ['Availability', false, 'Nu este o funcție AAA.'],
  ], 'Cine ești = autentificare.'),
  single({ id: '5.8-003' }, 1, 'Un administrator se poate autentifica, dar poate rula doar comenzi „show”. Ce funcție AAA impune restricția?', [
    ['Authorization', true, 'Stabilește ce are voie utilizatorul autentificat (privilegii, comenzi).'],
    ['Authentication', false, 'Aceasta doar confirmă identitatea.'],
    ['Accounting', false, 'Aceasta doar înregistrează ce se face.'],
    ['Encryption', false, 'Criptarea protejează datele, nu stabilește drepturi.'],
  ], 'Drepturi = autorizare.'),
  single({ id: '5.8-004' }, 1, 'Ce funcție AAA păstrează un jurnal cu cine s-a conectat, când și ce comenzi a dat?', [
    ['Accounting', true, 'Contabilizarea înregistrează sesiuni, durate, trafic, comenzi.'],
    ['Authentication', false, 'Aceasta verifică identitatea, nu păstrează jurnalul activității.'],
    ['Authorization', false, 'Aceasta decide ce e permis.'],
    ['Syslog-ul local în mod exclusiv', false, 'Accounting este o funcție AAA trimisă serverului; syslog este un mecanism diferit.'],
  ], 'Jurnal de activitate = accounting.'),
  single({ id: '5.8-005' }, 2, 'În ce ordine se petrec, logic, cele trei funcții la un login?', [
    ['Autentificare, apoi autorizare, apoi contabilizare', true, 'Întâi știi cine e, apoi ce are voie, apoi înregistrezi ce face.'],
    ['Autorizare, autentificare, contabilizare', false, 'Nu poți autoriza pe cineva neidentificat.'],
    ['Contabilizare, autentificare, autorizare', false, 'Înregistrarea sesiunii presupune un utilizator identificat.'],
    ['Toate simultan, fără ordine', false, 'Există o ordine logică, chiar dacă unele mesaje pot fi combinate (RADIUS).'],
  ], 'AuthN → AuthZ → Acct.'),
  single({ id: '5.8-006' }, 2, 'Un utilizator introduce utilizator și parolă corecte pe un router. Ce funcție AAA tocmai a fost executată?', [
    ['Authentication', true, 'Credențialele au dovedit identitatea.'],
    ['Authorization', false, 'Autorizarea ar decide ce poate face după login.'],
    ['Accounting', false, 'Accounting ar înregistra sesiunea.'],
    ['Niciuna, parola nu e AAA', false, 'Verificarea parolei este chiar autentificarea.'],
  ], 'Parola corectă = autentificare.'),
  single({ id: '5.8-007' }, 2, 'Un auditor vrea să știe cine a modificat configurația routerului ieri la 14:00. Care funcție oferă această informație?', [
    ['Accounting (cu accounting pe comenzi)', true, 'Înregistrează utilizatorul și comenzile cu ora.'],
    ['Authentication', false, 'Spune doar cine s-a identificat, nu ce a făcut.'],
    ['Authorization', false, 'Spune ce avea voie, nu ce a făcut.'],
    ['VLAN pruning', false, 'Nu are legătură.'],
  ], 'Audit = accounting.'),
  single({ id: '5.8-008' }, 2, 'Ce date poate conține o înregistrare de accounting?', [
    ['Utilizatorul, ora de început și sfârșit, durata, volumul de trafic și, opțional, comenzile', true, 'Mesajele START/STOP/interim transportă aceste informații.'],
    ['Doar parola utilizatorului', false, 'Parolele nu se înregistrează în accounting.'],
    ['Numai adresa MAC a serverului', false, 'Accounting descrie activitatea utilizatorului.'],
    ['Cheia privată a routerului', false, 'Nu este conținut de accounting.'],
  ], 'Accounting = sesiune, durată, trafic, comenzi.'),

  // ======================= Local vs server =======================
  single({ id: '5.8-009' }, 1, 'Care este principalul dezavantaj al conturilor definite local pe fiecare echipament?', [
    ['Nu scalează: schimbarea unei parole sau eliminarea unui angajat cere intervenție pe fiecare echipament', true, 'Un server central administrează conturile într-un singur loc.'],
    ['Nu pot fi folosite deloc', false, 'Funcționează, dar greu de gestionat la scară.'],
    ['Sunt întotdeauna necriptate', false, 'Cu secret, parola este stocată hash-uită; problema este administrarea.'],
    ['Cer licență specială', false, 'Nu cer licență.'],
  ], 'Local nu scalează.'),
  single({ id: '5.8-010' }, 2, 'Care este avantajul unui server AAA central față de baza locală?', [
    ['Conturi, politici și jurnale administrate într-un singur loc, pentru toate echipamentele', true, 'Un utilizator dezactivat pe server pierde accesul peste tot.'],
    ['Elimină nevoia de parole', false, 'Parolele (sau alte credențiale) rămân necesare.'],
    ['Nu depinde de rețea', false, 'Dimpotrivă: depinde de conectivitatea cu serverul; de aceea există fallback.'],
    ['Criptează automat toate datele din rețea', false, 'Protejează doar schimburile AAA.'],
  ], 'Server central = administrare unică.'),
  single({ id: '5.8-011' }, 2, 'Ce rol are comanda „aaa new-model” pe un router Cisco?', [
    ['Activează modelul AAA, fără de care listele de metode nu funcționează', true, 'Este primul pas al configurării AAA.'],
    ['Creează automat un server TACACS+', false, 'Serverul se definește separat.'],
    ['Șterge toate conturile locale', false, 'Nu șterge nimic; conturile locale pot fi folosite ca metodă.'],
    ['Activează SSH', false, 'SSH are propria configurare.'],
  ], 'aaa new-model = pornește AAA.'),
  single({ id: '5.8-012' }, 2, 'Ce este un NAS în contextul AAA?', [
    ['Dispozitivul de acces (router, switch, WLC) care primește utilizatorul și întreabă serverul AAA', true, 'Este clientul RADIUS/TACACS+.'],
    ['Serverul care stochează conturile', false, 'Acela este serverul AAA.'],
    ['Un tip de stocare în rețea', false, 'Aici NAS nu înseamnă Network Attached Storage.'],
    ['Utilizatorul final', false, 'Utilizatorul este cel care se autentifică, nu NAS-ul.'],
  ], 'NAS = Network Access Server.'),

  // ======================= RADIUS vs TACACS+ =======================
  single({ id: '5.8-013' }, 1, 'Ce transport și ce porturi folosește RADIUS?', [
    ['UDP 1812 (autentificare/autorizare) și 1813 (accounting)', true, 'Porturile vechi 1645/1646 pot apărea în implementări mai vechi.'],
    ['TCP 49', false, 'Acesta este TACACS+.'],
    ['TCP 22', false, 'Acesta este SSH.'],
    ['UDP 69', false, 'Acesta este TFTP.'],
  ], 'RADIUS = UDP 1812/1813.'),
  single({ id: '5.8-014' }, 1, 'Ce transport folosește TACACS+?', [
    ['TCP 49', true, 'Transport fiabil, orientat pe conexiune.'],
    ['UDP 1812', false, 'Este RADIUS.'],
    ['UDP 514', false, 'Este syslog.'],
    ['TCP 443', false, 'Este HTTPS.'],
  ], 'TACACS+ = TCP 49.'),
  single({ id: '5.8-015' }, 2, 'Ce parte a pachetului criptează RADIUS?', [
    ['Doar câmpul de parolă', true, 'Restul atributelor rămân în clar.'],
    ['Tot pachetul', false, 'Aceasta este TACACS+.'],
    ['Doar antetul', false, 'Antetul nu este criptat.'],
    ['Nimic', false, 'Parola este ascunsă cu secretul partajat.'],
  ], 'RADIUS: doar parola.'),
  single({ id: '5.8-016' }, 2, 'Ce parte a pachetului criptează TACACS+?', [
    ['Tot corpul pachetului (antetul rămâne în clar)', true, 'Utilizator, parolă, comenzi, atribute — toate sunt protejate.'],
    ['Doar parola', false, 'Aceasta este RADIUS.'],
    ['Nimic, folosește TLS separat', false, 'TACACS+ își criptează singur corpul.'],
    ['Doar numele de utilizator', false, 'Nu este așa.'],
  ], 'TACACS+: tot corpul.'),
  single({ id: '5.8-017' }, 2, 'Care protocol separă complet autentificarea, autorizarea și accounting-ul?', [
    ['TACACS+', true, 'Fiecare funcție are mesaje distincte; permite autorizare pe comandă.'],
    ['RADIUS', false, 'RADIUS combină autentificarea cu autorizarea într-un singur răspuns.'],
    ['Niciunul', false, 'TACACS+ le separă.'],
    ['SNMP', false, 'SNMP nu este un protocol AAA.'],
  ], 'TACACS+ separă AAA.'),
  single({ id: '5.8-018' }, 2, 'Pentru ce se folosește de obicei TACACS+?', [
    ['Administrarea echipamentelor, cu autorizare pe comandă', true, 'Roluri precum operator/inginer pot fi aplicate pe comenzi.'],
    ['Acces la Wi-Fi Enterprise și VPN pentru utilizatori', false, 'Pentru acces la rețea se folosește de obicei RADIUS.'],
    ['Sincronizarea ceasului', false, 'Aceasta este NTP.'],
    ['Rezolvarea numelor', false, 'Aceasta este DNS.'],
  ], 'TACACS+ → administrare.'),
  single({ id: '5.8-019' }, 2, 'Pentru ce se folosește de obicei RADIUS?', [
    ['Acces la rețea: 802.1X, VPN, Wi-Fi', true, 'Standard deschis, larg suportat de AP, switch-uri și gateway-uri VPN.'],
    ['Autorizarea fiecărei comenzi CLI', false, 'Aceasta este punctul forte al TACACS+.'],
    ['Distribuirea rutelor', false, 'Aceasta este rolul protocoalelor de rutare.'],
    ['Alocarea adreselor IP', false, 'Aceasta este DHCP.'],
  ], 'RADIUS → acces la rețea.'),
  single({ id: '5.8-020' }, 2, 'Care afirmație despre originea protocoalelor este corectă?', [
    ['RADIUS este standard deschis IETF; TACACS+ a pornit de la Cisco', true, 'RADIUS: RFC 2865/2866; TACACS+: descris în RFC 8907.'],
    ['Ambele sunt proprietare Cisco', false, 'RADIUS este standard deschis.'],
    ['RADIUS a pornit de la Cisco, TACACS+ este standard IETF', false, 'Este invers.'],
    ['Niciunul nu are specificație publică', false, 'Ambele sunt documentate public.'],
  ], 'RADIUS = deschis; TACACS+ = Cisco.'),

  // ======================= Liste de metode =======================
  single({ id: '5.8-021' }, 2, 'Ce înseamnă „aaa authentication login default group tacacs+ local”?', [
    ['Autentifică întâi la serverele TACACS+; dacă nu răspund, folosește baza locală', true, 'Metodele se încearcă în ordine; local este rezerva.'],
    ['Autentifică doar local', false, 'Local este doar a doua metodă.'],
    ['Autentifică local și apoi mereu la server', false, 'Ordinea este serverul întâi.'],
    ['Dezactivează autentificarea', false, 'O activează.'],
  ], 'group tacacs+ local = server, apoi rezervă.'),
  single({ id: '5.8-022' }, 3, 'Lista „group tacacs+ local”. Serverul este activ, dar respinge parola introdusă. Ce se întâmplă?', [
    ['Accesul este refuzat; nu se încearcă „local”', true, 'Un refuz (FAIL) este definitiv; metoda următoare se folosește doar la lipsa răspunsului (ERROR).'],
    ['Se încearcă baza locală și, dacă parola acolo e corectă, accesul este permis', false, 'Fallback-ul nu se activează la refuz.'],
    ['Routerul repornește', false, 'Nu are loc o repornire.'],
    ['Utilizatorul este înregistrat ca administrator', false, 'Nu are legătură.'],
  ], 'Fallback doar la ERROR, nu la FAIL.'),
  single({ id: '5.8-023' }, 3, 'Serverul TACACS+ este inaccesibil, iar lista este „group tacacs+ local”. Cum se poate autentifica un administrator?', [
    ['Cu un cont local, deoarece metoda „local” este încercată când serverul nu răspunde', true, 'Fallback-ul protejează de pierderea accesului.'],
    ['Nu se poate; toată lumea e blocată', false, 'Este adevărat doar dacă lipsește „local” din listă.'],
    ['Fără parolă, automat', false, 'Nu există acces fără credențiale.'],
    ['Doar prin SNMP', false, 'SNMP nu este o metodă de login.'],
  ], 'Server căzut + local în listă = acces prin cont local.'),
  single({ id: '5.8-024' }, 3, 'Ai configurat „aaa authentication login default group tacacs+” (fără local) și serverul cade. Ce se întâmplă?', [
    ['Nimeni nu se mai poate autentifica pe liniile care folosesc lista (lockout)', true, 'Fără metodă de rezervă, lipsa serverului blochează accesul. De aceea se prevede fallback local, iar consola poate avea o listă separată.'],
    ['Toate liniile devin fără parolă', false, 'Nu se dezactivează autentificarea.'],
    ['Routerul trece automat pe RADIUS', false, 'Nu există o asemenea comutare automată.'],
    ['Doar consola este afectată', false, 'Sunt afectate toate liniile care folosesc lista default.'],
  ], 'Fără fallback → lockout.'),
  single({ id: '5.8-025' }, 3, 'Secretul partajat configurat pe router diferă de cel de pe serverul AAA. Care este simptomul tipic?', [
    ['Autentificarea eșuează pentru toți utilizatorii / serverul pare „nu răspunde”', true, 'Serverul nu poate valida/decripta cererile, deci le respinge sau le ignoră.'],
    ['Doar contabilizarea este afectată', false, 'Secretul afectează toate tipurile de mesaje.'],
    ['Routerul își schimbă hostname-ul', false, 'Nu există o asemenea legătură.'],
    ['Nimic, secretul este opțional', false, 'Secretul este obligatoriu.'],
  ], 'Secret nepotrivit = server „mut”.'),

  // ======================= 802.1X =======================
  single({ id: '5.8-026' }, 2, 'Care sunt cele trei roluri din 802.1X?', [
    ['Supplicant, authenticator, authentication server', true, 'Client, dispozitivul de acces, serverul RADIUS.'],
    ['Client, router, DNS', false, 'DNS nu are rol în 802.1X.'],
    ['Manager, agent, MIB', false, 'Acestea sunt din SNMP.'],
    ['Root, designated, blocked', false, 'Acestea sunt roluri STP.'],
  ], 'Supplicant – authenticator – server.'),
  single({ id: '5.8-027' }, 2, 'Pe un port 802.1X, ce trafic trece înainte de autentificare?', [
    ['Doar EAPOL (și, de obicei, CDP/STP); restul este blocat', true, 'Portul este în starea „neautorizat” până la Access-Accept.'],
    ['Tot traficul, dar monitorizat', false, 'Portul blochează traficul obișnuit.'],
    ['Doar DHCP', false, 'DHCP este blocat până la autentificare.'],
    ['Doar HTTP', false, 'Nici HTTP nu trece.'],
  ], 'Neautorizat = doar EAPOL.'),
  single({ id: '5.8-028' }, 2, 'Între ce elemente circulă EAPOL și între care RADIUS în 802.1X?', [
    ['EAPOL: supplicant ↔ authenticator; RADIUS: authenticator ↔ authentication server', true, 'Authenticator-ul face traducerea între cele două.'],
    ['EAPOL: authenticator ↔ server; RADIUS: supplicant ↔ authenticator', false, 'Este invers.'],
    ['EAPOL și RADIUS între supplicant și server', false, 'Clientul nu vorbește direct cu serverul în acest model.'],
    ['EAPOL pe tot drumul, RADIUS doar pentru accounting', false, 'RADIUS transportă EAP către server.'],
  ], 'EAPOL client–switch; RADIUS switch–server.'),

  // ======================= Multi =======================
  multi({ id: '5.8-029' }, 1, 'Care sunt funcții AAA? (alege toate variantele corecte)', [
    ['Authentication', true, 'Cine ești.'],
    ['Authorization', true, 'Ce ai voie.'],
    ['Accounting', true, 'Ce ai făcut.'],
    ['Availability', false, 'Face parte din triada CIA, nu din AAA.'],
    ['Addressing', false, 'Nu este funcție AAA.'],
  ], 'Auth, Authz, Acct.'),
  multi({ id: '5.8-030' }, 2, 'Care sunt caracteristici ale TACACS+? (alege toate variantele corecte)', [
    ['Folosește TCP 49', true, 'Transport fiabil.'],
    ['Criptează tot corpul pachetului', true, 'Doar antetul rămâne în clar.'],
    ['Separă autentificarea, autorizarea și accounting-ul', true, 'Permite autorizare pe comandă.'],
    ['Folosește UDP 1812', false, 'Aceasta este RADIUS.'],
    ['Criptează doar parola', false, 'Aceasta este RADIUS.'],
  ], 'TACACS+: TCP 49, tot corpul, funcții separate.'),
  multi({ id: '5.8-031' }, 2, 'Care sunt caracteristici ale RADIUS? (alege toate variantele corecte)', [
    ['Standard deschis IETF', true, 'RFC 2865/2866.'],
    ['Folosește UDP (1812/1813)', true, 'Transport fără conexiune.'],
    ['Combină autentificarea și autorizarea într-un singur răspuns', true, 'Access-Accept poartă și atributele de autorizare.'],
    ['Criptează tot corpul pachetului', false, 'Doar parola este ascunsă.'],
    ['Folosește TCP 49', false, 'Aceasta este TACACS+.'],
  ], 'RADIUS: deschis, UDP, AuthN+AuthZ combinate.'),

  // ======================= Match / Order =======================
  match({ id: '5.8-032' }, 1, 'Potrivește funcția AAA cu întrebarea la care răspunde.', [
    { left: 'Authentication', right: 'Cine ești?', why: 'Verificarea identității.' },
    { left: 'Authorization', right: 'Ce ai voie să faci?', why: 'Privilegii și comenzi.' },
    { left: 'Accounting', right: 'Ce ai făcut și cât timp?', why: 'Jurnal de activitate.' },
    { left: 'Method list', right: 'În ce ordine încerc sursele?', why: 'Listă ordonată (server, apoi local).' },
  ], [
    { text: 'Ce algoritm de criptare folosesc?', why: 'Nu este o întrebare AAA.' },
    { text: 'Pe ce VLAN este portul?', why: 'Nu este o întrebare AAA.' },
  ], 'Fiecare funcție are întrebarea ei.'),
  match({ id: '5.8-033' }, 2, 'Potrivește elementul cu descrierea corectă.', [
    { left: 'RADIUS', right: 'UDP 1812/1813', why: 'Porturi UDP pentru autentificare/autorizare și accounting.' },
    { left: 'TACACS+', right: 'TCP 49', why: 'Transport TCP.' },
    { left: '802.1X de pe partea clientului', right: 'EAPOL', why: 'EAP peste LAN între supplicant și authenticator.' },
    { left: 'Bază locală de utilizatori', right: 'username … secret …', why: 'Conturi pe echipament, fără server.' },
  ], [
    { text: 'UDP 514', why: 'Este syslog.' },
    { text: 'TCP 22', why: 'Este SSH.' },
  ], 'Protocol ↔ transport.'),
  order({ id: '5.8-034' }, 3, 'Ordonează evenimentele unui login de administrare prin TACACS+.', [
    { text: 'Administratorul se conectează la router (NAS) și introduce credențialele', why: 'Începutul sesiunii.' },
    { text: 'Routerul cere serverului autentificarea (TACACS+ AUTHEN)', why: 'Se verifică identitatea.' },
    { text: 'Serverul răspunde PASS', why: 'Autentificare reușită.' },
    { text: 'Routerul cere autorizarea (nivel de privilegiu, comenzi)', why: 'Mesaj distinct la TACACS+.' },
    { text: 'Routerul trimite accounting START, apoi STOP la deconectare', why: 'Jurnalul sesiunii.' },
  ], 'AuthN → AuthZ → Acct.'),
  order({ id: '5.8-035' }, 3, 'Ordonează pașii prudenți de configurare AAA cu TACACS+ și fallback local.', [
    { text: 'Creezi un utilizator local de rezervă (username … secret …)', why: 'Fallback-ul trebuie să existe înainte.' },
    { text: 'Activezi aaa new-model', why: 'Pornește modelul AAA.' },
    { text: 'Definești serverul TACACS+ și secretul', why: 'NAS-ul trebuie să știe unde întreabă.' },
    { text: 'Creezi lista: aaa authentication login default group tacacs+ local', why: 'Serverul, apoi rezerva.' },
    { text: 'Testezi dintr-o a doua sesiune înainte să închizi prima', why: 'Evită blocarea accidentală.' },
  ], 'Fallback → aaa new-model → server → listă → test.'),

  // ======================= CLI =======================
  cli({ id: '5.8-036' }, 1, 'Ești în R1(config)#. Activează modelul AAA.', 'R1(config)#', 'aaa new-model', ['aaa new-model'], [
    { text: 'aaa enable', why: 'Nu este comandă IOS.' },
    { text: 'aaa model new', why: 'Ordinea cuvintelor este greșită.' },
    { text: 'enable aaa', why: 'Nu este sintaxa IOS.' },
  ], 'aaa new-model.', 'aaa …'),
  cli({ id: '5.8-037' }, 3, 'Ești în R1(config)#. Configurează autentificarea login implicită: serverele TACACS+, apoi baza locală ca rezervă.', 'R1(config)#', 'aaa authentication login default group tacacs+ local', ['aaa authentication login default group tacacs+ local'], [
    { text: 'aaa authentication login default local group tacacs+', why: 'Ordinea este inversată: ar încerca întâi local.' },
    { text: 'aaa authentication login default group tacacs+', why: 'Lipsește metoda de rezervă „local”.' },
    { text: 'aaa authentication default group tacacs+ local', why: 'Lipsește cuvântul login.' },
  ], 'Ordinea metodelor este ordinea de încercare.', 'aaa authentication login …'),
  cli({ id: '5.8-038' }, 3, 'Ești în R1(config)#. Configurează contabilizarea sesiunilor exec (start și stop) către TACACS+, lista default.', 'R1(config)#', 'aaa accounting exec default start-stop group tacacs+', ['aaa accounting exec default start-stop group tacacs+'], [
    { text: 'aaa accounting exec default group tacacs+', why: 'Lipsește tipul de înregistrare (start-stop).' },
    { text: 'aaa authorization exec default start-stop group tacacs+', why: 'Aceasta este autorizare, iar start-stop nu e valid acolo.' },
    { text: 'aaa accounting login default start-stop group tacacs+', why: 'Tipul corect pentru sesiunile exec este „exec”.' },
  ], 'aaa accounting exec default start-stop group tacacs+.', 'aaa accounting …'),
  cli({ id: '5.8-039' }, 2, 'Ești în R1(config)#. Creează (în sintaxa nouă) o intrare de server TACACS+ cu numele TAC1 și intră în submodul ei.', 'R1(config)#', 'tacacs server TAC1', ['tacacs server TAC1'], [
    { text: 'tacacs-server host TAC1', why: 'Aceasta este sintaxa veche, iar TAC1 ar fi interpretat ca nume de host/adresă.' },
    { text: 'aaa server tacacs TAC1', why: 'Nu este sintaxa IOS.' },
    { text: 'radius server TAC1', why: 'Creează un server RADIUS, nu TACACS+.' },
  ], 'tacacs server <nume>; apoi address ipv4 și key.', 'tacacs …'),
  cli({ id: '5.8-040' }, 1, 'Ești în R1#. Afișează starea serverelor AAA configurate.', 'R1#', 'show aaa servers', ['show aaa servers'], [
    { text: 'show aaa', why: 'Comanda nu este completă.' },
    { text: 'show tacacs servers', why: 'Nu este sintaxa corectă pentru starea generală.' },
    { text: 'show running-config aaa', why: 'Afișează configurația, nu starea serverelor.' },
  ], 'show aaa servers.', 'show aaa …'),
];
