# WORKFLOW — scrierea/revizuirea unui topic (sursa unică, autoritară)

Acesta e documentul operațional autoritativ pentru **crearea și validarea conținutului**. Se lucrează **secvențial, un topic pe rând, fără subagenți** decât dacă utilizatorul cere altfel.

## 0. Precedență, context, standard educațional, protecții (obligatoriu)

### 0.1 Ierarhia documentelor
1. `CLAUDE.md` — punct de intrare scurt, reguli ne-negociabile, ierarhie, ce citești.
2. `docs/WORKFLOW.md` (acest fișier) — instrucțiuni operaționale autoritative.
3. `docs/CURRENT_STATE.md` — instantaneu factual al progresului și **pașii următori curenți** (singurul loc pentru starea execuției).
4. `docs/DECISIONS.md` — decizii arhitecturale și de proiect, cu motivație (nu e task tracker).
5. `research_notes/INDEX.md` — navigarea arhivei de cercetare.
6. `research_notes/Domeniul 1 Network Fundamentals/_WRITER_BRIEF.md` — referință istorică, **înlocuită de acest fișier**. Dacă îl contrazice pe WORKFLOW.md, WORKFLOW.md are prioritate. Nu-l citi integral; la nevoie citește doar secțiunea cu lista canonică de ID-uri de glosar, identificată după conținut (`grep -n 'ID-uri canonice' <brief>`; titlul „ID-uri canonice (proprietar între paranteze)”), nu după numere de rând.

### 0.2 Eficiența contextului (se aplică procesului, NU materialului educațional)
- Citește întâi `CLAUDE.md`, apoi `docs/CURRENT_STATE.md`; citește acest fișier o dată la începutul sarcinii (sau când ai nevoie de o regulă).
- Citește doar fișierele topicului, semnăturile componentelor/tipurilor necesare și **secțiunea topicului** din cercetare (`Read` cu `offset`/`limit`, ghidat de `research_notes/INDEX.md`). Nu încărca arhiva de cercetare sau `reports/` integral și nu reciti brief-uri istorice implicit.
- Nu porni subagenți/lucru paralel care reîncarcă același context mare sau rescriu același material.
- Validează incremental (§5): verificări țintite în timpul lucrului, build complet la jaloane. Nu repeta verificări costisitoare fără o schimbare care le justifică.
- Nu există ținte arbitrare de tokeni și nu se pretind economii nemăsurate. **Nu scurta explicații, exemple, diagrame, quiz-uri sau detalii tehnice ca să economisești context.**

### 0.3 Standardul educațional (nu se negociază)
Fiecare topic atinge **cel puțin** adâncimea, tonul, structura și calitatea pilotului **1.11** (referință de calitate, nu text de copiat mecanic). Public: începător total — nu presupune cunoștințe de networking neintroduse deja. Explicațiile acoperă, unde e relevant:
- ce este tehnologia/protocolul/mecanismul/conceptul; **de ce există** și ce problemă rezolvă;
- **cum funcționează intern, pas cu pas**; când și unde se folosește; relația cu alte concepte;
- comportamentul pachetelor/cadrelor: antete, câmpuri, tabele, mesaje de protocol;
- configurare și verificare practică; interpretarea output-ului de comenzi (exemple realiste);
- comportament așteptat și **scenarii de eșec / capcane concrete**.

Reguli: progresia **Summary → Detailed → DeepDive → Traps**; nu înlocui explicațiile cu rezumate, liste superficiale sau definiții seci; păstrează distincția dintre teorie, configurare, întrebări și laburi; terminologie Cisco/comenzi în engleză, explicații în română ca în proiect. Quiz-urile explică **de ce fiecare variantă** e corectă sau greșită. Laburile trebuie să fie executabile în mediul suportat (Packet Tracer; GNS3/CML unde se poate; wireless nu se emulează în GNS3/CML).

