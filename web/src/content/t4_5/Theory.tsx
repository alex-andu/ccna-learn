import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { LogDestinations, LogFlow, MessageAnatomy, SeverityLevels } from '../../diagrams/t4_5';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.5" title="Syslog — imaginea de ansamblu" />
      <Summary>
        <p><G id="syslog" /> este standardul prin care dispozitivele de rețea își <b>înregistrează evenimentele</b> (un link care cade, o configurare modificată, un vecin OSPF pierdut) și le pot <b>trimite la un server central</b> (de obicei UDP 514). Fiecare mesaj are o <b>facility</b> (componenta sursă) și o <b>severitate</b> de la 0 (emergencies) la 7 (debugging). La 4.5 înveți să citești un mesaj, să știi cele opt niveluri și să înțelegi unde și cum se trimit logurile.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.5 este <i>Describe the use of syslog features, including facilities and severity levels</i> — tip <b>Describe</b>: contează conceptele (de ce, cum arată un mesaj, ce înseamnă nivelurile, unde ajung mesajele), dar comenzile de bază (<code>logging host</code>, <code>logging trap</code>, <code>show logging</code>) sunt frecvente în întrebări.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce nu mă uit pur și simplu la consolă?', 'De ce avem nevoie de syslog'],
          ['Cum arată un mesaj și ce înseamnă fiecare parte?', 'Anatomia unui mesaj'],
          ['Care sunt cele opt niveluri și cum funcționează filtrul?', 'Nivelurile de severitate'],
          ['Ce e „facility” și unde se trimit mesajele?', 'Facilities și destinații'],
        ]} />
        <Analogy>Un avion are o „cutie neagră” și un panou de alarme. Syslog este jurnalul de bord al fiecărui echipament: scrie ce se întâmplă, cu o etichetă de gravitate. Serverul syslog este arhiva centrală unde ajung jurnalele tuturor avioanelor, ca să le poți căuta împreună după un incident.</Analogy>
      </Detailed>
      <Traps items={[
        <>Syslog <b>raportează</b> evenimente; nu le previne și nu monitorizează valori (aceea e SNMP, 4.4).</>,
        <>Syslog folosește UDP implicit (fără confirmare): mesajele se pot pierde. Pe același motiv, ora corectă (NTP, 4.2) este critică.</>,
        <>Nivelul „mai mare” ca număr este „mai puțin grav”: 7 (debugging) este cel mai detaliat, 0 (emergencies) cel mai grav.</>,
      ]} />
      <InlineQuiz ids={['4.5-001', '4.5-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce syslog
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="4.5" title="De ce avem nevoie de syslog" />
      <Summary>
        <p>Fiecare router sau switch notează evenimentele sale, dar jurnalul local are limite: consola se vede doar fizic, bufferul din RAM e mic și <b>se pierde la repornire</b>. Un server syslog central păstrează istoricul tuturor dispozitivelor, permite căutări și alarme și ajută la corelarea evenimentelor (dacă ceasurile sunt sincronizate prin NTP).</p>
      </Summary>
      <Detailed title="1. Problema și soluția">
        <Table head={['Fără syslog central', 'Cu syslog central']} hlCol={0} rows={[
          ['Loguri doar local, pierdute la reload', 'Istoric păstrat pe un server, independent de dispozitiv'],
          ['Trebuie să te conectezi pe fiecare echipament', 'Căutare într-un singur loc'],
          ['Dispozitivul căzut nu mai poate fi interogat', 'Ultimele mesaje înainte de cădere sunt deja pe server'],
          ['Greu de corelat evenimente între echipamente', 'Ordine clară (cu NTP) și alerte automate'],
        ]} />
        <p>Syslog e util și pentru audit (cine a modificat configurația: <code>%SYS-5-CONFIG_I</code>), pentru securitate (autentificări eșuate) și pentru depanare (<code>%LINEPROTO-5-UPDOWN</code>, adiacențe OSPF).</p>
      </Detailed>
      <Callout kind="exam" title="Cuvinte cheie de examen">
        „Colectare centralizată a log-urilor”, „UDP 514”, „severitate 0–7”, „facility”, „logging host”, „audit și depanare”.
      </Callout>
      <Traps items={[
        <>Bufferul de log (<code>logging buffered</code>) este în RAM; la reload se pierde.</>,
        <>Fără ora corectă, mesajele de la mai multe echipamente nu se pot ordona.</>,
      ]} />
      <InlineQuiz ids={['4.5-003']} />
    </section>
  );
}

/* ======================================================================
   2. Anatomia unui mesaj
   ====================================================================== */
