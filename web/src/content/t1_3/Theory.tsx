import { Link } from 'react-router-dom';
import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import {
  BusVsStar, CableChooser, CableWiring, CsmaCdSteps, DomainsDiagram, DuplexCompare, EthernetTimeline, FiberConnectors,
  FiberModes, MediaChooser, RJ45Pinout, TwistNoise, TxRxPolarity,
} from '../../diagrams/t1_3';

/* ======================================================================
   0. Introducere — imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.3" title="Cabluri și interfețe — imaginea de ansamblu" />
      <Summary>
        <p>Orice rețea începe cu <b>nivelul fizic</b>: biții trebuie să ajungă de la o placă de rețea la alta, ca impulsuri electrice pe <b>cupru</b> sau ca impulsuri de lumină pe <b><G id="fiber" /></b>.
          Topicul 1.3 te învață să compari mediile (<G id="utp" />, <G id="mmf" />, <G id="smf" />) și felul în care se leagă dispozitivele: pe un <b>mediu partajat</b> (<G id="shared-media" />) sau printr-o legătură <b>punct-la-punct</b> (<G id="point-to-point" />).</p>
      </Summary>

      <Detailed>
        <p>Când cumperi un switch, vezi pe panoul frontal porturi de forme diferite: zeci de mufe <G id="rj45" /> pentru cupru, câteva sloturi pentru module <G id="sfp" /> (fibră sau cupru) și, de obicei, un port <G id="console-port">CONSOLE</G>. Fiecare tip de port există pentru că rezolvă o altă problemă: cost, distanță, viteză, zgomot electric. Topicul are două sub-teme:</p>
        <Table head={['Cod Cisco', 'Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['1.3.a', 'Single-mode fiber, multimode fiber, copper', 'Ce mediu fizic aleg, după distanță, viteză, cost și mediul de instalare? Ce cablu și ce conector?'],
          ['1.3.b', 'Connections (Ethernet shared media and point-to-point)', 'Câte dispozitive împart același cablu? Pot transmite simultan? Ce sunt coliziunile, domeniile de coliziune și de broadcast?'],
        ]} />
        <Callout kind="info" title="Ordinea în care predăm">
          Începem cu <b>istoria standardelor Ethernet</b>, pentru că ea leagă ambele sub-teme: Ethernetul a pornit pe un cablu coaxial <b>partajat</b> (1.3.b) și a ajuns la legături <b>punct-la-punct</b> pe cupru torsadat și fibră (1.3.a). Apoi detaliem cuprul și fibra (1.3.a), tipurile de conexiuni (1.3.b) și, la final, cum alegi cablul potrivit. Codurile oficiale rămân cele de mai sus.
        </Callout>

        <h3>Trei familii de medii, pe scurt</h3>
        <Table head={['', 'Cupru torsadat (UTP/STP)', 'Fibră multimod (MMF)', 'Fibră monomod (SMF)']} rows={[
          ['Ce transportă', 'curent electric (semnal diferențial)', 'lumină, pe mai multe trasee (moduri)', 'lumină, pe un singur traseu'],
          ['Distanță tipică', 'max 100 m', 'sute de metri (≈ 300–550 m)', 'kilometri – zeci de km'],
          ['Sursă / conector', <>PHY electric · <G id="rj45" /></>, <><G id="vcsel" /> / LED la 850 nm · <G id="lc-connector">LC</G></>, 'laser 1310 / 1550 nm · LC'],
          ['Cost', 'cel mai mic; poate duce și PoE', 'optică ieftină, fibră medie', 'optică mai scumpă'],
          ['Zgomot (EMI)', <>sensibil — de aceea e torsadat (<G id="emi" />)</>, 'imun', 'imun'],
          ['Unde', 'de la priză la switch-ul de acces', 'în clădire, în centrul de date', 'între clădiri, campus, oraș, WAN'],
        ]} />
        <Analogy>Cuprul e ca o conductă de apă: ieftină, ușor de montat, dar pierde presiune repede și „preia” zgomotul din jur. Fibra multimod e o autostradă largă și scurtă: încap multe mașini (raze), dar ajung la destinație la momente diferite. Fibra monomod e un tren de mare viteză pe o singură linie: o singură „mașină”, dar ajunge foarte departe fără să se întârzie.</Analogy>
        <p>Defectele acestor legături (coliziuni, erori CRC, duplex mismatch, viteze nepotrivite) sunt tema topicului următor, <Link to="/topic/1.4">1.4 — Identify interface and cable issues</Link>. Aici construim fundația: ce e fiecare cablu și cum ar trebui să funcționeze.</p>
      </Detailed>

      <Traps items={[
        <><b>1.3 ≠ 1.4.</b> 1.3 = compari tipuri de medii și conexiuni („ce cablu?”). 1.4 = interpretezi probleme („de ce sunt erori?”). Întrebările de examen le amestecă des.</>,
        <>„Fibră” nu înseamnă automat „distanță mare”: <b>multimodul</b> merge doar sute de metri. Kilometrii sunt pentru <b>monomod</b>.</>,
      ]} />
    </section>
  );
}

/* ======================================================================
   Standardele Ethernet — evoluție
   ====================================================================== */
