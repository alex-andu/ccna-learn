import { Term as G } from '../../components/Term';
import { Callout, Detailed, Figure, Reveal, Summary, Table } from '../../components/Lesson';
import { SectionHead } from '../../components/SectionHead';
import { Step, P } from '../../components/LabStep';
import { LabGuidedTopology64, LabSoloTopology64 } from '../../diagrams/t6_4';

/* ======================================================================
   LAB GHIDAT
   ====================================================================== */
export function GuidedLab() {
  const L = 't64g';
  return (
    <section id="lab-guided" className="section">
      <SectionHead id="lab-guided" code="LAB 6.4-G" title="Lab ghidat — baseline manual și revizuirea unei configurații generate de AI" />
      <Summary>
        <p><b>Obiectiv:</b> (1) calculezi un baseline simplu și decizi ce valori sunt anomalii (<G id="anomaly-detection" />), observând compromisul sensibilității; (2) primești o configurație „generată de un asistent AI”, o testezi în Packet Tracer, găsești defectele și o corectezi, ca să înțelegi de ce <G id="ai-hallucination" /> și greșelile subtile cer validare. <br /><b>Timp estimat:</b> 45–60 min · <b>Unealtă:</b> Cisco Packet Tracer (router, switch, 2 PC-uri) + calculator/foaie de calcul · <b>Nivel:</b> începător–intermediar</p>
      </Summary>
      <Figure caption="Topologie: R1 (router-on-a-stick), SW1 și două PC-uri în VLAN 10 / VLAN 20.">
        <LabGuidedTopology64 />
      </Figure>
      <Table head={['Element', 'Valoare']} rows={[
        ['VLAN 10 / PC1', '192.168.10.0/24 — PC1 192.168.10.10, gateway 192.168.10.1'],
        ['VLAN 20 / PC2', '192.168.20.0/24 — PC2 192.168.20.10, gateway 192.168.20.1'],
        ['R1 Gi0/0', 'trunk către SW1; sub-interfețe .10 și .20'],
        ['Cerință', 'VLAN 20 nu are voie spre VLAN 10, cu excepția ping-ului (ICMP)'],
      ]} />
      <Callout kind="info" title="Limite și avertisment">
        Laboratorul nu cere acces la un asistent AI: configurația „generată” este dată în text. Dacă folosești un asistent real, folosește doar unul aprobat de tine/companie și <b>nu</b> îi trimite parole sau date confidențiale. Packet Tracer nu simulează telemetrie model-driven sau AI; validarea se face cu ping și <code>show</code>. Pașii sunt ilustrativi și nu au fost testați de autorul lecției.
      </Callout>

      <Detailed title="Partea 1 — Baseline și anomalii (predictiv)">
        <Step labKey={L} n={1} title="Calculează baseline-ul">
          <p>Utilizarea unei legături la ora 10:00, în 13 zile lucrătoare: <code>42, 45, 41, 44, 43, 46, 40, 43, 44, 42, 45, 41, 43</code> (%). Calculează media și abaterea standard (cu calculator sau foaie de calcul: <code>AVERAGE</code>, <code>STDEV.P</code>).</p>
          <Reveal label="Răspuns"><p>Media = 43,0%; abaterea standard (populație) ≈ 1,7 puncte procentuale. Baseline-ul pentru ora 10:00 este deci ≈ 43 ± 1,7.</p></Reveal>
        </Step>
        <Step labKey={L} n={2} title="Testează valori noi">
          <p>Astăzi, la 10:00, citești pe rând: <code>47</code>, <code>52</code>, <code>88</code>, <code>36</code>. Cu o bandă de 3σ (media ± 3 × abaterea), care sunt anomalii? Dar cu 5σ?</p>
          <Reveal label="Răspuns"><p>3σ → bandă ≈ 37,9–48,1: 47 este normal; 52, 88 și 36 sunt anomalii. 5σ → bandă ≈ 34,5–51,5: doar 52 (la limită) și 88 sunt anomalii; 36 trece neobservat. Lecție: sensibilitatea mai mică lasă să treacă abateri reale; una prea mare produce alarme false.</p></Reveal>
        </Step>
        <Step labKey={L} n={3} title="Interpretare">
          <p>88% este o anomalie. Spune ce ai verifica înainte să o numești „problemă” (trei lucruri).</p>
          <Reveal label="Indicii"><p>Eveniment legitim (backup, actualizare de masă)? Echipament nou sau schimbare de configurație? Încă un semnal (erori, latență, pierderi) care confirmă? Un model ajută, dar contextul decide.</p></Reveal>
        </Step>
      </Detailed>

      <Detailed title="Partea 2 — Configurația „generată de AI”">
        <Step labKey={L} n={4} title="Pregătește topologia">
          <p>Configurează SW1 (VLAN 10 și 20, porturi de acces pentru PC-uri, trunk spre R1) și PC-urile cu adresele din tabel. Pe R1 <b>nu</b> configura încă nimic.</p>
        </Step>
        <Step labKey={L} n={5} title="Aplică configurația primită">
          <p>Lipește pe R1 (<P>CLI → global config</P>) configurația următoare, „produsă de un asistent” pentru cerința din tabel:</p>
          <Table head={['Comenzi pe R1 (de la asistent)']} rows={[
            [<code>interface gigabitethernet 0/0.10</code>],
            [<code>&nbsp;encapsulation dot1q 10</code>],
            [<code>&nbsp;ip address 192.168.10.1 255.255.255.0</code>],
            [<code>&nbsp;ip access-group BLOCK-20-TO-10 out</code>],
            [<code>interface gigabitethernet 0/0.20</code>],
            [<code>&nbsp;encapsulation dot1q 20</code>],
            [<code>&nbsp;ip address 192.168.20.1 255.255.255.0</code>],
            [<code>ip access-list extended BLOCK-20-TO-10</code>],
            [<code>&nbsp;permit ip any any</code>],
            [<code>&nbsp;deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255</code>],
          ]} />
        </Step>
        <Step labKey={L} n={6} title="Testează cerința">
          <p>De pe PC2 fă ping către PC1 și către gateway-ul 192.168.10.1; încearcă și un acces TCP (de exemplu, un server HTTP pe PC1 dacă îl ai). Ce observi?</p>
          <Reveal label="Răspuns"><p>Nimic nu funcționează: sub-interfețele nu răspund pentru că Gi0/0 este oprită (<code>show ip interface brief</code> → administratively down). Chiar după activarea ei, ACL-ul va lăsa să treacă tot traficul, pentru că primul <code>permit ip any any</code> prinde tot.</p></Reveal>
        </Step>
        <Step labKey={L} n={7} title="Găsește defectele">
          <p>Folosește <code>show ip interface brief</code>, <code>show access-lists</code> și <code>show ip interface gigabitethernet 0/0.10</code>. Listează cel puțin trei defecte față de cerință.</p>
          <Reveal label="Cauze">
            <ol>
              <li>Interfața fizică Gi0/0 nu are <code>no shutdown</code>.</li>
              <li><code>permit ip any any</code> este prima regulă: nu mai ajunge nimic la <code>deny</code> (contoare 0 la deny).</li>
              <li>Lipsește excepția ICMP cerută („în afară de ping”).</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={8} title="Corectează și retestează">
          <Reveal label="Soluție">
            <p>Pe R1: <code>interface gigabitethernet 0/0</code> → <code>no shutdown</code>. Reconstruiește ACL-ul în ordinea: <code>permit icmp 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255</code>, <code>deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255</code>, <code>permit ip any any</code> (șterge-l și recreează-l, sau folosește numere de secvență). Retestează: ping de pe PC2 către PC1 reușește (ICMP), accesul TCP este blocat; <code>show access-lists</code> arată contoarele pe prima și a doua regulă.</p>
          </Reveal>
        </Step>
        <Step labKey={L} n={9} title="Reflecție">
          <p>Răspunde în scris: (1) De ce ar fi periculos să aplici configurația generată direct în producție? (2) Ce proces ai urma? (3) Ce nu ar trebui să trimiți niciodată într-un prompt?</p>
          <Reveal label="Indicii"><p>(1) Părea corectă, dar ordinea regulilor și interfața oprită ar fi lăsat rețeaua nesecurizată sau nefuncțională. (2) Revizuire, test în laborator, change cu rollback, verificare după. (3) Parole, chei, topologii/date confidențiale, date personale.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}

/* ======================================================================
   LAB SOLO
   ====================================================================== */
export function SoloLab() {
  const L = 't64s';
  return (
    <section id="lab-solo" className="section">
      <SectionHead id="lab-solo" code="LAB 6.4-S" title="Lab solo — verifică ACL-ul „generat” pentru DMZ" />
      <Summary>
        <p><b>Scenariu:</b> un asistent generativ a produs un ACL pentru DMZ, iar colegul l-a lipit pe R1 fără test. Cerințe: LAN-ul 192.168.10.0/24 are voie la serverul web 172.16.0.10 (TCP 80 și 443) și <b>nu</b> la serverul DB 172.16.0.21. Găsește cel puțin <b>cinci</b> probleme și corectează-le. <br /><b>Timp estimat:</b> 35–45 min · <b>Unealtă:</b> Packet Tracer · <b>Nivel:</b> intermediar–avansat</p>
      </Summary>
      <Figure caption="Topologie solo: LAN, R1, switch DMZ, server web și server DB.">
        <LabSoloTopology64 />
      </Figure>
      <Callout kind="info" title="Cerințe">
        La final: LAN → web (80/443) reușește, LAN → DB eșuează, ping către gateway-ul LAN continuă să meargă, iar <code>show access-lists</code> arată contoare la regulile potrivite. Pașii nu au fost testați de autorul lecției; tratează textul „generat” ca pe un draft.
      </Callout>
      <Detailed title="Partea 1 — Configurația primită">
        <Step labKey={L} n={1} title="Citește configurația">
          <Table head={['Element', 'Valoare primită']} rows={[
            ['R1 Gi0/0 (LAN)', '192.168.10.1/24, no shutdown, ip access-group LAN-TO-DMZ out'],
            ['R1 Gi0/1 (DMZ)', '172.16.0.1/24, shutdown (implicit)'],
            ['ACL LAN-TO-DMZ', '10 permit tcp 192.168.10.0 0.0.0.255 host 172.16.0.10 eq 80 · 20 permit tcp 192.168.10.0 255.255.255.0 host 172.16.0.10 eq 443 · 30 deny ip any host 172.16.0.20 · 40 permit ip any any'],
            ['Servere reale', 'Web 172.16.0.10 · DB 172.16.0.21'],
          ]} />
        </Step>
      </Detailed>
      <Detailed title="Partea 2 — Diagnostic și remediere">
        <Step labKey={L} n={2} title="Găsește defectele">
          <Reveal label="Cauze">
            <ol>
              <li><b>Gi0/1 (DMZ) este oprită</b>: nu are <code>no shutdown</code> — niciun trafic nu ajunge în DMZ.</li>
              <li><b>Regula 20 folosește mască normală (255.255.255.0) în loc de wildcard (0.0.0.255)</b>: nu potrivește rețeaua dorită.</li>
              <li><b>ACL-ul este aplicat pe Gi0/0 în direcția out</b>: filtrează traficul care iese <i>spre</i> LAN, nu pe cel care vine din LAN spre DMZ; direcția corectă este <code>in</code> pe Gi0/0 (sau <code>out</code> pe Gi0/1).</li>
              <li><b>Regula 30 interzice 172.16.0.20</b>, dar serverul DB este .21 (greșeală de adresă): DB-ul rămâne accesibil.</li>
              <li><b>Regula 40 (<code>permit ip any any</code>) este prea permisivă</b>: orice alt trafic din LAN către DMZ este permis; principiul privilegiului minim cere doar ce e necesar.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={3} title="Corectează">
          <Reveal label="Soluție">
            <ol>
              <li><code>interface gigabitethernet 0/1</code> → <code>no shutdown</code>.</li>
              <li>Recreează ACL-ul: <code>permit tcp 192.168.10.0 0.0.0.255 host 172.16.0.10 eq 80</code>, <code>permit tcp 192.168.10.0 0.0.0.255 host 172.16.0.10 eq 443</code>, <code>deny ip any host 172.16.0.21</code>, apoi un <code>permit</code> doar pentru ce e necesar (de exemplu către Internet), nu <code>any any</code> către DMZ.</li>
              <li>Mută aplicarea: pe Gi0/0 <code>ip access-group LAN-TO-DMZ in</code> (după <code>no ip access-group … out</code>).</li>
              <li>Documentează fiecare regulă (<code>remark</code>) și verifică după fiecare modificare.</li>
            </ol>
          </Reveal>
        </Step>
        <Step labKey={L} n={4} title="Test final">
          <p>Din LAN: accesează serverul web pe portul 80/443 (reușește) și serverul DB (eșuează); verifică <code>show access-lists LAN-TO-DMZ</code> și <code>show ip interface gigabitethernet 0/0</code>.</p>
          <Reveal label="Răspuns"><p>Contoarele cresc pe regulile 80/443 pentru web și pe <code>deny … 172.16.0.21</code> pentru DB; <code>show ip interface</code> arată „Inbound access list is LAN-TO-DMZ”. Dacă unul dintre teste eșuează, verifică ordinea regulilor și direcția.</p></Reveal>
        </Step>
        <Step labKey={L} n={5} title="Reflecție">
          <p>Notează în 4–5 rânduri ce ai schimba în procesul echipei ca astfel de configurații să nu ajungă netestate în producție.</p>
          <Reveal label="Indicii"><p>Revizuire de către un al doilea inginer, test în laborator/automat (verificări „ar trebui să meargă/să fie blocat”), proces de change cu rollback, politică despre ce unelte AI sunt permise, verificare după aplicare.</p></Reveal>
        </Step>
      </Detailed>
    </section>
  );
}
