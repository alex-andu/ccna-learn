import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.2" title="Exemple: legătura cu echipamentele (acces fizic, console, casare)" />
      <Summary>
        <p>Programul de securitate nu se configurează pe un router, dar se vede în configurație: <b>consola protejată</b>, <b>porturile libere închise</b>, un <b>banner</b> care avertizează, <b>jurnalizarea</b> accesului și <b>ștergerea configurației</b> înainte de casare. Aici vezi cum se leagă controlul fizic de comenzile IOS.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Output-urile sunt <b>exemple ilustrative</b>. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente reale; disponibilitatea și textul variază între platforme. <b>Atenție:</b> <code>no service password-recovery</code> poate face un echipament nerecuperabil fără ștergerea configurației; citește documentația platformei înainte de a-l folosi.
      </Callout>

      <Detailed title="1. Tabel: control fizic/organizatoric → ce poți configura">
        <Table head={['Control din program', 'Configurare IOS', 'Rol']} hlCol={0} rows={[
          ['Port console accesibil fizic', <code key="a">line con 0 / login / exec-timeout 5 0</code>, 'Cine ajunge la consolă tot trebuie să se autentifice, iar sesiunea se închide la inactivitate'],
          ['Prize și porturi libere', <code key="b">interface range … / shutdown</code>, 'Un vizitator nu poate folosi o priză liberă'],
          ['Politică de acces acceptabil', <code key="c">banner login …</code>, 'Avertisment legal afișat înainte de autentificare'],
          ['Jurnalizare și audit', <code key="d">logging host …</code>, 'Urmă a accesului și a modificărilor (4.5)'],
          ['Recuperarea parolei doar pentru personal autorizat', <code key="e">no service password-recovery</code>, 'Împiedică resetarea parolei prin consolă, cu un compromis important'],
          ['Casare / returnare echipament', <span key="f"><code>write erase</code> + <code>reload</code></span>, 'Șterge configurația salvată; discurile sensibile se tratează separat'],
        ]} />
      </Detailed>

      <Detailed title="2. Scenariul: R1 și SW1 într-un dulap de rețea">
        <CodeBlock title="R1 / SW1 — console, avertisment, porturi libere (ilustrativ)" kind="config" code={`R1(config)# banner login # Acces permis doar personalului autorizat. Activitatea este inregistrata. #
R1(config)# line console 0
R1(config-line)# password C0nsole!Pass
R1(config-line)# login
R1(config-line)# exec-timeout 5 0
R1(config-line)# logging synchronous
R1(config-line)# exit
R1(config)# logging host 192.168.1.10
SW1(config)# interface range fastEthernet 0/7 - 24
SW1(config-if-range)# description PRIZA LIBERA
SW1(config-if-range)# shutdown`} explain={[
          ['banner login # … #', 'Mesaj afișat înainte de autentificare; delimitatorul # marchează începutul și sfârșitul.'],
          ['line console 0 / password / login', 'Protejează consola: fără login, oricine conectează un cablu primește acces direct.'],
          ['exec-timeout 5 0', 'Dacă cineva uită consola deschisă, sesiunea se închide după 5 minute.'],
          ['logging host 192.168.1.10', 'Trimite evenimentele (autentificări, modificări) către serverul syslog.'],
          ['interface range … shutdown', 'Priza liberă din perete nu mai oferă rețea.'],
        ]} />
        <Callout kind="info" title="Banner: ce să scrii și ce nu">
          Spune clar că accesul este autorizat și monitorizat; nu pune „Welcome”, nici numele companiei, modelul echipamentului sau topologia. Textul legal exact se stabilește cu departamentul juridic.
        </Callout>
        <CodeBlock title="Casarea unui echipament (ilustrativ)" kind="session" code={`R1# write erase
Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]
[OK]
Erase of nvram: complete
R1# reload`} explain={[
          ['write erase', 'Șterge startup-config; la repornire echipamentul pornește fără configurație.'],
          ['Continue? [confirm]', 'IOS cere confirmare, deoarece acțiunea este distructivă.'],
          ['reload', 'Repornește echipamentul.'],
        ]} />
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="Verificări (ilustrativ)" kind="session" code={`R1# show running-config | section line con
line con 0
 exec-timeout 5 0
 password C0nsole!Pass
 logging synchronous
 login
SW1# show interfaces status | include PRIZA
Fa0/7   PRIZA LIBERA   disabled   1   auto  auto  10/100BaseTX
Fa0/8   PRIZA LIBERA   disabled   1   auto  auto  10/100BaseTX`} explain={[
          ['show running-config | section line con', 'Arată doar configurația liniei console.'],
          ['password C0nsole!Pass', 'Apare în clar în exemplu: la 5.3 vei vedea de ce și cum se protejează (service password-encryption, utilizatori locali).'],
          ['disabled', 'Portul este oprit administrativ.'],
        ]} />
        <Reveal label="Întrebări de reflecție">
          <ol>
            <li>De ce un port console fără parolă este mai periculos într-o sală de servere deschisă decât una încuiată?</li>
            <li>Ce risc introduce <code>no service password-recovery</code> dacă uiți parola?</li>
            <li>Ce control ai folosi ca să afli <i>cine</i> a intrat în dulap? (Indiciu: jurnal de acces, camere.)</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Parola de consolă în clar în <code>show run</code> este slabă; o rezolvi la 5.3 (<code>service password-encryption</code> e doar ofuscare, <code>secret</code> + utilizatori locali e mai bine).</>,
        <>Banner-ul nu oprește un atacator; are valoare legală și de descurajare, nu tehnică.</>,
        <><code>write erase</code> nu șterge „sigur” un disc sau un stick; casarea media are proceduri separate.</>,
        <>Output-urile sunt <b>ilustrative</b>; textele reale pot diferi.</>,
      ]} />
      <InlineQuiz ids={['5.2-014', '5.2-015']} />
    </section>
  );
}
