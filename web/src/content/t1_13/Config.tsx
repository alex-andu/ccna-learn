import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.13" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 1.13 este de tip <b>Describe</b>, dar comenzile pentru tabela MAC sunt printre cele mai folosite în depanare și pot apărea ca simulări CLI. Mai jos: cum <b>citești</b> tabela, cum o <b>golești</b>, cum schimbi <b>aging-ul</b> și cum adaugi o intrare <b>statică</b>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, reconstruite după formatele documentate, cu adrese fictive; nu au fost capturate de pe echipamente reale. Comenzile din acest topic <b>nu au fost testate</b> de autorul lecției pe echipamente. Formatul exact (spații, intrări interne cu tip STATIC și port CPU, intervalul acceptat pentru aging-time) diferă între platforme și versiuni de IOS. Pe IOS mai vechi sintaxa are liniuță: <code>show mac-address-table</code>. Verifică cu <code>?</code> pe echipamentul tău.
      </Callout>

      <Detailed title="Exemplul 1 — Citirea tabelei MAC">
        <p>Scenariu: SW1 are PC-uri pe Fa0/1–Fa0/3 (VLAN 1) și un server pe Fa0/10 (VLAN 10), după câteva minute de trafic.</p>
        <CodeBlock title="SW1 — show mac address-table (ilustrativ)" kind="session" code={`SW1# show mac address-table
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
 All    0100.0ccc.cccc    STATIC      CPU
 All    ffff.ffff.ffff    STATIC      CPU
   1    000a.1111.1111    DYNAMIC     Fa0/1
   1    000b.2222.2222    DYNAMIC     Fa0/2
   1    000c.3333.3333    DYNAMIC     Fa0/3
  10    0011.2233.4455    STATIC      Fa0/10
Total Mac Addresses for this criterion: 6`} explain={[
          ['Vlan', <>VLAN-ul în care a fost învățată adresa. „All” = intrare internă valabilă în toate VLAN-urile.</>],
          ['0100.0ccc.cccc / ffff.ffff.ffff … CPU', 'Intrări interne (de control, broadcast); cadrele merg spre procesorul switch-ului. Nu sunt stații învățate și nu le ștergi.'],
          ['DYNAMIC … Fa0/1', <>Stație învățată din cadrele ei (<G id="mac-learning">MAC learning</G>); expiră după aging time dacă tace.</>],
          ['STATIC … Fa0/10', 'Intrare configurată manual; nu expiră.'],
          ['Total Mac Addresses', 'Numărul de intrări care corespund criteriului afișat.'],
        ]} />
        <p>Variante utile când tabela e mare:</p>
        <CodeBlock title="Filtre" kind="session" code={`SW1# show mac address-table dynamic
SW1# show mac address-table address 000a.1111.1111
SW1# show mac address-table interface FastEthernet0/1
SW1# show mac address-table vlan 10
SW1# show mac address-table count`} explain={[
          ['dynamic', 'Doar intrările învățate automat.'],
          ['address <mac>', 'Unde se află o anumită stație — prima comandă când cauți „pe ce port e PC-ul X?”.'],
          ['interface <port>', 'Ce adrese sunt în spatele unui port; mai multe adrese pe un port ⇒ alt switch/hub/AP în spate.'],
          ['vlan <id>', 'Doar un VLAN.'],
          ['count', 'Numărul de intrări dinamice/statice și spațiul rămas.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Aging time: verificare și modificare">
        <CodeBlock title="SW1 — aging (ilustrativ)" kind="session" code={`SW1# show mac address-table aging-time
Global Aging Time:  300
Vlan    Aging Time
----    ----------

SW1# configure terminal
SW1(config)# mac address-table aging-time 600
SW1(config)# end
SW1# show mac address-table aging-time
Global Aging Time:  600`} explain={[
          ['show mac address-table aging-time', <>Valoarea curentă; implicit <b>300 s</b>.</>],
          ['mac address-table aging-time 600', 'Intrările dinamice expiră după 600 s fără trafic de la acea stație. Pe platformele clasice valorile acceptate sunt 0 (fără aging) și un interval de zeci de secunde până la un milion; verifică cu ? pe echipamentul tău.'],
        ]} />
        <Callout kind="tip" title="Când modifici aging-ul?">
          Într-un laborator poți coborî valoarea (de exemplu la 10–30 s) ca să vezi intrările dispărând. În producție se mărește rar, de exemplu pentru stații care vorbesc foarte rar (o imprimantă) ca să nu fie inundat traficul către ele la fiecare ciclu. Reține: fiecare modificare afectează comportamentul de <G id="flooding">flooding</G>.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 3 — Golirea intrărilor dinamice">
        <CodeBlock title="SW1 — clear (ilustrativ)" kind="session" code={`SW1# clear mac address-table dynamic
SW1# show mac address-table dynamic
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
Total Mac Addresses for this criterion: 0`} explain={[
          ['clear mac address-table dynamic', 'Șterge toate intrările învățate automat. Intrările statice și cele interne rămân.'],
          ['show … dynamic', 'Acum e goală; la primele cadre, switch-ul inundă (unknown unicast) și învață din nou.'],
        ]} />
        <p>Variante cu filtru (pe platforme care le suportă): <code>clear mac address-table dynamic address &lt;mac&gt;</code>, <code>… interface &lt;port&gt;</code>, <code>… vlan &lt;id&gt;</code>. Ștergerea tabelei e un pas de depanare, nu o reparație: dacă problema persistă (de exemplu flapping), cauza e în altă parte.</p>
      </Detailed>

      <Detailed title="Exemplul 4 — Intrare statică">
        <CodeBlock title="SW1 — intrare statică" kind="config" code={`SW1(config)# mac address-table static 0011.2233.4455 vlan 10 interface GigabitEthernet0/1
SW1(config)# end
SW1# show mac address-table address 0011.2233.4455
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    0011.2233.4455    STATIC      Gi0/1
Total Mac Addresses for this criterion: 1`} explain={[
          ['mac address-table static <mac> vlan <id> interface <port>', 'Leagă adresa de port pentru acel VLAN. Nu expiră și nu poate fi mutată de un cadru primit pe alt port.'],
          ['Type STATIC', 'Confirmă că intrarea e manuală.'],
        ]} />
        <Callout kind="warn" title="Capcane la intrări statice">
          Dacă stația este mutată pe alt port, switch-ul nu o mai poate „urma” — cadrele către ea merg în continuare pe portul vechi, deci comunicarea eșuează până corectezi intrarea. Folosește intrări statice doar unde ai un motiv clar.
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 5 — Două switch-uri și uplink-ul">
        <CodeBlock title="SW1 — după trafic între ambele switch-uri (ilustrativ)" kind="session" code={`SW1# show mac address-table dynamic
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    00aa.aaaa.aaaa    DYNAMIC     Fa0/1
   1    00bb.bbbb.bbbb    DYNAMIC     Fa0/2
   1    00cc.cccc.cccc    DYNAMIC     Gi0/1
   1    00dd.dddd.dddd    DYNAMIC     Gi0/1
Total Mac Addresses for this criterion: 4`} explain={[
          ['Fa0/1, Fa0/2', 'Stații conectate direct: câte un MAC pe port.'],
          ['Gi0/1 cu două MAC-uri', <>Uplink spre SW2: stațiile din spatele lui sunt învățate toate pe portul de uplink. Un switch nu rescrie adresele sursă, deci MAC-urile originale apar în tabelă.</>],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Mesajul de MAC flapping">
        <CodeBlock title="Syslog (format ilustrativ)" kind="session" code={`%SW_MATM-4-MACFLAP_NOTIF: Host 00cc.cccc.cccc in vlan 1 is flapping between port Gi0/1 and port Gi0/2`} explain={[
          ['%SW_MATM-4-MACFLAP_NOTIF', <>Mesaj de severitate 4 (warning) de pe unele platforme Catalyst: aceeași adresă se mută repetat între două porturi.</>],
          ['Gi0/1 și Gi0/2', 'Cele două căi pe care apar cadrele aceleiași stații — suspect: buclă L2 sau cabluri duble fără EtherChannel/STP.'],
        ]} />
        <p>Formatul exact al mesajului diferă între platforme și versiuni. Important e ce înseamnă: <G id="mac-flapping" /> nu se rezolvă cu <code>clear mac address-table</code>, ci eliminând bucla.</p>
      </Detailed>
    </section>
  );
}
