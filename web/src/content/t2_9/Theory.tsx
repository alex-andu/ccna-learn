import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { QosProfiles, SecurityPicker, WlanFlow, WlanGuiMock } from '../../diagrams/t2_9';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="2.9" title="Interfața grafică a WLC pentru WLAN — imaginea de ansamblu" />
      <Summary>
        <p>Un <b><G id="wlan-profile">WLAN</G></b> pe un WLC este un set de setări care definesc <b>o rețea wireless</b> pentru clienți: <b>SSID</b>, <b>interfața/VLAN-ul</b> în care sunt puși clienții, <b>securitatea</b> (<G id="psk">PSK</G>, <G id="dot1x">802.1X</G>, <G id="wpa3">WPA3</G>), <b>QoS</b> (Platinum/Gold/Silver/Bronze) și <b>setări avansate</b> (AAA override, session timeout, client exclusion…). În interfața grafică, un WLAN are patru taburi: <b>General</b>, <b>Security</b>, <b>QoS</b>, <b>Advanced</b>.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 2.9 este <i>Interpret the wireless LAN GUI configuration for client connectivity, such as WLAN creation, security settings, QoS profiles, and advanced settings</i>. Verbul este <b>interpret</b>: ți se dă o captură a interfeței și trebuie să spui ce înseamnă, ce se va întâmpla cu clienții și ce greșeală există. Nu există sub-puncte oficiale; predăm câte o secțiune pe tab.</p>
        <Table head={['Tab GUI', 'Răspunde la…', 'Secțiunea']} hlCol={0} rows={[
          ['General', 'Cum se numește rețeaua, în ce VLAN intră clienții, e activă?', 'Crearea WLAN-ului'],
          ['Security', 'Cum se autentifică și se criptează clienții?', 'Securitate'],
          ['QoS', 'Ce prioritate are traficul acestui SSID?', 'Profiluri QoS'],
          ['Advanced', 'Ce comportamente speciale (timeout, excludere, override)?', 'Setări avansate'],
        ]} />
        <h3>Ce ai deja din temele anterioare</h3>
        <ul>
          <li><b>1.11:</b> SSID, securitate (WPA2/WPA3, PSK vs 802.1X), PMF, 4-way handshake.</li>
          <li><b>2.6:</b> WLC, AP-uri lightweight, CAPWAP, FlexConnect.</li>
          <li><b>2.7:</b> interfețe dinamice, trunk, VLAN-ul clienților.</li>
          <li><b>2.8:</b> RADIUS pentru autentificarea 802.1X.</li>
        </ul>
        <p>2.9 le leagă: în GUI alegi un SSID, îl mapezi pe o interfață (2.7), îi setezi securitatea (1.11, 2.8), prioritatea de trafic și comportamentele avansate; AP-urile (2.6) primesc apoi configurația prin CAPWAP și o difuzează.</p>
        <Figure caption="Ordinea logică a creării unui WLAN.">
          <WlanFlow />
        </Figure>
        <Callout kind="info" title="Două familii de GUI">
          Examenul și majoritatea materialelor folosesc stilul <b>AireOS</b> (meniul <b>WLANs → Create New</b>, taburile General/Security/QoS/Advanced). Pe <b>Catalyst 9800 (IOS XE)</b> aceleași concepte sunt împărțite în obiecte separate: <b>WLAN profile</b> (SSID, securitate), <b>Policy profile</b> (VLAN, QoS, AAA override, timeout) și <b>Policy tag</b> care le leagă de AP-uri (<b>Configuration → Tags &amp; Profiles → WLANs / Policy / Tags</b>). Denumirile de câmpuri diferă ușor între versiuni; ideea rămâne aceeași.
        </Callout>
      </Detailed>
      <Traps items={[
        <><b>Profile Name</b> este nume intern; <b>SSID</b> este numele văzut de clienți.</>,
        <>Un WLAN nou se creează de obicei <b>Disabled</b> și se activează la final.</>,
        <>Fără interfață/VLAN corect, clientul se asociază dar nu primește IP (2.7).</>,
      ]} />
      <InlineQuiz ids={['2.9-001', '2.9-003']} />
    </section>
  );
}

