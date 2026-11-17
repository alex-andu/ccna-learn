import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.3" title="Exemple de configurare și verificare (acces local cu parole)" />
      <Summary>
        <p>Pașii tipici pe R1: <code>enable secret</code>, conturi locale, consola și VTY cu <code>login local</code>, <code>service password-encryption</code>, lungime minimă, <code>login block-for</code>, bannere și jurnalizare. Verificarea se face cu <code>show running-config</code>, <code>show users</code>, <code>show login</code> și un test real de conectare.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale; hash-urile sunt inventate. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; hash-urile 8/9, <code>algorithm-type</code> și unele opțiuni <code>login …</code> pot lipsi în Packet Tracer sau pe versiuni vechi de IOS.
      </Callout>

      <Detailed title="1. Scenariul: R1 (192.168.1.1) cu acces local securizat">
        <CodeBlock title="R1 — acces local (ilustrativ)" kind="config" code={`R1(config)# security passwords min-length 10
R1(config)# enable secret Str0ng!Enable
R1(config)# no enable password
R1(config)# username admin privilege 15 secret Adm1n!Pass2024
R1(config)# username operator secret Op3r@torPass
R1(config)# line console 0
R1(config-line)# login local
R1(config-line)# exec-timeout 5 0
R1(config-line)# logging synchronous
R1(config-line)# exit
R1(config)# line vty 0 15
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# login block-for 120 attempts 3 within 60
R1(config)# login on-failure log
R1(config)# login on-success log
R1(config)# service password-encryption
R1(config)# banner login # Acces permis doar personalului autorizat. Activitatea este monitorizata. #`} explain={[
          ['security passwords min-length 10', 'Parolele configurate de acum încolo trebuie să aibă minimum 10 caractere (cele existente nu se verifică retroactiv).'],
          ['enable secret …', 'Parola modului privilegiat, stocată ca hash.'],
          ['no enable password', 'Elimină parola veche în clar, ca să nu rămână în configurație.'],
          ['username admin privilege 15 secret …', 'Cont de administrator: intră direct în privileged EXEC; parola e hash.'],
          ['username operator secret …', 'Cont fără privilege: intră în user EXEC și are nevoie de enable ca să avanseze.'],
          ['line console 0 → login local', 'Consola cere utilizator + parolă din baza locală.'],
          ['exec-timeout 5 0', 'Sesiunile inactive se închid după 5 minute.'],
          ['line vty 0 15 → transport input ssh', 'Pe toate liniile VTY se acceptă doar SSH (necesită SSH configurat, 4.8).'],
          ['login block-for 120 attempts 3 within 60', 'După 3 eșecuri în 60 s, refuză logările timp de 120 s.'],
          ['login on-failure log / on-success log', 'Mesaje syslog pentru încercările eșuate și reușite.'],
          ['service password-encryption', 'Cifrează (tip 7) parolele rămase în clar în configurație; nu afectează secret.'],
          ['banner login # … #', 'Avertisment afișat înainte de autentificare.'],
        ]} />
        <Callout kind="tip" title="Ordinea contează">
          Setează <code>min-length</code> <b>înainte</b> să creezi parolele noi. Creează utilizatorul <b>înainte</b> să pui <code>login local</code> pe VTY, altfel te blochezi pe acea cale. Testează SSH dintr-o a doua sesiune <b>înainte</b> să închizi prima.
        </Callout>
      </Detailed>

      <Detailed title="2. Verificare">
        <CodeBlock title="R1 — show running-config (extras, ilustrativ)" kind="session" code={`R1# show running-config | include secret|password|username|login|transport|exec-timeout
service password-encryption
security passwords min-length 10
login block-for 120 attempts 3 within 60
login on-failure log
login on-success log
enable secret 5 $1$mERr$kJ8…
username admin privilege 15 secret 5 $1$x2Qa$Hf1…
username operator secret 5 $1$Tn7B$4Gq…
 login local
 exec-timeout 5 0
 login local
 transport input ssh
 exec-timeout 5 0`} explain={[
          ['enable secret 5 $1$…', 'Hash tip 5 (MD5): parola nu mai apare în clar.'],
          ['username … secret 5 …', 'Conturi locale, parola hashuită.'],
          ['login local (de două ori)', 'Una pentru console, una pentru VTY.'],
          ['Absența „enable password”', 'Confirmă că parola veche în clar a fost eliminată.'],
        ]} />
        <CodeBlock title="R1 — sesiuni și starea login (ilustrativ)" kind="session" code={`R1# show users
    Line       User       Host(s)              Idle       Location
*  0 con 0     admin      idle                 00:00:00
  66 vty 0     operator   idle                 00:00:42 192.168.1.100
R1# show login
 A login delay of 1 seconds is applied.
 No Quiet-Mode access list has been configured.
 All successful login is logged.
 All failed login is logged.
 Router enabled to watch for login Attacks.
 If more than 3 login failures occur in 60 seconds or less,
 logins will be disabled for 120 seconds.
 Router presently in Normal-Mode.
 Current Watch Window
 Time remaining: 40 seconds.
 Failures: 0
R1# show privilege
Current privilege level is 15`} explain={[
          ['* 0 con 0 admin', 'Sesiunea curentă (asteriscul) pe consolă, utilizatorul admin.'],
          ['vty 0 operator 192.168.1.100', 'O sesiune la distanță a utilizatorului operator, venind de la 192.168.1.100.'],
          ['Router presently in Normal-Mode', 'Nu este în quiet mode; după 3 eșecuri ar afișa Quiet-Mode cu timpul rămas.'],
          ['show privilege', 'Nivelul curent de privilegiu (1 = user, 15 = privilegiat).'],
        ]} />
        <Table head={['Comandă', 'Ce verifică']} hlCol={0} rows={[
          [<code key="a">show running-config</code>, 'Parole (tip 0/5/7/8/9), conturi, comenzi pe linii'],
          [<code key="b">show users</code>, 'Cine este conectat acum, pe ce linie, de unde'],
          [<span key="c"><code>show login</code> · <code>show login failures</code></span>, 'Starea quiet mode și ultimele eșecuri'],
          [<code key="d">show privilege</code>, 'Nivelul curent de privilegiu'],
          [<code key="e">show line</code>, 'Liniile disponibile și configurația lor'],
          [<code key="f">show logging</code>, 'Mesajele de login reușit/eșuat (4.5)'],
        ]} />
        <Reveal label="Test practic: 5 verificări înainte să închizi sesiunea">
          <ol>
            <li>Deschide o <b>a doua</b> sesiune SSH și autentifică-te cu <code>operator</code>; ajungi la <code>&gt;</code>? <code>enable</code> cere parola secret?</li>
            <li>Încearcă o parolă greșită de 3 ori: apare quiet mode? (<code>show login</code>)</li>
            <li>Încearcă Telnet: este refuzat?</li>
            <li><code>show running-config | include password</code>: mai există parole în clar?</li>
            <li>Verifică jurnalul: sunt mesaje <code>%SEC_LOGIN-4-LOGIN_FAILED</code> / <code>%SEC_LOGIN-5-LOGIN_SUCCESS</code>?</li>
          </ol>
        </Reveal>
      </Detailed>

      <Detailed title="3. Variantă: hash-uri puternice (dacă platforma le suportă)">
        <CodeBlock title="R1 — tip 8/9 (ilustrativ)" kind="config" code={`R1(config)# enable algorithm-type scrypt secret Str0ng!Enable
R1(config)# username admin privilege 15 algorithm-type scrypt secret Adm1n!Pass2024`} explain={[
          ['enable algorithm-type scrypt secret …', 'Parola enable stocată cu scrypt (tip 9).'],
          ['username … algorithm-type scrypt secret …', 'Contul local cu hash tip 9; sha256 = tip 8.'],
        ]} />
        <Callout kind="info" title="Dacă primești eroare">
          O comandă respinsă cu <code>% Invalid input</code> înseamnă că versiunea/platforma nu o suportă. Folosește <code>secret</code> simplu (tip 5) și compensează cu parole lungi și <code>login block-for</code>.
        </Callout>
      </Detailed>
      <Traps items={[
        <><code>show running-config</code> arată parola enable doar ca hash; dar conturile cu <code>password</code> (nu <code>secret</code>) apar în clar sau tip 7.</>,
        <>Nu testa <code>login local</code> pe VTY dintr-o singură sesiune: dacă greșești, te blochezi.</>,
        <><code>transport input ssh</code> fără chei RSA și <code>ip domain-name</code> (4.8) refuză orice conexiune.</>,
        <>Output-urile sunt <b>ilustrative</b>; hash-urile și coloanele reale diferă.</>,
      ]} />
      <InlineQuiz ids={['5.3-017', '5.3-018', '5.3-019', '5.3-020']} />
    </section>
  );
}
