import { useState, useEffect, useRef } from 'react'

function fmtOdds(n) {
  return n > 0 ? `+${n}` : `${n}`
}

function impliedProb(odds) {
  if (odds < 0) return (Math.abs(odds) / (Math.abs(odds) + 100) * 100).toFixed(1)
  return (100 / (odds + 100) * 100).toFixed(1)
}

function bestAvailable(oddsObj) {
  return Math.max(oddsObj.fd, oddsObj.dk, oddsObj.mgm, oddsObj.csr)
}

function OddsCell({ value, gameIdx, book, movingCell, prevRef }) {
  const [flashClass, setFlashClass] = useState('')
  const [showArrow, setShowArrow] = useState(false)
  const [arrowDir, setArrowDir] = useState('up')
  const prevValue = useRef(value)

  useEffect(() => {
    if (
      movingCell &&
      movingCell.gameIdx === gameIdx &&
      movingCell.book === book
    ) {
      const dir = movingCell.dir
      setFlashClass(dir === 'up' ? 'odds-cell-flash-up' : 'odds-cell-flash-down')
      setArrowDir(dir)
      setShowArrow(true)
      const t = setTimeout(() => {
        setFlashClass('')
        setShowArrow(false)
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [movingCell, gameIdx, book])

  prevValue.current = value

  return (
    <span
      className={flashClass}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        borderRadius: '3px',
        padding: '1px 3px',
        transition: 'background-color 0.3s',
      }}
    >
      <span className={flashClass ? 'number-tick' : ''}>{fmtOdds(value)}</span>
      {showArrow && (
        <span style={{
          fontSize: '9px',
          color: arrowDir === 'up' ? 'var(--green-400)' : 'var(--red-400)',
          fontWeight: 700,
          lineHeight: 1,
        }}>
          {arrowDir === 'up' ? '▲' : '▼'}
        </span>
      )}
    </span>
  )
}

export default function OddsBoard({ games, movingCell, selectedGameIdx, onSelectGame }) {
  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="panel-header">
        <div className="dot" />
        LIVE ODDS BOARD
        <span style={{ marginLeft: 'auto', color: 'var(--blue-400)', fontSize: '8px' }}>
          NFL · NBA · MLB
        </span>
        <span style={{
          padding: '1px 6px',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid var(--border-bright)',
          borderRadius: '3px',
          fontSize: '8px',
          color: 'var(--blue-400)',
        }}>
          {games.length} GAMES
        </span>
      </div>

      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '460px' }}>
        <table className="odds-table" style={{ minWidth: '900px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingLeft: 14, minWidth: 190 }}>MATCHUP</th>
              <th>FANDUEL</th>
              <th>DRAFTKINGS</th>
              <th>BETMGM</th>
              <th>CAESARS</th>
              <th style={{ color: 'var(--gold-400)' }}>BEST LINE</th>
              <th style={{ color: 'var(--blue-400)' }}>MODEL %</th>
              <th>IMPLIED %</th>
              <th style={{ color: 'var(--green-400)' }}>EDGE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {games.map((g, idx) => {
              const best   = bestAvailable(g.odds)
              const impPct = parseFloat(impliedProb(best))
              const edge   = (g.modelProb - impPct).toFixed(1)
              const edgeNum = parseFloat(edge)
              const isValue = edgeNum > 3

              return (
                <tr
                  key={g.id}
                  className={selectedGameIdx === idx ? 'selected' : ''}
                  onClick={() => onSelectGame(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Matchup */}
                  <td style={{ paddingLeft: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ fontSize: '14px' }}>{g.sport}</span>
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '11px', fontFamily: "'Chakra Petch', sans-serif" }}>
                          {g.away}
                        </div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '9.5px', fontFamily: "'Chakra Petch', sans-serif" }}>
                          @ {g.home}
                        </div>
                      </div>
                      <span style={{
                        padding: '1px 5px',
                        background: 'rgba(59,130,246,0.08)',
                        border: '1px solid var(--border)',
                        borderRadius: '2px',
                        fontSize: '7.5px',
                        letterSpacing: '0.1em',
                        color: 'var(--text-dim)',
                      }}>{g.league}</span>
                    </div>
                  </td>

                  {/* Book odds */}
                  {['fd', 'dk', 'mgm', 'csr'].map(book => (
                    <td key={book} style={{
                      color: g.odds[book] === best ? 'var(--gold-400)' : 'var(--text-secondary)',
                      fontWeight: g.odds[book] === best ? 600 : 400,
                    }}>
                      <OddsCell
                        value={g.odds[book]}
                        gameIdx={idx}
                        book={book}
                        movingCell={movingCell}
                      />
                    </td>
                  ))}

                  {/* Best available */}
                  <td style={{ color: 'var(--gold-400)', fontWeight: 700 }}>
                    {fmtOdds(best)}
                  </td>

                  {/* Model prob */}
                  <td style={{ color: 'var(--blue-400)', fontWeight: 600 }}>
                    {g.modelProb}%
                  </td>

                  {/* Implied prob */}
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {impPct.toFixed(1)}%
                  </td>

                  {/* Edge */}
                  <td style={{
                    color: edgeNum > 0 ? 'var(--green-400)' : 'var(--red-400)',
                    fontWeight: edgeNum > 3 ? 700 : 400,
                    textShadow: edgeNum > 3 ? '0 0 8px var(--green-glow)' : 'none',
                  }}>
                    {edgeNum > 0 ? '+' : ''}{edge}%
                  </td>

                  {/* Value badge */}
                  <td>
                    {isValue && <span className="vb-badge">⚡ VALUE</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        padding: '7px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '8.5px',
        color: 'var(--text-dim)',
      }}>
        <span>Click any row to load line movement chart</span>
        <span style={{ marginLeft: 'auto', color: 'var(--blue-400)' }}>
          Lines update every 8s
        </span>
      </div>
    </div>
  )
}
