import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DefaultVlanPorts, InterVlanMethods, VlanBroadcast, VoicePort } from '../../diagrams/t2_1';

/* ======================================================================
   0. Introducere — imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.1" title="VLAN-uri pe mai multe switch-uri — imaginea de ansamblu" />
      <Summary>
        <p>Un <b><G id="vlan">VLAN</G></b> împarte <b>logic</b> un switch fizic în mai multe rețele separate: fiecare VLAN este propriul <G id="broadcast-domain">domeniu de broadcast</G>, cu propria subrețea IP. Stațiile din VLAN-uri diferite nu se văd între ele la nivel 2; ca să comunice au nevoie de un <b>dispozitiv de nivel 3</b> (<G id="inter-vlan-routing">inter-VLAN routing</G>). Un port <b>access</b> aparține unui singur VLAN (plus, opțional, un VLAN de voce); legăturile între switch-uri duc mai multe VLAN-uri (trunk, topicul 2.2).</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial 2.1 este <i>Configure and verify VLANs (normal range) spanning multiple switches</i>. Verbul este „Configure and verify”: la examen și în practică trebuie să știi să <b>creezi VLAN-uri, să atribui porturi, să citești output-ul</b> și să depanezi când două stații „nu se văd”.</p>
        <Table head={['Cod Cisco', 'Tema', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['2.1.a', 'Access ports (data and voice)', 'Cum pun un port într-un VLAN și cum fac ca un telefon IP + un PC să împartă același cablu?'],
          ['2.1.b', 'Default VLAN', 'Ce este VLAN 1, de ce există din fabrică și de ce e bine să nu transporte trafic de utilizatori?'],
          ['2.1.c', 'InterVLAN connectivity', 'Cum comunică două VLAN-uri diferite? (router-on-a-stick și SVI pe switch L3)'],
        ]} />
        <Callout kind="info" title="„Spanning multiple switches” și legătura cu 2.2">
          Un VLAN poate exista pe mai multe switch-uri: PC-urile din VLAN 10 de la etajul 1 și de la etajul 2 sunt în aceeași rețea logică. Pentru asta, cablul dintre switch-uri trebuie să transporte <b>mai multe VLAN-uri simultan</b>: un <G id="trunk">trunk</G> 802.1Q. Trunk-ul este tema obiectivului 2.2; aici îl folosim doar ca „drum comun” și îi dăm comenzile minime în laburi. Codurile oficiale a/b/c se păstrează în ordine.
        </Callout>

        <h3>Problema: un singur domeniu de broadcast nu scalează</h3>
        <p>Un switch fără configurare pune <b>toate porturile în același VLAN (VLAN 1)</b>. Toate stațiile formează un singur <G id="broadcast-domain">domeniu de broadcast</G>: orice <G id="arp">ARP</G> request, orice DHCP discover ajunge la toată lumea. Pe o rețea mică e o mică pierdere de timp; pe o rețea de sute de stații devine zgomot, apar probleme de securitate (contabilitatea și vizitatorii în aceeași rețea) și e imposibil de organizat.</p>
        <p>Înainte de VLAN-uri, singura soluție era <b>un switch și un router separat pentru fiecare grup</b>. VLAN-urile (IEEE 802.1Q) rezolvă problema <b>în software</b>: comanzi switch-ului „porturile 1–4 sunt rețeaua A, porturile 5–8 rețeaua B” și el se comportă ca două switch-uri separate. Un broadcast al rețelei A nu mai iese în rețeaua B.</p>
        <Figure caption="Interactiv: apasă pe un PC ca să-l faci să trimită un broadcast. Comută între „fără VLAN” și „cu VLAN” și observă câte stații îl primesc.">
          <VlanBroadcast />
        </Figure>
        <Analogy>Un switch fără VLAN-uri e un open-space: o persoană strigă și toți aud. VLAN-urile sunt pereții de gips-carton care transformă același etaj în birouri separate. Peretele nu are ușă: dacă cineva din biroul A vrea să vorbească cu biroul B, trebuie să treacă prin recepție (routerul sau switch-ul L3).</Analogy>

        <h3>Ce câștigi cu VLAN-uri</h3>
        <ul>
          <li><b>Domenii de broadcast mai mici</b> ⇒ mai puțin zgomot, performanță mai bună.</li>
          <li><b>Securitate și izolare</b>: HR, vizitatori, camere video, servere în rețele separate; traficul dintre ele trece printr-un punct în care poți aplica reguli (ACL, firewall).</li>
          <li><b>Flexibilitate</b>: apartenența depinde de configurare, nu de unde e tras cablul; o persoană mutată în alt departament schimbă doar VLAN-ul portului.</li>
          <li><b>Regula de aur:</b> <b>un VLAN = o subrețea IP</b> (de exemplu VLAN 10 = 192.168.10.0/24). Nu e obligatoriu tehnic, dar e standardul de proiectare pe care îl cere și examenul.</li>
        </ul>

        <h3>Intervale de VLAN-uri</h3>
        <Table head={['Interval', 'Nume', 'Ce știi despre el']} hlCol={0} rows={[
          ['0 și 4095', 'rezervate', 'Nu se pot folosi pentru trafic obișnuit.'],
          ['1', 'default VLAN', 'Există din fabrică; nu poate fi șters sau redenumit (vezi 2.1.b).'],
          ['2–1001', <><b>normal range</b> (de bază)</>, 'VLAN-uri „obișnuite”; se salvează în fișierul vlan.dat din flash.'],
          ['1002–1005', 'rezervate (legacy FDDI / Token Ring)', 'Există implicit și nu pot fi șterse; nu le folosești.'],
          ['1006–4094', <><b>extended range</b></>, 'În afara scopului „normal range” al obiectivului 2.1; pe multe platforme au restrângeri (de exemplu în modurile VTP clasice se creează doar în VTP transparent/off) și nu se salvează în vlan.dat. Verifică la platforma ta.'],
        ]} />
        <p>Obiectivul 2.1 spune explicit <b>normal range</b>: pe examen lucrezi cu VLAN-uri precum 10, 20, 30, 99. Un VLAN se identifică printr-un <b>VLAN ID</b> de 12 biți (1–4094 utilizabile), pe care îl vei vedea în antetul 802.1Q (topicul 2.2).</p>
        <Callout kind="warn" title="Fișierul vlan.dat">
          VLAN-urile din normal range sunt păstrate pe majoritatea switch-urilor Catalyst într-un fișier separat, <code>vlan.dat</code>, din memoria flash — <b>nu</b> în <code>startup-config</code>. Consecință practică: <code>write erase</code> / <code>erase startup-config</code> + <code>reload</code> șterge configurația, dar <b>VLAN-urile rămân</b>, până când ștergi și <code>flash:vlan.dat</code>. Verifică comportamentul pe platforma ta.
        </Callout>
        <DeepDive title="VTP — de ce nu îl vezi în obiectiv, dar trebuie să-l cunoști">
          <p><G id="vtp">VTP</G> (VLAN Trunking Protocol) este un protocol Cisco care propagă automat baza de date de VLAN-uri între switch-uri printr-un trunk. Modurile sunt <i>server</i>, <i>client</i>, <i>transparent</i> și <i>off</i>. Pericolul clasic: un switch cu <b>revision number</b> mai mare decât cel din domeniu își impune baza de date; un switch folosit și adăugat în rețea poate astfel șterge VLAN-urile întregii companii. De aceea, în laburi și multe rețele mici se lucrează cu <b>transparent</b> sau <b>off</b>, iar VLAN-urile se creează manual pe fiecare switch (așa lucrăm și noi). Listarea oficială a examenului nu cere configurarea VTP; ține minte doar ideea și riscul.</p>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>Un VLAN este un <b>domeniu de broadcast</b> și, de regulă, o <b>subrețea IP</b>; nu este „un switch virtual cu routing inclus”. Fără un dispozitiv L3, două VLAN-uri nu comunică.</>,
        <>Crearea unui VLAN nu mută niciun port în el: porturile rămân în VLAN 1 până când le atribui explicit.</>,
        <>Ștergerea unui VLAN (<code>no vlan 10</code>) <b>nu</b> mută porturile înapoi în VLAN 1: ele rămân atribuite VLAN-ului inexistent și devin <b>inactive</b>.</>,
        <>VLAN-urile 1002–1005 sunt rezervate și nu se șterg; la examen „normal range” = 1–1005 (cu 1 și 1002–1005 speciale), iar „extended” începe de la 1006.</>,
      ]} />
      <InlineQuiz ids={['2.1-001', '2.1-002', '2.1-003']} />
    </section>
  );
}

/* ======================================================================
   2.1.a — Access ports (data and voice)
   ====================================================================== */
