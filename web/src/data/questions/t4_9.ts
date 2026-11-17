import type { Question } from '../../lib/types';

// Banca de întrebări pentru 4.9 Describe the capabilities and functions of TFTP/FTP in the network.
// Obiectivul oficial nu are sub-puncte; `sub` = '4.9'. Fiecare variantă are explicație (why).
const T = '4.9';
type Opt = [text: string, correct: boolean, why: string];
const opts = (o: Opt[]) => o.map(([text, correct, why], i) => ({ id: String.fromCharCode(97 + i), text, correct, why }));
const single = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'single', difficulty, stem, options: opts(o), explanation });
const multi = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, o: Opt[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'multi', difficulty, stem, options: opts(o), explanation });
type Pair = { left: string; right: string; why: string };
const match = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, pairs: Pair[], distractors: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'match', difficulty, stem, pairs, distractors, explanation });
const order = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, items: { text: string; why: string }[], explanation: string): Question => ({ id, topicId: T, sub: T, type: 'order', difficulty, stem, items, explanation });
const cli = ({ id }: { id: string }, difficulty: 1 | 2 | 3, stem: string, prompt: string, canonical: string, answers: string[], wrong: { text: string; why: string }[], explanation: string, hint?: string): Question => ({ id, topicId: T, sub: T, type: 'cli', difficulty, stem, prompt, canonical, answers, wrong, explanation, hint });

