import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step, P } from '../../components/LabStep';
import { LabGuidedTopology29, LabSoloTopology29 } from '../../diagrams/t2_9';

/* ======================================================================
   LAB GHIDAT — crearea WLAN-urilor în GUI
   ====================================================================== */
export function GuidedLab() {
  const L = 't29g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.9-G" title="Lab ghidat — creezi WLAN-uri în GUI (WPA2-PSK, QoS, setări avansate)" />
      <Summary>
        <p><b>Obiectiv:</b> pe un <G id="wlc" /> creezi un WLAN cu securitate <G id="psk" />, îl mapezi pe o interfață, îi setezi un profil QoS și câteva setări avansate, apoi conectezi un client și verifici. Dacă platforma permite, adaugi un WLAN 802.1X cu server RADIUS.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (WLC-PT, LAP-PT, switch, laptop wireless, server) sau un WLC virtual (CML/EVE-NG) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="WLC și AP pe SW1; server RADIUS (opțional) și laptop wireless.">
        <LabGuidedTopology29 />
      </Figure>
      <Table head={['Element', 'Valoare']} rows={[
        ['WLAN 1', 'CORP-LAB · SSID CORP · WPA2-PSK · interfață „employee” (VLAN 10) · Silver'],
        ['WLAN 2 (opțional)', 'GUEST-LAB · SSID GUEST · open · interfață „guest” (VLAN 30) · Bronze'],
        ['WLC management', '192.168.100.10 /24 (VLAN 100)'],
        ['Client', 'Laptop wireless; primește IP prin DHCP din VLAN 10'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        GUI-ul WLC din Packet Tracer este simplificat (de exemplu câmpuri de securitate limitate, fără taburi QoS/Advanced complete). Pentru taburile reale folosește un WLC virtual sau materiale oficiale cu capturi. Interfețele dinamice și serverul DHCP pe VLAN-ul clienților trebuie să existe dinainte (2.7). Pașii sunt ilustrativi, necesită adaptare la versiune; nu au fost testați de autorul lecției.
      </Callout>

      <Detailed title="Partea 1 — pregătire">
        <Step labKey={L} n={1} title="Interfețele dinamice">
          <p>Pe WLC: <P>Controller → Interfaces → New</P> pentru „employee” (VLAN 10, 10.10.10.2/24, gateway 10.10.10.1, DHCP server 10.10.10.1) și „guest” (VLAN 30). Pe switch permite VLAN 10, 30 și 100 pe trunk-ul spre WLC (2.7).</p>
          <Reveal label="Verificare"><p>Fără aceste interfețe, WLAN-urile nu au unde să-și pună clienții; câmpul Interface din tabul General ar fi gol sau greșit.</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="AP-ul este alăturat">
          <p>Verifică în <P>Wireless → Access Points → All APs</P> că LAP1 apare (2.6).</p>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — WLAN cu WPA2-PSK">
        <Step labKey={L} n={3} title="Creează WLAN-ul">
          <p><P>WLANs → Create New → Go</P>: Type = WLAN, Profile Name = CORP-LAB, SSID = CORP, ID = 1 → <b>Apply</b>.</p>
        </Step>
        <Step labKey={L} n={4} title="General">
          <p>Interface/Interface Group = employee; Radio Policy = All; Broadcast SSID = Enabled; lasă Status pe Disabled deocamdată.</p>
        </Step>
        <Step labKey={L} n={5} title="Security">
          <p>Layer 2 Security = WPA+WPA2; bifează WPA2 Policy și AES; Auth Key Mgmt = PSK; PSK Format = ASCII; introdu o parolă de laborator (min. 8 caractere); Layer 3 = None.</p>
          <Reveal label="Întrebare: ce s-ar întâmpla cu Auth Key Mgmt = 802.1X?"><p>Clientul ar cere autentificare EAP și WLC-ul ar trimite cererea către serverul RADIUS din AAA Servers; fără server, autentificarea ar eșua.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="QoS">
          <p>Quality of Service = Silver (best effort); WMM Policy = Allowed.</p>
        </Step>
        <Step labKey={L} n={7} title="Advanced">
          <p>Session Timeout = 1800 s; Client Exclusion = Enabled (60 s); Maximum Allowed Clients = 0 (nelimitat); DHCP Addr. Assignment Required = Disabled. <b>Apply</b>.</p>
        </Step>
        <Step labKey={L} n={8} title="Activează și conectează clientul">
          <p>Revino în General, Status = Enabled → Apply → Save Configuration. Conectează laptopul la SSID-ul CORP cu parola aleasă. Verifică IP-ul primit și <P>Monitor → Clients</P>.</p>
          <Reveal label="Ce ar trebui să vezi"><p>Clientul apare în Monitor → Clients cu SSID CORP, interfața employee (VLAN 10) și IP din 10.10.10.0/24.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — experimente">
        <Step labKey={L} n={9} title="Parolă greșită">
          <Reveal label="Întrebare"><p>Încearcă o parolă greșită. Ce observi pe client și în log-urile WLC-ului?</p></Reveal>
          <Reveal label="Răspuns"><p>Clientul nu se asociază (autentificare eșuată); după încercări repetate poate fi exclus temporar (Client Exclusion).</p></Reveal>
        </Step>
        <Step labKey={L} n={10} title="Interfață greșită">
          <Reveal label="Întrebare"><p>Mută WLAN-ul pe o interfață al cărei VLAN nu este permis pe trunk. Ce se întâmplă?</p></Reveal>
          <Reveal label="Răspuns"><p>Clientul se asociază, dar nu primește IP (2.7). Refă maparea corectă.</p></Reveal>
        </Step>
        <Step labKey={L} n={11} title="WLAN de oaspeți (opțional)">
          <p>Creează WLAN 3 „GUEST-LAB”: interfață guest, Layer 2 = None, Layer 3 = Web Policy → Passthrough, QoS = Bronze, P2P Blocking = Drop, Maximum Allowed Clients = 20.</p>
          <Reveal label="Ce ar trebui să facă"><p>Se conectează fără parolă, dar este redirecționat către pagina de acceptare termeni; prioritate mică; clienții nu comunică între ei.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't29s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.9-S" title="Lab solo — trei WLAN-uri cu cerințe diferite" />
      <Summary>
        <p><b>Cerință:</b> definește, pe hârtie sau în GUI, valorile tuturor câmpurilor relevante (General, Security, QoS, Advanced) pentru trei WLAN-uri, apoi compară cu soluția.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Trei WLAN-uri cu cerințe diferite.">
        <LabSoloTopology29 />
      </Figure>
      <Detailed title="Cerințe și soluție">
        <ol>
          <li><b>CORP:</b> angajați, autentificare individuală cu RADIUS, VLAN 10, trafic obișnuit, reautentificare la 30 min, VLAN pe rol din RADIUS.</li>
          <li><b>VOICE:</b> telefoane IP wireless, parolă comună, VLAN 20, priorități maxime, doar clienți cu WMM, 5 GHz.</li>
          <li><b>GUEST:</b> fără parolă, portal de acceptare termeni, VLAN 30, prioritate minimă, maxim 50 de clienți, fără comunicare între oaspeți.</li>
        </ol>
        <Step labKey={L} n={1} title="Completează și compară">
          <Reveal label="Soluție de referință">
            <Table head={['', 'CORP', 'VOICE', 'GUEST']} hlCol={0} rows={[
              ['Interface (VLAN)', 'employee (10)', 'voice (20)', 'guest (30)'],
              ['Layer 2', 'WPA2 AES, 802.1X', 'WPA2 AES, PSK', 'None'],
              ['Layer 3', 'None', 'None', 'Web Policy: Passthrough'],
              ['AAA Servers', 'RADIUS', '—', '—'],
              ['QoS', 'Silver', 'Platinum', 'Bronze'],
              ['WMM', 'Allowed', 'Required', 'Allowed'],
              ['Advanced', 'AAA Override on; Session Timeout 1800', 'DTIM 1; 5 GHz only (Radio Policy)', 'Max clients 50; P2P Drop'],
            ]} />
          </Reveal>
          <Reveal label="Întrebări de verificare"><p>(1) De ce nu pui voce pe Silver? (2) Ce se întâmplă dacă CORP are 802.1X dar serverul RADIUS este oprit? (3) Ce se petrece dacă un telefon fără WMM încearcă VOICE?</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
