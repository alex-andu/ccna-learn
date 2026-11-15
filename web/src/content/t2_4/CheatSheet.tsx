import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 2.4. */
export function CheatSheet24() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Moduri de negociere</h3>
          <Table head={['Mod', 'Proto', 'Formează cu']} rows={[
            ['active', 'LACP', 'active, passive'],
            ['passive', 'LACP', 'active'],
            ['desirable', 'PAgP', 'desirable, auto'],
            ['auto', 'PAgP', 'desirable'],
            ['on', 'static', 'on'],
          ]} />
        </div>
        <div className="card"><h3>Reguli de aur</h3>
          <ul className="small">
            <li>passive+passive ✘ · auto+auto ✘</li>
            <li>LACP ≠ PAgP; <b>on</b> nu vorbește cu niciunul</li>
            <li>LACP: 16 membri, <b>8 active</b>; PAgP: 8</li>
            <li>LACP = IEEE 802.3ad / 802.1AX</li>
            <li>Numărul Po e <b>local</b></li>
          </ul>
        </div>
        <div className="card"><h3>Configurare L2</h3>
          <ul className="small">
            <li><code>interface range g0/1-2</code></li>
            <li><code>channel-group 1 mode active</code></li>
            <li><code>interface port-channel 1</code> → <code>switchport mode trunk</code> …</li>
            <li>Setări pe <b>Po</b>, nu pe membri</li>
          </ul>
        </div>
        <div className="card"><h3>Configurare L3</h3>
          <ul className="small">
            <li><code>no switchport</code> pe membri <b>și</b> pe Po</li>
            <li>IP doar pe <code>port-channel</code></li>
            <li><code>ip routing</code> pe switch multilayer</li>
            <li>Summary: <b>RU</b></li>
          </ul>
        </div>
        <div className="card"><h3>Trebuie să coincidă pe membri</h3>
          <ul className="small">
            <li>viteză + duplex</li>
            <li>mod switchport (access/trunk/rutat)</li>
            <li>VLAN access · native · allowed</li>
            <li>același vecin la celălalt capăt</li>
          </ul>
        </div>
        <div className="card"><h3>show etherchannel summary</h3>
          <ul className="small">
            <li><b>SU</b> L2 în uz · <b>RU</b> L3 în uz · <b>SD</b> down</li>
            <li><b>P</b> bundled · <b>s</b> suspended · <b>I</b> stand-alone · <b>D</b> down · <b>H</b> hot-standby</li>
            <li><code>show lacp neighbor</code> · <code>show pagp neighbor</code></li>
          </ul>
        </div>
        <div className="card"><h3>Load balancing</h3>
          <ul className="small">
            <li><code>port-channel load-balance src-dst-ip</code> (global)</li>
            <li><code>show etherchannel load-balance</code></li>
            <li>Hash pe <b>flux</b>, nu pe pachet</li>
            <li>Un flux = un membru</li>
            <li>Implicit: depinde de platformă</li>
          </ul>
        </div>
        <div className="card"><h3>Capcane de examen</h3>
          <ul className="small">
            <li>Ambele passive / ambele auto: nu merge</li>
            <li>STP vede Po, nu membrii</li>
            <li>on ≠ LACP</li>
            <li>IP pe membri la L3: greșit</li>
            <li>Un flux nu depășește un link</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
