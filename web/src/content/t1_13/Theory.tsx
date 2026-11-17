import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import {
  CollisionHistory, EthernetFrame, FloodCases, ForwardingFlow, MacDecoder, MacTableSim, SwitchingMethods, TwoSwitches,
} from '../../diagrams/t1_13';

/* ======================================================================
   0. Introducere — imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.13" title="Conceptele de switching — imaginea de ansamblu" />
      <Summary>
        <p>Un <b><G id="l2-switch">switch</G></b> ia decizii pe baza <b>adreselor <G id="mac">MAC</G></b> din cadre. El <b>învață</b> singur unde se află fiecare stație (citind adresa <b>sursă</b> a fiecărui cadru primit), își notează totul în <b><G id="mac-table">tabela MAC</G></b> și apoi <b>comută</b> fiecare cadru după adresa <b>destinație</b>: pe un singur port dacă o cunoaște, pe toate porturile VLAN-ului (flooding) dacă nu o cunoaște sau dacă e broadcast. Intrările neutilizate expiră (<G id="aging">aging</G>, implicit 300 s).</p>
      </Summary>

      <Detailed>
        <p>Obiectivul oficial 1.13 este <i>Describe switching concepts</i>, cu patru sub-puncte. Verbul este „Describe”: la examen trebuie să poți <b>spune ce face switch-ul pas cu pas</b> pentru un cadru dat și să citești o tabelă MAC, nu să programezi hardware.</p>
        <Table head={['Cod Cisco', 'Tema', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['1.13.a', 'MAC learning and aging', 'Cum află switch-ul unde e fiecare stație, fără să-l configurezi, și când uită?'],
          ['1.13.b', 'Frame switching', 'Ce conține un cadru și după ce câmpuri decide switch-ul? (inclusiv metodele store-and-forward / cut-through)'],
          ['1.13.c', 'Frame flooding', 'Ce face switch-ul când nu știe încotro să trimită cadrul?'],
          ['1.13.d', 'MAC address table', 'Cum arată tabela, cum o citești, o ștergi sau o completezi manual?'],
        ]} />
        <Callout kind="info" title="Ordinea de predare">
          Parcurgem sub-punctele în ordinea oficială a–d. Pentru că „learning” și „forwarding” sunt două fețe ale aceleiași operații, simulatorul interactiv din 1.13.a le arată pe amândouă, iar secțiunile b, c și d le detaliază separat. Codurile oficiale se păstrează.
        </Callout>

        <h3>Problema: cum comuți cadre fără să știi unde e nimeni?</h3>
        <p>Ethernet a început ca un cablu coaxial comun: orice stație trimitea, toate ascultau. Mai târziu, <G id="hub">hub</G>-ul a făcut același lucru cu cabluri UTP: repetă fiecare bit pe toate porturile. Rezultatul: o singură „conversație” la un moment dat, coliziuni, <G id="csma-cd">CSMA/CD</G> și <G id="half-duplex">half-duplex</G>. Toți împart același <G id="collision-domain">domeniu de coliziune</G>.</p>
        <p>Soluția a fost <b>bridge-ul</b> transparent (<G id="bridge" />, anii ’80, IEEE 802.1D): un dispozitiv de nivel 2 care <i>ascultă</i> traficul, învață ce adrese sunt pe fiecare segment și lasă cadrul să treacă pe celălalt segment doar dacă destinația e acolo. Un <b>switch</b> este un bridge cu multe porturi, realizat în hardware (<G id="asic">ASIC</G> + <G id="cam">CAM</G>): fiecare port devine propriul domeniu de coliziune, iar cu <G id="full-duplex">full-duplex</G> coliziunile dispar complet.</p>
        <Figure caption="Interactiv: compară hub, bridge și switch. Observă că toate trei rămân într-un singur domeniu de broadcast; se schimbă doar numărul domeniilor de coliziune.">
          <CollisionHistory />
        </Figure>
        <Analogy>Un hub e ca un om care strigă fiecare mesaj într-o sală plină: toți îl aud, iar dacă doi strigă deodată, nu se înțelege nimic. Un switch e ca un portar care a notat pe un caiet în ce cameră locuiește fiecare oaspete: primește un plic cu numele destinatarului și îl duce direct la ușa lui. Când nu găsește numele în caiet, cheamă numele pe toate holurile (flooding) și notează cine răspunde.</Analogy>

        <h3>Cele patru idei, pe scurt</h3>
        <ol>
          <li><b>Learn:</b> pentru fiecare cadru primit, adaugă/reîmprospătează intrarea (VLAN, MAC sursă, port de intrare).</li>
          <li><b>Look up:</b> caută MAC-ul destinație în tabelă, în același VLAN.</li>
          <li><b>Decide:</b> <i>forward</i> (un singur port), <i>filter</i> (destinația e pe același port) sau <i>flood</i> (toate porturile VLAN-ului, mai puțin cel de intrare).</li>
          <li><b>Age:</b> intrările dinamice care nu mai sunt „reîmprospătate” dispar după aging time.</li>
        </ol>
      </Detailed>

      <Traps items={[
        <>Switch-ul învață din <b>sursă</b> și comută după <b>destinație</b>. Inversarea lor e cea mai frecventă greșeală.</>,
        <>Un switch <b>nu separă domeniile de broadcast</b>: separă doar domeniile de coliziune. Broadcast-ul se oprește la VLAN (sau router).</>,
        <>Switch-ul <b>nu aruncă</b> un cadru cu destinație necunoscută; îl inundă. Routerul, în schimb, aruncă pachetul fără rută.</>,
      ]} />
      <InlineQuiz ids={['1.13-001', '1.13-022', '1.13-040']} />
    </section>
  );
}

/* ======================================================================
   1.13.a — MAC learning and aging
   ====================================================================== */
