import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.9" title="Exemple de configurare (recunoaștere): cum se aleg modurile pe controller" />
      <Summary>
        <p>5.9 este un obiectiv de tip <b>Describe</b>, deci nu ți se cere să configurezi din memorie. Dar e util să vezi <b>unde</b> apar în configurarea unui WLAN alegerile din teorie: politica WPA/WPA2/WPA3, cifrul (AES), metoda de autentificare (PSK, 802.1X, SAE) și PMF. Configurarea completă pas cu pas a unui WLAN cu WPA2-PSK este în 5.10.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Comenzile AireOS de mai jos urmează sintaxa folosită și în 2.9; ele <b>nu au fost testate</b> de autorul lecției pe un controller real, iar opțiunile WPA3/SAE diferă între versiuni AireOS și IOS XE (Catalyst 9800). Verifică în documentația versiunii tale.
      </Callout>

      <Detailed title="1. Unde se văd alegerile în GUI-ul WLC">
        <Table head={['Concept din 5.9', 'Câmp din GUI (stil AireOS)', 'Valori frecvente']} hlCol={0} rows={[
          ['Generația WPA', 'WLANs → Security → Layer 2 → Layer 2 Security', 'None · WPA+WPA2 · 802.1X · WPA3 (după versiune)'],
          ['Politica WPA2', 'WPA2 Policy', 'bifat; cifru AES (CCMP128); TKIP lăsat nebifat'],
          ['Autentificare (AKM)', 'Auth Key Mgmt', 'PSK · 802.1X · CCKM · FT · SAE'],
          ['Parola Personal', 'PSK Format + câmpul de parolă', 'ASCII (8–63) sau HEX (64)'],
          ['PMF (802.11w)', 'Protected Management Frame', 'Disabled · Optional · Required'],
          ['Server RADIUS (Enterprise)', 'Security → AAA Servers', 'serverul ISE/RADIUS selectat pentru WLAN'],
        ]} />
        <p>Pe Catalyst 9800 aceleași opțiuni sunt în <i>Configuration → Tags &amp; Profiles → WLANs → Security → Layer2</i> (mod WPA2/WPA3, AKM, PMF).</p>
      </Detailed>

      <Detailed title="2. CLI AireOS — exemple pe moduri">
        <CodeBlock title="WLC AireOS — WPA2-Personal (ilustrativ)" kind="session" code={`(Cisco Controller) > config wlan security wpa enable 1
(Cisco Controller) > config wlan security wpa wpa2 enable 1
(Cisco Controller) > config wlan security wpa wpa2 ciphers aes enable 1
(Cisco Controller) > config wlan security wpa akm psk enable 1
(Cisco Controller) > config wlan security wpa akm psk set-key ascii Fraza-lunga-si-unica-2026 1
(Cisco Controller) > config wlan enable 1`} explain={[
          ['config wlan security wpa enable 1', 'Pornește familia WPA pe WLAN-ul 1.'],
          ['… wpa wpa2 enable 1', 'Activează WPA2.'],
          ['… wpa2 ciphers aes enable 1', 'Cifrul este AES (CCMP); TKIP rămâne dezactivat.'],
          ['… wpa akm psk enable 1', 'Autentificarea este cu cheie partajată (Personal).'],
          ['… akm psk set-key ascii … 1', 'Setează parola (ASCII, 8–63 caractere).'],
        ]} />
        <CodeBlock title="WLC AireOS — WPA2-Enterprise (ilustrativ)" kind="session" code={`(Cisco Controller) > config wlan security wpa akm psk disable 1
(Cisco Controller) > config wlan security wpa akm 802.1x enable 1
(Cisco Controller) > config wlan radius_server auth add 1 1
(Cisco Controller) > config wlan enable 1`} explain={[
          ['akm psk disable', 'Oprește parola comună.'],
          ['akm 802.1x enable', 'Autentificare individuală 802.1X/EAP.'],
          ['radius_server auth add 1 1', 'Asociază serverul RADIUS 1 cu WLAN-ul 1.'],
        ]} />
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="WLC AireOS — verificare (ilustrativ)" kind="session" code={`(Cisco Controller) > show wlan 1
WLAN Identifier.................................. 1
Profile Name..................................... CORP
Network Name (SSID).............................. CORP
Status........................................... Enabled
Security
   802.11 Authentication:........................ Open System
   Wi-Fi Protected Access (WPA/WPA2/WPA3)........ Enabled
      WPA (SSN IE)............................... Disabled
      WPA2 (RSN IE).............................. Enabled
         TKIP Cipher............................. Disabled
         AES Cipher.............................. Enabled
         Auth Key Management
            802.1x............................... Disabled
            PSK.................................. Enabled
   Management Frame Protection................... Optional`} explain={[
          ['WPA2 (RSN IE) Enabled', 'Politica WPA2 este activă.'],
          ['TKIP Disabled / AES Enabled', 'Doar AES: fără risc de „mixed mode”.'],
          ['Auth Key Management: PSK', 'Modul Personal; la Enterprise ar apărea 802.1x.'],
          ['Management Frame Protection', 'Starea PMF; la WPA3 trebuie să fie obligatoriu.'],
        ]} />
        <Reveal label="Cum interpretezi un astfel de output la examen">
          <p>Caută: <b>cifrul</b> (TKIP activ = configurație slabă), <b>AKM</b> (PSK vs 802.1x vs SAE) și <b>PMF</b>. Un WLAN cu „TKIP Enabled + AES Enabled” este „mixed mode”; un WLAN cu „WPA (SSN IE) Enabled” este generația veche; un WLAN WPA3 ar trebui să arate SAE și PMF „Required”.</p>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Nu lăsa TKIP activ „doar în caz că”: slăbește întreaga rețea.</>,
        <>PSK și 802.1X sunt <b>AKM</b>-uri diferite; nu le amesteca pe același WLAN fără motiv.</>,
        <>La WPA3, PMF nu mai e „opțional”: trebuie „Required”.</>,
      ]} />
      <InlineQuiz ids={['5.9-038', '5.9-039', '5.9-040']} />
    </section>
  );
}
