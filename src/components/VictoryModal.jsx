import { useState, useEffect } from 'react'
import { generateShareText, copyToClipboard } from '../utils/share.js'

export default function VictoryModal({ target, guesses, dayNumber, stats, onClose }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  async function handleShare() {
    const text = generateShareText(guesses, dayNumber)
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Victory">
      <div className="modal modal--victory" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="victory-character">
          <img src={target.image} alt={target.name} className="victory-img" referrerPolicy="no-referrer" />
          <div className="victory-info">
            <p className="victory-solved">Got it in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}</p>
            <h2 className="victory-name">{target.name}</h2>
            {target.aliases.length > 0 && (
              <p className="victory-aliases">{target.aliases.join(' · ')}</p>
            )}
            <p className="victory-day">Sauldle #{dayNumber}</p>
          </div>
        </div>

        <div className="victory-stats">
          <div className="mini-stat">
            <span className="mini-stat-val">{stats.currentStreak}</span>
            <span className="mini-stat-label">Current streak</span>
          </div>
          <div className="mini-stat-divider" />
          <div className="mini-stat">
            <span className="mini-stat-val">{stats.maxStreak}</span>
            <span className="mini-stat-label">Best streak</span>
          </div>
          <div className="mini-stat-divider" />
          <div className="mini-stat">
            <span className="mini-stat-val">{stats.wins}</span>
            <span className="mini-stat-label">Total wins</span>
          </div>
        </div>

        <button className="btn-share" onClick={handleShare}>
          {copied ? 'Copied to clipboard' : 'Share result'}
        </button>
      </div>
    </div>
  )
}