### 0.4 Curriculum și verificare factuală
- Codurile topicurilor/subtopicurilor și titlurile se aliniază cu `research_notes/Curricula CCNA și resurse oficiale/user_provided_v11_official.md` (autoritatea pentru scop). Nu inventa, redenumi, reordona sau reinterpreta tacit subtopicuri oficiale.
- Validează afirmațiile cu notițele de cercetare relevante și cu surse tehnice autoritative. Rezolvă toate marcajele `[verify]` înainte de „Complet tehnic”.
- O afirmație neverificabilă nu se prezintă ca fapt: se corectează, se omite, se formulează prudent sau se marchează pentru verificare și se raportează (§7). Nu inventa surse sau citări; lecțiile nu primesc citări noi dacă convențiile existente nu le au.

### 0.5 Modificări care cer aprobarea explicită a utilizatorului
**Nu modifica fără aprobare explicită (dată pentru acea modificare, în chat):**
- `AVAILABLE` din `web/src/data/curriculum.ts` (acum `['1.11']`);
- `web/src/content/registry.ts` (`TOPICS`);
- alte decizii arhitecturale din `docs/DECISIONS.md` (stack, moduri de antrenament, design, schema API), componente comune (`web/src/components/`, `lib/`), `scripts/check-content.mjs`, dependențe, configurare de build/runtime, `.claude/rules/`.

Reguli de interpretare:
- „Complet tehnic” **nu** autorizează înregistrarea. Un punct de checklist care menționează înregistrarea **nu** autorizează editarea `registry.ts`.
- Agentul poate **identifica și raporta** modificările de înregistrare necesare (ex. „adaugă `T1_6` în `TOPICS`”) și **așteaptă aprobarea explicită** înainte să le aplice.
- O aprobare dată pentru alt topic sau altă ocazie nu e autorizare generală.

## 1. Pregătire (în ordine, oprește-te când ai destul)
1. `docs/CURRENT_STATE.md` — ce există, ce e validat, ce e înregistrat/disponibil.
2. `research_notes/INDEX.md` → deschide **doar secțiunile topicului** din fișierul de cercetare. `reports/` = sinteză, nu se citește pentru scriere.
3. Șablon de format, nu lectură integrală: `grep -n '^export function\|<section id' web/src/content/t1_11/Theory.tsx`, apoi citește o singură secțiune completă din `Theory.tsx` + începutul `Config.tsx` și `Labs.tsx` (~150 linii fiecare). Din `questions/t1_11.ts` ajung ~150 linii (câte un exemplu de tip). Componente: citește semnăturile (`grep -n 'export'`), nu fișierele integral; contractul de bază e în §4.1.
4. ID-uri canonice de glosar: în `_WRITER_BRIEF.md`, doar secțiunea cu lista canonică, găsită după conținut (`grep -n 'ID-uri canonice' "research_notes/Domeniul 1 Network Fundamentals/_WRITER_BRIEF.md"`), nu după numere de rând. Ce există deja: `grep -oP "\bid: '\K[^']+(?=',\s*abbr:)" web/src/data/glossary.ts web/src/data/terms/*.ts`.

## 2. Limbă, ton, precizie
- Română, pentru **începător total**; termenii tehnici, comenzile, titlurile Cisco rămân în engleză. Diacritice corecte (ă â î ș ț).
- Fraze complete, didactice; `<Analogy>` pentru concepte abstracte; tabele pentru comparații; istoric „ce problemă a rezolvat” fiecare tehnologie/standard; „Capcane de examen” concrete.
- Precizie: doar cifre din notițe sau sigure. `[verify]` neconfirmat → omite sau formulează prudent. Reguli regionale: UE/România (ANCOM/ETSI) vs SUA (FCC), dar răspunsul de examen = varianta Cisco.
- Comenzi: sintaxă din ghidurile Cisco, explicată linie cu linie în `CodeBlock explain`. Output-urile CLI sunt **exemple ilustrative** — spune asta într-un `Callout` la Config. Comenzile **nu au fost testate pe echipamente reale**; avertizează utilizatorul.

