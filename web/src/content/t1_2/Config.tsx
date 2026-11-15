import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.2" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Topicul 1.2 este de tip <b>Describe</b>: la examen nu configurezi arhitecturi. Dar fiecare rol din arhitectură se „vede” în configurație: routerul SOHO are o interfață WAN și una LAN, uplink-ul access → distribution este un trunk, distribution-ul are SVI-uri, legăturile spre core sau spre spine sunt porturi routed.
          Mai jos sunt <b>previzualizări</b> ale unor configurații pe care le vei învăța în detaliu mai târziu, plus comenzile cu care descoperi topologia unei rețele necunoscute.</p>
      </Summary>
      <Callout kind="warn" title="Exemple ilustrative">
        Output-urile de mai jos sunt <b>exemple scrise în formatul IOS</b>, nu copiate de pe echipamente reale; numele de interfețe, timpii și platformele diferă de la un model la altul. Sintaxa comenzilor urmează ghidurile de configurare Cisco IOS/IOS-XE, dar nu a fost testată pe echipamente fizice — verifică întotdeauna cu <code>?</code>. Comenzile marcate „previzualizare” aparțin altor topicuri (indicate în paranteză): nu trebuie să le știi acum.
      </Callout>

      <Detailed title="Exemplul 1 — Descoperă topologia: CDP și LLDP">
        <p>Când preiei o rețea nedocumentată, primul pas este să desenezi topologia fizică. <G id="cdp" /> (Cisco Discovery Protocol, activ implicit pe echipamentele Cisco) îți spune, pentru fiecare port, ce echipament Cisco se află la celălalt capăt. Din răspunsurile tuturor switch-urilor reconstruiești diagrama: cine e access, cine e distribution, cine e core.</p>
        <CodeBlock title="ASW1 (access) — vecinii direcți" kind="session" code={`ASW1# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone

Device ID     Local Intrfce   Holdtme   Capability   Platform    Port ID
DSW1          Gig 0/1         158       R S I        WS-C3560-   Fas 0/1
DSW2          Gig 0/2         171       R S I        WS-C3560-   Fas 0/1
SEP0011.2233  Fas 0/5         142       H P          IP Phone    Port 1`} explain={[
          ['show cdp neighbors', 'Tabel rezumat: un rând pentru fiecare vecin Cisco conectat direct.'],
          ['Device ID', 'Numele (hostname) vecinului. Două switch-uri „DSW” pe porturile de uplink → ASW1 este dual-homed la distribution.'],
          ['Local Intrfce / Port ID', 'Portul tău și portul vecinului — exact ce îți trebuie ca să desenezi legătura.'],
          ['Capability R S I', 'Vecinul poate ruta (R) și comuta (S) → un switch multilayer, tipic pentru distribution/core. Un switch de access L2 ar apărea doar cu S I.'],
          ['Platform', 'Modelul (WS-C3560 = Catalyst 3560). Telefonul IP apare și el, cu capability P.'],
        ]} />
        <CodeBlock title="Detalii și alternativa standard (LLDP)" kind="session" code={`ASW1# show cdp neighbors detail
-------------------------
Device ID: DSW1
Entry address(es):
  IP address: 10.1.99.2
Platform: cisco WS-C3560-24PS,  Capabilities: Switch Router IGMP
Interface: GigabitEthernet0/1,  Port ID (outgoing port): FastEthernet0/1
ASW1# configure terminal
ASW1(config)# lldp run
ASW1(config)# end
ASW1# show lldp neighbors`} explain={[
          ['show cdp neighbors detail', 'Adaugă adresa IP de management, versiunea software și VLAN-ul nativ — util ca să te conectezi mai departe la vecin.'],
          ['lldp run', <><G id="lldp" /> este echivalentul standard IEEE (802.1AB) al CDP, folosit în rețele cu echipamente de la mai mulți producători. Pe multe switch-uri Cisco e dezactivat implicit.</>],
          ['show lldp neighbors', 'Același tip de tabel, dar funcționează și cu switch-uri, telefoane sau AP-uri non-Cisco.'],
        ]} />
        <Callout kind="tip" title="Metoda de lucru">
          Pornește de la un switch, notează vecinii, conectează-te la fiecare vecin (adresa din <code>detail</code>) și repetă. Switch-urile care apar ca vecini ai tuturor celorlalte sunt, aproape sigur, distribution/core. Exact asta faci în labul ghidat.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 2 — Uplink-ul access → distribution (previzualizare 2.2 / 2.4)">
        <p>Uplink-urile dintre access și distribution transportă mai multe VLAN-uri, deci sunt <b>trunk-uri 802.1Q</b>. Pentru a nu pierde jumătate din bandă din cauza <G id="stp" />, două uplink-uri spre <b>același</b> switch (sau spre o pereche care se comportă ca unul singur) se pot grupa într-un <G id="etherchannel" />.</p>
        <CodeBlock title="ASW1 — două uplink-uri grupate într-un EtherChannel trunk" code={`! previzualizare: trunk (2.2) + EtherChannel LACP (2.4)
interface range GigabitEthernet1/0/49 - 50
 description UPLINK spre DSW (distribution)
 switchport mode trunk
 channel-group 1 mode active
!
interface Port-channel1
 switchport mode trunk`} explain={[
          ['interface range GigabitEthernet1/0/49 - 50', 'Configurezi simultan cele două porturi de uplink (pe Catalyst 9300 cu modul de uplink, de exemplu).'],
          ['description UPLINK spre DSW', 'Documentează rolul portului în arhitectură — o bună practică care apare în `show interfaces description`.'],
          ['switchport mode trunk', 'Uplink-ul transportă toate VLAN-urile de la access spre distribution.'],
          ['channel-group 1 mode active', 'Adaugă porturile în grupul 1 și negociază cu LACP (standard). Rezultă o singură legătură logică: STP nu mai blochează niciun membru.'],
          ['interface Port-channel1', 'Interfața logică a grupului; setările de trunk se aplică pe ea.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Distribution: granița L2/L3 (previzualizare 1.6 / 3.x)">
        <p>Pe switch-ul de distribution vezi concret de ce acest strat este „granița”: SVI-urile sunt default gateway pentru VLAN-urile de sub el (L2), iar legătura spre core este un port routed (L3).</p>
        <CodeBlock title="DSW1 — SVI pentru utilizatori + legătură routed spre core" code={`! previzualizare: rutare pe switch multilayer
ip routing
!
interface Vlan10
 description GW utilizatori etaj 1
 ip address 10.1.10.2 255.255.255.0
!
interface GigabitEthernet1/0/48
 description L3 spre CSW1 (core)
 no switchport
 ip address 10.0.0.1 255.255.255.252`} explain={[
          ['ip routing', 'Transformă switch-ul multilayer într-un router: rutează între SVI-uri și porturile routed. Implicit e dezactivat pe multe modele.'],
          ['interface Vlan10', <>Un <G id="svi" />: interfața L3 a VLAN-ului 10. PC-urile din VLAN 10 îl folosesc ca default gateway. În producție, cele două switch-uri de distribution partajează o adresă virtuală prin <G id="fhrp" /> (topicul 3.5).</>],
          ['ip address 10.1.10.2 255.255.255.0', 'Adresa acestui switch în VLAN 10 (cu FHRP, gateway-ul virtual ar putea fi .1).'],
          ['no switchport', 'Portul spre core devine port routed: nu mai aparține niciunui VLAN, nu mai participă la STP. Exact așa sunt legate și leaf-urile de spine-uri.'],
          ['ip address 10.0.0.1 255.255.255.252', 'Subrețea /30 pentru o legătură punct-la-punct: doar două adrese utilizabile, una la fiecare capăt (topicul 1.6).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — Spine-leaf: legături routed și ECMP (previzualizare 3.x)">
        <p>Pe un leaf, fiecare uplink spre un spine este un port routed. Când protocolul de rutare (de exemplu OSPF, topicul 3.4) învață aceeași rețea prin ambele spine-uri cu același cost, tabela de rutare păstrează <b>două next-hop-uri</b> — aceasta este <G id="ecmp" /> văzută în CLI.</p>
        <CodeBlock title="LEAF1 — două uplink-uri L3 (IOS-XE, de ex. Catalyst 9300/3650)" code={`ip routing
!
interface GigabitEthernet1/0/23
 description L3 spre SPINE1
 no switchport
 ip address 10.1.1.2 255.255.255.252
!
interface GigabitEthernet1/0/24
 description L3 spre SPINE2
 no switchport
 ip address 10.2.1.2 255.255.255.252`} explain={[
          ['interface GigabitEthernet1/0/23', 'Uplink-ul spre SPINE1. Fiecare leaf are câte un uplink spre fiecare spine — niciodată spre alt leaf.'],
          ['no switchport', 'Legătură L3: fără STP, fără porturi blocate.'],
          ['ip address 10.1.1.2 255.255.255.252', 'Câte o subrețea /30 pentru fiecare legătură leaf–spine (în datacentere reale se folosesc des /31, care nu irosesc adrese).'],
        ]} />
        <CodeBlock title="LEAF1 — rețeaua serverelor de pe LEAF4, învățată prin ambele spine-uri" kind="session" code={`LEAF1# show ip route 192.168.4.0
Routing entry for 192.168.4.0/24
  Known via "ospf 1", distance 110, metric 3, type intra area
  Routing Descriptor Blocks:
  * 10.1.1.1, from 4.4.4.4, via GigabitEthernet1/0/23
      Route metric is 3, traffic share count is 1
    10.2.1.1, from 4.4.4.4, via GigabitEthernet1/0/24
      Route metric is 3, traffic share count is 1`} explain={[
          ['show ip route 192.168.4.0', 'Detaliile rutei spre serverele de pe LEAF4.'],
          ['metric 3 … metric 3', 'Același cost pe ambele căi (leaf → spine → leaf este simetric).'],
          ['10.1.1.1 via Gi1/0/23 / 10.2.1.1 via Gi1/0/24', 'Două next-hop-uri (SPINE1 și SPINE2) instalate simultan: traficul e împărțit între ele. Cu 4 spine-uri ar fi 4 rânduri.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Ce risipește STP (de ce datacenterele au renunțat la el)">
        <CodeBlock title="ASW1 — o legătură perfect funcțională, dar blocată" kind="session" code={`ASW1# show spanning-tree vlan 10
VLAN0010
  Root ID    Priority    24586
             Address     0019.e8a1.0b00
...
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- -----------
Gi0/1               Root FWD 4         128.25   P2p
Gi0/2               Altn BLK 4         128.26   P2p
Fa0/5               Desg FWD 19        128.5    P2p Edge`} explain={[
          ['show spanning-tree vlan 10', <>Rolul și starea fiecărui port pentru VLAN 10 din punctul de vedere al <G id="stp" /> (topicul 2.5).</>],
          ['Gi0/1 Root FWD', 'Uplink-ul spre DSW1 (spre root bridge) transmite.'],
          ['Gi0/2 Altn BLK', 'Uplink-ul spre DSW2 este fizic OK, dar blocat pentru a evita bucla. Jumătate din capacitatea uplink-urilor stă nefolosită — exact problema pe care spine-leaf cu L3 + ECMP o elimină.'],
          ['Fa0/5 … Edge', 'Port de access spre un dispozitiv final (PortFast) — funcție tipică stratului de access.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Un router Cisco ca router SOHO (previzualizare 4.1 / 4.3)">
        <p>Toate funcțiile routerului de acasă se pot configura și pe un router Cisco mic (de exemplu ISR 1000). Scheletul de mai jos arată exact rolurile din secțiunea 1.2.e: WAN spre ISP, LAN privat, DHCP, NAT/PAT.</p>
        <CodeBlock title="R-SOHO — schelet de configurație" code={`hostname R-SOHO
!
interface GigabitEthernet0/0/0
 description WAN spre ISP
 ip address dhcp
 ip nat outside
 no shutdown
!
interface Vlan1
 description LAN casa/birou
 ip address 192.168.1.1 255.255.255.0
 ip nat inside
!
ip dhcp excluded-address 192.168.1.1 192.168.1.9
ip dhcp pool LAN
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 1.1.1.1 8.8.8.8
!
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface GigabitEthernet0/0/0 overload`} explain={[
          ['interface GigabitEthernet0/0/0', 'Portul WAN — echivalentul portului „Internet” de pe routerul de acasă.'],
          ['ip address dhcp', 'Routerul devine client DHCP al ISP-ului: primește adresă, mască și gateway; din gateway instalează automat o rută implicită.'],
          ['ip nat outside / ip nat inside', <>Marchează partea publică și partea privată pentru <G id="nat" />.</>],
          ['interface Vlan1', 'Pe modelele cu switch integrat (porturile LAN), adresa LAN stă pe SVI-ul VLAN 1 — „switch-ul cu 4 porturi” din routerul de acasă.'],
          ['ip dhcp excluded-address …', 'Adresele .1–.9 nu sunt date clienților (rezervate pentru router, imprimantă etc.).'],
          ['ip dhcp pool LAN', <>Serverul <G id="dhcp" /> intern: rețea, gateway, DNS pentru clienți (topicul 4.3).</>],
          ['access-list 1 permit 192.168.1.0 0.0.0.255', 'Definește ce adrese interne au voie să fie traduse.'],
          ['ip nat inside source list 1 interface … overload', <>PAT (<G id="pat" />): toate adresele private ies cu adresa interfeței WAN, diferențiate prin porturi (topicul 4.1).</>],
        ]} />
        <CodeBlock title="Verificare pe R-SOHO" kind="session" code={`R-SOHO# show ip interface brief
Interface              IP-Address      OK? Method Status    Protocol
GigabitEthernet0/0/0   100.64.23.17    YES DHCP   up        up
Vlan1                  192.168.1.1     YES manual up        up
R-SOHO# show ip route static | include 0.0.0.0
S*    0.0.0.0/0 [254/0] via 100.64.23.1
R-SOHO# show ip nat translations
Pro Inside global        Inside local        Outside local    Outside global
tcp 100.64.23.17:51034   192.168.1.23:51034  142.250.180.14:443 142.250.180.14:443`} explain={[
          ['show ip interface brief', 'WAN cu adresă primită prin DHCP (Method = DHCP) și LAN configurat manual.'],
          ['S* 0.0.0.0/0 [254/0]', 'Ruta implicită instalată automat din DHCP, cu distanța administrativă 254 (foarte mare, ca orice rută statică manuală să aibă prioritate).'],
          ['100.64.23.17', <>Adresă din spațiul 100.64.0.0/10 — semn că ISP-ul folosește <G id="cgnat" /> (topicul 1.7).</>],
          ['show ip nat translations', 'Tabela PAT: laptopul 192.168.1.23 iese în Internet ca 100.64.23.17, port 51034.'],
        ]} />
      </Detailed>
    </section>
  );
}
