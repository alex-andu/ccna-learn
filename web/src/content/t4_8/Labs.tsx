import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology48, LabSoloTopology48 } from '../../diagrams/t4_8';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't48g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.8-G" title="Lab ghidat — SSH pe router și switch, Telnet dezactivat" />
      <Summary>
        <p><b>Obiectiv:</b> activezi SSH v2 pe R1 și SW2, restricționezi accesul VTY și verifici de pe PC-ul de administrare că Telnet nu mai funcționează, iar SSH da. <br /><b>Timp estimat:</b> 40–60 min · <b>Unealtă:</b> Cisco Packet Tracer (1 router, 2 switch-uri, 1 PC) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC admin – SW1 – R1 – SW2.">
        <LabGuidedTopology48 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['PC admin', 'NIC', '192.168.1.10/24, gateway 192.168.1.1'],
        ['R1', 'Gi0/0 (spre SW1)', '192.168.1.1/24'],
        ['R1', 'Gi0/1 (spre SW2)', '192.168.2.1/24'],
        ['SW2', 'VLAN 1 (SVI)', '192.168.2.2/24, gateway 192.168.2.1'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer suportă SSH pe routere și switch-uri (clientul din Command Prompt: <code>ssh -l admin 192.168.1.1</code>), dar versiunea SSH, <code>crypto key generate rsa modulus</code> și unele opțiuni pot diferi. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta. Același lab merge în GNS3/CML cu IOSv și un client OpenSSH real.
      </Callout>

      <Detailed title="Partea 0 — Conectivitate și Telnet">
        <Step labKey={L} n={1} title="Adresare">
          <p>Configurează interfețele din tabel; pe SW2 SVI-ul VLAN 1 + <code>ip default-gateway</code>. Ping PC → R1 → SW2.</p>
        </Step>
        <Step labKey={L} n={2} title="Telnet (varianta nesigură)">
          <p>Pe R1: <code>line vty 0 4</code>, <code>password cisco</code>, <code>login</code>, <code>transport input telnet</code>. De pe PC: <code>telnet 192.168.1.1</code>. Funcționează? Ce risc are?</p>
          <Reveal label="Răspuns">
            <p>Da, funcționează; parola circulă în text clar. În Simulation Mode poți deschide pachetul TCP 23 și vezi datele necriptate.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — SSH pe router">
        <Step labKey={L} n={3} title="Pregătirea cheilor">
          <CodeBlock title="R1" kind="config" code={`Router(config)# hostname R1
R1(config)# ip domain-name example.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2`} explain={[
            ['hostname R1', 'Nume diferit de „Router”.'],
            ['ip domain-name example.local', 'Domeniul pentru numele cheii.'],
            ['crypto key generate rsa modulus 2048', 'Generează cheile și pornește SSH.'],
          ]} />
          <p>Ce arată <code>show ip ssh</code>? Ce ai fi văzut dacă ai fi sărit peste <code>ip domain-name</code>?</p>
          <Reveal label="Răspuns">
            <p>„SSH Enabled - version 2.0”. Fără <code>ip domain-name</code>, comanda de generare a cheii este refuzată (cere un domain-name), iar SSH rămâne dezactivat.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Utilizator și VTY">
          <CodeBlock title="R1" kind="config" code={`R1(config)# username admin privilege 15 secret Str0ngPass!
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh`} explain={[
            ['username admin … secret …', 'Utilizator local.'],
            ['login local', 'Autentificare cu baza locală.'],
            ['transport input ssh', 'Doar SSH.'],
          ]} />
          <p>De pe PC: <code>telnet 192.168.1.1</code> și <code>ssh -l admin 192.168.1.1</code>. Ce rezultat are fiecare?</p>
          <Reveal label="Răspuns">
            <p>Telnet este refuzat (conexiune închisă/refuzată), SSH cere parola și intră în EXEC. Ai înlocuit accesul nesigur cu cel criptat.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Restricție de sursă">
          <CodeBlock title="R1" kind="config" code={`R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)# line vty 0 4
R1(config-line)# access-class 10 in`} explain={[
            ['access-list 10 permit 192.168.1.0 0.0.0.255', 'Doar LAN-ul de administrare.'],
            ['access-class 10 in', 'Aplică ACL-ul pe sesiunile VTY primite.'],
          ]} />
          <p>Ce se întâmplă dacă încerci SSH de pe un host din 192.168.2.0/24? Ce comandă confirmă ACL-ul?</p>
          <Reveal label="Răspuns">
            <p>Conexiunea este refuzată: sursa nu este permisă de ACL. <code>show running-config | section line vty</code> arată <code>access-class 10 in</code>; <code>show access-lists</code> arată contoarele de potrivire.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — SSH pe switch">
        <Step labKey={L} n={6} title="SW2">
          <p>Repetă pașii 3–4 pe SW2 (hostname SW2, domeniu, chei, v2, utilizator, VTY). Din PC: <code>ssh -l admin 192.168.2.2</code>. Ce condiții de rețea trebuie să fie îndeplinite?</p>
          <Reveal label="Răspuns">
            <p>SVI-ul VLAN 1 up/up cu adresă, <code>ip default-gateway 192.168.2.1</code> (ca să răspundă în afara subrețelei) și rută de la PC la 192.168.2.0/24 (R1 le conectează). Dacă ACL-ul 10 se aplică și pe SW2, adaugă rețeaua clientului.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce nu e suficient <code>transport input ssh</code>? (2) Ce rol are cheia RSA? (3) De ce <code>access-class</code>, nu <code>access-group</code>?</p>
          <Reveal label="Indicii">
            <p>(1) Fără chei, serverul SSH nu rulează. (2) Autentifică serverul și ajută la schimbul de chei. (3) <code>access-group</code> filtrează traficul pe interfețe; <code>access-class</code> filtrează sesiunile către VTY.</p>
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
  const L = 't48s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.8-S" title="Lab solo — SSH refuzat" />
      <Summary>
        <p><b>Scenariu:</b> R1 are, chipurile, SSH configurat, dar <code>ssh -l admin 192.168.1.1</code> de pe PC este refuzat, deși ping-ul merge. Găsește defectul (sau defectele) cu <code>show</code>.
          <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: PC admin, SW1, R1.">
        <LabSoloTopology48 />
      </Figure>
      <Table head={['Dispozitiv', 'IPv4']} rows={[
        ['PC admin', '192.168.1.10/24'],
        ['R1 Gi0/0', '192.168.1.1/24'],
      ]} />
      <Callout kind="info" title="Cerințe">
        SSHv2 cu cheie RSA 2048, utilizator local admin, VTY cu <code>login local</code> și <code>transport input ssh</code>. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Configurare corectă">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`Router(config)# hostname R1
R1(config)# ip domain-name example.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# username admin privilege 15 secret Str0ngPass!
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh`} explain={[
              ['crypto key generate rsa modulus 2048', 'Fără chei, SSH nu pornește.'],
              ['login local + transport input ssh', 'VTY acceptă doar SSH cu utilizatori locali.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Primul defect">
          <p><code>show ip ssh</code> afișează „SSH Disabled - version 1.99”. Ce înseamnă și care e cauza probabilă? Cum o rezolvi?</p>
          <Reveal label="Cauza și remedierea">
            <p>Serverul SSH nu este activ: nu există chei RSA (sau a lipsit hostname/domain-name la generare). Remediere: <code>hostname R1</code>, <code>ip domain-name example.local</code>, <code>crypto key generate rsa modulus 2048</code>; apoi <code>show ip ssh</code> trebuie să arate „SSH Enabled”.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Al doilea defect">
          <p>După remediere, conexiunea tot e refuzată. <code>show running-config | section line vty</code> arată <code>transport input telnet</code>. Ce se întâmplă? Remedierea?</p>
          <Reveal label="Cauza și remedierea">
            <p>Liniile VTY acceptă doar Telnet, deci SSH este respins. Remediere: <code>line vty 0 4</code> → <code>transport input ssh</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Al treilea defect">
          <p>Acum primești „Password required, but none set” după conexiune. Ce lipsește?</p>
          <Reveal label="Cauza și remedierea">
            <p>Pe VTY este <code>login</code> (parolă de linie, necunoscută), nu <code>login local</code>. Remediere: <code>line vty 0 4</code> → <code>login local</code> și verifică existența <code>username admin secret …</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Test final">
          <p>Conectează-te cu SSH de pe PC. Ce comenzi demonstrează starea corectă?</p>
          <Reveal label="Răspuns">
            <p><code>show ip ssh</code> (Enabled, v2), <code>show ssh</code> (sesiune pornită), <code>show running-config | section line vty</code> (login local, transport input ssh).</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
