import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Page from './Page'
import PageNavigation from './PageNavigation'
import NotebookCover from './NotebookCover'

gsap.registerPlugin(useGSAP)

export default function Notebook({
  pages,
  passwords,
  currentDate,
  isDayUnlocked,
  onUnlock,
  justUnlockedDay,
  onAnimationComplete,
  onPageChange,
}) {
  const [flippedCount, setFlippedCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const notebookRef = useRef(null)
  const pageRefs = useRef([])

  const canGoNext = flippedCount < pages.length - 1
  const canGoPrev = flippedCount > 0

  useEffect(() => {
    onPageChange?.(flippedCount)
  }, [flippedCount, onPageChange])

  const flipPage = (direction) => {
    if (isAnimating) return

    if (direction === 'next' && canGoNext) {
      const pageEl = pageRefs.current[flippedCount]
      if (!pageEl) return

      setIsAnimating(true)
      gsap.fromTo(
        pageEl,
        { rotateY: 0 },
        {
          rotateY: -180,
          duration: 1,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          onComplete: () => {
            setFlippedCount((c) => c + 1)
            setIsAnimating(false)
          },
        },
      )
    }

    if (direction === 'prev' && canGoPrev) {
      const pageEl = pageRefs.current[flippedCount - 1]
      if (!pageEl) return

      setIsAnimating(true)
      gsap.fromTo(
        pageEl,
        { rotateY: -180 },
        {
          rotateY: 0,
          duration: 1,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          onComplete: () => {
            setFlippedCount((c) => c - 1)
            setIsAnimating(false)
          },
        },
      )
    }
  }

  useGSAP(
    () => {
      gsap.from(notebookRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2,
      })
    },
    { scope: notebookRef },
  )

  const currentTheme = pages[flippedCount]?.theme ?? ''

  return (
    <div className="w-full max-w-4xl px-1 sm:px-2">
      <div
        ref={notebookRef}
        className="notebook-scene relative mx-auto w-full"
        style={{
          height: 'min(82vh, 920px)',
          minHeight: '520px',
        }}
      >
        <NotebookCover />

        <div className="paper-texture absolute inset-2 rounded-r-2xl rounded-l-md shadow-inner ring-1 ring-amber-900/8" />

        <div
          className="absolute inset-2"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {pages.map((page, index) => {
            const isFlipped = index < flippedCount
            const zIndex = isFlipped ? index : pages.length - index

            return (
              <Page
                key={page.day}
                ref={(el) => {
                  pageRefs.current[index] = el
                }}
                pageData={page}
                password={passwords[page.day]}
                currentDate={currentDate}
                isUnlocked={isDayUnlocked(page.day)}
                isFlipped={isFlipped}
                zIndex={zIndex}
                onUnlock={() => onUnlock(page.day)}
                justUnlocked={justUnlockedDay === page.day}
                onAnimationComplete={onAnimationComplete}
              />
            )
          })}
        </div>

        <div className="pointer-events-none absolute top-2 bottom-2 left-2 w-3 rounded-l-md bg-gradient-to-r from-amber-900/15 to-transparent" />

        <div className="pointer-events-none absolute top-8 right-6 z-10 rounded-lg border border-white/50 bg-white/55 px-3 py-2 shadow-md backdrop-blur-sm">
          <p className="font-serif text-[11px] font-semibold tracking-wide text-rose-800/80 uppercase">
            Memórias
          </p>
          <p className="font-sans text-[9px] text-rose-500/70">Junho 2026</p>
        </div>
      </div>

      <PageNavigation
        current={flippedCount}
        total={pages.length}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        isAnimating={isAnimating}
        onPrev={() => flipPage('prev')}
        onNext={() => flipPage('next')}
        currentTheme={currentTheme}
      />
    </div>
  )
}
