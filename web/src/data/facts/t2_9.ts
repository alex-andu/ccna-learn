import type { Fact } from '../flashcards';

// Fapte esențiale pentru 2.9 Interfața grafică WLAN
export const FACTS: Fact[] = [
  { topicId: '2.9', id: 'f-2.9-01', front: 'Taburile unui WLAN în GUI-ul WLC (AireOS)', back: 'General · Security · QoS · Advanced', detail: 'Pe 9800: WLAN profile + Policy profile + Policy tag.' },
  { topicId: '2.9', id: 'f-2.9-02', front: 'Profile Name vs SSID', back: 'Profile Name = nume intern; SSID = numele văzut de clienți', detail: 'Pot fi identice, dar nu sunt același câmp.' },
  { topicId: '2.9', id: 'f-2.9-03', front: 'Ce face câmpul Interface/Interface Group?', back: 'Mapează WLAN-ul pe interfața dinamică (VLAN) a clienților', detail: 'Interfață greșită ⇒ VLAN greșit.' },
  { topicId: '2.9', id: 'f-2.9-04', front: 'Un WLAN nou, cum se creează?', back: 'Disabled; configurezi totul; apoi Status: Enabled + Save', detail: 'WLANs → Create New → Go.' },
  { topicId: '2.9', id: 'f-2.9-05', front: 'WPA2-Personal: Auth Key Mgmt', back: 'PSK (parolă comună, 8–63 caractere)', detail: 'WPA2 Policy + AES.' },
  { topicId: '2.9', id: 'f-2.9-06', front: 'WPA2-Enterprise: Auth Key Mgmt', back: '802.1X cu server RADIUS', detail: 'Server în AAA Servers; shared secret identic.' },
  { topicId: '2.9', id: 'f-2.9-07', front: 'WPA3-Personal în GUI', back: 'SAE; PMF Required', detail: 'AES; fără TKIP.' },
  { topicId: '2.9', id: 'f-2.9-08', front: 'Layer 3 Security: Web Policy', back: 'Portal captiv pentru oaspeți (Authentication/Passthrough)', detail: 'L2 poate fi None; nu criptează traficul.' },
  { topicId: '2.9', id: 'f-2.9-09', front: 'Profilurile QoS', back: 'Platinum voce · Gold video · Silver best effort · Bronze background', detail: 'Silver este implicit.' },
  { topicId: '2.9', id: 'f-2.9-10', front: 'WMM Policy', back: 'Disabled / Allowed / Required', detail: 'Required = doar clienți WMM.' },
  { topicId: '2.9', id: 'f-2.9-11', front: 'Categoriile WMM', back: 'AC_VO voce · AC_VI video · AC_BE best effort · AC_BK background', detail: 'De la 802.11e.' },
  { topicId: '2.9', id: 'f-2.9-12', front: 'Allow AAA Override', back: 'RADIUS poate suprascrie VLAN/QoS/ACL per utilizator', detail: 'Un SSID, utilizatori în VLAN-uri diferite.' },
  { topicId: '2.9', id: 'f-2.9-13', front: 'Session Timeout', back: 'Timpul după care clientul se reautentifică', detail: 'Uzual 1800 s la 802.1X.' },
  { topicId: '2.9', id: 'f-2.9-14', front: 'Client Exclusion', back: 'Exclude temporar clienții cu eșecuri repetate', detail: 'Ex. 60 s.' },
  { topicId: '2.9', id: 'f-2.9-15', front: 'P2P Blocking', back: 'Clienții aceluiași WLAN nu comunică direct (Drop / Forward-UpStream)', detail: 'Oaspeți.' },
  { topicId: '2.9', id: 'f-2.9-16', front: 'DHCP Addr. Assignment Required', back: 'Clienții cu IP static sunt respinși', detail: 'Controlează adresarea.' },
  { topicId: '2.9', id: 'f-2.9-17', front: 'DTIM Period', back: 'La câte beacon-uri se anunță traficul broadcast/multicast', detail: '1 = latență mică, consum mai mare.' },
  { topicId: '2.9', id: 'f-2.9-18', front: 'Client Band Select', back: 'Îndeamnă clienții dual-band spre 5 GHz', detail: 'Load Balancing: repartizare între AP-uri.' },
  { topicId: '2.9', id: 'f-2.9-19', front: 'Cum interpretezi „clientul se asociază dar nu primește IP”?', back: 'Interfață/VLAN greșit sau VLAN nepermis pe trunk, DHCP lipsă', detail: 'Verifică General → Interface și trunk-ul spre WLC.' },
  { topicId: '2.9', id: 'f-2.9-20', front: 'SSID ascuns (Broadcast SSID Disabled): securitate?', back: 'Nu: SSID-ul se poate afla din alte cadre', detail: 'Folosește WPA2/WPA3.' },
];
