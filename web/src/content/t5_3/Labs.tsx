import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology53, LabSoloTopology53 } from '../../diagrams/t5_3';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't53g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.3-G" title="Lab ghidat — acces local securizat: console, VTY, enable și utilizatori" />
      <Summary>
        <p><b>Obiectiv:</b> pornești de la un router fără protecție, configurezi parole pe console și VTY, <code>enable secret</code>, conturi locale, <code>service password-encryption</code>, lungimea minimă și <code>login block-for</code>, apoi verifici cu <code>show</code> și un test real. <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router, 1 × switch, 1 × PC, 1 × Server) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: Admin PC — SW1 — R1 și server syslog (192.168.1.10).">
        <LabGuidedTopology53 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '192.168.1.1/24'],
        ['Admin PC', 'NIC', '192.168.1.100/24'],
        ['Server syslog', 'NIC', '192.168.1.10/24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă <code>enable secret</code>, <code>username … secret</code>, <code>login local</code>, <code>service password-encryption</code>, <code>security passwords min-length</code> și (în versiuni recente) <code>login block-for</code>; <code>algorithm-type</code> (hash 8/9) și unele opțiuni <code>login on-… log</code> pot lipsi. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Același lab merge în GNS3/CML cu IOSv.
      </Callout>

      <Detailed title="Partea 0 — Starea inițială">
        <Step labKey={L} n={1} title="Adresare și acces implicit">
          <p>Configurează <code>Gi0/0</code> pe R1 (192.168.1.1/24) și adresa PC-ului. Conectează-te de pe PC la R1 prin <i>Desktop → Telnet / SSH</i>. Ce se întâmplă? Apoi conectează-te prin cablu console (Terminal).</p>
          <Reveal label="Răspuns">
            <p>Pe VTY: „Password required, but none set” și conexiunea se închide; pe consolă: ajungi direct în EXEC. Aceasta arată comportamentul implicit al celor două linii.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Parole pe linii și enable">
        <Step labKey={L} n={2} title="Consola și VTY cu parola liniei">
          <CodeBlock title="R1" kind="config" code={`R1(config)# line console 0
R1(config-line)# password C0nsolePass!
R1(config-line)# login
R1(config-line)# exit
R1(config)# line vty 0 4
R1(config-line)# password VtyPass2024!
R1(config-line)# login`} explain={[
            ['password … / login', 'Stabilește parola și cere verificarea ei.'],
            ['line vty 0 4', 'Prima jumătate a liniilor VTY; pe un switch rămâne și 5–15.'],
          ]} />
          <p>Testează Telnet de pe PC. Ce se cere acum? Cât de multe persoane trebuie să știe parola?</p>
          <Reveal label="Răspuns">
            <p>Se cere o singură parolă (a liniei), comună tuturor administratorilor — nu se știe cine a intrat. Intri doar în user EXEC (<code>&gt;</code>).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="enable password vs enable secret">
          <CodeBlock title="R1" kind="config" code={`R1(config)# enable password parolaClara1
R1(config)# enable secret Str0ng!Enable
R1(config)# end
R1# show running-config | include enable`} explain={[
            ['enable password', 'Parolă în clar în configurație.'],
            ['enable secret', 'Parolă hashuită, cu prioritate.'],
          ]} />
          <p>Care parolă o cere <code>enable</code>? Cum arată cele două în <code>show run</code>? Elimină-o pe cea veche.</p>
          <Reveal label="Răspuns">
            <p>Se cere <code>enable secret</code>; <code>enable password</code> e ignorată dar rămâne vizibilă în clar. O elimini cu <code>no enable password</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="service password-encryption">
          <p>Verifică <code>show running-config | include password</code> înainte și după <code>service password-encryption</code>. Ce tip de parolă apare la liniile cu <code>password</code>? E suficient?</p>
          <Reveal label="Răspuns">
            <p>Din „password C0nsolePass!” (tip 0) devine „password 7 …” (tip 7). Tip 7 e reversibil: îl treci printr-un decodor public și obții parola. Nu e protecție reală; soluția este <code>login local</code> cu <code>username … secret</code>.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Conturi locale și protecții">
        <Step labKey={L} n={5} title="Conturi locale">
          <CodeBlock title="R1" kind="config" code={`R1(config)# security passwords min-length 10
R1(config)# username admin privilege 15 secret Adm1n!Pass2024
R1(config)# username operator secret Op3r@torPass
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# no password
R1(config-line)# exit
R1(config)# line console 0
R1(config-line)# login local`} explain={[
            ['min-length 10', 'Respinge parolele noi mai scurte de 10 caractere.'],
            ['username admin privilege 15 secret', 'Administrator care intră direct în #.'],
            ['username operator secret', 'Utilizator în > ; trebuie să dea enable.'],
            ['login local', 'Cere utilizator + parolă din baza locală.'],
          ]} />
          <p>Încearcă să creezi <code>username test secret abc</code> (parolă scurtă). Ce răspunde routerul? Apoi conectează-te cu <code>operator</code> și cu <code>admin</code>: ce prompt apare?</p>
          <Reveal label="Răspuns">
            <p>Parola scurtă e respinsă (mesaj despre lungimea minimă). <code>operator</code> ajunge la <code>R1&gt;</code>; <code>admin</code> la <code>R1#</code> (privilegiu 15). <code>show users</code> arată ambele sesiuni.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Blocarea după eșecuri">
          <CodeBlock title="R1" kind="config" code={`R1(config)# login block-for 60 attempts 3 within 30
R1(config)# login on-failure log
R1(config)# line vty 0 4
R1(config-line)# exec-timeout 5 0`} explain={[
            ['login block-for 60 attempts 3 within 30', 'După 3 eșecuri în 30 s, quiet mode 60 s (valori mici, pentru test).'],
            ['login on-failure log', 'Mesaj syslog la fiecare eșec.'],
          ]} />
          <p>De pe PC, greșește parola de 3 ori. Ce se întâmplă la a patra încercare, chiar cu parola corectă? Ce arată <code>show login</code>?</p>
          <Reveal label="Răspuns">
            <p>Conexiunea este refuzată pe durata quiet mode; <code>show login</code> arată „presently in Quiet-Mode” cu timpul rămas. După expirare, logarea revine la normal.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce nu e suficient <code>service password-encryption</code>? (2) De ce <code>login local</code> e mai bun decât parola liniei? (3) Ce limită are autentificarea locală pe 50 de echipamente?</p>
          <Reveal label="Indicii">
            <p>(1) Tip 7 e reversibil. (2) Conturi individuale = audit și revocare. (3) Trebuie reconfigurat fiecare echipament; soluția este AAA centralizat (5.8).</p>
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
  const L = 't53s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.3-S" title="Lab solo — nu mă pot conecta pe VTY" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a „securizat” R1, dar acum conexiunea de la distanță eșuează. Configurația primită este de mai jos. Găsește problemele (sunt cel puțin trei) și corectează-le fără să pierzi accesul prin consolă. <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer (1 router, 1 switch, 1 PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: Admin PC, SW1, R1.">
        <LabSoloTopology53 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        Final: console și VTY cu <code>login local</code>, cel puțin un utilizator, <code>enable secret</code>, fără <code>enable password</code>, <code>exec-timeout 5 0</code> și VTY doar SSH (SSH ca la 4.8). Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Configurația primită">
        <Step labKey={L} n={1} title="Încarcă configurația">
          <CodeBlock title="R1 (de încărcat)" kind="config" code={`hostname R1
enable password cisco
enable secret
!
line console 0
 password cisco
 no login
!
line vty 0 4
 login local
 transport input ssh
!
line vty 5 15
 password cisco
 login
!
! (nu există niciun username)`} explain={[
            ['enable password cisco', 'Parolă în clar, probabil rămasă din trecut.'],
            ['line console 0 → no login', 'Parola de consolă nu se mai cere.'],
            ['line vty 0 4 → login local', 'Fără utilizatori definiți, nimeni nu poate intra.'],
            ['line vty 5 15', 'Rămas cu parolă comună și Telnet permis implicit.'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Nu există niciun <code>username</code></b>, deci <code>login local</code> pe VTY 0–4 nu are cu ce autentifica: acesta e motivul pentru care nu poți intra.</li>
              <li><b>Consola are <code>no login</code></b>: oricine cu cablu intră fără parolă.</li>
              <li><b>Liniile VTY 5–15</b> au parolă comună și nu au <code>transport input ssh</code>: Telnet permis pe cele nesecurizate.</li>
              <li><b><code>enable password</code> în clar</b> rămasă, iar <code>enable secret</code> (linia goală) nu are o parolă validă.</li>
              <li>Lipsesc <code>exec-timeout</code>, <code>service password-encryption</code> și protecțiile <code>login block-for</code>.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <p>Intră prin consolă și aplică corecțiile; apoi testează conectarea la distanță cu SSH.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# enable secret Str0ng!Enable
R1(config)# no enable password
R1(config)# username admin privilege 15 secret Adm1n!Pass2024
R1(config)# line console 0
R1(config-line)# login local
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# line vty 0 15
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# login block-for 120 attempts 3 within 60
R1(config)# service password-encryption`} explain={[
              ['username admin …', 'Rezolvă cauza principală: există un cont pentru login local.'],
              ['line vty 0 15 + transport input ssh', 'Aceleași reguli pe toate liniile.'],
              ['no enable password', 'Elimină parola veche în clar.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Verifică din consolă: <code>show running-config | section line</code>, apoi conectează-te prin SSH cu <code>admin</code>. Ce se întâmplă dacă încerci Telnet?</p>
          <Reveal label="Răspuns">
            <p>SSH cere utilizator + parolă și funcționează (dacă SSH e configurat conform 4.8); Telnet este refuzat. Nu mai există <code>enable password</code> în configurație.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
