import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DiscoveryTimers, LldpFrame, NeighborScope } from '../../diagrams/t2_3';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.3" title="Protocoale de descoperire de nivel 2 — imaginea de ansamblu" />
      <Summary>
        <p>Un <b><G id="l2-discovery">protocol de descoperire L2</G></b> permite fiecărui echipament să-și anunțe vecinii <b>direct conectați</b> (nume, model, port, capabilități, adresă de management) și să afle aceleași informații despre ei. Sunt două: <b><G id="cdp">CDP</G></b> (Cisco, <b>activ implicit</b> pe echipamentele Cisco) și <b><G id="lldp">LLDP</G></b> (standard IEEE 802.1AB, <b>dezactivat implicit</b> pe IOS: <code>lldp run</code>). Se verifică cu <code>show cdp neighbors [detail]</code> și <code>show lldp neighbors [detail]</code>.</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial 2.3 este <i>Configure and verify Layer 2 discovery protocols (Cisco Discovery Protocol and LLDP)</i>. Nu are sub-puncte oficiale, așa că predăm: CDP, LLDP, apoi comparația și securitatea lor, urmate de configurare și verificare.</p>
        <Table head={['Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['CDP', 'Cum află un echipament Cisco ce este în capătul cablului și cum configurez/verific protocolul?'],
          ['LLDP', 'Cum fac același lucru în mod standard, între echipamente de la producători diferiți?'],
          ['CDP vs LLDP', 'Când folosesc unul, când celălalt, și ce risc de securitate apare?'],
        ]} />

        <h3>Problema: „ce este la celălalt capăt al cablului?”</h3>
        <p>Într-o rețea reală, documentația se învechește repede: cineva mută un cablu, înlocuiește un switch, adaugă un telefon. Când ceva nu merge, prima întrebare este „<b>cu cine vorbește acest port?</b>”. Fără un protocol de descoperire ar trebui să urmărești fizic cablul sau să ghicești după tabela MAC.</p>
        <p>Protocoalele de descoperire rezolvă problema: fiecare echipament trimite periodic, pe <b>fiecare port</b>, un cadru mic cu propria identitate. Vecinul îl primește și îl memorează într-o <b>tabelă de vecini</b> (<i>neighbor table</i>). Din ea vezi pe loc ce echipament e conectat la fiecare port, ce model e, pe ce port al lui, și adesea și adresa IP de management.</p>
        <Figure caption="Interactiv: click pe un dispozitiv ca să vezi tabela lui de vecini. Observă că vezi doar vecinii DIRECȚI: R1 nu-l vede pe SW2, iar SW2 nu-l vede pe R1.">
          <NeighborScope />
        </Figure>
        <Analogy>Imaginează-ți vecinii de palier într-un bloc: fiecare își lasă o carte de vizită sub ușa celor de pe același palier, nu a întregului bloc. Dacă vrei să știi cine locuiește la etajul 3, nu-i vezi de la etajul 1; mergi de la o ușă la alta („CDP walking”: te conectezi la vecin, apoi te uiți în tabela lui).</Analogy>

        <h3>Ce au în comun</h3>
        <ul>
          <li><b>Nivel 2:</b> funcționează între echipamente direct conectate, <b>fără adrese IP</b> și fără rutare. Un cadru de descoperire nu este retransmis mai departe de switch-uri (este adresat unui multicast „link-local”).</li>
          <li><b>Periodic:</b> anunțurile se repetă la un interval (timer) și au un <b>hold time</b>: dacă un vecin nu mai anunță un timp, intrarea lui se șterge.</li>
          <li><b>Informativ:</b> protocoalele nu configurează nimic; doar raportează. De aceea sunt utile pentru depanare, documentare și instrumente de monitorizare.</li>
          <li><b>Pe port:</b> se pot activa sau opri global și pe fiecare interfață.</li>
        </ul>
        <Callout kind="info" title="De ce apar și în alte topicuri">
          Telefoanele IP își află VLAN-ul de voce (2.1.a) prin CDP sau LLDP-MED; negocierea PoE (1.1.h) poate folosi aceleași canale; mesajul <code>%CDP-4-NATIVE_VLAN_MISMATCH</code> din 2.2.c vine tot de la CDP. Deci descoperirea de vecini este „lipiciul” de diagnostic dintre mai multe teme.
        </Callout>
      </Detailed>

      <Traps items={[
        <>Protocoalele de descoperire arată <b>numai vecinii direcți</b>. Nu vezi un switch aflat la două salturi.</>,
        <>Funcționează la <b>nivelul 2</b>: pot raporta un vecin chiar dacă adresele IP nu se potrivesc sau nu există.</>,
        <>CDP e <b>activ implicit</b> pe Cisco; LLDP e <b>dezactivat implicit</b> pe IOS. Pe examen, asta e o întrebare clasică.</>,
      ]} />
      <InlineQuiz ids={['2.3-001', '2.3-003', '2.3-005']} />
    </section>
  );
}

