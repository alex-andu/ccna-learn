import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { CwndChart, Encapsulation, OsiStack, PortsSockets, SegmentHeader, SlidingWindow, TcpLadder, TcpVsUdpTimeline } from '../../diagrams/t1_5';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';

/* ======================================================================
   0. Introducere — unde stă nivelul Transport
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.5" title="Nivelul Transport — imaginea de ansamblu" />
      <Summary>
        <p><G id="ipv4">IP</G>-ul duce un pachet de la un <b>calculator</b> la alt calculator. Dar pe un calculator rulează zeci de programe în același timp: browser, e-mail, Teams, actualizări.
          Nivelul <b>Transport</b> (L4) duce datele de la un <b>program</b> la alt program, folosind <G id="port">porturi</G>. Are două protocoale principale: <G id="tcp" /> — fiabil, cu conexiune — și <G id="udp" /> — rapid, fără conexiune și fără garanții.</p>
      </Summary>

      <Detailed>
        <h3>De ce avem nevoie de un nivel Transport</h3>
        <p>Imaginează-ți că deschizi o pagină web, primești un e-mail și asculți muzică online, toate în același timp. Toate pachetele ajung la aceeași adresă IP — a ta. Cine decide care pachet merge la browser și care la aplicația de muzică? Și cine observă că o bucată din pagină s-a pierdut pe drum și o cere din nou? Acestea sunt cele două mari sarcini ale nivelului 4:</p>
        <ul>
          <li><b>Livrarea la aplicația corectă</b> (<G id="multiplexing" />) — prin numere de port. Ambele protocoale, TCP și UDP, fac asta.</li>
          <li><b>Livrarea fiabilă</b> — confirmări, retransmisii, ordine, control al vitezei. Asta face <b>doar TCP</b>. UDP lasă aceste griji aplicației sau renunță la ele, în schimbul vitezei.</li>
        </ul>
        <Analogy>IP-ul este poștașul care aduce plicul la adresa blocului. Portul este numărul apartamentului. TCP este o scrisoare recomandată cu confirmare de primire: dacă nu primești confirmarea, retrimiți. UDP este o carte poștală: o arunci în cutie și speri să ajungă — ieftin și rapid, fără nicio garanție.</Analogy>

        <h3>Ce acoperă topicul 1.5</h3>
        <p>Obiectivul oficial este scurt — <i>Compare TCP to UDP</i> — și nu are sub-puncte cu litere. Ca să-l înveți bine, l-am împărțit în părți logice:</p>
        <Table head={['Cod Cisco', 'Parte', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['1.5', 'Imaginea de ansamblu', 'Unde stă L4 în modelele OSI și TCP/IP? Ce este încapsularea?'],
          ['1.5', 'Porturi și socket-uri', 'Cum ajung datele la programul corect?'],
          ['1.5', 'TCP — conexiunea', 'Cum arată header-ul TCP și cum se deschide/închide o conexiune?'],
          ['1.5', 'TCP — fiabilitatea', 'Cum garantează TCP livrarea? (seq/ack, retransmisie, windowing, congestion control)'],
          ['1.5', 'UDP', 'Ce face UDP și de ce e uneori alegerea mai bună?'],
          ['1.5', 'TCP vs UDP + porturi', 'Comparația completă și tabelul de porturi pentru examen'],
          ['extra', 'QUIC', 'Cum arată transportul modern (HTTP/3) — peste nivelul CCNA'],
        ]} />
        <Callout kind="info" title="De ce începem cu modelele OSI și TCP/IP?">
          Comparația TCP–UDP are sens doar dacă știi ce face nivelul de dedesubt (IP: best effort, fără garanții) și ce așteaptă aplicațiile de deasupra. Modelele de mai jos sunt „harta” pe care o vei folosi tot restul cursului.
        </Callout>

        <h3>Modelele OSI și TCP/IP</h3>
        <p>Modelul <G id="osi" /> (7 niveluri) este un model <b>de referință</b>: îl folosim ca să vorbim despre rețele („problemă de L1”, „switch L2”). Modelul <G id="tcpip-model" /> este cel după care sunt construite <b>protocoalele reale</b>. Materialele CCNA folosesc o variantă cu 5 niveluri, în care Application acoperă nivelurile OSI 5–7.</p>
        <Figure caption="Interactiv: atinge un nivel ca să vezi ce face, cum se numește PDU-ul lui și ce dispozitive lucrează acolo. Nivelul 4 este subiectul acestui topic.">
          <OsiStack />
        </Figure>
        <Callout kind="tip" title="Mnemonic pentru OSI (de jos în sus)">
          <b>P</b>lease <b>D</b>o <b>N</b>ot <b>T</b>hrow <b>S</b>ausage <b>P</b>izza <b>A</b>way → Physical, Data Link, Network, Transport, Session, Presentation, Application.
        </Callout>

        <h3>Încapsularea — cum „împachetează” fiecare nivel datele</h3>
        <p>Când trimiți date, ele coboară prin stivă. Fiecare nivel adaugă un <b>header</b> propriu (Ethernet adaugă și un trailer, <G id="fcs" />). Acest proces se numește <G id="encapsulation" />. La receptor, fiecare nivel citește și scoate header-ul „lui”, apoi predă restul nivelului de deasupra (decapsulare). Unitatea de date a fiecărui nivel se numește <G id="pdu" />:</p>
        <Table head={['Nivel', 'PDU', 'Header-ul adăugat conține…']} hlCol={1} rows={[
          ['L4 Transport', <><G id="segment" /> (TCP) / <G id="datagram">datagramă</G> (UDP)</>, 'porturi; la TCP și seq/ack, flags, window'],
          ['L3 Network', 'pachet', <>adrese IP, <G id="ttl" />, câmpul Protocol (6 = TCP, 17 = UDP)</>],
          ['L2 Data Link', <G id="frame">cadru (frame)</G>, <>adrese <G id="mac" />, EtherType; trailer FCS</>],
          ['L1 Physical', 'biți', 'semnal (electric, optic, radio)'],
        ]} />
        <Figure caption="Interactiv: parcurge încapsularea pas cu pas și comută între TCP și UDP. Observă că pachetul IP are exact 1500 B — MTU-ul Ethernet — și de aici vine MSS-ul de 1460 B.">
          <Encapsulation />
        </Figure>

        <h3>Puțină istorie: de ce există două protocoale</h3>
        <p>La început (Cerf și Kahn, 1974) exista un singur protocol, „TCP”, care făcea și rutarea, și fiabilitatea. Inginerii au observat repede că nu toate aplicațiile vor fiabilitate: pentru voce, de exemplu, un pachet care ajunge târziu este inutil, iar retransmisia doar încurcă. La sfârșitul anilor ’70, protocolul a fost împărțit în <b>IP</b> (rutare, best effort) și <b>TCP</b> (fiabilitate), iar alături a apărut <b>UDP</b> (<G id="rfc" /> 768, 1980) — o „ușă subțire” către IP pentru aplicațiile care vor să decidă singure. TCP a fost specificat în RFC 793 (1981), înlocuit în 2022 de RFC 9293.</p>
      </Detailed>

      <DeepDive title="Deep dive: cum știe fiecare nivel cui să predea datele">
        <p>Decapsularea funcționează ca un lanț de „etichete” care spun ce urmează:</p>
        <ul>
          <li><b>L2 → L3:</b> câmpul <code>EtherType</code> din header-ul Ethernet: <code>0x0800</code> = IPv4, <code>0x86DD</code> = IPv6, <code>0x0806</code> = ARP.</li>
          <li><b>L3 → L4:</b> câmpul <code>Protocol</code> (IPv4) sau <code>Next Header</code> (IPv6): <code>6</code> = TCP, <code>17</code> = UDP, <code>1</code> = ICMP, <code>89</code> = OSPF.</li>
          <li><b>L4 → aplicație:</b> portul destinație (80 → serverul web, 53 → serverul DNS).</li>
        </ul>
        <p>De aceea un switch L2 nu trebuie să înțeleagă IP-ul, iar un router nu trebuie să înțeleagă HTTP-ul: fiecare citește doar până la nivelul de care are nevoie. Un firewall <G id="stateful" /> sau un dispozitiv <G id="nat" />/<G id="pat" /> citește însă și header-ul L4 (porturile).</p>
      </DeepDive>

      <Traps items={[
        <>PDU-ul L4 = <b>segment</b>; L3 = <b>pachet</b>; L2 = <b>cadru</b>; L1 = <b>biți</b>. Cisco spune adesea „segment” și pentru UDP.</>,
        <>TCP și UDP sunt la <b>L4 (Transport)</b> în ambele modele. IP și ICMP sunt la L3.</>,
        <>În modelul TCP/IP, nivelurile OSI 5, 6 și 7 sunt <b>un singur nivel</b>: Application.</>,
        <>Încapsularea merge <b>de sus în jos</b> la emițător; decapsularea, <b>de jos în sus</b> la receptor.</>,
      ]} />
      <InlineQuiz ids={['1.5-001', '1.5-002', '1.5-004', '1.5-005']} />
    </section>
  );
}

/* ======================================================================
   1. Porturi și socket-uri
   ====================================================================== */
