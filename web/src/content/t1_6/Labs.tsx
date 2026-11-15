import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { Lab16GuidedTopology, Lab16SoloTopology } from '../../diagrams/t1_6';

/** În pașii de lab, blocurile late (cod, tabele) nu trebuie să lărgească grila .lab-step pe mobil. */
const Fit = ({ children }: { children: ReactNode }) => <div style={{ width: 0, minWidth: '100%' }}>{children}</div>;

const R1_CFG = `enable
configure terminal
hostname R1
no ip domain-lookup
interface GigabitEthernet0/0
 description LAN-A 192.168.10.0/26
 ip address 192.168.10.1 255.255.255.192
 no shutdown
interface GigabitEthernet0/1
 description LAN-B 192.168.10.64/27
 ip address 192.168.10.65 255.255.255.224
 no shutdown
interface GigabitEthernet0/2
 description WAN spre R2 192.168.10.112/30
 ip address 192.168.10.113 255.255.255.252
 no shutdown
exit
ip route 192.168.10.96 255.255.255.240 192.168.10.114
end
copy running-config startup-config`;

const R2_CFG = `enable
configure terminal
hostname R2
no ip domain-lookup
interface GigabitEthernet0/0
 description LAN-C 192.168.10.96/28
 ip address 192.168.10.97 255.255.255.240
 no shutdown
interface GigabitEthernet0/1
 description WAN spre R1 192.168.10.112/30
 ip address 192.168.10.114 255.255.255.252
 no shutdown
exit
ip route 0.0.0.0 0.0.0.0 192.168.10.113
end
copy running-config startup-config`;

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't16g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.6-G" title="Lab ghidat — adresează o rețea VLSM cu două routere (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> implementezi planul VLSM din lecție (192.168.10.0/24 pentru 60/28/12 gazde + o legătură WAN /30), configurezi interfețele a două routere și PC-urile, verifici cu <code>show ip interface brief</code>, <code>show ip route connected</code> și <code>ping</code>, apoi provoci intenționat erorile IOS clasice.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat: R1 deservește LAN-A și LAN-B, R2 deservește LAN-C; routerele sunt legate printr-un /30.">
        <Lab16GuidedTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Mască', 'Gateway', 'Subrețea']} rows={[
        ['R1', 'G0/0', '192.168.10.1', '255.255.255.192', '—', 'LAN-A 192.168.10.0/26'],
        ['R1', 'G0/1', '192.168.10.65', '255.255.255.224', '—', 'LAN-B 192.168.10.64/27'],
        ['R1', 'G0/2', '192.168.10.113', '255.255.255.252', '—', 'WAN 192.168.10.112/30'],
        ['R2', 'G0/1', '192.168.10.114', '255.255.255.252', '—', 'WAN 192.168.10.112/30'],
        ['R2', 'G0/0', '192.168.10.97', '255.255.255.240', '—', 'LAN-C 192.168.10.96/28'],
        ['PC-A1', 'Fa0', '192.168.10.10', '255.255.255.192', '192.168.10.1', 'LAN-A'],
        ['PC-A2', 'Fa0', '192.168.10.11', '255.255.255.192', '192.168.10.1', 'LAN-A'],
        ['PC-B1', 'Fa0', '192.168.10.70', '255.255.255.224', '192.168.10.65', 'LAN-B'],
        ['PC-C1', 'Fa0', '192.168.10.100', '255.255.255.240', '192.168.10.97', 'LAN-C'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu (+ GNS3/CML)">
        Packet Tracer acceptă toate comenzile IOS din acest lab (<code>ip address … secondary</code>, <code>show ip interface brief</code>, <code>show ip route connected</code>, <code>ping</code>). PC-urile din PT au un „Command Prompt” simplificat (<code>ipconfig</code>, <code>ping</code>, <code>tracert</code>, <code>arp -a</code>) — nu e un Windows real. Același lab merge identic în <b>GNS3, EVE-NG sau CML</b> cu imagini IOSv/IOSvL2: interfețele se numesc de obicei <code>GigabitEthernet0/0…0/3</code>, iar PC-urile pot fi VPCS (<code>ip 192.168.10.10/26 192.168.10.1</code>) sau mici VM-uri Linux. Mesajele de eroare pot avea formulări ușor diferite între PT și IOS real.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Verifică planul pe hârtie (înainte de orice click)">
          <p>Pentru fiecare subrețea din tabel calculează singur rețeaua, broadcast-ul și intervalul de gazde. Apoi verifică-te.</p>
          <Reveal label="Verificare plan">
            <Fit><Table head={['Subrețea', 'Rețea', 'Gazde', 'Broadcast']} rows={[
              ['LAN-A /26', '192.168.10.0', '.1 – .62', '.63'], ['LAN-B /27', '192.168.10.64', '.65 – .94', '.95'],
              ['LAN-C /28', '192.168.10.96', '.97 – .110', '.111'], ['WAN /30', '192.168.10.112', '.113 – .114', '.115'],
            ]} /></Fit>
            <p className="small">Toate adresele din tabelul de adresare sunt gazde valide în subrețeaua lor, iar fiecare gateway este în aceeași subrețea cu PC-ul lui.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Plasează dispozitivele și cablează">
          <p><P>Network Devices → Routers → 2911</P> × 2 (R1, R2), <P>Switches → 2960</P> × 3 (SW-A, SW-B, SW-C), <P>End Devices → PC</P> × 4.</p>
          <ul>
            <li>Router ↔ switch și switch ↔ PC: <b>Copper Straight-Through</b> (R1 G0/0 → SW-A, R1 G0/1 → SW-B, R2 G0/0 → SW-C; PC-urile pe porturi Fa0/x).</li>
            <li>R1 G0/2 ↔ R2 G0/1: <b>Copper Cross-Over</b> (dispozitive de același tip). Packet Tracer poate alege singur cablul cu „Automatic”.</li>
          </ul>
          <Reveal label="De ce sunt punctele de legătură roșii?"><p>Interfețele routerelor sunt <b>shutdown</b> implicit. Vor deveni verzi după <code>no shutdown</code>. Porturile switch-urilor 2960 sunt active implicit (după ~30 s de STP devin verzi).</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Configurează interfețele lui R1">
          <p>Click pe R1 → tab <P>CLI</P> → răspunde <code>no</code> la „initial configuration dialog”.</p>
          <Fit><CodeBlock title="R1" kind="session" code={`Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# no ip domain-lookup
R1(config)# interface g0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.192
R1(config-if)# no shutdown
R1(config-if)# interface g0/1
R1(config-if)# ip address 192.168.10.65 255.255.255.224
R1(config-if)# no shutdown
R1(config-if)# interface g0/2
R1(config-if)# ip address 192.168.10.113 255.255.255.252
R1(config-if)# no shutdown
R1(config-if)# end`} explain={[
            ['no ip domain-lookup', 'Oprește încercarea de a traduce prin DNS o comandă greșită (altfel aștepți zeci de secunde la fiecare typo).'],
            ['interface g0/1', 'Din config-if poți sări direct în altă interfață, fără exit.'],
            ['ip address … / no shutdown', 'Adresa + masca zecimală, apoi pornirea interfeței.'],
          ]} /></Fit>
          <p>După fiecare <code>no shutdown</code> vei vedea mesaje de tip <code>%LINK-5-CHANGED: Interface GigabitEthernet0/0, changed state to up</code>.</p>
        </Step>
        <Step labKey={L} n={4} title="Configurează interfețele lui R2">
          <Fit><CodeBlock title="R2" kind="session" code={`Router(config)# hostname R2
R2(config)# no ip domain-lookup
R2(config)# interface g0/0
R2(config-if)# ip address 192.168.10.97 255.255.255.240
R2(config-if)# no shutdown
R2(config-if)# interface g0/1
R2(config-if)# ip address 192.168.10.114 255.255.255.252
R2(config-if)# no shutdown
R2(config-if)# end`} /></Fit>
        </Step>
        <Step labKey={L} n={5} title="Configurează PC-urile">
          <p>Pe fiecare PC: <P>Desktop → IP Configuration → Static</P> și completează IPv4 Address, Subnet Mask și Default Gateway din tabelul de adresare.</p>
          <Reveal label="Întrebare: ce mască pui pe PC-B1 și de ce?"><p>255.255.255.224 — aceeași ca interfața G0/1 a lui R1. Masca gazdei trebuie să descrie aceeași subrețea ca a gateway-ului; altfel PC-ul ar trage concluzii greșite despre ce e „local”.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Verifică interfețele și rutele conectate">
          <Fit><CodeBlock title="R1" kind="session" code={`R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.10.1    YES manual up                    up
GigabitEthernet0/1     192.168.10.65   YES manual up                    up
GigabitEthernet0/2     192.168.10.113  YES manual up                    up
Vlan1                  unassigned      YES unset  administratively down down
R1# show ip route connected
      192.168.10.0/24 is variably subnetted, 6 subnets, 4 masks
C        192.168.10.0/26 is directly connected, GigabitEthernet0/0
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0
C        192.168.10.64/27 is directly connected, GigabitEthernet0/1
L        192.168.10.65/32 is directly connected, GigabitEthernet0/1
C        192.168.10.112/30 is directly connected, GigabitEthernet0/2
L        192.168.10.113/32 is directly connected, GigabitEthernet0/2`} explain={[
            ['up / up', 'Toate cele trei interfețe funcționează. Dacă vezi down/down, verifică cablul și dacă switch-ul/vecinul e pornit.'],
            ['C și L', 'Câte o pereche pentru fiecare interfață configurată. „4 masks” = /26, /27, /30 și /32 (rutele L).'],
          ]} /></Fit>
          <Reveal label="Întrebare: de ce R1 NU are o rută către 192.168.10.96/28?"><p>Pentru că LAN-C nu e conectat direct la R1. Un router cunoaște automat doar subrețelele propriilor interfețe. Pentru rețele aflate în spatele altui router e nevoie de rute statice sau de un protocol de rutare (topicul 3.x). Vei vedea efectul la pasul următor.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Testează conectivitatea (și observă ce NU merge încă)">
          <Fit><CodeBlock title="PC-A1 — Command Prompt" kind="session" code={`C:\\> ipconfig
   IPv4 Address......................: 192.168.10.10
   Subnet Mask.......................: 255.255.255.192
   Default Gateway...................: 192.168.10.1
C:\\> ping 192.168.10.1
Reply from 192.168.10.1: bytes=32 time<1ms TTL=255
C:\\> ping 192.168.10.70
Reply from 192.168.10.70: bytes=32 time<1ms TTL=127
C:\\> ping 192.168.10.100
Request timed out.`} explain={[
            ['ping 192.168.10.1', 'Gateway-ul răspunde → IP, mască și cablu OK în LAN-A.'],
            ['ping 192.168.10.70', 'PC-B1 e în altă subrețea, dar tot pe R1 → routerul îl cunoaște (rută C). TTL-ul scăzut cu 1 arată că pachetul a trecut printr-un router.'],
            ['ping 192.168.10.100', 'R1 nu are rută spre 192.168.10.96/28, iar R2 nu are rută înapoi spre LAN-A. Doar rutele conectate nu ajung.'],
          ]} /></Fit>
        </Step>
        <Step labKey={L} n={8} title="Bonus (preview 3.3): două rute statice ca totul să meargă">
          <p>Încă nu e materia acestui topic, dar îți arată de ce contează planul de adresare: rutele statice se scriu exact cu rețelele și măștile calculate de tine.</p>
          <Fit><CodeBlock title="R1 și R2" kind="session" code={`R1(config)# ip route 192.168.10.96 255.255.255.240 192.168.10.114
R2(config)# ip route 0.0.0.0 0.0.0.0 192.168.10.113`} explain={[
            ['ip route 192.168.10.96 …', 'R1: „pentru LAN-C, trimite la R2 (.114)”. Rețeaua și masca vin direct din tabelul VLSM.'],
            ['ip route 0.0.0.0 0.0.0.0 …', 'R2: rută implicită (/0) spre R1 — R2 e o „frunză”, totul în afară de LAN-C e spre R1.'],
          ]} /></Fit>
          <p>Reia <code>ping 192.168.10.100</code> de pe PC-A1: acum trebuie să meargă. Încearcă și <code>tracert 192.168.10.100</code>: vei vedea .1, apoi .114, apoi destinația.</p>
        </Step>
        <Step labKey={L} n={9} title="Provoacă erorile (break & fix)">
          <ol>
            <li>Pe R1, <code>interface g0/1</code> → <code>ip address 192.168.10.30 255.255.255.192</code>. Citește mesajul („overlaps with GigabitEthernet0/0”). Nu se aplică nimic — verifică cu <code>show ip interface brief</code>.</li>
            <li>Pe R1 G0/1: <code>ip address 192.168.10.64 255.255.255.224</code> → „Bad mask /27 for address…” (adresa de rețea). Încearcă și cu .95.</li>
            <li>Pe R2: <code>interface g0/0</code> → <code>shutdown</code>. Uită-te la <code>show ip interface brief</code> (administratively down) și la <code>show ip route connected</code> (rutele C/L pentru .96/28 au dispărut). Repară cu <code>no shutdown</code>.</li>
            <li>Pe PC-B1 schimbă gateway-ul în <code>192.168.10.62</code>. Ping la .65 merge? Dar la .10? Explică de ce, apoi repară.</li>
            <li>Pe R1 G0/1 adaugă <code>ip address 192.168.10.129 255.255.255.192 secondary</code>, apoi <code>show ip interface g0/1</code> și <code>show ip route connected</code>: apare încă o pereche C/L. Șterge-o cu <code>no ip address 192.168.10.129 255.255.255.192 secondary</code>.</li>
          </ol>
          <Reveal label="Răspuns la 4 (gateway greșit)"><p>Ping la .65 merge: .65 e în aceeași subrețea, PC-ul trimite direct, fără gateway. Ping la .10 (altă subrețea) eșuează: PC-ul vrea să trimită la gateway-ul .62, dar .62 nu e în 192.168.10.64/27 — PC-ul nici nu îl poate găsi prin ARP. Gateway-ul trebuie să fie .65.</p></Reveal>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — configurațiile finale">
        <div className="grid c2">
          <CodeBlock title="R1" code={R1_CFG} />
          <CodeBlock title="R2" code={R2_CFG} />
        </div>
        <p className="small">PC-uri: conform tabelului de adresare (static). Switch-urile 2960 nu au nevoie de configurare pentru acest lab.</p>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.6-S" title="Lab solo — proiectează singur planul VLSM (HQ + Branch)" />
      <Summary>
        <p><b>Scenariu:</b> firma ta a primit blocul <code>172.20.0.0/22</code>. Proiectezi planul de adresare, îl implementezi în Packet Tracer și îl verifici. De data asta primești <b>doar cerințele</b> — tabelul de adresare îl faci tu.
          <br /><b>Timp estimat:</b> 60–90 min · <b>Nivel:</b> începător-mediu</p>
      </Summary>
      <Figure caption="Topologia țintă (construiește-o în Packet Tracer cu două 2911, trei 2960 și câte un PC în fiecare LAN).">
        <Lab16SoloTopology />
      </Figure>
      <Detailed title="Cerințe">
        <ol>
          <li><b>Subrețele:</b> SALES — 200 de gazde (HQ G0/0); ENG — 100 de gazde (HQ G0/1); BR-LAN — 50 de gazde (BRANCH G0/0); o legătură WAN HQ G0/2 ↔ BRANCH G0/1.</li>
          <li>Folosește <b>VLSM</b> cu cele mai mici subrețele care acoperă cerințele, alocate <b>contiguu de la 172.20.0.0</b>, cele mai mari primele. WAN-ul: /30.</li>
          <li>Ultimul /24 al blocului (<code>172.20.3.0/24</code>) e rezervat pentru loopback-uri: <b>Loopback0</b> pe HQ = prima adresă, pe BRANCH = a doua, ambele /32.</li>
          <li>Routerul primește <b>prima</b> adresă utilizabilă din fiecare LAN; PC-ul din fiecare LAN primește <b>ultima</b> adresă utilizabilă.</li>
          <li>Configurează toate interfețele (cu <code>description</code>), PC-urile și salvează configurațiile.</li>
          <li>Ca totul să comunice, adaugă rute statice (preview 3.3): pe HQ spre BR-LAN și spre loopback-ul BRANCH; pe BRANCH o rută implicită spre HQ.</li>
          <li><b>Verificare:</b> <code>show ip interface brief</code> și <code>show ip route connected</code> pe ambele routere; PC-ul din SALES face ping la PC-ul din BR-LAN și la Loopback0 al lui BRANCH.</li>
          <li><b>Întrebări de răspuns în notițe:</b> (a) câte adrese rămân libere în blocul /22 (fără 172.20.3.0/24)? (b) ce rută ar anunța firma ISP-ului pentru tot blocul? (c) SALES crește la 300 de gazde — refă planul. (d) ce ai câștiga cu /31 pe WAN?</li>
        </ol>
        <Callout kind="tip" title="Indicii (deschide doar dacă te blochezi)">
          <Reveal label="Indiciul 1 — ce prefix pentru 200 / 100 / 50 de gazde"><p>Cel mai mic h cu 2^h − 2 ≥ N: 200 → h = 8, 100 → h = 7, 50 → h = 6. Prefix = 32 − h.</p></Reveal>
          <Reveal label="Indiciul 2 — unde începe fiecare subrețea"><p>Primul bloc începe la 172.20.0.0. Fiecare următor începe imediat după broadcast-ul precedentului — verifică faptul că e multiplu al mărimii lui. Poți valida cu <Link to="/subnetting">calculatorul</Link> sau cu alocatorul VLSM din lecție (bloc 172.20.0.0/22).</p></Reveal>
          <Reveal label="Indiciul 3 — sintaxa rutei statice"><p><code>ip route &lt;rețea&gt; &lt;mască&gt; &lt;next-hop&gt;</code>; ruta implicită: <code>ip route 0.0.0.0 0.0.0.0 &lt;next-hop&gt;</code>.</p></Reveal>
        </Callout>
      </Detailed>
      <Reveal label="Soluție completă (plan, tabel de adresare, configurații, răspunsuri)">
        <h4>Planul VLSM</h4>
        <Table head={['Subrețea', 'Gazde', 'Prefix', 'Rețea', 'Interval gazde', 'Broadcast']} hlCol={3} rows={[
          ['SALES', '200', '/24 (254)', '172.20.0.0', '172.20.0.1 – 172.20.0.254', '172.20.0.255'],
          ['ENG', '100', '/25 (126)', '172.20.1.0', '172.20.1.1 – 172.20.1.126', '172.20.1.127'],
          ['BR-LAN', '50', '/26 (62)', '172.20.1.128', '172.20.1.129 – 172.20.1.190', '172.20.1.191'],
          ['WAN', '2', '/30 (2)', '172.20.1.192', '172.20.1.193 – 172.20.1.194', '172.20.1.195'],
          ['liber', '—', '—', '172.20.1.196 – 172.20.2.255', '316 adrese', '—'],
          ['loopback-uri', '—', '/32', '172.20.3.1 (HQ), 172.20.3.2 (BRANCH)', '—', '—'],
        ]} />
        <h4>Tabel de adresare</h4>
        <Table head={['Dispozitiv', 'Interfață', 'Adresă / mască', 'Gateway']} rows={[
          ['HQ', 'G0/0', '172.20.0.1 255.255.255.0', '—'],
          ['HQ', 'G0/1', '172.20.1.1 255.255.255.128', '—'],
          ['HQ', 'G0/2', '172.20.1.193 255.255.255.252', '—'],
          ['HQ', 'Loopback0', '172.20.3.1 255.255.255.255', '—'],
          ['BRANCH', 'G0/1', '172.20.1.194 255.255.255.252', '—'],
          ['BRANCH', 'G0/0', '172.20.1.129 255.255.255.192', '—'],
          ['BRANCH', 'Loopback0', '172.20.3.2 255.255.255.255', '—'],
          ['PC-S', 'Fa0', '172.20.0.254 255.255.255.0', '172.20.0.1'],
          ['PC-E', 'Fa0', '172.20.1.126 255.255.255.128', '172.20.1.1'],
          ['PC-BR', 'Fa0', '172.20.1.190 255.255.255.192', '172.20.1.129'],
        ]} />
        <div className="grid c2">
          <CodeBlock title="HQ" code={`hostname HQ
no ip domain-lookup
interface GigabitEthernet0/0
 description SALES 172.20.0.0/24
 ip address 172.20.0.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/1
 description ENG 172.20.1.0/25
 ip address 172.20.1.1 255.255.255.128
 no shutdown
interface GigabitEthernet0/2
 description WAN spre BRANCH 172.20.1.192/30
 ip address 172.20.1.193 255.255.255.252
 no shutdown
interface Loopback0
 ip address 172.20.3.1 255.255.255.255
exit
ip route 172.20.1.128 255.255.255.192 172.20.1.194
ip route 172.20.3.2 255.255.255.255 172.20.1.194
end
copy running-config startup-config`} />
          <CodeBlock title="BRANCH" code={`hostname BRANCH
no ip domain-lookup
interface GigabitEthernet0/0
 description BR-LAN 172.20.1.128/26
 ip address 172.20.1.129 255.255.255.192
 no shutdown
interface GigabitEthernet0/1
 description WAN spre HQ 172.20.1.192/30
 ip address 172.20.1.194 255.255.255.252
 no shutdown
interface Loopback0
 ip address 172.20.3.2 255.255.255.255
exit
ip route 0.0.0.0 0.0.0.0 172.20.1.193
end
copy running-config startup-config`} />
        </div>
        <CodeBlock title="Verificare așteptată pe HQ (ilustrativ)" kind="session" code={`HQ# show ip route connected
      172.20.0.0/16 is variably subnetted, 7 subnets, 4 masks
C        172.20.0.0/24 is directly connected, GigabitEthernet0/0
L        172.20.0.1/32 is directly connected, GigabitEthernet0/0
C        172.20.1.0/25 is directly connected, GigabitEthernet0/1
L        172.20.1.1/32 is directly connected, GigabitEthernet0/1
C        172.20.1.192/30 is directly connected, GigabitEthernet0/2
L        172.20.1.193/32 is directly connected, GigabitEthernet0/2
C        172.20.3.1/32 is directly connected, Loopback0`} />
        <h4>Răspunsuri la întrebări</h4>
        <ul>
          <li><b>(a)</b> Liber: 172.20.1.196 – 172.20.2.255 = 60 + 256 = <b>316 adrese</b>, contigue (cel mai mare bloc aliniat din ele: 172.20.2.0/24).</li>
          <li><b>(b)</b> <b>172.20.0.0/22</b> — un singur rând pentru tot site-ul (sumarizare, posibilă tocmai pentru că planul e contiguu).</li>
          <li><b>(c)</b> 300 de gazde cer /23 (510). Planul nou: SALES 172.20.0.0/23, ENG 172.20.2.0/25, BR-LAN 172.20.2.128/26, WAN 172.20.2.192/30; loopback-urile rămân în 172.20.3.0/24. Concluzie: lasă loc de creștere când proiectezi — renumerotarea afectează gateway-uri, DHCP, rute și ACL-uri.</li>
          <li><b>(d)</b> Cu /31 (172.20.1.192/31: .192 și .193 ambele gazde, RFC 3021) WAN-ul consumă 2 adrese în loc de 4.</li>
        </ul>
        <Callout kind="exam" title="Legătură cu examenul">
          Acest lab acoperă tot ce cere 1.6: calculul subrețelelor (VLSM), configurarea (<code>ip address</code>, <code>no shutdown</code>) și verificarea (<code>show ip interface brief</code>, <code>show ip route</code> cu C/L, <code>ping</code>). Rutele statice sunt un preview pentru 3.3; <G id="vlsm" /> + sumarizarea revin la OSPF (3.4).
        </Callout>
      </Reveal>
    </section>
  );
}
