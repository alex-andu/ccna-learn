import { useState } from 'react';
import { calc, compress6, expand6, prefix6, randomTask, type6, ipToInt } from '../lib/subnet';
import { Table } from '../components/Lesson';
import { api } from '../lib/api';
import { useStore } from '../lib/store';

export function Subnetting() {
  const [tab, setTab] = useState<'calc' | 'drill' | 'v6'>('calc');
  return (
    <div className="page narrow">
      <h1>Subnetting</h1>
      <p className="muted">Calculator IPv4/IPv6 cu explicații în binar și exerciții generate la infinit (pregătire pentru topicurile 1.6–1.9).</p>
      <div className="tabs" style={{ margin: '12px 0 18px', width: 'fit-content' }}>
        <button className={tab === 'calc' ? 'on' : ''} onClick={() => setTab('calc')}>Calculator IPv4</button>
        <button className={tab === 'drill' ? 'on' : ''} onClick={() => setTab('drill')}>Drill</button>
        <button className={tab === 'v6' ? 'on' : ''} onClick={() => setTab('v6')}>IPv6</button>
      </div>
      {tab === 'calc' && <Calc />}
      {tab === 'drill' && <Drill />}
      {tab === 'v6' && <V6 />}
    </div>
  );
}

function Result({ r }: { r: NonNullable<ReturnType<typeof calc>> }) {
  return (
    <>
      <Table head={['Câmp', 'Valoare']} rows={[
        ['Adresă / prefix', `${r.ip}/${r.prefix}`], ['Mască', r.mask], ['Wildcard (ACL/OSPF)', r.wildcard],
        ['Rețea (network)', r.network], ['Broadcast', r.broadcast], ['Prima gazdă', r.first], ['Ultima gazdă', r.last],
        ['Gazde utilizabile', `${r.hosts.toLocaleString('ro-RO')}  (2^${32 - r.prefix}${r.prefix < 31 ? ' − 2' : ''})`],
        ['Clasă (istoric) / privat', `${r.cls} · ${r.priv ? 'privat RFC 1918' : 'public / special'}`],
      ]} hlCol={1} />
      <div className="code"><div className="code-h">binar</div><pre>{`IP      ${r.ipBin}\nmască   ${r.maskBin}\nrețea   ${r.netBin}   (IP AND mască)`}</pre></div>
      {r.block && <p className="small">Metoda rapidă: octetul „interesant” este al <b>{r.interestingOctet}</b>-lea, iar dimensiunea blocului este <b>256 − {256 - r.block} = {r.block}</b>. Rețelele încep la multipli de {r.block} în acel octet.</p>}
    </>
  );
}

function Calc() {
  const [ip, setIp] = useState('192.168.10.77');
  const [p, setP] = useState(26);
  const r = calc(ip, p);
  return (
    <div className="card stack">
      <div className="grid c2">
        <label className="field">Adresă IPv4<input className="input mono" value={ip} onChange={(e) => setIp(e.target.value)} /></label>
        <label className="field">Prefix: /{p}<input type="range" min={0} max={32} value={p} onChange={(e) => setP(+e.target.value)} style={{ accentColor: 'var(--accent)' }} /></label>
      </div>
      {r ? <Result r={r} /> : <p className="small" style={{ color: 'var(--bad)' }}>Adresă invalidă.</p>}
    </div>
  );
}

