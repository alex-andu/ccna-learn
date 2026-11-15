import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.3. */
export function CheatSheet23() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>CDP vs LLDP</h3>
          <Table head={['', 'CDP', 'LLDP']} rows={[
            ['Standard', 'proprietar Cisco', 'IEEE 802.1AB'],
            ['Implicit pe IOS', 'ACTIV', 'DEZACTIVAT'],
            ['Pornire', 'cdp run', 'lldp run'],
            ['Pe interfață', 'cdp enable', 'lldp transmit / receive'],
            ['Timer / hold', '60 s / 180 s', '30 s / 120 s'],
            ['Show', 'show cdp neighbors', 'show lldp neighbors'],
          ]} />
        </div>
        <div className="card"><h3>Reguli de bază</h3>
          <ul className="small">
            <li>Nivel <b>2</b>: fără IP, <b>doar vecini direcți</b>.</li>
            <li>Cadre link-local: <b>nu</b> se retransmit.</li>
            <li>Informative: nu configurează nimic.</li>
            <li>Intrarea expiră după <b>hold time</b> fără anunț.</li>
            <li>Pot rula ambele simultan (tabele separate).</li>
          </ul>
        </div>
        <div className="card"><h3>CDP — comenzi</h3>
          <ul className="small">
            <li><code>cdp run</code> / <code>no cdp run</code> (global)</li>
            <li><code>cdp enable</code> / <code>no cdp enable</code> (interfață)</li>
            <li><code>cdp timer 30</code> · <code>cdp holdtime 120</code></li>
            <li><code>show cdp</code> · <code>show cdp interface</code> · <code>show cdp traffic</code></li>
            <li><code>show cdp neighbors</code> · <b><code>… detail</code></b> (IP, versiune) · <code>show cdp entry X</code></li>
          </ul>
        </div>
        <div className="card"><h3>LLDP — comenzi</h3>
          <ul className="small">
            <li><code>lldp run</code> / <code>no lldp run</code> (global)</li>
            <li><code>lldp transmit</code> · <code>lldp receive</code> (interfață; <code>no …</code> pentru oprire)</li>
            <li><code>lldp timer</code> · <code>lldp holdtime</code></li>
            <li><code>show lldp</code> · <code>show lldp neighbors [detail]</code> · <code>show lldp interface</code></li>
          </ul>
        </div>
        <div className="card"><h3>Citirea show cdp neighbors</h3>
          <ul className="small">
            <li><b>Local Intrfce</b> = portul <u>tău</u>.</li>
            <li><b>Port ID</b> = portul <u>vecinului</u>.</li>
            <li><b>Holdtme</b> scade; se resetează la fiecare anunț.</li>
            <li>Capability CDP: R router · S switch · H host · P phone · I IGMP · B/T bridge.</li>
            <li>IP și versiune: doar în <b>detail</b>.</li>
          </ul>
        </div>
        <div className="card"><h3>LLDP — detalii</h3>
          <ul className="small">
            <li>EtherType <b>0x88CC</b>; dest <b>01-80-C2-00-00-0E</b>.</li>
            <li>TLV obligatorii: <b>Chassis ID, Port ID, TTL</b> (+ End).</li>
            <li>Opționale: Port Descr., System Name/Descr., Capabilities, Mgmt Addr.</li>
            <li><b>LLDP-MED</b>: voce, QoS, PoE pentru telefoane.</li>
          </ul>
        </div>
        <div className="card"><h3>Securitate și depanare</h3>
          <ul className="small">
            <li>Anunțuri în clar ⇒ oprește pe porturile spre utilizatori/exterior.</li>
            <li>Vecin lipsă: link → protocol global → interfață → același protocol → contoare.</li>
            <li>CDP raportează <code>NATIVE_VLAN_MISMATCH</code> și <code>DUPLEX_MISMATCH</code>.</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>CDP on / LLDP off implicit.</li>
            <li>CDP 60/180 · LLDP 30/120.</li>
            <li>Vecini direcți doar.</li>
            <li>Local Intrfce ≠ Port ID.</li>
            <li>IP vecin ⇒ <code>detail</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
