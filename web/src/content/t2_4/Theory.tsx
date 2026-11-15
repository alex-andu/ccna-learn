import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { LoadBalance, ModeMatrix, WhyBundle } from '../../diagrams/t2_4';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.4" title="EtherChannel — imaginea de ansamblu" />
      <Summary>
        <p><b><G id="etherchannel">EtherChannel</G></b> grupează <b>2–8 linkuri fizice paralele</b> (16 la LACP, din care 8 active) între aceleași două echipamente într-un singur link logic, numit <b><G id="port-channel">port-channel</G></b>. Câștigi <b>lățime de bandă agregată</b> și <b>redundanță</b>, iar <G id="stp">STP</G> nu mai blochează linkurile, pentru că vede unul singur. Negocierea standard este <b><G id="lacp">LACP</G></b> (IEEE 802.3ad / 802.1AX): <code>channel-group 1 mode active|passive</code>.</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial 2.4 este <i>Configure and verify (Layer 2/Layer 3) EtherChannel (LACP)</i>. Nu are sub-puncte oficiale; predăm: de ce există, cum se negociază (LACP / PAgP / static), configurarea L2 și L3, apoi repartizarea traficului, verificarea și depanarea.</p>
        <Table head={['Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['De ce EtherChannel', 'Cum folosesc două sau mai multe cabluri între aceleași switch-uri fără ca STP să blocheze unul?'],
          ['Negocierea (LACP, PAgP, on)', 'Cum se pun de acord cele două capete că „aceste porturi formează un canal”?'],
          ['Configurare L2 / L3', 'Ce comenzi creez și ce trebuie să fie identic pe porturile membre?'],
          ['Load balancing, verificare, depanare', 'Cum se împarte traficul, cum citesc show etherchannel summary și ce înseamnă flagurile?'],
        ]} />

        <h3>Problema: linkuri redundante, dar blocate</h3>
        <p>Un link de acces între două switch-uri este un punct unic de cădere și un gât de sticlă. Soluția intuitivă este să tragi un al doilea cablu. Dar două cabluri între aceleași două switch-uri formează o <b>buclă de nivel 2</b>, iar <G id="stp">STP</G> (2.5) o rezolvă blocând unul dintre ele. Rezultat: ai plătit două porturi, dar folosești unul; al doilea e doar rezervă.</p>
        <p>EtherChannel schimbă regula: cele două linkuri sunt declarate <b>un singur link logic</b>. STP rulează pe port-channel, nu pe membri, deci nu vede nicio buclă și nu blochează nimic. Traficul se repartizează pe membri, iar dacă unul cade, canalul continuă pe cei rămași, fără reconvergență STP.</p>
        <Figure caption="Interactiv: același cablaj, cu și fără EtherChannel.">
          <WhyBundle />
        </Figure>
        <Analogy>Gândește-te la o autostradă cu două benzi pe sens: mașinile nu sunt „puse pe o singură bandă și cealaltă păstrată pentru avarii”; sunt repartizate pe ambele, iar dacă o bandă se închide, traficul merge pe cealaltă (mai încet). Important: o mașină (un flux) rămâne pe banda ei; nu se „rupe” între benzi.</Analogy>

        <h3>Ce este și ce nu este</h3>
        <ul>
          <li><b>Un singur link logic</b> cu o singură configurație: ce setezi pe <code>interface port-channel 1</code> se aplică tuturor membrilor (trunk, VLAN-uri, STP).</li>
          <li><b>Nu înseamnă „viteză sumă” pentru un singur flux:</b> un flux (aceeași pereche sursă–destinație) merge pe <b>un</b> membru. Doi hosturi care comunică tot timpul pot folosi cel mult un link de 1 Gbps, chiar dacă bundle-ul are patru.</li>
          <li><b>Se creează între două echipamente</b> (sau, cu tehnologii separate precum stacking/VSS/vPC, între unul și o pereche; asta depășește CCNA). Toate linkurile merg la același vecin.</li>
          <li><b>Se poate face la nivel 2</b> (switchport: access sau trunk) <b>sau la nivel 3</b> (port rutat cu adresă IP).</li>
        </ul>
        <Callout kind="info" title="Terminologie: EtherChannel, port-channel, LAG">
          „EtherChannel” este denumirea Cisco a tehnologiei; <b>port-channel</b> este interfața logică creată; <b>LAG</b> (<i>Link Aggregation Group</i>) este termenul standard, folosit și la controlere wireless (2.7). <b>LACP</b> este protocolul standard care negociază un LAG; <b>PAgP</b> este varianta proprietară Cisco.
        </Callout>
      </Detailed>

      <Traps items={[
        <>EtherChannel nu face ca <b>un flux</b> să fie mai rapid; îmbunătățește capacitatea totală și rezistența la cădere.</>,
        <>Membrii trebuie să meargă între <b>aceleași două echipamente</b> (în CCNA).</>,
        <>STP vede <b>port-channel-ul</b>, nu membrii: nu blochează un membru al canalului.</>,
      ]} />
      <InlineQuiz ids={['2.4-001', '2.4-003', '2.4-005']} />
    </section>
  );
}

