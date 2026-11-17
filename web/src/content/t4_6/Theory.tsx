import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { HelperPlacement, RelayFlow } from '../../diagrams/t4_6';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.6" title="DHCP client și relay — imaginea de ansamblu" />
      <Summary>
        <p>În 4.3 ai văzut cum un router poate fi <b>server</b> <G id="dhcp" />. La 4.6 înveți celelalte două roluri: routerul ca <b>client</b> DHCP (își ia singur adresa de la un furnizor, cu <code>ip address dhcp</code>) și routerul ca <b>relay</b> (retrimite cererile clienților către un server aflat în altă subrețea, cu <code>ip helper-address</code>). Obiectivul oficial este de tip <b>Configure and verify</b>: trebuie să știi comenzile și să interpretezi rezultatul.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.6 este <i>Configure and verify DHCP client and relay</i>. Serverul DHCP pe IOS (pool, excluded-address, binding) a fost tratat la 4.3; aici ne ocupăm de <b>partea de client</b> și de <b>relay</b>, adică de ce se întâmplă când clientul și serverul nu sunt în același domeniu de broadcast.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Cum își ia un router adresa de la ISP?', 'Routerul ca client DHCP'],
          ['De ce un PC nu poate găsi un server DHCP din altă subrețea?', 'De ce avem nevoie de relay'],
          ['Ce face concret ip helper-address și unde se pune?', 'Cum funcționează relay-ul'],
          ['Cum verific și cum depanez?', 'Exemple de configurare'],
        ]} />
        <Analogy>Un client DHCP nou-venit „strigă în sală”: „Există vreun server DHCP?”. Strigătul (broadcast) se aude doar în sala (<G id="broadcast-domain" />) în care e el. Dacă serverul e în altă sală, un <b>mesager</b> (relay) stă la ușă, ascultă strigătele, le notează „de la sala 192.168.10.0” și le duce în mână serverului; apoi aduce răspunsul înapoi. Mesagerul nu hotărăște nimic: doar transportă.</Analogy>
        <Callout kind="info" title="Ordinea din lecție">
          Parcurgem: (1) routerul ca client, (2) problema broadcast-ului, (3) mecanismul relay cu <code>giaddr</code>, (4) configurare și depanare. Același schimb <G id="dora" /> din 4.3 se păstrează; relay-ul doar „lipește” două segmente de rețea.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Relay-ul <b>nu atribuie adrese</b>: doar retransmite. Adresele vin de la server, din pool-ul care potrivește subrețeaua clientului.</>,
        <>„DHCP client” pe un router înseamnă că <i>interfața</i> routerului cere adresă, nu că routerul servește alți clienți.</>,
        <><code>ip helper-address</code> se pune pe interfața dinspre <b>clienți</b>, nu pe cea dinspre server.</>,
      ]} />
      <InlineQuiz ids={['4.6-001', '4.6-002']} />
    </section>
  );
}

/* ======================================================================
   1. Routerul ca client DHCP
   ====================================================================== */
