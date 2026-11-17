import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.7. */
export function CheatSheet47() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Câmpuri de marcare</h3>
          <Table head={['Câmp', 'Unde', 'Biți', 'Valori']} rows={[
            ['CoS/PCP', '802.1Q (L2)', '3', '0–7 (voce=5)'],
            ['IP Precedence', 'ToS, primii 3 biți', '3', '0–7'],
            ['DSCP', 'ToS, primii 6 biți', '6', '0–63'],
          ]} />
          <p className="small">ToS = DSCP × 4 (+ ECN, 2 biți).</p>
        </div>
        <div className="card"><h3>PHB uzuale</h3>
          <ul className="small">
            <li>EF = <b>46</b> (101110) — voce</li>
            <li>AF41/42/43 = 34/36/38 — video</li>
            <li>AF31 = 26 · AF21 = 18 · AF11 = 10</li>
            <li>CS6 = 48 (control) · DF = 0</li>
            <li>AFxy: <b>8x + 2y</b> · CSx: <b>8x</b></li>
          </ul>
        </div>
        <div className="card"><h3>Cozi și congestie</h3>
          <ul className="small">
            <li>FIFO · CBWFQ (bandă garantată) · <b>LLQ = CBWFQ + coadă prioritară</b> (voce)</li>
            <li>Tail drop → sincronizare globală TCP</li>
            <li>WRED = drop timpuriu, ponderat pe prioritate</li>
            <li>Coada prioritară e limitată (policed)</li>
          </ul>
        </div>
        <div className="card"><h3>Policing vs shaping</h3>
          <Table head={['', 'Policing', 'Shaping']} rows={[
            ['Exces', 'aruncă / re-marchează', 'bufferizează'],
            ['Întârziere', 'nu', 'da'],
            ['Direcție', 'in/out', 'doar out'],
            ['Unde', 'marginea ISP', 'clientul, spre WAN'],
          ]} />
        </div>
        <div className="card"><h3>Voce (repere de proiectare)</h3>
          <ul className="small">
            <li>Delay într-un sens ≈ sub 150 ms · jitter ≈ sub 30 ms · loss ≈ sub 1%</li>
            <li>Sensibilă: delay, jitter, loss</li>
            <li>Trust boundary la telefon / switch de acces</li>
          </ul>
        </div>
        <div className="card"><h3>MQC și capcane</h3>
          <ul className="small">
            <li><code>class-map</code> → <code>policy-map</code> → <code>service-policy in|out</code></li>
            <li><code>show policy-map interface</code></li>
            <li>QoS ajută doar la congestie · per-hop</li>
            <li>CoS dispare la router; DSCP rămâne</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