export function AccessPorts() {
  return (
    <section id="access" className="section">
      <SectionHead id="access" code="2.1.a" title="Access ports (data and voice)" />
      <Summary>
        <p>Un port <b><G id="access-port">access</G></b> aparține <b>unui singur VLAN de date</b> și trimite/primește cadre <b>fără tag</b>: calculatorul din capătul cablului nu știe că există VLAN-uri. Dacă în spatele portului e un telefon IP cu PC-ul conectat prin el, portul poate purta și <b>un al doilea VLAN, de voce</b> (<G id="voice-vlan">voice VLAN</G>), așa încât vocea și datele să stea separate pe același cablu.</p>
      </Summary>

      <Detailed title="1. Crearea unui VLAN și atribuirea unui port">
        <p>Procesul are doi pași independenți: <b>(1)</b> VLAN-ul trebuie să existe în baza de date a switch-ului; <b>(2)</b> portul trebuie să fie în modul access și să fie atribuit acelui VLAN.</p>
        <Table head={['Pas', 'Comandă', 'Ce face']} hlCol={1} rows={[
          ['1', <code>vlan 10</code>, 'Creează VLAN 10 (sau intră în configurarea lui) și intră în modul config-vlan.'],
          ['1b', <code>name USERS</code>, 'Dă un nume descriptiv; opțional, dar important pentru ordine.'],
          ['2', <code>interface fa0/1</code>, 'Intră pe portul fizic (sau <code>interface range fa0/1-4</code> pentru mai multe).'],
          ['2b', <code>switchport mode access</code>, 'Forțează portul să fie access (nu negociază trunk). Bună practică pentru porturile spre utilizatori.'],
          ['2c', <code>switchport access vlan 10</code>, 'Atribuie portul VLAN-ului 10.'],
        ]} />
        <p>Verificarea de bază: <code>show vlan brief</code> listează VLAN-urile și porturile <b>access</b> ale fiecăruia. <b>Porturile trunk nu apar</b> în această listă (ele nu „aparțin” unui singur VLAN).</p>
        <Callout kind="exam" title="Ce NU apare în show vlan brief">
          Un port trunk nu apare sub niciun VLAN în <code>show vlan brief</code>. Pentru trunk-uri folosești <code>show interfaces trunk</code> (topicul 2.2). Dacă o întrebare cere „în ce VLAN e portul X” și portul e trunk, răspunsul nu e în <code>show vlan brief</code>.
        </Callout>

        <h3>2. Ce se întâmplă cu un cadru pe un port access</h3>
        <ol>
          <li>Calculatorul trimite un cadru Ethernet obișnuit, <b>fără</b> tag 802.1Q.</li>
          <li>Switch-ul îl primește pe Fa0/1 și „își aduce aminte” că Fa0/1 e în VLAN 10: cadrul este tratat ca aparținând VLAN-ului 10 (învață MAC-ul în tabela VLAN-ului 10, caută destinația doar în VLAN 10).</li>
          <li>Dacă cadrul pleacă pe un alt port access din VLAN 10, iese tot <b>fără tag</b>. Dacă pleacă pe un trunk, i se adaugă tag-ul 802.1Q cu VID 10 (vezi 2.2).</li>
        </ol>
        <p>Același mecanism spune de ce un broadcast din VLAN 10 nu ajunge în VLAN 20: switch-ul îl inundă (<i>flooding</i>) doar pe porturile VLAN-ului 10.</p>

        <h3>3. Verificare: patru comenzi de bază</h3>
        <Table head={['Comandă', 'Ce arată', 'Când o folosești']} hlCol={0} rows={[
          [<code>show vlan brief</code>, 'VLAN ID, nume, stare (active), porturile access ale fiecărui VLAN', 'Prima verificare: există VLAN-ul și e portul în el?'],
          [<code>show vlan id 10</code>, 'Detalii pentru un singur VLAN', 'Când lista e lungă.'],
          [<code>show interfaces fa0/1 switchport</code>, 'Administrative/Operational Mode, Access Mode VLAN, Voice VLAN, Native VLAN', 'Când vrei adevărul despre un port (de exemplu a negociat un trunk?).'],
          [<code>show running-config interface fa0/1</code>, 'Configurația exactă a portului', 'Confirmă ce ai tastat.'],
        ]} />
      </Detailed>

      <Detailed title="4. Voice VLAN — un cablu, două VLAN-uri">
        <p>Birourile moderne au câte un <b>telefon IP</b> pe birou și un PC conectat în telefon (telefonul are un mini-switch cu trei porturi: spre switch-ul de acces, spre PC, spre procesorul telefonului). Cablul de perete fiind unul singur, vocea și datele trebuie să circule împreună, dar <b>separat</b>: vocea e sensibilă la întârziere și variații de întârziere, deci vrei să o marchezi cu prioritate (QoS) și să o ții în altă rețea decât datele.</p>
        <Figure caption="Portul Fa0/3 este access în VLAN 10 (date) și are un voice VLAN 20. Pe segmentul switch–telefon circulă două VLAN-uri: vocea cu tag, datele fără.">
          <VoicePort />
        </Figure>
        <p>Comanda: <code>switchport voice vlan 20</code> sub portul deja configurat ca access. Cum află telefonul numărul 20? Switch-ul îl anunță prin <G id="cdp">CDP</G> (sau <G id="lldp-med">LLDP-MED</G>); telefonul își configurează singur etichetarea. Rezultat:</p>
        <ul>
          <li>Traficul de <b>voce</b> al telefonului pleacă <b>cu tag 802.1Q</b>, VID 20, și cu prioritate (<G id="pcp">CoS</G> 5 este valoarea clasică pentru voce).</li>
          <li>Traficul <b>PC-ului</b> trece prin telefon <b>fără tag</b> și intră în VLAN-ul de date al portului (aici 10).</li>
          <li>Portul rămâne, ca mod administrativ, <b>access</b>; „access cu voice VLAN” este o excepție controlată (în practică funcționează ca un mini-trunk pentru doi VLAN-uri). În <code>show interfaces switchport</code> vezi ambele: <i>Access Mode VLAN: 10</i> și <i>Voice VLAN: 20</i>.</li>
        </ul>
        <Callout kind="tip" title="Telefonul se alimentează și el din port">
          Telefoanele IP sunt adesea alimentate prin <G id="poe">PoE</G> chiar de la switch (topicul 1.1.h). Același port oferă deci: curent, VLAN de voce, VLAN de date. Dacă telefonul nu pornește sau nu primește VLAN-ul, verifică în ordine: PoE, CDP/LLDP activ pe port (2.3), <code>switchport voice vlan</code>.
        </Callout>
        <DeepDive title="Ce se întâmplă dacă nu configurezi voice VLAN?">
          <p>Telefonul va trimite și vocea tot în VLAN-ul de date (fără tag): vocea și datele sunt în aceeași rețea, fără izolare și fără ușurința de a aplica QoS selectiv. Funcționează, dar nu e proiectarea recomandată. Invers, dacă ai pus <code>voice vlan</code> dar VLAN-ul 20 nu a fost creat pe switch, telefonul poate să nu primească o configurație utilizabilă — în laburi, <b>creează întâi VLAN-urile</b>, apoi atribuie porturile. Alte comenzi QoS din port (de exemplu de încredere pentru marcajele telefonului) sunt peste scopul acestui obiectiv.</p>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>Atribuirea unui port unui VLAN <b>inexistent</b>: în funcție de platformă/versiune, switch-ul fie creează VLAN-ul automat, fie lasă portul <b>inactive</b>. Nu te baza pe auto-creare: creează VLAN-ul explicit.</>,
        <>Un port access are <b>un singur VLAN de date</b>; „voice VLAN” este un al doilea VLAN <b>doar pentru voce</b>, nu un al doilea VLAN de date.</>,
        <>Dacă uiți <code>switchport mode access</code>, portul poate rămâne în <i>dynamic auto</i> (negociază DTP) și poate deveni trunk dacă în față apare un echipament care cere trunk. Pe porturile spre utilizatori setezi explicit <b>access</b>.</>,
        <>PC-ul nu primește niciodată VLAN ID; el nu „știe” în ce VLAN e. Adresarea IP trebuie să fie în subrețeaua VLAN-ului în care este portul.</>,
        <>Comanda <code>show vlan brief</code> nu listează porturile trunk. Un VLAN poate fi „active” și totuși fără niciun port access.</>,
      ]} />
      <InlineQuiz ids={['2.1-007', '2.1-009', '2.1-012', '2.1-014']} />
    </section>
  );
}

