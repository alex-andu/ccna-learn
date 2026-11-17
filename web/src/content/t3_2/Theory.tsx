import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DecisionFlow, FrameRewrite, LpmExplorer, MetricPaths, SourceRace } from '../../diagrams/t3_2';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="3.2" title="Decizia de transmitere — imaginea de ansamblu" />
      <Summary>
        <p>Când un pachet ajunge la un router, acesta alege <b>o singură rută</b> din tabelă, în această ordine: <b>(1) prefixul cel mai lung</b> care se potrivește cu destinația (<G id="longest-prefix-match" />), <b>(2)</b> între rute către același prefix din surse diferite, <b>AD-ul cel mai mic</b>, <b>(3)</b> între rute din același protocol, <b>metrica cea mai mică</b>. Apoi trimite pachetul la <G id="next-hop" />-ul rutei alese.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 3.2 este <i>Determine how a router makes a forwarding decision by default</i>, cu trei sub-puncte: (a) longest prefix match, (b) administrative distance, (c) routing protocol metric. În 3.1 am învățat să <b>citim</b> o rută; aici învățăm <b>cum alege routerul</b> între mai multe rute și ce face imediat după.</p>
        <Table head={['Sub-punct oficial', 'Întrebarea la care răspunde', 'Secțiunea']} hlCol={0} rows={[
          ['3.2.a Longest prefix match', 'Dintre rutele care acoperă destinația, pe care o folosesc?', 'Longest prefix match'],
          ['3.2.b Administrative distance', 'Dacă aceeași rețea vine din surse diferite, în care am mai multă încredere?', 'AD'],
          ['3.2.c Routing protocol metric', 'Dacă sursa e aceeași, care cale e mai bună?', 'Metrica'],
          ['(în plus) După decizie', 'Ce se întâmplă cu pachetul și cu antetele lui?', 'Transmiterea'],
        ]} />
        <h3>Ordinea completă — și o precizare importantă</h3>
        <Figure caption="Fluxul deciziei de transmitere, de la sosirea pachetului la trimiterea lui.">
          <DecisionFlow />
        </Figure>
        <p>În examen întrebarea este formulată de obicei ca o <b>ordine de prioritate</b>: mai întâi prefixul cel mai lung, apoi AD, apoi metrica. Pentru că ordinea e importantă, să vedem de ce arată așa:</p>
        <ul>
          <li><b>Prefixul decide la fiecare pachet.</b> Fiecare pachet are o adresă de destinație; cele mai multe rute ale unui router se potrivesc cu ea doar parțial (sau deloc). Dintre cele care se potrivesc, cea mai specifică știe cel mai bine unde e destinația, deci ea câștigă — indiferent de sursă sau de „încredere”.</li>
          <li><b>AD și metrica decid între variante ale aceluiași prefix.</b> Dacă OSPF și o rută statică oferă exact 192.168.3.0/24, routerul păstrează în tabelă doar una (după AD). Dacă același protocol oferă două căi către același prefix, câștigă cea cu metrica mai mică.</li>
        </ul>
        <Callout kind="info" title="Cum îți explici asta ca să nu te încurci">
          Gândește-te la două etape: <b>(1) construirea tabelei</b> — pentru fiecare prefix se păstrează cea mai bună sursă (AD), iar în interiorul unei surse cea mai bună cale (metrică); <b>(2) folosirea tabelei</b> — pentru fiecare pachet se alege, dintre rutele instalate, cea cu cel mai lung prefix. Răspunsul scurt de examen rămâne: <b>longest prefix → AD → metrică</b>.
        </Callout>
        <Analogy>Ai un curier care primește colete. Mai întâi se uită la adresă și caută cel mai exact indicator („Strada X nr. 5” bate „Orașul Y”, care bate „Țara”) — asta e prefixul. Dacă două firme îi dau indicații pentru aceeași stradă, o alege pe cea mai de încredere (AD). Dacă aceeași firmă îi dă două trasee, alege traseul mai scurt (metrica).</Analogy>
      </Detailed>
      <Traps items={[
        <>Ordinea: <b>cel mai lung prefix</b> → AD → metrică. AD nu „întrece” niciodată un prefix mai lung.</>,
        <>Se alege <b>o rută</b> (sau mai multe cu metrică egală, ECMP) pentru fiecare pachet, nu toate rutele care se potrivesc.</>,
        <>Decizia se bazează pe adresa IP de <b>destinație</b>, nu pe cea sursă (în rutarea implicită).</>,
        <>Fără nicio rută potrivită (nici implicită): pachetul se aruncă și sursa primește ICMP unreachable.</>,
      ]} />
      <InlineQuiz ids={['3.2-001', '3.2-003']} />
    </section>
  );
}

