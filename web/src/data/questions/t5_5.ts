import type { Question } from '../../lib/types';

// Banca de întrebări pentru 5.5 Describe IPsec remote access and site-to-site VPNs.
// Obiectivul oficial nu are sub-puncte; `sub` = '5.5'. Fiecare variantă are explicație (why).
const T = '5.5';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_5_5: Question[] = [
  // ======================= Concepte =======================
  single({ id: '5.5-001' }, 1, 'Ce face un VPN?', [
    ['Creează un tunel securizat (criptat) peste o rețea nesigură, de exemplu Internetul', true, 'Protejează confidențialitatea și integritatea traficului între capete.'],
    ['Atribuie adrese IP automat', false, 'Aceasta este DHCP.'],
    ['Traduce adrese private în publice', false, 'Aceasta este NAT.'],
    ['Sincronizează ceasurile', false, 'Aceasta este NTP.'],
  ], 'VPN = tunel criptat peste rețea nesigură.'),
  single({ id: '5.5-002' }, 1, 'Care sunt cele două scenarii VPN din obiectivul 5.5?', [
    ['Site-to-site și remote access', true, 'Legătură între rețele, respectiv între un utilizator și rețeaua companiei.'],
    ['Intra-VLAN și inter-VLAN', false, 'Sunt scenarii de comutare/rutare, nu VPN.'],
    ['Unicast și multicast', false, 'Sunt tipuri de trafic.'],
    ['Autentificare și autorizare', false, 'Sunt funcții AAA.'],
  ], 'Site-to-site + remote access.'),
  single({ id: '5.5-003' }, 1, 'Cum se caracterizează un VPN site-to-site?', [
    ['Leagă două rețele prin gateway-uri, de obicei permanent, transparent pentru gazde', true, 'Gazdele nu au nevoie de software VPN.'],
    ['Cere un client software pe fiecare calculator', false, 'Aceasta este caracteristica remote access.'],
    ['Funcționează doar în LAN', false, 'Este folosit peste rețele nesigure, de exemplu Internetul.'],
    ['Nu folosește criptare', false, 'Criptarea este scopul VPN-ului.'],
  ], 'Site-to-site = gateway ↔ gateway.'),
  single({ id: '5.5-004' }, 2, 'Un angajat se conectează de acasă la rețeaua companiei cu un client software, pe durata sesiunii. Ce tip de VPN este?', [
    ['Remote access', true, 'Conexiune individuală, la cerere, prin client.'],
    ['Site-to-site', false, 'Site-to-site leagă rețele întregi, permanent.'],
    ['MPLS', false, 'MPLS este o tehnologie de furnizor, nu un client VPN.'],
    ['VLAN trunk', false, 'Nu are legătură cu VPN.'],
  ], 'Remote access = utilizator individual.'),
  single({ id: '5.5-005' }, 2, 'Care este un avantaj major al unui VPN față de o linie privată închiriată între sedii?', [
    ['Folosește Internetul public, mai ieftin, adăugând securitatea prin criptare', true, 'Costul este mai mic decât al liniilor dedicate.'],
    ['Garantează întotdeauna latență mai mică', false, 'Internetul public nu garantează latența.'],
    ['Elimină nevoia de rutare', false, 'Rutarea rămâne necesară.'],
    ['Elimină nevoia de firewall', false, 'Nu înlocuiește firewall-ul.'],
  ], 'VPN = cost mai mic + criptare.'),

  // ======================= Componente IPsec =======================
  single({ id: '5.5-006' }, 2, 'Ce porturi/protocoale folosește IKE pentru negociere?', [
    ['UDP 500 (și UDP 4500 cu NAT-T)', true, 'IKE rulează peste UDP; 4500 apare când există NAT pe cale.'],
    ['TCP 22', false, 'Este SSH.'],
    ['TCP 443 doar', false, 'Este portul TLS/SSL VPN, nu IKE.'],
    ['UDP 161', false, 'Este SNMP.'],
  ], 'IKE = UDP 500 / 4500.'),
  single({ id: '5.5-007' }, 2, 'Ce număr de protocol IP are ESP?', [
    ['50', true, 'ESP = protocol IP 50.'],
    ['51', false, 'Este AH.'],
    ['47', false, 'Este GRE.'],
    ['6', false, 'Este TCP.'],
  ], 'ESP = 50; AH = 51; GRE = 47.'),
  single({ id: '5.5-008' }, 2, 'Care este diferența principală dintre ESP și AH?', [
    ['ESP poate cripta și autentifica; AH doar autentifică (fără criptare)', true, 'AH nu oferă confidențialitate.'],
    ['AH criptează, ESP doar autentifică', false, 'Este invers.'],
    ['Ambele oferă doar compresie', false, 'Niciuna nu este de compresie.'],
    ['AH funcționează doar prin NAT', false, 'AH nu funcționează cu NAT, pentru că autentifică antetul IP.'],
  ], 'ESP = criptare + integritate; AH = doar integritate.'),
  single({ id: '5.5-009' }, 2, 'Ce este o Security Association (SA)?', [
    ['Acord unidirecțional cu algoritmii, cheile și durata folosite pentru protecția traficului', true, 'Pentru trafic în ambele sensuri există două SA IPsec.'],
    ['O listă de acces', false, 'ACL-ul definește traficul de interes, nu SA.'],
    ['Un tip de adresă IP', false, 'Nu este adresă.'],
    ['Un certificat digital', false, 'Certificatul poate fi folosit la autentificare, dar nu este SA.'],
  ], 'SA = parametrii + chei, unidirecțional.'),

  // ======================= Fluxul =======================
  single({ id: '5.5-010' }, 2, 'Ce declanșează, de obicei, ridicarea unui tunel IPsec site-to-site configurat cu crypto map?', [
    ['Un pachet care se potrivește cu ACL-ul traficului de interes', true, 'Traficul „de interes” pornește negocierea IKE.'],
    ['Un pachet DHCP', false, 'Nu are legătură cu IPsec.'],
    ['Comanda show crypto isakmp sa', false, 'Afișează starea, nu ridică tunelul.'],
    ['Repornirea PC-ului', false, 'Nu declanșează tunelul.'],
  ], 'Trafic de interes → IKE.'),
  single({ id: '5.5-011' }, 2, 'Care este rezultatul fazei 1 (IKEv1)?', [
    ['O IKE (ISAKMP) SA: canal sigur de management pentru negocierea ulterioară', true, 'Include schimbul DH și autentificarea capetelor.'],
    ['Datele utilizatorilor criptate', false, 'Datele sunt protejate după faza 2.'],
    ['O rută statică', false, 'Nu creează rute.'],
    ['O adresă IP pentru client', false, 'Nu atribuie adrese.'],
  ], 'Faza 1 = IKE SA.'),
  single({ id: '5.5-012' }, 2, 'Care este rezultatul fazei 2 (IKEv1)?', [
    ['IPsec SA (una pe sens) pentru protejarea datelor', true, 'Se negociază în interiorul IKE SA.'],
    ['Autentificarea utilizatorului cu MFA', false, 'MFA nu este parte a fazei 2.'],
    ['Cheia partajată (PSK)', false, 'PSK este configurat dinainte, nu produs în faza 2.'],
    ['Tabela de rutare', false, 'Nu produce rute.'],
  ], 'Faza 2 = IPsec SA.'),

  // ======================= Moduri =======================
  single({ id: '5.5-013' }, 2, 'În tunnel mode, ce se întâmplă cu pachetul IP original?', [
    ['Este încapsulat integral într-un pachet nou, cu adresele gateway-urilor', true, 'Adresele interne devin invizibile în Internet.'],
    ['Rămâne neschimbat, doar datele sunt criptate', false, 'Aceasta este transport mode.'],
    ['Este șters', false, 'Este protejat și încapsulat, nu șters.'],
    ['Este transformat în pachet ARP', false, 'Nu are legătură.'],
  ], 'Tunnel mode = antet IP nou.'),
  single({ id: '5.5-014' }, 3, 'De ce AH nu funcționează bine prin NAT?', [
    ['Autentifică antetul IP, iar NAT modifică adresele din antet, deci verificarea de integritate eșuează', true, 'ESP nu autentifică antetul IP exterior.'],
    ['AH folosește porturi pe care NAT le blochează', false, 'AH nu are porturi; este protocol IP 51.'],
    ['AH criptează prea tare', false, 'AH nu criptează.'],
    ['NAT nu poate procesa IPv4', false, 'NAT lucrează cu IPv4.'],
  ], 'AH + NAT = incompatibil.'),
  single({ id: '5.5-015' }, 2, 'Ce rezolvă NAT-T (NAT Traversal)?', [
    ['Încapsulează ESP în UDP 4500 ca să treacă prin dispozitive NAT/PAT', true, 'ESP „gol” nu are porturi, deci PAT nu îl poate traduce.'],
    ['Criptează traficul HTTP', false, 'Nu este rolul NAT-T.'],
    ['Înlocuiește IKE', false, 'IKE rămâne necesar.'],
    ['Dezactivează criptarea', false, 'Nu dezactivează nimic.'],
  ], 'NAT-T = ESP în UDP 4500.'),

  // ======================= Remote access =======================
  single({ id: '5.5-016' }, 2, 'Ce porturi folosește tipic un VPN SSL/TLS cu Cisco Secure Client?', [
    ['TCP 443 (TLS) și UDP 443 (DTLS)', true, 'Trece ușor prin firewall-uri, fiind similar traficului HTTPS.'],
    ['Doar UDP 500', false, 'Aceasta este negocierea IKE a IPsec.'],
    ['TCP 23', false, 'Este Telnet.'],
    ['UDP 69', false, 'Este TFTP.'],
  ], 'TLS VPN = 443.'),
  single({ id: '5.5-017' }, 2, 'Ce înseamnă split tunneling la un VPN remote access?', [
    ['Doar traficul către rețelele corporative trece prin tunel; restul iese direct pe Internet', true, 'Economisește banda gateway-ului, dar traficul Internet nu mai este inspectat de companie.'],
    ['Tot traficul trece prin tunel', false, 'Aceasta este full tunnel.'],
    ['Tunelul se împarte în două VLAN-uri', false, 'Nu are legătură cu VLAN.'],
    ['Se folosesc două parole', false, 'Nu are legătură cu parolele.'],
  ], 'Split = doar traficul corporativ în tunel.'),
  single({ id: '5.5-018' }, 3, 'Unde se implementează de obicei MFA pentru un VPN remote access?', [
    ['La autentificarea utilizatorului prin AAA (RADIUS/ISE/furnizor de identitate)', true, 'Serverul validează parola și cere al doilea factor.'],
    ['În ACL-ul de interes', false, 'ACL-ul nu autentifică utilizatori.'],
    ['În transform set', false, 'Transform set definește algoritmii de protecție a datelor.'],
    ['În antetul ESP', false, 'ESP nu poartă autentificarea utilizatorului.'],
  ], 'MFA = AAA/IdP.'),

  // ======================= Înrudite și verificare =======================
  single({ id: '5.5-019' }, 3, 'De ce se folosește GRE peste IPsec?', [
    ['GRE poate transporta multicast și protocoale de rutare, iar IPsec adaugă criptarea', true, 'IPsec cu crypto map nu transportă multicast; GRE nu criptează.'],
    ['GRE criptează mai bine decât ESP', false, 'GRE nu criptează.'],
    ['GRE elimină nevoia de IKE', false, 'IKE rămâne pentru IPsec.'],
    ['GRE este protocol de nivel 2', false, 'GRE este un protocol de încapsulare la nivel IP (47).'],
  ], 'GRE + IPsec = rutare dinamică securizată.'),
  single({ id: '5.5-020' }, 2, 'Pe R1, show crypto isakmp sa afișează starea QM_IDLE și ACTIVE. Ce înseamnă?', [
    ['Faza 1 s-a încheiat cu succes: IKE SA este activă', true, 'QM_IDLE = pregătit pentru Quick Mode (faza 2).'],
    ['Faza 1 a eșuat', false, 'Eșecul apare ca MM_NO_STATE sau lipsa intrării.'],
    ['Tunelul nu a fost configurat', false, 'Intrarea există, deci negocierea a avut loc.'],
    ['ACL-ul este greșit', false, 'Starea nu indică o problemă de ACL.'],
  ], 'QM_IDLE = IKE SA activă.'),

  // ======================= Recapitulare =======================
  single({ id: '5.5-021' }, 2, 'Care dintre acestea NU este un obiectiv de securitate oferit de IPsec?', [
    ['Alocarea automată a adreselor IP clienților de pe LAN', true, 'Aceasta este DHCP; IPsec protejează traficul.'],
    ['Confidențialitate', false, 'Oferită prin criptare (ESP).'],
    ['Integritate', false, 'Oferită prin HMAC.'],
    ['Protecție anti-replay', false, 'Oferită prin numere de secvență.'],
  ], 'IPsec: confidențialitate, integritate, autentificare, anti-replay.'),
  single({ id: '5.5-022' }, 2, 'Două routere au PSK-uri diferite. Ce se întâmplă la negociere?', [
    ['Autentificarea fazei 1 eșuează și tunelul nu se ridică', true, 'Capetele nu se pot autentifica.'],
    ['Tunelul se ridică, dar fără criptare', false, 'Nu există o ridicare fără autentificare.'],
    ['Tunelul trece automat la certificate', false, 'Nu face schimb automat.'],
    ['Se folosește PSK-ul implicit „cisco”', false, 'Nu există un PSK implicit.'],
  ], 'PSK diferit = faza 1 eșuează.'),
  single({ id: '5.5-023' }, 3, 'ACL-ul traficului de interes de pe R1 este „permit ip 192.168.1.0/24 → 192.168.3.0/24”. Cum trebuie să fie ACL-ul de pe R3?', [
    ['Oglindit: permit ip 192.168.3.0/24 → 192.168.1.0/24', true, 'Cele două capete trebuie să convină asupra acelorași identități proxy, în sens invers.'],
    ['Identic cu al lui R1', false, 'Ar duce la nepotrivire în faza 2.'],
    ['deny ip any any', false, 'Ar bloca tot traficul de interes.'],
    ['Nu este nevoie de ACL pe R3', false, 'Fiecare capăt are propriul ACL.'],
  ], 'ACL oglindit.'),
  single({ id: '5.5-024' }, 2, 'În show crypto ipsec sa, #pkts encaps crește, dar #pkts decaps rămâne 0. Care este cea mai probabilă cauză?', [
    ['Celălalt capăt nu răspunde sau ESP/UDP 4500 este blocat pe cale', true, 'Pachetele pleacă criptate, dar nu se primește nimic înapoi.'],
    ['Faza 1 nu s-a ridicat deloc', false, 'Dacă encaps crește, SA-urile există.'],
    ['Parola enable este greșită', false, 'Nu are legătură cu IPsec.'],
    ['VLAN-ul este greșit', false, 'Nu este legat de contoare.'],
  ], 'encaps fără decaps = problemă la peer sau pe cale.'),
  single({ id: '5.5-025' }, 2, 'De ce traficul VPN trebuie exceptat din NAT pe gateway?', [
    ['Altfel adresele ar fi traduse înainte de potrivirea cu ACL-ul de interes și tunelul nu mai este folosit', true, 'Ordinea operațiilor: NAT poate schimba adresele înainte să fie criptat.'],
    ['Pentru că NAT nu funcționează cu IPsec deloc', false, 'Funcționează (cu NAT-T); problema este potrivirea cu ACL-ul.'],
    ['Pentru că NAT cripteză pachetele', false, 'NAT nu criptează.'],
    ['Pentru că NAT șterge ESP', false, 'Nu șterge ESP.'],
  ], 'NAT exemption pentru traficul VPN.'),
  single({ id: '5.5-026' }, 2, 'Ce rol are Diffie-Hellman în IKE?', [
    ['Permite celor două capete să obțină aceeași cheie secretă fără să o transmită', true, 'Un observator al schimbului nu o poate calcula.'],
    ['Criptează direct datele utilizatorilor', false, 'Derivă chei; criptarea datelor o face ESP.'],
    ['Alocă adrese IP', false, 'Nu are legătură cu adresarea.'],
    ['Autentifică prin amprentă', false, 'Nu are legătură cu biometria.'],
  ], 'DH = acord de cheie.'),
  single({ id: '5.5-027' }, 2, 'Cum se numește mesajul de „faza 2” în IKEv1?', [
    ['Quick Mode', true, 'Faza 2 folosește Quick Mode (3 mesaje).'],
    ['Main Mode', false, 'Main Mode este faza 1.'],
    ['Aggressive Mode', false, 'Aggressive Mode este tot faza 1, cu mai puține mesaje.'],
    ['Fast Mode', false, 'Nu este un mod IKE.'],
  ], 'Faza 2 = Quick Mode.'),
  single({ id: '5.5-028' }, 3, 'Care este avantajul IKEv2 față de IKEv1?', [
    ['Mai puține mesaje, suport nativ pentru NAT-T și EAP, structură mai simplă', true, 'IKEv2 este recomandat în implementările noi.'],
    ['Nu folosește chei', false, 'Folosește chei.'],
    ['Funcționează fără criptare', false, 'Criptarea rămâne esențială.'],
    ['Nu are nevoie de peer', false, 'Are nevoie de două capete.'],
  ], 'IKEv2 = modern, simplificat.'),
  multi({ id: '5.5-029' }, 2, 'Ce obiective de securitate oferă IPsec? (alege toate variantele corecte)', [
    ['Confidențialitate', true, 'Prin criptare (ESP).'],
    ['Integritate', true, 'Prin HMAC.'],
    ['Autentificarea originii', true, 'Prin PSK sau certificate.'],
    ['Protecție anti-replay', true, 'Prin numere de secvență.'],
    ['Alocare dinamică de adrese', false, 'Aceasta este DHCP.'],
  ], 'IPsec: C, I, autentificare, anti-replay.'),
  multi({ id: '5.5-030' }, 3, 'Ce trebuie să fie compatibil între cele două capete pentru ca faza 1 să reușească? (alege toate variantele corecte)', [
    ['Algoritmul de criptare', true, 'Face parte din politica IKE.'],
    ['Grupul Diffie-Hellman', true, 'Altfel schimbul de chei nu funcționează.'],
    ['Metoda de autentificare (PSK sau certificate) și cheia/certificatul', true, 'Capetele trebuie să se autentifice reciproc.'],
    ['Culoarea cablului WAN', false, 'Nu are legătură.'],
    ['Numele hostului', false, 'Nu trebuie identic.'],
  ], 'Politici IKE compatibile.'),
  multi({ id: '5.5-031' }, 3, 'Ce trebuie permis pe un firewall din calea tunelului IPsec? (alege toate variantele corecte)', [
    ['UDP 500', true, 'Negocierea IKE.'],
    ['UDP 4500', true, 'IKE/ESP cu NAT-T.'],
    ['Protocolul IP 50 (ESP)', true, 'Traficul de date IPsec fără NAT-T.'],
    ['TCP 23', false, 'Este Telnet.'],
    ['UDP 69', false, 'Este TFTP.'],
  ], 'UDP 500/4500 și protocol 50.'),
  match({ id: '5.5-032' }, 2, 'Potrivește protocolul/portul cu rolul lui în IPsec.', [
    { left: 'UDP 500', right: 'IKE', why: 'Negociere de chei și politici.' },
    { left: 'UDP 4500', right: 'NAT-T', why: 'IKE/ESP încapsulate pentru NAT.' },
    { left: 'IP protocol 50', right: 'ESP', why: 'Criptare + integritate.' },
    { left: 'IP protocol 51', right: 'AH', why: 'Doar integritate/autentificare.' },
  ], [
    { text: 'TCP 25', why: 'Este SMTP.' },
  ], 'IKE 500; NAT-T 4500; ESP 50; AH 51.'),
  match({ id: '5.5-033' }, 2, 'Potrivește termenul cu sensul lui.', [
    { left: 'Tunnel mode', right: 'Pachetul original e încapsulat într-un pachet IP nou', why: 'Folosit la site-to-site.' },
    { left: 'Transport mode', right: 'Antetul IP original rămâne; se protejează datele', why: 'Gazdă ↔ gazdă.' },
    { left: 'Split tunnel', right: 'Doar traficul corporativ trece prin tunel', why: 'Restul iese direct pe Internet.' },
    { left: 'Full tunnel', right: 'Tot traficul clientului trece prin tunel', why: 'Poate fi inspectat de companie.' },
  ], [
    { text: 'Doar traficul DNS trece prin tunel', why: 'Nu este un mod standard.' },
  ], 'Moduri IPsec și tuneluri.'),
  order({ id: '5.5-034' }, 3, 'Ordonează etapele ridicării unui tunel IPsec site-to-site.', [
    { text: 'Apare trafic de interes', why: 'Declanșează negocierea.' },
    { text: 'IKE faza 1: se creează IKE SA', why: 'Canal sigur de management.' },
    { text: 'IKE faza 2: se creează IPsec SA', why: 'Chei pentru date.' },
    { text: 'Datele circulă protejate prin ESP', why: 'Traficul LAN–LAN este criptat.' },
  ], 'Trafic → faza 1 → faza 2 → date.'),
  order({ id: '5.5-035' }, 3, 'Ordonează pașii unei conexiuni remote access cu client VPN.', [
    { text: 'Utilizatorul pornește clientul și alege gateway-ul', why: 'Începutul sesiunii.' },
    { text: 'Gateway-ul se autentifică (certificat de server)', why: 'Clientul verifică identitatea gateway-ului.' },
    { text: 'Utilizatorul se autentifică (parolă + MFA, prin AAA)', why: 'Verificarea identității utilizatorului.' },
    { text: 'Clientul primește o adresă internă și traficul trece prin tunel', why: 'Sesiunea este activă.' },
  ], 'Gateway → utilizator → adresă → trafic.'),
  cli({ id: '5.5-036' }, 3, 'Ești în R1(config)#. Creează politica IKE (faza 1) cu prioritatea 10.', 'R1(config)#', 'crypto isakmp policy 10', ['crypto isakmp policy 10'], [
    { text: 'crypto ipsec policy 10', why: 'Politica IKE se numește isakmp, nu ipsec.' },
    { text: 'isakmp policy 10', why: 'Comanda începe cu crypto.' },
    { text: 'crypto ike policy 10', why: 'Pe IOS clasic se folosește cuvântul isakmp.' },
  ], 'crypto isakmp policy <prioritate>.', 'crypto isakmp …'),
  cli({ id: '5.5-037' }, 3, 'Ești în R1(config-isakmp)#. Setează autentificarea cu cheie partajată.', 'R1(config-isakmp)#', 'authentication pre-share', ['authentication pre-share'], [
    { text: 'authentication psk', why: 'Cuvântul cheie este pre-share.' },
    { text: 'authentication shared-key', why: 'Nu este sintaxa IOS.' },
    { text: 'pre-share authentication', why: 'Comanda începe cu authentication.' },
  ], 'authentication pre-share.', 'authentication …'),
  cli({ id: '5.5-038' }, 3, 'Ești în R1(config-if)# pe interfața WAN. Aplică crypto map-ul CMAP.', 'R1(config-if)#', 'crypto map CMAP', ['crypto map CMAP'], [
    { text: 'crypto map CMAP 10', why: 'Numărul de intrare apare la definirea map-ului, nu la aplicarea pe interfață.' },
    { text: 'ip crypto-map CMAP', why: 'Nu este sintaxa IOS.' },
    { text: 'ipsec apply CMAP', why: 'Nu este comandă IOS.' },
  ], 'Pe interfață: crypto map <nume>.', 'crypto …'),
  cli({ id: '5.5-039' }, 2, 'Ești în R1#. Verifică starea fazei 1 (ISAKMP SA).', 'R1#', 'show crypto isakmp sa', ['show crypto isakmp sa'], [
    { text: 'show crypto ipsec sa', why: 'Afișează faza 2 și contoarele, nu starea fazei 1.' },
    { text: 'show isakmp sa', why: 'Comanda începe cu show crypto.' },
    { text: 'show crypto vpn', why: 'Nu este comandă IOS.' },
  ], 'show crypto isakmp sa.', 'show crypto isakmp …'),
  cli({ id: '5.5-040' }, 2, 'Ești în R1#. Afișează SA-urile IPsec și contoarele de pachete criptate/decriptate.', 'R1#', 'show crypto ipsec sa', ['show crypto ipsec sa'], [
    { text: 'show crypto isakmp sa', why: 'Afișează doar faza 1.' },
    { text: 'show ipsec sa', why: 'Comanda începe cu show crypto.' },
    { text: 'show crypto tunnel', why: 'Nu este comandă IOS.' },
  ], 'show crypto ipsec sa.', 'show crypto ipsec …'),
];
