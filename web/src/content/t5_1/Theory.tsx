import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AttackCatalog, DefenseInDepth, RiskChain } from '../../diagrams/t5_1';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.1" title="Concepte cheie de securitate — imaginea de ansamblu" />
      <Summary>
        <p>Securitatea rețelelor înseamnă protejarea a trei proprietăți ale informației — <b>confidențialitate, integritate, disponibilitate</b> (<G id="cia-triad" />). Orice discuție folosește același vocabular: un <b>asset</b> (ce protejăm) are o <b><G id="vulnerability" /></b> (o slăbiciune), o <b><G id="security-threat" /></b> (cineva sau ceva care poate profita) o poate folosi printr-un <b><G id="exploit" /></b>, iar <b><G id="mitigation" /></b> reduce riscul. La 5.1 înveți acest vocabular, tipurile de atacuri și ideea de apărare pe mai multe straturi.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 5.1 este <i>Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques)</i> — tip <b>Define</b>: contează definițiile exacte, diferența dintre termeni (o confuzie clasică: <i>threat</i> vs <i>vulnerability</i> vs <i>exploit</i>) și asocierea atac → mitigare. Nu se cer comenzi, dar le vei folosi în 5.3, 5.6, 5.7 și 5.9.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Ce anume protejăm și cum se numesc părțile unui incident?', 'Vocabularul de bază: CIA, asset, vulnerability, threat, exploit, risk'],
          ['Cine atacă și cum?', 'Tipuri de atacuri și amenințări'],
          ['Ce e un „zero-day” și de ce contează patch-urile?', 'Vulnerabilități și exploit-uri'],
          ['Ce fac pentru a reduce riscul?', 'Mitigare și apărare în adâncime'],
        ]} />
        <Analogy>O casă are un <b>asset</b> (bijuteriile), o <b>vulnerabilitate</b> (o fereastră care nu se încuie), o <b>amenințare</b> (un hoț în cartier) și un <b>exploit</b> (hoțul introduce un levier în fereastră). <b>Mitigarea</b> e încuietoarea, alarma sau câinele. Nu poți elimina hoții (amenințarea), dar poți repara fereastra (vulnerabilitatea).</Analogy>
      </Detailed>
      <Traps items={[
        <>Amenințarea (threat) este <b>cine/ce</b> poate face rău; vulnerabilitatea este <b>slăbiciunea</b> din sistem; exploit-ul este <b>metoda</b> concretă prin care slăbiciunea e folosită. Examenul le amestecă intenționat.</>,
        <>Securitatea nu e un produs, ci un proces: nicio mitigare nu aduce riscul la zero.</>,
        <>Nu toate atacurile sunt tehnice: o mare parte folosesc oameni (phishing), nu software.</>,
      ]} />
      <InlineQuiz ids={['5.1-001', '5.1-002']} />
    </section>
  );
}

/* ======================================================================
   1. Vocabularul de bază
   ====================================================================== */
