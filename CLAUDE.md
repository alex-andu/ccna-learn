# CLAUDE.md — CCNA Learn

Context complet pentru a continua proiectul fără a reciti conversațiile anterioare. Citește acest fișier ÎNAINTE de orice. Răspunde utilizatorului în **română**.

## 1. Ce este

Platformă web **personală** de învățare pentru certificarea **Cisco CCNA 200-301 v1.1**, self-hosted pe **Raspberry Pi 4** (doar local, LAN), folosită egal de pe desktop și telefon. Utilizator: **începător total** în networking, fără dată fixă de examen.

**Stare (nov. 2026):** platforma completă + **topic pilot 1.11 Describe wireless principles** gata. Restul celor 53 de obiective apar „în curând”. Utilizatorul validează pilotul înainte de extindere.

## 2. Decizii stabilite cu utilizatorul (NU le relua)

| Subiect | Decizie |
|---|---|
| Curriculum | rădăcină = blueprint oficial **v1.1 verbatim** (6 domenii, 53 obiective, ponderi 20/20/25/10/15/10) + conținut „extra peste CCNA” marcat separat |
| v2.0 | Cisco CCNA v2.0 intră pe **3 feb 2027** (v1.1 până pe 2 feb 2027). Utilizatorul: „folosim v1.1, vom face update ulterior” |
| Limbă | **română**, termenii tehnici/comenzile/titlurile Cisco rămân în **engleză** |
| Explicații | stratificate: **Pe scurt** (2–3 rânduri) → **Explicația detaliată** → **Deep dive** opțional (colapsabil) → **Capcane de examen** → mini-test. Protocoalele/standardele explicate FOARTE detaliat (ex. 802.11a/b/g/n/ac/ax/be: ce problemă a rezolvat fiecare) |
| Acronime | fiecare acronim/protocol = **tooltip** (hover desktop / tap mobil) cu **ce face · cum lucrează · unde se folosește** + pagină Glosar |
| După teorie | exemple de configurare comentate linie cu linie → întrebări → **lab ghidat** → **lab solo** cu soluție ascunsă |
| Laburi | **scenarii Packet Tracer** (utilizatorul are PT și GNS3/EVE-NG/CML). Wireless nu se emulează în GNS3/CML |
| Antrenament | 3 moduri: **Simulare** (doar configurabilă: nr. întrebări, timp, opțiune „fără întoarcere”), **Antrenament** (Verifică + buton „Arată răspunsul”), **Fast track** (click → corect/greșit + explicații → următoarea) |
| Explicații răspunsuri | ÎNTOTDEAUNA pentru **fiecare variantă** (corectă, aleasă greșit, celelalte) |
| Tipuri întrebări | single, multi, drag&drop potrivire, drag&drop ordonare, completare comenzi CLI, subnetting generat |
| Bancă | țintă **~600** întrebări total (acum 40, toate 1.11) |
| Repetare | spaced repetition **FSRS** (greșelile revin automat) |
| Design | profi, clean, **dark implicit + toggle light**, accent **teal**, **glass subtil** doar pe sidebar/topbar/bottom-nav/popover (performanță mobil) |
| Vizual | diagrame **SVG originale** + **animații interactive** + **imagini cu licență liberă** (Wikimedia, cu atribuire) |
| Progres | dashboard pe domeniu/topic, statistici scoruri, streak + obiectiv zilnic (FĂRĂ badges/XP) |
| Unelte extra | calculator+drill subnetting (IPv4/IPv6), flashcards, cheat sheets printabile, notițe + bookmark-uri |
| Arhitectură | aplicație cu **backend**, optimizată pentru **RPi4**, rulare **doar locală**; progres salvat pe server |
| Stack | la alegerea mea → vezi §3 |

## 3. Stack și structură

