import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology33, LabSoloTopology33 } from '../../diagrams/t3_3';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't33g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 3.3-G" title="Lab ghidat — rute statice IPv4/IPv6: rețea, implicită, gazdă, flotantă" />
      <Summary>
        <p><b>Obiectiv:</b> pe un triunghi de trei routere configurezi, rând pe rând, rute de <b>rețea</b> (dus și întors), o rută <b>implicită</b>, o rută de <b>gazdă</b> și o rută <b>flotantă</b> de rezervă, mai întâi în IPv4, apoi în IPv6. După fiecare pas verifici cu <code>show ip route</code>, <code>ping</code> și <code>traceroute</code>.
          <br /><b>Timp estimat:</b> 75–90 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × router 2911, 2 × PC) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: R1, R2, R3 în triunghi; linkul R1–R3 (linie punctată) este rezerva. PC1 pe R1, PC3 pe R3.">
        <LabGuidedTopology33 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4', 'IPv6', 'Conectat la']} rows={[
        ['PC1', 'NIC', '192.168.10.10/24 · gw 192.168.10.1', '2001:db8:10::10/64 · gw 2001:db8:10::1', 'R1 Gi0/0'],
        ['R1', 'Gi0/0', '192.168.10.1/24', '2001:db8:10::1/64', 'PC1'],
        ['R1', 'Gi0/1', '10.0.12.1/30', '2001:db8:12::1/64', 'R2 Gi0/0'],
        ['R1', 'Gi0/2', '10.0.13.1/30', '2001:db8:13::1/64', 'R3 Gi0/2'],
        ['R2', 'Gi0/0', '10.0.12.2/30', '2001:db8:12::2/64', 'R1 Gi0/1'],
        ['R2', 'Gi0/1', '10.0.23.1/30', '2001:db8:23::1/64', 'R3 Gi0/0'],
        ['R3', 'Gi0/0', '10.0.23.2/30', '2001:db8:23::2/64', 'R2 Gi0/1'],
        ['R3', 'Gi0/2', '10.0.13.2/30', '2001:db8:13::2/64', 'R1 Gi0/2'],
        ['R3', 'Gi0/1', '192.168.30.1/24', '2001:db8:30::1/64', 'PC3'],
        ['PC3', 'NIC', '192.168.30.10/24 · gw 192.168.30.1', '2001:db8:30::10/64 · gw 2001:db8:30::1', 'R3 Gi0/1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă <code>ip route</code> și <code>ipv6 route</code>, dar mesajele pot diferi de IOS real; la primul ping apar de obicei timeout-uri din cauza ARP/ND (repetă comanda). Următorul hop link-local în IPv6 funcționează în PT cu interfață + adresă. Comenzile <b>nu au fost testate</b> de autorul lecției în versiunea ta de PT; același lab merge identic în GNS3/CML cu imagini IOSv/CSR. Pentru <code>shutdown</code> pe o interfață, PT nu simulează întotdeauna instant retragerea rutelor: așteaptă câteva secunde.
      </Callout>

      <Detailed title="Partea 0 — Adresare">
        <Step labKey={L} n={1} title="Interfețe, PC-uri și rutare IPv6">
          <p>Configurează adresele IPv4 din tabel pe toate interfețele (<code>ip address …</code>, <code>no shutdown</code>) și pe PC-uri (IP, mască, gateway). Apoi, pe fiecare router, pornește IPv6 (<code>ipv6 unicast-routing</code>) și adaugă adresele IPv6 (<code>ipv6 address …</code>); pe PC-uri configurează adresa IPv6 și gateway-ul. Verifică cu <code>show ip interface brief</code> și <code>show ipv6 interface brief</code>.</p>
          <Reveal label="Soluție (R1)">
            <CodeBlock title="R1" kind="config" code={`R1(config)# ipv6 unicast-routing
R1(config)# interface g0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# ipv6 address 2001:db8:10::1/64
R1(config-if)# no shutdown
R1(config-if)# interface g0/1
R1(config-if)# ip address 10.0.12.1 255.255.255.252
R1(config-if)# ipv6 address 2001:db8:12::1/64
R1(config-if)# no shutdown
R1(config-if)# interface g0/2
R1(config-if)# ip address 10.0.13.1 255.255.255.252
R1(config-if)# ipv6 address 2001:db8:13::1/64
R1(config-if)# no shutdown`} explain={[
              ['ipv6 unicast-routing', 'Pornește rutarea IPv6 (fără ea nu merge nimic din ce urmează în IPv6).'],
              ['ip address / ipv6 address', 'Dual-stack: aceeași interfață are IPv4 și IPv6.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Testează înainte de rute">
          <p>De pe PC1, dă <code>ping 192.168.10.1</code> (gateway-ul) și apoi <code>ping 192.168.30.10</code> (PC3). Ce primești și de ce?</p>
          <Reveal label="Răspuns">
            <p>Către gateway merge (același LAN). Către PC3 primești „Destination host unreachable” de la 192.168.10.1: R1 nu are nicio rută spre 192.168.30.0/24, deci nu poate transmite pachetul (3.2/3.3).</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Rute de rețea (3.3.b): dus și întors">
        <Step labKey={L} n={3} title="Doar ruta dus">
          <CodeBlock title="R1 și R2" kind="config" code={`R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.12.2
R2(config)# ip route 192.168.30.0 255.255.255.0 10.0.23.2`} explain={[
            ['R1: 192.168.30.0/24 via 10.0.12.2', 'R1 trimite către LAN-ul lui R3 prin R2.'],
            ['R2: 192.168.30.0/24 via 10.0.23.2', 'R2 trimite mai departe către R3.'],
          ]} />
          <p>Verifică: <code>show ip route static</code> pe R1 și R2. Apoi de pe PC1 dă <code>ping 192.168.30.10</code>. Ce rezultat primești acum?</p>
          <Reveal label="Răspuns">
            <p>În tabele apar rutele S. Ping-ul dă acum <b>timeout</b>, nu „unreachable”: cererea ajunge la PC3 (R1, R2, R3 o pot transmite, R3 are LAN-ul connected), dar răspunsul se întoarce la R3, care nu are rută către 192.168.10.0/24, și se pierde. <code>show ip route 192.168.10.10</code> pe R3 confirmă: „Network not in table”.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Adaugă ruta de întoarcere">
          <CodeBlock title="R2 și R3" kind="config" code={`R2(config)# ip route 192.168.10.0 255.255.255.0 10.0.12.1
R3(config)# ip route 192.168.10.0 255.255.255.0 10.0.23.1`} explain={[
            ['R2: 192.168.10.0/24 via 10.0.12.1', 'Întoarcerea spre LAN R1.'],
            ['R3: 192.168.10.0/24 via 10.0.23.1', 'R3 trimite răspunsurile prin R2.'],
          ]} />
          <p>Repetă ping-ul și rulează <code>tracert 192.168.30.10</code> pe PC1. Ce hop-uri vezi și ce TTL are răspunsul?</p>
          <Reveal label="Răspuns">
            <p>Ping reușit. <code>tracert</code>: 192.168.10.1 (R1), 10.0.12.2 (R2), 10.0.23.2 (R3), 192.168.30.10 (PC3). TTL-ul răspunsului: 125 (128 − 3 routere), valoare tipică la Windows.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Ruta implicită (3.3.a)">
        <Step labKey={L} n={5} title="Înlocuiește ruta de rețea de pe R1 cu o implicită">
          <p>R1 are o singură cale spre restul rețelei (prin R2), deci este un router „stub”. Șterge ruta specifică și pune una implicită:</p>
          <CodeBlock title="R1" kind="config" code={`R1(config)# no ip route 192.168.30.0 255.255.255.0 10.0.12.2
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.12.2`} explain={[
            ['no ip route …', 'Șterge ruta specifică; trebuie scrisă exact cum a fost configurată.'],
            ['ip route 0.0.0.0 0.0.0.0 10.0.12.2', 'Tot ce nu e local pleacă la R2.'],
          ]} />
          <p>Verifică <code>show ip route</code> (ce scrie la „Gateway of last resort”?), apoi repetă ping-ul PC1 → PC3 și un ping către o adresă inexistentă, de exemplu 172.16.99.9. Unde se oprește al doilea pachet?</p>
          <Reveal label="Răspuns">
            <p>„Gateway of last resort is 10.0.12.2 to network 0.0.0.0”, cu <code>S* 0.0.0.0/0</code>. Ping-ul către PC3 merge ca înainte. Către 172.16.99.9 pachetul ajunge la R2, care nu are nicio rută (nici implicită) și răspunde cu „unreachable”; R1 l-a transmis pentru că implicita se potrivește cu orice.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Ruta de gazdă (3.3.c)">
        <Step labKey={L} n={6} title="O excepție pentru PC3">
          <p>Pe R1 adaugă o rută /32 care trimite doar traficul către PC3 direct prin R3 (linkul de rezervă), restul rămânând pe R2:</p>
          <CodeBlock title="R1 și R3" kind="config" code={`R1(config)# ip route 192.168.30.10 255.255.255.255 10.0.13.2
R3(config)# ip route 192.168.10.10 255.255.255.255 10.0.13.1`} explain={[
            ['R1: …30.10 255.255.255.255 via 10.0.13.2', 'Rută de gazdă (/32): doar PC3 merge direct la R3.'],
            ['R3: …10.10 255.255.255.255 via 10.0.13.1', 'Întoarcerea pentru PC1, tot direct (altfel răspunsul ar merge prin R2 — merge și așa, dar am vrea drum simetric).'],
          ]} />
          <p>Rulează <code>tracert 192.168.30.10</code> din PC1 și apoi <code>tracert 192.168.30.1</code> (interfața lui R3 din LAN). Ce diferență vezi între cele două?</p>
          <Reveal label="Răspuns">
            <p>Către 192.168.30.10: două hop-uri — R1, apoi R3 (10.0.13.2), apoi PC3 (ruta /32 bate implicita). Către 192.168.30.1: R1, R2, R3, deoarece pentru această adresă nu se potrivește /32 și se folosește implicita (via R2). Aceeași rețea, două drumuri.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 4 — Ruta flotantă (3.3.d)">
        <Step labKey={L} n={7} title="Rezervă pentru LAN-ul lui R3">
          <p>Readu o rută de rețea pe R1 (principală, via R2), apoi adaugă rezerva via linkul direct, cu AD 5:</p>
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.12.2
R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.13.2 5`} explain={[
            ['… 10.0.12.2', 'Principala (AD 1).'],
            ['… 10.0.13.2 5', 'Flotanta (AD 5): activă doar când principala dispare.'],
          ]} />
          <p>Verifică: <code>show ip route 192.168.30.0</code> și <code>show running-config | include ip route</code>. Câte rute pentru 192.168.30.0/24 vezi în fiecare?</p>
          <Reveal label="Răspuns">
            <p>În tabelă: una singură (distance 1, via 10.0.12.2). În configurație: două. Cea flotantă este în rezervă.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={8} title="Simulează căderea">
          <p>Pe R1 dă <code>interface g0/1</code> → <code>shutdown</code>. Rulează <code>show ip route 192.168.30.0</code>, apoi de pe PC1 ping și <code>tracert 192.168.30.1</code>. Apoi <code>no shutdown</code> și verifică din nou.</p>
          <Reveal label="Răspuns">
            <p>După <code>shutdown</code>, ruta principală (next hop 10.0.12.2) dispare și apare „distance 5, via 10.0.13.2”. Traseul către 192.168.30.1 ar fi R1 → R3 (direct). Ruta implicită prin 10.0.12.2 dispare și ea. După <code>no shutdown</code>, revin principala și implicita, iar ruta cu AD 5 dispare din tabelă. Dacă ping-ul pierde primul pachet, e normal (convergență/ARP).</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 5 — Rute statice IPv6">
        <Step labKey={L} n={9} title="Rute IPv6 de rețea, implicită și flotantă">
          <CodeBlock title="R1, R2, R3" kind="config" code={`R1(config)# ipv6 route 2001:db8:30::/64 2001:db8:12::2
R1(config)# ipv6 route 2001:db8:30::/64 2001:db8:13::2 5
R2(config)# ipv6 route 2001:db8:10::/64 2001:db8:12::1
R2(config)# ipv6 route 2001:db8:30::/64 2001:db8:23::2
R3(config)# ipv6 route 2001:db8:10::/64 2001:db8:23::1
R3(config)# ipv6 route 2001:db8:10::/64 2001:db8:13::1 5`} explain={[
            ['R1 … 2001:db8:12::2', 'Principala spre LAN R3.'],
            ['R1 … 2001:db8:13::2 5', 'Rezerva flotantă (AD 5).'],
            ['R2', 'Câte o rută pentru fiecare LAN.'],
            ['R3 … 5', 'Întoarcere principală + flotantă.'],
          ]} />
          <p>Verifică <code>show ipv6 route static</code> pe R1 și <code>ping 2001:db8:30::10</code> din PC1. Apoi repetă testul cu <code>shutdown</code> pe R1 Gi0/1. Ce se schimbă?</p>
          <Reveal label="Răspuns">
            <p>Ping IPv6 reușit. În starea normală apare doar ruta cu next hop 2001:db8:12::2; după <code>shutdown</code> pe Gi0/1 next hop-ul devine inaccesibil, ruta principală dispare și se instalează cea cu AD 5 (2001:db8:13::2). Comportament identic cu IPv4.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={10} title="Next hop link-local">
          <p>Notează adresa link-local a lui R2 pe Gi0/0 (<code>show ipv6 interface g0/0</code> pe R2, linia FE80::…). Pe R1 încearcă <code>ipv6 route 2001:db8:23::/64 FE80::&lt;adresa&gt;</code> (fără interfață), apoi cu interfață. Ce observi?</p>
          <Reveal label="Răspuns">
            <p>Fără interfață, IOS respinge comanda (mesaj de tip „Interface has to be specified for a link-local nexthop”; textul exact variază). Cu <code>ipv6 route 2001:db8:23::/64 g0/1 FE80::&lt;adresa&gt;</code> este acceptată și apare în <code>show ipv6 route</code> cu „via FE80::…, GigabitEthernet0/1”.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Curățare">
        <p>La final poți șterge rutele cu <code>no ip route …</code> / <code>no ipv6 route …</code> (comanda trebuie să se potrivească cu cea configurată) sau poți reîncărca din fișierul salvat. Nu uita <code>copy running-config startup-config</code> dacă vrei să păstrezi configurația.</p>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't33s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 3.3-S" title="Lab solo — router de ramură cu trei vecini" />
      <Summary>
        <p><b>Scenariu:</b> R1 este routerul unei ramuri, cu un LAN și trei vecini (N1, N2, N3). Cerințele sunt formulate fără comenzi: le deduci tu. Lucrezi singur, apoi compari cu soluția ascunsă.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Packet Tracer (4 routere + 1 PC; vecinii pot avea câte o interfață loopback pentru destinațiile de test).</p>
      </Summary>
      <Figure caption="Topologie: R1 în centru, vecinii N1–N3 și LAN-ul 192.168.5.0/24.">
        <LabSoloTopology33 />
      </Figure>
      <Table head={['Legătură', 'Rețea', 'R1', 'Vecin']} rows={[
        ['R1–N1', '10.0.1.0/30', '10.0.1.1', '10.0.1.2'],
        ['R1–N2', '10.0.2.0/30', '10.0.2.1', '10.0.2.2'],
        ['R1–N3', '10.0.3.0/30', '10.0.3.1', '10.0.3.2'],
        ['LAN R1', '192.168.5.0/24', '192.168.5.1', 'PC .10'],
      ]} />
      <Detailed title="Cerințe">
        <ol>
          <li><b>(IPv4, implicită)</b> Tot traficul necunoscut al lui R1 trebuie să plece către N3.</li>
          <li><b>(IPv4, rețea)</b> Rețeaua 172.16.0.0/16 se află în spatele lui N1.</li>
          <li><b>(IPv4, gazdă)</b> Adresa 172.16.5.5 trebuie să ajungă la N2, nu la N1.</li>
          <li><b>(IPv4, flotantă)</b> Dacă linkul către N1 cade, 172.16.0.0/16 trebuie să meargă prin N2. Rezerva nu trebuie să fie folosită cât N1 funcționează.</li>
          <li><b>(IPv6)</b> Adresele IPv6: R1 2001:db8:1::1/64 spre N1 (N1 are ::2), iar rețeaua 2001:db8:100::/64 este în spatele lui N1; ruta implicită IPv6 merge către N3 (2001:db8:3::2 pe link-ul 2001:db8:3::/64).</li>
          <li><b>(Verificare)</b> Arată cu <code>show ip route</code>, <code>show ipv6 route</code> și <code>traceroute</code> că fiecare cerință e îndeplinită; apoi simulează căderea lui N1.</li>
        </ol>
        <Callout kind="tip" title="Strategie">
          Configurează adresele și testează ping către vecini înainte de rute. Apoi adaugă câte o cerință, verifică, și abia apoi treci la următoarea. Reține: ruta flotantă are nevoie de un AD mai mare decât al celei principale.
        </Callout>
        <Step labKey={L} n={1} title="Adresare și vecini">
          <p>Configurează adresele din tabel (și IPv6 pe legăturile de la cerința 5) și verifică ping către cei trei vecini.</p>
        </Step>
        <Step labKey={L} n={2} title="Rutele IPv4 (cerințele 1–4)">
          <p>Scrie și verifică rutele; răspunde: ce vezi în tabelă și ce rămâne doar în configurație?</p>
        </Step>
        <Step labKey={L} n={3} title="Rutele IPv6 (cerința 5)">
          <p>Nu uita comanda globală care pornește rutarea IPv6.</p>
        </Step>
        <Step labKey={L} n={4} title="Test de cădere">
          <p>Dă <code>shutdown</code> pe interfața către N1 și compară tabelele înainte și după.</p>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă">
        <CodeBlock title="R1" kind="config" code={`R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.3.2
R1(config)# ip route 172.16.0.0 255.255.0.0 10.0.1.2
R1(config)# ip route 172.16.5.5 255.255.255.255 10.0.2.2
R1(config)# ip route 172.16.0.0 255.255.0.0 10.0.2.2 5
R1(config)# ipv6 unicast-routing
R1(config)# ipv6 route 2001:db8:100::/64 2001:db8:1::2
R1(config)# ipv6 route ::/0 2001:db8:3::2`} explain={[
          ['ip route 0.0.0.0 0.0.0.0 10.0.3.2', 'Cerința 1: ruta implicită spre N3.'],
          ['ip route 172.16.0.0 255.255.0.0 10.0.1.2', 'Cerința 2: rută de rețea prin N1.'],
          ['ip route 172.16.5.5 255.255.255.255 10.0.2.2', 'Cerința 3: host route prin N2 (bate /16 prin longest prefix match).'],
          ['ip route 172.16.0.0 255.255.0.0 10.0.2.2 5', 'Cerința 4: flotantă (AD 5 > 1), prin N2.'],
          ['ipv6 unicast-routing + 2 rute', 'Cerința 5: IPv6 are nevoie de comanda globală; implicita este ::/0.'],
        ]} />
        <p><b>Verificări:</b> <code>show ip route static</code> arată S* 0.0.0.0/0, S 172.16.0.0/16 via 10.0.1.2 și S 172.16.5.5/32 via 10.0.2.2; ruta cu AD 5 <b>nu</b> apare. După <code>shutdown</code> pe interfața către N1, 172.16.0.0/16 devine [5/0] via 10.0.2.2, iar 172.16.5.5 rămâne pe N2. Întrebări de reflecție: (a) de ce nu e nevoie de o flotantă pentru 172.16.5.5? (Deja merge prin N2, care nu e afectat de căderea lui N1.) (b) ce s-ar întâmpla dacă flotanta ar avea AD 1? (Ar fi ECMP între N1 și N2.)</p>
      </Reveal>
    </section>
  );
}
