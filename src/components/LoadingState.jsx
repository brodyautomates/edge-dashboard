export default function LoadingState({ error, onRetry }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '40px',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 18px',
        background: 'rgba(59,130,246,0.08)',
        border: '1px solid rgba(59,130,246,0.25)',
        borderRadius: '6px',
        marginBottom: '8px',
      }}>
        <span style={{ fontSize: '24px' }}>⚡</span>
        <span style={{
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: '28px', fontWeight: 700,
          color: '#fff',
          textShadow: '0 0 24px rgba(59,130,246,0.6)',
          letterSpacing: '0.1em',
        }}>EDGE</span>
      </div>

      {error ? (
        <>
          <div style={{
            padding: '16px 24px',
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '6px',
            maxWidth: '520px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--red-400)', marginBottom: '8px' }}>
              CONNECTION ERROR
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {error}
            </div>
          </div>

          <div style={{
            padding: '12px 18px',
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid var(--border)',
            borderRadius: '5px',
            maxWidth: '480px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.12em', marginBottom: '6px' }}>
              QUICK FIX
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              1. Get a free key at <span style={{ color: 'var(--blue-400)' }}>the-odds-api.com</span><br />
              2. Copy <span style={{ fontFamily: 'monospace', color: 'var(--gold-400)' }}>.env.example</span> → <span style={{ fontFamily: 'monospace', color: 'var(--gold-400)' }}>.env</span><br />
              3. Paste your key as <span style={{ fontFamily: 'monospace', color: 'var(--gold-400)' }}>VITE_ODDS_API_KEY</span><br />
              4. Restart with <span style={{ fontFamily: 'monospace', color: 'var(--blue-400)' }}>npm start</span>
            </div>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                padding: '10px 28px',
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.4)',
                borderRadius: '4px',
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--blue-400)', cursor: 'pointer',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
            >
              Retry Connection
            </button>
          )}
        </>
      ) : (
        <>
          {/* Spinner */}
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            .spinner {
              width: 36px; height: 36px;
              border: 2px solid rgba(59,130,246,0.15);
              border-top-color: var(--blue-500);
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
          `}</style>
          <div className="spinner" />
          <div style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--text-dim)',
          }}>
            LOADING LIVE ODDS...
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
            Connecting to The Odds API
          </div>
        </>
      )}
    </div>
  )
}
