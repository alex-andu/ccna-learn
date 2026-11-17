import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.2 NTP. `ntp` (1.5), `udp`, `syslog` sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'stratum', abbr: 'Stratum', full: 'NTP stratum', ro: 'nivelul unui server NTP în ierarhie',
    what: 'Numărul de salturi dintre un dispozitiv și sursa de timp de referință: 0 = referința (ceas atomic/GPS), 1 = server legat direct la ea, apoi +1 la fiecare salt.',
    how: 'Un client care se sincronizează de la un server de stratum n devine stratum n+1. Valoarea maximă utilizabilă este 15; 16 înseamnă nesincronizat. Se vede în show ntp status și, pentru server, în coloana st din show ntp associations.',
    where: 'Alegerea între mai multe servere și diagnosticarea sincronizării; ntp master N declară manual stratum-ul N al unui dispozitiv de laborator.',
    std: 'RFC 5905', topics: ['4.2'],
  },
  {
    id: 'ntp-master', abbr: 'ntp master', full: 'NTP master (server source)', ro: 'dispozitiv care se declară sursă de timp',
    what: 'Comanda IOS ntp master [stratum] care face dispozitivul să ofere ora lui ca sursă NTP, chiar dacă nu e sincronizat cu o sursă externă.',
    how: 'Dispozitivul se prezintă la stratum-ul indicat (sau la o valoare implicită dacă îl omiți); clienții lui devin stratum+1. Dacă dispozitivul are o sursă externă mai bună, aceea e preferată.',
    where: 'Laboratoare și rețele izolate unde nu există un server NTP real; în producție se folosesc surse de încredere.',
    topics: ['4.2'],
  },
  {
    id: 'ntp-client', abbr: 'NTP client', full: 'NTP client mode (ntp server)', ro: 'dispozitiv care își ia ora de la un server NTP',
    what: 'Dispozitiv configurat cu ntp server <ip>, care interoghează periodic un server NTP și își ajustează ceasul după el.',
    how: 'Trimite cereri UDP 123 și folosește patru marcaje de timp (T1–T4) pentru a calcula offset și delay. Sincronizarea inițială durează câteva minute; poate avea mai multe servere (cu prefer pentru favorit).',
    where: 'Pe aproape toate routerele, switch-urile și firewall-urile unei rețele administrate.',
    topics: ['4.2'],
  },
  {
    id: 'ntp-association', abbr: 'NTP association', ro: 'legătura dintre un dispozitiv și o sursă de timp',
    what: 'Relația configurată sau descoperită dintre dispozitiv și un server/peer NTP, afișată în show ntp associations.',
    how: 'Fiecare linie arată adresa, stratum-ul (st), când a fost ultima interogare (when), intervalul (poll), registrul reach, delay, offset și dispersia. Asteriscul (*) marchează sursa aleasă; ~ marchează o asociere configurată manual.',
    where: 'Principalul instrument de verificare a unui client NTP: reach 377 = sănătos, 0 = fără răspuns.',
    topics: ['4.2'],
  },
  {
    id: 'ntp-offset-delay', abbr: 'Offset / delay', full: 'NTP clock offset and round-trip delay', ro: 'abaterea ceasului și întârzierea tur-retur',
    what: 'Offset = cât de mult diferă ceasul clientului de cel al serverului; delay = durata dus-întors a pachetelor NTP.',
    how: 'Offset = ((T2 − T1) + (T3 − T4)) / 2; delay = (T4 − T1) − (T3 − T2). NTP presupune că întârzierea e simetrică, de aici vine eroarea reziduală.',
    where: 'Coloanele offset și delay din show ntp associations și linia „clock offset” din show ntp status.',
    topics: ['4.2'],
  },
  {
    id: 'ntp-authentication', abbr: 'NTP authentication', ro: 'autentificarea cu cheie partajată în NTP',
    what: 'Mecanism opțional prin care clientul acceptă ora doar de la servere care dovedesc că știu o cheie partajată (MD5 la Cisco).',
    how: 'ntp authenticate + ntp authentication-key N md5 PAROLA + ntp trusted-key N pe ambele dispozitive; pe client, ntp server <ip> key N. Cheile diferite fac ca răspunsurile să fie respinse și clientul să rămână nesincronizat.',
    where: 'Medii care nu vor să accepte timp falsificat; relevant și pentru securitatea log-urilor și a certificatelor.',
    topics: ['4.2'],
  },
  {
    id: 'ntp-reach', abbr: 'reach', full: 'NTP reachability register', ro: 'registrul de accesibilitate NTP',
    what: 'Valoare octală pe 8 biți care arată rezultatul ultimelor 8 interogări către un server.',
    how: '377 (octal) = 11111111 binar: toate cele 8 interogări au primit răspuns. 0 = niciun răspuns recent. Se deplasează la stânga la fiecare interogare nouă.',
    where: 'Coloana reach din show ntp associations — primul loc unde vezi dacă serverul este accesibil.',
    topics: ['4.2'],
  },
];
