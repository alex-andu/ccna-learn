import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.1. */
export function CheatSheet21() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>VLAN — esențial</h3>
          <ul className="small">
            <li>VLAN = <b>domeniu de broadcast</b> separat, de regulă <b>o subrețea IP</b>.</li>
            <li>VLAN ID: 12 biți. Normal range <b>1–1005</b> (1 și 1002–1005 speciale); extended <b>1006–4094</b>; 0 și 4095 rezervate.</li>
            <li>Normal range în <code>vlan.dat</code> (flash), nu în startup-config.</li>
            <li>Între VLAN-uri: doar cu dispozitiv <b>L3</b>.</li>
            <li>Ștergi VLAN ⇒ porturile rămân atribuite, dar <b>inactive</b>.</li>
          </ul>
        </div>
        <div className="card"><h3>Port access + voice</h3>
          <ul className="small">
            <li><code>vlan 10</code> + <code>name X</code></li>
            <li><code>switchport mode access</code></li>
            <li><code>switchport access vlan 10</code></li>
            <li><code>switchport voice vlan 40</code> — voce cu tag 802.1Q, date fără tag.</li>
            <li>Telefon află VLAN-ul prin <b>CDP / LLDP-MED</b>.</li>
            <li><code>show vlan brief</code> (fără trunk-uri) · <code>show interfaces fa0/1 switchport</code></li>
          </ul>
        </div>
        <div className="card"><h3>Default VLAN (VLAN 1)</h3>
          <ul className="small">
            <li>Toate porturile din fabrică; nume <i>default</i>.</li>
            <li><b>Nu</b> se șterge, <b>nu</b> se redenumește (nici 1002–1005).</li>
            <li>VLAN nativ implicit al trunk-urilor (2.2).</li>
            <li>Bune practici: utilizatori în VLAN-uri dedicate; porturi libere → VLAN „parcare” + <code>shutdown</code>; management în alt VLAN.</li>
          </ul>
        </div>
        <div className="card"><h3>Inter-VLAN — 3 metode</h3>
          <Table head={['Metodă', 'Cheie']} rows={[
            ['Un port/VLAN', 'învechit, un cablu per VLAN'],
            ['Router-on-a-stick', 'trunk + subinterfețe'],
            ['Switch L3 + SVI', 'ip routing + interface vlan'],
          ]} />
        </div>
        <div className="card"><h3>Router-on-a-stick</h3>
          <ul className="small">
            <li>Interfața fizică: <b>fără IP</b>, <code>no shutdown</code>.</li>
            <li><code>interface g0/0.10</code> → <code>encapsulation dot1Q 10</code> → <code>ip address …</code></li>
            <li>Portul switch-ului spre router = <b>trunk</b>, cu VLAN-urile permise.</li>
            <li>Gateway-ul hosturilor = IP-ul subinterfeței.</li>
          </ul>
        </div>
        <div className="card"><h3>SVI pe switch L3</h3>
          <ul className="small">
            <li><code>ip routing</code> (global) — fără el, nu rutează.</li>
            <li><code>interface vlan 10</code> + <code>ip address</code> + <code>no shutdown</code>.</li>
            <li>Up/up dacă VLAN-ul există și are cel puțin un port activ (<b>autostate</b>).</li>
            <li><code>no switchport</code> = port routed (L3).</li>
          </ul>
        </div>
        <div className="card"><h3>Depanare — ordinea întrebărilor</h3>
          <ol className="small">
            <li>IP/mască/GW corecte pentru VLAN-ul hostului?</li>
            <li>Port în VLAN-ul corect? VLAN există?</li>
            <li>Trunk permite VLAN-ul? (2.2)</li>
            <li>ROAS: subinterfață + encapsulation + no shutdown?</li>
            <li>SVI: ip routing + up/up?</li>
          </ol>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>Port trunk <b>nu</b> apare în <code>show vlan brief</code>.</li>
            <li><code>no vlan N</code> nu mută porturile în VLAN 1.</li>
            <li>VLAN creat ≠ port atribuit.</li>
            <li>Voice VLAN ≠ al doilea VLAN de date.</li>
            <li>VLAN 1 ≠ VLAN de management ≠ VLAN nativ.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
