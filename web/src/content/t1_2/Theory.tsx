import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Photo, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import {
  ArchCompare, CloudConnect, CloudStack, OversubCalc, SohoBox, TopologyShapes, TrafficFlows, WanHoming, WanServices, WanTopologies,
} from '../../diagrams/t1_2';

/* ======================================================================
   0. Introducere — de ce avem arhitecturi
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.2" title="Topologii de rețea — imaginea de ansamblu" />
      <Summary>
        <p>O <b>arhitectură de topologie</b> este „planul de urbanism” al unei rețele: ce echipamente există, pe ce straturi stau și cum sunt legate între ele.
          Cisco cere la 1.2 să recunoști șase arhitecturi: trei pentru rețele locale (<G id="two-tier" />, <G id="three-tier" />, <G id="spine-leaf" />), una pentru legăturile la distanță (<G id="wan" />), rețeaua mică (<G id="soho" />) și alegerea dintre <G id="on-premises" /> și <G id="cloud" />.
          Verbul este <b>Describe</b>: trebuie să le compari și să știi când se folosește fiecare, nu să le configurezi.</p>
      </Summary>

      <Detailed>
        <p>Dacă legi 5 switch-uri „cum se nimerește”, rețeaua funcționează. Dacă legi 500 la fel, ajungi la un haos: nimeni nu mai știe pe unde trece traficul, o buclă dintr-un dulap blochează toată clădirea, iar fiecare switch nou cere o reproiectare. <b>Designul ierarhic</b> rezolvă trei probleme:</p>
        <ul>
          <li><b>Scalabilitate</b> — rețeaua crește adăugând module identice (încă un bloc de access, încă o clădire), nu refăcând tot.</li>
          <li><b>Izolarea defectelor</b> — fiecare modul are un <G id="failure-domain" /> mic: o problemă locală rămâne locală.</li>
          <li><b>Predictibilitate</b> — știi dinainte pe unde merge traficul, câte echipamente traversează și ce se întâmplă când cade o legătură. Asta face depanarea și dimensionarea posibile.</li>
        </ul>
        <Table head={['Cod Cisco', 'Arhitectură', 'Unde o întâlnești', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['1.2.a', 'Two-tier (collapsed core)', 'campus mic/mediu, o clădire', 'Cum leg eficient switch-urile unei clădiri?'],
          ['1.2.b', 'Three-tier', 'campus mare, multe clădiri', 'Ce fac când am prea multe blocuri ca să le leg între ele?'],
          ['1.2.c', 'Spine-leaf', 'datacenter', 'Cum leg mii de servere care vorbesc mult între ele?'],
          ['1.2.d', 'WAN', 'sediu ↔ filiale ↔ datacenter', 'Cum leg site-uri aflate în orașe diferite?'],
          ['1.2.e', 'SOHO', 'acasă, birou foarte mic', 'Ce se află în „routerul de acasă”?'],
          ['1.2.f', 'On-premises și cloud', 'unde rulează serverele', 'Ce administrez eu și ce administrează providerul?'],
        ]} />
        <Callout kind="info" title="De ce predăm 1.2.b înaintea lui 1.2.a?">
          Two-tier se definește ca „three-tier cu două straturi contopite”. Ca să înțelegi ce se contopește, trebuie să știi întâi ce face fiecare strat (access, distribution, core). Istoric, ordinea e aceeași: întâi a apărut modelul pe trei niveluri, apoi varianta „comprimată” pentru site-urile mici. Păstrăm codurile oficiale, dar parcurgem b → a → c → d → e → f.
        </Callout>

        <h3>Topologie fizică vs. topologie logică</h3>
        <p><b><G id="physical-topology" /></b> descrie cablurile: din ce port pleacă și unde ajunge fiecare. <b><G id="logical-topology" /></b> descrie cum circulă datele: subrețele, <G id="vlan" />-uri, ce legături sunt active și ce legături stau blocate. Cele două pot arăta foarte diferit — de exemplu, trei switch-uri legate în triunghi formează fizic o buclă, dar logic <G id="stp" /> blochează o latură și traficul urmează un arbore.</p>

        <h3>Formele de bază</h3>
        <p>Toate arhitecturile din acest topic sunt construite din câteva forme simple. Comută între ele și observă cum crește numărul de legături:</p>
        <Figure caption="Interactiv: star, extended star, full mesh (cu număr variabil de noduri) și partial mesh.">
          <TopologyShapes />
        </Figure>
        <Table head={['Formă', 'Legături (n noduri)', 'Avantaj', 'Dezavantaj']} rows={[
          [<G id="star-topology" />, 'n (una per dispozitiv)', 'simplă, un cablu rupt afectează un singur dispozitiv', 'centrul = punct unic de defectare'],
          ['Extended star', 'stele legate la un centru', 'modulară — exact forma unui campus', 'centrul trebuie făcut redundant'],
          [<G id="full-mesh" />, 'n(n−1)/2', 'redundanță maximă, cale directă între oricare doi', 'cost și complexitate cresc cu pătratul lui n'],
          [<G id="partial-mesh" />, 'între n−1 și n(n−1)/2', 'redundanță acolo unde contează', 'trebuie proiectată atent'],
        ]} />
        <Analogy>Gândește-te la drumuri. Star = toate satele au drum doar spre orașul-reședință. Full mesh = fiecare sat are drum direct spre fiecare alt sat (scump și inutil pentru 100 de sate). Partial mesh = autostrăzi doar între orașele mari, drumuri simple în rest. Designul de rețea alege, ca urbanismul, combinația potrivită.</Analogy>
      </Detailed>

      <DeepDive title="Deep dive: de unde vine modelul ierarhic Cisco">
        <p>Modelul pe trei straturi (access/distribution/core) a fost popularizat de Cisco la sfârșitul anilor ’90, când rețelele de campus treceau de la hub-uri și routere la switch-uri. Ideea centrală — <b>modularitatea</b> — a rămas aceeași în ghidurile moderne (Cisco Campus LAN Design Guide, Cisco Validated Designs): campusul e împărțit în <b>blocuri</b> (un bloc = o pereche de distribution + switch-urile de access de sub ea), iar blocurile se leagă la un core comun.</p>
        <p>Aceeași gândire apare în datacenter sub altă formă: spine-leaf este tot un design ierarhic, dar pe două straturi și optimizat pentru alt tipar de trafic. Iar în WAN, „modulul” este site-ul (filiala), legat la un hub sau la un nor MPLS.</p>
      </DeepDive>

      <Traps items={[
        <>Full mesh cu <b>n</b> noduri = <b>n(n−1)/2</b> legături (5 → 10, 6 → 15). Nu uita împărțirea la 2.</>,
        <>Topologia <b>logică</b> poate diferi de cea <b>fizică</b> (STP, VLAN-uri, VPN-uri peste un nor de provider).</>,
        <>„Describe” = la examen recunoști și compari; comenzile din această lecție sunt doar ajutoare de înțelegere.</>,
      ]} />
      <InlineQuiz ids={['1.2-001', '1.2-002', '1.2-003']} />
    </section>
  );
}

/* ======================================================================
   1.2.b — Three-tier
   ====================================================================== */
