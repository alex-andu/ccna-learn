import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.5 Describe the use of syslog features, including facilities and severity levels.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.5'. Fiecare variantă are explicație (why).
const T = '4.5';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_5: Question[] = [
  // ======================= Scop și format =======================
  single({ id: '4.5-001' }, 1, 'Care este scopul principal al syslog?', [
    ['Înregistrarea evenimentelor dispozitivelor și trimiterea lor către un server central', true, 'Syslog colectează mesajele de eveniment pentru depanare, audit și monitorizare.'],
    ['Sincronizarea ceasurilor', false, 'Aceasta este funcția NTP.'],
    ['Atribuirea de adrese IP', false, 'Aceasta este funcția DHCP.'],
    ['Interogarea periodică a valorilor de contor', false, 'Aceasta este polling-ul SNMP.'],
  ], 'Syslog = jurnal de evenimente (local și central).'),
  single({ id: '4.5-002' }, 1, 'Ce port și ce transport folosește, de obicei, syslog către un server?', [
    ['UDP 514', true, 'Portul standard syslog, peste UDP.'],
    ['TCP 514', false, 'Nu este modul implicit (există variante TCP, dar standardul clasic este UDP).'],
    ['UDP 161', false, 'Acesta este SNMP.'],
    ['UDP 123', false, 'Acesta este NTP.'],
  ], 'Syslog: UDP 514.'),
  single({ id: '4.5-003' }, 2, 'De ce este util un server syslog central, față de a citi doar consola fiecărui router?', [
    ['Păstrează istoricul independent de dispozitiv și permite căutare și corelare între echipamente', true, 'Mesajele rămân și după repornire sau cădere.'],
    ['Previne evenimentele din rețea', false, 'Syslog doar raportează.'],
    ['Face routerele mai rapide', false, 'Nu influențează performanța în mod pozitiv.'],
    ['Înlocuiește configurarea ACL', false, 'Nu are legătură.'],
  ], 'Centralizare = istoric + căutare + corelare.'),
  single({ id: '4.5-004' }, 1, 'Cum se numește formatul general al unui mesaj de log Cisco?', [
    ['timestamp: %FACILITY-SEVERITY-MNEMONIC: descriere', true, 'Exemplu: %LINK-3-UPDOWN: Interface Gi0/1, changed state to down.'],
    ['SEVERITY.FACILITY.timestamp: mesaj', false, 'Nu este formatul Cisco.'],
    ['%MNEMONIC-FACILITY-SEVERITY descriere', false, 'Ordinea este facility, severitate, mnemonic.'],
    ['IP:PORT mesaj', false, 'Nu este un format de log.'],
  ], 'Formatul: %FACILITY-SEVERITY-MNEMONIC.'),
  single({ id: '4.5-005' }, 2, 'În mesajul %LINK-3-UPDOWN: Interface Gi0/1, changed state to down, ce reprezintă „3”?', [
    ['Severitatea 3 (errors)', true, 'Al doilea câmp al etichetei este nivelul de severitate.'],
    ['Numărul interfeței', false, 'Interfața apare în descriere.'],
    ['Numărul de ordine al mesajului', false, 'Numărul de secvență apare doar dacă este activat.'],
    ['Numărul portului UDP', false, 'Nu are legătură cu portul.'],
  ], '%FACILITY-SEVERITY-MNEMONIC.'),
  single({ id: '4.5-006' }, 2, 'În mesajul %SYS-5-CONFIG_I, ce este „SYS”?', [
    ['Facility: componenta care a generat mesajul', true, 'Primul câmp al etichetei.'],
    ['Severitatea', false, 'Severitatea este numărul 5.'],
    ['Mnemonic-ul', false, 'Mnemonic-ul este CONFIG_I.'],
    ['Adresa serverului syslog', false, 'Nu este o adresă.'],
  ], 'SYS = facility; 5 = severitate; CONFIG_I = mnemonic.'),

  // ======================= Severități =======================
  single({ id: '4.5-007' }, 1, 'Care este nivelul de severitate cel mai grav în syslog?', [
    ['0 — emergencies', true, 'Cu cât numărul e mai mic, cu atât evenimentul e mai grav.'],
    ['7 — debugging', false, 'Este cel mai detaliat/mai puțin grav.'],
    ['1 — alerts', false, 'Este al doilea ca gravitate.'],
    ['4 — warnings', false, 'Este un nivel intermediar.'],
  ], '0 = cel mai grav; 7 = cel mai detaliat.'),
  single({ id: '4.5-008' }, 2, 'Setezi logging trap warnings. Care niveluri sunt trimise către server?', [
    ['0 până la 4', true, 'Nivelul ales și toate cele mai severe (numere mai mici).'],
    ['Doar 4', false, 'Filtrul nu selectează exact un nivel.'],
    ['4 până la 7', false, 'Acestea sunt mai puțin severe și nu sunt incluse.'],
    ['Doar 5 și 6', false, 'Nu sunt incluse.'],
  ], 'Nivelul N include 0..N.'),
  single({ id: '4.5-009' }, 2, 'Care sunt cele opt niveluri de severitate, în ordine de la 0 la 7?', [
    ['emergencies, alerts, critical, errors, warnings, notifications, informational, debugging', true, 'Mnemonic: Every Awesome Cisco Engineer Will Need Ice-cream Daily.'],
    ['debugging, informational, notifications, warnings, errors, critical, alerts, emergencies', false, 'Aceasta este ordinea inversă.'],
    ['alerts, emergencies, critical, errors, warnings, notifications, informational, debugging', false, 'Primele două sunt inversate.'],
    ['critical, errors, warnings, alerts, emergencies, notifications, debugging, informational', false, 'Ordinea este incorectă.'],
  ], '0 emergencies … 7 debugging.'),
  match({ id: '4.5-010' }, 2, 'Potrivește numărul de severitate cu cuvântul lui cheie.', [
    { left: '0', right: 'emergencies', why: 'Sistem inutilizabil.' },
    { left: '3', right: 'errors', why: 'Condiții de eroare (%LINK-3-UPDOWN).' },
    { left: '4', right: 'warnings', why: 'Avertismente.' },
    { left: '5', right: 'notifications', why: 'Evenimente normale dar semnificative.' },
    { left: '6', right: 'informational', why: 'Informativ.' },
    { left: '7', right: 'debugging', why: 'Cel mai detaliat; ieșirea debug.' },
  ], [
    { text: 'verbose', why: 'Nu este un nivel Cisco.' },
  ], 'Cele opt niveluri 0–7.'),
  single({ id: '4.5-011' }, 2, 'Care este nivelul implicit pentru consola Cisco IOS, în mod obișnuit?', [
    ['debugging (7)', true, 'De obicei consola primește toate nivelurile; verifică cu show logging.'],
    ['emergencies (0)', false, 'Ar arăta doar cele mai grave mesaje.'],
    ['errors (3)', false, 'Nu este valoarea implicită obișnuită.'],
    ['informational (6)', false, 'Aceasta este valoarea implicită obișnuită pentru logging trap, nu pentru consolă.'],
  ], 'Consola: debugging, de obicei.'),
  single({ id: '4.5-012' }, 2, 'Pe un router cu logging trap la nivelul implicit obișnuit, ce nivel este?', [
    ['informational (6), de obicei (verifică cu show logging)', true, 'Sursele diferă pe versiuni; show logging este autoritatea.'],
    ['emergencies (0)', false, 'Ar trimite doar cele mai grave mesaje.'],
    ['debugging (7)', false, 'Nu este valoarea obișnuită pentru trap.'],
    ['errors (3)', false, 'Nu este valoarea obișnuită.'],
  ], 'Verifică întotdeauna cu show logging.'),
  multi({ id: '4.5-013' }, 2, 'Care dintre acestea sunt destinații ale mesajelor de log pe un router Cisco? (alege toate variantele corecte)', [
    ['Consola', true, 'logging console.'],
    ['Bufferul în RAM', true, 'logging buffered.'],
    ['Sesiunile VTY (terminal monitor)', true, 'logging monitor + terminal monitor.'],
    ['Un server syslog extern', true, 'logging host.'],
    ['Tabela MAC', false, 'Nu este o destinație de log.'],
  ], 'Console, monitor, buffer, host.'),
  single({ id: '4.5-014' }, 2, 'Un mesaj are severitatea 5. Cu logging trap warnings, ajunge la server?', [
    ['Nu: 5 este mai mare decât 4, deci este filtrat', true, 'Trap warnings = 0–4.'],
    ['Da, toate mesajele ajung', false, 'Filtrul se aplică.'],
    ['Da, dar fără timestamp', false, 'Timestamp-ul nu are legătură cu filtrul.'],
    ['Doar dacă este configurat logging buffered', false, 'Bufferul este alt tip de destinație.'],
  ], 'Severitate > nivel ⇒ filtrat.'),
  order({ id: '4.5-015' }, 2, 'Ordonează nivelurile de la cel mai grav la cel mai detaliat.', [
    { text: '0 emergencies', why: 'Cel mai grav.' },
    { text: '3 errors', why: 'Erori.' },
    { text: '4 warnings', why: 'Avertismente.' },
    { text: '6 informational', why: 'Informativ.' },
    { text: '7 debugging', why: 'Cel mai detaliat.' },
  ], 'De la 0 la 7.'),
  single({ id: '4.5-016' }, 3, 'Ce înseamnă un asterisc (*) înaintea timestamp-ului într-un mesaj de log?', [
    ['Ceasul dispozitivului nu a fost setat (sau nu este sincronizat)', true, 'Marchează ora ca neafidabilă.'],
    ['Mesajul este critic', false, 'Nu este indicator de severitate.'],
    ['Mesajul a fost retransmis', false, 'Nu este un marcaj de retransmisie.'],
    ['Mesajul vine de la un server', false, 'Nu are legătură.'],
  ], '* = ceas neconfigurat; . = NTP nesincronizat.'),
  single({ id: '4.5-017' }, 3, 'Care este prioritatea (PRI) a unui mesaj trimis cu facility local7 (23) și severitate 3?', [
    ['187', true, '23 × 8 + 3 = 187.'],
    ['26', false, 'Aceasta ar fi 23 + 3, ceea ce nu respectă formula.'],
    ['11', false, 'Nu rezultă din formulă.'],
    ['230', false, 'Nu rezultă din formulă.'],
  ], 'PRI = facility × 8 + severitate.'),
  single({ id: '4.5-018' }, 2, 'Care este facility-ul syslog implicit folosit de IOS pentru mesajele trimise la server?', [
    ['local7', true, 'Implicit Cisco folosește local7; se poate schimba cu logging facility.'],
    ['kern', false, 'Facility-ul kernel nu este implicit pe Cisco.'],
    ['auth', false, 'Nu este valoarea implicită.'],
    ['local0', false, 'Nu este valoarea implicită Cisco.'],
  ], 'Implicit local7.'),
  single({ id: '4.5-019' }, 3, 'Ce mai înseamnă „facility” în afară de componenta din eticheta %LINK-3-UPDOWN?', [
    ['Un câmp numeric (0–23) din antetul syslog, folosit de server pentru a separa surse (local0–local7)', true, 'Cisco trimite implicit local7.'],
    ['Nivelul de severitate', false, 'Severitatea este alt câmp.'],
    ['Portul UDP', false, 'Portul este 514.'],
    ['Numele interfeței', false, 'Interfața apare în textul mesajului.'],
  ], 'Facility Cisco (text) vs facility syslog (antet).'),

  // ======================= Configurare și verificare =======================
  single({ id: '4.5-020' }, 1, 'Ce comandă afișează bufferul de log și nivelurile fiecărei destinații?', [
    ['show logging', true, 'Arată destinațiile, nivelurile și mesajele reținute.'],
    ['show log', false, 'Nu este sintaxa IOS corectă.'],
    ['show syslog', false, 'Nu este sintaxa IOS.'],
    ['show history', false, 'Arată istoricul comenzilor, nu logurile.'],
  ], 'show logging.'),
  single({ id: '4.5-021' }, 2, 'Ce face terminal monitor?', [
    ['Afișează mesajele de log în sesiunea VTY curentă', true, 'Fără el, sesiunile Telnet/SSH nu primesc loguri.'],
    ['Trimite logurile la server', false, 'Aceasta se face cu logging host.'],
    ['Oprește consola', false, 'Nu are legătură.'],
    ['Activează debug-ul', false, 'Debug-ul se activează cu debug.'],
  ], 'terminal monitor = loguri în VTY.'),
  cli({ id: '4.5-022' }, 2, 'Ești în R1(config)#. Trimite logurile către serverul syslog 10.0.0.50.', 'R1(config)#', 'logging host 10.0.0.50', ['logging host 10.0.0.50', 'logging 10.0.0.50'], [
    { text: 'syslog host 10.0.0.50', why: 'Comanda IOS începe cu logging.' },
    { text: 'logging server 10.0.0.50', why: 'Nu este sintaxa clasică IOS (se folosește host).' },
    { text: 'logging trap 10.0.0.50', why: 'logging trap setează nivelul, nu destinația.' },
  ], 'logging host <ip>.', 'logging host …'),
  cli({ id: '4.5-023' }, 2, 'Ești în R1(config)#. Trimite către server doar mesajele de nivel warnings și mai grave.', 'R1(config)#', 'logging trap warnings', ['logging trap warnings', 'logging trap 4'], [
    { text: 'logging console warnings', why: 'Aceasta limitează consola, nu serverul.' },
    { text: 'logging host warnings', why: 'logging host cere o adresă, nu un nivel.' },
    { text: 'logging level warnings', why: 'Nu este sintaxa IOS.' },
  ], 'logging trap <nivel>.', 'logging trap …'),
  cli({ id: '4.5-024' }, 2, 'Ești în R1(config)#. Limitează consola la mesaje de nivel errors și mai grave.', 'R1(config)#', 'logging console errors', ['logging console errors', 'logging console 3'], [
    { text: 'logging trap errors', why: 'Aceasta limitează serverul, nu consola.' },
    { text: 'logging console 0-3', why: 'Nu se scrie interval; se dă nivelul maxim.' },
    { text: 'console logging errors', why: 'Comanda începe cu logging.' },
  ], 'logging console <nivel>.', 'logging console …'),
  cli({ id: '4.5-025' }, 2, 'Ești în R1(config)#. Configurează un buffer de log în RAM de 16384 octeți, nivel informational.', 'R1(config)#', 'logging buffered 16384 informational', ['logging buffered 16384 informational', 'logging buffered 16384 6'], [
    { text: 'logging buffer 16384 informational', why: 'Cuvântul cheie este buffered.' },
    { text: 'logging buffered informational 16384', why: 'Ordinea este: mărime, apoi nivel.' },
    { text: 'logging memory 16384 informational', why: 'Nu există comanda logging memory.' },
  ], 'logging buffered <mărime> <nivel>.', 'logging buffered …'),
  cli({ id: '4.5-026' }, 2, 'Ești în R1(config)#. Fă ca mesajele de log să includă data și ora cu milisecunde.', 'R1(config)#', 'service timestamps log datetime msec', ['service timestamps log datetime msec'], [
    { text: 'service timestamps log uptime', why: 'uptime afișează timpul de la pornire, nu data și ora.' },
    { text: 'service timestamps debug datetime msec', why: 'Se aplică mesajelor de debug.' },
    { text: 'logging timestamp datetime msec', why: 'Nu este sintaxa IOS.' },
  ], 'service timestamps log datetime msec.', 'service timestamps …'),
  cli({ id: '4.5-027' }, 2, 'Ești în R1(config-line)#, pe linia VTY. Fă ca mesajele de log să nu mai rupă comanda pe care o tastezi.', 'R1(config-line)#', 'logging synchronous', ['logging synchronous'], [
    { text: 'logging sync off', why: 'Nu este sintaxa IOS.' },
    { text: 'terminal monitor', why: 'Aceasta afișează logurile în VTY, nu le sincronizează cu linia de comandă.' },
    { text: 'logging console', why: 'Aceasta activează consola ca destinație.' },
  ], 'logging synchronous în line.', 'logging sync…'),
  cli({ id: '4.5-028' }, 2, 'Ești în R1(config)#. Trimite mesajele către server cu facility local6.', 'R1(config)#', 'logging facility local6', ['logging facility local6'], [
    { text: 'logging source-interface local6', why: 'source-interface alege interfața sursă, nu facility-ul.' },
    { text: 'logging trap local6', why: 'logging trap alege nivelul, nu facility-ul.' },
    { text: 'syslog facility local6', why: 'Nu este sintaxa IOS.' },
  ], 'logging facility <facility>.', 'logging facility …'),
  single({ id: '4.5-029' }, 3, 'Serverul syslog nu primește %LINK-3-UPDOWN, deși logging host este configurat și ping-ul merge. show logging arată „Trap logging: level critical”. Ce corecție aplici?', [
    ['logging trap errors (sau warnings) — 3 trebuie să fie ≤ nivelul trap', true, 'Critical (2) exclude mesajele de severitate 3.'],
    ['logging console critical', false, 'Aceasta afectează consola, nu serverul.'],
    ['no logging host', false, 'Ar opri complet trimiterea spre server.'],
    ['service sequence-numbers', false, 'Nu schimbă filtrul.'],
  ], 'Nivelul trap decide ce ajunge pe server.'),
  single({ id: '4.5-030' }, 2, 'Un tehnician vrea să vadă mesajele de log într-o sesiune SSH. Ce trebuie să facă?', [
    ['Să ruleze terminal monitor în acea sesiune', true, 'Fără el, sesiunile VTY nu primesc loguri.'],
    ['Să configureze logging host', false, 'Aceasta trimite la server, nu în sesiune.'],
    ['Să reseteze routerul', false, 'Nu este necesar.'],
    ['Să pornească NTP', false, 'NTP nu afișează loguri.'],
  ], 'terminal monitor.'),
  single({ id: '4.5-031' }, 2, 'De ce nu este recomandat să lași logging console debugging și debug activ pe un router încărcat?', [
    ['Consola este lentă și volumul mare de mesaje poate încărca CPU-ul și încetini routerul', true, 'Debug generează multe mesaje.'],
    ['Consola nu acceptă debugging', false, 'O acceptă, dar nu e recomandat.'],
    ['Debug-ul șterge configurația', false, 'Nu are acest efect.'],
    ['Syslog nu funcționează cu debug', false, 'Funcționează, dar produce volum mare.'],
  ], 'Debug cu grijă; folosește buffer/VTY.'),
  multi({ id: '4.5-032' }, 3, 'Ce informații găsești în show logging? (alege toate variantele corecte)', [
    ['Nivelul pentru consolă, monitor, buffer și trap', true, 'Antetul rezumă setările.'],
    ['Adresa serverului syslog și portul', true, 'Linia „Logging to …”.'],
    ['Mesajele reținute în buffer', true, 'Partea „Log Buffer”.'],
    ['Tabela de rutare', false, 'Nu este o ieșire a lui show logging.'],
    ['Lista community-urilor SNMP', false, 'Aceea este show snmp community.'],
  ], 'show logging = setări + buffer.'),
  single({ id: '4.5-033' }, 3, 'Ce se întâmplă cu bufferul de log (logging buffered) la repornirea routerului?', [
    ['Se pierde, fiind în RAM', true, 'De aceea trebuie un server extern.'],
    ['Se salvează automat în startup-config', false, 'Bufferul nu se salvează în configurație.'],
    ['Se copiază pe server automat', false, 'Nu există copiere automată.'],
    ['Rămâne în NVRAM', false, 'Bufferul este în RAM, nu NVRAM.'],
  ], 'Buffer = RAM = volatil.'),
  single({ id: '4.5-034' }, 3, 'De ce este importantă sincronizarea NTP pentru syslog?', [
    ['Ca timestamp-urile de la dispozitive diferite să poată fi ordonate și corelate', true, 'Un incident implică adesea mai multe echipamente.'],
    ['Pentru că syslog nu poate funcționa fără NTP', false, 'Funcționează, dar cu timp nesigur.'],
    ['Pentru că NTP criptează mesajele', false, 'NTP nu criptează.'],
    ['Pentru că NTP alege severitatea', false, 'Severitatea este fixă.'],
  ], 'NTP + syslog = log-uri utile.'),
  single({ id: '4.5-035' }, 2, 'Ce mesaj generează intrarea în modul de configurare și ieșirea din el?', [
    ['%SYS-5-CONFIG_I: Configured from console by …', true, 'Mesaj de notificare (5) despre modificarea configurației.'],
    ['%LINK-3-UPDOWN', false, 'Apare la schimbarea stării unei interfețe.'],
    ['%OSPF-5-ADJCHG', false, 'Apare la schimbarea unei adiacențe OSPF.'],
    ['%SEC-6-IPACCESSLOGP', false, 'Apare la potriviri de ACL cu log.'],
  ], 'CONFIG_I = configurare modificată.'),
  single({ id: '4.5-036' }, 2, 'Care mesaj apare când se schimbă starea protocolului de linie al unei interfețe?', [
    ['%LINEPROTO-5-UPDOWN', true, 'Facility LINEPROTO, severitate 5.'],
    ['%LINK-5-UPDOWN', false, 'Facility LINK folosește de obicei severitatea 3.'],
    ['%SYS-3-CPUHOG', false, 'Apare la ocuparea îndelungată a CPU-ului.'],
    ['%DHCP-6-ADDRESS_ASSIGN', false, 'Apare la atribuirea unei adrese DHCP.'],
  ], 'LINK = fizic; LINEPROTO = nivel 2.'),
  single({ id: '4.5-037' }, 3, 'Poți să faci ca un mesaj cu severitatea 5 să primească severitatea 3 printr-o comandă?', [
    ['Nu: severitatea este fixă pentru acel mesaj; poți doar filtra după ea', true, 'Nivelurile configurate sunt filtre, nu modificatori.'],
    ['Da, cu logging promote 3', false, 'Nu există această comandă.'],
    ['Da, cu logging trap 3', false, 'Aceasta filtrează, nu schimbă severitatea.'],
    ['Da, cu service severity', false, 'Nu există o astfel de comandă.'],
  ], 'Severitatea e a mesajului; nivelul e filtrul.'),
  single({ id: '4.5-038' }, 2, 'Ce rol are logging source-interface loopback0?', [
    ['Mesajele pleacă mereu cu adresa lui loopback0, stabilă, ca sursă', true, 'Serverul recunoaște dispozitivul indiferent de interfața de ieșire.'],
    ['Alege nivelul de severitate', false, 'Nivelul se alege cu logging trap.'],
    ['Activează logurile pe loopback', false, 'Nu activează logare pe loopback.'],
    ['Schimbă portul UDP', false, 'Portul rămâne 514.'],
  ], 'Adresă sursă stabilă pentru syslog.'),
  single({ id: '4.5-039' }, 3, 'Cum diferă syslog de SNMP trap ca mod de raportare?', [
    ['Syslog trimite mesaje text cu severitate; trap-ul trimite o notificare structurată identificată prin OID-uri', true, 'Ambele raportează evenimente, dar în format diferit.'],
    ['Syslog este criptat, trap-ul nu', false, 'Niciunul nu este criptat implicit.'],
    ['Syslog folosește UDP 162', false, 'UDP 162 este pentru trap; syslog folosește UDP 514.'],
    ['Nu există nicio diferență', false, 'Diferă ca format și ca port.'],
  ], 'Syslog = text; trap = obiecte MIB.'),
  single({ id: '4.5-040' }, 3, 'Care combinație este cea mai potrivită pentru păstrarea logurilor unui router într-o rețea de producție?', [
    ['logging host (server central), NTP sincronizat, timestamps cu dată și oră, nivel informational sau warnings pe trap', true, 'Istoric extern, ordonabil, cu volum rezonabil.'],
    ['Doar logging console', false, 'Consola nu păstrează istoric.'],
    ['Doar logging buffered cu 1 KB', false, 'Se pierde la repornire și este mic.'],
    ['logging trap debugging permanent', false, 'Inundă serverul și rețeaua.'],
  ], 'Server central + ora corectă + nivel rezonabil.'),
];
