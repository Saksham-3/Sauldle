import { useState, useEffect } from 'react'
import { generateShareText, copyToClipboard } from '../utils/share.js'

export default function StatsModal({ stats, guesses, dayNumber, gameState, onClose }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0
  const avgGuesses = stats.wins > 0
    ? (stats.totalGuesses / stats.wins).toFixed(1)
    : '-'

  async function handleShare() {
    const text = generateShareText(guesses, dayNumber)
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const statItems = [
    { label: 'Played',         value: stats.gamesPlayed },
    { label: 'Win rate',       value: `${winPct}%` },
    { label: 'Current streak', value: stats.currentStreak },
    { label: 'Best streak',    value: stats.maxStreak },
    { label: 'Avg guesses',    value: avgGuesses },
    { label: "Today's",        value: guesses.length || '-' },
  ]

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Statistics">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="modal-title">Stats</h2>

        <div className="stats-grid">
          {statItems.map(({ label, value }) => (
            <div key={label} className="stat-item">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        {gameState === 'won' && guesses.length > 0 && (
          <button className="btn-share" onClick={handleShare}>
            {copied ? 'Copied to clipboard' : 'Share result'}
          </button>
        )}

        {stats.gamesPlayed === 0 && (
          <p className="stats-empty">No complete games yet...</p>
        )}
      </div>
    </div>
  )
}
