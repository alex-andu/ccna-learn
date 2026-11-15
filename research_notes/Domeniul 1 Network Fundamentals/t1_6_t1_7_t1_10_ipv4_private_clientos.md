# CCNA 200-301 v1.1 — 1.6 IPv4 addressing & subnetting, 1.7 Private IPv4, 1.10 Client OS IP parameters

Research notes for lesson writing. Audience: absolute beginner. Sources fetched in this session: IANA special-purpose registry, RFC 1519, RFC 3021, Cisco TechNote 13788, NRO + RIPE NCC announcements, Microsoft Learn ipconfig, Commons mirrors. Several hosts (rfc-editor via curl, commons.wikimedia.org) were blocked by the proxy, so some RFC facts are cited from the RFC URL without a fresh fetch. Those are marked "(not re-fetched)". Anything not confirmed is marked [verify].

Note on the worked examples and tables: they are **pure arithmetic**, derived from the definitions in RFC 950/4632. I recomputed them by hand in these notes and they can be checked with `web/src/lib/subnet.ts`. IOS and OS sample outputs are **illustrative**. They were constructed from the documented output formats, not captured from real devices, so the app must label them that way (CLAUDE.md §5).

---

## Q1 — 1.6 Foundations: binary, IPv4 header, address structure, classful history, CIDR

### Takeaway
An IPv4 address is a 32-bit number, written as 4 decimal octets. A mask (or /prefix) splits it into network bits and host bits. Classful addressing (A/B/C fixed at the octet boundary, from 1981) wasted space and blew up routing tables. CIDR (RFC 1518/1519, Sept 1993, now RFC 4632) replaced it with arbitrary-length prefixes, and the exam still tests the class ranges as history and vocabulary.

