import type { Fact } from '../flashcards';

// Fapte esențiale pentru 4.2 NTP
export const FACTS: Fact[] = [
  { topicId: '4.2', id: 'f-4.2-01', front: 'Ce face NTP și ce port folosește?', back: 'Sincronizează ceasurile · UDP 123', detail: 'Necesar pentru log-uri corelabile, certificate, audit.' },
  { topicId: '4.2', id: 'f-4.2-02', front: 'Ce este stratum?', back: 'Numărul de salturi până la sursa de referință (0 = referința)', detail: 'Un client al unui server stratum n devine n+1.' },
  { topicId: '4.2', id: 'f-4.2-03', front: 'Valorile limită ale stratum', back: 'Max utilizabil 15 · 16 = nesincronizat', detail: '16 nu înseamnă „foarte precis”.' },
  { topicId: '4.2', id: 'f-4.2-04', front: 'Comanda pentru client NTP', back: 'ntp server <ip> [prefer]', detail: 'Se poate adăuga key N pentru autentificare.' },
  { topicId: '4.2', id: 'f-4.2-05', front: 'Comanda pentru sursă de laborator', back: 'ntp master [stratum]', detail: 'Dispozitivul se declară sursă chiar dacă nu e sincronizat extern.' },
  { topicId: '4.2', id: 'f-4.2-06', front: 'Moduri NTP pe Cisco', back: 'Client · server/master · peer (symmetric active) · broadcast', detail: 'La CCNA contează client și server.' },
  { topicId: '4.2', id: 'f-4.2-07', front: 'Cele patru marcaje de timp NTP', back: 'T1 trimitere cerere · T2 recepție server · T3 trimitere răspuns · T4 recepție client', detail: 'Din ele rezultă offset și delay.' },
  { topicId: '4.2', id: 'f-4.2-08', front: 'Formula offset-ului', back: '((T2 − T1) + (T3 − T4)) / 2', detail: 'Delay = (T4 − T1) − (T3 − T2).' },
  { topicId: '4.2', id: 'f-4.2-09', front: 'Verificarea sincronizării', back: 'show ntp status · show ntp associations · show clock detail', detail: '„Clock is synchronized” + stratum + reference.' },
  { topicId: '4.2', id: 'f-4.2-10', front: 'Ce înseamnă * în show ntp associations?', back: 'Serverul ales ca sursă de sincronizare (sys.peer)', detail: '~ = asociere configurată manual.' },
  { topicId: '4.2', id: 'f-4.2-11', front: 'Reach 377 vs 0', back: '377 = ultimele 8 interogări au reușit · 0 = niciun răspuns', detail: 'Octal, registru pe 8 biți.' },
  { topicId: '4.2', id: 'f-4.2-12', front: 'Cât durează prima sincronizare?', back: 'De obicei câteva minute', detail: 'Imediat după configurare apare adesea „unsynchronized”.' },
  { topicId: '4.2', id: 'f-4.2-13', front: 'Fus orar și NTP', back: 'NTP transportă UTC; fusul se setează local cu clock timezone', detail: 'Ora afișată greșit cu o oră = fus/ora de vară.' },
  { topicId: '4.2', id: 'f-4.2-14', front: 'Timestamps în log', back: 'service timestamps log datetime msec', detail: 'Fără ele, log-urile nu au dată și oră.' },
  { topicId: '4.2', id: 'f-4.2-15', front: 'Autentificare NTP — comenzile', back: 'ntp authenticate · ntp authentication-key N md5 <parola> · ntp trusted-key N · ntp server <ip> key N', detail: 'Cheile trebuie identice pe ambele părți.' },
  { topicId: '4.2', id: 'f-4.2-16', front: 'Ceas software vs calendar hardware', back: 'NTP actualizează ceasul software; ntp update-calendar îl copiază în calendarul hardware', detail: 'Calendarul păstrează ora când echipamentul e oprit.' },
];
