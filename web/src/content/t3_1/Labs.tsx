import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology31, LabSoloTopology31 } from '../../diagrams/t3_1';

/* ======================================================================
   LAB GHIDAT — citirea tabelei de rutare
   ====================================================================== */
export function GuidedLab() {
  const L = 't31g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 3.1-G" title="Lab ghidat — construiești și citești tabela de rutare" />
      <Summary>
        <p><b>Obiectiv:</b> cu trei routere în linie, vezi cum apar rutele <b>C</b> și <b>L</b>, adaugi rute <b>S</b> și <b>S*</b>, citești fiecare componentă (cod, prefix, mască, next hop, AD, metrică, gateway of last resort) și observi ce se întâmplă când o legătură cade sau lipsește ruta implicită. La final vezi și o rută <b>O</b>, doar ca să recunoști codul.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × router 2911, 2 × PC) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: PC1 — R1 — R2 — R3 — PC3. R3 are loopback 8.8.8.8/32 care simulează „Internetul”.">
        <LabGuidedTopology31 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Conectat la']} rows={[
        ['PC1', 'NIC', '192.168.1.10 /24 · gw 192.168.1.1', 'R1 Gi0/0 (cablu cross sau straight prin auto-MDIX)'],
        ['R1', 'Gi0/0', '192.168.1.1 /24', 'PC1'],
        ['R1', 'Gi0/1', '10.0.12.1 /30', 'R2 Gi0/0'],
        ['R2', 'Gi0/0', '10.0.12.2 /30', 'R1 Gi0/1'],
        ['R2', 'Gi0/1', '10.0.23.1 /30', 'R3 Gi0/0'],
        ['R3', 'Gi0/0', '10.0.23.2 /30', 'R2 Gi0/1'],
        ['R3', 'Gi0/1', '192.168.3.1 /24', 'PC3'],
        ['R3', 'Lo0', '8.8.8.8 /32', '(loopback — „Internet”)'],
        ['PC3', 'NIC', '192.168.3.10 /24 · gw 192.168.3.1', 'R3 Gi0/1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer arată tabela de rutare cu formatul IOS, dar unele detalii (legenda, liniile L la versiuni vechi, timpii) pot diferi de cele din lecție. Comenzile <b>nu au fost testate</b> de autorul lecției în versiunea ta. Echivalentul în GNS3/CML: aceleași comenzi pe imagini IOSv/CSR. OSPF din Partea 4 este doar o „previzualizare”: îl învățăm în 3.4; acum copiezi comenzile ca să vezi codul O.
      </Callout>

      <Detailed title="Partea 1 — Interfețe: rutele C și L">
        <Step labKey={L} n={1} title="Adresare">
          <p>Setează adresele din tabel. Pe fiecare router pornește interfețele (<code>no shutdown</code>). Exemplu pentru R1:</p>
          <CodeBlock title="R1" kind="config" code={`Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface gigabitethernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface gigabitethernet0/1
R1(config-if)# ip address 10.0.12.1 255.255.255.252
R1(config-if)# no shutdown`} explain={[
            ['hostname R1', 'Numele routerului în prompt.'],
            ['ip address … / no shutdown', 'Adresa și pornirea interfeței; fără ele nu apar rutele C și L.'],
          ]} />
          <p>Repetă pe R2 (Gi0/0 10.0.12.2/30, Gi0/1 10.0.23.1/30) și R3 (Gi0/0 10.0.23.2/30, Gi0/1 192.168.3.1/24, plus <code>interface loopback0</code> cu <code>ip address 8.8.8.8 255.255.255.255</code>). Setează IP, mască și gateway pe PC-uri.</p>
        </Step>
        <Step labKey={L} n={2} title="Citește tabela: doar C și L">
          <p>Pe R1: <code>show ip route</code>. Câte linii C și câte L vezi? Ce scrie la „Gateway of last resort”?</p>
          <Reveal label="Răspuns">
            <p>Două rute C (192.168.1.0/24 și 10.0.12.0/30) și două L (192.168.1.1/32 și 10.0.12.1/32). Antetul spune „Gateway of last resort is not set”. Nu există rute S, nici O, pentru că nu am configurat nimic altceva.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Ce nu funcționează încă">
          <p>De pe PC1 trimite ping către 192.168.3.10. Ce răspuns primești și de la cine? Verifică apoi <code>show ip route</code> pe R1.</p>
          <Reveal label="Răspuns">
            <p>Primești „Destination host unreachable” de la 192.168.1.1 (R1): R1 nu are nicio rută pentru 192.168.3.0/24 și nicio rută implicită, deci aruncă pachetul și trimite ICMP unreachable. Un ping dat direct de pe R1 ar afișa <code>U</code>.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Rute statice și implicită: S și S*">
        <Step labKey={L} n={4} title="Configurează rutele">
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip route 192.168.3.0 255.255.255.0 10.0.12.2
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.12.2`} explain={[
            ['ip route 192.168.3.0 255.255.255.0 10.0.12.2', 'Spre LAN-ul lui R3, via R2.'],
            ['ip route 0.0.0.0 0.0.0.0 10.0.12.2', 'Ruta implicită: tot restul (inclusiv „Internetul” 8.8.8.8) via R2.'],
          ]} />
          <CodeBlock title="R2" kind="config" code={`R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.12.1
R2(config)# ip route 192.168.3.0 255.255.255.0 10.0.23.2
R2(config)# ip route 8.8.8.8 255.255.255.255 10.0.23.2`} explain={[
            ['192.168.1.0/24 via 10.0.12.1', 'Drumul înapoi spre LAN-ul lui R1.'],
            ['192.168.3.0/24 via 10.0.23.2', 'Drumul înainte spre R3.'],
            ['8.8.8.8/32 via 10.0.23.2', 'Rută de tip host către „Internet”.'],
          ]} />
          <CodeBlock title="R3" kind="config" code={`R3(config)# ip route 192.168.1.0 255.255.255.0 10.0.23.1
R3(config)# ip route 10.0.12.0 255.255.255.252 10.0.23.1`} explain={[
            ['192.168.1.0/24 via 10.0.23.1', 'Întoarcerea spre PC1 (altfel răspunsurile se pierd).'],
            ['10.0.12.0/30 via 10.0.23.1', 'Ca R3 să poată răspunde și pentru legătura R1–R2 (ping de pe R1).'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="Citește tabela lui R1 și testează">
          <p>Rulează <code>show ip route</code> pe R1. Pentru fiecare linie nouă notează: cod, prefix, mască, next hop, AD și metrică. Apoi de pe PC1 trimite ping către 192.168.3.10 și 8.8.8.8.</p>
          <Reveal label="Răspuns (tabela așteptată)">
            <CodeBlock title="R1 (ilustrativ)" kind="session" code={`Gateway of last resort is 10.0.12.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 10.0.12.2
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.0.12.0/30 is directly connected, GigabitEthernet0/1
L        10.0.12.1/32 is directly connected, GigabitEthernet0/1
      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.1.0/24 is directly connected, GigabitEthernet0/0
L        192.168.1.1/32 is directly connected, GigabitEthernet0/0
S     192.168.3.0/24 [1/0] via 10.0.12.2`} explain={[
              ['S* 0.0.0.0/0 [1/0] via 10.0.12.2', 'Cod S*, prefix 0.0.0.0, mască /0, AD 1, metrică 0, next hop 10.0.12.2.'],
              ['S 192.168.3.0/24 [1/0] via 10.0.12.2', 'Cod S, prefix 192.168.3.0, mască /24, AD 1, metrică 0, next hop 10.0.12.2.'],
            ]} />
            <p>Ping-urile către 192.168.3.10 și 8.8.8.8 trebuie să reușească (primul poate pierde un pachet din cauza ARP).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Interoghează o destinație">
          <p>Pe R1 rulează <code>show ip route 192.168.3.10</code>, apoi <code>show ip route 8.8.8.8</code>. Care e „Known via”, ce distance și ce metric are fiecare? Care e candidate default path?</p>
          <Reveal label="Răspuns">
            <p>Pentru 192.168.3.10: „Routing entry for 192.168.3.0/24, Known via "static", distance 1, metric 0”. Pentru 8.8.8.8: „Routing entry for 0.0.0.0/0 … Known via "static", distance 1, metric 0, candidate default path”. Ambele via 10.0.12.2.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Ce se întâmplă când se rupe ceva">
        <Step labKey={L} n={7} title="O legătură cade: ruta S dispare">
          <CodeBlock title="R2" kind="config" code={`R2(config)# interface gigabitethernet0/1
R2(config-if)# shutdown`} explain={[
            ['shutdown', 'Pune interfața R2 Gi0/1 (spre R3) down.']
          ]} />
          <p>Pe R2 rulează <code>show ip route</code>. Ce s-a întâmplat cu rutele C/L ale lui Gi0/1 și cu rutele statice care foloseau 10.0.23.2? Apoi dă <code>no shutdown</code>.</p>
          <Reveal label="Răspuns">
            <p>Dispar C 10.0.23.0/30 și L 10.0.23.1/32; rutele statice 192.168.3.0/24 și 8.8.8.8/32 dispar și ele, pentru că next hop-ul 10.0.23.2 nu se mai rezolvă printr-o rută connected (căutare recursivă eșuată). Revin după <code>no shutdown</code>, odată cu interfața.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={8} title="Fără rută implicită">
          <CodeBlock title="R1" kind="config" code={`R1(config)# no ip route 0.0.0.0 0.0.0.0 10.0.12.2
R1(config)# end
R1# show ip route
R1# ping 8.8.8.8`} explain={[
            ['no ip route 0.0.0.0 0.0.0.0 10.0.12.2', 'Șterge ruta implicită.'],
            ['ping 8.8.8.8', 'De pe R1: ce caracter apare?'],
          ]} />
          <Reveal label="Răspuns">
            <p>Antetul devine „Gateway of last resort is not set”, linia S* dispare, ping-ul afișează <code>U.U.U</code> (sau doar <code>U</code>) — destination unreachable — pentru că nu există rută pentru 8.8.8.8. Restabilește ruta cu <code>ip route 0.0.0.0 0.0.0.0 10.0.12.2</code>.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 4 — Previzualizare: cum arată o rută O">
        <Step labKey={L} n={9} title="OSPF minimal (se învață în 3.4)">
          <CodeBlock title="R1 / R2 / R3" kind="config" code={`R1(config)# router ospf 1
R1(config-router)# network 10.0.12.0 0.0.0.3 area 0

R2(config)# router ospf 1
R2(config-router)# network 10.0.12.0 0.0.0.3 area 0
R2(config-router)# network 10.0.23.0 0.0.0.3 area 0

R3(config)# router ospf 1
R3(config-router)# network 10.0.23.0 0.0.0.3 area 0`} explain={[
            ['router ospf 1', 'Pornește procesul OSPF (numărul 1 are doar semnificație locală).'],
            ['network … 0.0.0.3 area 0', 'Spune pe ce interfețe rulează OSPF și le anunță rețeaua; 0.0.0.3 este wildcard mask (nu mască de rețea).'],
          ]} />
          <p>Așteaptă ~30–60 s, apoi pe R1: <code>show ip route</code>. Ce linie nouă a apărut? Care sunt AD și metrica?</p>
          <Reveal label="Răspuns">
            <p>Apare <code>O 10.0.23.0/30 [110/2] via 10.0.12.2, …, GigabitEthernet0/1</code>: AD 110 (OSPF), metrica 2 (două legături Fast/Gigabit cu cost 1 fiecare) și next hop 10.0.12.2. Rutele statice rămân (ele nu sunt șterse). Pe R3, ruta statică 10.0.12.0/30 (AD 1) rămâne în tabelă, nu cea OSPF (AD 110) — primul indiciu despre cum alege routerul între surse (3.2).</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Soluție completă (configurare finală, fără OSPF)">
        <Reveal label="Arată soluția">
          <CodeBlock title="Rute statice" kind="config" code={`R1: ip route 192.168.3.0 255.255.255.0 10.0.12.2
    ip route 0.0.0.0 0.0.0.0 10.0.12.2
R2: ip route 192.168.1.0 255.255.255.0 10.0.12.1
    ip route 192.168.3.0 255.255.255.0 10.0.23.2
    ip route 8.8.8.8 255.255.255.255 10.0.23.2
R3: ip route 192.168.1.0 255.255.255.0 10.0.23.1
    ip route 10.0.12.0 255.255.255.252 10.0.23.1`} explain={[
            ['R1', 'Rută spre LAN R3 și rută implicită prin R2.'],
            ['R2', 'Rută înapoi spre LAN R1, rută spre LAN R3 și host route spre 8.8.8.8.'],
            ['R3', 'Rute înapoi spre LAN R1 și spre legătura R1–R2.'],
          ]} />
        </Reveal>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — triunghi, interpretarea tabelelor
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 3.1-S" title="Lab solo — triunghi de routere: configurezi și interpretezi" />
      <Summary>
        <p><b>Obiectiv:</b> pornești de la o schemă de adresare și o topologie, construiești rețeaua cu rute statice astfel încât cele trei LAN-uri să comunice, apoi <b>interpretezi tabela de rutare</b> a lui RA completând un tabel (cod, prefix, mască, next hop, AD, metrică).
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (3 routere + 3 PC) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: trei routere în triunghi; fiecare are o LAN proprie.">
        <LabSoloTopology31 />
      </Figure>
      <Table head={['Legătură / LAN', 'Rețea', 'Capăt 1', 'Capăt 2']} rows={[
        ['RA–RB', '10.1.1.0/30', 'RA Gi0/1 .1', 'RB Gi0/0 .2'],
        ['RA–RC', '10.1.2.0/30', 'RA Gi0/2 .1', 'RC Gi0/0 .2'],
        ['RB–RC', '10.1.3.0/30', 'RB Gi0/1 .1', 'RC Gi0/1 .2'],
        ['LAN A', '172.16.1.0/24', 'RA Gi0/0 .1', 'PC-A .10'],
        ['LAN B', '172.16.2.0/24', 'RB Gi0/2 .1', 'PC-B .10'],
        ['LAN C', '172.16.3.0/24', 'RC Gi0/2 .1', 'PC-C .10'],
      ]} />
      <Callout kind="info" title="Cerințe">
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          <li>Configurează adresele și pornește toate interfețele. Verifică <code>show ip route connected</code> pe fiecare router: câte rute C și câte L te aștepți și câte vezi?</li>
          <li>Configurează <b>doar rute statice</b> (fără protocoale dinamice) astfel încât orice PC să facă ping către oricare altul. Folosește pe RB și RC câte o <b>singură</b> rută implicită unde se poate.</li>
          <li>Pe RA completează, pentru <b>fiecare</b> rută din <code>show ip route</code>, tabelul: cod · prefix · mască · next hop (sau „—”) · AD · metrică.</li>
          <li>Pe RA dă <code>show ip route 172.16.3.10</code>: ce rută și ce next hop folosește?</li>
          <li>Opțional: dă shutdown pe Gi0/1 al lui RA și observă ce rute dispar de pe RA; apoi pe RB.</li>
        </ol>
      </Callout>
      <Detailed title="Verificare și indicii">
        <Reveal label="Indiciu 1 — de câte rute ai nevoie">
          <p>RA trebuie să afle 172.16.2.0/24 și 172.16.3.0/24 (și, opțional, 10.1.3.0/30). RB și RC sunt „frunze” față de RA: fiecare are un drum bun către RA, deci pot folosi ruta implicită spre RA pentru tot ce nu e local.</p>
        </Reveal>
        <Reveal label="Indiciu 2 — atenție la reîntoarcere">
          <p>Un ping reușește doar dacă și traseul de <b>întoarcere</b> este acoperit: fiecare router de pe drum trebuie să știe să ajungă la LAN-ul sursă.</p>
        </Reveal>
      </Detailed>
      <Detailed title="Soluție">
        <Reveal label="Arată soluția">
          <CodeBlock title="Rute statice" kind="config" code={`RA: ip route 172.16.2.0 255.255.255.0 10.1.1.2
    ip route 172.16.3.0 255.255.255.0 10.1.2.2
RB: ip route 0.0.0.0 0.0.0.0 10.1.1.1
RC: ip route 0.0.0.0 0.0.0.0 10.1.2.1`} explain={[
            ['RA', 'Două rute statice, câte una pentru fiecare LAN îndepărtat, pe legătura directă.'],
            ['RB / RC', 'O singură rută implicită spre RA acoperă tot ce nu e local; ele ajung astfel și între ele prin RA.'],
          ]} />
          <p>Tabelul lui RA: <code>C 172.16.1.0/24</code> (—, 0, 0) · <code>L 172.16.1.1/32</code> · <code>C 10.1.1.0/30</code> · <code>L 10.1.1.1/32</code> · <code>C 10.1.2.0/30</code> · <code>L 10.1.2.1/32</code> · <code>S 172.16.2.0/24 [1/0] via 10.1.1.2</code> · <code>S 172.16.3.0/24 [1/0] via 10.1.2.2</code>. Pentru 172.16.3.10 se folosește S 172.16.3.0/24, next hop 10.1.2.2. La shutdown pe Gi0/1 al lui RA dispar C 10.1.1.0/30, L 10.1.1.1/32 și ruta S 172.16.2.0/24 (next hop-ul 10.1.1.2 nu mai e accesibil).</p>
          <p>Notă: pe RB/RC <code>show ip route</code> arată <code>S* 0.0.0.0/0 [1/0] via …</code>, iar „Gateway of last resort” e setat.</p>
        </Reveal>
      </Detailed>
    </section>
  );
}
