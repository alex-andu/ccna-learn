import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabGuidedTopology, LabSoloTopology } from '../../diagrams/t1_5';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = '1.5-g1';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.5-G" title="Lab ghidat — TCP și UDP la microscop (Packet Tracer, Simulation mode)" />
      <Summary>
        <p><b>Obiectiv:</b> construiești o rețea mică cu un server (HTTP, DNS, TFTP, FTP) și urmărești, pachet cu pachet, ce se întâmplă când un PC deschide o pagină web: întâi o interogare <G id="dns" /> pe <b>UDP</b>, apoi <G id="three-way-handshake" />-ul <b>TCP</b>, cererea HTTP și închiderea. Compari apoi <G id="tftp" /> (UDP) cu <G id="ftp" /> (TCP).
          <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat: o singură rețea, 192.168.1.0/24.">
        <LabGuidedTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă IP / mască', 'Gateway', 'DNS server']} rows={[
        ['R1 (ISR 2911 sau 1941)', 'G0/0', '192.168.1.1 / 255.255.255.0', '—', '—'],
        ['Server0', 'FastEthernet0', '192.168.1.100 / 255.255.255.0', '192.168.1.1', '192.168.1.100'],
        ['PC0', 'FastEthernet0', '192.168.1.10 / 255.255.255.0', '192.168.1.1', '192.168.1.100'],
        ['PC1', 'FastEthernet0', '192.168.1.11 / 255.255.255.0', '192.168.1.1', '192.168.1.100'],
        ['SW1 (2960)', '—', 'fără configurare', '—', '—'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu">
        Packet Tracer arată corect <b>ordinea</b> mesajelor (DNS pe UDP, apoi SYN, SYN+ACK, ACK, HTTP, FIN), porturile și flag-urile TCP, iar în <i>PDU Details</i> poți citi câmpurile header-elor. Însă stiva TCP din PT este <b>simplificată</b>: numerele de secvență pornesc de obicei de la valori mici (adesea 0, ca numerele „relative” din Wireshark), porturile efemere ale PC-urilor sunt de regulă 1025, 1026… (nu 49152+), iar window-ul, retransmisiile și congestion control-ul nu sunt modelate realist. Câmpurile exacte afișate diferă puțin între versiunile PT. Pentru valori reale, folosește la final <G id="wireshark" /> și <code>netstat</code> pe calculatorul tău.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Plasează și conectează dispozitivele">
          <p>Plasează un router <b>2911</b> (sau 1941), un switch <b>2960</b>, un <P>End Devices → Server</P> și două <b>PC</b>-uri. Redenumește-le ca în topologie. Cu <P>Connections → Copper Straight-Through</P> leagă: PC0 → SW1 <code>Fa0/1</code>, PC1 → <code>Fa0/2</code>, Server0 → <code>Fa0/3</code>, R1 <code>G0/0</code> → SW1 <code>Fa0/4</code> (sau <code>G0/1</code> al switch-ului).</p>
        </Step>
        <Step labKey={L} n={2} title="Configurează R1">
          <CodeBlock title="R1 — CLI" kind="session" code={`Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface g0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
R1# show ip interface brief`} explain={[
            ['interface g0/0 / ip address …', 'Routerul este doar un host în plus în rețea — îl folosim ca să trimitem un fișier prin TFTP.'],
            ['no shutdown', 'Interfețele routerului sunt oprite implicit.'],
            ['show ip interface brief', 'Verifică: G0/0 trebuie să fie up/up cu IP-ul 192.168.1.1.'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Adresează PC-urile și serverul">
          <p>Pe fiecare: <P>Desktop → IP Configuration → Static</P> și completează valorile din tabel (IP, mască, gateway, DNS server). Pe Server0 poți folosi și <P>Config → FastEthernet0</P> pentru IP.</p>
        </Step>
        <Step labKey={L} n={4} title="Pornește serviciile pe Server0">
          <ul>
            <li><P>Services → HTTP</P>: HTTP <b>On</b> (implicit). Pagina implicită <code>index.html</code> e suficientă.</li>
            <li><P>Services → DNS</P>: DNS Service <b>On</b>. Adaugă: Name <code>www.ccna.lab</code>, Type <code>A Record</code>, Address <code>192.168.1.100</code> → <b>Add</b>.</li>
            <li><P>Services → TFTP</P>: <b>On</b> (implicit).</li>
            <li><P>Services → FTP</P>: <b>On</b>; există implicit utilizatorul <code>cisco</code> / parola <code>cisco</code> cu toate drepturile.</li>
          </ul>
          <Reveal label="Întrebare: pe ce porturi ascultă acum serverul?"><p>HTTP: <b>TCP 80</b> · DNS: <b>UDP 53</b> (și TCP 53) · TFTP: <b>UDP 69</b> · FTP: <b>TCP 21</b> (control). Un singur IP, patru servicii — le deosebește portul (multiplexare).</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Test în Realtime mode">
          <p>Pe PC0: <P>Desktop → Web Browser</P> → <code>http://www.ccna.lab</code> → <b>Go</b>. Trebuie să apară pagina serverului. Dacă nu: verifică IP-ul DNS de pe PC0 și înregistrarea A de pe server.</p>
        </Step>
        <Step labKey={L} n={6} title="Comută în Simulation mode și setează filtrele">
          <p>Colțul din dreapta-jos → <b>Simulation</b> (sau Shift+S). În panoul Simulation: <P>Edit Filters</P> → debifează tot (<i>Show All/None</i>) și bifează doar <b>DNS</b>, <b>TCP</b>, <b>HTTP</b>. Apasă <b>Reset Simulation</b> ca să golești lista de evenimente.</p>
          <Reveal label="De ce filtrăm?"><p>Fără filtre vezi și ARP, STP, CDP etc. Pentru acest lab ne interesează doar ce se întâmplă la nivelul 4 și deasupra.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Urmărește interogarea DNS (UDP)">
          <p>Pe PC0, în Web Browser, apasă din nou <b>Go</b> pe <code>http://www.ccna.lab</code>. Apasă <b>Capture / Forward</b> (▶|) de câteva ori. Primul eveniment este de tip <b>DNS</b>. Click pe pătratul colorat din coloana <i>Info</i> → fereastra <i>PDU Information</i> → tab-ul <P>Outbound PDU Details</P>.</p>
          <ul>
            <li>Găsește secțiunea <b>UDP</b>: <code>SRC PORT</code> (un port mare, ales de PC) și <code>DEST PORT: 53</code>.</li>
            <li>Observă că header-ul UDP are doar porturi, lungime și checksum.</li>
            <li>Urmărește și răspunsul DNS de la server: porturile sunt inversate.</li>
          </ul>
          <Reveal label="Întrebare: a existat vreun handshake înainte de DNS query?"><p>Nu. UDP trimite direct întrebarea — exact de aceea DNS e rapid: o întrebare, un răspuns, 1 RTT.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Urmărește 3-way handshake-ul (TCP)">
          <p>Continuă cu ▶|. După DNS apar trei evenimente <b>TCP</b>. Deschide-le pe rând (<P>Outbound PDU Details</P> → secțiunea TCP) și completează un tabel în notițe:</p>
          <Table head={['Segment', 'De la → la', 'Flags', 'SEQ', 'ACK', 'Port sursă → destinație']} rows={[
            ['1', 'PC0 → Server0', 'SYN', '?', '?', '? → 80'],
            ['2', 'Server0 → PC0', 'SYN + ACK', '?', '?', '80 → ?'],
            ['3', 'PC0 → Server0', 'ACK', '?', '?', '? → 80'],
          ]} />
          <Reveal label="Ce ar trebui să observi"><ul>
            <li>Segmentul 1 are doar <b>SYN</b>; segmentul 2 are <b>SYN și ACK</b>; segmentul 3 doar <b>ACK</b>.</li>
            <li>Ack-ul din segmentul 2 = seq-ul din segmentul 1 + 1; ack-ul din segmentul 3 = seq-ul serverului + 1 (PT folosește de obicei numere mici, de exemplu 0 → ack 1).</li>
            <li>Portul sursă al PC0 este același în toate cele trei segmente (un singur socket client) și diferă de portul folosit la DNS.</li>
            <li>Dacă PT afișează și câmpul <code>WINDOW</code>, notează valoarea anunțată de fiecare parte.</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={9} title="Cererea HTTP și închiderea conexiunii">
          <p>Continuă. Apare <b>HTTP</b> (cererea GET, apoi răspunsul cu pagina), iar la final alte segmente TCP: <b>FIN</b> + ACK de la fiecare parte. Deschide un PDU HTTP și uită-te la tab-ul <P>OSI Model</P>: la Layer 4 scrie TCP cu porturile, la Layer 7 HTTP.</p>
          <Reveal label="Întrebare: de ce nu există un handshake separat pentru răspunsul HTTP?"><p>Conexiunea TCP este <b>full-duplex</b>: o dată deschisă, ambele părți pot trimite date pe ea. Răspunsul serverului circulă pe aceeași conexiune (aceleași două socket-uri), în sens invers.</p></Reveal>
        </Step>
        <Step labKey={L} n={10} title="TFTP — transfer de fișier pe UDP">
          <p><b>Reset Simulation</b>, apoi <P>Edit Filters</P> → doar <b>TFTP</b> și <b>UDP</b>. Pe R1:</p>
          <CodeBlock title="R1 — backup prin TFTP" kind="session" code={`R1# copy running-config tftp:
Address or name of remote host []? 192.168.1.100
Destination filename [R1-confg]?
Writing running-config....!!
[OK - 742 bytes]`} explain={[
            ['copy running-config tftp:', <>Copiază configurația curentă pe serverul <G id="tftp" /> (UDP 69). Nu cere nicio parolă — TFTP nu are autentificare.</>],
            ['[OK - … bytes]', 'Transferul a reușit. Dimensiunea diferă în funcție de configurația ta.'],
          ]} />
          <p>Urmărește evenimentele: primul pachet merge la <b>UDP 69</b>, fără SYN și fără handshake. Fiecare bloc de date primește o confirmare de la nivelul <b>aplicației</b> (TFTP ACK), nu de la UDP.</p>
          <Reveal label="Întrebare: dacă UDP nu confirmă nimic, cum știe R1 că fișierul a ajuns?"><p>Confirmările sunt ale protocolului TFTP (mesaje ACK de aplicație, câte unul pentru fiecare bloc), transportate tot în datagrame UDP. Este exemplul clasic de „fiabilitate implementată de aplicație peste UDP”.</p></Reveal>
        </Step>
        <Step labKey={L} n={11} title="FTP — transfer de fișier pe TCP">
          <p><b>Reset Simulation</b>, filtre <b>FTP</b> și <b>TCP</b>. Pe PC1: <P>Desktop → Command Prompt</P>:</p>
          <CodeBlock title="PC1 — sesiune FTP" kind="session" code={`C:\\> ftp 192.168.1.100
Trying to connect...192.168.1.100
Connected to 192.168.1.100
220- Welcome to PT Ftp server
Username:cisco
331- Username ok, need password
Password:
230- Logged in
ftp> dir
ftp> quit`} explain={[
            ['ftp 192.168.1.100', <>Deschide conexiunea de control <G id="ftp" /> spre <b>TCP 21</b> — întâi vei vedea un 3-way handshake.</>],
            ['Username / Password', 'FTP cere autentificare (în clar!) — spre deosebire de TFTP.'],
            ['dir', 'Listează fișierele (vei vedea și R1-confg, urcat prin TFTP). Listarea folosește o conexiune de date separată.'],
          ]} />
          <Reveal label="Compară TFTP cu FTP"><Table head={['', 'TFTP', 'FTP']} rows={[
            ['Transport / port', 'UDP 69', 'TCP 21 (control) + conexiune de date'],
            ['Handshake TCP', 'nu', 'da'],
            ['Autentificare', 'nu', 'da (utilizator + parolă, în clar)'],
            ['Fiabilitate', 'ACK de aplicație, bloc cu bloc', 'TCP (seq/ack, window)'],
            ['Listare directoare', 'nu', 'da'],
          ]} /></Reveal>
        </Step>
        <Step labKey={L} n={12} title="Vezi socket-urile cu netstat">
          <p>Revino în <b>Realtime</b>. Pe PC0 deschide din nou pagina web și, imediat după, în Command Prompt rulează <code>netstat</code>. Vei vedea conexiunea spre <code>192.168.1.100:80</code> cu portul sursă al PC0 și starea ei.</p>
          <Callout kind="warn">Implementarea <code>netstat</code> din Packet Tracer este limitată (opțiunile diferă de cele din Windows, iar conexiunile scurte HTTP se pot închide înainte să le vezi). Dacă nu obții nimic util, fă pasul pe calculatorul tău: deschide câteva site-uri și rulează <code>netstat -an</code> (Windows) sau <code>ss -tan</code> (Linux) — vei vedea ESTABLISHED, TIME_WAIT și porturi efemere reale.</Callout>
        </Step>
        <Step labKey={L} n={13} title="Bonus — pe calculatorul tău, cu Wireshark">
          <ul>
            <li>Pornește o captură, deschide un site HTTPS, oprește captura.</li>
            <li>Filtru <code>tcp.flags.syn == 1</code> → găsește handshake-ul; verifică regula ack = seq + 1 (numere relative).</li>
            <li>Filtru <code>udp.port == 53</code> → interogarea DNS de dinainte.</li>
            <li>Filtru <code>quic</code> → dacă site-ul folosește HTTP/3, vei vedea trafic pe UDP 443 în loc de (sau pe lângă) TCP 443.</li>
          </ul>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — rezumat și concluzii">
        <Table head={['Serviciu testat', 'Transport', 'Port server', 'Handshake?', 'Ce ai observat']} rows={[
          ['DNS (www.ccna.lab)', 'UDP', '53', 'nu', 'o interogare + un răspuns, porturile inversate'],
          ['HTTP', 'TCP', '80', 'da: SYN, SYN+ACK, ACK', 'cereri/răspunsuri pe aceeași conexiune; închidere cu FIN/ACK'],
          ['TFTP (copy running-config tftp:)', 'UDP', '69', 'nu', 'ACK-uri de aplicație, bloc cu bloc; fără parolă'],
          ['FTP (PC1)', 'TCP', '21', 'da', 'autentificare în clar; conexiune separată pentru date'],
        ]} />
        <p><b>Concluzii:</b> același server, același IP, servicii diferite → porturi diferite (multiplexare). Serviciile „de interogare” rapide (DNS) și cele simple (TFTP) folosesc UDP; sesiunile și transferurile care trebuie să fie complete (HTTP, FTP) folosesc TCP, cu handshake înainte de date și închidere la final.</p>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.5-S" title="Lab solo — ghicește transportul, apoi demonstrează-l" />
      <Summary>
        <p><b>Scenariu:</b> o firmă mică are un birou (LAN A) și o cameră de servere (LAN B), legate prin routerul R1. Serverul central oferă web, DNS, transfer de fișiere, loguri și oră exactă. Sarcina ta: <b>prezici</b> pentru fiecare serviciu protocolul de transport și portul, apoi <b>demonstrezi</b> în Simulation mode.
          Primești doar cerințele; soluția e la final.</p>
      </Summary>
      <Figure caption="Topologia țintă (creează-o tu în Packet Tracer).">
        <LabSoloTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Gateway / DNS']} rows={[
        ['R1', 'G0/0 (spre SW-A)', '192.168.10.1/24', '—'],
        ['R1', 'G0/1 (spre SW-B)', '192.168.20.1/24', '—'],
        ['PC-A', 'Fa0', '192.168.10.10/24', '192.168.10.1 / 192.168.20.100'],
        ['Laptop-A', 'Fa0', '192.168.10.11/24', '192.168.10.1 / 192.168.20.100'],
        ['SRV', 'Fa0', '192.168.20.100/24', '192.168.20.1 / 192.168.20.100'],
      ]} />
      <Detailed title="Cerințe">
        <ol>
          <li>Construiește topologia și adresarea. PC-A trebuie să poată face ping la SRV (prin R1).</li>
          <li>Pe SRV activează: <b>HTTP</b> și <b>HTTPS</b>, <b>DNS</b> (înregistrarea A <code>intranet.firma.lab</code> → 192.168.20.100), <b>FTP</b>, <b>TFTP</b>, <b>SYSLOG</b> și <b>NTP</b>.</li>
          <li>Pe R1: trimite logurile către SRV (Syslog), sincronizează ceasul de la SRV (NTP) și permite acces de la distanță prin <b>Telnet</b> (parola vty <code>cisco</code>, enable secret <code>class</code>).</li>
          <li><b>Înainte de orice test</b>, completează în notițe tabelul de predicție: pentru fiecare serviciu (DNS, HTTP, HTTPS, FTP, TFTP, Syslog, NTP, Telnet) scrie transportul (TCP/UDP) și portul destinație.</li>
          <li>Demonstrează fiecare rând în Simulation mode (cu filtre), generând traficul: browser pe PC-A (http și https), <code>ftp</code> din Command Prompt, <code>copy running-config tftp:</code> pe R1, un mesaj de log pe R1 (de exemplu <code>shutdown</code> / <code>no shutdown</code> pe o interfață nefolosită), <code>show ntp status</code> pe R1, <code>telnet 192.168.10.1</code> de pe Laptop-A.</li>
          <li>Pentru fiecare serviciu notează: a existat 3-way handshake? Care a fost portul sursă al clientului?</li>
          <li><b>Întrebări de răspuns în notițe:</b> (a) Care servicii au funcționat fără handshake și de ce sunt potrivite pentru UDP? (b) De ce ar fi o idee proastă ca Syslog să ruleze peste TCP pe un router supraîncărcat? (c) În sesiunea Telnet, care parte a ales portul efemer și care a folosit portul 23? (d) Ce ai vedea diferit dacă serverul DNS ar fi oprit (Off) — și ce ar face clientul?</li>
        </ol>
        <Callout kind="tip" title="Indicii (deschide doar dacă te blochezi)">
          <Reveal label="Indiciul 1 — filtrele din Simulation"><p><P>Edit Filters</P> are protocoalele grupate pe tab-uri (IPv4, IPv6, Misc). Alege un singur serviciu + TCP sau UDP de fiecare dată și apasă <b>Reset Simulation</b> înainte de fiecare test.</p></Reveal>
          <Reveal label="Indiciul 2 — comenzile Syslog și NTP pe R1"><p><code>logging host 192.168.20.100</code> (în unele versiuni PT: <code>logging 192.168.20.100</code>) și <code>ntp server 192.168.20.100</code>. Pe SRV, serviciile SYSLOG și NTP trebuie să fie <b>On</b>.</p></Reveal>
          <Reveal label="Indiciul 3 — HTTPS în Web Browser"><p>Scrie explicit <code>https://intranet.firma.lab</code>. Vei vedea handshake-ul TCP spre portul 443, apoi traficul criptat.</p></Reveal>
        </Callout>
        <Callout kind="info" title="Limitele Packet Tracer pentru acest lab">
          PT nu modelează retransmisiile, congestion control-ul sau QUIC/HTTP/3, iar numerele seq/ack și porturile efemere sunt simplificate. Nu toate comenzile IOS de diagnostic (de exemplu <code>show tcp brief</code> sau <code>show control-plane host open-ports</code>) există în toate versiunile PT — dacă lipsesc, folosește Simulation mode ca dovadă. Pe GNS3/CML/EVE-NG, cu imagini IOS/IOS-XE reale, comenzile din secțiunea de exemple funcționează complet, iar cu un nod Linux poți captura în Wireshark trafic real.
        </Callout>
      </Detailed>
      <Reveal label="Soluție completă (pas cu pas)">
        <h4>1. Configurația R1</h4>
        <CodeBlock title="R1" code={`hostname R1
enable secret class
!
interface GigabitEthernet0/0
 ip address 192.168.10.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/1
 ip address 192.168.20.1 255.255.255.0
 no shutdown
!
logging host 192.168.20.100
ntp server 192.168.20.100
!
line vty 0 4
 password cisco
 login
 transport input telnet
end`} explain={[
          ['interface … / ip address', 'Cele două rețele; R1 rutează automat între ele (rute conectate).'],
          ['logging host 192.168.20.100', <>Trimite mesajele de log ca datagrame <G id="syslog" /> (UDP 514) spre SRV.</>],
          ['ntp server 192.168.20.100', <>Sincronizează ceasul prin <G id="ntp" /> (UDP 123).</>],
          ['line vty 0 4 / password / login', <>Permite <G id="telnet" /> (TCP 23) cu parolă. În producție ai folosi SSH (4.8).</>],
        ]} />
        <h4>2. SRV</h4>
        <p><P>Services</P>: HTTP On + HTTPS On · DNS On, A record <code>intranet.firma.lab</code> → 192.168.20.100 · FTP On (cisco/cisco) · TFTP On · SYSLOG On · NTP On. IP static 192.168.20.100/24, gateway 192.168.20.1.</p>
        <h4>3. Tabelul de predicție — rezolvat</h4>
        <Table head={['Serviciu', 'Transport', 'Port server', 'Handshake TCP?', 'Cum l-ai generat']} hlCol={1} rows={[
          ['DNS', 'UDP', '53', 'nu', 'browser pe PC-A (rezolvarea numelui)'],
          ['HTTP', 'TCP', '80', 'da', 'http://intranet.firma.lab'],
          ['HTTPS', 'TCP', '443', 'da', 'https://intranet.firma.lab'],
          ['FTP', 'TCP', '21', 'da', 'ftp 192.168.20.100 de pe PC-A'],
          ['TFTP', 'UDP', '69', 'nu', 'copy running-config tftp: pe R1'],
          ['Syslog', 'UDP', '514', 'nu', 'shutdown/no shutdown pe o interfață de pe R1'],
          ['NTP', 'UDP', '123', 'nu', 'ntp server pe R1; verifică cu show ntp status'],
          ['Telnet', 'TCP', '23', 'da', 'telnet 192.168.10.1 de pe Laptop-A'],
        ]} />
        <h4>4. Răspunsuri la întrebări</h4>
        <ul>
          <li><b>(a)</b> DNS, TFTP, Syslog, NTP. Sunt mesaje mici, frecvente sau de tip întrebare-răspuns: un handshake ar dubla timpul, iar aplicația poate repeta singură mesajul (DNS, NTP) sau își face propriile confirmări (TFTP).</li>
          <li><b>(b)</b> TCP ar cere o conexiune deschisă permanent, buffer-e și retransmisii; dacă serverul de loguri e lent sau indisponibil, routerul ar acumula date și ar consuma resurse tocmai când are probleme. Cu UDP, logul pleacă și routerul își vede de treabă (prețul: unele mesaje se pot pierde). Pentru loguri critice există variante Syslog peste TCP/TLS — peste nivelul CCNA.</li>
          <li><b>(c)</b> Laptop-A (clientul) a ales portul efemer ca sursă; R1 (serverul Telnet) a răspuns de pe portul 23.</li>
          <li><b>(d)</b> Interogarea DNS ar pleca, dar nu ar veni niciun răspuns (sau ar veni o eroare ICMP). Clientul ar repeta interogarea după un timeout, apoi browserul ar afișa o eroare de rezolvare a numelui. Fără IP rezolvat, <b>nu ar mai porni deloc</b> handshake-ul TCP spre serverul web.</li>
        </ul>
        <Callout kind="exam" title="Legătură cu examenul">Lab-ul fixează tabelul de porturi (cel mai testat lucru din 1.5) și pregătește topicurile 4.2 (NTP), 4.3 (DHCP), 4.4 (SNMP), 4.5 (Syslog), 4.8 (SSH) și 4.9 (TFTP/FTP).</Callout>
      </Reveal>
    </section>
  );
}