export function ThreeTier() {
  return (
    <section id="three-tier" className="section">
      <SectionHead id="three-tier" code="1.2.b" title="Three-tier — access, distribution, core" />
      <Summary>
        <p>Designul <G id="three-tier" /> împarte campusul în trei straturi cu roluri clare: <b><G id="access-layer" /></b> (aici se conectează dispozitivele), <b><G id="distribution-layer" /></b> (agregare, granița L2/L3, politici) și <b><G id="core-layer" /></b> (transport rapid între blocuri).
          Fiecare bloc de distribuție se leagă doar la core, așa că rețeaua crește <b>liniar</b>: o clădire nouă = un bloc nou + legăturile lui spre core.</p>
      </Summary>

      <Detailed title="Explicația detaliată — rolul fiecărui strat">
        <h3>Access layer — „priza” rețelei</h3>
        <p>Switch-urile de access stau în dulapurile de pe fiecare etaj și au multe porturi (24 sau 48). La ele se leagă PC-uri, imprimante, telefoane IP, camere și <G id="ap" />-uri. Pentru că sunt cel mai aproape de utilizatori, aici se aplică funcțiile „de margine”:</p>
        <ul>
          <li><b><G id="poe" /></b> — alimentarea telefoanelor, AP-urilor și camerelor prin cablu (topicul 1.1.h).</li>
          <li><b>Asignarea VLAN-ului</b> fiecărui port (topicul 2.1) și <b>port security</b> / <G id="dot1x" /> (topicul 5.7).</li>
          <li><b>Marcarea QoS</b> a traficului de voce și protecții STP de margine (PortFast, BPDU Guard).</li>
        </ul>
        <p>De obicei switch-urile de access sunt <G id="l2-switch" />-uri: nu rutează, doar comută cadre în interiorul VLAN-urilor.</p>

        <h3>Distribution layer — „punctul de politică”</h3>
        <p>O pereche de <G id="multilayer-switch" />-uri pentru fiecare bloc (de obicei o clădire). Fiecare switch de access are câte un uplink spre <b>fiecare</b> dintre cele două (dual-homing). Distribution-ul:</p>
        <ul>
          <li><b>agregă</b> uplink-urile de la access (de aceea se mai numește <i>aggregation layer</i>);</li>
          <li>este <b>granița dintre nivelul 2 și nivelul 3</b>: găzduiește <G id="svi" />-urile care sunt <G id="default-gateway" /> pentru VLAN-uri, cu redundanță prin <G id="fhrp" />;</li>
          <li>aplică <b>politici</b>: ACL-uri între VLAN-uri, QoS, sumarizarea rutelor spre core;</li>
          <li><b>izolează</b>: o buclă sau o furtună de broadcast dintr-un bloc nu trece de granița L3.</li>
        </ul>

        <h3>Core layer — „autostrada”</h3>
        <p>O pereche (sau mai multe) de switch-uri L3 foarte rapide, legate redundant de fiecare pereche de distribution. Regula de aur: <b>core-ul nu face nimic care să-l încetinească</b>. Fără ACL-uri complexe, fără inspecție de trafic, fără dispozitive finale. Trebuie doar să comute cât mai repede și să conveargă rapid când cade o legătură. Legăturile spre distribution sunt de obicei <b>L3 (routed)</b>, deci pot fi folosite toate simultan (<G id="ecmp" />).</p>

        <Table head={['Strat', 'Se conectează la', 'Funcții tipice', 'Echipament tipic Cisco']} hlCol={0} rows={[
          ['Access', 'dispozitive finale, AP-uri, telefoane', 'PoE, VLAN pe port, port security, 802.1X, marcare QoS, PortFast/BPDU Guard', 'Catalyst 9200 / 9300 (L2)'],
          ['Distribution', 'uplink-urile de la access', 'agregare, granița L2/L3, SVI + FHRP, ACL, QoS, sumarizare', 'Catalyst 9300 / 9400 / 9500 (L3)'],
          ['Core', 'perechile de distribution', 'transport L3 rapid și redundant, convergență rapidă, fără politici', 'Catalyst 9500 / 9600 (L3)'],
        ]} />
        <Analogy>Gândește-te la rețeaua rutieră a unei țări. Access = străzile de cartier, unde fiecare casă are acces (și unde sunt limitatoarele de viteză și semafoarele — politicile locale). Distribution = drumurile județene care adună traficul din cartiere și unde se face controlul (vama, semnele de direcție). Core = autostrada: fără semafoare, fără intrări de case, doar viteză între orașe.</Analogy>
      </Detailed>

      <Detailed title="Explicația detaliată — de ce un strat de core separat?">
        <p>Imaginează-ți un campus cu mai multe clădiri, fiecare cu blocul ei de distribution. Fără core, fiecare bloc trebuie legat de fiecare alt bloc ca traficul să circule direct — un full mesh. Cu <b>n</b> blocuri ai nevoie de n(n−1)/2 conexiuni bloc-la-bloc (fiecare formată, de fapt, din mai multe cabluri, pentru redundanță):</p>
        <Table head={['Blocuri de distribuție', 'Fără core (full mesh între blocuri)', 'Cu core (fiecare bloc → core)']} rows={[
          ['2', '1', '2'], ['3', '3', '3'], ['5', '10', '5'], ['8', '28', '8'],
        ]} />
        <p>La 2–3 blocuri diferența e mică, de aceea site-urile mici aleg two-tier. Peste acest prag, core-ul simplifică dramatic cablarea și face ca adăugarea unei clădiri să coste doar legăturile ei spre core. Pragul exact ține de proiect — ghidurile Cisco recomandă un core separat de la câteva blocuri în sus sau când clădirile sunt distribuite pe un campus întins.</p>
        <Figure caption="Interactiv: aceeași rețea de 8 dispozitive în cele trei arhitecturi. Alege o pereche (sau click pe două dispozitive) și urmărește calea, numărul de switch-uri traversate și numărul de căi active. Bifează STP ca să vezi legăturile blocate.">
          <ArchCompare />
        </Figure>
        <p>În three-tier, două PC-uri din <b>blocuri diferite</b> (A → H) traversează <b>5</b> switch-uri: access → distribution → core → distribution → access. Două PC-uri din același bloc traversează 3. Numărul de hopuri depinde deci de „unde” sunt dispozitivele — o observație importantă pentru secțiunea spine-leaf.</p>
      </Detailed>

      <DeepDive title="Deep dive: three-tier în datacenterele de altădată">
        <p>Până pe la mijlocul anilor 2010, și datacenterele foloseau trei straturi: <b>access</b> (switch-urile din rack, „top of rack”), <b>aggregation</b> (echivalentul distribution-ului, unde stăteau adesea firewall-urile și load balancerele) și <b>core</b>. VLAN-urile serverelor se întindeau peste mai multe rack-uri (ca VM-urile să se poată muta), deci domeniul de nivel 2 era mare și depindea de <G id="stp" />. STP bloca jumătate din legăturile redundante, iar serverele din pod-uri diferite comunicau prin 5 switch-uri. Când traficul server ↔ server a explodat, aceste limite au dus la spine-leaf (1.2.c).</p>
      </DeepDive>

      <Traps items={[
        <><b>Distribution</b> este de obicei granița L2/L3 (SVI-uri, FHRP), nu access și nu core.</>,
        <><b>Core-ul</b> nu face filtrare complexă și nu are dispozitive finale — doar transport rapid și redundant.</>,
        <>Dispozitivele finale (PC, telefon, AP) se conectează la <b>access</b>.</>,
        <>Motivul pentru un core separat: legăturile dintre blocuri cresc pătratic fără el; cu el, cresc liniar.</>,
      ]} />
      <InlineQuiz ids={['1.2-005', '1.2-006', '1.2-007', '1.2-010']} />
    </section>
  );
}