/* ======================================================================
   3.2.a — Longest prefix match
   ====================================================================== */
export function Lpm() {
  return (
    <section id="lpm" className="section">
      <SectionHead id="lpm" code="3.2.a" title="Longest prefix match — cea mai specifică rută câștigă" />
      <Summary>
        <p>Dintre toate rutele ale căror prefix conține adresa de destinație, routerul o folosește pe cea cu <b>masca cea mai lungă</b> (/32 &gt; /26 &gt; /24 &gt; /16 &gt; /8 &gt; /0). Ruta implicită 0.0.0.0/0 se potrivește cu orice, dar, având lungimea 0, este mereu <b>ultima alegere</b>. Regula nu ține cont de AD sau de metrică.</p>
      </Summary>
      <Detailed title="1. Problema și soluția">
        <p>Același pachet se poate potrivi cu <b>mai multe</b> rute: un server 10.1.1.77 se află în 10.0.0.0/8, în 10.1.0.0/16, în 10.1.1.0/24 și așa mai departe. Routerul trebuie să aleagă una, deterministic și rapid. Soluția este <b>cea mai specifică câștigă</b>: dacă un administrator (sau un protocol) a scris o rută foarte precisă pentru un grup mic de adrese, înseamnă că știe mai multe despre acel grup decât o rută generală. Astfel poți face <b>excepții</b>: un /24 pe o cale, dar un /32 pentru un server anume pe alta, fără să modifici nimic altceva.</p>
        <h3>2. Algoritmul, pas cu pas</h3>
        <ol>
          <li>Ia adresa IP de destinație din antetul pachetului.</li>
          <li>Pentru fiecare rută din tabelă, ia lungimea prefixului (n) și compară primii n biți ai adresei de destinație cu primii n biți ai prefixului rutei.</li>
          <li>Păstrează rutele la care toți cei n biți coincid (candidatele).</li>
          <li>Alege candidata cu n maxim.</li>
          <li>Dacă nu există nicio candidată: nu există rută ⇒ drop + ICMP.</li>
        </ol>
        <CodeBlock title="Exemplu: destinația 10.1.1.77 față de 10.1.1.64/26" kind="session" code={`destinație 10.1.1.77 = 00001010.00000001.00000001.01001101
prefix     10.1.1.64 = 00001010.00000001.00000001.01000000
                       |<------------- 26 biți ------------->|
primii 26 de biți: 00001010.00000001.00000001.01 — IDENTICI ⇒ se potrivește
(ultimii 6 biți „001101” contra „000000” nu se compară la /26)`} explain={[
          ['primii 26 de biți', 'Cei 3 octeți complecți plus primii 2 biți din al patrulea octet (01) coincid.'],
          ['ultimii 6 biți', 'La /26 nu contează; blocul 10.1.1.64/26 acoperă 10.1.1.64–10.1.1.127.'],
        ]} />
        <Figure caption="Interactiv: alege o destinație. Vezi care rute se potrivesc și care câștigă. Observă că AD nu intervine.">
          <LpmExplorer />
        </Figure>
        <h3>3. Cazuri de studiat</h3>
        <Table head={['Destinație', 'Rute care se potrivesc', 'Câștigă']} hlCol={2} rows={[
          ['10.1.1.77', '0/0, /8, /16, /24, /26, /32', <b>/32 (host route)</b>],
          ['10.1.1.70', '0/0, /8, /16, /24, /26', <b>/26</b>],
          ['10.1.1.10', '0/0, /8, /16, /24', <b>/24</b>],
          ['10.1.5.5', '0/0, /8, /16', <b>/16</b>],
          ['10.200.0.1', '0/0, /8', <b>/8</b>],
          ['8.8.8.8', 'doar 0/0', <b>ruta implicită</b>],
        ]} />
        <h3>4. Cel mai important lucru de reținut: AD nu contează aici</h3>
        <p>Observă în explorator: ruta /24 este OSPF (AD 110), iar ruta /16 este statică (AD 1). Pentru 10.1.1.10 câștigă tot <b>/24-ul OSPF</b>. Prefixul mai lung câștigă <b>chiar dacă</b> sursa lui are AD mai mare. De aceea este greșit să crezi că „ruta statică bate mereu OSPF”: o statică bate OSPF doar dacă oferă <b>același prefix</b> (aceeași rețea și mască).</p>
        <Callout kind="exam" title="Întrebarea clasică">
          „R1 are O 10.1.1.0/24 [110/2] și S 10.1.0.0/16 [1/0]. Încotro merge un pachet pentru 10.1.1.9?” → pe ruta <b>OSPF</b> (/24 este mai specifică), nu pe cea statică. AD și metrica nu au fost nici măcar comparate.
        </Callout>
        <h3>5. Ruta implicită și rutele de gazdă</h3>
        <ul>
          <li><b>Ruta implicită</b> (0.0.0.0/0, <G id="default-route" />) se potrivește cu orice. Lungimea 0 o face cea mai slabă candidată, deci se folosește doar când nu există altceva. Nu strică nicio rută specifică existentă.</li>
          <li><b><G id="host-route">Ruta de gazdă</G></b> (/32) este cea mai specifică posibilă. Rutele L din tabelă (adresele proprii ale interfețelor) sunt astfel de rute: de aceea un pachet adresat chiar routerului nu se transmite mai departe, ci se livrează local.</li>
        </ul>
      </Detailed>
      <DeepDive title="Cum face asta hardware-ul la milioane de pachete pe secundă">
        <p>Compararea bit cu bit a fiecărui pachet cu fiecare rută ar fi prea lentă pentru tabele cu sute de mii de rute. De aceea routerele moderne copiază tabela de rutare într-o structură optimizată pentru căutare, <G id="fib" /> (în Cisco IOS, parte din <G id="cef" />), organizată ca un arbore de prefixe (trie) sau în memorie specializată (TCAM) care compară toți biții în paralel. Rezultatul este același cu algoritmul de mai sus — cea mai lungă potrivire —, dar căutarea durează un timp aproape constant. Tabela afișată de <code>show ip route</code> este RIB-ul; FIB-ul se vede cu <code>show ip cef</code>.</p>
      </DeepDive>
      <Traps items={[
        <><b>Cea mai lungă mască câștigă</b>, nu cea cu AD mai mic și nu cea cu metrica mai mică.</>,
        <>/32 &gt; /24 &gt; /16 &gt; /8 &gt; /0: numărul mai mare = mai specific.</>,
        <>Ruta implicită nu „bate” nimic; este folosită doar când nu există altă potrivire.</>,
        <>Un pachet se potrivește adesea cu <b>mai multe</b> rute; câștigă una singură.</>,
      ]} />
      <InlineQuiz ids={['3.2-005', '3.2-007', '3.2-009', '3.2-011']} />
    </section>
  );
}

