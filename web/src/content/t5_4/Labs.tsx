import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology54, LabSoloTopology54 } from '../../diagrams/t5_4';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't54g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.4-G" title="Lab ghidat — politica de parole: de la teorie la R1" />
      <Summary>
        <p><b>Obiectiv:</b> evaluezi parole (entropie), aplici pe un router elementele de politică disponibile local (lungime, hash, blocare), observi limitele autentificării locale și inspectezi un certificat real într-un browser. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router, 1 × switch, 1 × PC) + un browser obișnuit pentru partea cu certificatul · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: Admin PC — SW1 — R1 și server syslog (192.168.1.10).">
        <LabGuidedTopology54 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '192.168.1.1/24'],
        ['Admin PC', 'NIC', '192.168.1.100/24'],
        ['Server syslog', 'NIC', '192.168.1.10/24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer nu are MFA, certificate emise de CA publice, nici biometrie: acele părți se fac „pe hârtie” sau în browser. Comenzile IOS (<code>security passwords min-length</code>, <code>login block-for</code>, <code>username … secret</code>) <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT; <code>algorithm-type</code> poate lipsi.
      </Callout>

      <Detailed title="Partea 0 — Cât de bună este o parolă">
        <Step labKey={L} n={1} title="Calculează entropia">
          <p>Deschide calculatorul de entropie din lecție (secțiunea „Cum se atacă parolele”). Completează tabelul pentru: (a) 8 caractere cu toate tipurile; (b) 14 litere mici; (c) 4 cuvinte aleatoare; (d) 6 cuvinte aleatoare. Ce observi?</p>
          <Reveal label="Răspuns">
            <p>(a) 8 × log₂(95) ≈ 53 biți; (b) 14 × log₂(26) ≈ 66 biți; (c) 4 × log₂(7776) ≈ 52 biți; (d) ≈ 78 biți. Observație: 14 litere mici bat 8 caractere „complexe”, iar un passphrase de 6 cuvinte e foarte puternic și memorabil. Lungimea contează cel mai mult (în ipoteza alegerii aleatoare).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Parole „umane”">
          <p>Explică pe scurt de ce „Iarna2024!” are în practică mult mai puțină entropie decât spune formula, deși are majusculă, cifre și simbol.</p>
          <Reveal label="Răspuns">
            <p>Atacatorii încearcă întâi modele uzuale (cuvânt din dicționar + an + simbol): spațiul real este mic. Formula presupune alegere aleatoare a fiecărui caracter.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Aplicarea pe R1">
        <Step labKey={L} n={3} title="Lungime minimă și hash">
          <CodeBlock title="R1" kind="config" code={`R1(config)# security passwords min-length 12
R1(config)# enable secret L0ng!Enable-Passphrase
R1(config)# username admin privilege 15 secret L0ng!Admin-Passphrase
R1(config)# username test secret abc`} explain={[
            ['min-length 12', 'Parolele noi trebuie să aibă ≥ 12 caractere.'],
            ['username test secret abc', 'Test: parola scurtă ar trebui respinsă.'],
          ]} />
          <p>Ce răspunde routerul la ultima comandă? Cum arată parolele în <code>show running-config</code>?</p>
          <Reveal label="Răspuns">
            <p>Parola scurtă e respinsă (mesaj de lungime). În configurație vezi hash-uri (<code>secret 5 …</code>, sau 8/9), nu parolele.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Blocarea ghicirii">
          <CodeBlock title="R1" kind="config" code={`R1(config)# login block-for 60 attempts 3 within 30
R1(config)# login on-failure log
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh`} explain={[
            ['login block-for 60 attempts 3 within 30', 'Valori mici, pentru test: 3 eșecuri în 30 s → 60 s de blocare.'],
            ['login on-failure log', 'Jurnalizează fiecare eșec.'],
          ]} />
          <p>(Dacă ai SSH configurat de la 4.8.) Greșește parola de 3 ori. Ce se întâmplă? Cum ar folosi un atacator această protecție împotriva ta (DoS)?</p>
          <Reveal label="Răspuns">
            <p>Quiet mode: logările sunt refuzate pe durata blocării. Un atacator poate declanșa intenționat blocarea ca să împiedice administratorul să intre: de aceea se permit stații de administrare prin <code>login quiet-mode access-class</code>.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Dincolo de parole (în afara PT)">
        <Step labKey={L} n={5} title="Inspectează un certificat">
          <p>Într-un browser, deschide orice site HTTPS (de exemplu o bancă sau un site de știri) și vezi certificatul (clic pe lacăt → certificat). Notează: <i>emitentul</i>, <i>valabil de la/până la</i>, <i>numele alternative (SAN)</i> și <i>lanțul</i> de certificate.</p>
          <Reveal label="Ce ar trebui să vezi">
            <p>Un lanț: CA rădăcină → CA intermediar → certificatul serverului; perioadă de valabilitate de ordinul lunilor sau al anilor; numele site-ului în SAN. Compară cu simulatorul de validare din lecție: ce s-ar întâmpla dacă data ar fi expirată?</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="MFA în viața reală">
          <p>Pentru un cont personal important (e-mail), verifică ce metode MFA oferă serviciul și clasifică-le: knowledge / possession / inherence. Care e cea mai rezistentă la phishing?</p>
          <Reveal label="Indicii">
            <p>Parola = knowledge; aplicația de coduri, notificarea push, SMS, cheia hardware = possession; amprenta/fața = inherence (de obicei deblochează local un dispozitiv). Cele mai rezistente la phishing: cheile FIDO2 / passkeys. SMS este cea mai slabă dintre metodele de possession.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) Ce elemente de politică nu poate impune R1 singur? (2) De ce nu e suficientă o parolă complexă și scurtă? (3) Ce risc rămâne chiar cu MFA?</p>
          <Reveal label="Indicii">
            <p>(1) Rotire, istoric, expirare, MFA — cer AAA/IdP. (2) Entropia mică și atacul offline. (3) Phishing în timp real, push fatigue, compromiterea ambilor factori.</p>
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
  const L = 't54s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.4-S" title="Lab solo — de la cerințe de politică la comenzi" />
      <Summary>
        <p><b>Scenariu:</b> conducerea cere: „parole de minimum 14 caractere, conturi individuale, fără parole în clar, blocare după 5 eșecuri în 2 minute pentru 10 minute, sesiuni de maximum 10 minute inactivitate”. Un administrator se plânge că „uneori nu poate intra deși parola e corectă”. <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer (1 router, 1 switch, 1 PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: Admin PC, SW1, R1.">
        <LabSoloTopology54 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        Traduce fiecare cerință într-o comandă IOS, apoi explică plângerea administratorului. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Cerință → comandă">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# security passwords min-length 14
R1(config)# enable secret Lung!Parola-Enable14
R1(config)# username admin privilege 15 secret Lung!Parola-Admin14
R1(config)# login block-for 600 attempts 5 within 120
R1(config)# service password-encryption
R1(config)# line console 0
R1(config-line)# login local
R1(config-line)# exec-timeout 10 0
R1(config-line)# exit
R1(config)# line vty 0 15
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# exec-timeout 10 0`} explain={[
              ['min-length 14', 'Lungimea minimă din cerință.'],
              ['login block-for 600 attempts 5 within 120', '5 eșecuri în 120 s → 600 s (10 minute).'],
              ['exec-timeout 10 0', '10 minute de inactivitate.'],
              ['service password-encryption', 'Acoperă parolele care ar rămâne în clar (de exemplu o parolă de linie).'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic">
        <Step labKey={L} n={2} title="De ce „uneori nu poate intra”?">
          <Reveal label="Cauze posibile">
            <ol>
              <li><b>Quiet mode</b>: cineva (sau un atac) a produs 5 eșecuri în 2 minute; toate logările sunt refuzate 10 minute, inclusiv ale administratorului (<code>show login</code>).</li>
              <li><b>Parola nouă respinsă</b> din cauza <code>min-length</code>: administratorul nu a putut schimba parola.</li>
              <li><b>login local</b> pe linie, dar contul a fost șters sau scris greșit.</li>
              <li><b>Timeout</b> prea scurt, sesiunea s-a închis.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Remedieri">
          <p>Cum păstrezi protecția și totuși permiți administratorului să intre în quiet mode?</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# ip access-list standard ADMIN-HOSTS
R1(config-std-nacl)# permit host 192.168.1.100
R1(config-std-nacl)# exit
R1(config)# login quiet-mode access-class ADMIN-HOSTS`} explain={[
              ['permit host 192.168.1.100', 'Stația de administrare de încredere.'],
              ['login quiet-mode access-class ADMIN-HOSTS', 'Adresele din ACL pot intra și în timpul quiet mode.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Ce lipsește din politică?">
          <p>Numește trei elemente din cerințele conducerii pe care R1 singur nu le poate asigura.</p>
          <Reveal label="Răspuns">
            <p>Rotirea/expirarea parolelor, MFA și un manager de parole/distribuția sigură a parolelor. Se rezolvă cu AAA centralizat (5.8), proceduri și instruire (5.2).</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