/* ======================================================================
   1.2.a — Two-tier (collapsed core)
   ====================================================================== */
export function TwoTier() {
  return (
    <section id="two-tier" className="section">
      <SectionHead id="two-tier" code="1.2.a" title="Two-tier — collapsed core" />
      <Summary>
        <p>Designul <G id="two-tier" /> păstrează stratul de access, dar <b>contopește</b> distribution-ul și core-ul în aceeași pereche de switch-uri — de aici numele <G id="collapsed-core" />.
          Mai puține echipamente, mai ieftin, mai simplu. Este alegerea standard pentru o clădire sau un sediu mic/mediu cu un singur bloc.</p>
      </Summary>

      <Detailed>
        <h3>Cum arată</h3>
        <p>Două switch-uri multilayer centrale (core/distribution) legate între ele, iar fiecare switch de access are câte un uplink spre fiecare dintre ele. Perechea centrală face simultan tot ce făceau distribution și core: agregare, SVI-uri și default gateway, politici, rutare spre routerul de WAN/Internet și spre firewall.</p>
        <p>În diagrama interactivă de mai sus (tab-ul <b>Two-tier</b>), orice PC ajunge la orice alt PC de pe alt switch prin <b>3</b> switch-uri: access → core/distribution → access.</p>

        <h3>Când e potrivit și când nu</h3>
        <Table head={['', 'Two-tier (collapsed core)', 'Three-tier']} rows={[
          ['Mărime tipică', 'o clădire, un bloc de distribuție', 'mai multe clădiri/blocuri'],
          ['Echipamente', 'mai puține (fără core separat)', 'mai multe (pereche de core în plus)'],
          ['Cost', 'mai mic', 'mai mare'],
          ['Administrare', 'mai simplă', 'mai complexă'],
          ['Scalare', 'limitată — blocurile noi trebuie legate între ele', 'liniară — fiecare bloc nou se leagă doar la core'],
          ['Izolarea defectelor', 'o problemă la perechea centrală afectează tot site-ul', 'core-ul și blocurile sunt separate'],
        ]} />
        <Callout kind="tip" title="Evoluția naturală a unei rețele">
          O firmă începe cu un singur switch. Crește, adaugă switch-uri de access și o pereche centrală → <b>two-tier</b>. Mai cumpără două clădiri, fiecare cu perechea ei de distribution → legăturile dintre perechi încep să se înmulțească → adaugă un <b>core</b> și ajunge la <b>three-tier</b>. Labul ghidat de la finalul lecției reproduce exact această evoluție.
        </Callout>

        <h3>Redundanța uplink-urilor și STP</h3>
        <p>Fiecare switch de access are două uplink-uri (<b>dual-homed</b>). Dacă rețeaua dintre access și distribution este de nivel 2 (VLAN-urile ajung pe ambele switch-uri centrale), cele două uplink-uri plus legătura dintre switch-urile centrale formează un triunghi — o buclă. <G id="stp" /> o rupe blocând un port. Bifează „L2 clasic cu STP” în diagrama interactivă: jumătate din uplink-uri devin <b>BLK</b>, iar numărul de căi active scade la 1.</p>
        <p>Soluțiile moderne care evită această risipă: <G id="etherchannel" /> peste două switch-uri centrale care se comportă ca unul singur (StackWise Virtual, VSS) sau uplink-uri L3 până la access („routed access”). Le vei întâlni în domeniile 2 și 3.</p>
        <Analogy>Un magazin mic nu are nevoie de depozit regional și de centru logistic național: are un singur depozit (collapsed core) din care se aprovizionează toate rafturile (access). Abia când lanțul are zeci de magazine merită construit un centru logistic separat (core).</Analogy>
      </Detailed>

      <Traps items={[
        <><b>Two-tier = collapsed core</b>: core și distribution sunt aceleași switch-uri.</>,
        <>Two-tier <b>are</b> funcții de distribution — doar că nu are switch-uri de core separate.</>,
        <>Spine-leaf are tot două straturi, dar <b>nu</b> este „two-tier campus”: e arhitectură de datacenter, cu reguli proprii.</>,
      ]} />
      <InlineQuiz ids={['1.2-011', '1.2-012', '1.2-014']} />
    </section>
  );
}

