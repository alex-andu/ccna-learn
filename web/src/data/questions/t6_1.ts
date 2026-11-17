import type { Question } from '../../lib/types';

// Banca de întrebări pentru 6.1 Explain how automation impacts network management.
// Obiectivul oficial nu are sub-puncte; `sub` = '6.1'. Fiecare variantă are explicație (why).
const T = '6.1';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_6_1: Question[] = [
  // ======================= Concepte de bază =======================
  single({ id: '6.1-001' }, 1, 'Care este cea mai bună descriere a automatizării rețelei?', [
    ['Folosirea software-ului pentru a configura, verifica și întreține echipamentele după reguli scrise o singură dată', true, 'Aceasta este ideea centrală: intenția se descrie o dată, iar un sistem o aplică și o verifică pe toate echipamentele.'],
    ['Înlocuirea tuturor echipamentelor cu dispozitive wireless', false, 'Tipul echipamentelor nu are legătură cu automatizarea; ea privește modul de administrare.'],
    ['Eliminarea protocoalelor de rutare din rețea', false, 'Automatizarea configurează protocoalele (OSPF etc.), nu le elimină.'],
    ['Folosirea exclusivă a consolei locale pentru siguranță', false, 'Consola locală este exact modelul manual pe care automatizarea îl înlocuiește.'],
  ], 'Automatizare = intenție descrisă o dată, aplicată și verificată de software.'),
  single({ id: '6.1-002' }, 1, 'Ce arată obiectivul 6.1 din blueprint-ul CCNA 200-301 v1.1?', [
    ['Cum schimbă automatizarea managementul rețelei (explicație conceptuală)', true, 'Obiectivul 6.1 este „Explain how automation impacts network management”.'],
    ['Cum scrii un program Python complet pentru rețea', false, 'Examenul nu cere să programezi; cere să înțelegi efectele și piesele automatizării.'],
    ['Cum configurezi OSPF multi-area', false, 'OSPF ține de domeniul 3, nu de 6.1.'],
    ['Cum configurezi WPA3 în GUI', false, 'Securitatea wireless ține de domeniul 5.'],
  ], '6.1 este conceptual: „Explain”, nu „Configure”.'),
  single({ id: '6.1-003' }, 1, 'Care afirmație despre rolul inginerului de rețea într-o rețea automatizată este corectă?', [
    ['Rolul se mută de la tastarea repetitivă la proiectare, validare și supraveghere', true, 'Cunoașterea rețelelor rămâne esențială; se schimbă ce faci zilnic.'],
    ['Inginerul devine inutil, pentru că scripturile știu tot', false, 'Scripturile execută ce le spui; cineva trebuie să definească intenția corect și să valideze.'],
    ['Inginerul nu mai trebuie să înțeleagă protocoalele', false, 'Fără înțelegerea protocoalelor nu poți scrie intenția corectă sau depana.'],
    ['Inginerul trebuie să tasteze și mai multe comenzi', false, 'Scopul automatizării este reducerea tastării repetitive.'],
  ], 'Rolul se schimbă, nu dispare.'),

  // ======================= Problema =======================
  single({ id: '6.1-004' }, 1, 'Care este problema principală a managementului manual, device cu device, într-o rețea mare?', [
    ['Timpul și riscul de greșeli cresc odată cu numărul de echipamente și de repetiții', true, 'Repetiția manuală este lentă și, statistic, produce greșeli și inconsistențe.'],
    ['Comenzile CLI nu pot configura VLAN-uri', false, 'CLI poate configura aproape orice; problema este scara.'],
    ['Echipamentele nu acceptă SSH', false, 'Majoritatea acceptă SSH; nu aceasta este problema.'],
    ['Nu se pot salva configurațiile', false, 'Se pot salva (copy running-config startup-config).'],
  ], 'Scara + repetiția = lent și predispus la erori.'),
  single({ id: '6.1-005' }, 2, 'Ce este deriva de configurație (configuration drift)?', [
    ['Diferența apărută în timp între configurația dorită și cea reală de pe echipamente', true, 'Exact: realitatea se „îndepărtează” de standard.'],
    ['Creșterea numărului de echipamente din rețea', false, 'Aceasta este creșterea rețelei, nu drift.'],
    ['Pierderea pachetelor pe o legătură', false, 'Aceasta este o problemă de performanță a legăturii.'],
    ['Migrarea unui VLAN pe alt switch', false, 'Aceasta este o modificare planificată, nu o abatere.'],
  ], 'Drift = configurație reală ≠ configurație dorită.'),
  single({ id: '6.1-006' }, 2, 'Care este cauza tipică a deriva de configurație?', [
    ['Modificări manuale pe echipament, netrecute în sursa de adevăr', true, 'O modificare „de urgență” rămâne doar pe acel echipament și îl face diferit de restul.'],
    ['Folosirea unui șablon unic pentru toate echipamentele', false, 'Șablonul reduce deriva, nu o creează.'],
    ['Existența unei surse de adevăr în Git', false, 'Sursa de adevăr este remediul, nu cauza.'],
    ['Verificările automate periodice', false, 'Acestea detectează deriva, nu o produc.'],
  ], 'Modificările manuale necontrolate produc drift.'),
  single({ id: '6.1-007' }, 2, 'O schimbare durează 6 minute pe echipament. Cât durează aproximativ pentru 200 de echipamente, manual și secvențial?', [
    ['Aproximativ 20 de ore', true, '200 × 6 min = 1200 min = 20 h, fără pauze, fără greșeli de corectat.'],
    ['Aproximativ 2 ore', false, '200 × 6 min nu dă 2 ore; ai împărțit prea mult.'],
    ['Aproximativ 6 minute, pentru că se face în paralel', false, 'Manual și secvențial nu e paralel; paralelismul vine din automatizare.'],
    ['Aproximativ 200 de ore', false, '200 de ore ar însemna 60 de minute pe echipament.'],
  ], 'Timpul manual crește liniar cu numărul de echipamente.'),

  // ======================= Cum funcționează =======================
  single({ id: '6.1-008' }, 1, 'Prin ce plan al unui echipament intră, de obicei, automatizarea?', [
    ['Management plane (SSH, NETCONF, RESTCONF, API REST, SNMP)', true, 'Este planul prin care administrezi și monitorizezi echipamentul.'],
    ['Data plane', false, 'Data plane mută traficul utilizatorilor; nu este calea de administrare.'],
    ['Control plane', false, 'Control plane rulează protocoalele (OSPF, STP); nu este ușa pentru administrare.'],
    ['Planul fizic al cablurilor', false, 'Nu există un asemenea plan în terminologia standard.'],
  ], 'Automatizarea intră prin management plane.'),
  single({ id: '6.1-009' }, 2, 'Care dintre următoarele aparține control plane?', [
    ['OSPF, STP, ARP', true, 'Sunt protocoale care construiesc tabelele de rute, de comutare și de adiacențe.'],
    ['SSH și SNMP', false, 'Acestea sunt management plane.'],
    ['Forwarding-ul pachetelor prin ASIC', false, 'Acesta este data plane.'],
    ['Aplicarea unei ACL pe interfață, în hardware', false, 'Aplicarea ACL-ului la pachete este data plane.'],
  ], 'Control plane = protocoale care construiesc tabelele.'),
  single({ id: '6.1-010' }, 2, 'Ce este o sursă de adevăr (source of truth) într-un flux de automatizare?', [
    ['Locul unic unde e definită starea dorită: echipamente, variabile, politici', true, 'De obicei fișiere în Git sau o bază de inventar; rețeaua trebuie să o urmeze.'],
    ['Primul echipament configurat, care devine „master”', false, 'Un echipament nu este sursa de adevăr; tocmai deriva apare când echipamentele diferă.'],
    ['Un protocol de rutare', false, 'Protocoalele de rutare țin de control plane.'],
    ['Un server NTP', false, 'NTP sincronizează ceasul; nu stochează intenția rețelei.'],
  ], 'Sursa de adevăr = starea dorită, într-un loc unic.'),
  single({ id: '6.1-011' }, 2, 'Ce rol au șablonul și variabilele?', [
    ['Șablonul păstrează partea comună; variabilele completează valorile specifice fiecărui echipament', true, 'Așa 200 de configurații diferite vin dintr-un șablon și o listă de variabile.'],
    ['Șablonul înlocuiește protocolul SSH', false, 'Șablonul generează configurația; transportul rămâne SSH, NETCONF sau API.'],
    ['Variabilele sunt comenzi executate de router', false, 'Variabilele sunt valori de intrare pentru șablon, nu comenzi IOS.'],
    ['Șablonul se aplică doar pe un singur echipament', false, 'Scopul lui este reutilizarea pe multe echipamente.'],
  ], 'Șablon = structură comună; variabile = valorile care diferă.'),
  single({ id: '6.1-012' }, 2, 'Ce înseamnă că o operație de automatizare este idempotentă?', [
    ['Aplicată de mai multe ori, produce același rezultat ca atunci când e aplicată o singură dată', true, '„VLAN 20 să existe” rămâne un singur VLAN 20 chiar dacă rulezi de zece ori.'],
    ['Poate fi aplicată o singură dată pe viață', false, 'Idempotent nu limitează numărul de rulări; le permite fără efecte secundare.'],
    ['Se execută numai noaptea', false, 'Momentul execuției nu are legătură cu idempotența.'],
    ['Necesită întotdeauna aprobare manuală', false, 'Aprobarea e un proces, nu o proprietate a operației.'],
  ], 'Idempotent = același rezultat la repetare.'),
  single({ id: '6.1-013' }, 2, 'Care este unul dintre principalele beneficii ale automatizării rețelei?', [
    ['Consecvență: aceeași configurație, fără diferențe cauzate de tastare manuală', true, 'Un șablon și o sursă de adevăr produc configurații uniforme.'],
    ['Eliminarea oricărei posibilități de eroare', false, 'Greșelile din șablon se propagă; automatizarea schimbă tipul de risc, nu îl elimină.'],
    ['Nu mai este nevoie de securitate', false, 'Scripturile și controller-ele au acces larg și trebuie protejate.'],
    ['Echipamentele devin mai rapide la forwarding', false, 'Automatizarea nu schimbă viteza data plane-ului.'],
  ], 'Consecvență și mai puține erori umane.'),
  single({ id: '6.1-014' }, 2, 'Ce este telemetria rețelei?', [
    ['Trimiterea continuă de către echipamente a datelor măsurate către un sistem de analiză', true, 'Echipamentul trimite singur datele, de obicei structurat, permițând verificare și analiză.'],
    ['Un protocol care înlocuiește OSPF', false, 'Telemetria nu calculează rute.'],
    ['Comanda show tastată manual', false, 'Un show este interogare manuală, o singură dată; telemetria este flux automat.'],
    ['O metodă de criptare', false, 'Telemetria nu este o metodă de criptare.'],
  ], 'Telemetrie = date măsurate, trimise automat și continuu.'),
  single({ id: '6.1-015' }, 2, 'Care este riscul specific al automatizării pe care trebuie să-l gestionezi?', [
    ['O greșeală din șablon sau din inventar se propagă rapid pe multe echipamente (blast radius)', true, 'Aceeași viteză care e un beneficiu amplifică și o eroare.'],
    ['Echipamentele nu mai pot fi configurate manual deloc', false, 'Poți configura manual, dar creezi drift față de sursa de adevăr.'],
    ['Protocolul SSH încetează să funcționeze', false, 'SSH este chiar unul dintre transporturile folosite.'],
    ['Scade numărul de VLAN-uri disponibile', false, 'Numărul de VLAN-uri nu depinde de automatizare.'],
  ], 'Riscul-cheie: propagarea rapidă a erorilor.'),
  single({ id: '6.1-016' }, 2, 'Care practică reduce cel mai bine raza de impact a unei greșeli de automatizare?', [
    ['Aplicarea întâi pe un lot mic (pilot), cu verificare, apoi extinderea', true, 'Descoperi greșeala pe puține echipamente și oprești extinderea.'],
    ['Aplicarea simultană pe toate echipamentele, fără verificare', false, 'Maximizează raza de impact.'],
    ['Dezactivarea jurnalelor', false, 'Fără jurnale nu poți investiga ce s-a întâmplat.'],
    ['Folosirea unei singure parole pentru toate echipamentele, partajată în echipă', false, 'Este o slăbiciune de securitate și nu limitează impactul unei greșeli.'],
  ], 'Pilot + verificare + rollback.'),
  single({ id: '6.1-017' }, 2, 'Ce face Zero-Touch Provisioning (ZTP)?', [
    ['Permite unui echipament nou să se configureze singur la prima pornire, fără acces manual prin console', true, 'Obține IP, descoperă serverul de configurare și aplică configurația/imaginea potrivite.'],
    ['Dezactivează automat toate porturile neutilizate', false, 'Aceasta este o practică de hardening, nu ZTP.'],
    ['Convertește IPv4 în IPv6', false, 'Aceasta este tranziția IPv6, nu ZTP.'],
    ['Face backup la configurație în fiecare noapte', false, 'Backup-ul este o altă sarcină de automatizare.'],
  ], 'ZTP = autoconfigurare la prima pornire.'),
  single({ id: '6.1-018' }, 2, 'De ce se folosește un cont dedicat pentru automatizare (de exemplu „automation”) în loc de contul unui om?', [
    ['Poate fi urmărit în log-uri, limitat ca privilegii și rotit fără a afecta oameni', true, 'Separarea face acțiunile automate vizibile și controlabile.'],
    ['Pentru că echipamentele nu acceptă conturi de oameni prin SSH', false, 'Acceptă; este o bună practică, nu o limitare tehnică.'],
    ['Pentru că parola unui cont dedicat poate fi goală', false, 'Parola trebuie să fie puternică, nu goală.'],
    ['Pentru că așa se evită orice autentificare', false, 'Autentificarea rămâne necesară.'],
  ], 'Cont dedicat = trasabilitate și control.'),
  single({ id: '6.1-019' }, 2, 'De ce nu se scriu credențialele direct în scripturi sau în Git?', [
    ['Oricine are acces la cod sau la istoric le poate vedea și folosi', true, 'Folosește variabile de mediu sau un seif de secrete.'],
    ['Pentru că Python nu acceptă șiruri de caractere', false, 'Nu este o limitare de limbaj; este o problemă de securitate.'],
    ['Pentru că scripturile rulează mai lent', false, 'Viteza nu e afectată.'],
    ['Pentru că Git nu poate stoca text', false, 'Git stochează text; tocmai de aceea secretele ar rămâne în istoric.'],
  ], 'Secretele nu intră în cod/Git.'),
  single({ id: '6.1-020' }, 2, 'Care avantaj au interfețele programatice (NETCONF/RESTCONF/REST) față de „tastatul” comenzilor prin SSH?', [
    ['Returnează date structurate, mai ușor și mai sigur de interpretat de un program', true, 'Output-ul CLI este text greu de parsat; datele structurate (XML/JSON) sunt previzibile.'],
    ['Nu necesită niciun fel de autentificare', false, 'Necesită autentificare și transport securizat.'],
    ['Funcționează doar pe echipamente vechi', false, 'Sunt tocmai interfețele moderne.'],
    ['Înlocuiesc nevoia de rețea între stația de automatizare și echipament', false, 'Stația trebuie în continuare să ajungă la echipament prin rețea.'],
  ], 'Date structurate → automatizare mai fiabilă.'),
  single({ id: '6.1-021' }, 3, 'Care afirmație despre automatizare și controller-e (SDN) este corectă?', [
    ['Poți automatiza și o rețea tradițională, cu scripturi și instrumente, fără un controller SDN', true, 'Controller-ul este un mod integrat de automatizare, nu singurul.'],
    ['Automatizarea este posibilă doar cu un controller SDN', false, 'Scripturile SSH/Ansible funcționează și pe rețele clasice.'],
    ['Un controller SDN face inutile protocoalele de rutare în toate cazurile', false, 'Depinde de arhitectură (6.3); protocoalele nu dispar automat.'],
    ['Automatizarea schimbă formatul cadrelor Ethernet', false, 'Nu afectează formatul cadrelor.'],
  ], 'Automatizare ≠ neapărat controller SDN.'),

  // ======================= Multi =======================
  multi({ id: '6.1-022' }, 2, 'Care sunt beneficii ale automatizării rețelei? (alege toate variantele corecte)', [
    ['Consecvența configurațiilor', true, 'Șablonul produce configurații uniforme.'],
    ['Scăderea erorilor umane repetitive', true, 'Se elimină copy-paste-ul și tastarea repetitivă.'],
    ['Audit și conformitate mai ușoare', true, 'Starea dorită e scrisă și poate fi comparată automat cu realitatea.'],
    ['Eliminarea oricărui risc de configurație greșită', false, 'Riscul rămâne și se propagă mai rapid dacă șablonul e greșit.'],
  ], 'Consecvență, mai puține erori, audit — nu „zero risc”.'),
  multi({ id: '6.1-023' }, 2, 'Care sunt riscuri sau provocări ale automatizării? (alege toate variantele corecte)', [
    ['Raza mare de impact a unei greșeli', true, 'O eroare ajunge repede pe multe echipamente.'],
    ['Nevoia de abilități noi (Git, API-uri, YAML/JSON)', true, 'Echipa trebuie să învețe instrumente noi.'],
    ['Protejarea credențialelor și tokenurilor folosite de automatizare', true, 'Instrumentele au acces larg; secretele lor trebuie păstrate sigur.'],
    ['Imposibilitatea de a verifica rezultatul', false, 'Verificarea automată este tocmai una dintre piesele fluxului.'],
  ], 'Blast radius, abilități, securitatea secretelor.'),
  multi({ id: '6.1-024' }, 3, 'Care sunt piese ale unui flux de automatizare bine făcut? (alege toate variantele corecte)', [
    ['Sursă de adevăr (inventar + variabile)', true, 'Definește ce trebuie să existe.'],
    ['Validare înainte de aplicare', true, 'Prinde greșelile înainte să ajungă pe echipamente.'],
    ['Verificare după aplicare și posibilitate de rollback', true, 'Confirmă rezultatul și permite revenirea.'],
    ['Modificări manuale directe, nedocumentate, pe echipamente „de urgență”', false, 'Acestea creează drift și contrazic fluxul controlat.'],
  ], 'Intenție, validare, verificare, rollback.'),

  // ======================= Match / Order =======================
  match({ id: '6.1-025' }, 2, 'Potrivește termenul cu definiția lui.', [
    { left: 'Configuration drift', right: 'Abaterea configurației reale față de cea dorită', why: 'Apare prin modificări manuale necontrolate.' },
    { left: 'Idempotent', right: 'Același rezultat indiferent de câte ori rulezi operația', why: 'Proprietate căutată la instrumentele declarative.' },
    { left: 'Zero-Touch Provisioning', right: 'Autoconfigurarea unui echipament nou la prima pornire', why: 'Fără acces manual prin console.' },
    { left: 'Telemetry', right: 'Date măsurate trimise automat și continuu de echipamente', why: 'Baza verificării automate și a analizei.' },
  ], [
    { text: 'Protocol care calculează rute între routere', why: 'Aceasta este un protocol de rutare (control plane).' },
    { text: 'Metodă de criptare a traficului între sedii', why: 'Aceasta este VPN/IPsec, nu un termen de automatizare.' },
  ], 'Fiecare termen are un sens precis în automatizare.'),
  match({ id: '6.1-026' }, 2, 'Potrivește planul cu un exemplu reprezentativ.', [
    { left: 'Management plane', right: 'SSH, SNMP, NETCONF, API REST', why: 'Căi de administrare și monitorizare; automatizarea intră pe aici.' },
    { left: 'Control plane', right: 'OSPF, STP, ARP', why: 'Protocoale care construiesc tabelele.' },
    { left: 'Data plane', right: 'Forwarding-ul efectiv al pachetelor și aplicarea ACL/NAT/QoS', why: 'Execută decizia luată de control plane.' },
  ], [
    { text: 'Doar cablurile și porturile fizice', why: 'Nu este un plan; stratul fizic este altă noțiune.' },
    { text: 'Doar interfața grafică a unui controller', why: 'Interfața grafică folosește management plane; nu definește un plan.' },
  ], 'Management / control / data.'),
  order({ id: '6.1-027' }, 2, 'Ordonează etapele unui flux de automatizare.', [
    { text: 'Intent / sursa de adevăr (inventar și variabile)', why: 'Definești ce trebuie să existe.' },
    { text: 'Randarea șablonului în configurații', why: 'Combini șablonul cu variabilele.' },
    { text: 'Validare înainte de aplicare (sintaxă, diff)', why: 'Prinzi greșelile înainte să ajungă pe echipamente.' },
    { text: 'Aplicarea configurației (întâi un lot pilot)', why: 'Transmiți prin SSH/NETCONF/API.' },
    { text: 'Verificare după aplicare și, la nevoie, rollback', why: 'Confirmi că intenția a fost atinsă sau revii.' },
  ], 'Intent → randare → validare → aplicare → verificare/rollback.'),
  order({ id: '6.1-028' }, 3, 'Ordonează pașii unei implementări sigure a unei modificări pe 100 de switch-uri.', [
    { text: 'Randezi configurația și faci un diff față de starea curentă', why: 'Vezi exact ce se va schimba.' },
    { text: 'Aplici pe un switch pilot', why: 'Limitezi raza de impact.' },
    { text: 'Verifici automat pilotul (vecini, NTP, ping)', why: 'Confirmi că funcționează înainte să extinzi.' },
    { text: 'Extinzi pe restul în loturi, cu verificare', why: 'Continui doar dacă verificările trec.' },
    { text: 'Salvezi configurațiile și faci verificarea finală a conformității', why: 'running-config devine startup-config și confirmi starea dorită.' },
  ], 'Diff → pilot → verificare → loturi → salvare + audit.'),

  // ======================= Scenarii =======================
  single({ id: '6.1-029' }, 2, 'Un audit automat arată că SW3 are alt server NTP decât inventarul. Ce înseamnă și ce faci?', [
    ['Este drift: fie readuci SW3 la standard, fie treci schimbarea legitimă în sursa de adevăr', true, 'Altfel următoarea rulare o va suprascrie sau deriva va continua.'],
    ['Este normal; automatizarea nu verifică niciodată realitatea', false, 'Verificarea realității față de intenție este parte din flux.'],
    ['Este o defecțiune hardware a switch-ului', false, 'Configurația diferită nu indică defecțiune hardware.'],
    ['Trebuie să dezactivezi NTP pe toate switch-urile', false, 'Nu rezolvă problema și ar degrada log-urile și securitatea.'],
  ], 'Drift detectat → corectezi echipamentul sau actualizezi intenția.'),
  single({ id: '6.1-030' }, 2, 'Un script a rulat fără erori și a trimis comenzile. Ce poți afirma cu certitudine?', [
    ['Doar că a trimis comenzile; rezultatul trebuie confirmat printr-o verificare separată', true, 'Lipsa erorilor de transport nu dovedește că starea dorită a fost atinsă.'],
    ['Că rețeaua este în starea dorită pe toate echipamentele', false, 'Fără verificare poți avea comenzi acceptate dar efecte neașteptate.'],
    ['Că configurația a fost salvată în startup-config', false, 'Salvarea este un pas separat (copy run start sau echivalent).'],
    ['Că nu există drift', false, 'Drift-ul se detectează comparând starea reală cu intenția.'],
  ], 'Execuție fără eroare ≠ rezultat verificat.'),
  single({ id: '6.1-031' }, 3, 'După aplicarea automată a unei modificări, un reload accidental face ca echipamentele să revină la configurația veche. Care pas a lipsit?', [
    ['Salvarea running-config în startup-config', true, 'Configurația din running-config nu supraviețuiește unui reload dacă nu e salvată.'],
    ['Activarea RIP', false, 'RIP este un protocol de rutare; nu are legătură cu persistența configurației.'],
    ['Creșterea MTU-ului', false, 'MTU nu influențează persistența.'],
    ['Dezactivarea SSH', false, 'SSH nu este cauza.'],
  ], 'Verifică și salvarea, nu doar aplicarea.'),
  single({ id: '6.1-032' }, 3, 'Ce deosebește automatizarea cu buclă închisă (closed-loop) de simpla trimitere de configurații?', [
    ['Folosește telemetria pentru a detecta abateri și a reacționa, nu doar pentru a împinge configurația', true, 'Măsoară, compară cu intenția și remediază (automat sau cu aprobare).'],
    ['Nu folosește deloc configurații', false, 'Configurațiile rămân mecanismul prin care se aplică intenția.'],
    ['Funcționează doar pe echipamente fără IP', false, 'Nu are nicio legătură cu lipsa adreselor IP.'],
    ['Elimină complet orice supraveghere umană, în orice situație', false, 'De obicei începe cu aprobare umană; autonomia completă se introduce treptat.'],
  ], 'Closed loop = aplic + măsor + corectez.'),
  single({ id: '6.1-033' }, 2, 'Care verificare dovedește cel mai bine că intenția „toate switch-urile sunt sincronizate cu serverul NTP” a fost atinsă?', [
    ['O verificare a stării funcționale (de exemplu show ntp status: ceasul e sincronizat cu serverul dorit)', true, 'Confirmă rezultatul, nu doar prezența comenzii în configurație.'],
    ['Faptul că linia ntp server există în fișierul șablon', false, 'Șablonul nu arată ce rulează efectiv pe echipament.'],
    ['Faptul că scriptul a terminat rapid', false, 'Viteza execuției nu dovedește rezultatul.'],
    ['Faptul că echipamentul răspunde la ping', false, 'Ping-ul arată doar conectivitate, nu sincronizarea NTP.'],
  ], 'Verifică starea funcțională.'),

  // ======================= CLI =======================
  cli({ id: '6.1-034' }, 1, 'În global configuration mode: forțează SSH versiunea 2 pentru accesul de automatizare.', 'SW1(config)#', 'ip ssh version 2', ['ip ssh version 2'], [
    { text: 'ssh version 2', why: 'Comanda corectă începe cu ip ssh.' },
    { text: 'ip ssh v2', why: 'Cuvântul-cheie este version, urmat de numărul 2.' },
    { text: 'crypto ssh version 2', why: 'Nu este sintaxa IOS pentru versiunea SSH.' },
  ], 'ip ssh version 2.', 'ip ssh …'),
  cli({ id: '6.1-035' }, 2, 'În global configuration mode: generează o cheie RSA de 2048 de biți (necesară pentru SSH).', 'SW1(config)#', 'crypto key generate rsa modulus 2048', ['crypto key generate rsa modulus 2048'], [
    { text: 'crypto key generate rsa 2048', why: 'Lipsește cuvântul modulus înainte de lungime.' },
    { text: 'ip ssh generate rsa modulus 2048', why: 'Cheia se generează cu crypto key generate, nu cu ip ssh.' },
    { text: 'crypto key rsa generate modulus 2048', why: 'Ordinea cuvintelor este greșită: crypto key generate rsa.' },
  ], 'crypto key generate rsa modulus <biți>.', 'crypto key generate …'),
  cli({ id: '6.1-036' }, 2, 'În global configuration mode: creează utilizatorul „automation”, cu privilegiul 15 și parola (secret) ParolaLunga-2026.', 'SW1(config)#', 'username automation privilege 15 secret ParolaLunga-2026', ['username automation privilege 15 secret ParolaLunga-2026', 'username automation privilege 15 secret 0 ParolaLunga-2026'], [
    { text: 'username automation privilege 15 password ParolaLunga-2026', why: 'password stochează parola mai slab (de obicei reversibil); pentru un cont de automatizare folosește secret.' },
    { text: 'user automation privilege 15 secret ParolaLunga-2026', why: 'Cuvântul-cheie este username, nu user.' },
    { text: 'username automation secret ParolaLunga-2026 privilege 15', why: 'Opțiunea privilege se așază înaintea cuvântului secret.' },
  ], 'username <nume> privilege <nivel> secret <parolă>.', 'username … privilege … secret …'),
  cli({ id: '6.1-037' }, 2, 'În global configuration mode pe un switch IOS XE: activează interfața NETCONF.', 'SW1(config)#', 'netconf-yang', ['netconf-yang'], [
    { text: 'netconf enable', why: 'Nu este sintaxa IOS XE.' },
    { text: 'ip netconf', why: 'Comanda nu există sub această formă.' },
    { text: 'restconf', why: 'Activează RESTCONF (HTTPS), nu NETCONF (SSH).' },
  ], 'netconf-yang pornește NETCONF pe IOS XE.', 'netconf-…'),
  cli({ id: '6.1-038' }, 1, 'În privileged EXEC: verifică dacă SSH este activ și ce versiune rulează.', 'SW1#', 'show ip ssh', ['show ip ssh'], [
    { text: 'show ssh', why: 'show ssh afișează sesiunile SSH active, nu starea serviciului și versiunea.' },
    { text: 'show ip ssh version', why: 'Nu are opțiunea version.' },
    { text: 'show crypto ssh', why: 'Nu este comanda pentru starea SSH.' },
  ], 'show ip ssh arată versiunea și starea SSH.', 'show ip …'),

  // ======================= Recunoaștere finală =======================
  single({ id: '6.1-039' }, 3, 'Un șablon folosește {{ syslog_srv }}, dar inventarul definește syslog_server. Ce rezultat este de așteptat dacă nu există validare?', [
    ['Configurația generată conține o valoare goală sau instrumentul eșuează, iar greșeala poate ajunge pe echipamente', true, 'De aceea validarea înainte (variabile lipsă, sintaxă) este esențială.'],
    ['Echipamentele ghicesc corect adresa serverului syslog', false, 'Nu există o asemenea inferență.'],
    ['Șablonul își corectează singur numele variabilei', false, 'Nu are acest comportament.'],
    ['Problema dispare deoarece SSH folosește criptare', false, 'Criptarea transportului nu corectează nume de variabile.'],
  ], 'Validarea prinde variabilele lipsă.'),
  single({ id: '6.1-040' }, 2, 'Care afirmație despre infrastructure as code (IaC) este corectă?', [
    ['Configurația este scrisă în fișiere care pot fi versionate, revizuite și executate repetabil', true, 'Aceasta este ideea esențială; permite reproductibilitate și istoric.'],
    ['Înseamnă să tastezi comenzile mai repede pe consolă', false, 'IaC înseamnă fișiere declarative/versionate, nu tastare mai rapidă.'],
    ['Înseamnă că nu mai există echipamente fizice', false, 'Se aplică și pe echipamente fizice, nu doar virtuale.'],
    ['Se poate folosi doar pentru servere, nu și pentru rețea', false, 'Se aplică și pentru rețea (de exemplu Ansible, Terraform).'],
  ], 'IaC = infrastructura ca fișiere versionate.'),
];
