# CCNA 200-301 v1.1 — 1.3 Compare physical interface and cabling types / 1.4 Identify interface and cable issues

Scope: 1.3.a Single-mode fiber, multimode fiber, copper; 1.3.b Connections (Ethernet shared media and point-to-point); 1.4 Identify interface and cable issues (collisions, errors, mismatch duplex, and/or speed).

Tagging convention used below:
- Facts with an inline link were read in the cited source during this research session.
- `[verify]` = value from background knowledge (standard CCNA/OCG material) that I could NOT confirm against a fetched source in this session (the shared web-fetch budget ran out and Wikimedia Commons was blocked by the proxy). Verify these before publishing.
- `[conflict]` = sources disagree; both versions are shown.

---

## Q1. Ethernet standards evolution: verified distances and standards table (what problem each one solved)

### Takeaway
Ethernet went from a shared coax bus (10BASE5 1983, 10BASE2) to star-wired twisted pair (10BASE-T 1990, which made faults easy to isolate and used cheap phone-style cable), then 100 Mb/s (802.3u 1995), 1 Gb/s on fiber (802.3z 1998) and on Cat5 copper using all 4 pairs (802.3ab 1999), 10 Gb/s on fiber (802.3ae 2002) and copper (802.3an 2006), and "multi-gig" 2.5/5 Gb/s on existing Cat5e/6 (802.3bz 2016, driven by Wi-Fi 802.11ac Wave 2). Copper UTP stays at **100 m** max for everything up to 10GBASE-T; 25/40GBASE-T need Cat8 and only reach 30 m.

### Cited Findings

