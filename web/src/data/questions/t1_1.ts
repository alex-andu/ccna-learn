import type { Question } from '../../lib/types';

// Banca de întrebări pentru 1.1 Explain the role and function of network components.
// Fiecare variantă are explicație — atât cea corectă, cât și cele greșite.
const T = '1.1';

export const Q_1_1: Question[] = [
  // ======================= 1.1 — imaginea de ansamblu =======================
  {
    id: '1.1-001', topicId: T, sub: '1.1', type: 'single', difficulty: 1,
    stem: 'Un pachet trece de la un PC printr-un switch L2 și apoi printr-un router spre Internet. Ce se întâmplă cu adresele, în mod normal (fără NAT), când pachetul trece prin router?',
    options: [
      { id: 'a', text: 'Adresele IP sursă și destinație rămân aceleași; adresele MAC sunt înlocuite cu cele ale legăturii următoare', correct: true, why: 'Routerul desface cadrul, păstrează pachetul IP (doar scade TTL-ul) și construiește un cadru nou, cu MAC-ul propriu ca sursă și MAC-ul următorului hop ca destinație. MAC-urile au sens doar pe legătura locală.' },
      { id: 'b', text: 'Adresele MAC rămân aceleași; adresele IP se schimbă la fiecare router', correct: false, why: 'Exact invers. IP-ul identifică sursa și destinația finală pe tot drumul; MAC-ul se rescrie la fiecare hop L3.' },
      { id: 'c', text: 'Se schimbă și adresele IP, și adresele MAC', correct: false, why: 'Adresele IP se schimbă doar dacă un dispozitiv face NAT (1.7). Rutarea în sine nu modifică IP-urile.' },
      { id: 'd', text: 'Nu se schimbă nimic; routerul doar trimite pachetul mai departe', correct: false, why: 'Routerul modifică cel puțin antetul L2 (MAC-uri noi) și TTL-ul din antetul IP. Un switch L2 este cel care nu modifică nimic.' },
    ],
    explanation: 'Regula de bază a rutării: IP = adresare de la un capăt la altul (end-to-end), MAC = adresare pe fiecare legătură (hop-by-hop). Switch-ul nu schimbă cadrul; routerul îl reconstruiește.',
  },
  {
    id: '1.1-002', topicId: T, sub: '1.1', type: 'match', difficulty: 1,
    stem: 'Potrivește fiecare componentă cu nivelul OSI la care ia, în principal, decizia de transmitere.',
    leftLabel: 'Componentă', rightLabel: 'Nivel',
    pairs: [
      { left: 'Hub', right: 'L1 — Physical', why: 'Hub-ul doar repetă semnalul electric pe toate porturile; nu citește adrese.' },
      { left: 'Switch L2', right: 'L2 — Data Link', why: 'Decide după adresa MAC destinație din cadrul Ethernet.' },
      { left: 'Router', right: 'L3 — Network', why: 'Decide după adresa IP destinație, folosind tabela de rutare.' },
      { left: 'NGFW', right: 'L7 — Application', why: 'Recunoaște aplicațiile (AVC) și inspectează conținutul, nu doar IP-uri și porturi.' },
    ],
    distractors: [{ text: 'L5 — Session', why: 'Niciuna dintre componentele din listă nu este definită prin nivelul sesiune; firewall-ul stateful lucrează cu L3–L4, iar NGFW-ul ajunge până la L7.' }],
    explanation: 'Metoda de rezolvare pentru 1.1: identifică la ce nivel „citește” dispozitivul ca să decidă. Hub L1, switch/AP L2, router/switch L3 L3, firewall stateful L4, NGFW/IPS L7.',
  },
  {
    id: '1.1-003', topicId: T, sub: '1.1', type: 'single', difficulty: 2,
    stem: 'Un utilizator spune: „routerul meu de acasă face Wi-Fi, îmi dă adresă IP și are 4 porturi LAN”. Ce afirmație descrie cel mai corect acest dispozitiv?',
    options: [
      { id: 'a', text: 'Este un dispozitiv multifuncțional (SOHO) care combină router, switch, access point, server DHCP și firewall', correct: true, why: 'Dispozitivele SOHO integrează în aceeași cutie mai multe funcții logice. Porturile LAN sunt un mic switch, Wi-Fi-ul este un AP, iar alocarea de adrese e un server DHCP.' },
      { id: 'b', text: 'Este doar un router; routerele au întotdeauna Wi-Fi și DHCP', correct: false, why: 'Un router enterprise (de exemplu ISR 4000) nu are Wi-Fi și are puține porturi. Wi-Fi-ul și porturile multiple vin din funcțiile de AP și switch integrate.' },
      { id: 'c', text: 'Este un switch L3, pentru că are mai multe porturi și rutează', correct: false, why: 'Un switch L3 este un echipament enterprise cu multe porturi și rutare în hardware, fără funcții de AP sau NAT spre ISP. Dispozitivul de acasă este un router SOHO multifuncțional.' },
      { id: 'd', text: 'Este un access point, pentru că oferă Wi-Fi', correct: false, why: 'Funcția de AP este doar una dintre cele integrate. Un AP singur nu rutează și nu face NAT spre Internet.' },
    ],
    explanation: 'La examen, întrebările despre componente se referă la funcția logică. Un „router wireless” de acasă = router + switch + AP + DHCP + firewall/NAT (detalii în 1.2.e SOHO).',
  },

  // ======================= 1.1.f — Endpoints =======================
  {
    id: '1.1-004', topicId: T, sub: '1.1.f', type: 'multi', difficulty: 1,
    stem: 'Care TREI dintre următoarele sunt [[endpoint|endpoint-uri]]?',
    options: [
      { id: 'a', text: 'Un telefon IP', correct: true, why: 'Telefonul IP produce și consumă date (voce). Faptul că e alimentat prin PoE nu îl face echipament de rețea.' },
      { id: 'b', text: 'O cameră de supraveghere IP', correct: true, why: 'Camera generează un flux video: este un endpoint (de tip IoT).' },
      { id: 'c', text: 'Un laptop', correct: true, why: 'Exemplul clasic de endpoint al unui utilizator.' },
      { id: 'd', text: 'Un switch de acces', correct: false, why: 'Switch-ul transportă traficul altora; nu este sursa sau destinația datelor utilizatorilor. Este un dispozitiv de infrastructură.' },
      { id: 'e', text: 'Un Wireless LAN Controller', correct: false, why: 'WLC-ul este un controller de infrastructură care gestionează AP-uri, nu un endpoint.' },
    ],
    explanation: 'Endpoint = dispozitivul de la marginea rețelei care creează sau consumă date: PC, laptop, telefon, tabletă, imprimantă, telefon IP, cameră, senzor IoT.',
  },
  {
    id: '1.1-005', topicId: T, sub: '1.1.f', type: 'single', difficulty: 2,
    stem: 'Un PC cu IP 192.168.1.10/24 poate da ping la 192.168.1.20, dar nu la 8.8.8.8. Toate echipamentele funcționează. Ce parametru al endpoint-ului este cel mai probabil greșit sau lipsă?',
    options: [
      { id: 'a', text: 'Default gateway-ul', correct: true, why: 'Pentru destinații din afara propriului subnet, PC-ul trimite pachetele la [[default-gateway|gateway]]. Fără un gateway corect, comunicația locală merge, dar cea spre alte rețele nu.' },
      { id: 'b', text: 'Adresa MAC a plăcii de rețea', correct: false, why: 'MAC-ul vine din fabrică și funcționează — dovadă că ping-ul local reușește.' },
      { id: 'c', text: 'Serverul DNS', correct: false, why: 'Ping-ul la 8.8.8.8 folosește direct o adresă IP, fără rezolvare de nume. Un DNS greșit ar afecta `ping google.com`, nu `ping 8.8.8.8`.' },
      { id: 'd', text: 'Masca de subrețea /24', correct: false, why: 'O mască greșită ar putea strica și comunicația locală. Aici traficul local merge, iar /24 este corectă pentru 192.168.1.x.' },
    ],
    explanation: 'Simptomul „local merge, remote nu” indică aproape întotdeauna default gateway-ul (lipsă, greșit sau gateway-ul nu are rută). Verificarea pe client se face cu `ipconfig` / `ip route` (1.10).',
  },
  {
    id: '1.1-006', topicId: T, sub: '1.1.f', type: 'single', difficulty: 2,
    stem: 'De ce sunt dispozitivele [[iot|IoT]] (camere, senzori, controlere de iluminat) considerate endpoint-uri cu risc ridicat de securitate?',
    options: [
      { id: 'a', text: 'Sunt numeroase, rar actualizate și vin adesea cu parole implicite, deci sunt ținte ușoare', correct: true, why: 'Acesta este motivul pentru care dispozitivele IoT se izolează în VLAN-uri proprii și primesc acces minim în rețea.' },
      { id: 'b', text: 'Pentru că folosesc PoE, iar curentul poate fi interceptat', correct: false, why: 'PoE transportă energie, nu are legătură cu confidențialitatea datelor. Riscul vine din software-ul și configurația dispozitivului.' },
      { id: 'c', text: 'Pentru că nu au adresă IP', correct: false, why: 'Dispozitivele IoT în rețea au adrese IP (altfel nu ar putea comunica). Problema e securitatea lor, nu adresarea.' },
      { id: 'd', text: 'Pentru că lucrează doar la nivelul 1', correct: false, why: 'Ca orice endpoint, rulează aplicații, deci folosesc toate nivelurile OSI.' },
    ],
    explanation: 'Endpoint-urile sunt principala suprafață de atac. Măsuri: segmentare (VLAN-uri), control al accesului (802.1X, ISE), actualizări, schimbarea parolelor implicite — Domeniul 5.',
  },

  // ======================= 1.1.g — Servers =======================
  {
    id: '1.1-007', topicId: T, sub: '1.1.g', type: 'single', difficulty: 1,
    stem: 'Ce definește un dispozitiv ca fiind [[server]]?',
    options: [
      { id: 'a', text: 'Rolul lui: oferă un serviciu (web, fișiere, DNS, DHCP etc.) altor dispozitive', correct: true, why: '„Server” este un rol. Un laptop care rulează un server web este server pentru acel serviciu, chiar dacă nu arată ca un server de rack.' },
      { id: 'b', text: 'Faptul că este montat într-un rack de 19 inch', correct: false, why: 'Formatul fizic nu contează. Serverele pot fi virtuale, containere sau chiar un PC obișnuit.' },
      { id: 'c', text: 'Faptul că are două plăci de rețea', correct: false, why: 'Redundanța NIC este o bună practică pentru servere, dar nu le definește.' },
      { id: 'd', text: 'Faptul că primește adresă prin DHCP', correct: false, why: 'Serverele primesc de obicei adrese statice (sau rezervări DHCP), tocmai ca să fie găsite mereu la aceeași adresă.' },
    ],
    explanation: 'În modelul client-server, clientul cere, serverul răspunde. Același dispozitiv poate fi client pentru un serviciu și server pentru altul.',
  },
  {
    id: '1.1-008', topicId: T, sub: '1.1.g', type: 'single', difficulty: 2,
    stem: 'O firmă vrea să publice site-ul web propriu pe Internet, fără să expună rețeaua internă dacă serverul web este compromis. Unde ar trebui pus serverul?',
    options: [
      { id: 'a', text: 'Într-o [[dmz|DMZ]], o zonă separată protejată de firewall', correct: true, why: 'DMZ-ul permite accesul din Internet doar la serviciile publicate (de exemplu TCP 443), iar traficul DMZ → inside este, de regulă, interzis. Un server compromis nu dă acces direct la LAN.' },
      { id: 'b', text: 'În același VLAN cu PC-urile angajaților', correct: false, why: 'Un server public compromis ar fi direct în rețeaua angajaților — exact scenariul pe care vrem să-l evităm.' },
      { id: 'c', text: 'În afara firewall-ului, direct pe Internet, fără protecție', correct: false, why: 'Serverul ar fi expus la toate atacurile, fără filtrare sau IPS.' },
      { id: 'd', text: 'Pe access point', correct: false, why: 'AP-ul este un dispozitiv L2 pentru clienți wireless; nu este un loc de găzduire pentru servere și nu oferă separare de securitate.' },
    ],
    explanation: 'Zonele clasice de firewall: inside (încredere mare), DMZ (servere publice), outside (Internet).',
  },
  {
    id: '1.1-009', topicId: T, sub: '1.1.g', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare serviciu de server cu protocolul și portul lui implicit.',
    leftLabel: 'Serviciu', rightLabel: 'Protocol / port',
    pairs: [
      { left: 'Pagini web securizate', right: 'HTTPS — TCP 443', why: 'HTTP peste TLS. HTTP simplu folosește TCP 80.' },
      { left: 'Traducere nume → adresă IP', right: 'DNS — port 53', why: 'DNS folosește UDP 53 pentru interogări obișnuite și TCP 53 pentru răspunsuri mari / transferuri de zonă.' },
      { left: 'Alocare automată de adrese IP', right: 'DHCP — UDP 67/68', why: 'Serverul ascultă pe UDP 67, clientul pe UDP 68.' },
      { left: 'Administrare la distanță securizată', right: 'SSH — TCP 22', why: 'SSH înlocuiește Telnet (TCP 23), care trimite totul în clar.' },
    ],
    distractors: [{ text: 'SNMP — UDP 514', why: 'Combinație greșită: SNMP folosește UDP 161/162, iar UDP 514 este portul Syslog.' }],
    explanation: 'Porturile serviciilor revin în Domeniul 4 (IP Services) și 5 (ACL-uri). Reține-le de pe acum pe cele mai frecvente.',
  },
  {
    id: '1.1-010', topicId: T, sub: '1.1.g', type: 'single', difficulty: 2,
    stem: 'Un client deschide o conexiune HTTPS spre un server web. Care este combinația tipică de porturi?',
    options: [
      { id: 'a', text: 'Port sursă aleatoriu mare (de exemplu 51000) pe client → port destinație 443 pe server', correct: true, why: 'Serverul ascultă pe portul cunoscut al serviciului (443). Clientul alege un port efemer, temporar, ca să poată deschide mai multe conexiuni simultan.' },
      { id: 'b', text: 'Port sursă 443 pe client → port destinație 443 pe server', correct: false, why: 'Clientul nu folosește portul cunoscut ca sursă; ar putea deschide doar o conexiune simultană spre același server.' },
      { id: 'c', text: 'Port sursă 443 pe server → port destinație 80 pe client', correct: false, why: 'Conexiunea o inițiază clientul, iar clientul nu rulează un server web pe portul 80.' },
      { id: 'd', text: 'Port sursă 80 → port destinație 443', correct: false, why: '80 este portul serverului HTTP necriptat. Clientul folosește un port efemer, nu 80.' },
    ],
    explanation: 'Portul cunoscut identifică serviciul de pe server; portul efemer al clientului identifică conexiunea. Combinația IP + port formează un [[socket]] (1.5).',
  },

  // ======================= 1.1.b — Switches =======================
  {
    id: '1.1-011', topicId: T, sub: '1.1.b', type: 'single', difficulty: 1,
    stem: 'Pe ce bază decide un [[l2-switch|switch L2]] pe ce port trimite un cadru?',
    options: [
      { id: 'a', text: 'Adresa MAC destinație, căutată în tabela MAC', correct: true, why: 'Switch-ul caută MAC-ul destinație în tabela MAC; dacă îl găsește, trimite cadrul doar pe portul asociat.' },
      { id: 'b', text: 'Adresa MAC sursă', correct: false, why: 'MAC-ul sursă este folosit pentru ÎNVĂȚARE (popularea tabelei), nu pentru decizia de transmitere.' },
      { id: 'c', text: 'Adresa IP destinație', correct: false, why: 'Un switch L2 nu se uită la antetul IP. Decizia după IP o ia routerul sau switch-ul L3.' },
      { id: 'd', text: 'Numărul portului TCP', correct: false, why: 'Porturile TCP sunt informații de L4; le folosesc firewall-urile, nu switch-urile L2.' },
    ],
    explanation: 'Switch-ul învață din MAC-ul sursă și transmite după MAC-ul destinație. Dacă destinația e necunoscută, inundă cadrul în VLAN.',
  },
  {
    id: '1.1-012', topicId: T, sub: '1.1.b', type: 'single', difficulty: 2,
    stem: 'Un switch primește un cadru unicast pentru un MAC destinație care NU există în tabela lui MAC. Ce face?',
    options: [
      { id: 'a', text: 'Inundă (flood) cadrul pe toate porturile din același VLAN, mai puțin portul pe care a venit', correct: true, why: 'Acesta este [[unknown-unicast]] flooding. Când destinația răspunde, switch-ul îi învață MAC-ul și următoarele cadre merg doar pe portul corect.' },
      { id: 'b', text: 'Aruncă cadrul', correct: false, why: 'Dacă l-ar arunca, primul cadru spre orice dispozitiv nou nu ar ajunge niciodată. Switch-ul preferă să-l inunde.' },
      { id: 'c', text: 'Îl trimite la default gateway', correct: false, why: 'Un switch L2 nu are noțiunea de default gateway pentru cadrele transmise; aceasta e o decizie a endpoint-urilor și routerelor.' },
      { id: 'd', text: 'Trimite un ARP request ca să afle MAC-ul', correct: false, why: 'ARP îl folosesc hosturile și routerele ca să afle MAC-ul unui IP. Switch-ul nu generează ARP pentru cadrele pe care le transmite.' },
    ],
    explanation: 'Cele trei acțiuni ale switch-ului: learn, forward/filter, flood. Unknown unicast, broadcast și multicast (fără IGMP snooping) sunt inundate în VLAN.',
  },
  {
    id: '1.1-013', topicId: T, sub: '1.1.b', type: 'single', difficulty: 2,
    stem: 'Un hub cu 8 porturi este înlocuit cu un switch cu 8 porturi, cu câte un PC pe fiecare port, toate în același VLAN. Cum se schimbă numărul de domenii?',
    options: [
      { id: 'a', text: 'Domenii de coliziune: de la 1 la 8; domenii de broadcast: rămâne 1', correct: true, why: 'Fiecare port de switch este un [[collision-domain|domeniu de coliziune]] separat. Broadcast-urile ajung tot la toți, pentru că switch-ul nu separă [[broadcast-domain|domeniile de broadcast]] (doar VLAN-urile și routerele o fac).' },
      { id: 'b', text: 'Domenii de coliziune: 8; domenii de broadcast: 8', correct: false, why: 'Un switch nu separă domeniile de broadcast. Ar fi nevoie de 8 VLAN-uri sau de un router.' },
      { id: 'c', text: 'Domenii de coliziune: 1; domenii de broadcast: 8', correct: false, why: 'Invers față de realitate: switch-ul separă coliziunile, nu broadcast-urile.' },
      { id: 'd', text: 'Nu se schimbă nimic', correct: false, why: 'Hub-ul formează un singur domeniu de coliziune (half-duplex, CSMA/CD); switch-ul microsegmentează rețeaua.' },
    ],
    explanation: 'Hub: 1 domeniu de coliziune, 1 de broadcast. Switch: un domeniu de coliziune per port, 1 de broadcast per VLAN. Router: un domeniu de broadcast per interfață.',
  },
  {
    id: '1.1-014', topicId: T, sub: '1.1.b', type: 'order', difficulty: 1,
    stem: 'Ordonează dispozitivele în ordinea apariției lor istorice, fiecare rezolvând o problemă a celui anterior.',
    items: [
      { text: 'Hub (repetor multiport, L1)', why: 'Toate dispozitivele împart un singur domeniu de coliziune, half-duplex.' },
      { text: 'Bridge (L2, puține porturi, software)', why: 'A separat LAN-ul în mai multe domenii de coliziune învățând MAC-uri (DEC, 1983).' },
      { text: 'Switch L2 (bridge multiport în hardware/ASIC)', why: 'Fiecare port devine domeniu de coliziune separat, full-duplex, la viteza firului.' },
      { text: 'Switch multilayer (L3)', why: 'Rutează între VLAN-uri în hardware, eliminând gâtul de sticlă router-on-a-stick.' },
    ],
    explanation: 'Evoluția hub → bridge → switch → switch L3 reflectă nevoia de mai multă viteză și mai puține coliziuni, apoi de rutare rapidă între VLAN-uri.',
  },
  {
    id: '1.1-015', topicId: T, sub: '1.1.b', type: 'single', difficulty: 2,
    stem: 'Un switch Cisco 2960 (L2) are configurată adresa 192.168.1.2 pe `interface vlan 1`. Ce rol are această adresă?',
    options: [
      { id: 'a', text: 'Este adresa de management: permite administrarea switch-ului prin SSH, ping, SNMP', correct: true, why: 'Pe un switch L2, [[svi|SVI]]-ul servește la administrare. Switch-ul nu rutează trafic între rețele.' },
      { id: 'b', text: 'Transformă switch-ul în router pentru VLAN 1', correct: false, why: 'Pentru rutare ar fi nevoie de un switch L3 cu `ip routing`. Un 2960 L2 nu rutează traficul utilizatorilor.' },
      { id: 'c', text: 'Este default gateway-ul obligatoriu al tuturor PC-urilor din VLAN 1', correct: false, why: 'Gateway-ul PC-urilor este un router sau un switch L3. SVI-ul de management al unui switch L2 nu poate juca acest rol.' },
      { id: 'd', text: 'Este adresa folosită de switch ca să comute cadrele', correct: false, why: 'Comutarea se face după MAC-uri, fără legătură cu adresa IP a switch-ului.' },
    ],
    explanation: 'Un IP pe un switch L2 nu îl face router — e la fel ca IP-ul unei imprimante. Pe un switch L2 se configurează și `ip default-gateway` pentru traficul de management.',
  },
  {
    id: '1.1-016', topicId: T, sub: '1.1.b', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații descriu un [[l3-switch|switch Layer 3]]?',
    options: [
      { id: 'a', text: 'Poate ruta între VLAN-uri folosind SVI-uri', correct: true, why: 'Fiecare SVI (`interface vlan X` cu IP) devine default gateway-ul VLAN-ului respectiv, iar switch-ul rutează între ele.' },
      { id: 'b', text: 'Face rutarea în hardware (ASIC), la viteza porturilor', correct: true, why: 'Acesta este avantajul principal față de router-on-a-stick: FIB-ul este în TCAM, iar comutarea L3 nu trece prin CPU.' },
      { id: 'c', text: 'Nu poate comuta cadre în interiorul unui VLAN, doar ruta', correct: false, why: 'Un switch L3 face ambele: comutare L2 în VLAN și rutare L3 între VLAN-uri.' },
      { id: 'd', text: 'Este obligatoriu la marginea rețelei pentru conexiunea cu ISP-ul, în locul routerului', correct: false, why: 'La marginea WAN/Internet se folosește de regulă un router (NAT, VPN, interfețe WAN). Switch-urile L3 stau în distribution și core.' },
    ],
    explanation: 'Switch L3 = switch L2 + rutare hardware. Se activează cu `ip routing`; porturile pot deveni routed ports cu `no switchport`.',
  },
  {
    id: '1.1-017', topicId: T, sub: '1.1.b', type: 'cli', difficulty: 2,
    stem: 'Pe un switch Cisco, ce comandă afișează tabela de adrese MAC (ce MAC a fost învățat pe ce port și în ce VLAN)?',
    prompt: 'SW1#', canonical: 'show mac address-table',
    answers: ['show mac address-table', 'show mac address-table dynamic', 'sh mac address-table', 'sh mac add', 'show mac add', 'sh mac address'],
    hint: 'show mac …',
    wrong: [
      { text: 'show ip route', why: 'Afișează tabela de rutare (L3), nu tabela MAC. Pe un switch L2 nu e utilă.' },
      { text: 'show arp', why: 'Arată tabela ARP (IP → MAC) a dispozitivului însuși, nu tabela de comutare MAC → port.' },
      { text: 'show mac-address-table', why: 'Este sintaxa veche (cu cratimă), acceptată doar pe unele versiuni IOS mai vechi. Forma actuală este `show mac address-table`.' },
    ],
    explanation: '`show mac address-table` arată VLAN, MAC, tip (DYNAMIC/STATIC) și port. Variante utile: `dynamic`, `address <mac>`, `interface <int>`, `aging-time`.',
  },

  // ======================= 1.1.a — Routers =======================
  {
    id: '1.1-018', topicId: T, sub: '1.1.a', type: 'single', difficulty: 1,
    stem: 'Care este funcția principală a unui [[router]]?',
    options: [
      { id: 'a', text: 'Să transmită pachete între rețele IP diferite, alegând drumul pe baza tabelei de rutare', correct: true, why: 'Routerul este dispozitivul L3 care leagă subnet-uri și rețele diferite (LAN-WAN, LAN-Internet).' },
      { id: 'b', text: 'Să transmită cadre în interiorul aceluiași VLAN pe baza adreselor MAC', correct: false, why: 'Aceasta este funcția switch-ului L2.' },
      { id: 'c', text: 'Să ofere conectivitate wireless clienților', correct: false, why: 'Aceasta este funcția access point-ului (L2).' },
      { id: 'd', text: 'Să alimenteze dispozitivele prin cablul de rețea', correct: false, why: 'Aceasta este funcția unui PSE (switch PoE sau injector).' },
    ],
    explanation: 'Router = L3, decide după IP destinație, separă domeniile de broadcast. Funcții suplimentare: NAT, DHCP, ACL, VPN, QoS, conectivitate WAN.',
  },
  {
    id: '1.1-019', topicId: T, sub: '1.1.a', type: 'single', difficulty: 2,
    stem: 'De ce un router NU transmite mai departe broadcast-urile (de exemplu un ARP request trimis la FFFF.FFFF.FFFF)?',
    options: [
      { id: 'a', text: 'Pentru că fiecare interfață de router delimitează un domeniu de broadcast; blocarea broadcast-urilor este chiar unul dintre motivele pentru care rețelele se împart cu routere', correct: true, why: 'Dacă routerele ar propaga broadcast-urile, orice ARP sau DHCP Discover ar inunda toate rețelele conectate, iar Internetul ar fi impracticabil.' },
      { id: 'b', text: 'Pentru că routerul nu înțelege adresele MAC', correct: false, why: 'Routerul înțelege MAC-urile (are interfețe Ethernet, răspunde la ARP); doar că decizia de transmitere o ia după IP.' },
      { id: 'c', text: 'Pentru că broadcast-urile sunt criptate', correct: false, why: 'Broadcast-urile nu sunt criptate; nu are nicio legătură cu criptarea.' },
      { id: 'd', text: 'Routerul transmite broadcast-urile, dar doar pe interfața de WAN', correct: false, why: 'Implicit, routerul nu propagă broadcast-urile L2 pe nicio interfață. (Excepțiile controlate, ca DHCP relay, transformă broadcast-ul într-un unicast.)' },
    ],
    explanation: 'Fiecare interfață de router = un domeniu de broadcast. Pentru DHCP între rețele se folosește `ip helper-address` (DHCP relay, 4.6).',
  },
  {
    id: '1.1-020', topicId: T, sub: '1.1.a', type: 'single', difficulty: 3,
    stem: 'Un router are în tabela de rutare: `S 10.1.0.0/16 [1/0]`, `O 10.1.1.0/24 [110/20]` și `S* 0.0.0.0/0 [1/0]`. Pe ce rută va trimite un pachet spre 10.1.1.77?',
    options: [
      { id: 'a', text: 'Pe ruta OSPF 10.1.1.0/24, pentru că are cel mai lung prefix potrivit', correct: true, why: 'Longest prefix match se aplică primul: /24 este mai specific decât /16 și /0. Distanța administrativă contează doar între rute cu exact același prefix.' },
      { id: 'b', text: 'Pe ruta statică 10.1.0.0/16, pentru că AD 1 este mai mic decât AD 110', correct: false, why: 'Capcana clasică. AD-ul compară surse diferite pentru ACELAȘI prefix. Aici prefixele diferă (/16 vs /24), deci câștigă cel mai lung.' },
      { id: 'c', text: 'Pe ruta implicită, pentru că se potrivește cu orice destinație', correct: false, why: 'Ruta implicită (/0) este cea mai puțin specifică; se folosește doar dacă nicio altă rută nu se potrivește.' },
      { id: 'd', text: 'Pachetul este împărțit pe toate cele trei rute (load balancing)', correct: false, why: 'Load balancing (ECMP) apare doar între rute cu același prefix și aceeași metrică/AD, nu între prefixe diferite.' },
    ],
    explanation: 'Ordinea de decizie: 1) prefixul cel mai lung; 2) AD mai mic (pentru același prefix); 3) metrica mai mică (în același protocol).',
  },
  {
    id: '1.1-021', topicId: T, sub: '1.1.a', type: 'order', difficulty: 2,
    stem: 'Ordonează pașii pe care îi face un router când primește un cadru Ethernet care conține un pachet IP pentru o altă rețea.',
    items: [
      { text: 'Verifică dacă MAC-ul destinație al cadrului este al lui și îndepărtează antetul L2', why: 'Routerul procesează doar cadrele adresate lui (sau broadcast/multicast acceptate).' },
      { text: 'Caută IP-ul destinație în tabela de rutare (longest prefix match)', why: 'Așa află interfața de ieșire și next hop-ul.' },
      { text: 'Scade TTL-ul cu 1 și recalculează checksum-ul antetului IP', why: 'TTL-ul previne buclele infinite; dacă ajunge la 0, pachetul e aruncat.' },
      { text: 'Află MAC-ul next hop-ului (ARP) și construiește un cadru nou', why: 'Antetul L2 nou are MAC-ul interfeței de ieșire ca sursă și MAC-ul next hop-ului ca destinație.' },
      { text: 'Trimite cadrul pe interfața de ieșire', why: 'Pachetul își continuă drumul spre următorul hop.' },
    ],
    explanation: 'Desface L2 → decide pe L3 → actualizează L3 (TTL) → construiește L2 nou → trimite. CEF face acest proces foarte rapid, cu FIB + adjacency table precalculate.',
  },
  {
    id: '1.1-022', topicId: T, sub: '1.1.a', type: 'cli', difficulty: 1,
    stem: 'Pe un router Cisco, ce comandă afișează tabela de rutare IPv4?',
    prompt: 'R1#', canonical: 'show ip route',
    answers: ['show ip route', 'sh ip route', 'sh ip ro', 'show ip ro', 'sh ip rou'],
    hint: 'show ip …',
    wrong: [
      { text: 'show route', why: 'Sintaxă folosită pe alte platforme (de exemplu ASA, Junos). Pe IOS este `show ip route`.' },
      { text: 'show ip interface brief', why: 'Arată interfețele cu IP-urile și starea lor, nu rutele.' },
      { text: 'show running-config', why: 'Arată configurația, inclusiv rutele statice scrise, dar nu tabela de rutare completă (conectate, OSPF etc.).' },
    ],
    explanation: '`show ip route` arată codul sursei (C, L, S, O…), prefixul, [AD/metrică], next hop-ul și interfața de ieșire. Pentru IPv6: `show ipv6 route`.',
  },
  {
    id: '1.1-023', topicId: T, sub: '1.1.a', type: 'single', difficulty: 3,
    stem: 'Ce face [[cef|Cisco Express Forwarding (CEF)]] pentru a accelera transmiterea pachetelor?',
    options: [
      { id: 'a', text: 'Precalculează FIB-ul (cele mai bune rute, optimizate pentru căutare) și tabela de adiacență (antetele L2 gata construite)', correct: true, why: 'Data plane-ul folosește FIB + adjacency table fără să consulte procesul de rutare pentru fiecare pachet; pe platformele hardware, FIB-ul stă în TCAM.' },
      { id: 'b', text: 'Comprimă pachetele ca să ocupe mai puțină lățime de bandă', correct: false, why: 'CEF nu comprimă datele; accelerează doar decizia de transmitere.' },
      { id: 'c', text: 'Elimină nevoia de protocoale de rutare', correct: false, why: 'CEF folosește rezultatele protocoalelor de rutare (RIB); nu le înlocuiește.' },
      { id: 'd', text: 'Trimite toate pachetele la CPU pentru inspecție', correct: false, why: 'Este opusul: CEF evită trimiterea fiecărui pachet la CPU (process switching).' },
    ],
    explanation: 'Control plane: construiește RIB. CEF: derivă FIB + adjacency. Data plane: transmite. Verificare: `show ip cef`, `show adjacency`.',
  },

  // ======================= 1.1.c — NGFW și IPS =======================
  {
    id: '1.1-024', topicId: T, sub: '1.1.c', type: 'single', difficulty: 1,
    stem: 'Ce caracteristică distinge un [[ngfw|next-generation firewall]] de un firewall stateful tradițional?',
    options: [
      { id: 'a', text: 'Inspecția la nivelul aplicației: recunoaște și controlează aplicațiile, nu doar porturile', correct: true, why: 'Cisco definește NGFW-ul ca firewall stateful + application awareness + IPS + protecție malware + identitatea utilizatorului. Diferența cheie este inspecția L7.' },
      { id: 'b', text: 'Faptul că ține evidența stării conexiunilor', correct: false, why: 'Starea conexiunilor o ține deja un firewall stateful tradițional. NGFW-ul o păstrează, dar nu este ceea ce îl face „next-generation”.' },
      { id: 'c', text: 'Faptul că filtrează pe IP-uri și porturi', correct: false, why: 'Și un ACL simplu face asta. Este funcția de bază, nu una de nouă generație.' },
      { id: 'd', text: 'Faptul că nu mai are nevoie de reguli', correct: false, why: 'Un NGFW are tot nevoie de o politică; doar că regulile pot fi scrise pe aplicații, utilizatori și categorii de URL.' },
    ],
    explanation: 'Funcții NGFW: AVC (application visibility and control), IPS integrat, malware protection, URL filtering, identitate, decriptare TLS, threat intelligence (Talos).',
  },
  {
    id: '1.1-025', topicId: T, sub: '1.1.c', type: 'single', difficulty: 2,
    stem: 'Care este diferența principală dintre un [[ids|IDS]] și un [[ips|IPS]]?',
    options: [
      { id: 'a', text: 'IDS-ul primește o copie a traficului și doar alertează; IPS-ul stă inline și poate bloca traficul în timp real', correct: true, why: 'IDS = out-of-band (SPAN/TAP, mod promiscuous), fără impact asupra traficului. IPS = pe drumul traficului, poate arunca pachetele malițioase.' },
      { id: 'b', text: 'IDS-ul folosește semnături, IPS-ul folosește doar detecția de anomalii', correct: false, why: 'Ambele pot folosi semnături, anomalii și reputație. Diferența este amplasarea și acțiunea, nu metoda de detecție.' },
      { id: 'c', text: 'IDS-ul este hardware, IPS-ul este software', correct: false, why: 'Ambele pot exista ca hardware, software sau funcție integrată într-un NGFW.' },
      { id: 'd', text: 'IPS-ul este pasiv, IDS-ul este activ', correct: false, why: 'Invers: IPS-ul este cel activ (Prevention), IDS-ul cel pasiv (Detection).' },
    ],
    explanation: 'Memorare: **D**etection = doar vede; **P**revention = poate opri. IPS-ul adaugă latență și poate tăia traficul dacă se defectează (de aceea există fail-open/bypass).',
  },
  {
    id: '1.1-026', topicId: T, sub: '1.1.c', type: 'single', difficulty: 2,
    stem: 'Un PC din LAN deschide o conexiune HTTPS spre un server din Internet. Pe firewall nu există nicio regulă care să permită traficul outside → inside. De ce ajunge totuși răspunsul serverului la PC?',
    options: [
      { id: 'a', text: 'Firewall-ul este [[stateful]]: a notat conexiunea în tabela de stare, iar răspunsul se potrivește cu ea', correct: true, why: 'Pentru conexiunile inițiate din inside, firewall-ul permite automat traficul de întoarcere care corespunde intrării din tabela de stare.' },
      { id: 'b', text: 'Pentru că traficul HTTPS este criptat și firewall-ul nu îl poate bloca', correct: false, why: 'Firewall-ul poate bloca orice pachet după antetele IP/TCP, criptate sau nu. Criptarea afectează doar inspecția conținutului.' },
      { id: 'c', text: 'Pentru că firewall-urile permit implicit tot traficul din outside', correct: false, why: 'Politica implicită tipică este opusă: traficul inițiat din outside spre inside este blocat.' },
      { id: 'd', text: 'Pentru că serverul folosește portul 443, care este întotdeauna permis', correct: false, why: 'Nu există porturi „întotdeauna permise”. Răspunsul trece datorită stării conexiunii, nu datorită portului.' },
    ],
    explanation: 'Un ACL stateless ar avea nevoie de o regulă explicită pentru traficul de întoarcere (o „gaură” mare). Firewall-ul stateful rezolvă problema elegant.',
  },
  {
    id: '1.1-027', topicId: T, sub: '1.1.c', type: 'multi', difficulty: 2,
    stem: 'Care TREI funcții sunt tipice unui NGFW (de exemplu Cisco Secure Firewall)?',
    options: [
      { id: 'a', text: 'Application visibility and control (AVC)', correct: true, why: 'Recunoaște aplicațiile după comportament și conținut, indiferent de port.' },
      { id: 'b', text: 'Prevenirea intruziunilor (IPS) integrată', correct: true, why: 'La Cisco, IPS-ul integrat se bazează pe motorul Snort și pe semnăturile Talos.' },
      { id: 'c', text: 'Filtrare URL pe categorii', correct: true, why: 'Blochează categorii de site-uri (de exemplu phishing, jocuri de noroc).' },
      { id: 'd', text: 'Alimentarea AP-urilor prin PoE', correct: false, why: 'PoE este funcția switch-urilor PSE sau a injectoarelor, nu a firewall-urilor.' },
      { id: 'e', text: 'Gestionarea canalelor radio ale AP-urilor (RRM)', correct: false, why: 'RRM este o funcție a WLC-ului.' },
    ],
    explanation: 'NGFW = stateful + AVC + IPS + malware protection + URL filtering + identitate + decriptare TLS + threat intelligence.',
  },
  {
    id: '1.1-028', topicId: T, sub: '1.1.c', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare tip de filtrare cu descrierea ei.',
    leftLabel: 'Descriere', rightLabel: 'Tehnologie',
    pairs: [
      { left: 'Verifică fiecare pachet separat după IP-uri, protocol și porturi, fără memorie', right: 'Packet filter (ACL stateless)', why: 'Un ACL standard sau extins pe router evaluează fiecare pachet independent.' },
      { left: 'Ține minte conexiunile și permite automat traficul de întoarcere', right: 'Firewall stateful', why: 'Tabela de stare este elementul definitoriu.' },
      { left: 'Recunoaște aplicațiile și utilizatorii, are IPS și filtrare URL', right: 'NGFW', why: 'Inspecție până la L7, plus servicii de securitate integrate.' },
      { left: 'Primește o copie a traficului și generează alerte', right: 'IDS', why: 'Amplasare out-of-band, fără blocare.' },
    ],
    distractors: [{ text: 'WLC', why: 'WLC-ul gestionează AP-uri wireless; nu este o tehnologie de filtrare a traficului.' }],
    explanation: 'Evoluția: packet filter → stateful → NGFW. IDS/IPS pot fi dispozitive separate sau integrate în NGFW.',
  },
  {
    id: '1.1-029', topicId: T, sub: '1.1.c', type: 'single', difficulty: 3,
    stem: 'Un IPS folosește detecție pe bază de semnături. Ce dezavantaj are această metodă?',
    options: [
      { id: 'a', text: 'Nu detectează atacurile complet noi (zero-day) pentru care nu există încă semnătură, iar baza de semnături trebuie actualizată permanent', correct: true, why: 'Semnăturile descriu atacuri cunoscute. De aceea ele sunt actualizate continuu (la Cisco, de echipa [[talos|Talos]]) și sunt combinate cu detecția de anomalii.' },
      { id: 'b', text: 'Generează mult mai multe alarme false decât detecția de anomalii', correct: false, why: 'De obicei e invers: detecția de anomalii produce mai multe false pozitive, pentru că orice abatere de la normal e suspectă.' },
      { id: 'c', text: 'Funcționează doar în mod IDS, nu inline', correct: false, why: 'Semnăturile se folosesc atât în IDS, cât și în IPS inline.' },
      { id: 'd', text: 'Nu poate inspecta traficul TCP', correct: false, why: 'Semnăturile pot descrie tipare în orice protocol, inclusiv TCP.' },
    ],
    explanation: 'Semnături = precise pentru atacuri cunoscute, oarbe la cele noi. Anomalii = pot prinde atacuri noi, dar cu mai multe false pozitive. Soluțiile moderne le combină, plus reputația IP/URL.',
  },

  // ======================= 1.1.d — Access points =======================
  {
    id: '1.1-030', topicId: T, sub: '1.1.d', type: 'single', difficulty: 1,
    stem: 'La ce nivel OSI funcționează în principal un [[ap|access point]] și ce face?',
    options: [
      { id: 'a', text: 'L2 — face bridging între cadrele 802.11 (wireless) și cadrele 802.3 (Ethernet cablat)', correct: true, why: 'AP-ul traduce cadrele între cele două medii fără să ruteze; adresele IP nu se schimbă.' },
      { id: 'b', text: 'L3 — rutează între rețeaua wireless și cea cablată', correct: false, why: 'Un AP nu rutează. Clienții wireless și cei cablați din același VLAN sunt în același subnet. (Un router SOHO conține un AP, dar funcția de AP rămâne L2.)' },
      { id: 'c', text: 'L1 — doar amplifică semnalul radio', correct: false, why: 'Un AP înțelege cadre și adrese MAC (asociere, BSSID, criptare), deci lucrează și la L2. Un simplu repetor ar fi L1.' },
      { id: 'd', text: 'L7 — filtrează aplicațiile', correct: false, why: 'Inspecția aplicațiilor este funcția NGFW-ului.' },
    ],
    explanation: 'AP = bridge 802.11 ↔ 802.3 (L1–L2). Detaliile radio, SSID și criptare sunt în topicul 1.11; modurile AP în 2.6–2.7.',
  },
  {
    id: '1.1-031', topicId: T, sub: '1.1.d', type: 'single', difficulty: 2,
    stem: 'Prin ce se deosebește un AP [[autonomous-ap|autonom]] de un AP [[lightweight-ap|lightweight]]?',
    options: [
      { id: 'a', text: 'AP-ul autonom se configurează și funcționează singur; AP-ul lightweight are nevoie de un WLC care îl configurează și îl controlează prin CAPWAP', correct: true, why: 'AP-urile lightweight împart funcțiile cu WLC-ul (split-MAC). Fără WLC, nu servesc clienți.' },
      { id: 'b', text: 'AP-ul lightweight este mai ușor fizic și nu are nevoie de PoE', correct: false, why: '„Lightweight” se referă la software/funcții, nu la greutate. Ambele tipuri pot fi alimentate prin PoE.' },
      { id: 'c', text: 'AP-ul autonom are nevoie de Catalyst Center ca să funcționeze', correct: false, why: 'AP-ul autonom funcționează independent; nu are nevoie de niciun controller.' },
      { id: 'd', text: 'Nu există nicio diferență, sunt doar denumiri de marketing', correct: false, why: 'Arhitecturile sunt diferite (configurare locală vs centralizată), cu efecte asupra porturilor de switch, roamingului și administrării.' },
    ],
    explanation: 'Autonom = fiecare AP configurat separat (de obicei pe port trunk). Lightweight + WLC = configurare centralizată; în modul Local, portul de switch al AP-ului este de obicei access.',
  },

  // ======================= 1.1.e — Controllers =======================
  {
    id: '1.1-032', topicId: T, sub: '1.1.e', type: 'single', difficulty: 1,
    stem: 'Ce face un [[wlc|Wireless LAN Controller]] într-o rețea enterprise?',
    options: [
      { id: 'a', text: 'Gestionează centralizat AP-urile lightweight: configurație, canale și putere (RRM), roaming, autentificarea clienților', correct: true, why: 'AP-urile lightweight construiesc tuneluri CAPWAP spre WLC, care le trimite configurația și coordonează parametrii radio.' },
      { id: 'b', text: 'Rutează traficul dintre filiale prin WAN', correct: false, why: 'Rutarea WAN este rolul routerelor.' },
      { id: 'c', text: 'Alimentează AP-urile prin PoE', correct: false, why: 'PoE vine de la switch-ul de acces (PSE) sau de la un injector, nu de la WLC.' },
      { id: 'd', text: 'Inspectează traficul pentru malware', correct: false, why: 'Aceasta este funcția NGFW/IPS.' },
    ],
    explanation: 'WLC = creierul rețelei wireless. Exemple Cisco: Catalyst 9800 (appliance, 9800-CL în cloud, embedded pe Catalyst 9300).',
  },
  {
    id: '1.1-033', topicId: T, sub: '1.1.e', type: 'single', difficulty: 2,
    stem: 'Cum se numește astăzi produsul Cisco cunoscut anterior ca **Cisco DNA Center**?',
    options: [
      { id: 'a', text: 'Cisco Catalyst Center', correct: true, why: 'Cisco a redenumit DNA Center în [[catalyst-center|Catalyst Center]] în 2023; versiunile mai vechi ale API-ului păstrează denumirea DNA Center.' },
      { id: 'b', text: 'Cisco Meraki Dashboard', correct: false, why: 'Meraki Dashboard este platforma cloud de administrare pentru echipamentele Meraki — un produs diferit.' },
      { id: 'c', text: 'Cisco Catalyst 9800', correct: false, why: 'Catalyst 9800 este familia de WLC-uri, nu controller-ul pentru toată rețeaua.' },
      { id: 'd', text: 'Cisco Talos', correct: false, why: 'Talos este echipa Cisco de threat intelligence.' },
    ],
    explanation: 'La examen și în materiale vei întâlni ambele nume. Catalyst Center = controller SDN / intent-based pentru rețeaua enterprise.',
  },
  {
    id: '1.1-034', topicId: T, sub: '1.1.e', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre Cisco Catalyst Center sunt corecte?',
    options: [
      { id: 'a', text: 'Gestionează și automatizează întreaga rețea enterprise: switch-uri, routere, WLC-uri și AP-uri', correct: true, why: 'Spre deosebire de WLC (doar wireless), Catalyst Center are în vedere toată rețeaua campus/filială.' },
      { id: 'b', text: 'Oferă funcții de assurance: monitorizarea sănătății rețelei și a clienților, cu analiză automată a problemelor', correct: true, why: 'Assurance este unul dintre cele patru fluxuri principale: Design, Policy, Provision, Assurance.' },
      { id: 'c', text: 'Tot traficul utilizatorilor trece prin el', correct: false, why: 'Catalyst Center este doar în planul de management/control. Traficul utilizatorilor nu trece prin el.' },
      { id: 'd', text: 'Înlocuiește complet switch-urile de acces', correct: false, why: 'Este un controller software (appliance/VM), nu un switch. Echipamentele rămân în rețea; el doar le administrează.' },
    ],
    explanation: 'Catalyst Center comunică northbound (REST API spre aplicații) și southbound (NETCONF/RESTCONF, CLI, SNMP spre echipamente) — Domeniul 6.',
  },
  {
    id: '1.1-035', topicId: T, sub: '1.1.e', type: 'single', difficulty: 3,
    stem: 'Un AP lightweight în modul Local comunică cu WLC-ul prin CAPWAP. Ce porturi folosește protocolul?',
    options: [
      { id: 'a', text: 'UDP 5246 pentru control (criptat cu DTLS) și UDP 5247 pentru date', correct: true, why: 'Canalul de control CAPWAP este întotdeauna protejat cu DTLS; canalul de date poate fi criptat opțional.' },
      { id: 'b', text: 'TCP 5246 și TCP 5247', correct: false, why: 'CAPWAP folosește UDP, nu TCP.' },
      { id: 'c', text: 'UDP 12222 și 12223', correct: false, why: 'Acestea erau porturile protocolului mai vechi LWAPP, înlocuit de CAPWAP.' },
      { id: 'd', text: 'TCP 443 pentru ambele canale', correct: false, why: '443 este HTTPS — folosit pentru GUI-ul WLC-ului, nu pentru tunelurile AP–WLC.' },
    ],
    explanation: 'CAPWAP: UDP 5246 control, UDP 5247 date. Tot traficul clienților unui AP în modul Local ajunge prin tunel la WLC (topicul 2.6).',
  },

  // ======================= 1.1.h — PoE =======================
  {
    id: '1.1-036', topicId: T, sub: '1.1.h', type: 'single', difficulty: 1,
    stem: 'Ce putere maximă furnizează la PSE un port PoE+ (IEEE 802.3at)?',
    options: [
      { id: 'a', text: '30 W', correct: true, why: '802.3at (PoE+, Type 2) oferă până la 30 W la PSE; la PD sunt garantați 25.5 W.' },
      { id: 'b', text: '15.4 W', correct: false, why: '15.4 W este maximul pentru 802.3af (PoE, Type 1).' },
      { id: 'c', text: '25.5 W', correct: false, why: '25.5 W este puterea garantată la PD pentru PoE+, nu cea de la PSE. Capcană frecventă.' },
      { id: 'd', text: '60 W', correct: false, why: '60 W este pentru 802.3bt Type 3 (sau Cisco UPOE), pe 4 perechi.' },
    ],
    explanation: 'af = 15.4 W · at = 30 W · bt = 60 W (Type 3) / 90 W (Type 4) — valori la PSE. La PD: 12.95 / 25.5 / 51 / 71.3 W.',
  },
  {
    id: '1.1-037', topicId: T, sub: '1.1.h', type: 'single', difficulty: 1,
    stem: 'Într-o rețea în care un switch Catalyst alimentează prin PoE un telefon IP, ce rol are fiecare?',
    options: [
      { id: 'a', text: 'Switch-ul este [[pse|PSE]], telefonul este [[pd|PD]]', correct: true, why: 'PSE (Power Sourcing Equipment) = sursa de putere. PD (Powered Device) = consumatorul.' },
      { id: 'b', text: 'Switch-ul este PD, telefonul este PSE', correct: false, why: 'Inversat: telefonul primește energie, deci este PD.' },
      { id: 'c', text: 'Amândouă sunt PSE', correct: false, why: 'Telefonul nu furnizează energie pe cablul spre switch.' },
      { id: 'd', text: 'Switch-ul este midspan, telefonul este endspan', correct: false, why: 'Endspan/midspan descriu tipul de PSE: switch-ul PoE este endspan, injectorul intermediar este midspan. Telefonul nu este nici una, nici alta.' },
    ],
    explanation: 'PSE: switch PoE (endspan) sau injector (midspan). PD: AP, telefon IP, cameră, senzor, iluminat LED.',
  },
  {
    id: '1.1-038', topicId: T, sub: '1.1.h', type: 'match', difficulty: 2,
    stem: 'Potrivește fiecare standard PoE cu puterea maximă la PSE.',
    leftLabel: 'Standard', rightLabel: 'Putere max. la PSE',
    pairs: [
      { left: 'IEEE 802.3af (PoE, Type 1)', right: '15.4 W', why: 'Primul standard (2003), 2 perechi, clasele 0–3.' },
      { left: 'IEEE 802.3at (PoE+, Type 2)', right: '30 W', why: '2009, 2 perechi, adaugă clasa 4.' },
      { left: 'IEEE 802.3bt Type 3', right: '60 W', why: '2018, 4 perechi, clasele 5–6.' },
      { left: 'IEEE 802.3bt Type 4', right: '90 W', why: '2018, 4 perechi, clasele 7–8 (71.3 W la PD).' },
    ],
    distractors: [{ text: '100 W', why: 'Niciun standard IEEE PoE din CCNA nu definește 100 W per port; maximul este 90 W la PSE (802.3bt Type 4).' }],
    explanation: 'Mnemonic: a-f, a-t, b-t — ordine alfabetică = ordine crescătoare a puterii.',
  },
  {
    id: '1.1-039', topicId: T, sub: '1.1.h', type: 'order', difficulty: 2,
    stem: 'Ordonează etapele prin care un switch PoE pornește un AP nou conectat.',
    items: [
      { text: 'Detection — tensiune mică, căutarea semnăturii de ≈25 kΩ', why: 'Fără semnătură, portul nu este alimentat (protejează dispozitivele fără PoE).' },
      { text: 'Classification — PSE-ul află clasa de putere a PD-ului', why: 'Clasa spune cât să rezerve din buget.' },
      { text: 'Power-up — aplicarea tensiunii de lucru', why: 'Doar dacă bugetul permite.' },
      { text: 'Negociere fină prin CDP sau LLDP-MED', why: 'Opțională la PoE/PoE+ simplu, obligatorie pentru PD-urile 802.3bt Type 3/4; permite rezervarea exactă.' },
      { text: 'Monitorizare continuă (Maintain Power Signature)', why: 'Când PD-ul este deconectat, tensiunea este oprită.' },
    ],
    explanation: 'Detection → Classification → Power-up → (CDP/LLDP) → MPS. De aceea un laptop obișnuit conectat la un port PoE nu este alimentat și nu se strică.',
  },
  {
    id: '1.1-040', topicId: T, sub: '1.1.h', type: 'single', difficulty: 3,
    stem: 'Un switch are un buget PoE de 370 W. Sunt conectate deja 10 telefoane Class 2 (7 W rezervați fiecare). Câte AP-uri PoE+ Class 4 (30 W rezervați fiecare) mai pot fi alimentate, dacă switch-ul rezervă maximul clasei?',
    options: [
      { id: 'a', text: '10', correct: true, why: 'Telefoanele: 10 × 7 = 70 W. Rămân 370 − 70 = 300 W. 300 / 30 = 10 AP-uri exact.' },
      { id: 'b', text: '12', correct: false, why: '12 × 30 = 360 W ar încăpea într-un buget gol de 370 W, dar telefoanele ocupă deja 70 W.' },
      { id: 'c', text: '14', correct: false, why: '14 AP-uri ar rezulta din 370 / 25.5 (puterea la PD). Switch-ul rezervă însă puterea de la PSE (30 W).' },
      { id: 'd', text: '9', correct: false, why: 'Ar fi corect dacă ar rămâne sub 300 W. Cu 300 W rămași încap exact 10 × 30 W.' },
    ],
    explanation: 'Bugetul se calculează cu puterea rezervată la PSE (clasa: 7 / 15.4 / 30 / 60 / 90 W) sau cu valoarea negociată prin CDP/LLDP — nu cu puterea de la PD.',
  },
  {
    id: '1.1-041', topicId: T, sub: '1.1.h', type: 'multi', difficulty: 2,
    stem: 'Care DOUĂ afirmații despre PoE sunt corecte?',
    options: [
      { id: 'a', text: 'Puterea maximă poate fi negociată fin între PSE și PD prin CDP sau LLDP', correct: true, why: 'Prin TLV-urile de putere din CDP (Cisco) sau LLDP-MED / Power via MDI, PD-ul cere exact cât îi trebuie.' },
      { id: 'b', text: 'Cisco UPOE oferă până la 60 W și este o tehnologie proprietară Cisco', correct: true, why: 'UPOE (2011) folosește 4 perechi și 60 W, înainte de standardul 802.3bt. UPOE+ (90 W) este compatibil 802.3bt.' },
      { id: 'c', text: 'Puterea PoE se negociază prin DHCP', correct: false, why: 'DHCP alocă adrese IP; nu are niciun rol în negocierea puterii.' },
      { id: 'd', text: 'Cu PoE, distanța maximă a cablului crește la 200 m', correct: false, why: 'Distanța maximă rămâne 100 m, ca la Ethernet pe cupru.' },
    ],
    explanation: 'PoE nu schimbă regulile Ethernet (100 m). Negocierea fină se face la L2 (CDP/LLDP), după clasificarea hardware.',
  },
  {
    id: '1.1-042', topicId: T, sub: '1.1.h', type: 'cli', difficulty: 2,
    stem: 'Ești în modul de configurare al interfeței la care e conectat un PC (`SW1(config-if)#`). Ce comandă dezactivează PoE pe acest port?',
    prompt: 'SW1(config-if)#', canonical: 'power inline never',
    answers: ['power inline never', 'pow inl never', 'power inl never', 'power inline nev'],
    hint: 'power inline …',
    wrong: [
      { text: 'no power inline', why: 'Forma `no` readuce portul la comportamentul implicit (`auto`), deci PoE rămâne activ. Ca să-l dezactivezi explicit: `power inline never`.' },
      { text: 'power inline auto', why: '`auto` este valoarea implicită: detectează și alimentează automat — opusul a ceea ce vrei.' },
      { text: 'shutdown', why: 'Oprește complet interfața (inclusiv datele), nu doar PoE-ul. PC-ul ar rămâne fără rețea.' },
    ],
    explanation: '`power inline never` = fără PoE; `auto` = implicit; `static max <mW>` = rezervare fixă pentru un dispozitiv critic. Verificare: `show power inline`.',
  },
];
