import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AnomalyDetector, MlPipeline, PredVsGen } from '../../diagrams/t6_4';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="6.4" title="AI și machine learning în operațiunile de rețea — imaginea de ansamblu" />
      <Summary>
        <p>Rețelele produc enorm de multe date (contoare, log-uri, evenimente), iar oamenii nu pot citi tot. <G id="machine-learning" /> învață tipare din aceste date, iar <G id="artificial-intelligence" /> le folosește ca să ajute la operare. Două familii contează la examen: <b><G id="predictive-ai" /></b> (prezice, detectează, clasifică) și <b><G id="generative-ai" /></b> (produce conținut nou: text, cod, rezumate).</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Explain AI (generative and predictive) and machine learning in network operations</i> (nou în v1.1). Este un obiectiv de <b>explicație</b>: trebuie să știi <i>ce</i> sunt aceste tehnologii, <i>ce</i> pot face într-o rețea, <i>cum</i> diferă și <i>ce riscuri</i> aduc. Nu se cer algoritmi, matematică sau programare.</p>
        <Table head={['Întrebare', 'Răspunsul pe scurt', 'Unde în lecție']} hlCol={0} rows={[
          ['Ce este ML și cum „învață”?', 'Un algoritm găsește tipare în date și produce un model folosit pe date noi', 'Secțiunea „Bazele ML”'],
          ['Ce este AI predictiv?', 'Detectează anomalii, prognozează, clasifică, estimează probabilități', 'Secțiunea „AI predictiv”'],
          ['Ce este AI generativ?', 'Creează conținut nou (text, cod, configurații, rezumate), de obicei cu modele de limbaj', 'Secțiunea „AI generativ”'],
          ['Cum se folosesc în operațiuni, în siguranță?', 'Date bune, validare, om în buclă, securitate și confidențialitate', 'Secțiunea „AI în operațiuni”'],
        ]} />
        <Analogy>Un medic cu doi asistenți: <b>asistentul predictiv</b> citește analizele și spune „valorile tale sunt neobișnuite față de populație” sau „riscul de complicații este X%”; <b>asistentul generativ</b> redactează scrisoarea medicală și rezumatul fișei. Amândoi ajută, dar decizia și semnătura rămân ale medicului: îi verifică.</Analogy>
        <Callout kind="info" title="Ce cere examenul aici">
          Nu memora produse sau cifre. Memorează diferența predictiv/generativ, exemplele de utilizare în rețea, fluxul datelor (antrenare → model → inferență), importanța datelor de calitate și <b>riscurile</b> (halucinații, date sensibile, validare lipsă).
        </Callout>
      </Detailed>
      <Traps items={[
        <>ML este o <b>parte</b> a AI, nu sinonimul lui: AI este domeniul larg, ML este metoda prin care sistemele învață din date.</>,
        <>Un model nu „înțelege” rețeaua: potrivește tipare. Rezultatele trebuie verificate de un om competent.</>,
        <>AI generativ și AI predictiv rezolvă probleme diferite; nu sunt interșanjabile.</>,
      ]} />
      <InlineQuiz ids={['6.4-001', '6.4-002', '6.4-003']} />
    </section>
  );
}

/* ======================================================================
   1. Bazele ML
   ====================================================================== */
