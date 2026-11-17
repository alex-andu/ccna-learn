import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology41, LabSoloTopology41 } from '../../diagrams/t4_1';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't41g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.1-G" title="Lab ghidat — static NAT, pool și PAT" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi pe R1 trei tipuri de NAT pe rând (static, pool, PAT), citești tabela de traduceri și vezi cum se schimbă ea. <br /><b>Timp estimat:</b> 60–75 min · <b>Unealtă:</b> Cisco Packet Tracer (2 × router 2911, 1 × switch 2960, 2 × PC, 1 × server) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: LAN privat 192.168.1.0/24 în spatele lui R1; ISP simulează Internetul; serverul 198.51.100.5.">
        <LabGuidedTopology41 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4', 'Conectat la']} rows={[
        ['PC1', 'NIC', '192.168.1.10/24 · gw 192.168.1.1', 'SW1'],
        ['PC2', 'NIC', '192.168.1.11/24 · gw 192.168.1.1', 'SW1'],
        ['R1', 'Gi0/0', '192.168.1.1/24 (inside)', 'SW1'],
        ['R1', 'Gi0/1', '203.0.113.2/30 (outside)', 'ISP Gi0/0'],
        ['ISP', 'Gi0/0', '203.0.113.1/30', 'R1 Gi0/1'],
        ['ISP', 'Gi0/1', '198.51.100.1/24', 'Server'],
        ['Server', 'NIC', '198.51.100.5/24 · gw 198.51.100.1', 'ISP Gi0/1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă <code>ip nat inside source</code> static, cu pool și <code>overload</code>; formatul <code>show ip nat translations</code> poate diferi. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Ruta pe ISP pentru adresele publice este necesară ca să ajungă răspunsurile. Același lab merge în GNS3/CML cu IOSv.
      </Callout>

      <Detailed title="Partea 0 — Rețeaua fără NAT">
        <Step labKey={L} n={1} title="Adresare și rute">
          <p>Adresează dispozitivele după tabel. Pe R1 pune o rută implicită spre ISP; pe ISP pune o rută spre blocul public al lui R1.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1 și ISP" kind="config" code={`R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
ISP(config)# ip route 203.0.113.0 255.255.255.0 203.0.113.2`} explain={[
              ['ip route 0.0.0.0 0.0.0.0 203.0.113.1', 'R1 trimite spre ISP tot ce nu cunoaște.'],
              ['ip route 203.0.113.0 255.255.255.0 203.0.113.2', 'ISP știe că adresele publice ale lui R1 (inclusiv pool-ul și adresa statică) se ajung prin R1.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Test fără NAT">
          <p>Din PC1: <code>ping 198.51.100.5</code>. Ce se întâmplă? De ce?</p>
          <Reveal label="Răspuns">
            <p>Ping-ul eșuează: pachetul pleacă cu sursa 192.168.1.10, iar ISP-ul nu are rută spre o adresă privată, deci răspunsul nu poate reveni. Aceasta este problema pe care o rezolvă NAT.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Static NAT">
        <Step labKey={L} n={3} title="Marchează interfețele și configurează static NAT">
          <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip nat inside
R1(config-if)# interface g0/1
R1(config-if)# ip nat outside
R1(config-if)# exit
R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10`} explain={[
            ['ip nat inside / outside', 'Fără ele, nicio traducere nu pornește.'],
            ['ip nat inside source static …', 'PC1 va fi văzut ca 203.0.113.10.'],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="Verifică">
          <p>Din PC1: <code>ping 198.51.100.5</code>. Pe R1: <code>show ip nat translations</code>. Apoi din <b>PC2</b>: ping către același server. Ce observi?</p>
          <Reveal label="Răspuns">
            <p>PC1 ajunge la server; în tabelă apare perechea 203.0.113.10 ↔ 192.168.1.10. PC2 <b>nu</b> are traducere (nu e mapat), deci ping-ul lui eșuează. Static NAT acoperă doar gazda specificată.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Dynamic NAT cu pool">
        <Step labKey={L} n={5} title="Pool de două adrese">
          <CodeBlock title="R1" kind="config" code={`R1(config)# no ip nat inside source static 192.168.1.10 203.0.113.10
R1(config)# ip nat pool POOL1 203.0.113.20 203.0.113.21 netmask 255.255.255.0
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat inside source list 1 pool POOL1`} explain={[
            ['no ip nat inside source static …', 'Scoate regula statică, ca să nu se amestece.'],
            ['ip nat pool POOL1 … 203.0.113.21', 'Pool de doar două adrese (capete incluse), ca să vezi epuizarea.'],
            ['access-list 1 … 0.0.0.255', 'Toate gazdele din /24 au voie să fie traduse.'],
          ]} />
        </Step>
        <Step labKey={L} n={6} title="Epuizarea pool-ului">
          <p>Fă ping din PC1 și din PC2 către server; apoi mai adaugă un al treilea PC (sau folosește a doua adresă) și încearcă din nou. Urmărește <code>show ip nat translations</code> și <code>show ip nat statistics</code>.</p>
          <Reveal label="Răspuns">
            <p>Primele două gazde primesc câte o adresă (.20 și .21). Al treilea PC nu primește traducere, pentru că pool-ul s-a terminat; <code>show ip nat statistics</code> arată pool-ul alocat 100%. <code>clear ip nat translation *</code> eliberează adresele.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — PAT">
        <Step labKey={L} n={7} title="Overload pe interfață">
          <CodeBlock title="R1" kind="config" code={`R1(config)# no ip nat inside source list 1 pool POOL1
R1(config)# ip nat inside source list 1 interface g0/1 overload
R1# clear ip nat translation *`} explain={[
            ['no ip nat inside source list 1 pool POOL1', 'Scoate regula cu pool.'],
            ['… interface g0/1 overload', 'PAT: toate gazdele partajează adresa 203.0.113.2.'],
            ['clear ip nat translation *', 'Curăță tabela ca să vezi traduceri noi.'],
          ]} />
        </Step>
        <Step labKey={L} n={8} title="Observă porturile">
          <p>Din PC1 și PC2 trimite ping/HTTP către server. Pe R1: <code>show ip nat translations</code>. Ce adresă publică și ce porturi apar? Câte gazde se pot conecta acum?</p>
          <Reveal label="Răspuns">
            <p>Toate intrările au aceeași adresă inside global (203.0.113.2), cu porturi/identificatori diferiți. Practic, oricâte gazde (în limita porturilor). Dacă PT afișează formatul altfel, caută aceeași idee: o singură adresă publică, mai multe perechi adresă:port.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={9} title="Reflecție">
          <p>Răspunde în scris: (1) De ce nu poate Internetul să deschidă o conexiune către PC1 cu PAT? (2) Ce comandă adaugi ca să publici un server web din LAN cu o singură adresă publică? (3) Ce se întâmplă cu traducerile dacă ștergi <code>ip nat outside</code> de pe Gi0/1?</p>
          <Reveal label="Indicii">
            <p>(1) Nu există nicio intrare în tabelă până când PC1 trimite primul pachet. (2) Static PAT / port forwarding: <code>ip nat inside source static tcp 192.168.1.10 80 interface g0/1 80</code>. (3) Pachetele nu mai trec din inside în outside, deci nu se mai traduce nimic.</p>
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
  const L = 't41s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.1-S" title="Lab solo — static NAT + PAT și un defect de diagnosticat" />
      <Summary>
        <p><b>Scenariu:</b> LAN-ul 192.168.20.0/24 are două gazde: PC-A (server intern, 192.168.20.10) trebuie să fie vizibil ca 198.51.100.4, iar PC-B (192.168.20.11) și orice altă gazdă trebuie să iasă pe adresa interfeței R1. Un defect este ascuns în configurație; îl găsești cu <code>show</code>.
          <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Packet Tracer (2 routere, 1 switch, 2 PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: R1 (inside Gi0/0, outside Gi0/1) și ISP cu o destinație de test 8.8.8.8 pe Lo0.">
        <LabSoloTopology41 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0 · Gi0/1', '192.168.20.1/24 · 198.51.100.2/29'],
        ['ISP', 'Gi0/0 · Lo0', '198.51.100.1/29 · 8.8.8.8/32'],
        ['PC-A', 'NIC', '192.168.20.10/24 · gw 192.168.20.1'],
        ['PC-B', 'NIC', '192.168.20.11/24 · gw 192.168.20.1'],
      ]} />
      <Callout kind="info" title="Cerințe">
        Static NAT: 192.168.20.10 ↔ 198.51.100.4. PAT pe adresa lui Gi0/1 pentru restul LAN-ului (ACL 10). R1 are rută implicită spre ISP; ISP are rută pentru 198.51.100.0/29 prin R1 (conectată direct) — adresa .4 este în subrețeaua legăturii, deci ISP o rezolvă prin ARP către R1. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Adresare și rute">
          <p>Adresează dispozitivele, adaugă o rută implicită pe R1 spre 198.51.100.1 și testează ping între R1 și ISP.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# ip route 0.0.0.0 0.0.0.0 198.51.100.1`} explain={[
              ['ip route 0.0.0.0 0.0.0.0 198.51.100.1', 'Tot traficul necunoscut merge spre ISP.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Static NAT și PAT">
          <p>Marchează interfețele, configurează static NAT pentru PC-A și PAT pentru restul.</p>
          <Reveal label="Soluție completă">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip nat inside
R1(config-if)# interface g0/1
R1(config-if)# ip nat outside
R1(config-if)# exit
R1(config)# ip nat inside source static 192.168.20.10 198.51.100.4
R1(config)# access-list 10 permit 192.168.20.0 0.0.0.255
R1(config)# ip nat inside source list 10 interface g0/1 overload`} explain={[
              ['ip nat inside source static …', 'PC-A este mereu 198.51.100.4 în exterior.'],
              ['access-list 10 permit 192.168.20.0 0.0.0.255', 'Gazdele care se traduc prin PAT (wildcard corect).'],
              ['… list 10 interface g0/1 overload', 'Restul LAN-ului ies pe adresa lui Gi0/1.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={3} title="Defectul">
          <p>Un coleg a „reparat” ACL-ul și acum PC-B nu mai ajunge la 8.8.8.8, în timp ce PC-A merge. Folosind doar <code>show</code>, găsește cauza (indiciu: compară <code>show access-lists</code> cu <code>show ip nat statistics</code>) și repar-o.</p>
          <Reveal label="Cauza și remedierea">
            <p>ACL 10 conține <code>permit 192.168.2.0 0.0.0.255</code> (a lipsit un „0” din 192.168.20.0). <code>show access-lists</code> arată 0 potriviri (matches), iar <code>show ip nat translations</code> nu are intrări pentru PC-B. PC-A merge pentru că static NAT nu folosește ACL. Remediere: <code>no access-list 10</code>, apoi <code>access-list 10 permit 192.168.20.0 0.0.0.255</code> și <code>clear ip nat translation *</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Din PC-B: <code>ping 8.8.8.8</code>. Din ISP: <code>ping 198.51.100.4</code>. Ce traduceri apar în tabelă? De ce ping-ul din ISP către .4 merge, dar către 198.51.100.2 nu ajunge la PC-B?</p>
          <Reveal label="Răspuns">
            <p>Pentru PC-B apare o intrare PAT cu adresa 198.51.100.2 și port. Ping-ul către .4 merge pentru că există o intrare statică, deci traducerea funcționează din exterior. Adresa .2 este a lui R1 însuși: ping-ul ajunge la R1, nu la un PC, pentru că PAT nu creează intrări pentru conexiuni inițiate din exterior.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
