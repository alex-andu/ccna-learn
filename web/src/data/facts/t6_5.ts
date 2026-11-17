import type { Fact } from '../flashcards';

// Fapte esențiale pentru 6.5 — API-uri REST
export const FACTS: Fact[] = [
  { topicId: '6.5', id: 'f-6.5-01', front: 'CRUD ↔ HTTP', back: 'Create=POST · Read=GET · Update=PUT (înlocuire)/PATCH (parțial) · Delete=DELETE', detail: 'Cele patru operații de bază asupra resurselor.' },
  { topicId: '6.5', id: 'f-6.5-02', front: 'Care metode HTTP sunt idempotente?', back: 'GET, PUT, DELETE (și HEAD/OPTIONS). POST nu. PATCH nu e garantat.', detail: 'Idempotent: repetat de n ori = aceeași stare finală.' },
  { topicId: '6.5', id: 'f-6.5-03', front: 'PUT vs PATCH', back: 'PUT înlocuiește întreaga resursă · PATCH modifică parțial', detail: 'PUT cere reprezentarea completă.' },
  { topicId: '6.5', id: 'f-6.5-04', front: '401 vs 403', back: '401: autentificare lipsă/invalidă (cine ești?) · 403: autentificat, dar fără permisiune (ai voie?)', detail: 'Numele „Unauthorized” al lui 401 înseamnă de fapt neautentificat.' },
  { topicId: '6.5', id: 'f-6.5-05', front: 'Clasele de coduri HTTP', back: '1xx info · 2xx succes · 3xx redirect · 4xx eroare client · 5xx eroare server', detail: 'Reține: 200, 201, 204, 400, 401, 403, 404, 500, 503.' },
  { topicId: '6.5', id: 'f-6.5-06', front: 'Cod la POST reușit / DELETE reușit', back: 'POST: 201 Created · DELETE: 204 No Content (de obicei)', detail: 'GET reușit: 200 OK.' },
  { topicId: '6.5', id: 'f-6.5-07', front: 'Ce este REST?', back: 'Stil arhitectural pentru API-uri peste HTTP: resurse + URI + verbe standard + stateless', detail: 'Nu este un protocol.' },
  { topicId: '6.5', id: 'f-6.5-08', front: 'Constrângerile REST', back: 'Client-server · stateless · cacheable · interfață uniformă · sistem pe straturi · cod la cerere (opțional)', detail: 'Stateless: tokenul se trimite la fiecare cerere.' },
  { topicId: '6.5', id: 'f-6.5-09', front: 'Tipuri de autentificare', back: 'Basic · API key · Bearer token · OAuth 2.0', detail: 'Toate peste HTTPS.' },
  { topicId: '6.5', id: 'f-6.5-10', front: 'Base64 în HTTP Basic', back: 'Doar codificare, nu criptare', detail: 'Oricine vede antetul poate citi parola.' },
  { topicId: '6.5', id: 'f-6.5-11', front: 'Content-Type vs Accept', back: 'Content-Type: formatul corpului trimis · Accept: formatul dorit în răspuns', detail: 'Lipsa Content-Type la POST poate da 415.' },
  { topicId: '6.5', id: 'f-6.5-12', front: 'Formate de date în API-uri', back: 'JSON (cel mai des) · XML (NETCONF) · YAML (Ansible)', detail: 'JSON: { } și [ ], chei în ghilimele duble.' },
  { topicId: '6.5', id: 'f-6.5-13', front: 'Anatomia unei cereri HTTP', back: 'Linie (METODĂ cale HTTP/1.1) → antete → linie goală → corp', detail: 'Răspunsul: linie de stare → antete → corp.' },
  { topicId: '6.5', id: 'f-6.5-14', front: 'URI-uri REST', back: 'Substantive la plural pentru resurse: /interfaces, /interfaces/2; acțiunea o dă metoda', detail: 'Query string (?filtru=valoare) pentru filtrare.' },
  { topicId: '6.5', id: 'f-6.5-15', front: 'Cum obții un token (tipar)', back: 'Cerere cu Basic către un endpoint de autentificare → token → antet la fiecare cerere', detail: 'Ex.: X-Auth-Token sau Authorization: Bearer.' },
  { topicId: '6.5', id: 'f-6.5-16', front: 'Cod 404 vs 405', back: '404: resursa/calea nu există · 405: resursa există, dar metoda nu e permisă (antet Allow)', detail: 'Ex.: POST pe /interfaces/2 → 405.' },
  { topicId: '6.5', id: 'f-6.5-17', front: 'Cod 400 vs 415', back: '400: cerere malformată (JSON invalid, câmpuri lipsă) · 415: Content-Type neacceptat/lipsă', detail: 'JSON invalid: virgulă la final, ghilimele simple.' },
  { topicId: '6.5', id: 'f-6.5-18', front: 'Securitatea API-urilor', back: 'Doar HTTPS · tokenuri scurte · secrete în afara codului/URL · privilegiul minim · rate limiting (429)', detail: 'Tokenul Bearer funcționează pentru oricine îl deține.' },
];
