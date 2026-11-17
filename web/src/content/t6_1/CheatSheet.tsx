import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 6.1. */
export function CheatSheet61() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>De ce automatizare</h3>
          <ul className="small">
            <li>Scară: timp ∝ nr. echipamente</li>
            <li>Greșeli umane (copy-paste, omisiuni)</li>
            <li>Inconsistență și <b>drift</b></li>
            <li>Securitate/conformitate: aplici repede, demonstrabil</li>
          </ul>
        </div>
        <div className="card"><h3>Cele trei planuri</h3>
          <Table head={['Plan', 'Rol / exemple']} rows={[
            ['Management', <>SSH, SNMP, syslog, NTP, NETCONF, REST — <b>ușa automatizării</b></>],
            ['Control', 'OSPF, STP, ARP, CDP'],
            ['Data', 'forwarding, ACL, NAT, QoS'],
          ]} />
        </div>
        <div className="card"><h3>Fluxul automatizat</h3>
          <ol className="small">
            <li>Intent / sursa de adevăr (inventar, variabile)</li>
            <li>Șablon + variabile → configurație</li>
            <li>Validare înainte (diff, lint)</li>
            <li>Aplicare (lot-pilot → restul)</li>
            <li>Verificare după (telemetrie/show)</li>
            <li>Remediere / rollback</li>
          </ol>
        </div>
        <div className="card"><h3>Beneficii vs riscuri</h3>
          <Table head={['Beneficii', 'Riscuri']} rows={[
            ['Viteză', 'Greșeala se propagă repede (blast radius)'],
            ['Consecvență', 'Abilități noi (Git, API, YAML/JSON)'],
            ['Conformitate / audit', 'Sursă de adevăr greșită amplificată'],
            ['Vizibilitate', 'Credențiale/tokenuri de protejat'],
          ]} />
        </div>
        <div className="card"><h3>Termeni cheie</h3>
          <ul className="small">
            <li><b>Idempotent</b>: rulat de n ori = același rezultat</li>
            <li><b>Drift</b>: realitatea se îndepărtează de intenție</li>
            <li><b>IaC</b>: configurația ca fișiere versionate</li>
            <li><b>ZTP</b>: echipament nou se autoconfigurează</li>
            <li><b>Telemetrie</b>: date trimise continuu de echipamente</li>
          </ul>
        </div>
        <div className="card"><h3>Pentru examen</h3>
          <ul className="small">
            <li>Automatizarea intră prin management plane</li>
            <li>Nu înlocuiește protocoalele de control plane</li>
            <li>Nu elimină nevoia de ingineri: schimbă rolul</li>
            <li>Test înainte, verificare după, rollback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