/* ======================================================================
   General: crearea WLAN-ului
   ====================================================================== */
export function General() {
  return (
    <section id="general" className="section">
      <SectionHead id="general" code="2.9" title="Crearea WLAN-ului: tabul General" />
      <Summary>
        <p>Creezi WLAN-ul cu <b>WLANs → Create New → Go</b> și completezi <b>Type</b> (WLAN), <b>Profile Name</b>, <b>SSID</b> și <b>WLAN ID</b>. Apoi, în tabul <b>General</b>: <b>Status</b> (Enabled/Disabled), <b>Radio Policy</b> (benzile), <b>Interface/Interface Group</b> (interfața dinamică ⇒ VLAN) și <b>Broadcast SSID</b>.</p>
      </Summary>
      <Detailed title="1. Câmpurile">
        <Figure caption="Interactiv: click pe un câmp (la fiecare tab) ca să vezi ce înseamnă.">
          <WlanGuiMock />
        </Figure>
        <Table head={['Câmp', 'Ce înseamnă', 'Observații']} hlCol={0} rows={[
          ['Type', 'Tipul de rețea (WLAN; alte tipuri: guest LAN, remote LAN)', 'La CCNA: „WLAN”.'],
          ['Profile Name', 'Numele profilului în GUI', 'Nume intern, poate fi identic cu SSID.'],
          ['SSID', 'Numele văzut de clienți', 'Până la 32 de caractere.'],
          ['WLAN ID', 'Număr unic al WLAN-ului pe controller (la AireOS valori între 1 și 512)', 'Valorile exacte depind de platformă.'],
          ['Status', 'Enabled / Disabled', 'Dezactivat = nu se anunță SSID-ul.'],
          ['Radio Policy', 'Benzile pe care se difuzează', 'All, 802.11a only (5 GHz), 802.11g only (2,4 GHz)…'],
          ['Interface/Interface Group', 'Interfața dinamică (VLAN) a clienților', 'Fără ea, clienții nu au rețea.'],
          ['Broadcast SSID', 'Dacă SSID-ul este anunțat în beacons', 'Disabled = SSID „ascuns” (securitate slabă, 1.11).'],
        ]} />
        <h3>2. Pașii creării (AireOS)</h3>
        <ol>
          <li><b>WLANs</b> → alegi <b>Create New</b> → <b>Go</b>.</li>
          <li>Completezi Type = WLAN, Profile Name, SSID, ID → <b>Apply</b>.</li>
          <li>Tabul <b>General</b>: setezi Interface/Interface Group (de exemplu <i>employee</i>, VLAN 10), Radio Policy, Broadcast SSID.</li>
          <li>Tabul <b>Security</b>: securitate L2 (și L3, AAA).</li>
          <li>Tabul <b>QoS</b>: profil (Silver implicit; Platinum pentru voce).</li>
          <li>Tabul <b>Advanced</b>: AAA override, timeout, excludere etc.</li>
          <li>Revii în <b>General</b>, bifezi <b>Status: Enabled</b> → <b>Apply</b> și salvezi (Save Configuration).</li>
        </ol>
        <Analogy>Crearea unui WLAN este ca deschiderea unui cont de utilizator într-o companie: îi dai un nume (SSID), un birou (interfața/VLAN), o legitimație și reguli (securitatea), un statut de prioritate (QoS) și câteva excepții (advanced); abia la final activezi contul.</Analogy>
        <Callout kind="exam" title="Ce legătură are „Interface” cu clientul?">
          Dacă pui WLAN-ul „GUEST” pe interfața „employee” (VLAN 10), oaspeții primesc IP din rețeaua angajaților. Când vezi un screenshot, verifică <b>Interface/Interface Group</b> față de VLAN-ul dorit.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Profile Name ≠ SSID.</>,
        <>Creezi <b>Disabled</b>, configurezi, apoi <b>Enabled</b> + Save.</>,
        <>Interfața greșită ⇒ clienți în VLAN-ul greșit (sau fără DHCP).</>,
      ]} />
      <InlineQuiz ids={['2.9-005', '2.9-007', '2.9-009']} />
    </section>
  );
}