export function MessageSection() {
  return (
    <section id="message" className="section">
      <SectionHead id="message" code="4.5" title="Anatomia unui mesaj de log Cisco" />
      <Summary>
        <p>Un mesaj Cisco are forma <code>timestamp: %FACILITY-SEVERITY-MNEMONIC: descriere</code>. <b>Facility</b> arată componenta (LINK, SYS, OSPF, SEC), <b>severity</b> este numărul 0–7, iar <b>mnemonic</b> este tipul concret de eveniment (UPDOWN, CONFIG_I).</p>
      </Summary>
      <Detailed title="1. Cum se citește">
        <Figure caption="Părțile unui mesaj de log: timestamp, facility, severitate, mnemonic, descriere.">
          <MessageAnatomy />
        </Figure>
        <Table head={['Mesaj', 'Facility', 'Sev.', 'Mnemonic', 'Înțeles']} hlCol={0} rows={[
          [<code key="a">%LINK-3-UPDOWN</code>, 'LINK', '3 errors', 'UPDOWN', 'o interfață și-a schimbat starea fizică'],
          [<code key="b">%LINEPROTO-5-UPDOWN</code>, 'LINEPROTO', '5 notifications', 'UPDOWN', 'protocolul de linie (nivel 2) și-a schimbat starea'],
          [<code key="c">%SYS-5-CONFIG_I</code>, 'SYS', '5 notifications', 'CONFIG_I', 'configurația a fost modificată din consolă/VTY'],
          [<code key="d">%OSPF-5-ADJCHG</code>, 'OSPF', '5 notifications', 'ADJCHG', 'o adiacență OSPF s-a schimbat'],
          [<code key="e">%SEC_LOGIN-5-LOGIN_SUCCESS</code>, 'SEC_LOGIN', '5 notifications', 'LOGIN_SUCCESS', 'o autentificare reușită'],
        ]} />
        <p>Mesajele pot începe cu un <b>număr de secvență</b> (dacă ai activat <code>service sequence-numbers</code>), iar timestamp-ul apare doar cu <code>service timestamps log datetime</code>. În timestamp, un prefix <code>*</code> arată că ceasul nu este setat, iar <code>.</code> că NTP este configurat dar încă nesincronizat.</p>
      </Detailed>
      <DeepDive title="Cele două sensuri ale cuvântului „facility”">
        <p>Pe Cisco, „facility” din <code>%LINK-3-UPDOWN</code> înseamnă <b>componenta software</b> care a produs mesajul. Dar protocolul syslog (RFC 5424) are și el un câmp <b>facility</b> numeric (0–23) în antetul mesajului trimis pe rețea: <code>0 kern, 1 user, 2 mail, 3 daemon, 4 auth, 5 syslog, …, 16–23 local0–local7</code>. Cisco trimite implicit cu <code>local7</code> (23); îl poți schimba cu <code>logging facility</code>, ca serverul să poată separa sursele (de exemplu routerele pe local6, switch-urile pe local7). Octetul de prioritate din antet este <b>facility × 8 + severitate</b>: un mesaj local7 cu severitate 3 are prioritate 23 × 8 + 3 = 187.</p>
      </DeepDive>
      <Traps items={[
        <>Nu confunda „facility Cisco” (LINK, SYS…) cu „facility syslog” (local0–7): primul e în textul mesajului, al doilea în antetul pachetului către server.</>,
        <>Severitatea din mesaj este fixă pentru acel eveniment; nu poți „promova” un mesaj de la 5 la 3 cu o comandă.</>,
        <>Mesajele de debug nu sunt „loguri” permanente: apar doar cât timp <code>debug</code> e activ.</>,
      ]} />
      <InlineQuiz ids={['4.5-004', '4.5-005', '4.5-006']} />
    </section>
  );
}

/* ======================================================================
   3. Severitatea
   ====================================================================== */
