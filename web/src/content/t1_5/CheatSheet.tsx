import { Table } from '../../components/Lesson';

/** Fișă de recapitulare printabilă pentru 1.5 (o pagină A4, două coloane la print). */
export function CheatSheet15() {
  return (
    <div className="cheatsheet">
      <div className="grid c2">
        <div className="card"><h3>TCP vs UDP</h3>
          <Table head={['', 'TCP', 'UDP']} rows={[
            ['Conexiune', '3-way handshake', 'connectionless'], ['Fiabilitate', 'ACK + retransmisie', 'best effort'],
            ['Ordine', 'sequence numbers', 'nu'], ['Flow control', 'windowing (Window)', 'nu'],
            ['Congestion ctrl', 'slow start, CA…', 'nu'], ['Checksum', 'obligatoriu', 'da (opț. IPv4)'],
            ['Header', '20–60 B', '8 B'], ['Cast', 'doar unicast', 'uni/broad/multicast'],
            ['IP Protocol', '6', '17'], ['PDU', 'segment', 'datagramă'],
          ]} />
        </div>
        <div className="card"><h3>Porturi de examen</h3>
          <Table head={['TCP', 'UDP']} rows={[
            ['20/21 FTP', '53 DNS (+TCP)'], ['22 SSH/SCP/SFTP', '67/68 DHCP'], ['23 Telnet', '69 TFTP'], ['25 SMTP', '123 NTP'],
            ['49 TACACS+', '161/162 SNMP'], ['53 DNS (zone transfer)', '514 Syslog'], ['80 HTTP', '1812/1813 RADIUS'],
            ['110 POP3 · 143 IMAP', '5246/5247 CAPWAP'], ['443 HTTPS', '443 QUIC/HTTP3 (extra)'], ['3389 RDP', 'RTP (voce) — porturi dinamice'],
          ]} />
        </div>
        <div className="card"><h3>Conexiunea TCP</h3>
          <ul className="small">
            <li><b>Deschidere:</b> SYN (seq=x) → SYN+ACK (seq=y, ack=x+1) → ACK (ack=y+1).</li>
            <li><b>Închidere:</b> FIN → ACK → FIN → ACK (mijlocul poate fi FIN+ACK). Cine închide primul → TIME-WAIT (2 × MSL).</li>
            <li><b>RST</b> = închidere bruscă / port închis. Niciun răspuns la SYN = probabil firewall.</li>
            <li>SYN și FIN consumă câte 1 număr de secvență.</li>
            <li>Header: ports · seq · ack · offset · flags (CWR ECE URG ACK PSH RST SYN FIN) · window · checksum · urgent · options (MSS doar în SYN).</li>
          </ul>
        </div>
        <div className="card"><h3>Fiabilitate</h3>
          <ul className="small">
            <li><b>ack = seq + len</b> = următorul octet așteptat (cumulativ).</li>
            <li>Retransmisie: la expirarea <b>RTO</b> (dublat la fiecare încercare) sau la <b>3 duplicate ACK</b> (fast retransmit).</li>
            <li><b>Window (rwnd)</b> = flow control, protejează receptorul; 0 = stop.</li>
            <li><b>cwnd</b> = congestion control, protejează rețeaua, intern. Trimite ≤ min(rwnd, cwnd).</li>
            <li>Slow start ×2/RTT → peste ssthresh +1 MSS/RTT · 3 dup ACK → ÷2 · timeout → minim.</li>
            <li>MSS Ethernet = 1500 − 20 − 20 = <b>1460</b> (implicit 536 IPv4).</li>
          </ul>
        </div>
        <div className="card"><h3>Modele & porturi</h3>
          <ul className="small">
            <li>OSI: Physical · Data Link · Network · <b>Transport</b> · Session · Presentation · Application.</li>
            <li>TCP/IP: Application (L5–7) · Transport · Network/Internet · Data Link · Physical (RFC 1122: Link = L1+L2).</li>
            <li>PDU: date → segment → pachet → cadru → biți.</li>
            <li>Porturi: 0–1023 well-known · 1024–49151 registered · <b>49152–65535</b> ephemeral (Linux: 32768–60999).</li>
            <li>Socket = IP + protocol + port. 5-tuple = proto, IP src, port src, IP dst, port dst.</li>
            <li>Comun TCP+UDP: <b>multiplexare</b> (porturi) + checksum.</li>
          </ul>
        </div>
        <div className="card"><h3>Comenzi utile</h3>
          <ul className="small mono" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li>netstat -an · netstat -ano · netstat -s -p tcp</li>
            <li>Test-NetConnection host -Port 443</li>
            <li>ss -tan · ss -uan · ss -tulpn</li>
            <li>R1# show tcp brief · show control-plane host open-ports</li>
            <li>R1# telnet IP port (test port TCP)</li>
            <li>Wireshark: tcp.flags.syn==1 · udp.port==53 · tcp.analysis.retransmission</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