/* ======================================================================
   Security
   ====================================================================== */
export function SecuritySec() {
  return (
    <section id="security" className="section">
      <SectionHead id="security" code="2.9" title="Securitate: tabul Security (Layer 2, Layer 3, AAA)" />
      <Summary>
        <p><b>Layer 2 Security</b> alege autentificarea și criptarea (None, WPA+WPA2, WPA3 în versiuni mai noi). Pentru <b>WPA2-Personal</b> bifezi <b>WPA2 Policy + AES</b> și <b>Auth Key Mgmt = PSK</b> cu parolă; pentru <b>WPA2-Enterprise</b> alegi <b>802.1X</b> și un <b>server RADIUS</b> (AAA Servers). <b>WPA3</b>: <b>SAE</b> (Personal) și <b>PMF Required</b>. <b>Layer 3 Security</b> poate adăuga un <b>portal captiv</b> (Web Policy) pentru oaspeți.</p>
      </Summary>
      <Detailed title="1. Layer 2">
        <Figure caption="Interactiv: alege tipul de securitate și vezi ce câmpuri se completează.">
          <SecurityPicker />
        </Figure>
        <Table head={['Tip', 'Autentificare', 'Setări în GUI (AireOS)']} hlCol={0} rows={[
          [<b>Open</b>, 'niciuna', 'Layer 2: None'],
          [<b>WPA2-Personal</b>, <>PSK: parolă comună (<G id="psk" />)</>, 'Layer 2: WPA+WPA2 → WPA2 Policy, Encryption AES; Auth Key Mgmt: PSK; PSK Format ASCII + passphrase (8–63 caractere)'],
          [<b>WPA2-Enterprise</b>, <><G id="dot1x" /> + <G id="radius" /> (EAP)</>, 'Layer 2: WPA+WPA2 → WPA2 Policy, AES; Auth Key Mgmt: 802.1X; AAA Servers: serverul RADIUS'],
          [<b>WPA3-Personal</b>, <>SAE (<G id="sae" />)</>, 'WPA3 Policy; Auth Key Mgmt: SAE; PMF: Required'],
          [<b>WPA3-Enterprise</b>, '802.1X cu suită criptografică mai puternică', 'WPA3 Policy; Auth Key Mgmt: variante 802.1X cu SHA-256 sau suite mai puternice (în funcție de versiune); PMF: Required'],
          [<b>WEP / TKIP</b>, 'învechite', 'Nu se mai folosesc; apar în capturi „de depistat”'],
        ]} />
        <ul>
          <li><b>AES</b> (CCMP, 1.11) este criptarea recomandată; <b>TKIP</b> este moștenire și nu se combină cu WPA3.</li>
          <li><b>PMF</b> (<G id="pmf" />, 802.11w): <i>Disabled / Optional / Required</i>; la WPA3 este obligatoriu.</li>
          <li><b>Fast Transition (802.11r)</b>: roaming rapid; opțiuni <i>Disable / Enable / Adaptive</i> în funcție de versiune.</li>
          <li><b>MAC Filtering</b> (tab Security → Layer 2) permite doar anumite MAC-uri; nu este securitate reală (MAC-urile se pot copia).</li>
        </ul>
        <h3>2. Layer 3 (Web Policy)</h3>
        <p>Pentru WLAN-ul de oaspeți: <b>Layer 3 Security → Web Policy</b>, cu variante: <b>Authentication</b> (utilizator/parolă într-un portal), <b>Passthrough</b> (acceptare termeni), <b>Conditional/Splash Page Web Redirect</b>. Layer 2 poate rămâne <b>None</b> (open). Utilizatorul se asociază liber, dar este redirecționat către portal și nu are acces până se autentifică.</p>
        <h3>3. AAA Servers</h3>
        <p>Pentru 802.1X, în <b>Security → AAA → RADIUS → Authentication → New</b> definești serverul (IP, port 1812, shared secret), apoi în WLAN → Security → AAA Servers îl selectezi (<i>Server 1</i>). Shared secret-ul trebuie să coincidă pe WLC și pe server. Fără server, clienții 802.1X nu pot fi autentificați, deși se asociază.</p>
        <Callout kind="exam" title="Cum interpretezi un screenshot Security">
          <b>Auth Key Mgmt = PSK</b> ⇒ WPA2-Personal (trebuie să existe și parola). <b>802.1X</b> ⇒ Enterprise (trebuie și server RADIUS). <b>SAE</b> ⇒ WPA3-Personal. Dacă securitatea este Enterprise dar nu e definit niciun server în AAA Servers, e o greșeală. Dacă apare WPA3 cu PMF „Disabled”, de asemenea.
        </Callout>
      </Detailed>
      <DeepDive title="Ce se petrece după ce apeși „Apply”">
        <p>WLC-ul stochează configurația WLAN-ului și o transmite, prin tunelul CAPWAP de control, tuturor AP-urilor din grupurile de AP-uri în care WLAN-ul este activ. AP-urile încep să anunțe SSID-ul în beacons; la asociere, AP-ul preia cadrele de autentificare/handshake și le trimite WLC-ului (care vorbește cu RADIUS, dacă e cazul). Cheile rezultate (PMK/PTK, 1.11) se instalează pe AP pentru criptare. De aceea o greșeală în GUI se vede imediat la toți clienții SSID-ului respectiv.</p>
      </DeepDive>
      <Traps items={[
        <>PSK ⇒ parolă comună; 802.1X ⇒ RADIUS; SAE ⇒ WPA3-Personal.</>,
        <>WPA3 cere <b>PMF Required</b>; AES (nu TKIP).</>,
        <>802.1X fără server RADIUS configurat ⇒ clienții nu se pot autentifica.</>,
        <>MAC filtering nu este un mecanism de securitate puternic.</>,
        <>Web Policy (L3) lucrează cu L2 „None” pentru oaspeți; nu înlocuiește criptarea.</>,
      ]} />
      <InlineQuiz ids={['2.9-011', '2.9-013', '2.9-015', '2.9-017']} />
    </section>
  );
}

