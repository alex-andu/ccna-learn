import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DhcpDora, DnsRecords, DnsResolution, LeaseTimeline } from '../../diagrams/t4_3';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.3" title="Rolul DHCP și DNS — imaginea de ansamblu" />
      <Summary>
        <p>Pentru ca o gazdă să poată deschide <i>www.exemplu.ro</i>, are nevoie de două lucruri pe care utilizatorul nu le configurează de mână: o <b>configurație IP</b> (adresă, mască, gateway) — o oferă <G id="dhcp" /> — și un <b>traducător de nume în adrese</b> — îl oferă <G id="dns" />. 4.3 cere să <b>explici rolul</b> lor în rețea: ce problemă rezolvă fiecare, ce mesaje schimbă, ce parametri livrează și cum cooperează.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.3 este <i>Explain the role of DHCP and DNS within the network</i>: este de tip <b>Explain</b>, nu <i>Configure</i>. Configurarea clientului și a releului DHCP aparține obiectivului 4.6; aici înțelegi <b>conceptele, mesajele și relația</b> dintre cele două servicii. Pentru context, vei vedea totuși un exemplu scurt de server DHCP pe router și comenzile DNS de pe IOS.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce nu configurăm manual fiecare gazdă?', 'Rolul DHCP'],
          ['Care sunt cele patru mesaje DORA și ce conțin?', 'Rolul DHCP'],
          ['Ce parametri livrează DHCP, cât durează un lease?', 'DHCP în detaliu'],
          ['De ce avem nevoie de DNS și cum se rezolvă un nume?', 'Rolul DNS'],
          ['Ce tipuri de înregistrări există, ce face cache-ul?', 'DNS în detaliu'],
        ]} />
        <Callout kind="info" title="Cum se leagă DHCP și DNS">
          DHCP îi spune clientului <b>care este serverul DNS</b> (și gateway-ul); DNS îi spune clientului <b>ce adresă are un nume</b>. Fără DHCP configurezi manual totul; fără DNS tastezi adrese IP în loc de nume.
        </Callout>
        <Analogy>Un hotel: la recepție (DHCP) primești cheia camerei (adresa IP), directorul hotelului (gateway) și numărul serviciului de informații (DNS). Când vrei să suni „Ion Popescu din camera 312”, nu știi numărul — întrebi serviciul de informații (DNS), care îți dă numărul camerei.</Analogy>
      </Detailed>
      <Traps items={[
        <>DHCP nu rutează și nu rezolvă nume: doar <b>livrează parametri</b> (inclusiv adresa serverului DNS).</>,
        <>DNS nu atribuie adrese: doar <b>traduce nume în adrese</b> (și invers).</>,
        <>Ambele folosesc în mod obișnuit UDP, dar porturi diferite: DHCP 67/68, DNS 53.</>,
      ]} />
      <InlineQuiz ids={['4.3-001', '4.3-002']} />
    </section>
  );
}

/* ======================================================================
   1. Rolul DHCP
   ====================================================================== */