export function BasicsSection() {
  return (
    <section id="basics" className="section">
      <SectionHead id="basics" code="6.4" title="Bazele machine learning-ului: date, model, antrenare, inferență" />
      <Summary>
        <p>În programarea clasică scrii reguli. În ML dai <b>exemple</b> (<G id="training-data" />) și algoritmul găsește singur regulile, sub forma unui <G id="ml-model" />. Apoi folosești modelul pe date noi (<G id="ml-inference" />). Calitatea modelului depinde în primul rând de calitatea datelor.</p>
      </Summary>
      <Detailed title="1. AI, ML și deep learning — cum se leagă">
        <Table head={['Termen', 'Ce înseamnă', 'Exemplu în rețea']} hlCol={0} rows={[
          [<G id="artificial-intelligence" />, 'Sisteme care îndeplinesc sarcini ce cer, în mod obișnuit, inteligență umană', 'Un asistent care recomandă cauza unei probleme'],
          [<G id="machine-learning" />, 'Metodă prin care sistemele învață tipare din date, fără reguli scrise explicit', 'Model care învață traficul „normal” al unei legături'],
          ['Deep learning', 'ML cu rețele neuronale cu multe straturi; bun pentru text, imagini, semnale complexe', 'Modele de limbaj mari (LLM) care scriu text'],
        ]} />
        <p>Imaginea cu cercuri concentrice: AI ⊃ ML ⊃ deep learning. Un LLM este o formă de deep learning, deci și ML, deci și AI.</p>
      </Detailed>
      <Detailed title="2. Cum „învață” un model — interactiv">
        <Figure caption="Interactiv: parcurge etapele unui model ML, de la date la acțiune și feedback.">
          <MlPipeline />
        </Figure>
        <h4>Antrenare vs inferență</h4>
        <ul>
          <li><b>Antrenarea</b> este costisitoare și se face rar: algoritmul se uită la multe exemple și își ajustează parametrii.</li>
          <li><b>Inferența</b> este ieftină și continuă: modelul deja antrenat primește o măsurătoare nouă și dă un rezultat.</li>
        </ul>
        <h4>Tipuri de învățare, la nivel intuitiv</h4>
        <Table head={['Tip', 'Cum învață', 'Exemplu în rețea']} hlCol={0} rows={[
          [<G id="supervised-learning" />, 'Din exemple etichetate („acesta a fost un incident”, „acesta a fost normal”)', 'Clasificarea tipului de trafic; prezicerea defecțiunilor din istoric etichetat'],
          [<G id="unsupervised-learning" />, 'Fără etichete: găsește singur grupuri sau abateri', 'Gruparea clienților după comportament; detectarea unor tipare neobișnuite'],
          ['Învățare prin recompensă', 'Prin încercări și un semnal de recompensă', 'Optimizarea unei politici; rar la nivel CCNA'],
        ]} />
      </Detailed>
      <Detailed title="3. De ce contează datele">
        <ul>
          <li><b>Calitate</b>: date greșite, incomplete sau zgomotoase produc modele greșite („garbage in, garbage out”).</li>
          <li><b>Reprezentativitate</b>: un model antrenat doar pe vara trecută poate greși iarna; un model antrenat pe o singură clădire poate greși în alta.</li>
          <li><b>Cantitate</b>: tiparele subtile cer multe exemple.</li>
          <li><b>Actualitate</b>: rețeaua se schimbă; <G id="model-drift" /> înseamnă că modelul devine mai puțin precis pe măsură ce datele noi diferă de cele de antrenare, deci trebuie reantrenat.</li>
          <li><b>Confidențialitate</b>: datele de rețea pot conține identificatori de utilizatori; trebuie protejate (anonimizare, acces controlat).</li>
        </ul>
        <p>De aceea <G id="network-telemetry" /> (6.1) este combustibilul AI-ului în rețea: fără date structurate și continue, nu există ce să învețe un model.</p>
      </Detailed>
      <Traps items={[
        <>Antrenarea se face pe date <b>istorice</b>; inferența pe date <b>noi</b>. Un model nu învață „în timp real”, decât dacă este reantrenat.</>,
        <>„Mai multe date” nu înseamnă automat „mai bine” dacă datele sunt de proastă calitate.</>,
        <>Un model foarte bun pe datele de antrenare poate fi slab pe date noi (supraadaptare): de aceea se testează pe date nevăzute.</>,
      ]} />
      <InlineQuiz ids={['6.4-004', '6.4-005', '6.4-006', '6.4-007', '6.4-008']} />
    </section>
  );
}

/* ======================================================================
   2. AI predictiv
   ====================================================================== */
