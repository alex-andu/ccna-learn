import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { AddressGrid, Block172, CgnatDiagram, ExhaustionTimeline, NatStepper, PrivateChecker, RoutingAmbiguity } from '../../diagrams/t1_7';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';

/* ======================================================================
   0. Introducere — imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.7" title="Adrese private — imaginea de ansamblu" />
      <Summary>
        <p><G id="ipv4" /> are doar ≈4,3 miliarde de adrese, mult mai puține decât dispozitivele conectate. Soluția practică: blocuri de adrese <b>private</b> (<G id="rfc1918" />: 10/8, 172.16/12, 192.168/16) pe care oricine le poate refolosi în rețeaua internă,
          plus un router care face <G id="nat" />/<G id="pat" /> la ieșirea spre Internet și traduce adresele private într-o adresă <G id="public-ip">publică</G>.</p>
      </Summary>

      <Detailed>
        <p>Laptopul tău de acasă are aproape sigur o adresă de forma <code>192.168.1.23</code>. Laptopul vecinului are și el <code>192.168.1.23</code>. La fel, milioane de alte dispozitive din lume. Cum de nu se încurcă Internetul? Răspunsul la această întrebare este exact obiectivul 1.7:</p>
        <Table head={['Secțiune', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['Istoria epuizării', 'De ce nu ajung adresele IPv4 și ce s-a întâmplat când s-au terminat?'],
          ['RFC 1918', 'Care sunt exact blocurile private și cum le recunoști sigur (capcana 172.16–172.31)?'],
          ['NAT / PAT', 'Cum iese pe Internet un host cu adresă privată?'],
          ['CGNAT', 'Ce e 100.64.0.0/10 și de ce unii operatori fac NAT și ei?'],
          ['Alte adrese speciale', 'Prin ce diferă privatele de APIPA, loopback, documentație?'],
          ['IPv6', 'Care este soluția pe termen lung?'],
        ]} />
        <Callout kind="info" title="Ce cere și ce nu cere examenul la 1.7">
          Obiectivul oficial este <b>„Describe private IPv4 addressing”</b> — un obiectiv de înțelegere, fără sub-puncte a/b/c. Trebuie să știi pe de rost cele trei blocuri, să recunoști instant dacă o adresă e privată și să explici <b>de ce</b> există și cum ajung pe Internet (prin NAT). <b>Configurarea</b> NAT/PAT pe Cisco IOS este obiectivul <b>4.1</b> — aici o vezi doar ca previzualizare, ca să înțelegi conceptul.
        </Callout>

        <h3>Două lumi de adrese</h3>
        <Table head={['', 'Adresă publică', 'Adresă privată (RFC 1918)']} rows={[
          ['Unicitate', 'unică în tot Internetul', 'unică doar în rețeaua ta; refolosită de milioane de rețele'],
          ['Cine o alocă', <><G id="iana" /> → <G id="rir" /> (pentru noi RIPE NCC) → ISP → tu</>, 'tu, liber, fără să ceri voie'],
          ['Cost', 'limitată, se plătește (și s-a scumpit după epuizare)', 'gratuită, practic nelimitată pentru o organizație'],
          ['Rutare pe Internet', 'da — prefixul e anunțat în tabela globală', 'nu — ISP-urile o filtrează'],
          ['Exemplu', 'WAN-ul routerului de acasă: 203.0.113.2', 'PC-ul din LAN: 192.168.1.10'],
        ]} />
        <Analogy>Adresele private sunt ca numerele camerelor dintr-un hotel: fiecare hotel are o „cameră 101”, și nu e nicio problemă, pentru că în interiorul hotelului numărul e unic. Când trimiți o scrisoare în afară, recepția (routerul NAT) o expediază cu <b>adresa poștală a hotelului</b> (adresa publică) și ține minte cine din ce cameră a trimis-o, ca să știe unde să ducă răspunsul.</Analogy>
      </Detailed>

      <Traps items={[
        <>Adresele private <b>nu sunt „nerutabile”</b> în general: routerele din interiorul unei organizații le rutează perfect. Ele nu sunt rutate <b>pe Internet</b>.</>,
        <>Configurarea NAT (<code>ip nat inside/outside</code>, <code>overload</code>) aparține de <b>4.1</b>; la 1.7 se întreabă <b>de ce</b> și <b>ce</b>.</>,
      ]} />
      <InlineQuiz ids={['1.7-001', '1.7-006']} />
    </section>
  );
}

/* ======================================================================
   1. Istoria epuizării IPv4
   ====================================================================== */
