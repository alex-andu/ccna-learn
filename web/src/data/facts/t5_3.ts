import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.3 acces local cu parole
export const FACTS: Fact[] = [
  { topicId: '5.3', id: 'f-5.3-01', front: 'Căile de acces la un router/switch Cisco', back: 'Console · VTY · AUX · enable (privileged EXEC)', detail: 'Fiecare cu parola/configurarea ei.' },
  { topicId: '5.3', id: 'f-5.3-02', front: 'Consola: comportament implicit', back: 'Acces direct în user EXEC, fără autentificare', detail: 'VTY implicit refuză: „Password required, but none set”.' },
  { topicId: '5.3', id: 'f-5.3-03', front: 'Ce face comanda login?', back: 'Cere parola configurată cu password pe linie', detail: 'Fără login, password este ignorată.' },
  { topicId: '5.3', id: 'f-5.3-04', front: 'Ce face login local?', back: 'Cere utilizator + parolă din baza locală (username …)', detail: 'Fără username definit, linia devine inutilizabilă.' },
  { topicId: '5.3', id: 'f-5.3-05', front: 'Ce face no login?', back: 'Dezactivează verificarea: acces fără parolă', detail: 'Chiar dacă există password.' },
  { topicId: '5.3', id: 'f-5.3-06', front: 'enable secret vs enable password', back: 'Secret (hash) bate password (clar); dacă ambele există, doar secret e cerută', detail: 'Elimină password: no enable password.' },
  { topicId: '5.3', id: 'f-5.3-07', front: 'Tipurile de parole Cisco', back: '0 clar · 5 MD5 · 7 reversibil · 8 PBKDF2-SHA256 · 9 scrypt', detail: '8/9 depind de versiune.' },
  { topicId: '5.3', id: 'f-5.3-08', front: 'Ce face service password-encryption?', back: 'Convertește parolele în clar în tip 7 (reversibil)', detail: 'Nu modifică secret; nu e protecție reală.' },
  { topicId: '5.3', id: 'f-5.3-09', front: 'username … password vs secret', back: 'password = clar/tip 7; secret = hash', detail: 'Folosește secret.' },
  { topicId: '5.3', id: 'f-5.3-10', front: 'username admin privilege 15 secret X', back: 'Contul intră direct în privileged EXEC (#)', detail: 'Fără privilege: user EXEC (>), apoi enable.' },
  { topicId: '5.3', id: 'f-5.3-11', front: 'Niveluri de privilegiu', back: '0–15; implicit 1 = user EXEC, 15 = privileged EXEC', detail: 'Niveluri intermediare cu privilege exec level.' },
  { topicId: '5.3', id: 'f-5.3-12', front: 'security passwords min-length 10', back: 'Respinge parolele noi mai scurte de 10 caractere', detail: 'Nu verifică parolele existente.' },
  { topicId: '5.3', id: 'f-5.3-13', front: 'login block-for 120 attempts 3 within 60', back: '3 eșecuri în 60 s → refuz 120 s (quiet mode)', detail: 'show login arată starea.' },
  { topicId: '5.3', id: 'f-5.3-14', front: 'Ce face exec-timeout 5 0?', back: 'Închide sesiunea inactivă după 5 minute', detail: 'exec-timeout 0 0 = fără timeout (de evitat). Implicit 10 minute.' },
  { topicId: '5.3', id: 'f-5.3-15', front: 'Cum limitezi VTY la SSH?', back: 'transport input ssh (pe line vty)', detail: 'Necesită SSH configurat (4.8).' },
  { topicId: '5.3', id: 'f-5.3-16', front: 'Comenzi de verificare', back: 'show running-config · show users · show login · show privilege · show line', detail: 'show users: sesiuni active.' },
  { topicId: '5.3', id: 'f-5.3-17', front: 'Banner login vs motd vs exec', back: 'login: înainte de autentificare · motd: la conectare · exec: după autentificare', detail: 'Fără detalii despre echipament.' },
  { topicId: '5.3', id: 'f-5.3-18', front: 'Limita autentificării locale', back: 'Nu scalează: conturi gestionate pe fiecare echipament', detail: 'Soluția: AAA cu RADIUS/TACACS+ (5.8).' },
  { topicId: '5.3', id: 'f-5.3-19', front: 'Ordinea sigură pentru login local pe VTY', back: 'Creezi utilizatorul → login local → testezi într-o a doua sesiune → salvezi', detail: 'Altfel te poți bloca.' },
  { topicId: '5.3', id: 'f-5.3-20', front: 'Ce linii VTY securizezi?', back: 'Toate: line vty 0 15 (nu doar 0 4)', detail: 'Cele neacoperite rămân o cale de intrare.' },
];
