import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.9. */
export function CheatSheet49() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>TFTP vs FTP</h3>
          <Table head={['', 'TFTP', 'FTP']} rows={[
            ['Transport', 'UDP 69', 'TCP 21 (+20/pasiv)'],
            ['Autentificare', 'nu', 'utilizator + parolă (clar)'],
            ['Criptare', 'nu', 'nu'],
            ['Complexitate', 'minimă', 'mai bogat'],
            ['Fiabilitate', 'ACK pe bloc (lock-step)', 'TCP'],
          ]} />
        </div>
        <div className="card"><h3>Ce copiem</h3>
          <ul className="small">
            <li>running-config (RAM) · startup-config (NVRAM)</li>
            <li>Imagine IOS (<code>flash:</code>) · licențe, certificate</li>
            <li>Scop: backup, restaurare, replicare, upgrade</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi copy</h3>
          <ul className="small">
            <li><code>copy running-config tftp:</code> — backup</li>
            <li><code>copy tftp: running-config</code> — <b>îmbină</b></li>
            <li><code>copy tftp: startup-config</code> — înlocuiește (reload)</li>
            <li><code>copy tftp: flash:</code> — upgrade imagine</li>
            <li><code>copy running-config startup-config</code></li>
          </ul>
        </div>
        <div className="card"><h3>FTP pe IOS</h3>
          <ul className="small">
            <li><code>ip ftp username …</code> · <code>ip ftp password …</code></li>
            <li><code>ip ftp passive</code> (firewall/NAT)</li>
            <li><code>copy … ftp://user:parola@ip/fișier</code></li>
            <li>Securizat: SCP/SFTP (SSH, TCP 22), FTPS</li>
          </ul>
        </div>
        <div className="card"><h3>Upgrade IOS</h3>
          <ol className="small">
            <li><code>dir flash:</code> — spațiu liber</li>
            <li><code>ping</code> server</li>
            <li><code>copy tftp: flash:</code></li>
            <li><code>verify /md5 flash:…</code></li>
            <li><code>boot system flash:…</code></li>
            <li>salvezi config → <code>reload</code> → <code>show version</code></li>
          </ol>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>TFTP: fără autentificare, UDP</li>
            <li>FTP trimite parola în clar</li>
            <li>SFTP ≠ FTP securizat (alt protocol, peste SSH)</li>
            <li>Nu sări peste MD5 și spațiul din flash</li>
            <li>FTP activ vs pasiv: cine deschide datele</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