export function VocabSection() {
  return (
    <section id="vocab" className="section">
      <SectionHead id="vocab" code="5.1" title="Vocabularul: CIA, asset, vulnerabilitate, amenințare, exploit, risc" />
      <Summary>
        <p><b>CIA</b> = Confidentiality (doar cei autorizați citesc), Integrity (datele nu sunt modificate neobservat), Availability (serviciul funcționează când ai nevoie). Un <b>asset</b> are o <b>vulnerabilitate</b>; o <b>amenințare</b> o poate <b>exploata</b>; <b>riscul</b> combină probabilitatea și impactul; <b>mitigarea</b> reduce riscul.</p>
      </Summary>
      <Detailed title="1. Triada CIA — ce vrem să protejăm">
        <Table head={['Proprietate', 'Întrebare', 'Exemplu de încălcare', 'Controale tipice']} hlCol={0} rows={[
          [<b key="c">Confidentiality</b>, 'Cine are voie să citească?', 'Un atacator citește e-mailuri sau parole în clar', 'Criptare (TLS, SSH, IPsec), autentificare, ACL'],
          [<b key="i">Integrity</b>, 'Datele sunt cele originale?', 'Cineva modifică un fișier de configurare sau un pachet în tranzit', 'Hash-uri, semnături digitale, controlul modificărilor'],
          [<b key="a">Availability</b>, 'Serviciul răspunde?', 'Un atac DDoS sau un ransomware blochează serverul', 'Redundanță (FHRP, EtherChannel), backup-uri, anti-DDoS'],
        ]} />
        <p>Un incident afectează adesea mai multe proprietăți: un ransomware lovește disponibilitatea (nu mai poți deschide fișierele), dar și confidențialitatea dacă datele sunt și copiate de atacator.</p>
      </Detailed>
      <Detailed title="2. Cum se leagă termenii între ei">
        <Figure caption="Interactiv: alege un scenariu și vezi cele cinci elemente ale lanțului, plus mitigarea care îl rupe.">
          <RiskChain />
        </Figure>
        <Table head={['Termen', 'Definiție scurtă', 'Exemplu']} hlCol={0} rows={[
          [<G key="a" id="asset" />, 'Orice are valoare pentru organizație: date, servere, echipamente, reputație, oameni', 'Baza de date cu clienți; un router de ramură'],
          [<G key="v" id="vulnerability" />, 'O slăbiciune într-un sistem, proces sau om', 'Software nepatch-uit, parolă implicită, port Telnet deschis'],
          [<G key="t" id="security-threat" />, 'Cineva sau ceva cu potențialul de a produce daune', 'Un atacator extern, un angajat nemulțumit, un incendiu'],
          [<G key="e" id="exploit" />, 'Metodă sau cod care folosește o vulnerabilitate', 'Script care rulează comenzi printr-o eroare cunoscută'],
          [<G key="r" id="risk" />, 'Probabilitatea ca o amenințare să exploateze o vulnerabilitate × impactul', 'Risc mare = server public, nepatch-uit, cu date sensibile'],
          [<G key="m" id="mitigation" />, 'Măsură care reduce riscul (previne, detectează sau limitează efectul)', 'Patch, firewall, MFA, backup'],
        ]} />
        <Callout kind="exam" title="Cum deosebești rapid">
          Cheie de examen: <b>vulnerabilitate = slăbiciune</b> (pasivă, există în sistem), <b>amenințare = potențial atacator</b> (activ, din exterior), <b>exploit = unealta/tehnica</b> care le leagă. Dacă enunțul spune „o eroare de cod”, e vulnerabilitate; „un atacator extern”, amenințare; „un script care folosește eroarea”, exploit.
        </Callout>
      </Detailed>
      <Detailed title="3. Tipuri de mitigare (cum acționează controalele)">
        <ul>
          <li><b>Preventive</b> — opresc incidentul înainte să se producă (firewall, ACL, parole puternice, patch).</li>
          <li><b>Detective</b> — observă că ceva s-a întâmplat (IPS în mod detecție, log-uri syslog, camere video).</li>
          <li><b>Corective/de recuperare</b> — repară sau restabilesc (backup, plan de răspuns la incidente, restaurare).</li>
        </ul>
        <p>Apoi, după natura lor, controalele pot fi <b>administrative</b> (politici, instruire — 5.2), <b>tehnice</b> (criptare, ACL, MFA) și <b>fizice</b> (uși, camere, lacăte).</p>
      </Detailed>
      <DeepDive title="Riscul nu se elimină, se tratează">
        <p>Odată ce riscul e evaluat, organizația alege: să îl <b>reducă</b> (mitigare), să îl <b>accepte</b> (impact mic sau cost mare al protecției), să îl <b>transfere</b> (asigurare, externalizare) sau să îl <b>evite</b> (renunță la serviciu). Mitigarea nu e singura opțiune, dar este cea la care se referă 5.1 și restul domeniului 5.0.</p>
      </DeepDive>
      <Traps items={[
        <>Amenințarea nu dispare dacă repari vulnerabilitatea; dar riscul scade, pentru că nu mai are ce exploata.</>,
        <>Un asset nu înseamnă doar hardware: datele și reputația sunt asset-uri.</>,
        <>„Disponibilitate” nu e doar „serverul e pornit”: un serviciu sufocat de trafic fals e indisponibil, deși pornit.</>,
      ]} />
      <InlineQuiz ids={['5.1-003', '5.1-004', '5.1-005', '5.1-006']} />
    </section>
  );
}

/* ======================================================================
   2. Amenințări și atacuri
   ====================================================================== */
