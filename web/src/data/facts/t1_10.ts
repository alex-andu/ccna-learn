import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.10 Verify IP parameters for Client OS
export const FACTS: Fact[] = [
  { topicId: '1.10', id: 'f-1.10-01', front: 'Parametrii IP de bază ai unui client', back: 'Adresă IP · mască · default gateway · server DNS', detail: 'Plus MAC și sursa (DHCP sau static).' },
  { topicId: '1.10', id: 'f-1.10-02', front: 'Cum decide hostul „local sau remote”?', back: 'AND între IP și propria mască, pentru ambele adrese; egale → local', detail: 'Hostul nu cunoaște masca destinației.' },
  { topicId: '1.10', id: 'f-1.10-03', front: 'ARP pentru o destinație remote', back: 'Se face ARP pentru gateway; IP-ul destinație rămâne cel final', detail: 'MAC = hop cu hop, IP = capăt la capăt.' },
  { topicId: '1.10', id: 'f-1.10-04', front: 'Gateway-ul trebuie să fie…', back: 'În aceeași rețea cu hostul', detail: 'Altfel hostul comunică doar local.' },
  { topicId: '1.10', id: 'f-1.10-05', front: 'DHCP pe scurt', back: 'Discover → Offer → Request → Acknowledge (DORA)', detail: 'Discover este broadcast. Detalii la 4.6.' },
  { topicId: '1.10', id: 'f-1.10-06', front: 'APIPA — semnătură', back: '169.254.0.0/16, mască /16, fără gateway și fără DNS', detail: 'DHCP a eșuat; un PC → local, toate → server DHCP/helper-address.' },
  { topicId: '1.10', id: 'f-1.10-07', front: 'Windows: IP, mască, gateway rapid', back: 'ipconfig', detail: 'Nu arată DNS, MAC sau lease.' },
  { topicId: '1.10', id: 'f-1.10-08', front: 'Windows: DNS, MAC, DHCP, lease', back: 'ipconfig /all', detail: 'MAC la „Physical Address”, cu cratime.' },
  { topicId: '1.10', id: 'f-1.10-09', front: 'ipconfig /release și /renew', back: 'Renunță la adresă / cere din nou configurația DHCP', detail: 'Folosite după repararea problemei DHCP.' },
  { topicId: '1.10', id: 'f-1.10-10', front: 'ipconfig /flushdns', back: 'Golește cache-ul DNS local', detail: '/displaydns îl afișează.' },
  { topicId: '1.10', id: 'f-1.10-11', front: 'Tabela de rutare / ARP pe Windows', back: 'route print · arp -a', detail: '0.0.0.0/0 din route print = default gateway.' },
  { topicId: '1.10', id: 'f-1.10-12', front: 'macOS — IP și mască', back: 'ifconfig en0 (mască hex: 0xffffff00 = /24)', detail: 'ipconfig getifaddr en0 = doar IP. networksetup -getinfo „Wi-Fi”.' },
  { topicId: '1.10', id: 'f-1.10-13', front: 'macOS — DNS efectiv', back: 'scutil --dns', detail: 'networksetup -getdnsservers arată doar DNS manual.' },
  { topicId: '1.10', id: 'f-1.10-14', front: 'macOS — gateway', back: 'route -n get default · netstat -rn', detail: 'Apple îl numește „Router”.' },
  { topicId: '1.10', id: 'f-1.10-15', front: 'Linux — adrese și rute', back: 'ip a (prefix /24) · ip route (default via …)', detail: 'ifconfig = depreciat (net-tools).' },
  { topicId: '1.10', id: 'f-1.10-16', front: 'Linux — ARP și DNS', back: 'ip neigh · resolvectl status', detail: '127.0.0.53 în resolv.conf = stub systemd-resolved.' },
  { topicId: '1.10', id: 'f-1.10-17', front: 'Format mască: Windows / macOS / Linux', back: 'zecimal / hex în ifconfig / /prefix', detail: 'Cisco IOS: zecimal în config, /prefix în show.' },
  { topicId: '1.10', id: 'f-1.10-18', front: 'Format MAC: Windows / macOS-Linux / Cisco', back: 'cu cratime / cu două puncte / cu puncte (xxxx.xxxx.xxxx)', detail: 'Ex.: 3C-A9-F4-12-34-56 · 3c:a9:f4:12:34:56 · 3ca9.f412.3456.' },
  { topicId: '1.10', id: 'f-1.10-19', front: 'Traseu: Windows vs rest', back: 'tracert (ICMP) · traceroute (UDP; -I = ICMP)', detail: 'Linux are și tracepath.' },
  { topicId: '1.10', id: 'f-1.10-20', front: 'Scara de ping', back: '127.0.0.1 → IP propriu → gateway → IP remote → nume', detail: '127.0.0.1 dovedește doar stiva TCP/IP.' },
  { topicId: '1.10', id: 'f-1.10-21', front: 'Ping pe IP merge, pe nume nu', back: 'DNS', detail: 'Verifică DNS Servers, nslookup, /flushdns, fișierul hosts.' },
  { topicId: '1.10', id: 'f-1.10-22', front: 'TTL inițial uzual', back: '64 Linux/macOS · 128 Windows · 255 Cisco IOS', detail: 'TTL=125 → probabil Windows la 3 hopuri.' },
];
