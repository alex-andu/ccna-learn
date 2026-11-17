import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.2. */
export function CheatSheet52() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Cele 3 elemente (5.2)</h3>
          <ul className="small">
            <li><b>User awareness</b> — toți, scurt, continuu</li>
            <li><b>Training</b> — pe roluri, competențe</li>
            <li><b>Physical access control</b> — uși, badge, rack</li>
          </ul>
        </div>
        <div className="card"><h3>Documente</h3>
          <Table head={['Tip', 'Rol']} rows={[
            ['Policy', 'CE și DE CE (obligatoriu)'],
            ['Standard', 'cerințe măsurabile'],
            ['Procedure', 'pași (CUM)'],
            ['Guideline', 'recomandare'],
          ]} />
        </div>
        <div className="card"><h3>Awareness vs training vs education</h3>
          <ul className="small">
            <li>Awareness: CE să recunosc (toți)</li>
            <li>Training: CUM fac (rol)</li>
            <li>Education: DE CE (specialiști)</li>
          </ul>
        </div>
        <div className="card"><h3>Control fizic</h3>
          <ul className="small">
            <li>Badge, PIN, biometrie, mantrap</li>
            <li>Paznic, registru, însoțire vizitatori</li>
            <li>CCTV + jurnale (detective)</li>
            <li>Rack încuiat, console protejat</li>
            <li>Eliminare sigură</li>
          </ul>
        </div>
        <div className="card"><h3>Pe IOS</h3>
          <ul className="small">
            <li><code>line console 0</code> + <code>login</code> + <code>exec-timeout</code></li>
            <li><code>shutdown</code> pe porturi libere</li>
            <li><code>banner login</code> · <code>logging host</code></li>
            <li><code>write erase</code> la casare</li>
            <li><code>no service password-recovery</code> (cu grijă)</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Policy ≠ procedure</li>
            <li>Camerele sunt detective, nu preventive</li>
            <li>Tailgating = social engineering fizic</li>
            <li>Instruirea se repetă</li>
            <li>Accesul fizic ocolește firewall-ul</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
