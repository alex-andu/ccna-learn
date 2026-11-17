import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 3.5. */
export function CheatSheet35() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Scop și funcții</h3>
          <ul className="small">
            <li>Elimină default gateway-ul ca <b>punct unic de defecțiune</b></li>
            <li>Gateway virtual: <b>IP virtual + MAC virtual</b></li>
            <li>Un router forwardează (Active/Master), altul așteaptă</li>
            <li>Hello → hold expirat → preluare; gazdele nu se reconfigurează</li>
            <li>Gazdele folosesc <b>adresa virtuală</b> ca gateway</li>
          </ul>
        </div>
        <div className="card"><h3>HSRP: reguli</h3>
          <ul className="small">
            <li>Priority implicit <b>100</b> (0–255); cea mai mare câștigă</li>
            <li>La egalitate: adresa IP cea mai mare</li>
            <li>Hello <b>3 s</b> · Hold <b>10 s</b></li>
            <li>Preempt <b>dezactivat</b> implicit</li>
            <li>Stări: Initial → Learn → Listen → Speak → Standby → Active</li>
            <li>v1 ≠ v2 (nu interoperează)</li>
          </ul>
        </div>
        <div className="card"><h3>Comparație</h3>
          <Table head={['', 'HSRP', 'VRRP', 'GLBP']} rows={[
            ['Standard', 'Cisco', 'IETF', 'Cisco'],
            ['Roluri', 'Active/Standby', 'Master/Backup', 'AVG/AVF'],
            ['Multicast', '224.0.0.2 / .102', '224.0.0.18', '224.0.0.102'],
            ['Transport', 'UDP 1985', 'IP 112', 'UDP 3222'],
            ['Preempt', 'off', 'on', 'off (AVG)'],
            ['Load balance', 'per grup', 'per grup', 'nativ'],
          ]} />
        </div>
        <div className="card"><h3>MAC virtual</h3>
          <ul className="small">
            <li>HSRPv1: <code>0000.0C07.ACxx</code> (xx = grup hex)</li>
            <li>HSRPv2: <code>0000.0C9F.Fxxx</code></li>
            <li>VRRP: <code>0000.5E00.01xx</code></li>
            <li>GLBP: <code>0007.B400.xxyy</code></li>
          </ul>
        </div>
        <div className="card"><h3>Configurare HSRP</h3>
          <ul className="small">
            <li><code>standby 1 ip 192.168.10.254</code></li>
            <li><code>standby 1 priority 110</code></li>
            <li><code>standby 1 preempt</code></li>
            <li><code>standby 1 track Gi0/1 20</code></li>
            <li><code>standby version 2</code> (identic pe toate)</li>
          </ul>
        </div>
        <div className="card"><h3>Verificare și capcane</h3>
          <ul className="small">
            <li><code>show standby brief</code> · <code>show standby</code></li>
            <li>Doi Active ⇒ versiune/grup diferite sau Hello blocate</li>
            <li>Tracking fără preempt pe rezervă ⇒ rolul nu se mută</li>
            <li>Load sharing HSRP ⇒ mai multe grupuri</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
