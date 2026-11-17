import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.4 Explain the function of SNMP in network operations.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.4'. Fiecare variantă are explicație (why).
const T = '4.4';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_4: Question[] = [
  // ======================= Scop și arhitectură =======================
  single({ id: '4.4-001' }, 1, 'Care este funcția principală a SNMP într-o rețea?', [
    ['Monitorizarea și gestionarea centralizată a dispozitivelor de rețea', true, 'Un NMS colectează date de la agenți și poate modifica valori.'],
    ['Atribuirea automată de adrese IP', false, 'Aceasta este funcția DHCP.'],
    ['Traducerea numelor în adrese', false, 'Aceasta este funcția DNS.'],
    ['Transferul fișierelor de configurare', false, 'Aceasta este treaba TFTP/FTP.'],
  ], 'SNMP = management și monitorizare.'),
  single({ id: '4.4-002' }, 1, 'Ce porturi UDP folosește SNMP?', [
    ['161 pentru agent (cereri), 162 pentru traps/informs către manager', true, 'Managerul interoghează pe 161; notificările pleacă spre 162.'],
    ['123 și 514', false, '123 este NTP, 514 este syslog.'],
    ['67 și 68', false, 'Acestea sunt DHCP.'],
    ['53 și 69', false, '53 este DNS, 69 este TFTP.'],
  ], 'SNMP: UDP 161/162.'),
  single({ id: '4.4-003' }, 2, 'De ce este SNMP util într-o rețea mare?', [
    ['Colectează automat aceleași tipuri de date de la dispozitive de orice producător, fără conectare manuală pe fiecare', true, 'MIB-ul standard face datele comparabile.'],
    ['Crește viteza interfețelor', false, 'SNMP nu influențează viteza.'],
    ['Criptează tot traficul rețelei', false, 'SNMP nu criptează traficul utilizatorilor.'],
    ['Înlocuiește protocoalele de rutare', false, 'Nu rutează.'],
  ], 'Scalare și standardizare a monitorizării.'),
  single({ id: '4.4-004' }, 1, 'Ce este un agent SNMP?', [
    ['Procesul din dispozitivul gestionat care răspunde la cereri și poate trimite notificări', true, 'Rulează pe router/switch/server.'],
    ['Aplicația centrală care monitorizează rețeaua', false, 'Aceea este managerul (NMS).'],
    ['O bază de date cu tipuri de obiecte', false, 'Aceea este MIB-ul.'],
    ['Un identificator al unui obiect', false, 'Aceea este OID-ul.'],
  ], 'Agent = în dispozitiv; manager = NMS.'),
  single({ id: '4.4-005' }, 1, 'Ce este MIB (Management Information Base)?', [
    ['O bază de date ierarhică a obiectelor gestionabile, fiecare cu un OID', true, 'Definește ce se poate citi/scrie.'],
    ['Un protocol de transport', false, 'MIB nu este un protocol.'],
    ['O parolă pentru acces SNMP', false, 'Aceea este community string-ul.'],
    ['Un tip de trap', false, 'Trap-ul este o notificare, nu MIB.'],
  ], 'MIB = schema obiectelor.'),
  single({ id: '4.4-006' }, 2, 'Ce este un OID?', [
    ['Identificatorul unic al unui obiect în arborele MIB, un șir de numere separate prin puncte', true, 'De exemplu 1.3.6.1.2.1.1.5.0 = sysName.'],
    ['Adresa IP a agentului', false, 'OID nu este o adresă IP.'],
    ['Numele community-ului', false, 'Community-ul este o parolă.'],
    ['Versiunea protocolului', false, 'Versiunea este v1/v2c/v3.'],
  ], 'OID = „adresa” unui obiect în MIB.'),
  single({ id: '4.4-007' }, 1, 'Care este diferența esențială dintre polling și trap?', [
    ['Polling: managerul întreabă periodic; trap: agentul trimite singur o notificare', true, 'Cine inițiază diferă.'],
    ['Polling folosește UDP 162, trap folosește UDP 161', false, 'Porturile sunt invers: cereri 161, notificări 162.'],
    ['Polling este criptat, trap nu', false, 'Criptarea depinde de versiune, nu de operație.'],
    ['Nu există diferență', false, 'Diferența de inițiator este fundamentală.'],
  ], 'Polling = manager→agent; trap = agent→manager.'),
  single({ id: '4.4-008' }, 2, 'Ce deosebește un inform de un trap?', [
    ['Informul este confirmat de manager (acknowledgement); trap-ul nu', true, 'Agentul retransmite informul până la confirmare.'],
    ['Informul este criptat, trap-ul nu', false, 'Criptarea nu depinde de acest aspect.'],
    ['Trap-ul folosește TCP', false, 'Ambele folosesc UDP 162.'],
    ['Informul există și în SNMPv1', false, 'Informul a apărut în v2c.'],
  ], 'Inform = trap confirmat (v2c+).'),
  single({ id: '4.4-009' }, 2, 'Ce operație SNMP permite modificarea unei valori pe agent?', [
    ['Set', true, 'Necesită acces read-write.'],
    ['Get', false, 'Get doar citește.'],
    ['GetBulk', false, 'GetBulk doar citește mai multe valori.'],
    ['Trap', false, 'Trap-ul e o notificare, nu o modificare.'],
  ], 'Set scrie valori.'),
  single({ id: '4.4-010' }, 1, 'Cum se autentifică SNMPv1 și v2c?', [
    ['Cu un community string trimis în text clar', true, 'Parolă comună, fără identitate per utilizator.'],
    ['Cu certificate digitale', false, 'Nu folosesc certificate.'],
    ['Cu utilizator și parolă criptată', false, 'Aceasta este SNMPv3.'],
    ['Nu se autentifică deloc', false, 'Cer community, chiar dacă slab.'],
  ], 'v1/v2c = community string.'),
  single({ id: '4.4-011' }, 2, 'Care versiune SNMP poate cripta traficul?', [
    ['SNMPv3, în modul authPriv', true, 'Autentificare și criptare.'],
    ['SNMPv2c', false, 'v2c nu criptează.'],
    ['SNMPv1', false, 'v1 nu criptează.'],
    ['Toate, dacă folosești community lung', false, 'Lungimea community-ului nu produce criptare.'],
  ], 'Doar v3 authPriv criptează.'),
  match({ id: '4.4-012' }, 2, 'Potrivește nivelul de securitate SNMPv3 cu ce oferă.', [
    { left: 'noAuthNoPriv', right: 'Doar nume de utilizator, fără autentificare și fără criptare', why: 'Cel mai slab nivel.' },
    { left: 'authNoPriv', right: 'Autentificare (hash), fără criptare', why: 'Verifică identitatea, dar datele merg în clar.' },
    { left: 'authPriv', right: 'Autentificare și criptare', why: 'Recomandat în producție.' },
  ], [
    { text: 'Doar community string în text clar', why: 'Aceasta descrie v1/v2c, nu un nivel v3.' },
  ], 'Trei niveluri v3.'),
  multi({ id: '4.4-013' }, 2, 'Care sunt operații inițiate de manager? (alege toate variantele corecte)', [
    ['Get', true, 'Citește o valoare.'],
    ['GetNext', true, 'Parcurge arborele MIB.'],
    ['GetBulk', true, 'Aduce mai multe valori deodată (v2c+).'],
    ['Set', true, 'Modifică o valoare.'],
    ['Trap', false, 'Trap-ul este inițiat de agent.'],
  ], 'Managerul: Get*, Set. Agentul: Trap, Inform.'),
  multi({ id: '4.4-014' }, 2, 'Care sunt riscuri ale community string-urilor? (alege toate variantele corecte)', [
    ['Se transmit în text clar', true, 'Pot fi capturate din trafic.'],
    ['Valorile implicite „public”/„private” sunt cunoscute', true, 'Atacatorii le încearcă primele.'],
    ['Un community RW permite modificarea configurației (Set)', true, 'Risc major.'],
    ['Nu pot fi restricționate cu ACL', false, 'Pot fi limitate cu ACL (snmp-server community … ro 10).'],
    ['Sunt criptate cu AES implicit', false, 'Nu sunt criptate.'],
  ], 'Community strings = risc; folosește v3 și ACL.'),
  order({ id: '4.4-015' }, 2, 'Ordonează un scenariu: link-ul unui router cade, iar NMS-ul află prin notificare.', [
    { text: 'Interfața își schimbă starea în down', why: 'Evenimentul care declanșează notificarea.' },
    { text: 'Agentul generează un trap linkDown', why: 'Notificare spontană.' },
    { text: 'Trap-ul pleacă spre UDP 162 al managerului', why: 'Destinația notificărilor.' },
    { text: 'NMS-ul afișează alarma', why: 'Managerul prezintă evenimentul operatorului.' },
  ], 'Eveniment → trap → UDP 162 → alarmă.'),
  single({ id: '4.4-016' }, 2, 'Ce obiect MIB are OID-ul 1.3.6.1.2.1.1.5.0?', [
    ['sysName (numele de gazdă)', true, 'Se află sub mib-2, grupul system.'],
    ['ifInOctets', false, 'ifInOctets are alt OID (1.3.6.1.2.1.2.2.1.10).'],
    ['Adresa IP a agentului', false, 'Nu este un OID de adresă.'],
    ['Versiunea SNMP', false, 'Nu este un obiect de acest tip.'],
  ], 'sysName.0 = 1.3.6.1.2.1.1.5.0.'),
  single({ id: '4.4-017' }, 2, 'Care este prefixul OID folosit pentru obiectele specifice producătorilor (enterprises)?', [
    ['1.3.6.1.4.1', true, 'Cisco este 9, adică 1.3.6.1.4.1.9.'],
    ['1.3.6.1.2.1', false, 'Acesta este mib-2 (obiecte standard).'],
    ['1.3.6.1.5', false, 'Nu este prefixul enterprises.'],
    ['2.5.4', false, 'Nu este un prefix SNMP pentru enterprises.'],
  ], 'enterprises = 1.3.6.1.4.1.'),
  single({ id: '4.4-018' }, 2, 'Care este avantajul principal al GetBulk față de Get repetat?', [
    ['Aduce mai multe valori într-o singură cerere, reducând traficul și latența (v2c+)', true, 'Eficient pentru tabele mari.'],
    ['Criptează răspunsul', false, 'GetBulk nu criptează.'],
    ['Poate modifica valori', false, 'Doar citește.'],
    ['Funcționează doar în v1', false, 'Este introdus în v2c.'],
  ], 'GetBulk = eficiență la citire masivă.'),
  single({ id: '4.4-019' }, 2, 'NMS-ul trimite o cerere Get către agent. Pe ce port ajunge cererea?', [
    ['UDP 161 al agentului', true, 'Agentul ascultă pe 161.'],
    ['UDP 162 al agentului', false, '162 este portul managerului pentru notificări.'],
    ['TCP 161', false, 'SNMP folosește UDP.'],
    ['UDP 514', false, 'Aceasta este syslog.'],
  ], 'Get → agent:161.'),

  // ======================= Configurare și verificare =======================
  single({ id: '4.4-020' }, 1, 'Ce comandă IOS afișează statistici și starea agentului SNMP?', [
    ['show snmp', true, 'Afișează contoare, locație, contact, destinații trap.'],
    ['show snmp mib', false, 'Nu este comanda principală de stare și nu arată contoarele agentului.'],
    ['show ip snmp', false, 'Nu este sintaxă IOS.'],
    ['show running-config snmp', false, 'Nu este o comandă validă; poți filtra cu | include snmp.'],
  ], 'show snmp.'),
  single({ id: '4.4-021' }, 2, 'Contorul „Unknown community name” crește în show snmp. Ce indică?', [
    ['Cineva interoghează agentul cu un community care nu este configurat', true, 'De obicei un NMS configurat greșit (sau o încercare neautorizată).'],
    ['Agentul este oprit', false, 'Dacă ar fi oprit, nu ar număra pachete.'],
    ['ACL-ul permite orice adresă', false, 'Nu este relevant pentru acest contor.'],
    ['Trap-urile s-au pierdut', false, 'Aceasta nu este măsurată de acest contor.'],
  ], 'Community greșit pe NMS.'),
  cli({ id: '4.4-022' }, 2, 'Ești în R1(config)#. Configurează un community read-only „Citire#Lab” limitat de ACL 10.', 'R1(config)#', 'snmp-server community Citire#Lab ro 10', ['snmp-server community Citire#Lab ro 10'], [
    { text: 'snmp-server community Citire#Lab rw 10', why: 'rw dă acces de scriere; se cere read-only.' },
    { text: 'snmp community Citire#Lab ro 10', why: 'Comanda începe cu snmp-server.' },
    { text: 'snmp-server community ro Citire#Lab 10', why: 'Ordinea este: nume community, apoi ro/rw, apoi ACL.' },
  ], 'snmp-server community <șir> ro|rw [ACL].', 'snmp-server community …'),
  cli({ id: '4.4-023' }, 2, 'Ești în R1(config)#. Trimite traps SNMPv2c către 10.0.0.9 cu community „Citire#Lab”.', 'R1(config)#', 'snmp-server host 10.0.0.9 version 2c Citire#Lab', ['snmp-server host 10.0.0.9 version 2c Citire#Lab'], [
    { text: 'snmp-server trap 10.0.0.9 version 2c Citire#Lab', why: 'Comanda este snmp-server host, nu trap.' },
    { text: 'snmp-server host 10.0.0.9 Citire#Lab version 2c', why: 'Ordinea este: adresă, version, apoi community.' },
    { text: 'snmp-server community 10.0.0.9', why: 'Aceasta definește un community, nu destinația notificărilor.' },
  ], 'snmp-server host <ip> version <v> <community>.', 'snmp-server host …'),
  cli({ id: '4.4-024' }, 2, 'Ești în R1(config)#. Activează traps pentru căderea și revenirea unui link.', 'R1(config)#', 'snmp-server enable traps snmp linkdown linkup', ['snmp-server enable traps snmp linkdown linkup'], [
    { text: 'snmp-server traps linkdown linkup', why: 'Cuvântul cheie este enable traps.' },
    { text: 'snmp-server enable traps linkdown', why: 'Acoperă doar căderea; linkup lipsește.' },
    { text: 'snmp-server enable informs', why: 'Aceasta nu este sintaxa pentru traps de link.' },
  ], 'snmp-server enable traps snmp linkdown linkup.', 'snmp-server enable traps …'),
  cli({ id: '4.4-025' }, 2, 'Ești în R1(config)#. Creează grupul SNMPv3 ADMINS cu nivelul authPriv.', 'R1(config)#', 'snmp-server group ADMINS v3 priv', ['snmp-server group ADMINS v3 priv'], [
    { text: 'snmp-server group ADMINS v3 auth', why: 'auth = authNoPriv; cerința este authPriv (priv).' },
    { text: 'snmp-server group ADMINS v3 noauth', why: 'noauth = noAuthNoPriv; cel mai slab nivel.' },
    { text: 'snmp-server group ADMINS v2c priv', why: 'Grupurile cu nivel de securitate sunt v3; v2c nu are priv.' },
  ], 'snmp-server group <nume> v3 priv.', 'snmp-server group …'),
  single({ id: '4.4-026' }, 3, 'Care comandă creează utilizatorul v3 nms1 în grupul ADMINS cu SHA și AES-128?', [
    ['snmp-server user nms1 ADMINS v3 auth sha AuthP priv aes 128 PrivP', true, 'Utilizator în grup, cu algoritmi și parole separate.'],
    ['snmp-server user ADMINS nms1 v3 auth sha AuthP priv aes 128 PrivP', false, 'Ordinea este: utilizator, apoi grup.'],
    ['snmp-server community nms1 ADMINS v3', false, 'Community nu se folosește la v3.'],
    ['snmp-server group nms1 v3 priv sha aes', false, 'Aceasta ar crea un grup, nu un utilizator.'],
  ], 'snmp-server user <nume> <grup> v3 …'),
  single({ id: '4.4-027' }, 2, 'Care este rolul ACL-ului legat de un community (snmp-server community … ro 10)?', [
    ['Limitează adresele care au voie să interogheze agentul', true, 'Reduce expunerea unui community slab.'],
    ['Filtrează traficul utilizatorilor', false, 'ACL-ul se aplică doar pentru accesul SNMP.'],
    ['Alege versiunea SNMP', false, 'Versiunea nu depinde de ACL.'],
    ['Activează traps', false, 'Traps se activează cu enable traps.'],
  ], 'ACL pe community = restricție de manager.'),
  single({ id: '4.4-028' }, 3, 'NMS-ul nu primește traps, deși snmp-server host este configurat. Ce lipsește cel mai probabil?', [
    ['snmp-server enable traps … (nu există evenimente activate)', true, 'Fără tipuri de trap activate, nu se generează notificări.'],
    ['ntp server', false, 'NTP nu influențează notificările.'],
    ['ip domain-lookup', false, 'Nu are legătură.'],
    ['snmp-server location', false, 'Locația este informativă.'],
  ], 'host + enable traps.'),
  single({ id: '4.4-029' }, 2, 'Cum afli ce community-uri sunt configurate pe un router?', [
    ['show snmp community', true, 'Afișează community-urile și ACL-urile lor.'],
    ['show snmp user', false, 'Arată utilizatorii v3.'],
    ['show snmp host', false, 'Arată destinațiile de notificare.'],
    ['show ip route', false, 'Nu are legătură.'],
  ], 'show snmp community.'),
  single({ id: '4.4-030' }, 2, 'Cum afli unde trimite routerul notificările SNMP?', [
    ['show snmp host', true, 'Listează destinațiile, versiunea și tipul.'],
    ['show snmp group', false, 'Arată grupurile v3.'],
    ['show snmp user', false, 'Arată utilizatorii v3.'],
    ['show snmp location', false, 'Nu există această comandă.'],
  ], 'show snmp host.'),
  single({ id: '4.4-031' }, 3, 'NMS-ul cere authPriv pentru nms1, dar pe router grupul ADMINS este configurat „v3 auth”. Ce se întâmplă?', [
    ['Cererile sunt respinse: nivelul cerut nu corespunde nivelului grupului', true, 'Nivelurile trebuie să fie compatibile.'],
    ['Merge, cu criptare', false, 'Grupul nu cere criptare, iar nivelurile nu se potrivesc.'],
    ['NMS-ul trece automat la v2c', false, 'NMS-ul nu schimbă versiunea singur.'],
    ['Routerul reconfigurează grupul', false, 'Nu are loc așa ceva.'],
  ], 'Nivelurile v3 trebuie să coincidă.'),
  single({ id: '4.4-032' }, 2, 'Câți octeți primiți pe o interfață raportează obiectul ifInOctets?', [
    ['Numărul total (contor) de octeți primiți; rata se calculează din două citiri', true, 'NMS-ul face diferența împărțită la timp.'],
    ['Viteza instantanee în Mb/s', false, 'Este un contor cumulativ, nu o rată.'],
    ['Numărul de pachete pierdute', false, 'Pierderile sunt alte obiecte (erori/discards).'],
    ['Adresa IP a interfeței', false, 'Nu este un contor.'],
  ], 'ifInOctets = contor cumulativ.'),
  single({ id: '4.4-033' }, 3, 'Un atacator ascultă traficul rețelei. Ce informație SNMP poate fura direct dintr-un pachet v2c?', [
    ['Community string-ul, trimis în text clar', true, 'Cu un community RW poate chiar modifica dispozitive.'],
    ['Parola enable', false, 'Nu este transportată de SNMP v2c.'],
    ['Cheia AES a utilizatorului', false, 'AES apare doar la v3 și cheia nu se transmite.'],
    ['Nimic, v2c este criptat', false, 'v2c nu este criptat.'],
  ], 'v2c: community în clar.'),
  single({ id: '4.4-034' }, 2, 'De ce trap-ul poate „dispărea” fără ca agentul să afle?', [
    ['Folosește UDP și nu este confirmat', true, 'Nu există retransmisie la trap.'],
    ['Folosește TCP cu timeout scurt', false, 'Trap-ul folosește UDP.'],
    ['Este criptat cu o cheie expirată', false, 'Nu este vorba de criptare.'],
    ['Agentul îl șterge după 1 s', false, 'Nu este un comportament standard.'],
  ], 'Trap = UDP fără confirmare.'),
  single({ id: '4.4-035' }, 2, 'Ce reprezintă un NMS?', [
    ['Network Management System: aplicația care interoghează agenții și primește notificări', true, 'Rol de manager SNMP.'],
    ['Un tip de switch', false, 'NMS este software.'],
    ['Un protocol de rutare', false, 'Nu este un protocol de rutare.'],
    ['O bază de date MIB', false, 'MIB este schema obiectelor.'],
  ], 'NMS = managerul.'),
  single({ id: '4.4-036' }, 2, 'Care este diferența dintre syslog și SNMP trap?', [
    ['Syslog trimite mesaje text de log; SNMP trap trimite o notificare structurată identificată prin OID-uri', true, 'Ambele raportează evenimente, dar în format diferit.'],
    ['Syslog folosește TCP, trap UDP', false, 'Syslog folosește de obicei UDP 514; nu e diferența esențială.'],
    ['Syslog este criptat, trap nu', false, 'Nici unul nu este criptat implicit.'],
    ['Nu există diferență', false, 'Formatul și mecanismul diferă.'],
  ], 'Syslog = text; trap = obiecte MIB.'),
  single({ id: '4.4-037' }, 3, 'Un NMS afișează „link down” pe Gi0/1 doar după 5 minute, deși portul a căzut imediat. Ce mecanism explică cel mai probabil întârzierea?', [
    ['Detectarea prin polling (interval de 5 minute) fără traps activate', true, 'Polling nu vede evenimentele între sondaje.'],
    ['Trap-urile sunt întârziate de NTP', false, 'NTP nu întârzie traps.'],
    ['Community-ul este expirat', false, 'Community-urile nu expiră.'],
    ['SNMPv3 întârzie automat notificările', false, 'Nu este un comportament al v3.'],
  ], 'Polling = întârziere; traps = reacție imediată.'),
  single({ id: '4.4-038' }, 3, 'De ce se recomandă un community RO diferit de cel RW, ambele cu ACL?', [
    ['Ca să limitezi riscul: citirea e necesară des, scrierea rar; separarea și ACL reduc suprafața de atac', true, 'Principiul privilegiului minim.'],
    ['Pentru că IOS nu permite două community-uri la fel', false, 'IOS le-ar accepta, dar nu e recomandat.'],
    ['Pentru că RO este mai rapid', false, 'Nu are legătură cu viteza.'],
    ['Pentru că RW nu funcționează cu ACL', false, 'ACL funcționează și cu RW.'],
  ], 'Separă drepturile și limitează sursele.'),
  single({ id: '4.4-039' }, 2, 'Cine alege destinația la care se trimit traps într-o configurare IOS?', [
    ['Administratorul, prin snmp-server host', true, 'Fără această comandă nu există destinație.'],
    ['Managerul, automat', false, 'Agentul trimite către ce a fost configurat.'],
    ['DNS-ul', false, 'DNS nu are rol aici.'],
    ['NTP-ul', false, 'NTP nu are rol aici.'],
  ], 'snmp-server host = destinația.'),
  single({ id: '4.4-040' }, 3, 'Care este varianta cu cele mai bune practici pentru un router nou într-o rețea de producție?', [
    ['SNMPv3 authPriv cu utilizator dedicat, ACL pentru managerii permiși, traps spre NMS', true, 'Securitate, control și vizibilitate.'],
    ['SNMPv2c cu community „public” și RW', false, 'Cea mai slabă și mai riscantă combinație.'],
    ['SNMP dezactivat și nimic altceva', false, 'Pierzi monitorizarea; alternativa sigură este v3.'],
    ['SNMPv1 cu community lung', false, 'v1 nu criptează; lungimea nu rezolvă problema.'],
  ], 'v3 authPriv + ACL + traps.'),
];
