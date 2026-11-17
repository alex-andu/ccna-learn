import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { AuthMechanisms, EncodingCompare, RestSandbox } from '../../diagrams/t6_5';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="6.5" title="API-uri REST — imaginea de ansamblu" />
      <Summary>
        <p>Un <G id="api" /> este „ghișeul” prin care un program cere servicii altui program. Un <b><G id="rest-api" /></b> face asta peste <G id="http" />/<G id="https" />: clientul trimite o <b>cerere</b> (metodă + adresă + antete + eventual un corp), iar serverul răspunde cu un <b>cod de stare</b> și, de obicei, date <b><G id="json" /></b>. Este limba în care aplicațiile vorbesc cu controller-ele de rețea (northbound, 6.3).</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial este <i>Describe characteristics of REST-based APIs (authentication types, CRUD, HTTP verbs, and data encoding)</i>. Cele patru teme din paranteză sunt scheletul lecției:</p>
        <Table head={['Temă din obiectiv', 'Ce trebuie să știi', 'Secțiunea']} hlCol={0} rows={[
          ['Caracteristici REST', 'Stil arhitectural: client-server, stateless, cacheable, interfață uniformă, resurse și URI-uri', '„Ce este REST”'],
          ['CRUD și verbe HTTP', 'POST/GET/PUT/PATCH/DELETE ↔ Create/Read/Update/Delete; coduri de stare', '„HTTP și CRUD”'],
          ['Tipuri de autentificare', 'Basic, API key, token (Bearer), OAuth 2.0; 401 vs 403', '„Autentificare”'],
          ['Codificarea datelor', 'JSON, XML, YAML; Content-Type/Accept', '„Codificarea datelor”'],
        ]} />
        <Analogy>Un restaurant: <b>meniul</b> este API-ul (ce poți cere, cum), <b>chelnerul</b> este HTTP (duce cererea și aduce răspunsul), <b>comanda</b> este cererea (ce vrei: „adu” = GET, „pregătește” = POST, „schimbă” = PUT/PATCH, „anulează” = DELETE), iar <b>nota/cuvintele chelnerului</b> sunt codul de stare („gata”, „nu avem”, „nu aveți voie în sala asta”). Chelnerul nu ține minte comanda ta de ieri: la fiecare vizită spui tot ce e necesar — asta este <i>stateless</i>.</Analogy>
        <Callout kind="info" title="Legătura cu restul domeniului 6">
          6.1–6.3 au arătat <i>de ce</i> și <i>unde</i> sunt API-urile (northbound/southbound). Aici înveți <i>cum arată</i> o cerere REST. 6.6 (Ansible, Terraform) și 6.7 (JSON) folosesc exact aceste noțiuni.
        </Callout>
      </Detailed>
      <Traps items={[
        <>REST este un <b>stil arhitectural</b>, nu un protocol sau un standard rigid; se bazează de obicei pe HTTP(S).</>,
        <>REST nu înseamnă „doar JSON”: poate folosi JSON, XML sau alte formate.</>,
        <>Un cod 200 nu garantează că efectul dorit s-a produs la nivel de rețea; verifică starea.</>,
      ]} />
      <InlineQuiz ids={['6.5-001', '6.5-002', '6.5-003']} />
    </section>
  );
}

/* ======================================================================
   1. Ce este REST
   ====================================================================== */
