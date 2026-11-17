import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.9 Describe wireless security protocols (WPA, WPA2, and WPA3).
// Obiectivul oficial nu are sub-puncte; `sub` = '5.9'. Fiecare variantă are explicație (why).
const T = '5.9';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_9: Question[] = [
  // ======================= Concepte =======================
  single({ id: '5.9-001' }, 1, 'De ce are Wi-Fi-ul nevoie de securitate dedicată, spre deosebire de o rețea cablată?', [
    ['Mediul radio este partajat: oricine din raza semnalului poate asculta și se poate asocia', true, 'Fără protecție, cadrele sunt vizibile oricui și accesul nu este controlat fizic.'],
    ['Pentru că Wi-Fi folosește adrese IPv6', false, 'Versiunea IP nu are legătură cu securitatea radio.'],
    ['Pentru că AP-urile nu au procesor', false, 'AP-urile au procesor; problema este mediul.'],
    ['Pentru că Wi-Fi nu suportă VLAN', false, 'Suportă VLAN prin maparea SSID–VLAN.'],
  ], 'Mediu partajat → autentificare + criptare.'),
  single({ id: '5.9-002' }, 1, 'Ce trei lucruri trebuie să asigure securitatea Wi-Fi?', [
    ['Autentificare, criptare și integritate', true, 'Cine are voie, ce nu se vede, ce nu se modifică.'],
    ['Disponibilitate, rutare și NAT', false, 'Nu sunt funcțiile de securitate Wi-Fi.'],
    ['Compresie, QoS și roaming', false, 'Sunt funcții de performanță, nu de securitate.'],
    ['DHCP, DNS și NTP', false, 'Sunt servicii IP.'],
  ], 'Autentificare + criptare + integritate.'),
  single({ id: '5.9-003' }, 1, 'Care este situația WEP?', [
    ['Este spart și nu mai trebuie folosit', true, 'RC4 cu IV de 24 de biți: cheia se recuperează rapid din trafic capturat.'],
    ['Este cea mai sigură variantă', false, 'Este exact cea mai nesigură.'],
    ['Este obligatoriu la WPA3', false, 'WPA3 nu folosește WEP.'],
    ['Este recomandat pentru rețele de oaspeți', false, 'Nu mai este recomandat nicăieri.'],
  ], 'WEP = spart.'),
  single({ id: '5.9-004' }, 2, 'Ce cifru de criptare folosește WPA (prima generație)?', [
    ['TKIP, bazat pe RC4', true, 'TKIP a reparat defectele WEP pe același hardware, dar rămâne pe RC4; este depreciat.'],
    ['AES-CCMP', false, 'Aceasta este WPA2.'],
    ['GCMP-256', false, 'Aceasta apare în modul de 192 biți al WPA3-Enterprise.'],
    ['DES', false, 'DES nu este folosit de WPA.'],
  ], 'WPA = TKIP.'),
  single({ id: '5.9-005' }, 1, 'Ce cifru de criptare folosește WPA2?', [
    ['AES în modul CCMP', true, 'CCMP oferă confidențialitate și integritate.'],
    ['RC4 cu TKIP', false, 'Aceasta este WPA.'],
    ['Nicio criptare', false, 'WPA2 criptează.'],
    ['3DES', false, 'Nu este cifrul WPA2.'],
  ], 'WPA2 = AES-CCMP.'),
  single({ id: '5.9-006' }, 2, 'Cum se autentifică un client la WPA3-Personal?', [
    ['Cu SAE (Simultaneous Authentication of Equals)', true, 'Înlocuiește PSK-ul clasic cu un schimb Dragonfly mai rezistent.'],
    ['Cu PSK, ca la WPA2', false, 'PSK este metoda WPA2-Personal.'],
    ['Cu certificate obligatorii', false, 'Certificatele aparțin Enterprise/EAP-TLS.'],
    ['Fără autentificare', false, 'Aceasta ar fi o rețea deschisă (sau OWE).'],
  ], 'WPA3-Personal = SAE.'),
  single({ id: '5.9-007' }, 2, 'Ce standard IEEE este asociat cu WPA2?', [
    ['802.11i', true, 'WPA2 este implementarea certificată a lui 802.11i (CCMP).'],
    ['802.11n', false, 'Este un standard de viteză (Wi-Fi 4).'],
    ['802.1Q', false, 'Este etichetarea VLAN.'],
    ['802.3af', false, 'Este PoE.'],
  ], 'WPA2 ↔ 802.11i.'),
  single({ id: '5.9-008' }, 1, 'Care este diferența esențială dintre Personal și Enterprise?', [
    ['Personal folosește o parolă comună; Enterprise autentifică fiecare utilizator prin 802.1X/RADIUS', true, 'Enterprise permite credențiale individuale și revocare individuală.'],
    ['Personal criptează, Enterprise nu', false, 'Ambele criptează.'],
    ['Personal este doar pentru 5 GHz', false, 'Modul nu depinde de bandă.'],
    ['Enterprise nu are nevoie de server', false, 'Are nevoie de un server RADIUS.'],
  ], 'Personal = parolă comună; Enterprise = 802.1X.'),
  single({ id: '5.9-009' }, 1, 'Ce infrastructură cere WPA2-Enterprise față de Personal?', [
    ['Un server de autentificare (RADIUS)', true, 'Authenticator-ul (AP/WLC) întreabă serverul.'],
    ['Un server NTP', false, 'NTP nu este necesar pentru autentificare.'],
    ['Un server DNS dedicat', false, 'DNS nu este cerut de 802.1X.'],
    ['Un al doilea AP', false, 'Numărul de AP-uri nu este relevant.'],
  ], 'Enterprise → RADIUS.'),
  single({ id: '5.9-010' }, 2, 'Ce lungime poate avea o parolă WPA2-PSK?', [
    ['8–63 de caractere ASCII sau 64 de cifre hexazecimale', true, 'Din parolă și SSID se derivă PMK-ul.'],
    ['1–7 caractere', false, 'Prea scurt: minimul este 8.'],
    ['Exact 128 de caractere', false, 'Nu este regula PSK.'],
    ['Orice lungime, fără limită', false, 'Există limitele 8–63 (ASCII) și 64 hex.'],
  ], '8–63 ASCII sau 64 hex.'),
  single({ id: '5.9-011' }, 2, 'Care este principala slăbiciune a WPA2-Personal?', [
    ['Un handshake capturat permite un atac de dicționar offline asupra parolei', true, 'Atacatorul poate testa parole fără limită, fără să interacționeze cu AP-ul.'],
    ['Nu criptează traficul', false, 'Criptează cu AES-CCMP.'],
    ['Folosește RC4', false, 'RC4 este la WPA/WEP.'],
    ['Nu poate fi folosit pe 5 GHz', false, 'Funcționează pe ambele benzi.'],
  ], 'WPA2-PSK: dicționar offline.'),
  single({ id: '5.9-012' }, 2, 'Ce rezolvă SAE față de PSK?', [
    ['Împiedică atacul de dicționar offline și oferă forward secrecy', true, 'Fiecare încercare de ghicire cere o interacțiune online cu AP-ul.'],
    ['Elimină nevoia de parolă', false, 'Parola există în continuare.'],
    ['Face traficul necriptat, pentru viteză', false, 'Criptarea rămâne.'],
    ['Înlocuiește 802.1X', false, 'SAE este pentru Personal, nu pentru Enterprise.'],
  ], 'SAE: anti-dicționar offline + forward secrecy.'),
  single({ id: '5.9-013' }, 2, 'Ce înseamnă forward secrecy?', [
    ['Aflarea ulterioară a parolei nu permite decriptarea traficului capturat în trecut', true, 'Cheile de sesiune provin dintr-un schimb efemer.'],
    ['Traficul este trimis înainte de a fi criptat', false, 'Nu este sensul termenului.'],
    ['Parola se schimbă automat zilnic', false, 'Nu este definiția.'],
    ['AP-ul își ascunde SSID-ul', false, 'Nu are legătură.'],
  ], 'Forward secrecy = trecutul rămâne protejat.'),
  single({ id: '5.9-014' }, 2, 'Ce protejează PMF (802.11w)?', [
    ['Cadrele de management, de exemplu deauthentication și disassociation', true, 'Opresc deconectările forțate falsificate.'],
    ['Doar cadrele de date', false, 'Datele sunt deja criptate de CCMP/GCMP.'],
    ['Doar adresele IP', false, 'PMF lucrează la nivel de cadre 802.11.'],
    ['Doar semnalul radio', false, 'Nu protejează semnalul.'],
  ], 'PMF = cadre de management.'),
  single({ id: '5.9-015' }, 2, 'Cum este PMF la WPA3?', [
    ['Obligatoriu', true, 'WPA3 cere PMF; la WPA2 este opțional.'],
    ['Interzis', false, 'Nu este interzis.'],
    ['Opțional, ca la WPA2', false, 'La WPA3 devine obligatoriu.'],
    ['Disponibil doar pe 2,4 GHz', false, 'Nu depinde de bandă.'],
  ], 'WPA3 → PMF obligatoriu.'),
  single({ id: '5.9-016' }, 2, 'Ce oferă OWE (Enhanced Open)?', [
    ['Criptare pentru rețele deschise, fără parolă', true, 'Fiecare client negociază chei prin Diffie-Hellman.'],
    ['Autentificare prin certificate', false, 'OWE nu autentifică.'],
    ['Acces fără criptare, doar cu portal captiv', false, 'Portalul captiv nu criptează cadrele.'],
    ['Criptare WEP', false, 'WEP nu mai este folosit.'],
  ], 'OWE = deschis, dar criptat.'),
  single({ id: '5.9-017' }, 2, 'Ce înseamnă CCMP?', [
    ['Protocolul de criptare bazat pe AES folosit de WPA2', true, 'Oferă criptare și integritate.'],
    ['Un protocol de rutare', false, 'Nu este de rutare.'],
    ['Un protocol de management SNMP', false, 'Nu este SNMP.'],
    ['Metoda EAP pentru certificate', false, 'EAP-TLS este metoda pentru certificate.'],
  ], 'CCMP = AES (WPA2).'),
  single({ id: '5.9-018' }, 3, 'Unde apare GCMP-256?', [
    ['În modul de 192 de biți al WPA3-Enterprise', true, 'Parte a suitei CNSA, pentru cerințe înalte.'],
    ['În WEP', false, 'WEP folosește RC4.'],
    ['În WPA (TKIP)', false, 'WPA folosește TKIP.'],
    ['În rețele deschise clasice', false, 'Acestea nu criptează.'],
  ], 'GCMP-256 → WPA3-Enterprise 192-bit.'),
  single({ id: '5.9-019' }, 2, 'Ce este EAP-TLS?', [
    ['O metodă EAP cu certificate atât pe server, cât și pe client', true, 'Autentificare mutuală, fără parolă de utilizator.'],
    ['O metodă EAP doar cu parolă, fără certificate', false, 'Aceasta ar fi altă metodă; EAP-TLS cere certificate.'],
    ['Un cifru de criptare', false, 'EAP este un cadru de autentificare, nu un cifru.'],
    ['O versiune de WPA', false, 'Nu este o versiune WPA.'],
  ], 'EAP-TLS = certificate pe ambele părți.'),
  single({ id: '5.9-020' }, 3, 'Ce este PEAP?', [
    ['Un tunel TLS creat cu certificatul serverului, în care clientul se autentifică de obicei cu parolă', true, 'Mai simplu de implementat decât EAP-TLS, dar clientul trebuie să valideze certificatul serverului.'],
    ['O metodă fără tunel și fără certificate', false, 'PEAP folosește tunel TLS.'],
    ['O metodă care cere certificat doar pe client', false, 'Certificatul este pe server.'],
    ['Un protocol de rutare', false, 'Nu este de rutare.'],
  ], 'PEAP = tunel TLS + autentificare internă.'),
  single({ id: '5.9-021' }, 2, 'Ce părere avem despre LEAP?', [
    ['Este o metodă veche Cisco, considerată nesigură', true, 'A fost înlocuită de EAP-FAST, PEAP și EAP-TLS.'],
    ['Este cea mai puternică metodă EAP', false, 'Cea mai puternică este EAP-TLS.'],
    ['Este metoda obligatorie la WPA3', false, 'WPA3 nu o cere.'],
    ['Este un cifru AES', false, 'LEAP este o metodă EAP.'],
  ], 'LEAP = depășită.'),
  single({ id: '5.9-022' }, 2, 'Ascunderea SSID-ului (SSID cloaking) este o măsură de securitate eficientă?', [
    ['Nu: SSID-ul apare în alte cadre și poate fi aflat; nu înlocuiește autentificarea și criptarea', true, 'Ascunderea creează doar o falsă senzație de siguranță.'],
    ['Da, înlocuiește WPA2', false, 'Nu înlocuiește nimic.'],
    ['Da, criptează traficul', false, 'Nu criptează.'],
    ['Da, împiedică orice atac', false, 'Nu împiedică atacurile.'],
  ], 'SSID ascuns ≠ securitate.'),
  single({ id: '5.9-023' }, 2, 'Filtrarea după adresa MAC ca singură măsură de securitate Wi-Fi este…', [
    ['Insuficientă: adresele MAC pot fi observate și falsificate', true, 'Poate completa, dar nu înlocuiește WPA2/WPA3.'],
    ['Echivalentă cu WPA3', false, 'Nu oferă criptare.'],
    ['Obligatorie la WPA2', false, 'Nu este obligatorie.'],
    ['Suficientă pentru companii', false, 'Nu protejează conținutul și se ocolește ușor.'],
  ], 'Filtrare MAC = slabă.'),
  single({ id: '5.9-024' }, 3, 'Ce dezavantaj are WPA3 transition mode?', [
    ['Protecția este cea a celui mai slab membru: clienții WPA2 rămân expuși', true, 'Același SSID acceptă PSK și SAE.'],
    ['Dezactivează criptarea', false, 'Criptarea rămâne.'],
    ['Funcționează doar fără parolă', false, 'Folosește parolă.'],
    ['Cere server RADIUS', false, 'Este mod Personal; nu cere RADIUS.'],
  ], 'Transition mode = compromis temporar.'),
  single({ id: '5.9-025' }, 2, 'Ce este un atac „evil twin”?', [
    ['Un AP al atacatorului cu același SSID ca o rețea legitimă', true, 'Clienții se pot conecta la el și traficul poate fi interceptat.'],
    ['Un AP legitim defect', false, 'Nu este un defect, ci un atac.'],
    ['Două AP-uri legitime pe același canal', false, 'Aceasta este interferență, nu atac.'],
    ['Un client cu două plăci de rețea', false, 'Nu are legătură.'],
  ], 'Evil twin = AP fals cu același SSID.'),
  single({ id: '5.9-026' }, 2, 'Ce atac este oprit de PMF?', [
    ['Deauthentication falsificat', true, 'Cadrele de management sunt protejate.'],
    ['Ghicirea parolei offline', false, 'Aceasta se oprește cu SAE.'],
    ['Interferența radio', false, 'PMF nu oprește interferența.'],
    ['Evil twin în general', false, 'PMF nu autentifică AP-ul.'],
  ], 'PMF ↔ deauth.'),
  single({ id: '5.9-027' }, 2, 'Ce alegere este potrivită pentru o companie cu sute de angajați și cerințe de audit?', [
    ['WPA2/WPA3-Enterprise cu 802.1X și RADIUS', true, 'Autentificare individuală, revocare, politici și accounting.'],
    ['WPA2-Personal cu o parolă afișată în birou', false, 'Parolă comună: greu de revocat și de urmărit.'],
    ['Rețea deschisă cu portal captiv', false, 'Nu criptează.'],
    ['WEP', false, 'Spart.'],
  ], 'Companii → Enterprise.'),
  single({ id: '5.9-028' }, 2, 'Ce alegere este potrivită pentru o locuință, cu dispozitive moderne?', [
    ['WPA3-Personal (SAE) sau, dacă nu e disponibil, WPA2-Personal cu parolă lungă', true, 'Echilibrează securitatea și simplitatea.'],
    ['Rețea deschisă', false, 'Fără protecție.'],
    ['WEP', false, 'Spart.'],
    ['WPA cu TKIP', false, 'Depreciat.'],
  ], 'Acasă → WPA3-Personal.'),
  single({ id: '5.9-029' }, 3, 'Un AP este configurat în „mixed mode” TKIP + AES. Ce risc apare?', [
    ['Rețeaua poate coborî la TKIP pentru clienții vechi și slăbește securitatea', true, 'Un singur client TKIP poate forța compromisul; se preferă doar AES.'],
    ['Viteza crește garantat', false, 'Nu este un câștig de securitate; TKIP poate chiar limita viteza.'],
    ['Rețeaua devine WPA3', false, 'Nu devine WPA3.'],
    ['Nu are niciun efect', false, 'Efectul de securitate există.'],
  ], 'Doar AES.'),
  single({ id: '5.9-030' }, 3, 'De ce nu autentifică OWE AP-ul?', [
    ['Criptează traficul, dar nu include verificarea identității AP-ului, deci nu oprește un evil twin', true, 'Protejează de ascultarea pasivă, nu de impersonare.'],
    ['Pentru că folosește WEP', false, 'Nu folosește WEP.'],
    ['Pentru că este mereu ascuns', false, 'Nu are legătură cu ascunderea.'],
    ['Pentru că cere certificate pe client', false, 'OWE nu cere certificate.'],
  ], 'OWE: criptare fără autentificare.'),

  // ======================= Multi =======================
  multi({ id: '5.9-031' }, 2, 'Ce aduce WPA3 față de WPA2? (alege toate variantele corecte)', [
    ['SAE la Personal', true, 'Rezistență la dicționar offline.'],
    ['PMF obligatoriu', true, 'Protejează cadrele de management.'],
    ['Mod opțional de 192 de biți la Enterprise', true, 'Suita CNSA cu GCMP-256.'],
    ['OWE pentru rețele deschise', true, 'Criptare fără parolă.'],
    ['Reintroducerea WEP', false, 'WEP nu revine.'],
  ], 'SAE, PMF, 192-bit, OWE.'),
  multi({ id: '5.9-032' }, 2, 'Care NU sunt măsuri adecvate de securitate Wi-Fi? (alege toate variantele corecte)', [
    ['Doar ascunderea SSID-ului', true, 'Nu protejează conținutul.'],
    ['Doar filtrarea MAC', true, 'Se ocolește ușor.'],
    ['WEP', true, 'Spart.'],
    ['WPA3-Personal cu parolă puternică', false, 'Este o măsură adecvată.'],
    ['WPA2-Enterprise cu validarea certificatului', false, 'Este o măsură adecvată.'],
  ], 'SSID ascuns, filtrare MAC, WEP — insuficiente.'),
  multi({ id: '5.9-033' }, 3, 'Ce elemente intervin într-o autentificare WPA2-Enterprise? (alege toate variantele corecte)', [
    ['Supplicant (clientul)', true, 'Cere accesul.'],
    ['Authenticator (AP/WLC)', true, 'Păzește accesul și retransmite EAP.'],
    ['Server RADIUS', true, 'Validează credențialele.'],
    ['Metodă EAP (de exemplu PEAP sau EAP-TLS)', true, 'Definește cum se dovedește identitatea.'],
    ['Server DHCP-snooping', false, 'Nu face parte din fluxul 802.1X.'],
  ], 'Supplicant, authenticator, RADIUS, metodă EAP.'),

  // ======================= Match / Order =======================
  match({ id: '5.9-034' }, 2, 'Potrivește modul de securitate cu caracteristica lui principală.', [
    { left: 'WPA (TKIP)', right: 'RC4 cu chei pe pachet, depreciat', why: 'Soluție de tranziție de pe WEP.' },
    { left: 'WPA2-Personal', right: 'AES-CCMP cu PSK', why: 'Parolă comună, criptare AES.' },
    { left: 'WPA3-Personal', right: 'SAE (Dragonfly)', why: 'Anti-dicționar offline.' },
    { left: 'WPA3-Enterprise 192-bit', right: 'GCMP-256 (suita CNSA)', why: 'Cerințe înalte.' },
  ], [
    { text: 'RC4 cu IV de 24 de biți', why: 'Aceasta este WEP.' },
    { text: 'Fără criptare', why: 'Aceasta este o rețea deschisă.' },
  ], 'Fiecare generație are semnătura ei criptografică.'),
  match({ id: '5.9-035' }, 2, 'Potrivește atacul cu apărarea principală.', [
    { left: 'Deauthentication falsificat', right: 'PMF (802.11w)', why: 'Protejează cadrele de management.' },
    { left: 'Dicționar offline pe handshake', right: 'WPA3-Personal (SAE) sau parolă lungă', why: 'SAE elimină testarea offline.' },
    { left: 'Evil twin', right: 'Validarea certificatului serverului (Enterprise) și WIPS', why: 'Clientul recunoaște serverul legitim.' },
    { left: 'AP neautorizat în rețeaua proprie', right: 'Detecție rogue (WLC/WIPS) și 802.1X pe porturi', why: 'Blochează și descoperă dispozitivul.' },
  ], [
    { text: 'Ascunderea SSID-ului', why: 'Nu oprește niciunul dintre atacuri.' },
    { text: 'Schimbarea canalului radio', why: 'Nu are legătură cu securitatea acestor atacuri.' },
  ], 'Fiecare atac are apărarea lui.'),
  order({ id: '5.9-036' }, 3, 'Ordonează pașii autentificării WPA2-Enterprise.', [
    { text: 'Clientul se asociază cu AP-ul (portul controlat rămâne blocat)', why: 'Doar EAPOL trece.' },
    { text: 'AP-ul cere identitatea și o trimite serverului RADIUS', why: 'EAP este împachetat în RADIUS.' },
    { text: 'Clientul și serverul negociază metoda EAP (tunel TLS, autentificare)', why: 'Se verifică identitatea.' },
    { text: 'Serverul trimite Access-Accept cu cheia de sesiune', why: 'AP-ul primește materialul pentru PMK.' },
    { text: 'AP-ul și clientul fac 4-way handshake și încep să cripteze', why: 'Se derivă cheile de trafic.' },
  ], 'Asociere → identitate → EAP → Accept → 4-way.'),
  order({ id: '5.9-037' }, 1, 'Ordonează cronologic protocoalele de securitate Wi-Fi.', [
    { text: 'WEP', why: '1997; spart.' },
    { text: 'WPA', why: '2003; TKIP.' },
    { text: 'WPA2', why: '2004; AES-CCMP.' },
    { text: 'WPA3', why: '2018; SAE, PMF obligatoriu.' },
  ], 'WEP → WPA → WPA2 → WPA3.'),

  // ======================= CLI (WLC AireOS, ilustrativ) =======================
  cli({ id: '5.9-038' }, 2, 'Pe WLC (AireOS) ai creat WLAN-ul cu ID 1. Activează WPA2 pe el.', '(Cisco Controller) >', 'config wlan security wpa wpa2 enable 1', ['config wlan security wpa wpa2 enable 1'], [
    { text: 'config wlan security wpa2 enable 1', why: 'Lipsește nivelul „wpa” din sintaxă.' },
    { text: 'config wlan wpa2 enable 1', why: 'Lipsește cuvântul security.' },
    { text: 'config wlan security wpa wpa2 disable 1', why: 'Dezactivează WPA2.' },
  ], 'config wlan security wpa wpa2 enable <id>.', 'config wlan security …'),
  cli({ id: '5.9-039' }, 3, 'Pe WLC (AireOS), pe WLAN-ul 1: activează cifrul AES pentru WPA2.', '(Cisco Controller) >', 'config wlan security wpa wpa2 ciphers aes enable 1', ['config wlan security wpa wpa2 ciphers aes enable 1'], [
    { text: 'config wlan security wpa wpa2 ciphers tkip enable 1', why: 'Activează TKIP, depreciat; se cere AES.' },
    { text: 'config wlan security wpa wpa2 aes enable 1', why: 'Lipsește cuvântul ciphers.' },
    { text: 'config wlan security wpa2 ciphers aes enable 1', why: 'Lipsește nivelul „wpa”.' },
  ], 'ciphers aes enable.', 'config wlan security wpa wpa2 …'),
  cli({ id: '5.9-040' }, 3, 'Pe WLC (AireOS), pe WLAN-ul 1: activează metoda de autentificare PSK (AKM).', '(Cisco Controller) >', 'config wlan security wpa akm psk enable 1', ['config wlan security wpa akm psk enable 1'], [
    { text: 'config wlan security wpa akm 802.1x enable 1', why: 'Activează 802.1X, nu PSK.' },
    { text: 'config wlan security wpa psk enable 1', why: 'Lipsește cuvântul akm.' },
    { text: 'config wlan security akm psk enable 1', why: 'Lipsește nivelul „wpa”.' },
  ], 'config wlan security wpa akm psk enable <id>.', 'config wlan security wpa akm …'),
];
