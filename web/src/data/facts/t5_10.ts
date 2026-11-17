import type { Fact } from '../flashcards';

// Fapte esențiale pentru 5.10 WLAN în GUI cu WPA2-PSK
export const FACTS: Fact[] = [
  { topicId: '5.10', id: 'f-5.10-01', front: 'Etapele creării unui WLAN WPA2-PSK în GUI', back: 'Interfață → Create New (profil, SSID, ID) → General (Enabled, interfață) → Security L2 (WPA+WPA2, AES, PSK, parolă) → Apply', detail: 'Verifici în lista WLANs și la client.' },
  { topicId: '5.10', id: 'f-5.10-02', front: 'Parola WPA2-PSK: reguli', back: '8–63 caractere ASCII sau exact 64 cifre hex', detail: 'Litere mari/mici contează; fără diacritice.' },
  { topicId: '5.10', id: 'f-5.10-03', front: 'Setări Layer 2 pentru WPA2-PSK', back: 'Layer 2 Security: WPA+WPA2 · WPA2 Policy ✔ · Encryption AES ✔ · Auth Key Mgmt: PSK', detail: 'TKIP lăsat nebifat.' },
  { topicId: '5.10', id: 'f-5.10-04', front: 'AKM PSK vs 802.1X', back: 'PSK: parolă comună · 802.1X: autentificare prin RADIUS', detail: 'Pentru acest obiectiv: PSK.' },
  { topicId: '5.10', id: 'f-5.10-05', front: 'SSID, profil, WLAN ID', back: 'SSID: numele vizibil · Profile Name: nume intern · ID: număr unic', detail: 'Nu sunt VLAN ID.' },
  { topicId: '5.10', id: 'f-5.10-06', front: 'Maparea WLAN → VLAN', back: 'Prin Interface/Interface Group (interfață dinamică cu VLAN, IP, DHCP)', detail: 'Fără interfață corectă, clientul nu primește IP bun.' },
  { topicId: '5.10', id: 'f-5.10-07', front: 'Clientul nu vede SSID-ul', back: 'WLAN Disabled · AP nealăturat · radio oprit · SSID ascuns · bandă greșită', detail: 'Verifică Status și All APs.' },
  { topicId: '5.10', id: 'f-5.10-08', front: 'Clientul vede SSID, dar nu se conectează', back: 'Parolă greșită (case!) · securitate diferită (WPA vs WPA2, AES/TKIP, WPA3-only)', detail: 'Handshake eșuează la MIC.' },
  { topicId: '5.10', id: 'f-5.10-09', front: 'Se conectează, dar are 169.254.x.x', back: 'DHCP lipsă pe interfața/VLAN-ul WLAN-ului sau VLAN nepermis pe trunk', detail: 'Verifică serverul DHCP și trunk-ul.' },
  { topicId: '5.10', id: 'f-5.10-10', front: 'CLI AireOS: parola PSK', back: 'config wlan security wpa akm psk set-key ascii <parola> <id>', detail: 'Pentru hex: set-key hex.' },
  { topicId: '5.10', id: 'f-5.10-11', front: 'CLI AireOS: pașii minimi', back: 'create → interface → security wpa enable → wpa2 enable → ciphers aes enable → akm psk enable → set-key → enable', detail: 'WLAN-ul nou este dezactivat până la enable.' },
  { topicId: '5.10', id: 'f-5.10-12', front: 'Verificare pe controller', back: 'show wlan <id> · lista WLANs (Security: [WPA2][Auth(PSK)]) · Monitor → Clients', detail: 'La clienți: stare, IP, VLAN, AKM.' },
  { topicId: '5.10', id: 'f-5.10-13', front: 'De ce nu TKIP?', back: 'Depreciat; mixed mode slăbește rețeaua', detail: 'Doar AES (CCMP).' },
  { topicId: '5.10', id: 'f-5.10-14', front: 'Catalyst 9800: unde', back: 'Configuration → Tags & Profiles → WLANs → Security → Layer2', detail: 'Mod WPA2/WPA3, AKM PSK, parolă; apoi tag-uri pe AP.' },
  { topicId: '5.10', id: 'f-5.10-15', front: 'SSID ascuns', back: 'Nu e securitate; doar ascunde numele din beacon', detail: 'WPA2 protejează, nu ascunderea.' },
  { topicId: '5.10', id: 'f-5.10-16', front: 'Parola PSK: bune practici', back: 'Lungă (14+), unică, nu cuvânt din dicționar; rotită când pleacă cineva', detail: 'Parola e comună tuturor.' },
];
