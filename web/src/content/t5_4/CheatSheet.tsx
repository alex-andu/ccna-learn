import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 5.4. */
export function CheatSheet54() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>Politica de parole</h3>
          <ul className="small">
            <li><b>Complexitate</b>: lungime, tipuri de caractere, fără cuvinte uzuale</li>
            <li><b>Management</b>: unicitate, rotire, istoric, blocare, stocare ca hash, resetare, manager de parole</li>
            <li>Modern (NIST): lungime, lista de parole slabe, MFA; rotire doar la compromitere</li>
          </ul>
        </div>
        <div className="card"><h3>Atacuri</h3>
          <ul className="small">
            <li>Brute force · dictionary · spraying · stuffing</li>
            <li>Online (frânat) vs offline (hash furat)</li>
            <li>Salt: oprește rainbow tables</li>
            <li>Hash lent: PBKDF2, scrypt, bcrypt, Argon2</li>
          </ul>
        </div>
        <div className="card"><h3>MFA — factori</h3>
          <Table head={['Factor', 'Exemple']} rows={[
            ['Know', 'parolă, PIN'],
            ['Have', 'telefon, token, FIDO2, card'],
            ['Are', 'amprentă, față, iris'],
          ]} />
          <p className="small">≥ 2 factori de categorii diferite. Parolă + întrebare secretă ≠ MFA.</p>
        </div>
        <div className="card"><h3>Certificate / PKI</h3>
          <ul className="small">
            <li>Leagă identitate ↔ cheie publică, semnat de CA</li>
            <li>X.509: subject, cheie publică, valabilitate, emitent, semnătură</li>
            <li>Validare: lanț, date, nume, revocare (CRL/OCSP)</li>
            <li>Cheia privată nu pleacă niciodată</li>
          </ul>
        </div>
        <div className="card"><h3>Biometrie</h3>
          <ul className="small">
            <li>Trăsătură → șablon → scor → prag</li>
            <li>FAR = intruși acceptați · FRR = utilizatori reali respinși</li>
            <li>CER/EER = punctul de egalitate</li>
            <li>Nu poate fi resetată; confidențialitate</li>
          </ul>
        </div>
        <div className="card"><h3>Pe IOS</h3>
          <ul className="small">
            <li><code>security passwords min-length 12</code></li>
            <li><code>enable secret</code> · <code>username … secret</code></li>
            <li><code>login block-for …</code> · <code>login local</code></li>
            <li>Rotire/MFA → AAA (5.8)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