export function Learning() {
  return (
    <section id="learning" className="section">
      <SectionHead id="learning" code="1.13.a" title="MAC learning and aging" />
      <Summary>
        <p>Switch-ul își construiește singur tabela: pentru fiecare cadru primit notează <b>MAC-ul sursă</b> și <b>portul de intrare</b> (<G id="mac-learning">MAC learning</G>). Fiecare intrare dinamică are un timer care se resetează de câte ori stația mai vorbește; dacă tace mai mult de <b>300 s</b> (implicit), intrarea dispare (<G id="aging">aging</G>). Dacă aceeași adresă apare pe alt port, intrarea se mută.</p>
      </Summary>

      <Detailed title="1. Adresa MAC — ce citește switch-ul">
        <p>O adresă <G id="mac">MAC</G> (EUI-48) are <b>48 de biți</b>, scriși ca 12 cifre hexazecimale. Cisco folosește notația cu puncte (<code>0011.2233.4455</code>), Windows liniuțe (<code>00-11-22-33-44-55</code>), Linux și macOS două puncte (<code>00:11:22:33:44:55</code>) — este aceeași adresă.</p>
        <ul>
          <li><b>Primii 24 de biți = <G id="oui">OUI</G></b> — atribuit de IEEE producătorului (00-00-0C = Cisco). Ceilalți 24 îi alege producătorul pentru fiecare placă.</li>
          <li><b><G id="ig-bit">Bitul I/G</G></b> (ultimul bit al primului octet): 0 = unicast, 1 = multicast sau broadcast.</li>
          <li><b><G id="ul-bit">Bitul U/L</G></b> (penultimul bit al primului octet): 0 = adresă universală („arsă” de producător), 1 = administrată local (setată de software, VM, telefon cu MAC privat).</li>
        </ul>
        <Figure caption="Decodor interactiv: scrie sau alege o adresă și vezi OUI-ul, biții I/G și U/L și tipul ei. Încearcă broadcast-ul, un multicast și un MAC „privat”.">
          <MacDecoder />
        </Figure>
        <Callout kind="exam" title="Truc de examen">
          Uită-te la <b>a doua cifră hexazecimală</b> a primului octet. Impară (1, 3, 5, 7, 9, B, D, F) ⇒ I/G = 1 ⇒ multicast/broadcast. Dacă e 2, 6, A sau E ⇒ unicast <b>administrat local</b>. Exemple: <code>01-00-5E-…</code> multicast IPv4, <code>33-33-…</code> multicast IPv6, <code>FF-FF-FF-FF-FF-FF</code> broadcast.
        </Callout>

        <h3>2. Învățarea: ce se întâmplă pentru fiecare cadru</h3>
        <p>Când un cadru intră pe un port, switch-ul face <b>întotdeauna</b> același prim pas, indiferent unde merge cadrul: citește câmpul <i>Source MAC</i> și verifică tabela pentru perechea (VLAN, MAC sursă).</p>
        <Table head={['Situație în tabelă', 'Ce face switch-ul', 'Numele']} hlCol={0} rows={[
          ['MAC-ul sursă nu există', 'creează intrare: VLAN, MAC, portul de intrare, tip DYNAMIC, timer pornit', 'learn'],
          ['există, același port', 'doar resetează timerul de aging', 'refresh'],
          ['există, dar pe alt port', 'rescrie intrarea cu noul port', 'MAC move'],
          ['există ca STATIC', 'nu o modifică', 'nimic de învățat'],
        ]} />
        <p>De ce <b>sursa</b>? Pentru că sursa este singura adresă despre care switch-ul poate fi sigur unde se află: cadrul tocmai a sosit pe un port anume, deci stația este „în direcția” acelui port. Adresa destinație spune doar cine ar trebui să primească cadrul, nu unde e. Din același motiv, <b>broadcast-ul și multicast-ul nu se învață niciodată</b>: nu pot fi adresă sursă (I/G = 0 la o sursă).</p>
        <Callout kind="info" title="Intrarea e per VLAN">
          Tabela este indexată după (VLAN, MAC). Aceeași adresă poate apărea în două VLAN-uri, cu intrări separate; învățarea și inundarea nu depășesc niciodată VLAN-ul cadrului.
        </Callout>

        <h3>3. Aging: de ce uită switch-ul</h3>
        <p>Intrările dinamice nu stau pentru totdeauna. Fiecare are un timer care pornește de la învățare și se <b>resetează de fiecare dată când stația trimite din nou un cadru</b>. Dacă trec <b>300 de secunde</b> (valoarea implicită Cisco, 5 minute) fără niciun cadru de la acel MAC, intrarea este ștearsă. Motivele:</p>
        <ul>
          <li>stațiile se opresc, se deconectează sau se mută — o intrare veche ar trimite cadre către un port greșit;</li>
          <li>memoria <G id="cam">CAM</G> este finită; fără aging s-ar umple cu adrese care nu mai există.</li>
        </ul>
        <p>După expirare, următorul cadru către acea stație este <G id="unknown-unicast">unknown unicast</G>: este inundat o dată, iar răspunsul stației o învață din nou. Aging-ul se poate modifica cu <code>mac address-table aging-time</code> (vezi 1.13.d); intrările <b>statice</b> nu expiră.</p>
        <Analogy>Tabela MAC e ca o agendă cu creionul: scrii pe fiecare pagină „Ion e în camera 12”, iar de fiecare dată când Ion îți face semn, îți reînnoiești nota. Dacă n-ai mai auzit de Ion de cinci minute, ștergi pagina; mai bine decât să trimiți poștă într-o cameră unde nu mai stă nimeni.</Analogy>

        <h3>4. Simulatorul: o poveste completă</h3>
        <p>Simulatorul de mai jos are 5 stații (D și E în spatele unui hub pe Fa0/4) și rulează un scenariu de 12 pași: primul cadru inundat, învățare, ARP broadcast, filtering în spatele hub-ului, multicast, <b>MAC move</b> (mută cablul lui B) și <b>aging</b>. Apasă „Cadrul următor” și citește, la fiecare pas, cele două decizii: <i>1. Learn (sursă)</i> și <i>2. Decizie (destinație)</i>. Poți trimite și cadre proprii, schimba aging-ul, porni ceasul în timp real sau adăuga o intrare statică.</p>
        <Figure caption="Simulator interactiv al tabelei MAC. Culorile: albastru = învățat/reîmprospătat, verde = destinație găsită, galben = MAC move.">
          <MacTableSim />
        </Figure>
        <p>În realitate, înaintea primului cadru A → B ar fi existat un <G id="arp">ARP</G> request: A știe doar IP-ul lui B și întreabă prin broadcast „cine are 10.0.0.2?”. Switch-ul nu înțelege ARP; vede doar un cadru către <code>ffff.ffff.ffff</code> și îl inundă, deci pasul 1 din simulator este o versiune simplificată.</p>
      </Detailed>

      <DeepDive title="Deep dive: aging, MAC flapping și topology change">
        <ul>
          <li><b>MAC move vs. MAC flapping.</b> O mutare unică e normală (laptop mutat în altă priză). Dacă aceeași adresă „sare” între două porturi de mai multe ori pe secundă, cadrele ei ajung pe ambele căi: aproape sigur ai o <b>buclă de nivel 2</b> sau o legătură dublă fără STP/EtherChannel. Catalyst raportează <code>%SW_MATM-4-MACFLAP_NOTIF</code> (formatul exact diferă între platforme).</li>
          <li><b>Aging și STP.</b> Când topologia se schimbă (<G id="stp" />), switch-urile pot scurta temporar aging-ul ca să uite repede căile vechi. Detaliile sunt în topicul de STP (Domeniul 2).</li>
          <li><b>Tabela plină.</b> Dacă memoria CAM se umple (de exemplu într-un atac care generează mii de MAC-uri false), stațiile noi nu mai pot fi învățate și traficul spre ele devine unknown unicast. Apărarea este port security (Domeniul 5).</li>
        </ul>
      </DeepDive>

      <Traps items={[
        <>Aging implicit: <b>300 s</b>, nu 30 și nu 3600. Se resetează de <b>cadrele primite de la stație</b> (sursă), nu de cele trimise către ea.</>,
        <>Broadcast-ul (<code>ffff.ffff.ffff</code>) și multicast-ul nu apar niciodată ca intrări dinamice.</>,
        <>Mutarea unei stații nu e „detectată” de switch decât când stația trimite un cadru de pe noul port.</>,
        <>Aceeași adresă poate arăta ca <code>0011.2233.4455</code>, <code>00-11-22-33-44-55</code> sau <code>00:11:22:33:44:55</code>; e doar notație.</>,
      ]} />
      <InlineQuiz ids={['1.13-002', '1.13-003', '1.13-005', '1.13-009']} />
    </section>
  );
}

