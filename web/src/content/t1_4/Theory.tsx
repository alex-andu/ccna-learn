import { Link } from 'react-router-dom';
import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { CableFaults, DuplexNegotiationLab, LateCollisionSlider, MismatchMechanism, ShowInterfacesExplorer, StatusDecoder, TroubleshootFlow } from '../../diagrams/t1_4';

/* ======================================================================
   0. Introducere — imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.4" title="Probleme de interfață și cablu — imaginea de ansamblu" />
      <Summary>
        <p>Când „nu merge rețeaua”, primul loc unde te uiți este <b>interfața</b>: e pornită? are semnal? vorbește corect cu capătul celălalt? Topicul 1.4 te învață să citești <b>starea</b> unei interfețe și <b>contoarele de erori</b> din <code>show interfaces</code>,
          ca să recunoști patru familii de probleme: <b>coliziuni</b>, <b>erori</b> (<G id="crc" />, <G id="runt" />, <G id="giant" />), <b><G id="duplex-mismatch" /></b> și <b><G id="speed-mismatch" /></b>.</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial este <i>„Identify interface and cable issues (collisions, errors, mismatch duplex, and/or speed)”</i>. Verbul este <b>Identify</b>: la examen primești un output (sau o descriere) și trebuie să spui <b>ce s-a întâmplat</b> și, de cele mai multe ori, <b>pe care capăt</b>. Nu ai sub-puncte a/b/c, așa că am împărțit topicul în teme logice:</p>
        <Table head={['Temă din obiectiv', 'Secțiunea', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['(baza)', 'Stările interfeței', 'Interfața e pornită? Are semnal (L1)? Merge protocolul de legătură (L2)?'],
          ['errors', 'Contoarele din show interfaces', 'Ce înseamnă CRC, runts, giants, input errors, drops… și ce cauză sugerează fiecare?'],
          ['collisions', 'Coliziuni', 'Când sunt normale coliziunile și ce e o late collision?'],
          ['mismatch duplex', 'Duplex mismatch', 'Ce se întâmplă când un capăt e full și celălalt half? Cum recunoști fiecare capăt?'],
          ['mismatch speed', 'Speed mismatch', 'De ce viteza diferită oprește complet legătura?'],
          ['interface and cable issues', 'Defecte de cablu', 'Lungime, sertizare, EMI, cablu greșit, fibră.'],
          ['(sinteză)', 'Flowchart de troubleshooting', 'În ce ordine verifici totul?'],
        ]} />
        <Callout kind="info" title="Legătura cu topicul 1.3">
          Topicul <Link to="/topic/1.3">1.3 — Compare physical interface and cabling types</Link> explică tipurile de cabluri (<G id="utp" />, <G id="fiber" />), <G id="straight-through" /> vs <G id="crossover" />, mediul partajat cu <G id="hub" />, <G id="csma-cd" /> și diferența <G id="half-duplex" /> / <G id="full-duplex" />.
          Aici le folosim: recapitulăm pe scurt doar ce e necesar ca să înțelegi simptomele.
        </Callout>

        <h3>Recapitulare din 1.3 în trei fraze</h3>
        <ul>
          <li><b>Half-duplex</b> = un singur dispozitiv vorbește la un moment dat. Dacă doi vorbesc simultan, apare o <G id="collision">coliziune</G>, iar <G id="csma-cd" /> o detectează și retransmite. Este modul hub-urilor (un singur <G id="collision-domain" />).</li>
          <li><b>Full-duplex</b> = fiecare direcție are perechea ei de fire; ambele capete transmit simultan, <b>fără coliziuni</b>. Este modul normal al oricărui port de switch modern legat de un singur dispozitiv.</li>
          <li><G id="autonegotiation" /> = cele două capete își anunță capabilitățile și aleg cea mai bună combinație comună (viteză + duplex).</li>
        </ul>

        <h3>Troubleshooting de jos în sus</h3>
        <p>Rețelele se depanează după modelul <G id="osi" />, <b>de jos în sus</b>: nu are sens să verifici adresa IP (nivelul 3) dacă nu există semnal pe cablu (nivelul 1). Topicul 1.4 acoperă exact primele două niveluri:</p>
        <Table head={['Nivel', 'Ce verifici', 'Unde vezi']} rows={[
          ['1 — fizic', 'cablu, conectori, lungime, semnal, viteză', <>primul cuvânt din <code>… is up/down</code>, LED-ul portului, CRC, interface resets</>],
          ['2 — legătură de date', 'duplex, cadre, coliziuni, protocolul de linie', <><code>line protocol is up/down</code>, collisions, late collision, runts</>],
          ['3+ — rețea și mai sus', 'IP, mască, gateway, routing', <>topicurile 1.6, 1.10, 3.x — <b>doar după</b> ce L1/L2 sunt curate</>],
        ]} />
        <Analogy>Gândește-te la un apel telefonic. Nivelul 1 = „e ton pe linie?”. Nivelul 2 = „vorbim pe rând și ne înțelegem cuvintele?”. Duplex mismatch-ul e ca o convorbire în care tu vorbești ca la telefon (amândoi deodată), iar celălalt ca la stație radio (doar pe rând): legătura există, dar vă tot întrerupeți și repetați.</Analogy>

        <h3>Cele trei comenzi pe care le vei folosi mereu</h3>
        <Table head={['Comandă', 'Ce îți dă', 'Când o folosești']} rows={[
          [<code>show ip interface brief</code>, 'IP, Status (L1), Protocol (L2) pentru toate interfețele', 'privire rapidă: ce e up, ce e down'],
          [<code>show interfaces status</code>, 'tabel pe switch: Status, VLAN, Duplex, Speed („a-” = negociat)', 'găsești rapid duplex half / viteze ciudate / err-disabled'],
          [<code>show interfaces &lt;if&gt;</code>, 'totul despre o interfață: stare, duplex, viteză, toate contoarele', 'diagnoza propriu-zisă a erorilor'],
        ]} />
      </Detailed>

      <Traps items={[
        <>Ordinea în <code>X is up, line protocol is down</code>: <b>primul cuvânt = L1</b>, „line protocol” = <b>L2</b>.</>,
        <>Interfața <b>up/up nu înseamnă „fără probleme”</b>: duplex mismatch, CRC și congestia apar pe legături up/up.</>,
        <>Depanează <b>de jos în sus</b>: cablu și semnal înainte de IP.</>,
      ]} />
      <InlineQuiz ids={['1.4-008', '1.4-002', '1.4-029']} />
    </section>
  );
}

/* ======================================================================
   1. Stările interfeței
   ====================================================================== */
