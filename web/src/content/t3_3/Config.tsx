import { Callout, Detailed, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="3.3" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 3.3 este <b>Configure and verify</b>: scrii rutele (<code>ip route</code>, <code>ipv6 route</code>) și le verifici cu <code>show ip route</code>, <code>show ipv6 route</code>, <code>ping</code> și <code>traceroute</code>. Mai jos: un scenariu complet cu trei routere, apoi cele trei verificări care rezolvă 90% din probleme și o listă de erori tipice cu simptomele lor.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, cu adrese de laborator; nu au fost capturate de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Mesajele exacte, formatul tabelei și comportamentul ping/traceroute variază între versiuni IOS/IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="Scenariul — trei routere în triunghi">
        <p>R1 are LAN 192.168.10.0/24, R3 are LAN 192.168.30.0/24, R2 este intermediar. Legăturile: R1–R2 10.0.12.0/30, R2–R3 10.0.23.0/30, R1–R3 10.0.13.0/30 (rezervă).</p>
        <Table head={['Router', 'Rută', 'Tip', 'Rol']} rows={[
          ['R1', 'ip route 192.168.30.0 255.255.255.0 10.0.12.2', 'rețea', 'dus spre LAN R3 (prin R2)'],
          ['R1', 'ip route 192.168.30.0 255.255.255.0 10.0.13.2 5', 'flotantă', 'rezervă directă prin R3'],
          ['R1', 'ip route 0.0.0.0 0.0.0.0 10.0.12.2', 'implicită', 'orice altceva spre R2'],
          ['R2', 'ip route 192.168.10.0 255.255.255.0 10.0.12.1', 'rețea', 'întoarcere spre LAN R1'],
          ['R2', 'ip route 192.168.30.0 255.255.255.0 10.0.23.2', 'rețea', 'înainte spre LAN R3'],
          ['R3', 'ip route 192.168.10.0 255.255.255.0 10.0.23.1', 'rețea', 'întoarcere spre LAN R1 (prin R2)'],
          ['R3', 'ip route 192.168.10.0 255.255.255.0 10.0.13.1 5', 'flotantă', 'rezervă directă prin R1'],
          ['R3', 'ip route 192.168.10.10 255.255.255.255 10.0.13.1', 'gazdă', 'excepție pentru PC1: direct pe link-ul de rezervă'],
        ]} />
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.12.2
R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.13.2 5
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.12.2
R1(config)# ipv6 unicast-routing
R1(config)# ipv6 route 2001:db8:30::/64 2001:db8:12::2
R1(config)# ipv6 route 2001:db8:30::/64 g0/2 fe80::3 5
R1(config)# end
R1# copy running-config startup-config`} explain={[
          ['ip route 192.168.30.0 … 10.0.12.2', 'Ruta principală către LAN-ul lui R3, prin R2.'],
          ['… 10.0.13.2 5', 'Ruta flotantă: aceeași destinație, AD 5, prin legătura directă cu R3.'],
          ['ip route 0.0.0.0 0.0.0.0 10.0.12.2', 'Orice altă destinație merge la R2.'],
          ['ipv6 unicast-routing', 'Fără ea nu merge nimic din ce urmează în IPv6.'],
          ['g0/2 fe80::3 5', 'Flotantă IPv6 cu next hop link-local: interfața e obligatorie.'],
          ['copy running-config startup-config', 'Salvează; rutele statice din running-config se pierd la reload dacă nu sunt salvate.'],
        ]} />
        <CodeBlock title="R2 și R3 (ilustrativ)" kind="config" code={`R2(config)# ip route 192.168.10.0 255.255.255.0 10.0.12.1
R2(config)# ip route 192.168.30.0 255.255.255.0 10.0.23.2

R3(config)# ip route 192.168.10.0 255.255.255.0 10.0.23.1
R3(config)# ip route 192.168.10.0 255.255.255.0 10.0.13.1 5
R3(config)# ip route 192.168.10.10 255.255.255.255 10.0.13.1`} explain={[
          ['R2', 'Are rute în ambele direcții: LAN R1 și LAN R3.'],
          ['R3 … 10.0.23.1', 'Ruta de întoarcere principală prin R2.'],
          ['R3 … 10.0.13.1 5', 'Flotantă de întoarcere, direct la R1.'],
          ['… 192.168.10.10 255.255.255.255 …', 'Rută de gazdă (3.3.c): doar PC1 ia drumul direct.'],
        ]} />
      </Detailed>

      <Detailed title="Verificarea — în ordinea în care o faci">
        <CodeBlock title="Pasul 1: tabela de rutare (ilustrativ)" kind="session" code={`R1# show ip route static
Gateway of last resort is 10.0.12.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 10.0.12.2
S     192.168.30.0/24 [1/0] via 10.0.12.2

R1# show ip route 192.168.30.10
Routing entry for 192.168.30.0/24
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.0.12.2
      Route metric is 0, traffic share count is 1

R1# show ipv6 route static
S   2001:db8:30::/64 [1/0]
     via 2001:db8:12::2`} explain={[
          ['show ip route static', 'Doar rutele S: vezi imediat ce ai configurat și ce a ajuns în tabelă. Ruta flotantă (AD 5) lipsește: e normal.'],
          ['show ip route 192.168.30.10', 'Arată ruta pe care ar folosi-o un pachet către acea adresă (3.2).'],
          ['show ipv6 route static', 'La fel pentru IPv6.'],
        ]} />
        <CodeBlock title="Pasul 2: conectivitate end-to-end (ilustrativ)" kind="session" code={`PC1> ping 192.168.30.10
Pinging 192.168.30.10 with 32 bytes of data:
Reply from 192.168.30.10: bytes=32 time=2ms TTL=125

R1# traceroute 192.168.30.10
  1 10.0.12.2 4 msec
  2 10.0.23.2 6 msec
  3 192.168.30.10 8 msec`} explain={[
          ['TTL=125', 'Pornit de la 128 și scăzut cu 3: PC → R1 → R2 → R3 (3 routere traversate).'],
          ['traceroute', 'Arată fiecare hop de pe cale; ultimul hop este destinația. Verifică că traficul trece pe unde ai vrut.'],
        ]} />
        <CodeBlock title="Pasul 3: testează rezerva (ilustrativ)" kind="session" code={`R1(config)# interface g0/1
R1(config-if)# shutdown
R1(config-if)# end
R1# show ip route 192.168.30.0
Routing entry for 192.168.30.0/24
  Known via "static", distance 5, metric 0
  * 10.0.13.2

R1# show ip route static
S*    0.0.0.0/0 ... (ruta implicită prin R2 a dispărut: next hop-ul 10.0.12.2 nu mai e accesibil)`} explain={[
          ['shutdown pe g0/1', 'Simulează căderea legăturii principale.'],
          ['distance 5', 'Ruta flotantă s-a instalat.'],
          ['ruta implicită', 'Atenție: și ruta implicită folosea 10.0.12.2, deci a dispărut. Dacă vrei rezervă și pentru ea, adaugă o implicită flotantă pe 10.0.13.2.'],
        ]} />
      </Detailed>

      <Detailed title="Depanare — simptom → cauză probabilă">
        <Table head={['Simptom', 'Cauză probabilă', 'Verifică']} rows={[
          ['Ping din PC1: „Destination host unreachable” de la R1', 'R1 nu are rută pentru destinație (sau nici implicită)', 'show ip route <destinație>'],
          ['Ping: „Request timed out”, dar R1 are ruta', 'Lipsește ruta de întoarcere pe un router de pe cale', 'show ip route <IP-ul sursă> pe fiecare router'],
          ['Ruta e în running-config dar nu în tabelă', 'Next hop inaccesibil (nu e într-o rețea connected) sau interfață down', 'show ip interface brief; show ip route <next-hop>'],
          ['Ruta nu apare ca flotantă / preia traficul când nu trebuie', 'AD-ul flotantei e mai mic decât al rutei principale', 'show running-config | include ip route'],
          ['Ruta flotantă nu preia traficul la o cădere', 'Linkul principal e up/up, defectul e mai departe', 'show ip interface brief; traceroute'],
          ['IPv6: rutele nu funcționează', 'Lipsește ipv6 unicast-routing sau next hop link-local fără interfață', 'show running-config | include ipv6'],
          ['Trafic pe o cale neașteptată', 'O rută mai specifică (inclusiv /32) a câștigat prin longest prefix match', 'show ip route <destinație>'],
        ]} />
        <Reveal label="Exercițiu: de ce nu merge ping-ul de la PC1 la PC3?">
          <p>Imaginează-ți că R1 și R2 au rutele corecte, dar pe R3 ai uitat ruta către 192.168.10.0/24. Ping-ul din PC1 către PC3 dă „Request timed out”: cererea ajunge până la PC3 (R1 și R2 au rute pentru dus), PC3 răspunde către gateway-ul lui (R3), dar R3 nu are nicio rută către 192.168.10.0/24 și aruncă răspunsul. Din PC1 nu vezi nicio eroare. Verificarea corectă: <code>show ip route 192.168.10.10</code> pe R3 → „% Network not in table”.</p>
        </Reveal>
      </Detailed>
    </section>
  );
}
