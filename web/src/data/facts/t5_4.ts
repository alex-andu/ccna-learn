import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.4 politici de parole, MFA, certificate, biometrie
export const FACTS: Fact[] = [
  { topicId: '5.4', id: 'f-5.4-01', front: 'Cele două părți ale politicii de parole', back: 'Complexitate (lungime, tipuri de caractere) și management (unicitate, rotire/istoric, blocare, stocare, resetare)', detail: 'Lungimea contează cel mai mult.' },
  { topicId: '5.4', id: 'f-5.4-02', front: 'Cele 3 categorii de factori de autentificare', back: 'Ceva ce știi · ceva ce ai · ceva ce ești', detail: 'MFA = cel puțin 2 categorii diferite.' },
  { topicId: '5.4', id: 'f-5.4-03', front: 'Parolă + întrebare secretă — este MFA?', back: 'Nu: ambele sunt „ceva ce știi”', detail: 'Aceeași categorie de factor.' },
  { topicId: '5.4', id: 'f-5.4-04', front: 'Ce este TOTP?', back: 'Cod de unică folosință bazat pe timp (≈30 s) din cheie partajată', detail: 'Aplicații de autentificare (RFC 6238).' },
  { topicId: '5.4', id: 'f-5.4-05', front: 'Cea mai rezistentă metodă la phishing', back: 'Chei de securitate FIDO2 / passkeys', detail: 'Legate de domeniul real al site-ului.' },
  { topicId: '5.4', id: 'f-5.4-06', front: 'Salt în stocarea parolelor', back: 'Valoare aleatoare unică per parolă, adăugată înainte de hash', detail: 'Anulează rainbow tables.' },
  { topicId: '5.4', id: 'f-5.4-07', front: 'Formula entropiei (parolă aleatoare)', back: 'biți = lungime × log₂(mărimea alfabetului)', detail: 'Fiecare bit în plus dublează munca atacatorului.' },
  { topicId: '5.4', id: 'f-5.4-08', front: 'Brute force vs dictionary', back: 'Toate combinațiile vs parole uzuale și variații', detail: 'Spraying: o parolă pe multe conturi; stuffing: credențiale scurse.' },
  { topicId: '5.4', id: 'f-5.4-09', front: 'Ce leagă un certificat digital?', back: 'O identitate de o cheie publică, semnat de un CA', detail: 'X.509; cheia privată rămâne la proprietar.' },
  { topicId: '5.4', id: 'f-5.4-10', front: 'Cum se validează un certificat?', back: 'Lanț spre CA de încredere · valabilitate · nume · revocare (CRL/OCSP)', detail: 'Oricare eșec = respins.' },
  { topicId: '5.4', id: 'f-5.4-11', front: 'Ce este PKI?', back: 'Ansamblul CA, certificate, validare și revocare', detail: 'Folosit în HTTPS, VPN, EAP-TLS.' },
  { topicId: '5.4', id: 'f-5.4-12', front: 'FAR vs FRR', back: 'FAR: intruși acceptați · FRR: utilizatori reali respinși', detail: 'Prag strict: FAR↓, FRR↑. CER/EER = egalitate.' },
  { topicId: '5.4', id: 'f-5.4-13', front: 'Limita biometriei', back: 'Nu poate fi schimbată dacă e compromisă; probleme de confidențialitate', detail: 'Folosită ca factor suplimentar.' },
  { topicId: '5.4', id: 'f-5.4-14', front: 'Ce impune IOS din politica de parole?', back: 'Lungime minimă (security passwords min-length), hash (secret), blocare (login block-for), timeout', detail: 'Rotirea și MFA cer AAA/IdP.' },
  { topicId: '5.4', id: 'f-5.4-15', front: 'Recomandarea modernă despre rotire', back: 'Schimbare la suspiciune de compromitere, nu forțată periodic fără motiv', detail: 'La examen clasic: rotirea periodică e element de management.' },
  { topicId: '5.4', id: 'f-5.4-16', front: 'Pericolul blocării conturilor', back: 'Poate fi folosită pentru DoS asupra utilizatorilor legitimi', detail: 'Se folosește și întârzierea; login quiet-mode access-class pentru stații de încredere.' },
  { topicId: '5.4', id: 'f-5.4-17', front: 'Ce este push fatigue?', back: 'Cereri repetate de aprobare MFA până când utilizatorul acceptă', detail: 'Soluții: number matching, chei FIDO2.' },
  { topicId: '5.4', id: 'f-5.4-18', front: 'Certificat self-signed', back: 'Semnat de propria cheie; neverificabil de terți fără instalare manuală', detail: 'Nu înseamnă „invalid”.' },
];
