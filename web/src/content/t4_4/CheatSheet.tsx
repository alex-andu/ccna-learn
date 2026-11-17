import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 4.4. */
export function CheatSheet44() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Arhitectură</h3>
          <ul className="small">
            <li><b>NMS</b> (manager) · <b>agent</b> · <b>MIB</b> · <b>OID</b></li>
            <li>Agent: <b>UDP 161</b> · Traps/Informs: <b>UDP 162</b></li>
            <li>OID Internet: 1.3.6.1 · mib-2: 1.3.6.1.2.1 · Cisco: 1.3.6.1.4.1.9</li>
          </ul>
        </div>
        <div className="card"><h3>Operații</h3>
          <Table head={['Operație', 'Cine', 'Ack?']} rows={[
            ['Get / GetNext', 'manager', 'Response'],
            ['GetBulk (v2c+)', 'manager', 'Response'],
            ['Set', 'manager', 'Response'],
            ['Trap', 'agent', 'NU'],
            ['Inform (v2c+)', 'agent', 'DA'],
          ]} />
        </div>
        <div className="card"><h3>Versiuni</h3>
          <Table head={['', 'Auth', 'Criptare']} rows={[
            ['v1', 'community', 'nu'],
            ['v2c', 'community', 'nu'],
            ['v3 authPriv', 'utilizator + hash', 'DA'],
          ]} />
          <p className="small">Niveluri v3: noAuthNoPriv · authNoPriv · authPriv</p>
        </div>
        <div className="card"><h3>Configurare v2c</h3>
          <ul className="small">
            <li><code>snmp-server community STR ro [ACL]</code></li>
            <li><code>snmp-server host &lt;ip&gt; version 2c STR</code></li>
            <li><code>snmp-server enable traps …</code></li>
            <li><code>snmp-server location / contact</code></li>
          </ul>
        </div>
        <div className="card"><h3>Configurare v3</h3>
          <ul className="small">
            <li><code>snmp-server group G v3 priv</code></li>
            <li><code>snmp-server user U G v3 auth sha P1 priv aes 128 P2</code></li>
            <li><code>snmp-server host &lt;ip&gt; version 3 priv U</code></li>
          </ul>
        </div>
        <div className="card"><h3>Verificare și capcane</h3>
          <ul className="small">
            <li><code>show snmp</code> · <code>show snmp community|host|group|user</code></li>
            <li>„Unknown community name” crește ⇒ community greșit</li>
            <li>Nu folosi public/private; RW doar cu ACL</li>
            <li>Trap = neconfirmat; inform = confirmat</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
