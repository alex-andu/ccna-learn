import { Link } from 'react-router-dom';
import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Photo, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import {
  ClientServerP2P, HubBridgeSwitch, IdsVsIps, InterVlanCompare, OsiGlance, PacketJourney, PoeBudget, PoeSequence,
  RouteLookup, StatefulFirewall, WirelessMgmtEvolution,
} from '../../diagrams/t1_1';

/* ======================================================================
   0. Introducere — ce este o rețea + imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.1" title="Bun venit! Ce este o rețea și cine face ce în ea" />
      <Summary>
        <p>O <b>rețea de calculatoare</b> este un ansamblu de dispozitive care își trimit date unele altora după reguli comune (protocoale).
          Unele dispozitive <b>produc și consumă</b> date (<G id="endpoint">endpoint-uri</G>, <G id="server">servere</G>), altele doar le <b>transportă și le filtrează</b>
          (<G id="l2-switch">switch-uri</G>, <G id="router">routere</G>, <G id="firewall">firewall-uri</G>, <G id="ap">AP-uri</G>). Obiectivul 1.1 îți cere să explici rolul fiecăruia.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Ce este, de fapt, o rețea">
        <p>Aceasta este prima lecție a cursului, așa că pornim de la zero. Când deschizi o pagină web pe telefon, se întâmplă trei lucruri:</p>
        <ol>
          <li>Telefonul (un <b>endpoint</b>) transformă cererea ta în <b>date</b> — o succesiune de biți.</li>
          <li>Datele sunt puse în „plicuri” cu adresa expeditorului și a destinatarului, apoi trimise prin cablu sau prin aer.</li>
          <li>Pe drum, mai multe <b>dispozitive de rețea</b> citesc adresele de pe plic și decid încotro trimit plicul mai departe, până ajunge la <b>server</b>-ul care are pagina.</li>
        </ol>
        <Analogy>O rețea seamănă cu poșta. Tu (endpoint-ul) scrii o scrisoare și o pui într-un plic cu adresa. Factorul poștal din cartier (switch-ul) cunoaște doar casele de pe strada lui. Centrul de sortare (routerul) știe în ce oraș trebuie trimis plicul. Paza de la intrarea în clădire (firewall-ul) verifică cine are voie să intre. Destinatarul (serverul) deschide plicul și răspunde.</Analogy>
        <p>Două feluri de adrese apar peste tot în acest curs:</p>
        <Table head={['Adresă', 'Exemplu', 'Cine o folosește', 'Analogie']} rows={[
          [<G id="mac">MAC</G>, <code>0050.7966.0001</code>, 'switch-urile, AP-urile — în interiorul unei rețele locale', 'numele de pe ușa apartamentului'],
          [<G id="ipv4">IP</G>, <code>192.168.1.10</code>, 'routerele — între rețele diferite', 'adresa poștală completă (oraș, stradă, număr)'],
        ]} />
        <p>Rețeaua din casa ta sau dintr-un birou se numește <b>LAN</b> (Local Area Network). Rețelele care leagă orașe sau țări sunt <G id="wan">WAN</G>-uri (topicul 1.2). Internetul este o „rețea de rețele”: milioane de LAN-uri legate între ele prin routere.</p>

        <h3>2. Modelul OSI pe scurt — „etajele” comunicației</h3>
        <p>Ca să nu facă totul un singur program uriaș, comunicația este împărțită în <b>niveluri</b> (layers). Fiecare nivel are o singură treabă și îi oferă servicii nivelului de deasupra. Referința clasică este modelul <G id="osi" /> cu 7 niveluri. Aici ai nevoie doar de o idee generală; modelele OSI și TCP/IP se studiază pe larg în topicul 1.5.</p>
        <Figure caption="Interactiv: atinge un nivel. Barele colorate arată până la ce nivel „citește” fiecare dispozitiv ca să ia decizii. Endpoint-urile și serverele folosesc toate nivelurile, pentru că rulează aplicații.">
          <OsiGlance />
        </Figure>
        <Callout kind="tip" title="Regula de aur pentru tot topicul 1.1">
          Un dispozitiv se descrie prin <b>nivelul la care ia decizii</b>: hub = L1 (biți), switch și AP = L2 (MAC), router și switch L3 = L3 (IP), firewall = L3–L4 (IP + porturi), <G id="ngfw" /> și <G id="ips" /> = până la L7 (aplicații). Dacă știi nivelul, poți deduce aproape orice întrebare de examen.
        </Callout>

        <h3>3. Componentele din obiectivul 1.1</h3>
        <Table head={['Cod Cisco', 'Componentă', 'Într-o frază', 'Nivel']} hlCol={0} rows={[
          ['1.1.a', 'Routers', 'leagă rețele IP diferite și aleg drumul pachetelor', 'L3'],
          ['1.1.b', 'Layer 2 and Layer 3 switches', 'leagă dispozitivele din LAN (L2); cele L3 și rutează între VLAN-uri', 'L2 / L3'],
          ['1.1.c', 'Next-generation firewalls and IPS', 'filtrează traficul după politici, aplicații și semnături de atac', 'L3–L7'],
          ['1.1.d', 'Access points', 'leagă clienții wireless de rețeaua cablată', 'L1–L2'],
          ['1.1.e', 'Controllers', 'gestionează centralizat AP-uri (WLC) sau toată rețeaua (Catalyst Center)', 'management'],
          ['1.1.f', 'Endpoints', 'dispozitivele utilizatorilor: PC, telefon, imprimantă, cameră, senzor', 'L1–L7'],
          ['1.1.g', 'Servers', 'oferă servicii clienților: web, fișiere, DNS, DHCP, e-mail', 'L1–L7'],
          ['1.1.h', 'PoE', 'alimentează dispozitive prin cablul de rețea', 'L1'],
        ]} />
        <Callout kind="info" title="De ce nu mergem în ordinea a → h?">
          Codurile Cisco rămân cele oficiale, dar le parcurgem în ordinea în care se înțeleg cel mai ușor: întâi cei care <b>vorbesc</b> (endpoint-uri și servere, f → g), apoi cei care <b>leagă</b> rețeaua locală (switch-uri, b), apoi cei care leagă <b>rețele între ele</b> (routere, a), cei care o <b>protejează</b> (firewall/IPS, c), partea <b>wireless</b> (AP și controllere, d → e) și, la final, cum primesc curent unele dispozitive prin cablu (PoE, h).
        </Callout>

        <h3>4. Toți la lucru: drumul unui pachet de la PC la Internet</h3>
        <p>Cel mai bun mod de a înțelege rolurile este să urmărești un singur pachet. Observă la fiecare pas <b>ce citește</b> dispozitivul și <b>ce modifică</b>.</p>
        <Figure caption="Interactiv: parcurge pașii sau atinge un dispozitiv. Urmărește coloana „Valoare”: MAC-urile se schimbă la fiecare router, IP-urile rămân (cu excepția NAT-ului de pe firewall).">
          <PacketJourney />
        </Figure>
        <div className="photo-grid">
          <Photo file="wifi6-router-back.jpg" caption="Un „router” de casă (SOHO) văzut din spate: un port WAN (Internet) și mai multe porturi LAN. În aceeași cutie stau un router, un mic switch, un AP și un firewall simplu — vezi topicul 1.2.e." />
        </div>
      </Detailed>

      <DeepDive title="Deep dive: cele trei „plane” ale unui dispozitiv de rețea">
        <p>Orice router sau switch modern are trei funcții logice separate. Distincția revine în Domeniul 6 (SDN și controllere), dar e utilă de pe acum:</p>
        <Table head={['Plan', 'Ce face', 'Exemple']} rows={[
          [<G id="control-plane">Control plane</G>, 'decide: construiește tabelele (unde se trimite traficul)', 'OSPF, BGP, STP, ARP, CDP/LLDP'],
          [<G id="data-plane">Data plane</G>, 'execută: mută efectiv pachetele/cadrele conform tabelelor', 'forwarding cu CEF, comutare în ASIC, aplicarea ACL-urilor'],
          ['Management plane', 'permite administrarea dispozitivului', 'SSH, SNMP, syslog, NETCONF, GUI'],
        ]} />
        <p>Un <G id="sdn">controller SDN</G> (de exemplu <G id="catalyst-center" />) mută o parte din „gândire” (control/management) într-un punct central, în timp ce data plane-ul rămâne pe fiecare echipament.</p>
      </DeepDive>

      <Traps items={[
        <>Întrebările de tip „Explain the role and function” verifică <b>ce face</b> un dispozitiv și <b>la ce nivel OSI</b> lucrează, nu comenzi.</>,
        <>Endpoint-urile și serverele folosesc <b>toate</b> cele 7 niveluri. Switch-ul L2 se uită doar la L2, routerul până la L3.</>,
        <>„Routerul” de acasă este de fapt un dispozitiv <b>multifuncțional</b> (router + switch + AP + firewall + DHCP). La examen, întrebarea se referă la funcția logică.</>,
      ]} />
      <InlineQuiz ids={['1.1-001', '1.1-002', '1.1-003']} />
    </section>
  );
}

/* ======================================================================
   1.1.f — Endpoints
   ====================================================================== */
