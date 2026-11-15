import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { Guards, Handshake, RootElection, StateMap } from '../../diagrams/t2_5';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.5" title="Rapid PVST+ — imaginea de ansamblu" />
      <Summary>
        <p><G id="stp">STP</G> previne <b>buclele de nivel 2</b> dintr-o rețea cu linkuri redundante: alege un <b>root bridge</b>, calculează pentru fiecare switch cea mai bună cale spre el și <b>blochează</b> restul căilor. <b><G id="rapid-pvst">Rapid PVST+</G></b> este varianta Cisco bazată pe <G id="rstp">RSTP</G> (IEEE 802.1w) care rulează <b>o instanță pe VLAN</b> și converge în câteva secunde. Se activează cu <code>spanning-tree mode rapid-pvst</code>.</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial 2.5 este <i>Interpret basic operations of Rapid PVST+ Spanning Tree Protocol</i> — verbul este <b>interpret</b>: trebuie să citești un output și să spui cine este root, ce rol și ce stare are fiecare port și de ce. Sub-punctele oficiale:</p>
        <Table head={['Cod Cisco', 'Tema', 'Secțiunea']} hlCol={0} rows={[
          ['2.5.a', 'Root port, root bridge (primary/secondary) și alte nume de porturi', 'Root bridge, costuri și alegerea căii'],
          ['2.5.b', 'Stările și rolurile porturilor', 'Roluri, stări, handshake RSTP'],
          ['2.5.c', 'PortFast', 'PortFast'],
          ['2.5.d', 'Root guard, loop guard, BPDU filter, BPDU guard', 'Mecanisme de protecție'],
        ]} />

        <h3>De ce există STP: bucla de nivel 2</h3>
        <p>Un cadru Ethernet <b>nu are TTL</b>. Dacă între switch-uri există o buclă, un cadru de broadcast sau unicast necunoscut este retransmis la nesfârșit în cerc și se multiplică la fiecare switch: <b>broadcast storm</b>. În câteva secunde procesoarele și linkurile se saturează, iar tabelele MAC „sar” de pe un port pe altul (<i>MAC flapping</i>, 1.13). Dar linkurile redundante sunt dorite: dacă un cablu sau un switch cade, rețeaua trebuie să continue.</p>
        <p>STP rezolvă contradicția: <b>toate căile sunt cablate, dar numai o topologie fără bucle este activă</b>; porturile „în plus” sunt blocate și devin rezervă. Când o cale activă cade, STP deblochează una de rezervă.</p>
        <Analogy>Arborele de acoperire e ca o hartă de străzi cu sens: orașul are multe străzi interconectate (cablurile), dar poliția închide câteva intersecții astfel încât, de la oricare punct, există exact un drum către centru. Dacă o stradă e blocată de un accident, poliția redeschide una dintre cele închise.</Analogy>

        <h3>Evoluția: 802.1D → PVST+ → RSTP → Rapid PVST+</h3>
        <Table head={['Varianta', 'Standard', 'Caracteristici']} hlCol={0} rows={[
          ['STP (CST)', 'IEEE 802.1D', 'O singură instanță pentru toată rețeaua; convergență 30–50 s (blocking → listening → learning → forwarding)'],
          ['PVST+', 'Cisco (bazat pe 802.1D)', 'Câte o instanță STP pe VLAN; permite alegerea unor root-uri diferite per VLAN (load sharing); lent ca 802.1D'],
          ['RSTP', 'IEEE 802.1w (azi în 802.1D-2004)', 'Același scop, convergență rapidă prin handshake; stări Discarding/Learning/Forwarding; roluri noi (Alternate, Backup)'],
          ['Rapid PVST+', 'Cisco (bazat pe 802.1w)', <>Câte o instanță RSTP pe VLAN; <code>spanning-tree mode rapid-pvst</code></>],
          ['MST', 'IEEE 802.1s', 'Mapează grupuri de VLAN-uri pe un număr mic de instanțe (nu face parte din cerințele CCNA)'],
        ]} />
        <Callout kind="info" title="Care mod este implicit?">
          Pe majoritatea switch-urilor Catalyst clasice modul implicit este <b>PVST+</b>; Rapid PVST+ se alege explicit. Pe unele platforme/versiuni mai noi implicitul poate diferi: verifică cu <code>show spanning-tree summary</code> (prima linie spune modul). Pe examen, PVST+ este „implicitul Cisco”, iar Rapid PVST+ este cel pe care ți-l cere obiectivul.
        </Callout>
        <Callout kind="exam" title="Ce cere obiectivul: „interpret”">
          Întrebările tipice arată un <code>show spanning-tree</code> și cer: care switch este root, ce port este Root Port / Alternate, de ce un port este blocat (Discarding), ce cost are calea, ce se întâmplă dacă schimbi prioritatea sau cablezi un switch nou. Scopul lecției este să-ți dea un algoritm mental pas cu pas, nu comenzi memorate.
        </Callout>
      </Detailed>

      <Traps items={[
        <>Un cadru Ethernet <b>nu are TTL</b>: de aceea bucla L2 este fatală și STP este necesar.</>,
        <>Rapid PVST+ = <b>RSTP, per VLAN</b>; PVST+ = STP clasic, per VLAN.</>,
        <>STP nu elimină linkurile redundante; le <b>blochează logic</b> și le păstrează ca rezervă.</>,
      ]} />
      <InlineQuiz ids={['2.5-001', '2.5-002', '2.5-004']} />
    </section>
  );
}

