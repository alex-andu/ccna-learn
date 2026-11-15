import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Photo, Summary, Table, Traps } from '../../components/Lesson';
import { Channels24, Channels5, RFBehaviors, RFWave, RssiScale } from '../../diagrams/rf';
import { CsmaCa, Handshake4Way, SecurityTimeline, SsidVlanMap, WlanTopologies } from '../../diagrams/wlan';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';

/* ======================================================================
   0. Introducere — imaginea de ansamblu
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.11" title="Wireless în 5 minute — imaginea de ansamblu" />
      <Summary>
        <p>O rețea <G id="wlan" /> înlocuiește cablul dintre client și rețea cu <b>unde radio</b> (<G id="rf" />).
          Regulile sunt scrise de <G id="ieee" /> în familia de standarde <G id="80211" />, iar <G id="wifi-alliance" /> certifică faptul că echipamentele le respectă.
          Pe un canal Wi-Fi, un singur dispozitiv transmite la un moment dat (<G id="half-duplex" />), după regulile <G id="csma-ca" />.</p>
      </Summary>

      <Detailed>
        <p>Într-o rețea cablată, fiecare dispozitiv are propriul fir până la switch: comunicația este privată, full-duplex, fără coliziuni. În wireless, <b>aerul este un mediu comun</b>: toți cei de pe același canal îl împart, iar oricine se află în raza de acoperire poate „asculta”. Din această diferență fundamentală decurg cele patru teme ale topicului 1.11:</p>
        <Table head={['Cod Cisco', 'Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['1.11.c', 'RF', 'Cum circulă semnalul prin aer? (frecvență, putere, benzi, standarde 802.11)'],
          ['1.11.a', 'Nonoverlapping Wi-Fi channels', 'Cum împart mai multe AP-uri spectrul fără să se deranjeze?'],
          ['1.11.b', 'SSID', 'Cum se identifică și se găsesc rețelele wireless? (SSID, BSSID, BSS, ESS)'],
          ['1.11.d', 'Encryption', 'Cum împiedicăm pe ceilalți să citească sau să modifice traficul? (WEP → WPA3)'],
        ]} />
        <Callout kind="info" title="De ce începem cu RF (1.11.c) și nu cu 1.11.a?">
          Cisco listează sub-topicurile alfabetic (a, b, c, d), nu în ordinea logică de învățare. Canalele (a) sunt felii din benzile de frecvență, deci trebuie să știi întâi ce e o frecvență (c). Păstrăm codurile oficiale, dar le parcurgem în ordinea c → a → b → d.
        </Callout>

        <h3>Componentele pe care le vei întâlni</h3>
        <ul>
          <li><b><G id="ap" /> (Access Point)</b> — creează celula radio și o leagă de rețeaua cablată. De obicei se montează pe tavan și e alimentat prin <G id="poe" />.</li>
          <li><b><G id="wlc" /> (Wireless LAN Controller)</b> — „creierul” care gestionează centralizat AP-urile (detaliat în 2.6–2.9).</li>
          <li><b>Clienții (<G id="sta" />)</b> — laptopuri, telefoane, imprimante, senzori IoT.</li>
          <li><b>Rețeaua cablată (<G id="ds" />)</b> — switch-urile la care sunt legate AP-urile; fiecare SSID ajunge, de regulă, pe un <G id="vlan" /> separat.</li>
        </ul>
        <div className="photo-grid">
          <Photo file="aironet-1131ag.jpg" caption="AP enterprise (Cisco Aironet 1131AG) — antene interne, montaj pe tavan" />
          <Photo file="aironet-1100.jpg" caption="AP Cisco Aironet 1100 — generația 802.11b/g" />
          <Photo file="yagi-wifi.jpg" caption="Antenă direcțională Yagi pentru Wi-Fi — concentrează semnalul într-o direcție" />
        </div>

        <h3>Wireless vs. cablat — diferențele care contează</h3>
        <Table head={['Aspect', 'Ethernet (802.3) pe switch', 'Wi-Fi (802.11)']} rows={[
          ['Mediu', 'cablu dedicat per port', 'aer — partajat de toți cei de pe canal'],
          ['Duplex', 'full-duplex', <><G id="half-duplex" /> pe un canal</>],
          ['Acces la mediu', 'fără contenție (switch)', <><G id="csma-ca" /> + ACK pentru fiecare cadru unicast</>],
          ['Confidențialitate', 'trebuie acces fizic la cablu', 'oricine în rază poate capta → criptarea e obligatorie'],
          ['Factori externi', 'rar (cablu defect, EMI)', 'interferențe, distanță, pereți, alte rețele, microunde'],
          ['Capacitate', 'per port (de exemplu 1 Gbps fiecare)', 'împărțită între toți clienții unui AP/canal'],
        ]} />
        <Analogy>Ethernetul pe switch e ca un telefon fix între două persoane. Wi-Fi-ul e ca o sală de ședințe: toată lumea aude tot, vorbește câte unul, iar dacă vrei confidențialitate trebuie să vorbești „codat”.</Analogy>
      </Detailed>

      <DeepDive title="Deep dive: cum ascultă Wi-Fi înainte să vorbească (CSMA/CA)">
        <p>Un radio nu poate asculta pe același canal în timp ce transmite (propriul semnal acoperă tot), deci <b>nu poate detecta coliziunile</b> cum făcea Ethernetul cu hub (<G id="csma-cd" />). Soluția este <b>evitarea</b> lor, plus confirmarea fiecărui cadru:</p>
        <Figure caption="CSMA/CA: ascultă → așteaptă DIFS → backoff aleatoriu → transmite → receptorul răspunde cu ACK după SIFS.">
          <CsmaCa />
        </Figure>
        <p>Problema <G id="hidden-node" />: doi clienți aflați în colțuri opuse ale celulei aud AP-ul, dar nu se aud între ei. Amândoi cred că mediul e liber și transmit simultan. <G id="rts-cts" /> rezolvă problema: CTS-ul trimis de AP e auzit de toți, iar aceștia tac pe durata anunțată (NAV — Network Allocation Vector).</p>
      </DeepDive>

      <Traps items={[
        <>Wi-Fi folosește <b>CSMA/CA</b> (Collision <b>Avoidance</b>), nu CSMA/CD. CD = Ethernet half-duplex.</>,
        <>WPA/WPA2/WPA3 sunt certificări ale <b>Wi-Fi Alliance</b>; 802.11a/b/g/n/ac/ax/be sunt amendamente <b>IEEE</b>.</>,
        <>Un AP este un dispozitiv de <b>nivel 2</b> (bridge între 802.11 și 802.3), nu un router — chiar dacă routerul de acasă are un AP integrat.</>,
      ]} />
    </section>
  );
}

/* ======================================================================
   1.11.c — RF
   ====================================================================== */
