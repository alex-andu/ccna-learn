import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology42, LabSoloTopology42 } from '../../diagrams/t4_2';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't42g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.2-G" title="Lab ghidat — R1 ca sursă de timp, R2 și R3 clienți NTP" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi R1 ca server NTP de laborator și doi clienți, verifici sincronizarea (stratum, asociere, ora) și vezi ce se întâmplă când serverul dispare. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Cisco Packet Tracer (3 × router 2911, 1 × switch 2960) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: R1 (sursa), R2 și R3 (clienți) în LAN-ul 10.0.0.0/24.">
        <LabGuidedTopology42 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4', 'Conectat la']} rows={[
        ['R1', 'Gi0/0', '10.0.0.1/24', 'SW1'],
        ['R2', 'Gi0/0', '10.0.0.2/24', 'SW1'],
        ['R3', 'Gi0/0', '10.0.0.3/24', 'SW1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer simulează NTP în mod limitat: suportul pentru <code>ntp master</code> / <code>ntp server</code> depinde de versiune, iar <code>show ntp status</code> și <code>show ntp associations</code> pot fi incomplete. Dacă o comandă lipsește, descrie în scris ce ar fi afișat. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Același lab funcționează în GNS3/CML cu IOSv.
      </Callout>

      <Detailed title="Partea 0 — Conectivitate">
        <Step labKey={L} n={1} title="Adresare">
          <p>Configurează adresele din tabel, pornește interfețele și verifică <code>ping</code> între toate trei routerele.</p>
          <Reveal label="Soluție (R1)">
            <CodeBlock title="R1" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip address 10.0.0.1 255.255.255.0
R1(config-if)# no shutdown`} explain={[
              ['no shutdown', 'Interfețele routerelor sunt oprite implicit.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Ora de pornire">
          <p>Pe fiecare router: <code>show clock</code>. Ce oră arată? Sunt ceasurile identice? Pe R1 setează manual o oră apropiată de cea reală, în modul privilegiat: <code>clock set 10:00:00 16 November 2026</code>.</p>
          <Reveal label="Răspuns">
            <p>Fiecare router arată o oră implicită diferită (adesea o dată veche) și nu coincid. Asta ilustrează de ce avem nevoie de NTP. R1 își ia ora setată manual, iar R2/R3 o vor primi prin NTP.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Server și clienți">
        <Step labKey={L} n={3} title="R1 server">
          <CodeBlock title="R1" kind="config" code={`R1(config)# ntp master 3
R1(config)# clock timezone CET 1`} explain={[
            ['ntp master 3', 'R1 devine sursă de timp la stratum 3.'],
            ['clock timezone CET 1', 'Setează numele și decalajul fusului orar.'],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="R2 și R3 clienți">
          <CodeBlock title="R2 și R3" kind="config" code={`R2(config)# ntp server 10.0.0.1
R2(config)# clock timezone CET 1
R3(config)# ntp server 10.0.0.1
R3(config)# clock timezone CET 1`} explain={[
            ['ntp server 10.0.0.1', 'Clientul interoghează R1.'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="Verifică sincronizarea">
          <p>Pe R2: <code>show ntp status</code> imediat, apoi după 2–5 minute. Apoi <code>show ntp associations</code> și <code>show clock</code>. Ce stratum are R2? Ce înseamnă <code>*</code>? Ce valoare are <code>reach</code>?</p>
          <Reveal label="Răspuns">
            <p>Imediat: „unsynchronized” (sincronizarea durează). După câteva minute: „Clock is synchronized, stratum 4, reference is 10.0.0.1” (R1 are stratum 3, deci R2 e 4). <code>*</code> = sursa aleasă (sys.peer); <code>reach</code> crește spre 377 (octal) când toate interogările recente reușesc. În PT valorile pot diferi.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Depanare">
        <Step labKey={L} n={6} title="Serverul dispare">
          <p>Pe R1 dă <code>shutdown</code> pe Gi0/0 și așteaptă. Pe R2 urmărește <code>show ntp associations</code> (reach, when). Ce se întâmplă cu ceasul lui R2? Repornește interfața după.</p>
          <Reveal label="Răspuns">
            <p>Valoarea <code>reach</code> coboară (devine 0 după mai multe interogări eșuate), <code>when</code> crește. R2 rămâne pentru un timp „sincronizat” (își continuă ceasul pe baza ultimei măsurători), apoi poate declara „unsynchronized”. La revenirea lui R1, asocierea se reface.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce ar da un client „unsynchronized” deși ping către server merge? (2) Ce stratum ar avea un client al lui R2? (3) De ce setăm același fus orar pe toate dispozitivele?</p>
          <Reveal label="Indicii">
            <p>(1) Serverul însuși nu e sincronizat, UDP 123 e blocat, sau a trecut prea puțin timp. (2) Stratum 5 (R2 + 1). (3) Ca ora afișată în log-uri să fie comparabilă; NTP transportă UTC, fusul se aplică local.</p>
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
  const L = 't42s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.2-S" title="Lab solo — NTP autentificat și un defect de diagnosticat" />
      <Summary>
        <p><b>Scenariu:</b> R1 (10.0.0.1) este sursa de timp (stratum 2) și R2 (10.0.0.2) trebuie să se sincronizeze cu el, folosind autentificare cu cheia 1. După configurare, R2 rămâne „unsynchronized”, deși ping merge. Găsește defectul cu <code>show</code>.
          <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> Packet Tracer (2 routere, 1 switch) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: R1 server, R2 client, SW1.">
        <LabSoloTopology42 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '10.0.0.1/24'],
        ['R2', 'Gi0/0', '10.0.0.2/24'],
      ]} />
      <Callout kind="info" title="Cerințe">
        R1: <code>ntp master 2</code> + autentificare (cheia 1, parola la alegere). R2: client cu aceeași cheie. Fus orar identic. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate (autentificarea NTP poate lipsi în PT; dacă lipsește, descrie în scris diagnoza).
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Server și client cu cheie">
          <p>Configurează autentificarea pe ambele routere și clientul să folosească cheia.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1 și R2" kind="config" code={`R1(config)# ntp master 2
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 LabKey123
R1(config)# ntp trusted-key 1

R2(config)# ntp authenticate
R2(config)# ntp authentication-key 1 md5 LabKey123
R2(config)# ntp trusted-key 1
R2(config)# ntp server 10.0.0.1 key 1`} explain={[
              ['ntp authentication-key 1 md5 …', 'Aceeași cheie și parolă pe ambele routere.'],
              ['ntp trusted-key 1', 'Cheia este de încredere.'],
              ['ntp server … key 1', 'Clientul își autentifică interogările cu cheia 1.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Defectul">
          <p>R2 rămâne „unsynchronized” (stratum 16) după 10 minute; <code>show ntp associations</code> arată R1 fără asterisc. Folosind doar <code>show ntp status</code>, <code>show ntp associations</code> și <code>show running-config | include ntp</code>, găsește cauza (indiciu: compară ce e configurat pe cele două routere) și repar-o.</p>
          <Reveal label="Cauza și remedierea">
            <p>Pe R2 parola cheii este <code>Labkey123</code> (cu „k” mic), iar pe R1 este <code>LabKey123</code>: cheile diferă, deci R2 respinge răspunsurile lui R1. Remediere: setează aceeași parolă pe R2 (<code>ntp authentication-key 1 md5 LabKey123</code>) și așteaptă câteva minute. Alt defect similar: lipsa lui <code>ntp trusted-key 1</code> sau a lui <code>key 1</code> pe linia <code>ntp server</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Test final">
          <p>Verifică din nou <code>show ntp status</code> și <code>show ntp associations</code>. Ce stratum are R2 acum? Ce ar arăta <code>reach</code> dacă R1 ar fi oprit?</p>
          <Reveal label="Răspuns">
            <p>R2 este stratum 3 (R1 are 2). Cu R1 oprit, <code>reach</code> scade progresiv până la 0 și asterisc-ul dispare.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
