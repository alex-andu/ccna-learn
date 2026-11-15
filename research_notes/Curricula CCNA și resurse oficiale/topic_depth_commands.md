# CCNA 200-301 v1.1: Topic Depth, Key IOS Commands, Exam Traps and "Beyond CCNA" Extensions

> Research note (compiled 2026-11-15). **Method caveat:** in this session WebFetch could not reach cisco.com, learningcontent.cisco.com, learningnetwork.cisco.com, ine.com, cbtnuggets.com and others (DNS blocked by the sandbox network policy). Findings come from WebSearch result summaries plus primary-standard URLs (RFCs, IANA, Cisco doc URLs that appeared in search results). Values marked **[std]** are long-stable protocol constants taken from the cited RFC or Cisco document. They were not re-read live in this session, so spot-check them before publishing. Values marked **[verify]** had conflicting or weak sourcing.

---

## 0. Exam version status (scope check)

### Takeaway
CCNA 200-301 **v1.1 is still live until 2 Feb 2027**. **v2.0** (same exam code 200-301) starts **3 Feb 2027**, and Cisco published its topics on 20 May 2026. A beginner who starts in Nov 2026 will probably test after Feb 2027, so the platform should teach the v1.1 core (most of it carries over) and add v2.0 deltas: an AI/operations domain, more troubleshooting, and Security merged into Services.