export function RF() {
  return (
    <section id="rf" className="section">
      <SectionHead id="rf" code="1.11.c" title="RF — radiofrecvența și standardele 802.11" />
      <Summary>
        <p>Wi-Fi transmite date prin unde electromagnetice în benzile de <b>2.4 GHz</b>, <b>5 GHz</b> și <b>6 GHz</b>.
          O frecvență mai mare înseamnă o lungime de undă mai mică: <b>rază mai mică, dar mai multe canale și viteză mai mare</b>.
          Puterea se măsoară în <G id="dbm" /> (logaritmic: +3 dB = ×2, +10 dB = ×10), iar calitatea legăturii se judecă după <G id="rssi" /> și <G id="snr" />.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Unda radio">
        <p>O undă radio are trei proprietăți pe care trebuie să le înțelegi:</p>
        <ul>
          <li><b>Frecvența</b> (<G id="hz" />) — de câte ori pe secundă oscilează unda. 2.4 GHz = 2.4 miliarde de oscilații pe secundă.</li>
          <li><b>Lungimea de undă (λ)</b> — distanța fizică a unui ciclu: <code>λ = c / f</code> (c ≈ 300.000 km/s). La 2.4 GHz λ ≈ 12.5 cm, la 5 GHz ≈ 6 cm, la 6 GHz ≈ 5 cm.</li>
          <li><b>Amplitudinea</b> — „înălțimea” undei, adică puterea semnalului.</li>
        </ul>
        <Figure caption="Interactiv: schimbă frecvența și observă cum se scurtează lungimea de undă. Puterea (amplitudinea) nu depinde de frecvență.">
          <RFWave />
        </Figure>
        <Callout kind="tip" title="De ce contează lungimea de undă?">
          Undele mai scurte pierd energie mai repede cu distanța (<G id="fspl" />) și sunt absorbite mai ușor de pereți și de oameni. De aceea, la aceeași putere, <b>2.4 GHz ajunge mai departe</b>, iar <b>5/6 GHz are celule mai mici</b>. În birourile dense, celulele mici sunt chiar un avantaj: mai multe AP-uri, mai puțini clienți pe fiecare.
        </Callout>

        <h3>2. Benzile Wi-Fi</h3>
        <Table head={['Bandă', 'Interval (UE / România)', 'Canale de 20 MHz care nu se suprapun', 'Caracteristici']} rows={[
          ['2.4 GHz', '2.400 – 2.4835 GHz (canalele 1–13)', '3 (1, 6, 11)', 'rază mare, penetrare bună; aglomerată (Bluetooth, microunde, vecini) — bandă ISM'],
          ['5 GHz', '5.150 – 5.350 + 5.470 – 5.725 GHz', '19 în UE (25 în SUA)', 'multe canale, mai puțină interferență; o parte din canale cer DFS'],
          ['6 GHz', '5.945 – 6.425 GHz (UE); 5.925 – 7.125 GHz (SUA)', '24 în UE (59 în SUA)', 'doar Wi-Fi 6E/7; „curată” (fără dispozitive vechi), obligatoriu WPA3'],
        ]} />
        <p className="small muted">În România, regulile de utilizare (canale, putere maximă) sunt stabilite de <G id="ancom" /> pe baza deciziilor europene (<G id="etsi" />). Materialele CCNA folosesc adesea regulile americane (<G id="fcc" />). Pentru examen: <b>1, 6, 11</b>.</p>

        <h3>3. Puterea: mW, dBm și „regula lui 3 și 10”</h3>
        <p>Puterea de emisie se exprimă în <G id="mw" /> (liniar) sau în <G id="dbm" /> (logaritmic, raportat la 1 mW). Semnalul recepționat e foarte mic (miliardimi de mW), de aceea valorile sunt <b>negative</b>: −40 dBm, −70 dBm.</p>
        <Table head={['dBm', 'mW', 'Cum ajungi acolo']} hlCol={0} rows={[
          ['0', '1', 'referința'], ['3', '2', '+3 dB = ×2'], ['10', '10', '+10 dB = ×10'], ['13', '20', '10 dBm + 3 dB'],
          ['17', '50', '20 dBm − 3 dB'], ['20', '100', '+10 +10'], ['30', '1000 (1 W)', '+10 +10 +10'], ['−3', '0.5', '−3 dB = ÷2'],
        ]} />
        <Analogy>Decibelii sunt ca treptele unui volum de radio: fiecare +3 dublează puterea, fiecare +10 o înmulțește cu zece. Contează diferența de trepte, nu valoarea de pornire.</Analogy>
        <ul>
          <li><b><G id="eirp" /></b> = puterea TX − pierderile pe cablu + câștigul antenei (<G id="dbi" />). Legea limitează EIRP-ul (de exemplu 100 mW = 20 dBm în 2.4 GHz în UE).</li>
          <li><b><G id="rssi" /></b> — cât de puternic primește clientul semnalul.</li>
          <li><b><G id="snr" /></b> = semnal − zgomot. Un SNR mare permite modulații dense și deci viteze mari.</li>
        </ul>
        <Figure caption="Valori RSSI orientative. Ținta uzuală de proiectare: −67 dBm pentru voce/video, cu SNR ≥ 25 dB.">
          <RssiScale />
        </Figure>

        <h3>4. Ce se întâmplă cu semnalul în drum spre client</h3>
        <RFBehaviors />
        <p style={{ marginTop: 12 }}>Pe lângă acestea, există <b>pierderea în spațiu liber</b> (semnalul scade cu distanța, chiar fără obstacole) și <b><G id="multipath" /></b> (copiile reflectate ajung cu întârziere). Standardele moderne (OFDM, MIMO) chiar profită de multipath.</p>
        <h4>Tipuri de antene</h4>
        <p>O antenă nu „produce” energie, ci o <b>redistribuie</b>: câștigul (<G id="dbi" />) arată cât de mult o concentrează într-o direcție.</p>
        <div className="photo-grid">
          <Photo file="omni-antenna.jpg" caption="Omnidirecțională (dipol, ≈2–6 dBi) — radiază uniform în plan orizontal; tipică pe AP-uri și routere" />
          <Photo file="patch-antenna-24ghz.jpg" caption="Patch 2.4 GHz (≈6–9 dBi) — semi-direcțională; pe pereți, holuri, depozite" />
          <Photo file="yagi-wifi.jpg" caption="Yagi (≈10–16 dBi) — foarte direcțională; legături punct-la-punct între clădiri" />
        </div>
      </Detailed>

      <Detailed title="Explicația detaliată — 5. Standardele 802.11 (pe larg)">
        <p>Fiecare generație a adus o idee nouă. Nu trebuie să memorezi doar tabelul — înțelege <b>ce problemă a rezolvat fiecare</b>, iar cifrele vor veni de la sine.</p>
        <Table head={['Standard', 'Nume Wi-Fi', 'An', 'Bandă', 'Viteză max. (teoretică)', 'Lățimi canal', 'Tehnologie cheie']} hlCol={0} rows={[
          ['802.11', '—', '1997', '2.4 GHz', '2 Mbps', '22 MHz', 'DSSS/FHSS — standardul original'],
          [<G id="80211b">802.11b</G>, '(neoficial Wi-Fi 1)', '1999', '2.4 GHz', '11 Mbps', '22 MHz', <G id="dsss">DSSS</G>],
          [<G id="80211a">802.11a</G>, '(neoficial Wi-Fi 2)', '1999', '5 GHz', '54 Mbps', '20 MHz', <><G id="ofdm">OFDM</G> — primul</>],
          [<G id="80211g">802.11g</G>, '(neoficial Wi-Fi 3)', '2003', '2.4 GHz', '54 Mbps', '20 MHz', 'OFDM în 2.4 GHz, compatibil cu b'],
          [<G id="80211n">802.11n</G>, 'Wi-Fi 4', '2009', '2.4 + 5 GHz', '600 Mbps', '20, 40', <><G id="mimo">MIMO</G> (4 fluxuri), channel bonding</>],
          [<G id="80211ac">802.11ac</G>, 'Wi-Fi 5', '2013', 'doar 5 GHz', '≈6.9 Gbps', '20–160', <>256-QAM, 8 fluxuri, <G id="mu-mimo">MU-MIMO</G> DL</>],
          [<G id="80211ax">802.11ax</G>, 'Wi-Fi 6 / 6E', '2019 (cert.)', '2.4 + 5 (+6 la 6E)', '≈9.6 Gbps', '20–160', <><G id="ofdma">OFDMA</G>, 1024-QAM, MU-MIMO UL+DL, <G id="bss-coloring">BSS Coloring</G>, <G id="twt">TWT</G></>],
          [<G id="80211be">802.11be</G>, 'Wi-Fi 7', '2024 (cert.)', '2.4 + 5 + 6 GHz', '≈46 Gbps', '20–320', <>4096-QAM, 320 MHz, <G id="mlo">MLO</G>, 16 fluxuri</>],
        ]} />
        <Callout kind="exam" title="Cum să reții benzile (cel mai testat lucru)">
          <b>b, g</b> → doar 2.4 GHz · <b>a, ac</b> → doar 5 GHz · <b>n, ax</b> → ambele (ax și 6 GHz ca 6E) · <b>be</b> → toate trei.
          Mnemonic: „<b>a</b>c<b>a</b>s<b>ă</b> la 5” — <b>a</b> și <b>ac</b> stau în 5 GHz.
        </Callout>

        <h4>802.11b și 802.11a (1999) — două drumuri diferite</h4>
        <p><b>802.11b</b> a ales banda ieftină de 2.4 GHz și tehnica <G id="dsss" />: fiecare bit e „împrăștiat” pe un canal lat de 22 MHz. Robust, dar lent (11 Mbps), iar lățimea de 22 MHz e motivul pentru care azi avem doar 3 canale libere în 2.4 GHz. <b>802.11a</b> a ales banda de 5 GHz (mai scumpă la vremea aceea) și o tehnică nouă, <G id="ofdm" />: canalul de 20 MHz e împărțit în 52 de sub-purtătoare înguste, transmise în paralel → 54 Mbps.</p>

        <h4>802.11g (2003) — viteza lui „a” în banda lui „b”</h4>
        <p>Folosește OFDM (54 Mbps) în 2.4 GHz și rămâne compatibil cu clienții 802.11b. Prețul compatibilității: când în celulă există un client „b”, AP-ul activează <i>protection mode</i> (<G id="rts-cts" /> sau CTS-to-self), pentru că un client „b” nu înțelege OFDM, iar performanța scade dramatic. De aceea, azi se dezactivează ratele 802.11b.</p>

        <h4>802.11n — Wi-Fi 4 (2009): MIMO și canale late</h4>
        <ul>
          <li><b><G id="mimo" /></b> — mai multe antene transmit simultan mai multe <G id="spatial-stream">fluxuri spațiale</G> pe același canal (maximum 4). Notația „3×3:2” = 3 antene TX, 3 RX, 2 fluxuri.</li>
          <li><b><G id="channel-bonding" /></b> — două canale de 20 MHz formează unul de 40 MHz (viteză ×2).</li>
          <li><b>Agregarea cadrelor</b> (A-MPDU/A-MSDU) — mai multe cadre trimise „la pachet”, cu mai puțin overhead.</li>
          <li>Rezultat: 150 Mbps per flux × 4 = <b>600 Mbps</b>. Este primul standard care funcționează în <b>ambele benzi</b>.</li>
        </ul>

        <h4>802.11ac — Wi-Fi 5 (2013): gigabit, doar în 5 GHz</h4>
        <ul>
          <li>Canale de 80 și 160 MHz, modulație 256-<G id="qam" /> (8 biți/simbol), până la 8 fluxuri spațiale.</li>
          <li><b>Wave 1</b> (≈1.3 Gbps în produse) și <b>Wave 2</b> (160 MHz, <G id="mu-mimo" /> pe <i>downlink</i> către maximum 4 clienți simultan).</li>
          <li>Funcționează <b>doar în 5 GHz</b>. Un router „AC1200” deservește 2.4 GHz prin 802.11n.</li>
        </ul>

        <h4>802.11ax — Wi-Fi 6 / 6E: eficiență, nu doar viteză</h4>
        <p>Problema rezolvată: rețelele <b>dense</b> (stadioane, birouri open-space, mii de dispozitive IoT). Mulți clienți trimit puține date, iar înainte fiecare transmisie ocupa tot canalul.</p>
        <ul>
          <li><b><G id="ofdma" /></b> — canalul e împărțit în <i>resource units</i> alocate unor clienți diferiți în aceeași transmisie.</li>
          <li><b>MU-MIMO</b> pe uplink și downlink (până la 8 clienți).</li>
          <li><b>1024-QAM</b> (10 biți/simbol) → ≈9.6 Gbps teoretic.</li>
          <li><b><G id="bss-coloring" /></b> — reduce efectul <G id="cci" /> între AP-uri vecine pe același canal.</li>
          <li><b><G id="twt" /></b> — clienții „dorm” între ferestre programate, deci consumă mai puțină baterie.</li>
          <li><b>Wi-Fi 6E</b> = 802.11ax în banda de 6 GHz (necesită WPA3).</li>
        </ul>

        <h4>802.11be — Wi-Fi 7 (2024): conținut extra peste CCNA v1.1</h4>
        <ul>
          <li>Canale de <b>320 MHz</b> (în 6 GHz), modulație <b>4096-QAM</b> (12 biți/simbol), până la 16 fluxuri → ≈46 Gbps teoretic.</li>
          <li><b><G id="mlo" /></b> — un client folosește simultan mai multe benzi (de exemplu 5 + 6 GHz): viteză mai mare, latență mai mică și fiabilitate.</li>
        </ul>
        <Callout kind="warn" title="Viteza de pe cutie ≠ viteza reală">
          Cifrele maxime presupun toate fluxurile, cel mai lat canal și cea mai bună modulație, la un metru de AP. În realitate, Wi-Fi e half-duplex, are overhead (ACK, beacons, backoff), iar clientul are de obicei doar 2 fluxuri. Debitul real e adesea 40–60% din rata de conectare.
        </Callout>
        <div className="photo-grid"><Photo file="wifi6-router-back.jpg" caption="Router Wi-Fi 6 (802.11ax) — antene externe pentru MIMO" /></div>
      </Detailed>

      <DeepDive title="Deep dive: modulație, QAM și de ce scade viteza cu distanța">
        <p><G id="modulation" /> înseamnă modul în care biții „modifică” unda. Cu cât un simbol transportă mai mulți biți, cu atât punctele din diagrama de constelație sunt mai apropiate și e nevoie de un semnal mai curat (SNR mare):</p>
        <Table head={['Modulație', 'Biți/simbol', 'SNR necesar (orientativ)', 'Standard']} rows={[
          ['BPSK', '1', '≈5 dB', 'toate (rata minimă)'], ['QPSK', '2', '≈8 dB', 'toate'], ['16-QAM', '4', '≈15 dB', 'a/g/n/ac/ax'],
          ['64-QAM', '6', '≈22 dB', 'a/g/n/ac/ax'], ['256-QAM', '8', '≈29 dB', 'ac/ax/be'], ['1024-QAM', '10', '≈35 dB', 'ax/be'], ['4096-QAM', '12', '≈40+ dB', 'be'],
        ]} />
        <p>Combinația modulație + rată de codare + număr de fluxuri + lățime de canal se numește <b>MCS</b> (Modulation and Coding Scheme). Pe măsură ce te îndepărtezi de AP, SNR-ul scade, iar clientul coboară automat pe MCS-uri mai robuste și mai lente (<i>rate shifting</i>). De aceea o celulă are „inele” de viteză.</p>
        <p><b>OFDM vs OFDMA:</b> în OFDM, la un moment dat, toate sub-purtătoarele canalului aparțin unui singur client. În OFDMA, ele sunt grupate în RU-uri (de exemplu 26, 52, 106 sub-purtătoare) alocate simultan mai multor clienți — ca un autobuz care duce mai mulți pasageri, în loc de câte un taxi pentru fiecare.</p>
      </DeepDive>

      <Traps items={[
        <><b>802.11ac nu funcționează în 2.4 GHz.</b> Dacă o întrebare spune „802.11ac în 2.4 GHz”, e greșit.</>,
        <><b>802.11g și 802.11a</b> au aceeași viteză (54 Mbps) și aceeași tehnică (OFDM), dar benzi diferite (g = 2.4, a = 5).</>,
        <><b>dBm vs dB:</b> dBm e o putere absolută (raportată la 1 mW); dB e un raport/diferență (câștig sau pierdere). SNR se exprimă în dB, RSSI în dBm.</>,
        <><b>RSSI negativ:</b> −50 dBm este MAI BUN decât −70 dBm (mai aproape de 0).</>,
        <><b>Frecvență mai mare ≠ rază mai mare.</b> 5/6 GHz au rază MAI MICĂ decât 2.4 GHz la aceeași putere.</>,
        <><b>MU-MIMO:</b> Wi-Fi 5 = doar downlink; Wi-Fi 6 = uplink + downlink.</>,
      ]} />
      <InlineQuiz ids={['1.11-014', '1.11-015', '1.11-020', '1.11-021']} />
    </section>
  );
}