/* ======================================================================
   1.13.b — Frame switching
   ====================================================================== */
export function Switching() {
  return (
    <section id="switching" className="section">
      <SectionHead id="switching" code="1.13.b" title="Frame switching" />
      <Summary>
        <p>După ce a învățat sursa, switch-ul caută <b>MAC-ul destinație</b> și ia una dintre trei decizii: <b>forward</b> (known unicast — un singur port), <b>filter</b> (destinația e pe același port de intrare — cadrul se aruncă) sau <b>flood</b> (necunoscut/broadcast/multicast). Un <G id="frame">cadru Ethernet</G> are antet (adrese, EtherType), date și <G id="fcs">FCS</G>; switch-ul poate începe să-l trimită după ce l-a primit tot (<G id="store-and-forward" />) sau mult mai devreme (<G id="cut-through" />).</p>
      </Summary>

      <Detailed title="1. Cadrul Ethernet — ce se află în el">
        <p>Switch-ul lucrează la <b>nivelul 2</b>; unitatea lui este <b>cadrul</b>. Cadrul înconjoară pachetul IP cu un antet (adrese MAC, tip) și o coadă (FCS). Click pe fiecare câmp ca să afli ce face.</p>
        <Figure caption="Interactiv: structura cadrului Ethernet II. Bifează „tag 802.1Q” ca să vezi cadrul pe un trunk (+4 octeți).">
          <EthernetFrame />
        </Figure>
        <Table head={['Câmp', 'Mărime', 'Rol', 'Cine îl folosește']} hlCol={0} rows={[
          ['Preamble + SFD', '7 + 1 B', 'sincronizare (nivel 1); nu intră în cadru', 'placa de rețea'],
          ['Destination MAC', '6 B', 'cui îi e adresat cadrul', 'switch (forward/flood)'],
          ['Source MAC', '6 B', 'cine l-a trimis (mereu unicast)', 'switch (learning)'],
          ['802.1Q tag', '4 B, opțional', 'VLAN ID + prioritate (pe trunk)', 'switch (VLAN)'],
          [<><G id="ethertype">EtherType</G></>, '2 B', 'protocolul din payload (0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP)', 'receptorul'],
          ['Payload', '46–1500 B', 'pachetul de nivel 3; padding dacă e mai mic', 'stiva IP'],
          [<G id="fcs" />, '4 B', 'CRC-32 pentru detectarea erorilor', 'receptorul / switch-ul S&F'],
        ]} />
        <p>Cadrul are minimum <b>64 B</b> și maximum <b>1518 B</b> (<b>1522 B</b> cu tag 802.1Q), de la Destination MAC până la FCS. Sub 64 B = <G id="runt" />. Atenție: <b>adresele MAC se schimbă la fiecare legătură</b> (fiecare cadru e refăcut), în timp ce adresele IP rămân aceleași de la un capăt la altul. Cadrul nu e „retransmis” de Ethernet dacă se strică: <G id="fcs" /> doar îl face să fie aruncat, iar recuperarea (dacă e nevoie) e treaba TCP.</p>

        <h3>2. Decizia: forward, filter sau flood</h3>
        <Figure caption="Algoritmul switch-ului pentru fiecare cadru. Ordinea e fixă: întâi învață din sursă, apoi decide după destinație.">
          <ForwardingFlow />
        </Figure>
        <Table head={['Destinația este…', 'Decizia', 'Ieșire']} hlCol={1} rows={[
          ['unicast, în tabelă, pe alt port', <b>forward</b>, 'doar acel port'],
          ['unicast, în tabelă, pe același port de intrare', <b>filter</b>, 'niciuna (cadru aruncat)'],
          ['unicast, nu e în tabelă', <b>flood</b>, 'toate porturile VLAN, mai puțin cel de intrare'],
          ['broadcast (ffff.ffff.ffff)', <b>flood</b>, 'idem'],
          ['multicast', <b>flood</b> , 'idem (cu IGMP snooping: doar porturile interesate)'],
        ]} />
        <p><b>Când apare „filter”?</b> Dacă la un port e conectat un hub cu două stații, cadrul unuia către celălalt ajunge la switch prin hub, dar destinația se află în spatele aceluiași port: a o trimite înapoi ar fi inutil (destinația l-a primit deja prin hub). Pe porturi cu o singură stație nu vei vedea aproape niciodată filtering.</p>

        <h3>3. Metodele de comutare</h3>
        <p>Cât de repede poate începe switch-ul să trimită un cadru? Depinde de câți octeți așteaptă înainte să înceapă. <b>MAC-ul destinație</b> e primul câmp, deci switch-ul <i>poate</i> decide după doar 6 octeți; dar FCS-ul — singura verificare de integritate — e ultimul câmp.</p>
        <Figure caption="Interactiv: alege metoda și mărimea cadrului; vezi după câți octeți începe transmisia și cât durează citirea la 100 Mbps / 1 / 10 Gbps.">
          <SwitchingMethods />
        </Figure>
        <Table head={['Metodă', 'Începe după', 'Verifică FCS înainte?', 'Avantaj / dezavantaj']} hlCol={0} rows={[
          [<G id="store-and-forward" />, 'tot cadrul', 'da', 'nu propagă cadre corupte; permite viteze diferite; latență proporțională cu cadrul'],
          [<G id="cut-through" />, '6 octeți (MAC destinație)', 'nu', 'latență minimă; propagă cadre corupte'],
          [<G id="fragment-free" />, '64 de octeți', 'nu', 'filtrează runts; metodă istorică'],
        ]} />
        <Callout kind="info" title="Cu ce se întâlnește un începător">
          Pe switch-urile Catalyst de campus lucrezi, de regulă, cu store-and-forward; cut-through apare în materialele despre data center cu latență mică. Comportamentul exact depinde de platformă — la examen interesează diferența de principiu: <b>doar store-and-forward verifică FCS-ul înainte de a trimite</b>.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: de ce 64 de octeți și de ce nu retransmite Ethernet">
        <p>Minimul de 64 B vine din Ethernet-ul partajat: emițătorul trebuie să mai transmită când semnalul unei coliziuni se întoarce de la capătul cel mai îndepărtat al segmentului (timpul de slot, 512 biți). Un cadru mai scurt ar putea fi terminat înainte ca emițătorul să afle de coliziune. De aceea fragmentele de coliziune (runts) sunt mai scurte de 64 B, iar metoda fragment-free le filtrează așteptând 64 B.</p>
        <p>Ethernet este conceput ca o legătură „best effort”: detectează erorile (FCS) și aruncă, dar nu cere retransmisia. Fiabilitatea se obține deasupra (TCP) — vezi topicul 1.5.</p>
      </DeepDive>

      <Traps items={[
        <>Doar <b>store-and-forward</b> verifică FCS-ul înainte de forward; cut-through și fragment-free nu.</>,
        <>Cadru: <b>64–1518 B</b> (1522 cu 802.1Q). Payload: <b>46–1500 B</b>. Preamble/SFD nu se numără.</>,
        <>„Filter” nu înseamnă firewall: înseamnă că destinația e pe același port de unde a venit cadrul.</>,
        <>Switch-ul <b>nu</b> modifică adresele MAC din cadru (spre deosebire de un router, care refăcă cadrul).</>,
      ]} />
      <InlineQuiz ids={['1.13-012', '1.13-013', '1.13-015', '1.13-018']} />
    </section>
  );
}