export const Q_4_9: Question[] = [
  // ======================= Concepte =======================
  single({ id: '4.9-001' }, 1, 'La ce se folosesc, în mod obișnuit, TFTP și FTP pe echipamentele Cisco?', [
    ['Backup/restaurare de configurații și transfer/upgrade de imagini IOS', true, 'Sunt protocoale de transfer de fișiere folosite de comanda copy.'],
    ['Alocarea de adrese IP', false, 'Aceasta este DHCP.'],
    ['Rezoluția de nume', false, 'Aceasta este DNS.'],
    ['Sincronizarea ceasului', false, 'Aceasta este NTP.'],
  ], 'TFTP/FTP = transfer de fișiere.'),
  single({ id: '4.9-002' }, 1, 'Ce transport și port folosește TFTP pentru cererea inițială?', [
    ['UDP 69', true, 'Portul standard TFTP, peste UDP.'],
    ['TCP 69', false, 'TFTP nu folosește TCP.'],
    ['UDP 21', false, 'Portul 21 este FTP (TCP).'],
    ['TCP 22', false, 'Aceasta este SSH.'],
  ], 'TFTP: UDP 69.'),
  single({ id: '4.9-003' }, 1, 'Ce porturi folosește FTP clasic?', [
    ['TCP 21 pentru control și TCP 20 pentru date (mod activ)', true, 'Două conexiuni: comenzi și date.'],
    ['UDP 69 pentru tot', false, 'Aceasta este TFTP.'],
    ['TCP 22 pentru control și 23 pentru date', false, '22 este SSH, 23 este Telnet.'],
    ['UDP 21 și 20', false, 'FTP folosește TCP.'],
  ], 'FTP: 21 control, 20 date (activ).'),
  single({ id: '4.9-004' }, 2, 'Ce obiect se salvează cu copy running-config tftp:?', [
    ['Configurația activă (din RAM) pe un server TFTP', true, 'Este un backup al configurației curente.'],
    ['Imaginea IOS', false, 'Imaginea se copiază din flash:.'],
    ['Tabela de rutare', false, 'Nu este un obiect copiabil așa.'],
    ['Cheile RSA', false, 'Nu se salvează cu această comandă.'],
  ], 'running-config → server.'),
  single({ id: '4.9-005' }, 2, 'Unde este stocată, în mod normal, imaginea IOS a unui router?', [
    ['În flash', true, 'flash:/bootflash: păstrează imaginea.'],
    ['În NVRAM', false, 'NVRAM păstrează startup-config.'],
    ['În RAM, permanent', false, 'RAM se golește la reload.'],
    ['În tabela ARP', false, 'ARP nu stochează fișiere.'],
  ], 'IOS în flash; startup-config în NVRAM.'),
  single({ id: '4.9-006' }, 1, 'Ce autentificare oferă TFTP?', [
    ['Niciuna', true, 'Orice client poate cere sau trimite fișiere, dacă serverul permite.'],
    ['Utilizator și parolă', false, 'Aceasta este FTP.'],
    ['Certificate', false, 'Nu există certificate în TFTP.'],
    ['Cheie pre-partajată', false, 'Nu există.'],
  ], 'TFTP = fără autentificare.'),
  single({ id: '4.9-007' }, 2, 'Cum confirmă TFTP datele primite?', [
    ['Fiecare bloc de date (de regulă 512 octeți) este confirmat cu ACK înainte de următorul', true, 'Mod „lock-step”.'],
    ['Cu o fereastră glisantă ca TCP', false, 'TFTP nu are fereastră glisantă.'],
    ['Nu confirmă nimic', false, 'Confirmă fiecare bloc.'],
    ['Cu un singur ACK la sfârșit', false, 'ACK-urile sunt per bloc.'],
  ], 'TFTP: bloc → ACK.'),
  single({ id: '4.9-008' }, 2, 'Cum află TFTP că transferul s-a terminat?', [
    ['Un bloc de date mai mic de 512 octeți marchează finalul', true, 'Blocul scurt este ultimul.'],
    ['Serverul trimite mesajul „Done”', false, 'Nu există un astfel de mesaj.'],
    ['Conexiunea TCP se închide', false, 'TFTP nu folosește TCP.'],
    ['Clientul trimite FIN', false, 'FIN este un flag TCP.'],
  ], 'Ultimul bloc < 512 B.'),
  single({ id: '4.9-009' }, 2, 'Ce rol are conexiunea de control FTP?', [
    ['Transportă comenzile și autentificarea (TCP 21)', true, 'Datele trec pe o conexiune separată.'],
    ['Transportă conținutul fișierelor', false, 'Conținutul merge pe conexiunea de date.'],
    ['Criptează datele', false, 'FTP clasic nu criptează.'],
    ['Asignează adrese IP', false, 'Nu are legătură cu DHCP.'],
  ], 'Control = comenzi; date = fișier.'),
  single({ id: '4.9-010' }, 2, 'În modul activ FTP, cine inițiază conexiunea de date?', [
    ['Serverul, către client', true, 'Folosește portul 20 sursă; firewall-urile clientului o blochează adesea.'],
    ['Clientul, către server', false, 'Aceasta este modul pasiv.'],
    ['Routerul intermediar', false, 'Un router nu inițiază datele FTP.'],
    ['Nimeni, datele trec pe canalul de control', false, 'FTP separă datele de control.'],
  ], 'Activ: server → client.'),
  single({ id: '4.9-011' }, 2, 'De ce este preferat modul pasiv FTP în spatele unui NAT/firewall?', [
    ['Clientul deschide ambele conexiuni, deci nu se așteaptă conexiuni intrante', true, 'Firewall-ul clientului permite conexiuni ieșite.'],
    ['Pentru că este criptat', false, 'Pasiv nu înseamnă criptat.'],
    ['Pentru că folosește UDP', false, 'FTP folosește TCP.'],
    ['Pentru că nu necesită autentificare', false, 'Autentificarea rămâne.'],
  ], 'Pasiv = client inițiază totul.'),
  single({ id: '4.9-012' }, 1, 'Ce se întâmplă cu parola în FTP clasic?', [
    ['Se transmite în text clar pe canalul de control', true, 'FTP nu criptează.'],
    ['Se criptează cu RSA', false, 'Nu are criptare nativă.'],
    ['Nu se trimite deloc', false, 'Se trimite pentru autentificare.'],
    ['Se trimite cu hash MD5', false, 'FTP nu folosește hash.'],
  ], 'FTP = parolă în clar.'),
  single({ id: '4.9-013' }, 2, 'Cum faci backup la imaginea IOS pe un server TFTP?', [
    ['copy flash: tftp:', true, 'Sursa este flash, destinația serverul.'],
    ['copy running-config tftp:', false, 'Aceasta salvează configurația, nu imaginea.'],
    ['copy tftp: flash:', false, 'Aceasta aduce o imagine de pe server.'],
    ['copy startup-config flash:', false, 'Nu salvează imaginea.'],
  ], 'copy flash: tftp: = backup imagine.'),
  single({ id: '4.9-014' }, 3, 'Ce efect are copy tftp: running-config?', [
    ['Îmbină liniile din fișier cu configurația activă', true, 'Liniile care lipsesc din fișier rămân.'],
    ['Înlocuiește complet running-config', false, 'Nu: se îmbină.'],
    ['Șterge startup-config', false, 'Nu atinge startup-config.'],
    ['Repornește routerul', false, 'Nu face reload.'],
  ], 'running-config = merge.'),
  single({ id: '4.9-015' }, 2, 'La ce folosește verify /md5 flash:<imagine>?', [
    ['Verifică integritatea imaginii copiate, comparând hash-ul cu cel publicat', true, 'Un hash diferit înseamnă fișier corupt.'],
    ['Criptează imaginea', false, 'Doar calculează un hash.'],
    ['Setează imaginea de boot', false, 'Aceasta este boot system.'],
    ['Șterge imaginea veche', false, 'Șterge delete, nu verify.'],
  ], 'verify /md5 = integritate.'),
  single({ id: '4.9-016' }, 2, 'Care este ordinea corectă a unui upgrade de IOS?', [
    ['Verifică flash → copiază imaginea → verifică MD5 → boot system → salvează și reload', true, 'Ordinea standard.'],
    ['reload → copiază imaginea → verifică flash', false, 'Reload-ul vine la sfârșit.'],
    ['boot system → ștergere flash → copiază', false, 'Ștergerea fără verificare este riscantă.'],
    ['Copiază fără a verifica spațiul sau hash-ul', false, 'Verificările previn eșecuri.'],
  ], 'Flash → copy → md5 → boot → reload.'),
  single({ id: '4.9-017' }, 2, 'Ce comandă arată spațiul liber din flash?', [
    ['dir flash: sau show flash:', true, 'Listează fișierele și spațiul liber.'],
    ['show ip route', false, 'Este tabela de rutare.'],
    ['show running-config', false, 'Arată configurația.'],
    ['show vlan', false, 'Arată VLAN-urile.'],
  ], 'dir/show flash:.'),
  single({ id: '4.9-018' }, 2, 'Ce este SFTP?', [
    ['Un protocol de transfer de fișiere peste SSH (TCP 22)', true, 'Este diferit de FTP, nu „FTP cu securitate”.'],
    ['FTP peste UDP', false, 'FTP folosește TCP; SFTP este peste SSH.'],
    ['Versiunea simplificată a TFTP', false, 'Nu are legătură cu TFTP.'],
    ['FTP cu compresie', false, 'Nu are legătură cu compresia.'],
  ], 'SFTP = peste SSH.'),
  single({ id: '4.9-019' }, 3, 'Care este alternativa securizată la TFTP/FTP menționată pentru backup de configurații?', [
    ['SCP sau SFTP (peste SSH)', true, 'Criptate și autentificate.'],
    ['Telnet', false, 'Telnet nu este un protocol de transfer și nu este sigur.'],
    ['HTTP simplu', false, 'Nu este criptat.'],
    ['ICMP', false, 'Nu transportă fișiere.'],
  ], 'SCP/SFTP.'),
  single({ id: '4.9-020' }, 2, 'Ce arată linia „System image file is …” din show version?', [
    ['Fișierul-imagine din care a pornit routerul', true, 'Confirmă versiunea activă.'],
    ['Fișierul de backup al configurației', false, 'Nu arată backup-uri.'],
    ['Imaginea de pe server', false, 'Arată imaginea locală.'],
    ['Numele serverului TFTP', false, 'Nu are legătură.'],
  ], 'show version = imaginea de boot.'),
  single({ id: '4.9-021' }, 2, 'Cum setezi credențialele pentru un transfer FTP inițiat de router?', [
    ['ip ftp username <u> și ip ftp password <p>', true, 'Folosite de clientul FTP al routerului.'],
    ['ftp login <u> <p>', false, 'Nu este sintaxă IOS.'],
    ['username ftp secret <p>', false, 'Aceasta definește un utilizator local, nu credențialele FTP.'],
    ['snmp-server community <p>', false, 'Aceasta este SNMP.'],
  ], 'ip ftp username/password.'),
  single({ id: '4.9-022' }, 2, 'Ce face ip ftp passive?', [
    ['Folosește modul pasiv pentru conexiunea de date', true, 'Clientul deschide conexiunea de date.'],
    ['Dezactivează FTP', false, 'Nu dezactivează.'],
    ['Criptează FTP', false, 'FTP nu devine criptat.'],
    ['Cere parola o singură dată', false, 'Nu are legătură cu parola.'],
  ], 'ip ftp passive.'),
  single({ id: '4.9-023' }, 3, 'Un server TFTP este în altă subrețea decât routerul client. Ce este necesar?', [
    ['Rută/gateway pentru ca pachetele UDP să circule în ambele sensuri', true, 'Transferul necesită conectivitate IP completă.'],
    ['Un server DHCP', false, 'Nu este necesar.'],
    ['Un trunk 802.1Q', false, 'Nu are legătură.'],
    ['NAT obligatoriu', false, 'Nu este obligatoriu.'],
  ], 'Fără conectivitate IP, transferul nu pornește.'),
  single({ id: '4.9-024' }, 2, 'Pe ce port răspunde serverul TFTP cu date după prima cerere?', [
    ['Pe un port efemer ales de server, nu pe 69', true, 'Portul 69 primește doar cererea inițială.'],
    ['Tot pe 69', false, 'Datele merg pe alt port.'],
    ['Pe TCP 20', false, 'TCP 20 este FTP.'],
    ['Pe 161', false, '161 este SNMP.'],
  ], 'TFTP: date pe port efemer.'),
  single({ id: '4.9-025' }, 2, 'Ce comandă setează imaginea din care pornește routerul?', [
    ['boot system flash:<imagine>', true, 'Se salvează în startup-config.'],
    ['copy flash: boot', false, 'Nu există această comandă.'],
    ['verify flash:<imagine>', false, 'Verifică, nu setează.'],
    ['reload flash:<imagine>', false, 'reload nu are acest argument.'],
  ], 'boot system.'),
  single({ id: '4.9-026' }, 3, 'Ce se întâmplă dacă imaginea nouă nu încape în flash?', [
    ['Transferul eșuează sau trebuie eliberat spațiu (delete) înainte', true, 'Spațiul liber trebuie verificat în prealabil.'],
    ['Routerul o comprimă automat', false, 'Nu se comprimă automat.'],
    ['Imaginea se stochează în RAM', false, 'Nu este stocată permanent în RAM.'],
    ['Transferul reușește, dar imaginea se pierde la boot', false, 'Nu aceasta este comportamentul tipic.'],
  ], 'Verifică spațiul liber.'),
  single({ id: '4.9-027' }, 3, 'De ce poate un transfer TFTP să eșueze deși ping-ul către server funcționează?', [
    ['Serviciul TFTP este oprit sau UDP 69 este blocat/fișierul lipsește', true, 'ICMP nu depinde de serviciul TFTP.'],
    ['TFTP folosește ICMP pentru date', false, 'Nu folosește ICMP.'],
    ['Ping-ul și TFTP sunt același protocol', false, 'Sunt protocoale diferite.'],
    ['Routerul nu poate fi client TFTP', false, 'Poate, prin copy.'],
  ], 'Ping ≠ serviciu.'),
  single({ id: '4.9-028' }, 3, 'Ce înseamnă „!” într-un transfer copy tftp: flash:?', [
    ['Un bloc primit cu succes', true, 'Se afișează câte un ! per bloc.'],
    ['O eroare de transfer', false, 'O eroare ar fi marcată cu alt simbol (de exemplu ., sau un mesaj).'],
    ['Sfârșitul fișierului', false, 'Nu marchează finalul.'],
    ['O cerere de parolă', false, 'Nu este o cerere.'],
  ], '! = bloc primit.'),

  // ======================= Multi =======================
  multi({ id: '4.9-029' }, 2, 'Care afirmații despre TFTP sunt adevărate? (alege toate variantele corecte)', [
    ['Folosește UDP', true, 'Peste UDP 69.'],
    ['Nu are autentificare', true, 'Orice client poate cere fișiere dacă serverul permite.'],
    ['Nu criptează datele', true, 'Traficul este în clar.'],
    ['Transferă blocuri confirmate unul câte unul', true, 'Lock-step cu ACK.'],
    ['Cere utilizator și parolă', false, 'Aceasta este FTP.'],
  ], 'TFTP: UDP, simplu, fără securitate.'),
  multi({ id: '4.9-030' }, 2, 'Care afirmații despre FTP sunt adevărate? (alege toate variantele corecte)', [
    ['Folosește TCP', true, 'Fiabil, peste TCP.'],
    ['Are conexiune de control și conexiune de date', true, 'Două conexiuni.'],
    ['Autentifică cu utilizator și parolă', true, 'Dar în clar.'],
    ['Este criptat implicit', false, 'FTP clasic nu criptează.'],
  ], 'FTP: TCP, două conexiuni, autentificare în clar.'),
  multi({ id: '4.9-031' }, 3, 'Ce se poate transfera cu comanda copy între router și server? (alege toate variantele corecte)', [
    ['running-config', true, 'Backup/restaurare configurație activă.'],
    ['startup-config', true, 'Backup/restaurare configurație salvată.'],
    ['Imaginea IOS din flash', true, 'Backup/upgrade.'],
    ['Tabela MAC dinamică', false, 'Nu se transferă ca fișier.'],
  ], 'Configurații și imagini.'),

  // ======================= Match =======================
  match({ id: '4.9-032' }, 2, 'Potrivește protocolul cu caracteristica lui.', [
    { left: 'TFTP', right: 'UDP 69, fără autentificare', why: 'Simplu, fără securitate.' },
    { left: 'FTP', right: 'TCP 21/20, utilizator și parolă', why: 'Control + date, autentificare în clar.' },
    { left: 'SFTP', right: 'Transfer peste SSH (TCP 22)', why: 'Criptat și autentificat.' },
    { left: 'SCP', right: 'Copiere de fișiere prin SSH', why: 'Criptat, bazat pe SSH.' },
  ], [
    { text: 'DHCP relay', why: 'Nu este un protocol de transfer de fișiere.' },
  ], 'TFTP, FTP, SFTP, SCP.'),
  match({ id: '4.9-033' }, 2, 'Potrivește comanda cu efectul ei.', [
    { left: 'copy running-config tftp:', right: 'Backup al configurației active pe server', why: 'RAM → server.' },
    { left: 'copy tftp: startup-config', right: 'Înlocuiește startup-config', why: 'Efect după reload.' },
    { left: 'copy tftp: flash:', right: 'Aduce o imagine IOS în flash', why: 'Upgrade.' },
    { left: 'verify /md5 flash:<imagine>', right: 'Verifică integritatea imaginii', why: 'Compară hash-ul.' },
  ], [
    { text: 'Șterge configurația', why: 'Aceasta este erase startup-config.' },
  ], 'Fiecare comandă are un efect precis.'),

  // ======================= Order =======================
  order({ id: '4.9-034' }, 2, 'Ordonează pașii unui upgrade de IOS.', [
    { text: 'Verifici spațiul din flash (dir flash:)', why: 'Imaginea trebuie să încapă.' },
    { text: 'Copiezi imaginea (copy tftp: flash:)', why: 'Aduci fișierul de pe server.' },
    { text: 'Verifici hash-ul (verify /md5)', why: 'Confirmi integritatea.' },
    { text: 'Setezi imaginea de boot (boot system)', why: 'Spui ce imagine să încarce.' },
    { text: 'Salvezi configurația și repornești (reload)', why: 'Activezi noua versiune.' },
  ], 'Flash → copy → md5 → boot system → reload.'),
  order({ id: '4.9-035' }, 3, 'Ordonează un transfer TFTP (citire a unui fișier de către client).', [
    { text: 'Clientul trimite cererea de citire (RRQ) la UDP 69', why: 'Începe schimbul.' },
    { text: 'Serverul trimite blocul 1 de pe un alt port', why: 'Primul bloc de date.' },
    { text: 'Clientul confirmă blocul 1 (ACK)', why: 'Lock-step.' },
    { text: 'Se repetă bloc → ACK', why: 'Pentru fiecare bloc.' },
    { text: 'Ultimul bloc (< 512 B) închide transferul', why: 'Blocul scurt marchează finalul.' },
  ], 'RRQ → DATA/ACK → ultim bloc scurt.'),

  // ======================= CLI =======================
  cli({ id: '4.9-036' }, 2, 'Ești în R1#. Salvează configurația activă pe un server TFTP.', 'R1#', 'copy running-config tftp:', ['copy running-config tftp:', 'copy running-config tftp', 'copy run tftp'], [
    { text: 'copy startup-config tftp:', why: 'Aceasta salvează configurația din NVRAM, nu cea activă.' },
    { text: 'copy tftp: running-config', why: 'Direcția este inversă (restaurare).' },
    { text: 'backup running-config tftp:', why: 'Nu este comandă IOS.' },
  ], 'copy running-config tftp:.', 'copy running-config …'),
  cli({ id: '4.9-037' }, 2, 'Ești în R1#. Copiază o imagine IOS de pe serverul TFTP în flash.', 'R1#', 'copy tftp: flash:', ['copy tftp: flash:', 'copy tftp flash:', 'copy tftp flash'], [
    { text: 'copy flash: tftp:', why: 'Direcția este inversă (backup al imaginii).' },
    { text: 'copy tftp: startup-config', why: 'Destinația este configurația, nu flash.' },
    { text: 'upgrade tftp: flash:', why: 'Nu este comandă IOS.' },
  ], 'copy tftp: flash:.', 'copy tftp: …'),
  cli({ id: '4.9-038' }, 2, 'Ești în R1(config)#. Setează utilizatorul „backup” pentru transferurile FTP ale routerului.', 'R1(config)#', 'ip ftp username backup', ['ip ftp username backup'], [
    { text: 'ftp username backup', why: 'Comanda începe cu ip.' },
    { text: 'username backup secret …', why: 'Definește un utilizator local, nu credențialele FTP.' },
    { text: 'ip ftp login backup', why: 'Nu este sintaxa corectă.' },
  ], 'ip ftp username <u>.', 'ip ftp username …'),
  cli({ id: '4.9-039' }, 3, 'Ești în R1#. Verifică integritatea imaginii flash:ios.bin cu MD5.', 'R1#', 'verify /md5 flash:ios.bin', ['verify /md5 flash:ios.bin'], [
    { text: 'verify flash:ios.bin md5', why: 'Opțiunea /md5 vine înaintea fișierului.' },
    { text: 'show md5 flash:ios.bin', why: 'Nu este comandă IOS.' },
    { text: 'verify /sha flash:ios.bin', why: 'Opțiunea clasică folosită aici este /md5.' },
  ], 'verify /md5 flash:<fișier>.', 'verify /md5 …'),
  cli({ id: '4.9-040' }, 3, 'Ești în R1(config)#. Indică imaginea flash:ios.bin pentru următorul boot.', 'R1(config)#', 'boot system flash:ios.bin', ['boot system flash:ios.bin'], [
    { text: 'boot flash:ios.bin', why: 'Lipsește cuvântul system.' },
    { text: 'boot system ios.bin', why: 'Trebuie specificat sistemul de fișiere (flash:).' },
    { text: 'set boot flash:ios.bin', why: 'Nu este sintaxă IOS.' },
  ], 'boot system flash:<fișier>.', 'boot system …'),
];
