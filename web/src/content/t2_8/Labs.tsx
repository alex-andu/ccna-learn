import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology28, LabSoloTopology28 } from '../../diagrams/t2_8';

/* ======================================================================
   LAB GHIDAT — SSH, HTTPS, AAA
   ====================================================================== */
export function GuidedLab() {
  const L = 't28g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 2.8-G" title="Lab ghidat — SSH în loc de Telnet, HTTPS, AAA cu fallback local" />
      <Summary>
        <p><b>Obiectiv:</b> pornești de la un router accesibil prin <G id="telnet" />, observi că parola circulă în clar, treci la <G id="ssh" />, restricționezi accesul, dezactivezi HTTP și configurezi <G id="aaa" /> cu server <G id="tacacs-plus" /> (sau <G id="radius" />) și fallback local.
          <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (router 2911, switch 2960, PC, server cu AAA) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: PC admin, SW1, R1 și serverul AAA în 192.168.1.0/24.">
        <LabGuidedTopology28 />
      </Figure>
      <Table head={['Dispozitiv', 'Adresă', 'Rol']} rows={[
        ['R1', '192.168.1.1 /24', 'echipamentul administrat'],
        ['SW1', '192.168.1.2 /24 (SVI)', 'comutare'],
        ['PC admin', '192.168.1.10 /24', 'client SSH/Telnet'],
        ['Server AAA', '192.168.1.50 /24', 'TACACS+/RADIUS (Packet Tracer: Services → AAA)'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer suportă Telnet, SSH (v1/v2 în funcție de imagine), HTTP/HTTPS pe unele echipamente și un serviciu AAA (RADIUS/TACACS+) pe server; TACACS+ poate lipsi sau diferi. În Wireshark-ul real poți vedea parola Telnet în clar; în Packet Tracer folosește modul <i>Simulation</i> și inspectează PDU-urile. Comenzile nu au fost testate de autorul lecției în versiunea ta.
      </Callout>

      <Detailed title="Partea 1 — Telnet (și de ce e rău)">
        <Step labKey={L} n={1} title="Configurare de bază">
          <CodeBlock title="R1" kind="config" code={`Router(config)# hostname R1
R1(config)# interface gi0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config)# enable secret En4bleLab!
R1(config)# line vty 0 4
R1(config-line)# password TelnetLab
R1(config-line)# login
R1(config-line)# transport input telnet`} explain={[
            ['transport input telnet', 'Doar Telnet, pentru a vedea problema.'],
            ['password + login', 'Parolă simplă pe vty (fără utilizator).'],
          ]} />
        </Step>
        <Step labKey={L} n={2} title="Conectează-te și observă">
          <p>De pe PC: <code>telnet 192.168.1.1</code>. În Packet Tracer pornește <b>Simulation Mode</b>, filtrează pe „TELNET” și deschide un PDU: ce vezi în conținutul pachetului?</p>
          <Reveal label="Răspuns"><p>Caracterele parolei apar în clar în datele TCP (port 23). Oricine capturează traficul o poate citi.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — SSH">
        <Step labKey={L} n={3} title="Pregătirea SSH">
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip domain-name lab.local
R1(config)# crypto key generate rsa modulus 1024
R1(config)# ip ssh version 2
R1(config)# username admin1 secret S3cretLab!
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh`} explain={[
            ['modulus 1024', 'În Packet Tracer 1024 e suficient pentru laborator; în producție se preferă 2048.'],
            ['transport input ssh', 'Telnet respins; SSH acceptat.'],
          ]} />
        </Step>
        <Step labKey={L} n={4} title="Testează SSH și respingerea Telnet">
          <p>De pe PC: <code>ssh -l admin1 192.168.1.1</code> (funcționează) și <code>telnet 192.168.1.1</code> (respins). Verifică <code>show ip ssh</code> și <code>show users</code> pe R1.</p>
          <Reveal label="Ce observi în Simulation Mode?"><p>Conținutul pachetelor SSH nu mai conține parola în clar.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Restricționează accesul">
          <CodeBlock title="R1" kind="config" code={`R1(config)# ip access-list standard MGMT-ONLY
R1(config-std-nacl)# permit host 192.168.1.10
R1(config-std-nacl)# exit
R1(config)# line vty 0 4
R1(config-line)# access-class MGMT-ONLY in`} explain={[
            ['permit host 192.168.1.10', 'Doar PC-ul admin poate deschide sesiuni.'],
            ['access-class … in', 'Aplică ACL-ul pe linii (nu pe interfețe).'],
          ]} />
          <Reveal label="Test"><p>Încearcă SSH de la alt host (de exemplu serverul): conexiunea ar trebui respinsă.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — HTTPS și AAA">
        <Step labKey={L} n={6} title="HTTP → HTTPS">
          <CodeBlock title="R1" kind="config" code={`R1(config)# no ip http server
R1(config)# ip http secure-server
R1# show ip http server status`} explain={[
            ['no ip http server / secure-server', 'GUI doar pe 443. În Packet Tracer suportul HTTPS pe router poate lipsi; observă comanda și starea unde e disponibil.'],
          ]} />
        </Step>
        <Step labKey={L} n={7} title="AAA cu server și fallback local">
          <p>Pe server activează serviciul AAA (Services → AAA), adaugă clientul R1 (192.168.1.1, cheia „RadiusLabKey”) și un utilizator „admin2”. Pe R1:</p>
          <CodeBlock title="R1" kind="config" code={`R1(config)# aaa new-model
R1(config)# radius server RAD1
R1(config-radius-server)# address ipv4 192.168.1.50 auth-port 1645 acct-port 1646
R1(config-radius-server)# key RadiusLabKey
R1(config-radius-server)# exit
R1(config)# aaa authentication login default group radius local
R1(config)# line vty 0 4
R1(config-line)# login authentication default`} explain={[
            ['auth-port 1645 acct-port 1646', 'Packet Tracer folosește adesea porturile istorice 1645/1646; pe echipamente moderne standardul este 1812/1813.'],
            ['group radius local', 'Serverul mai întâi; dacă nu răspunde, utilizatorul local (admin1).'],
          ]} />
          <Reveal label="Întrebare: de ce e esențial „local”?"><p>Dacă serverul AAA nu e accesibil și lista n-are fallback, nu mai poți intra pe echipament prin vty. Cu „local” poți folosi contul de urgență. (Testează: oprește serverul și autentifică-te cu admin1.)</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Console: ultima linie de apărare">
          <Reveal label="Întrebare"><p>Dacă ai blocat accidental accesul vty, ce cale rămâne?</p></Reveal>
          <Reveal label="Răspuns"><p>Console (out-of-band), cu cablu direct. De aceea se protejează fizic și se păstrează un cont de recuperare.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't28s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 2.8-S" title="Lab solo — securizează accesul de management la un router" />
      <Summary>
        <p><b>Cerință:</b> R-Edge trebuie să accepte administrare doar prin SSHv2 de la 10.0.0.0/24, GUI doar HTTPS, autentificare TACACS+ cu fallback local, timeout de sesiune 5 minute, blocare după 3 încercări eșuate. Scrie configurația fără să te uiți, apoi verifică.
          <br /><b>Timp estimat:</b> 30 min · <b>Unealtă:</b> Packet Tracer sau GNS3/CML · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Admin → R-Edge → server TACACS+.">
        <LabSoloTopology28 />
      </Figure>
      <Detailed title="Cerințe și soluție">
        <ol>
          <li>Hostname, domain-name, chei RSA 2048, SSH v2.</li>
          <li>Utilizator local de urgență și <code>enable secret</code>.</li>
          <li>vty 0 15: doar SSH, ACL pentru 10.0.0.0/24, timeout 5 minute.</li>
          <li>HTTP dezactivat, HTTPS activ.</li>
          <li>AAA: TACACS+ pe 10.0.0.50 cu fallback local.</li>
          <li><code>login block-for 120 attempts 3 within 60</code>.</li>
        </ol>
        <Step labKey={L} n={1} title="Scrie și verifică">
          <Reveal label="Soluție (ilustrativ)">
            <CodeBlock title="R-Edge" kind="config" code={`hostname R-Edge
ip domain-name lab.local
crypto key generate rsa modulus 2048
ip ssh version 2
username breakglass secret Em3rgency!
enable secret En4bleLab!
ip access-list standard MGMT
 permit 10.0.0.0 0.0.0.255
no ip http server
ip http secure-server
aaa new-model
tacacs server TAC1
 address ipv4 10.0.0.50
 key TacacsLabKey
aaa authentication login default group tacacs+ local
login block-for 120 attempts 3 within 60
line vty 0 15
 transport input ssh
 access-class MGMT in
 exec-timeout 5 0
 login authentication default`} explain={[
              ['rsa + ssh version 2', 'SSH securizat.'],
              ['MGMT ACL + access-class', 'Doar rețeaua de management.'],
              ['aaa … group tacacs+ local', 'TACACS+ cu fallback local.'],
              ['login block-for', 'Protecție la forță brută.'],
            ]} />
          </Reveal>
          <Reveal label="Verificare"><p><code>show ip ssh</code>, <code>show ip http server status</code>, <code>show aaa servers</code> (unde e disponibil), test de la un host din afara 10.0.0.0/24 (respins) și test cu serverul oprit (intră cu breakglass).</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
