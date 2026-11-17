import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { ApiLayers, FabricRoles, PlaneSeparation, UnderlayOverlay } from '../../diagrams/t6_3';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="6.3" title="Arhitectura SDN: overlay, underlay, fabric și API-uri — imaginea de ansamblu" />
      <Summary>
        <p>La 6.2 ai comparat modelele. La 6.3 vezi <b>cum este construită</b> o arhitectură definită prin software (<G id="sdn" />): controller-ul separă <b>planul de control</b> de <b>planul de date</b> (6.3.a); rețeaua fizică (<b>underlay</b>) transportă pachete IP, iar peste ea se construiește o rețea logică (<b>overlay</b>); împreună formează un <b>fabric</b>; iar controller-ul vorbește în sus cu aplicațiile (<b>northbound API</b>) și în jos cu echipamentele (<b>southbound API</b>, 6.3.b).</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Describe controller-based, software defined architecture (overlay, underlay, and fabric)</i>, cu două sub-puncte: <b>6.3.a</b> <i>Separation of control plane and data plane</i> și <b>6.3.b</b> <i>Northbound and Southbound APIs</i>. Este un obiectiv „Describe”: contează să înțelegi rolurile și să le recunoști în scenarii.</p>
        <Table head={['Cod Cisco', 'Tema', 'Secțiunea din lecție']} hlCol={0} rows={[
          ['6.3', 'Arhitectură SDN controller-based: overlay, underlay, fabric', 'Secțiunea „Underlay, overlay, fabric”'],
          ['6.3.a', 'Separarea control plane de data plane', 'Secțiunea „Separarea planurilor”'],
          ['6.3.b', 'API-uri northbound și southbound', 'Secțiunea „API-uri northbound și southbound”'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Predăm întâi 6.3.a (planurile — baza conceptuală), apoi underlay/overlay/fabric (6.3), apoi 6.3.b (API-uri). Codurile oficiale rămân neschimbate; ordinea este doar pedagogică.
        </Callout>
        <Analogy>Un oraș cu <b>străzi</b> (underlay: infrastructura fizică de transport) și <b>linii de autobuz exprese</b> care leagă anumite cartiere (overlay: rute logice construite peste străzi). Pasagerii (pachetele gazdelor) nu se interesează pe ce străzi trece autobuzul; o <b>direcție de trafic</b> (controller-ul) planifică liniile, iar aplicațiile ca aplicația de transport public cer informații prin „ghișeul” northbound.</Analogy>
      </Detailed>
      <Traps items={[
        <>Cisco Catalyst Center <b>nu</b> este un SDN „pur” cu control plane complet centralizat: este un controller de management/orchestrare; în SD-Access fabric-ul are propriul control plane (LISP).</>,
        <>Underlay și overlay sunt <b>ambele</b> necesare: overlay-ul nu poate exista fără o rețea IP de transport.</>,
        <>Northbound = spre <b>aplicații</b>; southbound = spre <b>echipamente</b>.</>,
      ]} />
      <InlineQuiz ids={['6.3-001', '6.3-002', '6.3-003']} />
    </section>
  );
}

/* ======================================================================
   1. Separarea planurilor (6.3.a)
   ====================================================================== */
export function PlanesSection() {
  return (
    <section id="planes" className="section">
      <SectionHead id="planes" code="6.3.a" title="Separarea control plane de data plane" />
      <Summary>
        <p>Un echipament clasic ține laolaltă „creierul” (<G id="control-plane" /> — decide unde merge traficul) și „mușchii” (<G id="data-plane" /> — mută pachetele). În SDN <b>creierul se mută</b> (total sau parțial) într-un controller, iar echipamentele rămân să execute: de aici expresia „separarea planurilor”.</p>
      </Summary>
      <Detailed title="1. Cele trei planuri, recapitulare">
        <Table head={['Plan', 'Întrebarea la care răspunde', 'Exemple', 'În echipamentul clasic']} hlCol={0} rows={[
          ['Data plane', 'Cum mut acest pachet acum?', 'Forwarding, ACL, NAT, QoS, încapsulare', 'Hardware (ASIC), la viteza liniei'],
          ['Control plane', 'Încotro ar trebui să meargă pachetele?', 'OSPF, BGP, STP, ARP, CDP', 'CPU-ul echipamentului, protocoale cu vecinii'],
          ['Management plane', 'Cum administrez echipamentul?', 'SSH, SNMP, NETCONF, API', 'Servicii de management ale echipamentului'],
        ]} />
        <p>În rețeaua tradițională cele trei planuri sunt în aceeași „cutie”, pe fiecare echipament. Fiecare router calculează singur căile și le programează singur în hardware. Funcționează, dar nimeni nu are imaginea globală și fiecare schimbare de politică se face pe fiecare echipament (6.2).</p>
      </Detailed>
      <Detailed title="2. Ideea SDN: logică centralizată, execuție distribuită">
        <p>Într-o arhitectură SDN modelul pe straturi arată astfel:</p>
        <Table head={['Strat', 'Rol', 'Exemple']} hlCol={0} rows={[
          ['Aplicații (application layer)', 'Exprimă nevoi: politici, orchestrare, analiză', 'Portal de self-service, aplicații de securitate, scripturi'],
          ['Control (controller)', 'Are imaginea globală și calculează regulile', 'Catalyst Center, OpenDaylight, APIC (ACI)'],
          ['Infrastructură (data plane)', 'Transmite pachetele conform regulilor primite', 'Switch-uri, routere, AP-uri'],
        ]} />
        <p>Controller-ul vede <b>întreaga topologie</b>, deci poate lua decizii globale (calea optimă pentru fiecare flux, izolare între segmente). Echipamentele păstrează <G id="data-plane" />: viteza liniei rămâne în hardware, nu trece prin controller. Regulile ajung la echipamente prin <b>API-uri southbound</b> (6.3.b).</p>
        <Figure caption="Interactiv: compară control distribuit și centralizat, apoi simulează o defecțiune de legătură.">
          <PlaneSeparation />
        </Figure>
      </Detailed>
      <Detailed title="3. Ce câștigi și ce riști prin separare">
        <Table head={['Beneficiu', 'Explicație']} hlCol={0} rows={[
          ['Vedere globală', 'Controller-ul cunoaște toată topologia; decizii optime la nivel de rețea'],
          ['Programabilitate', 'Comportamentul rețelei se schimbă din software, nu din firmware per echipament'],
          ['Consecvență', 'O singură sursă de politică, aplicată uniform'],
          ['Inovație rapidă', 'Funcții noi se adaugă în controller, nu în fiecare echipament'],
        ]} />
        <Table head={['Risc / compromis', 'Explicație']} hlCol={0} rows={[
          ['Dependență de controller', 'Pierderea controller-ului sau a legăturii cu el afectează luarea de decizii noi'],
          ['Scalare și latență', 'Controller-ul trebuie să țină pasul cu numărul de echipamente și de evenimente'],
          ['Securitate', 'Un controller compromis poate reprograma întreaga rețea'],
          ['Complexitate de migrare', 'Echipamentele existente nu suportă toate protocoalele SDN']
        ]} />
      </Detailed>
      <DeepDive title="SDN „pur” vs abordarea Cisco: grade de centralizare">
        <p>La un capăt este SDN-ul „de manual” (OpenFlow): switch-urile nu rulează protocoale de rutare, iar controller-ul programează direct tabelele de flux. La celălalt capăt sunt rețelele tradiționale cu un controller doar pentru management. Cisco folosește mai multe variante: în <b>Catalyst Center</b> (controller de management/orchestrare) echipamentele își păstrează o mare parte din control plane, iar în <b>SD-Access</b> fabric-ul are un control plane dedicat (LISP) separat de data plane (VXLAN). Pentru examen: <b>recunoaște ideea</b> (control separat de data) și diferențele dintre grade de centralizare.</p>
      </DeepDive>
      <Traps items={[
        <>Separarea planurilor <b>nu</b> înseamnă că pachetele utilizatorilor trec prin controller: data plane rămâne pe echipamente.</>,
        <>„SDN” nu înseamnă obligatoriu „fără protocoale de rutare”; depinde de arhitectură.</>,
        <>Management plane (administrare) ≠ control plane (decizii de forwarding).</>,
      ]} />
      <InlineQuiz ids={['6.3-004', '6.3-005', '6.3-006', '6.3-007', '6.3-008']} />
    </section>
  );
}

/* ======================================================================
   2. Underlay, overlay, fabric
   ====================================================================== */
export function FabricSection() {
  return (
    <section id="fabric" className="section">
      <SectionHead id="fabric" code="6.3" title="Underlay, overlay și fabric" />
      <Summary>
        <p><b><G id="underlay" /></b> = rețeaua fizică și logică de transport (cabluri, switch-uri, rutare IP). <b><G id="overlay" /></b> = rețeaua virtuală construită peste ea, prin încapsulare (tuneluri), în care trăiesc gazdele și politicile. <b><G id="network-fabric" /></b> = ansamblul underlay + overlay privit ca un singur sistem, administrat de un controller.</p>
      </Summary>
      <Detailed title="1. De ce există overlay-ul">
        <p>Rețelele clasice leagă segmentele logice (VLAN) de topologia fizică: un VLAN „curge” prin trunk-uri și poate cere STP, domenii L2 mari și configurări pe fiecare switch. Probleme: bucle L2, convergență lentă, limitarea la 4094 de VLAN-uri, mobilitate greoaie a gazdelor.</p>
        <p>Soluția: păstrează un <b>underlay simplu, rutat (L3)</b>, stabil și rapid, și construiește <b>servicii flexibile deasupra</b>, prin tuneluri. Dacă mâine vrei un segment nou sau o gazdă mutată, nu schimbi underlay-ul: schimbi doar overlay-ul (care este software).</p>
        <Table head={['', 'Underlay', 'Overlay']} hlCol={0} rows={[
          ['Ce este', 'Infrastructura de transport: legături, switch-uri/routere, adrese IP, protocol de rutare', 'Rețea logică/virtuală peste underlay, creată prin tuneluri/încapsulare'],
          ['Ce transportă', 'Pachete IP între nodurile fabric (adrese de infrastructură)', 'Traficul gazdelor și segmentele lor (VLAN/VRF virtuale)'],
          ['Cine îl cunoaște', 'Toate nodurile, inclusiv cele intermediare', 'Doar nodurile de margine (edge) și controller-ul/planul de control'],
          ['Cât se schimbă', 'Rar; trebuie stabil', 'Des; programabil din software'],
          ['Exemple de tehnologii', 'IS-IS/OSPF, legături rutate L3', 'VXLAN, GRE, IPsec, LISP (control)'],
        ]} />
      </Detailed>
      <Detailed title="2. Cum călătorește un pachet printr-un overlay — interactiv">
        <p>Alege pe rând punctele din drum și urmărește cum se schimbă antetele. Observă că routerele din underlay văd <b>doar</b> adresele exterioare.</p>
        <Figure caption="Interactiv: pachetul unei gazde, încapsulat VXLAN între două noduri edge, peste underlay.">
          <UnderlayOverlay />
        </Figure>
        <h4>Încapsularea pas cu pas</h4>
        <ol>
          <li>Gazda A trimite un pachet obișnuit către gazda B.</li>
          <li>Nodul edge de intrare află <b>unde</b> se află B (în SD-Access, întrebând planul de control prin LISP) — adică adresa nodului edge de ieșire.</li>
          <li>Nodul edge <b>încapsulează</b> pachetul original într-un pachet nou: Ethernet + IP exterior (adresele nodurilor) + UDP + antet <G id="vxlan" /> (identificatorul segmentului, <G id="vni" />, și informația de grup) + pachetul original.</li>
          <li>Underlay-ul rutează pachetul exterior ca pe orice pachet IP.</li>
          <li>Nodul edge de ieșire <b>decapsulează</b> și livrează pachetul original gazdei B.</li>
        </ol>
        <p>VXLAN folosește UDP cu portul destinație <b>4789</b> și un identificator de segment pe 24 de biți (VNI), adică peste 16 milioane de segmente față de 4094 de VLAN-uri. Încapsularea adaugă antete: MTU-ul underlay-ului trebuie să fie mai mare decât al gazdelor.</p>
        <Callout kind="warn" title="MTU și overlay">
          Fiecare tunel adaugă overhead (de ordinul zecilor de octeți). Dacă MTU-ul underlay-ului nu este mărit corespunzător, pachetele mari sunt fragmentate sau pierdute — o cauză clasică de „funcționează ping, dar nu merge transferul mare”.
        </Callout>
      </Detailed>
      <Detailed title="3. Fabric-ul ca sistem: exemplul SD-Access">
        <p>În <G id="sd-access" /> (soluția Cisco de campus bazată pe intenție), <b>fabric-ul</b> este alcătuit din noduri cu roluri clare. Alege un nod în schemă ca să-i vezi rolul:</p>
        <Figure caption="Interactiv: rolurile dintr-un fabric SD-Access (simplificat).">
          <FabricRoles />
        </Figure>
        <Table head={['Plan în SD-Access', 'Tehnologie', 'Rol']} hlCol={0} rows={[
          ['Control plane', <><G id="lisp" /></>, 'Ține corespondența „cine (identitate/adresă) → unde (locație/RLOC)”; nodurile edge o interoghează'],
          ['Data plane', <><G id="vxlan" /></>, 'Încapsulează traficul gazdelor între noduri; poartă și grupul pentru politică'],
          ['Policy plane', <><G id="sgt" /> (TrustSec)</>, 'Etichetează traficul cu grupul sursei; regulile spun ce grup poate vorbi cu ce grup'],
          ['Management/orchestrare', <><G id="catalyst-center" /> + <G id="cisco-ise" /></>, 'Proiectare, politici, provizionare, identitate, assurance'],
        ]} />
        <p>Observă cum arhitectura reia ideea separării planurilor: <b>control plane</b> (LISP), <b>data plane</b> (VXLAN) și <b>policy</b> (SGT) sunt componente distincte, iar un controller le orchestrează.</p>
      </Detailed>
      <DeepDive title="LISP și separarea identității de locație">
        <p>În rețelele clasice, adresa IP este și „cine ești”, și „unde ești”: când o gazdă se mută, adresa se schimbă sau rutarea se complică. <G id="lisp" /> separă cele două: <b>EID</b> (identificatorul gazdei) și <b>RLOC</b> (locația — adresa nodului edge). Când gazda se mută la alt edge, doar corespondența EID→RLOC se actualizează în control plane node, iar adresa gazdei rămâne aceeași. Asta oferă mobilitate fără reconfigurări ale underlay-ului.</p>
      </DeepDive>
      <Traps items={[
        <>Underlay-ul rutează <b>doar</b> adresele exterioare ale nodurilor; nu cunoaște adresele gazdelor din overlay.</>,
        <>Fabric = <b>underlay + overlay</b> (nu doar overlay-ul).</>,
        <>VXLAN: UDP 4789, VNI pe 24 de biți (≈16 milioane), față de 12 biți la VLAN (4094).</>,
        <>Catalyst Center este management/orchestrare; control plane-ul fabric-ului SD-Access este LISP, data plane-ul este VXLAN.</>,
      ]} />
      <InlineQuiz ids={['6.3-009', '6.3-010', '6.3-011', '6.3-012', '6.3-013', '6.3-014', '6.3-015']} />
    </section>
  );
}

/* ======================================================================
   3. API-uri northbound / southbound (6.3.b)
   ====================================================================== */
export function ApiSection() {
  return (
    <section id="apis" className="section">
      <SectionHead id="apis" code="6.3.b" title="API-uri northbound și southbound" />
      <Summary>
        <p>Un <G id="sdn-controller" /> are două „fețe”. <b><G id="northbound-api" /></b>: spre <b>aplicații</b> și automatizări — de obicei <b>REST</b> peste HTTPS, cu date JSON. <b><G id="southbound-api" /></b>: spre <b>echipamentele</b> de rețea — protocoale precum NETCONF, RESTCONF, OpenFlow, CLI/SSH, SNMP. Regula de memorat: <b>northbound = în sus, southbound = în jos</b>.</p>
      </Summary>
      <Detailed title="1. Cum arată conversația">
        <Figure caption="Interactiv: apasă pe fiecare protocol și vezi unde se plasează, ce transportă și cum se folosește.">
          <ApiLayers />
        </Figure>
        <p>Exemplu concret: un script cere controller-ului lista echipamentelor (northbound, REST); controller-ul interoghează switch-urile (southbound, de exemplu NETCONF sau SSH) și apoi răspunde scriptului cu JSON. Scriptul nu știe nimic despre protocoalele de sub controller; echipamentele nu știu nimic despre script.</p>
      </Detailed>
      <Detailed title="2. API-urile northbound">
        <ul>
          <li>Sunt interfața „de business”: <b>abstractizează</b> rețeaua (cere „inventarul”, „politica X”) fără detalii de echipament.</li>
          <li>Cel mai des <b>REST</b> (cereri HTTP/HTTPS, metode GET/POST/PUT/DELETE, JSON) — vezi 6.5. În Catalyst Center acestea sunt „Intent API”.</li>
          <li>Permit integrarea cu portaluri, ITSM, instrumente de securitate, scripturi (Python) și cu instrumente de automatizare (6.6).</li>
          <li>Necesită <b>autentificare</b> (token) și <b>autorizare</b>: tot ce poate cere un script, poate cere și un atacator cu tokenul respectiv.</li>
        </ul>
      </Detailed>
      <Detailed title="3. API-urile southbound">
        <Table head={['Protocol', 'Transport', 'Date', 'Observații']} hlCol={0} rows={[
          ['NETCONF', 'SSH, TCP 830', 'XML, modele YANG', 'Management programatic cu tranzacții (get-config, edit-config)'],
          ['RESTCONF', 'HTTPS', 'JSON/XML, modele YANG', 'Aceleași modele YANG, dar cu metode HTTP (stil REST)'],
          ['OpenFlow', 'TCP 6653', 'Mesaje de protocol', 'Programează direct tabelele de flux (SDN „pur”)'],
          ['CLI prin SSH', 'SSH, TCP 22', 'Text', 'Merge pe aproape orice; output nestructurat, fragil'],
          ['SNMP', 'UDP 161/162', 'MIB/OID', 'Inventar și monitorizare; configurare limitată'],
          ['OpFlex', 'Cisco ACI', 'Politică declarativă', 'Controller → noduri fabric; peste nivelul CCNA'],
        ]} />
        <p><G id="yang" /> este <b>limbajul de modelare</b> care descrie structura datelor de configurare și stare ale unui echipament; NETCONF și RESTCONF sunt <b>protocoale</b> care transportă date conforme cu acele modele. Un model YANG este ca o „schemă”: spune ce câmpuri există, ce tip au și ce valori acceptă.</p>
        <Callout kind="exam" title="Nu amesteca">
          YANG = model de date (schema). NETCONF = protocol peste SSH (XML). RESTCONF = protocol peste HTTPS (JSON/XML). REST = stil de API, de obicei northbound. Examenul cere să le <b>plasezi corect</b> și să știi ce cod/port folosesc.
        </Callout>
      </Detailed>
      <Detailed title="4. Cum recunoști direcția într-un scenariu">
        <Table head={['Scenariu', 'Direcție', 'De ce']} hlCol={0} rows={[
          ['Un script Python cere controller-ului inventarul', 'Northbound', 'Aplicația vorbește „în sus” cu controller-ul'],
          ['Controller-ul trimite configurația unui switch prin NETCONF', 'Southbound', 'Controller-ul vorbește „în jos” cu echipamentul'],
          ['Un portal de tichete creează o politică prin REST', 'Northbound', 'Aplicația cere un serviciu controller-ului'],
          ['Controller-ul citește contoarele unui router prin SNMP', 'Southbound', 'Colectare de la echipament'],
          ['Controller-ul programează o intrare de flux prin OpenFlow', 'Southbound', 'Regulă transmisă către echipament'],
        ]} />
        <p>Mai există „<b>east-west</b>” (între controller-e sau între instanțele unui cluster), dar nu face parte din cerințele 6.3.b.</p>
      </Detailed>
      <Traps items={[
        <>Northbound și southbound se confundă des: <b>southbound arată în jos, spre echipamente</b>.</>,
        <>REST este tipic <b>northbound</b>; NETCONF/RESTCONF/OpenFlow sunt tipic <b>southbound</b>. (RESTCONF poate fi și interfață directă către un echipament, fără controller.)</>,
        <>NETCONF: SSH, TCP <b>830</b>, XML — nu HTTP.</>,
        <>YANG nu este un protocol, ci un limbaj de modelare a datelor.</>,
      ]} />
      <InlineQuiz ids={['6.3-016', '6.3-017', '6.3-018', '6.3-019', '6.3-020', '6.3-021']} />
    </section>
  );
}
