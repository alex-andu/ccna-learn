import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { AddressClassifier, AnycastMap, ArpVsNs, CastModes, Eui64Converter, GuaStructure, LinkLocalScope, MulticastDecoder, SolicitedNodeCalc, UlaBuilder } from '../../diagrams/t1_9';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.9" title="Tipuri de adrese IPv6 — harta" />
      <Summary>
        <p>IPv6 are trei categorii de adrese: <b><G id="unicast" /></b> (către un singur dispozitiv), <b><G id="anycast" /></b> (către cel mai apropiat dintr-un grup) și <b><G id="multicast" /></b> (către un grup). <b>Broadcast nu există</b>. Obiectivul 1.9 cere să le recunoști după prefix și rol:
          unicast global (<G id="gua" />, <code>2000::/3</code>), unique local (<G id="ula" />, <code>fc00::/7</code>), link-local (<code>fe80::/10</code>), apoi anycast, multicast (<code>ff00::/8</code>) și <b>Modified EUI-64</b>.</p>
      </Summary>

      <Detailed>
        <p>Spre deosebire de IPv4, unde un host are de obicei o singură adresă, o interfață IPv6 are <b>mai multe adrese în același timp</b>: o adresă link-local (obligatorie), una sau mai multe adrese globale sau ULA și o serie de adrese multicast la care „ascultă”. De aceea, nu e suficient să știi o singură adresă: trebuie să le recunoști pe toate după prefix.</p>
        <Table head={['Tip', 'Prefix', 'Domeniu (scope)', 'Rutat pe Internet?', 'Secțiune']} hlCol={0} rows={[
          [<>Unicast global (<G id="gua" />)</>, <code>2000::/3</code>, 'global', 'da', '1.9.a'],
          [<>Unique local (<G id="ula" />)</>, <><code>fc00::/7</code> (în practică <code>fd00::/8</code>)</>, 'în interiorul organizației', 'nu', '1.9.a'],
          [<>Link-local (<G id="link-local" />)</>, <><code>fe80::/10</code> (în practică <code>fe80::/64</code>)</>, 'o singură legătură', 'nu — nici măcar peste un router', '1.9.a'],
          ['Loopback', <code>::1/128</code>, 'nodul însuși', 'nu', '1.9.a (special)'],
          ['Nespecificată', <code>::/128</code>, '—', 'nu', '1.9.a (special)'],
          ['Anycast', 'din spațiul unicast', 'depinde', 'depinde', '1.9.b'],
          ['Multicast', <code>ff00::/8</code>, 'de la interfață la global', 'de regulă nu', '1.9.c'],
        ]} />
        <Figure caption="Interactiv: lipește orice adresă IPv6 și află tipul, scope-ul și structura ei. Încearcă exemplele-capcană.">
          <AddressClassifier />
        </Figure>
        <Callout kind="info" title="Ce a dispărut: site-local">
          Blocul <code>fec0::/10</code> („site-local”) a fost folosit în trecut ca echivalent al adreselor private, dar a fost <b>declarat depreciat</b> (2004). Dacă îl vezi într-un răspuns de examen, este distractor. Rolul lui este preluat de ULA.
        </Callout>
        <Analogy>Gândește-te la adrese ca la modalități de a livra o scrisoare: unicast = scrisoare către o singură persoană; multicast = buletin trimis tuturor abonaților; anycast = „trimite la oricare ghișeu din apropiere”. Broadcast („strigă în toată piața”) nu mai există: ar deranja pe toată lumea.</Analogy>
      </Detailed>

      <Traps items={[
        <>IPv6 <b>nu are broadcast</b>. Rolul lui este preluat de multicast (de exemplu <code>ff02::1</code> = toate nodurile).</>,
        <>O interfață IPv6 are <b>mai multe adrese</b> simultan; adresa link-local există mereu.</>,
      ]} />
      <InlineQuiz ids={['1.9-001', '1.9-002']} />
    </section>
  );
}

/* ======================================================================
   1. Unicast global
   ====================================================================== */
