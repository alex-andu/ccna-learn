import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabGuidedTopology, LabTicketsTopology } from '../../diagrams/t1_10';

const ROUTERS = `R1> enable
R1# configure terminal
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface GigabitEthernet0/1
R1(config-if)# ip address 10.0.0.1 255.255.255.252
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip route 192.168.20.0 255.255.255.0 10.0.0.2
R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10
R1(config)# ip dhcp pool LAN-A
R1(dhcp-config)# network 192.168.10.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.10.1
R1(dhcp-config)# dns-server 192.168.20.10
R1(dhcp-config)# end
R2> enable
R2# configure terminal
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 192.168.20.1 255.255.255.0
R2(config-if)# no shutdown
R2(config-if)# interface GigabitEthernet0/1
R2(config-if)# ip address 10.0.0.2 255.255.255.252
R2(config-if)# no shutdown
R2(config-if)# exit
R2(config)# ip route 192.168.10.0 255.255.255.0 10.0.0.1
R2(config)# end`;

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't110g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.10-G" title="Lab ghidat — verifică un client, apoi strică-l și observă (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> citești configurația IP a PC-urilor cu <code>ipconfig</code> și <code>ipconfig /all</code>, refaci DHCP cu <code>/release</code> și <code>/renew</code>, urci scara de ping, vezi cu <code>arp -a</code> decizia local/remote, urmărești traseul cu <code>tracert</code> și testezi DNS-ul. Apoi introduci intenționat patru greșeli (gateway, mască, DHCP, DNS) și observi simptomele fiecăreia.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat.">
        <LabGuidedTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă / mască', 'Gateway', 'Note']} rows={[
        ['R1 (ISR 2911)', 'G0/0', '192.168.10.1 /24', '—', 'server DHCP pentru LAN A'],
        ['R1', 'G0/1', '10.0.0.1 /30', '—', 'spre R2'],
        ['R2 (ISR 2911)', 'G0/1', '10.0.0.2 /30', '—', ''],
        ['R2', 'G0/0', '192.168.20.1 /24', '—', ''],
        ['SRV1 (Server-PT)', 'Fa0', '192.168.20.10 /24', '192.168.20.1', 'DNS: www.ccna.lab → 192.168.20.10; HTTP pornit'],
        ['PC1, PC2', 'Fa0', 'DHCP', 'DHCP', 'vor primi .11, .12 …'],
        ['PC3', 'Fa0', '192.168.10.50 /24 (static)', '192.168.10.1', 'DNS 192.168.20.10'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu">
        PC-urile din PT au un Command Prompt <b>asemănător</b> cu Windows (<code>ipconfig</code>, <code>ping</code>, <code>tracert</code>, <code>arp</code>, <code>nslookup</code>), dar nu un Windows real: lipsesc <code>route print</code>, <code>netsh</code> și PowerShell, iar formatul output-urilor diferă puțin. Comenzile macOS și Linux nu există în PT — le exersezi în labul „pe mașinile tale”. În GNS3/EVE-NG/CML poți folosi în locul PC-urilor mașini virtuale Linux sau Windows reale (sau VPCS, care are comenzi proprii: <code>show ip</code>, <code>dhcp</code>).
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Construiește topologia">
          <p>Plasează 2 routere <b>2911</b>, 2 switch-uri <b>2960</b>, 3 <b>PC</b>-uri și un <b>Server</b> (<P>End Devices → Server</P>). Cabluri: PC-uri → SW1 (Fa0/1–3), SW1 Gi0/1 → R1 G0/0, R1 G0/1 → R2 G0/1, R2 G0/0 → SW2 Gi0/1, SW2 Fa0/1 → SRV1. Poți folosi <P>Connections → Automatically Choose Connection Type</P> (fulgerul).</p>
        </Step>
        <Step labKey={L} n={2} title="Configurează routerele (copiază blocul)">
          <p>Scopul labului este clientul, așa că partea de router o primești gata. Lipește comenzile în <P>R1 → CLI</P>, respectiv <P>R2 → CLI</P> (prompturile sunt doar indicative — nu le copia).</p>
          <CodeBlock title="R1 și R2 — configurația de bază" kind="session" code={ROUTERS} explain={[
            ['ip address … / no shutdown', 'Adresele din tabelul de adresare; interfețele routerului sunt oprite implicit.'],
            ['ip route 192.168.20.0 … 10.0.0.2', 'Rută statică spre LAN B prin R2 (și invers pe R2). Fără ea, tracert s-ar opri la R1.'],
            ['ip dhcp excluded-address / ip dhcp pool LAN-A', 'Pool-ul DHCP pentru PC1/PC2: rețea, gateway (default-router) și DNS (dns-server).'],
          ]} />
        </Step>
        <Step labKey={L} n={3} title="Configurează serverul SRV1 (adresă + DNS)">
          <p><P>SRV1 → Desktop → IP Configuration</P>: Static, 192.168.20.10, 255.255.255.0, gateway 192.168.20.1, DNS 192.168.20.10. Apoi <P>Services → DNS</P>: DNS Service <b>On</b>, Name <code>www.ccna.lab</code>, Type <b>A Record</b>, Address <code>192.168.20.10</code> → <b>Add</b>. Verifică și că <P>Services → HTTP</P> e On.</p>
        </Step>
        <Step labKey={L} n={4} title="Configurează clienții">
          <p>PC1 și PC2: <P>Desktop → IP Configuration → DHCP</P>. Ar trebui să apară mesajul că cererea DHCP a reușit și adrese din 192.168.10.11 în sus.</p>
          <p>PC3: <b>Static</b> — IP 192.168.10.50, mască 255.255.255.0, gateway 192.168.10.1, DNS 192.168.20.10.</p>
          <Reveal label="De ce primește PC1 .11 și nu .2?"><p>Pentru că <code>ip dhcp excluded-address 192.168.10.1 192.168.10.10</code> rezervă primele zece adrese (routerul, eventuale servere/imprimante statice). Așa PC3 (.50) ar putea totuși intra în conflict cu un client DHCP la un moment dat — într-o rețea reală ai exclude și .50 sau ai pune staticele într-un interval exclus.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Citește configurația: ipconfig și ipconfig /all">
          <p>Pe PC1: <P>Desktop → Command Prompt</P>.</p>
          <CodeBlock title="PC1" kind="session" code={`C:\\> ipconfig
C:\\> ipconfig /all`} explain={[
            ['ipconfig', 'IP, mască, gateway. Notează-le.'],
            ['ipconfig /all', 'În plus: Physical Address (MAC), DHCP Servers, DNS Servers. Compară cu pool-ul de pe R1.'],
          ]} />
          <Reveal label="Ce ar trebui să vezi?"><p>IPv4 192.168.10.11, mască 255.255.255.0, Default Gateway 192.168.10.1 (pe a doua linie, sub gateway-ul IPv6 „::”), DHCP Servers 192.168.10.1, DNS Servers 192.168.20.10. Pe R1, <code>show ip dhcp binding</code> trebuie să arate același IP lângă MAC-ul PC1.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Release / renew">
          <CodeBlock title="PC1" kind="session" code={`C:\\> ipconfig /release
C:\\> ipconfig
C:\\> ipconfig /renew`} explain={[
            ['ipconfig /release', 'PC1 renunță la adresă — ipconfig arată acum 0.0.0.0.'],
            ['ipconfig /renew', 'PC1 rulează din nou DHCP și primește (de obicei) aceeași adresă.'],
          ]} />
          <Reveal label="Întrebare: de ce primește de obicei aceeași adresă?"><p>Serverul DHCP ține minte asocierea MAC → IP (binding-ul) și i-o oferă din nou aceluiași client dacă e încă liberă. Poți verifica pe R1 cu <code>show ip dhcp binding</code>.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Urcă scara de ping">
          <CodeBlock title="PC1" kind="session" code={`C:\\> ping 127.0.0.1
C:\\> ping 192.168.10.11
C:\\> ping 192.168.10.1
C:\\> ping 192.168.20.10
C:\\> ping www.ccna.lab`} explain={[
            ['ping 127.0.0.1', 'Stiva TCP/IP locală.'],
            ['ping 192.168.10.11', 'Propriul IP (înlocuiește cu adresa primită).'],
            ['ping 192.168.10.1', 'Gateway-ul. Primul ping poate pierde un pachet cât timp se face ARP — e normal.'],
            ['ping 192.168.20.10', 'Destinație remote — testează rutarea R1 → R2.'],
            ['ping www.ccna.lab', 'Testează DNS: numele trebuie tradus în 192.168.20.10.'],
          ]} />
        </Step>
        <Step labKey={L} n={8} title="Vezi decizia local/remote cu arp -a">
          <CodeBlock title="PC1" kind="session" code={`C:\\> arp -d
C:\\> ping 192.168.20.10
C:\\> arp -a
C:\\> ping 192.168.10.12
C:\\> arp -a`} explain={[
            ['arp -d', 'Golește cache-ul ARP (dacă versiunea ta de PT nu are -d, sari peste — pornește de la cache-ul existent).'],
            ['ping 192.168.20.10 → arp -a', <>Apare <b>doar MAC-ul gateway-ului</b> (192.168.10.1). Serverul e remote, deci PC-ul a făcut <G id="arp" /> pentru gateway.</>],
            ['ping 192.168.10.12 → arp -a', 'Acum apare și MAC-ul lui PC2: destinație locală → ARP direct pentru ea.'],
          ]} />
          <Reveal label="Bonus: urmărește în Simulation mode"><p>Comută pe <b>Simulation</b>, filtrează doar <b>ARP</b> și <b>ICMP</b>, golește cache-ul și dă ping la 192.168.20.10. Deschide primul pachet ARP: „Target IP” este 192.168.10.1, nu 192.168.20.10. Apoi deschide cadrul ICMP: MAC destinație = MAC-ul lui R1 G0/0, IP destinație = 192.168.20.10.</p></Reveal>
        </Step>
        <Step labKey={L} n={9} title="Traseul și DNS-ul">
          <CodeBlock title="PC1" kind="session" code={`C:\\> tracert 192.168.20.10
C:\\> nslookup www.ccna.lab`} explain={[
            ['tracert 192.168.20.10', 'Trei hopuri: 192.168.10.1 (R1), 10.0.0.2 (R2), 192.168.20.10 (SRV1).'],
            ['nslookup www.ccna.lab', 'Serverul care răspunde (192.168.20.10) și adresa întoarsă.'],
          ]} />
        </Step>
        <Step labKey={L} n={10} title="Strică 1 — gateway greșit (PC3)">
          <p>Pe PC3 schimbă Default Gateway în <code>192.168.10.254</code> (nu există). Testează: <code>ping 192.168.10.11</code>, <code>ping 192.168.10.1</code>, <code>ping 192.168.20.10</code>.</p>
          <Reveal label="Ce observi și de ce?"><p>Ping-urile <b>locale</b> (PC1, chiar și R1 .1) merg — nu au nevoie de gateway. Ping-ul spre SRV1 eșuează: PC3 face ARP pentru .254, nimeni nu răspunde. Simptomul tipic: „merge LAN-ul, nu merge nimic în afară”. Repară gateway-ul la 192.168.10.1.</p></Reveal>
        </Step>
        <Step labKey={L} n={11} title="Strică 2 — mască greșită (PC3)">
          <p>Pe PC3 pune IP <code>192.168.10.200</code>, mască <code>255.255.255.128</code>, gateway 192.168.10.1. Testează <code>ping 192.168.10.1</code>, <code>ping 192.168.10.11</code> și <code>ping 192.168.20.10</code>.</p>
          <Reveal label="Ce observi și de ce?"><p>Cu /25, rețeaua lui PC3 este 192.168.10.128/25 (.129–.254). Gateway-ul .1 și PC1 (.11) par în <b>altă rețea</b>: PC3 nu-și poate atinge gateway-ul (e „în afara” rețelei lui), deci ping-urile eșuează sau PT poate chiar refuza/avertiza la salvare. Concluzie: masca greșită „mută” gateway-ul în afara rețelei. Repară: IP 192.168.10.50, mască 255.255.255.0.</p></Reveal>
        </Step>
        <Step labKey={L} n={12} title="Strică 3 — DHCP indisponibil (PC2)">
          <p>Pe R1: <code>configure terminal</code> → <code>no ip dhcp pool LAN-A</code>. Pe PC2: <code>ipconfig /release</code>, apoi <code>ipconfig /renew</code> (sau comută IP Configuration pe Static și înapoi pe DHCP). Rulează <code>ipconfig /all</code>.</p>
          <Reveal label="Ce observi și de ce?"><p>PC2 nu primește răspuns DHCP și ajunge la o adresă <b>169.254.x.x</b> cu masca 255.255.0.0 și fără gateway (<G id="apipa" />). PT afișează de obicei și un mesaj de eșec DHCP în fereastra IP Configuration. Ping-ul spre 192.168.10.1 eșuează. Recreează pool-ul (pasul 2), apoi <code>ipconfig /renew</code> — adresa corectă revine.</p></Reveal>
        </Step>
        <Step labKey={L} n={13} title="Strică 4 — DNS greșit (PC3)">
          <p>Pe PC3 (configurat din nou corect) schimbă DNS Server în <code>192.168.20.99</code>. Testează <code>ping 192.168.20.10</code> și <code>ping www.ccna.lab</code>, apoi <code>nslookup www.ccna.lab</code>.</p>
          <Reveal label="Ce observi și de ce?"><p>Ping-ul pe IP merge, pe nume nu („could not find host” / timeout la nslookup). Conectivitatea IP e perfectă, doar rezolvarea numelor eșuează — semnătura unei probleme <G id="dns" />. Pune DNS-ul înapoi pe 192.168.20.10.</p></Reveal>
        </Step>
      </Detailed>
      <Reveal label="Soluție completă — rezumat și răspunsuri">
        <Table head={['Experiment', 'Simptom', 'Comanda care îl arată', 'Cauză']} rows={[
          ['gateway .254', 'local OK, remote eșuează', 'ipconfig (Default Gateway), ping', 'ARP pentru un gateway inexistent'],
          ['mască /25 cu IP .200', 'nici gateway-ul nu răspunde', 'ipconfig (Subnet Mask), AND manual', 'gateway-ul e în afara rețelei calculate'],
          ['pool DHCP șters', '169.254.x.x/16, fără gateway', 'ipconfig /all (Autoconfiguration)', 'niciun DHCPOFFER → APIPA'],
          ['DNS .99', 'IP OK, nume eșuează', 'ipconfig /all (DNS Servers), nslookup', 'server DNS inexistent'],
        ]} />
        <p>Valori corecte la final: PC1/PC2 prin DHCP (192.168.10.11+, /24, GW .1, DNS 192.168.20.10); PC3 static 192.168.10.50/24, GW 192.168.10.1, DNS 192.168.20.10. <code>tracert</code> de la orice PC: .10.1 → 10.0.0.2 → 192.168.20.10.</p>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — tichete de depanare
   ====================================================================== */
type Ticket = { id: string; user: string; symptom: string; out: string; tests: string; diag: React.ReactNode; fix: React.ReactNode; repro: React.ReactNode };
const TICKETS: Ticket[] = [
  {
    id: 'A', user: 'PC-A (contabilitate)', symptom: '„Nu-mi merge nimic, nici imprimanta din birou.” Colegii din aceeași cameră lucrează normal.',
    out: `C:\\> ipconfig /all
   Physical Address................: 0060.3E11.AA01
   IPv4 Address....................: 169.254.12.201
   Subnet Mask.....................: 255.255.0.0
   Default Gateway.................: ::
                                     0.0.0.0
   DHCP Servers....................: 0.0.0.0
   DNS Servers.....................: ::`,
    tests: 'ping 192.168.10.1 → Request timed out · PC-ul e setat pe DHCP',
    diag: <>Adresă <b>APIPA</b> (169.254/16, fără gateway). Pentru că <b>doar acest PC</b> e afectat, serverul DHCP funcționează — problema e pe drumul PC-A → switch: cablu, port de switch oprit (shutdown) sau portul pus în alt VLAN.</>,
    fix: <>Verifică legătura (ledurile portului în PT, <code>show interfaces status</code> pe SW1), repornește portul cu <code>no shutdown</code> sau pune-l înapoi în VLAN 1, apoi pe PC <code>ipconfig /renew</code>.</>,
    repro: <>Pe SW1: <code>interface fa0/1</code> → <code>shutdown</code> (sau <code>switchport access vlan 99</code>); pe PC-A DHCP → <code>ipconfig /renew</code>.</>,
  },
  {
    id: 'B', user: 'PC-B (recepție)', symptom: '„Pot accesa imprimanta din rețea, dar nu și serverul www.ccna.lab sau internetul.”',
    out: `C:\\> ipconfig
   IPv4 Address....................: 192.168.10.60
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: ::
                                     192.168.1.1`,
    tests: 'ping 192.168.10.11 → Reply · ping 192.168.10.1 → Reply · ping 192.168.20.10 → Request timed out',
    diag: <>Gateway-ul <code>192.168.1.1</code> nu este în rețeaua hostului (192.168.10.0/24) — probabil o greșeală de tastare sau o configurație copiată de acasă. Tot ce e local merge (inclusiv ping la .10.1, care e doar un vecin local), tot ce e remote eșuează.</>,
    fix: <>Default Gateway = <code>192.168.10.1</code>.</>,
    repro: <>PC-B static: 192.168.10.60 / 255.255.255.0 / GW 192.168.1.1 / DNS 192.168.20.10.</>,
  },
  {
    id: 'C', user: 'PC-C (IT)', symptom: '„Ajung la routerul R2 (10.0.0.2), dar nu și la serverul din 192.168.20.0.”',
    out: `C:\\> ipconfig
   IPv4 Address....................: 192.168.10.70
   Subnet Mask.....................: 255.255.0.0
   Default Gateway.................: ::
                                     192.168.10.1`,
    tests: 'ping 10.0.0.2 → Reply · ping 192.168.20.10 → Request timed out / Destination host unreachable',
    diag: <>Masca <b>/16</b> în loc de /24. PC-C crede că rețeaua lui este 192.168.0.0/16, deci 192.168.20.10 pare <b>locală</b>: face ARP direct pentru ea în loc să trimită la gateway. 10.0.0.2 e în afara lui 192.168.0.0/16, așa că pentru el folosește corect gateway-ul — de aceea merge. (Dacă routerul face proxy ARP, poate funcționa „din întâmplare” — examenul cere logica de bază.)</>,
    fix: <>Subnet Mask = <code>255.255.255.0</code>.</>,
    repro: <>PC-C static: 192.168.10.70 / 255.255.0.0 / GW 192.168.10.1 / DNS 192.168.20.10. Pentru un rezultat curat, pe R1 <code>interface g0/0</code> → <code>no ip proxy-arp</code>.</>,
  },
  {
    id: 'D', user: 'PC-D (vânzări)', symptom: '„Site-ul intern www.ccna.lab nu se deschide. Colegul mi-a zis să încerc http://192.168.20.10 și așa merge.”',
    out: `C:\\> ipconfig /all
   IPv4 Address....................: 192.168.10.80
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: ::
                                     192.168.10.1
   DNS Servers.....................: ::
                                     192.168.10.20`,
    tests: 'ping 192.168.20.10 → Reply · ping www.ccna.lab → Ping request could not find host',
    diag: <>Conectivitatea IP e bună; numele nu se rezolvă. DNS-ul configurat (192.168.10.20) nu există / nu e server DNS. Problema e <b>doar DNS</b>.</>,
    fix: <>DNS Server = <code>192.168.20.10</code> (sau trece PC-ul pe DHCP, care dă DNS-ul corect). Verifică cu <code>nslookup www.ccna.lab</code>.</>,
    repro: <>PC-D static: 192.168.10.80 / 255.255.255.0 / GW 192.168.10.1 / DNS 192.168.10.20.</>,
  },
  {
    id: 'E', user: 'PC-E (laptop adus de la altă filială)', symptom: '„Nu merge absolut nimic, nici măcar imprimanta. Cablul e conectat, ledul e verde.”',
    out: `C:\\> ipconfig
   IPv4 Address....................: 192.168.30.25
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: ::
                                     192.168.30.1`,
    tests: 'ping 192.168.30.25 → Reply · ping 192.168.30.1 → Request timed out · ping 192.168.10.1 → Request timed out',
    diag: <>Configurația <b>statică</b> e coerentă în sine (IP, mască și gateway în aceeași rețea), dar este pentru <b>altă rețea</b> (192.168.30.0/24 — filiala). Pe acest LAN nu există 192.168.30.1, iar 192.168.10.x pare remote, deci totul trece printr-un gateway inexistent.</>,
    fix: <>Treci laptopul pe <b>DHCP</b> (soluția corectă pentru un laptop care circulă) sau pune o adresă statică din 192.168.10.0/24, în afara pool-ului.</>,
    repro: <>PC-E static: 192.168.30.25 / 255.255.255.0 / GW 192.168.30.1.</>,
  },
];

export function SoloLab() {
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.10-S" title="Lab solo — cinci tichete de suport" />
      <Summary>
        <p><b>Scenariu:</b> ești pe tura de helpdesk. Rețeaua (R1, R2, SRV1, pool-ul DHCP) este corectă, exact ca în labul ghidat. Cinci utilizatori au deschis tichete. Pentru fiecare primești simptomul, output-ul comenzii și testele făcute de utilizator.
          <b> Sarcina ta:</b> scrie în notițe <b>diagnosticul</b> (ce parametru e greșit și de ce produce exact acel simptom) și <b>remedierea</b>, apoi deschide soluția. Opțional, reproduce fiecare tichet în topologia din labul ghidat (adaugă PC-A…PC-E la SW1) și verifică remedierea.
          <br /><b>Timp estimat:</b> 30–45 min</p>
      </Summary>
      <Figure caption="Topologia: aceeași rețea ca în labul ghidat, cu cinci PC-uri problematice.">
        <LabTicketsTopology />
      </Figure>
      <Callout kind="tip" title="Metoda (aplic-o la fiecare tichet)">
        1) Adresa e validă (nu 169.254)? 2) Masca e /24, ca la vecini? 3) AND(IP) = AND(gateway)? 4) DNS-ul e 192.168.20.10? 5) Ce test a reușit și ce a eșuat — la ce treaptă din scara de ping?
      </Callout>
      {TICKETS.map((t) => (
        <Detailed key={t.id} title={`Tichetul ${t.id} — ${t.user}`}>
          <p><b>Raportat:</b> {t.symptom}</p>
          <CodeBlock title={`${t.user} — output (ilustrativ, Packet Tracer)`} kind="session" code={t.out} />
          <p className="small"><b>Teste:</b> <code>{t.tests}</code></p>
          <Reveal label={`Soluție tichet ${t.id}`}>
            <p><b>Diagnostic:</b> {t.diag}</p>
            <p><b>Remediere:</b> {t.fix}</p>
            <p className="small muted"><b>Cum îl reproduci în PT:</b> {t.repro}</p>
          </Reveal>
        </Detailed>
      ))}
      <Reveal label="Rezumat — tabelul tuturor tichetelor">
        <Table head={['Tichet', 'Parametru greșit', 'Semnătura', 'Remediere']} rows={[
          ['A', 'niciunul pe PC — legătura/VLAN-ul', '169.254.x.x, doar acest PC', 'repară portul/VLAN-ul, /renew'],
          ['B', 'default gateway', 'local OK, remote eșuează', 'GW 192.168.10.1'],
          ['C', 'mască /16', 'unele rețele remote merg, altele nu', 'mască 255.255.255.0'],
          ['D', 'DNS', 'IP OK, nume eșuează', 'DNS 192.168.20.10'],
          ['E', 'IP/rețea de la alt site', 'nici vecinii nu răspund', 'DHCP sau IP din 192.168.10.0/24'],
        ]} />
        <Callout kind="exam" title="Legătură cu examenul">Aceste cinci tipare acoperă aproape toate întrebările de troubleshooting de la 1.10 și pregătesc topicurile 4.3 (DNS), 4.6 (DHCP) și 3.x (rutare).</Callout>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB pe mașinile reale
   ====================================================================== */
