import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { VboxModes, VrfLabTopology, VrfSoloTopology } from '../../diagrams/t1_12';

const CE_A = `CE-A> enable
CE-A# configure terminal
CE-A(config)# hostname CE-A
CE-A(config)# interface GigabitEthernet0/0
CE-A(config-if)# ip address 192.168.1.2 255.255.255.0
CE-A(config-if)# no shutdown
CE-A(config-if)# interface Loopback0
CE-A(config-if)# ip address 10.10.10.1 255.255.255.0
CE-A(config-if)# exit
CE-A(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.1
CE-A(config)# end`;

/* ======================================================================
   LAB GHIDAT — VRF-Lite
   ====================================================================== */
export function GuidedLab() {
  const L = 't112g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.12-G" title="Lab ghidat — un router, doi clienți cu aceeași adresare (VRF-Lite, GNS3 / EVE-NG / CML)" />
      <Summary>
        <p><b>Obiectiv:</b> vezi pe propriii ochi problema („aceeași rețea pe două interfețe nu se poate”), o rezolvi cu <G id="vrf">VRF</G>-uri, observi mesajul „address removed”, compari tabelele de rutare și descoperi capcana <code>ping</code> fără <code>vrf</code>.
          <br /><b>Timp estimat:</b> 40–60 min · <b>Unealtă:</b> GNS3, EVE-NG sau Cisco CML cu 3 routere (IOSv, CSR1000v sau Catalyst 8000V) · <b>Nivel:</b> începător, după ce ai citit secțiunea VRF</p>
      </Summary>
      <Figure caption="Topologia labului: R1 (PE) conectează două CE-uri; ambele legături folosesc 192.168.1.0/24 și ambele CE-uri au Loopback0 10.10.10.1/24.">
        <VrfLabTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă / mască', 'VRF', 'Note']} rows={[
        ['R1', 'Gi0/1', '192.168.1.1 /24', 'CUST-A', 'spre CE-A'],
        ['R1', 'Gi0/2', '192.168.1.1 /24', 'CUST-B', 'spre CE-B — aceeași adresă!'],
        ['CE-A', 'Gi0/0', '192.168.1.2 /24', '—', 'rută implicită spre 192.168.1.1'],
        ['CE-A', 'Lo0', '10.10.10.1 /24', '—', 'simulează LAN-ul clientului A'],
        ['CE-B', 'Gi0/0', '192.168.1.2 /24', '—', 'identic cu CE-A'],
        ['CE-B', 'Lo0', '10.10.10.1 /24', '—', 'identic cu CE-A'],
      ]} />
      <Callout kind="info" title="Mediu și limite">
        Laburile cu VRF sunt scrise pentru <b>GNS3 / EVE-NG / CML</b>. Nu am putut confirma suportul VRF în Packet Tracer; dacă versiunea ta acceptă <code>vrf definition</code>, poți urma aceiași pași. Numele interfețelor (Gi0/0, Gi0/1…) depind de imagine — adaptează-le. Comenzile nu au fost testate de autorul lecției pe imaginile tale; dacă o comandă e respinsă, folosește <code>?</code> și sintaxa veche (<code>ip vrf</code> / <code>ip vrf forwarding</code>).
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Construiește topologia">
          <p>Trei routere: R1, CE-A, CE-B. Cabluri: CE-A Gi0/0 ↔ R1 Gi0/1; CE-B Gi0/0 ↔ R1 Gi0/2. Pornește-le și așteaptă să se încarce.</p>
        </Step>
        <Step labKey={L} n={2} title="Configurează CE-A și CE-B">
          <p>CE-B primește exact aceeași configurație (schimbi doar numele). Observă: <b>aceleași adrese</b> pe ambele.</p>
          <CodeBlock title="CE-A (CE-B identic, cu hostname CE-B)" kind="session" code={CE_A} explain={[
            ['ip address 192.168.1.2 / no shutdown', 'Adresa spre R1. Interfețele routerului sunt oprite implicit.'],
            ['interface Loopback0 / ip address 10.10.10.1', 'O interfață virtuală care simulează LAN-ul clientului — mereu „up”.'],
            ['ip route 0.0.0.0 0.0.0.0 192.168.1.1', 'Rută implicită: tot ce nu e local merge la R1 (PE).'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Mai întâi, fără VRF: vezi problema">
          <CodeBlock title="R1" kind="session" code={`R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface GigabitEthernet0/2
R1(config-if)# ip address 192.168.1.1 255.255.255.0`} explain={[
            ['prima interfață', 'Se acceptă normal.'],
            ['a doua interfață, aceeași rețea', 'IOS refuză cu un mesaj de tipul „192.168.1.0 overlaps with GigabitEthernet0/1”.'],
          ]} />
          <Reveal label="De ce refuză?"><p>Routerul are o singură tabelă de rutare. Două interfețe conectate la aceeași rețea 192.168.1.0/24 ar crea două rute conectate identice — nu ar ști către care interfață să trimită. Nu există o a doua tabelă în care să pună a doua rută. Exact asta rezolvă VRF-urile.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Creează cele două VRF-uri">
          <CodeBlock title="R1" kind="session" code={`R1(config)# interface GigabitEthernet0/1
R1(config-if)# no ip address
R1(config-if)# interface GigabitEthernet0/2
R1(config-if)# no ip address
R1(config-if)# exit
R1(config)# vrf definition CUST-A
R1(config-vrf)# rd 65000:1
R1(config-vrf)# address-family ipv4
R1(config-vrf-af)# exit-address-family
R1(config-vrf)# exit
R1(config)# vrf definition CUST-B
R1(config-vrf)# rd 65000:2
R1(config-vrf)# address-family ipv4
R1(config-vrf-af)# exit-address-family
R1(config-vrf)# end
R1# show vrf`} explain={[
            ['no ip address (pe ambele)', 'Curățăm configurația anterioară.'],
            ['vrf definition CUST-A / CUST-B', 'Creează cele două VRF-uri. Numele sunt sensibile la majuscule.'],
            ['rd …', 'Route Distinguisher; la VRF-Lite recent nu e obligatoriu, dar nu strică.'],
            ['show vrf', 'Ambele VRF-uri apar, fără interfețe încă.'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="Atașează interfețele și observă mesajul">
          <p>Mai întâi pune o adresă pe Gi0/1 (ca să vezi avertismentul), apoi atașează VRF-ul:</p>
          <CodeBlock title="R1" kind="session" code={`R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# vrf forwarding CUST-A
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface GigabitEthernet0/2
R1(config-if)# vrf forwarding CUST-B
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
R1# show vrf
R1# show ip vrf interfaces`} explain={[
            ['ip address → vrf forwarding', 'La atașare, IOS afișează un mesaj că adresa a fost ștearsă („removed due to enabling VRF”).'],
            ['ip address (din nou)', 'Reintroduci adresa — acum e acceptată, deși a doua interfață are aceeași.'],
            ['show vrf / show ip vrf interfaces', 'Fiecare VRF are acum o interfață.'],
          ]} />
          <Reveal label="Întrebare: de ce nu mai spune „overlaps” a doua oară?"><p>Fiindcă cele două adrese trăiesc în tabele diferite. IOS verifică suprapunerea doar în cadrul aceluiași VRF.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Adaugă rutele către LAN-urile clienților">
          <CodeBlock title="R1" kind="session" code={`R1(config)# ip route vrf CUST-A 10.10.10.0 255.255.255.0 192.168.1.2
R1(config)# ip route vrf CUST-B 10.10.10.0 255.255.255.0 192.168.1.2
R1(config)# end`} explain={[
            ['ip route vrf CUST-A …', 'Ruta statică în tabela lui CUST-A: LAN-ul clientului A e prin CE-A.'],
            ['ip route vrf CUST-B …', 'Același prefix, în tabela lui CUST-B — fără conflict.'],
          ]} />
        </Step>
        <Step labKey={L} n={7} title="Verifică: tabelele și capcana ping">
          <CodeBlock title="R1" kind="session" code={`R1# show ip route
R1# show ip route vrf CUST-A
R1# show ip route vrf CUST-B
R1# ping 192.168.1.2
R1# ping vrf CUST-A 192.168.1.2
R1# ping vrf CUST-B 10.10.10.1
R1# traceroute vrf CUST-A 10.10.10.1`} explain={[
            ['show ip route', 'Tabela globală — goală de rutele clienților.'],
            ['show ip route vrf CUST-A / CUST-B', 'Fiecare conține 192.168.1.0/24 (C), 192.168.1.1/32 (L) și 10.10.10.0/24 (S).'],
            ['ping 192.168.1.2', 'Eșuează (0/5): se uită în tabela globală.'],
            ['ping vrf CUST-A 192.168.1.2', 'Reușește.'],
            ['ping vrf CUST-B 10.10.10.1', 'Reușește — ajunge la loopback-ul lui CE-B, nu al lui CE-A.'],
          ]} />
          <Reveal label="Ce ar trebui să vezi?"><p>Două tabele cu aceleași prefixe, dar independente; <code>ping</code> simplu eșuează, <code>ping vrf …</code> reușește. Dacă pingul către 10.10.10.1 din CUST-A reușește, iar loopback-ul din CE-A are aceeași adresă ca cel din CE-B, cum știi că a răspuns CE-A? Verifică dezactivând Lo0 pe CE-B (<code>shutdown</code>): <code>ping vrf CUST-A</code> continuă să meargă, <code>ping vrf CUST-B</code> pică.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Dovedește izolarea">
          <p>Din CE-A încearcă să ajungi la LAN-ul lui CE-B: nu există nicio cale — CE-A nu știe nimic despre CE-B.</p>
          <CodeBlock title="CE-A" kind="session" code={`CE-A# ping 192.168.1.1
CE-A# show ip route`} explain={[
            ['ping 192.168.1.1', 'Reușește: R1 (VRF CUST-A) răspunde.'],
            ['show ip route', 'Rută implicită spre 192.168.1.1 și rețelele conectate; nimic din CUST-B.'],
          ]} />
        </Step>
        <Step labKey={L} n={9} title="Strică și repară: interfață în VRF-ul greșit">
          <p>Pe R1, mută Gi0/2 în CUST-A (<code>vrf forwarding CUST-A</code>), reintrodu adresa 192.168.1.1/24 și testează.</p>
          <Reveal label="Ce observi și de ce?"><p>IOS refuză a doua adresă 192.168.1.1/24 în același VRF cu Gi0/1 („overlaps” — în CUST-A există deja rețeaua), iar CE-B nu mai are conectivitate cu VRF-ul lui. Concluzie: ce funcționa în VRF-uri separate nu funcționează în același VRF. Repară: <code>vrf forwarding CUST-B</code> și reintrodu adresa.</p></Reveal>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — configurația finală a lui R1">
        <CodeBlock title="R1 — configurația finală" kind="config" code={`vrf definition CUST-A
 rd 65000:1
 address-family ipv4
 exit-address-family
vrf definition CUST-B
 rd 65000:2
 address-family ipv4
 exit-address-family
interface GigabitEthernet0/1
 vrf forwarding CUST-A
 ip address 192.168.1.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/2
 vrf forwarding CUST-B
 ip address 192.168.1.1 255.255.255.0
 no shutdown
ip route vrf CUST-A 10.10.10.0 255.255.255.0 192.168.1.2
ip route vrf CUST-B 10.10.10.0 255.255.255.0 192.168.1.2`} />
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — VRF-Lite între două routere
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.12-S" title="Lab solo — VRF-Lite între două routere (GNS3 / EVE-NG / CML)" />
      <Summary>
        <p><b>Scenariu:</b> două companii (RED și BLUE) au sediul la R1 și sucursala la R2, iar ambele folosesc <b>aceleași rețele</b>: 192.168.10.0/24 la sediu și 192.168.20.0/24 la sucursală. Aveți un singur cablu între R1 și R2.
          <b> Sarcina ta:</b> separă companiile cu VRF-uri, transportă-le pe același cablu cu subinterfețe 802.1Q (VLAN 10 pentru RED, VLAN 20 pentru BLUE, aceeași rețea 10.0.12.0/30 pe ambele) și rulează un proces OSPF per VRF. LAN-urile sunt simulate cu loopback-uri.
          <br /><b>Timp estimat:</b> 45–60 min</p>
      </Summary>
      <Figure caption="Un singur cablu, două VRF-uri, două subinterfețe, aceeași legătură 10.0.12.0/30 în ambele.">
        <VrfSoloTopology />
      </Figure>
      <Table head={['Router', 'Interfață', 'VRF', 'Adresă']} rows={[
        ['R1', 'Gi0/0.10 (VLAN 10)', 'RED', '10.0.12.1 /30'],
        ['R1', 'Gi0/0.20 (VLAN 20)', 'BLUE', '10.0.12.1 /30'],
        ['R1', 'Loopback10', 'RED', '192.168.10.1 /24'],
        ['R1', 'Loopback20', 'BLUE', '192.168.10.1 /24'],
        ['R2', 'Gi0/0.10 / Gi0/0.20', 'RED / BLUE', '10.0.12.2 /30 pe ambele'],
        ['R2', 'Loopback10 / Loopback20', 'RED / BLUE', '192.168.20.1 /24 pe ambele'],
      ]} />
      <Callout kind="tip" title="Cerințe">
        1) Două VRF-uri pe ambele routere. 2) Un singur cablu, trunk cu subinterfețe. 3) OSPF per VRF (process ID 10 pentru RED, 20 pentru BLUE), area 0. 4) Loopback-urile cu <code>ip ospf network point-to-point</code>, altfel OSPF le anunță ca /32. 5) Dovedește: <code>show ip route vrf RED ospf</code> și <code>… BLUE ospf</code>, apoi un ping între loopback-uri în fiecare VRF.
      </Callout>
      <Reveal label="Indiciu — structura unei subinterfețe">
        <CodeBlock title="Model" kind="config" code={`interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 vrf forwarding RED
 ip address 10.0.12.1 255.255.255.252`} />
      </Reveal>
      <Reveal label="Soluție completă — R1">
        <CodeBlock title="R1" kind="config" code={`vrf definition RED
 address-family ipv4
 exit-address-family
vrf definition BLUE
 address-family ipv4
 exit-address-family
interface GigabitEthernet0/0
 no ip address
 no shutdown
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 vrf forwarding RED
 ip address 10.0.12.1 255.255.255.252
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 vrf forwarding BLUE
 ip address 10.0.12.1 255.255.255.252
interface Loopback10
 vrf forwarding RED
 ip address 192.168.10.1 255.255.255.0
 ip ospf network point-to-point
interface Loopback20
 vrf forwarding BLUE
 ip address 192.168.10.1 255.255.255.0
 ip ospf network point-to-point
router ospf 10 vrf RED
 network 10.0.12.0 0.0.0.3 area 0
 network 192.168.10.0 0.0.0.255 area 0
router ospf 20 vrf BLUE
 network 10.0.12.0 0.0.0.3 area 0
 network 192.168.10.0 0.0.0.255 area 0`} />
        <p><b>R2</b> este identic, cu 10.0.12.2/30 pe subinterfețe și 192.168.20.1/24 pe Loopback10 și Loopback20 (rețeaua din <code>network</code> devine 192.168.20.0).</p>
      </Reveal>
      <Reveal label="Verificare și răspunsuri">
        <CodeBlock title="R1 (ilustrativ)" kind="session" code={`R1# show ip ospf neighbor
R1# show ip route vrf RED ospf
O     192.168.20.0/24 [110/2] via 10.0.12.2, GigabitEthernet0/0.10
R1# show ip route vrf BLUE ospf
O     192.168.20.0/24 [110/2] via 10.0.12.2, GigabitEthernet0/0.20
R1# ping vrf RED 192.168.20.1 source Loopback10
R1# ping vrf BLUE 192.168.20.1 source Loopback20`} />
        <Table head={['Simptom', 'Cauză probabilă']} rows={[
          ['nicio vecinătate OSPF', 'VLAN-uri diferite pe cele două capete, subinterfață fără IP sau fără no shutdown pe Gi0/0, sau subinterfață în VRF-ul greșit'],
          ['vecinătate numai pentru unul din VRF-uri', 'procesul ospf fără vrf, sau network lipsă în procesul acelui VRF'],
          ['ruta apare în show ip route global', 'comanda ospf fără „vrf” — ruta trăiește în tabela globală'],
          ['LAN-ul apare ca /32', 'lipsește ip ospf network point-to-point pe loopback'],
          ['ping fără vrf eșuează', 'ping caută în tabela globală; folosește ping vrf'],
        ]} />
        <Callout kind="exam" title="Legătură cu examenul">Labul arată de ce VRF-Lite nu scalează (fiecare VRF = subinterfață + proces de rutare pe fiecare legătură) — de aici nevoia de MPLS L3VPN la scară de operator.</Callout>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB pe mașinile reale
   ====================================================================== */
export function RealLab() {
  const L = 't112r';
  return (
    <section id="lab-real" className="section">
      <SectionHead id="lab-real" code="LAB 1.12-R" title="Lab opțional — virtualizare reală: VirtualBox și Docker" />
      <Summary>
        <p><b>Obiectiv:</b> rulezi virtualizare adevărată: două VM-uri conectate printr-un switch virtual (VirtualBox, Type 2) și un container Docker pe Raspberry Pi sau pe un Linux, ca să vezi pe viu diferența dintre VM și container.
          <br /><b>Timp estimat:</b> 40–60 min · <b>Nevoie de:</b> VirtualBox (gratuit), un ISO Linux mic, opțional Docker pe un Linux / Raspberry Pi</p>
      </Summary>
      <Callout kind="warn" title="Rezerve">
        Pașii de mai jos modifică sistemul tău (instalări, VM-uri, containere) și nu au fost testați de autorul lecției pe configurația ta. Fă-i pe o mașină de test; pe Raspberry Pi-ul care găzduiește platforma nu folosi porturile 80/443/8080 și nu opri servicii existente.
      </Callout>
      <Figure caption="Interactiv: modurile de rețea VirtualBox. Fiecare mod este un fel de virtual switch (cu sau fără NAT/uplink).">
        <VboxModes />
      </Figure>
      <Detailed title="Partea A — VM-uri și virtual switch (VirtualBox)">
        <Step labKey={L} n={1} title="Creează două VM-uri Linux mici">
          <p>Instalează VirtualBox și creează VM1 și VM2 (de exemplu un Linux server minimal, 1 vCPU, 1 GB RAM). Notează dimensiunea fișierului de disc virtual (.vdi) pe disc — e „calculatorul” tău, fișier.</p>
        </Step>
        <Step labKey={L} n={2} title="Mod NAT (implicit)">
          <p>Cu ambele VM-uri pe NAT, din VM1: <code>ip -br a</code> (de regulă 10.0.2.15), <code>ip route</code> (gateway 10.0.2.2), <code>ping 1.1.1.1</code>. Apoi încearcă ping între VM1 și VM2.</p>
          <Reveal label="Ce observi și de ce?"><p>Internetul merge (VirtualBox face NAT, ca un mini-router), dar VM1 nu ajunge la VM2: fiecare VM are propriul NAT, deci sunt în „rețele” separate, chiar dacă au aceeași adresă 10.0.2.15.</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Mod Internal Network">
          <p>Pune placa 1 a ambelor VM-uri pe <b>Internal Network</b> cu același nume („lab-net”). Configurează IP-uri statice (de exemplu 192.168.77.1/24 și 192.168.77.2/24) și dă ping.</p>
          <Reveal label="Ce observi și de ce?"><p>Ping-ul între VM-uri merge: sunt pe același switch virtual. Nu ai Internet și nici PC-ul tău nu le vede: switch-ul n-are uplink. Verifică și <code>ip neigh</code> — vei vedea MAC-ul VM2 (prefix 08:00:27), adică o vNIC cu MAC propriu.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Mod Bridged și Host-only">
          <p>Comută VM1 pe <b>Bridged Adapter</b> (placa fizică a PC-ului): primește IP din LAN-ul tău de la routerul de acasă, cu MAC propriu. Apoi încearcă <b>Host-only</b>: PC-ul și VM-ul se văd, VM-ul nu iese în Internet.</p>
          <Reveal label="Întrebare: ce rol are placa fizică în modul Bridged?"><p>Este „uplink-ul” unui virtual switch: VM-ul apare în LAN ca un calculator separat. Exact cum uplink-ul unui host ESXi duce VM-urile în data center — la scară mică.</p></Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea B — container Docker (Linux / Raspberry Pi)">
        <Step labKey={L} n={5} title="Rulează hello-world și un server web">
          <CodeBlock title="Host Linux" kind="session" code={`$ docker run hello-world
$ docker run -d --name web -p 8088:80 nginx
$ docker ps
$ curl -I http://localhost:8088
$ docker images`} explain={[
            ['docker run hello-world', 'Descarcă imaginea (câțiva KB) și pornește containerul.'],
            ['docker run -d … -p 8088:80 nginx', 'Un server web în container; portul 8088 al hostului → 80 al containerului.'],
            ['docker images', 'Notează dimensiunea imaginii nginx: zeci/sute de MB, nu GB.'],
          ]} />
        </Step>
        <Step labKey={L} n={6} title="Compară cu VM-ul">
          <p>Completează: timpul de pornire al VM-ului (de la „Start” la prompt) față de cel al containerului (secunde); dimensiunea discului VM față de imaginea nginx; memoria folosită (<code>docker stats --no-stream</code> față de VM).</p>
          <Reveal label="Fișa de răspuns (valori orientative)"><Table head={['Criteriu', 'VM', 'Container']} rows={[
            ['Pornire', 'de ordinul zecilor de secunde–minutelor', 'sub o secundă – câteva secunde'],
            ['Dimensiune', 'GB (disc virtual)', 'MB (imagine)'],
            ['Sistem de operare', 'propriul kernel (uname -r în VM)', 'kernelul gazdei (uname -r în container = al hostului)'],
          ]} /></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Dovedește că partajează kernelul">
          <CodeBlock title="Host Linux" kind="session" code={`$ uname -r
$ docker run --rm alpine uname -r
$ docker rm -f web`} explain={[
            ['uname -r (host)', 'Versiunea kernelului gazdei.'],
            ['docker run --rm alpine uname -r', 'Rulează o comandă într-un container Alpine, apoi îl șterge (--rm). Afișează aceeași versiune — containerul nu are kernel propriu.'],
            ['docker rm -f web', 'Șterge containerul web.'],
          ]} />
          <Reveal label="De ce e important?"><p>Este demonstrația practică a propoziției-cheie de examen: <b>containerele partajează kernelul gazdei</b>, VM-urile nu. Încearcă aceeași comandă într-o VM: vei vedea alt kernel (cel al guest-ului).</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
