import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 6.2. */
export function CheatSheet62() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Tradițional vs controller</h3>
          <Table head={['Aspect', 'Tradițional', 'Controller']} rows={[
            ['Control', 'distribuit, pe fiecare', 'politică/management central'],
            ['Configurare', 'CLI per echipament', 'GUI/API, șabloane, politici'],
            ['Vizibilitate', 'fragmentată (SNMP/show)', 'unitară'],
            ['Consecvență', 'drift frecvent', 'conformitate monitorizată'],
            ['Schimbări', 'lente', 'rapide, centralizate'],
          ]} />
        </div>
        <div className="card"><h3>Ce aduce controller-ul</h3>
          <ul className="small">
            <li>Single pane of glass</li>
            <li>Politici la nivel de intenție</li>
            <li>API-uri northbound (REST)</li>
            <li>Automatizarea ciclului de viață (ZTP)</li>
            <li>Assurance: telemetrie + analiză</li>
          </ul>
        </div>
        <div className="card"><h3>Catalyst Center</h3>
          <ol className="small">
            <li><b>Design</b> — site-uri, resurse comune</li>
            <li><b>Policy</b> — intenție, segmentare</li>
            <li><b>Provision</b> — aplicare, Plug and Play</li>
            <li><b>Assurance</b> — sănătate, analiză</li>
          </ol>
        </div>
        <div className="card"><h3>Intent-based networking</h3>
          <ul className="small">
            <li><b>Translation</b>: intenție → politici</li>
            <li><b>Activation</b>: aplicare automată</li>
            <li><b>Assurance</b>: măsurare continuă, corecție</li>
          </ul>
        </div>
        <div className="card"><h3>Controller indisponibil</h3>
          <ul className="small">
            <li>Forwarding existent: <b>continuă</b></li>
            <li>Pierzi: modificări centrale, vizibilitate, automatizări</li>
            <li>De aceea: controller redundant</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Controller ≠ pe calea traficului utilizatorilor</li>
            <li>Tradițional: control plane distribuit</li>
            <li>CLI rămâne pentru depanare</li>
            <li>Overlay/underlay/API-uri: topic 6.3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
