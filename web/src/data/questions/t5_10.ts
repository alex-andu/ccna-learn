import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.10 Configure and verify WLAN within the GUI using WPA2 PSK.
// Obiectivul oficial nu are sub-puncte; `sub` = '5.10'. Fiecare variantă are explicație (why).
const T = '5.10';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_10: Question[] = [
  // ======================= Pregătire și setări =======================
  single({ id: '5.10-001' }, 1, 'Care este scopul obiectivului 5.10?', [
    ['Să creezi și să verifici în GUI-ul controllerului un WLAN securizat cu WPA2-PSK', true, 'Este un obiectiv „Configure and verify”: creezi WLAN-ul, setezi securitatea și verifici conectarea.'],
    ['Să descrii istoria WEP', false, 'Istoricul este la 5.9, iar 5.10 este practic.'],
    ['Să configurezi 802.1X cu RADIUS', false, 'Aceasta este Enterprise; aici este PSK.'],
    ['Să configurezi VLAN-uri pe switch', false, 'Aceasta ține de domeniul 2.'],
  ], '5.10 = WPA2-PSK în GUI.'),
  single({ id: '5.10-002' }, 1, 'Ce combinație de setări în Security → Layer 2 creează un WLAN WPA2-PSK?', [
    ['Layer 2 Security WPA+WPA2, WPA2 Policy cu AES și Auth Key Management PSK', true, 'Acestea sunt cele trei alegeri esențiale, plus parola.'],
    ['Layer 2 Security None și AKM 802.1X', false, 'None înseamnă rețea deschisă; 802.1X cere RADIUS.'],
    ['WPA Policy cu TKIP și AKM PSK', false, 'WPA/TKIP este generația veche, nu WPA2/AES.'],
    ['WEP cu cheie de 40 de biți', false, 'WEP este spart.'],
  ], 'WPA2 + AES + PSK.'),
  single({ id: '5.10-003' }, 1, 'Ce lungime poate avea o parolă WPA2-PSK în format ASCII?', [
    ['8–63 de caractere', true, 'Din ea se derivă PMK-ul.'],
    ['4–8 caractere', false, 'Prea scurt; minimul este 8.'],
    ['Exact 64 de caractere ASCII', false, '64 se aplică la HEX, nu la ASCII.'],
    ['Orice număr de caractere', false, 'Există limite.'],
  ], 'ASCII: 8–63.'),
  single({ id: '5.10-004' }, 2, 'Ce cere formatul HEX pentru PSK?', [
    ['Exact 64 de cifre hexazecimale', true, 'Cele 64 de cifre reprezintă direct cheia de 256 de biți (PMK).'],
    ['8–63 de cifre hexazecimale', false, 'Aceasta este plaja ASCII, nu HEX.'],
    ['32 de cifre hexazecimale', false, 'Nu este valoarea corectă.'],
    ['Orice caractere, ca la ASCII', false, 'HEX acceptă doar 0–9 și a–f.'],
  ], 'HEX: 64 cifre.'),
  single({ id: '5.10-005' }, 2, 'Care dintre parolele de mai jos este validă ca PSK ASCII?', [
    ['Fraza-Lunga-2026', true, '16 caractere ASCII imprimabile.'],
    ['parola', false, 'Doar 6 caractere: sub minimul de 8.'],
    ['Parolă-lungă-2026', false, 'Conține „ă”, caracter non-ASCII.'],
    ['O frază de 70 de caractere ASCII', false, '70 de caractere: peste maximul de 63.'],
  ], '8–63 ASCII imprimabil.'),
  single({ id: '5.10-006' }, 2, 'De ce sunt problematice diacriticele (ă, ș, ț) într-o parolă PSK?', [
    ['Nu sunt caractere ASCII și pot fi respinse sau interpretate diferit de client/controller', true, 'Folosește doar ASCII imprimabil pentru compatibilitate.'],
    ['Pentru că parolele nu pot conține litere', false, 'Pot conține litere ASCII.'],
    ['Pentru că diacriticele sunt criptate de AP', false, 'Nu este un efect.'],
    ['Nu sunt problematice deloc', false, 'Pot crea nepotriviri.'],
  ], 'Doar ASCII în PSK.'),
  single({ id: '5.10-007' }, 1, 'Care este lungimea maximă a unui SSID?', [
    ['32 de caractere', true, 'Limita standardului 802.11.'],
    ['8 caractere', false, 'Aceasta este lungimea minimă a parolei PSK.'],
    ['63 de caractere', false, 'Aceasta este lungimea maximă a parolei ASCII.'],
    ['64 de caractere', false, 'Aceasta este lungimea parolei HEX.'],
  ], 'SSID ≤ 32.'),
  single({ id: '5.10-008' }, 2, 'Ce rol are câmpul „Interface/Interface Group” din tabul General al WLAN-ului?', [
    ['Mapează WLAN-ul pe o interfață dinamică (VLAN, IP, server DHCP)', true, 'Clienții WLAN-ului intră în VLAN-ul acelei interfețe.'],
    ['Stabilește parola WPA2', false, 'Parola este în Security.'],
    ['Alege banda de frecvență', false, 'Aceasta este Radio Policy.'],
    ['Stabilește numele SSID-ului', false, 'SSID-ul se setează la creare.'],
  ], 'Interface = VLAN al WLAN-ului.'),
  single({ id: '5.10-009' }, 2, 'Ai creat un WLAN nou, dar clientul nu îl vede. Care este primul lucru de verificat?', [
    ['Dacă Status este Enabled', true, 'Un WLAN nou rămâne dezactivat până îl activezi explicit.'],
    ['Dacă parola are 8 caractere', false, 'Parola nu influențează vizibilitatea SSID-ului.'],
    ['Dacă tipul de cifru este AES', false, 'Cifrul influențează conectarea, nu vizibilitatea.'],
    ['Dacă WLAN ID-ul este egal cu VLAN ID-ul', false, 'Nu trebuie să fie egale.'],
  ], 'Enable pe WLAN.'),
  single({ id: '5.10-010' }, 2, 'Care este diferența dintre „Profile Name” și „SSID”?', [
    ['Profile Name este numele intern din controller; SSID este numele vizibil clienților', true, 'Pot fi identice sau diferite.'],
    ['Sunt întotdeauna identice și nu se pot separa', false, 'Se pot seta diferit.'],
    ['Profile Name apare doar în cadrele radio', false, 'Cadrele radio poartă SSID-ul, nu numele de profil.'],
    ['SSID este numărul unic al WLAN-ului', false, 'Numărul unic este WLAN ID.'],
  ], 'Profil = intern; SSID = public.'),
  single({ id: '5.10-011' }, 1, 'Ce este WLAN ID?', [
    ['Un număr unic cu care controllerul identifică WLAN-ul (folosit în CLI)', true, 'De exemplu: config wlan enable 1.'],
    ['Numărul VLAN', false, 'VLAN-ul vine din interfața mapată.'],
    ['Canalul radio', false, 'Canalul este un parametru al AP-ului.'],
    ['Adresa MAC a AP-ului', false, 'Nu are legătură.'],
  ], 'WLAN ID = număr unic.'),
  single({ id: '5.10-012' }, 2, 'De ce se evită bifarea TKIP lângă AES la un WLAN WPA2?', [
    ['TKIP este depreciat și mixed mode slăbește securitatea întregului WLAN', true, 'Un client TKIP poate trage rețeaua în jos.'],
    ['TKIP este mai rapid decât AES', false, 'De obicei este mai lent și nu mai este recomandat.'],
    ['TKIP nu poate fi bifat', false, 'Poate, dar nu este recomandat.'],
    ['TKIP înlocuiește parola', false, 'Nu are legătură cu parola.'],
  ], 'Doar AES.'),
  single({ id: '5.10-013' }, 2, 'Ce înseamnă Auth Key Mgmt = PSK?', [
    ['Clienții se autentifică cu o parolă comună, fără server RADIUS', true, 'PSK este modul Personal.'],
    ['Clienții folosesc certificate și RADIUS', false, 'Aceasta este 802.1X.'],
    ['Rețeaua este deschisă', false, 'Rețeaua deschisă are Layer 2 Security None.'],
    ['Se folosește SAE', false, 'SAE este o altă valoare AKM (WPA3).'],
  ], 'PSK = parolă comună.'),

  // ======================= Verificare și depanare =======================
  single({ id: '5.10-014' }, 2, 'Clientul vede SSID-ul, dar nu se poate conecta. Parola introdusă diferă doar prin litere mari/mici față de cea din controller. Rezultatul?', [
    ['Conectarea eșuează: parola PSK este sensibilă la litere mari/mici', true, 'MIC-ul din 4-way handshake nu se potrivește.'],
    ['Se conectează, pentru că litera nu contează', false, 'Contează.'],
    ['Se conectează, dar fără criptare', false, 'Nu există un asemenea comportament.'],
    ['AP-ul își schimbă SSID-ul', false, 'Nu are legătură.'],
  ], 'PSK e case-sensitive.'),
  single({ id: '5.10-015' }, 3, 'La ce mesaj din 4-way handshake eșuează conectarea cu parolă greșită?', [
    ['La mesajul 2 (SNonce + MIC): AP-ul constată că MIC-ul nu se potrivește', true, 'Clientul a calculat PTK-ul din altă parolă, deci MIC-ul este greșit.'],
    ['La mesajul 1', false, 'Mesajul 1 doar transmite ANonce; clientul nu a dovedit încă nimic.'],
    ['Nu eșuează niciodată', false, 'Eșuează.'],
    ['La DHCP', false, 'DHCP vine după handshake.'],
  ], 'Parola greșită → MIC greșit la M2.'),
  single({ id: '5.10-016' }, 2, 'Un client WPA3-only se conectează la un WLAN configurat doar WPA2-PSK. Ce se întâmplă?', [
    ['Nu se conectează: nu există o metodă de autentificare comună (SAE vs PSK)', true, 'Soluții: WPA3/transition mode pe WLAN sau client în WPA2.'],
    ['Se conectează automat', false, 'AKM nu coincide.'],
    ['AP-ul trece singur pe WPA3', false, 'AP-ul nu își schimbă politica singur.'],
    ['Clientul folosește WEP', false, 'WEP nu intră în discuție.'],
  ], 'Politici diferite → fără conectare.'),
  single({ id: '5.10-017' }, 2, 'Un laptop WPA (TKIP) încearcă să se conecteze la un WLAN WPA2/AES-only. Rezultat?', [
    ['Nu se conectează: generația și cifrul nu coincid', true, 'Clientul și AP-ul trebuie să aibă o combinație comună.'],
    ['Se conectează, pentru că WPA2 este compatibil cu orice', false, 'Compatibilitatea depinde de politica configurată.'],
    ['Se conectează cu parola goală', false, 'Parola este obligatorie.'],
    ['Se conectează doar pe 2,4 GHz', false, 'Banda nu schimbă politica.'],
  ], 'Potrivește generația și cifrul.'),
  single({ id: '5.10-018' }, 2, 'Un client se conectează, dar primește 169.254.x.x. Ce indică?', [
    ['Nu a primit adresă DHCP: problemă la interfața/VLAN-ul WLAN-ului sau la DHCP', true, 'Autentificarea Wi-Fi a reușit, dar IP-ul nu.'],
    ['Parola este greșită', false, 'Cu parolă greșită nici nu se asociază.'],
    ['SSID-ul este ascuns', false, 'Nu are legătură cu IP-ul.'],
    ['AES nu este activat', false, 'Fără AES nu s-ar fi conectat.'],
  ], 'APIPA = DHCP.'),
  single({ id: '5.10-019' }, 2, 'Ce efect are dezactivarea „Broadcast SSID”?', [
    ['SSID-ul nu mai apare în lista rețelelor, dar nu devine mai sigur', true, 'Numele rămâne vizibil în alte cadre; protecția vine din WPA2.'],
    ['Traficul devine criptat', false, 'Nu criptează.'],
    ['Parola nu mai este necesară', false, 'Rămâne necesară.'],
    ['Clienții primesc mai multă viteză', false, 'Nu are efect de viteză.'],
  ], 'SSID ascuns ≠ securitate.'),
  single({ id: '5.10-020' }, 2, 'Unde vezi în GUI clienții conectați la WLAN?', [
    ['Monitor → Clients', true, 'Arată SSID, stare, IP, VLAN, tip de securitate.'],
    ['Controller → Interfaces', false, 'Acolo configurezi interfețele.'],
    ['Wireless → Access Points → Radios', false, 'Acolo vezi radiourile AP-urilor.'],
    ['Management → SNMP', false, 'Acolo configurezi SNMP.'],
  ], 'Monitor → Clients.'),
  single({ id: '5.10-021' }, 2, 'De ce nu se recomandă interfața „management” pentru WLAN-urile clienților?', [
    ['Traficul utilizatorilor trebuie separat de cel de administrare a controllerului', true, 'Altfel clienții ar împărți VLAN-ul de management.'],
    ['Interfața management nu poate avea IP', false, 'Are IP.'],
    ['Interfața management nu suportă DHCP, deci niciun WLAN nu merge', false, 'Nu este motivul principal.'],
    ['Pentru că WPA2 nu merge pe ea', false, 'Securitatea nu depinde de interfață.'],
  ], 'Separă userii de management.'),
  single({ id: '5.10-022' }, 2, 'Pe un Catalyst 9800, unde setezi securitatea Layer 2 a WLAN-ului?', [
    ['Configuration → Tags & Profiles → WLANs → Security → Layer2', true, 'Acolo alegi WPA2/WPA3, AKM și parola.'],
    ['Monitoring → Clients', false, 'Aceasta este monitorizare.'],
    ['Administration → Reload', false, 'Nu are legătură.'],
    ['Troubleshooting → Packet Capture', false, 'Nu se configurează acolo securitatea.'],
  ], '9800: Tags & Profiles → WLANs.'),
  single({ id: '5.10-023' }, 2, 'Radio Policy este setată la „5 GHz only”. Ce client nu va vedea WLAN-ul?', [
    ['Unul care suportă doar 2,4 GHz', true, 'WLAN-ul nu este oferit pe 2,4 GHz.'],
    ['Unul care suportă 5 GHz', false, 'Acesta îl vede.'],
    ['Niciunul', false, 'Clienții doar-2,4 GHz nu îl văd.'],
    ['Toți clienții', false, 'Cei cu 5 GHz îl văd.'],
  ], 'Radio Policy filtrează benzile.'),
  single({ id: '5.10-024' }, 3, 'În lista WLANs apare „[WPA2][Auth(PSK)]” la Security Policies. Ce înseamnă?', [
    ['WLAN-ul folosește WPA2 cu autentificare PSK', true, 'Este rezumatul setărilor Layer 2.'],
    ['WLAN-ul este deschis', false, 'Un WLAN deschis ar afișa „None”.'],
    ['WLAN-ul folosește 802.1X', false, 'Ar apărea „Auth(802.1X)”.'],
    ['WLAN-ul este WPA3', false, 'WPA3 ar fi afișat diferit (SAE).'],
  ], '[WPA2][Auth(PSK)] = WPA2-PSK.'),
  single({ id: '5.10-025' }, 3, 'După ce creezi WLAN-ul și setezi totul corect, clientul se conectează, dar nu ajunge la resursele din VLAN 10; are IP din VLAN 30. Ce ai greșit?', [
    ['WLAN-ul este mapat pe interfața greșită („guest”, VLAN 30)', true, 'Interfața din General determină VLAN-ul clienților.'],
    ['Parola PSK este prea lungă', false, 'Dacă ar fi fost invalidă, clientul nu s-ar conecta.'],
    ['AES este dezactivat', false, 'Fără AES nu s-ar conecta.'],
    ['SSID-ul are 32 de caractere', false, 'Nu are legătură cu VLAN-ul.'],
  ], 'Interfață greșită = VLAN greșit.'),
  single({ id: '5.10-026' }, 3, 'De ce este importantă o parolă PSK lungă și unică?', [
    ['Pentru că un handshake capturat permite un atac de dicționar offline asupra parolei WPA2-PSK', true, 'Parola lungă și aleatorie face atacul impracticabil.'],
    ['Pentru că parola scurtă blochează AP-ul', false, 'Nu are acest efect.'],
    ['Pentru că AP-ul compară parola cu SSID-ul', false, 'SSID-ul este doar salt la derivare.'],
    ['Pentru că parola lungă mărește viteza', false, 'Nu schimbă viteza.'],
  ], 'Parolă lungă = rezistență la dicționar.'),

  // ======================= Multi =======================
  multi({ id: '5.10-027' }, 2, 'Ce trebuie setat pentru un WLAN WPA2-PSK funcțional? (alege toate variantele corecte)', [
    ['SSID și Profile Name', true, 'Definesc WLAN-ul.'],
    ['Interfața (VLAN) corectă', true, 'Clienții trebuie plasați într-un VLAN cu DHCP.'],
    ['WPA2 Policy cu AES și AKM = PSK', true, 'Politica de securitate.'],
    ['Parola PSK și Status = Enabled', true, 'Fără ele nu există autentificare, respectiv difuzare.'],
    ['Un server RADIUS', false, 'Nu este necesar la PSK.'],
  ], 'SSID, interfață, WPA2+AES+PSK, parolă, Enabled.'),
  multi({ id: '5.10-028' }, 2, 'Care pot fi cauze pentru „clientul vede SSID-ul dar nu se conectează”? (alege toate variantele corecte)', [
    ['Parola diferă (inclusiv litere mari/mici)', true, 'MIC nepotrivit.'],
    ['Clientul folosește WPA3-only, iar WLAN-ul este WPA2', true, 'AKM necompatibil.'],
    ['Clientul folosește TKIP, iar WLAN-ul doar AES', true, 'Cifru necompatibil.'],
    ['WLAN-ul oferă PSK, dar clientul e configurat pentru 802.1X', true, 'AKM diferit.'],
    ['Radio Policy interzice banda clientului', false, 'Atunci clientul nici nu ar vedea SSID-ul.'],
  ], 'Parolă, WPA3-only, TKIP, AKM.'),
  multi({ id: '5.10-029' }, 2, 'Ce acțiuni verifică un WLAN WPA2-PSK? (alege toate variantele corecte)', [
    ['show wlan <id>', true, 'Arată securitatea și starea.'],
    ['Lista WLANs din GUI (Status Enabled, [WPA2][Auth(PSK)])', true, 'Rezumat vizual.'],
    ['Monitor → Clients după conectarea unui client', true, 'Confirmă asocierea reală.'],
    ['Conectarea unui client de test', true, 'Test practic cu parola corectă și una greșită.'],
    ['show ip route', false, 'Nu verifică WLAN-ul.'],
  ], 'show wlan, GUI, clienți, test.'),

  // ======================= Match / Order =======================
  match({ id: '5.10-030' }, 2, 'Potrivește câmpul din GUI cu rolul lui.', [
    { left: 'Profile Name', right: 'Numele intern al WLAN-ului din controller', why: 'Nu este vizibil clienților.' },
    { left: 'SSID', right: 'Numele rețelei afișat clienților', why: 'Este transmis în beacon.' },
    { left: 'Interface', right: 'Maparea clienților pe un VLAN/interfață dinamică', why: 'Determină IP-ul clientului.' },
    { left: 'Auth Key Mgmt', right: 'Metoda de autentificare (PSK, 802.1X, SAE…)', why: 'AKM.' },
  ], [
    { text: 'Canalul radio al AP-ului', why: 'Se setează pe radio, nu pe WLAN.' },
    { text: 'Adresa MAC a clientului', why: 'Nu este un câmp al WLAN-ului.' },
  ], 'Fiecare câmp are rolul lui.'),
  match({ id: '5.10-031' }, 3, 'Potrivește simptomul cu cauza cea mai probabilă.', [
    { left: 'Clientul nu vede SSID-ul', right: 'WLAN Disabled sau AP nealăturat', why: 'SSID-ul nu este difuzat.' },
    { left: 'Vede SSID, dar eșuează la autentificare', right: 'Parolă sau politică de securitate diferită', why: 'Handshake eșuează.' },
    { left: 'Conectat, dar 169.254.x.x', right: 'DHCP lipsă pe interfața/VLAN-ul WLAN-ului', why: 'Nu a primit IP.' },
    { left: 'Conectat, dar în alt VLAN decât cel dorit', right: 'WLAN mapat pe interfața greșită', why: 'VLAN-ul vine din Interface.' },
  ], [
    { text: 'Cablul AP-ului este prea lung', why: 'Nu explică aceste simptome.' },
    { text: 'Parola are 64 de caractere ASCII', why: 'Ar fi respinsă la configurare, nu cauzează aceste simptome.' },
  ], 'Simptom → cauză.'),
  order({ id: '5.10-032' }, 2, 'Ordonează pașii creării unui WLAN WPA2-PSK în GUI.', [
    { text: 'Verifici/creezi interfața dinamică (VLAN, IP, DHCP)', why: 'WLAN-ul are nevoie de o interfață de mapat.' },
    { text: 'WLANs → Create New: profil, SSID, ID', why: 'Creezi WLAN-ul.' },
    { text: 'Tab General: Enabled și Interface', why: 'Pornești WLAN-ul și îl mapezi pe VLAN.' },
    { text: 'Security → Layer 2: WPA+WPA2, AES, PSK, parola', why: 'Setezi autentificarea și criptarea.' },
    { text: 'Apply și testezi cu un client', why: 'Salvezi și verifici.' },
  ], 'Interfață → creare → General → Security → Apply/test.'),
  order({ id: '5.10-033' }, 2, 'Ordonează evenimentele conectării unui client la WLAN-ul WPA2-PSK.', [
    { text: 'Clientul descoperă SSID-ul (beacon/probe)', why: 'Prima etapă.' },
    { text: 'Autentificare Open System și asociere', why: 'Leagă clientul de AP.' },
    { text: '4-way handshake (parola dovedită prin MIC)', why: 'Derivă cheile.' },
    { text: 'DHCP: clientul primește IP din VLAN-ul interfeței', why: 'Acum are conectivitate IP.' },
    { text: 'Traficul criptat cu AES-CCMP', why: 'Datele circulă protejate.' },
  ], 'Descoperire → asociere → handshake → DHCP → date.'),

  // ======================= CLI =======================
  cli({ id: '5.10-034' }, 2, 'Pe WLC (AireOS): creează WLAN-ul cu ID 1, profilul CORP și SSID-ul CORP.', '(Cisco Controller) >', 'config wlan create 1 CORP CORP', ['config wlan create 1 CORP CORP'], [
    { text: 'config wlan add 1 CORP CORP', why: 'Verbul este create, nu add.' },
    { text: 'wlan create 1 CORP CORP', why: 'Lipsește cuvântul config.' },
    { text: 'config wlan create CORP CORP 1', why: 'ID-ul vine primul, apoi profilul și SSID-ul.' },
  ], 'config wlan create <id> <profil> <ssid>.', 'config wlan …'),
  cli({ id: '5.10-035' }, 2, 'Pe WLC (AireOS): mapează WLAN-ul 1 pe interfața „employee”.', '(Cisco Controller) >', 'config wlan interface 1 employee', ['config wlan interface 1 employee'], [
    { text: 'config wlan vlan 1 employee', why: 'Se mapează pe o interfață, nu direct pe un VLAN.' },
    { text: 'config wlan interface employee 1', why: 'ID-ul WLAN-ului este primul.' },
    { text: 'config interface wlan 1 employee', why: 'Ordinea cuvintelor este greșită.' },
  ], 'config wlan interface <id> <interfață>.', 'config wlan interface …'),
  cli({ id: '5.10-036' }, 3, 'Pe WLC (AireOS): setează parola ASCII Fraza-Lunga-2026 pe WLAN-ul 1 (PSK).', '(Cisco Controller) >', 'config wlan security wpa akm psk set-key ascii Fraza-Lunga-2026 1', ['config wlan security wpa akm psk set-key ascii Fraza-Lunga-2026 1'], [
    { text: 'config wlan security wpa akm psk set-key hex Fraza-Lunga-2026 1', why: 'Formatul hex cere 64 de cifre hexazecimale, nu o frază ASCII.' },
    { text: 'config wlan security wpa psk set-key ascii Fraza-Lunga-2026 1', why: 'Lipsește cuvântul akm.' },
    { text: 'config wlan security wpa akm psk set-key ascii 1 Fraza-Lunga-2026', why: 'Parola vine înaintea ID-ului WLAN.' },
  ], 'set-key ascii <parola> <id>.', 'config wlan security wpa akm psk set-key …'),
  cli({ id: '5.10-037' }, 1, 'Pe WLC (AireOS): activează WLAN-ul 1.', '(Cisco Controller) >', 'config wlan enable 1', ['config wlan enable 1'], [
    { text: 'config wlan disable 1', why: 'Dezactivează WLAN-ul.' },
    { text: 'config wlan up 1', why: 'Nu este cuvânt-cheie valid.' },
    { text: 'wlan enable 1', why: 'Lipsește cuvântul config.' },
  ], 'config wlan enable <id>.', 'config wlan …'),
  cli({ id: '5.10-038' }, 1, 'Pe WLC (AireOS): afișează configurația detaliată a WLAN-ului 1, inclusiv securitatea.', '(Cisco Controller) >', 'show wlan 1', ['show wlan 1'], [
    { text: 'show wlan summary', why: 'Afișează lista scurtă a WLAN-urilor, nu detaliile.' },
    { text: 'show security wlan 1', why: 'Nu este sintaxa AireOS.' },
    { text: 'show wlans 1', why: 'Comanda este show wlan (singular).' },
  ], 'show wlan <id>.', 'show wlan …'),
  cli({ id: '5.10-039' }, 3, 'Pe WLC (AireOS): dezactivează TKIP pe WPA2 pentru WLAN-ul 1.', '(Cisco Controller) >', 'config wlan security wpa wpa2 ciphers tkip disable 1', ['config wlan security wpa wpa2 ciphers tkip disable 1'], [
    { text: 'config wlan security wpa wpa2 ciphers aes disable 1', why: 'Dezactivează AES, exact opusul.' },
    { text: 'config wlan security wpa wpa2 ciphers tkip enable 1', why: 'Activează TKIP.' },
    { text: 'config wlan security wpa2 ciphers tkip disable 1', why: 'Lipsește nivelul „wpa”.' },
  ], 'ciphers tkip disable.', 'config wlan security wpa wpa2 ciphers …'),
  cli({ id: '5.10-040' }, 1, 'Pe WLC (AireOS): afișează lista clienților conectați.', '(Cisco Controller) >', 'show client summary', ['show client summary'], [
    { text: 'show clients', why: 'Nu este sintaxa AireOS.' },
    { text: 'show wlan summary', why: 'Afișează WLAN-urile, nu clienții.' },
    { text: 'show ap summary', why: 'Afișează AP-urile alăturate.' },
  ], 'show client summary.', 'show client …'),
];