/* ======================================================================
   CDP
   ====================================================================== */
export function Cdp() {
  return (
    <section id="cdp" className="section">
      <SectionHead id="cdp" code="2.3" title="Cisco Discovery Protocol (CDP)" />
      <Summary>
        <p><G id="cdp">CDP</G> este protocolul <b>proprietar Cisco</b> de descoperire a vecinilor. Este <b>activat implicit</b> (global și pe toate interfețele) pe routere și switch-uri Cisco; anunță la fiecare <b>60 s</b>, cu <b>holdtime 180 s</b>. Comenzi esențiale: <code>show cdp neighbors</code>, <code>show cdp neighbors detail</code> (arată IP-ul și versiunea IOS a vecinului), <code>cdp run</code> / <code>no cdp run</code> (global) și <code>cdp enable</code> / <code>no cdp enable</code> (pe interfață).</p>
      </Summary>

      <Detailed title="1. Ce anunță CDP și cum">
        <p>Fiecare 60 de secunde, echipamentul trimite pe fiecare port activ un cadru CDP către o adresă multicast de nivel 2 rezervată (<code>0100.0ccc.cccc</code>), încapsulat cu SNAP. Switch-urile Cisco nu retransmit aceste cadre mai departe: fiecare echipament le „consumă”. Vecinul memorează informațiile și le păstrează <b>holdtime</b> secunde (180 s implicit). Dacă nu mai primește anunțuri, ștergerea intrării se face după holdtime.</p>
        <Figure caption="Cronologie: anunțuri la fiecare timer; după ce vecinul dispare, intrarea rămâne până la expirarea hold time. Comută între CDP și LLDP pentru a compara valorile implicite.">
          <DiscoveryTimers />
        </Figure>
        <Table head={['Informație din anunțul CDP', 'La ce folosește']} hlCol={0} rows={[
          ['Device ID (hostname)', 'Numele vecinului.'],
          ['Port ID (portul vecinului) + Local Interface (portul tău)', 'Capetele cablului: aceasta e informația de bază pentru documentare.'],
          ['Capabilities', 'Ce este: Router, Switch, Host, Phone, IGMP etc.'],
          ['Platform', 'Modelul hardware (de exemplu WS-C2960).'],
          ['Adresa IP de management (în detail)', 'Prin ea poți ajunge la vecin (SSH).'],
          ['Versiunea software (în detail)', 'Verifici inventarul și compatibilitatea.'],
          ['Native VLAN, duplex (în detail)', 'Permit detectarea nepotrivirilor: %CDP-4-NATIVE_VLAN_MISMATCH, %CDP-4-DUPLEX_MISMATCH.'],
          ['Cerere de putere / VLAN de voce', 'Telefoanele IP cer prin CDP puterea PoE și află VLAN-ul de voce.'],
        ]} />

        <h3>2. Configurare</h3>
        <Table head={['Comandă', 'Efect']} hlCol={0} rows={[
          [<code>cdp run</code>, 'Activează CDP global (este deja implicit).'],
          [<code>no cdp run</code>, 'Dezactivează CDP pe tot echipamentul.'],
          [<><code>cdp enable</code> · <code>no cdp enable</code></>, 'Pe interfață: activează / dezactivează CDP pe acel port.'],
          [<code>cdp timer 30</code>, 'Schimbă intervalul de anunț (implicit 60 s).'],
          [<code>cdp holdtime 120</code>, 'Schimbă holdtime (implicit 180 s).'],
        ]} />
        <h3>3. Verificare și citirea output-ului</h3>
        <Table head={['Comandă', 'Ce arată']} hlCol={0} rows={[
          [<code>show cdp</code>, 'Starea globală și timerele (sending interval, holdtime).'],
          [<code>show cdp neighbors</code>, 'Tabelă scurtă: Device ID, Local Intrfce, Holdtme, Capability, Platform, Port ID.'],
          [<code>show cdp neighbors detail</code>, 'Tot ce a anunțat vecinul: IP, versiune IOS, native VLAN, duplex… (cea mai utilă comandă).'],
          [<code>show cdp entry R1</code>, 'Detaliile unui singur vecin.'],
          [<code>show cdp interface</code>, 'Pe ce interfețe e activ CDP și cu ce timere.'],
          [<code>show cdp traffic</code>, 'Contoare: pachete trimise/primite, erori.'],
        ]} />
        <Callout kind="exam" title="Cum citești „Local Intrfce” și „Port ID”">
          <b>Local Intrfce</b> = portul de pe echipamentul pe care rulezi comanda. <b>Port ID</b> = portul de pe <b>vecin</b>. Inversarea lor este greșeala cea mai frecventă la examen. <b>Holdtme</b> scade de la 180 spre 0; dacă vecinul trimite un anunț nou, revine la 180 (resetat în jurul valorii inițiale).
        </Callout>
        <p>Coloana <i>Capability</i> folosește coduri: <b>R</b> Router, <b>T</b> Trans Bridge, <b>B</b> Source Route Bridge, <b>S</b> Switch, <b>H</b> Host, <b>I</b> IGMP, <b>r</b> Repeater, <b>P</b> Phone, <b>D</b> Remote, <b>C</b> CVTA, <b>M</b> Two-port Mac Relay. Lista este tipărită chiar la începutul output-ului.</p>

        <h3>4. Utilizări practice</h3>
        <ul>
          <li><b>Documentare/depanare:</b> „pe ce port al switch-ului sus este conectat acest switch?”</li>
          <li><b>CDP walking:</b> de la un echipament citești IP-ul vecinului din <code>detail</code>, te conectezi la el prin SSH, repeți. Așa descoperi o rețea fără hartă.</li>
          <li><b>Detectarea nepotrivirilor:</b> native VLAN diferit, duplex diferit — CDP loghează mesaje avertizare.</li>
          <li><b>Telefoane IP:</b> VLAN de voce și putere (2.1.a, 1.1.h).</li>
        </ul>
      </Detailed>

      <Traps items={[
        <>Valori implicite CDP: <b>60 s</b> timer, <b>180 s</b> holdtime. LLDP: 30 s și 120 s.</>,
        <><code>show cdp neighbors</code> <b>nu</b> arată adresa IP a vecinului; pentru ea folosești <code>show cdp neighbors detail</code> (sau <code>show cdp entry</code>).</>,
        <><b>Local Intrfce</b> = portul tău, <b>Port ID</b> = portul vecinului.</>,
        <><code>no cdp run</code> oprește CDP global; <code>no cdp enable</code> doar pe o interfață.</>,
        <>CDP funcționează între echipamente care îl suportă; un echipament non-Cisco fără CDP nu apare în tabelă (dar poate apărea prin LLDP).</>,
      ]} />
      <InlineQuiz ids={['2.3-007', '2.3-010', '2.3-013']} />
    </section>
  );
}

