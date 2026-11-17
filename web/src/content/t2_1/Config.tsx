import { Callout, Detailed, Summary, Table } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="2.1" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Obiectivul 2.1 este de tip <b>Configure and verify</b>: trebuie să poți tasta comenzile și să citești output-ul. Mai jos: VLAN-uri și porturi access, voice VLAN, hardening pentru porturi nefolosite, router-on-a-stick, SVI pe switch L3 și depanarea celor mai frecvente defecte.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Toate output-urile sunt <b>exemple ilustrative</b>, reconstruite după formatele documentate, cu adrese și nume fictive; nu au fost capturate de pe echipamente reale. Comenzile din acest topic <b>nu au fost testate</b> de autorul lecției pe echipamente. Formatul exact (spații, lista porturilor, mesajele) diferă între platforme și versiuni de IOS; verifică cu <code>?</code> pe echipamentul tău și, în Packet Tracer, ține cont că simulatorul nu reproduce 100% IOS-ul real.
      </Callout>

      <Detailed title="Exemplul 1 — Creează VLAN-uri și atribuie porturi">
        <p>Scenariu: SW1 are PC-uri de contabilitate pe Fa0/1–Fa0/2 (VLAN 10) și PC-uri de vânzări pe Fa0/3–Fa0/4 (VLAN 20).</p>
        <CodeBlock title="SW1 — configurare" kind="config" code={`SW1(config)# vlan 10
SW1(config-vlan)# name CONTABILITATE
SW1(config-vlan)# vlan 20
SW1(config-vlan)# name VANZARI
SW1(config-vlan)# exit
SW1(config)# interface range fa0/1-2
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 10
SW1(config-if-range)# interface range fa0/3-4
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 20
SW1(config-if-range)# end
SW1# copy running-config startup-config`} explain={[
          ['vlan 10 / name CONTABILITATE', 'Creează VLAN-ul 10 și îi dă un nume. Numele nu afectează funcționarea, dar ajută la citirea lui show vlan brief.'],
          ['vlan 20 (direct din config-vlan)', 'Poți trece direct la următorul VLAN fără exit.'],
          ['interface range fa0/1-2', 'Intră simultan pe mai multe porturi; fiecare comandă următoare se aplică tuturor.'],
          ['switchport mode access', 'Forțează portul în modul access; fără el portul poate negocia trunk prin DTP (2.2).'],
          ['switchport access vlan 10', 'Atribuie portul VLAN-ului de date 10.'],
          ['copy running-config startup-config', 'Salvează configurația. Atenție: VLAN-urile normale stau în vlan.dat, dar atribuirea porturilor este în startup-config.'],
        ]} />
        <CodeBlock title="SW1 — show vlan brief (ilustrativ)" kind="session" code={`SW1# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/5, Fa0/6, Fa0/7, Fa0/8
                                                Fa0/9, Fa0/10, Fa0/11, Fa0/12
                                                Gi0/2
10   CONTABILITATE                    active    Fa0/1, Fa0/2
20   VANZARI                          active    Fa0/3, Fa0/4
1002 fddi-default                     act/unsup
1003 token-ring-default               act/unsup
1004 fddinet-default                  act/unsup
1005 trnet-default                    act/unsup`} explain={[
          ['1 default', 'VLAN-ul implicit; conține porturile care nu au fost mutate. Fa0/24 sau Gi0/1 pot lipsi dacă sunt trunk (trunk-urile nu apar).'],
          ['10 CONTABILITATE … Fa0/1, Fa0/2', 'VLAN-ul creat și porturile access care îi aparțin.'],
          ['status active', 'VLAN-ul e funcțional. „act/unsup” (1002–1005) înseamnă active dar nesuportate pe aceste switch-uri.'],
          ['1002–1005', 'VLAN-uri rezervate legacy (FDDI / Token Ring); nu se șterg și nu se folosesc.'],
        ]} />
        <CodeBlock title="Alte verificări" kind="session" code={`SW1# show vlan id 10
SW1# show interfaces fa0/1 switchport
SW1# show running-config interface fa0/1`} explain={[
          ['show vlan id 10', 'Detalii despre un singur VLAN (nume, status, porturi).'],
          ['show interfaces fa0/1 switchport', 'Administrative Mode: static access · Operational Mode: static access · Access Mode VLAN: 10 · Voice VLAN: none — adevărul despre port.'],
          ['show running-config interface fa0/1', 'Linii switchport mode access și switchport access vlan 10 așa cum le-ai introdus.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 2 — Voice VLAN pe același port">
        <p>Scenariu: pe Fa0/6 e un telefon IP, iar PC-ul e conectat în spatele telefonului. Date = VLAN 10, voce = VLAN 40.</p>
        <CodeBlock title="SW1 — voice VLAN" kind="config" code={`SW1(config)# vlan 40
SW1(config-vlan)# name VOCE
SW1(config-vlan)# exit
SW1(config)# interface fa0/6
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# switchport voice vlan 40
SW1(config-if)# end`} explain={[
          ['vlan 40 / name VOCE', 'Creează întâi VLAN-ul de voce; dacă nu există, telefonul nu poate fi configurat corect.'],
          ['switchport mode access', 'Portul rămâne access.'],
          ['switchport access vlan 10', 'VLAN-ul de date: PC-ul din spatele telefonului.'],
          ['switchport voice vlan 40', 'VLAN-ul de voce; switch-ul îl comunică telefonului prin CDP / LLDP-MED, iar telefonul își etichetează traficul cu 802.1Q VID 40.'],
        ]} />
        <CodeBlock title="SW1 — show interfaces fa0/6 switchport (extras, ilustrativ)" kind="session" code={`SW1# show interfaces fa0/6 switchport
Name: Fa0/6
Switchport: Enabled
Administrative Mode: static access
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 10 (CONTABILITATE)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: 40 (VOCE)`} explain={[
          ['Administrative Mode: static access', 'Ce ai configurat tu (access forțat).'],
          ['Operational Mode: static access', 'Ce face portul acum. Dacă ar fi „trunk”, portul ar fi negociat trunk.'],
          ['Negotiation of Trunking: Off', 'Pe un port access forțat nu se negociază DTP.'],
          ['Access Mode VLAN: 10', 'VLAN-ul de date.'],
          ['Voice VLAN: 40', 'VLAN-ul de voce asociat portului.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 3 — Hardening: porturile nefolosite">
        <CodeBlock title="SW1 — parcare + shutdown" kind="config" code={`SW1(config)# vlan 999
SW1(config-vlan)# name PARCARE
SW1(config-vlan)# exit
SW1(config)# interface range fa0/9-24
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 999
SW1(config-if-range)# shutdown
SW1(config-if-range)# end`} explain={[
          ['vlan 999 / name PARCARE', 'VLAN fără SVI și fără trunk; nu are cale spre restul rețelei.'],
          ['interface range fa0/9-24', 'Ajustează intervalul la porturile libere; nu include trunk-urile sau porturile folosite.'],
          ['switchport access vlan 999', 'Chiar dacă cineva reactivează portul, ajunge într-un VLAN izolat.'],
          ['shutdown', 'Oprește administrativ portul; nu se negociază link.'],
        ]} />
        <Callout kind="tip" title="Schimbarea VLAN-ului de management">
          Dacă SVI-ul de management e în VLAN 1, mută-l: <code>interface vlan 99</code> + <code>ip address …</code> + <code>no shutdown</code>, apoi <code>ip default-gateway …</code> în global (pe switch L2). Nu muta managementul de la distanță înainte să fii sigur că ai acces prin noul VLAN (altfel te deconectezi).
        </Callout>
      </Detailed>

      <Detailed title="Exemplul 4 — Router-on-a-stick">
        <p>R1 Gi0/0 → SW1 Fa0/24 (trunk). VLAN 10 = 192.168.10.0/24, VLAN 20 = 192.168.20.0/24.</p>
        <CodeBlock title="R1 — subinterfețe" kind="config" code={`R1(config)# interface gigabitEthernet 0/0
R1(config-if)# no shutdown
R1(config-if)# interface gigabitEthernet 0/0.10
R1(config-subif)# encapsulation dot1Q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config-subif)# interface gigabitEthernet 0/0.20
R1(config-subif)# encapsulation dot1Q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config-subif)# end`} explain={[
          ['interface gigabitEthernet 0/0 / no shutdown', 'Interfața fizică poartă trunk-ul; fără IP, dar trebuie să fie pornită.'],
          ['interface gigabitEthernet 0/0.10', 'Creează subinterfața .10 (convenția: numărul = VLAN ID).'],
          ['encapsulation dot1Q 10', 'Spune că subinterfața procesează cadrele cu tag 802.1Q VID 10. Se dă înainte de ip address.'],
          ['ip address 192.168.10.1 255.255.255.0', 'Gateway-ul VLAN-ului 10; hosturile din VLAN 10 își setează acest default gateway.'],
          ['Gi0/0.20 …', 'Același tipar pentru VLAN 20.'],
        ]} />
        <CodeBlock title="SW1 — portul spre router" kind="config" code={`SW1(config)# interface fa0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10,20`} explain={[
          ['switchport mode trunk', 'Portul spre router trebuie să fie trunk (2.2). Pe unele platforme veți avea nevoie și de switchport trunk encapsulation dot1q înainte (switch-uri care suportă și ISL).'],
          ['switchport trunk allowed vlan 10,20', 'Doar VLAN-urile necesare; atenție: lista fără add înlocuiește lista veche.'],
        ]} />
        <CodeBlock title="R1 — show ip interface brief / show ip route (ilustrativ)" kind="session" code={`R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     unassigned      YES unset  up                    up
GigabitEthernet0/0.10  192.168.10.1    YES manual up                    up
GigabitEthernet0/0.20  192.168.20.1    YES manual up                    up

R1# show ip route
...
C        192.168.10.0/24 is directly connected, GigabitEthernet0/0.10
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0.10
C        192.168.20.0/24 is directly connected, GigabitEthernet0/0.20
L        192.168.20.1/32 is directly connected, GigabitEthernet0/0.20`} explain={[
          ['Gi0/0 unassigned … up up', 'Interfața fizică nu are IP (normal) dar e up/up.'],
          ['Gi0/0.10 / Gi0/0.20', 'Subinterfețele cu adresele de gateway.'],
          ['C și L', 'Rețeaua conectată (C) și adresa locală /32 a routerului (L). Rutele apar doar dacă subinterfața e up.'],
        ]} />
        <p>Din PC1 (192.168.10.11, GW 192.168.10.1): <code>ping 192.168.20.11</code> ar trebui să reușească (de obicei primul pachet se pierde la ARP).</p>
      </Detailed>

      <Detailed title="Exemplul 5 — Switch L3 cu SVI">
        <CodeBlock title="MLS1 — SVI-uri" kind="config" code={`MLS1(config)# ip routing
MLS1(config)# vlan 10
MLS1(config-vlan)# vlan 20
MLS1(config-vlan)# exit
MLS1(config)# interface vlan 10
MLS1(config-if)# ip address 192.168.10.1 255.255.255.0
MLS1(config-if)# no shutdown
MLS1(config-if)# interface vlan 20
MLS1(config-if)# ip address 192.168.20.1 255.255.255.0
MLS1(config-if)# no shutdown
MLS1(config-if)# end`} explain={[
          ['ip routing', 'Activează funcția de rutare pe switch. Fără ea SVI-urile există, dar switch-ul nu face routing între ele.'],
          ['vlan 10 / vlan 20', 'VLAN-urile trebuie să existe pentru ca SVI-urile să poată fi up.'],
          ['interface vlan 10', 'Creează SVI-ul VLAN-ului 10; adresa IP = gateway-ul pentru hosturile din VLAN 10.'],
          ['no shutdown', 'Pe unele platforme SVI-ul pornește shutdown; verifică starea.'],
        ]} />
        <CodeBlock title="MLS1 — show ip interface brief (extras, ilustrativ)" kind="session" code={`MLS1# show ip interface brief | include Vlan
Vlan1                  unassigned      YES unset  administratively down down
Vlan10                 192.168.10.1    YES manual up                    up
Vlan20                 192.168.20.1    YES manual up                    up`} explain={[
          ['Vlan10 up/up', 'VLAN-ul există și are cel puțin un port activ (autostate).'],
          ['Vlan1 administratively down', 'SVI-ul implicit nefolosit, oprit.'],
          ['Dacă Vlan20 ar fi up/down', 'Verifică: VLAN-ul 20 există? Există cel puțin un port up în VLAN 20 (sau un trunk activ care îl permite)?'],
        ]} />
        <CodeBlock title="Port routed (opțional)" kind="config" code={`MLS1(config)# interface gi0/24
MLS1(config-if)# no switchport
MLS1(config-if)# ip address 10.0.0.1 255.255.255.252`} explain={[
          ['no switchport', 'Transformă portul într-un port L3 (nu mai e în niciun VLAN).'],
          ['ip address …', 'Adresă IP direct pe port, ca pe un router.'],
        ]} />
      </Detailed>

      <Detailed title="Exemplul 6 — Defecte tipice și cum le recunoști">
        <Table head={['Simptom', 'Cauză probabilă', 'Cum verifici / remediezi']} hlCol={0} rows={[
          ['PC-ul nu ia IP/ping, portul e „inactive” în show vlan brief', 'Portul e atribuit unui VLAN care nu există (sau a fost șters).', <>Creează VLAN-ul (<code>vlan N</code>) sau mută portul în alt VLAN. </>],
          ['Două PC-uri din VLAN-uri diferite nu comunică', 'Nu există routing sau gateway greșit.', <>Hosturile au GW corect? ROAS/SVI configurat? <code>ip routing</code> pe L3?</>],
          ['PC1 vede PC3 (același VLAN, switch-uri diferite)? Nu', 'Trunk lipsă/neconfigurat sau VLAN neprezent pe al doilea switch.', <><code>show interfaces trunk</code> și <code>show vlan brief</code> pe ambele switch-uri (2.2).</>],
          ['Telefonul nu primește VLAN-ul de voce', 'CDP/LLDP oprit sau voice VLAN lipsă / PoE absent.', <><code>show interfaces switchport</code>, <code>show cdp neighbors</code>, <code>show power inline</code>.</>],
          ['SVI up/down', 'VLAN inexistent sau niciun port activ.', <><code>show vlan brief</code>, <code>show ip interface brief</code>.</>],
          ['ROAS: toate subinterfețele jos', 'Interfața fizică în shutdown sau cablu/trunk lipsă.', <><code>no shutdown</code>, <code>show ip interface brief</code>.</>],
          ['ROAS: ping eșuează doar spre un VLAN', 'Port trunk fără acel VLAN în allowed list, sau encapsulation VID greșit.', <><code>show interfaces trunk</code>; <code>show running-config interface Gi0/0.N</code>.</>],
        ]} />
        <CodeBlock title="Ce se întâmplă când ștergi un VLAN" kind="session" code={`SW1(config)# no vlan 20
SW1(config)# end
SW1# show vlan brief
VLAN Name                             Status    Ports
---- -------------------------------- --------- ------------------------------
1    default                          active    Fa0/5, Fa0/6, Fa0/7, Fa0/8
10   CONTABILITATE                    active    Fa0/1, Fa0/2
...
SW1# show interfaces fa0/3 switchport | include Access Mode
Access Mode VLAN: 20 (Inactive)`} explain={[
          ['no vlan 20', 'Șterge VLAN-ul din baza de date; porturile nu mai apar în nicio listă.'],
          ['Fa0/3 și Fa0/4 dispar din show vlan brief', 'Ele rămân configurate cu switchport access vlan 20, dar sunt inactive: fără VLAN, nu pot comuta cadre.'],
          ['Remediere', 'Recreează VLAN-ul (vlan 20) — porturile devin imediat din nou active — sau atribuie alt VLAN.'],
        ]} />
        <p className="small">Notă: formatul exact („Inactive” lângă VLAN) variază între platforme; verifică cu <code>show interfaces fa0/3 switchport</code> și <code>show vlan brief</code>.</p>
      </Detailed>
    </section>
  );
}
