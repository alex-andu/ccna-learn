import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology21, LabSoloTopology21 } from '../../diagrams/t2_1';

/* ======================================================================
   LAB GHIDAT — VLAN-uri pe două switch-uri + router-on-a-stick
   ====================================================================== */
export function GuidedLab() {
  const L = 't21g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.1-G" title="Lab ghidat — VLAN-uri pe două switch-uri și router-on-a-stick (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> creezi VLAN 10 și VLAN 20, atribui porturi access, legi două switch-uri printr-un trunk, verifici că PC-urile din același VLAN comunică peste cele două switch-uri, iar cele din VLAN-uri diferite <b>nu</b>, apoi activezi <G id="router-on-a-stick" /> și vezi <G id="inter-vlan-routing" /> funcționând.
          <br /><b>Timp estimat:</b> 60–80 min · <b>Unealtă:</b> Cisco Packet Tracer (2 × Switch 2960, 1 × Router 2911, 4 PC-uri); merge și în GNS3/CML cu imagini de switch L2 și router · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia: VLAN 10 și VLAN 20 sunt prezente pe ambele switch-uri; R1 face inter-VLAN routing printr-un singur trunk.">
        <LabGuidedTopology21 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă / mască', 'Gateway', 'Conectat la / VLAN']} rows={[
        ['PC1', 'FastEthernet0', '192.168.10.11 /24', '192.168.10.1', 'SW1 Fa0/1 · VLAN 10'],
        ['PC2', 'FastEthernet0', '192.168.20.11 /24', '192.168.20.1', 'SW1 Fa0/2 · VLAN 20'],
        ['PC3', 'FastEthernet0', '192.168.10.12 /24', '192.168.10.1', 'SW2 Fa0/1 · VLAN 10'],
        ['PC4', 'FastEthernet0', '192.168.20.12 /24', '192.168.20.1', 'SW2 Fa0/2 · VLAN 20'],
        ['R1', 'Gi0/0.10', '192.168.10.1 /24', '—', 'SW1 Fa0/24 (trunk)'],
        ['R1', 'Gi0/0.20', '192.168.20.1 /24', '—', 'același cablu (trunk)'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Comenzile din lab <b>nu au fost testate</b> de autorul lecției în versiunea ta de Packet Tracer; simulatorul poate afișa diferit față de IOS real (de exemplu nu cere <code>switchport trunk encapsulation dot1q</code> pe 2960, care suportă doar 802.1Q). Dacă o comandă e respinsă, folosește <code>?</code>. Trunk-ul (<code>switchport mode trunk</code>) este explicat la 2.2: aici îl folosim doar ca „drum comun” al VLAN-urilor între switch-uri.
      </Callout>

      <Detailed title="Partea 1 — VLAN-uri și porturi access pe SW1">
        <Step labKey={L} n={1} title="Construiește topologia și adresele">
          <p>Montează switch-urile, routerul și PC-urile conform imaginii (cabluri <b>copper straight-through</b>; Gi0/1 ↔ Gi0/1 între switch-uri; R1 Gi0/0 → SW1 Fa0/24). Configurează adresele IP, masca 255.255.255.0 și gateway-ul din tabel (<i>Desktop → IP Configuration</i>).</p>
        </Step>
        <Step labKey={L} n={2} title="Fără VLAN-uri: toți în VLAN 1">
          <p>Înainte să configurezi ceva, pe SW1 rulează <code>show vlan brief</code>. Toate porturile sunt în VLAN 1.</p>
          <Reveal label="Întrebare: ar merge un ping între PC1 și PC2 acum?"><p>PC1 (192.168.10.11) și PC2 (192.168.20.11) sunt în subrețele <i>diferite</i>, deci PC1 ar trimite către gateway-ul 192.168.10.1, care nu există încă. Ping-ul eșuează chiar dacă ambele sunt în VLAN 1: problema nu e L2, e adresarea IP. (La fel și între switch-uri: legătura SW1–SW2 nu e încă configurată explicit.)</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Creează VLAN-urile pe ambele switch-uri">
          <CodeBlock title="SW1 și SW2" kind="config" code={`Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
SW1(config)# vlan 10
SW1(config-vlan)# name CONTABILITATE
SW1(config-vlan)# vlan 20
SW1(config-vlan)# name VANZARI
SW1(config-vlan)# end
SW1# show vlan brief`} explain={[
            ['hostname SW1', 'Pe al doilea switch folosești SW2.'],
            ['vlan 10 / name …', 'VLAN-urile trebuie create pe FIECARE switch (nu folosim VTP). Același număr și același nume pe ambele.'],
            ['show vlan brief', 'Verifică: VLAN 10 și 20 există și sunt „active”; încă nu au porturi.'],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="Atribuie porturile access">
          <CodeBlock title="SW1" kind="config" code={`SW1# configure terminal
SW1(config)# interface fa0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# interface fa0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 20
SW1(config-if)# end
SW1# show vlan brief`} explain={[
            ['Fa0/1 → VLAN 10, Fa0/2 → VLAN 20', 'PC1 în VLAN 10, PC2 în VLAN 20.'],
            ['show vlan brief', 'Fa0/1 sub VLAN 10, Fa0/2 sub VLAN 20; restul rămân în default.'],
          ]} />
          <p>Pe SW2 repetă: Fa0/1 → VLAN 10 (PC3), Fa0/2 → VLAN 20 (PC4).</p>
        </Step>
        <Step labKey={L} n={5} title="Trunk între switch-uri">
          <CodeBlock title="SW1 și SW2" kind="config" code={`SW1(config)# interface gi0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# end
SW1# show interfaces trunk`} explain={[
            ['switchport mode trunk', 'Transformă legătura în trunk 802.1Q (detalii în 2.2). Rulează-l pe ambele capete.'],
            ['show interfaces trunk', 'Gi0/1 apare ca trunk, cu VLAN-urile permise 1–1005 (implicit) și VLAN-uri active 1, 10, 20.'],
          ]} />
          <Reveal label="Întrebare: de ce nu apare Gi0/1 în show vlan brief?"><p>Pentru că este port trunk: nu aparține unui singur VLAN. Pentru trunk-uri folosești <code>show interfaces trunk</code>.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Testează comunicarea în interiorul VLAN-ului">
          <p>Din PC1 dă ping către PC3 (192.168.10.12): trebuie să reușească (același VLAN, switch-uri diferite). Din PC2 către PC4 la fel. Din PC1 către PC2 sau PC4: <b>nu</b> reușește încă (nu există routing).</p>
          <Reveal label="Ce demonstrează asta"><p>Primele două pings arată că VLAN-ul „se întinde” peste două switch-uri prin trunk (<i>spanning multiple switches</i>). Ultimele eșuează pentru că între VLAN-uri e nevoie de un dispozitiv de nivel 3: PC1 trimite pachetul către gateway-ul 192.168.10.1, care nu există încă.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Inter-VLAN routing cu router-on-a-stick">
        <Step labKey={L} n={7} title="Trunk spre router pe SW1">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface fa0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# end`} explain={[
            ['interface fa0/24', 'Portul spre R1.'],
            ['switchport mode trunk', 'Routerul va primi cadre etichetate cu 802.1Q și va trimite cadre etichetate.'],
          ]} />
        </Step>
        <Step labKey={L} n={8} title="Subinterfețe pe R1">
          <CodeBlock title="R1" kind="config" code={`Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface gi0/0
R1(config-if)# no shutdown
R1(config-if)# interface gi0/0.10
R1(config-subif)# encapsulation dot1Q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config-subif)# interface gi0/0.20
R1(config-subif)# encapsulation dot1Q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config-subif)# end
R1# show ip interface brief
R1# show ip route`} explain={[
            ['interface gi0/0 / no shutdown', 'Interfața fizică trebuie pornită; fără IP.'],
            ['encapsulation dot1Q 10', 'Subinterfața .10 prelucrează VLAN 10.'],
            ['ip address 192.168.10.1 …', 'Gateway pentru VLAN 10.'],
            ['show ip interface brief / show ip route', 'Subinterfețele sunt up/up; apar rutele C și L pentru ambele rețele.'],
          ]} />
        </Step>
        <Step labKey={L} n={9} title="Testează inter-VLAN">
          <p>Din PC1: <code>ping 192.168.10.1</code> (gateway), apoi <code>ping 192.168.20.11</code> (PC2) și <code>ping 192.168.20.12</code> (PC4). Acum ar trebui să reușească (primul pachet poate pierde la ARP).</p>
          <p>Rulează <code>tracert 192.168.20.11</code> (în Command Prompt din PC1): vei vedea <b>un salt intermediar</b> — 192.168.10.1 (routerul) — apoi destinația.</p>
          <Reveal label="Întrebare: pe ce cabluri a trecut pachetul PC1 → PC2?"><p>PC1 → SW1 (access, fără tag) → R1 pe trunk Fa0/24 (tag VID 10) → R1 rutează → înapoi pe același trunk (tag VID 20) → SW1 → PC2 (access, fără tag). Trunk-ul Fa0/24 a fost parcurs de două ori — „on a stick”.</p></Reveal>
        </Step>
        <Step labKey={L} n={10} title="Simulation mode">
          <p>În Simulation mode, filtrează doar ICMP/ARP. Urmărește un ping PC1 → PC2: observă ARP către gateway, apoi ICMP. Dă click pe plicul care iese din R1 spre SW1 și urmărește fila <i>PDU Information</i>/<i>Inbound / Outbound PDU Details</i>: ai tag-ul VLAN (802.1Q) pe segmentul trunk.</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Depanare provocată (defecte introduse de tine)">
        <Step labKey={L} n={11} title="Șterge un VLAN">
          <p>Pe SW1 rulează <code>no vlan 20</code> și apoi <code>show vlan brief</code>. Fa0/2 dispare din listă. Ping-ul PC1 → PC2 eșuează. Remediază cu <code>vlan 20</code> (porturile revin).</p>
          <Reveal label="De ce a revenit portul fără să-l atribui din nou?"><p>Configurația portului (<code>switchport access vlan 20</code>) a rămas; portul era doar inactiv fiindcă VLAN-ul lipsea. Recrearea VLAN-ului l-a reactivat.</p></Reveal>
        </Step>
        <Step labKey={L} n={12} title="Gateway greșit">
          <p>La PC2 schimbă gateway-ul în 192.168.10.1. Ce se întâmplă cu ping către PC1? Corectează apoi.</p>
          <Reveal label="Explicație"><p>192.168.10.1 nu e în subrețeaua lui PC2 (192.168.20.0/24), deci PC2 nu îl poate găsi prin ARP. PC2 nu mai poate ieși din subrețea.</p></Reveal>
        </Step>
        <Step labKey={L} n={13} title="Port în VLAN greșit">
          <p>Mută Fa0/2 pe SW1 în VLAN 10 (<code>switchport access vlan 10</code>) și păstrează IP-ul 192.168.20.11. Ce se întâmplă? Ce zice <code>show vlan brief</code>?</p>
          <Reveal label="Explicație"><p>PC2 e acum în domeniul de broadcast al VLAN-ului 10, dar IP-ul lui e din 192.168.20.0/24: gateway-ul 192.168.20.1 (subinterfața .20) nu e în VLAN-ul lui; nu poate fi atins la nivel 2. Soluție: restaurează <code>switchport access vlan 20</code>. Regula: VLAN-ul portului și subrețeaua IP trebuie să se potrivească.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — switch L3 cu SVI, voice VLAN, hardening
   ====================================================================== */
export function SoloLab() {
  const L = 't21s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.1-S" title="Lab solo — SVI pe switch L3, voice VLAN și hardening" />
      <Summary>
        <p><b>Obiectiv:</b> pornind doar de la cerințe, construiești o rețea cu trei VLAN-uri de date, un VLAN de voce, <G id="svi">SVI-uri</G> pe un switch multilayer și porturi nefolosite „parcate”. <b>Timp:</b> 60–90 min · <b>Unealtă:</b> Packet Tracer (Switch 3560 sau 3650 pentru MLS1, Switch 2960 pentru SW-A, un IP Phone, 4 PC-uri).</p>
      </Summary>
      <Figure caption="MLS1 face routing; SW-A este switch de acces cu trunk spre MLS1.">
        <LabSoloTopology21 />
      </Figure>
      <Callout kind="info" title="Limite Packet Tracer">
        Simulatorul poate să nu accepte toate opțiunile (de exemplu <code>switchport trunk encapsulation dot1q</code> este necesar pe 3560, dar nu pe 2960). Telefonul IP din PT folosește CDP pentru voice VLAN; dacă nu vezi telefonul în VLAN-ul de voce, verifică în PT versiunea de IP Phone. Comenzile nu au fost testate de autorul lecției în versiunea ta.
      </Callout>
      <Detailed title="Cerințe">
        <Table head={['VLAN', 'Nume', 'Subrețea', 'Gateway (SVI pe MLS1)']} rows={[
          ['10', 'DATE-A', '172.16.10.0/24', '172.16.10.1'],
          ['20', 'DATE-B', '172.16.20.0/24', '172.16.20.1'],
          ['30', 'SERVERE', '172.16.30.0/24', '172.16.30.1'],
          ['40', 'VOCE', '— (doar telefoane, fără SVI)', '—'],
          ['99', 'PARCARE', '— (porturi nefolosite)', '—'],
        ]} />
        <Step labKey={L} n={1} title="Topologie și VLAN-uri">
          <p>Creează VLAN-urile 10, 20, 30, 40 și 99 (cu numele din tabel) pe <b>ambele</b> switch-uri. VLAN 99 nu va avea SVI.</p>
        </Step>
        <Step labKey={L} n={2} title="Porturi access pe SW-A">
          <p>Fa0/1 → VLAN 10 (H1), Fa0/2 → VLAN 20 (H2). Fa0/3 → telefon IP: VLAN de date 10 (H4 conectat în spatele telefonului), voice VLAN 40. Restul porturilor (Fa0/4–Fa0/24, mai puțin trunk-ul) → VLAN 99 și <code>shutdown</code>.</p>
        </Step>
        <Step labKey={L} n={3} title="Trunk și MLS1">
          <p>Fă trunk între MLS1 Gi0/1 și SW-A Gi0/1 (permite doar VLAN-urile 10, 20, 40). Pe MLS1: H3 pe Fa0/5 în VLAN 30. Creează SVI-urile 10, 20, 30 cu .1 ca gateway și activează rutarea.</p>
        </Step>
        <Step labKey={L} n={4} title="Adresarea hosturilor">
          <p>H1 172.16.10.11, H2 172.16.20.12, H3 172.16.30.13, H4 172.16.10.14; gateway-ul fiecăruia = SVI-ul VLAN-ului lui.</p>
        </Step>
        <Step labKey={L} n={5} title="Verificări obligatorii">
          <p>Arată și interpretează: <code>show vlan brief</code> pe ambele switch-uri, <code>show interfaces trunk</code>, <code>show interfaces fa0/3 switchport</code> pe SW-A, <code>show ip interface brief</code> pe MLS1, <code>show ip route</code> pe MLS1. Pings: H1 → H3, H2 → H3, H4 → H1 (același VLAN).</p>
        </Step>
        <Step labKey={L} n={6} title="Întrebări de explicat">
          <p>(a) De ce SVI-ul VLAN 30 e up chiar dacă H3 e pe MLS1 și nu pe SW-A? (b) De ce nu există SVI pentru VLAN 40? (c) Ce s-ar întâmpla dacă ai uita <code>ip routing</code>? (d) De ce nu apare Gi0/1 în <code>show vlan brief</code>?</p>
          <Reveal label="Răspunsuri"><p>(a) Autostate: SVI-ul e up dacă VLAN-ul există și are cel puțin un port activ pe switch — aici Fa0/5 (access). (b) VLAN 40 transportă doar voce între telefon și infrastructura de voce; nu cerem rutare către alte rețele în acest lab. (c) SVI-urile ar fi up cu IP, dar switch-ul nu ar ruta între ele: H1 nu ar ajunge la H3. (d) E trunk: nu aparține unui singur VLAN.</p></Reveal>
        </Step>
        <Reveal label="Soluție completă (încearcă întâi singur)">
          <CodeBlock title="MLS1" kind="config" code={`MLS1(config)# ip routing
MLS1(config)# vlan 10
MLS1(config-vlan)# name DATE-A
MLS1(config-vlan)# vlan 20
MLS1(config-vlan)# name DATE-B
MLS1(config-vlan)# vlan 30
MLS1(config-vlan)# name SERVERE
MLS1(config-vlan)# vlan 40
MLS1(config-vlan)# name VOCE
MLS1(config-vlan)# vlan 99
MLS1(config-vlan)# name PARCARE
MLS1(config-vlan)# exit
MLS1(config)# interface vlan 10
MLS1(config-if)# ip address 172.16.10.1 255.255.255.0
MLS1(config-if)# no shutdown
MLS1(config-if)# interface vlan 20
MLS1(config-if)# ip address 172.16.20.1 255.255.255.0
MLS1(config-if)# no shutdown
MLS1(config-if)# interface vlan 30
MLS1(config-if)# ip address 172.16.30.1 255.255.255.0
MLS1(config-if)# no shutdown
MLS1(config-if)# interface fa0/5
MLS1(config-if)# switchport mode access
MLS1(config-if)# switchport access vlan 30
MLS1(config-if)# interface gi0/1
MLS1(config-if)# switchport trunk encapsulation dot1q
MLS1(config-if)# switchport mode trunk
MLS1(config-if)# switchport trunk allowed vlan 10,20,40`} explain={[
            ['ip routing', 'Esențial pentru rutarea între SVI-uri.'],
            ['interface vlan N', 'SVI-urile cu gateway-urile .1.'],
            ['switchport trunk encapsulation dot1q', 'Necesar pe platformele care suportă și ISL (3560); lipsește pe 2960.'],
            ['allowed vlan 10,20,40', 'VLAN-urile utile pe trunk (30 nu trece pe trunk — H3 e direct pe MLS1).'],
          ]} />
          <CodeBlock title="SW-A" kind="config" code={`SW-A(config)# vlan 10
SW-A(config-vlan)# name DATE-A
SW-A(config-vlan)# vlan 20
SW-A(config-vlan)# name DATE-B
SW-A(config-vlan)# vlan 40
SW-A(config-vlan)# name VOCE
SW-A(config-vlan)# vlan 99
SW-A(config-vlan)# name PARCARE
SW-A(config-vlan)# exit
SW-A(config)# interface fa0/1
SW-A(config-if)# switchport mode access
SW-A(config-if)# switchport access vlan 10
SW-A(config-if)# interface fa0/2
SW-A(config-if)# switchport mode access
SW-A(config-if)# switchport access vlan 20
SW-A(config-if)# interface fa0/3
SW-A(config-if)# switchport mode access
SW-A(config-if)# switchport access vlan 10
SW-A(config-if)# switchport voice vlan 40
SW-A(config-if)# interface range fa0/4-24
SW-A(config-if-range)# switchport mode access
SW-A(config-if-range)# switchport access vlan 99
SW-A(config-if-range)# shutdown
SW-A(config-if-range)# interface gi0/1
SW-A(config-if)# switchport mode trunk
SW-A(config-if)# switchport trunk allowed vlan 10,20,40`} explain={[
            ['switchport voice vlan 40', 'Fa0/3: date în VLAN 10, voce în VLAN 40.'],
            ['interface range fa0/4-24 … vlan 99 / shutdown', 'Hardening: porturi libere parcate și oprite.'],
            ['switchport mode trunk … allowed vlan', 'Trunk spre MLS1 cu doar VLAN-urile necesare.'],
          ]} />
        </Reveal>
      </Detailed>
    </section>
  );
}
