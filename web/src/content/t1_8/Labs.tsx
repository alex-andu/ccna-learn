import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabGuidedTopologyV6, LabSoloTopologyV6 } from '../../diagrams/t1_8';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 'g1';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.8-G" title="Lab ghidat — două LAN-uri IPv6, SLAAC și adrese statice (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> adresezi două routere cu adrese IPv6 statice, observi că hostii <G id="slaac" /> nu primesc nimic <b>fără</b> <code>ipv6 unicast-routing</code>, activezi comanda și urmărești cum își iau PC-urile prefixul și gateway-ul, apoi legi cele două LAN-uri cu rute statice și verifici conectivitatea.
          <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x (alternativ GNS3/CML) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat.">
        <LabGuidedTopologyV6 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă IPv6', 'Note']} rows={[
        ['R1', 'G0/0', '2001:db8:acad:1::1/64', 'LAN 1 · link-local fe80::1'],
        ['R1', 'G0/1', '2001:db8:acad:ff::1/64', 'legătura R1–R2 · link-local fe80::1'],
        ['R2', 'G0/0', '2001:db8:acad:2::1/64', 'LAN 2 · link-local fe80::1'],
        ['R2', 'G0/1', '2001:db8:acad:ff::2/64', 'legătura R1–R2 · link-local fe80::1'],
        ['PC1, PC2', 'FastEthernet0', 'SLAAC (automat)', 'LAN 1 prin SW1'],
        ['PC3', 'FastEthernet0', 'SLAAC (automat)', 'LAN 2 prin SW2'],
        ['PC4', 'FastEthernet0', '2001:db8:acad:2::10/64', 'static · gateway 2001:db8:acad:2::1'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer">
        Packet Tracer suportă adrese IPv6 statice, link-local configurabil, <code>eui-64</code>, SLAAC pe PC-uri și rute statice IPv6. Detalii precum generarea de Interface ID aleatoriu (privacy) sau mesaje de eroare la adrese duplicate pot diferi de un sistem real. Comenzile nu au fost testate pe echipamente reale; numele interfețelor depind de modelul ales.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Construiește topologia">
          <p>Două routere (<code>R1</code>, <code>R2</code>), două switch-uri 2960 (<code>SW1</code>, <code>SW2</code>) și patru PC-uri. Cabluri <b>Copper Straight-Through</b>: PC1 și PC2 → SW1; SW1 → R1 <code>G0/0</code>; PC3 și PC4 → SW2; SW2 → R2 <code>G0/0</code>. Între routere: <b>Copper Cross-Over</b> R1 <code>G0/1</code> ↔ R2 <code>G0/1</code>.</p>
        </Step>
        <Step labKey={L} n={2} title="Adresează R1 — fără ipv6 unicast-routing, încă">
          <CodeBlock title="R1" code={`enable
configure terminal
hostname R1
interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:1::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:ff::1/64
 ipv6 address fe80::1 link-local
 no shutdown
end`} explain={[
            ['ipv6 address 2001:db8:acad:1::1/64', 'Adresă globală statică pe LAN 1 (prefixul /64 al rețelei este 2001:db8:acad:1::/64).'],
            ['ipv6 address fe80::1 link-local', 'Link-local fixă, ușor de reținut — gateway-ul hostilor.'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Adresează R2">
          <CodeBlock title="R2" code={`enable
configure terminal
hostname R2
interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:2::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:ff::2/64
 ipv6 address fe80::1 link-local
 no shutdown
end`} />
        </Step>
        <Step labKey={L} n={4} title="Verifică local">
          <CodeBlock title="R1" kind="session" code={`R1# show ipv6 interface brief
R1# ping 2001:db8:acad:ff::2`} explain={[
            ['show ipv6 interface brief', 'Ambele interfețe trebuie să fie [up/up], cu fe80::1 și GUA-ul respectiv.'],
            ['ping 2001:db8:acad:ff::2', 'Ping între cele două routere pe legătura comună: trebuie să reușească (!!!!!).'],
          ]} />
          <Reveal label="Ping eșuează?"><ul>
            <li>Interfață „administratively down” (lipsește <code>no shutdown</code>)?</li>
            <li>Prefix greșit sau adrese în rețele diferite (de exemplu <code>:ff::</code> pe un capăt și <code>:fe::</code> pe celălalt)?</li>
            <li>Cablu greșit (cross-over între routere)?</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Experimentul: PC-urile SLAAC, înainte de ipv6 unicast-routing">
          <p>Pe PC1: <P>Desktop → IP Configuration</P> → la IPv6 alege <b>Automatic</b>. Apoi <code>ipconfig</code> în Command Prompt. Rezultat așteptat: doar adresa <b>link-local</b> (<code>FE80::…</code>), fără adresă globală și fără gateway.</p>
          <Reveal label="De ce?"><p>Routerul nu a primit încă <code>ipv6 unicast-routing</code>, deci nu trimite <G id="ra" />. Fără RA, hostul nu află prefixul <code>2001:db8:acad:1::/64</code>; are doar adresa pe care și-o construiește singur pentru legătura locală.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Activează ipv6 unicast-routing pe ambele routere">
          <CodeBlock title="R1 și R2" code={`configure terminal
ipv6 unicast-routing
end`} explain={[
            ['ipv6 unicast-routing', <>Routerul începe să trimită RA-uri pe interfețele cu adresă IPv6 și să aparțină grupului <code>FF02::2</code> (all-routers).</>],
          ]} />
          <p>După câteva secunde (sau după <code>ipconfig</code> repetat, ori „Automatic” bifat din nou), PC1, PC2 și PC3 primesc adresă globală din prefixul rețelei lor.</p>
          <CodeBlock title="PC1 — Command Prompt" kind="session" code={`C:\\> ipconfig
   IPv6 Address....................: 2001:DB8:ACAD:1:xxxx:xxxx:xxxx:xxxx
   Link-local IPv6 Address.........: FE80::xxxx:xxxx:xxxx:xxxx
   Default Gateway.................: FE80::1`} explain={[
            ['IPv6 Address 2001:DB8:ACAD:1:…', <>Prefixul vine din RA (<code>2001:db8:acad:1::/64</code>); ultimii 64 de biți sunt Interface ID-ul generat de PC (compară-l cu MAC-ul din <P>Config</P>: dacă vezi <code>FFFE</code> la mijloc, e EUI-64).</>],
            ['Default Gateway: FE80::1', <>Gateway-ul este adresa <b>link-local</b> a routerului — exact <code>fe80::1</code> setat de tine, anunțat prin RA.</>],
          ]} />
        </Step>
        <Step labKey={L} n={7} title="Configurează PC4 static">
          <p>Pe PC4: <P>Desktop → IP Configuration</P> → IPv6 <b>Static</b>: adresă <code>2001:db8:acad:2::10</code>, prefix <code>64</code>, gateway <code>2001:db8:acad:2::1</code>. Verifică ping către <code>2001:db8:acad:2::1</code>.</p>
        </Step>
        <Step labKey={L} n={8} title="Leagă cele două LAN-uri cu rute statice (previzualizare 3.x)">
          <CodeBlock title="R1 și R2" code={`! pe R1
configure terminal
ipv6 route 2001:db8:acad:2::/64 2001:db8:acad:ff::2
end
! pe R2
configure terminal
ipv6 route 2001:db8:acad:1::/64 2001:db8:acad:ff::1
end`} explain={[
            ['ipv6 route 2001:db8:acad:2::/64 2001:db8:acad:ff::2', <>Spune lui R1: „pentru LAN 2, trimite către adresa <code>…ff::2</code> (R2)”. Rutarea statică este obiectivul 3.3; aici o folosești doar ca să poți testa conectivitatea.</>],
          ]} />
        </Step>
        <Step labKey={L} n={9} title="Verifică conectivitatea și tabela de rutare">
          <CodeBlock title="PC1 și R1" kind="session" code={`C:\\> ping 2001:db8:acad:2::10
Reply from 2001:DB8:ACAD:2::10: bytes=32 time<1ms TTL=126
R1# show ipv6 route
C   2001:DB8:ACAD:1::/64 [0/0]
     via GigabitEthernet0/0, directly connected
L   2001:DB8:ACAD:1::1/128 [0/0]
     via GigabitEthernet0/0, receive
S   2001:DB8:ACAD:2::/64 [1/0]
     via 2001:DB8:ACAD:FF::2`} explain={[
            ['ping 2001:db8:acad:2::10', 'De la PC1 (LAN 1) la PC4 (LAN 2), prin R1 și R2. Dacă reușește, adresarea, prefixele și rutele sunt corecte.'],
            ['C / L / S', <>C = rețea conectată (/64), L = adresa proprie a routerului (/128), S = ruta statică la LAN 2. Adresele link-local nu apar în tabelă.</>],
          ]} />
          <Reveal label="Nu merge ping-ul între LAN-uri?"><ul>
            <li>Ruta statică are adresa next-hop greșită (verifică <code>ff::1</code> / <code>ff::2</code>)?</li>
            <li>Lipsește ruta de întoarcere pe celălalt router?</li>
            <li>PC4 nu are gateway corect?</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={10} title="Experimente de înțelegere">
          <ul>
            <li>Scrie adresa lui PC4 în forma completă (8 hextete cu 4 cifre) și apoi în forma cea mai scurtă.</li>
            <li>Care este prefixul /64 pe care îl calculează R2 pentru adresa <code>2001:db8:acad:2::1/64</code>? Verifică în <code>show ipv6 interface g0/0</code> la „subnet is”.</li>
            <li>Comută în <b>Simulation mode</b>, filtrează <b>ICMPv6</b> și urmărește mesajele RS/RA și NS/NA când pornești un PC.</li>
          </ul>
        </Step>
      </Detailed>

      <Reveal label="Soluție completă — rezumat">
        <CodeBlock title="R1 (final)" code={`hostname R1
ipv6 unicast-routing
interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:1::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:ff::1/64
 ipv6 address fe80::1 link-local
 no shutdown
ipv6 route 2001:db8:acad:2::/64 2001:db8:acad:ff::2`} />
        <CodeBlock title="R2 (final)" code={`hostname R2
ipv6 unicast-routing
interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:2::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:ff::2/64
 ipv6 address fe80::1 link-local
 no shutdown
ipv6 route 2001:db8:acad:1::/64 2001:db8:acad:ff::1`} />
        <p className="small muted">PC4 în formă completă: <code>2001:0db8:acad:0002:0000:0000:0000:0010</code>; forma scurtă: <code>2001:db8:acad:2::10</code>. GNS3/CML: aceleași comenzi pe IOSv.</p>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 's1';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.8-S" title="Lab solo — planul de adresare pentru un site cu trei LAN-uri" />
      <Summary>
        <p><b>Scenariu:</b> firma primește prefixul <code>2001:db8:c0de::/48</code>. Sediul HQ are două LAN-uri (VLAN 10 și VLAN 20), filiala BRANCH are unul (VLAN 30), iar HQ și BRANCH sunt legate printr-o legătură WAN. Tu faci planul de numerotare, configurezi tot și verifici. Rezolvă fără indicii, apoi compară cu soluția.
          <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Packet Tracer / GNS3 / CML</p>
      </Summary>
      <Figure caption="Topologia labului solo. Semnele de întrebare sunt prefixele pe care trebuie să le alegi.">
        <LabSoloTopologyV6 />
      </Figure>
      <Detailed title="Cerințe">
        <Step labKey={L} n={1} title="Planul de adresare">
          <p>Alege câte un /64 din <code>2001:db8:c0de::/48</code> pentru LAN-A, LAN-B, LAN-C și legătura WAN. Convenția cerută: Subnet ID-ul LAN-urilor <b>seamănă cu numărul VLAN-ului</b> (10, 20, 30), iar legătura WAN folosește <code>ff</code>. Notează toate prefixele în formă scurtă.</p>
        </Step>
        <Step labKey={L} n={2} title="Adresarea routerelor">
          <p>Pe fiecare interfață: adresa <code>::1</code> din prefixul ei (HQ pe WAN primește <code>::1</code>, BRANCH pe WAN primește <code>::2</code>) și link-local <code>fe80::1</code>. Activează rutarea IPv6 pe ambele routere.</p>
        </Step>
        <Step labKey={L} n={3} title="Hosturile">
          <p>PC-A1, PC-A2, PC-B1 și PC-C1: <b>SLAAC</b>. Serverul <b>SRV</b> (LAN-B): adresă statică <code>::100</code> din prefixul LAN-B, gateway <code>::1</code> al LAN-B.</p>
        </Step>
        <Step labKey={L} n={4} title="Rutarea">
          <p>Adaugă rute statice IPv6 astfel încât orice LAN să poată ajunge la oricare altul (HQ trebuie să știe de LAN-C, BRANCH de LAN-A și LAN-B).</p>
        </Step>
        <Step labKey={L} n={5} title="Verificare și întrebări">
          <ul>
            <li>PC-C1 → <code>ping</code> către SRV. Ce arată <code>show ipv6 route</code> pe BRANCH?</li>
            <li>Scrie adresa SRV în forma completă și apoi scurtă.</li>
            <li>Câte subrețele /64 mai poți crea din /48, după ce ai folosit patru? Dar în total?</li>
            <li>Ce se întâmplă cu PC-urile SLAAC dacă ștergi <code>ipv6 unicast-routing</code> de pe HQ? De ce?</li>
          </ul>
        </Step>
      </Detailed>

      <Reveal label="Soluție completă">
        <Table head={['Rețea', 'Prefix', 'Adrese router']} rows={[
          ['LAN-A (VLAN 10)', '2001:db8:c0de:10::/64', 'HQ G0/0: 2001:db8:c0de:10::1/64'],
          ['LAN-B (VLAN 20)', '2001:db8:c0de:20::/64', 'HQ G0/1: 2001:db8:c0de:20::1/64'],
          ['LAN-C (VLAN 30)', '2001:db8:c0de:30::/64', 'BRANCH G0/0: 2001:db8:c0de:30::1/64'],
          ['WAN', '2001:db8:c0de:ff::/64', 'HQ G0/2: …:ff::1/64 · BRANCH G0/2: …:ff::2/64'],
        ]} />
        <CodeBlock title="HQ" code={`hostname HQ
ipv6 unicast-routing
interface GigabitEthernet0/0
 ipv6 address 2001:db8:c0de:10::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:c0de:20::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/2
 ipv6 address 2001:db8:c0de:ff::1/64
 ipv6 address fe80::1 link-local
 no shutdown
ipv6 route 2001:db8:c0de:30::/64 2001:db8:c0de:ff::2`} />
        <CodeBlock title="BRANCH" code={`hostname BRANCH
ipv6 unicast-routing
interface GigabitEthernet0/0
 ipv6 address 2001:db8:c0de:30::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/2
 ipv6 address 2001:db8:c0de:ff::2/64
 ipv6 address fe80::1 link-local
 no shutdown
ipv6 route 2001:db8:c0de:10::/64 2001:db8:c0de:ff::1
ipv6 route 2001:db8:c0de:20::/64 2001:db8:c0de:ff::1`} />
        <ul>
          <li><b>SRV:</b> <code>2001:db8:c0de:20::100/64</code> (complet: <code>2001:0db8:c0de:0020:0000:0000:0000:0100</code>), gateway <code>2001:db8:c0de:20::1</code>.</li>
          <li><b>Capacitate:</b> /48 → 65.536 de /64 în total; după 4 folosite rămân 65.532.</li>
          <li><b>Fără ipv6 unicast-routing pe HQ:</b> HQ nu mai trimite RA și nu mai rutează IPv6; PC-urile SLAAC din LAN-A și LAN-B nu mai primesc prefix și gateway (cele care au deja adrese le păstrează până expiră).</li>
          <li><b>Notă:</b> convenția „VLAN 10 → :10::” este de lizibilitate; subrețeaua :10:: este numărul 16 în zecimal.</li>
        </ul>
        <Callout kind="warn">Comenzile nu au fost testate pe echipamente reale. VLAN-urile 10/20/30 sunt doar etichete în plan; în laborator, switch-urile pot rămâne în VLAN 1 fără impact asupra rezultatului.</Callout>
      </Reveal>
    </section>
  );
}