export function Ports() {
  return (
    <section id="ports" className="section">
      <SectionHead id="ports" code="1.5" title="Porturi și socket-uri — cum ajung datele la programul corect" />
      <Summary>
        <p>Un <G id="port" /> este un număr pe 16 biți (0–65535) din header-ul TCP/UDP care identifică aplicația. Serverele ascultă pe porturi <G id="well-known-port">well-known</G> (80, 443, 53…), iar clienții folosesc ca sursă porturi <G id="ephemeral-port">efemere</G>, alese temporar de sistemul de operare.
          IP + protocol + port = <G id="socket" />; cele 5 valori ale unei conexiuni (<G id="five-tuple" />) o identifică unic.</p>
      </Summary>
      <Detailed>
        <h3>Multiplexarea</h3>
        <p>Fiecare segment are <b>două</b> porturi: <b>sursă</b> (cine trimite) și <b>destinație</b> (cui îi este adresat). Receptorul citește portul destinație și predă datele programului care „ascultă” pe acel port. Așa pot rula simultan, pe aceeași adresă IP, un server web (80/443), unul SSH (22) și unul DNS (53). Procesul se numește <G id="multiplexing" /> și este <b>singura funcție de transport pe care o au și TCP, și UDP</b>.</p>
        <Figure caption="Interactiv: atinge o aplicație ca să vezi 5-tuple-ul conexiunii ei. Cele două tab-uri merg la același server și același port; le deosebește doar portul sursă.">
          <PortsSockets />
        </Figure>

        <h3>Intervalele de porturi</h3>
        <Table head={['Interval', 'Nume (IANA, RFC 6335)', 'Cine le folosește', 'Exemple']} hlCol={0} rows={[
          ['0 – 1023', 'System / Well-known', 'servicii standard, pe servere', '22 SSH, 53 DNS, 80 HTTP, 443 HTTPS'],
          ['1024 – 49151', 'User / Registered', 'aplicații înregistrate la IANA', '1812 RADIUS, 3389 RDP, 5246 CAPWAP'],
          ['49152 – 65535', 'Dynamic / Private / Ephemeral', 'porturi sursă temporare ale clienților; nu se alocă niciodată', '51000, 62513…'],
        ]} />
        <p>Organizația care ține evidența porturilor este <G id="iana" />. Sistemele de operare aleg singure intervalul efemer: <b>Windows</b> (Vista și ulterior) folosește 49152–65535, la fel ca recomandarea IANA, dar <b>Linux</b> folosește implicit 32768–60999. La examen, dacă se cere „intervalul efemer”, răspunsul așteptat este cel IANA.</p>

        <h3>Client și server: cine ce port folosește</h3>
        <ol>
          <li>Serverul web pornește și deschide un socket în starea <b>LISTEN</b> pe TCP 443.</li>
          <li>Browserul tău cere sistemului de operare o conexiune spre 203.0.113.10:443. SO-ul alege un port sursă liber, de exemplu <b>51000</b>.</li>
          <li>Cererea pleacă: <code>192.168.1.10:51000 → 203.0.113.10:443</code>.</li>
          <li>Răspunsul vine <b>inversat</b>: <code>203.0.113.10:443 → 192.168.1.10:51000</code>. Portul well-known devine acum portul <b>sursă</b>.</li>
        </ol>
        <Callout kind="exam" title="De ce contează inversarea porturilor">
          La ACL-uri (5.6) și firewall-uri, traficul de întoarcere are portul serviciului ca <b>sursă</b>. O regulă scrisă „permit tcp any any eq 80” prinde cererile spre servere web, nu și răspunsurile acestora.
        </Callout>

        <h3>Socket și 5-tuple</h3>
        <p>Un <G id="socket" /> este un capăt de comunicație: <code>IP + protocol + port</code>, de exemplu <code>192.168.1.10:51000/TCP</code>. O conexiune TCP este o <b>pereche de socket-uri</b>, adică un <G id="five-tuple" />: protocol, IP sursă, port sursă, IP destinație, port destinație. Dacă oricare dintre cele cinci valori diferă, e altă conexiune. TCP 53 și UDP 53 sunt porturi complet separate — protocolul face parte din identitate.</p>
        <Analogy>Adresa IP este clădirea, portul este biroul, iar protocolul este „ușa” (TCP sau UDP). Socket-ul este adresa completă a unui birou: „Strada X nr. 10, intrarea TCP, biroul 443”. O conexiune este o convorbire telefonică între două birouri anume.</Analogy>
      </Detailed>
      <DeepDive title="Deep dive: porturi, NAT și firewall-uri stateful">
        <p><G id="pat" /> (NAT overload, 1.7) folosește tocmai porturile sursă ca să ascundă sute de host-uri în spatele unei singure adrese publice: routerul ține o tabelă de traducere <code>IP privat:port ↔ IP public:port</code>. Un firewall <G id="stateful" /> reține 5-tuple-ul fiecărei conexiuni deschise din interior și lasă să intre doar segmentele care se potrivesc unei conexiuni existente. Pentru UDP, care nu are conexiune, ambele dispozitive „inventează” o sesiune pe baza 5-tuple-ului și a unui timer de inactivitate.</p>
      </DeepDive>
      <Traps items={[
        <>Porturile au <b>16 biți</b>: 0–65535. Well-known: <b>0–1023</b>; ephemeral (IANA): <b>49152–65535</b>.</>,
        <>Clientul folosește port <b>sursă efemer</b> și port <b>destinație well-known</b>. În răspuns se inversează.</>,
        <>Socket = IP + protocol + port (nu include MAC-ul).</>,
        <>Multiplexarea prin porturi e oferită de <b>ambele</b> protocoale — nu e o diferență între TCP și UDP.</>,
      ]} />
      <InlineQuiz ids={['1.5-006', '1.5-008', '1.5-011', '1.5-009']} />
    </section>
  );
}

