import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabCampusTopology, LabSpineLeafTopology } from '../../diagrams/t1_2';

/* ======================================================================
   LAB GHIDAT — de la two-tier la three-tier
   ====================================================================== */
export function GuidedLab() {
  const L = 'g12';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.2-G" title="Lab ghidat — construiește un campus two-tier, apoi transformă-l în three-tier (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> construiești un campus <G id="two-tier" /> (2 switch-uri de distribution 3560 + 3 switch-uri de access 2960 cu uplink-uri redundante), îi „descoperi” topologia doar cu <code>show cdp neighbors</code>, observi legăturile blocate de STP, apoi adaugi o a doua clădire și un strat de core ca să ajungi la <G id="three-tier" />.
          <br /><b>Timp estimat:</b> 50–70 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Partea A — topologia two-tier (collapsed core).">
        <LabCampusTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Model PT', 'Porturi', 'Adresă de management (VLAN 1)']} rows={[
        ['DSW1, DSW2', '3560-24PS', 'Fa0/1 ← ASW1 · Fa0/2 ← ASW2 · Fa0/3 ← ASW3 · Fa0/24 ↔ celălalt DSW', '192.168.10.2 / .3'],
        ['ASW1, ASW2, ASW3', '2960-24TT', 'Gi0/1 → DSW1 · Gi0/2 → DSW2 · Fa0/1, Fa0/2 → PC-uri', '192.168.10.101 / .102 / .103'],
        ['PC1 … PC6', 'PC-PT', 'FastEthernet0 → ASW', '192.168.10.11 … .16 /24'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu">
        PT modelează corect CDP, STP (inclusiv porturile blocate) și comutarea L2, așa că topologiile two-tier și three-tier se pot construi și observa complet. <b>Nu</b> modelează realist vitezele (oversubscription), iar pe 3560 ai doar două porturi Gigabit, de aceea unele legături sunt Gi ↔ Fa (negociază 100 Mbps — irelevant pentru scopul labului). În acest lab totul rămâne în VLAN 1, la nivel 2, ca să vezi efectul STP; într-un campus real distribution-ul ar fi granița L3 (vezi Exemplul 3 din configurare). În GNS3/CML poți repeta labul cu imagini IOSvL2.
      </Callout>

      <Detailed title="Partea A — campusul two-tier">
        <Step labKey={L} n={1} title="Plasează echipamentele">
          <p>Din <P>Network Devices → Switches</P>: două <b>3560-24PS</b> (DSW1, DSW2) și trei <b>2960-24TT</b> (ASW1–ASW3). Din <P>End Devices</P>: șase <b>PC</b>-uri. Așază-le pe trei rânduri, ca în diagramă: distribution sus, access la mijloc, PC-urile jos. Redenumește-le (<P>Config → Display Name</P>).</p>
          <Reveal label="De ce contează așezarea pe rânduri?"><p>Diagrama fizică reflectă arhitectura: un inginer care vede rândurile recunoaște imediat straturile access și distribution. Un desen haotic ascunde designul, chiar dacă cablarea e corectă.</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Cablează uplink-urile redundante">
          <p>Cu <P>Connections → Copper Cross-Over</P> (switch ↔ switch):</p>
          <ul>
            <li>ASW1 <code>Gi0/1</code> → DSW1 <code>Fa0/1</code> și ASW1 <code>Gi0/2</code> → DSW2 <code>Fa0/1</code></li>
            <li>ASW2 <code>Gi0/1</code> → DSW1 <code>Fa0/2</code> și ASW2 <code>Gi0/2</code> → DSW2 <code>Fa0/2</code></li>
            <li>ASW3 <code>Gi0/1</code> → DSW1 <code>Fa0/3</code> și ASW3 <code>Gi0/2</code> → DSW2 <code>Fa0/3</code></li>
            <li>DSW1 <code>Fa0/24</code> ↔ DSW2 <code>Fa0/24</code></li>
          </ul>
          <p>Cu <b>Copper Straight-Through</b>: fiecare PC <code>FastEthernet0</code> → ASW-ul lui (<code>Fa0/1</code> și <code>Fa0/2</code>).</p>
          <Reveal label="De ce cross-over între switch-uri?"><p>Două switch-uri transmit pe aceleași perechi, deci clasic au nevoie de cablu cross-over. Echipamentele moderne au <G id="auto-mdix" /> și acceptă orice cablu (topicul 1.3), dar în PT cross-over-ul funcționează sigur.</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Așteaptă convergența și observă legăturile „portocalii”">
          <p>La început toate legăturile switch–switch sunt portocalii (STP calculează). Așteaptă ≈30–50 s sau apasă <P>Fast Forward Time</P> de câteva ori. Unele legături rămân <b>portocalii</b> definitiv la un capăt.</p>
          <Reveal label="Ce înseamnă un capăt portocaliu permanent?"><p>Acel port a fost pus în starea <b>blocking</b> de <G id="stp" />: fiecare switch de access formează un triunghi cu DSW1 și DSW2 (o buclă), iar STP rupe bucla blocând un port. Legătura e fizic perfectă, dar nu transportă trafic.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Configurează hostname-urile și adresele de management">
          <CodeBlock title="Pe fiecare switch (exemplu ASW1)" code={`enable
configure terminal
hostname ASW1
interface vlan 1
 ip address 192.168.10.101 255.255.255.0
 no shutdown
end`} explain={[
            ['hostname ASW1', 'Numele apare la vecini în coloana Device ID din CDP — fără el, toate switch-urile s-ar numi „Switch”.'],
            ['interface vlan 1 / ip address …', 'Adresa de management (SVI-ul VLAN 1). Apare în `show cdp neighbors detail` și îți permite ping între switch-uri.'],
          ]} />
          <p>Repetă cu numele și adresele din tabel. Pe PC-uri: <P>Desktop → IP Configuration</P> → adresele 192.168.10.11 … .16, masca 255.255.255.0.</p>
        </Step>
        <Step labKey={L} n={5} title="Descoperă topologia doar cu CDP">
          <p>Imaginează-ți că nu ai văzut diagrama. Pe ASW1, apoi pe DSW1:</p>
          <CodeBlock title="ASW1 și DSW1" kind="session" code={`ASW1# show cdp neighbors
Device ID    Local Intrfce   Holdtme   Capability   Platform    Port ID
DSW1         Gig 0/1         150       S            3560        Fas 0/1
DSW2         Gig 0/2         150       S            3560        Fas 0/1
DSW1# show cdp neighbors
Device ID    Local Intrfce   Holdtme   Capability   Platform    Port ID
ASW1         Fas 0/1         152       S            2960        Gig 0/1
ASW2         Fas 0/2         152       S            2960        Gig 0/1
ASW3         Fas 0/3         152       S            2960        Gig 0/1
DSW2         Fas 0/24        152       S            3560        Fas 0/24`} explain={[
            ['ASW1: 2 vecini, ambii DSW', 'Un switch de access are vecini doar „în sus” (dual-homed) — nu vede alte switch-uri de access.'],
            ['DSW1: 3 ASW + DSW2', 'Un switch care vede TOATE switch-urile de access plus perechea lui este distribution (aici și core: collapsed core).'],
            ['Capability', 'În PT coloana poate arăta doar S (sau R S) — interpretarea rolului vine din cine-cu-cine e legat, nu din această coloană.'],
          ]} />
          <p>Pe o foaie (sau în <b>Notițe</b>), desenează topologia doar din aceste tabele. Apoi compar-o cu diagrama.</p>
          <Reveal label="Întrebare: câte switch-uri traversează un cadru de la PC1 la PC6?"><p>3: ASW1 → DSW (cel prin care trece calea activă STP) → ASW3. În two-tier, oricare două PC-uri de pe switch-uri de access diferite sunt la 3 switch-uri distanță.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Găsește porturile blocate de STP">
          <CodeBlock title="Pe fiecare ASW" kind="session" code={`ASW1# show spanning-tree
VLAN0001
...
Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- ----
Fa0/1            Desg FWD 19        128.1    P2p
Fa0/2            Desg FWD 19        128.2    P2p
Gi0/1            Root FWD 4         128.25   P2p
Gi0/2            Altn BLK 4         128.26   P2p`} explain={[
            ['Root FWD', 'Uplink-ul ales spre root bridge — transmite.'],
            ['Altn BLK', 'Uplink-ul redundant — blocat. Nu transportă trafic până la o defecțiune.'],
          ]} />
          <Reveal label="Întrebare: ce procent din uplink-urile de access transportă trafic?"><p>Tipic 50%: un uplink din două pe fiecare ASW este <b>BLK</b> (care anume depinde de ce switch a ales STP ca root — cu valori implicite câștigă MAC-ul cel mai mic). Exact această „risipă” a dus, în datacentere, la spine-leaf cu legături L3 și ECMP. În campus se rezolvă cu EtherChannel multi-chassis sau routed access.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Testează redundanța">
          <p>Pornește <code>ping -t 192.168.10.16</code> pe PC1 (de la PC1 la PC6). Șterge (<P>Delete</P>) legătura activă ASW1 <code>Gi0/1</code> → DSW1. Observă: ping-ul se oprește câteva zeci de secunde, apoi revine — STP a deblocat <code>Gi0/2</code>.</p>
          <Reveal label="De ce durează atât?"><p>STP clasic (802.1D) trece portul prin stările listening și learning (≈30 s) înainte de forwarding. Rapid PVST+ (802.1w) convergează în câteva secunde — topicul 2.5. Refă apoi legătura ștearsă.</p></Reveal>
        </Step>
      </Detailed>

      <Figure caption="Partea B — adaugi un al doilea bloc și un strat de core (three-tier).">
        <LabCampusTopology withCore />
      </Figure>
      <Detailed title="Partea B — de la two-tier la three-tier">
        <Step labKey={L} n={8} title="Adaugă a doua clădire (blocul B)">
          <p>Adaugă DSW3, DSW4 (3560-24PS), ASW4 (2960-24TT) și PC7, PC8 (192.168.10.17 și .18). Cablează ca la blocul A: ASW4 <code>Gi0/1</code> → DSW3 <code>Fa0/1</code>, ASW4 <code>Gi0/2</code> → DSW4 <code>Fa0/1</code>, DSW3 <code>Fa0/24</code> ↔ DSW4 <code>Fa0/24</code>. Management: DSW3 .4, DSW4 .5, ASW4 .104.</p>
          <Reveal label="Discuție: cum legi blocul B de blocul A FĂRĂ core?"><p>Pentru redundanță, fiecare DSW din A ar trebui legat de fiecare DSW din B: 2 × 2 = <b>4 legături</b>. Cu un al treilea bloc ar fi încă 4 + 4 = 8 legături noi (A–C și B–C), cu un al patrulea încă 12… Legăturile dintre blocuri cresc aproximativ cu pătratul numărului de blocuri. Acesta este momentul în care merită un core.</p></Reveal>
        </Step>
        <Step labKey={L} n={9} title="Adaugă perechea de core">
          <p>Adaugă CSW1, CSW2 (3560-24PS, management .6 și .7). Cablează (cross-over):</p>
          <ul>
            <li>fiecare DSW: <code>Gi0/1</code> → CSW1, <code>Gi0/2</code> → CSW2 (pe core folosește <code>Fa0/1</code> … <code>Fa0/4</code>, câte unul pentru DSW1 … DSW4)</li>
            <li>CSW1 <code>Gi0/1</code> ↔ CSW2 <code>Gi0/1</code></li>
          </ul>
          <Reveal label="Întrebare: câte legături noi trebuie pentru un al treilea bloc?"><p>Doar 4: fiecare dintre cele două DSW noi → CSW1 și CSW2. Indiferent câte blocuri există deja, un bloc nou costă mereu același număr de legături — scalare <b>liniară</b>.</p></Reveal>
        </Step>
        <Step labKey={L} n={10} title="Verifică noua ierarhie cu CDP">
          <CodeBlock title="CSW1" kind="session" code={`CSW1# show cdp neighbors
Device ID    Local Intrfce   Holdtme   Capability   Platform    Port ID
DSW1         Fas 0/1         160       S            3560        Gig 0/1
DSW2         Fas 0/2         160       S            3560        Gig 0/1
DSW3         Fas 0/3         160       S            3560        Gig 0/1
DSW4         Fas 0/4         160       S            3560        Gig 0/1
CSW2         Gig 0/1         160       S            3560        Gig 0/1`} explain={[
            ['doar DSW + CSW2', 'Core-ul vede doar distribution-uri și perechea lui — niciun switch de access, niciun PC. Exact regula „core = fără dispozitive finale”.'],
          ]} />
          <p>Pe un ASW, <code>show cdp neighbors</code> arată în continuare doar cele două DSW-uri ale blocului lui: stratul de access nu „simte” schimbarea.</p>
        </Step>
        <Step labKey={L} n={11} title="Urmărește calea între blocuri (Simulation mode)">
          <p>Comută în <P>Simulation</P>, filtrează doar <b>ICMP</b>, apoi trimite un ping de la PC1 la PC7 (<P>Add Simple PDU</P>). Apasă <b>Capture/Forward</b> și numără switch-urile prin care trece.</p>
          <Reveal label="Ce ar trebui să vezi?"><p>De obicei <b>5</b> switch-uri: ASW1 → DSW → CSW → DSW → ASW4 (dacă STP a ales un drum mai ciudat, de exemplu prin legătura DSW1–DSW2, pot fi mai multe — încă un argument pentru legături L3 între distribution și core). Compară cu PC1 → PC6 (același bloc): 3 switch-uri. În three-tier, numărul de hopuri depinde de poziția dispozitivelor — spre deosebire de spine-leaf (labul solo).</p></Reveal>
        </Step>
        <Step labKey={L} n={12} title="Reflecție (în Notițe)">
          <ul>
            <li>Ce ai câștigat adăugând core-ul? (scalare liniară, blocuri independente)</li>
            <li>Ce ai plătit? (2 switch-uri în plus, mai multe hopuri între blocuri)</li>
            <li>Dacă firma ar avea doar blocul A pentru încă 5 ani, ar merita core-ul? (nu — two-tier e suficient)</li>
          </ul>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — rezumat cablare și verificări">
        <Table head={['Legătură', 'Capăt A', 'Capăt B', 'Cablu']} rows={[
          ['ASW1–DSW1 / ASW1–DSW2', 'ASW1 Gi0/1 / Gi0/2', 'DSW1 Fa0/1 / DSW2 Fa0/1', 'cross-over'],
          ['ASW2–DSW1 / ASW2–DSW2', 'ASW2 Gi0/1 / Gi0/2', 'DSW1 Fa0/2 / DSW2 Fa0/2', 'cross-over'],
          ['ASW3–DSW1 / ASW3–DSW2', 'ASW3 Gi0/1 / Gi0/2', 'DSW1 Fa0/3 / DSW2 Fa0/3', 'cross-over'],
          ['DSW1–DSW2', 'Fa0/24', 'Fa0/24', 'cross-over'],
          ['ASW4–DSW3 / ASW4–DSW4', 'ASW4 Gi0/1 / Gi0/2', 'DSW3 Fa0/1 / DSW4 Fa0/1', 'cross-over'],
          ['DSW3–DSW4', 'Fa0/24', 'Fa0/24', 'cross-over'],
          ['DSWn–CSW1 / DSWn–CSW2', 'DSWn Gi0/1 / Gi0/2', 'CSW1 Fa0/n / CSW2 Fa0/n', 'cross-over'],
          ['CSW1–CSW2', 'Gi0/1', 'Gi0/1', 'cross-over'],
          ['PC–ASW', 'FastEthernet0', 'ASW Fa0/1, Fa0/2', 'straight-through'],
        ]} />
        <CodeBlock title="Configurația fiecărui switch (exemplu DSW1)" code={`hostname DSW1
interface vlan 1
 ip address 192.168.10.2 255.255.255.0
 no shutdown`} explain={[
          ['hostname + SVI VLAN 1', 'Singura configurație necesară: arhitectura este dată de cablare, nu de comenzi.'],
        ]} />
        <ul>
          <li><b>Verificări:</b> ping între toate PC-urile; <code>show cdp neighbors</code> pe ASW (2 vecini DSW), DSW (ASW-urile blocului + perechea + 2 CSW), CSW (4 DSW + perechea); <code>show spanning-tree</code> arată porturi <code>Altn BLK</code>.</li>
          <li><b>Hopuri:</b> același ASW = 1 switch · același bloc = 3 · blocuri diferite = 5.</li>
        </ul>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — spine-leaf
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.2-S" title="Lab solo — un mini-fabric spine-leaf cu legături L3" />
      <Summary>
        <p><b>Scenariu:</b> construiești un fabric <G id="spine-leaf" /> de datacenter cu <b>2 spine-uri și 4 leaf-uri</b>, legate exclusiv prin porturi <b>routed</b> (L3), cu câte un server pe fiecare leaf. Verifici cu CDP că regulile arhitecturii sunt respectate.
          De data asta primești <b>doar cerințele</b>. Rezolvă singur, apoi deschide soluția.</p>
      </Summary>
      <Figure caption="Topologia țintă.">
        <LabSpineLeafTopology />
      </Figure>
      <Table head={['Legătură', 'Subrețea', 'Adresa spine', 'Adresa leaf']} rows={[
        ['SPINE1 Gi1/0/n ↔ LEAFn Gi1/0/23', '10.1.n.0/30', '10.1.n.1', '10.1.n.2'],
        ['SPINE2 Gi1/0/n ↔ LEAFn Gi1/0/24', '10.2.n.0/30', '10.2.n.1', '10.2.n.2'],
        ['LEAFn Gi1/0/1 ↔ SRVn', '192.168.n.0/24', '—', 'LEAFn 192.168.n.1 · SRVn 192.168.n.10 (gateway .1)'],
      ]} />
      <p className="small muted">n = numărul leaf-ului (1–4). Exemplu: SPINE2 Gi1/0/3 ↔ LEAF3 Gi1/0/24 = 10.2.3.0/30.</p>
      <Detailed title="Cerințe">
        <ol>
          <li>Folosește switch-uri <b>3650-24PS</b> pentru toate spine-urile și leaf-urile, cu hostname-urile din diagramă.</li>
          <li>Fiecare leaf are <b>exact câte o legătură spre fiecare spine</b>. Nicio legătură leaf ↔ leaf și nicio legătură spine ↔ spine.</li>
          <li>Toate legăturile spine–leaf și leaf–server sunt <b>porturi routed</b>, adresate conform tabelului; rutarea este activată pe toate switch-urile.</li>
          <li>Fiecare server (Server-PT) are adresa, masca și gateway-ul din tabel.</li>
          <li><b>Verificare CDP:</b> fiecare leaf are exact 2 vecini (ambele spine-uri), fiecare spine are exact 4 vecini (toate leaf-urile).</li>
          <li><b>Verificare L3:</b> fiecare leaf face ping la adresele ambelor spine-uri; fiecare server face ping la gateway-ul lui.</li>
          <li><b>Bonus (previzualizare 3.4):</b> activează OSPF (configurație dată mai jos) și verifică faptul că un leaf are <b>două</b> căi de cost egal spre serverele altui leaf; <code>tracert</code> de la SRV1 la SRV4 trebuie să arate leaf → spine → leaf.</li>
          <li><b>Întrebări de răspuns în notițe:</b> (a) câte cabluri ar trebui pentru 3 spine și 10 leaf? (b) ce se întâmplă cu traficul SRV1 → SRV4 dacă SPINE1 cade? (c) de ce nu ai pus serverele direct pe spine?</li>
        </ol>
        <CodeBlock title="Bonus — OSPF gata făcut (lipește pe fiecare switch)" code={`router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
 network 192.168.0.0 0.0.255.255 area 0`} explain={[
          ['router ospf 1', 'Pornește procesul OSPF (topicul 3.4 — nu trebuie să-l înțelegi acum).'],
          ['network … area 0', 'Activează OSPF pe toate interfețele cu adrese 10.x.x.x și 192.168.x.x. Rețelele serverelor sunt anunțate în tot fabric-ul.'],
        ]} />
        <Callout kind="info" title="Limitele Packet Tracer pentru acest lab">
          PT nu emulează un fabric de datacenter real (Nexus, VXLAN, ACI), dar regulile topologiei și legăturile routed se pot construi complet. Afișarea a două căi ECMP în <code>show ip route</code> pe 3650 în PT nu a fost verificată pe toate versiunile — dacă vezi o singură cale, concentrează-te pe CDP și pe <code>tracert</code>. În GNS3/CML același lab merge cu IOSv/IOSvL2 sau, mai realist, cu Nexus 9000v.
        </Callout>
        <Callout kind="tip" title="Indicii (deschide doar dacă te blochezi)">
          <Reveal label="Indiciul 1 — switch-ul 3650 nu pornește"><p>În PT, 3650-24PS vine fără sursă de alimentare. Click pe switch → <P>Physical</P> → trage modulul <code>AC-POWER-SUPPLY</code> în slotul gol din spate.</p></Reveal>
          <Reveal label="Indiciul 2 — cum devine un port routed"><p>În modul global: <code>ip routing</code>. Pe interfață: <code>no switchport</code>, apoi <code>ip address …</code>.</p></Reveal>
          <Reveal label="Indiciul 3 — câte cabluri pentru fabric"><p>Spine-uri × leaf-uri. Aici: 2 × 4 = 8 cabluri spine–leaf, plus 4 spre servere.</p></Reveal>
        </Callout>
      </Detailed>
      <Reveal label="Soluție completă (pas cu pas)">
        <ol>
          <li>Plasează 6 × 3650-24PS, adaugă fiecăruia <code>AC-POWER-SUPPLY</code>, redenumește-le SPINE1, SPINE2, LEAF1–LEAF4. Plasează 4 × Server-PT (SRV1–SRV4).</li>
          <li>Cabluri cross-over: SPINE1 <code>Gi1/0/n</code> → LEAFn <code>Gi1/0/23</code>; SPINE2 <code>Gi1/0/n</code> → LEAFn <code>Gi1/0/24</code>. Straight-through: LEAFn <code>Gi1/0/1</code> → SRVn.</li>
          <li>Configurează switch-urile (exemplele de mai jos; restul urmează același tipar).</li>
          <li>Pe servere: <P>Desktop → IP Configuration</P> → 192.168.n.10 / 255.255.255.0, gateway 192.168.n.1.</li>
        </ol>
        <CodeBlock title="SPINE1" code={`hostname SPINE1
ip routing
interface GigabitEthernet1/0/1
 description spre LEAF1
 no switchport
 ip address 10.1.1.1 255.255.255.252
interface GigabitEthernet1/0/2
 no switchport
 ip address 10.1.2.1 255.255.255.252
interface GigabitEthernet1/0/3
 no switchport
 ip address 10.1.3.1 255.255.255.252
interface GigabitEthernet1/0/4
 no switchport
 ip address 10.1.4.1 255.255.255.252`} explain={[
          ['ip routing', 'Fără ea, switch-ul nu rutează între interfețele L3.'],
          ['no switchport', 'Port routed: nu participă la STP, nu aparține unui VLAN.'],
          ['10.1.n.1', 'SPINE1 ia prima adresă din fiecare /30. SPINE2 e identic, cu 10.2.n.1.'],
        ]} />
        <CodeBlock title="LEAF1" code={`hostname LEAF1
ip routing
interface GigabitEthernet1/0/23
 description spre SPINE1
 no switchport
 ip address 10.1.1.2 255.255.255.252
interface GigabitEthernet1/0/24
 description spre SPINE2
 no switchport
 ip address 10.2.1.2 255.255.255.252
interface GigabitEthernet1/0/1
 description SRV1
 no switchport
 ip address 192.168.1.1 255.255.255.0`} explain={[
          ['Gi1/0/23, Gi1/0/24', 'Câte un uplink spre fiecare spine — niciunul spre alt leaf.'],
          ['Gi1/0/1 192.168.1.1', 'Gateway-ul serverului SRV1. LEAF2–4 folosesc 192.168.2–4.1.'],
        ]} />
        <CodeBlock title="Verificări așteptate" kind="session" code={`LEAF1# show cdp neighbors
Device ID    Local Intrfce   Holdtme   Capability   Platform    Port ID
SPINE1       Gig 1/0/23      150       R S          3650        Gig 1/0/1
SPINE2       Gig 1/0/24      150       R S          3650        Gig 1/0/1
SPINE1# show cdp neighbors
Device ID    Local Intrfce   Holdtme   Capability   Platform    Port ID
LEAF1        Gig 1/0/1       150       R S          3650        Gig 1/0/23
LEAF2        Gig 1/0/2       150       R S          3650        Gig 1/0/23
LEAF3        Gig 1/0/3       150       R S          3650        Gig 1/0/23
LEAF4        Gig 1/0/4       150       R S          3650        Gig 1/0/23
C:\\> tracert 192.168.4.10
  1   0 ms   0 ms   0 ms   192.168.1.1
  2   0 ms   0 ms   0 ms   10.1.1.1
  3   0 ms   0 ms   0 ms   10.1.4.2
  4   0 ms   0 ms   0 ms   192.168.4.10`} explain={[
          ['LEAF1: doar SPINE1 și SPINE2', 'Regula „fiecare leaf la fiecare spine, niciun leaf la alt leaf” e respectată.'],
          ['SPINE1: LEAF1–LEAF4', 'Un spine vede doar leaf-uri — nici celălalt spine, nici servere.'],
          ['tracert (bonus OSPF)', 'LEAF1 → un spine (aici SPINE1, poate fi și 10.2.1.1) → LEAF4 → SRV4. Pentru ORICE pereche de leaf-uri drumul are aceeași lungime.'],
        ]} />
        <h4>Răspunsuri la întrebări</h4>
        <ul>
          <li><b>(a)</b> 3 × 10 = <b>30</b> de cabluri spine–leaf (fiecare leaf la fiecare spine), plus legăturile spre servere.</li>
          <li><b>(b)</b> Cu OSPF și ECMP, LEAF1 mai are calea prin SPINE2: traficul continuă după reconvergență, cu jumătate din capacitatea fabric-ului. Cu 4 spine-uri s-ar pierde doar ¼.</li>
          <li><b>(c)</b> Un server pe spine ar avea alte distanțe decât restul (ar strica hop count-ul egal) și ar ocupa porturile care trebuie să lege leaf-uri. Spine-urile sunt doar coloana vertebrală.</li>
        </ul>
        <Callout kind="exam" title="Legătură cu examenul">Acest lab acoperă 1.2.c (regulile spine-leaf, hop count egal, ECMP) și pregătește 1.6 (adresare /30), 3.4 (OSPF) și 2.5 (de ce legăturile L3 nu au nevoie de STP).</Callout>
      </Reveal>
    </section>
  );
}
