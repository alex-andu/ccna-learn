# Brief pentru scrierea unui topic din Domeniul 1.0 (app CCNA Learn)

Pilotul **1.11** (`web/src/content/t1_11/`, `web/src/data/questions/t1_11.ts`) a fost validat de utilizator ca „exact ce-mi doresc”.
Topicul tău trebuie să fie la **același nivel de detaliu, ton și structură**. Citește ÎNTÂI:
- `/home/user/ccna-learn/CLAUDE.md` (decizii, stil, rețeta §4, capcane §7)
- integral `web/src/content/t1_11/Theory.tsx`, `Config.tsx`, `Labs.tsx`, `CheatSheet.tsx`, `index.tsx`
- `web/src/data/questions/t1_11.ts` (măcar 150 de linii + câte un exemplu din fiecare tip: match, order, cli, multi)
- `web/src/components/Lesson.tsx`, `CodeBlock.tsx`, `InlineQuiz.tsx`, `LabStep.tsx`, `Rich.tsx`, `Term.tsx`
- `web/src/diagrams/wlan.tsx` (icoane reutilizabile: RouterIcon, SwitchIcon, ClientIcon, APIcon… — importă-le, nu le duplica)
- `web/src/content/types.ts` (TopicModule)
- notițele de cercetare relevante din acest folder

## Limbă și ton
Română, pentru **începător total**. Termenii tehnici, comenzile, titlurile Cisco rămân în engleză. Fraze complete, didactice, analogii (`<Analogy>`), tabele pentru comparații, istoric „ce problemă a rezolvat” fiecare tehnologie/standard. Diacritice corecte (ă â î ș ț).
Precizie: folosește doar cifre din notițe sau pe care le știi sigur; ce e marcat [verify] și nu poți confirma → omite sau formulează prudent. Output-urile CLI sunt **exemple ilustrative** (spune asta într-un Callout la Config).

## Structura obligatorie per sub-topic
`<section id="…" className="section">` + `<SectionHead id code title/>` → `<Summary>` (2–3 rânduri) → `<Detailed>` (unul sau mai multe, cu h3/h4) → `<DeepDive>` opțional → `<Traps items=[…]/>` → `<InlineQuiz ids={[…]}/>` (2–4 întrebări din banca ta).
Prima secțiune = introducere „imaginea de ansamblu” cu tabel cod Cisco → temă, și Callout dacă predai în altă ordine decât a/b/c.
Apoi secțiunea `config` (Exemple de configurare și verificare, `CodeBlock` cu `explain` linie cu linie), apoi TopicPage adaugă automat banca de întrebări, apoi laburile tale (`lab-guided`, `lab-solo`).
Topicuri „Configure and verify” (1.6, 1.8) primesc laburi CLI complete (PT + notă GNS3/CML). Topicuri „Describe/Explain/Compare” primesc tot laburi PT (ghidat + solo), adaptate (ex. simulation mode, observat tabele, comenzi show).
Lab: obiectiv, timp, topologie SVG, tabel adresare, pași `<Step n title labKey>`, `<Reveal>` pentru întrebări/indicii, soluție completă ascunsă în `Reveal`, limitele PT într-un Callout.

## Glosar
Fiecare acronim/protocol = `<G id="…"/>` (import `{ Term as G }`). În întrebări: `[[id]]` sau `[[id|text]]`.
- Verifică ID-urile existente: `grep -oP "\bid: '\K[^']+(?=',\s*abbr:)" web/src/data/glossary.ts web/src/data/terms/*.ts`
- Termeni noi → fișierul TĂU `web/src/data/terms/<tX_Y>.ts`: `import type { GlossaryEntry } from '../../lib/types'; export const TERMS: GlossaryEntry[] = [...]` cu what/how/where complete (ca în glossary.ts), `topics` cu topicul tău primul.
- Alte topicuri se scriu în paralel; folosește ID-urile canonice de mai jos ca să se lege corect. Dacă un termen canonic aparține altui topic, **referă-l doar** (nu-l defini), chiar dacă încă nu există. Definește-i pe ai tăi.

