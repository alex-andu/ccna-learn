import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.2 Describe security program elements (user awareness, training, and physical access control).
// Obiectivul oficial nu are sub-puncte; `sub` = '5.2'. Fiecare variantă are explicație (why).
const T = '5.2';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_2: Question[] = [
  // ======================= Elemente și politici =======================
  single({ id: '5.2-001' }, 1, 'Care sunt cele trei elemente ale programului de securitate menționate în obiectivul 5.2?', [
    ['User awareness, training și physical access control', true, 'Sunt cele trei elemente enumerate în obiectivul oficial.'],
    ['Firewall, ACL și VPN', false, 'Sunt controale tehnice, nu elemente de program din 5.2.'],
    ['Criptare, hash și certificate', false, 'Sunt mecanisme criptografice.'],
    ['Backup, redundanță și patch', false, 'Sunt controale de disponibilitate/mentenanță.'],
  ], 'Awareness + training + control fizic.'),
  single({ id: '5.2-002' }, 1, 'De ce nu este suficient un firewall bun pentru securitatea unei organizații?', [
    ['Pentru că oamenii și accesul fizic pot ocoli controalele tehnice', true, 'Phishing-ul sau un laptop conectat la o priză liberă nu trec prin firewall-ul perimetral.'],
    ['Pentru că firewall-urile nu pot filtra traficul', false, 'Pot filtra; limita este altă parte a securității.'],
    ['Pentru că firewall-ul funcționează doar pe IPv6', false, 'Funcționează și pe IPv4.'],
    ['Pentru că nu există firewall-uri hardware', false, 'Există firewall-uri hardware și software.'],
  ], 'Securitatea = tehnologie + oameni + procese.'),
  single({ id: '5.2-003' }, 2, 'Ce este o politică de securitate (security policy)?', [
    ['Un document de nivel înalt, aprobat de conducere, care spune ce se cere și de ce', true, 'Politica stabilește direcția; standardele și procedurile o implementează.'],
    ['O listă de comenzi IOS', false, 'Comenzile fac parte din proceduri sau configurări.'],
    ['Un tip de firewall', false, 'Este un document, nu un dispozitiv.'],
    ['Un protocol de autentificare', false, 'Nu este un protocol.'],
  ], 'Policy = ce și de ce.'),
  single({ id: '5.2-004' }, 2, 'Care document descrie pașii concreți, în ordine, pentru a îndeplini o sarcină (de exemplu activarea SSH pe un switch nou)?', [
    ['Procedura (procedure)', true, 'Procedura spune cum se face, pas cu pas.'],
    ['Politica (policy)', false, 'Politica spune ce și de ce, nu pașii.'],
    ['Ghidul (guideline)', false, 'Ghidul oferă recomandări, nu pași obligatorii.'],
    ['Standardul (standard)', false, 'Standardul fixează cerințe măsurabile, nu pașii detaliați.'],
  ], 'Procedură = cum.'),
  match({ id: '5.2-005' }, 2, 'Potrivește tipul de document cu descrierea lui.', [
    { left: 'Policy', right: 'Declarație de nivel înalt: ce se cere și de ce', why: 'Aprobată de conducere.' },
    { left: 'Standard', right: 'Cerințe obligatorii, măsurabile (de exemplu parole de minimum 12 caractere)', why: 'Implementează politica.' },
    { left: 'Procedure', right: 'Pași în ordine pentru a executa o sarcină', why: 'Răspunde la „cum”.' },
    { left: 'Guideline', right: 'Recomandări și bune practici, neobligatorii', why: 'Ajută, dar nu impune.' },
  ], [
    { text: 'Un tip de ACL', why: 'ACL este un control tehnic, nu un document.' },
  ], 'Policy, standard, procedure, guideline.'),

  // ======================= Awareness și training =======================
  single({ id: '5.2-006' }, 1, 'Ce este user awareness (conștientizarea utilizatorilor)?', [
    ['Informare scurtă și continuă a tuturor utilizatorilor despre ce amenințări să recunoască și cum să se comporte', true, 'Se adresează tuturor și vizează schimbarea comportamentului.'],
    ['Un curs avansat pentru administratori de rețea', false, 'Aceasta este instruire (training) pe rol.'],
    ['Instalarea unui antivirus', false, 'Este un control tehnic.'],
    ['Un audit fizic al clădirii', false, 'Este un control/o verificare, nu awareness.'],
  ], 'Awareness = toți, scurt, repetat.'),
  single({ id: '5.2-007' }, 2, 'Un curs cu laburi despre hardening, destinat doar administratorilor de rețea, este un exemplu de:', [
    ['Training (instruire)', true, 'Instruirea dezvoltă competențe pentru un rol.'],
    ['Awareness', false, 'Awareness se adresează tuturor utilizatorilor, cu mesaje scurte.'],
    ['Control fizic', false, 'Nu se referă la accesul fizic.'],
    ['Răspuns la incidente', false, 'Răspunsul la incidente este un proces, nu un curs.'],
  ], 'Training = pe roluri.'),
  single({ id: '5.2-008' }, 2, 'Care este scopul principal al unei simulări de phishing?', [
    ['Să învețe utilizatorii să recunoască și să raporteze mesajele suspecte, într-un mediu controlat', true, 'Scopul este învățarea, nu pedepsirea.'],
    ['Să pedepsească angajații care dau click', false, 'Pedepsirea descurajează raportarea.'],
    ['Să testeze performanța firewall-ului', false, 'Testează oamenii, nu firewall-ul.'],
    ['Să elimine nevoia de MFA', false, 'MFA rămâne necesar.'],
  ], 'Simulare = învățare.'),
  single({ id: '5.2-009' }, 2, 'Care indicator arată cel mai bine o cultură sănătoasă de securitate într-un program de awareness?', [
    ['Rata de raportare a mesajelor suspecte', true, 'Un utilizator care raportează ajută întreaga organizație.'],
    ['Numărul de prezentări susținute', false, 'Măsoară activitatea, nu comportamentul.'],
    ['Numărul de parole schimbate pe zi', false, 'Nu arată conștientizarea.'],
    ['Numărul de switch-uri din rețea', false, 'Nu are legătură.'],
  ], 'Raportarea este indicatorul-cheie.'),

  // ======================= Fizic =======================
  single({ id: '5.2-010' }, 1, 'Ce urmărește controlul accesului fizic?', [
    ['Să împiedice persoanele neautorizate să ajungă la clădiri, săli de servere și echipamente', true, 'Un atacator cu acces fizic poate ocoli multe controale logice.'],
    ['Să cripteze traficul între site-uri', false, 'Aceasta este VPN-ul (5.5).'],
    ['Să autentifice utilizatorii wireless', false, 'Aceasta este 802.1X/WPA.'],
    ['Să filtreze pachetele pe routere', false, 'Aceasta este ACL (5.6).'],
  ], 'Control fizic = uși, badge, rack.'),
  single({ id: '5.2-011' }, 2, 'Ce este un mantrap (access control vestibule)?', [
    ['Un vestibul cu două uși, din care a doua nu se deschide până nu se închide prima, ca să prevină tailgating', true, 'Persoanele sunt verificate pe rând.'],
    ['O cameră de supraveghere ascunsă', false, 'Nu este o cameră.'],
    ['Un tip de malware', false, 'Este un control fizic.'],
    ['O parolă pentru consolă', false, 'Este un control fizic, nu o parolă.'],
  ], 'Mantrap = anti-tailgating.'),
  single({ id: '5.2-012' }, 2, 'Camerele de supraveghere (CCTV) sunt în principal un control:', [
    ['Detectiv (și de descurajare)', true, 'Înregistrează și ajută investigația, dar nu opresc intrarea.'],
    ['Preventiv, ca o ușă încuiată', false, 'Ușa încuiată e preventivă; camera nu blochează accesul.'],
    ['Corectiv, ca un backup', false, 'Nu restaurează nimic.'],
    ['Criptografic', false, 'Nu are legătură cu criptarea.'],
  ], 'CCTV = detectiv.'),
  single({ id: '5.2-013' }, 2, 'Ce este tailgating (piggybacking)?', [
    ['Intrarea într-o zonă protejată fizic prin urmărirea imediată a unei persoane autorizate', true, 'Este un atac de social engineering fizic.'],
    ['Interceptarea traficului wireless', false, 'Aceasta este un atac pe rețea.'],
    ['Un atac DDoS', false, 'DDoS epuizează resurse.'],
    ['Instalarea unui patch', false, 'Nu este un atac.'],
  ], 'Tailgating = intrare fizică lipit de cineva.'),
  cli({ id: '5.2-014' }, 2, 'Ești în R1(config-line)# (line console 0). Închide automat sesiunea inactivă după 5 minute.', 'R1(config-line)#', 'exec-timeout 5 0', ['exec-timeout 5 0', 'exec-timeout 5'], [
    { text: 'timeout 5', why: 'Comanda corectă este exec-timeout.' },
    { text: 'exec-timeout 0 5', why: 'Aceasta setează 0 minute și 5 secunde.' },
    { text: 'idle-timeout 5 0', why: 'Nu este sintaxa IOS.' },
  ], 'exec-timeout <minute> [secunde].', 'exec-…'),
  single({ id: '5.2-015' }, 2, 'Care este rolul unui banner de login pe un echipament?', [
    ['Afișează un avertisment legal că accesul este permis doar persoanelor autorizate și că activitatea este monitorizată', true, 'Are valoare legală și de descurajare, nu de blocare tehnică.'],
    ['Criptează parola enable', false, 'Aceasta este rolul lui enable secret.'],
    ['Blochează atacatorii', false, 'Nu blochează nimic tehnic.'],
    ['Oferă bun venit și detalii despre echipament', false, 'Detaliile ajută atacatorul; se evită.'],
  ], 'Banner = avertisment, nu protecție tehnică.'),

  // ======================= Recapitulare =======================
  single({ id: '5.2-016' }, 2, 'Cum se numește nivelul de învățare care răspunde la „de ce” funcționează un mecanism și vizează specialiști?', [
    ['Education (educație)', true, 'Aprofundează înțelegerea și capacitatea de proiectare.'],
    ['Awareness', false, 'Awareness răspunde la „ce să recunosc”.'],
    ['Training', false, 'Training răspunde la „cum fac”.'],
    ['Audit', false, 'Auditul verifică, nu educă.'],
  ], 'Awareness: ce · Training: cum · Education: de ce.'),
  order({ id: '5.2-017' }, 3, 'Ordonează fazele tipice ale răspunsului la incidente.', [
    { text: 'Pregătire', why: 'Planuri, roluri și instrumente pregătite înainte de incident.' },
    { text: 'Detectare și analiză', why: 'Se confirmă incidentul și se evaluează amploarea.' },
    { text: 'Izolare și eradicare', why: 'Se oprește răspândirea și se elimină cauza.' },
    { text: 'Recuperare', why: 'Serviciile revin la normal.' },
    { text: 'Lecții învățate', why: 'Procesul se îmbunătățește pentru viitor.' },
  ], 'Pregătire → detectare → izolare/eradicare → recuperare → lecții.'),
  single({ id: '5.2-018' }, 3, 'Ce înseamnă separation of duties?', [
    ['Niciun individ nu controlează singur un proces critic (de exemplu cine cere și cine aprobă sunt persoane diferite)', true, 'Reduce riscul de fraudă și de greșeli nedetectate.'],
    ['Echipamentele sunt separate în VLAN-uri', false, 'Aceasta este segmentarea de rețea.'],
    ['Utilizatorii au parole diferite', false, 'Nu este legat de atribuții.'],
    ['Fiecare angajat lucrează într-un birou separat', false, 'Nu este legat de control.'],
  ], 'Separation of duties = mai multe persoane.'),
  single({ id: '5.2-019' }, 2, 'La ce folosește clasificarea datelor (public, intern, confidențial, secret)?', [
    ['Stabilește nivelul de protecție necesar fiecărei categorii de date', true, 'Datele mai sensibile primesc controale mai stricte.'],
    ['Alege culoarea cablurilor', false, 'Nu are legătură.'],
    ['Setează viteza interfețelor', false, 'Nu are legătură.'],
    ['Înlocuiește criptarea', false, 'Clasificarea decide ce trebuie criptat; nu înlocuiește criptarea.'],
  ], 'Clasificare = nivel de protecție.'),
  single({ id: '5.2-020' }, 2, 'Care atitudine a conducerii încurajează raportarea incidentelor de către utilizatori?', [
    ['Tratarea raportărilor ca ocazie de învățare, fără reproșuri nejustificate', true, 'Oamenii raportează dacă nu se tem de consecințe nedrepte.'],
    ['Pedepsirea publică a oricui a dat click pe un link', false, 'Îi determină pe oameni să ascundă greșelile.'],
    ['Ignorarea raportărilor', false, 'Distruge încrederea.'],
    ['Interzicerea raportărilor', false, 'Opusul scopului programului.'],
  ], 'Cultura raportării.'),
  single({ id: '5.2-021' }, 2, 'Un badge reader cu jurnal de acces oferă în principal:', [
    ['Control preventiv (cine intră) și detectiv (cine a intrat și când)', true, 'Cartela limitează accesul, iar jurnalul oferă dovezi.'],
    ['Doar criptare a traficului', false, 'Nu criptează trafic de rețea.'],
    ['Doar backup', false, 'Nu are rol de backup.'],
    ['Doar filtrare de pachete', false, 'Nu filtrează pachete.'],
  ], 'Badge = preventiv + detectiv.'),
  single({ id: '5.2-022' }, 2, 'De ce un port console accesibil și fără parolă este o problemă într-o sală de servere deschisă?', [
    ['Oricine are acces fizic poate obține o sesiune EXEC fără să treacă prin controalele de rețea', true, 'Consola nu depinde de firewall sau ACL.'],
    ['Pentru că portul console consumă lățime de bandă', false, 'Nu este vorba de bandă.'],
    ['Pentru că portul console nu poate fi închis', false, 'Poate fi protejat cu parolă și timeout.'],
    ['Pentru că folosește doar IPv6', false, 'Consola nu folosește IP.'],
  ], 'Console = acces fizic direct.'),
  multi({ id: '5.2-023' }, 2, 'Care dintre acestea sunt controale de acces fizic? (alege toate variantele corecte)', [
    ['Badge-uri și control cu PIN la ușă', true, 'Limitează cine intră.'],
    ['Rack încuiat', true, 'Protejează echipamentele.'],
    ['Registru și însoțirea vizitatorilor', true, 'Controlează accesul persoanelor externe.'],
    ['ACL pe interfața unui router', false, 'Este un control tehnic de rețea.'],
    ['Criptarea sesiunilor SSH', false, 'Este un control criptografic.'],
  ], 'Fizic: badge, rack, registru.'),
  multi({ id: '5.2-024' }, 2, 'Ce teme sunt potrivite pentru un program de user awareness? (alege toate variantele corecte)', [
    ['Recunoașterea mesajelor de phishing', true, 'Cea mai frecventă cale de intrare.'],
    ['Utilizarea parolelor unice și a MFA', true, 'Reduce impactul credențialelor furate.'],
    ['Nu conecta USB-uri necunoscute', true, 'Previne introducerea de malware.'],
    ['Configurarea OSPF', false, 'Este un subiect de training pentru administratori, nu pentru toți utilizatorii.'],
    ['Calcularea măștilor VLSM', false, 'Este training tehnic.'],
  ], 'Awareness = comportamente pentru toți.'),
  single({ id: '5.2-025' }, 2, 'Ce impune o politică „clean desk”?', [
    ['Documentele și mediile sensibile nu rămân neprotejate pe birou la plecare', true, 'Reduce expunerea informațiilor la persoane neautorizate.'],
    ['Biroul este curățat cu dezinfectant', false, 'Nu are legătură cu igiena.'],
    ['Echipamentele sunt șterse de praf', false, 'Nu are legătură cu securitatea informației.'],
    ['Parolele sunt schimbate zilnic', false, 'Nu este scopul politicii.'],
  ], 'Clean desk = fără informații sensibile la vedere.'),
  single({ id: '5.2-026' }, 2, 'Care dintre acestea este un exemplu de cerință de conformitate sau standard de management al securității?', [
    ['ISO/IEC 27001', true, 'Standard internațional pentru sisteme de management al securității informației.'],
    ['IEEE 802.3', false, 'Este un standard Ethernet.'],
    ['RFC 1918', false, 'Definește adresele IPv4 private.'],
    ['OSPF', false, 'Este un protocol de rutare.'],
  ], 'ISO 27001 = management al securității.'),
  single({ id: '5.2-027' }, 2, 'Ce este un guideline (ghid) într-un program de securitate?', [
    ['O recomandare sau bună practică, neobligatorie', true, 'Spre deosebire de standard și politică.'],
    ['Un document obligatoriu cu sancțiuni', false, 'Aceasta este politica sau standardul.'],
    ['O listă de utilizatori', false, 'Nu este o listă de utilizatori.'],
    ['O comandă IOS', false, 'Nu este o comandă.'],
  ], 'Guideline = recomandare.'),
  single({ id: '5.2-028' }, 2, 'Care afirmație despre un standard (standard) este corectă?', [
    ['Conține cerințe obligatorii și măsurabile care implementează politica', true, 'Exemplu: lungimea minimă a parolei.'],
    ['Este întotdeauna opțional', false, 'Opțional este ghidul.'],
    ['Descrie pașii exacți pe butoane', false, 'Aceasta este procedura.'],
    ['Înlocuiește politica', false, 'Standardul se bazează pe politică.'],
  ], 'Standard = cerințe măsurabile.'),
  single({ id: '5.2-029' }, 3, 'După o simulare de phishing, 40% din utilizatori au dat click, dar 5% au raportat mesajul. Care este cea mai bună concluzie?', [
    ['Awareness trebuie intensificat, în special pentru raportare', true, 'Rata de click e mare și raportarea mică.'],
    ['Nu este necesară nicio acțiune', false, 'Rezultatele arată un risc ridicat.'],
    ['Firewall-ul trebuie dezactivat', false, 'Nu are legătură.'],
    ['Utilizatorii trebuie concediați', false, 'Nu este abordarea recomandată.'],
  ], 'Click mare + raportare mică = mai mult awareness.'),
  single({ id: '5.2-030' }, 2, 'De ce se oprește administrativ (shutdown) o priză de rețea liberă dintr-o sală de ședințe?', [
    ['Ca un vizitator să nu poată conecta un dispozitiv și să ocolească perimetrul', true, 'Un port liber activ este un punct de intrare.'],
    ['Pentru a economisi bandă', false, 'Nu are legătură cu banda.'],
    ['Pentru a activa STP', false, 'STP nu depinde de asta.'],
    ['Pentru a cripta traficul', false, 'Shutdown nu criptează.'],
  ], 'Port liber = punct de intrare.'),
  single({ id: '5.2-031' }, 2, 'Cum trebuie tratați vizitatorii într-o zonă cu echipamente de rețea?', [
    ['Înregistrați și însoțiți de personal autorizat', true, 'Reduce riscul de acces neautorizat și lasă urme.'],
    ['Lăsați singuri, dacă au un badge de vizitator', false, 'Un badge fără însoțire nu limitează acțiunile.'],
    ['Primesc cardul angajaților', false, 'Împrumutul de badge-uri este o practică proastă.'],
    ['Intră pe ușa din spate', false, 'Ocolește controalele.'],
  ], 'Vizitator = înregistrat + însoțit.'),
  single({ id: '5.2-032' }, 2, 'UPS-ul, climatizarea și stingerea incendiului în sala de servere protejează în principal:', [
    ['Disponibilitatea echipamentelor', true, 'Previn opririle cauzate de curent, căldură sau foc.'],
    ['Confidențialitatea datelor în tranzit', false, 'Aceasta se protejează prin criptare.'],
    ['Integritatea mesajelor', false, 'Aceasta se protejează prin hash/semnături.'],
    ['Autentificarea utilizatorilor', false, 'Nu are legătură.'],
  ], 'Controale de mediu = disponibilitate.'),
  order({ id: '5.2-033' }, 3, 'Ordonează straturile de control fizic de la exterior spre interior.', [
    { text: 'Perimetru (gard, pază)', why: 'Primul strat, la limita proprietății.' },
    { text: 'Clădire (recepție, badge)', why: 'Controlează intrarea în clădire.' },
    { text: 'Sala de servere (acces dublu, CCTV)', why: 'Zonă cu acces restrâns.' },
    { text: 'Rack încuiat', why: 'Cel mai apropiat de echipamente.' },
  ], 'Perimetru → clădire → sală → rack.'),
  match({ id: '5.2-034' }, 2, 'Potrivește controlul cu tipul lui principal.', [
    { left: 'Ușă cu badge', right: 'Preventiv', why: 'Oprește accesul neautorizat.' },
    { left: 'Cameră de supraveghere', right: 'Detectiv', why: 'Înregistrează ce s-a întâmplat.' },
    { left: 'Plan de recuperare și backup', right: 'Corectiv', why: 'Restabilește situația după incident.' },
  ], [
    { text: 'Criptografic', why: 'Nu este un tip de control după funcție, ci după mecanism.' },
  ], 'Preventiv, detectiv, corectiv.'),
  cli({ id: '5.2-035' }, 2, 'Ești în SW1(config-if)#. Oprește administrativ un port liber.', 'SW1(config-if)#', 'shutdown', ['shutdown'], [
    { text: 'no shutdown', why: 'Aceasta pornește portul.' },
    { text: 'port down', why: 'Nu este comandă IOS.' },
    { text: 'disable', why: 'Nu este comanda IOS pentru porturi.' },
  ], 'shutdown închide administrativ interfața.'),
  cli({ id: '5.2-036' }, 2, 'Ești în R1(config)#. Intră în configurarea liniei console.', 'R1(config)#', 'line console 0', ['line console 0', 'line con 0'], [
    { text: 'interface console 0', why: 'Consola este o linie, nu o interfață.' },
    { text: 'line vty 0 4', why: 'Aceasta este linia pentru sesiuni la distanță.' },
    { text: 'console 0', why: 'Comanda începe cu line.' },
  ], 'line console 0.', 'line …'),
  cli({ id: '5.2-037' }, 2, 'Ești în R1(config-line)# (line console 0). Cere parola configurată la consolă.', 'R1(config-line)#', 'login', ['login'], [
    { text: 'password required', why: 'Nu este comandă IOS.' },
    { text: 'login local', why: 'Aceasta cere utilizator și parolă locale, nu doar parola liniei.' },
    { text: 'no login', why: 'Aceasta dezactivează cererea de parolă.' },
  ], 'login = cere parola liniei.'),
  cli({ id: '5.2-038' }, 2, 'Ești în R1#. Șterge configurația salvată (startup-config) înainte de casarea echipamentului.', 'R1#', 'write erase', ['write erase', 'erase startup-config', 'erase nvram:'], [
    { text: 'delete running-config', why: 'Running-config este în RAM și nu se șterge așa.' },
    { text: 'reload', why: 'Repornește, dar nu șterge startup-config.' },
    { text: 'write memory', why: 'Aceasta salvează configurația.' },
  ], 'write erase / erase startup-config.', 'write …'),
  multi({ id: '5.2-039' }, 3, 'Ce elemente aparțin unui program de securitate? (alege toate variantele corecte)', [
    ['Politici, standarde și proceduri', true, 'Cadrul documentar.'],
    ['Awareness și training', true, 'Partea de oameni.'],
    ['Răspuns la incidente', true, 'Pregătirea pentru situații neprevăzute.'],
    ['O singură parolă comună pentru toți administratorii', false, 'Este o practică proastă.'],
    ['Eliminarea oricărui jurnal', false, 'Fără jurnale nu poți audita.'],
  ], 'Program = politici + oameni + proces + controale.'),
  single({ id: '5.2-040' }, 3, 'Care este riscul principal al comenzii no service password-recovery?', [
    ['Dacă pierzi parola, echipamentul poate fi recuperat doar ștergând configurația', true, 'Compromisul: protecție împotriva resetării de către un intrus, dar recuperare dificilă pentru administrator.'],
    ['Dezactivează SSH', false, 'Nu afectează SSH.'],
    ['Șterge jurnalele', false, 'Nu are acest efect.'],
    ['Expune parola enable în clar', false, 'Nu schimbă modul de stocare al parolelor.'],
  ], 'Password recovery dezactivat = recuperare cu ștergerea configurației.'),
];
