import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology65, LabSoloTopology65 } from '../../diagrams/t6_5';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't65g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 6.5-G" title="Lab ghidat — CRUD pe un API REST, coduri de stare și autentificare" />
      <Summary>
        <p><b>Obiectiv:</b> trimiți cereri reale GET, POST, PUT, PATCH și DELETE către un <G id="rest-api" /> public de test, citești codurile de stare și antetele, apoi testezi mecanisme de autentificare (Basic, Bearer) pe un serviciu de test care întoarce 200 sau 401. Completezi un tabel CRUD ↔ verb ↔ cod. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> curl (Windows 10/11, Linux, macOS) sau Postman; opțional Python 3 cu biblioteca requests · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: calculatorul tău trimite cereri HTTPS către un API public de test.">
        <LabGuidedTopology65 />
      </Figure>
      <Callout kind="info" title="Limite, mediu și avertisment">
        Laboratorul folosește servicii publice de test (de exemplu <code>jsonplaceholder.typicode.com</code> și <code>httpbin.org</code>) care pot fi indisponibile sau își pot schimba comportamentul; dacă nu ai acces, folosește API-ul simulat din secțiunea „HTTP și CRUD” a acestui topic. Nu este nevoie de Packet Tracer (Packet Tracer 8.x are un dispozitiv „Network Controller” cu API REST, dar nu este necesar aici). <b>Folosește doar valori fictive</b>: nu trimite parole sau date reale către servicii publice. Pașii sunt ilustrativi și nu au fost testați de autorul lecției.
      </Callout>

      <Detailed title="Partea 1 — Citire (GET)">
        <Step labKey={L} n={1} title="Prima cerere">
          <p>Rulează <code>curl -i https://jsonplaceholder.typicode.com/posts/1</code>. Identifică: metoda, URI-ul, codul de stare, antetul <code>content-type</code> și formatul corpului.</p>
          <Reveal label="Răspuns"><p>Metoda GET (implicită), URI-ul <code>/posts/1</code>, cod 200 OK, <code>content-type: application/json</code>, corp JSON cu câmpurile userId, id, title, body.</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Resursă inexistentă">
          <p>Cere <code>/posts/99999</code> și afișează doar codul: <code>{`curl -s -o /dev/null -w "%{http_code}" https://jsonplaceholder.typicode.com/posts/99999`}</code>. Ce cod primești? Ce înseamnă?</p>
          <Reveal label="Răspuns"><p>404 Not Found: resursa nu există. Este o eroare a clientului (4xx), nu a serverului.</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Colecție filtrată">
          <p>Cere <code>https://jsonplaceholder.typicode.com/posts?userId=1</code>. Ce rol are partea de după <code>?</code>? Câte elemente primești (aproximativ)?</p>
          <Reveal label="Răspuns"><p>Este un query string care filtrează colecția. Răspunsul este o listă JSON (între paranteze drepte) cu postările utilizatorului 1.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Create, Update, Delete">
        <Step labKey={L} n={4} title="POST — Create">
          <p>Trimite: <code>{`curl -i -X POST https://jsonplaceholder.typicode.com/posts -H "Content-Type: application/json" -d '{"title":"test","body":"salut","userId":1}'`}</code> (în PowerShell folosește ghilimele adaptate sau Postman). Ce cod primești și ce câmp nou apare?</p>
          <Reveal label="Răspuns"><p>201 Created și un câmp <code>id</code> atribuit de server (de exemplu 101). Serviciul nu salvează cu adevărat: este un API de test.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="PUT vs PATCH">
          <p>Trimite un PUT pe <code>/posts/1</code> cu toate câmpurile, apoi un PATCH cu doar <code>{'{"title":"doar titlul"}'}</code>. Ce deosebire vezi în răspunsuri?</p>
          <Reveal label="Răspuns"><p>PUT: resursa returnată conține exact ce ai trimis (înlocuire completă). PATCH: doar titlul se schimbă; celelalte câmpuri rămân cele originale.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="DELETE">
          <p>Trimite <code>-X DELETE</code> pe <code>/posts/1</code>. Ce cod primești? Ce cod ar întoarce un API real la o ștergere reușită?</p>
          <Reveal label="Răspuns"><p>Serviciul de test întoarce 200 cu un corp gol; multe API-uri reale întorc 204 No Content.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Tabel de completat">
          <Table head={['Operație CRUD', 'Metodă HTTP', 'Cod de succes tipic', 'Idempotentă?']} rows={[
            ['Create', '?', '?', '?'],
            ['Read', '?', '?', '?'],
            ['Update (complet)', '?', '?', '?'],
            ['Update (parțial)', '?', '?', '?'],
            ['Delete', '?', '?', '?'],
          ]} />
          <Reveal label="Soluție"><p>Create: POST, 201, nu. Read: GET, 200, da. Update complet: PUT, 200 (sau 204), da. Update parțial: PATCH, 200 (sau 204), nu garantat. Delete: DELETE, 204 (sau 200), da.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Autentificare și coduri de eroare">
        <Step labKey={L} n={8} title="Basic: fără și cu credențiale">
          <p>Serviciul <code>httpbin.org</code> are un endpoint protejat cu Basic: <code>https://httpbin.org/basic-auth/utilizator/parola-test</code> (credențiale fictive din URL). Cere-l fără credențiale, apoi cu <code>-u utilizator:parola-test</code>. Ce coduri primești?</p>
          <Reveal label="Răspuns"><p>Fără credențiale: 401 (neautentificat). Cu credențiale corecte: 200 și un corp JSON care confirmă autentificarea. Cu parolă greșită: din nou 401.</p></Reveal>
        </Step>
        <Step labKey={L} n={9} title="Bearer token">
          <p>Cere <code>https://httpbin.org/bearer</code> fără antet, apoi cu <code>-H "Authorization: Bearer token-fictiv"</code>. Ce se schimbă?</p>
          <Reveal label="Răspuns"><p>Fără antet: 401. Cu antet Bearer: 200 și serverul îți arată tokenul primit. REST este stateless: tokenul se trimite la fiecare cerere.</p></Reveal>
        </Step>
        <Step labKey={L} n={10} title="Coduri de stare la cerere">
          <p>Serviciul httpbin poate întoarce orice cod la cerere: <code>https://httpbin.org/status/403</code>, <code>/status/404</code>, <code>/status/500</code>. Clasifică fiecare (client sau server) și explică diferența dintre 401 și 403.</p>
          <Reveal label="Răspuns"><p>403 și 404: eroare a clientului (4xx); 500: eroare a serverului (5xx). 401 = nu știu cine ești (autentificare); 403 = știu cine ești, dar nu ai voie (autorizare).</p></Reveal>
        </Step>
        <Step labKey={L} n={11} title="Reflecție">
          <p>Răspunde în scris: (1) De ce trebuie tokenul trimis la fiecare cerere? (2) De ce HTTPS? (3) Ce ai verifica într-un script înainte să folosești corpul răspunsului?</p>
          <Reveal label="Indicii"><p>(1) REST este stateless: serverul nu ține sesiunea. (2) Basic și tokenurile circulă în antete; fără criptare pot fi interceptate. (3) Codul de stare (2xx) și faptul că corpul este JSON valid.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't65s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 6.5-S" title="Lab solo — șapte cereri defecte către API-ul controller-ului" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a scris șapte cereri către API-ul REST al unui controller; fiecare eșuează. Pentru fiecare primești cererea și răspunsul (tabel). Stabilește cauza, apoi corectează cererea. Poți verifica fiecare corectare în API-ul simulat din secțiunea „HTTP și CRUD” a topicului. <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> API-ul simulat din pagină (sau curl/Postman pe un API de test) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: script/Postman → controller (API REST northbound) → echipament (southbound).">
        <LabSoloTopology65 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: pentru fiecare cerere ai cauza (cu codul de stare) și varianta corectă. Pașii sunt ilustrativi; nu au fost testați de autorul lecției. Folosește doar valori fictive.
      </Callout>
      <Detailed title="Partea 1 — Cererile defecte">
        <Step labKey={L} n={1} title="Citește cererile și răspunsurile">
          <Table head={['#', 'Cerere', 'Răspuns']} rows={[
            ['1', 'POST /api/v1/interfaces · Authorization: Bearer admin-token · Content-Type: application/json · corp: {"name":"Lo0","ip":"1.1.1.1",}', '400 Bad Request'],
            ['2', 'POST /api/v1/interfaces · Authorization: Bearer admin-token · fără Content-Type · corp JSON valid', '415 Unsupported Media Type'],
            ['3', 'GET /api/v1/interfaces · fără antetul Authorization', '401 Unauthorized'],
            ['4', 'DELETE /api/v1/interfaces/1 · Authorization: Bearer readonly-token', '403 Forbidden'],
            ['5', 'GET /api/v1/interface · Authorization: Bearer admin-token', '404 Not Found'],
            ['6', 'PUT /api/v1/interfaces/2 · Bearer admin-token · corp: {"enabled":true}', '400 Bad Request (PUT cere reprezentarea completă)'],
            ['7', 'POST /api/v1/interfaces/2 · Bearer admin-token · corp JSON valid', '405 Method Not Allowed · Allow: GET, PUT, PATCH, DELETE'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește cauzele">
          <Reveal label="Cauze">
            <ol>
              <li><b>JSON invalid</b>: virgulă la final (<code>{',}'}</code>); JSON nu acceptă virgule finale → 400.</li>
              <li><b>Lipsește Content-Type</b>: serverul nu știe formatul corpului → 415. Adaugă <code>Content-Type: application/json</code>.</li>
              <li><b>Lipsește autentificarea</b>: nu există antet Authorization → 401. Adaugă tokenul.</li>
              <li><b>Autorizare insuficientă</b>: tokenul read-only nu are voie să șteargă → 403 (autentificat, dar fără permisiune). Folosește un token cu drept de scriere.</li>
              <li><b>URI greșit</b>: resursa se numește <code>interfaces</code> (plural), nu <code>interface</code> → 404.</li>
              <li><b>PUT cu corp parțial</b>: PUT înlocuiește resursa, deci cere toate câmpurile obligatorii; pentru o modificare parțială folosește <b>PATCH</b> → 400 la PUT.</li>
              <li><b>Metodă greșită</b>: POST se face pe colecție (<code>/interfaces</code>), nu pe o resursă individuală (<code>/interfaces/2</code>) → 405.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează cererile">
          <Reveal label="Soluție">
            <ol>
              <li>Corp: <code>{'{"name":"Lo0","ip":"1.1.1.1"}'}</code> (fără virgulă finală).</li>
              <li>Adaugă <code>Content-Type: application/json</code>.</li>
              <li>Adaugă <code>Authorization: Bearer admin-token</code>.</li>
              <li>Repetă DELETE cu <code>admin-token</code>.</li>
              <li>Folosește <code>/api/v1/interfaces</code>.</li>
              <li>Folosește <code>PATCH /api/v1/interfaces/2</code> cu <code>{'{"enabled":true}'}</code> (sau PUT cu name și ip).</li>
              <li>Folosește <code>POST /api/v1/interfaces</code> (pe colecție).</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Verifică și notează">
          <p>Rulează fiecare cerere corectată în API-ul simulat. Ce cod primești la fiecare (200, 201, 204)? Completează: „POST creează → ___; PATCH → ___; DELETE → ___”.</p>
          <Reveal label="Răspuns"><p>POST → 201 Created; PATCH → 200 OK (resursa actualizată); DELETE → 204 No Content; GET → 200 OK; repetarea aceluiași DELETE → 404.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Reflecție">
          <p>Notează în 4–5 rânduri: care dintre cele șapte erori sunt ale clientului (4xx) și care ar fi ale serverului (5xx)? De ce contează să citești <i>codul</i> și nu doar textul erorii?</p>
          <Reveal label="Indicii"><p>Toate șapte sunt 4xx: cererea clientului era greșită. Codul îți spune categoria problemei (autentificare, autorizare, format, cale, metodă) și unde să cauți: antete, corp, URI sau metodă.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
