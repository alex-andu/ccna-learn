import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step, P } from '../../components/LabStep';
import { LabGuidedTopology61, LabSoloTopology61 } from '../../diagrams/t6_1';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't61g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 6.1-G" title="Lab ghidat — de la configurare manuală la configurare generată din șablon" />
      <Summary>
        <p><b>Obiectiv:</b> configurezi „standardul de management” manual pe un switch și simți costul repetiției; apoi construiești un inventar și un șablon, generezi configurațiile celorlalte trei switch-uri, le aplici și verifici consecvența; la final provoci și detectezi un <b>drift</b>. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Cisco Packet Tracer (4 switch-uri, un PC) + un editor de text; opțional Python 3 · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: Admin PC → SW0 → SW1–SW4, toate în VLAN 99 de management.">
        <LabGuidedTopology61 />
      </Figure>
      <Table head={['Element', 'Valoare']} rows={[
        ['Admin PC', '192.168.99.10/24 (VLAN 99)'],
        ['SW1–SW4', 'Vlan99: 192.168.99.1–.4/24, hostname SW1…SW4'],
        ['Standard de management', 'ntp server 192.168.99.100 · logging host 192.168.99.101 · banner motd · service timestamps log datetime msec'],
        ['Fișiere', 'inventar (CSV sau YAML) și șablon (text)'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer nu rulează NETCONF/RESTCONF și nu are un controller real; automatizarea se face <b>în afara</b> PT (un editor de text sau un script pe calculatorul tău), iar rezultatul se lipește în consola echipamentelor. Dacă versiunea ta de PT oferă programare (Python) pe dispozitive, poți folosi și acolo. Pașii sunt ilustrativi și nu au fost testați de autorul lecției; comenzile NTP/syslog sunt acceptate de PT, dar serverele 192.168.99.100/.101 nu există în topologie (nu vei vedea sincronizare reală).
      </Callout>

      <Detailed title="Partea 1 — Manual (cronometrează-te)">
        <Step labKey={L} n={1} title="Pregătește topologia">
          <p>Conectează cele patru switch-uri la SW0 și PC-ul la SW0. Pe fiecare switch setează hostname-ul, <code>interface vlan 99</code>, adresa .1–.4/24 și <code>no shutdown</code>; verifică <code>ping 192.168.99.10</code>.</p>
          <Reveal label="Verificare"><p>De pe fiecare switch, ping-ul către 192.168.99.10 trebuie să reușească (primul pachet poate pierde din cauza ARP).</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Standardul pe SW1, manual">
          <p>Pe <b>SW1</b> tastează manual cele cinci comenzi ale standardului (NTP, logging host, trap, timestamps, banner). Notează timpul. Apoi <code>show running-config | include ^ntp|^logging|^service|banner</code> pentru verificare.</p>
          <Reveal label="Întrebare"><p>Cât ai estima pentru 200 de switch-uri? Ce greșeli ai fi putut face (IP greșit, comandă omisă, salvare uitată)?</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Inventar + șablon">
        <Step labKey={L} n={3} title="Scrie inventarul">
          <p>Într-un fișier <code>inventory.csv</code> (sau YAML) scrie câte un rând pe echipament: <code>hostname,mgmt_ip</code>, plus valorile comune (NTP, syslog, banner) într-un loc separat. Care sunt variabilele „per echipament” și care „comune”?</p>
          <Reveal label="Răspuns"><p>Per echipament: hostname, mgmt_ip. Comune: serverul NTP, serverul syslog, textul bannerului. Comunele se schimbă într-un singur loc.</p></Reveal>
        </Step>
        <Step labKey={L} n={4} title="Scrie șablonul">
          <p>Creează un fișier de text cu configurația standard, în care valorile variabile sunt înlocuite cu marcaje (de exemplu <code>{'{{ hostname }}'}</code>, <code>{'{{ ntp_server }}'}</code>). Ce ar trebui să conțină și ce nu?</p>
          <Reveal label="Indiciu"><p>Doar ce e comun: structura comenzilor. Nu pune în șablon valori care diferă între echipamente.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Generează configurațiile">
          <p>Generează câte un fișier pentru SW2, SW3, SW4. Cu un script Python simplu (<code>str.replace</code> sau Jinja2), cu un editor („Find & Replace”) sau cu foaie de calcul. Verifică vizual că fiecare fișier are hostname-ul și IP-urile corecte.</p>
          <Reveal label="Schiță Python (opțională, ilustrativă)">
            <p><code>{"for host in hosts: open(host + '.cfg', 'w').write(tpl.replace('{{ hostname }}', host))"}</code> — sau folosește biblioteca Jinja2 dacă o ai instalată.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 3 — Aplicare și verificare">
        <Step labKey={L} n={6} title="Aplică și compară">
          <p>Pe fiecare dintre SW2–SW4: <P>CLI → global config</P>, lipește fișierul generat. Rulează aceeași verificare ca la SW1 și compară cele patru rezultate (<code>show running-config | include …</code>). Sunt identice, cu excepția hostname-ului?</p>
          <Reveal label="Răspuns"><p>Da: structura e aceeași pentru toate; diferă doar variabilele (hostname). Asta e <b>consecvența</b>.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Provoacă un drift">
          <p>Pe SW3 schimbă manual serverul NTP: <code>no ntp server 192.168.99.100</code>, <code>ntp server 192.168.99.99</code>. Apoi „verifică” toate cele patru switch-uri cu aceeași comandă. Cum detectezi abaterea? Ce ai putea automatiza aici?</p>
          <Reveal label="Răspuns"><p>Comparând output-urile (sau, automatizat, comparând fiecare rezultat cu valoarea din inventar) vezi că SW3 diferă. Un job periodic de „audit” poate raporta sau chiar corecta deriva.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Reflecție">
          <p>Răspunde în scris: (1) Ce ai câștigat prin șablon? (2) Ce risc ai introdus (de exemplu o greșeală din șablon se aplică pe toate)? (3) Ce ai adăuga pentru a reduce acel risc?</p>
          <Reveal label="Indicii"><p>(1) Consecvență, repetabilitate, schimbare într-un singur loc. (2) Raza de impact: un IP greșit în șablon e greșit peste tot. (3) Validare înainte (diff), lot-pilot pe un singur switch, verificare după, rollback.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't61s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 6.1-S" title="Lab solo — auditul unui plan de automatizare cu defecte" />
      <Summary>
        <p><b>Scenariu:</b> un coleg a pregătit un plan de automatizare pentru trei switch-uri și l-a aplicat. După aplicare, SW2 nu răspunde la ping, SW3 are alt server NTP, iar nimeni nu poate spune dacă schimbarea a fost salvată. Primești fișierele colegului (în tabele); găsește defectele (cel puțin cinci) și propune corecturi. <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> Packet Tracer (opțional) + analiză pe hârtie · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: Admin PC, R0 și trei switch-uri; inventarul și șablonul sunt în tabelele de mai jos.">
        <LabSoloTopology61 />
      </Figure>
      <Callout kind="info" title="Cerințe și limite">
        La final: ai o listă de defecte cu cauza fiecăruia, un inventar și un șablon corectate și un plan de aplicare cu validare înainte, lot-pilot, verificare după și rollback. Poți reproduce topologia în Packet Tracer și testa șablonul corectat. Pașii sunt ilustrativi și nu au fost testați de autorul lecției.
      </Callout>
      <Detailed title="Partea 1 — Materialele primite">
        <Step labKey={L} n={1} title="Citește inventarul și șablonul">
          <Table head={['Echipament', 'mgmt_ip din inventar', 'IP real configurat pe Vlan99', 'Observație']} rows={[
            ['SW1', '192.168.99.1', '192.168.99.1', '—'],
            ['SW2', '192.168.99.2', '192.168.99.20', 'inventarul a fost scris după o schemă veche'],
            ['SW3', '192.168.99.3', '192.168.99.3', 'cineva a modificat NTP manual, „în urgență”'],
          ]} />
          <Table head={['Linie din șablon', 'Problemă potențială']} rows={[
            ['ntp server {{ ntp_server }}', 'variabila lipsește din inventar pentru grupul „sw3”'],
            ['logging host {{ syslog_srv }}', 'în inventar variabila se numește syslog_server'],
            ['(nu există nicio linie de salvare)', 'configurația e doar în running-config'],
            ['banner motd {{ banner }}', 'banner-ul conține caracterul ^C în text'],
          ]} />
          <p>Plan colegului: „aplică pe toate trei deodată, fără verificare, apoi spune echipei că e gata”.</p>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Inventar depășit</b>: SW2 are .20 în realitate, .2 în inventar → scriptul nu ajunge la el (sursa de adevăr greșită).</li>
              <li><b>Drift</b> pe SW3: modificare manuală de urgență, nedocumentată; nimeni nu a comparat realitatea cu intenția.</li>
              <li><b>Variabilă inexistentă / nume greșit</b>: <code>syslog_srv</code> vs <code>syslog_server</code> → șablonul se randează cu o valoare goală sau eșuează.</li>
              <li><b>Lipsa salvării</b>: fără <code>copy running-config startup-config</code> (sau echivalentul), la reload dispare totul.</li>
              <li><b>Lipsa validării înainte</b>: nu s-a făcut un diff sau o randare de probă; greșelile au ajuns direct pe echipamente.</li>
              <li><b>Lipsa lotului-pilot și a verificării după</b>: aplicare pe toate odată, fără verificare automată și fără plan de rollback.</li>
              <li><b>Delimitator banner</b>: textul conține caracterul delimitator, ceea ce poate închide bannerul prematur și strica restul configurației.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <ol>
              <li>Corectează inventarul (SW2 = .20 sau, mai bine, aliniază echipamentul la standard) și păstrează-l în versionare.</li>
              <li>Unifică numele variabilelor (<code>syslog_server</code>) și definește-le în „vars” comune; adaugă o validare care eșuează dacă o variabilă lipsește.</li>
              <li>Adaugă în plan pașii: randare + diff → aplicare pe SW1 (pilot) → verificare → apoi SW2 și SW3 → salvare → verificare finală.</li>
              <li>Pentru SW3: fie readuci NTP la standard, fie, dacă schimbarea manuală e legitimă, o treci în sursa de adevăr (altfel va fi suprascrisă).</li>
              <li>Planifică un rollback (configurația anterioară salvată) și un audit periodic care raportează drift-ul.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>În Packet Tracer, reface topologia, aplică șablonul corectat pe cele trei switch-uri și verifică: IP-urile, <code>show running-config | include ^ntp|^logging</code> și <code>show startup-config | include ^ntp|^logging</code>.</p>
          <Reveal label="Răspuns"><p>Cele trei switch-uri au aceleași linii NTP/logging în running-config și în startup-config; hostname-ul diferă. Dacă un switch diferă, ai găsit un nou drift.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
