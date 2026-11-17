import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology51, LabSoloTopology51 } from '../../diagrams/t5_1';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't51g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.1-G" title="Lab ghidat — de la vulnerabilitate la mitigare (hardening de bază)" />
      <Summary>
        <p><b>Obiectiv:</b> pornești de la un switch „lăsat din fabrică” cu slăbiciuni tipice, le identifici (vulnerabilități), le asociezi cu o amenințare și aplici mitigarea. <br /><b>Timp estimat:</b> 35–50 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router, 1 × switch, 1 × PC, 1 × Server) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: PC1 — SW1 — R1 și un server intern (192.168.1.10).">
        <LabGuidedTopology51 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '192.168.1.1/24'],
        ['SW1', 'SVI VLAN 1', '192.168.1.2/24'],
        ['PC1', 'NIC', '192.168.1.100/24'],
        ['Server', 'NIC', '192.168.1.10/24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer acceptă <code>no ip http server</code>, <code>shutdown</code>, <code>banner</code>, <code>transport input ssh</code>, <code>exec-timeout</code>; <code>show control-plane host open-ports</code> poate lipsi. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT. Același lab merge în GNS3/CML cu IOSvL2.
      </Callout>

      <Detailed title="Partea 0 — Inventar de slăbiciuni">
        <Step labKey={L} n={1} title="Adresare și acces">
          <p>Configurează adresele din tabel și un acces Telnet cu parolă pe VTY (ca „ghinionul” de pornire). Conectează-te de pe PC1 prin Telnet la SW1 și, cu simulation mode, deschide un pachet Telnet: ce vezi în conținut?</p>
          <Reveal label="Răspuns">
            <p>Textul comenzilor și parola apar <b>în clar</b>. Vulnerabilitate: protocol necriptat; amenințare: oricine poate captura traficul (MITM). Mitigare: SSH (4.8).</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Completează tabelul">
          <p>Pe hârtie, completează pentru fiecare slăbiciune descoperită: <i>vulnerabilitate · amenințare · exploit posibil · mitigare</i>. Slăbiciuni de căutat: Telnet activ, HTTP server pornit, toate porturile active, parola în clar în <code>show run</code>.</p>
          <Reveal label="Exemplu completat">
            <Table head={['Vulnerabilitate', 'Amenințare', 'Exploit', 'Mitigare']} rows={[
              ['Telnet (în clar)', 'Atacator în aceeași rețea', 'Captură de pachete', 'SSH + transport input ssh'],
              ['Porturi libere active', 'Vizitator cu laptop', 'Conectare la port liber', 'shutdown, VLAN parcare'],
              ['HTTP server pornit', 'Atacator extern/intern', 'Eroare în serviciul web', 'no ip http server'],
              ['Parolă enable în clar', 'Cineva cu acces la configurație', 'Citirea show run', 'enable secret'],
            ]} />
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Aplică mitigările">
        <Step labKey={L} n={3} title="Servicii și porturi">
          <CodeBlock title="SW1" kind="config" code={`SW1(config)# no ip http server
SW1(config)# interface range fastEthernet 0/5 - 24
SW1(config-if-range)# shutdown`} explain={[
            ['no ip http server', 'Oprește interfața web (dacă există pe platformă).'],
            ['interface range … shutdown', 'Închide porturile libere (alege-le pe cele neutilizate din topologia ta).'],
          ]} />
          <p>Verifică cu <code>show ip interface brief</code>: ce stare au porturile închise?</p>
          <Reveal label="Răspuns">
            <p><code>administratively down</code> / <code>down</code>: oprite din configurare, nu defecte fizic.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Acces la distanță și parole">
          <p>Configurează <code>enable secret</code>, un nume de domeniu, cheie RSA și SSH (vezi 4.8), apoi <code>transport input ssh</code> pe VTY și <code>exec-timeout 5 0</code>. Verifică din PC1 că Telnet e refuzat și SSH merge.</p>
          <Reveal label="Răspuns">
            <p>Telnet: conexiune refuzată/închisă; SSH: cere utilizator/parolă. Dacă SSH nu pornește, verifică <code>hostname</code>, <code>ip domain-name</code> și <code>crypto key generate rsa</code>.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={5} title="Banner și jurnalizare">
          <p>Adaugă un <code>banner login</code> și <code>logging host 192.168.1.10</code> (serviciul Syslog pe Server). Generează un eveniment și verifică pe server.</p>
          <Reveal label="Indicii">
            <p>Banner-ul nu trebuie să conțină detalii despre echipament. Pe server apare mesajul %SYS-5-CONFIG_I după ce ieși din config.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Reflecție">
          <p>Răspunde în scris: (1) Care dintre măsuri e <i>preventivă</i> și care <i>detectivă</i>? (2) Ce amenințare ar rămâne chiar după hardening? (3) Ce strat din „defense in depth” lipsește din acest lab?</p>
          <Reveal label="Indicii">
            <p>(1) Shutdown/SSH preventive; logging detectiv. (2) Utilizatorii păcăliți prin phishing și parolele slabe (5.2/5.4). (3) Stratul fizic și politicile (5.2).</p>
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
  const L = 't51s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.1-S" title="Lab solo — auditul unei configurații slabe" />
      <Summary>
        <p><b>Scenariu:</b> primești configurația unui switch dintr-o filială. Găsește slăbiciunile, clasifică-le (vulnerabilitate, amenințare, mitigare) și corectează-le. <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer (1 router, 1 switch, 1 PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: PC1, SW1, R1.">
        <LabSoloTopology51 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Configurația de auditat">
        <Step labKey={L} n={1} title="Încarcă configurația">
          <CodeBlock title="SW1 (de încărcat)" kind="config" code={`hostname SW1
enable password cisco
ip http server
!
interface range fa0/1 - 24
 no shutdown
!
line vty 0 15
 password cisco
 login
 transport input all
!
no logging host`} explain={[
            ['enable password cisco', 'Parolă slabă și în clar.'],
            ['ip http server', 'Serviciu inutil activ.'],
            ['transport input all', 'Telnet permis.'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Audit și remediere">
        <Step labKey={L} n={2} title="Găsește cel puțin 5 slăbiciuni">
          <p>Listează fiecare problemă și asociază-i o categorie (configurare/protocol/fizic) și mitigarea.</p>
          <Reveal label="Soluție">
            <ol>
              <li><code>enable password cisco</code>: parolă slabă, în clar → <code>enable secret</code> cu o parolă lungă.</li>
              <li><code>ip http server</code>: serviciu inutil → <code>no ip http server</code>.</li>
              <li>Toate porturile active → <code>shutdown</code> pe cele libere.</li>
              <li>VTY cu parolă comună „cisco” și <code>transport input all</code> → utilizatori locali, SSH.</li>
              <li>Fără jurnalizare → <code>logging host</code> și timestamps.</li>
              <li>Fără timeout și banner → <code>exec-timeout 5 0</code>, <code>banner login</code>.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Remediază">
          <p>Aplică pe SW1 corecțiile și verifică cu <code>show running-config</code> și <code>show interfaces status</code>.</p>
          <Reveal label="Soluție">
            <CodeBlock title="SW1" kind="config" code={`SW1(config)# enable secret Str0ng!Pass2024
SW1(config)# no enable password
SW1(config)# no ip http server
SW1(config)# interface range fa0/6 - 24
SW1(config-if-range)# shutdown
SW1(config-if-range)# exit
SW1(config)# line vty 0 15
SW1(config-line)# transport input ssh
SW1(config-line)# exec-timeout 5 0`} explain={[
              ['enable secret', 'Hash pentru parola de privilegiat; suprascrie enable password.'],
              ['no enable password', 'Elimină parola în clar.'],
              ['transport input ssh', 'Telnet nu mai este permis.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Clasificare">
          <p>Care dintre remedieri sunt preventive și care ar trebui completate cu control detectiv?</p>
          <Reveal label="Răspuns">
            <p>Secret, SSH, shutdown, dezactivarea HTTP = preventive. <code>logging host</code> și monitorizarea log-urilor = detective: dacă cineva reușește totuși, vei vedea urma.</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
