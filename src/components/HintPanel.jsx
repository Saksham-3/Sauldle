const HINT_META = [
  { key: 'occupation', label: 'Occupation', threshold: 3 },
  { key: 'quote',      label: 'Quote',      threshold: 6 },
  { key: 'image',      label: 'Photo',      threshold: 9 },
]

export default function HintPanel({ unlockedHints, revealedHints, onReveal, target, wrongGuesses, gameState }) {
  const anyUnlocked = HINT_META.some(h => unlockedHints[h.key])
  if (!anyUnlocked && wrongGuesses === 0) return null

  const nextHint = HINT_META.find(h => !unlockedHints[h.key])
  const guessesUntilNext = nextHint ? nextHint.threshold - wrongGuesses : null

  return (
    <div className="hint-panel">
      {HINT_META.map(({ key, label }) => {
        if (!unlockedHints[key]) return null

        if (!revealedHints[key]) {
          return (
            <button
              key={key}
              className="hint-unlock-btn"
              onClick={() => onReveal(key)}
            >
              <span className="hint-unlock-dot" aria-hidden="true" />
              <span className="hint-unlock-type">you unlocked a {label.toLowerCase()} hint</span>
              <span className="hint-unlock-cta">show it</span>
            </button>
          )
        }

        return (
          <div key={key} className="hint-card">
            <span className="hint-tag">{label}</span>
            {key === 'quote' && (
              <blockquote className="hint-quote">"{target.quote}"</blockquote>
            )}
            {key === 'occupation' && (
              <p className="hint-value">{target.occupation}</p>
            )}
            {key === 'image' && (
              <img src={target.image} alt="Character hint" className="hint-image" referrerPolicy="no-referrer" />
            )}
          </div>
        )
      })}

      {gameState === 'playing' && guessesUntilNext !== null && (
        <p className="hint-progress">
          {guessesUntilNext} more wrong {guessesUntilNext === 1 ? 'guess' : 'guesses'} and you get a hint
        </p>
      )}
    </div>
  )
}