export function Standards() {
  return (
    <section id="standards" className="section">
      <SectionHead id="standards" code="1.3.a" title="Evoluția standardelor Ethernet — ce problemă a rezolvat fiecare" />
      <Summary>
        <p><G id="ethernet" /> (<G id="ieee" /> 802.3) a pornit în 1983 la 10 Mb/s pe un cablu <G id="coax">coaxial</G> comun și a ajuns la 400G+ pe fibră. Numele unui standard îți spune tot: <code>1000BASE-T</code> = <b>1000 Mb/s</b>, <b>BASE</b>band, pe <b>T</b>wisted pair.
          Regula de aur pentru cuprul torsadat: <b>maximum 100 m</b>, de la 10BASE-T până la 10GBASE-T.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Cum citești numele unui standard">
        <Table head={['Parte', 'Exemplu', 'Înseamnă']} hlCol={1} rows={[
          ['viteza', <><code>10</code> / <code>100</code> / <code>1000</code> / <code>10G</code></>, 'Mb/s (sau Gb/s cu G)'],
          ['BASE', <code>BASE</code>, 'baseband — semnalul ocupă tot mediul, un singur canal (nu „broadband” ca la TV pe cablu)'],
          ['sufix cupru', <><code>-T</code>, <code>-TX</code></>, 'twisted pair — cablu torsadat cu RJ-45'],
          ['cifră (coax)', <><code>10BASE5</code>, <code>10BASE2</code></>, 'lungimea segmentului: 500 m, ≈200 m (de fapt 185 m)'],
          ['sufix fibră — lungimea de undă', <><code>S</code>X/SR, <code>L</code>X/LR, <code>E</code>R</>, 'Short (850 nm, multimod) · Long (1310 nm) · Extended (1550 nm)'],
          ['sufix fibră — familia de codare', <><code>-X</code> (1000BASE-SX), <code>-R</code> (10GBASE-SR)</>, 'X = codarea 8b/10b a gigabitului pe fibră; R = codarea 64b/66b a familiei 10G LAN'],
          ['cifra de la final', <><code>-SR4</code>, <code>-LR4</code></>, 'numărul de benzi paralele (4 × 10G = 40G, 4 × 25G = 100G)'],
        ]} />
        <Callout kind="exam" title="Mnemonic">
          <b>T</b> = <b>T</b>wisted pair (cupru) · <b>S</b> = <b>S</b>hort (multimod, sute de metri) · <b>L</b> = <b>L</b>ong (monomod, ≈5–10 km) · <b>E</b> = <b>E</b>xtended (monomod, ≈40 km). Dacă vezi <code>1000BASE-T</code> → cupru; <code>1000BASE-LX</code> → fibră.
        </Callout>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. Istoria, problemă cu problemă">
        <p>Nu memora doar tabelul: înțelege <b>ce problemă a rezolvat fiecare pas</b>. Atinge punctele de pe axă:</p>
        <Figure caption="Interactiv: fiecare pas al Ethernetului a rezolvat limitarea celui dinainte. Culoarea arată mediul: coaxial, cupru torsadat sau fibră.">
          <EthernetTimeline />
        </Figure>

        <h4>Era coaxialului (1983–1990): toți pe același fir</h4>
        <p><b>10BASE5</b> („thicknet”, 802.3 din 1983) folosea un cablu coaxial gros de ≈1 cm, galben-portocaliu, lung de până la 500 m pe segment, cu maximum 100 de stații. Stațiile se conectau prin <i>vampire taps</i>: se găurea cablul și un ac atingea conductorul central, doar în puncte marcate la 2.5 m. <b>10BASE2</b> („thinnet”, 802.3a) a făcut totul mai ieftin: coaxial subțire RG-58, conectori BNC în formă de T montați direct pe placa de rețea, segmente de 185 m, maximum 30 de stații, terminatoare de 50 Ω la ambele capete.</p>
        <p>Ambele aveau aceeași slăbiciune: o <b>magistrală</b> (bus). Un T desfăcut, un terminator lipsă sau o întrerupere producea reflexii ale semnalului, care arătau ca niște coliziuni permanente — și <b>toată rețeaua</b> se oprea. Găsirea defectului însemna să verifici cablul metru cu metru.</p>
        <Figure caption="Interactiv: apasă „simulează o defecțiune” în ambele topologii. Asta este problema pe care a rezolvat-o 10BASE-T.">
          <BusVsStar />
        </Figure>

        <h4>10BASE-T (802.3i, 1990): topologia stea</h4>
        <p>Ideea genială: fiecare PC primește <b>propriul cablu</b> până la un echipament central (<G id="hub" />), pe cablu torsadat ieftin, de tip telefonic (Cat3), cu mufă <G id="rj45" />. Un cablu defect scoate din funcțiune un singur PC. Limita de <b>100 m</b> între dispozitiv și hub vine de aici și a rămas până azi. Dar hub-ul doar repetă semnalul pe toate porturile: <b>logic</b>, rețeaua era tot o magistrală partajată, half-duplex (detalii la 1.3.b).</p>

        <h4>Fast Ethernet — 100BASE-TX (802.3u, 1995)</h4>
        <p>De 10 ori mai rapid, pe Cat5, cu doar <b>2 perechi</b> (una pentru emisie, una pentru recepție). Pentru că rețelele erau pline de plăci de 10 Mb/s, 802.3u a introdus <b><G id="autonegotiation" /></b>: două porturi își anunță vitezele și aleg cea mai bună comună. Tot în 802.3u a apărut <b>100BASE-FX</b> pe fibră multimod (1300 nm, 2 km full-duplex). Odată cu răspândirea <b>switch-urilor</b>, legăturile au devenit punct-la-punct și <G id="full-duplex" /> — fără coliziuni.</p>

        <h4>Gigabit — întâi pe fibră (802.3z, 1998), apoi pe cupru (802.3ab, 1999)</h4>
        <p>Gigabit-ul pe cupru era greu de făcut, așa că IEEE a „împrumutat” optica de la Fibre Channel: <b>1000BASE-SX</b> (850 nm, multimod, 220–550 m) și <b>1000BASE-LX</b> (1310 nm, monomod 5 km; merge și pe multimod 550 m). Un an mai târziu, <b>1000BASE-T</b> a adus 1 Gb/s pe cablul Cat5 deja instalat, folosind un truc: <b>toate cele 4 perechi, în ambele sensuri simultan</b> (detalii în secțiunea despre cupru).</p>

        <h4>10 Gigabit — fibră (802.3ae, 2002) și cupru (802.3an, 2006)</h4>
        <p>10G a fost definit întâi doar pe fibră: <b>10GBASE-SR</b> (850 nm multimod: 300 m pe OM3, 400 m pe OM4), <b>10GBASE-LR</b> (1310 nm monomod, 10 km), <b>10GBASE-ER</b> (1550 nm monomod, 40 km). De la 10G în sus, Ethernetul este <b>doar full-duplex</b> — <G id="csma-cd" /> nu mai există. <b>10GBASE-T</b> pe cupru cere <G id="cat-cable">Cat6A</G> pentru 100 m (pe Cat6 merge doar ≈55 m).</p>

        <h4>Multigigabit, 25G, 40G, 100G</h4>
        <p><b>40G și 100G</b> (802.3ba, 2010) folosesc benzi paralele: 4 × 10G (40GBASE-SR4, pe 8 fibre cu conector <G id="mpo" />) sau 4 lungimi de undă pe aceeași pereche monomod (LR4, 10 km), în module <G id="qsfp" />. În 2016 au apărut trei lucruri: <b>25G</b> (802.3by, module SFP28), <b>25/40GBASE-T</b> pe Cat8 la 30 m (802.3bq) și <b><G id="nbase-t" /></b> (802.3bz): 2.5 și 5 Gb/s pe cablul Cat5e/Cat6 existent. Motivul pentru 802.3bz: AP-urile Wi-Fi 5 Wave 2 (și apoi Wi-Fi 6) puteau depăși 1 Gb/s, dar recablarea clădirilor la Cat6A era prea scumpă (legătură cu <Link to="/topic/1.11">1.11</Link>).</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Tabelul complet al standardelor">
        <Table head={['Standard', 'IEEE', 'An', 'Mediu', 'Cablu / fibră', 'Perechi / fibre', 'Distanță max.']} hlCol={0} rows={[
          ['10BASE5', '802.3', '1983', 'coaxial gros 50 Ω', 'thicknet', '— (magistrală)', '500 m / segment'],
          ['10BASE2', '802.3a', '1985', 'coaxial subțire 50 Ω', 'RG-58', '— (magistrală)', '185 m / segment'],
          ['10BASE-T', '802.3i', '1990', 'cupru torsadat', 'Cat3', '2 perechi', '100 m'],
          ['100BASE-TX', '802.3u', '1995', 'cupru torsadat', 'Cat5', '2 perechi', '100 m'],
          ['100BASE-FX', '802.3u', '1995', 'MMF, 1300 nm', 'multimod', '2 fibre', '2 km (full-duplex)'],
          ['1000BASE-SX', '802.3z', '1998', 'MMF, 850 nm', 'OM1 275 m · OM2 550 m', '2 fibre', '220–550 m'],
          ['1000BASE-LX', '802.3z', '1998', 'SMF (și MMF), 1310 nm', 'monomod', '2 fibre', '5 km SMF (550 m MMF)'],
          ['1000BASE-T', '802.3ab', '1999', 'cupru torsadat', 'Cat5 (Cat5e recomandat)', '4 perechi', '100 m'],
          ['10GBASE-SR', '802.3ae', '2002', 'MMF, 850 nm', 'OM3 300 m · OM4 400 m', '2 fibre', '26 m (OM1-vechi) – 400 m'],
          ['10GBASE-LR', '802.3ae', '2002', 'SMF, 1310 nm', 'monomod', '2 fibre', '10 km'],
          ['10GBASE-ER', '802.3ae', '2002', 'SMF, 1550 nm', 'monomod', '2 fibre', '40 km'],
          ['10GBASE-T', '802.3an', '2006', 'cupru torsadat', 'Cat6A (Cat6 ≈55 m)', '4 perechi', '100 m'],
          ['40GBASE-SR4', '802.3ba', '2010', 'MMF, 850 nm, MPO', 'OM3 100 m · OM4 150 m', '8 fibre (4+4)', '150 m'],
          ['40/100GBASE-LR4', '802.3ba', '2010', 'SMF, 4 λ în jur de 1310 nm', 'monomod', '2 fibre', '10 km'],
          ['2.5GBASE-T / 5GBASE-T', '802.3bz', '2016', 'cupru torsadat', 'Cat5e / Cat6', '4 perechi', '100 m'],
          ['25GBASE-SR', '802.3by', '2016', 'MMF, 850 nm', 'OM3 70 m · OM4 100 m', '2 fibre', '100 m'],
          ['25G / 40GBASE-T', '802.3bq', '2016', 'cupru torsadat ecranat', 'Cat8', '4 perechi', '30 m'],
        ]} />
        <p className="small muted">Pentru 5GBASE-T sursele diferă între Cat5e și Cat6 ca minim recomandat; regula practică: 2.5G/5G = „reutilizezi cablarea Cat5e/Cat6 existentă”. Distanțele pe fibră depind de clasa fibrei (OM1–OM5) și de bugetul optic.</p>
        <Callout kind="exam" title="Cifrele care chiar se cer la examen">
          Cupru torsadat: <b>100 m</b> (toate, până la 10GBASE-T). 1000BASE-T = <b>4 perechi</b>, 100BASE-TX = <b>2 perechi</b>. 10GBASE-T pe 100 m = <b>Cat6A</b>. Multimod = <b>sute de metri</b>, monomod = <b>kilometri</b>. 10GBASE-LR = <b>10 km</b>.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: de ce 100 m? Și ce e regula 5-4-3">
        <p>Limita de 100 m a cuprului vine din două lucruri: <b>atenuarea</b> (semnalul scade cu distanța și cu frecvența) și <b>diafonia</b> (<G id="crosstalk" />). Standardul de cablare structurată (TIA-568) împarte cei 100 m în <b>90 m de cablu fix</b> (permanent link: priza din perete → patch panel) plus <b>10 m de patch cord-uri</b> la ambele capete.</p>
        <p>Pe vremea hub-urilor și repetoarelor exista și o limită de <b>diametru al domeniului de coliziune</b>: un cadru de 64 de octeți (512 biți) trebuie să fie încă „în emisie” când vestea unei coliziuni de la capătul cel mai îndepărtat se întoarce la emițător. De aici reguli de proiectare precum <b>5-4-3</b> (maximum 5 segmente, 4 repetoare, 3 segmente populate) și limita de 412 m a lui 100BASE-FX în half-duplex. Pe legături full-duplex, aceste restricții nu mai contează — distanța e limitată doar de semnal.</p>
      </DeepDive>

      <Traps items={[
        <><b>1000BASE-T</b> (cupru, 802.3ab) ≠ <b>1000BASE-TX</b> (un standard TIA aproape neimplementat) ≠ <b>1000BASE-SX/LX</b> (fibră, 802.3z). La examen „T” = cupru.</>,
        <>Limita cuprului este <b>100 m</b>, nu 185 m sau 500 m (acelea sunt coaxial, istorie).</>,
        <><b>10GBASE-T pe Cat6</b> merge doar ≈55 m; pentru 100 m e nevoie de <b>Cat6A</b>.</>,
        <><b>10 Gb/s și mai mult = numai full-duplex</b>: nu există coliziuni și nici CSMA/CD.</>,
        <>802.3<b>af/at/bt</b> sunt standarde <b>PoE</b>, nu standarde de viteză. 802.3<b>bz</b> = 2.5/5G.</>,
      ]} />
      <InlineQuiz ids={['1.3-001', '1.3-002', '1.3-004', '1.3-007']} />
    </section>
  );
}

