import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { SshChecklist, SshFlow, TelnetVsSsh } from '../../diagrams/t4_8';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.8" title="Acces de la distanță cu SSH — imaginea de ansamblu" />
      <Summary>
        <p><G id="ssh" /> (Secure Shell) este modul securizat de a ajunge în CLI-ul unui router sau switch de la distanță, peste TCP 22, cu tot traficul <b>criptat</b> (spre deosebire de <G id="telnet" />). Obiectivul 4.8 este de tip <b>Configure</b>: trebuie să știi pașii în ordine (hostname → domain-name → chei RSA → utilizator → VTY) și să înțelegi de ce fiecare e necesar.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.8: <i>Configure network devices for remote access using SSH</i>. La 2.8 ai văzut metodele de acces (consolă, Telnet, SSH, HTTP/HTTPS) și AAA la nivel conceptual; aici construim efectiv accesul SSH pe un echipament IOS.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce nu Telnet?', 'De ce SSH și nu Telnet'],
          ['Ce se întâmplă când mă conectez?', 'Cum se stabilește o sesiune SSH'],
          ['Ce comenzi, în ce ordine, și de ce?', 'Cerințe și pași de configurare'],
          ['Cum limitez cine poate intra?', 'Întărirea accesului VTY'],
        ]} />
        <Analogy>Telnet este ca o convorbire telefonică pe o linie la care poate asculta oricine: spui parola cu voce tare. SSH este ca o convorbire cu un interlocutor verificat, într-o limbă pe care o înțelegeți doar voi doi: înainte de a vorbi, vă confirmați identitatea și convenți un cod secret.</Analogy>
      </Detailed>
      <Traps items={[
        <>SSH nu înlocuiește parolele sau autentificarea: protejează canalul; utilizatorul tot trebuie autentificat (local sau AAA).</>,
        <>Nu e suficient să ai <code>transport input ssh</code>: fără chei RSA, serverul SSH nu pornește.</>,
        <>SSH se configurează pe echipament pentru acces <b>in-band</b> (prin rețea); consola rămâne accesul out-of-band de rezervă.</>,
      ]} />
      <InlineQuiz ids={['4.8-001', '4.8-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce SSH
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="4.8" title="De ce SSH și nu Telnet" />
      <Summary>
        <p>Telnet (TCP 23) a fost conceput într-o epocă fără amenințări pe rețea: trimite <b>tot în text clar</b>, inclusiv utilizatorul și parola. SSH (TCP 22) criptează sesiunea, autentifică serverul prin cheie publică și, în versiunea 2, rezistă atacurilor cunoscute împotriva v1. Orice acces la distanță pe echipamente reale trebuie să folosească SSH.</p>
      </Summary>
      <Detailed title="1. Ce vede un atacant">
        <Figure caption="Aceeași sesiune de login, văzută pe fir: Telnet expune parolele, SSH nu.">
          <TelnetVsSsh />
        </Figure>
        <Table head={['Aspect', 'Telnet', 'SSH']} hlCol={0} rows={[
          ['Port', 'TCP 23', 'TCP 22'],
          ['Criptare', 'Nu (text clar)', 'Da (chei de sesiune simetrice)'],
          ['Autentificare server', 'Nu', 'Da (cheie publică RSA / host key)'],
          ['Alternative de autentificare', 'Parolă', 'Parolă sau chei publice (și AAA)'],
          ['Recomandat', 'Nu (doar laborator izolat)', 'Da'],
        ]} />
      </Detailed>
      <Detailed title="2. SSHv1 vs SSHv2">
        <p>SSH are două versiuni incompatibile. <b>v1</b> are slăbiciuni de design (de exemplu protecție slabă a integrității) și este considerat nesigur. <b>v2</b> este reproiectat, cu schimb de chei mai robust și verificări de integritate mai bune. Pe IOS comanda <code>ip ssh version 2</code> forțează doar v2; fără ea, unele versiuni acceptă și v1. Pentru v2, cheia RSA trebuie să aibă cel puțin 768 de biți; în practică se folosesc 2048.</p>
        <Callout kind="exam" title="Cuvinte cheie de examen">
          „TCP 22”, „criptat”, „crypto key generate rsa”, „ip domain-name”, „transport input ssh”, „login local”, „SSH version 2”, „access-class”.
        </Callout>
      </Detailed>
      <Traps items={[
        <>Telnet rămâne deschis dacă liniile VTY au <code>transport input all</code> sau <code>telnet</code> (implicit pe unele versiuni).</>,
        <>SSHv1 și Telnet nu trebuie lăsate active „doar în caz de ceva”: sunt vulnerabilități.</>,
      ]} />
      <InlineQuiz ids={['4.8-003', '4.8-004', '4.8-005']} />
    </section>
  );
}

/* ======================================================================
   2. Cum se stabilește sesiunea
   ====================================================================== */