export function ClientSection() {
  return (
    <section id="client" className="section">
      <SectionHead id="client" code="4.6" title="Routerul ca client DHCP (ip address dhcp)" />
      <Summary>
        <p>Pe o interfață a unui router sau switch (de obicei una dinspre ISP, sau un SVI de management) poți înlocui adresa statică cu <code>ip address dhcp</code>. Interfața trimite un Discover, primește adresă, mască, gateway și DNS și le folosește cât ține lease-ul. Este exact comportamentul unui PC, dar pe o interfață Cisco.</p>
      </Summary>
      <Detailed title="1. De ce ar cere un router adresa prin DHCP">
        <p>Furnizorii de internet pentru birouri mici și acasă oferă adesea o adresă publică <b>dinamică</b> prin DHCP, ca să nu configureze manual fiecare client. Routerul de la marginea rețelei tale este atunci un client DHCP al ISP-ului. Același lucru se folosește pentru un SVI de management al unui switch din laborator sau pentru echipamente instalate de la distanță, care trebuie să se auto-configureze.</p>
        <Table head={['Ce primește interfața', 'Din ce opțiune DHCP', 'Efect pe router']} hlCol={0} rows={[
          ['Adresă IP + mască', 'yiaddr și opțiunea 1 (subnet mask)', 'Se configurează pe interfață, marcată cu metoda DHCP'],
          ['Default gateway', 'Opțiunea 3 (router)', 'Se instalează o rută implicită către acel gateway, cu distanță administrativă mare (uzual 254; verifică cu show ip route)'],
          ['Server DNS', 'Opțiunea 6', 'Poate fi folosit de router pentru rezoluție de nume'],
          ['Durata lease-ului', 'Opțiunea 51', 'Routerul reînnoiește (la ≈50% din lease) înainte să expire'],
        ]} />
        <Callout kind="tip" title="De ce ruta implicită are distanță mare">
          Distanța administrativă (<G id="administrative-distance" />) mare face ca ruta învățată prin DHCP să fie <b>mai puțin preferată</b> decât o rută statică sau dinamică configurată manual. Dacă ai deja o rută implicită statică, ea câștigă; dacă nu, o folosește pe cea DHCP.
        </Callout>
      </Detailed>
      <Detailed title="2. Pașii routerului client">
        <ol>
          <li>Interfața este activată (<code>no shutdown</code>) și are linie ridicată.</li>
          <li>Cu <code>ip address dhcp</code>, trimite <b>Discover</b> (broadcast) și primește <b>Offer</b>; apoi <b>Request</b> și <b>Ack</b>.</li>
          <li>Instalează adresa pe interfață și, dacă serverul a trimis gateway, o rută implicită.</li>
          <li>Reînnoiește lease-ul la jumătatea duratei (T1); dacă nu reușește, încearcă să-l <i>rebind</i>-eze (T2) și, la final, pierde adresa (vezi <G id="dhcp-renew-rebind" />).</li>
        </ol>
        <p>Dacă niciun server nu răspunde, interfața rămâne fără adresă (pe IOS nu se folosește automat <G id="apipa" /> ca pe Windows): <code>show ip interface brief</code> arată „unassigned” sau adresa veche până la expirare.</p>
      </Detailed>
      <DeepDive title="Verificarea clientului și comenzi de reînnoire">
        <p>Metoda adresei se vede în <code>show ip interface brief</code>, coloana <b>Method</b>: <code>DHCP</code> (față de <code>manual</code>). Informațiile despre lease (server, durată, timpi rămași) se obțin cu <code>show dhcp lease</code>, iar pe unele versiuni IOS se pot forța <code>release dhcp &lt;interfață&gt;</code> și <code>renew dhcp &lt;interfață&gt;</code> din modul EXEC privilegiat. Disponibilitatea și formatul acestor comenzi diferă între versiuni și în Packet Tracer — verifică în mediul tău.</p>
      </DeepDive>
      <Traps items={[
        <>Fără <code>no shutdown</code> interfața nu trimite Discover; nu apare nicio adresă.</>,
        <>Ruta implicită învățată prin DHCP apare doar dacă serverul a trimis opțiunea de gateway.</>,
        <>Nu pune <code>ip address dhcp</code> pe o interfață spre propria rețea internă dacă tu ești serverul sau relay-ul acelei rețele — ar fi două roluri contradictorii pe aceeași interfață.</>,
      ]} />
      <InlineQuiz ids={['4.6-003', '4.6-004', '4.6-005']} />
    </section>
  );
}

/* ======================================================================
   2. De ce relay
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="4.6" title="De ce avem nevoie de relay: broadcast-ul nu trece de router" />
      <Summary>
        <p>Discover-ul clientului este un broadcast (255.255.255.255). Un <b>router nu retransmite broadcast-uri</b>: fiecare interfață a lui este un domeniu de broadcast separat. Fără ajutor, un server DHCP aflat în altă subrețea nu ar vedea niciodată cererea. Soluțiile sunt două: fie un server în fiecare VLAN (scump și greu de gestionat), fie un <b>relay</b> care transmite cererile prin unicast.</p>
      </Summary>
      <Detailed title="1. Problema și cele două soluții">
        <Table head={['Abordare', 'Avantaj', 'Dezavantaj']} hlCol={0} rows={[
          ['Un server DHCP în fiecare subrețea', 'Fără configurare specială', 'Multe servere de întreținut; pool-uri împrăștiate; greu de auditat'],
          ['Un server central + relay (ip helper-address)', 'Administrare într-un singur loc, pool-uri pentru toate VLAN-urile', 'Necesită ip helper-address pe fiecare interfață de client și rute spre server']
        ]} />
        <p>Într-o rețea cu zeci de VLAN-uri (2.1), un singur server central, plus relay pe interfețele/SVI-urile fiecărui VLAN, este modelul uzual. Același lucru se aplică în <G id="router-on-a-stick" /> (relay pe subinterfețe) și pe switch-uri L3 (relay pe SVI).</p>
      </Detailed>
      <Detailed title="2. Ce s-ar întâmpla fără relay">
        <ol>
          <li>PC-ul din 192.168.10.0/24 trimite Discover (broadcast) pe LAN.</li>
          <li>Routerul R1 primește cadrul pe Gi0/1, vede că destinația este 255.255.255.255 (broadcast limitat) și <b>îl abandonează</b>: nu îl rutează.</li>
          <li>Serverul din 172.16.0.0/24 nu află nimic. Clientul retrimite de câteva ori, apoi un PC Windows își asignează <G id="apipa" /> (169.254.x.x).</li>
        </ol>
        <Callout kind="exam" title="Cuvinte cheie de examen">
          „Server DHCP în altă subrețea”, „broadcast-ul nu traversează routerul”, „ip helper-address pe interfața dinspre client”, „giaddr”, „169.254.x.x ⇒ relay lipsă sau greșit”.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Broadcast-ul nu trece de router, dar <b>unicast-ul</b> trece: relay-ul transformă broadcast-ul în unicast.</>,
        <>Dacă serverul e în <b>aceeași</b> subrețea cu clienții (sau pe același router, ca la 4.3), nu ai nevoie de relay.</>,
      ]} />
      <InlineQuiz ids={['4.6-006', '4.6-012']} />
    </section>
  );
}

/* ======================================================================
   3. Cum funcționează relay-ul
   ====================================================================== */
