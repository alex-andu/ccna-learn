import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { NtpExchange, NtpModes, StratumTree } from '../../diagrams/t4_2';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.2" title="NTP — imaginea de ansamblu" />
      <Summary>
        <p><G id="ntp" /> sincronizează ceasurile dispozitivelor dintr-o rețea cu o sursă de timp de încredere. Funcționează peste <G id="udp" /> portul <b>123</b>, într-o ierarhie de <b>straturi (stratum)</b>. La 4.2 înveți să configurezi un router/switch ca <b>client</b> (<code>ntp server</code>) sau ca <b>server</b> (<code>ntp master</code>) și să verifici sincronizarea cu <code>show ntp status</code> și <code>show ntp associations</code>.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.2 este <i>Configure and verify NTP operating in a client and server mode</i>. Nu cere detalii de algoritm, ci să știi <b>de ce</b> contează timpul, <b>cum se organizează</b> sursele (stratum), <b>ce moduri</b> există și <b>cum se configurează și verifică</b> un client și un server pe Cisco.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce are nevoie o rețea de ore corecte?', 'De ce contează ora'],
          ['Ce este stratum și cum se propagă timpul?', 'Ierarhia de straturi'],
          ['Cum află clientul diferența dintre ceasuri?', 'Cum funcționează un schimb NTP'],
          ['Ce moduri există, ce comenzi folosesc?', 'Moduri NTP și Exemple de configurare'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Obiectivul 4.2 nu are sub-puncte oficiale: lecția are trei secțiuni logice (de ce contează ora, straturile, modurile și schimbul de mesaje), apoi configurarea și laburile.
        </Callout>
        <Analogy>Gândește-te la ceasurile din gări: toate se potrivesc cu ceasul central al gării principale, care, la rândul lui, se potrivește cu ora oficială. Fiecare ceas „întreabă” ceasul de deasupra lui; cu cât ești mai departe de ora oficială (mai multe salturi), cu atât te bazezi pe o copie a unei copii. NTP face același lucru, cu precizie de milisecunde.</Analogy>
      </Detailed>
      <Traps items={[
        <>NTP nu „setează” ora o singură dată: o menține corectă continuu, ajustând treptat ceasul (iar la diferențe foarte mari îl poate sări direct).</>,
        <>Stratum nu este o clasificare a calității dispozitivului, ci <b>numărul de salturi</b> până la sursa de referință.</>,
        <>Un router fără sincronizare își păstrează ora după un ceas intern care se abate în timp; la repornire poate reveni la o dată implicită veche.</>,
      ]} />
      <InlineQuiz ids={['4.2-001', '4.2-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce contează ora
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="4.2" title="De ce contează ora într-o rețea" />
      <Summary>
        <p>Fiecare dispozitiv are un ceas propriu, care se abate în timp. Dacă ceasurile nu coincid, <b>logurile</b> nu pot fi corelate, certificatele par expirate sau încă nevalide, iar autentificările și depanarea devin confuze. NTP aduce toate dispozitivele la aceeași oră.</p>
      </Summary>
      <Detailed title="1. Problema">
        <p>Ceasurile hardware sunt cristale de cuarț: oricât de bune, se abat cu secunde pe lună și variază cu temperatura. Un router repornit poate porni cu o dată implicită (de exemplu o dată din trecut) dacă nu are baterie pentru ceasul hardware. Într-o rețea cu sute de dispozitive, fiecare ceas arată altceva.</p>
        <Table head={['Consecința ceasurilor nesincronizate', 'Exemplu']} hlCol={0} rows={[
          ['Log-uri imposibil de corelat', 'Un incident apare pe R1 la 10:02 și pe R2 la 09:57; ordinea evenimentelor nu se mai poate reconstitui (vezi și 4.5, syslog).'],
          ['Certificate și autentificare', 'Un certificat poate părea expirat sau încă nevalid dacă ora dispozitivului diferă; unele protocoale de autentificare tolerează doar abateri mici.'],
          ['Depanare și audit', 'Cine a făcut o modificare, la ce oră? Fără timp comun, auditul nu are valoare.'],
          ['Taskuri programate', 'Backup-uri, rotații de loguri, ferestre de mentenanță pornesc la momente greșite.'],
        ]} />
        <Callout kind="exam" title="Cuvinte cheie de examen">
          „Corelarea evenimentelor din log-uri”, „timp consecvent pe toate dispozitivele”, „UDP 123”. Dacă o întrebare vorbește despre timestamp-uri în syslog, răspunsul este NTP.
        </Callout>
      </Detailed>
      <Detailed title="2. Ceasul hardware și ceasul software">
        <p>Dispozitivele Cisco au (la modelele cu baterie) un <b>calendar hardware</b> care continuă să meargă când echipamentul e oprit, și un <b>ceas software</b> care pornește la boot din calendar și pe care îl folosesc loguri și protocoale. NTP actualizează <b>ceasul software</b>. Dacă vrei ca ora corectă să supraviețuiască unei reporniri, ai nevoie de <code>ntp update-calendar</code> (sau <code>clock update-calendar</code>), care copiază ora ceasului software în calendarul hardware.</p>
        <p>Pe un echipament fără NTP, ora se setează manual cu <code>clock set HH:MM:SS zi lună an</code> (în EXEC privilegiat, nu în configurare) — util în laborator, dar neviabil la scară.</p>
      </Detailed>
      <Traps items={[
        <>Ora corectă nu înseamnă și fusul orar corect: NTP transportă ora UTC; fusul orar se setează local cu <code>clock timezone</code>.</>,
        <>Un router poate afișa ora corectă în <code>show clock</code>, dar să nu fie „sincronizat” NTP; verifică cu <code>show ntp status</code>.</>,
      ]} />
      <InlineQuiz ids={['4.2-003', '4.2-004']} />
    </section>
  );
}

/* ======================================================================
   2. Stratum
   ====================================================================== */
export function StratumSection() {
  return (
    <section id="stratum" className="section">
      <SectionHead id="stratum" code="4.2" title="Ierarhia de straturi (stratum)" />
      <Summary>
        <p>NTP organizează sursele de timp pe <b>straturi</b>. Stratum 0 este sursa de referință (ceas atomic, GPS), stratum 1 este serverul legat direct la ea, iar fiecare client care primește timpul de la un server de stratum <i>n</i> devine stratum <i>n+1</i>. Valoarea maximă utilizabilă este 15; <b>stratum 16 înseamnă nesincronizat</b>.</p>
      </Summary>
      <Detailed title="1. Cum se numără straturile">
        <Figure caption="Interactiv: alege un strat și citește rolul lui; observă cum timpul coboară prin ierarhie.">
          <StratumTree />
        </Figure>
        <Table head={['Stratum', 'Ce este', 'Observații']} hlCol={0} rows={[
          ['0', 'Sursa de referință (ceas atomic, receptor GPS)', 'Nu e dispozitiv de rețea; se leagă direct la un server stratum 1'],
          ['1', 'Server legat direct la stratum 0', 'Cel mai apropiat de sursa reală'],
          ['2–15', 'Servere/clienți succesivi', 'Fiecare salt adaugă 1'],
          ['16', 'Nesincronizat', 'Ceasul nu are o sursă validă; nu poate fi folosit ca sursă de timp'],
        ]} />
        <p>Un router cu <code>ntp master 3</code> se declară pe sine <b>stratum 3</b>; clienții lui devin stratum 4. Într-o rețea, aproape toate dispozitivele își iau timpul de la unul sau două servere din interior, care la rândul lor îl iau de la servere publice (de exemplu stratum 1–2).</p>
      </Detailed>
      <Detailed title="2. Ce înseamnă stratum pentru tine">
        <ul>
          <li>Un stratum <b>mai mic</b> înseamnă mai puține salturi până la sursa reală, deci, în mod normal, o abatere mai mică.</li>
          <li>Un client alege între mai multe servere (dacă are mai multe) după stratum și calitatea măsurătorilor; cu <code>prefer</code> poți indica serverul favorit.</li>
          <li>Un client nu se sincronizează la un server cu stratum 16 (nesincronizat), pentru că acela nu are el însuși o sursă validă.</li>
        </ul>
        <Callout kind="warn" title="Stratum 16 nu este „foarte precis”">
          Stratum 16 înseamnă <b>nesincronizat</b>, nu „cel mai bun”. Numărul mic e cel bun (1 e aproape de sursă); 16 e o valoare rezervată pentru „fără sursă”.
        </Callout>
      </Detailed>
      <DeepDive title="Server NTP intern: de ce nu lași toate dispozitivele să iasă în Internet">
        <p>Într-o rețea reală, de regulă 1–2 servere interne se sincronizează cu surse externe, iar restul dispozitivelor folosesc doar serverele interne. Avantaje: trafic NTP redus spre exterior, politici de firewall simple (doar serverele ies pe UDP 123) și o singură sursă de adevăr pentru toată infrastructura. În laborator, un router configurat cu <code>ntp master</code> joacă acest rol, fiind „sursa” rețelei, chiar dacă propriul lui ceas nu este exact.</p>
      </DeepDive>
      <Traps items={[
        <>Un dispozitiv configurat <code>ntp master N</code> se prezintă ca stratum N chiar dacă ceasul lui e greșit: utilizează-l doar când nu ai o sursă reală (laborator).</>,
        <>Dacă ai <code>ntp master</code> pe un client care e deja sincronizat cu o sursă mai bună, sursa mai bună este folosită; <code>master</code> e o variantă de rezervă.</>,
        <>Confuzia „stratum mic = mai bun în orice caz” nu are acoperire pe examen; reține doar: 0 referință, 1 direct la ea, fiecare salt +1, 16 nesincronizat.</>,
      ]} />
      <InlineQuiz ids={['4.2-005', '4.2-006', '4.2-007']} />
    </section>
  );
}

/* ======================================================================
   3. Moduri și schimbul de mesaje
   ====================================================================== */
export function ModesSection() {
  return (
    <section id="modes" className="section">
      <SectionHead id="modes" code="4.2" title="Moduri NTP și cum funcționează un schimb" />
      <Summary>
        <p>Pe Cisco, un dispozitiv poate fi <b>client</b> (<code>ntp server &lt;ip&gt;</code> — „sursa mea de timp este acel server”), <b>server/master</b> (<code>ntp master [stratum]</code> — „eu sunt sursa”), <b>peer</b> (<code>ntp peer</code>, simetric) sau primește/trimite <b>broadcast</b>. Clientul trimite o cerere UDP 123 și, din patru marcaje de timp, calculează cât de mult se abate ceasul lui.</p>
      </Summary>
      <Detailed title="1. Modurile">
        <Figure caption="Moduri NTP pe Cisco.">
          <NtpModes />
        </Figure>
        <Table head={['Mod', 'Comandă', 'Ce înseamnă']} hlCol={0} rows={[
          ['Client', <code key="a">ntp server 10.0.0.1</code>, 'Interoghează serverul și își ajustează ceasul după el. Obligatoriu la CCNA.'],
          ['Server (master)', <code key="b">ntp master 3</code>, 'Dispozitivul oferă ora lui ca sursă, la stratum 3 (sau implicit, dacă omiți valoarea); folosit când nu există sursă externă.'],
          ['Symmetric active (peer)', <code key="c">ntp peer 10.0.0.2</code>, 'Doi parteneri se sincronizează reciproc; ca să recunoști termenul.'],
          ['Broadcast', <code key="d">ntp broadcast</code>, 'Serverul trimite periodic ora pe broadcast/multicast; clienții folosesc ntp broadcast client. Mai puțin precis; la CCNA doar recunoaștere.'],
        ]} />
        <p>Un server NTP Cisco nu are o comandă „ntp server enable”: orice dispozitiv sincronizat răspunde implicit la cereri NTP (în limita ACL-urilor), iar <code>ntp master</code> doar îl face să se declare sursă chiar și când nu e sincronizat.</p>
      </Detailed>
      <Detailed title="2. Cum află clientul diferența de timp, pas cu pas">
        <p>Clientul trimite o cerere (UDP 123), serverul răspunde, iar în pachete sunt <b>patru marcaje de timp</b>: T1 (trimitere cerere, ceasul clientului), T2 (recepție, ceasul serverului), T3 (trimitere răspuns, ceasul serverului), T4 (recepție răspuns, ceasul clientului). Din ele:</p>
        <ul>
          <li><b>Offset</b> (cât de mult e ceasul clientului în urmă sau înainte) = ((T2 − T1) + (T3 − T4)) / 2</li>
          <li><b>Delay</b> (durata dus-întors) = (T4 − T1) − (T3 − T2)</li>
        </ul>
        <Figure caption="Interactiv: parcurge cei cinci pași și vezi cum se obține offset-ul.">
          <NtpExchange />
        </Figure>
        <p>Clientul face asta la intervale (polling), de obicei la 64–1024 s, și combină mai multe măsurători pentru a-și ajusta ceasul fin. De aceea o sincronizare inițială durează <b>câteva minute</b>, nu secunde.</p>
      </Detailed>
      <DeepDive title="Autentificarea NTP (opțională)">
        <p>Fără autentificare, oricine poate trimite răspunsuri NTP false (dacă ajunge în calea pachetelor) și poate muta ceasul dispozitivului. NTP are un mecanism de autentificare simetrică cu cheie partajată: <code>ntp authenticate</code>, <code>ntp authentication-key 1 md5 PAROLA</code>, <code>ntp trusted-key 1</code> și, pe client, <code>ntp server 10.0.0.1 key 1</code>. Cheile trebuie să coincidă pe ambele părți. La CCNA e suficient să știi că există și de ce; exemplul complet e în secțiunea de configurare și în labul solo.</p>
      </DeepDive>
      <Traps items={[
        <>Cererile NTP folosesc <b>UDP 123</b>; dacă un ACL sau firewall blochează portul, clientul rămâne nesincronizat.</>,
        <>Sincronizarea nu e instantanee: imediat după <code>ntp server</code>, <code>show ntp status</code> arată de obicei „unsynchronized”; așteaptă și verifică din nou.</>,
        <>Un client nu se sincronizează dacă serverul însuși nu e sincronizat (stratum 16), cu excepția unui <code>ntp master</code>.</>,
      ]} />
      <InlineQuiz ids={['4.2-008', '4.2-010', '4.2-012']} />
    </section>
  );
}
