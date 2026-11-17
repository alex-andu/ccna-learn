import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.3. */
export function CheatSheet53() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Căi de acces</h3>
          <ul className="small">
            <li><code>line console 0</code> — fizic</li>
            <li><code>line vty 0 15</code> — Telnet/SSH</li>
            <li><code>line aux 0</code> — modem</li>
            <li><code>enable secret</code> — privileged EXEC</li>
          </ul>
        </div>
        <div className="card"><h3>Autentificare pe linie</h3>
          <Table head={['Config', 'Cere']} rows={[
            ['password + login', 'parola liniei'],
            ['login local', 'user + parolă locale'],
            ['no login', 'nimic'],
          ]} />
          <p className="small">Consola: fără login implicit. VTY: login implicit, fără parolă = refuz.</p>
        </div>
        <div className="card"><h3>Tipuri de parole</h3>
          <Table head={['Tip', 'Ce este']} rows={[
            ['0', 'clar'], ['5', 'MD5'], ['7', 'Vigenère, reversibil'], ['8', 'PBKDF2-SHA256'], ['9', 'scrypt'],
          ]} />
        </div>
        <div className="card"><h3>Comenzi cheie</h3>
          <ul className="small">
            <li><code>enable secret</code> (bate <code>enable password</code>)</li>
            <li><code>username X privilege 15 secret Y</code></li>
            <li><code>service password-encryption</code> (tip 7)</li>
            <li><code>security passwords min-length 10</code></li>
            <li><code>login block-for 120 attempts 3 within 60</code></li>
            <li><code>exec-timeout 5 0</code></li>
            <li><code>transport input ssh</code></li>
          </ul>
        </div>
        <div className="card"><h3>Verificare</h3>
          <ul className="small">
            <li><code>show running-config</code></li>
            <li><code>show users</code> · <code>show privilege</code></li>
            <li><code>show login</code> · <code>show login failures</code></li>
            <li><code>show line</code></li>
          </ul>
        </div>
        <div className="card"><h3>Capcane</h3>
          <ul className="small">
            <li>password fără login = ignorată (pe consolă)</li>
            <li>secret &gt; password</li>
            <li>tip 7 se decriptează ușor</li>
            <li>login local fără username = blocat</li>
            <li>Securizează <b>toate</b> VTY (0 15)</li>
            <li>min-length nu verifică parolele vechi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