export function DhcpRoleSection() {
  return (
    <section id="dhcp-role" className="section">
      <SectionHead id="dhcp-role" code="4.3" title="Rolul DHCP: configurare IP automată (DORA)" />
      <Summary>
        <p><G id="dhcp" /> atribuie automat unei gazde o <b>adresă IP</b> și restul parametrilor (mască, gateway, server DNS), pentru o perioadă numită <G id="dhcp-lease" />. Clientul și serverul schimbă patru mesaje, memorate ca <b>DORA</b>: <b>D</b>iscover, <b>O</b>ffer, <b>R</b>equest, <b>A</b>cknowledge, peste UDP (server 67, client 68).</p>
      </Summary>
      <Detailed title="1. Problema pe care o rezolvă">
        <p>Fără DHCP, fiecare gazdă trebuie configurată manual: adresă unică, mască, gateway, DNS. La zeci sau mii de dispozitive (laptopuri, telefoane care intră și ies din rețea) asta e impracticabil, iar o singură greșeală (o adresă duplicată) produce conflicte greu de găsit. DHCP centralizează gestiunea: administratorul definește un <b>pool</b> (interval de adrese) și parametrii, iar serverul se ocupă de împărțire și evidență.</p>
        <Table head={['Fără DHCP', 'Cu DHCP']} hlCol={0} rows={[
          ['Configurare manuală pe fiecare gazdă', 'Configurare automată la conectare'],
          ['Risc de adrese duplicate și greșeli de mască/gateway', 'Serverul ține evidența adreselor date'],
          ['Mutarea unui laptop între rețele cere reconfigurare', 'Primește automat configurarea rețelei curente'],
          ['Schimbarea gateway-ului/DNS pe toate gazdele', 'Se schimbă într-un singur loc (pool-ul)'],
        ]} />
      </Detailed>
      <Detailed title="2. Cum funcționează, pas cu pas (DORA)">
        <Figure caption="Interactiv: parcurge cele patru mesaje și urmărește sursa, destinația și rolul fiecăruia.">
          <DhcpDora />
        </Figure>
        <ol>
          <li><b>Discover</b> — clientul, fără adresă (sursa 0.0.0.0), trimite broadcast (255.255.255.255, UDP 67) ca să găsească servere DHCP.</li>
          <li><b>Offer</b> — un server (sau mai multe) răspunde cu o adresă liberă și parametrii; adresa e rezervată temporar.</li>
          <li><b>Request</b> — clientul alege o ofertă și o cere formal, tot prin broadcast, ca celelalte servere să-și retragă oferta.</li>
          <li><b>Acknowledge</b> — serverul confirmă și înregistrează lease-ul; clientul configurează adresa.</li>
        </ol>
        <Callout kind="exam" title="Cuvinte cheie de examen">
          „DORA”, „broadcast 255.255.255.255”, „UDP 67 (server) și 68 (client)”, „lease”. Discover și Request sunt trimise de client; Offer și Ack de server. Mesajele clientului sunt broadcast pentru că el nu are încă adresă și nu știe cine e serverul.
        </Callout>
      </Detailed>
      <Detailed title="3. Ce parametri livrează DHCP">
        <Table head={['Parametru', 'Rol']} hlCol={0} rows={[
          ['Adresa IP + masca', 'Identitatea clientului în subrețea'],
          ['Default gateway', 'Calea spre alte rețele (opțiunea 3)'],
          ['Server(e) DNS', 'Cine rezolvă numele (opțiunea 6)'],
          ['Nume de domeniu', 'Sufixul de căutare (opțiunea 15)'],
          ['Durata lease-ului', 'Cât timp poate folosi clientul adresa'],
          ['Alte opțiuni', 'Ex.: opțiunea 43 pentru ca AP-urile Cisco să afle adresa WLC-ului (vezi 2.6), opțiunea 150 pentru telefoane IP'],
        ]} />
      </Detailed>
      <Traps items={[
        <>Offer și Ack pot fi unicast sau broadcast (depinde de client); nu memora „Offer = unicast” ca regulă absolută. Discover și Request ale clientului rămân broadcast.</>,
        <>Mesajele DHCP nu traversează un router fără ajutor: pentru un server în altă subrețea ai nevoie de <b>relay</b> (<code>ip helper-address</code>, obiectivul 4.6).</>,
        <>DHCP nu garantează aceeași adresă la reconectare, decât dacă este configurată o rezervare sau lease-ul nu a expirat.</>,
      ]} />
      <InlineQuiz ids={['4.3-003', '4.3-004', '4.3-005']} />
    </section>
  );
}

/* ======================================================================
   2. DHCP în detaliu
   ====================================================================== */