export function GlobalUnicast() {
  return (
    <section id="gua" className="section">
      <SectionHead id="gua" code="1.9.a" title="Unicast global (GUA) și adresele speciale" />
      <Summary>
        <p>Adresa <b>globală</b> este echivalentul adresei publice IPv4: unică în Internet și rutabilă oriunde. Face parte din <code>2000::/3</code> (adică prima cifră hexa este 2 sau 3). Structura tipică: <b>prefix global (48) + Subnet ID (16) + Interface ID (64)</b>.
          Exemplele din cărți folosesc blocul de documentație <code>2001:db8::/32</code>.</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <Figure caption="Interactiv: structura unei adrese globale, cu cele trei părți evidențiate.">
          <GuaStructure />
        </Figure>
        <p>IANA alocă în prezent adrese unicast globale doar din <code>2000::/3</code> (prima cifră: 2 sau 3). În practică, adresele reale din Europa încep cu <code>2a02</code> sau <code>2001</code>. <b>Echivalent IPv4:</b> adresele publice.</p>
        <h3>Adrese speciale pe care trebuie să le recunoști</h3>
        <Table head={['Adresă', 'Nume', 'Rol']} rows={[
          [<code>::/128</code>, 'Unspecified', 'sursă într-un mesaj trimis înainte ca nodul să aibă adresă (de exemplu la DAD); nu se configurează pe interfețe'],
          [<code>::1/128</code>, 'Loopback', <>echivalentul lui 127.0.0.1, dar este <i>o singură</i> adresă (nu un /8); <code>ping ::1</code> testează stiva locală</>],
          [<code>2001:db8::/32</code>, 'Documentation', 'folosit în exemple și laburi; nu se rutează în Internet'],
          [<code>::ffff:0:0/96</code>, 'IPv4-mapped', <>ex. <code>::ffff:192.0.2.1</code> — reprezintă o adresă IPv4 într-un format IPv6</>],
        ]} />
      </Detailed>

      <Traps items={[
        <>GUA începe cu <b>2</b> sau <b>3</b> (<code>2000::/3</code>). <code>2001:db8::/32</code> este documentație, nu rutabilă pe Internet.</>,
        <>Loopback este <code>::1</code> (nu <code>::127</code>) și este <b>o singură adresă</b>.</>,
      ]} />
      <InlineQuiz ids={['1.9-003', '1.9-004', '1.9-005']} />
    </section>
  );
}

/* ======================================================================
   2. ULA
   ====================================================================== */
export function Ula() {
  return (
    <section id="ula" className="section">
      <SectionHead id="ula" code="1.9.a" title="Unique Local Address (ULA) — adresele „private” IPv6" />
      <Summary>
        <p><G id="ula" /> (<code>fc00::/7</code>, în practică <code>fd00::/8</code>) sunt adrese folosite <b>doar în interiorul unei organizații</b>, nerutate pe Internet. Structură: <code>fd</code> + <b>Global ID</b> de 40 de biți (generat aleatoriu) + <b>Subnet ID</b> de 16 biți + <b>Interface ID</b> de 64 de biți.
          Sunt cel mai apropiat echivalent al adreselor RFC 1918 din IPv4 — dar <b>nu sunt făcute pentru NAT</b>.</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <Figure caption="Interactiv: generează un prefix ULA /48 și vezi cum se compune.">
          <UlaBuilder />
        </Figure>
        <p>RFC 4193 (octombrie 2005) definește ULA: primii 7 biți sunt <code>1111110</code> (<code>fc00::/7</code>), urmează <b>bitul L</b> (valoarea 1 = prefix alocat local; valoarea 0 nu este definită), apoi Global ID de 40 de biți, Subnet ID de 16 biți și Interface ID de 64 de biți. Pentru că L = 1 în practică, adresele ULA reale încep cu <code>fd</code>. Global ID se alege <b>pseudo-aleatoriu</b>, ca două organizații să nu aleagă din greșeală același prefix (în caz de fuziune sau VPN).</p>
        <Table head={['', 'RFC 1918 (IPv4)', 'ULA (IPv6)']} rows={[
          ['Bloc', '10/8, 172.16/12, 192.168/16', <><code>fc00::/7</code> (practic <code>fd00::/8</code>)</>],
          ['Unicitate', 'nu e unică; riscă suprapuneri', 'aproape sigur unică (Global ID aleatoriu)'],
          ['Rutat pe Internet', 'nu', 'nu'],
          ['Cum ies pe Internet hostii', 'NAT', 'de regulă au și o adresă GUA în paralel; NAT nu e necesar'],
          ['Înregistrat în DNS public', '—', 'nu se recomandă'],
        ]} />
        <Callout kind="tip" title="Când folosești ULA">
          Pentru servicii care trebuie să rămână interne (imprimante, management, rețele de laborator) și pentru adrese stabile, independente de furnizorul de Internet: dacă ISP-ul se schimbă, prefixul GUA se schimbă, dar ULA rămâne.
        </Callout>
      </Detailed>

      <Traps items={[
        <>ULA = <code>fc00::/7</code>, folosit ca <code>fd00::/8</code>. Distractori: <code>fec0::/10</code> (site-local, depreciat) și <code>fe80::/10</code> (link-local).</>,
        <>ULA <b>nu</b> se traduce prin NAT ca în IPv4: hostii au de regulă și adresă globală.</>,
      ]} />
      <InlineQuiz ids={['1.9-006', '1.9-007', '1.9-008']} />
    </section>
  );
}

