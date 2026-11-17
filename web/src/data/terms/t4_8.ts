import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 4.8 SSH. `ssh`, `telnet`, `vty`, `aaa`, `tacacs-plus`, `radius`, `in-band-management`, `console-port` sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'rsa-keypair', abbr: 'RSA key pair', full: 'RSA public/private key pair', ro: 'perechea de chei RSA a echipamentului',
    what: 'Pereche de chei asimetrice (privată + publică) generată cu crypto key generate rsa; cheia publică identifică routerul în fața clienților SSH.',
    how: 'Necesită hostname diferit de „Router” și ip domain-name; numele cheii este hostname.domeniu. Pentru SSHv2 modulul trebuie să aibă cel puțin 768 biți (în practică 2048). Generarea cheii pornește serverul SSH.',
    where: 'Pe orice router/switch care acceptă SSH; show crypto key mypubkey rsa o arată, iar crypto key zeroize rsa o șterge.',
    topics: ['4.8'],
  },
  {
    id: 'ssh-host-key', abbr: 'SSH host key', ro: 'cheia care identifică serverul SSH',
    what: 'Cheia publică a serverului (aici cea RSA a routerului), prezentată clientului la conectare pentru autentificarea serverului.',
    how: 'La prima conectare clientul afișează amprenta (fingerprint) și cere confirmare, apoi o reține; dacă ea se schimbă ulterior, clientul avertizează (posibil atac man-in-the-middle sau cheie regenerată).',
    where: 'În toate conexiunile SSH; fișierul known_hosts la clienții OpenSSH.',
    topics: ['4.8'],
  },
  {
    id: 'ssh-version-2', abbr: 'SSHv2', full: 'Secure Shell version 2', ro: 'versiunea sigură a protocolului SSH',
    what: 'A doua versiune a SSH, reproiectată față de v1, cu schimb de chei și verificări de integritate mai robuste; v1 este considerată nesigură.',
    how: 'Pe IOS se forțează cu ip ssh version 2; cheia RSA trebuie să aibă cel puțin 768 biți.',
    where: 'Standard pentru administrarea de la distanță a echipamentelor.',
    std: 'RFC 4251–4254', topics: ['4.8'],
  },
  {
    id: 'transport-input', abbr: 'transport input', ro: 'protocoalele acceptate pe liniile VTY',
    what: 'Comandă de linie care stabilește ce protocoale de la distanță sunt permise pe VTY: ssh, telnet, all, none.',
    how: 'transport input ssh acceptă doar SSH (Telnet respins); implicit unele versiuni acceptă și Telnet.',
    where: 'În line vty 0 15, împreună cu login local.',
    topics: ['4.8'],
  },
  {
    id: 'login-local', abbr: 'login local', ro: 'autentificare cu baza de utilizatori locală',
    what: 'Comandă de linie care cere utilizator și parolă verificate în baza locală (username … secret …), nu o parolă de linie.',
    how: 'Fără utilizatori locali sau fără această comandă (cu simplu login) se obține „Password required, but none set” sau o parolă comună de linie.',
    where: 'Pe liniile VTY (și, opțional, consolă) când AAA nu este folosit.',
    topics: ['4.8'],
  },
  {
    id: 'access-class', abbr: 'access-class', ro: 'ACL aplicat pe liniile VTY',
    what: 'Comandă de linie prin care un ACL standard limitează adresele sursă care pot deschide sesiuni VTY (Telnet/SSH) spre echipament.',
    how: 'Se aplică cu access-class <acl> in pe line vty; nu se confundă cu ip access-group (care filtrează traficul pe interfețe).',
    where: 'Pe liniile VTY ale routerelor și switch-urilor.',
    topics: ['4.8'],
  },
  {
    id: 'exec-timeout', abbr: 'exec-timeout', ro: 'timpul de inactivitate după care sesiunea se închide',
    what: 'Comandă de linie (minute secunde) care închide automat sesiunile EXEC inactive; exec-timeout 0 0 le dezactivează.',
    how: 'De exemplu exec-timeout 5 0 = 5 minute. Reduce riscul sesiunilor uitate deschise.',
    where: 'Pe line console și line vty.',
    topics: ['4.8'],
  },
];