export function History() {
  return (
    <section id="history" className="section">
      <SectionHead id="history" code="1.7" title="De ce s-au terminat adresele IPv4" />
      <Summary>
        <p>IPv4 folosește adrese de 32 de biți: 2³² = <b>4.294.967.296</b> de adrese, din care o parte sunt rezervate. Rezerva centrală <G id="iana" /> s-a epuizat pe <b>3 februarie 2011</b>, iar RIPE NCC (registrul pentru Europa și România) a făcut ultima alocare din rezerva liberă pe <b>25 noiembrie 2019</b>.
          <G id="cidr" />, adresele private + NAT și (pe termen lung) IPv6 sunt cele trei răspunsuri.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Aritmetica problemei">
        <p>În 1981, când a fost publicat <b>RFC 791</b> (IPv4), Internetul lega câteva sute de calculatoare. 4,3 miliarde de adrese păreau inepuizabile. Trei lucruri au schimbat situația:</p>
        <ul>
          <li><b>Risipa claselor (<G id="classful" />).</b> O firmă care avea nevoie de 2.000 de adrese nu putea primi un /21; primea un clasa B (/16 = 65.536 adrese) și lăsa nefolosite 63.000. Câteva organizații din primii ani au primit chiar /8-uri întregi (16,7 milioane de adrese fiecare).</li>
          <li><b>Blocuri rezervate mari.</b> Multicast (224/4) și „clasa E” (240/4) consumă împreună 32 din cele 256 de /8-uri, adică 12,5% din spațiu. Loopback-ul (127/8) ocupă încă un /8 întreg.</li>
          <li><b>Explozia dispozitivelor.</b> Calculatoare personale, apoi telefoane, tablete, televizoare, camere, senzori — astăzi o singură locuință are ușor 20–30 de dispozitive conectate. Populația lumii depășește singură numărul de adrese IPv4.</li>
        </ul>
        <Figure caption="Interactiv: cele 256 de blocuri /8 ale IPv4. Click pe un pătrat pentru a vedea ce conține. Observă cât de mic este, de fapt, spațiul privat comparativ cu multicast/rezervat.">
          <AddressGrid />
        </Figure>
        <Callout kind="tip" title="Cât de mare e spațiul privat?">
          10.0.0.0/8 (16.777.216) + 172.16.0.0/12 (1.048.576) + 192.168.0.0/16 (65.536) = <b>17.891.328 adrese</b>, adică doar ≈0,42% din spațiul IPv4. Dar pentru că sunt <b>refolosite</b> de fiecare organizație, efectul lor este uriaș: fiecare rețea are la dispoziție aceleași 17,9 milioane de adrese.
        </Callout>

        <h3>2. Cele trei răspunsuri</h3>
        <Table head={['Soluție', 'Când', 'Ce problemă a rezolvat', 'Limită']} rows={[
          [<G id="cidr" />, '1993 (RFC 1518/1519)', 'renunță la clase: fiecare primește exact cât îi trebuie; ISP-urile agregă rute', 'încetinește epuizarea, nu creează adrese noi'],
          [<>Adrese private + <G id="nat" /></>, '1994 (RFC 1597, RFC 1631), 1996 (RFC 1918)', 'rețelele interne nu mai consumă adrese publice; o casă întreagă iese pe Internet cu o singură adresă', 'strică conectivitatea end-to-end; complică unele protocoale'],
          [<G id="ipv6" />, '1998 (RFC 2460), 2017 (RFC 8200)', '2¹²⁸ adrese — suficiente ca fiecare dispozitiv să aibă una globală', 'adopție lentă; coexistă ani buni cu IPv4 (dual stack)'],
        ]} />

        <h3>3. Cum s-au epuizat adresele: IANA → RIR-uri</h3>
        <p>Adresele publice nu se distribuie direct de la un singur loc. <G id="iana" /> dădea blocuri mari (câte un /8) celor cinci <G id="rir" />-uri, iar acestea le alocau ISP-urilor și firmelor din regiunea lor (membrii numiți <b>LIR</b> — Local Internet Registry).</p>
        <Table head={['RIR', 'Regiune', 'Reper de epuizare']} rows={[
          ['APNIC', 'Asia-Pacific', 'aprilie 2011 — primul care ajunge la ultimul /8'],
          ['RIPE NCC', 'Europa (inclusiv România), Orientul Mijlociu, Asia Centrală', 'sept. 2012 — ultimul /8 (câte un /22 per LIR); 25 nov. 2019 — ultima alocare /22'],
          ['LACNIC', 'America Latină și Caraibe', 'iunie 2014 — faza finală'],
          ['ARIN', 'America de Nord', 'septembrie 2015 — rezerva liberă epuizată'],
          ['AFRINIC', 'Africa', 'faze de epuizare începând din 2017'],
        ]} />
        <Figure caption="Interactiv: cronologia IPv4, de la RFC 791 la ultima alocare RIPE NCC. Click pe un eveniment.">
          <ExhaustionTimeline />
        </Figure>
        <p>După epuizare, adresele IPv4 au devenit o resursă rară: RIR-urile țin <b>liste de așteptare</b> pentru adrese recuperate (de la firme închise etc.), iar organizațiile își <b>transferă</b> (vând/cumpără) blocuri între ele. Pentru operatori, asta a însemnat o presiune și mai mare să folosească NAT — inclusiv la scara operatorului (<G id="cgnat" />, mai jos).</p>
      </Detailed>

      <DeepDive title="Deep dive: ce înseamnă concret „epuizat” la RIPE NCC">
        <p>„Epuizat” nu înseamnă că Internetul s-a oprit, ci că <b>rezerva liberă</b> a unui registru s-a golit. Toate adresele deja alocate funcționează în continuare.</p>
        <ul>
          <li><b>Sept. 2012:</b> RIPE NCC ajunge la ultimul /8 primit de la IANA și aplică o regulă de raționalizare: fiecare LIR poate primi <b>un singur /22</b> (1.024 adrese), indiferent de mărime.</li>
          <li><b>25 noiembrie 2019, 15:35 (UTC+1):</b> anunțul oficial — „we made our final /22 IPv4 allocation from the last remaining addresses in our available pool”.</li>
          <li><b>După:</b> o listă de așteptare pentru adrese recuperate, accesibilă doar LIR-urilor care <b>nu au primit niciodată</b> IPv4 de la RIPE NCC, și doar câte <b>un /24</b> (256 de adrese).</li>
        </ul>
        <p>Pentru un ISP nou din România, asta înseamnă practic: câteva sute de adrese publice pentru potențial zeci de mii de clienți. Matematic, singurele variante sunt CGNAT, cumpărarea de adrese pe piața de transferuri și IPv6.</p>
      </DeepDive>

      <Traps items={[
        <>IPv4 = <b>32 de biți</b> → 2³² ≈ <b>4,3 miliarde</b>. IPv6 = 128 de biți.</>,
        <>Epuizarea IANA: <b>2011</b>. Pentru Europa, ultimul /22 RIPE NCC: <b>noiembrie 2019</b>.</>,
        <>NAT și adresele private <b>nu au creat adrese noi</b> — au permis refolosirea lor. Doar IPv6 rezolvă problema de fond.</>,
      ]} />
      <InlineQuiz ids={['1.7-002', '1.7-003', '1.7-004', '1.7-005']} />
    </section>
  );
}

