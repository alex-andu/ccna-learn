# Construiește platforma CCNA pe v1.1, pregătită pentru v2.0

**Pe scurt:** CCNA 200-301 **v1.1** este examenul activ în noiembrie 2026. Are **6 domenii** și **53 de obiective numerotate**, cu ponderile **20/20/25/10/15/10%**. Rămâne valabil până pe **2 februarie 2027**. Din **3 februarie 2027** se dă **v2.0**, cu același cod (200-301), restructurat în 5 domenii și cu un domeniu nou de AI/operațiuni ([Cisco Learning Network v2.0](https://learningnetwork.cisco.com/s/ccna-v2-exam-topics); [101labs](https://www.101labs.net/cisco-v2-0-changes-2027/)). Arborele v1.1 de mai jos este **verificat după textul PDF-ului oficial Cisco** (lipit verbatim de utilizator pe 15.11.2026), deci poate fi importat direct ca rădăcină a platformei. Restul faptelor Cisco (v2.0, logistică, Packet Tracer, iconițe) vin din extrase de căutare și surse secundare, deoarece paginile Cisco nu au putut fi descărcate în timpul cercetării, iar elementele neconfirmate sunt marcate ⚠. Din punct de vedere pedagogic, dovezile cele mai solide susțin testarea cu feedback și repetiția spațiată ([Dunlosky et al. 2013, via APS](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html)). De aici rezultă recomandările pentru platformă: lecții stratificate cu worked examples, laboratoare cu ghidare care scade treptat, întrebări MCQ cu explicație pentru fiecare opțiune și programare FSRS-6 prin bibliotecile MIT ts-fsrs/py-fsrs. Pe Raspberry Pi 4, cel mai simplu stack de întreținut este TypeScript peste tot: Node.js 24/26 LTS + Fastify 5 + SQLite (better-sqlite3, WAL) în backend, un SPA Vite 8 + React 19.3 servit de Caddy cu `tls internal` și PWA, rulat sub systemd de pe un SSD USB.

> **Convenție de marcare în acest raport:** ⚠ = formulare sau valoare neverificată în sursa primară Cisco (fetch blocat de politica de rețea a sesiunii); **[std]** = constantă de protocol stabilă luată din RFC/documentație, nerecitită live; **[verify]** = surse contradictorii sau slabe. Excepție: arborele v1.1 și ponderile sale provin din textul PDF-ului oficial Cisco furnizat de utilizator și sunt verificate. Celelalte cifre Cisco (date v2.0, logistică) vin din extrase de căutare și surse secundare care concordă între ele.

## Șase domenii, 53 de obiective: arborele v1.1 care devine rădăcina platformei

v1.1 a intrat în vigoare pe **20 august 2024**. A fost o actualizare minoră a v1.0, care nu a schimbat numele sau ponderile domeniilor ([Pearson/Cisco Press Appendix B](https://ptgmedia.pearsoncmg.com/imprint_downloads/cisco/bookreg/9780135792735/9780135792735_AppendixB_v1-1.pdf); [CertSkills](https://www.certskills.com/ccna2024-01/)). Documentele de referință sunt [PDF-ul oficial v1.1](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf) și [pagina de exam topics](https://learningnetwork.cisco.com/s/ccna-exam-topics). Lista de mai jos reproduce **verbatim** textul PDF-ului oficial „200-301 CCNA v1.1” (© 2024 Cisco Systems, Cisco Public), furnizat de utilizator, și înlocuiește reconstrucția din notele de cercetare. Totalul de 53 de obiective numerotate (13+9+5+9+10+7) coincide cu cifra raportată de [computingforgeeks](https://computingforgeeks.com/ccna-exam-topics/).

Textul oficial închide incertitudinile din note. **2.5** sună într-adevăr „Interpret basic operations of Rapid PVST+ Spanning Tree Protocol”, **5.5** conține „IPsec” („Describe IPsec remote access and site-to-site VPNs”), iar **1.1.e** este doar „Controllers” (pagina HTML ar mai afișa vechea formulare cu DNA Center și WLC, dar PDF-ul este autoritar). Față de reconstrucția din note, PDF-ul corectează și câteva detalii de formulare: 1.2.f „On-premises and cloud”, 4.5 „...including facilities and severity levels”, 5.4 „security password policy elements” și 6.6 fără virgulă înainte de „such as”.

### Arborele verbatim v1.1 (în engleză, verificat după PDF-ul oficial Cisco)

**1.0 Network Fundamentals — 20%**
- 1.1 Explain the role and function of network components
  - 1.1.a Routers
  - 1.1.b Layer 2 and Layer 3 switches
  - 1.1.c Next-generation firewalls and IPS
  - 1.1.d Access points
  - 1.1.e Controllers
  - 1.1.f Endpoints
  - 1.1.g Servers
  - 1.1.h PoE
- 1.2 Describe characteristics of network topology architectures
  - 1.2.a Two-tier
  - 1.2.b Three-tier
  - 1.2.c Spine-leaf
  - 1.2.d WAN
  - 1.2.e Small office/home office (SOHO)
  - 1.2.f On-premises and cloud
- 1.3 Compare physical interface and cabling types
  - 1.3.a Single-mode fiber, multimode fiber, copper
  - 1.3.b Connections (Ethernet shared media and point-to-point)
- 1.4 Identify interface and cable issues (collisions, errors, mismatch duplex, and/or speed)
- 1.5 Compare TCP to UDP
- 1.6 Configure and verify IPv4 addressing and subnetting
- 1.7 Describe private IPv4 addressing
- 1.8 Configure and verify IPv6 addressing and prefix
- 1.9 Describe IPv6 address types
  - 1.9.a Unicast (global, unique local, and link local)
  - 1.9.b Anycast
  - 1.9.c Multicast
  - 1.9.d Modified EUI 64
- 1.10 Verify IP parameters for Client OS (Windows, Mac OS, Linux)
- 1.11 Describe wireless principles
  - 1.11.a Nonoverlapping Wi-Fi channels
  - 1.11.b SSID
  - 1.11.c RF
  - 1.11.d Encryption
- 1.12 Explain virtualization fundamentals (server virtualization, containers, and VRFs)
- 1.13 Describe switching concepts
  - 1.13.a MAC learning and aging
  - 1.13.b Frame switching
  - 1.13.c Frame flooding
  - 1.13.d MAC address table

**2.0 Network Access — 20%**
- 2.1 Configure and verify VLANs (normal range) spanning multiple switches
  - 2.1.a Access ports (data and voice)
  - 2.1.b Default VLAN
  - 2.1.c InterVLAN connectivity
- 2.2 Configure and verify interswitch connectivity
  - 2.2.a Trunk ports
  - 2.2.b 802.1Q
  - 2.2.c Native VLAN
- 2.3 Configure and verify Layer 2 discovery protocols (Cisco Discovery Protocol and LLDP)
- 2.4 Configure and verify (Layer 2/Layer 3) EtherChannel (LACP)
- 2.5 Interpret basic operations of Rapid PVST+ Spanning Tree Protocol
  - 2.5.a Root port, root bridge (primary/secondary), and other port names
  - 2.5.b Port states and roles
  - 2.5.c PortFast
  - 2.5.d Root guard, loop guard, BPDU filter, and BPDU guard
- 2.6 Describe Cisco Wireless Architectures and AP modes
- 2.7 Describe physical infrastructure connections of WLAN components (AP, WLC, access/trunk ports, and LAG)
- 2.8 Describe network device management access (Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS, and cloud managed)
- 2.9 Interpret the wireless LAN GUI configuration for client connectivity, such as WLAN creation, security settings, QoS profiles, and advanced settings

**3.0 IP Connectivity — 25%**
- 3.1 Interpret the components of routing table
  - 3.1.a Routing protocol code
  - 3.1.b Prefix
  - 3.1.c Network mask
  - 3.1.d Next hop
  - 3.1.e Administrative distance
  - 3.1.f Metric
  - 3.1.g Gateway of last resort
- 3.2 Determine how a router makes a forwarding decision by default
  - 3.2.a Longest prefix match
  - 3.2.b Administrative distance
  - 3.2.c Routing protocol metric
- 3.3 Configure and verify IPv4 and IPv6 static routing
  - 3.3.a Default route
  - 3.3.b Network route
  - 3.3.c Host route
  - 3.3.d Floating static
- 3.4 Configure and verify single area OSPFv2
  - 3.4.a Neighbor adjacencies
  - 3.4.b Point-to-point
  - 3.4.c Broadcast (DR/BDR selection)
  - 3.4.d Router ID
- 3.5 Describe the purpose, functions, and concepts of first hop redundancy protocols

**4.0 IP Services — 10%**
- 4.1 Configure and verify inside source NAT using static and pools
- 4.2 Configure and verify NTP operating in a client and server mode
- 4.3 Explain the role of DHCP and DNS within the network
- 4.4 Explain the function of SNMP in network operations
- 4.5 Describe the use of syslog features, including facilities and severity levels
- 4.6 Configure and verify DHCP client and relay
- 4.7 Explain the forwarding per-hop behavior (PHB) for QoS such as classification, marking, queuing, congestion, policing, and shaping
- 4.8 Configure network devices for remote access using SSH
- 4.9 Describe the capabilities and functions of TFTP/FTP in the network

**5.0 Security Fundamentals — 15%**
- 5.1 Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques)
- 5.2 Describe security program elements (user awareness, training, and physical access control)
- 5.3 Configure and verify device access control using local passwords
- 5.4 Describe security password policy elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics)
- 5.5 Describe IPsec remote access and site-to-site VPNs
- 5.6 Configure and verify access control lists
- 5.7 Configure and verify Layer 2 security features (DHCP snooping, dynamic ARP inspection, and port security)
- 5.8 Compare authentication, authorization, and accounting concepts
- 5.9 Describe wireless security protocols (WPA, WPA2, and WPA3)
- 5.10 Configure and verify WLAN within the GUI using WPA2 PSK

**6.0 Automation and Programmability — 10%**
- 6.1 Explain how automation impacts network management
- 6.2 Compare traditional networks with controller-based networking
- 6.3 Describe controller-based, software defined architecture (overlay, underlay, and fabric)
  - 6.3.a Separation of control plane and data plane
  - 6.3.b Northbound and Southbound APIs
- 6.4 Explain AI (generative and predictive) and machine learning in network operations
- 6.5 Describe characteristics of REST-based APIs (authentication types, CRUD, HTTP verbs, and data encoding)
- 6.6 Recognize the capabilities of configuration management mechanisms such as Ansible and Terraform
- 6.7 Recognize components of JSON-encoded data

### Ce s-a schimbat față de v1.0 și ce înseamnă pentru conținut

Cisco Press listează ca modificate obiectivele **2.5, 2.8, 6.4, 6.5 și 6.6** ([Pearson Appendix B](https://ptgmedia.pearsoncmg.com/imprint_downloads/cisco/bookreg/9780135792735/9780135792735_AppendixB_v1-1.pdf)). La STP s-au adăugat rolurile și 2.5.d (Root guard, loop guard, BPDU filter, BPDU guard). 2.8 s-a extins de la AP/WLC la toate dispozitivele, inclusiv cele cloud-managed. Vechiul 6.4 (comparația cu DNA Center) a fost înlocuit cu AI/ML ([lostintransit.se](https://lostintransit.se/2024/04/23/ccna-200-301-updated-to-version-1-1/); [CBT Nuggets](https://www.cbtnuggets.com/blog/certifications/cisco/ccna-v1-1-200-301-exam)). 6.6 a trecut de la Puppet/Chef/Ansible la „Ansible and Terraform”. La 6.5, textul v1.1 conține „authentication types”, confirmat de PDF; formularea v1.0 („CRUD, HTTP verbs, and data encoding”) vine din note și nu a fost verificată în sursă primară.

Mai sunt două modificări de formulare care nu apar în lista Cisco Press: 1.1.e, din care a dispărut „(Cisco DNA Center and WLC)”, deoarece DNA Center a devenit Catalyst Center, și 1.12, care în v1.0 era „Explain virtualization fundamentals (virtual machines)”. Concluzia practică este că materialele vechi despre Puppet/Chef sau DNA Center trebuie etichetate „istoric”, nu predate ca obiectiv.

### Logistica examenului

Examenul durează **120 de minute**, costă **US$300** (sau Cisco Learning Credits) și se susține prin **Pearson VUE**, la centru sau online-proctored ([computingforgeeks](https://computingforgeeks.com/ccna-200-301-exam-cost-format/); [certsharp](https://www.certsharp.com/blog/ccna-exam-guide-2026)). Este disponibil în engleză și japoneză, deși o pagină legată de Cisco indică doar engleza ⚠, deci **nu în română**. Certificarea este valabilă **3 ani**, iar recertificarea se face cu 30 de credite CE sau printr-un examen calificant.

Cisco **nu publică** nici numărul de întrebări, nici scorul de trecere. Cifrele 800 sau 825/1000 sunt neoficiale ([achievable](https://achievable.me/exams/ccna/resources/ccna-exam-topics/)). În limbajul Cisco, „CCNA” denumește acum și CCNA Automation și CCNA Cybersecurity (200-201), după rebranding-ul din februarie 2026, care **nu** a schimbat 200-301 ([Cisco Learning Network](https://learningnetwork.cisco.com/s/a-new-era-for-cisco-certifications)). De aceea rădăcina platformei ar trebui etichetată „CCNA (200-301)”.

Pe cursurile oficiale, NetAcad oferă **ITN, SRWE și ENSA** (CCNA v7.x), iar ITN are 17 module ([Class Central](https://www.classcentral.com/course/cisco-networking-academy-ccna-introduction-to-networks-534130); [NETLAB+](https://www.netdevgroup.com/content/cnap/labs/)). Nu s-a găsit o matrice oficială modul–obiectiv. Corespondența aproximativă este următoarea: ITN acoperă 1.x și SSH; SRWE acoperă 2.x, 3.3, 3.5, 4.6 și 5.7–5.10; ENSA acoperă 3.4, 4.1, 4.2, 4.4, 4.5, 4.7, 5.x și 6.x. Este o inferență, nu o mapare Cisco.

## v2.0 restructurează în 5 domenii și înlocuiește REST/QoS cu AI agentic

Cisco a publicat topicurile v2.0 pe **20 mai 2026**, la Cisco Live. Prima zi de testare este **3 februarie 2027**, iar ultima zi pentru v1.1 este **2 februarie 2027** ([101labs](https://www.101labs.net/cisco-v2-0-changes-2027/); [AJS Networking](https://www.ajsnetworking.com/new-ccna-v2-2027/)). PDF-ul se intitulează „Implementing and Administering Cisco Solutions (200-301 CCNA) v2.0” ([Cisco PDF, fetch blocat](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf)). Durata și prețul rămân aceleași. Ponderile majoritare pentru cele cinci domenii sunt prezentate mai jos, dar sunt atribuite paginii Cisco doar de surse secundare ⚠ ([masteryexamprep](https://masteryexamprep.com/exams/cisco/ccna-v2/exam-blueprint/); [CBT Nuggets](https://www.cbtnuggets.com/blog/ccna-2-0-what-s-new-and-how-to-prepare)).

| Domeniu v2.0 | Pondere | Conținut raportat | Proveniență din v1.1 |
|---|---|---|---|
| 1.0 Network Infrastructure and Connectivity | 25% | cabluri/defecte fizice, hypervisors/VMs/containers, IPv4/IPv6 (troubleshoot), wireless, conectivitate client, DHCPv4 | 1.x + 4.6 |
| 2.0 Switching and Network Access | 25% | VLAN, trunk, LACP, PoE, Rapid PVST+, storm control, RA guard | 2.x + parțial 5.7 |
| 3.0 IP Routing | 20% | static, **OSPFv2 și OSPFv3** single-area, FHRP (HSRP/VRRP operational status) | 3.x |
| 4.0 Network Services and Security | 20% | AAA, NAT/PAT, DNS record types, IPsec, ACL IPv4, SFTP/SCP | 4.x + 5.x comasate |
| 5.0 AI, and Network Operations and Management | 10% | AI agentic, prompting GenAI, SNMP, Ansible, syslog | 6.x + 4.4/4.5 |

Conflictul de ponderi rămâne nerezolvat ⚠. Un ghid ([certramplearning](https://certramplearning.com/guides/ccna-200-301/)) dă 4.0 la 15% și un 6.0 separat la 5%, iar [CertificationKits](https://www.certificationkits.com/the-new-cisco-ccna-v2-0-coming-in-2027-what-actually-changed-and-why-hands-on-lab-practice-matters-more-than-ever/) descrie tot 6 domenii. Majoritatea surselor, inclusiv extrasul paginii Cisco, indică 5 domenii.

Obiectivul confirmat 5.1 sună „Describe the role of agentic AI in network operations” ([Cybersecurity with Glen](https://www.cybersecuritywithglen.com/ccna-200-301-v2-0/ai-network-operations-and-management/describe-the-role-of-agentic-ai-in-network-operations)). Ies din examen **QoS, REST/JSON și Terraform** ([hacksincodigos](https://hacksincodigos.com/en/courses/guides/ccna-200-301-v2/)). Multe obiective încep acum cu „Troubleshoot”, „Diagnose” sau „Interpret”. Lista verbatim completă a v2.0 **nu a putut fi obținută**: extrasele au arătat doar 1.1–1.3 și 5.1.

Implicația pentru platformă este directă. Un începător care pornește în noiembrie 2026 are în jur de 11 săptămâni de v1.1 la dispoziție, deci aproape sigur va susține v2.0. Modelul de date trebuie să aibă un strat de mapare v1.1→v2.0 și etichete de tipul „v1.1 core / se păstrează în v2.0”, „doar v1.1” (QoS, REST, JSON, Terraform) și „doar v2.0” (AI agentic, OSPFv3, storm control, RA guard, SFTP/SCP). Nucleul se transferă aproape integral: subnetting, VLAN, STP, OSPF, ACL, NAT. Din acest motiv, decizia de a porni pe v1.1 rămâne corectă, cu o condiție: diferențele trebuie construite înainte de februarie 2027, iar formatul exercițiilor trebuie orientat spre depanare.

## Fiecare domeniu cere viteză pe câteva tabele și reflexe pe câteva capcane

Notele de adâncime tehnică acoperă constantele de protocol cu trimiteri la RFC-uri ([std]). Asta face din ele o bază bună pentru carduri SRS, cu condiția unei verificări punctuale înainte de publicare. Tabelul de mai jos condensează, pentru fiecare domeniu, ce trebuie stăpânit, comenzile IOS-cheie și capcanele recurente.

| Domeniu | Adâncime și standarde | Comenzi IOS esențiale | Capcane tipice de examen |
|---|---|---|---|
| 1 Network Fundamentals | Subnetting rapid (2^h−2, /31 valid pe p2p per [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021)); RFC 1918; IPv6 GUA 2000::/3, ULA FC00::/7, LL FE80::/10, FF02::1/2/5/6 ([RFC 4291](https://www.rfc-editor.org/rfc/rfc4291)); EUI-64; NDP RS/RA/NS/NA 133–136 ([RFC 4861](https://www.rfc-editor.org/rfc/rfc4861)); porturi IANA; 802.11n/ac/ax/be; canale 1/6/11; MAC aging 300 s | `show mac address-table`, `ipconfig /all`, `ip addr`, `arp -a` | `::` doar o dată; la EUI-64 se *inversează* bitul 7, nu se „adună 2”; 802.11ac doar 5 GHz; late collisions = duplex mismatch; switch-ul învață doar MAC-ul *sursă* |
| 2 Network Access | 802.1Q (TPID 0x8100, VID 12 biți, normal 1–1005); matricea DTP; CDP 60/180 s vs LLDP 30/120 s [verify]; LACP/PAgP; STP vs RSTP (Alternate/Backup, discarding); BID = prioritate (multiplu de 4096) + VLAN + MAC ([Cisco RSTP doc](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.pdf)); CAPWAP UDP 5246/5247 ([RFC 5415](https://www.rfc-editor.org/rfc/rfc5415)); moduri AP Local/FlexConnect/Monitor/Sniffer | `switchport trunk allowed vlan add`, `show interfaces trunk`, `channel-group 1 mode active`, `show etherchannel summary`, `spanning-tree mode rapid-pvst`, `spanning-tree vlan 10 root primary`, `spanning-tree bpduguard enable` | `allowed vlan 30` fără `add` *înlocuiește* lista; auto+auto = access; passive+passive nu formează canal; prioritatea STP mai *mică* câștigă; VLAN 1 apare 32769; BPDU Guard face err-disable, nu doar block |
| 3 IP Connectivity | Longest prefix → AD → metric; AD 0/1/20/90/110/120/200 ([Cisco doc 15986](https://bxin.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html)), 5/115/170/254 [verify]; OSPF proto 89, 224.0.0.5/6, stări Down→Full, RID, DR/BDR non-preemptiv ([RFC 2328](https://www.rfc-editor.org/rfc/rfc2328)); HSRP hello 3/hold 10, preempt off, VRRP preempt on | `ip route ... 130` (floating), `ipv6 unicast-routing`, `router ospf 1`, `network ... area 0` (wildcard), `ip ospf priority`, `show ip ospf neighbor`, `standby 1 preempt` | /25 OSPF bate /24 static; DROther–DROther în 2-WAY e *normal*; blocat în ExStart = MTU; process ID local; Fa/Gi/10G toate cost 1; IPv6 static cu next-hop link-local cere interfața de ieșire |
| 4 IP Services | NAT inside/outside local/global; NTP stratum 16 = nesincronizat ([RFC 5905](https://www.rfc-editor.org/rfc/rfc5905)); DORA ([RFC 2131](https://www.rfc-editor.org/rfc/rfc2131)); SNMP v3 authPriv ([RFC 3411](https://www.rfc-editor.org/rfc/rfc3411)); syslog 0–7 ([RFC 5424](https://www.rfc-editor.org/rfc/rfc5424)); DSCP EF 46, AF41 34 ([IANA DSCP](https://www.iana.org/assignments/dscp-registry)); policing vs shaping | `ip nat inside source list 1 interface g0/1 overload`, `ntp server`, `ip helper-address`, `ip dhcp excluded-address`, `logging trap warnings`, `crypto key generate rsa modulus 2048`, `transport input ssh` | Lipsa `overload` = NAT dinamic; inside *global* = IP public; helper-address pe interfața spre *clienți*; nivelul 4 include 0–4; SNMPv2c necriptat; RSA cere hostname + domain-name; `logging trap` default disputat [verify] |
| 5 Security Fundamentals | RADIUS UDP 1812/1813, criptează doar parola ([RFC 2865](https://www.rfc-editor.org/rfc/rfc2865)) vs TACACS+ TCP 49, tot payload-ul ([RFC 8907](https://www.rfc-editor.org/rfc/rfc8907)); 802.1X supplicant/authenticator/server; ACL standard 1–99 lângă destinație, extended 100–199 lângă sursă; port security default 1 MAC + shutdown; DAI depinde de DHCP snooping; WPA2 CCMP, WPA3 SAE + PMF obligatoriu ([Intel WPA3](https://www.intel.com/content/dam/support/us/en/documents/wireless/intel-whitepaper-wifi-security-through-wpa3-verification.pdf)); IPsec ESP 50, AH 51, IKE 500/4500 | `enable secret`, `login block-for`, `aaa new-model`, `ip access-list extended`, `ip access-group ... in`, `access-class 10 in`, `switchport port-security violation restrict`, `ip dhcp snooping trust`, `ip arp inspection vlan 10` | Implicit deny: un ACL doar cu `deny` blochează tot; wildcard ≠ mască (/26 → 0.0.0.63); `access-class` pe VTY; tipul 7 e reversibil; WPA3-Personal = SAE, nu PSK; snooping-ul cere uplink-uri trusted |
| 6 Automation | Planuri data/control/management; northbound (REST) vs southbound (NETCONF, RESTCONF, OpenFlow); underlay/overlay/fabric (SD-Access: LISP + VXLAN + SGT); verbe HTTP ↔ CRUD și coduri de stare ([RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)); JSON ([RFC 8259](https://www.rfc-editor.org/rfc/rfc8259)); NETCONF SSH 830 ([RFC 6241](https://www.rfc-editor.org/rfc/rfc6241)); Ansible agentless/push vs Puppet/Chef agent/pull | (conceptual; exercițiu de citire JSON) | Southbound = *spre dispozitive*; 401 = autentificare, 403 = autorizare; PUT înlocuiește, PATCH modifică parțial; JSON doar cu ghilimele duble, `true` cu literă mică, fără virgulă finală |

Ponderea contează pentru prioritizare. **IP Connectivity (25%)** este cel mai mare domeniu, iar simlet-urile combină de obicei citirea tabelei de rutare, longest match, AD, floating static și depanarea adiacenței OSPF. Ordinea de predare recomandată urmează exact acest lanț. În Domeniul 1, subnetting-ul și abrevierea/EUI-64 sunt abilitățile cu randamentul cel mai mare. Ele cer generatoare interactive, nu text.

Packet Tracer acoperă bine 2.1–2.5. Pentru 2.6–2.9 (WLC GUI) sunt necesare capturi sau simulări, pentru că emularea WLC din PT este limitată. Câteva valori rămân de verificat pe platformă: timerele LLDP, metoda implicită de load-balance EtherChannel, costul STP short pentru 100G și nivelul implicit `logging trap` ⚠.

### Extensii „beyond CCNA”: puntea spre ENCOR

Extensiile cu cea mai mare valoare continuă direct fiecare domeniu și se aliniază cu [ENCOR 350-401](https://learningnetwork.cisco.com/s/encor-exam-topics) (pagină neîncărcată ⚠; maparea este o inferență de design):

| Domeniu CCNA | Extensie |
|---|---|
| 1 | Spine-leaf + VXLAN/EVPN, DHCPv6-PD, RA guard, VRF-Lite și GRE |
| 2 | MST, UDLD/Loop Guard, roaming 802.11k/v/r, Catalyst 9800 |
| 3 | OSPF multi-area (LSA 1–7, stub/NSSA), OSPFv3, EIGRP (DUAL, feasible successor), eBGP de bază, redistribuire, PBR |
| 4 | QoS MQC, IP SLA + tracking, NetFlow, SPAN/RSPAN/ERSPAN, multicast IGMP/PIM |
| 5 | 802.1X/MAB/ISE, CoPP, uRPF, DMVPN, Zone-Based Firewall, TrustSec |
| 6 | Python (netmiko, requests), NETCONF/RESTCONF + YANG, Ansible pentru IOS-XE, telemetrie gNMI, EEM, Git/CI |
| Transversal | SD-WAN (Manager/Controller/Validator, OMP, TLOC), SD-Access |

Ordinea de dependență propusă este: OSPF multi-area → EIGRP → BGP → VRF-Lite → MST → 802.1X → QoS MQC → SD-WAN/SD-Access → automatizare. Accentul v2.0 pe AI justifică și o pistă de laborator de tipul „validează configurația propusă de un asistent AI”.

## Testarea cu feedback și ghidarea care scade treptat trebuie să structureze lecțiile și laboratoarele

Meta-analiza Dunlosky et al. (2013) dă **utilitate ridicată** doar pentru două tehnici: **practice testing** și **distributed practice**. Interleaving-ul și self-explanation au utilitate moderată, iar recitirea și sublinierea au utilitate scăzută ([APS](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html); [Reading Rockets](https://www.readingrockets.org/resources/resource-library/improving-students-learning-effective-learning-techniques-promising)). Testarea nu doar măsoară, ci și îmbunătățește retenția ulterioară, un efect pe care studenții nu îl anticipează ([Roediger & Karpicke 2006](https://psychology.ecu.edu/wp-content/pv-uploads/sites/216/2019/03/Roediger-Karpicke-2006.pdf)). Interleaving-ul are un efect mediu de **g = 0,42**, mai mare când categoriile seamănă între ele ([Brunmair & Richter 2019](https://pubmed.ncbi.nlm.nih.gov/31556629/)). Asta îl recomandă pentru perechi ușor de confundat precum ACL standard/extended, access/trunk sau /26 vs /27, dar numai în recapitulări. Prima învățare rămâne pe blocuri.

Pentru un începător total, efectul worked example este decisiv, iar inversarea expertizei (Kalyuga 2003) arată că același sprijin devine inutil pe măsură ce cunoașterea crește ([Wikipedia: Worked-example effect](https://en.wikipedia.org/wiki/Worked-example_effect)). **Fading-ul adaptiv a învins fading-ul fix, iar fading-ul fix a învins rezolvarea pură de probleme**, inclusiv la testul amânat ([Salden et al. 2010](https://link.springer.com/doi/10.1007/s11251-009-9107-8)). Rezultă două structuri. Fiecare lecție are patru straturi: „Pe scurt” (3–5 propoziții și o diagramă), explicația detaliată construită în jurul unui worked example, „Aprofundare” pliat implicit și „Capcane la examen”, urmate de 3–5 întrebări de retrieval cu feedback imediat. Fiecare subiect de laborator urcă pe o scară: lab complet ghidat → semi-ghidat → solo → troubleshooting, cu deblocare adaptivă după performanță. O limită trebuie spusă explicit: dovezile vin mai ales din sarcini bine structurate, nu din educația CLI, pentru care nu s-a găsit cercetare specifică.

### FSRS-6 prin ts-fsrs sau py-fsrs, cu jurnal complet de recenzii din prima zi

Pe benchmark-ul deschis srs-benchmark (circa 727 de milioane de recenzii de la 10.000 de utilizatori), **FSRS-6 obține log loss 0,3460**, față de 0,3561 pentru FSRS-5 și 0,4033 pentru ACT-R ([srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark)). FSRS-5 bate un SM-2 antrenabil în **97,4%** din colecții ([Anki forum](https://forums.ankiweb.net/t/video-fsrs-vs-anki-s-default-algorithm-sm-2/37925)). Ambele implementări de referință sunt **MIT** ([ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs); [py-fsrs](https://github.com/open-spaced-repetition/py-fsrs)). README-ul ts-fsrs v6 indică FSRS-7 ca implicit în `DefaultScheduler()` și cere Node ≥ 24 ⚠, iar py-fsrs listează 21 de parametri, cât are FSRS-6. Statutul FSRS-7 (stabil sau experimental) nu este clar.

Recomandarea este ca versiunea modelului să fie **fixată explicit**, pentru că stările de memorie stocate depind de ea. Programarea rulează pe server, ca telefonul și desktopul să împartă același calendar. Fiecare recenzie se jurnalizează (card_id, timestamp, rating 1–4, state), pentru rularea optimizatorului după aproximativ 1.000 de recenzii. Cardurile SRS sunt pentru fapte atomice: porturi, AD, sintaxă. Laboratoarele merg într-o coadă separată „revino în N zile”, iar exercițiile de subnetting generate se urmăresc ca „skill cards”, pe abilitate. O retenție dorită de 0,85–0,9 este convenția FSRS, dar valoarea nu a fost sursată în sesiune ⚠.

### Itemi MCQ: trei distractori buni bat cinci slabi, iar fiecare opțiune primește explicație

Ghidurile Haladyna–Downing–Rodriguez (2002) cer opțiuni omogene ca formă și lungime, fără stem-uri negative și fără indicii de tip „always/never” ([UNM](https://cpl.health.unm.edu/AssetListing/Writing-Questions-for-Learning-and-Assessment-2573/Rules-for-Multiple-Choice-Items-Haladyna-et-al-2002-5943)). Meta-analiza Rodriguez arată că trecerea de la 4–5 opțiuni la 3 nu afectează aproape deloc dificultatea, discriminarea sau fidelitatea. **Calitatea distractorilor contează mai mult decât numărul lor** ([Rodriguez, ACU](https://acuresearchbank.acu.edu.au/download/b80d8639c49c02148efe594c4d30e08479fb6dfdbdc552674e7071d20ca03429/116532/Rodriguez_2014_Distractor_functioning_in_modofied_items_for_test.pdf)).

Compromisul ales este 4 opțiuni, ca să semene cu examenul Cisco, fiecare cu `explanation_ro`/`explanation_en` și un `misconception_tag` care trimite la remediere. Distractorii pornesc din erori reale ale începătorilor: wildcard greșit, adresa de rețea confundată cu prima adresă utilizabilă, `show` confundat cu o comandă de configurare, AD confundat cu metrica. Schema mai acoperă:

- **drag-and-drop** de tip match și order (DORA, alegerea root bridge-ului);
- **CLI fill-in** cu normalizare (abrevieri IOS precum `sh ip int br`, variante acceptate) și cu promptul de mod afișat (`R1(config-if)#`);
- **subnetting generat procedural** (/8–/32, inclusiv /31 și /32), cu cheia calculată printr-o bibliotecă verificată și soluția completă (block size, magic number, vedere binară).

### Simularea de examen trebuie să reproducă navigarea liniară

Sursele comunitare raportează două constrângeri ale examenului real. **Nu te poți întoarce după „Next”** și nu poți marca întrebări pentru review. În interiorul unui sim sau testlet te poți mișca liber până îl părăsești ([9tut FAQ](https://www.9tut.com/?p=51); [prepforcerts](https://prepforcerts.org/how-many-questions-on-cisco-ccna-exam)). Simulările ar primi credit pe sarcină, nu documentat oficial ⚠. Modul de simulare configurabil ar trebui să aibă implicit 120 de minute, aproximativ 100 de întrebări (estimare neoficială ⚠), `linear_no_back=true`, un amestec de circa 75–85% MCQ, 10–15% drag-and-drop și 2–4 sims, eșantionare după ponderile domeniilor, fără feedback până la final și un raport de scor pe domeniu.

Un mod „practice” separat oferă feedback imediat și navigare înapoi. Scorul se afișează scalat, cu mențiunea explicită că pragul Cisco nu este public. Simularea rulează în engleză, iar un helper în română este disponibil doar în practice.

### Laboratoare Packet Tracer pentru început, CML-Free pentru IOS real

Packet Tracer 9.0.x este gratuit cu cont NetAcad/Skills for All și rulează pe Windows, macOS și Ubuntu ([computernetworkingnotes](https://www.computernetworkingnotes.com/ccna-study-guide/download-packet-tracer-for-windows-and-linux.html)). Versiunea exactă nu este clară (9.0.0 sau 9.0.1 din iulie 2026) ⚠. Activity Wizard-ul (`.pka`) permite o rețea-răspuns cu itemi de evaluare punctați și teste de conectivitate ([PT Activity Wizard help](https://tutorials.ptnetacad.net/help/default/activityWizard.htm)). Comunitatea raportează însă bug-uri de ponderare și de recunoaștere a rutelor statice ([Cisco Community](https://community.cisco.com/t5/cisco-bug-discussions/cisco-packet-tracer-7-2-activity-wizard-not-recognizing-static/td-p/3712416)), deci fiecare `.pka` trebuie testat contra soluției. PT simulează doar un subset din IOS ([CloudMyLab](https://blog.cloudmylab.com/gns3-vs-packet-tracer); sursele NetPilot sunt ale unui competitor).

**CML-Free** (de la CML 2.8) rulează până la **5 noduri** fără licență și este singura sursă legală și gratuită de imagini Cisco reale, licențiate doar în CML ([Cisco DevNet CML-Free](https://developer.cisco.com/docs/modeling-labs/cml-free/)). GNS3 și EVE-NG Community (plafon de circa 63 de noduri, raportat de un vendor ⚠) sunt opționale pentru avansați, cu imagini obținute legal de utilizator. **Platforma nu distribuie niciodată imagini IOS/IOL.**

Șablonul de ghid de laborator are 11 secțiuni:

1. titlu, coduri de topic și dificultate;
2. 3–5 obiective măsurabile;
3. topologie SVG/PNG plus `.pkt`/`.pka` descărcabile;
4. tabel de adresare;
5. starea inițială a laboratorului;
6. sarcinile, cu nivelul de ghidare corespunzător;
7. verificarea, prin comenzi `show` și liniile-cheie de output așteptate;
8. erori frecvente;
9. soluția completă, ascunsă;
10. întrebări de retrieval care alimentează SRS;
11. o notă „PT vs IOS real”.

Laboratoarele solo din afara PT pot fi verificate printr-un checker de tip „lipește `show run`”. Termenii EULA pentru publicarea de fișiere `.pka` proprii nu au fost cercetați ⚠.

### Iconițe și fotografii: nemodificate, atribuite, găzduite local

Pagina Cisco Network Topology Icons permite folosirea liberă a iconițelor, **cu condiția să nu fie modificate** ([Cisco Network Topology Icons](https://cisco.com/c/en/us/about/brand-center/network-topology-icons.html), via extras ⚠). Se aplică și ghidurile Cisco de copyright, iar cererile de permisiune merg la ciscologos@cisco.com ([Cisco Copyright Use](https://www.cisco.com/c/en/us/about/brand-center/copyright-use.html)). Întrebarea despre folosirea iconițelor în materiale de training *comerciale* nu are răspuns oficial ([Cisco Community](https://community.cisco.com/t5/online-tools-and-resources/licensing-for-cisco-network-topology-icons/ta-p/2498609)).

Asta exclude recolorarea și, probabil, inversarea pentru dark mode. Pentru dark mode, alternativa este o temă cu fundal deschis sub iconițe sau desene SVG proprii. Logo-ul Cisco și insigna CCNA nu se folosesc ca branding, iar footer-ul precizează că site-ul nu este afiliat Cisco. Fotografiile de pe Wikimedia Commons se reutilizează conform licenței fiecărui fișier ([Commons: Reusing content](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)). Se descarcă local, cu atribuire TASL (Title, Author, Source, License) ([Creative Commons](https://wiki.creativecommons.org/Best_practices_for_attribution)), iar derivatele CC BY-SA se publică sub aceeași licență ([Meta-Wiki](https://meta.wikimedia.org/wiki/Open_Science_for_Arts,_Design_and_Music/Guidelines/Creative_Commons_Licenses/Re-use)). Pentru fiecare imagine se păstrează un record de metadate (title, author, source URL, licență, „modified: yes/no”).

## TypeScript peste tot, SQLite într-un singur fișier, Caddy în față: stack-ul pentru Pi 4

Nu există un benchmark Node, FastAPI și Go pe Pi 4. Datele generice (probabil x86) arată un consum de memorie de circa 22 MB pentru Go, 85 MB pentru Fastify și 140 MB pentru FastAPI ([index.dev](https://www.index.dev/skill-vs-skill/backend-go-vs-nodejs-vs-python-fastapi)), toate neglijabile pe un Pi de 2 GB. Pi 4 are însă aproximativ **jumătate din performanța single-core a unui Pi 5** (Geekbench 340 vs 764) ([fast.io](https://fast.io/resources/openclaw-raspberry-pi-nodejs-javascript-development-agent.md)). Asta contează la build-uri, nu la servirea a 1–5 utilizatori.

Criteriul decisiv este așadar **o singură limbă** partajată între client și server: tipurile întrebărilor, schemele Zod, logica FSRS și generatorul de subnetting. Asta înseamnă Node.js. În noiembrie 2026, **Node 26 „Lithium” este Latest LTS** (26.13.1), iar Node 24 „Krypton” (24.22.3) rămâne LTS ([nodejs.org](https://nodejs.org/en/about/previous-releases)). Node 24 este alegerea conservatoare, Node 26 dă cel mai lung suport.

| Strat | Alegere | Justificare și sursă |
|---|---|---|
| OS și stocare | Raspberry Pi OS Lite 64-bit Trixie (Debian 13), boot de pe SSD USB, log2ram | Trixie lansat în oct. 2025, recomandată instalare curată ([raspberrypi.com](https://www.raspberrypi.com/news/trixie-the-new-version-of-raspberry-pi-os/)); SSD USB până la ~208 MB/s scriere ([Tom's Hardware](https://www.tomshardware.com/uk/news/boot-raspberry-pi-from-usb,39782.html)); stick-urile USB se uzează ca SD-ul ([dzombak](https://dzombak.com/blog/2024/04/Pi-Reliability-Reduce-writes-to-your-SD-card.html)) |
| Backend | Node 24/26 LTS + **Fastify 5** (Hono 4 ca alternativă) | Fastify 5.12 și Hono 4.13 la ~1% diferență pe Node 24 ([techplained](https://www.techplained.com/hono-vs-express-vs-fastify)); Fastify are ecosistemul de plugin-uri mai matur ([pkgpulse](https://www.pkgpulse.com/compare/hono-vs-fastify)) |
| Bază de date | **SQLite** + better-sqlite3 12.x + Drizzle, WAL | better-sqlite3 12 suportă Node 24 ([newreleases](https://newreleases.io/project/npm/better-sqlite3/release/12.0.0)); `node:sqlite` e încă Release Candidate ([Node docs](https://nodejs.org/download/release/v25.8.0/docs/api/sqlite.html)); fără daemon Postgres, un singur fișier de backup |
| Frontend | **Vite 8** + **React 19.3** + TypeScript + Tailwind 4 + MDX (`@mdx-js/rollup`) | Vite 8 stabil din 12 mar. 2026 pe Rolldown ([vite.dev](https://vite.dev/blog/announcing-vite8)); React 19.3 din 9 sep. 2026 ([react.dev](https://react.dev/blog/2026/09/09/react-19-3)); Tailwind 4 configurare în CSS ([tailwindcss.com](https://tailwindcss.com/blog/tailwindcss-v4-1)) |
| Animații | Motion pentru UI; GSAP 3.15 doar pentru animații de pachete pe timeline | GSAP gratuit integral, dar sub licență Webflow non-OSI, revocabilă discreționar ([GSAP standard license](https://gsap.com/community/standard-license/); [Webflow](https://webflow.com/blog/gsap-becomes-free)) |
| Servire și HTTPS | **Caddy** cu `tls internal`, root CA instalat pe telefon și desktop; sau domeniu real cu Let's Encrypt DNS-01 | Service worker-ele cer TLS ([DEV](https://dev.to/justinribeiro/running-progressive-web-apps-on-your-intranet-with-tls-from-lets-encrypt-f3f)); CA local Caddy ([Caddy docs](https://caddyserver.com/docs/automatic-https); [Caddy community](https://caddy.community/t/how-to-install-caddys-root-ca-on-other-machines-on-the-local-network/19090)) |
| Rulare | **systemd** (nu Docker); PWA prin vite-plugin-pwa | În Docker, Caddy nu poate instala root CA în host ([Caddy community](https://caddy.community/t/how-to-make-local-network-browsers-accept-my-test-site/33257)) |

Câteva decizii operaționale decurg din aceste constrângeri:

- **Build-ul se face pe mașina de dezvoltare**, iar `dist/` și bundle-ul serverului se copiază cu rsync. Pi-ul rămâne doar runtime, ca să evite build-urile lente și scrierile pe flash.
- Caddy servește direct asset-urile cu hash (`Cache-Control: immutable`, fișiere precomprimate) și face proxy doar pentru `/api/*`.
- PRAGMA-urile propuse sunt `journal_mode=WAL`, `synchronous=NORMAL`, `foreign_keys=ON` și `busy_timeout=5000`. Nu au fost verificate pe sqlite.org ⚠.
- Backup-ul nocturn folosește `.backup`/`VACUUM INTO` dintr-un timer systemd, cu aproximativ 14 copii și rsync pe un NAS. Fișierul `.db` nu se copiază singur cât rulează în WAL, pentru că `-wal` conține ultimele commit-uri. Se adaugă și un buton de export JSON.

Astro 6 cu insule React este varianta de rezervă dacă platforma devine predominant lecții. Astro aparține acum Cloudflare ([Cloudflare blog](https://blog.cloudflare.com/astro-joins-cloudflare/)), ceea ce nu blochează un site static local. Starea care traversează fiecare pagină (progres, SRS, notițe, temă) face însă un SPA mai coerent. Go cu SQLite merită doar dacă un binar static și un consum minim de RAM primează în fața codului partajat.

Pentru interfață, `backdrop-filter: blur()` este costisitor peste conținut care derulează, cu bug-uri deschise la Firefox și WebKit ([Mozilla Bug 1732817](https://bugzilla.mozilla.org/show_bug.cgi?id=1732817); [WebKit Bug 252948](https://bugs.webkit.org/show_bug.cgi?id=252948)). Glassmorphism-ul ar trebui limitat la 1–3 elemente fixe (bară, navigație, modal), cu un blur de 8–16 px ([OpenReplay](https://blog.openreplay.com/creating-blurred-backgrounds-css-backdrop-filter/)) și fallback-uri `prefers-reduced-transparency`/`@supports`. Textul lecțiilor stă pe suprafețe aproape opace, pentru contrast WCAG AA de 4,5:1 (prag din cunoaștere generală ⚠).

Mai rămân de confirmat cu `npm view` la pornirea proiectului versiunile exacte de Tailwind, Motion, Drizzle, vite-plugin-pwa, Caddy și ts-fsrs. Lipsesc și măsurători RSS reale pe Pi 4, care se pot face cu `wrk` și `/proc/<pid>/status`.

## Concluzie

Cea mai valoroasă decizie de arhitectură nu este alegerea framework-ului, ci **modelarea curriculumului ca date versionate**. Fiecare lecție, card, item și laborator ar trebui să poarte un cod de obiectiv v1.1 și, în paralel, unul v2.0, plus o etichetă de status (core, v1.1-only, v2.0-only, beyond). Astfel, tranziția din februarie 2027 devine o migrare de mapări, nu o rescriere. Arborele v1.1 de aici, verificat după PDF, se poate importa direct ca seed. Pentru v2.0 se aplică aceeași disciplină: nodurile cu ⚠ intră în baza de date cu status „neverificat” până la comparația manuală cu [PDF-ul v2.0](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf). Lista verbatim completă a v2.0 este cel mai important element lipsă și ar trebui obținută înaintea oricărui conținut v2.0.

Pedagogic, v2.0 confirmă direcția: verbele „Troubleshoot/Diagnose/Interpret” răsplătesc exact laboratoarele de depanare și itemii cu distractori bazați pe concepții greșite pe care cercetarea îi recomandă deja. O platformă construită acum în jurul retrieval-ului, al ghidării care scade treptat și al labului „broken config” predă, practic, spre examenul din 2027. Vechiul model „citește capitolul, rezolvă dump-ul” se potrivește tot mai prost cu ambele versiuni.
