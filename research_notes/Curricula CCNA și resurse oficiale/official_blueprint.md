# Official Cisco CCNA 200-301 Blueprint (state as of November 2026)

> **Method note (read first):** In this research session, direct page fetching was blocked by the sandbox network policy. These hosts did not resolve: learningnetwork.cisco.com, learningcontent.cisco.com, www.cisco.com, certskills.com, computingforgeeks.com and lostintransit.se. All findings come from web-search result extracts of those pages, plus cross-checks between sources. Where a search extract confirmed the Cisco wording, the item is marked **[confirmed in search extract]**. The rest of the v1.1 verbatim list is the widely published Cisco v1.1 text, reproduced from the researcher's prior knowledge, and **must be diffed line by line against the official PDF** (https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf) before it becomes the platform tree. The items I am least sure of are flagged inline with ⚠.

## Is v1.1 still current, and is there a newer CCNA version (v2.0)?

### Takeaway
As of November 2026, **CCNA 200-301 v1.1 is still the live exam**. Cisco published the **CCNA v2.0 exam topics on May 20, 2026** (at Cisco Live 2026). **v2.0 starts testing on February 3, 2027.** The **last day to test on v1.1 is February 2, 2027.** The exam code stays **200-301**. v2.0 is a major restructure: it drops from 6 domains to 5, adds AI and agentic-AI topics, shifts toward "troubleshoot/diagnose/interpret" verbs, and removes REST/JSON/Terraform and QoS. A learning platform built now should model v1.1 as the active tree and v2.0 as the upcoming tree.

