import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă (o pagină A4, două coloane la print). */
export function CheatSheet111() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Standarde 802.11</h3>
          <Table head={['Std', 'Wi-Fi', 'Bandă', 'Max', 'Cheie']} rows={[
            ['b', '—', '2.4', '11 Mbps', 'DSSS, 22 MHz'], ['a', '—', '5', '54 Mbps', 'OFDM'], ['g', '—', '2.4', '54 Mbps', 'OFDM, compat. b'],
            ['n', '4', '2.4 + 5', '600 Mbps', 'MIMO 4SS, 40 MHz'], ['ac', '5', 'doar 5', '≈6.9 Gbps', '256-QAM, MU-MIMO DL'],
            ['ax', '6 / 6E', '2.4 + 5 (+6)', '≈9.6 Gbps', 'OFDMA, 1024-QAM, MU-MIMO UL+DL'], ['be', '7', '2.4 + 5 + 6', '≈46 Gbps', '320 MHz, 4096-QAM, MLO'],
          ]} />
        </div>
        <div className="card"><h3>Canale</h3>
          <ul className="small">
            <li><b>2.4 GHz:</b> fără suprapunere <b>1, 6, 11</b> (pas de 5 MHz, lățime ≈22 MHz). UE: 1–13, SUA: 1–11.</li>
            <li><b>5 GHz:</b> 20 MHz, fără suprapunere; UE 19 canale (36–64, 100–140), SUA 25. DFS: 52–144.</li>
            <li><b>6 GHz:</b> UE 5945–6425 MHz (24 × 20 MHz); doar Wi-Fi 6E/7, WPA3 obligatoriu.</li>
            <li>Bonding: 40 = 2 ch · 80 = 4 · 160 = 8 · 320 = 16. Nu folosi 40 MHz în 2.4 GHz.</li>
            <li><b>CCI</b> = același canal (împart timpul) · <b>ACI</b> = canale care se suprapun (zgomot, mai grav).</li>
          </ul>
        </div>
        <div className="card"><h3>RF</h3>
          <ul className="small">
            <li>λ = c/f → 2.4 GHz ≈ 12.5 cm · 5 GHz ≈ 6 cm. Frecvență ↑ → rază ↓.</li>
            <li>0 dBm = 1 mW · 10 = 10 mW · 20 = 100 mW · 30 = 1 W. +3 dB = ×2 · +10 dB = ×10.</li>
            <li>EIRP = TX − pierderi cablu + câștig antenă (dBi).</li>
            <li>SNR = semnal − zgomot (dB). RSSI ≥ −67 dBm și SNR ≥ 25 dB pentru voce.</li>
            <li>Absorption (apă), Reflection (metal), Refraction, Diffraction, Scattering.</li>
            <li>Acces la mediu: <b>CSMA/CA</b>, half-duplex, ACK pentru fiecare cadru unicast; RTS/CTS → hidden node.</li>
          </ul>
        </div>
        <div className="card"><h3>SSID & topologii</h3>
          <ul className="small">
            <li><b>SSID</b>: nume, ≤ 32 octeți, sensibil la majuscule. PSK: 8–63 caractere.</li>
            <li><b>BSSID</b>: MAC-ul celulei (radio + SSID). 2 radiouri × 3 SSID = 6 BSSID.</li>
            <li><b>BSS</b> = 1 AP + clienți · <b>ESS</b> = mai multe AP-uri, același SSID (roaming) · <b>IBSS</b> = ad hoc.</li>
            <li>Conectare: beacon/probe → auth (open) → association → 4-way handshake → DHCP.</li>
            <li>SSID ascuns și filtrarea MAC ≠ securitate.</li>
          </ul>
        </div>
        <div className="card"><h3>Criptare</h3>
          <Table head={['', 'Criptare', 'Note']} rows={[
            ['WEP', 'RC4 + IV 24 biți', 'spart'], ['WPA', 'TKIP (RC4)', 'depreciat'], ['WPA2', 'AES-CCMP 128', '802.11i, PSK sau 802.1X'],
            ['WPA3', 'CCMP / GCMP-256', 'SAE, PMF obligatoriu, 192-bit Ent.'],
          ]} />
          <p className="small">4-way: M1 ANonce → M2 SNonce+MIC → M3 GTK+MIC → M4 ACK. PMK nu circulă prin aer.</p>
        </div>
        <div className="card"><h3>Comenzi utile</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>netsh wlan show interfaces</li><li>netsh wlan show networks mode=bssid</li><li>nmcli dev wifi list · iw dev wlan0 link</li>
            <li>AP: dot11 ssid X · channel 6 · encryption mode ciphers aes-ccm</li><li>9800: show wlan summary · show wireless client summary</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
