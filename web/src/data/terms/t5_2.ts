import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 5.2 (program de securitate). `social-engineering`, `phishing`, `least-privilege`, `defense-in-depth`, `insider-threat` (5.1) sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'security-program', abbr: 'Security program', ro: 'program de securitate',
    what: 'Ansamblul de politici, procese, roluri, instruiri și controale prin care o organizație își gestionează riscurile de securitate.',
    how: 'Pornește de la evaluarea riscurilor, formulează politici, standarde și proceduri, instruiește oamenii, aplică controale fizice și tehnice, verifică prin audit și se îmbunătățește după incidente. E un ciclu, nu un document.',
    where: 'Orice organizație; cerut de standarde precum ISO/IEC 27001 și de reglementări (de exemplu GDPR pentru date personale).',
    topics: ['5.2'],
  },
  {
    id: 'security-policy', abbr: 'Security policy', ro: 'politică de securitate',
    what: 'Document de nivel înalt, aprobat de conducere, care spune ce trebuie protejat și ce se așteaptă de la utilizatori și administratori.',
    how: 'Politica spune „ce” și „de ce”; standardele fixează cerințe măsurabile; procedurile spun „cum”; ghidurile dau recomandări. Fără aprobarea conducerii, o politică nu poate fi aplicată.',
    where: 'Politica de utilizare acceptabilă, de parole, de acces, de răspuns la incidente.',
    topics: ['5.2'], aliases: ['politică de securitate'],
  },
  {
    id: 'security-awareness', abbr: 'Security awareness', ro: 'conștientizarea securității',
    what: 'Informarea scurtă și continuă a tuturor utilizatorilor despre ce amenințări să recunoască și cum să se comporte (phishing, parole, dispozitive necunoscute).',
    how: 'Se face prin mesaje periodice, postere, bannere de login și simulări de phishing; răspunde la „ce să recunosc”. Indicatorul-cheie este rata de raportare a mesajelor suspecte.',
    where: 'Toți angajații, la angajare și periodic.',
    topics: ['5.2'], aliases: ['user awareness'],
  },
  {
    id: 'security-training', abbr: 'Security training', ro: 'instruire în securitate',
    what: 'Dezvoltarea de competențe practice pentru un rol (administrator de rețea, dezvoltator, personal HR): răspunde la „cum fac”.',
    how: 'Cursuri, laburi, exerciții de răspuns la incidente; diferă de awareness (toți, mesaje scurte) și de educație (înțelegere profundă, „de ce”).',
    where: 'La angajare, la schimbarea rolului și periodic pentru personalul tehnic.',
    topics: ['5.2'], aliases: ['instruire'],
  },
  {
    id: 'phishing-simulation', abbr: 'Phishing simulation', ro: 'simulare de phishing',
    what: 'Exercițiu în care organizația trimite angajaților un mesaj fals, controlat, pentru a măsura și a antrena reacția lor.',
    how: 'Se măsoară rata de click, rata de raportare și timpul până la raportare; cei care au dat click primesc imediat o explicație a indiciilor ratate. Scopul este învățarea, nu pedeapsa.',
    where: 'Programe de awareness.',
    topics: ['5.2'],
  },
  {
    id: 'physical-access-control', abbr: 'Physical access control', ro: 'controlul accesului fizic',
    what: 'Ansamblul de măsuri care împiedică persoanele neautorizate să ajungă la clădiri, săli de servere și echipamente: gard, pază, badge, PIN/biometrie, mantrap, camere, jurnale, rack încuiat.',
    how: 'Se aplică în straturi concentrice (perimetru → clădire → etaj → sală → rack), cu controale preventive (ușa), detective (camere, jurnale) și de descurajare (semne, pază).',
    where: 'Centre de date, dulapuri de rețea, birouri; se completează cu hardening pe echipamente (console, porturi libere).',
    topics: ['5.2'], aliases: ['control fizic'],
  },
  {
    id: 'access-badge', abbr: 'Access badge', ro: 'cartelă de acces',
    what: 'Cartelă (RFID sau cu cip) care identifică o persoană la o ușă sau un turnichet și permite intrarea numai dacă e autorizată.',
    how: 'Cititorul compară identificatorul cu o listă de permisiuni și înregistrează intrarea în jurnal; poate fi combinat cu PIN sau biometrie (autentificare în doi factori).',
    where: 'Intrări în clădire, săli de servere, laboratoare.',
    topics: ['5.2'], aliases: ['badge'],
  },
  {
    id: 'mantrap', abbr: 'Mantrap', full: 'Access control vestibule', ro: 'vestibul cu două uși',
    what: 'Spațiu mic între două uși, în care a doua ușă nu se deschide până când prima nu s-a închis și persoana a fost verificată.',
    how: 'Obligă persoanele să intre pe rând și împiedică tailgating-ul; poate include cântar, cameră sau biometrie.',
    where: 'Intrarea în săli de servere și zone cu securitate ridicată.',
    topics: ['5.2'], aliases: ['access control vestibule'],
  },
  {
    id: 'tailgating', abbr: 'Tailgating', ro: 'intrare lipit de o persoană autorizată',
    what: 'Atac fizic de social engineering în care o persoană neautorizată intră într-o zonă protejată urmărind îndeaproape pe cineva autorizat (piggybacking).',
    how: 'Se bazează pe politețea și graba oamenilor („ține ușa”). Se reduce prin instruire, mantrap, turnichete și politica „un badge = o persoană”.',
    where: 'Uși de acces din birouri și centre de date.',
    topics: ['5.2'], aliases: ['piggybacking'],
  },
  {
    id: 'incident-response', abbr: 'Incident response', ro: 'răspuns la incidente',
    what: 'Procesul prin care o organizație pregătește, detectează, limitează, elimină și recuperează un incident de securitate și învață din el.',
    how: 'Faze tipice: pregătire; detectare și analiză; izolare, eradicare; recuperare; lecții învățate. Se bazează pe un plan scris, roluri clare și exerciții periodice.',
    where: 'Echipe de securitate (CSIRT/SOC), politici de securitate.',
    topics: ['5.2'], aliases: ['IR'],
  },
  {
    id: 'separation-of-duties', abbr: 'Separation of duties', ro: 'separarea atribuțiilor',
    what: 'Principiu prin care niciun individ nu controlează singur un proces critic: cine cere o modificare și cine o aprobă sunt persoane diferite.',
    how: 'Reduce riscul de fraudă și de greșeli nedetectate; în rețele se aplică la aprobarea schimbărilor și la separarea conturilor de administrare și audit.',
    where: 'Procese financiare, gestionarea schimbărilor, administrarea sistemelor.',
    topics: ['5.2'],
  },
  {
    id: 'data-classification', abbr: 'Data classification', ro: 'clasificarea datelor',
    what: 'Încadrarea datelor în categorii (de exemplu public, intern, confidențial, secret) pentru a decide ce protecție primește fiecare.',
    how: 'Fiecare nivel are reguli de stocare, partajare, criptare și acces; datele mai sensibile primesc controale mai stricte.',
    where: 'Politici de securitate, DLP, criptarea discurilor și a transferurilor.',
    topics: ['5.2'],
  },
];
