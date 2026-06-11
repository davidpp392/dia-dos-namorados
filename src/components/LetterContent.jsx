import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export default function LetterContent({
  day,
  paragraphs,
  isPreview,
  justUnlocked,
  onAnimationComplete,
}) {
  const containerRef = useRef(null)
  const flashRef = useRef(null)
  const lockShardsRef = useRef(null)

  useGSAP(
    () => {
      if (!justUnlocked || !containerRef.current) return

      const container = containerRef.current
      const paragraphEls = container.querySelectorAll('[data-paragraph]')

      const tl = gsap.timeline({
        onComplete: () => onAnimationComplete?.(),
      })

      switch (day) {
        case 8: {
          // Admiração — blur dissipa + scale spring
          tl.fromTo(
            container,
            { scale: 0.8, filter: 'blur(16px)', opacity: 0.5 },
            {
              scale: 1,
              filter: 'blur(0px)',
              opacity: 1,
              duration: 1.4,
              ease: 'elastic.out(1, 0.6)',
            },
          )
          break
        }

        case 9: {
          // Detalhes — stagger dos parágrafos de baixo
          tl.set(paragraphEls, { y: 48, opacity: 0 })
          tl.to(paragraphEls, {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.22,
            ease: 'power2.out',
          })
          break
        }

        case 10: {
          // Memórias — flash fotográfico
          const flash = flashRef.current
          tl.set(container, { opacity: 0 })
          if (flash) {
            tl.fromTo(
              flash,
              { opacity: 0 },
              { opacity: 1, duration: 0.08, ease: 'power4.in' },
            )
            tl.to(flash, { opacity: 0, duration: 0.55, ease: 'power2.out' })
          }
          tl.to(container, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
          break
        }

        case 11: {
          // Gratidão — respiração contínua no eixo Y
          tl.fromTo(
            container,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => onAnimationComplete?.(),
            },
          )
          tl.to(container, {
            y: -6,
            duration: 2.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
          break
        }

        case 12: {
          // Futuro — cadeado explode + brilho dourado
          const shards = lockShardsRef.current?.querySelectorAll('[data-shard]')
          const textEls = container.querySelectorAll('[data-golden]')

          if (shards?.length) {
            tl.fromTo(
              lockShardsRef.current,
              { opacity: 1, scale: 1 },
              { opacity: 1, duration: 0.1 },
            )
            tl.to(shards, {
              x: () => gsap.utils.random(-80, 80),
              y: () => gsap.utils.random(-60, 60),
              rotation: () => gsap.utils.random(-180, 180),
              opacity: 0,
              scale: 0.3,
              duration: 0.85,
              stagger: 0.03,
              ease: 'power3.out',
            })
            tl.to(lockShardsRef.current, { opacity: 0, duration: 0.2 }, '-=0.3')
          }

          tl.fromTo(
            container,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
            '-=0.5',
          )

          tl.to(
            textEls,
            {
              color: '#b8860b',
              textShadow:
                '0 0 12px rgba(212,175,55,0.7), 0 0 28px rgba(212,175,55,0.4)',
              duration: 1.2,
              ease: 'power2.inOut',
              stagger: 0.15,
            },
            '-=0.4',
          )
          break
        }

        default:
          tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6 })
      }

      return () => {
        tl.kill()
        gsap.set(container, { clearProps: 'all' })
      }
    },
    {
      dependencies: [justUnlocked, day],
      scope: containerRef,
    },
  )

  return (
    <div className="relative h-full">
      {day === 10 && (
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 z-30 bg-white opacity-0"
          aria-hidden
        />
      )}

      {day === 12 && justUnlocked && (
        <div
          ref={lockShardsRef}
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              data-shard
              className="absolute h-2 w-2 rounded-sm bg-amber-600/80"
              style={{
                left: `${Math.cos((i / 12) * Math.PI * 2) * 18}px`,
                top: `${Math.sin((i / 12) * Math.PI * 2) * 18}px`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
          <div className="absolute -top-3 left-1/2 h-4 w-5 -translate-x-1/2 rounded-t-full border-4 border-amber-600/80 border-b-0" />
        </div>
      )}

      <div
        ref={containerRef}
        className={`h-full overflow-y-auto transition-all duration-300 ${
          isPreview
            ? 'pointer-events-none opacity-50 backdrop-blur-xl'
            : 'opacity-100'
        } ${day === 12 && !isPreview && !justUnlocked ? 'golden-glow' : ''}`}
      >
        <div className="space-y-4">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              data-paragraph
              data-golden
              className="font-sans text-base leading-relaxed text-slate-700/90 sm:text-lg lg:text-xl lg:leading-loose"
            >
              {text}
            </p>
          ))}
        </div>

        {!isPreview && (
          <p className="font-serif mt-8 text-right text-base text-rose-400/70 italic sm:text-lg">
            — Com amor, sempre
          </p>
        )}
      </div>
    </div>
  )
}
