import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.9 TFTP / FTP
export const FACTS: Fact[] = [
  { topicId: '4.9', id: 'f-4.9-01', front: 'TFTP: transport și port', back: 'UDP 69 (cerere); datele merg pe un port efemer', detail: 'Fără autentificare, fără criptare.' },
  { topicId: '4.9', id: 'f-4.9-02', front: 'FTP: transport și porturi', back: 'TCP 21 (control) + TCP 20 (date, mod activ) sau port înalt (mod pasiv)', detail: 'Autentificare cu utilizator și parolă, în clar.' },
  { topicId: '4.9', id: 'f-4.9-03', front: 'Diferența TFTP vs FTP', back: 'TFTP: UDP, simplu, fără autentificare · FTP: TCP, autentificare, directoare', detail: 'Niciunul nu criptează.' },
  { topicId: '4.9', id: 'f-4.9-04', front: 'La ce folosesc pe un router?', back: 'Backup/restaurare de configurații și upgrade/backup al imaginii IOS', detail: 'Prin comanda copy.' },
  { topicId: '4.9', id: 'f-4.9-05', front: 'Backup al configurației', back: 'copy running-config tftp:', detail: 'Sau ftp:/scp:.' },
  { topicId: '4.9', id: 'f-4.9-06', front: 'copy tftp: running-config', back: 'ÎMBINĂ liniile cu configurația activă (nu înlocuiește)', detail: 'Pentru înlocuire: copy tftp: startup-config + reload.' },
  { topicId: '4.9', id: 'f-4.9-07', front: 'Upgrade de imagine IOS', back: 'copy tftp: flash: → verify /md5 → boot system → reload', detail: 'Verifică mai întâi spațiul din flash.' },
  { topicId: '4.9', id: 'f-4.9-08', front: 'Cum verifici integritatea imaginii?', back: 'verify /md5 flash:<imagine> și compari cu hash-ul publicat', detail: 'Nu folosi o imagine cu hash diferit.' },
  { topicId: '4.9', id: 'f-4.9-09', front: 'Unde stă imaginea IOS?', back: 'În flash (flash:/bootflash:)', detail: 'startup-config este în NVRAM.' },
  { topicId: '4.9', id: 'f-4.9-10', front: 'Cum arăți versiunea de IOS rulată?', back: 'show version (System image file)', detail: 'Plus uptime și registrul de configurare.' },
  { topicId: '4.9', id: 'f-4.9-11', front: 'Credențiale FTP pe IOS', back: 'ip ftp username <u> și ip ftp password <p>', detail: 'Sau în URL: ftp://user:parola@ip/fișier.' },
  { topicId: '4.9', id: 'f-4.9-12', front: 'FTP activ vs pasiv', back: 'Activ: serverul deschide datele spre client · Pasiv: clientul deschide spre server', detail: 'Pasiv este mai prietenos cu firewall/NAT (ip ftp passive).' },
  { topicId: '4.9', id: 'f-4.9-13', front: 'TFTP: dimensiunea blocului', back: '512 octeți, fiecare bloc confirmat (lock-step)', detail: 'Ultimul bloc este mai mic de 512 octeți.' },
  { topicId: '4.9', id: 'f-4.9-14', front: 'Alternative securizate la FTP/TFTP', back: 'SCP și SFTP (peste SSH, TCP 22), FTPS (FTP peste TLS)', detail: 'SFTP este un protocol diferit, nu FTP „securizat”.' },
  { topicId: '4.9', id: 'f-4.9-15', front: 'Ce limită are TFTP clasic ca mărime de fișier?', back: 'Aproximativ 32 MB (număr de bloc pe 16 biți)', detail: 'Extensii (blksize) o pot ridica; depinde de server/client.' },
  { topicId: '4.9', id: 'f-4.9-16', front: 'Imaginea de boot', back: 'boot system flash:<fișier>', detail: 'Se salvează în startup-config.' },
];