export function Endpoints() {
  return (
    <section id="endpoints" className="section">
      <SectionHead id="endpoints" code="1.1.f" title="Endpoints — dispozitivele de la marginea rețelei" />
      <Summary>
        <p>Un <G id="endpoint" /> este orice dispozitiv care <b>creează sau consumă</b> date: PC, laptop, telefon, tabletă, imprimantă, telefon IP, cameră, senzor <G id="iot" />.
          Are o placă de rețea (cu <G id="mac" />), o adresă IP, o mască, un <G id="default-gateway" /> și un server <G id="dns" />. Este și principala țintă a atacurilor.</p>
      </Summary>
      <Detailed>
        <h3>Ce are nevoie un endpoint ca să comunice</h3>
        <Table head={['Parametru', 'Exemplu', 'La ce folosește']} rows={[
          ['Placă de rețea (NIC) cu adresă MAC', <code>0050.7966.0001</code>, 'identifică interfața în rețeaua locală (L2)'],
          [<>Adresă <G id="ipv4" /> + <G id="subnet-mask">mască</G></>, <code>192.168.1.10/24</code>, 'identifică dispozitivul și rețeaua din care face parte (L3)'],
          [<G id="default-gateway" />, <code>192.168.1.1</code>, 'routerul la care trimite tot ce NU e în propria rețea'],
          ['Server DNS', <code>192.168.1.1</code>, 'traduce nume (cisco.com) în adrese IP'],
        ]} />
        <p>Acești parametri se configurează manual sau, cel mai des, automat prin <G id="dhcp" />. Cum îi verifici pe Windows, macOS și Linux este subiectul topicului 1.10.</p>

        <h3>Familii de endpoint-uri</h3>
        <ul>
          <li><b>Dispozitivele utilizatorilor</b>: desktop, laptop, smartphone, tabletă. Mobile, adesea pe Wi-Fi.</li>
          <li><b>Periferice în rețea</b>: imprimante, scanere, ecrane de prezentare.</li>
          <li><b>Voce și video</b>: telefoane IP, terminale de videoconferință — sensibile la întârziere, de obicei alimentate prin <G id="poe" /> și puse într-un VLAN de voce separat.</li>
          <li><b>IoT / OT</b> (Internet of Things / Operational Technology): camere de supraveghere, senzori de temperatură, cititoare de carduri, controlere de iluminat, roboți industriali. Sunt foarte numeroase, rar actualizate și greu de securizat.</li>
        </ul>
        <Analogy>Endpoint-urile sunt „locuitorii” rețelei. Switch-urile și routerele sunt drumurile și intersecțiile: există doar ca locuitorii să poată ajunge unii la alții.</Analogy>

        <h3>De ce contează endpoint-urile pentru securitate</h3>
        <p>Majoritatea atacurilor încep la un endpoint: un e-mail de phishing deschis pe un laptop, un stick USB infectat, o cameră IP cu parola implicită. De aceea companiile folosesc <b>endpoint security</b> (antivirus modern / EDR), verifică „sănătatea” dispozitivului înainte de a-l lăsa în rețea (de exemplu cu Cisco ISE și <G id="dot1x" />) și separă dispozitivele IoT în VLAN-uri proprii. Detalii în Domeniul 5.</p>
        <Callout kind="exam" title="Ce reține examenul">
          Un endpoint lucrează la <b>toate nivelurile</b> (L1–L7), pentru că rulează aplicații. Ca să iasă din propria rețea are nevoie de un <b>default gateway</b> corect; fără el, poate comunica doar local.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Un telefon IP, o imprimantă sau o cameră sunt <b>tot endpoint-uri</b>, nu doar PC-urile.</>,
        <>Fără default gateway, un endpoint comunică <b>doar în propriul subnet</b>.</>,
        <>Endpoint-ul este de obicei <b>sursa sau destinația</b> traficului; switch-urile și routerele doar îl transportă.</>,
      ]} />
      <InlineQuiz ids={['1.1-004', '1.1-005', '1.1-006']} />
    </section>
  );
}

/* ======================================================================
   1.1.g — Servers
   ====================================================================== */
