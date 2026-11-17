import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.2 Configure and verify NTP operating in a client and server mode.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.2'. Fiecare variantă are explicație (why).
const T = '4.2';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_2: Question[] = [
  // ======================= Scop și concepte =======================
  single({ id: '4.2-001' }, 1, 'Care este scopul NTP?', [
    ['Să sincronizeze ceasurile dispozitivelor din rețea cu o sursă de timp de încredere', true, 'NTP menține ora corectă și consecventă pe toate dispozitivele.'],
    ['Să atribuie automat adrese IP', false, 'Aceasta este funcția DHCP.'],
    ['Să cripteze traficul de management', false, 'NTP nu criptează; aceasta e treaba SSH/IPsec.'],
    ['Să monitorizeze încărcarea CPU', false, 'Aceasta ține de SNMP.'],
  ], 'NTP = sincronizarea ceasurilor.'),
  single({ id: '4.2-002' }, 1, 'Ce protocol de transport și ce port folosește NTP?', [
    ['UDP 123', true, 'NTP rulează peste UDP, portul 123.'],
    ['TCP 123', false, 'NTP nu folosește TCP.'],
    ['UDP 161', false, 'UDP 161 este SNMP (agentul).'],
    ['UDP 514', false, 'UDP 514 este syslog.'],
  ], 'NTP: UDP 123.'),
  single({ id: '4.2-003' }, 1, 'De ce este important ca toate dispozitivele să aibă aceeași oră?', [
    ['Pentru corelarea log-urilor și pentru autentificare, certificate și audit', true, 'Fără timp comun nu poți reconstitui ordinea evenimentelor.'],
    ['Pentru ca routerele să aleagă calea cea mai scurtă', false, 'Alegerea căii nu depinde de ceas.'],
    ['Pentru ca VLAN-urile să funcționeze', false, 'VLAN-urile nu depind de ceas.'],
    ['Pentru ca ARP să nu expire', false, 'Timerele ARP sunt relative, nu depind de ora absolută.'],
  ], 'Timp consecvent = log-uri și securitate coerente.'),
  single({ id: '4.2-004' }, 2, 'Un router are ora corectă în show clock, dar show ntp status spune „unsynchronized”. Ce înseamnă?', [
    ['Ora a fost setată manual sau moștenită, dar ceasul nu are o sursă NTP validă', true, 'Ora afișată nu garantează sincronizarea.'],
    ['Routerul este o sursă de stratum 1', false, 'Un stratum 1 este sincronizat.'],
    ['NTP este activat dar blocat de licență', false, 'Nu are legătură cu licențierea.'],
    ['Ceasul hardware a fost resetat', false, 'Resetarea ceasului nu schimbă starea NTP în acest fel.'],
  ], 'Verifică sincronizarea cu show ntp status, nu doar cu show clock.'),
  single({ id: '4.2-005' }, 1, 'În terminologia NTP, ce este „stratum”?', [
    ['Numărul de salturi până la sursa de timp de referință', true, 'Stratum 0 = referința; fiecare salt adaugă 1.'],
    ['Viteza cu care se sincronizează un client', false, 'Viteza e legată de polling, nu de stratum.'],
    ['Numărul de clienți ai unui server', false, 'Stratum nu numără clienții.'],
    ['Portul pe care răspunde serverul', false, 'Portul este UDP 123.'],
  ], 'Stratum = distanța (în salturi) față de referință.'),
  single({ id: '4.2-006' }, 1, 'Ce stratum are un client NTP care se sincronizează de la un server de stratum 3?', [
    ['4', true, 'Fiecare salt adaugă 1: serverul 3 → clientul 4.'],
    ['3', false, 'Clientul nu moștenește același stratum; adaugă 1.'],
    ['2', false, 'Stratumul crește, nu scade, pe măsură ce te îndepărtezi de referință.'],
    ['16', false, '16 înseamnă nesincronizat.'],
  ], 'Server n → client n+1.'),
  single({ id: '4.2-007' }, 2, 'Ce înseamnă stratum 16 pe un dispozitiv Cisco?', [
    ['Ceasul nu este sincronizat cu nicio sursă validă', true, 'Valoarea 16 este rezervată pentru „nesincronizat”.'],
    ['Cel mai precis server posibil', false, 'Cel mai apropiat de referință este stratum 1.'],
    ['Server cu 16 clienți', false, 'Stratum nu numără clienții.'],
    ['Server configurat cu ntp master 16', false, 'Nu este modul în care se ajunge la 16; este o valoare de stare, nu o recomandare.'],
  ], 'Maximul utilizabil este 15; 16 = nesincronizat.'),
  single({ id: '4.2-008' }, 2, 'Ce informații folosește clientul NTP pentru a calcula diferența dintre ceasul lui și al serverului?', [
    ['Patru marcaje de timp (T1–T4) din cerere și răspuns', true, 'Din ele rezultă offset-ul și delay-ul.'],
    ['Doar ora serverului din răspuns', false, 'Fără T1 și T4 nu s-ar putea compensa întârzierea rețelei.'],
    ['Adresa MAC a serverului', false, 'MAC-ul nu are rol în calculul timpului.'],
    ['TTL-ul pachetului de răspuns', false, 'TTL nu se folosește la calculul timpului.'],
  ], 'Offset = ((T2−T1)+(T3−T4))/2.'),
  multi({ id: '4.2-009' }, 2, 'Care dintre acestea sunt moduri de funcționare NTP pe Cisco? (alege toate variantele corecte)', [
    ['Client (ntp server)', true, 'Interoghează un server și își ajustează ceasul.'],
    ['Server / sursă (ntp master)', true, 'Oferă ora lui ca sursă.'],
    ['Symmetric active (ntp peer)', true, 'Doi parteneri se sincronizează reciproc.'],
    ['Broadcast', true, 'Serverul trimite ora periodic pe broadcast/multicast.'],
    ['Relay', false, 'Relay este concept DHCP, nu NTP.'],
  ], 'Moduri: client, server, peer, broadcast.'),
  single({ id: '4.2-010' }, 1, 'Ce comandă transformă un router Cisco într-un client NTP al serverului 10.0.0.1?', [
    ['ntp server 10.0.0.1', true, 'Indică sursa de timp a dispozitivului.'],
    ['ntp master 10.0.0.1', false, 'ntp master primește un stratum, nu o adresă.'],
    ['ntp client 10.0.0.1', false, 'Nu există o astfel de comandă; clientul se definește cu ntp server.'],
    ['clock source ntp 10.0.0.1', false, 'Nu este sintaxă IOS.'],
  ], 'ntp server <ip>.'),
  single({ id: '4.2-011' }, 2, 'Ce face comanda ntp master 3 pe un router fără altă sursă de timp?', [
    ['Îl declară sursă de timp, la stratum 3', true, 'Clienții lui devin stratum 4.'],
    ['Îl face client al unui server cu stratum 3', false, 'Pentru client se folosește ntp server.'],
    ['Limitează numărul de clienți la 3', false, 'Numărul nu este un număr de clienți.'],
    ['Setează fusul orar la UTC+3', false, 'Fusul orar se setează cu clock timezone.'],
  ], 'ntp master [stratum] = sursă de laborator.'),
  single({ id: '4.2-012' }, 2, 'Cât timp durează de obicei până la prima sincronizare a unui client NTP după configurare?', [
    ['Câteva minute, deoarece clientul face mai multe interogări', true, 'NTP combină mai multe măsurători înainte să aleagă sursa.'],
    ['Imediat, sub o secundă', false, 'Imediat după configurare apare, de regulă, „unsynchronized”.'],
    ['Exact 24 de ore', false, 'Nu există o astfel de regulă.'],
    ['Până la reload', false, 'Nu este nevoie de repornire.'],
  ], 'Fii răbdător: sincronizarea nu e instantanee.'),
  order({ id: '4.2-013' }, 2, 'Ordonează schimbul de mesaje NTP dintre client și server.', [
    { text: 'Clientul trimite cererea și notează T1', why: 'T1 este ora clientului la trimitere.' },
    { text: 'Serverul primește cererea și notează T2', why: 'T2 este ora serverului la recepție.' },
    { text: 'Serverul trimite răspunsul (cu T1, T2) și notează T3', why: 'T3 este ora serverului la trimiterea răspunsului.' },
    { text: 'Clientul primește răspunsul și notează T4', why: 'T4 este ora clientului la recepție.' },
    { text: 'Clientul calculează offset-ul și delay-ul și își ajustează ceasul', why: 'Cele patru marcaje permit calculul.' },
  ], 'T1 → T2 → T3 → T4 → calcul.'),
  single({ id: '4.2-014' }, 3, 'Marcaje: T1 = 100,000 s; T2 = 110,050 s; T3 = 110,060 s; T4 = 100,110 s. Care este offset-ul clientului față de server?', [
    ['+10,000 s (clientul e în urmă cu 10 s)', true, '((T2−T1)+(T3−T4))/2 = ((10,050)+(9,950))/2 = 10,000.'],
    ['+0,110 s', false, '0,110 s este durata dus-întors măsurată la client, nu offset-ul.'],
    ['−10,000 s', false, 'Semnul este pozitiv: ceasul serverului este înainte.'],
    ['+5,000 s', false, 'Nu rezultă din formulă.'],
  ], 'Offset = media celor două diferențe.'),
  single({ id: '4.2-015' }, 3, 'Marcaje: T1 = 100,000 s; T2 = 110,050 s; T3 = 110,060 s; T4 = 100,110 s. Care este delay-ul dus-întors al rețelei?', [
    ['0,100 s', true, '(T4−T1) − (T3−T2) = 0,110 − 0,010 = 0,100.'],
    ['0,110 s', false, 'Aceasta este (T4−T1); trebuie scăzut timpul de procesare al serverului.'],
    ['0,010 s', false, 'Aceasta este timpul de procesare al serverului (T3−T2).'],
    ['10,000 s', false, 'Aceasta este offset-ul, nu delay-ul.'],
  ], 'Delay = timp total − timp de procesare.'),
  multi({ id: '4.2-016' }, 2, 'Care sunt consecințe ale ceasurilor nesincronizate? (alege toate variantele corecte)', [
    ['Log-uri greu de corelat între dispozitive', true, 'Ordinea evenimentelor nu se mai poate reconstitui.'],
    ['Certificate care pot părea expirate sau încă nevalide', true, 'Validitatea depinde de ora curentă.'],
    ['Joburi programate care rulează la momente greșite', true, 'Ceasul local decide momentul.'],
    ['Tabele de rutare incorecte', false, 'Rutarea nu depinde de ceasul absolut.'],
    ['Pierderea adreselor MAC', false, 'MAC-urile nu depind de ceas.'],
  ], 'Timp diferit ⇒ log-uri, certificate, programări afectate.'),
  single({ id: '4.2-017' }, 2, 'Care variantă descrie cel mai bine rolul lui ntp master într-un laborator?', [
    ['Simulează o sursă de timp când nu ai acces la una reală', true, 'Dispozitivul oferă ora lui, chiar dacă nu e sincronizat extern.'],
    ['Înlocuiește serverele NTP din Internet în producție', false, 'În producție folosești surse reale.'],
    ['Activează autentificarea NTP', false, 'Autentificarea se activează cu ntp authenticate.'],
    ['Face dispozitivul client pe toate interfețele', false, 'Nu are legătură.'],
  ], 'ntp master = sursă de laborator.'),
  single({ id: '4.2-018' }, 2, 'De ce se recomandă adesea ca dispozitivele interne să se sincronizeze la 1–2 servere NTP interne, nu direct la Internet?', [
    ['Reduce traficul extern, simplifică firewall-ul și oferă o sursă de adevăr unică', true, 'Doar serverele interne ies spre exterior.'],
    ['Pentru că NTP nu funcționează prin Internet', false, 'NTP funcționează prin Internet.'],
    ['Pentru că routerele nu pot fi clienți NTP', false, 'Routerele pot fi clienți.'],
    ['Pentru că UDP 123 nu poate traversa NAT', false, 'NAT nu blochează principial UDP 123.'],
  ], 'Servere interne = control și simplitate.'),
  single({ id: '4.2-019' }, 2, 'Un router are ora corectă prin NTP, dar după repornire arată iar o oră greșită până la resincronizare. Ce comandă ajută dacă echipamentul are calendar hardware?', [
    ['ntp update-calendar', true, 'Copiază ora ceasului software în calendarul hardware.'],
    ['ntp master', false, 'Face dispozitivul sursă, nu salvează ora.'],
    ['copy running-config startup-config', false, 'Salvează configurația, nu ora.'],
    ['clock timezone UTC 0', false, 'Schimbă doar fusul orar.'],
  ], 'Calendarul hardware păstrează ora la reload.'),

  // ======================= Configurare și verificare =======================
  single({ id: '4.2-020' }, 1, 'Ce comandă arată dacă ceasul este sincronizat și la ce stratum?', [
    ['show ntp status', true, 'Afișează „Clock is synchronized/unsynchronized”, stratum-ul și referința.'],
    ['show clock', false, 'Arată doar ora, nu starea de sincronizare.'],
    ['show ip route', false, 'Arată tabela de rutare.'],
    ['show version', false, 'Arată versiunea IOS și timpul de funcționare, nu NTP.'],
  ], 'show ntp status.'),
  single({ id: '4.2-021' }, 2, 'În show ntp associations, ce înseamnă asteriscul (*) din fața unui server?', [
    ['Este serverul ales ca sursă de sincronizare (sys.peer)', true, 'Fără asterisc, serverul nu este sursa curentă.'],
    ['Serverul este configurat greșit', false, 'Asteriscul nu semnalează o eroare.'],
    ['Serverul este broadcast', false, 'Broadcast e marcat altfel.'],
    ['Serverul este un peer simetric', false, 'Peer-ul nu e indicat prin asterisc.'],
  ], '* = sursa aleasă.'),
  single({ id: '4.2-022' }, 2, 'Coloana „reach” din show ntp associations arată 0. Ce indică?', [
    ['Niciuna dintre ultimele interogări nu a primit răspuns', true, 'Reach este un registru octal al ultimelor 8 interogări.'],
    ['Serverul este stratum 0', false, 'Reach nu se referă la stratum.'],
    ['Clientul este sincronizat perfect', false, '377 indică interogări reușite, nu 0.'],
    ['Pachetele NTP sunt criptate', false, 'Reach nu arată criptarea.'],
  ], 'reach 377 = totul bine; 0 = niciun răspuns.'),
  single({ id: '4.2-023' }, 2, 'Ce înseamnă reach 377 în show ntp associations?', [
    ['Ultimele 8 interogări au avut răspuns (valoare octală)', true, '377 octal = 11111111 binar: opt reușite.'],
    ['Serverul este la 377 ms distanță', false, 'Latența apare în coloana delay.'],
    ['Stratum 377', false, 'Stratum maxim este 16.'],
    ['Portul 377', false, 'NTP folosește portul 123.'],
  ], 'reach este un registru pe 8 biți, în octal.'),
  cli({ id: '4.2-024' }, 1, 'Ești în R2(config)#. Configurează R2 să se sincronizeze cu serverul NTP 10.0.0.1.', 'R2(config)#', 'ntp server 10.0.0.1', ['ntp server 10.0.0.1'], [
    { text: 'ntp master 10.0.0.1', why: 'ntp master primește un stratum; nu definește un server.' },
    { text: 'ntp peer 10.0.0.1', why: 'Peer = simetric; pentru client și server se folosește ntp server.' },
    { text: 'ntp 10.0.0.1', why: 'Nu este sintaxă IOS.' },
  ], 'ntp server <ip>.', 'ntp server …'),
  cli({ id: '4.2-025' }, 1, 'Ești în R1(config)#. Configurează R1 ca sursă de timp la stratum 3.', 'R1(config)#', 'ntp master 3', ['ntp master 3'], [
    { text: 'ntp server 3', why: 'ntp server cere o adresă IP, nu un stratum.' },
    { text: 'ntp stratum 3', why: 'Nu există o astfel de comandă; stratum-ul se dă lui ntp master.' },
    { text: 'ntp master', why: 'Valabilă, dar nu stabilește stratum-ul 3 cerut (folosește valoarea implicită).' },
  ], 'ntp master <stratum>.', 'ntp master …'),
  cli({ id: '4.2-026' }, 2, 'Ești în R1(config)#. Setează fusul orar CET cu decalaj +1 față de UTC.', 'R1(config)#', 'clock timezone CET 1', ['clock timezone CET 1', 'clock timezone cet 1'], [
    { text: 'clock timezone CET +1h', why: 'Decalajul se scrie ca număr de ore, fără „+” și „h”.' },
    { text: 'timezone CET 1', why: 'Comanda începe cu clock.' },
    { text: 'ntp timezone CET 1', why: 'Fusul orar este o setare de ceas, nu de NTP.' },
  ], 'clock timezone <nume> <ore>.', 'clock timezone …'),
  cli({ id: '4.2-027' }, 2, 'Ești în R1(config)#. Asigură-te că fiecare mesaj de log are data și ora, cu milisecunde.', 'R1(config)#', 'service timestamps log datetime msec', ['service timestamps log datetime msec'], [
    { text: 'service timestamps log uptime', why: 'uptime arată timpul de la pornire, nu data și ora.' },
    { text: 'service timestamps debug datetime msec', why: 'Se aplică mesajelor de debug, nu celor de log.' },
    { text: 'logging timestamps datetime msec', why: 'Nu este comanda IOS corectă.' },
  ], 'Timestamps cu dată și oră în log.', 'service timestamps …'),
  cli({ id: '4.2-028' }, 2, 'Ești în R1(config)#. Activează autentificarea NTP pe dispozitiv.', 'R1(config)#', 'ntp authenticate', ['ntp authenticate'], [
    { text: 'ntp authentication enable', why: 'Nu este sintaxă IOS.' },
    { text: 'ntp trusted-key 1', why: 'Declară o cheie de încredere, dar nu activează autentificarea.' },
    { text: 'ntp authentication-key 1 md5 parola', why: 'Definește o cheie, dar nu activează autentificarea.' },
  ], 'ntp authenticate pornește autentificarea; apoi definești și declari cheia.', 'ntp auth…'),
  order({ id: '4.2-029' }, 3, 'Ordonează pașii pentru un client NTP autentificat.', [
    { text: 'ntp authenticate', why: 'Activează autentificarea.' },
    { text: 'ntp authentication-key 1 md5 <parola>', why: 'Definește cheia partajată.' },
    { text: 'ntp trusted-key 1', why: 'Declară cheia de încredere.' },
    { text: 'ntp server <ip> key 1', why: 'Leagă serverul de cheie.' },
  ], 'Activezi, definești, declari de încredere, folosești.'),
  match({ id: '4.2-030' }, 2, 'Potrivește fiecare comandă cu efectul ei.', [
    { left: 'ntp server 10.0.0.1', right: 'Dispozitivul devine client al lui 10.0.0.1', why: 'Definește sursa de timp.' },
    { left: 'ntp master 3', right: 'Dispozitivul se declară sursă la stratum 3', why: 'Util în laborator.' },
    { left: 'show ntp associations', right: 'Arată serverele și starea lor (st, reach, offset)', why: 'Asteriscul indică sursa aleasă.' },
    { left: 'clock timezone CET 1', right: 'Setează fusul orar local', why: 'NTP transportă UTC; fusul e local.' },
  ], [
    { text: 'Șterge tabela MAC', why: 'Nu are legătură cu NTP.' },
  ], 'Fiecare comandă are un rol clar.'),
  single({ id: '4.2-031' }, 2, 'După ce ai configurat ntp server, show ntp status arată „unsynchronized”. Ce faci primul?', [
    ['Aștepți câteva minute și verifici din nou, apoi verifici ping-ul și show ntp associations', true, 'Sincronizarea nu e instantanee; apoi verifici cauze reale.'],
    ['Resetezi interfața serverului', false, 'Nu înainte de a verifica cauza.'],
    ['Ștergi tabela MAC', false, 'Nu are legătură.'],
    ['Schimbi stratum-ul clientului', false, 'Stratum-ul clientului este derivat din server.'],
  ], 'Răbdare, apoi diagnoză.'),
  single({ id: '4.2-032' }, 3, 'ping către serverul NTP merge, dar clientul rămâne unsynchronized. Ce cauză este plauzibilă?', [
    ['UDP 123 este blocat de un ACL sau serverul însuși nu e sincronizat', true, 'Ping folosește ICMP, nu UDP 123.'],
    ['Ping merge deci NTP trebuie să meargă', false, 'ICMP și UDP 123 sunt tratate separat.'],
    ['Clientul are stratum prea mic', false, 'Stratum-ul clientului se deduce din server.'],
    ['Fusul orar este greșit', false, 'Fusul orar nu împiedică sincronizarea.'],
  ], 'Verifică portul UDP 123 și starea serverului.'),
  single({ id: '4.2-033' }, 3, 'Cheia NTP are parola „LabKey123” pe server și „Labkey123” pe client. Ce observi?', [
    ['Asocierea apare, dar fără asterisc, iar clientul rămâne unsynchronized', true, 'Cheile diferite fac ca răspunsurile să fie respinse.'],
    ['Clientul se sincronizează normal', false, 'Parolele trebuie să fie identice.'],
    ['Clientul devine server', false, 'Rolurile nu se schimbă.'],
    ['Serverul trece pe stratum 16', false, 'Stratum-ul serverului nu este afectat.'],
  ], 'Chei diferite ⇒ fără sincronizare.'),
  single({ id: '4.2-034' }, 2, 'R1 are ntp master 3. R2 este client al lui R1, iar R3 este client al lui R2. Ce stratum are R3?', [
    ['5', true, 'R1 = 3, R2 = 4, R3 = 5.'],
    ['4', false, 'R3 este cu un salt mai departe de R2.'],
    ['3', false, 'Doar R1 are stratum 3.'],
    ['16', false, '16 apare doar când nu e sincronizat.'],
  ], 'Fiecare salt adaugă 1.'),
  single({ id: '4.2-035' }, 2, 'Ora afișată pe un router este cu o oră în urmă față de ora locală, deși NTP este sincronizat. Cauza cea mai probabilă?', [
    ['Fusul orar sau ora de vară setate greșit', true, 'NTP transportă UTC; fusul orar se aplică local.'],
    ['Serverul NTP e în stratum 0', false, 'Stratum-ul nu produce decalaje orare.'],
    ['UDP 123 este blocat', false, 'Dacă ar fi blocat, nu ai fi sincronizat.'],
    ['Cheia NTP este greșită', false, 'Cheia greșită ar împiedica sincronizarea.'],
  ], 'Verifică clock timezone / clock summer-time.'),
  single({ id: '4.2-036' }, 2, 'Care este diferența dintre ceasul software și calendarul hardware pe un router Cisco?', [
    ['Ceasul software e folosit la runtime; calendarul hardware păstrează ora când echipamentul e oprit', true, 'NTP actualizează ceasul software; update-calendar îl copiază în calendar.'],
    ['Sunt același lucru', false, 'Sunt componente separate.'],
    ['Calendarul hardware se actualizează prin CDP', false, 'CDP nu are rol în timp.'],
    ['Ceasul software există doar în Packet Tracer', false, 'Există pe echipamentele reale.'],
  ], 'NTP → ceas software; ntp update-calendar → calendar hardware.'),
  single({ id: '4.2-037' }, 2, 'Cum afli că ora unui router provine din NTP și nu a fost setată manual?', [
    ['show clock detail afișează „Time source is NTP”', true, 'Sursa de timp apare în ieșire.'],
    ['show ip interface brief', false, 'Nu arată sursa timpului.'],
    ['show vlan brief', false, 'Nu are legătură.'],
    ['show cdp neighbors', false, 'Nu are legătură.'],
  ], 'show clock detail → Time source.'),
  single({ id: '4.2-038' }, 3, 'Care dintre acestea creează cel mai mare risc de securitate la NTP fără autentificare?', [
    ['Un atacator poate trimite răspunsuri false și poate muta ceasul dispozitivului', true, 'Fără autentificare, răspunsurile nu sunt verificate.'],
    ['Pachetele NTP sunt prea mari', false, 'Pachetele NTP sunt mici.'],
    ['Clientul își șterge configurația', false, 'NTP nu face asta.'],
    ['Serverul își schimbă stratum-ul la 0', false, 'Nu este un risc specific.'],
  ], 'Autentificarea NTP previne ora falsificată.'),
  single({ id: '4.2-039' }, 3, 'Un client are două servere: A (stratum 2) și B (stratum 3). Ce comandă îl face pe A preferatul chiar dacă măsurătorile sunt similare?', [
    ['ntp server <A> prefer', true, 'Cuvântul prefer indică serverul favorit.'],
    ['ntp master <A>', false, 'ntp master nu alege serverul.'],
    ['ntp source <A>', false, 'ntp source alege interfața sursă a pachetelor, nu serverul.'],
    ['ntp trusted-key <A>', false, 'Cheile nu aleg serverul preferat.'],
  ], 'prefer favorizează un server.'),
  single({ id: '4.2-040' }, 2, 'Care afirmație despre un server NTP Cisco este corectă?', [
    ['Un dispozitiv sincronizat răspunde implicit la cereri NTP, în limita ACL-urilor', true, 'Nu există o comandă de activare a serverului.'],
    ['Trebuie activat cu „ntp server enable”', false, 'Nu există o astfel de comandă.'],
    ['Răspunde doar la TCP 123', false, 'NTP folosește UDP 123.'],
    ['Nu poate fi și client în același timp', false, 'Un dispozitiv poate fi client al unui server și server pentru alții.'],
  ], 'Un router sincronizat este implicit și server.'),
];
