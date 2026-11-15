import { Link } from 'react-router-dom';
import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AddressBits, BinaryOctet, ClassfulBar, DottedDecimal, FlsmSplitter, Ipv4Header, MagicNumber, SummaryBits, VlsmAllocator } from '../../diagrams/t1_6';

const SubLink = () => <Link to="/subnetting">pagina Subnetting (calculator + drill infinit)</Link>;

/* ======================================================================
   0. Introducere — imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.6" title="Adresarea IPv4 — imaginea de ansamblu" />
      <Summary>
        <p>Fiecare interfață dintr-o rețea <G id="ipv4" /> are o adresă de <b>32 de biți</b> (de exemplu 192.168.10.1). O <G id="subnet-mask" /> (sau un <G id="prefix-length" />, de exemplu /26) împarte adresa în <b>partea de rețea</b> („strada”) și <b>partea de gazdă</b> („numărul casei”).
          Subnetting înseamnă să tai un bloc de adrese în <G id="subnet">subrețele</G> potrivite fiecărui LAN sau legături, iar la examen trebuie să calculezi <b>rapid și exact</b> rețeaua, broadcast-ul și gazdele valide.</p>
      </Summary>

      <Detailed>
        <p>Topicul 1.6 este probabil <b>cel mai important</b> din tot CCNA-ul pentru un începător: aproape orice altceva (VLAN-uri, rutare statică, OSPF, ACL-uri, NAT, DHCP) presupune că știi să citești o adresă cu mască. Vestea bună: totul se reduce la câteva reguli de aritmetică binară, pe care le construim pas cu pas, cu widget-uri interactive pe care le poți „strica” fără grijă.</p>
        <Callout kind="info" title="Cum am împărțit topicul (Cisco nu dă sub-obiective pentru 1.6)">
          Blueprint-ul oficial are o singură frază: <i>„Configure and verify IPv4 addressing and subnetting”</i>. Am împărțit-o în pașii de mai jos, în ordinea în care se construiesc unul pe altul. Codurile din dreptul secțiunilor (1.6 · binar etc.) sunt doar repere în această lecție, nu coduri oficiale.
        </Callout>
        <Table head={['Secțiune', 'Ce înveți', 'De ce contează la examen']} hlCol={0} rows={[
          ['1.6 · binar', 'conversia binar ↔ zecimal pe un octet', 'fără ea nu poți înțelege măștile'],
          ['1.6 · structură', 'cum arată o adresă și antetul IPv4', 'întrebări de recunoaștere (TTL, câmpuri)'],
          ['1.6 · clase → CIDR', 'clasele A–E și de ce au fost abandonate', 'vocabular („clasa B”, „mască implicită”)'],
          ['1.6 · măști', 'mască zecimală ↔ /prefix ↔ wildcard', 'conversii rapide, cerute peste tot'],
          ['1.6 · calcul', 'rețea, broadcast, prima/ultima gazdă, nr. de gazde', 'cel mai frecvent tip de întrebare'],
          ['1.6 · magic number', 'metoda rapidă de calcul mental', 'viteză: ai ≈1–2 minute pe întrebare'],
          ['1.6 · FLSM / VLSM', 'împărțirea unui bloc în subrețele egale / pe măsură', 'proiectarea unui plan de adresare'],
          ['1.6 · /31, /32, speciale', 'cazuri limită și adrese rezervate', 'capcane clasice'],
          ['config + laburi', 'ip address, no shutdown, secondary, show-uri, erori IOS', 'partea de „Configure and verify”'],
        ]} />

        <h3>Vocabularul de bază</h3>
        <ul>
          <li><b>Gazdă (host)</b> — orice interfață care are o adresă IP: PC, telefon, imprimantă, interfața unui <G id="router" />.</li>
          <li><b><G id="subnet" /></b> — un grup de gazde care comunică direct între ele, fără router. De regulă: 1 subrețea = 1 <G id="vlan" /> = 1 <G id="broadcast-domain" />.</li>
          <li><b><G id="network-address" /></b> — prima adresă din subrețea (identifică subrețeaua). <b><G id="broadcast-address" /></b> — ultima adresă (ajunge la toți). Cele dintre ele = <b>gazde utilizabile</b>.</li>
          <li><b><G id="default-gateway" /></b> — routerul din subrețea, la care gazda trimite tot ce pleacă spre alte subrețele.</li>
        </ul>
        <Analogy>Adresa IP e ca o adresă poștală: „Strada Florilor nr. 77”. Partea de rețea e strada, partea de gazdă e numărul casei. Masca e linia trasă pe plic care spune unde se termină numele străzii. Poștașul (routerul) se uită doar la stradă ca să știe în ce cartier duce scrisoarea; numărul casei contează abia la final, pe strada potrivită.</Analogy>

        <h3>Ce face concret o gazdă cu adresa și masca</h3>
        <p>Când PC-ul 192.168.10.10/26 vrea să trimită ceva la 192.168.10.40, își aplică propria mască pe ambele adrese. Dacă rezultatul (adresa de rețea) e același, destinația e <b>locală</b>: află MAC-ul ei prin <G id="arp" /> și trimite direct. Dacă diferă (de exemplu 192.168.10.70 → rețeaua .64), destinația e <b>la distanță</b>: trimite cadrul la MAC-ul gateway-ului. De aceea o mască greșită pe PC strică totul, chiar dacă adresa e „corectă”.</p>
      </Detailed>

      <Traps items={[
        <>Adresa de rețea și cea de broadcast <b>nu</b> se dau gazdelor (excepție: /31 și /32, discutate mai jos).</>,
        <>Gateway-ul unei gazde trebuie să fie <b>în aceeași subrețea</b> cu ea. O întrebare clasică ascunde un gateway din subrețeaua vecină.</>,
        <>Pe examen „subnet zero” (prima subrețea, de exemplu .0/26) este <b>utilizabilă</b> — IOS o permite implicit de mult timp (<code>ip subnet-zero</code>).</>,
      ]} />
    </section>
  );
}

/* ======================================================================
   1. Binar ↔ zecimal
   ====================================================================== */