## 3. Structura obligatorie
Per sub-topic: `<section id=… className="section">` + `<SectionHead id code title/>` → `<Summary>` (2–3 rânduri) → `<Detailed>` (unul sau mai multe, cu h3/h4) → `<DeepDive>` opțional → `<Traps items=[…]/>` → `<InlineQuiz ids={[…]}/>` (2–4 întrebări din banca topicului).
- Prima secțiune = introducere „imaginea de ansamblu”, cu tabel cod Cisco → temă; `Callout` dacă predai în altă ordine decât a/b/c (codurile oficiale se păstrează).
- Apoi `config` (Exemple de configurare și verificare), apoi `TopicPage` adaugă banca de întrebări (`TopicQuestions`), apoi laburile (`lab-guided`, `lab-solo`).
- Lab: obiectiv, timp, topologie SVG, tabel adresare, pași `<Step n title labKey>`, `<Reveal>` pentru întrebări/indicii, soluție completă ascunsă în `Reveal`, limitele PT într-un `Callout`. Topicurile „Configure and verify” (1.6, 1.8 etc.) → laburi CLI complete (PT + notă GNS3/CML); „Describe/Explain/Compare” → tot laburi PT (ghidat + solo), adaptate (simulation mode, tabele, `show`). Wireless nu se emulează în GNS3/CML.

## 4. Fișiere per topic `<tX_Y>` și mecanisme
- `web/src/content/<tX_Y>/Theory.tsx`, `Config.tsx`, `Labs.tsx`, `CheatSheet.tsx`, `index.tsx` (`export const T<X>_<Y>: TopicModule`).
- `web/src/diagrams/<tX_Y>.tsx` — SVG original, interactiv unde ajută. Culori **doar** prin `var(--text|--accent|--muted|--surface-3|--text-2|--info|--warn|--bad|--ok|--violet|--accent-soft|--border|--code-bg)` (nu `--danger`); `viewBox` + `width="100%"`. Reutilizează icoanele din `diagrams/wlan.tsx`, nu le duplica. Diagrame **originale acolo unde au valoare didactică** (flux de cadre, topologie, stări, câmpuri de antet, mecanisme greu de explicat doar în text); **nu** adăuga diagrame decorative doar ca să bifezi checklistul. Un topic fără mecanism vizualizabil poate avea puține diagrame — justifică în raport. Se verifică cu `tsc` și, când e aplicabil, vizual (§5.4).
- `web/src/data/questions/<tX_Y>.ts` — `export const Q_<X>_<Y>: Question[]`, **~40 întrebări**, id `<X.Y>-001`… (ex. `1.1-001`).
- `web/src/data/terms/<tX_Y>.ts` — `import type { GlossaryEntry } from '../../lib/types'; export const TERMS: GlossaryEntry[]`.
- `web/src/data/facts/<tX_Y>.ts` — `import type { Fact } from '../flashcards'; export const FACTS: Fact[]` (~15–25, id `f-<X.Y>-01`).
- Imagini: `web/public/img/wiki/<nume>.jpg` + `attribution.<tX_Y>.json` (format ca `attribution.json`), folosite prin `<Photo file caption/>`. Doar Wikimedia cu licență și autor **confirmate**; altfel fără foto. Max ~4 foto, < 200 KB. Download: `https://upload.wikimedia.org/wikipedia/commons/thumb/{md5[0]}/{md5[:2]}/{Name}/960px-{Name}` (md5 al numelui cu `_` pentru spații; API-ul Commons dă rate-limit). Iconițele Cisco doar nemodificate.
- **Agregare automată (nu se editează manual fișierele de agregare):** `data/questions/index.ts` (`import.meta.glob('./t*.ts')`, ia toate array-urile exportate), `data/glossary.ts` (`./terms/*.ts`, export `TERMS`), `data/flashcards.ts` (`./facts/*.ts`, export `FACTS`), `attribution*.json`. Nu se editează `questions/index.ts`, `glossary.ts`, `flashcards.ts`.
- **Înregistrare (manuală, protejată — §0.5):** `content/registry.ts` importă `T<X>_<Y>` din `./t<x>_<y>` și îl adaugă în `TOPICS` (de aici derivă `TOPIC_MODULES`/`TOPIC_SECTIONS`). `AVAILABLE` (`data/curriculum.ts`) decide ce topic apare în aplicație. `TopicPage` și `CheatSheets` citesc din `TOPICS`. Ambele se modifică **doar cu aprobarea explicită** a utilizatorului.

