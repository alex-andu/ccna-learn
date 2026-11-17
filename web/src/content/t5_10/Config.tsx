import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.10" title="Exemple de configurare și verificare: WLAN WPA2-PSK (GUI și CLI echivalent)" />
      <Summary>
        <p>Scenariul: WLAN-ul <b>CORP-LAB</b> (SSID <b>CORP</b>, ID 1), WPA2-PSK cu AES, mapat pe interfața <b>employee</b> (VLAN 10). Parcurgi clicurile din GUI și vezi comenzile CLI echivalente, apoi verifici.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Meniurile diferă între AireOS (8.x), Catalyst 9800 (IOS XE) și GUI-ul simplificat din Packet Tracer. Comenzile și output-urile sunt <b>ilustrative</b> și <b>nu au fost testate</b> de autorul lecției pe un controller real. Folosește documentația versiunii tale.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Element', 'Valoare']} rows={[
          ['WLAN', 'ID 1 · profil CORP-LAB · SSID CORP'],
          ['Securitate', 'WPA2 + AES + PSK (ASCII), parola Fraza-Lunga-2026'],
          ['Interfață', 'employee (VLAN 10, 10.10.10.2/24, gateway/DHCP 10.10.10.1)'],
          ['Management WLC', '192.168.100.10'],
          ['Client de test', 'laptop wireless; WPA2-Personal (AES)'],
        ]} />
      </Detailed>

      <Detailed title="2. Pașii în GUI (stil AireOS)">
        <ol>
          <li><b>WLANs → Create New → Go</b>: Type = WLAN; Profile Name = CORP-LAB; SSID = CORP; ID = 1 → <b>Apply</b>.</li>
          <li><b>General</b>: Status = <b>Enabled</b>; Radio Policy = All; Interface = <b>employee</b>; Broadcast SSID = Enabled.</li>
          <li><b>Security → Layer 2</b>: Layer 2 Security = <b>WPA+WPA2</b>; WPA2 Policy ✔, WPA2 Encryption <b>AES</b> ✔ (TKIP nebifat); Auth Key Mgmt = <b>PSK</b>; PSK Format = ASCII; parola <code>Fraza-Lunga-2026</code>.</li>
          <li>(Opțional) <b>QoS</b> și <b>Advanced</b> — vezi 2.9.</li>
          <li><b>Apply</b>; revino în lista WLANs și verifică Status și Security Policies.</li>
        </ol>
        <p>Pe <b>Catalyst 9800</b>: <i>Configuration → Tags &amp; Profiles → WLANs → Add</i> (General: profil, SSID, ID, Status; Security → Layer2: WPA2, AES/CCMP, AKM PSK, parolă); apoi asociezi profilul unui <b>Policy Profile</b> (VLAN) printr-un <b>Policy Tag</b> aplicat AP-urilor.</p>
      </Detailed>

      <Detailed title="3. Același lucru în CLI (AireOS)">
        <CodeBlock title="WLC AireOS — WLAN WPA2-PSK (ilustrativ)" kind="session" code={`(Cisco Controller) > config wlan create 1 CORP-LAB CORP
(Cisco Controller) > config wlan interface 1 employee
(Cisco Controller) > config wlan security wpa enable 1
(Cisco Controller) > config wlan security wpa wpa2 enable 1
(Cisco Controller) > config wlan security wpa wpa2 ciphers aes enable 1
(Cisco Controller) > config wlan security wpa wpa2 ciphers tkip disable 1
(Cisco Controller) > config wlan security wpa akm 802.1x disable 1
(Cisco Controller) > config wlan security wpa akm psk enable 1
(Cisco Controller) > config wlan security wpa akm psk set-key ascii Fraza-Lunga-2026 1
(Cisco Controller) > config wlan enable 1`} explain={[
          ['config wlan create 1 CORP-LAB CORP', 'Creează WLAN-ul: ID 1, profil CORP-LAB, SSID CORP (pornește dezactivat).'],
          ['config wlan interface 1 employee', 'Mapează clienții WLAN-ului pe interfața „employee” (VLAN 10).'],
          ['security wpa enable 1 / wpa2 enable 1', 'Pornește familia WPA și politica WPA2.'],
          ['wpa2 ciphers aes enable / tkip disable', 'Doar AES: fără mixed mode.'],
          ['akm 802.1x disable / akm psk enable', 'Autentificarea este cu parolă comună, nu cu RADIUS.'],
          ['akm psk set-key ascii … 1', 'Parola ASCII (8–63 caractere) pentru WLAN-ul 1.'],
          ['config wlan enable 1', 'Pornește difuzarea WLAN-ului.'],
        ]} />
      </Detailed>

      <Detailed title="4. Verificare">
        <CodeBlock title="WLC AireOS — verificare (ilustrativ)" kind="session" code={`(Cisco Controller) > show wlan summary
Number of WLANs.................................. 1
WLAN ID  WLAN Profile Name / SSID               Status    Interface Name
1        CORP-LAB / CORP                        Enabled   employee

(Cisco Controller) > show wlan 1
WLAN Identifier.................................. 1
Profile Name..................................... CORP-LAB
Network Name (SSID).............................. CORP
Status........................................... Enabled
Interface........................................ employee
Security
   WPA2 (RSN IE).................................. Enabled
      TKIP Cipher................................. Disabled
      AES Cipher.................................. Enabled
      Auth Key Management
         802.1x................................... Disabled
         PSK...................................... Enabled

(Cisco Controller) > show client summary
Number of Clients................................ 1
MAC Address        AP Name  Status     WLAN  Auth Protocol   Port Wired
aa:bb:cc:00:00:01  LAP1     Associated 1     Yes  802.11n(5 GHz) 1  No`} explain={[
          ['show wlan summary', 'Lista scurtă: profil, SSID, stare și interfața mapată.'],
          ['show wlan 1', 'Detaliul securității: WPA2 + AES + PSK.'],
          ['TKIP Disabled', 'Confirmă că nu există mixed mode.'],
          ['show client summary', 'Clientul de test apare asociat la WLAN-ul 1, prin LAP1.'],
        ]} />
        <Reveal label="Ce faci dacă un client nu apare în listă">
          <ol>
            <li>Verifică <code>Status Enabled</code> și că AP-ul este alăturat (<code>show ap summary</code>).</li>
            <li>Compară generația și cifrul clientului cu cele din <code>show wlan 1</code>.</li>
            <li>Reintrodu parola (atenție la litere mari/mici și la spații la sfârșit).</li>
            <li>Dacă se asociază dar are 169.254.x.x: verifică DHCP-ul și VLAN-ul de pe interfață.</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Un WLAN creat și neactivat nu apare niciodată la clienți.</>,
        <>Nu lăsa PSK și 802.1X active simultan fără motiv: confuzie și suprafață de atac mai mare.</>,
        <>Nu folosi parole reale în laburi; documentează parola de lab separat.</>,
      ]} />
      <InlineQuiz ids={['5.10-034', '5.10-035', '5.10-036', '5.10-037', '5.10-038', '5.10-039', '5.10-040']} />
    </section>
  );
}
