// Age groups ordered youngest → oldest
const AGE_ORDER = ['Teen', 'Young Adult', 'Adult', 'Senior']
const CRIME_ORDER = ['None', 'Minor', 'Moderate', 'Major', 'Extreme']

export function compareCharacters(guess, target) {
  return {
    gender: compareExact(guess.gender, target.gender),
    show: compareShow(guess.show, target.show),
    criminalInvolvement: compareCriminalInvolvement(guess.criminalInvolvement, target.criminalInvolvement),
    status: compareExact(guess.status, target.status),
    firstAppearance: compareFirstAppearance(guess.firstAppearance, target.firstAppearance),
    ageGroup: compareAgeGroup(guess.ageGroup, target.ageGroup),
  }
}

function compareExact(a, b) {
  return { result: a === b ? 'correct' : 'incorrect' }
}

function compareShow(guess, target) {
  if (guess === target) return { result: 'correct' }
  // "Both" overlaps with either specific show → partial
  const covers = (v, specific) => v === 'Both' && (specific === 'BrBa' || specific === 'BCS')
  if (covers(guess, target) || covers(target, guess)) return { result: 'partial' }
  return { result: 'incorrect' }
}

function compareFirstAppearance(guess, target) {
  if (guess.season === target.season && guess.episode === target.episode) {
    return { result: 'correct', arrow: null }
  }

  // Treat season * 100 + episode as a single ordinal for arrow direction
  const guessOrd = guess.season * 100 + guess.episode
  const targetOrd = target.season * 100 + target.episode
  const arrow = targetOrd > guessOrd ? 'later' : 'earlier'

  if (guess.season === target.season) return { result: 'partial', arrow }
  return { result: 'incorrect', arrow }
}

function compareAgeGroup(guess, target) {
  const gi = AGE_ORDER.indexOf(guess)
  const ti = AGE_ORDER.indexOf(target)
  if (gi === ti) return { result: 'correct', arrow: null }
  const diff = Math.abs(gi - ti)
  return {
    result: diff === 1 ? 'partial' : 'incorrect',
    arrow: gi < ti ? 'up' : 'down',
  }
}

function compareCriminalInvolvement(guess, target) {
  const gi = CRIME_ORDER.indexOf(guess)
  const ti = CRIME_ORDER.indexOf(target)
  if (gi === ti) return { result: 'correct', arrow: null }
  return {
    result: 'incorrect',
    arrow: gi < ti ? 'up' : 'down',
  }
}

export function isCorrectGuess(comparison) {
  return (
    comparison.gender.result === 'correct' &&
    comparison.show.result === 'correct' &&
    comparison.criminalInvolvement.result === 'correct' &&
    comparison.status.result === 'correct' &&
    comparison.firstAppearance.result === 'correct' &&
    comparison.ageGroup.result === 'correct'
  )
}