/* ======================================================================
   2.5.a Root bridge, costuri, root port
   ====================================================================== */
export function RootBridge() {
  return (
    <section id="root" className="section">
      <SectionHead id="root" code="2.5.a" title="Root bridge, root port, root primary/secondary" />
      <Summary>
        <p>Switch-urile schimbă <b><G id="bpdu">BPDU</G></b>-uri. Câștigă rolul de <b><G id="root-bridge">root bridge</G></b> switch-ul cu cel mai mic <b><G id="bridge-id">Bridge ID</G></b> (prioritate + MAC). Fiecare alt switch alege un singur <b><G id="root-port">root port</G></b>: portul cu cea mai mică cale (cost) spre root. Pe fiecare segment, switch-ul cu calea cea mai bună are portul <b><G id="designated-port">designated</G></b>. Controlezi alegerea cu <code>spanning-tree vlan N priority …</code> sau <code>root primary|secondary</code>.</p>
      </Summary>

      <Detailed title="1. BPDU și Bridge ID">
        <p>Un <b>BPDU</b> (<i>Bridge Protocol Data Unit</i>) este cadrul de control al STP, trimis la adresa multicast <code>0180.C200.0000</code> (<code>01-80-C2-00-00-00</code>). Conține, printre altele: <b>Root Bridge ID</b> (cine crede expeditorul că este root), <b>Root Path Cost</b> (costul de la expeditor până la root), <b>Sender Bridge ID</b> și <b>Port ID</b> al expeditorului, plus timerele (hello, max age, forward delay).</p>
        <p><b>Bridge ID</b> = <b>Bridge Priority</b> (16 biți) + <b>MAC</b> (48 biți). La PVST+/Rapid PVST+ cei 16 biți de prioritate sunt împărțiți în <b>4 biți de prioritate reală</b> (multipli de 4096) și <b>12 biți de <G id="extended-system-id">extended system ID</G></b> = numărul VLAN-ului. De aceea:</p>
        <Table head={['Prioritate configurată', 'VLAN', 'Prioritate afișată în show spanning-tree']} hlCol={2} rows={[
          ['32768 (implicit)', '1', '32769'],
          ['32768 (implicit)', '10', '32778'],
          ['24576', '10', '24586'],
          ['4096', '20', '4116'],
        ]} />
        <p>Prioritatea se setează doar în <b>multipli de 4096</b> (0, 4096, 8192, … 61440).</p>

        <h3>2. Alegerea root bridge</h3>
        <ol>
          <li>La pornire, fiecare switch se consideră root și anunță BPDU-uri cu propriul Bridge ID în câmpul „Root”.</li>
          <li>Când un switch primește un BPDU cu un Root Bridge ID <b>mai mic</b> decât al lui, acceptă acel root și începe să-i retransmită BPDU-ul (cu costul actualizat).</li>
          <li>După câteva schimburi, <b>cel mai mic Bridge ID</b> din rețea (prioritate mai mică; la egalitate, MAC mai mic) este recunoscut de toți ca root.</li>
        </ol>
        <Callout kind="warn" title="Capcana clasică: switch-ul cel mai vechi devine root">
          Cu priorități implicite egale, câștigă <b>MAC-ul mai mic</b> — de obicei switch-ul cel mai vechi, adesea unul de acces, slab, în capătul rețelei. Tot traficul ajunge să treacă prin el. Alegi root-ul <b>intenționat</b> (switch-ul de distribuție/core) setând prioritatea.
        </Callout>

        <Figure caption="Interactiv: schimbă prioritățile și vezi cum se mută root-ul și porturile alternate (triunghi de 3 switch-uri, toate linkurile 1 Gbps, VLAN 10).">
          <RootElection />
        </Figure>

        <h3>3. Costul căii (path cost)</h3>
        <p>Costul unui port depinde de <b>viteza lui</b>: cu cât linkul e mai rapid, cu atât costul e mai mic. <b>Root Path Cost</b> = suma costurilor porturilor de <b>ieșire</b> prin care BPDU-ul a ajuns la un switch (se adaugă costul portului pe care <b>se primește</b> BPDU-ul).</p>
        <Table head={['Viteză', 'Cost „short” (802.1D-1998, implicit Cisco)', 'Cost „long” (802.1D-2004)']} hlCol={0} rows={[
          ['10 Mbps', '100', '2 000 000'],
          ['100 Mbps', '19', '200 000'],
          ['1 Gbps', '4', '20 000'],
          ['10 Gbps', '2', '2 000'],
        ]} />
        <p>Metoda „long” se activează cu <code>spanning-tree pathcost method long</code> și util la viteze mari (valorile short nu mai disting 10 Gbps de 40/100 Gbps). Costul unui port se poate modifica pe interfață cu <code>spanning-tree vlan N cost X</code> (sau <code>spanning-tree cost X</code>).</p>

        <h3>4. Root port: criteriile de alegere</h3>
        <p>Fiecare switch non-root alege <b>exact un root port</b>. Criteriile, în ordine, până apare un câștigător:</p>
        <ol>
          <li><b>Cel mai mic Root Path Cost</b> spre root;</li>
          <li>La egalitate: cel mai mic <b>Sender Bridge ID</b> (switch-ul din care a venit BPDU-ul);</li>
          <li>La egalitate: cea mai mică <b>Sender Port Priority</b> (implicit 128);</li>
          <li>La egalitate: cel mai mic <b>Sender Port Number</b>.</li>
        </ol>
        <p>Același set de criterii (cost, BID, prioritate port, număr port) decide și <b>designated port-ul</b> de pe fiecare segment: pe fiecare link (segment) există <b>exact un port designated</b>, cel al switch-ului cu calea mai bună spre root. Toate porturile root bridge-ului sunt designated.</p>

        <h3>5. Root primary / root secondary</h3>
        <ul>
          <li><code>spanning-tree vlan 10 priority 4096</code> — setezi prioritatea explicit.</li>
          <li><code>spanning-tree vlan 10 root primary</code> — macro: setează prioritatea suficient de mică ca switch-ul să devină root (de obicei 24576, sau cu 4096 mai mică decât a root-ului curent dacă acela are deja o valoare mică). Se calculează <b>la momentul rulării</b> și apare în running-config ca <code>priority</code>.</li>
          <li><code>spanning-tree vlan 10 root secondary</code> — macro: setează o prioritate (de obicei 28672) astfel încât switch-ul să devină root dacă primary cade.</li>
        </ul>
        <Callout kind="tip" title="Practica obișnuită">
          Root primary pe switch-ul de distribuție A, root secondary pe distribuția B; pentru load sharing: A este primary pentru VLAN-urile 10–19 și secondary pentru 20–29, B invers. Asta e avantajul „per VLAN” al PVST+/Rapid PVST+ (cu EtherChannel ca să nu blochezi linkul dintre ele, 2.4).
        </Callout>
      </Detailed>

      <DeepDive title="Cum evoluează BPDU-urile și ce înseamnă „best BPDU”">
        <p>Fiecare port memorează <b>cel mai bun BPDU primit</b> (superior vector: Root BID, Root Path Cost, Sender BID, Sender Port ID). Un port rămâne <b>designated</b> pe un segment doar dacă BPDU-ul <b>lui</b> este mai bun decât orice a primit. Dacă primește unul mai bun, el cedează rolul și devine root port (dacă e cea mai bună cale spre root) sau alternate/non-designated. În RSTP, BPDU-urile sunt trimise <b>de fiecare switch la fiecare hello (2 s)</b>, nu doar retransmise din root, iar vecinul este declarat pierdut după <b>3 hello-uri</b> ratate (≈6 s), nu după max-age de 20 s.</p>
      </DeepDive>

      <Traps items={[
        <>Câștigă cel mai <b>mic</b> Bridge ID: prioritate mică ⇒ root. Prioritatea trebuie să fie multiplu de <b>4096</b>.</>,
        <>Prioritatea afișată include <b>VLAN-ul</b> (extended system ID): 32769 la VLAN 1, 32778 la VLAN 10.</>,
        <>Un switch non-root are <b>exact un root port</b>; root bridge-ul nu are root port.</>,
        <>Root Path Cost adună costurile porturilor prin care BPDU-ul <b>intră</b> pe switch-urile din drum; costul se calculează din viteza portului.</>,
        <>Cost implicit (short): 10 Mbps 100 · 100 Mbps 19 · 1 Gbps 4 · 10 Gbps 2.</>,
      ]} />
      <InlineQuiz ids={['2.5-006', '2.5-008', '2.5-010', '2.5-012']} />
    </section>
  );
}

