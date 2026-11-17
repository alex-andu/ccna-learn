import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AdLadder, DefaultRoutePicker, RecursiveLookup, RouteAnatomy, RouteSources } from '../../diagrams/t3_1';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="3.1" title="Componentele tabelei de rutare — imaginea de ansamblu" />
      <Summary>
        <p>Un <b><G id="router" /></b> decide încotro trimite fiecare pachet uitându-se într-o listă numită <b><G id="routing-table" /></b> (se vede cu <code>show ip route</code>). Fiecare linie este o <b>rută</b> și are aceleași componente: un <b>cod</b> care arată cine a pus-o acolo (C, L, S, O, D, R, B), un <b>prefix</b> cu <b>mască</b>, un <b>next hop</b>, o <b>distanță administrativă</b> și o <b>metrică</b> (scrise <code>[AD/metric]</code>), plus, în antet, <b>gateway of last resort</b>. Obiectivul 3.1 înseamnă să poți citi o astfel de linie fără ezitare.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 3.1 este <i>Interpret the components of routing table</i>, cu șapte sub-puncte: (a) routing protocol code, (b) prefix, (c) network mask, (d) next hop, (e) administrative distance, (f) metric, (g) gateway of last resort. Fiecare are o secțiune aici. Nu configurăm încă nimic complicat: mai întâi învățăm să <b>citim</b>; configurarea rutelor statice vine în 3.3, OSPF în 3.4, iar <i>cum alege</i> routerul între rute (longest prefix match, AD, metrică) este tema obiectivului 3.2.</p>
        <Table head={['Sub-punct oficial', 'Întrebarea la care răspunde', 'Secțiunea']} hlCol={0} rows={[
          ['3.1.a Routing protocol code', 'Cine a pus ruta în tabelă? (conectată, statică, OSPF…)', 'Codurile'],
          ['3.1.b Prefix', 'Pentru ce rețea e valabilă ruta?', 'Prefix și mască'],
          ['3.1.c Network mask', 'Cât de „mare” sau „specifică” e acea rețea?', 'Prefix și mască'],
          ['3.1.d Next hop', 'Cui îi dau pachetul mai departe?', 'Next hop'],
          ['3.1.e Administrative distance', 'Cât de mult mă încred în sursa rutei?', 'AD'],
          ['3.1.f Metric', 'Cât „costă” calea după regulile protocolului?', 'Metrica'],
          ['3.1.g Gateway of last resort', 'Ce fac cu pachetele fără nicio rută?', 'Ruta implicită'],
        ]} />
        <Callout kind="info" title="Ordinea predării">
          Sub-punctele oficiale rămân cu codurile a–g, dar predăm mai întâi codul (3.1.a, ca să știi ce citești), apoi prefix + mască (b, c), apoi next hop (d), AD (e), metrica (f) și la final ruta implicită (g).
        </Callout>

        <h3>De ce există o tabelă de rutare?</h3>
        <p>Un computer are, de obicei, un singur drum spre exterior: <G id="default-gateway">default gateway</G>-ul. Un router, în schimb, stă între mai multe rețele și trebuie să știe pentru <b>fiecare destinație posibilă</b> pe ce interfață și către cine să trimită pachetul. Routerul nu cunoaște Internetul „pe de rost”; ține o listă de rețele pe care le poate atinge și, pentru fiecare, pe unde se ajunge. Această listă este tabela de rutare. Când vine un pachet, routerul ia adresa IP de destinație, o compară cu lista și <b>alege</b> o linie — felul în care alege este subiectul lui 3.2.</p>
        <Analogy>Tabela de rutare e ca indicatoarele dintr-o intersecție mare: „Cluj → stânga”, „Brașov → drept înainte”, „orice altceva → autostrada”. Fiecare indicator spune ce destinație acoperă, încotro mergi și (în plus, la router) cât de bun și cât de sigur e acel drum.</Analogy>

        <h3>Un exemplu complet, citit rând cu rând</h3>
        <p>Iată tabela unui router R1 dintr-un laborator mic (ilustrativă). Încearcă mai întâi să înțelegi tot ce poți; apoi citim fiecare element.</p>
        <CodeBlock title="show ip route (ilustrativ)" kind="session" code={`R1# show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP
       + - replicated route, % - next hop override

Gateway of last resort is 10.0.12.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 10.0.12.2
      10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks
C        10.0.12.0/30 is directly connected, GigabitEthernet0/1
L        10.0.12.1/32 is directly connected, GigabitEthernet0/1
O        10.0.23.0/30 [110/2] via 10.0.12.2, 00:12:34, GigabitEthernet0/1
      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.1.0/24 is directly connected, GigabitEthernet0/0
L        192.168.1.1/32 is directly connected, GigabitEthernet0/0
S     192.168.3.0/24 [1/0] via 10.0.12.2`} explain={[
          ['Codes: …', 'Legenda codurilor; IOS o tipărește de fiecare dată. Nu o memora toată — în examen contează C, L, S, S*, O, D, R, B (și variantele O IA, O E1/E2, D EX).'],
          ['Gateway of last resort is 10.0.12.2 to network 0.0.0.0', 'Antetul spune unde merg pachetele fără rută specifică: către 10.0.12.2, prin ruta implicită 0.0.0.0/0 (3.1.g).'],
          ['S*    0.0.0.0/0 [1/0] via 10.0.12.2', 'Rută statică (S) marcată candidată-default (*); prefix 0.0.0.0, mască /0; AD 1, metrică 0; next hop 10.0.12.2.'],
          ['10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks', 'Linie-antet (nu rută): rețeaua clasică 10.0.0.0/8 apare cu 3 subrețele care folosesc 2 măști diferite (/30 și /32). Doar grupează.'],
          ['C 10.0.12.0/30 … directly connected, Gi0/1', 'Rețeaua atașată interfeței Gi0/1; nu are next hop, AD sau metrică afișate.'],
          ['L 10.0.12.1/32 … directly connected, Gi0/1', 'Ruta locală: adresa interfeței însăși, /32.'],
          ['O 10.0.23.0/30 [110/2] via 10.0.12.2, 00:12:34, Gi0/1', 'Rută învățată prin OSPF: AD 110, metrică (cost) 2, next hop 10.0.12.2, existentă de 12 min 34 s, ieșire pe Gi0/1.'],
          ['S 192.168.3.0/24 [1/0] via 10.0.12.2', 'Rută statică spre LAN-ul din capătul îndepărtat, tot prin R2.'],
        ]} />
        <Callout kind="warn" title="Output ilustrativ">
          Toate output-urile din această lecție sunt <b>exemple ilustrative</b>, construite pe baza formatului IOS/IOS XE; nu au fost capturate de pe echipamente reale. Cifrele exacte (timpi, costuri) și forma unor linii pot diferi ușor între versiuni.
        </Callout>
        <Figure caption="Interactiv: alege tipul rutei și atinge fiecare câmp ca să vezi ce înseamnă și la ce sub-punct oficial se leagă.">
          <RouteAnatomy />
        </Figure>
      </Detailed>
      <Traps items={[
        <>O linie de tabelă are mereu aceleași componente; unele lipsesc la rutele connected (nu au next hop, AD sau metrică afișate).</>,
        <><code>[110/2]</code> = <b>[AD / metrică]</b>, nu „două metrici”. Primul număr e încrederea în sursă, al doilea costul căii.</>,
        <>Rutele <b>nu</b> sunt „toate rutele posibile”: în tabelă e doar cea mai bună rută per prefix, după AD (3.2).</>,
        <>Tabela de rutare spune <b>încotro</b>, nu <b>dacă ajunge</b>. O rută existentă nu garantează că destinația răspunde.</>,
      ]} />
      <InlineQuiz ids={['3.1-001', '3.1-003']} />
    </section>
  );
}

