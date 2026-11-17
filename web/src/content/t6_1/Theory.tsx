import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AutomationCalc, AutomationLoop, PlanesMap } from '../../diagrams/t6_1';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="6.1" title="Cum schimbă automatizarea managementul rețelei — imaginea de ansamblu" />
      <Summary>
        <p>Până acum ai configurat echipamentele <b>unul câte unul</b>, tastând comenzi în <G id="cli" />. Într-o companie cu sute de switch-uri și routere, metoda aceasta e lentă, scumpă și predispusă la greșeli. <b><G id="network-automation" /></b> înseamnă că lași software-ul să facă munca repetitivă: configurează, verifică și corectează echipamentele după reguli scrise o singură dată.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 6.1 este <i>Explain how automation impacts network management</i>. Nu cere să scrii cod: cere să <b>înțelegi ce se schimbă</b> în munca unui inginer de rețea, ce câștigi, ce riști și ce piese apar (inventar, șabloane, API-uri, telemetrie). În domeniul 6 acesta este „de ce”; următoarele topicuri sunt „cum”: controller-e (6.2–6.3), AI/ML (6.4), API-uri REST (6.5), instrumente ca Ansible și Terraform (6.6) și formatul JSON (6.7).</p>
        <Table head={['Întrebare', 'Răspunsul pe scurt', 'Unde în lecție']} hlCol={0} rows={[
          ['De ce e greu managementul manual?', 'Scară, repetitivitate, greșeli umane, configurații care se îndepărtează între ele', 'Secțiunea „Problema”'],
          ['Ce înseamnă automatizare, concret?', 'Intenție descrisă o dată → șablon + variabile → aplicare prin SSH/NETCONF/API → verificare', 'Secțiunea „Cum funcționează”'],
          ['Ce planuri ale rețelei sunt afectate?', 'Intri prin management plane; modifici control plane și data plane', 'Secțiunea „Cum funcționează”'],
          ['Ce câștigi și ce riști?', 'Viteză, consecvență, conformitate — dar și erori propagate rapid și nevoia de abilități noi', 'Secțiunea „Impact”'],
        ]} />
        <Analogy>O bucătărie de restaurant: dacă fiecare cuoc face sosul „din ochi”, gustul diferă de la un fel la altul. Cu o <b>rețetă standard</b> (șablonul), ingrediente măsurate (variabilele) și un controlor de calitate (verificarea), toate porțiile ies la fel — iar rețeta, odată corectată, se corectează pentru toată bucătăria. Dar dacă rețeta are o greșeală, toate porțiile vor avea greșeala!</Analogy>
        <Callout kind="info" title="Ce NU cere examenul la 6.1">
          Nu trebuie să scrii Python, YAML sau playbook-uri la examen. Trebuie să explici <b>efectul automatizării</b> (beneficii, riscuri, schimbarea rolului) și să recunoști componentele, la nivel de concept.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Automatizarea nu elimină <b>cunoașterea rețelelor</b>: trebuie să știi ce vrei să obții (VLAN-uri, rutare, ACL) ca să scrii intenția corectă.</>,
        <>Automatizarea nu înseamnă automat „fără greșeli”: o greșeală din șablon se <b>propagă</b> la toate echipamentele, repede.</>,
        <>Automatizarea nu e același lucru cu un controller SDN (6.2–6.3): poți automatiza și rețele „clasice”, cu scripturi.</>,
      ]} />
      <InlineQuiz ids={['6.1-001', '6.1-002', '6.1-003']} />
    </section>
  );
}

/* ======================================================================
   1. Problema: managementul manual
   ====================================================================== */
