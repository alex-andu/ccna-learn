import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.6" title="Exemple de configurare și verificare (client și relay)" />
      <Summary>
        <p>Două configurări scurte: <code>ip address dhcp</code> pe interfața dinspre ISP (client) și <code>ip helper-address</code> pe interfața dinspre LAN (relay). Verifici cu <code>show ip interface brief</code>, <code>show ip route</code>, <code>show ip interface</code> și, pe server, <code>show ip dhcp binding</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; formatul și mesajele diferă între IOS, IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="1. R1 ca client DHCP al ISP-ului">
        <CodeBlock title="R1 — client DHCP (ilustrativ)" kind="config" code={`R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip address dhcp
R1(config-if)# no shutdown
R1(config-if)# end`} explain={[
          ['interface gigabitEthernet 0/0', 'Interfața dinspre ISP.'],
          ['ip address dhcp', 'Interfața cere adresă prin DHCP în loc de adresă statică.'],
          ['no shutdown', 'Pornește interfața; fără el nu pleacă Discover-ul.'],
        ]} />
        <CodeBlock title="R1 — verificare client (ilustrativ)" kind="session" code={`R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     198.51.100.10   YES DHCP   up                    up
GigabitEthernet0/1     192.168.10.1    YES manual up                    up
GigabitEthernet0/2     172.16.0.1      YES manual up                    up

R1# show ip route
Gateway of last resort is 198.51.100.1 to network 0.0.0.0

S*    0.0.0.0/0 [254/0] via 198.51.100.1`} explain={[
          ['Method = DHCP', 'Adresa a fost învățată prin DHCP, nu configurată manual.'],
          ['198.51.100.10', 'Adresa primită din pool-ul ISP-ului.'],
          ['Gateway of last resort … 198.51.100.1', 'Gateway-ul primit prin opțiunea 3 a devenit rută implicită.'],
          ['[254/0]', 'Distanța administrativă mare pentru ruta DHCP (valoare uzuală; verifică pe platforma ta).'],
        ]} />
      </Detailed>

      <Detailed title="2. R1 ca relay pentru LAN-ul clienților">
        <CodeBlock title="R1 — relay (ilustrativ)" kind="config" code={`R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# ip helper-address 172.16.0.10
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface gigabitEthernet 0/2
R1(config-if)# ip address 172.16.0.1 255.255.255.0
R1(config-if)# no shutdown`} explain={[
          ['interface gigabitEthernet 0/1', 'Interfața dinspre clienți: aici sosesc broadcast-urile.'],
          ['ip address 192.168.10.1 …', 'Adresa interfeței; va ajunge în câmpul giaddr.'],
          ['ip helper-address 172.16.0.10', 'Relay: broadcast-urile DHCP ale clienților se trimit în unicast către 172.16.0.10.'],
          ['interface gigabitEthernet 0/2', 'Interfața dinspre server; NU primește ip helper-address.'],
        ]} />
        <CodeBlock title="Serverul DHCP (pe un router IOS) — pool pentru LAN-ul relayat (ilustrativ)" kind="config" code={`SRV(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.9
SRV(config)# ip dhcp pool LAN10
SRV(dhcp-config)# network 192.168.10.0 255.255.255.0
SRV(dhcp-config)# default-router 192.168.10.1
SRV(dhcp-config)# dns-server 8.8.8.8
SRV(config)# ip route 192.168.10.0 255.255.255.0 172.16.0.1`} explain={[
          ['ip dhcp excluded-address …', 'Adrese rezervate (gateway etc.), nu se oferă clienților.'],
          ['network 192.168.10.0 255.255.255.0', 'Pool-ul care conține giaddr 192.168.10.1: de aici alege serverul.'],
          ['default-router 192.168.10.1', 'Gateway-ul trimis clienților (opțiunea 3).'],
          ['ip route 192.168.10.0 … 172.16.0.1', 'Ruta înapoi spre subrețeaua clienților, prin R1 (la un server pe același segment cu R1 ar putea fi chiar conectată).'],
        ]} />
        <Callout kind="tip" title="Server în Packet Tracer">
          În Packet Tracer, pe un obiect Server: Services → DHCP, ON, definești pool-ul (Default Gateway 192.168.10.1, Start IP 192.168.10.10, mască 255.255.255.0). Server-ul are nevoie de Default Gateway 172.16.0.1 ca să poată răspunde în afara subrețelei lui.
        </Callout>
      </Detailed>

      <Detailed title="3. Verificare și depanare">
        <CodeBlock title="Verificări (ilustrativ)" kind="session" code={`R1# show ip interface gigabitEthernet 0/1
GigabitEthernet0/1 is up, line protocol is up
  Internet address is 192.168.10.1/24
  Helper address is 172.16.0.10
  ...

SRV# show ip dhcp binding
IP address       Client-ID/Hardware address    Lease expiration        Type
192.168.10.10    0001.4390.AA11                Nov 17 2026 10:20 AM    Automatic`} explain={[
          ['Helper address is 172.16.0.10', 'Confirmă că relay-ul este configurat pe această interfață.'],
          ['show ip dhcp binding', 'Pe server: pe ce adrese le-a dat și cui (MAC-ul clientului).'],
          ['192.168.10.10', 'Adresa din pool-ul relayat: dovada că relay-ul a funcționat.'],
        ]} />
        <Table head={['Comandă', 'Unde', 'Ce arată']} hlCol={0} rows={[
          [<code key="a">show ip interface brief</code>, 'Client', 'Adresa interfeței și metoda (DHCP/manual)'],
          [<code key="b">show ip route</code>, 'Client', 'Ruta implicită învățată prin DHCP'],
          [<code key="c">show ip interface &lt;if&gt;</code>, 'Relay', 'Helper address configurat pe interfață'],
          [<code key="d">show ip dhcp binding</code>, 'Server', 'Adresele atribuite'],
          [<code key="e">show ip dhcp pool</code>, 'Server', 'Pool-uri și adrese utilizate'],
          [<code key="f">show ip dhcp conflict</code>, 'Server', 'Adrese retrase din cauza conflictelor'],
          [<code key="g">debug ip dhcp server packet</code>, 'Server', 'Mesajele DHCP primite/trimise (doar temporar)'],
        ]} />
        <Reveal label="Lista de verificare când „clienții din LAN-ul relayat nu primesc adresă”">
          <ol>
            <li>Clientul are APIPA (169.254.x.x)? Atunci Discover-ul nu a ajuns sau Offer-ul nu a revenit.</li>
            <li><code>show ip interface &lt;if-client&gt;</code> pe relay: apare „Helper address is …” și adresa e a serverului corect?</li>
            <li>Relay-ul poate da ping la server (ruta spre 172.16.0.10 există, interfața e up)?</li>
            <li>Serverul are un pool care conține subrețeaua din giaddr (192.168.10.0/24) și nu l-ai epuizat cu excluderi?</li>
            <li>Serverul are rută înapoi spre giaddr (sau gateway implicit către relay)?</li>
            <li>ACL/firewall care blochează UDP 67/68 între relay și server?</li>
            <li><code>show ip dhcp binding</code> pe server: există o intrare? Dacă da, problema e pe drumul de întoarcere.</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <><code>ip helper-address</code> pe Gi0/2 (spre server) în loc de Gi0/1 (spre clienți): nu produce erori, dar nu funcționează.</>,
        <>Pool configurat pentru altă subrețea decât cea din giaddr: serverul nu are ce oferi clientului.</>,
        <>Output-urile sunt <b>ilustrative</b>; textele și contoarele reale diferă.</>,
      ]} />
      <InlineQuiz ids={['4.6-020', '4.6-021']} />
    </section>
  );
}
