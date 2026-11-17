import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.2" title="Exemple de configurare și verificare (NTP)" />
      <Summary>
        <p>Pe client: <code>ntp server &lt;ip&gt;</code>. Pe un server de laborator: <code>ntp master [stratum]</code>. Apoi setezi fusul orar și formatul timestamp-urilor din log și verifici cu <code>show ntp status</code>, <code>show ntp associations</code> și <code>show clock detail</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; coloanele, valorile (offset, delay, timp de referință) și mesajele variază între IOS, IOS XE și Packet Tracer, iar unele comenzi NTP pot lipsi în PT.
      </Callout>

      <Detailed title="Scenariul">
        <p>R1 (10.0.0.1) este sursa de timp a laboratorului. R2 (10.0.0.2) și R3 (10.0.0.3) sunt clienții lui. Toate sunt în LAN-ul 10.0.0.0/24, prin SW1.</p>
        <CodeBlock title="R1 — server (sursă de laborator)" kind="config" code={`R1(config)# ntp master 3
R1(config)# clock timezone CET 1
R1(config)# service timestamps log datetime msec`} explain={[
          ['ntp master 3', 'R1 se declară sursă de timp la stratum 3, chiar dacă propriul ceas nu e sincronizat cu o sursă reală. Clienții lui vor fi stratum 4.'],
          ['clock timezone CET 1', 'Fusul orar local (nume, decalaj față de UTC). NTP transportă UTC; fusul se aplică local.'],
          ['service timestamps log datetime msec', 'Fiecare mesaj din log primește data și ora, cu milisecunde — fără ele, un log sincronizat nu ajută.'],
        ]} />
        <CodeBlock title="R2 și R3 — clienți" kind="config" code={`R2(config)# ntp server 10.0.0.1
R2(config)# clock timezone CET 1
R2(config)# service timestamps log datetime msec`} explain={[
          ['ntp server 10.0.0.1', 'R2 interoghează R1 (UDP 123) și își ajustează ceasul după el.'],
          ['clock timezone CET 1', 'Același fus orar ca pe celelalte dispozitive; altfel ora locală nu ar coincide.'],
        ]} />
        <Callout kind="tip" title="Variante utile">
          <code>ntp server 10.0.0.1 prefer</code> indică serverul preferat când ai mai multe. <code>ntp source loopback0</code> face ca pachetele NTP ale dispozitivului să iasă cu adresa unui loopback (stabilă). <code>ntp update-calendar</code> copiază ora în calendarul hardware (unde există).
        </Callout>
      </Detailed>

      <Detailed title="Verificare">
        <CodeBlock title="R2 — show ntp status (ilustrativ)" kind="session" code={`R2# show ntp status
Clock is synchronized, stratum 4, reference is 10.0.0.1
nominal freq is 250.0000 Hz, actual freq is 249.9990 Hz, precision is 2**18
reference time is E7A1B2C3.4D5E6F70 (10:15:03.301 CET Mon Nov 16 2026)
clock offset is 1.2345 msec, root delay is 1.04 msec
root dispersion is 8.12 msec, peer dispersion is 4.02 msec`} explain={[
          ['Clock is synchronized', 'Răspunsul-cheie: ceasul este sincronizat. Înainte de sincronizare apare „Clock is unsynchronized”.'],
          ['stratum 4, reference is 10.0.0.1', 'R2 e stratum 4 (R1 + 1) și se sincronizează de la 10.0.0.1.'],
          ['clock offset', 'Diferența curentă față de server, în milisecunde (cu cât mai mică, cu atât mai bine).'],
          ['root delay', 'Întârzierea cumulată față de sursa de referință.'],
        ]} />
        <CodeBlock title="R2 — show ntp associations (ilustrativ)" kind="session" code={`R2# show ntp associations
      address         ref clock       st   when   poll reach  delay  offset   disp
*~10.0.0.1        127.127.1.1      3     12     64   377    1.04    1.23   4.02
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured`} explain={[
          ['*', 'Serverul ales ca sursă (sys.peer) — dacă lipsește asteriscul, nu ești sincronizat cu el.'],
          ['~', 'Asociere configurată manual (ntp server …).'],
          ['st', 'Stratum-ul serverului (3); clientul devine 4.'],
          ['when / poll', 'Secunde de la ultima interogare / intervalul de interogare.'],
          ['reach', 'Registru octal al ultimelor 8 interogări (377 = toate reușite; 0 = niciun răspuns).'],
          ['delay / offset', 'Întârzierea tur-retur și diferența de ceas, în milisecunde.'],
        ]} />
        <CodeBlock title="R2 — show clock detail (ilustrativ)" kind="session" code={`R2# show clock detail
10:15:21.842 CET Mon Nov 16 2026
Time source is NTP
Summer time starts 02:00:00 CET Sun Mar 29 2026 ...`} explain={[
          ['Time source is NTP', 'Confirmă că ora provine din NTP (altfel apare „user configuration” sau „hardware calendar”).'],
        ]} />
        <Table head={['Simptom', 'Cauză probabilă', 'Verificare']} hlCol={0} rows={[
          ['Clock is unsynchronized, stratum 16', 'Încă nu a trecut timp / serverul nu răspunde', 'Așteaptă câteva minute; ping la server; show ntp associations'],
          ['reach = 0 pe asociere', 'Niciun răspuns: rută lipsă, ACL pe UDP 123, server oprit', 'ping, show access-lists, show run | include ntp'],
          ['Sincronizat, dar ora locală e „cu o oră în plus/minus”', 'Fus orar sau ora de vară setate greșit', 'show clock detail; clock timezone / clock summer-time'],
          ['Serverul apare dar fără *', 'Serverul nu e ales (nesincronizat sau abatere mare)', 'show ntp status pe server (stratum 16?)'],
        ]} />
      </Detailed>

      <Detailed title="NTP cu autentificare (opțional)">
        <CodeBlock title="R1 și R2 — autentificare cu cheia 1 (ilustrativ)" kind="config" code={`R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 LabKey123
R1(config)# ntp trusted-key 1

R2(config)# ntp authenticate
R2(config)# ntp authentication-key 1 md5 LabKey123
R2(config)# ntp trusted-key 1
R2(config)# ntp server 10.0.0.1 key 1`} explain={[
          ['ntp authenticate', 'Activează autentificarea NTP pe dispozitiv.'],
          ['ntp authentication-key 1 md5 LabKey123', 'Definește cheia 1 (parola partajată, hash MD5). Trebuie să fie identică pe ambele.'],
          ['ntp trusted-key 1', 'Declară cheia 1 de încredere; fără ea, răspunsurile semnate cu ea sunt ignorate.'],
          ['ntp server 10.0.0.1 key 1', 'Pe client: folosește cheia 1 pentru acest server.'],
        ]} />
        <Reveal label="Ce se întâmplă dacă cheile diferă?">
          <p>Clientul nu acceptă răspunsurile: asocierea apare în <code>show ntp associations</code>, dar fără asterisc, iar <code>show ntp status</code> rămâne „unsynchronized”. Diagnoza: compară cheia și <code>trusted-key</code> pe ambele dispozitive (parola nu se vede în clar, deci retastează-o).</p>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Sincronizarea durează minute; nu concluziona „nu merge” după câteva secunde.</>,
        <>Schimbarea parolei cheii pe o singură parte rupe autentificarea; trebuie schimbată identic pe ambele.</>,
        <>Output-urile sunt <b>ilustrative</b>; valorile și coloanele diferă pe echipamentul tău.</>,
      ]} />
      <InlineQuiz ids={['4.2-020', '4.2-021']} />
    </section>
  );
}
