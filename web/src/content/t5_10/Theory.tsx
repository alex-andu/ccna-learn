import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { SymptomDiagnoser, WlanFormBuilder, WlanPipeline } from '../../diagrams/t5_10';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.10" title="WLAN cu WPA2-PSK în GUI — imaginea de ansamblu" />
      <Summary>
        <p>Obiectivul 5.10 pune cap la cap ce ai învățat la 2.6–2.9 (controller, interfețe, WLAN-uri) și la 5.9 (WPA2): <b>creezi în GUI un WLAN securizat cu WPA2-PSK</b>, îl mapezi pe o interfață, îl activezi și <b>verifici</b> că un client se conectează. Este un obiectiv „Configure and verify”: contează câmpurile exacte, regulile parolei și diagnosticarea.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Configure and verify WLAN within the GUI using WPA2 PSK</i>. Un WLAN este definit de patru grupuri de setări:</p>
        <Table head={['Grup', 'Ce setezi', 'Tab în GUI']} hlCol={0} rows={[
          ['Identitate', 'Profile Name, SSID, WLAN ID, Status', 'General'],
          ['Plasare în rețea', 'Interface/Interface Group (VLAN), Radio Policy, Broadcast SSID', 'General'],
          ['Securitate Layer 2', 'WPA+WPA2, WPA2 Policy, AES, AKM = PSK, parola', 'Security → Layer 2'],
          ['Opțional', 'QoS, Advanced (client load, DTIM, timeout etc.)', 'QoS / Advanced'],
        ]} />
        <Analogy>Un WLAN este ca <b>o ușă de intrare cu trei decizii</b>: cum se numește ușa (SSID), în ce hol dă (interfața/VLAN-ul) și cum se deschide (WPA2 cu cheia PSK). Dacă greșești una — cheia, holul sau nu ai deschis ușa (Disabled) — vizitatorul nu ajunge unde trebuie.</Analogy>
        <Callout kind="info" title="Ce acoperă și ce nu acoperă acest topic">
          La 2.9 ai parcurs GUI-ul pe tab-uri (General, Security, QoS, Advanced). Aici te concentrezi pe <b>un scenariu complet WPA2-PSK</b>, de la planificare la verificare și depanare. Alegerea între generații WPA este la 5.9; autentificarea cu RADIUS (Enterprise) este la 5.8–5.9.
        </Callout>
      </Detailed>
      <Traps items={[
        <>SSID, Profile Name și WLAN ID sunt trei lucruri diferite; niciunul nu este VLAN ID.</>,
        <>Un WLAN nou este adesea <b>Disabled</b>: nu apare la clienți până nu îl activezi.</>,
        <>Securitatea se setează pe <b>Security → Layer 2</b>, nu la General.</>,
      ]} />
      <InlineQuiz ids={['5.10-001', '5.10-010', '5.10-011']} />
    </section>
  );
}

/* ======================================================================
   1. Planificare + pași
   ====================================================================== */