/* ======================================================================
   2. TCP — header, deschidere, închidere
   ====================================================================== */
export function TcpConnection() {
  return (
    <section id="tcp-conn" className="section">
      <SectionHead id="tcp-conn" code="1.5" title="TCP — header-ul și ciclul de viață al unei conexiuni" />
      <Summary>
        <p><G id="tcp" /> este <b>orientat pe conexiune</b>: înainte de date, cele două capete fac un <G id="three-way-handshake" /> (<G id="syn" /> → SYN-ACK → ACK) în care își sincronizează numerele de secvență. La final, fiecare direcție se închide separat cu <G id="fin" /> și ACK; o închidere bruscă se face cu <G id="rst" />.
          Header-ul TCP are minimum <b>20 B</b> (maximum 60 B cu opțiuni).</p>
      </Summary>
      <Detailed title="Explicația detaliată — 1. Header-ul TCP">
        <p>Fiecare câmp din header există pentru o funcție anume. Atinge câmpurile ca să afli rolul fiecăruia:</p>
        <Figure caption="Interactiv: structura header-ului TCP (20 B fără opțiuni). Comută pe UDP ca să vezi cât de simplu este acela.">
          <SegmentHeader initial="tcp" />
        </Figure>
        <Table head={['Câmp(uri)', 'Funcția TCP pe care o servește']} rows={[
          ['Source / Destination Port', 'multiplexare (comună cu UDP)'],
          [<><G id="sequence-number" /> / <G id="ack-number" /></>, 'livrare în ordine, detectarea pierderilor, retransmisie'],
          ['Flags (SYN, ACK, FIN, RST, PSH…)', 'deschiderea și închiderea conexiunii, semnalizare'],
          ['Window', <><G id="flow-control" /> (<G id="windowing" />)</>],
          [<G id="checksum" />, 'detectarea erorilor (obligatoriu în TCP)'],
          ['Options', <>de exemplu <G id="mss" />, Window Scale, SACK</>],
        ]} />

        <h3>2. Deschiderea conexiunii — 3-way handshake</h3>
        <p>Înainte de primul octet de date, clientul și serverul trebuie să se pună de acord asupra numerelor de la care încep să numere octeții (fiecare alege un <G id="isn" /> propriu) și asupra unor parametri (MSS, window). Sunt necesare trei segmente, pentru că fiecare parte trebuie să-și trimită ISN-ul <b>și</b> să primească o confirmare pentru el; serverul combină confirmarea și propriul SYN într-un singur segment.</p>
        <Figure caption="Interactiv: parcurge handshake-ul pas cu pas. Încearcă să ghicești ack-ul înainte să apară. Stările TCP ale fiecărei părți se schimbă sus.">
          <TcpLadder initial="open" />
        </Figure>
        <Callout kind="tip" title="Regula de aur pentru calcule">
          <b>ack = seq + lungimea datelor</b>. <b>SYN și FIN contează fiecare ca 1 octet</b>, deși nu poartă date. Deci SYN seq=1000 → ack=1001.
        </Callout>
        <p>Rezultatul handshake-ului e o conexiune <b>full-duplex</b>: fiecare direcție are propria numerotare. Ce poate merge prost:</p>
        <ul>
          <li><b>SYN fără răspuns</b> → clientul retransmite SYN-ul de câteva ori, apoi raportează timeout. Tipic pentru un firewall care aruncă pachetul sau un host inexistent.</li>
          <li><b>SYN → RST</b> → pe acel port nu ascultă nimeni („connection refused”).</li>
        </ul>

        <h3>3. Închiderea conexiunii — FIN, ACK, FIN, ACK</h3>
        <p>TCP închide <b>fiecare direcție separat</b>. Cine a terminat de trimis spune <G id="fin" />; cealaltă parte confirmă, termină ce mai are de trimis, apoi trimite și ea FIN. Rezultă 4 segmente (sau 3, dacă al doilea și al treilea sunt combinate într-un FIN+ACK). Partea care închide prima rămâne o vreme în <G id="time-wait" />.</p>
        <Figure caption="Selectează scenariul „Închidere (FIN)”. Observă stările FIN-WAIT, CLOSE-WAIT, LAST-ACK și TIME-WAIT.">
          <TcpLadder initial="close" />
        </Figure>
        <Table head={['Flag', 'Când apare', 'Efect']} hlCol={0} rows={[
          [<G id="syn" />, 'primele 2 segmente', 'deschide conexiunea, poartă ISN-ul și MSS-ul'],
          ['ACK', 'toate segmentele de după primul SYN', 'câmpul Acknowledgment Number e valid'],
          [<G id="fin" />, 'la final, câte unul pe fiecare direcție', 'închidere grațioasă: datele trimise deja se livrează'],
          [<G id="rst" />, 'port închis, aplicație care abandonează, segment care nu aparține unei conexiuni', 'închidere imediată; datele netrimise se pierd'],
          ['PSH', 'de obicei la ultimul segment al unui mesaj', 'predă imediat datele aplicației'],
        ]} />
        <Analogy>Handshake-ul seamănă cu începutul unei convorbiri telefonice: „Alo, mă auzi?” (SYN) — „Da, te aud. Tu mă auzi?” (SYN-ACK) — „Da!” (ACK). Închiderea: „Eu am terminat.” — „Bine, am înțeles… mai am ceva de spus… gata, am terminat și eu.” — „OK, pa!” RST-ul e ca atunci când închizi brusc telefonul.</Analogy>
      </Detailed>
      <DeepDive title="Deep dive: cele 11 stări TCP și atacul SYN flood">
        <p>Specificația TCP definește o mașină de stări: <code>CLOSED, LISTEN, SYN-SENT, SYN-RECEIVED, ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, CLOSING, LAST-ACK, TIME-WAIT</code>. <code>CLOSING</code> apare doar la închiderea simultană (ambele părți trimit FIN în același timp).</p>
        <p><b>De ce ISN-ul e aleatoriu?</b> Dacă ar porni mereu de la 0, segmente întârziate dintr-o conexiune veche (cu același 5-tuple) ar putea fi acceptate într-una nouă, iar un atacator ar putea ghici numerele și injecta date false. Wireshark îți afișează implicit numere „relative” (ISN = 0) doar ca să fie ușor de citit.</p>
        <p><b>SYN flood:</b> un atacator trimite mii de SYN-uri cu adrese sursă false. Serverul alocă resurse pentru fiecare conexiune „pe jumătate deschisă” (SYN-RECEIVED) și așteaptă ACK-uri care nu vin, până rămâne fără memorie. Apărări: SYN cookies, limitarea ratei, firewall-uri/IPS (5.x).</p>
        <p><b>TIME-WAIT:</b> durează 2 × MSL (Maximum Segment Lifetime, 2 minute în specificație; Linux folosește 60 de secunde, iar Windows are o valoare configurabilă). Garantează că, dacă ACK-ul final se pierde, FIN-ul retransmis de cealaltă parte primește răspuns.</p>
      </DeepDive>
      <Traps items={[
        <>Ordinea handshake-ului: <b>SYN → SYN-ACK → ACK</b>. Închiderea: <b>FIN → ACK → FIN → ACK</b>.</>,
        <>SYN și FIN <b>consumă câte un număr de secvență</b>; un ACK simplu, fără date, nu.</>,
        <>Header TCP: <b>20 B minimum</b>, 60 B maximum. Nu confunda cu UDP (8 B).</>,
        <>RST = închidere bruscă sau port închis. Lipsa oricărui răspuns la SYN = de obicei un firewall.</>,
        <>„Connection-oriented” <b>nu</b> înseamnă că există un circuit fizic: conexiunea există doar în memoria celor două host-uri. Routerele de pe drum nu știu de ea.</>,
      ]} />
      <InlineQuiz ids={['1.5-012', '1.5-013', '1.5-017', '1.5-043']} />
    </section>
  );
}

