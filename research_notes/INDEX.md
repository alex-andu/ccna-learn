# Research index

Index de navigare al arhivei de cercetare (poziție 5 în ierarhia din `docs/WORKFLOW.md` §0.1); folosire **selectivă**: doar secțiunea topicului curent. Nu citi fișierele integral (≈100k tokeni în total). Caută topicul mai jos, apoi `Read` cu `offset`/`limit` pe intervalul indicat. Numerele sunt linii (valabile la 2026-11-15; dacă un fișier se editează, reverifică cu `grep -n '^## ' <fișier>`). Fiecare secțiune are structura: `### Takeaway` → `### Cited Findings` → `### Inferences` (conținut de predat) → `### Gaps`. Marcajele `[verify]` = neconfirmat, `[std]` = standard, `[illustrative]` = exemplu construit.

## Domeniul 1 — `Domeniul 1 Network Fundamentals/`

| Topic | Fișier | Secțiune (linii de start) |
|---|---|---|
| 1.1 Network components (a–h) | `t1_1_t1_2_components_topologies.md` (484 l.) | Q0 oficial/adâncime 11 · Q1 routers 31 · Q2 switches L2/L3 79 · Q3 NGFW/IPS 135 · Q4 AP + WLC/Catalyst Center 175 · Q5 endpoints/servers 213 · Q6 PoE 237 |
| 1.2 Topology architectures (a–f) | `t1_1_t1_2_components_topologies.md` | Q7 two-tier/three-tier/spine-leaf 316 · Q8 WAN/SOHO/on-prem/cloud 367 |
| 1.1 + 1.2 laburi PT / imagini | `t1_1_t1_2_components_topologies.md` | Q9 labs 430 · Q10 Wikimedia 455 · v2.0 note 483 |
| 1.3 Cabling | `t1_3_t1_4_cabling_interface_issues.md` (432 l.) | Q1 Ethernet standards 12 · Q2 copper/pinouts/MDI 83 · Q3 fiber 115 · Q4 shared media, CSMA/CD, duplex 150 |
| 1.4 Interface issues | `t1_3_t1_4_cabling_interface_issues.md` | Q5 contoare (runts, CRC…) 182 · Q6 duplex/speed mismatch 282 · Q7 stări interfață 322 |
| 1.3 + 1.4 laburi / imagini / capcane | `t1_3_t1_4_cabling_interface_issues.md` | Q8 labs 348 · Q9 Wikimedia 371 · Q10 exam traps 400 |
| 1.5 TCP vs UDP | `t1_5_t1_12_t1_13_tcp_udp_virt_switching.md` (343 l.) | 1.5: 9–125 |
| 1.12 Virtualization | `t1_5_t1_12_t1_13_tcp_udp_virt_switching.md` | 1.12: 126–225 |
| 1.13 Switching concepts | `t1_5_t1_12_t1_13_tcp_udp_virt_switching.md` | 1.13: 226–343 |
| 1.6 IPv4 addressing/subnetting | `t1_6_t1_7_t1_10_ipv4_private_clientos.md` (572 l.) | Q1 binar/header/CIDR 9 · Q2 măști, VLSM, tehnici 71 · Q3 adrese speciale 184 · Q4 config IOS + erori 218 |
| 1.7 Private IPv4 / NAT | `t1_6_t1_7_t1_10_ipv4_private_clientos.md` | Q5 RFC 1918, NAT/PAT, CGNAT 337 |
| 1.10 Client OS IP parameters | `t1_6_t1_7_t1_10_ipv4_private_clientos.md` | Q6 Windows/macOS/Linux 377 |
| 1.6/1.7/1.10 capcane, labs, imagini | `t1_6_t1_7_t1_10_ipv4_private_clientos.md` | Q7 520 |
| 1.8 IPv6 addressing (config) | `t1_8_t1_9_ipv6.md` (369 l.) | Q1 de ce IPv6 11 · Q2 header 35 · Q3 notație/abreviere 68 · Q4 alocare/subnetting 111 · Q7 config IOS 232 |
| 1.9 IPv6 address types | `t1_8_t1_9_ipv6.md` | Q5 tipuri (GUA/ULA/LLA/multicast/anycast) 138 · Q6 EUI-64, SLAAC/DHCPv6, NDP/DAD 177 |
| 1.8/1.9 capcane, labs, imagini | `t1_8_t1_9_ipv6.md` | Q8 335 |
| Scrierea unui topic (format, fișiere) | `_WRITER_BRIEF.md` (57 l.) | **referință istorică, înlocuită de `docs/WORKFLOW.md`** (WORKFLOW.md are prioritate la conflict); nu se citește integral; doar secțiunea cu ID-uri canonice de glosar, găsită după conținut (`grep -n 'ID-uri canonice'`), nu după numere de rând |

Notă de nume: fișierele combinate au nume de forma `t<a>_<b>…`, dar conțin și alte topicuri (ex. `t1_5_t1_12_t1_13…` acoperă 1.5, 1.12, 1.13; `t1_6_t1_7_t1_10…` acoperă 1.6, 1.7, 1.10).

## Curriculă / platformă — `Curricula CCNA și resurse oficiale/`

| Nevoie | Fișier | Secțiune (linii) |
|---|---|---|
| Lista oficială v1.1, textul autoritar al obiectivelor (a/b/c) | `user_provided_v11_official.md` (143 l., 6 KB — se poate citi integral) | 1.0: 5 · 2.0: 56 · 3.0: 81 · 4.0: 110 · 5.0: 121 · 6.0: 133 |
| Blueprint, v1.1 vs v2.0, logistică examen, cursuri | `official_blueprint.md` (232 l.) | v1.1/v2.0 5 · listă verbatim 29 · v1.0→v1.1 174 · logistică 195 · cursuri 213 |
| Adâncime pe domenii, comenzi IOS, capcane, „beyond CCNA” | `topic_depth_commands.md` (691 l.) | 0 scope 7 · D1 26 (capcane 104) · D2 114 (233) · D3 247 (350) · D4 363 (487) · D5 501 (586) · D6 599 (658) · extensii CCNP 668 |
| Learning science, FSRS, design întrebări, simulare examen, PT/GNS3/CML, licențe imagini | `learning_design_labs.md` (307 l.) | 1 retrieval/layering 7 · 2 FSRS 67 · 3 item writing/MCQ/CLI/subnetting 120 · 4 examenul real 175 · 5 Packet Tracer/labs 209 · 6 licențe Cisco/Wikimedia 273 |
| Stack RPi4, deploy, PWA, glass | `tech_stack_rpi4.md` (209 l.) | Q1 backend/DB 5 · Q2 frontend 48 · Q3 content pipeline 87 · Q4 deploy 112 · Q5 glassmorphism 148 · Q6 versiuni 171 |

## `reports/` (sinteze; nu pentru scriere)
- `Domeniul 1 Network Fundamentals.md` (87 KB) — sinteza celor 5 fișiere de mai sus.
- `Curricula CCNA și resurse oficiale.md` (42 KB) — sinteza fișierelor de curriculă/platformă.
Citește-le doar dacă utilizatorul cere explicit raportul sau pentru context de ansamblu.

## Domeniile 2.0–6.0
Nu există încă notițe dedicate per topic. Pornește de la `topic_depth_commands.md` (D2: linia 114, D3: 247, D4: 363, D5: 501, D6: 599) și `user_provided_v11_official.md`; cercetare nouă → un fișier separat per grup de topicuri, cu secțiuni `Q<n>` și adăugat aici.
