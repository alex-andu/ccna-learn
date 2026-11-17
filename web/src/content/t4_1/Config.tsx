import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.1" title="Exemple de configurare și verificare (NAT)" />
      <Summary>
        <p>Orice configurare NAT are aceiași pași: (1) marchezi interfețele <code>ip nat inside</code> și <code>ip nat outside</code>; (2) definești <b>ce</b> traduci (adresă statică sau ACL); (3) definești <b>în ce</b> traduci (adresă, pool sau interfață); (4) verifici cu <code>show ip nat translations</code> și <code>show ip nat statistics</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; formatul coloanelor și mesajele variază între IOS, IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="Scenariul">
        <p>R1 are LAN-ul 192.168.1.0/24 pe Gi0/0 (inside) și legătura spre ISP pe Gi0/1 (outside, 203.0.113.2/30). Serverul din Internet este 198.51.100.5. Vom face pe rând static NAT, pool și PAT.</p>
        <CodeBlock title="R1 — interfețele (comun tuturor variantelor)" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip nat inside
R1(config-if)# interface g0/1
R1(config-if)# ip nat outside`} explain={[
          ['ip nat inside', 'Marchează interfața dinspre rețeaua privată; pachetele care intră aici sunt candidate pentru traducerea sursei.'],
          ['ip nat outside', 'Marchează interfața spre Internet; pachetele care intră aici se verifică în tabela de traduceri.'],
        ]} />
      </Detailed>

      <Detailed title="1. Static NAT">
        <CodeBlock title="R1 — static NAT pentru serverul 192.168.1.10" kind="config" code={`R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10`} explain={[
          ['ip nat inside source static', 'Traducere statică a sursei pachetelor care vin din interior (și, la întoarcere, a destinației).'],
          ['192.168.1.10', 'Inside local — adresa privată a gazdei.'],
          ['203.0.113.10', 'Inside global — adresa publică prin care e văzută.'],
        ]} />
        <CodeBlock title="R1 — show ip nat translations (ilustrativ)" kind="session" code={`R1# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
--- 203.0.113.10       192.168.1.10       ---                ---`} explain={[
          ['---', 'Intrarea statică apare chiar dacă nu a circulat trafic; nu are porturi.'],
          ['Inside global / Inside local', 'Perechea configurată: publică ↔ privată.'],
        ]} />
      </Detailed>

      <Detailed title="2. Dynamic NAT cu pool">
        <CodeBlock title="R1 — pool, ACL, legătura" kind="config" code={`R1(config)# ip nat pool POOL1 203.0.113.20 203.0.113.30 netmask 255.255.255.0
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat inside source list 1 pool POOL1`} explain={[
          ['ip nat pool POOL1 … netmask …', 'Definește pool-ul de adrese publice (11 adrese, capetele incluse). Se poate scrie și prefix-length 24.'],
          ['access-list 1 permit 192.168.1.0 0.0.0.255', 'Care gazde se traduc; wildcard 0.0.0.255 = tot /24. Nu e filtrare de trafic.'],
          ['ip nat inside source list 1 pool POOL1', 'Leagă ACL-ul de pool: gazdele permise primesc, pe rând, câte o adresă din pool.'],
        ]} />
        <CodeBlock title="R1 — după ce PC1 și PC2 trimit trafic (ilustrativ)" kind="session" code={`R1# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
--- 203.0.113.20       192.168.1.10       ---                ---
--- 203.0.113.21       192.168.1.11       ---                ---`} explain={[
          ['Două intrări', 'Fiecare gazdă activă a ocupat o adresă din pool, 1:1; fără porturi în tabelă.'],
        ]} />
      </Detailed>

      <Detailed title="3. PAT (overload)">
        <CodeBlock title="R1 — PAT pe adresa interfeței de ieșire" kind="config" code={`R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat inside source list 1 interface g0/1 overload`} explain={[
          ['access-list 1 …', 'Gazdele care au voie să iasă; același ACL ca la pool.'],
          ['… interface g0/1 overload', 'Traduce către adresa curentă a lui Gi0/1 (203.0.113.2) și permite refolosirea ei de mai multe gazde, deosebite prin port.'],
        ]} />
        <p>Varianta cu pool: <code>ip nat inside source list 1 pool POOL1 overload</code>.</p>
        <CodeBlock title="R1 — show ip nat translations (ilustrativ)" kind="session" code={`R1# show ip nat translations
Pro Inside global         Inside local          Outside local        Outside global
tcp 203.0.113.2:1024      192.168.1.10:51000    198.51.100.5:80      198.51.100.5:80
tcp 203.0.113.2:1025      192.168.1.11:51000    198.51.100.5:80      198.51.100.5:80
icmp 203.0.113.2:1        192.168.1.12:1        198.51.100.5:1       198.51.100.5:1`} explain={[
          ['Inside global …:1024', 'Aceeași adresă publică (203.0.113.2), port global diferit pentru fiecare conexiune.'],
          ['Inside local …:51000', 'Portul real al gazdei; două gazde pot avea același port local.'],
          ['Outside local / global', 'Serverul din Internet; coincid, fiindcă nu traducem exteriorul.'],
          ['icmp …:1', 'Pentru ping, în loc de port se folosește identificatorul ICMP.'],
        ]} />
      </Detailed>

      <Detailed title="4. Verificare și depanare">
        <CodeBlock title="R1 — show ip nat statistics (ilustrativ)" kind="session" code={`R1# show ip nat statistics
Total active translations: 3 (0 static, 3 dynamic; 3 extended)
Outside interfaces:
  GigabitEthernet0/1
Inside interfaces:
  GigabitEthernet0/0
Hits: 120  Misses: 3
Dynamic mappings:
-- Inside Source
[Id: 1] access-list 1 interface GigabitEthernet0/1 refcount 3`} explain={[
          ['Total active translations', 'Câte intrări sunt acum în tabelă (și câte statice/dinamice/extended).'],
          ['Outside / Inside interfaces', 'Verifică repede dacă ai marcat corect interfețele.'],
          ['Hits / Misses', 'Hits = pachete traduse folosind o intrare existentă; Misses = pachete care au creat o intrare nouă.'],
          ['Dynamic mappings', 'Regula activă: ACL 1, interfața Gi0/1, cu overload.'],
        ]} />
        <Table head={['Comandă', 'Ce arată / ce face']} hlCol={0} rows={[
          [<code key="a">show ip nat translations</code>, <>Tabela de traduceri (cu <code>verbose</code> arată și timpii)</>],
          [<code key="b">show ip nat statistics</code>, 'Contoare, interfețe inside/outside, reguli, utilizarea pool-ului'],
          [<code key="c">clear ip nat translation *</code>, 'Șterge traducerile dinamice (cele statice rămân)'],
          [<code key="d">debug ip nat</code>, 'Afișează fiecare traducere în timp real; folosește cu grijă pe echipamente încărcate'],
          [<code key="e">show access-lists</code>, 'Arată dacă ACL-ul numără potriviri (matches)'],
        ]} />
        <Reveal label="Lista de verificare când „nu merge NAT”">
          <ol>
            <li><code>show ip nat statistics</code>: interfețele inside/outside sunt cele corecte?</li>
            <li>ACL-ul permite adresele gazdelor (verifică wildcard-ul și <code>show access-lists</code>)?</li>
            <li>Pool-ul: masca și capetele corecte? Mai sunt adrese libere?</li>
            <li>Lipsește <code>overload</code>?</li>
            <li>Există rută spre destinație pe R1 și rută de întoarcere spre adresele publice la ISP?</li>
            <li>Din PC: <code>ping</code>; pe R1: <code>show ip nat translations</code> — apare o intrare? Dacă da, problema e după NAT; dacă nu, înainte.</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Cu <code>clear ip nat translation *</code> pierzi toate conexiunile active traduse dinamic; intrările statice nu sunt șterse.</>,
        <>Intrările din output sunt <b>ilustrative</b>: numărul de intrări, porturile alese și formatul diferă pe echipamentul tău.</>,
        <>Dacă schimbi ACL-ul sau pool-ul, șterge traducerile existente ca să vezi efectul imediat.</>,
      ]} />
      <InlineQuiz ids={['4.1-021', '4.1-022']} />
    </section>
  );
}
