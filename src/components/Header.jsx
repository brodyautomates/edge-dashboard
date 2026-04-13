export default function Header({ currentTime, lastUpdated, onRefresh }) {
  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  const dateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : '—'

  return (
    <header style={{
      background: 'linear-gradient(180deg, rgba(4,8,15,0.98) 0%, rgba(8,13,23,0.96) 100%)',
      borderBottom: '1px solid var(--border)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px 4px 8px',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: '5px',
        }}>
          <span style={{ fontSize: '20px', lineHeight: 1 }}>⚡</span>
          <span style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: '22px', fontWeight: 700, letterSpacing: '0.12em',
            color: '#fff',
            textShadow: '0 0 20px rgba(59,130,246,0.6)',
          }}>EDGE</span>
        </div>
        <div style={{
          padding: '2px 8px',
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          fontSize: '9px', letterSpacing: '0.15em',
          color: 'var(--text-dim)', fontWeight: 600,
        }}>
          SPORTS INTELLIGENCE v2.1
        </div>
      </div>

      {/* Center — clock */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '20px', fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '0.06em', lineHeight: 1,
        }}>
          {timeStr}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.12em', marginTop: '2px' }}>
          {dateStr.toUpperCase()}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Last updated + refresh */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.12em', marginBottom: '2px' }}>
            LAST REFRESH
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px', color: 'var(--text-secondary)',
            }}>{updatedStr}</span>
            <button
              onClick={onRefresh}
              title="Refresh odds now"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid var(--border-bright)',
                borderRadius: '3px',
                color: 'var(--blue-400)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '1px 5px',
                lineHeight: 1.4,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
            >↻</button>
          </div>
        </div>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

        {/* Bankroll */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '8.5px', color: 'var(--text-dim)', letterSpacing: '0.14em', marginBottom: '2px' }}>
            BANKROLL
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)',
            }}>$10,000.00</span>
            <span style={{ color: 'var(--green-400)', fontSize: '12px' }}>▲</span>
          </div>
        </div>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

        {/* LIVE indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '5px 12px',
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '4px',
        }}>
          <div className="pulse-red" style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--red-500)',
          }} />
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em',
            color: 'var(--red-400)',
          }}>LIVE DATA</span>
        </div>
      </div>
    </header>
  )
}