/* ======================================================================
   2. RFC 1918 în profunzime
   ====================================================================== */
export function Rfc1918() {
  return (
    <section id="rfc1918" className="section">
      <SectionHead id="rfc1918" code="1.7" title="RFC 1918 — cele trei blocuri private" />
      <Summary>
        <p><b>10.0.0.0/8</b>, <b>172.16.0.0/12</b> și <b>192.168.0.0/16</b>. Atât. Capcana numărul 1: blocul din mijloc merge de la <b>172.16.0.0 la 172.31.255.255</b> — 172.15.x.x și 172.32.x.x sunt adrese <b>publice</b>.
          Adresele private se rutează liber în interiorul organizației, dar nu sunt acceptate pe Internet.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Blocurile">
        <Table head={['Bloc (CIDR)', 'Interval', 'Mască', 'Echivalent classful', 'Nr. adrese', 'Unde îl vezi tipic']} hlCol={0} rows={[
          [<code>10.0.0.0/8</code>, '10.0.0.0 – 10.255.255.255', '255.0.0.0', '1 rețea de clasă A', '16.777.216', 'enterprise, campus, data center, VPN-uri'],
          [<code>172.16.0.0/12</code>, <>172.16.0.0 – <b>172.31</b>.255.255</>, '255.240.0.0', '16 rețele de clasă B (172.16 … 172.31)', '1.048.576', 'firme medii, rețele de laborator, containere (Docker folosește implicit 172.17.0.0/16)'],
          [<code>192.168.0.0/16</code>, '192.168.0.0 – 192.168.255.255', '255.255.0.0', '256 rețele de clasă C (192.168.0 … 192.168.255)', '65.536', 'acasă / SOHO: 192.168.0.0/24, 192.168.1.0/24'],
        ]} />
        <p>Blocurile sunt definite de <b>RFC 1918</b> (februarie 1996, <b>BCP 5</b> — „Best Current Practice”), care a înlocuit RFC 1597 din 1994. Ele apar și în registrul IANA al adreselor speciale cu mențiunea <b>„forwardable: True, globally reachable: False”</b> — adică: un router le poate trimite mai departe, dar nu trebuie să fie accesibile de oriunde din Internet.</p>
        <Callout kind="exam" title="Nu confunda prefixul cu clasa">
          Blocurile se scriu cu prefix (<G id="cidr" />): /8, /12, /16. Echivalentele classful (1 × A, 16 × B, 256 × C) le găsești în manualele mai vechi. În practică, din oricare bloc îți faci subrețelele de care ai nevoie: de exemplu <code>10.1.20.0/24</code> sau <code>192.168.10.64/26</code> (vezi 1.6). Adresa e privată pentru că <b>se află în bloc</b>, indiferent de masca folosită.
        </Callout>

        <h3>2. Capcana 172.16.0.0/12 — de ce doar 16 … 31</h3>
        <p>Un /12 fixează primii 12 biți: 8 biți ai primului octet (172 = <code>10101100</code>) și <b>primii 4 biți ai celui de-al doilea</b> (<code>0001</code>). Ultimii 4 biți ai octetului 2 sunt liberi: de la <code>0000</code> la <code>1111</code>, adică valori de la <code>0001 0000</code> = 16 la <code>0001 1111</code> = 31. Exact 16 valori → „16 rețele de clasă B”.</p>
        <Figure caption="Interactiv: mută slider-ul pe al doilea octet și urmărește biții. Doar valorile 16–31 au în față 0001.">
          <Block172 />
        </Figure>
        <Callout kind="tip" title="Truc de memorare">
          „<b>172 de la 16 la 31</b>” — 16 este 2⁴, iar blocul are 16 valori. Sau: masca /12 este 255.<b>240</b>.0.0, iar 256 − 240 = <b>16</b> = mărimea pasului în octetul 2. Blocurile /12 încep la 0, 16, 32, 48… — cel privat este cel care începe la <b>16</b>, deci se termină la 16 + 16 − 1 = <b>31</b>.
        </Callout>

        <h3>3. Verifică singur</h3>
        <Figure caption="Interactiv: scrie orice adresă IPv4 sau încearcă exemplele-capcană. Verificatorul recunoaște și blocurile speciale care NU sunt RFC 1918 (CGNAT, APIPA, loopback, documentație).">
          <PrivateChecker />
        </Figure>

        <h3>4. De ce nu pot circula pe Internet</h3>
        <p>Routarea pe Internet funcționează doar dacă fiecare prefix are <b>un singur proprietar</b>, pentru ca routerele să știe încotro să trimită pachetele. Adresele private sunt prin definiție folosite simultan de milioane de rețele. Dacă două firme ar anunța amândouă <code>10.1.1.0/24</code> pe Internet, niciun router n-ar ști care dintre ele este destinația corectă.</p>
        <Figure caption="Aceleași adrese private în două organizații: rutarea globală ar fi ambiguă.">
          <RoutingAmbiguity />
        </Figure>
        <p>De aceea RFC 1918 cere ca rutele spre rețele private să <b>nu fie anunțate</b> în afara organizației, iar pachetele cu sursă sau destinație privată să nu fie trimise între organizații. ISP-urile aplică regula prin filtre: adresele private fac parte din lista de <G id="bogon" />-uri — prefixe care nu au ce căuta în Internet. Consecința practică: un host privat ajunge pe Internet <b>doar</b> printr-un dispozitiv care îi traduce adresa (<G id="nat" />) sau printr-un proxy.</p>

        <h3>5. Cum alegi un bloc în practică</h3>
        <ul>
          <li><b>Acasă / SOHO:</b> routerul vine de obicei cu <code>192.168.0.0/24</code> sau <code>192.168.1.0/24</code>, cu <G id="dhcp" /> activ. E suficient pentru 254 de dispozitive.</li>
          <li><b>Firmă:</b> <code>10.0.0.0/8</code> oferă loc pentru un plan ierarhic (de exemplu <code>10.&lt;sediu&gt;.&lt;VLAN&gt;.0/24</code>), ușor de sumarizat.</li>
          <li><b>Evită suprapunerile:</b> dacă o firmă folosește <code>192.168.1.0/24</code> și un angajat se conectează prin VPN de acasă, unde are tot <code>192.168.1.0/24</code>, apar conflicte de rutare. Același lucru la fuziuni de firme. De aceea, în rețelele de firmă se aleg intervale mai puțin „populare” (de exemplu <code>10.47.0.0/16</code>).</li>
        </ul>
      </Detailed>

      <DeepDive title="Deep dive: ce spune efectiv RFC 1918">
        <p>RFC 1918 împarte hostii unei organizații în trei categorii:</p>
        <ol>
          <li>hosti care <b>nu au nevoie</b> de acces în afara organizației (de exemplu automatizări industriale, imprimante interne);</li>
          <li>hosti care au nevoie de acces doar la <b>câteva servicii externe</b> (mail, web, transfer de fișiere), ce pot fi intermediate de gateway-uri de aplicație sau NAT;</li>
          <li>hosti care au nevoie de acces <b>la nivelul rețea</b> din exterior (servere publice) — aceștia au nevoie de adrese unice global.</li>
        </ol>
        <p>Primele două categorii pot folosi adrese private. Documentul recunoaște și dezavantajul principal: dacă două organizații cu adrese private se unesc sau trebuie să comunice direct, una dintre ele trebuie să-și <b>renumeroteze</b> rețeaua (sau să folosească NAT între ele). Recomandarea, valabilă și astăzi: alege blocuri „neobișnuite” ca să reduci riscul coliziunilor.</p>
        <p>Pentru ACL-uri (5.6), blocurile se scriu cu wildcard: <code>10.0.0.0 0.255.255.255</code>, <code>172.16.0.0 0.15.255.255</code>, <code>192.168.0.0 0.0.255.255</code> (vezi <G id="wildcard-mask" />).</p>
      </DeepDive>

      <Traps items={[
        <><b>172.16.0.0 – 172.31.255.255</b> = privat. <b>172.15.x.x</b> și <b>172.32.x.x</b> = public. Cea mai frecventă capcană de la 1.7.</>,
        <><b>192.169.x.x</b> și <b>11.x.x.x</b> sunt publice. Doar 192.<b>168</b> și <b>10</b>.</>,
        <><b>192.168.256.1</b> nu e nici privată, nici publică — e <b>invalidă</b> (un octet ≤ 255).</>,
        <>Masca folosită nu contează: <code>10.5.5.5/30</code> e la fel de privată ca <code>10.5.5.5/8</code>.</>,
        <>Masca blocului 172 este <b>255.240.0.0</b> (/12), wildcard <b>0.15.255.255</b>.</>,
      ]} />
      <InlineQuiz ids={['1.7-007', '1.7-008', '1.7-010', '1.7-016']} />
    </section>
  );
}