export function PredictiveSection() {
  return (
    <section id="predictive" className="section">
      <SectionHead id="predictive" code="6.4" title="AI predictiv în rețea: baseline, anomalii, prognoze" />
      <Summary>
        <p>AI predictiv (sau analitic) <b>prezice sau recunoaște</b>: învață cum arată „normal” (<G id="network-baseline" />) și semnalează abaterile (<G id="anomaly-detection" />), estimează evoluția unor valori (prognoză de capacitate), clasifică traficul sau sugerează cauza probabilă a unei probleme.</p>
      </Summary>
      <Detailed title="1. Ce probleme rezolvă">
        <Table head={['Sarcină', 'Întrebarea', 'Exemplu în rețea']} hlCol={0} rows={[
          ['Detectarea anomaliilor', 'Este comportamentul acesta diferit de normal?', 'Un client Wi-Fi cu rată anormală de reconectări; un vârf neobișnuit de trafic'],
          ['Prognoză / capacitate', 'Ce valoare va avea metrica în viitor?', 'Utilizarea unei legături peste 3 luni; planificarea capacității'],
          ['Clasificare', 'Ce tip este acesta?', 'Identificarea aplicației după tiparul de trafic; clasificarea dispozitivelor IoT'],
          ['Estimarea riscului', 'Cât de probabil este un eveniment?', 'Probabilitatea defectării unui echipament pe baza erorilor de interfață'],
          ['Corelare și cauză probabilă', 'Ce evenimente aparțin aceleiași probleme?', 'Grupează 200 de alarme într-un singur incident cu o cauză sugerată'],
        ]} />
      </Detailed>
      <Detailed title="2. Baseline și anomalii — interactiv">
        <p>Un baseline este profilul „normal” al unei metrici (de exemplu o utilizare mai mare în timpul zilei decât noaptea). Un model detectează punctele care ies din banda așteptată. Mută cursorul de sensibilitate și urmărește compromisul dintre alarme false și anomalii ratate.</p>
        <Figure caption="Interactiv: banda de normalitate (baseline ± kσ) și anomaliile prinse sau ratate pentru o legătură simulată.">
          <AnomalyDetector />
        </Figure>
        <Callout kind="tip" title="Compromisul alarme false vs anomalii ratate">
          O sensibilitate mare produce multe alarme false (<b>alert fatigue</b>: oamenii încep să le ignore), iar una mică lasă să treacă probleme reale. De aceea sistemele reale combină mai multe semnale și învață din feedback-ul inginerilor.
        </Callout>
      </Detailed>
      <Detailed title="3. Unde apare în produsele Cisco (recunoaștere)">
        <ul>
          <li><b>Assurance în Catalyst Center</b>: folosește analiză bazată pe ML pentru baseline-uri, detectarea anomaliilor și sugestii de remediere (de exemplu funcțiile de „AI Network Analytics”).</li>
          <li><b>Wireless</b>: algoritmi care ajustează canalele și puterea AP-urilor pe baza măsurătorilor radio.</li>
          <li><b>Securitate</b>: analiza comportamentului traficului ca să semnaleze activități suspecte.</li>
        </ul>
        <p>Detaliile exacte diferă de la o versiune la alta; pentru examen contează <b>ideea</b>: telemetrie → model → recomandare/alertă, cu om în buclă.</p>
      </Detailed>
      <DeepDive title="Cum „arată” un model simplu de baseline">
        <p>Cea mai simplă versiune: pentru fiecare oră a zilei calculezi media și abaterea standard a unei metrici pe ultimele săptămâni, apoi marchezi orice valoare nouă care iese cu mai mult de k abateri standard din medie. Modelele reale adaugă sezonalitate (zile lucrătoare vs weekend), tendință, corelații între metrici și învață automat pragurile, dar logica de bază este aceeași: <i>compară ce vezi acum cu ce era normal</i>.</p>
      </DeepDive>
      <Traps items={[
        <>„Anomalie” nu înseamnă automat „problemă”: un vârf de trafic poate fi un eveniment legitim. Contextul decide.</>,
        <>AI predictiv nu produce text liber sau cod: produce <b>valori, etichete, scoruri, alarme</b>.</>,
        <>Un baseline vechi devine inexact când rețeaua se schimbă (model drift).</>,
      ]} />
      <InlineQuiz ids={['6.4-009', '6.4-010', '6.4-011', '6.4-012', '6.4-013', '6.4-014']} />
    </section>
  );
}

/* ======================================================================
   3. AI generativ
   ====================================================================== */