export function DhcpDetailsSection() {
  return (
    <section id="dhcp-details" className="section">
      <SectionHead id="dhcp-details" code="4.3" title="DHCP în detaliu: lease, reînnoire, conflicte și relay" />
      <Summary>
        <p>Adresa este <b>închiriată</b>, nu dată definitiv: clientul o reînnoiește la jumătatea lease-ului (50%), apoi, dacă nu reușește, încearcă la orice server (87,5%). Dacă nu primește adresă, un client Windows/macOS își atribuie singur o adresă <b>169.254.x.x</b> (APIPA/link-local). Serverul poate fi pe router, într-o altă subrețea (cu <b>relay</b>) sau chiar un dispozitiv dedicat.</p>
      </Summary>
      <Detailed title="1. Lease și reînnoire">
        <Figure caption="Cronologia unui lease: renew la 50%, rebind la 87,5%.">
          <LeaseTimeline />
        </Figure>
        <ul>
          <li><b>T1 (50%)</b>: clientul trimite un Request <b>unicast</b> la serverul care i-a dat adresa, ca să-și prelungească lease-ul (<i>renew</i>).</li>
          <li><b>T2 (87,5%)</b>: dacă serverul nu răspunde, clientul trimite Request prin <b>broadcast</b> către orice server (<i>rebind</i>).</li>
          <li><b>100%</b>: lease-ul expiră; clientul renunță la adresă și reia DORA.</li>
          <li>La IOS, lease-ul implicit al unui pool este de <b>1 zi</b>; se schimbă cu <code>lease</code>.</li>
        </ul>
      </Detailed>
      <Detailed title="2. Alte mesaje DHCP și cazuri speciale">
        <Table head={['Mesaj / situație', 'Ce înseamnă']} hlCol={0} rows={[
          ['DHCPNAK', 'Serverul refuză cererea (de exemplu clientul cere o adresă care nu mai e validă în subrețeaua actuală).'],
          ['DHCPDECLINE', 'Clientul refuză adresa oferită, de obicei pentru că a descoperit (prin ARP) că este deja folosită.'],
          ['DHCPRELEASE', 'Clientul renunță voluntar la adresă, înainte de expirare.'],
          ['DHCPINFORM', 'Clientul are adresa configurată manual și cere doar alți parametri (de exemplu DNS).'],
          ['Adrese excluse', 'Adrese pe care serverul nu le dă (gateway, servere, imprimante cu IP static): se exclud global.'],
          ['APIPA / link-local 169.254.0.0/16', 'Adresa pe care și-o atribuie singur clientul când nu găsește niciun server DHCP; permite doar comunicare în subrețea.'],
        ]} />
        <Callout kind="warn" title="Capcana clasică: 169.254.x.x">
          Dacă o gazdă are o adresă 169.254.x.x, <b>nu a primit configurație de la DHCP</b>: verifică serverul, relay-ul, VLAN-ul și cablul, nu rutarea.
        </Callout>
      </Detailed>
      <Detailed title="3. Unde rulează serverul DHCP">
        <ul>
          <li><b>Pe un router sau switch L3 Cisco</b> (cel mai des în laborator și în sucursale): pool configurat pe echipament.</li>
          <li><b>Pe un server dedicat</b> (Windows Server, Linux) în datacenter: mai flexibil, cu rapoarte și rezervări.</li>
          <li><b>Pe routerul de acasă</b> (și are rol de gateway și DNS forwarder).</li>
        </ul>
        <p>Dacă serverul e într-o altă subrețea, routerul de pe segmentul clientului trebuie să fie <b>relay</b>: preia broadcast-ul DHCP și îl transformă în unicast către server (<code>ip helper-address</code>); detalii la 4.6. Clientul DHCP al unui router sau al unei interfețe se configurează cu <code>ip address dhcp</code> (tot 4.6).</p>
      </Detailed>
      <DeepDive title="DHCP pentru IPv6 (pe scurt)">
        <p>În IPv6, o gazdă își poate construi singură adresa prin <G id="slaac" /> (din prefixul anunțat de router). <G id="dhcpv6" /> există în două forme: <b>stateless</b> (SLAAC pentru adresă, DHCPv6 doar pentru DNS etc.) și <b>stateful</b> (DHCPv6 atribuie adresa, ca DHCPv4). Mesajele diferă (Solicit/Advertise/Request/Reply, peste UDP 546/547), dar rolul rămâne același: livrarea configurației.</p>
      </DeepDive>
      <Traps items={[
        <>O gazdă cu 169.254.x.x nu a primit adresă DHCP; nu e „adresă de la server”.</>,
        <>Lease scurt = mai mult trafic DHCP, dar adrese eliberate repede; lease lung = invers. În rețele cu mulți vizitatori se folosesc lease-uri scurte.</>,
        <>Adresele statice din interiorul pool-ului trebuie <b>excluse</b>; altfel serverul le poate da altcuiva, cu conflicte de IP.</>,
      ]} />
      <InlineQuiz ids={['4.3-006', '4.3-007', '4.3-008']} />
    </section>
  );
}