/* ======================================================================
   2.5.b Roluri și stări
   ====================================================================== */
export function RolesStates() {
  return (
    <section id="roles" className="section">
      <SectionHead id="roles" code="2.5.b" title="Rolurile și stările porturilor; cum converge RSTP" />
      <Summary>
        <p><b>Rolul</b> spune ce „funcție” are portul în topologie (Root, Designated, <G id="alternate-port">Alternate</G>, <G id="backup-port">Backup</G>, Disabled); <b>starea</b> spune ce face portul acum (<G id="discarding">Discarding</G>, Learning, Forwarding). Root și Designated sunt în Forwarding; Alternate și Backup în Discarding. RSTP converge prin handshake <b>proposal/agreement</b> în ≈1–2 s, față de 30–50 s la 802.1D.</p>
      </Summary>

      <Detailed title="1. Cele cinci roluri RSTP">
        <Table head={['Rol', 'Unde apare', 'Stare tipică']} hlCol={0} rows={[
          [<b>Root</b>, 'Pe switch-ul non-root: portul cu cea mai bună cale spre root (unul singur pe switch)', 'Forwarding'],
          [<b>Designated</b>, 'Pe fiecare segment: portul switch-ului cu calea cea mai bună spre root (toate porturile root-ului)', 'Forwarding'],
          [<b>Alternate</b>, 'Pe un switch: un port care primește BPDU mai bun de la alt switch; este calea de rezervă spre root (în STP clasic: blocking)', 'Discarding'],
          [<b>Backup</b>, 'Pe un switch: un al doilea port conectat la același segment (de exemplu un hub) ca un port designated al aceluiași switch', 'Discarding'],
          [<b>Disabled</b>, 'Port oprit administrativ sau fără link', 'Discarding (raportat)'],
        ]} />
        <p>Un algoritm mental pentru a „interpreta” o topologie:</p>
        <ol>
          <li>Găsește root bridge-ul (cel mai mic BID). <b>Toate porturile lui sunt Designated.</b></li>
          <li>Pe fiecare switch non-root: calculează costul spre root pe fiecare port; cel mai mic = <b>Root Port</b>.</li>
          <li>Pe fiecare segment rămas: compară costul spre root al celor doi vecini; câștigătorul are <b>Designated</b>; celălalt port este <b>Alternate</b> (Discarding).</li>
        </ol>

        <h3>2. Stările</h3>
        <Table head={['Stare 802.1D', 'Stare 802.1w', 'Date?', 'Învață MAC?']} hlCol={0} rows={[
          ['Disabled', 'Discarding', 'nu', 'nu'],
          ['Blocking', 'Discarding', 'nu', 'nu'],
          ['Listening', 'Discarding', 'nu', 'nu'],
          ['Learning', 'Learning', 'nu', 'da'],
          ['Forwarding', 'Forwarding', 'da', 'da'],
        ]} />
        <Figure caption="Interactiv: alege starea 802.1D și vezi corespondentul ei RSTP.">
          <StateMap />
        </Figure>
        <p>În STP clasic, un port nou trece prin <b>Blocking (max age 20 s) → Listening (15 s) → Learning (15 s) → Forwarding</b>, deci 30 s (sau 50 s când trebuie să aștepte și max age). RSTP a observat că „Blocking”, „Listening” și „Disabled” se comportă identic față de date — nu transmit — și le-a unit în <b>Discarding</b>.</p>

        <h3>3. De ce RSTP converge rapid: handshake-ul proposal/agreement</h3>
        <p>STP clasic se bazează pe <b>timere</b>: un port nu are cum să știe dacă e sigur să trimită, deci așteaptă. RSTP înlocuiește așteptarea cu <b>negociere</b> între switch-uri vecine, pe linkuri punct-la-punct (full duplex):</p>
        <Figure caption="Pas cu pas: un link nou între SW-A (mai aproape de root) și SW-B.">
          <Handshake />
        </Figure>
        <ul>
          <li>Un port <b>designated</b> trimite <b>Proposal</b>; vecinul „sincronizează” (pune în Discarding porturile non-edge) și răspunde cu <b>Agreement</b>; portul trece <b>imediat în Forwarding</b>. Procesul se propagă în aval, switch cu switch.</li>
          <li><b>Alternate</b> port: dacă root portul cade, alternate-ul poate deveni imediat Root Port și Forwarding (caz echivalent cu UplinkFast din STP clasic, integrat).</li>
          <li><b>Detectarea defectelor:</b> BPDU-uri la fiecare 2 s de la fiecare switch; 3 BPDU pierdute ⇒ vecin pierdut (≈6 s); căderea unui link (down) este detectată instant.</li>
        </ul>
        <Table head={['Tip de link (RSTP)', 'Cum se determină', 'Efect']} hlCol={0} rows={[
          ['Point-to-point', 'full duplex', 'Poate folosi handshake-ul rapid'],
          ['Shared', 'half duplex (de exemplu un hub)', 'Revine la comportament bazat pe timere (lent)'],
          ['Edge', 'PortFast configurat (2.5.c)', 'Forwarding imediat, fără handshake; nu generează TCN la schimbări'],
        ]} />
        <Callout kind="exam" title="Timere și convergență — cifre care se cer">
          STP clasic: hello <b>2 s</b>, forward delay <b>15 s</b>, max age <b>20 s</b>, convergență ≈ <b>30–50 s</b>. RSTP: convergență tipic în <b>≈1–2 secunde</b> pe linkuri punct-la-punct (nu e o garanție fixă). BPDU-urile merg la <code>0180.C200.0000</code>.
        </Callout>

        <h3>4. Citirea unui output</h3>
        <p>Comanda <code>show spanning-tree vlan 10</code> afișează rolurile și stările: coloana <b>Role</b> (Root, Desg, Altn, Back), <b>Sts</b> (FWD, LRN, BLK în notația Cisco; Rapid PVST+ afișează tot FWD/BLK pentru Discarding), <b>Cost</b>, <b>Prio.Nbr</b> (port priority . port number) și <b>Type</b> (P2p, Shr, Edge). Exemple de citit în secțiunea de configurare.</p>
      </Detailed>

      <Traps items={[
        <>Alternate = vechiul „blocking”: calea de rezervă spre root. Backup apare doar când două porturi ale <b>aceluiași switch</b> sunt pe același segment (hub).</>,
        <>Root și Designated = Forwarding; Alternate și Backup = Discarding.</>,
        <>RSTP are <b>3 stări</b> (Discarding, Learning, Forwarding); 802.1D are 5 (cu Disabled).</>,
        <>Handshake-ul rapid funcționează pe linkuri <b>punct-la-punct (full duplex)</b>; pe shared (half duplex) convergența e lentă.</>,
        <>Pe fiecare segment există <b>un singur</b> port designated; root bridge-ul nu are root port.</>,
      ]} />
      <InlineQuiz ids={['2.5-014', '2.5-016', '2.5-018', '2.5-020']} />
    </section>
  );
}