/* ======================================================================
   1.3.a — Cupru
   ====================================================================== */
export function Copper() {
  return (
    <section id="copper" className="section">
      <SectionHead id="copper" code="1.3.a" title="Copper — cablul torsadat, pinout-uri și tipuri de cabluri" />
      <Summary>
        <p>Cablul de rețea are <b>8 fire în 4 perechi răsucite</b>. Răsucirea anulează zgomotul (<G id="emi" />) și diafonia. <G id="utp" /> = fără ecran (standard în birouri), <G id="stp-cable" /> = ecranat (medii zgomotoase).
          Firele se așază după <G id="t568b" /> sau <G id="t568a" />. Între dispozitive „diferite” (PC–switch) se folosește cablu <G id="straight-through" />, între dispozitive „la fel” (switch–switch) <G id="crossover" />, iar pentru consolă <G id="rollover" /> — dar <G id="auto-mdix" /> face ca, în practică, aproape orice cablu să funcționeze.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. De ce sunt firele răsucite">
        <p>Pe fiecare pereche, semnalul circulă <b>diferențial</b>: un fir duce semnalul „+”, celălalt aceeași formă inversată „−”. Receptorul nu se uită la un fir, ci la <b>diferența</b> dintre ele. Orice zgomot care lovește ambele fire la fel dispare la scădere. Răsucirea asigură exact asta: pe lungimea cablului, fiecare fir stă la fel de des „mai aproape” și „mai departe” de sursa de zgomot.</p>
        <Figure caption="Interactiv: comută între fire paralele și pereche torsadată. Uită-te la ultimul rând — ce „vede” receptorul.">
          <TwistNoise />
        </Figure>
        <ul>
          <li><b><G id="crosstalk" /></b> — semnalul unei perechi „se scurge” în perechea vecină. Fiecare pereche are alt <b>pas de răsucire</b>, ca să nu se cupleze între ele. Dacă desfaci perechile prea mult când montezi mufa, crește diafonia (NEXT) și apar erori.</li>
          <li><b>Ecranarea</b> (<G id="stp-cable" />): o folie sau tresă metalică în jurul perechilor (F/UTP, U/FTP, S/FTP). Ajută lângă motoare și cabluri de forță, dar <b>doar dacă e legată corect la împământare</b>.</li>
        </ul>
        <Analogy>Torsadarea e ca doi oameni care cântă aceeași melodie, unul cu vocea normală și unul „în oglindă”. Un zgomot din sală se aude la fel peste amândoi; dacă scazi o voce din cealaltă, zgomotul dispare și rămâne melodia (dublă).</Analogy>

        <h3>2. Categoriile de cablu</h3>
        <Table head={['Categorie', 'Frecvență', 'Ethernet tipic', 'Note']} hlCol={0} rows={[
          ['Cat3', '16 MHz', '10BASE-T', 'cablu de telefonie; istoric'],
          ['Cat5', '100 MHz', '100BASE-TX, 1000BASE-T', 'înlocuit de Cat5e'],
          ['Cat5e', '100 MHz', '1000BASE-T, 2.5GBASE-T (și 5G)', 'specificații mai stricte de diafonie; minimul de azi'],
          ['Cat6', '250 MHz', '1000BASE-T, 5GBASE-T; 10GBASE-T ≈55 m', 'separator intern între perechi'],
          ['Cat6A', '500 MHz', '10GBASE-T la 100 m', 'adesea F/UTP; mai gros'],
          ['Cat8', '2000 MHz', '25/40GBASE-T la 30 m', 'întotdeauna ecranat; doar în centre de date, în rack'],
        ]} />
        <p className="small muted">Cat7/7A sunt clase ISO (F/FA) cu alți conectori; nu sunt categorii TIA și nu apar la CCNA.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. RJ-45 și schemele T568A / T568B">
        <p>Mufa <G id="rj45" /> are 8 contacte, numerotate de la 1 la 8 cu <b>clema în jos și contactele spre tine</b> (pinul 1 e în stânga). Cele două standarde de culori diferă printr-un singur lucru: <b>perechea portocalie și cea verde își schimbă locul</b>.</p>
        <Figure caption="Interactiv: comută între T568B și T568A și observă că se mută doar pinii 1, 2, 3 și 6. Tabelul arată și rolul fiecărui pin la 10/100 și la gigabit.">
          <RJ45Pinout />
        </Figure>
        <Callout kind="tip" title="Cum reții T568B">
          „<b>alb-portocaliu, portocaliu · alb-verde, albastru · alb-albastru, verde · alb-maro, maro</b>”. Perechea verde (3-6) „încadrează” perechea albastră (4-5) în mijloc. T568A = aceeași ordine, cu verde și portocaliu inversate.
        </Callout>

        <h3>4. MDI și MDI-X — cine emite pe ce pini</h3>
        <p>La 10 și 100 Mb/s se folosesc doar două perechi. Un port de tip <b><G id="mdi" /></b> (PC, router, server, firewall, AP) <b>emite pe 1-2</b> și <b>recepționează pe 3-6</b>. Un port <b>MDI-X</b> (switch, hub) face invers: recepționează pe 1-2 și emite pe 3-6 — „X” vine de la <i>crossover</i>, adică încrucișarea e făcută în interiorul portului.</p>
        <ul>
          <li><b>MDI ↔ MDI-X</b> (PC–switch): emisia de pe 1-2 ajunge direct în recepția de pe 1-2 → <b>cablu drept</b> (<G id="straight-through" />): aceeași schemă la ambele capete.</li>
          <li><b>MDI ↔ MDI</b> (PC–PC, router–PC, router–router) sau <b>MDI-X ↔ MDI-X</b> (switch–switch, switch–hub, hub–hub): emisia ar ajunge pe pinii de emisie ai celuilalt → e nevoie de <b><G id="crossover" /></b> (T568A la un capăt, T568B la celălalt).</li>
        </ul>
        <Figure caption="Interactiv: vezi cum circulă fiecare fir capăt la capăt, pentru fiecare tip de cablu. Liniile mai groase sunt firele care își schimbă poziția.">
          <CableWiring />
        </Figure>
        <Figure caption="Interactiv: alege două dispozitive și vezi ce cablu îți trebuie — și ce schimbă Auto-MDIX.">
          <CableChooser />
        </Figure>
        <Table head={['Legătură', 'Fără Auto-MDIX (regula de examen)', 'De ce']} rows={[
          ['PC ↔ switch', <b>straight-through</b>, 'MDI ↔ MDI-X'],
          ['router ↔ switch', <b>straight-through</b>, 'portul Ethernet al routerului e MDI, ca un PC'],
          ['AP / server / firewall ↔ switch', <b>straight-through</b>, 'MDI ↔ MDI-X'],
          ['switch ↔ switch', <b>crossover</b>, 'MDI-X ↔ MDI-X'],
          ['switch ↔ hub, hub ↔ hub', <b>crossover</b>, 'MDI-X ↔ MDI-X'],
          ['PC ↔ PC', <b>crossover</b>, 'MDI ↔ MDI'],
          ['router ↔ PC (direct)', <b>crossover</b>, 'MDI ↔ MDI — capcană clasică'],
          ['router ↔ router (Ethernet)', <b>crossover</b>, 'MDI ↔ MDI'],
          ['PC ↔ port CONSOLE', <b>rollover</b>, 'nu e Ethernet: comunicație serială RS-232'],
        ]} />

        <h3>5. Auto-MDIX</h3>
        <p><G id="auto-mdix" /> este o funcție a portului care încearcă alternativ configurația MDI și MDI-X până „aude” impulsurile de legătură ale vecinului, apoi rămâne pe cea care funcționează. Rezultat: <b>orice cablu bine făcut funcționează</b>, drept sau încrucișat. Pe switch-urile Cisco Catalyst moderne e activă implicit (comanda de interfață <code>mdix auto</code>); pe unele platforme funcționează doar dacă viteza și duplexul sunt pe <code>auto</code>. Pentru 1000BASE-T, Auto-MDIX este opțional în standard, dar implementat aproape universal.</p>
        <Callout kind="exam" title="Cum răspunzi la examen">
          Dacă întrebarea nu spune nimic despre Auto-MDIX, aplică regula clasică: dispozitive <b>diferite → straight</b>, dispozitive <b>la fel → crossover</b>. Dacă scrie că Auto-MDIX e activ, ambele cabluri funcționează.
        </Callout>

        <h3>6. Cablul de consolă (rollover)</h3>
        <p>Un switch sau router nou nu are încă adresă IP — îl configurezi prin <G id="console-port">portul de consolă</G>. Cablul <G id="rollover" /> (de obicei albastru deschis) inversează complet ordinea pinilor (1↔8, 2↔7, 3↔6, 4↔5) și are la capătul PC-ului o mufă DB-9 (RS-232) sau un convertor USB. Programul de terminal (PuTTY, Tera Term, „Terminal” în Packet Tracer) se setează la <b>9600 baud, 8 biți de date, fără paritate, 1 bit de stop, fără flow control</b> — pe scurt <b>9600 8N1</b>. Echipamentele noi au adesea și un port de consolă <b>USB</b> (mini-B sau USB-C). Detalii despre accesul de management în <Link to="/topic/2.8">2.8</Link>.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 7. De ce 1000BASE-T folosește toate cele 4 perechi">
        <p>100BASE-TX trimite 100 Mb/s pe o pereche și primește pe alta. Pentru 1000 Mb/s pe același cablu Cat5, inginerii au combinat trei idei:</p>
        <ul>
          <li><b>4 perechi în paralel</b> — fiecare pereche duce 250 Mb/s (4 × 250 = 1000).</li>
          <li><b>Mai mulți biți pe simbol</b> — modulația PAM-5 (5 niveluri de tensiune) transportă ≈2 biți per simbol, la 125 milioane de simboluri pe secundă (aceeași frecvență ca la 100BASE-TX, deci cablul Cat5 o suportă).</li>
          <li><b>Ambele sensuri pe aceeași pereche, simultan</b> — fiecare capăt își „scade” propriul semnal din ce aude pe fir (circuit hibrid + anularea ecoului), rămânând doar semnalul vecinului. Așa obține full-duplex fără perechi separate pentru emisie și recepție.</li>
        </ul>
        <p>Consecințe practice: nu mai rămân perechi „libere” (vechiul truc de a folosi perechile 4-5 și 7-8 pentru un al doilea serviciu nu mai merge), <G id="autonegotiation" /> devine <b>obligatorie</b>, iar noțiunea de „pinii 1-2 emit” nu mai descrie complet gigabit-ul. Un cablu căruia îi lipsește o pereche poate funcționa doar la 100 Mb/s — un simptom pe care îl vei recunoaște în <Link to="/topic/1.4">1.4</Link>.</p>
      </Detailed>

      <DeepDive title="Deep dive: PoE pe aceleași perechi și „alien crosstalk”">
        <p><G id="poe" /> trimite curent continuu pe perechile cablului, peste semnalul de date (transformatoarele din porturi separă cele două). Cablurile de calitate mai bună (secțiune mai mare a firului) se încălzesc mai puțin la PoE de putere mare — încă un motiv pentru Cat6A în instalațiile noi cu AP-uri.</p>
        <p>La 10GBASE-T, frecvențele de 400–500 MHz fac ca diafonia să apară și <b>între cabluri</b> așezate în același mănunchi (<i>alien crosstalk</i>). Electronica nu o poate anula (nu cunoaște semnalul din cablul vecin), așa că se combate fizic: cablu Cat6A mai gros, cu separare mai mare, sau ecranat.</p>
      </DeepDive>

      <Traps items={[
        <><b>Router ↔ PC direct</b> = crossover (amândouă MDI). Router ↔ switch = straight-through.</>,
        <><b>Consola = rollover</b>, nu crossover. Setări: <b>9600 8N1</b>, fără flow control.</>,
        <>T568A și T568B diferă doar prin perechile <b>portocalie și verde</b> (pinii 1-2 ↔ 3-6). Albastrul (4-5) și maroul (7-8) nu se mută.</>,
        <><b>UTP</b> nu are ecran — imunitatea la zgomot vine din <b>răsucire</b>. STP are ecran și trebuie împământat.</>,
        <><b>STP-cablul ≠ STP-protocolul</b> (Spanning Tree, 2.5). Citește contextul întrebării.</>,
        <>1000BASE-T folosește <b>toate cele 4 perechi</b>, în ambele sensuri; 10BASE-T și 100BASE-TX folosesc doar <b>2</b> (pinii 1, 2, 3, 6).</>,
      ]} />
      <InlineQuiz ids={['1.3-009', '1.3-010', '1.3-012', '1.3-015', '1.3-017']} />
    </section>
  );
}

