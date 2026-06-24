import { useState, useEffect, useCallback } from 'react'
import { characters } from '../data/characters.js'
import { getDailyCharacter, getDayNumber, getTodayKey } from '../utils/dailyCharacter.js'
import { compareCharacters, isCorrectGuess } from '../utils/comparison.js'
import {
  loadGameState, saveGameState,
  loadStats, saveStats, computeUpdatedStats,
  loadRevealedHints, saveRevealedHints,
} from '../utils/storage.js'

export function useGame() {
  const target = getDailyCharacter()
  const todayKey = getTodayKey()
  const dayNumber = getDayNumber()

  const [guesses, setGuesses] = useState([])
  const [gameState, setGameState] = useState('playing')
  const [stats, setStats] = useState(loadStats)
  const [revealedHints, setRevealedHints] = useState(() => loadRevealedHints(todayKey))

  useEffect(() => {
    const saved = loadGameState(todayKey)
    if (!saved) return

    const reconstructed = (saved.guessIds ?? [])
      .map(id => characters.find(c => c.id === id))
      .filter(Boolean)
      .map(char => ({ character: char, comparison: compareCharacters(char, target) }))

    setGuesses(reconstructed)
    setGameState(saved.gameState ?? 'playing')
    setRevealedHints(loadRevealedHints(todayKey))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const wrongGuesses = guesses.filter(g => !isCorrectGuess(g.comparison)).length

  const unlockedHints = {
    occupation: wrongGuesses >= 3,
    quote: wrongGuesses >= 6,
    image: wrongGuesses >= 9,
  }

  const submitGuess = useCallback((character) => {
    setGuesses(prev => {
      if (prev.some(g => g.character.id === character.id)) return prev
      if (gameState !== 'playing') return prev

      const comparison = compareCharacters(character, target)
      const newGuesses = [...prev, { character, comparison }]
      const won = isCorrectGuess(comparison)
      const newState = won ? 'won' : 'playing'

      saveGameState(todayKey, {
        guessIds: newGuesses.map(g => g.character.id),
        gameState: newState,
      })

      if (won) {
        setGameState('won')
        setStats(current => {
          const updated = computeUpdatedStats(current, newGuesses.length, todayKey)
          saveStats(updated)
          return updated
        })
      }

      return newGuesses
    })
  }, [gameState, target, todayKey])

  const revealHint = useCallback((type) => {
    setRevealedHints(prev => {
      const next = { ...prev, [type]: true }
      saveRevealedHints(todayKey, next)
      return next
    })
  }, [todayKey])

  const giveUp = useCallback(() => {
    if (gameState !== 'playing') return
    saveGameState(todayKey, {
      guessIds: guesses.map(g => g.character.id),
      gameState: 'given_up',
    })
    setGameState('given_up')
    setStats(current => {
      const updated = {
        ...current,
        gamesPlayed: current.gamesPlayed + 1,
        currentStreak: 0,
      }
      saveStats(updated)
      return updated
    })
  }, [gameState, guesses, todayKey])

  return {
    target,
    guesses,
    gameState,
    unlockedHints,
    revealedHints,
    revealHint,
    giveUp,
    stats,
    dayNumber,
    wrongGuesses,
    submitGuess,
  }
}