/* ======================================================================
   Negociere: LACP / PAgP / on
   ====================================================================== */
export function Negotiation() {
  return (
    <section id="negotiation" className="section">
      <SectionHead id="negotiation" code="2.4" title="Negocierea canalului: LACP, PAgP, static" />
      <Summary>
        <p>Un canal se poate forma în trei feluri: <b>LACP</b> (<code>active</code>/<code>passive</code>, standard IEEE), <b>PAgP</b> (<code>desirable</code>/<code>auto</code>, Cisco) sau <b>static</b> (<code>on</code>, fără negociere). Regula de aur: <b>cel puțin un capăt trebuie să inițieze</b> (active / desirable), iar ambele capete trebuie să folosească <b>aceeași familie</b>; <code>on</code> se potrivește doar cu <code>on</code>.</p>
      </Summary>

      <Detailed title="1. De ce negociem?">
        <p>Fără negociere (<code>on</code>), fiecare capăt pur și simplu presupune că celălalt a configurat același canal. Dacă o parte a greșit portul, a uitat o comandă sau cablul a fost mutat, un capăt trimite traficul pe „canal” și celălalt îl vede ca pe linkuri separate: pot apărea cadre pierdute, MAC flapping sau bucle. Un protocol de negociere schimbă mesaje de control ca să <b>confirme</b> că ambele capete au aceeași intenție și aceiași parametri, și <b>exclude</b> un port care nu se potrivește.</p>

        <h3>2. LACP — standardul</h3>
        <ul>
          <li><b>IEEE 802.3ad</b> (mutat ulterior în <b>802.1AX</b>); funcționează între echipamente de la producători diferiți.</li>
          <li>Mesajele de control se numesc <b>LACPDU</b> și se trimit periodic (implicit la 30 s, sau 1 s în modul „fast”) către o adresă multicast rezervată de nivel 2.</li>
          <li>Moduri: <code>active</code> (inițiază negocierea activ) și <code>passive</code> (răspunde, dar nu inițiază).</li>
          <li>Până la <b>16 porturi</b> într-un bundle, dintre care <b>8 active</b> și restul <b>standby</b> (hot-standby, intră când un activ cade). Alegerea porturilor active se face după <b>prioritatea sistemului</b> (<code>lacp system-priority</code>, implicit 32768, cel mai mic câștigă) și apoi <b>prioritatea portului</b> (<code>lacp port-priority</code>, implicit 32768).</li>
        </ul>
        <h3>3. PAgP — varianta Cisco</h3>
        <ul>
          <li>Proprietar Cisco, anterior LACP; funcționează doar între echipamente Cisco.</li>
          <li>Moduri: <code>desirable</code> (inițiază) și <code>auto</code> (răspunde, nu inițiază). Până la 8 porturi.</li>
          <li>La examen apare mai ales în tabelul de compatibilitate; obiectivul oficial cere explicit <b>LACP</b>.</li>
        </ul>
        <h3>4. Static — <code>on</code></h3>
        <p>Nu trimite niciun pachet de negociere; canalul se formează imediat ce ambele capete spun <code>on</code>. E rapid și simplu, dar <b>fără verificare</b>: o nepotrivire nu e detectată de protocol. Pe controlere wireless AireOS, de exemplu, LAG-ul este exclusiv static (2.7).</p>

        <Table head={['Mod', 'Protocol', 'Atitudine', 'Formează canal cu']} hlCol={0} rows={[
          [<code>active</code>, <>LACP (<G id="lacp" />)</>, 'inițiază', <><code>active</code>, <code>passive</code></>],
          [<code>passive</code>, 'LACP', 'răspunde', <><code>active</code> (nu și cu passive)</>],
          [<code>desirable</code>, <><G id="pagp">PAgP</G></>, 'inițiază', <><code>desirable</code>, <code>auto</code></>],
          [<code>auto</code>, 'PAgP', 'răspunde', <><code>desirable</code> (nu și cu auto)</>],
          [<code>on</code>, 'niciunul (static)', 'forțează', <><code>on</code> (doar)</>],
        ]} />
        <Figure caption="Interactiv: alege modul pe fiecare switch și vezi dacă se formează canalul și de ce.">
          <ModeMatrix />
        </Figure>
        <Analogy>Negocierea e ca un dans: <code>active</code> invită, <code>passive</code> acceptă invitația. Doi „passive” stau la perete și nu dansează niciodată. <code>on</code> este cel care intră pe ringul de dans fără să întrebe pe nimeni: se potrivește doar cu altul la fel.</Analogy>

        <Callout kind="exam" title="Mnemonic pentru examen">
          <b>A</b>ctive + <b>A</b>ctive ✔, <b>A</b>ctive + <b>P</b>assive ✔, <b>P</b>assive + <b>P</b>assive ✘. La PAgP la fel: <b>D</b>esirable cu orice din familia lui ✔ (D–D, D–A), <b>A</b>uto–<b>A</b>uto ✘. <b>LACP nu vorbește cu PAgP</b>, iar <b>on nu vorbește cu niciunul dintre ele</b>.
        </Callout>
      </Detailed>

      <DeepDive title="Ce se schimbă în LACPDU și de ce contează prioritățile">
        <p>Fiecare capăt își anunță în LACPDU <b>identitatea sistemului</b> (prioritate + MAC) și, pentru fiecare port, <b>prioritatea portului, numărul portului și cheia operațională</b> (o valoare care grupează porturile ce pot forma același agregat). Doar porturile cu aceeași cheie și cu același partener intră în același bundle.</p>
        <p>Când sunt mai mult de 8 porturi eligibile, decide <b>echipamentul cu prioritatea de sistem mai mică</b> (la egalitate, MAC-ul mai mic) care porturi sunt active; el aplică prioritățile de port. De aceea, dacă vrei să controlezi ce linkuri sunt standby, setezi <code>lacp port-priority</code> pe echipamentul care are prioritatea de sistem cea mai mică. Detaliul nu e esențial la CCNA, dar explică de ce <code>show lacp neighbor</code> afișează priorități și chei.</p>
      </DeepDive>

      <Traps items={[
        <><b>passive + passive</b> (LACP) și <b>auto + auto</b> (PAgP) <b>nu</b> formează canal.</>,
        <><b>LACP ≠ PAgP</b>: <code>active</code> cu <code>desirable</code> nu funcționează.</>,
        <><code>on</code> + <code>active</code> nu funcționează: <code>on</code> nu trimite și nu înțelege LACPDU.</>,
        <>LACP: <b>16</b> membri, <b>8</b> active și restul standby; PAgP: 8.</>,
      ]} />
      <InlineQuiz ids={['2.4-007', '2.4-009', '2.4-012', '2.4-013']} />
    </section>
  );
}

