import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.7. */
export function CheatSheet27() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Port de switch pentru…</h3>
          <Table head={['Dispozitiv', 'Port']} rows={[
            ['AP lightweight Local', 'access (VLAN mgmt AP)'],
            ['AP FlexConnect', 'trunk'],
            ['AP autonom, mai multe VLAN', 'trunk'],
            ['WLC distribution system port', 'trunk (± LAG)'],
            ['WLC service port', 'access (VLAN OOB)'],
          ]} />
        </div>
        <div className="card"><h3>Porturi WLC</h3>
          <ul className="small">
            <li><b>Distribution system</b>: date, CAPWAP, clienți, mgmt in-band</li>
            <li><b>Service port</b>: OOB management</li>
            <li><b>Redundancy port</b>: pereche HA</li>
            <li><b>Console</b>: CLI local</li>
          </ul>
        </div>
        <div className="card"><h3>Interfețe logice WLC</h3>
          <ul className="small">
            <li><b>Management</b>: adresa principală, CAPWAP</li>
            <li><b>Dynamic</b>: WLAN ↔ VLAN/subrețea</li>
            <li><b>Virtual</b>: DHCP relay/web auth/mobilitate (ex. 192.0.2.1)</li>
            <li><b>Service-port</b>: OOB</li>
            <li><b>Redundancy management</b>: HA</li>
          </ul>
        </div>
        <div className="card"><h3>LAG (WLC AireOS)</h3>
          <ul className="small">
            <li>Static: switch <code>channel-group N mode on</code></li>
            <li>Fără LACP/PAgP</li>
            <li>Toate porturile → același switch</li>
            <li>Activare ⇒ <b>reboot</b></li>
            <li>Trunk 802.1Q pe port-channel</li>
          </ul>
        </div>
        <div className="card"><h3>AP — cabluri</h3>
          <ul className="small">
            <li>100 m pe UTP</li>
            <li>PoE af/at/bt</li>
            <li>Multigig 2,5/5 Gbps la AP moderne</li>
            <li>PortFast pe portul AP</li>
          </ul>
        </div>
        <div className="card"><h3>Probleme frecvente</h3>
          <ul className="small">
            <li>Client asociat dar fără IP ⇒ VLAN nepermis pe trunk / DHCP</li>
            <li>AP fără join ⇒ VLAN/DHCP/rută/UDP 5246-5247</li>
            <li>LAG nu se formează ⇒ LACP pe switch, nu <code>on</code></li>
            <li>Native VLAN nepotrivit ⇒ mgmt rupt</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>Local ⇒ access; Flex ⇒ trunk</li>
            <li>Service port ≠ trunk</li>
            <li>LAG WLC = static</li>
            <li>Dynamic interface ⇒ VLAN</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