export function ProblemSection() {
  return (
    <section id="problem" className="section">
      <SectionHead id="problem" code="6.1" title="Problema: managementul manual, device cu device" />
      <Summary>
        <p>În modelul tradițional un inginer se conectează la fiecare echipament (SSH sau console), tastează comenzi și verifică rezultatul cu ochii. Merge bine pentru 5 echipamente, dar nu pentru 500: costul crește cu numărul de echipamente, iar calitatea scade cu oboseala și cu graba.</p>
      </Summary>
      <Detailed title="1. Cum arată o schimbare manuală">
        <ol>
          <li>Deschizi o sesiune SSH către echipamentul 1, intri în <code>configure terminal</code>, tastezi comenzile.</li>
          <li>Verifici cu <code>show running-config</code> sau <code>show vlan brief</code>; salvezi cu <code>copy running-config startup-config</code>.</li>
          <li>Repeți pentru echipamentul 2, 3, … N — adesea copiind comenzile dintr-un document, cu modificări mici la fiecare.</li>
          <li>Documentezi (uneori) ce ai făcut într-un tabel sau într-un ticket.</li>
        </ol>
        <p>Fiecare pas e simplu; <b>problema e repetiția</b>. Cu cât repeți mai mult, cu atât crește probabilitatea unei greșeli mici: un VLAN uitat, o mască greșită, un echipament sărit, o comandă salvată doar în running-config.</p>
      </Detailed>
      <Detailed title="2. Cele patru dureri ale managementului manual">
        <Table head={['Durere', 'Ce înseamnă', 'Exemplu']} hlCol={0} rows={[
          ['Scară', 'Timpul crește liniar cu numărul de echipamente', '200 de switch-uri × 6 minute ≈ 20 de ore de muncă doar pentru o schimbare'],
          ['Greșeli umane', 'Tastare, copy-paste, echipament omis', 'Serverul NTP configurat greșit pe 3 din 200 de switch-uri; log-urile nu mai au ora corectă'],
          ['Inconsistență', 'Echipamentele ajung să difere: fiecare are „mici excepții”', 'Șase versiuni diferite ale ACL-ului „standard” de management'],
          ['Lipsă de vizibilitate', 'Nu știi ce rulează efectiv pe fiecare echipament', 'Un auditor cere „toate echipamentele cu Telnet activ” și nu există un răspuns rapid']
        ]} />
        <Callout kind="info" title="Deriva de configurație (configuration drift)">
          <G id="configuration-drift" /> este distanța treptată dintre configurația <b>dorită</b> și cea <b>reală</b>: cineva a făcut o modificare de urgență „doar pe acest switch”, nu a documentat-o, iar acum echipamentul se comportă diferit de celelalte. Drift-ul este una dintre cele mai frecvente cauze ale incidentelor greu de depanat.
        </Callout>
      </Detailed>
      <Detailed title="3. De ce a devenit urgentă automatizarea">
        <ul>
          <li><b>Rețele mai mari și mai dinamice</b>: Wi-Fi, IoT, filiale, cloud. Se adaugă și se mută echipamente și servicii mult mai des decât înainte.</li>
          <li><b>Cerințe de securitate și conformitate</b>: când apare o vulnerabilitate sau o regulă nouă, trebuie să o aplici peste tot, repede și demonstrabil.</li>
          <li><b>Viteza afacerii</b>: o aplicație nouă nu mai poate aștepta zile pentru VLAN-uri, ACL-uri și QoS.</li>
          <li><b>Lipsa de oameni</b>: același număr de ingineri trebuie să administreze o rețea mult mai mare.</li>
        </ul>
        <p>Din aceste motive, industria a mutat accentul de la „configurez echipamentul” la „<b>descriu ce vreau</b> și lasă un sistem să aducă rețeaua acolo”.</p>
      </Detailed>
      <Detailed title="4. Calculator: când merită automatizarea?">
        <Figure caption="Interactiv: modifică numărul de echipamente, timpul manual, rata de greșeli și efortul de automatizare; vezi când se amortizează automatizarea.">
          <AutomationCalc />
        </Figure>
        <p>Observă două lucruri: (1) automatizarea are un <b>cost fix</b> la început (inventar, șablon, testare), (2) după aceea fiecare echipament în plus costă aproape zero. De aceea câștigul crește cu scara și cu <b>frecvența</b> modificărilor.</p>
      </Detailed>
      <Traps items={[
        <>Problema nu e că inginerii „greșesc”, ci că <b>repetiția manuală</b> garantează statistic greșeli la scară mare.</>,
        <>Configurația „care rulează” (running-config) poate diferi de cea „salvată” (startup-config) și de cea „dorită”: automatizarea compară toate trei.</>,
        <>„Funcționează pe echipamentul meu” nu demonstrează consecvență în toată rețeaua.</>,
      ]} />
      <InlineQuiz ids={['6.1-004', '6.1-005', '6.1-006', '6.1-007']} />
    </section>
  );
}

/* ======================================================================
   2. Cum funcționează automatizarea
   ====================================================================== */