/* ======================================================================
   3.1.a — Codul protocolului
   ====================================================================== */
export function Codes() {
  return (
    <section id="codes" className="section">
      <SectionHead id="codes" code="3.1.a" title="Routing protocol code — cine a pus ruta în tabelă" />
      <Summary>
        <p>Prima coloană a fiecărei rute este un <b>cod</b> care arată <b>sursa</b> rutei: <b>C</b> = connected, <b>L</b> = local (/32), <b>S</b> = static (<b>S*</b> = implicită), <b>O</b> = OSPF, <b>D</b> = EIGRP, <b>R</b> = RIP, <b>B</b> = BGP. Sursa decide AD-ul rutei și, deci, cât de bine „rezistă” în fața altor rute către aceeași rețea.</p>
      </Summary>
      <Detailed title="1. De ce există codul">
        <p>Un router poate afla despre aceeași rețea din mai multe locuri: de la propriile interfețe, de la administrator (rută statică), de la un protocol de rutare dinamică. Pentru depanare trebuie să vezi imediat <b>de unde a venit</b> fiecare linie: dacă o rută e statică uitată, dacă a învățat-o prin OSPF sau dacă e doar rețeaua conectată direct. Codul răspunde exact la asta.</p>
        <Figure caption="Cele trei surse de rute și drumul lor până în tabela de rutare și în FIB/CEF.">
          <RouteSources />
        </Figure>
        <h3>2. Codurile care trebuie să le știi</h3>
        <Table head={['Cod', 'Sursa', 'Cum ajunge în tabelă', 'AD implicit']} hlCol={0} rows={[
          [<b>C</b>, <><G id="connected-route">Connected</G></>, 'Automat, pentru fiecare interfață up/up cu adresă IP', '0'],
          [<b>L</b>, <><G id="local-route">Local</G> (/32)</>, 'Automat, adresa interfeței însăși', '0'],
          [<b>S</b>, <><G id="static-route">Static</G></>, <>Manual: <code>ip route …</code></>, '1'],
          [<b>S*</b>, <><G id="default-route">Rută implicită</G> statică</>, <>Manual: <code>ip route 0.0.0.0 0.0.0.0 …</code></>, '1'],
          [<b>O</b>, <G id="ospf" />, 'Dinamic (vecin OSPF din aceeași arie)', '110'],
          [<b>O IA</b>, 'OSPF inter-area', 'Dinamic (rețea dintr-o altă arie)', '110'],
          [<b>O E1 / E2</b>, 'OSPF external', 'Dinamic (rută redistribuită în OSPF)', '110'],
          [<b>D</b>, <G id="eigrp" />, 'Dinamic (EIGRP intern)', '90'],
          [<b>D EX</b>, 'EIGRP extern', 'Dinamic (redistribuit în EIGRP)', '170'],
          [<b>R</b>, <G id="rip" />, 'Dinamic', '120'],
          [<b>B</b>, <G id="bgp" />, 'Dinamic (eBGP sau iBGP)', '20 / 200'],
        ]} />
        <p>Observă că toate rutele OSPF au același AD (110), indiferent dacă sunt <b>O</b>, <b>O IA</b> sau <b>O E2</b>; diferă doar tipul lor, nu încrederea în sursă. Detaliile despre ariile OSPF nu sunt cerute la CCNA (single-area); trebuie doar să recunoști literele.</p>
        <h3>3. C și L — de ce apar două linii pentru o interfață</h3>
        <p>Dacă interfața Gi0/0 are 192.168.1.1/24 și este up/up, tabela conține două rute generate automat: <code>C 192.168.1.0/24</code> (rețeaua întreagă, prin care ajungi la toate gazdele de pe LAN) și <code>L 192.168.1.1/32</code> (exact adresa routerului). A doua spune routerului: „pachetele cu destinația <b>192.168.1.1</b> sunt pentru mine — nu le mai transmite, livrează-le local”. Fără L, un ping către propria interfață sau o sesiune SSH către router ar trebui tratate ca excepții; cu L, regula de decizie rămâne aceeași (cea mai specifică rută câștigă, iar un /32 e maxim de specific).</p>
        <Callout kind="tip" title="Cum apar și dispar C și L">
          C și L apar doar când interfața e <b>up/up</b> <i>și</i> are adresă IP. Dacă tragi cablul sau dai <code>shutdown</code>, ambele dispar imediat și odată cu ele toate rutele care depindeau de acea rețea (de exemplu next hop-uri rezolvate prin ea). Aceasta este prima verificare de făcut când „dispare” o rută.
        </Callout>
        <h3>4. Asteriscul și variantele</h3>
        <ul>
          <li><b>*</b> înseamnă „candidată pentru ruta implicită” (<i>candidate default</i>). Apare ca <b>S*</b> sau <b>O*E2</b> și leagă linia de antetul „Gateway of last resort”.</li>
          <li><b>IA</b> = inter area, <b>E1/E2</b> = external type 1/2, <b>N1/N2</b> = NSSA external: sub-tipuri OSPF, cunoscute doar „de recunoscut”.</li>
          <li><b>EX</b> = EIGRP external.</li>
        </ul>
      </Detailed>
      <DeepDive title="Cum ajunge o rută din protocol în tabelă">
        <p>Fiecare protocol de rutare își ține propria bază de date (OSPF: LSDB, EIGRP: topology table, RIP: baza lui). Din ea calculează cele mai bune rute <b>din punctul lui de vedere</b> și le propune tabelei de rutare globale. Dacă două protocoale (sau un protocol și o rută statică) propun același prefix, tabela păstrează ruta cu AD mai mic; cealaltă rămâne în baza protocolului și intră în tabelă dacă prima dispare. Tabela de rutare este deci un <b>rezultat al comparației</b> dintre surse, nu o simplă concatenare lor.</p>
      </DeepDive>
      <Traps items={[
        <>Codul <b>L</b> (local) nu e o rețea pe care o poți ajunge: e adresa routerului însuși.</>,
        <><b>S*</b> și <b>S</b> sunt ambele statice; asteriscul doar marchează ruta ca rută implicită candidată.</>,
        <>Toate tipurile OSPF (O, O IA, O E1/E2) au AD <b>110</b>.</>,
        <>Fără <code>ip routing</code> sau fără interfețe up/up, tabela nu conține nici măcar rutele C și L.</>,
      ]} />
      <InlineQuiz ids={['3.1-005', '3.1-007', '3.1-009']} />
    </section>
  );
}