export function Binary() {
  return (
    <section id="binary" className="section">
      <SectionHead id="binary" code="1.6 · binar" title="Binar ↔ zecimal: limbajul măștilor" />
      <Summary>
        <p>Un <G id="octet" /> are 8 biți cu valorile <b>128 64 32 16 8 4 2 1</b>. Valoarea zecimală = suma pozițiilor care au bitul 1. Pentru subnetting trebuie să știi pe de rost doar două șiruri: puterile lui 2 și cele 9 valori posibile ale unui octet de mască (<b>0 128 192 224 240 248 252 254 255</b>).</p>
      </Summary>

      <Detailed>
        <p>Calculatoarele lucrează doar cu 0 și 1. Noi scriem adresele în zecimal pentru că e mai comod, dar <b>orice regulă de subnetting are sens doar în binar</b>. Bine că pentru CCNA ajunge să lucrezi cu un singur octet odată (8 biți, valori 0–255).</p>
        <h3>Valorile pozițiilor</h3>
        <Table head={['Poziție (bit)', '7', '6', '5', '4', '3', '2', '1', '0']} rows={[
          ['Putere', '2⁷', '2⁶', '2⁵', '2⁴', '2³', '2²', '2¹', '2⁰'],
          ['Valoare', '128', '64', '32', '16', '8', '4', '2', '1'],
        ]} />
        <Figure caption="Interactiv: apasă pe biți ca să-i aprinzi sau stingi. Poți tasta și un număr zecimal, sau apasă „Provocare” pentru un exercițiu.">
          <BinaryOctet />
        </Figure>

        <h3>Binar → zecimal: aduni</h3>
        <p>Pui valorile deasupra biților și aduni pozițiile cu 1. Exemplu: <code>10101100</code> → 128 + 32 + 8 + 4 = <b>172</b>.</p>

        <h3>Zecimal → binar: metoda scăderii</h3>
        <p>Mergi de la stânga la dreapta: dacă valoarea poziției „încape” în ce a rămas, scrii 1 și o scazi; dacă nu, scrii 0. Exemplu pentru <b>201</b>:</p>
        <Table head={['Poziție', '128', '64', '32', '16', '8', '4', '2', '1']} rows={[
          ['Încape?', '201 ≥ 128 → rest 73', '73 ≥ 64 → rest 9', '9 < 32', '9 < 16', '9 ≥ 8 → rest 1', '1 < 4', '1 < 2', '1 ≥ 1 → rest 0'],
          ['Bit', '1', '1', '0', '0', '1', '0', '0', '1'],
        ]} />
        <p>Rezultat: 201 = <code>11001001</code>.</p>

        <h3>Șirul care contează cel mai mult: octeții de mască</h3>
        <p>O mască are toți biții 1 grupați la stânga. Într-un octet, asta permite doar 9 valori. Fiecare se obține adunând următoarea putere a lui 2:</p>
        <Table head={['Biți de 1', '0', '1', '2', '3', '4', '5', '6', '7', '8']} hlCol={0} rows={[
          ['Binar', '00000000', '10000000', '11000000', '11100000', '11110000', '11111000', '11111100', '11111110', '11111111'],
          ['Zecimal', '0', '128', '192', '224', '240', '248', '252', '254', '255'],
          ['Bloc (256 − valoare)', '256', '128', '64', '32', '16', '8', '4', '2', '1'],
        ]} />
        <Callout kind="tip" title="Truc de memorare">
          128 → +64 = 192 → +32 = 224 → +16 = 240 → +8 = 248 → +4 = 252 → +2 = 254 → +1 = 255. Iar rândul „bloc” este chiar șirul puterilor lui 2, citit de la dreapta. Scrie ambele rânduri pe foaia de notițe la începutul examenului.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: de ce 0–255 și ce e hexazecimalul">
        <p>Cu 8 biți ai 2⁸ = 256 de combinații, de la 00000000 (0) la 11111111 (255). De aceea niciun octet IPv4 nu poate depăși 255: <code>192.168.256.1</code> este invalid.</p>
        <p>Hexazecimalul (baza 16) grupează biții câte 4: un octet = 2 cifre hex (0–9, a–f). 255 = <code>ff</code>, 192 = <code>c0</code>. Îl vei întâlni la <G id="mac" /> (48 de biți = 12 cifre hex), la <G id="ipv6" /> și pe macOS/Linux, unde masca apare uneori ca <code>0xffffff00</code> (= 255.255.255.0 = /24).</p>
      </DeepDive>

      <Traps items={[
        <>Bitul din <b>stânga</b> valorează 128, nu 1. Citirea inversă e cea mai frecventă greșeală.</>,
        <>Dacă un octet de mască nu e în lista 0/128/192/224/240/248/252/254/255, masca este <b>invalidă</b> (de exemplu 255.255.255.228).</>,
        <>Un octet IPv4 are maximum <b>255</b>: orice adresă cu 256 sau mai mult e invalidă.</>,
      ]} />
      <InlineQuiz ids={['1.6-001', '1.6-002', '1.6-003']} />
    </section>
  );
}

/* ======================================================================
   2. Structura adresei și antetul
   ====================================================================== */