/* ======================================================================
   3. Link-local
   ====================================================================== */
export function LinkLocal() {
  return (
    <section id="linklocal" className="section">
      <SectionHead id="linklocal" code="1.9.a" title="Link-local — adresa fără care IPv6 nu funcționează" />
      <Summary>
        <p><G id="link-local" /> (<code>fe80::/10</code>, în practică <code>fe80::/64</code>) există pe <b>orice interfață IPv6</b>, apare automat și este valabilă <b>doar pe legătura locală</b> — routerele nu o transmit mai departe. Este folosită de <G id="ndp" />, de <G id="ra" /> (sursa) și ca <b>gateway implicit</b> al hostilor.</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <Figure caption="Interactiv: o adresă link-local rămâne pe legătura ei; un router nu o duce în altă rețea.">
          <LinkLocalScope />
        </Figure>
        <ul>
          <li><b>Generată automat:</b> când activezi IPv6 pe o interfață (sau configurezi o adresă globală), apare și o adresă link-local, de regulă din MAC (EUI-64) sau aleatorie.</li>
          <li><b>Unică doar pe legătură:</b> două interfețe de pe legături diferite pot avea aceeași adresă link-local. De aceea poți seta <code>fe80::1</code> pe fiecare interfață a unui router.</li>
          <li><b>Rol în protocoale:</b> mesajele NDP, sursa RA-urilor, <i>next-hop</i>-ul multor protocoale de rutare (OSPFv3, EIGRP pentru IPv6).</li>
          <li><b>Zona (<code>%</code>):</b> pentru că toate interfețele au <code>fe80::/64</code>, un sistem de operare scrie adresa cu indexul interfeței: <code>fe80::1%12</code> (Windows) sau <code>fe80::1%eth0</code> (Linux). Fără „%” nu ar ști pe ce interfață să trimită.</li>
        </ul>
        <Callout kind="exam" title="/10 sau /64?">
          <code>fe80::/10</code> este <b>intervalul rezervat</b> (de la <code>fe80</code> la <code>febf</code>). În practică, o adresă link-local reală are biții 11–64 egali cu zero, deci arată ca <code>fe80::…</code> (efectiv <code>fe80::/64</code>). La examen, „link-local = <code>fe80::/10</code>” este răspunsul acceptat.
        </Callout>
      </Detailed>

      <Traps items={[
        <>Link-local <b>nu este rutată</b>: un pachet cu sursă sau destinație <code>fe80::</code> nu trece de router.</>,
        <>Gateway-ul implicit al unui host IPv6 este de regulă <b>adresa link-local</b> a routerului, din RA.</>,
        <>Aceeași <code>fe80::1</code> poate exista pe mai multe interfețe ale aceluiași router.</>,
      ]} />
      <InlineQuiz ids={['1.9-009', '1.9-010', '1.9-011', '1.9-012']} />
    </section>
  );
}

