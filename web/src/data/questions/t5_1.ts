import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.1 Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques).
// Obiectivul oficial nu are sub-puncte; `sub` = '5.1'. Fiecare variantă are explicație (why).
const T = '5.1';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_1: Question[] = [
  // ======================= Vocabular =======================
  single({ id: '5.1-001' }, 1, 'Ce reprezintă literele CIA în securitatea informației?', [
    ['Confidentiality, Integrity, Availability', true, 'Cele trei proprietăți de protejat: confidențialitate, integritate, disponibilitate.'],
    ['Control, Inspection, Audit', false, 'Nu este semnificația acronimului CIA în securitate.'],
    ['Cryptography, Identity, Authorization', false, 'Sunt concepte din securitate, dar nu formează triada CIA.'],
    ['Confidentiality, Isolation, Accounting', false, 'Isolation și Accounting nu fac parte din triadă.'],
  ], 'CIA = Confidentiality, Integrity, Availability.'),
  single({ id: '5.1-002' }, 1, 'Cum se numește o slăbiciune într-un sistem, proces sau om, care poate fi folosită de un atacator?', [
    ['Vulnerability (vulnerabilitate)', true, 'Vulnerabilitatea este slăbiciunea în sine, indiferent dacă cineva a folosit-o.'],
    ['Threat (amenințare)', false, 'Amenințarea este cineva/ceva care poate produce daune, nu slăbiciunea.'],
    ['Exploit', false, 'Exploit-ul este metoda sau codul care folosește slăbiciunea.'],
    ['Mitigation (mitigare)', false, 'Mitigarea este măsura care reduce riscul.'],
  ], 'Vulnerability = slăbiciune.'),
  single({ id: '5.1-003' }, 1, 'Un atacator extern care scanează Internetul în căutarea serverelor nepatch-uite este un exemplu de:', [
    ['Threat (amenințare)', true, 'Amenințarea este actorul (sau evenimentul) cu potențial de a produce daune.'],
    ['Vulnerability', false, 'Vulnerabilitatea este slăbiciunea din server, nu atacatorul.'],
    ['Asset', false, 'Asset-ul este ce se protejează.'],
    ['Mitigation', false, 'Mitigarea ar fi, de exemplu, patch-ul.'],
  ], 'Threat = cine/ce poate face rău.'),
  single({ id: '5.1-004' }, 2, 'Ce este un exploit?', [
    ['O metodă sau un cod care folosește o vulnerabilitate pentru a obține un efect nedorit', true, 'Exploit-ul face legătura între slăbiciune și atac.'],
    ['O eroare de configurare', false, 'Aceasta este o vulnerabilitate (de configurare).'],
    ['O măsură de protecție', false, 'Aceasta este o mitigare.'],
    ['Persoana care atacă', false, 'Aceasta este o amenințare (threat actor).'],
  ], 'Exploit = unealta/tehnica.'),
  single({ id: '5.1-005' }, 2, 'Cum se definește, în esență, riscul în securitate?', [
    ['Probabilitatea ca o amenințare să exploateze o vulnerabilitate, înmulțită cu impactul', true, 'Riscul combină probabilitatea și consecințele.'],
    ['Existența unei parole slabe', false, 'Aceasta este doar o vulnerabilitate.'],
    ['Numărul de atacatori din Internet', false, 'Este doar o parte (amenințarea), nu riscul.'],
    ['Costul unui firewall', false, 'Costul controlului nu este riscul.'],
  ], 'Risc = probabilitate × impact.'),
  match({ id: '5.1-006' }, 2, 'Potrivește termenul cu definiția lui.', [
    { left: 'Asset', right: 'Ce are valoare și trebuie protejat (date, server, reputație)', why: 'Asset-ul e ținta protecției.' },
    { left: 'Vulnerability', right: 'O slăbiciune care poate fi folosită', why: 'De exemplu o parolă implicită sau un software nepatch-uit.' },
    { left: 'Threat', right: 'Cineva sau ceva cu potențialul de a face rău', why: 'De exemplu un atacator, un malware sau un incendiu.' },
    { left: 'Exploit', right: 'Metoda/codul care folosește slăbiciunea', why: 'Leagă amenințarea de vulnerabilitate.' },
    { left: 'Mitigation', right: 'Măsura care reduce riscul', why: 'De exemplu patch, firewall sau MFA.' },
  ], [
    { text: 'Raportul dintre cost și beneficiu', why: 'Nu definește niciunul dintre termeni.' },
  ], 'Asset, vulnerability, threat, exploit, mitigation.'),

  // ======================= Atacuri =======================
  single({ id: '5.1-007' }, 2, 'Care este diferența principală dintre un virus și un worm?', [
    ['Virusul are nevoie de o acțiune a utilizatorului (rularea fișierului gazdă), wormul se răspândește singur prin rețea', true, 'Wormul exploatează vulnerabilități și se propagă automat.'],
    ['Virusul se răspândește singur, wormul nu', false, 'Este exact invers.'],
    ['Wormul funcționează doar pe switch-uri', false, 'Wormul rulează pe gazde, nu pe switch-uri.'],
    ['Nu există nicio diferență', false, 'Diferența de propagare este esențială.'],
  ], 'Virus = acțiune utilizator; worm = auto-propagare.'),
  single({ id: '5.1-008' }, 2, 'Un e-mail de phishing personalizat, trimis către directorul general al unei companii, se numește:', [
    ['Whaling', true, 'Spear phishing orientat spre conducerea de top (balene).'],
    ['Smishing', false, 'Smishing folosește SMS.'],
    ['Vishing', false, 'Vishing folosește apeluri vocale.'],
    ['Phishing generic', false, 'Phishing-ul generic nu este personalizat pentru o țintă.'],
  ], 'Whaling = spear phishing către conducere.'),
  single({ id: '5.1-009' }, 2, 'De ce este dificil să oprești un atac DDoS blocând o singură adresă IP?', [
    ['Pentru că traficul vine din multe surse (de obicei un botnet)', true, 'Distribuirea sursei este chiar ideea DDoS.'],
    ['Pentru că DDoS folosește doar adrese private', false, 'Nu este caracteristică DDoS.'],
    ['Pentru că DDoS nu folosește IP', false, 'DDoS folosește IP, ca orice trafic Internet.'],
    ['Pentru că routerele nu pot filtra după IP', false, 'Pot filtra; problema este numărul mare de surse.'],
  ], 'DDoS = distribuit.'),
  single({ id: '5.1-010' }, 3, 'Într-un atac de reflecție cu amplificare, atacatorul:', [
    ['Falsifică adresa sursă (a victimei) și folosește servere care răspund cu mult mai mult trafic spre victimă', true, 'Reflecție = răspunsuri către victimă; amplificare = răspuns mai mare ca cererea.'],
    ['Interceptează traficul între victimă și server', false, 'Aceasta este man-in-the-middle.'],
    ['Ghicește parola unui cont', false, 'Aceasta este un atac la parole.'],
    ['Convinge utilizatorul să deschidă un atașament', false, 'Aceasta este social engineering/malware.'],
  ], 'Reflecție + amplificare = spoofing + răspunsuri mari.'),
  single({ id: '5.1-011' }, 2, 'Un ransomware care criptează fișierele unui server lovește în principal care proprietate din CIA?', [
    ['Disponibilitatea (datele devin inaccesibile)', true, 'Fără decriptare, datele nu pot fi folosite; poate afecta și confidențialitatea dacă datele sunt exfiltrate.'],
    ['Doar confidențialitatea', false, 'Efectul principal este lipsa accesului, deci disponibilitatea.'],
    ['Niciuna', false, 'Ransomware afectează cel puțin disponibilitatea.'],
    ['Doar autenticitatea semnăturii digitale', false, 'Nu este vorba despre semnături digitale.'],
  ], 'Ransomware = disponibilitate (și adesea confidențialitate).'),
  single({ id: '5.1-012' }, 2, 'Ce este un zero-day?', [
    ['O vulnerabilitate exploatată înainte să existe un patch al producătorului', true, 'Apărătorii au „zero zile” de pregătire.'],
    ['O vulnerabilitate care apare doar în prima zi de utilizare', false, 'Nu are legătură cu prima zi de utilizare.'],
    ['Un atac care durează zero secunde', false, 'Numele se referă la timpul disponibil pentru patch.'],
    ['Un tip de parolă implicită', false, 'Nu este legat de parole.'],
  ], 'Zero-day = fără patch încă.'),
  single({ id: '5.1-013' }, 2, 'Care dintre acestea este o vulnerabilitate de configurare?', [
    ['Parola implicită a unui switch nemodificată', true, 'Slăbiciune introdusă prin configurare, nu prin cod.'],
    ['O eroare de memorie în sistemul de operare', false, 'Aceasta este o vulnerabilitate de software.'],
    ['Un atacator care scanează porturi', false, 'Aceasta este o amenințare/activitate.'],
    ['Un patch publicat de producător', false, 'Patch-ul este o remediere.'],
  ], 'Configurare: parole implicite, servicii inutile.'),
  single({ id: '5.1-014' }, 2, 'Care este scopul patch management?', [
    ['Aplicarea regulată și rapidă a actualizărilor care corectează vulnerabilități cunoscute', true, 'Reduce fereastra în care un exploit public funcționează.'],
    ['Eliminarea tuturor amenințărilor', false, 'Amenințările nu pot fi eliminate prin patch-uri.'],
    ['Creșterea vitezei interfețelor', false, 'Nu este scopul principal.'],
    ['Criptarea traficului', false, 'Aceasta este rolul criptării (TLS/IPsec).'],
  ], 'Patch = elimină vulnerabilitatea cunoscută.'),

  // ======================= Mitigare =======================
  single({ id: '5.1-015' }, 1, 'Ce înseamnă „defense in depth”?', [
    ['Mai multe straturi de protecție independente, astfel încât cedarea unuia să nu expună tot', true, 'Niciun control nu e perfect.'],
    ['Un singur firewall foarte puternic', false, 'Aceasta este o singură barieră.'],
    ['Instalarea aceluiași antivirus de mai multe ori', false, 'Straturile trebuie să fie diferite.'],
    ['Eliminarea utilizatorilor din rețea', false, 'Nu este o strategie realistă.'],
  ], 'Defense in depth = straturi.'),
  single({ id: '5.1-016' }, 2, 'Principiul „least privilege” înseamnă că:', [
    ['Fiecare cont primește doar drepturile strict necesare sarcinii', true, 'Limitează efectul unui cont compromis.'],
    ['Toți utilizatorii au drepturi de administrator', false, 'Opusul principiului.'],
    ['Parolele trebuie să fie cât mai scurte', false, 'Nu are legătură.'],
    ['Doar firewall-ul are privilegii', false, 'Principiul se aplică conturilor și proceselor.'],
  ], 'Least privilege = drepturi minime.'),
  single({ id: '5.1-017' }, 2, 'Care este cea mai eficientă protecție pentru recuperarea după un ransomware?', [
    ['Backup-uri testate, păstrate offline sau imutabile', true, 'Pot fi restaurate fără a plăti răscumpărarea.'],
    ['Un backup pe același server infectat', false, 'Poate fi criptat și el.'],
    ['Schimbarea culorii pe ecran', false, 'Nu are efect.'],
    ['Dezactivarea jurnalizării', false, 'Jurnalizarea ajută investigația.'],
  ], 'Backup offline contra ransomware.'),
  multi({ id: '5.1-018' }, 2, 'Care dintre acestea sunt controale preventive? (alege toate variantele corecte)', [
    ['Un firewall care blochează traficul nedorit', true, 'Oprește traficul înainte să ajungă la țintă.'],
    ['Aplicarea unui patch', true, 'Elimină vulnerabilitatea înainte să fie exploatată.'],
    ['Autentificarea multifactor', true, 'Previne accesul cu o parolă furată.'],
    ['Analiza log-urilor după un incident', false, 'Este un control detectiv/investigativ, nu preventiv.'],
    ['Restaurarea din backup', false, 'Este un control corectiv/de recuperare.'],
  ], 'Preventive: firewall, patch, MFA.'),
  cli({ id: '5.1-019' }, 2, 'Ești în R1(config)#. Dezactivează serverul HTTP de administrare, ca să reduci suprafața de atac.', 'R1(config)#', 'no ip http server', ['no ip http server'], [
    { text: 'ip http server disable', why: 'Nu este sintaxa IOS; dezactivarea se face cu no.' },
    { text: 'shutdown ip http', why: 'shutdown se aplică interfețelor, nu serviciilor.' },
    { text: 'no http server', why: 'Comanda include cuvântul ip.' },
  ], 'no ip http server (și, separat, no ip http secure-server).', 'no ip …'),
  single({ id: '5.1-020' }, 2, 'Ce face transport input ssh pe liniile VTY?', [
    ['Permite doar SSH, deci Telnetul (în clar) nu mai este acceptat', true, 'Elimină o vulnerabilitate de protocol: parole și comenzi în clar.'],
    ['Activează automat generarea cheilor RSA', false, 'Cheile se generează cu crypto key generate rsa.'],
    ['Criptează parola enable', false, 'Aceasta este rolul lui enable secret.'],
    ['Permite orice protocol', false, 'Acesta este transport input all.'],
  ], 'transport input ssh = SSH only.'),

  // ======================= Recapitulare =======================
  single({ id: '5.1-021' }, 2, 'Care control sprijină în principal confidențialitatea datelor în tranzit?', [
    ['Criptarea (de exemplu TLS, SSH, IPsec)', true, 'Un atacator care captează pachetele nu poate citi conținutul.'],
    ['Backup-ul zilnic', false, 'Backup-ul sprijină disponibilitatea.'],
    ['Redundanța liniilor', false, 'Redundanța sprijină disponibilitatea.'],
    ['Un hash comparat înainte de utilizare', false, 'Hash-ul sprijină integritatea.'],
  ], 'Confidențialitate = criptare + control de acces.'),
  single({ id: '5.1-022' }, 2, 'Ce proprietate verifică un hash comparat înainte și după transferul unui fișier?', [
    ['Integritatea', true, 'Dacă hash-ul diferă, fișierul a fost modificat.'],
    ['Disponibilitatea', false, 'Un hash nu garantează accesul.'],
    ['Confidențialitatea', false, 'Un hash nu ascunde conținutul.'],
    ['Autorizarea', false, 'Autorizarea e o funcție AAA, nu o verificare de hash.'],
  ], 'Hash = integritate.'),
  single({ id: '5.1-023' }, 2, 'Care control sprijină în principal disponibilitatea?', [
    ['Redundanța (de exemplu căi duble, FHRP, EtherChannel)', true, 'Serviciul continuă dacă o componentă cade.'],
    ['Criptarea discului', false, 'Aceasta ajută confidențialitatea.'],
    ['Banner-ul de avertizare', false, 'Nu influențează disponibilitatea.'],
    ['Un hash SHA-256', false, 'Ajută integritatea.'],
  ], 'Disponibilitate = redundanță, anti-DDoS, backup.'),
  single({ id: '5.1-024' }, 2, 'Care este diferența dintre phishing și spear phishing?', [
    ['Spear phishing este personalizat pentru o țintă anume, phishing-ul este masiv și generic', true, 'Personalizarea îl face mai convingător.'],
    ['Spear phishing folosește doar telefonul', false, 'Aceasta este vishing.'],
    ['Phishing-ul este întotdeauna fizic', false, 'Phishing este de obicei electronic.'],
    ['Nu există nicio diferență', false, 'Diferă prin nivelul de țintire.'],
  ], 'Spear phishing = țintit.'),
  single({ id: '5.1-025' }, 1, 'Un atac prin SMS care încearcă să te determine să accesezi un link periculos se numește:', [
    ['Smishing', true, 'SMS + phishing.'],
    ['Vishing', false, 'Vishing folosește apeluri vocale.'],
    ['Whaling', false, 'Whaling vizează conducerea, indiferent de canal.'],
    ['Tailgating', false, 'Tailgating este un atac fizic.'],
  ], 'Smishing = SMS.'),
  single({ id: '5.1-026' }, 2, 'Care combinație reduce riscul unui atac man-in-the-middle într-o rețea locală?', [
    ['Criptare end-to-end (TLS/SSH/VPN) plus DHCP snooping și Dynamic ARP Inspection', true, 'Criptarea face traficul ilizibil; DHCP snooping și DAI opresc falsificările locale.'],
    ['Dezactivarea jurnalizării', false, 'Nu ajută; ascunde urmele.'],
    ['Folosirea Telnetului', false, 'Telnet trimite în clar, deci crește riscul.'],
    ['Parole mai scurte', false, 'Nu are legătură cu MITM.'],
  ], 'MITM: criptare + securitate L2.'),
  single({ id: '5.1-027' }, 2, 'Ce este reconnaissance?', [
    ['Colectarea de informații despre o țintă înainte de un atac (scanări, interogări DNS, OSINT)', true, 'Este faza de pregătire.'],
    ['Un tip de malware', false, 'Nu este malware.'],
    ['Un atac care epuizează lățimea de bandă', false, 'Aceasta este DoS.'],
    ['Restaurarea din backup', false, 'Nu are legătură.'],
  ], 'Recon = cercetare.'),
  single({ id: '5.1-028' }, 3, 'Ce este password spraying?', [
    ['Încercarea unei parole uzuale pe multe conturi, pentru a evita blocarea unui singur cont', true, 'Încercările sunt distribuite pe conturi.'],
    ['Încercarea tuturor combinațiilor pe un singur cont', false, 'Aceasta este brute force.'],
    ['Folosirea unor credențiale scurse de pe alte site-uri', false, 'Aceasta este credential stuffing.'],
    ['Resetarea parolei prin e-mail', false, 'Aceasta este o procedură legitimă.'],
  ], 'Spraying = 1 parolă × multe conturi.'),
  single({ id: '5.1-029' }, 2, 'Un angajat cu acces legitim care copiază date sensibile înainte să plece este un exemplu de:', [
    ['Insider threat (amenințare internă)', true, 'Amenințarea vine din interior, cu acces legitim.'],
    ['Reconnaissance', false, 'Nu e un scan extern.'],
    ['DDoS', false, 'Nu epuizează resurse.'],
    ['Zero-day', false, 'Nu este legat de o vulnerabilitate fără patch.'],
  ], 'Insider = acces legitim, intenții rele sau greșeli.'),
  single({ id: '5.1-030' }, 2, 'Un intrus intră într-o zonă protejată lipit de un angajat autorizat, fără să folosească propriul badge. Cum se numește?', [
    ['Tailgating (piggybacking)', true, 'Social engineering fizic.'],
    ['Phishing', false, 'Phishing este prin mesaje electronice.'],
    ['Spoofing', false, 'Spoofing falsifică o identitate/adresă.'],
    ['Ransomware', false, 'Este malware.'],
  ], 'Tailgating = intrare fizică neautorizată.'),
  single({ id: '5.1-031' }, 2, 'Faptul că Telnet trimite parola în clar este o vulnerabilitate de:', [
    ['Protocol (design)', true, 'Protocolul nu are criptare, indiferent de configurare.'],
    ['Hardware', false, 'Nu depinde de echipament.'],
    ['Fizică', false, 'Nu este legată de accesul fizic.'],
    ['Politică de parole', false, 'Parola poate fi puternică; protocolul o expune oricum.'],
  ], 'Protocol: Telnet, HTTP, SNMPv1/v2c.'),
  multi({ id: '5.1-032' }, 2, 'Care sunt forme de social engineering? (alege toate variantele corecte)', [
    ['Phishing', true, 'Păcălește utilizatorul prin e-mail.'],
    ['Vishing', true, 'Păcălește prin apel vocal.'],
    ['Pretexting', true, 'Poveste inventată pentru a obține informații.'],
    ['SYN flood', false, 'Este un atac DoS, nu social engineering.'],
    ['ARP spoofing', false, 'Este un atac tehnic, nu manipulează oameni.'],
  ], 'Social engineering: phishing, vishing, pretexting, tailgating.'),
  order({ id: '5.1-033' }, 3, 'Ordonează etapele tipice ale vieții unei vulnerabilități software.', [
    { text: 'Vulnerabilitatea este descoperită', why: 'Începutul: cineva găsește slăbiciunea.' },
    { text: 'Producătorul publică un patch și un identificator CVE', why: 'Se face publică și se corectează.' },
    { text: 'Apar exploit-uri publice', why: 'Atacatorii construiesc instrumente automate.' },
    { text: 'Organizația aplică patch-ul', why: 'Vulnerabilitatea este eliminată din sistem.' },
  ], 'Descoperire → patch/CVE → exploit-uri → remediere.'),
  order({ id: '5.1-034' }, 3, 'Ordonează straturile de apărare de la exteriorul rețelei spre date.', [
    { text: 'Perimetru (firewall, IPS)', why: 'Primul strat tehnic spre Internet.' },
    { text: 'Rețea internă (segmentare, ACL, securitate L2)', why: 'Limitează deplasarea laterală.' },
    { text: 'Gazdă (patch-uri, antivirus)', why: 'Protejează fiecare sistem.' },
    { text: 'Aplicație și date (autentificare, criptare)', why: 'Ultimul strat, cel mai aproape de informație.' },
  ], 'Perimetru → rețea → gazdă → date.'),
  match({ id: '5.1-035' }, 2, 'Potrivește atacul cu proprietatea CIA pe care o lovește în principal.', [
    { left: 'DDoS', right: 'Disponibilitate', why: 'Serviciul devine inaccesibil.' },
    { left: 'Interceptarea traficului necriptat', right: 'Confidențialitate', why: 'Atacatorul citește date la care nu are dreptul.' },
    { left: 'Modificarea neautorizată a unui fișier de configurare', right: 'Integritate', why: 'Datele nu mai sunt cele originale.' },
  ], [
    { text: 'Autentificare', why: 'Nu este o proprietate din triada CIA.' },
  ], 'DDoS → A; interceptare → C; modificare → I.'),
  cli({ id: '5.1-036' }, 2, 'Ești în R1(config-if)#. Închide administrativ interfața neutilizată.', 'R1(config-if)#', 'shutdown', ['shutdown'], [
    { text: 'no shutdown', why: 'Aceasta pornește interfața.' },
    { text: 'interface down', why: 'Nu este comandă IOS.' },
    { text: 'disable', why: 'Nu se folosește pe interfețe în IOS.' },
  ], 'shutdown închide un port neutilizat.'),
  cli({ id: '5.1-037' }, 2, 'Ești în R1(config-line)#. Închide automat sesiunile inactive după 5 minute.', 'R1(config-line)#', 'exec-timeout 5 0', ['exec-timeout 5 0', 'exec-timeout 5'], [
    { text: 'timeout 5', why: 'Comanda corectă este exec-timeout.' },
    { text: 'exec-timeout 0 5', why: 'Aceasta setează 0 minute și 5 secunde.' },
    { text: 'session-timeout 5 0', why: 'Comanda session-timeout este alta (în alt context).' },
  ], 'exec-timeout <minute> [secunde].', 'exec-…'),
  cli({ id: '5.1-038' }, 2, 'Ești în R1(config)#. Trimite log-urile către serverul syslog 192.168.1.10.', 'R1(config)#', 'logging host 192.168.1.10', ['logging host 192.168.1.10', 'logging 192.168.1.10'], [
    { text: 'syslog 192.168.1.10', why: 'Comanda IOS începe cu logging.' },
    { text: 'logging server 192.168.1.10', why: 'Nu este sintaxa clasică IOS (se folosește host).' },
    { text: 'logging trap 192.168.1.10', why: 'logging trap setează nivelul, nu destinația.' },
  ], 'logging host <ip>.', 'logging host …'),
  cli({ id: '5.1-039' }, 2, 'Ești în R1(config-if)#. Oprește CDP pe interfața spre utilizatori.', 'R1(config-if)#', 'no cdp enable', ['no cdp enable'], [
    { text: 'no cdp run', why: 'Aceasta oprește CDP global, nu doar pe interfață.' },
    { text: 'cdp disable', why: 'Nu este comandă IOS.' },
    { text: 'shutdown cdp', why: 'Nu este comandă IOS.' },
  ], 'no cdp enable pe interfață; no cdp run global.'),
  multi({ id: '5.1-040' }, 2, 'Care dintre acestea sunt acțiuni de hardening pe un switch? (alege toate variantele corecte)', [
    ['Închiderea porturilor neutilizate', true, 'Reduce suprafața de atac fizică.'],
    ['Dezactivarea serverului HTTP dacă nu e necesar', true, 'Elimină un serviciu expus.'],
    ['Înlocuirea Telnet cu SSH', true, 'Elimină transmiterea în clar.'],
    ['Păstrarea parolelor implicite pentru comoditate', false, 'Parolele implicite sunt o vulnerabilitate.'],
    ['Activarea tuturor serviciilor „pentru orice eventualitate”', false, 'Mărește suprafața de atac.'],
  ], 'Hardening = mai puțin expus.'),
];