/* ======================================================================
   3.1.b + 3.1.c — Prefix și mască
   ====================================================================== */
export function PrefixMask() {
  return (
    <section id="prefix" className="section">
      <SectionHead id="prefix" code="3.1.b / 3.1.c" title="Prefix și network mask — pentru ce rețea e valabilă ruta" />
      <Summary>
        <p><b><G id="route-prefix">Prefixul</G></b> este adresa rețelei de destinație (cu biții de gazdă 0), iar <b>masca</b> (afișată ca <G id="prefix-length">lungime de prefix</G>, de exemplu <code>/24</code>) spune câți biți de la început contează. Împreună definesc un <b>interval de adrese</b>. Un pachet se potrivește cu ruta dacă adresa lui de destinație cade în acel interval; cu cât masca e mai lungă, cu atât ruta e mai <b>specifică</b>.</p>
      </Summary>
      <Detailed title="1. Prefixul și masca citite din tabelă">
        <p>În tabelă o rută arată <code>192.168.3.0/24</code>. Partea dinaintea lui „/” este <b>prefixul</b> (adresa rețelei), iar numărul de după este <b>masca în notație prefix</b>. Ea echivalează cu <G id="subnet-mask" /> clasică: /24 = 255.255.255.0, /25 = 255.255.255.128, /30 = 255.255.255.252 etc. IOS afișează în tabelă întotdeauna forma prescurtată (/n). Aceste noțiuni sunt cele din 1.6; aici le folosim ca să decidem <b>ce adrese acoperă o rută</b>.</p>
        <Table head={['Rută', 'Masca', 'Adrese acoperite', 'Câte']} hlCol={0} rows={[
          ['10.0.0.0/8', '255.0.0.0', '10.0.0.0 – 10.255.255.255', '16.777.216'],
          ['192.168.3.0/24', '255.255.255.0', '192.168.3.0 – 192.168.3.255', '256'],
          ['192.168.3.128/25', '255.255.255.128', '192.168.3.128 – 192.168.3.255', '128'],
          ['10.0.12.0/30', '255.255.255.252', '10.0.12.0 – 10.0.12.3', '4'],
          ['192.168.3.10/32', '255.255.255.255', 'doar 192.168.3.10', '1'],
          ['0.0.0.0/0', '0.0.0.0', 'toate adresele IPv4', '4.294.967.296'],
        ]} />
        <h3>2. Cum se compară o adresă cu un prefix</h3>
        <p>Routerul ia primii <i>n</i> biți ai adresei de destinație (n = lungimea prefixului) și îi compară cu primii <i>n</i> biți ai prefixului rutei. Dacă sunt identici, ruta se potrivește. Exemplu: destinația <code>192.168.3.10</code> față de <code>192.168.3.0/24</code>:</p>
        <CodeBlock title="Comparare pe biți (primii 24)" kind="session" code={`destinație  192.168.3.10 = 11000000.10101000.00000011.00001010
prefix      192.168.3.0  = 11000000.10101000.00000011.00000000
                           |<------- 24 biți comparați ------->|  → identici ⇒ SE POTRIVEȘTE
ultimii 8 biți (00001010 vs 00000000) nu contează la /24`} explain={[
          ['primii 24 de biți', 'Cei trei octeți completi (192.168.3) sunt identici.'],
          ['ultimii 8 biți', 'La /24 nu se compară: orice gazdă 192.168.3.x intră în rețea.'],
        ]} />
        <h3>3. Specific vs general</h3>
        <p>Un prefix mai lung (mască mai mare) acoperă mai puține adrese, deci e mai <b>specific</b>. <code>192.168.3.10/32</code> este mai specific decât <code>192.168.3.0/24</code>, care e mai specific decât <code>192.168.0.0/16</code>, care e mai specific decât <code>0.0.0.0/0</code>. Același pachet poate să se potrivească cu mai multe rute simultan (toate cele de mai sus pentru 192.168.3.10); alegerea dintre ele (cea mai specifică) este <b>longest prefix match</b>, obiect separat în 3.2. Aici important este doar: <b>o mască mai mare înseamnă o rută mai specifică</b>.</p>
        <h3>4. Rețeaua clasică și liniile „variably subnetted”</h3>
        <p>IOS grupează rutele sub rețeaua lor „clasică” (de exemplu tot ce începe cu 10. sub 10.0.0.0/8) și scrie o linie-antet: <code>10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks</code>. Ea înseamnă că în grup apar 3 rute și 2 lungimi de mască diferite (de exemplu /30 și /32). <b>Nu este o rută reală</b>: nu trimite pachete nicăieri. Dacă o singură mască se repetă, formularea este <code>is subnetted, 2 subnets</code>.</p>
        <Callout kind="exam" title="Cum citești rapid un prefix la examen">
          (1) Ia lungimea (/24). (2) Vezi „octetul interesant” (unde cade granița): la /24 e octetul 3, la /26 e octetul 4. (3) Calculează dimensiunea blocului (256 − valoarea măștii în acel octet) și intervalul. De exemplu 192.168.3.128/25: octetul 4, mască 128, bloc 128 → 192.168.3.128–192.168.3.255. Pentru ruta ta, calculul de subnetare se face la fel ca în 1.6.
        </Callout>
      </Detailed>
      <DeepDive title="De ce prefixul are biții de gazdă 0">
        <p>Prefixul unei rute este întotdeauna adresa rețelei: toți biții de gazdă sunt 0. La configurarea unei rute statice, dacă scrii <code>ip route 192.168.3.5 255.255.255.0 …</code>, IOS respinge de regulă comanda (mesaj de tip „%Inconsistent address and mask”), pentru că adresa are biți de gazdă nenuli față de mască. De aceea, în tabelă, un prefix cu biți de gazdă nenuli apare doar la rute <b>host (/32)</b>, unde masca e 255.255.255.255 și toți biții contează. Masca din tabelă și lungimea din <code>ip route</code> trebuie să descrie exact rețeaua pe care vrei să o acoperi.</p>
      </DeepDive>
      <Traps items={[
        <><b>/24 = 255.255.255.0</b>, /25 = .128, /26 = .192, /30 = .252; cu cât numărul după „/” e mai mare, cu atât ruta e mai <b>specifică</b>.</>,
        <>Linia „is variably subnetted” e doar un antet, nu o rută.</>,
        <>Nu confunda masca de rețea cu <b>wildcard mask</b> (folosită la OSPF/ACL): /24 în tabelă = 255.255.255.0, nu 0.0.0.255.</>,
        <><code>0.0.0.0/0</code> acoperă <b>tot</b> spațiul IPv4 și este cea mai puțin specifică rută.</>,
      ]} />
      <InlineQuiz ids={['3.1-011', '3.1-013', '3.1-015']} />
    </section>
  );
}

