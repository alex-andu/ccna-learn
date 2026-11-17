import { Callout, Detailed, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="3.1" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 3.1 este despre <b>citire</b>, dar ca să citești ceva util trebuie să știi cum apare fiecare tip de rută. Mai jos vezi ce comenzi generează ce linii (C, L, S, S*), cum filtrezi tabela, cum interoghezi o singură destinație și cum recunoști cauzele cele mai frecvente când o rută „lipsește”.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, cu adrese de laborator; nu au fost capturate de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Forma exactă (spații, antete, mesaje) variază între versiuni de IOS/IOS XE și Packet Tracer; în Packet Tracer lipsesc unele linii (de exemplu legenda poate fi mai scurtă). Configurarea rutelor statice este tratată complet în 3.3, OSPF în 3.4.
      </Callout>

      <Detailed title="Exemplul 1 — Ce rute apar când configurezi interfețe (C și L)">
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# interface gigabitethernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface gigabitethernet0/1
R1(config-if)# ip address 10.0.12.1 255.255.255.252
R1(config-if)# no shutdown`} explain={[
          ['ip address 192.168.1.1 255.255.255.0', 'Dă interfeței o adresă și o mască: din ea routerul deduce rețeaua 192.168.1.0/24.'],
          ['no shutdown', 'Pornește interfața; rutele C și L apar doar când interfața e up/up.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     10.0.12.1       YES manual up                    up

R1# show ip route connected
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.0.12.0/30 is directly connected, GigabitEthernet0/1
L        10.0.12.1/32 is directly connected, GigabitEthernet0/1
      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.1.0/24 is directly connected, GigabitEthernet0/0
L        192.168.1.1/32 is directly connected, GigabitEthernet0/0`} explain={[
          ['show ip interface brief', 'Confirmă că interfețele sunt up/up (Status și Protocol). Dacă una e down, rutele ei C/L lipsesc.'],
          ['show ip route connected', 'Afișează doar rutele C și L; vezi perechea C (rețea) + L (adresa routerului) pentru fiecare interfață.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Rute statice și implicită (S și S*)">
        <CodeBlock title="R1 (ilustrativ; detalii în 3.3)" kind="config" code={`R1(config)# ip route 192.168.3.0 255.255.255.0 10.0.12.2
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.12.2`} explain={[
          ['ip route 192.168.3.0 255.255.255.0 10.0.12.2', 'Prefix 192.168.3.0, mască 255.255.255.0, next hop 10.0.12.2 → apare ca S 192.168.3.0/24 [1/0] via 10.0.12.2.'],
          ['ip route 0.0.0.0 0.0.0.0 10.0.12.2', 'Ruta implicită: tot ce nu se potrivește altundeva merge la 10.0.12.2 → S* 0.0.0.0/0 și setează „Gateway of last resort”.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip route static
Gateway of last resort is 10.0.12.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 10.0.12.2
S     192.168.3.0/24 [1/0] via 10.0.12.2`} explain={[
          ['Gateway of last resort is 10.0.12.2 …', 'Antetul se actualizează imediat ce există o rută implicită validă.'],
          ['S* 0.0.0.0/0 [1/0]', 'Cod S*, AD 1, metrică 0.'],
          ['S 192.168.3.0/24 [1/0]', 'Rută statică obișnuită: AD 1, metrică 0, next hop 10.0.12.2.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Interogarea unei singure destinații">
        <p>Pe o tabelă mare nu citești tot; întrebi routerul <b>ce rută ar folosi</b> pentru o adresă. Comanda arată sursa, AD-ul, metrica, next hop-ul și interfața.</p>
        <CodeBlock title="Interogare (ilustrativ)" kind="session" code={`R1# show ip route 192.168.3.10
Routing entry for 192.168.3.0/24
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.0.12.2
      Route metric is 0, traffic share count is 1

R1# show ip route 8.8.8.8
Routing entry for 0.0.0.0/0, supernet
  Known via "static", distance 1, metric 0, candidate default path
  Routing Descriptor Blocks:
  * 10.0.12.2
      Route metric is 0, traffic share count is 1

R1# show ip route 172.20.0.0
% Network not in table`} explain={[
          ['show ip route 192.168.3.10', 'Pentru 192.168.3.10 routerul găsește ruta 192.168.3.0/24 (sursă static, AD 1, metrică 0).'],
          ['Known via "static", distance 1, metric 0', 'Cele trei informații din 3.1.a, 3.1.e și 3.1.f într-o singură linie.'],
          ['* 10.0.12.2', 'Next hop-ul rutei.'],
          ['show ip route 8.8.8.8', 'Fără rută specifică, ruta implicită răspunde („candidate default path”).'],
          ['% Network not in table', 'Nu există nicio rută pentru acea adresă (și nici rută implicită în acest exemplu).'],
        ]} />
        <Callout kind="tip" title="Comenzi utile de filtrare">
          <code>show ip route ospf</code> / <code>static</code> / <code>connected</code> arată doar o sursă. <code>show ip route | include 192.168</code> filtrează liniile. <code>show ip route 10.2.2.0 255.255.255.0</code> interoghează o rută exactă. <code>show ip cef 192.168.3.10</code> arată ce a precalculat FIB-ul (rezultatul final, cu interfața de ieșire).
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 4 — Aceeași idee în IPv6">
        <p>Tabela IPv6 are aceeași structură (cod, prefix/lungime, next hop, AD/metrică), dar un format de afișare puțin diferit: next hop-ul e pe linia următoare. Rutarea IPv6 trebuie pornită cu <code>ipv6 unicast-routing</code> (3.3).</p>
        <CodeBlock title="show ipv6 route (ilustrativ)" kind="session" code={`R1# show ipv6 route
IPv6 Routing Table - default - 5 entries
Codes: C - Connected, L - Local, S - Static, U - Per-user Static route
       O - OSPF Intra, OI - OSPF Inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
C   2001:DB8:1::/64 [0/0]
     via GigabitEthernet0/0, directly connected
L   2001:DB8:1::1/128 [0/0]
     via GigabitEthernet0/0, receive
S   2001:DB8:3::/64 [1/0]
     via 2001:DB8:12::2
S   ::/0 [1/0]
     via 2001:DB8:12::2
L   FF00::/8 [0/0]
     via Null0, receive`} explain={[
          ['C 2001:DB8:1::/64 [0/0]', 'Rețea conectată (cod C, AD 0, metrică 0).'],
          ['L 2001:DB8:1::1/128 [0/0]', 'Adresa locală, /128 (echivalentul lui /32 din IPv4).'],
          ['S 2001:DB8:3::/64 [1/0] via 2001:DB8:12::2', 'Rută statică IPv6: AD 1, metrică 0, next hop pe linia următoare.'],
          ['S ::/0', 'Ruta implicită IPv6 (echivalentul lui 0.0.0.0/0).'],
          ['L FF00::/8', 'Rută locală pentru traficul multicast IPv6; apare automat.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Citește singur tabela">
        <p>Folosind tabela din introducere (R1), răspunde, apoi deschide răspunsurile.</p>
        <Reveal label="1. Ce arată linia O 10.0.23.0/30 [110/2] via 10.0.12.2, 00:12:34, Gi0/1?">
          <p>Rută învățată prin OSPF (cod O), către rețeaua 10.0.23.0/30, cu AD 110 și metrică (cost) 2; next hop-ul este 10.0.12.2, a fost învățată/actualizată acum 12 min 34 s și iese pe Gi0/1.</p>
        </Reveal>
        <Reveal label="2. Unde ajunge un pachet către 8.8.8.8?">
          <p>Nu se potrivește cu nicio rută specifică; se aplică S* 0.0.0.0/0 și pachetul pleacă spre next hop-ul 10.0.12.2 (gateway of last resort).</p>
        </Reveal>
        <Reveal label="3. De ce există atât C 192.168.1.0/24 cât și L 192.168.1.1/32?">
          <p>C reprezintă rețeaua atașată (pentru gazdele de pe LAN), L reprezintă adresa routerului însuși; pachetele către 192.168.1.1 sunt livrate local, nu transmise.</p>
        </Reveal>
        <Reveal label="4. Ce înseamnă „10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks”?">
          <p>Este un antet de grupare: sub rețeaua clasică 10.0.0.0/8 apar 3 rute care folosesc 2 măști diferite (/30 și /32). Nu este o rută.</p>
        </Reveal>
      </Detailed>

      <Detailed title="Exemplul 6 — Rută „lipsă”: lista de verificare">
        <Table head={['Simptom', 'Cauză probabilă', 'Verificare']} hlCol={0} rows={[
          ['Lipsește C/L pentru o rețea', 'Interfață down, fără IP sau shutdown', <><code>show ip interface brief</code></>],
          ['Ruta S nu apare', 'Next hop inaccesibil (nu se rezolvă printr-o rută connected) sau interfața de ieșire down', <><code>show ip route &lt;next hop&gt;</code>, <code>show ip interface brief</code></>],
          ['Ruta dinamică O/D/R lipsește', 'Vecinul nu s-a format, protocolul nu anunță rețeaua, sau o sursă cu AD mai mic a luat locul', <><code>show ip protocols</code>, <code>show ip route &lt;prefix&gt;</code></>],
          ['Ruta apare dar ping-ul nu merge', 'Ruta e corectă, dar lipsește ruta de întoarcere pe celălalt router sau un ACL blochează', <>ping/traceroute; verifică tabela pe <b>ambele</b> capete</>],
          ['Gateway of last resort is not set', 'Nu există rută implicită', <><code>show ip route 0.0.0.0</code></>],
        ]} />
      </Detailed>
    </section>
  );
}
