import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.9 Interpret the wireless LAN GUI configuration for client connectivity.
// Obiectivul oficial nu are sub-puncte; `sub` este '2.9'. Fiecare variantă are explicație (why).
const T = '2.9';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_9: Question[] = [
  // ======================= Imaginea de ansamblu / General =======================
  single({ id: '2.9-001' }, 1, 'Care sunt cele patru taburi principale ale unui WLAN în GUI-ul WLC (stil AireOS)?', [
    ['General, Security, QoS, Advanced', true, 'Acestea grupează setările WLAN-ului.'],
    ['Routing, Switching, VLAN, STP', false, 'Nu sunt taburi de WLAN.'],
    ['Radio, Antenna, Power, Channel', false, 'Sunt setări radio, nu taburile WLAN-ului.'],
    ['Users, Groups, Roles, Logs', false, 'Nu sunt taburile WLAN-ului.'],
  ], 'General / Security / QoS / Advanced.'),
  single({ id: '2.9-002' }, 1, 'Care este diferența dintre „Profile Name” și „SSID”?', [
    ['Profile Name este numele intern din GUI; SSID este numele pe care îl văd clienții', true, 'Pot fi identice, dar nu sunt același câmp.'],
    ['Sunt întotdeauna identice și nu se pot separa', false, 'Se pot seta separat.'],
    ['Profile Name este văzut de clienți, SSID de administrator', false, 'Invers.'],
    ['SSID este adresa MAC a AP-ului', false, 'Aceasta este BSSID.'],
  ], 'Profile intern, SSID public.'),
  single({ id: '2.9-003' }, 1, 'Ce definește câmpul „Interface/Interface Group” al unui WLAN?', [
    ['Interfața dinamică (VLAN și subrețea) în care sunt puși clienții', true, 'Mapează WLAN-ul pe VLAN (2.7).'],
    ['Portul fizic al AP-ului', false, 'Nu este portul AP-ului.'],
    ['Banda radio', false, 'Aceea este Radio Policy.'],
    ['Serverul RADIUS', false, 'Se setează în AAA Servers.'],
  ], 'Interface ⇒ VLAN.'),
  single({ id: '2.9-004' }, 2, 'Un WLAN nou creat nu este difuzat. Care este cauza cea mai probabilă?', [
    ['Status este Disabled (implicit la creare)', true, 'Trebuie activat după configurare.'],
    ['AP-ul este în modul Sniffer', false, 'Ar fi alt simptom.'],
    ['WPA2 nu este suportat', false, 'Nu este cauza probabilă.'],
    ['SSID-ul are 5 caractere', false, 'Lungimea nu e problemă.'],
  ], 'Status Enabled.'),
  single({ id: '2.9-005' }, 2, 'Care este ordinea recomandată la crearea unui WLAN?', [
    ['Creare → interfață → securitate → QoS → advanced → Enabled + Save', true, 'Configurezi complet, apoi activezi.'],
    ['Enabled → creare → securitate', false, 'Nu poți activa ceva neconfigurat.'],
    ['QoS → Enabled → creare', false, 'Ordinea nu are logică.'],
    ['Doar securitate, restul este automat', false, 'Interfața și celelalte tot trebuie alese.'],
  ], 'Disabled până la final.'),
  single({ id: '2.9-006' }, 2, 'Clientul se asociază la SSID-ul GUEST, dar nu primește IP. În GUI vezi „Interface = employee” pe WLAN-ul GUEST. Care este problema?', [
    ['WLAN-ul oaspeților este mapat pe interfața angajaților (VLAN greșit)', true, 'Clienții intră în VLAN-ul și DHCP-ul greșit.'],
    ['QoS este Bronze', false, 'QoS nu împiedică IP-ul.'],
    ['Broadcast SSID este Enabled', false, 'Nu cauzează asta.'],
    ['Session Timeout este 1800 s', false, 'Nu legat de IP.'],
  ], 'Verifică Interface.'),
  single({ id: '2.9-007' }, 2, 'Ce înseamnă „Broadcast SSID: Disabled”?', [
    ['SSID-ul nu este inclus în beacons (SSID „ascuns”); nu este un mecanism real de securitate', true, 'SSID-ul se poate afla din alte cadre.'],
    ['AP-ul își oprește radioul', false, 'Radioul rămâne activ.'],
    ['Clienții nu se pot conecta nici dacă știu SSID-ul', false, 'Se pot conecta dacă îl știu.'],
    ['Traficul este criptat mai bine', false, 'Nu are legătură cu criptarea.'],
  ], 'SSID ascuns ≠ securitate.'),
  single({ id: '2.9-008' }, 2, 'Pe un WLC Catalyst 9800 (IOS XE), cum sunt împărțite aceleași setări?', [
    ['WLAN profile (SSID, securitate), Policy profile (VLAN, QoS, timeout) și Policy tag care le leagă', true, 'Model pe obiecte separate.'],
    ['Într-un singur tab „General”', false, 'Nu este modelul 9800.'],
    ['Nu se pot configura WLAN-uri pe 9800', false, 'Se pot.'],
    ['Doar prin cloud', false, 'Există GUI și CLI locale.'],
  ], '9800: profile + policy + tag.'),
  single({ id: '2.9-009' }, 2, 'Ce setează „Radio Policy”?', [
    ['Pe ce benzi (2,4 GHz, 5 GHz) se difuzează SSID-ul', true, 'Control al benzilor pe WLAN.'],
    ['Puterea de emisie a AP-ului', false, 'Se setează la nivel de radio/RRM.'],
    ['Tipul de securitate', false, 'Se setează în Security.'],
    ['Profilul QoS', false, 'Se setează în QoS.'],
  ], 'Radio Policy = benzi.'),
  multi({ id: '2.9-010' }, 2, 'Care câmpuri apar în tabul General? (alege trei)', [
    ['Profile Name și SSID', true, 'Identitatea WLAN-ului.'],
    ['Status', true, 'Enabled / Disabled.'],
    ['Interface/Interface Group', true, 'Mapare pe VLAN.'],
    ['Auth Key Mgmt', false, 'Este în tabul Security.'],
    ['WMM Policy', false, 'Este în tabul QoS.'],
  ], 'General: identitate, status, interfață.'),

  // ======================= Security =======================
  single({ id: '2.9-011' }, 1, 'Pentru WPA2-Personal, ce valoare are „Auth Key Mgmt”?', [
    ['PSK', true, 'Parolă comună.'],
    ['802.1X', false, 'Aceea este Enterprise.'],
    ['SAE', false, 'Aceea este WPA3-Personal.'],
    ['None', false, 'None înseamnă fără securitate.'],
  ], 'PSK.'),
  single({ id: '2.9-012' }, 2, 'Pentru WPA2-Enterprise, ce trebuie configurat în plus față de „Auth Key Mgmt = 802.1X”?', [
    ['Un server RADIUS în AAA Servers', true, 'Autentificarea EAP se face la server.'],
    ['O parolă PSK', false, 'PSK este pentru Personal.'],
    ['Web Policy', false, 'Este pentru portal.'],
    ['Un profil QoS Platinum', false, 'Nu are legătură.'],
  ], '802.1X ⇒ RADIUS.'),
  single({ id: '2.9-013' }, 2, 'Ce valoare PMF cere WPA3?', [
    ['Required', true, 'WPA3 cere protecția cadrelor de management.'],
    ['Disabled', false, 'Nu este compatibil.'],
    ['Optional', false, 'Optional este pentru tranziție WPA2.'],
    ['Nu are legătură', false, 'PMF este obligatoriu la WPA3.'],
  ], 'PMF Required.'),
  single({ id: '2.9-014' }, 2, 'Ce criptare se recomandă la WPA2?', [
    ['AES (CCMP)', true, 'Algoritmul actual.'],
    ['TKIP', false, 'Învechit.'],
    ['WEP', false, 'Nesigur, scos din uz.'],
    ['Nicio criptare', false, 'Aceea este open.'],
  ], 'AES.'),
  single({ id: '2.9-015' }, 2, 'Care combinație configurează un WLAN pentru oaspeți cu portal captiv?', [
    ['Layer 2: None; Layer 3: Web Policy (Authentication sau Passthrough)', true, 'Asociere liberă, apoi redirecționare către portal.'],
    ['Layer 2: 802.1X; Layer 3: None', false, 'Aceea este Enterprise.'],
    ['Layer 2: PSK; Layer 3: None', false, 'Aceea este Personal.'],
    ['Layer 2: WEP; Layer 3: None', false, 'WEP este nesigur și învechit.'],
  ], 'Guest: L2 None + L3 Web Policy.'),
  single({ id: '2.9-016' }, 2, 'Care este lungimea unei fraze de acces (passphrase) WPA2-PSK în format ASCII?', [
    ['8–63 de caractere', true, 'Limitele standard.'],
    ['1–7 caractere', false, 'Prea scurt.'],
    ['64–128 de caractere', false, 'Peste limită (64 hex este alt format).'],
    ['Orice lungime', false, 'Există limite.'],
  ], '8–63 ASCII.'),
  single({ id: '2.9-017' }, 3, 'WLAN-ul are Auth Key Mgmt = 802.1X, dar niciun server în AAA Servers. Ce se întâmplă?', [
    ['Clienții se asociază, dar autentificarea 802.1X eșuează', true, 'Nu există cine să valideze credențialele.'],
    ['Clienții se conectează automat', false, 'Fără autentificare nu primesc acces.'],
    ['AP-ul se oprește', false, 'AP-ul rămâne funcțional.'],
    ['Se folosește PSK implicit', false, 'Nu există PSK implicit.'],
  ], '802.1X necesită RADIUS.'),
  single({ id: '2.9-018' }, 2, 'De ce nu este „MAC filtering” o securitate puternică?', [
    ['Adresele MAC se văd în aer și se pot clona', true, 'Un atacator poate copia un MAC permis.'],
    ['Nu funcționează pe WLC', false, 'Funcționează, dar este slab.'],
    ['Cere server RADIUS', false, 'Nu este cazul.'],
    ['Este criptat cu AES', false, 'Nu criptează.'],
  ], 'MAC filtering slab.'),
  { id: '2.9-019', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește tipul de securitate cu ce setezi în GUI.',
    leftLabel: 'Securitate', rightLabel: 'Setări',
    pairs: [
      { left: 'WPA2-Personal', right: 'WPA2 Policy + AES + Auth Key Mgmt PSK + passphrase', why: 'Parolă comună.' },
      { left: 'WPA2-Enterprise', right: 'WPA2 Policy + AES + 802.1X + server RADIUS', why: 'Identitate individuală.' },
      { left: 'WPA3-Personal', right: 'Auth Key Mgmt SAE + PMF Required', why: 'Handshake SAE.' },
      { left: 'Oaspeți cu portal', right: 'Layer 2 None + Layer 3 Web Policy', why: 'Portal captiv.' },
    ],
    distractors: [{ text: 'Static WEP key', why: 'Învechit și nesigur.' }],
    explanation: 'Fiecare tip are un set de câmpuri caracteristic.' },
  multi({ id: '2.9-020' }, 3, 'Care afirmații despre securitatea unui WLAN sunt corecte? (alege trei)', [
    ['802.1X necesită un server RADIUS', true, 'Autentificarea se face prin RADIUS.'],
    ['WPA3 cere PMF Required', true, 'Cadrele de management sunt protejate.'],
    ['AES este criptarea recomandată la WPA2', true, 'CCMP/AES.'],
    ['SSID ascuns înlocuiește WPA2', false, 'Nu oferă securitate reală.'],
    ['TKIP este recomandat în rețele noi', false, 'Este învechit.'],
  ], 'RADIUS, PMF, AES.'),

  // ======================= QoS =======================
  single({ id: '2.9-021' }, 1, 'Care profil QoS este destinat traficului de voce?', [
    ['Platinum', true, 'Cea mai mare prioritate.'],
    ['Gold', false, 'Este pentru video.'],
    ['Silver', false, 'Este best effort.'],
    ['Bronze', false, 'Este background.'],
  ], 'Platinum = voce.'),
  single({ id: '2.9-022' }, 1, 'Care profil QoS este implicit?', [
    ['Silver (best effort)', true, 'Valoarea implicită.'],
    ['Platinum', false, 'Nu este implicit.'],
    ['Gold', false, 'Nu este implicit.'],
    ['Bronze', false, 'Nu este implicit.'],
  ], 'Silver.'),
  single({ id: '2.9-023' }, 2, 'Ce profil QoS pui pe WLAN-ul de oaspeți?', [
    ['Bronze', true, 'Prioritate mică pentru trafic de fundal.'],
    ['Platinum', false, 'Ar acorda prioritate maximă oaspeților.'],
    ['Gold', false, 'Rezervat video.'],
    ['Nu se poate seta', false, 'Se poate seta.'],
  ], 'Guest = Bronze.'),
  single({ id: '2.9-024' }, 2, 'Ce înseamnă WMM Policy = Required?', [
    ['Doar clienții care suportă WMM se pot asocia', true, 'Clienții fără WMM sunt respinși.'],
    ['WMM este oprit', false, 'Aceea este Disabled.'],
    ['Toți clienții, indiferent de WMM, au prioritate', false, 'Aceea ar fi Allowed.'],
    ['AP-ul cere WMM de la WLC', false, 'Nu este sensul.'],
  ], 'Required = doar WMM.'),
  single({ id: '2.9-025' }, 2, 'Care sunt cele patru categorii WMM?', [
    ['Voce, video, best effort, background', true, 'AC_VO, AC_VI, AC_BE, AC_BK.'],
    ['Platinum, Gold, Silver, Bronze', false, 'Acestea sunt profilurile WLC.'],
    ['Low, Medium, High, Critical', false, 'Nu sunt categoriile WMM.'],
    ['Unicast, multicast, broadcast, anycast', false, 'Sunt tipuri de adresare.'],
  ], 'VO/VI/BE/BK.'),
  { id: '2.9-026', topicId: T, sub: T, type: 'match', difficulty: 1,
    stem: 'Potrivește profilul QoS cu tipul de trafic.',
    leftLabel: 'Profil', rightLabel: 'Trafic',
    pairs: [
      { left: 'Platinum', right: 'Voce', why: 'Platinum corespunde categoriei WMM AC_VO (voce).' },
      { left: 'Gold', right: 'Video', why: 'Gold corespunde categoriei WMM AC_VI (video).' },
      { left: 'Silver', right: 'Best effort', why: 'AC_BE, implicit.' },
      { left: 'Bronze', right: 'Background', why: 'Bronze corespunde categoriei WMM AC_BK (background).' },
    ],
    distractors: [{ text: 'Management', why: 'Nu este un profil QoS al WLAN-ului.' }],
    explanation: 'Voce / video / best effort / background.' },
  single({ id: '2.9-027' }, 3, 'Un WLAN pentru telefoane IP wireless este configurat cu QoS Bronze. Ce se întâmplă?', [
    ['Vocea primește prioritate minimă și calitatea scade (întârzieri, jitter)', true, 'Voce ⇒ Platinum.'],
    ['Vocea funcționează la fel', false, 'Prioritatea contează.'],
    ['Telefoanele nu se pot asocia', false, 'Se asociază, dar cu prioritate mică.'],
    ['Se activează Platinum automat', false, 'Nu se schimbă singur.'],
  ], 'Voce pe Bronze = prost.'),

  // ======================= Advanced =======================
  single({ id: '2.9-028' }, 2, 'Ce permite „Allow AAA Override”?', [
    ['Serverul RADIUS poate suprascrie VLAN-ul, QoS sau ACL-ul per utilizator', true, 'Un SSID, utilizatori în VLAN-uri diferite.'],
    ['Clienții pot ignora parola', false, 'Nu are legătură.'],
    ['AP-ul poate ignora WLC-ul', false, 'Nu are legătură.'],
    ['WLC-ul ignoră RADIUS', false, 'Este invers.'],
  ], 'AAA Override.'),
  single({ id: '2.9-029' }, 2, 'Ce face „Session Timeout”?', [
    ['Clientul se reautentifică după intervalul setat', true, 'Reînnoiește cheile și identitatea.'],
    ['Închide definitiv SSID-ul', false, 'Doar sesiunea clientului.'],
    ['Limitează lățimea de bandă', false, 'Nu are legătură.'],
    ['Setează durata beacon-ului', false, 'Aceea este altă setare.'],
  ], 'Reautentificare.'),
  single({ id: '2.9-030' }, 2, 'Ce face „Client Exclusion”?', [
    ['Exclude temporar clienții cu eșecuri repetate', true, 'Reduce abuzurile.'],
    ['Exclude AP-uri', false, 'Se referă la clienți.'],
    ['Exclude VLAN-uri', false, 'Nu are legătură.'],
    ['Exclude benzile radio', false, 'Nu are legătură.'],
  ], 'Client Exclusion.'),
  single({ id: '2.9-031' }, 2, 'Ce face „P2P Blocking” într-un WLAN de oaspeți?', [
    ['Împiedică comunicarea directă între clienții aceluiași WLAN', true, 'Oaspeții nu se văd între ei.'],
    ['Blochează accesul la Internet', false, 'Doar traficul între clienți.'],
    ['Blochează VoIP', false, 'Nu are legătură.'],
    ['Blochează adrese MAC necunoscute', false, 'Aceea este MAC filtering.'],
  ], 'P2P blocking.'),
  single({ id: '2.9-032' }, 3, 'Un client cu IP static nu poate folosi WLAN-ul, deși alte setări sunt corecte. Ce setare e probabil activată?', [
    ['DHCP Addr. Assignment Required', true, 'Clienții trebuie să obțină IP prin DHCP.'],
    ['Broadcast SSID', false, 'Nu afectează IP-ul.'],
    ['WMM Required', false, 'Nu are legătură cu adresarea.'],
    ['Session Timeout', false, 'Nu are legătură cu IP-ul static.'],
  ], 'DHCP Required.'),
  single({ id: '2.9-033' }, 3, 'Utilizatori diferiți ai aceluiași SSID ajung în VLAN-uri diferite, deși tabul General arată un singur VLAN. Explicația?', [
    ['AAA Override: RADIUS trimite VLAN-ul per utilizator', true, 'Suprascrie interfața WLAN-ului.'],
    ['AP-ul alege VLAN-ul aleator', false, 'Nu există această regulă.'],
    ['Client Band Select', false, 'Nu are legătură cu VLAN.'],
    ['DTIM', false, 'Nu are legătură cu VLAN.'],
  ], 'AAA Override.'),
  single({ id: '2.9-034' }, 2, 'Ce face „Client Band Select”?', [
    ['Îndeamnă clienții dual-band să folosească 5 GHz', true, 'Evită aglomerarea de pe 2,4 GHz.'],
    ['Alege banda de 6 GHz obligatoriu', false, 'Nu este regula.'],
    ['Oprește banda de 5 GHz', false, 'Din contră.'],
    ['Setează canalul AP-ului', false, 'Aceea este RRM.'],
  ], 'Band Select → 5 GHz.'),
  { id: '2.9-035', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește setarea din Advanced cu efectul ei.',
    leftLabel: 'Setare', rightLabel: 'Efect',
    pairs: [
      { left: 'Allow AAA Override', right: 'RADIUS poate seta VLAN/QoS/ACL per utilizator', why: 'Politici pe rol.' },
      { left: 'Session Timeout', right: 'Reautentificare după N secunde', why: 'Reînnoire.' },
      { left: 'Client Exclusion', right: 'Excludere temporară după eșecuri', why: 'Protecție.' },
      { left: 'P2P Blocking', right: 'Clienții nu comunică direct', why: 'Oaspeți.' },
    ],
    distractors: [{ text: 'Alege automat canalul AP-ului', why: 'Aceasta este RRM.' }],
    explanation: 'Fiecare setare are un efect precis.' },
  single({ id: '2.9-036' }, 2, 'Care setare cere ca un client să primească IP prin DHCP și nu prin configurare statică?', [
    ['DHCP Addr. Assignment Required', true, 'Respinge IP-urile statice.'],
    ['Allow AAA Override', false, 'Nu are legătură.'],
    ['Coverage Hole Detection', false, 'Se referă la acoperire.'],
    ['DTIM Period', false, 'Se referă la beacon/energie.'],
  ], 'DHCP Required.'),

  // ======================= CLI / ordine =======================
  { id: '2.9-037', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Pe un WLC AireOS, afișează rezumatul WLAN-urilor configurate.',
    prompt: '(Cisco Controller) >', canonical: 'show wlan summary', answers: ['show wlan summary'], hint: 'show wlan …',
    wrong: [
      { text: 'show ap summary', why: 'Afișează AP-urile, nu WLAN-urile.' },
      { text: 'show wlan', why: 'Incomplet; fără subcomanda summary.' },
      { text: 'show interface summary', why: 'Afișează interfețele logice.' },
    ],
    explanation: 'show wlan summary.' },
  { id: '2.9-038', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Pe un WLC AireOS, activează WLAN-ul cu ID 1.',
    prompt: '(Cisco Controller) >', canonical: 'config wlan enable 1', answers: ['config wlan enable 1'], hint: 'config wlan …',
    wrong: [
      { text: 'config wlan disable 1', why: 'Dezactivează WLAN-ul.' },
      { text: 'config wlan create 1', why: 'Creează WLAN-ul, nu îl activează.' },
      { text: 'enable wlan 1', why: 'Nu este sintaxa AireOS.' },
    ],
    explanation: 'config wlan enable 1.' },
  { id: '2.9-039', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii pentru a crea un WLAN WPA2-PSK.',
    items: [
      { text: 'WLANs → Create New: Profile Name, SSID, ID', why: 'Crearea obiectului WLAN.' },
      { text: 'General: alegi interfața (VLAN) a clienților', why: 'Fără ea clienții nu au rețea.' },
      { text: 'Security: Layer 2 WPA2, AES, PSK și parola', why: 'Autentificare și criptare.' },
      { text: 'QoS și Advanced: profil, timeout, excluderi', why: 'Comportament.' },
      { text: 'General: Status Enabled și Save Configuration', why: 'WLAN-ul devine activ și persistă.' },
    ],
    explanation: 'Creare → interfață → securitate → QoS/advanced → activare.' },
  { id: '2.9-040', topicId: T, sub: T, type: 'order', difficulty: 3,
    stem: 'Ordonează depanarea unui client care nu se poate conecta la un WLAN.',
    items: [
      { text: 'Verifici că WLAN-ul este Enabled și difuzat pe banda corectă', why: 'Fără SSID nu există conectare.' },
      { text: 'Verifici securitatea: Auth Key Mgmt, parola sau serverul RADIUS', why: 'Asocierea eșuează dacă nu se potrivește.' },
      { text: 'Verifici interfața/VLAN-ul și trunk-ul spre WLC', why: 'Fără VLAN, nu primește IP.' },
      { text: 'Verifici DHCP-ul pe VLAN-ul clienților', why: 'Fără DHCP nu primește IP.' },
      { text: 'Verifici setările advanced: timeout, excludere, max clienți', why: 'Pot respinge clientul.' },
    ],
    explanation: 'SSID → securitate → VLAN → DHCP → advanced.' },
];
