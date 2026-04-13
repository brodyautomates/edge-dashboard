/**
 * ESPN Unofficial Injury API — No API key required
 *
 * Endpoints:
 *  NFL  → https://site.api.espn.com/apis/v2/sports/football/nfl/injuries
 *  NBA  → https://site.api.espn.com/apis/v2/sports/basketball/nba/injuries
 *  MLB  → https://site.api.espn.com/apis/v2/sports/baseball/mlb/injuries
 *
 * Note: Unofficial API — no SLA, may change without notice.
 * ESPN does not rate-limit browser requests aggressively.
 */

const ESPN_BASE = 'https://site.api.espn.com/apis/v2/sports'

const SPORT_ENDPOINTS = [
  { url: `${ESPN_BASE}/football/nfl/injuries`,   league: 'NFL' },
  { url: `${ESPN_BASE}/basketball/nba/injuries`, league: 'NBA' },
  { url: `${ESPN_BASE}/baseball/mlb/injuries`,   league: 'MLB' },
]

/**
 * Derive impact level from ESPN injury status string.
 * ESPN uses: "Out", "Doubtful", "Questionable", "Probable", "Day-To-Day"
 */
function getImpactLevel(statusStr = '') {
  const s = statusStr.toLowerCase()
  if (s.includes('out') || s.includes('doubtful') || s.includes('ir'))           return 'HIGH'
  if (s.includes('questionable') || s.includes('day-to-day') || s.includes('dtd')) return 'MED'
  return 'LOW'
}

function timeAgo(dateStr) {
  if (!dateStr) return 'recently'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/**
 * Fetch injury and transaction data from ESPN.
 * Returns a normalized array of injury cards.
 *
 * @returns {Promise<Array>}
 */
export async function fetchInjuries() {
  const items = []
  let   idCounter = 1

  for (const endpoint of SPORT_ENDPOINTS) {
    try {
      const res   = await fetch(endpoint.url)
      if (!res.ok) continue
      const data  = await res.json()
      const teams = data.injuries || []

      for (const team of teams.slice(0, 6)) {
        const teamName    = team.team?.displayName || team.team?.shortDisplayName || 'Unknown'
        const teamAbbrv   = team.team?.abbreviation || ''
        const teamDisplay = teamAbbrv ? `${teamAbbrv} ${endpoint.league}` : teamName

        for (const injury of (team.injuries || []).slice(0, 2)) {
          const playerName = injury.athlete?.displayName || injury.athlete?.fullName
          if (!playerName) continue

          const statusStr = injury.status?.type?.description
                         || injury.status?.displayValue
                         || injury.type?.description
                         || ''
          const impact    = getImpactLevel(statusStr)
          const headline  = [
            injury.type?.description,
            statusStr,
          ].filter(Boolean).join(' — ') || 'Status update'

          items.push({
            id:         idCounter++,
            player:     playerName,
            team:       teamDisplay,
            headline,
            impact,
            time:       timeAgo(injury.date || injury.details?.fantasyStatus?.lastModified),
            isNew:      false,
          })
        }
      }
    } catch (err) {
      console.warn(`[injuryApi] ${endpoint.league} fetch failed:`, err.message)
    }
  }

  return items.slice(0, 12) // cap for display
}