/* ======================================================================
   1.11.a — canale
   ====================================================================== */
export function Channels() {
  return (
    <section id="channels" className="section">
      <SectionHead id="channels" code="1.11.a" title="Nonoverlapping Wi-Fi channels — canale care nu se suprapun" />
      <Summary>
        <p>O bandă este împărțită în <G id="channel">canale</G>. În <b>2.4 GHz</b> canalele sunt la doar 5 MHz unul de altul, dar ocupă ≈22 MHz, deci se suprapun. Singurele trei care nu se suprapun sunt <b>1, 6 și 11</b>.
          În <b>5 GHz</b> (și 6 GHz) canalele de 20 MHz nu se suprapun deloc, iar numărul lor mare permite planificări mult mai bune.</p>
      </Summary>
      <Detailed>
        <h3>De ce se suprapun canalele în 2.4 GHz</h3>
        <p>Canalul 1 este centrat pe 2412 MHz, canalul 2 pe 2417, canalul 3 pe 2422 și așa mai departe (+5 MHz la fiecare pas). Dar un semnal Wi-Fi are ≈20–22 MHz lățime, deci se întinde pe ±11 MHz în jurul centrului. Ca să nu se atingă, două canale trebuie să fie la cel puțin 5 numere distanță: 1 → 6 → 11.</p>
        <Figure caption="Interactiv: atinge canalele ca să le selectezi. Verde = fără suprapunere, roșu = canalele se suprapun (interferență ACI). Încearcă presetările.">
          <Channels24 />
        </Figure>
        <h3>Două tipuri de interferență</h3>
        <Table head={['Tip', 'Când apare', 'Efect', 'Cât de grav']} rows={[
          [<G id="cci">CCI</G>, 'AP-uri apropiate pe ACELAȘI canal (de exemplu 6 și 6)', 'dispozitivele se aud, își așteaptă rândul (CSMA/CA) → împart timpul de emisie', 'reduce capacitatea, dar cadrele sunt corecte'],
          [<G id="aci">ACI</G>, 'AP-uri apropiate pe canale care se SUPRAPUN (de exemplu 1 și 3)', 'nu se pot decoda reciproc → semnalul vecinului e zgomot → erori și retransmisii', 'mai grav decât CCI'],
        ]} />
        <Analogy>CCI e ca două grupuri care vorbesc aceeași limbă în aceeași cameră: se aud și vorbesc pe rând, deci încet, dar se înțeleg. ACI e ca un grup care vorbește peste muzica tare a vecinului: nimeni nu așteaptă pe nimeni, dar nimeni nu se mai înțelege.</Analogy>

        <h3>Planificarea canalelor — modelul „fagure”</h3>
        <p>AP-urile se așază astfel încât niciun AP să nu aibă un vecin pe același canal. Pentru <G id="roaming" />, celulele vecine trebuie să se suprapună ușor (≈10–20%) <b>în acoperire</b>, nu în frecvență.</p>
        <svg viewBox="0 0 520 230" role="img" aria-label="Plan de canale tip fagure 1/6/11" style={{ maxWidth: 520 }}>
          {[[90, 60, 1], [210, 60, 6], [330, 60, 11], [450, 60, 1], [150, 160, 11], [270, 160, 1], [390, 160, 6]].map(([x, y, ch], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={64} fill={ch === 1 ? 'var(--accent)' : ch === 6 ? 'var(--info)' : 'var(--violet)'} fillOpacity={0.12} stroke={ch === 1 ? 'var(--accent)' : ch === 6 ? 'var(--info)' : 'var(--violet)'} strokeOpacity={0.6} />
              <text x={x} y={y + 5} textAnchor="middle" style={{ fill: 'var(--text)', fontSize: 15, fontWeight: 700, fontFamily: 'Inter Variable' }}>ch {ch}</text>
            </g>
          ))}
        </svg>

        <h3>Banda de 5 GHz — multe canale, dar atenție la DFS și lățime</h3>
        <p>În 5 GHz, canalele sunt numerotate din 4 în 4 (36, 40, 44…), iar fiecare are 20 MHz, deci <b>nu se suprapun</b>. Frecvența centrală se calculează simplu: <code>5000 + 5 × n</code> MHz (canalul 36 = 5180 MHz).</p>
        <Figure caption="Interactiv: alege lățimea canalului și vezi câte canale independente rămân. Canalele portocalii cer DFS.">
          <Channels5 />
        </Figure>
        <ul>
          <li><b><G id="dfs" /></b> — pe canalele 52–144, AP-ul trebuie să cedeze canalul dacă detectează un radar. Pentru clienții sensibili (voce), mulți preferă canalele 36–48.</li>
          <li><b><G id="channel-bonding" /></b> — 40 MHz = 2 canale, 80 MHz = 4, 160 MHz = 8. Mai lat = mai rapid, dar cu mai puține canale pentru reutilizare. În enterprise se folosesc frecvent 20 sau 40 MHz.</li>
          <li><b>În 2.4 GHz nu se folosesc canale de 40 MHz</b> — ar ocupa practic toată banda.</li>
          <li>Pe un WLC Cisco, canalele și puterea sunt alese automat de <G id="rrm" /> (DCA + <G id="tpc" />).</li>
        </ul>
      </Detailed>
      <DeepDive title="Deep dive: varianta europeană 1/5/9/13 și canalul 14">
        <p>În UE sunt permise canalele 1–13. Dacă <b>toți</b> clienții folosesc OFDM (20 MHz, fără 802.11b), teoretic încap patru canale: 1, 5, 9 și 13, la 20 MHz distanță. În practică, marginile spectrale tot se ating ușor, iar majoritatea ghidurilor (inclusiv Cisco) recomandă tot 1/6/11. Canalul 14 (2484 MHz) a fost permis doar în Japonia și doar pentru 802.11b.</p>
        <p>În 6 GHz există o regulă utilă: canalele „PSC” (Preferred Scanning Channels: 5, 21, 37…) — clienții le scanează primele, ca să găsească rapid AP-urile Wi-Fi 6E printre cele 59 de canale.</p>
      </DeepDive>
      <Traps items={[
        <>Răspunsul standard CCNA pentru 2.4 GHz este <b>1, 6, 11</b>. Nu 1/5/9 și nici 1/7/13.</>,
        <>„Canale diferite” nu înseamnă „canale care nu se suprapun”: 1 și 3 sunt diferite, dar se suprapun → <b>ACI</b>.</>,
        <><b>CCI</b> = același canal; <b>ACI</b> = canale adiacente care se suprapun. ACI e mai grav.</>,
        <>Roamingul NU cere același canal pe toate AP-urile — dimpotrivă, AP-urile vecine trebuie să fie pe canale diferite.</>,
      ]} />
      <InlineQuiz ids={['1.11-001', '1.11-003', '1.11-004']} />
    </section>
  );
}