**Coax era (shared bus, CSMA/CD)**
- 10BASE5 ("thicknet"): standardized by Ecma in early 1982 from an IEEE draft, then IEEE 802.3 in 1983; cable similar to RG-8/U with extra braid, ~10 mm (0.4 in) diameter, 50 Ω, yellow-to-orange jacket; max segment 500 m; up to 100 nodes per segment, all in one collision domain — [Wikipedia: 10BASE5](https://en.wikipedia.org/wiki/10BASE5)
- 10BASE5 transceivers could only be placed at 2.5 m intervals (black bands on the cable) so reflections from taps stay out of phase; attached with "vampire taps" (hole drilled through shield, spike pierces to centre conductor), allowing stations to be added live — [Wikipedia: 10BASE5](https://en.wikipedia.org/wiki/10BASE5)
- 10BASE5 specified CSMA/CD to resolve collisions; problems: stiff cable, one bad connection could take down the whole network and was hard to locate; missing termination or a break reflects signals that look like collisions; deprecated for new installations in 2003 — [Wikipedia: 10BASE5](https://en.wikipedia.org/wiki/10BASE5)
- 10BASE2 ("thinnet", "cheapernet"): standardized 1984; thin coax RG-58A/U; max segment 185 m (the "2" ≈ 200 m); max 30 stations per segment; min 0.5 m between devices; BNC T-connectors plugged directly into the NIC; 50 Ω terminator at each end; ground at one end only — [Wikipedia: 10BASE2](https://en.wikipedia.org/wiki/10BASE2)
- 10BASE2 problems: a single break or bad contact stops the whole segment (reflection looks like a collision); extending the network interrupts service; faults hard to trace — "10BASE-T largely replaced it" — [Wikipedia: 10BASE2](https://en.wikipedia.org/wiki/10BASE2)
- 10BASE2 is identified as IEEE 802.3a and 10BASE-T as 802.3i — [Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet)
- 5-4-3 rule (max 5 segments, 4 repeaters, 3 populated segments in one collision domain) `[verify]` — not explained in the fetched pages.
- 10BASE5 AUI drop cable (max 50 m) to the transceiver/MAU `[verify]`.

**Twisted pair (from the Wikipedia standards table)** — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)

| Name | IEEE | Year | Min. cable | Pairs | Max distance |
|---|---|---|---|---|---|
| 10BASE-T | 802.3i (Cl.14) | 1990 | Cat 3 | 2 | 100 m |
| 100BASE-TX | 802.3u (Cl.25) | 1995 | Cat 5 | 2 | 100 m |
| 100BASE-T4 | 802.3u (Cl.23) | 1995 | Cat 3 | 4 | 100 m |
| 1000BASE-T | 802.3ab (Cl.40) | 1999 | Cat 5 | 4 | 100 m |
| 2.5GBASE-T | 802.3bz (Cl.126) | 2016 | Cat 5e | 4 | 100 m |
| 5GBASE-T | 802.3bz (Cl.126) | 2016 | Cat 6 per Wikipedia `[conflict]` | 4 | 100 m |
| 10GBASE-T | 802.3an (Cl.55) | 2006 | Cat 6A (Cat 6 ≈ 55 m) | 4 | 100 m |
| 25GBASE-T / 40GBASE-T | 802.3bq (Cl.113) | 2016 | Cat 8 | 4 | 30 m |

- `[conflict]` 5GBASE-T cable: Wikipedia's table lists Cat 6; Cisco's NBASE-T blog says NBASE-T runs "up to 100 meters of Cat 5e/6" without separating 2.5G and 5G — [Cisco blog: NBASE-T Alliance](https://blogs.cisco.com/networking/nbase-t-alliance-achieving-a-new-industry-standard). The commonly stated IEEE target is 2.5G **and** 5G over Cat5e at 100 m `[verify]`. Suggest teaching: "2.5G/5G = reuse your existing Cat5e/Cat6".
- 802.3bz motivation: 802.11ac Wave 2 Wi-Fi pushes more traffic to the wired access layer than 1 Gb/s can carry; NBASE-T avoids expensive recabling — [Cisco blog](https://blogs.cisco.com/networking/nbase-t-alliance-achieving-a-new-industry-standard). Uses PAM-16 on 4 pairs — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)
- 100BASE-TX: 2 pairs of Cat5, one pair per direction; 4B5B → NRZI → MLT-3, 125 MBd — [Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet). 100BASE-T4 ran on Cat3 (4 pairs, half-duplex only) but was barely adopted — same source.
- Fast Ethernet kept 10BASE-T's star topology and backward compatibility (autonegotiation lets a switch fall back to 10BASE-T half duplex) — [Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet)
- 1000BASE-T: 4 pairs Cat5 or better, 100 m; simultaneous bidirectional transmission on all four pairs with echo cancellation; PAM-5 at 125 MBd with 4D trellis coding; autonegotiation mandatory; Auto MDI/MDI-X optional but common; does not use 8b/10b — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- 25G/40GBASE-T are point-to-point, full-duplex, short-reach data-centre links — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)

**Fiber**
- 100BASE-FX (802.3u): 1300 nm over multimode; 2 km full duplex; only 412 m half duplex (so collisions can still be detected) — [Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet)
- 802.3z (June 1998) 1000BASE-X is based on Fibre Channel physical layers and uses 8b/10b (~25% overhead) — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- 1000BASE-SX: 770–860 nm (850 nm nominal) multimode; 220 m (62.5 µm/160 MHz·km), 275 m (62.5 µm/200 = OM1), 500 m (50 µm/400), 550 m (50 µm/500 = OM2) — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- 1000BASE-LX: 1270–1355 nm (1310 nm nominal) laser; up to 5 km SMF and 550 m MMF; MMF links > 300 m may need a mode-conditioning (offset launch) patch cord — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- 1000BASE-CX: 150 Ω shielded copper, 25 m, legacy — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- 1000BASE-LX10 (10 km SMF) and 1000BASE-BX10 (single strand, 1490 nm down / 1310 nm up, 10 km) come from 802.3ah-2004, not 802.3z; 1000BASE-ZX is non-standard, 1550 nm, ≥70 km — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- 802.3ae (2002): 10GBASE-SR 850 nm MMF — 33 m OM1, 82 m OM2, 300 m OM3, 400 m OM4; 10GBASE-LR 1310 nm SMF 10 km; 10GBASE-ER 1550 nm SMF 40 km (30 km standard links); also LX4 and WAN-PHY SW/LW/EW — [Wikipedia: 10 Gigabit Ethernet](https://en.wikipedia.org/wiki/10_Gigabit_Ethernet)
- 10GBASE-LRM is 802.3aq-2006 (220 m on legacy MMF); 10GBASE-ZR (80 km) is proprietary; SFP+/XFP are MSAs not IEEE standards; SFP+ DAC twinax is not an IEEE name; IEEE twinax = 10GBASE-CX4 (802.3ak-2004, 15 m) — [Wikipedia: 10 Gigabit Ethernet](https://en.wikipedia.org/wiki/10_Gigabit_Ethernet)
- 40GBASE-SR4 / 100GBASE-SR10: 100 m on OM3, 150 m on OM4 — [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber)
- 40G/100G Ethernet = IEEE 802.3ba (2010); 40GBASE-SR4 uses 4 parallel lanes over MPO-12; 100GBASE-SR4 = 802.3bm (2015), 70 m OM3 / 100 m OM4; 25GBASE-SR = 802.3by (2016), 70 m OM3 / 100 m OM4 `[verify]` (the multimode table partly listed 25GBASE-SR OM3 = 70 m — [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber)).

### Inferences
- Lesson framing "problem → solution":
  - 10BASE5: first standard Ethernet, but heavy cable, fixed tap points, one fault kills everyone.
  - 10BASE2: cheaper/flexible, but still a daisy-chained bus — still one fault kills the segment.
  - 10BASE-T: star wiring to a hub; one bad cable only affects one PC; uses cheap telephone-grade twisted pair (Cat3). Still a shared collision domain via the hub.
  - 100BASE-TX: 10× faster on Cat5 + autonegotiation for backward compatibility.
  - 1000BASE-SX/LX (802.3z): gigabit backbones on fiber first (borrowed Fibre Channel optics) because copper gigabit was harder.
  - 1000BASE-T (802.3ab): gigabit to the desk over *existing* Cat5 by using all 4 pairs in both directions.
  - 10GBASE-SR/LR/ER (802.3ae): data-centre/campus backbones; fiber only, full duplex only (CSMA/CD gone).
  - 10GBASE-T (802.3an): 10G on copper but needs Cat6A for 100 m, more power/latency.
  - 2.5/5GBASE-T (802.3bz): Wi-Fi APs need > 1 Gb/s but recabling is expensive.
  - 25/40GBASE-T (802.3bq): rack-level server links, 30 m, Cat8.
- Cable categories for the exam: Cat5 (100 Mb, 1 Gb nominal), Cat5e (1G, practical standard, 2.5G), Cat6 (1G/5G; 10G to ~55 m), Cat6A (10G 100 m), Cat8 (25/40G 30 m). Cable bandwidth ratings (Cat5e 100 MHz, Cat6 250 MHz, Cat6A 500 MHz, Cat8 2000 MHz) `[verify]`.
- 10 Gb/s and above Ethernet is full-duplex only, so collisions/CSMA/CD are irrelevant there `[verify]` (consistent with 25/40GBASE-T being described as full-duplex point-to-point).

### Gaps
- Exact IEEE publication years for 802.3a (1985?) vs Wikipedia's "1984" for 10BASE2 — not confirmed `[verify]`.
- 5GBASE-T cable category conflict (Cat5e vs Cat6) not resolved from a primary IEEE source.
- Cisco SFP datasheets (e.g., GLC-SX-MMD/GLC-LH-SMD reaches, 1000BASE-LX/LH 10 km Cisco variant) not fetched `[verify]`.

---

## Q2. Copper: UTP vs STP, pinouts, straight/crossover/rollover, MDI/MDI-X, Auto-MDIX, why 4 pairs

### Takeaway
T568A and T568B differ only by swapping pairs 2 and 3 (orange and green). For 10/100 Mb/s, PCs/routers (MDI) send on pins 1,2 and receive on 3,6; switches/hubs (MDI-X) do the opposite, so unlike devices use straight-through and like devices use crossover — unless Auto-MDIX fixes it. Gigabit uses all 4 pairs bidirectionally (PAM-5 + echo cancellation) so the old 1,2/3,6 rule no longer describes it fully.

### Cited Findings
- T568A vs T568B: both are 8P8C termination standards; they swap pairs 2 and 3. Pair 2 is on pins 3,6 in T568A and pins 1,2 in T568B; pair 3 the reverse. One end T568A + other end T568B = crossover for 10BASE-T/100BASE-TX — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)
- MDI (hosts) transmit on 1,2 and receive on 3,6; MDI-X (hubs/switches) transmit on 3,6 and receive on 1,2; straight-through joins MDI to MDI-X; same-type ports need a crossover — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)
- Later equipment can switch MDI/MDI-X automatically, so crossover cables are often unnecessary; 1000BASE-T connects with either cable type when both support it — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)
- 1000BASE-T: bidirectional on all four pairs with hybrids and echo cancellers, 4D-PAM5, four lanes per direction at 125 MBd; because all four pairs are used, cable sharing with other services isn't possible — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair); "Auto MDI/MDI-X optional but commonly implemented" — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- Cisco: Auto-MDIX is described in the autoneg tech note; cross-connected cabling (e.g., wrong cable between station and hub) is listed as a cause of "no link integrity" — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html); [Cisco Internetwork Troubleshooting Guide: Ethernet](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html)
- Using Cat3 cable with 100BASE-TX instead of Cat5 is a listed cause of "excessive noise" (high CRC, few collisions) — [Cisco Troubleshooting Guide: Ethernet](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html)

Background (all `[verify]`, standard OCG content not fetched this session):
- T568B colour order pins 1–8: white-orange, orange, white-green, blue, white-blue, green, white-brown, brown. T568A: white-green, green, white-orange, blue, white-blue, orange, white-brown, brown.
- Device classification (Odom OCG): MDI ("transmit on 1,2") = PC NIC, router, wireless AP (Ethernet port), firewall, server; MDI-X = hub, switch. Straight-through: PC↔switch, router↔switch, AP↔switch. Crossover: switch↔switch, hub↔hub, switch↔hub, PC↔PC, router↔router, PC↔router (router Ethernet port acts like a PC).
- Gigabit crossover also swaps pairs 1↔4 and 2↔3 → (1↔3, 2↔6, 4↔7, 5↔8).
- Rollover (console) cable: pin 1↔8, 2↔7, 3↔6, 4↔5 (reversed order), RJ-45 to DB-9 (RS-232) on PC side; console default 9600 baud, 8 data bits, no parity, 1 stop bit, no flow control. Modern alternatives: USB mini-B/USB-C console port.
- Cisco IOS: `mdix auto` (interface command, on by default on most Catalyst switches since ~12.2(18)SE; requires speed and duplex set to auto on some platforms). Verify with `show controllers ethernet-controller <if> phy | include MDIX` [verify syntax].
- UTP = Unshielded Twisted Pair (most common LAN cable; twisting cancels EMI and crosstalk); STP/FTP/S/FTP = shielded (foil/braid) — used in high-EMI environments, needs grounding; Cat6A often F/UTP; Cat8 always shielded. Crosstalk types: NEXT (near-end), FEXT (far-end), alien crosstalk (between cables; key issue for 10GBASE-T). Different twist rates per pair reduce crosstalk.
- Copper channel 100 m = 90 m permanent link (horizontal) + 10 m patch cords (TIA-568).

### Inferences
- For a beginner, teach rule-of-thumb first ("different devices → straight; same devices → crossover"), then immediately say modern switches have Auto-MDIX so in practice almost everything works with straight-through; but the exam still asks the classic rule.
- Router↔PC directly needs crossover (both MDI) — a classic trap.

### Gaps
- Exact Cisco platform default for `mdix auto` and its dependency on `speed auto`/`duplex auto` not confirmed from a Cisco page this session `[verify]`.
- Rollover pinout and console settings not fetched from Cisco docs `[verify]`.

---

## Q3. Fiber: SMF vs MMF, OM/OS, sources, wavelengths, connectors, transceivers, BiDi

### Takeaway
Multimode fiber has a wide core (50 or 62.5 µm), cheap LED/VCSEL sources at 850 nm (or 1300 nm), and suffers from modal dispersion → hundreds of metres. Single-mode has a ~9 µm core carrying a single mode, laser at 1310/1550 nm → kilometres to tens of km. Both have 125 µm cladding. Jacket colours: SMF yellow, OM1/OM2 orange, OM3/OM4 aqua, OM5 lime green.

### Cited Findings
- OM classes (core / modal bandwidth @850 nm): FDDI-grade 62.5 µm/160 MHz·km; OM1 62.5 µm/200; OM2 50 µm/500; OM3 50 µm/1500; OM4 50 µm/3500; OM5 50 µm/3500 (850 nm) and 1850 (953 nm) — [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber)
- Jacket colours: single-mode yellow (TIA-598C), OM1/OM2 orange, OM3/OM4 aqua, some OM4 violet, OM5 lime green — [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber)
- LEDs and VCSELs operate at 850 and 1300 nm; single-mode typically 1310 or 1550 nm; LEDs emit a spread of wavelengths and are limited to ~622 Mb/s (OM1/OM2); VCSELs modulate > 10 Gb/s and are used with laser-optimized OM3+ — [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber)
- Modal dispersion: different modes travel at different speeds, spreading the pulse over distance → intersymbol interference; single-mode avoids it by carrying one mode — [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber)
- Reach table (MMF): 10GBASE-SR 26 m FDDI-grade / 33 m OM1 / 82 m OM2 / 300 m OM3 / 400 m OM4; 1000BASE-SX 220 m FDDI / 275 m OM1 / 550 m OM2; 10GBASE-LRM 220 m; 40GBASE-SR4 & 100GBASE-SR10 100 m OM3 / 150 m OM4 — [Wikipedia: Multi-mode optical fiber](https://en.wikipedia.org/wiki/Multi-mode_optical_fiber)
- Connectors: LC = 1.25 mm ferrule, latch, IEC 61754-20, high density, used on SFP/SFP+/XFP, duplex LC ≈ RJ-45 size; SC = 2.5 mm ferrule, push-pull, most widely deployed; ST = 2.5 mm ferrule, bayonet push-and-twist; MPO/MTP = multi-fibre ribbon (4–24 fibres), 2.5×6.4 mm ferrule, push-pull — [Wikipedia: Optical fiber connector](https://en.wikipedia.org/wiki/Optical_fiber_connector)
- APC = angled (normally 8°) end-face, green boot/body; UPC = non-angled ultra polish — [Wikipedia: Optical fiber connector](https://en.wikipedia.org/wiki/Optical_fiber_connector)
- BiDi single strand: 1000BASE-BX10 uses 1490 nm downstream / 1310 nm upstream on one fibre, 10 km (802.3ah) — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)
- SFP+/XFP are MSAs (Multi-Source Agreements), not IEEE — [Wikipedia: 10 Gigabit Ethernet](https://en.wikipedia.org/wiki/10_Gigabit_Ethernet)
- Cisco: modular SFP/GBIC often don't autonegotiate; a Gigabit port connected to a Fast Ethernet port can show line protocol down; gigabit links need matching GBIC types — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html); [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)

Background `[verify]`:
- Single-mode fibre: 8–10 µm core (spec "9/125"), OS1 (indoor tight-buffered, ~1 dB/km) and OS2 (outdoor/loose-tube, low water peak, ~0.4 dB/km) — ITU-T G.652.
- Duplex fibre = 2 strands, one Tx and one Rx; Tx on one end must land on Rx on the other (A-to-B polarity). Swapped strands → no link (a common real-world fault; on the exam "fiber Tx/Rx reversed" = down/down).
- Transceivers: GBIC (old, large) → SFP (1G) → SFP+ (10G) → SFP28 (25G) → QSFP+ (40G, 4×10G) → QSFP28 (100G, 4×25G). SFP/SFP+ use duplex LC; QSFP SR4 uses MPO-12 (8 fibres used).
- Benefits of fibre (exam-friendly): longer distance, immune to EMI, no ground loops/electrical isolation between buildings, harder to tap; downsides: cost of optics, fragile, specialized termination.
- Cisco BiDi QSFP (QSFP-40G-SR-BD) runs 40G over duplex MMF (LC) using two wavelengths per strand — `[verify]`.

### Inferences
- Exam-level mnemonic: "MM = Many Modes, Metres (hundreds), cheap LED/VCSEL at 850; SM = Single Mode, kilometres, laser at 1310/1550."
- "Why is the multimode core bigger?" → easier/cheaper to couple light from cheap sources and align connectors, at the cost of modal dispersion.

### Gaps
- OS1/OS2 attenuation values and ITU references not confirmed `[verify]`.
- FOA (thefoa.org) and TIA-568 summaries not fetched (budget).
- Exact Cisco transceiver reach values (GLC-SX-MMD, GLC-LH-SMD, SFP-10G-SR/LR/ER) not fetched.

---

## Q4. Shared media vs point-to-point (1.3.b): hubs, collision/broadcast domains, CSMA/CD, duplex, serial

### Takeaway
On shared media (coax bus, or a hub — a multiport repeater), all devices share one collision domain and must run half duplex with CSMA/CD. A switch port is its own collision domain; with one device per port and full duplex there are no collisions at all. Broadcast domains are bounded only by routers (or VLANs). Point-to-point links (switch↔host full duplex, router serial links with HDLC/PPP) have exactly two endpoints.

### Cited Findings
- 10BASE5: up to 100 nodes "all in one collision domain"; CSMA/CD specified to resolve collisions — [Wikipedia: 10BASE5](https://en.wikipedia.org/wiki/10BASE5)
- Collisions are normal on half-duplex and "must not be seen on full duplex interfaces"; Carrier sense counter increments each time a half-duplex controller senses the wire before transmitting; Excess-Col = frame dropped after 16 consecutive collisions — [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)
- Late collision = collision after 512 bit-times (51.2 µs at 10 Mb/s), i.e., after the first 64-byte slot time; usually a duplex mismatch or a cable/segment too long — [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)
- Late collisions "should never occur in a properly designed network"; usually cables too long or too many repeaters (network diameter) — [Cisco Troubleshooting Guide: Ethernet](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html)
- Minimum frame is 64 bytes; padding is added if data is too short — [Cisco Troubleshooting Guide: Ethernet](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html)
- 100BASE-FX half duplex limited to 412 m "so collisions can be detected" (illustrates slot-time/diameter link) — [Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet)
- Fast Ethernet: star-wired bus topology like 10BASE-T, devices connect to hub or switch — [Wikipedia: Fast Ethernet](https://en.wikipedia.org/wiki/Fast_Ethernet)
- Cisco gigabit: Cisco devices support only full duplex at 1 Gb/s; half duplex requires speed 100 (error: "% Duplex cannot be set to half when speed autonegotiation subset contains 1Gbps…") — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)

Background `[verify]`:
- CSMA/CD steps: listen (carrier sense) → if idle transmit → while transmitting, detect collision → send 32-bit jam signal → each sender waits a random backoff (truncated binary exponential backoff, slot = 512 bit times) → retry, give up after 16 attempts.
- Why 64-byte minimum: the sender must still be transmitting when news of a collision from the farthest point returns (round-trip ≤ 512 bit times), otherwise it cannot know its frame collided.
- Hub = Layer 1, repeats bits out all ports, one collision domain, one broadcast domain, half duplex. Bridge/switch = Layer 2, each port = separate collision domain, one broadcast domain (per VLAN). Router = Layer 3, each interface = separate broadcast domain and collision domain.
- Full duplex requires a point-to-point link with no hub: separate Tx and Rx paths → sending and receiving simultaneously, CSMA/CD logic disabled.
- Serial WAN point-to-point (concept only for 1.3.b): leased line between two routers; encapsulation HDLC (Cisco default on serial, Cisco-proprietary variant with a type field) or PPP (standard, supports authentication PAP/CHAP); DCE side provides clock (`clock rate`). Ethernet WAN (Metro Ethernet E-Line) is also point-to-point. Counting domains exercise: "N switch ports with hosts = N collision domains; hub with 4 hosts = 1".

### Inferences
- Suggested beginner analogy: shared media = walkie-talkie conference where only one may talk (half duplex, listen-before-talk); switched full duplex = private phone call where both talk at once.
- Exam trap: "Which device creates separate collision domains? → switch (and router); separate broadcast domains → router (and VLANs on a switch)."

### Gaps
- No Cisco/IEEE primary page fetched for CSMA/CD algorithm detail and jam signal length `[verify]`.
- HDLC/PPP not researched in this session (out of depth for 1.3.b; concept only).

---

## Q5. 1.4 Interface counters: exact Cisco definitions (runts, giants, CRC, late collision...) and causes

### Takeaway
Cisco: **runts** = frames < 64 bytes (with bad CRC on switch docs); **giants** = frames > 1518 bytes (non-jumbo; switch docs add "with bad FCS"); **CRC** = checksum mismatch → usually noise/cabling/NIC, or a symptom of collisions/duplex mismatch; **late collision** = collision after 512 bit-times (first 64 bytes) → duplex mismatch (half side) or cable too long. Input errors is an aggregate counter, and sub-counters need not sum to it.

### Cited Findings (Cisco TN 12027 "Troubleshoot Switch Port and Interface Problems" — [link](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html), and Cisco Internetwork Troubleshooting Guide Ethernet chapter — [link](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html))

| Counter | Cisco definition | Likely causes |
|---|---|---|
| input errors | Sum including runts, giants, no buffer, CRC, frame, overrun, ignored; one datagram can trigger several errors so sub-counters won't sum to the total (TN 12027; TG) | see sub-counters |
| CRC | Received frame's checksum doesn't match the calculated one; "usually indicates noise or transmission problems on the LAN interface or the LAN itself"; high count often a side effect of collisions (TN 12027) | bad/damaged cable, Cat3 used for 100BASE-TX, EMI, bad NIC/port, duplex mismatch (full side) |
| frame | CRC error **and** non-integer number of octets (TN 12027; TG) | collisions, physical fault, duplex mismatch |
| runts | Frames smaller than the 64-byte IEEE 802.3 minimum, with a bad CRC (TN 12027); TG: "smaller than the medium's minimum… on Ethernet, anything under 64 bytes" | duplex mismatch, collisions (shared), bad cable/port/NIC, underruns |
| giants | Frames exceeding max IEEE 802.3 size (>1518 bytes non-jumbo) with bad FCS (TN 12027); TG: ">1518 bytes" | bad NIC, MTU/jumbo mismatch |
| undersize (switch counter) | Well-formed frame < 64 bytes with valid FCS (TN 12027) | check sending device |
| babbles | Transmit jabber timer expired; jabber = frame > 1518 octets that doesn't end on even octet or has bad FCS (TN 12027) | faulty NIC/transceiver |
| ignored | Received packets dropped because interface ran low on internal buffers; broadcast storms and noise bursts raise it (TN 12027; TG) | broadcast storm, bursts |
| no buffer | Received packets discarded for lack of buffer space; compare with ignored (TN 12027) | broadcast storm |
| overrun | Receiver couldn't hand data to a hardware buffer because the input rate exceeded capacity (TN 12027; TG) | traffic beyond HW capability |
| Align-Err / FCS-Err (switch) | Align: doesn't end on even octet + bad CRC; FCS-Err: valid size with FCS error and no other error (TN 12027) | physical fault or duplex mismatch |
| output errors | Sum of all errors that prevented final transmission (TN 12027; TG) | — |
| collisions | Times a collision occurred before successful transmission; normal on half duplex; must not appear on full duplex (TN 12027); TG: retransmissions due to collisions, usually overextended LAN; > ~0.1% of output packets = excessive | heavy shared segment; duplex mismatch |
| late collision | Collision after 512 bit-times (51.2 µs at 10 Mb/s), not detected until after first 64-byte slot (TN 12027) | duplex mismatch (half side), cable too long/too many repeaters |
| Single-Col / Multi-Col / Excess-Col | sent after 1 / several collisions; dropped after 16 (TN 12027) | high utilization or duplex mismatch |
| deferred | Transmitted after waiting for busy media; normal on half duplex (TN 12027) | — |
| interface resets | TG: full resets, e.g., when queued packets aren't sent for several seconds; also when looped or shut down; TN 12027: can accompany underruns | cabling/carrier loss, keepalive problems |
| underruns | Transmitter ran faster than the switch could handle (TN 12027) | bursts |
| total output drops | Dropped because output queue full; common from high-speed to low-speed link (TN 12027) | congestion (speed mismatch between ingress/egress, not link speed mismatch) |
| input queue drops | Input queue exceeded max size (TN 12027) | process-switched traffic overload |
| Xmit-Err | internal Tx buffer full (TN 12027) | faster link feeding slower link |

- Cisco ITG symptom table: "Excessive noise" = high CRC with few collisions (damaged cable, Cat3 with 100BASE-TX); "Excessive collisions" = >0.1% of output packets (unterminated cable, jabbering transceiver); "Excessive runts" = on shared Ethernet usually collisions, on switched Ethernet underruns or bad NIC software; "No link integrity" = media type mismatch, cross-connected cabling, 100BASE-T4 on two pairs, noise — [Cisco Troubleshooting Guide: Ethernet](https://www.cisco.com/en/US/docs/internetworking/troubleshooting/guide/tr1904.html)
- Field meanings (BW used by OSPF/EIGRP for metrics, not measured; DLY not measured; reliability x/255 exponential 5-min average; txload/rxload x/255; encapsulation ARPA = Ethernet II; watchdog = packets > 2048 bytes; throttles = receiver disabled) — [NetworkLessons: Cisco IOS Show Interface Explained](https://networklessons.com/troubleshooting/cisco-ios-show-interface-explained)
- Note: "Giants" on Odom/OCG-level definitions: frames larger than the maximum (1518 bytes, or interface MTU+headers) `[verify]` — Cisco docs consistently say 1518 for non-jumbo. 1518 = 1500 payload + 14 header + 4 FCS; 802.1Q-tagged frames are 1522 (baby giants) `[verify]`.

### Annotated sample output (ILLUSTRATIVE — constructed for teaching, not captured from a device; values chosen to show the half-duplex side of a duplex mismatch)

```
SW1# show interfaces GigabitEthernet1/0/5
GigabitEthernet1/0/5 is up, line protocol is up (connected)     ! L1 up / L2 up
  Hardware is Gigabit Ethernet, address is 00a3.d1f4.8a05 (bia 00a3.d1f4.8a05)
  MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec,
     reliability 248/255, txload 3/255, rxload 2/255           ! reliability < 255 = errors
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  Half-duplex, 100Mb/s, media type is 10/100/1000BaseTX         ! HALF! fell back via parallel detection
  input flow-control is off, output flow-control is unsupported
  ...
  5 minute input rate 412000 bits/sec, 61 packets/sec
  5 minute output rate 655000 bits/sec, 83 packets/sec
     1843920 packets input, 512339871 bytes, 0 no buffer
     Received 10233 broadcasts (8120 multicasts)
     0 runts, 0 giants, 0 throttles
     312 input errors, 288 CRC, 24 frame, 0 overrun, 0 ignored   ! CRC/frame: frames cut by our own collisions
     0 watchdog, 8120 multicast, 0 pause input
     0 input packets with dribble condition detected
     2210345 packets output, 1903345110 bytes, 0 underruns
     0 output errors, 6721 collisions, 3 interface resets        ! collisions should be 0 on a point-to-point link
     0 unknown protocol drops
     0 babbles, 1984 late collision, 412 deferred                ! LATE COLLISIONS = signature of half side
     0 lost carrier, 0 no carrier, 0 pause output
     0 output buffer failures, 0 output buffers swapped out
```

Other side (full duplex, hard-coded) — same illustrative scenario:

```
R1# show interfaces GigabitEthernet0/0/1
GigabitEthernet0/0/1 is up, line protocol is up
  ...
  Full-duplex, 100Mb/s, media type is RJ45                       ! hard-coded speed 100 / duplex full
  ...
     1520 runts, 0 giants, 0 throttles                            ! RUNTS: fragments of frames the half side aborted
     2897 input errors, 1377 CRC, 0 frame, 0 overrun, 0 ignored   ! CRC/FCS errors
     ...
     0 output errors, 0 collisions, 0 interface resets            ! full-duplex side never counts collisions
     0 babbles, 0 late collision, 0 deferred
```
(Placement of CRC/runts vs late collisions follows Wikipedia Autonegotiation and Cisco TN 10561 — see Q6; note TN 10561 says FCS/alignment errors appear on the **half-duplex** side and runts on the full side, while Wikipedia says FCS errors on the **full** side — see conflict in Q6.)

Sample `show interfaces status` format (from Cisco TN 10561, real output):
```
Port    Name    Status      Vlan     Duplex  Speed  Type
Fa3/1           connected   routed   a-half  a-100  10/100BaseTX     ! "a-" = value autonegotiated
Fa3/2           notconnect  routed   full    100    10/100BaseTX     ! no "a-" = hard-coded
```
— [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)

`show interfaces counters errors` columns (Catalyst): Align-Err, FCS-Err, Xmit-Err, Rcv-Err, UnderSize, OutDiscards; second block Single-Col, Multi-Col, Late-Col, Excess-Col, Carri-Sen, Runts, Giants — counter meanings in [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html); exact column layout `[verify]`.

### Inferences
- Teach counters in 3 buckets: (1) physical/noise (CRC, frame, input errors, giants from bad NIC), (2) duplex/collision (collisions, late collisions, runts, CRC on the other side), (3) congestion/buffers (input/output drops, ignored, no buffer, overrun) — the third bucket is NOT a cable fault.
- "Output drops" ≠ "output errors": drops = queue full (congestion), errors = transmission failed.

### Gaps
- Could not fetch the current Cisco IOS XE "show interfaces" field-description table verbatim (the command-reference page was truncated); definitions above come from TN 12027 and the Internetwork Troubleshooting Guide.
- "lost carrier"/"no carrier" definitions not obtained (typically: carrier lost during transmission / carrier not present — `[verify]`).

---

## Q6. Duplex mismatch, autonegotiation rules, speed mismatch

### Takeaway
If one side autonegotiates and the other is hard-coded, the auto side can detect the speed by parallel detection but cannot detect duplex, so it assumes **half duplex** (at 10/100). Result with "auto vs 100/full": link up, ping works, but poor throughput — late collisions on the half side and CRC/FCS/runts on the full side. A speed mismatch (both hard-coded to different speeds) leaves the link down. Cisco's advice: auto on both sides or hard-code both sides identically.

### Cited Findings
- Parallel detection: the capable device can match the speed but "cannot determine duplex capability, so half duplex is always assumed" — [Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)
- Duplex mismatch: half side reports late collisions, full side reports FCS errors; a simple ping can succeed but throughput drops sharply — [Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)
- Cisco duplex-mismatch symptoms: rapid increase of FCS and alignment errors on the half-duplex side; runts on the full-duplex side; late collisions on the half-duplex side; collisions on a full-duplex interface (should never occur); CDP log `%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered` (reports but does not fix) — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)
- `[conflict]` on which side shows FCS/CRC: Wikipedia → full side; Cisco TN 10561 → FCS/alignment on half side **and** runts on full side. Mechanistically both happen: the half side aborts its own frames when the full side transmits (late collisions + CRC/frame errors on what it receives), and the full side receives truncated aborted frames (runts + CRC). For the exam (OCG convention) the commonly tested pair is "late collisions on the half-duplex side; CRC/runts on the full-duplex side" `[verify against Odom OCG Vol.1 ch. 7]`.
- Duplex mismatch symptoms: very slow performance, intermittent connectivity, loss of connection; "Always set both sides of the connection to auto-negotiate speed/duplex or set the speed/duplex manually on both sides" — [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)
- "If you hard code the speed on a port, it disables all auto-negotiation functionality on the port for speed and duplex"; a port cannot detect duplex of a non-negotiating partner; link can show connected even with duplex mismatch — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)
- Gigabit autoneg (802.3z) disabled on one side only: A disabled/B enabled → A up, B down — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html). Disabling gigabit autoneg "hides link drops or physical layer problems"; don't disable between switches (risk of undetected problems causing STP loops) — [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)
- Cisco recommends leaving autonegotiation on for 802.3u-compliant devices; on some platforms "Duplex will not be set until speed is set to non-auto value" — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)
- History: autoneg was optional in 802.3u (1995, clause 28), based on National Semiconductor NWay; inconsistent early implementations led admins to hard-code; improved 1998; mandatory for 1000BASE-T (1999), where it also decides master/slave — [Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)
- FLP bursts: 17 clock pulses 125 µs apart with optional data pulses encoding a 16-bit link code word — [Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)
- Priority (highest first): 40G, 25G, 10G, 5G, 2.5G, 1000BASE-T FD, 1000BASE-T HD, 100BASE-T2/TX FD…, 100BASE-T4, 10BASE-T FD, 10BASE-T HD — [Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)
- Commands: `speed auto|10|100|1000`, `duplex auto|full|half`; `show interfaces <if> status` ("a-" prefix = autonegotiated); `show interfaces <if>`; `show interfaces <if> capabilities`; `show cdp neighbors` — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)

Background `[verify]` (Odom OCG rules commonly tested):
- When autoneg fails / partner not negotiating, Cisco switch: speed = sensed (parallel detection), else slowest supported (10 Mb/s); duplex = half if speed 10 or 100, full if 1000.
- Speed mismatch (e.g., 100 vs 1000 both hard-coded): link does not come up → `down/down` (notconnect). Speed mismatch cannot "half work" like duplex mismatch does.
- Setting `speed` and `duplex` manually on a Cisco switch port disables autoneg on that port (hence the classic trap: switch hard-coded 100/full + PC auto → PC goes 100/half → mismatch).
- `mdix auto` interface command; Auto-MDIX may require speed/duplex auto on some Catalyst platforms.

### Inferences
- Lesson truth table (exam-friendly):
  | Side A | Side B | Result |
  |---|---|---|
  | auto | auto | best common speed + full duplex |
  | auto | 100/full hard | A: 100 (sensed) / **half** (assumed) → duplex mismatch |
  | auto | 1000/full hard | A: 1000/**full** (gigabit default full) `[verify]` |
  | 100/full | 100/full | OK (no negotiation) |
  | 100 | 1000 hard | link down (speed mismatch) |

### Gaps
- No Cisco primary page fetched stating "duplex defaults to half for 10/100, full for 1000 when autoneg fails" — this is OCG content `[verify]`.

---

## Q7. Interface status states and their causes (show interfaces / show interfaces status / show ip interface brief)

### Takeaway
Status pairs read "Line status (L1) / protocol status (L2)". up/up = working; administratively down/down = `shutdown`; down/down = cable/L1 problem (unplugged, bad cable, far end shut, speed mismatch); up/down = L1 ok but L2 problem (on serial: encapsulation/keepalive mismatch; on Ethernet: rare, e.g., far side issue); err-disabled = shut by the switch due to a detected error.

### Cited Findings ([Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html))
- up, line protocol up (connected): physical and data-link up.
- up, line protocol down (notconnect): interface enabled but far end disabled or absent (per Cisco's switch doc).
- down, line protocol down (notconnect): no cable, faulty cable, or inactive far-end port; gigabit links need matching GBIC types.
- err-disabled: shut down automatically by a detected error; causes listed: EtherChannel misconfiguration (PAgP flap), duplex mismatch, BPDU guard with PortFast, UDLD one-way link; automatic recovery possible with an interval, but "the problem reoccurs until the root cause is determined".
- disabled/shutdown: administratively disabled; inactive: the port's VLAN was deleted.

Background `[verify]`:
- `show ip interface brief` shows "administratively down / down" for a shut interface; `show interfaces status` shows "disabled".
- Other err-disabled causes on Catalyst: port security violation (default mode shutdown), DHCP snooping rate-limit, link-flap, ARP inspection, loopback detected, psecure-violation. Recovery: `shutdown` then `no shutdown`, or `errdisable recovery cause <cause>` + `errdisable recovery interval <sec>`. Diagnose: `show interfaces status err-disabled`, `show errdisable recovery`.
- Router serial up/down: encapsulation mismatch (HDLC vs PPP), missing clock on DCE (`clock rate`), keepalive failure. Cisco IOS also shows "up/down (looped)".
- `show controllers` (router serial) reveals DCE/DTE cable and clock rate; on switches `show controllers ethernet-controller` shows PHY/MDIX info.

### Inferences
- Beginner teaching order: (1) read the two words, (2) left word = Layer 1, right word = Layer 2, (3) "administratively" = you did it, (4) err-disabled = the switch did it to protect you.

### Gaps
- Odom's exact state table (OCG Vol.1 "Interface status codes") not fetched `[verify]`.

---

## Q8. Packet Tracer lab ideas (what PT simulates / does not)

### Takeaway
PT is fine for cable-type, link-light, speed/duplex config and status-reading labs; it is a poor simulator of physical-layer error counters (CRC, runts, late collisions generally stay at 0 or do not behave realistically). All PT behaviour claims below are `[verify]` — not confirmed from Cisco NetAcad docs in this session.

### Cited Findings
- No source fetched on PT fidelity for interface counters (budget). Cisco documents CDP duplex mismatch log message `%CDP-4-DUPLEX_MISMATCH` on real devices — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)

### Inferences (lab designs, all `[verify]` in PT 8.x)
1. **Cable chooser lab**: PC–Switch, Switch–Switch, PC–Router, Router–Router, PC–PC; first connect with the "wrong" copper type and observe link lights (red vs green) — PT models MDI/MDI-X and Auto-MDIX on newer switch models; disable with `no mdix auto` on a 2960 to force classic behaviour [verify PT support].
2. **Console lab**: connect PC RS-232 → router Console with the light-blue Console (rollover) cable, open Terminal at 9600 8N1.
3. **Duplex mismatch lab**: set `speed 100` + `duplex full` on switch port, `duplex half` on the other switch; observe `%CDP-4-DUPLEX_MISMATCH` messages (PT does generate them [verify]); compare `show interfaces` duplex lines and `show interfaces status`. Explain that real counters (late collisions/CRC) are not simulated — show the illustrative output from Q5 instead.
4. **Speed mismatch lab**: hard-code `speed 10` vs `speed 100` → link down/down (PT shows red) [verify].
5. **Fiber lab**: add a fiber module (e.g., 2960 GigabitEthernet SFP slots, or router HWIC/NM with fiber) — use "Fiber" cable; copper-to-fiber port mismatch is impossible to connect.
6. **Status-states lab**: `shutdown` (administratively down), unplug cable (down/down), serial encapsulation mismatch HDLC vs PPP (up/down), port-security violation → err-disabled and recovery.
7. **Hub vs switch lab** (Simulation mode): send pings through a hub and watch PDUs flood all ports and collisions appear (PT animates collisions on hubs) vs a switch.
- GNS3/CML/EVE-NG: IOSv/IOSvL2 virtual NICs also do not produce realistic CRC/late-collision counters `[verify]`; physical error labs really need real hardware.

### Gaps
- No authoritative source for PT fidelity; validate each lab in PT before publishing.

---

## Q9. Wikimedia Commons image candidates

### Takeaway
File names below were found via Commons search results in this session. **Licenses and authors could NOT be read** — Commons was blocked (curl via proxy) and the WebFetch budget was exhausted. Every license/author must be verified on the file page before downloading and adding to `attribution.json`.

### Cited Findings (file pages exist per search results; license/author `[verify]`)
- `File:RJ-45 TIA-568B Left.svg` (also `.png`, and `Right` variants) — T568B pinout diagram — [Commons](https://commons.wikimedia.org/wiki/File:RJ-45_TIA-568B_Left.svg)
- `File:10BASE-T and 100BASE-T Straight-Through Cable Pinout.svg` — [Commons](https://commons.wikimedia.org/wiki/File:10BASE-T_and_100BASE-T_Straight-Through_Cable_Pinout.svg)
- `File:8P8C plug pin diagram.svg` — [Commons](https://commons.wikimedia.org/wiki/File:8P8C_plug_pin_diagram.svg)
- `File:Lc-sc-fiber-connectors.jpg` — LC and SC connectors side by side — [Commons](https://commons.wikimedia.org/wiki/File:Lc-sc-fiber-connectors.jpg)
- `File:LC-optical-fiber-connector-hdr-0a.jpg` — [Commons](https://commons.wikimedia.org/wiki/File:LC-optical-fiber-connector-hdr-0a.jpg)
- `File:100BASE-FX Multimode LC SFP Transceiver IMGP7815 wp.jpg` — SFP module with LC — [Commons](https://commons.wikimedia.org/wiki/File:100BASE-FX_Multimode_LC_SFP_Transceiver_IMGP7815_wp.jpg)
- `File:LR-Link 10GBASE-SR SFP+ transceiver.jpg` — [Commons](https://commons.wikimedia.org/wiki/File:LR-Link_10GBASE-SR_SFP%2B_transceiver.jpg)
- `File:GBIC und SFP.jpg` — GBIC vs SFP size comparison — [Commons](https://commons.wikimedia.org/wiki/File:GBIC_und_SFP.jpg)
- `File:10 Gbit XFP and SFP transceivers.jpg` — [Commons](https://commons.wikimedia.org/wiki/File:10_Gbit_XFP_and_SFP_transceivers.jpg)
- `File:BNC Tee connector for 10BASE2-92164.jpg` — 10BASE2 T-piece (WebFetch returned url_not_found once; re-check) — [Commons](https://commons.wikimedia.org/wiki/File:BNC_Tee_connector_for_10BASE2-92164.jpg)
- `File:10BASE2 terminator.jpg` — [Commons](https://commons.wikimedia.org/wiki/File:10BASE2_terminator.jpg)
- `File:DE-9 to 8P8C console cable pinouts.svg` — console/rollover pinout — [Commons](https://commons.wikimedia.org/wiki/File:DE-9_to_8P8C_console_cable_pinouts.svg)
- `File:Rollover cable.png` — [Commons](https://commons.wikimedia.org/wiki/File:Rollover_cable.png)
- Categories to browse for a Cat6 cable photo: [Category:Modular connector 8P8C](https://commons.wikimedia.org/wiki/Category:Modular_connector_8P8C), [Category:LC connector](https://commons.wikimedia.org/wiki/Category:LC_connector), [Category:Small Form-factor Pluggable](https://commons.wikimedia.org/wiki/Category:Small_Form-factor_Pluggable), [Category:10BASE2](https://commons.wikimedia.org/wiki/Category:10BASE2), [Category:Rollover cable](https://commons.wikimedia.org/wiki/Category:Rollover_cable)

### Inferences
- For pinout/cable diagrams it may be simpler and license-free to draw original SVGs (the app already uses original SVG diagrams with `var(--...)` colours); use Commons photos only for physical objects (LC/SC, SFP, BNC T, rollover cable).

### Gaps
- No license/author for any file; no specific Cat6 cable photo filename found. Download path per CLAUDE.md: `upload.wikimedia.org/wikipedia/commons/thumb/{md5[0]}/{md5[:2]}/{Name}/960px-{Name}` — Commons API/page access was blocked from this environment.

---

## Q10. Common CCNA exam traps for 1.3 / 1.4

### Takeaway
Most traps are about: which cable between which devices, SMF vs MMF characteristics, max 100 m for UTP, duplex mismatch counter signatures, auto vs hard-coded behaviour, and reading interface status pairs.

### Cited Findings
- "Collisions must not be seen on full-duplex interfaces" → collisions on a full-duplex port = duplex mismatch / misconfig — [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)
- Late collisions = > 512 bit times; duplex mismatch or cable too long — [Cisco TN 12027](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)
- Ping can succeed despite duplex mismatch — [Wikipedia: Autonegotiation](https://en.wikipedia.org/wiki/Autonegotiation)
- Hard-coding speed disables autoneg for speed and duplex — [Cisco TN 10561](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html)
- 10GBASE-T needs Cat6A for 100 m (Cat6 only ~55 m) — [Wikipedia: Ethernet over twisted pair](https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair)
- 1000BASE-T uses all 4 pairs (100BASE-TX only 2) — [Wikipedia: Gigabit Ethernet](https://en.wikipedia.org/wiki/Gigabit_Ethernet)

### Inferences (trap list for "Capcane de examen")
1. "100 m" is the copper limit for 10BASE-T through 10GBASE-T (Cat6A) — not 185/500 m (those are coax).
2. 1000BASE-**T** = copper (802.3ab); 1000BASE-**SX/LX** = fiber (802.3z). "T" = twisted pair, "S" = short wavelength (850), "L" = long (1310), "E" = extended (1550). `[verify naming]`
3. MMF is not "worse fiber": it is cheaper optics; SMF has the *smaller* core (9 µm) but the *longer* distance.
4. Multimode uses LED/VCSEL; single-mode uses laser — the exam likes "light source" questions.
5. Router↔PC and switch↔switch need crossover (if no Auto-MDIX); router↔switch is straight-through.
6. Console = rollover, not crossover.
7. Duplex mismatch: link is UP/UP (not down!); performance is bad; late collisions on the half side; CRC/runts on the full side.
8. Speed mismatch: link DOWN.
9. auto vs hard-coded 100/full → auto side becomes 100/**half**.
10. Output drops = congestion, not a cable fault; CRC with no collisions = cabling/noise (Cisco ITG "excessive noise").
11. Runts < 64 bytes; giants > 1518 bytes; minimum Ethernet frame 64 bytes; 802.1Q-tagged frames up to 1522 `[verify]`.
12. administratively down = `shutdown`; err-disabled ≠ administratively down (needs `shutdown`/`no shutdown` or errdisable recovery).
13. Hubs: one collision domain; switches: one collision domain per port; routers break broadcast domains.
14. Full duplex is only possible on point-to-point links (no hub).
15. 10G+ Ethernet = full-duplex only (no CSMA/CD) `[verify]`.
16. SFP = 1G, SFP+ = 10G, QSFP+ = 40G `[verify]`; LC is the connector on SFP/SFP+ — [Wikipedia: Optical fiber connector](https://en.wikipedia.org/wiki/Optical_fiber_connector).

### Gaps
- Exam trap list is synthesized from Cisco docs + standard OCG knowledge; Odom OCG chapters ("Fundamentals of Ethernet LANs", "Analyzing Ethernet LAN Switching" / interface troubleshooting) were not consulted directly.
