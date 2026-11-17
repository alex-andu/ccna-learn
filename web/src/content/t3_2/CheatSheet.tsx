import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 3.2. */
export function CheatSheet32() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Ordinea deciziei</h3>
          <ol className="small">
            <li><b>Longest prefix match</b> — masca cea mai lungă</li>
            <li><b>AD</b> — mai mic (același prefix, surse diferite)</li>
            <li><b>Metrică</b> — mai mică (același protocol)</li>
            <li>Metrici egale ⇒ <b>ECMP</b></li>
            <li>Nicio rută ⇒ drop + ICMP unreachable</li>
          </ol>
        </div>
        <div className="card"><h3>Specificitate</h3>
          <Table head={['Prefix', 'Specificitate']} rows={[
            ['/32', 'maximă (host route)'], ['/26 · /24', 'mare'], ['/16 · /8', 'mică'], ['/0 (0.0.0.0/0)', 'minimă — ultima alegere'],
          ]} />
        </div>
        <div className="card"><h3>AD (mai mic = preferat)</h3>
          <Table head={['Sursa', 'AD']} rows={[
            ['Connected', '0'], ['Static', '1'], ['eBGP', '20'], ['EIGRP', '90'], ['OSPF', '110'], ['RIP', '120'],
          ]} />
        </div>
        <div className="card"><h3>Rută flotantă</h3>
          <ul className="small">
            <li><code>ip route … &lt;next hop&gt; 130</code></li>
            <li>AD &gt; al protocolului acoperit (130 &gt; 110)</li>
            <li>Ascunsă cât timp ruta preferată există</li>
            <li>Nu pune 255 (nefolosit)</li>
          </ul>
        </div>
        <div className="card"><h3>La fiecare router</h3>
          <ul className="small">
            <li>TTL − 1; la 0 ⇒ drop + ICMP time exceeded</li>
            <li>MAC sursă/destinație rescrise; IP-urile rămân</li>
            <li>ARP pentru <b>next hop</b> (la C: pentru destinație)</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small">
            <li><code>show ip route &lt;adresă&gt;</code> — ruta aleasă</li>
            <li><code>show ip route static|ospf</code></li>
            <li><code>show ip cef &lt;adresă&gt;</code></li>
            <li><code>traceroute &lt;adresă&gt;</code></li>
            <li><code>ip ospf cost &lt;n&gt;</code> — schimbă metrica</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