export function Servers() {
  return (
    <section id="servers" className="section">
      <SectionHead id="servers" code="1.1.g" title="Servers — cei care oferă servicii" />
      <Summary>
        <p>Un <G id="server" /> este un calculator (fizic, virtual sau container) care <b>oferă un serviciu</b> altor dispozitive, numite clienți: pagini web, fișiere, e-mail, <G id="dns" />, <G id="dhcp" />, autentificare.
          „Server” este un <b>rol</b>, nu un tip de hardware: un laptop care rulează un server web este server pentru acel serviciu.</p>
      </Summary>
      <Detailed>
        <h3>Modelul client-server</h3>
        <p>Clientul trimite o <b>cerere</b>, serverul trimite un <b>răspuns</b>. Serverul ascultă pe un <G id="port" /> cunoscut (de exemplu 443 pentru HTTPS), iar clientul folosește un port aleatoriu, temporar. Alternativa este modelul <b>peer-to-peer</b>, în care fiecare nod este și client, și server.</p>
        <Figure caption="Interactiv: comută între cele două modele.">
          <ClientServerP2P />
        </Figure>

        <h3>Servicii frecvente (le vei reîntâlni în Domeniul 4)</h3>
        <Table head={['Serviciu', 'Protocol', 'Port', 'Ce face']} rows={[
          ['Web', 'HTTP / HTTPS', 'TCP 80 / 443', 'pagini și aplicații web'],
          ['Nume', 'DNS', 'UDP/TCP 53', 'nume → adresă IP'],
          ['Adresare automată', 'DHCP', 'UDP 67 (server) / 68 (client)', 'dă IP, mască, gateway, DNS clienților'],
          ['Administrare la distanță', 'SSH', 'TCP 22', 'acces securizat la CLI'],
          ['Transfer fișiere', 'FTP / TFTP', 'TCP 20–21 / UDP 69', 'fișiere, imagini IOS, backup-uri de configurație'],
          ['Monitorizare', 'SNMP / Syslog', 'UDP 161–162 / UDP 514', 'stare, alerte și jurnale de pe echipamente'],
          ['Timp', 'NTP', 'UDP 123', 'sincronizarea ceasului (esențial pentru jurnale și certificate)'],
          ['Autentificare (AAA)', 'RADIUS / TACACS+', 'UDP 1812–1813 / TCP 49', 'cine are voie să intre în rețea sau pe echipamente'],
        ]} />

        <h3>Cum arată serverele azi</h3>
        <ul>
          <li><b>Fizice</b>: în format rack (1U, 2U) sau blade, în camera serverelor sau în data center. Au de obicei <b>două plăci de rețea</b> legate la două switch-uri diferite (redundanță — <G id="nic-teaming">NIC teaming</G>) și două surse de alimentare.</li>
          <li><b>Virtuale</b>: mai multe <G id="vm">mașini virtuale</G> pe același server fizic, prin <G id="hypervisor" /> (topicul 1.12).</li>
          <li><b>Containere</b>: aplicații ușoare, izolate, care împart nucleul sistemului de operare (<G id="container" />, topicul 1.12).</li>
          <li><b>În cloud</b>: serverul rulează la un furnizor (AWS, Azure, Google Cloud) — vezi <G id="cloud" /> în topicul 1.2.f.</li>
        </ul>
        <Callout kind="tip" title="Unde se pun serverele în rețea">
          Serverele interne stau în data center sau într-un VLAN de servere. Serverele <b>accesibile din Internet</b> (site-ul public, serverul de e-mail) se pun într-o zonă separată, <G id="dmz" />, protejată de firewall: dacă unul este compromis, atacatorul nu ajunge direct în rețeaua internă. Serverele primesc adrese IP <b>statice</b> (sau rezervări DHCP), ca clienții să le găsească mereu la aceeași adresă.
        </Callout>
      </Detailed>
      <Traps items={[
        <>„Server” = <b>rol</b>. Același PC poate fi client pentru web și server pentru partajare de fișiere.</>,
        <>Serverele publice merg în <b>DMZ</b>, nu în LAN-ul intern.</>,
        <>Serverele au IP-uri <b>statice</b> sau rezervări DHCP — nu adrese care se schimbă.</>,
        <>Portul cunoscut este pe <b>server</b> (destinație 443); clientul folosește un port sursă temporar, mare.</>,
      ]} />
      <InlineQuiz ids={['1.1-007', '1.1-008', '1.1-010']} />
    </section>
  );
}

/* ======================================================================
   1.1.b — Layer 2 and Layer 3 switches
   ====================================================================== */
export function Switches() {
  return (
    <section id="switches" className="section">
      <SectionHead id="switches" code="1.1.b" title="Layer 2 and Layer 3 switches" />
      <Summary>
        <p>Un <G id="l2-switch">switch L2</G> leagă dispozitivele din aceeași rețea locală și trimite fiecare <G id="frame">cadru</G> Ethernet <b>doar pe portul</b> unde se află MAC-ul destinație, folosind o <G id="mac-table">tabelă MAC</G> învățată din MAC-urile sursă.
          Un <G id="l3-switch">switch L3</G> (<G id="multilayer-switch">multilayer</G>) face în plus <b>rutare IP</b> între VLAN-uri, în hardware, la viteza porturilor.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Istoria: hub → bridge → switch → switch multilayer">
        <p>Fiecare pas din această evoluție a rezolvat o problemă concretă a pasului anterior:</p>
        <Table head={['Dispozitiv', 'Nivel', 'Ce face', 'Ce problemă a rezolvat', 'Ce problemă a lăsat']} rows={[
          [<G id="hub" />, 'L1', 'repetă semnalul electric pe toate porturile', 'a permis cablarea în stea (mai ușor de întreținut decât un cablu coaxial comun)', <>un singur <G id="collision-domain">domeniu de coliziune</G>, <G id="half-duplex" />, <G id="csma-cd" />; cu cât mai mulți utilizatori, cu atât mai multe coliziuni</>],
          [<G id="bridge" />, 'L2', 'învață MAC-uri și separă rețeaua în segmente; filtrează cadrele locale', 'a împărțit LAN-ul în mai multe domenii de coliziune (DEC LANBridge 100, 1983)', 'puține porturi, comutare în software → lent'],
          [<G id="l2-switch">Switch L2</G>, 'L2', 'un „bridge cu multe porturi” în hardware (ASIC)', <>fiecare port e domeniu de coliziune separat (microsegmentare), <G id="full-duplex" /> → coliziunile dispar (Kalpana EtherSwitch, ≈1990)</>, <>tot un singur <G id="broadcast-domain">domeniu de broadcast</G> pe VLAN; rutarea între VLAN-uri cere un router</>],
          [<G id="multilayer-switch">Switch L3</G>, 'L2 + L3', 'comută în VLAN și rutează între VLAN-uri în hardware', 'a eliminat gâtul de sticlă „router-on-a-stick”', 'mai scump; în general mai puține funcții WAN decât un router'],
        ]} />
        <Figure caption="Interactiv: alege dispozitivul și tipul de cadru. Observă cine primește cadrul și câte domenii de coliziune există.">
          <HubBridgeSwitch />
        </Figure>
        <Analogy>Hub-ul e un megafon într-o sală: toată lumea aude tot. Switch-ul e o centrală telefonică: te leagă direct cu persoana căutată. Un broadcast e un anunț la difuzor — îl aud toți cei din clădire (VLAN), chiar și cu centrală.</Analogy>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. Cum decide un switch L2 (cele trei acțiuni)">
        <ol>
          <li><b>Learn (învață)</b> — când primește un cadru, notează <b>MAC-ul sursă</b>, portul și VLAN-ul în tabela MAC (numită și <G id="cam" /> table). O intrare nefolosită expiră implicit după 300 s (<G id="aging" />).</li>
          <li><b>Forward / filter</b> — caută <b>MAC-ul destinație</b>. Dacă îl știe, trimite cadrul <b>doar</b> pe acel port. Dacă destinația e pe același port pe care a venit cadrul, îl aruncă (filter).</li>
          <li><b>Flood</b> — dacă destinația e necunoscută (<G id="unknown-unicast" />), broadcast (<code>FFFF.FFFF.FFFF</code>) sau multicast, trimite cadrul pe <b>toate porturile din VLAN</b>, mai puțin cel pe care a venit.</li>
        </ol>
        <p>Switch-ul <b>nu modifică</b> cadrul și nu se uită la adresa IP. Pentru a nu propaga cadre corupte, modul implicit pe switch-urile Cisco este <G id="store-and-forward" />: primește tot cadrul și verifică <G id="fcs" /> înainte să-l trimită. Mecanismele de învățare, aging și flooding se studiază în detaliu în topicul 1.13.</p>
        <Callout kind="info" title="Un switch L2 are o adresă IP. Asta nu îl face router!">
          Pe un switch L2 configurezi de obicei o adresă IP pe o interfață virtuală (<G id="svi" />, de exemplu <code>interface vlan 1</code>), doar ca să te poți conecta la el prin SSH. Este <b>adresa de management</b>, ca la o imprimantă. Switch-ul nu rutează trafic între rețele.
        </Callout>
        <h4>De ce este switch-ul rapid: hardware dedicat</h4>
        <p>Căutările în tabela MAC nu le face procesorul (CPU), ci cipuri specializate (<G id="asic" />) și memorii speciale: <b>CAM</b> pentru potriviri exacte (MAC → port) și <G id="tcam" /> pentru potriviri cu mască (rute, ACL-uri, QoS). O căutare durează un singur ciclu de ceas, indiferent câte intrări are tabela.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Switch-ul L3 (multilayer)">
        <p>Odată cu <G id="vlan">VLAN-urile</G>, o rețea locală a fost împărțită în mai multe rețele logice. Calculatoarele din VLAN-uri diferite sunt în <b>subnet-uri diferite</b>, deci au nevoie de rutare ca să comunice. Soluția inițială a fost un router legat printr-un singur trunk („router-on-a-stick”). Când traficul dintre VLAN-uri a crescut, routerul a devenit gâtul de sticlă. Switch-ul L3 a rezolvat problema rutând <b>în hardware</b>.</p>
        <Figure caption="Interactiv: rutarea între VLAN-uri înainte (router-on-a-stick) și azi (switch L3 cu SVI-uri).">
          <InterVlanCompare />
        </Figure>
        <ul>
          <li><b>SVI</b> (<code>interface vlan 10</code> + adresă IP) = default gateway-ul pentru VLAN 10.</li>
          <li><b>Routed port</b> (<code>no switchport</code>) = un port fizic care se comportă ca o interfață de router (fără VLAN).</li>
          <li><code>ip routing</code> activează rutarea; pe multe modele este dezactivată implicit.</li>
          <li>Are tabelă de rutare și <G id="cef" /> în hardware, la fel ca un router.</li>
        </ul>
        <Table head={['', 'Switch L2', 'Switch L3 (multilayer)', 'Router']} rows={[
          ['Decide după', 'MAC destinație', 'MAC în VLAN, IP între VLAN-uri', 'IP destinație'],
          ['Tabelă principală', 'tabela MAC (CAM)', 'tabela MAC + tabela de rutare / FIB', 'tabela de rutare / FIB'],
          ['Separă domenii de broadcast', 'nu (doar prin VLAN-uri)', 'da (fiecare SVI / routed port)', 'da (fiecare interfață)'],
          ['Densitate porturi Ethernet', 'mare (24/48)', 'mare (24/48)', 'mică'],
          ['Funcții WAN, NAT, VPN', 'nu', 'limitate', 'da (rolul lui principal la marginea rețelei)'],
          ['Unde îl găsești', 'access layer', 'distribution / core', 'marginea rețelei (edge), WAN, Internet'],
          ['Exemple Cisco', 'Catalyst 9200, 2960 (Packet Tracer)', 'Catalyst 9300/9500, 3560/3650 (PT)', 'ISR 1000/4000, Catalyst 8000, 2911 (PT)'],
        ]} />
      </Detailed>

      <DeepDive title="Deep dive: metode de comutare">
        <p><b>Store-and-forward</b> (implicit Cisco): primește tot cadrul, verifică FCS-ul, apoi îl trimite. Latență puțin mai mare, dar cadrele corupte nu se propagă. <b><G id="cut-through" /></b>: începe să trimită imediat ce a citit MAC-ul destinație (primii 6 octeți după preambul) — latență minimă, folosit în data center pentru aplicații sensibile la microsecunde. <b>Fragment-free</b>: așteaptă primii 64 de octeți (fereastra în care apar coliziunile pe un mediu partajat). Pentru CCNA, reține diferența între primele două.</p>
      </DeepDive>

      <Traps items={[
        <>Switch-ul <b>învață din MAC-ul sursă</b> și <b>decide după MAC-ul destinație</b>.</>,
        <>Un switch <b>nu separă domeniile de broadcast</b>. Le separă VLAN-urile, routerele și switch-urile L3.</>,
        <>Fiecare port de switch = un <b>domeniu de coliziune</b> separat. Un hub cu 8 porturi = 1 domeniu de coliziune.</>,
        <>Cadrele cu destinație necunoscută sunt <b>inundate (flood)</b>, nu aruncate.</>,
        <>„Multilayer switch” = „Layer 3 switch”. Rutarea se activează cu <code>ip routing</code>.</>,
        <>IP-ul de management al unui switch L2 (SVI) <b>nu</b> îl face router.</>,
      ]} />
      <InlineQuiz ids={['1.1-011', '1.1-013', '1.1-016']} />
    </section>
  );
}