export function HowSection() {
  return (
    <section id="how" className="section">
      <SectionHead id="how" code="6.1" title="Cum funcționează automatizarea, pas cu pas" />
      <Summary>
        <p>Automatizarea nu e un produs unic, ci un <b>lanț de piese</b>: o sursă de adevăr (inventar + variabile), șabloane, un mecanism de transport (SSH, NETCONF, REST), validări înainte și după, și telemetrie. Totul intră în rețea prin <b>management plane</b>.</p>
      </Summary>
      <Detailed title="1. Planurile unui echipament și unde intră automatizarea">
        <p>Fiecare router sau switch are trei „planuri”. Ai întâlnit deja <G id="control-plane" /> și <G id="data-plane" />; al treilea este <G id="management-plane" />: tot ce ține de administrarea echipamentului însuși (SSH, SNMP, syslog, NTP, API-uri). Automatizarea folosește <b>planul de management</b> ca ușă de intrare, iar prin el schimbă comportamentul celorlalte două.</p>
        <Figure caption="Interactiv: alege planul și vezi exemplele și rolul automatizării.">
          <PlanesMap />
        </Figure>
      </Detailed>
      <Detailed title="2. Treptele automatizării">
        <p>Nu sari direct la „rețea autonomă”. Majoritatea echipelor urcă pe trepte:</p>
        <Table head={['Treapta', 'Ce faci', 'Exemplu', 'Câștig']} hlCol={0} rows={[
          ['0. Manual', 'CLI pe fiecare echipament', 'Copiezi comenzi dintr-un document', '—'],
          ['1. Scripturi', 'Un script rulează aceleași comenzi pe o listă de echipamente', 'Un script SSH care adaugă un VLAN pe 40 de switch-uri', 'Viteză'],
          ['2. Șabloane + variabile', 'Aceeași configurație, valori diferite per echipament', 'Un șablon NTP/syslog cu IP-uri din inventar', 'Consecvență'],
          ['3. Instrumente declarative / IaC', 'Descrii starea dorită; instrumentul calculează diferența și o aplică', 'Playbook Ansible, plan Terraform (6.6)', 'Idempotență, repetabilitate'],
          ['4. Controller / intent-based', 'Spui intenția la nivel de politică; controller-ul o traduce pentru fiecare echipament', 'Catalyst Center (6.2–6.3)', 'Vizibilitate și politică centralizate'],
          ['5. Buclă închisă', 'Telemetria detectează abateri și sistemul reacționează (cu aprobare sau automat)', 'Reconfigurare după o alarmă', 'Rețea care se autocorectează'],
        ]} />
      </Detailed>
      <Detailed title="3. Piesele unui flux automatizat">
        <p>Un flux obișnuit are șase etape. Parcurge-le interactiv și bifează „eroare în șablon” ca să vezi de ce verificarea și lotul-pilot contează:</p>
        <Figure caption="Interactiv: bucla de automatizare — de la intenție la verificare și remediere.">
          <AutomationLoop />
        </Figure>
        <h4>Sursa de adevăr (<G id="source-of-truth" />)</h4>
        <p>Un singur loc unde este scris ce trebuie să existe: lista echipamentelor, IP-urile, VLAN-urile, serverele NTP/syslog. Când sursa de adevăr se schimbă, rețeaua trebuie să o urmeze — nu invers. De obicei se păstrează în fișiere text (YAML, JSON, CSV) într-un sistem de versionare (Git), ca să vezi cine a schimbat ce și când și să poți reveni.</p>
        <h4>Șabloane și variabile</h4>
        <p>Un șablon este o configurație cu „găuri” pentru valori: <code>hostname {'{{ hostname }}'}</code>, <code>ntp server {'{{ ntp_server }}'}</code>. Variabilele (per echipament sau per grup) completează găurile. Așa 200 de configurații diferite vin dintr-un singur șablon + o listă.</p>
        <h4>Transport: cum ajung comenzile pe echipament</h4>
        <ul>
          <li><b><G id="ssh" /> + CLI</b>: scriptul „tastează” comenzile. Funcționează pe aproape orice echipament, dar output-ul este text neformatat — greu de interpretat sigur.</li>
          <li><b>NETCONF / RESTCONF</b> (6.3): interfețe <i>programatice</i> cu date structurate (XML sau JSON) descrise de modele. Mai fiabile pentru automatizare.</li>
          <li><b>API REST</b> (6.5): cereri HTTP(S) către echipament sau, mai des, către un controller.</li>
          <li><b><G id="snmp" /></b>: folosit mai ales pentru citire/monitorizare (4.4).</li>
        </ul>
        <h4>Idempotență</h4>
        <p>O operație este <G id="idempotent" /> dacă aplicarea ei de mai multe ori dă același rezultat ca o singură aplicare. Instrumentele declarative caută această proprietate: „asigură-te că VLAN 20 există” poate rula de zece ori, iar rezultatul rămâne un singur VLAN 20. Un script naiv de tipul „adaugă linia X” poate dubla sau strica configurația la a doua rulare.</p>
        <h4>Telemetrie și verificare</h4>
        <p><G id="network-telemetry" /> este trimiterea continuă de date măsurate de pe echipamente (stări de interfețe, contoare, rute, evenimente) către un sistem de analiză. Fără ea, automatizarea „împinge” configurația, dar nu știe dacă a funcționat. Verificarea automată compară starea reală cu intenția și declanșează alerte sau remedieri.</p>
        <h4>Provizionare fără atingere (<G id="zero-touch-provisioning" />)</h4>
        <p>Un echipament nou, scos din cutie și conectat la rețea, își găsește singur serverul de configurare (de exemplu prin DHCP) și primește configurația și imaginea software potrivită, fără ca cineva să se conecteze cu cablul de consolă. Este una dintre cele mai vizibile aplicații ale automatizării în filiale mari și mici.</p>
      </Detailed>
      <DeepDive title="De la script la „infrastructure as code” și buclă închisă">
        <p><G id="infrastructure-as-code" /> tratează configurația rețelei ca pe cod: o scrii în fișiere, o versionezi, o revizuiești (review) și o testezi înainte să o aplici. Beneficiul principal este <b>reproductibilitatea</b>: poți reconstrui rețeaua (sau un laborator) din aceleași fișiere. La nivelul următor, <G id="closed-loop-automation" /> leagă telemetria de acțiune: un eveniment (de exemplu o legătură cu pierderi mari) declanșează automat o politică (mută traficul, deschide un tichet, repornește un serviciu). În practică, mulți clienți preferă ca ultimul pas să fie <i>aprobat de om</i>, cel puțin până când au încredere în sistem.</p>
      </DeepDive>
      <Traps items={[
        <>Automatizarea intră prin <b>management plane</b>; nu înlocuiește OSPF, STP etc. (control plane) și nu mută pachetele (data plane).</>,
        <>Un șablon bun fără <b>sursă de adevăr</b> corectă produce rapid configurații greșite: „garbage in, garbage out”.</>,
        <>Idempotent ≠ „rulează o singură dată”: înseamnă că poate rula de câte ori vrei cu același rezultat.</>,
        <>Telemetria (date măsurate, trimise continuu) nu e același lucru cu un singur <code>show</code> făcut manual.</>,
      ]} />
      <InlineQuiz ids={['6.1-008', '6.1-009', '6.1-010', '6.1-011', '6.1-012', '6.1-014']} />
    </section>
  );
}

