import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { NatFourAddresses, NatOrderOfOps, PatTable } from '../../diagrams/t4_1';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.1" title="Inside source NAT — imaginea de ansamblu" />
      <Summary>
        <p><G id="nat" /> traduce adresele IP ale pachetelor care trec printr-un router, de obicei din adrese <b>private</b> (RFC 1918) în adrese <b>publice</b>. La obiectivul 4.1 înveți varianta <b>inside source NAT</b>: traduci adresa <b>sursă</b> a gazdelor din interior, în trei moduri — <b>static</b> (1:1, permanent), cu <b>pool</b> (1:1, dinamic) și <b>PAT / overload</b> (mulți:1, folosind porturi) — și le configurezi și verifici pe un router Cisco.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.1 este <i>Configure and verify inside source NAT using static and pools</i>. În 1.7 ai aflat <b>de ce</b> există NAT (lipsa adreselor IPv4 și folosirea adreselor private) și ce sunt <G id="static-nat" />, <G id="dynamic-nat" /> și <G id="pat" />. Aici treci la partea practică: terminologia exactă folosită de IOS, comenzile și verificarea. Nu mai explicăm din nou conceptul de adrese private; ne concentrăm pe <b>cum funcționează traducerea în router</b>.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Ce înseamnă inside local, inside global, outside local, outside global?', 'Cele patru adrese NAT'],
          ['Cum fac o gazdă accesibilă din Internet cu o adresă fixă?', 'Static NAT'],
          ['Cum dau mai multor gazde adrese publice dintr-un grup (pool)?', 'Dynamic NAT cu pool'],
          ['Cum pun o sută de gazde în spatele unei singure adrese publice?', 'PAT (overload)'],
          ['Ce comenzi și ce output folosesc?', 'Exemple de configurare și verificare'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Obiectivul 4.1 nu are sub-puncte oficiale, deci lecția are patru secțiuni logice (terminologie, static, pool, PAT), apoi configurarea și laburile. Dacă ai mai multe adrese publice ai de ales între pool și PAT; dacă ai una singură, PAT este singura soluție.
        </Callout>
        <Analogy>Imaginează-ți o clădire de birouri cu un singur număr de telefon public. Recepția (routerul NAT) primește apelurile de afară și le transferă la interioare; când cineva din birou sună în exterior, recepția îi dă numărul public al firmei. „Static” = un angajat are număr public propriu; „pool” = angajații primesc pe rând un număr public liber; „PAT” = toți folosesc același număr, iar recepția știe cui să transfere răspunsul după un „număr de dosar” (portul).</Analogy>
      </Detailed>
      <Traps items={[
        <>NAT nu este un firewall: traducerea ascunde adresa privată, dar protecția vine din ACL-uri/firewall. Static NAT, în plus, <b>deschide</b> gazda către exterior.</>,
        <>La examen, „inside source NAT” înseamnă că se traduce <b>sursa</b> pachetelor care vin din interior (nu destinația).</>,
        <>Fără <code>ip nat inside</code> și <code>ip nat outside</code> pe interfețe, nicio traducere nu pornește, oricât de corectă ar fi regula globală.</>,
      ]} />
      <InlineQuiz ids={['4.1-001', '4.1-002']} />
    </section>
  );
}

/* ======================================================================
   1. Cele patru adrese
   ====================================================================== */