/* ======================================================================
   2.1.b — Default VLAN
   ====================================================================== */
export function DefaultVlan() {
  return (
    <section id="default" className="section">
      <SectionHead id="default" code="2.1.b" title="Default VLAN" />
      <Summary>
        <p><b>VLAN 1</b> este <G id="default-vlan">default VLAN</G>-ul: există din fabrică, toate porturile sunt în el, nu poate fi șters sau redenumit. Switch-urile folosesc VLAN 1 și ca <b>VLAN nativ</b> implicit al trunk-urilor (2.2) și pentru trafic de control. Bună practică: <b>nu pune utilizatori în VLAN 1</b>; mută-i în VLAN-uri dedicate și parchează porturile nefolosite într-un VLAN „gol”, oprite.</p>
      </Summary>

      <Detailed title="1. Ce este și de ce există">
        <p>Dacă un switch ar porni „fără niciun VLAN”, nu ar comuta nimic. Soluția: există un VLAN predefinit, <b>VLAN 1</b> (nume implicit <i>default</i>), în care <b>toate porturile</b> sunt atribuite din fabrică. De aceea un switch nou conectat „merge din prima”: toate stațiile sunt în aceeași rețea logică. Este comoditate pentru începători, dar un punct slab pentru rețele serioase.</p>
        <Figure caption="Stare din fabrică versus switch „întărit” (hardening): VLAN-uri dedicate pentru utilizatori și un VLAN de parcare pentru porturile nefolosite.">
          <DefaultVlanPorts />
        </Figure>
        <Table head={['Proprietate', 'VLAN 1']} hlCol={0} rows={[
          ['ID / nume', '1 / default'],
          ['Poate fi șters?', <b>Nu</b>],
          ['Poate fi redenumit?', <b>Nu</b>],
          ['Porturile la pornire', 'Toate porturile access (și trunk-urile îl poartă implicit)'],
          ['VLAN nativ implicit al trunk-urilor', 'Da (se poate schimba, vezi 2.2.c)'],
          ['Trafic de control', 'Protocoale precum CDP, DTP sau VTP trimit implicit cadrele de control pe VLAN 1 (pe trunk, ca VLAN nativ); detaliile la 2.2'],
        ]} />
        <Callout kind="warn" title="Precizie importantă">
          „VLAN 1 nu poate fi șters” nu înseamnă „VLAN 1 nu poate fi evitat”. Poți (și e recomandat) să nu mai ai porturi de utilizatori în el, să nu-l folosești pentru management și să schimbi VLAN-ul nativ. Detalii despre trafic de control pe trunk (VLAN 1 și tag-uri) rămân pentru 2.2.
        </Callout>

        <h3>2. De ce se spune „nu folosi VLAN 1 pentru utilizatori”</h3>
        <ul>
          <li><b>Domeniu de broadcast mare:</b> orice port uitat în VLAN 1 se adaugă la același domeniu de broadcast ca restul.</li>
          <li><b>Management în aceeași rețea cu utilizatorii:</b> dacă SVI-ul de management al switch-ului este în VLAN 1, oricine ajunge pe un port nefolosit este în rețeaua de administrare.</li>
          <li><b>Trafic de control și VLAN nativ:</b> deoarece VLAN 1 este implicit „nativ” (fără tag) pe trunk-uri, un VLAN 1 aglomerat de utilizatori amestecă datele cu controlul și amplifică riscuri precum VLAN hopping (2.2).</li>
          <li><b>Porturi neutilizate:</b> un port liber în VLAN 1 și „up” e o ușă deschisă spre rețea.</li>
        </ul>

        <h3>3. Hardening-ul tipic al VLAN-urilor</h3>
        <ol>
          <li>Creează VLAN-uri pentru utilizatori (10, 20…), voce (40), management (99).</li>
          <li>Mută porturile utilizatorilor în VLAN-urile lor.</li>
          <li>Creează un VLAN „parcare/blackhole” (de exemplu 999), fără SVI și fără trunk, și pune în el <b>toate porturile nefolosite</b>.</li>
          <li>Pune porturile nefolosite în <code>shutdown</code>.</li>
          <li>Mută managementul (SVI) într-un VLAN dedicat, de exemplu 99 (nu 1).</li>
        </ol>
        <p>Pentru o gamă de porturi: <code>interface range fa0/9-24</code> → <code>switchport mode access</code> → <code>switchport access vlan 999</code> → <code>shutdown</code>.</p>
        <Analogy>Un switch din fabrică e o clădire în care toate camerele sunt deschise pe același hol. VLAN 1 e holul. Hardening-ul înseamnă să muți fiecare oaspete în camera lui și să încui camerele goale (VLAN-ul de parcare + shutdown).</Analogy>
        <DeepDive title="SVI-ul VLAN 1 și întrebarea „de ce interface vlan 1 e down?”">
          <p>Un switch L2 are, de regulă, un singur <G id="svi">SVI</G> cu adresă IP, folosit pentru management. Pe un switch nou, <code>interface vlan 1</code> poate fi în <b>shutdown administrativ</b> sau <b>down/down</b> dacă niciun port din VLAN 1 nu e activ (vezi autostate în 2.1.c). După ce muți managementul în VLAN 99 îți creezi <code>interface vlan 99</code> cu IP și <code>default-gateway</code> (global) ca să poți administra switch-ul de la distanță.</p>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>VLAN 1 <b>nu poate fi șters și nu poate fi redenumit</b>; de asemenea nici VLAN-urile 1002–1005.</>,
        <>„Toate porturile sunt în VLAN 1” se aplică <b>porturilor access din fabrică</b>. Un port care devine trunk nu mai e „în” VLAN 1; poartă VLAN 1 doar ca VLAN nativ/permis.</>,
        <>VLAN-ul de management ≠ VLAN-ul nativ ≠ VLAN 1: sunt trei concepte care pot (dar nu trebuie) să coincidă. Pe examen ele sunt verificate separat.</>,
        <>Porturile neutilizate se pun în <b>shutdown</b> <i>și</i> într-un VLAN neutilizat; doar unul dintre pași nu e suficient.</>,
      ]} />
      <InlineQuiz ids={['2.1-016', '2.1-018', '2.1-021']} />
    </section>
  );
}