/* ======================================================================
   3.2.b — Administrative distance
   ====================================================================== */
export function AdSection() {
  return (
    <section id="ad" className="section">
      <SectionHead id="ad" code="3.2.b" title="Administrative distance — alegerea între surse pentru același prefix" />
      <Summary>
        <p>Când <b>același prefix cu aceeași mască</b> este oferit de surse diferite (static, EIGRP, OSPF, RIP…), routerul instalează în tabelă numai ruta cu <b><G id="administrative-distance">AD</G> mai mic</b>. Celelalte rămân în baza de date a sursei lor și intră în tabelă dacă cea câștigătoare dispare — pe acest mecanism se bazează <b><G id="floating-static-route">ruta statică flotantă</G></b>.</p>
      </Summary>
      <Detailed title="1. Când intră AD în joc">
        <p>AD intervine <b>doar</b> când prefixul și masca sunt identice. Dacă OSPF oferă 192.168.3.0/24 și EIGRP oferă 192.168.3.0/24, ambele sunt candidate la <b>aceeași intrare</b> a tabelei. Metricile lor (cost OSPF, metrică EIGRP) nu se pot compara, deci se compară AD: EIGRP (90) &lt; OSPF (110) ⇒ EIGRP câștigă. Ruta OSPF nu e ștearsă: OSPF o păstrează în propria bază de date și o reia dacă EIGRP dispare.</p>
        <Figure caption="Interactiv: bifează sursele existente pentru 192.168.3.0/24 și vezi care intră în tabelă. Încearcă să debifezi pe rând sursa câștigătoare.">
          <SourceRace />
        </Figure>
        <h3>2. Valorile care contează</h3>
        <Table head={['Sursa', 'AD']} hlCol={1} rows={[
          ['Connected', '0'], ['Static', '1'], ['eBGP', '20'], ['EIGRP internal', '90'], ['OSPF', '110'], ['RIP', '120'], ['EIGRP external', '170'], ['iBGP', '200'],
        ]} />
        <p>Ordinea de preferință e de la AD mic la mare: connected &gt; static &gt; eBGP &gt; EIGRP &gt; OSPF &gt; RIP &gt; EIGRP extern &gt; iBGP.</p>
        <h3>3. Ruta statică flotantă (rută de rezervă)</h3>
        <p>O rută statică are implicit AD 1, deci înlocuiește orice protocol dinamic pentru același prefix. Uneori vrei opusul: să folosești OSPF cât timp merge și o rută statică <b>doar ca rezervă</b>. Soluția este să-i dai statice un AD <b>mai mare</b> decât al protocolului: de exemplu 130 &gt; 110 (OSPF). Cât timp OSPF oferă prefixul, ruta statică este ascunsă („plutește” sub ea); în clipa în care OSPF pierde ruta, statica (AD 130) este singura candidată și intră în tabelă.</p>
        <CodeBlock title="Rută flotantă (ilustrativ; sintaxă detaliată în 3.3)" kind="config" code={`R1(config)# ip route 192.168.3.0 255.255.255.0 10.0.12.2 130`} explain={[
          ['ip route 192.168.3.0 255.255.255.0 10.0.12.2', 'Ruta statică spre 192.168.3.0/24, next hop 10.0.12.2.'],
          ['130', 'AD-ul administrativ ales: mai mare decât 110 (OSPF), deci rezervă.'],
        ]} />
        <CodeBlock title="Înainte și după dispariția OSPF (ilustrativ)" kind="session" code={`R1# show ip route 192.168.3.0
Routing entry for 192.168.3.0/24
  Known via "ospf 1", distance 110, metric 2, type intra area
  ...
  (ruta statică cu AD 130 NU apare în tabelă)

--- OSPF dispare (legătură căzută / proces oprit) ---

R1# show ip route 192.168.3.0
Routing entry for 192.168.3.0/24
  Known via "static", distance 130, metric 0
  Routing Descriptor Blocks:
  * 10.0.12.2
      Route metric is 0, traffic share count is 1`} explain={[
          ['Known via "ospf 1", distance 110', 'Cât timp OSPF e activ, el ocupă intrarea.'],
          ['Known via "static", distance 130', 'După ce OSPF a dispărut, ruta flotantă preia: AD 130, metrică 0.'],
        ]} />
        <Callout kind="warn" title="Alege AD-ul flotant cu grijă">
          AD-ul rutei flotante trebuie să fie <b>mai mare</b> decât al sursei pe care o acoperă, dar nu 255 (care înseamnă „nu folosi”). De exemplu 130 pentru a ascunde OSPF (110) și RIP (120), dar a le înlocui dacă dispar.
        </Callout>
        <h3>4. Ordinea de rezervă (scenariu)</h3>
        <p>Un router are pentru 192.168.3.0/24: OSPF (110), RIP (120) și o statică flotantă (130). În tabelă este OSPF. Dacă OSPF dispare, intră <b>RIP</b> (120 &lt; 130). Dacă dispare și RIP, intră <b>statica flotantă</b>. Ordinea e determinată doar de AD.</p>
      </Detailed>
      <DeepDive title="De ce AD se aplică la instalarea în tabelă, nu la fiecare pachet">
        <p>Tabela de rutare este un fel de „rezultat final” al selecției. Fiecare protocol de rutare își calculează cea mai bună cale și o propune managerului de rute, împreună cu AD-ul sursei. Managerul de rute păstrează, pentru fiecare prefix/mască, propunerea cu cel mai mic AD. De aceea, atunci când un pachet ajunge, nu se mai compară AD-uri: în tabelă există deja <b>o singură variantă pentru fiecare prefix</b>, iar pe pachet decide cel mai lung prefix. Cele două descrieri — „LPM, apoi AD, apoi metrică” (ordinea de examen) și „AD/metrică la construirea tabelei, LPM la folosire” — conduc la același rezultat.</p>
      </DeepDive>
      <Traps items={[
        <>AD se compară doar pentru <b>același prefix și aceeași mască</b>.</>,
        <>AD mai mic câștigă; static (1) bate OSPF (110) <b>pentru același prefix</b>.</>,
        <>Ruta statică flotantă = rută statică cu AD mai mare decât al protocolului de bază (de exemplu 130 &gt; 110).</>,
        <>Ruta pierzătoare nu se șterge: rămâne în sursa ei și revine când cea câștigătoare dispare.</>,
      ]} />
      <InlineQuiz ids={['3.2-013', '3.2-015', '3.2-017']} />
    </section>
  );
}

