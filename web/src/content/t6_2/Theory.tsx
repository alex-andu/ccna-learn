import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { ArchitectureCompare, ChangePushDemo, ControllerWorkflow } from '../../diagrams/t6_2';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="6.2" title="Rețele tradiționale vs rețele bazate pe controller — imaginea de ansamblu" />
      <Summary>
        <p>Într-o rețea <b>tradițională</b> fiecare router și switch este un „mic creier” independent: are propria configurație, își calculează singur deciziile și îl administrezi pe rând. Într-o rețea <b>bazată pe controller</b> există un punct central (<G id="controller-based-networking" />) de unde proiectezi, aplici politici și vezi întreaga rețea, prin API-uri, iar echipamentele execută.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul 6.2 este <i>Compare traditional networks with controller-based networking</i>. Este un obiectiv de <b>comparație</b>: trebuie să poți spune, pentru fiecare model, <i>unde stă controlul</i>, <i>cum configurezi</i>, <i>cum depanezi</i>, <i>cum se schimbă politicile</i> și <i>ce riscuri</i> apar. Detaliile arhitecturii (overlay, underlay, fabric, API-uri northbound/southbound) vin la 6.3.</p>
        <Table head={['Aspect', 'Tradițional', 'Bazat pe controller']} hlCol={0} rows={[
          ['Punctul de administrare', 'Fiecare echipament, separat', 'Controller-ul central (GUI + API)'],
          ['Cum descrii ce vrei', 'Comenzi CLI per echipament', 'Intenție/politici la nivel de rețea'],
          ['Vizibilitate', 'Per echipament; NMS cu SNMP/syslog', 'Imagine unitară a rețelei (topologie, clienți, sănătate)'],
          ['Consecvență', 'Depinde de disciplină; drift frecvent', 'Politică aplicată uniform; conformitate verificată'],
          ['Programabilitate', 'Limitată (CLI, SNMP); scripturi', 'API-uri northbound REST, integrare cu alte sisteme'],
        ]} />
        <Analogy>Un cor fără dirijor vs cu dirijor: într-un cor tradițional fiecare cântăreț are partitura lui și se aude pe ceilalți; într-un cor cu dirijor, dirijorul (controller-ul) coordonează intrările și tempoul, dar <b>cântăreții cântă în continuare</b> (data plane). Dacă dirijorul iese o clipă din sală, corul poate continua ce a început — dar nu mai poate schimba piesa.</Analogy>
        <Callout kind="info" title="„Controller-based” nu înseamnă neapărat „SDN pur”">
          Există mai multe grade: de la controller-e care doar <i>administrează</i> (Catalyst Center peste echipamente clasice) până la arhitecturi unde o parte din control plane este centralizată (6.3). La 6.2 compari principiile; nu trebuie să alegi un produs anume.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Controller-ul nu înlocuiește echipamentele: ele încă <b>trimit traficul</b> (data plane).</>,
        <>„Controller-based” nu e egal cu „fără CLI”: CLI-ul rămâne pentru depanare și situații speciale.</>,
        <>La 6.2 compari modelele; overlay/underlay/fabric și northbound/southbound sunt la 6.3.</>,
      ]} />
      <InlineQuiz ids={['6.2-001', '6.2-002', '6.2-003']} />
    </section>
  );
}

/* ======================================================================
   1. Rețele tradiționale
   ====================================================================== */
