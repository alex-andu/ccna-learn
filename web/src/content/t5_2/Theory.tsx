import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { LearningLevels, PhishSpotter, PhysicalZones, PolicyPyramid } from '../../diagrams/t5_2';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.2" title="Program de securitate — imaginea de ansamblu" />
      <Summary>
        <p>Tehnologia singură nu face o rețea sigură. Un <b><G id="security-program" /></b> adaugă partea organizatorică: <b>politici</b> care spun ce se cere, <b>conștientizare și instruire</b> care schimbă comportamentul oamenilor și <b>controlul accesului fizic</b> care împiedică atingerea echipamentelor. La 5.2 înveți cele trei elemente cerute de examen: <i>user awareness</i>, <i>training</i> și <i>physical access control</i>.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 5.2 este <i>Describe security program elements (user awareness, training, and physical access control)</i> — tip <b>Describe</b>: se cer concepte, exemple și diferențe (de exemplu awareness vs training), nu comenzi. Comenzile apar doar ca legătură cu hardening-ul de dispozitiv (secțiunea de configurare).</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Cum se organizează securitatea într-o companie?', 'Programul de securitate și documentele lui'],
          ['Cum devin oamenii o parte din apărare, nu cel mai slab punct?', 'Conștientizare, instruire, educație'],
          ['Cum împiedic accesul direct la echipamente?', 'Controlul accesului fizic'],
          ['Ce legătură are cu un router sau switch?', 'Configurare: console, porturi libere, banner'],
        ]} />
        <Analogy>Un lanț e la fel de puternic ca veriga cea mai slabă. Firewall-ul și parolele sunt verigi tehnice; <b>oamenii</b> și <b>ușile</b> sunt verigi la fel de importante. Programul de securitate le întărește pe toate: scrie regulile, învață oamenii și încuie ușile.</Analogy>
      </Detailed>
      <Traps items={[
        <>Cele trei elemente din 5.2 sunt <b>user awareness</b>, <b>training</b> și <b>physical access control</b> — nu include firewall, ACL sau criptare (acelea sunt controale tehnice).</>,
        <>Un control fizic (rack încuiat) nu înlocuiește parolele, iar parolele nu înlocuiesc controlul fizic: se completează (defense in depth, 5.1).</>,
        <>Instruirea nu se face o singură dată: omul uită, iar amenințările se schimbă.</>,
      ]} />
      <InlineQuiz ids={['5.2-001', '5.2-002']} />
    </section>
  );
}

/* ======================================================================
   1. Programul de securitate
   ====================================================================== */
export function ProgramSection() {
  return (
    <section id="program" className="section">
      <SectionHead id="program" code="5.2" title="Programul de securitate: politici, roluri, ciclu" />
      <Summary>
        <p>Un <G id="security-program" /> este totalitatea politicilor, proceselor, rolurilor și controalelor prin care o organizație își gestionează riscurile. Se bazează pe <G id="security-policy" /> (ce se cere), standarde (cerințe măsurabile), proceduri (pași) și ghiduri (recomandări), toate revizuite periodic.</p>
      </Summary>
      <Detailed title="1. Ierarhia documentelor">
        <Figure caption="Interactiv: alege tipul de document și vezi definiția, un exemplu și cine îl scrie.">
          <PolicyPyramid />
        </Figure>
        <p>Exemplul unei „lanț” complet: <i>policy</i> — „accesul administrativ se face doar prin canale criptate”; <i>standard</i> — „SSH v2, parole de minimum 12 caractere”; <i>procedure</i> — „pașii de activare SSH pe un switch nou”; <i>guideline</i> — „folosește un manager de parole”.</p>
      </Detailed>
      <Detailed title="2. Ce conține un program">
        <ul>
          <li><b>Evaluarea riscurilor</b> — ce asset-uri avem și ce le amenință (5.1).</li>
          <li><b>Politici acceptabile de utilizare</b> (<i>acceptable use</i>) — ce au voie utilizatorii să facă cu resursele companiei.</li>
          <li><b>Politici de acces și de parole</b> — cine primește acces la ce (<G id="least-privilege" />), cum se gestionează parolele (5.4).</li>
          <li><b>Clasificarea datelor</b> (<G id="data-classification" />) — public, intern, confidențial, secret: dictează protecția.</li>
          <li><b>Răspuns la incidente</b> (<G id="incident-response" />) — cine face ce când apare un incident: pregătire, detectare, izolare, eradicare, recuperare, lecții învățate.</li>
          <li><b>Continuitatea activității</b> — backup, recuperare după dezastru.</li>
          <li><b>Conformitate și audit</b> — cerințe legale și de industrie (de exemplu GDPR în UE, PCI DSS pentru plăți, ISO/IEC 27001 ca standard de management); verificarea periodică a respectării.</li>
          <li><b>Roluri și responsabilități</b> — cine aprobă, cine implementează, cine monitorizează; <G id="separation-of-duties" /> (nicio persoană nu controlează singură un proces critic).</li>
        </ul>
      </Detailed>
      <DeepDive title="Un program este un ciclu, nu un document">
        <p>Programele eficiente urmează un ciclu de îmbunătățire: <b>planifică</b> (politici, risc), <b>implementează</b> (controale, instruire), <b>verifică</b> (audit, teste de penetrare, simulări) și <b>corectează</b> (lecții din incidente). Un incident bine documentat devine material de instruire și motiv pentru actualizarea politicii.</p>
      </DeepDive>
      <Traps items={[
        <>Politica spune <b>ce</b> și <b>de ce</b>; procedura spune <b>cum</b> pas cu pas. Examenul le amestecă.</>,
        <>Un ghid (guideline) nu e obligatoriu; un standard este.</>,
        <>O politică nescrisă sau neaprobată de conducere nu poate fi aplicată.</>,
      ]} />
      <InlineQuiz ids={['5.2-003', '5.2-004', '5.2-005']} />
    </section>
  );
}