/* ======================================================================
   4. Anycast
   ====================================================================== */
export function Anycast() {
  return (
    <section id="anycast" className="section">
      <SectionHead id="anycast" code="1.9.b" title="Anycast — „cel mai apropiat”" />
      <Summary>
        <p><G id="anycast" /> înseamnă că <b>aceeași adresă</b> este configurată pe mai multe dispozitive, iar rețeaua livrează pachetul <b>celui mai apropiat</b> (după metrica de rutare). Sintactic, o adresă anycast arată exact ca una unicast; se deosebește doar prin configurare (cuvântul-cheie <code>anycast</code>).</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <Figure caption="Interactiv: același prefix anunțat de mai multe servere; clientul ajunge la cel mai apropiat.">
          <AnycastMap />
        </Figure>
        <ul>
          <li><b>De ce:</b> reduce latența și oferă redundanță. Exemple reale: serverele DNS rădăcină și unele servicii de CDN.</li>
          <li><b>Subnet-Router anycast:</b> RFC 4291 definește pentru fiecare subrețea o adresă anycast cu Interface ID zero (de exemplu <code>2001:db8:acad:1::</code>); ea ajunge la unul dintre routerele subrețelei.</li>
          <li><b>Config pe Cisco:</b> <code>ipv6 address 2001:db8:1:1:ffff:ffff:ffff:fffe/64 anycast</code> (un exemplu din documentația Cisco pentru cuvântul-cheie <code>anycast</code>).</li>
          <li><b>La CCNA:</b> contează conceptul („unul-către-cel-mai-apropiat”) și faptul că o adresă anycast este luată din spațiul unicast.</li>
        </ul>
        <Table head={['', 'Unicast', 'Anycast', 'Multicast']} rows={[
          ['Destinatari', 'unul', 'unul — cel mai apropiat din grup', 'toți membrii grupului'],
          ['Aceeași adresă pe mai multe noduri?', 'nu', 'da', 'da (grup)'],
          ['Arată ca…', 'adresă obișnuită', 'adresă unicast', 'ff00::/8'],
        ]} />
      </Detailed>

      <Traps items={[
        <>Anycast: <b>unul-către-cel-mai-apropiat</b>; nu există un prefix dedicat — folosește adrese din spațiul unicast.</>,
        <>Multicast: unul-către-<b>toți membrii grupului</b>. Nu le confunda.</>,
      ]} />
      <InlineQuiz ids={['1.9-013', '1.9-014', '1.9-015']} />
    </section>
  );
}

/* ======================================================================
   5. Multicast
   ====================================================================== */