export function States() {
  return (
    <section id="states" className="section">
      <SectionHead id="states" code="1.4" title="Stările interfeței — up/up, up/down, down/down, administratively down, err-disabled" />
      <Summary>
        <p>Fiecare interfață are o stare formată din <b>două cuvinte</b>: starea nivelului 1 (există semnal?) și starea nivelului 2 (<i>line protocol</i>). Combinațiile posibile sunt puține, iar fiecare îți spune direct <b>unde să cauți</b>.
          Pe switch-uri, aceeași informație apare și ca un singur cuvânt: <code>connected</code>, <code>notconnect</code>, <code>disabled</code>, <code>err-disabled</code>.</p>
      </Summary>

      <Detailed title="Decodorul de stări (interactiv)">
        <p>Apasă pe fiecare stare: vezi cum arată în cele trei comenzi, ce o cauzează și ce faci.</p>
        <Figure caption="Primul cuvânt = nivelul 1, al doilea = nivelul 2. Exemplele de output sunt ilustrative.">
          <StatusDecoder />
        </Figure>
      </Detailed>

      <Detailed title="Explicația detaliată">
        <h3>Tabelul de referință</h3>
        <Table head={['show interfaces', 'show ip int brief (Status / Protocol)', 'show interfaces status', 'Înseamnă']} rows={[
          [<code>up, line protocol is up</code>, 'up / up', <code>connected</code>, 'funcționează la L1 și L2'],
          [<code>up, line protocol is down</code>, 'up / down', '—', 'L1 OK, L2 nu (serial: encapsulare, clock, keepalive)'],
          [<code>down, line protocol is down</code>, 'down / down', <code>notconnect</code>, 'fără semnal: cablu, capăt oprit, speed mismatch'],
          [<code>administratively down, line protocol is down</code>, 'administratively down / down', <code>disabled</code>, <>oprit cu <code>shutdown</code> — <G id="admin-down" /></>],
          [<code>down, line protocol is down (err-disabled)</code>, 'down / down', <code>err-disabled</code>, <>oprit automat de switch — <G id="err-disabled" /></>],
        ]} />

        <h3>up / up</h3>
        <p>Starea dorită: există semnal electric/optic valid și protocolul de nivel 2 funcționează (pe Ethernet, partenerul a fost recunoscut; pe serial, keepalive-urile circulă). <b>Atenție</b> — e doar condiția minimă. Restul topicului e despre problemele care se ascund sub un up/up.</p>

        <h3>down / down (notconnect)</h3>
        <p>Interfața este pornită (nu ai dat <code>shutdown</code>), dar <b>nu detectează niciun partener</b> pe fir. Cauze: cablu lipsă sau rupt, cablu de tip greșit fără <G id="auto-mdix" />, celălalt capăt stins/oprit/err-disabled, <b>speed mismatch</b> (ambele capete fixate pe viteze diferite), iar la fibră: TX/RX inversate, <G id="sfp" /> de tip diferit la capete, <G id="smf" /> amestecat cu <G id="mmf" />, conectori murdari.</p>

        <h3>up / down</h3>
        <p>Semnal există, dar nivelul 2 nu se înțelege cu capătul celălalt. Locul clasic este o legătură <G id="serial-link">serială</G> între routere: un capăt cu <G id="hdlc" /> (implicit pe Cisco), celălalt cu <G id="ppp" />; sau lipsa <code>clock rate</code> pe capătul DCE; sau autentificarea PPP eșuată. Pe Ethernet e rar.</p>

        <h3>administratively down / down</h3>
        <p>„Administratively” = <b>un om</b> a dat <code>shutdown</code>. Nu e o eroare: e normal pe porturile nefolosite (bună practică de securitate — topicul 5.x) și pe interfețele de router, care sunt oprite implicit până dai <code>no shutdown</code>. Capătul celălalt vede, logic, down/down.</p>

        <h3>err-disabled</h3>
        <p><b>Switch-ul</b> a oprit portul ca să te protejeze. Cauze frecvente: încălcare de port security (topicul 5.7), BPDU Guard pe un port PortFast care primește BPDU-uri (2.5), UDLD (legătură de fibră unidirecțională), <G id="etherchannel" /> configurat greșit, link care „flapează” prea des. Recuperarea are doi pași: <b>elimini cauza</b>, apoi <code>shutdown</code> + <code>no shutdown</code> — sau lași <code>errdisable recovery</code> să reactiveze portul automat după un interval.</p>
        <Analogy>Administratively down e ca atunci când <b>tu</b> stingi lumina din întrerupător. Err-disabled e ca siguranța din tablou care „sare” singură când detectează un scurtcircuit: o poți urca la loc, dar dacă nu repari scurtcircuitul, sare din nou.</Analogy>
      </Detailed>

      <DeepDive title="Deep dive: ce înseamnă „line protocol” pe diferite tipuri de interfețe">
        <p>Pe <b>serial</b>, „line protocol up” înseamnă că mesajele keepalive ale protocolului de legătură (HDLC sau LCP la PPP) circulă în ambele sensuri. De aceea o nepotrivire de encapsulare dă up/down: semnalul există, dar mesajele nu sunt înțelese. IOS poate afișa și <code>up, line protocol is up (looped)</code> când detectează propriile keepalive-uri întoarse (o buclă pe circuit).</p>
        <p>Pe <b>Ethernet</b>, nu există keepalive-uri de nivel 2 cu partenerul în același sens; line protocol urmează în general starea fizică. Un caz special e portul destinație de monitorizare (SPAN), care apare <code>up, line protocol is down (monitoring)</code> — e intenționat, portul doar copiază trafic spre un analizor.</p>
        <p>Pe interfețele virtuale (<code>interface vlan 10</code>, SVI — topicul 2.x), line protocol e up doar dacă VLAN-ul există și are cel puțin un port activ în el.</p>
      </DeepDive>

      <Traps items={[
        <><b>administratively down</b> = <code>shutdown</code>. <b>err-disabled</b> = oprit de switch. Nu le confunda: err-disabled NU se rezolvă cu un simplu <code>no shutdown</code>, ci cu shutdown/no shutdown după ce repari cauza.</>,
        <>Speed mismatch → <b>down/down</b>. Duplex mismatch → <b>up/up</b>.</>,
        <><b>up/down</b> pe serial → gândește-te la encapsulare (HDLC vs PPP) sau la <code>clock rate</code>.</>,
        <>În <code>show interfaces status</code>: <code>disabled</code> = shutdown; <code>notconnect</code> = fără partener.</>,
      ]} />
      <InlineQuiz ids={['1.4-001', '1.4-003', '1.4-004', '1.4-005']} />
    </section>
  );
}

