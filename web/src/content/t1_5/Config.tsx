import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.5" title="Exemple de verificare — vezi TCP și UDP pe viu" />
      <Summary>
        <p>Topicul 1.5 este de tip <b>Compare</b>: nu configurezi TCP sau UDP — sistemul de operare le folosește automat. Poți însă <b>observa</b> socket-urile, stările conexiunilor și porturile, pe client și pe echipamentele Cisco.
          Mai jos: comenzile de pe Windows, Linux și IOS, plus filtrele Wireshark utile.</p>
      </Summary>
      <Callout kind="info" title="Despre output-urile de mai jos">
        Output-urile sunt <b>exemple ilustrative</b>, reconstruite după formatul real al comenzilor — nu au fost capturate de pe echipamente reale, iar adresele, porturile și coloanele pot diferi ușor de la o versiune de sistem/IOS la alta. Încearcă-le pe propriul calculator: <code>netstat</code> și <code>ss</code> sunt sigure și nu modifică nimic.
      </Callout>

      <Detailed title="Exemplul 1 — Windows: netstat">
        <CodeBlock title="Windows — conexiunile curente" kind="session" code={`C:\\> netstat -an

Active Connections

  Proto  Local Address          Foreign Address        State
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING
  TCP    192.168.1.10:51000     203.0.113.10:443       ESTABLISHED
  TCP    192.168.1.10:51001     203.0.113.10:443       ESTABLISHED
  TCP    192.168.1.10:51002     10.0.0.1:22            ESTABLISHED
  TCP    192.168.1.10:50990     198.51.100.7:80        TIME_WAIT
  TCP    192.168.1.10:51003     192.0.2.50:443         SYN_SENT
  UDP    0.0.0.0:5353           *:*
  UDP    192.168.1.10:137       *:*
C:\\> netstat -ano | findstr :443
  TCP    192.168.1.10:51000     203.0.113.10:443       ESTABLISHED     8124
C:\\> netstat -s -p tcp`} explain={[
          ['netstat -an', <>Toate socket-urile (<code>-a</code>), cu adrese și porturi numerice (<code>-n</code>, fără rezolvare DNS — mult mai rapid). Vezi <G id="netstat" />.</>],
          ['0.0.0.0:135 … LISTENING', 'Un serviciu local ascultă pe portul 135, pe toate interfețele (0.0.0.0). Așa arată un server care așteaptă conexiuni.'],
          ['…:51000 → 203.0.113.10:443 ESTABLISHED', <>O conexiune deschisă: port sursă <G id="ephemeral-port">efemer</G> 51000, destinație HTTPS 443. Rândul următor (51001) e alt tab spre același server.</>],
          ['TIME_WAIT', <>Conexiune pe care PC-ul a închis-o primul; așteaptă 2 × MSL (<G id="time-wait" />). Normal.</>],
          ['SYN_SENT', 'PC-ul a trimis SYN și așteaptă SYN-ACK. Dacă rămâne mult așa → serverul nu răspunde (probabil firewall).'],
          ['UDP … *:*', 'UDP nu are conexiuni și nici stări: vezi doar socket-urile pe care ascultă aplicațiile.'],
          ['netstat -ano | findstr :443', <>Adaugă PID-ul procesului (<code>-o</code>) și filtrează doar portul 443. PID-ul îl găsești apoi în Task Manager.</>],
          ['netstat -s -p tcp', 'Statistici TCP: conexiuni active/pasive, segmente trimise, segmente retransmise — util când suspectezi pierderi.'],
        ]} />
        <CodeBlock title="Windows PowerShell — testează dacă un port TCP este deschis" kind="session" code={`PS C:\\> Test-NetConnection 203.0.113.10 -Port 443

ComputerName     : 203.0.113.10
RemoteAddress    : 203.0.113.10
RemotePort       : 443
InterfaceAlias   : Wi-Fi
SourceAddress    : 192.168.1.10
TcpTestSucceeded : True`} explain={[
          ['Test-NetConnection … -Port 443', <>Încearcă un <G id="three-way-handshake" /> spre portul dat. <code>True</code> = s-a primit SYN-ACK (portul ascultă). <code>False</code> = RST sau niciun răspuns. Funcționează doar pentru TCP — pentru UDP nu există un „răspuns” garantat.</>],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Linux: ss">
        <CodeBlock title="Linux — socket-uri TCP și UDP" kind="session" code={`$ ss -tan
State      Recv-Q Send-Q  Local Address:Port    Peer Address:Port
LISTEN     0      128           0.0.0.0:22           0.0.0.0:*
ESTAB      0      0        192.168.1.20:22      192.168.1.10:51002
ESTAB      0      0        192.168.1.20:40312  203.0.113.10:443
TIME-WAIT  0      0        192.168.1.20:40298  203.0.113.10:443
$ ss -uan
State      Recv-Q Send-Q  Local Address:Port    Peer Address:Port
UNCONN     0      0           127.0.0.53%lo:53       0.0.0.0:*
UNCONN     0      0             0.0.0.0:123          0.0.0.0:*
$ ss -tulpn`} explain={[
          ['ss -tan', <>Socket-urile TCP (<code>-t</code>), toate (<code>-a</code>), numeric (<code>-n</code>). <code>ss</code> înlocuiește <code>netstat</code> pe Linux modern.</>],
          ['LISTEN … 0.0.0.0:22', 'Serverul SSH ascultă pe portul 22.'],
          ['ESTAB … :22 ↔ 192.168.1.10:51002', 'O sesiune SSH venită de la PC-ul Windows de mai sus — aceeași conexiune, văzută de la celălalt capăt (porturile inversate).'],
          ['…:40312 → 203.0.113.10:443', 'Port efemer Linux (intervalul implicit 32768–60999), nu 49152+ ca la Windows.'],
          ['ss -uan', <>Socket-urile UDP. Starea <code>UNCONN</code> („unconnected”) arată că UDP nu are conexiuni. Aici: resolver-ul DNS local (53) și <G id="ntp" /> (123).</>],
          ['ss -tulpn', 'Ce ascultă pe acest host (TCP + UDP, doar LISTEN), cu numele procesului (-p, necesită sudo pentru procesele altor utilizatori).'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Cisco IOS: conexiunile routerului">
        <p>Un router are și el o stivă TCP/IP: primește sesiuni <G id="ssh" />/<G id="telnet" />, trimite <G id="syslog" />, interoghează <G id="ntp" />, face backup prin <G id="tftp" />. Câteva comenzi îți arată ce se întâmplă la nivelul 4:</p>
        <CodeBlock title="R1 — sesiuni TCP și porturi deschise" kind="session" code={`R1# show tcp brief
TCB       Local Address               Foreign Address             (state)
6523A4FC  192.168.1.1.23              192.168.1.10.51004          ESTAB
6523B210  192.168.1.1.22              192.168.1.11.51520          ESTAB
R1# show control-plane host open-ports
Active internet connections (servers and established)
Prot        Local Address      Foreign Address        Service    State
 tcp                 *:22                  *:0     SSH-Server   LISTEN
 tcp                 *:23                  *:0         Telnet   LISTEN
 tcp                 *:23    192.168.1.10:51004         Telnet   ESTABLIS
 udp                *:123                  *:0            NTP   LISTEN
R1# telnet 192.168.1.100 80
Trying 192.168.1.100, 80 ... Open
R1# telnet 192.168.1.100 8080
Trying 192.168.1.100, 8080 ...
% Connection refused by remote host`} explain={[
          ['show tcp brief', <>Conexiunile TCP ale routerului. Atenție la format: IOS separă portul cu un <b>punct</b> (<code>192.168.1.1.23</code> = IP 192.168.1.1, port 23). Aici: o sesiune Telnet și una SSH.</>],
          ['show control-plane host open-ports', 'Porturile TCP/UDP pe care routerul ascultă (servicii active pe echipament) — util ca să verifici că, de exemplu, Telnet e într-adevăr oprit.'],
          ['telnet 192.168.1.100 80', <>„Trucul” clasic: <code>telnet</code> spre un port oarecare încearcă doar un handshake TCP. <b>Open</b> = SYN-ACK primit, serviciul ascultă.</>],
          ['% Connection refused', <>Serverul a răspuns cu <G id="rst" /> → nimic nu ascultă pe 8080. Dacă n-ar fi venit niciun răspuns (timeout), ar fi indicat un firewall.</>],
        ]} />
        <CodeBlock title="R1 — unde apare L4 în configurații (preview pentru alte topicuri)" code={`! ACL extinsă (5.6): filtrare pe protocol + port destinație
ip access-list extended WEB-DNS
 permit tcp 192.168.1.0 0.0.0.255 any eq 443
 permit udp 192.168.1.0 0.0.0.255 host 192.168.1.100 eq 53
 deny   tcp any any eq 23
!
! MSS clamping pe o interfață cu MTU mai mic (PPPoE) — peste nivelul CCNA
interface Dialer1
 ip tcp adjust-mss 1452`} explain={[
          ['permit tcp … eq 443', <>Potrivește segmente <b>TCP</b> cu portul destinație 443 (<G id="https" />). Aici apare explicit diferența TCP/UDP: trebuie să alegi protocolul corect, altfel regula nu se potrivește.</>],
          ['permit udp … eq 53', <>Interogările <G id="dns" /> pe UDP 53. (Pentru zone transfer ar trebui și <code>permit tcp … eq 53</code>.)</>],
          ['deny tcp any any eq 23', 'Blochează Telnet (TCP 23).'],
          ['ip tcp adjust-mss 1452', <>Rescrie opțiunea <G id="mss" /> din SYN-urile care trec prin interfață, ca segmentele să încapă în MTU-ul tunelului fără fragmentare.</>],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 4 — Wireshark: filtre pentru TCP și UDP">
        <p><G id="wireshark" /> îți arată fiecare câmp al header-elor. Pornește o captură pe placa ta de rețea, deschide un site și aplică filtrele:</p>
        <Table head={['Filtru', 'Ce arată']} rows={[
          [<code>tcp.flags.syn == 1 &amp;&amp; tcp.flags.ack == 0</code>, 'doar primul segment (SYN) al fiecărei conexiuni noi'],
          [<code>tcp.port == 443</code>, 'tot traficul TCP spre/de la portul 443'],
          [<code>udp.port == 53</code>, 'interogările și răspunsurile DNS'],
          [<code>tcp.flags.reset == 1</code>, 'segmentele RST (conexiuni refuzate/abandonate)'],
          [<code>tcp.analysis.retransmission</code>, 'retransmisiile detectate de Wireshark'],
          [<code>tcp.analysis.duplicate_ack</code>, 'duplicate ACK-urile (precursoare ale fast retransmit)'],
          [<code>quic</code>, 'traficul QUIC (HTTP/3) pe UDP 443'],
        ]} />
        <Callout kind="tip" title="Numere relative">
          Wireshark afișează implicit <b>numere de secvență relative</b> (ISN = 0), ca să poți urmări ușor seq/ack. Valoarea reală (aleatorie, pe 32 de biți) apare ca „Sequence Number (raw)”. Click dreapta pe o conexiune → <i>Follow → TCP Stream</i> îți arată toată conversația.
        </Callout>
      </Detailed>
    </section>
  );
}
