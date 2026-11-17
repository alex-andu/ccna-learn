import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { ApModes, Architectures, CapwapJoin, SplitMac } from '../../diagrams/t2_6';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.6" title="Arhitecturi wireless Cisco și moduri AP — imaginea de ansamblu" />
      <Summary>
        <p>Rețelele wireless Cisco se construiesc în patru moduri: <b><G id="autonomous-ap">AP-uri autonome</G></b> (fiecare configurat separat), <b><G id="lightweight-ap">AP-uri lightweight</G> + <G id="wlc">WLC</G></b> (arhitectură <G id="split-mac">split-MAC</G>, conectate prin tuneluri <G id="capwap">CAPWAP</G>), <b>cloud-based</b> (<G id="cloud-managed">Meraki</G>) și <b>embedded</b> (controller integrat într-un AP sau switch, <G id="ewc">EWC</G>). Un AP lightweight poate funcționa în mai multe <b>moduri</b>: <b>Local</b> (implicit), <b>FlexConnect</b>, <b>Monitor</b>, <b>Sniffer</b>, <b>Rogue Detector</b>, <b>SE-Connect</b>, <b>Bridge/Mesh</b>.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 2.6 este <i>Describe Cisco Wireless Architectures and AP modes</i>. Nu are sub-puncte oficiale. Predăm: arhitecturile și când o alegi pe fiecare, apoi CAPWAP / split-MAC, apoi modurile AP.</p>
        <Table head={['Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['Arhitecturi', 'Cum se gestionează zeci sau sute de AP-uri fără să le configurezi pe fiecare?'],
          ['CAPWAP / split-MAC', 'Cum comunică un AP cu controller-ul și cine ce funcții îndeplinește?'],
          ['Moduri AP', 'Ce poate face un AP în afară de „a servi clienți” (securitate, depanare, sucursale)?'],
        ]} />
        <h3>Problema: o rețea wireless nu se oprește la un singur AP</h3>
        <p>În 1.11 ai văzut că un AP creează o celulă (BSS) și că mai multe AP-uri cu același SSID formează un ESS. Într-un campus apar zeci sau sute de AP-uri, iar fiecare cere decizii: pe ce canal lucrează, cu ce putere, ce SSID-uri, ce securitate, ce VLAN. Dacă le configurezi unul câte unul, apar erori și diferențe, iar roaming-ul și politicile de securitate devin inconsistente. Arhitecturile de mai jos sunt răspunsuri diferite la întrebarea „<b>unde stă inteligența rețelei wireless?</b>”.</p>
        <Callout kind="info" title="Legătura cu restul domeniului">
          Topicul 2.7 arată cum se cablează WLC-ul și AP-urile (porturi access/trunk, LAG), 2.8 cum administrezi echipamentele (SSH, HTTPS, AAA, cloud), iar 2.9 cum se creează un WLAN în interfața grafică a WLC-ului.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Obiectivul cere să <b>descrii</b> arhitecturile și modurile — vocabularul exact contează (Local, FlexConnect, Monitor…).</>,
        <>Un AP lightweight <b>nu poate funcționa singur</b> (în sensul unui AP autonom): are nevoie de WLC.</>,
      ]} />
      <InlineQuiz ids={['2.6-001', '2.6-003']} />
    </section>
  );
}

/* ======================================================================
   Arhitecturi
   ====================================================================== */