/* ======================================================================
   3.1.d — Next hop
   ====================================================================== */
export function NextHop() {
  return (
    <section id="nexthop" className="section">
      <SectionHead id="nexthop" code="3.1.d" title="Next hop — cui îi dau pachetul mai departe" />
      <Summary>
        <p><b><G id="next-hop">Next hop</G></b> este adresa IP a următorului router de pe drumul către destinație (apare după <code>via</code>). Routerul nu trimite pachetul „la destinația finală”, ci doar la următorul hop, care repetă procesul. Rutele <b>connected</b> nu au next hop: destinația e pe aceeași rețea, deci se livrează direct.</p>
      </Summary>
      <Detailed title="1. Rutare hop-by-hop">
        <p>Niciun router nu știe drumul complet până la destinație. Fiecare cunoaște doar <b>următorul pas</b>: „pentru 192.168.3.0/24 dă-i pachetul lui 10.0.12.2”. R2, la rândul lui, are propria lui rută și alege următorul next hop. Pachetul ajunge la destinație prin lanțul acestor decizii independente. Acest model se numește <b>hop-by-hop</b> (un „hop” = un router traversat).</p>
        <h3>2. Ce trebuie să fie adevărat ca next hop-ul să funcționeze</h3>
        <ul>
          <li>Adresa de next hop trebuie să fie într-o rețea <b>atașată direct</b> routerului curent (sau rezolvabilă recursiv către una): un router nu poate preda un pachet cuiva pe care nu-l poate ajunge pe un link.</li>
          <li>Routerul de la acea adresă trebuie să fie funcțional și să aibă la rândul lui o rută către destinație (altfel pachetul se pierde mai departe).</li>
        </ul>
        <h3>3. Rezolvarea recursivă a next hop-ului</h3>
        <p>O rută cu <code>via 10.0.12.2</code> spune <i>către cine</i>, nu <i>pe unde</i>. Routerul trebuie să găsească interfața de ieșire: caută <b>din nou</b> în tabelă adresa 10.0.12.2, găsește <code>C 10.0.12.0/30 … Gi0/1</code> și află că ieșirea este Gi0/1. Aceasta este <b><G id="recursive-lookup">căutarea recursivă</G></b>. Dacă a doua căutare nu găsește nimic, ruta nu se poate folosi (și o rută statică de acest tip nici nu se instalează).</p>
        <Figure caption="Interactiv: cele două căutări necesare pentru o rută cu next hop IP (paşii 1–3).">
          <RecursiveLookup />
        </Figure>
        <h3>4. Ce se întâmplă la nivelul 2</h3>
        <p>După ce routerul știe că trebuie să iasă pe Gi0/1 către 10.0.12.2, trebuie să construiască cadrul Ethernet. Are nevoie de MAC-ul lui 10.0.12.2, deci folosește <G id="arp" />: întreabă pe link „cine are 10.0.12.2?”. Subliniem: <b>ARP se face pentru next hop, nu pentru destinația finală</b>. Adresa IP de destinație din pachet (192.168.3.10) rămâne neschimbată; se schimbă doar antetul Ethernet (MAC sursă = interfața de ieșire, MAC destinație = next hop). Mecanismul pas cu pas e în 3.2.</p>
        <h3>5. Ruta cu interfață de ieșire în loc de next hop</h3>
        <p>La rutele statice poți indica o interfață de ieșire (<code>ip route 10.2.0.0 255.255.0.0 gi0/1</code>) în loc de next hop. În tabelă apare <code>S 10.2.0.0/16 is directly connected, GigabitEthernet0/1</code>, adică seamănă cu o rută connected. Pe Ethernet asta funcționează doar pentru că routerul face ARP direct pentru <i>destinația finală</i> (și routerul din față trebuie să răspundă prin proxy ARP), deci e o practică de evitat. Variantele corecte (next hop, sau interfață + next hop) sunt în 3.3.</p>
      </Detailed>
      <DeepDive title="De ce next hop-ul e adresă IP și nu un nume sau un MAC">
        <p>Next hop-ul trebuie să fie independent de nivelul 2: aceeași rută funcționează pe Ethernet, pe legături seriale sau pe tuneluri. Adresa IP e stabilă și o rezolvă ARP (sau echivalentul) la momentul transmiterii. Dacă în loc de IP s-ar folosi MAC-ul, schimbarea unei plăci de rețea ar rupe toate rutele care o folosesc. Un alt motiv: vecinii dintr-un protocol de rutare se identifică prin adresele IP ale interfețelor lor, iar acele adrese ajung direct ca next hop-uri în tabelă.</p>
      </DeepDive>
      <Traps items={[
        <>Next hop = adresa IP a <b>următorului</b> router, nu a destinației finale și nu a propriei interfețe.</>,
        <>ARP se face pentru <b>next hop</b>, iar IP-ul de destinație din pachet nu se schimbă.</>,
        <>Rutele connected (<b>C</b>, <b>L</b>) nu au next hop.</>,
        <>Un next hop care nu se rezolvă printr-o rută connected face ruta inutilizabilă.</>,
      ]} />
      <InlineQuiz ids={['3.1-017', '3.1-019', '3.1-021']} />
    </section>
  );
}

