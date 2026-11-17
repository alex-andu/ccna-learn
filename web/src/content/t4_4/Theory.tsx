import { Term as G } from '../../components/Term';
import { Analogy, Callout, DeepDive, Detailed, Figure, Summary, Table, Traps } from '../../components/Lesson';
import { InlineQuiz } from '../../components/InlineQuiz';
import { SectionHead } from '../../components/SectionHead';
import { MibTree, SnmpOps, SnmpSecurityLevels } from '../../diagrams/t4_4';

/* ======================================================================
   0. Introducere
   ====================================================================== */
export function Intro() {
  return (
    <section id="intro" className="section">
      <SectionHead id="intro" code="4.4" title="SNMP — imaginea de ansamblu" />
      <Summary>
        <p><G id="snmp" /> este protocolul standard prin care un sistem de management (<b>NMS</b>, manager) <b>monitorizează și, opțional, configurează</b> dispozitivele din rețea (agenți). Managerul interoghează periodic agenții (polling, UDP 161), iar agenții pot trimite singuri notificări (<b>trap</b> / <b>inform</b>, către UDP 162). Datele sunt organizate într-o structură numită <b>MIB</b>, identificată prin <b>OID</b>-uri. Versiunea sigură este <b>SNMPv3</b>.</p>
      </Summary>
      <Detailed>
        <p>Obiectivul oficial 4.4 este <i>Explain the function of SNMP in network operations</i> — tip <b>Explain</b>: trebuie să înțelegi <b>de ce</b> există SNMP, <b>cine face ce</b> (manager, agent, MIB), <b>ce operații</b> există, <b>cum diferă versiunile</b> și ce riscuri aduc community string-urile. Configurarea de bază (community, host de trap, v3) o vei vedea ca exemplu.</p>
        <Table head={['Întrebare', 'Unde e răspunsul']} hlCol={0} rows={[
          ['De ce nu mă conectez pe rând la fiecare router?', 'De ce avem nevoie de SNMP'],
          ['Ce sunt managerul, agentul, MIB și OID?', 'Arhitectura SNMP'],
          ['Ce e polling, ce e trap, ce diferă informul?', 'Operațiile SNMP'],
          ['Cum diferă v1, v2c și v3?', 'Versiuni și securitate'],
        ]} />
        <Analogy>Gândește-te la o clădire cu senzori: un tablou central (NMS) „citește” periodic contoarele de la fiecare senzor (polling) și, în plus, fiecare senzor poate declanșa singur o alarmă la tablou (trap). Lista standard a tuturor contoarelor posibile (MIB) face ca tabloul să înțeleagă senzori de la orice producător.</Analogy>
      </Detailed>
      <Traps items={[
        <>SNMP nu transportă traficul utilizatorilor și nu rutează: este protocolul de <b>management</b>.</>,
        <>SNMP nu este același lucru cu syslog (4.5): syslog trimite mesaje text de la dispozitiv; SNMP expune valori/contoare interogabile și notificări structurate.</>,
        <>Numele „Simple” NU înseamnă „sigur”: v1 și v2c transmit community string-ul în text clar.</>,
      ]} />
      <InlineQuiz ids={['4.4-001', '4.4-002']} />
    </section>
  );
}

/* ======================================================================
   1. De ce SNMP
   ====================================================================== */
