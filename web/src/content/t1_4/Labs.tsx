import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabGuidedTopology14, LabSoloTopology14 } from '../../diagrams/t1_4';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 'g14';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.4-G" title="Lab ghidat — stricăm o legătură în cinci feluri (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> provoci intenționat cele mai frecvente probleme de interfață — shutdown, duplex mismatch, speed mismatch, cablu greșit, err-disabled — și înveți cum arată fiecare în <code>show interfaces</code>, <code>show interfaces status</code>, <code>show ip interface brief</code> și în mesajele de consolă.
          <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat: două switch-uri 2960 legate prin Fa0/24, câte un PC pe fiecare.">
        <LabGuidedTopology14 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Note']} rows={[
        ['PC1', 'FastEthernet0', '192.168.1.11/24', 'cablu straight-through la SW1 Fa0/1'],
        ['PC2', 'FastEthernet0', '192.168.1.12/24', 'cablu straight-through la SW2 Fa0/1'],
        ['SW1 (2960)', 'Fa0/24 ↔ SW2 Fa0/24', '—', 'cablu crossover (Copper Cross-Over)'],
        ['SW2 (2960)', 'Fa0/24 ↔ SW1 Fa0/24', '—', 'toate porturile în VLAN 1'],
      ]} />
      <Callout kind="warn" title="Ce simulează Packet Tracer și ce NU">
        Packet Tracer modelează bine <b>stările</b> interfețelor (up/down, administratively down, err-disabled), LED-urile legăturii, comenzile <code>speed</code>/<code>duplex</code>, mesajele <G id="cdp" /> și port security.
        <b> Nu</b> simulează fizica: contoarele <b>CRC, runts, collisions, late collision</b> rămân de obicei la 0 chiar și cu un duplex mismatch, iar lungimea cablului, EMI și sertizarea nu există. De asemenea, comportamentul exact al negocierii (auto vs. fix) poate diferi de un switch real în funcție de versiunea PT.
        Pentru contoare folosește output-ul adnotat din lecție. <b>GNS3/CML/EVE-NG</b> (IOSvL2) au aceeași limită: legăturile sunt virtuale, deci nu apar erori fizice reale; poți exersa comenzile, dar erorile de cablu se văd doar pe echipamente reale.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Construiește topologia și verifică baza">
          <p>Plasează 2 switch-uri <b>2960</b> și 2 <b>PC</b>-uri. Conexiuni: PC1 → SW1 <code>Fa0/1</code> și PC2 → SW2 <code>Fa0/1</code> cu <b>Copper Straight-Through</b>; SW1 <code>Fa0/24</code> → SW2 <code>Fa0/24</code> cu <b>Copper Cross-Over</b>. Pe PC-uri: <P>Desktop → IP Configuration</P> → adresele din tabel.</p>
          <p>Așteaptă ca LED-urile să devină verzi (switch-urile rulează STP ≈30 s), apoi din PC1: <code>ping 192.168.1.12</code> → trebuie să meargă.</p>
          <Reveal label="LED-urile rămân portocalii?"><p>Portocaliu = portul e în stările de pornire STP (listening/learning). Așteaptă ≈30 de secunde. Detalii în 2.5.</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Fotografia „stării sănătoase” (baseline)">
          <CodeBlock title="SW1 — CLI" kind="session" code={`Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
SW1(config)# end
SW1# show interfaces status
SW1# show interfaces fastEthernet0/24
SW1# show cdp neighbors`} explain={[
            ['show interfaces status', 'Notează pentru Fa0/24: Status connected, Duplex a-full, Speed a-100. „a-” = negociat.'],
            ['show interfaces fastEthernet0/24', 'Citește: up/up, Full-duplex, 100Mb/s, contoarele (toate 0 în PT).'],
            ['show cdp neighbors', 'SW2 apare ca vecin pe Fa0/24 — CDP funcționează, deci va putea semnala un mismatch.'],
          ]} />
          <p>Fă la fel pe SW2 (<code>hostname SW2</code>). Păstrează aceste valori: le vei compara cu fiecare defect.</p>
        </Step>
        <Step labKey={L} n={3} title="Defectul 1 — shutdown">
          <CodeBlock title="SW2" code={`SW2(config)# interface fastEthernet0/24
SW2(config-if)# shutdown`} kind="session" explain={[
            ['shutdown', 'Oprește administrativ portul lui SW2.'],
          ]} />
          <p>Compară: <code>show ip interface brief | include 0/24</code> pe <b>ambele</b> switch-uri și <code>show interfaces status</code>.</p>
          <Reveal label="Ce ar trebui să vezi?"><ul>
            <li>SW2: <code>administratively down / down</code> · status <code>disabled</code>.</li>
            <li>SW1: <code>down / down</code> · status <code>notconnect</code> — SW1 nu știe <i>de ce</i> nu mai are partener, doar că nu îl mai vede.</li>
            <li>Consola SW1: <code>%LINK-3-UPDOWN … changed state to down</code>. Ping-ul PC1 → PC2 eșuează.</li>
          </ul><p><b>Lecția:</b> „administratively down” apare doar pe capătul unde s-a dat comanda. Cealaltă parte vede un simplu down/down — de aceea verifici mereu ambele capete.</p></Reveal>
          <p>Repară: pe SW2 <code>no shutdown</code>. Observă ordinea mesajelor: întâi <code>%LINK-3-UPDOWN</code> (L1), apoi <code>%LINEPROTO-5-UPDOWN</code> (L2).</p>
        </Step>
        <Step labKey={L} n={4} title="Defectul 2 — duplex mismatch (un capăt hard-codat)">
          <CodeBlock title="SW1 — fixăm doar un capăt" code={`SW1(config)# interface fastEthernet0/24
SW1(config-if)# speed 100
SW1(config-if)# duplex full
SW1(config-if)# end
SW1# show interfaces status`} kind="session" explain={[
            ['speed 100 / duplex full', 'SW1 nu mai negociază. SW2 a rămas pe auto.'],
            ['show interfaces status', 'Pe SW1: full / 100 (fără „a-”). Apoi pe SW2: teoretic a-half / a-100 (parallel detection → half).'],
          ]} />
          <p>Uită-te pe SW2: <code>show interfaces status</code> și <code>show interfaces fa0/24 | include duplex</code>. Așteaptă un minut și urmărește consola ambelor switch-uri.</p>
          <Reveal label="SW2 arată tot a-full? (posibil în unele versiuni PT)"><p>Unele versiuni de Packet Tracer nu modelează parallel detection exact ca un switch real. Forțează atunci mismatch-ul și pe SW2: <code>interface fa0/24</code> → <code>speed 100</code> → <code>duplex half</code>. Pe un echipament real, simpla fixare a lui SW1 ar fi fost suficientă.</p></Reveal>
          <Reveal label="Ce ar trebui să vezi?"><ul>
            <li>Ambele porturi rămân <b>up/up</b>, LED verde. <code>ping</code> PC1 → PC2 <b>merge</b>.</li>
            <li>La fiecare ≈60 s (intervalul CDP) apare pe consolă <code>%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on FastEthernet0/24 (not half duplex), with SW2 FastEthernet0/24 (half duplex).</code></li>
            <li>Contoarele collisions / late collision / CRC rămân probabil 0 în PT — pe un switch real, SW2 (half) ar număra late collisions, iar SW1 (full) CRC și runts.</li>
          </ul><p><b>Lecția:</b> mismatch-ul nu oprește legătura. Fără CDP și fără contoare, ai putea crede că totul e în regulă.</p></Reveal>
          <Reveal label="Întrebare: dacă în locul lui SW2 ar fi fost un PC, ai fi primit mesajul CDP?"><p>Nu. CDP rulează pe echipamente Cisco (și pe unele telefoane IP). Un PC obișnuit nu trimite CDP, deci singurele indicii ar fi <code>a-half</code> pe portul switch-ului și contoarele (pe echipament real).</p></Reveal>
          <p>Repară corect: pe <b>ambele</b> switch-uri, pe Fa0/24: <code>speed auto</code> și <code>duplex auto</code>. Verifică din nou <code>show interfaces status</code>: <code>a-full a-100</code> pe ambele, mesajele CDP încetează.</p>
        </Step>
        <Step labKey={L} n={5} title="Defectul 3 — speed mismatch">
          <CodeBlock title="SW1 și SW2" code={`SW1(config)# interface fastEthernet0/24
SW1(config-if)# speed 10
SW2(config)# interface fastEthernet0/24
SW2(config-if)# speed 100`} kind="session" explain={[
            ['speed 10 (SW1)', 'SW1 fixat la 10 Mb/s.'],
            ['speed 100 (SW2)', 'SW2 fixat la 100 Mb/s. Ambele fixate, viteze diferite.'],
          ]} />
          <Reveal label="Ce ar trebui să vezi?"><ul>
            <li>Link-ul devine roșu: <b>down/down</b>, status <code>notconnect</code> pe ambele.</li>
            <li>Ping-ul eșuează. Niciun mesaj CDP (nu mai există comunicare).</li>
            <li>Dacă PT ține totuși link-ul verde, notează: pe echipament real ar fi down/down — PT nu modelează fidel codarea semnalului.</li>
          </ul><p><b>Lecția:</b> diferența fundamentală față de pasul 4 — viteza diferită = <b>down</b>; duplexul diferit = <b>up</b>, dar „bolnav”.</p></Reveal>
          <p>Repară: <code>speed auto</code> și <code>duplex auto</code> pe ambele capete.</p>
        </Step>
        <Step labKey={L} n={6} title="Defectul 4 — cablu de tip greșit">
          <p>Șterge cablul crossover dintre switch-uri (unealta <b>Delete</b>) și pune un <b>Copper Straight-Through</b> între aceleași porturi Fa0/24.</p>
          <Reveal label="Ce ar trebui să vezi?"><ul>
            <li>Dacă link-ul rămâne <b>roșu</b> (down/down): PT tratează switch-ul ca MDI-X clasic — un straight-through între două dispozitive de același tip pune TX pe TX.</li>
            <li>Dacă link-ul devine <b>verde</b>: versiunea ta de PT simulează <G id="auto-mdix" /> (porturile se adaptează singure). Poți încerca <code>no mdix auto</code> pe ambele porturi (comanda poate cere <code>speed</code>/<code>duplex</code> pe auto) ca să vezi comportamentul clasic.</li>
          </ul><p><b>Lecția:</b> cablul greșit produce <b>down/down</b>, nu erori CRC. Pe switch-urile moderne Auto-MDIX ascunde de obicei problema.</p></Reveal>
          <p>Repară: pune înapoi cablul crossover. Verifică ping-ul.</p>
        </Step>
        <Step labKey={L} n={7} title="Defectul 5 — err-disabled (previzualizare port security)">
          <CodeBlock title="SW1 — port security cu un MAC „greșit”" code={`SW1(config)# interface fastEthernet0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security mac-address 0000.1111.2222
SW1(config-if)# end`} kind="session" explain={[
            ['switchport mode access', 'Port security se poate activa doar pe un port configurat explicit ca access.'],
            ['switchport port-security', 'Activează port security: implicit maximum 1 MAC, acțiunea la încălcare = shutdown (err-disabled).'],
            ['… mac-address 0000.1111.2222', 'Singurul MAC permis — nu e al lui PC1, deci primul cadru de la PC1 va fi o încălcare.'],
          ]} />
          <p>Din PC1: <code>ping 192.168.1.12</code>. Apoi pe SW1: <code>show interfaces status</code>, <code>show interfaces fa0/1</code>, <code>show interfaces status err-disabled</code>.</p>
          <Reveal label="Ce ar trebui să vezi?"><ul>
            <li>Consola: <code>%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/1, putting Fa0/1 in err-disable state</code>.</li>
            <li><code>show interfaces fa0/1</code>: <code>down, line protocol is down (err-disabled)</code>. <code>show interfaces status</code>: <code>err-disabled</code>.</li>
            <li><code>show ip interface brief</code> arată doar down/down — de aceea e mai util <code>show interfaces status</code>.</li>
          </ul></Reveal>
          <p>Repară în ordinea corectă: întâi cauza (<code>no switchport port-security mac-address 0000.1111.2222</code> și <code>no switchport port-security</code>), apoi <code>shutdown</code> + <code>no shutdown</code> pe Fa0/1. Verifică ping-ul.</p>
          <Reveal label="Ce se întâmplă dacă dai shutdown/no shutdown fără să elimini cauza?"><p>Portul revine, PC1 trimite din nou un cadru cu MAC-ul lui, port security îl detectează și portul cade imediat din nou în err-disabled. Aceeași logică și cu <code>errdisable recovery</code>: reactivarea automată nu repară cauza.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Recapitulare — completează tabelul în notițe">
          <p>Pentru fiecare defect notează: starea pe SW1, starea pe SW2, ce arată <code>show interfaces status</code>, merge ping-ul?, ce mesaj a apărut pe consolă.</p>
        </Step>
      </Detailed>
      <Reveal label="Soluție — tabelul completat">
        <Table head={['Defect', 'Capătul cu defectul', 'Celălalt capăt', 'Ping', 'Indiciu principal']} rows={[
          ['shutdown pe SW2', 'administratively down / down · disabled', 'down / down · notconnect', 'nu', 'cuvântul „administratively”'],
          ['duplex mismatch', 'up/up · full 100 (fix)', 'up/up · a-half a-100', 'da', '%CDP-4-DUPLEX_MISMATCH (pe real: late collisions / CRC + runts)'],
          ['speed mismatch', 'down/down · notconnect', 'down/down · notconnect', 'nu', 'valori fixe diferite la Speed'],
          ['cablu greșit (fără Auto-MDIX)', 'down/down · notconnect', 'down/down · notconnect', 'nu', 'tipul cablului (vezi 1.3)'],
          ['port security', 'down/down (err-disabled) · err-disabled', 'PC1: fără conectivitate', 'nu', '%PM-4-ERR_DISABLE + Reason psecure-violation'],
        ]} />
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — tichete
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.4-S" title="Lab solo — patru tichete de la helpdesk" />
      <Summary>
        <p><b>Scenariu:</b> ești noul administrator. Rețeaua de mai jos a fost „configurată” de cineva grăbit, iar la helpdesk au sosit patru tichete. Construiești topologia, rulezi scriptul de defectare (fără să-l studiezi!), apoi rezolvi tichetele doar cu comenzi <code>show</code>.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Packet Tracer · <b>Nivel:</b> începător+</p>
      </Summary>
      <Figure caption="Topologia labului solo. Toate dispozitivele sunt în VLAN 1, rețeaua 192.168.10.0/24, gateway 192.168.10.1 (R1).">
        <LabSoloTopology14 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Conexiune', 'Adresă']} rows={[
        ['R1 (2911)', 'G0/0', 'SW-CORE Fa0/1 (straight-through)', '192.168.10.1/24'],
        ['SW-CORE (2960)', 'Gi0/1', 'SW-A Gi0/1 (crossover)', '—'],
        ['SW-CORE (2960)', 'Fa0/2', 'SW-B Fa0/24 (crossover)', '—'],
        ['SW-A (2960)', 'Fa0/1', 'PC-A1', '—'],
        ['SW-B (2960)', 'Fa0/1 / Fa0/2', 'PC-B1 / PC-B2', '—'],
        ['PC-A1 · PC-B1 · PC-B2', 'Fa0', '—', '.11 · .21 · .22 /24, GW .1'],
      ]} />
      <Detailed title="Pregătire">
        <ol>
          <li>Construiește topologia, configurează adresele și pe R1: <code>interface g0/0</code> → <code>ip address 192.168.10.1 255.255.255.0</code> → <code>no shutdown</code>.</li>
          <li>Verifică faptul că toate PC-urile fac ping la 192.168.10.1. Salvează fișierul ca <code>lab14-ok.pkt</code> (copie de rezervă).</li>
          <li>Deschide scriptul de defectare, copiază fiecare bloc în CLI-ul dispozitivului indicat, apoi <b>închide-l fără să-l citești în detaliu</b>.</li>
        </ol>
        <Reveal label="Scriptul de defectare (rulează-l, apoi închide-l)">
          <CodeBlock title="SW-A" code={`enable
configure terminal
interface fastEthernet0/1
 shutdown
interface gigabitEthernet0/1
 speed 100
end`} />
          <CodeBlock title="SW-CORE" code={`enable
configure terminal
interface gigabitEthernet0/1
 speed 10
interface fastEthernet0/2
 speed 100
 duplex half
end`} />
          <CodeBlock title="SW-B" code={`enable
configure terminal
interface fastEthernet0/24
 speed 100
 duplex full
interface fastEthernet0/2
 switchport mode access
 switchport port-security
 switchport port-security mac-address 0001.0001.0001
end`} />
          <p className="small muted">După rulare, din PC-B2 dă un <code>ping 192.168.10.1</code> (ca să „declanșeze” tichetul 4), apoi închide acest bloc.</p>
        </Reveal>
      </Detailed>
      <Detailed title="Tichetele">
        <Table head={['#', 'Raportat de', 'Descrierea utilizatorului']} rows={[
          ['1', 'PC-A1 (contabilitate)', '„De azi-dimineață calculatorul zice că nu e conectat niciun cablu.”'],
          ['2', 'PC-A1 (după ce ai rezolvat #1)', '„Acum Windows zice că e conectat, dar tot nu ajung la server și nici la internet.”'],
          ['3', 'PC-B1 (marketing)', '„Internetul merge, dar copierea fișierelor mari pe server durează o veșnicie.” (pe un echipament real; în PT ping-ul merge)'],
          ['4', 'PC-B2 (coleg nou)', '„Ieri în priza asta mergea laptopul vechi. Laptopul meu nou nu are deloc rețea.”'],
        ]} />
        <p><b>Cerințe:</b> pentru fiecare tichet (1) identifică dispozitivul și interfața cu problema, (2) scrie cauza în termenii din 1.4, (3) repară respectând recomandările Cisco, (4) verifică. Folosește doar comenzi <code>show</code> pentru diagnostic — nu <code>show running-config</code> până nu ai o ipoteză.</p>
        <Callout kind="tip" title="Indicii (deschide doar dacă te blochezi)">
          <Reveal label="Indiciul general"><p>Pe fiecare switch, prima comandă: <code>show interfaces status</code>. Uită-te la coloanele Status, Duplex, Speed. Apoi urmărește consola: unele probleme se anunță singure.</p></Reveal>
          <Reveal label="Indiciu tichet 2"><p>Rezolvarea tichetului 1 a adus PC-A1 până la SW-A. Mai departe, traficul trece prin uplink-ul SW-A ↔ SW-CORE. Compară Speed la ambele capete.</p></Reveal>
          <Reveal label="Indiciu tichet 3"><p>Link-ul SW-CORE ↔ SW-B e up/up. Ce mesaj apare periodic pe consolă? Compară coloana Duplex la ambele capete.</p></Reveal>
          <Reveal label="Indiciu tichet 4"><p>Ce Status are SW-B Fa0/2? Ce spune coloana Reason în <code>show interfaces status err-disabled</code>?</p></Reveal>
        </Callout>
      </Detailed>
      <Reveal label="Soluția tichetului 1 — administratively down">
        <p><b>Diagnostic:</b> pe SW-A, <code>show interfaces status</code> → Fa0/1 <code>disabled</code>; <code>show interfaces fa0/1</code> → <code>administratively down, line protocol is down</code>. PC-ul vede „cablu deconectat” pentru că switch-ul nu trimite semnal.</p>
        <CodeBlock title="SW-A" code={`SW-A(config)# interface fastEthernet0/1
SW-A(config-if)# no shutdown`} kind="session" explain={[['no shutdown', 'Repornește portul. Verificare: Status connected, LED verde.']]} />
      </Reveal>
      <Reveal label="Soluția tichetului 2 — speed mismatch pe uplink">
        <p><b>Diagnostic:</b> SW-A Gi0/1 și SW-CORE Gi0/1 sunt amândouă <code>notconnect</code> (down/down), deși cablul e corect. <code>show interfaces status</code>: Speed <code>100</code> pe SW-A și <code>10</code> pe SW-CORE — ambele fixe, diferite → speed mismatch. PC-A1 ajunge doar la dispozitivele de pe SW-A.</p>
        <CodeBlock title="SW-A și SW-CORE" code={`SW-A(config)# interface gigabitEthernet0/1
SW-A(config-if)# speed auto
SW-A(config-if)# duplex auto
SW-CORE(config)# interface gigabitEthernet0/1
SW-CORE(config-if)# speed auto
SW-CORE(config-if)# duplex auto`} kind="session" explain={[['speed auto (ambele capete)', 'Recomandarea Cisco: auto pe ambele. Rezultat așteptat: a-full a-1000. Verificare: ping PC-A1 → 192.168.10.1.']]} />
        <p className="small muted">Dacă PT a ținut totuși link-ul verde cu vitezele diferite, notează limitarea simulatorului — pe echipament real ar fi down/down.</p>
      </Reveal>
      <Reveal label="Soluția tichetului 3 — duplex mismatch">
        <p><b>Diagnostic:</b> link-ul SW-CORE Fa0/2 ↔ SW-B Fa0/24 e up/up și ping-ul merge, dar pe consolă apare periodic <code>%CDP-4-DUPLEX_MISMATCH</code>. <code>show interfaces status</code>: SW-CORE Fa0/2 <code>half 100</code>, SW-B Fa0/24 <code>full 100</code>. Pe echipament real: late collisions pe SW-CORE (half), CRC + runts pe SW-B (full) → transferurile lente ale utilizatorului.</p>
        <CodeBlock title="SW-CORE și SW-B" code={`SW-CORE(config)# interface fastEthernet0/2
SW-CORE(config-if)# speed auto
SW-CORE(config-if)# duplex auto
SW-B(config)# interface fastEthernet0/24
SW-B(config-if)# speed auto
SW-B(config-if)# duplex auto`} kind="session" explain={[['duplex auto (ambele capete)', 'Ambele negociază → a-full a-100. Mesajele CDP încetează. Pe real: clear counters și confirmi că late collisions / CRC nu mai cresc.']]} />
        <p className="small">Greșeala tipică: să repari doar SW-CORE pe <code>duplex auto</code> lăsând SW-B fixat 100/full — SW-CORE ar ajunge pe a-half prin parallel detection, adică tot mismatch.</p>
      </Reveal>
      <Reveal label="Soluția tichetului 4 — err-disabled (port security)">
        <p><b>Diagnostic:</b> SW-B: <code>show interfaces status</code> → Fa0/2 <code>err-disabled</code>; <code>show interfaces status err-disabled</code> → Reason <code>psecure-violation</code>. Portul permite doar MAC-ul laptopului vechi (0001.0001.0001); laptopul nou a declanșat încălcarea.</p>
        <CodeBlock title="SW-B" code={`SW-B(config)# interface fastEthernet0/2
SW-B(config-if)# no switchport port-security mac-address 0001.0001.0001
SW-B(config-if)# switchport port-security mac-address sticky
SW-B(config-if)# shutdown
SW-B(config-if)# no shutdown`} kind="session" explain={[
          ['no switchport port-security mac-address …', 'Elimini cauza: MAC-ul vechi nu mai e cel permis.'],
          ['switchport port-security mac-address sticky', 'Opțional: switch-ul învață automat primul MAC care apare (laptopul nou). Alternativ: dezactivezi port security pe port.'],
          ['shutdown / no shutdown', 'Reactivezi portul err-disabled. Verificare: Status connected, ping PC-B2 → 192.168.10.1.'],
        ]} />
      </Reveal>
      <Reveal label="Verificare finală și întrebări de reflecție">
        <ul>
          <li>Toate PC-urile fac ping la 192.168.10.1 și între ele; <code>show interfaces status</code> pe toate switch-urile: doar <code>connected</code> cu <code>a-full</code> pe legăturile folosite.</li>
          <li><b>De ce tichetul 2 a apărut abia după tichetul 1?</b> Problemele erau în serie pe aceeași cale; prima le ascundea pe a doua. În realitate, după fiecare reparație verifici din nou cap-coadă.</li>
          <li><b>Care tichet ar fi fost cel mai greu de găsit fără CDP?</b> Tichetul 3: legătura e up/up și ping-ul merge. Doar duplexul diferit și (pe real) contoarele îl trădează.</li>
        </ul>
        <Callout kind="exam" title="Legătura cu examenul">Lab-ul acoperă exact cele patru cuvinte din obiectiv — erori/stări, coliziuni (prin duplex), duplex mismatch, speed mismatch — plus err-disabled, care revine în 2.5 (BPDU Guard) și 5.7 (port security).</Callout>
      </Reveal>
    </section>
  );
}