- **web/**: Vite 8 + React 19 + TypeScript, React Router 7, CSS propriu (fără Tailwind) în `web/src/styles/app.css` (tokens `--accent`, `--surface`… pentru dark/light), PWA (vite-plugin-pwa), fonturi locale Inter + JetBrains Mono, `ts-fsrs` (FSRS rulează în client).
- **server/**: Node 22+ + Fastify 5 + better-sqlite3 (WAL). Servește `web/dist` + API `/api/*`. Date în `data/ccna.db`. Fără auth (single-user, LAN).
- **deploy/**: systemd (`ccna-learn.service`, backup `*.timer` 03:17), `Caddyfile` (HTTPS local `tls internal` pentru PWA). Instrucțiuni în `README.md`.

```
web/src/
  data/curriculum.ts        # arbore v1.1 (generat din research_notes/.../user_provided_v11_official.md) + AVAILABLE
  data/glossary.ts          # GlossaryEntry {id, abbr, full, ro, what, how, where, std, layer, topics}
  data/questions/t1_11.ts   # întrebări 1.11; index.ts le agregă
  data/flashcards.ts        # fapte + termeni din glosar
  content/registry.ts       # TOPIC_SECTIONS (TOC + calcul progres)
  content/t1_11/            # Theory.tsx, Config.tsx, Labs.tsx, CheatSheet.tsx
  components/               # Term (tooltip), Rich ([[id]] **b** `code`), Lesson (Summary/Detailed/DeepDive/Traps/Callout/Analogy/Figure/Photo/Reveal/Table), CodeBlock, QuestionCard, InlineQuiz, TopicQuestions, SectionHead, NotesPanel
  diagrams/rf.tsx, wlan.tsx # SVG interactive (culori DOAR prin var(--...))
  pages/                    # Dashboard, Curriculum, TopicPage, Training, Review, Flashcards, Glossary, Subnetting, CheatSheets, Notes, Settings
  lib/                      # api.ts, store.tsx (context), srs.ts, grade.ts, subnet.ts, types.ts
server/src/index.ts, db.ts, backup.ts
public/img/wiki/attribution.json  # atribuiri foto (afișate automat în Photo + Setări)
```

API: `/api/progress`, `/api/attempts`, `/api/activity/ping`, `/api/stats`, `/api/exams`, `/api/srs/cards[/:id]`, `/api/notes[/:topicId]`, `/api/bookmarks/:topicId`, `/api/settings`, `/api/export`, `/api/import`.

## 4. Cum adaugi un topic nou (rețeta)

1. `data/curriculum.ts` → adaugă ID în `AVAILABLE`.
2. `content/<tX_Y>/Theory.tsx` etc. — o `<section id=… className="section">` per sub-topic, cu `<SectionHead id code title/>`, apoi `Summary` → `Detailed` → `DeepDive` → `Traps` → `<InlineQuiz ids=[…]/>`. Folosește `<Term id="…"/>` pentru orice acronim. Ordinea de predare poate diferi de a/b/c (explică de ce în Callout), codurile oficiale se păstrează.
3. `content/registry.ts` → secțiunile topicului; `pages/TopicPage.tsx` → montează componentele (acum hard-codat pentru 1.11 — la al doilea topic, generalizează cu un map topicId → componentă).
4. `data/questions/<topic>.ts` — fiecare opțiune cu `why`; `explanation` general; `sub`, `difficulty` 1–3; CLI cu `answers` acceptate + `wrong[]` cu explicații; match cu `distractors` explicați. Adaugă în `questions/index.ts`.
5. `data/glossary.ts` — termeni noi (verifică să nu existe deja id-ul).
6. `data/flashcards.ts` — fapte cheie; `content/<topic>/CheatSheet.tsx` + map în `pages/CheatSheets.tsx`.
7. Laburi: topologie SVG, tabel adresare, pași cu `<Step>`, `Reveal` pentru întrebări/indicii, soluție completă ascunsă; precizează limitele PT.

## 5. Stil conținut

- Ton: clar, didactic, pentru începător; analogii (`<Analogy>`) pentru concepte abstracte; tabele pentru comparații; „Capcane de examen” concrete.
- Precizie tehnică: cifre verificate; dacă ceva nu e sigur, marchează sau omite. Reguli regionale: UE/România (ANCOM/ETSI) vs SUA (FCC), dar răspunsul de examen = varianta Cisco (ex. 1/6/11).
- Comenzi: sintaxă din ghidurile Cisco, explicată linie cu linie în `CodeBlock explain`; nu au fost testate pe echipamente reale — avertizează utilizatorul.
- Fiecare topic: ~40 întrebări (ca 1.11) amestec de tipuri, explicație pe fiecare variantă.
- Imagini: Wikimedia Commons, stocate local în `public/img/wiki/`, intrare în `attribution.json`. Download prin `upload.wikimedia.org/wikipedia/commons/thumb/{md5[0]}/{md5[:2]}/{Name}/960px-{Name}` (API-ul commons dă rate-limit). Iconițele Cisco doar nemodificate.

## 6. Comenzi

```bash
npm install                      # la rădăcină (workspaces web + server)
npm run dev                      # vite :5173 + server :8080
npm run build && npm start       # producție pe :8080
cd web && npx tsc -b --noEmit    # typecheck
```
Verificare vizuală: Playwright (preinstalat în mediul cloud) — screenshot desktop 1440×900 + iPhone 13, verifică `pageerror` și overflow orizontal pe mobil.

## 7. Capcane tehnice deja rezolvate

- Variantele de răspuns sunt `div role=radio/checkbox`, NU `button` (conțin `<Term>` care e button → nested buttons).
- `Session` în Training are `key` stabil (altfel se remontează la orice re-render al store-ului și pierde rezultatele).
- `@fastify/static` cu wildcard implicit (cu `wildcard:false` fișierele noi după rebuild nu se servesc).
- Popover-ul glosarului devine bottom-sheet pe ecrane ≤640px.
- SVG: folosește `var(--text)`, `var(--accent)` etc. ca să meargă în ambele teme.

## 8. Ce urmează (în ordine)

1. **Feedback pe pilotul 1.11** de la utilizator → ajustări stil/design/nivel de detaliu.
2. Generalizează `TopicPage` (map topicId → componente de conținut).
3. Extinde conținutul în ordinea curriculei, începând cu Domeniul 1.0 (1.1 → 1.13), apoi 2.0…6.0. Topicuri de tip „Configure and verify” primesc laburi CLI complete (PT + GNS3/CML).
4. Crește banca de întrebări spre ~600 (≈40 per topic major).
5. Update la **CCNA v2.0** (după feb. 2027 sau la cererea utilizatorului): obiectivele v2.0 complete NU au fost obținute încă; schimbări cunoscute: 5 domenii (25/25/20/20/10), + agentic AI, OSPFv3, HSRP/VRRP, DNS records, SFTP/SCP, storm control, RA guard; − QoS, REST/JSON, Terraform. Ideal: etichetă v2.0 pe fiecare topic.

## 9. Resurse în repo

- `reports/Curricula CCNA și resurse oficiale.md` — raportul de cercetare (blueprint, adâncime pe domenii, comenzi IOS, capcane, learning science, stack RPi4).
- `research_notes/Curricula CCNA și resurse oficiale/` — notițe detaliate; `user_provided_v11_official.md` = textul oficial v1.1 (autoritar); `topic_depth_commands.md` = tabele de referință + comenzi per domeniu (utile la scrierea topicurilor noi; valorile marcate [verify] trebuie verificate).

## 10. Git

Branch principal: `main` (conține tot codul). Lucrul nou se face pe un branch de lucru și se integrează în `main`. Commit-uri mici, mesaje în engleză.
