import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.8. */
export function CheatSheet58() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Cele trei A</h3>
          <Table head={['Funcție', 'Întrebare']} rows={[
            ['Authentication', 'Cine ești?'],
            ['Authorization', 'Ce ai voie?'],
            ['Accounting', 'Ce ai făcut?'],
          ]} />
          <p className="small">Ordine: AuthN → AuthZ → Acct.</p>
        </div>
        <div className="card"><h3>RADIUS vs TACACS+</h3>
          <Table head={['', 'RADIUS', 'TACACS+']} rows={[
            ['Transport', 'UDP 1812/1813', 'TCP 49'],
            ['Criptare', 'doar parola', 'tot corpul'],
            ['AAA', 'AuthN+AuthZ combinate', 'complet separate'],
            ['Standard', 'IETF', 'Cisco (RFC 8907)'],
            ['Folosit pentru', 'acces la rețea', 'administrare'],
          ]} />
        </div>
        <div className="card"><h3>Local vs server</h3>
          <ul className="small">
            <li>Local: <code>username … secret …</code>, nescalabil</li>
            <li>Server: administrare centrală, jurnale, MFA</li>
            <li>Rezervă locală: obligatorie</li>
          </ul>
        </div>
        <div className="card"><h3>Liste de metode</h3>
          <ul className="small">
            <li><code>aaa new-model</code> mai întâi</li>
            <li><code>aaa authentication login default group tacacs+ local</code></li>
            <li>Următoarea metodă: doar la <b>ERROR</b> (server mut), nu la <b>FAIL</b> (refuz)</li>
            <li>Consola pe listă separată (local)</li>
            <li>Fără local + server căzut = lockout</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi</h3>
          <ul className="small">
            <li><code>tacacs server NUME</code> / <code>radius server NUME</code> + <code>address</code> + <code>key</code></li>
            <li><code>aaa authorization exec default group tacacs+ local</code></li>
            <li><code>aaa accounting exec default start-stop group tacacs+</code></li>
            <li><code>show aaa servers</code> · <code>test aaa group …</code></li>
          </ul>
        </div>
        <div className="card"><h3>802.1X</h3>
          <ul className="small">
            <li>Supplicant · Authenticator · Authentication server</li>
            <li>EAPOL client↔authenticator; RADIUS authenticator↔server</li>
            <li>Port neautorizat: doar EAPOL</li>
            <li>Wi-Fi Enterprise = același model</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
