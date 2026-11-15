import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.4. */
export function CheatSheet14() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Stări (L1 / L2)</h3>
          <Table head={['show interfaces', 'status', 'Cauză']} rows={[
            ['up / up', 'connected', 'OK (dar verifică contoarele)'],
            ['up / down', '—', 'serial: HDLC vs PPP, clock rate, keepalive'],
            ['down / down', 'notconnect', 'cablu, capăt oprit, speed mismatch, fibră'],
            ['admin down / down', 'disabled', 'shutdown → no shutdown'],
            ['down / down (err-disabled)', 'err-disabled', 'port security, BPDU Guard, UDLD… → cauza + shut/no shut'],
          ]} />
        </div>
        <div className="card"><h3>Contoare</h3>
          <ul className="small">
            <li><b>runts</b> &lt; 64 B cu CRC greșit · <b>giants</b> &gt; 1518 B</li>
            <li><b>CRC</b> = FCS greșit · <b>frame</b> = CRC + biți ≠ multiplu de 8</li>
            <li><b>input errors</b> = total (runts, giants, no buffer, CRC, frame, overrun, ignored)</li>
            <li><b>collisions</b>: normale doar pe half · <b>late collision</b> = după 512 biți (64 B)</li>
            <li><b>output drops</b> = coadă plină → congestie (≠ output errors)</li>
            <li><b>ignored / no buffer / overrun</b> = resurse, broadcast storm</li>
            <li><b>interface resets</b> + %LINK-3-UPDOWN repetat = link flap</li>
          </ul>
        </div>
        <div className="card"><h3>Duplex / viteză</h3>
          <Table head={['A', 'B', 'Rezultat']} rows={[
            ['auto', 'auto', 'cea mai bună comună, full'],
            ['100/full fix', 'auto', 'B = 100/half → duplex mismatch'],
            ['100/full', '100/half', 'duplex mismatch'],
            ['100 fix', '1000 fix', 'speed mismatch → down/down'],
          ]} />
          <ul className="small">
            <li>Mismatch: <b>up/up</b>, ping OK, lent. HALF: collisions + late · FULL: CRC + runts.</li>
            <li>Parallel detection: află viteza, presupune half (10/100). Cisco: 1 Gb/s doar full.</li>
            <li>%CDP-4-DUPLEX_MISMATCH doar raportează. Regula: auto–auto sau fix–fix identic.</li>
          </ul>
        </div>
        <div className="card"><h3>Cabluri</h3>
          <ul className="small">
            <li>UTP max <b>100 m</b> (90 fix + 10 patch). Peste → CRC, flap, late collisions.</li>
            <li>CRC fără coliziuni = fizic: cablu, sertizare, EMI, Cat3 la 100BASE-TX, port.</li>
            <li>Cablu greșit fără Auto-MDIX → down/down. Consola = rollover.</li>
            <li>Fibră: TX/RX inversate, SFP diferite, SMF↔MMF, conectori murdari.</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>speed auto|10|100|1000 · duplex auto|half|full</li>
            <li>show ip interface brief</li>
            <li>show interfaces status [err-disabled]</li>
            <li>show interfaces g0/1 | include duplex|CRC|collision</li>
            <li>show interfaces counters errors</li>
            <li>clear counters g0/1</li>
            <li>show cdp neighbors detail · show logging</li>
            <li>errdisable recovery cause X · interval 300</li>
          </ul>
        </div>
        <div className="card"><h3>Ordinea de troubleshooting</h3>
          <ol className="small">
            <li>Starea (brief / status) pe <b>ambele</b> capete</li>
            <li>shutdown? err-disabled? down/down? up/down?</li>
            <li>up/up: duplex + viteză (a-half?)</li>
            <li>Contoare: duplex / fizic / congestie</li>
            <li>clear counters → cresc? → repari → reverifici</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