function Drill() {
  const { bumpStats } = useStore();
  const [task, setTask] = useState(randomTask);
  const [ans, setAns] = useState({ network: '', broadcast: '', hosts: '' });
  const [shown, setShown] = useState(false);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const r = calc(task.ip, task.prefix)!;
  const checks = { network: ipToInt(ans.network) === ipToInt(r.network), broadcast: ipToInt(ans.broadcast) === ipToInt(r.broadcast), hosts: Number(ans.hosts) === r.hosts };
  const allOk = checks.network && checks.broadcast && checks.hosts;
  const verify = () => {
    setShown(true); setScore((s) => ({ ok: s.ok + (allOk ? 1 : 0), total: s.total + 1 }));
    api.attempt({ questionId: `subnet:${task.ip}/${task.prefix}`, topicId: '1.6', mode: 'drill', correct: allOk, answer: ans }).then(bumpStats).catch(() => {});
  };
  const next = () => { setTask(randomTask()); setAns({ network: '', broadcast: '', hosts: '' }); setShown(false); };
  const field = (k: keyof typeof ans, label: string) => (
    <label className="field">{label}
      <input className="input mono" value={ans[k]} disabled={shown} onChange={(e) => setAns({ ...ans, [k]: e.target.value })}
        style={shown ? { borderColor: checks[k] ? 'var(--ok)' : 'var(--bad)' } : undefined} onKeyDown={(e) => e.key === 'Enter' && !shown && verify()} />
      {shown && !checks[k] && <span className="tiny" style={{ color: 'var(--bad)' }}>corect: {k === 'hosts' ? r.hosts : r[k]}</span>}
    </label>
  );
  return (
    <div className="card stack">
      <div className="row between"><h3 style={{ margin: 0 }}>Calculează pentru <span className="mono" style={{ color: 'var(--accent)' }}>{task.ip}/{task.prefix}</span></h3><span className="badge">{score.ok}/{score.total}</span></div>
      <div className="grid c3">{field('network', 'Adresa de rețea')}{field('broadcast', 'Broadcast')}{field('hosts', 'Gazde utilizabile')}</div>
      <div className="row">
        {!shown ? <button className="btn primary" onClick={verify}>Verifică</button> : <button className="btn primary" onClick={next}>Următorul →</button>}
        {!shown && <button className="btn" onClick={() => setShown(true)}>Arată rezolvarea</button>}
      </div>
      {shown && (
        <div className="fade-up">
          <div className={`q-verdict ${allOk ? 'ok' : 'bad'}`}>{allOk ? 'Corect!' : 'Verifică rezolvarea pas cu pas:'}</div>
          <ol className="small" style={{ marginTop: 12 }}>
            <li>/{task.prefix} → mască <b>{r.mask}</b>.{r.block && <> Octetul interesant: al {r.interestingOctet}-lea; bloc = 256 − {256 - r.block} = <b>{r.block}</b>.</>}</li>
            {r.block && <li>Valoarea din octetul {r.interestingOctet} al IP-ului este <b>{task.ip.split('.')[r.interestingOctet! - 1]}</b>; cel mai mare multiplu de {r.block} ≤ acea valoare este <b>{r.network.split('.')[r.interestingOctet! - 1]}</b> → rețea <b>{r.network}</b>.</li>}
            <li>Broadcast = următoarea rețea − 1 → <b>{r.broadcast}</b>.</li>
            <li>Gazde = 2^(32 − {task.prefix}) − 2 = 2^{32 - task.prefix} − 2 = <b>{r.hosts}</b>.</li>
          </ol>
          <Result r={r} />
        </div>
      )}
    </div>
  );
}

function V6() {
  const [a, setA] = useState('2001:db8:acad:0001:0000:0000:0000:0010');
  const [p, setP] = useState(64);
  const full = expand6(a);
  return (
    <div className="card stack">
      <div className="grid c2">
        <label className="field">Adresă IPv6<input className="input mono" value={a} onChange={(e) => setA(e.target.value)} /></label>
        <label className="field">Prefix: /{p}<input type="range" min={0} max={128} value={p} onChange={(e) => setP(+e.target.value)} style={{ accentColor: 'var(--accent)' }} /></label>
      </div>
      {full ? (
        <Table head={['Câmp', 'Valoare']} hlCol={1} rows={[
          ['Formă completă', <span className="mono">{full}</span>], ['Formă comprimată', <span className="mono">{compress6(full)}</span>],
          ['Tip', type6(full)], ['Prefix (rețea)', <span className="mono">{compress6(prefix6(full, p))}/{p}</span>],
        ]} />
      ) : <p className="small" style={{ color: 'var(--bad)' }}>Adresă IPv6 invalidă.</p>}
      <p className="small muted">Reguli de comprimare: (1) elimini zerourile de la începutul fiecărui hextet; (2) înlocuiești cel mai lung șir de hexteturi 0 consecutive cu <code>::</code>, o singură dată.</p>
    </div>
  );
}
