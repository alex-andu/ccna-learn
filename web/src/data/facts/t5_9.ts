import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.9 securitate wireless
export const FACTS: Fact[] = [
  { topicId: '5.9', id: 'f-5.9-01', front: 'Cele trei lucruri pe care le asigură securitatea Wi-Fi', back: 'Autentificare, criptare (confidențialitate), integritate (MIC)', detail: 'Mediul radio este partajat: oricine din rază poate asculta.' },
  { topicId: '5.9', id: 'f-5.9-02', front: 'WEP', back: 'RC4, cheie 40/104 biți, IV 24 biți — spart, nu se folosește', detail: '1997; recuperabil în minute.' },
  { topicId: '5.9', id: 'f-5.9-03', front: 'WPA (2003)', back: 'TKIP (RC4 cu chei pe pachet) + MIC Michael; PSK sau 802.1X — depreciat', detail: 'Soluție de tranziție pe hardware WEP.' },
  { topicId: '5.9', id: 'f-5.9-04', front: 'WPA2 (2004, 802.11i)', back: 'AES-CCMP (128 biți); Personal PSK sau Enterprise 802.1X; PMF opțional', detail: 'Răspunsul standard „curent” la CCNA pentru criptare: AES-CCMP.' },
  { topicId: '5.9', id: 'f-5.9-05', front: 'WPA3 (2018)', back: 'SAE la Personal; Enterprise cu 192-bit opțional; PMF obligatoriu; OWE pentru rețele deschise', detail: 'GCMP-256 în modul de 192 biți.' },
  { topicId: '5.9', id: 'f-5.9-06', front: 'Personal vs Enterprise', back: 'Personal: parolă comună (PSK/SAE) · Enterprise: autentificare individuală 802.1X + RADIUS', detail: 'Enterprise permite revocare individuală și politici pe utilizator.' },
  { topicId: '5.9', id: 'f-5.9-07', front: 'Slăbiciunea WPA2-PSK', back: 'Handshake capturat → atac de dicționar OFFLINE; fără forward secrecy', detail: 'Parola lungă și aleatorie reduce riscul.' },
  { topicId: '5.9', id: 'f-5.9-08', front: 'Ce aduce SAE (WPA3-Personal)?', back: 'Rezistență la dicționar offline + forward secrecy', detail: 'Handshake Dragonfly; fiecare ghicire e online.' },
  { topicId: '5.9', id: 'f-5.9-09', front: 'PMF (802.11w)', back: 'Protejează cadrele de management (deauth/disassoc); opțional la WPA2, obligatoriu la WPA3', detail: 'Oprește deauth-ul falsificat.' },
  { topicId: '5.9', id: 'f-5.9-10', front: 'OWE (Enhanced Open)', back: 'Criptare pentru rețele deschise, fără parolă (Diffie-Hellman)', detail: 'Nu autentifică AP-ul.' },
  { topicId: '5.9', id: 'f-5.9-11', front: 'TKIP vs CCMP vs GCMP', back: 'TKIP: RC4 (WPA, depreciat) · CCMP: AES (WPA2, WPA3) · GCMP-256: modul 192-bit WPA3-Enterprise', detail: 'TKIP + AES în „mixed mode” slăbește rețeaua.' },
  { topicId: '5.9', id: 'f-5.9-12', front: 'Metode EAP de recunoscut', back: 'EAP-TLS (certificate ambele părți) · PEAP (tunel TLS + parolă) · EAP-FAST (Cisco, PAC) · LEAP (vechi, nesigur)', detail: 'EAP-TLS este cea mai puternică.' },
  { topicId: '5.9', id: 'f-5.9-13', front: 'Rolurile în Enterprise', back: 'Supplicant (client) · Authenticator (AP/WLC) · Authentication server (RADIUS)', detail: 'Același model ca la 802.1X pe porturi.' },
  { topicId: '5.9', id: 'f-5.9-14', front: 'Parola WPA2-PSK', back: '8–63 caractere ASCII sau 64 cifre hexazecimale', detail: 'PMK derivat din parolă + SSID.' },
  { topicId: '5.9', id: 'f-5.9-15', front: 'Ascunderea SSID-ului și filtrarea MAC', back: 'NU sunt securitate reală', detail: 'SSID-ul apare în cadre; MAC-ul se poate falsifica.' },
  { topicId: '5.9', id: 'f-5.9-16', front: 'Evil twin vs rogue AP', back: 'Evil twin: AP-geamăn cu același SSID · Rogue AP: AP neautorizat în rețeaua proprie', detail: 'Apărare: validarea certificatului, WIPS, 802.1X pe porturi.' },
  { topicId: '5.9', id: 'f-5.9-17', front: 'WPA3 transition mode', back: 'Același SSID acceptă WPA3 (SAE) și WPA2 (PSK) — protecția celui mai slab', detail: 'Folosit temporar la migrare.' },
  { topicId: '5.9', id: 'f-5.9-18', front: 'Alegerea corectă', back: 'Companii: WPA2/WPA3-Enterprise · Acasă: WPA3-Personal (sau WPA2 + parolă lungă)', detail: 'WEP și Open nu se folosesc; WPA/TKIP depreciat.' },
];