export function TermsSection() {
  return (
    <section id="terms" className="section">
      <SectionHead id="terms" code="4.1" title="Terminologia: inside/outside, local/global" />
      <Summary>
        <p>Cisco descrie fiecare traducere prin patru nume. Două întrebări le deslușesc: <b>unde</b> se află gazda (<i>inside</i> = rețeaua ta, <i>outside</i> = restul) și <b>din ce perspectivă</b> o vezi (<i>local</i> = cum o vede rețeaua interioară, <i>global</i> = cum o vede Internetul).</p>
      </Summary>
      <Detailed title="1. Cele patru adrese">
        <Table head={['Termen', 'Ce este', 'Exemplu']} hlCol={0} rows={[
          ['Inside local', 'Adresa gazdei din interior, așa cum este configurată pe ea (de obicei privată).', '192.168.1.10'],
          ['Inside global', 'Adresa publică prin care Internetul vede gazda din interior.', '203.0.113.10'],
          ['Outside local', 'Adresa gazdei din exterior, așa cum o vede rețeaua interioară.', '198.51.100.5'],
          ['Outside global', 'Adresa reală a gazdei din exterior, așa cum o vede Internetul.', '198.51.100.5'],
        ]} />
        <p>Regula de memorare: „inside” = <b>gazda ta</b>, „outside” = <b>gazda cealaltă</b>. „Local” se vede în interiorul rețelei, „global” se vede în exterior. În NAT-ul obișnuit (inside source), gazda din exterior nu se traduce, deci <b>outside local = outside global</b>; singurele două adrese care diferă sunt inside local și inside global.</p>
        <Figure caption="Interactiv: urmărește cum se schimbă sursa pe drumul spre exterior și destinația pe drumul de întoarcere.">
          <NatFourAddresses />
        </Figure>
      </Detailed>
      <Detailed title="2. Ce face routerul, pas cu pas">
        <ol>
          <li>PC1 (192.168.1.10) trimite un pachet către serverul 198.51.100.5. Pachetul ajunge pe interfața marcată <code>ip nat inside</code>.</li>
          <li>Routerul caută ruta spre 198.51.100.5 și găsește interfața de ieșire (marcată <code>ip nat outside</code>).</li>
          <li>Pentru că pachetul trece din <i>inside</i> în <i>outside</i>, routerul verifică regulile NAT. Dacă sursa se potrivește, o înlocuiește cu adresa inside global și <b>scrie o intrare în tabela de traduceri</b>.</li>
          <li>Serverul răspunde către inside global (203.0.113.10). Pachetul intră pe interfața <i>outside</i>; routerul caută destinația în tabela de traduceri, o înlocuiește cu inside local și îl rutează spre PC1.</li>
        </ol>
        <Figure caption="Ordinea operațiilor: spre exterior întâi rutare, apoi NAT; spre interior întâi NAT, apoi rutare.">
          <NatOrderOfOps />
        </Figure>
        <Callout kind="exam" title="Ordinea contează la depanare">
          Spre exterior, ruta se alege cu adresa încă <b>privată</b>; spre interior, ruta se alege după ce destinația a revenit la adresa privată. Dacă ruta spre rețeaua privată lipsește, răspunsurile traduse nu pot fi livrate.
        </Callout>
      </Detailed>
      <DeepDive title="De ce routerul mai schimbă și sumele de control">
        <p>Adresa IP face parte din antetul IP (cu propria sumă de control) și intră în calculul sumelor de control TCP/UDP prin „pseudo-antet”. Când NAT modifică adresa (și portul), routerul recalculează aceste sume. De aceea protocoalele care <b>îngroapă adrese IP în datele aplicației</b> (de exemplu FTP activ sau SIP) au nevoie de un ajutor numit <i>ALG</i> (Application Layer Gateway) în NAT; fără el, aplicația anunță adresa privată peste care NAT nu poate „vedea”. Este o limită cunoscută a NAT-ului.</p>
      </DeepDive>
      <Traps items={[
        <>Cea mai frecventă confuzie: <b>inside global</b> este adresa <i>publică a gazdei tale</i>, nu adresa serverului din Internet (aceea este outside global).</>,
        <>„Local” nu înseamnă „privat” și „global” nu înseamnă „public” ca definiții; sunt <b>perspective</b>. În practică, însă, inside local este privată și inside global publică.</>,
        <>Un pachet nu are „patru adrese” simultan: are două (sursă și destinație). Cele patru nume etichetează aceleași gazde în cele două zone.</>,
      ]} />
      <InlineQuiz ids={['4.1-003', '4.1-004', '4.1-006']} />
    </section>
  );
}

/* ======================================================================
   2. Static NAT
   ====================================================================== */
export function StaticSection() {
  return (
    <section id="static" className="section">
      <SectionHead id="static" code="4.1" title="Static NAT: o mapare 1:1 permanentă" />
      <Summary>
        <p><G id="static-nat" /> leagă <b>o adresă privată de o adresă publică</b>, pentru totdeauna. Intrarea există în tabelă cât timp comanda e în configurație, iar traducerea funcționează și <b>din exterior spre interior</b>: Internetul poate iniția conexiuni către inside global. Este soluția pentru servere (web, mail) care trebuie să fie accesibile la o adresă publică fixă.</p>
      </Summary>
      <Detailed title="1. Cum funcționează">
        <p>Spre deosebire de celelalte tipuri, intrarea statică nu apare în urma unui pachet — ea există de la început, așa că <b>poate fi folosită și de un pachet venit din exterior</b>. Dacă un client din Internet trimite un pachet către 203.0.113.10, routerul îl vede în tabela de traduceri, schimbă destinația în 192.168.1.10 și îl rutează.</p>
        <Table head={['Aspect', 'Static NAT']} hlCol={0} rows={[
          ['Raport adrese', '1 privată ↔ 1 publică, fix'],
          ['Cine inițiază conexiunea', 'Oricare parte (inclusiv exteriorul)'],
          ['Intrare în tabelă', 'Permanentă, din configurație'],
          ['Folosit pentru', 'Servere accesibile din Internet, gazde care trebuie să aibă mereu aceeași adresă publică'],
          ['Număr de adrese publice', 'Una pentru fiecare gazdă mapată'],
        ]} />
        <CodeHint />
      </Detailed>
      <Detailed title="2. Static PAT (port forwarding) — varianta pe porturi">
        <p>Dacă ai o singură adresă publică și vrei să publici un server, poți mapa doar <b>un port</b>: de exemplu portul TCP 80 al adresei publice merge către serverul web intern. Sintaxa folosește protocolul și porturile: <code>ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80</code> (sau cu <code>interface</code> în loc de adresă). Este varianta statică a PAT; pentru exam ajunge să știi că există.</p>
      </Detailed>
      <Traps items={[
        <>Static NAT consumă o adresă publică pe gazdă — nu economisește adrese, doar le ascunde pe cele private.</>,
        <>Fără <code>ip nat inside</code>/<code>outside</code> pe interfețe, comanda statică există în configurație dar nu traduce nimic.</>,
        <>Dacă îți lipsește ruta de întoarcere (sau ISP-ul nu rutează adresa publică spre tine), conexiunile din exterior nu ajung la server, deși NAT e corect.</>,
      ]} />
      <InlineQuiz ids={['4.1-007', '4.1-008']} />
    </section>
  );
}