export function Arch() {
  return (
    <section id="arch" className="section">
      <SectionHead id="arch" code="2.6" title="Autonomous, lightweight + WLC, cloud-based și embedded" />
      <Summary>
        <p><b>Autonomous:</b> fiecare AP este independent. <b>Lightweight + WLC:</b> configurare, RRM, securitate și roaming centralizate; AP-urile sunt „subțiri”. <b>Cloud-based:</b> managementul stă într-un dashboard în cloud, datele rămân locale. <b>Embedded:</b> funcția de controller rulează pe un AP sau pe un switch Catalyst, pentru rețele mici.</p>
      </Summary>
      <Detailed title="1. Cele patru arhitecturi">
        <Figure caption="Interactiv: alege arhitectura și compară plusurile și minusurile.">
          <Architectures />
        </Figure>
        <Table head={['', 'Autonomous', 'Lightweight + WLC', 'Cloud-based', 'Embedded (EWC)']} hlCol={0} rows={[
          ['Unde stă controlul', 'în fiecare AP', 'WLC dedicat (hardware sau virtual)', 'cloud', 'un AP sau un switch'],
          ['Protocol AP ↔ control', '— (fiecare local)', 'CAPWAP', 'conexiune de management spre cloud', 'CAPWAP'],
          ['Scalare', 'mică', 'mare (sute/mii de AP)', 'mare, prin licențe', 'mică–medie'],
          ['RRM / roaming centralizat', 'nu', 'da', 'da, în cloud', 'da, la scară mică'],
          ['Exemple tipice', 'birou mic, lab', 'campus, spital, universitate', 'sucursale, magazine, IMM', 'sucursală cu 10–50 AP'],
        ]} />
        <h3>2. Autonomous AP</h3>
        <p>Singurul care „merge singur”: fiecare AP are propriul IOS, propria configurație (SSID-uri, securitate, mapare SSID→VLAN) și se leagă la switch printr-un port (access dacă servește un singur VLAN, trunk dacă servește mai multe). Avantaj: simplitate la 1–3 AP. Dezavantaj: nu scalează — nu există RRM comun, roaming-ul este mai lent și fiecare modificare se face de n ori.</p>
        <h3>3. Lightweight AP + WLC (controller-based)</h3>
        <p>AP-ul nu are configurație proprie persistentă de WLAN: la pornire <b>se alătură unui WLC</b> (CAPWAP), descarcă software-ul și configurația și lucrează conform politicii centralizate. WLC-ul poate fi un echipament dedicat, un controller pe un switch, un controller virtual (în cloud privat) sau unul integrat în AP (embedded). Beneficiile cheie:</p>
        <ul>
          <li><b>RRM</b> (<G id="rrm" />): WLC-ul ajustează automat canalele și puterea AP-urilor;</li>
          <li><b>Roaming</b> rapid între AP-uri (WLC-ul păstrează starea clientului);</li>
          <li><b>Politici uniforme</b>: SSID-uri, securitate, QoS, ACL definite o singură dată;</li>
          <li><b>Securitate</b>: detectarea AP-urilor „rogue”, IDS wireless.</li>
        </ul>
        <h3>4. Cloud-based (Cisco Meraki)</h3>
        <p>AP-urile se conectează automat, prin Internet, la un <b>dashboard în cloud</b> (zero-touch provisioning: scanezi serial, atribui rețeaua, AP-ul vine configurat). Plan de control și management în cloud; <b>datele clienților rămân în rețeaua locală</b> (nu trec prin cloud). Avantaje: lipsa controller-ului local, administrare de oriunde, gestionare identică pentru multe sucursale. Dezavantaje: licențe periodice și dependență de conectivitatea spre cloud pentru <b>management</b> (nu pentru traficul clienților deja funcțional).</p>
        <h3>5. Embedded (controller integrat)</h3>
        <p>Funcția WLC rulează într-un AP „principal” (de exemplu <i>Embedded Wireless Controller on AP</i>) sau pe un switch Catalyst (de exemplu seria 9000, cu WLC integrat). Se potrivește sucursalelor mici care vor funcții de controller fără hardware dedicat. Capacitatea (număr de AP, clienți) este limitată față de un WLC dedicat. (Denumiri istorice precum „Mobility Express” au fost înlocuite de EWC în portofoliul actual.)</p>
        <Analogy>Gândește-te la o rețea de restaurante: <b>autonomous</b> = fiecare restaurant își scrie singur meniul și regulile; <b>lightweight + WLC</b> = sediul central trimite meniul și regulile identice tuturor, iar bucătarii (AP) doar gătesc; <b>cloud</b> = aceleași reguli sunt trimise dintr-o aplicație de oriunde din lume; <b>embedded</b> = unul dintre restaurante joacă și rol de sediu pentru un grup mic.</Analogy>
        <Callout kind="exam" title="Cum alegi (formularea de examen)">
          Câteva AP-uri, fără IT dedicat ⇒ <b>cloud-based</b> sau autonomous. Campus mare, politici centralizate, roaming ⇒ <b>lightweight + WLC</b>. Sucursală mică cu cerințe de controller fără hardware ⇒ <b>embedded</b>. Sucursale numeroase, fără echipă locală ⇒ <b>cloud-based</b>.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Cloud-based: <b>traficul clienților nu trece prin cloud</b>; doar managementul.</>,
        <>Autonomous nu are controller și <b>nu</b> are CAPWAP.</>,
        <>Embedded (EWC) = funcția de controller într-un AP/switch; nu înseamnă un AP autonom.</>,
        <>Lightweight AP fără WLC accesibil nu poate servi clienți (în afară de scenarii speciale FlexConnect cu AP deja alăturat).</>,
      ]} />
      <InlineQuiz ids={['2.6-005', '2.6-007', '2.6-009']} />
    </section>
  );
}

/* ======================================================================
   CAPWAP / split-MAC
   ====================================================================== */