export function TraditionalSection() {
  return (
    <section id="trad" className="section">
      <SectionHead id="trad" code="6.2" title="Rețeaua tradițională: control distribuit, administrare device cu device" />
      <Summary>
        <p>În modelul tradițional fiecare echipament are propriul <G id="control-plane" /> (OSPF, STP etc.), propriul <G id="data-plane" /> și propria configurație. Administrarea se face prin CLI (SSH/console), monitorizarea prin SNMP/syslog. Merge, dar scalează greu și produce inconsistențe.</p>
      </Summary>
      <Detailed title="1. Cum funcționează">
        <ol>
          <li><b>Control distribuit</b>: fiecare router rulează protocoalele și își calculează singur tabela de rutare; fiecare switch își construiește singur tabela MAC și rulează STP.</li>
          <li><b>Configurare locală</b>: o politică (ACL, QoS, VLAN) se traduce de inginer în comenzi pentru fiecare echipament în parte.</li>
          <li><b>Monitorizare prin NMS</b>: un sistem de management interoghează echipamentele prin <G id="snmp" /> și primește syslog (4.4, 4.5); vizibilitatea este în mare parte „per echipament”.</li>
          <li><b>Depanare prin CLI</b>: te conectezi la echipamentele de pe cale și rulezi show/ping/traceroute pe rând.</li>
        </ol>
        <p>Avantaje reale: fiecare echipament este <b>autonom</b> (dacă pierde legătura cu „sistemul de management”, tot funcționează), tehnologia este matură, ieftină la început și bine înțeleasă; nu ai un punct central de defectare pentru management.</p>
      </Detailed>
      <Detailed title="2. Limitări">
        <Table head={['Limitare', 'Explicație', 'Exemplu']} hlCol={0} rows={[
          ['Scalare operațională', 'Fiecare modificare se repetă pe fiecare echipament', 'Un VLAN nou pe 120 de switch-uri'],
          ['Inconsistență', 'Aceeași politică, implementată puțin diferit pe fiecare echipament', 'ACL-ul „standard” cu trei variante'],
          ['Vizibilitate fragmentată', 'Starea rețelei trebuie reconstruită din sute de show-uri', 'Depanarea unui flux care traversează 6 echipamente'],
          ['Politici legate de adrese', 'Regulile se exprimă prin IP-uri, VLAN-uri, porturi, nu prin „cine” și „ce”', 'ACL-uri care se rup la mutarea unui server'],
          ['Schimbări lente', 'Fiecare cerere de afaceri înseamnă ore sau zile de configurare', 'O aplicație nouă care cere QoS și segmentare'],
        ]} />
        <Callout kind="tip" title="Rețeaua tradițională nu a dispărut">
          Majoritatea rețelelor reale amestecă ambele modele: echipamente clasice administrate manual sau cu scripturi, plus zone administrate de un controller. La examen contează să înțelegi diferențele și compromisurile, nu să „condamni” modelul tradițional.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Control plane <b>distribuit</b> = fiecare echipament decide singur; nu înseamnă „fără protocoale”.</>,
        <>SNMP/NMS poate fi centralizat ca <b>monitorizare</b>, dar rețeaua rămâne tradițională dacă politicile se configurează tot per echipament.</>,
        <>Avantajul autonomiei: echipamentul funcționează chiar dacă sistemul de management nu e disponibil.</>,
      ]} />
      <InlineQuiz ids={['6.2-004', '6.2-005', '6.2-006', '6.2-007']} />
    </section>
  );
}

/* ======================================================================
   2. Rețele bazate pe controller
   ====================================================================== */
