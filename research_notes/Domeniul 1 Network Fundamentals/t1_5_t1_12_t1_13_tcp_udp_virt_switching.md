# CCNA 200-301 v1.1 — 1.5 Compare TCP to UDP · 1.12 Virtualization fundamentals · 1.13 Switching concepts

> Research notes for lesson writing (absolute-beginner learner). Notes in English.
> Convention: facts in **Cited Findings** were checked this session against the linked page. Items under **Inferences → Background knowledge** are standard textbook material (Odom OCG / Cisco docs) that I did NOT re-fetch this session — they are very well established, but values flagged **[verify]** must be checked before publishing. Sample CLI outputs are *illustrative reconstructions* in IOS format, not captured from real gear (warn the learner, as per CLAUDE.md).
> Tool limits: commons.wikimedia.org and en.wikipedia.org API were not reachable from this environment (url_not_found / proxy rejected), so most image candidates are [verify].

---

## 1.5 Compare TCP to UDP

### Takeaway
TCP (RFC 9293) is connection-oriented and reliable: 3-way handshake, 32-bit sequence/ack numbers, sliding window flow control, retransmission, plus congestion control (RFC 5681, slow start); header 20–60 bytes. UDP (RFC 768) is connectionless "best effort": fixed 8-byte header with 4 fields, no delivery/duplicate guarantees — chosen for low latency (voice/video, DNS queries, DHCP, TFTP, SNMP, syslog). Ports: 0–1023 well-known/system, 1024–49151 registered/user, 49152–65535 dynamic/ephemeral (IANA) — but Linux defaults to 32768–60999.

### Cited Findings

