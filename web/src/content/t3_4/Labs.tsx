import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology34, LabSoloTopology34 } from '../../diagrams/t3_4';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't34g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 3.4-G" title="Lab ghidat — OSPFv2 single-area: vecini, DR/BDR, RID, costuri" />
      <Summary>
        <p><b>Obiectiv:</b> construiești OSPF pe topologia din secțiunea de configurare: un segment broadcast cu trei routere, un link punct-la-punct și un LAN pasiv. Verifici vecinii și stările lor, schimbi RID-ul și vezi că alegerea DR nu e preemptivă, treci linkul la point-to-point și schimbi costurile. La final simulezi o cădere.
          <br /><b>Timp estimat:</b> 90–110 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × router 2911, 1 × switch 2960, 1 × PC) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: R1, R2, R3 pe segmentul 10.0.0.0/24 prin SW1; R1–R2 au un link direct punct-la-punct; PC3 este în LAN-ul lui R3.">
        <LabGuidedTopology34 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4', 'Conectat la']} rows={[
        ['R1', 'Gi0/0', '10.0.0.1/24', 'SW1 (segment)'],
        ['R1', 'Gi0/1', '10.0.12.1/30', 'R2 Gi0/1 (p2p)'],
        ['R1', 'Lo0', '1.1.1.1/32', '—'],
        ['R2', 'Gi0/0', '10.0.0.2/24', 'SW1 (segment)'],
        ['R2', 'Gi0/1', '10.0.12.2/30', 'R1 Gi0/1 (p2p)'],
        ['R2', 'Lo0', '2.2.2.2/32', '—'],
        ['R3', 'Gi0/0', '10.0.0.3/24', 'SW1 (segment)'],
        ['R3', 'Gi0/1', '192.168.30.1/24', 'PC3 (LAN pasiv)'],
        ['R3', 'Lo0', '3.3.3.3/32', '—'],
        ['PC3', 'NIC', '192.168.30.10/24 · gw 192.168.30.1', 'R3 Gi0/1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă comenzile OSPF folosite aici, dar formatul output-urilor și timpii de convergență pot diferi de IOS real. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Dacă un vecin întârzie să apară, așteaptă câteva zeci de secunde înainte să concluzionezi. Același lab merge în GNS3/CML cu imagini IOSv sau CSR, cu rezultate similare.
      </Callout>

      <Detailed title="Partea 0 — Adresare">
        <Step labKey={L} n={1} title="Interfețe, loopback-uri și PC3">
          <p>Configurează adresele din tabel pe toate interfețele și pe loopback-uri (<code>interface loopback 0</code>). Pe PC3 setează IP-ul, masca și gateway-ul. Verifică cu <code>show ip interface brief</code>.</p>
          <Reveal label="Soluție (R1; R2 și R3 analog)">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip address 10.0.0.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface g0/1
R1(config-if)# ip address 10.0.12.1 255.255.255.252
R1(config-if)# no shutdown
R1(config-if)# interface loopback 0
R1(config-if)# ip address 1.1.1.1 255.255.255.255`} explain={[
              ['interface loopback 0', 'Interfață virtuală, mereu up/up: bună pentru Router ID stabil.'],
              ['255.255.255.255', 'Mască /32: o singură adresă, anunțată ca rută de gazdă.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Test de conectivitate, înainte de OSPF">
          <p>Din R1 dă <code>ping 10.0.0.3</code> (R3 pe segment) și <code>ping 10.0.12.2</code> (R2). Apoi, din PC3, <code>ping 10.0.0.1</code>. Ce vezi și ce tabel de rutare ai pe R1?</p>
          <Reveal label="Răspuns">
            <p>Pingurile către vecinii direct conectați reușesc, pentru că rutele C și L există. Ping-ul de la PC3 către 10.0.0.1 are o particularitate: cererea ajunge la R1 (R3 are segmentul direct conectat), dar răspunsul trebuie trimis înapoi către 192.168.30.10, iar R1 nu are nicio rută spre 192.168.30.0/24. Rezultatul este „Request timed out”. <code>show ip route</code> pe R1 arată doar C și L.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Vecini și adiacențe (3.4.a)">
        <Step labKey={L} n={3} title="Pornește OSPF pe toate routerele">
          <CodeBlock title="R1, R2, R3" kind="config" code={`R1(config)# router ospf 1
R1(config-router)# network 1.1.1.1 0.0.0.0 area 0
R1(config-router)# network 10.0.0.0 0.0.0.255 area 0
R1(config-router)# network 10.0.12.0 0.0.0.3 area 0

R2(config)# router ospf 1
R2(config-router)# network 2.2.2.2 0.0.0.0 area 0
R2(config-router)# network 10.0.0.0 0.0.0.255 area 0
R2(config-router)# network 10.0.12.0 0.0.0.3 area 0

R3(config)# router ospf 1
R3(config-router)# network 3.3.3.3 0.0.0.0 area 0
R3(config-router)# network 10.0.0.0 0.0.0.255 area 0
R3(config-router)# network 192.168.30.0 0.0.0.255 area 0`} explain={[
            ['network … 0.0.0.0 area 0', 'Wildcard 0.0.0.0: activează OSPF doar pe interfața cu acea adresă exactă (loopback-ul).'],
            ['network 10.0.0.0 0.0.0.255', 'Activează toate interfețele cu IP în 10.0.0.0/24, adică segmentul comun.'],
            ['network 192.168.30.0 0.0.0.255', 'Activează interfața LAN a lui R3 și anunță rețeaua PC3.'],
          ]} />
          <p>Așteaptă 30–40 s, apoi pe R1 rulează <code>show ip ospf neighbor</code>. Ce vecini vezi, în ce stare și cu ce rol?</p>
          <Reveal label="Răspuns (ilustrativ)">
            <p>Pe Gi0/0 (segmentul comun): <code>3.3.3.3 FULL/DR</code> și <code>2.2.2.2 FULL/BDR</code>. Pe Gi0/1 (linkul cu R2, încă broadcast): <code>2.2.2.2 FULL/DR</code>. R3 are cel mai mare RID pe segment, deci e DR; R2 e BDR. Pe linkul R1–R2 cu doi routere, R2 (RID mai mare) devine DR.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Citește rolurile pe interfață">
          <p>Pe R1 rulează <code>show ip ospf interface brief</code>. Ce stare are R1 pe Gi0/0 și pe Gi0/1? Ce înseamnă coloana <i>Nbrs F/C</i>?</p>
          <Reveal label="Răspuns">
            <p>Gi0/0: <b>DROTHER</b>, fiindcă R1 nu e DR sau BDR pe segment. Gi0/1: <b>BDR</b>. <i>Nbrs F/C</i> = câți vecini există / câți sunt în Full. Ca DROTHER, R1 are 2/2 pe Gi0/0 (și vorbește complet cu DR și BDR), iar pe Gi0/1 1/1.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Router ID (3.4.d)">
        <Step labKey={L} n={5} title="De unde își ia RID-ul fiecare router">
          <p>Pe fiecare router rulează <code>show ip protocols</code> și notează <i>Router ID</i>. Explică de ce are fiecare RID-ul pe care îl are.</p>
          <Reveal label="Răspuns">
            <p>Niciun router nu are <code>router-id</code> manual, deci RID-ul vine din cel mai mare IP de pe loopback up/up: R1 = 1.1.1.1, R2 = 2.2.2.2, R3 = 3.3.3.3.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Schimbă RID-ul și resetează procesul">
          <CodeBlock title="R2 (apoi revii)" kind="config" code={`R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.22
R2(config-router)# end
R2# show ip protocols          ! încă 2.2.2.2
R2# clear ip ospf process      ! confirmă cu: yes
R2# show ip protocols          ! acum 2.2.2.22
R2(config)# router ospf 1
R2(config-router)# no router-id 2.2.2.22
R2# clear ip ospf process`} explain={[
            ['router-id 2.2.2.22', 'RID manual. Rămâne sub 3.3.3.3, deci nu schimbă alegerea DR/BDR din segment.'],
            ['clear ip ospf process', 'Aplică RID-ul nou; întrerupe adiacențele pentru scurt timp.'],
            ['no router-id …', 'Revine la alegerea automată (loopback), apoi un nou clear.'],
          ]} />
          <Reveal label="Răspuns">
            <p>Înainte de <code>clear</code>, <code>show ip protocols</code> arată încă 2.2.2.2: noul RID nu se aplică pe procesul care rulează. După <code>clear</code> apare 2.2.2.22. Restaurarea cu <code>no router-id</code> și un nou <code>clear</code> readuce 2.2.2.2.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — DR/BDR (3.4.c)">
        <Step labKey={L} n={7} title="Prioritate mare pe R1, fără reset">
          <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip ospf priority 255`} explain={[
            ['ip ospf priority 255', 'Prioritatea maximă: R1 ar câștiga alegerea, dar doar la o nouă alegere.'],
          ]} />
          <p>Verifică pe R2 cu <code>show ip ospf interface brief</code> cine e DR pe Gi0/0. Apoi, pe toate trei, <code>clear ip ospf process</code>, și verifică din nou.</p>
          <Reveal label="Răspuns">
            <p>Înainte de clear: R3 rămâne DR (alegerea nu e preemptivă). După clear: R1 devine DR pe Gi0/0 (prioritate 255). Dintre ceilalți, cu prioritate 1, cel mai mare RID este R3, deci R3 devine BDR, iar R2 rămâne DROTHER. Pe R2, <code>show ip ospf neighbor</code> arată <code>1.1.1.1 FULL/DR</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={8} title="Scoate prioritatea și revino la alegerea implicită">
          <p>Pe R1 setează <code>no ip ospf priority</code> pe Gi0/0, apoi <code>clear ip ospf process</code> pe toate. Cine e DR acum?</p>
          <Reveal label="Răspuns">
            <p>Prioritățile sunt din nou egale (1), deci câștigă RID-ul cel mai mare pe segment: R3 (3.3.3.3) DR, R2 BDR, R1 DROTHER.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 4 — Point-to-point (3.4.b)">
        <Step labKey={L} n={9} title="Transformă linkul R1–R2 în point-to-point">
          <p>Înainte: pe R1, <code>show ip ospf neighbor</code> arată pentru 2.2.2.2 pe Gi0/1 un rol DR/BDR. Apoi, pe <b>ambele</b> capete, Gi0/1 primește <code>ip ospf network point-to-point</code> și faci <code>clear ip ospf process</code>. Compară ce vezi acum.</p>
          <CodeBlock title="R1 și R2, Gi0/1" kind="config" code={`R1(config-if)# ip ospf network point-to-point
R2(config-if)# ip ospf network point-to-point`} explain={[
            ['ip ospf network point-to-point', 'Se setează pe interfață, pe ambele capete. Nu există DR pe acest link.'],
          ]} />
          <Reveal label="Răspuns">
            <p>Pe Gi0/1, vecinul apare cu <code>FULL/ -</code> (fără rol) și <code>show ip ospf interface Gi0/1</code> arată <code>Network Type POINT_TO_POINT</code>. Gi0/0 (segmentul) rămâne broadcast, cu DR și BDR.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 5 — Costuri și interfețe pasive (3.4 config)">
        <Step labKey={L} n={10} title="Referința de cost, pe toate routerele">
          <p>Înainte să schimbi ceva, notează ruta către LAN-ul lui PC3 pe R1: <code>show ip route ospf</code> (metrica între paranteze). Apoi setează referința pe toate routerele și verifică din nou.</p>
          <CodeBlock title="R1, R2, R3" kind="config" code={`R1(config)# router ospf 1
R1(config-router)# auto-cost reference-bandwidth 10000`} explain={[
            ['auto-cost reference-bandwidth 10000', 'Referința 10 Gbps: costul Gi devine 10 (10000 / 1000). Pe toate routerele, la fel.'],
          ]} />
          <Reveal label="Răspuns (ilustrativ)">
            <p>Înainte: 192.168.30.0/24 apare ca <code>[110/2]</code> (costul Gi = 1, două legături). După: <code>[110/20]</code> (Gi = 10, două legături). Cu aceeași topologie, calea prin R3 directă pe segment rămâne aleasă; metrica reflectă doar costul nou.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={11} title="LAN-ul lui PC3 ca interfață pasivă">
          <CodeBlock title="R3" kind="config" code={`R3(config)# router ospf 1
R3(config-router)# passive-interface g0/1`} explain={[
            ['passive-interface g0/1', 'Oprește Hello-urile spre PC3, dar 192.168.30.0/24 rămâne anunțată în OSPF.'],
          ]} />
          <p>Verifică cu <code>show ip ospf interface g0/1</code> pe R3, apoi cu <code>show ip route ospf</code> pe R1. Ruta spre 192.168.30.0/24 e încă acolo?</p>
          <Reveal label="Răspuns">
            <p>Pe R3, interfața Gi0/1 apare ca pasivă (de regulă cu mesajul „No Hellos”; formularea exactă variază). Ruta <code>O 192.168.30.0/24</code> rămâne pe R1: pasivitatea nu oprește anunțarea rețelei.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 6 — Simularea unei căderi">
        <Step labKey={L} n={12} title="Oprește segmentul lui R3">
          <p>Pe R3, <code>interface g0/0</code> → <code>shutdown</code>. Pe R1 rulează <code>show ip ospf neighbor</code> și <code>show ip route ospf</code>, apoi <code>ping 192.168.30.10</code>. Ce se schimbă și de ce?</p>
          <Reveal label="Răspuns">
            <p>Vecinul 3.3.3.3 dispare de pe Gi0/0. Ruta către 192.168.30.0/24 dispare și ea, pentru că R3 e singura cale către LAN-ul lui PC3 și R3 nu mai e pe segment. Ping-ul către PC3 eșuează. Pe segment, R2 devine DR, iar R1 devine BDR (vezi <code>show ip ospf interface brief</code>).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={13} title="Revino și verifică restabilirea">
          <p>Pe R3, <code>no shutdown</code>. Așteaptă până la Full și verifică rutele, DR-ul și ping-ul către PC3.</p>
          <Reveal label="Răspuns">
            <p>Vecinii revin, R3 reintră și, pentru că alegerea DR nu e preemptivă, R2 rămâne DR până la un nou clear (comportament normal). Ping-ul către PC3 reușește din nou.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Curățare">
        <p>Dacă vrei să refaci laboratorul de la zero, șterge procesul OSPF cu <code>no router ospf 1</code> pe fiecare router și reîncarcă configurația salvată (sau setează <code>no auto-cost reference-bandwidth 10000</code>, <code>no passive-interface</code>, <code>no ip ospf network point-to-point</code> manual). Nu uita <code>copy running-config startup-config</code> dacă vrei să păstrezi configurația.</p>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't34s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 3.4-S" title="Lab solo — OSPF pe patru routere, cu DR impus și diagnostic" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi singur OSPF pe patru routere (A, B, C, D), impui un DR și un BDR anume, transformi două linkuri în point-to-point, faci un link de rezervă să fie nepreferat, verifici o cădere și, la final, diagnostichezi un vecin care nu apare. Încearcă fără să deschizi soluția; folosește <code>show</code> pentru fiecare verificare.
          <br /><b>Timp estimat:</b> 75–90 min · <b>Unealtă:</b> Cisco Packet Tracer (4 × router 2911, 1 × switch 2960, 2 × PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: A, B și C pe segmentul 172.16.0.0/24 prin SW; A–D este linkul principal, C–D este rezerva; LAN-urile A și D sunt pasive.">
        <LabSoloTopology34 />
      </Figure>
      <Table head={['Router', 'Interfață', 'IP', 'Rol']} rows={[
        ['A', 'Gi0/0', '172.16.0.1/24', 'segment comun'],
        ['A', 'Gi0/1', '192.168.50.1/24', 'LAN A (pasiv)'],
        ['A', 'Gi0/2', '10.0.4.1/30', 'link p2p către D Gi0/0'],
        ['A', 'Lo0', '10.255.0.1/32', 'RID'],
        ['B', 'Gi0/0', '172.16.0.2/24', 'segment comun'],
        ['B', 'Lo0', '10.255.0.2/32', 'RID'],
        ['C', 'Gi0/0', '172.16.0.3/24', 'segment comun'],
        ['C', 'Gi0/1', '10.0.5.1/30', 'link p2p către D Gi0/1 (rezervă)'],
        ['C', 'Lo0', '10.255.0.3/32', 'RID'],
        ['D', 'Gi0/0', '10.0.4.2/30', 'link p2p către A Gi0/2'],
        ['D', 'Gi0/1', '10.0.5.2/30', 'link p2p către C Gi0/1 (rezervă)'],
        ['D', 'Gi0/2', '192.168.60.1/24', 'LAN D (pasiv)'],
        ['D', 'Lo0', '10.255.0.4/32', 'RID'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Comenzile <b>nu au fost testate</b> de autorul lecției pe Packet Tracer. Output-urile și timpii de convergență pot diferi. Un router care a primit o prioritate după ce OSPF rulează deja păstrează DR-ul până la <code>clear ip ospf process</code>: ține cont de asta la pasul 2.
      </Callout>

      <Detailed title="Cerințe">
        <Step labKey={L} n={1} title="Adresare și loopback-uri">
          <p>Configurează adresele din tabel pe toate interfețele și loopback-urile. Verifică cu ping: B → 172.16.0.1 (A), D → 10.0.4.1 (A), D → 10.0.5.1 (C). Toate trebuie să reușească, pentru că OSPF nu e încă pornit.</p>
          <Reveal label="Soluție completă (A, B, C, D)">
            <CodeBlock title="Adresare, priorități și OSPF" kind="config" code={`A(config)# interface g0/0
A(config-if)# ip address 172.16.0.1 255.255.255.0
A(config-if)# ip ospf priority 0
A(config-if)# no shutdown
A(config-if)# interface g0/1
A(config-if)# ip address 192.168.50.1 255.255.255.0
A(config-if)# no shutdown
A(config-if)# interface g0/2
A(config-if)# ip address 10.0.4.1 255.255.255.252
A(config-if)# ip ospf network point-to-point
A(config-if)# no shutdown
A(config-if)# interface loopback 0
A(config-if)# ip address 10.255.0.1 255.255.255.255

B(config)# interface g0/0
B(config-if)# ip address 172.16.0.2 255.255.255.0
B(config-if)# ip ospf priority 200
B(config-if)# no shutdown
B(config-if)# interface loopback 0
B(config-if)# ip address 10.255.0.2 255.255.255.255

C(config)# interface g0/0
C(config-if)# ip address 172.16.0.3 255.255.255.0
C(config-if)# ip ospf priority 100
C(config-if)# no shutdown
C(config-if)# interface g0/1
C(config-if)# ip address 10.0.5.1 255.255.255.252
C(config-if)# ip ospf network point-to-point
C(config-if)# no shutdown
C(config-if)# interface loopback 0
C(config-if)# ip address 10.255.0.3 255.255.255.255

D(config)# interface g0/0
D(config-if)# ip address 10.0.4.2 255.255.255.252
D(config-if)# ip ospf network point-to-point
D(config-if)# no shutdown
D(config-if)# interface g0/1
D(config-if)# ip address 10.0.5.2 255.255.255.252
D(config-if)# ip ospf network point-to-point
D(config-if)# ip ospf cost 100
D(config-if)# no shutdown
D(config-if)# interface g0/2
D(config-if)# ip address 192.168.60.1 255.255.255.0
D(config-if)# no shutdown
D(config-if)# interface loopback 0
D(config-if)# ip address 10.255.0.4 255.255.255.255`} explain={[
              ['ip ospf priority 0 (A)', 'A nu va fi niciodată DR sau BDR pe segmentul comun.'],
              ['ip ospf priority 200 (B) / 100 (C)', 'B ar trebui să devină DR, C BDR, dacă prioritățile sunt setate înainte ca OSPF să pornească.'],
              ['ip ospf cost 100 (D g0/1)', 'Calea de rezervă spre A prin C e scumpă, deci D preferă linkul direct către A.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Ai grijă la prioritățile DR/BDR">
          <p>Prioritățile de pe segmentul <code>172.16.0.0/24</code> trebuie să fie setate înainte de pornirea OSPF pe segment, sau fă <code>clear ip ospf process</code> după ce le setezi. Notează de ce.</p>
          <Reveal label="Răspuns">
            <p>DR-ul nu se alege la fiecare modificare; odată ales, rămâne (alegerea nu e preemptivă). Dacă OSPF rulează deja și schimbi prioritățile, DR-ul vechi rămâne până la reset.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Pornește OSPF area 0 pe toate routerele">
          <p>Pe fiecare router: <code>router ospf 1</code>, RID-ul să vină din loopback (fără <code>router-id</code>), apoi <code>network</code> pentru loopback, pentru segmentul comun și pentru linkurile către D. Pe A și D adaugă și LAN-urile. Verifică <code>show ip protocols</code> pe fiecare: RID-urile să fie 10.255.0.x.</p>
          <Reveal label="Soluție (rutele de OSPF)">
            <CodeBlock title="Procesul OSPF pe fiecare router" kind="config" code={`A(config)# router ospf 1
A(config-router)# network 10.255.0.1 0.0.0.0 area 0
A(config-router)# network 172.16.0.0 0.0.0.255 area 0
A(config-router)# network 192.168.50.0 0.0.0.255 area 0
A(config-router)# network 10.0.4.0 0.0.0.3 area 0
A(config-router)# passive-interface g0/1

B(config)# router ospf 1
B(config-router)# network 10.255.0.2 0.0.0.0 area 0
B(config-router)# network 172.16.0.0 0.0.0.255 area 0

C(config)# router ospf 1
C(config-router)# network 10.255.0.3 0.0.0.0 area 0
C(config-router)# network 172.16.0.0 0.0.0.255 area 0
C(config-router)# network 10.0.5.0 0.0.0.3 area 0

D(config)# router ospf 1
D(config-router)# network 10.255.0.4 0.0.0.0 area 0
D(config-router)# network 10.0.4.0 0.0.0.3 area 0
D(config-router)# network 10.0.5.0 0.0.0.3 area 0
D(config-router)# network 192.168.60.0 0.0.0.255 area 0
D(config-router)# passive-interface g0/2`} explain={[
              ['passive-interface g0/1 (A) / g0/2 (D)', 'LAN-urile sunt anunțate, dar nu trimit Hello-uri.'],
              ['network 10.0.4.0 0.0.0.3 / 10.0.5.0 0.0.0.3', 'Wildcard /30 pentru linkurile punct-la-punct.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Verifică DR și BDR pe segmentul comun">
          <p>Pe A, B și C rulează <code>show ip ospf interface g0/0</code> (sau <code>brief</code>). Care router e DR, care BDR, care DROTHER? Ce vezi pe A și de ce?</p>
          <Reveal label="Răspuns">
            <p>B = DR (priority 200), C = BDR (priority 100), A = DROTHER (priority 0 nu candidează niciodată). A are adiacențe Full doar cu B și C, iar B și C vorbesc complet între ele.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Verifică tipurile de rețea și vecinii point-to-point">
          <p>Pe A rulează <code>show ip ospf neighbor</code>. Pe liniile A–D și C–D, rolul vecinului trebuie să fie <code>FULL/ -</code>. Confirmă și cu <code>show ip ospf interface g0/2</code> pe A (Network Type).</p>
          <Reveal label="Răspuns">
            <p>Pe A: vecinul D apare Full fără rol, Network Type POINT_TO_POINT. Pe linkurile p2p nu există DR/BDR.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Verifică ruta preferată și rezerva">
          <p>Pe D rulează <code>show ip route ospf</code>. Prin ce next hop ajunge D la 192.168.50.0/24 (LAN-ul lui A)? Care este metrica? Apoi, rulează pe D <code>show ip ospf neighbor</code> și identifică vecinii.</p>
          <Reveal label="Răspuns (ilustrativ)">
            <p>Next hop-ul trebuie să fie 10.0.4.1 (A), cu metrica mică: linkul direct are cost 1, iar pe rezerva prin C costul ar fi 100 + ce mai e pe cale. OSPF alege calea cu costul total cel mai mic, deci A.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Simulează căderea linkului principal">
          <p>Pe D: <code>interface g0/0</code>, <code>shutdown</code>. Apoi <code>show ip route ospf</code> pe D și <code>ping 192.168.50.10</code> (dacă ai PC pe LAN A). Ce next hop folosește acum D? Revii cu <code>no shutdown</code>.</p>
          <Reveal label="Răspuns">
            <p>Ruta către 192.168.50.0/24 trece pe linkul de rezervă prin C (10.0.5.1), cu metrica mai mare, pentru că linkul direct a dispărut. La <code>no shutdown</code>, D revine pe calea directă, iar cea de rezervă dispare din tabelă.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={8} title="Diagnostic: un vecin nu mai apare">
          <p><b>Context:</b> un coleg a modificat ceva pe D, pe interfața g0/1. Pe C, vecinul 10.255.0.4 nu mai apare în <code>show ip ospf neighbor</code>. Găsește cauza fără să verifici direct configurația lui D.</p>
          <CodeBlock title="Pregătire (aplică pe D, g0/1, înainte de a diagnostica)" kind="config" code={`D(config)# interface g0/1
D(config-if)# ip ospf hello-interval 5`} explain={[
            ['ip ospf hello-interval 5', 'Hello la 5 s pe D, dar 10 s pe C: timerele nu se potrivesc.'],
          ]} />
          <p>Compară <code>show ip ospf interface g0/1</code> pe C și pe D. Ce timere vezi? Repară pe D, apoi confirmă că adiacența revine.</p>
          <Reveal label="Răspuns și reparație">
            <p>Pe C, Hello = 10 s; pe D, Hello = 5 s. Hello și Dead trebuie să fie identice la ambii vecini, deci adiacența nu se formează. Reparație pe D: <code>no ip ospf hello-interval</code> pe g0/1, revenind la 10 s. Verifică pe C că D apare din nou Full (fără rol, pe p2p).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={9} title="Verificare finală și cerință de sinteză">
          <p>Completează, pentru fiecare router, RID-ul, rolul pe segmentul comun și numărul de vecini Full. Apoi confirmă: B = DR, C = BDR, A = DROTHER, D ajunge la LAN-ul lui A prin linkul direct, iar LAN-urile A și D sunt anunțate, dar pasive.</p>
          <Reveal label="Răspuns așteptat">
            <Table head={['Router', 'RID', 'Rol pe 172.16.0.0/24', 'Vecini Full (aproximativ)']} rows={[
              ['A', '10.255.0.1', 'DROTHER', '3 (B, C pe segment; D p2p)'],
              ['B', '10.255.0.2', 'DR', '2 (A, C)'],
              ['C', '10.255.0.3', 'BDR', '3 (A, B pe segment; D p2p)'],
              ['D', '10.255.0.4', 'fără DR (ambele linkuri p2p)', '2 (A, C)'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Ce ai exersat">
        <p>Ai configurat OSPF cu wildcard-uri și area 0, ai impus DR și BDR prin priorități, ai schimbat tipul de rețea pe linkuri punct-la-punct, ai controlat preferința cu costul și ai diagnosticat un vecin pierdut după timere. Acestea acoperă obiectivele 3.4.a–d în forma pe care o cere examenul.</p>
      </Detailed>
    </section>
  );
}
