import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.8. */
export function CheatSheet28() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Metode de acces</h3>
          <Table head={['Metodă', 'Port', 'Criptat']} rows={[
            ['Console', 'local', 'n/a (OOB)'],
            ['Telnet', 'TCP 23', 'NU'],
            ['SSH', 'TCP 22', 'da'],
            ['HTTP', 'TCP 80', 'NU'],
            ['HTTPS', 'TCP 443', 'da'],
          ]} />
        </div>
        <div className="card"><h3>TACACS+ vs RADIUS</h3>
          <Table head={['', 'TACACS+', 'RADIUS']} rows={[
            ['Transport', 'TCP 49', 'UDP 1812/1813'],
            ['Origine', 'Cisco', 'standard deschis'],
            ['Criptare', 'tot corpul', 'doar parola'],
            ['AAA', 'separat', 'auth+autz împreună'],
            ['Folosit la', 'admin echipamente', '802.1X, VPN, WLAN'],
          ]} />
        </div>
        <div className="card"><h3>AAA</h3>
          <ul className="small">
            <li><b>Authentication</b>: cine ești</li>
            <li><b>Authorization</b>: ce ai voie</li>
            <li><b>Accounting</b>: ce ai făcut</li>
            <li>Fallback <code>local</code> în lista de metode</li>
          </ul>
        </div>
        <div className="card"><h3>SSH pe IOS</h3>
          <ul className="small">
            <li>hostname + <code>ip domain-name</code></li>
            <li><code>crypto key generate rsa modulus 2048</code></li>
            <li><code>ip ssh version 2</code></li>
            <li><code>username X secret Y</code></li>
            <li>vty: <code>transport input ssh</code> + <code>login local</code></li>
          </ul>
        </div>
        <div className="card"><h3>Securizare</h3>
          <ul className="small">
            <li><code>enable secret</code> (hash)</li>
            <li><code>access-class</code> pe vty</li>
            <li><code>exec-timeout</code>, <code>login block-for</code></li>
            <li><code>no ip http server</code> + <code>ip http secure-server</code></li>
          </ul>
        </div>
        <div className="card"><h3>In-band vs OOB</h3>
          <ul className="small">
            <li><b>In-band</b>: prin rețeaua de producție (SSH/HTTPS)</li>
            <li><b>OOB</b>: console, port de management, rețea separată</li>
            <li>OOB funcționează când producția cade</li>
          </ul>
        </div>
        <div className="card"><h3>Cloud-managed</h3>
          <ul className="small">
            <li>Dashboard (ex. Meraki), HTTPS</li>
            <li>Echipamentul inițiază conexiunea spre cloud</li>
            <li>Datele clienților rămân locale</li>
            <li>Fără cloud: funcționează, dar nu mai configurezi</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>Telnet/HTTP = clar</li>
            <li>TACACS+ 49 TCP · RADIUS 1812/1813 UDP</li>
            <li>802.1X ⇒ RADIUS</li>
            <li>Fără „local” ⇒ risc de blocare</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
