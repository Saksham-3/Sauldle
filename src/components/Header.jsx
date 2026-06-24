export default function Header({ dayNumber, onShowStats, onShowHelp }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="icon-btn" onClick={onShowHelp} aria-label="How to play">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r=".5" fill="currentColor" />
          </svg>
        </button>

        <div className="header-title">
          <h1 className="site-title"><span className="site-title-saul">Saul</span>dle</h1>
          <span className="day-number">#{dayNumber}</span>
        </div>

        <button className="icon-btn" onClick={onShowStats} aria-label="Statistics">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>
      </div>
    </header>
  )
}