export function RestSection() {
  return (
    <section id="rest" className="section">
      <SectionHead id="rest" code="6.5" title="Ce este REST: resurse, URI-uri și constrângeri" />
      <Summary>
        <p>REST (Representational State Transfer) descrie cum arată un API „bine făcut” peste web: lumea este împărțită în <b>resurse</b> (interfețe, VLAN-uri, echipamente), fiecare cu un <b><G id="api-endpoint" /></b> (URI) propriu; clientul manipulează <b>reprezentări</b> ale lor (de obicei JSON) prin câteva verbe standard. Serverul <b>nu ține starea</b> sesiunii între cereri (<G id="stateless" />).</p>
      </Summary>
      <Detailed title="1. Resursele și URI-urile">
        <p>O <b>resursă</b> este orice „lucru” pe care îl poți numi: o interfață, un echipament, o politică. Ea are un identificator, un <b>URI</b>. Cu cât este mai consecvent numele, cu atât API-ul e mai ușor de folosit:</p>
        <Table head={['URI', 'Ce reprezintă']} hlCol={0} rows={[
          [<code>/api/v1/interfaces</code>, 'colecția tuturor interfețelor'],
          [<code>/api/v1/interfaces/2</code>, 'interfața cu id 2'],
          [<code>/api/v1/interfaces?enabled=true</code>, 'colecția filtrată: parametrul după ? este un „query string”'],
          [<code>/api/v1/devices/SW1/interfaces</code>, 'interfețele echipamentului SW1 (resursă imbricată)'],
        ]} />
        <p>Un URL complet are părți: <code>https://controller.lab:443/api/v1/interfaces/2?fields=name,ip</code> → <b>schemă</b> (https), <b>gazdă</b> (controller.lab), <b>port</b> (443, implicit pentru HTTPS), <b>cale</b> (/api/v1/interfaces/2), <b>query string</b> (?fields=…). <code>v1</code> este versiunea API-ului: la schimbări incompatibile apare <code>v2</code>, fără să strice clienții vechi.</p>
        <Callout kind="tip" title="Substantive, nu verbe, în URI">
          Acțiunea o dă <b>metoda HTTP</b>, nu calea: <code>DELETE /interfaces/2</code>, nu <code>/deleteInterface?id=2</code>. Calea numește <i>ce</i>, metoda spune <i>ce faci cu el</i>.
        </Callout>
      </Detailed>
      <Detailed title="2. Cele șase constrângeri REST">
        <Table head={['Constrângere', 'Ce înseamnă', 'Beneficiu']} hlCol={0} rows={[
          ['Client-server', 'Clientul și serverul sunt separate și evoluează independent; comunică doar prin API', 'Scalare, portabilitate'],
          ['Stateless', 'Fiecare cerere conține tot ce îi trebuie serverului (inclusiv autentificarea); serverul nu păstrează sesiune între cereri', 'Servere simple, ușor de replicat; orice server poate răspunde'],
          ['Cacheable', 'Răspunsurile marchează dacă pot fi reținute (cache)', 'Performanță'],
          ['Interfață uniformă', 'Resurse identificate prin URI, manipulate prin reprezentări, cu metode standard', 'Simplitate, previzibilitate'],
          ['Sistem pe straturi', 'Între client și server pot exista intermediari (proxy, load balancer) invizibili pentru client', 'Securitate, scalare'],
          ['Cod la cerere (opțional)', 'Serverul poate trimite cod executabil clientului', 'Flexibilitate (rar folosit)'],
        ]} />
        <p><b>Stateless</b> merită repetat: serverul nu „își amintește” cine ești din cererea anterioară. De aceea tokenul (sau credențialele) se trimite <b>la fiecare cerere</b>. Un server stateless poate fi multiplicat în spatele unui load balancer fără probleme.</p>
      </Detailed>
      <Detailed title="3. REST în lumea rețelelor Cisco">
        <ul>
          <li><b>Controller-e (northbound)</b>: Catalyst Center, controller-e SD-WAN, Meraki Dashboard își expun funcțiile ca API REST.</li>
          <li><b>RESTCONF (6.3)</b>: acces în stil REST la datele modelate cu YANG ale unui echipament.</li>
          <li><b>Unelte</b>: <G id="curl" />, Postman, Python (biblioteca <code>requests</code>) și instrumente de automatizare (Ansible) apelează aceste API-uri.</li>
        </ul>
      </Detailed>
      <DeepDive title="REST, RESTful, HATEOAS">
        <p>Un API „RESTful” respectă constrângerile REST. În formularea completă a lui Fielding, REST include și <b>HATEOAS</b>: răspunsurile conțin legături către acțiunile posibile, ca un site web, iar clientul le descoperă dinamic. În practică, multe API-uri numite „REST” sunt de fapt „HTTP + JSON cu resurse și verbe”, fără HATEOAS. Pentru CCNA e suficient să știi constrângerile principale și faptul că REST este un <i>stil</i>.</p>
      </DeepDive>
      <Traps items={[
        <>REST este <b>stateless</b>: serverul nu ține sesiunea; clientul retrimite credențialele/tokenul la fiecare cerere.</>,
        <>În URI folosești <b>substantive</b> (resurse); verbul este metoda HTTP.</>,
        <>REST nu este un protocol: HTTP este protocolul de transport.</>,
      ]} />
      <InlineQuiz ids={['6.5-004', '6.5-005', '6.5-006', '6.5-007', '6.5-008']} />
    </section>
  );
}

/* ======================================================================
   2. HTTP și CRUD
   ====================================================================== */
