import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology47, LabSoloTopology47 } from '../../diagrams/t4_7';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't47g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.7-G" title="Lab ghidat — clasificare, marcare și coadă prioritară pentru voce" />
      <Summary>
        <p><b>Obiectiv:</b> marchezi traficul de voce cu DSCP EF la intrare, îl prioritizezi (LLQ) la ieșirea spre WAN, apoi vezi diferența dintre policing și shaping în contoare. <br /><b>Timp estimat:</b> 50–70 min · <b>Unealtă:</b> Cisco Packet Tracer (sau GNS3/CML cu IOSv — recomandat pentru QoS) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC1 și telefon IP – SW1 – R1 (politici QoS) – WAN lentă – R2.">
        <LabGuidedTopology47 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/1 (spre LAN)', '192.168.10.1/24'],
        ['R1', 'Gi0/0 (spre WAN)', '10.0.0.1/30'],
        ['R2', 'Gi0/0', '10.0.0.2/30'],
        ['PC1', 'NIC', '192.168.10.10/24'],
        ['Telefon IP / al doilea PC (voce simulată)', 'NIC', '192.168.10.20/24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă doar o parte din MQC (class-map, policy-map, service-policy de bază); <code>priority</code>, <code>police</code>, <code>shape</code> și <code>show policy-map interface</code> pot lipsi sau avea alt format, iar congestia reală e greu de simulat. Pentru contoare reale folosește GNS3/CML cu IOSv și generator de trafic (iperf). Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta.
      </Callout>

      <Detailed title="Partea 0 — Conectivitate">
        <Step labKey={L} n={1} title="Adresare și rută">
          <p>Configurează interfețele din tabel, rute statice între 192.168.10.0/24 și 10.0.0.0/30 (sau o rută implicită pe R2), apoi verifică un ping PC1 → R2.</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Clasificare și marcare">
        <Step labKey={L} n={2} title="Politica de intrare">
          <CodeBlock title="R1" kind="config" code={`R1(config)# access-list 101 permit udp any any range 16384 32767
R1(config)# class-map match-all VOICE-IN
R1(config-cmap)# match access-group 101
R1(config)# policy-map MARK-IN
R1(config-pmap)# class VOICE-IN
R1(config-pmap-c)# set dscp ef
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# service-policy input MARK-IN`} explain={[
            ['match access-group 101', 'Clasifică traficul UDP din intervalul de voce.'],
            ['set dscp ef', 'Marchează cu 46.'],
          ]} />
          <p>Ce valoare DSCP are un pachet marcat EF? Care sunt biții și octetul ToS? Cum verifici că marcarea s-a aplicat?</p>
          <Reveal label="Răspuns">
            <p>EF = 46 = <code>101110</code>; octetul ToS = 46 × 4 = 184 (0xB8). Verifici cu <code>show policy-map interface g0/1 input</code> (contoare pe clasă) sau, în Packet Tracer, în Simulation Mode, deschizând pachetul și citind câmpul ToS/DSCP din antetul IP.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Cozi la ieșire">
        <Step labKey={L} n={3} title="LLQ + CBWFQ">
          <CodeBlock title="R1" kind="config" code={`R1(config)# class-map match-all VOICE
R1(config-cmap)# match dscp ef
R1(config)# policy-map WAN-OUT
R1(config-pmap)# class VOICE
R1(config-pmap-c)# priority percent 20
R1(config-pmap-c)# class class-default
R1(config-pmap-c)# fair-queue
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# service-policy output WAN-OUT`} explain={[
            ['priority percent 20', 'Coadă prioritară strictă pentru voce, 20% din bandă.'],
            ['fair-queue', 'Restul traficului împarte echitabil banda rămasă.'],
            ['service-policy output WAN-OUT', 'Efectul se vede doar la ieșire, în congestie.'],
          ]} />
          <p>De ce se aplică <code>output</code> și nu <code>input</code>? Când are efect politica?</p>
          <Reveal label="Răspuns">
            <p>Cozile se formează la <b>ieșirea</b> interfeței, când pachetele sosesc mai repede decât pot pleca. Politica nu schimbă nimic dacă legătura nu este congestionată.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Observă contoarele">
          <p>Generează trafic (ping mare, <code>ping -l 1400</code> pe PC, transfer) și apoi <code>show policy-map interface g0/0 output</code>. Ce clase au pachete? Apare „exceed drops”?</p>
          <Reveal label="Răspuns">
            <p>Clasa VOICE numără doar pachetele marcate EF; class-default numără restul. „b/w exceed drops” crește dacă vocea depășește banda prioritară (20%): coada prioritară este limitată.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Policing vs shaping">
        <Step labKey={L} n={5} title="Policing">
          <CodeBlock title="R1" kind="config" code={`R1(config)# class-map match-all BULK
R1(config-cmap)# match access-group 102
R1(config)# policy-map LIMIT-BULK
R1(config-pmap)# class BULK
R1(config-pmap-c)# police 500000 conform-action transmit exceed-action drop`} explain={[
            ['police 500000 …', 'Limitează clasa BULK la ≈500 kb/s; excesul se aruncă.'],
          ]} />
          <p>Ce se întâmplă cu un transfer TCP care depășește rata? Cu un flux UDP?</p>
          <Reveal label="Răspuns">
            <p>TCP detectează pierderile și își reduce viteza; UDP nu reacționează și pierde pachete. Nu se adaugă întârziere de buffer.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Shaping">
          <p>Înlocuiește cu <code>shape average 500000</code> în politica de ieșire. Compară ping-urile și contoarele: ce s-a schimbat?</p>
          <Reveal label="Răspuns">
            <p>Excesul este bufferizat (întârziere mai mare, RTT crește), iar pierderile scad. Policing = pierderi; shaping = întârziere.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce se face marcarea aproape de sursă? (2) Ce rol are trust boundary? (3) De ce coada prioritară este limitată?</p>
          <Reveal label="Indicii">
            <p>(1) Restul hop-urilor aplică doar PHB pe baza marcajului. (2) Marcajele de la dispozitive nesigure pot fi falsificate. (3) Altfel ar „înfometa” celelalte clase.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't47s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.7-S" title="Lab solo — politica QoS „nu face nimic”" />
      <Summary>
        <p><b>Scenariu:</b> R1 are o politică care prioritizează vocea (DSCP EF), dar apelurile sună prost când legătura WAN este saturată. <code>show policy-map interface</code> nu arată pachete în clasa VOICE. Găsește defectul.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer sau GNS3/CML · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: aceeași ca la labul ghidat.">
        <LabSoloTopology47 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        Vocea marcată EF la intrare, prioritizată (LLQ 20%) la ieșirea spre WAN. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Configurare corectă">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# policy-map MARK-IN
R1(config-pmap)# class VOICE-IN
R1(config-pmap-c)# set dscp ef
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# service-policy input MARK-IN
R1(config)# policy-map WAN-OUT
R1(config-pmap)# class VOICE
R1(config-pmap-c)# priority percent 20
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# service-policy output WAN-OUT`} explain={[
              ['service-policy input MARK-IN', 'Marchează la intrare.'],
              ['service-policy output WAN-OUT', 'Prioritizează la ieșire.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Defectul">
          <p>Politica <code>WAN-OUT</code> este aplicată cu <code>service-policy input</code> pe Gi0/0 (în loc de <code>output</code>). Cum găsești problema cu <code>show policy-map interface g0/0</code>? Care e remedierea?</p>
          <Reveal label="Cauza și remedierea">
            <p>Ieșirea comenzii arată „Service-policy input: WAN-OUT”, nu „output”. Cozile funcționează doar la ieșire; la intrare, politica LLQ nu poate prioritiza nimic. Remediere: <code>no service-policy input WAN-OUT</code>, apoi <code>service-policy output WAN-OUT</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Un al doilea defect">
          <p>După remediere, clasa VOICE are tot 0 pachete. <code>class-map VOICE</code> folosește <code>match dscp af31</code>. Ce observi? Ce modifici?</p>
          <Reveal label="Cauza și remedierea">
            <p>Vocea este marcată EF (46), nu AF31 (26): clasa nu se potrivește. Remediere: <code>match dscp ef</code>. Lecție: clasificarea trebuie să urmeze marcarea făcută la intrare.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Generează trafic și verifică din nou. Ce contoare ar trebui să crească? Ce faci dacă „b/w exceed drops” crește mult?</p>
          <Reveal label="Răspuns">
            <p>Contorul clasei VOICE (pachete EF) crește. Dacă „exceed drops” crește, vocea depășește banda prioritară: o mărești sau limitezi numărul de apeluri.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
