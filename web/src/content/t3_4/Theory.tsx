import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { OspfDrElection, OspfNetworkTypes, OspfPacketFlow, OspfStates } from '../../diagrams/t3_4';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="3.4" title="OSPFv2 cu o singură zonă — imaginea de ansamblu" />
      <Summary>
        <p><b><G id="ospf" /></b> (Open Shortest Path First, versiunea 2 pentru IPv4) este un protocol de rutare dinamică <G id="link-state-routing" />: fiecare router descrie legăturile sale, toți primesc aceeași hartă a rețelei și calculează singuri cele mai scurte căi. În <b>single-area</b> toate routerele sunt în aceeași zonă, <b>area 0</b>. Rutele învățate apar în tabelă cu codul <code>O</code> și cu <G id="administrative-distance" /> 110.</p>
      </Summary>
      <Detailed>
        <p>În 3.3 am scris rutele manual. Acum învățăm un protocol care le <b>calculează și le actualizează singur</b> când apare o schimbare. Obiectivul oficial 3.4 este <i>Configure and verify single area OSPFv2</i>, cu patru sub-puncte:</p>
        <Table head={['Sub-punct oficial', 'Ce trebuie să știi', 'Secțiunea']} hlCol={0} rows={[
          ['3.4.a Neighbor adjacencies', 'Cum se descoperă vecinii (Hello), prin ce stări trec și ce trebuie să se potrivească', 'Vecini și adiacențe'],
          ['3.4.b Point-to-point', 'Tipul de rețea punct-la-punct: fără DR/BDR; cum se setează pe Ethernet', 'Point-to-point'],
          ['3.4.c Broadcast (DR/BDR selection)', 'Pe Ethernet, DR și BDR reduc adiacențele; cum se aleg și de ce alegerea nu e preemptivă', 'Broadcast și DR/BDR'],
          ['3.4.d Router ID', 'Identificatorul unic al routerului: cum se alege și cum se schimbă', 'Router ID'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Codurile oficiale (3.4.a–d) se păstrează, în ordinea a, b, c, d. Înainte de sub-puncte, secțiunea de vecini explică <b>cum funcționează</b> OSPF pe fir; configurarea și verificarea sunt la sfârșit.
        </Callout>

        <h3>De ce există OSPF?</h3>
        <p>Înainte de OSPF, un protocol popular era <G id="rip" />, cu <G id="distance-vector" />: fiecare router trimitea periodic întreaga tabelă vecinilor și lua ca adevăr ce primea. Avea trei probleme care au motivat OSPF:</p>
        <ul>
          <li><b>Convergență lentă:</b> după o cădere, rutele se propagau pas cu pas, cu întârzieri și riscul de bucle.</li>
          <li><b>Metrică slabă:</b> RIP numără doar hop-urile și limitează distanța la 15, deci nu alege calea cu legătura cea mai rapidă.</li>
          <li><b>Trafic constant:</b> tabelele complete se trimit periodic, chiar și când nimic nu s-a schimbat.</li>
        </ul>
        <p>OSPF rezolvă aceste probleme prin <b>link-state</b>: routerele trimit doar descrierile legăturilor (<G id="lsa" />), când ceva se schimbă, și fiecare calculează singur rutele cu algoritmul <G id="spf-algorithm" />. Metrica este <G id="ospf-cost" />, derivată din viteza interfeței, nu din numărul de hop-uri.</p>
        <Analogy>RIP este ca a întreba pe fiecare drum „cum ajung la Cluj?” și a crede răspunsul vecinului. OSPF este ca și cum fiecare om ar avea aceeași hartă a țării, desenată din informațiile tuturor, și ar calcula singur drumul cel mai scurt. Când se închide un drum, toată lumea îl scoate de pe hartă și recalculează.</Analogy>

        <h3>Ce se întâmplă pe rând, de la pornire până la rută</h3>
        <Table head={['Pas', 'Ce face routerul', 'Unde se vede']} rows={[
          ['1. Hello', 'Trimite Hello la 224.0.0.5 și află vecinii', 'show ip ospf neighbor (Init)'],
          ['2. 2-WAY', 'Vede propriul RID în Hello-ul vecinului; pe Ethernet se alege DR/BDR', '2WAY/DROTHER sau FULL/DR'],
          ['3. ExStart → Full', 'Schimbă DBD, LSR, LSU, LSAck până are aceeași LSDB ca vecinul', 'FULL/DR, FULL/BDR, FULL/ -'],
          ['4. SPF', 'Rulează Dijkstra pe LSDB și alege cele mai ieftine căi', 'show ip route ospf (cod O)'],
        ]} />
        <Callout kind="warn" title="Ce înseamnă „single area”">
          Pentru CCNA, toate interfețele care participă la OSPF sunt în <b>area 0</b>. Ideea de zone (ABR, LSA tip 3, summarization) e pentru scară mare și se studiază în ENCOR. Nu confunda <G id="ospf-process-id" /> (numărul din router ospf 1, local) cu area ID (care trebuie să fie identic pe vecini).
        </Callout>
      </Detailed>
      <DeepDive title="De ce distance-vector a fost înlocuit și ce rămâne din el">
        <p>OSPF nu e perfect: cere mai multă memorie (LSDB) și CPU (SPF) decât un protocol distance-vector simplu, iar configurarea corectă a adiacențelor și a DR/BDR cere atenție. În schimb, convergența e rapidă și rutele nu depind de „zvonuri”. Întâlnești și <G id="eigrp" /> (Cisco) și <G id="bgp" /> (Internet), care au alte modele. În 3.4 ne concentrăm pe OSPFv2 cu o singură zonă, cu AD 110.</p>
      </DeepDive>
      <Traps items={[
        <>OSPF are AD <b>110</b> (nu 1, care e static, și nu 90, care e EIGRP). Dacă ai o rută statică cu AD 1 pentru același prefix, ea câștigă.</>,
        <>OSPF nu folosește TCP sau UDP: pachetele merg direct peste IP, cu protocolul <b>89</b>.</>,
        <>Tabela de rutare arată rutele OSPF cu codul <code>O</code>; rutele din zone diferite au alte coduri (O IA etc.), care nu sunt în scopul 3.4.</>,
        <>Un vecin care nu apare în <code>show ip ospf neighbor</code> nu există pentru OSPF, chiar dacă ping-ul către IP-ul lui merge.</>,
      ]} />
      <InlineQuiz ids={['3.4-001', '3.4-002']} />
    </section>
  );
}

/* ======================================================================
   3.4.a — Neighbor adjacencies
   ====================================================================== */
export function AdjacencySection() {
  return (
    <section id="adjacency" className="section">
      <SectionHead id="adjacency" code="3.4.a" title="Vecini și adiacențe" />
      <Summary>
        <p>Doi routere OSPF devin <G id="ospf-neighbor" />i când își trimit reciproc <G id="ospf-hello" />-uri. Devin <G id="ospf-adjacency" /> (adiacență completă, starea <b>Full</b>) abia când își sincronizează <G id="link-state-database" />. Doar adiacențele Full (și pe Ethernet, 2-WAY între DROTHER-i) contează pentru rutare. Verificarea se face cu <code>show ip ospf neighbor</code>.</p>
      </Summary>
      <Detailed title="1. Vecin vs. adiacență">
        <p>Diferența este importantă. <b>Vecinul</b> este un router pe care îl auzi: ai primit Hello-uri de la el. <b>Adiacența</b> înseamnă că ați schimbat și baza de date. Un vecin poate să stea în 2-WAY și să nu fie adiacență completă, și asta e normal pe Ethernet.</p>
        <p>Un <G id="ospf-hello" /> conține: RID-ul expeditorului, <G id="ospf-area" />, timerele <G id="ospf-timers" />, masca, <G id="ospf-priority" />, DR-ul și BDR-ul cunoscute și lista vecinilor pe care îi aude. Se trimite la <code>224.0.0.5</code> (AllSPFRouters), implicit la fiecare <b>10 secunde</b> pe Ethernet și point-to-point.</p>
        <Figure caption="Interactiv: alege o stare și vezi ce înseamnă, ce apare în show ip ospf neighbor și de ce contează.">
          <OspfStates />
        </Figure>
      </Detailed>
      <Detailed title="2. Ce trebuie să se potrivească">
        <p>Doi vecini formează adiacență doar dacă sunt de acord pe câteva câmpuri. Dacă unul nu se potrivește, relația nu avansează sau nu apare deloc.</p>
        <Table head={['Câmp', 'Trebuie să fie identic?', 'Ce se întâmplă dacă nu']} rows={[
          ['Area ID', 'Da', 'Nu se formează adiacența (vecinul nu apare)'],
          ['Subrețeaua și masca', 'Da (pe segmentul comun)', 'Hello-urile sunt ignorate; nu apar vecini'],
          ['Timerele Hello și Dead', 'Da', 'Nu apar vecini sau se pierd rapid'],
          ['Autentificare și flag-ul stub', 'Da', 'Nu se formează adiacența'],
          ['MTU', 'Da', 'Blocat în ExStart sau Exchange (cel mai frecvent)'],
          ['Router ID', 'Unic (nu identic)', 'Duplicatul produce comportament nesigur în LSDB'],
          ['Process ID', 'Nu (e local)', 'Nu contează pentru vecini'],
          ['Costul interfeței', 'Nu (poate diferi)', 'Afectează doar calea preferată'],
        ]} />
        <h3>3. Pachetele și schimbul de baze de date</h3>
        <p>OSPF are cinci tipuri de pachete, toate direct peste IP cu protocolul 89. Hello descoperă vecinii. DBD (Database Description) trimite un rezumat al LSDB-ului. LSR cere ce lipsește, LSU trimite conținutul, iar LSAck confirmă. Figura de mai jos arată ordinea între doi routere.</p>
        <Figure caption="Schema: secvența pachetelor OSPF între R1 și R2. Hello → DBD → LSR → LSU → LSAck.">
          <OspfPacketFlow />
        </Figure>
        <h3>4. Cum citești show ip ospf neighbor</h3>
        <CodeBlock title="R1 — vecinii pe două interfețe (ilustrativ)" kind="session" code={`R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           1   FULL/DR         00:00:36    10.0.0.3        GigabitEthernet0/0
2.2.2.2           1   FULL/BDR        00:00:33    10.0.0.2        GigabitEthernet0/0
2.2.2.2           1   FULL/DR         00:00:38    10.0.12.2       GigabitEthernet0/1`} explain={[
          ['Neighbor ID', 'RID-ul vecinului (nu adresa lui IP).'],
          ['Pri', 'Prioritatea vecinului, folosită la alegerea DR (vezi 3.4.c).'],
          ['State', 'Starea urmată de rol: FULL/DR, FULL/BDR, 2WAY/DROTHER sau FULL/ - (point-to-point, fără rol).'],
          ['Dead Time', 'Cât mai rămâne până se declară vecinul picat, dacă nu mai vine niciun Hello.'],
          ['Interface', 'Pe ce interfață locală a fost învățat vecinul; același RID poate apărea pe mai multe interfețe.'],
        ]} />
        <Callout kind="info" title="Output ilustrativ">
          Formatul și valorile (Dead Time, ordinea coloanelor) variază între IOS și Packet Tracer. Comanda <b>nu a fost testată</b> de autorul lecției pe echipamente reale; folosește exemplul ca model de citire, nu ca rezultat garantat.
        </Callout>
      </Detailed>
      <DeepDive title="Blocaj în ExStart/Exchange: MTU și diagnostic">
        <p>Dacă vecinul rămâne în <b>ExStart</b> sau <b>Exchange</b> și nu ajunge la Full, cauza cea mai frecventă este un <G id="mtu" /> diferit pe cele două interfețe, pentru că DBD-urile sunt prea mari pentru un capăt. Verifică MTU cu <code>show interfaces</code> pe ambele capete. Dacă vecinul rămâne în <b>2-WAY</b> pe o rețea cu mai mulți routere, verifică mai întâi dacă ești DROTHER și vecinul e tot DROTHER: în acest caz e normal.</p>
      </DeepDive>
      <Traps items={[
        <>Vecinul apare în <code>show ip ospf neighbor</code> cu o stare, nu înseamnă automat că rutele trec: rutele apar doar cu adiacență Full (sau 2-WAY pe Ethernet între DROTHER-i, unde nu se schimbă LSDB).</>,
        <>2-WAY între doi DROTHER-i este <b>normal</b>, nu o eroare.</>,
        <>ExStart sau Exchange blocat înseamnă aproape sigur <b>MTU diferit</b>, nu un Hello lipsă.</>,
        <>Hello-urile trebuie să se potrivească (timere, area, mască); un singur parametru diferit oprește adiacența.</>,
        <>Pasiv (<G id="passive-interface" />) oprește Hello-urile: vecinul nu apare, deși rețeaua rămâne anunțată.</>,
      ]} />
      <InlineQuiz ids={['3.4-005', '3.4-006', '3.4-007', '3.4-009']} />
    </section>
  );
}

/* ======================================================================
   3.4.b — Point-to-point
   ====================================================================== */
export function PointToPointSection() {
  return (
    <section id="p2p" className="section">
      <SectionHead id="p2p" code="3.4.b" title="Tipul de rețea point-to-point" />
      <Summary>
        <p>Un <G id="ospf-network-type" /> spune OSPF cum să se comporte pe o interfață. <b>Point-to-point</b> înseamnă că există exact două routere pe segment: nu se alege DR și nu există BDR. Implicit pe <b>serial cu HDLC sau PPP</b>; pe <b>Ethernet</b> se poate forța cu <code>ip ospf network point-to-point</code>, pe ambele capete.</p>
      </Summary>
      <Detailed title="1. De ce există tipul point-to-point">
        <p>Pe un link cu doar două routere, alegerea unui DR n-ar avea sens: nu există alți vecini de coordonat. Tipul point-to-point elimină alegerea și simplifică adiacența: fiecare router are un singur vecin pe link, deci o singură adiacență. Hello-urile se trimit în continuare la <code>224.0.0.5</code>, iar timerele implicite sunt 10 s și 40 s.</p>
        <h3>2. Tipurile de rețea OSPF</h3>
        <Table head={['Tip', 'Implicit pe', 'Hello / Dead', 'DR/BDR?']} rows={[
          ['Broadcast', 'Ethernet', '10 s / 40 s', 'Da'],
          ['Point-to-point', 'Serial HDLC/PPP, sau setat pe Ethernet', '10 s / 40 s', 'Nu'],
          ['NBMA (non-broadcast)', 'Frame Relay pe interfața fizică', '30 s / 120 s', 'Da, cu vecini statici'],
          ['Point-to-multipoint', 'Setat manual', '30 s / 120 s', 'Nu'],
        ]} />
        <p>NBMA și point-to-multipoint nu sunt subiectul principal al CCNA; le recunoști din tabel. Pentru 3.4.b contează point-to-point și broadcast.</p>
        <h3>3. Configurare pe Ethernet</h3>
        <p>Pe un link Gigabit dedicat între două routere, poți forța tipul point-to-point. Comanda se dă pe <b>ambele capete</b>, în modul interfeței:</p>
        <CodeBlock title="R1 și R2, pe linkul 10.0.12.0/30 (ilustrativ)" kind="config" code={`R1(config)# interface g0/1
R1(config-if)# ip ospf network point-to-point

R2(config)# interface g0/1
R2(config-if)# ip ospf network point-to-point`} explain={[
          ['ip ospf network point-to-point', 'Setează tipul de rețea pe interfață; se scrie cu prefixul ip ospf, nu în router ospf.'],
          ['pe ambele capete', 'Tipul trebuie să fie consecvent pe segmentul comun; altfel vecinii se comportă diferit.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip ospf interface g0/1
...
  Process ID 1, Router ID 1.1.1.1, Network Type POINT_TO_POINT, Cost: 1
...
R1# show ip ospf neighbor
Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           0   FULL/  -        00:00:35    10.0.12.2       GigabitEthernet0/1`} explain={[
          ['Network Type POINT_TO_POINT', 'Confirmă că interfața a fost configurată ca point-to-point.'],
          ['FULL/  -', 'Starea Full fără rol DR/BDR: pe point-to-point rolul nu există.'],
        ]} />
        <Figure caption="Interactiv: același segment văzut ca broadcast (cu DR și BDR) și ca point-to-point (fără DR și BDR).">
          <OspfNetworkTypes />
        </Figure>
      </Detailed>
      <DeepDive title="Ce se întâmplă când tipurile nu se potrivesc">
        <p>Dacă un capăt este broadcast și celălalt point-to-point, pe același link, adiacența poate să se formeze (timerele implicite pe cele două tipuri sunt identice), dar comportamentul diferă: unul folosește DR/BDR, celălalt nu, și ruta către vecin poate avea o formă neașteptată. De aceea regula este: <b>același tip pe ambele capete</b>. La diagnostic compari <code>show ip ospf interface</code> pe amândouă.</p>
      </DeepDive>
      <Traps items={[
        <>Pe point-to-point <b>nu există</b> DR și BDR: rolul în show apare ca liniuță, <code>FULL/ -</code>.</>,
        <>Comanda este <code>ip ospf network point-to-point</code>, pe interfață. <code>network point-to-point</code> în router ospf nu este corectă.</>,
        <>Setarea pe un singur capăt nu e suficientă: tipul trebuie să fie consecvent pe amândouă.</>,
        <>Serialul are implicit point-to-point, dar Ethernet are implicit broadcast: nu presupune nimic, verifică cu <code>show ip ospf interface</code>.</>,
      ]} />
      <InlineQuiz ids={['3.4-014', '3.4-016', '3.4-017']} />
    </section>
  );
}

/* ======================================================================
   3.4.c — Broadcast și alegerea DR/BDR
   ====================================================================== */
export function DrBdrSection() {
  return (
    <section id="broadcast" className="section">
      <SectionHead id="broadcast" code="3.4.c" title="Broadcast și alegerea DR/BDR" />
      <Summary>
        <p>Pe un segment broadcast (Ethernet) cu mai mulți routere, fiecare router ar forma adiacență cu toți ceilalți. Ca să nu crească numărul de adiacențe pătratic, OSPF alege un <G id="designated-router" /> (DR) și un <G id="backup-designated-router" /> (BDR). Ceilalți sunt <G id="drother" />, care fac adiacență completă doar cu DR și BDR.</p>
      </Summary>
      <Detailed title="1. De ce există DR și BDR">
        <p>Dacă trei routere sunt pe același Ethernet și toate ar forma adiacență completă între ele, ar fi trei perechi. Cu patru routere, șase. Cu zece, patruzeci și cinci. Fiecare pereche schimbă LSA-uri și trimite pachete, deci traficul crește rapid. Soluția: fiecare DROTHER vorbește complet doar cu DR și BDR, iar DR-ul e punctul central care anunță toate informațiile segmentului.</p>
        <h3>2. Cum se alege DR-ul și BDR-ul</h3>
        <ol>
          <li>Se compară <G id="ospf-priority" />: câștigă prioritatea cea mai mare (implicit 1, interval 0–255).</li>
          <li>La egalitate, câștigă <G id="router-id" />-ul cel mai mare.</li>
          <li>Prioritatea <b>0</b> înseamnă că routerul nu candidează niciodată la DR sau BDR.</li>
          <li>Alegerea se face când segmentul se activează și când DR-ul cade (BDR-ul preia, apoi se alege un nou BDR).</li>
        </ol>
        <Callout kind="warn" title="Alegerea nu este preemptivă">
          Odată ales, DR-ul rămâne. Dacă pui o prioritate mai mare pe alt router, sau apare un router cu RID mai mare, nu îi ia rolul. Ca să se facă o nouă alegere trebuie resetat procesul OSPF (<code>clear ip ospf process</code>) sau interfața trebuie să facă flap. Resetul întrerupe adiacențele.
        </Callout>
        <Figure caption="Interactiv: patru routere pe un segment Ethernet. Alege un scenariu și vezi cum se schimbă rolurile.">
          <OspfDrElection />
        </Figure>
        <h3>3. Ce se vede în show</h3>
        <CodeBlock title="Verificare DR/BDR (ilustrativ)" kind="session" code={`R1# show ip ospf interface g0/0
  ...
  Network Type BROADCAST, Cost: 1
  Priority 1
  Designated Router (ID) 3.3.3.3, Interface address 10.0.0.3
  Backup Designated router (ID) 2.2.2.2, Interface address 10.0.0.2
  State DROTHER`} explain={[
          ['Network Type BROADCAST', 'Segmentul are DR și BDR.'],
          ['Priority 1', 'Prioritatea locală; implicită.'],
          ['Designated Router (ID) …', 'RID-ul și adresa DR-ului ales pe segment.'],
          ['State DROTHER', 'Routerul local nu e nici DR, nici BDR.'],
        ]} />
        <p>Pe DR, <code>State</code> va fi <code>DR</code>. Pe BDR, <code>BDR</code>. Pe un link point-to-point, <code>State</code> este <code>POINT_TO_POINT</code>.</p>
      </Detailed>
      <DeepDive title="Cum forțezi un DR dorit, fără surprize">
        <p>Dacă vrei un anumit DR (de exemplu routerul cel mai puternic), setezi prioritatea mai mare <b>înainte</b> ca OSPF să pornească pe segment, sau o setezi și apoi faci <code>clear ip ospf process</code> la momentul potrivit. Routerul cu <code>ip ospf priority 0</code> nu va fi niciodată DR, ceea ce e util pentru un router cu legătură slabă, pe care nu vrei să-l vezi ca DR. Reține că BDR-ul e separat: un router poate fi BDR fără să fie DR, iar la căderea DR-ului BDR-ul preia imediat.</p>
      </DeepDive>
      <Traps items={[
        <>DR și BDR există doar pe segmente <b>broadcast</b>. Pe point-to-point nu există.</>,
        <>DROTHER-ii nu formează adiacență completă între ei; 2-WAY este starea normală.</>,
        <>Ridicarea priorității nu schimbă DR-ul instant: alegerea nu e preemptivă.</>,
        <>Prioritatea 0 exclude routerul din alegere; prioritatea mai mare nu înseamnă „mai bun” automat, ci doar mai întâi în ordinea de alegere.</>,
        <>Când cade DR-ul, BDR-ul devine DR; nu așteaptă un reload.</>,
      ]} />
      <InlineQuiz ids={['3.4-020', '3.4-023', '3.4-025', '3.4-027']} />
    </section>
  );
}

/* ======================================================================
   3.4.d — Router ID
   ====================================================================== */
export function RouterIdSection() {
  return (
    <section id="rid" className="section">
      <SectionHead id="rid" code="3.4.d" title="Router ID (RID)" />
      <Summary>
        <p>Fiecare router OSPF are un <G id="router-id" /> (RID) de 32 de biți, scris ca o adresă IP, care îl identifică unic. Ordinea de alegere: <b>comanda router-id</b> (manuală); altfel cel mai mare IP de pe un <G id="loopback" /> up/up; altfel cel mai mare IP de pe o interfață fizică up/up. Schimbarea RID-ului se aplică abia după <code>clear ip ospf process</code> (sau reload).</p>
      </Summary>
      <Detailed title="1. Ce este și de ce contează">
        <p>RID-ul apare în pachetele Hello, în LSA-uri și în alegerea DR/BDR (ca ultim criteriu). Trebuie să fie <b>unic</b> în domeniul OSPF: două routere cu același RID produc comportament nesigur în LSDB, iar IOS semnalează un ID duplicat în log (formularea exactă variază). RID-ul <b>nu trebuie</b> să fie o adresă IP folosită în rețea: e doar un identificator.</p>
        <h3>2. Ordinea de alegere</h3>
        <Table head={['Pas', 'Sursa RID-ului', 'Observație']} rows={[
          ['1', 'Comanda router-id N.N.N.N în router ospf', 'Cea mai sigură: alegi tu'],
          ['2', 'Cel mai mare IP de pe o interfață loopback up/up', 'Recomandat: loopback-ul nu depinde de un link fizic'],
          ['3', 'Cel mai mare IP de pe o interfață fizică up/up', 'Se poate schimba când cade acea interfață'],
        ]} />
        <Callout kind="tip" title="Recomandare practică">
          Creează un loopback (de exemplu <code>interface loopback 0</code> cu <code>ip address 1.1.1.1 255.255.255.255</code>) și folosește-l pentru RID, sau setează <code>router-id</code> explicit. Astfel RID-ul nu se schimbă când cade un link.
        </Callout>
        <h3>3. Configurare și schimbare</h3>
        <CodeBlock title="R1 — RID explicit (ilustrativ)" kind="config" code={`R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1# clear ip ospf process
Reset ALL OSPF processes? [no]: yes`} explain={[
          ['router ospf 1', 'Procesul OSPF 1; numărul e local (process ID).'],
          ['router-id 1.1.1.1', 'RID-ul manual, în modul router ospf.'],
          ['clear ip ospf process', 'Aplică noul RID resetând procesul; confirmă cu yes. Întrerupe adiacențele pentru scurt timp.'],
        ]} />
        <CodeBlock title="Verificare RID (ilustrativ)" kind="session" code={`R1# show ip protocols
...
Routing Protocol is "ospf 1"
  Router ID 1.1.1.1`} explain={[
          ['Router ID 1.1.1.1', 'RID-ul folosit efectiv de procesul care rulează.'],
        ]} />
        <Callout kind="info" title="Output ilustrativ">
          Formatul exact al lui <code>show ip protocols</code> variază. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente reale.
        </Callout>
      </Detailed>
      <DeepDive title="Schimbi RID-ul, dar nu se vede: de ce?">
        <p>Routerul folosește RID-ul calculat la pornirea procesului. Dacă ai scris <code>router-id</code> pe un proces care rulează deja, vechiul RID rămâne până la <code>clear ip ospf process</code> sau reload. Verifică mereu cu <code>show ip protocols</code> sau <code>show ip ospf</code>, nu doar cu <code>show running-config</code>, care arată configurația, nu starea procesului.</p>
      </DeepDive>
      <Traps items={[
        <>Router ID-ul nu e process ID: <code>router ospf 1</code> are process ID 1, iar RID-ul e separat.</>,
        <>Ai scris <code>router-id</code> dar show arată vechiul RID? Lipsește <code>clear ip ospf process</code> (sau reload).</>,
        <>Fără loopback și fără <code>router-id</code>, RID-ul depinde de interfețele fizice, care se pot schimba la o cădere.</>,
        <>Două routere cu același RID: nu e permis; caută duplicatul înainte să te întrebi de ce LSDB-ul e greșit.</>,
      ]} />
      <InlineQuiz ids={['3.4-030', '3.4-031', '3.4-034']} />
    </section>
  );
}