export function HttpSection() {
  return (
    <section id="http" className="section">
      <SectionHead id="http" code="6.5" title="HTTP și CRUD: verbe, anatomia cererii, coduri de stare" />
      <Summary>
        <p>CRUD (<b>C</b>reate, <b>R</b>ead, <b>U</b>pdate, <b>D</b>elete) sunt cele patru operații de bază asupra datelor. Într-un API REST ele se leagă de metodele HTTP: <b>POST</b> = creează, <b>GET</b> = citește, <b>PUT/PATCH</b> = actualizează, <b>DELETE</b> = șterge. Serverul răspunde cu un <b><G id="http-status-code" /></b> care spune dacă a mers (2xx), dacă ai greșit tu (4xx) sau el (5xx).</p>
      </Summary>
      <Detailed title="1. Metode (verbe) HTTP și CRUD">
        <Table head={['Operație CRUD', 'Metodă HTTP', 'Exemplu', 'Sigură?', 'Idempotentă?']} hlCol={1} rows={[
          ['Create', <b>POST</b>, 'POST /interfaces (cu corp) → resursă nouă', 'nu', 'nu'],
          ['Read', <b>GET</b>, 'GET /interfaces/2', 'da', 'da'],
          ['Update (înlocuire)', <b>PUT</b>, 'PUT /interfaces/2 (reprezentarea completă)', 'nu', 'da'],
          ['Update (parțial)', <b>PATCH</b>, 'PATCH /interfaces/2 (doar câmpurile schimbate)', 'nu', 'nu garantat'],
          ['Delete', <b>DELETE</b>, 'DELETE /interfaces/2', 'nu', 'da'],
        ]} />
        <ul>
          <li><b>Sigură (safe)</b>: nu modifică starea serverului (GET).</li>
          <li><b><G id="idempotent" /></b>: repetată de mai multe ori, lasă serverul în aceeași stare ca o singură execuție. <i>GET, PUT, DELETE</i> sunt idempotente; <i>POST nu</i>: două POST-uri pot crea două resurse. La PATCH depinde de implementare.</li>
          <li><b>PUT vs PATCH</b>: PUT <b>înlocuiește</b> întreaga resursă (câmpurile omise se pierd sau revin la valori implicite); PATCH <b>modifică parțial</b>.</li>
        </ul>
        <p>Alte metode întâlnite: <code>HEAD</code> (ca GET, dar fără corp), <code>OPTIONS</code> (ce metode sunt permise).</p>
      </Detailed>
      <Detailed title="2. Anatomia unei cereri și a unui răspuns">
        <CodeBlock title="Cerere HTTP (POST) și răspunsul serverului — ilustrativ" kind="session" code={`POST /api/v1/interfaces HTTP/1.1
Host: api.lab
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json
Accept: application/json

{ "name": "Loopback0", "ip": "1.1.1.1", "enabled": true }

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/interfaces/3

{ "id": 3, "name": "Loopback0", "ip": "1.1.1.1", "enabled": true }`} explain={[
          ['POST /api/v1/interfaces HTTP/1.1', 'Linia de cerere: metoda, calea (URI) și versiunea HTTP.'],
          ['Host:', 'Serverul căruia îi este adresată cererea (necesar în HTTP/1.1).'],
          ['Authorization: Bearer …', 'Antet de autentificare: tokenul clientului.'],
          ['Content-Type: application/json', 'Formatul CORPULUI TRIMIS de client.'],
          ['Accept: application/json', 'Formatul în care clientul DOREȘTE răspunsul.'],
          ['{ … } (după linia goală)', 'Corpul (payload): datele resursei de creat.'],
          ['HTTP/1.1 201 Created', 'Linia de stare a răspunsului: versiune, cod și text.'],
          ['Location: …/3', 'Unde se află resursa nou creată.'],
        ]} />
        <p>Structura este mereu aceeași: <b>linie de început</b> → <b>antete</b> → <b>linie goală</b> → <b>corp</b> (opțional). La cerere linia de început conține metoda și URI-ul; la răspuns, codul de stare.</p>
      </Detailed>
      <Detailed title="3. Coduri de stare HTTP">
        <Table head={['Clasa', 'Sens', 'Coduri de reținut']} hlCol={0} rows={[
          ['1xx', 'Informațional', '—'],
          ['2xx', 'Succes', '200 OK · 201 Created (POST) · 204 No Content (DELETE/fără corp)'],
          ['3xx', 'Redirecționare', '301 Moved Permanently · 302 Found'],
          ['4xx', 'Eroare a clientului', '400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 405 Method Not Allowed · 409 Conflict · 415 Unsupported Media Type · 429 Too Many Requests'],
          ['5xx', 'Eroare a serverului', '500 Internal Server Error · 502 Bad Gateway · 503 Service Unavailable'],
        ]} />
        <Callout kind="exam" title="401 vs 403 — capcana clasică">
          <b>401</b> = <i>nu știu cine ești</i> (autentificare lipsă/invalidă, deși numele spune „Unauthorized”). <b>403</b> = <i>știu cine ești, dar nu ai voie</i> (autorizare). 404 = resursa nu există; 405 = resursa există, dar nu cu această metodă.
        </Callout>
      </Detailed>
      <Detailed title="4. Încearcă singur — un API simulat">
        <p>Mai jos există un mic server REST simulat pentru interfețe. Folosește butoanele-exemplu și apoi modifică metoda, URI-ul, tokenul sau corpul. Observă cum se schimbă codul de stare și cum se modifică starea serverului după POST, PUT, PATCH și DELETE.</p>
        <Figure caption="Interactiv: un API REST simulat — CRUD, autentificare și coduri de eroare.">
          <RestSandbox />
        </Figure>
      </Detailed>
      <Traps items={[
        <><b>POST</b> creează și <b>nu este idempotent</b>; <b>PUT</b> înlocuiește (idempotent); <b>PATCH</b> modifică parțial.</>,
        <><b>401</b> = autentificare; <b>403</b> = autorizare; <b>404</b> = nu există; <b>405</b> = metodă nepermisă.</>,
        <>Un POST reușit întoarce de obicei <b>201</b> (nu 200); un DELETE reușit, de obicei <b>204</b>.</>,
        <><b>Content-Type</b> = formatul corpului trimis; <b>Accept</b> = formatul dorit în răspuns.</>,
      ]} />
      <InlineQuiz ids={['6.5-009', '6.5-010', '6.5-011', '6.5-012', '6.5-013', '6.5-014', '6.5-015']} />
    </section>
  );
}