/* ======================================================================
   1.1.a — Routers
   ====================================================================== */
export function Routers() {
  return (
    <section id="routers" className="section">
      <SectionHead id="routers" code="1.1.a" title="Routers — legătura dintre rețele" />
      <Summary>
        <p>Un <G id="router" /> este un dispozitiv de <b>nivel 3</b> care leagă <b>rețele IP diferite</b> (LAN cu LAN, LAN cu WAN, companie cu Internet).
          Pentru fiecare pachet caută IP-ul destinație în <G id="routing-table">tabela de rutare</G>, alege ruta cu <b>prefixul cel mai lung</b>, scade <G id="ttl" />-ul și construiește un cadru L2 nou pentru următorul hop. Nu propagă broadcast-urile.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Ce problemă a rezolvat routerul">
        <p>O rețea L2 (un domeniu de broadcast) nu poate crește la nesfârșit. Fiecare broadcast (de exemplu un <G id="arp" /> request) ajunge la toate dispozitivele; cu mii de calculatoare, rețeaua ar fi sufocată de broadcast-uri. În plus, cu adrese MAC (care nu au structură geografică) nu poți „orienta” traficul spre un oraș sau o țară.</p>
        <p>Routerul rezolvă ambele probleme: <b>împarte</b> rețeaua mare în subnet-uri mai mici (fiecare interfață = un domeniu de broadcast) și folosește adrese IP <b>ierarhice</b> (partea de rețea + partea de host), care permit rutarea pe bază de prefix — exact ca un cod poștal.</p>

        <h3>2. Ce face routerul cu fiecare pachet (pas cu pas)</h3>
        <ol>
          <li>Primește un cadru adresat <b>MAC-ului propriu</b> (sau un broadcast/multicast pe care îl acceptă) și îndepărtează antetul L2.</li>
          <li>Citește <b>IP-ul destinație</b> și îl caută în tabela de rutare. Ruta cu <b>cel mai lung prefix</b> potrivit câștigă (longest prefix match).</li>
          <li>Scade <b>TTL</b>-ul cu 1 (dacă ajunge la 0, aruncă pachetul și trimite un mesaj <G id="icmp" /> „time exceeded”) și recalculează checksum-ul antetului IP.</li>
          <li>Află MAC-ul următorului hop prin ARP (IPv4) sau NDP (IPv6), construiește un <b>cadru nou</b> și îl trimite pe interfața de ieșire.</li>
        </ol>
        <Callout kind="exam" title="Cel mai testat lucru despre routere">
          De la sursă la destinație, <b>adresele IP rămân aceleași</b> (cu excepția <G id="nat" />). <b>Adresele MAC se rescriu la fiecare router</b>, pentru că un MAC are sens doar pe legătura locală.
        </Callout>

        <h3>3. Tabela de rutare și longest prefix match</h3>
        <p>Tabela de rutare conține rutele cunoscute: rețelele <b>direct conectate</b> (C), adresele proprii ale interfețelor (L, /32), rutele <b>statice</b> (S, scrise de administrator) și rutele <b>dinamice</b> învățate prin protocoale de rutare (O = OSPF, D = EIGRP, B = BGP). Ruta <code>0.0.0.0/0</code> este <b>ruta implicită</b> (gateway of last resort): „tot ce nu știi, trimite aici”.</p>
        <Figure caption="Interactiv: alege sau scrie un IP destinație. Toate rutele care îl conțin se potrivesc, dar câștigă cea mai specifică (prefixul cel mai lung).">
          <RouteLookup />
        </Figure>
        <p>Ordinea de decizie: <b>1)</b> prefixul cel mai lung → <b>2)</b> dacă două surse oferă exact același prefix, câștigă distanța administrativă (AD) mai mică → <b>3)</b> în cadrul aceluiași protocol, metrica mai mică. Detaliile (AD, metrici, OSPF) sunt în Domeniul 3.</p>

        <h3>4. Ce mai face un router, pe lângă rutare</h3>
        <ul>
          <li>Conectivitate <b>WAN</b> și Internet (porturi și module pentru fibră, 4G/5G, DSL).</li>
          <li><G id="nat" /> / <G id="pat" /> — mai multe adrese private în spatele unei adrese publice (1.7).</li>
          <li>Server sau releu <G id="dhcp" /> (4.3, 4.6), filtrare cu <G id="acl">ACL-uri</G> (5.6), tuneluri <G id="vpn" /> (5.5), QoS (4.7).</li>
          <li>Exemple Cisco: ISR 1000/4000, Catalyst 8000 Edge (8200/8300/8500), ASR 1000. În Packet Tracer: 1941, 2901, <b>2911</b>, ISR4331.</li>
        </ul>
      </Detailed>

      <DeepDive title="Deep dive: CEF — de ce routerul nu „caută” pentru fiecare pachet">
        <p>Căutarea în tabela de rutare (RIB) pentru fiecare pachet, cu procesorul, ar fi lentă. Cisco folosește <G id="cef" />: control plane-ul construiește RIB-ul, iar CEF calculează din el două structuri optimizate pentru căutare:</p>
        <ul>
          <li><G id="fib" /> (Forwarding Information Base) — o copie a celor mai bune rute, organizată pentru căutare rapidă după prefix;</li>
          <li><b>Adjacency table</b> — antetele L2 gata construite pentru fiecare vecin (din tabela ARP), ca rescrierea MAC să fie o simplă copiere.</li>
        </ul>
        <p>Data plane-ul folosește doar FIB + adjacency. Pe switch-urile L3 și routerele mari, FIB-ul este încărcat în TCAM, iar comutarea se face complet în hardware. Verificare: <code>show ip cef</code>, <code>show adjacency</code>.</p>
      </DeepDive>

      <Traps items={[
        <>Routerul <b>separă domeniile de broadcast</b>; fiecare interfață de router este și un domeniu de coliziune separat.</>,
        <><b>IP-urile rămân, MAC-urile se schimbă</b> la fiecare hop (fără NAT).</>,
        <>Default gateway = IP-ul interfeței routerului <b>din subnet-ul hostului</b>.</>,
        <><b>Prefixul cel mai lung</b> bate AD-ul mai mic: o rută OSPF /25 câștigă în fața unei rute statice /24 pentru o adresă din acel /25.</>,
        <>Ruta <code>0.0.0.0/0</code> = gateway of last resort. Fără ea, pachetele spre destinații necunoscute sunt <b>aruncate</b>.</>,
      ]} />
      <InlineQuiz ids={['1.1-018', '1.1-020', '1.1-022']} />
    </section>
  );
}

