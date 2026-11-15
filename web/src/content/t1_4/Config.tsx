import { Term as G } from '../../components/Term';
import { Callout, Detailed, Summary } from '../../components/Lesson';
import { CodeBlock } from '../../components/CodeBlock';
import { SectionHead } from '../../components/SectionHead';

export function ConfigExamples() {
  return (
    <section id="config" className="section">
      <SectionHead id="config" code="1.4" title="Exemple de configurare și verificare" />
      <Summary>
        <p>Topicul 1.4 e de tip <b>Identify</b>: la examen citești output-uri. Totuși, câteva comenzi de configurare (<code>speed</code>, <code>duplex</code>, <code>shutdown</code>) și mai multe comenzi de verificare trebuie să le știi pe de rost. Mai jos: configurarea, apoi verificarea, de la privirea de ansamblu la contorul individual.</p>
      </Summary>
      <Callout kind="warn" title="Output-urile sunt ilustrative">
        Exemplele de output de mai jos sunt <b>construite pentru învățare</b> (nume, cifre, adrese inventate), urmând formatul IOS/IOS-XE al switch-urilor Catalyst. Formatul tabelului <code>show interfaces status</code> (cu prefixul „a-”) este cel documentat de Cisco; restul pot avea mici diferențe de coloane sau de text între modele și versiuni. Comenzile urmează ghidurile Cisco, dar nu au fost testate pe echipamente reale — verifică întotdeauna cu <code>?</code>.
      </Callout>

      <Detailed title="1 — Viteză și duplex pe o interfață">
        <CodeBlock title="Fixare manuală (ambele capete la fel!)" code={`SW1# configure terminal
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# description Link spre R1 - fixat 100/full si pe R1
SW1(config-if)# speed 100
SW1(config-if)# duplex full
SW1(config-if)# end`} kind="session" explain={[
          ['interface GigabitEthernet0/1', 'Intri în modul de configurare al interfeței (prescurtat: int g0/1).'],
          ['description …', 'Text liber. Bună practică: notează că portul e fixat manual și că celălalt capăt trebuie să fie identic — salvează pe următorul coleg de un mismatch.'],
          ['speed 100', <>Fixează viteza la 100 Mb/s. Pe Cisco, o viteză fixată <b>dezactivează <G id="autonegotiation" /></b> pe port (pentru viteză și duplex).</>],
          ['duplex full', <>Fixează full-duplex. Dacă celălalt capăt rămâne pe auto, va ajunge pe 100/<b>half</b> → <G id="duplex-mismatch" />.</>],
        ]} />
        <CodeBlock title="Revenire la autonegociere (recomandarea Cisco)" code={`SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# speed auto
SW1(config-if)# duplex auto
SW1(config-if)# end`} kind="session" explain={[
          ['speed auto', 'Viteza se negociază din nou cu partenerul.'],
          ['duplex auto', 'Duplexul se negociază. Pune auto pe AMBELE capete, altfel problema rămâne.'],
        ]} />
        <CodeBlock title="Half-duplex la gigabit — refuzat" code={`SW1(config-if)# speed auto
SW1(config-if)# duplex half
% Duplex cannot be set to half when speed autonegotiation subset contains 1Gbps
SW1(config-if)# speed 100
SW1(config-if)# duplex half`} kind="session" explain={[
          ['duplex half', 'Pe porturile Cisco, 1 Gb/s funcționează doar full-duplex. Pentru half trebuie întâi coborâtă viteza la 100 sau 10.'],
          ['speed 100', 'După fixarea vitezei la 100, half-duplex devine posibil (util doar pentru echipamente foarte vechi).'],
        ]} />
        <CodeBlock title="Oprire / pornire interfață" code={`SW1(config)# interface GigabitEthernet0/3
SW1(config-if)# shutdown
%LINK-5-CHANGED: Interface GigabitEthernet0/3, changed state to administratively down
SW1(config-if)# no shutdown
%LINK-3-UPDOWN: Interface GigabitEthernet0/3, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/3, changed state to up`} kind="session" explain={[
          ['shutdown', <>Oprește interfața → <G id="admin-down" />. Bună practică pe porturile nefolosite.</>],
          ['no shutdown', 'Pornește interfața. Observă cele două mesaje: întâi LINK (nivelul 1), apoi LINEPROTO (nivelul 2) — exact perechea din show interfaces.'],
        ]} />
      </Detailed>

      <Detailed title="2 — Privirea de ansamblu: show ip interface brief și show interfaces status">
        <CodeBlock title="show ip interface brief" kind="session" code={`SW1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
Vlan1                  192.168.1.2     YES manual up                    up
GigabitEthernet0/1     unassigned      YES unset  up                    up
GigabitEthernet0/2     unassigned      YES unset  down                  down
GigabitEthernet0/3     unassigned      YES unset  administratively down down
GigabitEthernet0/4     unassigned      YES unset  down                  down`} explain={[
          ['Status', 'Nivelul 1 (primul cuvânt din show interfaces).'],
          ['Protocol', 'Nivelul 2 (line protocol).'],
          ['Gi0/4 down/down', 'Atenție: un port err-disabled arată tot down/down aici. Ca să vezi diferența, folosește show interfaces status.'],
        ]} />
        <CodeBlock title="show interfaces status" kind="session" code={`SW1# show interfaces status
Port      Name               Status       Vlan       Duplex  Speed Type
Gi0/1     Link spre R1       connected    1            full    100 10/100/1000BaseTX
Gi0/2     PC-Contabil        notconnect   10           auto   auto 10/100/1000BaseTX
Gi0/3                        disabled     1            auto   auto 10/100/1000BaseTX
Gi0/4     Sala-sedinte       err-disabled 10           auto   auto 10/100/1000BaseTX
Gi0/5     PC-Director        connected    10         a-full a-1000 10/100/1000BaseTX
Gi0/6     Imprimanta-veche   connected    10         a-half  a-100 10/100/1000BaseTX`} explain={[
          ['Status', <>connected = up/up · notconnect = down/down · disabled = shutdown · <G id="err-disabled" /> = oprit de switch.</>],
          ['full / 100 (fără „a-”)', 'Gi0/1: valori fixate manual.'],
          ['a-full a-1000', 'Gi0/5: negociate automat — cazul ideal.'],
          ['a-half a-100', <>Gi0/6: portul e pe auto, dar a ajuns pe half la 100. Fie imprimanta chiar e half (veche), fie e <b>fixată 100/full</b> → duplex mismatch. Verifică celălalt capăt!</>],
        ]} />
      </Detailed>

      <Detailed title="3 — Diagnoza: show interfaces și filtrele | include">
        <CodeBlock title="show interfaces — partea half a unui duplex mismatch (Gi0/6)" kind="session" code={`SW1# show interfaces GigabitEthernet0/6
GigabitEthernet0/6 is up, line protocol is up (connected)
  Hardware is Gigabit Ethernet, address is 0cd0.f8a4.1b06 (bia 0cd0.f8a4.1b06)
  Description: Imprimanta-veche
  MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec,
     reliability 248/255, txload 3/255, rxload 2/255
  Half-duplex, 100Mb/s, media type is 10/100/1000BaseTX
  Last clearing of "show interface" counters 00:12:40
  Input queue: 0/75/0/0 (size/max/drops/flushes); Total output drops: 0
     1843920 packets input, 512339871 bytes, 0 no buffer
     0 runts, 0 giants, 0 throttles
     312 input errors, 288 CRC, 24 frame, 0 overrun, 0 ignored
     2210345 packets output, 1903345110 bytes, 0 underruns
     0 output errors, 6721 collisions, 3 interface resets
     0 babbles, 1984 late collision, 412 deferred`} explain={[
          ['is up, line protocol is up', 'L1 și L2 funcționează — dar asta nu exclude problemele de mai jos.'],
          ['BW 100000 Kbit/sec', 'Un port gigabit care rulează la 100 Mb/s.'],
          ['reliability 248/255', 'Sub 255 = erori recente.'],
          ['Half-duplex, 100Mb/s', 'Half pe un link punct-la-punct: suspect principal.'],
          ['Last clearing … 00:12:40', 'Erorile de mai jos s-au acumulat în doar 12 minute → problemă activă.'],
          ['6721 collisions', <>Pe half-duplex coliziunile sunt posibile, dar atât de multe pe un singur dispozitiv conectat sunt suspecte.</>],
          ['1984 late collision', <><G id="late-collision" /> = semnătura părții half a unui mismatch (sau cablu prea lung).</>],
          ['288 CRC, 24 frame', 'Pot apărea și pe partea half (cadre primite trunchiate). Semnătura decisivă rămâne late collision.'],
        ]} />
        <CodeBlock title="Filtrare rapidă cu | include" kind="session" code={`SW1# show interfaces GigabitEthernet0/6 | include duplex|errors|collision
  Half-duplex, 100Mb/s, media type is 10/100/1000BaseTX
     312 input errors, 288 CRC, 24 frame, 0 overrun, 0 ignored
     0 output errors, 6721 collisions, 3 interface resets
     0 babbles, 1984 late collision, 412 deferred
SW1# show interfaces | include is up|is down|CRC
GigabitEthernet0/1 is up, line protocol is up (connected)
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
GigabitEthernet0/2 is down, line protocol is down (notconnect)
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored`} explain={[
          ['| include duplex|errors|collision', 'Păstrează doar liniile care conțin unul dintre cuvinte (| = SAU în expresia regulată). Sensibil la litere mari/mici.'],
          ['show interfaces | include is up|is down|CRC', 'Pe toate interfețele: starea + linia cu CRC — un „radar” rapid pentru porturile cu erori.'],
        ]} />
        <CodeBlock title="show interfaces counters errors (switch Catalyst)" kind="session" code={`SW1# show interfaces counters errors

Port        Align-Err     FCS-Err    Xmit-Err     Rcv-Err  UnderSize  OutDiscards
Gi0/1               0           0           0           0          0            0
Gi0/6              24         288           0         312          0            0
Gi0/7               0        5821           0        6925          0            0

Port      Single-Col  Multi-Col   Late-Col  Excess-Col  Carri-Sen      Runts     Giants
Gi0/1              0          0          0           0          0          0          0
Gi0/6           2210       1873       1984           3       9120          0          0
Gi0/7              0          0          0           0          0          0          0`} explain={[
          ['FCS-Err', 'Cadre cu FCS (CRC) greșit. Gi0/7: multe FCS-Err, zero coliziuni → problemă fizică (cablu/EMI).'],
          ['Late-Col', 'Gi0/6: late collisions → partea half a unui duplex mismatch.'],
          ['Carri-Sen', 'Portul half a ascultat mediul înainte să transmită — normal pe half, dar confirmă că Gi0/6 e half.'],
          ['OutDiscards', 'Echivalentul output drops (congestie).'],
        ]} />
        <CodeBlock title="clear counters" kind="session" code={`SW1# clear counters GigabitEthernet0/6
Clear "show interface" counters on this interface [confirm]
SW1# show interfaces GigabitEthernet0/6 | include clearing
  Last clearing of "show interface" counters 00:00:08`} explain={[
          ['clear counters GigabitEthernet0/6', 'Resetează contoarele unei interfețe (fără argument: toate, după confirmare). Nu întrerupe traficul.'],
          ['| include clearing', 'Confirmi de cât timp numeri. Reverifică peste câteva minute: cresc erorile?'],
        ]} />
      </Detailed>

      <Detailed title="4 — CDP și log-ul: mesajele care trădează problema">
        <CodeBlock title="Duplex mismatch semnalat de CDP + verificare la vecin" kind="session" code={`%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on GigabitEthernet0/1 (not half duplex), with R1 GigabitEthernet0/0/1 (half duplex).
SW1# show cdp neighbors GigabitEthernet0/1 detail
Device ID: R1
  Interface: GigabitEthernet0/1,  Port ID (outgoing port): GigabitEthernet0/0/1
  Duplex: half
SW1# show logging | include UPDOWN|DUPLEX`} explain={[
          ['%CDP-4-DUPLEX_MISMATCH', <><G id="cdp" /> a văzut că vecinul raportează alt duplex. Doar avertizează — nu corectează.</>],
          ['show cdp neighbors … detail', 'Linia „Duplex:” arată duplexul anunțat de vecin prin CDP (aici half, în timp ce Gi0/1 local e full). Comanda îți spune și exact ce port al vecinului e la celălalt capăt.'],
          ['show logging | include UPDOWN|DUPLEX', 'Istoricul căderilor de link (%LINK-3-UPDOWN — link flap?) și al mismatch-urilor.'],
        ]} />
      </Detailed>

      <Detailed title="5 — Previzualizare: err-disabled și recuperarea (detalii în 5.7 și 2.5)">
        <CodeBlock title="Găsești cauza, apoi reactivezi" kind="session" code={`%PM-4-ERR_DISABLE: psecure-violation error detected on Gi0/4, putting Gi0/4 in err-disable state
SW1# show interfaces status err-disabled
Port      Name               Status       Reason               Err-disabled Vlans
Gi0/4     Sala-sedinte       err-disabled psecure-violation
SW1# configure terminal
SW1(config)# interface GigabitEthernet0/4
SW1(config-if)# shutdown
SW1(config-if)# no shutdown
SW1(config-if)# exit
SW1(config)# errdisable recovery cause psecure-violation
SW1(config)# errdisable recovery interval 300
SW1(config)# end
SW1# show errdisable recovery`} explain={[
          ['%PM-4-ERR_DISABLE', 'Log-ul spune cauza (aici port security) și portul afectat.'],
          ['show interfaces status err-disabled', 'Doar porturile err-disabled, cu motivul în coloana Reason.'],
          ['shutdown / no shutdown', 'Reactivarea manuală — DUPĂ ce ai eliminat cauza (dispozitivul neautorizat).'],
          ['errdisable recovery cause psecure-violation', 'Reactivare automată pentru această cauză (fiecare cauză se activează separat).'],
          ['errdisable recovery interval 300', 'După câte secunde se reîncearcă (300 = valoarea implicită). Dacă problema persistă, portul cade din nou.'],
          ['show errdisable recovery', 'Ce cauze au recuperare automată și cât mai durează timer-ul pentru fiecare port.'],
        ]} />
      </Detailed>

      <Detailed title="6 — Pe un router: serial up/down">
        <CodeBlock title="Nepotrivire de encapsulare" kind="session" code={`R1# show interfaces Serial0/1/0
Serial0/1/0 is up, line protocol is down
  Hardware is WIC MBRD Serial
  Internet address is 10.0.12.1/30
  Encapsulation PPP, LCP Listen, loopback not set
R1# show controllers Serial0/1/0 | include clock|DCE|DTE
DCE V.35, clock rate 2000000`} explain={[
          ['up, line protocol is down', 'L1 bun, L2 nu → compară encapsularea cu celălalt capăt.'],
          ['Encapsulation PPP, LCP Listen', <>R1 rulează <G id="ppp" />, iar negocierea LCP nu primește răspuns — probabil R2 a rămas pe <G id="hdlc" /> (implicit).</>],
          ['show controllers … DCE … clock rate', 'Confirmă care capăt e DCE și dacă are clock rate. Fără clock pe DCE, legătura nu urcă.'],
        ]} />
      </Detailed>
    </section>
  );
}
