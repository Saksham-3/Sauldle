import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import GuessRow from './GuessRow.jsx'

const HEADERS = ['Character', 'Gender', 'Show', 'Criminal', 'Status', 'First App.', 'Age Group']

const CRIME_TIERS = [
  { tier: 'None',     desc: 'No meaningful involvement in criminal activity' },
  { tier: 'Minor',    desc: 'Occasional involvement or low-level crime' },
  { tier: 'Moderate', desc: 'Regular involvement in criminal activity or knowingly helps criminals.' },
  { tier: 'Major',    desc: 'Plays a very big part in criminal operations and helps A LOT.' },
  { tier: 'Extreme',  desc: 'Central figure in major criminal organization.' },
]

function CriminalHeader() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const tooltipRef = useRef(null)

  const TOOLTIP_WIDTH = 272

  const calcPos = () => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2
    left = Math.max(8, Math.min(left, window.innerWidth - TOOLTIP_WIDTH - 8))
    setPos({ top: rect.bottom + 8, left })
  }

  const toggle = (e) => {
    e.stopPropagation()
    if (!open) calcPos()
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onPointerDown = (e) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('scroll', close, { capture: true, passive: true })
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scroll', close, { capture: true })
      window.removeEventListener('resize', close)
    }
  }, [open])

  return (
    <div className="cell cell-header criminal-header" role="columnheader">
      <span className="crime-label-full">Criminal</span>
      <span className="crime-label-short">Crime</span>
      <button
        ref={btnRef}
        className="crime-info-btn"
        aria-label="Criminal involvement tier definitions"
        aria-expanded={open}
        onClick={toggle}
      >
        ?
      </button>
      {open && createPortal(
        <div
          ref={tooltipRef}
          className="crime-tooltip"
          style={{ top: pos.top, left: pos.left }}
          role="tooltip"
        >
          <p className="crime-tooltip-title">Criminal Involvement Tiers</p>
          {CRIME_TIERS.map(({ tier, desc }) => (
            <div key={tier} className="crime-tooltip-row">
              <span className="crime-tooltip-tier">{tier}</span>
              <span className="crime-tooltip-desc">{desc}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

export default function GuessTable({ guesses }) {
  const [animatingId, setAnimatingId] = useState(null)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const wrapperRef = useRef(null)
  const prevLengthRef = useRef(0)

  useEffect(() => {
    if (guesses.length <= prevLengthRef.current) {
      prevLengthRef.current = guesses.length
      return
    }
    const newest = guesses[guesses.length - 1]
    setAnimatingId(newest.character.id)
    prevLengthRef.current = guesses.length
    const t = setTimeout(() => setAnimatingId(null), 2000)
    return () => clearTimeout(t)
  }, [guesses])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const check = () => setShowScrollHint(
      el.scrollWidth > el.clientWidth && el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    )
    check()
    el.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      el.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [guesses.length])

  if (guesses.length === 0) return null

  const reversed = [...guesses].reverse()

  return (
    <div className="guess-table-outer">
      <div className="guess-table-wrapper" ref={wrapperRef} role="table" aria-label="Guess results">
        <div className="guess-table">
          <div className="guess-row guess-header" role="row">
            {HEADERS.map(h => (
              h === 'Criminal'
                ? <CriminalHeader key={h} />
                : <div key={h} className="cell cell-header" role="columnheader">{h}</div>
            ))}
          </div>
          {reversed.map(guess => (
            <GuessRow
              key={guess.character.id}
              guess={guess}
              isNew={guess.character.id === animatingId}
            />
          ))}
        </div>
      </div>
      {showScrollHint && <div className="scroll-hint" aria-hidden="true" />}
    </div>
  )
}