/* ======================================================================
   3. TCP — fiabilitate: seq/ack, retransmisie, windowing, congestion
   ====================================================================== */
export function Reliability() {
  return (
    <section id="reliability" className="section">
      <SectionHead id="reliability" code="1.5" title="TCP — cum garantează livrarea: seq/ack, retransmisie, windowing" />
      <Summary>
        <p>TCP numerotează <b>fiecare octet</b> (<G id="sequence-number" />). Receptorul confirmă cumulativ „următorul octet pe care îl aștept” (<G id="ack-number" />). Ce nu e confirmat se <b>retransmite</b> (după <G id="rto" /> sau după 3 duplicate ACK-uri).
          <G id="windowing" /> permite mai multe segmente „în zbor” și, prin câmpul Window, protejează receptorul (<G id="flow-control" />); <G id="congestion-control" /> protejează rețeaua.</p>
      </Summary>
      <Detailed title="Explicația detaliată — 1. Sequence și acknowledgment, pe un exemplu cu numere">
        <p>Continuăm conexiunea de mai sus (clientul a început cu ISN=1000, serverul cu ISN=5000). Pe Ethernet, un segment poartă cel mult <G id="mss" /> = 1460 de octeți de date.</p>
        <Figure caption="Interactiv: scenariul „Transfer de date”. Urmărește cum seq-ul crește cu lungimea datelor și cum un singur ACK le confirmă pe mai multe.">
          <TcpLadder initial="data" />
        </Figure>
        <Table head={['Segment', 'seq', 'len', 'ack primit înapoi', 'Calcul']} rows={[
          ['client → server', '1001', '1460', '2461', '1001 + 1460'],
          ['client → server', '2461', '1000', '—', '(încă neconfirmat)'],
          ['client → server', '3461', '1000', '4461', '3461 + 1000 — confirmă cumulativ ambele'],
          ['server → client', '5001', '500', '5501', 'direcția inversă are numerotarea ei'],
        ]} />
        <p>Ce obține TCP din numerotare:</p>
        <ul>
          <li><b>Ordine</b> — receptorul reașază segmentele după seq, chiar dacă au venit pe trasee diferite.</li>
          <li><b>Detectarea pierderilor</b> — o „gaură” în numerotare înseamnă că lipsește ceva.</li>
          <li><b>Eliminarea duplicatelor</b> — un segment cu octeți deja primiți e recunoscut și aruncat.</li>
          <li><b>Segmentarea</b> — aplicația dă un flux de octeți oricât de mare; TCP îl taie în segmente și îl recompune.</li>
        </ul>

        <h3>2. Retransmisia</h3>
        <p>Pentru fiecare segment trimis, emițătorul pornește un timer (<G id="rto" />), calculat din timpul dus-întors măsurat (RTT). Dacă ACK-ul nu vine la timp, retransmite segmentul și dublează timer-ul (exponential backoff). Există și o cale mai rapidă: <G id="fast-retransmit" />.</p>
        <Figure caption="Interactiv: scenariul „Pierdere + fast retransmit”. Un segment se pierde; receptorul repetă ack-ul (duplicate ACK). La al treilea duplicat, emițătorul retransmite imediat.">
          <TcpLadder initial="loss" />
        </Figure>
        <Callout kind="info" title="Simplificare în diagramă">
          Pentru claritate, serverul confirmă fiecare segment. În realitate, receptorul trimite adesea un ACK la fiecare două segmente (delayed ACK), dar segmentele care sosesc după o „gaură” sunt confirmate imediat — exact ce produce duplicate ACK-urile.
        </Callout>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Windowing și flow control">
        <p>Dacă emițătorul ar aștepta confirmarea după fiecare segment, pe o legătură cu RTT de 100 ms ar trimite doar 10 segmente pe secundă — oricât de rapidă ar fi legătura. Soluția este <b>fereastra glisantă</b> (<G id="windowing" />): emițătorul poate avea în zbor (trimiși, dar neconfirmați) atâția octeți câți permite fereastra. Pe măsură ce sosesc ACK-uri, fereastra „glisează” înainte.</p>
        <Figure caption="Interactiv: alege mărimea ferestrei, trimite segmente și primește ACK-uri (sau apasă Auto). Cu fereastra 1, aștepți după fiecare segment; cu 6, trimiți mult mai mult pe RTT. Window = 0 oprește emițătorul.">
          <SlidingWindow />
        </Figure>
        <p>Cine stabilește mărimea ferestrei? <b>Receptorul</b>, prin câmpul <code>Window</code> din fiecare segment pe care îl trimite: „mai am loc în buffer pentru X octeți” (receive window, rwnd). Acesta este <G id="flow-control" />: un server rapid nu poate îneca un telefon lent.</p>
        <ul>
          <li>Fereastră mare → multe date în zbor → transfer eficient.</li>
          <li>Aplicația receptoare citește încet → buffer-ul se umple → fereastra scade.</li>
          <li><b>Window = 0</b> → emițătorul se oprește și trimite rar „window probes” până când fereastra se redeschide.</li>
        </ul>
        <Analogy>Fereastra e ca o bandă rulantă între doi muncitori: cel care împachetează poate pune pe bandă oricâte cutii încap, fără să aștepte ca fiecare să fie ridicată. Dacă cel de la capăt se mișcă încet și strigă „mai am loc doar pentru 2!”, primul încetinește.</Analogy>

        <h3>4. Congestion control — protejarea rețelei</h3>
        <p>Receptorul poate fi foarte rapid, dar un link de pe drum poate fi aglomerat. Dacă toți emițătorii ar trimite cât permite receptorul, cozile routerelor s-ar umple și ar arunca pachete. De aceea emițătorul ține și o <b>fereastră de congestie</b> (cwnd), care <b>nu apare în header</b> — e o estimare internă a capacității rețelei. Poate trimite cel mult <b>min(rwnd, cwnd)</b>.</p>
        <Figure caption="Evoluție tipică a cwnd (didactic, TCP Reno, pornind de la 1 MSS): slow start, apoi creștere liniară; reacții diferite la 3 duplicate ACK-uri și la timeout.">
          <CwndChart />
        </Figure>
        <Table head={['Fază / eveniment', 'Ce face cwnd', 'De ce']} rows={[
          [<G id="slow-start" />, 'se dublează la fiecare RTT', 'sondează rapid capacitatea, pornind de la o valoare mică'],
          ['Congestion avoidance (peste ssthresh)', '+1 MSS la fiecare RTT', 'se apropie prudent de limită'],
          ['3 duplicate ACK-uri', 'se înjumătățește (fast recovery)', 'o pierdere izolată: rețeaua încă livrează'],
          ['Timeout (RTO)', 'revine la minim, apoi slow start', 'semn de congestie gravă'],
        ]} />
        <Table head={['', 'Flow control', 'Congestion control']} rows={[
          ['Protejează', 'receptorul', 'rețeaua'],
          ['Variabila', 'rwnd — câmpul Window din header', 'cwnd — internă emițătorului, nu circulă pe fir'],
          ['Cine o stabilește', 'receptorul (spațiul liber din buffer)', 'emițătorul (din ACK-uri și pierderi)'],
          ['Standard', 'RFC 9293', 'RFC 5681'],
        ]} />
      </Detailed>

      <DeepDive title="Deep dive: MSS vs MTU, Window Scale, SACK">
        <p><b>MSS vs <G id="mtu" />:</b> MTU este cel mai mare pachet IP pe care îl poate purta o legătură (1500 B pe Ethernet). MSS = MTU − header IP − header TCP = 1500 − 20 − 20 = <b>1460</b> (IPv4). Dacă partenerul nu anunță MSS, TCP folosește implicit 536 B pentru IPv4 (576 − 40) și 1220 B pentru IPv6 (1280 − 60). Pe tuneluri (PPPoE adaugă 8 B, GRE/IPsec mai mult), MTU-ul real scade; routerele Cisco pot rescrie MSS-ul din SYN-uri cu <code>ip tcp adjust-mss 1452</code> pe interfață, ca să evite fragmentarea.</p>
        <p><b>Window Scale (RFC 7323):</b> câmpul Window are 16 biți, deci maximum 65.535 B. Pe o legătură de 1 Gbps cu RTT 50 ms, ar trebui ≈6 MB în zbor ca să umpli legătura (produsul bandwidth × delay). Opțiunea Window Scale, negociată în SYN, înmulțește valoarea cu 2<sup>n</sup> (n ≤ 14) → până la ≈1 GiB.</p>
        <p><b>SACK (Selective Acknowledgment, RFC 2018):</b> ACK-ul clasic e cumulativ și nu poate spune „am primit 6461–9460, îmi lipsește doar 5461”. SACK adaugă această informație ca opțiune, ca emițătorul să retransmită doar găurile. Este activat implicit în sistemele moderne.</p>
        <p><b>Algoritmi moderni:</b> Linux folosește implicit CUBIC, Windows tot CUBIC în versiunile recente; Google a dezvoltat BBR, care estimează direct lățimea de bandă și RTT-ul în loc să reacționeze doar la pierderi. Fereastra inițială modernă este de 10 MSS (RFC 6928), nu 1.</p>
      </DeepDive>
      <Traps items={[
        <><b>ACK = următorul octet așteptat</b>, nu ultimul primit. seq=1001 + 500 B → ack=1501.</>,
        <>TCP numără <b>octeți</b>, nu segmente — și Window-ul e tot în octeți.</>,
        <><b>Windowing = flow control</b> (receptorul). Congestion control (cwnd) e alt mecanism, pentru rețea.</>,
        <>3 duplicate ACK-uri → <b>fast retransmit</b> (fără să aștepte timer-ul).</>,
        <>Fereastra este <b>dinamică</b>: crește fără pierderi, scade la pierderi sau când receptorul e încărcat.</>,
        <>MSS (1460) ≠ MTU (1500). MSS numără doar datele TCP.</>,
      ]} />
      <InlineQuiz ids={['1.5-020', '1.5-022', '1.5-024', '1.5-028']} />
    </section>
  );
}

