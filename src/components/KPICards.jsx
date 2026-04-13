function KPICard({ label, value, valueColor, sub, accent, glow }) {
  return (
    <div style={{
      flex: 1, padding: '14px 18px',
      background: 'var(--bg-panel)',
      border: '1px solid var(--border)',
      borderTop: `2px solid ${accent}`,
      borderRadius: '6px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: glow, filter: 'blur(24px)', pointerEvents: 'none',
      }} />
      <div style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: 700, lineHeight: 1, color: valueColor || 'var(--text-primary)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px', letterSpacing: '0.1em' }}>{sub}</div>}
    </div>
  )
}

export default function KPICards({ activeBets, valueBets = [] }) {
  const avgEdge = valueBets.length
    ? (valueBets.reduce((s, b) => s + b.edge, 0) / valueBets.length).toFixed(1)
    : '—'
  const totalWager = valueBets.reduce((s, b) => s + b.wager, 0)

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <KPICard
        label="Active Value Bets"
        value={activeBets}
        valueColor="var(--gold-400)"
        sub="Positive EV detected"
        accent="var(--gold-500)"
        glow="rgba(245,158,11,0.12)"
      />
      <KPICard
        label="Avg Edge — Flagged Bets"
        value={avgEdge !== '—' ? `+${avgEdge}%` : '—'}
        valueColor="var(--green-400)"
        sub="Above closing line"
        accent="var(--green-500)"
        glow="rgba(16,185,129,0.1)"
      />
      <KPICard
        label="Total Rec. Exposure"
        value={totalWager > 0 ? `$${totalWager.toLocaleString()}` : '$0'}
        valueColor="var(--blue-400)"
        sub="Half-Kelly sizing"
        accent="var(--blue-500)"
        glow="rgba(59,130,246,0.1)"
      />
      <KPICard
        label="Data Source"
        value="LIVE"
        valueColor="var(--green-400)"
        sub="The Odds API · ESPN"
        accent="var(--green-500)"
        glow="rgba(16,185,129,0.1)"
      />
    </div>
  )
}