/* ======================================================================
   3.2.c — Metric
   ====================================================================== */
export function MetricSection() {
  return (
    <section id="metric" className="section">
      <SectionHead id="metric" code="3.2.c" title="Routing protocol metric — alegerea căii în interiorul unui protocol" />
      <Summary>
        <p>Când <b>același protocol</b> oferă mai multe căi către <b>același prefix</b>, ruta cu <b><G id="route-metric">metrica</G> mai mică</b> intră în tabelă. Dacă două căi au metrici <b>egale</b>, routerul le instalează pe amândouă și împarte traficul între ele (<G id="ecmp" />). Metricile protocoalelor diferite nu se compară niciodată.</p>
      </Summary>
      <Detailed title="1. Ultimul criteriu">
        <p>Dacă lungimea prefixului și AD sunt aceleași, singurul criteriu rămas este metrica: costul calculat de protocolul respectiv. Tipuri de metrică le-ai văzut în 3.1: OSPF = cost (sumă de costuri ale interfețelor de ieșire), RIP = număr de hop-uri, EIGRP = metrică compusă (bandă + delay). Regula este simplă: <b>mai mic = mai bun</b>.</p>
        <h3>2. Același drum, protocoale diferite, alegeri diferite</h3>
        <p>Metrica e „opinia” fiecărui protocol despre ce înseamnă o cale bună; protocoale diferite pot alege căi diferite pe aceeași topologie. Exemplu clasic: o legătură directă lentă (10 Mbps, 1 hop) față de un drum cu două legături rapide (100 Mbps, 2 hop-uri). RIP numără doar hop-urile și alege legătura lentă; OSPF numără costul bazat pe bandă și alege drumul rapid.</p>
        <Figure caption="Interactiv: aceeași topologie, alt protocol, alt rezultat. Al treilea buton arată ECMP.">
          <MetricPaths />
        </Figure>
        <h3>3. Metrici egale: ECMP</h3>
        <p>Dacă două căi au exact aceeași metrică, routerul instalează <b>ambele</b> rute în tabelă; <code>show ip route</code> afișează două linii de next hop sub același prefix. Traficul se împarte între ele (implicit pe baza fluxurilor, CEF) — folosești mai multă lățime de bandă și ai redundanță instantanee. Numărul maxim de căi egale este configurabil (<code>maximum-paths</code>).</p>
        <CodeBlock title="ECMP în tabelă (ilustrativ)" kind="session" code={`R1# show ip route ospf
O     192.168.3.0/24 [110/3] via 10.0.13.2, 00:00:11, GigabitEthernet0/2
                     [110/3] via 10.0.12.2, 00:00:11, GigabitEthernet0/1`} explain={[
          ['[110/3] via 10.0.13.2', 'Prima cale: AD 110, metrica 3.'],
          ['[110/3] via 10.0.12.2', 'A doua cale, cu aceeași metrică: ambele sunt instalate; cadrul poate pleca pe oricare.'],
        ]} />
        <Callout kind="warn" title="Egalitatea trebuie să fie exactă">
          În OSPF și RIP căile se echilibrează doar dacă metricile sunt <b>identice</b>. O diferență de 1 duce la o singură cale instalată. (EIGRP are un mecanism opțional pentru metrici inegale — în afara CCNA.)
        </Callout>
        <h3>4. Cum influențezi metrica</h3>
        <p>La OSPF poți schimba costul unei interfețe (<code>ip ospf cost</code>) sau referința globală (<code>auto-cost reference-bandwidth</code>); la rutele statice nu există metrică de reglat — se joacă cu AD. Pe acest principiu se aleg căile preferate fără a schimba topologia.</p>
      </Detailed>
      <DeepDive title="Metrica nu garantează „cea mai bună” cale reală">
        <p>Metrica este o <b>aproximare</b>: OSPF cu referința implicită vede toate legăturile ≥100 Mbps ca fiind egale (cost 1), deci un drum prin GigabitEthernet și unul prin FastEthernet pot părea identice. De aceea administratorii ajustează referința sau costurile. Aceeași limitare apare la RIP (ignoră bandă, delay, încărcare). Ce primești de la metrică este o <b>alegere consecventă</b>, nu neapărat optimă.</p>
      </DeepDive>
      <Traps items={[
        <>Metrica decide doar în interiorul <b>aceluiași protocol</b>, pentru <b>același prefix</b>.</>,
        <>Metrici egale ⇒ <b>ECMP</b>: ambele rute instalate, trafic împărțit.</>,
        <>Rutele statice nu au metrică de reglat (0); le „ajustezi” prin AD.</>,
        <>RIP alege după hop-uri, OSPF după cost: pe aceeași rețea pot alege căi diferite.</>,
      ]} />
      <InlineQuiz ids={['3.2-019', '3.2-021', '3.2-023']} />
    </section>
  );
}

