import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology56, LabSoloTopology56 } from '../../diagrams/t5_6';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't56g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.6-G" title="Lab ghidat — ACL standard, extended și VTY pe un router cu trei rețele" />
      <Summary>
        <p><b>Obiectiv:</b> construiești o politică reală: staff-ul accesează tot, oaspeții doar HTTP spre serverul web, un oaspete blocat prin ACL standard, iar accesul SSH la router doar de pe stația de administrare; verifici cu contoare. <br /><b>Timp estimat:</b> 60–75 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router 2911/ISR, 2 × switch 2960, 2 × PC, 1 × server) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC-Staff, PC-Guest și serverul pe trei interfețe ale lui R1.">
        <LabGuidedTopology56 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0 (Staff)', '192.168.10.1/24'],
        ['R1', 'Gi0/1 (Guest)', '192.168.20.1/24'],
        ['R1', 'Gi0/2 (Servere)', '10.1.1.1/24'],
        ['PC-Staff', 'NIC', '192.168.10.10/24, gw 192.168.10.1'],
        ['PC-Guest', 'NIC', '192.168.20.7/24, gw 192.168.20.1'],
        ['Server', 'NIC', '10.1.1.80/24, gw 10.1.1.1 (HTTP și FTP pornite)'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        ACL standard/extended/named, <code>access-class</code> și <code>show access-lists</code> sunt suportate în Packet Tracer. Numerele de potriviri (matches) pot arăta diferit față de un router real, iar opțiunea <code>log</code> nu produce întotdeauna mesaje. Serverul din PT oferă HTTP (Services → HTTP) și FTP. Comenzile <b>nu au fost testate</b> de autorul lecției în PT. Același lab merge în GNS3/CML cu IOSv/CSR1000v.
      </Callout>

      <Detailed title="Partea 0 — Conectivitate completă (fără ACL)">
        <Step labKey={L} n={1} title="Adresare și test">
          <p>Configurează adresele din tabel; activează interfețele. De pe PC-Guest dă ping către server și deschide <code>http://10.1.1.80</code> în browserul PC-ului. Ce observi?</p>
          <Reveal label="Răspuns">
            <p>Toate testele reușesc: fără ACL, routerul transmite tot. Acesta este punctul de plecare; vom restricționa apoi pas cu pas.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — ACL extended pentru oaspeți (lângă sursă)">
        <Step labKey={L} n={2} title="Scrie GUEST-IN">
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip access-list extended GUEST-IN
R1(config-ext-nacl)# permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 80
R1(config-ext-nacl)# deny ip 192.168.20.0 0.0.0.255 10.1.1.0 0.0.0.255
R1(config-ext-nacl)# permit ip any any
R1(config-ext-nacl)# exit
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip access-group GUEST-IN in`} explain={[
            ['permit tcp … eq 80', 'Singurul serviciu permis oaspeților către server.'],
            ['deny ip … 10.1.1.0 0.0.0.255', 'Tot restul către rețeaua serverelor este refuzat.'],
            ['permit ip any any', 'Restul destinațiilor rămân accesibile.'],
            ['ip access-group GUEST-IN in', 'Aplicat lângă sursă, înainte de rutare.'],
          ]} />
          <p>Repetă testele de la pasul 1 din PC-Guest. Ce funcționează acum? Ce nu?</p>
          <Reveal label="Răspuns">
            <p>Pagina web a serverului se deschide (TCP 80 permis). Ping-ul către server și FTP eșuează (refuzate de linia 2). PC-Guest poate încă pinga PC-Staff (nu am interzis rețeaua Staff) — dacă politica o cere, adaugi un deny către 192.168.10.0/24 înaintea ultimului permit.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Contoare">
          <p>Rulează <code>show access-lists</code>. Care linii au contoare? Ce înseamnă contorul liniei a doua?</p>
          <Reveal label="Răspuns">
            <p>Linia 1 crește la fiecare pagină web; linia 2 la ping/FTP respins; linia 3 la tot restul. Contorul liniei 2 este numărul de pachete refuzate de politică.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Inserează o regulă cu secvență">
          <p>Permite și HTTPS (portul 443) de la oaspeți către server, <b>fără</b> să ștergi ACL-ul. Care comandă o face și unde apare linia?</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# ip access-list extended GUEST-IN
R1(config-ext-nacl)# 15 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 443`} explain={[
              ['15 permit …', 'Numărul 15 plasează linia între 10 (permit 80) și 20 (deny).'],
            ]} />
            <p>Fără numărul 15, linia ar fi ajuns după „permit ip any any” și nu ar fi avut niciun efect.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — ACL standard (lângă destinație)">
        <Step labKey={L} n={5} title="Blochează un oaspete">
          <p>Fă ca gazda 192.168.20.7 să nu mai poată accesa <b>nimic</b> din rețeaua serverelor, folosind un ACL <b>standard</b> aplicat pe Gi0/2. Scrie comenzile și argumentează plasarea.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# access-list 20 deny host 192.168.20.7