export function GenerativeSection() {
  return (
    <section id="generative" className="section">
      <SectionHead id="generative" code="6.4" title="AI generativ în rețea: LLM, prompturi, utilizări și limite" />
      <Summary>
        <p>AI generativ <b>creează conținut nou</b>. În operațiunile de rețea, cel mai des este un <G id="large-language-model" /> (LLM) căruia îi dai un <G id="prompt" /> (cerere în limbaj natural) și care întoarce text: explicații, rezumate, scripturi, drafturi de configurație, pași de depanare. Utilitatea este mare, dar rezultatele pot fi greșite, deci se verifică.</p>
      </Summary>
      <Detailed title="1. Ce este un model de limbaj mare (LLM)">
        <p>Un LLM este un model antrenat pe cantități uriașe de text. Învață tiparele limbii și ale cunoștințelor din text, apoi, primind un prompt, <b>generează cel mai probabil continuare</b>. Nu „caută” un răspuns într-o bază de date și nu rulează comenzile pe care le scrie: <b>produce text plauzibil</b>, care poate fi corect sau nu.</p>
        <Table head={['Concept', 'Ce înseamnă']} hlCol={0} rows={[
          [<G id="prompt" />, 'Instrucțiunea și contextul pe care le dai modelului; un prompt clar și specific dă rezultate mai bune'],
          ['Context', 'Informațiile pe care i le dai în cerere (topologie, log-uri, cerințe) ca să răspundă relevant'],
          [<G id="ai-hallucination" />, 'Răspuns fluent, încrezător, dar fals sau inventat (comenzi inexistente, valori greșite)'],
          ['Date de antrenare', 'Textul de pe care a învățat modelul; poate fi depășit sau incomplet pentru versiunea ta de IOS/XE'],
        ]} />
      </Detailed>
      <Detailed title="2. Ce poți face util cu AI generativ în rețea">
        <ul>
          <li><b>Explicații</b>: „explică acest output de show ip ospf neighbor”, util pentru învățare și onboarding.</li>
          <li><b>Rezumate</b>: transformă mii de linii de log-uri într-un rezumat cu cauzele probabile.</li>
          <li><b>Cod și șabloane</b>: schițe de scripturi Python, playbook-uri, șabloane Jinja2 (6.1, 6.6).</li>
          <li><b>Configurații draft</b>: o primă versiune pentru o cerință, pe care o verifici și o testezi.</li>
          <li><b>Documentație și rapoarte</b>: descrieri, diagrame în text, proceduri.</li>
          <li><b>Asistent conversațional</b>: „de ce nu se conectează clientul?” → lista pașilor de verificat.</li>
        </ul>
      </Detailed>
      <Detailed title="3. Riscuri și limite">
        <Table head={['Risc', 'Ce se poate întâmpla', 'Cum îl reduci']} hlCol={0} rows={[
          ['Halucinații', 'Comenzi inexistente, parametri inventați, explicații greșite', 'Verifici în documentația oficială; testezi în laborator'],
          ['Cunoștințe depășite/ne-specifice', 'Sintaxă dintr-o altă versiune sau platformă', 'Specifici platforma și versiunea în prompt; validezi'],
          ['Scurgeri de date sensibile', 'Parole, topologii, IP-uri interne trimise unui serviciu extern', 'Nu pui secrete în prompturi; folosești soluții aprobate de companie'],
          ['Răspuns nedeterminist', 'Aceeași întrebare poate da răspunsuri diferite', 'Nu te bazezi pe o singură ieșire; revizuiești'],
          ['Încredere excesivă', 'Aplici o configurație fără s-o înțelegi', 'Om în buclă, proces de change, rollback'],
          ['Manipulare prin conținut (prompt injection)', 'Text din log-uri sau pagini web care „instruiește” modelul să facă altceva', 'Tratezi conținutul extern ca date, nu ca instrucțiuni; limitezi permisiunile'],
        ]} />
        <Callout kind="warn" title="Regula de aur">
          Orice configurație sau script produs de AI este un <b>draft</b>. Îl citești, îl înțelegi, îl testezi într-un mediu sigur (laborator) și îl aplici printr-un proces de schimbare cu rollback — la fel ca pe codul unui coleg junior.
        </Callout>
      </Detailed>
      <DeepDive title="Generativ + predictiv împreună">
        <p>Cele două se completează: un model predictiv detectează anomalia și identifică echipamentele implicate, iar un model generativ explică situația în limbaj natural, rezumă istoricul și propune pașii următori. Fluxul rămâne cu <G id="human-in-the-loop" />: omul aprobă acțiunile care schimbă rețeaua.</p>
      </DeepDive>
      <Traps items={[
        <>AI generativ <b>produce</b> conținut; AI predictiv <b>evaluează/prezice</b>. Un LLM nu garantează corectitudinea.</>,
        <>Un răspuns formulat cu siguranță nu este neapărat corect: halucinațiile arată convingător.</>,
        <>Nu include în prompturi parole, chei sau date confidențiale ale rețelei.</>,
      ]} />
      <InlineQuiz ids={['6.4-015', '6.4-016', '6.4-017', '6.4-018', '6.4-019', '6.4-020']} />
    </section>
  );
}

/* ======================================================================
   4. AI în operațiuni
   ====================================================================== */