/* ======================================================================
   Configurare L2 / L3
   ====================================================================== */
export function Layers() {
  return (
    <section id="layers" className="section">
      <SectionHead id="layers" code="2.4" title="EtherChannel de nivel 2 și de nivel 3" />
      <Summary>
        <p><b>L2:</b> pui porturile în canal (<code>interface range … / channel-group N mode active</code>), apoi configurezi <b>interfața <code>port-channel N</code></b> ca trunk sau access. <b>L3:</b> <code>no switchport</code> pe membri, apoi <code>interface port-channel N</code> cu <code>no switchport</code> și <code>ip address</code>. Pe toate porturile membre trebuie să coincidă viteza, duplexul și modul de switchport.</p>
      </Summary>

      <Detailed title="1. Condițiile de compatibilitate">
        <p>Switch-ul acceptă un port în canal doar dacă este „la fel” ca ceilalți membri. În caz contrar, portul rămâne separat sau este suspendat. Cele mai importante potriviri:</p>
        <Table head={['Trebuie să coincidă', 'Exemplu de nepotrivire']} hlCol={0} rows={[
          ['Viteză și duplex', 'Gi0/1 la 1000 Mbps, Gi0/2 forțat la 100 Mbps'],
          ['Mod switchport (access / trunk / rutat)', 'Un membru access, altul trunk'],
          ['VLAN-ul de access', 'Gi0/1 în VLAN 10, Gi0/2 în VLAN 20'],
          ['Pe trunk: native VLAN și lista de VLAN-uri permise', 'Native VLAN 1 pe un membru, 99 pe altul'],
          ['Aceeași configurație STP relevantă și ideal aceeași descriere/MTU', 'Costuri diferite sau PortFast pe unii membri'],
          ['Același vecin la celălalt capăt', 'Un cablu mutat către alt switch'],
        ]} />
        <Callout kind="tip" title="Regula practică: configurezi pe port-channel, nu pe membri">
          După ce portul intră în canal, parametrii de switchport se setează pe <code>interface port-channel N</code> și se propagă la membri. Cea mai sigură ordine: (1) pregătești membrii identic (sau îi pui în <code>shutdown</code>), (2) <code>channel-group</code>, (3) configurezi Po, (4) <code>no shutdown</code>.
        </Callout>

        <h3>2. EtherChannel de nivel 2</h3>
        <p>Canalul se comportă ca un singur port de switch: poate fi <b>access</b> (un VLAN) sau <b>trunk</b> (2.2). Cel mai des este trunk între switch-uri de distribuție/acces. Comanda <code>channel-group N mode …</code> pe un port creează automat <code>interface port-channel N</code> dacă nu există.</p>
        <ul>
          <li><b>Numărul canalului este local</b>: <code>channel-group 1</code> pe SW1 poate vorbi cu <code>channel-group 5</code> pe SW2. Se recomandă totuși același număr, pentru ordine.</li>
          <li>Pe un trunk, <code>switchport trunk encapsulation dot1q</code> (unde e necesar) și <code>switchport mode trunk</code> se pun pe port-channel.</li>
        </ul>

        <h3>3. EtherChannel de nivel 3</h3>
        <p>Pe un switch multilayer poți transforma membrii și port-channel-ul în <b>porturi rutate</b> (<code>no switchport</code>) și pune pe Po o <b>adresă IP</b>. Rezultatul este o legătură punct-la-punct rutată (de exemplu între două switch-uri de distribuție sau spre un router), cu adresă unică (de obicei /30 sau /31) și <b>fără VLAN-uri și fără STP pe acel link</b>. Beneficiul: rutare pe mai multe căi cu bandă agregată și convergență rapidă la căderea unui membru.</p>
        <ul>
          <li>Membrii: <code>no switchport</code>, <b>fără adresă IP pe membri</b> (IP-ul se pune doar pe Po).</li>
          <li>Pe Po: <code>no switchport</code> (se creează ca port rutat) + <code>ip address</code>.</li>
          <li>Pe platformele care o cer, <code>ip routing</code> global pentru ca switch-ul să și ruteze.</li>
        </ul>
        <Callout kind="exam" title="L2 vs L3 în flagurile din show etherchannel summary">
          La <b>L2</b> portul canalului apare ca <b>SU</b> (S = Layer2, U = in use); la <b>L3</b> ca <b>RU</b> (R = Layer3). Membrii bundled apar cu <b>(P)</b>.
        </Callout>
      </Detailed>

      <Traps items={[
        <>Un membru cu viteză/duplex/VLAN diferit este exclus sau suspendat (<b>(s)</b> / <b>(D)</b>) — verifică <code>show etherchannel summary</code>.</>,
        <>Configurezi VLAN-urile trunk pe <b>port-channel</b>; modificările pe un singur membru pot rupe consistența.</>,
        <>La L3, adresa IP se pune pe <b>port-channel</b>, nu pe membri, iar membrii au <code>no switchport</code>.</>,
        <>Numerele de port-channel de la cele două capete <b>nu</b> trebuie să coincidă (sunt locale).</>,
      ]} />
      <InlineQuiz ids={['2.4-015', '2.4-017', '2.4-019']} />
    </section>
  );
}