/* ======================================================================
   3. Rolul DNS
   ====================================================================== */
export function DnsRoleSection() {
  return (
    <section id="dns-role" className="section">
      <SectionHead id="dns-role" code="4.3" title="Rolul DNS: nume în loc de adrese" />
      <Summary>
        <p><G id="dns" /> este „cartea de telefon” a rețelei: traduce <b>nume</b> ușor de ținut minte (<i>www.exemplu.ro</i>) în <b>adrese IP</b>, pentru că pachetele circulă doar pe baza adreselor. Este un sistem <b>distribuit și ierarhic</b>: nicio mașină nu cunoaște toate numele; fiecare server răspunde pentru zona lui sau trimite mai departe. Folosește de obicei UDP 53.</p>
      </Summary>
      <Detailed title="1. Problema">
        <p>Oamenii rețin nume, rețelele rutează adrese. În primele zile ale Internetului, un fișier <code>hosts</code> central lista toate corespondențele; devenise imposibil de menținut. DNS a înlocuit acel fișier cu o <b>bază de date ierarhică și distribuită</b>. Astăzi, aproape orice acțiune de rețea începe cu o interogare DNS.</p>
        <p>Numele are părți separate prin puncte, citite de la dreapta la stânga ca o ierarhie: <code>www.exemplu.ro.</code> → rădăcina (<code>.</code>) → <code>ro</code> (TLD) → <code>exemplu</code> (domeniu) → <code>www</code> (gazdă). Numele complet se numește <G id="fqdn" />.</p>
      </Detailed>
      <Detailed title="2. Cum se rezolvă un nume, pas cu pas">
        <Figure caption="Interactiv: parcurge rezoluția unui nume, de la client la serverul autoritativ.">
          <DnsResolution />
        </Figure>
        <Table head={['Rol', 'Ce face']} hlCol={0} rows={[
          ['Resolver / client (stub)', 'Cere rezolvarea; are un cache local (pe Windows se vede cu ipconfig /displaydns).'],
          ['Server recursiv', 'Face munca: întreabă pe rând rădăcina, TLD-ul și serverul autoritativ; ține rezultatul în cache.'],
          ['Servere root / TLD', 'Nu cunosc numele complete, doar „cine știe mai departe”.'],
          ['Server autoritativ', 'Deține zona și dă răspunsul final.'],
        ]} />
        <p>Interogarea clientului spre serverul recursiv este <b>recursivă</b> („adu-mi răspunsul final”); întrebările serverului recursiv către rădăcină/TLD/autoritativ sunt <b>iterative</b> („spune-mi măcar cine știe mai departe”).</p>
      </Detailed>
      <Detailed title="3. Cache și TTL">
        <p>Fiecare răspuns vine cu un <b>TTL</b> (secunde cât poate fi reținut). Cât TTL e valabil, același nume e rezolvat din cache, fără interogări noi: asta face DNS rapid și reduce traficul. Dacă o adresă se schimbă, clienții pot vedea versiunea veche până expiră TTL-ul.</p>
      </Detailed>
      <Traps items={[
        <>Un nume care „nu merge” dar adresa IP „merge” indică o problemă DNS (nu de conectivitate IP): testează cu <code>ping 8.8.8.8</code> versus <code>ping www.exemplu.ro</code>.</>,
        <>DNS rezolvă și invers (<b>PTR</b>: adresă → nume), dar răspunsul nu este garantat să existe.</>,
        <>Serverul DNS pe care îl folosește clientul vine, de obicei, din DHCP; dacă DHCP livrează un DNS greșit, rezolvarea eșuează deși rețeaua e sănătoasă.</>,
      ]} />
      <InlineQuiz ids={['4.3-009', '4.3-010', '4.3-011']} />
    </section>
  );
}

