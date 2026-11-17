import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step, P } from '../../components/LabStep';
import { LabGuidedTopology510, LabSoloTopology510 } from '../../diagrams/t5_10';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't510g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.10-G" title="Lab ghidat — WLAN WPA2-PSK în GUI-ul WLC" />
      <Summary>
        <p><b>Obiectiv:</b> pe un <G id="wlc" /> creezi un WLAN WPA2-PSK cu AES, îl mapezi pe interfața „employee”, îl activezi, conectezi un laptop și verifici clientul pe controller; apoi testezi cu o parolă greșită. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Cisco Packet Tracer (WLC-PT, LAP-PT, switch, router/DHCP, laptop wireless) sau un WLC virtual (CML/EVE-NG) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: WLC și LAP1 pe SW1; router/DHCP pentru VLAN 10; laptop wireless.">
        <LabGuidedTopology510 />
      </Figure>
      <Table head={['Element', 'Valoare']} rows={[
        ['WLC (management)', '192.168.100.10/24'],
        ['Interfață „employee”', 'VLAN 10 · 10.10.10.2/24 · gateway și DHCP 10.10.10.1'],
        ['WLAN 1', 'profil CORP-LAB · SSID CORP · WPA2 · AES · PSK · parola Fraza-Lunga-2026'],
        ['Client', 'Laptop-1: WPA2-Personal, primește IP prin DHCP'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        GUI-ul WLC din Packet Tracer este simplificat (câmpuri de securitate limitate, WPA3/PMF lipsă); meniurile pot diferi de AireOS real. Interfața dinamică și DHCP-ul trebuie pregătite înainte (2.7). Dacă versiunea ta nu are WLC, folosește un router wireless cu WPA2-PSK (vezi 5.9) sau un WLC virtual. Pașii sunt ilustrativi, necesită adaptare la versiune; nu au fost testați de autorul lecției. Wireless nu se emulează în GNS3/CML (fără radio); doar controllerul virtual.
      </Callout>

      <Detailed title="Partea 0 — Pregătire">
        <Step labKey={L} n={1} title="Interfața și AP-ul">
          <p>Creează interfața „employee” (<P>Controller → Interfaces → New</P>: VLAN 10, 10.10.10.2/24, gateway 10.10.10.1, DHCP 10.10.10.1) și verifică în <P>Wireless → Access Points → All APs</P> că LAP1 este alăturat. Pe switch, permite VLAN 10 și 100 pe trunk-urile spre WLC/AP.</p>
          <Reveal label="Verificare"><p>Fără interfață și DHCP, WLAN-ul nu are unde să-și pună clienții: clientul s-ar asocia, dar ar rămâne cu 169.254.x.x.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Crearea WLAN-ului">
        <Step labKey={L} n={2} title="Create New">
          <p><P>WLANs → Create New → Go</P>: Type WLAN, Profile Name <code>CORP-LAB</code>, SSID <code>CORP</code>, ID 1. Apply. Ce status are WLAN-ul imediat după creare?</p>
          <Reveal label="Răspuns"><p>De obicei Disabled/neconfigurat complet: nu va fi vizibil clienților până nu îl activezi.</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="General">
          <p>Setează Status = Enabled, Interface = <code>employee</code>, Radio Policy = All, Broadcast SSID = Enabled. Ce determină câmpul Interface?</p>
          <Reveal label="Răspuns"><p>VLAN-ul în care intră clienții WLAN-ului și, prin interfață, gateway-ul și serverul DHCP pe care îl primesc.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Security → Layer 2">
          <p>Layer 2 Security = WPA+WPA2; WPA2 Policy ✔; Encryption AES ✔ (TKIP nebifat); Auth Key Mgmt = PSK; PSK Format ASCII; parola <code>Fraza-Lunga-2026</code>. Apply. De ce nu bifăm și TKIP?</p>
          <Reveal label="Răspuns"><p>TKIP este depreciat; mixed mode slăbește securitatea întregului WLAN. Cu AES-only, un client care cere TKIP nu se va conecta — alegerea corectă este să-l actualizezi/înlocuiești.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Client și verificare">
        <Step labKey={L} n={5} title="Conectează laptopul">
          <p>Pe Laptop-1 (<P>Config → Wireless0</P>): SSID = CORP, Security = WPA2-Personal, Encryption = AES, parola corectă. Ce IP primește? Din ce VLAN?</p>
          <Reveal label="Răspuns"><p>O adresă din 10.10.10.0/24 (VLAN 10), de la DHCP-ul interfeței „employee”. Dacă primește 169.254.x.x, problema este DHCP/VLAN, nu parola.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Verifică pe controller">
          <p>În <P>Monitor → Clients</P> (sau <code>show client summary</code>) și în lista WLANs: ce vezi la Status, Security Policies și la client?</p>
          <Reveal label="Răspuns"><p>WLAN 1 Enabled, Security Policies [WPA2][Auth(PSK)]; clientul apare Associated, WLAN 1, cu IP-ul din VLAN 10.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Test negativ">
          <p>Setează pe Laptop-1 o parolă greșită (o literă schimbată, cu litera mare/mică). Ce se întâmplă? La ce pas din 4-way handshake eșuează?</p>
          <Reveal label="Răspuns"><p>Clientul nu se conectează; handshake-ul eșuează la mesajul 2 (MIC nepotrivit). Testul negativ dovedește că autentificarea PSK este activă.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Reflecție">
          <p>Răspunde în scris: (1) De ce parola trebuie identică și sensibilă la litere mari/mici? (2) Ce setări trebuie să coincidă între client și WLAN? (3) Unde vezi dacă WLAN-ul folosește TKIP?</p>
          <Reveal label="Indicii"><p>(1) Din parolă și SSID se derivă PMK-ul; orice diferență duce la alt PMK. (2) Generația (WPA2), cifrul (AES), AKM (PSK) și parola. (3) În Security → Layer 2 sau în <code>show wlan 1</code> (TKIP Cipher Enabled/Disabled).</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't510s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.10-S" title="Lab solo — WLAN-ul nu primește clienți" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a creat WLAN-ul CORP, dar Laptop-1 nu îl vede, iar Laptop-2 se conectează dar nu are acces la rețeaua internă. Primești configurația (în tabel); găsește defectele (cel puțin patru) și corectează-le. <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> Packet Tracer sau WLC virtual · <b>Nivel:</b> intermediar–avansat</p>
      </Summary>
      <Figure caption="Topologie solo: WLC, AP, switch, router/DHCP și două laptopuri.">
        <LabSoloTopology510 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: ambele laptopuri se conectează cu parola corectă, primesc IP din VLAN 10 și ajung la gateway-ul 10.10.10.1; o parolă greșită este respinsă; TKIP este dezactivat. Limite PT și avertisment ca la labul ghidat; pașii nu au fost testați.
      </Callout>
      <Detailed title="Partea 1 — Configurația primită">
        <Step labKey={L} n={1} title="Citește configurația">
          <Table head={['Câmp', 'Valoare în WLAN-ul colegului']} rows={[
            ['Profile / SSID / ID', 'CORP / CORP / 1'],
            ['Status', 'Disabled'],
            ['Interface', 'guest (VLAN 30)'],
            ['Layer 2 Security', 'WPA+WPA2'],
            ['WPA2 Policy / Encryption', 'bifat / AES + TKIP'],
            ['Auth Key Mgmt', '802.1X'],
            ['Parola PSK', 'parola (6 caractere)'],
            ['Clienți', 'Laptop-1: WPA2-Personal (AES) · Laptop-2: WPA (TKIP)'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Status = Disabled</b>: Laptop-1 nu vede SSID-ul.</li>
              <li><b>Interface = guest (VLAN 30)</b>: clienții intră în VLAN-ul greșit (nu în employee/VLAN 10), deci nu ajung la rețeaua internă.</li>
              <li><b>AKM = 802.1X</b>: fără RADIUS configurat, clienții WPA2-Personal nu au cum să se autentifice; trebuie PSK.</li>
              <li><b>Parola PSK de 6 caractere</b>: sub minimul de 8; trebuie o parolă validă și lungă.</li>
              <li><b>TKIP bifat</b>: mixed mode slăbește securitatea; Laptop-2 (WPA/TKIP) „reușește” doar pentru că TKIP e activ — greșeala ar trebui corectată prin actualizarea clientului, nu prin TKIP.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <ol>
              <li>General: Status = Enabled; Interface = <code>employee</code>.</li>
              <li>Security → Layer 2: WPA+WPA2; WPA2 Policy ✔; Encryption AES ✔, TKIP ✘; Auth Key Mgmt = PSK; format ASCII; parola nouă, de exemplu <code>Fraza-Lunga-2026</code>; Apply.</li>
              <li>Laptop-2: schimbă configurația la WPA2-Personal (AES), cu aceeași parolă.</li>
            </ol>
            <p>CLI echivalent (AireOS): <code>config wlan interface 1 employee</code>, <code>config wlan security wpa wpa2 ciphers tkip disable 1</code>, <code>config wlan security wpa akm 802.1x disable 1</code>, <code>config wlan security wpa akm psk enable 1</code>, <code>config wlan security wpa akm psk set-key ascii Fraza-Lunga-2026 1</code>, <code>config wlan enable 1</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Conectează ambele laptopuri; verifică IP-urile, <code>show wlan 1</code> și <code>show client summary</code>. Încearcă o parolă greșită pe unul dintre ele.</p>
          <Reveal label="Răspuns"><p>Ambele primesc IP din 10.10.10.0/24; <code>show wlan 1</code> arată WPA2, AES, TKIP Disabled, PSK Enabled, Interface employee; <code>show client summary</code> listează clienții asociați la WLAN 1; parola greșită este respinsă.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