### 4.1 Contract tehnic (verificat în sursă: `lib/types.ts`, `components/Rich.tsx`, `Term.tsx`, `LabStep.tsx`, `Lesson.tsx`, `CodeBlock.tsx`, `content/types.ts`)

**Markup Rich** (`Rich.tsx`, o singură regex; `parse()` recursiv doar pentru conținutul `**…**`):
- `[[id]]` → `Term` cu `abbr`; `[[id|text]]` → `Term` cu textul `text`. `id` doar `[a-z0-9-]` (cu majuscule sau alte caractere, construcția nu se recunoaște și apare literal). Textul după `|` e afișat ca atare (fără markup; nu poate conține `]`).
- `**bold**` → `<b>`; conținutul (fără `*`) e parsat recursiv, deci **poate conține** `[[id]]`, `[[id|text]]` și `` `code` ``. Bold imbricat în bold nu e posibil.
- `` `code` `` → `<code>`; conținutul e literal (fără `[[…]]` sau `**` în interior; un `[[id]]` între backtick-uri rămâne text).
- Nu există alt markup: fără linkuri, italic (`*x*`), liste, heading-uri, escapare sau tratare specială de newline.
- `id` valid ca slug dar necunoscut în glosar: nu dă eroare la randare — `Term` afișează `text` sau `id`-ul brut, fără popover. `check-content` îl raportează (`termen lipsă`), deci se corectează.
- Câmpuri randate prin `Rich`: la întrebări `stem`, `explanation`, `options[].text/why`, `pairs[].left/right/why`, `distractors[].text/why`, `items[].text/why`, `wrong[].why`; la flashcards `detail`. În JSX (Theory/Config/Labs) se folosește `<G id="…"/>` (= `Term`, `import { Term as G }`), nu `[[…]]`.
- `Term` e un `<button>` cu popover (Ce face / Cum lucrează / Unde se folosește + badge `layer`, `std`, `topics`, link spre Glosar) → **nu-l pune în alt `<button>`** (de aceea răspunsurile sunt `div role=radio/checkbox`). Câmpurile `what/how/where` ale glosarului sunt randate ca **text simplu** (fără markup Rich).

**`GlossaryEntry`** (`lib/types.ts`):
| Câmp | Tip | Rol (verificat) |
|---|---|---|
| `id` | obligatoriu | slug unic global; `check-content` extrage perechea `id: '…',` urmată (cu orice spațiu/newline) de `abbr:`, cu **ghilimele simple**; duplicat → prima definiție câștigă, checkerul raportează |
| `abbr` | obligatoriu | textul afișat în text și în titlul popover-ului |
| `full` | opțional | denumirea completă în engleză (afișată în popover; folosită la flashcards și căutare) |
| `ro` | opțional | denumire/explicație scurtă în română (popover, flashcards, căutare) |
| `what` / `how` / `where` | obligatorii | ce face · cum lucrează · unde se folosește — complete și didactice (calitatea o impune §0.3, nu tipul) |
| `std` | opțional | standard/RFC — badge în popover |
| `layer` | opțional | nivel OSI — badge în popover |
| `topics` | opțional (recomandat) | topicuri legate (`Topic: …` în popover); primul topic **disponibil** din listă primește flashcard-ul termenului — pune topicul tău primul |
| `aliases` | opțional | denumiri alternative; folosite în căutarea din pagina Glosar |
Un termen canonic al altui topic îl **referi**, nu îl redefinești.