/* ======================================================================
   3. Autentificare
   ====================================================================== */
export function AuthSection() {
  return (
    <section id="auth" className="section">
      <SectionHead id="auth" code="6.5" title="Autentificare în API-urile REST" />
      <Summary>
        <p>Pentru că API-urile REST sunt <b>stateless</b>, fiecare cerere trebuie să dovedească cine o trimite. Metodele uzuale: <b><G id="basic-auth" /></b> (utilizator:parolă), <b><G id="api-key" /></b> (cheie statică), <b><G id="bearer-token" /></b> (token temporar) și <b><G id="oauth2" /></b> (autorizare delegată). Toate trebuie folosite peste <b>HTTPS</b>.</p>
      </Summary>
      <Detailed title="1. Cele patru mecanisme — interactiv">
        <Figure caption="Interactiv: alege mecanismul și vezi antetul, cum funcționează, avantajele și dezavantajele.">
          <AuthMechanisms />
        </Figure>
      </Detailed>
      <Detailed title="2. Tipare folosite în practică">
        <ol>
          <li><b>Token din Basic</b>: faci o singură cerere cu Basic (utilizator:parolă) către un endpoint de autentificare și primești un token; apoi folosești tokenul în toate cererile următoare. Așa funcționează multe controller-e (de exemplu un POST către un endpoint de tip <code>…/auth/token</code> întoarce un token, trimis apoi într-un antet precum <code>X-Auth-Token</code>).</li>
          <li><b>API key pentru automatizări</b>: servicii cloud precum Meraki folosesc o cheie generată în dashboard, trimisă într-un antet.</li>
          <li><b>OAuth 2.0 pentru acces delegat</b>: aplicații terțe obțin un access token cu permisiuni limitate, fără să vadă parola utilizatorului.</li>
        </ol>
        <Callout kind="info" title="Detaliile exacte diferă de la produs la produs">
          Numele antetelor și căile de autentificare depind de produs și versiune. Pentru examen contează <b>tipurile</b> de autentificare și principiul lor, nu antetele exacte.
        </Callout>
      </Detailed>
      <Detailed title="3. Autentificare vs autorizare — în API">
        <Table head={['Concept', 'Întrebarea', 'Cod HTTP tipic la eșec']} hlCol={0} rows={[
          ['Autentificare', 'Cine ești? (credențiale/token valide?)', '401 Unauthorized'],
          ['Autorizare', 'Ai voie să faci asta? (rol, scope)', '403 Forbidden'],
        ]} />
        <p>Aceeași idee ca <G id="authentication" />/<G id="authorization" /> din 5.8, aplicată la API-uri: un token <i>read-only</i> poate citi (GET), dar primește 403 la DELETE.</p>
      </Detailed>
      <Detailed title="4. Bune practici de securitate">
        <ul>
          <li><b>Doar HTTPS</b>: Basic și tokenurile circulă în antete; fără criptare pot fi interceptate.</li>
          <li><b>Tokenuri cu durată scurtă</b> și drepturi minime (principiul privilegiului minim).</li>
          <li><b>Nu pune secrete în URL</b> (apar în log-uri, istoric, proxy-uri); folosește antete.</li>
          <li><b>Nu salva credențiale în cod sau în Git</b> (6.1): variabile de mediu sau seif de secrete.</li>
          <li><b>Revocare și rotire</b>: ai un plan pentru chei/tokenuri compromise.</li>
          <li><b>Rate limiting</b>: serverul poate răspunde 429 Too Many Requests dacă trimiți prea multe cereri.</li>
        </ul>
      </Detailed>
      <Traps items={[
        <>Base64 din Basic nu este criptare: oricine vede antetul vede parola.</>,
        <>401 = problemă de autentificare; 403 = problemă de autorizare.</>,
        <>Un token „Bearer” funcționează pentru oricine îl deține: protejează-l.</>,
      ]} />
      <InlineQuiz ids={['6.5-016', '6.5-017', '6.5-018', '6.5-019', '6.5-020', '6.5-021']} />
    </section>
  );
}

