import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="6.2" title="Exemple: aceeași politică în modelul tradițional și prin controller" />
      <Summary>
        <p>Scenariul: pe trei switch-uri de acces trebuie să apară VLAN 50 („IoT”), serverul NTP 10.0.0.5 și serverul syslog 10.0.0.6. Vezi mai întâi <b>modelul tradițional</b> (aceleași comenzi, de trei ori), apoi cum arată <b>aceeași intenție</b> exprimată către un controller prin API, și cum verifici în ambele cazuri.</p>
      </Summary>
      <Callout kind="warn" title="Exemple ilustrative, netestate">
        Comenzile IOS, apelurile API și răspunsurile JSON sunt <b>ilustrative</b> și <b>nu au fost testate</b> de autorul lecției pe echipamente sau pe un Catalyst Center real. Căile exacte (URL-uri, câmpuri) depind de versiune: consultă documentația API a versiunii tale (Cisco DevNet). Packet Tracer nu are Catalyst Center.
      </Callout>

      <Detailed title="1. Modelul tradițional — aceleași comenzi pe fiecare echipament">
        <CodeBlock title="SW1, SW2, SW3 — se repetă pe fiecare (ilustrativ)" kind="config" code={`SW1(config)# vlan 50
SW1(config-vlan)# name IoT
SW1(config-vlan)# exit
SW1(config)# ntp server 10.0.0.5
SW1(config)# logging host 10.0.0.6
SW1(config)# logging trap informational
SW1(config)# end
SW1# copy running-config startup-config`} explain={[
          ['vlan 50 / name IoT', 'Creează VLAN-ul în baza de date VLAN și îi dă un nume (2.1).'],
          ['ntp server 10.0.0.5', 'Sincronizează ceasul cu serverul NTP (4.2).'],
          ['logging host … / logging trap informational', 'Trimite mesajele syslog către server, de la severitatea informational în sus (4.5).'],
          ['copy running-config startup-config', 'Salvează configurația; altfel dispare la reload.'],
        ]} />
        <p>Total pentru trei switch-uri: <b>3 sesiuni</b>, ≈ 3 × 8 comenzi, 3 verificări manuale. Dacă un switch era în reload, el rămâne configurat altfel (drift) și nu afli decât dacă îl verifici.</p>
      </Detailed>

      <Detailed title="2. Modelul cu controller — intenția exprimată prin API (ilustrativ)">
        <p>Controller-ul expune API-uri REST (6.5). Mai întâi obții un <b>token</b> de autentificare, apoi îl folosești în cereri. Exemplu simplificat, în stilul unui controller de campus:</p>
        <CodeBlock title="Autentificare și interogarea inventarului (ilustrativ)" kind="session" code={`# 1) obții un token (Basic Auth o singură dată)
$ curl -k -X POST https://controller.lab/dna/system/api/v1/auth/token \\
       -u "api-user:••••••••"
{"Token": "eyJhbGciOi..."}

# 2) folosești tokenul în cererile următoare
$ curl -k https://controller.lab/dna/intent/api/v1/network-device \\
       -H "X-Auth-Token: eyJhbGciOi..." -H "Accept: application/json"
{"response": [
  {"hostname": "SW1", "managementIpAddress": "10.0.99.1", "reachabilityStatus": "Reachable"},
  {"hostname": "SW2", "managementIpAddress": "10.0.99.2", "reachabilityStatus": "Reachable"},
  {"hostname": "SW3", "managementIpAddress": "10.0.99.3", "reachabilityStatus": "Unreachable"}
]}`} explain={[
          ['POST …/auth/token -u user:parolă', 'Cere un token; credențialele se trimit doar acum (HTTP Basic peste HTTPS). Detalii la 6.5.'],
          ['-H "X-Auth-Token: …"', 'Tokenul însoțește fiecare cerere următoare (antet HTTP).'],
          ['GET …/network-device', 'Citește inventarul controller-ului: o singură cerere pentru toate echipamentele, cu stare de accesibilitate.'],
          ['"reachabilityStatus": "Unreachable"', 'Controller-ul vede imediat că SW3 nu e accesibil — vizibilitate centrală.'],
        ]} />
        <CodeBlock title="Intenția exprimată ca date (ilustrativ, pseudo-politică)" kind="config" code={`{
  "site": "Campus-Nord/Etaj-2",
  "vlan": { "id": 50, "name": "IoT" },
  "ntpServers": ["10.0.0.5"],
  "syslogServers": ["10.0.0.6"],
  "applyTo": ["SW1", "SW2", "SW3"]
}`} explain={[
          ['"site"', 'Politica se leagă de un loc în ierarhia de site-uri (Design).'],
          ['"vlan" / "ntpServers" / "syslogServers"', 'Descrii ce vrei, nu comenzile IOS; controller-ul le generează per platformă.'],
          ['"applyTo"', 'Echipamentele vizate; controller-ul tratează apoi cazurile particulare (de exemplu un switch inaccesibil, reîncercat).'],
        ]} />
        <Reveal label="Care este diferența esențială față de comenzile CLI?">
          <p>Nu mai scrii <i>pașii</i> pentru fiecare platformă, ci descrii <i>rezultatul dorit</i>. Controller-ul știe cum se spune asta pe fiecare model de switch, aplică, verifică și arată conformitatea. Exactul format JSON depinde de produs; ideea este aceeași.</p>
        </Reveal>
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="Verificare pe echipament (tradițional, ilustrativ)" kind="session" code={`SW2# show vlan brief | include 50
50   IoT                              active
SW2# show running-config | include ^ntp|^logging
ntp server 10.0.0.5
logging host 10.0.0.6
SW2# show ntp status
Clock is synchronized, stratum 3, reference is 10.0.0.5`} explain={[
          ['show vlan brief | include 50', 'Confirmă că VLAN 50 există și are numele așteptat.'],
          ['show running-config | include …', 'Confirmă că liniile NTP/logging sunt în configurație.'],
          ['show ntp status', 'Confirmă rezultatul funcțional (ceas sincronizat).'],
        ]} />
        <Table head={['Model', 'Cum verifici']} hlCol={0} rows={[
          ['Tradițional', 'show pe fiecare echipament (sau script care le adună)'],
          ['Controller', 'Raport de conformitate/assurance + GET pe API; show doar la depanare'],
        ]} />
      </Detailed>

      <Detailed title="4. Pregătirea unui echipament clasic ca să poată fi administrat de un controller">
        <CodeBlock title="Accesul minim pentru descoperire (ilustrativ)" kind="config" code={`ip domain-name lab.local
crypto key generate rsa modulus 2048
ip ssh version 2
username netadmin privilege 15 secret ParolaLunga-2026
snmp-server community CitesteDoar RO
line vty 0 15
 login local
 transport input ssh`} explain={[
          ['ip domain-name / crypto key generate rsa / ip ssh version 2', 'Controller-ul se conectează prin SSH (CLI) pentru a citi și configura (4.8).'],
          ['username … privilege 15 secret …', 'Credențiale pe care controller-ul le folosește la descoperire.'],
          ['snmp-server community … RO', 'Acces SNMP de citire pentru inventar și monitorizare (4.4); SNMPv3 este preferabil.'],
          ['line vty / login local / transport input ssh', 'Accesul la VTY doar prin SSH și cu utilizatori locali.'],
        ]} />
        <p>Observă: chiar și într-un model „controller-based”, <b>echipamentele clasice au nevoie de acces de management</b>; controller-ul folosește aceleași interfețe southbound (SSH, SNMP, NETCONF).</p>
      </Detailed>
      <Traps items={[
        <>Controller-ul nu elimină protocoalele de management; le folosește southbound.</>,
        <>În tradițional verifici fiecare echipament; în controller vezi conformitatea centralizat — dar CLI rămâne util la depanare.</>,
        <>Exemplele API sunt specifice versiunii: nu memora URL-uri, memorează <b>principiul</b> (token → cereri REST → JSON).</>,
      ]} />
      <InlineQuiz ids={['6.2-020', '6.2-021', '6.2-030', '6.2-033']} />
    </section>
  );
}
