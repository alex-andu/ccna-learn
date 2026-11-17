import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.7 Configure and verify Layer 2 security features (DHCP snooping, DAI, port security).
// Obiectivul oficial nu are sub-puncte; `sub` = '5.7'. Fiecare variantă are explicație (why).
const T = '5.7';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_7: Question[] = [
  // ======================= Concepte și amenințări =======================
  single({ id: '5.7-001' }, 1, 'De ce sunt necesare funcții de securitate dedicate pe switch-urile de acces?', [
    ['Pentru că protocoalele LAN (ARP, DHCP, învățarea MAC) se bazează pe încredere și nu autentifică pe nimeni', true, 'Orice gazdă conectată poate trimite răspunsuri ARP/DHCP false sau cadre cu MAC-uri false.'],
    ['Pentru că switch-urile nu pot transmite cadre fără ele', false, 'Switch-ul comută fără aceste funcții; ele sunt adăugate pentru protecție.'],
    ['Pentru că Ethernet criptează implicit traficul', false, 'Ethernet nu criptează; de aceea sunt necesare mecanisme separate.'],
    ['Pentru că routerele nu filtrează traficul', false, 'Routerele filtrează cu ACL; problema aici este atacul din interiorul aceluiași segment L2.'],
  ], 'L2 e bazat pe încredere; funcțiile L2 impun politici.'),
  single({ id: '5.7-002' }, 1, 'Ce funcție de securitate L2 limitează ce adrese MAC pot folosi un port de switch?', [
    ['Port security', true, 'Limitează numărul și identitatea adreselor MAC pe port.'],
    ['DHCP snooping', false, 'Filtrează mesaje DHCP, nu limitează adrese MAC pe port.'],
    ['Dynamic ARP Inspection', false, 'Verifică mesajele ARP față de binding table.'],
    ['VTP pruning', false, 'Este o funcție de VLAN, nu de securitate.'],
  ], 'Port security = limită de MAC pe port.'),
  single({ id: '5.7-003' }, 1, 'Ce funcție de securitate L2 oprește un server DHCP fals?', [
    ['DHCP snooping', true, 'Aruncă OFFER/ACK primite pe porturi untrusted.'],
    ['Port security', false, 'Limitează MAC-urile, nu mesajele DHCP.'],
    ['DAI', false, 'DAI verifică ARP; folosește binding table creat de snooping.'],
    ['CDP', false, 'CDP este un protocol de descoperire, nu de securitate.'],
  ], 'Rogue DHCP → DHCP snooping.'),
  single({ id: '5.7-004' }, 1, 'Ce funcție de securitate L2 oprește ARP spoofing?', [
    ['Dynamic ARP Inspection (DAI)', true, 'Verifică IP–MAC din ARP față de binding table.'],
    ['Port security', false, 'Nu inspectează conținutul mesajelor ARP.'],
    ['DHCP snooping singur', false, 'Creează binding table, dar nu verifică ARP.'],
    ['BPDU guard', false, 'Protejează STP, nu ARP.'],
  ], 'ARP spoofing → DAI.'),
  single({ id: '5.7-005' }, 2, 'Cum funcționează un atac MAC flooding?', [
    ['Umple tabela MAC cu adrese sursă false, ca switch-ul să inunde traficul ca un hub', true, 'Când tabela e plină, cadrele către adrese necunoscute sunt inundate, deci atacatorul le poate vedea.'],
    ['Trimite cereri DHCP până epuizează pool-ul', false, 'Aceasta este DHCP starvation.'],
    ['Trimite răspunsuri ARP false', false, 'Aceasta este ARP spoofing.'],
    ['Blochează portul root al arborelui STP', false, 'Nu are legătură cu tabela MAC.'],
  ], 'MAC flooding = umplerea tabelei MAC.'),
  single({ id: '5.7-006' }, 2, 'Ce obține un atacator cu un server DHCP fals?', [
    ['Poate da clienților el însuși ca gateway sau DNS (man-in-the-middle) sau o configurație inutilizabilă (DoS)', true, 'Clientul acceptă de obicei prima ofertă primită.'],
    ['Poate cripta traficul clienților', false, 'Nu are legătură cu criptarea.'],
    ['Poate schimba VLAN-ul porturilor din switch', false, 'DHCP configurează clientul IP, nu switch-ul.'],
    ['Nimic, DHCP este securizat implicit', false, 'DHCP nu autentifică serverele.'],
  ], 'Rogue DHCP → MITM sau DoS.'),
  single({ id: '5.7-007' }, 2, 'De ce funcționează ARP spoofing?', [
    ['ARP nu are autentificare, iar gazdele acceptă răspunsuri nesolicitate și își actualizează cache-ul', true, 'Gratuitous ARP/răspunsurile false sunt acceptate fără verificare.'],
    ['Pentru că ARP este criptat și atacatorul are cheia', false, 'ARP nu este criptat.'],
    ['Pentru că switch-ul traduce adresele', false, 'Switch-ul nu traduce ARP; doar îl transmite.'],
    ['Pentru că DHCP trimite ARP-uri false', false, 'DHCP nu generează ARP-uri false.'],
  ], 'ARP e neautentificat.'),
  single({ id: '5.7-008' }, 2, 'Care este ordinea logică de activare a funcțiilor pe un switch de acces nou?', [
    ['DHCP snooping, apoi DAI (care folosește binding table)', true, 'DAI se bazează pe tabela creată de DHCP snooping.'],
    ['DAI, apoi DHCP snooping', false, 'DAI fără binding table ar arunca ARP-urile legitime.'],
    ['Doar DAI, nu e nevoie de snooping', false, 'Pentru hosturi DHCP, DAI are nevoie de binding table.'],
    ['Port security, apoi reload', false, 'Reload nu este necesar și nu răspunde la întrebare.'],
  ], 'Snooping înaintea DAI.'),

  // ======================= Port security =======================
  single({ id: '5.7-009' }, 1, 'Care sunt valorile implicite după activarea port security pe un port?', [
    ['Maximum 1 adresă MAC și mod de violare shutdown', true, 'La a doua adresă, portul intră în err-disabled.'],
    ['Maximum 10 adrese și mod protect', false, 'Valorile implicite sunt 1 și shutdown.'],
    ['Maximum 1 adresă și mod restrict', false, 'Restrict trebuie configurat explicit.'],
    ['Fără limită de adrese', false, 'Există o limită implicită de 1.'],
  ], 'Implicit: 1 MAC + shutdown.'),
  single({ id: '5.7-010' }, 1, 'Ce face modul de violare „shutdown”?', [
    ['Pune portul în err-disabled și generează notificare', true, 'Portul nu mai transmite până la recuperare.'],
    ['Aruncă tăcut cadrele ilegale, portul rămâne activ', false, 'Aceasta este „protect”.'],
    ['Aruncă cadrele, loghează și incrementează contorul, portul rămâne activ', false, 'Aceasta este „restrict”.'],
    ['Șterge adresele sigure învățate', false, 'Nu șterge adresele; închide portul.'],
  ], 'shutdown → err-disabled.'),
  single({ id: '5.7-011' }, 2, 'Care mod de violare aruncă cadrele ilegale FĂRĂ notificare (fără syslog sau contor)?', [
    ['protect', true, 'Este modul „tăcut”: administratorul nu află de violare.'],
    ['restrict', false, 'Restrict loghează și incrementează contorul.'],
    ['shutdown', false, 'Shutdown închide portul și loghează.'],
    ['sticky', false, 'Sticky este un mod de învățare, nu de violare.'],
  ], 'protect = fără notificare.'),
  single({ id: '5.7-012' }, 2, 'Ce înseamnă „sticky” la port security?', [
    ['Adresele MAC învățate dinamic sunt adăugate în running-config ca adrese sigure', true, 'Dacă salvezi configurația, rămân și după repornire.'],
    ['Portul nu se mai poate închide', false, 'Sticky nu influențează starea portului.'],
    ['Adresa MAC este copiată în ARP cache', false, 'Nu are legătură cu ARP.'],
    ['Portul acceptă orice adresă fără limită', false, 'Limita rămâne cea configurată.'],
  ], 'Sticky = învățare + scriere în running-config.'),
  single({ id: '5.7-013' }, 2, 'Tentativa de a activa port security pe un port în mod „dynamic desirable” eșuează. Ce trebuie făcut?', [
    ['Setat portul ca static: switchport mode access (sau trunk)', true, 'Port security cere un port static, nu negociat.'],
    ['Activat VTP', false, 'VTP nu are legătură.'],
    ['Dezactivat STP', false, 'STP nu influențează.'],
    ['Schimbat VLAN-ul nativ', false, 'Nu are legătură cu eroarea.'],
  ], 'Port security cere port static.'),
  single({ id: '5.7-014' }, 2, 'Un port cu port security (max 1, violation shutdown) este în err-disabled din cauza unui al doilea dispozitiv. Cum îl repui în funcțiune după ce elimini dispozitivul?', [
    ['shutdown urmat de no shutdown pe interfață', true, 'Resetarea administrativă scoate portul din err-disabled.'],
    ['clear mac address-table', false, 'Nu repune portul în funcțiune.'],
    ['Doar un reload al vecinului', false, 'Nu schimbă starea portului.'],
    ['ip arp inspection trust', false, 'Este o comandă DAI, fără legătură.'],
  ], 'shutdown + no shutdown (sau errdisable recovery).'),
  single({ id: '5.7-015' }, 2, 'Un port are port security cu maximum 2 și un telefon IP cu un PC în spatele lui. Ce se întâmplă dacă le conectezi pe ambele cu maximum 1?', [
    ['Al doilea MAC provoacă o violare (implicit shutdown)', true, 'Telefonul și PC-ul au MAC-uri diferite; maximum 1 e prea puțin.'],
    ['Ambele trec, pentru că telefonul este exceptat', false, 'Nu există o excepție automată.'],
    ['Switch-ul alege cel mai mic MAC', false, 'Nu există o asemenea logică.'],
    ['Port security se dezactivează singur', false, 'Nu se dezactivează.'],
  ], 'Număr maxim = număr de dispozitive așteptate.'),
  single({ id: '5.7-016' }, 2, 'Ce comandă verifică starea port security pe un port, inclusiv modul de violare și contorul?', [
    ['show port-security interface fastEthernet 0/1', true, 'Afișează maximum, modul de violare, numărul de adrese și contorul violărilor.'],
    ['show mac address-table security', false, 'Nu afișează modul de violare.'],
    ['show interfaces trunk', false, 'Se referă la trunk-uri.'],
    ['show ip arp inspection', false, 'Aparține DAI.'],
  ], 'show port-security interface …'),
  single({ id: '5.7-017' }, 3, 'După activarea sticky pe o interfață și învățarea unei adrese, repornești switch-ul fără să fi salvat configurația. Ce se întâmplă cu adresa sticky?', [
    ['Se pierde: adresele sticky stau în running-config și trebuie salvate cu copy running-config startup-config', true, 'Fără salvare, după reload portul reîncepe învățarea.'],
    ['Rămâne mereu, pentru că sticky este permanent automat', false, 'Persistența cere salvarea configurației.'],
    ['Se transformă în adresă statică în VLAN', false, 'Nu există o asemenea transformare.'],
    ['Portul intră în err-disabled', false, 'Nu intră: pur și simplu învață din nou.'],
  ], 'Sticky + copy run start.'),

  // ======================= DHCP snooping =======================
  single({ id: '5.7-018' }, 1, 'Care este starea implicită a porturilor după activarea DHCP snooping pe un VLAN?', [
    ['Toate sunt untrusted', true, 'Tu marchezi explicit trusted porturile spre server și uplinkurile.'],
    ['Toate sunt trusted', false, 'Ar anula scopul funcției.'],
    ['Doar uplinkurile sunt trusted', false, 'Trebuie marcate manual.'],
    ['Doar porturile access sunt trusted', false, 'Porturile access sunt exact cele untrusted.'],
  ], 'Implicit untrusted.'),
  single({ id: '5.7-019' }, 2, 'Ce mesaje DHCP aruncă switch-ul pe un port untrusted?', [
    ['Mesajele de server: OFFER, ACK, NAK', true, 'Un client obișnuit nu trebuie să trimită asemenea mesaje.'],
    ['DISCOVER și REQUEST', false, 'Acestea sunt mesajele normale ale clienților.'],
    ['Toate pachetele UDP', false, 'Se filtrează doar mesajele DHCP de server.'],
    ['ARP', false, 'ARP este tratat de DAI, nu de DHCP snooping.'],
  ], 'Untrusted: fără OFFER/ACK/NAK.'),
  single({ id: '5.7-020' }, 2, 'Ce conține tabela de binding DHCP snooping?', [
    ['MAC, adresa IP, lease, VLAN și portul clientului', true, 'Creată din tranzacțiile DHCP legitime.'],
    ['Doar adresele IP ale serverelor DHCP', false, 'Conține clienți, nu servere.'],
    ['Parolele utilizatorilor', false, 'Nu stochează parole.'],
    ['Rutele învățate prin OSPF', false, 'Nu are legătură cu rutarea.'],
  ], 'Binding = MAC–IP–VLAN–port–lease.'),
  single({ id: '5.7-021' }, 3, 'Ai activat DHCP snooping și nimeni nu mai primește adresă IP. Serverul DHCP este în spatele uplinkului Gi0/1. Ce ai uitat cel mai probabil?', [
    ['ip dhcp snooping trust pe Gi0/1', true, 'Oferta serverului intră pe un port untrusted și este aruncată.'],
    ['ip arp inspection vlan', false, 'DAI nu influențează primirea adreselor DHCP.'],
    ['switchport port-security', false, 'Nu are legătură cu dispariția ofertelor.'],
    ['spanning-tree portfast', false, 'PortFast accelerează portul, dar nu schimbă filtrarea DHCP.'],
  ], 'Uplink netrusted → oferte aruncate.'),
  single({ id: '5.7-022' }, 2, 'La ce folosește „ip dhcp snooping limit rate 15” pe un port de acces?', [
    ['Limitează la 15 pachete DHCP pe secundă; depășirea duce de obicei la err-disabled', true, 'Oprește inundările (starvation) și protejează CPU-ul.'],
    ['Setează durata lease-ului la 15 minute', false, 'Lease-ul se setă pe serverul DHCP.'],
    ['Limitează viteza portului la 15 Mb/s', false, 'Nu limitează lățimea de bandă.'],
    ['Permite maximum 15 clienți', false, 'Nu numără clienții; numără pachete pe secundă.'],
  ], 'limit rate = pps DHCP.'),

  // ======================= DAI =======================
  single({ id: '5.7-023' }, 2, 'Pe ce informație se bazează DAI pentru a decide dacă un ARP este legitim?', [
    ['Tabela de binding DHCP snooping (sau ARP ACL-uri pentru hosturi statice)', true, 'Compară IP și MAC din ARP cu intrarea din binding.'],
    ['Tabela de rutare', false, 'Rutarea nu este implicată în verificarea ARP.'],
    ['Cache-ul DNS', false, 'DNS nu are rol aici.'],
    ['Tabela CAM exclusiv', false, 'CAM ține MAC–port, dar nu IP.'],
  ], 'DAI folosește binding table.'),
  single({ id: '5.7-024' }, 2, 'Ce se întâmplă cu un ARP primit pe un port trusted?', [
    ['Trece fără verificare de către DAI', true, 'Porturile trusted nu sunt inspectate; de aceea se marchează uplinkurile.'],
    ['Este verificat față de binding table', false, 'Verificarea se face doar pe porturi untrusted.'],
    ['Este întotdeauna aruncat', false, 'Nu este aruncat doar fiindcă portul e trusted.'],
    ['Este convertit în broadcast', false, 'Nu are loc o conversie.'],
  ], 'Trusted = neinspectat.'),
  single({ id: '5.7-025' }, 3, 'După activarea DAI pe VLAN 10, o imprimantă cu IP static nu mai comunică. De ce?', [
    ['Nu are intrare în binding table (nu a folosit DHCP), deci ARP-urile ei sunt aruncate', true, 'Soluții: ARP ACL cu perechea IP–MAC sau marcarea portului ca trusted.'],
    ['Imprimantele nu suportă ARP', false, 'Suportă; problema e verificarea DAI.'],
    ['DAI blochează toate porturile IP statice, indiferent de configurare', false, 'Se poate configura excepția prin ARP ACL.'],
    ['VLAN 10 a fost șters', false, 'Nu este cauza descrisă.'],
  ], 'IP static + DAI → ARP ACL.'),
  single({ id: '5.7-026' }, 2, 'Ce comandă activează DAI pentru VLAN 10?', [
    ['ip arp inspection vlan 10', true, 'Se dă în configurarea globală.'],
    ['ip dhcp snooping vlan 10', false, 'Aceasta activează DHCP snooping, nu DAI.'],
    ['arp inspection enable', false, 'Nu este sintaxa IOS.'],
    ['switchport arp-inspection', false, 'Nu este o comandă de interfață IOS.'],
  ], 'ip arp inspection vlan <id>.'),
  single({ id: '5.7-027' }, 3, 'Un atacator pe un port untrusted trimite un ARP „192.168.10.30 este la cccc.0003”, dar binding table are 192.168.10.30 ↔ bbbb.0002. Ce face DAI?', [
    ['Aruncă mesajul și îl loghează', true, 'IP-ul este legat de alt MAC.'],
    ['Actualizează binding table cu noul MAC', false, 'DAI nu modifică binding table din ARP.'],
    ['Transmite mesajul, dar îl marchează', false, 'Mesajul invalid este aruncat.'],
    ['Pune portul în trunk', false, 'DAI nu schimbă modul portului.'],
  ], 'IP–MAC în conflict cu binding → drop + log.'),

  // ======================= Multi =======================
  multi({ id: '5.7-028' }, 2, 'Care sunt moduri de violare valide la port security? (alege toate variantele corecte)', [
    ['protect', true, 'Aruncă fără notificare.'],
    ['restrict', true, 'Aruncă, loghează, incrementează contorul.'],
    ['shutdown', true, 'Err-disabled; implicit.'],
    ['sticky', false, 'Este un mod de învățare, nu de violare.'],
    ['isolate', false, 'Nu există la port security.'],
  ], 'protect, restrict, shutdown.'),
  multi({ id: '5.7-029' }, 2, 'Care porturi se marchează de obicei „trusted” la DHCP snooping? (alege toate variantele corecte)', [
    ['Uplinkul către switch-ul de distribuție', true, 'Pe acolo vine oferta serverului.'],
    ['Portul către serverul DHCP', true, 'Serverul trebuie să poată trimite OFFER/ACK.'],
    ['Portul către routerul care face DHCP relay', true, 'Răspunsurile vin prin el.'],
    ['Portul către PC-ul unui utilizator', false, 'Rămâne untrusted.'],
    ['Portul către un server DHCP necunoscut', false, 'Un server necunoscut nu are încredere.'],
  ], 'Trust = server legitim și drumul spre el.'),
  multi({ id: '5.7-030' }, 3, 'Ce poate valida opțional DAI, pe lângă comparația cu binding table? (alege toate variantele corecte)', [
    ['MAC-ul sursă din antetul Ethernet față de cel din corpul ARP (src-mac)', true, 'validate src-mac.'],
    ['MAC-ul destinație din antet față de cel din ARP reply (dst-mac)', true, 'validate dst-mac.'],
    ['Adresele IP invalide sau neașteptate (ip)', true, 'validate ip.'],
    ['Parola utilizatorului', false, 'DAI nu autentifică utilizatori.'],
    ['Certificatul serverului', false, 'Nu este implicat.'],
  ], 'validate src-mac / dst-mac / ip.'),
  multi({ id: '5.7-031' }, 3, 'Care afirmații despre defensele L2 sunt corecte? (alege toate variantele corecte)', [
    ['DAI depinde de binding table creat de DHCP snooping (sau de ARP ACL)', true, 'Fără binding, ARP legitim ar fi aruncat.'],
    ['Port security limitează MAC-urile pe port și ajută împotriva MAC flooding', true, 'Prin limita de adrese pe port.'],
    ['DHCP snooping filtrează mesajele DHCP de server pe porturi untrusted', true, 'Oprește servere false.'],
    ['Port security criptează traficul de pe port', false, 'Nu criptează.'],
    ['DAI înlocuiește DHCP snooping', false, 'Se completează, nu se înlocuiesc.'],
  ], 'Funcțiile se completează.'),

  // ======================= Match / Order =======================
  match({ id: '5.7-032' }, 2, 'Potrivește atacul cu funcția care îl combate.', [
    { left: 'MAC flooding', right: 'Port security', why: 'Limita de MAC pe port oprește umplerea tabelei.' },
    { left: 'Server DHCP fals', right: 'DHCP snooping', why: 'Aruncă OFFER/ACK de pe porturi untrusted.' },
    { left: 'ARP spoofing', right: 'Dynamic ARP Inspection', why: 'Verifică ARP față de binding table.' },
    { left: 'Dispozitiv neautorizat conectat la un port liber', right: 'Port security (adrese sigure)', why: 'Doar MAC-urile autorizate au voie.' },
  ], [
    { text: 'BPDU guard', why: 'Protejează topologia STP, nu cele patru atacuri.' },
    { text: 'VLAN pruning', why: 'Optimizează trunk-urile, nu este o apărare împotriva atacurilor.' },
  ], 'Fiecare atac are funcția lui dedicată.'),
  match({ id: '5.7-033' }, 2, 'Potrivește comanda cu rolul ei.', [
    { left: 'switchport port-security mac-address sticky', right: 'Învață adrese MAC și le scrie în running-config', why: 'Definiția sticky.' },
    { left: 'ip dhcp snooping trust', right: 'Marchează un port ca trusted pentru mesaje DHCP de server', why: 'Se dă pe interfață.' },
    { left: 'ip arp inspection trust', right: 'Scutește un port de inspecția DAI', why: 'Se dă pe uplinkuri.' },
    { left: 'show ip dhcp snooping binding', right: 'Afișează tabela MAC–IP–port–VLAN–lease', why: 'Verificarea snooping-ului.' },
  ], [
    { text: 'Activează PortFast pe port', why: 'PortFast se activează cu spanning-tree portfast.' },
    { text: 'Șterge tabela MAC a switch-ului', why: 'Aceasta este clear mac address-table.' },
  ], 'Fiecare comandă are un rol clar.'),
  order({ id: '5.7-034' }, 3, 'Ordonează pașii implementării sigure pe un switch de acces (VLAN 10).', [
    { text: 'Marchezi trusted uplinkul și portul serverului DHCP', why: 'Înainte de activare, altfel oferta legitimă este aruncată.' },
    { text: 'Activezi DHCP snooping global și pe VLAN 10', why: 'Începe construirea binding table.' },
    { text: 'Aștepți ca binding table să se populeze', why: 'DAI are nevoie de intrări pentru clienții existenți.' },
    { text: 'Activezi DAI pe VLAN 10 și marchezi uplinkul trusted', why: 'Verificarea ARP are acum binding table.' },
    { text: 'Activezi port security pe porturile de acces', why: 'Limita de MAC completează protecția.' },
  ], 'Trust → snooping → binding → DAI → port security.'),
  order({ id: '5.7-035' }, 2, 'Ordonează ce se întâmplă când un al doilea MAC apare pe un port cu port security (max 1, shutdown).', [
    { text: 'Primul dispozitiv trimite cadre; MAC-ul lui devine adresă sigură', why: 'Limita de 1 este acum atinsă.' },
    { text: 'Un al doilea dispozitiv trimite un cadru cu alt MAC', why: 'Începe violarea.' },
    { text: 'Switch-ul detectează adresa peste maximum', why: 'Compară cu lista de adrese sigure.' },
    { text: 'Portul intră în err-disabled și apare un mesaj syslog', why: 'Reacția modului shutdown.' },
    { text: 'Administratorul elimină dispozitivul și face shutdown/no shutdown', why: 'Recuperarea manuală.' },
  ], 'Învățare → violare → err-disabled → recuperare.'),

  // ======================= CLI =======================
  cli({ id: '5.7-036' }, 1, 'Ești în SW1(config-if)# pe un port access. Activează port security.', 'SW1(config-if)#', 'switchport port-security', ['switchport port-security'], [
    { text: 'port-security enable', why: 'Nu este sintaxa IOS.' },
    { text: 'switchport port-security enable', why: 'Nu există cuvântul „enable”.' },
    { text: 'ip port-security', why: 'Nu este comanda corectă.' },
  ], 'switchport port-security.', 'switchport …'),
  cli({ id: '5.7-037' }, 2, 'Ești în SW1(config-if)#. Setează modul de violare restrict.', 'SW1(config-if)#', 'switchport port-security violation restrict', ['switchport port-security violation restrict'], [
    { text: 'port-security violation restrict', why: 'Lipsește prefixul switchport.' },
    { text: 'switchport port-security restrict', why: 'Lipsește cuvântul violation.' },
    { text: 'switchport port-security violation protect', why: 'Setează modul protect, nu restrict.' },
  ], 'switchport port-security violation <mod>.', 'switchport port-security …'),
  cli({ id: '5.7-038' }, 2, 'Ești în SW1(config-if)# pe uplinkul către serverul DHCP. Marchează portul ca trusted pentru DHCP snooping.', 'SW1(config-if)#', 'ip dhcp snooping trust', ['ip dhcp snooping trust'], [
    { text: 'dhcp snooping trust', why: 'Lipsește ip.' },
    { text: 'ip dhcp trust', why: 'Lipsește cuvântul snooping.' },
    { text: 'ip arp inspection trust', why: 'Acesta marchează trust pentru DAI, nu pentru DHCP snooping.' },
  ], 'ip dhcp snooping trust.', 'ip dhcp …'),
  cli({ id: '5.7-039' }, 2, 'Ești în SW1(config)#. Activează Dynamic ARP Inspection pe VLAN 10.', 'SW1(config)#', 'ip arp inspection vlan 10', ['ip arp inspection vlan 10'], [
    { text: 'ip dhcp snooping vlan 10', why: 'Activează DHCP snooping, nu DAI.' },
    { text: 'arp inspection vlan 10', why: 'Lipsește ip la început.' },
    { text: 'ip arp inspect vlan 10', why: 'Cuvântul corect este inspection.' },
  ], 'ip arp inspection vlan <id>.', 'ip arp …'),
  cli({ id: '5.7-040' }, 1, 'Ești în SW1#. Afișează tabela de binding DHCP snooping.', 'SW1#', 'show ip dhcp snooping binding', ['show ip dhcp snooping binding'], [
    { text: 'show dhcp binding', why: 'Aceasta este de pe server; pe switch comanda include „snooping”.' },
    { text: 'show ip dhcp binding', why: 'Afișează bindingurile serverului DHCP al routerului, nu ale snooping-ului.' },
    { text: 'show ip arp inspection', why: 'Aparține DAI.' },
  ], 'show ip dhcp snooping binding.', 'show ip dhcp …'),
];