/* ======================================================================
   3.1.e — Administrative distance
   ====================================================================== */
export function Ad() {
  return (
    <section id="ad" className="section">
      <SectionHead id="ad" code="3.1.e" title="Administrative distance — cât de mult te încrezi în sursa rutei" />
      <Summary>
        <p><b><G id="administrative-distance">AD</G></b> este un număr 0–255 atașat <b>sursei</b> unei rute (connected 0, static 1, OSPF 110, RIP 120…). <b>Mai mic = mai de încredere.</b> Apare ca primul număr din <code>[AD/metric]</code>. Se folosește ca să alegi între rute către <b>același prefix</b> venite din surse <b>diferite</b>.</p>
      </Summary>
      <Detailed title="1. Problema pe care o rezolvă AD">
        <p>Imaginează-ți că R1 află despre rețeaua 192.168.3.0/24 din două locuri: de la OSPF (cost 2) și dintr-o rută statică. Care e mai bună? Nu poți compara „cost 2” cu „metrică 0” pentru că fiecare protocol măsoară altceva (OSPF: cost din lățimea de bandă; RIP: hop-uri; statice: nimic). Aceste numere sunt <b>incomparabile între protocoale</b>. Cisco a introdus așadar un al doilea criteriu, <b>AD</b>: o listă fixă (dar modificabilă) de „grade de încredere” ale surselor. Mai întâi se compară AD; metrica se compară abia în interiorul aceleiași surse.</p>
        <Analogy>Primești două știri despre același eveniment: una de la un martor ocular (rețeaua conectată direct, AD 0), una din presă (OSPF, AD 110). Dacă diferă, ai mai multă încredere în martor — indiferent cât de „sigură” sună știrea din presă (metrica).</Analogy>
        <h3>2. Valorile implicite Cisco</h3>
        <Figure caption="Interactiv: atinge o sursă ca să vezi detaliile. Mai mic = mai de încredere.">
          <AdLadder />
        </Figure>
        <Table head={['Sursa', 'AD', 'Observație']} hlCol={1} rows={[
          ['Connected', '0', 'Mereu câștigă (cu excepția rutei mai specifice)'],
          ['Static', '1', 'Se poate mări la o rută „flotantă”'],
          ['EIGRP summary', '5', 'Rar în examen'],
          ['eBGP', '20', ''],
          ['EIGRP internal', '90', ''],
          ['OSPF', '110', 'De memorat'],
          ['IS-IS', '115', ''],
          ['RIP', '120', 'De memorat'],
          ['EIGRP external', '170', 'Rute redistribuite'],
          ['iBGP', '200', ''],
          ['Unknown / unusable', '255', 'Nu se instalează în tabelă'],
        ]} />
        <Callout kind="exam" title="Ce se memorează">
          La CCNA contează în primul rând: <b>connected 0 · static 1 · eBGP 20 · EIGRP 90 · OSPF 110 · RIP 120</b>. Regula e mai importantă decât cifrele: <b>AD mai mic câștigă</b>. Valorile sunt cele implicite Cisco; pot fi schimbate (de exemplu AD-ul unei rute statice).
        </Callout>
        <h3>3. AD în acțiune</h3>
        <p>Dacă R1 a învățat 10.2.2.0/24 prin OSPF și EIGRP, în tabelă rămâne ruta EIGRP (90 &lt; 110). Dacă adaugi o rută statică pentru același prefix, ea (AD 1) înlocuiește rutele dinamice. Ruta pierzătoare nu e ștearsă: rămâne în baza de date a protocolului și revine dacă ruta câștigătoare dispare. Aceasta este baza <b>rutei statice flotante</b>: o rută statică cu AD mărit peste cel al protocolului dinamic (de exemplu 130 &gt; 110) rămâne ascunsă cât timp OSPF funcționează și apare doar când OSPF dispare (3.2 și 3.3).</p>
        <CodeBlock title="Verifici AD-ul unei rute (ilustrativ)" kind="session" code={`R1# show ip route 192.168.3.0
Routing entry for 192.168.3.0/24
  Known via "ospf 1", distance 110, metric 2, type intra area
  Last update from 10.0.12.2 on GigabitEthernet0/1, 00:12:34 ago
  Routing Descriptor Blocks:
  * 10.0.12.2, from 10.0.23.2, 00:12:34 ago, via GigabitEthernet0/1
      Route metric is 2, traffic share count is 1`} explain={[
          ['Known via "ospf 1", distance 110', 'Sursa rutei și AD-ul ei, în text.'],
          ['metric 2', 'Metrica rutei (costul OSPF).'],
          ['* 10.0.12.2 … via GigabitEthernet0/1', 'Next hop-ul folosit și interfața de ieșire. Asteriscul marchează intrarea activă dintr-un bloc de descriptori.'],
        ]} />
        <p>Comanda <code>show ip route &lt;adresă&gt;</code> este cea mai bună metodă de a vedea „de ce” are ruta acel AD și acel next hop, fără să citești întreaga tabelă.</p>
      </Detailed>
      <DeepDive title="AD se compară doar pentru același prefix">
        <p>Atenție la o confuzie frecventă: AD <b>nu</b> decide între rute cu prefixe diferite. Dacă OSPF oferă 192.168.3.0/24 și o rută statică oferă 192.168.3.0/25, ambele rămân în tabelă; pachetele spre 192.168.3.10 vor alege /25 (mai specifică) indiferent de AD, iar cele spre 192.168.3.200 vor folosi /24. AD intră în joc doar când <b>prefixul și masca sunt identice</b>. Ordinea de aplicare completă (prefix mai lung → AD → metrică) o discutăm în 3.2.</p>
      </DeepDive>
      <Traps items={[
        <>AD: <b>mai mic câștigă</b> (0 e cel mai de încredere, 255 înseamnă „nu folosi”).</>,
        <>AD este o proprietate a <b>sursei</b>; metrica e a <b>căii</b>. Nu le inversa în <code>[AD/metric]</code>.</>,
        <>OSPF 110 · RIP 120 · EIGRP 90 · static 1 · connected 0.</>,
        <>AD nu compară rute cu prefixe diferite — acolo contează lungimea prefixului.</>,
      ]} />
      <InlineQuiz ids={['3.1-023', '3.1-025', '3.1-027']} />
    </section>
  );
}