export function ControllerSection() {
  return (
    <section id="ctrl" className="section">
      <SectionHead id="ctrl" code="6.2" title="Rețeaua bazată pe controller: un punct central, API-uri, intenție" />
      <Summary>
        <p>Un controller este un sistem software cu imaginea <b>întregii</b> rețele. Tu îi spui <i>ce</i> vrei (intenție, politici), iar el calculează <i>cum</i> și configurează echipamentele prin API-uri. Aplicațiile și automatizările îi cer servicii tot prin API-uri. Exemple: <G id="catalyst-center" /> (campus), <G id="wlc" /> (wireless), controller-e SD-WAN, Meraki Dashboard.</p>
      </Summary>
      <Detailed title="1. Ce aduce un controller">
        <ul>
          <li><b>Vizibilitate centrală</b> (<G id="single-pane-of-glass" />): topologie, inventar, clienți, aplicații, sănătate — într-un singur loc.</li>
          <li><b>Configurare la nivel de rețea</b>: modifici o dată politica sau designul; controller-ul o aplică pe toate echipamentele vizate.</li>
          <li><b>Consecvență și conformitate</b>: controller-ul știe ce ar trebui să ruleze fiecare echipament și raportează abaterile (drift, 6.1).</li>
          <li><b>API-uri</b>: <i>northbound</i> pentru aplicații și automatizări (de obicei REST, 6.5); <i>southbound</i> către echipamente (CLI/SSH, SNMP, NETCONF/RESTCONF etc., 6.3).</li>
          <li><b>Automatizare a ciclului de viață</b>: echipamente noi (ZTP/Plug and Play), actualizări software, șabloane.</li>
          <li><b>Analiză și assurance</b>: telemetrie și analiză (inclusiv ML, 6.4) pentru a găsi probleme și a sugera remedieri.</li>
        </ul>
      </Detailed>
      <Detailed title="2. Ce se întâmplă când aplici o politică — interactiv">
        <p>Compară cele două modele. Alege numărul de echipamente, aplică politica și observă diferența — mai ales când un echipament este inaccesibil.</p>
        <Figure caption="Interactiv: aceeași politică aplicată device cu device (tradițional) sau printr-un controller.">
          <ChangePushDemo />
        </Figure>
      </Detailed>
      <Detailed title="3. Arhitectura în imagine">
        <Figure caption="Interactiv: control distribuit vs controller central; simulează indisponibilitatea controller-ului.">
          <ArchitectureCompare />
        </Figure>
        <p>În partea dreaptă a figurii, controller-ul <b>nu</b> stă pe calea pachetelor utilizatorilor: pachetele continuă să circule între echipamente. Controller-ul stă pe calea <b>managementului</b> (și, în arhitecturi SDN complete, a unei părți din control plane — vezi 6.3).</p>
      </Detailed>
      <Detailed title="4. Exemplu: fluxul de lucru într-un controller de campus (Catalyst Center)">
        <p>Catalyst Center organizează munca în patru etape. Nu trebuie să memorezi meniurile, dar trebuie să înțelegi ideea: <b>proiectezi, definești politica, provizionezi, monitorizezi</b>.</p>
        <Figure caption="Interactiv: etapele Design → Policy → Provision → Assurance.">
          <ControllerWorkflow />
        </Figure>
        <p>Catalyst Center poate administra și echipamente „clasice”: le descoperă, le inventariază și le configurează prin interfețele existente (CLI/SSH, SNMP, NETCONF), iar pentru arhitectura SD-Access creează și un fabric (6.3).</p>
      </Detailed>
      <Detailed title="5. Familia de controller-e (recunoaștere)">
        <Table head={['Exemplu', 'Ce administrează', 'Observație']} hlCol={0} rows={[
          [<>Catalyst Center (fost DNA Center)</>, 'Campus: switch-uri, routere, WLC-uri, AP-uri', 'Automatizare, politici, assurance; baza SD-Access'],
          [<>Cisco Catalyst SD-WAN</>, 'Conexiuni WAN între sedii', 'Controller central pentru politici și rute peste mai multe transporturi'],
          [<>Meraki Dashboard</>, 'Echipamente administrate din cloud', 'Controller în cloud (cloud-managed)'],
          [<>WLC (Wireless LAN Controller)</>, 'AP-uri lightweight (CAPWAP)', 'Exemplu mai vechi de „controller” — vezi 2.6'],
          [<>Cisco ACI (APIC)</>, 'Fabric de data center', 'Politici bazate pe aplicații; peste nivelul CCNA'],
        ]} />
      </Detailed>
      <DeepDive title="Intent-based networking: traducere, activare, verificare">
        <p>Când controller-ul implementează <G id="intent-based-networking" />, cele trei funcții sunt: <b>translation</b> (traduci intenția de business în politici de rețea), <b>activation</b> (aplici automat politicile pe echipamente) și <b>assurance</b> (măsori continuu dacă rețeaua face ce ai cerut, cu telemetrie și analiză; la nevoie corectezi). Este versiunea „closed loop” (6.1) integrată într-un controller.</p>
        <p>Observă diferența față de un script: scriptul face doar <i>aplicarea</i>. Un sistem bazat pe intenție adaugă traducerea și verificarea continuă.</p>
      </DeepDive>
      <Traps items={[
        <>Controller-ul administrează prin <b>API-uri</b>; nu schimbă formatul cadrelor și nu transportă traficul utilizatorilor.</>,
        <>Un controller de management indisponibil <b>nu oprește</b> forwarding-ul existent; nu mai poți însă să schimbi politici central.</>,
        <>WLC și Catalyst Center sunt ambele „controller-e”, dar cu domenii diferite (wireless vs întreaga rețea de campus).</>,
        <>Un controller introduce un nou punct critic: de aceea este redundant, protejat și monitorizat.</>,
      ]} />
      <InlineQuiz ids={['6.2-008', '6.2-009', '6.2-010', '6.2-011', '6.2-012', '6.2-013']} />
    </section>
  );
}

