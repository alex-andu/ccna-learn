import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabGuidedTopology, LabSoloTopology } from '../../diagrams/t1_9';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 'g1';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.9-G" title="Lab ghidat — tipuri de adrese pe un router și pe PC-uri (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> pe un singur router vezi toate tipurile de adrese din 1.9: global, link-local (automată și manuală), multicast <b>all-nodes</b>, <b>all-routers</b> și <G id="solicited-node" />, plus un Interface ID calculat prin <G id="eui64" />, pe care îl verifici și cu mâna.
          <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x (alternativ GNS3/CML) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat. LAN 1 folosește EUI-64 și SLAAC; LAN 2, adrese statice.">
        <LabGuidedTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă IPv6', 'Note']} rows={[
        ['R1', 'G0/0', '2001:db8:acad:1::/64 eui-64', 'LAN 1 (spre S1); Interface ID calculat din MAC'],
        ['R1', 'G0/1', '2001:db8:acad:2::1/64', 'LAN 2 (direct spre PC3)'],
        ['PC1, PC2', 'FastEthernet0', 'automat (SLAAC)', 'prin S1 (2960)'],
        ['PC3', 'FastEthernet0', '2001:db8:acad:2::10/64', 'static · gateway 2001:db8:acad:2::1'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer">
        PT suportă adrese globale, link-local manuale, <code>eui-64</code>, SLAAC pe PC-uri și afișarea grupurilor multicast în <code>show ipv6 interface</code>. Adresele temporare/aleatorii (privacy) nu sunt modelate în mod fiabil, iar suportul pentru anycast poate diferi între versiuni. Comenzile nu au fost testate pe echipamente reale; valorile MAC vor fi diferite la tine.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Construiește topologia">
          <p>Un router 2911 (<code>R1</code>), un switch 2960 (<code>S1</code>), trei PC-uri. Cabluri <b>Copper Straight-Through</b>: R1 <code>G0/0</code> → S1; PC1 și PC2 → S1. PC3 conectat direct la R1 <code>G0/1</code> cu cablu <b>Copper Cross-Over</b> (host la router).</p>
        </Step>
        <Step labKey={L} n={2} title="Configurează R1">
          <CodeBlock title="R1" code={`enable
configure terminal
hostname R1
ipv6 unicast-routing
interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:1::/64 eui-64
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:2::1/64
 no shutdown
end`} explain={[
            ['ipv6 unicast-routing', 'Pornește rutarea și trimiterea RA-urilor; routerul intră în grupul all-routers (FF02::2).'],
            ['ipv6 address 2001:db8:acad:1::/64 eui-64', <>Doar prefixul; IOS calculează Interface ID-ul din MAC-ul lui G0/0 (<G id="eui64" />).</>],
            ['ipv6 address 2001:db8:acad:2::1/64', 'Adresă statică completă pe LAN 2.'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Citește adresele generate">
          <CodeBlock title="R1" kind="session" code={`R1# show ipv6 interface brief
R1# show interfaces g0/0 | include address`} explain={[
            ['show ipv6 interface brief', <>Vezi două adrese pe G0/0: <b>link-local</b> <code>FE80::…</code> (automată) și <b>GUA-ul</b> <code>2001:DB8:ACAD:1:…</code>. Ultimii 64 de biți sunt identici în ambele — același Interface ID.</>],
            ['show interfaces g0/0 | include address', <>Arată adresa MAC a interfeței (în format <code>xxxx.xxxx.xxxx</code>). O folosești la pasul următor.</>],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="Verifică EUI-64 cu mâna">
          <p>Ia MAC-ul lui G0/0 și derivă Interface ID-ul: (1) împarte MAC-ul în două jumătăți, (2) inserează <code>FFFE</code> la mijloc, (3) inversează bitul 7 din primul octet (a doua cifră hexa: 0↔2, 1↔3, 4↔6, 5↔7, 8↔A, 9↔B, C↔E, D↔F). Compară rezultatul cu ultimii 64 de biți ai GUA-ului.</p>
          <Reveal label="Exemplu și întrebare de control"><p>Pentru MAC <code>00:11:22:33:44:55</code> obții IID <code>0211:22ff:fe33:4455</code>, deci GUA <code>2001:db8:acad:1:211:22ff:fe33:4455</code> și link-local <code>fe80::211:22ff:fe33:4455</code>. Dacă primul octet al MAC-ului tău este <code>00</code> și vezi <code>02</code> în IID, ai aplicat corect inversarea.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Hosturile: SLAAC și adresă statică">
          <p>PC1 și PC2: <P>Desktop → IP Configuration</P> → IPv6 <b>Automatic</b>. PC3: <b>Static</b>, adresă <code>2001:db8:acad:2::10</code>, prefix <code>64</code>, gateway <code>2001:db8:acad:2::1</code>. Din <P>Command Prompt</P>, <code>ipconfig</code> pe PC1: ce prefix a primit și care este gateway-ul? <code>ping 2001:db8:acad:2::10</code> de pe PC1 trebuie să reușească.</p>
        </Step>
        <Step labKey={L} n={6} title="Grupurile multicast ale routerului">
          <CodeBlock title="R1" kind="session" code={`R1# show ipv6 interface g0/0
...
  Joined group address(es):
    FF02::1
    FF02::2
    FF02::1:FFxx:xxxx`} explain={[
            ['FF02::1', 'All-nodes: orice interfață IPv6 aderă automat.'],
            ['FF02::2', 'All-routers: apare după ipv6 unicast-routing.'],
            ['FF02::1:FFxx:xxxx', <>Solicited-node: <code>ff02::1:ff</code> + ultimii 24 de biți ai adresei. Calculează-l pentru GUA-ul tău și verifică.</>],
          ]} />
          <Reveal label="De ce sunt (de obicei) două grupuri solicited-node?"><p>Există câte un grup pentru fiecare adresă unicast, dar adresele cu aceiași ultimi 24 de biți împart grupul. GUA-ul și link-local-ul cu același Interface ID au același sfârșit, deci același grup; adresa de pe altă interfață produce alt grup.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Link-local manual: fe80::1 pe ambele interfețe">
          <CodeBlock title="R1" code={`configure terminal
interface GigabitEthernet0/0
 ipv6 address fe80::1 link-local
interface GigabitEthernet0/1
 ipv6 address fe80::1 link-local
end`} explain={[
            ['ipv6 address fe80::1 link-local', <>Înlocuiește link-local-ul automat cu <code>fe80::1</code>. Aceeași valoare pe ambele interfețe este permisă: o adresă link-local contează doar pe legătura ei (<G id="link-local" />).</>],
          ]} />
          <p>Rulează din nou <code>show ipv6 interface brief</code>: link-local-ul este acum <code>FE80::1</code>. Ce s-a schimbat în grupurile solicited-node? Pe PC1, repetă <code>ipconfig</code> și vezi care este gateway-ul.</p>
        </Step>
        <Step labKey={L} n={8} title="Observă NDP în Simulation mode">
          <p>Comută în <b>Simulation mode</b>, filtrează <b>ICMPv6</b>. Pe PC1 reîncarcă IPv6 <b>Automatic</b> sau dă <code>ping 2001:db8:acad:2::10</code>. Urmărește mesajele (RS/RA, NS/NA). La ce adrese destinație sunt trimise? Compară cu grupurile din pasul 6 (all-routers, solicited-node).</p>
        </Step>
      </Detailed>

      <Reveal label="Soluție completă — rezumat">
        <CodeBlock title="R1 (final)" code={`hostname R1
ipv6 unicast-routing
interface GigabitEthernet0/0
 ipv6 address 2001:db8:acad:1::/64 eui-64
 ipv6 address fe80::1 link-local
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:acad:2::1/64
 ipv6 address fe80::1 link-local
 no shutdown`} />
        <ul>
          <li><b>Pasul 6:</b> grupurile sunt FF02::1, FF02::2 și solicited-node; calculul: GUA <code>…:211:22ff:fe33:4455</code> → <code>ff02::1:ff33:4455</code>.</li>
          <li><b>Pasul 7:</b> cu <code>fe80::1</code> apare grupul <code>ff02::1:ff00:1</code> (sunt ultimii 24 de biți ai lui fe80::1); GUA-ul <code>…::1</code> din LAN 2 merge în același grup (<code>ff02::1:ff00:1</code>).</li>
          <li>Gateway-ul PC1: adresa link-local a lui R1, <code>FE80::1</code>, din RA.</li>
          <li>Mesajele NDP: RS către <code>ff02::2</code>; NS către <code>ff02::1:ffXX:XXXX</code>; RA neîntrebat către <code>ff02::1</code>.</li>
        </ul>
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
      <SectionHead id="lab-solo" code="LAB 1.9-S" title="Lab solo — EUI-64 pe un router și pe două PC-uri" />
      <Summary>
        <p><b>Scenariu:</b> R1 are două LAN-uri (<code>2001:db8:cafe:a::/64</code> și <code>2001:db8:cafe:b::/64</code>), iar toate Interface ID-urile se obțin prin <b>EUI-64</b>. Ți se dau adresele MAC; calculezi singur adresele și apoi verifici în simulator. Rezolvă fără indicii, apoi compară cu soluția.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer / GNS3 / CML</p>
      </Summary>
      <Figure caption="Topologia labului solo, cu adresele MAC ale interfețelor.">
        <LabSoloTopology />
      </Figure>
      <Detailed title="Cerințe">
        <Step labKey={L} n={1} title="Calculează pe hârtie">
          <p>Pentru fiecare dintre următoarele patru MAC-uri, derivă: <b>Interface ID (EUI-64)</b>, adresa <b>link-local</b>, adresa <b>globală</b> din prefixul lui și grupul <b>solicited-node</b>: (a) R1 G0/0: <code>0011.2233.4455</code>; (b) R1 G0/1: <code>00e0.f7a1.0b2c</code>; (c) PC-A: <code>0a1b.2c3d.4e5f</code>; (d) PC-B: <code>6c3b.e59a.01ff</code>. Scrie adresele în forma scurtă.</p>
        </Step>
        <Step labKey={L} n={2} title="Configurează R1">
          <p>Activează rutarea IPv6 și configurează ambele interfețe cu prefixul /64 și <code>eui-64</code>.</p>
        </Step>
        <Step labKey={L} n={3} title="Verifică">
          <p>PC-urile pe <b>Automatic</b>. Compară ce arată <code>show ipv6 interface brief</code> și <code>ipconfig</code> cu valorile calculate. Dacă PC-urile folosesc alt Interface ID (aleatoriu), explică de ce, folosind lecția.</p>
        </Step>
        <Step labKey={L} n={4} title="Clasifică">
          <p>Spune tipul și scope-ul pentru fiecare: <code>fe80::1</code>, <code>fd12:3456:789a::1</code>, <code>2001:db8::1</code>, <code>ff02::2</code>, <code>ff05::2</code>, <code>fec0::1</code>, <code>::1</code>, <code>2a02:2f0a:1::1</code>.</p>
        </Step>
        <Step labKey={L} n={5} title="Întrebări de înțelegere">
          <ul>
            <li>De ce un MAC care începe cu <code>0a</code> are în IID prima cifră <code>08</code>, dar unul care începe cu <code>6c</code> are <code>6e</code>?</li>
            <li>Ce adresă MAC multicast corespunde grupului solicited-node al lui R1 G0/0?</li>
            <li>De ce poți pune <code>fe80::1</code> pe ambele interfețe ale lui R1, dar nu aceeași adresă globală?</li>
          </ul>
        </Step>
      </Detailed>

      <Reveal label="Soluție completă">
        <Table head={['Dispozitiv', 'MAC', 'Interface ID', 'Link-local', 'Global', 'Solicited-node']} rows={[
          ['R1 G0/0', '0011.2233.4455', '0211:22ff:fe33:4455', 'fe80::211:22ff:fe33:4455', '2001:db8:cafe:a:211:22ff:fe33:4455', 'ff02::1:ff33:4455'],
          ['R1 G0/1', '00e0.f7a1.0b2c', '02e0:f7ff:fea1:0b2c', 'fe80::2e0:f7ff:fea1:b2c', '2001:db8:cafe:b:2e0:f7ff:fea1:b2c', 'ff02::1:ffa1:b2c'],
          ['PC-A', '0a1b.2c3d.4e5f', '081b:2cff:fe3d:4e5f', 'fe80::81b:2cff:fe3d:4e5f', '2001:db8:cafe:a:81b:2cff:fe3d:4e5f', 'ff02::1:ff3d:4e5f'],
          ['PC-B', '6c3b.e59a.01ff', '6e3b:e5ff:fe9a:01ff', 'fe80::6e3b:e5ff:fe9a:1ff', '2001:db8:cafe:b:6e3b:e5ff:fe9a:1ff', 'ff02::1:ff9a:1ff'],
        ]} />
        <CodeBlock title="R1" code={`ipv6 unicast-routing
interface GigabitEthernet0/0
 ipv6 address 2001:db8:cafe:a::/64 eui-64
 no shutdown
interface GigabitEthernet0/1
 ipv6 address 2001:db8:cafe:b::/64 eui-64
 no shutdown`} />
        <ul>
          <li><b>Inversarea bitului 7:</b> <code>0a</code> = 0000 1010 → bitul 0x02 este 1 → devine 0 → <code>08</code>. <code>6c</code> = 0110 1100 → bitul 0x02 este 0 → devine 1 → <code>6e</code>. Este o inversare, nu o setare.</li>
          <li><b>MAC multicast pentru ff02::1:ff33:4455:</b> <code>33:33:ff:33:44:55</code> (ultimii 32 de biți ai grupului, după <code>33:33</code>).</li>
          <li><b>fe80::1 pe două interfețe:</b> link-local contează doar pe propria legătură; o adresă globală trebuie să fie unică în rețea, iar două interfețe cu aceeași adresă globală ar crea ambiguitate de rutare.</li>
          <li><b>Clasificare:</b> <code>fe80::1</code> link-local · <code>fd12:3456:789a::1</code> ULA · <code>2001:db8::1</code> GUA (documentație) · <code>ff02::2</code> multicast, all-routers, link-local · <code>ff05::2</code> multicast, all-routers, site-local · <code>fec0::1</code> site-local, depreciat · <code>::1</code> loopback · <code>2a02:2f0a:1::1</code> GUA.</li>
          <li><b>Hosturile moderne</b> folosesc de regulă Interface ID aleatoriu (RFC 7217/8981), deci valorile calculate se potrivesc exact doar pe echipamente care folosesc EUI-64 (routere Cisco); în PT, PC-urile pot genera EUI-64.</li>
        </ul>
        <Callout kind="warn">Comenzile nu au fost testate pe echipamente reale. În GNS3/CML, MAC-urile interfețelor sunt generate de emulator și nu coincid cu cele din enunț; urmează aceeași metodă cu MAC-urile tale.</Callout>
      </Reveal>
    </section>
  );
}
