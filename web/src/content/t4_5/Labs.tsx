import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology45, LabSoloTopology45 } from '../../diagrams/t4_5';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't45g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.5-G" title="Lab ghidat — syslog: buffer local și server central" />
      <Summary>
        <p><b>Obiectiv:</b> vezi mesaje de log și le citești (facility, severitate, mnemonic), schimbi nivelurile pe fiecare destinație și trimiți logurile la un server syslog. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router, 1 × switch, 1 × Server cu serviciul Syslog) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: R1, SW1 și un server syslog (10.0.0.50).">
        <LabGuidedTopology45 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '10.0.0.1/24'],
        ['Server syslog', 'NIC', '10.0.0.50/24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer are un serviciu <i>Syslog</i> pe Server (tab Services) și acceptă <code>logging host</code>, <code>logging trap</code>, <code>logging buffered</code> și <code>show logging</code>; unele opțiuni (de exemplu <code>logging facility</code>, <code>source-interface</code>) pot lipsi. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Același lab merge în GNS3/CML cu IOSv și un server rsyslog.
      </Callout>

      <Detailed title="Partea 0 — Mesaje și ora">
        <Step labKey={L} n={1} title="Adresare">
          <p>Configurează Gi0/0 pe R1 și adresa serverului; ping între ele.</p>
        </Step>
        <Step labKey={L} n={2} title="Timestamps">
          <p>Activează <code>service timestamps log datetime msec</code> și setează ora cu <code>clock set</code>. Intră și ieși din modul de configurare (<code>conf t</code> / <code>end</code>). Ce mesaj apare? Descompune-l.</p>
          <Reveal label="Răspuns">
            <p>Apare ceva de forma <code>%SYS-5-CONFIG_I: Configured from console by console</code>: facility SYS, severitate 5 (notifications), mnemonic CONFIG_I. În PT textul exact poate varia.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Eveniment de interfață">
          <p>Dă <code>shutdown</code> și <code>no shutdown</code> pe o interfață. Ce mesaje apar și ce severitate au? Cum le deosebești?</p>
          <Reveal label="Răspuns">
            <p>Două mesaje: <code>%LINK-3-UPDOWN</code> (severitate 3, nivelul fizic) și <code>%LINEPROTO-5-UPDOWN</code> (severitate 5, protocolul de linie). Diferă prin facility și severitate.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Niveluri locale">
        <Step labKey={L} n={4} title="Buffer și consolă">
          <CodeBlock title="R1" kind="config" code={`R1(config)# logging buffered 8192 informational
R1(config)# logging console warnings`} explain={[
            ['logging buffered 8192 informational', 'Buffer în RAM de 8 KB, nivelurile 0–6.'],
            ['logging console warnings', 'Consola primește doar 0–4.']]
          } />
          <p>Repetă evenimentul din pasul 3. Ce apare pe consolă și ce găsești în <code>show logging</code>?</p>
          <Reveal label="Răspuns">
            <p>%LINK-3-UPDOWN (3 ≤ 4) apare pe consolă; %LINEPROTO-5-UPDOWN (5 &gt; 4) nu mai apare pe consolă, dar este în buffer (5 ≤ 6), deci îl vezi în <code>show logging</code>.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Server syslog">
        <Step labKey={L} n={5} title="Trimite loguri la server">
          <CodeBlock title="R1" kind="config" code={`R1(config)# logging host 10.0.0.50
R1(config)# logging trap informational`} explain={[
            ['logging host 10.0.0.50', 'Destinația syslog.'],
            ['logging trap informational', 'Spre server pleacă 0–6.'],
          ]} />
          <p>Pe Server, pornește serviciul Syslog (Services → SYSLOG). Repetă un shutdown/no shutdown și caută mesajele pe server.</p>
          <Reveal label="Răspuns">
            <p>Serverul afișează mesajele primite, cu adresa sursă a lui R1. Cu nivelul <code>informational</code>, ambele mesaje (3 și 5) ajung acolo. Dacă mesajele nu apar, verifică <code>logging host</code>, ping-ul și serviciul de pe server.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Filtrul de severitate">
          <p>Schimbă <code>logging trap errors</code> și repetă evenimentul. Ce mesaje ajung acum pe server? Apoi pune <code>logging trap debugging</code> și activează <code>debug ip icmp</code> sau un debug simplu; ce observi?</p>
          <Reveal label="Răspuns">
            <p>Cu <code>errors</code> (3) ajunge doar %LINK-3-UPDOWN; cele de severitate 5 sunt filtrate. Cu <code>debugging</code> (7) ajung și mesajele de debug, multe și zgomotoase; dezactivează debug-ul după (<code>undebug all</code>).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce „level 4” include și nivelurile 0–3? (2) De ce ai nevoie de NTP pentru un syslog util? (3) Ce se pierde dacă te bazezi doar pe <code>logging buffered</code>?</p>
          <Reveal label="Indicii">
            <p>(1) Filtrul acceptă mesajele cu severitate ≤ nivelul configurat. (2) Ca să poți ordona evenimentele între dispozitive. (3) Bufferul este în RAM și se pierde la repornire; nu e partajat.</p>
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
  const L = 't45s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.5-S" title="Lab solo — logurile nu ajung la server" />
      <Summary>
        <p><b>Scenariu:</b> R1 trebuie să trimită către 10.0.0.50 loguri de severitate warnings sau mai gravă. Serverul nu primește mesajele pentru căderea unei interfețe (%LINK-3-UPDOWN). Găsește defectul cu <code>show</code>.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer (1 router, 1 switch, 1 server) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: R1, SW1, server syslog.">
        <LabSoloTopology45 />
      </Figure>
      <Table head={['Dispozitiv', 'IPv4']} rows={[
        ['R1', '10.0.0.1/24'],
        ['Server syslog', '10.0.0.50/24'],
      ]} />
      <Callout kind="info" title="Cerințe">
        <code>logging host 10.0.0.50</code>, <code>logging trap warnings</code>, buffer local 8192 la informational, timestamps cu dată și oră. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Configurare corectă">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# service timestamps log datetime msec
R1(config)# logging host 10.0.0.50
R1(config)# logging trap warnings
R1(config)# logging buffered 8192 informational`} explain={[
              ['logging trap warnings', 'Spre server pleacă 0–4; %LINK-3-UPDOWN (3) este inclus.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Defectul">
          <p>R1 are <code>logging trap critical</code>, iar serverul nu primește %LINK-3-UPDOWN. Cu <code>show logging</code> găsește nivelul pentru trap și explică de ce mesajul nu pleacă.</p>
          <Reveal label="Cauza și remedierea">
            <p>Nivelul pentru server este <code>critical</code> (2): se trimit doar 0–2. Mesajul %LINK-3-UPDOWN are severitate 3 (3 &gt; 2), deci este filtrat. Remediere: <code>logging trap warnings</code> (0–4) sau <code>errors</code> (0–3). Alte cauze: lipsa <code>logging host</code>, UDP 514 blocat, serviciu oprit pe server.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Test final">
          <p>Generează un shutdown/no shutdown. Ce apare pe server și ce găsești în <code>show logging</code>? Ce mesaj nu apare pe server dar este în buffer?</p>
          <Reveal label="Răspuns">
            <p>Pe server: %LINK-3-UPDOWN (3 ≤ 4). %LINEPROTO-5-UPDOWN (5 &gt; 4) nu pleacă spre server, dar este în buffer (informational, 5 ≤ 6), deci îl vezi în <code>show logging</code>.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
