import { useState } from 'react'
import { isCorrectGuess } from '../utils/comparison.js'

const SHOW_NAMES = {
  BrBa: ['Breaking Bad'],
  BCS:  ['Better Call Saul'],
  Both: ['Breaking Bad', 'Better Call Saul'],
}

function Cell({ result, children, className = '', index, isNew }) {
  return (
    <div
      className={`cell cell--${result} ${className} ${isNew ? 'cell--new' : ''}`}
      style={isNew ? { '--i': index } : undefined}
    >
      {children}
    </div>
  )
}

function CharacterImage({ src, alt, isCorrect }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`cell cell-image cell--${isCorrect ? 'correct' : 'incorrect'}`}>
      {!loaded && !errored && <div className="guess-img-skeleton" />}
      {errored ? (
        <div className="guess-img-fallback">?</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`guess-img${loaded ? '' : ' guess-img--loading'}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
      <span className="guess-img-name">{alt}</span>
    </div>
  )
}

export default function GuessRow({ guess, isNew }) {
  const { character, comparison } = guess
  const correct = isCorrectGuess(comparison)

  return (
    <div className="guess-row" role="row">
      <CharacterImage
        src={character.image}
        alt={character.name}
        isCorrect={correct}
      />

      <Cell result={comparison.gender.result} className="cell-text" index={0} isNew={isNew}>
        {character.gender}
      </Cell>

      <Cell result={comparison.show.result} className="cell-text cell-show" index={1} isNew={isNew}>
        {SHOW_NAMES[character.show].map((name, i) => (
          <span key={i}>{name}</span>
        ))}
      </Cell>

      <Cell result={comparison.criminalInvolvement.result} className="cell-text cell-age" index={2} isNew={isNew}>
        <span>{character.criminalInvolvement}</span>
        {comparison.criminalInvolvement.arrow && (
          <span
            className="age-arrow"
            aria-label={comparison.criminalInvolvement.arrow === 'up' ? 'target is higher' : 'target is lower'}
          >
            {comparison.criminalInvolvement.arrow === 'up' ? '↑' : '↓'}
          </span>
        )}
      </Cell>

      <Cell result={comparison.status.result} className="cell-text" index={3} isNew={isNew}>
        {character.status}
      </Cell>

      <Cell result={comparison.firstAppearance.result} className="cell-text cell-age" index={4} isNew={isNew}>
        <span>S{character.firstAppearance.season} E{character.firstAppearance.episode}</span>
        {comparison.firstAppearance.arrow && (
          <span
            className="age-arrow"
            aria-label={comparison.firstAppearance.arrow === 'later' ? 'target appears later' : 'target appears earlier'}
          >
            {comparison.firstAppearance.arrow === 'later' ? '↑' : '↓'}
          </span>
        )}
      </Cell>

      <Cell result={comparison.ageGroup.result} className="cell-text cell-age" index={5} isNew={isNew}>
        <span>{character.ageGroup}</span>
        {comparison.ageGroup.arrow && (
          <span
            className="age-arrow"
            aria-label={comparison.ageGroup.arrow === 'up' ? 'target is older' : 'target is younger'}
          >
            {comparison.ageGroup.arrow === 'up' ? '↑' : '↓'}
          </span>
        )}
      </Cell>
    </div>
  )
}
