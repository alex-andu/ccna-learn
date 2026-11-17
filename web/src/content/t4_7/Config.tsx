import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="4.7" title="Exemple de configurare MQC (orientare) și verificare" />
      <Summary>
        <p>Obiectivul 4.7 este de tip <b>Explain</b>, deci configurarea nu se cere la examen, dar a vedea comenzile ajută. Pe IOS, QoS se scrie cu <b>MQC</b>: <code>class-map</code> (clasifică) → <code>policy-map</code> (acționează: marchează, prioritizează, limitează) → <code>service-policy</code> (aplică pe interfață, <code>input</code> sau <code>output</code>). Verifici cu <code>show policy-map interface</code>.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Exemplele sunt <b>ilustrative</b>, nu capturi de pe echipamente reale. Comenzile <b>nu au fost testate</b> de autorul lecției; sintaxa (<code>police</code>, <code>shape</code>, <code>priority</code>, <code>random-detect</code>), opțiunile disponibile și ieșirile diferă între IOS, IOS XE, platforme (routere vs switch-uri Catalyst) și Packet Tracer, care acceptă doar o parte din MQC.
      </Callout>

      <Detailed title="1. Clasificare și marcare la intrare (R1, interfața dinspre LAN)">
        <CodeBlock title="R1 — clasificare + marcare (ilustrativ)" kind="config" code={`R1(config)# access-list 101 permit udp any any range 16384 32767
R1(config)# class-map match-all VOICE-IN
R1(config-cmap)# match access-group 101
R1(config-cmap)# exit
R1(config)# policy-map MARK-IN
R1(config-pmap)# class VOICE-IN
R1(config-pmap-c)# set dscp ef
R1(config-pmap-c)# class class-default
R1(config-pmap-c)# set dscp default
R1(config-pmap-c)# exit
R1(config-pmap)# exit
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# service-policy input MARK-IN`} explain={[
          ['access-list 101 permit udp any any range 16384 32767', 'Interval UDP uzual pentru media RTP (voce); doar un exemplu, ajustează la rețeaua ta.'],
          ['class-map match-all VOICE-IN', 'Clasa „voce”: match-all = toate condițiile trebuie îndeplinite.'],
          ['match access-group 101', 'Criteriul de clasificare: pachetele permise de ACL-ul 101.'],
          ['policy-map MARK-IN', 'Politica: ce facem cu fiecare clasă.'],
          ['class VOICE-IN → set dscp ef', 'Marchează vocea cu DSCP 46 (EF).'],
          ['class class-default → set dscp default', 'Tot restul se marchează cu DSCP 0 (best effort).'],
          ['service-policy input MARK-IN', 'Aplică politica pe traficul care intră pe Gi0/1.'],
        ]} />
        <Callout kind="tip" title="Pe switch-ul de acces: trust boundary">
          Pe multe switch-uri Catalyst, trust boundary se configurează cu comenzi precum <code>mls qos trust device cisco-phone</code> sau <code>mls qos trust dscp</code> (sau, pe platforme noi, cu AutoQoS / politici MQC). Comenzile diferă între platforme — verifică documentația modelului tău.
        </Callout>
      </Detailed>

      <Detailed title="2. Cozi la ieșire: LLQ + CBWFQ + evitarea congestiei">
        <CodeBlock title="R1 — politică de ieșire spre WAN (ilustrativ)" kind="config" code={`R1(config)# class-map match-all VOICE
R1(config-cmap)# match dscp ef
R1(config)# class-map match-all CRITICAL
R1(config-cmap)# match dscp af31
R1(config)# policy-map WAN-OUT
R1(config-pmap)# class VOICE
R1(config-pmap-c)# priority percent 20
R1(config-pmap-c)# class CRITICAL
R1(config-pmap-c)# bandwidth percent 30
R1(config-pmap-c)# class class-default
R1(config-pmap-c)# fair-queue
R1(config-pmap-c)# random-detect
R1(config-pmap-c)# exit
R1(config-pmap)# exit
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# service-policy output WAN-OUT`} explain={[
          ['match dscp ef', 'Clasifică după marcajul deja pus la intrare (se bazează pe PHB, nu pe port).'],
          ['priority percent 20', 'LLQ: coadă prioritară strictă pentru voce, limitată la 20% din bandă (policed în congestie).'],
          ['bandwidth percent 30', 'CBWFQ: clasa CRITICAL are garantat 30% din bandă.'],
          ['fair-queue', 'Tot restul (class-default) împarte banda rămasă echitabil, per flux.'],
          ['random-detect', 'WRED pe clasa implicită: drop timpuriu și aleatoriu, împotriva sincronizării TCP.'],
          ['service-policy output WAN-OUT', 'Aplică politica pe traficul care iese spre WAN: cozile contează doar la ieșire.'],
        ]} />
      </Detailed>

      <Detailed title="3. Shaping și policing">
        <CodeBlock title="R1 — shaping către rata contractată + policing pentru bulk (ilustrativ)" kind="config" code={`R1(config)# policy-map SHAPE-WAN
R1(config-pmap)# class class-default
R1(config-pmap-c)# shape average 2000000
R1(config-pmap-c)# service-policy WAN-OUT
R1(config-pmap-c)# exit
R1(config-pmap)# exit
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# service-policy output SHAPE-WAN
R1(config-if)# exit
R1(config)# policy-map LIMIT-BULK
R1(config-pmap)# class BULK
R1(config-pmap-c)# police 500000 conform-action transmit exceed-action drop`} explain={[
          ['shape average 2000000', 'Shaping la ≈2 Mb/s (rată medie): excesul este amânat în buffer.'],
          ['service-policy WAN-OUT (în clasă)', 'Politică ierarhică: shaper-ul părinte, cozile copil. Cozile funcționează la rata shaper-ului.'],
          ['service-policy output SHAPE-WAN', 'Aplicarea pe interfață: shaping doar la ieșire.'],
          ['police 500000 conform-action transmit exceed-action drop', 'Policing la ≈500 kb/s: traficul conform trece, excesul este aruncat (nu există buffer).'],
        ]} />
        <p>Sintaxa <code>police</code> variază (<code>police cir 500000 …</code> pe versiuni noi). Alternativ, <code>exceed-action set-dscp-transmit af11</code> <b>re-marchează</b> excesul în loc să-l arunce.</p>
      </Detailed>

      <Detailed title="4. Verificare">
        <CodeBlock title="R1 — show policy-map interface (ilustrativ)" kind="session" code={`R1# show policy-map interface gigabitEthernet 0/0 output
 GigabitEthernet0/0

  Service-policy output: WAN-OUT

    Class-map: VOICE (match-all)
      1250 packets, 200000 bytes
      Match: dscp ef (46)
      Priority: 20% (400 kbps), burst bytes 10000, b/w exceed drops: 0

    Class-map: CRITICAL (match-all)
      340 packets, 98000 bytes
      Match: dscp af31 (26)
      Queueing
      Bandwidth 30% (600 kbps)

    Class-map: class-default (match-any)
      4800 packets, 5400000 bytes
      queue limit 64 packets
      (total drops) 120`} explain={[
          ['Service-policy output: WAN-OUT', 'Politica activă și direcția ei.'],
          ['Match: dscp ef (46)', 'Criteriul clasei; contoarele arată câte pachete l-au satisfăcut.'],
          ['Priority: 20% … b/w exceed drops', 'Coada LLQ și pachetele aruncate pentru depășirea benzii prioritare.'],
          ['Bandwidth 30%', 'Banda garantată a clasei CBWFQ.'],
          ['(total drops) 120', 'Pierderile din clasa implicită, normale în congestie.'],
        ]} />
        <Table head={['Comandă', 'Ce arată']} hlCol={0} rows={[
          [<code key="a">show class-map</code>, 'Clasele definite și criteriile lor'],
          [<code key="b">show policy-map</code>, 'Politicile definite'],
          [<code key="c">show policy-map interface &lt;if&gt;</code>, 'Politica aplicată pe interfață, cu contoare pe clasă'],
          [<span key="d"><code>show mls qos</code> / <code>show mls qos interface</code></span>, 'Starea QoS pe switch-urile care o suportă (platformă-dependent)'],
        ]} />
        <Reveal label="Lista de verificare când „vocea sună prost în congestie”">
          <ol>
            <li>Este marcată corect (DSCP EF) la trust boundary? Verifică contoarele clasei pe politica de intrare.</li>
            <li>Politica de ieșire este aplicată pe interfața congestionată, cu <code>output</code>?</li>
            <li>Clasa VOICE are <code>priority</code> (LLQ), nu doar <code>bandwidth</code>?</li>
            <li>Contoarele „exceed drops” arată depășirea benzii prioritare? Atunci banda LLQ e prea mică.</li>
            <li>Este shaping-ul setat la rata contractată (altfel congestia apare la ISP, în afara controlului tău)?</li>
            <li>Toate hop-urile din drum au politică potrivită (PHB per-hop)?</li>
          </ol>
        </Reveal>
      </Detailed>
      <Traps items={[
        <><code>service-policy</code> lipsește sau este pe direcția greșită: politica există, dar nu face nimic.</>,
        <><code>match-all</code> cere toate condițiile; <code>match-any</code> cere cel puțin una: o alegere greșită schimbă clasificarea.</>,
        <>Output-urile sunt <b>ilustrative</b>; contoarele și formatul real diferă.</>,
      ]} />
      <InlineQuiz ids={['4.7-021', '4.7-022']} />
    </section>
  );
}