/* ======================================================================
   2. Contoarele
   ====================================================================== */
export function Counters() {
  return (
    <section id="counters" className="section">
      <SectionHead id="counters" code="1.4" title="Contoarele din show interfaces — ce înseamnă fiecare eroare" />
      <Summary>
        <p><code>show interfaces</code> numără tot ce se întâmplă pe un port: cadre primite și trimise, dar și <b>erori</b>. Fiecare contor are o definiție precisă și o cauză tipică. Truc important: grupează-le în <b>trei familii</b> —
          probleme <b>fizice</b> (CRC, frame), probleme de <b>duplex/coliziuni</b> (collisions, late collision, runts) și <b>congestie/resurse</b> (output drops, ignored, overrun) — ultima <b>nu</b> e vina cablului.</p>
      </Summary>

      <Detailed title="Output adnotat (interactiv)">
        <p>Alege un scenariu, apoi apasă pe orice contor subliniat. Valorile cu roșu sunt cele care indică problema din scenariul ales.</p>
        <Figure caption="show interfaces pe un switch Catalyst — output ilustrativ, construit pentru învățare (formatul urmează IOS; cifrele sunt alese ca să arate fiecare tipar).">
          <ShowInterfacesExplorer />
        </Figure>
      </Detailed>

      <Detailed title="Explicația detaliată">
        <h3>Cele trei familii de contoare</h3>
        <Table head={['Familie', 'Contoare', 'Ce înseamnă', 'Exemple de cauze']} rows={[
          ['Fizic (zgomot, cablu)', <><G id="crc" />, frame, <G id="input-errors" />, giants, <G id="interface-resets" /></>, 'biții se corup sau semnalul se pierde', <>cablu deteriorat sau prea lung, sertizare, <G id="emi" />, NIC/port/transceiver defect</>],
          ['Duplex / coliziuni', <><G id="collision">collisions</G>, <G id="late-collision" />, <G id="runt" />, deferred</>, 'regulile de acces la mediu sunt încălcate', 'duplex mismatch, half-duplex supraîncărcat, segment prea lung'],
          ['Congestie / resurse', <><G id="output-drops" />, <G id="ignored" />, no buffer, <G id="overrun" /></>, 'prea mult trafic pentru cozi/buffere', 'link lent după link rapid, rafale, broadcast storm (buclă L2)'],
        ]} />

        <h3>Definițiile Cisco, una câte una</h3>
        <Table head={['Contor', 'Definiție', 'Cauză tipică']} rows={[
          [<b>runts</b>, 'cadre primite < 64 octeți, cu CRC greșit', 'fragmente de coliziuni; partea full a unui duplex mismatch'],
          [<b>giants</b>, <>cadre primite &gt; 1518 octeți (fără jumbo); switch-urile precizează „cu FCS greșit”</>, <>NIC defect, nepotrivire de <G id="mtu" /> (jumbo frames)</>],
          [<b>CRC</b>, <>checksum-ul calculat ≠ cel din câmpul <G id="fcs" /> al cadrului</>, 'zgomot/cablu/port; sau efect al coliziunilor (duplex mismatch, partea full)'],
          [<b>frame</b>, 'CRC greșit și un număr de biți care nu e multiplu de 8', 'coliziuni, defect fizic'],
          [<b>input errors</b>, 'totalul erorilor la recepție (runts, giants, no buffer, CRC, frame, overrun, ignored…)', 'vezi sub-contorul care crește; nu se adună obligatoriu exact'],
          [<b>collisions</b>, 'coliziuni apărute înainte ca un cadru să plece cu succes', 'normale pe half-duplex; pe full-duplex nu trebuie să existe'],
          [<b>late collision</b>, 'coliziune după 512 bit-times (primii 64 de octeți)', 'duplex mismatch (partea half) sau cablu/segment prea lung'],
          [<b>deferred</b>, 'cadru trimis după ce a așteptat mediul liber', 'normal pe half-duplex'],
          [<b>output errors</b>, 'totalul erorilor care au împiedicat transmisia', '—'],
          [<b>Total output drops</b>, 'pachete aruncate: coada de ieșire plină', 'congestie (de ex. 1 Gb/s → 100 Mb/s)'],
          [<b>ignored / no buffer</b>, 'cadre primite aruncate: lipsă de buffere interne / de sistem', 'broadcast storm, rafale'],
          [<b>overrun</b>, 'receptorul nu a putut preda datele unui buffer hardware', 'rată de intrare peste capacitatea echipamentului'],
          [<b>interface resets</b>, 'interfața a fost resetată complet', 'link instabil, pierdere de semnal, cadre blocate în coadă câteva secunde'],
        ]} />
        <Callout kind="tip" title="De unde vin cifrele 64 și 1518?">
          Un cadru Ethernet are 14 octeți de antet (MAC destinație 6 + MAC sursă 6 + EtherType 2), între 46 și 1500 de octeți de date și 4 octeți de FCS. Minim: 14 + 46 + 4 = <b>64</b>. Maxim: 14 + 1500 + 4 = <b>1518</b>. (Detaliile cadrului sunt în topicul 1.13.)
        </Callout>

        <h3>Contoarele sunt cumulative — contează viteza cu care cresc</h3>
        <p>Toate contoarele cresc de la pornirea echipamentului sau de la ultimul <code>clear counters</code>. Linia <code>Last clearing of "show interface" counters</code> îți spune de când numeri. 200 de CRC-uri în doi ani pot fi zgomotul unei singure furtuni; 200 de CRC-uri în două minute înseamnă o problemă reală. Metoda corectă: <b>clear counters → aștepți → reverifici</b>.</p>
        <Analogy>Contoarele sunt ca kilometrajul mașinii: „200.000 km” nu îți spune dacă mașina merge acum. Ca să știi dacă ceva se strică <b>acum</b>, resetezi contorul de călătorie și te uiți cât crește.</Analogy>
      </Detailed>

      <DeepDive title="Deep dive: contoarele pe switch — show interfaces counters errors">
        <p>Pe switch-urile Catalyst, <code>show interfaces counters errors</code> afișează erorile într-un tabel pe toate porturile, cu nume ușor diferite:</p>
        <Table head={['Coloană', 'Definiție (Cisco)']} rows={[
          ['Align-Err', 'cadre care nu se termină la granița unui octet și au CRC greșit'],
          ['FCS-Err', 'cadre de dimensiune validă cu FCS greșit, fără altă eroare'],
          ['Xmit-Err', 'buffer-ul intern de transmisie e plin (de ex. link rapid spre link lent)'],
          ['Rcv-Err', 'suma erorilor de recepție'],
          ['UnderSize', 'cadre bine formate (FCS corect), dar sub 64 de octeți — verifică dispozitivul care le trimite'],
          ['Single-Col / Multi-Col', 'cadre trimise după una / mai multe coliziuni'],
          ['Late-Col', 'coliziuni târzii (după 512 biți)'],
          ['Excess-Col', 'cadre aruncate după 16 coliziuni consecutive'],
          ['Carri-Sen', 'de câte ori un port half-duplex a ascultat mediul înainte să transmită (normal pe half)'],
          ['Runts / Giants', 'ca în show interfaces'],
        ]} />
        <p>Diferența subtilă runts vs UnderSize: <b>runt</b> = prea scurt <i>și</i> corupt (fragment); <b>UnderSize</b> = prea scurt, dar cu FCS corect — deci cineva chiar a construit greșit cadrul (driver/NIC). Mai există <b>babbles</b> / jabber (transmițătorul nu se mai oprește — NIC defect).</p>
      </DeepDive>

      <Traps items={[
        <><b>Runts &lt; 64 octeți</b>, <b>giants &gt; 1518 octeți</b> — cifrele se cer exact.</>,
        <><b>Output drops ≠ output errors.</b> Drops = coadă plină (congestie), nu cablu.</>,
        <><b>CRC fără coliziuni</b> pe un port full = problemă fizică (cablu, EMI, port). CRC <b>cu runts</b> pe un port full = partea full a unui duplex mismatch.</>,
        <><b>Input errors</b> este un total; sub-contoarele nu se adună obligatoriu exact la el.</>,
        <>Ignored / no buffer / overrun = resurse (de multe ori broadcast storm), nu cablu.</>,
      ]} />
      <InlineQuiz ids={['1.4-009', '1.4-011', '1.4-013', '1.4-014']} />
    </section>
  );
}

