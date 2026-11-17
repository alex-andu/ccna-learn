import { Term as G } from '../../components/Term';
import { Callout, Detailed, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.8" title="Exemple de configurare și verificare" />
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate pe echipamente reale">
        Sintaxa urmează ghidurile Cisco IOS, dar comenzile <b>nu au fost testate pe echipamente reale</b>, iar output-urile sunt <b>reconstrucții ilustrative</b> în formatul standard IOS. Pe echipamentul tău, numele interfețelor, valorile temporizatoarelor și unele linii pot diferi. Adresele folosesc prefixul de documentație <code>2001:db8::/32</code>. Verifică în Packet Tracer înainte de a te baza pe un detaliu.
      </Callout>

      <Detailed title="Exemplul 1 — adresare statică pe un router">
        <p>R1 are două interfețe LAN. Pe fiecare dăm o adresă globală statică (GUA) și o adresă link-local ușor de reținut, <code>fe80::1</code>, pe care hostii o vor folosi ca gateway.</p>
        <CodeBlock title="R1 — adresare statică" code={`enable
configure terminal
hostname R1
ipv6 unicast-routing
!
interface GigabitEthernet0/0
 description LAN 1
 ipv6 address 2001:db8:acad:1::1/64
 ipv6 address fe80::1 link-local
 no shutdown
!
interface GigabitEthernet0/1
 description LAN 2
 ipv6 address 2001:db8:acad:2::1/64
 ipv6 address fe80::1 link-local
 no shutdown
end
copy running-config startup-config`} explain={[
          ['ipv6 unicast-routing', <>Comandă <b>globală</b>. Fără ea, routerul nu rutează IPv6 și <b>nu trimite Router Advertisement</b>, deci hostii SLAAC nu primesc prefix și gateway. Adresele se pot configura și fără ea.</>],
          ['ipv6 address 2001:db8:acad:1::1/64', <>Adresa globală statică. Scrii <b>adresa completă + prefixul</b>. Apare automat și o adresă link-local, generată din MAC (EUI-64), dacă nu o setezi tu.</>],
          ['ipv6 address fe80::1 link-local', <>Suprascrie link-local-ul automat cu <code>fe80::1</code> — mai ușor de scris și de recunoscut. Poate fi aceeași pe fiecare interfață, pentru că o adresă link-local contează doar pe legătura ei (<G id="link-local" />).</>],
          ['no shutdown', 'Interfețele routerelor sunt oprite implicit.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — prefix + EUI-64, autoconfigurare și „ipv6 enable”">
        <CodeBlock title="Variante de adresare pe interfețe" code={`! (a) Dai doar prefixul; IOS completează Interface ID din MAC (EUI-64)
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:2::/64 eui-64
!
! (b) Interfața routerului se comportă ca un host SLAAC (spre ISP)
interface GigabitEthernet0/2
 ipv6 address autoconfig default
 no shutdown
!
! (c) Doar adresă link-local, fără adresă globală
interface GigabitEthernet0/3
 ipv6 enable
 no shutdown`} explain={[
          ['ipv6 address 2001:db8:acad:2::/64 eui-64', <>Scrii <b>prefixul</b>, nu o adresă completă. Interface ID de 64 de biți se calculează din MAC (<G id="eui64" />, detaliat la 1.9). Dacă prefixul este mai lung de /64, biții de prefix au prioritate.</>],
          ['ipv6 address autoconfig default', <>Routerul își ia adresa prin SLAAC din RA-urile unui alt router; <code>default</code> instalează și o rută implicită prin acel router (doar pe o singură interfață).</>],
          ['ipv6 enable', <>Activează IPv6 pe interfață și generează doar adresa link-local, fără adresă globală. Folosit pe legături pe care rutarea se face cu adrese link-local.</>],
        ]} />
      </Detailed>

      <Detailed title="Verificare — adrese, prefix, tabela de rutare">
        <CodeBlock title="R1 — comenzi show" kind="session" code={`R1# show ipv6 interface brief
GigabitEthernet0/0     [up/up]
    FE80::1
    2001:DB8:ACAD:1::1
GigabitEthernet0/1     [up/up]
    FE80::1
    2001:DB8:ACAD:2:211:22FF:FE33:4455
GigabitEthernet0/2     [administratively down/down]
    unassigned
R1# show ipv6 interface g0/0
GigabitEthernet0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  Global unicast address(es):
    2001:DB8:ACAD:1::1, subnet is 2001:DB8:ACAD:1::/64
  Joined group address(es):
    FF02::1
    FF02::2
    FF02::1:FF00:1
  MTU is 1500 bytes
  ND DAD is enabled, number of DAD attempts: 1
  Hosts use stateless autoconfig for addresses.
R1# show ipv6 route
C   2001:DB8:ACAD:1::/64 [0/0]
     via GigabitEthernet0/0, directly connected
L   2001:DB8:ACAD:1::1/128 [0/0]
     via GigabitEthernet0/0, receive
C   2001:DB8:ACAD:2::/64 [0/0]
     via GigabitEthernet0/1, directly connected
L   FF00::/8 [0/0]
     via Null0, receive`} explain={[
          ['show ipv6 interface brief', <>Echivalentul lui <code>show ip interface brief</code>: fiecare interfață cu starea ei și adresele (link-local primul). Observă a doua interfață: GUA-ul cu EUI-64 conține <code>FF:FE</code> la mijlocul Interface ID-ului.</>],
          ['show ipv6 interface g0/0', <>Detalii: adresa link-local, GUA cu <b>subnet is …/64</b> (prefixul calculat de router) și grupurile multicast la care a aderat interfața. <code>FF02::1</code> = toate nodurile, <code>FF02::2</code> = toate routerele (apare după <code>ipv6 unicast-routing</code>), <code>FF02::1:FF00:1</code> = solicited-node (vezi 1.9).</>],
          ['show ipv6 route', <>La fel ca la IPv4: <b>C</b> = rețeaua conectată (/64), <b>L</b> = adresa proprie a routerului ca rută /128. Adresele link-local nu apar. <code>L FF00::/8</code> (multicast) este întotdeauna prezentă.</>],
        ]} />
        <CodeBlock title="R1 — ping și vecini" kind="session" code={`R1# ping 2001:db8:acad:1::10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:DB8:ACAD:1::10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms
R1# show ipv6 neighbors
IPv6 Address                              Age Link-layer Addr State Interface
2001:DB8:ACAD:1::10                         0 0050.7966.6801  REACH Gi0/0
FE80::250:79FF:FE66:6801                    0 0050.7966.6801  REACH Gi0/0`} explain={[
          ['ping 2001:db8:acad:1::10', <>Test de conectivitate cu <G id="ping" />, la fel ca în IPv4. La un ping către o adresă link-local, IOS cere și interfața de ieșire (aceeași adresă link-local poate exista pe mai multe interfețe).</>],
          ['show ipv6 neighbors', <>Echivalentul tabelei ARP: asocierea adresă IPv6 ↔ MAC, descoperită cu NS/NA din <G id="ndp" />. Starea <b>REACH</b> = vecin confirmat recent.</>],
        ]} />
      </Detailed>

      <Detailed title="Pe client — cum arată o adresă IPv6 în Windows (legătură cu 1.10)">
        <CodeBlock title="Windows" kind="session" code={`C:\\> ipconfig
Ethernet adapter Ethernet:
   IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1:5d1c:8f2a:41b0:9e7c
   Temporary IPv6 Address. . . . . . : 2001:db8:acad:1:a4e1:3b77:c20f:12d9
   Link-local IPv6 Address . . . . . : fe80::5d1c:8f2a:41b0:9e7c%12
   IPv4 Address. . . . . . . . . . . : 192.168.1.20
   Default Gateway . . . . . . . . . : fe80::1%12`} explain={[
          ['IPv6 Address / Temporary IPv6 Address', <>Prefixul <code>2001:db8:acad:1</code> vine din RA; Interface ID-ul este generat de sistem. Adresa „temporară” este folosită pentru conexiuni ieșite, din motive de confidențialitate.</>],
          ['fe80::…%12', <>Adresa link-local; <code>%12</code> este indexul interfeței (zona) — necesar pentru că aceeași adresă link-local poate exista pe mai multe interfețe.</>],
          ['Default Gateway: fe80::1%12', <>Gateway-ul este adresa <b>link-local</b> a routerului, învățată din RA — de aceea am setat <code>fe80::1</code> pe interfața routerului.</>],
        ]} />
        <p className="small muted">Formatul exact diferă între versiuni de Windows; pe Linux: <code>ip -6 addr</code>, pe macOS: <code>ifconfig</code>.</p>
      </Detailed>

      <Detailed title="Depanare rapidă">
        <Table head={['Simptom', 'Cauză probabilă', 'Verificare / remediere']} rows={[
          ['Hostul SLAAC nu primește prefix sau gateway', <>Lipsește <code>ipv6 unicast-routing</code> pe router (nu se trimit RA)</>, <>verifică <code>show ipv6 interface g0/0</code>: lipsește grupul <code>FF02::2</code>; adaugă comanda</>],
          ['SLAAC nu funcționează deloc', <>Prefix diferit de /64 pe interfață</>, <>setează <code>/64</code></>],
          ['Ping la gateway-ul global merge, spre altă rețea nu', 'lipsește ruta sau rutarea între routere', <><code>show ipv6 route</code>; adaugă ruta statică sau protocolul de rutare (3.x)</>],
          ['Interfața apare „administratively down”', <>lipsește <code>no shutdown</code></>, <><code>show ipv6 interface brief</code></>],
          ['Host cu adresă statică comunică doar în LAN', 'gateway lipsă sau greșit pe host', <>setează gateway-ul (adresa link-local sau globală a routerului, ex. <code>fe80::1</code>) și verifică cu <code>ipconfig</code></>],
        ]} />
      </Detailed>
      <InlineQuiz ids={['1.8-033', '1.8-034']} />
    </section>
  );
}