/* ======================================================================
   3. De ce private + NAT/PAT
   ====================================================================== */
export function NatConcept() {
  return (
    <section id="nat" className="section">
      <SectionHead id="nat" code="1.7 → 4.1" title="Cum iese pe Internet o adresă privată: NAT și PAT" />
      <Summary>
        <p><G id="nat" /> rescrie adresa IP sursă a pachetelor care pleacă din rețeaua privată (inside) cu o adresă publică (outside) și face operația inversă pentru răspunsuri, după o <b>tabelă de traduceri</b>.
          <G id="pat" /> (NAT overload) folosește și <b>porturile</b>, astfel încât sute de hosti să împartă o <b>singură</b> adresă publică — exact ce face routerul tău de acasă.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Problema și soluția">
        <p>Adresele private rezolvă problema „nu sunt destule adrese” doar pe jumătate: hostii interni au acum adrese, dar nu pot vorbi cu Internetul, pentru că ISP-urile aruncă pachetele cu sursă privată și oricum nu ar exista o rută de întoarcere. Lipsește o piesă la graniță: un dispozitiv care să facă hostul privat să <b>pară</b> public. Acesta este routerul (sau <G id="firewall" />-ul) cu NAT.</p>
        <Figure caption="Interactiv: urmărește un pachet pas cu pas. Comută „Fără NAT” ca să vezi de ce răspunsul nu se mai întoarce.">
          <NatStepper />
        </Figure>

        <h3>2. Cele trei tipuri de NAT (concept)</h3>
        <Table head={['Tip', 'Raport', 'Cum funcționează', 'Unde se folosește']} rows={[
          [<G id="static-nat" />, '1 privat ↔ 1 public, permanent', 'traducere fixă, configurată manual; funcționează și pentru conexiuni inițiate din Internet', 'servere interne care trebuie să fie accesibile din exterior'],
          [<G id="dynamic-nat" />, '1 ↔ 1, temporar, dintr-un pool', 'primul venit ia prima adresă publică liberă; când pool-ul se golește, următorii nu mai ies', 'rar astăzi'],
          [<><G id="pat" /> (overload)</>, 'N privați → 1 public (sau câteva)', <>adresă + <b>port</b> sursă; fiecare conversație are propria intrare în tabelă</>, 'aproape peste tot: acasă, birouri, operatori (CGNAT)'],
        ]} />
        <Analogy>PAT e ca centralista unei firme cu un singur număr de telefon public și 200 de interioare: toate apelurile ies cu același număr, dar centralista ține minte ce interior a sunat pe ce linie, ca să facă legătura corectă când vine răspunsul.</Analogy>

        <h3>3. Vocabularul Cisco: inside/outside, local/global</h3>
        <p>Cisco folosește patru termeni care apar ca nume de coloane în <code>show ip nat translations</code>. Regula de citire: <b>inside/outside</b> = unde se află hostul; <b>local/global</b> = din ce parte a routerului privești adresa.</p>
        <Table head={['Termen', 'Ce este', 'Exemplu (din animație)']} hlCol={0} rows={[
          [<G id="inside-local" />, 'adresa reală a hostului din LAN (de obicei privată)', <code>192.168.1.10</code>],
          [<G id="inside-global" />, 'adresa sub care hostul din LAN apare în Internet (publică)', <code>203.0.113.2</code>],
          [<G id="outside-global" />, 'adresa reală a hostului din Internet', <code>198.51.100.10</code>],
          [<G id="outside-local" />, 'adresa hostului din Internet, așa cum o văd hostii din LAN', <><code>198.51.100.10</code> (de regulă identică)</>],
        ]} />
        <Callout kind="info" title="Previzualizare 4.1">
          Pe un router Cisco, PAT se configurează în trei pași: marchezi interfețele (<code>ip nat inside</code> pe LAN, <code>ip nat outside</code> pe WAN), definești cine are voie să fie tradus (un ACL) și legi totul cu <code>ip nat inside source list 1 interface g0/1 overload</code>. Exemplul complet, comentat, e în secțiunea „Exemple de configurare” de mai jos; detaliile, depanarea și NAT-ul static/dinamic vin la topicul <b>4.1</b>.
        </Callout>

        <h3>4. Costurile NAT-ului</h3>
        <ul>
          <li><b>Rupe conectivitatea <G id="end-to-end" />.</b> Un host din Internet nu poate iniția o conexiune spre un host privat: în tabela PAT nu există nicio intrare pentru el. Pentru un server de acasă ai nevoie de <G id="port-forwarding" /> (o intrare statică).</li>
          <li><b>Complică unele protocoale</b> care pun adrese IP în interiorul datelor (FTP în mod activ, SIP pentru telefonie VoIP) sau care protejează antetul IP împotriva modificării (IPsec AH). Routerele folosesc „ajutoare” (ALG — Application Layer Gateway, NAT-T pentru IPsec).</li>
          <li><b>Stare de ținut:</b> routerul trebuie să memoreze fiecare conversație; tabela consumă memorie și CPU. Când pică routerul, se pierd toate conexiunile.</li>
          <li><b>Urmărire mai grea:</b> în logurile unui server, sute de utilizatori apar cu aceeași adresă.</li>
        </ul>
        <Callout kind="warn" title="NAT nu este un firewall">
          Pentru că blochează conexiunile nesolicitate din exterior, NAT/PAT pare că „protejează”. Este doar un efect secundar. Protecția reală o dau regulile de <G id="firewall" /> (stateful inspection) — care există și în IPv6, unde NAT-ul nu mai e necesar.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: ce rescrie exact routerul">
        <ul>
          <li><b>Antetul IP:</b> adresa sursă (la ieșire) sau destinație (la intrare) și, obligatoriu, <b>checksum-ul antetului IP</b> (altfel pachetul ar fi aruncat ca fiind corupt).</li>
          <li><b>Antetul TCP/UDP:</b> portul sursă (cu PAT) și checksum-ul <G id="tcp" />/<G id="udp" />, care include un „pseudo-antet” cu adresele IP — deci se schimbă chiar dacă portul rămâne același.</li>
          <li><b>ICMP:</b> pentru <G id="ping" />, PAT folosește <b>ICMP Identifier</b>-ul în locul portului (de aceea în <code>show ip nat translations</code> vezi <code>icmp 203.0.113.2:1</code>).</li>
          <li><b>Expirarea:</b> intrările dinamice expiră după inactivitate (cele ICMP rapid, cele TCP mai târziu); de aceea în lab trebuie să te uiți la tabelă imediat după ping.</li>
          <li><b>Câte conversații pe o adresă?</b> Câmpul de port are 16 biți (0–65535), deci teoretic zeci de mii de conversații simultane per protocol per adresă publică. Cisco încearcă să păstreze portul sursă original și îl schimbă doar la conflict.</li>
        </ul>
      </DeepDive>

      <Traps items={[
        <><b>PAT = NAT overload</b>: mulți-la-unu, diferențiere după <b>port</b>. Static = 1:1 fix. Dinamic = 1:1 din pool.</>,
        <><b>Inside local</b> = adresa privată a PC-ului. <b>Inside global</b> = adresa publică sub care apare. Nu le inversa.</>,
        <>Fără port forwarding / static NAT, o conexiune <b>inițiată din Internet</b> spre un host privat eșuează.</>,
        <>NAT nu înlocuiește un firewall și <b>nu creează</b> adrese publice noi.</>,
      ]} />
      <InlineQuiz ids={['1.7-020', '1.7-021', '1.7-023', '1.7-040']} />
    </section>
  );
}