/* ======================================================================
   QoS
   ====================================================================== */
export function QosSec() {
  return (
    <section id="qos" className="section">
      <SectionHead id="qos" code="2.9" title="Profiluri QoS: Platinum, Gold, Silver, Bronze" />
      <Summary>
        <p>În tabul <b>QoS</b> alegi un profil care setează <b>prioritatea maximă</b> a traficului unui WLAN: <b>Platinum = voce</b>, <b>Gold = video</b>, <b>Silver = best effort</b> (implicit), <b>Bronze = background</b>. <b><G id="wmm">WMM</G></b> (Wi-Fi Multimedia) este mecanismul din aer care aplică priorități; se setează <b>Disabled / Allowed / Required</b>.</p>
      </Summary>
      <Detailed title="1. De ce QoS în wireless">
        <p>Mediul radio este <b>partajat</b> și <b>half duplex</b> (CSMA/CA, 1.11): toți concurează pentru același canal. Fără priorități, un apel vocal ar aștepta la fel ca o descărcare mare, iar vocea cere latență mică și jitter mic. QoS wireless dă traficului sensibil „prioritate la cursă” și folosește patru <b>categorii de acces</b> (WMM, din 802.11e): voce, video, best effort, background.</p>
        <Figure caption="Interactiv: alege un profil și vezi ce trafic îi corespunde.">
          <QosProfiles />
        </Figure>
        <Table head={['Profil', 'Trafic', 'Categorie WMM', 'Unde îl pui']} hlCol={0} rows={[
          [<b>Platinum</b>, 'voce', 'AC_VO', 'WLAN pentru telefoane IP wireless / VoIP'],
          [<b>Gold</b>, 'video', 'AC_VI', 'WLAN pentru videoconferințe/streaming'],
          [<b>Silver</b>, 'best effort (implicit)', 'AC_BE', 'Date obișnuite: web, e-mail'],
          [<b>Bronze</b>, 'background', 'AC_BK', 'Oaspeți, trafic de fundal'],
        ]} />
        <h3>2. WMM Policy</h3>
        <Table head={['Valoare', 'Efect']} hlCol={0} rows={[
          [<b>Disabled</b>, 'WMM nu este folosit pe acest WLAN; priorități din aer dezactivate.'],
          [<b>Allowed</b>, 'Clienții WMM și non-WMM se pot conecta; clienții WMM beneficiază de priorități.'],
          [<b>Required</b>, 'Doar clienții care suportă WMM se pot asocia (util pentru WLAN-uri de voce/video).'],
        ]} />
        <p>QoS-ul din GUI funcționează împreună cu marcajele de trafic (DSCP/CoS) din restul rețelei: WLC-ul și AP-ul <b>mapează</b> prioritățile din aer (categoriile WMM) la marcaje din rețeaua cablată și invers, iar profilul QoS al WLAN-ului este <b>plafonul</b> prioritar maxim acceptat pe acel SSID. (Detaliile QoS cablat sunt la domeniul 4.)</p>
        <Callout kind="tip" title="Regula practică">
          Un WLAN dedicat vocii (SSID separat) ⇒ <b>Platinum</b> + <b>WMM Required</b>. WLAN de oaspeți ⇒ <b>Bronze</b>. Restul ⇒ <b>Silver</b> (implicit). Nu pune <i>tot</i> pe Platinum: dacă totul are prioritate maximă, nimic nu mai are.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Platinum = <b>voce</b>, Gold = <b>video</b>, Silver = <b>best effort</b> (implicit), Bronze = <b>background</b>.</>,
        <>WMM: Disabled / Allowed / Required; „Required” exclude clienții fără WMM.</>,
        <>Profilul QoS este un <b>plafon</b> pe WLAN, nu o garanție de lățime de bandă.</>,
      ]} />
      <InlineQuiz ids={['2.9-019', '2.9-021', '2.9-023']} />
    </section>
  );
}