export function WhySection() {
  return (
    <section id="why" className="section">
      <SectionHead id="why" code="4.4" title="De ce avem nevoie de SNMP" />
      <Summary>
        <p>O rețea are zeci sau mii de dispozitive. Fără un protocol comun, afli încărcarea unei interfețe, temperatura sau starea unui link doar conectându-te pe fiecare echipament, de mână. SNMP permite unui sistem central să <b>colecteze automat</b>, de la dispozitive de orice producător, aceleași tipuri de date, să construiască grafice, să declanșeze alarme și să observe tendințele.</p>
      </Summary>
      <Detailed title="1. Ce se monitorizează cu SNMP">
        <Table head={['Categorie', 'Exemple de date']} hlCol={0} rows={[
          ['Performanță', 'Utilizare CPU, memorie, trafic pe interfață (octeți in/out), erori, pachete aruncate'],
          ['Disponibilitate', 'Starea interfețelor (up/down), uptime, ventilatoare, surse de alimentare, temperatură'],
          ['Inventar', 'Nume (sysName), descriere (sysDescr), locație și contact, versiune software'],
          ['Evenimente', 'Notificări la căderea unui link, la schimbarea unei configurații, la repornire'],
        ]} />
        <p>Aplicațiile NMS (de exemplu Zabbix, LibreNMS, PRTG, SolarWinds, Cisco Catalyst Center/DNA Center) folosesc SNMP pentru a transforma aceste date în grafice și alerte. La examen nu trebuie să știi produsele, ci rolul SNMP în operarea rețelei.</p>
      </Detailed>
      <Callout kind="exam" title="Cuvinte cheie de examen">
        „Monitorizare și management centralizat”, „NMS”, „agent”, „MIB”, „trap”, „UDP 161/162”, „community string”, „v3 = auth + encryption”.
      </Callout>
      <Traps items={[
        <>SNMP poate și <b>modifica</b> configurația (operația Set), nu doar citi — de aceea accesul read-write trebuie protejat.</>,
        <>Polling frecvent pe mii de dispozitive încarcă CPU-ul și rețeaua; intervalele se aleg cu grijă.</>,
      ]} />
      <InlineQuiz ids={['4.4-003']} />
    </section>
  );
}

/* ======================================================================
   2. Arhitectura
   ====================================================================== */
export function ArchitectureSection() {
  return (
    <section id="architecture" className="section">
      <SectionHead id="architecture" code="4.4" title="Arhitectura SNMP: manager, agent, MIB, OID" />
      <Summary>
        <p>Trei componente: <b>managerul (NMS)</b> — aplicația centrală care interoghează și primește alarme; <b>agentul</b> — procesul din dispozitiv care răspunde și trimite notificări; <b>MIB</b> (Management Information Base) — baza de date ierarhică a obiectelor gestionabile, în care fiecare obiect are un <b>OID</b> unic (un șir de numere, ca o adresă într-un arbore).</p>
      </Summary>
      <Detailed title="1. Cine face ce">
        <Table head={['Componentă', 'Rol', 'Port']} hlCol={0} rows={[
          ['Manager (NMS)', 'Interoghează agenții (Get), modifică valori (Set), primește trap/inform', 'primește pe UDP 162'],
          ['Agent', 'Rulează pe router/switch/server; ține valorile din MIB; răspunde la cereri; trimite notificări', 'ascultă pe UDP 161'],
          ['MIB', 'Schema/ierarhia obiectelor gestionate (ce se poate citi/scrie)', '—'],
          ['OID', 'Identificatorul unui obiect din MIB', '—'],
        ]} />
      </Detailed>
      <Detailed title="2. MIB și OID — arborele de obiecte">
        <p>Obiectele sunt așezate într-un arbore global. Un <b>OID</b> este calea de la rădăcină, cu numere separate prin puncte. Prefixul comun pentru Internet este <code>1.3.6.1</code>. Sub <code>1.3.6.1.2.1</code> (<b>mib-2</b>) sunt obiecte standard, la fel pe orice dispozitiv; sub <code>1.3.6.1.4.1</code> (<b>enterprises</b>) fiecare producător își definește obiectele proprii (Cisco este 9).</p>
        <Figure caption="Arborele MIB: obiecte standard (mib-2) și obiecte de producător (enterprises).">
          <MibTree />
        </Figure>
        <Table head={['Obiect', 'OID', 'Ce arată']} hlCol={0} rows={[
          ['sysDescr', '1.3.6.1.2.1.1.1.0', 'Descrierea dispozitivului (model, versiune)'],
          ['sysName', '1.3.6.1.2.1.1.5.0', 'Numele de gazdă'],
          ['ifInOctets', '1.3.6.1.2.1.2.2.1.10 (+ indexul interfeței)', 'Octeți primiți pe o interfață'],
        ]} />
        <p>Sufixul <code>.0</code> la obiectele scalare indică „instanța unică”; obiectele din tabele (precum interfețele) au ca sufix un index.</p>
      </Detailed>
      <DeepDive title="Ce înseamnă „SNMP” pentru un începător, concret">
        <p>Când un NMS afișează „Gi0/1 — 45 Mb/s intrare”, a făcut Get pe <code>ifInOctets</code> la două momente și a împărțit diferența la timp. Când afișează „link down”, a primit un trap sau a văzut că <code>ifOperStatus</code> a devenit „down” la următorul polling. MIB-ul este contractul care face ca aceste obiecte să existe în același loc pe un router Cisco, un switch HP sau o imprimantă.</p>
      </DeepDive>
      <Traps items={[
        <>Agentul nu este „serverul” NMS-ului: el ascultă pe UDP 161, dar <b>notificările</b> pleacă spre portul 162 al managerului.</>,
        <>Un OID nu e o adresă IP; este un identificator de obiect. Nu-l încurca cu versiunile de protocol.</>,
        <>MIB-ul standard nu conține tot: pentru detalii specifice Cisco se folosesc MIB-uri de producător.</>,
      ]} />
      <InlineQuiz ids={['4.4-004', '4.4-005', '4.4-006']} />
    </section>
  );
}

