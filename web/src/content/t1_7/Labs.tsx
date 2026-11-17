import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { P, Step } from '../../components/LabStep';
import { LabGuidedTopology, LabSoloTopology } from '../../diagrams/t1_7';

/* ======================================================================
   LAB GHIDAT — de ce nu merge o adresă privată pe Internet, apoi PAT
   ====================================================================== */
export function GuidedLab() {
  const L = 'g1';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 1.7-G" title="Lab ghidat — de ce pică adresa privată și cum o salvează PAT (Packet Tracer)" />
      <Summary>
        <p><b>Obiectiv:</b> construiești un LAN privat (192.168.1.0/24) în spatele unui router „de acasă”, observi că un ping către un server public <b>eșuează fără NAT</b> și apoi îl faci să funcționeze cu <G id="pat" />. Vezi cu ochii tăi tabela de traduceri și diferența dintre <G id="inside-local" /> și <G id="inside-global" />.
          <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> Cisco Packet Tracer 8.x/9.x (alternativ GNS3/CML cu imagini IOS) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologia labului ghidat. „Internetul” este simulat de R-ISP și de serverul WEB; adresele publice sunt blocuri de documentație.">
        <LabGuidedTopology />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'Adresă', 'Note']} rows={[
        ['PC0', 'FastEthernet0', '192.168.1.10/24', 'gateway 192.168.1.1'],
        ['PC1', 'FastEthernet0', '192.168.1.11/24', 'gateway 192.168.1.1'],
        ['SW1', '—', '—', 'switch Layer 2, configurație implicită'],
        ['R-HOME', 'G0/0', '192.168.1.1/24', 'LAN privat'],
        ['R-HOME', 'G0/1', '203.0.113.2/30', 'WAN („adresă publică”)'],
        ['R-ISP', 'G0/0', '203.0.113.1/30', 'spre R-HOME'],
        ['R-ISP', 'G0/1', '198.51.100.1/24', 'spre server'],
        ['WEB (Server-PT)', 'FastEthernet0', '198.51.100.10/24', 'gateway 198.51.100.1'],
      ]} />
      <Callout kind="info" title="Ce simulează Packet Tracer și ce nu">
        Packet Tracer modelează corect adresarea, rutarea statică și NAT/PAT (comenzi și tabela de traduceri). Nu simulează filtrarea bogon a ISP-urilor reale: aici „ISP-ul” nu aruncă pachetele cu sursă privată din oficiu, ci doar nu are <b>rută de întoarcere</b> către 192.168.1.0/24 — efectul vizibil este același (răspunsul nu ajunge). Comenzile nu au fost testate pe echipamente reale; adaptează numele interfețelor la modelul tău.
      </Callout>

      <Detailed title="Pași">
        <Step labKey={L} n={1} title="Plasează și conectează dispozitivele">
          <p><P>Network Devices → Routers</P>: două routere (2911 sau similar), redenumește-le <code>R-HOME</code> și <code>R-ISP</code>. <P>Switches</P>: un 2960 (<code>SW1</code>). <P>End Devices</P>: două PC-uri și un <b>Server-PT</b> (<code>WEB</code>). Cabluri <b>Copper Straight-Through</b>: PC0 și PC1 → SW1; SW1 → R-HOME <code>G0/0</code>. Între routere: <b>Copper Cross-Over</b> R-HOME <code>G0/1</code> ↔ R-ISP <code>G0/0</code>; R-ISP <code>G0/1</code> → WEB (cross-over, host la router).</p>
          <Reveal label="De ce cross-over între routere?"><p>Router ↔ router și router ↔ PC folosesc același tip de interfață (MDI), deci cablul trebuie încrucișat. Switch ↔ router sau switch ↔ PC folosesc cablu direct. (Pe interfețele Gigabit moderne, auto-MDIX acceptă oricare, dar PT respectă regula clasică.)</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Adresează PC-urile și serverul (static)">
          <p>Pe fiecare dispozitiv: <P>Desktop → IP Configuration → Static</P>. PC0: <code>192.168.1.10</code>/255.255.255.0, gateway <code>192.168.1.1</code>. PC1: <code>192.168.1.11</code>, același gateway. WEB: <code>198.51.100.10</code>/255.255.255.0, gateway <code>198.51.100.1</code>.</p>
          <Reveal label="Care sunt adresele „private” și care cele „publice” din tabel?"><p>192.168.1.x este privată (RFC 1918). 203.0.113.x și 198.51.100.x sunt blocuri de documentație (RFC 5737), folosite aici în locul unor adrese publice reale — se comportă ca publice în laborator.</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Configurează R-HOME (adresare + rută implicită)">
          <CodeBlock title="R-HOME" code={`enable
configure terminal
hostname R-HOME
interface GigabitEthernet0/0
 description LAN privat
 ip address 192.168.1.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/1
 description WAN spre ISP
 ip address 203.0.113.2 255.255.255.252
 no shutdown
exit
ip route 0.0.0.0 0.0.0.0 203.0.113.1
end
copy running-config startup-config`} explain={[
            ['ip address 192.168.1.1 255.255.255.0', 'Gateway-ul LAN-ului, adresă privată (RFC 1918).'],
            ['ip address 203.0.113.2 255.255.255.252', 'Adresa „publică” de pe WAN. Un /30 are 2 adrese utilizabile: .1 (ISP) și .2 (R-HOME).'],
            ['no shutdown', 'Interfețele routerelor sunt oprite implicit (administratively down).'],
            ['ip route 0.0.0.0 0.0.0.0 203.0.113.1', 'Ruta implicită: tot ce nu este local pleacă spre ISP.'],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="Configurează R-ISP — fără nicio rută spre LAN-ul privat">
          <CodeBlock title="R-ISP" code={`enable
configure terminal
hostname R-ISP
interface GigabitEthernet0/0
 ip address 203.0.113.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 198.51.100.1 255.255.255.0
 no shutdown
end
copy running-config startup-config`} explain={[
            ['ip address 203.0.113.1 255.255.255.252', 'Capătul ISP al legăturii WAN.'],
            ['ip address 198.51.100.1 255.255.255.0', 'Rețeaua „publică” a serverului.'],
            ['(fără ip route)', <>Observă ce lipsește: <b>nu există nicio rută către 192.168.1.0/24</b>. Exact ca în realitate: ISP-ul nu știe de rețelele private ale clienților.</>],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="Verifică conectivitatea locală">
          <p>Din PC0 (<P>Desktop → Command Prompt</P>): <code>ping 192.168.1.1</code> (gateway) și <code>ping 192.168.1.11</code> (PC1). Din R-HOME: <code>ping 203.0.113.1</code>. Toate trebuie să răspundă.</p>
          <Reveal label="Nu răspunde ceva?"><ul>
            <li>Interfață „administratively down”? Lipsește <code>no shutdown</code> (<code>show ip interface brief</code>).</li>
            <li>Mască greșită sau gateway greșit pe PC? Verifică cu <code>ipconfig</code>.</li>
            <li>Legătura roșie în PT? Tip de cablu greșit sau interfață oprită.</li>
          </ul></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Experimentul: ping către server FĂRĂ NAT">
          <CodeBlock title="PC0 — Command Prompt" kind="session" code={`C:\\> ping 198.51.100.10
Pinging 198.51.100.10 with 32 bytes of data:
Request timed out.
Request timed out.
Request timed out.
Request timed out.`} explain={[
            ['ping 198.51.100.10', 'Pachetul pleacă cu sursa 192.168.1.10 (privată). Ajunge la server, dar serverul răspunde către 192.168.1.10, iar R-ISP nu are nicio rută spre ea, deci răspunsul se pierde.'],
          ]} />
          <p>Treci în <b>Simulation mode</b> (<P>Realtime ↔ Simulation</P>, colțul din dreapta jos), filtrează <b>ICMP</b> și urmărește pachetul: ajunge la WEB, dar întoarcerea se oprește la R-ISP.</p>
          <Reveal label="De ce eșuează? Ce arată mesajul de la R-ISP?"><p>Pachetul de întoarcere are destinația 192.168.1.10, o adresă privată pe care routerul ISP nu o cunoaște. În funcție de versiunea PT poți vedea fie „Request timed out”, fie „Destination host unreachable” (generat de R-ISP). Concluzia contează: <b>adresa privată nu are rută pe „Internet”</b>, deci hostul privat nu poate comunica cu exteriorul fără NAT.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Activează PAT pe R-HOME (previzualizare din 4.1)">
          <Callout kind="info">Configurarea completă NAT este obiectivul <b>4.1</b>. Aici o aplici ca să vezi efectul asupra adreselor private.</Callout>
          <CodeBlock title="R-HOME" code={`configure terminal
access-list 1 permit 192.168.1.0 0.0.0.255
interface GigabitEthernet0/0
 ip nat inside
interface GigabitEthernet0/1
 ip nat outside
exit
ip nat inside source list 1 interface GigabitEthernet0/1 overload
end`} explain={[
            ['access-list 1 permit 192.168.1.0 0.0.0.255', <>Cine are voie să fie tradus: tot LAN-ul 192.168.1.0/24 (wildcard 0.0.0.255, vezi <G id="wildcard-mask" />).</>],
            ['ip nat inside / ip nat outside', 'Marchează interfața LAN ca „inside” și interfața WAN ca „outside”.'],
            ['ip nat inside source list 1 interface GigabitEthernet0/1 overload', <>Sursa pachetelor care se potrivesc cu ACL 1 devine adresa interfeței G0/1 (203.0.113.2). <code>overload</code> = <G id="pat" />.</>],
          ]} />
        </Step>
        <Step labKey={L} n={8} title="Repetă pingul și citește tabela de traduceri">
          <CodeBlock title="PC0 și PC1, apoi R-HOME" kind="session" code={`C:\\> ping 198.51.100.10
Reply from 198.51.100.10: bytes=32 time=2ms TTL=126
R-HOME# show ip nat translations
Pro  Inside global      Inside local       Outside local      Outside global
icmp 203.0.113.2:1      192.168.1.10:1     198.51.100.10:1    198.51.100.10:1
icmp 203.0.113.2:2      192.168.1.11:1     198.51.100.10:2    198.51.100.10:2
R-HOME# show ip nat statistics
Total active translations: 2 (0 static, 2 dynamic; 2 extended)`} explain={[
            ['Reply from 198.51.100.10', 'Acum funcționează: R-ISP vede o sursă „publică” (203.0.113.2), pe care o cunoaște.'],
            ['Inside global 203.0.113.2:1 / :2', 'Ambele PC-uri apar cu aceeași adresă publică, deosebite prin „port” (la ping, ICMP Identifier).'],
            ['Inside local 192.168.1.10 / .11', 'Adresele private reale — vizibile doar în interiorul LAN-ului.'],
          ]} />
          <Reveal label="Intrările din tabelă au dispărut?"><p>Intrările ICMP expiră repede. Rulează <code>show ip nat translations</code> imediat după ping, sau folosește un client web: pe WEB activează HTTP, apoi deschide <P>Desktop → Web Browser</P> pe PC0 și mergi la <code>http://198.51.100.10</code>; intrările TCP rămân mai mult.</p></Reveal>
        </Step>
        <Step labKey={L} n={9} title="Experimente de înțelegere">
          <ul>
            <li>Din WEB, <code>ping 192.168.1.10</code> → eșuează: traficul <b>inițiat din exterior</b> nu are intrare în tabela PAT. Dar <code>ping 203.0.113.2</code> (adresa routerului) reușește.</li>
            <li>Șterge traducerile (<code>clear ip nat translation *</code>) și repetă pingul: tabela se reface.</li>
            <li>Oprește interfața WAN a lui R-HOME (<code>shutdown</code> pe G0/1), repetă pingul și observă că eșuează; repornește cu <code>no shutdown</code> și verifică din nou. Așa vezi că NAT depinde de rutare: traducerea nu ajută dacă pachetul nu are pe unde pleca.</li>
          </ul>
        </Step>
      </Detailed>

      <Reveal label="Soluție completă — rezumat configurație">
        <CodeBlock title="R-HOME (final)" code={`hostname R-HOME
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 ip nat inside
 no shutdown
interface GigabitEthernet0/1
 ip address 203.0.113.2 255.255.255.252
 ip nat outside
 no shutdown
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface GigabitEthernet0/1 overload
ip route 0.0.0.0 0.0.0.0 203.0.113.1`} />
        <CodeBlock title="R-ISP (final)" code={`hostname R-ISP
interface GigabitEthernet0/0
 ip address 203.0.113.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 198.51.100.1 255.255.255.0
 no shutdown`} />
        <p className="small muted">Versiune GNS3/CML: aceleași comenzi pe imagini IOS/IOSv; interfețele pot avea alte nume (GigabitEthernet0/0, 0/1…). Laboratorul nu depinde de wireless.</p>
      </Reveal>
    </section>
  );
}

/* ======================================================================
   LAB SOLO — două case cu aceleași adrese private
   ====================================================================== */
export function SoloLab() {
  const L = 's1';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 1.7-S" title="Lab solo — două case, aceeași rețea privată" />
      <Summary>
        <p><b>Scenariu:</b> două case (A și B) folosesc <b>exact aceeași</b> rețea privată 192.168.1.0/24, iar PC-urile au chiar aceeași adresă <code>192.168.1.10</code>. Ambele ies pe Internet prin același ISP. Rezolvă singur, fără indicii, apoi compară cu soluția ascunsă.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer / GNS3 / CML</p>
      </Summary>
      <Figure caption="Topologia labului solo.">
        <LabSoloTopology />
      </Figure>
      <Table head={['Legătură', 'Capăt 1', 'Capăt 2']} rows={[
        ['Casa A ↔ ISP', 'R-A G0/1 = 203.0.113.2/30', 'R-ISP G0/0 = 203.0.113.1/30'],
        ['Casa B ↔ ISP', 'R-B G0/1 = 203.0.113.6/30', 'R-ISP G0/2 = 203.0.113.5/30'],
        ['ISP ↔ server', 'R-ISP G0/1 = 198.51.100.1/24', 'WEB = 198.51.100.10/24'],
        ['LAN Casa A', 'R-A G0/0 = 192.168.1.1/24', 'PC-A = 192.168.1.10/24'],
        ['LAN Casa B', 'R-B G0/0 = 192.168.1.1/24', 'PC-B = 192.168.1.10/24'],
      ]} />
      <Detailed title="Cerințe">
        <Step labKey={L} n={1} title="Construiește topologia și adresează toate interfețele după tabel">
          <p>PC-urile folosesc gateway-ul <code>192.168.1.1</code>; serverul folosește <code>198.51.100.1</code>. Pe R-A și R-B: rută implicită spre ISP (<code>.1</code>, respectiv <code>.5</code>). Pe R-ISP: <b>nu</b> adăuga nicio rută spre 192.168.1.0/24.</p>
        </Step>
        <Step labKey={L} n={2} title="Demonstrează problema">
          <p>Fără NAT, din PC-A și din PC-B: <code>ping 198.51.100.10</code>. Explică în 2–3 propoziții de ce eșuează <b>și</b> de ce ISP-ul nu ar putea rezolva problema nici dacă ar vrea (ce ar trebui să facă R-ISP cu două rețele identice 192.168.1.0/24?).</p>
        </Step>
        <Step labKey={L} n={3} title="Configurează PAT pe ambele routere">
          <p>Pe R-A și pe R-B: marchează interfețele inside/outside, permite 192.168.1.0/24 printr-un ACL și folosește <code>overload</code> pe interfața WAN.</p>
        </Step>
        <Step labKey={L} n={4} title="Verifică și interpretează">
          <p>Ping din PC-A și PC-B către WEB trebuie să reușească. Pe R-A și R-B: <code>show ip nat translations</code>. Răspunde: ce adresă <b>inside global</b> are fiecare casă? Ce adresă (și pe ce interfață) vede R-ISP ca sursă pentru fiecare ping? Rezolvă faptul că ambele PC-uri au aceeași adresă privată?</p>
        </Step>
        <Step labKey={L} n={5} title="Teste de înțelegere">
          <ul>
            <li>Din WEB, încearcă <code>ping 192.168.1.10</code>. Ce se întâmplă și de ce? Ce ar trebui configurat pe R-A ca un server din casa A să fie accesibil din Internet (nume conceptual: ce tip de NAT)?</li>
            <li>Imaginează-ți că R-ISP ar atribui R-A pe WAN adresa <code>100.64.0.2</code> și ar face el NAT mai departe. Cum ai recunoaște situația și ce nu ai mai putea face?</li>
            <li>Care dintre adresele 172.15.1.1, 172.20.1.1, 100.100.1.1, 169.254.2.2 și 192.168.300.1 sunt private RFC 1918, care sunt publice, care speciale și care invalide?</li>
          </ul>
        </Step>
      </Detailed>

      <Reveal label="Soluție completă">
        <CodeBlock title="R-A" code={`hostname R-A
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 ip nat inside
 no shutdown
interface GigabitEthernet0/1
 ip address 203.0.113.2 255.255.255.252
 ip nat outside
 no shutdown
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface GigabitEthernet0/1 overload
ip route 0.0.0.0 0.0.0.0 203.0.113.1`} />
        <CodeBlock title="R-B" code={`hostname R-B
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 ip nat inside
 no shutdown
interface GigabitEthernet0/1
 ip address 203.0.113.6 255.255.255.252
 ip nat outside
 no shutdown
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface GigabitEthernet0/1 overload
ip route 0.0.0.0 0.0.0.0 203.0.113.5`} />
        <CodeBlock title="R-ISP" code={`hostname R-ISP
interface GigabitEthernet0/0
 ip address 203.0.113.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/2
 ip address 203.0.113.5 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 198.51.100.1 255.255.255.0
 no shutdown`} />
        <ul>
          <li><b>Pas 2:</b> serverul răspunde către 192.168.1.10, iar R-ISP nu are rută spre o rețea privată; mai mult, ar exista <b>două</b> rețele identice în spatele a două legături diferite: rutarea ar fi ambiguă, deci ISP-ul nu poate rezolva problema (adresele private nu sunt unice global).</li>
          <li><b>Pas 4:</b> Casa A apare ca <code>203.0.113.2</code>, Casa B ca <code>203.0.113.6</code>. Pentru R-ISP sunt două adrese publice diferite, deci conflictul dintre cele două 192.168.1.10 dispare: ele nu ajung niciodată dincolo de propriul router.</li>
          <li><b>Din WEB către 192.168.1.10:</b> eșuează, pentru că nu există rută și nici intrare în tabela PAT. Pentru un server public ai nevoie de <b>NAT static / port forwarding</b> (4.1).</li>
          <li><b>100.64.0.2 pe WAN:</b> ar indica CGNAT (NAT444): ai o a doua traducere controlată de ISP, deci nu poți primi conexiuni din exterior nici cu port forwarding pe routerul tău.</li>
          <li><b>Clasificare:</b> 172.15.1.1 = publică; 172.20.1.1 = privată (172.16–31); 100.100.1.1 = Shared Address Space (CGNAT, nu RFC 1918); 169.254.2.2 = link-local/APIPA (nu RFC 1918); 192.168.300.1 = invalidă (octet &gt; 255).</li>
        </ul>
        <Callout kind="warn">Comenzile nu au fost testate pe echipamente reale. În GNS3/CML, interfețele pot avea alte nume; mecanismul rămâne identic.</Callout>
      </Reveal>
    </section>
  );
}