export function Multicast() {
  return (
    <section id="multicast" className="section">
      <SectionHead id="multicast" code="1.9.c" title="Multicast — înlocuitorul broadcast-ului" />
      <Summary>
        <p><G id="multicast" /> (<code>ff00::/8</code>) trimite un pachet către un <b>grup</b> de receptori. Formatul: <code>ff</code> + 4 biți de <b>flag-uri</b> + 4 biți de <b>scope</b> + 112 biți de group ID. Cele mai importante: <code>ff02::1</code> (toate nodurile), <code>ff02::2</code> (toate routerele), <code>ff02::5</code>/<code>ff02::6</code> (OSPF), <code>ff02::9</code> (RIPng), <code>ff02::a</code> (EIGRP), <code>ff02::1:2</code> (DHCPv6).</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <Figure caption="Interactiv: compară unicast, anycast și multicast — cine primește pachetul.">
          <CastModes />
        </Figure>
        <h3>Structura adresei multicast</h3>
        <p>Primii 8 biți sunt <code>ff</code>. Urmează 4 biți de flag-uri (printre ele, bitul T: 0 = adresă „well-known”, atribuită permanent) și 4 biți de <b>scope</b>, care spune cât de departe poate ajunge pachetul:</p>
        <Table head={['Scope', 'Valoare', 'Exemplu']} rows={[
          ['Interface-local', '1', <code>ff01::1</code>],
          ['Link-local', '2', <code>ff02::1</code>],
          ['Site-local', '5', <code>ff05::2</code>],
          ['Organization-local', '8', <code>ff08::…</code>],
          ['Global', 'e', <code>ff0e::…</code>],
        ]} />
        <Figure caption="Interactiv: introdu o adresă multicast și vezi flag-urile, scope-ul și rolul.">
          <MulticastDecoder />
        </Figure>
        <h3>Adresele multicast pe care trebuie să le știi</h3>
        <Table head={['Adresă', 'Grup', 'Folosit de']} hlCol={0} rows={[
          [<code>ff02::1</code>, 'toate nodurile (all-nodes) pe legătură', 'RA-urile neîntrebate; „toți de pe segment”'],
          [<code>ff02::2</code>, 'toate routerele (all-routers)', 'Router Solicitation (RS)'],
          [<code>ff02::5</code>, 'toate routerele OSPF', 'OSPFv3'],
          [<code>ff02::6</code>, 'DR-urile OSPF', 'OSPFv3'],
          [<code>ff02::9</code>, 'routere RIP', 'RIPng'],
          [<code>ff02::a</code>, 'routere EIGRP', 'EIGRP pentru IPv6'],
          [<code>ff02::1:2</code>, 'servere și relay-uri DHCPv6', 'clientul DHCPv6'],
          [<code>ff02::1:ffXX:XXXX</code>, 'solicited-node (mai jos)', 'NS, DAD'],
        ]} />
        <Callout kind="exam" title="Scope-ul se vede în a patra cifră">
          În <code>ff02::1</code> a patra cifră hexa este <b>2</b> → link-local. <code>ff05::</code> → site-local. <code>ff0e::</code> → global. Dacă într-o întrebare vezi „<code>ff02::1</code>”, răspunsul este „toate nodurile de pe legătura locală”.
        </Callout>
      </Detailed>

      <Traps items={[
        <>Multicast = <code>ff00::/8</code>. <code>ff02::1</code> = toate nodurile; <code>ff02::2</code> = toate routerele; nu confunda cu 1.</>,
        <>OSPF: <code>ff02::5</code> și <code>ff02::6</code>; RIPng: <code>ff02::9</code>; EIGRP: <code>ff02::a</code>; DHCPv6: <code>ff02::1:2</code>.</>,
        <>„Broadcast” în IPv6 = <b>greșit</b>; folosește „multicast”.</>,
      ]} />
      <InlineQuiz ids={['1.9-016', '1.9-017', '1.9-018', '1.9-019', '1.9-020']} />
    </section>
  );
}

/* ======================================================================
   6. Solicited-node
   ====================================================================== */