/* ======================================================================
   2. Conștientizare, instruire, educație
   ====================================================================== */
export function AwarenessSection() {
  return (
    <section id="awareness" className="section">
      <SectionHead id="awareness" code="5.2" title="User awareness și training" />
      <Summary>
        <p><G id="security-awareness" /> (conștientizare) = informare scurtă și continuă a <b>tuturor</b> utilizatorilor despre ce să recunoască (phishing, parole, dispozitive necunoscute). <G id="security-training" /> (instruire) = dezvoltarea de <b>competențe</b> pentru roluri (administratori, dezvoltatori). Educația aprofundează „de ce”.</p>
      </Summary>
      <Detailed title="1. Cele trei niveluri">
        <Figure caption="Interactiv: compară awareness, training și education după public, scop, exemple și frecvență.">
          <LearningLevels />
        </Figure>
        <Callout kind="exam" title="Cum deosebești la examen">
          „Toți angajații, mesaje scurte repetate, simulări de phishing” = <b>awareness</b>. „Cursuri pe rol, laburi, procedurile administratorilor” = <b>training</b>. Dacă enunțul spune „toți utilizatorii” și „recunoașterea unei amenințări”, răspunsul este awareness.
        </Callout>
      </Detailed>
      <Detailed title="2. Ce trebuie să știe utilizatorii">
        <ul>
          <li><b>Phishing și social engineering</b> — recunoașterea mesajelor suspecte și raportarea lor.</li>
          <li><b>Parole</b> — unice, lungi, un manager de parole, MFA acolo unde se poate (5.4).</li>
          <li><b>Dispozitive</b> — nu conecta USB-uri sau puncte de acces necunoscute; blochează ecranul; politica pentru dispozitive personale (BYOD).</li>
          <li><b>Date</b> — cum se clasifică, unde se stochează, cum se partajează.</li>
          <li><b>Acces fizic</b> — nu ține ușa deschisă pentru necunoscuți (tailgating), poartă badge-ul, însoțește vizitatorii.</li>
          <li><b>Raportare</b> — cui anunți un incident sau un mesaj suspect, fără teama de reproș.</li>
        </ul>
      </Detailed>
      <Detailed title="3. Simulări de phishing">
        <p>O <G id="phishing-simulation" /> trimite angajaților un mesaj fals, controlat, și măsoară câți dau click sau raportează. Scopul este <b>învățarea</b>, nu pedepsirea: cine a dat click vede imediat ce indicii au fost ratate. Încearcă tu: marchează indiciile din e-mailul de mai jos.</p>
        <Figure caption="Interactiv: găsește indiciile unui e-mail de phishing (și observă că unele elemente sunt normale).">
          <PhishSpotter />
        </Figure>
      </Detailed>
      <Detailed title="4. Cum se măsoară eficiența">
        <Table head={['Indicator', 'Ce arată']} hlCol={0} rows={[
          ['Rata de click în simulări', 'Cât de convingătoare au fost mesajele și cât de pregătiți sunt oamenii'],
          ['Rata de raportare', 'Câți utilizatori anunță mesajele suspecte (mai important decât „a nu da click”)'],
          ['Timp până la raportare', 'Cât de repede află echipa de securitate'],
          ['Participarea la instruire', 'Acoperirea programului'],
          ['Număr de incidente cauzate de erori umane', 'Tendința pe termen lung'],
        ]} />
      </Detailed>
      <Traps items={[
        <>Awareness nu înseamnă „un curs anual bifat”: repetiția scurtă și frecventă funcționează mai bine decât o prezentare lungă anuală.</>,
        <>Pedepsirea celor păcăliți îi face să ascundă incidentele; cultura corectă încurajează raportarea.</>,
        <>Instruirea administratorilor (training) nu înlocuiește awareness-ul pentru restul utilizatorilor.</>,
      ]} />
      <InlineQuiz ids={['5.2-006', '5.2-007', '5.2-008', '5.2-009']} />
    </section>
  );
}