export function ThreatsSection() {
  return (
    <section id="threats" className="section">
      <SectionHead id="threats" code="5.1" title="Amenințări și tipuri de atacuri" />
      <Summary>
        <p>Atacurile se grupează în familii: <b>malware</b>, <b>social engineering</b> (phishing), <b>DoS/DDoS</b>, <b>man-in-the-middle</b>, <b>reconnaissance</b>, <b>atacuri la parole</b> și <b>spoofing</b>. Fiecare lovește altă parte din CIA și are mitigări proprii.</p>
      </Summary>
      <Detailed title="1. Catalogul interactiv">
        <Figure caption="Alege un tip de atac: cum funcționează, un exemplu, mitigarea și ce parte din CIA e afectată.">
          <AttackCatalog />
        </Figure>
      </Detailed>
      <Detailed title="2. Malware — varietăți de știut">
        <Table head={['Tip', 'Cum se comportă', 'Cum se răspândește']} hlCol={0} rows={[
          [<G key="v" id="malware" />, 'Termen general pentru software rău intenționat', 'Variat'],
          ['Virus', 'Se atașează de un fișier legitim și se activează când acesta e rulat', 'Necesită acțiune a utilizatorului (deschide fișierul)'],
          ['Worm', 'Se copiază singur, fără acțiune umană, și consumă bandă', 'Prin rețea, exploatând vulnerabilități'],
          ['Trojan', 'Pare legitim, dar execută funcții ascunse (backdoor)', 'Păcălește utilizatorul să-l instaleze'],
          [<G key="rw" id="ransomware" />, 'Criptează datele și cere o răscumpărare', 'E-mail, vulnerabilități expuse'],
          ['Spyware / keylogger', 'Colectează în secret informații, inclusiv tastele apăsate', 'Atașat altor programe sau instalat de un trojan'],
          ['Botnet', 'Rețea de dispozitive infectate controlate de la distanță', 'Folosită pentru DDoS și spam'],
        ]} />
      </Detailed>
      <Detailed title="3. Social engineering și phishing">
        <p><G id="social-engineering" /> exploatează încrederea și graba oamenilor, nu o defecțiune a rețelei. <G id="phishing" /> este cea mai răspândită formă; are variante după canal și țintă:</p>
        <Table head={['Variantă', 'Cum']} hlCol={0} rows={[
          ['Phishing', 'E-mail masiv, generic, cu un link sau atașament periculos'],
          ['Spear phishing', 'E-mail țintit, personalizat pentru o persoană sau echipă'],
          ['Whaling', 'Spear phishing către conducerea de top'],
          ['Vishing', 'Prin apel telefonic (voice)'],
          ['Smishing', 'Prin SMS'],
          ['Pretexting', 'O poveste inventată („sunt de la IT”) pentru a obține informații'],
          ['Tailgating / piggybacking', 'Intri într-o zonă protejată fizic lipit de cineva autorizat (revine la 5.2)'],
        ]} />
      </Detailed>
      <Detailed title="4. DoS, DDoS, reflecție și amplificare">
        <p>Un atac <G id="dos" /> face un serviciu indisponibil epuizându-i resursele. În <G id="ddos" /> traficul vine din mii de surse (de obicei un botnet), deci nu poate fi oprit blocând o singură adresă. În <b>reflecție</b>, atacatorul trimite cereri cu adresa sursă falsificată (a victimei) către servere legitime; acestea răspund victimei. În <b>amplificare</b>, răspunsul este mult mai mare decât cererea (de exemplu unele servicii UDP deschise), deci atacatorul „înmulțește” traficul fără să aibă banda necesară.</p>
        <Callout kind="info" title="De ce UDP este ținta frecventă a reflecției">
          UDP nu are handshake: serverul răspunde la o adresă sursă fără să verifice că e reală. Același motiv pentru care <G id="spoofing" /> funcționează bine pe UDP.
        </Callout>
      </Detailed>
      <Detailed title="5. MITM, reconnaissance, parole">
        <ul>
          <li><G id="mitm" /> — atacatorul se interpune și poate citi/modifica traficul. Se obține local prin ARP spoofing, DHCP spoofing, un AP fals; mitigări: criptare, DAI, DHCP snooping (5.7).</li>
          <li><G id="reconnaissance" /> — faza de „cercetare” a unui atac: scanări de porturi, interogări DNS, ping sweep. Nu produce daune directe, dar anunță un atac.</li>
          <li><G id="password-attack" /> — brute force (toate combinațiile), dictionary (liste de parole uzuale), spraying (o parolă pe multe conturi), credential stuffing (credențiale scurse, reutilizate pe alte site-uri). Detalii și apărări la 5.4.</li>
        </ul>
      </Detailed>
      <Detailed title="6. Amenințări interne">
        <p>Nu toți atacatorii sunt externi. Un <G id="insider-threat" /> este un angajat, contractor sau partener cu acces legitim care produce daune, intenționat (furt de date) sau din greșeală (trimite un fișier greșit, ia un USB infectat). Controalele care ajută: <b>cel mai mic privilegiu</b> (least privilege), separarea atribuțiilor, jurnalizare (accounting din AAA) și instruire.</p>
      </Detailed>
      <Traps items={[
        <>Virus și worm nu sunt sinonime: virusul are nevoie de o acțiune a utilizatorului, wormul se răspândește singur.</>,
        <>DoS lovește <b>disponibilitatea</b>, nu confidențialitatea; un atacator DoS de obicei nu citește datele.</>,
        <>Reconnaissance nu este un atac cu pagube directe, dar este faza premergătoare; detectarea scanărilor e utilă.</>,
        <>Phishing, spear phishing și whaling diferă prin <b>țintă</b>, nu prin tehnologie.</>,
      ]} />
      <InlineQuiz ids={['5.1-007', '5.1-008', '5.1-009', '5.1-010', '5.1-011']} />
    </section>
  );
}

