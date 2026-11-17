import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step, P } from '../../components/LabStep';
import { LabGuidedTopology62, LabSoloTopology62 } from '../../diagrams/t6_2';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't62g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 6.2-G" title="Lab ghidat — aceeași politică: device cu device vs „controller” simulat" />
      <Summary>
        <p><b>Obiectiv:</b> aplici manual o politică (VLAN, NTP, syslog) pe trei switch-uri și măsori efortul; apoi simulezi ideea de <G id="controller-based-networking" /> cu un „inventar + șablon + script de împingere” și compari rezultatele (efort, consecvență, vizibilitate). La final explici cum diferă un controller real de simularea ta. <br /><b>Timp estimat:</b> 40–55 min · <b>Unealtă:</b> Cisco Packet Tracer (router, 3 switch-uri, PC) + editor de text; opțional Python · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: Admin PC → R1 → SW1, SW2, SW3; politica este aceeași pe cele trei switch-uri.">
        <LabGuidedTopology62 />
      </Figure>
      <Table head={['Element', 'Valoare']} rows={[
        ['Admin PC', '10.0.99.10/24'],
        ['R1', 'Gi0/0: 10.0.99.254/24 (gateway de management)'],
        ['SW1–SW3', 'Vlan99: 10.0.99.1–.3/24, gateway 10.0.99.254, SSH activ'],
        ['Politica', 'VLAN 50 „IoT” · ntp server 10.0.0.5 · logging host 10.0.0.6'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer nu include Catalyst Center. Unele versiuni au un dispozitiv „Network Controller” cu API-uri REST simple; dacă îl ai, poți încerca să-l folosești la pasul 8, dar nu e o cerință. „Controllerul” din acest lab este <b>simulat</b> cu fișiere și un script pe calculatorul tău: scopul este să simți diferența de model, nu să reproduci un produs. Pașii sunt ilustrativi și nu au fost testați de autorul lecției; serverele 10.0.0.5/.6 nu există în topologie (NTP nu se va sincroniza).
      </Callout>

      <Detailed title="Partea 1 — Modelul tradițional (cronometrează)">
        <Step labKey={L} n={1} title="Pregătirea accesului">
          <p>Configurează Vlan99 și SSH pe cele trei switch-uri (domain-name, cheie RSA, <code>username</code>, <code>transport input ssh</code>) și verifică <code>ping 10.0.99.1</code> de pe Admin PC.</p>
          <Reveal label="Verificare"><p>Din Admin PC, <P>Desktop → Command Prompt</P>: <code>ssh -l netadmin 10.0.99.1</code> trebuie să deschidă o sesiune.</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Aplică manual pe SW1, SW2, SW3">
          <p>Pe fiecare switch tastează cele șapte comenzi ale politicii (VLAN 50 + nume, NTP, logging host, logging trap, salvare). Notează timpul pentru primul switch și extrapolează la 100 de switch-uri.</p>
          <Reveal label="Întrebare"><p>Ce greșeli ai fi putut face? Cum afli, fără să verifici fiecare echipament, dacă toate sunt la fel?</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Verificare manuală">
          <p>Pe fiecare switch rulează <code>show vlan brief | include 50</code> și <code>show running-config | include ^ntp|^logging</code>. Compară rezultatele între ele.</p>
          <Reveal label="Răspuns"><p>Trebuie să fie identice (în afară de hostname). Efortul de verificare crește liniar cu numărul de echipamente — la fel și riscul de a omite unul.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — „Controller” simulat">
        <Step labKey={L} n={4} title="Scrie intenția">
          <p>Într-un fișier de text (<code>intent.json</code> sau YAML) descrie politica: VLAN-ul, serverele, lista switch-urilor. Ce lipsește din acest fișier față de comenzile CLI?</p>
          <Reveal label="Răspuns"><p>Nu conține comenzile IOS: conține <i>ce</i> vrei. Transformarea în comenzi (și în comenzile potrivite fiecărei platforme) este rolul controller-ului.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Generează și împinge">
          <p>Șterge politica de pe SW2 (<code>no vlan 50</code>, <code>no ntp server 10.0.0.5</code>, <code>no logging host 10.0.0.6</code>). Apoi, cu un script (sau manual, dar pornind din fișierul de intenție), regenerează configurația pentru cele trei switch-uri și aplic-o. Ce rol are verificarea în acest pas?</p>
          <Reveal label="Răspuns"><p>Un controller nu doar „împinge”: compară starea reală cu intenția. Verificarea îți spune că SW2 era neconform și că acum este.</p></Reveal>
        </Step>
        <Step labKey={L} n={6} title="Raport de conformitate">
          <p>Construiește un „raport” simplu (tabel): pentru fiecare switch — VLAN 50 prezent? NTP corect? syslog corect? Marchează manual un switch cu o abatere (de exemplu schimbă NTP pe SW3) și observă cum apare în raport.</p>
          <Reveal label="Întrebare"><p>Cum se numește această situație (6.1)? Cum o prinde un controller fără să tastezi tu show-urile?</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Simulează căderea controller-ului">
          <p>Închide editorul/script-ul („controller-ul”). Se oprește rețeaua? Merge ping între PC-uri (dacă adaugi două PC-uri în VLAN 50)? Ce nu mai poți face?</p>
          <Reveal label="Răspuns"><p>Rețeaua continuă să forward-eze: data plane-ul și configurația locală rămân. Nu mai poți aplica politici centralizat sau vedea conformitatea până revine controller-ul.</p></Reveal>
        </Step>
        <Step labKey={L} n={8} title="Reflecție">
          <p>Completează tabelul: pentru efort, consecvență, vizibilitate, risc și autonomie, care model câștigă? Ce lipsește „controller-ului” tău simulat față de unul real (hint: API-uri northbound, GUI, assurance, politici de intenție, redundanță)?</p>
          <Reveal label="Indicii"><p>Efort: controller. Consecvență: controller. Vizibilitate: controller. Autonomie la căderea managementului: ambele continuă să forward-eze, dar tradiționalul nu depinde deloc de un sistem central. Controller-ul real adaugă API-uri documentate, GUI, assurance, politici de intenție, redundanță, RBAC.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't62s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 6.2-S" title="Lab solo — alege modelul potrivit și găsește abaterile" />
      <Summary>
        <p><b>Scenariu:</b> o companie are trei cerințe diferite (o filială mică, un campus mare, o rețea de 80 de magazine). Pentru fiecare trebuie să alegi modelul (tradițional, controller sau hibrid) și să justifici. Apoi primești rezultatul unui audit al trei switch-uri și trebuie să găsești abaterile (drift) față de politică. <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> analiză pe hârtie + Packet Tracer pentru partea 2 (opțional) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: „controller” conceptual (script + inventar) și trei switch-uri.">
        <LabSoloTopology62 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final ai: o recomandare argumentată pentru fiecare scenariu și o listă de abateri cu remedierea lor. Pașii sunt ilustrativi, nu au fost testați de autorul lecției; nu există un răspuns „unic” — contează argumentele.
      </Callout>
      <Detailed title="Partea 1 — Alege modelul">
        <Step labKey={L} n={1} title="Trei scenarii">
          <Table head={['Scenariu', 'Detalii']} rows={[
            ['A — Filială mică', '1 router, 2 switch-uri, 15 utilizatori; modificări rare; un singur inginer part-time'],
            ['B — Campus mare', '300 switch-uri, 600 AP-uri, segmentare pe utilizatori și dispozitive IoT, audituri frecvente'],
            ['C — 80 de magazine', 'Echipament identic în fiecare magazin; personal IT central mic; deschideri de magazine noi lunar'],
          ]} />
          <Reveal label="Soluție orientativă">
            <ul>
              <li><b>A</b>: tradițional (sau cloud-managed simplu): costul și complexitatea controller-ului nu se justifică; documentare și backup-uri.</li>
              <li><b>B</b>: controller (de tip Catalyst Center) + automatizare: scară, politici de segmentare, conformitate, assurance.</li>
              <li><b>C</b>: controller/cloud-managed sau SD-WAN, cu ZTP: echipament uniform, deschideri frecvente, administrare centrală.</li>
            </ul>
            <p>Răspunsurile bune explică <i>de ce</i>: scară, dinamica schimbărilor, competențe, cost.</p>
          </Reveal>
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Auditul unei rețele">
        <Step labKey={L} n={2} title="Citește raportul de audit">
          <Table head={['Echipament', 'VLAN 50', 'NTP', 'Syslog', 'SSH version', 'Salvat (startup = running)']} rows={[
            ['SW1', 'da', '10.0.0.5', '10.0.0.6', '2', 'da'],
            ['SW2', 'nu', '10.0.0.5', '10.0.0.6', '2', 'da'],
            ['SW3', 'da', '10.0.0.99', '10.0.0.6', '1.99', 'nu'],
          ]} />
          <p>Găsește toate abaterile și spune, pentru fiecare, ce tip de problemă este (drift, politică incompletă, configurație nesalvată) și cum ar preveni-o un model bazat pe controller.</p>
        </Step>
        <Step labKey={L} n={3} title="Remediază">
          <Reveal label="Soluție">
            <ol>
              <li><b>SW2 fără VLAN 50</b>: politică incompletă (echipament omis sau în reload la momentul aplicării) → un controller ar raporta neconformitatea și ar reîncerca.</li>
              <li><b>SW3 cu NTP greșit</b>: drift (modificare manuală) → controller-ul/audit-ul o semnalează; corectezi echipamentul sau actualizezi intenția.</li>
              <li><b>SW3 cu SSH 1.99</b>: acceptă și versiunea 1 (nesigur) → standardul cere <code>ip ssh version 2</code>.</li>
              <li><b>SW3 nesalvat</b>: running-config ≠ startup-config → la reload pierde modificările; salvezi și adaugi salvarea în procedura automatizată.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final (opțional, în Packet Tracer)">
          <p>Reproduce SW2 și SW3 în Packet Tracer cu defectele de mai sus, apoi corectează-le și verifică <code>show vlan brief</code>, <code>show ip ssh</code>, <code>show ntp associations</code> (dacă e disponibil) și <code>show startup-config</code>.</p>
          <Reveal label="Răspuns"><p>După corecții, toate cele trei switch-uri au VLAN 50, NTP 10.0.0.5, SSH 2.0 și startup-config actualizat.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