export function Capwap() {
  return (
    <section id="capwap" className="section">
      <SectionHead id="capwap" code="2.6" title="CAPWAP și arhitectura split-MAC" />
      <Summary>
        <p>În arhitectura <b>split-MAC</b>, funcțiile care cer timp real (beacons, ACK, criptarea cadrelor) rămân pe AP, iar cele de management (autentificare, configurare, RRM, roaming) se mută pe WLC. AP-ul și WLC-ul comunică prin <b><G id="capwap" /></b> (RFC 5415): <b>UDP 5246</b> pentru control (criptat <G id="dtls">DTLS</G>) și <b>UDP 5247</b> pentru date (DTLS opțional). Un AP se alătură unui WLC prin <b>discovery → join → configurare → run</b>.</p>
      </Summary>
      <Detailed title="1. Split-MAC: cine face ce">
        <p>Subnivelul MAC al 802.11 conține și sarcini de microsecunde (răspunsul ACK la 10 µs după un cadru) și sarcini „lente” (autentificarea unui client, alegerea canalului). Prima categorie nu poate fi trimisă prin rețea la un controller; a doua se face mai bine centralizat. Rezultatul este împărțirea MAC în două.</p>
        <Figure caption="Interactiv: alege o funcție și vezi pe ce parte rulează.">
          <SplitMac />
        </Figure>
        <h3>2. Cele două tuneluri CAPWAP</h3>
        <Table head={['Tunel', 'Port UDP', 'Conține', 'Securitate']} hlCol={0} rows={[
          ['Control', '5246', 'Descoperire, join, configurare, monitorizare, comenzi de management', 'Întotdeauna criptat cu DTLS'],
          ['Date', '5247', 'Traficul clienților încapsulat (în modul Local / central switching)', 'DTLS opțional (se activează explicit)'],
        ]} />
        <p>Un cadru al clientului este întâi convertit de AP din 802.11 în 802.3 și apoi <b>încapsulat în CAPWAP/UDP 5247</b> și trimis la WLC; WLC-ul îl scoate din tunel și îl trimite pe VLAN-ul corespunzător WLAN-ului (interfața dinamică, 2.7). Aceasta înseamnă că, în modul Local, <b>tot traficul wireless trece prin WLC</b>, indiferent de destinație (inclusiv între doi clienți ai aceluiași AP).</p>
        <Callout kind="info" title="LWAPP (istoric)">
          CAPWAP este succesorul protocolului Cisco proprietar LWAPP (care folosea alte porturi UDP). Examenul actual pune accentul pe CAPWAP; LWAPP apare doar ca istoric.
        </Callout>
        <h3>3. Cum se alătură un AP unui WLC</h3>
        <Figure caption="Pas cu pas: de la pornire la starea Run.">
          <CapwapJoin />
        </Figure>
        <p>Pe scurt: AP-ul obține un IP (DHCP), își află WLC-ul (adresă salvată, <i>DHCP option 43</i>, DNS sau broadcast), stabilește tunelul DTLS, face <i>join</i>, primește software-ul și configurația, apoi intră în <b>Run</b>. Dacă AP-ul nu își găsește niciun WLC (DHCP lipsă, VLAN greșit, rută lipsă, firewall care blochează UDP 5246/5247), <b>nu se alătură</b> și nu servește clienți.</p>
        <Table head={['Simptom', 'Cauze tipice']} hlCol={0} rows={[
          ['AP-ul nu primește IP', 'Port de switch în VLAN greșit; DHCP lipsă sau fără pool pentru acel VLAN'],
          ['AP-ul are IP dar nu găsește WLC', 'Option 43/DNS lipsă; WLC în altă subrețea fără rută'],
          ['AP-ul vede WLC, dar join eșuează', 'UDP 5246/5247 filtrat; ora/certificat; licență/limită de AP'],
          ['AP-ul se alătură, dar clienții nu primesc IP', 'WLAN mapat pe VLAN/interfață greșită sau trunk fără VLAN permis (2.7)'],
        ]} />
      </Detailed>
      <DeepDive title="De ce DTLS pentru control">
        <p>Tunelul de control poartă chei de criptare ale clienților și comenzi de configurare; un atacator care l-ar putea citi sau injecta ar putea compromite întreaga rețea wireless. Din acest motiv CAPWAP cere DTLS (versiunea TLS peste UDP) pentru control. Pentru date, criptarea este opțională: traficul clienților este deja protejat în aer (WPA2/WPA3), iar în rețeaua cablată se presupune că este în interiorul organizației; la sucursale, peste WAN, se poate activa DTLS pe tunelul de date.</p>
      </DeepDive>
      <Traps items={[
        <>CAPWAP: control <b>UDP 5246</b> (DTLS obligatoriu), date <b>UDP 5247</b> (DTLS opțional).</>,
        <>Split-MAC: timpul real (beacon, ACK, criptare) pe <b>AP</b>; management, autentificare, RRM pe <b>WLC</b>.</>,
        <>În modul Local, traficul clienților este tunelat la WLC (<b>central switching</b>).</>,
      ]} />
      <InlineQuiz ids={['2.6-011', '2.6-013', '2.6-015']} />
    </section>
  );
}