/* ======================================================================
   1.13.c — Frame flooding
   ====================================================================== */
export function Flooding() {
  return (
    <section id="flooding" className="section">
      <SectionHead id="flooding" code="1.13.c" title="Frame flooding" />
      <Summary>
        <p><G id="flooding">Flooding</G> înseamnă să trimiți cadrul pe <b>toate porturile VLAN-ului, mai puțin cel de intrare</b>. Se aplică pentru <b><G id="unknown-unicast">unknown unicast</G></b>, <b>broadcast</b> și <b>multicast</b> (fără <G id="igmp-snooping" />). Rămâne în VLAN, dar trece prin trunk-uri spre alte switch-uri. Fără protecție împotriva buclelor (STP), flooding-ul produce un <b>broadcast storm</b>.</p>
      </Summary>

      <Detailed title="Cele trei cazuri de flooding">
        <Figure caption="Interactiv: A trimite un cadru. Compară cine îl primește fizic și cine îl procesează în fiecare caz; ultimul caz arată efectul IGMP snooping.">
          <FloodCases />
        </Figure>
        <Table head={['Caz', 'De ce se inundă', 'Cine procesează cadrul', 'Se oprește la…']} hlCol={0} rows={[
          [<G id="unknown-unicast" />, 'switch-ul nu știe unde e destinația', 'doar destinația; ceilalți îl ignoră (MAC ≠ al lor)', 'VLAN'],
          ['Broadcast (ffff.ffff.ffff)', 'e destinat tuturor (ARP, DHCP Discover)', 'toate stațiile din VLAN', 'VLAN (domeniul de broadcast)'],
          ['Multicast', 'switch-ul nu știe cine face parte din grup', 'doar abonații grupului', 'VLAN'],
        ]} />
        <p><b>De ce e normal ca stațiile necorespunzătoare să primească cadrul?</b> La nivel 2, o placă de rețea compară MAC-ul destinație cu al ei: dacă nu se potrivește (și nu e broadcast/multicast la care s-a abonat), cadrul este ignorat de hardware, fără să ajungă la procesor. Costul flooding-ului este doar lățimea de bandă folosită degeaba.</p>
        <p><b>Flooding-ul este mecanismul de „descoperire”</b>: la primul cadru către o stație necunoscută, el garantează că cadrul ajunge totuși acolo. Răspunsul destinației o face cunoscută, iar traficul ulterior devine unicast direct. Cu cât tabela e mai completă, cu atât mai puțin flooding.</p>

        <h3>Broadcast-uri frecvente</h3>
        <ul>
          <li><b><G id="arp" /> request</b> — „cine are 192.168.1.1?”, către <code>ffff.ffff.ffff</code>; răspunsul ARP e unicast.</li>
          <li><b><G id="dhcp">DHCP</G> Discover</b> — clientul fără IP caută un server.</li>
          <li>Anunțuri ale unor protocoale (Windows, mDNS, STP BPDU către <code>0180.c200.0000</code> — acela e multicast rezervat).</li>
        </ul>
        <Callout kind="tip" title="IGMP snooping">
          Multicast-ul fără <G id="igmp-snooping" /> e tratat ca broadcast. Cu snooping, switch-ul ascultă mesajele IGMP Join ale gazdelor și trimite grupul doar porturilor abonate (și spre routerul multicast). Grupurile link-local 224.0.0.x rămân inundate.
        </Callout>

        <h3>Flooding + buclă = broadcast storm</h3>
        <p>Antetul Ethernet nu are TTL. Dacă două switch-uri sunt legate prin două cabluri, fiecare inundă broadcast-ul pe ambele; cadrul se întoarce și este inundat din nou, la nesfârșit, copii multiplicându-se. În câteva secunde legăturile și procesoarele se saturează. Soluția este <G id="stp" /> (topicul 2.5), care blochează logic una dintre căi. Un indiciu al buclei este <G id="mac-flapping" />.</p>
      </Detailed>

      <DeepDive title="Deep dive: flooding ca vulnerabilitate">
        <p>Un atacator poate trimite cadre cu mii de adrese sursă inventate până umple CAM-ul (MAC flooding). Stațiile reale nu mai încap în tabelă, iar traficul către ele devine unknown unicast, deci este inundat și atacatorul îl poate captura. Măsura: port security, care limitează câte adrese poate învăța un port (Domeniul 5).</p>
      </DeepDive>

      <Traps items={[
        <>Flooding-ul <b>nu iese niciodată pe portul de intrare</b> și <b>nu trece de VLAN</b> (decât prin trunk-uri, în același VLAN).</>,
        <>Un router <b>nu</b> transmite broadcast-uri; un switch le inundă.</>,
        <>Unknown unicast nu e eroare și nu e aruncat — e o stare temporară până răspunde destinația.</>,
        <>Fiecare port al switch-ului este un domeniu de coliziune, dar flooding-ul arată că tot VLAN-ul e <b>un singur domeniu de broadcast</b>.</>,
      ]} />
      <InlineQuiz ids={['1.13-023', '1.13-024', '1.13-028', '1.13-029']} />
    </section>
  );
}

