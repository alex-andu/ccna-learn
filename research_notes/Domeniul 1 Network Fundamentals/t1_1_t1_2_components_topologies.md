# CCNA 200-301 v1.1 — 1.1 Network components and 1.2 Topology architectures

Conventions used in these notes:
- **[src]** = backed by the cited source on the same line.
- **[std]** = standard, widely taught networking knowledge (OCG/Cisco docs level) that I did not re-fetch from a primary source in this session. It is safe for teaching but the writer should not attach a citation to it.
- **[verify]** = number or claim I could not confirm. Check it or leave it out.
- **[illustrative]** = sample CLI output I wrote to match standard IOS output format. It is not copied from a device. Tell the learner it is an example.

---

## Q0. Official v1.1 wording and exam depth (read first)

### Takeaway
The official v1.1 PDF text in the repo says **"1.1.e Controllers"** with no "(Cisco DNA Center and WLC)" in brackets. That bracket was v1.0 wording. It also says **"1.2.f On-premises and cloud"**, not "On-premise". Under v1.1, **PoE is 1.1.h**. Under v1.0 (Odom OCG 1st ed.) PoE was **1.3.c**. Every 1.1/1.2 objective uses the verbs "Explain role and function" or "Describe characteristics", so the exam tests concepts only, not configuration.

