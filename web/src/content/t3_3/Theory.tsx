import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DefaultRouteStub, FloatingFailover, Ipv6NextHop, ReturnRoute, StaticForms } from '../../diagrams/t3_3';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="3.3" title="Rute statice IPv4 și IPv6 — imaginea de ansamblu" />
      <Summary>
        <p>O <b><G id="static-route" /></b> este o rută scrisă <b>manual</b> de administrator: „pentru rețeaua X, trimite pachetele la next hop-ul Y”. Routerul nu o învață de la nimeni și nu o schimbă singur. Există patru utilizări oficiale: <b>ruta implicită</b>, <b>ruta de rețea</b>, <b>ruta de gazdă</b> și <b>ruta flotantă</b> (de rezervă) — fiecare în varianta IPv4 (<code>ip route</code>) și IPv6 (<code>ipv6 route</code>).</p>
      </Summary>
      <Detailed>
        <p>În 3.1 am învățat să citim tabela de rutare, iar în 3.2 am văzut cum alege routerul între rute. Acum învățăm să <b>adăugăm noi înșine</b> rute în tabelă. Obiectivul oficial 3.3 este <i>Configure and verify IPv4 and IPv6 static routing</i>, cu patru sub-puncte:</p>
        <Table head={['Sub-punct oficial', 'Ce face ruta', 'Exemplu IPv4', 'Secțiunea']} hlCol={0} rows={[
          ['3.3.a Default route', 'Prinde tot traficul fără altă potrivire (0.0.0.0/0 sau ::/0)', 'ip route 0.0.0.0 0.0.0.0 203.0.113.1', 'Ruta implicită'],
          ['3.3.b Network route', 'Duce traficul către o rețea/subrețea întreagă', 'ip route 10.2.0.0 255.255.0.0 10.1.1.2', 'Ruta de rețea'],
          ['3.3.c Host route', 'Duce traficul către o singură adresă (/32 sau /128)', 'ip route 10.2.2.2 255.255.255.255 10.1.1.2', 'Ruta de gazdă'],
          ['3.3.d Floating static', 'Rută de rezervă, cu AD mărit, activă doar când cea principală dispare', 'ip route 10.2.0.0 255.255.0.0 10.9.9.2 130', 'Ruta flotantă'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Codurile oficiale (3.3.a–d) se păstrează. Predăm în ordinea a, b, c, d, apoi adăugăm o secțiune dedicată particularităților <b>IPv6</b> (link-local ca next hop, <code>ipv6 unicast-routing</code>), pentru că examenul cere ambele familii de adrese la fiecare sub-punct.
        </Callout>

        <h3>De ce există rutele statice?</h3>
        <p>Un router învață singur doar rețelele la care e <b>conectat direct</b> (rutele C și L). Orice altă rețea trebuie să ajungă în tabelă pe una din două căi: printr-un <b>protocol de rutare dinamică</b> (OSPF, EIGRP etc.), în care routerele își povestesc singure rețelele, sau <b>manual</b>, prin rute statice. Rutele statice sunt cea mai simplă soluție, deoarece:</p>
        <ul>
          <li><b>nu consumă</b> lățime de bandă sau CPU pentru mesaje de protocol (nu există vecini, nu există hello-uri);</li>
          <li>sunt <b>previzibile</b>: traficul merge exact pe unde ai scris, fără surprize;</li>
          <li>sunt <b>sigure</b>: nimeni nu poate injecta rute false prin protocol;</li>
          <li>sunt <b>ideale</b> pentru rețele mici, pentru rețele „stub” (o singură ieșire) și pentru ruta spre Internet.</li>
        </ul>
        <p>Prețul: <b>nu se adaptează</b>. Dacă un link cade sau apare o rețea nouă, nimeni nu actualizează ruta; administratorul trebuie să o facă. În rețele mari, cu zeci de routere, mentenanța manuală devine imposibilă — de aceea există OSPF (3.4).</p>
        <Analogy>O rută statică este ca un indicator pe care îl bagi tu în pământ: „spre Cluj → pe aici”. Funcționează perfect atâta timp cât drumul există și nu-l muți nimeni. Un protocol dinamic este ca un GPS cu trafic în timp real: își schimbă singur indicațiile când se închide un drum.</Analogy>

        <h3>Anatomia comenzii</h3>
        <CodeBlock title="Sintaxa generală" kind="session" code={`ip route <rețea> <mască> {<next-hop> | <interfață> | <interfață> <next-hop>} [<AD>]
ipv6 route <prefix>/<lungime> {<next-hop> | <interfață> | <interfață> <next-hop>} [<AD>]`} explain={[
          ['<rețea> <mască>', 'Prefixul destinației, cu masca în format zecimal (IPv4). La IPv6 se scrie prefix/lungime, ca la orice adresă IPv6.'],
          ['<next-hop>', 'Adresa IP a următorului router de pe drum (de obicei cel mai sigur argument).'],
          ['<interfață>', 'Interfața locală de ieșire (alternativă sau completare la next hop).'],
          ['[<AD>]', 'Opțional: administrative distance. Implicit 1 pentru statice; mărit ⇒ rută flotantă (3.3.d).'],
        ]} />
        <Figure caption="Interactiv: cele trei forme ale argumentului de destinație. Observă cum se schimbă ce afișează show ip route și câte ARP-uri face routerul.">
          <StaticForms />
        </Figure>

        <h3>Cele trei forme ale unei rute statice</h3>
        <Table head={['Formă', 'Se scrie cu', 'În tabelă apare ca', 'Observații']} rows={[
          ['Recursivă (next hop IP)', 'adresa next hop-ului', 'S … via 10.1.1.2', 'Routerul face o a doua căutare ca să afle interfața (recursive lookup). Forma implicită de folosit pe Ethernet.'],
          ['Directly attached (interfață)', 'doar interfața de ieșire', 'S … is directly connected, Gi0/1', 'Ruta pare „connected”. Pe Ethernet cere proxy ARP la celălalt capăt: evit-o. Naturală pe legături seriale punct-la-punct.'],
          ['Fully specified', 'interfață + next hop', 'S … via 10.1.1.2, Gi0/1', 'Fără ambiguități; obligatorie la IPv6 cu next hop link-local.'],
        ]} />
        <Callout kind="exam" title="Ce reții pentru examen">
          Pe o legătură Ethernet scrie ruta statică cu <b>adresa next hop</b> sau cu <b>interfață + next hop</b>. „Doar interfață” funcționează numai prin proxy ARP și e considerată o practică slabă. Pentru IPv6 cu next hop <b>link-local</b>, interfața <b>trebuie</b> precizată.
        </Callout>

        <h3>Când se instalează o rută statică în tabelă?</h3>
        <p>Comanda <code>ip route</code> doar o <b>adaugă în configurație</b>. Ca să apară în tabelă (cu codul S), trebuie îndeplinite două condiții: (1) <b>next hop-ul este accesibil</b> printr-o rută deja instalată (de obicei o rețea connected) sau interfața de ieșire este <b>up/up</b>; (2) nu există aceeași destinație cu un <b>AD mai mic</b> din altă sursă (3.2.b). Dacă interfața cade, ruta statică este <b>retrasă automat</b> din tabelă și revine când interfața revine.</p>
        <Callout kind="warn" title="O rută singură nu ajunge">
          O rută statică nu rezolvă nimic singură. Pentru ca două LAN-uri să comunice, fiecare router de pe cale trebuie să aibă rută <b>spre destinație</b> și rută <b>de întoarcere</b> (vezi „Ruta de rețea”).
        </Callout>
      </Detailed>
      <DeepDive title="Ruta statică vs. rutarea dinamică — când alegi ce">
        <p>Regulă practică: <b>statică</b> la marginea rețelei (un site cu o singură ieșire, ruta implicită spre ISP), în rețele foarte mici și pentru rezerve (flotante); <b>dinamică</b> (OSPF) între multe routere interconectate, unde topologia se poate schimba. Cele două coexistă: AD 1 face ca o rută statică să bată orice protocol dinamic pentru același prefix, iar AD-ul mărit (flotant) o transformă în rezervă. Un administrator poate de asemenea <b>redistribui</b> rutele statice în OSPF, dar acest subiect depășește CCNA.</p>
      </DeepDive>
      <Traps items={[
        <>O rută statică este <b>unidirecțională</b>: ai nevoie și de ruta de întoarcere pe celălalt router.</>,
        <>AD implicit al unei rute statice este <b>1</b> (nu 0 — 0 e pentru connected).</>,
        <>Ruta apare cu <code>S</code> în <code>show ip route</code>; rutele implicite statice apar cu <code>S*</code>.</>,
        <>Dacă next hop-ul nu e accesibil sau interfața e down, ruta <b>nu intră</b> în tabelă, deși e în <code>show running-config</code>.</>,
        <>La IPv6, rutarea nu pornește fără <code>ipv6 unicast-routing</code>.</>,
      ]} />
      <InlineQuiz ids={['3.3-001', '3.3-002', '3.3-003']} />
    </section>
  );
}

/* ======================================================================
   3.3.a — Default route
   ====================================================================== */
export function DefaultSection() {
  return (
    <section id="default" className="section">
      <SectionHead id="default" code="3.3.a" title="Ruta implicită (default route)" />
      <Summary>
        <p>Ruta implicită — <code>ip route 0.0.0.0 0.0.0.0 &lt;next-hop&gt;</code> pentru IPv4, <code>ipv6 route ::/0 &lt;next-hop&gt;</code> pentru IPv6 — se potrivește cu <b>orice</b> adresă. Fiind /0, este mereu ultima alegere (3.2.a): se folosește numai când nu există o rută mai specifică. În tabelă apare cu <code>S*</code> și routerul afișează „<b>Gateway of last resort</b>”.</p>
      </Summary>
      <Detailed title="1. Problema pe care o rezolvă">
        <p>Internetul are sute de mii de rețele. Un router de la marginea unei firme mici nu poate (și nu are nevoie să) le cunoască pe toate. Știe doar: „rețelele mele interne sunt aici; <b>orice altceva</b> trimite-l la ISP”. Această propoziție este exact o rută implicită. Un router care are o singură cale spre exterior se numește <b><G id="stub-network">rețea stub</G></b> (cu o singură ieșire): pentru el ruta implicită este tot ce are nevoie.</p>
        <Figure caption="Interactiv: pe R1 se folosește ruta specifică dacă există; altfel, ruta implicită.">
          <DefaultRouteStub />
        </Figure>
        <h3>2. Sintaxa și semnificația</h3>
        <CodeBlock title="Rută implicită IPv4 și IPv6 (ilustrativ)" kind="config" code={`R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
R1(config)# ip route 0.0.0.0 0.0.0.0 g0/2 203.0.113.1
R1(config)# ipv6 unicast-routing
R1(config)# ipv6 route ::/0 2001:db8:0:1::1`} explain={[
          ['0.0.0.0 0.0.0.0', 'Prefix 0.0.0.0 cu mască 0.0.0.0 = lungime 0: toți biții sunt ignorați la comparare, deci se potrivește cu orice adresă (quad-zero route).'],
          ['203.0.113.1', 'Next hop-ul: adresa routerului ISP, de pe o rețea connected cu R1.'],
          ['g0/2 203.0.113.1', 'Varianta fully specified: interfață + next hop.'],
          ['ipv6 unicast-routing', 'Comandă globală OBLIGATORIE: fără ea routerul nu transmite pachete IPv6 și nu are tabelă de rutare IPv6 activă.'],
          ['::/0', 'Echivalentul IPv6 al lui 0.0.0.0/0: prefix de lungime 0.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip route
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.1.0/24 is directly connected, GigabitEthernet0/0
L        192.168.1.1/32 is directly connected, GigabitEthernet0/0

R1# show ipv6 route static
S   ::/0 [1/0]
     via 2001:db8:0:1::1`} explain={[
          ['Gateway of last resort is … to network 0.0.0.0', 'Rezumatul rutei implicite active: următorul hop pentru tot ce nu are rută.'],
          ['S*', 'S = statică; * = candidată ca rută implicită.'],
          ['[1/0]', 'AD 1, metrică 0: valorile standard ale unei rute statice.'],
          ['show ipv6 route static', 'Afișează doar rutele statice IPv6; ::/0 este ruta implicită IPv6.'],
        ]} />
        <Callout kind="info" title="Output ilustrativ">
          Formatul exact depinde de versiunea IOS/IOS XE. Dacă ruta implicită nu există, <code>show ip route</code> afișează „Gateway of last resort is not set”.
        </Callout>
        <h3>3. Cum se leagă de PC-uri, switch-uri și routere</h3>
        <ul>
          <li>Un <b>PC</b> are <G id="default-gateway" />: în esență „ruta implicită” a PC-ului (tot ce nu e în LAN merge la gateway). Un router, care are o tabelă completă, folosește în schimb ruta <code>0.0.0.0/0</code>.</li>
          <li>Un <b>switch L2</b> folosește <code>ip default-gateway</code> doar pentru traficul propriu de management; nu face rutare și nu are rută implicită statică.</li>
          <li>La un <b>router</b>, ruta implicită apare în <G id="gateway-of-last-resort" />; poate fi statică (S*), dar și învățată dinamic (de exemplu OSPF o poate anunța).</li>
        </ul>
        <h3>4. Ruta implicită în practică</h3>
        <ul>
          <li><b>Către ISP:</b> singura rută de ieșire din firmă către Internet.</li>
          <li><b>Către „restul rețelei”:</b> un router de sucursală trimite tot ce nu e local către sediul central.</li>
          <li><b>Rută de rezervă:</b> o a doua rută implicită cu AD mărit (flotantă) către al doilea ISP (3.3.d).</li>
        </ul>
      </Detailed>
      <DeepDive title="Mai multe rute implicite și „default-information originate”">
        <p>Dacă configurezi <b>două</b> rute implicite cu același AD (de exemplu două ISP-uri), routerul le instalează pe ambele și împarte traficul între ele (<G id="ecmp" />). Pentru failover, mărește AD-ul uneia (flotantă). Dacă vrei ca routerul de margine să le <b>anunțe</b> și celorlalte routere prin OSPF, se folosește <code>default-information originate</code> în procesul OSPF (3.4); nu confunda ruta implicită configurată local cu aceea anunțată prin protocol.</p>
      </DeepDive>
      <Traps items={[
        <>Ruta implicită = prefix <code>0.0.0.0/0</code> (mască <code>0.0.0.0</code>) la IPv4 și <code>::/0</code> la IPv6. Greșit: <code>0.0.0.0 255.255.255.255</code> (aceea e o rută de gazdă pentru adresa 0.0.0.0).</>,
        <>Se folosește <b>ultima</b>: orice rută mai specifică o bate (3.2.a).</>,
        <>Fără <code>ipv6 unicast-routing</code>, <code>ipv6 route ::/0 …</code> se acceptă în configurație, dar routerul nu face rutare IPv6.</>,
        <>Next hop-ul trebuie să fie pe o rețea <b>connected</b>; altfel ruta nu se instalează.</>,
        <>Fără ruta de întoarcere (de la ISP către rețeaua ta), pachetele pleacă dar răspunsurile nu se întorc (vezi secțiunea următoare).</>,
      ]} />
      <InlineQuiz ids={['3.3-005', '3.3-006', '3.3-008', '3.3-010']} />
    </section>
  );
}

/* ======================================================================
   3.3.b — Network route
   ====================================================================== */
export function NetworkSection() {
  return (
    <section id="network" className="section">
      <SectionHead id="network" code="3.3.b" title="Ruta de rețea (network route)" />
      <Summary>
        <p>O <b>rută de rețea</b> duce traficul către o rețea sau subrețea precisă: <code>ip route 10.2.0.0 255.255.0.0 10.1.1.2</code>. Trebuie să existe pe <b>ambele</b> routere ale unei comunicații: o rută <b>dus</b> și o rută de <b>întoarcere</b>. Fără cea de întoarcere, ping-ul dă timeout chiar dacă ruta „dus” e corectă. Se poate <b>rezuma</b> mai multe subrețele într-o singură rută statică.</p>
      </Summary>
      <Detailed title="1. Cum se scrie o rută de rețea">
        <p>Folosești <b>adresa de rețea</b> (cu toți biții de gazdă 0) și masca ei. Dacă pui o adresă cu biți de gazdă nenuli (de exemplu 10.2.0.5 cu /16), IOS respinge comanda cu un mesaj de tip „Inconsistent address and mask”.</p>
        <CodeBlock title="Două routere, două LAN-uri (ilustrativ)" kind="config" code={`R1(config)# ip route 192.168.20.0 255.255.255.0 10.0.12.2
R2(config)# ip route 192.168.10.0 255.255.255.0 10.0.12.1

R1(config)# ipv6 unicast-routing
R1(config)# ipv6 route 2001:db8:20::/64 2001:db8:12::2
R2(config)# ipv6 unicast-routing
R2(config)# ipv6 route 2001:db8:10::/64 2001:db8:12::1`} explain={[
          ['R1: 192.168.20.0/24 via 10.0.12.2', 'R1 trimite tot ce e destinat LAN-ului lui R2 către R2.'],
          ['R2: 192.168.10.0/24 via 10.0.12.1', 'Ruta de întoarcere: R2 știe unde să trimită răspunsurile către LAN-ul lui R1.'],
          ['ipv6 route 2001:db8:20::/64 …', 'La fel, în IPv6: prefix/lungime, apoi next hop. Fără mască zecimală.'],
        ]} />
        <h3>2. Dus și întors — de ce ping-ul are nevoie de ambele rute</h3>
        <p>O comunicație este bidirecțională. Cererea ping (echo request) pleacă pe drumul definit de rutele de pe calea <i>dus</i>; <b>răspunsul</b> (echo reply) are ca destinație adresa lui PC1 și este rutat independent, de fiecare router, folosind propria lui tabelă. Dacă oricare router de pe drum nu are rută către LAN-ul sursă, răspunsul se pierde.</p>
        <Figure caption="Interactiv: activează/dezactivează rutele și vezi ce primește PC1. Observă diferența dintre „unreachable” și „timeout”.">
          <ReturnRoute />
        </Figure>
        <Callout kind="tip" title="Diagnostic rapid">
          „Destination host unreachable” cu adresa unui router în mesaj = acel router <b>nu are rută</b> spre destinație (problemă pe calea dus). „Request timed out” = cererea a plecat, dar răspunsul nu s-a întors: caută <b>ruta de întoarcere</b>, un firewall sau o interfață căzută mai departe.
        </Callout>
        <h3>3. Next hop, interfață, sau ambele?</h3>
        <ul>
          <li><b>Next hop</b> (recomandat pe Ethernet): routerul face căutare recursivă și ARP doar pentru next hop. Dacă interfața se schimbă, ruta se adaptează.</li>
          <li><b>Doar interfață</b>: ruta apare „directly connected”; pe Ethernet fiecare destinație ar cere ARP și celălalt capăt trebuie să facă <G id="proxy-arp" />. Rezultatul: tabelă ARP umflată și dependență de o funcție care poate fi dezactivată. Pe seriale punct-la-punct (fără ARP) nu e o problemă.</li>
          <li><b>Interfață + next hop</b> (<G id="fully-specified-route">fully specified</G>): fără ambiguități; routerul nu mai face recursivitate.</li>
        </ul>
        <h3>4. Distanța administrativă și metrica unei statice</h3>
        <p>Implicit AD = 1, atât cu next hop IP, cât și doar cu interfață (în al doilea caz ruta arată ca „directly connected”, dar are tot AD 1 și cod S). Metrica afișată este 0. AD 1 înseamnă că <b>bate</b> orice protocol dinamic pentru același prefix.</p>
        <h3>5. Rezumarea (summary static route)</h3>
        <p>Dacă în spatele aceluiași next hop sunt mai multe subrețele consecutive, în loc de o rută pentru fiecare poți scrie <b>una singură</b>, mai scurtă: de exemplu 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24 și 192.168.3.0/24 devin <code>ip route 192.168.0.0 255.255.252.0 10.1.1.2</code>. Tabela e mai mică și ruta mai ușor de întreținut. Atenție: rezumarea trebuie să acopere <b>doar</b> subrețelele din spatele acelui next hop (altfel trimiți greșit trafic).</p>
        <Table head={['Subrețele', 'Rezumat (summary)', 'Acoperă']} rows={[
          ['192.168.0.0/24 … 192.168.3.0/24', '192.168.0.0/22 (255.255.252.0)', '192.168.0.0 – 192.168.3.255'],
          ['10.1.0.0/24 … 10.1.7.0/24', '10.1.0.0/21 (255.255.248.0)', '10.1.0.0 – 10.1.7.255'],
        ]} />
        <p>Cum se calculează: numeri câți biți comuni au adresele (aici primii 22 respectiv 21), aplicând regulile de subnetting. Vezi și <G id="summarization" />.</p>
      </Detailed>
      <DeepDive title="Ce se întâmplă pas cu pas când o rută statică e adăugată">
        <ol>
          <li>Tastezi <code>ip route 192.168.20.0 255.255.255.0 10.0.12.2</code>; IOS verifică sintaxa (adresă/mască consistente).</li>
          <li>Routerul caută în tabelă o rută către 10.0.12.2. Găsește C 10.0.12.0/30 pe Gi0/1 → next hop accesibil.</li>
          <li>Instalează S 192.168.20.0/24 [1/0] via 10.0.12.2 în RIB; CEF (3.2) actualizează FIB-ul.</li>
          <li>La primul pachet către 192.168.20.x: longest prefix match → ruta statică → recursivitate → ARP pentru 10.0.12.2 → cadrul pleacă.</li>
          <li>Dacă Gi0/1 cade: ruta C dispare, next hop-ul nu mai e accesibil, ruta statică este <b>retrasă</b>; când interfața revine, revin amândouă.</li>
        </ol>
      </DeepDive>
      <Traps items={[
        <>Ruta de <b>întoarcere</b> lipsă = cel mai frecvent motiv pentru timeout la ping între LAN-uri.</>,
        <>Scrie <b>adresa de rețea</b>, nu o adresă de gazdă, cu masca potrivită.</>,
        <>Pe Ethernet, preferă next hop sau interfață + next hop, nu „doar interfață”.</>,
        <>Rezumarea trebuie să fie exactă: o mască prea scurtă acoperă și rețele care nu sunt în spatele acelui next hop.</>,
        <>Ruta statică apare în tabelă doar dacă next hop-ul sau interfața sunt <b>accesibile</b>.</>,
      ]} />
      <InlineQuiz ids={['3.3-012', '3.3-014', '3.3-016', '3.3-018']} />
    </section>
  );
}

/* ======================================================================
   3.3.c — Host route
   ====================================================================== */
export function HostSection() {
  return (
    <section id="host" className="section">
      <SectionHead id="host" code="3.3.c" title="Ruta de gazdă (host route)" />
      <Summary>
        <p>O <b><G id="host-route" /></b> acoperă o singură adresă: <b>/32</b> la IPv4 (<code>255.255.255.255</code>) și <b>/128</b> la IPv6. Fiind cea mai specifică rută posibilă, câștigă mereu prin <G id="longest-prefix-match" />. Se folosește pentru excepții: un server care trebuie să ia altă cale decât restul rețelei, o adresă de loopback sau ținta unei redirecționări.</p>
      </Summary>
      <Detailed title="1. Cum arată și de ce funcționează">
        <CodeBlock title="Exemple de rute de gazdă (ilustrativ)" kind="config" code={`R1(config)# ip route 10.2.2.2 255.255.255.255 10.1.1.2
R1(config)# ipv6 route 2001:db8:2::2/128 2001:db8:12::2
R1(config)# ip route 10.2.2.2 255.255.255.255 10.1.1.2 150`} explain={[
          ['10.2.2.2 255.255.255.255', 'Mască /32: toți cei 32 de biți trebuie să coincidă, deci doar adresa 10.2.2.2.'],
          ['2001:db8:2::2/128', 'Echivalentul IPv6: 128 de biți, o singură adresă.'],
          ['… 10.1.1.2 150', 'O rută de gazdă poate fi și flotantă: AD 150 ca rezervă.'],
        ]} />
        <p>Exemplu: R1 are 10.2.0.0/16 via R2 și, separat, <code>10.2.2.2/32</code> via R3. Pachetele către 10.2.2.2 pleacă spre R3 (/32 e mai specific), în timp ce tot restul rețelei 10.2.0.0/16 merge spre R2. Fără să modifici nimic altceva ai creat o <b>excepție</b> pentru un singur host.</p>
        <h3>2. Unde apar rutele de gazdă în practică</h3>
        <ul>
          <li><b>Rutele L</b> din tabelă (adresele interfețelor routerului) — create automat de IOS, tot /32.</li>
          <li><b>Servere critice</b> accesibile printr-o cale dedicată (de exemplu un server de monitorizare).</li>
          <li><b>Loopback-urile</b> altor routere: ca să poți ajunge la loopback-ul lui R2 (de exemplu pentru management sau ca Router ID), scrii o rută /32 către el.</li>
          <li><b>Rezerve și testare:</b> rute /32 pentru a forța temporar un drum.</li>
        </ul>
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip route 10.2.2.2
Routing entry for 10.2.2.2/32
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.1.1.2
      Route metric is 0, traffic share count is 1

R1# show ip route static | include /32
S        10.2.2.2/32 [1/0] via 10.1.1.2`} explain={[
          ['Routing entry for 10.2.2.2/32', 'Pentru adresa cerută, routerul a ales ruta /32, nu 10.2.0.0/16.'],
          ['show ip route static | include /32', 'Filtrează lista de rute statice și arată doar rutele de gazdă.'],
        ]} />
      </Detailed>
      <Traps items={[
        <>Masca unei rute de gazdă IPv4 este <b>255.255.255.255</b>, nu 255.255.255.0.</>,
        <>La IPv6, rută de gazdă = <b>/128</b> (nu /64).</>,
        <>O rută /32 nu „ia” întreg LAN-ul: acoperă o singură adresă.</>,
        <>Ruta /32 bate orice alta pentru acea adresă, indiferent de AD: nu o folosi din greșeală pe adresa unui alt host.</>,
      ]} />
      <InlineQuiz ids={['3.3-021', '3.3-022', '3.3-024']} />
    </section>
  );
}

/* ======================================================================
   3.3.d — Floating static route
   ====================================================================== */
export function FloatingSection() {
  return (
    <section id="floating" className="section">
      <SectionHead id="floating" code="3.3.d" title="Ruta statică flotantă (floating static route)" />
      <Summary>
        <p>O <b><G id="floating-static-route" /></b> este o rută statică de <b>rezervă</b>: i se dă un <G id="administrative-distance" /> <b>mai mare</b> decât al rutei principale, ca să rămână ascunsă cât timp aceasta există. Când ruta principală dispare (interfață căzută, vecin pierdut), cea flotantă se instalează automat. Se configurează adăugând AD-ul la capătul comenzii: <code>ip route 10.2.0.0 255.255.0.0 10.9.9.2 130</code>.</p>
      </Summary>
      <Detailed title="1. Problema și soluția">
        <p>Un site are un link principal (fibră) și unul de rezervă (4G, sau al doilea ISP). Dacă ambele rute statice ar avea AD 1, routerul le-ar instala pe amândouă și ar împărți traficul (ECMP) — și ai plăti trafic pe linkul scump. Soluția: ruta pe linkul de rezervă primește un AD mai mare, deci <b>pierde</b> competiția la instalare (3.2.b) cât timp cea principală există. Când ea dispare, rămâne singura și se instalează.</p>
        <Figure caption="Interactiv: prăbușește legătura principală și urmărește ce rută intră în tabelă.">
          <FloatingFailover />
        </Figure>
        <h3>2. Cum alegi AD-ul</h3>
        <p>AD-ul rutei flotante trebuie să fie <b>mai mare decât AD-ul rutei pe care o acoperă</b>:</p>
        <Table head={['Ruta principală', 'AD principal', 'Valoare pentru flotantă', 'Motiv']} hlCol={2} rows={[
          ['Altă rută statică', '1', '2 – 254 (de exemplu 5)', 'Orice valoare mai mare decât 1.'],
          ['OSPF', '110', '111 – 254 (de exemplu 130)', 'Trebuie să fie peste 110, altfel statica ar bate OSPF.'],
          ['EIGRP intern', '90', '91 – 254 (de exemplu 100)', 'Peste 90.'],
          ['RIP', '120', '121 – 254 (de exemplu 130)', 'Peste 120.'],
        ]} />
        <Callout kind="exam" title="Capcana clasică a AD-ului">
          Dacă ruta de rezervă acoperă o rută OSPF (110) și îi pui AD 100, ea <b>bate</b> OSPF și devine rută principală, nu de rezervă. Un AD de 255 nu se folosește: înseamnă „rută nesigură”, care nu se instalează.
        </Callout>
        <h3>3. Configurare și verificare</h3>
        <CodeBlock title="Rută principală OSPF + rezervă statică flotantă (ilustrativ)" kind="config" code={`R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.12.2
R1(config)# ip route 192.168.30.0 255.255.255.0 10.0.13.2 5
R1(config)# ip route 10.2.0.0 255.255.0.0 10.9.9.2 130
R1(config)# ipv6 route 2001:db8:30::/64 2001:db8:13::2 5`} explain={[
          ['… 10.0.12.2', 'Ruta principală: AD implicit 1.'],
          ['… 10.0.13.2 5', 'Rezerva: același prefix, AD 5. În tabelă nu apare cât timp ruta cu AD 1 există.'],
          ['… 10.9.9.2 130', 'Variantă pentru a acoperi o rută OSPF (110): AD 130.'],
          ['ipv6 route … 5', 'Aceeași idee la IPv6: AD ca ultim argument.'],
        ]} />
        <CodeBlock title="Verificare în cele două stări (ilustrativ)" kind="session" code={`R1# show ip route 192.168.30.0
Routing entry for 192.168.30.0/24
  Known via "static", distance 1, metric 0
  * 10.0.12.2

R1# show running-config | include ip route
ip route 192.168.30.0 255.255.255.0 10.0.12.2
ip route 192.168.30.0 255.255.255.0 10.0.13.2 5

! după shutdown pe Gi0/1 (legătura principală):
R1# show ip route 192.168.30.0
Routing entry for 192.168.30.0/24
  Known via "static", distance 5, metric 0
  * 10.0.13.2`} explain={[
          ['distance 1', 'În starea normală e activă ruta principală.'],
          ['show running-config | include ip route', 'Ambele rute sunt în configurație, chiar dacă în tabelă este doar una.'],
          ['distance 5', 'După căderea legăturii principale, ruta flotantă s-a instalat singură.'],
        ]} />
        <h3>4. Limite pe care trebuie să le știi</h3>
        <ul>
          <li>Ruta principală dispare doar dacă routerul <b>detectează</b> problema: o interfață down o face imediat. Dacă linkul rămâne up, dar ceva mai departe pe cale e stricat, ruta statică rămâne în tabelă și traficul se pierde. Detectarea avansată (IP SLA cu <code>track</code>) nu face parte din CCNA.</li>
          <li>Rezerva este <b>mai lentă/scumpă</b> de obicei; trecerea la ea nu e instantanee, dar durează cât routerul recalculează tabela.</li>
          <li>La revenirea linkului principal, traficul se întoarce automat pe el (nu rămâne pe rezervă).</li>
        </ul>
      </Detailed>
      <Traps items={[
        <>AD-ul flotant trebuie să fie <b>mai mare</b> decât AD-ul rutei acoperite (110 pentru OSPF → folosește &gt;110).</>,
        <>Ruta flotantă este în <code>show running-config</code> dar <b>nu</b> în <code>show ip route</code> cât timp principala funcționează.</>,
        <>Dacă linkul nu cade (rămâne up/up), ruta flotantă nu preia traficul.</>,
        <>AD-ul se pune <b>ultimul</b> în comandă, după next hop.</>,
        <>Două rute statice cu <b>același</b> AD către același prefix nu sunt „principală/rezervă”: se instalează ambele (ECMP).</>,
      ]} />
      <InlineQuiz ids={['3.3-026', '3.3-027', '3.3-029', '3.3-031']} />
    </section>
  );
}