**Întrebări** (`lib/types.ts`; `Question`): comune `id`, `topicId` (ex. `"1.11"`), `sub?` (ex. `"1.11.a"`), `difficulty` 1|2|3, `stem`, `explanation`, `tags?`. Pe tip: `single`|`multi` → `options[{id,text,correct,why}]`; `match` → `pairs[{left,right,why}]`, `distractors?[{text,why}]`, `leftLabel?`, `rightLabel?`; `order` → `items[{text,why}]` (ordinea din array = ordinea corectă); `cli` → `prompt`, `answers[]` (variante acceptate), `canonical`, `wrong[{text,why}]`, `hint?`. Nu există alte tipuri în `Question` (subnetting generat e în `lib/subnet.ts`/pagina Subnetting, nu în banca de întrebări). Tipurile TS **nu** impun mixul de tipuri, numărul (~40) sau prezența `why` pe fiecare opțiune ca valoare nenulă de calitate — le verifici tu (§6 pct. 3). `check-content` verifică doar unicitatea id-urilor cu forma `'<X.Y>-NNN'` (ghilimele simple).

**Facts** (`Fact = Omit<Flashcard,'kind'>`): `id`, `topicId`, `front`, `back`, `detail?`.

**Laburi** (`LabStep.tsx`): `<Step n title labKey>` — afișează pasul cu bifă „pas realizat” salvată în `localStorage` sub cheia `lab:<labKey>:<n>`; deci `labKey` trebuie să fie **unic per lab** și `n` unic în lab. `<P>` marchează o cale de meniu Packet Tracer. Componente de lecție disponibile în `Lesson.tsx`: `Summary`, `Detailed`, `DeepDive`, `Traps`, `Callout` (`kind`: `info`/`tip`/`warn`/`exam`), `Analogy`, `Figure`, `Photo`, `Reveal` (`label`, `defaultOpen`), `Table` (`head`, `rows`, `hlCol`); `CodeBlock` (`kind`: `config`/`session`, `explain: [comandă, explicație][]`); `InlineQuiz ids`; `SectionHead id code title`.

**Modul topic** (`content/types.ts`, `TopicModule`): `id`, `subtitle`, `studyTime`, `labs` (număr), `sections: TocItem[]` (TOC + progres; **trebuie să includă `questions` și id-urile laburilor**), `Body`, `Labs`, `CheatSheet?`. `CheatSheet` e opțional **doar în tip**; nu am găsit nicio constrângere tehnică care să împiedice un CheatSheet per topic, deci în acest workflow el e **livrabil obligatoriu** (checklist §6 pct. 1). Modelul: `content/t1_11/index.tsx`.

