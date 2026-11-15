import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.7" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Topicul 1.7 este de tip <b>Describe</b>, deci nu vei configura nimic la examen pentru el. Ca să vezi însă unde „trăiesc” adresele private, mai jos ai un router <G id="soho" /> tipic: LAN privat, WAN public și o <b>previzualizare</b> a configurației PAT din topicul 4.1, plus output-urile pe care le vei recunoaște în laburi.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative">
        Comenzile urmează sintaxa din ghidurile Cisco IOS, dar <b>nu au fost testate pe echipamente reale</b>. Output-urile sunt <b>exemple ilustrative</b>: pe echipamentul tău coloanele pot diferi ușor de la o versiune de IOS la alta, iar porturile și numerele vor fi altele. Adresele „publice” sunt blocuri de documentație (<G id="test-net" />).
      </Callout>

      <Detailed title="Exemplul 1 — router SOHO: LAN privat, WAN public">
        <p>Interfața spre LAN primește o adresă din <code>192.168.1.0/24</code> (RFC 1918) și servește <G id="dhcp" /> pentru PC-uri. Interfața spre ISP primește adresa publică. Ruta implicită trimite spre ISP tot ce nu e local.</p>
        <CodeBlock title="R-HOME — adresare (topicurile 1.6, 4.3)" code={`hostname R-HOME
!
interface GigabitEthernet0/0
 description LAN - retea privata RFC 1918
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/1
 description WAN - spre ISP (adresa publica)
 ip address 203.0.113.2 255.255.255.252
 no shutdown
!
ip dhcp excluded-address 192.168.1.1 192.168.1.9
ip dhcp pool LAN
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 198.51.100.53
!
ip route 0.0.0.0 0.0.0.0 203.0.113.1`} explain={[
          ['ip address 192.168.1.1 255.255.255.0', <>Gateway-ul LAN-ului: o adresă <b>privată</b> din 192.168.0.0/16. Pentru PC-uri, aceasta e <G id="default-gateway" />.</>],
          ['ip address 203.0.113.2 255.255.255.252', <>Adresa <b>publică</b> primită de la ISP (aici dintr-un bloc de documentație). Pe o conexiune reală de acasă, adesea se primește prin DHCP: <code>ip address dhcp</code>.</>],
          ['ip dhcp excluded-address …', 'Adresele .1–.9 nu se dau clienților (gateway, imprimante, servere cu IP fix).'],
          ['ip dhcp pool LAN', <>PC-urile primesc automat adrese private 192.168.1.10–254. Detaliat la 4.3 (DHCP).</>],
          ['ip route 0.0.0.0 0.0.0.0 203.0.113.1', <>Ruta implicită spre ISP. <b>Fără NAT</b>, pachetele ar pleca cu sursă privată și răspunsurile nu s-ar mai întoarce.</>],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — PAT (previzualizare din 4.1)">
        <Callout kind="info" title="Preview din 4.1">
          Această configurație o vei învăța în detaliu la obiectivul <b>4.1 Configure and verify inside source NAT using static and pools</b>. Aici o vezi doar ca să legi conceptul de la 1.7 (adrese private → traducere) de comenzile reale.
        </Callout>
        <CodeBlock title="R-HOME — PAT pe adresa interfeței WAN" code={`access-list 1 permit 192.168.1.0 0.0.0.255
!
interface GigabitEthernet0/0
 ip nat inside
!
interface GigabitEthernet0/1
 ip nat outside
!
ip nat inside source list 1 interface GigabitEthernet0/1 overload`} explain={[
          ['access-list 1 permit 192.168.1.0 0.0.0.255', <>Cine are voie să fie tradus: toate adresele private din LAN (wildcard 0.0.0.255 = /24, vezi <G id="wildcard-mask" />).</>],
          ['ip nat inside', <>Marchează interfața LAN ca „inside” — aici sunt adresele <G id="inside-local" />.</>],
          ['ip nat outside', 'Marchează interfața WAN ca „outside” — spre Internet.'],
          ['ip nat inside source list 1 interface GigabitEthernet0/1 overload', <>Traduce sursa pachetelor care se potrivesc cu ACL 1 în adresa interfeței G0/1 (<G id="inside-global" />). <code>overload</code> = <G id="pat" />: toți hostii împart aceeași adresă, deosebiți prin porturi.</>],
        ]} />
      </Detailed>

      <Detailed title="Verificare — tabela de traduceri">
        <CodeBlock title="R-HOME — după un ping și o pagină web de pe două PC-uri" kind="session" code={`R-HOME# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     203.0.113.2     YES manual up                    up
R-HOME# show ip nat translations
Pro  Inside global       Inside local         Outside local        Outside global
icmp 203.0.113.2:1       192.168.1.10:1       198.51.100.10:1      198.51.100.10:1
tcp  203.0.113.2:1025    192.168.1.10:1025    198.51.100.10:80     198.51.100.10:80
tcp  203.0.113.2:1024    192.168.1.11:1025    198.51.100.10:80     198.51.100.10:80
R-HOME# show ip nat statistics
Total active translations: 3 (0 static, 3 dynamic; 3 extended)
Outside interfaces:
  GigabitEthernet0/1
Inside interfaces:
  GigabitEthernet0/0
Hits: 42  Misses: 3`} explain={[
          ['show ip interface brief', 'Confirmă cele două „lumi”: privat pe G0/0, public pe G0/1.'],
          ['show ip nat translations', <>Fiecare rând = o conversație. Coloana <b>Inside local</b> = adresa privată reală a PC-ului; <b>Inside global</b> = adresa publică sub care apare. Observă că ambele PC-uri apar ca 203.0.113.2, deosebite prin port (1025 vs. 1024).</>],
          ['icmp 203.0.113.2:1 …', <>Pentru <G id="ping" />, „portul” este ICMP Identifier-ul. Intrările ICMP expiră repede — uită-te imediat după ping.</>],
          ['show ip nat statistics', 'Totalul traducerilor active, interfețele inside/outside și contoarele Hits/Misses (Miss = pachet pentru care s-a creat o traducere nouă).'],
        ]} />
      </Detailed>

      <Detailed title="Pe client — cum vezi că ești „în spatele” NAT-ului (legătură cu 1.10)">
        <CodeBlock title="Windows" kind="session" code={`C:\\> ipconfig
Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . . . . . : 192.168.1.23
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
C:\\> tracert -d 8.8.8.8
  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     6 ms     5 ms     6 ms  100.64.0.1
  3     8 ms     7 ms     8 ms  203.0.113.129
  ...`} explain={[
          ['ipconfig', <>Adresa ta este privată (192.168.1.23). Site-urile pe care le vizitezi nu o văd niciodată (<G id="ipconfig" />).</>],
          ['tracert -d 8.8.8.8', <><code>-d</code> = fără rezolvare DNS. Primul hop = routerul tău (privat). Dacă al doilea hop este în <b>100.64.0.0/10</b>, ISP-ul tău folosește <G id="cgnat" /> (vezi <G id="traceroute" />).</>],
        ]} />
        <p className="small muted">Ca să afli adresa publică văzută de Internet, deschide un site de tip „what is my IP” și compar-o cu adresa WAN din interfața routerului. Dacă diferă, există încă un NAT între tine și Internet.</p>
      </Detailed>

      <Detailed title="Bonus — filtrarea adreselor private la marginea rețelei (preview din 5.6)">
        <p>Un router de margine nu ar trebui să accepte din Internet pachete cu sursă privată (sunt <G id="bogon" />-uri — aproape sigur falsificate). Observă cum blocurile RFC 1918 se scriu cu wildcard.</p>
        <CodeBlock title="ACL de intrare pe WAN" code={`ip access-list extended WAN-IN-BOGONS
 deny   ip 10.0.0.0 0.255.255.255 any
 deny   ip 172.16.0.0 0.15.255.255 any
 deny   ip 192.168.0.0 0.0.255.255 any
 deny   ip 127.0.0.0 0.255.255.255 any
 permit ip any any
!
interface GigabitEthernet0/1
 ip access-group WAN-IN-BOGONS in`} explain={[
          ['deny ip 172.16.0.0 0.15.255.255 any', <>Wildcard-ul blocului /12: 0.<b>15</b>.255.255 (inversul lui 255.240.0.0) — acoperă exact 172.16 … 172.31.</>],
          ['permit ip any any', 'Restul traficului trece (un ACL se termină implicit cu „deny any”).'],
          ['ip access-group WAN-IN-BOGONS in', <>Aplicat pe interfața outside, în sensul <b>in</b>. Atenție: dacă ISP-ul îți dă pe WAN o adresă 100.64.x.x (CGNAT), nu bloca 100.64.0.0/10.</>],
        ]} />
      </Detailed>
    </section>
  );
}