export function HowSection() {
  return (
    <section id="how" className="section">
      <SectionHead id="how" code="4.8" title="Cum se stabilește o sesiune SSH, pas cu pas" />
      <Summary>
        <p>Clientul deschide TCP 22, părțile se pun de acord asupra versiunii și a algoritmilor, derivă chei de sesiune (Diffie-Hellman), serverul își dovedește identitatea cu <b>cheia lui RSA</b>, iar abia apoi, în canalul deja criptat, se autentifică utilizatorul. Cheia RSA a routerului este de aceea o <b>cerință obligatorie</b>.</p>
      </Summary>
      <Detailed title="1. Interactiv: de la conexiunea TCP la CLI">
        <Figure caption="Parcurge cei șase pași: ce se schimbă pe fir și când devine canalul criptat.">
          <SshFlow />
        </Figure>
      </Detailed>
      <Detailed title="2. Rolul cheii RSA a routerului">
        <p><code>crypto key generate rsa</code> creează o <b>pereche de chei</b>: una privată (rămâne pe router) și una publică (o primesc clienții). Cheia publică identifică routerul: la prima conectare clientul reține amprenta ei; la conectările următoare compară. Dacă amprenta se schimbă (cheie regenerată sau atac), clientul avertizează. Rolul nu este să cripteze volumul de date (aceea o fac cheile simetrice de sesiune), ci să <b>autentifice serverul</b> și să protejeze schimbul de chei.</p>
        <Callout kind="tip" title="De ce hostname și domain-name">
          Cheia RSA primește un nume de forma <code>R1.example.local</code>, deci IOS cere un hostname diferit de implicitul „Router” și un <code>ip domain-name</code>. Fără ele, <code>crypto key generate rsa</code> este refuzat.
        </Callout>
      </Detailed>
      <DeepDive title="Ce autentifică și ce nu SSH">
        <p>SSH protejează confidențialitatea și integritatea <i>canalului</i> și verifică <i>serverul</i> prin cheie. Nu verifică automat că utilizatorul cu parola ghicită este legitim: de aceea se combină cu parole puternice (<code>secret</code>), cu AAA centralizat (TACACS+/RADIUS, vezi 2.8), cu limite de încercări (<code>ip ssh authentication-retries</code>, <code>login block-for</code>) și cu liste de acces pe VTY. Pe unele platforme se pot folosi și chei publice pentru utilizatori, nu doar parole.</p>
      </DeepDive>
      <Traps items={[
        <>Cheia RSA nu criptează fiecare pachet: doar autentifică serverul și ajută la schimbul de chei; datele sunt criptate cu chei simetrice de sesiune.</>,
        <>Un avertisment „host key changed” nu trebuie ignorat: poate indica un atac man-in-the-middle.</>,
        <>Dacă regenerezi cheile RSA, toți clienții vor vedea amprenta nouă.</>,
      ]} />
      <InlineQuiz ids={['4.8-006', '4.8-007', '4.8-008', '4.8-009']} />
    </section>
  );
}

/* ======================================================================
   3. Pașii de configurare
   ====================================================================== */
export function RequirementsSection() {
  return (
    <section id="requirements" className="section">
      <SectionHead id="requirements" code="4.8" title="Cerințe și pași de configurare (în ordine)" />
      <Summary>
        <p>Pe IOS, SSH se activează în șase pași: <b>hostname</b>, <b>ip domain-name</b>, <b>chei RSA</b>, <b>utilizator local</b>, <b>linii VTY</b> (<code>login local</code> + <code>transport input ssh</code>) și, recomandat, <b>ip ssh version 2</b>. Plus, echipamentul trebuie să aibă o adresă IP accesibilă (pe switch: un SVI cu default gateway).</p>
      </Summary>
      <Detailed title="1. Interactiv: lanțul de cerințe">
        <Figure caption="Alege un pas: ce comandă, de ce este necesară și ce se întâmplă dacă lipsește.">
          <SshChecklist />
        </Figure>
        <Table head={['Comandă', 'Rol']} hlCol={0} rows={[
          [<code key="a">hostname &lt;nume&gt;</code>, 'Nume diferit de „Router”, necesar pentru numele cheii'],
          [<code key="b">ip domain-name &lt;domeniu&gt;</code>, 'Completează numele cheii RSA'],
          [<code key="c">crypto key generate rsa modulus 2048</code>, 'Generează cheile; pornește serverul SSH'],
          [<code key="d">ip ssh version 2</code>, 'Doar SSHv2'],
          [<code key="e">username &lt;u&gt; privilege 15 secret &lt;p&gt;</code>, 'Utilizator local, parolă hash-uită'],
          [<code key="f">line vty 0 15</code>, 'Liniile virtuale (sesiunile de la distanță)'],
          [<code key="g">login local</code>, 'Autentificare cu utilizatorii locali (nu doar parolă de linie)'],
          [<code key="h">transport input ssh</code>, 'Acceptă doar SSH (nu Telnet) pe VTY'],
        ]} />
      </Detailed>
      <Detailed title="2. Pe un switch: adresa de management">
        <p>Un switch L2 nu are adrese IP pe porturi. Pentru SSH îi trebuie un <b>SVI</b> (de exemplu <code>interface vlan 1</code> sau un VLAN de management) cu adresă IP și un <code>ip default-gateway</code>, ca să răspundă și unor clienți din alte subrețele. Restul pașilor (hostname, domeniu, chei, utilizator, VTY) sunt identici cu cei de pe router.</p>
      </Detailed>
      <Traps items={[
        <><code>login</code> (fără <code>local</code>) cere o parolă de linie; fără <code>password</code> pe linie obții „Password required, but none set”.</>,
        <><code>transport input ssh</code> fără chei RSA: serverul SSH nu rulează, conexiunea este refuzată.</>,
        <>Utilizatorii cu <code>password</code> (nu <code>secret</code>) sunt stocați mai slab protejat; folosește <code>secret</code>.</>,
        <>Modulul RSA prea mic (de exemplu 512) nu permite SSHv2.</>,
      ]} />
      <InlineQuiz ids={['4.8-010', '4.8-011', '4.8-012', '4.8-013', '4.8-014']} />
    </section>
  );
}