/* ======================================================================
   3. Impactul: beneficii, riscuri, rolul inginerului
   ====================================================================== */
export function ImpactSection() {
  return (
    <section id="impact" className="section">
      <SectionHead id="impact" code="6.1" title="Impactul asupra managementului: beneficii, riscuri, schimbarea rolului" />
      <Summary>
        <p>Automatizarea aduce <b>viteză, consecvență, conformitate și vizibilitate</b>, dar și riscuri noi: greșelile se propagă repede, apar dependențe de instrumente și de abilități (versionare, API-uri). Inginerul trece de la „operator de CLI” la cel care <b>proiectează, validează și supraveghează</b> sisteme care configurează rețeaua.</p>
      </Summary>
      <Detailed title="1. Beneficii">
        <Table head={['Beneficiu', 'De ce apare', 'Exemplu']} hlCol={0} rows={[
          ['Viteză', 'Aceeași acțiune pe zeci de echipamente în paralel', 'O politică de securitate nouă ajunge pe toate switch-urile în minute, nu în zile'],
          ['Consecvență', 'Un singur șablon → configurații uniforme', 'Toate switch-urile de acces au aceleași setări de port security și banner'],
          ['Mai puține greșeli', 'Se elimină copy-paste și tastarea repetitivă', 'VLAN-ul nu mai lipsește de pe un switch uitat'],
          ['Conformitate și audit', 'Starea dorită e scrisă; se compară automat cu realitatea', 'Raport: „toate echipamentele au SSH v2, niciunul nu are Telnet”'],
          ['Vizibilitate', 'Date structurate și telemetrie într-un loc', 'Un tablou de bord cu starea tuturor legăturilor'],
          ['Eficiență operațională', 'Sarcinile repetitive se mută la mașină', 'Inginerii lucrează la proiectare și îmbunătățiri, nu la „change-uri” identice'],
          ['Recuperare mai rapidă', 'Configurația e reproductibilă; rollback prin versiuni', 'Revii la versiunea anterioară din Git și o aplici']
        ]} />
      </Detailed>
      <Detailed title="2. Riscuri și provocări">
        <ul>
          <li><b>Raza de impact (blast radius)</b>: o greșeală aplicată automat poate scoate din funcțiune zeci de echipamente în câteva secunde. Mitigare: lot-pilot, validare, aprobări, rollback.</li>
          <li><b>Abilități noi</b>: versionare (Git), formate de date (YAML/JSON, 6.7), API-uri (6.5), instrumente (6.6), gândire de dezvoltator.</li>
          <li><b>Echipamente și platforme eterogene</b>: nu toate suportă NETCONF/REST; unele au doar CLI.</li>
          <li><b>Securitatea instrumentelor</b>: scripturile și controller-ele au acces larg; credențialele și tokenurile lor trebuie protejate (5.3, 5.8, 6.5).</li>
          <li><b>Calitatea sursei de adevăr</b>: dacă inventarul e greșit sau depășit, automatizarea amplifică greșeala.</li>
          <li><b>Schimbare culturală</b>: modificările „rapide de urgență” direct pe echipament creează drift față de sursa de adevăr; procesul trebuie respectat.</li>
        </ul>
      </Detailed>
      <Detailed title="3. Cum se schimbă munca unui inginer de rețea">
        <Table head={['Înainte', 'Cu automatizare']} rows={[
          ['Se conectează pe echipament și tastează comenzi', 'Scrie și revizuiește șabloane, variabile și politici'],
          ['Verifică manual cu show', 'Definește verificări automate și interpretează rapoarte'],
          ['Documentează în Word/Excel', 'Sursa de adevăr în Git este și documentația'],
          ['Reacționează după incident', 'Folosește telemetrie ca să detecteze abateri din timp'],
          ['Cunoștințe: CLI, protocoale', 'Aceleași cunoștințe + formate de date, API-uri, versionare']
        ]} />
        <Callout kind="tip" title="Mesajul pentru examen și pentru carieră">
          Inginerul de rețea <b>nu devine inutil</b>: cunoașterea protocoalelor, a designului și a depanării rămâne fundamentul. Automatizarea doar mută efortul de la execuție repetitivă la proiectare, validare și supraveghere.
        </Callout>
      </Detailed>
      <Detailed title="4. Automatizarea și celelalte topicuri din domeniul 6">
        <p><b>6.2–6.3</b>: controller-ele (de exemplu Catalyst Center) sunt un mod <i>integrat</i> de automatizare: oferă API-uri northbound și vorbesc cu echipamentele prin API-uri southbound. <b>6.4</b>: AI/ML adaugă analiză și recomandări peste telemetrie. <b>6.5</b>: API-urile REST sunt „limba” prin care aplicațiile cer unui controller să acționeze. <b>6.6–6.7</b>: Ansible și Terraform sunt instrumente care folosesc exact ideile de aici (inventar, șabloane, idempotență), iar JSON este formatul de date uzual.</p>
      </Detailed>
      <Traps items={[
        <>Beneficiul nr. 1 la examen: <b>consecvență și reducerea erorilor umane</b>, apoi viteza; nu „elimină nevoia de ingineri”.</>,
        <>Riscul-cheie: o configurație greșită se aplică <b>mult mai repede și pe mult mai multe</b> echipamente.</>,
        <>Modificările făcute manual pe echipament peste un sistem automatizat provoacă <b>drift</b>.</>,
      ]} />
      <InlineQuiz ids={['6.1-013', '6.1-015', '6.1-016', '6.1-017', '6.1-020', '6.1-021']} />
    </section>
  );
}