/* ======================================================================
   1.3.a — Fibră
   ====================================================================== */
export function Fiber() {
  return (
    <section id="fiber" className="section">
      <SectionHead id="fiber" code="1.3.a" title="Single-mode și multimode fiber — lumina în loc de curent" />
      <Summary>
        <p>Fibra are un <b>miez</b> (core) de sticlă prin care circulă lumina și un <b>înveliș</b> (cladding) de 125 µm care o ține în miez. <G id="mmf" />: miez de 50/62.5 µm, surse ieftine (<G id="vcsel" />, 850 nm), sute de metri — limitată de <G id="modal-dispersion" />. <G id="smf" />: miez ≈9 µm, laser la 1310/1550 nm, kilometri.
          Se conectează prin module <G id="sfp" /> cu conectori <G id="lc-connector">LC</G>; o legătură obișnuită folosește <b>două fibre</b>: TX și RX.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Cum ține fibra lumina">
        <p>Miezul are un <b>indice de refracție</b> puțin mai mare decât învelișul. O rază care lovește granița sub un unghi suficient de mic se reflectă complet înapoi (reflexie totală internă) și „ricoșează” de-a lungul fibrei kilometri întregi. Peste înveliș vin un strat de protecție (buffer/coating) și mantaua colorată.</p>
        <Figure caption="Interactiv: alege tipul de fibră și trimite un impuls. Observă la recepție cât de „lățit” ajunge impulsul. Diferențele de timp sunt exagerate ca să se vadă.">
          <FiberModes />
        </Figure>
        <h3>2. Multimod vs monomod</h3>
        <p>În fibra <b>multimod</b>, miezul e destul de lat încât lumina să circule pe <b>multe trasee (moduri)</b> simultan. Cele care merg drept ajung primele, cele care ricoșează mult — mai târziu. După o anumită distanță, impulsul unui bit se întinde peste bitul următor și receptorul nu le mai poate separa: aceasta e <b><G id="modal-dispersion" /></b>, motivul pentru care multimodul e limitat la sute de metri. Fibra <i>graded-index</i> (OM2 și mai noi) are indicele de refracție descrescător spre margine, astfel că razele „lungi” merg prin sticlă mai rapidă și ajung aproape odată cu celelalte.</p>
        <p>În fibra <b>monomod</b>, miezul de ≈9 µm e atât de subțire încât lumina are <b>un singur mod</b>. Nu există dispersie modală, deci distanța e limitată doar de atenuare și de alte fenomene mult mai mici: zeci de kilometri. Prețul: lumina trebuie injectată precis într-un miez minuscul, cu un <b>laser</b> (mai scump), iar conectorii trebuie aliniați foarte exact.</p>
        <Table head={['', 'Multimode (MMF)', 'Single-mode (SMF)']} rows={[
          ['Miez / înveliș', '50 µm sau 62.5 µm / 125 µm', '≈9 µm (8–10) / 125 µm — „9/125”'],
          ['Moduri de propagare', 'multe → dispersie modală', 'unul singur'],
          ['Sursă de lumină', 'LED (vechi), VCSEL', 'laser (FP, DFB)'],
          ['Lungimi de undă', '850 nm (și 1300 nm)', '1310 nm și 1550 nm'],
          ['Distanță tipică', 'zeci – sute de metri', 'kilometri – zeci de km'],
          ['Cost optică', 'mai mic', 'mai mare'],
          ['Culoare manta (TIA-598)', 'portocaliu (OM1/OM2), aqua (OM3/OM4), verde-lime (OM5)', 'galben'],
          ['Standarde tipice', '1000BASE-SX, 10GBASE-SR, 40GBASE-SR4', '1000BASE-LX, 10GBASE-LR/ER, 100GBASE-LR4'],
        ]} />
        <Callout kind="exam" title="Mnemonic">
          <b>M</b>ultimode = <b>M</b>ulte moduri, <b>M</b>etri (sute), miez <b>M</b>are, sursă ieftină la 850 nm. <b>S</b>ingle-mode = un <b>S</b>ingur mod, miez <b>S</b>ubțire, laser, kilometri. Paradox de reținut: fibra cu miezul <b>mai mic</b> merge <b>mai departe</b>.
        </Callout>
        <Analogy>Multimodul e ca un tobogan larg pe care copiii coboară în zigzag pe trasee diferite: pornesc împreună, dar ajung jos la momente diferite. Monomodul e un tub îngust: un singur drum, toți ajung exact în ordinea în care au plecat.</Analogy>

        <h3>3. Clasele de fibră: OM1–OM5 și OS1/OS2</h3>
        <Table head={['Clasă', 'Miez', 'Lățime de bandă modală @850 nm', 'Manta', '1000BASE-SX', '10GBASE-SR']} hlCol={0} rows={[
          [<G id="om-class">OM1</G>, '62.5 µm', '200 MHz·km', 'portocaliu', '275 m', '33 m'],
          ['OM2', '50 µm', '500 MHz·km', 'portocaliu', '550 m', '82 m'],
          ['OM3', '50 µm (laser-optimized)', '1500 MHz·km', 'aqua', '550 m+', '300 m'],
          ['OM4', '50 µm (laser-optimized)', '3500 MHz·km', 'aqua (uneori violet)', '550 m+', '400 m'],
          ['OM5', '50 µm (wideband)', '3500 MHz·km (+ 953 nm)', 'verde-lime', '550 m+', '400 m'],
          [<G id="os-class">OS1 / OS2</G>, '≈9 µm', '— (monomod)', 'galben', '— (se folosește LX)', '— (se folosește LR)'],
        ]} />
        <p className="small muted">OM3/OM4 sunt optimizate pentru <G id="vcsel" />-uri, care pot fi modulate la 10 Gb/s și peste; LED-urile (folosite cu OM1/OM2) se opresc la sute de Mb/s. OS2 are atenuare mai mică decât OS1 și e preferată pentru distanțe lungi și exterior. Valorile pentru 1000BASE-SX pe OM3+ depind de producătorul modulului; standardul garantează minimum 550 m.</p>

        <h3>4. Conectori</h3>
        <Figure caption="Conectorii pe care trebuie să-i recunoști: LC (cel mai comun azi), SC, ST, MPO — și modulul SFP cu cele două porturi TX și RX.">
          <FiberConnectors />
        </Figure>
        <Table head={['Conector', 'Ferulă', 'Prindere', 'Unde îl vezi']} hlCol={0} rows={[
          [<G id="lc-connector">LC</G>, '1.25 mm', 'clemă (ca RJ-45), de obicei duplex', 'module SFP/SFP+, patch panel-uri moderne'],
          [<G id="sc-connector">SC</G>, '2.5 mm', 'push-pull, pătrat', 'GBIC, echipamente mai vechi, operatori/FTTH'],
          [<G id="st-connector">ST</G>, '2.5 mm', 'baionetă (împingi și răsucești)', 'instalații multimod vechi, industrial'],
          [<G id="mpo">MPO/MTP</G>, 'dreptunghiulară, 8–24 fibre', 'push-pull', '40G/100G SR4, trunk-uri în centre de date'],
        ]} />
        <p>Finisajul capătului contează și el: <b>UPC</b> (plat, de obicei albastru) și <b>APC</b> (înclinat la 8°, verde, cu reflexie foarte mică — tipic la FTTH). <b>Nu se cuplează un APC cu un UPC.</b> Iar un conector murdar este cea mai frecventă cauză de probleme pe fibră: capetele se curăță și se inspectează înainte de conectare.</p>
        <Callout kind="warn" title="Siguranță">Nu te uita niciodată direct într-o fibră sau într-un port optic activ: lumina la 850/1310/1550 nm e invizibilă, dar poate afecta ochiul.</Callout>
      </Detailed>

      <Detailed title="Explicația detaliată — 5. Transceivere: SFP, SFP+, QSFP">
        <p>Switch-urile nu au optica „lipită” în placă. Portul de fibră este un <b>slot</b> în care introduci un modul <b>transceiver</b> (transmitter + receiver), ales după distanță și mediu. Același slot SFP poate primi un modul 1000BASE-SX (multimod), unul 1000BASE-LX (monomod) sau chiar unul 1000BASE-T cu RJ-45. Modulele sunt <b>hot-swappable</b>. Formatele sunt definite de producători prin acorduri <b>MSA</b>, nu de IEEE.</p>
        <Table head={['Format', 'Viteză tipică', 'Conector tipic', 'Note']} hlCol={0} rows={[
          [<G id="gbic" />, '1 Gb/s', 'SC duplex', 'generația veche, de 2× mai mare'],
          [<G id="sfp" />, '1 Gb/s', 'LC duplex (sau RJ-45)', 'cel mai comun pe uplink-uri de acces'],
          [<G id="sfp-plus">SFP+</G>, '10 Gb/s', 'LC duplex; sau cablu DAC', 'aceeași dimensiune ca SFP'],
          ['SFP28', '25 Gb/s', 'LC duplex', 'servere în centre de date'],
          [<G id="qsfp">QSFP+</G>, '40 Gb/s (4 × 10G)', 'MPO-12 (SR4) sau LC (LR4, BiDi)', 'spine–leaf'],
          ['QSFP28', '100 Gb/s (4 × 25G)', 'MPO-12 sau LC', 'spine–leaf, core'],
        ]} />
        <p>Pentru legături foarte scurte (în același rack sau între rack-uri vecine) se folosesc cabluri <b><G id="dac" /></b> (twinax de cupru cu module SFP+/QSFP fixate la capete) — mai ieftine decât două module optice plus o fibră.</p>

        <h3>6. TX, RX și polaritatea</h3>
        <p>O legătură optică obișnuită folosește <b>două fibre</b>: pe una emiți, pe cealaltă primești. TX-ul unui capăt trebuie să ajungă în RX-ul celuilalt. Patch cord-urile duplex LC „A-la-B” fac automat această încrucișare. Dacă fibrele sunt inversate (TX în TX), niciun capăt nu primește lumină, iar interfața rămâne <b>down/down</b>. Soluția e simplă: inversezi cele două fibre la <b>un singur</b> capăt.</p>
        <Figure caption="Interactiv: polaritate corectă, fibre inversate și varianta BiDi pe o singură fibră.">
          <TxRxPolarity />
        </Figure>
        <p><b><G id="bidi" /></b> (bidirecțional): când fibrele sunt puține sau închiriate, un modul BiDi emite pe o lungime de undă și recepționează pe alta, <b>pe aceeași fibră</b>. Exemplu standard: 1000BASE-BX10 (802.3ah) — 1310 nm într-un sens, 1490 nm în celălalt, 10 km. Modulele se montează în <b>perechi complementare</b> (un capăt „U”, celălalt „D”).</p>

        <h3>7. Cupru sau fibră? Avantajele fibrei</h3>
        <ul>
          <li><b>Distanță</b> — sute de metri (MMF) până la zeci de kilometri (SMF), față de 100 m pe cupru.</li>
          <li><b>Imunitate la <G id="emi" /></b> — lumina nu e afectată de motoare, cabluri de forță, trăsnete.</li>
          <li><b>Izolare electrică</b> — între clădiri nu apar bucle de masă sau diferențe de potențial (un cablu de cupru între clădiri poate aduce supratensiuni).</li>
          <li><b>Securitate</b> — mult mai greu de interceptat fără a fi detectat; nu radiază semnal.</li>
          <li><b>Dezavantaje</b> — module optice mai scumpe, fibra se poate rupe la îndoire, terminarea cere unelte și pregătire, nu duce <G id="poe" />.</li>
        </ul>
      </Detailed>

      <DeepDive title="Deep dive: ferestrele de 850, 1310 și 1550 nm și bugetul optic">
        <p>Sticla nu atenuează la fel toate lungimile de undă. Există „ferestre” cu pierderi mici: <b>850 nm</b> (ieftin de generat cu VCSEL, dar atenuare mai mare — bun pentru distanțe scurte), <b>1310 nm</b> (dispersie cromatică aproape zero în fibra monomod standard) și <b>1550 nm</b> (atenuarea minimă, în jur de 0.2–0.25 dB/km — pentru distanțe lungi, și zona în care lucrează amplificatoarele optice).</p>
        <p><b>Bugetul optic</b> = puterea emisă − sensibilitatea receptorului (în dB). Din el scazi pierderile: atenuarea fibrei × lungime, fiecare conector (≈0.3–0.75 dB), fiecare sudură (≈0.1 dB) și o marjă de siguranță. Dacă rămâne pozitiv, legătura merge. Pe Cisco vezi puterea TX/RX reală cu <code>show interfaces transceiver</code> (<G id="dom" />) — o valoare RX mult mai mică decât normal indică un conector murdar sau o fibră îndoită.</p>
        <p>Pe distanțe și mai lungi, operatorii pun zeci de lungimi de undă pe aceeași fibră (<b>DWDM</b>) — fiecare „culoare” e un canal independent de 10/100/400G.</p>
      </DeepDive>

      <Traps items={[
        <><b>SMF = miez mai mic (≈9 µm), distanță mai mare.</b> MMF = miez mai mare (50/62.5 µm), distanță mai mică. Învelișul are 125 µm la ambele.</>,
        <><b>Multimod → LED/VCSEL la 850 nm.</b> Monomod → <b>laser</b> la 1310/1550 nm.</>,
        <><b>Dispersia modală</b> limitează multimodul; monomodul nu o are (un singur mod).</>,
        <>Ambele tipuri de fibră sunt <b>imune la EMI</b> — nu doar monomodul.</>,
        <><b>SFP = 1G, SFP+ = 10G, QSFP+ = 40G, QSFP28 = 100G.</b> Conectorul tipic pe SFP/SFP+ este <b>LC</b>.</>,
        <>Fibre TX/RX inversate → <b>down/down</b> (nu „up cu erori”). BiDi = o singură fibră, două lungimi de undă.</>,
        <>Manta <b>galbenă</b> = monomod; <b>portocalie/aqua</b> = multimod.</>,
      ]} />
      <InlineQuiz ids={['1.3-021', '1.3-023', '1.3-027', '1.3-029']} />
    </section>
  );
}

