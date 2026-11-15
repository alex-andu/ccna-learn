import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabGuidedTopology11, LabSoloTopology11 } from '../../diagrams/t1_1';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 'g1_1';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.1-G" title="Lab ghidat — prima ta rețea: router, switch L2, switch L3 și PoE (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> construiești o rețea mică cu un router, un switch L2 (2960) și un switch multilayer (3560-24PS) care alimentează prin PoE un telefon IP. Identifici rolul fiecărei componente, vezi cum se schimbă adresele MAC la router, citești tabela MAC și tabela de rutare și descoperi vecinii cu CDP.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător absolut (configurațiile îți sunt date gata de copiat)</p>
      </Summary>
      <Figure caption="Topologia labului ghidat.">
        <LabGuidedTopology11 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă IP', 'Gateway', 'Note']} rows={[
        ['R1 (2911)', 'G0/0', '10.0.0.1/30', '—', 'spre MLS1 (legătură de tranzit)'],
        ['R1 (2911)', 'G0/1', '192.168.20.1/24', '—', 'gateway pentru LAN-B'],
        ['MLS1 (3560-24PS)', 'Gi0/1 (routed)', '10.0.0.2/30', '—', 'no switchport'],
        ['MLS1 (3560-24PS)', 'Vlan1 (SVI)', '192.168.10.1/24', '—', 'gateway pentru LAN-A'],
        ['PC-A', 'Fa0', '192.168.10.10/24', '192.168.10.1', 'pe MLS1 Fa0/1'],
        ['PHONE1 (IP Phone 7960)', 'Switch port', '—', '—', 'pe MLS1 Fa0/2, alimentat PoE'],
        ['SW2 (2960-24TT)', 'Gi0/1', '—', '—', 'switch L2, legat la R1 G0/1'],
        ['PC-B', 'Fa0', '192.168.20.20/24', '192.168.20.1', 'pe SW2 Fa0/1'],
        ['SRV1 (Server-PT)', 'Fa0', '192.168.20.10/24', '192.168.20.1', 'pe SW2 Fa0/2'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu">
        PT simulează bine rutarea, tabelele MAC, CDP și modul Simulation (vezi fiecare pachet). PoE este simulat <b>simplificat</b>: în PT doar unele switch-uri multilayer (3560-24PS, și unele modele 3650) alimentează telefoanele IP; <b>2960 nu are PoE</b>. Comanda <code>show power inline</code> poate lipsi sau poate afișa mai puține coloane în funcție de versiunea PT — dacă nu merge, observă direct ecranul telefonului (tab <P>Physical</P>). Bugetul de putere nu este modelat realist. NGFW, IPS, WLC 9800 și Catalyst Center nu pot fi emulate în PT.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Plasează dispozitivele">
          <ul>
            <li><P>Network Devices → Routers → 2911</P> → redenumește <b>R1</b>.</li>
            <li><P>Network Devices → Switches → 3560-24PS</P> → <b>MLS1</b> (multilayer, cu PoE — „PS” = Power Supply pentru PoE).</li>
            <li><P>Network Devices → Switches → 2960</P> → <b>SW2</b>.</li>
            <li><P>End Devices</P>: două <b>PC</b> (PC-A, PC-B), un <b>Server</b> (SRV1) și un <b>IP Phone</b> (7960) → PHONE1.</li>
          </ul>
          <Reveal label="Întrebare: ce tip de componentă (1.1.a–h) este fiecare?">
            <Table head={['Dispozitiv', 'Componentă', 'Nivel la care decide']} rows={[
              ['R1', '1.1.a Router', 'L3 (IP)'], ['MLS1', '1.1.b Layer 3 switch + PSE pentru 1.1.h PoE', 'L2 în VLAN, L3 între rețele'],
              ['SW2', '1.1.b Layer 2 switch', 'L2 (MAC)'], ['PC-A, PC-B', '1.1.f Endpoints', 'L1–L7'],
              ['PHONE1', '1.1.f Endpoint + PD (1.1.h)', 'L1–L7'], ['SRV1', '1.1.g Server', 'L1–L7'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Cablează">
          <p><P>Connections</P> → <b>Copper Straight-Through</b> pentru toate legăturile (în PT, porturile Gigabit fac <G id="auto-mdix" />):</p>
          <ul>
            <li>R1 <code>G0/0</code> ↔ MLS1 <code>Gi0/1</code> · R1 <code>G0/1</code> ↔ SW2 <code>Gi0/1</code></li>
            <li>PC-A <code>Fa0</code> ↔ MLS1 <code>Fa0/1</code> · PHONE1 <code>Switch</code> ↔ MLS1 <code>Fa0/2</code></li>
            <li>PC-B <code>Fa0</code> ↔ SW2 <code>Fa0/1</code> · SRV1 <code>Fa0</code> ↔ SW2 <code>Fa0/2</code></li>
          </ul>
          <p>Observă că legăturile de la R1 au punctele roșii: interfețele routerului sunt <b>oprite implicit</b> (shutdown). Porturile switch-urilor devin verzi singure.</p>
          <Reveal label="Întrebare: s-a aprins telefonul?"><p>Da — telefonul legat la 3560-24PS pornește (ecranul se aprinde în tab-ul <P>Physical</P>), fără adaptor de curent. MLS1 este <b>PSE</b>, telefonul este <b>PD</b>: switch-ul a detectat semnătura PoE, a clasificat dispozitivul și a aplicat tensiunea. PoE este activ implicit pe porturile switch-urilor PoE (<code>power inline auto</code>).</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Configurează R1 (copiază în CLI)">
          <CodeBlock title="R1" code={`enable
configure terminal
hostname R1
interface GigabitEthernet0/0
 ip address 10.0.0.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 192.168.20.1 255.255.255.0
 no shutdown
exit
ip route 192.168.10.0 255.255.255.0 10.0.0.2
end`} explain={[
            ['interface … + ip address', 'Fiecare interfață de router este într-o rețea diferită — R1 leagă rețeaua de tranzit 10.0.0.0/30 cu LAN-B.'],
            ['no shutdown', 'Interfețele routerului sunt oprite implicit; trebuie pornite.'],
            ['ip route 192.168.10.0 … 10.0.0.2', 'Rută statică: „LAN-A se află în spatele lui MLS1”. Rutarea statică se învață în 3.3 — aici doar o folosim.'],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="Configurează MLS1 ca switch L3">
          <CodeBlock title="MLS1" code={`enable
configure terminal
hostname MLS1
ip routing
interface GigabitEthernet0/1
 no switchport
 ip address 10.0.0.2 255.255.255.252
 no shutdown
interface vlan 1
 ip address 192.168.10.1 255.255.255.0
 no shutdown
exit
ip route 0.0.0.0 0.0.0.0 10.0.0.1
end`} explain={[
            ['ip routing', 'Transformă MLS1 din switch L2 în switch L3 (activează rutarea).'],
            ['no switchport', 'Gi0/1 devine routed port, ca o interfață de router.'],
            ['interface vlan 1 + ip address', 'SVI-ul VLAN-ului 1: default gateway-ul pentru PC-A.'],
            ['ip route 0.0.0.0 0.0.0.0 10.0.0.1', 'Tot ce nu e local merge la R1.'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="Configurează endpoint-urile și serverul">
          <p>Pe fiecare PC și pe server: <P>Desktop → IP Configuration → Static</P>, cu valorile din tabelul de adresare (IP, mască, default gateway). Telefonul nu are nevoie de configurare pentru acest lab.</p>
          <p>Test: pe PC-A, <P>Desktop → Command Prompt</P> → <code>ping 192.168.20.10</code>. Primul ping poate da timeout (se rezolvă ARP pe fiecare legătură); următoarele trebuie să reușească.</p>
          <Reveal label="Nu merge ping-ul?"><ul>
            <li>Gateway-ul PC-ului greșit sau lipsă → PC-ul nu știe unde să trimită pachetele spre altă rețea.</li>
            <li>Ai uitat <code>ip routing</code> pe MLS1 sau <code>no shutdown</code> pe R1.</li>
            <li>Verifică pe R1 și MLS1 cu <code>show ip interface brief</code> că interfețele sunt <b>up/up</b>.</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Observă un pachet în Simulation mode">
          <p>Comută în <P>Simulation</P> (dreapta jos), <P>Edit Filters</P> → lasă doar <b>ICMP</b>. Pe PC-A dă din nou <code>ping 192.168.20.10</code> și apasă <b>Capture / Forward</b> pas cu pas. Click pe plic la fiecare dispozitiv → tab <P>Inbound / Outbound PDU Details</P>.</p>
          <Reveal label="Ce ar trebui să observi?"><ul>
            <li>Între PC-A și MLS1: MAC sursă = PC-A, MAC destinație = MLS1 (SVI Vlan1). IP sursă 192.168.10.10, IP destinație 192.168.20.10.</li>
            <li>Între MLS1 și R1: MAC-urile sunt <b>altele</b> (MLS1 Gi0/1 → R1 G0/0), IP-urile <b>aceleași</b>; TTL a scăzut cu 1.</li>
            <li>Între R1 și SRV1: din nou MAC-uri noi (R1 G0/1 → SRV1). SW2 transmite cadrul <b>fără să-l modifice</b>.</li>
            <li>Concluzie: routerele (și switch-ul L3) rescriu antetul L2; switch-ul L2 doar îl transmite.</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Citește tabela MAC (switch L2) și tabela de rutare (router)">
          <CodeBlock title="SW2 și R1" kind="session" code={`SW2# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0001.42aa.0b01    DYNAMIC     Gi0/1
   1    0060.2f11.3c02    DYNAMIC     Fa0/2
R1# show ip route
...
C    10.0.0.0/30 is directly connected, GigabitEthernet0/0
L    10.0.0.1/32 is directly connected, GigabitEthernet0/0
S    192.168.10.0/24 [1/0] via 10.0.0.2
C    192.168.20.0/24 is directly connected, GigabitEthernet0/1
L    192.168.20.1/32 is directly connected, GigabitEthernet0/1`} explain={[
            ['show mac address-table', 'SW2 a învățat MAC-ul lui R1 (pe Gi0/1) și al serverului (pe Fa0/2). MAC-urile tale vor fi altele.'],
            ['show ip route', 'R1 știe două rețele direct conectate (C) și LAN-A prin ruta statică (S).'],
          ]} />
          <Reveal label="Întrebare: de ce MAC-ul lui PC-A nu apare niciodată în tabela lui SW2?"><p>Pentru că PC-A este în altă rețea. Cadrele lui PC-A se opresc la MLS1 (gateway-ul lui). Spre LAN-B, R1 trimite cadre cu <b>MAC-ul propriu</b> ca sursă. Un switch vede doar MAC-urile din propriul domeniu de broadcast.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Descoperă vecinii cu CDP">
          <CodeBlock title="MLS1" kind="session" code={`MLS1# show cdp neighbors
Device ID    Local Intrfce   Holdtme    Capability   Platform    Port ID
R1           Gig 0/1         160        R            C2900       Gig 0/0
IP Phone     Fas 0/2         170        H P          IP Phone    Switch`} explain={[
            ['R1 … R … C2900', 'Vecinul pe Gi0/1 este un router (capability R), model 2900, portul lui G0/0.'],
            ['IP Phone … H P', 'Pe Fa0/2 este un telefon (host, phone). Numele afișat poate diferi în PT.'],
          ]} />
          <p>Încearcă și <code>show cdp neighbors detail</code> pe R1 → vezi adresa IP a lui MLS1 și versiunea IOS. Observă că PC-urile <b>nu</b> apar: nu rulează CDP.</p>
        </Step>
        <Step labKey={L} n={9} title="Joacă-te cu PoE">
          <CodeBlock title="MLS1" kind="session" code={`MLS1# show power inline
MLS1# configure terminal
MLS1(config)# interface FastEthernet0/2
MLS1(config-if)# power inline never
MLS1(config-if)# power inline auto
MLS1(config-if)# end`} explain={[
            ['show power inline', 'Bugetul PoE și starea fiecărui port (dacă versiunea ta de PT suportă comanda).'],
            ['power inline never', 'Oprește PoE pe port → telefonul se stinge (verifică în tab-ul Physical al telefonului).'],
            ['power inline auto', 'Repornește PoE → telefonul pornește din nou. Exact așa se „resetează de la distanță” un AP blocat pe tavan.'],
          ]} />
          <Reveal label="Experiment: mută telefonul pe SW2 (2960)"><p>Leagă PHONE1 la SW2 <code>Fa0/3</code>. Telefonul rămâne stins: 2960 din PT <b>nu este PSE</b>. Soluția fără PoE: în tab-ul <P>Physical</P> al telefonului, trage <b>IP_PHONE_POWER_ADAPTER</b> în priza telefonului. În realitate ai folosi un injector PoE (midspan) sau un switch PoE.</p></Reveal>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — rezumat">
        <Table head={['Verificare', 'Rezultat așteptat']} rows={[
          ['ping PC-A → SRV1 (192.168.20.10)', 'reușește (după primul timeout ARP)'],
          ['show ip interface brief pe R1', 'G0/0 și G0/1 up/up, cu IP-urile din tabel'],
          ['show ip route pe MLS1', 'C 10.0.0.0/30 (Gi0/1), C 192.168.10.0/24 (Vlan1), S* 0.0.0.0/0 via 10.0.0.1'],
          ['show cdp neighbors pe MLS1', 'R1 pe Gi0/1 (R) și telefonul pe Fa0/2 (H P)'],
          ['PoE', 'telefonul pornește pe MLS1, se stinge cu power inline never, nu pornește pe 2960 fără adaptor'],
          ['Simulation', 'MAC-urile se schimbă la MLS1 și R1; IP-urile rămân; SW2 nu modifică nimic'],
        ]} />
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.1-S" title="Lab solo — biroul unei firme mici" />
      <Summary>
        <p><b>Scenariu:</b> o firmă mică are un router de margine spre Internet, un switch de distribuție multilayer cu PoE pentru telefoane și două switch-uri de acces. Construiești rețeaua după cerințe, faci inventarul componentelor cu CDP și răspunzi la câteva întrebări de proiectare. Primești <b>doar cerințele</b> — soluția e ascunsă la final.</p>
      </Summary>
      <Figure caption="Topologia țintă (o construiești tu în Packet Tracer).">
        <LabSoloTopology11 />
      </Figure>
      <Detailed title="Cerințe">
        <ol>
          <li><b>R-EDGE</b> (2911): <code>G0/0</code> = <code>10.0.0.1/30</code> spre MLS-DIST, <code>G0/1</code> = <code>203.0.113.1/24</code> spre serverul <b>WEB-INET</b> (<code>203.0.113.10/24</code>, gateway <code>203.0.113.1</code>) — simulează „Internetul”.</li>
          <li><b>MLS-DIST</b> (3560-24PS): switch L3, <code>Gi0/1</code> routed = <code>10.0.0.2/30</code>; SVI VLAN 1 = <code>192.168.10.1/24</code> (gateway pentru LAN); rută implicită spre R-EDGE. R-EDGE are nevoie de o rută înapoi spre <code>192.168.10.0/24</code>.</li>
          <li><b>SW-ACC1</b> și <b>SW-ACC2</b> (2960) se leagă de MLS-DIST pe <code>Fa0/23</code>, respectiv <code>Fa0/24</code>.</li>
          <li><b>PHONE-1</b> și <b>PHONE-2</b> pe MLS-DIST (<code>Fa0/1</code>, <code>Fa0/2</code>), alimentate prin PoE. <b>PHONE-3</b> pe SW-ACC1 — trebuie să funcționeze și el.</li>
          <li><b>PC-1</b> (<code>192.168.10.11</code>) pe SW-ACC1, <b>PC-2</b> (<code>192.168.10.12</code>) pe SW-ACC2, ambele cu gateway <code>192.168.10.1</code>.</li>
          <li>Port neutilizat <code>Fa0/3</code> pe MLS-DIST: PoE <b>dezactivat</b>.</li>
          <li>Verificare: <code>ping 203.0.113.10</code> de pe PC-1 și PC-2 reușește; din browserul lui PC-1, <code>http://203.0.113.10</code> afișează pagina serverului.</li>
          <li>Pe MLS-DIST, folosește <code>show cdp neighbors</code> și completează un tabel: vecin · port local · port vecin · tip componentă.</li>
          <li><b>Întrebări (răspunde în notițe):</b>
            <ol type="a">
              <li>Câte domenii de broadcast are rețeaua? Câte domenii de coliziune are SW-ACC1 dacă are 3 cabluri conectate?</li>
              <li>Cine este PSE și cine PD în această rețea? De ce nu pornește PHONE-3 fără intervenția ta?</li>
              <li>Un 3560-24PS real are un buget PoE de ordinul a 370 W. Câte AP-uri PoE+ (Class 4) ar putea alimenta, dacă toate rezervă maximul clasei? Câte telefoane Class 3?</li>
              <li>Firma vrea să blocheze aplicațiile de jocuri online și să detecteze atacuri. Ce componentă ar adăuga și unde?</li>
              <li>Firma va avea 20 de AP-uri. Ce componentă ar simplifica administrarea lor?</li>
            </ol>
          </li>
        </ol>
        <Callout kind="tip" title="Indicii (deschide doar dacă te blochezi)">
          <Reveal label="Indiciul 1 — configurațiile seamănă cu labul ghidat"><p>R-EDGE ≈ R1 (cu G0/1 spre WEB-INET), MLS-DIST ≈ MLS1. Ruta statică de pe R-EDGE: spre <code>192.168.10.0/24</code> via <code>10.0.0.2</code>.</p></Reveal>
          <Reveal label="Indiciul 2 — PHONE-3"><p>2960 nu are PoE. Uită-te în tab-ul <P>Physical</P> al telefonului.</p></Reveal>
          <Reveal label="Indiciul 3 — serviciul web pe server"><p>Pe WEB-INET: <P>Services → HTTP</P> este activ implicit în PT. Pagina implicită se vede din <P>Desktop → Web Browser</P> pe PC-1.</p></Reveal>
        </Callout>
      </Detailed>
      <Reveal label="Soluție completă (pas cu pas)">
        <CodeBlock title="R-EDGE" code={`hostname R-EDGE
interface GigabitEthernet0/0
 ip address 10.0.0.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 203.0.113.1 255.255.255.0
 no shutdown
exit
ip route 192.168.10.0 255.255.255.0 10.0.0.2`} />
        <CodeBlock title="MLS-DIST" code={`hostname MLS-DIST
ip routing
interface GigabitEthernet0/1
 no switchport
 ip address 10.0.0.2 255.255.255.252
 no shutdown
interface vlan 1
 ip address 192.168.10.1 255.255.255.0
 no shutdown
interface FastEthernet0/3
 power inline never
exit
ip route 0.0.0.0 0.0.0.0 10.0.0.1`} />
        <ul>
          <li>Cabluri straight-through: R-EDGE G0/0 ↔ MLS-DIST Gi0/1; R-EDGE G0/1 ↔ WEB-INET Fa0; MLS-DIST Fa0/23 ↔ SW-ACC1 Fa0/24 și Fa0/24 ↔ SW-ACC2 Fa0/24 (între switch-uri PT poate cere <b>crossover</b> pe porturi FastEthernet; dacă legătura rămâne roșie, schimbă tipul cablului).</li>
          <li>PHONE-3: tab <P>Physical</P> → trage <b>IP_PHONE_POWER_ADAPTER</b> în telefon.</li>
          <li>PC-urile și serverul: IP static conform cerințelor.</li>
        </ul>
        <h4>Tabelul CDP (pe MLS-DIST, orientativ)</h4>
        <Table head={['Vecin', 'Port local', 'Port vecin', 'Componentă']} rows={[
          ['R-EDGE', 'Gi0/1', 'Gig0/0', 'router (1.1.a)'],
          ['SW-ACC1', 'Fa0/23', 'Fa0/24', 'switch L2 (1.1.b)'],
          ['SW-ACC2', 'Fa0/24', 'Fa0/24', 'switch L2 (1.1.b)'],
          ['PHONE-1 / PHONE-2', 'Fa0/1 / Fa0/2', 'Switch', 'endpoint + PD (1.1.f / 1.1.h)'],
        ]} />
        <h4>Răspunsuri</h4>
        <ul>
          <li><b>(a)</b> <b>3 domenii de broadcast</b>: LAN 192.168.10.0/24 (MLS-DIST + ambele switch-uri de acces), legătura 10.0.0.0/30 și rețeaua 203.0.113.0/24. Fiecare interfață L3 (SVI, routed port, interfață de router) delimitează unul. SW-ACC1 cu 3 cabluri = <b>3 domenii de coliziune</b> (unul per port folosit).</li>
          <li><b>(b)</b> PSE = <b>MLS-DIST</b> (switch PoE). PD = PHONE-1 și PHONE-2. PHONE-3 e pe un 2960 fără PoE, deci nu primește curent: are nevoie de adaptor sau de un injector midspan.</li>
          <li><b>(c)</b> 370 / 30 = 12.3 → <b>12 AP-uri PoE+</b>. 370 / 15.4 = 24.02 → <b>24 de telefoane Class 3</b> (exact cât porturi are switch-ul). Valoarea bugetului real depinde de model și de sursa de alimentare — verifică întotdeauna cu <code>show power inline</code>.</li>
          <li><b>(d)</b> Un <b>NGFW</b> (cu IPS integrat și AVC) la marginea rețelei, între R-EDGE și Internet (sau în locul lui R-EDGE). Un firewall stateful clasic nu ar recunoaște jocurile după aplicație, doar după porturi.</li>
          <li><b>(e)</b> Un <b>WLC</b> (de exemplu Catalyst 9800, sau un controller embedded/cloud) cu AP-uri lightweight. Pe termen lung, pentru toată rețeaua: Catalyst Center.</li>
        </ul>
        <Callout kind="exam" title="Legătură cu examenul">Labul acoperă 1.1.a, b, f, g, h și pregătește 1.2 (two-tier: access + distribution), 1.6 (adresare), 2.3 (CDP/LLDP) și 3.3 (rute statice).</Callout>
      </Reveal>
    </section>
  );
}