/* ======================================================================
   1.2.c — Spine-leaf
   ====================================================================== */
export function SpineLeaf() {
  return (
    <section id="spine-leaf" className="section">
      <SectionHead id="spine-leaf" code="1.2.c" title="Spine-leaf — arhitectura datacenterului modern" />
      <Summary>
        <p>În <G id="spine-leaf" />, serverele se conectează la switch-uri <b>leaf</b>, iar <b>fiecare leaf se leagă la fiecare spine</b>. Leaf-urile nu se leagă între ele, spine-urile nici atât.
          Cu legături L3 și <G id="ecmp" />, orice server ajunge la orice alt server prin <b>leaf → spine → leaf</b>: același număr de hopuri, toate legăturile active. Este răspunsul la explozia traficului <G id="east-west" />.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Problema: traficul și-a schimbat direcția">
        <p>Aplicațiile clasice erau simple: un utilizator cere o pagină, serverul răspunde. Traficul intra și ieșea din datacenter — <b><G id="north-south" /></b>. Designul three-tier era perfect pentru asta.</p>
        <p>Apoi au venit virtualizarea (topicul 1.12), microserviciile, bazele de date distribuite, replicarea storage-ului și, recent, clusterele de antrenare AI. O singură cerere a unui utilizator poate genera zeci de cereri <b>între servere</b>: web → aplicație → autentificare → bază de date → cache → storage. Acesta este traficul <b><G id="east-west" /></b>, care azi domină în datacentere.</p>
        <Figure caption="Interactiv: north-south (client ↔ server) vs. east-west (server ↔ server).">
          <TrafficFlows />
        </Figure>
        <p>Pentru east-west, three-tier-ul clasic avea trei probleme:</p>
        <ol>
          <li><b>Hopuri inegale</b> — serverele din același rack comunicau prin 1 switch, cele din rack-uri diferite prin 3 sau 5. Latența depindea de „noroc”.</li>
          <li><b>STP risipea bandă</b> — domeniile L2 mari depindeau de <G id="stp" />, care bloca jumătate din legăturile redundante.</li>
          <li><b>Scalare verticală</b> — mai multă capacitate însemna switch-uri de aggregation/core mai mari și mai scumpe, nu „încă unul la fel”.</li>
        </ol>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. Soluția: Clos pe două straturi">
        <p>Spine-leaf este o aplicare a rețelei <G id="clos" />, inventată în 1953 de Charles Clos pentru centralele telefonice: în loc de un comutator uriaș, multe comutatoare mici legate în etaje, cu multe căi paralele. Regulile sunt puține și stricte:</p>
        <Table head={['Legătură', 'Există?', 'De ce']} rows={[
          ['leaf ↔ fiecare spine', <b>DA</b>, 'full mesh între straturi — fiecare leaf are o cale prin fiecare spine'],
          ['leaf ↔ leaf', <b>NU</b>, 'ar crea căi mai scurte pentru unii și ar strica simetria'],
          ['spine ↔ spine', <b>NU</b>, 'spine-urile nu au nevoie să vorbească între ele — doar transportă între leaf-uri'],
          ['server / storage / firewall ↔ leaf', <b>DA</b>, 'tot ce nu e spine se conectează la un leaf (inclusiv „border leaf” spre WAN/Internet)'],
          ['server ↔ spine', <b>NU</b>, 'spine-urile sunt doar coloana vertebrală'],
        ]} />
        <p>Consecințele, pe care le vezi în diagrama interactivă de mai sus (tab-ul <b>Spine-leaf</b>):</p>
        <ul>
          <li><b>Hop count egal</b>: orice server de pe un leaf → orice server de pe alt leaf = 3 switch-uri. Latență previzibilă.</li>
          <li><b>Toate legăturile active</b>: legăturile leaf–spine sunt de obicei <b>L3</b> (routed). Nu există bucle L2, deci nu e nevoie de STP pe ele, iar <G id="ecmp" /> împarte fluxurile pe toate spine-urile. Cu 4 spine-uri, fiecare leaf are 4 căi de cost egal.</li>
          <li><b>Degradare grațioasă</b>: dacă un spine din 4 cade, se pierde doar ¼ din capacitate, nu conectivitatea.</li>
          <li><b>Scalare orizontală</b>: nevoie de mai multă bandă între leaf-uri → adaugi un spine. Nevoie de mai multe porturi pentru servere → adaugi un leaf (și îl legi la toate spine-urile).</li>
        </ul>
        <Analogy>Un aeroport cu terminale (leaf) și o rețea de autobuze (spine). Fiecare autobuz oprește la fiecare terminal. Oricare două terminale sunt la exact o călătorie distanță, cu orice autobuz. Dacă un autobuz se strică, iei următorul; dacă e aglomerat, compania mai adaugă un autobuz pe același traseu circular.</Analogy>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Oversubscription (cu exemplu calculat)">
        <p><G id="oversubscription" /> este raportul dintre lățimea de bandă spre dispozitive și lățimea de bandă a uplink-urilor:</p>
        <p style={{ textAlign: 'center' }}><code>oversubscription = (nr. porturi × viteză port) : (nr. uplink-uri × viteză uplink)</code></p>
        <ul>
          <li><b>Exemplu campus:</b> switch de access cu 48 × 1 Gbps și 2 uplink-uri de 10 Gbps → 48 Gbps : 20 Gbps = <b>2.4 : 1</b>. E acceptabil: nu toate PC-urile transmit simultan la viteză maximă.</li>
          <li><b>Exemplu leaf (din ghidurile Cisco pentru datacentere mari):</b> 48 × 25 Gbps spre servere și 8 uplink-uri de 100 Gbps spre 8 spine-uri → 1200 : 800 = <b>1.5 : 1</b>. Cu doar 4 spine-uri: 1200 : 400 = 3 : 1. Numărul de spine-uri controlează direct raportul.</li>
          <li><b>1 : 1 = non-blocking</b> — uplink-urile pot transporta tot ce pot trimite serverele. Se folosește în clusterele AI, unde toate GPU-urile comunică intens simultan.</li>
        </ul>
        <Figure caption="Interactiv: schimbă porturile și uplink-urile și urmărește raportul. Încearcă presetările.">
          <OversubCalc />
        </Figure>
      </Detailed>

      <DeepDive title="Deep dive: ce rulează peste fabric (VXLAN, EVPN, ACI)">
        <p>Dacă legăturile leaf–spine sunt L3, cum pui două VM-uri din rack-uri diferite în același VLAN (de exemplu pentru migrarea live a unei VM)? Răspunsul este un <b>overlay</b>: <G id="vxlan" /> încapsulează cadrele Ethernet în pachete UDP/IP care traversează fabric-ul routed. Leaf-urile devin capete de tunel (VTEP), iar BGP EVPN le spune unde se află fiecare adresă MAC/IP. Cisco implementează asta în Nexus 9000 fie cu NX-OS (VXLAN EVPN), fie cu ACI (controller APIC). Toate acestea sunt peste nivelul CCNA (DCCOR/ENCOR) — la CCNA e suficient să știi că fabric-ul este L3 „dedesubt” și poate oferi L2 „deasupra”.</p>
        <p>Fabricurile foarte mari adaugă un al treilea etaj (super-spine) care leagă mai multe pod-uri spine-leaf; principiul rămâne același.</p>
      </DeepDive>

      <Traps items={[
        <><b>Fiecare leaf ↔ fiecare spine</b>; <b>leaf ↔ leaf</b> și <b>spine ↔ spine</b> NU.</>,
        <>Serverele (și firewall-urile, routerele de margine) se conectează la <b>leaf</b>, niciodată la spine.</>,
        <>Orice leaf → alt leaf = <b>leaf → spine → leaf</b>: același număr de hopuri pentru orice pereche.</>,
        <>Spine-leaf = <b>datacenter</b>, optimizat pentru <b>east-west</b>. Two-/three-tier = <b>campus</b>.</>,
        <>Mai multă bandă între leaf-uri → <b>adaugi spine-uri</b>. Mai multe porturi → <b>adaugi leaf-uri</b>.</>,
      ]} />
      <InlineQuiz ids={['1.2-015', '1.2-017', '1.2-018', '1.2-020']} />
    </section>
  );
}