/* ======================================================================
   1.3.b — Conexiuni: shared media vs point-to-point
   ====================================================================== */
export function Connections() {
  return (
    <section id="connections" className="section">
      <SectionHead id="connections" code="1.3.b" title="Connections — Ethernet shared media vs point-to-point" />
      <Summary>
        <p>Pe un <b>mediu partajat</b> (<G id="shared-media" />: coaxial sau <G id="hub" />) toate dispozitivele împart același „fir”: doar unul transmite la un moment dat (<G id="half-duplex" />), regula de acces e <G id="csma-cd" />, iar toți sunt într-un singur <G id="collision-domain" />.
          O legătură <b>punct-la-punct</b> (<G id="point-to-point" />: port de switch ↔ un dispozitiv, sau o legătură serială între două routere) are doar două capete și poate funcționa <G id="full-duplex" />, fără coliziuni. Domeniile de <G id="broadcast-domain">broadcast</G> le oprește doar un router (sau VLAN-urile).</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Mediul partajat și CSMA/CD">
        <p>Pe un coaxial 10BASE5/10BASE2 sau pe un hub, semnalul trimis de o stație ajunge electric la <b>toate</b>. Dacă două stații transmit în același timp, semnalele se suprapun și ambele cadre se distrug: o <b>coliziune</b>. Ethernetul clasic a rezolvat asta cu un protocol de „politețe” numit <G id="csma-cd" />:</p>
        <ul>
          <li><b>Carrier Sense</b> — ascultă înainte să vorbești: dacă pe fir e semnal, aștepți.</li>
          <li><b>Multiple Access</b> — oricine poate încerca, nu există un „șef” care dă cuvântul.</li>
          <li><b>Collision Detection</b> — în timp ce transmiți, verifici dacă pe fir e altceva decât ce trimiți tu. Dacă da: oprești, trimiți un semnal <i>jam</i>, aștepți un timp aleatoriu și reîncerci.</li>
        </ul>
        <Figure caption="Interactiv: parcurge pas cu pas ce se întâmplă când două stații transmit aproape simultan pe un mediu partajat.">
          <CsmaCdSteps />
        </Figure>
        <p>De ce trebuie un cadru să aibă <b>minimum 64 de octeți</b>? Pentru ca emițătorul să fie încă în emisie când „vestea” unei coliziuni de la celălalt capăt al rețelei se întoarce la el (512 biți = un <i>slot time</i>). Dacă ar termina de transmis înainte, n-ar ști că cadrul lui s-a distrus. O coliziune detectată după primii 64 de octeți se numește <G id="late-collision">late collision</G> și e un semn de problemă — detalii în <Link to="/topic/1.4">1.4</Link>.</p>
        <Analogy>Mediul partajat e o ședință fără moderator: asculți dacă vorbește cineva, iar dacă tace, începi. Dacă doi încep în aceeași clipă, amândoi se opresc, spun „pardon” (jam) și fiecare așteaptă câteva secunde la întâmplare înainte să încerce din nou.</Analogy>

        <h3>2. Half-duplex și full-duplex</h3>
        <Figure caption="Half-duplex: un singur sens la un moment dat. Full-duplex: căi separate pentru fiecare sens.">
          <DuplexCompare />
        </Figure>
        <p><b>Half-duplex</b> înseamnă că un dispozitiv fie transmite, fie primește. Este obligatoriu pe un mediu partajat. <b>Full-duplex</b> înseamnă transmisie și recepție simultane, pe căi separate (perechi sau fibre diferite; la 1000BASE-T, prin anularea ecoului). Condiția: <b>legătura trebuie să fie punct-la-punct</b> — un port de switch legat la un singur dispozitiv. Pe full-duplex nu există coliziuni, CSMA/CD e dezactivat, iar o legătură „de 1 Gb/s” duce 1 Gb/s <b>în fiecare sens</b>.</p>
        <Table head={['', 'Shared media (hub, coaxial)', 'Point-to-point (switch, serial, fibră)']} rows={[
          ['Câte dispozitive pe mediu', 'multe', 'exact două'],
          ['Duplex', 'half-duplex', 'full-duplex (de regulă)'],
          ['Coliziuni', 'posibile, normale în anumite limite', 'imposibile în full-duplex'],
          ['Acces la mediu', 'CSMA/CD', 'nu e nevoie de arbitrare'],
          ['Lățime de bandă', 'împărțită între toți', 'dedicată, pe fiecare sens'],
          ['Exemple', '10BASE5, 10BASE2, hub 10BASE-T; (și Wi-Fi — dar cu CSMA/CA)', 'PC ↔ switch, switch ↔ switch, router ↔ router (serial/Ethernet), E-Line'],
        ]} />

        <h3>3. Domenii de coliziune și domenii de broadcast</h3>
        <ul>
          <li><b><G id="collision-domain" /></b> — porțiunea în care două transmisii simultane se ciocnesc. <b>Hub</b> (nivel 1): toate porturile = <b>un singur</b> domeniu. <b>Switch</b> și <b>router</b>: fiecare port = un domeniu separat.</li>
          <li><b><G id="broadcast-domain" /></b> — porțiunea în care ajunge un cadru broadcast (de exemplu un ARP request). Hub-urile și switch-urile îl propagă pe toate porturile (din același VLAN); <b>routerul îl oprește</b>: fiecare interfață de router = un domeniu de broadcast separat.</li>
        </ul>
        <Figure caption="Interactiv: comută între scenarii și trimite un unicast sau un broadcast. Zonele colorate sunt domenii de coliziune; dreptunghiurile punctate sunt domenii de broadcast.">
          <DomainsDiagram />
        </Figure>
        <Table head={['Dispozitiv', 'Nivel OSI', 'Domenii de coliziune', 'Domenii de broadcast']} hlCol={0} rows={[
          [<G id="hub" />, 'L1', '1 pentru toate porturile', '1'],
          [<><G id="repeater" /></>, 'L1', 'nu separă (extinde domeniul)', 'nu separă'],
          [<>bridge / <G id="l2-switch">switch L2</G></>, 'L2', '1 per port', '1 (per VLAN)'],
          [<G id="router" />, 'L3', '1 per interfață', '1 per interfață'],
        ]} />
        <Callout kind="exam" title="Cum numeri la examen">
          <b>Coliziune:</b> numără legăturile care pornesc dintr-un port de switch sau de router; tot ce e legat în spatele unui hub contează ca <b>unul singur</b>. <b>Broadcast:</b> numără interfețele de router folosite (sau VLAN-urile). Exemplu: un router cu două interfețe, fiecare spre câte un switch cu 3 PC-uri → coliziune: 2 + 6 = <b>8</b>; broadcast: <b>2</b>.
        </Callout>

        <h3>4. Alte legături punct-la-punct: seriale și WAN</h3>
        <p>În WAN, cea mai veche legătură punct-la-punct este linia <G id="serial-link">serială</G> între două routere (istoric, o linie închiriată T1/E1). Un capăt este <b>DTE</b> (routerul), celălalt <b>DCE</b> — echipamentul operatorului care furnizează semnalul de ceas; în laborator, routerul cu capătul DCE al cablului dă ceasul cu <code>clock rate</code>. Pe legătură rulează un protocol de nivel 2: <G id="hdlc" /> (implicit pe Cisco) sau <G id="ppp" />. Azi, rolul acesta îl joacă mai ales legăturile Ethernet pe fibră și serviciile <G id="metro-ethernet" /> de tip E-Line (vezi <Link to="/topic/1.2">1.2</Link>).</p>
      </Detailed>

      <DeepDive title="Deep dive: backoff-ul exponențial și de ce au dispărut hub-urile">
        <p>După coliziunea numărul <i>n</i>, fiecare stație alege aleatoriu un număr de sloturi între 0 și 2<sup>k</sup> − 1, unde k = min(n, 10). După 16 încercări eșuate, cadrul este abandonat (contorul <i>excessive collisions</i>). Cu cât sunt mai multe stații și mai mult trafic, cu atât coliziunile cresc, iar debitul util scade mult sub 10 Mb/s.</p>
        <p>Switch-urile (bridge-uri multiport) au rezolvat problema: fiecare port e un segment separat, cadrele sunt stocate în buffer și trimise doar spre portul destinației (<Link to="/topic/1.13">1.13</Link>), iar cu un singur dispozitiv pe port, legătura poate trece în full-duplex. Hub-urile au dispărut din comerț; la 10G+ nici nu mai există mod half-duplex. Totuși, examenul întreabă încă despre ele, pentru că explică ideea de domeniu de coliziune.</p>
        <p>Wi-Fi este, și azi, un mediu partajat (aerul), dar folosește <G id="csma-ca" /> — evitarea, nu detecția coliziunilor (vezi <Link to="/topic/1.11">1.11</Link>).</p>
      </DeepDive>

      <Traps items={[
        <><b>Hub = 1 domeniu de coliziune + 1 domeniu de broadcast.</b> Switch = 1 domeniu de coliziune per port + 1 de broadcast (per VLAN). Router = separă ambele.</>,
        <><b>Full-duplex cere punct-la-punct.</b> Pe un hub nu poți avea full-duplex.</>,
        <><b>CSMA/CD</b> = Ethernet half-duplex (detecție). <b>CSMA/CA</b> = Wi-Fi (evitare).</>,
        <>Switch-ul <b>nu</b> oprește broadcast-urile — doar routerul (sau VLAN-urile).</>,
        <>Coliziunile pe o interfață <b>full-duplex</b> nu ar trebui să existe — dacă apar, suspectezi un duplex mismatch (<Link to="/topic/1.4">1.4</Link>).</>,
        <>Pe o legătură serială, <b>DCE</b> dă ceasul (<code>clock rate</code>), nu DTE.</>,
      ]} />
      <InlineQuiz ids={['1.3-032', '1.3-033', '1.3-035', '1.3-038']} />
    </section>
  );
}

