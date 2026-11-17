import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="6.4" title="Exemple: date pentru AI, un baseline simplu și verificarea unei configurații generate de AI" />
      <Summary>
        <p>La 6.4 nu „configurezi AI”; lucrezi cu trei piese practice: <b>(1)</b> trimiți date (telemetrie, syslog) către sistemul de analiză, <b>(2)</b> vezi cum arată un baseline minimal, <b>(3)</b> știi să <b>revizuiești și să testezi</b> o configurație produsă de un asistent generativ — cea mai importantă abilitate.</p>
      </Summary>
      <Callout kind="warn" title="Exemple ilustrative, netestate">
        Comenzile IOS XE, scriptul Python și output-urile sunt <b>ilustrative</b> și <b>nu au fost testate</b> de autorul lecției pe echipamente reale; sintaxa telemetriei depinde de platformă și versiune (nu există în Packet Tracer). Configurația „generată de AI” este <b>construită intenționat cu defecte</b> pentru exercițiu — nu o folosi ca model.
      </Callout>

      <Detailed title="1. Date către sistemul de analiză (telemetrie și syslog)">
        <CodeBlock title="IOS XE — syslog și telemetrie model-driven (ilustrativ)" kind="config" code={`Switch(config)# logging host 10.0.0.6
Switch(config)# logging trap informational
Switch(config)# snmp-server host 10.0.0.9 version 2c ComunitateTrap
!
Switch(config)# telemetry ietf subscription 101
Switch(config-mdt-subs)# encoding encode-kvgpb
Switch(config-mdt-subs)# filter xpath /interfaces-ios-xe-oper:interfaces/interface/statistics
Switch(config-mdt-subs)# stream yang-push
Switch(config-mdt-subs)# update-policy periodic 6000
Switch(config-mdt-subs)# receiver ip address 10.0.0.9 57500 protocol grpc-tcp`} explain={[
          ['logging host / logging trap', 'Trimit evenimentele (log-uri) către colector: sursă de date pentru analiză (4.5).'],
          ['snmp-server host … version 2c', 'Trimit notificări SNMP; SNMPv3 este preferabil din motive de securitate (4.4).'],
          ['telemetry ietf subscription 101', 'Creează un abonament de telemetrie: echipamentul va trimite singur datele.'],
          ['filter xpath …/statistics', 'Alege ce date: aici, contoarele interfețelor, descrise de un model YANG (6.3).'],
          ['stream yang-push / update-policy periodic 6000', 'Trimite periodic datele (6000 = sutimi de secundă, adică la 60 s).'],
          ['receiver ip address … protocol grpc-tcp', 'Destinația colectorului și protocolul de transport.'],
        ]} />
        <p>Comparație: un <code>show interfaces</code> tastat de om dă o imagine într-un moment; abonamentul de telemetrie livrează <b>o serie în timp</b>, de care are nevoie un model ca să învețe ce este normal.</p>
      </Detailed>

      <Detailed title="2. Un baseline minimal (schiță Python, ilustrativă)">
        <CodeBlock title="baseline.py — media și abaterea standard pe oră" kind="config" code={`import statistics as st
from collections import defaultdict

# istoric: listă de (ora_zilei, utilizare_%) din ultimele săptămâni
history = [(h, v) for (h, v) in load_history()]
by_hour = defaultdict(list)
for hour, val in history:
    by_hour[hour].append(val)

baseline = {h: (st.mean(v), st.pstdev(v)) for h, v in by_hour.items()}

def is_anomaly(hour, value, k=3):
    mean, sd = baseline[hour]
    return abs(value - mean) > k * max(sd, 1.0)

print(is_anomaly(10, 92))   # True dacă la ora 10 media e ~45 ± 5`} explain={[
          ['by_hour[hour].append(val)', 'Grupează măsurătorile pe ora zilei: „normalul” diferă dimineața de noapte.'],
          ['baseline = {h: (mean, pstdev)}', 'Profilul normal pentru fiecare oră (media și abaterea standard).'],
          ['abs(value - mean) > k * sd', 'O valoare este anormală dacă iese din bandă cu mai mult de k abateri standard.'],
          ['max(sd, 1.0)', 'Evită o bandă prea îngustă când datele sunt aproape constante.'],
        ]} />
        <Reveal label="Ce lipsește față de un sistem real?">
          <p>Sezonalitatea (zile lucrătoare/weekend), tendința, reantrenarea periodică, filtrarea intervalelor de mentenanță, corelarea mai multor metrici și feedback-ul inginerilor. Ideea de bază — compari prezentul cu „normalul” învățat — rămâne.</p>
        </Reveal>
      </Detailed>

      <Detailed title="3. Revizuirea unei configurații generate de AI">
        <p>Cerința dată asistentului: „Configurează R1 (router-on-a-stick) pentru VLAN 10 (192.168.10.0/24) și VLAN 20 (192.168.20.0/24). VLAN 20 nu are voie să acceseze VLAN 10, în afară de ping (ICMP).” Un exemplu de răspuns primit:</p>
        <CodeBlock title="Configurația produsă de asistent (CU DEFECTE — ilustrativ)" kind="config" code={`interface GigabitEthernet0/0.10
 encapsulation dot1q 10
 ip address 192.168.10.1 255.255.255.0
 ip access-group BLOCK-20-TO-10 out
interface GigabitEthernet0/0.20
 encapsulation dot1q 20
 ip address 192.168.20.1 255.255.255.0
ip access-list extended BLOCK-20-TO-10
 permit ip any any
 deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255`} explain={[
          ['encapsulation dot1q 10 / 20', 'Sub-interfețe pentru cele două VLAN-uri (router-on-a-stick).'],
          ['ip access-group … out (pe .10)', 'Filtrează traficul care iese spre VLAN 10, deci și pe cel venit din VLAN 20.'],
          ['permit ip any any (primul)', 'DEFECT: o regulă permisivă prima potrivește tot și „acoperă” deny-ul de după.'],
          ['deny ip 192.168.20.0 … 192.168.10.0 …', 'Intenția corectă, dar ajunge prea târziu în listă.'],
        ]} />
        <Table head={['Verificare', 'Constatare', 'Remediu']} hlCol={0} rows={[
          ['Interfața fizică Gi0/0', 'Lipsește no shutdown (sub-interfețele nu pot funcționa)', 'interface gigabitethernet 0/0 → no shutdown'],
          ['Ordinea regulilor ACL', 'permit ip any any înaintea deny: ACL-ul nu blochează nimic', 'Pune deny-urile specifice înainte de permit general'],
          ['Cerința „în afară de ping”', 'Nu există permit pentru ICMP', 'permit icmp 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255 înaintea deny'],
          ['Permisiunea pentru restul traficului', 'ACL-ul are deny implicit la final; fără permit final se blochează totul spre VLAN 10', 'permit ip any any la sfârșit (pentru traficul necerut a fi blocat)'],
        ]} />
        <CodeBlock title="Versiunea revizuită (ilustrativ)" kind="config" code={`interface GigabitEthernet0/0
 no shutdown
ip access-list extended BLOCK-20-TO-10
 permit icmp 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255
 deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255
 permit ip any any`} explain={[
          ['no shutdown pe Gi0/0', 'Activează interfața fizică (sub-interfețele depind de ea).'],
          ['permit icmp … înaintea deny', 'Respectă excepția „doar ping” din cerință.'],
          ['deny ip 192.168.20.0 … 192.168.10.0 …', 'Blochează restul traficului din VLAN 20 spre VLAN 10.'],
          ['permit ip any any (ultimul)', 'Nu blochează celelalte direcții/trafic neinclus în cerință.'],
        ]} />
        <CodeBlock title="Verificare în laborator (ilustrativ)" kind="session" code={`R1# show access-lists BLOCK-20-TO-10
Extended IP access list BLOCK-20-TO-10
    10 permit icmp 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255 (4 matches)
    20 deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255 (6 matches)
    30 permit ip any any
R1# show ip interface gigabitethernet 0/0.10 | include access list
  Outgoing access list is BLOCK-20-TO-10`} explain={[
          ['show access-lists', 'Contoarele „matches” arată ce reguli prind trafic: dovada că ordinea este corectă.'],
          ['show ip interface … | include access list', 'Confirmă că ACL-ul este atașat pe interfață și în direcția corectă.'],
        ]} />
        <p>Concluzia: asistentul a înțeles intenția, dar a produs o ordine greșită, a omis excepția ICMP și interfața fizică. <b>Un inginer care testează găsește aceste defecte; unul care copiază și lipește le pune în producție.</b></p>
      </Detailed>

      <Detailed title="4. Un prompt bun">
        <Table head={['Prompt slab', 'Prompt bun']} rows={[
          ['„Fă-mi un ACL”', '„Scrie un ACL extended denumit BLOCK-20-TO-10 pentru Cisco IOS 15.x. Permite ICMP din 192.168.20.0/24 către 192.168.10.0/24, blochează restul traficului din 20 către 10 și permite restul. Folosește wildcard mask. Explică fiecare linie.”'],
          ['Fără platformă sau versiune', 'Platformă și versiune precizate (IOS/IOS XE, versiune)'],
          ['Fără context', 'Context: adrese, interfețe, direcția dorită, restricții'],
          ['Fără format cerut', 'Format: doar comenzi, urmate de pași de verificare'],
        ]} />
        <p>Chiar și cu un prompt bun, rezultatul se <b>verifică</b>. Nu pune parole, chei sau topologii confidențiale în prompturi.</p>
      </Detailed>
      <Traps items={[
        <>Telemetria alimentează modelele: fără date structurate și continue nu există AIOps.</>,
        <>Un baseline fără sezonalitate dă alarme false (dimineața vs noaptea).</>,
        <>O configurație generată arată corect la prima citire; defectele apar la ordinea regulilor, direcții, interfețe oprite și cerințe omise.</>,
      ]} />
      <InlineQuiz ids={['6.4-027', '6.4-028', '6.4-029', '6.4-030']} />
    </section>
  );
}