**TCP header (RFC 9293 §3.1)**
- Source Port 16 bits; Destination Port 16 bits — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- Sequence Number 32 bits; when SYN is set it carries the ISN (Initial Sequence Number) and the first data byte is ISN+1 — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- Acknowledgment Number 32 bits, valid only when ACK flag set (= next sequence number the receiver expects) — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- Data Offset 4 bits = header length in 32-bit words (so min 5 → 20 bytes; max 15 → 60 bytes); Reserved 4 bits (must be zero) — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html); options "up to 40 bytes" — [Wikipedia TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
- Control bits (8 × 1 bit): CWR, ECE (both from RFC 3168, ECN), URG, ACK, PSH, RST, SYN, FIN — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- Window 16 bits, unsigned; shifted when Window Scale option (RFC 7323) is used — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html). Base max 65,535 bytes; scale factor 0–14 → max ≈1 GiB — [Wikipedia TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
- Checksum 16 bits, "never optional" in TCP; covers a pseudo-header (IPv4 96 bits / IPv6 320 bits) + header + data — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- Urgent Pointer 16 bits (only if URG set); Options variable (present when DOffset > 5) — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- Mandatory-to-implement options: End of Option List (kind 0), NOP (kind 1), MSS (kind 2, length 4, 2-byte value). MSS option is sent ONLY in SYN segments — [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- Default send MSS if none received: **536 bytes for IPv4 (576−40)**, **1220 for IPv6 (1280−60)** — [RFC 9293 §3.7.1](https://www.rfc-editor.org/rfc/rfc9293.html)

**Connection lifecycle**
- 3-way handshake (RFC calls it "3WHS"): A → SYN (ISN_A); B → SYN+ACK (ISN_B, ack ISN_A+1); A → ACK (ack ISN_B+1) — [RFC 9293 §3.4.1, §3.5](https://www.rfc-editor.org/rfc/rfc9293.html)
- Close is simplex (each direction closed independently): closing side sends FIN → FIN-WAIT-1; the other side ACKs, later sends its own FIN, which is ACKed → this is the "4-way" termination; simultaneous close also defined — [RFC 9293 §3.6](https://www.rfc-editor.org/rfc/rfc9293.html)
- The active closer lingers in TIME-WAIT for 2×MSL; MSL defined as 2 minutes in the spec — [RFC 9293 §3.4.2, §3.6.1](https://www.rfc-editor.org/rfc/rfc9293.html)
- RST: valid if its sequence number is in the window (in SYN-SENT, if it ACKs the SYN) — [RFC 9293 §3.5.3](https://www.rfc-editor.org/rfc/rfc9293.html)
- 11 TCP states: LISTEN, SYN-SENT, SYN-RECEIVED, ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, CLOSING, LAST-ACK, TIME-WAIT, CLOSED — [Wikipedia TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)

**Flow control vs congestion control, retransmission**
- Flow control = end-to-end sliding window; receiver advertises how much it can buffer; sender waits for ACKs/window updates — [Wikipedia TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
- Congestion control (required, RFC 5681) protects the *network*; algorithms: slow start, congestion avoidance, fast retransmit, fast recovery; sending is limited by slow start — [RFC 9293 §2, §3.7.4](https://www.rfc-editor.org/rfc/rfc9293.html); [Wikipedia TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
- Fast retransmit: 3 duplicate ACKs → resend the missing segment without waiting for timer — [Wikipedia TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
- RTO: initial timer = smoothed RTT + max(granularity, 4×RTT variation); doubled at each retransmission (exponential backoff) — [Wikipedia TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)

**UDP (RFC 768)**
- Header = 8 bytes, 4 × 16-bit fields: Source Port (optional, 0 if unused), Destination Port, Length (header+data, minimum 8), Checksum — [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html)
- UDP checksum optional in IPv4 (all-zero = no checksum; a computed zero is sent as all ones) — [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html). (Note for deep dive: IPv6 makes UDP checksum mandatory — RFC 8200 [verify, not fetched].)
- "delivery and duplicate protection are not guaranteed"; apps needing reliable ordered delivery should use TCP — [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html)

**Ports (RFC 6335 §6, §8.1.2)**
- System/Well-Known 0–1023 (IANA assigned); User/Registered 1024–49151 (IANA assigned); Dynamic/Private/Ephemeral 49152–65535 (never assigned) — [RFC 6335](https://www.rfc-editor.org/rfc/rfc6335.html)
- Dynamic ports must not be used as service identifiers; software may use any available one — [RFC 6335](https://www.rfc-editor.org/rfc/rfc6335.html)
- OS default ephemeral ranges: Windows Vista/7/Server 2008 and later (incl. Win 11): 49152–65535; Windows XP and earlier: 1024–5000; Server 2003: 1025–5000 until MS08-037; Linux (kernel default): 32768–60999; FreeBSD ≥4.6: 49152–65535; Solaris/AIX: 32768–65535 — [Wikipedia Ephemeral port](https://en.wikipedia.org/wiki/Ephemeral_port). macOS not covered there [verify — commonly cited as 49152–65535].

### Inferences

**Background knowledge (not re-fetched; standard OCG content)**
- *Why TCP/UDP exist (history)*: TCP/IP was originally one protocol (Cerf & Kahn 1974); split into IP + TCP ~1978 so that applications like voice that prefer timeliness over reliability could use a thin transport → UDP (RFC 768, Aug 1980). TCP original spec RFC 793 (1981), obsoleted by RFC 9293 (Aug 2022). [verify dates]
- *Model context*: OSI L4 Transport = TCP/IP "Transport" layer. PDU names: L4 TCP = **segment**, L4 UDP = **datagram** (Cisco often just says segment for both), L3 = packet, L2 = frame, L1 = bits. Encapsulation: data → +TCP/UDP header → +IP header → +Ethernet header/trailer(FCS).
- *Socket* = IP address + transport protocol + port (e.g. 192.168.1.10:51000/TCP). A TCP connection is uniquely identified by the 5-tuple (protocol, src IP, src port, dst IP, dst port) — lets one PC open many tabs to the same server.
- *Multiplexing*: ports are how L4 delivers to the right application.
- *Worked seq/ack example (use in lesson)*:
  1. PC → Server: SYN, seq=1000 (ISN), no data.
  2. Server → PC: SYN+ACK, seq=5000, ack=1001.
  3. PC → Server: ACK, seq=1001, ack=5001.
  4. PC sends 1460 bytes: seq=1001 → Server ACKs ack=2461.
  5. PC sends 2 segments of 1000 bytes: seq=2461 and seq=3461; second lost → Server keeps ACKing 3461 (duplicate ACKs) → PC retransmits seq=3461 → Server ACK=4461.
  Rule: ACK = "next byte I expect"; SYN and FIN each consume 1 sequence number though they carry no data. (Real ISNs are random 32-bit numbers — Wireshark shows "relative" seq starting at 0.)
- *Windowing*: window = how many bytes can be "in flight" unacknowledged. Window grows if no loss (efficiency), shrinks on loss/receiver full. Window = 0 → sender stops (zero window, probes). Sliding window: as ACKs arrive the window slides forward.
- *Flow control vs congestion control*: flow control = protect the **receiver** (rwnd, advertised in Window field); congestion control = protect the **network** (cwnd, internal to sender, never on wire). Effective send window = min(rwnd, cwnd). Slow start: cwnd starts small (RFC 5681 initial ~2–4 MSS; RFC 6928 allows 10 [verify]) and roughly doubles each RTT until ssthresh or loss.
- *MSS vs MTU*: MSS = max TCP payload; on Ethernet MTU 1500 → MSS 1460 (1500 − 20 IP − 20 TCP). Cisco `ip tcp adjust-mss 1452` used with PPPoE (out of CCNA scope; deep dive only).
- *TCP features list (OCG table)*: multiplexing (ports), error recovery (seq/ack + retransmission), flow control (windowing), connection establishment/termination, ordered data transfer, segmentation. UDP: only multiplexing (+ optional checksum).
- *Connection-oriented vs connectionless*: TCP requires setup before data; UDP sends immediately. "Reliable" ≠ "secure" (no encryption in either).
- *Why UDP*: no handshake (lower latency), no retransmission (a late voice packet is useless), small header (8 vs 20+), supports broadcast/multicast (TCP cannot — needs a 1:1 connection), app can implement its own reliability (TFTP does lock-step ACK; QUIC does full reliability over UDP).
- *QUIC/HTTP/3*: QUIC (RFC 9000, 2021) runs over UDP/443, integrates TLS 1.3, avoids TCP head-of-line blocking; HTTP/3 = RFC 9114 (2022). So "HTTPS = TCP 443" is the CCNA answer, but modern browsers also use UDP 443. [verify RFC numbers]
- *Common ports table (exam set; standard IANA values)*:

| Protocol | Port(s) | Transport | Note |
|---|---|---|---|
| FTP data / control | 20 / 21 | TCP | 20 = active-mode data |
| SSH (and SCP/SFTP) | 22 | TCP | |
| Telnet | 23 | TCP | cleartext |
| SMTP | 25 | TCP | (587 submission) |
| DNS | 53 | UDP and TCP | UDP queries; TCP for zone transfers & large responses (>512 B classic / truncation) |
| DHCP (BOOTP) | 67 server / 68 client | UDP | broadcast-based → can't be TCP |
| TFTP | 69 | UDP | used for IOS images/configs |
| HTTP | 80 | TCP | |
| POP3 | 110 | TCP | |
| NTP | 123 | UDP | |
| IMAP | 143 | TCP | |
| SNMP agent / trap | 161 / 162 | UDP | |
| LDAP | 389 | TCP (UDP also) | optional |
| HTTPS | 443 | TCP (QUIC: UDP) | |
| Syslog | 514 | UDP | |
| RADIUS | 1812/1813 | UDP | (security topic 5.x) |
| TACACS+ | 49 | TCP | (security topic 5.x) |
| RDP | 3389 | TCP (UDP also) | |
| CAPWAP | 5246/5247 | UDP | link to topic 1.11 |

**Exam traps**
- DNS uses **both** UDP and TCP 53. TFTP = **UDP** 69 (FTP = TCP). SNMP = UDP. Syslog = UDP 514. DHCP = UDP 67/68.
- "Best effort" / "connectionless" / "no sequencing" → UDP. "Windowing", "sequencing", "acknowledgments", "three-way handshake" → TCP.
- UDP has a checksum (error *detection*) but no recovery — "UDP has no error checking" is false.
- ACK number = next expected byte, not last received.
- Flow control (receiver) ≠ congestion control (network).
- TCP header min 20 bytes; UDP header always 8.
- Ephemeral range: question may expect IANA 49152–65535.
- Handshake flags order: SYN → SYN/ACK → ACK; termination FIN → ACK → FIN → ACK (the middle two may be combined: FIN/ACK).

**Packet Tracer lab ideas**
- PC + Server (HTTP/DNS services enabled) on a switch; Simulation mode, filter TCP/HTTP/DNS; open web browser on PC → watch DNS (UDP 53) query/response, then TCP SYN, SYN/ACK, ACK, HTTP GET; click PDU → "Inbound/Outbound PDU details" shows TCP header fields (seq/ack/flags/window). PT shows TCP fields but values are simplified [verify in PT 8.2].
- Compare TFTP backup of router config (`copy running-config tftp:`) = UDP vs FTP = TCP in simulation.
- Optional real-world: Wireshark on own PC (`tcp.flags.syn==1`), `netstat -an` / `ss -tan` to see ephemeral ports & TIME_WAIT.

**Image candidates (Wikimedia Commons)**
- `File:Tcp state diagram fixed new.svg` — authors Sergiodc2, Marty Pauley, Scil100; license CC BY-SA 3.0/2.5/2.0/1.0 or GFDL 1.2+ (choose) — verified via mirror [osmand mirror of commons page](https://download.osmand.net/wiki/File:Tcp_state_diagram_fixed_new.svg). Deep-dive use only.
- `File:Tcp-handshake.svg` [verify existence, author, license — Commons unreachable]
- `File:TCP CLOSE.svg` [verify]
- `File:UDP header.svg` / `File:Tcp header.png` [verify]
- Recommendation: draw original SVGs (handshake ladder, header layouts) — simpler licensing, theme-aware colors.

### Gaps
- Commons file pages for handshake/header images not reachable; existence/license unverified.
- macOS ephemeral range not in fetched source.
- Exact PT 8.x rendering of TCP fields not verified.
- IANA registry not fetched directly; port table from standard knowledge (values are stable and well known).

---

## 1.12 Explain virtualization fundamentals (server virtualization, containers, and VRFs)

### Takeaway
A hypervisor lets multiple VMs share one physical server; Type 1 (bare-metal: ESXi, Hyper-V, Xen; KVM is borderline) vs Type 2 (hosted: VirtualBox, VMware Workstation). Containers virtualize the OS instead of the hardware (shared host kernel → lighter, faster). VRFs virtualize a router's Layer 3: one physical router holds multiple isolated routing tables, so overlapping IP ranges can coexist; `ip vrf forwarding` on an interface removes its IP address.

### Cited Findings
- Type-1/Type-2 classification comes from Robert P. Goldberg's 1973 thesis "Architectural Principles for Virtual Computer Systems" — [Wikipedia Hypervisor](https://en.wikipedia.org/wiki/Hypervisor)
- Type-1 (native/bare-metal) runs directly on hardware: Hyper-V, Xen, VMware ESXi. Type-2 (hosted) runs as a process on a conventional OS: VirtualBox, VMware Workstation — [Wikipedia Hypervisor](https://en.wikipedia.org/wiki/Hypervisor)
- The distinction "is not always clear": KVM and bhyve are kernel modules that effectively turn the host OS into a Type-1 hypervisor — [Wikipedia Hypervisor](https://en.wikipedia.org/wiki/Hypervisor)
- VRF-Lite config (legacy syntax) example: `ip vrf BLUE` / `description Trusted Traffic`; `ip vrf RED` / `description Guest Traffic`; interface `ip vrf forwarding RED` then re-enter `ip address`; works on 802.1Q subinterfaces (`encapsulation dot1Q 10` + `ip vrf forwarding BLUE`) — [PacketLife: Intro to VRF lite](https://packetlife.net/blog/2009/apr/30/intro-vrf-lite/)
- Exact IOS message when assigning VRF to an addressed interface: `% Interface FastEthernet1/0 IP address removed due to enabling VRF RED` — address must be reapplied — [PacketLife](https://packetlife.net/blog/2009/apr/30/intro-vrf-lite/)
- After all interfaces moved into VRFs, `show ip route` (global) is empty; `show ip route vrf BLUE` shows only BLUE's routes; plain `ping` fails (0/5) while `ping vrf BLUE <ip>` succeeds — troubleshooting commands must name the VRF — [PacketLife](https://packetlife.net/blog/2009/apr/30/intro-vrf-lite/)
- Use case: enterprise with trusted traffic via firewall (BLUE, VLAN 10) and guest traffic via separate ADSL (RED, VLAN 20) over the same routers; each VRF runs its own OSPF process (1 and 2) and own default route — [PacketLife](https://packetlife.net/blog/2009/apr/30/intro-vrf-lite/)
- Packet Tracer: a community answer concluded `ip vrf` was not supported in PT ("PT isn't a 100% solution for labs") — [TechExams/InfoSec community thread](https://community.infosecinstitute.com/discussion/120722/packet-tracer-vrf). Weak/old source; version not stated.

### Inferences

**Background knowledge (not re-fetched)**
- *Why server virtualization*: before ~2000s, "one app per server" → servers ~10–15% utilized [verify figure], lots of rack space/power/cooling. Virtualization = consolidation (many VMs per host), faster provisioning (minutes vs weeks), snapshots, live migration (vMotion), isolation, HA. Mainframe origins: IBM CP-40/CP-67 (1960s), VMware Workstation 1999, ESX 2001 [verify years].
- *Terms*: host (physical), guest (VM), VM = virtual CPU/RAM/disk (file, e.g. .vmdk/.vhdx)/vNIC; hypervisor a.k.a. VMM.
- *Networking inside host (OCG emphasis)*: each VM has ≥1 **vNIC** with its own MAC; vNICs connect to a **virtual switch (vSwitch)** in the hypervisor (VMware vSwitch/vDS, Hyper-V Virtual Switch, Linux bridge/Open vSwitch, Cisco Nexus 1000V historically); vSwitch supports VLANs — the physical NICs (**uplinks**) are typically 802.1Q trunks to the physical data-center switch (ToR); often multiple uplinks teamed/EtherChannel for redundancy. Traffic VM↔VM on the same host & VLAN never leaves the host.
- *Data center physical*: servers in racks, ToR/EoR switches; leaf-spine (links to topic 1.2). 
- *Containers*: package app + libraries/dependencies, NOT a full guest OS; all containers on a host share the **host OS kernel** (Linux namespaces + cgroups for isolation/limits). Result: MB vs GB size, start in seconds/ms vs minutes, higher density; weaker isolation than VM; Linux container needs Linux kernel (Docker Desktop on Windows/macOS runs a small Linux VM). **Image** = read-only template (layers, built from Dockerfile, stored in a registry e.g. Docker Hub); **container** = running instance of an image. **Docker** (2013) popularized it; container runtime (containerd/runc, OCI standards). **Kubernetes** (Google, 2014, now CNCF) = orchestration: schedules containers (in **pods**) across a cluster of nodes, scaling, self-healing, service discovery/load balancing. Docker Swarm alternative. [verify years]
- *Common exam phrasing*: "Which virtualization shares the host OS kernel?" → containers. "Which hypervisor runs directly on hardware?" → Type 1. VM includes its own OS; container does not.
- *NFV (Network Functions Virtualization)*: network functions (router, firewall, WLC, load balancer) as software VMs/containers on standard x86 servers instead of dedicated appliances — e.g. Cisco CSR 1000v → Catalyst 8000V, ASAv, Catalyst 9800-CL (virtual WLC — link to topic 1.11), FTDv. ETSI NFV ISG started 2012. [verify]
- *VRF concept*: Virtual Routing and Forwarding = multiple independent routing tables (RIB+FIB/CEF) on one router; each interface (physical, subinterface, SVI) belongs to exactly one VRF (or the global table). Packets arriving in VRF A are looked up only in A's table → isolation without separate hardware; **overlapping IP addresses** allowed (two customers both use 10.0.0.0/24). Analogy: one building, several companies each with their own private phonebook.
- *VRF-Lite vs MPLS L3VPN*: VRF-Lite = VRFs without MPLS; separation carried hop-by-hop with VLAN/subinterfaces per VRF between routers (doesn't scale well). MPLS L3VPN (service providers, RFC 4364): PE routers hold customer VRFs, MP-BGP carries routes with **Route Distinguisher (RD)** (makes overlapping prefixes unique) and **Route Targets (RT)** (import/export policy); P routers know no customer routes. CCNA = concept only.
- *Use cases*: multi-tenant data center/cloud, service providers, guest vs corporate separation, management VRF (Cisco switches often have `Mgmt-vrf` on Gi0/0 out-of-band port; Nexus `management` VRF) [verify names per platform], merging companies with overlapping addressing.
- *Modern IOS/IOS-XE syntax* (multiprotocol VRF):
```
vrf definition CUST-A          ! create VRF (new syntax)
 rd 65000:1                    ! optional for VRF-Lite on most IOS-XE [verify; older IOS required rd before AF]
 address-family ipv4           ! enable IPv4 in this VRF
 exit-address-family
!
interface GigabitEthernet0/0/1
 vrf forwarding CUST-A         ! put interface in VRF → IP removed!
 ip address 10.1.1.1 255.255.255.0
!
ip route vrf CUST-A 0.0.0.0 0.0.0.0 10.1.1.254   ! static route inside VRF
router ospf 10 vrf CUST-A                         ! routing process per VRF
```
  Legacy syntax: `ip vrf CUST-A` + interface `ip vrf forwarding CUST-A` (IPv4 only). Message on new syntax: `% Interface GigabitEthernet0/0/1 IPv4 disabled and address(es) removed due to enabling VRF CUST-A` [verify exact wording].
- *Verification commands*: `show vrf` / `show ip vrf [brief|interfaces]`, `show ip route vrf CUST-A`, `ping vrf CUST-A 10.1.1.254`, `traceroute vrf …`, `show ip interface brief` (doesn't show VRF), `show run vrf CUST-A`.
- *Illustrative outputs (reconstructed, IOS-XE style)*:
```
R1# show vrf
  Name                             Default RD            Protocols   Interfaces
  CUST-A                           65000:1               ipv4        Gi0/0/1
  CUST-B                           65000:2               ipv4        Gi0/0/2

R1# show ip route vrf CUST-A
Routing Table: CUST-A
Codes: L - local, C - connected, S - static, ...
Gateway of last resort is 10.1.1.254 to network 0.0.0.0
S*    0.0.0.0/0 [1/0] via 10.1.1.254
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0/1
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0/1

R1# show ip route vrf CUST-B
Routing Table: CUST-B
...
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0/2   <- same subnet, no conflict
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0/2

R1# ping vrf CUST-A 10.1.1.254
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.1.254, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms
```

**Exam traps**
- Type 1 = bare metal (ESXi, Hyper-V, KVM*, Xen); Type 2 = runs on host OS (VirtualBox, Workstation/Fusion, Parallels). Hyper-V is Type 1 even though you "install it on Windows".
- Containers share the host kernel; VMs each have their own OS. Kubernetes = orchestrator, Docker = container engine/platform (not a hypervisor).
- VRF ≠ VLAN: VLAN segments L2; VRF segments L3 routing tables. VRF allows overlapping IPs; global table can't.
- Applying `vrf forwarding` erases the interface IP → must reconfigure.
- `ping`/`show ip route` without `vrf` keyword look at the global table → "it doesn't work" false negatives.
- vSwitch exists in software inside the hypervisor; physical switch port toward host is usually a trunk.

**Packet Tracer lab ideas**
- VRF in PT: evidence suggests **not supported** (at least older versions) — [community thread](https://community.infosecinstitute.com/discussion/120722/packet-tracer-vrf) [verify in PT 8.2.x: try `vrf definition` on ISR4331 and `ip vrf` on 2911]. Recommend VRF-Lite lab in **GNS3/EVE-NG/CML** (IOSv / CSR1000v / Cat8000v): 1 router, two "customers" with identical 192.168.1.0/24 LANs, show both tables, show the IP-removed message, show ping fail vs `ping vrf` success.
- Virtualization in PT: PT has no hypervisor; could model a server rack with "server" devices and a switch trunk; better as conceptual animation in app (VM stack vs container stack).
- Real-world optional lab: VirtualBox (Type 2) on learner's PC with 2 VMs on an "Internal Network"; `docker run hello-world` on the Raspberry Pi 4 (Docker runs on ARM64) to see an image being pulled.

**Image candidates (Wikimedia Commons) — all [verify] (Commons unreachable this session)**
- `File:Hyperviseur.svg` (Type 1 vs Type 2 diagram, FR labels) [verify]
- `File:Docker-containerized-and-vm-transparent-bg.png` [verify]
- `File:Kubernetes logo without workmark.svg` — logo; avoid or use unmodified [verify]
- `File:Virtual Routing and Forwarding.svg` [verify]
- Recommendation: original SVGs (VM stack vs container stack; one router with two colored routing tables).

### Gaps
- No official Cisco VRF-Lite config guide page fetched (only PacketLife, a reputable community source); exact `vrf definition` warning text and whether `rd` is required on current IOS-XE need verification.
- Docker/Kubernetes/VMware official docs not fetched (tool budget); container facts above are background knowledge.
- PT VRF support unverified for current PT versions.

---

## 1.13 Describe switching concepts (a. MAC learning and aging · b. Frame switching · c. Frame flooding · d. MAC address table)

### Takeaway
A switch learns by reading the **source** MAC of every frame and recording (MAC, ingress port, VLAN) in its MAC/CAM table; entries age out (Cisco default 300 s). It forwards by the **destination** MAC: known unicast → out one port (filter if same port), unknown unicast/broadcast/(multicast without IGMP snooping) → flood out all ports in the VLAN except the ingress port.

### Cited Findings
- MAC address (EUI-48, formerly MAC-48): 48 bits, written as 6 hex octets; first 24 bits = OUI identifying the issuing organization — [Wikipedia MAC address](https://en.wikipedia.org/wiki/MAC_address)
- I/G bit = least-significant bit of the first octet: 0 = individual (unicast), 1 = group (multicast/broadcast). U/L bit = second-least-significant bit of first octet: 0 = universally administered (burned-in by vendor), 1 = locally administered — [Wikipedia MAC address](https://en.wikipedia.org/wiki/MAC_address)
- Ethernet transmits each byte least-significant bit first, so the I/G bit is the first bit on the wire — [Wikipedia MAC address](https://en.wikipedia.org/wiki/MAC_address)
- Broadcast = FF:FF:FF:FF:FF:FF; IPv6 multicast MACs = 33-33-xx-xx-xx-xx — [Wikipedia MAC address](https://en.wikipedia.org/wiki/MAC_address). (IPv4 multicast 01-00-5E-… — not in fetched text; standard RFC 1112 mapping [verify].)
- Frame layout: Preamble 7 B, SFD 1 B, Destination MAC 6 B, Source MAC 6 B, optional 802.1Q tag 4 B, EtherType/Length 2 B, Payload 46–1500 B (42 min with tag), FCS 4 B; IPG 12 B (not part of frame) — [Wikipedia Ethernet frame](https://en.wikipedia.org/wiki/Ethernet_frame)
- Minimum frame 64 bytes (dest→FCS) due to 512-bit slot time for collision detection; frames <64 B = **runts** (collisions, bad NICs, duplex mismatch…) — [Wikipedia Ethernet frame](https://en.wikipedia.org/wiki/Ethernet_frame)
- Type/Length field: ≥1536 (0x0600) = EtherType (e.g. IPv4 0x0800); ≤1500 = length; 1501–1535 undefined. 802.1Q TPID = 0x8100 (sits where EtherType would be); 802.1ad = 0x88A8 — [Wikipedia Ethernet frame](https://en.wikipedia.org/wiki/Ethernet_frame)
- FCS = CRC-32 over addresses, type/length, payload and padding (preamble/SFD not covered) — [Wikipedia Ethernet frame](https://en.wikipedia.org/wiki/Ethernet_frame)
- Cisco configuration guides document "Default MAC Address Table Configuration", "Changing the Address Aging Time", "Removing Dynamic Address Entries", "Adding and Removing Static Address Entries", "Configuring Unicast MAC Address Filtering", "Displaying Address Table Entries" as standard switch features — [Cisco ME 3400 guide (manualslib ToC)](https://www.manualslib.com/manual/356476/Cisco-Me-3400.html?page=132) (body text not retrievable).

### Inferences

**Background knowledge (not re-fetched; standard Cisco/OCG content)**
- *History/why*: shared-media Ethernet (coax, hubs) = one collision domain, CSMA/CD, half duplex. Bridges (1980s, transparent bridging IEEE 802.1D — learning + filtering + flooding; Radia Perlman's STP) split collision domains; a switch = multiport bridge in hardware (ASIC/CAM). Each switch port = own collision domain, full duplex possible; whole VLAN = one broadcast domain.
- *Learning (1.13.a)*: on every received frame, switch reads **source MAC** → creates/refreshes entry {VLAN, MAC, port, type DYNAMIC}. Never learns from destination. Broadcast/multicast addresses never appear as source → never learned dynamically.
- *Aging*: each dynamic entry has a timer reset whenever that MAC is seen again as source; if not seen for **300 s (Cisco default)** entry removed. Configurable `mac address-table aging-time <0|10-1000000>` (0 = disable aging) [verify range on Catalyst 9000; older Catalyst range 0, 10–1000000]. Why aging: devices move/unplug; table is finite (CAM size e.g. 8K on 2960 [verify]); also STP TCN shortens aging to forward-delay (15 s) on classic STP [verify; deep dive].
- *MAC move / flapping*: same MAC learned on a different port (same VLAN) → entry updated to new port (station moved). Rapid repeated moves = loop symptom → syslog `%SW_MATM-4-MACFLAP_NOTIF: Host 0050.7966.6800 in vlan 10 is flapping between port Gi1/0/1 and port Gi1/0/2` [verify exact format].
- *Forwarding decisions (1.13.b/c)*:
  - Known unicast, dest port ≠ ingress → **forward** out that single port.
  - Known unicast, dest port = ingress → **filter** (drop) — e.g. hub behind switch port.
  - **Unknown unicast** (dest not in table) → **flood** out all ports in that VLAN except ingress.
  - **Broadcast** (FFFF.FFFF.FFFF) → flood (same VLAN, except ingress).
  - **Multicast** → flooded like broadcast unless IGMP snooping (enabled by default on Catalyst [verify]) constrains it to interested ports.
  - Flooding stays inside the VLAN; trunks carry it to other switches. Flooding + loops = broadcast storm → why STP (topic 2.5).
  - Reply from destination usually lets the switch learn it → next frames are known unicast.
- *Switching methods (internal)*:
  - **Store-and-forward**: receive entire frame, check FCS, drop errors; latency depends on frame size; default on most Cisco Catalyst (only method on modern Catalyst 2960/9000 [verify]).
  - **Cut-through**: forward after reading destination MAC (first 6 bytes after SFD) — lowest latency, forwards corrupt frames; used in low-latency DC switches (Nexus) [verify].
  - **Fragment-free**: forward after first 64 bytes (collision window) → filters runts; legacy (Catalyst 1900 era).
- *MAC table = CAM* (Content Addressable Memory — hardware lookup by content in one cycle). (TCAM = ternary, used for ACL/QoS — deep dive.)
- *Static entries*: `mac address-table static 0011.2233.4455 vlan 10 interface GigabitEthernet0/1` — never ages, survives; `mac address-table static <mac> vlan <id> drop` = discard frames to/from that MAC (black hole) [verify drop direction per platform]. Port security "sticky" entries appear as STATIC type too (topic 5.7).
- *Commands (Catalyst IOS; older syntax had hyphen `mac-address-table`)*:
  - `show mac address-table` (all) · `show mac address-table dynamic` · `show mac address-table address 0050.7966.6801` · `show mac address-table interface Gi0/1` · `show mac address-table vlan 10` · `show mac address-table count` · `show mac address-table aging-time`
  - `clear mac address-table dynamic [address <mac> | interface <if> | vlan <id>]`
  - `mac address-table aging-time 600 [vlan 10]`
- *Illustrative outputs (reconstructed, Catalyst 2960/IOS 15 style)*:
```
SW1# show mac address-table
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
 All    0100.0ccc.cccc    STATIC      CPU
 All    ffff.ffff.ffff    STATIC      CPU
   1    000a.1111.1111    DYNAMIC     Fa0/1
   1    000b.2222.2222    DYNAMIC     Fa0/2
   1    000c.3333.3333    DYNAMIC     Fa0/3
  10    0011.2233.4455    STATIC      Fa0/10
Total Mac Addresses for this criterion: 6

SW1# show mac address-table count
Mac Entries for Vlan 1:
---------------------------
Dynamic Address Count  : 3
Static  Address Count  : 0
Total Mac Addresses    : 3

Total Mac Address Space Available: 7984        <- [verify typical value]

SW1# show mac address-table aging-time
Global Aging Time:  300
Vlan    Aging Time
----    ----------

SW1# clear mac address-table dynamic
SW1# show mac address-table dynamic
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
Total Mac Addresses for this criterion: 0
```
  (Cisco notation uses dotted 4-hex groups `0011.2233.4455`; Windows `00-11-22-33-44-55`; Linux `00:11:22:33:44:55` — same address.)
- *Worked example (4 PCs, 1 switch, VLAN 1, table empty)*: PC-A aaaa.aaaa.aaaa Fa0/1, PC-B bbbb… Fa0/2, PC-C cccc… Fa0/3, PC-D dddd… Fa0/4.
  1. A → B (unicast). Learn A@Fa0/1. B unknown → flood to Fa0/2,3,4. B accepts; C, D discard (dest MAC ≠ theirs). Table: {A:Fa0/1}.
  2. B → A reply. Learn B@Fa0/2. A known → forward only Fa0/1. Table: {A, B}.
  3. C → FFFF.FFFF.FFFF (e.g. ARP request for D). Learn C@Fa0/3. Broadcast → flood Fa0/1,2,4. Table {A,B,C}.
  4. D → C (ARP reply, unicast). Learn D@Fa0/4. C known → Fa0/3 only. Table full {A,B,C,D}.
  5. A → B again: known → Fa0/2 only, no flooding.
  6. PC-B idle >300 s → entry B aged out; next frame to B is flooded again.
  7. PC-B moved to Fa0/4's spot? Example of MAC move: B now sends from Fa0/5 → entry updated to Fa0/5.
  (Realistic touch: in real life step 1 would be preceded by A's ARP broadcast — explain ARP briefly or link.)

**Exam traps**
- Switch learns **source** MACs, forwards on **destination** MAC.
- Unknown unicast is **flooded**, not dropped (router would drop unknown destination — contrast!).
- Flooding never sends back out the ingress port and stays within the VLAN.
- Default aging 300 s (5 min) — not 30 s, not 3600.
- Static entries don't age and survive `clear mac address-table dynamic`.
- Switch ports = separate collision domains; one VLAN = one broadcast domain (switch does NOT break broadcast domains; router/VLANs do).
- Cut-through doesn't check FCS; store-and-forward does.
- Minimum Ethernet frame 64 B, max standard 1518 B (1522 with 802.1Q); payload 46–1500.
- I/G bit set (first octet odd: 01-…, 33-…, FF-…) = multicast/broadcast; 2nd bit = locally administered (e.g. x2, x6, xA, xE in 2nd hex digit) — exam may show a MAC and ask the type.
- The `show mac address-table` command — older IOS used `show mac-address-table` (hyphen).

**Packet Tracer lab ideas**
- 1 × 2960 + 4 PCs; `show mac address-table` empty (except CPU entries maybe); Simulation mode, filter ICMP/ARP, ping A→B: watch ARP broadcast flooded, reply unicast, then show table. `clear mac address-table dynamic` and repeat; change aging-time to 10 s (`mac address-table aging-time 10`) and observe disappearance [verify PT supports configurable aging & minimum 10]. Add a static entry. Insert a hub between switch and two PCs to demonstrate filtering. PT simulation lets you click switch → "OSI model" tab showing "The frame's destination MAC address does not match / is found in the MAC table…" decision text.
- Two switches linked: show remote MACs learned on the uplink port (many MACs on one port).
- Loop demo (without STP) is risky in PT — use as an animation in the app instead.

**Image candidates (Wikimedia Commons)**
- `File:MAC-48 Address.svg` (OUI/NIC, I/G & U/L bits) — exists per search result title [Wikipedia file page](https://www.wikipedia.org/wiki/File:MAC-48_Address.svg); author/license [verify — commonly attributed to Inductiveload, CC BY-SA 2.5]
- `File:Ethernet Type II Frame format.svg` [verify]
- `File:2550T-PWR-Front.jpg` (Cisco/Avaya? switch photo) [verify]
- `File:Network switches.jpg` / rack photo [verify]
- Recommendation: original SVG + animation (frame enters → table row appears → flood/forward arrows) is the core visual; photos only for "what a switch looks like".

### Gaps
- Cisco command reference pages (aging-time range, `count` output format, MACFLAP log text) not retrievable (manualslib bodies empty); sample outputs are reconstructions → [verify] before publishing or present as "exemplu ilustrativ".
- Default switching method per Catalyst model not verified.
- Commons licensing for all images except the TCP state diagram unverified.
