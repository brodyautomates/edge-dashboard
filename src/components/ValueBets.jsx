export default function ValueBets({ valueBets, betslip, onAddBet }) {
  return (
    <div className="panel panel-gold" style={{ marginTop: '12px' }}>
      <div className="panel-header" style={{ borderBottomColor: 'rgba(245,158,11,0.15)' }}>
        <span style={{ color: 'var(--gold-400)', fontSize: '13px', lineHeight: 1 }}>⚡</span>
        <span style={{ color: 'var(--gold-400)' }}>POSITIVE EV OPPORTUNITIES</span>
        <div style={{
          padding: '1px 8px',
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '3px',
          fontSize: '8px',
          color: 'var(--gold-400)',
        }}>
          {valueBets.length} ACTIVE
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '8px', color: 'var(--text-dim)' }}>
          HALF-KELLY SIZING · BANKROLL $10,000
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '10px',
        padding: '12px',
      }}>
        {valueBets.map(bet => {
          const inSlip = betslip.some(b => b.id === bet.id)
          const isHighEdge = bet.edge >= 6

          return (
            <div
              key={bet.id}
              style={{
                background: 'var(--bg-elevated)',
                border: `1px solid ${isHighEdge ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                borderRadius: '6px',
                padding: '12px 14px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Top glow for high-edge bets */}
              {isHighEdge && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background: 'linear-gradient(90deg, transparent, var(--gold-500), transparent)',
                  opacity: 0.6,
                }} />
              )}

              {/* Game label */}
              <div style={{
                fontSize: '8.5px',
                color: 'var(--text-dim)',
                letterSpacing: '0.1em',
                marginBottom: '4px',
              }}>
                {bet.game.toUpperCase()}
              </div>

              {/* Bet type */}
              <div style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                lineHeight: 1.2,
              }}>
                {bet.bet}
              </div>

              {/* Book + line */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
              }}>
                <span style={{
                  padding: '2px 8px',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: '3px',
                  fontSize: '9px',
                  color: 'var(--blue-400)',
                  fontWeight: 600,
                }}>
                  {bet.book}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--gold-400)',
                }}>
                  {bet.line}
                </span>
              </div>

              {/* Prob row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                marginBottom: '10px',
              }}>
                <div style={{
                  padding: '5px 7px',
                  background: 'rgba(59,130,246,0.07)',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                }}>
                  <div style={{ fontSize: '7.5px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    MODEL
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--blue-400)',
                  }}>
                    {bet.modelProb}%
                  </div>
                </div>
                <div style={{
                  padding: '5px 7px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                }}>
                  <div style={{ fontSize: '7.5px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    IMPLIED
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}>
                    {bet.impliedProb}%
                  </div>
                </div>
              </div>

              {/* Edge */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--green-400)',
                textShadow: '0 0 16px var(--green-glow)',
                lineHeight: 1,
                marginBottom: '2px',
              }}>
                +{bet.edge}%
              </div>
              <div style={{ fontSize: '8px', color: 'var(--text-dim)', marginBottom: '10px' }}>
                EDGE OVER MARKET
              </div>

              {/* Wager */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}>
                <div>
                  <div style={{ fontSize: '7.5px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                    REC. WAGER
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>
                    ${bet.wager.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Add to betslip */}
              <button
                className={`add-bet-btn ${inSlip ? 'added' : ''}`}
                onClick={() => !inSlip && onAddBet(bet)}
                style={{ width: '100%' }}
              >
                {inSlip ? '✓ IN BETSLIP' : 'ADD TO BETSLIP'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