export function PlanSection() {
  return (
    <section id="plan" className="section">
      <SectionHead id="plan" code="5.10" title="Planificarea și pașii: de la interfață la client" />
      <Summary>
        <p>Înainte să creezi WLAN-ul trebuie să existe <b>interfața</b> pe care va fi mapat (VLAN, IP, server DHCP) și un AP alăturat controllerului. Apoi urmezi șase pași, de la „Create New” până la conectarea unui client.</p>
      </Summary>
      <Detailed title="1. Ce trebuie să existe dinainte">
        <ul>
          <li>Un <G id="wlc" /> funcțional și un <G id="ap" /> alăturat (CAPWAP), vezi 2.6–2.7.</li>
          <li>O <b>interfață dinamică</b> (de exemplu „employee”, VLAN 10) cu adresă IP, gateway și serverul DHCP al VLAN-ului.</li>
          <li>VLAN-ul permis pe trunk-ul switch-ului spre controller și, la AP-uri în FlexConnect, spre AP.</li>
          <li>Un plan al parolei: lungă, unică, documentată într-un loc sigur.</li>
        </ul>
      </Detailed>
      <Detailed title="2. Cei șase pași — interactiv">
        <Figure caption="Interactiv: parcurge pașii creării și verificării unui WLAN WPA2-PSK.">
          <WlanPipeline />
        </Figure>
      </Detailed>
      <Detailed title="3. Câmpurile de care ai nevoie, în ordine">
        <Table head={['Câmp', 'Valoare tipică', 'Observație']} hlCol={0} rows={[
          ['Type', 'WLAN', 'alte tipuri (Guest LAN, Remote LAN) nu fac parte din obiectiv'],
          ['Profile Name', 'CORP-LAB', 'nume intern; poate coincide cu SSID'],
          ['SSID', 'CORP', 'numele vizibil, 1–32 caractere'],
          ['ID', '1', 'număr unic; apare în comenzile CLI'],
          ['Status', 'Enabled', 'altfel nu este difuzat'],
          ['Radio Policy', 'All', 'sau doar 5 GHz pentru clienți moderni'],
          ['Interface/Interface Group', 'employee', 'determină VLAN-ul clienților'],
          ['Broadcast SSID', 'Enabled', 'ascunderea SSID-ului nu este securitate'],
          ['Layer 2 Security', 'WPA+WPA2', 'None = rețea deschisă'],
          ['WPA2 Policy / Encryption', 'bifat / AES', 'TKIP nebifat'],
          ['Auth Key Mgmt', 'PSK', '802.1X = Enterprise (RADIUS)'],
          ['PSK Format + parola', 'ASCII, 8–63 caractere', 'sau HEX de 64 de cifre'],
        ]} />
      </Detailed>
      <Traps items={[
        <>Fără interfața dinamică și DHCP, clientul se asociază, dar rămâne cu IP APIPA.</>,
        <>Interfața „management” nu e potrivită pentru clienți: separă traficul de administrare.</>,
        <>După „Apply” verifică în lista WLANs: Status Enabled și Security „[WPA2][Auth(PSK)]”.</>,
      ]} />
      <InlineQuiz ids={['5.10-008', '5.10-009', '5.10-021', '5.10-032']} />
    </section>
  );
}

/* ======================================================================
   2. Securitatea: PSK, parola, cifru
   ====================================================================== */
export function SecuritySection() {
  return (
    <section id="security" className="section">
      <SectionHead id="security" code="5.10" title="Securitatea WLAN-ului: WPA2, AES, PSK și regulile parolei" />
      <Summary>
        <p>Pentru WPA2-PSK alegi trei lucruri la Layer 2: <b>WPA2 Policy</b> activat, cifrul <b><G id="aes" /></b> (CCMP) și <b>Auth Key Mgmt = PSK</b>. Apoi introduci <G id="psk-passphrase" />: <b>8–63 de caractere ASCII</b> sau <b>64 de cifre hex</b>. Clientul trebuie să aibă aceeași combinație și aceeași parolă.</p>
      </Summary>
      <Detailed title="1. Ce se întâmplă în spate">
        <p>Parola și SSID-ul sunt trecute printr-o funcție de derivare (PBKDF2, 4096 de iterații) și rezultă cheia-master <G id="pmk" /> (256 de biți). Același calcul îl face clientul. La asociere, 4-way handshake-ul dovedește că ambele părți au același PMK, fără a trimite parola. Dacă parolele diferă chiar și printr-o literă, MIC-ul din mesajul 2 nu se potrivește și AP-ul respinge conexiunea.</p>
        <Figure caption="Interactiv: construiește un WLAN WPA2-PSK în formular și vezi dacă un client cu o anumită configurație se conectează (cu CLI generat).">
          <WlanFormBuilder />
        </Figure>
      </Detailed>
      <Detailed title="2. Regulile parolei">
        <Table head={['Format', 'Regulă', 'Exemplu valid', 'Exemple invalide']} hlCol={0} rows={[
          ['ASCII', '8–63 de caractere imprimabile; sensibil la litere mari/mici', 'Fraza-Lunga-2026', 'parola (6), Parolă-lungă (diacritic), 64+ caractere'],
          ['HEX', 'exact 64 de cifre hexazecimale (0–9, a–f)', '64 de caractere hex', '63 de cifre, litere g–z'],
        ]} />
        <Callout kind="tip" title="Alege parola ca un specialist">
          Pentru WPA2-PSK un handshake capturat permite un atac de dicționar offline, deci parola trebuie să fie <b>lungă</b> (14+ caractere sau o frază din mai multe cuvinte aleatorii), <b>unică</b> și <b>nu</b> din dicționar. Rotește-o când pleacă cineva care o cunoștea.
        </Callout>
      </Detailed>
      <Detailed title="3. Cifrul și compatibilitatea clientului">
        <p>La WPA2 bifezi <b>AES</b>. Dacă bifezi și <b>TKIP</b> obții un „<G id="mixed-mode" />” care permite clienților foarte vechi să se conecteze, dar slăbește securitatea; evită-l. Un client care cere o generație sau un cifru pe care WLAN-ul nu le oferă (WPA/TKIP, sau WPA3-only) nu se poate conecta, chiar cu parola corectă — verifică <b>ce</b> negociază amândouă părțile, nu doar parola.</p>
      </Detailed>
      <DeepDive title="WPA3 și transition mode pe WLC (recunoaștere)">
        <p>Pe versiuni recente de WLC poți alege WPA3 (AKM SAE) sau un mod de tranziție în care același WLAN acceptă și WPA2-PSK, cu <G id="akm" /> multiple. Atunci PMF devine „Required” pentru clienții WPA3. Pentru 5.10 rămâi la WPA2-PSK; știi însă că un client WPA3-only nu se va asocia la un WLAN doar WPA2.</p>
      </DeepDive>
      <Traps items={[
        <>Parola este <b>sensibilă la litere mari/mici</b>; diacriticele nu sunt ASCII.</>,
        <>HEX = <b>64</b> de cifre exact, nu 8–63.</>,
        <>TKIP + AES = mixed mode; nu e o idee bună.</>,
        <>Parola corectă nu ajută dacă clientul folosește o altă generație WPA sau cifru.</>,
      ]} />
      <InlineQuiz ids={['5.10-002', '5.10-003', '5.10-004', '5.10-005', '5.10-006', '5.10-012', '5.10-013']} />
    </section>
  );
}

