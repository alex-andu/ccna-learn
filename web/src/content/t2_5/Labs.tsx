import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology25, LabSoloTopology25 } from '../../diagrams/t2_5';

/* ======================================================================
   LAB GHIDAT — Rapid PVST+
   ====================================================================== */
export function GuidedLab() {
  const L = 't25g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.5-G" title="Lab ghidat — root bridge, roluri, PortFast și BPDU Guard" />
      <Summary>
        <p><b>Obiectiv:</b> în triunghiul SW1–SW2–SW3 activezi <G id="rapid-pvst" />, identifici root bridge-ul și rolurile porturilor, muți root-ul cu <code>root primary</code>, observi redundanța la căderea unui link, configurezi <G id="portfast" /> + <G id="bpdu-guard" /> și provoci intenționat err-disabled.
          <br /><b>Timp estimat:</b> 60 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × Switch 2960, 1 PC, 1 switch/PC suplimentar pentru testul BPDU Guard); merge în GNS3/CML · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Triunghi de 3 switch-uri; PC1 pe SW3 Fa0/5.">
        <LabGuidedTopology25 />
      </Figure>
      <Table head={['Legătură', 'Capăt A', 'Capăt B']} rows={[
        ['SW1 ⟷ SW2', 'SW1 Gi0/1', 'SW2 Gi0/1'],
        ['SW1 ⟷ SW3', 'SW1 Gi0/2', 'SW3 Gi0/1'],
        ['SW2 ⟷ SW3', 'SW2 Gi0/2', 'SW3 Gi0/2'],
        ['PC1', 'SW3 Fa0/5 (access VLAN 10)', '192.168.10.10 /24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer suportă PVST+ și Rapid PVST+ pe switch-urile 2960, dar nu toate mesajele de log și opțiunile (Root Guard, Loop Guard, errdisable recovery) se comportă identic; formatul <code>show spanning-tree</code> este apropiat de IOS real. Porturile Gigabit pot fi lipsă pe 2960-24TT (are 2 × Gi): adaptează numele. Comenzile nu au fost testate de autorul lecției în versiunea ta.
      </Callout>

      <Detailed title="Partea 1 — pregătire și observare">
        <Step labKey={L} n={1} title="Cablaj, VLAN 10, trunk">
          <CodeBlock title="Pe toate switch-urile" kind="config" code={`SW1(config)# vlan 10
SW1(config)# interface range gi0/1 - 2
SW1(config-if-range)# switchport mode trunk
SW3(config)# interface fa0/5
SW3(config-if)# switchport mode access
SW3(config-if)# switchport access vlan 10`} explain={[
            ['switchport mode trunk', 'Pe linkurile dintre switch-uri (adaugă encapsulation dot1q dacă platforma o cere). Repetă pe SW2 și SW3 pe porturile lor Gi.'],
          ]} />
        </Step>
        <Step labKey={L} n={2} title="Modul STP">
          <CodeBlock title="Pe toate" kind="config" code={`SW1(config)# spanning-tree mode rapid-pvst
SW1(config)# end
SW1# show spanning-tree summary`} explain={[
            ['rapid-pvst', 'Pune toate switch-urile pe RSTP per VLAN.'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Cine este root?">
          <CodeBlock title="Pe fiecare switch" kind="session" code={`SWx# show spanning-tree vlan 10`} explain={[
            ['Root ID', 'Aceeași adresă (MAC) pe toate switch-urile: root-ul. Care are „This bridge is the root”?'],
          ]} />
          <Reveal label="Cum determini root-ul prezis?"><p>Toate au prioritatea 32778 ⇒ câștigă <b>MAC-ul cel mai mic</b>. Compară adresele MAC din Bridge ID (<code>show version</code> sau <code>show spanning-tree</code>) și verifică predicția.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Tabel de roluri">
          <p>Desenează topologia și completează pentru fiecare port: Role, Sts, Cost. Care port este Altn? De ce acolo?</p>
          <Reveal label="Răspuns"><p>Pe cele două linkuri spre root, porturile non-root sunt Root Port. Pe linkul dintre cele două switch-uri non-root, switch-ul cu BID mai mic are Designated, celălalt are <b>Alternate</b> (Discarding/BLK). Toate porturile root-ului: Designated.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — controlul root-ului și redundanța">
        <Step labKey={L} n={5} title="Mută root-ul">
          <CodeBlock title="SW1 (sau alt switch ales) și SW2" kind="config" code={`SW1(config)# spanning-tree vlan 10 root primary
SW2(config)# spanning-tree vlan 10 root secondary
SW1# show spanning-tree vlan 10`} explain={[
            ['root primary / secondary', 'SW1 devine root (24576 + 10 = 24586); SW2 pregătit ca rezervă (28672 + 10).'],
          ]} />
          <Reveal label="Verificare"><p>Pe SW3 Root ID Priority = 24586 și Address = MAC-ul lui SW1; portul spre SW1 este Root Port.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Căderea unui link">
          <p>Pornește ping continuu PC1 → un al doilea host (sau către SVI). Pe SW3 dă <code>shutdown</code> pe linkul care este Root Port și observă cum Altn devine Root și Forwarding. Cât durează?</p>
          <Reveal label="Răspuns"><p>Cu Rapid PVST+ tranziția este de ordinul 1–2 secunde (câteva pachete pierdute); în PVST+ clasic ar dura zeci de secunde. Revino cu <code>no shutdown</code>.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Costuri">
          <CodeBlock title="SW3" kind="config" code={`SW3(config)# interface gi0/2
SW3(config-if)# spanning-tree vlan 10 cost 2
SW3(config-if)# end
SW3# show spanning-tree vlan 10`} explain={[
            ['cost 2', 'Faci calea prin Gi0/2 (prin SW2) mai ieftină sau mai scumpă? Observă dacă root port-ul se schimbă: calea directă are cost 4; calea prin SW2 are 4 + 2.'],
          ]} />
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — PortFast și BPDU Guard">
        <Step labKey={L} n={8} title="PortFast + BPDU Guard pe portul PC">
          <CodeBlock title="SW3" kind="config" code={`SW3(config)# interface fa0/5
SW3(config-if)# spanning-tree portfast
SW3(config-if)# spanning-tree bpduguard enable
SW3(config-if)# end
SW3# show spanning-tree interface fa0/5 detail`} explain={[
            ['portfast + bpduguard', 'Edge port, cu protecție la BPDU. În show spanning-tree vlan 10 Fa0/5 apare cu Type „P2p Edge”.'],
          ]} />
        </Step>
        <Step labKey={L} n={9} title="Provoacă err-disabled">
          <p>Conectează un al patrulea switch (sau un PC în loc de SW) la Fa0/5. Observă log-ul și <code>show interfaces status err-disabled</code>. Apoi scoate switch-ul, fă <code>shutdown</code> / <code>no shutdown</code> pe Fa0/5.</p>
          <Reveal label="Ce urmărești"><p>Mesaj <code>BLOCK_BPDUGUARD</code>, portul în err-disabled; după recuperare revine în Forwarding, doar dacă BPDU-ul nu mai sosește.</p></Reveal>
        </Step>
        <Step labKey={L} n={10} title="Root Guard (opțional)">
          <CodeBlock title="SW1 spre SW3" kind="config" code={`SW1(config)# interface gi0/2
SW1(config-if)# spanning-tree guard root
! Pe SW3: spanning-tree vlan 10 priority 4096 (mai bun decât root-ul)
SW1# show spanning-tree inconsistentports`} explain={[
            ['guard root', 'SW3 încearcă să devină root, dar SW1 blochează portul ⇒ root-inconsistent.'],
          ]} />
          <Reveal label="După test"><p>Restaurează prioritatea lui SW3 la implicit (<code>no spanning-tree vlan 10 priority</code>): portul de pe SW1 iese singur din root-inconsistent.</p></Reveal>
        </Step>
      </Detailed>
      <Callout kind="tip" title="GNS3 / CML">
        Imaginile IOSvL2 suportă Rapid PVST+, PortFast, BPDU Guard, Root/Loop Guard și errdisable recovery; ideal pentru partea 3.
      </Callout>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't25s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.5-S" title="Lab solo — inel de 4 switch-uri: root dorit, load sharing și protecții" />
      <Summary>
        <p><b>Cerință:</b> inel SW-A–SW-B–SW-D–SW-C–SW-A, VLAN 10 și 20. Rapid PVST+. SW-A root pentru VLAN 10 și secondary pentru 20; SW-B root pentru VLAN 20 și secondary pentru 10. PortFast + BPDU Guard pe portul PC (SW-D Fa0/5). Root Guard pe SW-A/SW-B spre SW-C (considerat „exterior”).
          <br /><b>Timp estimat:</b> 45 min · <b>Unealtă:</b> Packet Tracer sau GNS3/CML · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Inel de 4 switch-uri.">
        <LabSoloTopology25 />
      </Figure>
      <Detailed title="Cerințe și soluție">
        <ol>
          <li>Trunk între toate switch-urile; VLAN 10 și 20 pe toate.</li>
          <li><code>spanning-tree mode rapid-pvst</code> pe toate.</li>
          <li>Root primary/secondary per VLAN, cum e descris mai sus.</li>
          <li>Verifică pentru fiecare VLAN root-ul și portul alternate (care link e blocat diferă între VLAN-uri!).</li>
          <li>Fă <code>shutdown</code> pe un link și verifică reconvergența.</li>
        </ol>
        <Step labKey={L} n={1} title="Rezolvă singur, apoi compară">
          <Reveal label="Soluție (ilustrativ)">
            <CodeBlock title="SW-A / SW-B / SW-D" kind="config" code={`! toate
spanning-tree mode rapid-pvst

! SW-A
spanning-tree vlan 10 root primary
spanning-tree vlan 20 root secondary
! SW-B
spanning-tree vlan 20 root primary
spanning-tree vlan 10 root secondary
! SW-A și SW-B, porturile spre SW-C
interface gi0/2
 spanning-tree guard root
! SW-D, port PC
interface fa0/5
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 spanning-tree bpduguard enable`} explain={[
              ['root primary / secondary', 'Două root-uri diferite pe VLAN-uri diferite ⇒ load sharing: linkurile blocate diferă pe VLAN 10 și 20.'],
              ['guard root', 'Pe porturile spre exterior, ca SW-C să nu devină root.'],
              ['portfast + bpduguard', 'Protecția portului spre host.'],
            ]} />
          </Reveal>
          <Reveal label="Întrebări de verificare"><p>(1) Ce port este Altn pe VLAN 10 și care pe VLAN 20? (2) Ce se întâmplă cu Root Guard dacă SW-C primește prioritate 0? (3) De ce BPDU Guard nu se pune pe porturile dintre switch-uri?</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