/* ======================================================================
   4. CGNAT — 100.64.0.0/10
   ====================================================================== */
export function Cgnat() {
  return (
    <section id="cgnat" className="section">
      <SectionHead id="cgnat" code="1.7" title="CGNAT și 100.64.0.0/10 (Shared Address Space)" />
      <Summary>
        <p>Când nici ISP-ul nu mai are destule adrese publice, face și el NAT: <G id="cgnat" />. Routerul tău primește pe WAN o adresă din <b>100.64.0.0/10</b> (100.64.0.0 – 100.127.255.255, RFC 6598), iar ISP-ul o traduce din nou într-o adresă publică împărțită cu mulți abonați.
          100.64/10 <b>nu este RFC 1918</b>.</p>
      </Summary>

      <Detailed>
        <Figure caption="NAT444: traficul tău trece prin două traduceri și trei domenii de adrese IPv4.">
          <CgnatDiagram />
        </Figure>
        <h3>De ce un bloc separat?</h3>
        <p>ISP-ul ar fi putut folosi pentru legătura cu abonații tot adrese RFC 1918 — de exemplu 10.x.x.x. Problema: abonatul alege liber ce adrese private are în casă. Dacă LAN-ul unui abonat ar fi tot <code>10.0.0.0/24</code>, iar WAN-ul routerului lui ar primi <code>10.0.0.17</code>, routerul ar avea <b>aceeași rețea pe ambele interfețe</b> și rutarea s-ar strica. De aceea, în aprilie 2012, RFC 6598 (BCP 153) a rezervat un bloc nou, <b>100.64.0.0/10</b> (2²² = 4.194.304 adrese), destinat <b>exclusiv</b> legăturii dintre CGN și routerele abonaților.</p>
        <Callout kind="exam" title="Cum calculezi capătul blocului">
          /10 fixează 8 biți din primul octet + primii 2 biți din al doilea. 64 = <code>01000000</code>: primii doi biți „01” → octetul 2 merge de la <code>01000000</code> (64) la <code>01111111</code> (127). Deci <b>100.64.0.0 – 100.127.255.255</b>. 100.128.0.1 este publică.
        </Callout>

        <h3>Consecințe pentru abonat</h3>
        <Table head={['Situație', 'Fără CGNAT (IP public pe WAN)', 'Cu CGNAT (100.64.x.x pe WAN)']} rows={[
          ['Navigare web, streaming', 'funcționează', 'funcționează'],
          ['Server acasă / cameră accesibilă din exterior', 'da, cu port forwarding pe router', 'nu — conexiunea se oprește la CGN-ul ISP-ului, pe care nu-l controlezi'],
          ['Jocuri online / P2P (găzduire)', 'în general fără probleme', 'pot apărea probleme („NAT strict”)'],
          ['Adresa văzută de site-uri', 'adresa WAN a routerului tău', 'o adresă publică diferită, împărțită cu alți abonați'],
        ]} />
        <p>Cum îți dai seama: compară adresa WAN afișată de routerul tău cu adresa publică pe care ți-o arată un site de tip „what is my IP”. Dacă WAN-ul începe cu 100.64–100.127 (sau e o adresă privată) și diferă de cea publică, ești în spatele CGNAT. CGNAT este foarte răspândit în rețelele mobile (4G/5G) și tot mai des întâlnit și în rețelele fixe. Pe termen lung, soluția operatorilor este tot IPv6.</p>
      </Detailed>

      <Traps items={[
        <><b>100.64.0.0/10</b> = Shared Address Space / CGNAT (RFC 6598) — <b>nu</b> RFC 1918.</>,
        <>Intervalul: <b>100.64.0.0 – 100.127.255.255</b>. 100.63.x.x și 100.128.x.x sunt publice.</>,
        <>100.64/10 nu se folosește într-un LAN de firmă ca „încă un bloc privat” — e rezervat pentru ISP ↔ CPE.</>,
      ]} />
      <InlineQuiz ids={['1.7-029', '1.7-030', '1.7-031']} />
    </section>
  );
}

