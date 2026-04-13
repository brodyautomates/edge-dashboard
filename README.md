# ⚡ EDGE — Sports Betting Intelligence Dashboard

> A Bloomberg Terminal-style sports analytics dashboard that pulls **live odds** from FanDuel, DraftKings, BetMGM, and Caesars — surfaces positive EV bets, sizes them with Kelly Criterion, and tracks injury data in real time.

![EDGE Dashboard Preview](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite) ![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF?style=flat) ![The Odds API](https://img.shields.io/badge/The%20Odds%20API-v4-F59E0B?style=flat)

---

## What it does

| Feature | Detail |
|---|---|
| **Live Odds Board** | Real-time ML lines from 4 major US books — NFL, NBA, MLB |
| **Positive EV Detection** | Flags bets where model probability exceeds implied probability by >3% |
| **Line Movement Chart** | 6-hour spread movement tracker with Sharp Action annotations |
| **Kelly Bet Sizer** | Full / Half / Quarter Kelly with live bankroll inputs |
| **Injury & News Feed** | Real ESPN injury data, auto-refreshes |
| **Betslip** | Slide-in sidebar to track selected bets |

---

## Quick Start

### 1. Get a free API key

Register at **[the-odds-api.com](https://the-odds-api.com)** — the free tier gives you **500 requests/month**, which at a 5-minute refresh interval is ~87 hours of uptime.

### 2. Clone and configure

```bash
git clone https://github.com/brodyautomates/edge-dashboard.git
cd edge-dashboard
cp .env.example .env
```

Open `.env` and add your key:

```env
VITE_ODDS_API_KEY=your_key_here
```

### 3. Install and run

```bash
npm install
npm start
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_ODDS_API_KEY` | ✅ Yes | — | Your key from the-odds-api.com |
| `VITE_ODDS_REFRESH_MS` | No | `300000` | Odds refresh interval (ms). Keep ≥300000 on free tier |

---

## API Usage

### The Odds API (Required)
- **Endpoint:** `GET /v4/sports/{sport}/odds`
- **Sports:** NFL, NBA, MLB
- **Books:** FanDuel, DraftKings, BetMGM, Caesars
- **Free tier:** 500 req/month → set refresh to 5+ min
- **Paid tiers:** Available for higher volume

### ESPN Unofficial API (No key needed)
- Used for real-time injury data
- No rate limits enforced for browser requests
- Endpoint: `site.api.espn.com/apis/v2/sports/{sport}/{league}/injuries`

---

## How the Model Works

The "model probability" is computed as:

```
implied_prob = market_implied_probability(best_available_line)
model_prob   = implied_prob ± seed_adjustment(team_names)
edge         = model_prob - implied_prob
```

The seed adjustment is deterministic per matchup — same game always shows the same model edge. **In a production setup, replace `computeModelProb()` in `src/services/oddsApi.js` with your own ML model endpoint.**

Edge detection threshold: **>3%** flags a bet as positive EV.

---

## Project Structure

```
src/
├── App.jsx                    # Root — state, data fetching, intervals
├── services/
│   ├── oddsApi.js             # The Odds API integration
│   └── injuryApi.js           # ESPN injury data
└── components/
    ├── Header.jsx             # Sticky header — clock, bankroll, refresh
    ├── KPICards.jsx           # 4 stat cards (top row)
    ├── OddsBoard.jsx          # Live odds table with flash animations
    ├── LineMovementChart.jsx  # Recharts line chart + bet % split
    ├── KellyBetSizer.jsx      # Interactive Kelly calculator
    ├── InjuryFeed.jsx         # Real-time injury cards
    ├── ValueBets.jsx          # Positive EV opportunities panel
    ├── BetslipSidebar.jsx     # Slide-in betslip
    └── LoadingState.jsx       # Loading / error screen
```

---

## Customization

**Change bankroll:** Update the `$10,000.00` hardcoded value in `Header.jsx` and the `10000` constant used in Kelly calculations inside `App.jsx`.

**Swap the model:** Replace `computeModelProb()` in `oddsApi.js` with any async function that returns a win probability given team names or event IDs.

**Add more books:** Extend the `BOOKS` string in `oddsApi.js` with any bookmaker key from [the-odds-api.com/liveapi/guides/v4/#bookmakers](https://the-odds-api.com/liveapi/guides/v4/#bookmakers).

---

## Disclaimer

This tool is for **educational and informational purposes only**. It does not constitute financial, legal, or gambling advice. Past edge does not guarantee future results. Bet responsibly. Know the gambling laws in your jurisdiction.

---

*Built by [Exosoft Infrastructure](https://exosoft.io)*
