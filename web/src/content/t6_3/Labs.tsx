import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step, P } from '../../components/LabStep';
import { LabGuidedTopology63, LabSoloTopology63 } from '../../diagrams/t6_3';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't63g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 6.3-G" title="Lab ghidat — underlay OSPF + overlay GRE, și harta API-urilor northbound/southbound" />
      <Summary>
        <p><b>Obiectiv:</b> construiești în miniatură ideea de fabric: un <G id="underlay" /> rutat cu OSPF între patru routere și un <G id="overlay" /> (tunel GRE) între capete; demonstrezi că routerele din mijloc nu cunosc LAN-urile din overlay; observi încapsularea în Simulation Mode; apoi clasifici comunicații după direcția API (northbound/southbound). <br /><b>Timp estimat:</b> 50–70 min · <b>Unealtă:</b> Cisco Packet Tracer (4 routere, 2 PC-uri) sau GNS3/CML · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: underlay R1–R2–R3–R4 cu OSPF; overlay Tunnel0 între R1 și R4; LAN A și LAN B doar prin tunel.">
        <LabGuidedTopology63 />
      </Figure>
      <Table head={['Legătură / interfață', 'Adresă']} rows={[
        ['R1 Gi0/1 — R2 Gi0/0', '10.0.12.1/30 — 10.0.12.2/30'],
        ['R2 Gi0/1 — R3 Gi0/0', '10.0.23.1/30 — 10.0.23.2/30'],
        ['R3 Gi0/1 — R4 Gi0/0', '10.0.34.1/30 — 10.0.34.2/30'],
        ['Loopback0', 'R1 1.1.1.1/32 · R2 2.2.2.2/32 · R3 3.3.3.3/32 · R4 4.4.4.4/32'],
        ['Tunnel0 (overlay)', 'R1 10.255.0.1/30 — R4 10.255.0.2/30'],
        ['LAN A / LAN B', 'R1 Gi0/0 192.168.1.1/24 (PC-A .10) · R4 Gi0/1 192.168.2.1/24 (PC-B .10)'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer suportă interfețe tunnel GRE pe routere, dar unele comenzi (de exemplu <code>tunnel mode gre ip</code>, <code>ip mtu</code>) pot lipsi sau diferi; dacă o comandă nu e acceptată, omite-o (GRE/IP este implicit). VXLAN, LISP, NETCONF și RESTCONF <b>nu</b> se pot testa în PT: ele apar doar în analiza de la partea 3. Pașii sunt ilustrativi și nu au fost testați de autorul lecției. În GNS3/CML (IOSv/CSR) comenzile sunt cele din secțiunea „Exemple”.
      </Callout>

      <Detailed title="Partea 1 — Underlay">
        <Step labKey={L} n={1} title="Adresare și OSPF">
          <p>Configurează adresele din tabel (inclusiv loopback-urile) și OSPF area 0 pe legăturile 10.0.x.x și pe loopback-uri. <b>Nu</b> anunța LAN-urile 192.168.x.x și nici Tunnel0 în OSPF. Verifică <code>show ip ospf neighbor</code> și <code>show ip route ospf</code> pe R1.</p>
          <Reveal label="Verificare"><p>R1 trebuie să vadă ruta spre 4.4.4.4/32 (și spre 10.0.34.0/30) prin OSPF. Dacă lipsește, tunelul nu va porni.</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Testează underlay-ul">
          <p>De pe R1: <code>ping 4.4.4.4 source 1.1.1.1</code>. De ce folosim loopback-urile ca endpoint-uri?</p>
          <Reveal label="Răspuns"><p>Loopback-ul este o adresă stabilă, independentă de o interfață fizică; dacă o legătură cade, loopback-ul rămâne accesibil pe altă cale. În fabric-urile reale, această adresă este „locația” (RLOC) nodului.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Overlay">
        <Step labKey={L} n={3} title="Tunelul GRE">
          <p>Pe R1 și R4 creează <code>interface tunnel 0</code> cu adresele 10.255.0.1/.2, <code>tunnel source loopback 0</code>, <code>tunnel destination</code> către loopback-ul celuilalt. Verifică <code>show interfaces tunnel 0</code>.</p>
          <Reveal label="Răspuns"><p>„Tunnel0 is up, line protocol is up”, cu sursa/destinația corecte. Dacă destinația nu e în tabela de rutare, tunelul rămâne down.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Rute prin overlay">
          <p>Adaugă pe R1 <code>ip route 192.168.2.0 255.255.255.0 10.255.0.2</code> și pe R4 ruta inversă. Configurează PC-urile și testează <code>ping</code> de la PC-A la PC-B.</p>
          <Reveal label="Răspuns"><p>Ping-ul reușește, deși R2 și R3 nu au nicio rută către 192.168.x.x. Fără ruta de întoarcere pe R4, ping-ul eșuează (pachetele ajung, răspunsul nu).</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Dovada: underlay-ul nu cunoaște overlay-ul">
          <p>Pe R2 rulează <code>show ip route</code> și caută 192.168.x.x. Apoi <code>traceroute</code> de la R1 către 192.168.2.10: câte salturi vezi?</p>
          <Reveal label="Răspuns"><p>R2 nu are rute 192.168.x.x. Traceroute-ul arată două salturi (capătul tunelului și destinația): R2 și R3 sunt „invizibile”, pentru că pachetul este încapsulat și TTL-ul exterior nu este cel al pachetului original.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Simulation Mode">
          <p>În PT: <P>Simulation → filtrează ICMP</P>, trimite un ping de la PC-A la PC-B și deschide pachetul la R2 (<code>PDU Information</code>). Ce adrese are antetul exterior? Ce protocol?</p>
          <Reveal label="Răspuns"><p>Exterior: 1.1.1.1 → 4.4.4.4, protocol GRE (IP 47). În interior: 192.168.1.10 → 192.168.2.10. Același principiu ca la VXLAN, cu alt antet de încapsulare.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Defectarea underlay-ului">
          <p>Închide legătura R2–R3 (<code>shutdown</code>) și repetă ping-ul. Ce se întâmplă? Cum se vede problema pe R1 (<code>show ip route 4.4.4.4</code>, <code>show interfaces tunnel 0</code>)?</p>
          <Reveal label="Răspuns"><p>Ruta spre 4.4.4.4 dispare din OSPF; tunelul poate trece în down și ping-ul eșuează. Lecție: <b>overlay-ul depinde de underlay</b>; o problemă în underlay „se vede” ca problemă în overlay.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — API-uri northbound și southbound (analiză)">
        <Step labKey={L} n={8} title="Clasifică comunicațiile">
          <p>Pentru fiecare situație de mai jos, scrie: <b>NB</b> (northbound) sau <b>SB</b> (southbound), și protocolul probabil.</p>
          <Table head={['#', 'Situație']} rows={[
            ['1', 'Un script Python cere controller-ului lista switch-urilor, cu o cerere HTTPS și primește JSON'],
            ['2', 'Controller-ul trimite configurația VLAN către un switch prin XML peste SSH, portul 830'],
            ['3', 'Un portal de tichete cere controller-ului să creeze o politică de acces'],
            ['4', 'Controller-ul citește contoarele unui router prin UDP 161'],
            ['5', 'Controller-ul instalează o regulă de flux direct în tabela unui switch (OpenFlow)'],
          ]} />
          <Reveal label="Soluție">
            <ol>
              <li>NB — REST (HTTPS + JSON).</li>
              <li>SB — NETCONF (SSH, TCP 830, XML).</li>
              <li>NB — API REST către controller.</li>
              <li>SB — SNMP.</li>
              <li>SB — OpenFlow.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={9} title="Reflecție">
          <p>Scrie în 5–6 rânduri: (1) Ce este underlay și ce overlay în laboratorul tău? (2) Ce avantaj aduce faptul că R2/R3 nu cunosc LAN-urile? (3) Ce plan ar fi „control plane”, ce „data plane” într-un fabric SD-Access?</p>
          <Reveal label="Indicii"><p>(1) Underlay: OSPF + 10.0.x.x + loopback-uri; overlay: Tunnel0 + LAN-urile. (2) Underlay simplu, stabil, fără configurări pe nodurile intermediare; servicii noi doar la margini. (3) Control plane: LISP; data plane: VXLAN; politică: SGT.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't63s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 6.3-S" title="Lab solo — tunelul nu se ridică și LAN-urile nu comunică" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a configurat un overlay GRE între R1 și R4 peste un underlay OSPF. Tunelul nu pornește, iar PC-A nu ajunge la PC-B. Primești configurația (în tabele); găsește cel puțin <b>cinci defecte</b> și corectează-le. <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Packet Tracer sau GNS3/CML · <b>Nivel:</b> intermediar–avansat</p>
      </Summary>
      <Figure caption="Topologie solo: aceeași ca la labul ghidat, dar cu configurații defecte.">
        <LabSoloTopology63 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: R1 și R4 sunt vecini FULL cu underlay-ul, Tunnel0 este up/up pe ambele, ping PC-A ↔ PC-B reușește, iar R2/R3 nu au rute 192.168.x.x. Limite PT și avertisment ca la labul ghidat; pașii nu au fost testați de autorul lecției.
      </Callout>
      <Detailed title="Partea 1 — Configurația primită">
        <Step labKey={L} n={1} title="Citește configurația">
          <Table head={['Echipament', 'Configurație relevantă (ca primită)']} rows={[
            ['R1', 'OSPF: network 10.0.12.0 0.0.0.3 area 0 (fără loopback) · Loopback0 1.1.1.1/32 · Tunnel0 10.255.0.1/30, source Loopback0, destination 4.4.4.4 · ip route 192.168.2.0 255.255.255.0 10.255.0.2 · ip route 4.4.4.4 255.255.255.255 Tunnel0'],
            ['R4', 'OSPF: network 10.0.34.0 0.0.0.3 area 0 + network 4.4.4.4 0.0.0.0 area 0 · Tunnel0 10.255.1.2/30, source GigabitEthernet0/0, destination 1.1.1.1 · (nu există rută către 192.168.1.0/24)'],
            ['R2, R3', 'OSPF corect; R2 anunță și 192.168.1.0/24 prin redistribuire statică (din greșeală)'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Loopback-ul lui R1 nu este anunțat în OSPF</b>: R4 nu are rută spre 1.1.1.1, deci destinația tunelului de pe R4 nu este accesibilă prin underlay și pachetele GRE de întoarcere nu pot fi livrate.</li>
              <li><b>Subrețele de tunel diferite</b>: 10.255.0.1/30 pe R1 și 10.255.1.2/30 pe R4 — next hop-ul 10.255.0.2 nu există în overlay.</li>
              <li><b>Sursa tunelului pe R4 este GigabitEthernet0/0</b>, nu Loopback0: pachetele vin de la 10.0.34.2, iar R1 așteaptă 4.4.4.4 (nepotrivire sursă/destinație).</li>
              <li><b>Rută statică recursivă</b> pe R1: <code>ip route 4.4.4.4 255.255.255.255 Tunnel0</code> face ca destinația tunelului să fie accesibilă „prin tunel” — instabil (tunelul pâlpâie).</li>
              <li><b>Lipsa rutei de întoarcere</b> pe R4 către 192.168.1.0/24 prin 10.255.0.1.</li>
              <li><b>R2 anunță 192.168.1.0/24</b> în underlay: underlay-ul nu trebuie să cunoască rețele din overlay (poate duce traficul pe calea greșită, în afara tunelului).</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <ol>
              <li>R1: <code>network 1.1.1.1 0.0.0.0 area 0</code>.</li>
              <li>R4: Tunnel0 → <code>10.255.0.2 255.255.255.252</code>; <code>tunnel source loopback 0</code>.</li>
              <li>R1: <code>no ip route 4.4.4.4 255.255.255.255 Tunnel0</code> (destinația se învață din OSPF).</li>
              <li>R4: <code>ip route 192.168.1.0 255.255.255.0 10.255.0.1</code>.</li>
              <li>R2: scoate anunțarea lui 192.168.1.0/24 din underlay.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Verifică <code>show ip ospf neighbor</code> (R1, R4), <code>show ip route 4.4.4.4</code> (R1: prin OSPF), <code>show interfaces tunnel 0</code> (up/up pe ambele), <code>ping</code> PC-A ↔ PC-B și <code>show ip route</code> pe R2/R3 (fără 192.168.x.x).</p>
          <Reveal label="Răspuns"><p>Underlay: vecini FULL și rute spre loopback-uri. Overlay: Tunnel0 up/up, ping reușește. R2/R3 nu cunosc LAN-urile — separarea underlay/overlay este restabilită.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