/* ======================================================================
   LLDP
   ====================================================================== */
export function Lldp() {
  return (
    <section id="lldp" className="section">
      <SectionHead id="lldp" code="2.3" title="Link Layer Discovery Protocol (LLDP)" />
      <Summary>
        <p><G id="lldp">LLDP</G> este varianta <b>standard IEEE 802.1AB</b> a descoperirii de vecini, folosită între echipamente de la producători diferiți. Pe IOS este <b>dezactivat implicit</b>: îl pornești cu <code>lldp run</code> (global). Pe interfață poți controla separat <code>lldp transmit</code> și <code>lldp receive</code>. Valori uzuale: anunț la <b>30 s</b>, hold <b>120 s</b>. Verificare: <code>show lldp neighbors</code> și <code>show lldp neighbors detail</code>.</p>
      </Summary>

      <Detailed title="1. De ce există LLDP">
        <p>CDP funcționează doar cu echipamente Cisco. Într-o rețea cu switch-uri HP, telefoane Poly, servere cu NIC-uri Intel, CDP nu ajută. IEEE a definit atunci un protocol deschis: <b>LLDP</b> (<i>802.1AB</i>). Majoritatea producătorilor îl implementează, deci este alegerea firească în rețele mixte. LLDP-MED este o extensie pentru telefoane și alte echipamente media (VLAN de voce, QoS, putere PoE).</p>

        <h3>2. Cadrul LLDP: o listă de TLV-uri</h3>
        <p>Cadrul LLDP are EtherType <b>0x88CC</b> și adresa de destinație multicast <b>01-80-C2-00-00-0E</b> (link-local: switch-urile nu o retransmit). Conținutul este o succesiune de <b><G id="tlv">TLV</G></b>-uri (<i>Type-Length-Value</i>). Trei TLV-uri sunt obligatorii la început (Chassis ID, Port ID, TTL) și unul la sfârșit (End of LLDPDU); între ele vin cele opționale.</p>
        <Figure caption="Click pe un TLV pentru descriere. Galben = obligatoriu, albastru = opțional.">
          <LldpFrame />
        </Figure>
        <Callout kind="info" title="TTL = hold time">
          Câmpul TTL din LLDP spune receptorului cât timp să păstreze informația. Pe IOS el rezultă din <code>lldp holdtime</code> (implicit 120 s). Un echipament care se oprește poate trimite un anunț cu TTL 0 ca să fie șters imediat din tabela vecinilor.
        </Callout>

        <h3>3. Configurare</h3>
        <Table head={['Comandă', 'Efect']} hlCol={0} rows={[
          [<code>lldp run</code>, 'Pornește LLDP global (implicit oprit pe IOS).'],
          [<code>no lldp run</code>, 'Oprește LLDP pe tot echipamentul.'],
          [<><code>lldp transmit</code> · <code>no lldp transmit</code></>, 'Pe interfață: trimite / nu trimite anunțuri.'],
          [<><code>lldp receive</code> · <code>no lldp receive</code></>, 'Pe interfață: ascultă / ignoră anunțurile primite.'],
          [<code>lldp timer 30</code>, 'Intervalul de anunț (în secunde).'],
          [<code>lldp holdtime 120</code>, 'Hold time anunțat vecinilor.'],
        ]} />
        <p>Spre deosebire de CDP, LLDP permite să controlezi <b>direcția</b> pe fiecare port: poți doar asculta (receive) fără să anunți, sau invers.</p>

        <h3>4. Verificare</h3>
        <Table head={['Comandă', 'Ce arată']} hlCol={0} rows={[
          [<code>show lldp</code>, 'Starea globală și timerele (dacă este pornit).'],
          [<code>show lldp neighbors</code>, 'Device ID, Local Intf, Hold-time, Capability, Port ID.'],
          [<code>show lldp neighbors detail</code>, 'TLV-urile primite: chassis ID, port ID, descriere sistem, capabilități, IP de management, VLAN-uri…'],
          [<code>show lldp entry &lt;nume&gt;</code>, 'Detaliile unui vecin.'],
          [<code>show lldp interface</code>, 'Pe ce porturi se transmite/primește.'],
          [<code>show lldp traffic</code>, 'Contoare de cadre.'],
        ]} />
        <p>Codurile de capabilitate LLDP diferă de cele CDP: <b>B</b> bridge (switch), <b>R</b> router, <b>T</b> telefon, <b>W</b> WLAN access point, <b>P</b> repetor, <b>C</b> DOCSIS cable device, <b>S</b> station, <b>O</b> other. Verifică legenda tipărită în output.</p>
        <DeepDive title="LLDP-MED și telefoanele IP">
          <p>LLDP-MED adaugă TLV-uri pentru endpoint-uri: <i>Network Policy</i> (VLAN de voce, prioritate, DSCP) și <i>Extended Power-via-MDI</i> (puterea cerută de telefon/AP, relevantă la PoE). Un switch care rulează LLDP poate astfel anunța telefonul „VLAN 40, CoS 5” fără CDP. Pe Cisco, telefoanele Cisco folosesc de obicei CDP, iar cele altor producători LLDP-MED; de aceea în rețele mixte se pornesc ambele protocoale. Nu se cer la CCNA câmpurile exacte, doar rolul.</p>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>LLDP este <b>dezactivat</b> implicit pe IOS: fără <code>lldp run</code> nu apare niciun vecin LLDP.</>,
        <>Pe interfață, ambele direcții trebuie active (<code>lldp transmit</code> + <code>lldp receive</code>) ca să funcționeze schimbul în ambele sensuri.</>,
        <>LLDP = standard IEEE 802.1AB (deschis); CDP = proprietar Cisco. Un echipament non-Cisco apare în <code>show lldp neighbors</code>, nu neapărat în <code>show cdp neighbors</code>.</>,
        <>Timere implicite uzuale pe IOS: 30 s anunț, 120 s hold (verifică <code>show lldp</code> pe platforma ta).</>,
        <>LLDP nu este „CDP standard” cu aceleași comenzi: comenzile diferă (<code>lldp run</code> vs <code>cdp run</code>, <code>lldp transmit/receive</code> vs <code>cdp enable</code>).</>,
      ]} />
      <InlineQuiz ids={['2.3-017', '2.3-020', '2.3-023']} />
    </section>
  );
}