/* ======================================================================
   5. Alte adrese nerutabile — comparație
   ====================================================================== */
export function SpecialRanges() {
  return (
    <section id="special" className="section">
      <SectionHead id="special" code="1.7 ↔ 1.6" title="Privat vs. alte adrese speciale (APIPA, loopback, documentație…)" />
      <Summary>
        <p>Nu orice adresă care „nu merge pe Internet” este privată. <G id="apipa" /> (169.254/16), <G id="loopback" /> (127/8), <G id="test-net">documentația</G> (192.0.2/24, 198.51.100/24, 203.0.113/24) și CGNAT (100.64/10) sunt categorii <b>separate</b> de RFC 1918, fiecare cu alt rol. La examen, distractorii sunt aproape mereu din această listă.</p>
      </Summary>

      <Detailed>
        <Table head={['Bloc', 'Nume', 'RFC', 'Rol', 'Rutat în organizație?', 'Pe Internet?']} rows={[
          [<code>10/8 · 172.16/12 · 192.168/16</code>, <b>Private-Use</b>, '1918', 'LAN-uri, refolosite oriunde', 'da', 'nu (doar prin NAT)'],
          [<code>100.64.0.0/10</code>, 'Shared Address Space', '6598', 'ISP: între CGN și CPE', 'da (în rețeaua ISP)', 'nu'],
          [<code>169.254.0.0/16</code>, 'Link-local (APIPA)', '3927', 'auto-configurare când DHCP lipsește', <b>nu — nici măcar de un router</b>, 'nu'],
          [<code>127.0.0.0/8</code>, 'Loopback', '1122', '„eu însumi”: testarea stivei locale', 'nu părăsește hostul', 'nu'],
          [<code>192.0.2.0/24 · 198.51.100.0/24 · 203.0.113.0/24</code>, 'Documentation (TEST-NET-1/2/3)', '5737', 'exemple în cărți și laburi', 'nu ar trebui folosite real', 'nu'],
          [<code>0.0.0.0/8</code>, '„This network”', '791', 'sursa unui client fără IP (DHCP Discover)', 'nu', 'nu'],
          [<code>224.0.0.0/4</code>, 'Multicast', '5771', 'un emițător → un grup de receptori', 'da (cu rutare multicast)', 'în general nu'],
          [<code>240.0.0.0/4</code>, 'Reserved (clasa E)', '1112', 'rezervat „pentru viitor”', 'nu', 'nu'],
          [<code>255.255.255.255</code>, 'Limited broadcast', '919', 'broadcast pe segmentul local', 'nu trece de router', 'nu'],
        ]} />
        <h3>Reflexe de troubleshooting</h3>
        <ul>
          <li><b>PC-ul are 169.254.x.x</b> → nu a primit răspuns de la DHCP. Nu e „o adresă privată de rezervă”: nu are gateway și nu poate ieși din segment (verifici cu <G id="ipconfig" />, vezi 1.10).</li>
          <li><b>PC-ul are 192.168.x.x / 10.x.x.x</b> → normal pentru un LAN; dacă nu merge Internetul, problema e la gateway, NAT sau DNS, nu la faptul că adresa e privată.</li>
          <li><b>Pe un router vezi venind din Internet o sursă privată</b> → configurație greșită sau trafic falsificat; se filtrează (bogon).</li>
          <li><b>Într-un exemplu vezi 203.0.113.x</b> → e o adresă „publică de jucărie”, sigură pentru documentație.</li>
        </ul>
        <Analogy>RFC 1918 sunt numerele de camere din hotel. APIPA e un bilețel „Camera fără număr — recepția n-a răspuns”. Loopback e oglinda din cameră: vorbești cu tine însuți. Documentația e „Str. Exemplului nr. 1” din manualele de gramatică — nu trimite nimeni scrisori acolo.</Analogy>
      </Detailed>

      <Traps items={[
        <><b>169.254.x.x nu e RFC 1918.</b> Dacă întrebarea cere „private addresses”, APIPA e distractor.</>,
        <><b>127.0.0.1</b> e loopback, nu privat. <code>ping 127.0.0.1</code> testează doar stiva TCP/IP, nu placa sau cablul.</>,
        <>Ruta implicită <code>0.0.0.0/0</code> nu are legătură cu blocul „this network” 0.0.0.0/8.</>,
      ]} />
      <InlineQuiz ids={['1.7-033', '1.7-034', '1.7-035']} />
    </section>
  );
}