export function SeveritySection() {
  return (
    <section id="severity" className="section">
      <SectionHead id="severity" code="4.5" title="Nivelurile de severitate (0–7)" />
      <Summary>
        <p>Există <b>opt niveluri</b>: 0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging. Când setezi un nivel (de exemplu <code>logging trap warnings</code>), se trimit mesajele de la 0 până la acel nivel: <b>nivelul ales și toate cele mai severe</b>.</p>
      </Summary>
      <Detailed title="1. Interactiv: alege un nivel">
        <Figure caption="Alege nivelul configurat și vezi care niveluri sunt logate și care filtrate.">
          <SeverityLevels />
        </Figure>
        <Table head={['Nr.', 'Cuvânt cheie', 'Sens', 'Exemplu']} hlCol={1} rows={[
          ['0', 'emergencies', 'Sistem inutilizabil', 'defecțiune fatală'],
          ['1', 'alerts', 'Acțiune imediată', 'temperatură critică'],
          ['2', 'critical', 'Condiție critică', 'alimentare/ventilator'],
          ['3', 'errors', 'Eroare', '%LINK-3-UPDOWN'],
          ['4', 'warnings', 'Avertisment', 'prag depășit'],
          ['5', 'notifications', 'Normal, dar important', '%SYS-5-CONFIG_I'],
          ['6', 'informational', 'Informativ', 'evenimente de rutină'],
          ['7', 'debugging', 'Depanare', 'ieșirea debug'],
        ]} />
        <Callout kind="exam" title="Memorare">
          „<b>E</b>very <b>A</b>wesome <b>C</b>isco <b>E</b>ngineer <b>W</b>ill <b>N</b>eed <b>I</b>ce-cream <b>D</b>aily” — 0…7. Regula: <b>număr mai mic = mai grav</b>, iar un nivel include toate numerele mai mici.
        </Callout>
      </Detailed>
      <Detailed title="2. Cum alegi nivelul">
        <ul>
          <li><b>Serverul syslog</b>: de obicei <code>informational</code> sau <code>warnings</code>, ca să nu fie inundat cu mesaje de rutină.</li>
          <li><b>Consola</b>: la depanare, mai puțin zgomot ajută (<code>logging console warnings</code>); consola lentă poate încetini routerul cu <code>debugging</code> activ.</li>
          <li><b>Buffer</b>: nivel mai detaliat, util la depanare, cu o mărime rezonabilă.</li>
          <li><b>Debug (7)</b>: doar cât timp depanezi; produce mult trafic de log și încarcă CPU-ul.</li>
        </ul>
      </Detailed>
      <Traps items={[
        <>„Level 4” înseamnă 0–4 (nu doar 4). Nu este o selecție exactă.</>,
        <>Cu un nivel mai mare nu „primești mai puține” mesaje, ci mai multe: debugging (7) le primește pe toate.</>,
        <>Un mesaj cu severitate 3 nu apare pe un destinatar configurat la nivel 2 (critical), pentru că 3 este mai mare decât 2.</>,
      ]} />
      <InlineQuiz ids={['4.5-007', '4.5-008', '4.5-009']} />
    </section>
  );
}

/* ======================================================================
   4. Destinații și facilities
   ====================================================================== */
export function DestinationsSection() {
  return (
    <section id="destinations" className="section">
      <SectionHead id="destinations" code="4.5" title="Unde ajung mesajele: console, VTY, buffer, server" />
      <Summary>
        <p>Un dispozitiv poate trimite logurile în patru locuri, fiecare cu propriul nivel: <b>console</b> (<code>logging console</code>), <b>sesiuni VTY</b> (<code>logging monitor</code> + <code>terminal monitor</code>), <b>buffer în RAM</b> (<code>logging buffered</code>) și <b>server syslog</b> (<code>logging host</code> + <code>logging trap</code>). Fiecare destinație își aplică propriul filtru de severitate.</p>
      </Summary>
      <Detailed title="1. Cele patru destinații">
        <LogDestinations />
        <Figure caption="Interactiv: un eveniment este comparat cu pragul fiecărei destinații.">
          <LogFlow />
        </Figure>
        <Callout kind="info" title="Valori implicite">
          În mod obișnuit consola și bufferul sunt la <code>debugging</code>, iar serverul (<code>logging trap</code>) la <code>informational</code>; sursele diferă pe versiuni IOS, așa că <b>verifică întotdeauna cu <code>show logging</code></b>, care afișează nivelul fiecărei destinații.
        </Callout>
      </Detailed>
      <Detailed title="2. Facilities syslog și serverul">
        <ul>
          <li>Mesajele către server pleacă prin <b>UDP 514</b> (de obicei), cu un câmp <b>facility</b> (implicit <code>local7</code> pe Cisco) și <b>severitate</b>.</li>
          <li>Serverul folosește facility-ul ca să separe sursele (routere pe local6, switch-uri pe local7, firewall-uri pe local5) în fișiere diferite.</li>
          <li><code>logging source-interface loopback0</code> face ca mesajele să plece mereu cu aceeași adresă sursă (stabilă), ca serverul să poată identifica dispozitivul.</li>
        </ul>
      </Detailed>
      <DeepDive title="Confort la consolă: logging synchronous">
        <p>Un mesaj de log care apare în timp ce tastezi o comandă „rupe” linia. Pe consolă și VTY, <code>logging synchronous</code> (în <code>line con 0</code> / <code>line vty …</code>) reafișează linia ta de comandă după mesaj. Nu schimbă ce se loghează, ci doar cum arată în sesiune.</p>
      </DeepDive>
      <Traps items={[
        <>Fiecare destinație are propriul nivel: schimbarea lui <code>logging trap</code> nu afectează consola.</>,
        <>Pe VTY nu vezi loguri decât după <code>terminal monitor</code> (și dacă <code>logging monitor</code> nu e dezactivat).</>,
        <>Fără <code>logging host</code>, nu pleacă nimic spre server, oricât de „mare” ar fi nivelul.</>,
      ]} />
      <InlineQuiz ids={['4.5-010', '4.5-011', '4.5-012']} />
    </section>
  );
}
