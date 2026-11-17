import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.6. */
export function CheatSheet56() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Reguli de bază</h3>
          <ul className="small">
            <li>De sus în jos; <b>prima potrivire decide</b></li>
            <li><b>Deny implicit</b> la final (invizibil)</li>
            <li>Specific înaintea generalului</li>
            <li>Stateless: răspunsurile se permit explicit</li>
            <li>Un ACL / interfață / direcție / protocol</li>
            <li>ACL inexistent referit = permite tot</li>
          </ul>
        </div>
        <div className="card"><h3>Tipuri</h3>
          <Table head={['', 'Std', 'Ext']} rows={[
            ['Numere', '1–99, 1300–1999', '100–199, 2000–2699'],
            ['Potrivește', 'sursa', 'proto, src, dst, porturi'],
            ['Plasare', 'lângă dest.', 'lângă sursă'],
          ]} />
        </div>
        <div className="card"><h3>Wildcard</h3>
          <ul className="small">
            <li>0 = verifică · 1 = ignoră</li>
            <li>wildcard = 255 − mască (pe octet)</li>
            <li>/24 → 0.0.0.255 · /26 → 0.0.0.63 · /28 → 0.0.0.15 · /30 → 0.0.0.3</li>
            <li><code>host x</code> = x 0.0.0.0</li>
            <li><code>any</code> = 0.0.0.0 255.255.255.255</li>
          </ul>
        </div>
        <div className="card"><h3>Sintaxă</h3>
          <ul className="small">
            <li><code>access-list 10 permit 192.168.1.0 0.0.0.255</code></li>
            <li><code>ip access-list extended NUME</code></li>
            <li><code>15 permit tcp … host 10.1.1.80 eq 80</code></li>
            <li><code>no 20</code> · <code>remark …</code> · <code>… log</code></li>
            <li>Porturi: eq / neq / gt / lt / range</li>
          </ul>
        </div>
        <div className="card"><h3>Aplicare</h3>
          <ul className="small">
            <li>Interfață: <code>ip access-group NUME in|out</code></li>
            <li>VTY: <code>access-class NUME in</code></li>
            <li>IPv6: <code>ipv6 traffic-filter NUME in</code></li>
            <li>in = înainte de rutare · out = după rutare</li>
            <li>out nu filtrează traficul generat de router</li>
          </ul>
        </div>
        <div className="card"><h3>Verificare / depanare</h3>
          <ul className="small">
            <li><code>show access-lists</code> (matches)</li>
            <li><code>show ip interface &lt;if&gt;</code></li>
            <li><code>show run | section access</code></li>
            <li><code>clear access-list counters</code></li>
            <li>Verifică: ordine · permit final · wildcard · interfață/direcție · aplicat?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
