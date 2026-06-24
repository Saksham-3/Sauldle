import { useEffect } from 'react'

export default function HelpModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="How to play">
      <div className="modal modal--help" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="modal-title">How to play</h2>

        <p className="help-intro">
          A character from the Breaking Bad universe is chosen each day. Guess the character !!!
        </p>

        <h3 className="help-section-title">After each guess, the columns tell you how close you were</h3>

        <div className="help-examples">
          <div className="help-row">
            <div className="help-cell help-cell--correct">Male</div>
            <span className="help-desc">Correct!</span>
          </div>
          <div className="help-row">
            <div className="help-cell help-cell--partial">S2</div>
            <span className="help-desc">Close, same season, different episode</span>
          </div>
          <div className="help-row">
            <div className="help-cell help-cell--incorrect">BCS</div>
            <span className="help-desc">Incorrect!</span>
          </div>
        </div>

        <h3 className="help-section-title">Columns</h3>
        <ul className="help-list">
          <li><strong>Gender</strong> - Male or Female (unwoke)</li>
          <li><strong>Show</strong> - Breaking Bad, Better Call Saul, or both</li>
          <li><strong>Criminal</strong> - None, Minor, Moderate, Major, or Extreme. Arrows show if the target is higher (↑) or lower (↓) on the scale.</li>
          <li><strong>Status</strong> - Alive or Dead</li>
          <li><strong>First Appearance</strong> - Season and Episode Number</li>
          <li><strong>Age Group</strong> - Teen, Young Adult, Adult, or Senior. The arrows show if the target is older (↑) or younger (↓).</li>
        </ul>

        <h3 className="help-section-title">Hints</h3>
        <p className="help-text">
          After enough wrong guesses, you get optional hints to help.
        </p>
        <ul className="help-list">
          <li><strong>3 wrong guesses</strong> - their occupation</li>
          <li><strong>6 wrong guesses</strong> - a quote from the character</li>
          <li><strong>9 wrong guesses</strong> - their photo</li>
        </ul>
      </div>
    </div>
  )
}
