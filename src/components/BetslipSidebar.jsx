import { useState } from 'react'

export default function BetslipSidebar({ isOpen, betslip, onClose, onOpen, onRemove }) {
  const [locked, setLocked] = useState(false)

  const totalWager = betslip.reduce((s, b) => s + b.wager, 0)
  const avgEdge    = betslip.length
    ? (betslip.reduce((s, b) => s + b.edge, 0) / betslip.length).toFixed(1)
    : '0.0'

  const handleLock = () => {
    setLocked(true)
    setTimeout(() => setLocked(false), 2000)
  }

  // Floating tab (visible when closed but has bets)
  const showTab = !isOpen && betslip.length > 0

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 200,
          }}
        />
      )}

      {/* Floating badge */}
      {showTab && (
        <button
          onClick={onOpen}
          style={{
            position: 'fixed',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 201,
            background: 'var(--blue-500)',
            border: 'none',
            borderRadius: '6px 0 0 6px',
            padding: '12px 8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 0 20px var(--blue-glow-strong)',
          }}
        >
          <span style={{ fontSize: '14px' }}>📋</span>
          <span style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: '8px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '0.08em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}>
            BETSLIP
          </span>
          <span style={{
            width: '18px', height: '18px',
            borderRadius: '50%',
            background: 'var(--gold-500)',
            color: '#000',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {betslip.length}
          </span>
        </button>
      )}

      {/* Sidebar panel */}
      <div
        className={isOpen ? 'slide-in-right' : ''}
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: '340px',
          background: 'var(--bg-panel)',
          borderLeft: '1px solid var(--border-bright)',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(110%)',
          transition: isOpen ? 'none' : 'transform 0.3s ease-in',
          boxShadow: isOpen ? '-8px 0 40px rgba(59,130,246,0.15)' : 'none',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>📋</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'var(--text-primary)',
            }}>
              BETSLIP
            </span>
            <span style={{
              padding: '1px 7px',
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid var(--border-bright)',
              borderRadius: '3px',
              fontSize: '10px',
              color: 'var(--blue-400)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {betslip.length}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              padding: '2px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
          >
            ×
          </button>
        </div>

        {/* Bets list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {betslip.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: 'var(--text-dim)',
              fontSize: '11px',
              gap: '8px',
            }}>
              <span style={{ fontSize: '28px', opacity: 0.3 }}>📋</span>
              <span>No bets added yet</span>
            </div>
          ) : (
            betslip.map(bet => (
              <div
                key={bet.id}
                className="fade-in-up"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '5px',
                  padding: '10px 12px',
                  marginBottom: '8px',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => onRemove(bet.id)}
                  style={{
                    position: 'absolute', top: 6, right: 8,
                    background: 'none', border: 'none',
                    color: 'var(--text-dim)', cursor: 'pointer',
                    fontSize: '14px', lineHeight: 1, padding: 0,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--red-400)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                >
                  ×
                </button>

                <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '3px' }}>
                  {bet.game.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: '12px', fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: '6px',
                }}>
                  {bet.bet}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      padding: '1px 6px',
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      fontSize: '9px',
                      color: 'var(--blue-400)',
                    }}>
                      {bet.book} {bet.line}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: 700,
                      color: 'var(--green-400)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      +{bet.edge}%
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '14px', fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>
                    ${bet.wager.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary + lock in */}
        {betslip.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '14px' }}>
            {/* Summary row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '12px',
            }}>
              {[
                { label: 'TOTAL WAGER',    value: `$${totalWager.toLocaleString()}` },
                { label: 'AVG EDGE',       value: `+${avgEdge}%`,   color: 'var(--green-400)' },
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontSize: '7.5px', color: 'var(--text-dim)', letterSpacing: '0.12em', marginBottom: '3px' }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '15px', fontWeight: 700,
                    color: item.color || 'var(--text-primary)',
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleLock}
              className="glow-blue"
              style={{
                width: '100%',
                padding: '13px',
                background: locked
                  ? 'linear-gradient(135deg, var(--green-500), #059669)'
                  : 'linear-gradient(135deg, var(--blue-500), var(--blue-600))',
                border: 'none',
                borderRadius: '5px',
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'white',
                cursor: 'pointer',
                transition: 'background 0.3s, transform 0.15s',
                transform: locked ? 'scale(0.99)' : 'scale(1)',
              }}
            >
              {locked ? '✓ LOCKED IN' : `🔒 LOCK IN ${betslip.length} BET${betslip.length > 1 ? 'S' : ''}`}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