/* ======================================================================
   După decizie — transmiterea
   ====================================================================== */
export function Forwarding() {
  return (
    <section id="forward" className="section">
      <SectionHead id="forward" code="3.2" title="După decizie: ce face routerul cu pachetul" />
      <Summary>
        <p>După ce a ales ruta, routerul <b>scade TTL cu 1</b>, află MAC-ul next hop-ului prin <G id="arp" />, <b>rescrie antetul de nivel 2</b> (MAC sursă = interfața de ieșire, MAC destinație = next hop) și trimite cadrul. Adresele <b>IP</b> sursă și destinație rămân aceleași (în afara NAT); se schimbă doar MAC-urile, la fiecare hop.</p>
      </Summary>
      <Detailed title="1. Pașii unui router care transmite un pachet">
        <ol>
          <li><b>Primește cadrul</b> pe o interfață. Verifică MAC-ul destinație (e al lui sau broadcast/multicast?) și FCS; dacă e corect, îndepărtează antetul Ethernet (<i>decapsulare</i>).</li>
          <li><b>Citește antetul IP</b>: verifică TTL (dacă ar ajunge la 0, aruncă pachetul și trimite <i>ICMP time exceeded</i>) și adresa de destinație.</li>
          <li><b>Caută ruta</b>: longest prefix match în FIB/tabelă. Dacă nu găsește: drop + ICMP destination unreachable.</li>
          <li><b>Rezolvă next hop-ul</b> (căutare recursivă) și află interfața de ieșire.</li>
          <li><b>Scade TTL</b> cu 1 și recalculează checksum-ul antetului IP.</li>
          <li><b>ARP</b>: dacă nu știe MAC-ul next hop-ului (sau, la o rută connected, al destinației), îl cere prin ARP și îl memorează în cache-ul ARP.</li>
          <li><b>Încapsulează</b> din nou: construiește un cadru nou cu MAC sursă = adresa interfeței de ieșire și MAC destinație = MAC-ul aflat; îl trimite.</li>
        </ol>
        <Figure caption="Interactiv: alege un segment al drumului și vezi ce câmpuri s-au rescris față de segmentul anterior (marcate cu portocaliu).">
          <FrameRewrite />
        </Figure>
        <h3>2. Ce se schimbă și ce nu</h3>
        <Table head={['Câmp', 'La fiecare router', 'Motiv']} hlCol={0} rows={[
          ['MAC sursă / destinație (L2)', <b>se rescriu</b>, 'Ethernet funcționează doar pe un segment; fiecare hop are alt segment'],
          ['TTL (L3)', <b>scade cu 1</b>, 'Evită buclele infinite; la 0 pachetul este aruncat'],
          ['IP sursă / destinație (L3)', 'rămân (fără NAT)', 'Identifică capetele comunicației, nu hop-urile'],
          ['Checksum antet IP', 'recalculat', 'S-a schimbat TTL'],
        ]} />
        <h3>3. Ruta connected: ultimul hop</h3>
        <p>Când ruta aleasă este <code>C</code> (rețeaua atașată direct), nu mai există next hop: routerul face ARP direct pentru <b>destinația finală</b> (de exemplu PC3) și îi livrează cadrul. Este diferența față de rutele cu next hop, unde ARP se face pentru <b>următorul router</b>.</p>
        <h3>4. Când nu există rută sau TTL se termină</h3>
        <ul>
          <li><b>Nicio rută potrivită, fără rută implicită</b> → pachetul se aruncă; sursa primește <i>ICMP destination unreachable (net unreachable)</i>. De pe un router, <code>ping</code> afișează <code>U</code>.</li>
          <li><b>TTL ajunge la 0</b> (de exemplu o buclă de rutare) → pachetul se aruncă; sursa primește <i>ICMP time exceeded</i>. Pe acest mecanism se bazează <code>traceroute</code>: trimite pachete cu TTL 1, 2, 3… și citește „time exceeded” de la fiecare hop.</li>
        </ul>
      </Detailed>
      <DeepDive title="De ce ARP se face pentru next hop">
        <p>Ethernet livrează cadre doar în interiorul unui segment. Pentru ca routerul să-i dea pachetul lui R2, el are nevoie de MAC-ul lui R2, nu al destinației finale (care e pe alt segment, necunoscută pe acest link). Adresa IP de destinație din pachet rămâne neschimbată pe tot traseul tocmai pentru că identifică <i>destinația finală</i>; adresele MAC identifică doar <i>următorul hop</i>. Dacă routerul ar face ARP pentru destinația finală, ar funcționa doar printr-un răspuns proxy ARP — de aceea rutele statice cu doar interfață de ieșire pe Ethernet sunt o practică proastă (3.3).</p>
      </DeepDive>
      <Traps items={[
        <>La fiecare router: <b>MAC-urile se schimbă, IP-urile nu</b> (fără NAT).</>,
        <>TTL scade cu 1 la <b>fiecare</b> router; la 0 ⇒ drop + ICMP time exceeded.</>,
        <>ARP se face pentru <b>next hop</b>; doar la rutele connected se face pentru destinația finală.</>,
        <>Fără rută ⇒ drop + ICMP unreachable (<code>U</code> în ping), nu broadcast.</>,
      ]} />
      <InlineQuiz ids={['3.2-025', '3.2-027', '3.2-029']} />
    </section>
  );
}