/* ======================================================================
   Alege cablul potrivit
   ====================================================================== */
export function Choose() {
  return (
    <section id="choose" className="section">
      <SectionHead id="choose" code="1.3.a/b" title="Alege cablul potrivit — de la cerință la mediu" />
      <Summary>
        <p>Decizia are trei întrebări: <b>cât de departe?</b> (≤100 m → cupru; sute de metri → multimod; kilometri → monomod), <b>în ce mediu?</b> (zgomot electric sau între clădiri → fibră) și <b>ce dispozitive leg?</b> (straight / crossover / rollover). Viteza dorită alege apoi categoria de cablu sau tipul de modul.</p>
      </Summary>
      <Detailed>
        <Figure caption="Interactiv: mută distanța, alege viteza și condițiile, iar recomandarea se actualizează. Butoanele rapide aleg distanțe tipice.">
          <MediaChooser />
        </Figure>
        <Table head={['Situația', 'Alegerea', 'De ce']} rows={[
          ['PC la switch-ul de etaj, 60 m', 'UTP Cat5e/Cat6, straight-through', 'sub 100 m, ieftin, poate duce PoE'],
          ['Telefon IP + AP Wi-Fi 6 pe tavan, 80 m', 'Cat6A (sau Cat6) cu PoE, port mGig', 'AP-ul poate depăși 1 Gb/s; 2.5/5GBASE-T pe cablul existent'],
          ['Switch de acces la switch de distribuție, aceeași clădire, 180 m', 'MMF OM3/OM4, SFP 1000BASE-SX sau SFP+ 10GBASE-SR', 'peste 100 m; multimodul e cea mai ieftină optică'],
          ['Două clădiri la 2 km', 'SMF OS2, 1000BASE-LX / 10GBASE-LR', 'peste limita multimodului; izolare electrică'],
          ['Hală cu motoare și sudură, 70 m', 'fibră (sau STP împământat corect)', 'EMI puternic ar produce erori pe UTP'],
          ['Două servere în același rack, 10G', 'cablu DAC SFP+ (1–3 m)', 'cel mai ieftin pe distanțe foarte scurte'],
          ['Configurarea inițială a unui router nou', 'cablu de consolă (rollover) sau USB, 9600 8N1', 'nu are încă IP; acces out-of-band'],
          ['Legătură între centre de date la 30 km', 'SMF, 10GBASE-ER (1550 nm)', '40 km; atenuare minimă la 1550 nm'],
        ]} />
        <Callout kind="tip" title="În viața reală">
          Aproape toate cablurile de cupru pe care le vei atinge sunt <b>straight-through T568B</b>, iar porturile au Auto-MDIX. Crossover-ul și hub-urile sunt importante pentru înțelegere și pentru examen. Pe fibră, cele mai frecvente probleme sunt: <b>tip de fibră greșit</b> (modul SX pe fibră monomod), <b>TX/RX inversate</b> și <b>conectori murdari</b>.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Un modul <b>SX (multimod) nu se folosește pe fibră monomod</b> și invers — lungimile de undă și miezurile diferă. Ambele capete trebuie să aibă același tip de modul.</>,
        <><b>101 m</b> de cupru depășesc standardul — chiar dacă „poate merge”, răspunsul corect e fibră (sau un switch intermediar).</>,
        <>Între clădiri se preferă <b>fibra</b> și pentru <b>izolarea electrică</b>, nu doar pentru distanță.</>,
      ]} />
      <InlineQuiz ids={['1.3-043', '1.3-013', '1.3-022']} />
    </section>
  );
}
