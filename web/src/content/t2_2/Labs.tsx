import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology22, LabSoloTopology22 } from '../../diagrams/t2_2';

/* ======================================================================
   LAB GHIDAT — trunk, allowed list, native VLAN, DTP
   ====================================================================== */
export function GuidedLab() {
  const L = 't22g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.2-G" title="Lab ghidat — trunk 802.1Q, allowed list, native VLAN și DTP (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi un trunk între două switch-uri, vezi ce spune <code>show interfaces trunk</code>, provoci pe rând trei defecte reale (VLAN scos din allowed list, native VLAN nepotrivit, DTP auto + auto) și le repari. Observi tag-ul 802.1Q în Simulation mode.
          <br /><b>Timp estimat:</b> 60–75 min · <b>Unealtă:</b> Cisco Packet Tracer (2 × Switch 2960, 4 PC-uri); merge și în GNS3/CML cu imagini de switch L2 · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: două switch-uri legate printr-un trunk, cu VLAN 10 și 20 pe ambele; VLAN 99 este native VLAN-ul trunk-ului.">
        <LabGuidedTopology22 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă / mască', 'Conectat la / VLAN']} rows={[
        ['PC1', 'FastEthernet0', '10.10.10.11 /24', 'SW1 Fa0/1 · VLAN 10'],
        ['PC2', 'FastEthernet0', '10.10.20.11 /24', 'SW1 Fa0/2 · VLAN 20'],
        ['PC3', 'FastEthernet0', '10.10.10.12 /24', 'SW2 Fa0/1 · VLAN 10'],
        ['PC4', 'FastEthernet0', '10.10.20.12 /24', 'SW2 Fa0/2 · VLAN 20'],
        ['SW1 ⟷ SW2', 'Gi0/1 ⟷ Gi0/1', '—', 'trunk 802.1Q'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer">
        Simulatorul poate afișa diferit față de IOS real: comportamentul implicit DTP, mesajele de log și formatul <code>show interfaces trunk</code> diferă ușor între versiuni. Pe Switch 2960 din PT nu există <code>switchport trunk encapsulation</code> (doar 802.1Q). Comenzile nu au fost testate de autorul lecției în versiunea ta. Hosturile nu au gateway (nu avem routing; testăm doar conectivitatea în interiorul VLAN-urilor).
      </Callout>

      <Detailed title="Partea 1 — VLAN-uri și trunk">
        <Step labKey={L} n={1} title="Construiește topologia și adresele">
          <p>Două switch-uri 2960, patru PC-uri, cabluri straight-through PC → switch; Gi0/1 ↔ Gi0/1 între switch-uri (cross-over nu e necesar: porturile suportă Auto-MDIX). Adresele din tabel, mască 255.255.255.0.</p>
        </Step>
        <Step labKey={L} n={2} title="Creează VLAN-urile și atribuie porturile (pe ambele switch-uri)">
          <CodeBlock title="SW1 (la fel pe SW2, cu hostname SW2)" kind="config" code={`Switch(config)# hostname SW1
SW1(config)# vlan 10
SW1(config-vlan)# vlan 20
SW1(config-vlan)# vlan 99
SW1(config-vlan)# name NATIVE
SW1(config-vlan)# exit
SW1(config)# interface fa0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# interface fa0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 20`} explain={[
            ['vlan 10 / 20 / 99', 'VLAN-urile trebuie să existe pe ambele switch-uri.'],
            ['Fa0/1 → 10, Fa0/2 → 20', 'La fel pe SW2: PC3 în 10, PC4 în 20.'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Înainte de trunk: testează">
          <p>Din PC1 dă ping către PC3 (10.10.10.12). Pe ce se bazează rezultatul? Rulează <code>show interfaces gi0/1 switchport</code> pe SW1.</p>
          <Reveal label="Ce vei vedea"><p>Dacă ambele porturi sunt în <i>dynamic auto</i> (implicit), rezultatul DTP este <b>access</b>: portul Gi0/1 rămâne în VLAN 1, deci pingul eșuează (PC1 e în VLAN 10, iar legătura transportă doar VLAN 1). Este „capcana auto + auto”. (Dacă în versiunea ta modul implicit e altul, notează ce vezi.)</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Configurează trunk-ul pe ambele capete">
          <CodeBlock title="SW1 și SW2" kind="config" code={`SW1(config)# interface gi0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport nonegotiate
SW1(config-if)# end
SW1# show interfaces trunk`} explain={[
            ['switchport mode trunk', 'Trunk forțat, indiferent de vecin.'],
            ['switchport trunk native vlan 99', 'Native VLAN neutilizat de hosturi; același pe ambele capete.'],
            ['switchport nonegotiate', 'Oprește DTP pe port.'],
            ['show interfaces trunk', 'Verifică: Mode on, 802.1q, trunking, Native vlan 99; listele 1–4094 / 10,20,99 etc.'],
          ]} />
          <p>Testează din nou: ping PC1 → PC3 și PC2 → PC4 trebuie să reușească; PC1 → PC2 (VLAN-uri diferite) nu (nu avem routing).</p>
        </Step>
        <Step labKey={L} n={5} title="Vezi tag-ul în Simulation mode">
          <p>Pornește Simulation mode (filtru ICMP/ARP) și trimite un ping PC1 → PC3. Dă click pe plicul care circulă pe Gi0/1 și deschide <i>PDU Information → Inbound/Outbound</i> / <i>Layer 2</i>: pe segmentul trunk cadrul are tag 802.1Q cu VLAN 10; pe segmentele access nu.</p>
          <Reveal label="Întrebare: ce tag are un cadru din VLAN 99 pe trunk?"><p>Niciun tag: este native VLAN, deci circulă netaggat. Cadrele celorlalte VLAN-uri au tag.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Citește cele trei liste">
          <p>Rulează <code>show interfaces trunk</code> și explică în cuvintele tale diferența între „allowed on trunk”, „allowed and active” și „forwarding and not pruned”.</p>
          <Reveal label="Răspuns"><p>Prima listă = ce permite configurația; a doua = dintre cele permise, cele care există pe switch; a treia = cele care trec acum (STP în forwarding). Dacă un VLAN apare doar în prima, nu a fost creat pe acest switch.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Defecte provocate">
        <Step labKey={L} n={7} title="Defect 1: allowed list înlocuită">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# interface gi0/1
SW1(config-if)# switchport trunk allowed vlan 10
SW1(config-if)# end
SW1# show interfaces trunk`} explain={[
            ['allowed vlan 10', 'Înlocuiește lista: pe acest trunk trece doar VLAN 10.'],
          ]} />
          <p>Ping PC2 → PC4 (VLAN 20) eșuează, PC1 → PC3 merge. Repară: <code>switchport trunk allowed vlan add 20,99</code> (sau relistează 10,20,99).</p>
          <Reveal label="De ce VLAN 20 nu mai trece"><p>Cadrele VLAN 20 sunt filtrate de lista allowed pe portul de ieșire; nu apare nicio eroare. Cauza se vede doar în <code>show interfaces trunk</code>.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Defect 2: native VLAN nepotrivit">
          <CodeBlock title="SW2" kind="config" code={`SW2(config)# interface gi0/1
SW2(config-if)# switchport trunk native vlan 1`} explain={[
            ['native vlan 1 pe SW2, 99 pe SW1', 'Capetele nu mai sunt de acord. După scurt timp, CDP poate afișa un mesaj de tip NATIVE_VLAN_MISMATCH (dacă simulatorul îl implementează).'],
          ]} />
          <p>Compară <code>show interfaces trunk</code> pe SW1 și SW2 (coloana „Native vlan”). Repară cu <code>switchport trunk native vlan 99</code> pe SW2.</p>
          <Reveal label="Ce risc există"><p>Traficul netaggat din VLAN 99 (SW1) ar ajunge în VLAN 1 pe SW2: VLAN-uri amestecate. Hosturile din VLAN 10/20 pot funcționa în continuare (tagged), dar controlul și traficul native se strică și apare un risc de securitate.</p></Reveal>
        </Step>
        <Step labKey={L} n={9} title="Defect 3: DTP auto + auto">
          <CodeBlock title="SW1 și SW2" kind="config" code={`SW1(config)# interface gi0/1
SW1(config-if)# no switchport nonegotiate
SW1(config-if)# switchport mode dynamic auto
SW1(config-if)# end
SW1# show interfaces gi0/1 switchport | include Mode`} explain={[
            ['no switchport nonegotiate', 'Repornește DTP pe port.'],
            ['switchport mode dynamic auto', 'Mod pasiv; fă la fel pe SW2.'],
            ['show … | include Mode', 'Administrative Mode: dynamic auto · Operational Mode: static access ⇒ nu s-a format trunk.'],
          ]} />
          <p>Apoi pune SW2 în <code>dynamic desirable</code>: portul devine trunk (<i>Operational Mode: trunk</i>). Restaurează configurația finală cu <code>mode trunk</code> pe ambele capete.</p>
        </Step>
        <Step labKey={L} n={10} title="Concluzii">
          <p>Scrie 4–5 rânduri: care dintre defecte dă un mesaj clar în log, care nu dă niciunul, și ce comandă folosești întâi pentru fiecare.</p>
          <Reveal label="Răspuns orientativ"><p>Native mismatch: mesaj CDP; allowed list: nicio eroare, dar <code>show interfaces trunk</code> arată VLAN-ul lipsă; auto + auto: nicio eroare, doar portul rămâne access (<code>show interfaces switchport</code>). Începi mereu cu <code>show interfaces trunk</code> pe ambele capete.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — trei switch-uri, trunk-uri cu allowed list, native 999
   ====================================================================== */
export function SoloLab() {
  const L = 't22s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.2-S" title="Lab solo — trunk-uri pe un lanț de trei switch-uri" />
      <Summary>
        <p><b>Obiectiv:</b> construiești un lanț SW-A — SW-B — SW-C cu trunk-uri care permit doar VLAN-urile necesare, cu native VLAN 999 și DTP oprit. <b>Timp:</b> 45–60 min · <b>Unealtă:</b> Packet Tracer (3 × 2960, 5 PC-uri). Nu există bucle (lanț), deci nu intervine STP.</p>
      </Summary>
      <Figure caption="Lanț de trei switch-uri; hosturile sunt în VLAN 10, 20 sau 30.">
        <LabSoloTopology22 />
      </Figure>
      <Callout kind="info" title="Limite și avertisment">
        Comenzile nu au fost testate de autorul lecției în versiunea ta de Packet Tracer. Dacă o comandă lipsește (<code>switchport nonegotiate</code>, de exemplu), notează asta și continuă cu restul.
      </Callout>
      <Detailed title="Cerințe">
        <Table head={['Cerință', 'Detaliu']} rows={[
          ['VLAN-uri', '10 (DATE-A), 20 (DATE-B), 30 (DATE-C), 999 (NATIVE) pe toate switch-urile.'],
          ['Hosturi', 'H1 (SW-A Fa0/1) V10 · H2 (SW-A Fa0/2) V20 · H3 (SW-B Fa0/1) V30 · H4 (SW-C Fa0/1) V10 · H5 (SW-C Fa0/2) V30. Adrese 10.20.<vlan>.1x/24 (de exemplu H1 10.20.10.11).'],
          ['Trunk SW-A ⟷ SW-B', 'Gi0/1 ⟷ Gi0/1: permite 10, 20, 30, 999; native 999.'],
          ['Trunk SW-B ⟷ SW-C', 'Gi0/2 (SW-B) ⟷ Gi0/1 (SW-C): permite doar 10, 30, 999 (VLAN 20 nu există pe SW-C și nu trebuie să treacă); native 999.'],
          ['DTP', 'Oprit pe toate trunk-urile (nonegotiate); toate porturile hosturilor sunt access explicit.'],
        ]} />
        <Step labKey={L} n={1} title="Construiește și configurează">
          <p>Creează VLAN-urile, porturile access și trunk-urile conform cerințelor. Pe SW-B, trunk-ul spre SW-C permite doar VLAN-urile 10, 30, 999.</p>
        </Step>
        <Step labKey={L} n={2} title="Verifică">
          <p>Pe fiecare switch: <code>show interfaces trunk</code>, <code>show vlan brief</code>. Teste: H1 → H4 (VLAN 10, trece prin două trunk-uri), H3 → H5 (VLAN 30), H2 → H1 (VLAN-uri diferite: nu trebuie să reușească).</p>
        </Step>
        <Step labKey={L} n={3} title="Provoacă și explică">
          <p>(a) Pe SW-B scoate VLAN 30 din allowed list pe trunk-ul spre SW-C: ce host nu mai comunică? (b) Schimbă native VLAN doar pe SW-C: ce mesaj/diferență vezi? (c) În <code>show interfaces trunk</code> pe SW-C, de ce VLAN 20 lipsește din lista „allowed and active”?</p>
          <Reveal label="Răspunsuri"><p>(a) H3 ↔ H5 și toate celelalte perechi din VLAN 30 de pe părți diferite ale SW-B—SW-C. (b) Nepotrivire de native pe link-ul SW-B ⟷ SW-C: mesaj CDP și risc de scurgere între VLAN-uri. (c) Fiindcă VLAN 20 nu a fost creat pe SW-C și, în plus, nu e permis pe acel trunk.</p></Reveal>
        </Step>
        <Reveal label="Soluție de referință (încearcă întâi singur)">
          <CodeBlock title="SW-B (celelalte switch-uri după același tipar)" kind="config" code={`SW-B(config)# vlan 10
SW-B(config-vlan)# name DATE-A
SW-B(config-vlan)# vlan 20
SW-B(config-vlan)# name DATE-B
SW-B(config-vlan)# vlan 30
SW-B(config-vlan)# name DATE-C
SW-B(config-vlan)# vlan 999
SW-B(config-vlan)# name NATIVE
SW-B(config-vlan)# exit
SW-B(config)# interface fa0/1
SW-B(config-if)# switchport mode access
SW-B(config-if)# switchport access vlan 30
SW-B(config-if)# interface gi0/1
SW-B(config-if)# switchport mode trunk
SW-B(config-if)# switchport trunk native vlan 999
SW-B(config-if)# switchport trunk allowed vlan 10,20,30,999
SW-B(config-if)# switchport nonegotiate
SW-B(config-if)# interface gi0/2
SW-B(config-if)# switchport mode trunk
SW-B(config-if)# switchport trunk native vlan 999
SW-B(config-if)# switchport trunk allowed vlan 10,30,999
SW-B(config-if)# switchport nonegotiate`} explain={[
            ['Fa0/1 → VLAN 30', 'H3 este pe SW-B.'],
            ['Gi0/1 (spre SW-A)', 'Permite 10, 20, 30, 999.'],
            ['Gi0/2 (spre SW-C)', 'Permite doar 10, 30, 999 — VLAN 20 nu trebuie să ajungă la SW-C.'],
            ['native 999 + nonegotiate', 'Identic pe ambele capete ale fiecărui trunk.'],
          ]} />
        </Reveal>
      </Detailed>
      <p className="small">Termeni folosiți: <G id="trunk" />, <G id="native-vlan" />, <G id="dtp" />.</p>
    </section>
  );
}
