import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.1" title="Exemple: mitigări concrete pe un switch/router (hardening de bază)" />
      <Summary>
        <p>5.1 e un topic de concepte, dar fiecare mitigare se vede pe un echipament. Aici legi <b>vulnerabilitatea → comanda care o reduce</b>: servicii inutile oprite, porturi libere închise, protocoale în clar înlocuite, acces protejat și jurnalizare. Detaliile fiecărei familii vin la 5.3, 5.6, 5.7 și 5.8.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Output-urile sunt <b>exemple ilustrative</b>, nu capturi reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; disponibilitatea lor și textul exact variază între IOS, IOS XE și Packet Tracer. Nu aplica pe un echipament de producție fără să înțelegi efectul (de exemplu, închiderea unui port folosit).
      </Callout>

      <Detailed title="1. Tabel: vulnerabilitate → mitigare → comandă">
        <Table head={['Vulnerabilitate / risc', 'Mitigare', 'Comandă (IOS)']} hlCol={0} rows={[
          ['Server HTTP/HTTPS de administrare pornit și nefolosit', 'Dezactivează serviciul', <code key="a">no ip http server</code>],
          ['Telnet transmite parola în clar', 'Doar SSH pe VTY', <code key="b">transport input ssh</code>],
          ['Porturi de switch libere, active', 'Închide-le și mută-le într-un VLAN neutilizat', <code key="c">shutdown</code>],
          ['CDP expune modelul/versiunea spre toți vecinii', 'Oprește CDP pe porturile spre utilizatori sau global', <code key="d">no cdp enable</code>],
          ['Parole în clar în configurație', 'Hash pentru enable și utilizatori', <code key="e">enable secret …</code>],
          ['Nimeni nu știe cine a încercat să intre', 'Jurnalizare spre server', <code key="f">logging host …</code>],
          ['Mesaje care arată ce echipament e', 'Banner de avertisment fără detalii', <code key="g">banner login …</code>],
          ['Încercări repetate de autentificare', 'Blocare temporară', <code key="h">login block-for …</code>],
        ]} />
      </Detailed>

      <Detailed title="2. Scenariul: SW1 consolidat">
        <CodeBlock title="SW1 — hardening de bază (ilustrativ)" kind="config" code={`SW1(config)# no ip http server
SW1(config)# no ip http secure-server
SW1(config)# interface range gigabitEthernet 0/10 - 24
SW1(config-if-range)# description NEFOLOSIT
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 999
SW1(config-if-range)# shutdown
SW1(config-if-range)# exit
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# no cdp enable
SW1(config-if)# exit
SW1(config)# banner login # Acces permis doar persoanelor autorizate. Activitatea este monitorizata. #
SW1(config)# logging host 192.168.1.10
SW1(config)# line vty 0 4
SW1(config-line)# transport input ssh
SW1(config-line)# exec-timeout 5 0`} explain={[
          ['no ip http server / no ip http secure-server', 'Opresc interfața web de administrare (HTTP și HTTPS) dacă nu o folosești: o mică parte din suprafața de atac dispare.'],
          ['interface range … shutdown', 'Porturile libere nu mai pot fi folosite pentru a conecta un laptop (dispozitiv neautorizat).'],
          ['switchport access vlan 999', 'Mută porturile libere într-un VLAN „parcare” (fără SVI, fără rutare), ca măsură suplimentară.'],
          ['no cdp enable', 'Pe interfața spre utilizatori, CDP nu mai trimite informații despre echipament.'],
          ['banner login', 'Mesaj legal de avertizare; evită să incluzi numele organizației, modelul sau versiunea.'],
          ['logging host 192.168.1.10', 'Trimite log-urile spre serverul syslog (4.5), ca să ai urme chiar dacă echipamentul e compromis.'],
          ['transport input ssh', 'Pe VTY nu mai este acceptat Telnet; condiția este SSH configurat (4.8).'],
          ['exec-timeout 5 0', 'Sesiunile inactive se închid după 5 minute.'],
        ]} />
        <Callout kind="tip" title="Lanțul complet de acces">
          Parolele de enable, utilizatorii locali, <code>login block-for</code> și lungimea minimă a parolei sunt tema topicului <b>5.3</b>; SSH s-a configurat la <b>4.8</b>; ACL pe VTY (<code>access-class</code>) la <b>5.6</b>.
        </Callout>
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="SW1 — verificări (ilustrativ)" kind="session" code={`SW1# show running-config | include http
no ip http server
no ip http secure-server
SW1# show interfaces status
Port      Name               Status       Vlan       Duplex  Speed Type
Gi0/1                        connected    1          a-full  a-100 10/100/1000BaseTX
Gi0/10    NEFOLOSIT          disabled     999        auto    auto  10/100/1000BaseTX
Gi0/11    NEFOLOSIT          disabled     999        auto    auto  10/100/1000BaseTX
SW1# show cdp interface gigabitEthernet 0/1
% CDP is not enabled on interface GigabitEthernet0/1
SW1# show running-config | section line vty
line vty 0 4
 exec-timeout 5 0
 transport input ssh`} explain={[
          ['show running-config | include http', 'Filtrează configurația după „http”: confirmi că serverele sunt dezactivate.'],
          ['disabled', 'Starea unui port în shutdown (administrativ oprit).'],
          ['Vlan 999', 'Porturile libere sunt parcate în VLAN-ul neutilizat.'],
          ['show running-config | section line vty', 'Arată doar secțiunea liniilor VTY: transportul permis și timeout-ul.'],
        ]} />
        <Reveal label="Listă de audit rapid pentru un echipament">
          <ol>
            <li>Parole: <code>enable secret</code> setat? Linii console/VTY protejate (5.3)?</li>
            <li>Acces la distanță: doar SSH? Telnet dezactivat?</li>
            <li>Servicii: HTTP/HTTPS oprite? CDP/LLDP limitate la porturile de infrastructură?</li>
            <li>Porturi: cele libere sunt în <code>shutdown</code>?</li>
            <li>Jurnalizare și oră: <code>logging host</code>, NTP (4.2)?</li>
            <li>Actualizări: versiunea de IOS are un patch pentru vulnerabilități cunoscute?</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Nu dezactiva CDP/LLDP pe porturile spre telefoane IP sau AP-uri dacă depind de ele (2.3).</>,
        <><code>no ip http server</code> nu dezactivează și <code>ip http secure-server</code>; sunt două comenzi.</>,
        <>„shutdown” pe un port folosit întrerupe conectivitatea: verifică <code>show interfaces status</code> înainte.</>,
        <>Output-urile sunt <b>ilustrative</b>; textele și coloanele reale pot diferi.</>,
      ]} />
      <InlineQuiz ids={['5.1-019', '5.1-020']} />
    </section>
  );
}