/* ======================================================================
   2.5.c PortFast
   ====================================================================== */
export function PortFast() {
  return (
    <section id="portfast" className="section">
      <SectionHead id="portfast" code="2.5.c" title="PortFast" />
      <Summary>
        <p><b><G id="portfast">PortFast</G></b> declară un port ca <b>edge port</b> (conectat la un host, nu la alt switch): portul trece <b>direct în Forwarding</b>, fără să aștepte negocierea STP, și o schimbare de stare a lui nu declanșează TCN. Se activează pe interfață cu <code>spanning-tree portfast</code> sau global pentru toate porturile access cu <code>spanning-tree portfast default</code>. Se folosește <b>doar pe porturi spre dispozitive finale</b>, de obicei împreună cu BPDU Guard.</p>
      </Summary>
      <Detailed title="De ce există și cum lucrează">
        <p>Un PC care pornește are nevoie de DHCP imediat. Dacă portul switch-ului ar trece prin Listening/Learning (30 s în STP clasic, mai puțin în RSTP, dar tot cu handshake), clientul ar primi eroare DHCP sau „fără rețea”. Dar un port spre un PC <b>nu poate crea o buclă</b> (în principiu) — nu există alt switch în spate. PortFast scoate portul din procesul de așteptare.</p>
        <ul>
          <li><b>Efect:</b> link up ⇒ Forwarding instant.</li>
          <li><b>În RSTP</b> acest tip de port se numește <b>edge port</b> (apare ca <code>Edge</code> în coloana Type din <code>show spanning-tree</code>).</li>
          <li><b>Nu dezactivează STP:</b> portul continuă să asculte BPDU-uri; dacă primește unul (de exemplu cineva conectează un switch), pierde starea de edge și se comportă ca un port STP normal. Pentru a bloca complet acest scenariu folosești BPDU Guard (2.5.d).</li>
          <li><b>Nu afectează TCN:</b> la schimbarea stării unui port edge nu se generează Topology Change Notification, deci nu se golesc inutil tabelele MAC ale switch-urilor.</li>
        </ul>
        <Table head={['Comandă', 'Efect']} hlCol={0} rows={[
          [<code>spanning-tree portfast</code>, 'Pe interfață (access): activează PortFast pe acel port.'],
          [<code>spanning-tree portfast trunk</code>, 'Pe un trunk spre un server/hypervisor (nu spre alt switch): permite PortFast pe trunk.'],
          [<code>spanning-tree portfast default</code>, 'Global: PortFast implicit pe toate porturile access (nu pe trunk-uri).'],
          [<code>no spanning-tree portfast</code>, 'Dezactivează.'],
          [<code>show spanning-tree interface g0/1 portfast</code>, 'Verifică dacă portul are PortFast.'],
        ]} />
        <Callout kind="warn" title="Pericolul PortFast pe porturi spre switch-uri">
          Dacă pui PortFast pe un port la care se conectează ulterior un switch (sau un hub cu bucle), portul poate intra în Forwarding înainte ca STP să verifice și să creeze o buclă temporară. Regula: <b>PortFast doar pe porturi spre hosturi</b>; pe trunk-uri între switch-uri niciodată (cu excepția cazurilor documentate). În versiunile recente apare și un avertisment la configurare.
        </Callout>
      </Detailed>
      <Traps items={[
        <>PortFast = <b>edge port</b>: doar spre hosturi, nu spre switch-uri.</>,
        <>PortFast <b>nu oprește STP</b>; dacă apare un BPDU, portul pierde starea edge (sau, cu BPDU Guard, intră în err-disabled).</>,
        <>Global: <code>spanning-tree portfast default</code> se aplică porturilor <b>access</b>, nu trunk-urilor.</>,
      ]} />
      <InlineQuiz ids={['2.5-022', '2.5-024', '2.5-026']} />
    </section>
  );
}

