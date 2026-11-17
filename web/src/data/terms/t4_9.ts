import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.9. `tftp`, `ftp`, `ssh`, `udp`, `tcp` sunt doar referiți (1.5).
export const TERMS: GlossaryEntry[] = [
  {
    id: 'running-config', abbr: 'running-config', ro: 'configurația activă (în RAM)',
    what: 'Configurația pe care echipamentul o folosește acum, stocată în RAM; se pierde la reload dacă nu este salvată.',
    how: 'Se salvează cu copy running-config startup-config; se poate salva pe un server cu copy running-config tftp:. Restaurarea cu copy tftp: running-config se îmbină cu configurația existentă.',
    where: 'Pe orice echipament Cisco IOS; se afișează cu show running-config.',
    topics: ['4.9'],
  },
  {
    id: 'startup-config', abbr: 'startup-config', ro: 'configurația salvată (în NVRAM)',
    what: 'Configurația încărcată la pornire, stocată în NVRAM, care persistă după reload.',
    how: 'Se scrie cu copy running-config startup-config; copy tftp: startup-config o înlocuiește complet (efect după reload).',
    where: 'Pe echipamente Cisco IOS; se afișează cu show startup-config.',
    topics: ['4.9'],
  },
  {
    id: 'ios-image', abbr: 'IOS image', full: 'Cisco IOS software image', ro: 'fișierul cu sistemul de operare',
    what: 'Fișier (.bin) care conține sistemul de operare al echipamentului, stocat de regulă în flash și încărcat în RAM la boot.',
    how: 'Se copiază cu copy tftp: flash:, se verifică cu verify /md5 și se alege pentru boot cu boot system; versiunea rulată se vede în show version.',
    where: 'La upgrade/downgrade de software și la backup al versiunii funcționale.',
    topics: ['4.9'],
  },
  {
    id: 'flash-memory', abbr: 'Flash', full: 'Flash memory (flash:)', ro: 'memoria persistentă pentru imaginea IOS',
    what: 'Memorie nevolatilă pe router/switch, cu comportament de sistem de fișiere, în care stă de obicei imaginea IOS (flash:, bootflash:).',
    how: 'dir flash: / show flash: listează fișierele și spațiul liber; delete flash:<fișier> șterge; o imagine nouă trebuie să încapă în spațiul liber.',
    where: 'Pe orice echipament Cisco; diferă de NVRAM (care păstrează startup-config).',
    topics: ['4.9'],
  },
  {
    id: 'sftp', abbr: 'SFTP', full: 'SSH File Transfer Protocol', ro: 'transfer de fișiere peste SSH',
    what: 'Protocol de transfer de fișiere care rulează peste SSH (TCP 22), cu criptare și autentificare; nu este FTP cu un strat de securitate, ci un protocol diferit.',
    how: 'Folosește o singură conexiune SSH, deci nu are problemele FTP cu conexiunile de date prin firewall/NAT.',
    where: 'Alternativă securizată la FTP/TFTP pentru backup și transfer de fișiere.',
    topics: ['4.9'],
  },
  {
    id: 'scp', abbr: 'SCP', full: 'Secure Copy Protocol', ro: 'copiere de fișiere prin SSH',
    what: 'Copiere de fișiere peste SSH (TCP 22), criptată și autentificată.',
    how: 'Pe IOS necesită SSH funcțional și, de regulă, ip scp server enable cu autorizare AAA; se folosește cu copy scp: …',
    where: 'Backup de configurații și imagini IOS pe rețele unde TFTP/FTP nu sunt acceptabile.',
    topics: ['4.9'],
  },
  {
    id: 'md5-verify', abbr: 'verify /md5', ro: 'verificarea integrității unei imagini',
    what: 'Comandă IOS care calculează hash-ul MD5 al unui fișier din flash, pentru comparare cu valoarea publicată de producător.',
    how: 'Dacă hash-urile diferă, fișierul s-a corupt la transfer și nu trebuie folosit pentru boot.',
    where: 'După fiecare copiere a unei imagini IOS în flash.',
    topics: ['4.9'],
  },
  {
    id: 'boot-system', abbr: 'boot system', ro: 'imaginea IOS aleasă pentru pornire',
    what: 'Comandă de configurare globală care indică fișierul-imagine din care routerul pornește la următorul reload.',
    how: 'Se verifică cu show version (System image file) și show running-config | include boot; setarea se salvează cu copy running-config startup-config.',
    where: 'La upgrade de IOS, pe platformele care folosesc imaginea clasică din flash.',
    topics: ['4.9'],
  },
  {
    id: 'ftp-passive', abbr: 'FTP activ / pasiv', ro: 'cine deschide conexiunea de date FTP',
    what: 'În modul activ, serverul se conectează înapoi la client (de la portul 20); în modul pasiv, clientul deschide conexiunea de date către un port înalt anunțat de server.',
    how: 'Pasivul trece mai ușor prin firewall/NAT-ul clientului; pe IOS se alege cu ip ftp passive.',
    where: 'Oriunde FTP trece printr-un firewall sau NAT.',
    topics: ['4.9'],
  },
];