/* ======================================================================
   3. Controlul accesului fizic
   ====================================================================== */
export function PhysicalSection() {
  return (
    <section id="physical" className="section">
      <SectionHead id="physical" code="5.2" title="Controlul accesului fizic" />
      <Summary>
        <p><G id="physical-access-control" /> împiedică persoanele neautorizate să ajungă la clădiri, săli de servere și echipamente. Se aplică în <b>straturi concentrice</b> (perimetru → clădire → etaj → sală → rack), cu controale preventive, detective și de descurajare. Cine ajunge la un echipament poate ocoli aproape orice control logic.</p>
      </Summary>
      <Detailed title="1. De ce contează accesul fizic">
        <p>Cu acces fizic la un router sau switch, un atacator poate: se conecta la <b>portul console</b> (care adesea nu cere rețea), reporni echipamentul și folosi proceduri de <b>recuperare a parolei</b>, conecta un laptop la un <b>port liber</b>, fura un disc sau echipamentul întreg sau instala un dispozitiv de interceptare. De aceea regula clasică spune: <i>„dacă un atacator are acces fizic nelimitat, ai pierdut”</i> — scopul controalelor este să facă acest acces dificil, vizibil și înregistrat.</p>
      </Detailed>
      <Detailed title="2. Zonele și controalele">
        <Figure caption="Interactiv: alege o zonă și vezi controalele tipice.">
          <PhysicalZones />
        </Figure>
        <Table head={['Control', 'Tip', 'Ce face']} hlCol={0} rows={[
          [<G key="b" id="access-badge" />, 'Preventiv', 'Cartelă RFID sau cu cip; permite intrarea doar persoanelor autorizate și lasă un jurnal'],
          ['Cod PIN / biometrie', 'Preventiv', 'Al doilea factor la ușă (ceva ce știi / ceva ce ești); biometria la nivel de concept se detaliază la 5.4'],
          [<G key="m" id="mantrap" />, 'Preventiv', 'Vestibul cu două uși: a doua nu se deschide până nu se închide prima; oprește tailgating-ul'],
          ['Paznic, recepție, registru de vizitatori', 'Preventiv / descurajare', 'Verifică identitatea; vizitatorii sunt însoțiți'],
          ['Camere video (CCTV) și senzori', 'Detectiv', 'Înregistrează și alertează; ajută investigațiile'],
          ['Jurnale de acces', 'Detectiv', 'Cine a intrat, când și pe unde'],
          ['Rack încuiat, cabluri cu lacăt', 'Preventiv', 'Protejează echipamentul și porturile individuale'],
          ['Controale de mediu', 'Protecție', 'UPS, climatizare, detecție și stingere incendiu; apără disponibilitatea'],
          ['Eliminare sigură', 'Preventiv', 'Șterge configurația și discurile înainte de casare sau returnare'],
        ]} />
      </Detailed>
      <Detailed title="3. Controale pentru echipamente de rețea">
        <ul>
          <li><b>Camera sau dulapul de rețea încuiat</b>, cu acces doar pentru personalul autorizat și cu jurnal.</li>
          <li><b>Port console</b>: cablul de console nu rămâne conectat; consola are parolă și <code>exec-timeout</code> (5.3).</li>
          <li><b>Porturi libere</b> pe switch: <code>shutdown</code> și VLAN neutilizat; port security pentru porturile folosite (5.7).</li>
          <li><b>Recuperarea parolei</b>: pe multe platforme necesită acces fizic la consolă; există o opțiune care o poate restricționa (vezi configurarea), cu un compromis de recuperare.</li>
          <li><b>Inventar</b> al echipamentelor și etichetare, ca să observi lipsuri.</li>
          <li><b>Eliminare</b>: ștergerea configurației înainte de returnare sau casare.</li>
        </ul>
      </Detailed>
      <DeepDive title="Acces la rețea ≠ acces la clădire">
        <p>Un vizitator care conectează un laptop într-o priză de perete din sala de ședințe ocolește firewall-ul perimetral: este deja „în interior”. De aceea controlul fizic se completează cu controale de rețea pe port: porturi libere oprite, port security (5.7), 802.1X (5.8) și rețele separate pentru oaspeți.</p>
      </DeepDive>
      <Traps items={[
        <>Tailgating și piggybacking sunt atacuri de <b>social engineering fizic</b>; mantrap-ul și instruirea le reduc.</>,
        <>Controlul fizic este „preventiv” (ușa), dar camerele sunt „detective”: nu opresc intrarea, o documentează.</>,
        <>Un cablu de console lăsat în rack și o parolă slabă anulează protecția sălii.</>,
      ]} />
      <InlineQuiz ids={['5.2-010', '5.2-011', '5.2-012', '5.2-013']} />
    </section>
  );
}