export function OpsSection() {
  return (
    <section id="ops" className="section">
      <SectionHead id="ops" code="6.4" title="AI în operațiunile de rețea: AIOps, comparație și bune practici" />
      <Summary>
        <p><G id="aiops" /> aplică analiza AI/ML datelor operaționale (telemetrie, log-uri, tichete) ca să reducă zgomotul, să găsească mai repede cauza și să automatizeze remedieri. Rolul inginerului rămâne esențial: setează obiectivele, validează rezultatele și decide ce se aplică.</p>
      </Summary>
      <Detailed title="1. Comparație: predictiv vs generativ">
        <Table head={['Aspect', 'AI predictiv', 'AI generativ']} hlCol={0} rows={[
          ['Ce produce', 'Predicții, scoruri, etichete, alarme', 'Conținut nou: text, cod, configurații, rezumate'],
          ['Intrare tipică', 'Date structurate: metrici, telemetrie, contoare', 'Prompt în limbaj natural + context'],
          ['Exemple în rețea', 'Detectare de anomalii, prognoză de capacitate, clasificare de trafic', 'Rezumate de log-uri, drafturi de configurație, scripturi, asistent conversațional'],
          ['Cum se verifică', 'Metrici (precizie, alarme false/ratate) pe date nevăzute', 'Revizuire umană, testare, comparare cu documentația'],
          ['Risc caracteristic', 'Alarme false/ratate, model drift', 'Halucinații, scurgeri de date, încredere excesivă'],
        ]} />
        <Figure caption="Exercițiu interactiv: clasifică opt scenarii ca „predictiv/analitic” sau „generativ”.">
          <PredVsGen />
        </Figure>
      </Detailed>
      <Detailed title="2. Fluxul AIOps">
        <ol>
          <li><b>Colectează</b> telemetrie, log-uri, evenimente, tichete (6.1).</li>
          <li><b>Analizează</b>: baseline, anomalii, corelare între evenimente (predictiv).</li>
          <li><b>Explică</b>: rezumat în limbaj natural, cauze probabile, recomandări (generativ).</li>
          <li><b>Propune</b>: o acțiune sau un draft de configurație.</li>
          <li><b>Validează</b>: inginerul verifică, testează, aprobă.</li>
          <li><b>Aplică</b> prin automatizare (6.1, 6.6) sau controller (6.2–6.3) și <b>măsoară</b> efectul (feedback pentru model).</li>
        </ol>
      </Detailed>
      <Detailed title="3. Bune practici pentru folosirea AI în operațiuni">
        <Table head={['Practică', 'De ce']} hlCol={0} rows={[
          ['Om în buclă (human-in-the-loop)', 'Acțiunile cu impact se aprobă de un inginer, mai ales la început'],
          ['Validare și testare', 'Config AI testată în laborator înainte de producție'],
          ['Date de calitate și actuale', 'Modelele sunt la fel de bune ca datele lor; evită driftul'],
          ['Protecția datelor', 'Fără secrete în prompturi; anonimizarea datelor de utilizatori'],
          ['Transparență și explicații', 'Să poți spune de ce a ajuns sistemul la o concluzie'],
          ['Măsurarea rezultatelor', 'Urmărești alarmele false, timpul de rezolvare, greșelile prinse'],
          ['Politici interne', 'Reguli clare despre ce unelte AI se pot folosi și cu ce date'],
        ]} />
        <Callout kind="exam" title="Cum cade la examen">
          Întrebări tipice: „Care tehnologie detectează anomalii față de baseline?” (ML/AI predictiv); „Care generează un rezumat sau cod?” (AI generativ); „Un LLM produce o comandă care nu există; cum se numește?” (halucinație); „Ce trebuie făcut cu o configurație generată de AI?” (validare și testare înainte de aplicare); „Ce alimentează modelele?” (date/telemetrie).
        </Callout>
      </Detailed>
      <Traps items={[
        <>AIOps ajută la <b>reducerea zgomotului și accelerarea diagnosticului</b>; nu elimină inginerii și nu garantează fiecare diagnostic.</>,
        <>Generativ ≠ predictiv: dacă enunțul cere „prezice”, „detectează”, „clasifică” → predictiv; dacă cere „scrie”, „rezumă”, „generează” → generativ.</>,
        <>Un model nu este mai bun decât datele pe care a fost antrenat și nu e neutru: datele părtinitoare dau rezultate părtinitoare.</>,
      ]} />
      <InlineQuiz ids={['6.4-021', '6.4-022', '6.4-023', '6.4-024', '6.4-025', '6.4-026']} />
    </section>
  );
}