export function SolicitedNode() {
  return (
    <section id="solicited" className="section">
      <SectionHead id="solicited" code="1.9.c" title="Solicited-node multicast — de ce IPv6 nu mai are nevoie de ARP broadcast" />
      <Summary>
        <p>Pentru fiecare adresă unicast (sau anycast), un nod se alătură automat grupului <G id="solicited-node" />: <code>ff02::1:ff</code> + <b>ultimii 24 de biți</b> ai adresei (prefixul grupului este <code>ff02::1:ff00:0/104</code>). Mesajele Neighbor Solicitation sunt trimise la acest grup, deci aproape doar nodul căutat le procesează — spre deosebire de ARP, care deranjează toată lumea.</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <Figure caption="Interactiv: calculează grupul solicited-node pentru orice adresă și vezi adresa MAC multicast asociată.">
          <SolicitedNodeCalc />
        </Figure>
        <p><b>Exemple:</b></p>
        <Table head={['Adresă unicast', 'Ultimii 24 de biți', 'Grup solicited-node']} rows={[
          [<code>2001:db8:acad:1::1</code>, '00:0001', <code>ff02::1:ff00:1</code>],
          [<code>fe80::1</code>, '00:0001', <><code>ff02::1:ff00:1</code> (același grup)</>],
          [<code>2001:db8:acad:1:211:22ff:fe33:4455</code>, '33:4455', <code>ff02::1:ff33:4455</code>],
          [<code>2001:db8::abcd:1234:5678</code>, '34:5678', <code>ff02::1:ff34:5678</code>],
        ]} />
        <h3>De ce funcționează mai bine decât ARP</h3>
        <p>În IPv4, ARP trimite un broadcast: toate calculatoarele de pe segment sunt întrerupte să citească cererea, deși doar unul răspunde. În IPv6, Neighbor Solicitation merge la <code>ff02::1:ffXX:XXXX</code>; placa de rețea mapează grupul pe o adresă MAC multicast de forma <code>33:33:ff:XX:XX:XX</code> (ultimii 32 de biți ai grupului) și <b>filtrează în hardware</b> tot ce nu o privește. Cu 2²⁴ de grupuri posibile, în practică doar nodul căutat ascultă grupul.</p>
        <Figure caption="ARP (IPv4, broadcast) față de NS (IPv6, solicited-node multicast).">
          <ArpVsNs />
        </Figure>
        <Table head={['IPv4', 'IPv6']} rows={[
          ['ARP request (broadcast FF:FF:FF:FF:FF:FF)', 'Neighbor Solicitation → solicited-node multicast'],
          ['ARP reply (unicast)', 'Neighbor Advertisement (unicast)'],
          ['DHCP Discover (broadcast)', 'DHCPv6 Solicit → ff02::1:2'],
          ['„Toți de pe segment”: 255.255.255.255', 'ff02::1 (toate nodurile)'],
        ]} />
      </Detailed>

      <Traps items={[
        <>Solicited-node = <code>ff02::1:ff</code> + <b>ultimii 24 de biți</b> (6 cifre hexa) ai adresei; prefixul grupului este <code>ff02::1:ff00:0/104</code>.</>,
        <>Fiecare adresă unicast determină un grup; adrese cu aceiași ultimi 24 de biți (ex. <code>::1</code> GUA și <code>fe80::1</code>) împart același grup.</>,
      ]} />
      <InlineQuiz ids={['1.9-021', '1.9-022', '1.9-023', '1.9-024']} />
    </section>
  );
}

/* ======================================================================
   7. Modified EUI-64
   ====================================================================== */
