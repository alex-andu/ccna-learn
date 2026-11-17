import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology35, LabSoloTopology35 } from '../../diagrams/t3_5';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't35g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 3.5-G" title="Lab ghidat — HSRP: gateway virtual, failover, preempt, tracking" />
      <Summary>
        <p><b>Obiectiv:</b> vezi problema (fără FHRP, căderea lui R1 oprește PC-urile), configurezi HSRP pe R1 și R2, verifici rolurile, simulezi căderea lui R1, observi preempt la revenire și adaugi tracking.
          <br /><b>Timp estimat:</b> 60–80 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × router 2911, 1 × switch 2960, 2 × PC) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC1 și PC2 în LAN-ul 192.168.10.0/24, R1 și R2 ca gateway-uri HSRP (VIP .254), R3 ca destinație.">
        <LabGuidedTopology35 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4', 'Conectat la']} rows={[
        ['R1', 'Gi0/0', '192.168.10.1/24', 'SW1'],
        ['R1', 'Gi0/1', '10.0.1.1/30', 'R3 Gi0/0'],
        ['R2', 'Gi0/0', '192.168.10.2/24', 'SW1'],
        ['R2', 'Gi0/1', '10.0.2.1/30', 'R3 Gi0/1'],
        ['R3', 'Gi0/0', '10.0.1.2/30', 'R1 Gi0/1'],
        ['R3', 'Gi0/1', '10.0.2.2/30', 'R2 Gi0/1'],
        ['R3', 'Lo0', '203.0.113.1/32', '— (destinația)'],
        ['PC1', 'NIC', '192.168.10.11/24', 'SW1'],
        ['PC2', 'NIC', '192.168.10.12/24', 'SW1'],
        ['Virtual (HSRP)', '—', '192.168.10.254', 'grup 1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Suportul pentru comenzile <code>standby</code> (în special <code>version 2</code> și <code>track</code>) depinde de modelul și versiunea PT; dacă o comandă nu e acceptată, sari peste ea și notează. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Rutarea este doar statică (3.3), iar „căderea lui R1” se simulează cu <code>shutdown</code> pe ambele interfețe ale lui R1. Același lab merge în GNS3/CML cu IOSv.
      </Callout>

      <Detailed title="Partea 0 — Adresare și rutare statică">
        <Step labKey={L} n={1} title="Adresare">
          <p>Configurează adresele din tabel pe R1, R2, R3 (inclusiv <code>loopback 0</code> pe R3) și pe PC-uri. <b>Deocamdată</b> PC-urile folosesc ca gateway adresa reală a lui R1: 192.168.10.1.</p>
          <Reveal label="Soluție (R1)">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# interface g0/1
R1(config-if)# ip address 10.0.1.1 255.255.255.252
R1(config-if)# no shutdown`} explain={[
              ['no shutdown', 'Pornește interfața; fără el rămâne administrativ down.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Rute statice">
          <p>R1 și R2 au câte o rută implicită spre R3. R3 are rute către LAN: primară prin R1 și flotantă prin R2.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1, R2, R3" kind="config" code={`R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.1.2
R2(config)# ip route 0.0.0.0 0.0.0.0 10.0.2.2
R3(config)# ip route 192.168.10.0 255.255.255.0 10.0.1.1
R3(config)# ip route 192.168.10.0 255.255.255.0 10.0.2.1 5`} explain={[
              ['ip route 0.0.0.0 0.0.0.0 …', 'Ruta implicită: tot ce nu e cunoscut merge spre R3.'],
              ['… 10.0.2.1 5', 'Ruta flotantă (AD 5): se instalează doar dacă ruta cu AD 1 dispare, adică atunci când legătura lui R3 cu R1 cade.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Test fără FHRP">
          <p>Din PC1: <code>ping 203.0.113.1</code>. Apoi pe R1 dă <code>shutdown</code> pe Gi0/0 și Gi0/1 (simulezi căderea) și repetă ping-ul. Ce se întâmplă, deși R2 funcționează?</p>
          <Reveal label="Răspuns">
            <p>Prima oară reușește. După căderea lui R1, ping-ul eșuează: PC1 trimite spre 192.168.10.1, care nu mai există, iar R2 nu are cum să preia o adresă pe care gazda nu o folosește. Aceasta este problema pe care o rezolvă FHRP. Repornește interfețele lui R1 (<code>no shutdown</code>) înainte de pasul următor.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Configurarea HSRP">
        <Step labKey={L} n={4} title="HSRP pe R1 (Active dorit)">
          <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# standby 1 ip 192.168.10.254
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt`} explain={[
            ['standby 1 ip 192.168.10.254', 'Adresa virtuală a grupului 1.'],
            ['priority 110', 'Mai mare decât 100, deci R1 va fi Active.'],
            ['preempt', 'R1 își recapătă rolul după revenire.'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="HSRP pe R2 (Standby)">
          <CodeBlock title="R2" kind="config" code={`R2(config)# interface g0/0
R2(config-if)# standby 1 ip 192.168.10.254`} explain={[
            ['standby 1 ip …', 'Același grup și aceeași adresă virtuală; prioritatea rămâne 100.'],
          ]} />
        </Step>
        <Step labKey={L} n={6} title="Gateway-ul gazdelor devine adresa virtuală">
          <p>Pe PC1 și PC2 schimbă gateway-ul în <b>192.168.10.254</b>. Din PC1 dă <code>ping 203.0.113.1</code>. Apoi <code>arp -a</code> pe PC1: ce MAC are .254?</p>
          <Reveal label="Răspuns">
            <p>Ping-ul reușește. În cache-ul ARP, .254 corespunde MAC-ului virtual, în forma 0000.0C07.AC01 la HSRPv1, grupul 1 (în PT formatul și existența comenzii pot diferi). Nu este MAC-ul real al lui R1 sau R2.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Verifică rolurile">
          <p>Pe R1 și R2: <code>show standby brief</code> și <code>show standby</code>. Cine e Active, cine Standby, ce prioritate au, ce timere?</p>
          <Reveal label="Răspuns">
            <p>R1: Active, priority 110, P (preempt). R2: Standby, priority 100. Hello 3 s, hold 10 s. Adresa virtuală: 192.168.10.254.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Failover, preempt și tracking">
        <Step labKey={L} n={8} title="Simulează căderea lui R1">
          <p>Din PC1 pornește un ping continuu (<code>ping -t 203.0.113.1</code>). Pe R1 dă <code>shutdown</code> pe Gi0/0 și Gi0/1. Observă câte răspunsuri se pierd, apoi <code>show standby brief</code> pe R2.</p>
          <Reveal label="Răspuns">
            <p>Se pierd câteva ping-uri (în ordinea hold time-ului, aproximativ 10 s pe valorile implicite; în PT timpii pot diferi), apoi traficul reia fără modificări pe PC1. R2 devine Active. Calea de întoarcere trece acum prin ruta flotantă de pe R3, care s-a instalat după căderea legăturii cu R1.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={9} title="R1 revine: preempt">
          <p>Pe R1 dă <code>no shutdown</code> pe ambele interfețe. Cine devine Active? Apoi scoate <code>standby 1 preempt</code> de pe R1, repetă căderea și revenirea. Ce diferență observi?</p>
          <Reveal label="Răspuns">
            <p>Cu preempt, R1 (priority 110) își recapătă rolul Active după ce revine. Fără preempt, R2 rămâne Active, iar R1 devine Standby, deși are prioritatea mai mare. Repune <code>standby 1 preempt</code> pe R1.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={10} title="Tracking pe uplink">
          <CodeBlock title="R1 și R2" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# standby 1 track GigabitEthernet0/1 20

R2(config)# interface g0/0
R2(config-if)# standby 1 preempt`} explain={[
            ['standby 1 track GigabitEthernet0/1 20', 'La căderea uplinkului, prioritatea lui R1 scade cu 20 (110 → 90).'],
            ['standby 1 preempt (pe R2)', 'Permite lui R2 să preia când prioritatea lui R1 scade sub 100.'],
          ]} />
          <p>Dă <code>shutdown</code> doar pe <b>Gi0/1</b> al lui R1 (Gi0/0 rămâne up). Ce se întâmplă cu rolurile? De ce e important?</p>
          <Reveal label="Răspuns">
            <p>R1 rămâne în viață pe LAN, dar și-a pierdut uplinkul. Prioritatea lui scade la 90, R2 (100, cu preempt) devine Active, iar traficul gazdelor ia calea sănătoasă. Fără tracking, R1 ar fi rămas Active și ar fi blocat traficul. Dacă PT nu acceptă <code>track</code>, descrie în scris ce ar face.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={11} title="Reflecție">
          <p>Răspunde în scris: (1) De ce gazdele nu au observat schimbarea adresei sau MAC-ului? (2) Ce ar fi trebuit schimbat pe PC-uri la o cădere fără HSRP? (3) Ce se întâmplă dacă pui versiuni HSRP diferite pe cele două routere?</p>
          <Reveal label="Indicii">
            <p>(1) Adresa și MAC-ul virtuale sunt aceleași, indiferent de Active. (2) Gateway-ul, pe fiecare gazdă, manual. (3) Versiunile nu interoperează: fiecare router se vede singur în grup și devine Active (dublu Active).</p>
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
  const L = 't35s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 3.5-S" title="Lab solo — două grupuri HSRP și un defect de diagnosticat" />
      <Summary>
        <p><b>Scenariu:</b> routerele A și B sunt gateway-uri pentru LAN-ul 172.16.5.0/24 (A = .1, B = .2). PC-A trebuie să folosească A ca gateway activ, PC-B pe B, iar fiecare router este rezerva celuilalt. Ambele routere ajung la ISP prin legături statice. Un defect este ascuns în configurație; îl găsești cu <code>show standby</code>.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Packet Tracer (3 routere, 1 switch, 2 PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: A și B pe același LAN, cu legături separate spre ISP.">
        <LabSoloTopology35 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['A', 'Gi0/0 · Gi0/1', '172.16.5.1/24 · 10.9.1.1/30'],
        ['B', 'Gi0/0 · Gi0/1', '172.16.5.2/24 · 10.9.2.1/30'],
        ['ISP', 'Gi0/0 · Gi0/1 · Lo0', '10.9.1.2/30 · 10.9.2.2/30 · 198.51.100.1/32'],
        ['PC-A', 'NIC', '172.16.5.11/24 · gw 172.16.5.253'],
        ['PC-B', 'NIC', '172.16.5.12/24 · gw 172.16.5.254'],
      ]} />
      <Callout kind="info" title="Cerințe">
        Grupul 1: virtual 172.16.5.254, Active = A (priority 110, preempt). Grupul 2: virtual 172.16.5.253, Active = B (priority 110, preempt). Rutare statică spre ISP și înapoi (ISP: rută către 172.16.5.0/24 prin ambele legături). Aceeași versiune HSRP pe ambele routere. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Adresare și rutare">
          <p>Adresează dispozitivele. Pe A și B, rută implicită spre ISP. Pe ISP, rute pentru 172.16.5.0/24 prin ambele legături (ECMP) sau cu o rută flotantă.</p>
          <Reveal label="Indiciu">
            <p>Cu ECMP, ISP împarte traficul de întoarcere între A și B; asta funcționează, deoarece ambele routere au LAN-ul direct conectat.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="HSRP pe două grupuri">
          <p>Configurează grupurile 1 și 2 cu priorități inversate. Verifică cu <code>show standby brief</code> că A este Active pe grupul 1 și Standby pe 2, iar B invers.</p>
          <Reveal label="Soluție">
            <CodeBlock title="A și B" kind="config" code={`A(config)# interface g0/0
A(config-if)# standby 1 ip 172.16.5.254
A(config-if)# standby 1 priority 110
A(config-if)# standby 1 preempt
A(config-if)# standby 2 ip 172.16.5.253

B(config)# interface g0/0
B(config-if)# standby 1 ip 172.16.5.254
B(config-if)# standby 2 ip 172.16.5.253
B(config-if)# standby 2 priority 110
B(config-if)# standby 2 preempt`} explain={[
              ['standby 1 … / standby 2 …', 'Două grupuri independente pe aceeași interfață, cu adrese virtuale diferite.'],
              ['priority 110 + preempt', 'Fiecare router este Active în grupul lui și rezerva în celălalt.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={3} title="Defectul">
          <p>Un coleg a modificat un router: ambele routere afișează acum State <b>Active</b> pentru grupul 1. Cu <code>show standby</code> pe ambele routere găsește cauza fără să te uiți direct la configurația colegului (folosește doar comenzile show), apoi repar-o.</p>
          <Reveal label="Cauza și remedierea">
            <p>Pe B a fost setat <code>standby version 2</code>, iar pe A rămâne versiunea 1. Versiunile nu interoperează, deci routerele nu se aud între ele și fiecare devine Active. Remediere: aceeași versiune pe ambele (de exemplu <code>no standby version</code> pe B sau <code>standby version 2</code> pe A), apoi verifică din nou rolurile.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Din PC-A și PC-B ping către 198.51.100.1. Simulează căderea lui A (shutdown pe interfețe): cine devine Active pe grupul 1? Ce gateway folosesc în continuare PC-urile?</p>
          <Reveal label="Răspuns">
            <p>B devine Active și pe grupul 1, deci B forwardează pentru ambele adrese virtuale. PC-urile nu schimbă nimic: continuă să folosească .253 și .254.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
