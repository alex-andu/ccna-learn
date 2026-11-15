import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.2. */
export function CheatSheet22() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Trunk — comenzi</h3>
          <ul className="small">
            <li><code>switchport trunk encapsulation dot1q</code> (doar unde există ISL; înainte de mode)</li>
            <li><code>switchport mode trunk</code></li>
            <li><code>switchport nonegotiate</code> (oprește DTP)</li>
            <li><code>switchport trunk native vlan 99</code></li>
            <li><code>switchport trunk allowed vlan 10,20</code> — <b>înlocuiește</b> lista!</li>
            <li><code>… allowed vlan add 30</code> · <code>remove 20</code> · <code>all</code> · <code>except 20</code> · <code>none</code></li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show interfaces trunk</code> — mod, encapsulare, stare, native; 3 liste de VLAN-uri.</li>
            <li><code>show interfaces gi0/1 switchport</code> — Administrative/Operational Mode, native, allowed.</li>
            <li>Trunk-urile <b>nu</b> apar în <code>show vlan brief</code>.</li>
          </ul>
          <Table head={['Listă', 'Înseamnă']} rows={[
            ['allowed on trunk', 'permis de configurație'],
            ['allowed and active', '… și VLAN-ul există pe switch'],
            ['forwarding, not pruned', 'trece acum (STP/pruning)'],
          ]} />
        </div>
        <div className="card"><h3>DTP</h3>
          <Table head={['', 'auto', 'desirable', 'trunk', 'access']} rows={[
            ['auto', 'access', 'trunk', 'trunk', 'access'],
            ['desirable', 'trunk', 'trunk', 'trunk', 'access'],
            ['trunk', 'trunk', 'trunk', 'trunk', 'mismatch'],
            ['access', 'access', 'access', 'mismatch', 'access'],
          ]} />
          <p className="small">Implicit pe Catalyst moderne: <b>dynamic auto</b> (auto+auto = access). Securitate: access explicit pe utilizatori, <code>nonegotiate</code> pe trunk.</p>
        </div>
        <div className="card"><h3>Tag 802.1Q</h3>
          <ul className="small">
            <li><b>4 octeți</b> după Src MAC: TPID <b>0x8100</b> (2) + TCI (2).</li>
            <li>TCI = <b>PCP</b> 3 biți + <b>DEI</b> 1 bit + <b>VID</b> 12 biți.</li>
            <li>VID 1–4094 utilizabile (0 și 4095 rezervate).</li>
            <li>Cadru maxim: <b>1522 B</b> cu tag (1518 fără). FCS se recalculează.</li>
            <li>Port access scoate tag-ul; trunk îl adaugă.</li>
          </ul>
        </div>
        <div className="card"><h3>802.1Q vs ISL</h3>
          <ul className="small">
            <li>802.1Q: standard IEEE, tag de 4 B, nativ fără tag.</li>
            <li>ISL: Cisco proprietar, antet 26 B + FCS 4 B, <b>învechit</b>.</li>
            <li>Pe 2960 doar 802.1Q (fără comanda <code>encapsulation</code>).</li>
          </ul>
        </div>
        <div className="card"><h3>Native VLAN</h3>
          <ul className="small">
            <li>Implicit <b>VLAN 1</b>; cadrele lui pe trunk: <b>fără tag</b>.</li>
            <li>Cadru netaggat primit pe trunk ⇒ atribuit native VLAN-ului.</li>
            <li>Trebuie <b>identic</b> la ambele capete; mismatch ⇒ <code>%CDP-4-NATIVE_VLAN_MISMATCH</code>, scurgere între VLAN-uri.</li>
            <li>Bune practici: VLAN dedicat neutilizat (ex. 999), fără hosturi în el.</li>
            <li>ROAS: <code>encapsulation dot1Q 99 native</code>.</li>
          </ul>
        </div>
        <div className="card"><h3>VLAN hopping</h3>
          <ul className="small">
            <li><b>Switch spoofing</b> (DTP) → <code>mode access</code> + <code>nonegotiate</code>.</li>
            <li><b>Double tagging</b> (atacator în native VLAN) → native neutilizat, nu pune utilizatori în el.</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li><code>allowed vlan 30</code> fără <code>add</code> șterge restul.</li>
            <li>auto + auto = <b>access</b>.</li>
            <li>trunk + access = mismatch.</li>
            <li>VLAN neexistent pe switch nu trece, chiar dacă e permis.</li>
            <li>Tag = 4 B; VID = 12 biți; PCP = 3 biți.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
