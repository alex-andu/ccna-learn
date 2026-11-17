import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { AccessLayers, EnablePrecedence, LoginBlockDemo, LoginSimulator, PasswordTypes } from '../../diagrams/t5_3';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="5.3" title="Controlul accesului la dispozitiv cu parole locale — imaginea de ansamblu" />
      <Summary>
        <p>Un router sau switch Cisco are mai multe „uși”: <b>console</b> (fizic), <b>VTY</b> (la distanță prin Telnet/SSH), eventual <b>AUX</b> și, în interior, <b>modul privilegiat</b> (<code>enable</code>). Fiecare se încuie cu parole configurate <b>local</b>, pe dispozitiv. La 5.3 înveți să configurezi parole pe linii, <code>enable secret</code>, conturi locale (<code>username … secret</code>), să înțelegi tipurile de hash (0, 5, 7, 8, 9) și să verifici rezultatul.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 5.3 este <i>Configure and verify device access control using local passwords</i> — tip <b>Configure and verify</b>: ai nevoie de comenzile exacte, de ordinea lor și de interpretarea <code>show running-config</code> / <code>show users</code>. Parolele „locale” se opun celor centralizate pe un server AAA (RADIUS/TACACS+, 5.8).</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['Care sunt căile de acces și cum se numesc liniile?', 'Căile de acces la dispozitiv'],
          ['Cum pun parolă pe console și VTY? Ce face login?', 'Parole pe linii și comanda login'],
          ['Care e diferența dintre enable password și enable secret? Ce sunt tipurile 0/5/7/8/9?', 'Enable și tipuri de parole'],
          ['Cum creez conturi individuale?', 'Utilizatori locali și privilegii'],
          ['Cum limitez ghicirea și parolele slabe?', 'Protecții: min-length, login block-for, timeout'],
        ]} />
        <Analogy>Gândește-te la un bloc de birouri. <b>Console</b> = ușa din spate, dar numai cu cheia. <b>VTY</b> = ușa principală, deschisă de la distanță. <b>enable</b> = camera seifului din interior. O parolă pe fiecare ușă e un început; cheile personale (conturi locale) arată cine a intrat; un hash puternic e ca o încuietoare greu de forțat dacă cineva îți fură evidența cheilor.</Analogy>
      </Detailed>
      <Callout kind="warn" title="Comenzi netestate pe echipamente">
        Sintaxa este din documentația Cisco IOS/IOS XE, dar <b>nu a fost testată</b> pe echipamente reale de autorul lecției. Disponibilitatea hash-urilor 8/9 și a unor comenzi variază între versiuni și Packet Tracer; verifică în <code>show running-config</code>.
      </Callout>
      <Traps items={[
        <><b>„Local”</b> înseamnă stocat pe fiecare dispozitiv — nu scalează la zeci de echipamente (aceea e problema rezolvată de AAA, 5.8).</>,
        <>Consola nu cere parolă implicit; VTY cere login dar fără parolă refuză conexiunea.</>,
        <><code>service password-encryption</code> NU e criptare puternică; <code>secret</code> e mecanismul corect.</>,
      ]} />
      <InlineQuiz ids={['5.3-001', '5.3-002']} />
    </section>
  );
}

/* ======================================================================
   1. Căile de acces
   ====================================================================== */
