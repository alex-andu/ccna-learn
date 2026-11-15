import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology113, LabSoloTopology113 } from '../../diagrams/t1_13';

/* ======================================================================
   LAB GHIDAT — învățare, flooding, aging, intrare statică
   ====================================================================== */
export function GuidedLab() {
  const L = 't113g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.13-G" title="Lab ghidat — urmărește cum învață un switch (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> vezi cu ochii tăi tabela MAC goală, cum se umple în urma traficului, cum arată <G id="flooding">flooding-ul</G> în Simulation mode, cum expiră o intrare (<G id="aging" />) și cum se comportă o intrare statică; în partea a doua legi două switch-uri și observi mai multe adrese pe același uplink.
          <br /><b>Timp estimat:</b> 40–60 min · <b>Unealtă:</b> Cisco Packet Tracer (un Switch 2960 și 4 PC-uri; în partea 2 încă un switch și 2 PC-uri); merge și în GNS3/CML cu imagini de switch L2 · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia: SW1 cu PC0–PC3 (partea 1); liniile punctate (SW2, PC4, PC5) se adaugă în partea 2.">
        <LabGuidedTopology113 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă / mască', 'Conectat la']} rows={[
        ['PC0', 'FastEthernet0', '192.168.1.1 /24', 'SW1 Fa0/1'],
        ['PC1', 'FastEthernet0', '192.168.1.2 /24', 'SW1 Fa0/2'],
        ['PC2', 'FastEthernet0', '192.168.1.3 /24', 'SW1 Fa0/3'],
        ['PC3', 'FastEthernet0', '192.168.1.4 /24', 'SW1 Fa0/4'],
        ['PC4 (partea 2)', 'FastEthernet0', '192.168.1.5 /24', 'SW2 Fa0/1'],
        ['PC5 (partea 2)', 'FastEthernet0', '192.168.1.6 /24', 'SW2 Fa0/2'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer">
        Switch-urile din PT sunt simulate: formatul output-ului, intrările interne din tabelă și intervalul acceptat pentru <code>aging-time</code> pot diferi de IOS real, iar unele comenzi pot lipsi (dacă una e respinsă, încearcă forma cu liniuță <code>show mac-address-table</code> sau folosește <code>?</code>). Comenzile nu au fost testate de autorul lecției în versiunea ta. Nu configurăm nimic în afară de adresele IP și, în pașii 8–9, aging-ul și o intrare statică. Switch-urile nu au nevoie de configurare ca să comute.
      </Callout>

      <Detailed title="Partea 1 — un switch">
        <Step labKey={L} n={1} title="Construiește topologia">
          <p>Un Switch 2960 și patru PC-uri; cabluri <b>copper straight-through</b> PC → switch în ordine: PC0 → Fa0/1, PC1 → Fa0/2, PC2 → Fa0/3, PC3 → Fa0/4. Așteaptă ca toate bulinele să devină verzi.</p>
        </Step>
        <Step labKey={L} n={2} title="Configurează adresele IP pe PC-uri">
          <p>Pe fiecare PC: <i>Desktop → IP Configuration</i>, adresele din tabel și masca 255.255.255.0 (fără gateway; nu avem router).</p>
        </Step>
        <Step labKey={L} n={3} title="Tabela MAC este goală (aproape)">
          <CodeBlock title="SW1" kind="session" code={`Switch> enable
Switch# show mac address-table`} explain={[
            ['enable', 'Modul privilegiat; show mac address-table se rulează aici.'],
            ['show mac address-table', 'Nu ar trebui să existe stații învățate (pot apărea doar intrări interne). Dacă vezi stații, a existat trafic (de exemplu link-up); rulează clear mac address-table dynamic.'],
          ]} />
          <Reveal label="Întrebare: de ce e goală, deși PC-urile sunt conectate?"><p>Switch-ul învață doar din <b>cadre primite</b>. Un cablu conectat nu spune nimic despre MAC-uri; abia când o stație trimite un cadru (sursă), switch-ul o notează. Până atunci tabela rămâne goală.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Simulation mode: urmărește ARP-ul">
          <p>Din colțul din dreapta-jos: <b>Simulation</b>. În <i>Edit Filters</i> bifează doar <b>ARP</b> și <b>ICMP</b>. Pe PC0: <i>Desktop → Command Prompt</i> → <code>ping 192.168.1.2</code>. Apasă <i>Capture / Forward</i> pas cu pas.</p>
          <Reveal label="Ce ar trebui să observi">
            <ol>
              <li>PC0 trimite un <b>ARP request</b> (broadcast). Switch-ul îl <b>inundă</b>: pliculețul pleacă spre PC1, PC2, PC3, nu înapoi spre PC0.</li>
              <li>PC2 și PC3 îl ignoră; PC1 răspunde cu un <b>ARP reply unicast</b> doar către PC0 — switch-ul îl cunoaște deja pe PC0 și îl trimite pe Fa0/1.</li>
              <li>Apoi ICMP echo și echo reply circulă direct între Fa0/1 și Fa0/2, <b>fără flooding</b>.</li>
            </ol>
            <p>Dă click pe switch în timpul simulării: fila <i>OSI Model</i> / <i>PDU Information</i> descrie decizia luată de switch pentru cadru.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Citește tabela MAC acum">
          <CodeBlock title="SW1" kind="session" code={`Switch# show mac address-table
Switch# show mac address-table dynamic`} explain={[
            ['rezultat așteptat', 'Două intrări DYNAMIC: MAC-ul lui PC0 pe Fa0/1 și al lui PC1 pe Fa0/2. PC2 și PC3 NU apar — n-au trimis niciun cadru.'],
          ]} />
          <Reveal label="Întrebare: PC2 și PC3 au primit ARP request-ul. De ce nu sunt în tabelă?"><p>Au <b>primit</b> cadrul, dar nu au trimis nimic. Switch-ul învață doar din sursă, deci doar din cadrele pe care le trimit ele.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Provoacă unknown unicast">
          <p>Șterge tabela: <code>clear mac address-table dynamic</code>. Apoi, <b>fără ARP nou</b> (PC0 are încă ARP cache), pornește un nou ping PC0 → PC1 și observă în simulare. Dacă ARP cache-ul PC-ului îl ține, primul cadru unicast ICMP către PC1 va fi inundat: PC2 și PC3 îl primesc și îl ignoră.</p>
          <Reveal label="Ce demonstrează asta"><p>Destinația PC1 nu mai e în tabelă ⇒ <G id="unknown-unicast" /> ⇒ flood. Răspunsul lui PC1 îl face din nou cunoscut. Dacă PT șterge și cache-ul ARP, vei vedea mai întâi ARP broadcast.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Un ping complet între toate">
          <p>Din PC0: ping către PC2 și PC3; din PC3: ping către PC1. Apoi <code>show mac address-table</code>: acum ar trebui să vezi patru intrări.</p>
        </Step>
        <Step labKey={L} n={8} title="Aging time">
          <CodeBlock title="SW1" kind="session" code={`Switch# show mac address-table aging-time
Switch# configure terminal
Switch(config)# mac address-table aging-time 10
Switch(config)# end
Switch# show mac address-table`} explain={[
            ['show … aging-time', 'Implicit 300 s.'],
            ['aging-time 10', 'Dacă PT îl acceptă (nu am putut confirma intervalul), intrările tăcute dispar după ~10 s. Dacă e respinsă, folosește cea mai mică valoare acceptată.'],
            ['show mac address-table (după 15–20 s de pauză)', 'Intrările au expirat; următorul ping va produce din nou flooding.'],
          ]} />
          <Reveal label="De ce nu sunt ștergerile instantanee?"><p>Fiecare intrare are timerul ei, resetat de ultimul cadru primit de la stație. Expiră când trece aging time-ul fără niciun cadru.</p></Reveal>
        </Step>
        <Step labKey={L} n={9} title="Intrare statică">
          <CodeBlock title="SW1" kind="session" code={`Switch(config)# mac address-table static 00aa.aaaa.aaaa vlan 1 interface FastEthernet0/3
Switch(config)# end
Switch# show mac address-table
Switch# clear mac address-table dynamic
Switch# show mac address-table`} explain={[
            ['mac address-table static …', 'Pune manual un MAC (înlocuiește-l cu MAC-ul real al unui PC, din Desktop → IP Configuration → MAC Address, notat 00aa.aaaa.aaaa aici) pe Fa0/3.'],
            ['clear … dynamic', 'Intrarea statică supraviețuiește; cele dinamice dispar.'],
          ]} />
          <Reveal label="Ce se întâmplă dacă acel PC e de fapt pe Fa0/1?"><p>Cadrele către el sunt trimise pe Fa0/3 (unde nu e nimeni), deci ping-ul eșuează — intrarea statică nu se mută singură. Șterge-o cu <code>no mac address-table static …</code> și refă testul.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — două switch-uri">
        <Step labKey={L} n={10} title="Adaugă SW2">
          <p>Adaugă un al doilea Switch 2960, conectează <b>cross-over</b> (sau auto-MDIX) SW1 Gi0/1 ↔ SW2 Gi0/1 și PC4 → SW2 Fa0/1, PC5 → SW2 Fa0/2, cu adresele din tabel.</p>
        </Step>
        <Step labKey={L} n={11} title="Trafic între cele două părți">
          <p>Din PC0 dă ping către PC4 și PC5; din PC4 către PC1. Rulează <code>show mac address-table</code> pe ambele switch-uri.</p>
          <Reveal label="Ce ar trebui să vezi">
            <p>Pe SW1: PC0 pe Fa0/1, PC1 pe Fa0/2 și <b>PC4 și PC5 amândouă pe Gi0/1</b> (uplink). Pe SW2: PC4 și PC5 pe Fa0/1 și Fa0/2, iar PC0 și PC1 pe Gi0/1. Mai multe MAC-uri pe același port ⇒ „în spate e alt switch”.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={12} title="Întrebări de recapitulare">
          <ol>
            <li>Ce câmp al cadrului folosește switch-ul pentru learning și ce câmp pentru forwarding?</li>
            <li>De ce PC2 a primit ARP request-ul, dar nu a apărut în tabelă?</li>
            <li>Ce s-ar fi întâmplat dacă o intrare statică ar fi arătat portul greșit?</li>
            <li>Câte domenii de broadcast există cu cele două switch-uri legate? Dar domenii de coliziune?</li>
          </ol>
          <Reveal label="Răspunsuri">
            <p>1) Sursa învață; destinația decide. 2) Stația a primit, dar nu a trimis un cadru ca sursă. 3) Cadrele ar merge pe portul greșit și comunicarea ar eșua. 4) Un domeniu de broadcast (același VLAN, fără router); domenii de coliziune: câte unul pe fiecare legătură.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — trei switch-uri și un hub
   ====================================================================== */
