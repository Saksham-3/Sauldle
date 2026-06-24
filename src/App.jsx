import { useState, useEffect } from 'react'
import { useGame } from './hooks/useGame.js'
import { characters } from './data/characters.js'
import Header from './components/Header.jsx'
import SearchInput from './components/SearchInput.jsx'
import GuessTable from './components/GuessTable.jsx'
import HintPanel from './components/HintPanel.jsx'
import VictoryModal from './components/VictoryModal.jsx'
import StatsModal from './components/StatsModal.jsx'
import HelpModal from './components/HelpModal.jsx'
import Confetti from './components/Confetti.jsx'

export default function App() {
  const {
    target, guesses, gameState,
    unlockedHints, revealedHints, revealHint,
    giveUp, stats, dayNumber, wrongGuesses,
    submitGuess,
  } = useGame()

  const [showVictory, setShowVictory] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confirmGiveUp, setConfirmGiveUp] = useState(false)

  useEffect(() => {
    if (gameState === 'won') {
      const t1 = setTimeout(() => setShowVictory(true), 900)
      const t2 = setTimeout(() => setShowConfetti(true), 500)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [gameState])

  useEffect(() => {
    if (!localStorage.getItem('sauldle_visited')) {
      setShowHelp(true)
      localStorage.setItem('sauldle_visited', '1')
    }
  }, [])

  const canGiveUp = gameState === 'playing' && guesses.length >= 10

  return (
    <div className="app">
      <Header
        dayNumber={dayNumber}
        onShowStats={() => setShowStats(true)}
        onShowHelp={() => setShowHelp(true)}
      />

      <main className="main">
        <div className="game-container">
          <p className="subtitle">
            Breaking Bad and Better Call Saul Character Guessing game :D 
          </p>

          {gameState === 'playing' && (
            <>
              {confirmGiveUp ? (
                <div className="give-up-confirm">
                  <span>Give up and see the answer?</span>
                  <div className="give-up-confirm-btns">
                    <button className="btn-give-up-yes" onClick={() => { giveUp(); setConfirmGiveUp(false) }}>
                      Yes, reveal it
                    </button>
                    <button className="btn-give-up-no" onClick={() => setConfirmGiveUp(false)}>
                      No, keep trying
                    </button>
                  </div>
                </div>
              ) : (
                <SearchInput
                  characters={characters}
                  guesses={guesses}
                  onGuess={submitGuess}
                  disabled={false}
                />
              )}

              {canGiveUp && !confirmGiveUp && (
                <button className="give-up-link" onClick={() => setConfirmGiveUp(true)}>
                  Give up?
                </button>
              )}
            </>
          )}

          {gameState === 'won' && (
            <div className="won-banner">
              <span>Got it in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}.</span>
              <button className="btn-outline" onClick={() => setShowVictory(true)}>
                See result
              </button>
            </div>
          )}

          {gameState === 'given_up' && (
            <div className="given-up-banner">
              <div className="given-up-content">
                <img src={target.image} alt={target.name} className="given-up-img" referrerPolicy="no-referrer" />
                <div className="given-up-info">
                  <p className="given-up-label">It was</p>
                  <p className="given-up-name">{target.name}</p>
                  {target.aliases.length > 0 && (
                    <p className="given-up-aliases">{target.aliases.join(' · ')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <HintPanel
            unlockedHints={unlockedHints}
            revealedHints={revealedHints}
            onReveal={revealHint}
            target={target}
            wrongGuesses={wrongGuesses}
            gameState={gameState}
          />

          <GuessTable guesses={guesses} />

          {guesses.length === 0 && (
            <p className="empty-state">
              start typing to guess
            </p>
          )}
        </div>
      </main>

      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {showVictory && (
        <VictoryModal
          target={target}
          guesses={guesses}
          dayNumber={dayNumber}
          stats={stats}
          onClose={() => setShowVictory(false)}
        />
      )}

      {showStats && (
        <StatsModal
          stats={stats}
          guesses={guesses}
          dayNumber={dayNumber}
          gameState={gameState}
          onClose={() => setShowStats(false)}
        />
      )}

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  )
}
