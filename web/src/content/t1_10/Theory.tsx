import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { DhcpVsApipa, HexMask, HostParams, LocalRemote, PingLadder } from '../../diagrams/t1_10';

/* ======================================================================
   0. Introducere — parametrii IP ai unui host și decizia local/remote
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="1.10" title="Ce trebuie să știe un host ca să comunice — imaginea de ansamblu" />
      <Summary>
        <p>Orice calculator, telefon sau server are nevoie de <b>patru parametri IP</b> ca să comunice normal: <b>adresa IP</b>, <b>masca de rețea</b>, <b>default gateway</b> și <b>serverul DNS</b>.
          Topicul 1.10 îți cere să-i <b>găsești și să-i verifici</b> pe Windows, macOS și Linux — și să recunoști când unul dintre ei e greșit.
          Cheia de înțelegere: cu IP-ul și masca, hostul decide singur dacă o destinație e <b>locală</b> (îi trimite direct) sau <b>remote</b> (o trimite gateway-ului).</p>
      </Summary>

      <Detailed>
        <p>Până acum ai văzut rețeaua din perspectiva echipamentelor Cisco. Topicul 1.10 te mută pe partea cealaltă a cablului: <b>clientul</b>. În practică, majoritatea tichetelor „nu merge internetul” se rezolvă uitându-te la configurația IP a clientului, iar la examen vei primi capturi de ecran cu <code>ipconfig /all</code>, <code>ifconfig</code> sau <code>ip addr</code> și va trebui să spui ce e în neregulă.</p>
        <Table head={['Secțiune', 'Temă', 'Întrebarea la care răspunde']} hlCol={0} rows={[
          ['1.10 · parametri', 'IP, mască, gateway, DNS (+ MAC, DHCP)', 'Ce înseamnă fiecare valoare și cum decide hostul unde trimite un pachet?'],
          ['1.10 · Windows', <><G id="ipconfig" />, route print, arp -a, <G id="netsh" />, <G id="powershell" /></>, 'Unde găsesc parametrii pe Windows și ce înseamnă fiecare linie?'],
          ['1.10 · macOS', <><G id="ifconfig" />, networksetup, ipconfig getifaddr, scutil</>, 'Cum citesc masca în hexazecimal și unde văd DNS-ul pe Mac?'],
          ['1.10 · Linux', <><G id="iproute2" /> (ip a, ip r, ip neigh), resolvectl, nmcli</>, 'Care sunt comenzile moderne și de ce nu mai folosim ifconfig?'],
          ['1.10 · comparație', 'tabel Windows ↔ macOS ↔ Linux', 'Care e echivalentul comenzii X pe celălalt sistem?'],
          ['1.10 · troubleshooting', <><G id="apipa" />, gateway greșit, mască greșită, DNS, <G id="ping" />, <G id="traceroute" /></>, 'Cum găsesc metodic parametrul greșit?'],
        ]} />
        <Callout kind="info" title="De ce începem cu „parametrii” și nu direct cu comenzile?">
          Cisco nu împarte 1.10 în sub-puncte a/b/c. Dacă înveți doar comenzile, vei ști să găsești valorile, dar nu și să spui dacă sunt <b>corecte</b>. De aceea întâi înțelegem ce face fiecare parametru și cum îl folosește hostul, apoi trecem prin cele trei sisteme de operare și încheiem cu depanarea.
        </Callout>

        <h3>Cei patru parametri (și încă doi utili)</h3>
        <Figure caption="Interactiv: alege un parametru și vezi la ce folosește. Masca desenează granița rețelei locale; gateway-ul este ușa spre restul lumii; DNS-ul traduce nume în adrese.">
          <HostParams />
        </Figure>
        <Table head={['Parametru', 'Exemplu', 'La ce folosește', 'Simptom dacă e greșit sau lipsește']} rows={[
          [<b><G id="ipv4" /> address</b>, '192.168.1.23', 'identitatea hostului la nivelul 3 — trebuie să fie unică', 'nimic nu merge; dacă e duplicată, conexiuni intermitente'],
          [<b><G id="subnet-mask" /></b>, <>255.255.255.0 = <G id="prefix-length">/24</G></>, 'separă partea de rețea de partea de host → decide local vs. remote', 'unele destinații locale sau remote devin inaccesibile, aparent „aleatoriu”'],
          [<b><G id="default-gateway" /></b>, '192.168.1.1', 'adresa routerului local căruia îi trimiți tot ce nu e în rețeaua ta', 'merge LAN-ul, nu merge nimic din alte rețele'],
          [<b><G id="dns" /> server</b>, '192.168.1.1 sau 8.8.8.8', 'traduce nume (www.cisco.com) în adrese IP', 'merge ping pe IP, nu merge niciun site după nume'],
          [<b><G id="mac" /> address</b>, '3C-A9-F4-12-34-56', 'adresa fizică a plăcii (nivelul 2); o vezi în tabelele ARP și DHCP', 'nu se configurează de obicei; utilă pentru a identifica hostul pe switch/router'],
          [<b><G id="dhcp" /> vs. static</b>, 'DHCP Enabled: Yes · lease 24 h', 'de unde au venit valorile și cât timp sunt valabile (<G id="dhcp-lease" />)', '169.254.x.x (APIPA) = DHCP a eșuat'],
        ]} />
        <p>Pe lângă IPv4, sistemele moderne au aproape întotdeauna și o adresă <G id="ipv6" />: cel puțin una <G id="link-local" /> (<code>fe80::…</code>), generată automat, și adesea una globală (<G id="gua" />). Le vei vedea în toate output-urile de mai jos; detaliile sunt în topicurile 1.8 și 1.9.</p>

        <h3>De unde vin valorile: DHCP, static sau APIPA</h3>
        <ul>
          <li><b>DHCP (dinamic)</b> — cazul obișnuit. La conectare, clientul trimite un broadcast <i>DHCPDISCOVER</i>; serverul răspunde cu o ofertă, clientul o cere, serverul confirmă (Discover → Offer → Request → Acknowledge, pe scurt „DORA”). Confirmarea conține IP-ul, masca, gateway-ul, DNS-ul și durata lease-ului. Detaliat în 4.6.</li>
          <li><b>Static (manual)</b> — scrii valorile de mână. Folosit pentru servere, imprimante și echipamente de rețea, unde adresa nu are voie să se schimbe. Nu are lease. Riscul: greșelile de tastare (mască, gateway) și conflictele de adresă.</li>
          <li><b>APIPA</b> — dacă DHCP nu răspunde, Windows (și majoritatea sistemelor) își alege singur o adresă din <code>169.254.0.0/16</code>, <b>fără gateway și fără DNS</b>. E un semn clar de problemă, nu o configurație validă.</li>
        </ul>

        <h3>Decizia care contează: destinația e locală sau remote?</h3>
        <p>Înainte să trimită orice pachet, hostul își pune o singură întrebare: <b>„este destinația în aceeași rețea cu mine?”</b>. Răspunsul îl obține cu un calcul simplu:</p>
        <ol>
          <li>Face <b>AND logic</b> (bit cu bit) între <b>propriul IP</b> și <b>propria mască</b> → obține adresa rețelei lui (de exemplu 192.168.1.0).</li>
          <li>Face AND între <b>IP-ul destinației</b> și <b>tot propria mască</b> (hostul nu cunoaște masca destinației!) → obține „rețeaua destinației, așa cum o vede el”.</li>
          <li>Dacă cele două rezultate sunt <b>egale</b> → destinația e <b>locală</b>: hostul folosește <G id="arp" /> ca să afle MAC-ul <b>destinației</b> și îi trimite cadrul direct.</li>
          <li>Dacă sunt <b>diferite</b> → destinația e <b>remote</b>: hostul folosește ARP ca să afle MAC-ul <b>gateway-ului</b> și îi trimite lui cadrul. Adresa IP destinație din pachet rămâne cea finală.</li>
        </ol>
        <Figure caption="Interactiv: schimbă hostul, masca și destinația. Observă că la o destinație remote cadrul pleacă spre MAC-ul gateway-ului, dar IP-ul destinație rămâne neschimbat. Încearcă Host B cu masca /25 — gateway-ul ajunge în altă rețea.">
          <LocalRemote />
        </Figure>
        <Analogy>Gândește-te la un bloc de apartamente. Vecinilor de pe palierul tău (rețeaua locală) le duci plicul personal, la ușă (MAC-ul lor). Pentru orice adresă din alt oraș nu pleci tu cu plicul: îl lași la oficiul poștal din colț (gateway-ul). Pe plic scrie tot adresa finală (IP-ul destinație); doar „mâna” care îl preia (MAC-ul) se schimbă. Masca este regula care îți spune ce înseamnă „palierul meu”.</Analogy>
        <Callout kind="exam" title="De ce contează pentru examen">
          Aproape toate întrebările de troubleshooting de la 1.10 se reduc la această decizie: un gateway din <b>altă rețea</b> decât hostul, o mască <b>prea mare</b> sau <b>prea mică</b>, sau un IP din subnetul greșit. Dacă știi să faci AND-ul mental, găsești greșeala în câteva secunde.
        </Callout>
      </Detailed>

      <DeepDive title="Deep dive: și hostul are o tabelă de rutare">
        <p>Decizia „local vs. remote” nu e un mecanism separat: un PC are propria <G id="routing-table" />, la fel ca un router, doar mult mai mică. După ce primește configurația IP, sistemul creează automat:</p>
        <ul>
          <li>o <b>rută conectată</b> spre propria rețea (de exemplu <code>192.168.1.0/24</code> „on-link”) — tot ce se potrivește aici se livrează direct;</li>
          <li>o <b>rută implicită</b> <code>0.0.0.0/0</code> spre default gateway — tot restul.</li>
        </ul>
        <p>Pentru fiecare pachet se alege ruta cu <b>cel mai lung prefix</b> care se potrivește (longest prefix match), exact ca pe router (topicul 3.2). De aceea /24 „bate” /0 pentru vecini. Poți vedea tabela cu <code>route print</code> (Windows), <code>netstat -rn</code> (macOS) și <code>ip route</code> (Linux).</p>
        <p><b>Două interfețe active</b> (Ethernet + Wi-Fi) înseamnă două rute implicite. Sistemul o alege pe cea cu <b>metrica</b> mai mică — de obicei Ethernetul. Asta explică de ce un laptop conectat și prin cablu, și prin Wi-Fi poate ieși pe internet „pe unde nu te aștepți”.</p>
        <p><b>Proxy ARP.</b> Pe interfețele routerelor Cisco, <code>ip proxy-arp</code> este activ implicit. Dacă un host cu mască greșită (prea scurtă) face ARP direct pentru o destinație remote, routerul poate răspunde în numele ei, iar comunicația „merge din întâmplare”. La examen, răspunsul așteptat rămâne cel logic: hostul consideră destinația locală și face ARP pentru ea.</p>
      </DeepDive>

      <Traps items={[
        <>Hostul compară rețelele folosind <b>propria mască</b>, nu masca destinației (pe care nu o cunoaște).</>,
        <>Pentru o destinație remote, ARP se face pentru <b>gateway</b>, nu pentru destinația finală. MAC-ul destinație se schimbă la fiecare hop, IP-ul destinație nu.</>,
        <>Default gateway-ul <b>trebuie</b> să fie în aceeași rețea cu hostul. Dacă nu e, hostul comunică doar local.</>,
        <><b>169.254.x.x</b> nu e o adresă „privată” utilizabilă — e semnul că DHCP a eșuat.</>,
      ]} />
      <InlineQuiz ids={['1.10-001', '1.10-002', '1.10-003', '1.10-005']} />
    </section>
  );
}

/* ======================================================================
   1.10 — Windows
   ====================================================================== */
