import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 3.3. */
export function CheatSheet33() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Sintaxă IPv4</h3>
          <ul className="small">
            <li><code>ip route &lt;rețea&gt; &lt;mască&gt; &lt;next-hop&gt; [AD]</code></li>
            <li><code>ip route &lt;rețea&gt; &lt;mască&gt; &lt;interfață&gt;</code> (directly attached)</li>
            <li><code>ip route … &lt;interfață&gt; &lt;next-hop&gt;</code> (fully specified)</li>
            <li>AD implicit: <b>1</b></li>
          </ul>
        </div>
        <div className="card"><h3>Sintaxă IPv6</h3>
          <ul className="small">
            <li><code>ipv6 unicast-routing</code> — <b>obligatoriu</b></li>
            <li><code>ipv6 route &lt;prefix&gt;/&lt;lung&gt; &lt;next-hop&gt; [AD]</code></li>
            <li>next hop <b>link-local</b> ⇒ interfață obligatorie</li>
            <li><code>show ipv6 route [static]</code></li>
          </ul>
        </div>
        <div className="card"><h3>Cele patru tipuri</h3>
          <Table head={['Tip', 'IPv4', 'IPv6']} rows={[
            ['Default', '0.0.0.0 0.0.0.0', '::/0'],
            ['Network', 'rețea + mască', 'prefix/lung.'],
            ['Host', '255.255.255.255', '/128'],
            ['Floating', '… + AD > principal', '… + AD > principal'],
          ]} />
        </div>
        <div className="card"><h3>Flotantă — AD de ales</h3>
          <Table head={['Acoperă', 'AD ≥']} rows={[
            ['static (1)', '2'], ['EIGRP (90)', '91'], ['OSPF (110)', '111'], ['RIP (120)', '121'],
          ]} />
          <p className="small">Niciodată 255 (nefolosit).</p>
        </div>
        <div className="card"><h3>Ping între LAN-uri</h3>
          <ul className="small">
            <li>Ai nevoie de rută <b>dus</b> și <b>întoarcere</b></li>
            <li>„Unreachable” ⇒ lipsește ruta dus</li>
            <li>„Timeout” ⇒ verifică ruta de întoarcere</li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show ip route static</code></li>
            <li><code>show ip route &lt;adresă&gt;</code></li>
            <li><code>show running-config | include ip route</code></li>
            <li><code>ping</code> · <code>traceroute</code></li>
            <li>S = statică · S* = implicită statică</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