## 5. Verificare (țintită, incrementală)
1. **TypeScript:** `cd web && npx tsc -b --noEmit`. Distinge: (a) **erori introduse de topicul curent** (fișierele lui, sau erori cauzate de ele în alte fișiere) — se remediază obligatoriu; (b) **erori preexistente în alte fișiere/topicuri** — nu se repară nesolicitat; se raportează separat, cu dovada că existau înainte (ex. aceleași erori fără modificările topicului sau fișiere fără legătură cu el). Verificarea „trece” doar dacă nu rămâne nicio eroare de tip (a); (b) se listează explicit. Rulează după fiecare grup de fișiere scrise.
2. **`node scripts/check-content.mjs`** (din rădăcina repo-ului). **Ce verifică efectiv:** id-uri de glosar duplicate; referințe `<G id>`/`<Term id>`/`[[id]]` către termeni inexistenți; id-uri de întrebări duplicate; `InlineQuiz ids` către întrebări inexistente; fișiere `<Photo file>` lipsă sau fără atribuire în `attribution*.json`; apoi tipărește statistici. **Ce NU verifică:** structura/completitudinea întrebărilor, `why` pe opțiuni, numărul de întrebări, facts, `[verify]`, înregistrarea, corectitudinea tehnică sau didactică. Clasificarea constatărilor (nu declara verificarea „trecută” dacă mai are erori nerezolvate sau neclasificate): (a) erori **proprii topicului curent** (id duplicat, termen neînscris definit de topic, foto lipsă/fără atribuire etc.) — se remediază; (b) referințe `<G>`/`[[…]]` către **termeni canonici ai topicurilor viitoare, încă nescrise** — se pot documenta temporar (listă în raport și în `CURRENT_STATE.md`), cu condiția să fie într-adevăr din lista canonică a altui topic; (c) `InlineQuiz` către **întrebări inexistente pentru un topic deja scris** — se remediază (creezi întrebările sau corectezi ids); (d) preexistente în alte topicuri — se raportează, nu se repară nesolicitat.
   - **Limitare Windows:** `new URL(import.meta.url).pathname` produce o cale invalidă (`C:\C:\…`) și scriptul eșuează nativ. Nu repara scriptul original (cere aprobare, §0.5).
   - **Alternative valide, în ordine:** (a) rulează-l din WSL/Linux; (b) rulează-l în alt mediu potrivit; (c) fă o **copie temporară în afara repo-ului** (ex. directorul scratchpad), înlocuiește în copie linia `root` cu calea absolută către `web/` (sau folosește `fileURLToPath`), rulează copia, șterge copia — originalul rămâne neatins.
   - **Dacă nu poți rula nicio alternativă:** raportează literal **`check-content neefectuat`**. Topicul **nu poate fi marcat „Complet tehnic”**. Nu înlocui verificarea cu presupuneri, inspecție informală sau cu simpla existență a fișierelor. Nu pretinde niciodată că a trecut dacă nu a rulat.
3. **Build:** `npm run build` (rădăcină; web = `tsc -b && vite build`) doar la finalul unui domeniu, înainte de commit/PR cerut de utilizator, sau după modificări în componente comune (pe acestea doar cu aprobare). Nu-l repeta la fiecare pas.
4. **Verificare vizuală** (desktop 1440×900 + mobil, `pageerror`/erori de consolă, overflow orizontal): necesară doar pentru topicuri care urmează să devină `Disponibil`, și **doar dacă un browser automatizat chiar există în mediul curent**. Verifică întâi; la ultima verificare Playwright **nu** era instalat (nu e în `node_modules`) și nu se instalează fără aprobare. Alternativă: browser-ul integrat al aplicației desktop, dacă e disponibil. Dacă nu poți: raportează „verificare vizuală: neefectuată”.
5. Nu se face commit/push/PR fără cererea utilizatorului.

## 6. Stări — terminologie (independente, nu se confundă)
Folosite identic în `docs/CURRENT_STATE.md`.

| Stare | Sens | Cine o poate declara |
|---|---|---|
| **Fișiere existente** | fișierele relevante există în repo; nu spune nimic despre corectitudine sau completitudine | verificabil direct |
| **Complet tehnic** | toți pașii de validare tehnică aplicabili au fost **efectiv rulați și au trecut** (checklist mai jos) | agentul, cu dovezi (comenzi + rezultate) |
| **Review didactic** | un om a revizuit topicul sau utilizatorul a confirmat explicit calitatea didactică | **doar utilizatorul**; un agent nu poate declara asta pe baza propriei evaluări |
| **Înregistrat** | topicul e adăugat în `registry.ts` (`TOPICS`) | doar după aprobarea explicită a utilizatorului (§0.5) |
| **Disponibil** | topicul e în `AVAILABLE` (`data/curriculum.ts`) și apare în aplicație | doar după aprobarea explicită a utilizatorului (§0.5) |

Reguli: existența fișierelor nu e niciodată „complet tehnic”; înregistrarea e separată de complet tehnic; disponibilitatea e separată de înregistrare (un topic înregistrat dar care nu e în `AVAILABLE` nu apare). Un topic poate fi complet tehnic dar nerevizuit, neînregistrat și indisponibil; poate avea fișiere fără să fie complet tehnic. Nu se „promovează” starea unui topic fără dovezi.