/* ======================================================================
   3. Operațiile
   ====================================================================== */
export function OperationsSection() {
  return (
    <section id="operations" className="section">
      <SectionHead id="operations" code="4.4" title="Operațiile SNMP: polling, trap și inform" />
      <Summary>
        <p>Managerul inițiază <b>Get</b> (citește), <b>GetNext/GetBulk</b> (parcurge/aduce mai multe) și <b>Set</b> (scrie) — toate pe UDP 161, cu răspuns <b>Response</b>. Agentul inițiază <b>Trap</b> (notificare neconfirmată) și <b>Inform</b> (notificare confirmată), pe UDP 162. Fiecare variantă are rostul ei: polling pentru tendințe, notificări pentru evenimente rapide.</p>
      </Summary>
      <Detailed title="1. Interactiv: alege o operație">
        <Figure caption="Alege o operație și urmărește cine o inițiază, ce port folosește și dacă are confirmare.">
          <SnmpOps />
        </Figure>
        <Table head={['Operație', 'Inițiată de', 'Confirmare?', 'Versiuni']} hlCol={0} rows={[
          ['Get / GetNext', 'Manager', 'Response', 'v1, v2c, v3'],
          ['GetBulk', 'Manager', 'Response', 'v2c, v3'],
          ['Set', 'Manager', 'Response', 'v1, v2c, v3'],
          ['Trap', 'Agent', 'Nu', 'v1, v2c, v3'],
          ['Inform', 'Agent', 'Da (ack de la manager)', 'v2c, v3'],
        ]} />
      </Detailed>
      <Detailed title="2. Polling vs notificări">
        <ul>
          <li><b>Polling</b> (Get periodic): previzibil, bun pentru grafice de tendință; dar un eveniment poate trece neobservat până la următorul sondaj.</li>
          <li><b>Trap/Inform</b>: reacție imediată la evenimente (link down, repornire); dar trap-ul se poate pierde (UDP, fără confirmare). Informul retransmite până primește confirmarea.</li>
          <li>În practică se folosesc <b>ambele</b>: polling pentru metrici, traps pentru alarme.</li>
        </ul>
      </Detailed>
      <Traps items={[
        <>Trap-ul NU este confirmat; informul DA. Este o întrebare clasică de examen.</>,
        <>Inform nu există în SNMPv1.</>,
        <>Un agent „răspunde” la UDP 161, dar „trimite” notificări către UDP 162; nu inversa porturile.</>,
      ]} />
      <InlineQuiz ids={['4.4-007', '4.4-008', '4.4-009']} />
    </section>
  );
}

/* ======================================================================
   4. Versiuni și securitate
   ====================================================================== */
