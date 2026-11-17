import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { Dot1qFrame, DoubleTag, DtpMatrix, NativeVlanSim, TrunkWhy } from '../../diagrams/t2_2';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.2" title="Conectivitate între switch-uri — imaginea de ansamblu" />
      <Summary>
        <p>Pentru ca un VLAN să se întindă pe mai multe switch-uri, legătura dintre ele trebuie să transporte <b>mai multe VLAN-uri pe același cablu</b>. Aceasta este un <b><G id="trunk">trunk</G></b>. Standardul care o face posibil este <b><G id="dot1q">IEEE 802.1Q</G></b>: fiecare cadru primește un <b>tag de 4 octeți</b> cu VLAN ID-ul lui. Singurul VLAN care circulă <b>fără tag</b> este <b><G id="native-vlan">native VLAN</G></b>, iar valoarea lui trebuie să fie <b>aceeași la ambele capete</b>.</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial 2.2 este <i>Configure and verify interswitch connectivity</i>. Verbul este „Configure and verify”: trebuie să poți configura un trunk, să-i controlezi VLAN-urile, să-i alegi VLAN-ul nativ și să citești <code>show interfaces trunk</code>.</p>
        <Table head={['Cod Cisco', 'Tema', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['2.2.a', 'Trunk ports', 'Cum transport mai multe VLAN-uri între switch-uri? Cum negociază porturile (DTP) și cum limitez VLAN-urile permise?']
          ,
          ['2.2.b', '802.1Q', 'Cum arată tag-ul din cadru, ce câmpuri are și cum diferă de ISL?'],
          ['2.2.c', 'Native VLAN', 'Ce trafic merge fără tag, de ce trebuie să se potrivească și ce riscuri apar?'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Urmăm ordinea oficială a–c. Pentru că „trunk” și „802.1Q” sunt strâns legate, în 2.2.a vezi comportamentul trunk-ului (moduri, negociere, listă de VLAN-uri permise), iar în 2.2.b te uiți în interiorul cadrului. Native VLAN (2.2.c) încheie subiectul cu cele mai frecvente probleme.
        </Callout>

        <h3>Problema pe care o rezolvă trunk-ul</h3>
        <p>În 2.1 ai văzut că un VLAN poate exista pe mai multe switch-uri. Dar cum ajunge un cadru din VLAN 10 de pe SW1 la un PC din VLAN 10 de pe SW2? Prima soluție, „un cablu per VLAN”, funcționează, dar nu scalează: 20 de VLAN-uri înseamnă 20 de cabluri și 20 de porturi pe fiecare switch. A doua soluție: <b>un singur cablu</b> care poartă toate VLAN-urile, cu fiecare cadru <b>etichetat</b>, ca să se știe cui aparține.</p>
        <Figure caption="Interactiv: compară interconectarea cu un cablu per VLAN și cu un singur trunk 802.1Q.">
          <TrunkWhy />
        </Figure>
        <Analogy>Trunk-ul este o autostradă cu o singură bandă mare pe care circulă camioane de mai multe firme. Fiecare camion are lipită o etichetă cu numele firmei (tag-ul VLAN). La intrarea în depozit (portul access) eticheta se scoate și marfa ajunge la firma corectă. Camionul „fără etichetă” (native VLAN) este tratat ca aparținând firmei implicite: de aceea ambele depozite trebuie să fie de acord cine e „firma implicită”.</Analogy>

        <h3>Istoric: ISL și 802.1Q</h3>
        <ul>
          <li><b>ISL</b> (Inter-Switch Link) era varianta proprietară Cisco: încapsula tot cadrul original într-un antet de 26 de octeți + 4 octeți FCS la coadă. Funcționa doar între echipamente Cisco și este <b>învechit</b>.</li>
          <li><b>IEEE 802.1Q</b> este standardul deschis: inserează un tag de 4 octeți în cadru. Este folosit azi peste tot și este singurul pe majoritatea switch-urilor moderne (de aceea, comanda <code>switchport trunk encapsulation</code> lipsește pe ele).</li>
        </ul>
      </Detailed>

      <Traps items={[
        <>Trunk-ul nu „creează” VLAN-uri: VLAN-urile trebuie să existe pe fiecare switch (VLAN-urile lipsă nu trec chiar dacă sunt permise pe trunk).</>,
        <>Un port trunk <b>nu apare în show vlan brief</b>; folosești <code>show interfaces trunk</code>.</>,
        <>Cele două capete ale unui trunk trebuie să se potrivească la mod, native VLAN și VLAN-uri permise.</>,
      ]} />
      <InlineQuiz ids={['2.2-001', '2.2-003', '2.2-005']} />
    </section>
  );
}

/* ======================================================================
   2.2.a — Trunk ports
   ====================================================================== */
export function TrunkPorts() {
  return (
    <section id="trunk" className="section">
      <SectionHead id="trunk" code="2.2.a" title="Trunk ports" />
      <Summary>
        <p>Un port <b>trunk</b> transportă cadre din mai multe VLAN-uri, etichetate 802.1Q. Se configurează cu <code>switchport mode trunk</code>. Modurile <b>dynamic auto</b> / <b>dynamic desirable</b> folosesc <G id="dtp">DTP</G> ca să negocieze un trunk; <b>auto + auto dă access</b>, nu trunk. Cu <code>switchport trunk allowed vlan</code> alegi ce VLAN-uri trec; lista simplă <b>înlocuiește</b> lista veche (folosește <code>add</code> / <code>remove</code>).</p>
      </Summary>

      <Detailed title="1. Cum arată un trunk în configurare">
        <Table head={['Comandă', 'Efect']} hlCol={0} rows={[
          [<code>switchport mode trunk</code>, 'Forțează portul în trunk și îl anunță vecinului prin DTP (dacă DTP nu e oprit).'],
          [<code>switchport trunk encapsulation dot1q</code>, <>Doar pe platformele care suportă și ISL (de exemplu 3560); pe switch-uri doar 802.1Q (2960) comanda nu există. Se dă <b>înainte</b> de <code>mode trunk</code>.</>],
          [<code>switchport nonegotiate</code>, 'Oprește DTP pe port: nu mai trimite și nu mai acceptă negociere. Se folosește pe trunk-uri sau pe porturi access explicite.'],
          [<code>switchport trunk native vlan 99</code>, 'Schimbă VLAN-ul nativ (vezi 2.2.c).'],
          [<code>switchport trunk allowed vlan 10,20,99</code>, <>Setează lista VLAN-urilor permise; <b>înlocuiește complet</b> lista existentă.</>],
          [<code>switchport trunk allowed vlan add 30</code>, 'Adaugă VLAN 30 la lista existentă, fără să o șteargă.'],
          [<code>switchport trunk allowed vlan remove 20</code>, 'Scoate VLAN 20 din listă.'],
          [<><code>switchport trunk allowed vlan all</code> · <code>none</code> · <code>except 20</code></>, 'Variante: toate (implicit), niciunul sau toate în afară de 20.'],
        ]} />
        <p><b>Bună practică:</b> configurezi explicit ambele capete cu <code>switchport mode trunk</code> (și, de regulă, <code>switchport nonegotiate</code>), iar porturile spre utilizatori cu <code>switchport mode access</code>. Nu lași porturile în modul dinamic implicit.</p>
        <Callout kind="warn" title="Capcana listei „allowed”">
          Dacă rulezi <code>switchport trunk allowed vlan 30</code> pe un trunk care purta 10,20,30, ai tăiat VLAN-urile 10 și 20: lista nu se adaugă, ci se înlocuiește. Pentru modificări folosește <code>add</code> sau <code>remove</code>. Această greșeală este una dintre cele mai frecvente „am stricat producția” din practică și apare des la examen.
        </Callout>

        <h3>2. Negocierea automată: DTP</h3>
        <p><G id="dtp">DTP</G> (Dynamic Trunking Protocol) este un protocol Cisco prin care două porturi decid dacă formează un trunk. Rezultatul depinde de modurile celor două capete:</p>
        <Figure caption="Interactiv: alege modul pe fiecare switch și vezi rezultatul. Încearcă auto + auto și trunk + access.">
          <DtpMatrix />
        </Figure>
        <Table head={['Moduri', 'Ce face portul']} hlCol={0} rows={[
          [<code>switchport mode access</code>, 'Rămâne access; nu inițiază și nu acceptă trunk.'],
          [<code>switchport mode trunk</code>, 'Devine trunk și trimite cadre DTP ca să ceară și celuilalt capăt trunk.'],
          [<code>switchport mode dynamic desirable</code>, 'Cere activ trunk; devine trunk dacă celălalt capăt e trunk, desirable sau auto.'],
          [<code>switchport mode dynamic auto</code>, 'Pasiv: devine trunk doar dacă celălalt capăt o cere (trunk sau desirable). Implicit pe Catalyst moderne.'],
        ]} />
        <Callout kind="exam" title="Regula de aur DTP">
          <b>Cel puțin un capăt trebuie să fie „activ”</b> (trunk sau desirable) ca să existe trunk. <b>auto + auto = access</b>, nu trunk: niciunul nu cere. <b>trunk + access</b> este o <b>nepotrivire</b> (mismatch): legătura nu funcționează corect. Port <b>trunk</b> cu <code>nonegotiate</code> și celălalt <b>dynamic auto</b>: nu se formează trunk, pentru că auto așteaptă DTP care nu mai vine.
        </Callout>
        <p>De ce se oprește DTP în practică? Pentru că un port dinamic poate deveni trunk la cererea unui atacator care se conectează (<i>switch spoofing</i>): obține acces la toate VLAN-urile. Pe porturile spre utilizatori setezi <code>mode access</code>; pe trunk-uri setezi <code>mode trunk</code> + <code>nonegotiate</code>.</p>
      </Detailed>

      <Detailed title="3. Verificarea unui trunk">
        <Table head={['Comandă', 'Ce arată']} hlCol={0} rows={[
          [<code>show interfaces trunk</code>, 'Porturile trunk: mod, encapsulare, stare, VLAN nativ; apoi lista VLAN-urilor permise, a celor permise și active, și a celor în forwarding STP.'],
          [<code>show interfaces gi0/1 switchport</code>, 'Administrative Mode / Operational Mode, Trunking Encapsulation, Native VLAN, Negotiation of Trunking, listele allowed.'],
          [<code>show interfaces gi0/1 trunk</code>, 'Același raport, doar pentru un port.'],
          [<code>show vlan brief</code>, 'NU arată trunk-uri (doar porturi access).'],
        ]} />
        <p>În <code>show interfaces trunk</code> sunt trei liste de VLAN-uri, pe care le citești în ordine:</p>
        <ol>
          <li><b>Vlans allowed on trunk</b> — ce permite configurația (implicit 1–4094).</li>
          <li><b>Vlans allowed and active in management domain</b> — dintre cele permise, cele care <b>există</b> efectiv pe switch (create).</li>
          <li><b>Vlans in spanning tree forwarding state and not pruned</b> — cele care chiar trec acum (STP în forwarding, necurățate de VTP pruning).</li>
        </ol>
        <p>Dacă un VLAN lipsește din lista a doua, probabil nu a fost <b>creat</b> pe acest switch; dacă lipsește din prima, ai tăiat-o în allowed list; dacă lipsește din a treia, STP îl blochează pe acest trunk.</p>
      </Detailed>

      <Traps items={[
        <><code>allowed vlan 30</code> fără <code>add</code> înlocuiește lista; folosește <code>add</code> / <code>remove</code>.</>,
        <><b>auto + auto = access.</b> Fără un capăt activ (trunk sau desirable) nu există trunk.</>,
        <><b>trunk + access</b> este mismatch: nu e „trunk pe o parte, access pe alta, merge cumva”.</>,
        <>Comanda <code>switchport trunk encapsulation dot1q</code> nu există pe switch-urile care suportă doar 802.1Q și trebuie dată <b>înainte</b> de <code>mode trunk</code> pe cele care suportă ISL.</>,
        <>Un VLAN permis pe trunk dar <b>neexistent</b> pe switch nu trece traficul (apare în prima listă, nu în a doua din show interfaces trunk).</>,
        <>DTP nu negociază după <code>switchport nonegotiate</code>; verifică ambele capete.</>,
      ]} />
      <InlineQuiz ids={['2.2-007', '2.2-010', '2.2-013', '2.2-015']} />
    </section>
  );
}

/* ======================================================================
   2.2.b — 802.1Q
   ====================================================================== */
export function Dot1q() {
  return (
    <section id="dot1q" className="section">
      <SectionHead id="dot1q" code="2.2.b" title="802.1Q" />
      <Summary>
        <p><G id="dot1q">802.1Q</G> inserează în cadrul Ethernet un <b>tag de 4 octeți</b> imediat după adresa MAC sursă: <b><G id="tpid">TPID</G></b> (0x8100, 2 octeți) și <b>TCI</b> (2 octeți) = <b>PCP</b> 3 biți (prioritate/CoS) + <b>DEI</b> 1 bit + <b>VID</b> 12 biți (VLAN ID, 1–4094). Cadrul crește la maximum <b>1522 octeți</b>, iar FCS-ul se recalculează. Standardul e deschis; ISL, varianta Cisco mai veche, este învechit.</p>
      </Summary>

      <Detailed title="1. Câmpurile tag-ului">
        <Figure caption="Click pe un câmp ca să vezi ce face. Comută între cadrul fără tag și cel cu tag și observă cei 4 octeți adăugați.">
          <Dot1qFrame />
        </Figure>
        <Table head={['Câmp', 'Mărime', 'Rol']} hlCol={0} rows={[
          [<G id="tpid" />, '16 biți', 'Valoarea 0x8100 care ocupă poziția EtherType-ului și spune „urmează un tag 802.1Q”.'],
          [<G id="pcp">PCP / CoS</G>, '3 biți', 'Prioritate 0–7 (QoS, 802.1p); vocea folosește de regulă 5.'],
          ['DEI', '1 bit', 'Marchează cadrele care pot fi aruncate la congestie (fostul CFI).'],
          ['VID', '12 biți', 'VLAN ID: 1–4094 utilizabile; 0 = doar prioritate; 4095 = rezervat.'],
        ]} />
        <p>Observă consecințele: cu 12 biți există 4096 valori, din care 4094 se pot folosi ca VLAN-uri (0 și 4095 sunt rezervate). De aici „4094 VLAN-uri” din documentație.</p>

        <h3>2. Ce face switch-ul cu tag-ul, pas cu pas</h3>
        <ol>
          <li><b>Intrare pe port access:</b> cadrul vine fără tag; switch-ul îl asociază VLAN-ului portului.</li>
          <li><b>Ieșire pe trunk:</b> switch-ul <b>inserează</b> tag-ul 802.1Q cu VID-ul VLAN-ului (dacă VLAN-ul nu e native) și <b>recalculează FCS</b>.</li>
          <li><b>Intrare pe trunk:</b> switch-ul citește VID-ul din tag și tratează cadrul ca aparținând acelui VLAN (învață MAC-ul în tabela VLAN-ului). Dacă cadrul vine <b>fără</b> tag, îl asociază <b>native VLAN-ului</b>.</li>
          <li><b>Ieșire pe port access:</b> switch-ul <b>scoate</b> tag-ul și trimite cadrul simplu.</li>
        </ol>
        <p>Hosturile nu văd niciodată tag-ul. Excepții: dispozitive care vorbesc 802.1Q (telefon IP, server virtualizat cu mai multe VLAN-uri, routerul din router-on-a-stick).</p>

        <h3>3. Efecte practice</h3>
        <ul>
          <li><b>MTU:</b> cadrul tagat poate avea 1522 octeți. Echipamentele moderne acceptă asta („baby giants”); un echipament vechi care limitează la 1518 poate arunca cadre mari.</li>
          <li><b>Tabelă MAC per VLAN:</b> aceeași adresă MAC poate apărea în VLAN-uri diferite; tabela este (VLAN, MAC, port) — vezi 1.13.</li>
          <li><b>Un switch aplică QoS</b> pe baza PCP din tag (în scopul acestui obiectiv, doar câmpul și rolul lui).</li>
        </ul>
        <DeepDive title="802.1Q versus ISL — comparație">
          <Table head={['', '802.1Q', 'ISL']} hlCol={0} rows={[
            ['Standard', 'IEEE (deschis)', 'Cisco proprietar'],
            ['Metodă', 'Inserează tag de 4 octeți în cadru', 'Încapsulează întregul cadru: antet de 26 B + FCS de 4 B'],
            ['Cadre din VLAN nativ', 'Fără tag', 'Toate cadrele sunt etichetate (nu există nativ în același sens)'],
            ['Suport azi', 'Universal', 'Învechit; absent pe majoritatea platformelor noi'],
          ]} />
          <p>Detaliile de câmp ale ISL nu se cer; la examen e important că ISL este proprietar și învechit, iar 802.1Q este standardul.</p>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>Tag-ul 802.1Q are <b>4 octeți</b> (nu 2 și nu 8): TPID 2 + TCI 2.</>,
        <>VLAN ID are <b>12 biți</b> (1–4094 utilizabile); PCP are 3 biți; DEI 1 bit. Nu confunda 12 biți cu 4096 VLAN-uri utilizabile.</>,
        <>Cadrul maxim cu tag este <b>1522</b> octeți (nu 1518).</>,
        <>Tag-ul se inserează <b>după adresa MAC sursă</b>, înainte de EtherType, nu la sfârșit.</>,
        <>Cadrele din <b>native VLAN</b> circulă <b>fără tag</b> pe trunk (cu 802.1Q).</>,
      ]} />
      <InlineQuiz ids={['2.2-017', '2.2-019', '2.2-022', '2.2-024']} />
    </section>
  );
}