export function Eui64() {
  return (
    <section id="eui64" className="section">
      <SectionHead id="eui64" code="1.9.d" title="Modified EUI-64 — Interface ID din adresa MAC" />
      <Summary>
        <p><G id="eui64" /> construiește un Interface ID de 64 de biți din adresa MAC de 48 de biți: <b>(1)</b> împarte MAC-ul în două jumătăți de 24 de biți, <b>(2)</b> inserează <code>FF:FE</code> la mijloc, <b>(3)</b> <b>inversează al 7-lea bit</b> al primului octet (bitul U/L, valoarea 0x02).
          Exemplu: MAC <code>00:11:22:33:44:55</code> → IID <code>0211:22ff:fe33:4455</code> → link-local <code>fe80::211:22ff:fe33:4455</code>.</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <Figure caption="Interactiv: introdu un MAC și urmărește cei trei pași. Poți și să faci operația inversă.">
          <Eui64Converter />
        </Figure>
        <h3>Cei trei pași, cu un exemplu</h3>
        <Table head={['Pas', 'Operație', 'Rezultat pentru 00:11:22:33:44:55']} hlCol={0} rows={[
          ['1', 'Împarte MAC-ul la mijloc: OUI + NIC', '001122 | 334455'],
          ['2', 'Inserează FFFE între cele două jumătăți', '0011:22FF:FE33:4455'],
          ['3', 'Inversează bitul 7 al primului octet (00 → 02)', '0211:22FF:FE33:4455'],
          ['—', 'Adaugă prefixul', <><code>fe80::</code> + IID → <code>fe80::211:22ff:fe33:4455</code></>],
        ]} />
        <h3>Cum calculezi rapid „flip-ul”</h3>
        <p>Bitul inversat are valoarea 0x02, deci a doua cifră hexa a primului octet se schimbă astfel: <b>0↔2, 1↔3, 4↔6, 5↔7, 8↔A, 9↔B, C↔E, D↔F</b>. Este o <b>inversare</b> (XOR), nu „setare la 1”: dacă bitul era deja 1, devine 0.</p>
        <Table head={['MAC', 'Primul octet (binar)', 'După inversare', 'Interface ID (EUI-64)']} rows={[
          [<code>00:11:22:33:44:55</code>, '0000 0000', <>0000 00<b>1</b>0 = 02</>, <code>0211:22ff:fe33:4455</code>],
          [<code>AC:DE:48:00:11:22</code>, '1010 1100', <>1010 11<b>1</b>0 = AE</>, <code>aede:48ff:fe00:1122</code>],
          [<code>70:B3:D5:12:34:56</code>, '0111 0000', <>0111 00<b>1</b>0 = 72</>, <code>72b3:d5ff:fe12:3456</code>],
          [<code>02:50:56:AB:CD:EF</code>, '0000 0010', <>0000 00<b>0</b>0 = 00</>, <code>0050:56ff:feab:cdef</code>],
        ]} />
        <Callout kind="exam" title="Cele trei capcane">
          <ul>
            <li><code>FFFE</code> se inserează <b>la mijloc</b> (după al 3-lea octet), nu la început sau la sfârșit și nu <code>FFEE</code> sau <code>FEFF</code>.</li>
            <li>Bitul 7 se <b>inversează</b>; nu se setează mereu la 1 (ultimul rând al tabelului).</li>
            <li>Un Interface ID cu <code>ff:fe</code> în hextetele 6–7 (<code>xxff:fexx</code>) trădează adesea o adresă EUI-64.</li>
          </ul>
        </Callout>
        <h3>Operația inversă</h3>
        <p>Din IID <code>0211:22ff:fe33:4455</code>: scoți <code>ff:fe</code> → <code>02 11 22 33 44 55</code>; inversezi bitul 7 (02 → 00) → MAC <code>0011.2233.4455</code>.</p>
        <h3>De ce se inversează bitul?</h3>
        <p>Bitul 7 al primului octet (U/L, „universal/local”) este 0 la adresele MAC alocate universal (de fabricant). Prin convenția „modified”, într-un Interface ID valoarea 1 înseamnă „universal”, iar 0 „local”. Astfel, identificatori scriși manual, precum <code>::1</code> (U/L = 0), sunt tratați ca „locali”. Pentru examen, reține doar procedura.</p>
      </Detailed>

      <DeepDive title="Deep dive: confidențialitate — de ce hostii moderni nu mai folosesc EUI-64">
        <p>Un IID derivat din MAC este <b>constant</b> pe oriunde te-ai conecta: oricine poate corela activitatea aceluiași dispozitiv în rețele diferite. Pentru a evita acest lucru, sistemele moderne generează implicit identificatori <b>aleatori stabili</b> per rețea (RFC 7217) și adrese <b>temporare</b> pentru conexiuni ieșite (RFC 8981, care a înlocuit RFC 4941; valori implicite: valabilitate 2 zile, preferată 1 zi). Windows, macOS, iOS și Android folosesc de regulă aceste metode. Routerele Cisco, însă, folosesc EUI-64 pentru adresa link-local automată și pentru comanda <code>ipv6 address … eui-64</code>. Pe interfețele fără MAC (de exemplu seriale), IOS ia MAC-ul primei interfețe Ethernet disponibile.</p>
      </DeepDive>

      <Traps items={[
        <>EUI-64: <b>FFFE la mijloc</b> + <b>inversează bitul 7</b> (0x02) al primului octet.</>,
        <>MAC <code>02:…</code> devine <code>00…</code> (inversare, nu setare).</>,
        <>Cu <code>ipv6 address prefix/64 eui-64</code> scrii prefixul, nu adresa completă.</>,
      ]} />
      <InlineQuiz ids={['1.9-025', '1.9-026', '1.9-027', '1.9-028', '1.9-029', '1.9-030']} />
    </section>
  );
}
