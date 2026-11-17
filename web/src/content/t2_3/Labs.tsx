import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology23, LabSoloTopology23 } from '../../diagrams/t2_3';

/* ======================================================================
   LAB GHIDAT — CDP: explorare, control, depanare
   ====================================================================== */
export function GuidedLab() {
  const L = 't23g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.3-G" title="Lab ghidat — descoperă topologia cu CDP (și LLDP unde se poate)" />
      <Summary>
        <p><b>Obiectiv:</b> pornind de la un singur echipament, descoperi restul topologiei cu <G id="cdp" />, citești corect <i>Local Intrfce</i> și <i>Port ID</i>, extragi adresele IP și versiunile din <code>detail</code>, apoi oprești CDP pe un port și vezi dispariția vecinului; încerci LLDP (<G id="lldp" />) unde simulatorul îl suportă.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (R1 2911, 2 × Switch 2960, un IP Phone sau PC); merge și în GNS3/CML (acolo și LLDP) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia: R1 — SW1 — SW2, cu un telefon IP și un PC pe SW2.">
        <LabGuidedTopology23 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă / mască', 'Conectat la']} rows={[
        ['R1', 'Gi0/0', '192.168.1.1 /24', 'SW1 Fa0/24'],
        ['SW1', 'VLAN 1 (SVI)', '192.168.1.11 /24', 'Gi0/1 ⟷ SW2 Gi0/1'],
        ['SW2', 'VLAN 1 (SVI)', '192.168.1.12 /24', 'Fa0/5 ⟷ telefon; Fa0/2 ⟷ PC1'],
        ['PC1', 'FastEthernet0', '192.168.1.100 /24', 'SW2 Fa0/2'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        CDP este suportat în Packet Tracer, dar formatul exact al output-ului diferă de IOS real; <b>LLDP poate lipsi</b> sau să nu funcționeze ca pe echipamente reale (în acest caz, pașii LLDP se fac în GNS3/CML sau se omit). Comenzile nu au fost testate de autorul lecției în versiunea ta. Pașii de adresare IP pe SVI-uri sunt doar pentru a avea IP-uri de citit în <code>show cdp neighbors detail</code>.
      </Callout>

      <Detailed title="Partea 1 — pregătire">
        <Step labKey={L} n={1} title="Construiește topologia">
          <p>R1 Gi0/0 → SW1 Fa0/24; SW1 Gi0/1 → SW2 Gi0/1; telefon IP (sau un al doilea PC) pe SW2 Fa0/5; PC1 pe SW2 Fa0/2. Cabluri copper straight-through; așteaptă linkurile verzi.</p>
        </Step>
        <Step labKey={L} n={2} title="Adrese IP pentru management">
          <CodeBlock title="R1, SW1, SW2" kind="config" code={`R1(config)# interface gi0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown

SW1(config)# hostname SW1
SW1(config)# interface vlan 1
SW1(config-if)# ip address 192.168.1.11 255.255.255.0
SW1(config-if)# no shutdown

SW2(config)# hostname SW2
SW2(config)# interface vlan 1
SW2(config-if)# ip address 192.168.1.12 255.255.255.0
SW2(config-if)# no shutdown`} explain={[
            ['ip address … no shutdown', 'IP-urile apar în CDP detail ca „Management address”. Pe switch-uri se pune pe SVI-ul VLAN 1 (VLAN-ul implicit al porturilor).'],
          ]} />
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — CDP">
        <Step labKey={L} n={3} title="Starea globală">
          <p>Pe SW1 rulează <code>show cdp</code>. Notează intervalul de anunț și holdtime-ul.</p>
          <Reveal label="Ce ar trebui să vezi"><p>Sending CDP packets every 60 seconds · holdtime 180 seconds · CDPv2 advertisements enabled (CDP este activ implicit, nu ai configurat nimic).</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Vecinii lui SW1">
          <CodeBlock title="SW1" kind="session" code={`SW1# show cdp neighbors`} explain={[
            ['rezultat așteptat', 'R1 (Local Fas 0/24, Port ID Gig 0/0) și SW2 (Local Gig 0/1, Port ID Gig 0/1). PC1 și telefonul nu sunt vecini ai lui SW1.'],
          ]} />
          <Reveal label="Întrebări: Local Intrfce sau Port ID?"><p>Pe SW1, intrarea R1 are <b>Local Intrfce = Fas 0/24</b> (portul lui SW1) și <b>Port ID = Gig 0/0</b> (portul lui R1). Dacă ai inversat, recitește capătul cablului din imagine.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Ce NU vezi">
          <p>Rulează <code>show cdp neighbors</code> pe R1. Câți vecini are? Apare SW2?</p>
          <Reveal label="Răspuns"><p>R1 are un singur vecin direct: SW1. SW2 nu apare: anunțurile CDP nu depășesc un salt (nu sunt retransmise de SW1).</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Detaliile vecinului">
          <CodeBlock title="SW1" kind="session" code={`SW1# show cdp neighbors detail
SW1# show cdp entry SW2`} explain={[
            ['detail', 'Pentru fiecare vecin: IP, platformă, versiune software, native VLAN, duplex.'],
            ['entry SW2', 'Doar SW2. Notează IP-ul lui (192.168.1.12).'],
          ]} />
        </Step>
        <Step labKey={L} n={7} title="CDP walking">
          <p>De pe R1 ai aflat doar SW1. Folosește IP-ul din detail ca să ajungi mai departe: <code>telnet 192.168.1.11</code> sau SSH (dacă ai configurat) pe SW1, apoi <code>show cdp neighbors</code> pe SW1 și află SW2, apoi telefonul. Desenează topologia descoperită.</p>
          <Reveal label="De ce spunem „walking”"><p>Fiecare echipament îți arată doar vecinii lui; pentru topologia întreagă „mergi” de la un echipament la altul, ca printr-un labirint, citind de fiecare dată tabela vecinilor.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Controlul pe interfață">
          <CodeBlock title="SW2" kind="config" code={`SW2(config)# interface fa0/5
SW2(config-if)# no cdp enable
SW2(config-if)# end
SW2# show cdp interface`} explain={[
            ['no cdp enable', 'Oprește CDP pe portul telefonului.'],
            ['show cdp interface', 'Fa0/5 nu mai apare (sau apare cu CDP dezactivat).'],
          ]} />
          <p>După aproximativ holdtime (180 s) sau instant, dacă ștergi cu <code>clear cdp table</code>, telefonul dispare din <code>show cdp neighbors</code>. Repornește cu <code>cdp enable</code>.</p>
        </Step>
        <Step labKey={L} n={9} title="Timere și oprire globală">
          <CodeBlock title="SW2" kind="config" code={`SW2(config)# cdp timer 15
SW2(config)# cdp holdtime 45
SW2(config)# end
SW2# show cdp
SW2# configure terminal
SW2(config)# no cdp run
SW2(config)# end
SW2# show cdp`} explain={[
            ['cdp timer 15 / holdtime 45', 'Anunț la 15 s, hold 45 s.'],
            ['no cdp run', 'Oprește CDP global.'],
            ['show cdp', '% CDP is not enabled — apoi SW1 nu-l mai vede pe SW2 după expirarea holdtime-ului.'],
          ]} />
          <p>Repune <code>cdp run</code>, <code>cdp timer 60</code>, <code>cdp holdtime 180</code>.</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — LLDP (dacă simulatorul îl suportă)">
        <Step labKey={L} n={10} title="Pornește LLDP pe SW1 și SW2">
          <CodeBlock title="SW1 și SW2" kind="config" code={`SW1(config)# lldp run
SW1(config)# end
SW1# show lldp neighbors`} explain={[
            ['lldp run', 'Pornește LLDP (pe ambele switch-uri).'],
            ['show lldp neighbors', 'SW2 apare cu Local Intf Gi0/1. R1 NU apare dacă nu rulează LLDP (CDP și LLDP sunt tabele separate).'],
          ]} />
          <Reveal label="Dacă lldp run lipsește în Packet Tracer"><p>Notează că simulatorul nu îl suportă și treci la sarcina de gândire: ce vezi într-o rețea mixtă în care un switch rulează doar LLDP și celălalt doar CDP? (răspuns: nimic, niciun vecin).</p></Reveal>
        </Step>
        <Step labKey={L} n={11} title="Comparație">
          <p>Completează un tabel cu cinci diferențe între CDP și LLDP (standard, implicit, comenzi, timere, interoperabilitate) și verifică-l cu cele din lecție.</p>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't23s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.3-S" title="Lab solo — politică de descoperire pentru o rețea mixtă" />
      <Summary>
        <p><b>Obiectiv:</b> pornind doar de la cerințe, configurezi descoperirea de vecini cu o politică de securitate: CDP oprit spre exterior, LLDP între switch-uri, un monitor care primește informații. <b>Timp:</b> 40–60 min · <b>Unealtă:</b> Packet Tracer (2 × 2960, 1 router, 1 PC); LLDP doar dacă e suportat (altfel GNS3/CML).</p>
      </Summary>
      <Figure caption="SW-A și SW-B sunt switch-uri de infrastructură; R-X reprezintă un echipament extern în care nu avem încredere.">
        <LabSoloTopology23 />
      </Figure>
      <Callout kind="info" title="Avertisment">
        Comenzile nu au fost testate de autorul lecției în versiunea ta de simulator. Notează orice comandă care lipsește și continuă.
      </Callout>
      <Detailed title="Cerințe">
        <Table head={['#', 'Cerință']} rows={[
          ['1', 'SW-A și SW-B își văd reciproc vecinii prin CDP (comportamentul implicit) și, dacă simulatorul permite, și prin LLDP.'],
          ['2', 'Pe portul SW-B Gi0/2 spre R-X: CDP dezactivat și LLDP dezactivat (nici transmit, nici receive).'],
          ['3', 'Timere CDP: anunț 30 s, holdtime 90 s pe SW-A și SW-B.'],
          ['4', 'Pe SW-A, pe porturile spre utilizatori Fa0/2–Fa0/24: CDP și LLDP oprite.'],
          ['5', 'Arată (cu comenzi show) că R-X nu apare în tabela de vecini a lui SW-B, dar SW-A apare.'],
          ['6', 'Arată cum afli IP-ul de management al lui SW-A de pe SW-B fără să te conectezi la SW-A.'],
        ]} />
        <Step labKey={L} n={1} title="Construiește și adresează">
          <p>Conectează conform imaginii; pune IP-uri de management pe SVI-uri (192.168.50.11 SW-A, .12 SW-B) pentru a avea ceva de citit în detail.</p>
        </Step>
        <Step labKey={L} n={2} title="Configurează conform cerințelor">
          <p>Aplică cerințele 2–4; verifică cu <code>show cdp interface</code>, <code>show lldp interface</code>, <code>show cdp</code>.</p>
        </Step>
        <Step labKey={L} n={3} title="Verifică și explică">
          <p>Răspunde: (a) de ce R-X nu mai apare? (b) ce se întâmplă cu un vecin după ce îi oprești CDP: intrarea dispare imediat sau după holdtime? (c) de ce nu poți afla IP-ul unui echipament aflat la două salturi cu <code>show cdp neighbors detail</code>?</p>
          <Reveal label="Răspunsuri"><p>(a) CDP/LLDP sunt oprite pe portul spre R-X, deci nu se mai schimbă anunțuri; intrarea veche expiră după holdtime sau o ștergi cu <code>clear cdp table</code> / <code>clear lldp table</code>. (b) De obicei după holdtime, dacă nu ștergi tabela. (c) Anunțurile nu depășesc un salt; vezi doar vecinii direcți.</p></Reveal>
        </Step>
        <Reveal label="Soluție de referință (încearcă întâi singur)">
          <CodeBlock title="SW-B (SW-A după același tipar)" kind="config" code={`SW-B(config)# cdp timer 30
SW-B(config)# cdp holdtime 90
SW-B(config)# lldp run
SW-B(config)# interface gi0/2
SW-B(config-if)# no cdp enable
SW-B(config-if)# no lldp transmit
SW-B(config-if)# no lldp receive

SW-A(config)# cdp timer 30
SW-A(config)# cdp holdtime 90
SW-A(config)# lldp run
SW-A(config)# interface range fa0/2-24
SW-A(config-if-range)# no cdp enable
SW-A(config-if-range)# no lldp transmit
SW-A(config-if-range)# no lldp receive

SW-B# show cdp neighbors
SW-B# show cdp neighbors detail`} explain={[
            ['cdp timer / holdtime', 'Cerința 3.'],
            ['interface gi0/2 … no cdp enable / no lldp …', 'Cerința 2: portul spre R-X nu trimite și nu primește.'],
            ['interface range fa0/2-24 …', 'Cerința 4 pe SW-A.'],
            ['show cdp neighbors detail', 'Din SW-B vezi IP-ul de management al lui SW-A (cerința 6).'],
          ]} />
        </Reveal>
      </Detailed>
    </section>
  );
}
