import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.5. */
export function CheatSheet25() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Alegeri</h3>
          <ul className="small">
            <li><b>Root bridge</b>: cel mai mic BID = prioritate + MAC</li>
            <li>Prioritate: multipli de <b>4096</b>; implicit 32768 + VLAN</li>
            <li><b>Root port</b> (1 / switch non-root): cost mic → BID mic → port prio → port nr</li>
            <li><b>Designated</b>: 1 / segment; toate porturile root-ului</li>
            <li><b>Alternate</b>: rezervă spre root</li>
          </ul>
        </div>
        <div className="card"><h3>Cost „short”</h3>
          <Table head={['Viteză', 'Cost']} rows={[['10 Mbps', '100'], ['100 Mbps', '19'], ['1 Gbps', '4'], ['10 Gbps', '2']]} />
        </div>
        <div className="card"><h3>Roluri · stări (RSTP)</h3>
          <ul className="small">
            <li>Roluri: Root, Designated, Alternate, Backup, Disabled</li>
            <li>Stări: Discarding, Learning, Forwarding</li>
            <li>Root/Desg = Forwarding · Altn/Backup = Discarding</li>
            <li>STP: Blocking(20s) → Listening(15) → Learning(15) → Forwarding</li>
            <li>RSTP ≈ 1–2 s (proposal/agreement)</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi de bază</h3>
          <ul className="small">
            <li><code>spanning-tree mode rapid-pvst</code></li>
            <li><code>spanning-tree vlan 10 root primary|secondary</code></li>
            <li><code>spanning-tree vlan 10 priority 4096</code></li>
            <li><code>show spanning-tree [vlan 10]</code> · <code>… summary</code> · <code>… root</code></li>
            <li><code>show spanning-tree inconsistentports</code></li>
          </ul>
        </div>
        <div className="card"><h3>Timere</h3>
          <ul className="small">
            <li>Hello <b>2 s</b> · Forward delay <b>15 s</b> · Max age <b>20 s</b></li>
            <li>BPDU: <code>0180.C200.0000</code></li>
            <li>RSTP: vecin pierdut după 3 hello (~6 s)</li>
          </ul>
        </div>
        <div className="card"><h3>PortFast</h3>
          <ul className="small">
            <li><code>spanning-tree portfast</code> (interfață)</li>
            <li><code>spanning-tree portfast default</code> (global, doar access)</li>
            <li>Edge port: spre <b>hosturi</b> doar</li>
            <li>Nu oprește STP; BPDU ⇒ pierde edge</li>
          </ul>
        </div>
        <div className="card"><h3>Protecții</h3>
          <Table head={['Mecanism', 'Efect']} rows={[
            ['BPDU Guard', 'BPDU pe edge ⇒ err-disabled'],
            ['BPDU Filter', 'nu trimite/primește BPDU (risc)'],
            ['Root Guard', 'BPDU superior ⇒ root-inconsistent'],
            ['Loop Guard', 'lipsă BPDU ⇒ loop-inconsistent'],
          ]} />
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>Prioritatea cea mai MICĂ câștigă</li>
            <li>VLAN 10 ⇒ 32778 (nu 32768)</li>
            <li>Alternate ≠ Backup</li>
            <li>BPDU Guard ⇒ err-disabled, manual</li>
            <li>Rapid PVST+ = RSTP per VLAN</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