/* ======================================================================
   4. UDP
   ====================================================================== */
export function Udp() {
  return (
    <section id="udp" className="section">
      <SectionHead id="udp" code="1.5" title="UDP — simplu, rapid, fără garanții" />
      <Summary>
        <p><G id="udp" /> trimite <G id="datagram">datagrame</G> independente, fără conexiune, fără confirmări, fără ordine și fără retransmisii (<G id="best-effort" />). Header-ul are doar <b>8 B</b>: două porturi, lungimea și un <G id="checksum" />.
          E alegerea potrivită când <b>întârzierea contează mai mult decât pierderile</b> (voce, video live), când mesajele sunt mici (DNS), când trebuie broadcast/multicast (DHCP) sau când aplicația își face singură fiabilitatea (TFTP, QUIC).</p>
      </Summary>
      <Detailed>
        <h3>Header-ul UDP</h3>
        <Figure caption="Interactiv: header-ul UDP — doar 4 câmpuri. Comută pe TCP pentru comparație.">
          <SegmentHeader initial="udp" />
        </Figure>
        <p>Asta e tot. UDP nu are seq, ack, window sau flags. Ce face, de fapt: pune porturile (ca datele să ajungă la aplicația corectă), lungimea și un checksum. Restul îl preia direct de la IP: livrare „cât se poate”.</p>

        <h3>De ce ar alege cineva un protocol fără garanții?</h3>
        <Table head={['Avantaj UDP', 'Explicație', 'Exemplu']} rows={[
          ['Fără handshake', 'prima datagramă poartă deja date → răspuns după 1 RTT, nu 2', <><G id="dns" />: o întrebare, un răspuns</>],
          ['Fără retransmisii', 'un pachet întârziat de voce este inutil; mai bine îl sari', <><G id="voip" /> prin <G id="rtp" /></>],
          ['Fără flow/congestion control', 'fluxul pleacă la ritmul cerut de aplicație (de ex. un pachet la 20 ms)', 'voce, video live, jocuri online'],
          ['Header mic (8 B)', 'overhead mic pentru mesaje mici', <><G id="snmp" />, <G id="syslog" />, <G id="ntp" /></>],
          ['Broadcast și multicast', 'TCP cere o conexiune unu-la-unu; UDP poate trimite „tuturor”', <><G id="dhcp" /> (Discover spre 255.255.255.255), streaming multicast</>],
          ['Fără stare pe server', 'serverul nu ține conexiuni deschise → poate servi foarte mulți clienți', 'servere DNS publice'],
        ]} />
        <Figure caption="TCP are nevoie de un tur complet (SYN, SYN-ACK) înainte să poată trimite cererea. UDP trimite imediat.">
          <TcpVsUdpTimeline />
        </Figure>

        <h3>„Fiabilitate făcută de aplicație”</h3>
        <p>Faptul că UDP nu garantează nimic nu înseamnă că aplicațiile peste UDP pierd date. Multe își construiesc singure exact cât le trebuie:</p>
        <ul>
          <li><b><G id="tftp" /></b> trimite fișierul în blocuri de 512 B; fiecare bloc trebuie confirmat înainte de următorul (lock-step). Fiabil, dar lent — e o fereastră de 1.</li>
          <li><b><G id="dns" /></b>: dacă răspunsul nu vine într-un interval scurt, clientul repetă întrebarea (eventual la alt server).</li>
          <li><b><G id="rtp" /></b> (voce/video) adaugă numere de secvență și timestamp ca să reordoneze și să redea fluent, dar nu retransmite.</li>
          <li><b><G id="quic" /></b> reimplementează complet fiabilitatea TCP, plus criptarea, peste UDP (vezi ultima secțiune).</li>
        </ul>
        <Analogy>TCP e un curier care îți cere semnătura pentru fiecare colet și revine dacă nu ești acasă. UDP e un fluturaș pus în cutia poștală: dacă e important, cel care l-a trimis te sună după o vreme să întrebe dacă l-ai primit — fiabilitatea vine de la el, nu de la poștă.</Analogy>
      </Detailed>
      <DeepDive title="Deep dive: checksum-ul UDP, pseudo-header și dimensiunea maximă">
        <p>Checksum-ul UDP (ca și cel TCP) acoperă și un <b>pseudo-header</b> cu adresele IP sursă/destinație, protocolul și lungimea — ca o datagramă livrată la adresa greșită să fie detectată. În IPv4 checksum-ul UDP este <b>opțional</b> (valoarea 0 înseamnă „necalculat”; un rezultat calculat egal cu 0 se transmite ca 0xFFFF). În <G id="ipv6" />, unde header-ul IP nu mai are checksum propriu, checksum-ul UDP devine obligatoriu.</p>
        <p>Câmpul Length are 16 biți, deci o datagramă poate avea teoretic până la 65.535 B (≈65.507 B de date peste IPv4). În practică, o datagramă mai mare decât MTU-ul este fragmentată de IP, iar pierderea unui singur fragment pierde toată datagrama — de aceea aplicațiile UDP trimit de obicei mesaje mici. DNS clasic limita răspunsurile UDP la 512 B; extensia EDNS(0) permite valori mai mari.</p>
      </DeepDive>
      <Traps items={[
        <>Header UDP = <b>8 B</b>, fix: Source Port, Destination Port, Length, Checksum.</>,
        <>UDP <b>are</b> checksum (detecție de erori), dar <b>nu</b> are recuperare. „UDP nu verifică erorile” e fals.</>,
        <>UDP <b>nu</b> are flow control, sequencing, acknowledgments sau handshake.</>,
        <>„Nesigur” (unreliable) ≠ „nesecurizat”: niciunul dintre TCP și UDP nu criptează. Criptarea vine de la TLS, SSH, IPsec.</>,
        <>Broadcast și multicast merg <b>doar peste UDP</b>.</>,
      ]} />
      <InlineQuiz ids={['1.5-029', '1.5-030', '1.5-032', '1.5-034']} />
    </section>
  );
}