/* ======================================================================
   IPv6
   ====================================================================== */
export function Ipv6Section() {
  return (
    <section id="ipv6" className="section">
      <SectionHead id="ipv6" code="3.3" title="Rute statice IPv6 — particularități" />
      <Summary>
        <p>Rutele statice IPv6 funcționează ca în IPv4 (aceleași patru tipuri), cu trei diferențe: (1) trebuie pornit <code>ipv6 unicast-routing</code>; (2) prefixul se scrie <code>prefix/lungime</code>; (3) un next hop <b>link-local</b> (<code>fe80::…</code>) cere obligatoriu și interfața de ieșire.</p>
      </Summary>
      <Detailed title="1. Aceleași tipuri, altă sintaxă">
        <Table head={['Tip', 'IPv4', 'IPv6']} rows={[
          ['Default', 'ip route 0.0.0.0 0.0.0.0 203.0.113.1', 'ipv6 route ::/0 2001:db8:0:1::1'],
          ['Rețea', 'ip route 10.2.0.0 255.255.0.0 10.1.1.2', 'ipv6 route 2001:db8:2::/64 2001:db8:12::2'],
          ['Gazdă', 'ip route 10.2.2.2 255.255.255.255 10.1.1.2', 'ipv6 route 2001:db8:2::2/128 2001:db8:12::2'],
          ['Flotantă', 'ip route 10.2.0.0 255.255.0.0 10.9.9.2 130', 'ipv6 route 2001:db8:2::/64 2001:db8:99::2 130'],
          ['Verificare', 'show ip route [static]', 'show ipv6 route [static]'],
        ]} />
        <h3>2. Obligatoriu: ipv6 unicast-routing</h3>
        <p>La IPv4, un router rutează implicit. La IPv6 trebuie să-i spui: <code>ipv6 unicast-routing</code> în configurarea globală. Fără ea, routerul își poate configura adrese IPv6 și poate trimite propriul trafic, dar <b>nu retransmite</b> pachetele altor stații și nu trimite Router Advertisements. Este cea mai frecventă cauză pentru care „rutele statice IPv6 nu merg”.</p>
        <h3>3. Next hop link-local</h3>
        <p>Vecinii IPv6 se pot adresa între ei cu adresele <G id="link-local" /> (fe80::/10), care există pe orice interfață fără configurare. Pentru o rută statică este tentant să folosești <code>fe80::2</code> ca next hop (nu depinde de adresele globale). Problema: aceeași adresă link-local poate exista pe mai multe interfețe ale routerului, deci routerul nu știe <b>pe care interfață</b> să trimită. Soluția: ruta <b>fully specified</b>: interfață + next hop.</p>
        <Figure caption="Interactiv: care forme de next hop IPv6 sunt acceptate și ce arată show ipv6 route.">
          <Ipv6NextHop />
        </Figure>
        <CodeBlock title="Configurare IPv6 completă (ilustrativ)" kind="config" code={`R1(config)# ipv6 unicast-routing
R1(config)# ipv6 route 2001:db8:2::/64 g0/1 fe80::2
R1(config)# ipv6 route ::/0 2001:db8:0:1::1
R1(config)# ipv6 route 2001:db8:2::2/128 2001:db8:12::2
R1(config)# ipv6 route 2001:db8:2::/64 g0/2 fe80::3 130`} explain={[
          ['ipv6 unicast-routing', 'Pornește rutarea IPv6.'],
          ['g0/1 fe80::2', 'Link-local next hop + interfață: obligatoriu împreună.'],
          ['::/0', 'Ruta implicită IPv6.'],
          ['2001:db8:2::2/128', 'Rută de gazdă IPv6.'],
          ['… 130', 'Rută flotantă către același prefix pe altă interfață.'],
        ]} />
        <h3>4. Verificare</h3>
        <ul>
          <li><code>show ipv6 route</code> / <code>show ipv6 route static</code> — codul S marchează rutele statice (aici și <code>S ::/0</code> pentru implicita).</li>
          <li><code>ping 2001:db8:2::2</code> și <code>traceroute 2001:db8:2::2</code> — la fel ca la IPv4, cu adrese IPv6.</li>
          <li><code>show ipv6 interface brief</code> — adresele (globale și link-local) ale interfețelor.</li>
        </ul>
      </Detailed>
      <Traps items={[
        <>Fără <code>ipv6 unicast-routing</code>, rutarea IPv6 nu funcționează, deși comanda <code>ipv6 route</code> e acceptată.</>,
        <>Next hop <b>link-local</b> ⇒ <b>interfața e obligatorie</b>.</>,
        <>Ruta implicită IPv6 este <code>::/0</code>, nu <code>0.0.0.0/0</code>.</>,
        <>La IPv6, o rută de gazdă este <code>/128</code>.</>,
        <>Un singur <code>ipv6 route</code> nu e de ajuns: ai nevoie și de ruta IPv6 de întoarcere.</>,
      ]} />
      <InlineQuiz ids={['3.3-033', '3.3-034', '3.3-036']} />
    </section>
  );
}