export function Structure() {
  return (
    <section id="structure" className="section">
      <SectionHead id="structure" code="1.6 · structură" title="Structura adresei IPv4 și antetul pachetului" />
      <Summary>
        <p>O adresă IPv4 = 32 de biți = 4 octeți, scrisă în „dotted decimal”. Adresa nu stă singură: ea se află în <b>antetul IPv4</b> al fiecărui pachet (minimum 20 de octeți), alături de câmpuri precum <G id="ttl" /> și Protocol. Routerele decid drumul doar pe baza adresei destinație.</p>
      </Summary>

      <Detailed>
        <h3>Notația „dotted decimal”</h3>
        <Figure caption="Cei 32 de biți sunt împărțiți în 4 octeți; fiecare octet se scrie în zecimal, iar octeții se separă prin puncte.">
          <DottedDecimal />
        </Figure>
        <p>Spațiul total este de 2³² ≈ 4,29 miliarde de adrese. Pare mult, dar o parte e rezervată (multicast, loopback, documentație), iar Internetul are de mult mai multe dispozitive. De aici s-au născut <G id="nat" /> și adresele private <G id="rfc1918" /> (topicul 1.7) și, pe termen lung, IPv6 (1.8).</p>

        <h3>Partea de rețea și partea de gazdă</h3>
        <p>Adresa singură nu spune unde se termină rețeaua. Pentru asta e nevoie de mască: primii <i>n</i> biți (cei acoperiți de biții 1 ai măștii) sunt <b>rețeaua</b>, restul de 32 − <i>n</i> sunt <b>gazda</b>. Aceeași adresă 192.168.10.77 poate fi în rețele diferite, în funcție de mască:</p>
        <Table head={['Adresă/prefix', 'Rețea', 'Gazde în subrețea']} rows={[
          ['192.168.10.77/24', '192.168.10.0', '254 (.1–.254)'],
          ['192.168.10.77/26', '192.168.10.64', '62 (.65–.126)'],
          ['192.168.10.77/29', '192.168.10.72', '6 (.73–.78)'],
        ]} />

        <h3>Antetul IPv4 (RFC 791)</h3>
        <p>Când o aplicație trimite date, stratul de rețea le pune într-un pachet (vezi <G id="encapsulation" />, topicul 1.5). Pachetul are un antet cu informațiile de livrare. Nu trebuie să memorezi poziția fiecărui bit, dar trebuie să recunoști câmpurile și rolul lor.</p>
        <Figure caption="Interactiv: apasă pe un câmp ca să vezi ce face. Câmpurile cu contur albastru sunt cele mai des întrebate.">
          <Ipv4Header />
        </Figure>
        <Table head={['Câmp', 'Biți', 'Pe înțeles']} rows={[
          ['Version', '4', 'mereu 4'],
          ['IHL', '4', 'lungimea antetului în cuvinte de 32 de biți (5 = 20 de octeți, maximum 15 = 60)'],
          ['DSCP + ECN', '6 + 2', 'prioritate QoS și semnalizarea congestiei (detalii în 4.7)'],
          ['Total Length', '16', 'antet + date, maximum 65.535 de octeți'],
          ['Identification, Flags, Fragment Offset', '16 / 3 / 13', 'fragmentare și reasamblare (bitul DF = nu fragmenta)'],
          [<G id="ttl" />, '8', 'scade cu 1 la fiecare router; la 0 pachetul e aruncat'],
          ['Protocol', '8', 'ce conține: 1 = ICMP, 6 = TCP, 17 = UDP, 89 = OSPF'],
          ['Header Checksum', '16', 'verifică doar antetul; recalculat la fiecare hop'],
          ['Source / Destination Address', '32 + 32', 'adresele IPv4'],
        ]} />
        <Callout kind="exam" title="Ce reții pentru examen">
          Antet minim <b>20 de octeți</b>. <b>TTL</b> previne buclele (și face posibil <G id="traceroute" />). Câmpul <b>Protocol</b> spune ce urmează: <G id="icmp" /> (1), <G id="tcp" /> (6), <G id="udp" /> (17).
        </Callout>
      </Detailed>

      <Traps items={[
        <>Routerul schimbă la fiecare hop <b>TTL-ul și checksum-ul</b>, dar <b>nu</b> adresele IP sursă/destinație (cu excepția NAT). Adresele MAC, în schimb, se schimbă la fiecare hop.</>,
        <>Antetul IPv4 are <b>20–60 de octeți</b>; cel IPv6 are fix 40.</>,
      ]} />
      <InlineQuiz ids={['1.6-006', '1.6-007']} />
    </section>
  );
}

/* ======================================================================
   3. Classful → CIDR
   ====================================================================== */
export function Classful() {
  return (
    <section id="classful" className="section">
      <SectionHead id="classful" code="1.6 · clase → CIDR" title="De la clasele A/B/C la CIDR" />
      <Summary>
        <p>Între 1981 și 1993 masca era dedusă din primul octet: <b>A</b> (1–126, /8), <b>B</b> (128–191, /16), <b>C</b> (192–223, /24); <b>D</b> = multicast, <b>E</b> = rezervat. Sistemul risipea enorm, așa că <G id="cidr" /> l-a înlocuit cu prefixe de orice lungime. Clasele au rămas ca vocabular — și ca întrebări de examen.</p>
      </Summary>

      <Detailed>
        <h3>Adresarea classful (istorie)</h3>
        <p>În RFC 791 nu exista nicio mască. Routerul se uita la primii biți ai adresei și știa automat cât e rețeaua:</p>
        <Figure caption="Clasele după primul octet. Observă proporțiile: A ocupă jumătate din spațiu, B un sfert, C o optime.">
          <ClassfulBar />
        </Figure>
        <Table head={['Clasă', 'Primii biți', 'Primul octet', 'Mască implicită', 'Rețele / gazde per rețea', 'Utilizare']} hlCol={0} rows={[
          ['A', '0', '1–126 (0 și 127 rezervate)', '/8 · 255.0.0.0', '126 / 16.777.214', 'unicast, organizații foarte mari'],
          ['B', '10', '128–191', '/16 · 255.255.0.0', '16.384 / 65.534', 'unicast, organizații medii'],
          ['C', '110', '192–223', '/24 · 255.255.255.0', '≈2 milioane / 254', 'unicast, organizații mici'],
          ['D', '1110', '224–239', '—', '—', <><G id="multicast" /> (224.0.0.0/4)</>],
          ['E', '1111', '240–255', '—', '—', 'rezervat / experimental (240.0.0.0/4)'],
        ]} />

        <h3>Ce problemă a apărut</h3>
        <p>Dimensiunile erau fixe și foarte depărtate: 254, 65.534 sau 16,7 milioane de gazde. O firmă cu 300 de calculatoare nu încăpea într-un clasa C, deci primea un <b>clasa B întreg</b> — peste 99% din adrese irosite. Alternativa era să primească mai multe clase C, dar fiecare devenea <b>o rută separată</b> în fiecare router din Internet. RFC 1519 (1993) a numit trei probleme: epuizarea claselor B, creșterea tabelelor de rutare peste puterea echipamentelor (de la 173 de rute în 1988 la peste 8.500 la finalul lui 1992) și epuizarea pe termen lung a celor 32 de biți.</p>

        <h3>Soluția: CIDR (Classless Inter-Domain Routing)</h3>
        <ul>
          <li><b>Prefix de orice lungime.</b> Masca nu se mai deduce din clasă, ci se scrie explicit (<code>/20</code>, <code>/22</code>…). Firma cu 300 de gazde primește un <b>/23</b> (510 gazde).</li>
          <li><b>Agregare (supernetting).</b> Un ISP care deține 172.16.0.0/16 dă clienților /24-uri, dar spre restul Internetului anunță <b>un singur</b> 172.16.0.0/16. Tabelele de rutare globale cresc mult mai încet.</li>
          <li><b>Măști variabile în interiorul firmelor</b> (<G id="vlsm" />) — tot ce vei face în restul lecției.</li>
        </ul>
        <Analogy>Clasele erau ca un hotel cu doar trei tipuri de camere: single, sală de bal și stadion. Dacă veneai cu 300 de oaspeți primeai stadionul. CIDR e hotelul cu pereți mobili: primești exact câte camere îți trebuie, iar recepția (Internetul) are în registru un singur rând pentru tot etajul.</Analogy>
        <p className="small muted">Alocările globale vin de la <G id="iana" />, prin registrele regionale (<G id="rir" />, pentru Europa RIPE NCC), către ISP-uri și firme. Toate folosesc CIDR.</p>
      </Detailed>

      <Traps items={[
        <>Intervalul clasei A „utilizabil” este <b>1–126</b>: 0 înseamnă „această rețea”, iar <b>127</b> este rezervat pentru <G id="loopback" />.</>,
        <><b>172.16–172.31</b> sunt private (RFC 1918), dar <b>172.32</b> e public — deși tot clasa B. Clasa ≠ privat/public.</>,
        <>Când examenul spune „masca implicită” (default/classful mask), înseamnă /8, /16 sau /24 după primul octet.</>,
      ]} />
      <InlineQuiz ids={['1.6-008', '1.6-009', '1.6-010']} />
    </section>
  );
}

