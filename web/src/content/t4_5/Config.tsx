import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.5" title="Exemple de configurare și verificare (syslog)" />
      <Summary>
        <p>Pașii tipici: timestamps cu dată și oră (<code>service timestamps log datetime msec</code>), destinația externă (<code>logging host</code>), nivelul pentru ea (<code>logging trap</code>), nivelurile locale (<code>logging console</code>, <code>logging buffered</code>) și verificarea cu <code>show logging</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; nivelurile implicite, formatul și mesajele variază între IOS, IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="1. Scenariul: R1 trimite loguri la 10.0.0.50">
        <CodeBlock title="R1 — syslog (ilustrativ)" kind="config" code={`R1(config)# service timestamps log datetime msec
R1(config)# service sequence-numbers
R1(config)# logging host 10.0.0.50
R1(config)# logging trap warnings
R1(config)# logging source-interface loopback0
R1(config)# logging console warnings
R1(config)# logging buffered 16384 informational
R1(config)# line vty 0 4
R1(config-line)# logging synchronous
R1(config-line)# exit
R1(config)# end
R1# terminal monitor`} explain={[
          ['service timestamps log datetime msec', 'Fiecare mesaj primește data și ora, cu milisecunde.'],
          ['service sequence-numbers', 'Adaugă un număr de ordine mesajelor (util la detectarea pierderilor).'],
          ['logging host 10.0.0.50', 'Destinația syslog: serverul extern (UDP 514 implicit).'],
          ['logging trap warnings', 'Spre server pleacă doar nivelurile 0–4 (emergencies…warnings).'],
          ['logging source-interface loopback0', 'Mesajele ies cu adresa sursă a lui Lo0 (stabilă), ca serverul să recunoască dispozitivul.'],
          ['logging console warnings', 'Consola afișează doar 0–4, mai puțin zgomot.'],
          ['logging buffered 16384 informational', 'Buffer în RAM de 16 KB, nivelurile 0–6.'],
          ['logging synchronous (pe vty)', 'Mesajele nu mai rup linia de comandă pe care o tastezi.'],
          ['terminal monitor', 'În EXEC, afișează logurile în sesiunea curentă (VTY).'],
        ]} />
        <Callout kind="tip" title="Facility pe server">
          <code>logging facility local6</code> schimbă facility-ul din antetul syslog (implicit local7), ca serverul să trimită mesajele acestui dispozitiv într-un fișier separat.
        </Callout>
      </Detailed>

      <Detailed title="2. Verificare">
        <CodeBlock title="R1 — show logging (ilustrativ)" kind="session" code={`R1# show logging
Syslog logging: enabled (0 messages dropped, 3 messages rate-limited, 0 flushes, 0 overruns, xml disabled, filtering disabled)
    Console logging: level warnings, 12 messages logged
    Monitor logging: level debugging, 0 messages logged
    Buffer logging: level informational, 40 messages logged
    Trap logging: level warnings, 18 message lines logged
        Logging to 10.0.0.50  (udp port 514, audit disabled, link up), 6 message lines logged

Log Buffer (16384 bytes):
000041: *Nov 16 10:15:21.842: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down
000042: *Nov 16 10:15:22.842: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down`} explain={[
          ['Console / Monitor / Buffer / Trap logging', 'Nivelul fiecărei destinații și câte mesaje a primit.'],
          ['Logging to 10.0.0.50 (udp port 514 …)', 'Destinația syslog și portul; arată dacă legătura e activă.'],
          ['Log Buffer', 'Mesajele reținute în RAM, cele mai vechi sus; numărul de secvență apare la început.'],
          ['%LINK-3-UPDOWN', 'Facility LINK, severitate 3, mnemonic UPDOWN.'],
        ]} />
        <Table head={['Comandă', 'Ce face']} hlCol={0} rows={[
          [<code key="a">show logging</code>, 'Setările și bufferul de log'],
          [<code key="b">clear logging</code>, 'Șterge bufferul'],
          [<code key="c">logging host &lt;ip&gt;</code>, 'Adaugă o destinație syslog (se pot adăuga mai multe)'],
          [<code key="d">no logging console</code>, 'Oprește logurile pe consolă (util cu debug masiv)'],
          [<code key="e">terminal monitor</code>, 'Arată logurile în sesiunea VTY curentă'],
          [<code key="f">show clock</code>, 'Verifică ora (log-urile folosesc ceasul dispozitivului)'],
        ]} />
        <Reveal label="Lista de verificare când „serverul nu primește loguri”">
          <ol>
            <li>Ping către server; UDP 514 nu e blocat de ACL/firewall?</li>
            <li><code>logging host</code> este configurat (și adresa corectă)?</li>
            <li>Nivelul <code>logging trap</code> este suficient de mare (mesajul tău are severitate ≤ nivel)?</li>
            <li>Serverul ascultă pe UDP 514 și are regulă pentru adresa sursă (<code>logging source-interface</code>)?</li>
            <li>Generează un eveniment de test (de exemplu intrarea/ieșirea din modul de configurare produce %SYS-5-CONFIG_I) și caută-l pe server.</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Mesajele cu severitate mai mare ca număr decât <code>logging trap</code> nu pleacă spre server (de exemplu un 6 cu nivel warnings).</>,
        <>Cu <code>logging console debugging</code> și <code>debug</code> activ, consola poate înmuia routerul; folosește buffer sau VTY.</>,
        <>Output-urile sunt <b>ilustrative</b>; textele și contoarele reale diferă.</>,
      ]} />
      <InlineQuiz ids={['4.5-020', '4.5-021']} />
    </section>
  );
}
