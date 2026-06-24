import { characters } from '../data/characters.js'

// Day 1 = launch date
const START_DATE = new Date('2026-06-16T00:00:00Z')

// Fixed seed — never change this after launch or all past days shift
const SHUFFLE_SEED = 20260616

// LCG-based Fisher-Yates shuffle, deterministic for a given seed
function seededShuffle(arr, seed) {
  const result = [...arr]
  let state = seed >>> 0
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const j = state % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const DAILY_ORDER = seededShuffle(characters, SHUFFLE_SEED)

function getDaysSinceStart() {
  const now = new Date()
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((today - START_DATE.getTime()) / 86400000)
}

export function getDailyCharacter() {
  //return characters.find(c => c.name === 'Gretchen Schwartz') // TEST OVERRIDE
  const days = getDaysSinceStart()
  const index = ((days % DAILY_ORDER.length) + DAILY_ORDER.length) % DAILY_ORDER.length
  return DAILY_ORDER[index]
}

export function getDayNumber() {
  return getDaysSinceStart() + 1
}

export function getTodayKey() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