/* ======================================================================
   3. Coliziuni
   ====================================================================== */
export function Collisions() {
  return (
    <section id="collisions" className="section">
      <SectionHead id="collisions" code="1.4" title="Coliziuni — când sunt normale și ce e o late collision" />
      <Summary>
        <p>Coliziunile sunt <b>normale doar pe half-duplex</b> (hub, mediu partajat) și sunt rezolvate automat de <G id="csma-cd" />. Pe un port <b>full-duplex nu trebuie să existe niciuna</b>.
          O <G id="late-collision" /> — coliziune după primii 64 de octeți ai cadrului — nu e normală nicăieri: indică un duplex mismatch sau un segment prea lung.</p>
      </Summary>

      <Detailed>
        <h3>Coliziunea „normală”</h3>
        <p>Pe un mediu half-duplex, un dispozitiv ascultă (carrier sense), transmite dacă e liniște și, în timp ce transmite, verifică dacă altcineva a început și el. Dacă da: trimite un semnal <i>jam</i>, așteaptă un timp aleatoriu (backoff, măsurat în <G id="slot-time">slot times</G>) și reîncearcă. Totul se întâmplă în placa de rețea, în microsecunde; utilizatorul nu observă nimic. După <b>16</b> încercări eșuate cadrul este aruncat (<i>excessive collisions</i>).</p>
        <Table head={['Unde', 'Coliziuni?', 'Interpretare']} rows={[
          ['Hub / mediu partajat, half-duplex', 'da, puține', 'normal (Cisco: excesiv peste ≈0,1% din pachetele trimise)'],
          ['Port de switch half-duplex legat de un singur dispozitiv vechi', 'posibil', 'acceptabil dacă ambele capete sunt half; dar de ce half în ziua de azi?'],
          ['Port full-duplex', <b>niciodată</b>, 'dacă apar → configurare greșită / duplex mismatch'],
          ['Wi-Fi', '—', <>folosește CSMA/CA, <b>evită</b> coliziunile; nu le detectează (vezi 1.11)</>],
        ]} />

        <h3>Late collision — după fereastra de 512 biți</h3>
        <p>Ethernetul half-duplex are o regulă de proiectare: rețeaua trebuie să fie suficient de mică încât o coliziune de la capătul cel mai îndepărtat să ajungă înapoi la emițător <b>cât încă transmite primii 512 biți</b> (64 de octeți). De aceea minimul unui cadru e de 64 de octeți: altfel emițătorul ar termina de transmis înainte să afle că s-a lovit.</p>
        <p>Dacă o coliziune apare <b>după</b> acest punct, e o <i>late collision</i>. Ea înseamnă că una dintre premise e falsă:</p>
        <ul>
          <li><b>celălalt capăt nu ascultă înainte să transmită</b> — e full-duplex (duplex mismatch, cauza nr. 1 azi);</li>
          <li><b>rețeaua e prea „lungă”</b> — cablu peste 100 m sau prea multe hub-uri/repetoare în cascadă (cauza clasică de pe vremea hub-urilor).</li>
        </ul>
        <Figure caption="Mută cursorul: coliziunile din primii 64 de octeți sunt „normale”; după ele devin late collisions. 512 biți = 51,2 µs la 10 Mb/s și 5,12 µs la 100 Mb/s.">
          <LateCollisionSlider />
        </Figure>
        <p>Diferența practică: o coliziune normală e recuperată instantaneu de placa de rețea. După o late collision, placa de rețea în general <b>nu mai retransmite</b> cadrul — pierderea o observă abia TCP, după un timeout, și încetinește tot transferul. De aici senzația de „rețea care merge, dar greu”.</p>
        <Analogy>Într-o sală de ședințe, dacă doi oameni încep să vorbească în aceeași secundă, se opresc amândoi, zâmbesc și unul reia — normal. Dar dacă cineva te întrerupe la jumătatea unei fraze lungi, pierzi șirul și trebuie să reiei totul de la capăt, mult mai târziu: asta e late collision.</Analogy>
      </Detailed>

      <DeepDive title="Deep dive: de unde vine limita de distanță în half-duplex">
        <p>Semnalul electric se propagă prin cupru cu aproximativ 2/3 din viteza luminii. Ca să garanteze detecția coliziunilor, IEEE a dimensionat bugetul de întârziere al întregului domeniu de coliziune (cabluri + repetoare) astfel încât dus-întorsul să încapă în 512 bit-times. La 100 Mb/s bitul e de 10 ori mai scurt, deci și diametrul maxim al unui domeniu de coliziune scade mult — de exemplu 100BASE-FX half-duplex era limitat la 412 m tocmai ca să poată detecta coliziunile, în timp ce în full-duplex aceeași fibră merge până la 2 km.</p>
        <p>În full-duplex limita de distanță nu mai depinde de coliziuni, ci doar de atenuarea semnalului — de aceea fibra full-duplex poate merge kilometri. Ethernetul de 10 Gb/s și peste funcționează exclusiv full-duplex, fără CSMA/CD.</p>
      </DeepDive>

      <Traps items={[
        <>Coliziuni <b>pe un port full-duplex</b> = ceva e configurat greșit.</>,
        <><b>Late collision = după 512 biți (64 de octeți)</b>. Cauze: duplex mismatch (partea half) sau cablu/segment prea lung.</>,
        <>Coliziunile normale pe hub <b>nu</b> sunt o problemă de rezolvat — late collisions sunt.</>,
        <>16 coliziuni consecutive → cadrul e aruncat (excessive collisions).</>,
      ]} />
      <InlineQuiz ids={['1.4-015', '1.4-021', '1.4-022', '1.4-025']} />
    </section>
  );
}