/* ======================================================================
   3. Verificare și depanare
   ====================================================================== */
export function VerifySection() {
  return (
    <section id="verify" className="section">
      <SectionHead id="verify" code="5.10" title="Verificare și depanare — de ce nu se conectează clientul" />
      <Summary>
        <p>Verifici în trei locuri: <b>lista WLANs</b> (Status și „Security Policies”), <b>detaliile WLAN-ului</b> (<code>show wlan &lt;id&gt;</code>) și <b>clienții</b> (<i>Monitor → Clients</i>, <code>show client summary</code>). Cele mai multe defecte cad în șase categorii, pe care le recunoști după simptom.</p>
      </Summary>
      <Detailed title="1. Verificarea pas cu pas">
        <ol>
          <li><b>Lista WLANs</b>: WLAN-ul apare, Status = Enabled, Security Policies = <code>[WPA2][Auth(PSK)]</code>.</li>
          <li><b>Detaliu WLAN</b>: WPA2 (RSN IE) Enabled, AES Enabled, TKIP Disabled, AKM PSK Enabled, interfața corectă.</li>
          <li><b>Client de test</b> cu parola corectă: se conectează, primește IP din VLAN-ul așteptat.</li>
          <li><b>Monitor → Clients</b>: clientul apare cu SSID-ul, starea Associated/Run, IP și VLAN.</li>
          <li><b>Test negativ</b>: cu o parolă greșită conexiunea trebuie să eșueze — dovada că autentificarea chiar funcționează.</li>
        </ol>
      </Detailed>
      <Detailed title="2. Diagnosticator de simptome — interactiv">
        <Figure caption="Alege simptomul și vezi cauzele, locul de verificare și remedierea.">
          <SymptomDiagnoser />
        </Figure>
      </Detailed>
      <Detailed title="3. Metoda de depanare">
        <ol>
          <li><b>Vizibilitate</b>: clientul vede SSID-ul? (Status, AP alăturat, Radio Policy, Broadcast SSID).</li>
          <li><b>Autentificare</b>: se asociază? (parolă, generație WPA, AES/TKIP, AKM).</li>
          <li><b>IP</b>: primește adresă? (interfață, DHCP, trunk/VLAN permis).</li>
          <li><b>Rețea</b>: ajunge la resurse? (VLAN corect, gateway, rutare).</li>
          <li><b>Performanță</b>: este stabil? (semnal, interferență, TKIP, QoS).</li>
        </ol>
        <p>Lucrează în ordine: nu are sens să verifici DHCP-ul dacă clientul nici nu se asociază.</p>
      </Detailed>
      <Traps items={[
        <>Un client „blocat pe autentificare” indică de obicei <b>parolă sau politică</b>, nu DHCP.</>,
        <>Un client cu 169.254.x.x s-a autentificat deja: problema este <b>DHCP/VLAN</b>.</>,
        <>Testează întotdeauna și cu <b>parolă greșită</b>: un WLAN care primește orice parolă nu are securitate activă.</>,
      ]} />
      <InlineQuiz ids={['5.10-014', '5.10-015', '5.10-016', '5.10-017', '5.10-018', '5.10-020', '5.10-025', '5.10-031']} />
    </section>
  );
}