### Cited Findings
- v1.1 verbatim list: 1.1.a Routers, 1.1.b Layer 2 and Layer 3 switches, 1.1.c Next-generation firewalls and IPS, 1.1.d Access points, 1.1.e Controllers, 1.1.f Endpoints, 1.1.g Servers, 1.1.h PoE; 1.2.a Two-tier, 1.2.b Three-tier, 1.2.c Spine-leaf, 1.2.d WAN, 1.2.e SOHO, 1.2.f On-premises and cloud — [repo: user_provided_v11_official.md, from Cisco's v1.1 PDF](file:///home/user/ccna-learn/research_notes/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale/user_provided_v11_official.md)
- Odom OCG Vol 1 (1st ed., v1.0), Chapter 13 "LAN Architecture" covers 1.2.a (2-tier), 1.2.b (3-tier), 1.2.e (SOHO) and **1.3.c Concepts of PoE**. Its section headings are "Analyzing Campus LAN Topologies", "Small Office/Home Office" and "Power over Ethernet (PoE)" — [O'Reilly preview, OCG Vol 1 ch.13](https://www.oreilly.com/library/view/ccna-200-301-official/9780135262726/ch13.xhtml)
- OCG Vol 1 2nd ed. (v1.1) Chapter 2 "Fundamentals of Ethernet LANs" lists 1.2.e SOHO as an exam topic — [O'Reilly preview, OCG 2nd ed ch.2](https://www.oreilly.com/library/view/ccna-200-301-official/9780138229856/ch02.xhtml)
- Repo's earlier depth table: router, L2/L3 switch, NGFW/IPS, AP, WLC, endpoint, server and PoE are tested on "role, OSI layer, and where each sits in the topology". For spine-leaf, "every leaf connects to every spine; leaves never connect to each other; any leaf-to-leaf path has the same hop count" — [repo: topic_depth_commands.md](file:///home/user/ccna-learn/research_notes/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale/topic_depth_commands.md)

### Inferences
- The exam expects **recognition and comparison**. Typical items: "Which device makes forwarding decisions based on IP addresses?", "Which topology is optimized for east-west traffic?", "Which PoE standard delivers up to 30 W at the PSE?", "Which cloud service model gives control of the OS?". No configuration is tested for 1.1/1.2. Verification commands (show ip route, show mac address-table, show power inline, show cdp neighbors) are useful teaching aids and become exam material in 2.x/3.x.
- Content should name the controller as "Cisco Catalyst Center (formerly DNA Center)" and still teach "WLC", because v1.1 questions and older material use both names.

### Gaps
- I could not read the full Odom chapters (paywall) to quote their exact definitions. The Cisco Learning Network pages were not fetched.

---

## Q1. 1.1.a Routers

### Takeaway
A router is a **Layer 3** device. It connects **different IP networks/subnets**, including LAN to WAN. It forwards packets by **longest-prefix match** on the destination IP against its routing table. It does not forward broadcasts, so each router interface is its own broadcast domain.

### Cited Findings
- Devices that interconnect at layer 3 were traditionally called routers. Layer 3/multilayer switches also route — [Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)
- A "secure router" combines routing with integrated security functions — [Cisco: What is a Secure Router?](https://www.cisco.com/site/us/en/learn/topics/networking/what-is-secure-router.html) (search result only; page not fetched)

### Inferences / teaching content [std]
- **Problem it solved:** a single LAN (one broadcast domain) does not scale. Broadcasts flood everyone and you cannot join different link types (Ethernet to serial/WAN). Routers split networks into subnets and pick paths across interconnected networks (the Internet).
- **How it works internally:**
  1. A frame arrives. The router checks the destination MAC (its own, or a broadcast/multicast it accepts) and removes the L2 header.
  2. It reads the destination IP and looks it up in the **routing table (RIB)**. The most specific prefix wins (longest-prefix match). Ties between sources go to the lowest **administrative distance**, and within one protocol to the lowest **metric**.
  3. It decrements the TTL and recalculates the header checksum.
  4. It resolves the next-hop MAC through **ARP** (IPv4) or **NDP** (IPv6), builds a **new L2 frame** and sends it out the exit interface. MAC addresses change hop by hop. IP addresses stay the same, except with NAT.
- **CEF (Cisco Express Forwarding):** the control plane builds the RIB. CEF precomputes the **FIB** (a copy of the best routes optimized for lookup) and an **adjacency table** (prebuilt L2 rewrite headers from ARP). The data plane forwards using FIB plus adjacency, with no per-packet route lookup "process". Verify with `show ip cef`.
- **Planes:** control plane (routing protocols, ARP; builds tables), data plane (forwards packets), management plane (SSH, SNMP). This links to 6.x SDN.
- **Roles beyond forwarding:** WAN connectivity, NAT/PAT, DHCP server/relay, ACL filtering, VPN termination, QoS.
- **Cisco families (examples only):** ISR 1000/4000, Catalyst 8000 Edge (8200/8300/8500), ASR 1000. Older/PT models: 1841, 1941, 2901, 2911, ISR4331.
- **Exam traps:**
  - A router **breaks broadcast domains**, and every port is also its own collision domain. A switch breaks only collision domains.
  - The **IP** addresses stay the same along the path. The **MAC** addresses are rewritten at every router.
  - "Default gateway" = the router interface IP on the host's subnet.
  - Longest prefix beats lower AD. A /24 static route loses to a /25 OSPF route for an address inside the /25.
  - Gateway of last resort = default route 0.0.0.0/0.

### Sample output [illustrative]
```
R1# show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       O - OSPF, IA - OSPF inter area ...
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0
O        10.2.2.0/24 [110/2] via 10.1.12.2, 00:05:12, GigabitEthernet0/1
C        10.1.12.0/30 is directly connected, GigabitEthernet0/1
```
Teach the fields: code letter, prefix/length, [AD/metric], next hop, age, exit interface. "L" = the router's own interface address as a /32. Since IOS 15, a connected network produces both a C route and an L route.

### Gaps
- No primary Cisco page fetched on CEF internals in this session. The CEF/FIB/adjacency description is [std].

---

## Q2. 1.1.b Layer 2 and Layer 3 switches (evolution hub → bridge → switch → multilayer)

### Takeaway
An **L2 switch** forwards **Ethernet frames** by destination MAC, using a MAC address table that it learns from source MACs. It separates collision domains but floods broadcasts within a VLAN. An **L3 (multilayer) switch** adds IP routing between VLANs (SVIs, routed ports) at hardware speed, so it does both jobs.

### Cited Findings
- Hubs repeated each frame out every port except the one it arrived on, which reduced efficiency — [Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)
- 1983: Mark Kempf (DEC) invented the MAC bridge, and DEC released the two-port LANBridge 100. DEC licensed the patent royalty-free, which allowed IEEE standardization — [Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)
- Kalpana introduced the 7-port **EtherSwitch** in 1989/1990, the first multiport Ethernet switch. Switches learn addresses and forward only to the intended port — [Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)
- Layer-3/multilayer switches forward at layer 3 or higher as well as layer 2 — [Wikipedia: Network switch](https://en.wikipedia.org/wiki/Network_switch)

### Inferences / teaching content [std]
- **Evolution and the problem each step solved:**
  - **Hub (L1):** a multiport repeater. It forms one collision domain and runs half duplex with CSMA/CD. Collisions grow with the number of users.
  - **Bridge (L2, software, few ports):** splits a LAN into collision domains and learns MACs. It is slow (software).
  - **Switch (L2, ASIC hardware, many ports):** a "multiport bridge" in hardware. Each port is its own collision domain, full duplex removes collisions, and microsegmentation gives each host a dedicated link. It is still one broadcast domain per VLAN.
  - **Multilayer switch (L3):** routing between VLANs used to need a router ("router-on-a-stick"), which became a bottleneck. The L3 switch routes in hardware at wire speed. Today, distribution and core layers use L3 switches.
- **L2 switch logic (the 3 actions):**
  - **Learn:** record the source MAC with the incoming port and VLAN in the MAC table (aka CAM table). Default aging is 300 s.
  - **Forward/filter:** for a known unicast destination, send out that port only. If the destination is on the same port it arrived on, drop (filter).
  - **Flood:** send unknown unicast, broadcast (FFFF.FFFF.FFFF) and multicast (without IGMP snooping) out all ports in the VLAN except the incoming one.
- **Tables / hardware:**
  - **CAM** (Content Addressable Memory): exact-match lookups such as MAC → port.
  - **TCAM** (Ternary CAM; values 0/1/"don't care"): lookups with masks, such as longest-prefix FIB routes, ACLs and QoS. Lookups take one clock cycle in hardware. Mention TCAM only at a high level; it is "beyond CCNA" detail.
  - The L3 switch also holds a FIB/adjacency table (CEF in hardware).
- **L3 switch features:** SVI (`interface vlan 10` + IP = default gateway for VLAN 10), routed port (`no switchport`), `ip routing` needed to enable routing.
- **Switching methods (sometimes asked):** store-and-forward (default, checks the FCS), cut-through, fragment-free. [std]
- **Cisco families (examples):** Catalyst 9200 (access), 9300 (access/stackable), 9400 (modular access), 9500/9600 (core/distribution), Nexus 9000 (data center). In PT: 2960 (L2), 3560/3650 (L3).
- **Exam traps:**
  - A switch does **not** separate broadcast domains; VLANs do. A router or L3 switch separates them.
  - The switch learns from the **source** MAC and forwards on the **destination** MAC.
  - Unknown unicast is **flooded**, not dropped.
  - An L2 switch still has an IP address (management SVI), but that does **not** make it a router.
  - L3 switches need `ip routing`, which is off by default on many models. [verify per platform]
  - "Multilayer switch" = "Layer 3 switch".

### Sample output [illustrative]
```
SW1# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
 All    0100.0ccc.cccc    STATIC      CPU
  10    0050.7966.6801    DYNAMIC     Gi1/0/1
  10    0050.7966.6802    DYNAMIC     Gi1/0/2
  20    00d0.ba12.3c45    DYNAMIC     Gi1/0/24
Total Mac Addresses for this criterion: 4
```
Related commands: `show mac address-table dynamic`, `show mac address-table aging-time`, `clear mac address-table dynamic`, `show interfaces status`, `show ip interface brief`, `show ip route` (on an L3 switch).

### Gaps
- I did not fetch a primary Cisco document on CAM/TCAM. Keep the TCAM explanation high level.

---

## Q3. 1.1.c Next-generation firewalls and IPS

### Takeaway
A **traditional stateful firewall** filters on the 5-tuple (source/destination IP, source/destination port, protocol) and tracks connection state. Return traffic for sessions started inside is allowed automatically. An **NGFW** keeps that and adds **application-layer awareness**: AVC (application visibility and control), integrated IPS, malware protection (AMP / Malware Defense), URL filtering, user identity, TLS decryption, and threat intelligence (Cisco **Talos**). An **IPS** sits **inline** and can drop malicious traffic. An **IDS** gets a **copy** of traffic (promiscuous, through SPAN/TAP) and can only alert.

### Cited Findings
- Cisco definition: an NGFW "combines traditional stateful firewall functions" with application awareness, built-in intrusion prevention, advanced threat detection and user identity awareness. A traditional firewall filters on the 5-tuple and connection state; "What sets it apart is inspection at the application layer." — [Cisco: NGFW vs traditional firewall](https://www.cisco.com/site/us/en/learn/topics/security/what-is-a-next-generation-firewall.html)
- NGFW capabilities listed by Cisco: application control (risky apps, not only ports), integrated intrusion prevention, advanced malware protection (file behavior), user/identity awareness, TLS/SSL decryption, threat intelligence integration — [Cisco: NGFW vs traditional firewall](https://www.cisco.com/site/us/en/learn/topics/security/what-is-a-next-generation-firewall.html)
- Cisco Firepower NGIPS is built on **Snort** (open-source IPS). It uses vulnerability- and anomaly-based inspection and can run **inline** with Fail-To-Wire/Bypass modules — [Cisco Firepower NGIPS data sheet](https://www.cisco.com/c/en/us/products/collateral/security/ngips/datasheet-c78-742472.html)
- **Talos** "collects and correlates threats in real time". It feeds IPS rules and IP/URL/DNS intelligence ("Security Intelligence"), which updates automatically — [Cisco NGIPS data sheet](https://www.cisco.com/c/en/us/products/collateral/security/ngips/datasheet-c78-742472.html)
- **AVC**: "granular control of application usage and user access to more than 4000 commercial applications", plus OpenAppID for custom apps. **URL filtering**: optional license, "over 80 categories". **AMP/Malware Defense**: "detection, blocking, tracking, analysis, and containment" of malware, with AMP Threat Grid sandboxing — [Cisco NGIPS data sheet](https://www.cisco.com/c/en/us/products/collateral/security/ngips/datasheet-c78-742472.html)
- Current product naming: Cisco Secure Firewall Threat Defense (FTD, formerly Firepower NGFW), plus a virtual version (FTDv/NGFWv) — [Cisco Secure Firewall Threat Defense Virtual data sheet](https://www.cisco.com/c/en/us/products/collateral/security/firepower-ngfw-virtual/datasheet-c78-742858.html) (title from search result)

### Inferences / teaching content [std]
- **Evolution:** packet filter (stateless ACL; L3/L4, per packet) → **stateful firewall** (session table; e.g. Cisco PIX → ASA) → **NGFW** (L7 apps, users, IPS, malware, URL; Firepower/FTD). Web 2.0 drove the change: everything runs over TCP 443, so port-based rules cannot tell Facebook chat from banking.
- **Zones:** inside (trusted), outside (untrusted), **DMZ** for public servers. Default policy: traffic from inside to outside is allowed with return traffic tracked, and traffic from outside to inside is denied unless a rule permits it.
- **IDS vs IPS:**

| | IDS | IPS |
|---|---|---|
| Placement | out-of-band, **promiscuous** (copy via SPAN/TAP) | **inline** (traffic passes through it) |
| Action | alert/log only (may send TCP reset) | drop/block in real time |
| Latency impact | none | some; device failure can cut traffic unless fail-open/bypass |
| Detection | signatures (known patterns), anomaly/behavior, reputation | same |

- **Signature-based** detection catches known attacks and needs updates (Talos). **Anomaly-based** detection compares traffic against a baseline, catches zero-days, and produces more false positives.
- NGFW vs NGIPS: an NGIPS adds context (host OS, apps, users, vulnerability relevance) to IPS. An NGFW today includes NGIPS.
- **Exam traps:**
  - IDS = passive (a copy of the traffic). IPS = inline and can block.
  - A stateful firewall allows return traffic automatically. An ACL on a router is **stateless**.
  - An NGFW still does stateful filtering. It is a superset, not a replacement.
  - AVC = application identification beyond port numbers.
  - "Talos" = Cisco's threat intelligence group.
  - Firewalls are often depicted between the network edge and the Internet, and in front of a DMZ.

### Gaps
- Passive (IDS-mode) deployment of Firepower was not described in the fetched data sheet. IDS/IPS placement is [std].

---

## Q4. 1.1.d Access points and 1.1.e Controllers (WLC, Catalyst Center)

### Takeaway
An **AP** bridges 802.11 wireless clients onto the wired Ethernet LAN, at L2/L1. The evolution runs from **autonomous APs**, each configured separately, to **lightweight APs + a WLC**: the APs tunnel traffic to the WLC over **CAPWAP** (split-MAC). Then come cloud-managed APs (Meraki) and **Cisco Catalyst Center** (formerly **DNA Center**). Catalyst Center is the enterprise **SDN/intent-based network controller** for the whole wired and wireless network, not only Wi-Fi. A WLC manages APs/WLANs. Catalyst Center manages and automates the whole network, including WLCs, and adds assurance/analytics. Cisco announced the rename **DNA Center → Catalyst Center** in 2023. Older API versions keep the old name.

### Cited Findings
- DevNet blog, 13 Nov 2023: "Cisco DNA Center is not only getting a name change to Cisco Catalyst Center"; "Older versions of the API will still be named and referenced as Cisco DNA Center"; "new and upcoming versions will reflect the new name, Cisco Catalyst Center." — [Cisco DevNet blog](https://blogs.cisco.com/developer/cisco-dna-center-has-a-new-name-and-new-features)
- Cisco publishes a "Cisco Catalyst Center 2.3.7" data sheet under the old dna-center URL path, so the rename took effect around release 2.3.7 (2023) — [Cisco Catalyst Center 2.3.7 data sheet (JP)](https://www.cisco.com/c/ja_jp/products/collateral/cloud-systems-management/dna-center/nb-06-dna-center-data-sheet-cte-en.html); [The Network DNA: Updates in Cisco DNA Center 2.3.7.0 (Aug 2023)](https://www.thenetworkdna.com/2023/08/updates-in-cisco-dna-center-2370.html) (search titles only). Exact first release under the new name: [verify]. Commonly reported as announced at Cisco Live June 2023 [verify].
- Cisco's switching portfolio page now describes "Cisco Catalyst, Cisco Meraki, and Cisco Nexus switches with Cisco Catalyst Center controller" — [Cisco switches](https://www.cisco.com/c/en/us/products/switches.html) (search result title)
- Repo notes: SD-Access uses Catalyst Center + ISE. Its control plane is LISP, its data plane VXLAN, and its policy SGT. Northbound API = REST to apps; southbound = NETCONF/RESTCONF/CLI/SNMP to devices — [repo: topic_depth_commands.md](file:///home/user/ccna-learn/research_notes/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale/topic_depth_commands.md)

### Inferences / teaching content [std]
- **AP basics:** an AP is an L2 bridge between 802.11 and 802.3. It typically connects to an access switch port and is often powered by **PoE**. One AP can advertise several SSIDs, each mapped to a VLAN. Cross-link to the 1.11 pilot (already written) and 2.6/2.7 (AP modes, CAPWAP, WLC).
- **Autonomous AP:** has its own config/IOS and maps SSID↔VLAN locally, which means a trunk to the AP. It does not scale. Imagine 500 APs configured one by one, with no coordinated RF management or roaming.
- **Lightweight AP + WLC (split-MAC):** the AP handles real-time 802.11 functions (beacons, ACKs, encryption). The WLC handles management, authentication, RRM (channel/power), roaming and policy. **CAPWAP** runs over UDP **5246 (control, DTLS-encrypted)** and **5247 (data)**. A Local-mode AP tunnels client data to the WLC, so its switch port is an **access** port. **FlexConnect** switches traffic locally at a branch.
- **WLC deployment types (relevant for 2.6/2.7):** centralized/unified (appliance, e.g. Catalyst 9800-40/80), cloud (9800-CL), embedded (on a Catalyst 9300 switch), Mobility Express / EWC (on the AP itself). Names: [verify current lineup].
- **Catalyst Center (DNA Center):** an appliance/VM that acts as SDN controller for campus/branch, intent-based networking (IBN). Main workflows: **Design** (sites, IP pools), **Policy**, **Provision** (zero-touch, SWIM image management), **Assurance** (health scores, AI analytics, path trace). It exposes REST APIs (northbound) and talks to devices through southbound protocols. It is "controller-based networking" (6.1/6.2).
- **WLC vs Catalyst Center:**

| | WLC | Catalyst Center |
|---|---|---|
| Scope | APs and WLANs (wireless) | whole enterprise network: switches, routers, WLCs/APs |
| Data plane? | yes in Local mode (CAPWAP tunnels pass through it) | **no**, management/control only; traffic never passes through it |
| Main role | AP config, RRM, roaming, client auth | automation, policy (SD-Access), assurance, APIs |

- **Exam traps:**
  - A lightweight AP **cannot work without a WLC**.
  - Local-mode AP port = **access** port. Autonomous AP or FlexConnect with multiple VLANs = **trunk**.
  - CAPWAP control traffic is encrypted. Data traffic is encrypted only if DTLS data encryption is enabled. [std; verify]
  - DNA Center = Catalyst Center (the same product).
  - Catalyst Center does **not** forward user traffic.
  - "Controller" in v1.1 1.1.e is generic: WLC, Catalyst Center, and SDN controllers in general.

### Gaps
- I could not fetch the official Catalyst Center data sheet text to quote feature lists. Exact rename timing beyond the Nov 2023 DevNet blog is unconfirmed.

---

## Q5. 1.1.f Endpoints and 1.1.g Servers

### Takeaway
**Endpoints** are the devices that originate or consume data at the edge: PCs, laptops, phones, IP phones, printers, IP cameras, IoT sensors. **Servers** provide services to clients (web, DNS, DHCP, file, email, AAA). In the client-server model the same machine can be both. A server is defined by its role, not its hardware.

### Cited Findings
- No dedicated primary source fetched for these definitions. These sub-objectives are conceptual and the content below is [std].

### Inferences / teaching content [std]
- **Endpoint:** has a NIC with a MAC, an IP, a mask, a default gateway and DNS. It works at all layers (L1–L7), because it runs applications. Endpoints are the main attack surface (malware, phishing). Endpoint security (antivirus/EPP/EDR, posture via ISE) links to 5.x. Related Cisco page (search result only): [Cisco: EPP explained](https://www.cisco.com/site/us/en/learn/topics/security/what-is-an-endpoint-protection-platform.html).
- **IoT/OT endpoints** are often powered by PoE.
- **Servers:** physical (rack, blade), virtual (VMs on a hypervisor), and containers. They sit in the data center or cloud, often with redundant NICs (NIC teaming to two switches). Common services and ports: HTTP 80/HTTPS 443, DNS 53, DHCP 67/68, SSH 22, FTP 20/21, TFTP 69, SNMP 161/162, Syslog 514, NTP 123 (these link to 4.x).
- **Client-server vs peer-to-peer:** contrast the two.
- **Exam traps:**
  - A server is a **role**. A PC running a web server is a server for that service.
  - Endpoints need a default gateway to leave their subnet.
  - Servers usually get **static** IPs or DHCP reservations.
  - Public-facing servers go in the **DMZ**.

### Gaps
- None critical.

---

## Q6. 1.1.h PoE — standards, numbers, detection/classification, negotiation

### Takeaway
PoE delivers DC power and data over the same twisted-pair cable from a **PSE** (Power Sourcing Equipment: a PoE switch or midspan injector) to a **PD** (Powered Device: AP, IP phone, camera). Power at the PD is **lower** than at the PSE because of cable loss over up to 100 m.

| Type | IEEE | Common name | Classes | Pairs | Max at PSE | Min guaranteed at PD |
|---|---|---|---|---|---|---|
| 1 | 802.3af (2003) | PoE | 0–3 | 2 | **15.4 W** | **12.95 W** |
| 2 | 802.3at (2009) | PoE+ | 0–4 | 2 | **30 W** | **25.5 W** |
| 3 | 802.3bt (2018) | PoE++ / 4PPoE | 5–6 (and 1–4 over 4 pairs) | 4 | **60 W** | **51 W** |
| 4 | 802.3bt (2018) | PoE++ / 4PPoE | 7–8 | 4 | **90 W** | **71–71.3 W** |
| — | Cisco UPOE (2011, proprietary) | — | — | 4 | 60 W | 51 W (Cisco text also says 54.4 W) |
| — | Cisco UPOE+ | = 802.3bt Type 4 + UPOE compatibility | — | 4 | 90 W | 71.3 W |

### Cited Findings
- Cisco Table 1: Type 1 / classes 0–3 / 2 pairs / 802.3af / 15.4 W PSE / 12.95 W PD; Type 2 / class 4 / 2 pairs / 802.3at / 30 W / 25.5 W; Cisco UPOE / 4 pairs / 60 W / 51 W; Type 3 / classes 5,6 / 4 pairs / 802.3bt / 60 W / 51 W; Type 4 / classes 7,8 / 4 pairs / 802.3bt / 90 W / 71 W — [Cisco UPOE+ white paper](https://www.cisco.com/content/en/us/solutions/collateral/enterprise-networks/nb-06-upoe-plus-it-ot-wp-cte-en.html)
- The same Cisco paper is internally inconsistent. Its UPOE prose says "54.4 watts to the PDs" while Table 1 says 51 W, and its bt prose gives a PD range of 40–73 W while the table says 71 W — [Cisco UPOE+ white paper](https://www.cisco.com/content/en/us/solutions/collateral/enterprise-networks/nb-06-upoe-plus-it-ot-wp-cte-en.html). **Recommendation:** teach 51 W (UPOE) and 71.3 W (Type 4, IEEE class 8) to match the exam-standard tables.
- Cisco introduced **UPOE in 2011** (up to 60 W over Cat5e or better). **UPOE+** "combines the new IEEE 802.3bt standard and Cisco UPOE". UPOE+ switches are fully 802.3bt compliant and also support af/at/UPOE. Catalyst 9300 and 9400 offer 90 W models. A UPOE line card needs `hw-module slot#/switch# upoe-plus` to act as Type 3 compliant — [Cisco UPOE+ white paper](https://www.cisco.com/content/en/us/solutions/collateral/enterprise-networks/nb-06-upoe-plus-it-ot-wp-cte-en.html)
- PSE voltage: Type 1 44–57 V; Type 2 and 3 50–57 V; Type 4 52–57 V. Types 1/2 use 2 pairs only; Types 3/4 can use 4 pairs. Year of 802.3af = 2003, 802.3at = 2009. 802.3bt standardized 8 classes — [Microchip Developer Help: PoE standards](https://developerhelp.microchip.com/xwiki/bin/view/applications/ethernet/poe/standards/)
- Classification events: max 2 (Type 2), 4 (Type 3), 5 (Type 4). Data-link-layer (LLDP) classification is optional for Type 1, mandatory for single-event Type 2 PDs, and required for Type 3/4 — [Microchip Developer Help](https://developerhelp.microchip.com/xwiki/bin/view/applications/ethernet/poe/standards/)
- 802.3bt-2018 introduced Types 3 and 4, and was folded into IEEE 802.3-2022 — [Wikipedia: Power over Ethernet](https://en.wikipedia.org/wiki/Power_over_Ethernet)
- **Detection:** the PSE applies a low voltage and looks for a **25 kΩ** signature resistor in the PD. It accepts 19–26.5 kΩ. **Classification:** at 14.5–20.5 V the PSE measures the classification current that tells it the PD's class. Only then does it apply full voltage — [Wikipedia: PoE](https://en.wikipedia.org/wiki/Power_over_Ethernet)
- Class table (PD power / PSE max): 0: 0.44–12.94 / 15.4; 1: 0.44–3.84 / 4.0; 2: 3.84–6.49 / 7.0; 3: 6.49–12.95 / 15.4; 4: 12.95–25.5 / 30; 5: 40 / 45; 6: 51 / 60; 7: 62 / 75; 8: 71.3 / 90 — [Wikipedia: PoE](https://en.wikipedia.org/wiki/Power_over_Ethernet)
- **LLDP** carries Power-via-MDI TLVs so the PSE and PD can negotiate power in **0.1 W** steps. Cisco's pre-standard scheme added a power value to **CDP**, and CDP also tells the phone its voice VLAN. Cisco's pre-standard ("Cisco inline power") gave up to about 10 W per port — [Wikipedia: PoE](https://en.wikipedia.org/wiki/Power_over_Ethernet). Year of Cisco pre-standard inline power (~2000): [verify]
- Packet Tracer: an IP phone (7960) can be powered by the "IP_PHONE_POWER_ADAPTER" or by PoE. PoE works "only with 3560 multilayer switch", using `power inline auto` on the port — [PacketTracerNetwork: VoIP devices](https://www.packettracernetwork.com/tutorials/voip-devices.html). Cisco Community: the default 2960 in PT has no PoE. Multilayer models (3560, 3650/3650PS) do, and replies disagree on exact models — [Cisco Community: Packet Tracer switch PoE](https://community.cisco.com/t5/network-management/packet-tracer-switch-poe/td-p/4586993)

### Inferences / teaching content
- **Why PoE exists:** APs, phones and cameras are mounted where there are no power outlets (ceilings, poles). One cable means less wiring, and the device can be backed by the switch's UPS. Power can be centrally controlled (reboot an AP by turning off the port, `power inline never` then `auto`). Newer uses: IoT lighting, digital building, small PCs (bt).
- **Process in order (teach as an animation):**
  1. **Detection**: low voltage, check for the 25 kΩ signature. Devices without PoE are never powered, so plugging in a normal PC is safe.
  2. **Classification**: the PD's class tells the PSE how much to reserve.
  3. **Power-up**: full voltage.
  4. **Optional L2 negotiation** through **CDP or LLDP-MED** for finer allocation.
  5. **Maintain Power Signature (MPS)**: power is removed when the PD disconnects [std].
- **Power budget [std]:** the switch power supply sets a total PoE budget, for example a switch with a 740 W PoE budget. The switch reserves power per port by class, or by negotiated value. A port is denied power when the budget runs out. `show power inline` shows Available/Used/Remaining. Example calculation for the app: 24 APs × 30 W = 720 W, which does not fit a 370 W budget.
- **Midspan injector vs endspan:** an endspan PSE is the PoE switch itself. A midspan sits between a non-PoE switch and the PD (a PoE injector, single port).
- **Pairs [std]:** 10/100BASE-T uses pairs 1-2 and 3-6. Mode A sends power over the data pairs. Mode B uses the spare pairs 4-5 and 7-8. 4PPoE (bt/UPOE) uses all four pairs.
- **Interface commands [std]:** `power inline auto` (default; detect/classify), `power inline never` (disable), `power inline static [max mW]` (pre-reserve), `power inline police` (shut or log if the PD exceeds its allocation).
- **Exam traps:**
  - PSE value ≠ PD value. "PoE+ = 30 W" is at the PSE; the PD gets 25.5 W.
  - af = PoE (15.4 W), at = PoE+ (30 W), bt = PoE++ / 4PPoE (60/90 W). Remember a-f, a-t, b-t in alphabetical order.
  - UPOE is Cisco proprietary (60 W). UPOE+ = 90 W, bt compliant.
  - Power is negotiated through **CDP/LLDP**, not DHCP.
  - The switch is the PSE and the phone/AP is the PD; learners often swap them.
  - Distance limit stays 100 m.

### Sample output [illustrative]
```
SW1# show power inline
Module   Available     Used     Remaining
          (Watts)     (Watts)    (Watts)
------   ---------   --------   ---------
1           740.0       45.4       694.6
Interface Admin  Oper       Power   Device              Class Max
                            (Watts)
--------- ------ ---------- ------- ------------------- ----- ----
Gi1/0/1   auto   on         15.4    IP Phone 8865       4     30.0
Gi1/0/2   auto   on         30.0    C9120AXI-E          4     30.0
Gi1/0/3   auto   off        0.0     n/a                 n/a   30.0
Gi1/0/4   never  off        0.0     n/a                 n/a   30.0
```

```
SW1# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R1               Gig 1/0/24        151            R B S I  ISR4331   Gig 0/0/1
SEP00A1B2C3D4E5  Gig 1/0/1         143            H P M    IP Phone  Port 1
AP-Floor2        Gig 1/0/2         128            T B I    C9120AXI- Gig 0
```
Also `show cdp neighbors detail` (shows IP, IOS version, power request/available on PoE ports [verify exact lines]) and `show lldp neighbors`.

### Gaps
- Exact year of Cisco pre-standard inline power not found.
- The PT command set for `show power inline` is unconfirmed. Test in PT 8.2 before writing the lab.

---

## Q7. 1.2.a Two-tier, 1.2.b Three-tier, 1.2.c Spine-leaf

### Takeaway
Campus LANs use a hierarchical design:
- **Access** layer: endpoints connect here (PoE, port security, VLANs).
- **Distribution** layer: aggregates the access switches, forms the L2/L3 boundary, applies policy and redundancy.
- **Core** layer: fast transport between distribution blocks, with no policy.

**Two-tier (collapsed core)** merges core and distribution, for small and medium sites. **Three-tier** adds a separate core when there are many distribution blocks or buildings. **Data centers** moved to **spine-leaf (Clos)**. Every leaf connects to every spine, and leaf and spine never connect within their own layer. L3 links with **ECMP** give equal-cost paths, a predictable hop count and easy scale-out for **east-west** server-to-server traffic.

### Cited Findings
- Spine "is the backbone of the network and is responsible for interconnecting all leaf switches". "Every leaf layer switch is connected to each of the spine layer switches in a full-mesh topology" — [Cisco MSDC fabric white paper](https://cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html)
- Leaf and spine connect "with Layer 3 IP connectivity to provide Equal-Cost Multi-Path (ECMP) routing for both east-west server-to-server traffic and south-north server-to-user traffic". "Each path has equal performance" — [Cisco MSDC white paper](https://cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html)
- Scale by adding spines. "The oversubscription ratio of each pod is easily controlled by the number of spine switches". Example leaf oversubscription **1.5:1 (48×25G : 8×100G)**. AI rail-optimized fabrics use 1:1 ("non-blocking") — [Cisco MSDC white paper](https://cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html)
- Repo note: "every leaf connects to every spine and leaves never connect to each other; any leaf-to-leaf path has the same hop count" — [repo: topic_depth_commands.md](file:///home/user/ccna-learn/research_notes/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale/topic_depth_commands.md)
- Related Cisco designs: ACI multi-tier, VXLAN BGP EVPN fabrics — [Cisco ACI Multi-tier WP](https://www.cisco.com/c/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/white-paper-c11-742214.html); [Cisco Nexus 9000 VXLAN BGP EVPN guide](https://www.cisco.com/c/en/us/td/docs/dcn/whitepapers/cisco-vxlan-bgp-evpn-design-and-implementation-guide.html) (search titles; beyond CCNA)

### Inferences / teaching content [std]
- **Layer roles:**

| Layer | Connects | Typical functions | Device |
|---|---|---|---|
| Access | endpoints, APs, phones | PoE, VLAN assignment, port security, 802.1X, QoS marking, STP edge (PortFast/BPDU Guard) | L2 switch (C9200/9300) |
| Distribution | access switches (uplinks) | aggregation, **L2/L3 boundary** (SVIs/default gateways, FHRP), routing, ACL/QoS policy, route summarization | L3 switch (C9300/9400/9500) |
| Core | distribution blocks | high-speed, highly available L3 transport; **no** CPU-heavy policy; fast convergence | L3 switch (C9500/9600) |

- **Two-tier / collapsed core:** access + combined "core/distribution". Its weakness is scale. With N distribution pairs fully meshed, links grow as roughly N² (the Odom-style argument). That growth is the reason to add a core layer. Cisco's guidance is often summarized as "consider a core once you have about 3 or more distribution blocks or buildings" [verify wording].
- **Three-tier:** access → distribution → core. Distribution pairs connect only to the core, so links grow linearly.
- **Physical topology terms (Odom):** star (access switches homed to distribution), full mesh, partial mesh, hybrid. Dual-homing each access switch to two distribution switches gives redundancy.
- **Oversubscription:** total access-port bandwidth ÷ uplink bandwidth. Example: 48×1G down / 2×10G up = 48/20 = 2.4:1. Campus guidance is often cited as about 20:1 access→distribution and 4:1 distribution→core [verify]. Not every host transmits at once, so this is acceptable.
- **North-south vs east-west:** north-south = client ↔ data center/Internet. It dominated the classic 3-tier design (access/aggregation/core in the DC). East-west = server ↔ server: virtualization, microservices, storage replication, now AI training.
- **Why spine-leaf replaced 3-tier in data centers:**
  1. In the classic 3-tier DC, the L2 domain relied on **STP**, which **blocks redundant links** and wastes half the bandwidth. Spine-leaf with L3 + ECMP uses all links.
  2. In 3-tier, east-west paths had variable hop counts and latency. In spine-leaf, every leaf↔leaf path is **leaf → spine → leaf**, which is predictable.
  3. Scale-out: add spines for more bandwidth, add leaves for more ports.
  4. A spine failure only reduces capacity by 1/N.
- Leaves connect to servers, storage, firewalls, load balancers, and border leaves to the WAN/Internet. Spines connect only to leaves.
- Cisco products (examples): Nexus 9000 (ACI or NX-OS VXLAN EVPN). VXLAN/EVPN overlays are beyond CCNA (ENCOR/DCCOR).
- **Exam traps:**
  - Spine-leaf: **leaf ↔ leaf** and **spine ↔ spine** links do NOT exist (except special cases beyond CCNA).
  - Endpoints and servers connect to **leaves**, never to spines.
  - Collapsed core = two-tier.
  - The distribution layer is the usual L2/L3 boundary.
  - The core should do **no** packet manipulation or policy.
  - Spine-leaf is for **data centers**. Two- and three-tier are for **campus**.

### Gaps
- Did not fetch Cisco Campus LAN design guide text for exact oversubscription ratios or the "when to add a core" rule. Marked [verify].

---

## Q8. 1.2.d WAN topologies, 1.2.e SOHO, 1.2.f On-premises and cloud

### Takeaway
WANs connect sites across distance, usually over a service provider. CCNA-level topologies: **point-to-point** (leased line), **hub-and-spoke**, **full mesh**, **partial mesh**, and **single- vs dual-homed** (single/dual connection, single/dual ISP: single-homed, dual-homed, multihomed, dual-multihomed). Services: **MPLS L3VPN**, **Metro Ethernet** (E-Line, E-LAN, E-Tree), **Internet VPN** (site-to-site IPsec, remote-access), and broadband (DSL, cable, fiber, 4G/5G) as transport. SD-WAN is "beyond CCNA" at concept level. **SOHO** = one all-in-one device (router + switch + AP + firewall/NAT + DHCP + modem). **Cloud** per NIST SP 800-145 has 5 essential characteristics, 3 service models and 4 deployment models.

### Cited Findings
- NIST SP 800-145 (Sept 2011) essential characteristics: "On-demand self-service", "Broad network access", "Resource pooling", "Rapid elasticity", "Measured service" — [NIST SP 800-145](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf)
- Service models: **SaaS**: the consumer uses the provider's applications and does not manage infrastructure. **PaaS**: the consumer deploys its own or acquired apps using provider tools and controls the apps and hosting settings. **IaaS**: the consumer provisions compute/storage/network, runs arbitrary software including OSes, and controls OS and storage — [NIST SP 800-145](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf)
- Deployment models: Private, Community, Public, Hybrid (two or more distinct clouds bound together, with data/application portability) — [NIST SP 800-145](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf)
- SOHO is a named v1.1 exam topic (1.2.e) in OCG 2nd ed ch.2, and OCG 1st ed ch.13 has a section "Small Office/Home Office" — [O'Reilly OCG 2nd ed ch.2](https://www.oreilly.com/library/view/ccna-200-301-official/9780138229856/ch02.xhtml); [O'Reilly OCG 1st ed ch.13](https://www.oreilly.com/library/view/ccna-200-301-official/9780135262726/ch13.xhtml)

### Inferences / teaching content [std]
- **WAN topologies:**

| Topology | Description | Pros | Cons |
|---|---|---|---|
| Point-to-point | 2 sites, dedicated link (leased line, P2P Metro E E-Line) | simple, private | cost scales with sites |
| Hub-and-spoke | branches connect to HQ/DC hub; spoke↔spoke traffic goes through the hub | cheap, central policy | hub = single point of failure and bottleneck; extra latency spoke↔spoke |
| Full mesh | every site connected to every site, n(n−1)/2 links | optimal paths, redundancy | expensive, complex |
| Partial mesh | only important sites meshed | balance | design effort |

- **Connectivity redundancy (Odom/Cisco terms):** **single-homed** (1 link, 1 ISP), **dual-homed** (2 links, same ISP), **multihomed** (1 link each to 2 ISPs), **dual-multihomed** (2 links to each of 2 ISPs). [std; verify the exact Odom phrasing]
- **Private WAN:**
  - **Leased line** (serial, HDLC/PPP; legacy).
  - **MPLS** L3VPN: the provider routes customer traffic using labels. CE/PE/P router roles. CE–PE routing uses static/BGP/OSPF/EIGRP. Any-to-any connectivity, QoS available.
  - **Metro Ethernet**: Ethernet handoff to customer, MEF services **E-Line** (point-to-point), **E-LAN** (any-to-any multipoint), **E-Tree** (hub-and-spoke rooted multipoint).
- **Internet/public WAN:**
  - **Site-to-site VPN** (IPsec, optionally GRE over IPsec, DMVPN). Remote-access VPN uses an IPsec or TLS client (Cisco Secure Client/AnyConnect).
  - **Access technologies:** DSL (phone line, DSLAM), cable (DOCSIS, CMTS), fiber (FTTH/GPON), 4G/5G, satellite.
- **SD-WAN:** concept only, beyond CCNA for v1.1. It is controller-based overlay over multiple transports (MPLS + Internet + LTE) with application-aware path selection.
- **SOHO:**
  - Usually one consumer "wireless router" combining a router (WAN port, NAT/PAT, DHCP server, DNS proxy), a small 4-port switch, a Wi-Fi AP, a stateful firewall and sometimes a DSL/cable/fiber modem (ONT).
  - Public IP from the ISP on the WAN side, private 192.168.x.0/24 on the LAN.
  - The exam point: one device = many logical functions.
  - Cisco examples: ISR 1000 (small branch), Meraki MX/Z. Consumer brands for illustration.
  - Links: the repo already has "wifi6-router-back.jpg" (TP-Link AX1500), usable for SOHO.
- **On-premises vs cloud:**

| | On-prem | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Customer manages | everything (facility → app) | OS, middleware, runtime, data, apps | apps + data | only data/config/users |
| Provider manages | — | physical, virtualization, network, storage | + OS, runtime | entire stack |
| Example | own DC / server room | AWS EC2, Azure VMs | Azure App Service, Google App Engine | Microsoft 365, Webex, Salesforce |

- **Connecting to the cloud:** over the Internet (with or without VPN), or a private WAN / dedicated interconnect such as AWS Direct Connect or Azure ExpressRoute, or an intercloud exchange. The "public cloud through Internet = less security, no QoS" point is classic Odom.
- **Virtualization context:** hypervisor type 1 (bare metal) vs type 2 (hosted), virtual switch, VM. This also appears in 1.12 (virtualization fundamentals), so cross-link it.
- **Trade-offs:** CapEx (on-prem) vs OpEx (cloud). Elasticity. Data sovereignty/compliance: GDPR in the EU, relevant for a Romanian learner. Latency.
- **Exam traps:**
  - IaaS is the only model where **you manage the OS**.
  - SaaS = you manage nothing of the infrastructure.
  - Private cloud does **not** have to be on-prem; it can be hosted.
  - Hybrid = private + public (≥2 clouds).
  - NIST has 4 deployment models including Community. The exam may list only 3.
  - Hub-and-spoke: spoke-to-spoke traffic passes through the hub.
  - A full mesh with n sites needs n(n−1)/2 links (5 sites → 10).
  - MPLS is a provider-network technology. The customer sees only CE–PE routing.

### Gaps
- No primary MEF or Cisco WAN design doc fetched in this session. WAN content is [std].
- Exact Odom wording for single/dual-homed variants was not verified.

---

## Q9. Packet Tracer lab ideas and limits

### Takeaway
PT is fine for components and topologies: build two-tier/three-tier campus labs, SOHO with a home router, routing between subnets, `show mac address-table` and `show cdp neighbors`. PoE is limited. Only certain multilayer switches (3560, possibly 3650) support `power inline auto`. The 2960 does not. Phones can use a power adapter instead. NGFW/IPS, Catalyst Center and true spine-leaf ECMP fabrics are not realistically emulated.

### Cited Findings
- PoE in PT: "only with 3560 multilayer switch"; command `power inline auto`; alternative "IP_PHONE_POWER_ADAPTER" on the 7960 phone — [PacketTracerNetwork](https://www.packettracernetwork.com/tutorials/voip-devices.html)
- 2960 in PT lacks PoE. 3560/3650 (3650PS) are cited as PoE-capable, and replies disagree — [Cisco Community](https://community.cisco.com/t5/network-management/packet-tracer-switch-poe/td-p/4586993)

### Inferences — lab ideas
1. **"Meet the devices"**: PC → 2960 → ISR 4331 → 2960 → Server. Students watch PDUs in simulation mode, note where MAC addresses change and where IP addresses stay the same, then compare `show mac address-table` with `show ip route`. Add a hub to show the collision domain/flooding difference (PT includes a Hub device and shows collisions in simulation mode).
2. **"L2 vs L3 switch"**: two VLANs on a 2960, which cannot talk to each other. Add a 3560 with SVIs and `ip routing` and they can. Show `show ip route` on the 3560.
3. **"Two-tier vs three-tier"**: build a collapsed core (2× 3560 + 4× 2960 dual-homed). Then add a third building and see the link count grow. Redesign with a core pair. Have learners count links and STP-blocked ports (`show spanning-tree`).
4. **"Spine-leaf on paper + PT"**: 2 spines (3650) + 3 leaves, all routed links, OSPF with ECMP. `show ip route` shows 2 equal-cost paths ([110/x] via two next hops). Leaves must not connect to each other. OSPF config is 3.4 content, so give it as a ready-made file. ECMP display in PT should be tested [verify].
5. **"PoE"**: a 3560 with an IP phone. Start with `power inline never` (phone stays dark), then `auto` (phone boots). Try `show power inline` [verify in PT]. Compare with the power adapter.
6. **"SOHO"**: PT Home Router / WRT300N + laptops (wireless) + cable modem/cloud. Students find the router, switch, AP, DHCP and NAT functions inside one box.
7. **"WAN shapes"**: 4 routers. Build hub-and-spoke, then full mesh, count links, run a traceroute spoke→spoke through the hub.
8. **Cloud**: PT has a "Cloud" device (Cloud-PT, for DSL/cable emulation), but it does not model IaaS/PaaS/SaaS. Teach cloud with diagrams and quizzes.
- **Not in PT:** real NGFW/IPS features (PT has an ASA 5505/5506-X with basic firewalling only [verify]), Catalyst Center, a WLC 9800 GUI (PT has WLC-2504/3504 [verify]), and power-budget accuracy.

### Gaps
- Not tested in a live PT 8.x install. Verify model lists and commands.

---

## Q10. Wikimedia Commons image candidates

### Takeaway
Commons was **not reachable** from this environment. The proxy blocked curl, and WebFetch returned url_not_found for commons.wikimedia.org pages. The file names below come from search results and exist on Commons, but **licenses and authors must be checked** on each file page before download (all [verify]). AP photos are already in the repo.

### Cited Findings (file names from search results; license/author [verify])
1. `File:19-inch_rackmount_Ethernet_switches_and_patch_panels.jpg`: switches + patch panels in a rack (ideal for 1.1.b / access layer) — [Commons](https://commons.wikimedia.org/wiki/File:19-inch_rackmount_Ethernet_switches_and_patch_panels.jpg) — license/author [verify]
2. `File:Patch_Panel.jpg`: patch panel — [Commons](https://commons.wikimedia.org/wiki/File:Patch_Panel.jpg) — [verify]
3. `File:Power_over_Ethernet_injector.jpg`: midspan PoE injector (1.1.h) — [Commons](https://commons.wikimedia.org/wiki/File:Power_over_Ethernet_injector.jpg) — [verify]
4. `File:5520-24-POE.JPG`: 24-port PoE switch (likely Extreme/Avaya 5520 [verify]) — [Commons](https://commons.wikimedia.org/wiki/File:5520-24-POE.JPG) — [verify]
5. `File:Cisco_1841_(2023-02-21_21-51).png`: Cisco 1841 router (a classic PT model too) — [Commons](https://commons.wikimedia.org/wiki/File:Cisco_1841_(2023-02-21_21-51).png) — [verify]
6. `File:Datacenter_Server_Racks_(22370909788).jpg`: data center racks (Flickr import; likely CC BY 2.0 [verify]) — [Commons](https://commons.wikimedia.org/wiki/File:Datacenter_Server_Racks_(22370909788).jpg)
7. `File:Front_of_server_racks_at_NERSC.jpg`: server racks at NERSC (possibly US-gov public domain [verify]) — [Commons](https://commons.wikimedia.org/wiki/File:Front_of_server_racks_at_NERSC.jpg)
8. `File:DE-CIX_GERMANY_-_Switch_Rack_(6218137120).jpg`: IXP switch rack (Flickr import [verify]) — [Commons](https://commons.wikimedia.org/wiki/File:DE-CIX_GERMANY_-_Switch_Rack_(6218137120).jpg)
9. `File:Fiber-Panel-Rack.jpg`: fiber patch panel (useful for 1.3) — [Commons](https://commons.wikimedia.org/wiki/File:Fiber-Panel-Rack.jpg) — [verify]
10. `File:Internals_of_a_Cisco_small_business_SG300-28_28-port_Gigabit_Ethernet_rackmount_switch.jpg`: inside of a switch (ASICs; good for the "switch = hardware forwarding" point) — [Wikipedia file page](https://en.wikipedia.org/wiki/File:Internals_of_a_Cisco_small_business_SG300-28_28-port_Gigabit_Ethernet_rackmount_switch.jpg) — [verify]
- Useful categories to browse: [Category:Cisco routers](https://commons.wikimedia.org/wiki/Category:Cisco_routers), [Category:Ethernet switches](https://commons.wikimedia.org/wiki/Category:Ethernet_switches), [Category:Patch panels for networking](https://commons.wikimedia.org/wiki/Category:Patch_panels_for_networking), [Category:Data center networking](https://commons.wikimedia.org/wiki/Category:Data_center_networking)
- Already in repo (licenses recorded in `web/public/img/wiki/attribution.json`): `aironet-1131ag.jpg` (Xosema, CC BY-SA 4.0), `aironet-1100.jpg` (Huhbakker, CC0) for 1.1.d, and `wifi6-router-back.jpg` (Abhi25t, CC BY-SA 4.0) for 1.2.e SOHO — [repo attribution.json](file:///home/user/ccna-learn/web/public/img/wiki/attribution.json)

### Inferences
- Download using the thumb URL pattern from CLAUDE.md §5, from an environment that can reach upload.wikimedia.org, and check each file page's license box first.
- For topology figures (2-tier, 3-tier, spine-leaf, WAN shapes, SOHO, cloud models) draw original SVGs. Those are better than photos and theme-aware.

### Gaps
- Licenses and authors for all 10 candidates are unverified because Commons was unreachable.

---

## v2.0 note (brief)
- v2.0 starts 3 Feb 2027. Repo notes say it reduces to 5 domains and removes QoS, REST/JSON and Terraform. Device roles, topologies, PoE and cloud are expected to carry over as fundamentals [verify against v2.0 PDF]. Content for 1.1/1.2 can be tagged "v1.1 core / likely carries to v2.0" — [repo: topic_depth_commands.md](file:///home/user/ccna-learn/research_notes/Curricula%20CCNA%20%C8%99i%20resurse%20oficiale/topic_depth_commands.md); [repo CLAUDE.md §8](file:///home/user/ccna-learn/CLAUDE.md)
