import type { Question } from '../../lib/types';

// Banca de întrebări pentru 6.4 Explain AI (generative and predictive) and machine learning in network operations.
// Obiectivul oficial nu are sub-puncte; `sub` = '6.4'. Fiecare variantă are explicație (why).
const T = '6.4';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_6_4: Question[] = [
  // ======================= Imaginea de ansamblu =======================
  single({ id: '6.4-001' }, 1, 'Ce este machine learning (ML)?', [
    ['O metodă prin care un sistem învață tipare din date, fără reguli scrise explicit pentru fiecare caz', true, 'Algoritmul se antrenează pe exemple și produce un model.'],
    ['Un protocol de rutare dinamică', false, 'ML nu este un protocol de rutare.'],
    ['Un tip de cablu pentru viteze mari', false, 'Nu are legătură cu cablarea.'],
    ['Un limbaj de configurare pentru switch-uri', false, 'ML nu este un limbaj de configurare.'],
  ], 'ML = învățare din date.'),
  single({ id: '6.4-002' }, 1, 'Care este relația corectă dintre AI, ML și deep learning?', [
    ['AI este domeniul larg; ML este o metodă din AI; deep learning este o formă de ML', true, 'AI ⊃ ML ⊃ deep learning.'],
    ['ML este domeniul larg care include AI', false, 'Este invers: AI include ML.'],
    ['Sunt trei nume pentru același lucru', false, 'Sunt niveluri diferite de generalitate.'],
    ['Deep learning nu are legătură cu ML', false, 'Deep learning este o formă de ML.'],
  ], 'AI ⊃ ML ⊃ deep learning.'),
  single({ id: '6.4-003' }, 1, 'Care este diferența, pe scurt, dintre AI predictiv și AI generativ?', [
    ['Predictiv: prezice/detectează/clasifică pe baza datelor; generativ: creează conținut nou (text, cod)', true, 'Aceasta este distincția pe care o cere examenul.'],
    ['Nu există nicio diferență', false, 'Rezolvă probleme diferite.'],
    ['Predictiv scrie cod, generativ detectează anomalii', false, 'Este invers.'],
    ['Predictiv funcționează doar pe cablu, generativ doar pe Wi-Fi', false, 'Nu depinde de mediul de transmisie.'],
  ], 'Predictiv = evaluează; generativ = creează.'),

  // ======================= Bazele ML =======================
  single({ id: '6.4-004' }, 2, 'Ce sunt datele de antrenare?', [
    ['Exemplele din care un algoritm ML învață tiparele', true, 'De ele depinde calitatea modelului.'],
    ['Parola prin care te conectezi la model', false, 'Nu are legătură cu autentificarea.'],
    ['Rezultatele modelului în producție', false, 'Acestea sunt predicțiile (inferența).'],
    ['Configurația unui router', false, 'Configurația nu este, ca atare, un set de antrenare.'],
  ], 'Date de antrenare = exemplele de învățare.'),
  single({ id: '6.4-005' }, 2, 'Care este diferența dintre antrenare și inferență?', [
    ['Antrenarea construiește modelul din date; inferența folosește modelul deja antrenat pe date noi', true, 'Antrenarea e rară și costisitoare; inferența e continuă și ieftină.'],
    ['Antrenarea se face în producție pe fiecare măsurătoare nouă', false, 'De obicei modelul nu învață la fiecare măsurătoare; se reantrenează periodic.'],
    ['Sunt sinonime', false, 'Sunt etape diferite.'],
    ['Inferența construiește modelul', false, 'Modelul se construiește la antrenare.'],
  ], 'Antrenare ≠ inferență.'),
  single({ id: '6.4-006' }, 2, 'De ce contează calitatea datelor de antrenare?', [
    ['Un model antrenat pe date greșite sau nereprezentative produce rezultate greșite', true, 'Garbage in, garbage out.'],
    ['Nu contează: algoritmul compensează orice date', false, 'Algoritmul nu poate corecta date proaste.'],
    ['Doar cantitatea contează, nu și calitatea', false, 'Cantitatea nu înlocuiește calitatea și reprezentativitatea.'],
    ['Datele afectează doar viteza modelului', false, 'Afectează în primul rând acuratețea.'],
  ], 'Date proaste → model prost.'),
  single({ id: '6.4-007' }, 2, 'Ce este învățarea supervizată?', [
    ['Învățarea din exemple etichetate (se cunoaște răspunsul corect)', true, 'De exemplu, trafic etichetat „video” sau „web”.'],
    ['Învățarea fără date', false, 'Orice ML are nevoie de date.'],
    ['Învățarea în care omul scrie toate regulile', false, 'Aceasta este programarea clasică.'],
    ['Învățarea doar pe date criptate', false, 'Criptarea nu definește tipul de învățare.'],
  ], 'Supervizată = cu etichete.'),
  single({ id: '6.4-008' }, 2, 'Ce înseamnă „model drift”?', [
    ['Modelul își pierde precizia deoarece datele reale s-au schimbat față de cele de antrenare', true, 'Remediu: monitorizare și reantrenare.'],
    ['Modelul se mută pe alt server', false, 'Nu este vorba de localizare.'],
    ['O configurație diferă între două echipamente', false, 'Aceasta este configuration drift (6.1).'],
    ['Modelul consumă mai multă memorie', false, 'Nu este definiția.'],
  ], 'Model drift ≠ configuration drift.'),

  // ======================= AI predictiv =======================
  single({ id: '6.4-009' }, 1, 'Ce este un baseline de rețea?', [
    ['Profilul „normal” al unei metrici, folosit ca referință', true, 'De exemplu, utilizarea tipică a unei legături la ora 10:00.'],
    ['Un cablu de rezervă', false, 'Nu este un echipament fizic.'],
    ['O parolă implicită', false, 'Nu are legătură cu parolele.'],
    ['Un tip de VLAN', false, 'Nu este un VLAN.'],
  ], 'Baseline = normal.'),
  single({ id: '6.4-010' }, 2, 'Care sarcină este un exemplu clasic de AI predictiv/analitic într-o rețea?', [
    ['Detectarea unui client Wi-Fi care se comportă anormal față de baseline', true, 'Detectarea anomaliilor este ML predictiv/analitic.'],
    ['Generarea unui draft de configurație din limbaj natural', false, 'Aceasta este AI generativ.'],
    ['Scrierea automată a unui e-mail către echipă', false, 'Generare de text: AI generativ.'],
    ['Traducerea documentației în altă limbă', false, 'Generare/transformare de text: AI generativ.'],
  ], 'Anomalii → predictiv.'),
  single({ id: '6.4-011' }, 2, 'Un sistem estimează utilizarea unei legături peste 3 luni, pe baza istoricului. Ce tip de sarcină este?', [
    ['Prognoză (forecasting), AI predictiv', true, 'Prezice valori viitoare din date istorice.'],
    ['Generare de text', false, 'Nu produce text nou, ci o valoare estimată.'],
    ['Autentificare', false, 'Nu are legătură cu autentificarea.'],
    ['Încapsulare', false, 'Nu este vorba de încapsulare de pachete.'],
  ], 'Prognoză = predictiv.'),
  single({ id: '6.4-012' }, 2, 'Sensibilitatea unui detector de anomalii este setată prea mare (bandă foarte îngustă). Ce se va întâmpla?', [
    ['Multe alarme false (alert fatigue)', true, 'Variațiile normale sunt marcate ca anomalii.'],
    ['Nicio alarmă, niciodată', false, 'O bandă îngustă produce mai multe alarme, nu mai puține.'],
    ['Modelul se oprește', false, 'Nu are acest efect.'],
    ['Rețeaua devine mai rapidă', false, 'Nu are legătură cu performanța rețelei.'],
  ], 'Bandă îngustă → alarme false.'),
  single({ id: '6.4-013' }, 2, 'Sensibilitatea este setată prea mică (bandă foarte largă). Care este riscul?', [
    ['Anomalii reale, în special cele subtile, nu sunt detectate', true, 'Abaterile mici ies din bandă prea rar.'],
    ['Apar prea multe alarme false', false, 'Aceasta este problema benzii prea înguste.'],
    ['Datele se pierd', false, 'Nu sunt pierdute date.'],
    ['Se deschid porturi noi', false, 'Nu are legătură cu porturile.'],
  ], 'Bandă largă → anomalii ratate.'),
  single({ id: '6.4-014' }, 2, 'Un vârf de trafic detectat ca anomalie este în același timp o copie de siguranță planificată. Ce concluzie este corectă?', [
    ['Anomalia nu este neapărat o problemă: contextul decide', true, 'Modelul semnalează abateri, nu intenții.'],
    ['Modelul este defect și trebuie șters', false, 'A făcut exact ce trebuie: a semnalat o abatere.'],
    ['Orice anomalie este un atac', false, 'Multe anomalii sunt evenimente legitime.'],
    ['Backup-urile nu generează trafic', false, 'Generează trafic semnificativ.'],
  ], 'Context + validare.'),

  // ======================= AI generativ =======================
  single({ id: '6.4-015' }, 1, 'Ce este un LLM (Large Language Model)?', [
    ['Un model antrenat pe cantități mari de text, care generează și transformă text (și cod)', true, 'Este baza multor asistenți generativi.'],
    ['Un tip de router wireless', false, 'Nu este echipament de rețea.'],
    ['Un protocol de securitate', false, 'Nu este protocol de securitate.'],
    ['O bază de date de adrese MAC', false, 'Nu are legătură cu MAC.'],
  ], 'LLM = model de limbaj mare.'),
  single({ id: '6.4-016' }, 1, 'Ce este un prompt?', [
    ['Instrucțiunea (și contextul) pe care o dai unui model generativ', true, 'Un prompt clar duce la rezultate mai bune.'],
    ['Un mesaj de eroare al switch-ului', false, 'Aceasta este un mesaj de sistem, nu un prompt.'],
    ['Răspunsul modelului', false, 'Răspunsul este ieșirea (output), nu promptul.'],
    ['O parolă pentru model', false, 'Nu este o parolă.'],
  ], 'Prompt = instrucțiunea către model.'),
  single({ id: '6.4-017' }, 2, 'Un asistent generativ îți oferă o comandă IOS convingătoare, dar care nu există. Cum se numește fenomenul?', [
    ['Halucinație', true, 'Răspuns fluent și sigur, dar fals sau inventat.'],
    ['Convergență', false, 'Convergența este stabilizarea unui protocol de rutare.'],
    ['Inferență corectă', false, 'Comanda nu există, deci nu este corectă.'],
    ['Încapsulare', false, 'Nu are legătură.'],
  ], 'Halucinație = invenție convingătoare.'),
  single({ id: '6.4-018' }, 2, 'Care este o utilizare potrivită a AI generativ în operațiunile de rețea?', [
    ['Rezumarea unui volum mare de log-uri într-un paragraf cu cauze probabile', true, 'Generare de text pe baza unui context dat; apoi se verifică.'],
    ['Înlocuirea completă a testării configurațiilor', false, 'Validarea nu se elimină; este esențială.'],
    ['Stocarea parolelor în prompturi', false, 'Secretele nu se pun în prompturi.'],
    ['Aplicarea automată, fără verificare, a oricărei configurații generate', false, 'Este periculos: poate conține greșeli.'],
  ], 'Rezumate, drafturi, explicații — cu validare.'),
  single({ id: '6.4-019' }, 2, 'De ce nu trebuie incluse parole sau date confidențiale într-un prompt?', [
    ['Pot fi expuse unui serviciu extern, stocate sau reutilizate în moduri necontrolate', true, 'Datele trimise unui serviciu extern ies din controlul organizației.'],
    ['Pentru că modelul nu înțelege parolele', false, 'Nu este motivul; este o problemă de confidențialitate.'],
    ['Pentru că promptul devine prea scurt', false, 'Lungimea nu este problema.'],
    ['Nu există niciun risc', false, 'Riscul de scurgere de date există.'],
  ], 'Confidențialitate.'),
  single({ id: '6.4-020' }, 2, 'Care este cea mai bună practică pentru o configurație produsă de un asistent generativ?', [
    ['O tratezi ca pe un draft: o revizuiești, o testezi într-un laborator și o aplici printr-un proces de change cu rollback', true, 'Validarea și testarea sunt obligatorii.'],
    ['O aplici imediat în producție, pentru că AI nu greșește', false, 'Modelele generative pot greși.'],
    ['O ignori întotdeauna', false, 'Poate fi un punct de plecare util.'],
    ['O criptezi și o salvezi fără să o citești', false, 'Nu rezolvă problema corectitudinii.'],
  ], 'Draft → validare → test → change.'),

  // ======================= AI în operațiuni =======================
  single({ id: '6.4-021' }, 2, 'Ce este AIOps?', [
    ['Aplicarea AI/ML pe date operaționale (telemetrie, log-uri, tichete) pentru diagnostic și automatizare', true, 'Reduce zgomotul și accelerează găsirea cauzelor.'],
    ['Un tip de cablu optic', false, 'Nu are legătură cu cablarea.'],
    ['Un protocol de autentificare', false, 'Nu este un protocol de autentificare.'],
    ['Un limbaj de programare', false, 'Nu este un limbaj de programare.'],
  ], 'AIOps = AI pe operațiuni IT.'),
  single({ id: '6.4-022' }, 2, 'Ce înseamnă „human-in-the-loop” în AIOps?', [
    ['Un om aprobă acțiunile cu impact propuse de sistem înainte să schimbe rețeaua', true, 'Autonomia crește treptat, pe măsură ce crește încrederea.'],
    ['Omul este exclus complet din proces', false, 'Este exact opusul.'],
    ['Omul tastează fiecare pachet', false, 'Nu are sens operațional.'],
    ['Un om răspunde la telefon', false, 'Nu este definiția.'],
  ], 'Om în buclă = aprobare umană.'),
  single({ id: '6.4-023' }, 2, 'Care combinație descrie corect fluxul tipic într-un sistem AIOps?', [
    ['Colectează date → analizează (anomalii/corelare) → explică/recomandă → inginerul validează → aplică și măsoară', true, 'Cu feedback către model.'],
    ['Aplică automat → apoi colectează date → apoi întreabă dacă a fost corect', false, 'Ordinea este greșită: validarea precede aplicarea.'],
    ['Șterge toate log-urile → apoi analizează', false, 'Fără date nu există analiză.'],
    ['Cere parola utilizatorilor → apoi configurează', false, 'Nu face parte din flux.'],
  ], 'Date → analiză → recomandare → validare → aplicare.'),
  single({ id: '6.4-024' }, 2, 'Care enunț indică, de obicei, AI predictiv?', [
    ['„Detectează comportamentul anormal al unui dispozitiv față de baseline”', true, 'Detectare/clasificare/prognoză = predictiv.'],
    ['„Scrie un script Python care citește inventarul”', false, 'Generare de cod = generativ.'],
    ['„Rezumă acest log”', false, 'Generare de text = generativ.'],
    ['„Redactează documentația procedurii”', false, 'Generare de text = generativ.'],
  ], 'Detectează/prezice → predictiv.'),
  single({ id: '6.4-025' }, 2, 'Care enunț indică, de obicei, AI generativ?', [
    ['„Scrie un draft de configurație ACL din această descriere”', true, 'Creează conținut nou din limbaj natural.'],
    ['„Estimează probabilitatea defectării unui switch”', false, 'Estimare de probabilitate = predictiv.'],
    ['„Clasifică traficul în categorii de aplicații”', false, 'Clasificare = predictiv.'],
    ['„Detectează un vârf anormal de trafic”', false, 'Anomalii = predictiv.'],
  ], 'Scrie/rezumă/generează → generativ.'),
  single({ id: '6.4-026' }, 3, 'Cum se pot completa AI predictiv și AI generativ într-un flux de operare?', [
    ['Predictivul detectează și localizează problema; generativul o explică în limbaj natural și propune pașii următori, sub aprobare umană', true, 'Fiecare face ce știe mai bine; omul decide.'],
    ['Generativul înlocuiește complet colectarea de date', false, 'Fără date nu există context.'],
    ['Predictivul scrie documentația, generativul detectează anomalii', false, 'Rolurile sunt inversate.'],
    ['Nu se pot combina niciodată', false, 'Se combină frecvent în platformele moderne.'],
  ], 'Predictiv + generativ + om în buclă.'),

  // ======================= Config / verificare =======================
  single({ id: '6.4-027' }, 2, 'Baseline-ul orei 10:00 este 43% ± 1,7. Cu o bandă de 3σ (≈ 37,9–48,1), care dintre valori este o anomalie?', [
    ['52', true, '52 este mult peste 48,1: depășește banda.'],
    ['47', false, '47 este în interiorul benzii.'],
    ['43', false, '43 este exact media.'],
    ['40', false, '40 este în interiorul benzii (peste 37,9).'],
  ], 'Valorile din afara benzii sunt anomalii.'),
  single({ id: '6.4-028' }, 2, 'Care este diferența dintre telemetrie și un show tastat manual?', [
    ['Telemetria trimite automat și continuu date structurate; show dă o imagine la un moment dat, la cerere', true, 'Seria în timp permite modelelor să învețe normalul.'],
    ['Nu există nicio diferență', false, 'Diferența este importantă pentru ML.'],
    ['Telemetria funcționează doar pe cablu coaxial', false, 'Nu depinde de mediu.'],
    ['Show este mereu mai bun pentru ML', false, 'Pentru ML sunt necesare serii de date, nu instantanee ocazionale.'],
  ], 'Telemetrie = date continue structurate.'),
  single({ id: '6.4-029' }, 3, 'Într-un ACL generat de AI, prima regulă este „permit ip any any”, urmată de un deny specific. Ce efect are?', [
    ['Deny-ul nu se aplică niciodată: prima regulă potrivită (permit) prinde tot traficul', true, 'ACL-urile se evaluează de sus în jos; prima potrivire câștigă.'],
    ['Deny-ul are prioritate, pentru că este mai specific', false, 'Specificitatea nu contează; contează ordinea.'],
    ['ACL-ul este respins de router', false, 'Este acceptat, dar nu face ce se dorește.'],
    ['Traficul este criptat', false, 'ACL-ul nu criptează.'],
  ], 'Ordinea regulilor decide.'),
  single({ id: '6.4-030' }, 2, 'O configurație generată de AI cu sub-interfețe nu funcționează deoarece interfața fizică este oprită. Ce lipsește?', [
    ['no shutdown pe interfața fizică', true, 'Sub-interfețele depind de interfața fizică activă.'],
    ['Un al doilea router', false, 'Nu este necesar.'],
    ['Un alt model de AI', false, 'Problema este în configurație, nu în model.'],
    ['Parola enable', false, 'Nu are legătură cu starea interfeței.'],
  ], 'Verifică starea interfețelor (show ip interface brief).'),

  // ======================= Multi =======================
  multi({ id: '6.4-031' }, 2, 'Care sunt exemple de utilizări ale AI predictiv/ML în operațiunile de rețea? (alege toate variantele corecte)', [
    ['Detectarea anomaliilor față de baseline', true, 'Sarcină clasică de ML.'],
    ['Prognoza capacității legăturilor', true, 'Estimare pe date istorice.'],
    ['Clasificarea traficului pe aplicații', true, 'Atribuirea de etichete pe baza tiparelor.'],
    ['Redactarea unui e-mail către echipă', false, 'Aceasta este generare de text (AI generativ).'],
  ], 'Anomalii, prognoză, clasificare.'),
  multi({ id: '6.4-032' }, 2, 'Care sunt riscuri ale AI generativ în operațiunile de rețea? (alege toate variantele corecte)', [
    ['Halucinații: comenzi sau valori inventate', true, 'Răspunsuri convingătoare, dar greșite.'],
    ['Scurgerea datelor sensibile trimise în prompturi', true, 'Datele ies din controlul organizației.'],
    ['Încrederea excesivă și aplicarea fără validare', true, 'Poate duce la erori în producție.'],
    ['Garantarea matematică a corectitudinii oricărui răspuns', false, 'Modelele generative nu oferă o asemenea garanție.'],
  ], 'Halucinații, scurgeri, încredere excesivă.'),
  multi({ id: '6.4-033' }, 3, 'Ce măsuri reduc riscurile folosirii AI în operațiuni? (alege toate variantele corecte)', [
    ['Om în buclă pentru acțiunile cu impact', true, 'Aprobarea umană reduce riscul de erori automate.'],
    ['Testarea configurațiilor generate într-un laborator', true, 'Descoperi defectele înainte de producție.'],
    ['Politici clare despre ce unelte AI și ce date sunt permise', true, 'Reduc riscul de scurgeri și de utilizări nesigure.'],
    ['Eliminarea oricărui jurnal de audit', false, 'Fără audit nu poți investiga ce s-a întâmplat.'],
  ], 'Om în buclă, testare, politici.'),

  // ======================= Match / Order =======================
  match({ id: '6.4-034' }, 2, 'Potrivește sarcina cu tipul de AI.', [
    { left: 'Detectarea unui comportament anormal al unui client', right: 'AI predictiv', why: 'Comparare cu baseline.' },
    { left: 'Rezumarea a 5000 de linii de log', right: 'AI generativ', why: 'Generează text nou.' },
    { left: 'Prognoza utilizării unei legături peste 3 luni', right: 'AI predictiv', why: 'Prognoză pe date istorice.' },
    { left: 'Scrierea unui script Python dintr-o descriere', right: 'AI generativ', why: 'Generează cod.' },
  ], [
    { text: 'Niciunul: sunt sarcini manuale', why: 'Toate pot fi realizate cu AI.' },
    { text: 'Un protocol de rutare', why: 'Nu este un tip de AI.' },
  ], 'Predictiv: detectează/prognozează; generativ: scrie/rezumă.'),
  match({ id: '6.4-035' }, 2, 'Potrivește termenul cu definiția.', [
    { left: 'Date de antrenare', right: 'Exemplele din care învață algoritmul', why: 'Baza modelului.' },
    { left: 'Inferență', right: 'Folosirea modelului antrenat pe date noi', why: 'Etapa de producție.' },
    { left: 'Halucinație', right: 'Răspuns fals, dar convingător, al unui model generativ', why: 'Invenție plauzibilă.' },
    { left: 'Baseline', right: 'Profilul normal al unei metrici', why: 'Referință pentru anomalii.' },
  ], [
    { text: 'O metodă de criptare', why: 'Nu este un termen definit aici.' },
    { text: 'Un tip de interfață a switch-ului', why: 'Nu este un termen definit aici.' },
  ], 'Fiecare termen are un sens precis.'),
  order({ id: '6.4-036' }, 2, 'Ordonează etapele ciclului de viață al unui model ML.', [
    { text: 'Colectarea datelor', why: 'Fără date nu există ce învăța.' },
    { text: 'Pregătirea datelor (curățare, etichetare)', why: 'Datele proaste dau modele proaste.' },
    { text: 'Antrenarea modelului', why: 'Algoritmul învață tiparele.' },
    { text: 'Evaluarea pe date nevăzute', why: 'Verifici dacă modelul generalizează.' },
    { text: 'Inferența în producție și feedback', why: 'Folosești modelul și îl îmbunătățești.' },
  ], 'Date → pregătire → antrenare → evaluare → inferență.'),
  order({ id: '6.4-037' }, 3, 'Ordonează pașii folosirii în siguranță a unei configurații generate de AI.', [
    { text: 'Formulezi un prompt clar (platformă, versiune, cerințe) fără date secrete', why: 'Reduce erorile și protejează datele.' },
    { text: 'Citești și înțelegi configurația primită', why: 'Nu aplici ce nu înțelegi.' },
    { text: 'O testezi într-un laborator', why: 'Găsești defectele înainte de producție.' },
    { text: 'O aplici prin proces de change, cu rollback pregătit', why: 'Limitezi impactul unei greșeli.' },
    { text: 'Verifici rezultatul în rețea', why: 'Confirmi că intenția a fost atinsă.' },
  ], 'Prompt → citire → test → change → verificare.'),

  // ======================= CLI =======================
  cli({ id: '6.4-038' }, 2, 'În global configuration mode: trimite mesajele syslog către serverul 10.0.0.6 (sursă de date pentru analiză).', 'Switch(config)#', 'logging host 10.0.0.6', ['logging host 10.0.0.6', 'logging 10.0.0.6'], [
    { text: 'syslog host 10.0.0.6', why: 'Nu este sintaxa IOS.' },
    { text: 'logging server 10.0.0.6', why: 'Cuvântul este host (sau direct adresa).' },
    { text: 'snmp-server host 10.0.0.6', why: 'Aceasta trimite notificări SNMP, nu mesaje syslog.' },
  ], 'logging host <adresă>.', 'logging …'),
  cli({ id: '6.4-039' }, 2, 'În privileged EXEC: verifică ce reguli ACL au prins trafic (contoare de potriviri).', 'R1#', 'show access-lists', ['show access-lists', 'show ip access-lists', 'sh access-lists'], [
    { text: 'show acl', why: 'Nu este comandă IOS.' },
    { text: 'show running-config interface', why: 'Arată configurația interfeței, nu contoarele regulilor.' },
    { text: 'show ip interface brief', why: 'Arată starea interfețelor, nu contoarele ACL.' },
  ], 'show access-lists arată contoarele (matches).', 'show …'),
  cli({ id: '6.4-040' }, 1, 'În privileged EXEC: verifică rapid starea (up/down) și adresele tuturor interfețelor.', 'R1#', 'show ip interface brief', ['show ip interface brief', 'sh ip int br', 'show ip int brief'], [
    { text: 'show interfaces status', why: 'Aceasta este o comandă de switch pentru porturi, nu rezumatul IP al interfețelor routerului.' },
    { text: 'show ip route', why: 'Arată tabela de rutare, nu starea interfețelor.' },
    { text: 'show interface brief', why: 'Nu este sintaxa IOS clasică; comanda corectă are ip.' },
  ], 'show ip interface brief.', 'show ip interface …'),
];
