import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 6.4. */
export function CheatSheet64() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>AI ⊃ ML ⊃ deep learning</h3>
          <ul className="small">
            <li><b>AI</b>: domeniul larg</li>
            <li><b>ML</b>: învață tipare din date</li>
            <li><b>Deep learning</b>: rețele neuronale mari (ex. LLM)</li>
            <li>Model: antrenare (rar) → inferență (continuu)</li>
          </ul>
        </div>
        <div className="card"><h3>Predictiv vs generativ</h3>
          <Table head={['', 'Predictiv', 'Generativ']} rows={[
            ['Produce', 'predicții, scoruri, alarme', 'text, cod, config, rezumate'],
            ['Intrare', 'date/telemetrie', 'prompt + context'],
            ['Exemplu', 'anomalii, prognoză', 'draft config, rezumat log'],
            ['Risc', 'alarme false/ratate', 'halucinații, scurgeri'],
          ]} />
        </div>
        <div className="card"><h3>Predictiv în rețea</h3>
          <ul className="small">
            <li>Baseline + detectarea anomaliilor</li>
            <li>Prognoză de capacitate</li>
            <li>Clasificare trafic/dispozitive</li>
            <li>Probabilitate de defectare</li>
            <li>Corelare alarme → cauză probabilă</li>
          </ul>
        </div>
        <div className="card"><h3>Generativ în rețea</h3>
          <ul className="small">
            <li>Explică output-uri, rezumă log-uri</li>
            <li>Scripturi, șabloane, drafturi de config</li>
            <li>Asistent de depanare</li>
            <li>Toate = <b>drafturi</b> de verificat</li>
          </ul>
        </div>
        <div className="card"><h3>Riscuri și bune practici</h3>
          <ul className="small">
            <li><b>Halucinații</b>: validare/test în laborator</li>
            <li>Fără secrete în prompturi</li>
            <li>Date de calitate; atenție la model drift</li>
            <li>Om în buclă; change cu rollback</li>
          </ul>
        </div>
        <div className="card"><h3>Pentru examen</h3>
          <ul className="small">
            <li>„prezice/detectează/clasifică” → predictiv</li>
            <li>„scrie/rezumă/generează” → generativ</li>
            <li>Telemetria alimentează modelele</li>
            <li>AIOps = AI/ML pe date operaționale</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
