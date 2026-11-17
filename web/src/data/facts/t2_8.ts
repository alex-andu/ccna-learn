import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.8 Acces de management
export const FACTS: Fact[] = [
  { topicId: '2.8', id: 'f-2.8-01', front: 'Telnet: port și securitate', back: 'TCP 23; în clar (parolele se văd)', detail: 'Înlocuit de SSH.' },
  { topicId: '2.8', id: 'f-2.8-02', front: 'SSH: port și securitate', back: 'TCP 22; criptat (versiunea 2 recomandată)', detail: 'transport input ssh.' },
  { topicId: '2.8', id: 'f-2.8-03', front: 'HTTP vs HTTPS', back: 'HTTP TCP 80 în clar; HTTPS TCP 443 cu TLS', detail: 'no ip http server + ip http secure-server.' },
  { topicId: '2.8', id: 'f-2.8-04', front: 'Console: ce este și când se folosește?', back: 'Acces local, out-of-band, fără IP; configurare inițială și recuperare', detail: 'Securizat fizic.' },
  { topicId: '2.8', id: 'f-2.8-05', front: 'Ce cere SSH pe IOS?', back: 'Hostname, ip domain-name, chei RSA, utilizator, transport input ssh', detail: 'crypto key generate rsa; ip ssh version 2.' },
  { topicId: '2.8', id: 'f-2.8-06', front: 'In-band vs out-of-band', back: 'In-band: prin rețeaua de producție; OOB: cale separată (console, port mgmt)', detail: 'OOB funcționează când producția cade.' },
  { topicId: '2.8', id: 'f-2.8-07', front: 'Ce este AAA?', back: 'Authentication, Authorization, Accounting', detail: 'Cine ești · ce ai voie · ce ai făcut.' },
  { topicId: '2.8', id: 'f-2.8-08', front: 'TACACS+: transport și caracteristici', back: 'TCP 49; Cisco; criptează tot corpul; AAA separate', detail: 'Ideal pentru administrarea echipamentelor.' },
  { topicId: '2.8', id: 'f-2.8-09', front: 'RADIUS: transport și caracteristici', back: 'UDP 1812/1813; standard deschis; criptează doar parola', detail: 'Ideal pentru 802.1X, VPN, WLAN.' },
  { topicId: '2.8', id: 'f-2.8-10', front: 'Porturi istorice RADIUS', back: '1645/1646', detail: 'Standardul actual: 1812/1813.' },
  { topicId: '2.8', id: 'f-2.8-11', front: 'Ce face fallback-ul „local” într-o listă AAA?', back: 'Folosește conturile locale dacă serverul AAA nu răspunde', detail: 'Evită blocarea; păstrează un cont de urgență.' },
  { topicId: '2.8', id: 'f-2.8-12', front: 'Ce sunt liniile vty?', back: 'Liniile virtuale pe care intră sesiunile SSH/Telnet', detail: 'line vty 0 15.' },
  { topicId: '2.8', id: 'f-2.8-13', front: 'Cum limitezi cine poate intra pe vty?', back: 'access-class <ACL> in pe liniile vty', detail: 'Nu ip access-group.' },
  { topicId: '2.8', id: 'f-2.8-14', front: 'enable secret vs enable password', back: 'secret = hash; password = text (slab)', detail: 'service password-encryption ascunde doar parolele.' },
  { topicId: '2.8', id: 'f-2.8-15', front: 'Cloud-managed: ce trece prin cloud?', back: 'Managementul (dashboard HTTPS); datele clienților rămân locale', detail: 'Echipamentul inițiază conexiunea spre cloud.' },
  { topicId: '2.8', id: 'f-2.8-16', front: 'Dacă pierzi conexiunea la cloud (Meraki)?', back: 'Rețeaua continuă să funcționeze; nu mai poți schimba configurația', detail: 'Planul de date ≠ planul de management.' },
  { topicId: '2.8', id: 'f-2.8-17', front: 'Ce protocol AAA pentru WLAN enterprise (802.1X)?', back: 'RADIUS', detail: 'TACACS+ este pentru administrarea echipamentelor.' },
  { topicId: '2.8', id: 'f-2.8-18', front: 'login block-for: la ce ajută?', back: 'Blochează încercările de login după eșecuri repetate (forță brută)', detail: 'login block-for 120 attempts 3 within 60.' },
];