/* ======================================================================
   2.5.d Guards
   ====================================================================== */
export function GuardsSec() {
  return (
    <section id="guards" className="section">
      <SectionHead id="guards" code="2.5.d" title="Root guard, loop guard, BPDU filter, BPDU guard" />
      <Summary>
        <p>Patru mecanisme protejează topologia STP: <b><G id="bpdu-guard">BPDU Guard</G></b> (port edge care primește BPDU ⇒ <b>err-disabled</b>), <b><G id="bpdu-filter">BPDU Filter</G></b> (nu trimite/primește BPDU; periculos), <b><G id="root-guard">Root Guard</G></b> (un port nu are voie să primească BPDU superior ⇒ <b>root-inconsistent</b>) și <b><G id="loop-guard">Loop Guard</G></b> (un port non-designated care nu mai primește BPDU nu devine designated ⇒ <b>loop-inconsistent</b>).</p>
      </Summary>
      <Detailed title="1. Ce amenință STP">
        <p>STP are încredere în BPDU-urile primite. Asta creează riscuri: (1) cineva conectează un switch (sau un laptop cu bridging) la un port de utilizator ⇒ BPDU-uri neașteptate, posibilă alegere a unui root greșit; (2) un switch din afara controlului tău (client, alt departament) cu prioritate mică devine root; (3) un link unidirecțional sau un defect software oprește BPDU-urile într-o direcție și un port alternate presupune greșit că nu mai există root ⇒ buclă.</p>
        <Figure caption="Interactiv: alege un mecanism și vezi unde se pune, ce îl declanșează și ce face.">
          <Guards />
        </Figure>
        <Table head={['Mecanism', 'Unde', 'Declanșator', 'Efect', 'Comandă']} hlCol={0} rows={[
          ['BPDU Guard', 'Port edge (PortFast)', 'Primește orice BPDU', 'err-disabled; repornire manuală sau errdisable recovery', <><code>spanning-tree bpduguard enable</code> (interfață) · <code>spanning-tree portfast bpduguard default</code> (global)</>],
          ['BPDU Filter', 'Port edge', 'Interfață: filtrează tot; global: la pornire trimite puține BPDU, apoi tace; dacă primește BPDU, revine la STP normal', 'Interfață: STP ignorat pe port (risc de buclă)', <><code>spanning-tree bpdufilter enable</code> · <code>spanning-tree portfast bpdufilter default</code></>],
          ['Root Guard', 'Porturi spre switch-uri „client” (nu trebuie să devină root)', 'Primește BPDU superior', 'root-inconsistent (blocat); revine singur când dispare BPDU-ul superior', <code>spanning-tree guard root</code>],
          ['Loop Guard', 'Porturi Root și Alternate (linkuri punct-la-punct)', 'Nu mai primește BPDU', 'loop-inconsistent (blocat); revine când BPDU reapar', <><code>spanning-tree guard loop</code> · <code>spanning-tree loopguard default</code></>],
        ]} />

        <h3>2. BPDU Guard</h3>
        <p>Pui BPDU Guard pe porturile edge. Un host nu trimite BPDU; dacă portul primește unul, înseamnă că cineva a conectat un switch. Portul intră în <b>err-disabled</b> (<code>%SPANTREE-2-BLOCK_BPDUGUARD</code> în log) — protejează topologia, dar și întrerupe conexiunea până la intervenție: <code>shutdown</code> + <code>no shutdown</code> sau <code>errdisable recovery cause bpduguard</code> (reactivare automată după interval, implicit 300 s). Global, <code>spanning-tree portfast bpduguard default</code> aplică BPDU Guard pe toate porturile cu PortFast.</p>
        <h3>3. BPDU Filter</h3>
        <p>Filtrează BPDU-urile. Pe <b>interfață</b> (<code>spanning-tree bpdufilter enable</code>) portul nici nu trimite, nici nu procesează BPDU: STP este efectiv oprit pe port, iar o buclă ar trece neobservată — folosește cu mare grijă. <b>Global</b> (<code>portfast bpdufilter default</code>) se aplică porturilor PortFast și e mai sigur: dacă portul primește BPDU, pierde PortFast și revine la STP normal. Pe examen: <b>BPDU Filter ≠ BPDU Guard</b>; Guard pedepsește (err-disabled), Filter ascunde.</p>
        <h3>4. Root Guard</h3>
        <p>Pe porturile care duc spre switch-uri ce <b>nu trebuie niciodată să devină root</b> (alt departament, client al unui ISP). Dacă pe port apare un BPDU „mai bun” decât al root-ului actual, portul intră în <b>root-inconsistent</b> (discarding); când BPDU-urile superioare dispar, își revine automat. Se aplică pe porturi designated; nu se combină cu Loop Guard pe același port.</p>
        <h3>5. Loop Guard</h3>
        <p>Protejează de pierderea unidirecțională a BPDU-urilor. Un port Alternate care nu mai primește BPDU ar putea crede că root-ul a dispărut și să devină designated/forwarding ⇒ buclă. Cu Loop Guard portul rămâne blocat (<b>loop-inconsistent</b>) până reapar BPDU. Se aplică pe porturi non-designated (root/alternate) pe linkuri punct-la-punct.</p>
        <Table head={['Vrei să…', 'Folosește']} hlCol={1} rows={[
          ['… oprești un switch conectat la un port de utilizator', 'PortFast + BPDU Guard'],
          ['… împiedici un switch extern să devină root', 'Root Guard pe porturile spre el'],
          ['… previi bucle din linkuri unidirecționale', 'Loop Guard (sau UDLD)'],
          ['… ignori BPDU pe un port (rar, riscant)', 'BPDU Filter'],
        ]} />
      </Detailed>
      <Traps items={[
        <>BPDU Guard: port edge primește BPDU ⇒ <b>err-disabled</b> (nu doar „blocat”); se repornește manual sau cu errdisable recovery.</>,
        <>Root Guard ⇒ <b>root-inconsistent</b>, se recuperează singur; Loop Guard ⇒ <b>loop-inconsistent</b>.</>,
        <>BPDU Filter pe <b>interfață</b> dezactivează efectiv STP pe port — periculos.</>,
        <>Root Guard se pune pe porturi <b>spre exterior</b> (de unde nu vrei root); BPDU Guard pe porturi <b>spre hosturi</b>.</>,
      ]} />
      <InlineQuiz ids={['2.5-028', '2.5-030', '2.5-032', '2.5-034']} />
    </section>
  );
}
