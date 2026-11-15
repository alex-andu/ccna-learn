import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.10" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Topicul 1.10 este de tip <b>Verify</b>: la examen trebuie să citești și să interpretezi configurația IP a unui client. Ca să o înțelegi complet, e util să știi și cum se <b>setează</b> manual (static) și cum se revine la DHCP pe fiecare sistem.
          La final vezi partea Cisco: pool-ul DHCP de pe router și comenzile cu care corelezi ce vede clientul cu ce vede routerul.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative">
        Toate output-urile din această lecție sunt <b>exemple ilustrative</b>, construite după formatele documentate, cu valori fictive (adrese private și din rangurile de documentație, MAC-uri inventate). Nu au fost capturate de pe echipamente reale. Pe sistemul tău, ordinea câmpurilor, denumirile și spațierea pot diferi ușor între versiuni — informațiile esențiale sunt aceleași. Comenzile care schimbă configurația cer drepturi de administrator (<code>sudo</code> / „Run as administrator”) și îți pot întrerupe conexiunea: încearcă-le pe o mașină de test sau pe Raspberry Pi, nu pe o sesiune remote importantă.
      </Callout>

      <Detailed title="Exemplul 1 — Windows: adresă statică și revenire la DHCP">
        <CodeBlock title="Windows (Command Prompt ca administrator) — netsh" kind="session" code={`C:\\> netsh interface ipv4 set address name="Ethernet" static 192.168.1.50 255.255.255.0 192.168.1.1
C:\\> netsh interface ipv4 set dnsservers name="Ethernet" static 192.168.1.1 primary
C:\\> netsh interface ipv4 add dnsservers name="Ethernet" 1.1.1.1 index=2
C:\\> netsh interface ip show config name="Ethernet"
C:\\> netsh interface ipv4 set address name="Ethernet" source=dhcp
C:\\> netsh interface ipv4 set dnsservers name="Ethernet" source=dhcp`} explain={[
          ['set address … static IP MASCĂ GATEWAY', <>Setează IP-ul, masca (în zecimal cu puncte) și default gateway-ul pe adaptorul „Ethernet” (<G id="netsh" />). Numele adaptorului îl iei din <code>ipconfig</code>.</>],
          ['set dnsservers … static 192.168.1.1 primary', 'Setează serverul DNS primar.'],
          ['add dnsservers … 1.1.1.1 index=2', 'Adaugă un al doilea server DNS (secundar).'],
          ['show config', 'Verifică: „DHCP enabled: No” și „Statically Configured DNS Servers”.'],
          ['set address … source=dhcp', 'Revine la DHCP pentru adresă, mască și gateway.'],
          ['set dnsservers … source=dhcp', 'Revine la DNS primit prin DHCP. Fără această comandă, DNS-ul static rămâne!'],
        ]} />
        <CodeBlock title="Windows — PowerShell (ca administrator)" kind="session" code={`PS C:\\> New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.50 -PrefixLength 24 -DefaultGateway 192.168.1.1
PS C:\\> Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.1,1.1.1.1
PS C:\\> Get-NetIPConfiguration -InterfaceAlias "Ethernet"
PS C:\\> Set-NetIPInterface -InterfaceAlias "Ethernet" -Dhcp Enabled
PS C:\\> Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ResetServerAddresses`} explain={[
          ['New-NetIPAddress … -PrefixLength 24', <>În <G id="powershell" /> masca se dă ca prefix (24), nu ca 255.255.255.0.</>],
          ['Set-DnsClientServerAddress -ServerAddresses', 'Lista de servere DNS, separate prin virgulă.'],
          ['Set-NetIPInterface -Dhcp Enabled', 'Reactivează DHCP pe interfață. Dacă adresa statică și gateway-ul rămân, se șterg cu Remove-NetIPAddress / Remove-NetRoute.'],
          ['-ResetServerAddresses', 'Revine la DNS-ul primit prin DHCP.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — macOS: networksetup">
        <CodeBlock title="macOS — adresă manuală, DNS, revenire la DHCP" kind="session" code={`$ sudo networksetup -setmanual "Wi-Fi" 192.168.1.50 255.255.255.0 192.168.1.1
$ sudo networksetup -setdnsservers "Wi-Fi" 192.168.1.1 1.1.1.1
$ networksetup -getinfo "Wi-Fi"
Manual Configuration
IP address: 192.168.1.50
Subnet mask: 255.255.255.0
Router: 192.168.1.1
$ sudo networksetup -setdhcp "Wi-Fi"
$ sudo networksetup -setdnsservers "Wi-Fi" empty`} explain={[
          ['-setmanual "Wi-Fi" IP MASCĂ ROUTER', 'Configurație statică pe serviciul „Wi-Fi” (numele din Setări, nu en0). Masca se dă în zecimal.'],
          ['-setdnsservers "Wi-Fi" …', 'Servere DNS manuale.'],
          ['Manual Configuration', 'Confirmă că acum adresa este statică (în loc de „DHCP Configuration”).'],
          ['-setdhcp "Wi-Fi"', 'Revine la DHCP.'],
          ['-setdnsservers "Wi-Fi" empty', 'Șterge DNS-urile manuale → se folosesc din nou cele primite prin DHCP.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Linux (și Raspberry Pi OS): nmcli permanent vs. ip temporar">
        <CodeBlock title="Linux — NetworkManager (permanent)" kind="session" code={`$ nmcli connection show
NAME                UUID                                  TYPE      DEVICE
Wired connection 1  2b7c…                                 ethernet  eth0
$ sudo nmcli connection modify "Wired connection 1" ipv4.method manual ipv4.addresses 192.168.1.50/24 ipv4.gateway 192.168.1.1 ipv4.dns "192.168.1.1 1.1.1.1"
$ sudo nmcli connection up "Wired connection 1"
$ ip -br a show eth0
eth0             UP             192.168.1.50/24
$ sudo nmcli connection modify "Wired connection 1" ipv4.method auto ipv4.addresses "" ipv4.gateway "" ipv4.dns ""
$ sudo nmcli connection up "Wired connection 1"`} explain={[
          ['nmcli connection show', <>Lista profilurilor <G id="networkmanager" /> și interfața pe care e activ fiecare.</>],
          ['ipv4.method manual ipv4.addresses …/24', 'Trece profilul pe static: IP cu prefix, gateway, DNS. Se salvează permanent.'],
          ['nmcli connection up', 'Reactivează profilul ca să aplice schimbările (pe DHCP, reface și cererea DHCP).'],
          ['ipv4.method auto …', 'Revine la DHCP și golește valorile statice.'],
        ]} />
        <CodeBlock title="Linux — iproute2 (temporar, se pierde la restart)" kind="session" code={`$ sudo ip addr add 192.168.1.60/24 dev eth0
$ sudo ip route add default via 192.168.1.1
$ ip a show eth0
$ sudo ip addr del 192.168.1.60/24 dev eth0`} explain={[
          ['ip addr add …/24 dev eth0', <>Adaugă o adresă (pe lângă cele existente) — <G id="iproute2" />. Util la teste rapide.</>],
          ['ip route add default via …', 'Adaugă o rută implicită (eroare „File exists” dacă există deja una).'],
          ['ip addr del', 'Șterge adresa adăugată. Pe Raspberry Pi OS, configurația permanentă se face prin nmcli (versiunile Bookworm și mai noi) sau prin fișierele de configurare ale versiunilor mai vechi.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — partea Cisco: serverul DHCP de pe router (folosit în laburi)">
        <p>În laburile de mai jos, routerul R1 este serverul <G id="dhcp" /> pentru LAN-ul clienților. Sintaxa e cea din IOS (detaliată în 4.6); aici contează legătura cu ce vede clientul.</p>
        <CodeBlock title="R1 — pool DHCP" code={`R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10
R1(config)# ip dhcp pool LAN-A
R1(dhcp-config)# network 192.168.10.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.10.1
R1(dhcp-config)# dns-server 192.168.20.10
R1(dhcp-config)# domain-name ccna.lab
R1(dhcp-config)# lease 1
R1(dhcp-config)# exit`} explain={[
          ['ip dhcp excluded-address …1 …10', 'Adresele .1–.10 nu se dau prin DHCP (rezervate pentru router, servere, adrese statice) — previne conflictele.'],
          ['network 192.168.10.0 255.255.255.0', 'Rețeaua din care se alocă — devine IP-ul și masca clientului (Subnet Mask în ipconfig).'],
          ['default-router 192.168.10.1', 'Devine „Default Gateway” pe client. Greșeala aici se propagă la toți clienții!'],
          ['dns-server 192.168.20.10', 'Devine „DNS Servers” în ipconfig /all.'],
          ['domain-name ccna.lab', 'Devine „Connection-specific DNS Suffix”.'],
          ['lease 1', 'Lease de 1 zi → Lease Obtained / Lease Expires pe client (implicit tot 1 zi pe IOS).'],
        ]} />
        <CodeBlock title="R1 — verificare: corelează cu ipconfig /all de pe PC" kind="session" code={`R1# show ip dhcp binding
Bindings from all pools not associated with VRF:
IP address          Client-ID/              Lease expiration        Type
                    Hardware address/
                    User name
192.168.10.11       0100.50a1.b2c3.d4       Nov 16 2026 09:12 AM    Automatic
192.168.10.12       0100.e0f7.1234.56       Nov 16 2026 09:13 AM    Automatic
R1# show ip arp
Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.10.1            -   0001.4211.aa01  ARPA   GigabitEthernet0/0
Internet  192.168.10.11           3   0050.a1b2.c3d4  ARPA   GigabitEthernet0/0`} explain={[
          ['show ip dhcp binding', 'Ce adrese a dat routerul și cui. Client-ID = 01 (Ethernet) + MAC-ul clientului; comparați cu „Physical Address” din ipconfig /all (00-50-A1-B2-C3-D4).'],
          ['Lease expiration', 'Trebuie să corespundă cu „Lease Expires” de pe client.'],
          ['show ip arp', <>Cache-ul <G id="arp" /> al routerului: clientul apare aici după ce a comunicat cu gateway-ul. MAC-ul în format Cisco (0050.a1b2.c3d4).</>],
        ]} />
        <CodeBlock title="Dacă serverul DHCP e în altă rețea — relay pe interfața LAN" code={`R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip helper-address 192.168.20.10`} explain={[
          ['ip helper-address 192.168.20.10', 'Routerul preia broadcast-urile DHCP de pe LAN și le trimite unicast serverului din altă rețea. Fără ea, clienții primesc 169.254.x.x (APIPA).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Command Prompt-ul unui PC din Packet Tracer">
        <p>PC-urile din Packet Tracer au un <i>Command Prompt</i> simplificat, asemănător cu Windows. Formatul diferă puțin de Windows real (de exemplu, gateway-ul IPv6 și cel IPv4 apar pe linii separate).</p>
        <CodeBlock title="Packet Tracer — PC1 (ilustrativ)" kind="session" code={`C:\\> ipconfig /all

FastEthernet0 Connection:(default port)

   Connection-specific DNS Suffix..: ccna.lab
   Physical Address................: 0050.A1B2.C3D4
   Link-local IPv6 Address.........: FE80::250:A1FF:FEB2:C3D4
   IPv6 Address....................: ::
   IPv4 Address....................: 192.168.10.11
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: ::
                                     192.168.10.1
   DHCP Servers....................: 192.168.10.1
   DHCPv6 IAID.....................:
   DHCPv6 Client DUID..............: 00-01-00-01-…
   DNS Servers.....................: ::
                                     192.168.20.10`} explain={[
          ['Physical Address 0050.A1B2.C3D4', 'Packet Tracer afișează MAC-ul în format Cisco (cu puncte), nu cu cratime ca Windows real.'],
          ['Default Gateway :: / 192.168.10.1', 'Prima linie e gateway-ul IPv6 (nesetat, ::), a doua cel IPv4.'],
          ['DHCP Servers', 'Cine a dat adresa — aici R1.'],
          ['DNS Servers', 'Serverul DNS din pool (SRV1).'],
        ]} />
        <Callout kind="info" title="Ce comenzi există în Command Prompt-ul din PT">
          Tastează <code>help</code> (sau <code>?</code>) în PC → <i>Desktop → Command Prompt</i> ca să vezi lista exactă din versiunea ta. De obicei găsești <code>ipconfig</code> (cu <code>/all</code>, <code>/release</code>, <code>/renew</code>), <code>ping</code>, <code>tracert</code>, <code>arp</code>, <code>nslookup</code>, <code>netstat</code>, <code>telnet</code>, <code>ssh</code>. <b>Nu</b> este un Windows real: nu vei avea <code>route print</code>, <code>netsh</code>, PowerShell sau, probabil, <code>ipconfig /flushdns</code>. Comenzile macOS și Linux nu se pot exersa în PT — pentru ele folosește laboratorul „pe mașinile tale”.
        </Callout>
      </Detailed>
    </section>
  );
}