function CodeHint() {
  return (
    <Callout kind="tip" title="Sintaxa într-o linie">
      <code>ip nat inside source static &lt;inside local&gt; &lt;inside global&gt;</code> — prima adresă e cea privată, a doua cea publică. Exemplu: <code>ip nat inside source static 192.168.1.10 203.0.113.10</code>.
    </Callout>
  );
}

/* ======================================================================
   3. Dynamic NAT cu pool
   ====================================================================== */
export function PoolSection() {
  return (
    <section id="pool" className="section">
      <SectionHead id="pool" code="4.1" title="Dynamic NAT cu pool de adrese" />
      <Summary>
        <p><G id="dynamic-nat" /> mapează gazdele interioare la adrese publice dintr-un <b>pool</b> (un interval), <b>1:1 și la cerere</b>: prima gazdă care trimite trafic primește prima adresă liberă din pool, iar intrarea dispare după o perioadă de inactivitate. Doi parametri decid totul: <b>ce gazde</b> au voie să fie traduse (un ACL) și <b>din ce adrese</b> primesc (pool-ul).</p>
      </Summary>
      <Detailed title="1. Cele trei ingrediente">
        <ol>
          <li><b>Pool-ul</b> de adrese publice: <code>ip nat pool POOL1 203.0.113.20 203.0.113.30 netmask 255.255.255.0</code> (sau <code>prefix-length 24</code>).</li>
          <li><b>ACL-ul</b> care identifică gazdele care se traduc: <code>access-list 1 permit 192.168.1.0 0.0.0.255</code>. Aici ACL-ul <b>nu filtrează trafic</b>; <code>permit</code> = „traduce”, iar ce nu e permis rămâne netradus. Folosește <G id="wildcard-mask" />, nu mască de subrețea.</li>
          <li><b>Legătura</b> dintre ele: <code>ip nat inside source list 1 pool POOL1</code>.</li>
        </ol>
        <p>Cele trei se completează cu cele două comenzi pe interfețe (<code>ip nat inside</code> pe LAN, <code>ip nat outside</code> spre ISP).</p>
      </Detailed>
      <Detailed title="2. Ce se întâmplă când pool-ul se epuizează">
        <p>Dynamic NAT fără <code>overload</code> este strict 1:1. Dacă pool-ul are 11 adrese și 12 gazde trimit trafic simultan, a douăsprezecea <b>nu primește traducere</b>: pachetele ei sunt aruncate (routerul trimite un mesaj ICMP de tip „host unreachable”), până când o intrare expiră. Intrările dinamice se eliberează după timeout (implicit 24 de ore pentru o traducere simplă; <code>clear ip nat translation *</code> le șterge imediat).</p>
        <Callout kind="warn" title="Capcana clasică">
          Dacă ai mai multe gazde decât adrese în pool și <b>nu adaugi</b> <code>overload</code>, primele gazde merg și restul nu. Soluția este PAT.
        </Callout>
      </Detailed>
      <DeepDive title="Cine știe că adresele din pool există?">
        <p>Adresele din pool nu sunt configurate pe nicio interfață. Pentru ca răspunsurile să ajungă la tine, <b>ISP-ul trebuie să aibă o rută</b> către rețeaua pool-ului prin routerul tău — sau pool-ul este din aceeași subrețea cu legătura spre ISP, caz în care routerul tău poate răspunde la ARP pentru adresele traduse. De aceea, în practică, ISP-ul îți atribuie un bloc și îl rutează către tine.</p>
      </DeepDive>
      <Traps items={[
        <>ACL-ul din <code>ip nat inside source list</code> nu protejează nimic: <code>deny</code> înseamnă doar „nu traduce”, iar pachetul poate pleca în continuare cu adresa privată (pe care ISP-ul o aruncă).</>,
        <>Pool-ul se definește cu <b>mască</b>, nu wildcard; ACL-ul cu <b>wildcard</b>, nu mască. Cele două se încurcă des.</>,
        <>Dacă adresa de început a pool-ului este mai mare decât cea de final, comanda e respinsă; ambele capete sunt incluse.</>,
      ]} />
      <InlineQuiz ids={['4.1-010', '4.1-011', '4.1-012']} />
    </section>
  );
}

