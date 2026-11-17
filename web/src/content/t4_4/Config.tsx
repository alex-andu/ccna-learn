import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.4" title="Exemple de configurare și verificare (SNMP)" />
      <Summary>
        <p>Obiectivul 4.4 este de tip <b>Explain</b>, dar configurarea de bază ajută să vezi conceptele: <code>snmp-server community</code> (v2c, cu ACL), <code>snmp-server host</code> (destinația traps), <code>snmp-server enable traps</code>, <code>snmp-server location/contact</code> și, pentru v3, <code>group</code> + <code>user</code>. Verifici cu <code>show snmp</code> și comenzile înrudite.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente; opțiunile (algoritmi, tipuri de trap, parametrii v3) și textele variază între IOS, IOS XE și Packet Tracer (care acceptă doar o parte din ele).
      </Callout>

      <Detailed title="1. SNMPv2c: agent cu acces RO și traps">
        <p>R1 (10.0.0.1) trebuie să poată fi interogat doar de NMS (10.0.0.9) și să-i trimită traps.</p>
        <CodeBlock title="R1 — SNMPv2c (ilustrativ)" kind="config" code={`R1(config)# access-list 10 permit host 10.0.0.9
R1(config)# snmp-server community Citire#Lab ro 10
R1(config)# snmp-server location Sala-Server-1
R1(config)# snmp-server contact admin@exemplu.local
R1(config)# snmp-server host 10.0.0.9 version 2c Citire#Lab
R1(config)# snmp-server enable traps snmp linkdown linkup`} explain={[
          ['access-list 10 permit host 10.0.0.9', 'ACL standard: doar NMS-ul are voie să interogheze agentul.'],
          ['snmp-server community Citire#Lab ro 10', 'Community read-only, cu parola „Citire#Lab” (ales de tine; nu „public”), limitat de ACL 10.'],
          ['snmp-server location / contact', 'Date informative, vizibile prin SNMP (sysLocation, sysContact).'],
          ['snmp-server host 10.0.0.9 version 2c Citire#Lab', 'Unde se trimit notificările (traps), cu ce versiune și ce community.'],
          ['snmp-server enable traps snmp linkdown linkup', 'Ce evenimente generează traps: căderea și revenirea unui link.'],
        ]} />
        <Callout kind="tip" title="Informuri">
          Pentru confirmare, cere <code>inform</code> în loc de trap: <code>snmp-server host 10.0.0.9 informs version 2c Citire#Lab</code>. Fără cuvântul <code>informs</code>, destinația primește trap-uri (neconfirmate).
        </Callout>
      </Detailed>

      <Detailed title="2. SNMPv3 authPriv">
        <CodeBlock title="R1 — SNMPv3 (ilustrativ)" kind="config" code={`R1(config)# snmp-server group ADMINS v3 priv
R1(config)# snmp-server user nms1 ADMINS v3 auth sha AuthParola123 priv aes 128 PrivParola123
R1(config)# snmp-server host 10.0.0.9 version 3 priv nms1`} explain={[
          ['snmp-server group ADMINS v3 priv', 'Grup v3 care cere nivelul authPriv (autentificare + criptare).'],
          ['snmp-server user nms1 ADMINS v3 auth sha … priv aes 128 …', 'Utilizatorul nms1, în grupul ADMINS: autentificare SHA și criptare AES-128, cu două parole distincte.'],
          ['snmp-server host 10.0.0.9 version 3 priv nms1', 'Traps v3 criptate, către NMS, în numele utilizatorului nms1.'],
        ]} />
        <p>Parolele v3 sunt folosite pentru a deriva chei; NMS-ul trebuie configurat cu <b>aceleași</b> nume de utilizator, algoritmi și parole.</p>
      </Detailed>

      <Detailed title="3. Verificare">
        <CodeBlock title="R1 — show snmp (ilustrativ)" kind="session" code={`R1# show snmp
Chassis: FTX1234ABCD
Location: Sala-Server-1
Contact: admin@exemplu.local
0 SNMP packets input
    0 Bad SNMP version errors
    0 Unknown community name
    0 Illegal operation for community name supplied
    0 Encoding errors
12 SNMP packets output
    0 Too big errors (Maximum packet size 1500)
    0 No such name errors
SNMP global trap: enabled
SNMP logging: enabled
    Logging to 10.0.0.9.162, 0/10, 3 sent, 0 dropped.`} explain={[
          ['Chassis / Location / Contact', 'Valorile informative configurate.'],
          ['Unknown community name', 'Contor important: crește când cineva (sau un NMS configurat greșit) folosește un community greșit.'],
          ['Logging to 10.0.0.9.162', 'Destinația traps (portul 162) și câte notificări s-au trimis.'],
        ]} />
        <Table head={['Comandă', 'Ce arată']} hlCol={0} rows={[
          [<code key="a">show snmp</code>, 'Statistici și starea agentului'],
          [<code key="b">show snmp community</code>, 'Community-urile configurate (și ACL-ul lor)'],
          [<code key="c">show snmp host</code>, 'Destinațiile de notificare'],
          [<code key="d">show snmp group</code>, 'Grupurile v3'],
          [<code key="e">show snmp user</code>, 'Utilizatorii v3 (fără parole)'],
          [<code key="f">show access-lists</code>, 'Dacă ACL-ul permite NMS-ul (matches)'],
        ]} />
        <Reveal label="Lista de verificare când „NMS nu vede routerul”">
          <ol>
            <li>Ping între NMS și router; UDP 161 nu este blocat?</li>
            <li>Community/utilizatorul și versiunea sunt identice pe NMS și pe router?</li>
            <li>ACL-ul din <code>snmp-server community … ro 10</code> permite adresa NMS-ului?</li>
            <li><code>show snmp</code>: crește „Unknown community name”? Atunci community-ul diferă.</li>
            <li>Pentru traps: <code>snmp-server host</code> și <code>enable traps</code> sunt prezente; NMS ascultă pe UDP 162?</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <>Nu folosi community-uri „public”/„private” și nu lăsa RW fără ACL.</>,
        <>Fără <code>snmp-server enable traps …</code>, <code>snmp-server host</code> nu produce notificări (nu există evenimente activate).</>,
        <>Output-urile sunt <b>ilustrative</b>; contoarele reale diferă.</>,
      ]} />
      <InlineQuiz ids={['4.4-020', '4.4-021']} />
    </section>
  );
}