/* ======================================================================
   4. Duplex mismatch
   ====================================================================== */
export function Duplex() {
  return (
    <section id="duplex" className="section">
      <SectionHead id="duplex" code="1.4" title="Duplex mismatch — un capăt full, celălalt half" />
      <Summary>
        <p>Cel mai „perfid” defect din 1.4: legătura e <b>up/up</b>, ping-ul merge, dar transferurile se târăsc. Apare aproape mereu când <b>un capăt e fixat manual</b> (de ex. 100/full) și <b>celălalt e pe auto</b>: partea auto ghicește viteza, dar presupune <b>half</b>.
          Semnătura de examen: partea <b>half</b> → <b>collisions + late collisions</b>; partea <b>full</b> → <b>CRC/FCS + runts</b>.</p>
      </Summary>

      <Detailed title="Explicația detaliată">
        <h3>Ce problemă a rezolvat autonegocierea — și ce problemă a creat</h3>
        <p>Când a apărut Fast Ethernet (802.3u, 1995), plăcile de rețea puteau funcționa la 10 sau 100 Mb/s, half sau full. <G id="autonegotiation" /> a fost introdusă ca cele două capete să-și anunțe capabilitățile prin impulsuri speciale (FLP) și să aleagă automat cea mai bună combinație comună. Era însă <b>opțională</b>, iar primele implementări nu se înțelegeau mereu între producători — așa că mulți administratori au luat obiceiul să <b>fixeze manual</b> viteza și duplexul. Implementările s-au îmbunătățit rapid, iar la 1000BASE-T (1999) autonegocierea a devenit <b>obligatorie</b>. Obiceiul hard-codării a rămas, iar odată cu el, mismatch-urile.</p>

        <h3>Regula de aur: ce se întâmplă când un singur capăt negociază</h3>
        <p>Când configurezi manual viteza (și duplexul) pe un port Cisco, portul <b>nu mai negociază deloc</b>. Capătul celălalt, rămas pe auto, nu primește impulsuri de negociere și trece pe planul B, <G id="parallel-detection" />:</p>
        <ul>
          <li><b>Viteza</b> o poate afla „ascultând” semnalul brut (10 și 100 Mb/s arată diferit pe fir).</li>
          <li><b>Duplexul nu se vede în semnal</b>, așa că standardul impune presupunerea prudentă: <b>half-duplex</b> (la 10 și 100 Mb/s; la 1 Gb/s, full).</li>
        </ul>
        <Table head={['Capătul A', 'Capătul B', 'Rezultat']} rows={[
          ['auto', 'auto', <b style={{ color: 'var(--ok)' }}>cea mai bună viteză comună, full-duplex ✓</b>],
          ['fix 100 / full', 'auto', <b style={{ color: 'var(--warn)' }}>B: 100 / half → duplex mismatch</b>],
          ['fix 100 / half', 'auto', 'B: 100 / half → merge, dar half (coliziuni normale)'],
          ['fix 100 / full', 'fix 100 / full', 'merge (riscant: dacă cineva schimbă un capăt…)'],
          ['fix 100 / full', 'fix 100 / half', <b style={{ color: 'var(--warn)' }}>duplex mismatch</b>],
          ['fix 100', 'fix 1000', <b style={{ color: 'var(--bad)' }}>speed mismatch → link down</b>],
        ]} />
        <Figure caption="Configurează cele două capete și observă ce afișează show interfaces status și ce contoare cresc. Modelul urmează regulile Cisco/IEEE descrise în lecție; detaliile pot varia între platforme.">
          <DuplexNegotiationLab />
        </Figure>

        <h3>De ce apar exact acele contoare pe fiecare capăt</h3>
        <Figure caption="Mecanismul pas cu pas: partea full transmite oricând, partea half interpretează asta drept coliziune.">
          <MismatchMechanism />
        </Figure>
        <Table head={['', 'Capătul HALF-duplex', 'Capătul FULL-duplex']} rows={[
          ['Comportament', 'ascultă înainte; dacă primește ceva în timp ce emite → „coliziune”', 'transmite oricând; nu cunoaște noțiunea de coliziune'],
          ['Contoare care cresc', <b>collisions, late collision</b>, <b>CRC (FCS), runts</b>],
          ['Contoare care rămân 0', '—', 'collisions, late collision'],
          ['În show interfaces status', <><code>a-half</code> (dacă e pe auto)</>, <><code>full</code> (fără „a-”, dacă e fixat)</>],
          ['Stare', 'up/up', 'up/up'],
        ]} />
        <Callout kind="exam" title="Ce să răspunzi la examen">
          „Late collisions pe o interfață” → acea interfață este partea <b>half</b> a unui duplex mismatch (sau cablul e prea lung). „CRC și runts pe o interfață full-duplex, fără coliziuni” → partea <b>full</b> a unui mismatch. „Up/up, ping merge, dar lent” → gândește-te la duplex mismatch.
        </Callout>

        <h3>CDP te ajută (între echipamente Cisco)</h3>
        <p><G id="cdp" /> trimite periodic vecinului informații despre port, inclusiv duplexul. Când cele două capete raportează duplexuri diferite, IOS afișează în log:</p>
        <pre className="mono small" style={{ background: 'var(--code-bg)', padding: '10px 12px', borderRadius: 10, overflowX: 'auto', border: '1px solid var(--border)' }}>%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on FastEthernet0/24 (not full duplex), with SW2 FastEthernet0/24 (full duplex).</pre>
        <p>Mesajul <b>doar raportează</b> — nu corectează nimic. Și funcționează doar dacă ambele capete rulează CDP (echipamente Cisco). Spre un PC sau un server, singurele indicii rămân <code>show interfaces</code> și <code>show interfaces status</code>. (Formatul exact al mesajului poate varia ușor între versiuni IOS.)</p>

        <h3>Cum repari</h3>
        <ol>
          <li><b>Varianta recomandată:</b> <code>speed auto</code> + <code>duplex auto</code> pe <b>ambele</b> capete.</li>
          <li>Dacă politica cere valori fixe: <b>aceleași</b> valori pe ambele capete (de ex. 100/full și 100/full).</li>
          <li>Verifici: <code>show interfaces status</code> (ambele full), <code>clear counters</code>, apoi confirmi că nu mai cresc collisions/CRC.</li>
        </ol>
      </Detailed>

      <DeepDive title="Deep dive: cum funcționează autonegocierea pe fir">
        <p>Autonegocierea (IEEE 802.3 clauza 28, pornită de la tehnologia NWay a National Semiconductor) folosește <b>FLP bursts</b> — rafale de 17 impulsuri de ceas la 125 µs distanță, între care se pot insera impulsuri de date. Împreună codifică un cuvânt de 16 biți („link code word”) cu capabilitățile: 10BASE-T half/full, 100BASE-TX half/full etc. Pulsurile sunt compatibile cu impulsurile simple de „link integrity” ale vechiului 10BASE-T, așa că un dispozitiv vechi nu se strică de la ele.</p>
        <p>Fiecare capăt alege cea mai bună tehnologie anunțată de <b>ambele</b>, după o listă de priorități fixă (de sus în jos): … 10G, 5G, 2.5G, 1000BASE-T full, 1000BASE-T half, 100BASE-TX full, …, 10BASE-T full, 10BASE-T half. La 1000BASE-T, negocierea mai stabilește și cine e <i>master</i> (dă ceasul) și cine <i>slave</i>.</p>
        <p>Pe switch-urile Cisco, half-duplex la 1 Gb/s nu e suportat: dacă încerci <code>duplex half</code> când viteza include 1000, primești o eroare de tipul <code>% Duplex cannot be set to half when speed autonegotiation subset contains 1Gbps</code>. Pentru half trebuie să cobori viteza la 100 sau 10.</p>
        <p>Nuanță față de răspunsul de examen: Cisco menționează că și pe partea half pot crește erorile FCS/alignment (cadrele pe care le primește în timp ce ea însăși „se ciocnește” ajung și ele trunchiate). În practică pot apărea CRC-uri pe ambele capete; ce rămâne specific este <b>late collisions doar pe partea half</b> și <b>runts + zero coliziuni pe partea full</b>.</p>
      </DeepDive>

      <Traps items={[
        <><b>Fix 100/full ↔ auto</b> → partea auto ajunge pe <b>100/half</b> → mismatch. Capcana nr. 1.</>,
        <>Duplex mismatch → <b>up/up</b>, ping OK, performanță proastă. NU down.</>,
        <><b>Half</b> = collisions + late collisions · <b>Full</b> = CRC + runts (zero coliziuni).</>,
        <>Configurarea manuală a vitezei pe Cisco <b>dezactivează autonegocierea</b> pe acel port.</>,
        <>Mesajul <code>%CDP-4-DUPLEX_MISMATCH</code> raportează, nu repară.</>,
      ]} />
      <InlineQuiz ids={['1.4-026', '1.4-027', '1.4-028', '1.4-032']} />
    </section>
  );
}

