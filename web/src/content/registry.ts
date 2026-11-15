export type TocItem = { id: string; label: string; code?: string; sub?: boolean };

/** Secțiunile fiecărui topic disponibil — folosite pentru TOC și pentru calculul progresului. */
export const TOPIC_SECTIONS: Record<string, TocItem[]> = {
  '1.11': [
    { id: 'intro', label: 'Imaginea de ansamblu', code: '1.11' },
    { id: 'rf', label: 'RF și standardele 802.11', code: '1.11.c' },
    { id: 'channels', label: 'Canale care nu se suprapun', code: '1.11.a' },
    { id: 'ssid', label: 'SSID, BSS, ESS', code: '1.11.b' },
    { id: 'encryption', label: 'Criptare WEP → WPA3', code: '1.11.d' },
    { id: 'config', label: 'Exemple de configurare' },
    { id: 'questions', label: 'Întrebări (toate)' },
    { id: 'lab-guided', label: 'Lab ghidat' },
    { id: 'lab-solo', label: 'Lab solo' },
  ],
};

export const topicProgress = (topicId: string, done: Set<string> | undefined) => {
  const s = TOPIC_SECTIONS[topicId];
  if (!s) return 0;
  return s.filter((x) => done?.has(x.id)).length / s.length;
};
