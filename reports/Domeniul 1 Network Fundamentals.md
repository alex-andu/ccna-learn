# Construiește Domeniul 1 de la cablu la VRF

**Pe scurt:** pentru obiectivele 1.1–1.10, 1.12 și 1.13 din CCNA 200-301 v1.1, un începător trebuie să stăpânească două lucruri diferite. Primul e un **corp de recunoaștere**: rolul fiecărui dispozitiv, topologiile, cablurile, standardele PoE și Ethernet, porturile TCP/UDP, tipurile de adrese IPv6, hypervisor vs container vs VRF. Al doilea e un set de **abilități de calcul și citire**: subnetting IPv4 cu metoda blocului, abrevierea IPv6 și Modified EUI-64, citirea contoarelor din `show interfaces` și a parametrilor IP pe Windows, macOS și Linux. Verbele oficiale fixează adâncimea. Doar **1.6 și 1.8 sunt „Configure and verify”**, iar 1.10 este „Verify”. Restul („Explain”, „Describe”, „Compare”, „Identify”) se testează conceptual, deci comenzile IOS pentru 1.1–1.5, 1.12 și 1.13 sunt material didactic de verificare, nu de configurare. Contează pentru că Domeniul 1 are **20% din examen** și conține abilitatea cu cel mai mare randament din tot CCNA, subnetting-ul. O lecție care doar descrie 192.168.1.0/26 fără generator de exerciții nu antrenează viteza cerută la examen. Notele de cercetare oferă cifre verificate în surse primare pentru majoritatea faptelor „grele”: tabelul PoE Cisco, distanțele Ethernet, definițiile Cisco ale contoarelor, RFC-urile TCP/UDP/IPv6, registrele IANA, datele epuizării IPv4. Rămân neconfirmate câteva elemente: comportamentul exact al Packet Tracer, textele exacte ale mesajelor de eroare IOS și licențele majorității imaginilor Wikimedia. Acestea sunt marcate mai jos și trebuie verificate înainte de publicare. Raportul servește direct ca specificație de conținut: pentru fiecare obiectiv dă istoria („ce problemă a rezolvat”), cifrele, comenzile, capcanele și laboratoarele posibile.

> **Convenții:** **[std]** = cunoștințe standard de nivel OCG/RFC, nerecitite într-o sursă primară în această cercetare; sigure pentru predare, dar fără citare. **⚠** = valoare sau formulare neconfirmată; se verifică sau se omite. Toate output-urile IOS/OS din acest raport sunt **exemple ilustrative**, construite după formatul documentat, nu capturate de pe echipamente. Aplicația trebuie să le eticheteze așa (CLAUDE.md §5).

## Verbele obiectivelor fixează adâncimea: doar 1.6 și 1.8 cer configurare

