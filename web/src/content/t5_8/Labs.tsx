import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology58, LabSoloTopology58 } from '../../diagrams/t5_8';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't58g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.8-G" title="Lab ghidat — AAA pe un router, cu server și fallback local" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi autentificarea unui router prin serverul AAA, cu fallback local; demonstrezi diferența dintre „server căzut” și „server care refuză” și observi cele trei funcții. <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router, 1 × server cu serviciul AAA, 1 × PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC-Admin — R1 (NAS) — Server AAA.">
        <LabGuidedTopology58 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['PC-Admin', 'NIC', '10.0.0.100/24, gw 10.0.0.1'],
        ['R1', 'Gi0/0 (PC) · Gi0/1 (server)', '10.0.0.1/24 · 10.0.1.1/24'],
        ['Server AAA', 'NIC', '10.0.1.20/24, gw 10.0.1.1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Serverul din PT are serviciul AAA (Services → AAA) cu clienți RADIUS/TACACS+ și utilizatori. Comenzile <code>aaa new-model</code>, <code>aaa authentication login</code> și <code>radius-server host …</code>/<code>tacacs-server host …</code> sunt suportate; sintaxa <code>tacacs server NUME</code> (submod) și autorizarea/accounting-ul pe comenzi pot lipsi. Dacă versiunea ta nu o suportă, folosește sintaxa veche (<code>radius-server host 10.0.1.20 key …</code>). Comenzile <b>nu au fost testate</b> în PT. 802.1X complet nu se emulează în PT.
      </Callout>

      <Detailed title="Partea 0 — Conectivitate și cont de rezervă">
        <Step labKey={L} n={1} title="Adresare, rutare, utilizator local">
          <p>Configurează adresele, apoi pe R1 creează un utilizator local de rezervă și un SSH sau Telnet de test (PT acceptă Telnet pe VTY). Verifică ping PC-Admin → server.</p>
          <CodeBlock title="R1" kind="config" code={`R1(config)# username rezerva privilege 15 secret L0cal123
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input telnet ssh`} explain={[
            ['username rezerva … secret …', 'Cont de rezervă, creat ÎNAINTE de AAA.'],
            ['login local', 'Autentificare cu baza locală (înainte de a trece pe AAA).'],
          ]} />
          <Reveal label="Răspuns">
            <p>Din PC-Admin: <code>telnet 10.0.0.1</code> cu <code>rezerva</code>/<code>L0cal123</code> funcționează. Aceasta este baza de la care pornim.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Serverul AAA și lista de metode">
        <Step labKey={L} n={2} title="Pe server">
          <p>În PT: Server → Services → AAA: adaugă clientul <b>R1</b> (IP 10.0.1.1, secret <code>SharedSecret1</code>, tip RADIUS sau TACACS+) și un utilizator <code>ana</code>/<code>Parola123</code>.</p>
        </Step>
        <Step labKey={L} n={3} title="Pe R1">
          <CodeBlock title="R1 (sintaxa clasică, compatibilă cu PT)" kind="config" code={`R1(config)# aaa new-model
R1(config)# radius-server host 10.0.1.20 key SharedSecret1
R1(config)# aaa authentication login default group radius local
R1(config)# line vty 0 4
R1(config-line)# login authentication default`} explain={[
            ['aaa new-model', 'Pornește AAA.'],
            ['radius-server host … key …', 'Serverul RADIUS și secretul (sintaxa veche, acceptată în PT).'],
            ['aaa authentication login default group radius local', 'Server întâi, local ca rezervă.'],
          ]} />
          <p>Conectează-te din PC-Admin cu <code>ana</code>/<code>Parola123</code>, apoi cu <code>rezerva</code>/<code>L0cal123</code>. Ce se întâmplă în fiecare caz?</p>
          <Reveal label="Răspuns">
            <p><code>ana</code> este acceptat de server. <code>rezerva</code> <b>nu</b> este acceptat cât timp serverul este activ: serverul răspunde cu refuz (utilizator necunoscut) și fallback-ul local nu se activează (FAIL ≠ ERROR). Acesta este cel mai important lucru de reținut.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Server căzut, fallback și lockout">
        <Step labKey={L} n={4} title="Simulează căderea serverului">
          <p>Oprește serviciul AAA pe server sau deconectează cablul. Încearcă din nou <code>ana</code> și <code>rezerva</code>. Ce funcționează acum?</p>
          <Reveal label="Răspuns">
            <p>După timeout (câteva zeci de secunde în PT), <code>rezerva</code>/<code>L0cal123</code> este acceptat prin metoda „local”; <code>ana</code> nu mai poate (nu există în baza locală). Fallback-ul protejează accesul administrativ.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Lockout controlat">
          <p>Schimbă lista în <code>aaa authentication login default group radius</code> (fără local), cu serverul oprit. Încearcă să te conectezi. Cum te-ai recupera?</p>
          <Reveal label="Răspuns">
            <p>Nimeni nu se mai poate autentifica pe VTY. Recuperarea: acces prin <b>consolă</b> (care ar trebui să aibă lista ei separată, doar locală), apoi refacerea listei cu <code>local</code>. Concluzie: consola pe o listă separată și fallback local sunt asigurări obligatorii.</p>
            <CodeBlock title="R1 (prevenție)" kind="config" code={`R1(config)# aaa authentication login CONSOLE local
R1(config)# line console 0
R1(config-line)# login authentication CONSOLE`} explain={[
              ['login authentication CONSOLE', 'Consola nu depinde de server.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Reflecție">
          <p>Răspunde în scris: (1) De ce un refuz al serverului nu declanșează fallback? (2) Ce funcție AAA ai configurat și ce funcții lipsesc? (3) Când ai alege TACACS+ în loc de RADIUS?</p>
          <Reveal label="Indicii">
            <p>(1) Serverul a răspuns, deci nu este „indisponibil”; un FAIL este decizie, nu eroare. (2) Doar autentificare; autorizarea (privilegii) și accounting-ul lipsesc. (3) Pentru administrare cu autorizare pe comandă și criptare completă.</p>
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
  const L = 't58s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.8-S" title="Lab solo — AAA configurat greșit" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a pus R1 pe AAA, dar: serverul pare „mort” (nimeni nu se poate autentifica prin el), iar când serverul a căzut accidental, nimeni n-a mai putut intra. Găsește defectele (cel puțin trei) și corectează-le. <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> Packet Tracer · <b>Nivel:</b> intermediar–avansat</p>
      </Summary>
      <Figure caption="Topologie solo: aceeași ca la labul ghidat.">
        <LabSoloTopology58 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: autentificarea prin server funcționează pentru <code>ana</code>; cu serverul oprit, contul local <code>rezerva</code> permite intrarea; consola funcționează întotdeauna prin lista locală. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Configurația primită (extras)">
        <Step labKey={L} n={1} title="Citește configurația">
          <CodeBlock title="R1 (extras)" kind="config" code={`aaa new-model
radius-server host 10.0.1.200 key SecretA
aaa authentication login default group radius
!
line console 0
line vty 0 4
 transport input ssh

! Server AAA (PT): client R1, IP 10.0.1.1, secret SecretB`} explain={[
            ['radius-server host 10.0.1.200', 'Adresa serverului este greșită (serverul real e 10.0.1.20).'],
            ['key SecretA', 'Diferă de secretul de pe server (SecretB).'],
            ['default group radius', 'Fără „local” în listă: lockout când serverul nu răspunde.'],
            ['line console 0', 'Folosește lista default, nu o listă locală separată.'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Adresă greșită a serverului</b> (10.0.1.200 în loc de 10.0.1.20): cererile nu ajung.</li>
              <li><b>Secret diferit</b> (SecretA vs SecretB): chiar cu adresa corectă, serverul nu poate valida cererile.</li>
              <li><b>Lista fără fallback local</b>: la căderea serverului, lockout total.</li>
              <li><b>Consola pe lista default</b>: și accesul fizic depinde de server.</li>
              <li>Nu există niciun utilizator local de rezervă.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <CodeBlock title="R1 (de pe consolă)" kind="config" code={`R1(config)# username rezerva privilege 15 secret L0cal123
R1(config)# no radius-server host 10.0.1.200
R1(config)# radius-server host 10.0.1.20 key SecretB
R1(config)# aaa authentication login default group radius local
R1(config)# aaa authentication login CONSOLE local
R1(config)# line console 0
R1(config-line)# login authentication CONSOLE`} explain={[
              ['username rezerva …', 'Cont local de rezervă.'],
              ['radius-server host 10.0.1.20 key SecretB', 'Adresa și secretul corecte.'],
              ['default group radius local', 'Server întâi, local la nevoie.'],
              ['login authentication CONSOLE', 'Consola nu mai depinde de server.'],
            ]} />
            <p>Dacă ai pierdut accesul la VTY, intri prin consolă (sau, dacă și consola e blocată, urmezi procedura de recuperare a platformei — de aceea e important să previi).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Testează <code>ana</code> cu serverul pornit, apoi oprește serverul și testează <code>rezerva</code>. Ce arată <code>show aaa servers</code> (dacă e disponibil)?</p>
          <Reveal label="Răspuns">
            <p>Cu serverul pornit, <code>ana</code> intră; cu serverul oprit, <code>rezerva</code> intră prin local. <code>show aaa servers</code> arată starea UP/DEAD și contoarele de cereri/timeouts (dacă platforma/PT o afișează).</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
