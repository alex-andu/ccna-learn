import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.8" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 2.8 este de tip <b>Describe</b>, dar în practică îl vezi pe IOS astfel: securizarea console/vty, activarea SSH, dezactivarea Telnet, HTTPS în loc de HTTP, AAA cu TACACS+ și fallback local, restricționarea sesiunilor cu ACL și verificările lor.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, cu nume, adrese și chei fictive; nu au fost capturate de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Sintaxa (de exemplu <code>tacacs server</code> vs. <code>tacacs-server host</code>), valorile implicite și mesajele variază cu versiunea IOS; verifică cu <code>?</code>. Nu folosi parolele din exemple în rețele reale.
      </Callout>

      <Detailed title="Exemplul 1 — SSH pe un router/switch (pas cu pas)">
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# hostname R1
R1(config)# ip domain-name lab.local
R1(config)# crypto key generate rsa modulus 2048
The name for the keys will be: R1.lab.local
% The key modulus size is 2048 bits
% Generating 2048 bit RSA keys, keys will be non-exportable...
[OK]
R1(config)# ip ssh version 2
R1(config)# username admin1 secret S3cretLab!
R1(config)# enable secret En4bleLab!
R1(config)# line vty 0 15
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# line console 0
R1(config-line)# login local
R1(config-line)# logging synchronous`} explain={[
          ['hostname + ip domain-name', 'Împreună formează numele pentru cheile RSA (R1.lab.local); fără ele generarea cheilor eșuează.'],
          ['crypto key generate rsa modulus 2048', 'Generează perechea de chei folosită de SSH; 2048 biți este alegerea uzuală pentru SSHv2.'],
          ['ip ssh version 2', 'Permite doar SSHv2 (mai sigur decât v1).'],
          ['username … secret …', 'Cont local; „secret” stochează hash, nu parola în clar.'],
          ['enable secret', 'Parola modului privilegiat, stocată ca hash.'],
          ['line vty 0 15', 'Cele 16 linii virtuale pe care intră sesiunile la distanță.'],
          ['transport input ssh', 'Acceptă doar SSH; Telnet este respins.'],
          ['login local', 'Autentificare cu utilizatorii locali (username).'],
          ['exec-timeout 5 0', 'Sesiunea inactivă 5 minute se închide.'],
          ['line console 0 / login local', 'Același tip de autentificare și pe console.'],
        ]} />
        <CodeBlock title="Verificare (ilustrativ)" kind="session" code={`R1# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 120 secs; Authentication retries: 3

R1# show ssh
Connection Version Mode Encryption  Hmac         State              Username
0          2.0     IN   aes128-cbc  hmac-sha1    Session started    admin1
0          2.0     OUT  aes128-cbc  hmac-sha1    Session started    admin1

R1# show users
    Line       User       Host(s)              Idle       Location
*  0 con 0     admin1     idle                 00:00:00
  66 vty 0     admin1     idle                 00:01:12 192.168.1.10`} explain={[
          ['SSH Enabled - version 2.0', 'SSH este pornit și acceptă doar v2.'],
          ['show ssh', 'Sesiunile SSH active: versiune, algoritm, utilizator.'],
          ['show users', 'Cine este conectat: linia (con/vty), utilizatorul și adresa sursă.'],
        ]} />
        <CodeBlock title="Conectare de pe PC (ilustrativ)" kind="session" code={`C:\\> ssh -l admin1 192.168.1.1
Password:
R1>`} explain={[
          ['ssh -l admin1 192.168.1.1', 'Clientul SSH al PC-ului; din Packet Tracer: Desktop → Command Prompt → ssh -l admin1 192.168.1.1.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Dezactivarea Telnet și restricționarea accesului">
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# ip access-list standard MGMT-ONLY
R1(config-std-nacl)# permit 192.168.1.0 0.0.0.255
R1(config-std-nacl)# deny any log
R1(config-std-nacl)# exit
R1(config)# line vty 0 15
R1(config-line)# access-class MGMT-ONLY in
R1(config-line)# transport input ssh
R1(config)# login block-for 120 attempts 3 within 60
R1(config)# banner motd # Acces autorizat doar personalului. Activitatea este monitorizata. #`} explain={[
          ['ip access-list standard MGMT-ONLY', 'Lista permite doar subrețeaua de management (ACL-urile sunt tema domeniului 5).'],
          ['access-class MGMT-ONLY in', 'Aplicat pe liniile vty: doar sursele din ACL pot deschide sesiuni (nu se folosește ip access-group, care e pentru interfețe).'],
          ['transport input ssh', 'Telnet respins.'],
          ['login block-for 120 attempts 3 within 60', 'După 3 eșecuri în 60 s, blochează încercările de login 120 s (protecție la forță brută).'],
          ['banner motd', 'Mesaj legal afișat la conectare.'],
        ]} />
        <p>Dacă un client încearcă Telnet după <code>transport input ssh</code>, conexiunea este refuzată imediat: <code>% Connection refused by remote host</code>.</p>
      </Detailed>

      <Detailed title="Exemplul 3 — HTTPS în loc de HTTP">
        <CodeBlock title="SW1 / R1 (ilustrativ)" kind="config" code={`SW1(config)# no ip http server
SW1(config)# ip http secure-server
SW1(config)# ip http authentication local
SW1(config)# username admin1 privilege 15 secret S3cretLab!
SW1# show ip http server status | include server|port
HTTP server status: Disabled
HTTP secure server status: Enabled
HTTP secure server port: 443`} explain={[
          ['no ip http server', 'Oprește GUI în clar (TCP 80).'],
          ['ip http secure-server', 'Pornește GUI cu TLS (TCP 443); echipamentul își generează un certificat autosemnat.'],
          ['ip http authentication local', 'Autentificarea GUI se face cu utilizatorii locali (altfel enable/AAA).'],
          ['privilege 15', 'Nivelul 15 permite acces complet în GUI.'],
          ['show ip http server status', 'Confirmă: HTTP dezactivat, HTTPS activat pe 443.'],
        ]} />
        <p>Browserul va afișa avertisment de certificat (autosemnat); într-o rețea reală se instalează un certificat de la o autoritate de încredere.</p>
      </Detailed>

      <Detailed title="Exemplul 4 — AAA cu TACACS+ și fallback local">
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# aaa new-model
R1(config)# tacacs server TAC1
R1(config-server-tacacs)# address ipv4 192.168.1.50
R1(config-server-tacacs)# key TacacsLabKey
R1(config-server-tacacs)# exit
R1(config)# aaa authentication login default group tacacs+ local
R1(config)# aaa authorization exec default group tacacs+ local
R1(config)# aaa accounting exec default start-stop group tacacs+
R1(config)# username breakglass secret Em3rgency!
R1(config)# line vty 0 15
R1(config-line)# login authentication default
R1(config-line)# transport input ssh`} explain={[
          ['aaa new-model', 'Activează modelul AAA: de aici autentificarea se face prin liste de metode.'],
          ['tacacs server TAC1 / address / key', 'Definește serverul TACACS+ (TCP 49) și cheia partajată (aceeași pe server).'],
          ['aaa authentication login default group tacacs+ local', 'Mai întâi serverul TACACS+; dacă nu răspunde, contul local (fallback).'],
          ['aaa authorization exec default …', 'Autorizare: nivelul de privilegiu primit de la server.'],
          ['aaa accounting exec default start-stop …', 'Jurnal de sesiuni (început și sfârșit) trimis la server.'],
          ['username breakglass', 'Cont local de urgență, pentru când serverul nu e accesibil.'],
        ]} />
        <CodeBlock title="Variantă RADIUS (ilustrativ)" kind="config" code={`R1(config)# radius server RAD1
R1(config-radius-server)# address ipv4 192.168.1.51 auth-port 1812 acct-port 1813
R1(config-radius-server)# key RadiusLabKey
R1(config-radius-server)# exit
R1(config)# aaa authentication login default group radius local`} explain={[
          ['address ipv4 … auth-port 1812 acct-port 1813', 'RADIUS folosește UDP 1812 (autentificare) și 1813 (contabilizare).'],
          ['group radius local', 'Aceeași idee: serverul întâi, apoi local.'],
        ]} />
        <Callout kind="tip" title="Testarea fără să te blochezi">
          Înainte de a aplica AAA pe vty, deschide o sesiune de rezervă, ține-o deschisă și testează de pe a doua. Dacă greșești lista, nu rămâi în afara echipamentului. Console rămâne utilă ca cale de recuperare.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 5 — Depanare: SSH nu se conectează">
        <Table head={['Simptom', 'Cauză probabilă', 'Remediu']} hlCol={0} rows={[
          ['Conexiune refuzată', 'transport input nu include ssh, sau SSH nu este pornit (fără chei RSA)', 'crypto key generate rsa; transport input ssh'],
          ['„No hostname specified” la generarea cheilor', 'Hostname implicit sau lipsă domain-name', 'hostname + ip domain-name'],
          ['Autentificare eșuată pe vty cu login local', 'Utilizator lipsă sau parolă greșită', 'username … secret …; login local'],
          ['Timeout la conectare', 'Fără rută/IP, ACL pe vty, firewall pe TCP 22', 'ping, show access-lists, access-class'],
          ['Cu AAA: nu intri nici cu contul local', 'Lista de metode fără fallback local și server inaccesibil', 'Console: adaugă „local” în lista de metode'],
        ]} />
      </Detailed>
    </section>
  );
}
