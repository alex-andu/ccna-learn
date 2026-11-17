/** Fișă de recapitulare printabilă pentru 4.8. */
export function CheatSheet48() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>SSH vs Telnet</h3>
          <ul className="small">
            <li>SSH: <b>TCP 22</b>, criptat, autentifică serverul</li>
            <li>Telnet: TCP 23, text clar — nu în producție</li>
            <li>Folosește <b>SSHv2</b> (<code>ip ssh version 2</code>)</li>
          </ul>
        </div>
        <div className="card"><h3>Pașii (în ordine)</h3>
          <ol className="small">
            <li><code>hostname R1</code> (≠ Router)</li>
            <li><code>ip domain-name example.local</code></li>
            <li><code>crypto key generate rsa modulus 2048</code></li>
            <li><code>ip ssh version 2</code></li>
            <li><code>username admin privilege 15 secret …</code></li>
            <li><code>line vty 0 15</code> → <code>login local</code> + <code>transport input ssh</code></li>
          </ol>
        </div>
        <div className="card"><h3>Întărire</h3>
          <ul className="small">
            <li><code>access-class 10 in</code> pe VTY (ACL standard)</li>
            <li><code>exec-timeout 5 0</code></li>
            <li><code>ip ssh authentication-retries 3</code></li>
            <li><code>enable secret</code>, <code>username … secret</code></li>
            <li>AAA (TACACS+/RADIUS) pentru centralizare</li>
          </ul>
        </div>
        <div className="card"><h3>Pe switch</h3>
          <ul className="small">
            <li>SVI cu IP (<code>interface vlan 1</code>)</li>
            <li><code>ip default-gateway …</code></li>
            <li>Restul ca pe router</li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show ip ssh</code> — „SSH Enabled - version 2.0”</li>
            <li><code>show ssh</code> · <code>show users</code></li>
            <li><code>show crypto key mypubkey rsa</code></li>
            <li>Client: <code>ssh -l admin &lt;ip&gt;</code> / <code>ssh admin@&lt;ip&gt;</code></li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>Fără hostname ≠ Router / domain-name nu se generează cheile</li>
            <li>Fără chei: „SSH Disabled”</li>
            <li><code>login</code> ≠ <code>login local</code></li>
            <li><code>access-class</code>, nu <code>access-group</code>, pe VTY</li>
            <li>RSA ≥ 768 pentru v2 (uzual 2048)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