/* ======================================================================
   4. Întărirea accesului
   ====================================================================== */
export function HardeningSection() {
  return (
    <section id="hardening" className="section">
      <SectionHead id="hardening" code="4.8" title="Întărirea accesului VTY și conectarea de pe clienți" />
      <Summary>
        <p>SSH activ nu înseamnă acces sigur. Limitează <b>de unde</b> se poate intra (<code>access-class</code> cu un ACL pe VTY), <b>cât timp</b> rămâne o sesiune inactivă (<code>exec-timeout</code>), <b>câte încercări</b> sunt permise și folosește parole <code>secret</code> sau AAA. Din partea clientului, te conectezi cu <code>ssh -l utilizator adresă</code> (IOS) sau <code>ssh utilizator@adresă</code> (OpenSSH/Windows).</p>
      </Summary>
      <Detailed title="1. Măsuri uzuale">
        <Table head={['Măsură', 'Comandă', 'Efect']} hlCol={0} rows={[
          ['Restricție de sursă', <code key="a">access-class 10 in</code>, 'Doar adresele permise de ACL-ul 10 pot deschide sesiuni VTY'],
          ['Timeout de inactivitate', <code key="b">exec-timeout 5 0</code>, 'Sesiune închisă după 5 minute fără activitate'],
          ['Limitare încercări', <code key="c">ip ssh authentication-retries 3</code>, 'Număr maxim de încercări de autentificare'],
          ['Timeout de negociere', <code key="d">ip ssh time-out 60</code>, 'Timp maxim pentru stabilirea sesiunii'],
          ['Blocare după eșecuri', <code key="e">login block-for 120 attempts 3 within 60</code>, 'Blochează login-ul după încercări repetate (verifică disponibilitatea pe platforma ta)'],
          ['Parole cu hash', <code key="f">enable secret …</code>, 'Parola de enable nu este stocată reversibil'],
        ]} />
        <p>ACL-ul de pe VTY este un ACL <b>standard</b> aplicat cu <code>access-class</code>, nu cu <code>ip access-group</code> (care se aplică pe interfețe). Acesta controlează <i>sesiunile către dispozitiv</i>, nu traficul care îl traversează.</p>
      </Detailed>
      <Detailed title="2. Conectarea de pe un client">
        <ul>
          <li>Din IOS: <code>ssh -l admin 192.168.1.1</code> (sau <code>ssh -v 2 -l admin …</code>).</li>
          <li>Din Windows/macOS/Linux: <code>ssh admin@192.168.1.1</code>.</li>
          <li>Din PuTTY: Host Name, Port 22, tip conexiune SSH.</li>
          <li>Echipamentele vechi pot oferi doar algoritmi pe care un client modern îi refuză (mesaje de tipul „no matching key exchange method found”); soluția corectă este actualizarea echipamentului, nu dezactivarea securității clientului.</li>
        </ul>
      </Detailed>
      <Callout kind="info" title="SSH și AAA">
        În rețele mari autentificarea nu se face cu utilizatori locali pe fiecare echipament, ci cu AAA centralizat (TACACS+ sau RADIUS, 2.8): <code>aaa new-model</code> și o listă de metode. SSH rămâne la fel; se schimbă doar sursa verificării utilizatorului.
      </Callout>
      <Traps items={[
        <>Un ACL aplicat pe VTY cu <code>ip access-group</code> nu funcționează: se folosește <code>access-class</code>.</>,
        <>Ai grijă să nu te blochezi singur: testează ACL-ul și sesiunea de rezervă (consola) înainte de a închide conexiunea curentă.</>,
        <>Dezactivarea Telnetului (<code>transport input ssh</code>) nu oprește SSH-ul: ele sunt independente.</>,
      ]} />
      <InlineQuiz ids={['4.8-015', '4.8-016', '4.8-017']} />
    </section>
  );
}