/* ======================================================================
   1.2.d — WAN
   ====================================================================== */
export function Wan() {
  return (
    <section id="wan" className="section">
      <SectionHead id="wan" code="1.2.d" title="WAN — legarea site-urilor aflate la distanță" />
      <Summary>
        <p>Un <G id="wan" /> leagă site-uri din orașe sau țări diferite, aproape întotdeauna prin infrastructura unui operator. Îl descrii pe două axe:
          <b> topologia</b> (<G id="point-to-point" />, <G id="hub-and-spoke" />, full mesh, partial mesh; <G id="single-homed" /> vs. <G id="dual-homed" />) și
          <b> serviciul</b> folosit (<G id="leased-line" />, <G id="mpls" />, <G id="metro-ethernet" />, <G id="vpn" /> peste Internet).</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Topologii WAN">
        <p>În LAN cablezi tu tot. În WAN nu poți trage fibră între București și Cluj — închiriezi servicii. De aceea fiecare legătură WAN costă lunar, iar alegerea topologiei e în primul rând o decizie de <b>cost vs. redundanță vs. performanță</b>.</p>
        <Figure caption="Interactiv: alege topologia și numărul de site-uri. La hub-and-spoke urmărește traficul filială → filială prin hub.">
          <WanTopologies />
        </Figure>
        <Table head={['Topologie', 'Descriere', 'Avantaje', 'Dezavantaje']} hlCol={0} rows={[
          ['Point-to-point', '2 site-uri, o legătură dedicată (leased line, E-Line)', 'simplă, privată, capacitate garantată', 'cost mare per pereche de site-uri'],
          ['Hub-and-spoke', 'filialele (spokes) se leagă doar la un site central (hub)', 'n − 1 legături, politici și securitate centralizate', 'hub = punct unic de defectare și gâtuire; filială ↔ filială prin hub (latență)'],
          ['Full mesh', 'fiecare site cu fiecare site', 'cale directă optimă, redundanță maximă', 'n(n−1)/2 legături — scump și complex'],
          ['Partial mesh', 'doar site-urile importante legate între ele', 'echilibru cost/redundanță', 'trebuie proiectat atent'],
        ]} />
        <p>Atenție: aceste forme pot fi <b>logice</b>. Cu MPLS, fiecare site are fizic o singură legătură spre operator, dar logic toate comunică între ele (full mesh). Cu VPN-uri peste Internet, tunelurile pot forma un hub-and-spoke peste o infrastructură fizică complet diferită.</p>

        <h3>Câte legături spre ISP? Single-homed, dual-homed, multihomed</h3>
        <p>A doua întrebare de topologie privește conexiunea unui site la furnizor (<G id="isp" />):</p>
        <Figure caption="Interactiv: patru niveluri de redundanță la conectarea unui site.">
          <WanHoming />
        </Figure>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. Servicii WAN (ce problemă a rezolvat fiecare)">
        <h4>Linia închiriată (leased line) — anii ’70–2000</h4>
        <p>Primul răspuns la „cum leg două clădiri din orașe diferite”: operatorul îți rezervă un circuit dedicat, punct-la-punct, cu capacitate fixă (în Europa E1 = 2.048 Mbps, în SUA T1 = 1.544 Mbps). Pe el rulau protocoale de nivel 2 seriale, HDLC sau PPP. Avantaj: capacitate garantată, nepartajată. Problemă: cost mare care crește cu distanța și cu fiecare pereche de site-uri — pentru 10 filiale în full mesh ar fi trebuit 45 de linii.</p>

        <h4>MPLS — WAN privat „oricine cu oricine”</h4>
        <p><G id="mpls" /> a rezolvat problema numărului de circuite: fiecare site are <b>o singură</b> legătură spre operator, iar operatorul asigură conectivitatea între toate site-urile clientului. Rolurile:</p>
        <ul>
          <li><b><G id="ce-router" /></b> — routerul tău, la marginea site-ului. Trimite pachete IP normale și schimbă rute cu PE-ul (static, OSPF, EIGRP sau BGP).</li>
          <li><b><G id="pe-router" /></b> — routerul operatorului la care se leagă CE-ul. Ține rutele fiecărui client separat (VRF) și pune/scoate etichetele MPLS.</li>
          <li><b>P (Provider)</b> — routerele din interiorul rețelei operatorului; comută doar după etichetă.</li>
        </ul>
        <p>Serviciul MPLS L3VPN oferă conectivitate any-to-any, QoS (prioritizarea vocii) și izolare între clienți. Este încă răspândit la bănci și lanțuri de retail.</p>

        <h4>Metro Ethernet — WAN-ul care arată ca un LAN</h4>
        <p>Cu <G id="metro-ethernet" />, operatorul îți dă un port Ethernet obișnuit (RJ45 sau fibră), iar site-urile comunică ca și cum ar fi pe același switch uriaș. Avantaje: interfață familiară, viteze mari (de la 10 Mbps la 10/100 Gbps), preț per Mbps mic. Serviciile definite de MEF:</p>
        <Table head={['Serviciu', 'Topologie logică', 'Exemplu']} rows={[
          [<G id="e-line" />, 'point-to-point', 'sediu ↔ datacenter'],
          [<G id="e-lan" />, 'full mesh (multipunct)', 'toate clădirile firmei dintr-un oraș'],
          [<G id="e-tree" />, 'hub-and-spoke (rădăcină–frunze)', 'sediu + filiale care nu trebuie să se vadă între ele'],
        ]} />

        <h4>Internet VPN — WAN-ul ieftin</h4>
        <p>Accesul la Internet a devenit ieftin și disponibil peste tot (fibră <G id="ftth" />, cablu, <G id="dsl" />, 4G/5G). Ideea: în loc de un circuit privat, folosești Internetul și construiești deasupra lui un tunel criptat (<G id="vpn" />).</p>
        <ul>
          <li><b>Site-to-site VPN</b> — două routere sau firewall-uri construiesc permanent un tunel <G id="ipsec" />; utilizatorii nu observă nimic.</li>
          <li><b>Remote-access VPN</b> — un client software pe laptopul angajatului (IPsec sau TLS, de exemplu Cisco Secure Client) creează tunelul la cerere.</li>
        </ul>
        <p>Compromisul: cost mic și acoperire mare, dar <b>fără garanții de calitate</b> — nimeni nu controlează drumul prin Internet. De aici a apărut <G id="sd-wan" />: un controller folosește simultan MPLS, Internet și 4G/5G și alege, per aplicație, calea cu cea mai bună calitate măsurată (la CCNA v1.1 doar ca idee).</p>
        <Figure caption="Interactiv: cum arată MPLS (roluri CE/PE/P), Metro Ethernet și Internet VPN.">
          <WanServices />
        </Figure>
        <Table head={['Serviciu', 'Tip', 'Topologie tipică', 'Calitate', 'Cost']} rows={[
          ['Leased line', 'privat, dedicat', 'point-to-point', 'garantată', 'mare'],
          ['MPLS L3VPN', 'privat, partajat de operator', 'any-to-any', 'QoS posibil, SLA', 'mediu–mare'],
          ['Metro Ethernet', 'privat, Ethernet', 'E-Line / E-LAN / E-Tree', 'SLA, viteze mari', 'mediu'],
          ['Internet VPN', 'public + criptare', 'hub-and-spoke sau mesh de tuneluri', 'best effort', 'mic'],
        ]} />
      </Detailed>

      <Traps items={[
        <>În <b>hub-and-spoke</b>, traficul filială → filială trece prin <b>hub</b>.</>,
        <><b>Dual-homed</b> = două legături la <b>același</b> ISP; <b>multihomed</b> = doi ISP diferiți.</>,
        <>La MPLS, clientul (CE) vede doar <b>PE-ul</b>; etichetele le pune operatorul.</>,
        <><b>E-Line</b> = point-to-point, <b>E-LAN</b> = any-to-any, <b>E-Tree</b> = rădăcină–frunze.</>,
        <>Internet VPN = ieftin și criptat, dar <b>fără QoS garantat</b> peste Internet.</>,
      ]} />
      <InlineQuiz ids={['1.2-026', '1.2-027', '1.2-030']} />
    </section>
  );
}

