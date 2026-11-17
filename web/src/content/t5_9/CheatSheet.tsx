import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.9. */
export function CheatSheet59() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>WPA / WPA2 / WPA3</h3>
          <Table head={['', 'WPA', 'WPA2', 'WPA3']} rows={[
            ['An', '2003', '2004', '2018'],
            ['Cifru', 'TKIP (RC4)', 'AES-CCMP', 'CCMP; 192-bit: GCMP-256'],
            ['Personal', 'PSK', 'PSK', 'SAE'],
            ['PMF', 'nu', 'opțional', 'obligatoriu'],
          ]} />
          <p className="small">WEP: RC4, spart. Open: fără criptare; OWE = open criptat (WPA3).</p>
        </div>
        <div className="card"><h3>Personal vs Enterprise</h3>
          <ul className="small">
            <li>Personal: parolă comună (PSK/SAE), fără server</li>
            <li>Enterprise: 802.1X/EAP + RADIUS, credențiale individuale</li>
            <li>Enterprise: revocare individuală, VLAN/ACL pe utilizator</li>
          </ul>
        </div>
        <div className="card"><h3>PSK vs SAE</h3>
          <ul className="small">
            <li>PSK: handshake capturat → dicționar OFFLINE</li>
            <li>SAE: ghicire doar online + forward secrecy</li>
            <li>Parolă PSK: 8–63 ASCII sau 64 hex</li>
            <li>Transition mode = protecția celui mai slab</li>
          </ul>
        </div>
        <div className="card"><h3>Metode EAP</h3>
          <ul className="small">
            <li><b>EAP-TLS</b>: certificate server + client (cea mai sigură)</li>
            <li><b>PEAP</b>: tunel TLS + parolă înăuntru</li>
            <li><b>EAP-FAST</b>: Cisco, PAC</li>
            <li><b>LEAP</b>: vechi, nesigur</li>
          </ul>
        </div>
        <div className="card"><h3>Atac → apărare</h3>
          <Table head={['Atac', 'Apărare']} rows={[
            ['Deauth', 'PMF (802.11w)'],
            ['Dicționar offline', 'SAE / parolă lungă'],
            ['Evil twin', 'validare certificat + WIPS'],
            ['Rogue AP', 'detecție rogue + 802.1X pe porturi'],
          ]} />
        </div>
        <div className="card"><h3>Nu e securitate</h3>
          <ul className="small">
            <li>SSID ascuns</li>
            <li>Filtrare MAC</li>
            <li>Portal captiv singur</li>
            <li>WEP, WPA/TKIP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