### Cited Findings
- v1.1 final test day is 2 Feb 2027 and v2.0 starts 3 Feb 2027. v2.0 topics were published 20 May 2026 — [Trainingcamp](https://trainingcamp.com/articles/ccna-is-changing-in-2027-take-the-current-exam-or-wait-for-v2-0/); [Smenode Academy](https://smenode-academy.com/blog/ccna-v2-0-what-exam-topics-changed-feb-2027-deadline/); [CertCrush](https://www.certcrush.app/blog/ccna-v2-0-2027-changes-sit-v1-1-first)
- Cisco's v2.0 exam-topics PDF is titled "Implementing and Administering Cisco Solutions (200-301 CCNA) v2.0" — [Cisco PDF (URL seen in search; fetch blocked)](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf)
- Reported v2.0 domains: Network Infrastructure & Connectivity 25%, Switching & Network Access 25%, IP Routing 20%, Network Services & Security 20%, AI, Network Operations & Management 10%. The AI domain covers agentic AI in operations, prompting GenAI, SNMP, Ansible config management and syslog interpretation — [AJS Networking](https://www.ajsnetworking.com/new-ccna-v2-2027/); [PrepAway](https://www.prepaway.com/certification/ccna-v11-v20-2027-transition-guide/); [Skills-Nest](https://www.skills-nest.com/certifications/cisco-ccna-200-301-v2). One source (CertificationKits) still describes a 6-domain layout, which looks outdated — [CertificationKits](https://www.certificationkits.com/the-new-cisco-ccna-v2-0-coming-in-2027-what-actually-changed-and-why-hands-on-lab-practice-matters-more-than-ever/)
- v1.1 weights (Cisco blueprint): 1.0 Network Fundamentals 20%, 2.0 Network Access 20%, 3.0 IP Connectivity 25%, 4.0 IP Services 10%, 5.0 Security Fundamentals 15%, 6.0 Automation & Programmability 10% — [ComputingForGeeks summary of v1.1](https://computingforgeeks.com/ccna-exam-topics/); [Achievable](https://achievable.me/exams/ccna/resources/ccna-exam-topics/)

### Inferences
- Content should be tagged "v1.1 core / carries to v2.0" and "v2.0-only (AI ops, Ansible, more troubleshooting)". Keep the 6-domain v1.1 structure below as the teaching skeleton.

### Gaps
- Could not read Cisco's official v1.1 or v2.0 PDFs directly, so the v2.0 weights come from third-party sources and should be checked against Cisco's page. Removed or added sub-objectives in v2.0 are not confirmed.

---

## 1. Domain 1: Network Fundamentals (20%)

### Takeaway
This domain tests breadth, not deep configuration: device roles, topology architectures, cabling, TCP vs UDP, IPv4 subnetting (must be fast and exact), IPv6 addressing/EUI-64, wireless basics, virtualization/cloud, and switching concepts (MAC learning, flooding). Subnetting and IPv6 address types carry the most points.

### Cited Findings / Reference tables

**1.1 Components and architectures (concept depth)**
| Item | What to know |
|---|---|
| Router, L2/L3 switch, NGFW/IPS, AP, WLC, endpoint, server, PoE | Role, OSI layer, and where each sits in the topology |
| 2-tier (collapsed core) vs 3-tier (access/distribution/core) | Why distribution aggregates and core is fast transport |
| Spine-leaf | Every leaf connects to every spine and leaves never connect to each other. Any leaf-to-leaf path has the same hop count |
| WAN, SOHO, on-prem vs cloud | IaaS/PaaS/SaaS, public/private/hybrid |
| Cabling | UTP Cat5e/6/6a; straight-through vs crossover (Auto-MDIX); MMF vs SMF; copper 100 m limit |
| Interface problems | collisions, CRC errors, runts (<64 B), giants (>1518 B), late collisions mean a **duplex mismatch** |

**1.2 TCP vs UDP; well-known ports [std, IANA]** — [IANA service-names registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)
| Port | Proto | Service | Port | Proto | Service |
|---|---|---|---|---|---|
| 20/21 | TCP | FTP data/control | 123 | UDP | NTP |
| 22 | TCP | SSH/SCP/SFTP | 161/162 | UDP | SNMP agent / trap |
| 23 | TCP | Telnet | 389 | TCP | LDAP |
| 25 | TCP | SMTP | 443 | TCP | HTTPS |
| 53 | TCP+UDP | DNS | 514 | UDP | Syslog |
| 67/68 | UDP | DHCP server/client | 1812/1813 | UDP | RADIUS auth/acct (1645/1646 legacy) |
| 69 | UDP | TFTP | 49 | TCP | TACACS+ |
| 80 | TCP | HTTP | 5246/5247 | UDP | CAPWAP control/data |
| 110 / 143 | TCP | POP3 / IMAP | 3389 | TCP | RDP |

TCP facts: 3-way handshake SYN, SYN-ACK, ACK; FIN/ACK 4-way teardown; sequence/ack numbers; windowing. Header sizes: TCP 20 B min, UDP 8 B — [RFC 9293 TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 768 UDP](https://www.rfc-editor.org/rfc/rfc768)

**1.3 IPv4 [std]**
- Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918)
- Other special ranges: 127.0.0.0/8 loopback; 169.254.0.0/16 APIPA/link-local ([RFC 3927](https://www.rfc-editor.org/rfc/rfc3927)); 100.64.0.0/10 CGNAT ([RFC 6598](https://www.rfc-editor.org/rfc/rfc6598)); 224.0.0.0/4 multicast
- Subnetting skills: usable hosts = 2^h − 2; /31 is valid on point-to-point links with 2 hosts ([RFC 3021](https://www.rfc-editor.org/rfc/rfc3021)); /32 is a host route; VLSM; summarization
- Verify on hosts: `ipconfig /all`, `ip addr`, `ifconfig`, `arp -a`, `nslookup`, `tracert`/`traceroute` (OS verification is a v1.1 objective)

**1.4 IPv6 [std]** — [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291); [RFC 4193 ULA](https://www.rfc-editor.org/rfc/rfc4193)
| Type | Prefix | Notes |
|---|---|---|
| Global unicast | 2000::/3 | Typical structure: /48 site, /64 subnet |
| Unique local | FC00::/7 (FD00::/8 in practice) | Rough equivalent of private IPv4 |
| Link-local | FE80::/10 | Auto-configured on every IPv6 interface; next hop for routing protocols |
| Multicast | FF00::/8 | FF02::1 all nodes, FF02::2 all routers, FF02::5/6 OSPFv3, FF02::A EIGRP, FF02::1:FFxx:xxxx solicited-node |
| Loopback / unspecified | ::1/128 / ::/128 | |
| Anycast | taken from unicast space | Configured with the `anycast` keyword |
- EUI-64 steps: split the 48-bit MAC, insert FFFE in the middle, flip the 7th bit (U/L bit). Example: 0011.2233.4455 becomes 0211:22FF:FE33:4455 — [RFC 4291 App. A](https://www.rfc-editor.org/rfc/rfc4291)
- Abbreviation rules: drop leading zeros in each hextet; `::` replaces one run of all-zero hextets, used **only once**
- NDP (ICMPv6) replaces ARP: RS 133, RA 134, NS 135, NA 136, Redirect 137. SLAAC uses RA + EUI-64/random IID; DAD uses NS — [RFC 4861](https://www.rfc-editor.org/rfc/rfc4861); [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862)

**1.5 Wireless principles**
| IEEE | Wi-Fi name | Band(s) | Max width | Top modulation | Max PHY rate (theoretical) |
|---|---|---|---|---|---|
| 802.11 (1997) | — | 2.4 GHz | 22 MHz | DSSS/FHSS | 2 Mbps |
| 802.11b | (Wi-Fi 1, unofficial) | 2.4 GHz | 22 MHz | DSSS/CCK | 11 Mbps |
| 802.11a | (Wi-Fi 2, unofficial) | 5 GHz | 20 MHz | OFDM 64-QAM | 54 Mbps |
| 802.11g | (Wi-Fi 3, unofficial) | 2.4 GHz | 20 MHz | OFDM 64-QAM | 54 Mbps |
| 802.11n | Wi-Fi 4 | 2.4 + 5 GHz | 40 MHz | 64-QAM, 4 SS MIMO | 600 Mbps |
| 802.11ac | Wi-Fi 5 | 5 GHz only | 160 MHz | 256-QAM, 8 SS, DL MU-MIMO | ~6.9 Gbps |
| 802.11ax | Wi-Fi 6 / 6E (6 GHz) | 2.4/5 (+6 for 6E) | 160 MHz | 1024-QAM, OFDMA, UL+DL MU-MIMO, 8 SS | ~9.6 Gbps |
| 802.11be | Wi-Fi 7 | 2.4/5/6 GHz | 320 MHz (6 GHz) | 4096-QAM (12 bits/symbol), MLO, 16 SS | ~46 Gbps |

Sources: 6/6E/7 rows — [Ezurio comparison](https://www.ezurio.com/resources/blog/how-does-wi-fi-7-compare-to-wi-fi-6-6e); [Cisco "What is Wi-Fi 6 vs 6E vs 7"](https://www.cisco.com/c/de_de/products/wireless/what-is-wi-fi-6.html); [Wi-Fi 7 (Wikipedia mirror)](https://kaweah.freedombox.rocks/kiwix/wikipedia_en_all_maxi_2023-10/Wi-Fi_7). Legacy rows [std]: IEEE 802.11 amendments as summarized at [Wikipedia IEEE 802.11](https://en.wikipedia.org/wiki/IEEE_802.11). The 320 MHz mode may be restricted in some countries — [ASUS](https://www.asus.com/ie/content/wifi7/)
- RF basics: 2.4 GHz has 3 non-overlapping channels (1, 6, 11) in North America. 5 GHz has many 20 MHz non-overlapping channels, some needing DFS. Higher frequency means shorter range. Know RSSI/SNR, and reflection/refraction/absorption/scattering/diffraction
- Service sets: IBSS (ad hoc), BSS (BSSID = AP radio MAC), ESS (same SSID across APs, roaming), MBSS (mesh). Also distribution system and workgroup bridge
- Encryption (tested under Domain 5) is summarized in §5

**1.6 Virtualization**: Type 1 hypervisor (bare metal) vs Type 2 (hosted); VMs vs containers; VRF as a concept (multiple routing tables).

**1.7 Switching concepts**: the switch learns **source** MACs and forwards on **destination** MAC. Unknown unicast, broadcast and multicast are flooded. Default MAC aging is 300 s [std; Cisco default]. `show mac address-table [dynamic]`, `clear mac address-table dynamic`.

### Inferences
- For beginners, subnetting drills and IPv6 abbreviation/EUI-64 drills need interactive tools, because these are the highest-yield skills in the domain.

### Gaps
- The 802.11a/b/g "Wi-Fi 1-3" names are retroactive and unofficial. The Wi-Fi Alliance officially names only Wi-Fi 4 and later. I could not open the Wi-Fi Alliance page to confirm.

### Common traps (Domain 1)
- Mixing up `::` (only once) and leading-zero rules.
- In EUI-64, you flip the 7th bit; you do not "add 2". (Adding 2 works only when the bit is 0.)
- /31 networks have 0 broadcast addresses and 2 usable hosts.
- 802.11ac is **5 GHz only**. 802.11n works in both bands. 6 GHz needs Wi-Fi 6E or 7.
- Late collisions and rising collisions on a full-duplex link point to a duplex mismatch.
- A switch never learns a MAC from the destination field.

---

## 2. Domain 2: Network Access (20%)

### Takeaway
This domain is configuration-heavy: VLANs, 802.1Q trunks (native VLAN, allowed list), DTP, inter-switch discovery (CDP/LLDP), EtherChannel (LACP/PAgP/static), Rapid PVST+ (root election, port roles/states, PortFast/BPDU Guard), and wireless architectures (autonomous, lightweight/CAPWAP, cloud), AP modes, WLC ports/interfaces, and WLAN GUI configuration.

### Cited Findings / Reference tables

**2.1 802.1Q / VLAN / DTP [std]** — [IEEE 802.1Q overview (Wikipedia)](https://en.wikipedia.org/wiki/IEEE_802.1Q)
- The tag is 4 bytes inserted after the source MAC: TPID 0x8100, PCP 3 bits (CoS), DEI 1 bit, VID 12 bits. VLANs 1-4094 usable (0 and 4095 reserved). Normal range 1-1005; extended range 1006-4094.
- Native VLAN (default 1) is sent **untagged**. A native VLAN mismatch produces CDP "%CDP-4-NATIVE_VLAN_MISMATCH" and leaks traffic between VLANs.
- ISL is Cisco-proprietary and obsolete (26 B header + 4 B FCS).

| DTP mode | dynamic auto | dynamic desirable | trunk | access |
|---|---|---|---|---|
| **dynamic auto** | access | trunk | trunk | access |
| **dynamic desirable** | trunk | trunk | trunk | access |
| **trunk** | trunk | trunk | trunk | *mismatch (limited connectivity)* |
| **access** | access | access | *mismatch* | access |
Default on most modern Catalyst switches is `dynamic auto`, so two default switches form an **access** link. `switchport nonegotiate` disables DTP — [Cisco DTP doc via NetworkLessons](https://networklessons.com/switching/cisco-dtp-dynamic-trunking-protocol-negotiation) [std]

```
vlan 10
 name USERS
interface g0/1
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 20            ! voice VLAN (tagged, CoS 5 from phone)
interface g0/24
 switchport trunk encapsulation dot1q   ! only on switches that also support ISL
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99   ! 'add'/'remove' to edit; plain list REPLACES
 switchport nonegotiate
show vlan brief | show interfaces trunk | show interfaces g0/1 switchport | show vtp status
```
- VTP (v1.1 lists it only implicitly via "VTP-related"): modes server/client/transparent/off. A higher revision number overwrites the domain, which makes adding a used switch dangerous. VTPv3 adds a primary server. VLAN info is stored in vlan.dat.

**2.2 Inter-VLAN routing**: router-on-a-stick (`interface g0/0.10` / `encapsulation dot1Q 10 [native]` / `ip address`), or SVI on an L3 switch (`ip routing`, `interface vlan 10`). An SVI is up/up only if the VLAN exists and at least 1 access/trunk port in that VLAN is up (autostate). A routed port uses `no switchport`.

**2.3 CDP / LLDP**
| | CDP | LLDP |
|---|---|---|
| Standard | Cisco proprietary | IEEE 802.1AB |
| Default on IOS | enabled | disabled (`lldp run`) |
| Timers | 60 s advert / 180 s hold | 30 s / 120 s (TLV hold multiplier 4) |
| Commands | `cdp run`, `no cdp enable` (int), `show cdp neighbors [detail]` | `lldp run`, `lldp transmit/receive` (int), `show lldp neighbors [detail]` |
[std] — [Cisco LLDP config guide (Catalyst)](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-3/configuration_guide/sys_mgmt/b_173_sys_mgmt_9300_cg/configuring_lldp__lldp_med__and_wired_location_service.html) [verify timers]. `show cdp neighbors detail` is the command that shows the neighbor's IP address and IOS version.

**2.4 EtherChannel**
| Mode | Protocol | Forms channel with |
|---|---|---|
| `on` | none (static) | `on` only |
| `active` | LACP (IEEE 802.3ad/802.1AX) | active, passive |
| `passive` | LACP | active only |
| `desirable` | PAgP (Cisco) | desirable, auto |
| `auto` | PAgP | desirable only |
- LACP allows up to 16 links per bundle, 8 active + 8 standby. LACP system priority defaults to 32768 [std]. Member ports must match: speed, duplex, access VLAN / trunk mode, native and allowed VLANs.
- Load balancing: `port-channel load-balance src-dst-ip` (default is often src-mac or src-dst-ip, depending on platform) [verify].
```
interface range g0/1-2
 channel-group 1 mode active
interface port-channel 1
 switchport mode trunk
show etherchannel summary   ! flags: P=bundled, s=suspended, D=down, SU=L2 in use, RU=L3 in use
show etherchannel port-channel | show lacp neighbor | show pagp neighbor
```
Layer-3 EtherChannel: `no switchport` on both members and Po, IP on Po.

**2.5 STP / RSTP**
| Item | 802.1D STP | 802.1w RSTP |
|---|---|---|
| Port states | Blocking (20 s max age) → Listening (15 s) → Learning (15 s) → Forwarding; Disabled | Discarding → Learning → Forwarding |
| Port roles | Root, Designated, Non-designated (blocking) | Root, Designated, **Alternate** (backup path to root), **Backup** (second port to same segment, hub case), Disabled |
| Convergence | 30-50 s | about 1-2 s (proposal/agreement handshake) |
| Cisco flavor | PVST+ | Rapid PVST+ (`spanning-tree mode rapid-pvst`) |
| Link types | — | point-to-point (full duplex), shared (half), edge (PortFast) |
RSTP merges blocking/listening/learning-disabled into discarding. The Alternate and Backup roles are new in RSTP — [Cisco "Understanding RSTP 802.1w" (doc 24062)](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.pdf); [NetworkLessons RSTP roles](https://notes.networklessons.com/stp-rstp-port-roles)

Timers [std, 802.1D]: Hello 2 s, Forward delay 15 s, Max age 20 s. BPDUs go to multicast 0180.C200.0000.

Election: lowest **Bridge ID** = priority (default 32768, increments of 4096) + extended system ID (VLAN #) + MAC. So VLAN 10 default priority shows as 32778. Root port selection order: lowest root path cost, then lowest sender BID, then lowest sender port priority (default 128), then lowest sender port number.

| Speed | Short (802.1D-1998, Cisco default) | Long (802.1D-2004/802.1t) |
|---|---|---|
| 10 Mbps | 100 | 2,000,000 |
| 100 Mbps | 19 | 200,000 |
| 1 Gbps | 4 | 20,000 |
| 10 Gbps | 2 | 2,000 |
| 100 Gbps | — (1 on some IOS) | 200 |
[std] — 802.1D-2004 values; long-mode via `spanning-tree pathcost method long` [verify 100G short value per platform]

```
spanning-tree mode rapid-pvst
spanning-tree vlan 10 root primary          ! macro: sets 24576 or 4096 below current root
spanning-tree vlan 10 priority 4096
interface g0/1
 spanning-tree portfast                      ! edge port; skip listening/learning
 spanning-tree bpduguard enable              ! err-disable on BPDU receipt
spanning-tree portfast default / spanning-tree portfast bpduguard default  (global)
interface g0/2
 spanning-tree guard root                    ! root guard (port goes root-inconsistent)
show spanning-tree [vlan 10] | show spanning-tree summary | show spanning-tree interface g0/1 detail
errdisable recovery cause bpduguard ; shutdown/no shutdown to recover manually
```

**2.6 Wireless architectures and WLC**
- Autonomous AP (standalone config) vs Lightweight AP + WLC (split-MAC) vs Cloud-managed (Meraki) vs Embedded/Mobility Express/EWC.
- CAPWAP (RFC 5415): UDP **5246 control (DTLS-encrypted)**, **5247 data (DTLS optional)**. Tunnels run between the LAP and the WLC — [RFC 5415](https://www.rfc-editor.org/rfc/rfc5415) [std]
- Lightweight AP modes: **Local** (default; serves clients and tunnels to the WLC), **FlexConnect** (local switching at branch; keeps working if the WLC link fails), **Monitor** (no clients; IDS/RLDP/location), **Sniffer** (captures to Wireshark/OmniPeek host), **Rogue detector**, **SE-Connect** (spectrum analysis), **Bridge/Mesh**, **Flex+Bridge**.
- WLC physical ports: service port (OOB management), distribution system port (connects to switch, usually an 802.1Q trunk, can be in LAG), console, redundancy port. Logical interfaces: management, redundancy management, virtual (e.g., 192.0.2.1 for DHCP relay/web auth), service-port, dynamic (WLAN to VLAN mapping).
- WLAN GUI tasks (v1.1 objective 2.9): create the WLAN (SSID, ID, profile name), map it to a dynamic interface/VLAN, set Security L2 (WPA2/WPA3, PSK or 802.1X), QoS profile (Platinum = voice, Gold = video, Silver = best effort, Bronze = background), advanced settings.
- AP/WLC management access: Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS (objective 2.8).

### Inferences
- Labs on Packet Tracer are enough for 2.1-2.5. 2.6-2.9 need WLC GUI screenshots or simulation, because Packet Tracer's WLC emulation is limited.

### Gaps
- Default LLDP timers and EtherChannel load-balance defaults vary by platform. Not verified live.

### Common traps (Domain 2)
- `switchport trunk allowed vlan 30` **replaces** the whole list; use `add`.
- auto + auto gives an access link, not a trunk. "trunk" + "access" is a mismatch.
- Native VLAN must match on both ends. Native VLAN traffic is untagged (unless `vlan dot1q tag native`).
- LACP passive+passive and PAgP auto+auto form no channel. `on` does not talk to LACP or PAgP.
- STP picks the root by **lowest** BID, so a lower priority wins and higher values lose. The priority must be a multiple of 4096.
- The extended system ID adds the VLAN number to the shown priority (32769 for VLAN 1).
- RSTP "discarding" covers 3 legacy states. The Alternate port is the RSTP name for the old blocking port.
- PortFast belongs on access/edge ports only. BPDU Guard err-disables the port; it does not just block it.
- In FlexConnect, the AP keeps switching locally if the WLC is lost. In Local mode, all client traffic tunnels to the WLC.
- CAPWAP control is UDP 5246 and data is 5247. LWAPP used 12222/12223 (legacy).

---

## 3. Domain 3: IP Connectivity (25%, the largest domain)

### Takeaway
You must read `show ip route` output: codes, [AD/metric], longest-prefix match, then AD, then metric. You also need IPv4/IPv6 static routes (default, network, host, floating), single-area OSPFv2 (neighbor adjacency rules, DR/BDR election, router ID, network types), and FHRP purpose (HSRP depth only).

### Cited Findings / Reference tables

**3.1 Route selection order:** (1) **longest prefix match**, (2) lowest **AD** between protocols, (3) lowest **metric** within one protocol. Routing table codes: C connected, L local (/32 of interface), S static, S* default, O OSPF intra-area, O IA inter-area, O E1/E2 external, D EIGRP, D EX EIGRP external, B BGP, R RIP.

**3.2 Administrative distance (Cisco defaults)**
| Source | AD | Source | AD |
|---|---|---|---|
| Connected | 0 | OSPF | 110 |
| Static | 1 | IS-IS | 115 |
| EIGRP summary | 5 | RIP | 120 |
| eBGP | 20 | EIGRP external | 170 |
| EIGRP internal | 90 | iBGP | 200 |
| IGRP (legacy) | 100 | DHCP-learned default | 254 |
| | | Unknown / unusable | 255 |
— [Cisco "What Is Administrative Distance" (doc 15986, mirror)](https://bxin.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html); [Wikipedia AD](https://en.wikipedia.org/wiki/Administrative_distance); [NetworkLessons](https://networklessons.com/ip-routing/introduction-to-administrative-distance). The search summary confirmed 0/1/20/90/110/120/200. 5, 115, 170, 254 and 255 are [std] values from the same Cisco doc and were not shown in the snippet [verify 254].

**3.3 Static routing**
```
ip route 0.0.0.0 0.0.0.0 203.0.113.1                 ! default (gateway of last resort)
ip route 10.2.0.0 255.255.0.0 g0/1 10.1.1.2          ! fully specified
ip route 10.2.2.2 255.255.255.255 10.1.1.2           ! host route
ip route 10.2.0.0 255.255.0.0 10.9.9.2 130           ! floating static (AD 130 > OSPF 110)
ipv6 unicast-routing                                  ! REQUIRED for IPv6 routing
ipv6 route ::/0 2001:db8:0:1::1
ipv6 route 2001:db8:2::/64 g0/1 fe80::2               ! link-local next hop needs exit int
show ip route [static] | show ipv6 route | show ip route 10.2.2.2 | ping / traceroute
```
- Recursive (next-hop IP), directly attached (exit interface; on Ethernet this relies on proxy ARP, so avoid it), fully specified.

**3.4 OSPFv2 single-area** — [RFC 2328](https://www.rfc-editor.org/rfc/rfc2328) [std]
- Link-state, Dijkstra SPF, IP protocol **89**, multicast **224.0.0.5** (AllSPFRouters) and **224.0.0.6** (AllDRouters). Cost = reference bandwidth / interface bandwidth. Default reference is 100 Mbps, so FastEthernet, GigabitEthernet and 10G all get cost 1 unless you set `auto-cost reference-bandwidth`.
- Router ID order: (1) `router-id` command, (2) highest IP on an up/up loopback, (3) highest IP on an up/up physical interface. A change needs `clear ip ospf process`.

| Packet type | # | Purpose |
|---|---|---|
| Hello | 1 | Discover/maintain neighbors, elect DR/BDR |
| DBD | 2 | LSDB summary during exchange |
| LSR | 3 | Request specific LSAs |
| LSU | 4 | Carries LSAs |
| LSAck | 5 | Acknowledge LSU |

Neighbor states: **Down → Init → 2-Way → ExStart → Exchange → Loading → Full**. (Attempt only on NBMA.) DROthers stay in **2-WAY** with each other, which is normal.

| Network type | Default on | Hello/Dead | DR/BDR? |
|---|---|---|---|
| Broadcast | Ethernet | 10/40 s | Yes |
| Point-to-point | Serial HDLC/PPP, or `ip ospf network point-to-point` | 10/40 s | No |
| Non-broadcast (NBMA) | Frame Relay main int | 30/120 s | Yes, static neighbors |
| Point-to-multipoint | manual | 30/120 s | No |

DR/BDR election: highest interface **priority** (default 1, range 0-255, 0 = never DR), then highest RID. The election is **non-preemptive**.

Adjacency must match: area ID, subnet/mask, hello/dead timers, authentication, stub flags, and **MTU** (an MTU mismatch leaves the neighbor stuck in ExStart/Exchange). Router IDs must be unique. A network-type mismatch (broadcast vs p2p) can form an adjacency with broken routes.

LSA types for CCNA awareness: 1 Router, 2 Network (from the DR), 3 Summary (ABR). Multi-area detail belongs to ENCOR.
```
router ospf 1
 router-id 1.1.1.1
 network 10.0.0.0 0.0.0.255 area 0          ! wildcard mask
 passive-interface g0/2                      ! or passive-interface default + no passive-interface
 auto-cost reference-bandwidth 100000        ! Mbps; set on ALL routers
 default-information originate [always]
interface g0/1
 ip ospf 1 area 0                            ! interface method
 ip ospf priority 255
 ip ospf cost 10
 ip ospf network point-to-point
 ip ospf hello-interval 5 / ip ospf dead-interval 20
show ip ospf neighbor | show ip ospf interface [brief] | show ip protocols | show ip ospf database | show ip route ospf
```
- The OSPF process ID is **locally significant** and does not need to match between neighbors.

**3.5 FHRP**
| | HSRP | VRRP | GLBP |
|---|---|---|---|
| Standard | Cisco | IETF (RFC 5798 v3) | Cisco |
| Roles | Active/Standby | Master/Backup | AVG/AVF |
| Multicast | v1 224.0.0.2, v2 224.0.0.102 (UDP 1985) | 224.0.0.18 (IP proto 112) | 224.0.0.102 (UDP 3222) |
| Virtual MAC | v1 0000.0C07.ACxx; v2 0000.0C9F.Fxxx | 0000.5E00.01xx | 0007.B400.xxyy |
| Groups | v1 0-255; v2 0-4095 | 1-255 | 0-1023 |
| Preempt default | **off** | **on** | off (AVG) |
| Load balancing | per-group/VLAN | per-group | native, per-host |
HSRP: hello 3 s / hold 10 s, priority 100 default; v1 and v2 do not interoperate — [Wikipedia HSRP](https://en.wikipedia.org/wiki/Hot_Standby_Router_Protocol); [Cisco HSRP config guide](https://www.cisco.com/en/US/docs/ios-xml/ios/ipapp_fhrp/configuration/15-0s/fhp-hsrp.html); [NetworkAcademy.io HSRP](https://www.networkacademy.io/ccna/network-services/hot-standby-router-protocol-hsrp). VRRP/GLBP values are [std] from [RFC 5798](https://www.rfc-editor.org/rfc/rfc5798) and the Cisco GLBP guide [verify].
```
interface g0/0
 standby version 2
 standby 1 ip 10.1.1.254
 standby 1 priority 110
 standby 1 preempt
show standby [brief]
```

### Inferences
- The best teaching sequence is: read a routing table, then longest match, then AD, then floating static, then OSPF adjacency troubleshooting. Most exam simlets combine these.

### Gaps
- v1.1 objective 3.4 says "OSPFv2 single area". OSPFv3 config is not in CCNA scope, though IPv6 static routes are.

### Common traps (Domain 3)
- Longest prefix **beats** AD. A /24 static loses to a /25 learned by OSPF for addresses inside the /25.
- A floating static needs an AD **higher** than the primary protocol.
- An OSPF neighbor stuck in 2-WAY between two DROthers is **normal**. ExStart/Exchange stuck usually means an MTU mismatch.
- OSPF uses a **wildcard** mask in `network`, not a subnet mask. Area IDs must match, process IDs need not.
- The DR is not preempted. Raising a priority does nothing until the OSPF process resets or the interface flaps.
- Ref-bandwidth: Fa, Gi and 10G all cost 1 by default.
- IPv6 static with a link-local next hop **requires** the exit interface. `ipv6 unicast-routing` must be enabled.
- HSRP preempt is **disabled** by default (VRRP preempt enabled).
- The `L` route is the router's own /32; it is not a "loop" route.

---

## 4. Domain 4: IP Services (10%)

### Takeaway
This domain is mostly configure-and-verify for NAT/PAT, NTP, DHCP server/relay and SSH, plus conceptual depth for DNS, SNMP, syslog, QoS (classification/marking/queuing/policing vs shaping), and TFTP/FTP for IOS file transfer.

### Cited Findings / Reference tables

**4.1 NAT**
| Term | Meaning |
|---|---|
| Inside local | Private IP of the inside host |
| Inside global | Public IP representing the inside host |
| Outside global | Real public IP of the external host |
| Outside local | External host's IP as seen from inside (usually = outside global) |
| Static NAT | 1:1 permanent |
| Dynamic NAT | Pool, 1:1 while in use |
| PAT (NAT overload) | Many:1 using ports |
```
interface g0/0 ; ip nat inside
interface g0/1 ; ip nat outside
ip nat inside source static 192.168.1.10 203.0.113.10
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat pool POOL 203.0.113.20 203.0.113.30 netmask 255.255.255.0
ip nat inside source list 1 pool POOL [overload]
ip nat inside source list 1 interface g0/1 overload      ! PAT on interface IP
show ip nat translations | show ip nat statistics | clear ip nat translation * | debug ip nat
```
[std] — [Cisco NAT config guide](https://www.cisco.com/c/en/us/support/docs/ip/network-address-translation-nat/26704-nat-faq-00.html) [verify URL]

**4.2 NTP**: UDP 123. Stratum 0 is the reference clock and stratum 1 is directly attached. Max usable stratum is 15; 16 means unsynchronized. Modes: client, server (`ntp master [stratum]`), peer (symmetric active), broadcast — [RFC 5905](https://www.rfc-editor.org/rfc/rfc5905) [std]
```
ntp server 192.0.2.1 [prefer]
ntp master 3
ntp authenticate ; ntp authentication-key 1 md5 KEY ; ntp trusted-key 1
clock timezone CET 1 ; service timestamps log datetime msec
show ntp status | show ntp associations | show clock detail
```

**4.3 DHCP**: DORA = **Discover** (client broadcast, src 0.0.0.0 → 255.255.255.255), **Offer**, **Request** (broadcast), **Ack**. UDP 67 server, 68 client — [RFC 2131](https://www.rfc-editor.org/rfc/rfc2131) [std]. Other messages: NAK, Decline (address conflict), Release, Inform.
```
ip dhcp excluded-address 192.168.1.1 192.168.1.10
ip dhcp pool LAN
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 8.8.8.8
 domain-name example.local
 lease 7
interface g0/1 ; ip helper-address 10.0.0.5      ! relay on the CLIENT-facing interface
interface g0/0 ; ip address dhcp                 ! router as DHCP client
show ip dhcp binding | show ip dhcp pool | show ip dhcp conflict | show ip dhcp server statistics
```
- ARP: request is broadcast (target MAC 0000.0000.0000 in the payload, dst FFFF.FFFF.FFFF), reply is unicast. `show ip arp`, `arp -a`. Gratuitous ARP — [RFC 826](https://www.rfc-editor.org/rfc/rfc826)
- IPv6: SLAAC, stateless DHCPv6 (RA O-flag), stateful DHCPv6 (RA M-flag); `ipv6 dhcp relay destination`.

**4.4 DNS**: A, AAAA, CNAME, MX, PTR, NS, SOA. UDP 53 for queries, TCP 53 for zone transfer or large responses. IOS: `ip domain-lookup`, `ip name-server`, `no ip domain-lookup` (stops mistyped commands from triggering DNS lookups).

**4.5 SNMP**
| Version | Security | Notes |
|---|---|---|
| v1 | community string, cleartext | Get, GetNext, Set, Trap |
| v2c | community string, cleartext | adds GetBulk, Inform (acknowledged) |
| v3 | users/groups; noAuthNoPriv, authNoPriv, **authPriv** (auth + encryption) | the only secure version |
Agent on UDP 161, manager receives traps/informs on UDP 162; MIB/OID — [RFC 3411](https://www.rfc-editor.org/rfc/rfc3411) [std]
```
snmp-server community RO_STR ro 10       ! ACL 10
snmp-server host 10.0.0.9 version 2c TRAP_STR
snmp-server group G1 v3 priv ; snmp-server user U1 G1 v3 auth sha AUTHPW priv aes 128 PRIVPW
```

**4.6 Syslog severities (RFC 5424; Cisco identical)**
| # | Keyword | # | Keyword |
|---|---|---|---|
| 0 | emergencies | 4 | warnings |
| 1 | alerts | 5 | notifications |
| 2 | critical | 6 | informational |
| 3 | errors | 7 | debugging |
Mnemonic: "**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce-cream **D**aily". Setting level N logs N **and all lower numbers** (more severe). Message format: `seq: timestamp: %FACILITY-SEVERITY-MNEMONIC: description`, e.g., `%LINK-3-UPDOWN` — [RFC 5424](https://www.rfc-editor.org/rfc/rfc5424); [Cisco Syslog Severity Levels](https://docs.manage.security.cisco.com/r_syslog_severity_levels.html); [NetworkLessons syslog](https://networklessons.com/tag/syslog/cisco-ios-syslog-messages). Console default level is debugging (7). The `logging trap` default is informational on modern IOS, but sources conflict, so verify with `show logging` — [Flackbox](https://www.flackbox.com/cisco-syslog-tutorial); [O'Reilly IOS in a Nutshell (lists disabled)](https://www.oreilly.com/library/view/cisco-ios-in/156592942X/re490.html)
```
logging host 10.0.0.50 ; logging trap warnings ; logging console informational
logging buffered 16384 debugging ; logging monitor debugging ; terminal monitor   ! VTY sessions
logging synchronous (line con 0) ; show logging
```

**4.7 QoS**
| Field | Where | Bits | Values |
|---|---|---|---|
| CoS / PCP | 802.1Q tag (L2) | 3 | 0-7 (voice = 5) |
| IP Precedence | ToS byte first 3 bits | 3 | 0-7 |
| DSCP | ToS/Traffic Class first 6 bits | 6 | 0-63 |

| PHB | DSCP | Typical use |
|---|---|---|
| EF | **46** | Voice bearer (RFC 3246) |
| AF41 / AF42 / AF43 | 34 / 36 / 38 | Interactive video |
| AF31 | 26 | Call signaling/mission-critical (Cisco older: CS3 24 for signaling) |
| AF21 | 18 | Transactional data |
| AF11 | 10 | Bulk data |
| CS6 | 48 | Network control (routing protocols) |
| CS0 / DF | 0 | Best effort |
AF formula: DSCP = 8×class + 2×drop (AFxy, where a higher y means a higher drop probability). CSx = 8×x — [IANA DSCP registry](https://www.iana.org/assignments/dscp-registry); [RFC 2474](https://www.rfc-editor.org/rfc/rfc2474); [RFC 2597 AF](https://www.rfc-editor.org/rfc/rfc2597); [RFC 3246 EF](https://www.rfc-editor.org/rfc/rfc3246); [Wikipedia DiffServ](https://www.wikipedia.org/wiki/DiffServ); [RFC 4594 guidelines](https://www.rfc-editor.org/rfc/rfc4594). CoS 5 ↔ EF mapping is a convention — [Cisco community QoS comparison](https://community.cisco.com/t5/collaboration-knowledge-base/how-to-compare-qos-values-for-ip-precedence-dscp-and-mpls-exp/ta-p/3132322)
- Concepts tested: classification and marking, trust boundary (at the IP phone/access switch), queuing (CBWFQ + LLQ = strict priority queue for voice), congestion avoidance (WRED, tail drop, TCP global synchronization), **policing** (drops/re-marks excess and causes no delay; usually at the ISP edge) vs **shaping** (buffers excess and adds delay; usually at the customer egress). Voice targets: one-way delay ≤150 ms, jitter ≤30 ms, loss ≤1% (Cisco design guidance) [verify].

**4.8 SSH and remote access**
```
hostname R1
ip domain-name example.local
crypto key generate rsa modulus 2048       ! hostname + domain name required first
ip ssh version 2
username admin privilege 15 secret STRONGPW
line vty 0 15
 login local
 transport input ssh
 access-class 10 in                        ! restrict VTY sources (std ACL)
 exec-timeout 5 0
show ip ssh | show ssh
```
- TFTP (UDP 69, no authentication) vs FTP (TCP 20/21, username/password): `copy tftp: flash:`, `copy running-config tftp:`, `ip ftp username/password`. `show flash`, `show version`, boot system.

### Inferences
- This domain weighs 10% but its commands (NAT, DHCP relay) show up in labs. Put the inside/outside terminology and DORA in interactive diagrams.

### Gaps
- The exact URL of Cisco's NAT config guide and the voice QoS thresholds were not verified live.

### Common traps (Domain 4)
- `ip nat inside`/`outside` placed on the wrong interfaces. Missing `overload` gives dynamic NAT instead of PAT, so the pool runs out.
- Inside **global** is the public address of an inside host. Students often swap local and global.
- `ip helper-address` goes on the interface **facing the clients**, not the server.
- Excluded addresses are set **globally**, outside the pool.
- Syslog "level 4" includes 0-4. A higher number means **less** severe.
- SNMPv2c is not encrypted. Only v3 authPriv encrypts. Informs are acknowledged and traps are not.
- Policing drops traffic, shaping delays it. LLQ is the priority queue.
- EF = 46 = binary 101110. AF41 = 34.
- `crypto key generate rsa` fails without a hostname that is not "Router" and without `ip domain-name`.
- NTP stratum 16 means unsynchronized, not "very accurate".

---

## 5. Domain 5: Security Fundamentals (15%)

### Takeaway
This domain covers security concepts (threats, vulnerabilities, exploits, mitigation; CIA; social engineering), password policy and MFA, AAA, VPNs (site-to-site IPsec vs remote-access), ACL configuration (standard/extended/named; placement; implicit deny; wildcards), Layer 2 security (port security, DHCP snooping, DAI), and wireless security (WPA2/WPA3, PSK vs Enterprise/802.1X).

### Cited Findings / Reference tables

**5.1 Device access security**
```
enable secret STRONGPW                    ! type 9 (scrypt)/8/5; overrides enable password
service password-encryption               ! type 7, weak (reversible)
security passwords min-length 10
login block-for 120 attempts 3 within 60
banner motd # Authorized only #
username admin algorithm-type scrypt secret PW
```
Password type summary: 0 = clear, 5 = MD5, 7 = Vigenère (reversible), 8 = PBKDF2-SHA256, 9 = scrypt [std; Cisco IOS password types].

**5.2 AAA**: Authentication (who), Authorization (what), Accounting (what was done).
| | RADIUS | TACACS+ |
|---|---|---|
| Transport | UDP 1812/1813 (legacy 1645/1646) | TCP 49 |
| Encryption | password field only | entire payload |
| AAA separation | combines authN + authZ | separates all three |
| Typical use | network access (802.1X, VPN, Wi-Fi) | device administration (command authorization) |
| Standard | IETF RFC 2865 | Cisco-originated, RFC 8907 |
[std] — [RFC 2865](https://www.rfc-editor.org/rfc/rfc2865); [RFC 8907](https://www.rfc-editor.org/rfc/rfc8907)
```
aaa new-model
radius server RAD1 ; address ipv4 10.0.0.20 auth-port 1812 acct-port 1813 ; key SECRET
tacacs server TAC1 ; address ipv4 10.0.0.21 ; key SECRET
aaa authentication login default group tacacs+ local
aaa authorization exec default group tacacs+ local
aaa accounting exec default start-stop group tacacs+
```
- 802.1X roles: **supplicant** (client), **authenticator** (switch/AP/WLC), **authentication server** (RADIUS, e.g., ISE). Uses EAP over LAN (EAPoL) on the client side and RADIUS on the server side.

**5.3 ACLs**
| Type | Number range | Matches | Placement |
|---|---|---|---|
| Standard | 1-99, 1300-1999 | Source IP only | Close to **destination** |
| Extended | 100-199, 2000-2699 | Protocol, src/dst IP, ports, flags | Close to **source** |
| Named (std/ext) | name | same | same; supports seq-number edits |
- Processed top-down, first match wins, **implicit `deny any`** at the end. One ACL per interface, per direction, per protocol. Wildcard: 0 = must match. `host x` = 0.0.0.0, `any` = 255.255.255.255.
```
access-list 10 permit 192.168.1.0 0.0.0.255
ip access-list extended WEB
 10 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.80 eq 443
 20 deny ip any any log
 15 permit icmp any any echo-reply            ! insert by sequence number
interface g0/1 ; ip access-group WEB in
line vty 0 15 ; access-class 10 in             ! VTY uses access-class, not access-group
show access-lists | show ip access-lists | show ip interface g0/1
ipv6 access-list V6 ; ipv6 traffic-filter V6 in   ! IPv6 (implicit permits for NDP)
```

**5.4 Layer 2 security**
| Feature | Key facts | Commands |
|---|---|---|
| Port security | Access (or trunk) port only. Default max **1** MAC. Default violation **shutdown** (err-disabled); others: **restrict** (drop + log + counter), **protect** (silent drop). Sticky learning saves MACs to running-config | `switchport port-security`; `... maximum 2`; `... violation restrict`; `... mac-address sticky`; `show port-security [interface g0/1]`; `show port-security address` |
| DHCP snooping | All ports **untrusted** by default. Trust uplinks and the server-facing port. Drops server messages (OFFER/ACK) on untrusted ports. Builds the binding table. Option 82 insert is on by default (it can break relays; `no ip dhcp snooping information option`) | `ip dhcp snooping`; `ip dhcp snooping vlan 10`; `ip dhcp snooping trust` (int); `ip dhcp snooping limit rate 10`; `show ip dhcp snooping [binding]` |
| Dynamic ARP Inspection | Needs the DHCP snooping binding table (or ARP ACLs for static hosts). Untrusted by default. Checks the sender IP/MAC in ARP. Optional validate src-mac/dst-mac/ip | `ip arp inspection vlan 10`; `ip arp inspection trust`; `ip arp inspection validate src-mac ip`; `show ip arp inspection` |
— [Cisco Catalyst security config guides] [std; Cisco defaults widely documented, not fetched live]

**5.5 VPNs**: Site-to-site IPsec (router to router, transparent to hosts). Remote access via TLS/SSL (AnyConnect/Secure Client) or IPsec. IPsec components: IKE (UDP 500/4500 NAT-T), ESP (IP proto 50, encryption + integrity), AH (proto 51, integrity only, breaks NAT). GRE over IPsec carries multicast/routing protocols. DMVPN is awareness level only.

**5.6 Wireless security**
| | WPA | WPA2 | WPA3 |
|---|---|---|---|
| Year | 2003 | 2004 | 2018 |
| Encryption | TKIP (RC4) | **CCMP (AES-128)** | **GCMP-256** (Enterprise 192-bit mode); CCMP-128 otherwise |
| Personal auth | PSK | PSK (4-way handshake, offline-dictionary-attack prone) | **SAE** (Dragonfly; forward secrecy; resists offline guessing) |
| Enterprise | 802.1X/EAP | 802.1X/EAP | 802.1X + optional 192-bit (CNSA) mode |
| PMF (802.11w) | — | optional | **mandatory** |
WEP (RC4, 40/104-bit keys) is broken. Open networks can use OWE / "Enhanced Open". WPA3 transition mode allows WPA2 clients — [TechTarget WPA3](https://www.techtarget.com/searchsecurity/definition/WPA3); [Intel WPA3 whitepaper](https://www.intel.com/content/dam/support/us/en/documents/wireless/intel-whitepaper-wifi-security-through-wpa3-verification.pdf); [HPE Aruba security modes](https://arubanetworking.hpe.com/techdocs/aos/wifi-design-deploy/security/modes/_print/); [HotHardware WFA announcement](https://www.hothardware.com/news/wifi-alliance-announces-wpa3-most-significant-security-upgrade-over-decade). Intel notes the WFA requires WPA3 for new certifications since 1 July 2020.
- EAP methods to recognize: EAP-TLS (certs on both sides), PEAP (server cert + MSCHAPv2 in a tunnel), EAP-FAST (Cisco, PAC), LEAP (legacy and broken).

**5.7 Security program concepts**: user awareness, training, physical access control. Threat types: DoS/DDoS, spoofing, reflection/amplification, MITM, reconnaissance, malware (virus/worm/trojan/ransomware), phishing/spear phishing/whaling/vishing/smishing, password attacks (brute force, dictionary). MFA factors: something you know, have, or are. Digital certificates/PKI and biometrics at concept level.

### Inferences
- The most common lab tasks here are port security plus ACLs. Build an "ACL wildcard trainer" and a "predict the err-disable" exercise.

### Gaps
- I could not fetch Cisco's Catalyst 9000 security configuration guide to re-confirm defaults such as port-security aging and Option 82 behavior.

### Common traps (Domain 5)
- Standard ACL near the destination, extended near the source.
- Implicit deny means an ACL with only `deny` lines blocks **everything**.
- Wildcard ≠ subnet mask (e.g., /26 → 0.0.0.63).
- `access-class` on VTY vs `ip access-group` on interfaces.
- Port security default is 1 MAC + shutdown. Recovery is `shutdown`/`no shutdown` or `errdisable recovery cause psecure-violation`.
- DAI depends on DHCP snooping, and DHCP snooping needs uplinks trusted.
- TACACS+ encrypts the entire packet (TCP 49). RADIUS encrypts only the password (UDP).
- WPA2 = AES-CCMP; TKIP = WPA (deprecated). WPA3-Personal = SAE, not PSK.
- `service password-encryption` (type 7) is reversible; use `secret`.

---

## 6. Domain 6: Automation and Programmability (10%)

### Takeaway
This domain is conceptual. It asks how automation changes management, and covers traditional vs controller-based networking, SDN architecture (underlay/overlay/fabric; northbound/southbound APIs), Catalyst Center (DNA Center) vs traditional management, REST API characteristics (CRUD, HTTP verbs, encoding), configuration management tools (Ansible, Terraform, plus Puppet/Chef in older material), and reading JSON. v1.1 adds generative AI/ML awareness (objective 6.x) — [Achievable v1.1 topics](https://achievable.me/exams/ccna/resources/ccna-exam-topics/) [verify exact wording].

### Cited Findings / Reference tables

**6.1 Planes**
| Plane | Function | Examples |
|---|---|---|
| Data (forwarding) | Forward packets | Switching frames, ACL/NAT applied, encapsulation |
| Control | Build the forwarding tables | OSPF, STP, ARP, CDP |
| Management | Configure/monitor | SSH, SNMP, syslog, NTP |

**6.2 SDN**: centralized controller. **Northbound API** = controller to apps (usually REST). **Southbound API** = controller to devices (OpenFlow, NETCONF, RESTCONF, OpFlex, CLI/SSH, SNMP). Underlay = physical IP network. Overlay = virtual tunnels (VXLAN, LISP in SD-Access). Fabric = both together. Cisco SD-Access uses Catalyst Center + ISE; control plane LISP, data plane VXLAN, policy via SGT (TrustSec) [std; Cisco SD-Access design guides].

**6.3 REST APIs**
| HTTP verb | CRUD | Notes |
|---|---|---|
| POST | Create | |
| GET | Read | Safe/idempotent |
| PUT | Update (replace) | Idempotent |
| PATCH | Update (partial) | |
| DELETE | Delete | Idempotent |

| Status | Meaning | Status | Meaning |
|---|---|---|---|
| 200 OK | success | 400 Bad Request | malformed |
| 201 Created | resource made (POST) | 401 Unauthorized | missing/invalid auth |
| 204 No Content | success, empty body | 403 Forbidden | authenticated, no permission |
| 301/302 | redirect | 404 Not Found | |
| 1xx informational | | 500 / 503 | server error / unavailable |
REST constraints: client-server, **stateless**, cacheable, uniform interface, layered system, code-on-demand (optional). Auth: Basic, API key/token, OAuth — [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) [std]; [Fielding dissertation ch.5](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

**6.4 Data formats / JSON** — [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) [std]
- Value types: string ("double quotes only"), number, boolean (`true`/`false` lowercase), `null`, **object** `{ "key": value }`, **array** `[ ... ]`. Keys must be strings in double quotes. No trailing commas, no comments. Whitespace is insignificant.
- Example to parse:
```json
{ "interface": { "name": "GigabitEthernet1", "enabled": true, "ipv4": [ {"ip": "10.1.1.1", "mask": "255.255.255.0"} ], "mtu": 1500, "description": null } }
```
- Compare with XML (tags; used by NETCONF) and YAML (indentation; Ansible playbooks). NETCONF: SSH TCP **830**, XML, YANG models. RESTCONF: HTTPS, JSON/XML, YANG — [RFC 6241](https://www.rfc-editor.org/rfc/rfc6241); [RFC 8040](https://www.rfc-editor.org/rfc/rfc8040)

**6.5 Config management tools**
| Tool | Agent? | Language / file | Model | Transport |
|---|---|---|---|---|
| Ansible | **Agentless** | YAML playbooks, inventory | Push | SSH (or NETCONF/API) |
| Terraform | Agentless | HCL | Declarative, state file; mainly provisioning (IaC) | Provider APIs |
| Puppet | Agent (Puppetfile/manifest, Ruby DSL) | manifests | Pull (agent port 8140) | HTTPS |
| Chef | Agent | Ruby recipes/cookbooks | Pull | HTTPS |
[std; vendor docs] — [Ansible docs: network getting started](https://docs.ansible.com/ansible/latest/network/getting_started/index.html); [Terraform intro](https://developer.hashicorp.com/terraform/intro) [verify Puppet port]

**6.6 AI/ML awareness (v1.1 objective)**: predictive AI vs generative AI; AIOps for anomaly detection and baselining (e.g., Catalyst Center AI Network Analytics). v2.0 expands this into agentic AI and prompting — [AJS Networking](https://www.ajsnetworking.com/new-ccna-v2-2027/).

### Inferences
- Beginners need a "JSON lint" mini-exercise and a REST verb/status matching drill. A real API call against the Cisco DevNet sandbox is a valuable optional lab.

### Gaps
- I could not confirm the exact v1.1 wording of the AI/ML sub-objective from Cisco.

### Common traps (Domain 6)
- Northbound and southbound get swapped. Southbound points **down to devices**.
- 401 is an authentication problem and 403 is an authorization problem.
- PUT replaces the whole resource and PATCH modifies part of it. POST is not idempotent.
- JSON needs double quotes, lowercase `true`, and no trailing commas. An array is `[]` and an object is `{}`.
- Ansible is agentless and push-based, while Puppet and Chef are agent-based and pull-based.
- NETCONF uses XML over SSH port 830, not HTTP.

---

## 7. "Beyond CCNA" extension topics (bridge to CCNP ENCOR 350-401)

### Takeaway
The most valuable extensions follow directly from each CCNA domain and match the ENCOR blueprint: multi-area OSPF/OSPFv3, EIGRP, BGP basics, VRF-Lite, MST and STP tuning, wireless roaming/RF design, SD-WAN/SD-Access, 802.1X/ISE, CoPP, NETCONF/RESTCONF with YANG, Python + Ansible/Terraform, and telemetry.

### Cited Findings
- The ENCOR exam covers architecture, virtualization (VRF, GRE/IPsec, LISP, VXLAN), infrastructure (L2: trunking, EtherChannel, RSTP/MST; L3: EIGRP vs OSPF, OSPF multi-area, eBGP; wireless; IP services), network assurance, security and automation — [Cisco ENCOR topics (cisco.com, not fetched)](https://learningnetwork.cisco.com/s/encor-exam-topics) [verify; fetch blocked]

| CCNA domain | Extension topic (ENCOR-level) | Why valuable |
|---|---|---|
| 1 Fundamentals | Spine-leaf + VXLAN/EVPN; IPv6 deep (DHCPv6-PD, RA guard); virtualization (VRF-Lite, GRE) | Data center and cloud design |
| 2 Access | MST (802.1s), STP toolkit (Loop Guard, UDLD, BPDU Filter), LACP tuning, Wi-Fi RF design and roaming (802.11k/v/r), Catalyst 9800 WLC | Production LAN/WLAN |
| 3 Connectivity | Multi-area OSPF (LSA types 1-7, stub/NSSA, summarization), OSPFv3, EIGRP (DUAL, FD/RD, feasible successor), **BGP basics** (eBGP neighbor, AS-path, attributes order), redistribution, PBR | ENCOR core and real WANs |
| 4 Services | QoS MQC (class-map/policy-map/service-policy), IP SLA + object tracking, NetFlow/Flexible NetFlow, SPAN/RSPAN/ERSPAN, multicast (IGMP, PIM) | Assurance section of ENCOR |
| 5 Security | 802.1X/MAB/ISE deep dive, CoPP, uRPF, IPsec/DMVPN, Zone-Based Firewall, MACsec, TrustSec/SGT | Zero trust/NAC |
| 6 Automation | Python (netmiko, requests), NETCONF/RESTCONF + YANG, Ansible playbooks for IOS-XE, Terraform providers, model-driven telemetry (gNMI), EEM, Git/CI | DevNet/ENAUTO path |
| Cross-domain | SD-WAN (Catalyst SD-WAN: vManage/Manager, vSmart/Controller, vBond/Validator, OMP, TLOC), SD-Access (LISP+VXLAN+SGT) | Explicitly in ENCOR |

### Inferences
- The suggested order for a beginner track after CCNA: multi-area OSPF → EIGRP → BGP basics → VRF-Lite → MST/STP toolkit → 802.1X → QoS MQC → SD-WAN/SD-Access concepts → Python/NETCONF/Ansible. This follows dependency order.
- v2.0's AI-ops emphasis suggests adding an "AI-assisted troubleshooting" lab track (validating AI-suggested configurations).

### Gaps
- I could not open the ENCOR v1.1 blueprint to cite exact weights. Treat the mapping above as a curriculum design inference anchored to well-known ENCOR coverage.