/* ======================================================================
   1.2.e — SOHO
   ====================================================================== */
export function Soho() {
  return (
    <section id="soho" className="section">
      <SectionHead id="soho" code="1.2.e" title="SOHO — un dispozitiv, multe funcții" />
      <Summary>
        <p>O rețea <G id="soho" /> (Small Office / Home Office) are de obicei un singur echipament central: „routerul wireless”.
          În realitate el conține <b>un router cu NAT/PAT, un firewall, un switch cu câteva porturi, un access point Wi-Fi, un server DHCP</b> și uneori modemul/ONT-ul. Pentru examen: un dispozitiv fizic, multe roluri logice.</p>
      </Summary>

      <Detailed>
        <p>Într-o firmă mare, fiecare rol din lista de mai sus este un echipament separat (sau chiar mai multe). Acasă sau într-un cabinet cu 5 angajați, ar fi absurd de scump. Producătorii au integrat totul într-o singură cutie — dar <b>funcțiile rămân distincte</b>, și le vei regăsi separat în restul cursului.</p>
        <Figure caption="Interactiv: click pe fiecare funcție a routerului SOHO.">
          <SohoBox />
        </Figure>
        <div className="photo-grid">
          <Photo file="wifi6-router-back.jpg" caption="Spatele unui router SOHO Wi-Fi 6: un port WAN (spre modem/ONT-ul ISP-ului) și patru porturi LAN — switch-ul integrat. Antenele sunt ale AP-ului integrat." />
        </div>
        <h3>Cum circulă traficul într-un SOHO</h3>
        <ol>
          <li>Laptopul se asociază la Wi-Fi (AP-ul integrat, topicul 1.11) sau PC-ul se leagă prin cablu la un port LAN (switch-ul integrat).</li>
          <li>Cere o adresă prin <G id="dhcp" /> și primește de la router ceva de genul <code>192.168.1.23/24</code>, gateway <code>192.168.1.1</code>, DNS <code>192.168.1.1</code>.</li>
          <li>Pachetele spre Internet merg la gateway. Routerul înlocuiește adresa privată (<G id="rfc1918" />) cu adresa interfeței WAN prin <G id="pat" /> și le trimite spre <G id="isp" />.</li>
          <li>Firewall-ul stateful lasă să intre doar răspunsurile la conexiunile pornite din interior.</li>
        </ol>
        <Table head={['Partea', 'Adresare tipică', 'Cine o dă']} rows={[
          ['WAN (spre ISP)', 'o adresă publică sau una din spatele CGNAT', 'ISP-ul, de obicei prin DHCP sau PPPoE'],
          ['LAN (spre casă)', '192.168.0.0/24 sau 192.168.1.0/24 (privat)', 'serverul DHCP din router'],
        ]} />
        <Callout kind="info" title="Varianta „de birou” a SOHO-ului">
          Un birou mic sau o filială poate folosi un router Cisco ISR 1000 (router + switch integrat + opțional Wi-Fi și LTE) sau un dispozitiv administrat din cloud (Cisco Meraki MX/Z). Ideea e aceeași: puține echipamente, multe funcții. În secțiunea de configurare vezi un schelet de configurație IOS care face exact ce face routerul de acasă.
        </Callout>
        <Analogy>Routerul SOHO e ca un briceag elvețian: cuțit, foarfecă, șurubelniță și deschizător într-un singur obiect. Pentru un meșter profesionist (rețeaua enterprise) fiecare unealtă e separată și mai performantă, dar pentru acasă briceagul ajunge.</Analogy>
      </Detailed>

      <Traps items={[
        <>Routerul de acasă <b>nu</b> e „doar un router”: e router + switch + AP + firewall + DHCP (+ modem).</>,
        <>LAN-ul SOHO folosește adrese <b>private</b>; ieșirea în Internet se face prin <b>PAT</b> pe interfața WAN.</>,
        <>AP-ul integrat rămâne un dispozitiv de nivel 2 (bridge Wi-Fi ↔ Ethernet) — rutarea o face partea de router.</>,
      ]} />
      <InlineQuiz ids={['1.2-033', '1.2-034', '1.2-035']} />
    </section>
  );
}

