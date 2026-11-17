import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.3" title="Exemple de configurare și verificare (DHCP server și DNS)" />
      <Summary>
        <p>Obiectivul 4.3 este de tip <b>Explain</b>, dar exemplele practice clarifică ideile: un router care funcționează ca <b>server DHCP</b> (pool, adrese excluse, gateway, DNS, lease) și ca <b>client DNS</b>. Configurarea clientului DHCP pe router și a releului (<code>ip helper-address</code>) este la 4.6.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; formatul coloanelor, textele și comenzile disponibile variază între IOS, IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="1. Router ca server DHCP">
        <p>R1 are LAN-ul 192.168.1.0/24 pe Gi0/0 (R1 = 192.168.1.1). Adresele .1–.10 sunt rezervate (gateway, servere), iar restul sunt date automat. DNS-ul clienților este 8.8.8.8.</p>
        <CodeBlock title="R1 — server DHCP (ilustrativ)" kind="config" code={`R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10
R1(config)# ip dhcp pool LAN
R1(dhcp-config)# network 192.168.1.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.1.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# domain-name exemplu.local
R1(dhcp-config)# lease 7`} explain={[
          ['ip dhcp excluded-address 192.168.1.1 192.168.1.10', 'Global, în afara pool-ului: aceste adrese nu se vor oferi niciodată (gateway, servere cu IP static).'],
          ['ip dhcp pool LAN', 'Creează pool-ul LAN și intră în modul dhcp-config.'],
          ['network 192.168.1.0 255.255.255.0', 'Rețeaua din care se dau adrese (și masca livrată clienților).'],
          ['default-router 192.168.1.1', 'Gateway-ul livrat clienților (opțiunea 3).'],
          ['dns-server 8.8.8.8', 'Serverul DNS livrat clienților (opțiunea 6).'],
          ['domain-name exemplu.local', 'Sufixul de domeniu (opțiunea 15).'],
          ['lease 7', 'Durata lease-ului: 7 zile (implicit 1 zi).'],
        ]} />
        <CodeBlock title="R1 — verificare (ilustrativ)" kind="session" code={`R1# show ip dhcp binding
IP address      Client-ID/Hardware address    Lease expiration        Type
192.168.1.11    0100.5056.a1b2.c3             Nov 23 2026 10:15 AM    Automatic
192.168.1.12    0100.5056.a1b2.c4             Nov 23 2026 10:16 AM    Automatic

R1# show ip dhcp pool LAN
Pool LAN :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0
 Total addresses                : 254
 Leased addresses               : 2
 Excluded addresses             : 10`} explain={[
          ['show ip dhcp binding', 'Lista lease-urilor active: adresa, identificatorul clientului (MAC), expirarea, tipul (Automatic).'],
          ['show ip dhcp pool LAN', 'Starea pool-ului: câte adrese are, câte sunt date, câte excluse.'],
          ['Excluded addresses: 10', 'Cele 10 adrese excluse global (.1–.10).'],
        ]} />
        <Table head={['Comandă', 'Ce arată']} hlCol={0} rows={[
          [<code key="a">show ip dhcp binding</code>, 'Lease-uri active (IP ↔ MAC)'],
          [<code key="b">show ip dhcp pool</code>, 'Utilizarea pool-urilor'],
          [<code key="c">show ip dhcp conflict</code>, 'Adrese retrase din cauza conflictelor detectate'],
          [<code key="d">show ip dhcp server statistics</code>, 'Contoare pe tipuri de mesaje (Discover, Offer, Request, Ack)'],
          [<code key="e">debug ip dhcp server packet</code>, 'Urmărește mesajele în timp real (folosește cu grijă)'],
        ]} />
      </Detailed>

      <Detailed title="2. Router ca client DNS">
        <CodeBlock title="R1 — DNS pe IOS (ilustrativ)" kind="config" code={`R1(config)# ip domain-name exemplu.local
R1(config)# ip name-server 8.8.8.8
R1(config)# ip host SERV1 192.168.1.10
R1(config)# ip domain-lookup`} explain={[
          ['ip domain-name exemplu.local', 'Sufixul adăugat numelor scurte (și necesar pentru generarea cheilor SSH).'],
          ['ip name-server 8.8.8.8', 'Serverul DNS interogat de router.'],
          ['ip host SERV1 192.168.1.10', 'Înregistrare statică locală: SERV1 → 192.168.1.10; nu mai pleacă cerere DNS.'],
          ['ip domain-lookup', 'Rezolvarea numelor este activă (implicit).'],
        ]} />
        <CodeBlock title="R1 — verificare (ilustrativ)" kind="session" code={`R1# ping SERV1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.10, timeout is 2 seconds:
!!!!!

R1# show hosts
Name/address lookup uses domain service
Name servers are 8.8.8.8
Codes: UN - unknown, EX - expired, OK - OK, ?? - revalidate
Host      Port  Flags      Age Type   Address(es)
SERV1     None  (perm, OK)  0   IP     192.168.1.10`} explain={[
          ['ping SERV1', 'Numele este rezolvat local (ip host), apoi se trimit pachetele ICMP.'],
          ['Name servers are 8.8.8.8', 'Serverul DNS configurat.'],
          ['(perm, OK)', 'Înregistrare permanentă (statică).'],
        ]} />
        <Callout kind="tip" title="no ip domain-lookup">
          Dacă tastezi greșit o comandă (de exemplu <code>shwo ip route</code>), IOS o ia drept nume de gazdă pentru Telnet și încearcă să-l rezolve prin DNS, blocând consola o vreme. <code>no ip domain-lookup</code> oprește acest comportament în laboratoare.
        </Callout>
      </Detailed>

      <Detailed title="3. Verificare pe client">
        <Table head={['Sistem', 'Comandă', 'Scop']} hlCol={0} rows={[
          ['Windows', <code key="a">ipconfig /all</code>, 'Adresa, gateway, serverul DHCP, serverele DNS, lease obținut/expirat'],
          ['Windows', <code key="b">ipconfig /release</code> , 'Renunță la lease'],
          ['Windows', <code key="c">ipconfig /renew</code>, 'Reia procesul DORA/renew'],
          ['Windows', <code key="d">nslookup www.exemplu.ro</code>, 'Interogare DNS directă'],
          ['Windows', <code key="e">ipconfig /displaydns</code>, 'Cache-ul DNS local'],
          ['Linux/macOS', <code key="f">dig www.exemplu.ro</code>, 'Interogare DNS detaliată'],
        ]} />
        <Reveal label="Interpretare rapidă">
          <ul>
            <li>Adresa începe cu 169.254 → nu a venit răspuns DHCP.</li>
            <li>Are IP, dar nu rezolvă nume → DNS greșit sau inaccesibil (testează <code>ping 8.8.8.8</code>).</li>
            <li>Adresa nu e din pool-ul așteptat → alt server DHCP în rețea (rogue) sau VLAN greșit.</li>
          </ul>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Adresele excluse se declară <b>global</b> (în afara <code>ip dhcp pool</code>), nu în interiorul pool-ului.</>,
        <>Dacă <code>network</code> din pool nu se potrivește cu subrețeaua interfeței pe care sosesc cererile, serverul nu oferă nimic.</>,
        <>Output-urile sunt <b>ilustrative</b>; lease-urile și formatul real diferă.</>,
      ]} />
      <InlineQuiz ids={['4.3-020', '4.3-021']} />
    </section>
  );
}
