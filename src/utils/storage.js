const GAME_PREFIX = 'sauldle_game_'
const REVEALED_PREFIX = 'sauldle_hints_'
const STATS_KEY = 'sauldle_stats'

const DEFAULT_REVEALED = { quote: false, occupation: false, image: false }

const DEFAULT_STATS = {
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  totalGuesses: 0,
  lastWonDate: null,
}

function safeGet(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function loadGameState(todayKey) {
  return safeGet(GAME_PREFIX + todayKey)
}

export function saveGameState(todayKey, state) {
  safeSet(GAME_PREFIX + todayKey, state)
}

export function loadStats() {
  return { ...DEFAULT_STATS, ...(safeGet(STATS_KEY) ?? {}) }
}

export function saveStats(stats) {
  safeSet(STATS_KEY, stats)
}

export function loadRevealedHints(todayKey) {
  return { ...DEFAULT_REVEALED, ...(safeGet(REVEALED_PREFIX + todayKey) ?? {}) }
}

export function saveRevealedHints(todayKey, revealed) {
  safeSet(REVEALED_PREFIX + todayKey, revealed)
}

export function computeUpdatedStats(currentStats, guessCount, todayKey) {
  const last = currentStats.lastWonDate
  let streak = currentStats.currentStreak

  if (last) {
    const lastDate = new Date(last)
    const today = new Date(todayKey)
    const diffDays = Math.round((today - lastDate) / 86400000)
    streak = diffDays === 1 ? streak + 1 : 1
  } else {
    streak = 1
  }

  return {
    gamesPlayed: currentStats.gamesPlayed + 1,
    wins: currentStats.wins + 1,
    currentStreak: streak,
    maxStreak: Math.max(currentStats.maxStreak, streak),
    totalGuesses: currentStats.totalGuesses + guessCount,
    lastWonDate: todayKey,
  }
}