/* ======================================================================
   1.11.b — SSID
   ====================================================================== */
export function SSID() {
  return (
    <section id="ssid" className="section">
      <SectionHead id="ssid" code="1.11.b" title="SSID — cum se identifică și se găsesc rețelele" />
      <Summary>
        <p><G id="ssid" />-ul este <b>numele rețelei</b> (maximum 32 de octeți, sensibil la litere mari/mici). <G id="bssid" />-ul este <b>adresa MAC</b> care identifică unic o celulă (radio AP + SSID).
          Un AP cu clienții lui formează un <G id="bss" />; mai multe AP-uri cu același SSID formează un <G id="ess" /> (roaming); fără AP avem <G id="ibss" /> (ad hoc).</p>
      </Summary>
      <Detailed>
        <h3>SSID vs BSSID</h3>
        <Table head={['', 'SSID', 'BSSID']} rows={[
          ['Ce este', 'numele text al rețelei („CCNA-LAB”)', 'adresa MAC de 48 de biți a celulei (00:3a:7d:11:22:30)'],
          ['Cine îl alege', 'administratorul', 'derivat automat din MAC-ul radioului AP-ului'],
          ['Unic?', 'nu — mai multe AP-uri pot avea același SSID (ESS)', 'da — fiecare radio + SSID are propriul BSSID'],
          ['Unde îl vezi', 'în lista de rețele a telefonului', <code>netsh wlan show interfaces</code>],
        ]} />
        <h3>Topologii: BSS, ESS, IBSS</h3>
        <Figure caption="Comută între cele trei topologii. În ESS, același SSID e difuzat de mai multe AP-uri, pe canale diferite.">
          <WlanTopologies />
        </Figure>
        <ul>
          <li><b>BSS</b> — un AP + clienții lui. Aria acoperită se numește BSA (celula). Toată comunicația trece prin AP, chiar și între doi clienți vecini.</li>
          <li><b>ESS</b> — mai multe BSS-uri cu același SSID, legate prin rețeaua cablată (<G id="ds" />). Clientul decide singur când trece la alt AP (<G id="roaming" />).</li>
          <li><b>IBSS</b> — fără AP, clienții vorbesc direct (rar; Wi-Fi Direct e varianta modernă).</li>
          <li>Alte moduri pe care le vei întâlni în 2.6: <b>repeater</b>, <b>workgroup bridge</b>, <b>outdoor bridge</b>, <b>mesh</b>.</li>
        </ul>

        <h3>Cum găsește clientul rețeaua</h3>
        <ul>
          <li><b>Scanare pasivă</b> — clientul ascultă <G id="beacon">beacons</G> pe fiecare canal. Un AP trimite beacon-uri la ≈102.4 ms, cu SSID-ul, ratele suportate, securitatea și capabilitățile.</li>
          <li><b>Scanare activă</b> — clientul trimite <G id="probe">probe requests</G>, iar AP-urile răspund cu probe responses.</li>
        </ul>
        <p>Apoi urmează: <b>autentificarea 802.11</b> (Open System — doar formală) → <b>asocierea</b> (association request/response) → <b>securitatea</b> (<G id="4way" />, eventual precedat de <G id="dot1x" />) → <b><G id="dhcp" /></b>.</p>

        <h3>Mai multe SSID-uri pe același AP</h3>
        <p>Un AP poate difuza mai multe SSID-uri (<G id="mbss" />), fiecare cu propriul BSSID, propria securitate și, de regulă, propriul VLAN. Portul switch-ului spre AP devine atunci un <b>trunk 802.1Q</b> (detaliat în 2.7).</p>
        <Figure caption="Un singur AP, trei rețele logice: fiecare SSID ajunge pe alt VLAN prin trunk-ul 802.1Q.">
          <SsidVlanMap />
        </Figure>
        <Callout kind="warn" title="Ascunderea SSID-ului NU e securitate">
          Cu „SSID broadcast” dezactivat, AP-ul doar scoate numele din beacons. Clienții legitimi trimit SSID-ul în clar în probe requests și association requests, așa că un sniffer îl află în câteva secunde. Securitatea reală înseamnă <b>WPA2/WPA3</b>.
        </Callout>
      </Detailed>
      <DeepDive title="Deep dive: cadrele 802.11 (management, control, data)">
        <Table head={['Tip cadru', 'Exemple', 'Rol']} rows={[
          ['Management', 'beacon, probe req/resp, authentication, association req/resp, deauthentication, disassociation', 'descoperirea și „intrarea” în rețea; protejate de PMF (802.11w)'],
          ['Control', 'ACK, RTS, CTS, Block ACK', 'coordonarea accesului la mediu'],
          ['Data', 'date, QoS data, null data (power save)', 'transportă traficul utilizatorilor'],
        ]} />
        <p>Un cadru 802.11 are până la <b>4 câmpuri de adresă MAC</b> (spre deosebire de cele 2 din Ethernet): receptor, transmițător, BSSID și uneori sursa/destinația finală. Este nevoie de ele pentru că AP-ul face bridging între clientul wireless și destinația din rețeaua cablată.</p>
      </DeepDive>
      <Traps items={[
        <>SSID = maximum <b>32</b> de caractere. Parola WPA2-PSK = <b>8–63</b> de caractere ASCII. Nu le confunda.</>,
        <><b>BSSID</b> e o adresă MAC, nu un nume. Un AP dual-band cu 3 SSID-uri are <b>6</b> BSSID-uri.</>,
        <>Un singur AP = <b>BSS</b>; mai multe AP-uri cu același SSID = <b>ESS</b>; fără AP = <b>IBSS</b>.</>,
        <>Ascunderea SSID-ului și filtrarea MAC <b>nu</b> sunt măsuri de securitate reale.</>,
      ]} />
      <InlineQuiz ids={['1.11-007', '1.11-009', '1.11-010', '1.11-013']} />
    </section>
  );
}

