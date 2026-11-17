# DECISIONS — decizii stabilite cu utilizatorul (NU se reiau)

Referință, nu se citește la fiecare sesiune. Mutat din vechiul `CLAUDE.md` §1–3, §8.5, fără schimbări de fond.

## Produs
Platformă web **personală** de învățare pentru **Cisco CCNA 200-301 v1.1**, self-hosted pe **Raspberry Pi 4** (doar LAN), folosită egal de pe desktop și telefon. Utilizator: **începător total**, fără dată fixă de examen.

| Subiect | Decizie |
|---|---|
| Curriculum | rădăcină = blueprint oficial **v1.1 verbatim** (6 domenii, 53 obiective, ponderi 20/20/25/10/15/10) + conținut „extra peste CCNA” marcat separat |
| v2.0 | Cisco CCNA v2.0 intră pe **3 feb 2027** (v1.1 până pe 2 feb 2027). Utilizatorul: „folosim v1.1, vom face update ulterior” |
| Limbă | **română**; termenii tehnici/comenzile/titlurile Cisco rămân în **engleză** |
| Explicații | stratificate: **Pe scurt** (2–3 rânduri) → **Explicația detaliată** → **Deep dive** opțional (colapsabil) → **Capcane de examen** → mini-test. Protocoalele/standardele explicate FOARTE detaliat (ex. 802.11a/b/g/n/ac/ax/be: ce problemă a rezolvat fiecare) |
| Acronime | fiecare acronim/protocol = **tooltip** (hover desktop / tap mobil) cu **ce face · cum lucrează · unde se folosește** + pagină Glosar |
| După teorie | exemple de configurare comentate linie cu linie → întrebări → **lab ghidat** → **lab solo** cu soluție ascunsă |
| Laburi | **scenarii Packet Tracer** (utilizatorul are PT și GNS3/EVE-NG/CML). Wireless nu se emulează în GNS3/CML |
| Antrenament | 3 moduri: **Simulare** (doar configurabilă: nr. întrebări, timp, „fără întoarcere”), **Antrenament** (Verifică + „Arată răspunsul”), **Fast track** (click → corect/greșit + explicații → următoarea) |
| Explicații răspunsuri | ÎNTOTDEAUNA pentru **fiecare variantă** (corectă, aleasă greșit, celelalte) |
| Tipuri întrebări | single, multi, drag&drop potrivire, drag&drop ordonare, completare comenzi CLI, subnetting generat |
| Bancă | țintă **~600** întrebări total (~40 per topic major) |
| Repetare | spaced repetition **FSRS** (greșelile revin automat), rulează în client (`ts-fsrs`) |
| Design | profi, clean, **dark implicit + toggle light**, accent **teal**, **glass subtil** doar pe sidebar/topbar/bottom-nav/popover (performanță mobil) |
| Vizual | diagrame **SVG originale** + **animații interactive** + **imagini cu licență liberă** (Wikimedia, cu atribuire) |
| Progres | dashboard pe domeniu/topic, statistici scoruri, streak + obiectiv zilnic (FĂRĂ badges/XP) |
| Unelte extra | calculator+drill subnetting (IPv4/IPv6), flashcards, cheat sheets printabile, notițe + bookmark-uri |
| Arhitectură | aplicație cu **backend**, optimizată pentru RPi4, rulare **doar locală**; progres salvat pe server; fără auth (single-user, LAN) |
| Disponibilitate topic | un topic apare în aplicație doar când e adăugat în `AVAILABLE` (`web/src/data/curriculum.ts`), **doar cu aprobarea explicită a utilizatorului** după revizuire; același lucru pentru înregistrarea în `registry.ts` (vezi WORKFLOW §0.5). Acum: `['1.11']` |

## Stack
- **web/**: Vite 8 + React 19 + TypeScript, React Router 7, CSS propriu (fără Tailwind) în `web/src/styles/app.css`, PWA, fonturi locale Inter + JetBrains Mono, `ts-fsrs`.
- **server/**: Node 22+ + Fastify 5 + better-sqlite3 (WAL). Servește `web/dist` + `/api/*`. Date în `data/ccna.db`.
- **deploy/**: systemd + backup timer 03:17, `Caddyfile` (HTTPS local). Instrucțiuni în `README.md`.
- API: `/api/progress`, `/attempts`, `/activity/ping`, `/stats`, `/exams`, `/srs/cards[/:id]`, `/notes[/:topicId]`, `/bookmarks/:topicId`, `/settings`, `/export`, `/import`.

## Plan v2.0 (mai târziu)
Obiectivele v2.0 complete NU au fost obținute. Schimbări cunoscute: 5 domenii (25/25/20/20/10); + agentic AI, OSPFv3, HSRP/VRRP, DNS records, SFTP/SCP, storm control, RA guard; − QoS, REST/JSON, Terraform. Ideal: etichetă v2.0 pe fiecare topic.

## Ordinea lucrului (direcție generală și motivație)
Ordinea de execuție curentă (priorități, pași concreți) e în `docs/CURRENT_STATE.md` — acolo se actualizează; aici rămâne doar direcția: feedback și revizuire utilizator → aprobare topicuri Domeniul 1 (→ `AVAILABLE`) → restul curriculei (2.0…6.0), topicurile „Configure and verify” cu laburi CLI complete → bancă spre ~600 întrebări → update v2.0. Motiv: nimic nu devine disponibil fără revizuire didactică a utilizatorului.

Standardul educațional, protecțiile (`AVAILABLE`, `registry.ts`) și definițiile de stare sunt în `docs/WORKFLOW.md` §0 și §6 (autoritare). Acest fișier ține decizii și motivații; nu e task tracker.
