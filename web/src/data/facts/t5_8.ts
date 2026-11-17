import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.8 AAA
export const FACTS: Fact[] = [
  { topicId: '5.8', id: 'f-5.8-01', front: 'Cele trei funcții AAA', back: 'Authentication (cine ești) · Authorization (ce ai voie) · Accounting (ce ai făcut)', detail: 'Ordinea logică: autentificare → autorizare → contabilizare.' },
  { topicId: '5.8', id: 'f-5.8-02', front: 'Exemple pentru fiecare funcție', back: 'AuthN: utilizator+parolă/MFA · AuthZ: privilege 15 sau comenzi permise · Acct: log de sesiune/comenzi', detail: 'Accounting servește la audit și facturare.' },
  { topicId: '5.8', id: 'f-5.8-03', front: 'RADIUS: transport și porturi', back: 'UDP 1812 (autentificare/autorizare) și 1813 (accounting); vechi 1645/1646', detail: 'Standard IETF (RFC 2865/2866).' },
  { topicId: '5.8', id: 'f-5.8-04', front: 'TACACS+: transport', back: 'TCP 49', detail: 'Originar Cisco; RFC 8907.' },
  { topicId: '5.8', id: 'f-5.8-05', front: 'Ce criptează RADIUS?', back: 'Doar câmpul de parolă', detail: 'Restul atributelor sunt în clar.' },
  { topicId: '5.8', id: 'f-5.8-06', front: 'Ce criptează TACACS+?', back: 'Tot corpul pachetului (antetul rămâne în clar)', detail: 'Flag de „unencrypted” doar pentru depanare.' },
  { topicId: '5.8', id: 'f-5.8-07', front: 'Separarea funcțiilor', back: 'TACACS+: AuthN, AuthZ și Acct separate · RADIUS: AuthN+AuthZ combinate', detail: 'De aceea TACACS+ permite autorizare pe comandă.' },
  { topicId: '5.8', id: 'f-5.8-08', front: 'Utilizare tipică', back: 'TACACS+: administrare echipamente · RADIUS: acces la rețea (802.1X, VPN, Wi-Fi)', detail: 'Cisco ISE suportă ambele.' },
  { topicId: '5.8', id: 'f-5.8-09', front: 'Prima comandă AAA pe IOS', back: 'aaa new-model', detail: 'Înainte: utilizator local pentru fallback.' },
  { topicId: '5.8', id: 'f-5.8-10', front: 'Listă de metode', back: 'aaa authentication login default group tacacs+ local', detail: 'Serverul întâi; local doar dacă serverul nu răspunde.' },
  { topicId: '5.8', id: 'f-5.8-11', front: 'Când se folosește metoda următoare?', back: 'Doar la ERROR (server inaccesibil), nu la FAIL (refuz)', detail: 'Server care respinge parola = refuz definitiv.' },
  { topicId: '5.8', id: 'f-5.8-12', front: 'Lockout AAA', back: 'Server căzut + listă fără local → nimeni nu mai intră', detail: 'Folosește un utilizator local, o listă separată pe consolă și testează în a doua sesiune.' },
  { topicId: '5.8', id: 'f-5.8-13', front: 'Configurare server pe IOS (nou)', back: 'tacacs server NUME / address ipv4 … / key … · radius server NUME / address ipv4 … auth-port 1812 acct-port 1813 / key …', detail: 'Sintaxa depinde de versiune.' },
  { topicId: '5.8', id: 'f-5.8-14', front: 'Rolurile 802.1X', back: 'Supplicant (client) · Authenticator (switch/AP/WLC) · Authentication server (RADIUS)', detail: 'EAPOL client–authenticator; RADIUS authenticator–server.' },
  { topicId: '5.8', id: 'f-5.8-15', front: 'Port 802.1X înainte de autentificare', back: 'Neautorizat: trece doar EAPOL (și, de obicei, CDP/STP)', detail: 'După Access-Accept: autorizat.' },
  { topicId: '5.8', id: 'f-5.8-16', front: 'Secret partajat nepotrivit', back: 'Serverul nu răspunde / autentificare eșuată pentru toți', detail: 'Verifică comanda key pe ambele capete.' },
  { topicId: '5.8', id: 'f-5.8-17', front: 'Accounting: ce înregistrează', back: 'Start/stop, utilizator, durată, trafic, opțional comenzi', detail: 'aaa accounting exec default start-stop group tacacs+.' },
  { topicId: '5.8', id: 'f-5.8-18', front: 'Ce este un NAS?', back: 'Dispozitivul (router/switch/WLC) care primește utilizatorul și întreabă serverul AAA', detail: 'Este clientul RADIUS/TACACS+.' },
];