/* ======================================================================
   1.2.f — On-premises și cloud
   ====================================================================== */
export function Cloud() {
  return (
    <section id="cloud" className="section">
      <SectionHead id="cloud" code="1.2.f" title="On-premises și cloud" />
      <Summary>
        <p><G id="on-premises" /> = echipamentele sunt ale tale, în clădirea ta, administrate de tine. <G id="cloud" /> = închiriezi resurse la cerere de la un furnizor.
          Definiția de referință este <G id="nist-cloud" />: <b>5 caracteristici</b>, <b>3 modele de servicii</b> (<G id="iaas" />, <G id="paas" />, <G id="saas" />) și <b>4 modele de implementare</b> (public, private, community, hybrid).
          Întrebarea-cheie la examen: <b>ce administrezi tu și ce administrează providerul</b>.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Ce face ca ceva să fie „cloud” (NIST)">
        <p>Nu orice server închiriat e cloud. NIST (institutul american de standarde) a publicat în 2011 o definiție scurtă, folosită de Cisco și de toată industria. Un serviciu e cloud dacă are toate cele <b>5 caracteristici esențiale</b>:</p>
        <Table head={['Caracteristică (NIST)', 'Ce înseamnă', 'Exemplu']} hlCol={0} rows={[
          ['On-demand self-service', 'îți creezi singur resursele, fără să ceri cuiva', 'pornești o VM din portal în 2 minute'],
          ['Broad network access', 'accesibil prin rețea, de pe orice tip de dispozitiv', 'browser, aplicație mobilă, API'],
          ['Resource pooling', 'resursele fizice sunt partajate între mulți clienți (multi-tenant), alocate dinamic', 'VM-ul tău și al altei firme pe același server fizic, izolate'],
          ['Rapid elasticity', 'capacitatea crește/scade rapid, uneori automat', 'de la 2 la 20 de servere web în Black Friday'],
          ['Measured service', 'consumul e măsurat și facturat', 'plătești ore de VM, GB stocați, GB transferați'],
        ]} />
        <p>Tehnologia care face posibile pooling-ul și elasticitatea este <b>virtualizarea</b>: <G id="hypervisor" />, <G id="vm" />, containere — topicul 1.12.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. Modele de servicii: IaaS, PaaS, SaaS">
        <p>Gândește-te la o „stivă” de straturi, de la clădire până la aplicație. Diferența dintre modele e <b>până unde administrează providerul</b> și de unde începi tu:</p>
        <Figure caption="Interactiv: modelul de responsabilitate partajată. Selectează un model sau click pe o coloană.">
          <CloudStack />
        </Figure>
        <Table head={['', 'On-premises', 'IaaS', 'PaaS', 'SaaS']} rows={[
          ['Tu administrezi', 'tot (clădire → aplicație)', 'OS, middleware, runtime, aplicații, date', 'aplicațiile tale și datele', 'doar datele, utilizatorii, setările'],
          ['Providerul administrează', '—', 'clădire, hardware, stocare, rețea, virtualizare', '+ OS și runtime', 'tot stack-ul'],
          ['Exemple', 'camera serverelor, datacenter propriu', 'AWS EC2, Azure VMs, Google Compute Engine', 'Azure App Service, Google App Engine', 'Microsoft 365, Webex, Salesforce'],
          ['Pentru cine', 'control total, cerințe speciale', 'echipe IT care vor VM-uri fără hardware', 'dezvoltatori', 'utilizatori finali'],
        ]} />
        <Analogy>Pizza. <b>On-prem</b>: faci aluatul acasă, în cuptorul tău. <b>IaaS</b>: închiriezi o bucătărie dotată, dar gătești tu tot. <b>PaaS</b>: primești blatul copt, pui tu toppingurile preferate. <b>SaaS</b>: comanzi pizza gata făcută — tu doar o mănânci (și alegi ce comanzi).</Analogy>
        <Callout kind="exam" title="Cel mai testat lucru">
          <b>IaaS este singurul model în care administrezi sistemul de operare.</b> În SaaS nu administrezi nimic din infrastructură, dar rămâi responsabil de datele tale și de cine are acces la ele.
        </Callout>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Modele de implementare și conectarea la cloud">
        <Table head={['Model (NIST)', 'Cine îl folosește', 'Unde poate fi', 'Exemplu']} hlCol={0} rows={[
          [<G id="public-cloud" />, 'oricine plătește (multi-tenant)', 'datacenterele providerului', 'AWS, Azure, Google Cloud'],
          [<G id="private-cloud" />, 'o singură organizație', <><b>on-prem SAU</b> la un terț</>, 'cloud-ul intern al unei bănci'],
          [<G id="community-cloud" />, 'un grup de organizații cu cerințe comune', 'on-prem sau la un terț', 'cloud comun pentru instituții publice'],
          [<G id="hybrid-cloud" />, 'combinație de ≥ 2 clouduri distincte, legate', 'mixt', 'date sensibile on-prem + web în cloud public'],
        ]} />
        <h4>Cum ajunge rețeaua ta la cloud</h4>
        <p>Pentru un inginer de rețea, „cloud” înseamnă și o întrebare de WAN: pe unde merge traficul spre servere care nu mai sunt în clădire?</p>
        <Figure caption="Trei drumuri spre cloud-ul public: Internet direct, VPN IPsec peste Internet, interconectare privată dedicată.">
          <CloudConnect />
        </Figure>
        <ul>
          <li><b>Internet direct</b> — simplu și ieftin; traficul trebuie protejat la nivel de aplicație (HTTPS), iar calitatea nu e garantată.</li>
          <li><b>VPN site-to-site</b> peste Internet — tunel <G id="ipsec" /> între routerul tău și gateway-ul VPN al cloud-ului; confidențial, dar tot fără QoS.</li>
          <li><b>Interconectare privată</b> — circuit dedicat sau prin MPLS până la cloud (AWS Direct Connect, Azure ExpressRoute): latență previzibilă, cost mai mare.</li>
        </ul>
      </Detailed>

      <Detailed title="Explicația detaliată — 4. On-premises vs. cloud: compromisurile">
        <Table head={['Criteriu', 'On-premises', 'Cloud public']} rows={[
          ['Cost', <><G id="capex-opex">CapEx</G>: investiție mare la început, amortizată în ani</>, 'OpEx: factură lunară, proporțională cu consumul'],
          ['Capacitate', 'cumpărată din timp, pentru vârful estimat', 'elastică — crește și scade la cerere'],
          ['Viteză de lansare', 'săptămâni (comandă, livrare, montare)', 'minute'],
          ['Control', 'total (hardware, date, locație)', 'limitat la ce expune providerul'],
          ['Responsabilitate', 'totală (curent, răcire, patch-uri, înlocuiri)', 'partajată, conform modelului ales'],
          ['Conformitate / date', 'știi exact unde stau datele', 'trebuie aleasă regiunea (ex. UE pentru GDPR)'],
          ['Dependențe', 'echipa ta și hardware-ul tău', 'providerul și conexiunea la el'],
        ]} />
        <p>Multe organizații ajung la un model <b>hibrid</b>: datele sensibile și sistemele vechi on-prem, aplicațiile noi și vârfurile de sarcină în cloud. Pentru un utilizator din România, regulile <b>GDPR</b> (date personale ale cetățenilor UE) cântăresc adesea în alegerea regiunii de cloud sau a variantei on-prem.</p>
      </Detailed>

      <DeepDive title="Deep dive: cloud-ul și rețeaua — ce se schimbă pentru inginer">
        <p>În cloud-ul public nu configurezi switch-uri fizice: rețeaua e definită prin software (VPC/VNet, subrețele, tabele de rutare, security groups). Dar conceptele sunt exact cele de la CCNA — subrețele IPv4/IPv6, rute implicite, NAT, ACL-uri (sub alt nume). Poți rula chiar și routere Cisco virtuale în cloud (Catalyst 8000V) — acesta este un exemplu de IaaS. Fluxurile de trafic se schimbă și ele: dacă aplicațiile sunt SaaS, filialele trimit mult trafic direct spre Internet, nu prin sediu — unul dintre motivele adoptării SD-WAN.</p>
      </DeepDive>

      <Traps items={[
        <><b>IaaS</b> = singurul model în care administrezi <b>OS-ul</b>.</>,
        <><b>SaaS</b> = nu administrezi nimic din infrastructură (doar date, utilizatori, setări).</>,
        <><b>Private cloud</b> nu înseamnă obligatoriu on-prem — poate fi găzduit de un terț.</>,
        <><b>Hybrid</b> = două sau mai multe clouduri distincte, legate (de obicei privat + public).</>,
        <>NIST are <b>4</b> modele de implementare (inclusiv <b>community</b>) — unele întrebări listează doar 3.</>,
        <>„Resource pooling” = resurse <b>partajate</b>, nu hardware dedicat fiecărui client.</>,
      ]} />
      <InlineQuiz ids={['1.2-037', '1.2-039', '1.2-040', '1.2-043']} />
    </section>
  );
}
