import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 3.4. */
export function CheatSheet34() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Pornire OSPF</h3>
          <ul className="small">
            <li><code>router ospf &lt;process-id&gt;</code> — local routerului</li>
            <li><code>network &lt;adresă&gt; &lt;wildcard&gt; area &lt;id&gt;</code></li>
            <li><code>router-id &lt;IP&gt;</code> (opțional, altfel loopback/fizic)</li>
            <li><code>passive-interface &lt;int&gt;</code> — fără Hello, rețea anunțată</li>
            <li>Wildcard = inversul măștii: /24 → <code>0.0.0.255</code></li>
          </ul>
        </div>
        <div className="card"><h3>Stări vecin</h3>
          <ul className="small">
            <li><b>Down → Init → 2-WAY → ExStart → Exchange → Loading → Full</b></li>
            <li>2-WAY între DROTHER-i = <b>normal</b></li>
            <li>ExStart/Exchange blocat ⇒ <b>MTU</b> diferit</li>
            <li>Potrivire: area, mască, Hello/Dead, MTU, auth, stub</li>
          </ul>
        </div>
        <div className="card"><h3>Tipuri de rețea</h3>
          <Table head={['Tip', 'Hello/Dead', 'DR/BDR']} rows={[
            ['Broadcast (Ethernet)', '10/40 s', 'Da'],
            ['Point-to-point (serial HDLC/PPP)', '10/40 s', 'Nu'],
            ['NBMA (Frame Relay)', '30/120 s', 'Da'],
            ['Point-to-multipoint', '30/120 s', 'Nu'],
          ]} />
          <p className="small"><code>ip ospf network point-to-point</code> — pe ambele capete</p>
        </div>
        <div className="card"><h3>DR / BDR</h3>
          <ul className="small">
            <li>Criteriu: <b>prioritate</b> (implicit 1, 0–255), apoi <b>RID</b> cel mai mare</li>
            <li>Priority <b>0</b> = niciodată DR/BDR</li>
            <li><b>Non-preemptiv</b>: <code>clear ip ospf process</code> pentru o nouă alegere</li>
            <li>DROTHER ⇒ Full doar cu DR și BDR</li>
          </ul>
        </div>
        <div className="card"><h3>Router ID</h3>
          <ul className="small">
            <li>1. <code>router-id</code> manual</li>
            <li>2. cel mai mare IP pe <b>loopback</b> up/up</li>
            <li>3. cel mai mare IP pe interfață fizică up/up</li>
            <li>Schimbare ⇒ <code>clear ip ospf process</code> (sau reload)</li>
          </ul>
        </div>
        <div className="card"><h3>Cost</h3>
          <ul className="small">
            <li>cost = <b>referință</b> (100 Mbps) / bandwidth (Mbps), minim 1</li>
            <li>Gi, Fa, 10G = cost 1 implicit</li>
            <li><code>auto-cost reference-bandwidth &lt;Mbps&gt;</code> (pe toate)</li>
            <li><code>ip ospf cost &lt;n&gt;</code> (pe interfață)</li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show ip protocols</code> — RID, rețele, pasive</li>
            <li><code>show ip ospf neighbor</code> — stare și rol</li>
            <li><code>show ip ospf interface [brief]</code> — rol, cost, timere</li>
            <li><code>show ip route ospf</code> — rute O și metrica [110/x]</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
