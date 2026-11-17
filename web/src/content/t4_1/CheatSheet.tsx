import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.1. */
export function CheatSheet41() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Cele patru adrese</h3>
          <Table head={['Nume', 'Exemplu']} rows={[
            ['Inside local', '192.168.1.10 (privată)'],
            ['Inside global', '203.0.113.10 (publică)'],
            ['Outside local', '198.51.100.5'],
            ['Outside global', '198.51.100.5'],
          ]} />
          <p className="small">Se schimbă doar inside local ↔ inside global.</p>
        </div>
        <div className="card"><h3>Cele trei tipuri</h3>
          <Table head={['Tip', 'Raport', 'Cuvânt-cheie']} rows={[
            ['Static', '1:1 fix', 'static'],
            ['Dynamic (pool)', '1:1 la cerere', 'pool'],
            ['PAT', 'mulți:1', 'overload'],
          ]} />
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small">
            <li><code>ip nat inside</code> / <code>ip nat outside</code> (pe interfețe)</li>
            <li><code>ip nat inside source static &lt;local&gt; &lt;global&gt;</code></li>
            <li><code>ip nat pool NUME &lt;start&gt; &lt;end&gt; netmask &lt;mască&gt;</code></li>
            <li><code>access-list N permit &lt;rețea&gt; &lt;wildcard&gt;</code></li>
            <li><code>ip nat inside source list N pool NUME [overload]</code></li>
            <li><code>ip nat inside source list N interface &lt;if&gt; overload</code></li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show ip nat translations</code></li>
            <li><code>show ip nat statistics</code></li>
            <li><code>clear ip nat translation *</code></li>
            <li><code>debug ip nat</code></li>
            <li><code>show access-lists</code> (matches)</li>
          </ul>
        </div>
        <div className="card"><h3>Ordinea operațiilor</h3>
          <ul className="small">
            <li>Inside → outside: <b>rutare, apoi NAT</b> (sursa)</li>
            <li>Outside → inside: <b>NAT</b> (destinația), apoi rutare</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Lipsește <code>overload</code> ⇒ pool epuizat</li>
            <li>ACL: wildcard, nu mască; <code>permit</code> = traduce</li>
            <li>Interfețe inside/outside inversate sau lipsă</li>
            <li>ISP fără rută spre adresele publice</li>
            <li>PAT nu primește conexiuni din exterior (fără static)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