/* ======================================================================
   1.1.c — Next-generation firewalls and IPS
   ====================================================================== */
export function Firewalls() {
  return (
    <section id="firewalls" className="section">
      <SectionHead id="firewalls" code="1.1.c" title="Next-generation firewalls and IPS" />
      <Summary>
        <p>Un <G id="firewall" /> impune o <b>politică de securitate</b> între zone (inside, outside, <G id="dmz" />). Unul <G id="stateful" /> ține minte conexiunile și permite automat răspunsurile.
          Un <G id="ngfw" /> adaugă recunoașterea <b>aplicațiilor</b> și a utilizatorilor, <G id="ips" /> integrat, protecție anti-malware și filtrare URL.
          <G id="ips" /> stă <b>inline</b> și poate bloca atacuri; <G id="ids" /> primește doar o <b>copie</b> și alertează.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Istoria: packet filter → stateful → NGFW">
        <Table head={['Generație', 'Ce verifică', 'Ce problemă a rezolvat', 'Limita']} rows={[
          [<G id="packet-filter">Packet filter</G>, 'fiecare pachet separat, după IP-uri, protocol și porturi (L3–L4); de exemplu un ACL pe router', 'primul control al traficului între rețele', 'nu știe dacă un pachet e răspuns la o cerere legitimă → trebuie lăsate „găuri” mari pentru trafic de întoarcere'],
          [<G id="stateful">Stateful firewall</G>, <>la fel, plus <b>starea conexiunii</b> (tabela de stare, <G id="five-tuple">5-tuple</G>)</>, 'răspunsurile sunt permise automat, iar traficul nesolicitat din exterior e blocat implicit (Cisco PIX → ASA)', 'vede doar porturi: tot web-ul modern trece pe TCP 443, deci nu distinge o aplicație de alta'],
          [<G id="ngfw">NGFW</G>, 'tot ce face un stateful + aplicația (L7), utilizatorul, conținutul, reputația', 'poți scrie reguli ca „permite Webex, blochează jocurile online”, poți detecta atacuri și malware', 'mai complex, mai scump; inspecția TLS cere decriptare (cost de performanță și confidențialitate)'],
        ]} />
        <Analogy>Un packet filter e un portar care verifică doar adresa de pe colet. Un firewall stateful își notează cine a comandat ce și lasă să intre doar coletele așteptate. Un NGFW mai și deschide coletul, vede ce e înăuntru și știe cine din firmă l-a comandat.</Analogy>

        <h3>2. Cum lucrează un firewall stateful</h3>
        <p>Pentru fiecare conexiune pornită din interior, firewall-ul notează în <b>tabela de stare</b> adresele, porturile, protocolul și starea TCP. Un pachet venit din exterior este permis doar dacă se potrivește cu o intrare existentă (este un răspuns) sau dacă o regulă explicită îl permite.</p>
        <Figure caption="Interactiv: urmărește patru pachete și cum se schimbă tabela de stare.">
          <StatefulFirewall />
        </Figure>
        <h4>Zone de securitate</h4>
        <Table head={['Zonă', 'Nivel de încredere', 'Politica implicită tipică']} rows={[
          ['inside (LAN)', 'mare', 'poate iniția conexiuni spre outside și DMZ; răspunsurile revin automat'],
          ['DMZ', 'mediu', 'serverele publice; outside → DMZ doar pe porturile serviciilor (de exemplu 443); DMZ → inside, de regulă, interzis'],
          ['outside (Internet)', 'mic', 'nu poate iniția conexiuni spre inside'],
        ]} />

        <h3>3. Ce adaugă un NGFW</h3>
        <ul>
          <li><b>Application visibility and control</b> (<G id="avc" />): recunoaște aplicațiile după comportament și conținut, nu după port (Cisco anunță peste 4000 de aplicații recunoscute).</li>
          <li><b>IPS integrat</b> (la Cisco, bazat pe motorul open-source Snort).</li>
          <li><b>Malware protection</b>: analizează fișierele care trec, le compară cu baze de date și le poate rula într-un sandbox.</li>
          <li><b>URL filtering</b>: blochează categorii de site-uri (jocuri de noroc, phishing etc.).</li>
          <li><b>User identity</b>: regulile se scriu pe utilizatori și grupuri, nu doar pe IP-uri.</li>
          <li><b>TLS decryption</b> și <b>threat intelligence</b> actualizat automat (la Cisco: <G id="talos" />).</li>
        </ul>
        <p>Produse Cisco: <b>Cisco Secure Firewall</b> (software Threat Defense — FTD, fost Firepower NGFW), inclusiv variante virtuale. ASA a fost firewall-ul stateful clasic al Cisco.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 4. IDS și IPS">
        <p>Un sistem de detecție a intruziunilor analizează traficul și caută atacuri. Diferența dintre cele două este <b>locul</b> în care stau:</p>
        <Figure caption="Interactiv: IDS-ul primește o copie a traficului (out-of-band); IPS-ul este pe drumul traficului (inline).">
          <IdsVsIps />
        </Figure>
        <Table head={['', 'IDS', 'IPS']} rows={[
          ['Amplasare', <>out-of-band, primește o <b>copie</b> prin <G id="span" /> sau TAP (mod promiscuous)</>, <><b>inline</b> — traficul trece prin el</>],
          ['Acțiune', 'alertă, jurnal (eventual un TCP reset)', <><b>aruncă</b> pachetele malițioase în timp real</>],
          ['Impact asupra traficului', 'niciunul (atacul a ajuns deja la țintă)', 'adaugă puțină latență; dacă se defectează, poate opri traficul (de aceea există fail-open / bypass)'],
          ['Detecție', 'semnături, anomalii, reputație', 'aceleași'],
        ]} />
        <ul>
          <li><b>Detecție pe bază de semnături</b>: compară traficul cu tipare de atacuri cunoscute. Precisă, dar trebuie actualizată permanent și nu prinde atacurile noi.</li>
          <li><b>Detecție pe bază de anomalii</b>: învață „normalul” rețelei și semnalează abaterile. Poate prinde atacuri necunoscute (zero-day), dar dă mai multe alarme false.</li>
        </ul>
        <Callout kind="tip" title="NGFW vs NGIPS">
          Un <b>NGIPS</b> este un IPS care ține cont de context (ce sistem de operare are ținta, ce aplicații rulează, dacă e vulnerabilă la acel atac), ca să reducă alarmele inutile. Un NGFW modern <b>include</b> un NGIPS.
        </Callout>
      </Detailed>

      <Traps items={[
        <><b>IDS = pasiv</b> (copie, doar alertează). <b>IPS = inline</b> (poate bloca).</>,
        <>Un <b>ACL pe router este stateless</b>; un firewall stateful permite automat traficul de întoarcere.</>,
        <>NGFW-ul <b>păstrează</b> filtrarea stateful și adaugă peste ea: este un superset, nu un înlocuitor.</>,
        <>Ce îl face „next-generation”: <b>inspecția la nivelul aplicației</b> (AVC), nu doar porturi.</>,
        <><b>Talos</b> = echipa Cisco de threat intelligence care alimentează semnăturile IPS și listele de reputație.</>,
        <>Serverele publice se pun în <b>DMZ</b>, în spatele firewall-ului.</>,
      ]} />
      <InlineQuiz ids={['1.1-024', '1.1-025', '1.1-027']} />
    </section>
  );
}

