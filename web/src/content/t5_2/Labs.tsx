import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { Step } from '../../components/LabStep';
import { LabGuidedTopology52, LabSoloTopology52 } from '../../diagrams/t5_2';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't52g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 5.2-G" title="Lab ghidat — acces fizic vs acces de rețea: protejează dulapul de rețea" />
      <Summary>
        <p><b>Obiectiv:</b> vezi cum accesul „fizic” (console) ocolește rețeaua, apoi aplici controalele de echipament care întăresc un program de securitate: console protejată, porturi libere închise, banner, jurnalizare. În plus, scrii politica de acces pentru dulapul de rețea. <br /><b>Timp estimat:</b> 35–50 min · <b>Unealtă:</b> Cisco Packet Tracer (1 × router, 1 × switch, 1 × PC cu cablu console, 1 × Server) · <b>Nivel:</b> începător</p>
      </Summary>
      <Figure caption="Topologie: Admin PC conectat la SW1 și R1; serverul syslog primește logurile.">
        <LabGuidedTopology52 />
      </Figure>
      <Table head={['Dispozitiv', 'Interfață', 'IPv4']} rows={[
        ['R1', 'Gi0/0', '192.168.1.1/24'],
        ['SW1', 'SVI VLAN 1', '192.168.1.2/24'],
        ['Admin PC', 'NIC', '192.168.1.100/24'],
        ['Server syslog', 'NIC', '192.168.1.10/24'],
      ]} />
      <Callout kind="info" title="Limite Packet Tracer și avertisment">
        Packet Tracer simulează cablul console (Terminal pe PC), <code>banner</code>, <code>exec-timeout</code>, <code>logging host</code> și <code>shutdown</code>. <b>Nu</b> simulează ușile, badge-urile sau camerele: acelea sunt cerințe ale programului pe care le formulezi în scris. Comenzile <b>nu au fost testate</b> de autorul lecției pe versiunea ta de PT.
      </Callout>

      <Detailed title="Partea 0 — Ocolirea rețelei prin consolă">
        <Step labKey={L} n={1} title="Pornește de la un router fără protecție">
          <p>Configurează adresele din tabel. Pe Admin PC deschide <i>Desktop → Terminal</i> și conectează-te la R1 prin cablu console. Ce ți se cere?</p>
          <Reveal label="Răspuns">
            <p>Nimic: intri direct în modul EXEC (fără parolă pe consolă). Oricine are cablul și acces fizic ajunge aici, fără ca firewall-ul sau ACL-urile să conteze.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Protejează consola">
          <CodeBlock title="R1" kind="config" code={`R1(config)# line console 0
R1(config-line)# password C0nsole!Pass
R1(config-line)# login
R1(config-line)# exec-timeout 5 0`} explain={[
            ['password … / login', 'Cere parolă la consolă.'],
            ['exec-timeout 5 0', 'Sesiunea inactivă se închide după 5 minute.'],
          ]} />
          <p>Deconectează-te și reconectează-te. Ce s-a schimbat? Ce rămâne neprotejat?</p>
          <Reveal label="Răspuns">
            <p>Acum se cere parola. Rămân neprotejate alte căi: VTY, parola enable, porturile libere; și parola apare în clar în <code>show run</code> (5.3).</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 1 — Porturi, banner, jurnalizare">
        <Step labKey={L} n={3} title="Priza liberă">
          <p>Pe SW1 identifică porturile libere (cele fără cablu) și oprește-le. Apoi conectează un PC suplimentar la un port oprit: ce observi?</p>
          <Reveal label="Răspuns">
            <p>Legătura rămâne „down” (portocalie/roșie): fără <code>no shutdown</code>, un vizitator nu primește rețea. Aceasta este varianta tehnică a unui control fizic.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Banner și jurnalizare">
          <p>Adaugă un <code>banner login</code> și <code>logging host 192.168.1.10</code> pe ambele echipamente. Pornește serviciul Syslog pe Server și intră/ieși din modul de configurare pe R1.</p>
          <Reveal label="Răspuns">
            <p>Pe server apar mesaje (de exemplu %SYS-5-CONFIG_I). În programul de securitate, acest jurnal este dovada „cine și când a modificat”.</p>
          </Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Partea scrisă a programului">
        <Step labKey={L} n={5} title="Politica dulapului de rețea">
          <p>Scrie (5–8 rânduri) o politică minimă pentru accesul la dulapul de rețea: cine are acces, cum se autentifică, cum se înregistrează intrările, ce se întâmplă cu vizitatorii, ce se face cu cablul de console.</p>
          <Reveal label="Exemplu de răspuns">
            <ul>
              <li>Acces doar pentru personalul din lista aprobată de șeful IT.</li>
              <li>Ușa se deschide cu badge + PIN; fiecare intrare este înregistrată.</li>
              <li>Vizitatorii (furnizori) intră numai însoțiți și își trec numele în registru.</li>
              <li>Cablurile de console nu rămân conectate; consolele au parolă și timeout.</li>
              <li>Orice modificare de echipament se aprobă și se notează.</li>
              <li>Camera video acoperă ușa; înregistrările se păstrează conform politicii.</li>
            </ul>
          </Reveal>
        </Step>
        <Step labKey={L} n={6} title="Reflecție">
          <p>Răspunde în scris: (1) Care dintre controalele de mai sus sunt preventive și care detective? (2) Ce atac fizic nu e oprit de nicio comandă? (3) Ce element de awareness ai adăuga pentru angajații care au acces la dulap?</p>
          <Reveal label="Indicii">
            <p>(1) Parola de consolă și shutdown sunt preventive; syslog și camerele sunt detective. (2) Furtul echipamentului sau interceptarea unui cablu. (3) Să nu țină ușa deschisă pentru necunoscuți (tailgating) și să raporteze persoanele neînsoțite.</p>
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
  const L = 't52s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 5.2-S" title="Lab solo — auditul unui dulap de rețea" />
      <Summary>
        <p><b>Scenariu:</b> faci o vizită de audit într-o filială. Observațiile tale: dulapul nu e încuiat, un cablu de console e conectat permanent la R1, două prize din sala de ședințe sunt active, nu există registru de vizitatori. Propune remedierile (organizatorice și de configurare). <br /><b>Timp estimat:</b> 30–40 min · <b>Unealtă:</b> Packet Tracer (1 router, 1 switch, 1 PC) · <b>Nivel:</b> intermediar</p>
      </Summary>
      <Figure caption="Topologie solo: Admin PC, SW1, R1 (cablul de console rămâne conectat).">
        <LabSoloTopology52 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        Pentru fiecare observație: tip de control (preventiv/detectiv), cine îl implementează (organizațional/fizic/tehnic) și, unde se poate, comanda IOS. Limite PT și avertisment ca la labul ghidat; comenzile nu au fost testate.
      </Callout>
      <Detailed title="Partea 1 — Remedieri">
        <Step labKey={L} n={1} title="Tabelul de remedieri">
          <Reveal label="Soluție">
            <Table head={['Observație', 'Remediere', 'Tip / responsabil']} rows={[
              ['Dulap neîncuiat', 'Lacăt/ușă cu badge, jurnal de acces', 'Preventiv · fizic/administrativ'],
              ['Cablu de console conectat permanent', 'Scoate cablul; parolă + exec-timeout pe consolă', 'Preventiv · fizic + tehnic'],
              ['Prize active în sala de ședințe', 'shutdown sau port security, rețea de oaspeți', 'Preventiv · tehnic'],
              ['Fără registru de vizitatori', 'Registru, însoțire, badge temporar', 'Preventiv/detectiv · administrativ'],
              ['Fără camere sau jurnale', 'CCTV și logging host', 'Detectiv · fizic/tehnic'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={2} title="Configurează">
          <p>Aplică pe R1 și SW1 partea tehnică (consolă, porturi libere, logging) și verifică cu <code>show running-config</code>.</p>
          <Reveal label="Soluție">
            <CodeBlock title="R1 / SW1" kind="config" code={`R1(config)# line console 0
R1(config-line)# password C0nsole!Pass
R1(config-line)# login
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# logging host 192.168.1.10
SW1(config)# interface range fastEthernet 0/7 - 24
SW1(config-if-range)# shutdown`} explain={[
              ['line console 0 … exec-timeout 5 0', 'Consolă protejată și cu timeout.'],
              ['logging host', 'Jurnalizare spre server.'],
              ['interface range … shutdown', 'Prizele libere sunt oprite.'],
            ]} />
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Instruirea">
          <p>Scrie un mesaj de awareness (3 rânduri) pentru personalul filialei despre ușa dulapului și vizitatori.</p>
          <Reveal label="Exemplu">
            <p>„Ușa dulapului de rețea rămâne încuiată. Nu o ține deschisă pentru nimeni care nu e în listă, chiar dacă pare un tehnician. Însoțește vizitatorii și raportează persoanele necunoscute la recepție sau la IT.”</p>
          </Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
