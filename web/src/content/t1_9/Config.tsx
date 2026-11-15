import { Term as G } from '../../components/Term';
import { Callout, Detailed, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.9" title="Exemple de configurare și verificare" />
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate pe echipamente reale">
        Comenzile urmează sintaxa din ghidurile Cisco IOS, dar <b>nu au fost testate pe echipamente reale</b>, iar output-urile sunt <b>reconstrucții ilustrative</b>. Valorile (MAC-uri, temporizatoare, ordinea liniilor) pot diferi pe echipamentul tău. Adresele GUA folosesc blocul de documentație <code>2001:db8::/32</code>; ULA-ul este un exemplu inventat.
      </Callout>

      <Detailed title="Exemplul 1 — GUA, ULA, link-local și anycast pe aceeași interfață">
        <p>O interfață IPv6 poate avea mai multe adrese simultan. Aici R1 primește o adresă globală, una ULA, o link-local manuală și o adresă anycast.</p>
        <CodeBlock title="R1" code={`ipv6 unicast-routing
!
interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:1::1/64
 ipv6 address fd3a:91c4:7e02:1::1/64
 ipv6 address fe80::1 link-local
 ipv6 address 2001:db8:acad:1:ffff:ffff:ffff:fffe/64 anycast
 no shutdown`} explain={[
          ['ipv6 address 2001:db8:acad:1::1/64', <>Adresă <b>globală</b> (<G id="gua" />) — începe cu 2, deci face parte din <code>2000::/3</code>.</>],
          ['ipv6 address fd3a:91c4:7e02:1::1/64', <>Adresă <b>ULA</b> (<G id="ula" />): începe cu <code>fd</code>; Global ID-ul (<code>3a91c47e02</code>) este un exemplu inventat — într-o rețea reală îl generezi pseudo-aleatoriu.</>],
          ['ipv6 address fe80::1 link-local', <>Înlocuiește link-local-ul automat cu <code>fe80::1</code>; cuvântul-cheie <code>link-local</code> este obligatoriu (altfel IOS ar trata adresa ca pe o adresă obișnuită).</>],
          ['… anycast', <>Marchează adresa ca <G id="anycast" />: aceeași adresă poate fi configurată și pe alt router, iar rețeaua livrează pachetul celui mai apropiat. Sintactic nu se deosebește de o adresă unicast.</>],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — EUI-64: ce adrese apar">
        <CodeBlock title="R1 — adresare cu EUI-64" code={`interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:2::/64 eui-64
 no shutdown`} explain={[
          ['ipv6 address 2001:db8:acad:2::/64 eui-64', <>Scrii doar prefixul. Dacă MAC-ul interfeței este <code>0011.2233.4455</code>, IOS calculează Interface ID-ul <code>0211:22FF:FE33:4455</code> (vezi <G id="eui64" />) și configurează adresa <code>2001:DB8:ACAD:2:211:22FF:FE33:4455</code>. Link-local-ul automat devine <code>FE80::211:22FF:FE33:4455</code>.</>],
        ]} />
        <p className="small muted">Exemplul presupune MAC-ul <code>0011.2233.4455</code> al interfeței G0/1; pe echipamentul tău MAC-ul va fi altul.</p>
      </Detailed>

      <Detailed title="Verificare — adrese, grupuri multicast">
        <CodeBlock title="R1 — show ipv6 interface" kind="session" code={`R1# show ipv6 interface g0/0
GigabitEthernet0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  Global unicast address(es):
    2001:DB8:ACAD:1::1, subnet is 2001:DB8:ACAD:1::/64
    FD3A:91C4:7E02:1::1, subnet is FD3A:91C4:7E02:1::/64
    2001:DB8:ACAD:1:FFFF:FFFF:FFFF:FFFE, subnet is 2001:DB8:ACAD:1::/64 [ANY]
  Joined group address(es):
    FF02::1
    FF02::2
    FF02::1:FF00:1
    FF02::1:FFFF:FFFE
R1# show ipv6 interface brief
GigabitEthernet0/0     [up/up]
    FE80::1
    2001:DB8:ACAD:1::1
    FD3A:91C4:7E02:1::1`} explain={[
          ['link-local address is FE80::1', 'Adresa link-local a interfeței (automată sau setată manual).'],
          ['Global unicast address(es)', <>Toate adresele unicast/anycast ale interfeței. Observă că ULA și GUA coexistă. Marcajul <code>[ANY]</code> indică adresa anycast (format ilustrativ).</>],
          ['FF02::1 / FF02::2', <><b>All-nodes</b> și <b>all-routers</b>; <code>FF02::2</code> apare doar după <code>ipv6 unicast-routing</code>.</>],
          ['FF02::1:FF00:1', <>Grupul <G id="solicited-node" /> pentru adresele care se termină în <code>…:0001</code> (atât <code>::1</code> GUA/ULA cât și <code>fe80::1</code> — același grup). Al doilea grup, <code>FF02::1:FFFF:FFFE</code>, vine de la adresa anycast.</>],
        ]} />
      </Detailed>

      <Detailed title="Pe client — tipuri de adrese într-un ipconfig">
        <CodeBlock title="Windows" kind="session" code={`C:\\> ipconfig
Ethernet adapter Ethernet:
   IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1:5d1c:8f2a:41b0:9e7c
   Temporary IPv6 Address. . . . . . : 2001:db8:acad:1:a4e1:3b77:c20f:12d9
   Link-local IPv6 Address . . . . . : fe80::5d1c:8f2a:41b0:9e7c%12
   Default Gateway . . . . . . . . . : fe80::1%12`} explain={[
          ['IPv6 Address', <>Adresă globală (GUA); Interface ID-ul <code>5d1c:8f2a:41b0:9e7c</code> <b>nu conține</b> <code>ff:fe</code>, deci este generat aleatoriu, nu EUI-64.</>],
          ['Temporary IPv6 Address', 'Adresă temporară (RFC 8981), folosită pentru conexiuni ieșite din motive de confidențialitate.'],
          ['Link-local fe80::…%12', <>Adresa link-local; <code>%12</code> este zona (indexul interfeței).</>],
          ['Default Gateway fe80::1%12', 'Gateway-ul este adresa link-local a routerului, învățată din RA.'],
        ]} />
        <p className="small muted">Formatul diferă pe fiecare sistem de operare; pe Linux folosește <code>ip -6 addr</code>, pe macOS <code>ifconfig</code>.</p>
      </Detailed>

      <Detailed title="Recunoaște tipul după prefix">
        <Table head={['Adresa', 'Tip', 'De ce']} rows={[
          [<code>2001:db8:acad:1::1</code>, 'GUA (documentație)', 'începe cu 2 → 2000::/3'],
          [<code>fd3a:91c4:7e02:1::1</code>, 'ULA', 'fd → fc00::/7'],
          [<code>fe80::1</code>, 'link-local', 'fe80::/10'],
          [<code>ff02::1</code>, 'multicast, link-local, all-nodes', 'ff + scope 2'],
          [<code>ff02::1:ff00:1</code>, 'multicast, solicited-node', 'ff02::1:ff + 24 biți'],
          [<code>::1</code>, 'loopback', 'doar 1 în ultimul bit'],
          [<code>::</code>, 'nespecificată', 'toți biții 0'],
          [<code>fec0::1</code>, 'site-local (depreciat)', 'fec0::/10 — nu mai este folosit'],
        ]} />
      </Detailed>
      <InlineQuiz ids={['1.9-031', '1.9-032']} />
    </section>
  );
}