/* ======================================================================
   1.13.d — MAC address table
   ====================================================================== */
export function Table113() {
  return (
    <section id="table" className="section">
      <SectionHead id="table" code="1.13.d" title="MAC address table" />
      <Summary>
        <p><G id="mac-table">Tabela MAC</G> (în documentația veche „CAM table”) conține pentru fiecare intrare <b>VLAN, adresă MAC, tip (DYNAMIC / STATIC) și port</b>. O citești cu <code>show mac address-table</code>, o golești cu <code>clear mac address-table dynamic</code> și poți adăuga intrări statice. Numeroase MAC-uri pe același port înseamnă, de obicei, că în spatele portului e un alt switch.</p>
      </Summary>

      <Detailed title="Cum arată tabela și cum o citești">
        <p>Tabela trăiește în <G id="cam" />, o memorie hardware pe care switch-ul o interoghează după conținut, într-un singur ciclu. Aceasta e ceea ce permite comutarea la viteza liniei.</p>
        <Table head={['Coloană', 'Ce înseamnă']} hlCol={0} rows={[
          ['Vlan', 'VLAN-ul în care a fost învățată adresa (intrarea e per VLAN)'],
          ['Mac Address', 'adresa învățată, în notația Cisco cu puncte'],
          ['Type', 'DYNAMIC = învățat, expiră; STATIC = configurat sau intrare internă (CPU), nu expiră'],
          ['Ports', 'portul prin care adresa e accesibilă; pe un uplink apar mai multe adrese'],
        ]} />
        <Figure caption="Două switch-uri legate printr-un uplink: pe Gi0/1 apar MAC-urile stațiilor de pe celălalt switch — mai multe adrese pe același port înseamnă „alt switch în spate”.">
          <TwoSwitches />
        </Figure>
        <p>Intrările interne cu tip STATIC și port CPU (de exemplu adrese multicast de control) apar pe unele platforme și nu trebuie șterse. Exemple de comenzi și output-uri ilustrative sunt în secțiunea „Exemple de configurare și verificare”.</p>

        <h3>Comenzi esențiale</h3>
        <Table head={['Scop', 'Comandă']} hlCol={1} rows={[
          ['toată tabela', <code>show mac address-table</code>],
          ['doar intrările dinamice', <code>show mac address-table dynamic</code>],
          ['o adresă / un port / un VLAN', <code>show mac address-table address 00cc.cccc.cccc</code>],
          ['numărul de intrări', <code>show mac address-table count</code>],
          ['aging time', <code>show mac address-table aging-time</code>],
          ['golește intrările dinamice', <code>clear mac address-table dynamic</code>],
          ['schimbă aging-ul', <code>mac address-table aging-time 600</code>],
          ['intrare statică', <code>mac address-table static 0011.2233.4455 vlan 10 interface GigabitEthernet0/1</code>],
        ]} />
        <Callout kind="warn" title="Sintaxă veche și nume de interfețe">
          Pe IOS mai vechi comenzile folosesc liniuță: <code>show mac-address-table</code>. Pe Packet Tracer și pe unele imagini se acceptă ambele forme. Verifică cu <code>?</code> pe echipamentul tău.
        </Callout>

        <h3>De ce ai folosi intrări statice</h3>
        <p>O intrare statică leagă manual un MAC și un VLAN de un port: nu expiră, nu poate fi „mutată” de un cadru de pe alt port și supraviețuiește comenzii <code>clear mac address-table dynamic</code>. Se folosește pentru servere și imprimante care nu trebuie să dispară din tabelă, sau ca măsură de securitate; pe unele platforme poți chiar asocia un MAC cu <code>drop</code>. Intrările „sticky” ale port security apar tot ca STATIC (Domeniul 5).</p>
      </Detailed>

      <Traps items={[
        <>Comanda corectă: <code>show mac address-table</code> (pe IOS vechi: <code>show mac-address-table</code>). Nu <code>show mac</code>.</>,
        <><code>clear mac address-table dynamic</code> <b>nu</b> șterge intrările statice.</>,
        <>Un port cu multe adrese MAC nu e „defect”: de obicei e un uplink spre alt switch, un hub sau un AP.</>,
        <>Tabela MAC leagă MAC de port; <b>tabela ARP</b> leagă IP de MAC. Sunt diferite.</>,
      ]} />
      <InlineQuiz ids={['1.13-032', '1.13-033', '1.13-036', '1.13-039']} />
    </section>
  );
}