/* ======================================================================
   1.1.d — Access points
   ====================================================================== */
export function AccessPoints() {
  return (
    <section id="ap" className="section">
      <SectionHead id="ap" code="1.1.d" title="Access points" />
      <Summary>
        <p>Un <G id="ap" /> creează o celulă radio Wi-Fi și leagă clienții wireless (802.11) de rețeaua cablată (802.3). Este un <b>bridge de nivel 2</b>, nu un router.
          De obicei e montat pe tavan, legat la un port de switch și alimentat prin <G id="poe" />. Totul despre radio, canale, SSID și criptare este în <Link to="/topic/1.11">topicul 1.11</Link>.</p>
      </Summary>
      <Detailed>
        <h3>Rolul AP-ului în rețea</h3>
        <ul>
          <li><b>Traduce cadre</b>: primește un cadru 802.11 de la laptop și îl trimite pe cablu ca un cadru Ethernet (și invers). Adresele IP nu se schimbă — de aceea este un dispozitiv L2.</li>
          <li><b>Anunță una sau mai multe rețele</b> (<G id="ssid">SSID-uri</G>), fiecare legată de obicei de un VLAN separat (angajați, oaspeți, IoT).</li>
          <li><b>Controlează accesul</b>: autentifică și criptează legătura radio (WPA2/WPA3).</li>
          <li><b>Împarte mediul</b>: toți clienții unui AP împart același canal radio (half-duplex, <G id="csma-ca" />) — spre deosebire de porturile unui switch.</li>
        </ul>
        <div className="photo-grid">
          <Photo file="aironet-1131ag.jpg" caption="AP enterprise Cisco Aironet 1131AG: se montează pe tavan, are un singur port Ethernet prin care primește și date, și curent (PoE)." />
        </div>
        <h3>Autonom sau lightweight?</h3>
        <Table head={['', <G id="autonomous-ap">AP autonom</G>, <G id="lightweight-ap">AP lightweight</G>]} rows={[
          ['Configurare', 'individuală, pe fiecare AP', 'centralizată, pe un WLC (vezi 1.1.e)'],
          ['Poate funcționa singur', 'da', <>nu — are nevoie de un <G id="wlc" /></>],
          ['Port de switch', <>de obicei <G id="trunk" /> (mai multe VLAN-uri)</>, 'de obicei access (traficul merge în tunel spre WLC, în modul Local)'],
          ['Potrivit pentru', 'acasă, birouri foarte mici', 'companii, campusuri, spitale'],
        ]} />
        <p className="small muted">Modurile AP-urilor (Local, FlexConnect, Monitor, Sniffer…) și arhitecturile wireless se studiază în topicurile 2.6–2.7. Un „router wireless” de acasă conține și un AP, dar funcția de AP rămâne L2.</p>
      </Detailed>
      <Traps items={[
        <>AP = <b>L2</b> (bridge 802.11 ↔ 802.3), nu L3. Nu rutează.</>,
        <>Un AP <b>lightweight</b> nu poate funcționa fără WLC.</>,
        <>Clienții unui AP <b>împart</b> lățimea de bandă a canalului (half-duplex); fiecare port de switch are lățime de bandă dedicată.</>,
      ]} />
      <InlineQuiz ids={['1.1-030', '1.1-031']} />
    </section>
  );
}

/* ======================================================================
   1.1.e — Controllers
   ====================================================================== */