R1(config)# access-list 20 permit any
R1(config)# interface gigabitEthernet 0/2
R1(config-if)# ip access-group 20 out`} explain={[
              ['access-list 20 deny host …', 'Standard: doar sursa.'],
              ['permit any', 'Fără această linie, toate celelalte surse ar fi blocate de deny-ul implicit.'],
              ['ip access-group 20 out', 'Lângă destinație, după rutare.'],
            ]} />
            <p>Plasarea la destinație este necesară pentru ACL standard: lângă sursă ar fi blocat 192.168.20.7 spre <i>toate</i> destinațiile, nu doar spre servere. Observație: acum pagina web nu mai merge de pe 192.168.20.7, deși linia 10 din GUEST-IN o permite — ACL-ul standard outbound o oprește la ieșire.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Securizarea VTY">
        <Step labKey={L} n={6} title="SSH doar de pe stația de administrare">
          <p>Configurează SSH minim (vezi 4.8) și restricționează VTY astfel încât doar <code>192.168.10.100</code> (o presupusă stație de administrare) să poată intra. Verifică din PC-Staff (altă adresă) că conexiunea e refuzată.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# access-list 10 permit host 192.168.10.100
R1(config)# line vty 0 15
R1(config-line)# access-class 10 in
R1(config-line)# transport input ssh`} explain={[
              ['access-list 10 permit host 192.168.10.100', 'Singura sursă acceptată; restul = deny implicit.'],
              ['access-class 10 in', 'Filtrează sesiunile VTY, indiferent de interfața de sosire.'],
            ]} />
            <p>Din PC-Staff (192.168.10.10) conexiunea este refuzată; conexiunea este acceptată doar dacă IP-ul PC-ului este setat la 192.168.10.100.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce <code>permit ip any any</code> la final în GUEST-IN? (2) Ce s-ar întâmpla dacă ai pune linia „permit ip any any” pe poziția 5? (3) Cum ai afla dacă un ACL e aplicat pe o interfață?</p>
          <Reveal label="Indicii">
            <p>(1) Pentru a nu bloca restul traficului din cauza deny-ului implicit. (2) Ar potrivi orice pachet înaintea deny-urilor și le-ar anula. (3) <code>show ip interface &lt;if&gt;</code> arată „Inbound/Outbound access list is …”.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't56s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.6-S" title="Lab solo — politica nu funcționează" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a configurat ACL-urile pentru aceeași topologie (Staff, Guest, Server), dar politica nu se respectă: oaspeții pot face ping la server, iar staff-ul nu mai ajunge deloc la server. Găsește defectele (sunt cel puțin trei) și corectează-le. <br /><b>Timp estimat:</b> 40–50 min · <b>Unealtă:</b> Packet Tracer · <b>Nivel:</b> intermediar–avansat</p>
      </Summary>
      <Figure caption="Topologie solo: aceeași ca la labul ghidat.">
        <LabSoloTopology56 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: staff → server, toate serviciile; guest → server doar HTTP (TCP 80); ping guest → server refuzat; VTY permis doar de la 192.168.10.100. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Configurația primită (extras)">
        <Step labKey={L} n={1} title="Citește configurația">
          <CodeBlock title="R1 (extras)" kind="config" code={`ip access-list extended GUEST-IN
 permit ip any any
 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 80
 deny ip 192.168.20.0 0.0.0.255 10.1.1.0 0.0.0.255
!
ip access-list extended STAFF-OUT
 deny ip 192.168.20.0 255.255.255.0 any
!
interface GigabitEthernet0/0
 ip address 192.168.10.1 255.255.255.0
 ip access-group GUEST-IN in
interface GigabitEthernet0/1
 ip address 192.168.20.1 255.255.255.0
interface GigabitEthernet0/2
 ip address 10.1.1.1 255.255.255.0
 ip access-group STAFF-OUT out
!
access-list 10 permit 192.168.10.100
line vty 0 15
 transport input ssh`} explain={[
            ['GUEST-IN linia 1', '„permit ip any any” este prima linie.'],
            ['ip access-group pe Gi0/0', 'ACL-ul de oaspeți e pe interfața Staff.'],
            ['STAFF-OUT', 'Folosește o mască (255.255.255.0) în loc de wildcard.'],
            ['line vty', 'Lipsește access-class 10.'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Ordine greșită în GUEST-IN</b>: <code>permit ip any any</code> pe prima linie anulează deny-urile de sub el (oaspeții ajung peste tot, inclusiv ping).</li>
              <li><b>ACL aplicat pe interfața greșită</b>: GUEST-IN este pe Gi0/0 (Staff), nu pe Gi0/1 (Guest); astfel oaspeții nu sunt filtrați deloc, iar staff-ul este filtrat de o regulă care nu-l privește.</li>
              <li><b>Mască în loc de wildcard</b> în STAFF-OUT (<code>255.255.255.0</code>): potrivește cu totul alte adrese (ignoră primii trei octeți!), iar ACL-ul are doar un deny și deny-ul implicit blochează tot traficul către servere, inclusiv al staff-ului.</li>
              <li><b>Lipsește <code>access-class 10 in</code></b> pe VTY: ACL-ul 10 există, dar nu e aplicat; orice gazdă poate încerca SSH.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# no ip access-list extended GUEST-IN
R1(config)# ip access-list extended GUEST-IN
R1(config-ext-nacl)# permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 80
R1(config-ext-nacl)# deny ip 192.168.20.0 0.0.0.255 10.1.1.0 0.0.0.255
R1(config-ext-nacl)# permit ip any any
R1(config-ext-nacl)# exit
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# no ip access-group GUEST-IN in
R1(config-if)# interface gigabitEthernet 0/1
R1(config-if)# ip access-group GUEST-IN in
R1(config-if)# interface gigabitEthernet 0/2
R1(config-if)# no ip access-group STAFF-OUT out
R1(config-if)# exit
R1(config)# no ip access-list extended STAFF-OUT
R1(config)# line vty 0 15
R1(config-line)# access-class 10 in`} explain={[
              ['GUEST-IN reordonat', 'Specific înaintea generalului: permit 80, deny către servere, permit rest.'],
              ['mută ACL-ul pe Gi0/1', 'Filtrarea trebuie lângă sursa oaspeților.'],
              ['șterge STAFF-OUT', 'ACL-ul era greșit și inutil; politica e acoperită de GUEST-IN.'],
              ['access-class 10 in', 'Aplică restricția pe VTY.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Din PC-Staff: ping și HTTP către server. Din PC-Guest: HTTP și ping către server. Ce arată <code>show access-lists</code> după teste?</p>
          <Reveal label="Răspuns">
            <p>Staff → server: totul funcționează. Guest → server: HTTP merge, ping eșuează. <code>show access-lists</code> arată contor pe linia permit TCP 80 și pe linia deny (ping), iar linia finală permit ip any any numără restul traficului oaspeților.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