**Checklist „Complet tehnic”** (toate trebuie **executate**, nu presupuse; ce nu s-a executat → starea nu se acordă):
1. Există fișierele din §4: `Theory`, `Config`, `Labs`, `CheatSheet`, `index.tsx`, diagrame, `questions/<tX_Y>.ts`, `terms/<tX_Y>.ts`, `facts/<tX_Y>.ts` (existența e doar precondiție).
2. `index.tsx` exportă un `TopicModule` valid, cu `sections` care includ `questions` și laburile. (Înregistrarea în `registry.ts` **nu** face parte din acest checklist; se raportează ca pas separat cu aprobare — §0.5.)
3. Întrebări: ~40 (ca 1.11), id-uri `<X.Y>-NNN` unice, `topicId`/`sub`/`difficulty` corecte, mix de tipuri ca în §4.1, `why` real pe **fiecare** opțiune/pereche/distractor/element/greșeală CLI (verificat prin citire țintită sau script ad-hoc, nu doar prin `tsc`).
4. Glosar: id-uri unice; fiecare `<G>`/`[[…]]` rezolvă la un termen existent; termenii proprii au `what/how/where`; `facts` ~15–25 cu id `f-<X.Y>-NN`.
5. `check-content` a **rulat** (§5.2) și nu mai are erori de categoriile (a) și (c); rămân doar constatări de categoria (b)/(d), explicit clasificate și documentate. Altfel verificarea nu e trecută.
6. `tsc -b --noEmit` a rulat și nu are erori introduse de topic (§5.1; cele preexistente listate separat); build-ul din §5.3 a rulat când e cerut de jalon.
7. Zero `[verify]` nerezolvate în conținutul declarat; curriculum aliniat cu `user_provided_v11_official.md` (§0.4).

**Review didactic** — doar cu revizuire umană sau confirmare explicită a utilizatorului. Revizuirea acoperă: accesibilitate pentru începător; adâncime și corectitudine; standardul 1.11; acuratețe tehnică; exemple și relevanță practică; explicații la fiecare variantă de răspuns; completitudinea și fezabilitatea laburilor; consistența cu curriculumul oficial v1.1.

## 7. Raport final per topic
Fișiere create/modificate · nr. întrebări pe tipuri · termeni definiți · termeni canonici referiți dar nedefiniți · foto adăugate · incertitudini tehnice (`[verify]` rămase, afirmații neverificate) · **comenzi rulate și rezultatul lor** (`tsc`, `check-content` — sau „check-content neefectuat”; verificare vizuală — sau „neefectuată”) · starea fiecărui nivel din §6 · **modificările de înregistrare necesare (`registry.ts`, `AVAILABLE`) raportate, neaplicate** · actualizează rândul topicului în `docs/CURRENT_STATE.md` fără să acorzi „Review didactic”, „Înregistrat” sau „Disponibil” fără aprobare.

## 8. Capcane tehnice deja rezolvate
- Variantele de răspuns sunt `div role=radio/checkbox`, NU `button` (conțin `<Term>` care e button → nested buttons).
- `Session` în Training are `key` stabil (altfel se remontează la re-render al store-ului și pierde rezultatele).
- `@fastify/static` cu wildcard implicit (cu `wildcard:false` fișierele noi după rebuild nu se servesc).
- Popover-ul glosarului devine bottom-sheet pe ecrane ≤640px.
- SVG: `var(--…)` pentru ambele teme. Clase CSS noi nu se adaugă în `app.css` pentru un singur topic: `style={{…}}` cu variabile.

## 9. Limitări ale configurării Claude Code
`.claude/rules/` cu `paths:` nu a fost creat: versiunea CLI folosită de aplicația desktop nu poate fi verificată de aici (nu există `claude` în PATH). Regulile de format de la §2–§4 rămân aici și se citesc doar când se scrie conținut.