export function Controllers() {
  return (
    <section id="controllers" className="section">
      <SectionHead id="controllers" code="1.1.e" title="Controllers — WLC și Catalyst Center" />
      <Summary>
        <p>Un <b>controller</b> administrează centralizat multe echipamente. Un <G id="wlc" /> gestionează AP-urile și WLAN-urile (configurație, canale, putere, roaming, autentificare).
          <G id="catalyst-center">Cisco Catalyst Center</G> (fost <b>DNA Center</b>) este controller-ul <G id="sdn" /> pentru <b>toată rețeaua</b> enterprise — switch-uri, routere, WLC-uri — cu automatizare, politici și monitorizare (assurance).</p>
      </Summary>
      <Detailed title="Explicația detaliată — 1. De ce au apărut controllerele">
        <p>Imaginează-ți un spital cu 500 de AP-uri autonome: fiecare trebuie configurat separat, fiecare își alege singur canalul și puterea, iar când un medic se mută cu tableta dintr-o cameră în alta, roamingul e lent pentru că AP-urile nu se „cunosc”. O schimbare de parolă înseamnă 500 de conectări. Asta nu scalează.</p>
        <p>Soluția a fost <b>împărțirea muncii</b> (arhitectura <i>split-MAC</i>): AP-ul <G id="lightweight-ap">lightweight</G> se ocupă doar de funcțiile radio în timp real (beacons, confirmări, criptare), iar <b>WLC</b>-ul face restul — configurație, autentificare, alegerea canalelor și a puterii (<G id="rrm" />), roaming, politici. AP-urile și WLC-ul comunică prin tuneluri <G id="capwap" /> (UDP 5246 pentru control, criptat cu DTLS, și UDP 5247 pentru date).</p>
        <Figure caption="Interactiv: trei generații de management wireless.">
          <WirelessMgmtEvolution />
        </Figure>
        <h3>Tipuri de WLC Cisco (pe scurt)</h3>
        <ul>
          <li><b>Appliance</b> dedicat în data center (de exemplu familia Catalyst 9800).</li>
          <li><b>Virtual / cloud</b> (Catalyst 9800-CL), pe un hypervisor sau în cloud public.</li>
          <li><b>Embedded</b>: rulează pe un switch Catalyst 9300 sau chiar pe un AP (pentru filiale mici).</li>
          <li><b>Cloud-managed</b>: AP-urile Meraki sunt gestionate dintr-un dashboard web în cloud.</li>
        </ul>
        <p className="small muted">Arhitecturile (centralizată, FlexConnect, cloud) și configurarea WLC-ului din GUI se studiază în 2.6, 2.7 și 2.9.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. Catalyst Center (fost DNA Center)">
        <p>Ideea controller-ului a fost extinsă de la wireless la <b>toată rețeaua</b>. Cisco DNA Center a apărut pentru rețelele bazate pe intenție (intent-based networking): administratorul spune <i>ce</i> vrea („angajații din HR au acces la serverul de salarii, oaspeții doar la Internet”), iar controller-ul traduce asta în configurații pe zeci sau sute de echipamente. În 2023, Cisco a redenumit produsul <b>Cisco Catalyst Center</b>; versiunile mai vechi ale API-ului păstrează numele DNA Center.</p>
        <Table head={['Flux de lucru', 'Ce face']} rows={[
          ['Design', 'definești site-uri (clădiri, etaje), adrese IP, setări comune (DNS, NTP, SNMP)'],
          ['Policy', 'scrii politici de acces și segmentare pe grupuri de utilizatori/dispozitive (SD-Access)'],
          ['Provision', 'aplici configurații automat, inclusiv pe echipamente noi (zero-touch), și actualizezi imaginile software'],
          ['Assurance', 'monitorizează sănătatea rețelei, clienților și aplicațiilor; analizează problemele cu AI/ML și propune soluții'],
        ]} />
        <p>Catalyst Center comunică cu aplicațiile prin <b>API-uri REST northbound</b> și cu echipamentele prin protocoale <b>southbound</b> (NETCONF/RESTCONF, CLI prin SSH, SNMP). Acestea sunt concepte din Domeniul 6 (6.1–6.3).</p>
        <h3>WLC vs Catalyst Center</h3>
        <Table head={['', 'WLC', 'Catalyst Center']} rows={[
          ['Ce gestionează', 'AP-uri și WLAN-uri (doar wireless)', 'toată rețeaua enterprise: switch-uri, routere, WLC-uri, AP-uri'],
          ['Traficul utilizatorilor trece prin el?', 'da, în modul Local (tunelurile CAPWAP ajung la WLC)', <><b>nu</b> — doar management și control</>],
          ['Rol principal', 'configurare AP, RRM, roaming, autentificarea clienților', 'automatizare, politici (SD-Access), assurance, API-uri'],
          ['Poate lipsi?', 'nu, dacă folosești AP-uri lightweight', 'da — rețeaua funcționează și fără el, doar că o administrezi manual'],
        ]} />
        <Analogy>WLC-ul este dispecerul unei flote de taxiuri: le spune mașinilor (AP-urilor) unde să stea și pe ce frecvență să vorbească. Catalyst Center este primăria care administrează tot traficul orașului — semafoare, drumuri, flote — fără să conducă ea însăși vreo mașină.</Analogy>
      </Detailed>
      <Traps items={[
        <><b>DNA Center = Catalyst Center</b> (același produs, redenumit în 2023).</>,
        <>Catalyst Center <b>nu</b> transportă traficul utilizatorilor.</>,
        <>„Controllers” din v1.1 înseamnă generic: WLC, Catalyst Center și controllere SDN în general.</>,
        <>CAPWAP: <b>UDP 5246</b> = control (criptat DTLS), <b>UDP 5247</b> = date.</>,
      ]} />
      <InlineQuiz ids={['1.1-032', '1.1-033', '1.1-035']} />
    </section>
  );
}

/* ======================================================================
   1.1.h — PoE
   ====================================================================== */