/* ======================================================================
   2.1.c — InterVLAN connectivity
   ====================================================================== */
export function InterVlan() {
  return (
    <section id="intervlan" className="section">
      <SectionHead id="intervlan" code="2.1.c" title="InterVLAN connectivity" />
      <Summary>
        <p>Stațiile din VLAN-uri diferite trebuie să treacă printr-un dispozitiv de <b>nivel 3</b>, pentru că fiecare VLAN e o subrețea diferită. Cele trei metode sunt: <b>un port de router per VLAN</b> (învechit), <b><G id="router-on-a-stick">router-on-a-stick</G></b> (un trunk spre router, cu <G id="subinterface">subinterfețe</G> 802.1Q) și <b>switch L3 cu <G id="svi">SVI</G></b> (<code>ip routing</code> + <code>interface vlan N</code>). Gateway-ul fiecărei stații este adresa IP a routerului/SVI-ului din VLAN-ul ei.</p>
      </Summary>

      <Detailed title="1. De ce nu comunică VLAN-urile între ele">
        <p>Dacă PC1 (192.168.10.11, VLAN 10) vrea să trimită ceva către PC2 (192.168.20.11, VLAN 20), procesul este cel obișnuit între subrețele diferite: PC1 vede că destinația nu e în subrețeaua lui, deci trimite pachetul către <b>default gateway</b> (<G id="default-gateway" />). Switch-ul nu poate muta cadrul din VLAN 10 în VLAN 20 (ar încălca izolarea); doar un dispozitiv care <b>rutează</b> poate.</p>
        <Figure caption="Interactiv: cele trei metode de inter-VLAN routing. Observă câte cabluri/porturi folosește fiecare.">
          <InterVlanMethods />
        </Figure>
        <Table head={['Metodă', 'Cabluri spre router/switch L3', 'Scalare', 'Folosire azi']} hlCol={0} rows={[
          ['Un port per VLAN', 'Un cablu per VLAN', 'Foarte slabă', 'Învechit; doar istoric / laburi'],
          [<b>Router-on-a-stick</b>, 'Un singur trunk', 'Medie (banda trunk-ului e partajată)', 'Filiale mici, laburi, examen'],
          [<b>Switch L3 + SVI</b>, 'Niciun cablu extern', 'Excelentă (rutare în hardware)', 'Standard în campus'],
        ]} />
      </Detailed>

      <Detailed title="2. Router-on-a-stick (ROAS)">
        <p>Routerul are <b>o singură interfață fizică</b> legată de switch printr-un <b>trunk</b>. Pe interfața fizică creezi câte o <b>subinterfață</b> pentru fiecare VLAN, cu <code>encapsulation dot1Q &lt;vlan&gt;</code> și o adresă IP din subrețeaua acelui VLAN (acea adresă este gateway-ul VLAN-ului).</p>
        <Table head={['Element', 'Regulă']} hlCol={0} rows={[
          ['Interfața fizică', <>Fără adresă IP; doar <code>no shutdown</code> (dacă nu e activă, subinterfețele sunt jos).</>],
          ['Subinterfața', <>Nume <code>Gi0/0.10</code>; numărul după punct e doar o etichetă, dar convenția e să fie egal cu VLAN-ul.</>],
          ['encapsulation dot1Q N', <>Spune ce VLAN ID (tag 802.1Q) are traficul asociat subinterfeței. <b>Se dă înainte de adresa IP</b>, altfel IOS cere întâi encapsulation.</>],
          ['Port-ul switch-ului spre router', <>Trebuie să fie <b>trunk</b> și să permită VLAN-urile respective (2.2).</>],
          ['VLAN nativ pe router', <>Dacă trunk-ul are VLAN nativ ≠ 1, folosești <code>encapsulation dot1Q 99 native</code> pe o subinterfață (2.2.c).</>],
        ]} />
        <p><b>Cum circulă un pachet PC1 → PC2:</b> (1) PC1 trimite cadrul către MAC-ul gateway-ului; (2) switch-ul îl pune pe trunk cu tag VID 10 către router; (3) routerul îl primește pe subinterfața <code>Gi0/0.10</code>, scoate tag-ul, decide pe baza tabelei de rutare (rețeaua 192.168.20.0/24 e conectată direct pe <code>Gi0/0.20</code>); (4) îl trimite înapoi pe același cablu cu tag VID 20; (5) switch-ul îl livrează către PC2 fără tag. Cadrul traversează de <b>două ori</b> același cablu, de aici „on a stick” și limita de bandă.</p>
        <h3>Verificare (ROAS)</h3>
        <Table head={['Comandă', 'Ce urmărești']} hlCol={0} rows={[
          [<code>show ip interface brief</code>, 'Subinterfețele sunt up/up și au adresele așteptate.'],
          [<code>show ip route</code>, 'Pentru fiecare VLAN există o rută „C” (connected) și „L” (local) pe subinterfața respectivă.'],
          [<><code>show interfaces trunk</code> (pe switch)</>, 'Portul spre router e trunk și permite VLAN-urile 10, 20.'],
          [<code>show running-config interface Gi0/0.10</code>, 'Verifică encapsulation și IP.'],
          [<><code>ping</code> de la un PC către gateway și apoi către celălalt VLAN</>, 'Primul ping poate pierde un pachet din cauza ARP — normal.'],
        ]} />
      </Detailed>

      <Detailed title="3. Switch de nivel 3 și SVI">
        <p>Un switch multilayer (<G id="l3-switch">L3 switch</G>) poate ruta între VLAN-uri <b>în hardware</b>. Pentru fiecare VLAN creezi o interfață virtuală, un <b><G id="svi">SVI</G></b> (<i>Switched Virtual Interface</i>): <code>interface vlan 10</code> + <code>ip address 192.168.10.1 255.255.255.0</code>. Acea adresă este gateway-ul VLAN-ului. Trebuie să activezi și funcția de rutare: <code>ip routing</code> (global).</p>
        <Callout kind="info" title="Autostate: când este SVI-ul up/up?">
          Un SVI este up/up numai dacă <b>(1)</b> VLAN-ul există în baza de date și este activ, <b>(2)</b> există cel puțin un port din acel VLAN (access sau trunk care îl permite) în starea up (<G id="autostate" />), și <b>(3)</b> SVI-ul nu e în shutdown. Dacă ceri <code>interface vlan 30</code> fără să fi creat VLAN-ul 30 sau fără niciun port activ în el, interfața rămâne <i>down</i>.
        </Callout>
        <ul>
          <li><b>Port „routed”:</b> pe un switch L3, <code>no switchport</code> transformă un port în <b>port L3</b> (ca pe un router): îi pui direct o adresă IP. Util pentru legături spre alte routere/switch-uri L3.</li>
          <li><b>De ce e mai bun decât ROAS:</b> nu există „stick”, nu se împarte banda unui singur cablu și rutarea se face la viteza switch-ului.</li>
          <li><b>Niciun trunk spre router</b> e necesar între VLAN-uri de pe același switch L3; trunk-urile apar doar spre alte switch-uri de acces (2.2).</li>
        </ul>
        <Table head={['', 'Router-on-a-stick', 'SVI pe switch L3']} hlCol={0} rows={[
          ['Dispozitivul L3', 'Router', 'Switch multilayer'],
          ['Cum se leagă VLAN-ul', 'Subinterfață cu encapsulation dot1Q', 'Interfață virtuală interface vlan N'],
          ['Activare rutare', 'Implicită pe router (IPv4)', <><code>ip routing</code> (global) pe switch</>],
          ['Gateway pentru hosturi', 'IP-ul subinterfeței', 'IP-ul SVI-ului'],
          ['Limită', 'Banda unui singur cablu; CPU router', 'Capacitatea ASIC-ului (mare)'],
        ]} />
        <DeepDive title="Depanare inter-VLAN: ghid rapid de întrebări">
          <ol>
            <li>Hostul are IP în subrețeaua corectă a VLAN-ului lui? Gateway-ul e adresa routerului/SVI-ului din același VLAN?</li>
            <li>Portul hostului este în VLAN-ul corect (<code>show vlan brief</code>)? VLAN-ul există?</li>
            <li>Dacă VLAN-ul trece prin trunk: este permis pe trunk la ambele capete (<code>show interfaces trunk</code>)? Native VLAN-ul se potrivește?</li>
            <li>ROAS: interfața fizică e <i>no shutdown</i>? Subinterfața are <code>encapsulation dot1Q</code> cu VLAN ID-ul corect? Portul switch-ului spre router e trunk?</li>
            <li>SVI: <code>ip routing</code> activ? SVI-ul e up/up (autostate)? </li>
            <li>Verifică rutarea: <code>show ip route</code> are rețelele conectate?</li>
          </ol>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>Fără <code>ip routing</code> un switch L3 nu rutează între SVI-uri, deși SVI-urile sunt up/up și au IP.</>,
        <>Pe ROAS interfața fizică <b>nu primește adresă IP</b>; adresele stau pe subinterfețe. Uitând <code>no shutdown</code> pe interfața fizică, toate subinterfețele rămân jos.</>,
        <>Gateway-ul unui host trebuie să fie în <b>același VLAN/subrețea</b> cu el; un gateway dintr-un alt VLAN nu poate fi ajuns la nivel 2.</>,
        <>Un SVI nu e up dacă VLAN-ul nu are niciun port activ. Un VLAN șters ⇒ SVI jos.</>,
        <>ROAS: un trunk care <b>nu permite</b> VLAN-ul respectiv (allowed list) taie traficul fără mesaj de eroare evident.</>,
      ]} />
      <InlineQuiz ids={['2.1-025', '2.1-027', '2.1-030', '2.1-033']} />
    </section>
  );
}
