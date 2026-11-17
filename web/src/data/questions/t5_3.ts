import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.3 Configure and verify device access control using local passwords.
// Obiectivul oficial nu are sub-puncte; `sub` = '5.3'. Fiecare variantă are explicație (why).
const T = '5.3';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_3: Question[] = [
  // ======================= Concepte =======================
  single({ id: '5.3-001' }, 1, 'Ce înseamnă „parole locale” într-un context de control al accesului la un router?', [
    ['Parolele și conturile sunt stocate și verificate chiar pe dispozitiv', true, 'Fiecare echipament își are propria bază de utilizatori și parole.'],
    ['Parolele sunt verificate de un server RADIUS sau TACACS+', false, 'Aceasta este autentificarea centralizată (AAA).'],
    ['Parolele sunt valabile doar în LAN', false, 'Nu depinde de LAN, ci de locul de stocare.'],
    ['Parolele nu pot fi schimbate', false, 'Pot fi schimbate oricând din configurație.'],
  ], 'Local = pe dispozitiv.'),
  single({ id: '5.3-002' }, 1, 'Care dintre acestea NU este o metodă de autentificare locală pe dispozitiv?', [
    ['Verificarea credențialelor pe un server RADIUS', true, 'Serverul RADIUS este extern; autentificarea este centralizată, nu locală.'],
    ['password + login pe linia console', false, 'Este o parolă configurată local pe linie.'],
    ['username … secret + login local', false, 'Este o bază de conturi locală.'],
    ['enable secret', false, 'Este parola locală pentru modul privilegiat.'],
  ], 'RADIUS/TACACS+ = AAA, nu local.'),
  single({ id: '5.3-003' }, 2, 'Care este comportamentul implicit al liniei console pe un router Cisco fără nicio configurare de autentificare?', [
    ['Permite accesul direct în modul user EXEC, fără parolă', true, 'Consola nu cere autentificare implicit; de aceea trebuie protejată.'],
    ['Cere o parolă implicită „cisco”', false, 'Nu există o parolă implicită.'],
    ['Este dezactivată', false, 'Consola este activă.'],
    ['Cere obligatoriu SSH', false, 'Consola nu folosește SSH.'],
  ], 'Consola: fără login implicit.'),
  single({ id: '5.3-004' }, 2, 'Ce comandă selectează toate cele 16 linii VTY pentru configurare?', [
    ['line vty 0 15', true, 'Intervalul 0–15 cuprinde cele 16 linii; securizează-le pe toate.'],
    ['line vty 0 4', false, 'Selectează doar primele cinci linii.'],
    ['line console 0', false, 'Aceasta este consola, nu VTY.'],
    ['interface vty 0 15', false, 'VTY sunt linii, nu interfețe.'],
  ], 'line vty 0 15.'),
  single({ id: '5.3-005' }, 2, 'Pe line console 0 ai configurat „password Cisco123” dar nu ai configurat login. Ce se întâmplă la conectare?', [
    ['Accesul se face fără parolă, deoarece login nu este activ', true, 'Fără login, echipamentul nu cere parola liniei.'],
    ['Se cere parola Cisco123', false, 'Parola e cerută doar dacă login este configurat.'],
    ['Conexiunea este refuzată', false, 'Nu este refuzată; este permisă fără autentificare.'],
    ['Se cere un utilizator', false, 'Un utilizator se cere doar cu login local.'],
  ], 'password fără login = nu se cere.'),
  single({ id: '5.3-006' }, 2, 'Ce face comanda login local pe o linie?', [
    ['Cere nume de utilizator și parolă verificate în baza locală (username …)', true, 'Se folosesc conturile definite cu username.'],
    ['Cere doar parola liniei', false, 'Aceasta este login simplu, cu password.'],
    ['Dezactivează autentificarea', false, 'Aceasta este no login.'],
    ['Trimite cererea la un server AAA', false, 'Aceasta ar fi aaa authentication login.'],
  ], 'login local = username + parolă locale.'),
  single({ id: '5.3-007' }, 2, 'Ce efect are no login pe line vty 0 4 dacă există și o parolă configurată?', [
    ['Linia nu mai verifică parola: accesul este permis fără autentificare', true, 'no login oprește verificarea, chiar dacă password există.'],
    ['Linia cere parola de două ori', false, 'Nu cere nimic.'],
    ['Linia este dezactivată', false, 'Linia rămâne activă.'],
    ['Linia permite doar SSH', false, 'transport input ssh face acest lucru, nu no login.'],
  ], 'no login = fără verificare.'),
  single({ id: '5.3-008' }, 2, 'Pe un router sunt configurate atât „enable password Parola1” cât și „enable secret Parola2”. Ce parolă se cere la comanda enable?', [
    ['Parola2 (enable secret)', true, 'Secret are prioritate; enable password este ignorată.'],
    ['Parola1 (enable password)', false, 'Este ignorată atunci când există secret.'],
    ['Oricare dintre ele', false, 'Doar secret este acceptat.'],
    ['Niciuna', false, 'Se cere secret.'],
  ], 'secret > password.'),
  single({ id: '5.3-009' }, 2, 'Ce reprezintă o parolă de tip 7 din configurația Cisco?', [
    ['Un cifru reversibil (Vigenère Cisco), produs de service password-encryption', true, 'Poate fi decriptat cu unelte publice; nu este protecție reală.'],
    ['Un hash scrypt', false, 'Scrypt este tipul 9.'],
    ['Un hash MD5 cu salt', false, 'MD5 este tipul 5.'],
    ['Parola în clar', false, 'În clar este tipul 0.'],
  ], 'Tip 7 = reversibil.'),
  single({ id: '5.3-010' }, 2, 'Care dintre tipurile de parolă este în general cea mai rezistentă la ghicirea offline, dacă platforma o suportă?', [
    ['Tipul 9 (scrypt)', true, 'Hash lent, cu cerințe de memorie.'],
    ['Tipul 0', false, 'Este parola în clar.'],
    ['Tipul 7', false, 'Este reversibil.'],
    ['Tipul 5', false, 'MD5 este rapid și considerat slab pe hardware modern.'],
  ], '9 (scrypt) > 8 (PBKDF2) > 5 (MD5) > 7 > 0.'),
  single({ id: '5.3-011' }, 2, 'Care este diferența esențială dintre username admin password X și username admin secret X?', [
    ['Cu password parola se stochează în clar (sau tip 7), cu secret ca hash', true, 'secret este varianta corectă.'],
    ['Nu există nicio diferență', false, 'Diferența de stocare este esențială.'],
    ['Cu secret contul nu poate folosi SSH', false, 'Funcționează la fel.'],
    ['Cu password contul are privilegiu 15 automat', false, 'Privilegiul se dă cu privilege.'],
  ], 'Folosește secret.'),
  single({ id: '5.3-012' }, 2, 'Ce efect are „username admin privilege 15 secret …” la autentificarea locală?', [
    ['Utilizatorul intră direct în modul privilegiat, fără să mai folosească enable', true, 'Nivelul 15 este nivelul modului privilegiat.'],
    ['Contul poate fi folosit doar prin consolă', false, 'Funcționează și pe VTY.'],
    ['Parola nu se mai cere', false, 'Parola se cere în continuare.'],
    ['Contul este dezactivat', false, 'Contul este activ.'],
  ], 'privilege 15 = direct în #.'),
  single({ id: '5.3-013' }, 3, 'Ai configurat login local pe line vty 0 4, dar nu există niciun username. Ce se întâmplă la o conexiune la distanță?', [
    ['Nu te poți autentifica: nu există niciun cont care să fie acceptat', true, 'Baza locală este goală.'],
    ['Accesul este permis fără parolă', false, 'Nu este permis fără autentificare.'],
    ['Se folosește parola enable', false, 'Nu se folosește enable.'],
    ['Echipamentul creează un cont admin automat', false, 'Nu există un cont creat automat.'],
  ], 'login local fără username = blocat.'),
  single({ id: '5.3-014' }, 2, 'Ce face security passwords min-length 10?', [
    ['Respinge parolele noi mai scurte de 10 caractere', true, 'Se aplică parolelor configurate după activare.'],
    ['Setează parolele existente la 10 caractere', false, 'Nu modifică parolele existente.'],
    ['Criptează parolele cu 10 runde', false, 'Nu are legătură cu criptarea.'],
    ['Limitează utilizatorii la 10', false, 'Nu limitează numărul de utilizatori.'],
  ], 'min-length = lungime minimă pentru parole noi.'),
  single({ id: '5.3-015' }, 2, 'Ce face login block-for 120 attempts 3 within 60?', [
    ['După 3 încercări eșuate în 60 secunde, refuză logările timp de 120 secunde', true, 'Încetinește atacurile prin ghicire (quiet mode).'],
    ['Blochează definitiv contul după 120 încercări', false, 'Blocarea este temporară și pe echipament, nu pe cont.'],
    ['Închide sesiunea după 120 secunde inactiv', false, 'Aceasta este exec-timeout.'],
    ['Setează timpul de login la 3 secunde', false, 'Nu are acest efect.'],
  ], 'login block-for = quiet mode.'),
  single({ id: '5.3-016' }, 2, 'Ce înseamnă exec-timeout 0 0?', [
    ['Sesiunea nu se închide niciodată pentru inactivitate', true, '0 minute 0 secunde = fără timeout; comod, dar nesigur.'],
    ['Sesiunea se închide imediat', false, 'Opusul efectului real.'],
    ['Sesiunea durează o secundă', false, 'Nu este valoarea.'],
    ['Dezactivează consola', false, 'Nu dezactivează linia.'],
  ], 'exec-timeout 0 0 = fără timeout.'),

  // ======================= Configurare și verificare =======================
  cli({ id: '5.3-017' }, 2, 'Ești în R1(config)#. Setează parola modului privilegiat ca hash, cu parola Str0ng!Enable.', 'R1(config)#', 'enable secret Str0ng!Enable', ['enable secret Str0ng!Enable', 'enable secret 0 Str0ng!Enable'], [
    { text: 'enable password Str0ng!Enable', why: 'Aceasta stochează parola în clar (sau tip 7), nu ca hash.' },
    { text: 'enable Str0ng!Enable', why: 'Comanda enable în config nu setează parole.' },
    { text: 'secret enable Str0ng!Enable', why: 'Ordinea cuvintelor este enable secret.' },
  ], 'enable secret <parola>.', 'enable …'),
  single({ id: '5.3-018' }, 2, 'Ce afișează comanda show users?', [
    ['Sesiunile active: linia, utilizatorul, de unde se conectează și cât timp sunt inactive', true, 'Asteriscul marchează sesiunea curentă.'],
    ['Lista tuturor conturilor locale cu parolele', false, 'Nu afișează parolele; conturile se văd în running-config.'],
    ['Utilizatorii din domeniul Active Directory', false, 'Nu are legătură.'],
    ['Utilizatorii DHCP', false, 'Nu are legătură cu DHCP.'],
  ], 'show users = sesiuni curente.'),
  cli({ id: '5.3-019' }, 2, 'Ești în R1(config)#. Creează contul admin cu privilegiu 15 și parola hashuită Adm1n!Pass2024.', 'R1(config)#', 'username admin privilege 15 secret Adm1n!Pass2024', ['username admin privilege 15 secret Adm1n!Pass2024', 'username admin privilege 15 secret 0 Adm1n!Pass2024'], [
    { text: 'username admin privilege 15 password Adm1n!Pass2024', why: 'password stochează parola în clar sau tip 7, nu hashuit.' },
    { text: 'user admin privilege 15 secret Adm1n!Pass2024', why: 'Comanda este username, nu user.' },
    { text: 'username admin secret Adm1n!Pass2024 privilege 15', why: 'Opțiunea privilege se dă înainte de secret.' },
  ], 'username <nume> privilege <nivel> secret <parola>.', 'username …'),
  single({ id: '5.3-020' }, 2, 'Ce arată show login?', [
    ['Starea funcției login block-for (normal sau quiet mode), pragurile și timpul rămas', true, 'Arată dacă echipamentul este în quiet mode.'],
    ['Lista conturilor locale', false, 'Conturile se văd în running-config.'],
    ['Adresele IP care s-au conectat', false, 'Aceasta se vede în show users sau log-uri.'],
    ['Parolele liniilor', false, 'Parolele nu se afișează așa.'],
  ], 'show login = starea protecției la login.'),
  cli({ id: '5.3-021' }, 2, 'Ești în R1(config)#. Cifrează (tip 7) parolele rămase în clar din configurație.', 'R1(config)#', 'service password-encryption', ['service password-encryption'], [
    { text: 'password-encryption enable', why: 'Nu este sintaxa IOS.' },
    { text: 'enable password-encryption', why: 'Comanda începe cu service.' },
    { text: 'service encryption', why: 'Comanda completă este service password-encryption.' },
  ], 'service password-encryption.', 'service …'),
  cli({ id: '5.3-022' }, 2, 'Ești în R1(config-line)# (line vty 0 15). Cere nume de utilizator și parolă din baza locală.', 'R1(config-line)#', 'login local', ['login local'], [
    { text: 'login', why: 'login simplu cere doar parola liniei.' },
    { text: 'login username', why: 'Nu este sintaxa IOS.' },
    { text: 'aaa login local', why: 'Nu se folosește pe linie.' },
  ], 'login local.', 'login …'),
  cli({ id: '5.3-023' }, 2, 'Ești în R1(config)#. Respinge parolele noi mai scurte de 10 caractere.', 'R1(config)#', 'security passwords min-length 10', ['security passwords min-length 10'], [
    { text: 'password min-length 10', why: 'Comanda începe cu security passwords.' },
    { text: 'security password min-length 10', why: 'Cuvântul corect este passwords (plural).' },
    { text: 'security passwords length 10', why: 'Cuvântul cheie este min-length.' },
  ], 'security passwords min-length <n>.', 'security …'),
  cli({ id: '5.3-024' }, 3, 'Ești în R1(config)#. După 3 încercări de login eșuate în 60 de secunde, blochează logările 120 de secunde.', 'R1(config)#', 'login block-for 120 attempts 3 within 60', ['login block-for 120 attempts 3 within 60'], [
    { text: 'login block-for 60 attempts 3 within 120', why: 'Valorile 60 și 120 sunt inversate: blocarea este 120, fereastra 60.' },
    { text: 'login block 120 attempts 3 within 60', why: 'Cuvântul cheie este block-for.' },
    { text: 'login quiet-mode 120 3 60', why: 'Nu este sintaxa IOS.' },
  ], 'login block-for <blocare> attempts <n> within <fereastră>.', 'login block-for …'),
  cli({ id: '5.3-025' }, 2, 'Ești în R1(config)#. Intră în configurarea tuturor celor 16 linii VTY.', 'R1(config)#', 'line vty 0 15', ['line vty 0 15'], [
    { text: 'line vty 0 4', why: 'Acoperă doar 5 linii.' },
    { text: 'line console 0', why: 'Aceasta este consola.' },
    { text: 'interface vty 0 15', why: 'VTY sunt linii, nu interfețe.' },
  ], 'line vty 0 15.', 'line …'),
  multi({ id: '5.3-026' }, 2, 'Care dintre acestea sunt corecte despre service password-encryption? (alege toate variantele corecte)', [
    ['Transformă parolele în clar din configurație în tip 7', true, 'Efectul comenzii.'],
    ['Nu oferă protecție criptografică puternică', true, 'Tip 7 e reversibil.'],
    ['Se aplică atât parolelor existente cât și celor viitoare', true, 'Parolele în clar sunt convertite.'],
    ['Transformă enable secret în tip 9', false, 'Nu modifică secrets.'],
    ['Face SSH obligatoriu', false, 'Nu are legătură cu SSH.'],
  ], 'service password-encryption = tip 7.'),
  multi({ id: '5.3-027' }, 2, 'Ce practici întăresc controlul accesului local? (alege toate variantele corecte)', [
    ['enable secret în loc de enable password', true, 'Parola ca hash.'],
    ['login local cu conturi individuale', true, 'Audit și revocare per utilizator.'],
    ['exec-timeout pe console și VTY', true, 'Închide sesiunile uitate.'],
    ['Aceeași parolă „cisco” pe toate liniile', false, 'Parolă slabă și comună.'],
    ['no login pe consolă', false, 'Elimină autentificarea.'],
  ], 'secret + login local + timeout.'),
  multi({ id: '5.3-028' }, 3, 'Ce se verifică în show running-config pentru a găsi parole slabe de acces? (alege toate variantele corecte)', [
    ['Existența unui enable password în clar', true, 'Rămâne o scurgere chiar dacă este ignorată.'],
    ['Linii cu no login', true, 'Accesul este fără autentificare.'],
    ['Linii VTY nesecurizate (5–15)', true, 'Pot permite acces neprotejat.'],
    ['Parole tip 5 în loc de tip 9', false, 'Nu este o configurație greșită în sine; depinde de platformă.'],
    ['Prezența unui banner', false, 'Bannerul nu este o vulnerabilitate.'],
  ], 'Audit: password în clar, no login, VTY uitat.'),
  match({ id: '5.3-029' }, 2, 'Potrivește tipul de parolă cu mecanismul.', [
    { left: 'Tip 0', right: 'Text clar', why: 'Parola apare întocmai.' },
    { left: 'Tip 5', right: 'MD5 cu salt', why: 'Hash la secret pe versiuni clasice.' },
    { left: 'Tip 7', right: 'Cifru Cisco reversibil', why: 'Produs de service password-encryption.' },
    { left: 'Tip 8', right: 'PBKDF2-SHA256', why: 'Hash lent, mai modern.' },
    { left: 'Tip 9', right: 'scrypt', why: 'Hash lent, cu cerință de memorie.' },
  ], [
    { text: 'SHA-1 simplu', why: 'Nu este un tip de parolă Cisco.' },
  ], 'Tipuri 0, 5, 7, 8, 9.'),
  match({ id: '5.3-030' }, 2, 'Potrivește comanda cu rolul ei.', [
    { left: 'exec-timeout 5 0', right: 'Închide sesiunea după 5 minute de inactivitate', why: 'Timeout de sesiune.' },
    { left: 'login local', right: 'Cere utilizator + parolă locale', why: 'Autentificare pe linie.' },
    { left: 'transport input ssh', right: 'Permite doar SSH pe VTY', why: 'Telnet nu mai e acceptat.' },
    { left: 'enable secret', right: 'Parola hashuită pentru modul privilegiat', why: 'Are prioritate față de enable password.' },
  ], [
    { text: 'ip http server', why: 'Pornește serverul HTTP, nu e control de acces la consolă.' },
  ], 'Fiecare comandă are rolul ei.'),
  order({ id: '5.3-031' }, 3, 'Ordonează pașii pentru a trece în siguranță la autentificarea locală pe VTY.', [
    { text: 'Creezi utilizatorul (username … secret …)', why: 'Fără cont, login local te blochează.' },
    { text: 'Configurezi login local pe line vty 0 15', why: 'Acum linia folosește baza locală.' },
    { text: 'Testezi o conexiune într-o a doua sesiune', why: 'Prima sesiune rămâne ca plasă de siguranță.' },
    { text: 'Salvezi configurația (copy running-config startup-config)', why: 'Abia după test, ca să nu salvezi o configurație care te blochează.' },
  ], 'Utilizator → login local → test → salvare.'),
  order({ id: '5.3-032' }, 2, 'Ordonează evenimentele la conectarea unui administrator cu un cont fără privilege, pe o linie cu login local.', [
    { text: 'Se conectează la linia VTY/console', why: 'Începutul sesiunii.' },
    { text: 'Introduce utilizatorul și parola', why: 'Verificate în baza locală.' },
    { text: 'Ajunge în user EXEC (>)', why: 'Contul fără privilege are nivelul 1.' },
    { text: 'Folosește enable și parola secret', why: 'Trecerea în modul privilegiat (#).' },
  ], 'Conectare → autentificare → user EXEC → enable.'),
  order({ id: '5.3-033' }, 3, 'Ordonează tipurile de parolă de la cel mai slab la cel mai rezistent la ghicire offline (pe platformele care le suportă).', [
    { text: 'Tip 0 (clar)', why: 'Nu are protecție.' },
    { text: 'Tip 7 (reversibil)', why: 'Ofuscare trivială.' },
    { text: 'Tip 5 (MD5)', why: 'Hash, dar rapid.' },
    { text: 'Tip 8 (PBKDF2-SHA256)', why: 'Hash lent.' },
    { text: 'Tip 9 (scrypt)', why: 'Hash lent, cu cerințe de memorie.' },
  ], '0 → 7 → 5 → 8 → 9.'),
  single({ id: '5.3-034' }, 2, 'Ce se întâmplă pe VTY cu configurația implicită (fără nicio parolă)?', [
    ['Conexiunea este refuzată cu „Password required, but none set”', true, 'VTY cere implicit login dar nu există parolă.'],
    ['Acces liber, ca la consolă', false, 'Aceasta este comportamentul consolei.'],
    ['Se cere un utilizator „cisco”', false, 'Nu există utilizator implicit.'],
    ['Se acceptă doar IPv6', false, 'Nu are legătură cu IPv6.'],
  ], 'VTY implicit: refuz fără parolă.'),
  single({ id: '5.3-035' }, 3, 'De ce este considerat slab hash-ul MD5 (tip 5) comparativ cu scrypt (tip 9) pentru parole?', [
    ['MD5 este foarte rapid de calculat, deci miliarde de încercări pe secundă pe hardware modern', true, 'Algoritmii lenți încetinesc ghicirea offline.'],
    ['MD5 produce hash-uri mai lungi', false, 'Lungimea nu este problema.'],
    ['MD5 este reversibil', false, 'Nu este reversibil; slăbiciunea este viteza.'],
    ['MD5 nu poate fi folosit pe routere', false, 'Este folosit pe multe versiuni.'],
  ], 'Viteza hash = slăbiciune.'),
  single({ id: '5.3-036' }, 3, 'Ce reprezintă „enable secret 5 $1$mERr$…”?', [
    ['Un hash MD5 al parolei, deja calculat', true, 'Tipul 5 urmat de hash; nu este parola în clar.'],
    ['Parola în clar „5”', false, '5 indică tipul hash-ului, nu parola.'],
    ['Un hash scrypt', false, 'Scrypt este tipul 9.'],
    ['O comandă invalidă', false, 'Este formatul în care apare secretul în configurație.'],
  ], 'enable secret 5 <hash>.'),
  single({ id: '5.3-037' }, 2, 'Ce condiție trebuie îndeplinită pentru ca transport input ssh să permită conexiuni?', [
    ['SSH trebuie configurat (hostname, domain-name, chei RSA, utilizatori)', true, 'Fără chei RSA, SSH nu pornește (4.8).'],
    ['Nimic suplimentar', false, 'Fără SSH configurat, nu se poate intra.'],
    ['Telnet să fie activat', false, 'Telnet este exclus de comandă.'],
    ['Parola enable în clar', false, 'Nu are legătură.'],
  ], 'transport input ssh necesită SSH funcțional.'),
  single({ id: '5.3-038' }, 3, 'Un router în quiet mode (login block-for) primește o încercare cu parola corectă de la o adresă fără excepție. Ce se întâmplă?', [
    ['Încercarea este refuzată până expiră perioada de blocare', true, 'Quiet mode refuză toate logările pe liniile virtuale, cu excepția adreselor din ACL-ul permis.'],
    ['Este acceptată, pentru că parola e corectă', false, 'Parola corectă nu ocolește quiet mode.'],
    ['Routerul se repornește', false, 'Nu se repornește.'],
    ['Utilizatorul este șters', false, 'Nu se șterg conturi.'],
  ], 'Quiet mode = refuz general.'),
  single({ id: '5.3-039' }, 2, 'Care este limita principală a autentificării cu conturi locale într-o rețea cu 50 de routere?', [
    ['Trebuie gestionate conturile pe fiecare echipament; nu există administrare centralizată', true, 'Soluția este AAA cu RADIUS/TACACS+ (5.8).'],
    ['Nu poate folosi SSH', false, 'Poate folosi SSH.'],
    ['Nu poate avea parole puternice', false, 'Poate avea.'],
    ['Nu funcționează pe VTY', false, 'Funcționează.'],
  ], 'Local nu scalează.'),
  single({ id: '5.3-040' }, 2, 'Care banner apare înainte de autentificare?', [
    ['banner login', true, 'Se afișează înainte de prompt-ul de autentificare.'],
    ['banner exec', false, 'Apare după autentificare.'],
    ['Niciun banner', false, 'Există un banner înainte de login.'],
    ['banner motd apare doar după enable', false, 'motd apare la conectare, înainte de login.'],
  ], 'login = înainte de autentificare; exec = după.'),
];