export function Poe() {
  return (
    <section id="poe" className="section">
      <SectionHead id="poe" code="1.1.h" title="PoE — Power over Ethernet" />
      <Summary>
        <p><G id="poe" /> trimite <b>curent continuu și date pe același cablu</b> de rețea. Sursa este <G id="pse" /> (un switch PoE sau un injector), consumatorul este <G id="pd" /> (AP, telefon IP, cameră).
          Standardele IEEE: <b>802.3af</b> (15.4 W la PSE), <b>802.3at</b> PoE+ (30 W), <b>802.3bt</b> (60 W și 90 W). La PD ajunge <b>mai puțin</b> decât trimite PSE-ul, din cauza pierderilor pe cablu.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Ce problemă a rezolvat PoE">
        <p>AP-urile se montează pe tavan, camerele pe stâlpi și pe fațade, telefoanele pe birouri — rareori lângă o priză. Fără PoE, ar trebui trasă o instalație electrică separată pentru fiecare. Cu PoE:</p>
        <ul>
          <li><b>un singur cablu</b> (date + curent) — instalare mai ieftină și mai rapidă;</li>
          <li><b>alimentare centralizată</b>: dacă switch-ul e pe un UPS, telefoanele și AP-urile funcționează și la o pană de curent;</li>
          <li><b>control de la distanță</b>: repornești un AP blocat oprind și pornind PoE pe port (<code>power inline never</code>, apoi <code>auto</code>) — fără scară;</li>
          <li><b>siguranță</b>: switch-ul nu trimite curent decât dacă detectează un PD compatibil, deci un laptop obișnuit conectat la un port PoE nu pățește nimic.</li>
        </ul>
        <p>Cisco a avut o soluție proprie înainte de standard (<i>Cisco inline power</i>, în jur de 10 W per port), iar IEEE a standardizat PoE în 2003. De atunci, puterea a crescut odată cu cerințele dispozitivelor: AP-urile Wi-Fi 6/7 cu multe radiouri, camerele PTZ cu motoare și încălzire, iluminatul LED, chiar și calculatoare mici.</p>

        <h3>2. Standardele — tabelul de știut</h3>
        <Table head={['Type', 'Standard', 'Nume uzual', 'An', 'Perechi', 'Max la PSE', 'Garantat la PD', 'Clase']} hlCol={5} rows={[
          ['1', '802.3af', 'PoE', '2003', '2', '15.4 W', '12.95 W', '0–3'],
          ['2', '802.3at', 'PoE+', '2009', '2', '30 W', '25.5 W', '0–4'],
          ['3', '802.3bt', 'PoE++ / 4PPoE', '2018', '4', '60 W', '51 W', '5–6 (și 1–4 pe 4 perechi)'],
          ['4', '802.3bt', 'PoE++ / 4PPoE', '2018', '4', '90 W', '71.3 W', '7–8'],
          ['—', <G id="upoe">Cisco UPOE</G>, 'proprietar Cisco', '2011', '4', '60 W', '51 W', '—'],
          ['—', 'Cisco UPOE+', '= 802.3bt Type 4 + compatibil UPOE', '—', '4', '90 W', '71.3 W', '—'],
        ]} />
        <Callout kind="exam" title="Cum să nu încurci cifrele">
          <b>a-f, a-t, b-t</b> sunt în ordine alfabetică și crescătoare: <b>af = 15.4 W</b>, <b>at = 30 W</b>, <b>bt = 60 / 90 W</b>. Valoarea „rotundă” (15.4, 30, 60, 90) este <b>la PSE</b> (switch); la PD ajunge mai puțin (12.95, 25.5, 51, 71.3), pentru că o parte se pierde ca căldură pe până la 100 m de cablu.
        </Callout>
        <h4>Clasele de putere</h4>
        <Table head={['Clasă', '0', '1', '2', '3', '4', '5', '6', '7', '8']} rows={[
          ['Max la PSE (W)', '15.4', '4.0', '7.0', '15.4', '30', '45', '60', '75', '90'],
          ['Max la PD (W)', '12.95', '3.84', '6.49', '12.95', '25.5', '40', '51', '62', '71.3'],
        ]} />
        <h4>Ce perechi poartă curentul</h4>
        <p>10/100BASE-T folosește doar perechile 1-2 și 3-6 pentru date. PoE Type 1/2 folosește 2 perechi: fie perechile de date (Mode A), fie cele libere 4-5 și 7-8 (Mode B). Gigabit Ethernet folosește toate cele 4 perechi pentru date, iar curentul circulă pe aceleași fire (în mod comun) fără să deranjeze datele. 802.3bt și UPOE trimit curent pe <b>toate cele 4 perechi</b> — de aici numele 4PPoE. Distanța maximă rămâne <b>100 m</b>, ca la Ethernet pe <G id="utp" />.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Cum pornește un PD: detecție, clasificare, alimentare">
        <Figure caption="Interactiv: parcurge pașii. Tensiunile sunt aproximative și orientative (standardul definește intervale).">
          <PoeSequence />
        </Figure>
        <p>Pe lângă clasificarea hardware, PD-ul poate negocia puterea exactă la nivel 2, prin <G id="cdp" /> (proprietar Cisco) sau <G id="lldp-med" /> (standard IEEE). Pentru PD-urile Type 3/4 (802.3bt), negocierea LLDP este obligatorie; la PoE+ este necesară pentru PD-urile care folosesc o singură etapă de clasificare. Avantajul: switch-ul rezervă exact cât are nevoie dispozitivul, nu maximul clasei, deci poate alimenta mai multe dispozitive din același buget.</p>
        <Callout kind="warn" title="Capcană frecventă">
          Puterea se negociază prin <b>CDP/LLDP</b>, nu prin DHCP. Iar telefonul IP Cisco află tot prin CDP (sau LLDP-MED) și <b>VLAN-ul de voce</b> în care trebuie să-și pună traficul (topicul 2.1).
        </Callout>
      </Detailed>

      <Detailed title="Explicația detaliată — 4. Bugetul de putere al switch-ului">
        <p>Un switch PoE nu poate da maximul pe toate porturile simultan. Sursa (sursele) lui de alimentare stabilește un <b>buget PoE total</b>, de exemplu 370 W sau 740 W. La fiecare PD conectat, switch-ul <b>rezervă</b> puterea clasei lui (sau valoarea negociată prin CDP/LLDP). Când bugetul se termină, următorul PD <b>nu mai primește curent</b>, chiar dacă portul e liber.</p>
        <h4>Exemplu rezolvat</h4>
        <p>Un switch de 24 de porturi are un buget PoE de <b>370 W</b>. Vrei să conectezi 10 telefoane IP (Class 2, 7 W), 2 camere (Class 3, 15.4 W) și 12 AP-uri Wi-Fi 6 (Class 4, 30 W).</p>
        <ul>
          <li>Telefoane: 10 × 7.0 = <b>70 W</b></li>
          <li>Camere: 2 × 15.4 = <b>30.8 W</b></li>
          <li>AP-uri: 12 × 30 = <b>360 W</b></li>
          <li>Total: 70 + 30.8 + 360 = <b>460.8 W</b> &gt; 370 W → lipsesc <b>90.8 W</b>.</li>
        </ul>
        <p>După telefoane și camere rămân 370 − 100.8 = 269.2 W, adică loc pentru doar <b>8 AP-uri</b> (8 × 30 = 240 W). Ultimele 4 AP-uri rămân stinse. Soluții: o sursă de alimentare mai mare (buget mai mare), un al doilea switch, injectoare <G id="midspan" /> pentru câteva AP-uri sau negocierea prin LLDP (dacă AP-urile consumă real mai puțin decât maximul clasei).</p>
        <Figure caption="Interactiv: alege bugetul, numărul de porturi și dispozitivele. Porturile verzi au curent, cele roșii au fost refuzate din lipsă de buget. Pornește de la exemplul de mai sus și mărește numărul de AP-uri la 12.">
          <PoeBudget />
        </Figure>
        <h4>Endspan vs midspan</h4>
        <ul>
          <li><b>Endspan</b>: switch-ul însuși este PSE (cazul obișnuit în companii).</li>
          <li><G id="midspan">Midspan</G> (injector PoE): un dispozitiv pus între un switch fără PoE și PD, care „injectează” curentul în cablu. Util pentru un singur AP sau o cameră.</li>
        </ul>
      </Detailed>

      <DeepDive title="Deep dive: comenzi și politici PoE pe switch-urile Cisco">
        <ul>
          <li><code>power inline auto</code> — implicit: detectează și alimentează automat orice PD, cât timp există buget.</li>
          <li><code>power inline never</code> — dezactivează PoE pe port (de exemplu pe porturile spre PC-uri sau spre alte switch-uri).</li>
          <li><code>power inline static max 30000</code> — rezervă dinainte puterea (în miliwați) pentru un dispozitiv critic, ca să nu rămână fără curent.</li>
          <li><code>power inline police</code> — oprește sau jurnalizează portul dacă PD-ul consumă mai mult decât i s-a alocat.</li>
          <li>Pe switch-urile Catalyst cu UPOE, comanda <code>hw-module … upoe-plus</code> schimbă modul de lucru al plăcii pentru compatibilitate 802.3bt.</li>
        </ul>
        <p>Exemple complete de configurare și verificare sunt în secțiunea următoare.</p>
      </DeepDive>

      <Traps items={[
        <><b>PSE</b> = sursa (switch, injector). <b>PD</b> = consumatorul (AP, telefon, cameră). Nu le inversa.</>,
        <>„PoE+ = 30 W” este valoarea <b>la PSE</b>. La PD ajung <b>25.5 W</b>.</>,
        <><b>af</b> = 15.4 W · <b>at</b> = 30 W · <b>bt</b> = 60 / 90 W (4 perechi).</>,
        <><b>UPOE</b> (60 W) este <b>proprietar Cisco</b>; UPOE+ (90 W) este compatibil 802.3bt.</>,
        <>Puterea se negociază prin <b>CDP / LLDP</b>, nu prin DHCP.</>,
        <>Distanța maximă rămâne <b>100 m</b>. Un dispozitiv fără semnătura PoE <b>nu primește</b> curent.</>,
      ]} />
      <InlineQuiz ids={['1.1-036', '1.1-037', '1.1-040', '1.1-041']} />
    </section>
  );
}