/* ======================================================================
   4. PAT
   ====================================================================== */
export function PatSection() {
  return (
    <section id="pat" className="section">
      <SectionHead id="pat" code="4.1" title="PAT (NAT overload): mulți către una" />
      <Summary>
        <p><G id="pat" /> este NAT-ul folosit în aproape toate rețelele reale: <b>toate gazdele din interior partajează o singură adresă publică</b> (sau câteva), iar routerul le deosebește după <b>portul sursă</b> TCP/UDP (sau identificatorul ICMP). O singură adresă poate susține zeci de mii de conexiuni simultane. Se activează cu cuvântul <code>overload</code>.</p>
      </Summary>
      <Detailed title="1. Cum deosebește routerul gazdele">
        <p>Tabela de traduceri nu mai conține doar adrese, ci perechi <b>adresă:port</b>. Două gazde pot folosi același port sursă local (cum ar fi 51000) — routerul le dă porturi globale diferite și, la întoarcere, caută în tabelă după portul de destinație.</p>
        <Figure caption="Interactiv: adaugă gazde și observă că adresa publică rămâne aceeași, dar portul se schimbă.">
          <PatTable />
        </Figure>
        <Table head={['Variantă', 'Comandă', 'Când']} hlCol={0} rows={[
          ['PAT cu adresa unei interfețe', 'ip nat inside source list 1 interface g0/1 overload', 'Un singur IP public, primit de obicei prin DHCP de la ISP'],
          ['PAT cu pool', 'ip nat inside source list 1 pool POOL1 overload', 'Mai multe adrese publice; când una se umple porturile, se trece la următoarea'],
        ]} />
      </Detailed>
      <Detailed title="2. Pool vs PAT — ce alegi">
        <Table head={['Criteriu', 'Dynamic NAT (pool)', 'PAT']} hlCol={0} rows={[
          ['Adrese publice', 'O adresă per gazdă activă', 'Una singură pentru sute de gazde'],
          ['Ce deosebește gazdele', 'Adresa publică', 'Adresa publică + portul'],
          ['Epuizare', 'Când se termină adresele', 'Când se termină porturile (foarte târziu)'],
          ['Folosit în practică', 'Rar', 'Aproape peste tot (rețele de casă, firme)'],
          ['Cuvânt-cheie', '(fără)', 'overload'],
        ]} />
        <Callout kind="exam" title="Cuvinte cheie de examen">
          „PAT”, „NAT overload”, „mulți la unul”, <code>overload</code>. Dacă enunțul spune „toate gazdele folosesc o singură adresă publică” → PAT. Dacă spune „accesibil din Internet” → static.
        </Callout>
      </Detailed>
      <DeepDive title="Limitele PAT">
        <p>Fiecare adresă publică oferă în jur de 64 000 de porturi, deci nu se epuizează de obicei. PAT nu poate găzdui conexiuni <b>inițiate din exterior</b> fără o regulă statică (port forwarding), pentru că nu există nicio intrare în tabelă până când o gazdă interioară nu trimite primul pachet. Operatorii care nu mai au adrese publice pun un al doilea NAT, la nivel de operator — <G id="cgnat" /> — iar protocoalele sensibile la adrese (FTP activ, VoIP) pot necesita ALG.</p>
      </DeepDive>
      <Traps items={[
        <>Fără <code>overload</code>, comanda cu <code>interface</code> sau <code>pool</code> este NAT dinamic 1:1, nu PAT: a doua gazdă nu primește traducere.</>,
        <>PAT cu <code>interface</code> folosește adresa <b>curentă</b> a interfeței; dacă DHCP-ul ISP-ului îți schimbă adresa, traducerile vechi se pierd.</>,
        <>Un server din interior nu este accesibil din Internet doar pentru că ai PAT; ai nevoie de static NAT sau de port forwarding.</>,
      ]} />
      <InlineQuiz ids={['4.1-014', '4.1-015', '4.1-016']} />
    </section>
  );
}
