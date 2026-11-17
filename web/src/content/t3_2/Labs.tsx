import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology32, LabSoloTopology32 } from '../../diagrams/t3_2';

/* ======================================================================
   LAB GHIDAT — prefix, AD, metrică
   ====================================================================== */
export function GuidedLab() {
  const L = 't32g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 3.2-G" title="Lab ghidat — urmărești cum alege routerul: prefix, AD, metrică" />
      <Summary>
        <p><b>Obiectiv:</b> cu trei routere în triunghi, creezi pe rând trei situații — rute cu prefixe diferite (<b>longest prefix match</b>), aceeași rețea din două surse (<b>AD</b>, inclusiv o rută <b>flotantă</b>) și două căi OSPF (<b>metrică</b> și <b>ECMP</b>) — și verifici de fiecare dată cu <code>show ip route &lt;adresă&gt;</code> și <code>tracert</code>/<code>traceroute</code> ce alege R1.
          <br /><b>Timp estimat:</b> 60–75 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × router 2911, 2 × PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: R1, R2, R3 în triunghi. PC1 pe R1, PC3 pe R3.">
        <LabGuidedTopology32 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Conectat la']} rows={[
        ['PC1', 'NIC', '192.168.1.10 /24 · gw 192.168.1.1', 'R1 Gi0/0'],
        ['R1', 'Gi0/0', '192.168.1.1 /24', 'PC1'],
        ['R1', 'Gi0/1', '10.0.12.1 /30', 'R2 Gi0/0'],
        ['R1', 'Gi0/2', '10.0.13.1 /30', 'R3 Gi0/2'],
        ['R2', 'Gi0/0', '10.0.12.2 /30', 'R1 Gi0/1'],
        ['R2', 'Gi0/1', '10.0.23.1 /30', 'R3 Gi0/0'],
        ['R3', 'Gi0/0', '10.0.23.2 /30', 'R2 Gi0/1'],
        ['R3', 'Gi0/2', '10.0.13.2 /30', 'R1 Gi0/2'],
        ['R3', 'Gi0/1', '192.168.3.1 /24', 'PC3'],
        ['PC3', 'NIC', '192.168.3.10 /24 · gw 192.168.3.1', 'R3 Gi0/1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        În Packet Tracer, <code>tracert</code> pe PC și <code>traceroute</code> pe router arată hop-urile; dacă lipsesc răspunsuri (asteriscuri) la primul pachet, mai încearcă (ARP). OSPF are nevoie de ~30–60 s ca să converge. Comenzile <b>nu au fost testate</b> de autorul lecției în versiunea ta; echivalentul GNS3/CML folosește aceleași comenzi pe imagini IOSv/CSR. Configurarea completă a rutelor statice (3.3) și OSPF (3.4) o înveți ulterior: aici copiezi comenzile ca să creezi situațiile analizate.
      </Callout>

      <Detailed title="Partea 0 — Adresare">
        <Step labKey={L} n={1} title="Interfețe și PC-uri">
          <p>Configurează adresele din tabel pe toate interfețele (<code>ip address …</code> + <code>no shutdown</code>) și pe PC-uri (IP, mască, gateway). Verifică cu <code>show ip interface brief</code> că toate interfețele sunt up/up.</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Longest prefix match">
        <Step labKey={L} n={2} title="Rute statice cu prefixe diferite">
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.12.2
R1(config)# ip route 192.168.3.0 255.255.255.0 10.0.12.2
R1(config)# ip route 192.168.3.10 255.255.255.255 10.0.13.2`} explain={[
            ['0.0.0.0/0 via 10.0.12.2', 'Ruta implicită, prin R2.'],
            ['192.168.3.0/24 via 10.0.12.2', 'LAN-ul lui R3, prin R2.'],
            ['192.168.3.10/32 via 10.0.13.2', 'Excepție: PC3 specific, direct prin R3.'],
          ]} />
          <CodeBlock title="R2" kind="config" code={`R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.12.1
R2(config)# ip route 192.168.3.0 255.255.255.0 10.0.23.2`} explain={[
            ['192.168.1.0/24 via 10.0.12.1', 'Întoarcere spre LAN R1.'],
            ['192.168.3.0/24 via 10.0.23.2', 'Înainte spre LAN R3.'],
          ]} />
          <CodeBlock title="R3" kind="config" code={`R3(config)# ip route 192.168.1.0 255.255.255.0 10.0.13.1`} explain={[
            ['192.168.1.0/24 via 10.0.13.1', 'Întoarcerea spre PC1 (pe link-ul direct).'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Prezice, apoi verifică">
          <p>Înainte să dai comenzile, scrie pe hârtie: pe ce rută și prin ce next hop va pleca de pe R1 un pachet către (a) 192.168.3.10, (b) 192.168.3.1, (c) 172.16.0.1? Apoi verifică cu <code>show ip route &lt;adresă&gt;</code> și cu <code>tracert 192.168.3.10</code> / <code>tracert 192.168.3.1</code> de pe PC1.</p>
          <Reveal label="Răspuns">
            <p>(a) 192.168.3.10 → <b>/32 via 10.0.13.2</b> (R3, direct): tracert arată R1 (192.168.1.1), apoi R3 (10.0.13.2), apoi PC3. (b) 192.168.3.1 → <b>/24 via 10.0.12.2</b>: tracert trece prin R1, R2 (10.0.12.2) și ajunge la R3 (192.168.3.1). (c) 172.16.0.1 → <b>0.0.0.0/0 via 10.0.12.2</b>: pachetul ajunge la R2, care nu are rută pentru 172.16.0.0 și răspunde cu „destination unreachable” (sau tracert se oprește cu asteriscuri). Cheia: pentru aceeași rețea 192.168.3.0 au fost folosite două căi diferite, după lungimea prefixului.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Ruta implicită bate o rută specifică? (nu)">
          <p>Șterge ruta /24 (<code>no ip route 192.168.3.0 255.255.255.0 10.0.12.2</code>) și testează din nou: 192.168.3.1 (R3 LAN) ce rută folosește acum? Restabilește ruta.</p>
          <Reveal label="Răspuns">
            <p>Fără /24, adresa 192.168.3.1 nu se mai potrivește cu nicio rută specifică; se aplică 0.0.0.0/0 (tot via 10.0.12.2, deci pachetul ajunge la fel). Diferența se vede în <code>show ip route 192.168.3.1</code>: acum afișează „Routing entry for 0.0.0.0/0”. PC3 (192.168.3.10) continuă să folosească /32 via R3.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Administrative distance">
        <Step labKey={L} n={5} title="Adaugă OSPF pe cele trei routere (se învață în 3.4)">
          <CodeBlock title="R1 / R2 / R3" kind="config" code={`R1(config)# router ospf 1
R1(config-router)# network 10.0.0.0 0.255.255.255 area 0
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0

R2(config)# router ospf 1
R2(config-router)# network 10.0.0.0 0.255.255.255 area 0

R3(config)# router ospf 1
R3(config-router)# network 10.0.0.0 0.255.255.255 area 0
R3(config-router)# network 192.168.3.0 0.0.0.255 area 0`} explain={[
            ['router ospf 1', 'Pornește OSPF; numărul procesului are semnificație locală.'],
            ['network … 0.255.255.255 area 0', 'Activează OSPF pe toate interfețele din 10.0.0.0/8 (wildcard mask) și le anunță.'],
            ['network 192.168.x.0 0.0.0.255', 'Anunță și LAN-urile lui R1 și R3.'],
          ]} />
          <p>Așteaptă ~1 minut. Pe R1 rulează <code>show ip route</code>. Pentru 192.168.3.0/24, ce intrări există? Rulează <code>show ip route 192.168.3.0</code>.</p>
          <Reveal label="Răspuns">
            <p>Același prefix 192.168.3.0/24 vine din două surse: <b>statica</b> (AD 1) și <b>OSPF</b> (AD 110). În tabelă este <b>ruta statică</b> (via 10.0.12.2): „Known via static, distance 1”. OSPF a învățat ruta, dar este în rezervă.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Scoate statica: preia OSPF">
          <p>Pe R1: <code>no ip route 192.168.3.0 255.255.255.0 10.0.12.2</code>, apoi <code>show ip route 192.168.3.0</code>. Cine a preluat, cu ce AD, metrică și next hop?</p>
          <Reveal label="Răspuns">
            <p>Ruta OSPF: „Known via ospf 1, distance 110, metric 2” via 10.0.13.2 (Gi0/2, direct către R3: cost 1 pentru Gi0/2 + 1 pentru LAN-ul lui R3).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Ruta flotantă">
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip route 192.168.3.0 255.255.255.0 10.0.12.2 130`} explain={[
            ['… 130', 'AD mai mare decât OSPF (110): rută de rezervă, ascunsă cât timp OSPF merge.'],
          ]} />
          <p>Verifică: <code>show ip route 192.168.3.0</code> (rămâne OSPF) și <code>show ip route static</code> (nu apare 192.168.3.0). Apoi simulează căderea OSPF: <code>no router ospf 1</code> pe R1 și repetă comenzile. Ce se întâmplă? La final reconfigurează OSPF pe R1 (comenzile din pasul 5) și verifică revenirea.</p>
          <Reveal label="Răspuns">
            <p>Cu OSPF activ, ruta flotantă nu se vede. După <code>no router ospf 1</code> apare <code>S 192.168.3.0/24 [130/0] via 10.0.12.2</code> și traficul continuă prin R2. După ce reconfigurezi OSPF, ruta OSPF (110) revine și ruta flotantă dispare din nou din tabelă.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Metrică și ECMP">
        <Step labKey={L} n={8} title="Curățenie">
          <CodeBlock title="R1" kind="config" code={`R1(config)# no ip route 192.168.3.0 255.255.255.0 10.0.12.2 130
R1(config)# no ip route 192.168.3.10 255.255.255.255 10.0.13.2`} explain={[
            ['no ip route … 130', 'Scoate ruta flotantă.'],
            ['no ip route 192.168.3.10 …', 'Scoate ruta de gazdă, ca să nu mai influențeze testele.'],
          ]} />
          <p>Verifică: <code>show ip route 192.168.3.0</code> → OSPF [110/2] via 10.0.13.2.</p>
        </Step>
        <Step labKey={L} n={9} title="Schimbă costul: calea se mută">
          <CodeBlock title="R1" kind="config" code={`R1(config)# interface gigabitethernet0/2
R1(config-if)# ip ospf cost 100`} explain={[
            ['ip ospf cost 100', 'Costul interfeței Gi0/2 devine 100: legătura directă către R3 e „scumpă”.'],
          ]} />
          <p>Ce metrică și ce next hop are acum ruta spre 192.168.3.0/24? De ce?</p>
          <Reveal label="Răspuns">
            <p>Ruta devine <code>[110/3] via 10.0.12.2</code> (prin R2): cost 1 (Gi0/1) + 1 (Gi0/1 R2) + 1 (LAN R3) = 3 &lt; 100 + 1 = 101. Aceeași topologie, dar costul ales de tine schimbă calea.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={10} title="Costuri egale: ECMP">
          <CodeBlock title="R1" kind="config" code={`R1(config-if)# ip ospf cost 2`} explain={[
            ['ip ospf cost 2', 'Prin R3: 2 + 1 = 3, egal cu calea prin R2 (3).'],
          ]} />
          <Reveal label="Ce vezi în show ip route?">
            <p>Două linii sub același prefix: <code>[110/3] via 10.0.13.2</code> și <code>[110/3] via 10.0.12.2</code>. Ambele rute sunt instalate (ECMP) și traficul se împarte între ele. Dacă pui <code>ip ospf cost 3</code>, rămâne doar calea prin R2 (metrici diferite: 4 vs 3).</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Soluție completă (rezumat)">
        <Reveal label="Arată soluția">
          <CodeBlock title="Configurări finale pe etape" kind="config" code={`! Partea 1 — statice
R1: ip route 0.0.0.0 0.0.0.0 10.0.12.2
    ip route 192.168.3.0 255.255.255.0 10.0.12.2
    ip route 192.168.3.10 255.255.255.255 10.0.13.2
R2: ip route 192.168.1.0 255.255.255.0 10.0.12.1
    ip route 192.168.3.0 255.255.255.0 10.0.23.2
R3: ip route 192.168.1.0 255.255.255.0 10.0.13.1
! Partea 2 — OSPF pe toate; flotantă pe R1
R1: ip route 192.168.3.0 255.255.255.0 10.0.12.2 130
! Partea 3 — costul pe R1 Gi0/2
R1(config-if): ip ospf cost 100   → via R2 [110/3]
R1(config-if): ip ospf cost 2     → ECMP [110/3] × 2`} explain={[
            ['Partea 1', 'Prefixe diferite pe același LAN: /32, /24, /0.'],
            ['Partea 2', 'AD 1 (static) bate AD 110 (OSPF); flotanta 130 e rezervă.'],
            ['Partea 3', 'Metrica OSPF decide între căi; egalitatea dă ECMP.'],
          ]} />
        </Reveal>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — puzzle de decizii
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 3.2-S" title="Lab solo — prezici ruta aleasă, apoi verifică pe router" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi pe R1 un set de rute statice cu prefixe și AD diferite, <b>prezici pe hârtie</b> ce rută va folosi pentru fiecare destinație și verifici cu <code>show ip route &lt;adresă&gt;</code>. Apoi modifici o rută și reiei predicția.
          <br /><b>Timp estimat:</b> 30–45 min · <b>Unealtă:</b> Cisco Packet Tracer (4 routere) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: R1 în centru, trei vecini care servesc drept next hop-uri.">
        <LabSoloTopology32 />
      </Figure>
      <Table head={['Legătură', 'R1', 'Vecin']} rows={[
        ['R1–N1', 'Gi0/0 10.0.1.1 /30', 'N1 Gi0/0 10.0.1.2 /30'],
        ['R1–N2', 'Gi0/1 10.0.2.1 /30', 'N2 Gi0/0 10.0.2.2 /30'],
        ['R1–N3', 'Gi0/2 10.0.3.1 /30', 'N3 Gi0/0 10.0.3.2 /30'],
      ]} />
      <Callout kind="info" title="Cerințe">
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          <li>Setează adresele din tabel și pornește interfețele (vecinii nu au nevoie de alte configurări; interfețele lor trebuie doar să fie up).</li>
          <li>Pe R1 configurează rutele:
            <pre className="small" style={{ margin: '6px 0' }}>{`ip route 0.0.0.0 0.0.0.0 10.0.1.2
ip route 172.16.0.0 255.255.0.0 10.0.2.2
ip route 172.16.10.0 255.255.255.0 10.0.3.2
ip route 172.16.10.0 255.255.255.0 10.0.2.2 150
ip route 172.16.10.128 255.255.255.128 10.0.1.2
ip route 172.16.10.200 255.255.255.255 10.0.2.2`}</pre></li>
          <li><b>Înainte de verificare</b>, completează pe hârtie, pentru fiecare destinație, ruta aleasă și next hop-ul: 172.16.10.200 · 172.16.10.150 · 172.16.10.20 · 172.16.99.9 · 8.8.8.8.</li>
          <li>Verifică fiecare cu <code>show ip route &lt;adresă&gt;</code>.</li>
          <li>Pe R1 dă <code>no ip route 172.16.10.0 255.255.255.0 10.0.3.2</code>: ce se schimbă pentru 172.16.10.20 și de ce? (AD, metrică)</li>
        </ol>
      </Callout>
      <Detailed title="Soluție">
        <Reveal label="Arată soluția">
          <Table head={['Destinație', 'Rute candidate', 'Aleasă', 'Next hop']} rows={[
            ['172.16.10.200', '/0, /16, /24, /25, /32', '/32', '10.0.2.2 (N2)'],
            ['172.16.10.150', '/0, /16, /24, /25', '/25 (172.16.10.128/25)', '10.0.1.2 (N1)'],
            ['172.16.10.20', '/0, /16, /24 (2 variante)', '/24 cu AD 1', '10.0.3.2 (N3)'],
            ['172.16.99.9', '/0, /16', '/16', '10.0.2.2 (N2)'],
            ['8.8.8.8', '/0', '0.0.0.0/0', '10.0.1.2 (N1)'],
          ]} />
          <p>Observații: pentru 172.16.10.0/24 există două rute statice cu next hop-uri diferite; cea cu AD 1 (via N3) intră în tabelă, cealaltă (AD 150, via N2) rămâne neinstalată — o rută flotantă. Pentru .150 câștigă /25 (172.16.10.128–.255) chiar dacă AD-ul lui e același (1) cu al /24; contează doar lungimea. După <code>no ip route … 10.0.3.2</code>, pentru 172.16.10.20 ruta devine <code>S 172.16.10.0/24 [150/0] via 10.0.2.2</code>: ruta flotantă preia (AD 150 ≠ 1, dar e singura rămasă).</p>
        </Reveal>
      </Detailed>
    </section>
  );
}
