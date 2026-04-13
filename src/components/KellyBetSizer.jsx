import { useState, useMemo } from 'react'

function calcKelly(bankroll, winProbPct, americanOdds) {
  const p = winProbPct / 100
  const q = 1 - p
  // net profit per $1 wagered
  const b = americanOdds < 0
    ? 100 / Math.abs(americanOdds)
    : americanOdds / 100
  const k = (p * b - q) / b
  const full = Math.max(0, Math.round(k * bankroll))
  return { full, half: Math.round(full / 2), quarter: Math.round(full / 4) }
}

const KELLY_OPTIONS = [
  { key: 'full',    label: 'Full Kelly',    warn: '⚠ HIGH VARIANCE',   warnColor: 'var(--red-400)' },
  { key: 'half',    label: 'Half Kelly',    warn: 'RECOMMENDED ✓',      warnColor: 'var(--green-400)' },
  { key: 'quarter', label: 'Quarter Kelly', warn: 'CONSERVATIVE',        warnColor: 'var(--text-dim)' },
]

export default function KellyBetSizer() {
  const [bankroll, setBankroll] = useState(10000)
  const [winProb, setWinProb]   = useState(54)
  const [odds, setOdds]         = useState(-110)
  const [selected, setSelected] = useState('half')

  const bets = useMemo(() => calcKelly(bankroll, winProb, odds), [bankroll, winProb, odds])
  const selectedAmt = bets[selected]

  return (
    <div className="panel">
      <div className="panel-header">
        <span style={{ color: 'var(--gold-400)', fontSize: '12px' }}>◈</span>
        KELLY BET SIZER
      </div>

      <div style={{ padding: '12px 14px' }}>
        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {[
            { label: 'Bankroll', value: bankroll, setter: setBankroll, prefix: '$' },
            { label: 'Win Prob', value: winProb, setter: setWinProb, suffix: '%' },
            { label: 'Odds (Amer.)', value: odds, setter: setOdds },
          ].map(({ label, value, setter, prefix, suffix }) => (
            <div key={label}>
              <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.12em', marginBottom: '4px' }}>
                {label.toUpperCase()}
              </div>
              <div style={{ position: 'relative' }}>
                {prefix && (
                  <span style={{
                    position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                    fontSize: '11px', color: 'var(--text-dim)',
                  }}>{prefix}</span>
                )}
                <input
                  type="number"
                  value={value}
                  onChange={e => setter(parseFloat(e.target.value) || 0)}
                  className="data-input"
                  style={{ paddingLeft: prefix ? '18px' : '8px' }}
                />
                {suffix && (
                  <span style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    fontSize: '11px', color: 'var(--text-dim)',
                  }}>{suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Toggle row */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {KELLY_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`kelly-btn ${selected === opt.key ? 'active' : ''}`}
              onClick={() => setSelected(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Bet sizes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
          {KELLY_OPTIONS.map(opt => {
            const amt = bets[opt.key]
            const isActive = selected === opt.key
            return (
              <div
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: isActive ? 'rgba(59,130,246,0.1)' : 'var(--bg-elevated)',
                  border: `1px solid ${isActive ? 'var(--border-bright)' : 'var(--border)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  boxShadow: isActive ? '0 0 12px var(--blue-glow)' : 'none',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '8.5px',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.12em',
                    marginBottom: '2px',
                  }}>
                    {opt.label.toUpperCase()}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: isActive ? '20px' : '16px',
                    fontWeight: 700,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'font-size 0.2s',
                  }}>
                    ${amt.toLocaleString()}
                  </div>
                </div>
                <span style={{
                  fontSize: '8px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: opt.warnColor,
                  textAlign: 'right',
                  maxWidth: '80px',
                }}>
                  {opt.warn}
                </span>
              </div>
            )
          })}
        </div>

        {/* Explanation */}
        <div style={{
          padding: '7px 10px',
          background: 'rgba(59,130,246,0.04)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          fontSize: '9px',
          color: 'var(--text-dim)',
          lineHeight: 1.5,
        }}>
          Half-Kelly reduces variance by 50% while capturing 75% of expected growth rate.
          Recommended for most bankroll management strategies.
        </div>
      </div>
    </div>
  )
}