/* ======================================================================
   4. Măști și prefix
   ====================================================================== */
const MASKS: [number, string, string, string, string][] = Array.from({ length: 33 }, (_, n) => {
  const m = n === 0 ? 0 : (0xffffffff << (32 - n)) >>> 0;
  const dot = (x: number) => [24, 16, 8, 0].map((s) => (x >>> s) & 255).join('.');
  const addrs = 2 ** (32 - n);
  const hosts = n === 32 ? '1 (host route)' : n === 31 ? '2 (RFC 3021, p2p)' : n === 0 ? '— (rută implicită)' : (addrs - 2).toLocaleString('ro-RO');
  return [n, dot(m), dot(~m >>> 0), addrs.toLocaleString('ro-RO'), hosts];
});
export function Masks() {
  return (
    <section id="masks" className="section">
      <SectionHead id="masks" code="1.6 · măști" title="Masca de subrețea, prefixul și wildcard-ul" />
      <Summary>
        <p>Aceeași informație, trei scrieri: <b>/26</b> = <b>255.255.255.192</b> = 26 de biți de 1 urmați de 6 biți de 0. Biți de gazdă h = 32 − prefix; adrese = 2^h; gazde utilizabile = 2^h − 2. <G id="wildcard-mask" />-ul este inversul măștii (0.0.0.63 pentru /26).</p>
      </Summary>

      <Detailed>
        <h3>Conversia /prefix ↔ mască zecimală</h3>
        <ol>
          <li>Câți octeți întregi de 255? prefix ÷ 8 (partea întreagă). Pentru /26: 3 octeți de 255.</li>
          <li>Câți biți rămân? prefix mod 8. Pentru /26: 2 biți → octetul 192 (din șirul 128, 192, 224…).</li>
          <li>Restul octeților sunt 0. → 255.255.255.192.</li>
        </ol>
        <p>Invers: 255.255.248.0 → 8 + 8 + 5 (248 = 5 biți) + 0 = <b>/21</b>.</p>
        <Callout kind="tip" title="Simetria care îți scutește memorie">
          /17–/24 au în <b>al treilea</b> octet exact aceleași valori pe care /25–/32 le au în <b>al patrulea</b>: /20 și /28 au amândouă 240 și bloc 16; /19 și /27 au 224 și bloc 32. Învață un singur rând (/25–/32) și deplasează-l un octet la stânga.
        </Callout>

        <h3>Formulele</h3>
        <Table head={['Ce cauți', 'Formula', 'Exemplu /27']} rows={[
          ['biți de gazdă (h)', '32 − prefix', '5'],
          ['adrese în subrețea', '2^h', '32'],
          ['gazde utilizabile', '2^h − 2 (−rețea, −broadcast)', '30'],
          ['subrețele dintr-un bloc mai mare', '2^s, s = biți împrumutați', 'dintr-un /24: 2³ = 8'],
          ['wildcard', '255 − fiecare octet al măștii', '0.0.0.31'],
        ]} />
        <p>Două întrebări inverse apar constant:</p>
        <ul>
          <li><b>„Ce mască pentru N gazde?”</b> — cel mai mic h cu 2^h − 2 ≥ N. 60 → h = 6 (62) → /26. 500 → h = 9 (510) → /23.</li>
          <li><b>„Ce mască pentru N subrețele?”</b> — cel mai mic s cu 2^s ≥ N, adăugat la prefixul inițial. 5 subrețele dintr-un /24 → s = 3 → /27.</li>
        </ul>

        <h3>Tabelul complet /0 – /32</h3>
        <p className="small muted">Rândurile /24–/30 sunt cele mai folosite în LAN-uri și legături; /8, /16 și /24 sunt măștile vechilor clase.</p>
        <Table head={['/n', 'Mască', 'Wildcard', 'Adrese', 'Gazde utilizabile']} hlCol={1} rows={MASKS.map(([n, m, w, a, h]) => [`/${n}`, <span className="mono">{m}</span>, <span className="mono">{w}</span>, a, h])} />
      </Detailed>

      <DeepDive title="Deep dive: de unde vine „−2” și de ce IOS a acceptat masca abia din RFC 950">
        <p>În orice subrețea, adresa cu toți biții de gazdă 0 identifică rețeaua, iar cea cu toți biții 1 este broadcast-ul. Ambele sunt „consumate” de protocol, deci rămân 2^h − 2 pentru gazde. Subnetting-ul în sine (împrumutarea de biți din partea de gazdă) a fost standardizat în RFC 950 (1985); înainte, o organizație avea doar rețeaua ei classful, fără subrețele interne.</p>
        <p>Regula veche „2^s − 2 subrețele” excludea și subrețeaua zero și pe cea cu toți biții de subrețea 1, pentru că unele protocoale classful nu le puteau distinge. Pe Cisco, <code>ip subnet-zero</code> le permite — și e activă implicit de mult timp, așa că examenul actual folosește 2^s.</p>
      </DeepDive>

      <Traps items={[
        <>Comanda IOS clasică <code>ip address</code> vrea masca <b>zecimală</b>, nu /prefix.</>,
        <><b>Wildcard ≠ mască.</b> /26 → mască 255.255.255.192, wildcard 0.0.0.63. Wildcard-ul apare în ACL și OSPF, niciodată în <code>ip address</code>.</>,
        <>Gazde vs. adrese: /30 are <b>4 adrese</b>, dar <b>2 gazde</b>. /24 are 256 de adrese, 254 de gazde.</>,
      ]} />
      <InlineQuiz ids={['1.6-004', '1.6-005', '1.6-020']} />
    </section>
  );
}

/* ======================================================================
   5. Calculul rețelei, broadcast-ului și gazdelor
   ====================================================================== */