ID-uri canonice (proprietar între paranteze):
`osi` `tcpip-model` `encapsulation` `pdu` `tcp` `udp` `port` `socket` `three-way-handshake` `windowing` `mss` `quic` (1.5) ·
`router` `l2-switch` `l3-switch` `multilayer-switch` `firewall` `ngfw` `ips` `ids` `catalyst-center` `endpoint` `server` `pse` `pd` `cdp` `lldp` `routing-table` `cef` `tcam` `stateful` (1.1) ·
`two-tier` `three-tier` `collapsed-core` `spine-leaf` `access-layer` `distribution-layer` `core-layer` `ecmp` `oversubscription` `wan` `mpls` `metro-ethernet` `soho` `iaas` `paas` `saas` `cloud` `on-premises` `east-west` `north-south` (1.2) ·
`ethernet` `utp` `stp-cable` `smf` `mmf` `fiber` `sfp` `rj45` `t568b` `crossover` `straight-through` `rollover` `auto-mdix` `hub` `collision-domain` `broadcast-domain` `full-duplex` `autonegotiation` `vcsel` (1.3) ·
`crc` `runt` `giant` `late-collision` `duplex-mismatch` `err-disabled` `input-errors` (1.4) ·
`ipv4` `subnet-mask` `cidr` `prefix-length` `vlsm` `flsm` `network-address` `broadcast-address` `default-gateway` `apipa` `loopback` `classful` (1.6) ·
`rfc1918` `nat` `pat` `cgnat` `public-ip` (1.7) ·
`ipv6` `gua` `ula` `link-local` `anycast` `multicast` `eui64` `slaac` `dhcpv6` `ndp` `solicited-node` `dad` `ra` (1.8/1.9 — un singur fișier `t1_8_9`? NU: 1.8 deține ipv6 gua slaac dhcpv6 ndp ra dad; 1.9 deține ula link-local anycast multicast eui64 solicited-node) ·
`ipconfig` `arp` `dns` `ping` `traceroute` `icmp` (1.10) ·
`hypervisor` `vm` `container` `docker` `kubernetes` `vrf` `vswitch` `vnic` `nfv` (1.12) ·
`mac-table` `cam` `flooding` `unknown-unicast` `aging` `oui` `frame` `fcs` `store-and-forward` `cut-through` (1.13).
Deja existente în glossary.ts (doar referă): `mac` `vlan` `poe` `ap` `wlc` `dhcp` `cli` `gui` `ieee` `csma-cd` `half-duplex` `capwap` `radius` `dot1x` `eap` `aes`.

## Fișierele TALE (nu edita nimic altceva — alte topicuri se scriu simultan)
- `web/src/content/<tX_Y>/Theory.tsx`, `Config.tsx`, `Labs.tsx`, `CheatSheet.tsx`, `index.tsx` (exportă `export const T<X>_<Y>: TopicModule`, ex. `T1_6`)
- `web/src/diagrams/<tX_Y>.tsx` — diagrame SVG originale, **interactive unde ajută** (ex. calculator vizual, animație pas cu pas cu butoane, toggle). Culori DOAR prin `var(--text)`, `var(--accent)`, `var(--muted)`, `var(--surface-3)`, `var(--text-2)`, `var(--info)`, `var(--warn)`, `var(--bad)`, `var(--ok)`, `var(--violet)`, `var(--accent-soft)`, `var(--border)`, `var(--code-bg)` (fără `--danger`). SVG-uri cu `viewBox` și `width="100%"` ca să meargă pe mobil.
- `web/src/data/questions/<tX_Y>.ts` — `export const Q_<X>_<Y>: Question[]`, **~40 întrebări**, id-uri `<topic>-001`…, amestec: single (majoritar), multi, match (cu `distractors` explicați), order, cli (cu `answers` acceptate, `canonical`, `wrong[]` explicat, `hint`). **Fiecare opțiune cu `why`** (corecte și greșite), `explanation` general, `sub`, `difficulty` 1–3.
- `web/src/data/terms/<tX_Y>.ts` — termeni noi
- `web/src/data/facts/<tX_Y>.ts` — `import type { Fact } from '../flashcards'; export const FACTS: Fact[]` (~15–25, id `f-<topic>-01`, `topicId`)
- imagini: `web/public/img/wiki/<nume>.jpg` + `web/public/img/wiki/attribution.<tX_Y>.json` (același format ca attribution.json). Download doar prin `https://upload.wikimedia.org/wikipedia/commons/thumb/{md5[0]}/{md5[:2]}/{Name}/960px-{Name}` (md5 al numelui cu `_` în loc de spații). Folosește-le DOAR dacă ai licența și autorul confirmate (pagina File: sau notițele). Dacă nu poți confirma, nu pune foto — diagramele SVG originale sunt suficiente. Max ~4 foto, < 200 KB fiecare (redimensionează cu python PIL dacă e disponibil).

NU edita: registry.ts, curriculum.ts, questions/index.ts, glossary.ts, flashcards.ts, TopicPage, componente comune, app.css. Coordonatorul le leagă la final. Dacă ai nevoie de o clasă CSS nouă, folosește `style={{…}}` inline cu variabile CSS.

## Verificare înainte să termini
1. `cd /home/user/ccna-learn/web && npx tsc -b --noEmit` — fără erori în fișierele tale (erorile din fișierele altor topicuri în lucru ignoră-le, dar raportează-le).
2. `cd /home/user/ccna-learn && node scripts/check-content.mjs` — nicio eroare legată de topicul tău, cu excepția termenilor canonici ai altor topicuri încă nescriși.
3. Nu face commit (coordonatorul face). Raportează: fișiere create, nr. întrebări pe tipuri, termeni definiți, termeni canonici referiți dar nedefiniți de tine, foto adăugate, orice incertitudine tehnică.