/* ======================================================================
   3. Vulnerabilități și exploit-uri
   ====================================================================== */
export function VulnSection() {
  return (
    <section id="vulns" className="section">
      <SectionHead id="vulns" code="5.1" title="Vulnerabilități și exploit-uri" />
      <Summary>
        <p>O vulnerabilitate poate fi în <b>software</b> (erori de cod), în <b>configurare</b> (parolă implicită, servicii inutile pornite), în <b>protocol</b> (Telnet trimite în clar) sau în <b>oameni/procese</b>. Când nu există încă patch, vorbim de un <G id="zero-day" />. Cele mai multe breșe reale folosesc vulnerabilități <b>cunoscute</b> și neaplicate.</p>
      </Summary>
      <Detailed title="1. De unde vin vulnerabilitățile">
        <Table head={['Sursă', 'Exemplu', 'Remediere']} hlCol={0} rows={[
          ['Software / firmware', 'Eroare în sistemul de operare al unui router', 'Actualizare (patch) la versiune corectată'],
          ['Configurare', 'Parolă implicită, SSH dezactivat, Telnet activ, porturi neutilizate deschise', 'Hardening (consolidare configurație), liste de verificare'],
          ['Protocol / design', 'Telnet, HTTP, SNMPv1/v2c trimit date sau parole în clar', 'Alternativa sigură: SSH, HTTPS, SNMPv3'],
          ['Oameni și proces', 'Utilizatori neinstruiți, lipsă politici', 'Instruire și proceduri (5.2)'],
          ['Fizic', 'Rack deschis, port de consolă accesibil', 'Control fizic (5.2)'],
        ]} />
      </Detailed>
      <Detailed title="2. Ciclul vieții unei vulnerabilități">
        <ol>
          <li>Cineva (cercetător sau atacator) <b>descoperă</b> o slăbiciune.</li>
          <li>Producătorul o primește, o investighează și publică un <b>patch</b> și un avertisment; vulnerabilitatea primește un identificator public <b>CVE</b> (Common Vulnerabilities and Exposures).</li>
          <li>Apar <b>exploit-uri</b> publice; scanările automate le caută pe Internet.</li>
          <li>Organizația trebuie să aplice <b>patch-ul</b> (patch management) cât mai repede. Fereastra dintre publicarea exploit-ului și aplicarea patch-ului este momentul de risc maxim.</li>
        </ol>
        <p>Un <b>zero-day</b> este o vulnerabilitate exploatată <b>înainte</b> ca producătorul să aibă un patch: apărătorii nu au o remediere imediată, deci se bazează pe mitigări compensatorii (segmentare, IPS, monitorizare, reducerea suprafeței de atac).</p>
      </Detailed>
      <Detailed title="3. Suprafața de atac și hardening">
        <p><G id="attack-surface" /> este totalul punctelor prin care un atacator poate încerca să intre: porturi deschise, servicii pornite, conturi, interfețe fizice, utilizatori. Principiu simplu: <b>ce nu rulează nu poate fi exploatat</b>. Hardening înseamnă reducerea suprafeței: dezactivezi serviciile nefolosite, închizi porturile libere, schimbi parolele implicite, folosești protocoale criptate și aplici patch-uri. Pașii concreți pe un switch/router sunt în secțiunea de configurare.</p>
      </Detailed>
      <DeepDive title="De ce „mai puțin” e mai sigur">
        <p>Fiecare serviciu activ are propriul cod, propriile erori și propria configurare. Un switch cu HTTP server, Telnet, CDP spre toți vecinii și 24 de porturi libere active expune mult mai mult decât unul cu SSH, fără HTTP și cu porturile libere în <code>shutdown</code>. Reducerea suprafeței de atac e cel mai ieftin control: costă doar o configurare atentă.</p>
      </DeepDive>
      <Traps items={[
        <>Patch-ul nu se aplică „când avem timp”: exploit-urile pentru vulnerabilități cunoscute apar rapid.</>,
        <>Un zero-day nu înseamnă că <i>nimic</i> nu se poate face: segmentarea, IPS și monitorizarea reduc efectul.</>,
        <>Parola implicită este o vulnerabilitate de configurare, nu de software.</>,
      ]} />
      <InlineQuiz ids={['5.1-012', '5.1-013', '5.1-014']} />
    </section>
  );
}

