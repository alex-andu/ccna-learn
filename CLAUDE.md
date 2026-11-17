# CLAUDE.md — CCNA Learn

Răspunde utilizatorului în **română**; termenii tehnici, comenzile și titlurile Cisco rămân în **engleză**.

Platformă personală de învățare pentru **Cisco CCNA 200-301 v1.1** (începător total), self-hosted pe Raspberry Pi 4, doar LAN. `web/` = Vite + React 19 + TS; `server/` = Fastify 5 + SQLite; `deploy/` = systemd/Caddy.

## Ce citești și când
- **Mereu la început:** `docs/CURRENT_STATE.md` (ce există / e verificat / e disponibil). Nu presupune că un fișier existent înseamnă conținut complet.
- **La scris/revizuit un topic:** `docs/WORKFLOW.md` (procedura unică, formatul obligatoriu, verificări).
- **Doar la nevoie:** `docs/DECISIONS.md` (decizii cu utilizatorul — nu se reiau).
- **Cercetare:** deschide `research_notes/INDEX.md`, apoi doar secțiunea topicului (`Read` cu `offset`/`limit`). Nu citi `research_notes/` sau `reports/` integral. `reports/` e sinteză; sursa e `research_notes/`.

## Ierarhia documentelor (detalii: WORKFLOW §0.1)
1. `CLAUDE.md` (intrare) → 2. `docs/WORKFLOW.md` (autoritar pentru crearea/validarea conținutului) → 3. `docs/CURRENT_STATE.md` (stare și pași următori curenți) → 4. `docs/DECISIONS.md` (decizii + motivații) → 5. `research_notes/INDEX.md` (navigare cercetare) → 6. `_WRITER_BRIEF.md` (istoric, înlocuit de WORKFLOW).
Dacă `_WRITER_BRIEF.md` contrazice WORKFLOW.md, WORKFLOW.md are prioritate. Nu citi brief-ul sau arhiva de cercetare integral; doar secțiunea cu ID-uri canonice de glosar din brief (găsită după conținut, nu după numere de rând; vezi WORKFLOW §1) și secțiunea topicului curent.

## Standard educațional — obligatoriu (WORKFLOW §0.3)
Fiecare topic atinge cel puțin adâncimea, tonul, structura și calitatea pilotului 1.11 (Summary → Detailed → DeepDive → Traps), pentru începător total: ce este, **de ce există**, **cum lucrează pas cu pas**, când se folosește, câmpuri/cadre/antete, configurare + verificare, exemple și scenarii de eșec; quiz cu `why` pe fiecare variantă. Nu reduce adâncimea pentru a economisi tokeni — optimizează selecția contextului și fluxul, nu materialul.

## Protecții — aprobare explicită necesară (WORKFLOW §0.5)
Nu modifica `AVAILABLE` (`web/src/data/curriculum.ts`) și `web/src/content/registry.ts` fără aprobare explicită a utilizatorului, dată pentru acea modificare. „Complet tehnic” sau un punct de checklist nu autorizează înregistrarea; raportează modificările necesare și așteaptă. Același principiu pentru componente comune, `scripts/`, dependențe, configurare și decizii din `docs/DECISIONS.md`.

## Stări (WORKFLOW §6) — nu se confundă
Fișiere existente · Complet tehnic (validări efectiv rulate) · Review didactic (doar utilizatorul) · Înregistrat · Disponibil. `check-content neefectuat` ⇒ nu există „Complet tehnic”.

## Reguli ne-negociabile
- Nu reduce adâncimea sau acuratețea; nu elimina diagrame, explicații, exemple, quiz-uri, referințe. Nu rescrie conținut existent fără cerere.
- Cifre doar verificate; ce nu e sigur (`[verify]`) se omite sau se formulează prudent. Comenzile CLI nu sunt testate pe echipamente reale — avertizează.
- Fiecare variantă de răspuns are explicație (`why`). Acronimele sunt `<Term>`/`<G>`.
- SVG: culori doar prin `var(--…)` (dark + light). Răspunsurile sunt `div role=radio/checkbox`, nu `button`.
- Lucrează secvențial, fără subagenți/agenți paraleli, dacă utilizatorul nu cere. Nu face commit/push/PR fără cerere. Commit-uri mici, mesaje în engleză.

## Comenzi
```bash
npm install                      # rădăcină (workspaces)
npm run dev                      # vite :5173 + server :8080
npm run build && npm start       # producție :8080
cd web && npx tsc -b --noEmit    # typecheck
node scripts/check-content.mjs   # glosar/întrebări/foto (eșuează nativ pe Windows — alternative și „check-content neefectuat”: WORKFLOW §5.2)
```
Build complet doar la final de domeniu sau la schimbări în componente comune; altfel typecheck + check-content.
