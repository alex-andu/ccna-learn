import { Link } from 'react-router-dom';
import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.3" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Topicul 1.3 este de tip <b>Compare</b>: la examen trebuie să alegi și să recunoști, nu să configurezi. Dar pe echipamente vei vedea mediul fizic direct în comenzi: <code>speed</code>, <code>duplex</code>, <code>mdix auto</code>, <code>media-type</code> și, la verificare, <code>show interfaces status</code>, <code>show interfaces transceiver</code>, <code>show inventory</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative">
        Ieșirile de mai jos sunt <b>exemple construite pentru învățare</b>, pe modelul output-urilor Cisco IOS / IOS XE (Catalyst 2960/9300, ISR). Nu au fost capturate de pe echipamente reale: coloanele, numele de interfețe și valorile exacte diferă între modele și versiuni. Verifică întotdeauna cu <code>?</code> pe echipamentul tău. Interpretarea erorilor (CRC, coliziuni, duplex mismatch) se face în <Link to="/topic/1.4">1.4</Link>.
      </Callout>

      <Detailed title="Exemplul 1 — viteza, duplexul și Auto-MDIX pe un port de acces">
        <CodeBlock title="SW1 — port spre un PC" kind="session" code={`SW1# configure terminal
SW1(config)# interface GigabitEthernet1/0/1
SW1(config-if)# description PC-Ana (priza 2.14)
SW1(config-if)# speed auto
SW1(config-if)# duplex auto
SW1(config-if)# mdix auto
SW1(config-if)# no shutdown
SW1(config-if)# end`} explain={[
          ['interface GigabitEthernet1/0/1', 'Intri în modul de configurare al portului 1 de pe switch-ul 1 (stack member 1), modulul 0.'],
          ['description …', 'Text liber — documentează ce e legat la port. Apare în show interfaces status (coloana Name).'],
          ['speed auto', <>Viteza se stabilește prin <G id="autonegotiation" /> (implicit). Alternative: <code>speed 10</code> / <code>100</code> / <code>1000</code>.</>],
          ['duplex auto', <>Duplexul se negociază (implicit). Alternative: <code>duplex full</code> / <code>half</code>. Setarea manuală a vitezei și a duplexului dezactivează autonegocierea pe port.</>],
          ['mdix auto', <>Activează <G id="auto-mdix" /> — orice cablu (drept sau încrucișat) funcționează. Pe multe platforme Catalyst e implicit; pe unele merge doar cu speed/duplex pe auto. Dezactivare: <code>no mdix auto</code>.</>],
          ['no shutdown', 'Pe switch-uri porturile sunt de obicei active implicit; pe routere interfețele sunt oprite implicit și trebuie pornite.'],
        ]} />
        <CodeBlock title="Setare manuală (doar dacă și celălalt capăt e setat identic)" kind="session" code={`SW1(config)# interface GigabitEthernet1/0/24
SW1(config-if)# description Server-vechi (100/full fix)
SW1(config-if)# speed 100
SW1(config-if)# duplex full
SW1(config-if)# end`} explain={[
          ['speed 100', 'Forțează 100 Mb/s. Dacă celălalt capăt e forțat la altă viteză, legătura nu se ridică (speed mismatch).'],
          ['duplex full', 'Forțează full-duplex. Dacă celălalt capăt rămâne pe auto, acela va presupune half-duplex → duplex mismatch (1.4). Regula Cisco: auto la ambele capete sau manual identic la ambele.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — citirea mediului în show interfaces status">
        <CodeBlock title="SW1 — toate porturile dintr-o privire" kind="session" code={`SW1# show interfaces status

Port      Name               Status       Vlan       Duplex  Speed Type
Gi1/0/1   PC-Ana (priza 2.14 connected    10         a-full a-1000 10/100/1000BaseTX
Gi1/0/2                      notconnect   1            auto   auto 10/100/1000BaseTX
Gi1/0/3   Imprimanta-et2     connected    10         a-full  a-100 10/100/1000BaseTX
Gi1/0/24  Server-vechi (100/ connected    20           full    100 10/100/1000BaseTX
Gi1/1/1   Uplink-DIST1       connected    trunk        full   1000 1000BaseSX SFP
Gi1/1/2                      notconnect   1            full   1000 1000BaseLX SFP
Te1/1/3   Uplink-DIST2       connected    trunk        full    10G SFP-10GBase-SR
Te1/1/4                      notpresent   1            full    10G unknown`} explain={[
          ['Status', <><code>connected</code> = legătură activă; <code>notconnect</code> = nimic legat / cablu defect / capătul opus oprit; <code>notpresent</code> = slot SFP fără modul.</>],
          ['a-full / a-1000', 'Prefixul „a-” = valoare obținută prin autonegociere. Fără „a-” = valoare setată manual (ca la Gi1/0/24).'],
          ['a-100 la imprimantă', 'Portul e gigabit, dar imprimanta suportă doar 100 Mb/s → autonegocierea a ales cea mai mare viteză comună. Dacă un PC gigabit negociază doar 100, suspectează un cablu cu o pereche defectă (1.4).'],
          ['Type 10/100/1000BaseTX', 'Port de cupru RJ-45 (10/100/1000BASE-T).'],
          ['Type 1000BaseSX SFP / 1000BaseLX SFP', <>Slot <G id="sfp" /> cu modul optic: SX = multimod 850 nm, LX = monomod 1310 nm. Coloana Type arată ce modul e introdus.</>],
          ['SFP-10GBase-SR', <>Modul <G id="sfp-plus" /> 10GBASE-SR (multimod) pe un port Ten-Gigabit.</>],
        ]} />
        <CodeBlock title="SW1 — detalii despre un singur port" kind="session" code={`SW1# show interfaces GigabitEthernet1/0/1 | include line protocol|duplex|media
GigabitEthernet1/0/1 is up, line protocol is up (connected)
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX
SW1# show interfaces GigabitEthernet1/1/1 | include line protocol|duplex|media
GigabitEthernet1/1/1 is up, line protocol is up (connected)
  Full-duplex, 1000Mb/s, link type is auto, media type is 1000BaseSX SFP`} explain={[
          ['| include …', 'Filtrează ieșirea lungă a comenzii show interfaces și păstrează doar liniile care conțin cuvintele date (separate prin |).'],
          ['is up, line protocol is up', 'Starea nivelului 1 / nivelului 2. Stările posibile se studiază în 1.4.'],
          ['media type is …', 'Tipul fizic al portului: cupru (BaseTX) sau modulul optic introdus.'],
        ]} />
        <CodeBlock title="Auto-MDIX — verificare la nivelul PHY (Catalyst)" kind="session" code={`SW1# show controllers ethernet-controller GigabitEthernet1/0/1 phy | include MDIX
 Auto-MDIX                             :  On   [AdminState=1   Flags=0x00056248]`} explain={[
          ['show controllers ethernet-controller … phy', 'Detalii despre cipul fizic (PHY) al portului. Disponibilitatea și formatul diferă între platforme — pe unele modele comanda nu există.'],
          ['Auto-MDIX : On', 'Funcția e activă; portul va corecta singur un cablu „greșit”.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — module SFP: ce e introdus și ce putere optică are">
        <CodeBlock title="SW1 — inventarul modulelor" kind="session" code={`SW1# show inventory
NAME: "c93xx Stack", DESCR: "c93xx Stack"
PID: C9300-24T         , VID: V02  , SN: FCW0000A1B2

NAME: "GigabitEthernet1/1/1", DESCR: "1000BaseSX SFP"
PID: GLC-SX-MMD          , VID: V01  , SN: AGM0000ABCD

NAME: "TenGigabitEthernet1/1/3", DESCR: "SFP-10GBase-SR"
PID: SFP-10G-SR          , VID: V03  , SN: AVD0000EFGH`} explain={[
          ['show inventory', 'Lista componentelor hardware identificabile: șasiu, surse, module. Utilă ca să afli exact ce transceiver e în fiecare port (PID = codul produsului).'],
          ['GLC-SX-MMD', 'Exemplu de cod Cisco pentru un SFP 1000BASE-SX (multimod, 850 nm).'],
          ['SFP-10G-SR', 'Exemplu de cod Cisco pentru un SFP+ 10GBASE-SR. Seriile (SN) de aici sunt fictive.'],
        ]} />
        <CodeBlock title="SW1 — DOM: temperatură, tensiune, putere TX/RX" kind="session" code={`SW1# show interfaces transceiver
If device is externally calibrated, only calibrated values are printed.
++ : high alarm, +  : high warning, -  : low warning, -- : low alarm.
NA or N/A: not applicable, Tx: transmit, Rx: receive.
mA: milliamperes, dBm: decibels (milliwatts).

                                           Optical   Optical
            Temperature  Voltage  Current  Tx Power  Rx Power
Port        (Celsius)    (Volts)  (mA)     (dBm)     (dBm)
---------   -----------  -------  -------  --------  --------
Gi1/1/1        31.2       3.29      5.8      -5.1      -6.0
Te1/1/3        33.0       3.30      6.2      -2.4    -15.8 -`} explain={[
          ['show interfaces transceiver', <>Valorile <G id="dom" /> ale fiecărui modul optic care le suportă. Varianta <code>… detail</code> arată și pragurile de avertizare/alarmă.</>],
          ['Tx Power / Rx Power (dBm)', 'Puterea luminii emise și primite. Valorile normale depind de tipul modulului (vezi fișa lui tehnică).'],
          ['-15.8 -', 'Semnul „-” după valoare = low warning: lumina primită pe Te1/1/3 e prea slabă. Suspecte uzuale: conector murdar, fibră îndoită/deteriorată, prea multe îmbinări, fibră de tip greșit.'],
        ]} />
        <CodeBlock title="Port combo (dual-media): alegi RJ-45 sau SFP" kind="session" code={`R1(config)# interface GigabitEthernet0/0/0
R1(config-if)# media-type sfp
R1(config-if)# end
R1# show interfaces GigabitEthernet0/0/0 | include media
  Full Duplex, 1000Mbps, link type is auto, media type is SX`} explain={[
          ['media-type sfp', 'Pe interfețele „combo” (un port logic cu două conectori fizici: RJ-45 și slot SFP), alegi care dintre ele e folosit. Opțiuni uzuale: rj45, sfp și, pe unele platforme, auto-select.'],
          ['media type is SX', 'Confirmă că interfața folosește modulul optic. Doar unele routere ISR și switch-uri au porturi combo — verifică documentația modelului.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — legătură serială punct-la-punct (1.3.b)">
        <p>În Packet Tracer și în laburile clasice CCNA, două routere se pot lega cu un cablu serial (modul HWIC-2T pe un ISR 1941/2911). Un capăt e <b>DCE</b> și trebuie să dea ceasul.</p>
        <CodeBlock title="R1 (capătul DCE)" kind="session" code={`R1(config)# interface Serial0/0/0
R1(config-if)# description Linie seriala spre R2
R1(config-if)# ip address 10.0.12.1 255.255.255.252
R1(config-if)# encapsulation hdlc
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown
R1(config-if)# end
R1# show controllers serial 0/0/0 | include DCE|DTE|clock
DCE V.35, clock rate 64000`} explain={[
          ['interface Serial0/0/0', <>Interfața <G id="serial-link">serială</G> 0 de pe modulul din slotul 0/0.</>],
          ['ip address 10.0.12.1 255.255.255.252', 'Un /30 — exact două adrese utilizabile, câte una pentru fiecare capăt al legăturii punct-la-punct (subnetting în 1.6).'],
          ['encapsulation hdlc', <><G id="hdlc" /> e implicit pe Cisco; comanda apare aici doar ca să fie vizibilă. Alternativa standard: <code>encapsulation ppp</code> (<G id="ppp" />) — trebuie să fie aceeași la ambele capete.</>],
          ['clock rate 64000', 'Doar pe capătul DCE: frecvența ceasului în bit/s. Fără ea, legătura nu transmite date (interfața poate rămâne up/down).'],
          ['show controllers serial 0/0/0', 'Arată ce capăt de cablu e conectat la interfață (DCE sau DTE) și ceasul setat — singura metodă de a afla din CLI ce capăt al cablului ai.'],
        ]} />
      </Detailed>

      <Detailed title="Verificare pe client (legătură cu 1.10)">
        <CodeBlock title="Windows (PowerShell)" kind="session" code={`PS C:\\> Get-NetAdapter | Format-Table Name, Status, LinkSpeed, MediaType
Name      Status LinkSpeed MediaType
----      ------ --------- ---------
Ethernet  Up     1 Gbps    802.3
Wi-Fi     Up     866.7 Mbps Native 802.11`} explain={[
          ['Get-NetAdapter', 'Lista plăcilor de rețea cu starea și viteza negociată. Un „100 Mbps” pe o placă gigabit legată la un switch gigabit indică adesea un cablu cu o pereche lipsă/defectă.'],
        ]} />
        <CodeBlock title="Linux" kind="session" code={`$ sudo ethtool eth0
Settings for eth0:
        Supported ports: [ TP ]
        Speed: 1000Mb/s
        Duplex: Full
        Auto-negotiation: on
        Port: Twisted Pair
        MDI-X: on (auto)
        Link detected: yes`} explain={[
          ['ethtool eth0', 'Parametrii fizici ai plăcii: viteză, duplex, autonegociere, tipul portului (TP = twisted pair, FIBRE).'],
          ['MDI-X: on (auto)', 'Placa folosește Auto-MDIX și în acest moment lucrează în configurația MDI-X. Nu toate driverele raportează acest câmp.'],
        ]} />
      </Detailed>
    </section>
  );
}
