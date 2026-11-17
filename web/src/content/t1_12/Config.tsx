import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.12" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 1.12 este de tip <b>Explain</b>, nu „Configure”. Exemplele de mai jos sunt pentru <b>înțelegere</b>: cum arată, în practică, portul switch-ului spre un host de virtualizare, un VRF pe un router Cisco, o aplicație în container și o rețea VirtualBox. Citește-le ca să recunoști comenzile și output-urile, nu ca să le memorezi.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, construite după formatele documentate, cu valori fictive; nu au fost capturate de pe echipamente reale, iar comenzile din acest topic <b>nu au fost testate</b> de autorul lecției pe echipamente. Mesajele exacte, spațierea și chiar sintaxa (în special la VRF — sintaxa veche <code>ip vrf</code> față de cea nouă <code>vrf definition</code>) diferă între versiuni de IOS / IOS-XE. Verifică în <code>?</code> pe echipamentul tău. Comenzile Docker și VirtualBox modifică sistemul tău: încearcă-le pe o mașină de test.
      </Callout>

      <Detailed title="Exemplul 1 — Switch fizic: portul spre un host de virtualizare (trunk)">
        <p>Hostul ESXi/Hyper-V/KVM are două uplink-uri; fiecare ajunge la un port al switch-ului ToR. VM-urile sunt în VLAN-urile 10, 20 și 30, deci portul trebuie să fie trunk.</p>
        <CodeBlock title="Switch ToR — port spre hypervisor" kind="config" code={`interface GigabitEthernet1/0/10
 description ESXi-01 vmnic0
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 spanning-tree portfast trunk
!
SW1# show interfaces trunk`} explain={[
          ['description …', 'Documentează la ce host și la ce placă e conectat portul — în data center sunt sute.'],
          ['switchport mode trunk', <>Portul transportă mai multe VLAN-uri cu etichete 802.1Q (<G id="trunk" />). Pe unele platforme trebuie întâi <code>switchport trunk encapsulation dot1q</code>.</>],
          ['switchport trunk allowed vlan 10,20,30', 'Doar VLAN-urile folosite de VM-uri. Dacă un VLAN al unui port group lipsește de aici, VM-urile din el nu au rețea.'],
          ['spanning-tree portfast trunk', <>Un host nu creează bucle (vSwitch-ul nu retransmite între uplink-uri) — portul poate trece imediat în forwarding. Fără el, așteptarea STP poate întârzia pornirea VM-urilor.</>],
          ['show interfaces trunk', 'Verifici că portul e trunk și ce VLAN-uri sunt permise și active.'],
        ]} />
        <CodeBlock title="show interfaces trunk (ilustrativ)" kind="session" code={`SW1# show interfaces trunk

Port        Mode         Encapsulation  Status        Native vlan
Gi1/0/10    on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gi1/0/10    10,20,30

Port        Vlans allowed and active in management domain
Gi1/0/10    10,20,30`} explain={[
          ['Mode on / 802.1q / trunking', 'Portul este trunk activ.'],
          ['Vlans allowed on trunk', 'Lista configurată; trebuie să includă VLAN-urile port group-urilor.'],
          ['allowed and active in management domain', 'VLAN-urile care există și pe switch. Dacă un VLAN e permis dar nu există în baza de date, nu apare aici.'],
        ]} />
        <Callout kind="tip" title="Dacă două uplink-uri sunt grupate">
          În funcție de modul de teaming, switch-ul poate avea nevoie de un EtherChannel (static sau LACP) sau poate lăsa porturile independente. Potrivește configurarea switch-ului cu cea din hypervisor — este o greșeală clasică de nepotrivire.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 2 — VRF-Lite pe un router Cisco (sintaxa nouă, multiprotocol)">
        <p>Scenariu: routerul R1 conectează doi clienți care folosesc aceeași rețea 192.168.1.0/24. Fiecare client primește propriul VRF.</p>
        <CodeBlock title="R1 — două VRF-uri" kind="config" code={`vrf definition CUST-A
 rd 65000:1
 address-family ipv4
 exit-address-family
!
vrf definition CUST-B
 rd 65000:2
 address-family ipv4
 exit-address-family
!
interface GigabitEthernet0/1
 vrf forwarding CUST-A
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/2
 vrf forwarding CUST-B
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
ip route vrf CUST-A 10.10.10.0 255.255.255.0 192.168.1.2
ip route vrf CUST-B 10.10.10.0 255.255.255.0 192.168.1.2`} explain={[
          ['vrf definition CUST-A', <>Creează <G id="vrf" />-ul (nume sensibil la majuscule). „definition” = sintaxa nouă; cea veche e <code>ip vrf CUST-A</code> (doar IPv4).</>],
          ['rd 65000:1', <>Route Distinguisher (<G id="rd" />). La VRF-Lite pe versiuni recente nu e obligatoriu, dar unele versiuni mai vechi îl cer înainte de address-family; îl punem ca să fie valid peste tot. Dacă VRF-ul ar trece ulterior în MPLS L3VPN, îl vei avea deja.</>],
          ['address-family ipv4 … exit-address-family', 'Activează IPv4 în VRF. Fără address-family, interfața nu primește adresă IPv4 în acest VRF (sintaxa nouă).'],
          ['vrf forwarding CUST-A', <>Mută interfața în VRF. <b>Șterge adresa IP existentă</b> — de aceea <code>ip address</code> vine <i>după</i> ea. În sintaxa veche: <code>ip vrf forwarding CUST-A</code>.</>],
          ['ip address 192.168.1.1 … (de două ori)', 'Aceeași adresă pe două interfețe diferite — posibil doar fiindcă sunt în VRF-uri diferite. În tabela globală, IOS ar refuza: „overlaps with …”.'],
          ['ip route vrf CUST-A …', 'Ruta statică trăiește în tabela VRF-ului; next-hop-ul trebuie să fie accesibil prin interfețe din același VRF.'],
        ]} />
        <CodeBlock title="Mesajul la atașarea unei interfețe care avea deja IP (ilustrativ)" kind="session" code={`R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# vrf forwarding CUST-A
% Interface GigabitEthernet0/1 IPv4 disabled and address(es) removed due to enabling VRF CUST-A
R1(config-if)# ip address 192.168.1.1 255.255.255.0`} explain={[
          ['% … removed due to enabling VRF', 'IOS te avertizează că adresa a fost ștearsă. Formularea exactă diferă: pe sintaxa veche apare „IP address … removed due to enabling VRF …”.'],
          ['ip address … (a doua oară)', 'Trebuie reintrodusă după atașare.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Verificare: show vrf, tabele per VRF, ping vrf">
        <CodeBlock title="Verificare VRF (ilustrativ)" kind="session" code={`R1# show vrf
  Name                  Default RD     Protocols   Interfaces
  CUST-A                65000:1        ipv4        Gi0/1
  CUST-B                65000:2        ipv4        Gi0/2

R1# show ip route
Gateway of last resort is not set
      (tabela globală — fără interfețele din VRF-uri)

R1# show ip route vrf CUST-A
Routing Table: CUST-A
Codes: L - local, C - connected, S - static, ...
      10.0.0.0/24 is subnetted, 1 subnets
S        10.10.10.0 [1/0] via 192.168.1.2
      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.1.0/24 is directly connected, GigabitEthernet0/1
L        192.168.1.1/32 is directly connected, GigabitEthernet0/1

R1# ping 10.10.10.1
Success rate is 0 percent (0/5)

R1# ping vrf CUST-A 10.10.10.1
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms

R1# show ip arp vrf CUST-A
Protocol  Address        Age (min)  Hardware Addr   Type   Interface
Internet  192.168.1.1            -  aabb.cc00.0100  ARPA   GigabitEthernet0/1
Internet  192.168.1.2            3  aabb.cc00.0200  ARPA   GigabitEthernet0/1`} explain={[
          ['show vrf', 'Listează VRF-urile, RD-ul și interfețele fiecăruia. Prima verificare după configurare. Echivalent: show ip vrf.'],
          ['show ip route (fără vrf)', 'Tabela globală: interfețele mutate în VRF dispar din ea. Ruta „lipsește” — de fapt e în altă tabelă.'],
          ['show ip route vrf CUST-A', 'Tabela VRF-ului: conectate (C, L) + statice. CUST-B ar arăta același prefix 192.168.1.0/24, fără conflict.'],
          ['ping 10.10.10.1 → 0 %', 'Fără cuvântul vrf, ping caută în tabela globală, unde nu există ruta. „False negative” clasic.'],
          ['ping vrf CUST-A …', 'Folosește tabela și interfețele VRF-ului — reușește.'],
          ['show ip arp vrf CUST-A', 'Fiecare VRF are propriul cache ARP.'],
        ]} />
        <Table head={['Comandă', 'Ce arată']} rows={[
          [<code>show vrf</code>, 'VRF-uri, RD, interfețe'],
          [<code>show ip route vrf NUME</code>, 'tabela de rutare a VRF-ului'],
          [<><code>ping vrf NUME x.x.x.x</code> · <code>traceroute vrf NUME x.x.x.x</code></>, 'teste în VRF'],
          [<code>show ip arp vrf NUME</code>, 'cache ARP al VRF-ului'],
          [<code>show running-config vrf NUME</code>, 'configurația legată de VRF'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — VRF-Lite între două routere: subinterfețe și OSPF per VRF">
        <p>Doi clienți (RED, BLUE) pe același cablu între R1 și R2: câte o <G id="subinterface">subinterfață</G> 802.1Q per VRF și un proces OSPF per VRF. Este exact structura labului solo.</p>
        <CodeBlock title="R1 — VRF-Lite cu trunk și OSPF per VRF" kind="config" code={`vrf definition RED
 address-family ipv4
 exit-address-family
vrf definition BLUE
 address-family ipv4
 exit-address-family
!
interface GigabitEthernet0/0
 no ip address
 no shutdown
!
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 vrf forwarding RED
 ip address 10.0.12.1 255.255.255.252
!
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 vrf forwarding BLUE
 ip address 10.0.12.1 255.255.255.252
!
router ospf 10 vrf RED
 network 10.0.12.0 0.0.0.3 area 0
 network 192.168.10.0 0.0.0.255 area 0
router ospf 20 vrf BLUE
 network 10.0.12.0 0.0.0.3 area 0
 network 192.168.10.0 0.0.0.255 area 0`} explain={[
          ['interface Gi0/0 / no ip address', 'Interfața fizică e doar „țeava” (trunk); nu poartă IP.'],
          ['encapsulation dot1Q 10', 'Subinterfața preia cadrele cu VLAN 10. VLAN-ul e doar transport între cele două routere.'],
          ['vrf forwarding RED / BLUE', 'Fiecare subinterfață aparține altui VRF; ambele folosesc 10.0.12.0/30 — posibil doar cu VRF.'],
          ['router ospf 10 vrf RED', 'Un proces OSPF separat pentru fiecare VRF. Process ID-ul are semnificație locală; vecinătatea se formează cu vecinul din același VRF.'],
          ['network … area 0', 'Anunță rețeaua legăturii și LAN-ul clientului în VRF-ul respectiv.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip route vrf RED ospf
O     192.168.20.0/24 [110/2] via 10.0.12.2, 00:02:11, GigabitEthernet0/0.10

R1# show ip route vrf BLUE ospf
O     192.168.20.0/24 [110/2] via 10.0.12.2, 00:02:09, GigabitEthernet0/0.20

R1# ping vrf RED 192.168.20.1 source 192.168.10.1
!!!!!`} explain={[
          ['show ip route vrf RED ospf', 'Rutele OSPF învățate în VRF-ul RED. Aceeași destinație apare în BLUE, pe altă subinterfață — două tabele independente.'],
          ['ping vrf RED … source …', 'Ping din VRF-ul RED, cu sursa adresa locală din același VRF.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — VRF de management (concept)">
        <CodeBlock title="Switch Catalyst — port de management în VRF (ilustrativ)" kind="session" code={`SW1# show ip vrf
  Name                  Default RD     Interfaces
  Mgmt-vrf              <not set>      Gi0/0

SW1# ping vrf Mgmt-vrf 192.0.2.1
!!!!!
SW1# ping 192.0.2.1
Success rate is 0 percent (0/5)`} explain={[
          ['Mgmt-vrf … Gi0/0', <>Portul out-of-band de management este într-un VRF separat (<G id="mgmt-vrf" />). Pe unele platforme este configurat implicit; pe altele îl creezi tu.</>],
          ['ping vrf Mgmt-vrf …', 'Testul spre rețeaua de management trebuie să numească VRF-ul.'],
          ['ping 192.0.2.1 → 0 %', 'Tabela globală nu cunoaște rețeaua de management — aceeași capcană ca mai sus. (192.0.2.0/24 este o adresă de documentație.)'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Containere cu Docker (pe Linux / Raspberry Pi)">
        <CodeBlock title="Docker — comenzi de bază" kind="session" code={`$ docker run hello-world
$ docker images
$ docker run -d --name web -p 8088:80 nginx
$ docker ps
CONTAINER ID   IMAGE   COMMAND                  STATUS         PORTS                  NAMES
3f2a1b9c8d7e   nginx   "/docker-entrypoint.…"   Up 5 seconds   0.0.0.0:8088->80/tcp   web
$ curl -I http://localhost:8088
$ docker inspect -f '{{.NetworkSettings.IPAddress}}' web
172.17.0.2
$ docker stop web && docker rm web
$ docker rmi nginx`} explain={[
          ['docker run hello-world', 'Dacă imaginea nu e local, o descarcă (pull) din registry, creează un container, rulează programul de test și iese.'],
          ['docker images', 'Imaginile locale (șabloanele).'],
          ['docker run -d --name web -p 8088:80 nginx', <>Pornește în fundal (<code>-d</code>) un container din imaginea nginx. <code>-p 8088:80</code> mapează portul 8088 al hostului pe portul 80 al containerului (<G id="port-forwarding" />). Portul 8088 e ales ca să nu intre în conflict cu alte servicii de pe aceeași mașină.</>],
          ['docker ps', 'Containerele în execuție, cu mapările de porturi. „0.0.0.0:8088->80/tcp” arată traducerea.'],
          ['curl -I http://localhost:8088', 'Testezi serviciul prin portul mapat.'],
          ['docker inspect …', <>Adresa containerului în rețeaua bridge a Docker (de regulă 172.17.0.0/16) — containerul are propria adresă IP, ca un host separat.</>],
          ['docker stop && docker rm', 'Oprește, apoi șterge containerul (imaginea rămâne).'],
          ['docker rmi nginx', 'Șterge imaginea locală.'],
        ]} />
        <Callout kind="warn" title="Pe Raspberry Pi-ul care găzduiește CCNA Learn">
          Docker e opțional și nu face parte din platformă. Dacă îl instalezi pe același Pi (de exemplu cu pachetul <code>docker.io</code> din depozitele Raspberry Pi OS / Debian), nu folosi porturile 80, 443 sau 8080 — sunt ocupate de serverul de învățare și de proxy. Nu opri și nu șterge nimic din ce nu ai pornit tu.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 7 — Virtual switch și VM-uri pe laptop (VirtualBox, Linux bridge)">
        <CodeBlock title="VirtualBox — VBoxManage (Windows / macOS / Linux)" kind="session" code={`$ VBoxManage list vms
$ VBoxManage modifyvm "VM1" --nic1 intnet --intnet1 "lab-net"
$ VBoxManage modifyvm "VM2" --nic1 intnet --intnet1 "lab-net"
$ VBoxManage modifyvm "VM1" --nic2 hostonly --hostonlyadapter2 vboxnet0
$ VBoxManage showvminfo "VM1" | grep NIC`} explain={[
          ['list vms', 'VM-urile existente.'],
          ['--nic1 intnet --intnet1 "lab-net"', <>Placa 1 a ambelor VM-uri intră în aceeași rețea internă „lab-net” — un <G id="vswitch" /> izolat, doar între VM-uri. Adresele IP se setează manual în VM.</>],
          ['--nic2 hostonly …', 'A doua placă merge pe un switch privat care include și PC-ul (host-only), ca să poți face SSH din PC în VM.'],
          ['showvminfo | grep NIC', 'Verifici modul fiecărei plăci. Alte moduri: nat (implicit), bridged, natnetwork.'],
        ]} />
        <CodeBlock title="Linux — bridge software (concept: un vSwitch minimal)" kind="session" code={`$ sudo ip link add name br-lab type bridge
$ sudo ip link set br-lab up
$ ip -br link show type bridge
$ bridge link
$ sudo ip link del br-lab`} explain={[
          ['ip link add … type bridge', 'Creează un switch software (bridge) în kernel — baza pe care KVM și Docker o folosesc pentru vSwitch.'],
          ['ip link set br-lab up', 'Activează bridge-ul.'],
          ['ip -br link show type bridge', 'Îl listează pe scurt.'],
          ['bridge link', 'Arată porturile atașate (interfețe virtuale ale VM-urilor/containerelor).'],
          ['ip link del br-lab', 'Îl șterge la final.'],
        ]} />
      </Detailed>
    </section>
  );
}