export function RealLab() {
  const L = 't110r';
  return (
    <section id="lab-real" className="section">
      <SectionHead id="lab-real" code="LAB 1.10-R" title="Lab opțional — pe calculatoarele tale (Windows, macOS, Linux / Raspberry Pi)" />
      <Summary>
        <p><b>Obiectiv:</b> găsești aceiași parametri pe sisteme reale și completezi o fișă. Comenzile sunt <b>doar de citire</b> (nu schimbă nimic), cu excepția celor marcate opțional.
          <br /><b>Timp estimat:</b> 20–30 min · <b>Nevoie de:</b> orice combinație dintre un PC Windows, un Mac, Raspberry Pi-ul (Linux)</p>
      </Summary>
      <Detailed title="Fișa de completat (pentru fiecare sistem)">
        <Table head={['Câmp', 'Windows', 'macOS', 'Linux / RPi']} rows={[
          ['IP + mască (și prefixul /n)', 'ipconfig', 'ifconfig en0 (convertește hex!)', 'ip -br a'],
          ['default gateway', 'ipconfig', 'route -n get default', 'ip route'],
          ['servere DNS', 'ipconfig /all', 'scutil --dns', 'cat /etc/resolv.conf · resolvectl status'],
          ['MAC', 'ipconfig /all', 'ifconfig en0 (ether)', 'ip link'],
          ['DHCP sau static? lease?', 'ipconfig /all', 'networksetup -getinfo "Wi-Fi" · ipconfig getpacket en0', 'ip a (dynamic, valid_lft)'],
          ['MAC-ul gateway-ului', 'arp -a', 'arp -a', 'ip neigh'],
          ['hopurile până la 1.1.1.1', 'tracert -d 1.1.1.1', 'traceroute -n 1.1.1.1', 'tracepath -n 1.1.1.1'],
        ]} />
      </Detailed>
      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Windows">
          <CodeBlock title="Windows" kind="session" code={`C:\\> ipconfig /all
C:\\> route print -4
C:\\> arp -a
C:\\> nslookup www.cisco.com
C:\\> tracert -d 1.1.1.1`} />
          <p>Completează coloana Windows. Compară Default Gateway cu linia <code>0.0.0.0</code> din <code>route print</code> și cu intrarea din <code>arp -a</code>.</p>
        </Step>
        <Step labKey={L} n={2} title="macOS">
          <CodeBlock title="macOS" kind="session" code={`$ networksetup -listallhardwareports
$ ifconfig en0
$ networksetup -getinfo "Wi-Fi"
$ route -n get default
$ scutil --dns | grep nameserver
$ arp -a
$ traceroute -n 1.1.1.1`} />
          <p>Convertește masca hex din ifconfig și verifică dacă se potrivește cu „Subnet mask” din networksetup.</p>
        </Step>
        <Step labKey={L} n={3} title="Linux / Raspberry Pi">
          <CodeBlock title="Raspberry Pi (prin ssh)" kind="session" code={`$ hostname -I
$ ip -br a
$ ip a show eth0
$ ip route
$ ip route get 1.1.1.1
$ ip neigh
$ cat /etc/resolv.conf
$ nmcli device show eth0
$ tracepath -n 1.1.1.1`} />
          <p>Dacă Pi-ul e pe Wi-Fi, folosește <code>wlan0</code>. Dacă <code>nmcli</code> nu există, Pi-ul are o versiune mai veche a sistemului (alt manager de rețea) — restul comenzilor funcționează la fel.</p>
        </Step>
        <Step labKey={L} n={4} title="Analizează">
          <ul>
            <li>Sunt toate sistemele în aceeași rețea (același rezultat la AND între IP și mască)?</li>
            <li>Au același gateway și același DNS? Dacă un sistem are alt DNS (de exemplu setat manual), de unde vine?</li>
            <li>MAC-ul gateway-ului este același în <code>arp -a</code> / <code>ip neigh</code> pe toate sistemele?</li>
            <li>Ce lease are fiecare și când expiră?</li>
            <li>Primul hop din traseu este același pe toate?</li>
          </ul>
          <Reveal label="Ce ar trebui să constați"><p>În aceeași rețea de acasă: aceeași rețea (de exemplu 192.168.1.0/24), același gateway și, de obicei, același DNS (routerul), același MAC al gateway-ului în toate cache-urile ARP, iar primul hop din traseu e routerul. Diferențe frecvente: un Mac cu adresă MAC privată (alta decât cea „hardware”), un DNS setat manual (1.1.1.1, 8.8.8.8), o adresă IPv6 globală doar pe unele sisteme. Dacă Pi-ul are adresă statică, nu vei vedea „dynamic” în <code>ip a</code>.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Opțional — reînnoiește DHCP pe Pi">
          <p>Doar dacă ai acces fizic la Pi (conexiunea SSH se poate întrerupe): <code>sudo nmcli connection up "&lt;numele profilului&gt;"</code> (îl iei din <code>nmcli connection show</code>). Apoi verifică <code>valid_lft</code> din <code>ip a</code> — a revenit la durata completă a lease-ului.</p>
        </Step>
      </Detailed>
    </section>
  );
}
