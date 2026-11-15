# CURRENT STATE — întreținut manual

Actualizat: 2026-11-15 · commit `79a7918` · branch `claude/beautiful-dirac-hf431v`.
**Regulă:** existența unui fișier NU înseamnă conținut complet, validat sau revizuit. Nu deduce starea din număr de fișiere, număr de întrebări sau mesaje de commit. Coloanele sunt independente; `?` = neevaluat; nicio stare nu se „promovează” fără dovezi. Definițiile oficiale și checklistul „Complet tehnic” sunt în `docs/WORKFLOW.md` §6.

## Legendă (aceleași 5 stări ca în WORKFLOW §6)
- **Fișiere existente**: ce e în repo (T=Theory, C=Config, L=Labs, S=CheatSheet, i=index.tsx, Q=întrebări, G=termeni, F=facts, D=diagrame). Nu spune nimic despre corectitudine sau completitudine.
- **Complet tehnic**: toți pașii de validare tehnică aplicabili au fost efectiv rulați și au trecut (checklist WORKFLOW §6). Poate fi declarat de agent, cu dovezi. `check-content neefectuat` ⇒ nu se acordă.
- **Review didactic**: revizuire umană sau confirmare explicită a utilizatorului. Nu poate fi declarat de agent.
- **Înregistrat**: importat în `web/src/content/registry.ts` (`TOPICS`; acum doar `T1_11`). Neînregistrat → nu se randează, indiferent de `AVAILABLE`. Se modifică doar cu aprobarea explicită a utilizatorului.
- **Disponibil**: în `AVAILABLE` (`web/src/data/curriculum.ts`) — apare în aplicație. **Acum: `['1.11']`; nu se schimbă fără aprobare explicită.**
- „Evidențe” = ce verificări s-au văzut efectiv (informativ; nu înlocuiește „Complet tehnic”).

## Verificări la nivel de repo
- `npm ci` și `npm run build` (`tsc -b && vite build` pentru web): rulate cu succes de utilizator pe commit `79a7918`, fără erori; data rulării nu a fost înregistrată. Nu acoperă runtime, vizual, conținut.
- `node scripts/check-content.mjs` (rulat **2026-11-15**, pe commit `79a7918` + working tree doar cu modificări de documentație; printr-o copie cu `root` fixat, scriptul eșuează nativ pe Windows): 387 termeni de glosar, 297 întrebări (1.1:42, 1.2:43, 1.3:43, 1.4:43, 1.5:43, 1.6:43, 1.11:40). **Eșuează**: termeni lipsă (`ipv6`, `gua`, `ula`, `link-local`, `multicast`, `cam`, `frame`, `mac-table`, `aging`, `unknown-unicast`, `fcs`, `store-and-forward`, `cut-through`, `pe-router`) și `InlineQuiz` care referă întrebări inexistente din 1.7 și 1.10 (nu există `questions/t1_7.ts`, `t1_10.ts`).
- Verificare vizuală: **neefectuată** (stare la 2026-11-15, commit `79a7918`); Playwright nu e instalat în mediul curent.

## Domeniul 1 — Network Fundamentals

| Topic | Fișiere existente | Complet tehnic | Evidențe (informativ) | Review didactic | Înregistrat | Disponibil |
|---|---|---|---|---|---|---|
| 1.1 | T C L S i Q G F D | ? (commit `ad9ae09` zice „complete”; neconfirmat) | build ✔; check-content: termeni lipsă | nu | nu | nu |
| 1.2 | T C L S i Q G F D | ? (idem) | build ✔; check-content: `pe-router` | nu | nu | nu |
| 1.3 | T C L S i Q G F D | ? (idem) | build ✔ | nu | nu | nu |
| 1.4 | T C L S i Q G F D | ? (idem) | build ✔; check-content: `fcs` | nu | nu | nu |
| 1.5 | T C L S i Q G F D | ? (idem) | build ✔; check-content: `fcs`, `frame`, `ipv6` | nu | nu | nu |
| 1.6 | T C L S i Q G F D | ? (commit zice „partial”; neevaluat) | build ✔; check-content: `ipv6`, `multicast` | nu | nu | nu |
| 1.7 | T C G D (fără L, S, i, Q, F) | nu | build ✔; `InlineQuiz` fără întrebări | nu | nu | nu |
| 1.8 | D | nu | — | nu | nu | nu |
| 1.9 | D | nu | — | nu | nu | nu |
| 1.10 | T C L G D (fără S, i, Q, F) | nu | build ✔; `InlineQuiz` fără întrebări | nu | nu | nu |
| **1.11** | T C L S i Q G F D (pilot, `rf.tsx` + `wlan.tsx`) | ? (pilot; checklist-ul WORKFLOW §6 nu a fost parcurs formal) | build ✔ | **da** (utilizatorul: „exact ce-mi doresc”) | da | **da** |
| 1.12 | G D (fără T, C, L, S, i, Q, F) | nu | — | nu | nu | nu |
| 1.13 | D (fără restul) | nu | — | nu | nu | nu |

Observații: coloana „Evidențe” se referă la verificările de mai sus (commit `79a7918`, 2026-11-15; pentru build data nu e înregistrată) — la orice nouă verificare se actualizează data și commit-ul. „build ✔” pentru topicurile neînregistrate înseamnă doar că fișierele trec `tsc -b`, nu că sunt randate. 1.12 și 1.13: există notițe de cercetare, nu și lecții. Pentru 1.1–1.6, „?” rămâne până la parcurgerea checklistului WORKFLOW §6, inclusiv rularea efectivă a `check-content`.

## Domeniile 2.0–6.0
Fără conținut. Apar „în curând” în `curriculum.ts`.

## Următorii pași curenți (sursa pentru starea execuției; motivațiile sunt în `docs/DECISIONS.md`; decide utilizatorul)
1. Rezolvarea erorilor `check-content` (termeni de la 1.8/1.9/1.12/1.13 neînscriși, `questions` 1.7/1.10) — odată cu scrierea acelor topicuri.
2. Revizuirea topicurilor 1.1–1.6 de către utilizator → la aprobarea lui, înregistrare în `registry.ts` și, separat, `AVAILABLE`.
3. Completarea 1.7, 1.10, apoi 1.8, 1.9, 1.12, 1.13 conform `docs/WORKFLOW.md`.
4. Domeniile 2.0–6.0. Ulterior update v2.0 (vezi `docs/DECISIONS.md`).

## Pointeri
Procedură: `docs/WORKFLOW.md` · Decizii: `docs/DECISIONS.md` · Cercetare: `research_notes/INDEX.md`.