/* ======================================================================
   3.1.f — Metric
   ====================================================================== */
export function Metric() {
  return (
    <section id="metric" className="section">
      <SectionHead id="metric" code="3.1.f" title="Metric — cât costă calea după regulile protocolului" />
      <Summary>
        <p><b><G id="route-metric">Metrica</G></b> este al doilea număr din <code>[AD/metric]</code>. Fiecare protocol o calculează diferit: <b>OSPF</b> = cost (din lățimea de bandă), <b>RIP</b> = număr de hop-uri, <b>EIGRP</b> = valoare compusă. Între două rute către același prefix <b>din același protocol</b>, câștigă metrica <b>mai mică</b>. Metricile protocoalelor diferite <b>nu se compară</b>.</p>
      </Summary>
      <Detailed title="1. Ce măsoară fiecare protocol">
        <Table head={['Protocol', 'Metrica', 'Cum se calculează', 'Mai bine =']} hlCol={0} rows={[
          ['Connected / Static', '0', 'nu există calcul', '—'],
          [<G id="rip" />, 'hop count', 'număr de routere până la destinație; 15 = maxim, 16 = inaccesibil', 'mai puține hop-uri'],
          [<G id="ospf" />, 'cost', 'suma costurilor interfețelor de ieșire; cost = bandă de referință ÷ bandă interfață (implicit 100 Mbps)', 'cost mai mic'],
          [<G id="eigrp" />, 'metrică compusă', 'implicit din lățime de bandă (cea mai mică de pe drum) și delay cumulat', 'valoare mai mică'],
          [<G id="bgp" />, 'nu e o metrică simplă', 'atribute de cale (AS-path etc.), politici', 'după regulile BGP'],
        ]} />
        <p>În fiecare caz, <b>mai mic înseamnă mai bun</b>. Ce reprezintă numărul diferă, de aceea o metrică 20 în RIP (imposibil, maxim 15) nu are nicio legătură cu o metrică 20 în OSPF.</p>
        <h3>2. OSPF: cost și lățime de bandă</h3>
        <p>Costul unei interfețe este <code>bandă de referință ÷ banda interfeței</code>, cu referința implicită de 100 Mbps. Astfel FastEthernet (100 Mbps) are cost 1; Ethernet 10 Mbps are cost 10; o linie T1 (1,544 Mbps) are cost 64. Costul unui drum este <b>suma</b> costurilor interfețelor prin care iese pachetul, inclusiv ultima rețea. De aceea <code>[110/2]</code> poate însemna două legături FastEthernet.</p>
        <Callout kind="warn" title="GigabitEthernet și 10G au tot cost 1">
          Cu referința implicită de 100 Mbps, orice interfață mai rapidă de 100 Mbps primește cost 1 (nu se rotunjește sub 1). Routerul nu face deosebire între 100 Mbps și 10 Gbps decât dacă ajustezi <code>auto-cost reference-bandwidth</code> (3.4).
        </Callout>
        <h3>3. RIP: număr de hop-uri</h3>
        <p>O rețea atașată direct are 0 hop-uri pe routerul care o deține; vecinul o vede la 1, următorul la 2 etc. Un hop e un router de traversat. RIP nu ține cont de viteză: o cale cu 1 hop printr-o legătură de 10 Mbps bate o cale cu 2 hop-uri prin legături Gigabit. De aceea RIP nu se mai folosește în rețele moderne.</p>
        <h3>4. Metrica rutelor connected și statice</h3>
        <p>La rutele <b>connected</b> și <b>statice</b> metrica afișată este <b>0</b> (nu există un protocol care să o calculeze). Ele se diferențiază prin AD (0 și 1). Dacă ai două rute statice către același prefix, cu același AD, ambele intră în tabelă și routerul împarte traficul între ele (<G id="ecmp" />).</p>
        <h3>5. Când metrica decide</h3>
        <p>Metrica decide <b>doar</b> când două rute către <b>același prefix</b> sunt oferite de <b>același protocol</b>: de exemplu OSPF află 192.168.3.0/24 pe două căi (cost 2 și cost 3); în tabelă intră ruta cu cost 2. Dacă metricile sunt egale, ambele intră și traficul se împarte (ECMP). Detaliile, împreună cu AD și lungimea prefixului, în 3.2.</p>
      </Detailed>
      <DeepDive title="De ce metricile nu se pot compara între protocoale">
        <p>OSPF cost 2 și RIP 2 hop-uri nu spun același lucru: unul e o sumă de fracții de lățime de bandă, celălalt un număr de routere. Mai mult, protocoalele nici nu au aceeași „scară”: EIGRP produce valori de ordinul zecilor de mii. O comparare directă ar favoriza arbitrar protocolul cu numere mai mici. Soluția Cisco: AD — o ierarhie de încredere independentă de metrici. Dacă utilizatorul vrea să prefere un protocol, schimbă AD-ul, nu metrica.</p>
      </DeepDive>
      <Traps items={[
        <>Metrica se compară doar <b>în același protocol</b>; între protocoale decide AD.</>,
        <>OSPF: cost = 100 Mbps ÷ bandă (implicit), deci FastEthernet, GigabitEthernet și 10G au toate cost 1.</>,
        <>RIP: <b>hop count</b>, maxim 15; 16 = inaccesibil.</>,
        <>Rutele connected și statice au metrica 0 în tabelă.</>,
      ]} />
      <InlineQuiz ids={['3.1-029', '3.1-031', '3.1-033']} />
    </section>
  );
}