/* ======================================================================
   4. Codificarea datelor
   ====================================================================== */
export function EncodingSection() {
  return (
    <section id="encoding" className="section">
      <SectionHead id="encoding" code="6.5" title="Codificarea datelor: JSON, XML, YAML" />
      <Summary>
        <p>Datele dintr-o cerere sau dintr-un răspuns (<G id="payload" />) trebuie scrise într-un format pe care ambele părți îl înțeleg. Cele trei formate de reținut: <b><G id="json" /></b> (cel mai des în API-uri REST), <b><G id="xml" /></b> (etichete; NETCONF) și <b><G id="yaml" /></b> (indentare; fișiere Ansible). Antetele <b>Content-Type</b> și <b>Accept</b> spun ce format se folosește.</p>
      </Summary>
      <Detailed title="1. Aceleași date, trei formate — interactiv">
        <Figure caption="Interactiv: aceeași interfață, codificată JSON, XML și YAML.">
          <EncodingCompare />
        </Figure>
        <Table head={['Format', 'Cum marchează structura', 'Folosit tipic în', 'Observații']} hlCol={0} rows={[
          ['JSON', 'Acolade { } (obiect), paranteze drepte [ ] (listă), perechi „cheie”: valoare', 'API-uri REST, RESTCONF', 'Compact; cheile în ghilimele duble; fără comentarii și fără virgulă la final (6.7)'],
          ['XML', 'Etichete <tag>…</tag>', 'NETCONF, API-uri mai vechi', 'Mai voluminos; are atribute și spații de nume'],
          ['YAML', 'Indentare și liniuțe pentru liste', 'Playbook-uri Ansible, fișiere de configurare', 'Lizibil pentru oameni; sensibil la indentare (spații, nu taburi)'],
        ]} />
      </Detailed>
      <Detailed title="2. Content-Type și Accept">
        <ul>
          <li><b>Content-Type</b>: formatul corpului <i>pe care îl trimiți</i>. Dacă trimiți JSON fără <code>Content-Type: application/json</code>, serverul poate răspunde <b>415 Unsupported Media Type</b> sau poate interpreta greșit corpul.</li>
          <li><b>Accept</b>: formatul în care <i>vrei să primești</i> răspunsul (<code>Accept: application/json</code>). Serverul alege dintre formatele pe care le poate produce.</li>
          <li>Valorile sunt tipuri MIME: <code>application/json</code>, <code>application/xml</code>, <code>text/html</code>…</li>
        </ul>
      </Detailed>
      <Detailed title="3. De ce JSON domină">
        <p>JSON este <b>mai compact</b> decât XML, se mapează direct pe structurile limbajelor de programare (dicționare și liste) și este ușor de citit. De aceea majoritatea API-urilor REST îl folosesc implicit. Detaliile de sintaxă (tipuri de valori, reguli, cum citești un exemplu) sunt la <b>6.7</b>.</p>
        <Callout kind="tip" title="Cum recunoști formatul la examen">
          Acolade și ghilimele duble → JSON. Etichete între {'<'} și {'>'} → XML. Indentare cu liniuțe și „cheie: valoare” fără ghilimele → YAML.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Content-Type = ce <b>trimiți</b>; Accept = ce <b>vrei</b> să primești.</>,
        <>JSON cere ghilimele duble; XML cere etichete închise; YAML folosește indentare cu spații.</>,
        <>RESTCONF folosește JSON sau XML; NETCONF folosește XML.</>,
      ]} />
      <InlineQuiz ids={['6.5-022', '6.5-023', '6.5-024', '6.5-025', '6.5-026']} />
    </section>
  );
}
