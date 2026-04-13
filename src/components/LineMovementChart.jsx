import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'

const TIMES = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00']

const CONFIGS = [
  { init: -3,   sharpIdx: 7, drift: [0, 0, -0.5, 0, -0.5, 0, 0, -2.5, 0, -0.5, 0, -0.5, 0],  publicPct: 67, sharpPct: 33 },
  { init: 4,    sharpIdx: 5, drift: [0, 0.5, 0, 0.5, 0, 2, 0, 0.5, 0, -0.5, 0, 0, 0],          publicPct: 72, sharpPct: 28 },
  { init: -1.5, sharpIdx: 6, drift: [0, 0, -0.5, 0, 0, -0.5, -2, 0, -0.5, 0, 0, -0.5, 0],      publicPct: 58, sharpPct: 42 },
  { init: 7,    sharpIdx: 8, drift: [0, 0, 0.5, 0, 0, 0.5, 0, 0, -3, 0, -0.5, 0, 0],           publicPct: 81, sharpPct: 19 },
  { init: -2,   sharpIdx: 6, drift: [0, -0.5, 0, 0, -0.5, 0, -2, 0, 0, -0.5, 0, 0, -0.5],      publicPct: 65, sharpPct: 35 },
  { init: 3,    sharpIdx: 5, drift: [0, 0, 0.5, 0, 0.5, 2.5, 0, 0, 0.5, 0, 0, 0, 0],           publicPct: 70, sharpPct: 30 },
  { init: -5.5, sharpIdx: 7, drift: [0, 0, 0, -0.5, 0, 0, -0.5, -2, 0, -0.5, 0, 0, 0],         publicPct: 74, sharpPct: 26 },
  { init: 5,    sharpIdx: 6, drift: [0, 0.5, 0, 0.5, 0, 0, -3, 0, -0.5, 0, -0.5, 0, 0],        publicPct: 62, sharpPct: 38 },
  { init: -6.5, sharpIdx: 8, drift: [0, 0, -0.5, 0, 0, -0.5, 0, 0, -1.5, 0, -0.5, 0, 0],       publicPct: 55, sharpPct: 45 },
]

function buildChartData(gameIdx) {
  const cfg = CONFIGS[gameIdx % CONFIGS.length]
  let current = cfg.init
  return TIMES.map((time, i) => {
    if (i > 0) current += cfg.drift[i]
    const rounded = Math.round(current * 2) / 2
    return { time, open: cfg.init, current: rounded, sharp: i === cfg.sharpIdx }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-bright)',
      borderRadius: '5px',
      padding: '8px 12px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '11px',
    }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: '4px', fontSize: '9px', letterSpacing: '0.1em' }}>
        {label}
      </div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', textTransform: 'uppercase' }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value > 0 ? `+${p.value}` : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function LineMovementChart({ selectedGameIdx, games }) {
  const data = buildChartData(selectedGameIdx)
  const cfg  = CONFIGS[selectedGameIdx % CONFIGS.length]
  const game = games[selectedGameIdx]
  const sharpTime = data.find(d => d.sharp)?.time

  const yValues = data.flatMap(d => [d.open, d.current])
  const yMin = Math.floor(Math.min(...yValues)) - 1
  const yMax = Math.ceil(Math.max(...yValues)) + 1

  return (
    <div className="panel" style={{ minHeight: 0 }}>
      <div className="panel-header">
        <div className="dot" />
        LINE MOVEMENT — {game ? `${game.away} @ ${game.home}` : '—'}
        <span style={{ marginLeft: 'auto', fontSize: '8px', color: 'var(--text-dim)' }}>
          6H WINDOW
        </span>
      </div>

      <div style={{ padding: '12px 12px 4px' }}>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(59,130,246,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--text-dim)', fontSize: 9, fontFamily: "'Chakra Petch', sans-serif" }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fill: 'var(--text-dim)', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => v > 0 ? `+${v}` : `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Sharp action vertical line */}
            {sharpTime && (
              <ReferenceLine
                x={sharpTime}
                stroke="var(--gold-500)"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: '⚡ Sharp',
                  position: 'top',
                  fill: 'var(--gold-400)',
                  fontSize: 8,
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="open"
              name="Opening"
              stroke="rgba(148,163,184,0.4)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 3, fill: 'rgba(148,163,184,0.6)' }}
            />
            <Line
              type="monotone"
              dataKey="current"
              name="Current"
              stroke="var(--blue-400)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--blue-400)', stroke: 'var(--bg-base)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bet % split */}
      <div style={{ padding: '6px 14px 12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '5px',
          fontSize: '8.5px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'var(--text-secondary)',
        }}>
          <span style={{ color: 'var(--text-dim)' }}>PUBLIC {cfg.publicPct}%</span>
          <span style={{ fontSize: '8px', color: 'var(--text-dim)' }}>BET DISTRIBUTION</span>
          <span style={{ color: 'var(--gold-400)' }}>SHARP {cfg.sharpPct}%</span>
        </div>
        <div style={{
          height: '6px',
          borderRadius: '3px',
          background: 'var(--bg-elevated)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{
              width: `${cfg.publicPct}%`,
              background: 'linear-gradient(90deg, rgba(96,165,250,0.5), rgba(96,165,250,0.3))',
              transition: 'width 0.5s',
            }} />
            <div style={{
              flex: 1,
              background: 'linear-gradient(90deg, rgba(245,158,11,0.5), rgba(245,158,11,0.7))',
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