/* ======================================================================
   4. DNS în detaliu
   ====================================================================== */
export function DnsDetailsSection() {
  return (
    <section id="dns-details" className="section">
      <SectionHead id="dns-details" code="4.3" title="DNS în detaliu: înregistrări, porturi, depanare" />
      <Summary>
        <p>Informația DNS se organizează în <b>înregistrări de resurse</b> (A, AAAA, CNAME, MX, NS, PTR, SOA). Interogările folosesc <b>UDP 53</b>; TCP 53 apare pentru răspunsuri mari și pentru transferul zonelor între servere. Pe un dispozitiv Cisco poți folosi DNS-ul (<code>ip name-server</code>) și poți dezactiva căutarea (<code>no ip domain-lookup</code>) ca să nu aștepți la comenzi tastate greșit.</p>
      </Summary>
      <Detailed title="1. Tipuri de înregistrări">
        <DnsRecords />
        <Callout kind="exam" title="Ce reții">
          A = IPv4, AAAA = IPv6, CNAME = alias, MX = e-mail, NS = servere autoritative, PTR = rezolvare inversă, SOA = autoritatea zonei. Portul: UDP 53 (interogări), TCP 53 (zone transfer/răspunsuri mari).
        </Callout>
      </Detailed>
      <Detailed title="2. DNS pe un dispozitiv Cisco">
        <p>Un router poate fi <b>client DNS</b> (să rezolve nume folosite în comenzi precum <code>ping</code> sau <code>telnet</code>) și, opțional, <b>server DNS</b> mic (<code>ip dns server</code>) cu înregistrări statice <code>ip host</code>.</p>
        <Table head={['Comandă', 'Ce face']} hlCol={0} rows={[
          [<code key="a">ip name-server 8.8.8.8</code>, 'Setează serverul DNS pe care îl interoghează routerul'],
          [<code key="b">ip domain-lookup</code>, 'Activează rezolvarea numelor (implicit activată)'],
          [<code key="c">no ip domain-lookup</code>, 'O oprește: un cuvânt greșit tastat nu mai provoacă o așteptare lungă (routerul îl ia drept nume de gazdă pentru Telnet)'],
          [<code key="d">ip domain-name exemplu.local</code>, 'Sufix implicit adăugat numelor scurte; necesar și pentru SSH (vezi 4.8)'],
          [<code key="e">ip host SERV1 192.168.1.10</code>, 'Înregistrare statică locală (nume → adresă)'],
          [<code key="f">show hosts</code>, 'Afișează cache-ul de nume și înregistrările statice'],
        ]} />
      </Detailed>
      <DeepDive title="Cum afli unde se rupe: nume sau rețea?">
        <ol>
          <li>Rezolvă întâi problema adresei: <code>ping 8.8.8.8</code>. Dacă merge, conectivitatea IP funcționează.</li>
          <li>Încearcă un nume: <code>ping www.exemplu.ro</code> (sau <code>nslookup www.exemplu.ro</code>). Dacă eșuează, problema e DNS.</li>
          <li>Verifică ce server DNS a primit clientul (<code>ipconfig /all</code>, <code>show ip dhcp binding</code> etc.) și dacă acesta răspunde (<code>nslookup www.exemplu.ro 8.8.8.8</code>).</li>
          <li>Golește cache-ul clientului (<code>ipconfig /flushdns</code>) dacă ai schimbat o înregistrare recent.</li>
        </ol>
      </DeepDive>
      <Traps items={[
        <>Un router fără <code>ip name-server</code> nu poate rezolva nume; <code>no ip domain-lookup</code> îl oprește deliberat.</>,
        <>Un CNAME nu poate coexista cu alte înregistrări pe același nume; este alias, nu adresă.</>,
        <>DNS nu e doar „UDP”: răspunsurile mari și zone transfer-ul folosesc TCP 53.</>,
      ]} />
      <InlineQuiz ids={['4.3-012', '4.3-013']} />
    </section>
  );
}
