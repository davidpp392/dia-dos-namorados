import { useMemo } from 'react'
import { Heart } from 'lucide-react'

const HEART_COUNT = 28

function createHearts() {
  return Array.from({ length: HEART_COUNT }, (_, i) => ({
    id: i,
    left: `${(i * 13.7 + 4) % 98}%`,
    size: 14 + (i % 5) * 6,
    duration: 7 + (i % 6) * 2.5,
    delay: (i % HEART_COUNT) * 0.55,
    opacity: 0.15 + (i % 4) * 0.12,
    spin: (i % 2 === 0 ? 1 : -1) * (180 + (i % 3) * 90),
    color:
      i % 3 === 0
        ? 'text-rose-300/70'
        : i % 3 === 1
          ? 'text-pink-400/60'
          : 'text-rose-400/50',
  }))
}

export default function FallingHearts() {
  const hearts = useMemo(() => createHearts(), [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className={`falling-heart absolute ${heart.color}`}
          size={heart.size}
          fill="currentColor"
          strokeWidth={0}
          style={{
            left: heart.left,
            '--fall-duration': `${heart.duration}s`,
            '--fall-delay': `${heart.delay}s`,
            '--fall-opacity': heart.opacity,
            '--fall-spin': `${heart.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}