export function VersionsSection() {
  return (
    <section id="versions" className="section">
      <SectionHead id="versions" code="4.4" title="Versiuni și securitate: v1, v2c, v3" />
      <Summary>
        <p><b>SNMPv1</b> și <b>v2c</b> se autentifică doar cu un <b>community string</b> trimis în <b>text clar</b> (o parolă comună, de obicei „RO” pentru citire și „RW” pentru scriere). <b>SNMPv3</b> introduce <b>utilizatori</b>, <b>autentificare</b> și <b>criptare</b> (nivelul <b>authPriv</b>), și este singura versiune considerată sigură. v2c adaugă GetBulk, Inform și contoare pe 64 de biți.</p>
      </Summary>
      <Detailed title="1. Comparația">
        <Table head={['', 'v1', 'v2c', 'v3']} hlCol={0} rows={[
          ['Autentificare', 'community string', 'community string', 'utilizator (USM), cu parolă'],
          ['Criptare', 'nu', 'nu', 'da (opțional: AES/DES)'],
          ['Operații noi', '—', 'GetBulk, Inform, contoare 64 biți', 'ca v2c + model de securitate și acces'],
          ['Securitate', 'foarte slabă', 'slabă', 'bună (authPriv)'],
        ]} />
        <Figure caption="Niveluri de securitate: doar authPriv oferă și autentificare, și criptare.">
          <SnmpSecurityLevels />
        </Figure>
      </Detailed>
      <Detailed title="2. Community strings — de ce sunt un risc">
        <ul>
          <li>Sunt <b>parole simple, trimise în clar</b>: oricine poate captura traficul pe rețea și le poate vedea.</li>
          <li>Valorile implicite sunt cunoscute public (<code>public</code> pentru citire, <code>private</code> pentru scriere); nu le folosi.</li>
          <li>Un community <b>RW</b> permite Set: un atacator poate modifica configurația (de exemplu opri o interfață).</li>
          <li>Măsuri: acces RO unde nu ai nevoie de RW, <b>ACL</b> care limitează cine poate interoga agentul (<code>snmp-server community NUME ro 10</code>), v3 unde este posibil.</li>
        </ul>
      </Detailed>
      <Detailed title="3. Cele trei niveluri de securitate v3">
        <ul>
          <li><b>noAuthNoPriv</b> — doar numele de utilizator, fără autentificare, fără criptare.</li>
          <li><b>authNoPriv</b> — autentificat (parolă, hash MD5/SHA), dar în clar.</li>
          <li><b>authPriv</b> — autentificat <b>și criptat</b> (de exemplu SHA + AES). Recomandat.</li>
        </ul>
        <Callout kind="exam" title="Ce reții">
          Singura versiune care criptează este v3 în modul <b>authPriv</b>. v1 și v2c nu au criptare. Informul există de la v2c. SNMP folosește UDP 161 (agent) și 162 (trap/inform).
        </Callout>
      </Detailed>
      <DeepDive title="Cum arată modelul de acces v3">
        <p>SNMPv3 nu folosește community-uri, ci o ierarhie: <b>user</b> (cu chei de autentificare/criptare) → <b>group</b> (nivelul de securitate cerut) → <b>view</b> (ce porțiuni din MIB sunt vizibile) . Un utilizator este creat într-un grup: <code>snmp-server group G v3 priv</code> + <code>snmp-server user U G v3 auth sha PAROLA1 priv aes 128 PAROLA2</code>. Astfel poți permite unui utilizator doar citirea unei ramuri din MIB și forțezi criptarea pentru acel grup.</p>
      </DeepDive>
      <Traps items={[
        <>„Community-ul” nu e un utilizator: v1/v2c nu au identitate per persoană, doar o parolă comună.</>,
        <>Doar v3 <b>authPriv</b> criptează; v3 <b>authNoPriv</b> autentifică dar nu criptează.</>,
        <>Un community RW lăsat pe „private” este o breșă de securitate majoră.</>,
      ]} />
      <InlineQuiz ids={['4.4-010', '4.4-011', '4.4-012']} />
    </section>
  );
}