/* ======================================================================
   6. IPv6 — soluția pe termen lung
   ====================================================================== */
export function Ipv6Answer() {
  return (
    <section id="ipv6" className="section">
      <SectionHead id="ipv6" code="1.7 → 1.8" title="IPv6 — răspunsul pe termen lung" />
      <Summary>
        <p>Adresele private și NAT au cumpărat timp. Soluția de fond este <G id="ipv6" />: 128 de biți, adică 2¹²⁸ ≈ 3,4 × 10³⁸ adrese — suficiente ca <b>fiecare</b> dispozitiv să aibă o adresă globală (<G id="gua" />) și conectivitatea end-to-end să revină, fără NAT.</p>
      </Summary>
      <Detailed>
        <Table head={['', 'IPv4 cu RFC 1918 + PAT', 'IPv6']} rows={[
          ['Adrese per dispozitiv', 'privată în LAN; publică doar routerul', 'fiecare dispozitiv primește adresă globală'],
          ['NAT', 'obligatoriu pentru Internet', 'nu este necesar'],
          ['Acces din exterior', 'port forwarding / static NAT', 'direct — controlat de firewall'],
          ['Echivalentul „privat”', '10/8, 172.16/12, 192.168/16', <><G id="ula" /> (fc00::/7, în practică fd00::/8) — pentru comunicare internă, nu ca să fie tradus</>],
          ['Securitate perimetru', 'NAT ca efect secundar + firewall', 'firewall (stateful) — singura protecție reală'],
        ]} />
        <p>În practică, rețelele moderne rulează <b>dual stack</b>: IPv4 (privat + NAT) și IPv6 (global) simultan, pe aceleași interfețe. Mulți operatori, inclusiv în România, oferă deja IPv6 abonaților. Adresarea IPv6 o configurezi la <b>1.8</b>, iar tipurile de adrese (GUA, ULA, link-local…) le compari la <b>1.9</b>.</p>
        <Callout kind="tip" title="Gândește așa">
          În IPv4, „privat” înseamnă „ascuns în spatele NAT-ului din lipsă de adrese”. În IPv6 nu mai lipsesc adresele, deci „privat” (ULA) înseamnă doar „folosit intern”, de regulă <b>în paralel</b> cu o adresă globală pe același host.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Soluția <b>pe termen lung</b> la epuizarea IPv4 este IPv6 — nu NAT, nu CIDR (acestea sunt soluții de moment).</>,
        <>ULA din IPv6 nu este „RFC 1918 pentru IPv6 cu NAT obligatoriu”; hostii IPv6 au de regulă și adrese globale.</>,
      ]} />
      <InlineQuiz ids={['1.7-037', '1.7-038']} />
    </section>
  );
}
