import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 3.1. */
export function CheatSheet31() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Anatomia unei rute</h3>
          <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>O  10.2.2.0/24 [110/2] via 10.1.1.2, 00:12:34, Gi0/0</pre>
          <ul className="small">
            <li><b>O</b> — codul (sursa)</li>
            <li><b>10.2.2.0</b> — prefix; <b>/24</b> — mască</li>
            <li><b>110</b> — AD; <b>2</b> — metrică</li>
            <li><b>via 10.1.1.2</b> — next hop</li>
            <li>vârstă + interfața de ieșire</li>
          </ul>
        </div>
        <div className="card"><h3>Coduri</h3>
          <Table head={['Cod', 'Sursa']} rows={[
            ['C', 'connected (rețeaua interfeței)'],
            ['L', 'local (/32, adresa routerului)'],
            ['S / S*', 'static / rută implicită'],
            ['O (IA, E1/E2)', 'OSPF'],
            ['D (EX)', 'EIGRP'],
            ['R', 'RIP'],
            ['B', 'BGP'],
          ]} />
        </div>
        <div className="card"><h3>AD implicit (mai mic = preferat)</h3>
          <Table head={['Sursa', 'AD']} rows={[
            ['Connected', '0'], ['Static', '1'], ['eBGP', '20'], ['EIGRP intern', '90'], ['OSPF', '110'], ['RIP', '120'], ['EIGRP extern', '170'], ['iBGP', '200'], ['Unusable', '255'],
          ]} />
        </div>
        <div className="card"><h3>Metrici</h3>
          <ul className="small">
            <li><b>OSPF</b>: cost = 100 Mbps ÷ bandă (FE/GE/10G = 1)</li>
            <li><b>RIP</b>: hop-uri (max 15, 16 = inaccesibil)</li>
            <li><b>EIGRP</b>: compusă (bandă + delay)</li>
            <li>connected / static: 0</li>
            <li>Se compară doar <b>în același protocol</b></li>
          </ul>
        </div>
        <div className="card"><h3>Gateway of last resort</h3>
          <ul className="small">
            <li><code>0.0.0.0/0</code> = ruta implicită (S*)</li>
            <li>Folosită doar când nu există rută mai specifică</li>
            <li>„not set” ⇒ pachetele fără rută sunt aruncate (ICMP unreachable)</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small">
            <li><code>show ip route [static|connected|ospf]</code></li>
            <li><code>show ip route &lt;adresă&gt;</code> — ruta folosită</li>
            <li><code>show ip interface brief</code></li>
            <li><code>show ipv6 route</code></li>
            <li><code>show ip cef &lt;adresă&gt;</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
