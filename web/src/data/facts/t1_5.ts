import type { Fact } from '../flashcards';

// Fapte esențiale pentru 1.5 Compare TCP to UDP
const T = '1.5';
export const FACTS: Fact[] = [
  { topicId: T, id: 'f-1.5-01', front: 'PDU la L4 / L3 / L2 / L1', back: 'segment (datagramă la UDP) / pachet / cadru / biți', detail: 'Mnemonic: Some People Fear Birthdays' },
  { topicId: T, id: 'f-1.5-02', front: 'Pașii 3-way handshake', back: 'SYN → SYN-ACK → ACK', detail: 'SYN seq=x → SYN-ACK seq=y, ack=x+1 → ACK ack=y+1' },
  { topicId: T, id: 'f-1.5-03', front: 'Închiderea normală TCP', back: 'FIN → ACK → FIN → ACK', detail: 'Pașii din mijloc pot fi combinați (FIN+ACK). Cine închide primul intră în TIME-WAIT (2 × MSL).' },
  { topicId: T, id: 'f-1.5-04', front: 'Formula ACK', back: 'ack = seq + lungimea datelor', detail: 'ACK = următorul octet așteptat (cumulativ). SYN și FIN consumă câte 1.' },
  { topicId: T, id: 'f-1.5-05', front: 'Dimensiunea header-ului TCP / UDP', back: 'TCP 20–60 B · UDP 8 B (fix)', detail: 'Opțiunile TCP: maximum 40 B' },
  { topicId: T, id: 'f-1.5-06', front: 'Câmpurile header-ului UDP', back: 'Source Port · Destination Port · Length · Checksum', detail: '4 × 16 biți' },
  { topicId: T, id: 'f-1.5-07', front: 'Intervale de porturi (IANA, RFC 6335)', back: '0–1023 well-known · 1024–49151 registered · 49152–65535 ephemeral', detail: 'Linux folosește implicit 32768–60999 ca porturi efemere' },
  { topicId: T, id: 'f-1.5-08', front: 'Socket / 5-tuple', back: 'socket = IP + protocol + port; 5-tuple = protocol, IP src, port src, IP dst, port dst', detail: '' },
  { topicId: T, id: 'f-1.5-09', front: 'Număr de protocol IP pentru TCP / UDP', back: '6 / 17', detail: 'ICMP = 1' },
  { topicId: T, id: 'f-1.5-10', front: 'MSS pe Ethernet (IPv4)', back: '1460 B', detail: '1500 MTU − 20 IP − 20 TCP. Implicit fără opțiune: 536 B' },
  { topicId: T, id: 'f-1.5-11', front: 'Flow control vs congestion control', back: 'flow = protejează receptorul (Window/rwnd) · congestion = protejează rețeaua (cwnd)', detail: 'Fereastra efectivă = min(rwnd, cwnd)' },
  { topicId: T, id: 'f-1.5-12', front: 'Fast retransmit', back: '3 duplicate ACK-uri → retransmite imediat segmentul lipsă', detail: 'Altfel: expiră RTO → retransmisie, cwnd revine la minim' },
  { topicId: T, id: 'f-1.5-13', front: 'Singura funcție de transport comună TCP și UDP', back: 'multiplexarea prin porturi', detail: 'Plus checksum (detecție de erori) — la UDP opțional în IPv4' },
  { topicId: T, id: 'f-1.5-14', front: 'FTP vs TFTP', back: 'FTP = TCP 20/21 (cu login) · TFTP = UDP 69 (fără login)', detail: '' },
  { topicId: T, id: 'f-1.5-15', front: 'DNS — transport și port', back: 'UDP 53 (interogări) + TCP 53 (zone transfer, răspunsuri mari)', detail: '' },
  { topicId: T, id: 'f-1.5-16', front: 'DHCP — transport și porturi', back: 'UDP 67 (server) / 68 (client)', detail: 'Broadcast → nu poate fi TCP' },
  { topicId: T, id: 'f-1.5-17', front: 'SSH / Telnet / HTTP / HTTPS', back: 'TCP 22 / 23 / 80 / 443', detail: '' },
  { topicId: T, id: 'f-1.5-18', front: 'SMTP / POP3 / IMAP', back: 'TCP 25 / 110 / 143', detail: '' },
  { topicId: T, id: 'f-1.5-19', front: 'NTP / SNMP / Syslog', back: 'UDP 123 / 161 (trap 162) / 514', detail: '' },
  { topicId: T, id: 'f-1.5-20', front: 'De ce folosește vocea UDP', back: 'un pachet retransmis ar ajunge prea târziu; fără handshake, header mic', detail: 'Voce = RTP peste UDP' },
  { topicId: T, id: 'f-1.5-21', front: 'QUIC / HTTP/3', back: 'transport fiabil + TLS 1.3 peste UDP 443 (RFC 9000)', detail: 'Extra peste CCNA: la examen HTTPS = TCP 443' },
  { topicId: T, id: 'f-1.5-22', front: 'RFC-urile TCP și UDP', back: 'TCP: RFC 9293 (fost 793) · UDP: RFC 768', detail: '' },
];
