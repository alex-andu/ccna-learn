import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology44, LabSoloTopology44 } from '../../diagrams/t4_4';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't44g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 4.4-G" title="Lab ghidat — agent SNMPv2c și NMS" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi un agent SNMPv2c pe R1, restricționezi accesul cu un ACL, trimiți traps către NMS și observi diferența dintre un community corect și unul greșit. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router 2911, 1 × switch 2960, 1 × PC/Server ca NMS) · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: NMS (10.0.0.9), SW1 și R1 (agent, 10.0.0.1).">
        <LabGuidedTopology44 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '10.0.0.1/24'],
        ['NMS (Server/PC)', 'NIC', '10.0.0.9/24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă comenzile de bază <code>snmp-server community</code>, <code>host</code>, <code>enable traps</code> și <code>show snmp</code>; v3 și unele opțiuni lipsesc sau sunt limitate. PT nu include un NMS real: ca să vezi răspunsuri poți folosi un Server cu aplicații de test sau poți observa pachetele în Simulation Mode (UDP 161/162). Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Același lab merge în GNS3/CML cu IOSv și un NMS real (de exemplu un Linux cu <code>snmpwalk</code>).
      </Callout>

      <Detailed title="Partea 1 — Agentul">
        <Step labKey={L} n={1} title="Adresare și conectivitate">
          <p>Configurează Gi0/0 pe R1 și adresa NMS-ului; verifică <code>ping</code> între ele.</p>
        </Step>
        <Step labKey={L} n={2} title="Community RO restricționat">
          <p>Creează un ACL care permite doar NMS-ul și un community read-only legat de el. Adaugă locația și contactul.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# access-list 10 permit host 10.0.0.9
R1(config)# snmp-server community Citire#Lab ro 10
R1(config)# snmp-server location Sala-Server-1
R1(config)# snmp-server contact admin@exemplu.local`} explain={[
              ['access-list 10 …', 'Doar 10.0.0.9 are voie să interogheze agentul.'],
              ['community Citire#Lab ro 10', 'Acces read-only, limitat de ACL 10.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Verifică agentul">
          <p><code>show snmp</code>, <code>show snmp community</code>. Ce arată contoarele? Dacă folosești un NMS real, rulează <code>snmpwalk -v2c -c Citire#Lab 10.0.0.1 system</code> și compară rezultatul cu <code>show snmp</code>.</p>
          <Reveal label="Răspuns">
            <p>Locația și contactul apar în <code>show snmp</code>; „SNMP packets input” crește la fiecare interogare. Un community greșit incrementează „Unknown community name”.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Traps">
        <Step labKey={L} n={4} title="Destinația și evenimentele">
          <CodeBlock title="R1" kind="config" code={`R1(config)# snmp-server host 10.0.0.9 version 2c Citire#Lab
R1(config)# snmp-server enable traps snmp linkdown linkup`} explain={[
            ['snmp-server host …', 'Unde se trimit traps.'],
            ['enable traps snmp linkdown linkup', 'Generează notificări la căderea/revenirea unui link.'],
          ]} />
        </Step>
        <Step labKey={L} n={5} title="Generează un eveniment">
          <p>Pe R1 dă <code>shutdown</code> apoi <code>no shutdown</code> pe o interfață nefolosită (sau pe cea spre un al doilea dispozitiv). În Simulation Mode sau pe NMS, observă mesajul spre UDP 162. Ce informații conține?</p>
          <Reveal label="Răspuns">
            <p>Un trap cu cauza (linkDown / linkUp), identificatorul interfeței și momentul. Dacă pachetul se pierde, nu există retransmisie (trap = neconfirmat). Un inform ar fi retransmis până la confirmare.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Acces nepermis">
          <p>Încearcă o interogare de la o altă adresă (de exemplu un al doilea PC) sau cu alt community. Ce se întâmplă? Ce contor crește?</p>
          <Reveal label="Răspuns">
            <p>Agentul nu răspunde (ACL sau community greșit). Contorul „Unknown community name” crește la community greșit; interogările blocate de ACL nu primesc răspuns.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={7} title="Reflecție">
          <p>Răspunde în scris: (1) De ce nu este suficient community-ul ca protecție? (2) Când ai alege inform în loc de trap? (3) Ce versiune ai alege într-o rețea de producție și de ce?</p>
          <Reveal label="Indicii">
            <p>(1) Se transmite în text clar, oricine poate asculta. (2) Când pierderea unei notificări nu e acceptabilă. (3) SNMPv3 authPriv: autentificare și criptare.</p>
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
  const L = 't44s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 4.4-S" title="Lab solo — SNMPv3 și un defect de diagnosticat" />
      <Summary>
        <p><b>Scenariu:</b> R1 trebuie să fie gestionat de NMS (10.0.0.9) prin SNMPv3 authPriv, utilizatorul <code>nms1</code>, grup <code>ADMINS</code>. NMS-ul primește „authentication failure” la interogare. Găsește defectul cu <code>show</code>.
          <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> GNS3/CML cu IOSv sau Packet Tracer (dacă suportă v3) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: NMS, SW1, R1 (agent SNMPv3).">
        <LabSoloTopology44 />
      </Figure>
      <Table head={['Dispozitiv', 'IPv4']} rows={[
        ['R1', '10.0.0.1/24'],
        ['NMS', '10.0.0.9/24'],
      ]} />
      <Callout kind="info" title="Cerințe">
        Grup ADMINS (v3 priv), utilizator nms1 (SHA + AES-128, parole diferite), traps v3 către NMS. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate (dacă PT nu suportă v3, descrie în scris configurația și diagnoza).
      </Callout>
      <Detailed title="Partea 1 — Construiește">
        <Step labKey={L} n={1} title="Grup, utilizator, host">
          <Reveal label="Soluție">
            <CodeBlock title="R1" kind="config" code={`R1(config)# snmp-server group ADMINS v3 priv
R1(config)# snmp-server user nms1 ADMINS v3 auth sha AuthParola123 priv aes 128 PrivParola123
R1(config)# snmp-server host 10.0.0.9 version 3 priv nms1
R1(config)# snmp-server enable traps snmp linkdown linkup`} explain={[
              ['group ADMINS v3 priv', 'Cere authPriv.'],
              ['user nms1 … auth sha … priv aes 128 …', 'Parolele și algoritmii trebuie să coincidă pe NMS.'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnosticare">
        <Step labKey={L} n={2} title="Defectul">
          <p>NMS-ul este configurat cu utilizatorul <code>nms1</code>, SHA/AES-128 și parolele corecte, dar interogările eșuează. Cu <code>show snmp user</code>, <code>show snmp group</code> și <code>show snmp</code> găsește cauza (indiciu: pe R1 grupul a fost creat cu alt nivel de securitate decât cere NMS-ul) și repar-o.</p>
          <Reveal label="Cauza și remedierea">
            <p>Grupul a fost creat cu <code>v3 auth</code> (authNoPriv), nu <code>v3 priv</code>, dar NMS-ul cere authPriv: nivelul cerut nu corespunde nivelului grupului, deci cererile sunt respinse. Remediere: recreează grupul cu <code>snmp-server group ADMINS v3 priv</code> și recreează utilizatorul în grup (utilizatorul trebuie reasociat grupului). Alte cauze similare: algoritm diferit (MD5/SHA, DES/AES), parole diferite, nume de utilizator cu majuscule diferite.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Test final">
          <p>Interoghează din nou și generează un trap (shutdown/no shutdown). De ce nu mai poți folosi un community v2c pe acest agent, dacă nu ai configurat unul?</p>
          <Reveal label="Răspuns">
            <p>Pentru v2c ar trebui un <code>snmp-server community</code>; agentul nu răspunde la v2c fără community configurat. Astfel, doar utilizatorul v3 are acces.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
