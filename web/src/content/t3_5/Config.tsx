import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="3.5" title="Exemple de configurare și verificare (HSRP)" />
      <Summary>
        <p>Obiectivul 3.5 este de tip <b>Describe</b>, dar HSRP are o configurare scurtă care clarifică toate conceptele: <code>standby &lt;grup&gt; ip</code>, <code>priority</code>, <code>preempt</code>, opțional <code>track</code> și <code>version 2</code>. Verifici cu <code>show standby brief</code> și <code>show standby</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente. Formatul coloanelor, mesajele din log și comenzile disponibile (de exemplu <code>standby version 2</code> și <code>track</code>) variază între IOS, IOS XE și Packet Tracer.
      </Callout>

      <Detailed title="Scenariul — două routere, un LAN, un uplink">
        <p>PC1 și PC2 sunt în LAN-ul 192.168.10.0/24, conectat printr-un switch la R1 și R2. Ambele routere ajung la R3 (destinația). Adresa virtuală HSRP este 192.168.10.254, iar gazdele o folosesc ca gateway.</p>
        <Table head={['Router', 'Interfață', 'IP real', 'Rol HSRP dorit']} rows={[
          ['R1', 'Gi0/0', '192.168.10.1/24', 'Active (priority 110)'],
          ['R2', 'Gi0/0', '192.168.10.2/24', 'Standby (priority 100, implicit)'],
          ['Ambele', '—', 'Virtual 192.168.10.254', 'Grup 1'],
        ]} />
        <CodeBlock title="R1 (ilustrativ)" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# standby 1 ip 192.168.10.254
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt
R1(config-if)# no shutdown`} explain={[
          ['ip address 192.168.10.1 …', 'Adresa reală a interfeței; nu este adresa folosită de gazde.'],
          ['standby 1 ip 192.168.10.254', 'Grupul 1 și adresa virtuală, în aceeași subrețea cu adresa reală.'],
          ['standby 1 priority 110', 'Mai mare decât implicitul 100: R1 devine Active.'],
          ['standby 1 preempt', 'R1 își recapătă rolul Active după o cădere și revenire.'],
        ]} />
        <CodeBlock title="R2 (ilustrativ)" kind="config" code={`R2(config)# interface g0/0
R2(config-if)# ip address 192.168.10.2 255.255.255.0
R2(config-if)# standby 1 ip 192.168.10.254
R2(config-if)# no shutdown`} explain={[
          ['standby 1 ip 192.168.10.254', 'Același grup și aceeași adresă virtuală ca pe R1.'],
          ['(fără priority)', 'Rămâne la implicitul 100, mai mic decât 110: R2 devine Standby.'],
        ]} />
        <Callout kind="info" title="Opțional: versiunea 2">
          <code>standby version 2</code> (pe interfață) trebuie setată identic pe ambele routere și înainte de a depinde de grupuri peste 255 sau de IPv6. Un mismatch de versiune poate lăsa ambele routere Active.
        </Callout>
      </Detailed>

      <Detailed title="Verificarea">
        <CodeBlock title="R1 — show standby brief (ilustrativ)" kind="session" code={`R1# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0       1    110 P Active  local           192.168.10.2    192.168.10.254`} explain={[
          ['Grp', 'Numărul grupului HSRP (1).'],
          ['Pri / P', 'Prioritatea (110) și P = preempt configurat.'],
          ['State', 'Starea locală: Active.'],
          ['Active / Standby', '„local” = routerul pe care rulezi; celălalt arată adresa reală a vecinului.'],
          ['Virtual IP', 'Adresa pe care o folosesc gazdele ca gateway.'],
        ]} />
        <CodeBlock title="R2 — show standby (ilustrativ, fragment)" kind="session" code={`R2# show standby
GigabitEthernet0/0 - Group 1
  State is Standby
  Virtual IP address is 192.168.10.254
  Active virtual MAC address is 0000.0c07.ac01
  Hello time 3 sec, hold time 10 sec
  Preemption disabled
  Active router is 192.168.10.1, priority 110
  Standby router is local
  Priority 100 (default 100)`} explain={[
          ['State is Standby', 'R2 este de rezervă.'],
          ['Active virtual MAC … ac01', 'MAC-ul virtual pentru grupul 1 la HSRPv1 (AC + grupul în hexazecimal).'],
          ['Hello 3 / hold 10', 'Timerele implicite.'],
          ['Preemption disabled', 'Implicit pe R2, deoarece nu am configurat preempt.'],
          ['Active router is 192.168.10.1', 'Adresa reală a lui R1.'],
        ]} />
        <CodeBlock title="Tracking (ilustrativ)" kind="config" code={`R1(config)# interface g0/0
R1(config-if)# standby 1 track GigabitEthernet0/1 20

R2(config)# interface g0/0
R2(config-if)# standby 1 preempt`} explain={[
          ['standby 1 track GigabitEthernet0/1 20', 'Dacă Gi0/1 (uplinkul) cade, prioritatea lui R1 scade cu 20 (110 → 90).'],
          ['standby 1 preempt (pe R2)', 'Fără el, R2 nu preia rolul când prioritatea lui R1 scade sub 100.'],
        ]} />
        <Callout kind="info" title="Output ilustrativ">
          Pentru <code>track</code> sintaxa depinde de versiune (pe unele platforme se folosește un obiect de tracking). Pentru examen, reține scopul: scade prioritatea la pierderea uplinkului.
        </Callout>
      </Detailed>

      <Detailed title="Erori tipice: simptom → cauză → verificare">
        <Table head={['Simptom', 'Cauză probabilă', 'Verifici cu']} rows={[
          ['Ambele routere sunt Active', 'Versiune HSRP diferită, grup diferit, sau Hello-urile nu trec între routere', 'show standby brief pe ambele, show standby (version)'],
          ['Gazdele nu au gateway', 'Adresa virtuală lipsește pe un router, sau gazdele folosesc adresa reală', 'show standby, configurația gazdei'],
          ['R1 (priority 110) nu preia după revenire', 'Preempt dezactivat (implicit)', 'show standby (Preemption disabled)'],
          ['Tracking nu mută rolul', 'Routerul de rezervă nu are preempt, sau decrementul e prea mic', 'show standby, prioritatea efectivă'],
          ['Conflict de IP pe .254', 'Adresa virtuală e folosită și de un alt dispozitiv', 'arp -a pe gazdă, show standby'],
          ['Failover lent', 'Timere implicite (hold 10 s)', 'show standby (Hello/hold); standby 1 timers'],
        ]} />
        <Reveal label="De ce preempt trebuie activat și pe routerul de rezervă?">
          <p>Un Active care încă trimite Hello-uri nu este înlocuit fără preempt, chiar dacă prioritatea lui a scăzut. Pentru ca tracking-ul să aibă efect, routerul cu prioritatea acum mai mare trebuie să aibă voie să preia rolul, deci să aibă preempt.</p>
        </Reveal>
      </Detailed>

      <Traps items={[
        <>Adresa virtuală nu se configurează cu <code>ip address</code>, ci cu <code>standby &lt;grup&gt; ip</code>.</>,
        <>Comanda este <code>standby</code>, nu <code>hsrp</code>.</>,
        <>Preempt este dezactivat implicit; fără el, prioritatea mai mare nu mută rolul.</>,
        <>Același grup, aceeași adresă virtuală și aceeași versiune pe toate routerele.</>,
        <>Gazdele folosesc adresa virtuală, nu adresa reală a routerului Active.</>,
      ]} />
      <InlineQuiz ids={['3.5-037', '3.5-038', '3.5-039', '3.5-040']} />
    </section>
  );
}
