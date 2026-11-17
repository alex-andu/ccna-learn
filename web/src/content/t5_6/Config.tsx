import { Callout, Detailed, Reveal, Summary, Table, Traps } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';
import { InlineQuiz } from '../../components/InlineQuiz';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="5.6" title="Exemple de configurare și verificare: ACL standard, extended, named, VTY" />
      <Summary>
        <p>Scenariul: un router R1 are trei rețele — <b>Staff</b>, <b>Guest</b> și <b>Servere</b>. Politica: staff-ul accesează tot; oaspeții pot doar <b>HTTP către serverul web</b> și restul rețelelor externe, dar <b>nu</b> au voie în rețeaua serverelor în alt mod. Vedem cum se traduce în ACL-uri, cum se aplică și cum se verifică.</p>
      </Summary>
      <Callout kind="warn" title="Output-uri ilustrative, comenzi netestate">
        Output-urile sunt <b>exemple ilustrative</b>, nu capturi reale; formatul exact (spații, contoare) diferă între versiuni IOS și Packet Tracer. Comenzile <b>nu au fost testate</b> de autorul lecției pe echipamente reale. Sintaxa e cea documentată de Cisco pentru IOS/IOS XE.
      </Callout>

      <Detailed title="1. Scenariul">
        <Table head={['Echipament', 'Interfață', 'IPv4', 'Rol']} rows={[
          ['R1', 'Gi0/0', '192.168.10.1/24', 'Staff'],
          ['R1', 'Gi0/1', '192.168.20.1/24', 'Guest'],
          ['R1', 'Gi0/2', '10.1.1.1/24', 'Servere'],
          ['Server', 'NIC', '10.1.1.80/24', 'HTTP + FTP'],
        ]} />
      </Detailed>

      <Detailed title="2. ACL extended named, aplicat lângă sursă (Guest)">
        <CodeBlock title="R1 — GUEST-IN (ilustrativ)" kind="config" code={`R1(config)# ip access-list extended GUEST-IN
R1(config-ext-nacl)# remark Oaspetii: doar HTTP spre serverul web
R1(config-ext-nacl)# 10 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 80
R1(config-ext-nacl)# 20 deny ip 192.168.20.0 0.0.0.255 10.1.1.0 0.0.0.255 log
R1(config-ext-nacl)# 30 permit ip any any
R1(config-ext-nacl)# exit
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip access-group GUEST-IN in`} explain={[
          ['ip access-list extended GUEST-IN', 'Creează un ACL extended cu numele GUEST-IN și intră în submodul lui.'],
          ['remark …', 'Comentariu documentar; nu influențează traficul.'],
          ['10 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 80', 'Prima regulă: oaspeții pot deschide conexiuni TCP către portul 80 al serverului.'],
          ['20 deny ip 192.168.20.0 0.0.0.255 10.1.1.0 0.0.0.255 log', 'Orice altceva dinspre oaspeți către rețeaua serverelor este refuzat și logat.'],
          ['30 permit ip any any', 'Fără această linie, deny-ul implicit ar bloca tot restul traficului oaspeților.'],
          ['ip access-group GUEST-IN in', 'Aplică ACL-ul pe interfața Guest, în sensul pachetelor care intră: lângă sursă, înainte de rutare.'],
        ]} />
        <Callout kind="info" title="De ce există linia 30">
          Linia 20 refuză doar traficul spre rețeaua serverelor. Fără linia 30, restul traficului oaspeților (de exemplu spre Internet) ar fi aruncat de deny-ul implicit. Dacă vrei ca oaspeții să nu acceseze deloc rețeaua staff-ului, adaugi între 20 și 30 un deny către 192.168.10.0/24.
        </Callout>
      </Detailed>

      <Detailed title="3. ACL standard, aplicat lângă destinație">
        <p>Cerință nouă: gazda 192.168.20.7 (oaspetele problematic) nu are voie nicăieri în rețeaua serverelor. Un ACL standard vede doar sursa, deci îl punem <b>lângă destinație</b>: pe interfața Gi0/2, în sensul <b>out</b>.</p>
        <CodeBlock title="R1 — ACL standard numerotat (ilustrativ)" kind="config" code={`R1(config)# access-list 20 remark Blocheaza un oaspete spre servere
R1(config)# access-list 20 deny host 192.168.20.7
R1(config)# access-list 20 permit any
R1(config)# interface gigabitEthernet 0/2
R1(config-if)# ip access-group 20 out`} explain={[
          ['access-list 20 deny host 192.168.20.7', 'Refuză sursa 192.168.20.7 (host = 0.0.0.0 wildcard).'],
          ['access-list 20 permit any', 'Fără această linie, deny-ul implicit ar bloca toate celelalte surse către servere.'],
          ['ip access-group 20 out', 'Verificarea are loc după rutare, la ieșirea spre rețeaua serverelor.'],
        ]} />
      </Detailed>

      <Detailed title="4. Editare cu numere de secvență">
        <p>Vrei ca oaspeții să poată face și HTTPS spre server. Inserezi o linie între 10 și 20 — fără a reface ACL-ul.</p>
        <CodeBlock title="R1 — inserare linie (ilustrativ)" kind="config" code={`R1(config)# ip access-list extended GUEST-IN
R1(config-ext-nacl)# 15 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 443
R1(config-ext-nacl)# end
R1# show ip access-lists GUEST-IN
Extended IP access list GUEST-IN
    10 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq www
    15 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 443
    20 deny ip 192.168.20.0 0.0.0.255 10.1.1.0 0.0.0.255 log
    30 permit ip any any`} explain={[
          ['15 permit …', 'Numărul de secvență plasează linia între 10 și 20.'],
          ['eq www', 'IOS afișează numele serviciului pentru portul 80.'],
          ['no 20', '(altă comandă utilă) șterge linia 20 fără a atinge restul.'],
        ]} />
      </Detailed>

      <Detailed title="5. Protejarea VTY">
        <CodeBlock title="R1 — doar stațiile de administrare (ilustrativ)" kind="config" code={`R1(config)# access-list 10 permit 192.168.10.100
R1(config)# line vty 0 15
R1(config-line)# access-class 10 in
R1(config-line)# transport input ssh`} explain={[
          ['access-list 10 permit 192.168.10.100', 'Doar această gazdă (administratorul) are voie; restul cade pe deny implicit.'],
          ['access-class 10 in', 'ACL aplicat pe sesiunile care intră pe VTY, indiferent pe ce interfață sosesc.'],
          ['transport input ssh', 'Acceptă doar SSH (vezi 4.8).'],
        ]} />
      </Detailed>

      <Detailed title="6. Verificare">
        <CodeBlock title="R1 — după trafic de test (ilustrativ)" kind="session" code={`R1# show access-lists
Standard IP access list 20
    10 deny   192.168.20.7 (12 matches)
    20 permit any (340 matches)
Extended IP access list GUEST-IN
    10 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq www (58 matches)
    15 permit tcp 192.168.20.0 0.0.0.255 host 10.1.1.80 eq 443
    20 deny ip 192.168.20.0 0.0.0.255 10.1.1.0 0.0.0.255 log (9 matches)
    30 permit ip any any (221 matches)

R1# show ip interface gigabitEthernet 0/1 | include access list
  Outgoing access list is not set
  Inbound  access list is GUEST-IN`} explain={[
          ['(58 matches)', 'Contorul unei linii: de câte ori s-a potrivit; dovada că linia chiar se aplică.'],
          ['15 … fără contor', 'Încă n-a existat trafic HTTPS; absența contorului nu înseamnă eroare.'],
          ['Inbound access list is GUEST-IN', 'Confirmă că ACL-ul este aplicat pe interfață, în direcția in.'],
        ]} />
        <Reveal label="Cum citești rezultatul">
          <p>Dacă linia 20 (deny) are contor mare, oaspeții încearcă să ajungă în rețeaua serverelor altfel decât prin HTTP. Dacă linia 10 are 0 matches deși ai testat web-ul, verifică: ACL-ul e aplicat pe <code>Gi0/1 in</code>? adresa serverului e corectă? portul e <code>eq 80</code> după <b>destinație</b>?</p>
        </Reveal>
        <Callout kind="tip" title="Alte comenzi utile">
          <code>clear access-list counters</code> resetează contoarele între teste. <code>show running-config | section access-list</code> arată ACL-urile din configurație. Pentru logarea potrivirilor (<code>log</code>) vezi mesajele <code>%SEC-6-IPACCESSLOGP</code> în <code>show logging</code>.
        </Callout>
      </Detailed>

      <Detailed title="7. Mini-exemplu IPv6">
        <CodeBlock title="R1 — ACL IPv6 (ilustrativ)" kind="config" code={`R1(config)# ipv6 access-list V6-GUEST
R1(config-ipv6-acl)# permit tcp 2001:db8:20::/64 host 2001:db8:1::80 eq 80
R1(config-ipv6-acl)# deny ipv6 2001:db8:20::/64 2001:db8:1::/64
R1(config-ipv6-acl)# permit ipv6 any any
R1(config-ipv6-acl)# exit
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ipv6 traffic-filter V6-GUEST in`} explain={[
          ['ipv6 access-list V6-GUEST', 'ACL IPv6 (întotdeauna named).'],
          ['permit … 2001:db8:20::/64 …', 'Prefixe, nu wildcard.'],
          ['ipv6 traffic-filter … in', 'Aplicarea pe interfață (echivalentul lui ip access-group).'],
        ]} />
        <p>Notă: ND (<code>nd-na</code>/<code>nd-ns</code>) este permis implicit chiar înaintea deny-ului implicit; dacă ai fi scris un <code>deny ipv6 any any</code> explicit, ar trebui să permiți tu aceste mesaje.</p>
      </Detailed>
      <Traps items={[
        <>Un ACL aplicat <b>out</b> pe Gi0/2 nu filtrează pachetele generate de R1 însuși.</>,
        <>Fără <code>permit ip any any</code> la final, un ACL „de blocare” ajunge să blocheze totul.</>,
        <>Nu aplica un ACL pe VTY sau pe interfața de management fără să verifici că ești inclus în permit.</>,
      ]} />
      <InlineQuiz ids={['5.6-036', '5.6-037', '5.6-038', '5.6-039', '5.6-040']} />
    </section>
  );
}