/* ======================================================================
   Load balancing, verificare, depanare
   ====================================================================== */
export function Verify() {
  return (
    <section id="verify" className="section">
      <SectionHead id="verify" code="2.4" title="Load balancing, verificare și depanare" />
      <Summary>
        <p>Traficul se repartizează pe membri printr-un <b>hash</b> calculat din câmpuri ale cadrului/pachetului (MAC sursă/destinație, IP, porturi), deci <b>un flux rămâne mereu pe același link</b>. Metoda se alege <b>global</b> (<code>port-channel load-balance …</code>) și se verifică cu <code>show etherchannel load-balance</code>. Verificarea principală: <code>show etherchannel summary</code> (flaguri <b>SU/RU</b>, <b>P</b>, <b>D</b>, <b>s</b>, <b>I</b>).</p>
      </Summary>

      <Detailed title="1. Cum se împarte traficul">
        <p>Switch-ul nu trimite „un pachet pe un link, următorul pe altul” (asta ar produce reordonări). El ia câmpuri din antet (de exemplu MAC sursă și destinație sau IP sursă și destinație), le combină într-un hash și folosește rezultatul ca să aleagă un membru. <b>Aceleași valori ⇒ același link</b>; deci o conversație rămâne în ordine, iar mai multe conversații diferite se împrăștie pe linkuri.</p>
        <Table head={['Metodă', 'Câmpuri folosite', 'Când e potrivită']} hlCol={0} rows={[
          [<code>src-mac</code>, 'MAC sursă', 'Mulți hosturi trimit prin canal către puține destinații'],
          [<code>dst-mac</code>, 'MAC destinație', 'Puține surse spre multe destinații'],
          [<code>src-dst-mac</code>, 'MAC sursă + destinație', 'Mix; atenție când tot traficul trece printr-un router (același MAC)'],
          [<><code>src-ip</code> / <code>dst-ip</code> / <code>src-dst-ip</code></>, 'Adrese IP', 'Trafic rutat sau mulți hosturi în subrețele diferite'],
          [<code>src-dst-port</code>, 'Porturi L4 (pe platformele care le suportă)', 'Granularitate maximă, pe platforme avansate'],
        ]} />
        <Figure caption="Interactiv: 6 PC-uri vorbesc cu același server. Compară metodele și numărul de linkuri.">
          <LoadBalance />
        </Figure>
        <Callout kind="info" title="Ce metode există și ce e implicit depinde de platformă">
          Lista exactă de metode și valoarea implicită diferă între modele (de exemplu unele switch-uri Catalyst folosesc implicit <code>src-mac</code>, altele <code>src-dst-ip</code>). Nu memora o valoare implicită ca „adevăr universal”: verifică cu <code>show etherchannel load-balance</code> și, pe examen, ține minte principiul (hash pe flux, setare globală, aleasă după tipul traficului).
        </Callout>
        <p>Mai ține minte: dacă tot traficul trece printr-un singur router sau server, <b>MAC-ul sursă sau destinație este același</b> pentru toate fluxurile; atunci o metodă bazată pe MAC va pune totul pe un singur link, iar una bazată pe IP (sau pe porturi) împrăștie mai bine. Numărul de linkuri contează: cu 2, 4 sau 8 linkuri hash-ul se distribuie mai uniform; cu 3, 5, 6 sau 7, unele linkuri primesc mai multe intrări decât altele.</p>

        <h3>2. Verificare: show etherchannel summary</h3>
        <p>Comanda arată fiecare Po cu starea și membrii. Flagurile sunt cheia la examen:</p>
        <Table head={['Flag', 'Semnificație']} hlCol={0} rows={[
          ['S (la Po)', 'Layer 2 · SU = L2, in use'],
          ['R (la Po)', 'Layer 3 · RU = L3, in use'],
          ['U', 'port-channel in use (utilizat)'],
          ['D (la Po)', 'port-channel down'],
          ['P (la port)', 'bundled in port-channel — membrul funcționează în canal'],
          ['s (la port)', 'suspended — membru suspendat (nepotrivire, sau LACP nu primește răspuns)'],
          ['I (la port)', 'stand-alone — membrul nu e în canal, lucrează individual'],
          ['H (la port)', 'hot-standby (doar LACP)'],
          ['D (la port)', 'down — portul este căzut'],
          ['w', 'waiting to be aggregated'],
        ]} />
        <p>Alte comenzi: <code>show etherchannel port-channel</code> (detalii pe Po), <code>show etherchannel detail</code>, <code>show lacp neighbor</code> (partenerul LACP), <code>show lacp counters</code>, <code>show pagp neighbor</code>, <code>show interfaces port-channel 1</code>, <code>show interfaces etherchannel</code>, <code>show spanning-tree</code> (Po apare ca port).</p>

        <h3>3. Depanare</h3>
        <Table head={['Simptom', 'Cauze probabile']} hlCol={0} rows={[
          ['Po în „SD” (L2 down)', 'Niciun membru bundled: negociere eșuată (passive + passive), moduri/protocoale diferite, cablu căzut'],
          ['Membru cu (s) suspended', 'LACP nu primește LACPDU de la vecin sau parametri nepotriviți (VLAN, trunk, native)'],
          ['Membru cu (I) stand-alone', 'Nu a negociat canal (modul lipsă pe celălalt capăt, protocol diferit)'],
          ['Canal „up”, dar un link aglomerat', 'Metodă de hash nepotrivită (tot traficul are același MAC/IP)'],
          ['%PM-4-ERR_DISABLE / loop detectat / MAC flapping', 'Un capăt „on”, celălalt nu — canal configurat unilateral'],
          ['Port-channel „err-disabled”', 'Nepotriviri persistente sau EtherChannel Misconfig Guard (STP) detectat'],
        ]} />
        <p>Metodă: (1) <code>show etherchannel summary</code> — ce flaguri ai? (2) <code>show running-config interface</code> pe membri — modul, VLAN, trunk identice? (3) <code>show lacp neighbor</code> — vezi vecinul? (4) vezi dacă modurile din tabel pot forma canal. (5) după corectare, un <code>shutdown</code>/<code>no shutdown</code> pe Po resetează negocierea.</p>
      </Detailed>

      <Traps items={[
        <>Load balancing se setează <b>global</b>, nu pe port-channel, și hash-ează <b>fluxuri</b>, nu pachete.</>,
        <><b>P</b> = în canal (bundled); <b>s</b> = suspendat; <b>I</b> = stand-alone; <b>D</b> = down.</>,
        <><b>SU</b> = L2 în uz; <b>RU</b> = L3 în uz.</>,
        <>Un canal poate fi „up” și totuși dezechilibrat: metoda de hash nu se potrivește cu traficul.</>,
      ]} />
      <InlineQuiz ids={['2.4-021', '2.4-023', '2.4-025', '2.4-028']} />
    </section>
  );
}