export function SoloLab() {
  const L = 't113s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.13-S" title="Lab solo — prezice tabela MAC pe trei switch-uri și un hub" />
      <Summary>
        <p><b>Obiectiv:</b> construiești singur topologia, <b>prezici</b> conținutul fiecărei tabele MAC înainte să rulezi comenzile, apoi verifici. Descoperi unde apare <i>filtering</i> și de ce un uplink are mai multe adrese. <b>Timp:</b> 45–60 min · <b>Unealtă:</b> Packet Tracer (Hub-PT disponibil) · <b>Nivel:</b> intermediar pentru 1.13.</p>
      </Summary>
      <Figure caption="Topologia solo: trei switch-uri în lanț; un hub cu două stații pe SW-C Fa0/1.">
        <LabSoloTopology113 />
      </Figure>
      <Table head={['Stație', 'Adresă IP', 'Conectată la']} rows={[
        ['H1', '192.168.50.11 /24', 'SW-A Fa0/1'],
        ['H2', '192.168.50.12 /24', 'SW-A Fa0/2'],
        ['H3', '192.168.50.13 /24', 'SW-B Fa0/1'],
        ['H4', '192.168.50.14 /24', 'hub → SW-C Fa0/1'],
        ['H5', '192.168.50.15 /24', 'hub → SW-C Fa0/1'],
        ['Legături între switch-uri', '—', 'SW-A Gi0/1 ↔ SW-B Gi0/1; SW-B Gi0/2 ↔ SW-C Gi0/1'],
      ]} />
      <Callout kind="info" title="Reguli">
        Toate stațiile sunt în VLAN 1; nu există router. Nu configura nimic pe switch-uri în afară de nume (opțional). Comenzile nu au fost testate de autorul lecției în versiunea ta de PT.
      </Callout>
      <Detailed title="Sarcini">
        <Step labKey={L} n={1} title="Construiește și adresează">
          <p>Montează topologia din imagine și configurează adresele IP. Rulează <code>clear mac address-table dynamic</code> pe toate switch-urile.</p>
        </Step>
        <Step labKey={L} n={2} title="Prezice, apoi verifică">
          <p>Scrie pe hârtie ce MAC-uri și pe ce porturi vor apărea pe fiecare switch după ce: H1 dă ping către H3; H4 dă ping către H5; H2 dă ping către H4. Apoi rulează <code>show mac address-table</code> pe fiecare switch.</p>
          <Reveal label="Soluție (tabele așteptate)">
            <p>Intrările după cele trei ping-uri (și ARP-urile lor; MAC-urile reale ale PC-urilor diferă):</p>
            <Table head={['Switch', 'H1', 'H2', 'H3', 'H4', 'H5']} rows={[
              ['SW-A', 'Fa0/1', 'Fa0/2', 'Gi0/1', 'Gi0/1', 'nu apare'],
              ['SW-B', 'Gi0/1', 'Gi0/1', 'Fa0/1', 'Gi0/2', 'nu apare'],
              ['SW-C', 'Gi0/1', 'Gi0/1', 'nu apare', 'Fa0/1', 'Fa0/1'],
            ]} />
            <p>De ce lipsesc unele intrări: un switch învață doar din cadrele care ajung la el. ARP request-urile (broadcast) străbat toate switch-urile și le fac să învețe sursa; răspunsurile unicast ajung doar pe drumul dintre cei doi. De exemplu, H3 răspunde lui H1 unicast, deci SW-C nu-l vede niciodată, iar H5 răspunde lui H4 în spatele aceluiași port (SW-C face filter), deci nici SW-A, nici SW-B nu-l învață. H4 și H5 apar pe <b>același port</b> (Fa0/1 pe SW-C) fiindcă sunt în spatele hub-ului. Dacă ai trimis alte ping-uri, tabela ta poate avea mai multe intrări — explică fiecare diferență față de predicție.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Filtering">
          <p>În Simulation mode (filtru ICMP), trimite un ping H4 → H5. Urmărește ce face SW-C când cadrul ajunge de la hub pe Fa0/1.</p>
          <Reveal label="Ce se întâmplă">
            <p>H4 și H5 sunt în spatele aceluiași port. După ce SW-C a învățat ambele pe Fa0/1, cadrul lui H4 către H5 intră pe Fa0/1 și destinația e tot pe Fa0/1 ⇒ <b>filter</b>: switch-ul nu îl trimite nicăieri (H5 l-a primit deja prin hub). Dacă destinația ar fi necunoscută, cadrul ar fi inundat pe celelalte porturi (SW-B), dar nu înapoi pe Fa0/1.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Mutare (MAC move)">
          <p>Mută cablul lui H3 de pe SW-B Fa0/1 pe SW-A Fa0/3 (conectează-l, adresa IP rămâne). Ping H3 → H4 (cadrul trebuie să traverseze SW-A și SW-B), apoi verifică pe SW-A și SW-B unde e H3 acum.</p>
          <Reveal label="Răspuns"><p>SW-A: H3 pe Fa0/3. SW-B: H3 pe Gi0/1 (spre SW-A). Intrarea veche (Fa0/1) pe SW-B rămâne neschimbată până când un cadru al lui H3 ajunge la SW-B pe noua cale; apoi este actualizată imediat (MAC move). De aceea ping-ul către H4, care traversează SW-B, a declanșat mutarea.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Aging și statică">
          <p>Coboară aging-ul la valoarea minimă acceptată pe SW-B, așteaptă și arată că intrările dispar. Apoi adaugă o intrare statică pentru H1 pe SW-B și arată că rămâne după <code>clear mac address-table dynamic</code>.</p>
        </Step>
        <Step labKey={L} n={6} title="Explică în cuvintele tale">
          <p>Scrie 4–5 rânduri: de ce SW-B vede H1 și H2 pe același port? Câte domenii de broadcast există? Câte de coliziune?</p>
          <Reveal label="Răspuns"><p>H1 și H2 sunt în spatele aceluiași uplink (Gi0/1), deci toate cadrele lor intră pe acel port. Un singur domeniu de broadcast (toate în VLAN 1). Domenii de coliziune: fiecare legătură switch–switch, fiecare legătură switch–stație, plus unul comun pentru hub, H4 și H5 și portul Fa0/1 al lui SW-C.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
