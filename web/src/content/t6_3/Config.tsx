import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="6.3" title="Exemple: un overlay GRE peste un underlay OSPF și interfețe programatice (NETCONF/RESTCONF)" />
      <Summary>
        <p>Nu poți construi un fabric SD-Access în laborator, dar poți construi <b>în miniatură</b> aceleași concepte: un <b>underlay</b> rutat cu OSPF între R1–R4, un <b>overlay</b> (tunel GRE) între R1 și R4 și rute care trimit LAN-urile prin tunel. Apoi vezi cum se activează interfețele <b>southbound</b> programatice (NETCONF/RESTCONF) pe IOS XE.</p>
      </Summary>
      <Callout kind="warn" title="Comenzi și output-uri ilustrative, netestate">
        Exemplele sunt <b>ilustrative</b> și <b>nu au fost testate</b> de autorul lecției pe echipamente reale; formatul output-urilor variază cu versiunea. GRE (<code>interface tunnel</code>) este disponibil în Packet Tracer, dar suportul pentru unele comenzi poate diferi; <code>netconf-yang</code>/<code>restconf</code> nu există în Packet Tracer. VXLAN nu se configurează în acest lab.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Echipament', 'Interfață', 'Adresă', 'Rol']} rows={[
          ['R1', 'Gi0/0', '192.168.1.1/24', 'LAN A (overlay)'],
          ['R1', 'Gi0/1', '10.0.12.1/30', 'Underlay către R2'],
          ['R1', 'Loopback0', '1.1.1.1/32', 'Sursa tunelului (underlay)'],
          ['R1', 'Tunnel0', '10.255.0.1/30', 'Overlay către R4'],
          ['R4', 'Gi0/1', '192.168.2.1/24', 'LAN B (overlay)'],
          ['R4', 'Gi0/0', '10.0.34.2/30', 'Underlay către R3'],
          ['R4', 'Loopback0', '4.4.4.4/32', 'Destinația tunelului'],
          ['R4', 'Tunnel0', '10.255.0.2/30', 'Overlay către R1'],
          ['R2, R3', '—', '10.0.12.0/30, 10.0.23.0/30, 10.0.34.0/30', 'Underlay (nu cunosc 192.168.x.x)'],
        ]} />
      </Detailed>

      <Detailed title="2. Underlay: OSPF între routere (R1; R4 e simetric)">
        <CodeBlock title="R1 — underlay (ilustrativ)" kind="config" code={`R1(config)# interface loopback 0
R1(config-if)# ip address 1.1.1.1 255.255.255.255
R1(config-if)# interface gigabitethernet 0/1
R1(config-if)# ip address 10.0.12.1 255.255.255.252
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 10.0.12.0 0.0.0.3 area 0
R1(config-router)# network 1.1.1.1 0.0.0.0 area 0`} explain={[
          ['interface loopback 0 / ip address 1.1.1.1 /32', 'O adresă stabilă, care nu depinde de o legătură fizică; o folosim ca „locație” (RLOC) a tunelului.'],
          ['interface gi0/1 / ip address 10.0.12.1 /30', 'Legătura de underlay către R2, o rețea de infrastructură mică.'],
          ['router ospf 1 / router-id 1.1.1.1', 'Pornește OSPF (3.4) și fixează un router ID previzibil.'],
          ['network 10.0.12.0 0.0.0.3 area 0', 'Anunță legătura de underlay în OSPF.'],
          ['network 1.1.1.1 0.0.0.0 area 0', 'Anunță loopback-ul: endpoint-ul tunelului trebuie să fie accesibil prin underlay.'],
        ]} />
        <p>Observă ce <b>nu</b> anunți în OSPF: LAN-urile <code>192.168.1.0/24</code> și <code>192.168.2.0/24</code>. Underlay-ul trebuie să cunoască doar adresele de infrastructură (inclusiv loopback-urile), nu adresele gazdelor din overlay.</p>
      </Detailed>

      <Detailed title="3. Overlay: tunel GRE între R1 și R4">
        <CodeBlock title="R1 — overlay (ilustrativ)" kind="config" code={`R1(config)# interface tunnel 0
R1(config-if)# ip address 10.255.0.1 255.255.255.252
R1(config-if)# tunnel source loopback 0
R1(config-if)# tunnel destination 4.4.4.4
R1(config-if)# tunnel mode gre ip
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip route 192.168.2.0 255.255.255.0 10.255.0.2
!
R4(config)# interface tunnel 0
R4(config-if)# ip address 10.255.0.2 255.255.255.252
R4(config-if)# tunnel source loopback 0
R4(config-if)# tunnel destination 1.1.1.1
R4(config-if)# no shutdown
R4(config-if)# exit
R4(config)# ip route 192.168.1.0 255.255.255.0 10.255.0.1`} explain={[
          ['interface tunnel 0', 'Creează o interfață virtuală: capătul overlay-ului.'],
          ['ip address 10.255.0.1 /30', 'Adresa din overlay (rețea separată de cele reale).'],
          ['tunnel source loopback 0', 'Adresa din underlay pe care o folosește R1 ca sursă a pachetului exterior.'],
          ['tunnel destination 4.4.4.4', 'Adresa din underlay a celuilalt capăt (loopback-ul lui R4); trebuie să fie accesibilă prin OSPF.'],
          ['tunnel mode gre ip', 'Tipul de încapsulare (GRE peste IP); este și valoarea implicită pe multe platforme.'],
          ['ip route 192.168.2.0 … 10.255.0.2', 'Trimite traficul către LAN B prin tunel (next hop din overlay).'],
          ['R4: ip route 192.168.1.0 … 10.255.0.1', 'Ruta de întoarcere: fără ea răspunsurile nu se întorc.'],
        ]} />
        <Reveal label="Care sunt „underlay” și „overlay” în această configurație?">
          <p><b>Underlay</b>: legăturile și OSPF între R1–R4 (adrese 10.0.x.x și loopback-uri). <b>Overlay</b>: interfața Tunnel0 și rețeaua 10.255.0.0/30, peste care circulă LAN-urile 192.168.x.x. R2 și R3 transportă pachete GRE (IP proto 47) între 1.1.1.1 și 4.4.4.4 și nu știu că în interior sunt pachete 192.168.x.x.</p>
        </Reveal>
      </Detailed>

      <Detailed title="4. Verificare">
        <CodeBlock title="Verificare pe R1 (ilustrativ)" kind="session" code={`R1# show ip ospf neighbor
Neighbor ID     Pri   State        Dead Time   Address       Interface
2.2.2.2           1   FULL/DR      00:00:33    10.0.12.2     GigabitEthernet0/1

R1# show interfaces tunnel 0
Tunnel0 is up, line protocol is up
  Internet address is 10.255.0.1/30
  Tunnel source 1.1.1.1 (Loopback0), destination 4.4.4.4
  Tunnel protocol/transport GRE/IP

R1# show ip route 192.168.2.0
S    192.168.2.0/24 [1/0] via 10.255.0.2

R1# ping 192.168.2.10 source 192.168.1.1
!!!!!

R1# traceroute 192.168.2.10
  1 10.255.0.2 12 msec 8 msec 9 msec
  2 192.168.2.10 14 msec 11 msec 10 msec

R2# show ip route 192.168.2.0
% Network not in table`} explain={[
          ['show ip ospf neighbor', 'Underlay-ul este sănătos: vecinul R2 este FULL.'],
          ['show interfaces tunnel 0', 'Overlay-ul este up; arată sursa/destinația din underlay și tipul GRE/IP.'],
          ['show ip route 192.168.2.0', 'LAN B se ajunge prin tunel (next hop 10.255.0.2).'],
          ['ping … source 192.168.1.1', 'Testează calea completă overlay + underlay.'],
          ['traceroute', 'Tunelul apare ca un singur salt: R2 și R3 nu se văd — dovada încapsulării.'],
          ['R2# show ip route 192.168.2.0', 'Underlay-ul nu cunoaște adresele din overlay: ele circulă încapsulate.'],
        ]} />
        <p>În Packet Tracer, în <b>Simulation Mode</b>, deschide un pachet ICMP în R2: antetul exterior arată IP 1.1.1.1 → 4.4.4.4 (protocol GRE), iar pachetul original este în interior.</p>
      </Detailed>

      <Detailed title="5. Interfețe southbound programatice pe IOS XE (recunoaștere)">
        <CodeBlock title="IOS XE — NETCONF și RESTCONF (ilustrativ)" kind="config" code={`Switch(config)# username admin privilege 15 secret ParolaLunga-2026
Switch(config)# ip http secure-server
Switch(config)# restconf
Switch(config)# netconf-yang
!
Switch# show running-config | include restconf|netconf|http secure
 ip http secure-server
 netconf-yang
 restconf`} explain={[
          ['ip http secure-server', 'Pornește serverul HTTPS (TLS) pe echipament: RESTCONF are nevoie de el.'],
          ['restconf', 'Activează interfața RESTCONF (HTTPS, JSON/XML, modele YANG).'],
          ['netconf-yang', 'Activează NETCONF (SSH, TCP 830) și infrastructura YANG.'],
        ]} />
        <CodeBlock title="Citirea interfețelor cu RESTCONF (ilustrativ)" kind="session" code={`$ curl -k -u admin:•••••• \\
    -H "Accept: application/yang-data+json" \\
    https://10.0.99.1/restconf/data/ietf-interfaces:interfaces
{
  "ietf-interfaces:interfaces": {
    "interface": [
      { "name": "GigabitEthernet1", "enabled": true, "type": "iana-if-type:ethernetCsmacd" }
    ]
  }
}`} explain={[
          ['curl -k -u admin:…', 'Cerere HTTPS cu autentificare Basic (6.5); -k ignoră verificarea certificatului în laborator (nu în producție).'],
          ['Accept: application/yang-data+json', 'Cere răspunsul în JSON conform modelului YANG.'],
          ['/restconf/data/ietf-interfaces:interfaces', 'URI-ul identifică resursa: modelul ietf-interfaces, containerul interfaces.'],
        ]} />
        <p>Aceeași informație se poate cere prin NETCONF (XML, SSH pe portul 830); controller-ele folosesc aceste interfețe ca <b>southbound</b>.</p>
      </Detailed>
      <Traps items={[
        <>Dacă adresa de destinație a tunelului nu este în underlay, tunelul nu se ridică (line protocol down).</>,
        <>Nu anunța în underlay rețelele din overlay (192.168.x.x) <i>prin tunel</i>: apare rutare recursivă și tunelul poate „pâlpâi”.</>,
        <>Overlay-ul adaugă antete: verifică MTU (<code>ip mtu</code>, <code>ip tcp adjust-mss</code>) dacă transferurile mari eșuează.</>,
        <>RESTCONF cere <code>ip http secure-server</code>; NETCONF cere SSH și cont cu privilegii.</>,
      ]} />
      <InlineQuiz ids={['6.3-022', '6.3-023', '6.3-024', '6.3-033']} />
    </section>
  );
}
