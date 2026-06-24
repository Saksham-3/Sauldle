const EMOJI = { correct: '🟩', partial: '🟨', incorrect: '🟥' }
const ARROW = { up: '⬆️', down: '⬇️', later: '⬆️', earlier: '⬇️' }

function cell(comparison) {
  return comparison.arrow ? ARROW[comparison.arrow] : EMOJI[comparison.result]
}

export function generateShareText(guesses, dayNumber) {
  const rows = [...guesses].reverse().map(({ comparison }) => {
    const cells = [
      EMOJI[comparison.gender.result],
      EMOJI[comparison.show.result],
      cell(comparison.criminalInvolvement),
      EMOJI[comparison.status.result],
      cell(comparison.firstAppearance),
      cell(comparison.ageGroup),
    ]
    return cells.join('')
  })

  return [
    `Sauldle #${dayNumber}`,
    ...rows,
    `Guesses: ${guesses.length}`,
    `Play here: https://sauldle.pages.dev/`,
  ].join('\n')
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
}