export function Calc() {
  return (
    <section id="calc" className="section">
      <SectionHead id="calc" code="1.6 · calcul" title="Rețea, broadcast, gazde: calculul exact (în binar)" />
      <Summary>
        <p><b>Rețeaua</b> = IP AND mască (biții de gazdă devin 0). <b>Broadcast</b> = biții de gazdă devin 1. <b>Prima gazdă</b> = rețea + 1, <b>ultima</b> = broadcast − 1. Mai întâi înțelegi metoda în binar (aici), apoi o faci mental cu metoda magic number (secțiunea următoare).</p>
      </Summary>

      <Detailed>
        <h3>Operația AND, bit cu bit</h3>
        <p>AND dă 1 doar dacă ambii biți sunt 1. Unde masca are 1 (partea de rețea), bitul IP-ului se păstrează; unde masca are 0 (partea de gazdă), rezultatul e 0. Asta face și PC-ul tău de fiecare dată când trimite un pachet.</p>
        <Figure caption="Interactiv: tastează orice adresă și mută prefixul. Biții de rețea sunt teal, cei de gazdă portocalii. La „Rețea” toți biții de gazdă sunt 0, la „Broadcast” toți sunt 1.">
          <AddressBits />
        </Figure>

        <h3>Exemplu complet în binar: 192.168.10.77/26</h3>
        <Table head={['', 'Octet 1', 'Octet 2', 'Octet 3', 'Octet 4', 'Zecimal']} rows={[
          ['IP', '11000000', '10101000', '00001010', <span className="mono"><b>01</b>001101</span>, '192.168.10.77'],
          ['Mască /26', '11111111', '11111111', '11111111', <span className="mono"><b>11</b>000000</span>, '255.255.255.192'],
          ['Rețea (AND)', '11000000', '10101000', '00001010', <span className="mono"><b>01</b>000000</span>, '192.168.10.64'],
          ['Broadcast', '11000000', '10101000', '00001010', <span className="mono"><b>01</b>111111</span>, '192.168.10.127'],
        ]} />
        <p>Deci: rețea <b>192.168.10.64</b>, prima gazdă <b>.65</b>, ultima <b>.126</b>, broadcast <b>.127</b>, 2⁶ − 2 = <b>62</b> de gazde.</p>
        <Callout kind="info" title="Observă">
          Primii 3 octeți (unde masca e 255) se copiază neschimbați. Toată „munca” se face într-un singur octet — cel în care masca nu e nici 255, nici 0. Pe această observație se bazează metoda rapidă.
        </Callout>

        <h3>Este X o gazdă validă?</h3>
        <p>Calculezi rețeaua și broadcast-ul subrețelei; X e valid doar dacă e <b>strict între</b> ele. Exemplu: în 10.10.10.64/26, .64 e rețeaua, .127 broadcast-ul, deci gazdele valide sunt .65–.126. <b>.130</b> ar fi o gazdă validă, dar în subrețeaua următoare (.128/26).</p>
        <h3>Sunt două gazde în aceeași subrețea?</h3>
        <p>Aplici masca pe ambele. Dacă rețelele coincid, comunică direct; altfel au nevoie de router. Atenție: dacă cele două gazde au <b>măști diferite</b>, fiecare decide cu masca ei — sursa unor probleme greu de depistat.</p>
      </Detailed>

      <Traps items={[
        <>Nu „ghici” rețeaua copiind octetul: 10.1.1.100/27 <b>nu</b> e în rețeaua .100, ci în .96.</>,
        <>Ultima gazdă = broadcast <b>− 1</b>, nu broadcast. Variantele de răspuns pun aproape mereu broadcast-ul ca distractor.</>,
        <>„Minimum de gazde” → alegi cel mai <b>mic</b> bloc care încape: 500 de gazde → /23, nu /22.</>,
      ]} />
      <InlineQuiz ids={['1.6-011', '1.6-013', '1.6-014', '1.6-015']} />
    </section>
  );
}

/* ======================================================================
   6. Metoda magic number
   ====================================================================== */
