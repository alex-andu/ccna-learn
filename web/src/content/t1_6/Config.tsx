import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { ConnectedRoutes } from '../../diagrams/t1_6';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.6" title="Exemple de configurare și verificare (Cisco IOS)" />
      <Summary>
        <p>Configurarea unei adrese pe un router are trei pași: <code>interface …</code> → <code>ip address &lt;adresă&gt; &lt;mască&gt;</code> → <code>no shutdown</code>. Verificarea se face cu <code>show ip interface brief</code>, <code>show ip interface</code>, <code>show running-config interface</code>, <code>show ip route connected</code> și <code>ping</code>.
          Exemplele folosesc planul VLSM din lecție (192.168.10.0/24).</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative">
        Sintaxa comenzilor urmează ghidurile Cisco IOS și funcționează în Packet Tracer și pe routerele ISR clasice (de exemplu 2911). Output-urile de mai jos sunt <b>exemple construite după formatul documentat</b>, nu capturi de pe echipamente reale; numerele de octeți, ordinea liniilor și textul exact al mesajelor de eroare pot diferi ușor între versiuni IOS/IOS-XE și Packet Tracer. Verifică întotdeauna cu <code>?</code> pe echipament.
      </Callout>

      <Detailed title="Exemplul 1 — adrese pe interfețele unui router">
        <CodeBlock title="R1 — configurare interfețe (VLSM 192.168.10.0/24)" kind="session" code={`Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface GigabitEthernet0/0
R1(config-if)# description LAN-A (60 gazde)
R1(config-if)# ip address 192.168.10.1 255.255.255.192
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface GigabitEthernet0/1
R1(config-if)# description LAN-B (28 gazde)
R1(config-if)# ip address 192.168.10.65 255.255.255.224
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface GigabitEthernet0/2
R1(config-if)# description WAN spre R2
R1(config-if)# ip address 192.168.10.113 255.255.255.252
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface Loopback0
R1(config-if)# ip address 10.255.255.1 255.255.255.255
R1(config-if)# end
R1# copy running-config startup-config`} explain={[
          ['interface GigabitEthernet0/0', 'Intri în modul de configurare al interfeței (prompt-ul devine config-if). Abrevieri acceptate: int g0/0.'],
          ['description LAN-A (60 gazde)', 'Text liber, doar pentru oameni. Bună practică: scrie ce e conectat acolo.'],
          ['ip address 192.168.10.1 255.255.255.192', <>Adresa routerului în LAN-A (prima gazdă din .0/26) și masca <b>zecimală</b>. Aceasta devine <G id="default-gateway" />-ul PC-urilor din LAN-A.</>],
          ['no shutdown', <>Pe routere interfețele sunt implicit oprite (<G id="admin-down" />). Fără această comandă, nu se întâmplă nimic.</>],
          ['ip address 192.168.10.113 255.255.255.252', 'Capătul R1 al legăturii WAN /30 (.113; R2 va avea .114).'],
          ['interface Loopback0', <>Interfață virtuală, mereu up. Primește o adresă /32 (<G id="loopback" />). Nu are nevoie de <code>no shutdown</code>.</>],
          ['copy running-config startup-config', 'Salvează configurația în NVRAM, ca să supraviețuiască unui restart (sau `write memory`).'],
        ]} />
        <Callout kind="tip" title="Convenții care ușurează viața">
          Routerul pe <b>prima</b> adresă utilizabilă (.1, .65, .97…), serverele/imprimantele pe adrese statice la începutul intervalului, iar DHCP pe restul. Important e să fii consecvent și să documentezi tabelul de adresare.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 2 — adresă secondary (un LAN care a crescut)">
        <p>Uneori un LAN rămâne fără adrese și nu poți renumerota imediat. Poți adăuga o a doua subrețea pe aceeași interfață cu <code>secondary</code>. Este o soluție de tranziție — în proiectele noi preferi o subrețea suficient de mare sau un VLAN nou.</p>
        <CodeBlock title="R1 — secondary pe G0/1" kind="session" code={`R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.10.97 255.255.255.240 secondary
R1(config-if)# end`} explain={[
          ['ip address … secondary', 'Adaugă 192.168.10.96/28 lângă primara 192.168.10.64/27. Gazdele din ambele subrețele folosesc G0/1 ca gateway (fiecare adresa din subrețeaua ei).'],
          ['(fără secondary)', <>Aceeași comandă <b>fără</b> <code>secondary</code> ar <b>înlocui</b> adresa primară .65/27 — o greșeală clasică.</>],
        ]} />
        <p className="small muted">În labul ghidat .96/28 este LAN-ul lui R2; acest exemplu e doar o demonstrație separată. Nu le combina pe același router — IOS ar refuza suprapunerea.</p>
      </Detailed>

      <Detailed title="Exemplul 3 — adresă pe un switch (SVI de management)">
        <p>Un switch L2 nu rutează, dar are nevoie de o adresă ca să-l poți administra prin SSH. Adresa se pune pe o interfață virtuală de VLAN (<G id="svi" />), iar switch-ul primește un gateway, ca un PC.</p>
        <CodeBlock title="SW-A — management" kind="session" code={`SW-A(config)# interface vlan 1
SW-A(config-if)# ip address 192.168.10.2 255.255.255.192
SW-A(config-if)# no shutdown
SW-A(config-if)# exit
SW-A(config)# ip default-gateway 192.168.10.1`} explain={[
          ['interface vlan 1', 'SVI-ul VLAN-ului 1 (detalii despre VLAN-uri în 2.1).'],
          ['ip address … / no shutdown', 'Ca la router; SVI-ul poate fi oprit implicit.'],
          ['ip default-gateway 192.168.10.1', 'Pe un switch L2 (fără rutare) gateway-ul se dă global, ca la un PC. Trebuie să fie în aceeași subrețea cu SVI-ul.'],
        ]} />
      </Detailed>

      <Detailed title="Verificare 1 — show ip interface brief">
        <CodeBlock title="R1" kind="session" code={`R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.10.1    YES manual up                    up
GigabitEthernet0/1     192.168.10.65   YES manual up                    up
GigabitEthernet0/2     192.168.10.113  YES manual up                    up
Loopback0              10.255.255.1    YES manual up                    up
Vlan1                  unassigned      YES unset  administratively down down`} explain={[
          ['show ip interface brief', 'Prima comandă de verificare: o linie pe interfață, cu adresa primară, metoda și starea. Nu arată masca și nici adresele secondary.'],
          ['Method manual / unset / DHCP', 'manual = configurată cu ip address; unset = fără adresă; DHCP = primită de la un server.'],
          ['Status / Protocol', 'Status = nivelul 1 (și starea administrativă); Protocol = nivelul 2 (line protocol).'],
        ]} />
        <Table head={['Status', 'Protocol', 'Ce înseamnă', 'Ce faci']} rows={[
          ['up', 'up', 'interfața funcționează', '—'],
          ['administratively down', 'down', 'are `shutdown` în configurație', '`no shutdown`'],
          ['down', 'down', 'problemă de nivel 1: cablu, port, capătul celălalt oprit', 'verifică cablul și vecinul'],
          ['up', 'down', 'problemă de nivel 2: încapsulare/keepalive diferite (mai ales pe seriale)', 'compară configurațiile capetelor'],
        ]} />
      </Detailed>

      <Detailed title="Verificare 2 — show ip interface și show running-config interface">
        <CodeBlock title="R1 — detaliat" kind="session" code={`R1# show ip interface GigabitEthernet0/1
GigabitEthernet0/1 is up, line protocol is up
  Internet address is 192.168.10.65/27
  Broadcast address is 255.255.255.255
  Secondary address 192.168.10.97/28
  MTU is 1500 bytes
  Helper address is not set
  Outgoing access list is not set
  Inbound  access list is not set
  Proxy ARP is enabled
R1# show running-config interface GigabitEthernet0/1
Building configuration...

Current configuration : 182 bytes
!
interface GigabitEthernet0/1
 description LAN-B (28 gazde)
 ip address 192.168.10.97 255.255.255.240 secondary
 ip address 192.168.10.65 255.255.255.224
 duplex auto
 speed auto
end`} explain={[
          ['Internet address is 192.168.10.65/27', 'Aici vezi PREFIXUL (masca) — ce lipsea din „brief”.'],
          ['Broadcast address is 255.255.255.255', 'Atenție: aceasta NU e adresa de broadcast a subrețelei (.95), ci broadcast-ul limitat pe care IOS îl folosește pe interfață. Confuzie frecventă.'],
          ['Secondary address …', 'Adresele secondary apar doar aici și în running-config.'],
          ['show running-config interface G0/1', 'Doar bucata de configurație a interfeței: vezi exact ce comenzi ai dat, inclusiv măștile zecimale.'],
        ]} />
      </Detailed>

      <Detailed title="Verificare 3 — rutele C și L">
        <Figure caption="Fiecare adresă de interfață (up/up) produce două rute: C pentru subrețea și L pentru adresa proprie /32.">
          <ConnectedRoutes />
        </Figure>
        <CodeBlock title="R1 — tabela de rutare, doar rutele conectate" kind="session" code={`R1# show ip route connected
      10.0.0.0/32 is subnetted, 1 subnets
C        10.255.255.1 is directly connected, Loopback0
      192.168.10.0/24 is variably subnetted, 6 subnets, 4 masks
C        192.168.10.0/26 is directly connected, GigabitEthernet0/0
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0
C        192.168.10.64/27 is directly connected, GigabitEthernet0/1
L        192.168.10.65/32 is directly connected, GigabitEthernet0/1
C        192.168.10.112/30 is directly connected, GigabitEthernet0/2
L        192.168.10.113/32 is directly connected, GigabitEthernet0/2`} explain={[
          ['C … /26', <>Connected: toată subrețeaua e direct în spatele interfeței. Routerul o află singur din adresă + mască (de aceea o mască greșită strică <G id="routing-table">tabela de rutare</G>).</>],
          ['L … /32', 'Local: adresa proprie a interfeței, ca rută /32. Pachetele destinate routerului însuși sunt livrate local (rutele L au apărut odată cu IOS 15).'],
          ['variably subnetted, 6 subnets, 4 masks', 'IOS constată că în 192.168.10.0/24 există subrețele cu măști diferite — adică VLSM.'],
          ['10.255.255.1 (Loopback0)', 'Pentru un /32 IOS afișează doar ruta C (adresa e deja o rută de gazdă).'],
        ]} />
        <p className="small muted">Pe unele versiuni linia pentru Loopback /32 poate apărea ușor diferit; important e că rutele apar doar pentru interfețele up/up.</p>
      </Detailed>

      <Detailed title="Verificare 4 — ping de pe router">
        <CodeBlock title="R1" kind="session" code={`R1# ping 192.168.10.114
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.10.114, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/1/2 ms`} explain={[
          ['ping 192.168.10.114', <>Testează capătul R2 al legăturii WAN (<G id="ping" />, mesaje <G id="icmp" /> Echo).</>],
          ['.!!!!', <><code>!</code> = răspuns primit, <code>.</code> = timeout, <code>U</code> = destinație inaccesibilă. Primul <code>.</code> e normal: routerul aștepta răspunsul <G id="arp" /> pentru MAC-ul vecinului.</>],
        ]} />
      </Detailed>

      <Detailed title="Greșeli frecvente și mesajele IOS (formulare ilustrativă)">
        <CodeBlock title="Suprapunere de subrețele pe același router" kind="session" code={`R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 192.168.10.30 255.255.255.192
% 192.168.10.0 overlaps with GigabitEthernet0/0`} explain={[
          ['overlaps with …', '192.168.10.30/26 este în 192.168.10.0/26, deja folosit pe G0/0. Fiecare interfață a unui router trebuie să fie într-o subrețea DIFERITĂ, fără suprapuneri.'],
        ]} />
        <CodeBlock title="Adresă de rețea sau de broadcast pe interfață" kind="session" code={`R1(config-if)# ip address 192.168.10.64 255.255.255.224
Bad mask /27 for address 192.168.10.64
R1(config-if)# ip address 192.168.10.95 255.255.255.224
Bad mask /27 for address 192.168.10.95`} explain={[
          ['Bad mask /27 for address …', '.64 e adresa de rețea și .95 broadcast-ul lui 192.168.10.64/27. Nu pot fi gazde. Folosește .65–.94.'],
        ]} />
        <CodeBlock title="Mască necontiguă" kind="session" code={`R1(config-if)# ip address 192.168.10.1 255.0.255.0
Bad mask 0xFF00FF00 for address 192.168.10.1`} explain={[
          ['Bad mask 0x…', 'Biții de 1 nu sunt consecutivi — nu e o mască validă. IOS afișează masca în hexazecimal.'],
        ]} />
        <Table head={['Simptom', 'Cauză probabilă', 'Cum verifici']} rows={[
          ['interfața e „administratively down”', 'lipsește `no shutdown`', '`show ip interface brief`'],
          ['PC-ul face ping local, dar nu în afară', 'gateway greșit sau în altă subrețea', '`ipconfig` pe PC vs. adresa interfeței routerului'],
          ['două PC-uri din același LAN nu se văd', 'mască greșită pe unul dintre ele', 'compară măștile; calculează rețeaua fiecăruia'],
          ['legătura WAN e up/up, dar ping eșuează', 'capetele în subrețele diferite sau măști diferite (/24 vs /30)', '`show ip interface` pe ambele routere'],
          ['ai „pierdut” adresa veche de pe interfață', 'ai dat `ip address` nou fără `secondary`', '`show running-config interface`'],
        ]} />
      </Detailed>

      <Traps items={[
        <>„administratively down” = configurație (<code>shutdown</code>), nu cablu.</>,
        <><code>show ip interface brief</code> nu arată masca și nici secondary.</>,
        <>Rutele C/L apar doar când interfața e <b>up/up</b>: o interfață oprită „dispare” din tabela de rutare.</>,
        <>Pe un switch L2, gateway-ul se configurează cu <code>ip default-gateway</code> (global), nu pe interfață.</>,
      ]} />
    </section>
  );
}