/* ======================================================================
   5. Speed mismatch
   ====================================================================== */
export function Speed() {
  return (
    <section id="speed" className="section">
      <SectionHead id="speed" code="1.4" title="Speed mismatch — viteze diferite, legătură oprită" />
      <Summary>
        <p>Dacă ambele capete sunt <b>fixate manual pe viteze diferite</b> (de ex. 100 vs 1000), ele codifică semnalul diferit și nu se înțeleg deloc la nivelul 1: legătura rămâne <b>down/down (notconnect)</b> pe ambele părți. Spre deosebire de duplex mismatch, aici nu există „funcționare parțială”.</p>
      </Summary>
      <Detailed>
        <p>Fiecare viteză Ethernet pe cupru folosește altă metodă de a pune biții pe fir (alte niveluri de tensiune, alt număr de perechi: 100BASE-TX folosește 2 perechi, 1000BASE-T toate 4). Un receptor setat pe 100 Mb/s pur și simplu nu poate interpreta un semnal de 1000 Mb/s — e ca și cum ai asculta un post de radio pe altă frecvență. Nu există cadre recepționate, deci nici contoare de erori; doar o legătură care nu se ridică.</p>
        <Table head={['Situație', 'Rezultat', 'De ce']} rows={[
          ['ambele auto', 'up/up la cea mai mare viteză comună', 'negociere normală'],
          ['un capăt fix 100, celălalt auto', 'up/up la 100 (dar atenție la duplex!)', 'parallel detection detectează viteza'],
          ['ambele fixate, aceeași viteză', 'up/up', '—'],
          [<b>ambele fixate, viteze diferite</b>, <b style={{ color: 'var(--bad)' }}>down/down pe ambele</b>, 'codări diferite; nimeni nu înțelege semnalul celuilalt'],
        ]} />
        <Callout kind="tip" title="Cum deosebești speed mismatch de un cablu rupt">
          Ambele dau down/down. Uită-te la configurația ambelor capete (<code>show running-config interface …</code>, <code>show interfaces status</code>): dacă la Speed vezi valori fixe diferite (<code>100</code> vs <code>1000</code>), ai găsit cauza. Testul rapid: pune <code>speed auto</code> pe un capăt — dacă legătura se ridică, nu era cablul.
        </Callout>
        <p>Un caz înrudit, mai subtil: un cablu cu <b>o pereche defectă</b> poate face ca o legătură gigabit să nu se ridice sau ca unele echipamente să negocieze o viteză mai mică (100 Mb/s are nevoie doar de 2 perechi). Dacă vezi <code>a-100</code> pe un port unde te așteptai la <code>a-1000</code>, suspectează cablul.</p>
        <p>Pe fibră, viteza e dată de transceiver (<G id="sfp" /> de 1G vs <G id="sfp-plus" /> de 10G): două module de viteze diferite la capete nu vor forma legătura.</p>
      </Detailed>
      <Traps items={[
        <><b>Speed mismatch = down/down</b>; duplex mismatch = up/up.</>,
        <>Un capăt pe auto <b>salvează</b> viteza (o detectează), dar <b>nu și duplexul</b>.</>,
        <><code>a-100</code> pe un port gigabit legat de un PC modern = suspectează cablul (o pereche defectă) sau un capăt fixat pe 100.</>,
      ]} />
      <InlineQuiz ids={['1.4-031', '1.4-007']} />
    </section>
  );
}