/* ======================================================================
   3.1.g — Gateway of last resort
   ====================================================================== */
export function DefaultRoute() {
  return (
    <section id="default" className="section">
      <SectionHead id="default" code="3.1.g" title="Gateway of last resort — ruta de ultimă instanță" />
      <Summary>
        <p><b><G id="gateway-of-last-resort">Gateway of last resort</G></b> este destinația către care routerul trimite pachetele pentru care <b>nu are nicio rută specifică</b>. Provine din <b><G id="default-route">ruta implicită</G></b> <code>0.0.0.0/0</code> (marcată <b>S*</b> sau cu <code>*</code>). Dacă ea lipsește, antetul spune <code>Gateway of last resort is not set</code> și pachetele necunoscute sunt <b>aruncate</b>.</p>
      </Summary>
      <Detailed title="1. De ce există">
        <p>Un router de sucursală nu poate cunoaște sutele de mii de rute ale Internetului. Cunoaște doar rețelele lui și, pentru tot restul, are o singură regulă: „dă-i ISP-ului”. Ruta implicită este tocmai această regulă: <b>0.0.0.0/0</b> se potrivește cu orice adresă (lungimea prefixului este 0, deci niciun bit nu se compară). Pentru că e cea mai puțin specifică rută posibilă, ea este folosită doar atunci când <b>nicio altă</b> rută nu se potrivește (longest prefix match, 3.2).</p>
        <Figure caption="Interactiv: alege o destinație și vezi ce rută din tabelă o prinde.">
          <DefaultRoutePicker />
        </Figure>
        <h3>2. Cum arată în tabelă</h3>
        <CodeBlock title="Cu și fără rută implicită (ilustrativ)" kind="session" code={`R1# show ip route
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      ...

R2# show ip route
Gateway of last resort is not set

      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.0.23.0/30 is directly connected, GigabitEthernet0/1
      ...`} explain={[
          ['Gateway of last resort is 203.0.113.1 to network 0.0.0.0', 'Ruta implicită există, cu next hop 203.0.113.1 (routerul ISP).'],
          ['S* 0.0.0.0/0 [1/0] via 203.0.113.1', 'Ruta implicită statică: prefix 0.0.0.0, mască /0, AD 1, metrică 0.'],
          ['Gateway of last resort is not set', 'Nu există rută implicită. Orice destinație care nu se potrivește cu o rută specifică va fi aruncată.'],
        ]} />
        <h3>3. Cum ajunge ruta implicită în tabelă</h3>
        <ul>
          <li><b>Statică</b>: <code>ip route 0.0.0.0 0.0.0.0 &lt;next hop&gt;</code> (cod <b>S*</b>) — metoda cea mai simplă (3.3).</li>
          <li><b>Dinamică</b>: un router o anunță celorlalți, de exemplu OSPF cu <code>default-information originate</code> (3.4); în tabelă apare <b>O*E2</b>.</li>
          <li><b>DHCP</b>: o interfață care primește adresa prin DHCP poate instala automat ruta implicită primită de la server.</li>
        </ul>
        <h3>4. Fără rută implicită, fără rută specifică: ce se întâmplă</h3>
        <p>Pachetul este <b>aruncat</b>, iar routerul trimite sursei un mesaj <i>ICMP destination unreachable</i> (net unreachable). Din <code>ping</code> pe un router Cisco, acest răspuns apare ca <code>U</code> (iar un timeout apare ca <code>.</code>). Este una dintre cele mai frecvente cauze ale lui „am rețea la mine, dar nu ajung la Internet”: lipsește ruta implicită pe un router de pe drum.</p>
        <Callout kind="tip" title="Default gateway vs gateway of last resort">
          „Default gateway” (de pe un PC, 1.10) și „gateway of last resort” (de pe un router) au aceeași idee — „încotro merg când nu știu unde” —, dar al doilea provine dintr-o <b>rută implicită în tabela de rutare</b>. Un router nu are „default gateway” în sensul PC-ului (decât un switch L2 fără IP routing); are rută implicită.
        </Callout>
      </Detailed>
      <DeepDive title="De ce 0.0.0.0/0 și nu o adresă specială">
        <p>Ideea de „rută către orice” se poate scrie ca un prefix obișnuit, cu lungimea 0: niciun bit nu e comparat, deci toate adresele se potrivesc. Astfel nu e nevoie de un mecanism special în algoritmul de căutare: aceeași regulă (cea mai lungă potrivire câștigă) face ca ruta implicită să fie folosită <i>ultima</i>, automat. Echivalentul IPv6 este <code>::/0</code>. Consecință practică: ruta implicită nu „blochează” rutele specifice, iar adăugarea ei nu poate strica rutele existente.</p>
      </DeepDive>
      <Traps items={[
        <><b>0.0.0.0/0</b> = ruta implicită; <code>S*</code> = static candidate default; „not set” = nu există.</>,
        <>Ruta implicită se folosește doar când <b>nicio rută mai specifică</b> nu se potrivește.</>,
        <>Fără ea (și fără rută specifică), pachetul se aruncă și sursa primește ICMP unreachable (<code>U</code> în ping).</>,
        <>„Gateway of last resort” este o proprietate a <b>routerului</b>, nu a PC-ului.</>,
      ]} />
      <InlineQuiz ids={['3.1-035', '3.1-037', '3.1-039']} />
    </section>
  );
}