export function HowSection() {
  return (
    <section id="how" className="section">
      <SectionHead id="how" code="4.6" title="Cum funcționează ip helper-address, pas cu pas" />
      <Summary>
        <p>Cu <code>ip helper-address &lt;server&gt;</code> pe interfața dinspre clienți, routerul <b>interceptează</b> broadcast-urile UDP DHCP (porturile 67/68), le transformă în <b>unicast către server</b> și completează câmpul <b><G id="giaddr" /></b> (Gateway IP Address) cu adresa interfeței pe care a primit cererea. Serverul folosește giaddr ca să aleagă pool-ul potrivit și ca destinație a răspunsului.</p>
      </Summary>
      <Detailed title="1. Interactiv: schimbul DORA printr-un relay">
        <Figure caption="Alege pasul și urmărește mesajul: ce se transmite, între cine și ce conține. Observă rolul lui giaddr.">
          <RelayFlow />
        </Figure>
        <Table head={['Câmp / element', 'Rol în relay']} hlCol={0} rows={[
          [<code key="a">giaddr</code>, 'Adresa interfeței relay dinspre client; selectează pool-ul și arată unde se trimite răspunsul'],
          [<code key="b">chaddr</code>, 'Adresa MAC a clientului, păstrată în mesaj pentru ca relay-ul/serverul să știe cui îi aparține răspunsul'],
          [<code key="c">UDP 67 / 68</code>, 'Serverul ascultă pe 67, clientul pe 68; relay-ul comunică cu serverul pe 67'],
          [<code key="d">hops</code>, 'Număr de relay-uri traversate (cel mai adesea 1)'],
        ]} />
      </Detailed>
      <Detailed title="2. Unde pui comanda și ce altceva mai forwardează">
        <Figure caption="Comanda se pune pe interfața pe care sosesc broadcast-urile clienților, nu pe cea spre server.">
          <HelperPlacement />
        </Figure>
        <p>Pentru fiecare interfață de client (fiecare VLAN/subinterfață/SVI) se configurează o comandă <code>ip helper-address</code>. Poți pune <b>mai multe</b> adrese pe aceeași interfață (cererea ajunge la toate serverele — util pentru redundanță).</p>
        <p>Atenție la un efect lateral istoric: <code>ip helper-address</code> activează implicit retransmiterea broadcast-urilor UDP pentru un set de servicii (TFTP, DNS, Time, NetBIOS name/datagram, TACACS, BOOTP/DHCP). Dacă nu vrei unele dintre ele, le dezactivezi cu <code>no ip forward-protocol udp &lt;port&gt;</code> (de exemplu 137). Lista exactă variază între versiuni; verifică documentația platformei.</p>
        <Callout kind="info" title="Ce are nevoie serverul">
          (1) Un <b>pool</b> care conține adresa din giaddr (subrețeaua clienților); (2) o <b>rută</b> înapoi spre acea subrețea (aici, prin R1); (3) <b>excluderi</b> (<code>ip dhcp excluded-address</code>) pentru adresele statice — configurate pe <b>server</b>, nu pe relay.
        </Callout>
      </Detailed>
      <DeepDive title="Detalii: opțiunea 82, DHCPv6 și DHCP snooping">
        <p>Pe unele echipamente relay-ul poate adăuga <b>Option 82</b> (relay agent information: circuit-id, remote-id) ca serverul să știe prin ce port/VLAN a venit cererea; pe IOS se controlează cu <code>ip dhcp relay information …</code>, iar un switch cu DHCP snooping poate o insera automat. Pentru IPv6 echivalentul este <code>ipv6 dhcp relay destination &lt;adresă&gt;</code> pe interfața dinspre clienți; mecanismul (Solicit/Advertise/Request/Reply) este diferit, dar ideea de relay e aceeași. DHCP snooping (un mecanism de securitate) se tratează la 5.7.</p>
      </DeepDive>
      <Traps items={[
        <>Pe interfața greșită (dinspre server) comanda nu face nimic util: broadcast-ul clientului nu sosește acolo.</>,
        <>Un server fără rută spre subrețeaua din giaddr primește cererea, dar nu poate răspunde; clientul rămâne la 169.254.x.x.</>,
        <>Un pool care nu acoperă subrețeaua din giaddr face ca serverul să nu ofere adresă (sau să aleagă alt pool, greșit).</>,
        <>Un firewall/ACL care blochează UDP 67 între relay și server oprește totul, deși configurația relay-ului e corectă.</>,
      ]} />
      <InlineQuiz ids={['4.6-007', '4.6-008', '4.6-009', '4.6-010']} />
    </section>
  );
}