Textul oficial v1.1 din repo e autoritar și are trei detalii care contează pentru conținut ([repo: user_provided_v11_official.md](file:///home/user/ccna-learn/research_notes/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale/user_provided_v11_official.md)). Primul: **1.1.e este doar „Controllers”**. Paranteza „(Cisco DNA Center and WLC)” era formularea v1.0. Al doilea: 1.2.f se scrie „On-premises and cloud”. Al treilea: **PoE este 1.1.h**, pe când în OCG ediția 1 (v1.0) era 1.3.c, într-un capitol despre LAN Architecture ([O'Reilly, OCG Vol 1 cap. 13](https://www.oreilly.com/library/view/ccna-200-301-official/9780135262726/ch13.xhtml)). În ediția a 2-a (v1.1), SOHO apare în capitolul 2, „Fundamentals of Ethernet LANs” ([O'Reilly, OCG 2nd ed cap. 2](https://www.oreilly.com/library/view/ccna-200-301-official/9780138229856/ch02.xhtml)).

| Obiectiv | Verb oficial | Ce se testează | Ce primește aplicația |
|---|---|---|---|
| 1.1, 1.2 | Explain / Describe | rol, strat OSI, poziție în topologie, comparații | diagrame SVG, tabele, comenzi `show` ca ilustrație |
| 1.3, 1.4 | Compare / Identify | tip de cablu/fibră, citirea contoarelor și a stării interfeței | tabele de distanțe, output-uri adnotate, laborator „cable chooser” |
| 1.5 | Compare | câmpuri, handshake, porturi | animație ladder SYN/ACK, drill de porturi |
| **1.6** | **Configure and verify** | calcul + `ip address`, `show ip interface brief`, rute C/L | generator subnetting, laborator CLI complet |
| 1.7 | Describe | RFC 1918, de ce NAT | tabel + capcana 172.16–31 |
| **1.8** | **Configure and verify** | `ipv6 address`, `eui-64`, `link-local`, `ipv6 unicast-routing` | laborator CLI complet, drill abreviere |
| 1.9 | Describe | GUA/ULA/LLA, anycast, multicast, EUI-64 | calculator EUI-64 și solicited-node |
| 1.10 | Verify | IP/mască/gateway/DNS/MAC/DHCP pe trei OS | fișă de lucru pe propriile mașini + RPi4 |
| 1.12 | Explain | Type 1/2, container vs VM, VRF | animație stive VM/container; laborator VRF în GNS3/CML |
| 1.13 | Describe | learn/forward/filter/flood, aging | animație pas cu pas a tabelei MAC |

Ordinea de predare recomandată diferă puțin de numerotare. Ordinea propusă este 1.1 → 1.2 → 1.3 → 1.4 → **1.13** → 1.5 → 1.6 → 1.7 → 1.10 (partea IPv4) → 1.8 → 1.9 → 1.10 (completarea IPv6) → 1.12. Switching-ul (1.13) se sprijină direct pe cadre, domenii de coliziune și duplex din 1.3/1.4. Verificarea pe client (1.10) e utilă imediat după IPv4, ca reflex de depanare, și se completează după IPv6, când lecția explică `fe80::…%12` din `ipconfig`. Abaterea se justifică într-un `Callout`, așa cum cere rețeta din CLAUDE.md §4.

## Dispozitivele și topologiile s-au născut din probleme de scară (1.1, 1.2)

### Router-ul rupe domeniul de broadcast și rescrie MAC-ul la fiecare hop

Un router este un dispozitiv de **Layer 3** care leagă rețele IP diferite. Problema pe care a rezolvat-o: un LAN unic (un singur domeniu de broadcast) nu scalează, iar tipuri de legături diferite (Ethernet, serial/WAN) nu se pot uni la Layer 2. Termenul „router” desemnează tradițional dispozitivul care interconectează la Layer 3, iar switch-urile multilayer fac aceeași treabă ([Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)). Logica internă se predă în patru pași [std]:

1. Router-ul acceptă cadrul adresat MAC-ului său și elimină antetul L2.
2. Caută IP-ul destinație în **RIB** prin **longest-prefix match**. La egalitate între surse diferite câștigă **administrative distance** mai mică, iar în cadrul aceluiași protocol, **metric**-ul mai mic.
3. Decrementează **TTL** și recalculează checksum-ul antetului.
4. Rezolvă MAC-ul next-hop prin **ARP** (IPv4) sau **NDP** (IPv6) și construiește un cadru L2 nou.

Concluzia pe care examenul o verifică obsesiv: **adresele IP rămân aceleași pe tot drumul (fără NAT), iar adresele MAC se schimbă la fiecare router.** La un nivel mai adânc, **CEF** precalculează din RIB un **FIB** și un **adjacency table** cu antetele L2 gata construite, astfel încât data plane-ul nu mai caută ruta „per pachet” (`show ip cef`). Tot aici se introduc cele trei planuri (control, data, management), care leagă lecția de SDN din 6.x [std].

Output-ul `show ip route` merită disecat câmp cu câmp: codul (C, L, S, O), prefixul/lungimea, `[AD/metric]`, next hop, vechimea rutei, interfața de ieșire și „Gateway of last resort” = 0.0.0.0/0. De la IOS 15, fiecare rețea conectată generează o rută **C** și o rută **L** /32 ⚠ (versiunea exactă nu a fost verificată). Capcanele de examen sunt patru. Un router rupe domeniile de broadcast, un switch doar pe cele de coliziune. Prefixul mai lung bate AD-ul mai mic: o rută OSPF /25 câștigă în fața unei rute statice /24 pentru o adresă din /25. „Default gateway” înseamnă IP-ul interfeței router-ului din subnetul host-ului. Exemple de familii Cisco: ISR 1000/4000, Catalyst 8200/8300/8500, ASR 1000. În PT există 1841, 1941, 2901, 2911 și ISR4331 [std].

### De la hub la switch multilayer: fiecare pas a eliminat un blocaj

Evoluția se predă ca un lanț de probleme rezolvate. **Hub-ul** (L1) repeta fiecare cadru pe toate porturile, cu excepția celui de intrare, ceea ce scădea eficiența ([Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)). Rezulta un singur domeniu de coliziune, half duplex și CSMA/CD. **Bridge-ul** a apărut în **1983**: Mark Kempf de la DEC a inventat bridge-ul MAC, iar DEC a lansat **LANBridge 100** cu două porturi. DEC a licențiat brevetul fără redevențe, ceea ce a permis standardizarea IEEE ([Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)). **Kalpana** a lansat în **1989/1990** EtherSwitch, primul switch Ethernet multiport, cu 7 porturi ([aceeași sursă](https://en.wikipedia.org/wiki/Network_switch)). Switch-ul este un bridge multiport implementat în hardware (ASIC). Fiecare port devine propriul domeniu de coliziune, full duplex-ul elimină coliziunile (microsegmentare), dar VLAN-ul rămâne un singur domeniu de broadcast. **Switch-ul multilayer (L3)** a apărut pentru că rutarea inter-VLAN printr-un router extern („router-on-a-stick”) devenise gâtul de sticlă. Switch-ul L3 rutează în hardware, la viteza liniei, prin **SVI** (`interface vlan 10` + IP = default gateway pentru VLAN 10) și **routed ports** (`no switchport`), cu `ip routing` activat [std]. Logica de bază a switch-ului L2 (learn, forward/filter, flood) este detaliată la 1.13. Hardware-ul se predă la nivel înalt [std]: **CAM** face potriviri exacte MAC → port, iar **TCAM** (valori 0/1/„don't care”) face potriviri cu mască, folosite pentru FIB, ACL și QoS. TCAM e material „extra peste CCNA”. Familii Cisco: Catalyst 9200/9300 (access), 9400, 9500/9600 (core/distribution), Nexus 9000 (data center). În PT: 2960 (L2), 3560/3650 (L3). Capcane: un switch L2 cu IP de management pe SVI **nu** devine router, iar „multilayer switch” e sinonim cu „Layer 3 switch”.

### NGFW = stateful firewall + aplicații + IPS; IDS doar privește

Cisco definește un NGFW ca dispozitiv care „combină funcțiile tradiționale de stateful firewall” cu application awareness, intrusion prevention integrat, detecție avansată a amenințărilor și identitatea utilizatorului. Un firewall tradițional filtrează după **5-tuple** și starea conexiunii, iar ce diferențiază NGFW-ul este „inspecția la nivelul aplicației” ([Cisco: NGFW vs traditional firewall](https://www.cisco.com/site/us/en/learn/topics/security/what-is-a-next-generation-firewall.html)). Fișa tehnică Firepower NGIPS dă cifrele concrete. Motorul e construit pe **Snort** și poate rula **inline** cu module Fail-To-Wire/Bypass. **AVC** controlează „peste 4000 de aplicații comerciale”, plus OpenAppID. URL filtering-ul acoperă „peste 80 de categorii”. **Talos** „colectează și corelează amenințări în timp real” și alimentează automat regulile și Security Intelligence ([Cisco NGIPS data sheet](https://www.cisco.com/c/en/us/products/collateral/security/ngips/datasheet-c78-742472.html)). Numele actual al produsului e **Cisco Secure Firewall Threat Defense (FTD)**, cu varianta virtuală FTDv ([Cisco FTDv data sheet](https://www.cisco.com/c/en/us/products/collateral/security/firepower-ngfw-virtual/datasheet-c78-742858.html)).

Istoria se predă ca motiv al schimbării [std]. Primul pas a fost **packet filter-ul stateless** (un ACL), apoi **firewall-ul stateful** (PIX → ASA), apoi NGFW-ul. Schimbarea a venit când totul a început să circule pe TCP 443, iar regulile bazate pe port nu mai puteau distinge chat-ul de banking.

| | IDS | IPS |
|---|---|---|
| Plasare | out-of-band, **promiscuous** (copie prin SPAN/TAP) | **inline**, traficul trece prin el |
| Acțiune | alertă/log (eventual TCP reset) | drop/block în timp real |
| Impact | fără latență | latență mică; dacă cade, poate tăia traficul, cu excepția modurilor fail-open/bypass |

Detecția **signature-based** prinde atacurile cunoscute și are nevoie de actualizări. Detecția **anomaly-based** compară traficul cu un baseline, prinde zero-day-uri, dar produce mai multe false pozitive [std]. Capcane: un ACL pe router este **stateless**, NGFW-ul face în continuare filtrare stateful (e un superset, nu un înlocuitor), iar zonele se numesc inside, outside și **DMZ** pentru serverele publice.

### AP-ul face puntea 802.11↔802.3; Catalyst Center nu atinge traficul utilizatorilor

AP-ul este un bridge L2 între 802.11 și 802.3. De obicei e alimentat prin PoE și mapează mai multe SSID-uri pe VLAN-uri. Evoluția a pornit de la **AP-ul autonomous**, configurat individual și cu trunk spre switch. Problema era scara: 500 de AP-uri configurate unul câte unul, fără RRM coordonat și fără roaming. Soluția a fost **lightweight AP + WLC** în arhitectura **split-MAC**. AP-ul păstrează funcțiile în timp real (beacons, ACK, criptare), iar WLC-ul preia managementul, autentificarea, RRM-ul și roaming-ul. Tunelul **CAPWAP** folosește UDP **5246 (control, criptat DTLS)** și **5247 (date)**. Un AP în Local mode stă pe un port **access**, iar FlexConnect comută local, în sucursală [std]. Lecția trebuie să trimită la pilotul 1.11 deja scris și la 2.6/2.7.

**Cisco DNA Center a devenit Cisco Catalyst Center**. Blogul DevNet din 13 noiembrie 2023 spune că versiunile mai vechi ale API-ului „vor fi denumite în continuare Cisco DNA Center”, iar cele noi vor purta numele Catalyst Center ([Cisco DevNet blog](https://blogs.cisco.com/developer/cisco-dna-center-has-a-new-name-and-new-features)). Redenumirea coincide aproximativ cu release-ul 2.3.7 din 2023 ([Cisco Catalyst Center 2.3.7 data sheet](https://www.cisco.com/c/ja_jp/products/collateral/cloud-systems-management/dna-center/nb-06-dna-center-data-sheet-cte-en.html)). Prima versiune exactă cu numele nou și anunțul de la Cisco Live din iunie 2023 rămân ⚠. Conținutul trebuie să scrie „Cisco Catalyst Center (fost DNA Center)” și să predea în continuare „WLC”, pentru că întrebările folosesc ambele nume.

| | WLC | Catalyst Center |
|---|---|---|
| Domeniu | AP-uri și WLAN-uri | întreaga rețea: switch-uri, routere, WLC/AP |
| Data plane | da, în Local mode (prin el trec tunelurile CAPWAP) | **nu**, doar management și control |
| Rol | config AP, RRM, roaming, autentificare clienți | automatizare, politici SD-Access, assurance, API-uri REST northbound |

În SD-Access, Catalyst Center lucrează împreună cu ISE: LISP în control plane, VXLAN în data plane, SGT pentru politici ([repo: topic_depth_commands.md](file:///home/user/ccna-learn/research_notes/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale/topic_depth_commands.md)). Capcane: un AP lightweight nu funcționează fără WLC, iar „Controllers” din v1.1 e un termen generic care acoperă WLC, Catalyst Center și controllerele SDN în general. Tipurile de WLC (appliance 9800-40/80, 9800-CL în cloud, embedded pe 9300, EWC pe AP) sunt utile pentru 2.6, dar lineup-ul actual e ⚠.

### Endpoint-urile și serverele sunt roluri, nu forme de hardware

Pentru 1.1.f/g notele nu au o sursă primară, iar conținutul e [std], conceptual. **Endpoint-ul** produce sau consumă date: PC, telefon, IP phone, imprimantă, cameră IP, senzor IoT. Are NIC cu MAC, IP, mască, gateway și DNS, lucrează pe toate cele 7 straturi și este principala suprafață de atac (de aici legătura cu EPP/EDR și ISE din 5.x). **Serverul** oferă servicii (web, DNS, DHCP, fișiere, AAA). Poate fi fizic, VM sau container și de obicei are IP static sau rezervare DHCP. Serverele publice stau în DMZ. Capcana clasică: un PC care rulează un server web *este* server pentru acel serviciu.

### PoE: valoarea de la PSE nu este valoarea de la PD

PoE transportă curent continuu și date pe același cablu, de la **PSE** (switch PoE sau injector midspan) la **PD** (AP, telefon, cameră). Pierderile pe cei 100 m de cablu fac ca puterea la PD să fie mai mică decât cea de la PSE. Tabelul de referință vine din white paper-ul Cisco UPOE+:

| Tip | IEEE (an) | Nume | Clase | Perechi | Max la PSE | Garantat la PD |
|---|---|---|---|---|---|---|
| 1 | 802.3af (2003) | PoE | 0–3 | 2 | **15,4 W** | **12,95 W** |
| 2 | 802.3at (2009) | PoE+ | 4 | 2 | **30 W** | **25,5 W** |
| — | Cisco UPOE (2011) | proprietar | — | 4 | 60 W | 51 W |
| 3 | 802.3bt (2018) | PoE++ / 4PPoE | 5–6 | 4 | **60 W** | **51 W** |
| 4 | 802.3bt (2018) | PoE++ / 4PPoE | 7–8 | 4 | **90 W** | **71 W** (71,3 W la clasa 8) |

Sursele: [Cisco UPOE+ white paper](https://www.cisco.com/content/en/us/solutions/collateral/enterprise-networks/nb-06-upoe-plus-it-ot-wp-cte-en.html) pentru tabel și [Microchip: PoE standards](https://developerhelp.microchip.com/xwiki/bin/view/applications/ethernet/poe/standards/) pentru ani și tensiuni. Documentul Cisco se contrazice singur: în proză scrie „54,4 W” la PD pentru UPOE și un interval de 40–73 W pentru bt. Recomandarea e să se predea **51 W și 71,3 W**, adică valorile din tabel și din IEEE. **UPOE+** combină 802.3bt cu UPOE și există pe modele Catalyst 9300/9400 de 90 W. Tensiunile la PSE sunt 44–57 V pentru Type 1, 50–57 V pentru Type 2/3 și 52–57 V pentru Type 4 ([Microchip](https://developerhelp.microchip.com/xwiki/bin/view/applications/ethernet/poe/standards/)). 802.3bt-2018 a fost integrat ulterior în IEEE 802.3-2022 ([Wikipedia: PoE](https://en.wikipedia.org/wiki/Power_over_Ethernet)).

Procesul se pretează la o animație în cinci etape:

1. **Detection:** PSE-ul aplică o tensiune mică și caută rezistența-semnătură de **25 kΩ** (acceptă 19–26,5 kΩ). Un PC obișnuit nu e alimentat niciodată, deci conectarea lui e sigură.
2. **Classification:** la 14,5–20,5 V, PSE-ul măsoară curentul de clasificare și află clasa PD-ului.
3. **Power-up:** PSE-ul aplică tensiunea completă.
4. **Negociere L2 opțională:** prin **LLDP** (TLV-uri Power-via-MDI, pași de **0,1 W**) sau **CDP**. CDP-ul îi comunică telefonului și voice VLAN-ul.
5. **Maintain Power Signature** [std]: puterea se întrerupe când PD-ul se deconectează.

Sursa pentru pașii 1–4 este [Wikipedia: PoE](https://en.wikipedia.org/wiki/Power_over_Ethernet). Clasificarea L2 este obligatorie pentru Type 3/4 ([Microchip](https://developerhelp.microchip.com/xwiki/bin/view/applications/ethernet/poe/standards/)). Înainte de standard, Cisco avea propriul „inline power”, de aproximativ 10 W pe port, negociat prin CDP ([Wikipedia: PoE](https://en.wikipedia.org/wiki/Power_over_Ethernet)). Anul introducerii (în jur de 2000) e ⚠.

Exemplul de **power budget** merge direct într-un exercițiu: 24 AP × 30 W = 720 W, care nu încap într-un buget de 370 W. Comenzile de interfață [std] sunt `power inline auto` (implicit), `never`, `static [max mW]` și `police`, iar verificarea se face cu `show power inline` (Available/Used/Remaining). Capcane:

- „PoE+ = 30 W” este valoarea de la PSE; PD-ul primește 25,5 W.
- Mnemonic alfabetic: a**f** → a**t** → b**t**.
- Puterea se negociază prin CDP/LLDP, niciodată prin DHCP.
- Switch-ul e PSE, telefonul e PD; cursanții le inversează des.
- Limita de distanță rămâne 100 m.

### Două niveluri, trei niveluri, spine-leaf: campusul vs data center-ul

Ierarhia de campus are trei roluri [std]. **Access** conectează endpoint-urile și asigură PoE, VLAN-uri, port security, 802.1X, PortFast/BPDU Guard. **Distribution** agregă switch-urile de acces și este granița L2/L3: SVI-uri, FHRP, ACL/QoS, sumarizare. **Core** asigură transport L3 rapid și redundant, **fără politici**. **Two-tier (collapsed core)** comasează core-ul cu distribution-ul și se potrivește site-urilor mici și medii. Slăbiciunea lui este creșterea legăturilor de tip full mesh, aproximativ N², la adăugarea de blocuri de distribuție. Acesta e motivul pentru care three-tier adaugă un core, spre care blocurile se conectează liniar. Pragul „core de la ~3 blocuri” și raporturile de oversubscription 20:1 / 4:1 din campus sunt ⚠. Calculul de oversubscription e totuși aritmetică pură: 48×1G în jos și 2×10G în sus dau 48/20 = **2,4:1**.

Data center-ele au trecut la **spine-leaf (Clos)**. Spine-ul „interconectează toate switch-urile leaf”, iar fiecare leaf e legat de fiecare spine într-un full mesh. Legăturile sunt L3 cu **ECMP**, atât pentru traficul **east-west** server-server, cât și pentru cel south-north, iar „fiecare cale are performanță egală” ([Cisco MSDC fabric white paper](https://cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html)). Capacitatea se crește adăugând spine-uri. Exemplul Cisco de oversubscription pe leaf este **1,5:1 (48×25G : 8×100G)**, iar fabric-urile pentru AI rulează la 1:1 ([aceeași sursă](https://cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html)). De ce a câștigat spine-leaf [std]: STP bloca jumătate din legăturile vechiului three-tier din DC, numărul de hopuri east-west era variabil, iar căderea unui spine reduce acum capacitatea doar cu 1/N. Capcane: **nu există legături leaf↔leaf sau spine↔spine**, serverele se conectează doar la leaf-uri, iar spine-leaf ține de DC, two/three-tier de campus.

### WAN, SOHO și cloud: topologii numărabile și un standard NIST

Topologiile WAN [std] sunt point-to-point, hub-and-spoke (traficul spoke↔spoke trece prin hub, care devine SPOF), full mesh cu **n(n−1)/2** legături (5 site-uri → 10 legături) și partial mesh. Variantele single-homed, dual-homed, multihomed și dual-multihomed apar în OCG, dar formularea exactă e ⚠. Serviciile private sunt leased line (HDLC/PPP), **MPLS L3VPN** (roluri CE/PE/P; clientul vede doar rutarea CE–PE) și **Metro Ethernet** cu serviciile MEF E-Line, E-LAN și E-Tree. Variantele publice sunt VPN-ul IPsec site-to-site sau remote-access peste DSL, cablu (DOCSIS), fibră (GPON), 4G/5G. SD-WAN rămâne la nivel de concept. **SOHO** înseamnă un singur dispozitiv care adună router (NAT/PAT, DHCP, DNS proxy), switch cu 4 porturi, AP, firewall și uneori modem/ONT. Exact acesta e punctul de examen: un dispozitiv, multe funcții logice. Pentru ilustrare, repo-ul conține deja `wifi6-router-back.jpg` ([repo attribution.json](file:///home/user/ccna-learn/web/public/img/wiki/attribution.json)).

Cloud-ul se predă după **NIST SP 800-145 (sept. 2011)**. Are **5 caracteristici esențiale**: on-demand self-service, broad network access, resource pooling, rapid elasticity și measured service. Are **3 modele de serviciu**: în **IaaS**, clientul controlează OS-ul și storage-ul; în **PaaS**, controlează aplicațiile și setările de hosting; în **SaaS**, doar folosește aplicația. Are **4 modele de implementare**: private, community, public și hybrid ([NIST SP 800-145](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf)). Capcane: IaaS e singurul model în care **gestionezi OS-ul**, un private cloud nu trebuie să fie neapărat on-prem, iar examenul poate lista doar 3 modele de implementare. Pentru un cursant din România se adaugă contextul GDPR (suveranitatea datelor), compromisul CapEx vs OpEx și conectarea la cloud prin Internet/VPN sau prin interconectări dedicate de tip Direct Connect/ExpressRoute [std].

## Stratul fizic: 100 m pe cupru, kilometri pe fibră, contoare care trădează duplex mismatch (1.3, 1.4)

### Istoria Ethernet ca lanț „problemă → standard”

Ethernet a pornit pe coaxial partajat. **10BASE5 („thicknet”)** a fost standardizat de Ecma în 1982 și de IEEE 802.3 în **1983**. Folosea coaxial de 50 Ω, cu diametrul de circa 10 mm, segment de maximum **500 m** și cel mult **100 de noduri într-un singur domeniu de coliziune**. Transceiverele se montau doar la intervale de 2,5 m, prin „vampire taps”. O conexiune proastă putea opri toată rețeaua, iar standardul a fost declarat depășit pentru instalări noi în 2003 ([Wikipedia: 10BASE5](https://en.wikipedia.org/wiki/10BASE5)). **10BASE2 („thinnet”, 1984)** folosea RG-58, cu **185 m** și 30 de stații pe segment, conectori BNC în T și terminatoare de 50 Ω. O singură întrerupere oprea tot segmentul, iar 10BASE-T l-a înlocuit ([Wikipedia: 10BASE2](https://en.wikipedia.org/wiki/10BASE2)). Regula 5-4-3 și cablul AUI de 50 m sunt ⚠.

| Standard | IEEE | An | Cablu minim | Perechi | Distanță |
|---|---|---|---|---|---|
| 10BASE-T | 802.3i | 1990 | Cat 3 | 2 | 100 m |
| 100BASE-TX | 802.3u | 1995 | Cat 5 | 2 | 100 m |
| 1000BASE-T | 802.3ab | 1999 | Cat 5 | **4** | 100 m |
| 2.5GBASE-T | 802.3bz | 2016 | Cat 5e | 4 | 100 m |
| 5GBASE-T | 802.3bz | 2016 | Cat 6 (Wikipedia) / Cat 5e ⚠ | 4 | 100 m |
| 10GBASE-T | 802.3an | 2006 | **Cat 6A** (Cat 6 ≈ 55 m) | 4 | 100 m |
| 25G/40GBASE-T | 802.3bq | 2016 | Cat 8 | 4 | **30 m** |

Tabelul vine din [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair). Fiecare rând răspunde unei probleme. **10BASE-T** a adus cablajul în stea spre un hub: un cablu defect afectează un singur PC, iar cablul e ieftin, de tip telefonic. **100BASE-TX** a fost de 10× mai rapid pe Cat5 și a introdus autonegocierea pentru compatibilitate înapoi ([Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet)). Gigabit-ul a apărut întâi pe fibră: **802.3z (iunie 1998)** a împrumutat stratul fizic din Fibre Channel, cu codare 8b/10b. Abia apoi **1000BASE-T** a adus gigabit-ul pe Cat5-ul *existent*, transmițând bidirecțional pe toate 4 perechile, cu PAM-5 și echo cancellation ([Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)). **802.3bz** a apărut pentru că AP-urile 802.11ac Wave 2 depășeau 1 Gb/s, iar recablarea era scumpă ([Cisco blog: NBASE-T](https://blogs.cisco.com/networking/nbase-t-alliance-achieving-a-new-industry-standard)). Pentru cablul minim de la 5GBASE-T, sursele se contrazic: Cisco vorbește de „Cat 5e/6” fără distincție. Formularea sigură pentru lecție: „2.5G/5G = refolosești Cat5e/Cat6 existent”.

Pe fibră, cifrele verificate sunt următoarele. **100BASE-FX** are 2 km în full duplex, dar doar 412 m în half duplex, ca să poată detecta coliziunile ([Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet)). **1000BASE-SX** (850 nm, MMF) ajunge la 275 m pe OM1 și 550 m pe OM2. **1000BASE-LX** (1310 nm) ajunge la 5 km pe SMF și 550 m pe MMF ([Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)). **802.3ae (2002)** definește 10GBASE-SR (33 m OM1, 82 m OM2, **300 m OM3**, 400 m OM4), **10GBASE-LR** (1310 nm, 10 km) și **10GBASE-ER** (1550 nm, 40 km). SFP+ și XFP sunt MSA-uri, nu standarde IEEE ([Wikipedia: 10 Gigabit Ethernet](https://en.wikipedia.org/wiki/10_Gigabit_Ethernet)). Mnemonicul de denumire [std]: T = twisted pair, S = short (850), L = long (1310), E = extended (1550).

### Cupru: perechile 2 și 3, MDI vs MDI-X și de ce gigabit-ul complică regula

T568A și T568B diferă doar prin **inversarea perechilor 2 și 3** (portocaliu ↔ verde). Un capăt A și unul B dau un cablu crossover la 10/100. Dispozitivele **MDI** (PC, router, server, AP, firewall) transmit pe pinii 1,2 și recepționează pe 3,6, iar **MDI-X** (hub, switch) invers. De aici regula: dispozitive diferite → straight-through, dispozitive de același fel → crossover. Echipamentele mai noi comută automat (Auto-MDIX), iar 1000BASE-T funcționează cu oricare dintre cabluri ([Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)). Auto MDI/MDI-X e opțional la gigabit, dar implementat aproape peste tot ([Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)). Cisco listează cablajul încrucișat greșit drept cauză de „no link integrity”, iar Cat3 folosit la 100BASE-TX drept cauză de „excessive noise” ([Cisco Internetwork Troubleshooting Guide: Ethernet](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html)).

Câteva detalii utile pentru lecție sunt [std]. Ordinea T568B este alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro. Cablul **rollover** (consolă) inversează pinii 1↔8 … 4↔5, iar consola merge la **9600 baud, 8N1**, fără flow control. Canalul de 100 m înseamnă 90 m de permanent link plus 10 m de patch cords (TIA-568). UTP-ul anulează interferențele prin răsucire. STP/FTP se folosesc în medii cu EMI ridicat și cer împământare. Tipurile de crosstalk sunt NEXT, FEXT și alien crosstalk, cel din urmă critic la 10GBASE-T. Comanda `mdix auto` e implicită pe majoritatea Catalyst-urilor; dependența ei de `speed/duplex auto` e ⚠. Predarea recomandată pornește de la regula empirică, apoi spune imediat că Auto-MDIX face ca aproape orice să meargă cu straight-through, dar examenul întreabă regula clasică. Capcana: **router↔PC direct = crossover**, pentru că ambele sunt MDI.

### Fibra: miezul mic duce departe, miezul mare e ieftin

| | Multimode (MMF) | Single-mode (SMF) |
|---|---|---|
| Miez / cladding | 50 sau 62,5 µm / 125 µm | ~9 µm / 125 µm [std] |
| Sursă | LED / **VCSEL**, 850 (1300) nm | **laser**, 1310 / 1550 nm |
| Limitare | **modal dispersion** | atenuare |
| Distanță tipică | sute de metri | km – zeci de km |
| Culoare manta | OM1/OM2 portocaliu, OM3/OM4 **aqua**, OM5 lime | **galben** |

| Clasă OM | Miez | Bandă modală la 850 nm (MHz·km) |
|---|---|---|
| OM1 | 62,5 µm | 200 |
| OM2 | 50 µm | 500 |
| OM3 | 50 µm | 1500 |
| OM4 | 50 µm | 3500 |
| OM5 | 50 µm | 3500 (și 1850 la 953 nm) |

Datele vin din [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber). Aceeași sursă precizează că LED-urile sunt limitate la circa 622 Mb/s, VCSEL-urile modulează peste 10 Gb/s, iar dispersia modală întinde impulsul și produce interferență între simboluri. Conectorii au caracteristici distincte. **LC** are ferulă de 1,25 mm, zăvor și e folosit pe SFP/SFP+. **SC** are 2,5 mm, sistem push-pull și e cel mai răspândit. **ST** are 2,5 mm și baionetă. **MPO/MTP** grupează 4–24 de fibre. **APC** înseamnă capăt înclinat la 8°, cu corp verde ([Wikipedia: Optical fiber connector](https://en.wikipedia.org/wiki/Optical_fiber_connector)). **BiDi** pe o singură fibră: 1000BASE-BX10 folosește 1490 nm în jos și 1310 nm în sus, pe 10 km (802.3ah) ([Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)). Progresia transceiverelor e [std]: GBIC → SFP (1G) → SFP+ (10G) → SFP28 (25G) → QSFP+ (40G) → QSFP28 (100G). La fibra duplex, Tx-ul unui capăt trebuie să ajungă pe Rx-ul celuilalt, altfel link-ul nu urcă. Atenuările OS1/OS2 sunt ⚠. Capcana de examen: MMF nu e „fibră mai proastă”, ci optică mai ieftină. **SMF are miezul mai mic, dar distanța mai mare.**

### Shared media vs point-to-point (1.3.b): de ce cadrul minim are 64 de octeți

Pe mediu partajat (bus coaxial sau hub) toate stațiile sunt într-un singur domeniu de coliziune și folosesc half duplex cu CSMA/CD ([Wikipedia: 10BASE5](https://en.wikipedia.org/wiki/10BASE5)). Pașii CSMA/CD sunt [std]: ascultă, transmite, detectează coliziunea, trimite jam signal, așteaptă un backoff aleator (truncated binary exponential), iar după 16 încercări renunță. Cisco confirmă pragul: **Excess-Col = cadru abandonat după 16 coliziuni consecutive** ([Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)). Cadrul minim de **64 de octeți** există pentru ca emițătorul să transmită încă atunci când vestea coliziunii vine de la capătul cel mai îndepărtat, adică în cele **512 bit-times** ale slot time-ului ([Cisco Troubleshooting Guide](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html); [Wikipedia: Ethernet frame](https://en.wikipedia.org/wiki/Ethernet_frame)). Full duplex cere o legătură point-to-point fără hub, cu căi Tx și Rx separate. Cisco suportă la 1 Gb/s doar full duplex: half duplex e posibil doar cu `speed 100`, altfel IOS afișează „% Duplex cannot be set to half when speed autonegotiation subset contains 1Gbps” ([Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)). Legăturile seriale WAN (HDLC implicit Cisco, PPP cu PAP/CHAP, `clock rate` pe DCE) rămân la nivel de concept [std]. Analogia recomandată: mediul partajat e o conferință prin stație walkie-talkie, în care vorbește unul singur; full duplex-ul e un apel telefonic privat.

### 1.4: contoarele se citesc în trei găleți

Definițiile Cisco vin din [TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html) și din [Internetwork Troubleshooting Guide](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html):

| Contor | Definiție Cisco | Cauze tipice |
|---|---|---|
| input errors | sumă (runts, giants, no buffer, CRC, frame, overrun, ignored); sub-contoarele nu trebuie să dea totalul | vezi sub-contoarele |
| **CRC** | checksum-ul nu se potrivește; „de obicei zgomot sau probleme de transmisie” | cablu deteriorat, Cat3 la 100 Mb, EMI, NIC defect, duplex mismatch |
| frame | CRC + număr neîntreg de octeți | coliziuni, defect fizic |
| **runts** | < 64 de octeți (cu CRC greșit) | duplex mismatch, coliziuni, NIC |
| **giants** | > 1518 octeți (non-jumbo) | NIC defect, MTU/jumbo mismatch |
| ignored / no buffer | aruncate din lipsă de buffere; cresc la broadcast storm | furtuni, rafale |
| overrun | rata de intrare a depășit capacitatea hardware | trafic peste capacitate |
| **collisions** | normale în half duplex; **nu trebuie să apară în full duplex**; > ~0,1% din output = excesiv | segment aglomerat, duplex mismatch |
| **late collision** | coliziune după 512 bit-times (51,2 µs la 10 Mb/s) | **duplex mismatch (latura half)**, cablu prea lung |
| output drops | coada de ieșire plină | **congestie**, nu defect de cablu |
| interface resets | resetări complete (pachete netrimise câteva secunde, buclă, shutdown) | pierdere de carrier, keepalive |

Simptomele din ghidul Cisco se predau ca diagnostic. „Excessive noise” înseamnă CRC mare cu puține coliziuni. „Excessive runts” pe Ethernet comutat înseamnă underruns sau NIC defect ([Cisco Troubleshooting Guide](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html)). Câmpurile BW și DLY din `show interfaces` nu sunt măsurate; servesc la metrici. Reliability, txload și rxload sunt medii exponențiale pe 5 minute, exprimate ca x/255 ([NetworkLessons](https://networklessons.com/troubleshooting/cisco-ios-show-interface-explained)). Cele trei găleți pentru lecție sunt: (1) fizic/zgomot (CRC, frame, giants), (2) duplex/coliziuni (collisions, late collisions, runts), (3) congestie/buffere (drops, ignored, overrun). A treia găleată **nu** indică un cablu defect. 1518 = 1500 + 14 + 4, iar 1522 e cadrul cu tag 802.1Q [std].

### Duplex mismatch: link-ul e up/up, ping-ul merge, performanța se prăbușește

Mecanismul trebuie predat precis. Când o parte negociază și cealaltă e setată manual, partea pe auto poate detecta viteza prin **parallel detection**, dar „nu poate determina duplex-ul, așa că presupune întotdeauna half duplex” ([Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)). Cisco confirmă că **setarea manuală a vitezei dezactivează complet autonegocierea**, pentru viteză și pentru duplex. Un port nu poate detecta duplex-ul unui partener care nu negociază, iar link-ul poate apărea „connected” chiar cu mismatch ([Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)). Simptomele: ping-ul reușește, dar throughput-ul scade drastic ([Wikipedia](https://en.wikipedia.org/wiki/Autonegotiation)). Cisco listează creșterea rapidă a erorilor FCS și de aliniere, runts pe latura full, late collisions pe latura half și mesajul `%CDP-4-DUPLEX_MISMATCH`, care raportează problema fără să o repare ([Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)).

**Conflict de surse:** Wikipedia plasează erorile FCS pe latura full, iar TN 10561 le pune pe latura half, cu runts pe latura full. Mecanic, ambele situații apar. Pentru examen, perechea testată de obicei este **„late collisions pe latura half; CRC/runts pe latura full”** ⚠ (de verificat în OCG Vol. 1). Istoria explică de ce administratorii setau manual: autonegocierea era opțională în 802.3u (1995, clauza 28, bazată pe NWay de la National Semiconductor), primele implementări erau inconsistente, iar abia la 1000BASE-T (1999) a devenit obligatorie ([Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)). Recomandarea Cisco: **auto pe ambele părți sau aceeași valoare manuală pe ambele** ([Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)).

| Latura A | Latura B | Rezultat |
|---|---|---|
| auto | auto | cea mai bună viteză comună, full duplex |
| auto | 100/full manual | A: 100 (detectat) / **half** → duplex mismatch |
| auto | 1000/full manual | A: 1000/full ⚠ (implicitul gigabit) |
| 100/full | 100/full | OK |
| 100 | 1000 manual | **link down** (speed mismatch) |

Starea interfeței se citește „Layer 1 / Layer 2” ([Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)):

- **up/up**: interfața funcționează.
- **administratively down/down**: s-a configurat `shutdown`.
- **down/down**: lipsește cablul, cablul e defect sau capătul celălalt e inactiv.
- **up/down**: Layer 1 e în regulă, dar Layer 2 nu. Pe serial, cauza e de obicei encapsulation mismatch HDLC/PPP sau lipsa clock-ului [std].
- **err-disabled**: switch-ul a oprit portul. Cauze: misconfigurare EtherChannel, duplex mismatch, BPDU guard, UDLD. Recuperarea automată nu ajută dacă problema se repetă.

Din `show interfaces status`, prefixul „a-” (de exemplu `a-half`, `a-100`) arată că valoarea a fost autonegociată ([Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)). Comenzile sunt `speed`, `duplex`, `show interfaces [status | capabilities | counters errors]` și `show cdp neighbors`. Recuperarea din err-disabled se face cu `shutdown`/`no shutdown` sau cu `errdisable recovery cause …` [std].

## Switch-ul învață sursa, comută după destinație, inundă necunoscutul (1.13)

Adresa MAC (EUI-48) are 48 de biți, iar primii 24 formează **OUI**-ul producătorului. Bitul cel mai puțin semnificativ al primului octet este **I/G**: 0 = unicast, 1 = multicast/broadcast. Bitul următor este **U/L**: 1 = administrată local. Ethernet transmite fiecare octet începând cu bitul cel mai puțin semnificativ, deci I/G e primul bit pe fir. Broadcast-ul este FF:FF:FF:FF:FF:FF, iar multicast-ul IPv6 se mapează pe 33-33-xx ([Wikipedia: MAC address](https://en.wikipedia.org/wiki/MAC_address)). Cadrul conține preamble 7 B, SFD 1 B, destinație 6 B, sursă 6 B, tag 802.1Q opțional de 4 B, EtherType/Length 2 B, payload 46–1500 B și FCS 4 B (CRC-32). Valorile ≥ 0x0600 sunt EtherType (IPv4 = 0x0800), iar TPID-ul 802.1Q este 0x8100 ([Wikipedia: Ethernet frame](https://en.wikipedia.org/wiki/Ethernet_frame)). Exercițiu de examen: dacă primul octet e impar (01-, 33-, FF-), adresa e multicast/broadcast. Dacă a doua cifră hex e 2, 6, A sau E, adresa e administrată local.

Logica de comutare e [std], standard Cisco/OCG, și are trei verbe. **Learn:** la fiecare cadru, switch-ul citește MAC-ul **sursă** și creează sau reîmprospătează intrarea {VLAN, MAC, port, DYNAMIC}. Nu învață niciodată din destinație, iar adresele broadcast nu apar niciodată ca sursă. **Aging:** timer-ul intrării se resetează la fiecare cadru văzut de la acel MAC, iar după **300 s (implicit Cisco)** intrarea dispare. Se configurează cu `mac address-table aging-time`; intervalul exact pe Catalyst 9000 e ⚠. **Forward/filter/flood:** pentru unicast cunoscut, cadrul iese pe un singur port. Dacă portul destinație coincide cu cel de intrare, cadrul e filtrat (cazul unui hub în spatele portului). Pentru **unknown unicast**, broadcast și multicast fără IGMP snooping, cadrul e inundat pe toate porturile VLAN-ului, cu excepția celui de intrare. Inundarea rămâne în VLAN și trece pe trunk-uri, iar inundarea combinată cu bucle produce broadcast storm, motivul pentru STP (2.5). Mutarea rapidă a aceluiași MAC între porturi indică o buclă (`%SW_MATM-4-MACFLAP_NOTIF`; formatul exact e ⚠). Ca metode de comutare, **store-and-forward** verifică FCS-ul și e implicită pe Catalyst, **cut-through** pleacă după MAC-ul destinație fără să verifice FCS-ul, iar **fragment-free** pleacă după 64 de octeți și e o metodă istorică.

Exemplul de lecție folosește 4 PC-uri pe un switch cu tabela goală:

1. A → B: switch-ul învață A@Fa0/1. B e necunoscut, deci cadrul e inundat pe Fa0/2–4.
2. B răspunde: switch-ul învață B@Fa0/2 și trimite cadrul doar pe Fa0/1.
3. C trimite un ARP broadcast: switch-ul învață C@Fa0/3 și inundă cadrul.
4. D răspunde unicast: switch-ul învață D@Fa0/4, iar tabela e completă.
5. După 300 s de inactivitate, intrarea lui B expiră. Următorul cadru spre B este inundat din nou.

```
SW1# show mac address-table          ! exemplu ilustrativ
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
 All    0100.0ccc.cccc    STATIC      CPU
   1    000a.1111.1111    DYNAMIC     Fa0/1
  10    0011.2233.4455    STATIC      Fa0/10
SW1# show mac address-table aging-time
Global Aging Time:  300
```

Comenzile utile [std]: `show mac address-table [dynamic | address | interface | vlan | count]`, `clear mac address-table dynamic` (intrările statice rămân), `mac address-table static 0011.2233.4455 vlan 10 interface Gi0/1`. IOS-ul vechi folosea forma `mac-address-table`, cu cratimă. Aceeași adresă se scrie în trei notații: Cisco 0011.2233.4455, Windows 00-11-22-33-44-55, Linux 00:11:22:33:44:55. Capcane:

- **Unknown unicast e inundat, nu aruncat.** Router-ul, în schimb, aruncă destinațiile necunoscute.
- Aging-ul implicit este de 300 s, nu 30 și nici 3600.
- Cut-through nu verifică FCS-ul.
- Switch-ul nu rupe domeniul de broadcast.

## TCP plătește fiabilitatea cu minimum 20 de octeți și un handshake; UDP rămâne la 8 (1.5)

Istoria e scurtă și explică de ce există două protocoale [std]. TCP/IP a fost la început un singur protocol (Cerf & Kahn, 1974). A fost separat în IP + TCP în jurul anului 1978, ca aplicațiile care preferă promptitudinea în locul fiabilității, cum e vocea, să aibă un transport subțire. Așa a apărut UDP, în [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html) (august 1980). TCP a fost specificat în RFC 793 (1981), înlocuit azi de **[RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html) (august 2022)**.

Antetul TCP conform [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html):

| Câmp | Biți | Rol |
|---|---|---|
| Source / Destination Port | 16 + 16 | multiplexare |
| Sequence Number | 32 | când SYN e setat conține ISN-ul; primul octet de date = ISN+1 |
| Acknowledgment Number | 32 | **următorul** octet așteptat (valid doar cu ACK) |
| Data Offset | 4 | lungimea antetului în cuvinte de 32 de biți: 5 → **20 B**, 15 → **60 B** |
| Flags | 8 | CWR, ECE, URG, ACK, PSH, RST, SYN, FIN |
| Window | 16 | max 65.535 B; cu Window Scale (RFC 7323), până la ~1 GiB |
| Checksum | 16 | „niciodată opțional”, include pseudo-header |
| Urgent Pointer, Options | 16 + var. | MSS (kind 2) doar în segmente SYN |

Valoarea MSS implicită când nu se primește niciuna este **536 B pentru IPv4 (576−40)** și **1220 B pentru IPv6 (1280−60)** ([RFC 9293 §3.7.1](https://www.rfc-editor.org/rfc/rfc9293.html)). Pe Ethernet, MSS-ul tipic e 1500 − 20 − 20 = 1460 [std]. Handshake-ul („3WHS” în RFC) are trei pași: SYN(ISN_A) → SYN+ACK(ISN_B, ack ISN_A+1) → ACK(ack ISN_B+1). Închiderea e simplex, pe fiecare direcție separat (FIN → ACK → FIN → ACK). Cel care închide activ stă în **TIME-WAIT 2×MSL**, iar MSL este definit la 2 minute ([RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)). TCP are 11 stări, de la LISTEN la CLOSED ([Wikipedia: TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)).

Exemplul numeric pentru lecție, cu ISN-uri relative cum le afișează Wireshark:

1. SYN seq=1000.
2. SYN+ACK seq=5000, ack=1001.
3. ACK seq=1001, ack=5001.
4. Clientul trimite 1460 B de la seq=1001; serverul confirmă cu ack=2461.
5. Clientul trimite două segmente de 1000 B, iar al doilea se pierde. Serverul repetă ack=3461.

Regula de predat: **SYN și FIN consumă fiecare câte un număr de secvență**. **Fast retransmit** retrimite segmentul după 3 ACK-uri duplicate, fără să aștepte timer-ul, iar RTO-ul se dublează la fiecare retransmisie ([Wikipedia: TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)). Distincția cea mai des greșită e între **flow control**, care protejează receptorul prin rwnd, câmpul Window, și **congestion control** ([RFC 5681](https://www.rfc-editor.org/rfc/rfc5681): slow start, congestion avoidance, fast retransmit/recovery), care protejează rețeaua prin cwnd, intern emițătorului. Fereastra efectivă e min(rwnd, cwnd) [std].

UDP are un antet fix de **8 B** cu patru câmpuri: source port (opțional, 0 dacă nu e folosit), destination port, length (minimum 8) și checksum. Checksum-ul e **opțional în IPv4**, cu valoarea zero însemnând „fără checksum”. UDP nu garantează livrarea și nici protecția împotriva duplicatelor ([RFC 768](https://www.rfc-editor.org/rfc/rfc768.html)). În IPv6, receptorii **trebuie să arunce** pachetele UDP cu checksum zero ([RFC 8200](https://www.rfc-editor.org/rfc/rfc8200)). UDP se alege pentru latență (fără handshake), pentru că un pachet de voce întârziat e inutil, pentru antetul mic și pentru suportul de broadcast/multicast. Aplicația își poate construi propria fiabilitate: TFTP face lock-step ACK, iar QUIC (RFC 9000) rulează pe UDP/443 [std].

Porturile se împart după [RFC 6335](https://www.rfc-editor.org/rfc/rfc6335.html): **0–1023 system/well-known**, **1024–49151 user/registered**, **49152–65535 dynamic/ephemeral**. Sistemele de operare nu respectă toate intervalul dinamic IANA. Windows Vista și versiunile ulterioare folosesc 49152–65535, Windows XP folosea 1024–5000, iar **Linux folosește 32768–60999** ([Wikipedia: Ephemeral port](https://en.wikipedia.org/wiki/Ephemeral_port)). Intervalul macOS e ⚠. Socket-ul e format din IP + protocol + port, iar 5-tuple-ul identifică unic o conexiune [std].

| Protocol | Port | Transport | | Protocol | Port | Transport |
|---|---|---|---|---|---|---|
| FTP data/control | 20/21 | TCP | | NTP | 123 | UDP |
| SSH/SCP/SFTP | 22 | TCP | | SNMP / trap | 161/162 | UDP |
| Telnet | 23 | TCP | | HTTPS | 443 | TCP (QUIC: UDP) |
| SMTP | 25 | TCP | | Syslog | 514 | UDP |
| **DNS** | 53 | **UDP și TCP** | | TACACS+ | 49 | TCP |
| DHCP | 67/68 | UDP | | RADIUS | 1812/1813 | UDP |
| **TFTP** | 69 | **UDP** | | CAPWAP | 5246/5247 | UDP |
| HTTP | 80 | TCP | | RDP | 3389 | TCP |

Valorile sunt standard IANA [std]. Capcane de examen:

- DNS folosește ambele transporturi; TCP intră în joc la zone transfers și la răspunsurile mari.
- TFTP e UDP, FTP e TCP.
- „UDP nu are error checking” e fals: are checksum, dar nu are recuperare.
- ACK = următorul octet așteptat.
- Termenii „windowing”, „sequencing” și „three-way handshake” indică TCP; „best effort” și „connectionless” indică UDP.
- „Reliable” nu înseamnă „secure”: niciunul dintre protocoale nu criptează.

## IPv4: 32 de biți, un număr magic și trei blocuri private (1.6, 1.7)

### Clasele au murit în 1993, dar examenul încă le cere

IPv4 a fost definit în RFC 791 (1981), iar subnetting-ul în RFC 950 (1985) ([RFC 791](https://www.rfc-editor.org/rfc/rfc791); [RFC 950](https://www.rfc-editor.org/rfc/rfc950); datele ⚠). Măștile naturale Cisco sunt A (/8, 1–126), B (/16, 128–191) și C (/24, 192–223), iar Cisco notează că termenii de clasă „sunt rar folosiți azi din cauza CIDR” ([Cisco TechNote 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)). Valorile 0 și 127 sunt excluse din clasa A pentru că **0.0.0.0/8 („This network”)** și **127.0.0.0/8 (loopback)** nu se pot ruta ([IANA IPv4 Special-Purpose Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)). Clasa D (224–239) e multicast, iar clasa E (240/4) e rezervată. **[RFC 1519](https://www.rfc-editor.org/rfc/rfc1519.html) (septembrie 1993)** a introdus CIDR pentru trei probleme: epuizarea clasei B (clasa C, cu 254 de host-uri, era prea mică, iar clasa B, cu 65.534, prea mare), creșterea tabelelor de rutare peste ce puteau gestiona software-ul, hardware-ul și oamenii, și epuizarea finală a spațiului de 32 de biți, pe care CIDR doar o amână. Cifrele MERIT din RFC fac creșterea vizibilă pentru un începător: **173 de rute (iulie 1988) → 8.561 (decembrie 1992)**, cu o proiecție de aproximativ 30.000 în doi ani. RFC 4632 (2006) este BCP-ul actual ⚠. Exemplul Cisco de agregare: un ISP cu 172.16.0.0/16 alocă /24-uri clienților și anunță spre exterior doar /16 ([Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)).

Antetul IPv4 are 20 B minimum și 60 B maximum [std]. Conține Version, IHL, DSCP+ECN, Total Length (max 65.535), Identification/Flags/Fragment Offset (cu bitul DF), **TTL** (aruncat la 0, folosit de traceroute), **Protocol** (1 ICMP, 6 TCP, 17 UDP, 89 OSPF), Header Checksum (recalculat la fiecare hop) și adresele. Analogia de bază pentru lecție: partea de rețea e numele străzii, partea de host e numărul casei, iar masca e linia de pe plic care arată unde se termină strada.

### Metoda blocului rezolvă orice întrebare în cinci pași

Toate întrebările de subnetting se reduc la **octetul interesant** și la **block size = 256 − valoarea măștii în acel octet**. Valorile de mască de memorat sunt **0, 128, 192, 224, 240, 248, 252, 254, 255**. Procedura are cinci pași:

1. Identifici octetul interesant.
2. Calculezi block size-ul.
3. **Network ID** = cel mai mare multiplu al block size-ului ≤ valoarea octetului din adresă.
4. **Broadcast** = network + block − 1, iar octeții din dreapta devin 255.
5. Prima adresă utilizabilă = network + 1, ultima = broadcast − 1.

Exemplele lucrate din note sunt aritmetică verificabilă cu `web/src/lib/subnet.ts`. 10.1.1.100/27 → block 32 → rețeaua .96, host-uri .97–.126, broadcast .127. 172.16.77.200/19 → block 32 în octetul 3 → 172.16.64.0 – 172.16.95.255, cu 8.190 de host-uri. 10.200.3.4/11 → 10.192.0.0 – 10.223.255.255. Cisco confirmă că 172.16.17.30/20 și 172.16.28.15/20 sunt amândouă în **172.16.16.0/20** ([Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)).

| /n | Mască | Block | Host-uri | | /n | Mască | Block | Host-uri |
|---|---|---|---|---|---|---|---|---|
| /17 | 255.255.128.0 | 128 (oct. 3) | 32.766 | | /25 | .128 | 128 | 126 |
| /18 | 255.255.192.0 | 64 | 16.382 | | /26 | .192 | 64 | 62 |
| /19 | 255.255.224.0 | 32 | 8.190 | | /27 | .224 | 32 | 30 |
| /20 | 255.255.240.0 | 16 | 4.094 | | /28 | .240 | 16 | 14 |
| /21 | 255.255.248.0 | 8 | 2.046 | | /29 | .248 | 8 | 6 |
| /22 | 255.255.252.0 | 4 | 1.022 | | /30 | .252 | 4 | **2** |
| /23 | 255.255.254.0 | 2 | 510 | | /31 | .254 | 2 | **2 (RFC 3021, p2p)** |
| /24 | 255.255.255.0 | 1 (oct. 3) | 254 | | /32 | .255 | 1 | 1 (loopback/host route) |

Formulele sunt 2^s subrețele și 2^h − 2 host-uri. Trucurile de viteză: /24+k și /16+k au același block size, în octeți diferiți. Network ID-ul e mereu par în octetul interesant. Pe tabla de examen se scrie o singură dată rândul „128 192 224 240 248 252 254 255”; regula exactă pentru tablă la Pearson VUE/OnVUE e ⚠. Cisco dă trei exemple de bază: /27 pe clasa C → 8 subrețele × 30 de host-uri, /28 → 16 × 14, /21 pe clasa B → 32 × 2.046 ([Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)). Subnet zero e utilizabil cu `ip subnet-zero`, implicit din IOS 12.0 ⚠, iar materialele moderne îl numără.

**VLSM** are o regulă Cisco explicită: „cea mai ușoară cale este să aloci întâi subrețelele cele mai mari”. În exemplul Cisco pentru 192.168.5.0/24, VLSM „a economisit mai mult de jumătate din spațiu”, iar 7 host-uri cer /28, pentru că un /29 dă doar 6 ([Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)). Exemplul din note, pentru 192.168.10.0/24 cu 60/28/12 host-uri și un WAN, dă .0/26, .64/27, .96/28 și .112/30, iar restul (.116–.255) rămâne liber. Eroarea tipică de cursant e să pună /30 la .0 și apoi /26 la .4. E invalid, pentru că un /26 trebuie să înceapă la multiplu de 64. **/31** a fost standardizat de [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021.html) (decembrie 2000) pentru a „înjumătăți spațiul alocat legăturilor point-to-point”. Ambele adrese ale unui /31 sunt host-uri și se folosește doar limited broadcast. Cisco recomandă /31 pe point-to-point, „cu prudență” pe Ethernet, și /32 pe loopback-uri ([Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)). Sumarizarea se predă scurt: 172.16.0.0–3.0/24 → **172.16.0.0/22**, cu condiția ca numărul de rețele să fie o putere a lui 2, iar prima rețea să fie multiplu al acelui număr.

### Adresele speciale: registrul IANA ca sursă unică

| Bloc | Nume | RFC | Rutabil / global |
|---|---|---|---|
| 0.0.0.0/8 | This network (0.0.0.0/32 = sursa DHCP DISCOVER) | 791 / 1122 | nu / nu |
| 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 | Private-Use | 1918 | da / **nu** |
| 100.64.0.0/10 | Shared Address Space (CGN) | 6598 | da / nu |
| 127.0.0.0/8 | Loopback | 1122 | nu / nu |
| 169.254.0.0/16 | Link Local (APIPA) | 3927 | nu / nu |
| 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 | Documentation (TEST-NET-1/2/3) | 5737 | nu / nu |
| 198.18.0.0/15 | Benchmarking | 2544 | — |
| 240.0.0.0/4 | Reserved | 1112 | nu / nu |
| 255.255.255.255/32 | Limited Broadcast | 8190 / 919 | nu / nu |

Tabelul vine din [IANA IPv4 Special-Purpose Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml), registru înființat prin RFC 6890. Aplicația ar trebui să folosească în toate exemplele „publice” **blocurile de documentare**, ca să nu indice niciodată rețele reale. Diferența pe care începătorii o ratează: **0.0.0.0/0** din tabela de rutare e ruta implicită, un concept diferit de blocul 0.0.0.0/8.

### Configurarea în IOS și erorile care învață

```
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.192          ! mască zecimală, nu /26
R1(config-if)# no shutdown                                      ! interfețele de router sunt shut implicit
R1(config-if)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.10.65 255.255.255.224
R1(config-if)# ip address 192.168.10.97 255.255.255.240 secondary ! fără „secondary” înlocuiește primara
```

Verificarea se face cu `show ip interface brief` (coloanele Status/Protocol și Method manual/DHCP/unset), `show ip interface` (prefix, secondaries, ACL-uri, helper), `show running-config interface` și `show ip route connected` (perechi **C** pentru subnet și **L** /32 pentru adresa proprie, doar pe interfețe up/up). La `ping`, `!` = reply, `.` = timeout, `U` = unreachable. Primul `.` e tipic, pentru că se rezolvă ARP-ul [std]. O discuție din Cisco Community confirmă cele două erori didactice. Adresa de rețea sau de broadcast pusă pe interfață (de exemplu .32 pe /27) produce „Bad mask”. O subrețea care se suprapune cu cea a altei interfețe produce „overlaps with …” ([Cisco Community](https://community.cisco.com/t5/routing/pt-ip-address-overlaps-or-bad-mask/td-p/4169055)). Textul exact al mesajelor (`% 192.168.10.0 overlaps with GigabitEthernet0/0`, `Bad mask /27 for address 192.168.10.64`) e ⚠ și trebuie capturat în PT înainte să devină răspuns de quiz. Capcane:

- Valid host în 10.10.10.64/26 = .65–.126.
- 500 de host-uri cer /23, nu /24.
- 192.168.256.1 e o adresă invalidă.
- „administratively down” înseamnă că lipsește `no shutdown`, nu că e un defect de cablu.

### 1.7: RFC 1918 și NAT au cumpărat timp, nu au rezolvat problema

| Bloc | Interval | Echivalent clasă | Adrese |
|---|---|---|---|
| 10.0.0.0/8 | 10.0.0.0 – 10.255.255.255 | 1 A | 16.777.216 |
| 172.16.0.0/12 | 172.16.0.0 – **172.31**.255.255 | 16 B | 1.048.576 |
| 192.168.0.0/16 | 192.168.0.0 – 192.168.255.255 | 256 C | 65.536 |

Blocurile sunt confirmate de [IANA](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml), iar data RFC 1918 (februarie 1996) e ⚠. Capcana numărul unu: **172.32.0.1 și 172.15.0.1 sunt publice**. 192.169.x, 169.254.x și 100.64.x nu sunt RFC 1918. Istoria epuizării are date precise. Pe **3 februarie 2011**, NRO a anunțat că „free pool-ul de adrese IPv4 este complet epuizat”, după ce pe 31 ianuarie IANA a alocat două /8 către APNIC, declanșând distribuirea ultimelor cinci /8, câte unul pentru fiecare RIR ([NRO](https://www.nro.net/ipv4-free-pool-depleted); [ARIN](https://www.arin.net/announcements/2011/20110203.html)). Pentru Europa și România, **RIPE NCC a făcut ultima alocare /22 pe 25 noiembrie 2019, la 15:35 (UTC+1)**. De atunci există doar o listă de așteptare pentru un singur /24 recuperat ([RIPE NCC, ripe-list](https://www.ripe.net/ripe/mail/archives/ripe-list/2019-November/001712.html)). NAT se predă conceptual, configurarea fiind la 4.1: static (1:1), dynamic (pool) și **PAT/overload** (mulți la unul, diferențiați prin port sursă), plus termenii inside/outside local/global [std]. **CGNAT** folosește 100.64.0.0/10, interval creat separat ca să nu se ciocnească cu RFC 1918 din LAN-ul clientului ([IANA](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)). Efectele: fără port forwarding inbound și probleme la P2P. Nu se dau nume de operatori români ⚠. Analogia: adresele private sunt numerele camerelor dintr-un hotel (orice hotel are o cameră 101), iar NAT-ul e recepția care pune adresa hotelului pe corespondența trimisă în afară.

## IPv6: 128 de biți, fără broadcast, cu EUI-64 care inversează un singur bit (1.8, 1.9)

### De ce IPv6 și ce a simplificat în antet

[RFC 1752](https://www.rfc-editor.org/info/rfc1752) (ianuarie 1995) a ales ca bază a „IPng” o variantă revizuită a propunerii SIPP, cu **adrese de 128 de biți**. Obiectivele erau antet simplificat, adresare ierarhică pentru agregare, autentificare/criptare, autoconfigurare plug-and-play și flow labeling. Prima specificație a fost [RFC 1883](https://www.rfc-editor.org/info/rfc1883/) (decembrie 1995, Deering & Hinden), iar cea actuală este [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) (**STD 86, iulie 2017**). Comparația de scară e aritmetică pură: 2^32 ≈ 4,3 miliarde, iar **un singur /64 are 2^64 = (2^32)^2 interface ID-uri**. Motivul pentru care s-a sărit peste „v5” (protocolul ST-II) e ⚠.

Antetul de bază are **fix 40 de octeți** și 8 câmpuri: Version, Traffic Class (8 biți), **Flow Label (20 biți)**, Payload Length (include extension headers), Next Header, **Hop Limit** și cele două adrese de 128 de biți ([RFC 8200](https://www.rfc-editor.org/rfc/rfc8200)). Lipsesc checksum-ul, IHL-ul și câmpurile de fragmentare. Opțiunile s-au mutat în extension headers înlănțuite (Hop-by-Hop, Destination Options, Routing, Fragment, AH, ESP). **Fragmentarea o face doar sursa, nu router-ele**, iar fiecare legătură trebuie să aibă **MTU ≥ 1280** ([RFC 8200](https://www.rfc-editor.org/rfc/rfc8200)). Lecția trebuie să arate maparea câmp cu câmp: TTL devine Hop Limit („redenumit după ce face de fapt”), Protocol devine Next Header (58 = ICMPv6), iar checksum-ul dispare pentru că FCS-ul L2 și checksum-urile L4 acoperă deja erorile.

### Abrevierea: două reguli RFC 4291, patru precizări RFC 5952

[RFC 4291 §2.2](https://www.rfc-editor.org/rfc/rfc4291) definește forma x:x:x:x:x:x:x:x, cu opt hextets de 16 biți. Zerourile de la începutul fiecărui hextet se pot omite, iar `::` înlocuiește una sau mai multe grupe de zerouri și „poate apărea o singură dată”. [RFC 5952](https://www.rfc-editor.org/rfc/rfc5952) fixează forma canonică:

- zerourile din față **trebuie** eliminate;
- `::` trebuie folosit „la capacitate maximă”;
- `::` **nu** se folosește pentru un singur hextet 0;
- se comprimă cea mai lungă secvență de zerouri, iar la egalitate prima;
- literele se scriu **lowercase**;
- adresa cu port se scrie `[2001:db8::1]:80`.

Implementările trebuie însă să accepte orice formă RFC 4291. IOS afișează uppercase, iar cazul literelor nu contează.

| Formă completă | Canonic | Lecția |
|---|---|---|
| 2001:0db8:0000:0000:0000:ff00:0042:8329 | 2001:db8::ff00:42:8329 | ambele reguli |
| 2001:0db8:0000:0001:0000:0000:0000:0001 | 2001:db8:0:1::1 | secvența cea mai lungă câștigă |
| 2001:0db8:0000:0000:0001:0000:0000:0001 | 2001:db8::1:0:0:1 | egalitate → prima |
| 2001:0db8:0000:0001:0001:0001:0001:0001 | 2001:db8:0:1:1:1:1:1 | un singur 0 → fără `::` |
| 2001:0db8:0100:0000:0000:0000:0000:0010 | 2001:db8:100::10 | **doar zerourile din față** (0100 → 100, niciodată 1) |
| 0000:…:0001 / 0000:…:0000 | ::1 / :: | loopback / unspecified |

Exemplele invalide sunt bune pentru întrebări: `2001::db8::1` (două `::`), un hextet cu 5 cifre, litera „g” sau 9 hextets. Expandarea se face numărând hextet-urile prezente: `::` completează până la 8.

### Ierarhia /48 → /64 și capcana hex

Recomandarea RIPE-690 (2017) este „/48 pentru clienții business și /56 pentru cei rezidențiali”. Prefixele mai lungi de /56 sunt „puternic descurajate”, iar „nu este posibil să aloci mai puțin de un /64 unui LAN” ([RIPE-690, mirror](https://hermesnode2.duckdns.org/publications/docs/ripe-690/); URL-ul oficial e ⚠). Alocarea LIR implicită de /32 (până la /29) e ⚠. SLAAC cere ca prefixul + IID să însumeze 128, iar pe Ethernet IID-ul are 64 de biți ([RFC 4862](https://www.rfc-editor.org/rfc/rfc4862)). [RFC 6164](https://www.rfc-editor.org/rfc/rfc6164) (2011) cere ca router-ele să suporte **/127** pe legăturile inter-router, pentru a evita buclele ping-pong și epuizarea neighbor cache-ului. Lecția trebuie să adauge că CCNA folosește de obicei /64 peste tot. IANA alocă în prezent doar din **2000::/3** ([IANA IPv6 Address Space](https://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml)). Pe un /48, al patrulea hextet e Subnet ID-ul: 2^16 = **65.536 de /64**. Capcana: `:10:` în hex înseamnă 16 zecimal, iar 10 zecimal se scrie `:a:`. Întrebarea NetAcad cu 2001:db8:acad::aaaa:1234/64 are Subnet ID 0000, pentru că `::` ascunde subnet ID-ul ([NetAcad PT 12.9.2](https://contenthub.netacad.com/courses/itn-dl/_common/12.9.2-packet-tracer---configure-ipv6-addresses-on-network-devices---physical-mode.pdf)). IPv6 nu are broadcast, iar IID-ul format numai din zerouri e Subnet-Router anycast.

### Tipurile de adrese: unicast, anycast, multicast, și nicio adresă de broadcast

| Tip | Prefix | Note |
|---|---|---|
| Global Unicast (GUA) | **2000::/3** (2000–3fff) | „tot restul” în RFC 4291; Global Routing Prefix + Subnet ID + IID 64 |
| Unique Local (ULA) | **FC00::/7**; în practică FD00::/8 | forwardable, dar nu global ([RFC 4193](https://www.rfc-editor.org/rfc/rfc4193)) |
| Link-Local (LLA) | **FE80::/10**; în practică fe80::/64 | nu se rutează; obligatorie pe orice interfață IPv6 |
| Site-local | FEC0::/10 | **depreciat** din septembrie 2004 |
| Multicast | **FF00::/8** | înlocuiește broadcast-ul |
| Loopback / Unspecified | ::1/128 / ::/128 | |
| Documentation | **2001:db8::/32** (RFC 3849); 3fff::/20 (RFC 9637) | |
| IPv4-mapped | ::ffff:0:0/96 | ::ffff:192.0.2.1 |

Tabelul combină [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291), [IANA IPv6 Address Space](https://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml) și [IANA Special-Purpose Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml). Structura ULA este FC00::/7 + **L bit** (1 = local) + **Global ID de 40 de biți** pseudo-aleator (SHA-1 peste timp NTP + EUI-64, din care se păstrează 40 de biți) + Subnet ID de 16 biți + IID de 64 de biți. ULA „nu se așteaptă să fie rutabilă pe Internet” ([RFC 4193](https://www.rfc-editor.org/rfc/rfc4193)). Didactic, ULA e „RFC 1918-ul IPv6”, dar fără intenția de a fi trecută prin NAT. LLA-ul e folosit de NDP, e sursa RA-urilor, e **default gateway-ul învățat de host-uri** și next-hop-ul protocoalelor de rutare. Trebuie să fie unic doar pe legătura sa, deci fe80::1 poate fi pus pe toate interfețele unui router, exact cum face activitatea NetAcad ([NetAcad 8.2.4.8](https://ccna.ilkom.unsri.ac.id/1/course/module8/8.2.4.8/8.2.4.8.html); [NetAcad PT 12.9.2](https://contenthub.netacad.com/courses/itn-dl/_common/12.9.2-packet-tracer---configure-ipv6-addresses-on-network-devices---physical-mode.pdf)). Zone index-ul (`%12`, `%eth0`) explică de ce host-ul are nevoie de interfață pentru un LLA; referința RFC 4007 e ⚠.

Formatul multicast este FF + 4 biți de flags + 4 biți de scope (1 interface, **2 link**, 4 admin, 5 site, 8 organization, E global) + un group ID de 112 biți ([RFC 4291](https://www.rfc-editor.org/rfc/rfc4291)). Lista de memorat vine din [IANA IPv6 Multicast Registry](https://www.iana.org/assignments/ipv6-multicast-addresses/ipv6-multicast-addresses.xhtml):

| Adresă | Grup |
|---|---|
| **FF02::1** | all nodes |
| **FF02::2** | all routers |
| **FF02::5 / FF02::6** | OSPF / OSPF DR |
| FF02::9 | RIPng |
| **FF02::A** | EIGRP |
| **FF02::1:2** | DHCPv6 relay/servers |
| FF05::1:3 | all DHCP servers |
| **FF02::1:FF00:0/104** | solicited-node |

Adresa **solicited-node** se formează din prefixul ff02::1:ff00:0/104 plus **ultimii 24 de biți** ai adresei unicast. Exemplul RFC este 4037::01:800:200E:8C6C → FF02::1:FF0E:8C6C ([RFC 4291 §2.7.1](https://www.rfc-editor.org/rfc/rfc4291)). NS-ul pentru rezolvarea adresei pleacă spre solicited-node-ul țintei, RS-ul spre FF02::2, RA-ul nesolicitat spre FF02::1, iar toate mesajele ND au Hop Limit 255 ([RFC 4861](https://www.rfc-editor.org/rfc/rfc4861)). De aici rezultă explicația „de ce nu mai e nevoie de ARP broadcast”. Exemplu calculat: 2001:db8:acad:1::1 și fe80::1 dau **același** grup ff02::1:ff00:1, deci IOS afișează un singur grup. Maparea pe MAC 33:33:xx (ultimii 32 de biți) face ca NIC-urile să filtreze în hardware; referința RFC 2464 e ⚠. **Anycast** înseamnă aceeași adresă pe mai multe dispozitive, cu livrare la cel mai apropiat. Sintactic nu se distinge de unicast. Subnet-Router anycast-ul (prefix + IID numai zerouri) „va fi livrat unui router de pe subnet” ([RFC 4291 §2.6.1](https://www.rfc-editor.org/rfc/rfc4291)). În IOS se configurează cu `ipv6 address 2001:DB8:1:1:FFFF:FFFF:FFFF:FFFE/64 anycast` ([Cisco IOS IPv6 Command Reference](https://www3-realm.cisco.com/en/US/docs/ios-xml/ios/ipv6/command/ipv6-i1.pdf)). RFC 4291 §2.8 dă și lista adreselor pe care trebuie să le recunoască un host: LLA, unicast/anycast, loopback, FF02::1 și solicited-node pentru fiecare unicast. Un router adaugă Subnet-Router anycast și FF02::2 ([RFC 4291](https://www.rfc-editor.org/rfc/rfc4291)).

### Modified EUI-64: împarte, inserează FFFE, inversează bitul 7

RFC 4291 Anexa A descrie procedura: MAC-ul de 48 de biți se împarte în două, se inserează **0xFF 0xFE** la mijloc, iar „singura schimbare este inversarea bitului universal/local” ([RFC 4291](https://www.rfc-editor.org/rfc/rfc4291)). Exemplul verificat e 0017.a4d2.27fc → **0217:a4ff:fed2:27fc**. IOS-ul real afișează „link-local address is FE80::C600:2FF:FEF4:0” ([learncisco.net](https://www.learncisco.net/courses/cisco-ccna/part-8-internet-protocol-version-6/how-it-works-2.html)). Recalculul din note confirmă: MAC-ul C4:00:02:F4:00:00 dă c600:2ff:fef4:0.

| MAC | Primul octet → inversat | IID | LLA |
|---|---|---|---|
| 00:11:22:33:44:55 | 00 → 02 | 0211:22ff:fe33:4455 | fe80::211:22ff:fe33:4455 |
| AC:DE:48:00:11:22 | AC → AE | aede:48ff:fe00:1122 | fe80::aede:48ff:fe00:1122 |
| 70:B3:D5:12:34:56 | 70 → 72 | 72b3:d5ff:fe12:3456 | fe80::72b3:d5ff:fe12:3456 |
| 02:50:56:AB:CD:EF | 02 → **00** | 0050:56ff:feab:cdef | fe80::50:56ff:feab:cdef |

Scurtătura de examen: a doua cifră hex se schimbă cu ±2 (0↔2, 4↔6, 8↔A, C↔E…). E o **inversare (XOR)**, nu „setare la 1”, iar ultimul rând arată capcana. FFFE stă la mijloc, după OUI. Interfețele seriale, care nu au MAC, folosesc MAC-ul primei interfețe Ethernet ([NetAcad 8.2.4.8](https://ccna.ilkom.unsri.ac.id/1/course/module8/8.2.4.8/8.2.4.8.html)). EUI-64 e previzibil și permite urmărirea dispozitivului. Din acest motiv [RFC 8981](https://www.rfc-editor.org/rfc/rfc8981) (februarie 2021) a înlocuit RFC 4941 cu adrese temporare, cu viață validă implicită de **2 zile** (față de 7) și preferată de **1 zi**, pentru că un IID stabil „nu poate fi ascuns”. Router-ele Cisco folosesc însă în continuare EUI-64 pentru LLA-ul automat. RFC 7217 (stable-privacy) și comportamentul implicit al Windows/macOS sunt ⚠.

Autoconfigurarea se predă prin flag-urile RA. Tipurile NDP sunt **RS 133, RA 134, NS 135, NA 136, Redirect 137**. Flag-ul **M** spune că „adresele sunt disponibile prin DHCPv6”, **O** că alte informații sunt disponibile prin DHCPv6, iar opțiunea de prefix poartă flag-urile **L** (on-link) și **A** (autonomous, SLAAC). Router Lifetime 0 înseamnă că router-ul nu e default router ([RFC 4861](https://www.rfc-editor.org/rfc/rfc4861)). SLAAC adaugă IID-ul la prefixele cu A=1. DAD trimite un NS cu sursa `::` spre solicited-node-ul adresei tentative. Stările sunt tentative → preferred → deprecated → invalid ([RFC 4862](https://www.rfc-editor.org/rfc/rfc4862)).

| Metodă | Flag-uri RA | Adresa | DNS | Stare pe server |
|---|---|---|---|---|
| SLAAC | A=1, M=0, O=0 | prefix RA + IID propriu | RDNSS în RA ⚠ | nu |
| Stateless DHCPv6 | A=1, O=1 | SLAAC | DHCPv6 | nu |
| Stateful DHCPv6 | M=1 | server DHCPv6 | DHCPv6 | da |

Capcana „gateway-ul vine **întotdeauna** din RA, niciodată din DHCPv6” e corectă ca regulă de predare, dar formularea „DHCPv6 nu are opțiune de default router” rămâne ⚠ până la verificare.

### Configurarea 1.8 în IOS

```
R1(config)# ipv6 unicast-routing                          ! rutare IPv6 + RA-uri + intrare în FF02::2
R1(config)# interface g0/0
R1(config-if)# ipv6 address 2001:db8:acad:1::1/64         ! GUA static; LLA EUI-64 creat automat
R1(config-if)# ipv6 address fe80::1 link-local            ! suprascrie LLA-ul automat
R1(config-if)# no shutdown
R1(config-if)# interface g0/1
R1(config-if)# ipv6 address 2001:db8:acad:2::/64 eui-64   ! dai doar prefixul
R1(config-if)# interface g0/2
R1(config-if)# ipv6 address autoconfig default            ! router ca client SLAAC + rută implicită
```

Referința Cisco confirmă mai multe lucruri. O interfață poate avea mai multe adrese IPv6. `link-local` „suprascrie adresa link-local generată automat”. `autoconfig default` instalează o rută implicită și poate fi folosit pe o singură interfață. La `eui-64`, dacă prefixul depășește 64 de biți, biții de prefix au prioritate ([Cisco IOS IPv6 Command Reference](https://www3-realm.cisco.com/en/US/docs/ios-xml/ios/ipv6/command/ipv6-i1.pdf)). Comportamentul `ipv6 enable` (doar LLA) e ⚠. Activitatea NetAcad confirmă că `ipv6 unicast-routing` face router-ul să intre în ff02::2 și le permite PC-urilor să obțină adrese SLAAC ([NetAcad PT 12.9.2](https://contenthub.netacad.com/courses/itn-dl/_common/12.9.2-packet-tracer---configure-ipv6-addresses-on-network-devices---physical-mode.pdf)). De aici vine întrebarea clasică de depanare: fără comanda globală, host-urile SLAAC nu primesc prefix și gateway.

Verificarea se face cu `show ipv6 interface brief`, `show ipv6 interface g0/0` (grupurile joined FF02::1, FF02::2 și solicited-node), `show ipv6 route` (C /64, L /128, mereu `L FF00::/8 via Null0`, fără LLA-uri) și `show ipv6 neighbors`, echivalentul ARP. Un `ping` spre un LLA cere interfața de ieșire. Toate aceste output-uri sunt reconstruite ⚠, cu excepția fragmentelor „IPv6 is enabled, link-local address is…” și „subnet is …/64” ([learncisco.net](https://www.learncisco.net/courses/cisco-ccna/part-8-internet-protocol-version-6/how-it-works-2.html)). Pe 2960, comanda `sdm prefer dual-ipv4-and-ipv6 default` e ⚠ în PT.

Capcanele cele mai testate la 1.8/1.9:

- `::` apare o singură dată, iar din fiecare hextet se elimină doar zerourile din față.
- FE80::/10 e intervalul; în practică se folosește fe80::/64.
- ULA e FC00::/7, iar FEC0::/10 e un distractor depreciat.
- IPv6 nu are broadcast.
- La EUI-64, bitul 7 se inversează și FFFE stă la mijloc.
- Solicited-node folosește ultimii 24 de biți.
- `ipv6 address autoconfig` nu înseamnă că router-ul trimite RA-uri.
- Loopback-ul e ::1, nu ::127.

## Clientul spune adevărul: ipconfig, ifconfig, ip (1.10)

Pe fiecare sistem de operare, cursantul trebuie să găsească șase lucruri: **IP + mască, default gateway, DNS, DHCP vs static (lease) și MAC**. Microsoft Learn documentează `ipconfig`. Fără parametri, comanda afișează doar IPv4/IPv6, masca și gateway-ul. `/all` afișează „configurația TCP/IP completă”. `/release` trimite DHCPRELEASE, `/renew` reînnoiește lease-ul, `/flushdns` golește cache-ul resolver-ului, iar `/release6` și `/renew6` sunt echivalentele DHCPv6. Comanda arată și dacă setările vin din DHCP, din APIPA sau dintr-o configurație alternativă ([Microsoft Learn: ipconfig](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig)). Capcana care decurge de aici: **`ipconfig` fără `/all` nu arată DNS-ul, MAC-ul sau serverul DHCP.** Eșecul DHCP pe Windows arată ca `Autoconfiguration IPv4 Address 169.254.x.y`, cu mască 255.255.0.0 și **gateway gol**. Cauzele posibile sunt cablul, VLAN-ul, lipsa `ip helper-address` sau un server oprit.

| Nevoie | Windows | macOS | Linux |
|---|---|---|---|
| IP + mască | `ipconfig` | `ifconfig en0` (mască **hex**) | `ip a` (/prefix) |
| Tot | `ipconfig /all` | `networksetup -getinfo "Wi-Fi"` | `nmcli device show` ⚠ |
| Gateway | `ipconfig`, `route print` | `netstat -rn`, `route get default` | `ip route` |
| DNS | `ipconfig /all`, `nslookup` | `scutil --dns` | `resolvectl status` |
| MAC | Physical Address | `ether` | `link/ether` |
| ARP | `arp -a` | `arp -a` | `ip neigh` |
| Cale | `tracert` | `traceroute` | `traceroute` / `tracepath` |

Comenzile macOS și Linux nu au fost verificate în man pages în această cercetare ⚠, dar sunt comenzi standard. RPi4 rulează Linux, deci `ip a`, `ip r` și `resolvectl` se pot captura real, direct pe server, pentru lecție. Detaliile care fac lecția bună:

- **macOS afișează masca în hex**: 0xffffff00 = /24, 0xffffffc0 = /26, 0xfffffe00 = /23. Decodarea e un item de quiz excelent.
- Linux arată `dynamic` și `valid_lft` pentru lease-urile DHCP.
- În `/etc/resolv.conf` apare `nameserver 127.0.0.53`, adică stub-ul systemd-resolved, nu serverul real.
- Windows arată gateway-ul IPv6 ca `fe80::1%12` și separă „IPv6 Address” de „Temporary IPv6 Address” (RFC 8981) ⚠ (format).

Logica de depanare se predă ca algoritm:

1. Există o adresă? 169.254 înseamnă DHCP eșuat.
2. Masca se potrivește cu planul rețelei?
3. **Gateway-ul e în același subnet?** Capcană: 192.168.1.130/25 cu gateway 192.168.1.1 nu își poate atinge gateway-ul.
4. Ping-ul la 8.8.8.8 merge, dar cel la un nume nu? Atunci problema e DNS-ul.
5. Ordinea de ping: 127.0.0.1 → IP propriu → gateway → IP remote → nume.

Ping-ul la 127.0.0.1 testează doar stiva locală, nu NIC-ul [std].

## Virtualizarea mută serverul, OS-ul și tabela de rutare în software (1.12)

Clasificarea Type 1/Type 2 provine din teza lui **Robert P. Goldberg din 1973**. **Type 1 (bare-metal)** rulează direct pe hardware: Hyper-V, Xen, VMware ESXi. **Type 2 (hosted)** rulează ca proces pe un OS: VirtualBox, VMware Workstation. Granița „nu e întotdeauna clară”: KVM și bhyve sunt module de kernel care transformă OS-ul gazdă într-un Type 1 ([Wikipedia: Hypervisor](https://en.wikipedia.org/wiki/Hypervisor)). Motivația, istoria și restul conceptelor sunt [std]. Modelul „o aplicație pe server” lăsa serverele slab utilizate; procentul de 10–15% e ⚠. Virtualizarea a adus consolidare, provizionare în minute, snapshot-uri, live migration și HA. Pentru OCG contează rețeaua din interiorul host-ului: fiecare VM are **vNIC**-uri cu MAC propriu, legate la un **vSwitch** care suportă VLAN-uri. Uplink-urile fizice sunt de obicei trunk-uri 802.1Q spre switch-ul ToR, iar traficul VM↔VM din același host și VLAN nu părăsește host-ul. **Containerele** virtualizează OS-ul, nu hardware-ul. Toate partajează **kernelul gazdei**, cu izolare prin namespaces și limite prin cgroups. Rezultatul: megaocteți în loc de gigaocteți, pornire în secunde, densitate mai mare, dar izolare mai slabă. Imaginea e un template read-only, iar containerul e instanța care rulează. Docker a popularizat modelul, iar Kubernetes orchestrează pod-uri pe un cluster; anii 2013/2014 sunt ⚠. NFV extinde ideea la funcții de rețea rulate ca VM-uri: Catalyst 8000V, ASAv, **Catalyst 9800-CL** (legătură cu 1.11) și FTDv.

**VRF**-ul virtualizează Layer 3. Un router ține mai multe tabele de rutare izolate, fiecare interfață aparține exact unei tabele, iar **spațiile de adrese se pot suprapune**. Analogia: o clădire cu mai multe firme, fiecare cu agenda ei telefonică. PacketLife documentează sintaxa VRF-Lite și capcanele [(PacketLife: Intro to VRF lite)](https://packetlife.net/blog/2009/apr/30/intro-vrf-lite/). Când pui interfața în VRF apare mesajul `% Interface FastEthernet1/0 IP address removed due to enabling VRF RED`, iar adresa trebuie reaplicată. După ce toate interfețele sunt în VRF-uri, `show ip route` global e gol, iar un `ping` simplu eșuează (0/5) în timp ce `ping vrf BLUE` reușește. Cazul de utilizare: traficul de încredere trece prin firewall, iar cel de guest printr-un ADSL separat, pe aceleași routere, cu câte un proces OSPF per VRF.

```
vrf definition CUST-A                 ! sintaxa nouă (multiprotocol); legacy: ip vrf CUST-A
 address-family ipv4
interface GigabitEthernet0/0/1
 vrf forwarding CUST-A                ! ȘTERGE IP-ul → se reconfigurează
 ip address 10.1.1.1 255.255.255.0
ip route vrf CUST-A 0.0.0.0 0.0.0.0 10.1.1.254
! verificare: show vrf · show ip route vrf CUST-A · ping vrf CUST-A 10.1.1.254
```

Dacă `rd` e obligatoriu pe IOS-XE și textul exact al mesajului în sintaxa nouă sunt ⚠. MPLS L3VPN (RD, RT, MP-BGP, RFC 4364) rămâne la nivel de concept. Capcane de examen:

- **VRF ≠ VLAN**: VLAN-ul segmentează L2, VRF-ul segmentează tabele L3.
- Hyper-V e Type 1, deși „îl instalezi pe Windows”.
- Docker nu e hypervisor, iar Kubernetes e un orchestrator.
- Containerele partajează kernelul gazdei.
- Comenzile fără cuvântul `vrf` se uită în tabela globală.

## Packet Tracer acoperă configurarea, nu fizica: planul de laboratoare

PT e potrivit pentru tot ce ține de configurare și logică. Contoarele fizice, VRF-urile și produsele de securitate/management nu se pot exersa în el. Majoritatea afirmațiilor despre fidelitatea PT din note sunt neverificate. Fiecare laborator trebuie rulat în PT înainte de publicare. Un fișier `.pka` cu Activity Wizard poate puncta automat, dar trebuie testat contra soluției ([Curricula CCNA, raport anterior](file:///home/user/ccna-learn/reports/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale.md)).

| Topic | Laborator ghidat | Laborator solo | Limite PT |
|---|---|---|---|
| 1.1 | PC → 2960 → ISR4331 → 2960 → Server; în Simulation mode, MAC-ul se schimbă, IP-ul nu | hub vs switch, numărarea domeniilor | NGFW/IPS, Catalyst Center absente; ASA 5505/5506 și WLC 2504/3504 ⚠ |
| 1.1.h | 3560 + IP phone: `power inline never` → `auto` | buget pe hârtie | PoE doar pe 3560 (poate și 3650), **nu pe 2960** ([PacketTracerNetwork](https://www.packettracernetwork.com/tutorials/voip-devices.html); [Cisco Community](https://community.cisco.com/t5/network-management/packet-tracer-switch-poe/td-p/4586993)); `show power inline` ⚠ |
| 1.2 | collapsed core 2×3560 + 4×2960, apoi o clădire nouă → three-tier; numărarea legăturilor și a porturilor blocate de STP | spine-leaf 2+3 cu OSPF ECMP (config dat gata) | ECMP în PT ⚠; Cloud-PT nu modelează IaaS/PaaS/SaaS |
| 1.3 | cable chooser (lumini roșu/verde), consolă 9600 8N1 | fiber pe module SFP | Auto-MDIX/`no mdix auto` în PT ⚠ |
| 1.4 | `speed`/`duplex` greșite → `%CDP-4-DUPLEX_MISMATCH` ⚠; speed mismatch → down | `shutdown`, deconectare, HDLC vs PPP, port-security → err-disabled | **contoarele CRC/runts/late collision nu sunt realiste** → output ilustrativ |
| 1.13 | 2960 + 4 PC; ARP flood, `show mac address-table`, `clear`, `aging-time 10` ⚠ | două switch-uri: multe MAC-uri pe uplink | bucla fără STP se face doar ca animație |
| 1.5 | Server HTTP/DNS: DNS UDP 53, apoi SYN, SYN/ACK, ACK, GET; tab-ul PDU details | TFTP (UDP) vs FTP (TCP) | câmpuri TCP simplificate ⚠; extra: Wireshark pe PC propriu |
| 1.6 | VLSM 192.168.10.0/24 (60/28/12 + /30), `show ip int brief`, C/L | 172.20.0.0/22 pentru 200/100/50/2; break-and-fix (overlaps, Bad mask, gateway greșit) | mesajele exacte de eroare ⚠ |
| 1.7 | LAN 192.168.1.0/24, ISP 203.0.113.0/24, server 198.51.100.10: fără NAT nu merge | preview PAT (`overload`, `show ip nat translations`) | marcat „preview 4.1” |
| 1.8/1.9 | două LAN-uri /64, static + `eui-64` + `fe80::1 link-local`, grupurile înainte și după `ipv6 unicast-routing` | /48 → /64 + rute statice IPv6; troubleshooting (comanda lipsă, /62 strică SLAAC) | `anycast`, DAD DUPLICATE, IID-ul PC-urilor ⚠ |
| 1.10 | PC pe DHCP, se scoate serverul → 169.254 ⚠ | fișă IP/mască/GW/DNS/MAC pe propriile mașini + RPi4 | PC-ul PT nu e Windows real: fără `route print`, `netsh`, `/flushdns` ⚠ |
| 1.12 | — | VRF-Lite în **GNS3/CML** (două LAN-uri 192.168.1.0/24 identice) | VRF probabil nesuportat în PT ([TechExams thread](https://community.infosecinstitute.com/discussion/120722/packet-tracer-vrf), sursă veche) |

Pentru imagini, recomandarea notelor e consecventă: **diagrame SVG originale** pentru topologii, pinout-uri, antete, tabele de măști, pașii EUI-64 și stivele VM/container. Așa licențierea e simplă, iar diagramele funcționează în ambele teme. Licențele de pe Wikimedia sunt confirmate doar pentru câteva fișiere:

- **NAT_Concept-en.svg** și **IPv4_IANA_and_RIR_exhaustion_time_line-en.svg** (Michel Bakni, CC BY-SA 4.0) ([mirror NAT](https://wiki.riteme.site/wiki/File:NAT_Concept-en.svg); [mirror timeline](https://wiki.riteme.site/wiki/File:IPv4_IANA_and_RIR_exhaustion_time_line-en.svg)).
- **IPv6_address_structure.svg** (Michel Bakni, CC BY-SA 4.0) ([mirror](https://download.osmand.net/wiki/File:IPv6_address_structure.svg)).
- **Tcp_state_diagram_fixed_new.svg** (CC BY-SA 3.0/GFDL, pentru deep dive) ([mirror](https://download.osmand.net/wiki/File:Tcp_state_diagram_fixed_new.svg)).
- Fotografiile de AP și router SOHO deja existente în repo ([attribution.json](file:///home/user/ccna-learn/web/public/img/wiki/attribution.json)).

Restul candidaților au fost găsiți doar ca nume de fișier: rack-uri de switch-uri, injector PoE, conectori LC/SC, SFP, BNC T, cablu rollover, pinout-uri T568B. Commons a fost blocat de proxy. Fiecare licență se verifică pe pagina fișierului înainte de descărcare, iar descărcarea se face prin schema `thumb` din CLAUDE.md.

## Concluzie

Domeniul 1 sunt de fapt două produse diferite în aceeași aplicație. Jumătatea de recunoaștere (1.1–1.5, 1.7, 1.9, 1.12, 1.13) se pretează la formatul existent al pilotului 1.11: tabele, animații, capcane și întrebări cu explicație pe fiecare variantă. Ea scalează bine cu FSRS, pentru că e formată din fapte discrete (15,4/30/60/90 W, 100 m, 300 s, 49152, FF02::2). Jumătatea de calcul (1.6, 1.8, 1.9.d, decodarea măștilor hex din 1.10) nu se învață din text. Are nevoie de **generatoare** care produc la infinit adrese, prefixe și MAC-uri, cu soluția derivată pas cu pas: metoda blocului, expandarea `::`, inversarea bitului 7, cei 24 de biți ai solicited-node. Generatoarele trebuie construite peste `subnet.ts` înainte de lecțiile 1.6/1.8, nu după. A doua implicație e tehnică: pentru 1.4, PT nu reproduce fizica. Lecția de contoare se construiește deci pe output-uri ilustrative adnotate, ancorate în definițiile Cisco TN 12027/10561, iar laboratorul se mută pe ce PT face credibil: stări de interfață, mesajul CDP de duplex mismatch, speed mismatch.

Cea mai mare datorie de verificare nu ține de protocoale, unde RFC-urile și documentele Cisco au acoperit aproape tot. Ține de **artefactele exacte** pe care cursantul le va vedea: textul mesajelor IOS (`overlaps with`, `Bad mask`, mesajul VRF din sintaxa nouă), output-urile `show ipv6 interface`/`show power inline` în PT 8.x/9.x, lista de comenzi a PC-ului PT și licențele imaginilor. Toate se pot închide cu o sesiune de o oră în Packet Tracer și una pe Commons, înainte de scrierea întrebărilor de tip CLI. Aproape tot conținutul acesta (subnetting, IPv6, TCP/UDP, cablare, switching) e nucleu care trece în v2.0 din februarie 2027. Merită deci etichetat „v1.1 core / se păstrează în v2.0”, cu excepția detaliilor de nume de produs (Catalyst Center, controllere), care trebuie reverificate față de lista v2.0, încă neobținută.
