import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.6. */
export function CheatSheet26() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Arhitecturi</h3>
          <Table head={['Tip', 'Cheie']} rows={[
            ['Autonomous', 'fiecare AP singur; fără WLC'],
            ['Lightweight + WLC', 'CAPWAP, split-MAC, centralizat'],
            ['Cloud-based', 'dashboard cloud; date locale'],
            ['Embedded (EWC)', 'WLC într-un AP/switch; mic'],
          ]} />
        </div>
        <div className="card"><h3>CAPWAP</h3>
          <ul className="small">
            <li>RFC 5415</li>
            <li>Control: <b>UDP 5246</b> (DTLS)</li>
            <li>Date: <b>UDP 5247</b> (DTLS opțional)</li>
            <li>LWAPP = istoric</li>
            <li>Join: IP → discovery → DTLS → join → config → Run</li>
          </ul>
        </div>
        <div className="card"><h3>Split-MAC</h3>
          <ul className="small">
            <li><b>AP</b>: beacon, ACK, criptare (timp real)</li>
            <li><b>WLC</b>: auth, config, RRM, roaming, rogue</li>
          </ul>
        </div>
        <div className="card"><h3>Descoperirea WLC</h3>
          <ul className="small">
            <li>adrese salvate · <b>DHCP option 43</b> · DNS · broadcast</li>
            <li>Port UDP 5246/5247 deschise pe traseu</li>
          </ul>
        </div>
        <div className="card"><h3>Moduri AP</h3>
          <Table head={['Mod', 'Clienți?']} rows={[
            ['Local (implicit)', 'da'],
            ['FlexConnect', 'da (local switching)'],
            ['Monitor', 'nu'],
            ['Sniffer', 'nu'],
            ['Rogue Detector', 'nu'],
            ['SE-Connect', 'nu'],
            ['Bridge/Mesh', 'da (mesh)'],
          ]} />
        </div>
        <div className="card"><h3>Local vs FlexConnect</h3>
          <ul className="small">
            <li>Local: tunel la WLC · port <b>access</b></li>
            <li>Flex: local switching · port <b>trunk</b></li>
            <li>WLC cade: Local pierde; Flex continuă</li>
          </ul>
        </div>
        <div className="card"><h3>Alegere</h3>
          <ul className="small">
            <li>Campus mare ⇒ lightweight + WLC</li>
            <li>Sucursale numeroase, fără IT ⇒ cloud</li>
            <li>WAN lent ⇒ FlexConnect</li>
            <li>Foarte puține AP ⇒ autonomous</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>5246 control · 5247 date</li>
            <li>Cloud: managementul în cloud, nu datele</li>
            <li>Sniffer ≠ Monitor</li>
            <li>Modul implicit: Local</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