/* ======================================================================
   3. Comparația
   ====================================================================== */
export function CompareSection() {
  return (
    <section id="compare" className="section">
      <SectionHead id="compare" code="6.2" title="Comparația completă și când se potrivește fiecare model" />
      <Summary>
        <p>Tradiționalul câștigă la simplitate, autonomie și cost inițial mic; controller-ul câștigă la scară, consecvență, vizibilitate și viteză de schimbare. Criteriul practic: cu cât rețeaua e mai mare și mai dinamică, cu atât beneficiile controller-ului cresc.</p>
      </Summary>
      <Detailed title="1. Tabel comparativ">
        <Table head={['Criteriu', 'Tradițional', 'Bazat pe controller']} hlCol={0} rows={[
          ['Unde e controlul', 'Distribuit pe fiecare echipament', 'Politică și management centralizate; (uneori și o parte din control plane, 6.3)'],
          ['Configurare', 'Per echipament (CLI)', 'Centralizat (GUI/API), șabloane, politici'],
          ['Politici', 'Legate de IP/VLAN/port', 'La nivel de intenție (utilizator, grup, aplicație)'],
          ['Vizibilitate', 'Fragmentată; NMS + show', 'Unitară: topologie, clienți, sănătate'],
          ['Consecvență', 'Depinde de disciplină; drift', 'Aplicată uniform; conformitate monitorizată'],
          ['Viteza schimbărilor', 'Lentă, proporțională cu nr. echipamentelor', 'Rapidă; o singură intenție'],
          ['Depanare', 'Echipament cu echipament', 'Vedere end-to-end + analiză; CLI când e nevoie'],
          ['Programabilitate', 'Scripturi peste CLI/SNMP', 'API-uri northbound REST, integrare'],
          ['Punct central de defectare', 'Nu pentru management (autonom)', 'Controller-ul (de aceea redundant)'],
          ['Costuri și competențe', 'Mici la început; muncă manuală multă', 'Licențe/infrastructură; competențe de API/automatizare'],
          ['Securitate', 'Per echipament (parole, ACL)', 'Segmentare și politici centralizate; atenție la accesul la controller'],
        ]} />
      </Detailed>
      <Detailed title="2. Când alegi ce">
        <Table head={['Situație', 'Model potrivit', 'De ce']} hlCol={0} rows={[
          ['Birou mic, 3 switch-uri, schimbări rare', 'Tradițional', 'Costul și complexitatea controller-ului nu se justifică'],
          ['Campus cu sute de switch-uri și AP-uri, politici de segmentare', 'Bazat pe controller', 'Consecvență, vizibilitate, automatizare'],
          ['Zeci de filiale cu echipament identic, personal IT puțin', 'Controller (de obicei cloud/SD-WAN)', 'Provizionare fără atingere și administrare centrală'],
          ['Echipamente vechi, fără API-uri', 'Tradițional sau hibrid', 'Controller-ul le poate administra doar prin CLI/SNMP, cu limite'],
        ]} />
        <Callout kind="exam" title="Cum cade la examen">
          Întrebările tipice: „Care este un avantaj al rețelei bazate pe controller?” (administrare centralizată, consecvență, API-uri), „Unde rulează control plane într-o rețea tradițională?” (pe fiecare echipament), „Ce protocoale/mecanisme folosește managementul tradițional?” (CLI/SSH, SNMP, syslog) și „Prin ce interfață cer aplicațiile servicii controller-ului?” (northbound API, de obicei REST).
        </Callout>
      </Detailed>
      <Traps items={[
        <>Nu există „model corect” universal: criteriul e scara, dinamica și competențele echipei.</>,
        <>„Centralizat” nu înseamnă „un singur punct de defectare” dacă controller-ul este redundant și forwarding-ul e independent de el.</>,
        <>Un echipament tradițional administrat de un controller rămâne tradițional ca <b>hardware</b>; se schimbă modul de <b>administrare</b>.</>,
      ]} />
      <InlineQuiz ids={['6.2-014', '6.2-015', '6.2-016', '6.2-017', '6.2-018', '6.2-019']} />
    </section>
  );
}