/* ======================================================================
   5. Comparație + tabel porturi
   ====================================================================== */
export function Compare() {
  return (
    <section id="compare" className="section">
      <SectionHead id="compare" code="1.5" title="TCP vs UDP — comparația completă și porturile de examen" />
      <Summary>
        <p>TCP = <b>connection-oriented, reliable</b>: handshake, sequencing, acknowledgments, retransmisii, windowing, header 20–60 B. UDP = <b>connectionless, best effort</b>: fără toate acestea, header 8 B, latență mică.
          La examen trebuie să asociezi fiecare protocol de aplicație uzual cu transportul și portul lui.</p>
      </Summary>
      <Detailed>
        <h3>Tabelul comparativ</h3>
        <Table head={['Caracteristică', 'TCP', 'UDP']} rows={[
          ['Tip', 'connection-oriented (3-way handshake)', 'connectionless'],
          ['Fiabilitate', 'da: ACK + retransmisie', <>nu (<G id="best-effort" />)</>],
          ['Ordine', 'da: sequence numbers', 'nu'],
          ['Duplicate', 'eliminate', 'posibile'],
          ['Flow control', 'da: windowing (câmpul Window)', 'nu'],
          ['Congestion control', 'da: slow start, congestion avoidance…', 'nu (aplicația e responsabilă)'],
          ['Detectarea erorilor', 'checksum obligatoriu', 'checksum (opțional în IPv4, obligatoriu în IPv6)'],
          ['Header', '20–60 B', '8 B'],
          ['Multiplexare (porturi)', 'da', 'da'],
          ['Segmentare', 'da: fluxul e tăiat la MSS', 'nu: o datagramă = un mesaj al aplicației'],
          ['Unicast / broadcast / multicast', 'doar unicast', 'toate'],
          ['Latență la început', 'cel puțin 1 RTT pentru handshake', 'zero — pleacă imediat'],
          ['Număr protocol IP', '6', '17'],
          ['PDU', 'segment', 'datagramă'],
          ['Aplicații tipice', 'web, e-mail, SSH, transfer de fișiere', 'DNS, DHCP, voce/video, SNMP, Syslog, TFTP, NTP'],
        ]} />
        <Callout kind="exam" title="Cuvinte-cheie din întrebări">
          <b>TCP:</b> reliable, connection-oriented, three-way handshake, sequencing, acknowledgment, windowing, flow control, retransmission, segmentation.<br />
          <b>UDP:</b> connectionless, best effort, low overhead, no acknowledgment, no sequencing, real-time, „the application handles reliability”.
        </Callout>

        <h3>Porturile pe care trebuie să le știi</h3>
        <Table head={['Protocol', 'Port(uri)', 'Transport', 'Observații']} hlCol={1} rows={[
          [<G id="ftp" />, '20 (date) / 21 (control)', 'TCP', 'cu utilizator și parolă, în clar'],
          [<G id="ssh" />, '22', 'TCP', 'și SCP / SFTP'],
          [<G id="telnet" />, '23', 'TCP', 'în clar — se înlocuiește cu SSH'],
          [<G id="smtp" />, '25', 'TCP', 'trimiterea e-mailului (587 = submission)'],
          ['TACACS+', '49', 'TCP', 'AAA pentru echipamente (5.x)'],
          [<G id="dns" />, '53', 'UDP + TCP', 'UDP pentru interogări; TCP pentru zone transfer și răspunsuri mari'],
          [<G id="dhcp" />, '67 (server) / 68 (client)', 'UDP', 'bazat pe broadcast'],
          [<G id="tftp" />, '69', 'UDP', 'fără autentificare; backup IOS/config'],
          [<G id="http" />, '80', 'TCP', ''],
          [<G id="pop3" />, '110', 'TCP', ''],
          [<G id="ntp" />, '123', 'UDP', 'sincronizarea ceasului (4.2)'],
          [<G id="imap" />, '143', 'TCP', ''],
          [<G id="snmp" />, '161 (agent) / 162 (traps)', 'UDP', 'monitorizare (4.4)'],
          [<G id="https" />, '443', 'TCP', '(HTTP/3: UDP 443 — extra)'],
          [<G id="syslog" />, '514', 'UDP', 'loguri centralizate (4.5)'],
          [<G id="radius" />, '1812 / 1813', 'UDP', 'autentificare / accounting (vechi: 1645/1646)'],
          ['RDP', '3389', 'TCP (și UDP)', 'desktop la distanță Windows'],
          [<G id="capwap" />, '5246 (control) / 5247 (date)', 'UDP', 'AP ↔ WLC (legătură cu 1.11 și 2.6)'],
        ]} />
        <Callout kind="tip" title="Cum să reții care e UDP">
          Gândește-te la protocoalele <b>mici, rapide, de infrastructură</b>, adesea trimise automat de echipamente: <b>DHCP, DNS, TFTP, NTP, SNMP, Syslog, RADIUS, CAPWAP</b> — plus vocea și video-ul live. Restul (sesiuni interactive și transferuri complete) e TCP. Perechea capcană: <b>FTP = TCP</b>, <b>TFTP = UDP</b>.
        </Callout>
        <p>Cum alegi transportul pentru o aplicație nouă? Întreabă-te: <b>pot pierde date?</b> (un fișier, nu; o secundă de voce, da) și <b>ce contează mai mult, toate datele sau acum?</b> Dacă răspunsul e „toate datele” → TCP. Dacă e „acum” sau „trimit tuturor” → UDP.</p>
      </Detailed>
      <Traps items={[
        <><b>DNS folosește ambele</b>: UDP 53 și TCP 53.</>,
        <><b>TFTP = UDP 69</b>; <b>FTP = TCP 20/21</b>. SNMP, Syslog, NTP, DHCP = UDP.</>,
        <>HTTPS la examen = <b>TCP 443</b>, chiar dacă browserele moderne folosesc și UDP 443 (QUIC).</>,
        <>„Reliable” nu înseamnă „mai bun”: pentru voce, UDP este alegerea corectă.</>,
        <>SNMP: agentul ascultă pe <b>161</b>, managerul primește trap-uri pe <b>162</b>.</>,
      ]} />
      <InlineQuiz ids={['1.5-035', '1.5-036', '1.5-037', '1.5-038']} />
    </section>
  );
}

