import { useState, useEffect, useRef, useCallback } from 'react'
import Header            from './components/Header'
import KPICards          from './components/KPICards'
import OddsBoard         from './components/OddsBoard'
import LineMovementChart from './components/LineMovementChart'
import KellyBetSizer     from './components/KellyBetSizer'
import InjuryFeed        from './components/InjuryFeed'
import ValueBets         from './components/ValueBets'
import BetslipSidebar    from './components/BetslipSidebar'
import LoadingState      from './components/LoadingState'
import { fetchAllOdds }  from './services/oddsApi'
import { fetchInjuries } from './services/injuryApi'

const API_KEY    = import.meta.env.VITE_ODDS_API_KEY
const REFRESH_MS = parseInt(import.meta.env.VITE_ODDS_REFRESH_MS || '300000', 10)

// ── Derived: best available line ───────────────────────────────
function getBest(oddsObj) {
  return Math.max(oddsObj.fd, oddsObj.dk, oddsObj.mgm, oddsObj.csr)
}
function impliedProb(odds) {
  if (odds < 0) return Math.abs(odds) / (Math.abs(odds) + 100) * 100
  return 100 / (odds + 100) * 100
}

// ── Derive value bets from live games ──────────────────────────
function deriveValueBets(games) {
  const bookLabel = { fd: 'FanDuel', dk: 'DraftKings', mgm: 'BetMGM', csr: 'Caesars' }
  return games
    .map(g => {
      const best    = getBest(g.odds)
      const impPct  = impliedProb(best)
      const edge    = parseFloat((g.modelProb - impPct).toFixed(1))
      if (edge <= 3) return null

      const bestBookEntry = Object.entries(g.odds).reduce((a, b) => b[1] > a[1] ? b : a)
      const b     = best < 0 ? 100 / Math.abs(best) : best / 100
      const kelly = Math.max(0, (g.modelProb / 100 * b - (1 - g.modelProb / 100)) / b)
      const wager = Math.round(kelly / 2 * 10000)

      return {
        id:          g.id,
        game:        `${g.away} @ ${g.home}`,
        bet:         `${g.home} ML`,
        book:        bookLabel[bestBookEntry[0]],
        line:        best > 0 ? `+${best}` : `${best}`,
        modelProb:   g.modelProb,
        impliedProb: parseFloat(impPct.toFixed(1)),
        edge,
        wager,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.edge - a.edge)
    .slice(0, 5)
}

export default function App() {
  const [currentTime,      setCurrentTime]      = useState(new Date())
  const [games,            setGames]            = useState([])
  const [valueBets,        setValueBets]        = useState([])
  const [newsItems,        setNewsItems]        = useState([])
  const [betslip,          setBetslip]          = useState([])
  const [betslipOpen,      setBetslipOpen]      = useState(false)
  const [selectedGameIdx,  setSelectedGameIdx]  = useState(0)
  const [movingCell,       setMovingCell]       = useState(null)
  const [activeBets,       setActiveBets]       = useState(0)
  const [loading,          setLoading]          = useState(true)
  const [error,            setError]            = useState(null)
  const [lastUpdated,      setLastUpdated]      = useState(null)

  // ── Live clock ─────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // ── Primary data fetch ─────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setError(null)
      const [oddsData, injuryData] = await Promise.all([
        fetchAllOdds(API_KEY),
        fetchInjuries(),
      ])

      if (oddsData.length === 0) {
        setError('No upcoming games found. The API may be between seasons, or your key is invalid.\nCheck your VITE_ODDS_API_KEY in .env')
        setLoading(false)
        return
      }

      const vb = deriveValueBets(oddsData)
      setGames(oddsData)
      setValueBets(vb)
      setActiveBets(vb.length)
      if (injuryData.length > 0) setNewsItems(injuryData)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [])

  // Initial load + periodic refresh
  useEffect(() => {
    loadData()
    const t = setInterval(loadData, REFRESH_MS)
    return () => clearInterval(t)
  }, [loadData])

  // ── Visual micro line movement (between API polls) ─────────────
  useEffect(() => {
    if (games.length === 0) return
    const books = ['fd', 'dk', 'mgm', 'csr']
    const t = setInterval(() => {
      const gameIdx = Math.floor(Math.random() * games.length)
      const book    = books[Math.floor(Math.random() * books.length)]
      const delta   = Math.random() > 0.5 ? 1 : -1
      setGames(prev => prev.map((g, i) =>
        i !== gameIdx ? g : { ...g, odds: { ...g.odds, [book]: g.odds[book] + delta } }
      ))
      setMovingCell({ gameIdx, book, dir: delta > 0 ? 'up' : 'down' })
      setTimeout(() => setMovingCell(null), 3000)
    }, 8000)
    return () => clearInterval(t)
  }, [games.length])

  // ── KPI active bets fluctuation ─────────────────────────────────
  useEffect(() => {
    if (valueBets.length === 0) return
    const t = setInterval(() => {
      setActiveBets(Math.max(1, valueBets.length + Math.floor(Math.random() * 3) - 1))
    }, 30000)
    return () => clearInterval(t)
  }, [valueBets.length])

  const addToBetslip = useCallback((bet) => {
    setBetslip(prev => prev.find(b => b.id === bet.id) ? prev : [...prev, bet])
    setBetslipOpen(true)
  }, [])

  const removeFromBetslip = useCallback((betId) => {
    setBetslip(prev => {
      const next = prev.filter(b => b.id !== betId)
      if (next.length === 0) setBetslipOpen(false)
      return next
    })
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <LoadingState error={error} onRetry={loadData} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header currentTime={currentTime} lastUpdated={lastUpdated} onRefresh={loadData} />

      <main style={{ padding: '12px 16px 24px', maxWidth: '1920px', margin: '0 auto' }}>
        <KPICards activeBets={activeBets} valueBets={valueBets} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 400px',
          gap: '12px',
          marginTop: '12px',
        }}>
          <OddsBoard
            games={games}
            movingCell={movingCell}
            selectedGameIdx={selectedGameIdx}
            onSelectGame={setSelectedGameIdx}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <LineMovementChart selectedGameIdx={selectedGameIdx} games={games} />
            <KellyBetSizer />
            <InjuryFeed newsItems={newsItems} />
          </div>
        </div>

        <ValueBets
          valueBets={valueBets}
          betslip={betslip}
          onAddBet={addToBetslip}
        />
      </main>

      <BetslipSidebar
        isOpen={betslipOpen}
        betslip={betslip}
        onClose={() => setBetslipOpen(false)}
        onOpen={() => setBetslipOpen(true)}
        onRemove={removeFromBetslip}
      />
    </div>
  )
}
