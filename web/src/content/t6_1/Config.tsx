import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="6.1" title="Exemple: pregătirea pentru automatizare și un flux minimal (inventar → șablon → verificare)" />
      <Summary>
        <p>La 6.1 nu configurezi „automatizarea” cu o comandă. Pregătești echipamentul să fie administrat de la distanță (SSH, utilizator dedicat, opțional NETCONF/RESTCONF), apoi arăți cum o intenție (inventar + șablon) devine configurație și cum o verifici.</p>
      </Summary>
      <Callout kind="warn" title="Exemple ilustrative, netestate">
        Comenzile IOS/IOS XE, scriptul Python și fișierele YAML/șablon de mai jos sunt <b>ilustrative</b> și <b>nu au fost testate</b> de autorul lecției pe echipamente reale; sintaxa depinde de versiune și de platformă (<code>netconf-yang</code>/<code>restconf</code> nu există în Packet Tracer). Output-urile sunt exemple construite. Verifică în documentația versiunii tale.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Element', 'Valoare']} rows={[
          ['Obiectiv', 'Aceeași configurație „standard de management” (NTP, syslog, banner, SSH) pe 4 switch-uri'],
          ['Stație de automatizare', 'Admin PC, 192.168.99.10'],
          ['Echipamente', 'SW1–SW4, 192.168.99.1–4 (VLAN 99)'],
          ['Sursa de adevăr', 'inventory.yml (echipamente + variabile)'],
          ['Șablon', 'mgmt-standard.j2 (variabile între acolade duble)'],
        ]} />
      </Detailed>

      <Detailed title="2. Pregătirea echipamentului (o singură dată)">
        <CodeBlock title="IOS / IOS XE — acces pentru automatizare (ilustrativ)" kind="config" code={`hostname SW1
ip domain-name lab.local
crypto key generate rsa modulus 2048
ip ssh version 2
username automation privilege 15 secret ParolaLungaUnica-2026
line vty 0 15
 login local
 transport input ssh
!
! Opțional, doar pe platforme care le suportă (IOS XE):
netconf-yang
restconf
ip http secure-server`} explain={[
          ['hostname / ip domain-name / crypto key generate rsa', 'SSH are nevoie de nume și domeniu ca să genereze cheia RSA (vezi 4.8).'],
          ['ip ssh version 2', 'Forțează SSH versiunea 2 — Telnet nu trebuie folosit pentru automatizare.'],
          ['username automation privilege 15 secret …', 'Cont dedicat automatizării, cu privilegii; secretul e stocat ca hash. În producție: credențiale unice, rotite, cu AAA (5.8).'],
          ['line vty 0 15 / login local / transport input ssh', 'Liniile VTY acceptă doar SSH și folosesc baza de utilizatori locală.'],
          ['netconf-yang', 'IOS XE: activează interfața NETCONF (SSH, TCP 830) — vezi 6.3.'],
          ['restconf / ip http secure-server', 'IOS XE: activează RESTCONF peste HTTPS — vezi 6.3 și 6.5.'],
        ]} />
        <Callout kind="tip" title="Un utilizator dedicat">
          Folosește un cont separat pentru automatizare (nu contul unui om): îl poți urmări în log-uri, îi poți limita privilegiile și îl poți roti fără să afectezi oameni.
        </Callout>
      </Detailed>

      <Detailed title="3. Sursa de adevăr și șablonul (ilustrativ)">
        <CodeBlock title="inventory.yml" kind="config" code={`all:
  vars:
    ntp_server: 192.168.99.100
    syslog_server: 192.168.99.101
    banner: "Acces autorizat. Activitatea este monitorizata."
  hosts:
    SW1: { mgmt_ip: 192.168.99.1 }
    SW2: { mgmt_ip: 192.168.99.2 }
    SW3: { mgmt_ip: 192.168.99.3 }
    SW4: { mgmt_ip: 192.168.99.4 }`} explain={[
          ['all: vars:', 'Variabile comune tuturor echipamentelor (valorile „standard”).'],
          ['hosts:', 'Lista echipamentelor și valorile specifice fiecăruia (aici doar IP-ul de management).'],
          ['{ mgmt_ip: … }', 'YAML în stil „flow”; același lucru se poate scrie pe mai multe rânduri cu indentare.'],
        ]} />
        <CodeBlock title="mgmt-standard.j2 (șablon Jinja2)" kind="config" code={`hostname {{ inventory_hostname }}
ntp server {{ ntp_server }}
logging host {{ syslog_server }}
logging trap informational
service timestamps log datetime msec
banner motd ^C{{ banner }}^C`} explain={[
          ['{{ inventory_hostname }}', 'Se înlocuiește cu numele echipamentului din inventar (SW1, SW2, …).'],
          ['{{ ntp_server }} / {{ syslog_server }}', 'Valori comune, luate din „vars”; dacă serverul se schimbă, modifici într-un singur loc.'],
          ['banner motd ^C…^C', 'Caracterul ^C este delimitatorul; textul vine din variabila „banner”.'],
        ]} />
        <p>Rezultatul randării pentru SW2 este exact comenzile pe care le-ai tasta manual — dar generate identic pentru toate echipamentele:</p>
        <CodeBlock title="Configurația randată pentru SW2" kind="session" code={`hostname SW2
ntp server 192.168.99.100
logging host 192.168.99.101
logging trap informational
service timestamps log datetime msec
banner motd ^CAcces autorizat. Activitatea este monitorizata.^C`} />
      </Detailed>

      <Detailed title="4. Aplicare și verificare cu un script (ilustrativ)">
        <CodeBlock title="push_config.py — schiță cu Netmiko (ilustrativ)" kind="config" code={`import os
from netmiko import ConnectHandler

HOSTS = {"SW1": "192.168.99.1", "SW2": "192.168.99.2"}   # într-un proiect real: din inventar
USER = os.environ["NET_USER"]          # credențiale din variabile de mediu, nu în cod
PASS = os.environ["NET_PASS"]

for name, ip in HOSTS.items():
    dev = {"device_type": "cisco_ios", "host": ip, "username": USER, "password": PASS}
    with ConnectHandler(**dev) as conn:
        conn.send_config_set(open(f"out/{name}.cfg").read().splitlines())
        conn.save_config()
        out = conn.send_command("show running-config | include ntp server")
        print(name, "OK" if "192.168.99.100" in out else "DIFERIT", out)`} explain={[
          ['os.environ["NET_USER"] / ["NET_PASS"]', 'Credențialele nu se scriu în cod și nu se pun în Git.'],
          ['ConnectHandler(**dev)', 'Deschide sesiunea SSH către echipament (device_type = platforma).'],
          ['send_config_set(…)', 'Trimite liniile de configurație în modul global config, ca și cum le-ai tasta.'],
          ['save_config()', 'Echivalentul lui copy running-config startup-config.'],
          ['send_command("show … | include ntp server")', 'Verificarea de după: citește starea reală și o compară cu intenția.'],
        ]} />
        <CodeBlock title="Rezultat posibil (ilustrativ)" kind="session" code={`SW1 OK ntp server 192.168.99.100
SW2 DIFERIT ntp server 192.168.99.99`} />
        <p>Verificarea a găsit că SW2 are un server NTP vechi (<code>192.168.99.99</code>) — <b>drift</b>. Nu doar că aplici configurația, ci și <b>afli unde realitatea diferă de intenție</b>.</p>
        <Reveal label="De ce e important `save_config()` și verificarea?">
          <p>Fără salvare, configurația dispare la reload (running-config ≠ startup-config). Fără verificare, nu știi dacă schimbarea a „prins”; un script care „a rulat fără erori” poate totuși să nu fi produs rezultatul dorit.</p>
        </Reveal>
      </Detailed>

      <Detailed title="5. Verificări pe echipament">
        <CodeBlock title="Verificare manuală pe SW2 (ilustrativ)" kind="session" code={`SW2# show ip ssh
SSH Enabled - version 2.0
SW2# show running-config | include ^ntp|^logging
ntp server 192.168.99.100
logging host 192.168.99.101
SW2# show ntp status
Clock is synchronized, stratum 3, reference is 192.168.99.100`} explain={[
          ['show ip ssh', 'Confirmă că SSH versiunea 2 este activ — precondiția pentru automatizarea prin CLI.'],
          ['show running-config | include …', 'Filtrează doar liniile relevante (modificatorul | include).'],
          ['show ntp status', 'Confirmă rezultatul funcțional: ceasul e sincronizat cu serverul dorit (4.2).'],
        ]} />
        <Table head={['Verificare', 'Ce dovedește']} rows={[
          ['Sesiune SSH reușită cu utilizatorul „automation”', 'Accesul pentru automatizare funcționează'],
          ['Linii prezente în running-config', 'Configurația a fost aplicată'],
          ['Aceleași linii în startup-config', 'Configurația a fost salvată'],
          ['Starea funcțională (NTP sincronizat, vecini sus)', 'Intenția a fost atinsă, nu doar comenzile tastate'],
        ]} />
      </Detailed>
      <Traps items={[
        <>Un script fără <b>verificare</b> ne spune că a „trimis comenzi”, nu că rețeaua e în starea dorită.</>,
        <>Credențialele scrise în script sau în Git sunt o vulnerabilitate: folosește variabile de mediu sau un seif de secrete.</>,
        <><code>netconf-yang</code> și <code>restconf</code> nu sunt disponibile peste tot (nu în Packet Tracer).</>,
      ]} />
      <InlineQuiz ids={['6.1-018', '6.1-019', '6.1-030', '6.1-033']} />
    </section>
  );
}