/* ======================================================================
   4. Mitigare
   ====================================================================== */
export function MitigationSection() {
  return (
    <section id="mitigation" className="section">
      <SectionHead id="mitigation" code="5.1" title="Tehnici de mitigare și apărare în adâncime" />
      <Summary>
        <p>Nu există un control perfect, deci se folosește <G id="defense-in-depth" />: mai multe straturi independente (politici, fizic, perimetru, rețea internă, gazdă, aplicație/date). Principii: <b><G id="least-privilege" /></b>, segmentare, patch, criptare, autentificare puternică, jurnalizare și backup.</p>
      </Summary>
      <Detailed title="1. Straturile">
        <Figure caption="Interactiv: apasă un strat ca să simulezi că a cedat; celelalte încă protejează.">
          <DefenseInDepth />
        </Figure>
      </Detailed>
      <Detailed title="2. Atac → mitigare (tabelul de recapitulare)">
        <Table head={['Amenințare', 'Mitigări principale', 'Unde le înveți']} hlCol={0} rows={[
          ['Malware', 'Antivirus/EDR, patch-uri, filtrare e-mail, backup-uri, segmentare', '5.1, 1.1 (firewall/IPS)'],
          ['Phishing / social engineering', 'Instruire, simulări, MFA, verificare', '5.2, 5.4'],
          ['DoS / DDoS', 'Rate limiting, filtrare anti-spoofing, servicii anti-DDoS, redundanță', '5.1, 3.5 (FHRP)'],
          ['Man-in-the-middle', 'TLS/SSH/VPN, DHCP snooping, DAI', '5.5, 5.7'],
          ['Acces neautorizat la dispozitive', 'Parole puternice, SSH, AAA, ACL pe VTY', '5.3, 5.4, 5.8, 4.8'],
          ['Trafic neautorizat în rețea', 'ACL, firewall, segmentare VLAN', '5.6, 2.1'],
          ['Dispozitive neautorizate la port', 'Port security, 802.1X', '5.7, 5.8'],
          ['Interceptare între site-uri', 'VPN IPsec', '5.5'],
          ['Wireless neautorizat', 'WPA2/WPA3, 802.1X', '5.9'],
        ]} />
      </Detailed>
      <Detailed title="3. Principii generale">
        <ul>
          <li><b>Least privilege</b> — fiecare cont și proces primește doar drepturile strict necesare.</li>
          <li><b>Segmentare</b> — VLAN-uri și ACL separă zonele; o breșă într-o zonă nu deschide tot.</li>
          <li><b>Patch management</b> — inventar, testare, aplicare regulată.</li>
          <li><b>Criptare în tranzit și în repaus</b> — TLS/SSH/IPsec pe rețea, discuri criptate pe dispozitive.</li>
          <li><b>Autentificare puternică</b> — parole lungi + MFA (5.4); AAA centralizat (5.8).</li>
          <li><b>Jurnalizare și monitorizare</b> — syslog (4.5), SNMP (4.4); fără log-uri nu poți investiga.</li>
          <li><b>Backup testat</b> — singura protecție reală împotriva ransomware.</li>
        </ul>
      </Detailed>
      <Callout kind="exam" title="Cuvinte cheie de examen">
        „Defense in depth”, „least privilege”, „zero-day”, „threat vs vulnerability vs exploit”, „CIA”, „social engineering”, „phishing / spear phishing / whaling”, „DDoS / botnet”, „ransomware”, „insider threat”.
      </Callout>
      <Traps items={[
        <>Un firewall nu oprește phishing-ul: omul poate da credențialele chiar prin canale permise.</>,
        <>Apărarea în adâncime nu înseamnă același control repetat, ci controale <b>diferite</b>, independente.</>,
        <>Backup-urile conectate permanent la rețea pot fi criptate și ele de ransomware; păstrează o copie offline sau imutabilă.</>,
      ]} />
      <InlineQuiz ids={['5.1-015', '5.1-016', '5.1-017', '5.1-018']} />
    </section>
  );
}