/* ======================================================================
   6. Defecte de cablu
   ====================================================================== */
export function Cable() {
  return (
    <section id="cable" className="section">
      <SectionHead id="cable" code="1.4" title="Defecte de cablu — lungime, sertizare, interferențe, cablu greșit" />
      <Summary>
        <p>Cablurile se strică în moduri previzibile, iar fiecare are o semnătură: <b>cablu greșit sau rupt</b> → down/down; <b>conector slăbit</b> → link care cade și revine (flap); <b>cablu prea lung, deteriorat, prost sertizat sau lângă surse de interferențe</b> → CRC în creștere.</p>
      </Summary>
      <Detailed>
        <Figure caption="Patru defecte fizice tipice și simptomul lor în show interfaces.">
          <CableFaults />
        </Figure>
        <Table head={['Defect', 'Simptom', 'Cum confirmi / repari']} rows={[
          [<>Lungime &gt; 100 m (<G id="utp" />)</>, 'CRC, link instabil, late collisions pe half-duplex', 'măsori traseul / TDR; switch intermediar sau fibră'],
          ['Sertizare proastă (perechi desfăcute, fir care nu atinge pinul)', <>CRC, frame, <G id="crosstalk" />, viteză negociată mai mică, flap</>, 're-sertizezi sau înlocuiești patch cord-ul cu unul testat'],
          [<><G id="emi" /> (motoare, cabluri de forță, balasturi)</>, 'CRC fără coliziuni', <>reorganizezi traseul, <G id="stp-cable" /> sau fibră</>],
          ['Categorie insuficientă (de ex. Cat3 la 100BASE-TX)', 'CRC („excessive noise” la Cisco)', 'Cat5e/Cat6 sau mai bun'],
          [<>Tip greșit: <G id="straight-through" /> vs <G id="crossover" /> fără <G id="auto-mdix" />, sau <G id="rollover" /> într-un port de date</>, 'down/down', 'cablul potrivit (vezi 1.3) sau activezi Auto-MDIX'],
          ['Conector slăbit / cablu strivit', 'flap: %LINK-3-UPDOWN repetat, interface resets', 'inspecție fizică, înlocuire'],
          [<>Fibră: TX/RX inversate, conectori murdari, curbură excesivă, <G id="smf" /> amestecat cu <G id="mmf" /></>, 'down/down sau CRC; putere optică mică', <>curățare, inversare perechi, verifici <G id="dom" /> cu <code>show interfaces transceiver</code></>],
          ['Port/NIC/transceiver defect', 'erori care se mută împreună cu portul', 'muți cablul pe alt port: dacă erorile rămân la port → hardware'],
        ]} />
        <Analogy>Un cablu prea lung e ca o conversație peste o curte imensă: cuvintele ajung tot mai încet și mai greu de înțeles. EMI e ca o discuție lângă un utilaj de construcții: vorbești normal, dar zgomotul îți acoperă unele cuvinte (biții corupți → CRC).</Analogy>
        <h3>De ce 100 m?</h3>
        <p>Standardul de cablare structurată (TIA-568) împarte cei 100 m în <b>90 m de cablu fix</b> (de la rack la priza din perete) și <b>10 m de patch cord-uri</b> la ambele capete. Limita vine din atenuarea semnalului și, la half-duplex, din bugetul de întârziere pentru detecția coliziunilor. Peste 100 m, unele legături „merg” — până într-o zi cu mai mult zgomot. Pe fibră, distanțele sunt de sute de metri (MMF) până la zeci de kilometri (SMF) — detaliile în 1.3.</p>
      </Detailed>
      <DeepDive title="Deep dive: testul de cablu integrat (TDR)">
        <p>Multe switch-uri Catalyst au un <G id="tdr" /> integrat. Trimite un impuls pe fiecare pereche și măsoară reflexia: o pereche întreruptă (<i>open</i>) sau în scurtcircuit (<i>short</i>) reflectă impulsul, iar din timpul de întoarcere se estimează distanța până la defect.</p>
        <pre className="mono small" style={{ background: 'var(--code-bg)', padding: '10px 12px', borderRadius: 10, overflowX: 'auto', border: '1px solid var(--border)' }}>{`SW1# test cable-diagnostics tdr interface GigabitEthernet1/0/5
SW1# show cable-diagnostics tdr interface GigabitEthernet1/0/5
Interface Speed Local pair Pair length        Remote pair Pair status
--------- ----- ---------- ------------------ ----------- --------------
Gi1/0/5   auto  Pair A     47   +/- 4  meters N/A         Open
                Pair B     112  +/- 4  meters N/A         Normal
                Pair C     112  +/- 4  meters N/A         Normal
                Pair D     112  +/- 4  meters N/A         Normal`}</pre>
        <p className="small muted">Output ilustrativ. Aici perechea A e întreruptă la ≈47 m (de exemplu un cablu strivit), iar cablul are în total ≈112 m — peste limită. Testul întrerupe pentru câteva secunde traficul pe port; nu e disponibil pe toate modelele, iar Packet Tracer nu îl simulează.</p>
      </DeepDive>
      <Traps items={[
        <>Limita pentru <b>Ethernet pe UTP este 100 m</b> (10BASE-T … 1000BASE-T; 10GBASE-T doar pe Cat6A).</>,
        <>CRC <b>fără coliziuni</b> = fizic. CRC <b>cu</b> late collisions pe celălalt capăt = duplex.</>,
        <>Cablul greșit (fără Auto-MDIX) dă <b>down/down</b>, nu erori CRC.</>,
        <>Consola folosește <b>rollover</b>; un rollover într-un port Ethernet nu dă link.</>,
      ]} />
      <InlineQuiz ids={['1.4-039', '1.4-040', '1.4-041']} />
    </section>
  );
}