/* ======================================================================
   6. QUIC — extra peste CCNA
   ====================================================================== */
export function Quic() {
  return (
    <section id="quic" className="section">
      <SectionHead id="quic" code="extra" title="Extra peste CCNA: QUIC și HTTP/3" />
      <Summary>
        <p><G id="quic" /> (RFC 9000, 2021) este un transport modern care rulează <b>peste UDP</b> (de obicei portul 443) și oferă tot ce oferă TCP — fiabilitate, ordine, flow și congestion control — plus criptare <G id="tls" /> 1.3 integrată și fluxuri independente. Pe el rulează <G id="http3" />.
          <b>Nu este cerut la CCNA v1.1</b>, dar explică de ce vei vedea mult trafic UDP 443 într-o captură reală.</p>
      </Summary>
      <Detailed>
        <h3>Ce problemă rezolvă</h3>
        <ul>
          <li><b>Prea multe tururi la început:</b> HTTPS peste TCP are nevoie de handshake-ul TCP (1 RTT) + handshake-ul TLS (1 RTT în TLS 1.3) înainte de prima cerere. QUIC le combină într-unul singur (1 RTT), iar la reconectare poate trimite date imediat (0-RTT).</li>
          <li><b><G id="head-of-line-blocking" />:</b> o pagină web descarcă zeci de resurse pe aceeași conexiune. În TCP, dacă se pierde un segment, toate datele de după el așteaptă — chiar dacă aparțin altei imagini. QUIC are <b>fluxuri independente</b>: o pierdere blochează doar fluxul afectat.</li>
          <li><b>Schimbarea rețelei:</b> o conexiune TCP e legată de 5-tuple; dacă telefonul trece de pe Wi-Fi pe 4G (alt IP), conexiunea se rupe. QUIC folosește un <i>connection ID</i> și poate continua.</li>
          <li><b>Evoluție lentă a TCP:</b> TCP e implementat în kernel și „înțeles” de multe echipamente intermediare, deci e greu de schimbat. QUIC rulează în aplicație, peste UDP — trece prin NAT și firewall-uri ca orice trafic UDP.</li>
        </ul>
        <Table head={['', 'HTTPS clasic (HTTP/1.1, HTTP/2)', 'HTTP/3']} rows={[
          ['Transport', 'TCP 443', 'QUIC peste UDP 443'],
          ['Criptare', 'TLS peste TCP (strat separat)', 'TLS 1.3 integrat în QUIC (obligatoriu)'],
          ['Handshake până la prima cerere', 'TCP 1 RTT + TLS 1.3 1 RTT', '1 RTT (0-RTT la reconectare)'],
          ['Pierdere de pachet', 'blochează toate fluxurile', 'blochează doar fluxul afectat'],
        ]} />
        <Callout kind="warn" title="Pentru examen">
          Răspunsul CCNA v1.1 rămâne <b>HTTPS = TCP 443</b>. QUIC este un exemplu bun al ideii „UDP + fiabilitate făcută de aplicație”. Dacă UDP 443 e blocat de un firewall, browserele revin automat la TCP 443. CCNA v2.0 (din 3 februarie 2027) nu a fost încă analizat complet în această aplicație.
        </Callout>
      </Detailed>
      <InlineQuiz ids={['1.5-042']} />
    </section>
  );
}
