import type { GlossaryEntry } from '../../lib/types';

// Termeni pentru 5.10 (WLAN în GUI cu WPA2-PSK). `wlan`, `ssid`, `wlc`, `ap`, `psk`, `wpa2`, `aes`, `ccmp`, `wlan-profile`, `akm` (5.9), `pmf` sunt doar referiți.
export const TERMS: GlossaryEntry[] = [
  {
    id: 'psk-passphrase', abbr: 'Parola PSK (passphrase)', ro: 'parola rețelei WPA2-Personal',
    what: 'Șirul secret comun din WPA/WPA2-Personal: 8–63 de caractere ASCII imprimabile sau exact 64 de cifre hexazecimale.',
    how: 'Din passphrase și SSID se derivă cheia-master (PMK) prin PBKDF2. Dacă ai introdus-o ca ASCII pe WLC, clientul trebuie să o introducă identic (majuscule/minuscule contează); în format HEX, cele 64 de cifre sunt chiar PMK-ul.',
    where: 'Câmpul „PSK” din Security → Layer 2 pe WLC sau pe routerul wireless.',
    std: 'IEEE 802.11i', topics: ['5.10', '5.9'], aliases: ['passphrase', 'parola Wi-Fi'],
  },
  {
    id: 'wlan-id', abbr: 'WLAN ID', ro: 'identificatorul numeric al WLAN-ului',
    what: 'Numărul unic prin care controllerul identifică un WLAN, folosit în comenzile CLI (config wlan … 1) și în rapoarte.',
    how: 'Se alege la creare și nu se schimbă ulterior. Nu are legătură cu VLAN ID sau cu SSID: un WLAN poate avea ID 1, SSID „CORP” și să fie mapat pe VLAN 10.',
    where: 'WLANs → Create New (GUI); config wlan create <id> <profil> <ssid> (CLI).',
    topics: ['5.10', '2.9'],
  },
  {
    id: 'ssid-broadcast', abbr: 'SSID broadcast', ro: 'difuzarea numelui rețelei',
    what: 'Opțiunea care stabilește dacă AP-ul include SSID-ul în cadrele beacon, ca rețeaua să apară în lista clienților.',
    how: 'Dezactivarea („ascunderea” SSID-ului) nu este o măsură de securitate: numele reapare în cadrele de asociere și probe. Rețeaua rămâne protejată doar de WPA2/WPA3.',
    where: 'Câmpul „Broadcast SSID” din tabul General al WLAN-ului.',
    topics: ['5.10', '1.11'], aliases: ['Broadcast SSID', 'SSID cloaking'],
  },
  {
    id: 'radio-policy', abbr: 'Radio Policy', ro: 'politica de bandă radio a WLAN-ului',
    what: 'Setarea care stabilește pe ce benzi (2,4 GHz, 5 GHz, 6 GHz) este oferit un WLAN: All, doar 5 GHz, doar 2,4 GHz etc.',
    how: 'Un WLAN restricționat la 5 GHz nu poate fi văzut de clienți care suportă doar 2,4 GHz. Se folosește pentru a încuraja banda mai puțin aglomerată.',
    where: 'Tabul General al WLAN-ului (Radio Policy).',
    topics: ['5.10'],
  },
  {
    id: 'mixed-mode', abbr: 'Mixed mode (TKIP+AES)', ro: 'mod mixt de cifruri',
    what: 'Configurație în care un WLAN WPA2 acceptă atât AES (CCMP), cât și TKIP, ca să permită clienților vechi să se conecteze.',
    how: 'Cel mai slab cifru limitează rețeaua: TKIP este depreciat și poate reduce viteza. Recomandare: doar AES; dacă un client nu o suportă, înlocuiește clientul sau izolează-l pe un SSID separat.',
    where: 'WPA2 Encryption: casetele AES și TKIP din Security → Layer 2.',
    topics: ['5.10', '5.9'],
  },
  {
    id: 'wlan-status', abbr: 'WLAN Status', ro: 'starea Enabled/Disabled a WLAN-ului',
    what: 'Comutatorul care pornește sau oprește difuzarea unui WLAN fără a-i șterge configurația.',
    how: 'Un WLAN creat nou este de obicei Disabled până îl activezi (config wlan enable <id>). Simptomul „clientul nu vede SSID-ul” se datorează adesea unui WLAN rămas Disabled.',
    where: 'Tabul General; config wlan enable|disable <id>.',
    topics: ['5.10', '2.9'],
  },
];
