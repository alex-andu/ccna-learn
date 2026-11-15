import type { ReactNode } from 'react';

/* Mici utilitare SVG comune pentru diagramele din Domeniul 2 (2.1–2.3).
   Culori DOAR prin variabile CSS (tema dark + light). */

export const font = { fontFamily: 'Inter Variable, sans-serif' };
export const mono = { fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace' };

export const T = (p: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number; m?: boolean }) => (
  <text x={p.x} y={p.y} textAnchor={p.anchor ?? 'middle'} style={{ ...(p.m ? { ...mono, whiteSpace: 'pre' as const } : font), fill: p.color ?? 'var(--text)', fontSize: p.size ?? 12, fontWeight: p.weight ?? 500 }}>{p.children}</text>
);

export const Line = ({ x1, y1, x2, y2, c = 'var(--text-2)', w = 2, dash, flow = false }: { x1: number; y1: number; x2: number; y2: number; c?: string; w?: number; dash?: string; flow?: boolean }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeDasharray={dash} className={flow ? 'flow' : undefined} style={{ transition: 'stroke .25s' }} />
);

export const Seg = <K extends string>({ value, set, items, label }: { value: K; set: (k: K) => void; items: [K, string][]; label: string }) => (
  <div className="segmented" role="group" aria-label={label} style={{ marginBottom: 12, flexWrap: 'wrap' }}>
    {items.map(([k, l]) => <button key={k} type="button" className={value === k ? 'on' : ''} onClick={() => set(k)}>{l}</button>)}
  </div>
);

/** Culori fixe pe VLAN (doar variabile CSS). */
export const VCOL: Record<number, string> = { 10: 'var(--accent)', 20: 'var(--ok)', 30: 'var(--violet)', 40: 'var(--warn)', 99: 'var(--info)', 1: 'var(--muted)' };

export function Box({ x, y, w, h, label, sub, c = 'var(--border)', fill = 'var(--surface-3)' }: { x: number; y: number; w: number; h: number; label: string; sub?: string; c?: string; fill?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={c} strokeWidth={1.6} />
      <T x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} weight={700} size={12}>{label}</T>
      {sub && <T x={x + w / 2} y={y + h / 2 + 13} size={10} color="var(--muted)" m>{sub}</T>}
    </g>
  );
}

export function PhoneIcon({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <rect x={x - 22} y={y - 14} width={44} height={28} rx={5} fill="var(--surface-3)" stroke="var(--warn)" strokeWidth={1.6} />
      <rect x={x - 14} y={y - 8} width={28} height={9} rx={2} fill="var(--code-bg)" />
      <circle cx={x - 10} cy={y + 7} r={2} fill="var(--warn)" /><circle cx={x} cy={y + 7} r={2} fill="var(--warn)" /><circle cx={x + 10} cy={y + 7} r={2} fill="var(--warn)" />
      {label && <T x={x} y={y + 30} size={11} weight={650}>{label}</T>}
    </g>
  );
}