/* ======================================================================
   Moduri AP
   ====================================================================== */
export function Modes() {
  return (
    <section id="modes" className="section">
      <SectionHead id="modes" code="2.6" title="Modurile unui AP lightweight" />
      <Summary>
        <p><b>Local</b> (implicit): servește clienți, tunelează datele la WLC, face scanări RRM. <b>FlexConnect</b>: poate comuta traficul local și supraviețuiește pierderii WLC-ului. <b>Monitor</b>: doar ascultă (IDS, rogue, localizare). <b>Sniffer</b>: captează trafic 802.11 pentru analiză. <b>Rogue Detector</b>: caută AP-uri rogue în rețeaua cablată. <b>SE-Connect</b>: analiză de spectru. <b>Bridge/Mesh</b>: backhaul wireless.</p>
      </Summary>
      <Detailed title="1. Tabelul modurilor">
        <Figure caption="Interactiv: alege un mod și vezi dacă servește clienți, cum circulă datele și când îl folosești.">
          <ApModes />
        </Figure>
        <Table head={['Mod', 'Servește clienți?', 'Rol']} hlCol={0} rows={[
          [<b>Local</b>, 'da', 'Modul implicit; tunel CAPWAP la WLC; scanează alte canale pe scurt, periodic'],
          [<b>FlexConnect</b>, 'da', 'Local switching (traficul iese direct pe portul AP-ului, de regulă trunk) și autonomie la pierderea WLC-ului'],
          [<b>Monitor</b>, 'nu', 'Dedicat securității: IDS wireless, detectare rogue, localizare (location tracking)'],
          [<b>Sniffer</b>, 'nu', 'Captează cadre 802.11 și le trimite unui analizor (Wireshark/OmniPeek)'],
          [<b>Rogue Detector</b>, 'nu', 'Ascultă rețeaua cablată (ARP) ca să potrivească MAC-uri rogue; se conectează la un port trunk ca să vadă toate VLAN-urile'],
          [<b>SE-Connect</b>, 'nu', 'Analiză de spectru (CleanAir / Spectrum Expert): identifică interferențe non-802.11'],
          [<b>Bridge / Mesh</b>, 'da (în mesh: AP-uri tip MAP/RAP)', 'Legături punct-la-punct sau mesh exterior; Flex+Bridge combină FlexConnect cu mesh'],
        ]} />
        <h3>2. Local vs FlexConnect — cea mai frecventă comparație</h3>
        <Table head={['', 'Local', 'FlexConnect']} hlCol={0} rows={[
          ['Traficul clienților', 'Tunel CAPWAP la WLC (central switching)', 'Poate fi comutat local pe AP (local switching), per WLAN'],
          ['Port de switch', 'Access (un singur VLAN, de management al AP-ului)', 'De obicei trunk (VLAN-urile clienților sunt terminate local)'],
          ['Dacă WLC-ul cade', 'AP-ul își pierde funcția de servire a clienților (după pierderea tunelului)', 'Rămâne în modul standalone și continuă să servească clienții cu local switching'],
          ['Utilizare', 'Campus, LAN rapid', 'Sucursale la distanță, WAN lent sau nesigur'],
        ]} />
        <Callout kind="exam" title="Ce face fiecare mod „special”">
          <b>Monitor</b> = securitate (nu servește clienți). <b>Sniffer</b> = captură spre un PC cu analizor. <b>Rogue Detector</b> = potrivește MAC-uri cu rețeaua cablată. <b>SE-Connect</b> = spectru. Dacă întrebarea spune „<i>AP care nu servește clienți și trimite pachetele capturate unui PC cu Wireshark</i>”, răspunsul este Sniffer.
        </Callout>
        <Callout kind="warn" title="Schimbarea modului">
          Modul se setează pe WLC, per AP. Schimbarea implică, de obicei, repornirea sesiunii AP–WLC (AP-ul se realătură); nu schimba modul AP-urilor din producție fără fereastră de intervenție. Un AP care servea clienți în modul Local îi pierde la trecerea în Monitor.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Modul implicit este <b>Local</b>.</>,
        <>FlexConnect: local switching + survie la pierderea WLC-ului; portul de switch este <b>trunk</b>.</>,
        <>Monitor, Sniffer, Rogue Detector, SE-Connect: <b>nu servesc clienți</b>.</>,
        <>Sniffer trimite capturile unui <b>analizor</b>; Monitor le folosește pentru <b>IDS/rogue/localizare</b>.</>,
      ]} />
      <InlineQuiz ids={['2.6-017', '2.6-019', '2.6-021', '2.6-023']} />
    </section>
  );
}