/* ======================================================================
   CDP vs LLDP, securitate, depanare
   ====================================================================== */
export function Compare() {
  return (
    <section id="compare" className="section">
      <SectionHead id="compare" code="2.3" title="CDP vs LLDP — alegere, securitate, depanare" />
      <Summary>
        <p>CDP este mai bogat pe echipamente Cisco; LLDP este standardul pentru rețele mixte. Ambele <b>oferă informații utile unui atacator</b> (model, versiune, IP), deci se opresc pe porturile spre utilizatori sau rețele externe. Dacă un vecin „lipsește” din tabelă, verifici pe rând: link, protocol activat global, protocol activat pe interfață, același protocol pe ambele capete.</p>
      </Summary>

      <Detailed title="1. Comparație">
        <Table head={['', 'CDP', 'LLDP']} hlCol={0} rows={[
          ['Standard', 'Proprietar Cisco', 'IEEE 802.1AB (deschis)'],
          ['Implicit pe IOS', <b>Activat</b>, <b>Dezactivat</b> ],
          ['Pornire globală', <code>cdp run</code>, <code>lldp run</code>],
          ['Control pe interfață', <><code>cdp enable</code> / <code>no cdp enable</code></>, <><code>lldp transmit</code> / <code>lldp receive</code> (separat)</>],
          ['Timer / hold time implicit', '60 s / 180 s', '30 s / 120 s (verifică platforma)'],
          ['Destinație', 'multicast 0100.0ccc.cccc', 'multicast 01-80-C2-00-00-0E, EtherType 0x88CC'],
          ['Telefoane IP', 'CDP (telefoane Cisco)', 'LLDP-MED (alți producători, și Cisco)'],
          ['Comenzi show', <><code>show cdp neighbors [detail]</code></>, <><code>show lldp neighbors [detail]</code></>],
          ['Interoperabilitate', 'Doar Cisco (și echipamente care îl implementează)', 'Multi-vendor'],
        ]} />
        <p><b>Pot rula amândouă?</b> Da. În rețele mixte e frecvent să le pornești pe ambele, ca să vezi atât echipamentele Cisco, cât și pe cele non-Cisco. Fiecare protocol își ține propria tabelă de vecini.</p>

        <h3>2. Securitate: ce poate afla un atacator</h3>
        <p>Anunțurile sunt trimise <b>în clar</b>, fără autentificare. Un atacator care primește cadre pe un port (de exemplu un laptop conectat în priză) vede <b>modelul echipamentului, versiunea de IOS, adresele IP de management, VLAN-ul nativ</b>. Cu aceste informații caută vulnerabilități cunoscute sau alege ținte de atac. Un atacator poate chiar inunda rețeaua cu anunțuri false pentru a epuiza memoria vecinilor (variante istorice de DoS pe CDP).</p>
        <ul>
          <li><b>Pe porturile spre utilizatori / exterior:</b> <code>no cdp enable</code> și <code>no lldp transmit</code> / <code>no lldp receive</code>.</li>
          <li><b>Pe tot echipamentul, dacă nu ai nevoie:</b> <code>no cdp run</code> (pierzi funcțiile care depind de CDP, de exemplu telefoane Cisco sau unelte de monitorizare).</li>
          <li><b>Păstrează</b> descoperirea doar pe legăturile dintre echipamentele de infrastructură, unde chiar o folosești.</li>
        </ul>
        <Callout kind="warn" title="Compromis">
          Dezactivarea CDP pe un port cu telefon IP îl poate împiedica să afle VLAN-ul de voce sau puterea necesară. Dezactivează selectiv, nu orbește.
        </Callout>

        <h3>3. Depanare: „vecinul meu nu apare”</h3>
        <Table head={['Verificare', 'Comandă / cauză']} hlCol={0} rows={[
          ['1. Link-ul e up/up?', <><code>show interfaces status</code> / <code>show ip interface brief</code> — fără link nu există anunțuri.</>],
          ['2. Protocolul e pornit global pe ambele capete?', <><code>show cdp</code> / <code>show lldp</code>; <code>cdp run</code> / <code>lldp run</code>.</>],
          ['3. E activat pe interfață?', <><code>show cdp interface</code> / <code>show lldp interface</code>; <code>cdp enable</code> sau <code>lldp transmit</code>+<code>receive</code>.</>],
          ['4. Același protocol pe ambele capete?', 'Un capăt doar CDP și celălalt doar LLDP: niciunul nu vede nimic.'],
          ['5. Vecinul a expirat?', 'După holdtime fără anunțuri intrarea dispare: cablu defect, port în shutdown/err-disabled, echipament oprit.'],
          ['6. Contoare', <><code>show cdp traffic</code> / <code>show lldp traffic</code>: se văd cadre primite sau doar trimise?</>],
        ]} />
        <DeepDive title="Ce nu poate face CDP/LLDP">
          <p>Nu depășește un echipament de nivel 3: un router nu retransmite anunțurile de pe un segment pe altul. Nu arată topologia întreagă (doar vecini direcți). Nu garantează că informațiile sunt corecte (hostname-ul este cel configurat de administrator). Este o sursă de adevăr bună pentru „ce vede acest port acum”, nu un instrument complet de inventar.</p>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>CDP activ implicit + LLDP inactiv implicit: răspuns de examen pentru „care protocol e pornit pe un switch nou?”.</>,
        <>Un singur protocol pe un capăt și celălalt pe celălalt capăt ⇒ niciun vecin nu apare.</>,
        <>Descoperirea de vecini <b>nu</b> trebuie lăsată pe porturi spre utilizatori sau Internet.</>,
        <>CDP/LLDP nu configurează nimic; sunt informative.</>,
      ]} />
      <InlineQuiz ids={['2.3-027', '2.3-029', '2.3-031']} />
    </section>
  );
}
