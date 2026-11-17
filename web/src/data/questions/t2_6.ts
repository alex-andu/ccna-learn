import type { Question } from '../../lib/types';

// Banca de întrebări pentru 2.6 Describe Cisco Wireless Architectures and AP modes.
// Obiectivul oficial nu are sub-puncte; `sub` este '2.6'. Fiecare variantă are explicație (why).
const T = '2.6';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });

export const Q_2_6: Question[] = [
  // ======================= Arhitecturi =======================
  single({ id: '2.6-001' }, 1, 'Care sunt cele patru arhitecturi wireless Cisco prezentate în obiectivul 2.6?', [
    ['Autonomous, lightweight + WLC, cloud-based, embedded', true, 'Diferă prin locul unde stă controlul.'],
    ['Ad-hoc, infrastructură, mesh, punct-la-punct', false, 'Acestea sunt moduri de topologie 802.11, nu arhitecturile Cisco.'],
    ['Two-tier, three-tier, spine-leaf, collapsed core', false, 'Acestea sunt arhitecturi cablate (1.2).'],
    ['2,4 GHz, 5 GHz, 6 GHz, 60 GHz', false, 'Sunt benzi de frecvență.'],
  ], 'Autonomous / lightweight / cloud / embedded.'),
  single({ id: '2.6-002' }, 1, 'Care este problema principală a AP-urilor autonome într-o rețea mare?', [
    ['Fiecare se configurează individual; nu există RRM sau politici centralizate', true, 'Nu scalează operațional.'],
    ['Nu pot folosi WPA2', false, 'Pot folosi securitate modernă.'],
    ['Nu pot servi clienți', false, 'Servesc clienți normal.'],
    ['Cer obligatoriu un WLC', false, 'Sunt independente, fără WLC.'],
  ], 'Management distribuit, greu de scalat.'),
  single({ id: '2.6-003' }, 1, 'Ce rol are un WLC?', [
    ['Gestionează centralizat AP-urile lightweight: configurație, RRM, securitate, roaming', true, 'Controllerul este „creierul” rețelei.'],
    ['Alocă adrese IP clienților', false, 'Aceea este DHCP.'],
    ['Comută cadrele între porturi VLAN', false, 'Asta face un switch.'],
    ['Traduce adrese private în publice', false, 'Aceea este NAT.'],
  ], 'WLC = control central.'),
  single({ id: '2.6-004' }, 2, 'Într-o arhitectură cloud-based (Meraki), ce trece prin cloud?', [
    ['Doar traficul de management; datele clienților rămân în rețeaua locală', true, 'Dashboard-ul gestionează, nu transportă datele.'],
    ['Tot traficul clienților', false, 'Ar fi ineficient și latent.'],
    ['Nimic, funcționează complet offline', false, 'Managementul depinde de cloud.'],
    ['Doar traficul DNS', false, 'Nu este regula.'],
  ], 'Management în cloud, date locale.'),
  single({ id: '2.6-005' }, 2, 'Un lanț de 150 de magazine mici, fără IT local, vrea administrare centralizată și zero-touch. Ce arhitectură se potrivește cel mai bine?', [
    ['Cloud-based (de exemplu Meraki)', true, 'Zero-touch, management din cloud, fără controller local.'],
    ['Autonomous, configurat manual la fiecare magazin', false, 'Nu scalează și necesită intervenție.'],
    ['Un WLC fizic în fiecare magazin', false, 'Cost și complexitate mari.'],
    ['Doar AP-uri în modul Sniffer', false, 'Sniffer nu servește clienți.'],
  ], 'Multe locații mici ⇒ cloud.'),
  single({ id: '2.6-006' }, 2, 'Ce reprezintă un controller wireless embedded (EWC)?', [
    ['Funcția WLC rulată pe un AP sau pe un switch Catalyst, pentru rețele mici', true, 'Fără hardware dedicat, capacitate limitată.'],
    ['Un AP autonom', false, 'EWC gestionează alte AP-uri.'],
    ['Un controller exclusiv în cloud public', false, 'EWC este local.'],
    ['Un tip de antenă', false, 'Este o funcție software.'],
  ], 'Embedded = controller integrat.'),
  single({ id: '2.6-007' }, 2, 'Care arhitectură folosește tuneluri CAPWAP între AP și controller?', [
    ['Lightweight + WLC (și embedded)', true, 'CAPWAP leagă AP-urile de controller.'],
    ['Autonomous', false, 'Nu există controller.'],
    ['Niciuna, CAPWAP e doar pentru VPN', false, 'CAPWAP este protocolul AP–WLC.'],
    ['Doar cloud-based, între AP-uri', false, 'Cloud-ul folosește altă conexiune de management.'],
  ], 'CAPWAP = AP ↔ WLC.'),
  { id: '2.6-008', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare scenariu cu arhitectura cea mai potrivită.',
    leftLabel: 'Scenariu', rightLabel: 'Arhitectură',
    pairs: [
      { left: 'Cabinet cu 2 AP, fără IT, un singur administrator', right: 'Autonomous (sau cloud-based)', why: 'Scară foarte mică.' },
      { left: 'Campus cu 300 de AP și roaming între clădiri', right: 'Lightweight + WLC', why: 'RRM și politici centralizate.' },
      { left: 'Sucursale numeroase, administrare dintr-un portal web', right: 'Cloud-based', why: 'Zero-touch și dashboard.' },
      { left: 'Sucursală cu 20 de AP care vrea funcții de controller fără hardware dedicat', right: 'Embedded (EWC)', why: 'Controller integrat.' },
    ],
    distractors: [{ text: 'Mesh exterior', why: 'Nu este o arhitectură de management.' }],
    explanation: 'Alegerea depinde de scară și de locul controlului.' },
  single({ id: '2.6-009' }, 3, 'Ce afirmație descrie corect avantajul principal al arhitecturii lightweight + WLC față de cea autonomă?', [
    ['Configurația, RRM și politicile se gestionează o singură dată, centralizat', true, 'Reduce erorile și permite roaming/RRM.'],
    ['Nu este nevoie de cabluri către AP', false, 'AP-urile tot au nevoie de legătură cablată.'],
    ['Traficul clienților nu mai trece niciodată prin rețea', false, 'În modul Local trece prin WLC.'],
    ['Nu mai este nevoie de VLAN-uri', false, 'VLAN-urile rămân necesare.'],
  ], 'Centralizare.'),
  multi({ id: '2.6-010' }, 2, 'Care sunt beneficii ale unui WLC? (alege trei)', [
    ['RRM: alegerea automată a canalelor și puterii', true, 'WLC-ul vede toate AP-urile.'],
    ['Roaming cu starea clientului păstrată', true, 'WLC-ul menține contextul clientului.'],
    ['Politici de securitate și QoS uniforme', true, 'Se definesc o singură dată.'],
    ['Eliminarea necesității de cablu către AP', false, 'AP-urile rămân cablate.'],
    ['Creșterea vitezei maxime a standardului radio', false, 'Viteza rămâne dată de standardul 802.11 folosit.'],
  ], 'Centralizare: RRM, roaming, politici.'),

  // ======================= CAPWAP / split-MAC =======================
  single({ id: '2.6-011' }, 1, 'Care sunt porturile UDP folosite de CAPWAP?', [
    ['5246 pentru control și 5247 pentru date', true, 'RFC 5415.'],
    ['5247 pentru control și 5246 pentru date', false, 'Inversate.'],
    ['12222 și 12223', false, 'Acestea erau ale LWAPP (istoric).'],
    ['80 și 443', false, 'Sunt porturi web.'],
  ], '5246 / 5247.'),
  single({ id: '2.6-012' }, 2, 'Ce protejează DTLS în CAPWAP?', [
    ['Obligatoriu tunelul de control; tunelul de date opțional', true, 'Controlul poartă chei și comenzi.'],
    ['Doar tunelul de date, obligatoriu', false, 'Controlul este obligatoriu criptat.'],
    ['Niciun tunel', false, 'Controlul este criptat.'],
    ['Ambele tuneluri, obligatoriu, fără excepție', false, 'Criptarea datelor este opțională.'],
  ], 'DTLS control obligatoriu.'),
  single({ id: '2.6-013' }, 2, 'Ce înseamnă arhitectura split-MAC?', [
    ['Funcțiile în timp real rămân pe AP, iar cele de management trec la WLC', true, 'Împărțirea funcțiilor MAC.'],
    ['Adresa MAC a AP-ului este împărțită între două VLAN-uri', false, 'Nu se referă la adrese.'],
    ['Cadrele sunt împărțite între două benzi', false, 'Nu are legătură cu benzile.'],
    ['AP-ul și WLC-ul au același MAC', false, 'Nu este definiția.'],
  ], 'Split-MAC.'),
  single({ id: '2.6-014' }, 2, 'Care funcție rulează pe AP, nu pe WLC, în arhitectura split-MAC?', [
    ['Răspunsul ACK și trimiterea beacon-urilor', true, 'Funcții cu cerințe de timp real.'],
    ['Alegerea canalelor pentru toate AP-urile (RRM)', false, 'RRM este la WLC.'],
    ['Autentificarea 802.1X', false, 'WLC-ul vorbește cu serverul RADIUS.'],
    ['Definirea WLAN-urilor', false, 'Se definesc pe WLC.'],
  ], 'Timp real = AP.'),
  single({ id: '2.6-015' }, 2, 'Un AP în modul Local trimite un cadru de la un client. Pe ce cale ajunge la destinație?', [
    ['Încapsulat în CAPWAP (UDP 5247) la WLC, apoi pe VLAN-ul WLAN-ului', true, 'Central switching.'],
    ['Direct pe portul AP-ului, pe VLAN-ul clientului', false, 'Aceasta este FlexConnect cu local switching.'],
    ['Prin cloud', false, 'Nu este cazul în Local mode.'],
    ['Prin DTLS 5246', false, '5246 este tunelul de control.'],
  ], 'Local ⇒ tunel la WLC.'),
  single({ id: '2.6-016' }, 3, 'Un AP lightweight este pornit, primește IP prin DHCP, dar nu apare pe WLC. Care verificare este adecvată?', [
    ['Dacă există rută către WLC, dacă option 43/DNS indică WLC-ul și dacă UDP 5246/5247 nu sunt blocate', true, 'Acestea sunt cauzele uzuale ale lipsei join-ului.'],
    ['Dacă SSID-ul are WPA3', false, 'Nu influențează alăturarea.'],
    ['Dacă clienții au IP', false, 'Clienții apar după join.'],
    ['Dacă AP-ul e în modul Sniffer', false, 'Nu împiedică join-ul.'],
  ], 'Depanare join.'),

  // ======================= Moduri AP =======================
  single({ id: '2.6-017' }, 1, 'Care este modul implicit al unui AP lightweight?', [
    ['Local', true, 'Servește clienți și tunelează datele la WLC.'],
    ['FlexConnect', false, 'Se activează explicit.'],
    ['Monitor', false, 'Nu servește clienți; nu este implicit.'],
    ['Sniffer', false, 'Este mod special.'],
  ], 'Default = Local.'),
  single({ id: '2.6-018' }, 2, 'Care mod permite comutarea locală a traficului și supraviețuirea la pierderea WLC?', [
    ['FlexConnect', true, 'Local switching + standalone.'],
    ['Local', false, 'Depinde de WLC.'],
    ['Monitor', false, 'Nu servește clienți.'],
    ['Rogue Detector', false, 'Nu servește clienți.'],
  ], 'FlexConnect.'),
  single({ id: '2.6-019' }, 2, 'Care mod captează cadre 802.11 și le trimite unui PC cu Wireshark?', [
    ['Sniffer', true, 'Captură către un analizor.'],
    ['Monitor', false, 'Folosește datele pentru IDS/rogue/localizare, nu le exportă unui analizor.'],
    ['SE-Connect', false, 'Analizează spectrul, nu cadre 802.11.'],
    ['Local', false, 'Servește clienți.'],
  ], 'Sniffer.'),
  single({ id: '2.6-020' }, 2, 'Care mod este dedicat IDS wireless, detectării rogue și localizării, fără a servi clienți?', [
    ['Monitor', true, 'Doar ascultă mediul radio.'],
    ['FlexConnect', false, 'Servește clienți.'],
    ['Bridge', false, 'Pentru backhaul wireless.'],
    ['Local', false, 'Servește clienți.'],
  ], 'Monitor.'),
  single({ id: '2.6-021' }, 2, 'Ce face modul Rogue Detector?', [
    ['Ascultă rețeaua cablată (ARP) și potrivește MAC-uri cu AP-uri rogue observate în aer', true, 'Identifică rogue conectate la rețea.'],
    ['Servește clienți și măsoară interferențe', false, 'Nu servește clienți.'],
    ['Creează tuneluri mesh', false, 'Aceea este Bridge/Mesh.'],
    ['Analizează spectrul radio', false, 'SE-Connect.'],
  ], 'Rogue Detector.'),
  single({ id: '2.6-022' }, 2, 'Care mod este potrivit pentru a identifica interferențe non-802.11 (cuptor cu microunde, Bluetooth)?', [
    ['SE-Connect', true, 'Analiză de spectru.'],
    ['Sniffer', false, 'Captează cadre 802.11, nu energie radio generală.'],
    ['Local', false, 'Servește clienți.'],
    ['FlexConnect', false, 'Servește clienți.'],
  ], 'SE-Connect.'),
  single({ id: '2.6-023' }, 2, 'Ce tip de port de switch se folosește de obicei pentru un AP în modul Local, respectiv FlexConnect cu local switching?', [
    ['Local: access; FlexConnect: trunk', true, 'Local tunelează tot; Flex termină VLAN-urile clienților.'],
    ['Local: trunk; FlexConnect: access', false, 'Invers.'],
    ['Ambele: access', false, 'Flex are nevoie de VLAN-urile clienților.'],
    ['Ambele: trunk, fără excepție', false, 'Local funcționează cu access.'],
  ], 'Access vs trunk.'),
  multi({ id: '2.6-024' }, 2, 'Care moduri AP NU servesc clienți? (alege trei)', [
    ['Monitor', true, 'Doar ascultă.'],
    ['Sniffer', true, 'Captează trafic.'],
    ['SE-Connect', true, 'Analiză de spectru.'],
    ['Local', false, 'Servește clienți.'],
    ['FlexConnect', false, 'Servește clienți.'],
  ], 'Monitor, Sniffer, SE-Connect (și Rogue Detector).'),
  { id: '2.6-025', topicId: T, sub: T, type: 'match', difficulty: 2,
    stem: 'Potrivește modul AP cu descrierea.',
    leftLabel: 'Mod', rightLabel: 'Descriere',
    pairs: [
      { left: 'Local', right: 'Implicit; tunel CAPWAP la WLC', why: 'Central switching.' },
      { left: 'FlexConnect', right: 'Local switching, autonomie la pierderea WLC', why: 'Sucursale.' },
      { left: 'Monitor', right: 'IDS, rogue, localizare; fără clienți', why: 'Securitate.' },
      { left: 'Sniffer', right: 'Captură 802.11 trimisă unui analizor', why: 'Depanare.' },
    ],
    distractors: [{ text: 'Mod de bridging pentru VLAN-uri', why: 'Nu corespunde niciunui mod AP.' }],
    explanation: 'Local / Flex / Monitor / Sniffer.' },
  single({ id: '2.6-026' }, 3, 'WAN-ul dintre sucursală și sediu cade. Ce se întâmplă cu un AP FlexConnect cu local switching versus unul Local?', [
    ['FlexConnect continuă să servească clienții; Local nu mai poate', true, 'Flex rămâne standalone; Local depinde de tunel.'],
    ['Ambele continuă normal', false, 'Local pierde tunelul.'],
    ['Ambele se opresc', false, 'Flex continuă.'],
    ['Local continuă, Flex se oprește', false, 'Invers.'],
  ], 'Flex = rezilient.'),

  // ======================= CLI =======================
  { id: '2.6-027', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'În pool-ul DHCP al AP-urilor, comunică WLC-ul 192.168.100.10 prin option 43 (hexazecimal).',
    prompt: 'R1(dhcp-config)#', canonical: 'option 43 hex f104.c0a8.640a', answers: ['option 43 hex f104.c0a8.640a', 'option 43 hex f104c0a8640a'], hint: 'option 43 hex …',
    wrong: [
      { text: 'option 43 ip 192.168.100.10', why: 'Option 43 se codifică hex (f1 + lungime + IP).' },
      { text: 'option 42 hex f104.c0a8.640a', why: 'Option 42 este NTP, nu informația pentru WLC.' },
      { text: 'dns-server 192.168.100.10', why: 'Nu transmite adresa WLC-ului.' },
    ],
    explanation: 'f1 04 c0a8640a.' },
  { id: '2.6-028', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Configurează portul switch-ului ca access, pentru un AP în modul Local.',
    prompt: 'SW1(config-if)#', canonical: 'switchport mode access', answers: ['switchport mode access'], hint: 'switchport mode …',
    wrong: [
      { text: 'switchport mode trunk', why: 'Trunk este pentru FlexConnect cu local switching.' },
      { text: 'switchport mode dynamic desirable', why: 'Nu este recomandat spre un AP.' },
      { text: 'no switchport', why: 'Ar face portul rutat.' },
    ],
    explanation: 'access pentru Local.' },
  { id: '2.6-029', topicId: T, sub: T, type: 'cli', difficulty: 1,
    stem: 'Configurează portul switch-ului ca trunk, pentru un AP FlexConnect cu mai multe VLAN-uri.',
    prompt: 'SW1(config-if)#', canonical: 'switchport mode trunk', answers: ['switchport mode trunk'], hint: 'switchport mode …',
    wrong: [
      { text: 'switchport mode access', why: 'Access oferă un singur VLAN.' },
      { text: 'switchport trunk allowed vlan all', why: 'Nu setează modul trunk.' },
      { text: 'channel-group 1 mode on', why: 'Aceasta creează un EtherChannel.' },
    ],
    explanation: 'trunk pentru Flex.' },
  { id: '2.6-030', topicId: T, sub: T, type: 'cli', difficulty: 2,
    stem: 'Pe un WLC AireOS, afișează lista AP-urilor alăturate.',
    prompt: '(Cisco Controller) >', canonical: 'show ap summary', answers: ['show ap summary'], hint: 'show ap …',
    wrong: [
      { text: 'show cdp neighbors', why: 'Arată vecinii CDP, nu AP-urile.' },
      { text: 'show wlan summary', why: 'Afișează WLAN-urile, nu AP-urile.' },
      { text: 'show ip interface brief', why: 'Arată interfețele L3 ale unui router/switch IOS.' },
    ],
    explanation: 'show ap summary.' },

  // ======================= Scenarii =======================
  single({ id: '2.6-031' }, 2, 'De ce are CAPWAP nevoie de DHCP option 43 sau DNS?', [
    ['Ca AP-ul să afle adresa WLC-ului în pasul de descoperire', true, 'Descoperirea poate folosi option 43, DNS, adrese memorate sau broadcast.'],
    ['Ca clienții să primească IP', false, 'Clienții primesc IP prin alt proces.'],
    ['Ca să cripteze tunelul', false, 'Aceea e DTLS.'],
    ['Ca să activeze PoE', false, 'PoE nu depinde de DHCP.'],
  ], 'Descoperirea WLC.'),
  single({ id: '2.6-032' }, 2, 'Un AP Local primește portul unui trunk cu mai multe VLAN-uri. Ce efect are asta?', [
    ['Funcționează, dar VLAN-urile clienților nu se văd pe port: datele pleacă în CAPWAP pe VLAN-ul nativ/de management', true, 'Local nu folosește VLAN-urile clienților pe port.'],
    ['AP-ul nu pornește', false, 'Poate porni.'],
    ['AP-ul trece automat în FlexConnect', false, 'Modul nu se schimbă automat.'],
    ['WLC-ul se închide', false, 'Nu există această consecință.'],
  ], 'Local nu folosește VLAN-urile clienților pe port.'),
  single({ id: '2.6-033' }, 2, 'Ce protocol este înlocuit de CAPWAP ca standard pentru comunicația AP–WLC?', [
    ['LWAPP', true, 'Protocolul Cisco anterior.'],
    ['RADIUS', false, 'Este protocol AAA.'],
    ['SNMP', false, 'Este monitorizare.'],
    ['OSPF', false, 'Este rutare.'],
  ], 'LWAPP → CAPWAP.'),
  single({ id: '2.6-034' }, 3, 'Care dintre cerințe indică FlexConnect?', [
    ['Sucursală la distanță, WAN lent, trebuie să funcționeze și când WAN-ul cade', true, 'Local switching și standalone.'],
    ['Campus cu LAN gigabit și WLC local', false, 'Local mode este potrivit.'],
    ['Detecție de rogue AP', false, 'Monitor / Rogue Detector.'],
    ['Captură de cadre pentru Wireshark', false, 'Sniffer.'],
  ], 'Flex pentru WAN.'),
  single({ id: '2.6-035' }, 2, 'Care este rolul RRM într-o rețea cu WLC?', [
    ['Ajustează automat canalele și puterea de emisie ale AP-urilor', true, 'Radio Resource Management.'],
    ['Alocă adrese IP AP-urilor', false, 'Adresarea IP a AP-urilor se face prin DHCP; RRM se ocupă doar de canale și putere.'],
    ['Criptează tunelul CAPWAP', false, 'Criptarea tunelului de control o face DTLS, nu RRM.'],
    ['Convertește 802.11 în 802.3', false, 'Face AP-ul.'],
  ], 'RRM.'),
  single({ id: '2.6-036' }, 3, 'Un AP este setat în modul Monitor și un utilizator se plânge că nu se poate conecta la SSID-ul acelui AP. Explicația?', [
    ['În modul Monitor AP-ul nu servește clienți', true, 'Doar ascultă.'],
    ['Parola este greșită', false, 'Problema este modul AP.'],
    ['Banda este 6 GHz', false, 'Nu este legată de plângere.'],
    ['AP-ul este în Local', false, 'Local servește clienți.'],
  ], 'Monitor ≠ clienți.'),
  single({ id: '2.6-037' }, 2, 'Ce reprezintă „central switching” la un AP Local?', [
    ['Traficul clienților este trimis prin tunel la WLC, care îl pune pe VLAN-ul potrivit', true, 'Comutarea se face central.'],
    ['Traficul este comutat local pe AP', false, 'Aceea este local switching.'],
    ['Traficul trece prin cloud', false, 'Nu este vorba de cloud.'],
    ['Traficul este copiat către un analizor', false, 'Sniffer.'],
  ], 'Central switching.'),
  { id: '2.6-038', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează pașii prin care un AP lightweight intră în starea Run.',
    items: [
      { text: 'AP-ul primește adresă IP (DHCP)', why: 'Fără IP nu poate căuta WLC-ul.' },
      { text: 'AP-ul își descoperă WLC-ul (option 43, DNS, adrese salvate, broadcast)', why: 'Obține lista de WLC-uri candidate.' },
      { text: 'Se stabilește tunelul DTLS de control și are loc join-ul', why: 'Autentificare reciprocă și înregistrare.' },
      { text: 'AP-ul descarcă imaginea (dacă diferă) și configurația', why: 'Primește politica centralizată.' },
      { text: 'AP-ul intră în starea Run și servește clienți', why: 'Este operațional.' },
    ],
    explanation: 'IP → descoperire → DTLS/join → imagine/config → Run.' },
  { id: '2.6-039', topicId: T, sub: T, type: 'order', difficulty: 2,
    stem: 'Ordonează căutarea unui AP care nu se alătură WLC-ului.',
    items: [
      { text: 'Verifici alimentarea PoE și legătura portului', why: 'Fără putere/link nu există nimic altceva.' },
      { text: 'Verifici VLAN-ul portului și că AP-ul primește IP', why: 'Fără IP nu continuă.' },
      { text: 'Verifici că AP-ul află adresa WLC (option 43/DNS) și că există rută', why: 'Fără adresa WLC (option 43, DNS) AP-ul nu are unde să facă join.' },
      { text: 'Verifici că UDP 5246/5247 nu sunt filtrate', why: 'ACL/firewall pe traseu.' },
      { text: 'Verifici pe WLC licența/limita de AP și log-urile de join', why: 'Licența sau limita de AP pot bloca join-ul chiar dacă rețeaua e corectă.' },
    ],
    explanation: 'Putere → VLAN/IP → descoperire → porturi → WLC.' },
  multi({ id: '2.6-040' }, 3, 'Care afirmații despre cloud-based vs controller-based sunt corecte? (alege trei)', [
    ['Cloud-based poate fi administrat de oriunde printr-un dashboard', true, 'Avantaj al modelului cloud.'],
    ['Controller-based folosește CAPWAP între AP și WLC', true, 'Tuneluri de control și date.'],
    ['În cloud-based, traficul clienților rămâne local', true, 'Doar managementul merge în cloud.'],
    ['Cloud-based elimină orice dependență de licențe', false, 'De obicei necesită licențe.'],
    ['Controller-based nu poate face roaming', false, 'Roaming este un avantaj major.'],
  ], 'Cloud: management; controller: CAPWAP.'),
];
