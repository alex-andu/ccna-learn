import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.8 SSH
export const FACTS: Fact[] = [
  { topicId: '4.8', id: 'f-4.8-01', front: 'Portul SSH', back: 'TCP 22', detail: 'Telnet: TCP 23 (text clar).' },
  { topicId: '4.8', id: 'f-4.8-02', front: 'SSH vs Telnet', back: 'SSH criptează și autentifică serverul; Telnet trimite tot în text clar', detail: 'Folosește SSH în producție.' },
  { topicId: '4.8', id: 'f-4.8-03', front: 'Ordinea pașilor SSH pe IOS', back: 'hostname → ip domain-name → crypto key generate rsa → username → line vty (login local + transport input ssh)', detail: 'Plus ip ssh version 2.' },
  { topicId: '4.8', id: 'f-4.8-04', front: 'Comanda de generare a cheilor', back: 'crypto key generate rsa modulus 2048', detail: 'Cere hostname ≠ Router și ip domain-name.' },
  { topicId: '4.8', id: 'f-4.8-05', front: 'Modul RSA minim pentru SSHv2', back: '768 biți (în practică 2048)', detail: 'Module mici nu permit v2.' },
  { topicId: '4.8', id: 'f-4.8-06', front: 'Forțarea SSHv2', back: 'ip ssh version 2', detail: 'v1 este nesigur.' },
  { topicId: '4.8', id: 'f-4.8-07', front: 'Acceptă doar SSH pe VTY', back: 'line vty 0 15 → transport input ssh', detail: 'Telnet este respins.' },
  { topicId: '4.8', id: 'f-4.8-08', front: 'Autentificare locală pe VTY', back: 'login local (+ username … secret …)', detail: 'login simplu cere o parolă de linie.' },
  { topicId: '4.8', id: 'f-4.8-09', front: 'Restricționarea sursei SSH', back: 'ACL standard + access-class <n> in pe line vty', detail: 'Nu access-group.' },
  { topicId: '4.8', id: 'f-4.8-10', front: 'Verificarea SSH', back: 'show ip ssh · show ssh · show users', detail: '„SSH Enabled - version 2.0”.' },
  { topicId: '4.8', id: 'f-4.8-11', front: '„SSH Disabled” înseamnă', back: 'Nu există chei RSA (sau lipsesc hostname/domain-name)', detail: 'Generează cheile și re-verifică.' },
  { topicId: '4.8', id: 'f-4.8-12', front: 'Ce autentifică cheia RSA a routerului?', back: 'Serverul (identitatea routerului), nu utilizatorul', detail: 'Datele se criptează cu chei simetrice de sesiune.' },
  { topicId: '4.8', id: 'f-4.8-13', front: 'SSH pe un switch L2', back: 'Are nevoie de SVI cu IP și ip default-gateway', detail: 'Restul pașilor ca pe router.' },
  { topicId: '4.8', id: 'f-4.8-14', front: 'Conectarea din IOS / OpenSSH', back: 'ssh -l admin <ip> · ssh admin@<ip>', detail: 'Prima conectare cere confirmarea amprentei.' },
  { topicId: '4.8', id: 'f-4.8-15', front: 'Închiderea sesiunilor inactive', back: 'exec-timeout <min> <sec> (ex. 5 0)', detail: 'Pe line vty.' },
  { topicId: '4.8', id: 'f-4.8-16', front: 'Ștergerea cheilor RSA', back: 'crypto key zeroize rsa', detail: 'Dezactivează SSH.' },
];
