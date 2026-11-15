import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabCablingTopology, LabSoloCablingTopology } from '../../diagrams/t1_3';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't13g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.3-G" title="Lab ghidat — cablul potrivit pentru fiecare legătură (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> legi dispozitive cu tipul corect de cablu (straight-through, crossover, console, fibră), înveți să citești „luminile” legăturilor, testezi efectul Auto-MDIX, te conectezi pe consolă la 9600 8N1 și montezi un modul de fibră într-un switch.
          <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat. Liniile întrerupte portocalii = crossover, punctate albastre = consolă, verde-turcoaz = fibră.">
        <LabCablingTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Legat la / cablu']} rows={[
        ['R1 (ISR 1941)', 'Gi0/0', '192.168.1.1/24', 'SW1 Fa0/1 — straight-through'],
        ['R1', 'Gi0/1', '192.168.2.1/24', 'PC1 Fa0 — crossover'],
        ['R1', 'Console', '—', 'Admin RS-232 — Console (rollover)'],
        ['SW1 (2960-24TT)', 'Gi0/1', '—', 'SW2 Gi0/1 — crossover'],
        ['PC0', 'Fa0', '192.168.1.10/24, gw .1', 'SW1 Fa0/2 — straight-through'],
        ['PC2', 'Fa0', '192.168.1.11/24, gw .1', 'SW2 Fa0/1 — straight-through'],
        ['PC1', 'Fa0', '192.168.2.10/24, gw 192.168.2.1', 'R1 Gi0/1 — crossover'],
        ['SW-F1 / SW-F2 (Switch-PT)', 'port fibră (modul 1FGE)', '—', 'între ele — Fiber'],
        ['PC-F1 / PC-F2', 'Fa0', '192.168.3.1/24 · 192.168.3.2/24', 'SW-F1 / SW-F2 — straight-through'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu">
        Packet Tracer verifică tipul de cablu și tipul de port (nu poți lega un cablu de cupru într-un port de fibră), arată starea legăturii prin culori și acceptă comenzile <code>speed</code>, <code>duplex</code>, <code>mdix auto</code>. <b>Nu</b> modelează distanța, atenuarea, diafonia, puterea optică sau erorile fizice reale. Comportamentul Auto-MDIX diferă între versiunile PT și între modele: notează ce observi tu și compară cu explicațiile. În GNS3/CML/EVE-NG legăturile sunt virtuale (nu există cabluri straight/crossover), deci acest lab are sens doar în PT sau pe echipamente reale.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Plasează dispozitivele">
          <p>Din bara de jos: <P>Network Devices → Routers → 1941</P> (R1), <P>Switches → 2960</P> de două ori (SW1, SW2), <P>Switches → Switch-PT</P> de două ori (SW-F1, SW-F2), apoi <P>End Devices → PC</P> de 6 ori (PC0, PC1, PC2, Admin, PC-F1, PC-F2). Redenumește-le (click → <P>Config</P> → Display Name).</p>
        </Step>
        <Step labKey={L} n={2} title="Cunoaște luminile legăturilor">
          <p>În PT, fiecare capăt al unei legături are un indicator:</p>
          <ul>
            <li><b>verde</b> — legătură activă la nivelul 1 (și 2);</li>
            <li><b>portocaliu / ambră</b> — pe un port de switch: legătura fizică e bună, dar portul e încă în stările STP <i>listening/learning</i> (≈30 s) — vezi topicul 2.5;</li>
            <li><b>roșu</b> — nicio legătură: cablu greșit, port oprit (<code>shutdown</code>) sau capătul opus oprit.</li>
          </ul>
          <p>Ca să accelerezi, apasă <b>Fast Forward Time</b> (lângă ceas, jos).</p>
        </Step>
        <Step labKey={L} n={3} title="PC0 → SW1 cu straight-through">
          <p><P>Connections</P> (fulgerul) → <b>Copper Straight-Through</b> (linie neagră continuă) → PC0 <code>FastEthernet0</code> → SW1 <code>FastEthernet0/2</code>.</p>
          <Reveal label="Ce ar trebui să vezi?"><p>Pe PC0 verde imediat; pe SW1 întâi portocaliu, apoi verde după ≈30 s (sau după Fast Forward). PC = MDI, switch = MDI-X → straight-through e corect.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="R1 Gi0/0 → SW1 Fa0/1 cu straight-through">
          <p>Același cablu, R1 <code>GigabitEthernet0/0</code> → SW1 <code>FastEthernet0/1</code>. Observă: capătul dinspre router rămâne <b>roșu</b>.</p>
          <Reveal label="De ce e roșu, dacă cablul e corect?"><p>Interfețele de router sunt <b>oprite implicit</b> (administratively down). Cablul e bun — router (MDI) ↔ switch (MDI-X) = straight-through. O vei porni de pe consolă la pasul 8. Observă și că un port gigabit se leagă de unul FastEthernet: autonegocierea alege 100 Mb/s.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="PC1 → R1 Gi0/1 — încearcă întâi cablul „greșit”">
          <p>Leagă PC1 <code>FastEthernet0</code> → R1 <code>GigabitEthernet0/1</code> cu <b>Copper Straight-Through</b>. Notează culorile (după ce vei porni interfața la pasul 8, revino aici). Apoi șterge cablul (<P>Delete</P> din bara din dreapta sau tasta Del) și refă legătura cu <b>Copper Cross-Over</b> (linie neagră întreruptă).</p>
          <Reveal label="Întrebare: de ce crossover între router și PC?"><p>Ambele sunt porturi <G id="mdi" />: emit pe pinii 1-2 și recepționează pe 3-6. Fără încrucișare, emisia unuia ar ajunge în emisia celuilalt. Dacă în versiunea ta de PT legătura cu straight-through devine totuși verde, înseamnă că PT modelează Auto-MDIX pe acel port (ca un router real modern). Regula de examen rămâne: <b>router ↔ PC = crossover</b>.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="SW1 ↔ SW2 cu crossover, apoi experimentul Auto-MDIX">
          <p>Leagă SW1 <code>GigabitEthernet0/1</code> → SW2 <code>GigabitEthernet0/1</code> cu <b>Copper Cross-Over</b>. Așteaptă verde la ambele capete.</p>
          <p>Acum experimentul: șterge cablul și refă-l cu <b>Copper Straight-Through</b>. Observă rezultatul. Apoi, pe ambele switch-uri (click → <P>CLI</P>):</p>
          <CodeBlock title="SW1 și SW2" kind="session" code={`Switch> enable
Switch# configure terminal
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# no mdix auto
Switch(config-if)# end
Switch# show interfaces GigabitEthernet0/1 | include line protocol`} explain={[
            ['no mdix auto', 'Dezactivează Auto-MDIX pe port: acum portul rămâne fix în MDI-X, ca un switch vechi.'],
            ['show interfaces … | include line protocol', 'Starea legăturii: up/up sau down/down.'],
          ]} />
          <Reveal label="Ce ar trebui să observi?"><ul>
            <li>Cu <b>crossover</b>: legătura merge oricând (cablul face încrucișarea).</li>
            <li>Cu <b>straight-through și Auto-MDIX activ</b>: pe echipamente reale legătura merge (porturile se „întorc” singure). În PT, rezultatul depinde de versiune.</li>
            <li>Cu <b>straight-through și <code>no mdix auto</code></b>: ambele porturi sunt MDI-X → emisia pe 3-6 ajunge în emisia pe 3-6 → <b>down/down</b> (roșu).</li>
          </ul><p>La final, refă <code>mdix auto</code> pe ambele porturi și pune la loc cablul crossover.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Consola: Admin → R1 cu cablul Console">
          <p><P>Connections</P> → <b>Console</b> (linie albastru deschis) → Admin <code>RS 232</code> → R1 <code>Console</code>. Pe Admin: <P>Desktop → Terminal</P>. Verifică setările și apasă <b>OK</b>:</p>
          <Table head={['Câmp', 'Valoare']} hlCol={1} rows={[
            ['Bits Per Second', '9600'], ['Data Bits', '8'], ['Parity', 'None'], ['Stop Bits', '1'], ['Flow Control', 'None'],
          ]} />
          <p>Apasă Enter. Dacă apare dialogul de configurare inițială, răspunde <code>no</code>. Trebuie să vezi prompt-ul <code>Router&gt;</code>.</p>
          <Reveal label="Nu apare nimic?"><ul>
            <li>Ai legat cablul în portul <b>RS 232</b> al PC-ului (nu în FastEthernet0) și în <b>Console</b> pe router (nu în AUX)?</li>
            <li>Viteza terminalului e alta decât 9600? Pe un echipament real, la o viteză greșită apar caractere fără sens.</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Configurează R1 de pe consolă și pornește interfețele">
          <CodeBlock title="R1 — din terminalul de pe Admin" kind="session" code={`Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.2.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
R1# show ip interface brief`} explain={[
            ['ip address …', 'Fiecare interfață de router e o rețea separată (deci și un domeniu de broadcast separat — 1.3.b).'],
            ['no shutdown', 'Pornește interfața. Abia acum luminile dinspre router devin verzi.'],
            ['show ip interface brief', <>Rezumat: interfață, IP, Status (L1), Protocol (L2). Ar trebui <code>up up</code> pe Gi0/0 și Gi0/1.</>],
          ]} />
          <p>Configurează IP-urile pe PC0, PC1, PC2 (<P>Desktop → IP Configuration</P>) conform tabelului.</p>
        </Step>
        <Step labKey={L} n={9} title="Verifică pe switch și testează conectivitatea">
          <CodeBlock title="SW1" kind="session" code={`Switch# show interfaces status
Port      Name               Status       Vlan       Duplex  Speed Type
Fa0/1                        connected    1          a-full  a-100 10/100BaseTX
Fa0/2                        connected    1          a-full  a-100 10/100BaseTX
Fa0/3                        notconnect   1            auto   auto 10/100BaseTX
...
Gig0/1                       connected    1          a-full a-1000 10/100/1000BaseTX
Gig0/2                       notconnect   1            auto   auto 10/100/1000BaseTX
Switch# show interfaces GigabitEthernet0/1 | include duplex
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX`} explain={[
            ['a-full a-100', 'Fa0/1 (spre R1) și Fa0/2 (spre PC0) au negociat 100 Mb/s full-duplex — legături punct-la-punct.'],
            ['Gig0/1 a-1000', 'Legătura switch–switch prin crossover a negociat 1 Gb/s.'],
          ]} />
          <p>Din PC0: <code>ping 192.168.1.11</code> (PC2, prin SW1–SW2) și <code>ping 192.168.2.10</code> (PC1, prin router). Ambele trebuie să reușească (primul ping poate pierde un pachet din cauza ARP).</p>
        </Step>
        <Step labKey={L} n={10} title="Fibra: montează module optice în Switch-PT">
          <p>Click pe SW-F1 → tab <P>Physical</P>. Apasă butonul de <b>power</b> (switch-ul se oprește). În lista de module din stânga caută <code>PT-SWITCH-NM-1FGE</code> (Gigabit Ethernet pe fibră; <code>1FFE</code> = Fast Ethernet pe fibră). Trage-l într-un slot gol (dacă nu e niciunul liber, scoate întâi un modul de cupru nefolosit). Pornește switch-ul. Repetă pe SW-F2.</p>
          <Reveal label="Ce înseamnă literele din numele modulelor?"><p><b>C</b> = copper (cupru), <b>F</b> = fiber; <b>FE</b> = Fast Ethernet (100 Mb/s), <b>GE</b> = Gigabit Ethernet. Exact ca la un switch real cu sloturi <G id="sfp" />: slotul e generic, modulul decide mediul.</p></Reveal>
        </Step>
        <Step labKey={L} n={11} title="Leagă cele două switch-uri prin fibră">
          <p>Întâi încearcă <b>Copper Straight-Through</b> de la SW-F1 spre portul de fibră: PT nu îți oferă portul de fibră în listă (sau refuză legătura). Apoi folosește cablul <b>Fiber</b> (linie portocalie) între porturile <code>GigabitEthernet</code> de fibră ale celor două switch-uri. Leagă PC-F1 și PC-F2 cu straight-through, setează IP-urile 192.168.3.1 și 192.168.3.2 și dă ping.</p>
          <Reveal label="Ce lipsește din simulare?"><p>În realitate ar trebui să alegi: <b>multimod sau monomod</b> (după distanță), module <b>identice</b> la ambele capete (SX cu SX, LX cu LX), conectorul (LC) și să verifici că <b>TX ajunge în RX</b>. PT are un singur tip generic de cablu „Fiber” și nu modelează distanța sau polaritatea. Pe un switch real ai verifica cu <code>show interfaces transceiver</code> (puterea RX) și <code>show inventory</code>.</p></Reveal>
        </Step>
        <Step labKey={L} n={12} title="Bonus 1.3.b — hub vs switch în Simulation mode">
          <p>Adaugă un <P>Network Devices → Hubs → Hub-PT</P> cu 3 PC-uri (192.168.4.1–3/24, straight-through). Comută în <b>Simulation</b> (dreapta jos), lasă în filtru doar ICMP și dă ping de la primul PC la al treilea. Apasă <b>Capture / Forward</b> pas cu pas.</p>
          <Reveal label="Ce observi?"><p>Hub-ul trimite pachetul la <b>toate</b> PC-urile (cel care nu e destinația îl aruncă — apare cu X). Dacă două PC-uri trimit simultan, PT poate afișa o <b>coliziune</b> pe hub. Repetă același test cu PC0 → PC2 prin switch-uri: după ce switch-ul învață MAC-urile, cadrul merge doar pe portul destinației. Asta e diferența dintre un domeniu de coliziune partajat și porturi punct-la-punct.</p></Reveal>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — rezumatul cablării și al verificărilor">
        <Table head={['Legătură', 'Cablu PT', 'De ce', 'Verificare']} rows={[
          ['PC0 ↔ SW1 Fa0/2', 'Copper Straight-Through', 'MDI ↔ MDI-X', 'verde; a-full a-100'],
          ['R1 Gi0/0 ↔ SW1 Fa0/1', 'Copper Straight-Through', 'router (MDI) ↔ switch (MDI-X)', 'verde după no shutdown'],
          ['PC1 ↔ R1 Gi0/1', 'Copper Cross-Over', 'MDI ↔ MDI', 'ping 192.168.2.1 din PC1'],
          ['SW1 Gi0/1 ↔ SW2 Gi0/1', 'Copper Cross-Over', 'MDI-X ↔ MDI-X (sau orice cablu cu Auto-MDIX)', 'a-full a-1000'],
          ['PC2 ↔ SW2 Fa0/1', 'Copper Straight-Through', 'MDI ↔ MDI-X', 'ping PC0 → PC2'],
          ['Admin RS-232 ↔ R1 Console', 'Console', 'acces serial out-of-band', 'Terminal 9600 8N1 → Router>'],
          ['SW-F1 ↔ SW-F2', 'Fiber (modul PT-SWITCH-NM-1FGE)', 'port optic ↔ port optic', 'ping PC-F1 → PC-F2'],
        ]} />
        <p className="small">Comenzi folosite: <code>no shutdown</code> pe R1, <code>show ip interface brief</code>, <code>show interfaces status</code>, <code>show interfaces … | include duplex</code>, <code>no mdix auto</code> / <code>mdix auto</code>.</p>
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
      <SectionHead id="lab-solo" code="LAB 1.3-S" title="Lab solo — provocarea de cablare (două clădiri)" />
      <Summary>
        <p><b>Scenariu:</b> o firmă are două clădiri la <b>600 m</b> una de alta. În clădirea A sunt routerul, switch-ul central, un switch de acces cu un hub vechi rămas într-un laborator și un switch pentru laboratorul de test. În clădirea B e un singur switch. Tu alegi <b>fiecare cablu</b>, justifici alegerea, construiești topologia în Packet Tracer și numeri domeniile.
          <br />Primești <b>doar cerințele</b>. Rezolvă singur, apoi deschide soluția.</p>
      </Summary>
      <Figure caption="Topologia țintă. Liniile punctate gri sunt legăturile pentru care trebuie să alegi cablul.">
        <LabSoloCablingTopology />
      </Figure>
      <Detailed title="Cerințe">
        <ol>
          <li><b>Partea A — alegerea cablurilor.</b> Completează în notițe, pentru fiecare legătură: tipul de mediu, tipul de cablu (straight / crossover / rollover / fibră — ce fel) și motivul. Presupune că porturile <b>nu</b> au Auto-MDIX.
            <ul>
              <li>ADMIN ↔ R-EDGE (configurarea inițială a routerului)</li>
              <li>R-EDGE Gi0/0 ↔ SW-CORE și R-EDGE Gi0/1 ↔ SW-LAB</li>
              <li>SW-CORE ↔ SW-ACC1 (aceeași clădire, 40 m)</li>
              <li>SW-CORE ↔ SW-B (clădirea B, <b>600 m</b>, 1 Gb/s)</li>
              <li>SW-CORE ↔ SRV1; SW-ACC1 ↔ PC-A1, PC-A2; SW-LAB ↔ PC-L1, PC-L2; SW-B ↔ PC-B1, PC-B2</li>
              <li>SW-ACC1 ↔ HUB1 și HUB1 ↔ PC-H1, PC-H2, PC-H3</li>
            </ul>
          </li>
          <li><b>Partea B — construiește în PT.</b> R-EDGE = 1941; SW-CORE și SW-B = Switch-PT (cu modul de fibră); SW-ACC1 și SW-LAB = 2960; HUB1 = Hub-PT. Adresare: LAN-ul principal <code>192.168.10.0/24</code> (R-EDGE Gi0/0 = .1), laboratorul <code>192.168.20.0/24</code> (R-EDGE Gi0/1 = .1). Configurează R-EDGE <b>doar prin consolă</b>.</li>
          <li><b>Partea C — verificare:</b> PC-H1 dă ping la PC-B2 și la PC-L1. Pe R-EDGE: <code>show ip interface brief</code> arată ambele interfețe up/up.</li>
          <li><b>Partea D — întrebări:</b> (a) Câte <b>domenii de coliziune</b> și câte <b>domenii de broadcast</b> are topologia? (b) Ce duplex va avea portul SW-ACC1 spre HUB1 și de ce? (c) De ce nu e potrivită fibra multimod cu 1000BASE-SX pentru legătura de 600 m? (d) Ce alternativă ai avea dacă între clădiri există o singură fibră liberă?</li>
        </ol>
        <Callout kind="tip" title="Indicii (deschide doar dacă te blochezi)">
          <Reveal label="Indiciul 1 — regula cablurilor"><p>Împarte dispozitivele în MDI (PC, server, router) și MDI-X (switch, hub). Diferite → straight; la fel → crossover. Consola nu e Ethernet.</p></Reveal>
          <Reveal label="Indiciul 2 — 600 m"><p>Uită-te în tabelul standardelor la distanța maximă a lui 1000BASE-SX pe OM2 și la ce standard folosește fibra monomod.</p></Reveal>
          <Reveal label="Indiciul 3 — numărarea domeniilor"><p>Fiecare legătură care pornește dintr-un port de switch sau de router = un domeniu de coliziune; tot ce e în spatele hub-ului = unul singur. Domeniile de broadcast = interfețele LAN ale routerului.</p></Reveal>
        </Callout>
      </Detailed>
      <Reveal label="Soluție completă">
        <h4>Partea A — cablurile</h4>
        <Table head={['Legătură', 'Mediu / cablu', 'Motiv']} rows={[
          ['ADMIN ↔ R-EDGE Console', 'Console (rollover), terminal 9600 8N1', 'routerul nou nu are IP; acces serial out-of-band'],
          ['R-EDGE ↔ SW-CORE / SW-LAB', 'UTP straight-through', 'router (MDI) ↔ switch (MDI-X)'],
          ['SW-CORE ↔ SW-ACC1', 'UTP crossover', 'switch ↔ switch (MDI-X ↔ MDI-X), 40 m < 100 m'],
          ['SW-CORE ↔ SW-B', 'fibră monomod (SMF OS2) + module 1000BASE-LX (1310 nm, 5 km), LC duplex', '600 m > 550 m (limita 1000BASE-SX pe OM2); în plus fibra dă izolare electrică între clădiri'],
          ['switch ↔ PC / server', 'UTP straight-through', 'MDI ↔ MDI-X'],
          ['SW-ACC1 ↔ HUB1', 'UTP crossover', 'switch ↔ hub, ambele MDI-X (unele hub-uri vechi aveau un port „uplink” care permitea straight-through)'],
          ['HUB1 ↔ PC-H1/H2/H3', 'UTP straight-through', 'MDI ↔ MDI-X'],
        ]} />
        <h4>Partea B — puncte cheie în PT</h4>
        <ol>
          <li>Pe SW-CORE și SW-B: power off → modul <code>PT-SWITCH-NM-1FGE</code> → power on; cablu <b>Fiber</b> între ele.</li>
          <li>Consola: Admin <code>RS 232</code> → R-EDGE <code>Console</code>, Terminal 9600/8/None/1/None.</li>
        </ol>
        <CodeBlock title="R-EDGE — prin consolă" kind="session" code={`Router> enable
Router# configure terminal
Router(config)# hostname R-EDGE
R-EDGE(config)# interface GigabitEthernet0/0
R-EDGE(config-if)# ip address 192.168.10.1 255.255.255.0
R-EDGE(config-if)# no shutdown
R-EDGE(config-if)# interface GigabitEthernet0/1
R-EDGE(config-if)# ip address 192.168.20.1 255.255.255.0
R-EDGE(config-if)# no shutdown
R-EDGE(config-if)# end
R-EDGE# show ip interface brief`} />
        <p>PC-urile din LAN-ul principal primesc 192.168.10.10+ cu gateway 192.168.10.1; cele din laborator 192.168.20.10+ cu gateway 192.168.20.1.</p>
        <h4>Partea D — răspunsuri</h4>
        <ul>
          <li><b>(a) 12 domenii de coliziune, 2 domenii de broadcast.</b> Coliziune: R-EDGE–SW-CORE (1), R-EDGE–SW-LAB (2), SW-CORE–SW-ACC1 (3), SW-CORE–SW-B (4), SW-CORE–SRV1 (5), SW-ACC1–PC-A1 (6), SW-ACC1–PC-A2 (7), SW-ACC1–HUB1 + cele 3 PC-uri ale hub-ului (8), SW-B–PC-B1 (9), SW-B–PC-B2 (10), SW-LAB–PC-L1 (11), SW-LAB–PC-L2 (12). Cablul de consolă nu e Ethernet și nu contează. Broadcast: câte unul pentru fiecare interfață LAN a routerului (Gi0/0 și Gi0/1).</li>
          <li><b>(b) Half-duplex.</b> Hub-ul e un mediu partajat; nu poate face full-duplex. Hub-urile 10BASE-T nu negociază, deci switch-ul detectează doar viteza (10 Mb/s) și presupune half-duplex — corect în acest caz.</li>
          <li><b>(c)</b> 1000BASE-SX garantează cel mult 550 m pe OM2 (275 m pe OM1); din cauza dispersiei modale, 600 m depășesc limita. Monomodul cu 1000BASE-LX merge 5 km.</li>
          <li><b>(d)</b> Module <G id="bidi" /> (de exemplu 1000BASE-BX10-U la un capăt și BX10-D la celălalt): emisie și recepție pe aceeași fibră, pe lungimi de undă diferite (1310/1490 nm).</li>
        </ul>
        <Callout kind="exam" title="Legătură cu examenul">Scenariul acoperă 1.3.a (cupru vs MMF vs SMF, tipuri de cabluri) și 1.3.b (hub = mediu partajat, domenii de coliziune/broadcast, half vs full duplex). Pregătește terenul pentru 1.4 (ce se întâmplă când duplexul nu se potrivește) și 1.13 (cum învață switch-ul MAC-urile).</Callout>
      </Reveal>
    </section>
  );
}
