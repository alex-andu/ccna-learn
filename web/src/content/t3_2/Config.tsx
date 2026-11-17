import { Callout, Detailed, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="3.2" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 3.2 este de tip <b>Determine</b>: nu configurezi ceva nou, ci <b>prezici și verifici</b> ce rută alege routerul. Instrumentele sunt <code>show ip route &lt;adresă&gt;</code>, <code>traceroute</code> și <code>show ip cef</code>; configurările de mai jos (rute statice, AD, cost OSPF) servesc doar ca să creezi situațiile pe care le analizezi. Detaliile despre rutele statice sunt în 3.3 și despre OSPF în 3.4.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, cu adrese de laborator; nu au fost capturate de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Forma exactă a mesajelor variază între versiuni IOS/IOS XE și Packet Tracer; ping/traceroute din Packet Tracer arată diferit față de IOS.
      </Callout>

      <Detailed title="Exemplul 1 — Longest prefix match în tabelă">
        <p>Presupunem că toate next hop-urile 10.9.9.x sunt accesibile printr-o rețea conectată direct (de exemplu 10.9.9.0/24); altfel rutele statice nu s-ar instala (3.1.d).</p>
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# ip route 0.0.0.0 0.0.0.0 10.9.9.1
R1(config)# ip route 10.1.0.0 255.255.0.0 10.9.9.2
R1(config)# ip route 10.1.1.0 255.255.255.0 10.9.9.3
R1(config)# ip route 10.1.1.64 255.255.255.192 10.9.9.4
R1(config)# ip route 10.1.1.77 255.255.255.255 10.9.9.5`} explain={[
          ['ip route 0.0.0.0 0.0.0.0 10.9.9.1', 'Ruta implicită (/0).'],
          ['10.1.0.0 255.255.0.0', 'Prefix /16.'],
          ['10.1.1.0 255.255.255.0', 'Prefix /24.'],
          ['10.1.1.64 255.255.255.192', 'Prefix /26 (blocul 10.1.1.64–10.1.1.127).'],
          ['10.1.1.77 255.255.255.255', 'Rută de gazdă /32: exact o adresă.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip route static
Gateway of last resort is 10.9.9.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 10.9.9.1
      10.0.0.0/8 is variably subnetted, 4 subnets, 4 masks
S        10.1.0.0/16 [1/0] via 10.9.9.2
S        10.1.1.0/24 [1/0] via 10.9.9.3
S        10.1.1.64/26 [1/0] via 10.9.9.4
S        10.1.1.77/32 [1/0] via 10.9.9.5

R1# show ip route 10.1.1.70
Routing entry for 10.1.1.64/26
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.9.9.4
      Route metric is 0, traffic share count is 1

R1# show ip route 10.1.1.10
Routing entry for 10.1.1.0/24
  ...
R1# show ip route 10.1.1.77
Routing entry for 10.1.1.77/32
  ...`} explain={[
          ['show ip route static', 'Listează doar rutele statice; vezi rutele cu mască diferită sub același antet 10.0.0.0/8.'],
          ['show ip route 10.1.1.70', 'Pentru 10.1.1.70 routerul alege /26 (cea mai lungă potrivire). Răspunsul îți arată direct prefixul ales.'],
          ['10.1.1.10 → /24, 10.1.1.77 → /32', 'Același mecanism: câștigă cel mai lung prefix care conține adresa.'],
        ]} />
        <Callout kind="tip" title="Cum verifici fără să dai trafic">
          <code>show ip route &lt;adresă&gt;</code> face exact căutarea pe care ar face-o pentru un pachet cu acea destinație. E cea mai rapidă metodă să răspunzi la „pe unde ar pleca un pachet către X?” fără ping.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 2 — Același prefix din două surse: decide AD">
        <p>R1 învață 192.168.3.0/24 prin OSPF și are și o rută statică pentru același prefix.</p>
        <CodeBlock title="Situația (ilustrativ)" kind="session" code={`R1# show ip route 192.168.3.0
Routing entry for 192.168.3.0/24
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.0.12.2
      Route metric is 0, traffic share count is 1

R1(config)# no ip route 192.168.3.0 255.255.255.0 10.0.12.2

R1# show ip route 192.168.3.0
Routing entry for 192.168.3.0/24
  Known via "ospf 1", distance 110, metric 2, type intra area
  Last update from 10.0.13.2 on GigabitEthernet0/2, 00:00:20 ago
  Routing Descriptor Blocks:
  * 10.0.13.2, from 3.3.3.3, 00:00:20 ago, via GigabitEthernet0/2
      Route metric is 2, traffic share count is 1`} explain={[
          ['Known via "static", distance 1', 'Cât timp există ruta statică (AD 1), ea câștigă față de OSPF (AD 110).'],
          ['no ip route …', 'Ștergi ruta statică.'],
          ['Known via "ospf 1", distance 110, metric 2', 'OSPF ocupă acum intrarea; își folosea baza de date, unde ruta era deja.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Ruta statică flotantă">
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# ip route 192.168.3.0 255.255.255.0 10.0.12.2 130`} explain={[
          ['… 10.0.12.2 130', 'Ultimul număr este AD-ul rutei (130 > 110 OSPF).']
        ]} />
        <CodeBlock title="Cu OSPF activ, apoi fără el (ilustrativ)" kind="session" code={`R1# show ip route static
! (nicio linie S pentru 192.168.3.0 — ruta flotantă este ascunsă)

R1(config)# no router ospf 1

R1# show ip route static
S     192.168.3.0/24 [130/0] via 10.0.12.2`} explain={[
          ['show ip route static', 'Cât timp OSPF oferă prefixul (110 < 130), ruta flotantă nu apare.'],
          ['no router ospf 1', 'Simulează dispariția sursei preferate; poți folosi și o cădere reală de legătură.'],
          ['S 192.168.3.0/24 [130/0]', 'Ruta flotantă a devenit activă: AD 130, metrică 0.'],
        ]} />
        <Callout kind="tip" title="Un detaliu util">
          <code>show ip route</code> nu afișează rutele care „pierd” pentru un prefix; ca să afli dacă există o rută flotantă configurată, citește <code>show running-config | include ip route</code>.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 4 — Metrică, cost OSPF și ECMP">
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# interface gigabitethernet0/2
R1(config-if)# ip ospf cost 100
R1(config-if)# end
R1# show ip route 192.168.3.0
! cale nouă: via 10.0.12.2 [110/3]

R1(config)# interface gigabitethernet0/2
R1(config-if)# ip ospf cost 2
R1(config-if)# end
R1# show ip route ospf
O     192.168.3.0/24 [110/3] via 10.0.13.2, 00:00:05, GigabitEthernet0/2
                     [110/3] via 10.0.12.2, 00:00:05, GigabitEthernet0/1`} explain={[
          ['ip ospf cost 100', 'Face legătura directă către R3 foarte „scumpă”: R1 alege calea prin R2 (cost total 3).'],
          ['ip ospf cost 2', 'Costul total prin R3 devine 2 + 1 = 3, egal cu calea prin R2: ambele rute se instalează.'],
          ['două linii [110/3]', 'ECMP: aceeași metrică, două next hop-uri.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Verificarea traseului și a FIB-ului">
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# traceroute 192.168.3.10
Type escape sequence to abort.
Tracing the route to 192.168.3.10
  1 10.0.13.2 4 msec 4 msec 3 msec
  2 192.168.3.10 6 msec 5 msec 6 msec

R1# show ip cef 192.168.3.10
192.168.3.10/32
  nexthop 10.0.13.2 GigabitEthernet0/2`} explain={[
          ['traceroute 192.168.3.10', 'Arată hop-urile reale; aici pachetul a plecat direct prin R3 (10.0.13.2), nu prin R2 — consecința unei rute /32 sau a unui cost mai mic.'],
          ['show ip cef 192.168.3.10', 'Arată intrarea FIB (rezultatul final precalculat): prefixul ales, next hop-ul și interfața.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Prezice, apoi verifică">
        <p>R1 are: <code>S* 0.0.0.0/0 [1/0] via 10.9.9.1</code>, <code>O 10.0.0.0/8 [110/20] via 10.9.9.2</code>, <code>S 10.1.0.0/16 [1/0] via 10.9.9.3</code>, <code>O 10.1.1.0/24 [110/2] via 10.9.9.4</code>. Prin ce next hop pleacă pachetele către fiecare adresă?</p>
        <Reveal label="10.1.1.9"><p>Se potrivesc /0, /8, /16, /24; câștigă <b>/24 OSPF</b> → via 10.9.9.4 (AD-ul 110 nu contează: prefix mai lung).</p></Reveal>
        <Reveal label="10.1.9.9"><p>Se potrivesc /0, /8, /16 (nu /24: 10.1.9 ≠ 10.1.1); câștigă <b>/16 static</b> → via 10.9.9.3.</p></Reveal>
        <Reveal label="10.200.1.1"><p>Se potrivesc /0 și /8; câștigă <b>/8 OSPF</b> → via 10.9.9.2.</p></Reveal>
        <Reveal label="172.16.0.1"><p>Doar ruta implicită se potrivește → via 10.9.9.1.</p></Reveal>
      </Detailed>

      <Detailed title="Exemplul 7 — Când alegerea nu e cea așteptată">
        <Table head={['Simptom', 'Cauză probabilă', 'Verificare']} hlCol={0} rows={[
          ['Trafic pe calea „greșită”', 'O rută mai specifică (adesea o veche rută statică /24 sau /32) bate ruta așteptată', <><code>show ip route &lt;adresă&gt;</code>; <code>show ip route static</code></>],
          ['Ruta statică nu preia când OSPF cade', 'AD-ul statice nu e mai mare decât al OSPF sau next hop-ul nu e accesibil', <><code>show running-config | include ip route</code></>],
          ['Doar o cale, deși ai două legături', 'Metricile nu sunt exact egale (de exemplu cost 3 vs 4)', <><code>show ip ospf interface</code>, <code>show ip route &lt;prefix&gt;</code></>],
          ['Ping merge într-un sens, nu în celălalt', 'Ruta de întoarcere lipsește pe un router de pe drum', <>tabela de rutare pe fiecare router, în ambele sensuri</>],
        ]} />
      </Detailed>
    </section>
  );
}
