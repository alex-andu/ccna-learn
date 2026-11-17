import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.4" title="Exemple: aplicarea politicii de parole pe IOS (și limitele ei)" />
      <Summary>
        <p>5.4 este un topic de concepte, dar fiecare element de politică are un corespondent (parțial) pe dispozitiv: <b>lungime minimă</b>, <b>hash-uri</b>, <b>blocare după eșecuri</b>, <b>timeout</b>, <b>conturi individuale</b>. Ce <b>nu</b> poate face un router singur: MFA, expirarea parolelor, istoricul parolelor — acelea vin din AAA centralizat (5.8).</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Output-urile sunt <b>exemple ilustrative</b>; comenzile <b>nu au fost testate</b> pe echipamente reale, iar hash-urile 8/9 și comenzile PKI diferă între platforme și Packet Tracer. Configurarea AAA/MFA completă este la 5.8.
      </Callout>

      <Detailed title="1. Politică → ce poți impune pe IOS">
        <Table head={['Element de politică', 'Pe un dispozitiv Cisco', 'Observație']} hlCol={0} rows={[
          ['Lungime minimă', <code key="a">security passwords min-length 12</code>, 'Se aplică parolelor noi'],
          ['Stocare ca hash', <code key="b">enable secret</code>, 'Plus username … secret / algorithm-type'],
          ['Blocare după eșecuri', <code key="c">login block-for …</code>, 'Frânează ghicirea online (VTY)'],
          ['Sesiuni inactive', <code key="d">exec-timeout 5 0</code>, 'Pe console și VTY'],
          ['Conturi individuale, fără parole comune', <code key="e">username … secret + login local</code>, 'Audit pe persoană'],
          ['Eliminarea parolelor implicite', <code key="f">no username cisco</code> , 'Șterge conturile implicite sau de test'],
          ['Rotire / istoric / expirare', 'Nu pe un router cu autentificare locală', 'Doar prin AAA/IdP central'],
          ['MFA', 'Nu pe router', 'Server AAA/IdP (ISE, aplicație de autentificare), VPN, 802.1X'],
        ]} />
      </Detailed>

      <Detailed title="2. Scenariul: R1 conform politicii „minimum 12 caractere, hash puternic, blocare după 3 eșecuri”">
        <CodeBlock title="R1 — politica locală de parole (ilustrativ)" kind="config" code={`R1(config)# security passwords min-length 12
R1(config)# enable secret L0ng!Enable-Passphrase
R1(config)# username admin privilege 15 secret L0ng!Admin-Passphrase
R1(config)# no username cisco
R1(config)# login block-for 120 attempts 3 within 60
R1(config)# login on-failure log
R1(config)# line console 0
R1(config-line)# login local
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# line vty 0 15
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# banner login # Acces permis doar personalului autorizat. #`} explain={[
          ['security passwords min-length 12', 'Parolele noi trebuie să aibă minimum 12 caractere: lungimea e cel mai important element de complexitate.'],
          ['enable secret …', 'Parola privilegiată stocată ca hash.'],
          ['username admin … secret …', 'Cont individual; parolă hashuită, lungă (passphrase).'],
          ['no username cisco', 'Elimină un cont implicit/de test (dacă există): parolele implicite sunt primele încercate.'],
          ['login block-for 120 attempts 3 within 60', 'Frânează ghicirea parolei pe VTY (parte a „management”).'],
          ['login on-failure log', 'Urme în syslog ale încercărilor eșuate.'],
          ['login local (console, VTY)', 'Autentificare cu conturi individuale.'],
          ['exec-timeout 5 0', 'Închide sesiunile uitate.'],
        ]} />
        <Callout kind="tip" title="Passphrase în IOS">
          O frază lungă este acceptată de IOS (nu folosi caractere speciale problematice precum <code>?</code> la introducere, deoarece este tasta de ajutor). Cu <code>min-length</code>, politica forțează lungimea, nu și imprevizibilitatea: aceea depinde de utilizator.
        </Callout>
      </Detailed>

      <Detailed title="3. Pe linia de MFA: conectarea la un server AAA (concept)">
        <CodeBlock title="R1 — autentificare centralizată cu fallback local (ilustrativ, detalii la 5.8)" kind="config" code={`R1(config)# aaa new-model
R1(config)# radius server MFA-GW
R1(config-radius-server)# address ipv4 10.0.0.20 auth-port 1812 acct-port 1813
R1(config-radius-server)# key S3cretRadiusKey
R1(config-radius-server)# exit
R1(config)# aaa authentication login default group radius local`} explain={[
          ['aaa new-model', 'Activează modelul AAA pe echipament.'],
          ['radius server MFA-GW', 'Definește serverul (de exemplu un gateway/ISE care validează parola și apoi cere al doilea factor).'],
          ['key …', 'Secretul partajat între router și server (RADIUS protejează doar câmpul de parolă).'],
          ['aaa authentication login default group radius local', 'Încearcă serverul RADIUS; dacă nu răspunde, folosește conturile locale (fallback).'],
        ]} />
        <Callout kind="info" title="Unde apare MFA aici">
          Routerul nu „face” MFA: <b>serverul</b> cere al doilea factor. Pe router vezi doar rezultatul (acces permis/refuzat). De aceea MFA este un subiect de arhitectură, nu o comandă. Sintaxa <code>radius server</code> depinde de versiunea IOS.
        </Callout>
      </Detailed>

      <Detailed title="4. Verificare">
        <CodeBlock title="R1 — verificări (ilustrativ)" kind="session" code={`R1# show running-config | include secret|min-length|block-for
security passwords min-length 12
login block-for 120 attempts 3 within 60
enable secret 9 $9$x1Tz…
username admin privilege 15 secret 9 $9$Yw2q…
R1(config)# username test secret abc
% Password too short - minimum length is 12
R1# show crypto key mypubkey rsa
% Key pair was generated at: 10:15:12 UTC Nov 16 2026
Key name: R1.lab.local
 Usage: General Purpose Key
 Key is not exportable.
R1# show crypto pki certificates
(afișează certificatele PKI configurate; gol dacă nu există)`} explain={[
          ['enable secret 9 …', 'Hash scrypt (dacă platforma îl acceptă și a fost ales).'],
          ['% Password too short …', 'Politica de lungime minimă a respins o parolă nouă; textul exact variază.'],
          ['show crypto key mypubkey rsa', 'Cheile RSA ale echipamentului (folosite de SSH; cheie publică, nu secretul).'],
          ['show crypto pki certificates', 'Certificatele PKI ale dispozitivului, dacă există (configurarea PKI depășește CCNA).'],
        ]} />
        <Reveal label="Audit rapid al politicii pe un dispozitiv">
          <ol>
            <li>Există parole în clar? <code>show running-config | include password</code> (tip 0 sau tip 7).</li>
            <li>Lungimea minimă e setată? <code>show running-config | include min-length</code>.</li>
            <li>Mai există conturi implicite sau comune (<code>username cisco</code>, <code>username admin password …</code>)?</li>
            <li>Toate liniile (console, VTY 0–15, AUX) folosesc <code>login local</code> sau AAA?</li>
            <li>Există blocare și jurnalizare a eșecurilor?</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <><code>security passwords min-length</code> nu face parolele „bune”, doar lungi; utilizatorii pot alege <code>aaaaaaaaaaaa</code>.</>,
        <>Un router cu autentificare locală nu poate impune rotire, istoric sau MFA: acestea cer AAA/IdP.</>,
        <>Când pui <code>login local</code>, ai nevoie de cel puțin un cont; testează în a doua sesiune înainte să te deconectezi.</>,
        <>Output-urile sunt <b>ilustrative</b>; mesajele reale pot diferi.</>,
      ]} />
      <InlineQuiz ids={['5.4-019', '5.4-020']} />
    </section>
  );
}
