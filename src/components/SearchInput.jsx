import { useState, useRef, useEffect, useMemo } from 'react'

export default function SearchInput({ characters, guesses, onGuess, disabled }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const guessedIds = useMemo(() => new Set(guesses.map(g => g.character.id)), [guesses])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const matches = characters.filter(c => {
      if (guessedIds.has(c.id)) return false
      return (
        c.name.toLowerCase().includes(q) ||
        c.aliases.some(a => a.toLowerCase().includes(q))
      )
    })

    const priority = (c) => {
      if (c.name.toLowerCase().startsWith(q)) return 0
      if (c.aliases.some(a => a.toLowerCase().startsWith(q))) return 1
      return 2
    }

    return matches
      .sort((a, b) => {
        const diff = priority(a) - priority(b)
        return diff !== 0 ? diff : a.name.localeCompare(b.name)
      })
      .slice(0, 8)
  }, [query, characters, guessedIds])

  const isOpen = open && filtered.length > 0

  useEffect(() => { setActiveIndex(-1) }, [filtered])

  useEffect(() => {
    function onMouseDown(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        e.target !== inputRef.current
      ) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleSelect(character) {
    onGuess(character)
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0) handleSelect(filtered[activeIndex])
      else if (filtered.length === 1) handleSelect(filtered[0])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      dropdownRef.current
        .querySelector(`[data-index="${activeIndex}"]`)
        ?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setOpen(true)}
          placeholder="Search by name or alias…"
          disabled={disabled}
          aria-label="Search for a character"
          aria-autocomplete="list"
          aria-controls={isOpen ? 'search-listbox' : undefined}
          aria-expanded={isOpen}
          role="combobox"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            aria-label="Clear"
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          id="search-listbox"
          className="search-dropdown"
          ref={dropdownRef}
          role="listbox"
        >
          {filtered.map((char, i) => (
            <li
              key={char.id}
              data-index={i}
              className={`dropdown-item${i === activeIndex ? ' dropdown-item--active' : ''}`}
              onMouseDown={() => handleSelect(char)}
              onMouseEnter={() => setActiveIndex(i)}
              role="option"
              aria-selected={i === activeIndex}
            >
              <img src={char.image} alt="" className="dropdown-thumb" loading="lazy" referrerPolicy="no-referrer" />
              <div className="dropdown-labels">
                <span className="dropdown-name">{char.name}</span>
                {char.aliases.length > 0 && (
                  <span className="dropdown-aliases">{char.aliases.join(' · ')}</span>
                )}
              </div>
              <span className="dropdown-show">
                {char.show === 'BrBa' ? 'BB' : char.show === 'BCS' ? 'BCS' : 'Both'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
