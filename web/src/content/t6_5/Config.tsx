import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="6.5" title="Exemple: cereri REST cu curl și Python (CRUD, antete, autentificare)" />
      <Summary>
        <p>Parcurgi CRUD-ul pe un API public de test cu <code>curl</code>, apoi vezi același tipar în Python, cu autentificare prin token. Ideea este să recunoști rapid <b>metoda</b>, <b>URI-ul</b>, <b>antetele</b>, <b>corpul</b> și <b>codul de stare</b> — exact ce cere examenul.</p>
      </Summary>
      <Callout kind="warn" title="Exemple ilustrative, netestate">
        Comenzile și output-urile sunt <b>ilustrative</b> și <b>nu au fost testate</b> de autorul lecției; serviciile publice de test pot fi indisponibile, își pot schimba comportamentul sau pot limita cererile. Pentru un controller real, căile, antetele și câmpurile depind de produs și versiune (documentația Cisco DevNet). Nu trimite niciodată date reale sau credențiale reale către servicii publice de test.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Element', 'Valoare']} rows={[
          ['API de test', 'https://jsonplaceholder.typicode.com (resursa /posts, API REST fals, doar pentru exerciții)'],
          ['Unealtă', 'curl (în Windows 10/11, Linux, macOS) sau Postman'],
          ['Format', 'JSON (Content-Type: application/json)'],
        ]} />
      </Detailed>

      <Detailed title="2. GET — Read">
        <CodeBlock title="curl GET (ilustrativ)" kind="session" code={`$ curl -i https://jsonplaceholder.typicode.com/posts/1
HTTP/2 200
content-type: application/json; charset=utf-8

{
  "userId": 1,
  "id": 1,
  "title": "…",
  "body": "…"
}

$ curl -s -o /dev/null -w "%{http_code}\\n" https://jsonplaceholder.typicode.com/posts/99999
404`} explain={[
          ['curl -i URL', 'GET este metoda implicită; -i afișează și antetele răspunsului.'],
          ['HTTP/2 200', 'Codul de stare: succes. (curl poate afișa HTTP/1.1 sau HTTP/2.)'],
          ['content-type: application/json', 'Formatul corpului primit.'],
          ['-s -o /dev/null -w "%{http_code}"', 'Silențios, ignoră corpul, afișează doar codul de stare.'],
          ['404', 'Resursa 99999 nu există.'],
        ]} />
      </Detailed>

      <Detailed title="3. POST — Create">
        <CodeBlock title="curl POST (ilustrativ)" kind="session" code={`$ curl -i -X POST https://jsonplaceholder.typicode.com/posts \\
    -H "Content-Type: application/json" \\
    -d '{"title":"test","body":"salut","userId":1}'
HTTP/2 201
content-type: application/json; charset=utf-8

{
  "title": "test",
  "body": "salut",
  "userId": 1,
  "id": 101
}`} explain={[
          ['-X POST', 'Alege metoda POST (creează).'],
          ['-H "Content-Type: application/json"', 'Spune serverului că ce trimiți este JSON.'],
          ['-d \'{…}\'', 'Corpul cererii (payload): datele resursei de creat.'],
          ['HTTP/2 201', 'Created: resursa a fost creată.'],
          ['"id": 101', 'Serverul atribuie identificatorul resursei noi.'],
        ]} />
        <p>Serviciul acesta „preface” că salvează: dacă ceri apoi GET pe resursa 101, nu o va găsi. Este normal pentru un API de test.</p>
      </Detailed>

      <Detailed title="4. PUT și PATCH — Update">
        <CodeBlock title="curl PUT (înlocuire) și PATCH (modificare parțială) — ilustrativ" kind="session" code={`$ curl -s -X PUT https://jsonplaceholder.typicode.com/posts/1 \\
    -H "Content-Type: application/json" \\
    -d '{"id":1,"title":"titlu nou","body":"corp nou","userId":1}'
{ "id": 1, "title": "titlu nou", "body": "corp nou", "userId": 1 }

$ curl -s -X PATCH https://jsonplaceholder.typicode.com/posts/1 \\
    -H "Content-Type: application/json" \\
    -d '{"title":"doar titlul"}'
{ "userId": 1, "id": 1, "title": "doar titlul", "body": "…" }`} explain={[
          ['PUT …/posts/1 + corp complet', 'Înlocuiește întreaga resursă: trimiți TOATE câmpurile.'],
          ['PATCH …/posts/1 + {"title": …}', 'Modifică doar câmpul trimis; restul rămân neschimbate (body, userId).'],
        ]} />
        <Reveal label="PUT sau PATCH?">
          <p>Dacă schimbi un singur câmp dintr-o resursă mare, PATCH trimite mai puține date și evită suprascrierea accidentală a altor câmpuri. PUT garantează că resursa ajunge exact în starea trimisă și este idempotent.</p>
        </Reveal>
      </Detailed>

      <Detailed title="5. DELETE — Delete">
        <CodeBlock title="curl DELETE (ilustrativ)" kind="session" code={`$ curl -i -X DELETE https://jsonplaceholder.typicode.com/posts/1
HTTP/2 200

{}`} explain={[
          ['-X DELETE', 'Cere ștergerea resursei.'],
          ['HTTP/2 200 și corp gol', 'Acest serviciu de test întoarce 200; multe API-uri reale întorc 204 No Content la o ștergere reușită.'],
        ]} />
      </Detailed>

      <Detailed title="6. Autentificare cu token — același tipar în Python (ilustrativ)">
        <CodeBlock title="rest_client.py — token + cerere (ilustrativ)" kind="config" code={`import os
import requests

BASE = "https://controller.lab"
auth = (os.environ["API_USER"], os.environ["API_PASS"])      # fără credențiale în cod

# 1) obții tokenul (Basic o singură dată)
r = requests.post(BASE + "/dna/system/api/v1/auth/token", auth=auth, verify=False)
r.raise_for_status()
token = r.json()["Token"]

# 2) folosești tokenul într-un antet la fiecare cerere
headers = {"X-Auth-Token": token, "Accept": "application/json"}
r = requests.get(BASE + "/dna/intent/api/v1/network-device", headers=headers, verify=False)
print(r.status_code)
for dev in r.json()["response"]:
    print(dev["hostname"], dev["managementIpAddress"])`} explain={[
          ['auth=(user, parolă)', 'requests construiește antetul Authorization: Basic …; credențialele vin din variabile de mediu.'],
          ['requests.post(…/auth/token)', 'Cerere POST către endpointul de autentificare (exemplu în stilul unui controller de campus).'],
          ['r.raise_for_status()', 'Ridică o excepție dacă statusul este 4xx/5xx: nu continui cu un răspuns eșuat.'],
          ['r.json()["Token"]', 'Parsează corpul JSON într-un dicționar Python și extrage tokenul.'],
          ['headers = {"X-Auth-Token": …}', 'Tokenul însoțește fiecare cerere (REST este stateless).'],
          ['verify=False', 'Dezactivează verificarea certificatului — doar în laborator, niciodată în producție.'],
        ]} />
        <Callout kind="tip" title="Verifică întotdeauna codul de stare">
          Un script care ignoră <code>status_code</code> poate procesa un mesaj de eroare ca și cum ar fi date valide. <code>raise_for_status()</code> transformă 4xx/5xx în erori vizibile.
        </Callout>
      </Detailed>

      <Detailed title="7. Cum citești o cerere necunoscută">
        <Table head={['Pas', 'Întrebare', 'Exemplu']} hlCol={0} rows={[
          ['1', 'Ce metodă? (ce operație CRUD)', 'PATCH → update parțial'],
          ['2', 'Ce resursă (URI)?', '/api/v1/interfaces/2'],
          ['3', 'Ce antete? (autentificare, Content-Type, Accept)', 'Authorization: Bearer …; Content-Type: application/json'],
          ['4', 'Ce corp?', '{"enabled": true}'],
          ['5', 'Ce cod de stare a întors serverul?', '200 → ok; 401/403/404/400 → depanezi după cod'],
        ]} />
      </Detailed>
      <Traps items={[
        <>Fără <code>Content-Type: application/json</code> la POST/PUT/PATCH, serverul poate răspunde 415 sau interpreta greșit corpul.</>,
        <>JSON invalid (virgulă la final, ghilimele simple) → 400 Bad Request.</>,
        <>Un script fără verificarea codului de stare tratează erorile ca date.</>,
        <><code>verify=False</code> și credențiale în cod sunt acceptabile doar într-un laborator izolat.</>,
      ]} />
      <InlineQuiz ids={['6.5-027', '6.5-028', '6.5-029', '6.5-030']} />
    </section>
  );
}