/* ======================================================================
   Advanced
   ====================================================================== */
export function AdvancedSec() {
  return (
    <section id="advanced" className="section">
      <SectionHead id="advanced" code="2.9" title="Setări avansate: tabul Advanced" />
      <Summary>
        <p>Tabul <b>Advanced</b> ajustează comportamentul WLAN-ului: <b>Allow AAA Override</b> (RADIUS poate seta VLAN/QoS/ACL per utilizator), <b>Session Timeout</b> (reautentificare periodică), <b>Client Exclusion</b> (excludere temporară după eșecuri), <b>Maximum Allowed Clients</b>, <b>DHCP Addr. Assignment Required</b>, <b>DTIM Period</b>, <b>Client Band Select / Load Balancing</b>, <b>P2P blocking</b>, <b>MFP/PMF</b>, <b>FlexConnect Local Switching</b>.</p>
      </Summary>
      <Detailed title="Cele mai importante setări">
        <Table head={['Setare', 'Ce face', 'Când o folosești']} hlCol={0} rows={[
          [<b>Allow AAA Override</b>, <>Permite serverului RADIUS (<G id="aaa-override" />) să suprascrie VLAN-ul, profilul QoS sau ACL-ul WLAN-ului, per utilizator</>, 'Un singur SSID, dar utilizatori în VLAN-uri diferite după rol (angajat/IT).'],
          [<b>Session Timeout</b>, 'După N secunde clientul se reautentifică', 'Securitate: reînnoirea cheilor; uzual 1800 s la 802.1X.'],
          [<b>Client Exclusion</b>, 'Clientul care eșuează repetat (autentificare, DHCP, asociere) este exclus un timp (de exemplu 60 s)', 'Atenuarea atacurilor prin forță brută sau a clienților defecți.'],
          [<b>Maximum Allowed Clients</b>, 'Limită de clienți pe WLAN', 'Oaspeți: nu consumă toată capacitatea.'],
          [<b>DHCP Addr. Assignment Required</b>, 'Clientul trebuie să obțină IP prin DHCP; IP-urile statice sunt respinse', 'Control mai strict al adresării.'],
          [<b>DTIM Period</b>, 'La câte beacon-uri se anunță traficul broadcast/multicast pentru clienți în economie de energie', 'Voce/dispozitive pe baterie: valori mici = latență mică, consum mai mare.'],
          [<b>Client Band Select</b>, 'Încurajează clienții dual-band să folosească 5 GHz', 'Spațiu mai liber, rate mai mari (1.11).'],
          [<b>Client Load Balancing</b>, 'Repartizează clienții între AP-uri', 'Zone cu densitate mare.'],
          [<b>P2P Blocking</b>, 'Oprește comunicarea directă între clienții aceluiași WLAN (Drop / Forward-UpStream)', 'Rețele de oaspeți: clienții nu trebuie să se vadă între ei.'],
          [<b>Management Frame Protection (MFP/PMF)</b>, 'Protejează cadrele de management împotriva spoofing-ului', 'Securitate; obligatoriu la WPA3.'],
          [<b>FlexConnect Local Switching</b>, 'AP-urile FlexConnect comută local traficul acestui WLAN', 'Sucursale (2.6/2.7).'],
          [<b>Coverage Hole Detection</b>, 'Detectează zone fără acoperire suficientă și poate declanșa ajustări RRM', 'Rețele cu RRM activ.'],
        ]} />
        <h3>Interpretare tipică de examen</h3>
        <ul>
          <li><b>„Clienții sunt puși în VLAN-ul greșit deși WLAN-ul e mapat corect.”</b> ⇒ verifică <i>AAA Override</i>: serverul RADIUS poate trimite alt VLAN.</li>
          <li><b>„Clienții sunt deconectați periodic.”</b> ⇒ <i>Session Timeout</i> mic sau excluderi de client.</li>
          <li><b>„Oaspeții se văd între ei.”</b> ⇒ <i>P2P Blocking</i> dezactivat.</li>
          <li><b>„Clientul cu IP static nu primește acces.”</b> ⇒ <i>DHCP Addr. Assignment Required</i> activat.</li>
        </ul>
        <Callout kind="warn" title="Nu schimba la întâmplare">
          Setările avansate afectează toți clienții WLAN-ului și se aplică imediat la toate AP-urile. Unele schimbări (securitate) cer dezactivarea temporară a WLAN-ului. În producție, notează valorile curente înainte de modificare.
        </Callout>
      </Detailed>
      <Traps items={[
        <><b>AAA Override</b> poate schimba VLAN-ul față de interfața din tabul General.</>,
        <><b>Client Exclusion</b> blochează temporar clienții cu eșecuri repetate.</>,
        <><b>P2P Blocking</b> = clienții aceluiași WLAN nu comunică direct (oaspeți).</>,
        <>PMF/MFP este obligatoriu la WPA3.</>,
      ]} />
      <InlineQuiz ids={['2.9-025', '2.9-027', '2.9-029']} />
    </section>
  );
}