/* ======================================================================
   1.11.d — criptare
   ====================================================================== */
export function Encryption() {
  return (
    <section id="encryption" className="section">
      <SectionHead id="encryption" code="1.11.d" title="Encryption — protejarea traficului wireless" />
      <Summary>
        <p>Pentru că oricine aflat în rază poate capta semnalul, traficul wireless trebuie <b>criptat</b>. Evoluția: <G id="wep" /> (RC4, spart) → <G id="wpa" /> (TKIP, depreciat) → <G id="wpa2" /> (<G id="aes" />-<G id="ccmp" />, standardul actual) → <G id="wpa3" /> (<G id="sae" />, <G id="pmf" /> obligatoriu, GCMP-256).
          Cheile de sesiune se stabilesc prin <G id="4way" />. Detaliile securității wireless continuă în topicurile 5.9 și 5.10.</p>
      </Summary>
      <Detailed>
        <h3>Ce trebuie să asigure securitatea wireless</h3>
        <ul>
          <li><b>Autentificare</b> — doar cine are voie intră (parolă comună <G id="psk" /> sau cont individual <G id="dot1x" />).</li>
          <li><b>Confidențialitate (criptare)</b> — nimeni nu poate citi traficul capturat.</li>
          <li><b>Integritate</b> — nimeni nu poate modifica cadrele fără să fie detectat (<G id="mic" />).</li>
        </ul>
        <Figure caption="Evoluția securității Wi-Fi.">
          <SecurityTimeline />
        </Figure>
        <Table head={['Mecanism', 'An', 'Criptare', 'Integritate', 'Autentificare', 'Stare']} hlCol={0} rows={[
          [<G id="wep">WEP</G>, '1997', <><G id="rc4">RC4</G>, cheie 40/104 biți + <G id="iv">IV</G> 24 biți</>, 'CRC-32 (slab)', 'Open / Shared Key', 'spart — nu se folosește'],
          [<G id="wpa">WPA</G>, '2003', <><G id="tkip">TKIP</G> (RC4, cheie per pachet)</>, 'MIC „Michael”', 'PSK / 802.1X', 'depreciat'],
          [<G id="wpa2">WPA2</G>, '2004', <><G id="aes">AES</G>-<G id="ccmp">CCMP</G> 128 biți</>, 'CBC-MAC', 'PSK / 802.1X', 'standardul dominant'],
          [<G id="wpa3">WPA3</G>, '2018', <>AES-CCMP 128 / <G id="gcmp">GCMP</G>-256</>, 'CCMP / GMAC', <><G id="sae">SAE</G> / 802.1X (opțional mod 192 biți)</>, 'recomandat'],
        ]} />

        <h3>Personal vs Enterprise</h3>
        <Table head={['', 'Personal', 'Enterprise']} rows={[
          ['Autentificare', 'o parolă comună (PSK în WPA2, SAE în WPA3)', <>cont individual prin <G id="dot1x" /> + <G id="eap" /> + server <G id="radius" /></>],
          ['Cheia master (PMK)', 'aceeași pentru toți (derivată din parolă + SSID)', 'unică per utilizator și per sesiune'],
          ['Revocare acces', 'schimbi parola pe toate dispozitivele', 'dezactivezi contul unei persoane'],
          ['Unde se folosește', 'acasă, birouri mici, IoT', 'companii, universități, spitale'],
        ]} />

        <h3>4-way handshake — cum se nasc cheile de sesiune</h3>
        <p>Parola (sau rezultatul 802.1X) produce <G id="pmk" />-ul, care <b>nu circulă niciodată prin aer</b>. Clientul și AP-ul schimbă doar două numere aleatorii (<G id="nonce">nonce</G>-uri) și, din ele plus PMK plus adresele MAC, fiecare calculează independent aceeași cheie de sesiune (<G id="ptk" />). AP-ul trimite apoi cheia de grup (<G id="gtk" />).</p>
        <Figure caption="Animație: cele patru mesaje ale 4-way handshake (802.11i).">
          <Handshake4Way />
        </Figure>
        <Callout kind="tip" title="De ce eșuează conectarea cu parolă greșită?">
          Cu o parolă greșită, clientul calculează alt PMK, deci alt PTK. MIC-ul din mesajul 2 nu se mai potrivește cu ce calculează AP-ul, iar handshake-ul se oprește. Parola nu este trimisă niciodată — doar „dovada” că o știi.
        </Callout>

        <h3>Ce aduce WPA3</h3>
        <ul>
          <li><b><G id="sae" /></b> (Personal) — înlocuiește schimbul PSK. Un atacator care capturează handshake-ul nu mai poate încerca parole offline. Oferă și <i>forward secrecy</i>.</li>
          <li><b><G id="pmf" /> obligatoriu</b> — blochează cadrele false de deautentificare (atacurile „deauth”).</li>
          <li><b>Mod Enterprise 192-bit</b> — GCMP-256 și algoritmi CNSA, pentru medii guvernamentale/financiare.</li>
          <li><b>Transition Mode</b> — SAE + WPA2-PSK pe același SSID, pentru clienții vechi.</li>
          <li>Separat: <b><G id="owe" /></b> (Enhanced Open) criptează rețelele publice fără parolă.</li>
        </ul>
      </Detailed>
      <DeepDive title="Deep dive: de la parolă la PTK — formulele">
        <p><b>PSK → PMK:</b> <code>PMK = PBKDF2(HMAC-SHA1, passphrase, SSID, 4096, 256)</code> — 4096 de iterații SHA-1 cu SSID-ul ca „sare”. De aceea două rețele cu aceeași parolă, dar SSID-uri diferite, au PMK-uri diferite, iar tabelele precalculate trebuie generate per SSID.</p>
        <p><b>PMK → PTK:</b> <code>PTK = PRF(PMK, "Pairwise key expansion", min(AA,SPA) ‖ max(AA,SPA) ‖ min(ANonce,SNonce) ‖ max(ANonce,SNonce))</code>. PTK-ul se împarte în KCK (cheia pentru MIC-ul din handshake), KEK (cheia care criptează GTK-ul în mesajul 3) și TK (cheia care criptează efectiv datele cu AES).</p>
        <p><b>Slăbiciunea WPA2-PSK:</b> cine capturează un handshake are tot ce îi trebuie (ANonce, SNonce, MAC-uri, MIC) ca să testeze parole offline, cât de repede îi permite hardware-ul. O parolă lungă și aleatorie (16+ caractere) face atacul impracticabil. SAE elimină complet această posibilitate.</p>
      </DeepDive>
      <Traps items={[
        <><b>WPA2 = AES-CCMP.</b> TKIP aparține WPA. Dacă vezi „WPA2 + TKIP”, e mod mixt de compatibilitate, nu WPA2 „curat”.</>,
        <><b>WPA3-Personal = SAE</b>, nu PSK. WPA3-Enterprise opțional = <b>192 biți / GCMP-256</b>.</>,
        <><b>PMF</b> este obligatoriu în WPA3 și opțional în WPA2.</>,
        <>WEP este spart din cauza <b>IV-ului de 24 de biți</b> și a slăbiciunilor RC4.</>,
        <>Cu TKIP sau WEP, 802.11n/ac nu poate folosi rate HT/VHT → maximum 54 Mbps.</>,
      ]} />
      <InlineQuiz ids={['1.11-028', '1.11-029', '1.11-032']} />
    </section>
  );
}
