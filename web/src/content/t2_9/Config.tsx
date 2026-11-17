import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.9" title="Exemple: crearea și interpretarea unor WLAN-uri" />
      <Summary>
        <p>Obiectivul 2.9 cere să <b>interpretezi</b> interfața grafică. Mai jos: trei WLAN-uri tipice (Enterprise, voce, oaspeți) cu valorile din fiecare tab, echivalentul lor în CLI și exerciții de interpretare a unor setări greșite.</p>
      </Summary>
      <Callout kind="warn" title="Ilustrativ, netestat">
        Valorile și comenzile sunt <b>exemple ilustrative</b>, cu nume, VLAN-uri și parole fictive; <b>nu au fost testate</b> pe un WLC real. Denumirile câmpurilor și opțiunile diferă între versiuni AireOS și între AireOS și Catalyst 9800 (IOS XE). Verifică documentația versiunii tale; în Packet Tracer interfața WLC este simplificată.
      </Callout>

      <Detailed title="Exemplul 1 — WLAN „CORP” (WPA2-Enterprise, 802.1X)">
        <Table head={['Tab', 'Câmp', 'Valoare']} hlCol={0} rows={[
          ['General', 'Profile Name / SSID / ID', 'CORP-WLAN / CORP / 1'],
          ['General', 'Status', 'Enabled (la final)'],
          ['General', 'Interface/Interface Group', 'employee (VLAN 10)'],
          ['General', 'Radio Policy / Broadcast SSID', 'All / Enabled'],
          ['Security › Layer 2', 'Layer 2 Security', 'WPA+WPA2'],
          ['Security › Layer 2', 'WPA2 Policy / Encryption', 'bifat / AES'],
          ['Security › Layer 2', 'Auth Key Mgmt', '802.1X'],
          ['Security › AAA Servers', 'Authentication Server 1', 'RADIUS 192.168.1.50:1812'],
          ['QoS', 'Quality of Service', 'Silver (best effort)'],
          ['QoS', 'WMM Policy', 'Allowed'],
          ['Advanced', 'Allow AAA Override', 'Enabled (RADIUS poate trimite VLAN-ul pe rol)'],
          ['Advanced', 'Session Timeout', '1800 s'],
        ]} />
        <p><b>Rezultat:</b> clienții introduc utilizator/parolă (sau certificat) prin EAP; WLC-ul îi autentifică la serverul RADIUS; sunt puși în VLAN 10 (sau în VLAN-ul trimis de RADIUS, datorită AAA Override); se reautentifică la 30 de minute.</p>
      </Detailed>

      <Detailed title="Exemplul 2 — WLAN „VOICE” (WPA2-PSK, Platinum)">
        <Table head={['Tab', 'Câmp', 'Valoare']} hlCol={0} rows={[
          ['General', 'Profile / SSID / ID', 'VOICE-WLAN / VOICE / 2'],
          ['General', 'Interface', 'voice (VLAN 20)'],
          ['General', 'Radio Policy', '802.11a only (5 GHz) — mai puține interferențe pentru voce'],
          ['Security › Layer 2', 'Auth Key Mgmt / PSK', 'PSK · ASCII · parolă de 8–63 caractere'],
          ['QoS', 'Quality of Service', 'Platinum (voice)'],
          ['QoS', 'WMM Policy', 'Required'],
          ['Advanced', 'DTIM Period', '1 (latență mică pentru dispozitive pe baterie)'],
        ]} />
        <p><b>Rezultat:</b> telefoanele IP wireless se conectează cu parolă comună, în VLAN 20; traficul lor primește prioritate maximă în aer (AC_VO); doar clienții WMM se pot asocia.</p>
      </Detailed>

      <Detailed title="Exemplul 3 — WLAN „GUEST” (portal captiv, Bronze)">
        <Table head={['Tab', 'Câmp', 'Valoare']} hlCol={0} rows={[
          ['General', 'Profile / SSID / ID', 'GUEST-WLAN / GUEST / 3'],
          ['General', 'Interface', 'guest (VLAN 30, izolat de rețeaua internă)'],
          ['Security › Layer 2', 'Layer 2 Security', 'None (open)'],
          ['Security › Layer 3', 'Layer 3 Security', 'Web Policy → Authentication (sau Passthrough)'],
          ['QoS', 'Quality of Service', 'Bronze (background)'],
          ['Advanced', 'Maximum Allowed Clients', '50'],
          ['Advanced', 'P2P Blocking', 'Drop (oaspeții nu comunică între ei)'],
          ['Advanced', 'Session Timeout', '3600 s'],
        ]} />
        <p><b>Rezultat:</b> oricine se asociază liber, dar este redirecționat către portal și nu are acces până se autentifică; are prioritate mică și nu-i vede pe ceilalți oaspeți.</p>
      </Detailed>

      <Detailed title="Exemplul 4 — Aceleași setări în CLI">
        <CodeBlock title="WLC AireOS (ilustrativ)" kind="session" code={`(Cisco Controller) > config wlan create 1 CORP-WLAN CORP
(Cisco Controller) > config wlan interface 1 employee
(Cisco Controller) > config wlan security wpa enable 1
(Cisco Controller) > config wlan security wpa wpa2 enable 1
(Cisco Controller) > config wlan security wpa wpa2 ciphers aes enable 1
(Cisco Controller) > config wlan security wpa akm 802.1x enable 1
(Cisco Controller) > config wlan radius_server auth add 1 1
(Cisco Controller) > config wlan qos 1 silver
(Cisco Controller) > config wlan aaa-override enable 1
(Cisco Controller) > config wlan session-timeout 1 1800
(Cisco Controller) > config wlan enable 1
(Cisco Controller) > show wlan 1`} explain={[
          ['config wlan create 1 CORP-WLAN CORP', 'Creează WLAN-ul cu ID 1, profil CORP-WLAN și SSID CORP (WLAN-ul pornește dezactivat).'],
          ['config wlan interface 1 employee', 'Mapează WLAN-ul pe interfața dinamică „employee” (VLAN 10).'],
          ['security wpa … akm 802.1x', 'WPA2 cu AES și management de chei 802.1X (Enterprise).'],
          ['radius_server auth add 1 1', 'Asociază serverul RADIUS 1 pentru autentificare.'],
          ['qos 1 silver', 'Profil QoS Silver.'],
          ['aaa-override / session-timeout', 'Setări din tabul Advanced.'],
          ['config wlan enable 1', 'Activează WLAN-ul (Status: Enabled).'],
          ['show wlan 1', 'Afișează setările; verificarea echivalentă cu privitul în GUI.'],
        ]} />
        <CodeBlock title="Catalyst 9800 (IOS XE, ilustrativ)" kind="config" code={`wlan CORP-WLAN 1 CORP
 security wpa akm dot1x
 security wpa wpa2 ciphers aes
 no shutdown
wireless profile policy POL-CORP
 vlan 10
 aaa-override
 session-timeout 1800
 no shutdown
wireless tag policy TAG-CORP
 wlan CORP-WLAN policy POL-CORP`} explain={[
          ['wlan CORP-WLAN 1 CORP', 'WLAN profile: nume, ID, SSID, securitate.'],
          ['wireless profile policy', 'Policy profile: VLAN, AAA override, timeout, QoS.'],
          ['wireless tag policy', 'Leagă WLAN profile de Policy profile; tag-ul se aplică apoi AP-urilor.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 5 — Interpretare: ce este greșit?">
        <Table head={['Ce vezi în GUI', 'Problema', 'Corecție']} hlCol={0} rows={[
          ['WLAN „GUEST” are Interface = employee', 'Oaspeții intră în VLAN-ul angajaților', 'Interface = guest (VLAN 30)'],
          ['Auth Key Mgmt = 802.1X, dar AAA Servers: none', 'Clienții se asociază dar nu se pot autentifica', 'Adaugă serverul RADIUS'],
          ['WPA3 cu PMF = Disabled', 'WPA3 cere PMF Required', 'PMF: Required'],
          ['Telefoane IP wireless în WLAN cu QoS Bronze', 'Voce cu prioritate minimă ⇒ voce de proastă calitate', 'Platinum + WMM Required'],
          ['SSID Broadcast Disabled prezentat ca „securitate”', 'SSID-ul ascuns nu protejează', 'WPA2/WPA3 corect configurat'],
          ['Status Disabled după configurare', 'SSID-ul nu este difuzat', 'Status: Enabled + Save'],
          ['Layer 2 Security = None, Layer 3 = None, pe WLAN corporativ', 'Rețeaua deschisă, fără protecție', 'Securitate L2 (WPA2/WPA3)'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Depanare: clientul nu se poate conecta">
        <Table head={['Simptom', 'Verifică în GUI', 'Cauză tipică']} hlCol={0} rows={[
          ['SSID-ul nu apare', 'General: Status, Radio Policy, grupul de AP-uri', 'WLAN dezactivat sau limitat la altă bandă'],
          ['Asociere eșuată / parolă greșită', 'Security: Auth Key Mgmt, parola PSK', 'PSK diferit; AES vs TKIP; client fără WPA3'],
          ['Asociat, dar fără IP', 'General: Interface; switch: trunk; DHCP', 'Interfață/VLAN greșit sau VLAN nepermis (2.7)'],
          ['802.1X eșuează', 'AAA Servers; shared secret; RADIUS', 'Server inaccesibil sau secret diferit'],
          ['Deconectări periodice', 'Advanced: Session Timeout, Client Exclusion', 'Timeout scurt sau excluderi'],
        ]} />
      </Detailed>
    </section>
  );
}
