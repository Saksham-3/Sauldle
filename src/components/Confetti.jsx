import { useEffect, useRef } from 'react'

const COLORS = ['#22c55e', '#86efac', '#eab308', '#fde047', '#f1f5f9', '#7dd3fc']

export default function Confetti({ onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 110 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 350,
      vx: (Math.random() - 0.5) * 4,
      vy: 1.8 + Math.random() * 2.5,
      color: COLORS[i % COLORS.length],
      w: 5 + Math.random() * 7,
      h: 6 + Math.random() * 5,
      r: Math.random() * Math.PI * 2,
      dr: (Math.random() - 0.5) * 0.13,
    }))

    const start = Date.now()
    let raf

    const tick = () => {
      const elapsed = Date.now() - start
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const fade = elapsed > 2400 ? Math.max(0, 1 - (elapsed - 2400) / 900) : 1

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06
        p.r += p.dr
        p.vx *= 0.996

        ctx.save()
        ctx.globalAlpha = fade
        ctx.translate(p.x, p.y)
        ctx.rotate(p.r)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })

      if (elapsed < 3400) {
        raf = requestAnimationFrame(tick)
      } else {
        onDone?.()
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [onDone])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}
      aria-hidden="true"
    />
  )
}