### Cited Findings
- **CIDR motivation (RFC 1519, Sept 1993, obsoletes RFC 1338).** It names three problems: (1) Class B exhaustion, because Class C (254 hosts) was too small for many organisations and Class B (65,534) too large; (2) routing tables "growing beyond the ability of current software, hardware, and people to effectively manage"; (3) eventual exhaustion of the 32-bit space, which CIDR does not solve but helps defer. — [RFC 1519](https://www.rfc-editor.org/rfc/rfc1519.html)
- **Routing-table growth figures in RFC 1519 (MERIT data).** Routes advertised: 173 (Jul-1988), 897 (Dec-1989), 2,190 (Dec-1990), 4,305 (Dec-1991), 5,739 (Jun-1992), 8,561 (Dec-1992). Without action it projected about 30,000 entries in two years. — [RFC 1519](https://www.rfc-editor.org/rfc/rfc1519.html)
- **RFC 4632 (Aug 2006)** is the current CIDR BCP and obsoletes RFC 1519. RFC 1518 (Sept 1993) is the companion "Architecture for IP Address Allocation with CIDR". (Not re-fetched, dates [verify]) — [RFC 4632 summary](https://ipfyi.com/rfc/4632/)
- **Natural (classful) masks and ranges, per Cisco.** Class A uses the first octet as the network (about 1.0.0.0–127.255.255.255), mask 255.0.0.0. Class B 128.0.0.0–191.255.255.255, mask 255.255.0.0. Class C 192.0.0.0–223.255.255.255, mask 255.255.255.0. Example: "10.20.15.1 with 255.0.0.0 → network 10, host 20.15.1". Cisco notes the class terms "are rarely used today because of CIDR". — [Cisco TechNote 13788 "Configure IP Addresses and Unique Subnets for New Users"](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)
- **Class E / 240.0.0.0/4 is "Reserved" (RFC 1112 §4)**, not forwardable and not globally reachable. — [IANA IPv4 Special-Purpose Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- **0.0.0.0/8 "This network" (RFC 791 §3.2)** and **127.0.0.0/8 Loopback (RFC 1122 §3.2.1.3)** are both non-forwardable, which is why 0 and 127 are excluded from the "usable Class A" range of 1–126. — [IANA registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- RFC 791 (Sept 1981) defines IPv4 and its header. RFC 950 (Aug 1985) defines standard subnetting and the subnet mask. (Not re-fetched) — [RFC 791](https://www.rfc-editor.org/rfc/rfc791); [RFC 950](https://www.rfc-editor.org/rfc/rfc950)

### Inferences

**Binary ↔ decimal: the powers-of-2 table (one octet).**

| Bit position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|
| Value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

- **Decimal → binary (subtraction method).** Example: 201. 201 ≥ 128 → 1, remainder 73. 73 ≥ 64 → 1, remainder 9. 9 < 32 → 0. 9 < 16 → 0. 9 ≥ 8 → 1, remainder 1. 1 < 4 → 0. 1 < 2 → 0. 1 ≥ 1 → 1. Result: **11001001**.
- **Binary → decimal.** Add the values of the 1-bits, so 10101100 = 128+32+8+4 = **172**.
- **Mask octet values** (contiguous 1s from the left): 0, 128, 192, 224, 240, 248, 252, 254, 255. This is the most important sequence to memorise. Each value is the previous one plus the next power of 2 (128, +64, +32, …).
- **Speed tip.** Memorise the 9 mask values and the "block size" = 256 − mask octet (256, 128, 64, 32, 16, 8, 4, 2, 1).

**IPv4 header (RFC 791), minimum 20 bytes, maximum 60 bytes with options.**

| Field | Bits | Beginner meaning |
|---|---|---|
| Version | 4 | always 4 |
| IHL (Internet Header Length) | 4 | header length in 32-bit words (5 = 20 bytes, maximum 15 = 60 bytes) |
| DSCP + ECN (originally ToS) | 6 + 2 | QoS marking (DSCP, RFC 2474) and congestion signalling (ECN, RFC 3168) |
| Total Length | 16 | header plus data, maximum 65,535 bytes |
| Identification, Flags (3), Fragment Offset (13) | 16/3/13 | fragmentation and reassembly (DF bit = Don't Fragment) |
| TTL | 8 | decremented by 1 at each router; the packet is discarded at 0 (stops loops; traceroute uses it) |
| Protocol | 8 | what is inside: 1 ICMP, 6 TCP, 17 UDP, 89 OSPF [values are standard IANA protocol numbers; verify against IANA protocol-numbers if displayed] |
| Header Checksum | 16 | header only, recomputed at every hop because TTL changes |
| Source / Destination Address | 32 + 32 | the IPv4 addresses |
| Options + padding | variable | rarely used |

**Classful table (history, still asked on the exam).**

| Class | Leading bits | First octet | Default mask | Networks / hosts per network | Use |
|---|---|---|---|---|---|
| A | 0 | 1–126 (0 and 127 reserved) | /8 | 126 / 16,777,214 | unicast, large |
| B | 10 | 128–191 | /16 | 16,384 / 65,534 | unicast, medium |
| C | 110 | 192–223 | /24 | 2,097,152 / 254 | unicast, small |
| D | 1110 | 224–239 | none | — | multicast (224.0.0.0/4) |
| E | 1111 | 240–255 | none | — | reserved / experimental (240.0.0.0/4) |

- **Why classful was abandoned.** A company with 300 hosts got a Class B (65,534 addresses, more than 99% wasted). The alternative was several Class Cs, each of which was a separate route in every Internet router. That is the RFC 1519 problem set.
- **CIDR fixes.** (a) Allocation at any prefix length (/20, /22…). (b) Aggregation, also called supernetting: one ISP advertises a single summary for many customers. Cisco's example: an ISP holding 172.16.0.0/16 assigns 172.16.1.0/24 and similar to customers and "advertise[s] only 172.16.0.0/16" externally ([Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)).
- **Analogy for beginners.** Network part = street name, host part = house number. The mask is the line on the envelope that says where the street ends.

### Gaps
- RFC 791/950/4632/1518 pages could not be re-fetched with curl (proxy). The dates (Sept 1981, Aug 1985, Aug 2006, Sept 1993) come from memory or secondary sources. [verify] before showing them as "fact" badges.
- The exact count "2,097,152 Class C networks" is derived from 2^21. Some books say 2,097,150 after excluding reserved blocks. Phrase it as "about 2 million".

---

## Q2 — 1.6 Masks, prefix notation, computing subnet facts, /31 and /32, FLSM, VLSM, exam speed techniques

### Takeaway
Every subnet question reduces to the "interesting octet" and the block size (256 − mask octet). The network ID is the nearest multiple of the block size at or below the address. The broadcast is the next network ID minus 1. Usable hosts = 2^h − 2, except /31 (2 hosts, RFC 3021) and /32 (1 address, a host route or loopback). For VLSM, assign the largest subnets first.

### Cited Findings
- **Cisco subnetting examples.** For a /27 (255.255.255.224) on a Class C, "With these three bits, it is possible to create eight subnets" (.0, .32, .64 …), with 30 usable hosts each. For a /28, 16 subnets × 14 hosts. For a /21 on a Class B (255.255.248.0), 32 subnets × 2,046 hosts. — [Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)
- **Cisco sample exercise.** 172.16.17.30/20 and 172.16.28.15/20 are both in 172.16.16.0/20, so they are in the same subnet. — [Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)
- **Cisco VLSM example.** It starts from 192.168.5.0/24 with requirements netA 14 hosts (/28), netB 28 (/27), netC 2 (/30), netD 7 (/28), netE 28 (/27). Assignment: netB .0/27, netE .32/27, netA .64/28, netD .80/28, netC .96/30. Quotes: "The easiest way to assign the subnets is to assign the largest first". "VLSM helped save more than half the address space". "a /29 … would only allow 6 usable host addresses", so 7 hosts need a /28. — [Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)
- **Subnet zero.** "Cisco Systems devices allow the use of these subnets [subnet zero and all-ones subnet] when the `ip subnet-zero` command is configured". Host addresses of all 0s or all 1s are never usable. — [Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html). Note: `ip subnet-zero` has been on by default since IOS 12.0, and modern CCNA material treats subnet zero as usable [verify the exact IOS version].
- **/31 (RFC 3021, Dec 2000, "Using 31-Bit Prefixes on IPv4 Point-to-Point Links").** Goal: "halve the amount of address space assigned to point-to-point links". With a 31-bit mask "the two addresses … MUST be interpreted as host addresses". Directed broadcast "is not possible", and "The limited broadcast MUST be used for all broadcast traffic on a point-to-point link". — [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021.html)
- **Cisco on /31 and /32.** /31 suits point-to-point links; use on Ethernet segments should be done "with caution". /32 suits single-address interfaces such as loopbacks, e.g. 192.168.2.1/32 on Loopback0. — [Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)

### Inferences

**Full mask table /0–/32** (usable hosts = 2^(32−n) − 2; wildcard = 255.255.255.255 − mask).

| /n | Mask | Wildcard | Addresses | Usable hosts |
|---|---|---|---|---|
| /0 | 0.0.0.0 | 255.255.255.255 | 4,294,967,296 | (default route, not a subnet) |
| /1 | 128.0.0.0 | 127.255.255.255 | 2,147,483,648 | 2,147,483,646 |
| /2 | 192.0.0.0 | 63.255.255.255 | 1,073,741,824 | 1,073,741,822 |
| /3 | 224.0.0.0 | 31.255.255.255 | 536,870,912 | 536,870,910 |
| /4 | 240.0.0.0 | 15.255.255.255 | 268,435,456 | 268,435,454 |
| /5 | 248.0.0.0 | 7.255.255.255 | 134,217,728 | 134,217,726 |
| /6 | 252.0.0.0 | 3.255.255.255 | 67,108,864 | 67,108,862 |
| /7 | 254.0.0.0 | 1.255.255.255 | 33,554,432 | 33,554,430 |
| /8 | 255.0.0.0 | 0.255.255.255 | 16,777,216 | 16,777,214 |
| /9 | 255.128.0.0 | 0.127.255.255 | 8,388,608 | 8,388,606 |
| /10 | 255.192.0.0 | 0.63.255.255 | 4,194,304 | 4,194,302 |
| /11 | 255.224.0.0 | 0.31.255.255 | 2,097,152 | 2,097,150 |
| /12 | 255.240.0.0 | 0.15.255.255 | 1,048,576 | 1,048,574 |
| /13 | 255.248.0.0 | 0.7.255.255 | 524,288 | 524,286 |
| /14 | 255.252.0.0 | 0.3.255.255 | 262,144 | 262,142 |
| /15 | 255.254.0.0 | 0.1.255.255 | 131,072 | 131,070 |
| /16 | 255.255.0.0 | 0.0.255.255 | 65,536 | 65,534 |
| /17 | 255.255.128.0 | 0.0.127.255 | 32,768 | 32,766 |
| /18 | 255.255.192.0 | 0.0.63.255 | 16,384 | 16,382 |
| /19 | 255.255.224.0 | 0.0.31.255 | 8,192 | 8,190 |
| /20 | 255.255.240.0 | 0.0.15.255 | 4,096 | 4,094 |
| /21 | 255.255.248.0 | 0.0.7.255 | 2,048 | 2,046 |
| /22 | 255.255.252.0 | 0.0.3.255 | 1,024 | 1,022 |
| /23 | 255.255.254.0 | 0.0.1.255 | 512 | 510 |
| /24 | 255.255.255.0 | 0.0.0.255 | 256 | 254 |
| /25 | 255.255.255.128 | 0.0.0.127 | 128 | 126 |
| /26 | 255.255.255.192 | 0.0.0.63 | 64 | 62 |
| /27 | 255.255.255.224 | 0.0.0.31 | 32 | 30 |
| /28 | 255.255.255.240 | 0.0.0.15 | 16 | 14 |
| /29 | 255.255.255.248 | 0.0.0.7 | 8 | 6 |
| /30 | 255.255.255.252 | 0.0.0.3 | 4 | 2 |
| /31 | 255.255.255.254 | 0.0.0.1 | 2 | 2 (RFC 3021, point-to-point only) |
| /32 | 255.255.255.255 | 0.0.0.0 | 1 | 1 (host route, loopback) |

**Formulas.**
- Number of subnets = 2^s, where s = borrowed bits. Hosts per subnet = 2^h − 2, where h = host bits (−2 because of the network ID and the broadcast).
- "How many host bits for N hosts?" Find the smallest h with 2^h − 2 ≥ N. 60 → h=6 (62). 28 → h=5 (30). 12 → h=4 (14). 2 → h=2 (2).
- "How many subnet bits for N subnets?" Find the smallest s with 2^s ≥ N.

**Magic-number (block-size) method, step by step.**
1. Find the interesting octet: the octet where the mask is neither 255 nor 0. For /n, that is octet ⌈n/8⌉, or the next octet if n is a multiple of 8.
2. Block size (magic number) = 256 − mask value in that octet.
3. Network ID: in the interesting octet, take the largest multiple of the block size that is ≤ the address octet. Octets to the left are copied, octets to the right become 0.
4. Broadcast: network octet + block − 1 in the interesting octet. Octets to the right become 255.
5. First host = network + 1 (last octet). Last host = broadcast − 1.

*Worked example A, last octet:* 10.1.1.100/27 → mask .224 → block 32 → multiples 0, 32, 64, **96**, 128. Network 10.1.1.96, first 10.1.1.97, last 10.1.1.126, broadcast 10.1.1.127, 30 hosts.

*Worked example B, third octet:* 172.16.77.200/19 → mask 255.255.224.0 → interesting octet 3, block 32 → multiples 0, 32, **64**, 96. Network 172.16.64.0, broadcast 172.16.95.255, first 172.16.64.1, last 172.16.95.254, 8,190 hosts.

*Worked example C, second octet:* 10.200.3.4/11 → mask 255.224.0.0 → block 32 → 192 ≤ 200 < 224. Network 10.192.0.0, broadcast 10.223.255.255.

*Worked example D, Cisco check:* 172.16.17.30/20 → block 16 in octet 3 → 16 ≤ 17 < 32 → 172.16.16.0. 172.16.28.15 → 16 ≤ 28 < 32 → same subnet. This matches Cisco 13788.

**Speed tips for the exam.**
- Memorise "/25 128, /26 64, /27 32, /28 16, /29 8, /30 4" as block sizes. The same sizes apply one octet to the left for /17–/22 (/17 128 … /22 4).
- **/24 + k** and **/16 + k** have the same block size in different octets. Example: /20 and /28 are both block 16.
- Write the "cheat line" on the erasable board once at the start of the exam: `128 192 224 240 248 252 254 255` above `/25 /26 /27 /28 /29 /30 /31 /32` and the block sizes `128 64 32 16 8 4 2 1`. Whether a whiteboard or noteboard is allowed depends on the Pearson VUE test centre or OnVUE online [verify].
- Sanity checks: a network ID is always even in the interesting octet. A broadcast is always odd in the last octet (except /32).
- "Is X a valid host?" Compute network and broadcast. X must be strictly between them.

**FLSM (fixed-length) example.** Split 192.168.1.0/24 into 4 equal subnets. 2 borrowed bits gives /26, block 64.

| Subnet | Network | First host | Last host | Broadcast |
|---|---|---|---|---|
| 1 | 192.168.1.0/26 | .1 | .62 | .63 |
| 2 | 192.168.1.64/26 | .65 | .126 | .127 |
| 3 | 192.168.1.128/26 | .129 | .190 | .191 |
| 4 | 192.168.1.192/26 | .193 | .254 | .255 |

The problem with FLSM: a 2-host WAN link wastes 60 addresses of a /26. That waste is the reason for VLSM.

**VLSM example (requested).** Split 192.168.10.0/24 for LANs of 60, 28 and 12 hosts plus one point-to-point WAN link of 2 hosts. Sort the requirements by size, largest first.

| Need | Host bits | Prefix | Network | First host | Last host | Broadcast | Usable |
|---|---|---|---|---|---|---|---|
| 60 hosts | 6 | /26 | 192.168.10.0 | .1 | .62 | .63 | 62 |
| 28 hosts | 5 | /27 | 192.168.10.64 | .65 | .94 | .95 | 30 |
| 12 hosts | 4 | /28 | 192.168.10.96 | .97 | .110 | .111 | 14 |
| 2 hosts (WAN) | 2 | /30 | 192.168.10.112 | .113 | .114 | .115 | 2 |
| free | — | — | 192.168.10.116–.255 | — | — | — | for growth |

- Why largest first: each block must start on a multiple of its own size. Placing the big blocks first keeps every later block aligned with no gaps or overlaps.
- Alternative: use a /31 for the WAN (192.168.10.112/31 → .112 and .113 are both hosts), per RFC 3021.
- Common learner error: putting the /30 first (.0/30), then trying the /26 at .4. That is invalid because a /26 must start at a multiple of 64, so it goes to .64 and leaves .4–.63 fragmented.

**Summarization / supernetting (brief).** Combine contiguous networks into one shorter prefix. Example: 172.16.0.0/24, 172.16.1.0/24, 172.16.2.0/24 and 172.16.3.0/24 → write the third octets in binary (000000**00**–000000**11**). The common bits are 22, so the summary is **172.16.0.0/22**. The rule is that the count must be a power of 2 and the first network must be a multiple of that count.

### Gaps
- No official Cisco statement was found in this session about the noteboard during the exam. [verify] against the Pearson VUE/Cisco exam policies page.
- The IOS version where `ip subnet-zero` became the default was not fetched. It is widely cited as 12.0 [verify].

---

## Q3 — 1.6 Special-purpose IPv4 addresses

### Takeaway
The IANA Special-Purpose Registry is the authoritative list. For CCNA, a learner must recognise 0.0.0.0/8, 10/8, 100.64/10, 127/8, 169.254/16, 172.16/12, 192.0.2/24, 192.168/16, 198.51.100/24, 203.0.113/24, 224/4 (multicast), 240/4 and 255.255.255.255.

### Cited Findings
Each entry is listed as block, name, RFC, then forwardable / globally reachable. — [IANA IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- 0.0.0.0/8 — "This network" — RFC 791 §3.2 — False/False. 0.0.0.0/32 "This host on this network" (RFC 1122), which DHCP DISCOVER uses as the source address.
- 10.0.0.0/8 — Private-Use — RFC 1918 — True/False
- 100.64.0.0/10 — Shared Address Space — RFC 6598 — True/False
- 127.0.0.0/8 — Loopback — RFC 1122 §3.2.1.3 — False/False (with protocol exceptions)
- 169.254.0.0/16 — Link Local — RFC 3927 — False/False
- 172.16.0.0/12 — Private-Use — RFC 1918 — True/False
- 192.0.0.0/24 — IETF Protocol Assignments — RFC 6890
- 192.0.2.0/24 TEST-NET-1, 198.51.100.0/24 TEST-NET-2, 203.0.113.0/24 TEST-NET-3 — Documentation — RFC 5737 — False/False
- 192.168.0.0/16 — Private-Use — RFC 1918 — True/False
- 198.18.0.0/15 — Benchmarking — RFC 2544
- 240.0.0.0/4 — Reserved — RFC 1112 §4 — False/False
- 255.255.255.255/32 — Limited Broadcast — RFC 8190 / RFC 919 §7 — False/False
- The registry was established by RFC 6890 ("Special-Purpose IP Address Registries"). — [IANA registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- Multicast 224.0.0.0/4 (Class D, 224–239) is in the separate IANA multicast registry, not in this table. (Not re-fetched) — [RFC 5771 / IANA multicast](https://www.iana.org/assignments/multicast-addresses/multicast-addresses.xhtml)

### Inferences
- **APIPA (Microsoft's name for RFC 3927 link-local).** When a DHCP client gets no answer, Windows self-assigns 169.254.x.y/16 with no gateway. In the app, "169.254 means DHCP failed" is the key troubleshooting reflex. RFC 3927 excludes the first and last /24 (169.254.0.x and 169.254.255.x) from auto-selection [verify against RFC 3927 §2.1].
- **Loopback.** 127.0.0.1 = "myself". `ping 127.0.0.1` tests the local TCP/IP stack only, not the NIC or cable.
- **Documentation ranges.** Use 192.0.2.0/24, 198.51.100.0/24 and 203.0.113.0/24 as "public" addresses in the app's examples and labs (NAT outside addresses etc.), so the examples never point at real networks.
- **255.255.255.255** is a limited broadcast and never crosses a router. A directed broadcast (e.g. 192.168.10.63 for 192.168.10.0/26) is targeted at one remote subnet, and Cisco routers do not forward it by default (`no ip directed-broadcast` has been the default since IOS 12.0 [verify]).
- **0.0.0.0/0** in a routing table is the default route (match everything). This is a different idea from the 0.0.0.0/8 "this network" block, and beginners confuse the two.

### Gaps
- RFC 3927 §2.1 details (169.254.1.0–169.254.254.255 selectable range) were not re-fetched [verify].

---

## Q4 — 1.6 IOS configuration and verification (with error messages)

### Takeaway
Configure with `interface X` → `ip address A.B.C.D MASK` (IOS takes a dotted mask, not /prefix, in classic IOS) → `no shutdown`. Verify with `show ip interface brief`, `show ip interface`, `show running-config interface`, and `show ip route connected`. Every addressed, up/up interface creates a **C** (connected subnet) and an **L** (local /32) route. IOS rejects overlapping subnets across interfaces and network/broadcast addresses.

### Cited Findings
- `ip subnet-zero` allows subnet zero and the all-ones subnet on Cisco devices. — [Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)
- Loopback with /32: `interface Loopback0` / `ip address 192.168.2.1 255.255.255.255`. — [Cisco 13788](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)
- A Cisco Community thread on Packet Tracer "Bad mask" and "overlaps" errors confirms the two common causes: (1) assigning the network or broadcast address of the subnet (e.g. 192.168.1.32 on a /27) triggers "Bad mask"; (2) an address or mask whose subnet collides with another interface's subnet triggers "overlaps with …". — [Cisco Community: PT IP address overlaps or bad mask](https://community.cisco.com/t5/routing/pt-ip-address-overlaps-or-bad-mask/td-p/4169055)

### Inferences

**Configuration (annotated).**
```
Router> enable
Router# configure terminal
Router(config)# interface GigabitEthernet0/0
Router(config-if)# description LAN-Sales (60 hosts)
Router(config-if)# ip address 192.168.10.1 255.255.255.192   ! address + dotted mask (/26)
Router(config-if)# no shutdown                               ! router interfaces are shut by default
Router(config-if)# exit
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.10.65 255.255.255.224  ! /27
Router(config-if)# ip address 192.168.10.97 255.255.255.240 secondary  ! a second subnet on the same interface
Router(config-if)# no shutdown
Router(config-if)# end
Router# copy running-config startup-config
```
- `secondary` adds an extra subnet to the same interface. Without the keyword, a new `ip address` **replaces** the existing primary. Typical use: a LAN that has outgrown its subnet. This is a common trap.
- On a switch (SVI), `interface vlan 1` → `ip address …` → `no shutdown`, plus `ip default-gateway X` for management. Cross-link to topic 1.6/2.x.
- Modern IOS-XE also accepts the prefix form `ip address 10.1.1.1/24` on some platforms [verify]. The exam uses dotted masks.

**Verification sample outputs (illustrative, format per IOS 15.x [verify]).**
```
Router# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.10.1    YES manual up                    up
GigabitEthernet0/1     192.168.10.65   YES manual up                    up
GigabitEthernet0/2     unassigned      YES unset  administratively down down
Loopback0              10.255.255.1    YES manual up                    up
```
- Status/Protocol pairs: up/up = working; administratively down/down = `shutdown` was configured; down/down = Layer 1 problem (cable, peer off); up/down = Layer 2 problem (encapsulation or keepalive mismatch, on serial links). Method: manual, DHCP, unset, NVRAM. The secondary address is not shown here.

```
Router# show ip interface GigabitEthernet0/1
GigabitEthernet0/1 is up, line protocol is up
  Internet address is 192.168.10.65/27
  Broadcast address is 255.255.255.255
  Secondary address 192.168.10.97/28
  MTU is 1500 bytes
  Helper address is not set
  Outgoing access list is not set
  Inbound  access list is not set
  Proxy ARP is enabled
  ...
```
- This shows the prefix length, secondaries, ACLs and helper address. It is the "detail" view. ("Broadcast address is 255.255.255.255" is the limited broadcast IOS uses on the interface, not the subnet broadcast, which confuses learners [verify wording].)

```
Router# show running-config interface GigabitEthernet0/1
Building configuration...
Current configuration : 165 bytes
!
interface GigabitEthernet0/1
 ip address 192.168.10.97 255.255.255.240 secondary
 ip address 192.168.10.65 255.255.255.224
 duplex auto
 speed auto
end
```
```
Router# show ip route connected
      192.168.10.0/24 is variably subnetted, 6 subnets, 4 masks
C        192.168.10.0/26 is directly connected, GigabitEthernet0/0
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0
C        192.168.10.64/27 is directly connected, GigabitEthernet0/1
L        192.168.10.65/32 is directly connected, GigabitEthernet0/1
C        192.168.10.96/28 is directly connected, GigabitEthernet0/1
L        192.168.10.97/32 is directly connected, GigabitEthernet0/1
```
- **C** = the whole subnet is reachable out of this interface. **L** = the router's own address as a /32 host route, so packets addressed to the router itself are delivered locally. L routes were introduced in IOS 15 [verify]. The routes appear only when the interface is up/up.
- `show ip route local` lists only L routes on recent IOS [verify that the keyword exists in PT].

**Connectivity tests.**
```
Router# ping 192.168.10.2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.10.2, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/1/2 ms
```
- `!` = echo reply, `.` = timeout, `U` = destination unreachable. The first `.` is typical because ARP resolves during the first echo.
- `traceroute 192.168.20.10` shows each hop by using rising TTL values. On Windows the command is `tracert`.

**Common errors (exact text [verify] on real IOS/PT).**
```
R1(config)# interface g0/1
R1(config-if)# ip address 192.168.10.30 255.255.255.192
% 192.168.10.0 overlaps with GigabitEthernet0/0
```
→ 192.168.10.30/26 lives in 192.168.10.0/26, which G0/0 already uses. Two interfaces on the same router cannot share or overlap a subnet. The message names the conflicting network and interface.
```
R1(config-if)# ip address 192.168.10.64 255.255.255.224
Bad mask /27 for address 192.168.10.64
```
→ .64 is the network ID of 192.168.10.64/27. The same message appears for the broadcast address (.95).
```
R1(config-if)# ip address 192.168.10.1 255.0.255.0
Bad mask 0xFF00FF00 for address 192.168.10.1
```
→ the mask is not contiguous [verify exact text and hex format].
- Other errors: forgetting `no shutdown` (status "administratively down"); a host gateway in another subnet; a mask mismatch between the two ends of a link (e.g. /24 versus /25, so one side thinks the peer is off-subnet).

### Gaps
- No primary Cisco document with the verbatim error strings was retrieved. The strings above match widely reported IOS behaviour but are **[verify]** in PT before use as quiz answers.
- The IOS version that introduced L routes (widely stated as 15.0) was not fetched [verify].

---

## Q5 — 1.7 Private IPv4 addressing: RFC 1918, exhaustion history, NAT/PAT, CGNAT

### Takeaway
RFC 1918 (Feb 1996) reserves 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0–172.31.255.255) and 192.168.0.0/16 for any organisation to reuse internally. They are not globally reachable, so NAT/PAT translates them to public addresses at the edge. Together with CIDR, this is what let IPv4 survive the depletion of the IANA free pool (3 Feb 2011) and the RIRs (e.g. RIPE NCC's final /22 on 25 Nov 2019).

### Cited Findings
- 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 are "Private-Use", RFC 1918: forwardable = True, globally reachable = False. — [IANA registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- 100.64.0.0/10 is "Shared Address Space" (RFC 6598), also not globally reachable. It is used by ISPs between the CGN and subscribers. — [IANA registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- **IANA exhaustion.** On 3 Feb 2011 the NRO announced that "the free pool of available IPv4 addresses is now fully depleted". On 31 Jan 2011 IANA allocated two /8s to APNIC, which triggered the global policy that distributed the last five /8s, one to each of the five RIRs. — [NRO](https://www.nro.net/ipv4-free-pool-depleted); [ARIN announcement](https://www.arin.net/announcements/2011/20110203.html)
- **RIPE NCC.** "Today, at 15:35 (UTC+1) on 25 November 2019, we made our final /22 IPv4 allocation from the last remaining addresses in our available pool." Afterwards there is a waiting list for recovered addresses, available only to LIRs that never received IPv4 from the RIPE NCC, and they are "only eligible to receive a single /24 allocation". — [RIPE NCC announcement, ripe-list](https://www.ripe.net/ripe/mail/archives/ripe-list/2019-November/001712.html)
- An exhaustion timeline diagram covering all RIRs exists on Commons (see Q7). — [Commons mirror](https://wiki.riteme.site/wiki/File:IPv4_IANA_and_RIR_exhaustion_time_line-en.svg)

### Inferences
- **Exact ranges and the 172 confusion.**

| Block | Range | Old class equivalent | Addresses |
|---|---|---|---|
| 10.0.0.0/8 | 10.0.0.0 – 10.255.255.255 | 1 Class A | 16,777,216 |
| 172.16.0.0/12 | 172.16.0.0 – **172.31**.255.255 | 16 Class B | 1,048,576 |
| 192.168.0.0/16 | 192.168.0.0 – 192.168.255.255 | 256 Class C | 65,536 |

  - Trap: 172.32.0.1 and 172.15.0.1 are **public**. Only 172.16–172.31 are private, because /12 covers 16 values of the second octet.
  - Trap: 192.169.x.x and 11.x.x.x are public. 169.254.x.x is link-local, not RFC 1918. 100.64.x.x is shared (CGNAT), not RFC 1918. 127.x is loopback.
- **The 32-bit math.** 2^32 ≈ 4.29 billion total addresses, minus large reserved blocks (multicast, 240/4, private and others, about 0.6 billion). That is far fewer than the number of connected devices, so the private space plus NAT lets thousands of devices hide behind one public address.
- **Why private addresses are not routable on the Internet.** Thousands of organisations reuse the same 10.x networks, so an Internet router could not know which 10.1.1.1 is meant. ISPs filter (drop) RFC 1918 sources and destinations at their borders (BCP 38 / bogon filtering [verify reference]).
- **NAT concept (for 1.7, conceptual only; configuration is objective 4.1).**
  - Static NAT: 1 private ↔ 1 public (servers).
  - Dynamic NAT: a pool of public addresses, assigned first-come.
  - PAT (NAT overload): many private → 1 public, distinguished by **source port**. This is what every home router does.
  - Cisco terminology preview: inside local (the private address of a host), inside global (its public translated address), outside global, outside local.
- **CGNAT (Carrier-Grade NAT, NAT444).** The ISP itself runs NAT. The home router's WAN address is 100.64.x.x (RFC 6598), translated again at the ISP. RFC 6598 created a separate range so that it would not collide with customers' own RFC 1918 LANs. Side effects: no inbound port forwarding, and gaming/P2P issues. Many Romanian mobile and some fixed ISPs use CGNAT [verify; do not claim specific operators].
- **The real long-term fix is IPv6** (objective 1.8/1.9). NAT is a stop-gap with costs: it breaks end-to-end connectivity and complicates some protocols (FTP, SIP, IPsec without NAT-T).
- **Analogy.** Private addresses are like room numbers inside a hotel (every hotel has a room 101). NAT is the reception desk that turns "room 101" into the hotel's public street address on outgoing mail.

### Gaps
- RFC 1918 publication date (Feb 1996, BCP 5) and RFC 6598 (April 2012, BCP 153) were not re-fetched [verify].
- The other RIR exhaustion dates (APNIC Apr 2011, LACNIC 2014, ARIN Sept 2015, AFRINIC phases) were not fetched. They are in the Commons timeline image and should be [verify]-checked if shown.

---

## Q6 — 1.10 Verify IP parameters on client OS (Windows, macOS, Linux)

### Takeaway
On each OS the learner must find four things: **IP address + mask, default gateway, DNS servers, and DHCP versus static (lease)**, plus the MAC address. Windows: `ipconfig /all`. macOS: `ifconfig en0` (mask in **hex**, e.g. 0xffffff00) plus `networksetup -getinfo "Wi-Fi"`. Linux: `ip addr`, `ip route` and `resolvectl status`. Red flags: 169.254.x.x (DHCP failed), a gateway outside the host's subnet, a missing DNS server, a duplicate IP.

### Cited Findings
- **Windows ipconfig (Microsoft Learn).** Without parameters it "displays Internet Protocol version 4 (IPv4) and IPv6 addresses, subnet mask, and default gateway for all adapters". `/all` "Displays the full TCP/IP configuration for all adapters". `/release` "Sends a DHCPRELEASE message to the DHCP server to release the current DHCP configuration and discard the IP address configuration…". `/renew` "Renews DHCP configuration…". `/flushdns` "Flushes and resets the contents of the DNS client resolver cache". `/displaydns` shows the cache including Hosts-file entries. `/registerdns` starts dynamic DNS registration. `/release6` and `/renew6` are the DHCPv6 equivalents. The command lets users "determine which settings came from DHCP, Automatic Private IP Addressing (APIPA), or an alternate configuration". Adapter names with spaces need quotes, and `*` wildcards are allowed. — [Microsoft Learn: ipconfig](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig)

### Inferences
(All sample outputs below are **illustrative**, built on documented formats. Values use 192.168.1.0/24 and are fictional. MACs are fake.)

**Windows.**
```
C:\> ipconfig /all
Windows IP Configuration
   Host Name . . . . . . . . . . . . : LAPTOP-01
   Primary Dns Suffix  . . . . . . . :
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No

Wireless LAN adapter Wi-Fi:
   Connection-specific DNS Suffix  . : home
   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX201 160MHz
   Physical Address. . . . . . . . . : 3C-A9-F4-12-34-56        <- MAC (dash format)
   DHCP Enabled. . . . . . . . . . . : Yes                       <- dynamic, not static
   Autoconfiguration Enabled . . . . : Yes
   Link-local IPv6 Address . . . . . : fe80::1c2b:3d4e:5f60:7182%12(Preferred)
   IPv4 Address. . . . . . . . . . . : 192.168.1.23(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0             <- dotted decimal
   Lease Obtained. . . . . . . . . . : Sunday, 15 November 2026 09:12:03
   Lease Expires . . . . . . . . . . : Monday, 16 November 2026 09:12:03
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.1
                                       8.8.8.8
   NetBIOS over Tcpip. . . . . . . . : Enabled
```
- APIPA failure looks like this: `Autoconfiguration IPv4 Address. . : 169.254.37.112(Preferred)`, `Subnet Mask 255.255.0.0`, and an **empty** Default Gateway. This means the DHCP server is unreachable (cable, VLAN, missing `ip helper-address`, server down).
- Other Windows commands:
  - `ipconfig /release` then `ipconfig /renew` makes the client run DHCP again (DORA). Use it after fixing the DHCP server.
  - `ipconfig /flushdns` clears stale DNS entries.
  - `netsh interface ip show config` shows the DHCP flag, IP, mask, gateway and DNS per interface in a compact form [verify field names].
  - PowerShell `Get-NetIPConfiguration` shows InterfaceAlias, IPv4Address, IPv4DefaultGateway and DNSServer [verify field names]. `Get-NetIPAddress` gives a PrefixLength field (/24).
  - `route print` shows the routing table. The row with `0.0.0.0  0.0.0.0  192.168.1.1  192.168.1.23  35` is the default route (network, mask, gateway, interface, metric).
  - `arp -a` shows the IP → MAC cache. The gateway entry should appear after a ping.
  - `tracert 8.8.8.8` traces the path. Windows tracert uses ICMP echo; Unix traceroute uses UDP by default [verify].
  - `nslookup cisco.com` shows which DNS server answered and the address(es).

**macOS.**
```
$ ifconfig en0
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=6460<TSO4,TSO6,CHANNEL_IO,PARTIAL_CSUM,ZEROINVERT_CSUM>
	ether a4:83:e7:12:34:56                                    <- MAC (colon format)
	inet6 fe80::10c4:2a1b:9e0f:3c21%en0 prefixlen 64 secured scopeid 0xb
	inet 192.168.1.42 netmask 0xffffff00 broadcast 192.168.1.255   <- mask in HEX
	nd6 options=201<PERFORMNUD,DAD>
	media: autoselect
	status: active
```
- **Hex mask decoding:** 0xffffff00 = ff.ff.ff.00 = 255.255.255.0 = /24. More examples: 0xffffffc0 = 255.255.255.192 (/26), 0xfffffff0 = /28, 0xffff0000 = /16. Each hex pair is one octet, with f = 1111, c = 1100, 8 = 1000, e = 1110. This makes a good quiz item.
- On Macs `en0` is usually Wi-Fi on laptops without Ethernet, but naming varies [verify per model]. `networksetup -listallhardwareports` maps names.
```
$ networksetup -getinfo "Wi-Fi"
DHCP Configuration
IP address: 192.168.1.42
Subnet mask: 255.255.255.0
Router: 192.168.1.1
Client ID:
IPv6: Automatic
IPv6 IP address: none
IPv6 Router: none
Wi-Fi ID: a4:83:e7:12:34:56
```
- Other macOS commands:
  - `ipconfig getifaddr en0` prints just `192.168.1.42`.
  - `ipconfig getpacket en0` dumps the DHCP ACK (lease_time, router, domain_name_server, server_identifier) [verify field names].
  - `netstat -rn` shows the routing table, with the `default  192.168.1.1  UGScg  en0` line [verify flags].
  - `route get default` shows `gateway: 192.168.1.1` and `interface: en0`.
  - `scutil --dns` shows the resolver configuration (`nameserver[0] : 192.168.1.1`). Note that `/etc/resolv.conf` on macOS is informational and not used by all apps [verify].
  - `traceroute 8.8.8.8` uses UDP by default; add `-I` for ICMP.
  - The `arp -a` format is `? (192.168.1.1) at 0:11:22:33:44:55 on en0 ifscope [ethernet]`.

**Linux (iproute2; net-tools `ifconfig/route/arp/netstat` is deprecated and often not installed).**
```
$ ip addr show          # or: ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff      <- MAC
    inet 192.168.1.50/24 brd 192.168.1.255 scope global dynamic noprefixroute enp0s3   <- CIDR prefix; "dynamic" = DHCP
       valid_lft 86234sec preferred_lft 86234sec            <- remaining DHCP lease
    inet6 fe80::a00:27ff:feab:cdef/64 scope link
```
```
$ ip route              # or: ip r
default via 192.168.1.1 dev enp0s3 proto dhcp src 192.168.1.50 metric 100
192.168.1.0/24 dev enp0s3 proto kernel scope link src 192.168.1.50 metric 100
```
```
$ ip neigh              # ARP cache
192.168.1.1 dev enp0s3 lladdr 00:11:22:33:44:55 REACHABLE
```
```
$ resolvectl status     # systemd-resolved
Link 2 (enp0s3)
    Current Scopes: DNS
Current DNS Server: 192.168.1.1
       DNS Servers: 192.168.1.1
$ cat /etc/resolv.conf
nameserver 127.0.0.53      <- systemd-resolved stub; the real servers are in resolvectl
```
- `nmcli device show enp0s3` shows NetworkManager's view: GENERAL.HWADDR, IP4.ADDRESS[1] 192.168.1.50/24, IP4.GATEWAY, IP4.DNS[1] [verify field names].
- `tracepath` needs no root and also discovers the path MTU. `traceroute` may need installing.
- Linux uses prefix notation (/24) and never shows the dotted mask in `ip`. Legacy `ifconfig` shows `netmask 255.255.255.0`.

**Comparison table for the lesson.**

| Need | Windows | macOS | Linux |
|---|---|---|---|
| IP + mask | `ipconfig` | `ifconfig en0` (hex mask) / `ipconfig getifaddr en0` | `ip a` (/prefix) |
| Everything | `ipconfig /all` | `networksetup -getinfo "Wi-Fi"` | `nmcli device show` |
| Gateway | `ipconfig`, `route print` | `netstat -rn`, `route get default` | `ip route` |
| DNS | `ipconfig /all`, `nslookup` | `scutil --dns` | `resolvectl status`, `/etc/resolv.conf` |
| MAC | `ipconfig /all` (Physical Address) | `ifconfig` (ether) | `ip link` / `ip a` (link/ether) |
| ARP cache | `arp -a` | `arp -a` | `ip neigh` |
| Renew DHCP | `ipconfig /release` + `/renew` | `sudo ipconfig set en0 DHCP` [verify] | `sudo dhclient -r && sudo dhclient` / `nmcli con up` [verify] |
| Path | `tracert` | `traceroute` | `traceroute` / `tracepath` |

**What to check (troubleshooting logic for the exam).**
1. Is there an IP at all? 169.254.x.x means a DHCP problem. 0.0.0.0 means no address.
2. Do the mask and IP match the site's plan? The mask must be the same on all hosts in the subnet.
3. Is the gateway **in the same subnet** as the host? Example trap: host 192.168.1.130/25 with gateway 192.168.1.1. The host's network is 192.168.1.128/25, so the gateway is unreachable and the host can reach its LAN but nothing beyond it.
4. Is DNS set? If `ping 8.8.8.8` works but `ping cisco.com` fails, DNS is the problem.
5. Ping order: 127.0.0.1 → own IP → gateway → remote IP → remote name.

### Gaps
- No primary source was fetched in this session for the Apple man pages (`networksetup`, `ipconfig` on macOS, `scutil`), Linux `ip(8)`, `resolvectl(1)` or `nmcli`. Those outputs are from knowledge and are marked [verify]. They should be checked on a real Mac or Linux box (the RPi4 runs Linux, so `ip a`, `ip r` and `resolvectl` can be captured there directly).
- `Get-NetIPConfiguration` and `netsh` output field names were not fetched [verify on Microsoft Learn].

---

## Q7 — Exam traps, Packet Tracer lab ideas, Wikimedia Commons images

### Takeaway
Most points are lost on four things: arithmetic slips (network, broadcast, valid host), the 172.16–31 range, gateway-in-wrong-subnet scenarios, and confusing APIPA, loopback and CGNAT with RFC 1918. Packet Tracer PCs support a reduced Windows-like prompt (ipconfig, ping, tracert, arp, nslookup), which is enough for 1.6/1.10 labs. macOS and Linux commands cannot be practised in PT.

### Cited Findings
- Commons "Category:IPv4 addresses" contains 111 files, including *IPv4 classes-en.svg*, *IPv4 address stracture-en.svg* (sic), *Subnetting Concept.svg*, *VLSM example-en.svg*, *VLSM Chart.svg*, *CIDR Address.svg*, *Ipv4packet.png*, *IP Packet.png* and *IPv4 Classfull Subnetting all cases-en.svg*. — [Commons category mirror](https://download.osmand.net/wiki/Category:IPv4_addresses)
- **File:NAT_Concept-en.svg** — Michel Bakni — **CC BY-SA 4.0** — uploaded 17 Jan 2020, caption "NAT IP Address Swapping". — [Commons mirror](https://wiki.riteme.site/wiki/File:NAT_Concept-en.svg)
- **File:IPv4_IANA_and_RIR_exhaustion_time_line-en.svg** — Michel Bakni — **CC BY-SA 4.0** — dated 21 Jan 2020, sources IANA, APNIC, RIPE, LACNIC, ARIN, AfriNIC. — [Commons mirror](https://wiki.riteme.site/wiki/File:IPv4_IANA_and_RIR_exhaustion_time_line-en.svg)
- **File:Ipv4_address.svg** — original by "Indeterminate" (self-made, 6 Oct 2007), revised by Kbrose in 2018 — the license was not shown on the mirror [verify; historically GFDL/CC BY-SA]. — [Commons mirror](https://wiki.riteme.site/wiki/File:Ipv4_address.svg)

### Inferences

**Exam traps (for "Capcane de examen").**
- "Which is a valid host in 10.10.10.64/26?" .64 is the network and .127 is the broadcast, so the answer must be .65–.126.
- "/30 has how many hosts?" The answer is 2, not 4. "/31?" 2 by RFC 3021 (point-to-point only). "/32?" One address, for a loopback or host route.
- "Minimum mask for 500 hosts?" /23 (510), not /24.
- "Subnets from a /24 with mask /27?" 8 (2^3). Modern answers include subnet zero.
- 172.32.x.x is public and 172.31.x.x is private. 192.168.256.1 is invalid (an octet can be at most 255).
- 169.254 is not "private" in the RFC 1918 sense. 100.64/10 is not RFC 1918 either.
- `ip address` without `secondary` overwrites the primary address.
- C route versus L route: L is /32, the router's own address.
- An "administratively down" interface means the admin did not run `no shutdown`. It is not a cable fault.
- Host can ping the gateway but not remote hosts → check the gateway setting on the host, or the routing on the router. Host can ping IPs but not names → DNS.
- macOS hex masks: 0xfffffe00 = /23.
- Windows `ipconfig` without `/all` does **not** show DNS servers, the MAC or the DHCP server.

**Packet Tracer support.** The PT PC "Command Prompt" `help` list is from memory and must be checked in PT 8.2 [verify]: `arp`, `delete`, `dir`, `exit`, `ftp`, `help`, `ipconfig` (`/all`, `/release`, `/renew`), `ipv6config`, `netstat`, `nslookup`, `ping`, `pppoe`, `rename`, `snmpget`, `snmpgetbulk`, `snmpset`, `ssh`, `telnet`, `tftp`, `tracert`. It is **not** a real Windows shell: there is no `route print`, `netsh`, PowerShell, `ipconfig /flushdns` or `/displaydns` [verify each]. On routers, all the IOS commands above (`ip address … secondary`, `show ip interface brief`, `show ip route connected`) are supported in PT.

**Lab ideas.**
1. **"Address it yourself" (1.6, guided).** Topology: R1 with G0/0, G0/1 and G0/2, three switches, PCs. VLSM 192.168.10.0/24 for 60/28/12 hosts plus a /30 to R2. Steps: compute the table (Q2), configure the interfaces, `show ip int brief`, `show ip route connected` (C and L), then ping across. Solo variant: 172.20.0.0/22 for 200/100/50/2.
2. **Break-and-fix (1.6).** Pre-built PT file with faults: an overlapping subnet (to provoke "overlaps with"), a broadcast address on the interface ("Bad mask"), a missing `no shutdown`, a PC with the wrong mask, a PC whose gateway is in another subnet. The learner diagnoses using only `show` commands and PC `ipconfig`.
3. **Secondary address (1.6).** Grow a LAN by adding `ip address … secondary`. Observe two C/L pairs, and that `show ip int brief` shows only the primary.
4. **Client OS verification (1.10).** In PT, set one PC to DHCP with a DHCP server present, then remove or disconnect the server, then `ipconfig /release` and `/renew`. The PC shows 169.254.x.x (APIPA). PT does assign APIPA when DHCP fails [verify]. Use `arp -a` after pinging the gateway and `tracert` across two routers. Real-OS add-on (outside PT): run `ipconfig /all`, `ifconfig en0`/`networksetup`, and `ip a`/`ip r`/`resolvectl` on the learner's own computers and RPi4, then fill in an "IP / mask / GW / DNS / MAC / DHCP?" worksheet.
5. **Private versus public (1.7, conceptual).** PT: inside LAN 192.168.1.0/24, an "ISP" router with 203.0.113.0/24 (documentation range) and a "web server" at 198.51.100.10. Without NAT the ping fails because the ISP has no route back to 192.168.1.0/24. Then preview PAT (`ip nat inside source list 1 interface g0/1 overload`) and look at `show ip nat translations`. Mark this as a preview of 4.1.

**Wikimedia Commons image candidates (exact names; download through the thumb URL scheme in CLAUDE.md).**

| File | Use | Author | License |
|---|---|---|---|
| File:NAT_Concept-en.svg | 1.7 NAT concept | Michel Bakni | CC BY-SA 4.0 (confirmed via mirror) |
| File:IPv4_IANA_and_RIR_exhaustion_time_line-en.svg | 1.7 exhaustion history | Michel Bakni | CC BY-SA 4.0 (confirmed via mirror) |
| File:Ipv4_address.svg | 1.6 dotted decimal ↔ binary | Indeterminate (2007), rev. Kbrose | [verify license] |
| File:IPv4_classes-en.svg | 1.6 classful history | likely Michel Bakni (same series) [verify] | [verify, likely CC BY-SA 4.0] |
| File:Subnetting_Concept.svg | 1.6 network/host split | [verify] | [verify] |
| File:VLSM_example-en.svg | 1.6 VLSM | likely Michel Bakni [verify] | [verify] |
| File:Ipv4packet.png or the IPv4 header table on Commons | 1.6 header | [verify] | [verify] |

- Recommendation: for the header, the mask table and the VLSM layout, **draw original SVGs** (CLAUDE.md §2 "diagrame SVG originale"). Use Commons only for NAT and the exhaustion timeline, where the licenses are confirmed. CC BY-SA 4.0 requires attribution plus a license link in `attribution.json`, and share-alike if modified, so use them unmodified.

### Gaps
- commons.wikimedia.org was unreachable (proxy). Licenses for IPv4_classes-en.svg, Subnetting_Concept.svg, VLSM_example-en.svg and Ipv4packet.png could not be confirmed, and the mirror fetch for two of them failed. Check them before downloading.
- No source was found listing the PT PC Command Prompt commands. The list above is [verify] in PT (type `help` or `?` at the PC prompt).