type Ex = { t: string; ip: string; steps: string[]; res: [string, string, string, string, string] };
const EXAMPLES: Ex[] = [
  { t: 'Exemplul A — ultimul octet', ip: '10.1.1.100/27', steps: ['/27 → 255.255.255.224 · octetul 4', 'bloc = 256 − 224 = 32 → 0, 32, 64, 96, 128…', '96 ≤ 100 < 128'], res: ['10.1.1.96', '10.1.1.97', '10.1.1.126', '10.1.1.127', '30'] },
  { t: 'Exemplul B — al treilea octet', ip: '172.16.77.200/19', steps: ['/19 → 255.255.224.0 · octetul 3', 'bloc = 32 → 0, 32, 64, 96…', '64 ≤ 77 < 96; octetul 4 devine 0 la rețea și 255 la broadcast'], res: ['172.16.64.0', '172.16.64.1', '172.16.95.254', '172.16.95.255', '8.190'] },
  { t: 'Exemplul C — al doilea octet', ip: '10.200.3.4/11', steps: ['/11 → 255.224.0.0 · octetul 2', 'bloc = 32 → …160, 192, 224', '192 ≤ 200 < 224; octeții 3 și 4 devin 0 / 255'], res: ['10.192.0.0', '10.192.0.1', '10.223.255.254', '10.223.255.255', '2.097.150'] },
  { t: 'Exemplul D — bloc mic (/29)', ip: '192.168.1.75/29', steps: ['/29 → 255.255.255.248 · octetul 4', 'bloc = 8 → …64, 72, 80', '72 ≤ 75 < 80'], res: ['192.168.1.72', '192.168.1.73', '192.168.1.78', '192.168.1.79', '6'] },
  { t: 'Exemplul E — sunt în aceeași subrețea? (exemplu din documentația Cisco)', ip: '172.16.17.30/20 și 172.16.28.15/20', steps: ['/20 → 255.255.240.0 · octetul 3, bloc 16 → 0, 16, 32…', '16 ≤ 17 < 32 și 16 ≤ 28 < 32', 'ambele în 172.16.16.0/20 → DA, aceeași subrețea'], res: ['172.16.16.0', '172.16.16.1', '172.16.31.254', '172.16.31.255', '4.094'] },
  { t: 'Exemplul F — /23 (bloc 2 în al treilea octet)', ip: '172.20.1.200/23', steps: ['/23 → 255.255.254.0 · octetul 3', 'bloc = 2 → 0, 2, 4…', '0 ≤ 1 < 2 → octetul 3 = 0; broadcast: 0 + 2 − 1 = 1'], res: ['172.20.0.0', '172.20.0.1', '172.20.1.254', '172.20.1.255', '510'] },
];
export function Magic() {
  return (
    <section id="magic" className="section">
      <SectionHead id="magic" code="1.6 · magic number" title="Metoda magic number — subnetting mental, rapid" />
      <Summary>
        <p>Găsește <b>octetul interesant</b> (unde masca nu e 255 sau 0). <b>Bloc = 256 − valoarea măștii</b> din el. Rețeaua = cel mai mare multiplu al blocului ≤ valoarea IP-ului în acel octet (stânga se copiază, dreapta devine 0). Broadcast = rețea + bloc − 1 (dreapta devine 255).</p>
      </Summary>

      <Detailed title="Explicația detaliată — metoda pas cu pas">
        <p>În secțiunea anterioară ai văzut că AND-ul binar schimbă doar un octet. În acel octet, subrețelele încep la multipli egali, distanțați exact cu dimensiunea blocului (de exemplu 0, 32, 64, 96… pentru /27). Deci nu mai trebuie să convertești nimic în binar: <b>împarți și rotunjești în jos</b>.</p>
        <ol>
          <li><b>Octetul interesant</b>: pentru /n, este octetul ⌈n/8⌉ (al 4-lea pentru /25–/32, al 3-lea pentru /17–/24, al 2-lea pentru /9–/16). Dacă n e multiplu de 8, nu există — masca „taie” exact la graniță.</li>
          <li><b>Magic number</b> = 256 − valoarea măștii în acel octet.</li>
          <li><b>Rețeaua</b>: cel mai mare multiplu al magic number-ului ≤ valoarea IP-ului în acel octet. Octeții din stânga se copiază, cei din dreapta devin 0.</li>
          <li><b>Broadcast</b>: (rețea + magic − 1) în acel octet; octeții din dreapta devin 255. (Sau: rețeaua următoare − 1.)</li>
          <li><b>Gazde</b>: prima = rețea + 1 (în ultimul octet), ultima = broadcast − 1.</li>
        </ol>
        <Figure caption="Interactiv: tastează adresa și mută prefixul. Axa arată blocurile din octetul interesant și blocul în care cade adresa.">
          <MagicNumber />
        </Figure>
      </Detailed>

      <Detailed title="Exemple rezolvate (verificate cu calculatorul aplicației)">
        {EXAMPLES.map((e) => (
          <div key={e.t} className="card" style={{ marginBottom: 12 }}>
            <h4 style={{ marginTop: 0 }}>{e.t}: <span className="mono" style={{ color: 'var(--accent)' }}>{e.ip}</span></h4>
            <ol className="small">{e.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <Table head={['Rețea', 'Prima gazdă', 'Ultima gazdă', 'Broadcast', 'Gazde']} rows={[e.res.map((x) => <span className="mono">{x}</span>)]} />
          </div>
        ))}
        <Reveal label="Exercițiu: încearcă singur 192.168.200.157/28, apoi deschide">
          <p>/28 → .240, bloc 16 → …144, <b>160</b>. 144 ≤ 157 &lt; 160 → rețea <b>192.168.200.144</b>, gazde .145–.158, broadcast <b>.159</b>, 14 gazde. Verifică în <SubLink />.</p>
        </Reveal>
      </Detailed>

      <Detailed title="Trucuri de viteză pentru examen">
        <ul>
          <li><b>Linia de notițe.</b> La începutul examenului scrie pe foaia/tabla primită (dacă centrul de testare o oferă) trei rânduri: <code>128 192 224 240 248 252 254 255</code> / <code>/25 /26 /27 /28 /29 /30 /31 /32</code> / <code>128 64 32 16 8 4 2 1</code>. Aceleași valori merg pentru /17–/24 în al treilea octet.</li>
          <li><b>Verificări de bun-simț:</b> rețeaua e multiplu de bloc (deci pară); broadcast-ul are ultimul octet impar; între rețea și broadcast sunt exact bloc − 1.</li>
          <li><b>Pentru „cea mai mică mască pentru N gazde”</b> memorează pragurile: 2 → /30, 6 → /29, 14 → /28, 30 → /27, 62 → /26, 126 → /25, 254 → /24, 510 → /23, 1022 → /22.</li>
          <li><b>Elimină variantele</b> care sunt rețea sau broadcast atunci când ți se cere o gazdă validă.</li>
          <li><b>Exersează până devine reflex</b>: 10–15 minute pe zi în <SubLink />. Ținta: sub 15 secunde pe adresă.</li>
        </ul>
        <Callout kind="warn" title="Despre foaia de notițe">
          Regulile exacte privind tabla/foaia de notițe depind de centrul Pearson VUE sau de examenul online (OnVUE). Verifică-le înainte; antrenează-te oricum să poți face calculele și fără ea.
        </Callout>
      </Detailed>

      <Traps items={[
        <>Magic number se calculează din <b>mască</b>, nu din IP.</>,
        <>Pentru /17–/23 octetul interesant e <b>al treilea</b>: ultimul octet devine 0 la rețea și 255 la broadcast. 172.16.95.254 e gazdă validă în 172.16.64.0/19!</>,
        <>O adresă cu ultimul octet .0 sau .255 <b>poate</b> fi gazdă validă când prefixul e mai scurt de /24 (de exemplu 172.20.0.255/23).</>,
      ]} />
      <InlineQuiz ids={['1.6-012', '1.6-016', '1.6-017', '1.6-019']} />
    </section>
  );
}

/* ======================================================================
   7. FLSM
   ====================================================================== */
export function Flsm() {
  return (
    <section id="flsm" className="section">
      <SectionHead id="flsm" code="1.6 · FLSM" title="FLSM — subrețele de dimensiune egală" />
      <Summary>
        <p><G id="flsm" />: împrumuți <i>s</i> biți din partea de gazdă și obții <b>2^s subrețele egale</b>, fiecare cu 2^h − 2 gazde. E simplu de calculat, dar risipitor când subrețelele au nevoi foarte diferite.</p>
      </Summary>

      <Detailed>
        <h3>Exemplu: 192.168.1.0/24 în 4 subrețele</h3>
        <p>4 = 2² → împrumuți 2 biți → /26, bloc 64.</p>
        <Table head={['Subrețea', 'Rețea', 'Prima gazdă', 'Ultima gazdă', 'Broadcast']} rows={[
          ['1', '192.168.1.0/26', '.1', '.62', '.63'],
          ['2', '192.168.1.64/26', '.65', '.126', '.127'],
          ['3', '192.168.1.128/26', '.129', '.190', '.191'],
          ['4', '192.168.1.192/26', '.193', '.254', '.255'],
        ]} />
        <Figure caption="Interactiv: alege în câte subrețele egale tai 192.168.1.0/24. Fiecare dublare a numărului de subrețele înjumătățește dimensiunea lor.">
          <FlsmSplitter />
        </Figure>
        <h3>Problema FLSM</h3>
        <p>Imaginează-ți că din cele 4 subrețele /26 una e pentru o legătură între două routere — are nevoie de <b>2</b> adrese, dar primește 62. Ai irosit 60 de adrese. Într-o rețea cu zeci de legături, risipa devine serioasă. Soluția: subrețele de dimensiuni diferite — VLSM.</p>
        <Analogy>FLSM e ca un parcare în care toate locurile sunt pentru autobuze: încape orice, dar o motocicletă ocupă un loc de autobuz.</Analogy>
      </Detailed>

      <Traps items={[
        <>Subrețele = 2^<b>s</b> (biți împrumutați); gazde = 2^<b>h</b> − 2 (biți de gazdă). Nu inversa formulele.</>,
        <>„Câte subrețele /27 încap într-un /24?” → 2^(27 − 24) = <b>8</b> (nu 6 — regula veche).</>,
      ]} />
      <InlineQuiz ids={['1.6-022', '1.6-023']} />
    </section>
  );
}

/* ======================================================================
   8. VLSM
   ====================================================================== */
export function Vlsm() {
  return (
    <section id="vlsm" className="section">
      <SectionHead id="vlsm" code="1.6 · VLSM" title="VLSM — fiecare subrețea pe măsura ei" />
      <Summary>
        <p><G id="vlsm" />: alegi pentru fiecare subrețea <b>cel mai mic bloc</b> care îi acoperă gazdele, apoi le plasezi <b>de la cea mai mare la cea mai mică</b>, fiecare la o adresă care e multiplu al propriei dimensiuni. Așa nu apar nici suprapuneri, nici găuri.</p>
      </Summary>

      <Detailed title="Explicația detaliată — exemplul complet 192.168.10.0/24">
        <p><b>Cerințe:</b> LAN-A cu 60 de gazde, LAN-B cu 28, LAN-C cu 12 și o legătură WAN între două routere (2 gazde). Ai la dispoziție 192.168.10.0/24.</p>
        <h4>Pasul 1 — dimensiunea fiecărei subrețele</h4>
        <Table head={['Subrețea', 'Gazde necesare', 'Cel mai mic h cu 2^h − 2 ≥ N', 'Prefix', 'Bloc']} rows={[
          ['LAN-A', '60', 'h = 6 → 62', '/26', '64'],
          ['LAN-B', '28', 'h = 5 → 30', '/27', '32'],
          ['LAN-C', '12', 'h = 4 → 14', '/28', '16'],
          ['WAN', '2', 'h = 2 → 2', '/30', '4'],
        ]} />
        <h4>Pasul 2 — sortează descrescător și alocă de la începutul blocului</h4>
        <Table head={['Subrețea', 'Rețea', 'Prima gazdă', 'Ultima gazdă', 'Broadcast', 'Gazde']} hlCol={1} rows={[
          ['LAN-A (60)', '192.168.10.0/26', '.1', '.62', '.63', '62'],
          ['LAN-B (28)', '192.168.10.64/27', '.65', '.94', '.95', '30'],
          ['LAN-C (12)', '192.168.10.96/28', '.97', '.110', '.111', '14'],
          ['WAN (2)', '192.168.10.112/30', '.113', '.114', '.115', '2'],
          ['liber', '192.168.10.116 – .255', '—', '—', '—', '140 de adrese pentru creștere'],
        ]} />
        <p>Fiecare rețea începe imediat după broadcast-ul precedentei: .63 → .64, .95 → .96, .111 → .112. Și fiecare start e multiplu al blocului propriu (0 de 64, 64 de 32, 96 de 16, 112 de 4).</p>
        <Figure caption="Interactiv: modifică cerințele, schimbă ordinea în „în ordinea din listă” și urmărește găurile hașurate. Folosește „Pasul următor” ca să vezi alocarea bloc cu bloc. Poți schimba și blocul de pornire (de exemplu 172.20.0.0/22).">
          <VlsmAllocator />
        </Figure>
        <Callout kind="warn" title="Ce se întâmplă dacă nu sortezi">
          Lista implicită din widget e intenționat în ordinea WAN, LAN-C, LAN-A, LAN-B. Alocată așa: WAN la .0/30, LAN-C nu poate începe la .4 (nu e multiplu de 16) → .16, gaură de 12; LAN-A nu poate începe la .32 (nu e multiplu de 64) → .64, gaură de 32. Totul încape până la .159, dar ai 44 de adrese pierdute în găuri și spațiul liber e fragmentat.
        </Callout>
        <h4>Variantă: /31 pentru WAN</h4>
        <p>Pe o legătură punct-la-punct poți folosi <b>/31</b> (192.168.10.112/31 → .112 și .113, ambele gazde). Economisești 2 adrese; detalii în secțiunea următoare. La examen, /30 rămâne răspunsul „clasic” pentru o legătură WAN, dacă întrebarea nu spune altfel.</p>
      </Detailed>

      <DeepDive title="Deep dive: sumarizarea (supernetting) — scurt">
        <p><G id="summarization" />-ul este operația inversă subnetting-ului: mai multe rețele contigue sunt anunțate ca una singură, mai scurtă. Ajută tabelele de rutare să rămână mici (exact ideea CIDR).</p>
        <Figure caption="Patru /24 consecutive au primii 22 de biți identici → rezumatul este 172.16.0.0/22.">
          <SummaryBits />
        </Figure>
        <ol>
          <li>Scrie în binar octetul în care rețelele diferă.</li>
          <li>Numără biții comuni din stânga (aici 16 + 6 = 22).</li>
          <li>Rezumatul = prima rețea cu noul prefix: <b>172.16.0.0/22</b>.</li>
        </ol>
        <p>Regula rapidă: numărul de rețele trebuie să fie o putere a lui 2 (2, 4, 8…), iar prima rețea un multiplu al acelui număr. 4 rețele = 2² → prefixul scade cu 2 (/24 → /22). Planul VLSM de mai sus e sumarizabil în întregime ca 192.168.10.0/24 — încă un motiv să-l ții contiguu. Sumarizarea se aplică practic în rutare (topicurile 3.x).</p>
      </DeepDive>

      <Traps items={[
        <>Alocă <b>cele mai mari primele</b>. Un /26 poate începe doar la .0, .64, .128, .192.</>,
        <>7 gazde nu încap într-un /29 (6 gazde) → <b>/28</b>. 30 de gazde încap exact într-un /27; 31 cer /26.</>,
        <>Nu uita legăturile WAN: fiecare are nevoie de propria subrețea.</>,
      ]} />
      <InlineQuiz ids={['1.6-024', '1.6-026', '1.6-027', '1.6-032']} />
    </section>
  );
}

/* ======================================================================
   9. /31 și /32
   ====================================================================== */
export function Edge() {
  return (
    <section id="edge" className="section">
      <SectionHead id="edge" code="1.6 · /31 /32" title="Cazurile limită: /30, /31 și /32" />
      <Summary>
        <p><b>/30</b> = 4 adrese, 2 gazde — forma clasică pentru o legătură între două routere. <b>/31</b> = 2 adrese, <b>ambele gazde</b> (RFC 3021) — doar pe legături punct-la-punct. <b>/32</b> = o singură adresă — pentru interfețe <G id="loopback" /> și rute către o singură gazdă.</p>
      </Summary>

      <Detailed>
        <Table head={['Prefix', 'Adrese', 'Gazde', 'Rețea / broadcast?', 'Utilizare tipică']} hlCol={0} rows={[
          ['/30', '4', '2', 'da / da', 'legătură WAN clasică între două routere'],
          ['/31', '2', '2', 'nu / nu', <>legătură <G id="point-to-point" /> (RFC 3021); economisește jumătate din adrese</>],
          ['/32', '1', '1', 'nu / nu', 'Loopback0, rută de gazdă, rutele L din tabela de rutare'],
        ]} />
        <h3>De ce /31 a apărut abia în 2000</h3>
        <p>O legătură între două routere are exact două capete. Cu /30, din 4 adrese 2 sunt „pierdute” pe rețea și broadcast — 50% risipă pe fiecare legătură. <G id="rfc" /> 3021 a observat că pe o legătură cu doar doi participanți broadcast-ul direcționat nu are sens și a definit ca, la /31, ambele adrese să fie gazde. Broadcast-ul, dacă e nevoie, se face doar cu 255.255.255.255.</p>
        <p>Pe IOS: <code>ip address 10.0.0.0 255.255.255.254</code> pe un capăt și <code>10.0.0.1 255.255.255.254</code> pe celălalt. Pe unele platforme IOS afișează un avertisment că /31 e potrivit doar pentru legături punct-la-punct. Cisco recomandă prudență la /31 pe segmente Ethernet obișnuite (cu mai mult de doi vecini posibili).</p>
        <h3>/32 — o singură adresă</h3>
        <p>O interfață Loopback nu are vecini; e o interfață virtuală, mereu up, folosită ca identitate stabilă a routerului (router ID OSPF, management). Îi dai o adresă /32: <code>interface Loopback0</code> → <code>ip address 10.255.255.1 255.255.255.255</code>. Aceeași logică explică rutele <b>L</b> (local) /32 pe care IOS le creează pentru fiecare adresă de interfață.</p>
      </Detailed>

      <Traps items={[
        <>„Câte gazde are /30?” → <b>2</b>, nu 4. „/31?” → <b>2</b> (punct-la-punct). „/32?” → <b>1</b>.</>,
        <>Formula 2^h − 2 nu se aplică la /31 și /32.</>,
        <><b>0.0.0.0/0</b> (rută implicită) este opusul lui /32: se potrivește cu orice destinație.</>,
      ]} />
      <InlineQuiz ids={['1.6-028', '1.6-029']} />
    </section>
  );
}

/* ======================================================================
   10. Adrese speciale
   ====================================================================== */
export function Special() {
  return (
    <section id="special" className="section">
      <SectionHead id="special" code="1.6 · speciale" title="Adrese IPv4 speciale" />
      <Summary>
        <p>Unele blocuri nu se dau gazdelor obișnuite: <b>127.0.0.0/8</b> (loopback), <b>169.254.0.0/16</b> (<G id="apipa" />), <b>224.0.0.0/4</b> (multicast), <b>240.0.0.0/4</b> (rezervat), <b>255.255.255.255</b> (broadcast limitat), <b>0.0.0.0/8</b> („această rețea”). Lista autoritară este registrul <G id="iana" /> „IPv4 Special-Purpose Address Registry”.</p>
      </Summary>

      <Detailed>
        <Table head={['Bloc', 'Nume', 'Standard', 'Ce trebuie să știi']} hlCol={0} rows={[
          ['0.0.0.0/8', '„This network”', 'RFC 791', '0.0.0.0 = „încă n-am adresă” (sursa unui DHCP DISCOVER). Nu confunda cu ruta implicită 0.0.0.0/0'],
          ['10.0.0.0/8', 'Private-Use', 'RFC 1918', <>privat (topicul 1.7, <G id="rfc1918" />)</>],
          ['100.64.0.0/10', 'Shared Address Space', 'RFC 6598', <>între ISP și clienți, pentru <G id="cgnat" />; NU este RFC 1918</>],
          ['127.0.0.0/8', 'Loopback', 'RFC 1122', '127.0.0.1 = „eu”; ping 127.0.0.1 testează doar stiva TCP/IP locală'],
          ['169.254.0.0/16', 'Link Local', 'RFC 3927', 'APIPA: clientul fără răspuns DHCP își alege singur o adresă, fără gateway'],
          ['172.16.0.0/12', 'Private-Use', 'RFC 1918', '172.16.0.0 – 172.31.255.255'],
          ['192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24', 'Documentation (TEST-NET-1/2/3)', 'RFC 5737', <>pentru exemple și documentație (<G id="test-net" />) — le folosim în laburi ca adrese „publice”</>],
          ['192.168.0.0/16', 'Private-Use', 'RFC 1918', 'cel mai folosit în rețelele de acasă'],
          ['224.0.0.0/4', 'Multicast (fosta clasă D)', 'RFC 5771', '224.0.0.5/6 = OSPF, 224.0.0.10 = EIGRP; nu se dau gazdelor'],
          ['240.0.0.0/4', 'Reserved (fosta clasă E)', 'RFC 1112', 'neutilizabil'],
          ['255.255.255.255/32', 'Limited Broadcast', 'RFC 919 / 8190', 'toate gazdele din segmentul local; routerele nu îl propagă niciodată'],
        ]} />
        <h3>Trei tipuri de „broadcast”, de nu le confunda</h3>
        <ul>
          <li><b>Limited broadcast</b> 255.255.255.255 — rămâne în segmentul local (folosit de DHCP).</li>
          <li><b>Directed broadcast</b> — broadcast-ul unei subrețele anume, de exemplu 192.168.10.63 pentru 192.168.10.0/26. Ar putea fi trimis de la distanță, dar routerele Cisco moderne nu îl mai transmit implicit (protecție împotriva atacurilor de tip „smurf”).</li>
          <li><b>Broadcast de nivel 2</b> — MAC-ul ff:ff:ff:ff:ff:ff (de exemplu cererile <G id="arp" />), ajunge în tot domeniul de broadcast.</li>
        </ul>
        <Callout kind="exam" title="Reflexe de depanare">
          <b>169.254.x.x</b> pe un PC = DHCP a eșuat. <b>ping 127.0.0.1</b> merge, dar ping la gateway nu = problema e în afara stivei (placă, cablu, VLAN, gateway). Detalii practice în 1.10.
        </Callout>
      </Detailed>

      <Traps items={[
        <><b>169.254/16</b> și <b>100.64/10</b> NU sunt adrese private RFC 1918.</>,
        <>Tot <b>127.0.0.0/8</b> este loopback, nu doar 127.0.0.1.</>,
        <>Adresele de documentație (192.0.2.0/24 etc.) nu sunt rutate în Internet — sunt alese tocmai ca exemplele să nu atingă rețele reale.</>,
      ]} />
      <InlineQuiz ids={['1.6-030', '1.6-031']} />
    </section>
  );
}
