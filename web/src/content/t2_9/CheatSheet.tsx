import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.9. */
export function CheatSheet29() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Taburile unui WLAN</h3>
          <ul className="small">
            <li><b>General</b>: Profile, SSID, ID, Status, Radio Policy, Interface, Broadcast SSID</li>
            <li><b>Security</b>: Layer 2, Layer 3, AAA Servers</li>
            <li><b>QoS</b>: profil, WMM</li>
            <li><b>Advanced</b>: AAA override, timeout, excludere…</li>
          </ul>
        </div>
        <div className="card"><h3>Securitate</h3>
          <Table head={['Tip', 'Auth Key Mgmt']} rows={[
            ['WPA2-Personal', 'PSK'],
            ['WPA2-Enterprise', '802.1X + RADIUS'],
            ['WPA3-Personal', 'SAE (PMF Required)'],
            ['Oaspeți', 'L2 None + L3 Web Policy'],
          ]} />
        </div>
        <div className="card"><h3>QoS</h3>
          <Table head={['Profil', 'Trafic']} rows={[
            ['Platinum', 'voce (AC_VO)'],
            ['Gold', 'video (AC_VI)'],
            ['Silver', 'best effort (implicit)'],
            ['Bronze', 'background'],
          ]} />
        </div>
        <div className="card"><h3>WMM</h3>
          <ul className="small">
            <li>Disabled · Allowed · <b>Required</b></li>
            <li>Required = doar clienți WMM</li>
            <li>4 categorii: VO, VI, BE, BK</li>
          </ul>
        </div>
        <div className="card"><h3>Advanced (cele mai întrebate)</h3>
          <ul className="small">
            <li><b>AAA Override</b>: RADIUS poate seta VLAN/QoS/ACL</li>
            <li><b>Session Timeout</b>: reautentificare</li>
            <li><b>Client Exclusion</b>: excludere după eșecuri</li>
            <li><b>P2P Blocking</b>: oaspeții nu comunică</li>
            <li><b>DHCP Required</b>: IP static respins</li>
            <li><b>DTIM</b>, <b>Band Select</b>, <b>Load Balancing</b></li>
          </ul>
        </div>
        <div className="card"><h3>Ordinea creării</h3>
          <ul className="small">
            <li>Create New → Profile/SSID/ID</li>
            <li>General: interfață</li>
            <li>Security → QoS → Advanced</li>
            <li>Status: <b>Enabled</b> + Save</li>
          </ul>
        </div>
        <div className="card"><h3>Greșeli de interpretat</h3>
          <ul className="small">
            <li>Interface greșită ⇒ VLAN greșit</li>
            <li>802.1X fără server RADIUS</li>
            <li>WPA3 fără PMF Required</li>
            <li>Voce pe Silver/Bronze</li>
            <li>Status Disabled</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>Profile Name ≠ SSID</li>
            <li>SSID ascuns ≠ securitate</li>
            <li>MAC filtering ≠ securitate puternică</li>
            <li>9800: WLAN profile + Policy profile + Policy tag</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