/* ======================================================================
   7. Flowchart
   ====================================================================== */
export function Flow() {
  return (
    <section id="flow" className="section">
      <SectionHead id="flow" code="1.4" title="Flowchart de troubleshooting — totul într-o singură metodă" />
      <Summary>
        <p>Pune totul cap la cap: citești starea, elimini cazurile „evidente” (shutdown, err-disabled, down/down, up/down), apoi, pe o legătură up/up, citești contoarele și le încadrezi într-una din familii: <b>duplex</b>, <b>fizic</b> sau <b>congestie</b>.</p>
      </Summary>
      <Detailed>
        <Figure caption="Răspunde Da/Nu în panoul de sub diagramă sau apasă direct pe un nod. Calea parcursă rămâne evidențiată.">
          <TroubleshootFlow />
        </Figure>
        <h3>Trei reflexe de troubleshooter</h3>
        <ol>
          <li><b>Verifică ambele capete.</b> Aproape toate problemele din 1.4 (duplex, viteză, cablu greșit, encapsulare) se văd doar comparând cele două capete.</li>
          <li><b>Contoarele contează doar dacă cresc.</b> <code>clear counters</code>, aștepți, reverifici.</li>
          <li><b>Schimbă un singur lucru o dată</b> și reverifică. Altfel nu știi ce a rezolvat problema (sau ce a stricat alta).</li>
        </ol>
      </Detailed>
      <Traps items={[
        <>La întrebările de tip „care e cauza?”, caută <b>combinația</b>: stare + duplex + contorul care crește.</>,
        <>„Ping merge, dar e lent” + late collisions → duplex. „Ping merge” + output drops → congestie. „Nu merge deloc” + down/down → L1/viteză.</>,
      ]} />
      <InlineQuiz ids={['1.4-034', '1.4-020', '1.4-017']} />
    </section>
  );
}