/* ======================================================================
   2.2.c — Native VLAN
   ====================================================================== */
export function NativeVlan() {
  return (
    <section id="native" className="section">
      <SectionHead id="native" code="2.2.c" title="Native VLAN" />
      <Summary>
        <p><G id="native-vlan">Native VLAN</G> este singurul VLAN ale cărui cadre circulă <b>fără tag</b> pe un trunk 802.1Q (implicit <b>VLAN 1</b>). Un cadru primit pe trunk fără tag este asociat native VLAN-ului. Valoarea trebuie să fie <b>identică la ambele capete</b>: o nepotrivire face traficul să „treacă” dintr-un VLAN în altul și produce mesaje <code>%CDP-4-NATIVE_VLAN_MISMATCH</code>. Bună practică: un native VLAN dedicat și neutilizat (de exemplu 999), nu VLAN 1.</p>
      </Summary>

      <Detailed title="1. De ce există native VLAN">
        <p>Native VLAN a apărut pentru <b>compatibilitate</b>: unele echipamente vechi (hub-uri, dispozitive fără 802.1Q) nu înțeleg tag-uri. Pentru ele, un cadru netaggat trebuie să aibă un VLAN implicit. Regula: <b>fiecare trunk are un native VLAN</b>; cadrele lui pleacă netaggate, iar cele netaggate care sosesc sunt atribuite lui.</p>
        <Table head={['Situație', 'Ce se întâmplă']} hlCol={0} rows={[
          ['Cadru din VLAN 10 pleacă pe trunk (native = 1)', 'Primește tag VID 10.'],
          ['Cadru din VLAN 1 (native) pleacă pe trunk', 'Pleacă FĂRĂ tag.'],
          ['Cadru netaggat sosește pe trunk', 'Este atribuit native VLAN-ului portului.'],
        ]} />
        <p>Schimbarea: <code>switchport trunk native vlan 99</code> pe portul trunk (ambele capete!). Verificare: <code>show interfaces trunk</code> (coloana „Native vlan”) sau <code>show interfaces gi0/1 switchport</code> (linia „Trunking Native Mode VLAN”).</p>
        <Figure caption="Interactiv: alege native VLAN-ul pe fiecare capăt al trunk-ului. Observă ce se întâmplă când valorile diferă.">
          <NativeVlanSim />
        </Figure>
      </Detailed>

      <Detailed title="2. Nepotrivirea native VLAN (mismatch)">
        <p>Dacă SW1 are native VLAN 1, iar SW2 are native VLAN 99, un cadru din VLAN 1 trimis de SW1 pleacă fără tag și este primit de SW2 ca aparținând VLAN-ului 99. Rezultate:</p>
        <ul>
          <li><b>Scurgere între VLAN-uri:</b> traficul unui VLAN apare în altul, fără router; poate trece de politicile de securitate.</li>
          <li><b>Mesaje de avertizare:</b> CDP detectează diferența și produce <code>%CDP-4-NATIVE_VLAN_MISMATCH</code> (și, în PVST+, pot apărea mesaje STP privind PVID inconsistent).</li>
          <li><b>Probleme de conectivitate</b> pentru hosturile din VLAN-urile implicate.</li>
        </ul>
        <Callout kind="tip" title="Cum depanezi rapid">
          1) Citești logul: mesajul CDP spune ce porturi și ce VLAN-uri sunt implicate. 2) <code>show interfaces trunk</code> pe ambele switch-uri: comparați coloana „Native vlan”. 3) Potrivești valorile cu <code>switchport trunk native vlan N</code> pe ambele capete.
        </Callout>

        <h3>3. Native VLAN și securitatea: VLAN hopping</h3>
        <p><G id="vlan-hopping">VLAN hopping</G> înseamnă să ajungi într-un VLAN la care nu ai acces. Două variante:</p>
        <ul>
          <li><b>Switch spoofing:</b> atacatorul convinge un port dinamic să devină trunk (folosind DTP) și primește toate VLAN-urile. Prevenire: <code>switchport mode access</code> pe porturile utilizatorilor, <code>switchport nonegotiate</code> pe trunk-uri.</li>
          <li><b>Double tagging:</b> atacatorul se află în native VLAN și trimite cadre cu <b>două tag-uri</b>. Primul switch scoate tag-ul exterior (VLAN nativ, fără tag) și trimite cadrul pe trunk cu tag-ul interior; al doilea switch îl livrează în VLAN-ul victimei. Atacul este <b>unidirecțional</b> (nu există răspuns).</li>
        </ul>
        <Figure caption="Double tagging: tag-ul exterior (native) este scos de primul switch; tag-ul interior duce cadrul în VLAN 20.">
          <DoubleTag />
        </Figure>
        <p><b>Măsuri de protecție:</b> (1) schimbă native VLAN-ul într-un VLAN <b>neutilizat</b>, fără hosturi (de exemplu 999); (2) nu pune niciun port de utilizator în native VLAN; (3) setează explicit porturile access; (4) permite pe trunk doar VLAN-urile necesare; (5) opțional, pe platformele care o suportă, <code>vlan dot1q tag native</code> (global) face ca și cadrele native să fie etichetate.</p>

        <h3>4. Native VLAN și router-on-a-stick</h3>
        <p>Dacă trunk-ul spre router are native VLAN 99, subinterfața care servește acel VLAN se configurează <code>encapsulation dot1Q 99 native</code>. Dacă routerul nu știe că 99 e nativ, cadrele netaggate nu corespund niciunei subinterfețe. (Alternativ, adresa IP a VLAN-ului nativ se poate pune pe interfața fizică.)</p>
        <DeepDive title="Native VLAN, VLAN 1 și traficul de control">
          <p>Pe un trunk, protocoalele de control Cisco (CDP, DTP, VTP, PAgP) circulă tradițional în VLAN 1. Dacă schimbi native VLAN-ul în 999, VLAN 1 poate continua să transporte aceste cadre (cu tag), iar VLAN 999 nu are hosturi. De aceea „VLAN 1 nu mai e nativ” nu înseamnă „VLAN 1 dispare”. Unele organizații scot VLAN 1 din listele allowed; fă asta doar când înțelegi ce transportă și cu testare, pentru că poate afecta protocoale de control.</p>
        </DeepDive>
      </Detailed>

      <Traps items={[
        <>Native VLAN trebuie să fie <b>același la ambele capete</b>; mismatch ⇒ scurgere între VLAN-uri și mesaje CDP.</>,
        <>Cadrele din native VLAN circulă <b>fără tag</b>; celelalte au tag.</>,
        <>Valoarea implicită este <b>VLAN 1</b>; nu înseamnă că e și cea recomandată.</>,
        <>Native VLAN ≠ VLAN de management ≠ default VLAN: pot coincide, dar sunt concepte diferite.</>,
        <>Double tagging funcționează doar când atacatorul este în native VLAN-ul trunk-ului; mitigarea cheie e un native VLAN neutilizat.</>,
        <>La ROAS cu native ≠ 1 uitarea cuvântului <code>native</code> pe subinterfață rupe traficul netaggat.</>,
      ]} />
      <InlineQuiz ids={['2.2-027', '2.2-029', '2.2-032', '2.2-034']} />
    </section>
  );
}
