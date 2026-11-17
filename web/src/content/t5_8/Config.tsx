import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.8" title="Exemple de configurare și verificare: AAA cu TACACS+/RADIUS și fallback local" />
      <Summary>
        <p>Obiectivul 5.8 este de tip <b>Compare</b>; configurarea este <b>ilustrativă</b>, ca să vezi cum se transpun cele trei funcții în comenzi: server, listă de autentificare, autorizare, accounting și 802.1X pe un switch.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Output-urile sunt <b>exemple ilustrative</b>, nu capturi reale. Sintaxa <code>tacacs server</code> / <code>radius server</code> (submod) există în IOS 15.x/IOS XE; versiunile vechi folosesc <code>tacacs-server host …</code> / <code>radius-server host …</code>. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente reale. Packet Tracer suportă AAA pe servere (serviciul AAA) și comenzi AAA de bază pe routere, dar nu toate variantele (autorizare pe comandă, 802.1X complet) — vezi limitele din laburi.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Element', 'Adresă', 'Rol']} rows={[
          ['R1', '10.0.0.1/24', 'NAS (router administrat)'],
          ['Server AAA', '10.0.0.20', 'TACACS+ (TCP 49) și RADIUS (UDP 1812/1813)'],
          ['PC-Admin', '10.0.0.100', 'Se conectează prin SSH la R1'],
          ['Cont de rezervă', 'local', 'username admin secret …'],
        ]} />
      </Detailed>

      <Detailed title="2. Pașii în ordinea prudentă">
        <CodeBlock title="R1 — AAA cu TACACS+ și fallback local (ilustrativ)" kind="config" code={`R1(config)# username admin privilege 15 algorithm-type scrypt secret L0calBackup!
R1(config)# aaa new-model
R1(config)# tacacs server TAC1
R1(config-server-tacacs)# address ipv4 10.0.0.20
R1(config-server-tacacs)# key SharedSecret1
R1(config-server-tacacs)# exit
R1(config)# aaa authentication login default group tacacs+ local
R1(config)# aaa authentication login CONSOLE local
R1(config)# aaa authorization exec default group tacacs+ local
R1(config)# aaa accounting exec default start-stop group tacacs+
R1(config)# aaa accounting commands 15 default start-stop group tacacs+
R1(config)# line console 0
R1(config-line)# login authentication CONSOLE
R1(config-line)# exit
R1(config)# line vty 0 15
R1(config-line)# transport input ssh`} explain={[
          ['username admin … secret …', 'Cont local de rezervă, creat ÎNAINTE de a activa AAA.'],
          ['aaa new-model', 'Activează modelul AAA; de acum liniile folosesc listele de metode.'],
          ['tacacs server TAC1 / address / key', 'Definește serverul TACACS+ și secretul partajat (trebuie să coincidă cu al serverului).'],
          ['aaa authentication login default group tacacs+ local', 'Autentificare: serverul întâi, apoi baza locală dacă serverul nu răspunde.'],
          ['aaa authentication login CONSOLE local', 'Listă separată pentru consolă: doar local, ca să poți intra oricând fizic.'],
          ['aaa authorization exec default group tacacs+ local', 'Autorizare: serverul stabilește dacă utilizatorul primește shell și ce privilegiu are.'],
          ['aaa accounting exec default start-stop group tacacs+', 'Contabilizare: START la login, STOP la deconectare.'],
          ['aaa accounting commands 15 default start-stop …', 'Înregistrează comenzile de nivel 15 (de configurare).'],
          ['login authentication CONSOLE', 'Aplică lista cu nume pe linie; lista default se aplică automat pe VTY.'],
        ]} />
        <Callout kind="tip" title="Alternativa RADIUS">
          <code>radius server RAD1</code> → <code>address ipv4 10.0.0.20 auth-port 1812 acct-port 1813</code> → <code>key SharedSecret1</code>; în liste folosești <code>group radius</code>. Se folosește mai ales pentru acces la rețea (VPN, 802.1X), TACACS+ pentru administrare.
        </Callout>
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="R1 — verificare AAA (ilustrativ)" kind="session" code={`R1# show aaa servers
TACACS+: id 1, priority 1, host 10.0.0.20, port 49, state UP
         Authen: request 12, timeouts 0
         Author: request 12, timeouts 0
         Account: request 24, timeouts 0

R1# test aaa group tacacs+ ana Parola123 legacy
Attempting authentication test to server-group tacacs+ using tacacs+
User was successfully authenticated.

R1# show running-config | section aaa
aaa new-model
aaa authentication login default group tacacs+ local
aaa authentication login CONSOLE local
aaa authorization exec default group tacacs+ local
aaa accounting exec default start-stop group tacacs+`} explain={[
          ['state UP', 'Serverul răspunde; „DEAD” înseamnă inaccesibil (sau secret greșit).'],
          ['Authen/Author/Account: request/timeouts', 'Contoare pe cele trei funcții; timeouts crescute indică probleme de conectivitate.'],
          ['test aaa group tacacs+ …', 'Testează autentificarea fără să deschizi o sesiune; folosește un cont de test.'],
        ]} />
        <Reveal label="Cum depanezi când nu merge">
          <ol>
            <li><b>Conectivitate</b>: ping 10.0.0.20 de pe R1. Fără rută, serverul nu răspunde → fallback local.</li>
            <li><b>Secret</b>: <code>key</code> diferit pe server → „state DEAD”/timeouts, autentificare eșuată pentru toți.</li>
            <li><b>Client definit pe server</b>: serverul trebuie să aibă R1 (IP + secret) în lista clienților AAA.</li>
            <li><b>Lista aplicată</b>: <code>show running-config | section line</code> — linia folosește lista corectă?</li>
            <li><b>Depanare activă</b> (cu grijă în producție): <code>debug aaa authentication</code>.</li>
          </ol>
        </Reveal>
      </Detailed>

      <Detailed title="4. 802.1X pe un switch (ilustrativ)">
        <CodeBlock title="SW1 — port 802.1X (IOS clasic, ilustrativ)" kind="config" code={`SW1(config)# aaa new-model
SW1(config)# radius server ISE1
SW1(config-radius-server)# address ipv4 10.0.0.20 auth-port 1812 acct-port 1813
SW1(config-radius-server)# key SharedSecret1
SW1(config-radius-server)# exit
SW1(config)# aaa authentication dot1x default group radius
SW1(config)# dot1x system-auth-control
SW1(config)# interface fastEthernet 0/5
SW1(config-if)# switchport mode access
SW1(config-if)# authentication port-control auto
SW1(config-if)# dot1x pae authenticator`} explain={[
          ['aaa authentication dot1x default group radius', 'Autentificarea 802.1X se face prin RADIUS.'],
          ['dot1x system-auth-control', 'Activează 802.1X global pe switch.'],
          ['authentication port-control auto', 'Portul pornește neautorizat și se deschide după autentificare reușită.'],
          ['dot1x pae authenticator', 'Switch-ul joacă rolul de authenticator (pe unele platforme comanda e implicită).'],
        ]} />
        <p>Verificare: <code>show dot1x all</code>, <code>show authentication sessions</code> (sintaxa diferă între platforme). Configurarea 802.1X nu este cerută în detaliu la CCNA; contează rolurile și fluxul.</p>
      </Detailed>
      <Traps items={[
        <>Nu activa AAA fără utilizator local și fără <code>local</code> în listă: risc de lockout.</>,
        <>Secretul trebuie să fie <b>identic</b> pe router și pe server; altfel serverul pare „mut”.</>,
        <>Un server care <b>refuză</b> credențialele nu declanșează fallback-ul local.</>,
      ]} />
      <InlineQuiz ids={['5.8-036', '5.8-037', '5.8-038', '5.8-039', '5.8-040']} />
    </section>
  );
}
