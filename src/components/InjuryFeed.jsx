function NewsCard({ item }) {
  const isHigh = item.impact === 'HIGH'
  const isMed  = item.impact === 'MED'

  return (
    <div
      className="fade-in-up"
      style={{
        display: 'flex',
        gap: '10px',
        padding: '9px 10px',
        background: isHigh ? 'rgba(239,68,68,0.05)' : 'transparent',
        borderLeft: `2px solid ${isHigh ? 'var(--red-500)' : isMed ? 'var(--gold-600)' : 'var(--text-dim)'}`,
        borderRadius: '0 3px 3px 0',
        transition: 'background 0.3s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '6px',
          marginBottom: '3px',
        }}>
          <div>
            <span style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontSize: '10.5px',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              {item.player}
            </span>
            <span style={{
              marginLeft: '5px',
              fontSize: '9px',
              color: 'var(--text-dim)',
            }}>
              {item.team}
            </span>
          </div>
          <span className={`impact-badge impact-${item.impact.toLowerCase()}`}>
            {item.impact}
          </span>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: item.modelNote ? '4px' : 0 }}>
          {item.headline}
        </div>

        {item.modelNote && (
          <div style={{
            fontSize: '8.5px',
            color: isHigh ? 'var(--red-400)' : 'var(--text-dim)',
            fontFamily: "'JetBrains Mono', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{ color: 'var(--blue-400)' }}>◆</span>
            {item.modelNote}
          </div>
        )}
      </div>

      <div style={{
        fontSize: '8px',
        color: 'var(--text-dim)',
        whiteSpace: 'nowrap',
        paddingTop: '1px',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {item.time}
      </div>
    </div>
  )
}

export default function InjuryFeed({ newsItems }) {
  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header">
        <div className="dot" style={{ background: 'var(--gold-500)', boxShadow: '0 0 6px var(--gold-500)' }} />
        INJURY &amp; NEWS FEED
        <span style={{ marginLeft: 'auto', fontSize: '8px', color: 'var(--text-dim)' }}>
          AUTO-UPDATE 15s
        </span>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: '240px' }}>
        {newsItems.map((item, i) => (
          <div key={item.id} style={{ borderBottom: i < newsItems.length - 1 ? '1px solid rgba(59,130,246,0.04)' : 'none' }}>
            <NewsCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
