import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.2. */
export function CheatSheet42() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>NTP pe scurt</h3>
          <ul className="small">
            <li>Sincronizează ceasurile; <b>UDP 123</b></li>
            <li>Ierarhie de <b>straturi</b>: 0 = referință, 1 = legat direct, +1 la fiecare salt</li>
            <li>Max utilizabil 15; <b>16 = nesincronizat</b></li>
            <li>Necesar pentru log-uri corelabile, certificate, audit</li>
          </ul>
        </div>
        <div className="card"><h3>Moduri</h3>
          <Table head={['Mod', 'Comandă']} rows={[
            ['Client', 'ntp server <ip> [prefer]'],
            ['Server/sursă', 'ntp master [stratum]'],
            ['Peer', 'ntp peer <ip>'],
            ['Broadcast', 'ntp broadcast / ntp broadcast client'],
          ]} />
        </div>
        <div className="card"><h3>Ceas și log</h3>
          <ul className="small">
            <li><code>clock set HH:MM:SS zi lună an</code> (EXEC privilegiat)</li>
            <li><code>clock timezone CET 1</code></li>
            <li><code>service timestamps log datetime msec</code></li>
            <li><code>ntp update-calendar</code> (calendar hardware)</li>
          </ul>
        </div>
        <div className="card"><h3>Autentificare</h3>
          <ul className="small">
            <li><code>ntp authenticate</code></li>
            <li><code>ntp authentication-key 1 md5 &lt;parola&gt;</code></li>
            <li><code>ntp trusted-key 1</code></li>
            <li>client: <code>ntp server &lt;ip&gt; key 1</code></li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show ntp status</code> — synchronized? stratum?</li>
            <li><code>show ntp associations</code> — <code>*</code>, st, reach, offset</li>
            <li><code>show clock detail</code> — „Time source is NTP”</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Sincronizarea durează minute</li>
            <li>Stratum 16 ≠ „foarte precis”</li>
            <li>UDP 123 blocat ⇒ reach 0</li>
            <li>Cheile trebuie identice pe ambele părți</li>
            <li>Fusul orar e local; NTP transportă UTC</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