export function Windows() {
  return (
    <section id="windows" className="section">
      <SectionHead id="windows" code="1.10 · Windows" title="Windows — ipconfig, route print, arp -a, netsh, PowerShell" />
      <Summary>
        <p>Pe Windows totul pornește de la <G id="ipconfig" />. Simplu, arată doar IP-ul, masca și gateway-ul; cu <b><code>/all</code></b> arată și <b>MAC-ul, DHCP-ul, lease-ul și serverele DNS</b>.
          <code>/release</code> + <code>/renew</code> refac DHCP, <code>/flushdns</code> golește cache-ul DNS. Pentru restul: <code>route print</code> (tabela de rutare), <code>arp -a</code> (cache ARP), <code>nslookup</code>, <code>tracert</code>.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. ipconfig (fără parametri)">
        <p>Deschide un Command Prompt (<kbd>Win</kbd> + <kbd>R</kbd> → <code>cmd</code> → Enter) sau un terminal PowerShell. Fără parametri, ipconfig afișează, pentru fiecare adaptor, adresele IPv4 și IPv6, masca și gateway-ul. Output-urile de mai jos sunt <b>exemple ilustrative</b> (valori fictive), construite după formatul documentat.</p>
        <CodeBlock title="Windows — ipconfig" kind="session" code={`C:\\> ipconfig

Windows IP Configuration


Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . : home
   Link-local IPv6 Address . . . . . : fe80::1c2b:3d4e:5f60:7182%12
   IPv4 Address. . . . . . . . . . . : 192.168.1.23
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Ethernet adapter Ethernet:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :`} explain={[
          ['Wireless LAN adapter Wi-Fi', 'Numele adaptorului. Fiecare placă (Wi-Fi, Ethernet, VPN, mașini virtuale) are blocul ei — caută-l pe cel activ.'],
          ['Connection-specific DNS Suffix', <>Sufixul de domeniu primit prin DHCP; se adaugă la numele scurte (<G id="fqdn" />).</>],
          ['Link-local IPv6 Address … %12', <>Adresa IPv6 <G id="link-local" />, generată automat. <code>%12</code> = indexul interfeței (zone ID), necesar pentru că toate interfețele au adrese fe80::.</>],
          ['IPv4 Address / Subnet Mask', <>IP-ul și masca în format zecimal cu puncte. Pe Windows masca nu apare ca /24 — trebuie s-o convertești tu.</>],
          ['Default Gateway', 'Routerul local. Dacă lipsește, hostul poate comunica doar în propria rețea.'],
          ['Media disconnected', 'Cablul nu e conectat (sau Wi-Fi-ul nu e asociat): problemă de nivel 1/2, nu de configurație IP.'],
        ]} />
        <Callout kind="warn" title="ipconfig simplu NU arată DNS-ul">
          Fără <code>/all</code> nu vezi serverele DNS, adresa MAC, serverul DHCP sau lease-ul. Este o capcană clasică: „Ce comandă arată serverele DNS pe Windows?” → <b><code>ipconfig /all</code></b>.
        </Callout>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. ipconfig /all (linie cu linie)">
        <CodeBlock title="Windows — ipconfig /all (ilustrativ)" kind="session" code={`C:\\> ipconfig /all

Windows IP Configuration

   Host Name . . . . . . . . . . . . : LAPTOP-01
   Primary Dns Suffix  . . . . . . . :
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No
   WINS Proxy Enabled. . . . . . . . : No

Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . : home
   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX201 160MHz
   Physical Address. . . . . . . . . : 3C-A9-F4-12-34-56
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Link-local IPv6 Address . . . . . : fe80::1c2b:3d4e:5f60:7182%12(Preferred)
   IPv4 Address. . . . . . . . . . . : 192.168.1.23(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : Sunday, 15 November 2026 09:12:03
   Lease Expires . . . . . . . . . . : Monday, 16 November 2026 09:12:03
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.1
                                       8.8.8.8
   NetBIOS over Tcpip. . . . . . . . : Enabled`} explain={[
          ['Host Name', 'Numele calculatorului.'],
          ['IP Routing Enabled: No', 'Hostul nu rutează între interfețele lui (nu se comportă ca un router) — normal pentru un PC.'],
          ['Description', 'Modelul plăcii de rețea — util ca să știi ce adaptor citești.'],
          ['Physical Address', <>Adresa <G id="mac" />, scrisă cu <b>cratime</b> (3C-A9-F4-…). Primii 3 octeți identifică producătorul (OUI).</>],
          ['DHCP Enabled: Yes', <>Configurația vine prin <G id="dhcp" />. „No” înseamnă adresă statică.</>],
          ['Autoconfiguration Enabled: Yes', <>Dacă DHCP eșuează, Windows își va atribui singur o adresă <G id="apipa" /> (169.254.x.x).</>],
          ['IPv4 Address … (Preferred)', '„Preferred” = adresa e validă și în uz. Un conflict de adresă poate fi marcat altfel (de exemplu „Duplicate”).'],
          ['Lease Obtained / Lease Expires', <>Perioada <G id="dhcp-lease" />. Aici 24 de ore. La o adresă statică aceste linii lipsesc.</>],
          ['DHCP Server', 'Cine a dat adresa. Acasă e de obicei routerul; în firme, un server dedicat (ajuns prin ip helper-address).'],
          ['DNS Servers', <>Serverele <G id="dns" /> folosite, în ordinea preferinței (primar, apoi secundar).</>],
        ]} />
        <Table head={['Opțiune ipconfig', 'Ce face', 'Când o folosești']} hlCol={0} rows={[
          [<code>ipconfig</code>, 'IPv4/IPv6, mască, gateway pentru fiecare adaptor', 'verificare rapidă'],
          [<code>ipconfig /all</code>, 'tot: MAC, DHCP da/nu, server DHCP, lease, DNS', 'diagnoză completă — cea mai importantă'],
          [<code>ipconfig /release</code>, 'trimite DHCPRELEASE și renunță la adresa IPv4', 'înainte de /renew, ca să pornești curat'],
          [<code>ipconfig /renew</code>, 'reînnoiește/cere din nou configurația DHCP', 'după ce ai reparat serverul, cablul sau VLAN-ul'],
          [<code>ipconfig /release6</code>, <><code>/renew6</code> — echivalentele pentru DHCPv6</>, 'rețele IPv6 cu DHCPv6'],
          [<code>ipconfig /flushdns</code>, <>golește <G id="dns-cache" /> local</>, 'după schimbarea unei înregistrări DNS sau a fișierului hosts'],
          [<code>ipconfig /displaydns</code>, 'afișează cache-ul DNS (inclusiv intrările din fișierul hosts)', 'să vezi ce adresă „crede” PC-ul că are un nume'],
          [<code>ipconfig /registerdns</code>, 'reînregistrează numele PC-ului în DNS (dynamic DNS)', 'rețele Active Directory'],
        ]} />
        <p className="small muted">Numele de adaptor care conțin spații se pun între ghilimele: <code>ipconfig /renew "Wi-Fi"</code>. Fără nume, comanda se aplică tuturor adaptoarelor.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Tabela de rutare, ARP, DNS, traseu">
        <h4>route print — tabela de rutare a PC-ului</h4>
        <CodeBlock title="Windows — route print -4 (fragment ilustrativ)" kind="session" code={`C:\\> route print -4
===========================================================================
IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0      192.168.1.1     192.168.1.23     35
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
      192.168.1.0    255.255.255.0         On-link      192.168.1.23    291
     192.168.1.23  255.255.255.255         On-link      192.168.1.23    291
    192.168.1.255  255.255.255.255         On-link      192.168.1.23    291`} explain={[
          ['0.0.0.0  0.0.0.0  192.168.1.1', <>Ruta implicită (default route): orice destinație → gateway-ul 192.168.1.1, prin interfața 192.168.1.23. Asta „înseamnă” Default Gateway din ipconfig.</>],
          ['127.0.0.0  255.0.0.0  On-link', <>Rețeaua de <G id="loopback" /> — traficul spre 127.x rămâne în PC.</>],
          ['192.168.1.0  255.255.255.0  On-link', '„On-link” = destinațiile din rețeaua locală se livrează direct (ARP pentru destinație), fără gateway.'],
          ['… 255.255.255.255', 'Rute /32 pentru propria adresă și pentru broadcast — create automat.'],
          ['Metric', 'Costul rutei. Cu mai multe rute implicite (Wi-Fi + Ethernet) câștigă metrica mai mică.'],
        ]} />
        <h4>arp -a — cache-ul ARP</h4>
        <CodeBlock title="Windows — arp -a (după ping 192.168.1.1 și ping 8.8.8.8)" kind="session" code={`C:\\> arp -a

Interface: 192.168.1.23 --- 0xc
  Internet Address      Physical Address      Type
  192.168.1.1           00-11-22-33-44-55     dynamic
  192.168.1.255         ff-ff-ff-ff-ff-ff     static
  224.0.0.22            01-00-5e-00-00-16     static`} explain={[
          ['Interface: 192.168.1.23 --- 0xc', 'Cache-ul este per interfață; 0xc = indexul interfeței în hexazecimal (12).'],
          ['192.168.1.1  00-11-22-33-44-55  dynamic', <>MAC-ul gateway-ului, învățat prin <G id="arp" /> („dynamic” = expiră după un timp).</>],
          ['ff-ff-ff-ff-ff-ff  static', 'Adresa de broadcast — permanentă, nu se învață.'],
          ['(lipsește 8.8.8.8!)', 'Deși ai dat ping la 8.8.8.8, el NU apare: e remote, iar PC-ul a făcut ARP doar pentru gateway. Dovada practică a deciziei local/remote.'],
        ]} />
        <h4>nslookup — testează DNS-ul</h4>
        <CodeBlock title="Windows — nslookup (ilustrativ; adresa răspuns este din rangul de documentație)" kind="session" code={`C:\\> nslookup www.cisco.com
Server:  router.home
Address:  192.168.1.1

Non-authoritative answer:
Name:    www.cisco.com
Address:  203.0.113.10`} explain={[
          ['Server / Address', 'Ce server DNS a răspuns — trebuie să fie cel din „DNS Servers” din ipconfig /all.'],
          ['Non-authoritative answer', 'Răspunsul vine din cache-ul unui server intermediar (aici routerul), nu de la serverul autoritar al domeniului. Normal.'],
          ['Address', <>Adresa întoarsă. Dacă primești „timed out” sau „can't find”, problema e DNS — vezi <G id="nslookup" />.</>],
        ]} />
        <h4>ping și tracert</h4>
        <CodeBlock title="Windows — ping și tracert (ilustrativ)" kind="session" code={`C:\\> ping 192.168.1.1

Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64

Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
C:\\> tracert -d 8.8.8.8

Tracing route to 8.8.8.8 over a maximum of 30 hops

  1     1 ms     1 ms     1 ms  192.168.1.1
  2     9 ms     8 ms     9 ms  100.64.0.1
  3     *        *        *     Request timed out.
  4    14 ms    13 ms    14 ms  8.8.8.8

Trace complete.`} explain={[
          ['ping 192.168.1.1', <>Trimite 4 mesaje <G id="icmp" /> Echo Request (implicit pe Windows). <code>-t</code> = continuu, <code>-n 10</code> = 10 pachete.</>],
          ['time=… TTL=64', 'Timpul dus-întors și TTL-ul rămas în răspuns. Valoarea inițială diferă între sisteme (Linux/macOS pornesc de obicei de la 64, Windows de la 128, Cisco de la 255).'],
          ['tracert -d 8.8.8.8', <><G id="traceroute" /> pe Windows: <code>-d</code> = nu traduce adresele în nume (mai rapid). Windows folosește ICMP Echo cu TTL crescător.</>],
          ['1 … 192.168.1.1', 'Primul hop este întotdeauna default gateway-ul.'],
          ['2 … 100.64.0.1', 'Al doilea hop — aici un router al ISP-ului din spațiul partajat 100.64.0.0/10 (CGNAT, vezi 1.7).'],
          ['3 * * * Request timed out.', 'Hopul nu răspunde la ICMP (filtrat). Dacă hopurile următoare răspund, nu e o problemă.'],
        ]} />
      </Detailed>

      <Detailed title="Explicația detaliată — 4. netsh, PowerShell și interfața grafică">
        <CodeBlock title="Windows — netsh interface ip show config (ilustrativ)" kind="session" code={`C:\\> netsh interface ip show config name="Wi-Fi"

Configuration for interface "Wi-Fi"
    DHCP enabled:                         Yes
    IP Address:                           192.168.1.23
    Subnet Prefix:                        192.168.1.0/24 (mask 255.255.255.0)
    Default Gateway:                      192.168.1.1
    Gateway Metric:                       0
    InterfaceMetric:                      35
    DNS servers configured through DHCP:  192.168.1.1
                                          8.8.8.8
    Register with which suffix:           Primary only`} explain={[
          ['netsh interface ip show config', <>Rezumat compact per interfață (<G id="netsh" />). Avantaj: arată și prefixul /24, și masca, plus sursa DNS-ului (DHCP sau static).</>],
          ['Subnet Prefix: 192.168.1.0/24', 'Adresa rețelei, calculată deja — util pentru verificarea gateway-ului.'],
          ['DNS servers configured through DHCP', 'Sursa DNS-ului. La configurare manuală apare „Statically Configured DNS Servers”.'],
        ]} />
        <CodeBlock title="PowerShell — echivalentele moderne (ilustrativ)" kind="session" code={`PS C:\\> Get-NetIPConfiguration -InterfaceAlias "Wi-Fi"

InterfaceAlias       : Wi-Fi
InterfaceIndex       : 12
InterfaceDescription : Intel(R) Wi-Fi 6 AX201 160MHz
NetProfile.Name      : HomeNet
IPv4Address          : 192.168.1.23
IPv6DefaultGateway   :
IPv4DefaultGateway   : 192.168.1.1
DNSServer            : 192.168.1.1
                       8.8.8.8
PS C:\\> Get-NetIPAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4 | Select-Object IPAddress, PrefixLength
PS C:\\> Get-DnsClientServerAddress -InterfaceAlias "Wi-Fi"
PS C:\\> Test-NetConnection 192.168.1.1
PS C:\\> Resolve-DnsName www.cisco.com
PS C:\\> Clear-DnsClientCache`} explain={[
          ['Get-NetIPConfiguration', <>Echivalentul <G id="powershell" /> al lui ipconfig: alias, IPv4, gateway, DNS într-un singur obiect.</>],
          ['Get-NetIPAddress … PrefixLength', 'Arată masca direct ca prefix (24), nu în zecimal cu puncte.'],
          ['Get-DnsClientServerAddress', 'Serverele DNS per interfață (IPv4 și IPv6).'],
          ['Test-NetConnection', 'Un „ping” îmbunătățit; cu -Port 443 testează și un port TCP.'],
          ['Resolve-DnsName', 'Echivalentul PowerShell al lui nslookup.'],
          ['Clear-DnsClientCache', 'Echivalentul lui ipconfig /flushdns.'],
        ]} />
        <h4>Calea din interfața grafică</h4>
        <ul>
          <li><b>Windows 10/11 — Setări:</b> <i>Settings → Network &amp; internet → Wi-Fi</i> (sau <i>Ethernet</i>) → proprietățile conexiunii. Găsești IP assignment, DNS server assignment și, mai jos, adresa IPv4, DNS-ul și Physical address (MAC). Butonul <i>Edit</i> permite trecerea pe Manual (static).</li>
          <li><b>Calea clasică, valabilă în toate versiunile:</b> <kbd>Win</kbd> + <kbd>R</kbd> → <code>ncpa.cpl</code> → click dreapta pe adaptor → <i>Status → Details…</i> (valorile curente, inclusiv lease-ul) sau <i>Properties → Internet Protocol Version 4 (TCP/IPv4) → Properties</i> (alegi DHCP sau static).</li>
        </ul>
        <p className="small muted">Denumirile exacte ale meniurilor din Setări se schimbă între versiunile Windows; <code>ncpa.cpl</code> și <code>ipconfig /all</code> rămân stabile.</p>
      </Detailed>

      <DeepDive title="Deep dive: ce se întâmplă la /release și /renew">
        <p><code>ipconfig /release</code> trimite un <b>DHCPRELEASE</b> unicast către serverul DHCP și setează adresa interfeței la 0.0.0.0. Conexiunile existente se rup imediat — nu o rula pe o sesiune remote (RDP/SSH) către acel PC!</p>
        <p><code>ipconfig /renew</code> pornește din nou DHCP: dacă clientul nu are adresă, trimite <b>DHCPDISCOVER</b> în broadcast (sursa 0.0.0.0, destinația 255.255.255.255); dacă are deja un lease, încearcă întâi să-l prelungească cu un <b>DHCPREQUEST</b>. Dacă nimeni nu răspunde și Autoconfiguration Enabled = Yes, după câteva încercări primești o adresă 169.254.x.x și Windows continuă să caute un server DHCP în fundal.</p>
        <p>De aceea, după ce repari o problemă DHCP (server pornit, VLAN corectat, <code>ip helper-address</code> adăugat), rulezi <code>/release</code> apoi <code>/renew</code> ca să nu aștepți reîncercarea automată.</p>
      </DeepDive>

      <Traps items={[
        <><code>ipconfig</code> simplu <b>nu</b> arată DNS, MAC, server DHCP sau lease → ai nevoie de <code>ipconfig /all</code>.</>,
        <>Comanda Windows este <b>tracert</b>, nu traceroute. Și folosește ICMP, nu UDP.</>,
        <>Windows scrie MAC-ul cu <b>cratime</b> (3C-A9-F4-…) și masca în <b>zecimal cu puncte</b>.</>,
        <><code>arp -a</code> arată doar vecinii <b>locali</b> (inclusiv gateway-ul) — niciodată hosturi remote.</>,
        <><code>/flushdns</code> golește cache-ul DNS; <b>nu</b> schimbă serverul DNS și nu reînnoiește adresa IP.</>,
      ]} />
      <InlineQuiz ids={['1.10-007', '1.10-011', '1.10-013', '1.10-008']} />
    </section>
  );
}

/* ======================================================================
   1.10 — macOS
   ====================================================================== */
export function MacOS() {
  return (
    <section id="macos" className="section">
      <SectionHead id="macos" code="1.10 · macOS" title="macOS — ifconfig (mască hex), networksetup, ipconfig getifaddr, scutil" />
      <Summary>
        <p>macOS este un Unix: folosește <G id="ifconfig" />, unde <b>masca apare în hexazecimal</b> (<code>netmask 0xffffff00</code> = 255.255.255.0 = /24).
          Pentru un rezumat „ca în Setări”: <code>networksetup -getinfo "Wi-Fi"</code>. Gateway-ul: <code>route get default</code> sau <code>netstat -rn</code>. DNS-ul: <code>scutil --dns</code>.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. ifconfig en0">
        <p>Deschide <i>Terminal</i> (Spotlight → „Terminal”). Interfețele au nume scurte: <code>lo0</code> (loopback), <code>en0</code>, <code>en1</code>… Pe laptopurile fără port Ethernet, <code>en0</code> este de obicei Wi-Fi-ul, dar numerotarea diferă de la model la model — o verifici cu <code>networksetup -listallhardwareports</code>.</p>
        <CodeBlock title="macOS — ifconfig en0 (ilustrativ)" kind="session" code={`$ ifconfig en0
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=6460<TSO4,TSO6,CHANNEL_IO,PARTIAL_CSUM,ZEROINVERT_CSUM>
	ether a4:83:e7:12:34:56
	inet6 fe80::10c4:2a1b:9e0f:3c21%en0 prefixlen 64 secured scopeid 0xb
	inet 192.168.1.42 netmask 0xffffff00 broadcast 192.168.1.255
	nd6 options=201<PERFORMNUD,DAD>
	media: autoselect
	status: active`} explain={[
          ['flags=8863<UP,…,RUNNING,…>', 'UP = interfața e activată administrativ; RUNNING = are legătură. Lipsa lui RUNNING = cablu/Wi-Fi deconectat.'],
          ['mtu 1500', 'Dimensiunea maximă a pachetului IP pe Ethernet/Wi-Fi.'],
          ['ether a4:83:e7:12:34:56', <>Adresa <G id="mac" />, cu <b>două puncte</b> și litere mici. Atenție: macOS și iOS pot folosi adrese MAC private (aleatorii) per rețea Wi-Fi.</>],
          ['inet6 fe80::… prefixlen 64', 'Adresa IPv6 link-local; aici prefixul IPv6 este dat ca prefixlen.'],
          ['inet 192.168.1.42', 'Adresa IPv4.'],
          ['netmask 0xffffff00', <>Masca în <b>hexazecimal</b>: ff.ff.ff.00 = 255.255.255.0 = /24. Vezi decodorul de mai jos.</>],
          ['broadcast 192.168.1.255', <>Adresa de broadcast a rețelei — confirmă indirect masca (/24 → .255).</>],
          ['status: active', 'Legătura fizică e activă. „inactive” = deconectat.'],
        ]} />
        <h3>Cum citești masca hexazecimală</h3>
        <p>Fiecare cifră hex reprezintă exact <b>4 biți</b>, deci fiecare <b>pereche</b> reprezintă un octet. Ajunge să știi câteva valori: <code>f</code> = 1111, <code>e</code> = 1110, <code>c</code> = 1100, <code>8</code> = 1000, <code>0</code> = 0000. Așa: <code>ff</code> = 255, <code>fe</code> = 254, <code>fc</code> = 252, <code>f8</code> = 248, <code>f0</code> = 240, <code>e0</code> = 224, <code>c0</code> = 192, <code>80</code> = 128.</p>
        <Figure caption="Interactiv: alege sau scrie o mască hexazecimală. Fiecare pereche devine un octet; numărul total de biți 1 este prefixul.">
          <HexMask />
        </Figure>
        <Table head={['Hex (ifconfig)', 'Zecimal', 'Prefix', 'Hosturi utilizabile']} hlCol={0} rows={[
          ['0xff000000', '255.0.0.0', '/8', '16.777.214'],
          ['0xffff0000', '255.255.0.0', '/16', '65.534'],
          ['0xfffffe00', '255.255.254.0', '/23', '510'],
          ['0xffffff00', '255.255.255.0', '/24', '254'],
          ['0xffffff80', '255.255.255.128', '/25', '126'],
          ['0xffffffc0', '255.255.255.192', '/26', '62'],
          ['0xfffffff0', '255.255.255.240', '/28', '14'],
          ['0xfffffffc', '255.255.255.252', '/30', '2'],
        ]} />
      </Detailed>

      <Detailed title="Explicația detaliată — 2. networksetup și ipconfig (varianta Apple)">
        <CodeBlock title="macOS — networksetup (ilustrativ)" kind="session" code={`$ networksetup -listallhardwareports

Hardware Port: Wi-Fi
Device: en0
Ethernet Address: a4:83:e7:12:34:56

Hardware Port: Thunderbolt Bridge
Device: bridge0
Ethernet Address: 36:12:a0:00:00:01
$ networksetup -getinfo "Wi-Fi"
DHCP Configuration
IP address: 192.168.1.42
Subnet mask: 255.255.255.0
Router: 192.168.1.1
Client ID:
IPv6: Automatic
IPv6 IP address: none
IPv6 Router: none
Wi-Fi ID: a4:83:e7:12:34:56
$ networksetup -getdnsservers "Wi-Fi"
There aren't any DNS Servers set on Wi-Fi.`} explain={[
          ['networksetup -listallhardwareports', 'Leagă numele din Setări (Wi-Fi, Thunderbolt Ethernet) de numele tehnic (en0, en1) și arată MAC-ul fiecăruia.'],
          ['networksetup -getinfo "Wi-Fi"', <>Rezumatul cel mai „citibil”: sursa (<b>DHCP Configuration</b> sau Manual Configuration), IP, masca în <b>zecimal</b>, Router = default gateway.</>],
          ['Router: 192.168.1.1', 'Apple numește default gateway-ul „Router”, inclusiv în interfața grafică.'],
          ['-getdnsservers … There aren\'t any DNS Servers set', <>Capcană: comanda arată doar serverele DNS <b>setate manual</b>. Cele primite prin DHCP se văd cu <code>scutil --dns</code>.</>],
        ]} />
        <CodeBlock title="macOS — ipconfig (al lui Apple, nu cel din Windows)" kind="session" code={`$ ipconfig getifaddr en0
192.168.1.42
$ ipconfig getoption en0 router
192.168.1.1
$ ipconfig getpacket en0
op = BOOTREPLY
yiaddr = 192.168.1.42
lease_time (uint32): 0x15180
subnet_mask (ip): 255.255.255.0
router (ip_mult): {192.168.1.1}
domain_name_server (ip_mult): {192.168.1.1, 8.8.8.8}
server_identifier (ip): 192.168.1.1
$ sudo ipconfig set en0 DHCP`} explain={[
          ['ipconfig getifaddr en0', 'Afișează doar adresa IPv4 a interfeței — ideal în scripturi.'],
          ['ipconfig getoption en0 router', 'O singură opțiune DHCP primită (aici gateway-ul); funcționează și cu subnet_mask, domain_name_server.'],
          ['ipconfig getpacket en0', 'Ultimul pachet DHCP (ACK) primit: adresa (yiaddr), lease-ul (0x15180 = 86400 s = 24 h), masca, routerul, DNS-urile, serverul DHCP.'],
          ['sudo ipconfig set en0 DHCP', 'Cere din nou configurația prin DHCP — echivalentul lui /release + /renew. Necesită sudo.'],
        ]} />
        <p className="small muted">Numele câmpurilor din <code>getpacket</code> pot varia ușor între versiunile macOS. Esențial e să recunoști informațiile: adresa, masca, routerul, DNS-ul, lease-ul.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Gateway, DNS, ARP pe macOS">
        <CodeBlock title="macOS — route, netstat, scutil, arp (ilustrativ)" kind="session" code={`$ route -n get default
   route to: default
destination: default
       mask: default
    gateway: 192.168.1.1
  interface: en0
      flags: <UP,GATEWAY,DONE,STATIC,PRCLONING,GLOBAL>
$ netstat -rn -f inet
Routing tables

Internet:
Destination        Gateway            Flags               Netif Expire
default            192.168.1.1        UGScg                 en0
127                127.0.0.1          UCS                   lo0
192.168.1          link#11            UCS                   en0      !
192.168.1.1        0:11:22:33:44:55   UHLWIir               en0   1180
$ scutil --dns
DNS configuration

resolver #1
  search domain[0] : home
  nameserver[0] : 192.168.1.1
  nameserver[1] : 8.8.8.8
  if_index : 11 (en0)
  flags    : Request A records, Request AAAA records
$ arp -a
? (192.168.1.1) at 0:11:22:33:44:55 on en0 ifscope [ethernet]`} explain={[
          ['route -n get default', 'Răspunsul direct la „care e gateway-ul?”: gateway 192.168.1.1, pe interfața en0.'],
          ['netstat -rn -f inet', 'Tabela de rutare IPv4 (-r = rute, -n = fără nume, -f inet = doar IPv4).'],
          ['default  192.168.1.1  UGScg  en0', 'Ruta implicită. U = up, G = prin gateway, S = statică (adăugată la configurare).'],
          ['192.168.1  link#11', 'Rețeaua locală, livrată direct pe legătură (fără gateway). macOS scrie prefixul scurtat (192.168.1 = 192.168.1.0/24).'],
          ['scutil --dns → nameserver[0]', <>Serverele DNS efectiv folosite (inclusiv cele din DHCP). Pe macOS, <code>/etc/resolv.conf</code> e doar informativ și nu e folosit de toate aplicațiile.</>],
          ['arp -a', <>Cache-ul ARP; macOS omite zerourile de la început din MAC (0:11:22… în loc de 00:11:22…).</>],
        ]} />
        <ul>
          <li><b>Traseu:</b> <code>traceroute 8.8.8.8</code> — implicit cu <b>UDP</b>; <code>traceroute -I</code> folosește ICMP (ca tracert din Windows).</li>
          <li><b>Ping:</b> <code>ping 192.168.1.1</code> rulează <b>continuu</b> până la <kbd>Ctrl</kbd>+<kbd>C</kbd>; <code>ping -c 4</code> trimite 4 pachete.</li>
          <li><b>Cache DNS:</b> <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code>.</li>
          <li><b>Interfața grafică:</b> <i>System Settings → Network → Wi-Fi → Details…</i> → tab-urile <i>TCP/IP</i> (IP, Subnet Mask, Router, buton <i>Renew DHCP Lease</i>), <i>DNS</i> și <i>Hardware</i> (MAC). Scurtătură: <kbd>Option</kbd> + click pe iconița Wi-Fi arată IP-ul și routerul.</li>
        </ul>
      </Detailed>

      <Traps items={[
        <>Masca în <code>ifconfig</code> pe macOS e <b>hex</b>: <code>0xffffff00</code> = /24, <code>0xfffffe00</code> = /23, <code>0xffffffc0</code> = /26.</>,
        <>Pe macOS există și <code>ipconfig</code>, dar cu altă sintaxă: <code>ipconfig getifaddr en0</code>. <code>ipconfig /all</code> nu există pe Mac.</>,
        <><code>networksetup -getdnsservers</code> arată doar DNS-urile <b>manuale</b>; pentru cele din DHCP folosește <code>scutil --dns</code>.</>,
        <>Apple numește default gateway-ul <b>„Router”</b>.</>,
      ]} />
      <InlineQuiz ids={['1.10-017', '1.10-018', '1.10-021', '1.10-020']} />
    </section>
  );
}

/* ======================================================================
   1.10 — Linux
   ====================================================================== */
export function Linux() {
  return (
    <section id="linux" className="section">
      <SectionHead id="linux" code="1.10 · Linux" title="Linux — ip addr, ip route, ip neigh, resolvectl, nmcli" />
      <Summary>
        <p>Pe Linux modern se folosește comanda <b><code>ip</code></b> din <G id="iproute2" />: <code>ip a</code> (adrese, masca ca <b>/prefix</b>), <code>ip r</code> (rute → gateway-ul e linia <code>default via</code>), <code>ip neigh</code> (cache ARP).
          DNS-ul: <code>resolvectl status</code> sau <code>/etc/resolv.conf</code>. Vechiul <code>ifconfig</code> (<G id="net-tools" />) este depreciat și adesea nici nu e instalat.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Laboratorul tău: Raspberry Pi-ul">
        <Callout kind="tip" title="Ai deja un Linux: Raspberry Pi 4 pe care rulează această aplicație">
          Toate comenzile din această secțiune le poți rula direct pe RPi. Conectează-te din terminalul desktopului (<code>ssh utilizator@ip-ul-pi-ului</code>) sau lucrează pe Pi cu tastatură și monitor. Comanda <code>hostname -I</code> îți arată rapid toate adresele IP ale Pi-ului. Pe Raspberry Pi OS interfețele se numesc clasic <code>eth0</code> (cablu) și <code>wlan0</code> (Wi-Fi); pe alte distribuții vei vedea nume „predictibile”, de exemplu <code>enp0s3</code> sau <code>wlp2s0</code>.
        </Callout>
        <p className="small muted">Output-urile de mai jos folosesc numele <code>enp0s3</code> (tipic pentru o mașină virtuală) și valori fictive. Pe Pi, înlocuiește cu <code>eth0</code> sau <code>wlan0</code>.</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 2. ip addr — adrese și MAC">
        <CodeBlock title="Linux — ip addr show (ilustrativ)" kind="session" code={`$ ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.50/24 brd 192.168.1.255 scope global dynamic noprefixroute enp0s3
       valid_lft 86234sec preferred_lft 86234sec
    inet6 fe80::a00:27ff:feab:cdef/64 scope link
       valid_lft forever preferred_lft forever
$ ip -br a
lo               UNKNOWN        127.0.0.1/8 ::1/128
enp0s3           UP             192.168.1.50/24 fe80::a00:27ff:feab:cdef/64`} explain={[
          ['1: lo', <>Interfața de <G id="loopback" /> (127.0.0.1/8) — există pe orice sistem.</>],
          ['<BROADCAST,MULTICAST,UP,LOWER_UP>', 'UP = activată administrativ; LOWER_UP = legătura fizică e prezentă (cablu conectat / Wi-Fi asociat). Fără LOWER_UP = problemă de nivel 1.'],
          ['state UP', 'Starea operațională a interfeței. „DOWN” = interfață oprită sau fără legătură.'],
          ['link/ether 08:00:27:ab:cd:ef', <>Adresa <G id="mac" /> (cu două puncte, litere mici). <code>brd ff:ff:…</code> = broadcast-ul de nivel 2.</>],
          ['inet 192.168.1.50/24', <>IP-ul și masca în notație <G id="cidr" /> (/24). Linux nu afișează masca în zecimal cu puncte în <code>ip</code>.</>],
          ['brd 192.168.1.255', 'Adresa de broadcast a rețelei.'],
          ['scope global dynamic', <><b>dynamic</b> = adresa a venit prin DHCP (are lease). O adresă statică nu are cuvântul „dynamic”.</>],
          ['valid_lft 86234sec', <>Cât mai e valabil lease-ul DHCP (în secunde) — aici aproape 24 de ore (<G id="dhcp-lease" />).</>],
          ['inet6 fe80::…/64 scope link', 'Adresa IPv6 link-local (aici derivată din MAC prin EUI-64 — observă ff:fe la mijloc).'],
          ['ip -br a', 'Vedere „brief”: o linie per interfață — cea mai rapidă privire de ansamblu.'],
        ]} />
      </Detailed>

      <Detailed title="Explicația detaliată — 3. ip route, ip neigh — gateway și ARP">
        <CodeBlock title="Linux — ip route / ip route get / ip neigh (ilustrativ)" kind="session" code={`$ ip route
default via 192.168.1.1 dev enp0s3 proto dhcp src 192.168.1.50 metric 100
192.168.1.0/24 dev enp0s3 proto kernel scope link src 192.168.1.50 metric 100
$ ip route get 8.8.8.8
8.8.8.8 via 192.168.1.1 dev enp0s3 src 192.168.1.50 uid 1000
    cache
$ ip route get 192.168.1.77
192.168.1.77 dev enp0s3 src 192.168.1.50 uid 1000
    cache
$ ip neigh
192.168.1.1 dev enp0s3 lladdr 00:11:22:33:44:55 REACHABLE
192.168.1.77 dev enp0s3 FAILED`} explain={[
          ['default via 192.168.1.1', <><b>Default gateway-ul</b>: ruta implicită trece prin 192.168.1.1. <code>proto dhcp</code> = a fost primită prin DHCP.</>],
          ['192.168.1.0/24 dev enp0s3 … scope link', 'Ruta conectată: rețeaua locală se livrează direct pe interfață, fără gateway.'],
          ['ip route get 8.8.8.8 → via 192.168.1.1', <>Linux îți spune <b>exact decizia</b> pentru o destinație: <i>via</i> = remote, prin gateway.</>],
          ['ip route get 192.168.1.77 → (fără via)', 'Destinație locală: se trimite direct pe enp0s3, cu ARP pentru 192.168.1.77.'],
          ['ip neigh … REACHABLE', <>Cache-ul ARP (<G id="arp" />): MAC-ul gateway-ului (lladdr), confirmat recent.</>],
          ['… FAILED', 'ARP fără răspuns: hostul local 192.168.1.77 nu există sau e oprit. Alte stări: STALE (neconfirmat recent), DELAY/PROBE (în verificare), INCOMPLETE (cerere ARP în curs).'],
        ]} />
      </Detailed>

      <Detailed title="Explicația detaliată — 4. DNS și NetworkManager">
        <CodeBlock title="Linux — resolvectl și /etc/resolv.conf (ilustrativ, Ubuntu cu systemd-resolved)" kind="session" code={`$ resolvectl status
Global
       Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
resolv.conf mode: stub

Link 2 (enp0s3)
    Current Scopes: DNS
         Protocols: +DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 192.168.1.1
       DNS Servers: 192.168.1.1 8.8.8.8
        DNS Domain: home
$ cat /etc/resolv.conf
nameserver 127.0.0.53
options edns0 trust-ad
search home`} explain={[
          ['resolvectl status', <>Serverele DNS reale, per interfață, gestionate de <G id="systemd-resolved" />.</>],
          ['Current DNS Server', 'Serverul folosit acum. DNS Servers = lista completă primită (de obicei prin DHCP).'],
          ['nameserver 127.0.0.53', <>Nu e o greșeală: e „stub”-ul local al systemd-resolved. Aplicațiile îl întreabă pe el, iar el întreabă serverele reale. Pentru serverele reale → <code>resolvectl status</code>.</>],
          ['search home', 'Domeniul adăugat automat la numele scurte.'],
        ]} />
        <p>Nu toate distribuțiile folosesc systemd-resolved. Pe <b>Raspberry Pi OS</b>, de exemplu, <code>/etc/resolv.conf</code> conține de obicei direct serverele DNS (de exemplu <code>nameserver 192.168.1.1</code>), iar <code>resolvectl</code> poate să nu existe. Regula practică: <b>citește întâi <code>/etc/resolv.conf</code></b>; dacă vezi 127.0.0.53, mergi la <code>resolvectl status</code>.</p>
        <CodeBlock title="Linux — nmcli (NetworkManager, ilustrativ)" kind="session" code={`$ nmcli device status
DEVICE   TYPE      STATE      CONNECTION
enp0s3   ethernet  connected  Wired connection 1
lo       loopback  unmanaged  --
$ nmcli device show enp0s3
GENERAL.DEVICE:                         enp0s3
GENERAL.TYPE:                           ethernet
GENERAL.HWADDR:                         08:00:27:AB:CD:EF
GENERAL.MTU:                            1500
GENERAL.STATE:                          100 (connected)
GENERAL.CONNECTION:                     Wired connection 1
IP4.ADDRESS[1]:                         192.168.1.50/24
IP4.GATEWAY:                            192.168.1.1
IP4.ROUTE[1]:                           dst = 192.168.1.0/24, nh = 0.0.0.0, mt = 100
IP4.DNS[1]:                             192.168.1.1
IP4.DNS[2]:                             8.8.8.8
IP4.DOMAIN[1]:                          home`} explain={[
          ['nmcli device status', <>Ce interfețe gestionează <G id="networkmanager" /> și ce profil (connection) e activ pe fiecare.</>],
          ['nmcli device show enp0s3', 'Totul despre o interfață, într-un singur loc — echivalentul Linux al lui ipconfig /all.'],
          ['GENERAL.HWADDR', 'MAC-ul.'],
          ['IP4.ADDRESS[1] / IP4.GATEWAY', 'IP-ul cu prefixul și default gateway-ul.'],
          ['IP4.DNS[1], IP4.DNS[2]', 'Serverele DNS, în ordine.'],
        ]} />
      </Detailed>

      <Detailed title="Explicația detaliată — 5. De la net-tools la iproute2 (tabel de echivalențe)">
        <p>Vei întâlni încă <code>ifconfig</code>, <code>route -n</code> și <code>arp -n</code> în tutoriale vechi. Pe un Linux nou, dacă primești <code>ifconfig: command not found</code>, nu e nimic stricat — pachetul <G id="net-tools" /> pur și simplu nu mai e instalat implicit.</p>
        <Table head={['Scop', 'Vechi (net-tools, depreciat)', 'Modern (iproute2 / systemd)']} rows={[
          ['adrese IP, MAC', <code>ifconfig</code>, <><code>ip addr</code> / <code>ip a</code> · <code>ip link</code></>],
          ['tabela de rutare / gateway', <><code>route -n</code> · <code>netstat -rn</code></>, <code>ip route</code>],
          ['cache ARP', <code>arp -n</code>, <code>ip neigh</code>],
          ['socket-uri / porturi deschise', <code>netstat -tulpn</code>, <code>ss -tulpn</code>],
          ['DNS', <code>cat /etc/resolv.conf</code>, <><code>resolvectl status</code> (dacă e folosit systemd-resolved)</>],
          ['traseu', <code>traceroute</code>, <><code>traceroute</code> · <code>tracepath</code> (fără root, descoperă și MTU-ul)</>],
        ]} />
        <CodeBlock title="Linux — ifconfig vechi, pentru comparație (ilustrativ)" kind="session" code={`$ ifconfig enp0s3
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.50  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 08:00:27:ab:cd:ef  txqueuelen 1000  (Ethernet)`} explain={[
          ['netmask 255.255.255.0', 'Pe Linux, ifconfig afișează masca în zecimal (nu în hex ca pe macOS).'],
        ]} />
        <p className="small muted">Comenzile <code>ip addr add …</code> și <code>ip route add …</code> modifică configurația <b>doar până la restart</b>. Configurația permanentă se face prin NetworkManager (<code>nmcli</code>), netplan (Ubuntu Server) sau fișierele distribuției — vezi exemplele de configurare.</p>
      </Detailed>

      <DeepDive title="Deep dive: de ce a fost înlocuit ifconfig">
        <p>Pachetul net-tools vine din anii '80–'90 și folosește interfețe mai vechi ale kernelului (ioctl). Rețelistica Linux a evoluat: mai multe adrese pe aceeași interfață, mai multe tabele de rutare (policy routing), namespace-uri de rețea (folosite de containere — topicul 1.12), VRF-uri. iproute2 vorbește cu kernelul prin <b>Netlink</b> și înțelege toate acestea. Exemplu concret: ifconfig ascunde adresele secundare adăugate cu <code>ip addr add</code>, pe când <code>ip a</code> le arată pe toate.</p>
        <p>Pe Linux există și <code>tracepath</code>, care nu cere drepturi de root și raportează și <b>Path MTU</b>, iar <code>mtr</code> combină ping și traceroute într-o vedere continuă.</p>
      </DeepDive>

      <Traps items={[
        <><code>ip a</code> arată masca ca <b>/prefix</b> (192.168.1.50/24), nu în zecimal.</>,
        <>Gateway-ul pe Linux = linia <code>default via …</code> din <code>ip route</code>.</>,
        <><code>nameserver 127.0.0.53</code> în <code>/etc/resolv.conf</code> = stub-ul local systemd-resolved, nu un DNS greșit.</>,
        <>Cuvântul <b>dynamic</b> în <code>ip a</code> = adresă primită prin DHCP; <code>valid_lft</code> = timpul rămas din lease.</>,
        <><code>ifconfig</code> pe Linux = depreciat (net-tools); echivalentul modern e <code>ip addr</code>.</>,
      ]} />
      <InlineQuiz ids={['1.10-023', '1.10-026', '1.10-029', '1.10-024']} />
    </section>
  );
}

/* ======================================================================
   1.10 — comparație
   ====================================================================== */
export function Compare() {
  return (
    <section id="compare" className="section">
      <SectionHead id="compare" code="1.10 · comparație" title="Windows ↔ macOS ↔ Linux — aceeași întrebare, trei comenzi" />
      <Summary>
        <p>Informațiile sunt aceleași pe toate sistemele; diferă doar <b>comanda</b> și <b>formatul</b>. Reține trei diferențe de format: masca (<b>zecimal</b> pe Windows, <b>hex</b> în ifconfig pe macOS, <b>/prefix</b> pe Linux), MAC-ul (<b>cratime</b> pe Windows, <b>două puncte</b> pe macOS/Linux) și traseul (<b>tracert</b> pe Windows, <b>traceroute</b> în rest).</p>
      </Summary>
      <Detailed title="Tabelul de echivalențe">
        <Table head={['Vreau să văd…', 'Windows', 'macOS', 'Linux']} hlCol={0} rows={[
          ['IP + mască', <code>ipconfig</code>, <><code>ifconfig en0</code> (mască hex) · <code>ipconfig getifaddr en0</code></>, <><code>ip a</code> (/prefix) · <code>ip -br a</code></>],
          ['tot (IP, GW, DNS, MAC, DHCP)', <code>ipconfig /all</code>, <><code>networksetup -getinfo "Wi-Fi"</code> · <code>ipconfig getpacket en0</code></>, <code>nmcli device show</code>],
          ['default gateway', <><code>ipconfig</code> · <code>route print</code></>, <><code>route -n get default</code> · <code>netstat -rn</code></>, <code>ip route</code>],
          ['servere DNS', <><code>ipconfig /all</code> · <code>Get-DnsClientServerAddress</code></>, <code>scutil --dns</code>, <><code>resolvectl status</code> · <code>/etc/resolv.conf</code></>],
          ['adresa MAC', <>ipconfig /all (Physical Address)</>, <>ifconfig (ether)</>, <>ip link / ip a (link/ether)</>],
          ['cache ARP', <code>arp -a</code>, <code>arp -a</code>, <code>ip neigh</code>],
          ['reînnoire DHCP', <><code>ipconfig /release</code> + <code>/renew</code></>, <code>sudo ipconfig set en0 DHCP</code>, <><code>sudo nmcli connection up "&lt;profil&gt;"</code></>],
          ['golire cache DNS', <code>ipconfig /flushdns</code>, <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code>, <code>resolvectl flush-caches</code>],
          ['testare DNS', <><code>nslookup</code> · <code>Resolve-DnsName</code></>, <><code>nslookup</code> · <code>dig</code></>, <><code>nslookup</code> · <code>dig</code> · <code>resolvectl query</code></>],
          ['traseu', <><code>tracert</code> (ICMP)</>, <><code>traceroute</code> (UDP; -I = ICMP)</>, <><code>traceroute</code> (UDP) · <code>tracepath</code></>],
          ['ping implicit', '4 pachete (-t = continuu)', 'continuu (-c 4 = 4 pachete)', 'continuu (-c 4 = 4 pachete)'],
        ]} />
        <h3>Formatele care te pot încurca</h3>
        <Table head={['Element', 'Windows', 'macOS', 'Linux', 'Cisco IOS (pentru comparație)']} rows={[
          ['masca', '255.255.255.0', <>0xffffff00 (ifconfig) / 255.255.255.0 (networksetup)</>, '/24', '255.255.255.0 (config) · /24 (show)'],
          ['MAC', '3C-A9-F4-12-34-56', 'a4:83:e7:12:34:56', '08:00:27:ab:cd:ef', '3ca9.f412.3456'],
          ['gateway numit', 'Default Gateway', 'Router', 'default via', 'ip default-gateway / ruta 0.0.0.0/0'],
          ['IPv6 link-local', 'fe80::…%12', 'fe80::…%en0', 'fe80::…/64 scope link', 'FE80::… (show ipv6 int brief)'],
        ]} />
        <Analogy>E ca și cum ai cere „ora exactă” în trei limbi: răspunsul (ora) este același, doar cuvintele diferă. Odată ce știi ce cauți (IP, mască, gateway, DNS, MAC, sursa DHCP), comanda devine un detaliu de vocabular.</Analogy>
      </Detailed>
      <DeepDive title="Deep dive: indicii despre sistemul de operare din TTL">
        <p>Fiecare sistem pornește pachetele cu un <b>TTL inițial</b> implicit, iar fiecare router îl scade cu 1. Valorile uzuale: <b>64</b> (Linux, macOS), <b>128</b> (Windows), <b>255</b> (Cisco IOS și multe echipamente de rețea). Dacă primești <code>TTL=125</code> într-un ping, probabil răspunde un Windows aflat la 3 hopuri. E doar un indiciu (valorile pot fi schimbate), dar ajută la interpretarea output-urilor.</p>
      </DeepDive>
      <Traps items={[
        <><b>tracert</b> = Windows · <b>traceroute</b> = macOS/Linux/Cisco. Comanda greșită pe sistemul greșit nu există.</>,
        <><code>arp -a</code> există pe Windows <b>și</b> pe macOS; pe Linux echivalentul modern e <code>ip neigh</code>.</>,
        <><code>ipconfig</code> există și pe Windows, și pe macOS — dar cu sintaxă complet diferită.</>,
      ]} />
      <InlineQuiz ids={['1.10-030', '1.10-031', '1.10-033']} />
    </section>
  );
}

/* ======================================================================
   1.10 — troubleshooting
   ====================================================================== */
export function Troubleshoot() {
  return (
    <section id="troubleshoot" className="section">
      <SectionHead id="troubleshoot" code="1.10 · troubleshooting" title="Depanare metodică — găsește parametrul greșit" />
      <Summary>
        <p>Verifică în ordine: <b>(1)</b> există o adresă validă? (169.254 = DHCP a eșuat) <b>(2)</b> masca e cea din planul rețelei? <b>(3)</b> gateway-ul e în aceeași rețea? <b>(4)</b> DNS-ul e setat?
          Apoi urcă „scara de ping”: 127.0.0.1 → IP-ul propriu → gateway → IP remote → nume. Prima treaptă care eșuează îți arată stratul cu problema.</p>
      </Summary>

      <Detailed title="Explicația detaliată — 1. Lista de verificare">
        <Table head={['#', 'Ce verifici', 'Cum', 'Semn rău', 'Cauze tipice']} hlCol={0} rows={[
          ['1', 'legătura fizică', <>ipconfig („Media disconnected”) · ifconfig (status) · ip a (LOWER_UP)</>, 'media disconnected, DOWN, NO-CARRIER', 'cablu, port switch oprit, Wi-Fi neasociat'],
          ['2', 'adresa IP', 'ipconfig /all · ip a', <><b>169.254.x.x</b> sau 0.0.0.0</>, 'server DHCP căzut/inaccesibil, VLAN greșit, lipsă ip helper-address, pool epuizat'],
          ['3', 'masca', 'compară cu planul / cu alți hosti din LAN', 'altă mască decât vecinii', 'greșeală la configurarea statică'],
          ['4', 'gateway-ul', 'AND(IP, mască) vs. AND(GW, mască)', 'gateway în altă rețea sau lipsă', 'greșeală de tastare, copiere de la alt site'],
          ['5', 'DNS', 'ipconfig /all · scutil --dns · resolvectl', 'lipsă sau server inaccesibil', 'DNS static vechi, server căzut, firewall pe UDP 53'],
          ['6', 'unicitatea IP-ului', 'mesaj de conflict · arp -a de pe alt host', '„duplicate”/conflict, conexiuni intermitente', 'static în interiorul pool-ului DHCP'],
        ]} />
      </Detailed>

      <Detailed title="Explicația detaliată — 2. APIPA: 169.254.x.x">
        <Figure caption="Interactiv: comută între un DHCP reușit și unul eșuat. Fără răspuns, clientul își alege singur o adresă link-local 169.254.0.0/16 — fără gateway și fără DNS.">
          <DhcpVsApipa />
        </Figure>
        <CodeBlock title="Windows — semnătura APIPA (ilustrativ)" kind="session" code={`C:\\> ipconfig /all
Ethernet adapter Ethernet:
   Physical Address. . . . . . . . . : 70-85-C2-AA-BB-CC
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Autoconfiguration IPv4 Address. . : 169.254.37.112(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :
   DNS Servers . . . . . . . . . . . : fec0:0:0:ffff::1%1`} explain={[
          ['DHCP Enabled: Yes', 'Clientul e setat corect pe DHCP — deci problema NU e pe client, ci pe drumul spre serverul DHCP.'],
          ['Autoconfiguration IPv4 Address … 169.254.37.112', <>Eticheta „Autoconfiguration” + 169.254 = <G id="apipa" />. Adresa e aleasă aleatoriu din 169.254.0.0/16.</>],
          ['Subnet Mask 255.255.0.0', 'Masca APIPA este întotdeauna /16.'],
          ['Default Gateway (gol)', 'Fără gateway: hostul nu poate ieși din segment.'],
          ['DNS Servers fec0:0:0:ffff::1%1', 'Adrese IPv6 vechi „site-local” puse automat când nu există DNS real — practic, niciun DNS utilizabil.'],
        ]} />
        <p><b>Cum interpretezi:</b> dacă <b>un singur</b> PC are 169.254, problema e locală lui (cablu, port de switch, VLAN-ul portului, Wi-Fi). Dacă <b>toate</b> PC-urile dintr-o rețea au 169.254, problema e comună: serverul DHCP, pool-ul epuizat sau lipsa <code>ip helper-address</code> pe interfața routerului când serverul e în altă rețea (DHCP folosește broadcast, iar routerele nu propagă broadcast-uri).</p>
      </Detailed>

      <Detailed title="Explicația detaliată — 3. Scara de ping și traseul">
        <Figure caption="Interactiv: click pe prima treaptă care eșuează. Ordinea contează: fiecare treaptă presupune că toate cele de dedesubt funcționează.">
          <PingLadder />
        </Figure>
        <Table head={['Mesaj', 'Ce înseamnă']} rows={[
          [<code>Reply from 192.168.1.1: bytes=32 time=1ms TTL=64</code>, 'succes'],
          [<code>Request timed out.</code>, 'niciun răspuns: destinația e oprită, un firewall blochează ICMP sau drumul de întoarcere lipsește'],
          [<code>Reply from 192.168.1.23: Destination host unreachable.</code>, <>răspunsul vine de la <b>propriul IP</b>: ARP-ul pentru destinația locală (sau pentru gateway) n-a primit răspuns</>],
          [<code>Reply from 192.168.1.1: Destination net unreachable.</code>, 'gateway-ul a primit pachetul, dar nu are rută spre rețeaua destinație'],
          [<code>Ping request could not find host www.cisco.com.</code>, 'numele nu a putut fi rezolvat → problemă DNS'],
          [<><code>General failure.</code> / <code>Transmit failed</code></>, 'hostul nu are nicio rută (de exemplu fără gateway și destinație remote) sau interfața e jos'],
        ]} />
        <p>Când ping-ul spre o adresă remote eșuează, dar gateway-ul răspunde, folosește <b><code>tracert</code></b> / <b><code>traceroute</code></b>: ultimul hop care răspunde e ultimul router „sănătos”, iar problema e imediat după el (rută lipsă, link căzut, ACL).</p>
        <CodeBlock title="Windows — tracert care se oprește (ilustrativ)" kind="session" code={`C:\\> tracert -d 192.168.20.10

Tracing route to 192.168.20.10 over a maximum of 30 hops

  1     1 ms     1 ms     1 ms  192.168.10.1
  2     1 ms     1 ms     1 ms  10.0.0.2
  3     *        *        *     Request timed out.
  4     *        *        *     Request timed out.`} explain={[
          ['1 … 192.168.10.1', 'Gateway-ul local (R1) — funcționează.'],
          ['2 … 10.0.0.2', 'Al doilea router (R2) — și el răspunde.'],
          ['3 * * *', 'După R2 nu mai răspunde nimeni: R2 nu are rută spre destinație, interfața spre ea e jos, destinația e oprită sau un filtru blochează. Investighezi pe R2 (show ip route, show ip interface brief).'],
        ]} />
      </Detailed>

      <Detailed title="Explicația detaliată — 4. Scenariile clasice (exersează AND-ul)">
        <h4>A. Gateway în altă rețea</h4>
        <p>Host <code>192.168.1.130</code>, mască <code>255.255.255.128</code> (/25), gateway <code>192.168.1.1</code>. Rețeaua hostului: 130 AND 128 = 128 → <b>192.168.1.128/25</b> (hosturi .129–.254). Gateway-ul .1 e în 192.168.1.0/25 — <b>altă rețea</b>. Rezultat: hostul comunică cu vecinii .129–.254, dar nu poate trimite nimic în afară. Soluție: gateway-ul corect (adresa routerului din .128/25, de exemplu .129) sau masca corectă.</p>
        <h4>B. Mască prea scurtă (/16 în loc de /24)</h4>
        <p>Host <code>172.16.5.10/16</code> într-o rețea care e de fapt 172.16.5.0/24. Destinația <code>172.16.9.20</code> (în alt subnet, după router). Hostul calculează: ambele în 172.16.0.0/16 → „local” → face ARP pentru 172.16.9.20, nu pentru gateway. Nimeni nu răspunde (dacă routerul nu face proxy ARP) → „Destination host unreachable”. Simptomul: <b>unele</b> rețele remote merg (cele din afara lui 172.16.0.0/16), altele nu.</p>
        <h4>C. Mască prea lungă (/25 în loc de /24)</h4>
        <p>Host <code>192.168.1.20/25</code> într-o rețea /24. Vecinul <code>192.168.1.200</code> pare „remote” → hostul îl trimite la gateway (dacă gateway-ul e în .0/25). Routerul îl livrează înapoi în același LAN, deci poate merge, dar ineficient — sau nu merge deloc dacă gateway-ul e .254 (în cealaltă jumătate).</p>
        <h4>D. DNS</h4>
        <p><code>ping 8.8.8.8</code> → succes, <code>ping www.cisco.com</code> → „could not find host”. Conectivitatea IP e bună; problema e <b>doar</b> rezolvarea numelor. Verifici DNS Servers în <code>ipconfig /all</code>, apoi <code>nslookup www.cisco.com</code>, apoi <code>ipconfig /flushdns</code>. Nu uita fișierul <G id="hosts-file" /> (o intrare greșită acolo bate DNS-ul).</p>
        <h4>E. IP duplicat</h4>
        <p>Două hosturi cu aceeași adresă (de obicei: cineva a pus static o adresă din interiorul pool-ului DHCP). Simptome: conexiuni intermitente, mesaj de conflict în Windows, iar în <code>arp -a</code> de pe alt host MAC-ul asociat acelui IP „sare” între două valori. Soluție: adrese statice în afara pool-ului (pe Cisco: <code>ip dhcp excluded-address</code>).</p>
        <Callout kind="exam" title="Cum arată la examen">
          Primești o topologie, un output <code>ipconfig</code> (sau ifconfig/ip a) și întrebarea „de ce PC-ul nu poate accesa serverul?”. Ia valorile, fă AND-ul pentru host și pentru gateway, compară masca cu a vecinilor, uită-te după 169.254 și după DNS. Una dintre aceste cinci verificări dă răspunsul aproape întotdeauna.
        </Callout>
      </Detailed>

      <Traps items={[
        <><b>169.254.x.x/16</b> fără gateway = DHCP a eșuat. Problema e pe drumul spre serverul DHCP, nu în setările clientului (care e corect pe DHCP).</>,
        <>Ping pe IP merge, pe nume nu → <b>DNS</b>. Nu schimba gateway-ul sau masca.</>,
        <>Ping-ul spre gateway merge, spre internet nu → hostul e bine configurat local; caută dincolo de gateway (rutare, NAT, ISP) cu tracert.</>,
        <><code>ping 127.0.0.1</code> reușit dovedește doar că stiva TCP/IP funcționează — <b>nu</b> testează placa de rețea sau cablul.</>,
        <>„Destination host unreachable” de la <b>propriul IP</b> = ARP eșuat local, nu problemă la distanță.</>,
      ]} />
      <InlineQuiz ids={['1.10-034', '1.10-035', '1.10-037', '1.10-036']} />
    </section>
  );
}
