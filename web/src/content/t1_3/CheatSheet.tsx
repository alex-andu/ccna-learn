import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.3. */
export function CheatSheet13() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Standarde Ethernet</h3>
          <Table head={['Standard', 'IEEE', 'Mediu', 'Max']} rows={[
            ['10BASE-T', '802.3i', 'Cat3, 2 perechi', '100 m'], ['100BASE-TX', '802.3u', 'Cat5, 2 perechi', '100 m'],
            ['1000BASE-T', '802.3ab', 'Cat5e, 4 perechi', '100 m'], ['1000BASE-SX', '802.3z', 'MMF 850 nm', '550 m (OM2)'],
            ['1000BASE-LX', '802.3z', 'SMF 1310 nm', '5 km'], ['10GBASE-SR', '802.3ae', 'MMF 850 nm', '300 m OM3 / 400 m OM4'],
            ['10GBASE-LR / ER', '802.3ae', 'SMF 1310 / 1550', '10 km / 40 km'], ['10GBASE-T', '802.3an', 'Cat6A (Cat6 ≈55 m)', '100 m'],
            ['2.5/5GBASE-T', '802.3bz', 'Cat5e/Cat6', '100 m'], ['25/40GBASE-T', '802.3bq', 'Cat8', '30 m'],
          ]} />
          <p className="small">Coax istoric: 10BASE5 (500 m), 10BASE2 (185 m) — magistrală. 10G+ = doar full-duplex.</p>
        </div>
        <div className="card"><h3>Cupru</h3>
          <ul className="small">
            <li>UTP = 4 perechi răsucite (anulează EMI/crosstalk); STP = ecranat, trebuie împământat.</li>
            <li><b>T568B:</b> albO, O, albV, Al, albAl, V, albM, M · <b>T568A:</b> verde ↔ portocaliu.</li>
            <li>MDI (PC, router, server, AP, FW): TX 1-2, RX 3-6 · MDI-X (switch, hub): invers.</li>
            <li><b>Straight</b> = diferite (PC–SW, R–SW) · <b>Crossover</b> = la fel (SW–SW, PC–PC, R–PC, SW–hub).</li>
            <li>Crossover 10/100: 1↔3, 2↔6 · gigabit: + 4↔7, 5↔8 · <b>Rollover</b>: 1↔8 … (consolă, 9600 8N1).</li>
            <li>Auto-MDIX (<code>mdix auto</code>) → orice cablu merge. 1000BASE-T: 4 perechi bidirecționale, PAM-5.</li>
            <li>Cat5e/6 → 1G · Cat6A → 10G/100 m · Cat8 → 25/40G/30 m. 100 m = 90 fix + 10 patch.</li>
          </ul>
        </div>
        <div className="card"><h3>Fibră</h3>
          <Table head={['', 'MMF', 'SMF']} rows={[
            ['Miez', '50 / 62.5 µm', '≈9 µm'], ['Înveliș', '125 µm', '125 µm'], ['Sursă', 'LED / VCSEL', 'laser'],
            ['λ', '850 (1300) nm', '1310 / 1550 nm'], ['Distanță', 'sute de m', 'km – zeci km'], ['Manta', 'portocaliu / aqua / lime', 'galben'],
          ]} />
          <ul className="small">
            <li>Dispersia modală limitează MMF. OM1 62.5 µm · OM2–OM5 50 µm · OS1/OS2 monomod.</li>
            <li>Conectori: <b>LC</b> (1.25 mm, SFP) · SC (pătrat, push-pull) · ST (baionetă) · MPO (8–24 fibre).</li>
            <li>SFP 1G · SFP+ 10G · SFP28 25G · QSFP+ 40G · QSFP28 100G · DAC = twinax în rack.</li>
            <li>TX → RX; fibre inversate = down/down. BiDi = 1 fibră, 2 λ (1310/1490).</li>
          </ul>
        </div>
        <div className="card"><h3>Conexiuni (1.3.b)</h3>
          <ul className="small">
            <li><b>Shared media</b> (coax, hub): half-duplex, CSMA/CD, 1 domeniu de coliziune.</li>
            <li><b>Point-to-point</b> (port de switch, serial, fibră): full-duplex, fără coliziuni.</li>
            <li>CSMA/CD: ascultă → transmite → detectează → jam → backoff aleatoriu → reîncearcă (max 16).</li>
            <li>Hub: 1 col / 1 bcast · Switch: 1 col per port / 1 bcast · Router: separă ambele.</li>
            <li>Cadru minim 64 B (slot time 512 biți); coliziune după 64 B = late collision (1.4).</li>
            <li>Serial: DCE dă ceasul (<code>clock rate</code>); HDLC implicit Cisco, PPP standard.</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>speed auto|10|100|1000 · duplex auto|full|half</li><li>mdix auto · no mdix auto</li><li>media-type rj45|sfp</li>
            <li>show interfaces status (a- = negociat)</li><li>show interfaces transceiver [detail]</li><li>show inventory</li>
            <li>show controllers serial 0/0/0 (DCE/DTE)</li><li>ethtool eth0 · Get-NetAdapter</li>
          </ul>
        </div>
        <div className="card"><h3>Ce aleg?</h3>
          <ul className="small">
            <li>≤ 100 m, birou → UTP Cat5e/6 (10G: Cat6A).</li>
            <li>100–550 m, clădire → MMF + SX/SR.</li>
            <li>km, între clădiri → SMF + LX/LR (40 km: ER).</li>
            <li>EMI puternic / între clădiri → fibră (izolare electrică).</li>
            <li>În rack, 10G+ → DAC. Consolă → rollover/USB.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
