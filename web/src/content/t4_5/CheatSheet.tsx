import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.5. */
export function CheatSheet45() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Severități</h3>
          <Table head={['Nr.', 'Nume']} rows={[
            ['0', 'emergencies'], ['1', 'alerts'], ['2', 'critical'], ['3', 'errors'], ['4', 'warnings'], ['5', 'notifications'], ['6', 'informational'], ['7', 'debugging'],
          ]} />
          <p className="small">Nivel N = 0 până la N. Număr mic = grav. „Every Awesome Cisco Engineer Will Need Ice-cream Daily”.</p>
        </div>
        <div className="card"><h3>Format mesaj</h3>
          <ul className="small">
            <li><code>timestamp: %FACILITY-SEV-MNEMONIC: text</code></li>
            <li><code>%LINK-3-UPDOWN</code> · <code>%LINEPROTO-5-UPDOWN</code> · <code>%SYS-5-CONFIG_I</code></li>
            <li>Prefix <code>*</code> = ceas nesetat; <code>.</code> = NTP nesincronizat</li>
            <li>Prioritate syslog = facility × 8 + severitate</li>
          </ul>
        </div>
        <div className="card"><h3>Destinații</h3>
          <ul className="small">
            <li>Consolă: <code>logging console [nivel]</code></li>
            <li>VTY: <code>logging monitor</code> + <code>terminal monitor</code></li>
            <li>Buffer RAM: <code>logging buffered [mărime] [nivel]</code></li>
            <li>Server: <code>logging host &lt;ip&gt;</code> + <code>logging trap [nivel]</code></li>
          </ul>
        </div>
        <div className="card"><h3>Facility syslog</h3>
          <ul className="small">
            <li>0–23; local0–local7 = 16–23</li>
            <li>Cisco implicit <b>local7</b> (<code>logging facility</code>)</li>
            <li>Transport: UDP 514</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi utile</h3>
          <ul className="small">
            <li><code>service timestamps log datetime msec</code></li>
            <li><code>service sequence-numbers</code></li>
            <li><code>logging source-interface loopback0</code></li>
            <li><code>logging synchronous</code> (line con/vty)</li>
            <li><code>show logging</code> · <code>clear logging</code></li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Nivel mai mare ca număr = mai multe mesaje, nu mai grave</li>
            <li>Bufferul se pierde la reload</li>
            <li>Fiecare destinație are nivelul ei</li>
            <li>Fără NTP, log-urile nu se pot corela</li>
            <li>Debug (7) doar temporar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