export function LayersSection() {
  return (
    <section id="layers" className="section">
      <SectionHead id="layers" code="5.3" title="Căile de acces la dispozitiv: console, VTY, AUX, enable" />
      <Summary>
        <p>Accesul la un echipament Cisco trece prin două etape: <b>intri într-o linie</b> (<G id="console-port" />, <G id="vty" />, AUX) în modul <b>user EXEC</b> (<code>&gt;</code>), apoi, cu <code>enable</code>, în <b>privileged EXEC</b> (<code>#</code>), unde poți vedea și modifica totul. Fiecare etapă are parola ei.</p>
      </Summary>
      <Detailed title="1. Cele patru căi">
        <Figure caption="Console, VTY, AUX și parola de privilegiat — fiecare cu comanda ei de configurare.">
          <AccessLayers />
        </Figure>
        <Table head={['Cale', 'Cum ajungi', 'Configurare', 'Implicit']} hlCol={0} rows={[
          ['Console', 'Cablu fizic (RJ-45/USB) și un program de terminal', <code key="a">line console 0</code>, 'Fără autentificare'],
          ['VTY (Virtual Teletype)', 'Telnet sau SSH prin rețea', <code key="b">line vty 0 4</code>, 'Cere login, dar fără parolă conexiunea e refuzată'],
          ['AUX', 'Port auxiliar (modem) pe routere', <code key="c">line aux 0</code>, 'Fără autentificare; dezactivează dacă nu-l folosești'],
          ['Privileged EXEC', 'Comanda enable', <code key="d">enable secret</code>, 'Fără parolă (pe o consolă nouă)'],
        ]} />
        <p>Un switch are de obicei <code>line vty 0 4</code> și <code>line vty 5 15</code> (16 sesiuni simultane); un router poate avea 0–4 sau 0–15. Configurarea unei singure game lasă cealaltă neprotejată: o greșeală frecventă este să securizezi 0–4 și să uiți 5–15.</p>
      </Detailed>
      <Detailed title="2. Moduri și niveluri de privilegiu">
        <p>Fiecare comandă aparține unui <b>nivel de privilegiu</b> 0–15. Implicit: <b>1</b> = user EXEC (comenzi de vizualizare limitate), <b>15</b> = privileged EXEC (toate). Nivelurile intermediare (2–14) pot primi comenzi alese, pentru a oferi, de exemplu, unui operator doar <code>show</code> și <code>ping</code> (detaliu în DeepDive).</p>
      </Detailed>
      <Traps items={[
        <>Consola și AUX nu cer parolă dacă nu ai configurat <code>login</code>; VTY cere implicit login.</>,
        <>O linie VTY lăsată nesecurizată poate fi folosită pentru acces la distanță; protejează <b>toate</b> liniile (<code>0 15</code>).</>,
        <>Accesul la <code>enable</code> dă control total: de aceea parola de enable este cea mai importantă.</>,
      ]} />
      <InlineQuiz ids={['5.3-003', '5.3-004']} />
    </section>
  );
}

/* ======================================================================
   2. Parole pe linii + login
   ====================================================================== */
export function LinePasswordSection() {
  return (
    <section id="linepw" className="section">
      <SectionHead id="linepw" code="5.3" title="Parole pe linii și comanda login" />
      <Summary>
        <p>Pe o linie ai două comenzi legate: <code>password &lt;text&gt;</code> (stabilește parola) și <code>login</code> (<b>cere</b> acea parolă). Fără <code>login</code>, parola este ignorată. <code>login local</code> cere în schimb <b>utilizator + parolă</b> din baza de conturi locale. <code>no login</code> dezactivează orice verificare.</p>
      </Summary>
      <Detailed title="1. Cele trei moduri de autentificare pe o linie">
        <Table head={['Configurație', 'Ce se cere', 'Observații']} hlCol={0} rows={[
          [<code key="a">password X + login</code>, 'Doar parola liniei', 'O parolă comună; nu se știe cine a intrat'],
          [<code key="b">login local</code>, 'Utilizator + parolă din baza locală', <>Conturi individuale (<code>username …</code>); recomandat</>],
          [<code key="c">no login</code>, 'Nimic', 'Acces direct, chiar dacă există <code>password</code>'],
        ]} />
        <Figure caption="Interactiv: alege linia (console sau VTY) și configurația pentru a vedea ce se întâmplă la conectare.">
          <LoginSimulator />
        </Figure>
      </Detailed>
      <Detailed title="2. Comenzi tipice pe linii">
        <ul>
          <li><code>line console 0</code> / <code>line vty 0 15</code> — alege linia (sau intervalul).</li>
          <li><code>password …</code> + <code>login</code> sau <code>login local</code> — autentificare.</li>
          <li><code>exec-timeout &lt;minute&gt; [secunde]</code> — închide sesiunea inactivă (implicit 10 minute; <code>exec-timeout 0 0</code> înseamnă fără timeout, de evitat).</li>
          <li><code>logging synchronous</code> — mesajele de log nu rup linia de comandă.</li>
          <li><code>transport input ssh</code> — (VTY) doar SSH; condiția este SSH configurat (4.8).</li>
        </ul>
      </Detailed>
      <Callout kind="exam" title="Cuvinte cheie de examen">
        „<b>password + login</b>” (parola liniei), „<b>login local</b>” (utilizatori locali), „<b>no login</b>” (fără verificare), „<b>exec-timeout</b>”, „<b>line vty 0 4</b>”.
      </Callout>
      <Traps items={[
        <>Configurezi <code>password</code> dar uiți <code>login</code>: pe consolă, ajungi direct în EXEC (parola nu e cerută).</>,
        <><code>login local</code> fără niciun <code>username</code> definit te blochează: nu ai cu ce te autentifica pe acea linie (pe VTY nu mai poți intra).</>,
        <><code>exec-timeout 0 0</code> păstrează sesiunea deschisă la nesfârșit: comod, dar nesigur.</>,
      ]} />
      <InlineQuiz ids={['5.3-005', '5.3-006', '5.3-007']} />
    </section>
  );
}

/* ======================================================================
   3. Enable și tipuri de parole
   ====================================================================== */
export function EnableSection() {
  return (
    <section id="enable" className="section">
      <SectionHead id="enable" code="5.3" title="enable secret, enable password și tipurile de parole" />
      <Summary>
        <p><code>enable secret</code> stochează parola ca <b>hash</b> și are prioritate; <code>enable password</code> o stochează în clar (sau tip 7 reversibil cu <code>service password-encryption</code>) și e ignorată dacă există <code>secret</code>. Tipurile: <b>0</b> clar, <b>5</b> MD5, <b>7</b> cifru Cisco reversibil, <b>8</b> PBKDF2-SHA256, <b>9</b> scrypt.</p>
      </Summary>
      <Detailed title="1. Precedența: secret bate password">
        <Figure caption="Interactiv: activează sau dezactivează cele două parole și vezi care este cerută la enable.">
          <EnablePrecedence />
        </Figure>
        <p>Recomandarea: configurează <b>doar</b> <code>enable secret</code>; dacă o <code>enable password</code> mai există din trecut, o elimini cu <code>no enable password</code>. Altfel, o parolă veche în clar rămâne în configurație, chiar dacă nu este folosită.</p>
      </Detailed>
      <Detailed title="2. Tipurile de parole">
        <Figure caption="Interactiv: alege tipul de parolă și vezi dacă e reversibil și cum arată în configurație.">
          <PasswordTypes />
        </Figure>
        <Table head={['Tip', 'Mecanism', 'Reversibil?', 'Cine îl produce']} hlCol={0} rows={[
          ['0', 'Text clar', 'Da', 'password / enable password (implicit)'],
          ['5', 'MD5 cu salt', 'Nu (dar slab)', 'enable secret / username secret (clasic)'],
          ['7', 'Cifru Cisco (Vigenère)', 'Da', 'service password-encryption'],
          ['8', 'PBKDF2-SHA256', 'Nu', 'algorithm-type sha256 secret'],
          ['9', 'scrypt', 'Nu', 'algorithm-type scrypt secret'],
        ]} />
        <Callout kind="exam" title="De ținut minte">
          <b>Tip 7 se decriptează în câteva secunde</b> cu unelte publice: <code>service password-encryption</code> doar împiedică citirea „peste umăr”, nu protejează configurația furată. <code>secret</code> folosește hash unidirecțional; cu cât algoritmul e mai lent (8, 9), cu atât ghicirea offline e mai grea.
        </Callout>
      </Detailed>
      <Detailed title="3. service password-encryption">
        <p>Comanda <code>service password-encryption</code> transformă <b>parolele în clar</b> din configurație (parole de linie, <code>enable password</code>, <code>username … password</code>) în <b>tip 7</b>. Se aplică parolelor existente și celor viitoare. Nu modifică parolele de tip <code>secret</code>. Este o măsură minimă: ferește de privirile întâmplătoare când cineva vede configurația, dar nu e o apărare criptografică.</p>
      </Detailed>
      <DeepDive title="De ce MD5 (tip 5) e „slab” și ce rezolvă 8 și 9">
        <p>Hash-urile rapide (MD5) pot fi calculate în volum foarte mare pe plăci grafice; un atacator care are un fișier de configurație poate încerca miliarde de parole pe secundă. Algoritmii <b>PBKDF2</b> (tip 8) și <b>scrypt</b> (tip 9) sunt făcuți intenționat <b>lenți</b> (și scrypt cere memorie), deci încetinesc ghicirea offline. Sintaxa tipică: <code>enable algorithm-type scrypt secret &lt;parola&gt;</code> sau <code>username admin algorithm-type sha256 secret &lt;parola&gt;</code>. Pe platformele care nu le suportă, <code>secret</code> rămâne tip 5. Parola lungă și unică contează mai mult decât tipul.</p>
      </DeepDive>
      <Traps items={[
        <><code>enable secret</code> + <code>enable password</code> setate: doar <b>secret</b> funcționează; <code>enable password</code> rămâne o scurgere inutilă.</>,
        <>Tip 7 ≠ criptare sigură; tip 5 ≠ cea mai bună opțiune.</>,
        <>Dacă scrii <code>enable secret 5 &lt;hash&gt;</code> pui un hash deja calculat (copiat din altă configurație), nu o parolă.</>,
      ]} />
      <InlineQuiz ids={['5.3-008', '5.3-009', '5.3-010']} />
    </section>
  );
}

/* ======================================================================
   4. Utilizatori locali și privilegii
   ====================================================================== */
export function UsersSection() {
  return (
    <section id="users" className="section">
      <SectionHead id="users" code="5.3" title="Utilizatori locali: username, login local, privilegii" />
      <Summary>
        <p>În loc de o parolă comună, creezi conturi individuale cu <code>username &lt;nume&gt; secret &lt;parolă&gt;</code> (sau cu <code>privilege 15</code>), iar pe linie pui <code>login local</code>. Rezultat: fiecare administrator are nume și parolă proprii, loguri cu nume și conturi care se pot dezactiva individual.</p>
      </Summary>
      <Detailed title="1. username și login local">
        <Table head={['Comandă', 'Efect']} hlCol={0} rows={[
          [<code key="a">username admin secret &lt;parola&gt;</code>, 'Cont cu parola stocată ca hash (tip 5 implicit pe versiuni clasice)'],
          [<code key="b">username admin password &lt;parola&gt;</code>, 'Cont cu parola în clar (sau tip 7 cu service password-encryption) — de evitat'],
          [<code key="c">username admin privilege 15 secret &lt;parola&gt;</code>, 'La login, utilizatorul intră direct în privileged EXEC (nivel 15)'],
          [<code key="d">username op privilege 5 secret &lt;parola&gt;</code>, 'Cont cu nivel intermediar (vezi privilege exec level)'],
          [<code key="e">username admin algorithm-type scrypt secret …</code>, 'Cont cu hash tip 9 (dacă platforma îl acceptă)'],
        ]} />
        <p>Un cont fără <code>privilege</code> intră în user EXEC (nivel 1) și trebuie să folosească <code>enable</code>. Cu <code>privilege 15</code> sare peste <code>enable</code>; e mai comod, dar mai puțin „în straturi”.</p>
      </Detailed>
      <Detailed title="2. Ce se întâmplă la conectare">
        <ol>
          <li>Utilizatorul se conectează la linie (consolă/VTY).</li>
          <li>Linia are <code>login local</code> → echipamentul cere <b>utilizator</b> și <b>parolă</b>.</li>
          <li>Verifică baza locală (<code>username</code>); dacă se potrivește, începe sesiunea în nivelul contului (1 sau cel din <code>privilege</code>).</li>
          <li>Pentru nivel 15 din nivel 1: <code>enable</code> și parola <code>enable secret</code>.</li>
        </ol>
      </Detailed>
      <Detailed title="3. Limitele autentificării locale">
        <ul>
          <li><b>Scalabilitate</b> — dacă ai 50 de echipamente, adaugi/ștergi utilizatori pe fiecare.</li>
          <li><b>Fără MFA</b> și fără politici centralizate (5.4, 5.8).</li>
          <li><b>Audit limitat</b> — doar ce scrie local sau în syslog; AAA adaugă accounting centralizat.</li>
          <li>Rămâne utilă ca <b>fallback</b>: <code>aaa authentication login default group tacacs+ local</code> folosește contul local dacă serverul AAA nu răspunde (5.8).</li>
        </ul>
      </Detailed>
      <DeepDive title="Niveluri de privilegiu personalizate">
        <p>Poți muta o comandă la un nivel intermediar și oferi acel nivel unui operator: <code>privilege exec level 5 show running-config</code> mută <code>show running-config</code> la nivelul 5; <code>enable secret level 5 &lt;parola&gt;</code> definește parola pentru nivelul 5; operatorul intră cu <code>enable 5</code>. Se aplică principiul <b>least privilege</b> (5.1). Nu e cerut în detaliu la CCNA, dar ideea apare în întrebări.</p>
      </DeepDive>
      <Traps items={[
        <><code>username … password</code> și <code>username … secret</code> arată similar, dar prima stochează în clar; folosește <b>secret</b>.</>,
        <>Dacă setezi <code>login local</code> pe VTY și uiți să creezi un utilizator, rămâi fără acces la distanță (poți intra prin consolă dacă e configurată).</>,
        <>Conturile cu <code>privilege 15</code> ocolesc parola <code>enable</code>.</>,
      ]} />
      <InlineQuiz ids={['5.3-011', '5.3-012', '5.3-013']} />
    </section>
  );
}

/* ======================================================================
   5. Protecții
   ====================================================================== */
export function HardeningSection() {
  return (
    <section id="hardening" className="section">
      <SectionHead id="hardening" code="5.3" title="Protecții: lungime minimă, login block-for, timeout, banner" />
      <Summary>
        <p>Parolele locale devin mai greu de atacat cu patru comenzi: <code>security passwords min-length</code> (respinge parolele scurte), <code>login block-for</code> (blochează temporar după încercări eșuate), <code>exec-timeout</code> (închide sesiuni uitate) și <code>banner</code> (avertisment legal). Se adaugă <code>login on-failure log</code> ca să știi cine a încercat.</p>
      </Summary>
      <Detailed title="1. Lungime minimă">
        <p><code>security passwords min-length 10</code> face ca parolele configurate <b>ulterior</b> (linii, enable, username) cu mai puțin de 10 caractere să fie respinse. Parolele existente nu se modifică automat. Valoarea se alege conform politicii (5.4): lungimea contează mai mult decât complexitatea artificială.</p>
      </Detailed>
      <Detailed title="2. login block-for (blocarea atacurilor prin ghicire)">
        <Figure caption="Interactiv: apasă de câteva ori „Încercare de login eșuată” și vezi cum intră echipamentul în quiet mode.">
          <LoginBlockDemo />
        </Figure>
        <Table head={['Comandă', 'Rol']} hlCol={0} rows={[
          [<code key="a">login block-for 120 attempts 3 within 60</code>, 'După 3 eșecuri în 60 s, refuză toate logările timp de 120 s (quiet mode)'],
          [<code key="b">login quiet-mode access-class &lt;ACL&gt;</code>, 'Adrese permise chiar și în quiet mode (de exemplu stația de administrare)'],
          [<code key="c">login delay &lt;secunde&gt;</code>, 'Întârzie fiecare nouă încercare (după activarea login block-for)'],
          [<code key="d">login on-failure log [every N]</code>, 'Generează mesaje syslog la eșecuri'],
          [<code key="e">login on-success log</code>, 'Generează mesaje syslog la succes'],
        ]} />
        <Callout kind="info" title="Ce acoperă">
          Funcția este descrisă de Cisco pentru conexiunile <b>virtuale</b> (VTY: Telnet/SSH); comportamentul pe consolă diferă între platforme, deci nu te baza pe consolă ca „cale de rezervă” fără să verifici documentația platformei. Verifică starea cu <code>show login</code> și <code>show login failures</code>.
        </Callout>
      </Detailed>
      <Detailed title="3. Timeout, banner, jurnalizare">
        <ul>
          <li><code>exec-timeout 5 0</code> — sesiunea inactivă se închide după 5 minute (în <code>line console/vty</code>).</li>
          <li><code>banner motd #…#</code> — apare la conectare (mesajul zilei); <code>banner login #…#</code> — apare înainte de autentificare; <code>banner exec</code> — după autentificare. Delimitatorul (aici <code>#</code>) nu trebuie să apară în text.</li>
          <li><code>logging host …</code> și <code>login on-failure log</code> — urme pentru investigație (4.5).</li>
        </ul>
      </Detailed>
      <Detailed title="4. Rețeta completă de acces local">
        <ol>
          <li><code>enable secret</code> (și <code>no enable password</code>).</li>
          <li><code>username admin privilege 15 secret …</code> (sau <code>algorithm-type scrypt</code> dacă e suportat).</li>
          <li><code>line console 0</code>: <code>login local</code>, <code>exec-timeout</code>, <code>logging synchronous</code>.</li>
          <li><code>line vty 0 15</code>: <code>login local</code>, <code>transport input ssh</code>, <code>exec-timeout</code> (SSH la 4.8).</li>
          <li><code>service password-encryption</code> (pentru parolele rămase în clar, ex. o parolă de linie).</li>
          <li><code>security passwords min-length 10</code>, <code>login block-for …</code>, bannere, <code>logging host</code>.</li>
        </ol>
      </Detailed>
      <Traps items={[
        <><code>login block-for</code> nu apare ca „blocare de cont”: blochează <b>toate</b> logările VTY (inclusiv administratorul) pe durata quiet mode, cu excepția ACL-ului permis.</>,
        <><code>security passwords min-length</code> nu verifică retroactiv parolele deja existente.</>,
        <>Un banner care conține „Welcome” invită; evită-l. Textul legal exact se stabilește cu juridicul.</>,
      ]} />
      <InlineQuiz ids={['5.3-014', '5.3-015', '5.3-016']} />
    </section>
  );
}
