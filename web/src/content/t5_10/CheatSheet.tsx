import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.10. */
export function CheatSheet510() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Pașii în GUI</h3>
          <ol className="small">
            <li>Interfață dinamică (VLAN, IP, DHCP)</li>
            <li>WLANs → Create New (profil, SSID, ID)</li>
            <li>General: Enabled + Interface</li>
            <li>Security → Layer 2: WPA+WPA2, AES, PSK, parola</li>
            <li>Apply → client de test → Monitor → Clients</li>
          </ol>
        </div>
        <div className="card"><h3>Reguli parolă PSK</h3>
          <Table head={['Format', 'Regulă']} rows={[
            ['ASCII', '8–63 caractere, case-sensitive, fără diacritice'],
            ['HEX', 'exact 64 de cifre 0–9/a–f'],
          ]} />
          <p className="small">SSID: 1–32 caractere.</p>
        </div>
        <div className="card"><h3>Setări de securitate</h3>
          <ul className="small">
            <li>Layer 2 Security: <b>WPA+WPA2</b></li>
            <li>WPA2 Policy ✔ · Encryption <b>AES</b> ✔ · TKIP ✘</li>
            <li>Auth Key Mgmt: <b>PSK</b> (nu 802.1X)</li>
            <li>PMF: opțional la WPA2</li>
          </ul>
        </div>
        <div className="card"><h3>CLI AireOS</h3>
          <ul className="small">
            <li><code>config wlan create 1 PROFIL SSID</code></li>
            <li><code>config wlan interface 1 employee</code></li>
            <li><code>config wlan security wpa wpa2 ciphers aes enable 1</code></li>
            <li><code>config wlan security wpa akm psk enable 1</code></li>
            <li><code>… akm psk set-key ascii PAROLA 1</code></li>
            <li><code>config wlan enable 1</code></li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li>Lista WLANs: Enabled, [WPA2][Auth(PSK)]</li>
            <li><code>show wlan 1</code> · <code>show wlan summary</code></li>
            <li><code>show client summary</code> · Monitor → Clients</li>
            <li>Test cu parolă greșită (trebuie respins)</li>
          </ul>
        </div>
        <div className="card"><h3>Simptom → cauză</h3>
          <Table head={['Simptom', 'Cauză']} rows={[
            ['Nu vede SSID', 'Disabled / AP / radio'],
            ['Nu se conectează', 'parolă / generație / cifru / AKM'],
            ['169.254.x.x', 'DHCP / VLAN / trunk'],
            ['VLAN greșit', 'interfață greșită'],
          ]} />
        </div>
      </div>
    </div>
  );
}