### Cited Findings
- The official Cisco Learning Network page for v2.0 exists at /s/ccna-v2-exam-topics. Its search extract lists the exam as 120 minutes, with domains IP routing, switching and network access, network services and security, network infrastructure and connectivity, and AI and network operations and management. Extract-visible objectives: 1.1 (interface and cable diagnosis), 1.2 (hypervisors, VMs, and containers), 1.3 (IPv4 troubleshooting). — [Cisco Learning Network: CCNA v2.0 Exam Topics](https://learningnetwork.cisco.com/s/ccna-v2-exam-topics)
- v2.0 exam topics were published May 20, 2026. v2.0 goes live February 3, 2027. The last v1.1 test date is February 2, 2027. The exam code is unchanged. — [101labs: CCNA v2.0 every change](https://www.101labs.net/cisco-v2-0-changes-2027/); [cisnet.ca: v2.0 vs v1.1](https://www.cisnet.ca/blog/ccna-v2-0-vs-v1-1); [AJS Networking (Anthony Sequeira)](https://www.ajsnetworking.com/new-ccna-v2-2027/); [101labs v1 vs v2 comparison PDF](https://www.101labs.net/wp-content/uploads/2026/05/ccna-v1-vs-v2-comparison.pdf)
- The announcement was made at Cisco Live 2026 Las Vegas alongside AI-integrated CCIE updates. It is described as the first major CCNA blueprint change since 2019, hence the jump to 2.0. — [SPOTO news](https://cciedump.spoto.net/news/cisco-announces-ccna-v20-and-ai-integrated-ccie-updates-at-cisco-live-2026-las-vegas.html); [CertSkills (Wendell Odom) v2.0 blueprint deep dive](https://www.certskills.com/ccna26-02/)
- **v2.0 domains and weights (5 domains):** 1.0 Network Infrastructure and Connectivity 25%; 2.0 Switching and Network Access 25%; 3.0 IP Routing 20%; 4.0 Network Services and Security 20%; 5.0 AI, and Network Operations and Management 10%. — [masteryexamprep v2 blueprint](https://masteryexamprep.com/exams/cisco/ccna-v2/exam-blueprint/); [CBT Nuggets: CCNA 2.0](https://www.cbtnuggets.com/blog/ccna-2-0-what-s-new-and-how-to-prepare); [trainingcamp](https://trainingcamp.com/articles/ccna-is-changing-in-2027-take-the-current-exam-or-wait-for-v2-0/). **Conflict:** one third-party guide instead lists 4.0 at 15% plus a 6.0 Network Operations and Management at 5%. — [certramplearning](https://certramplearning.com/guides/ccna-200-301/). The majority view, attributed to Cisco's page, is the 5-domain split.
- Example v2.0 topic contents: Domain 1 covers cabling and physical faults, virtualization, IPv4/IPv6, wireless, host connectivity and DHCPv4. Domain 2 covers VLANs, trunks, LACP, PoE and Rapid PVST+. Domain 3 covers static routing, single-area OSPFv2/OSPFv3 and first-hop redundancy. Domain 4 covers AAA, NAT/PAT, DNS, IPsec and IPv4 ACLs. Domain 5 covers agentic AI, SNMP, Ansible and syslog. — [masteryexamprep](https://masteryexamprep.com/exams/cisco/ccna-v2/exam-blueprint/); [hacksincodigos v2 guide](https://hacksincodigos.com/en/courses/guides/ccna-200-301-v2/)
- v2.0 objective 5.1 reads "Describe the role of agentic AI in network operations". Candidates may need to evaluate output and recommendations from agentic AI and digital network assistants, and prompt selection for generative AI is reportedly in scope. — [Cybersecurity with Glen (v2.0 5.1 page)](https://www.cybersecuritywithglen.com/ccna-200-301-v2-0/ai-network-operations-and-management/describe-the-role-of-agentic-ai-in-network-operations); [101labs](https://www.101labs.net/cisco-v2-0-changes-2027/)
- Added or expanded in v2.0: AI in network operations, OSPFv3, HSRP/VRRP operational status, DNS record types, SFTP/SCP, storm control and RA guard. Dropped: QoS, REST and JSON, and Terraform. Ansible, SNMP and syslog are folded into the combined Domain 5. Many objectives now start with "Troubleshoot", "Diagnose" or "Interpret", for example IPv4/IPv6 addressing, client connectivity, DHCPv4, static routing, DNS records and syslog messages. — [hacksincodigos](https://hacksincodigos.com/en/courses/guides/ccna-200-301-v2/); [certramplearning](https://certramplearning.com/guides/ccna-200-301/); [101labs](https://www.101labs.net/cisco-v2-0-changes-2027/)
- Cisco Press reportedly plans 3rd-edition Official Cert Guides for v2.0, orderable in Q4 2026. Early v2.0 training is reportedly on Cisco U. — [search synthesis citing CertSkills](https://www.certskills.com/ccna26-02/) (unverified, the page could not be fetched)
- Separate Feb 3, 2026 change: the DevNet certifications were rebranded as CCNA/CCNP/CCIE Automation, and CyberOps Associate became "CCNA Cybersecurity" (200-201). This did **not** change the 200-301 CCNA exam topics. — [Cisco Learning Network: A new era for Cisco certifications](https://learningnetwork.cisco.com/s/a-new-era-for-cisco-certifications); [certcrush](https://www.certcrush.app/blog/cisco-cyberops-now-ccna-cybersecurity-200-201-2026)

### Inferences
- Learners starting in November 2026 have about 11 weeks of v1.1 availability left. A platform should support both trees, with a v1.1-to-v2.0 mapping layer. Most core content carries over (subnetting, VLANs, OSPF, ACLs, NAT, STP).
- Because "CCNA" now also names CCNA Automation and CCNA Cybersecurity, the platform should label the root "CCNA (200-301)" to avoid ambiguity.

### Gaps
- I could not obtain the **full verbatim v2.0 objective list** (every n.n and n.n.x line). The fetch was blocked, and search extracts only surfaced 1.1–1.3 and 5.1. Retrieve it from https://learningnetwork.cisco.com/s/ccna-v2-exam-topics or the v2.0 PDF on learningcontent.cisco.com.
- The 5-domain versus 6-domain weight conflict for v2.0 is not resolved from a primary source. The majority of sources say 5 domains: 25/25/20/20/10.

## Full verbatim list of v1.1 exam topics (current live exam)

### Takeaway
v1.1 (live since **August 20, 2024**) has 6 domains: **1.0 Network Fundamentals 20%, 2.0 Network Access 20%, 3.0 IP Connectivity 25%, 4.0 IP Services 10%, 5.0 Security Fundamentals 15%, 6.0 Automation and Programmability 10%**. The full list is below. Diff it against the official PDF before committing it as the platform tree; see the method note.

### Cited Findings
- Official v1.1 PDF: [CCNA Exam v1.1 (200-301) PDF](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf). Official topics page: [200-301 CCNA Exam Topics and Study Guide](https://learningnetwork.cisco.com/s/ccna-exam-topics). Older v1.0 PDF (historical): [CCNA Exam v1.0 PDF](https://learningcontent.cisco.com/documents/200_301_CCNA_v1.0_2.pdf)
- Domain weights 20/20/25/10/15/10. — [computingforgeeks full v1.1 list](https://computingforgeeks.com/ccna-exam-topics/); [open-exam-prep domains and weights](https://open-exam-prep.com/exams/ccna/introduction/exam-domains-and-weights); [ccnadefinitions](https://ccnadefinitions.com/10-guides-and-management/ccna-objectives-and-exam-topics/)
- Items confirmed in search extracts of the Cisco PDF or topics page: 1.1.a–1.1.h (1.1.e reads just "Controllers" in the v1.1 PDF); 1.2.a–1.2.f; 1.12 "(server virtualization, containers, and VRFs)"; 1.13 with 1.13.a–d; 2.9 wording; 3.4 with 3.4.a–d; 6.6 "Recognize the capabilities of configuration management mechanisms, such as Ansible and Terraform"; 6.7 "Recognize components of JSON-encoded data". — [Cisco v1.1 PDF](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf); [Cisco topics page](https://learningnetwork.cisco.com/s/ccna-exam-topics)
- One search extract said the Learning Network page still shows 1.1.e as "Controllers (Cisco DNA Center and WLC)", while the v1.1 PDF shows "Controllers". The v1.1 PDF is authoritative. — [Cisco topics page](https://learningnetwork.cisco.com/s/ccna-exam-topics)

#### Verbatim v1.1 topic tree

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
  - 1.2.f On-premise and cloud
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
- 2.5 Interpret basic operations of Rapid PVST+ Spanning Tree Protocol ⚠ (verify the stem wording)
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
- 4.5 Describe the use of syslog features including facilities and levels
- 4.6 Configure and verify DHCP client and relay
- 4.7 Explain the forwarding per-hop behavior (PHB) for QoS, such as classification, marking, queuing, congestion, policing, and shaping
- 4.8 Configure network devices for remote access using SSH
- 4.9 Describe the capabilities and functions of TFTP/FTP in the network

**5.0 Security Fundamentals — 15%**
- 5.1 Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques)
- 5.2 Describe security program elements (user awareness, training, and physical access control)
- 5.3 Configure and verify device access control using local passwords
- 5.4 Describe security password policies elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics)
- 5.5 Describe IPsec remote access and site-to-site VPNs ⚠ (v1.0 read "Describe remote access and site-to-site VPNs"; confirm whether v1.1 adds "IPsec")
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
- 6.6 Recognize the capabilities of configuration management mechanisms, such as Ansible and Terraform
- 6.7 Recognize components of JSON-encoded data

Counts: 53 numbered objectives (13 + 9 + 5 + 9 + 10 + 7 = 53). That matches the "six domains and 53 numbered objectives" figure in [computingforgeeks](https://computingforgeeks.com/ccna-exam-topics/).

### Inferences
- The v1.1 tree above has 53 second-level nodes and about 60 lettered leaves, which is a natural root/branch/leaf structure for the platform.
- Cisco's general exam-topics disclaimer says the topics are guidelines and related topics may appear. The platform may want a "related/background" node per domain. (This disclaimer is from prior knowledge of Cisco blueprint PDFs and was not re-verified this session.)

### Gaps
- No line-by-line verification against the PDF was possible this session. The most uncertain lines are the 2.5 stem, 5.5 ("IPsec"), and whether 1.1.e still carries "(Cisco DNA Center and WLC)" on the HTML page.

## What changed between v1.0 and v1.1

### Takeaway
v1.1 was a **minor update** announced in April 2024 and **effective August 20, 2024**. Domain names and weights did not change. The changes were: 1.1.e dropped "(Cisco DNA Center and WLC)"; 2.5 STP was expanded (roles, plus a new 2.5.d on Root guard, loop guard, BPDU filter and BPDU guard); 2.8 was broadened to all network devices, including cloud-managed; old 6.4 (DNA Center comparison) was replaced by AI/ML; 6.5 REST APIs added "authentication types"; and 6.6 changed from Puppet/Chef/Ansible to Ansible and Terraform.

### Cited Findings
- v1.1 went live on August 20, 2024, as a minor update. Cisco Press lists the changed topics as 2.5, 2.8, 6.4, 6.5 and 6.6. — [Pearson/Cisco Press Appendix B "CCNA 200-301, Volume 1 Exam Updates" (v1.1)](https://ptgmedia.pearsoncmg.com/imprint_downloads/cisco/bookreg/9780135792735/9780135792735_AppendixB_v1-1.pdf); [CertSkills: Cisco Reveals CCNA 200-301 Version 1.1 (April 2024)](https://www.certskills.com/ccna2024-01/); [lostintransit.se](https://lostintransit.se/2024/04/23/ccna-200-301-updated-to-version-1-1/)
- 1.1.e changed from "Controllers (Cisco DNA Center and WLC)" to "Controllers". DNA Center was renamed Catalyst Center. — [CBT Nuggets v1.1](https://www.cbtnuggets.com/blog/certifications/cisco/ccna-v1-1-200-301-exam); [ipcisco CCNA Minor Update](https://ipcisco.com/ccna-200-301-v1-1/)
- The old 6.4 "Compare traditional campus device management with Cisco DNA Center enabled device management" was removed. The new 6.4 is "Explain AI (generative and predictive) and machine learning in network operations". — [lostintransit.se](https://lostintransit.se/2024/04/23/ccna-200-301-updated-to-version-1-1/); [CBT Nuggets](https://www.cbtnuggets.com/blog/certifications/cisco/ccna-v1-1-200-301-exam)
- 2.8 changed from AP/WLC management access only to network device management access, including cloud-managed devices. — [CBT Nuggets](https://www.cbtnuggets.com/blog/certifications/cisco/ccna-v1-1-200-301-exam); [howtonetwork](https://www.howtonetwork.com/certifications/cisco-2/200-301-ccna-v1-1-what-you-need-to-know/)
- 2.5 now covers port states plus roles, and adds 2.5.d Root guard, loop guard, BPDU filter, and BPDU guard. — [CBT Nuggets](https://www.cbtnuggets.com/blog/certifications/cisco/ccna-v1-1-200-301-exam)
- 6.6 changed from v1.0 "Recognize the capabilities of configuration management mechanisms Puppet, Chef, and Ansible" to v1.1 "...such as Ansible and Terraform". — [Cisco v1.1 PDF](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf); [Pearson Appendix B](https://ptgmedia.pearsoncmg.com/imprint_downloads/cisco/bookreg/9780135792735/9780135792735_AppendixB_v1-1.pdf)
- Cisco's overall framing was more focus on cloud, automation and AI. — [CBT Nuggets](https://www.cbtnuggets.com/blog/certifications/cisco/ccna-v1-1-200-301-exam); [certificationkits "very minor" update](https://www.certificationkits.com/ccna-200-301-lab-suggestions/the-very-minor-cisco-200-301-exam-update-what-you-need-to-know/)
- v1.0 6.5 read "Describe characteristics of REST-based APIs (CRUD, HTTP verbs, and data encoding)". v1.1 adds "authentication types". (This comes from prior knowledge of both blueprints. The search did not surface explicit confirmation, but Cisco Press lists 6.5 as changed.) — [Pearson Appendix B](https://ptgmedia.pearsoncmg.com/imprint_downloads/cisco/bookreg/9780135792735/9780135792735_AppendixB_v1-1.pdf)

### Inferences
- 1.1.e and possibly 1.12 changed without appearing in Cisco Press's numbered change list, likely because they were treated as wording edits. The v1.0 1.12 read "Explain virtualization fundamentals (virtual machines)"; a training site still shows that older scope ([Skill Riser](https://skillriser.ae/courses/ccna-routing-and-switching/)).

### Gaps
- I could not confirm whether 2.9 and 5.5 wording also differs between v1.0 and v1.1.

## Exam logistics

### Takeaway
200-301 is a **120-minute** exam costing **US$300** (or Cisco Learning Credits), delivered by **Pearson VUE** at a test center or online-proctored. It is offered in **English and Japanese**. The certification is **valid 3 years**; recertify with **30 CE credits** or by passing a qualifying exam. Cisco does **not publish** the number of questions or the passing score. v2.0 keeps the same duration and price.

### Cited Findings
- 120 minutes; US$300 or Cisco Learning Credits; local currency plus tax via Pearson VUE. — [computingforgeeks cost/format](https://computingforgeeks.com/ccna-200-301-exam-cost-format/); [certsharp cost 2026](https://www.certsharp.com/blog/ccna-exam-cost-2026); [Cisco v2.0 topics page (120 min)](https://learningnetwork.cisco.com/s/ccna-v2-exam-topics)
- Languages: English and Japanese per most sources; one Cisco-linked page lists English only. — [certsharp guide](https://www.certsharp.com/blog/ccna-exam-guide-2026); [nhimg](https://nhimg.org/ccna-certification-guide)
- Valid 3 years; recertify via 30 CE credits or a qualifying exam. — [certsharp guide](https://www.certsharp.com/blog/ccna-exam-guide-2026); [divitrain](https://www.divitrain.com/blogs/it-certifications/cisco-ccna-exam-cost-2026-full-breakdown)
- Passing score: sources disagree. Some claim 800/1000, others say Cisco publishes no fixed passing score. — [computingforgeeks](https://computingforgeeks.com/ccna-exam-topics/); [achievable](https://achievable.me/exams/ccna/resources/ccna-exam-topics/)
- v2.0 reportedly keeps the same price and length. — [certramplearning](https://certramplearning.com/guides/ccna-200-301/)

### Inferences
- Question types are not re-verified this session. Cisco's exam-tutorial page historically lists: multiple choice single answer, multiple choice multiple answer, drag and drop, fill-in-the-blank, testlet, simlet and simulation. The platform's practice engine should support all of them. Community estimates put the exam at about 100–120 questions, but this is unofficial.

### Gaps
- I could not retrieve Cisco's official exam-tutorial page or the CCNA cert page to verify question types or the current language list.

## Official aligned courses and mapping to the blueprint

### Takeaway
Cisco Networking Academy's CCNA track is three courses: **CCNA: Introduction to Networks (ITN)**, **Switching, Routing, and Wireless Essentials (SRWE)**, and **Enterprise Networking, Security, and Automation (ENSA)**. These are "CCNA v7.x" courses with 17, 16 and 14 modules (ITN modules 1–17 confirmed). Cisco U / Cisco Learning Partners offer "Implementing and Administering Cisco Solutions (CCNA)". An authoritative module-to-objective mapping was not found.

### Cited Findings
- NetAcad course page: "CCNA: Introduction to Networks". — [netacad.com ITN](https://www.netacad.com/courses/ccna-introduction-networks)
- The ITN outline runs Module 1: Networking Today through Module 17, with checkpoint exams after groups of modules. — [Class Central ITN](https://www.classcentral.com/course/cisco-networking-academy-ccna-introduction-to-networks-534130)
- NETLAB+ lists CCNA v7 lab sets as CCNA1: Introduction to Networks, CCNA2 (SRWE) and CCNA3 (ENSA). — [NETLAB+ Cisco Academy lab libraries](https://www.netdevgroup.com/content/cnap/labs/)
- Example SRWE lab: "3.4.6 Lab – Configure VLANs and Trunking" (maps to 2.1/2.2). Example ITN lab: "10.4.4 Lab – Build a Switch and Router Network". These come from an unofficial site and need verification. — [examscisco.com](https://examscisco.com/)
- Cisco has made early v2.0 training available on Cisco U. — [SPOTO](https://cciedump.spoto.net/news/cisco-announces-ccna-v20-and-ai-integrated-ccie-updates-at-cisco-live-2026-las-vegas.html)

### Inferences (approximate mapping; not from a Cisco source)
- ITN maps to 1.x: network components, cabling, TCP/UDP, IPv4/IPv6 addressing and subnetting, switching concepts. It also covers basic device configuration and SSH (4.8, 5.3).
- SRWE maps to 2.x (VLANs, trunks, STP, EtherChannel, WLAN), 3.3 static routing, 3.5 FHRP, 4.6 DHCP, 5.7 Layer 2 security and 5.9/5.10 WLAN security.
- ENSA maps to 3.4 OSPFv2, 5.x (security concepts, ACLs, VPN/IPsec), 4.1 NAT, 1.2 WAN/topologies, 4.7 QoS, 4.4 SNMP, 4.5 syslog, 4.2 NTP, 1.12 virtualization and 6.x automation.

### Gaps
- No official Cisco ITN/SRWE/ENSA-to-blueprint matrix was found, and the current NetAcad version (7.x) was not confirmed. It is also unknown whether NetAcad has announced v2.0-aligned course updates.
- The Cisco U "Implementing and Administering Cisco Solutions (CCNA)" current version and its lesson list were not retrieved. The Cisco Press OCG v1.1 TOC cross-check was also not possible. The OCG v1.1 Appendix B/D pages on O'Reilly are relevant: [O'Reilly OCG appendix](https://www.oreilly.com/library/view/ccna-200-301-official/9780138229856/appb.xhtml).
