import type { Question } from '../../lib/types';

// Banca de întrebări pentru 6.2 Compare traditional networks with controller-based networking.
// Obiectivul oficial nu are sub-puncte; `sub` = '6.2'. Fiecare variantă are explicație (why).
const T = '6.2';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_6_2: Question[] = [
  // ======================= Concepte de bază =======================
  single({ id: '6.2-001' }, 1, 'Unde rulează control plane într-o rețea tradițională?', [
    ['Distribuit, pe fiecare router și switch', true, 'Fiecare echipament rulează propriile protocoale și își construiește singur tabelele.'],
    ['Într-un singur controller central', false, 'Aceasta descrie modelul bazat pe controller, nu pe cel tradițional.'],
    ['Doar în cabluri', false, 'Cablurile sunt strat fizic; nu rulează protocoale.'],
    ['Doar pe serverul DNS', false, 'DNS rezolvă nume; nu este control plane de rutare/comutare.'],
  ], 'Tradițional = control plane distribuit.'),
  single({ id: '6.2-002' }, 1, 'Care este rolul principal al unui controller într-o rețea bazată pe controller?', [
    ['Să ofere un punct central de proiectare, configurare, politici și monitorizare', true, 'Controller-ul vede întreaga rețea și o administrează prin API-uri.'],
    ['Să transporte tot traficul utilizatorilor', false, 'Traficul utilizatorilor circulă prin echipamente (data plane), nu prin controller.'],
    ['Să înlocuiască cablurile', false, 'Nu are legătură cu stratul fizic.'],
    ['Să elimine nevoia de echipamente de rețea', false, 'Echipamentele rămân pentru forwarding.'],
  ], 'Controller = punct central de management și politică.'),
  single({ id: '6.2-003' }, 1, 'Ce arată obiectivul 6.2 din blueprint-ul CCNA v1.1?', [
    ['Comparația dintre rețelele tradiționale și cele bazate pe controller', true, 'Textul oficial: „Compare traditional networks with controller-based networking”.'],
    ['Configurarea OSPF', false, 'OSPF este în domeniul 3.'],
    ['Formatul JSON', false, 'JSON este la 6.7.'],
    ['Securitatea WPA3', false, 'WPA3 este la 5.9.'],
  ], '6.2 = comparație de modele.'),

  // ======================= Tradițional =======================
  single({ id: '6.2-004' }, 2, 'Cum se aplică, de obicei, o politică nouă (de exemplu un VLAN) într-o rețea tradițională?', [
    ['Se configurează separat pe fiecare echipament, prin CLI', true, 'Fiecare echipament este administrat individual.'],
    ['Se trimite o singură dată către toate echipamentele, fără nicio configurare locală', false, 'Aceasta este caracteristica unui model cu controller.'],
    ['Se propagă automat prin ARP', false, 'ARP rezolvă adrese; nu propagă politici.'],
    ['Se aplică doar prin cablu crossover', false, 'Tipul cablului nu are legătură cu politica.'],
  ], 'Per echipament, prin CLI.'),
  single({ id: '6.2-005' }, 2, 'Care este un dezavantaj clasic al managementului tradițional device cu device?', [
    ['Inconsistența: aceeași politică implementată ușor diferit pe echipamente (drift)', true, 'Repetiția manuală creează abateri între echipamente.'],
    ['Imposibilitatea de a folosi SSH', false, 'SSH este metoda uzuală de administrare.'],
    ['Echipamentele nu mai pot forward-a trafic', false, 'Forwarding-ul nu depinde de modul de administrare.'],
    ['Lipsa totală a protocoalelor de rutare', false, 'Protocoalele de rutare există în rețelele tradiționale.'],
  ], 'Inconsistența este un dezavantaj-cheie.'),
  single({ id: '6.2-006' }, 2, 'Care este un avantaj real al modelului tradițional?', [
    ['Echipamentele sunt autonome: funcționează chiar dacă sistemul de management nu este disponibil', true, 'Nu există un controller de care să depindă administrarea locală.'],
    ['Toate politicile se aplică instantaneu pe toate echipamentele', false, 'Aceasta este o promisiune a modelului cu controller.'],
    ['Nu necesită niciun fel de configurare', false, 'Necesită configurare per echipament.'],
    ['Oferă automat un tablou de bord unic al rețelei', false, 'Vizibilitatea unitară vine cu controller-ul/NMS.'],
  ], 'Autonomie = avantaj al tradiționalului.'),
  single({ id: '6.2-007' }, 2, 'Cum se monitorizează, de obicei, o rețea tradițională?', [
    ['Prin NMS cu SNMP și syslog, plus show pe echipamente', true, 'Aceste mecanisme (4.4, 4.5) oferă monitorizare, dar vizibilitatea rămâne în mare parte per echipament.'],
    ['Prin fabric overlay cu VXLAN obligatoriu', false, 'Overlay/fabric aparțin arhitecturilor SDN (6.3).'],
    ['Printr-un API northbound al controller-ului', false, 'Un API northbound presupune un controller.'],
    ['Nu se monitorizează', false, 'Monitorizarea se face, dar cu instrumente mai fragmentate.'],
  ], 'SNMP + syslog + show.'),

  // ======================= Controller =======================
  single({ id: '6.2-008' }, 2, 'Ce este Cisco Catalyst Center?', [
    ['Controller Cisco pentru rețele de campus (fost DNA Center): automatizare, politici și assurance', true, 'Expune API-uri și administrează echipamente de campus.'],
    ['Un protocol de rutare', false, 'Nu este protocol; este un sistem de management.'],
    ['Un tip de cablu', false, 'Nu are legătură cu cablurile.'],
    ['Un standard de criptare wireless', false, 'Securitatea wireless este la 5.9.'],
  ], 'Catalyst Center = controller de campus.'),
  single({ id: '6.2-009' }, 2, 'Care sunt cele patru etape de lucru din Catalyst Center?', [
    ['Design, Policy, Provision, Assurance', true, 'Proiectezi, definești politici, provizionezi și monitorizezi.'],
    ['Discover, Offer, Request, Acknowledge', false, 'Acestea sunt etapele DHCP (DORA).'],
    ['Listening, Learning, Forwarding, Blocking', false, 'Acestea sunt stările STP clasice.'],
    ['Connect, Disconnect, Retry, Close', false, 'Nu sunt etape ale unui controller.'],
  ], 'Design → Policy → Provision → Assurance.'),
  single({ id: '6.2-010' }, 2, 'Ce înseamnă „single pane of glass”?', [
    ['O vedere/administrare unificată a întregii rețele dintr-un singur loc', true, 'Opusul vizibilității fragmentate per echipament.'],
    ['Un tip de fibră optică', false, 'Nu are legătură cu cablarea.'],
    ['Un protocol de securitate', false, 'Este o idee de management, nu un protocol.'],
    ['O interfață exclusiv CLI', false, 'De obicei este o interfață grafică/API centralizată.'],
  ], 'Single pane of glass = vedere unică.'),
  single({ id: '6.2-011' }, 2, 'Prin ce interfață cer aplicațiile și automatizările servicii unui controller?', [
    ['Prin API northbound, de obicei REST', true, 'Northbound = spre aplicații; REST/HTTPS cu JSON este obișnuit.'],
    ['Prin API southbound', false, 'Southbound merge spre echipamentele de rețea.'],
    ['Prin STP', false, 'STP previne bucle L2; nu este interfață către aplicații.'],
    ['Prin ARP', false, 'ARP rezolvă IP → MAC.'],
  ], 'Aplicații → northbound.'),
  single({ id: '6.2-012' }, 2, 'Controller-ul unui campus (management/orchestrare) devine indisponibil. Ce se întâmplă cu traficul existent?', [
    ['Echipamentele continuă să forward-eze; pierzi administrarea centralizată și vizibilitatea', true, 'Data plane rămâne pe echipamente, cu configurația deja aplicată.'],
    ['Toate echipamentele se opresc imediat', false, 'Forwarding-ul nu depinde de disponibilitatea controller-ului de management.'],
    ['Echipamentele își șterg configurația', false, 'Configurația curentă rămâne pe echipamente.'],
    ['Traficul se criptează automat', false, 'Nu există o asemenea reacție.'],
  ], 'Controller jos → forwarding continuă.'),
  single({ id: '6.2-013' }, 2, 'Care este un risc nou introdus de un controller central?', [
    ['Devine un punct critic: trebuie protejat, monitorizat și făcut redundant', true, 'Un controller compromis sau indisponibil afectează administrarea întregii rețele.'],
    ['Cablul UTP nu mai funcționează', false, 'Nu are legătură cu cablarea.'],
    ['Nu mai pot exista VLAN-uri', false, 'VLAN-urile rămân.'],
    ['Adresele IP dispar', false, 'Adresarea nu depinde de un controller.'],
  ], 'Punct critic: redundanță și securitate.'),

  // ======================= Comparație =======================
  single({ id: '6.2-014' }, 2, 'Care afirmație compară corect cele două modele din perspectiva consecvenței?', [
    ['Controller-ul aplică și verifică aceeași politică uniform; tradiționalul depinde de disciplina manuală', true, 'Controller-ul cunoaște starea dorită și raportează abaterile.'],
    ['Tradiționalul este întotdeauna mai consecvent', false, 'Repetiția manuală favorizează inconsistența.'],
    ['Niciunul nu poate fi consecvent', false, 'Controller-ul îmbunătățește consecvența.'],
    ['Consecvența depinde doar de lungimea cablurilor', false, 'Nu are legătură.'],
  ], 'Controller → conformitate uniformă.'),
  single({ id: '6.2-015' }, 2, 'Cum diferă, în general, politicile în cele două modele?', [
    ['Tradițional: legate de IP/VLAN/port; controller: la nivel de intenție (utilizator, grup, aplicație)', true, 'Abstractizarea permite politici care nu se rup la mutarea unei adrese.'],
    ['Tradițional: la nivel de intenție; controller: doar prin IP', false, 'Este exact invers.'],
    ['Nu există politici în niciunul', false, 'Ambele au politici (ACL, QoS), dar exprimate diferit.'],
    ['Controller-ul nu poate aplica ACL-uri', false, 'Poate aplica politici de securitate și ACL-uri, inclusiv prin intenție.'],
  ], 'Intenție vs adrese.'),
  single({ id: '6.2-016' }, 2, 'O filială mică are 3 switch-uri și modificări rare. Ce model este de obicei potrivit?', [
    ['Tradițional (sau cloud-managed simplu): costul unui controller complex nu se justifică', true, 'Beneficiile controller-ului cresc cu scara și dinamica.'],
    ['Obligatoriu un controller SD-Access', false, 'Disproporționat pentru o rețea foarte mică.'],
    ['Niciun model: nu se poate administra', false, 'Se poate administra tradițional.'],
    ['Un fabric cu overlay VXLAN', false, 'Excesiv pentru acest caz.'],
  ], 'La scară mică, tradiționalul poate fi suficient.'),
  single({ id: '6.2-017' }, 2, 'O companie cu 80 de magazine identice și personal IT central mic deschide magazine noi lunar. Ce se potrivește cel mai bine?', [
    ['Administrare centrală cu controller (cloud/SD-WAN) și provizionare fără atingere', true, 'Uniformitatea și frecvența schimbărilor favorizează automatizarea centrală.'],
    ['Configurare manuală pe fiecare echipament, la fața locului', false, 'Nu scalează la 80 de locații și crește riscul de drift.'],
    ['Interzicerea oricărei modificări', false, 'Nu este realistă pentru o afacere în creștere.'],
    ['Folosirea Telnet pentru fiecare magazin', false, 'Telnet este nesigur și nu rezolvă scara.'],
  ], 'Scară + uniformitate → administrare centrală.'),
  single({ id: '6.2-018' }, 3, 'Ce înseamnă că un controller „administrează” echipamente clasice (fără API-uri moderne)?', [
    ['Folosește interfețele lor existente (CLI/SSH, SNMP) ca interfețe southbound', true, 'Chiar și echipamentele clasice au acces de management pe care controller-ul îl folosește.'],
    ['Echipamentele devin virtuale', false, 'Rămân echipamente fizice; se schimbă modul de administrare.'],
    ['Nu mai au nevoie de IP de management', false, 'Au nevoie de IP și acces de management.'],
    ['Controller-ul rulează OSPF în locul lor', false, 'Nu înlocuiește protocoalele (în acest model).'],
  ], 'Southbound pe CLI/SNMP la echipamente clasice.'),
  single({ id: '6.2-019' }, 3, 'Care afirmație este corectă?', [
    ['Un controller nu stă pe calea pachetelor utilizatorilor; stă pe calea managementului (și, în unele arhitecturi SDN, a unei părți din control plane)', true, 'Pachetele circulă prin echipamente; controller-ul programează/administrează.'],
    ['Tot traficul utilizatorilor trece prin controller', false, 'Ar fi un blocaj enorm; data plane rămâne pe echipamente.'],
    ['Controller-ul decide pentru fiecare cadru în parte', false, 'Deciziile per cadru se iau în data plane, local.'],
    ['Controller-ul elimină nevoia de adrese MAC', false, 'Adresele MAC rămân la nivel L2.'],
  ], 'Data plane rămâne distribuit.'),

  // ======================= Config / verificare =======================
  single({ id: '6.2-020' }, 2, 'În exemplul cu API, de ce se obține întâi un token?', [
    ['Credențialele se trimit o singură dată; apoi tokenul însoțește cererile următoare', true, 'Evită retrimiterea parolei la fiecare cerere și permite expirarea/revocarea tokenului.'],
    ['Pentru că API-urile nu pot returna JSON', false, 'API-urile REST returnează frecvent JSON.'],
    ['Pentru că tokenul înlocuiește HTTPS', false, 'Tokenul nu înlocuiește criptarea transportului.'],
    ['Pentru că API-ul funcționează doar fără autentificare', false, 'API-urile de management cer autentificare.'],
  ], 'Token = autentificare reutilizabilă.'),
  single({ id: '6.2-021' }, 2, 'Controller-ul raportează un switch ca „Unreachable”. Ce avantaj ilustrează?', [
    ['Vizibilitate centrală: vezi imediat starea tuturor echipamentelor, fără să te conectezi la fiecare', true, 'Un inventar unitar cu stare de accesibilitate.'],
    ['Faptul că switch-ul a fost înlocuit automat', false, 'Raportul arată starea; nu înlocuiește echipamentul.'],
    ['Faptul că OSPF a convergit', false, 'Nu are legătură cu OSPF.'],
    ['Faptul că VLAN-urile au fost șterse', false, 'Nu indică ștergerea VLAN-urilor.'],
  ], 'Vizibilitate centrală și conformitate.'),

  // ======================= Multi =======================
  multi({ id: '6.2-022' }, 2, 'Care sunt avantaje ale modelului bazat pe controller? (alege toate variantele corecte)', [
    ['Administrare și politici centralizate', true, 'O singură intenție se aplică pe multe echipamente.'],
    ['Vizibilitate unificată asupra rețelei', true, 'Topologie, clienți și sănătate într-un loc.'],
    ['API-uri northbound pentru integrare și automatizare', true, 'Aplicațiile pot cere servicii controller-ului.'],
    ['Nu mai este niciodată nevoie de acces de management pe echipamente', false, 'Controller-ul se bazează pe acces de management southbound.'],
  ], 'Centralizare, vizibilitate, API-uri.'),
  multi({ id: '6.2-023' }, 2, 'Care sunt caracteristici ale unei rețele tradiționale? (alege toate variantele corecte)', [
    ['Control plane distribuit pe echipamente', true, 'Fiecare echipament rulează propriile protocoale.'],
    ['Configurare per echipament prin CLI', true, 'Politica se repetă pe fiecare device.'],
    ['Monitorizare uzuală prin SNMP și syslog', true, 'Mecanisme clasice de monitorizare.'],
    ['Politici definite exclusiv ca intenție de business, fără IP-uri sau VLAN-uri', false, 'Aceasta este caracteristica modelelor bazate pe intenție/controller.'],
  ], 'Distribuit, per echipament, SNMP/syslog.'),
  multi({ id: '6.2-024' }, 3, 'Ce pierzi temporar când un controller de management este indisponibil? (alege toate variantele corecte)', [
    ['Posibilitatea de a aplica politici noi central', true, 'Provisioning-ul centralizat depinde de controller.'],
    ['Vizibilitatea centralizată și assurance-ul', true, 'Telemetria și raportarea centrală sunt oprite.'],
    ['Automatizările care depind de API-urile controller-ului', true, 'Aplicațiile nu mai pot apela API-ul.'],
    ['Forwarding-ul traficului existent', false, 'Echipamentele continuă să forward-eze.'],
  ], 'Management pierdut, forwarding păstrat.'),

  // ======================= Match / Order =======================
  match({ id: '6.2-025' }, 2, 'Potrivește caracteristica cu modelul în care apare cel mai clar.', [
    { left: 'Control plane rulat pe fiecare echipament', right: 'Tradițional', why: 'Control distribuit.' },
    { left: 'Politică exprimată ca intenție și aplicată de un sistem central', right: 'Bazat pe controller', why: 'Controller-ul traduce intenția în configurații.' },
    { left: 'Tablou de bord unic cu starea tuturor echipamentelor', right: 'Bazat pe controller', why: 'Vizibilitate unificată.' },
    { left: 'Configurare repetată manual pe fiecare switch', right: 'Tradițional', why: 'Model device cu device.' },
  ], [
    { text: 'Doar în rețele wireless', why: 'Ambele modele se pot aplica și în rețele cu fir.' },
    { text: 'Niciun model', why: 'Fiecare caracteristică descrie un model precis.' },
  ], 'Asociază fiecare caracteristică cu modelul potrivit.'),
  match({ id: '6.2-026' }, 2, 'Potrivește fiecare etapă Catalyst Center cu activitatea ei.', [
    { left: 'Design', right: 'Definirea site-urilor și a resurselor comune (NTP, DNS, syslog)', why: 'Modelezi rețeaua.' },
    { left: 'Policy', right: 'Definirea politicilor de acces, segmentare și prioritate', why: 'Intenția de securitate și calitate.' },
    { left: 'Provision', right: 'Aplicarea configurațiilor și integrarea echipamentelor noi', why: 'Include Plug and Play.' },
    { left: 'Assurance', right: 'Monitorizarea sănătății rețelei și diagnosticarea', why: 'Telemetrie și analiză.' },
  ], [
    { text: 'Compilarea sistemului de operare al echipamentului', why: 'Nu este o etapă a controller-ului.' },
    { text: 'Împachetarea cablurilor în rack', why: 'Este activitate fizică.' },
  ], 'Design / Policy / Provision / Assurance.'),
  order({ id: '6.2-027' }, 2, 'Ordonează etapele de lucru ale unui controller de campus.', [
    { text: 'Design (site-uri, resurse comune)', why: 'Modelezi rețeaua.' },
    { text: 'Policy (intenție, segmentare)', why: 'Definești ce este permis.' },
    { text: 'Provision (aplici pe echipamente)', why: 'Aduci echipamentele în starea dorită.' },
    { text: 'Assurance (măsori și diagnostichezi)', why: 'Verifici că rețeaua respectă intenția.' },
  ], 'Design → Policy → Provision → Assurance.'),
  order({ id: '6.2-028' }, 3, 'Ordonează funcțiile unui sistem bazat pe intenție (IBN).', [
    { text: 'Translation: intenția de business devine politici de rețea', why: 'Prima funcție: traducerea.' },
    { text: 'Activation: politicile sunt aplicate automat pe echipamente', why: 'Urmează aplicarea.' },
    { text: 'Assurance: măsurarea continuă a respectării intenției', why: 'Verifici rezultatul.' },
    { text: 'Corecție/remediere la abateri', why: 'Închide bucla.' },
  ], 'Translation → Activation → Assurance → remediere.'),

  // ======================= Scenarii =======================
  single({ id: '6.2-029' }, 2, 'Trebuie creat VLAN 50 pe 120 de switch-uri. Cum diferă efortul?', [
    ['Tradițional: 120 de intervenții separate; controller: o intenție aplicată pe toate', true, 'Controller-ul multiplică acțiunea pe echipamente.'],
    ['Nu există nicio diferență', false, 'Diferența de efort este principalul argument pentru controller.'],
    ['Tradițional este mai rapid la scară mare', false, 'Efortul manual crește liniar cu numărul de echipamente.'],
    ['Controller-ul nu poate crea VLAN-uri', false, 'Poate, prin politici/șabloane.'],
  ], 'O intenție vs 120 de intervenții.'),
  single({ id: '6.2-030' }, 2, 'Un echipament este în reload în timp ce aplici o politică. Ce comportament este avantajul controller-ului?', [
    ['Marchează echipamentul „în așteptare/neconform” și îl poate reîncerca; vezi centralizat abaterea', true, 'Controller-ul păstrează intenția și starea de conformitate.'],
    ['Ignoră echipamentul pentru totdeauna', false, 'Un bun controller raportează abaterea și o remediază.'],
    ['Oprește toată rețeaua', false, 'Nu are acest comportament.'],
    ['Șterge politica de pe celelalte echipamente', false, 'Nu se comportă așa.'],
  ], 'Conformitate centralizată + reîncercare.'),
  single({ id: '6.2-031' }, 3, 'Un inginer modifică manual configurația unui switch administrat de controller. Ce risc apare?', [
    ['Drift față de intenția din controller; modificarea poate fi raportată ca abatere sau suprascrisă', true, 'Modificările în afara procesului creează diferențe între realitate și intenție.'],
    ['Controller-ul devine mai rapid', false, 'Nu are legătură cu viteza.'],
    ['Switch-ul dispare din inventar definitiv', false, 'Nu este efectul tipic.'],
    ['Nu poate apărea niciun risc', false, 'Riscul de drift există.'],
  ], 'Modificările manuale creează drift.'),
  single({ id: '6.2-032' }, 3, 'Care este diferența dintre un script de automatizare și un sistem bazat pe intenție (IBN)?', [
    ['IBN adaugă traducerea intenției și verificarea continuă, nu doar aplicarea configurației', true, 'Scriptul execută; IBN traduce, aplică și măsoară.'],
    ['Nu există diferențe', false, 'Un script nu verifică implicit rezultatul și nu traduce intenția.'],
    ['IBN nu folosește deloc configurații', false, 'Configurațiile sunt generate și aplicate de sistem.'],
    ['Scriptul este întotdeauna mai complet', false, 'IBN include funcții suplimentare (assurance).'],
  ], 'IBN = translation + activation + assurance.'),
  single({ id: '6.2-033' }, 2, 'Care verificare confirmă într-un model cu controller că politica a fost aplicată peste tot?', [
    ['Raportul de conformitate/assurance al controller-ului, completat de verificări pe echipament la nevoie', true, 'Controller-ul compară starea dorită cu cea reală.'],
    ['Faptul că GUI-ul afișează butonul „Apply”', false, 'Un buton nu dovedește aplicarea.'],
    ['Faptul că un singur switch răspunde la ping', false, 'Nu acoperă toate echipamentele sau politica.'],
    ['Nicio verificare nu este posibilă', false, 'Conformitatea este una dintre funcțiile centrale.'],
  ], 'Verificarea centrală este un avantaj-cheie.'),

  // ======================= CLI =======================
  cli({ id: '6.2-034' }, 1, 'În global configuration mode: creează VLAN-ul 50.', 'SW1(config)#', 'vlan 50', ['vlan 50'], [
    { text: 'vlan add 50', why: 'Nu există cuvântul add în această comandă.' },
    { text: 'create vlan 50', why: 'Nu este sintaxa IOS.' },
    { text: 'interface vlan 50', why: 'Creează interfața SVI, nu VLAN-ul în baza de date VLAN.' },
  ], 'vlan <id> intră în modul config-vlan.', 'vlan …'),
  cli({ id: '6.2-035' }, 1, 'În modul config-vlan: dă VLAN-ului numele IoT.', 'SW1(config-vlan)#', 'name IoT', ['name IoT'], [
    { text: 'vlan name IoT', why: 'În modul config-vlan comanda este doar name.' },
    { text: 'description IoT', why: 'description se folosește pe interfețe, nu pentru numele VLAN-ului.' },
    { text: 'name = IoT', why: 'Sintaxa nu folosește semnul egal.' },
  ], 'name <nume> în config-vlan.', 'name …'),
  cli({ id: '6.2-036' }, 1, 'În global configuration mode: sincronizează ceasul cu serverul NTP 10.0.0.5.', 'SW1(config)#', 'ntp server 10.0.0.5', ['ntp server 10.0.0.5'], [
    { text: 'ntp 10.0.0.5', why: 'Lipsește cuvântul-cheie server.' },
    { text: 'clock server 10.0.0.5', why: 'Nu este comanda NTP.' },
    { text: 'ntp master 10.0.0.5', why: 'ntp master transformă dispozitivul în sursă de timp, nu client.' },
  ], 'ntp server <adresă>.', 'ntp server …'),
  cli({ id: '6.2-037' }, 2, 'În global configuration mode: trimite mesajele syslog către serverul 10.0.0.6.', 'SW1(config)#', 'logging host 10.0.0.6', ['logging host 10.0.0.6', 'logging 10.0.0.6'], [
    { text: 'syslog server 10.0.0.6', why: 'Nu este sintaxa IOS.' },
    { text: 'logging server 10.0.0.6', why: 'Cuvântul este host (sau direct adresa), nu server.' },
    { text: 'snmp-server host 10.0.0.6', why: 'Aceasta trimite notificări SNMP, nu mesaje syslog.' },
  ], 'logging host <adresă>.', 'logging …'),
  cli({ id: '6.2-038' }, 2, 'În global configuration mode: creează comunitatea SNMP de citire „CitesteDoar” (read-only).', 'SW1(config)#', 'snmp-server community CitesteDoar RO', ['snmp-server community CitesteDoar RO', 'snmp-server community CitesteDoar ro'], [
    { text: 'snmp-server community CitesteDoar RW', why: 'RW permite și scriere; cerința era read-only.' },
    { text: 'snmp community CitesteDoar RO', why: 'Comanda începe cu snmp-server.' },
    { text: 'snmp-server CitesteDoar RO', why: 'Lipsește cuvântul community.' },
  ], 'snmp-server community <șir> RO.', 'snmp-server community …'),

  // ======================= Recunoaștere finală =======================
  single({ id: '6.2-039' }, 2, 'Care dintre următoarele este un exemplu de controller în domeniul wireless?', [
    ['WLC (Wireless LAN Controller), care administrează AP-urile prin CAPWAP', true, 'Un WLC centralizează configurarea și gestionarea AP-urilor lightweight.'],
    ['Un hub Ethernet', false, 'Un hub repetă semnal; nu administrează nimic.'],
    ['Un cablu patch', false, 'Nu are funcții de control.'],
    ['Un server DHCP, exclusiv', false, 'DHCP atribuie adrese; nu administrează AP-urile.'],
  ], 'WLC = controller pentru AP-uri.'),
  single({ id: '6.2-040' }, 2, 'Care dintre afirmații descrie corect un model „hibrid” frecvent în practică?', [
    ['O parte a rețelei este administrată de un controller, iar alte echipamente rămân clasice, administrate cu CLI/scripturi', true, 'Majoritatea rețelelor reale amestecă ambele moduri.'],
    ['Toate echipamentele trebuie înlocuite într-o singură zi', false, 'Migrarea este de obicei graduală.'],
    ['Controller-ul interzice orice acces CLI', false, 'CLI rămâne disponibil pentru depanare.'],
    ['Hibridul nu există', false, 'Este foarte frecvent.'],
  ], 'Hibrid = amestec controller + clasic.'),
];
