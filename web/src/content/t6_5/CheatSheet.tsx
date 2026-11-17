import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 6.5. */
export function CheatSheet65() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>CRUD ↔ HTTP</h3>
          <Table head={['CRUD', 'Verb', 'Succes', 'Idemp.']} rows={[
            ['Create', 'POST', '201', 'nu'],
            ['Read', 'GET', '200', 'da'],
            ['Update (total)', 'PUT', '200/204', 'da'],
            ['Update (parțial)', 'PATCH', '200/204', 'nu garantat'],
            ['Delete', 'DELETE', '204/200', 'da'],
          ]} />
        </div>
        <div className="card"><h3>Coduri de stare</h3>
          <ul className="small">
            <li><b>2xx</b> succes: 200 · 201 · 204</li>
            <li><b>3xx</b> redirect: 301 · 302</li>
            <li><b>4xx</b> client: 400 · <b>401</b> · <b>403</b> · 404 · 405 · 409 · 415 · 429</li>
            <li><b>5xx</b> server: 500 · 502 · 503</li>
            <li>401 = autentificare · 403 = autorizare</li>
          </ul>
        </div>
        <div className="card"><h3>Constrângeri REST</h3>
          <ul className="small">
            <li>Client-server</li>
            <li><b>Stateless</b> (tokenul la fiecare cerere)</li>
            <li>Cacheable</li>
            <li>Interfață uniformă (resurse + URI + verbe)</li>
            <li>Sistem pe straturi</li>
            <li>Cod la cerere (opțional)</li>
          </ul>
        </div>
        <div className="card"><h3>Autentificare</h3>
          <ul className="small">
            <li><b>Basic</b>: user:parolă în Base64 (nu e criptare)</li>
            <li><b>API key</b>: cheie statică în antet</li>
            <li><b>Bearer token</b>: token temporar în Authorization</li>
            <li><b>OAuth 2.0</b>: acces delegat, scope-uri</li>
            <li>Mereu peste <b>HTTPS</b></li>
          </ul>
        </div>
        <div className="card"><h3>Anatomia cererii</h3>
          <ul className="small">
            <li>Linie: METODĂ /cale HTTP/1.1</li>
            <li>Antete: Host, Authorization, <b>Content-Type</b> (ce trimiți), <b>Accept</b> (ce vrei)</li>
            <li>Linie goală</li>
            <li>Corp (POST/PUT/PATCH)</li>
          </ul>
        </div>
        <div className="card"><h3>Formate de date</h3>
          <Table head={['Format', 'Semn distinctiv']} rows={[
            ['JSON', '{ } și [ ], "chei" în ghilimele duble'],
            ['XML', '<tag>…</tag> (NETCONF)'],
            ['YAML', 'indentare + liniuțe (Ansible)'],
          ]} />
        </div>
      </div>
    </div>
  );
}
