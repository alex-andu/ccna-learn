import { useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import { Icon } from '../components/Icon';
import attribution from '../../public/img/wiki/attribution.json';

export function Settings() {
  const { theme, setTheme, settings, saveSettings, online } = useStore();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const doImport = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      if (!confirm('Importul ÎNLOCUIEȘTE toate datele actuale (progres, scoruri, notițe). Continui?')) return;
      await api.importBackup(data); setMsg('Import reușit — se reîncarcă…'); setTimeout(() => location.reload(), 800);
    } catch { setMsg('Fișier invalid sau eroare la import.'); }
  };
  return (
    <div className="page narrow">
      <h1>Setări & backup</h1>
      <div className="stack">
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Aspect</h3>
          <div className="segmented" style={{ width: 'fit-content' }}>
            <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}><Icon name="moon" size={14} /> Dark</button>
            <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}><Icon name="sun" size={14} /> Light</button>
          </div>
        </div>
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Obiective de studiu</h3>
          <label className="field">Întrebări pe zi: <b style={{ color: 'var(--text)' }}>{settings.dailyGoal ?? 20}</b>
            <input type="range" min={5} max={100} step={5} value={settings.dailyGoal ?? 20} onChange={(e) => saveSettings({ dailyGoal: +e.target.value })} style={{ accentColor: 'var(--accent)' }} /></label>
          <label className="field">Flashcards noi pe zi: <b style={{ color: 'var(--text)' }}>{settings.newCardsPerDay ?? 20}</b>
            <input type="range" min={5} max={60} step={5} value={settings.newCardsPerDay ?? 20} onChange={(e) => saveSettings({ newCardsPerDay: +e.target.value })} style={{ accentColor: 'var(--accent)' }} /></label>
        </div>
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Backup</h3>
          <p className="small muted" style={{ margin: 0 }}>Datele stau în SQLite pe Raspberry Pi (<code>data/ccna.db</code>). Pe lângă backup-ul automat nocturn de pe server, poți exporta manual un fișier JSON.</p>
          <div className="row">
            <a className="btn" href="/api/export"><Icon name="download" />Exportă JSON</a>
            <button className="btn" onClick={() => file.current?.click()}><Icon name="upload" />Importă JSON</button>
            <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
          </div>
          {msg && <div className="small">{msg}</div>}
          <div className="small">Server: {online ? <span className="badge ok">conectat</span> : <span className="badge bad">indisponibil</span>}</div>
        </div>
        <div className="card">
          <h3>Surse și licențe</h3>
          <ul className="small">
            <li>Structura curriculumului: Cisco CCNA 200-301 v1.1 Exam Topics (© 2024 Cisco Systems, Inc. — Cisco Public). Platforma nu este afiliată Cisco.</li>
            <li>Spaced repetition: <a href="https://github.com/open-spaced-repetition/ts-fsrs" target="_blank" rel="noreferrer">ts-fsrs</a> (MIT).</li>
            <li>Fonturi: Inter, JetBrains Mono (SIL OFL), incluse local.</li>
            {Object.values(attribution as Record<string, any>).map((a) => (
              <li key={a.title}>Foto „{a.title}” — {a.author}, <a href={a.licenseUrl} target="_blank" rel="noreferrer">{a.license}</a>, via <a href={a.source} target="_blank" rel="noreferrer">Wikimedia Commons</a>.</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
