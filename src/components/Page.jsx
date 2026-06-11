import { forwardRef } from 'react'
import { Lock } from 'lucide-react'
import LockScreen from './LockScreen'
import LetterContent from './LetterContent'

function getPageState(pageData, currentDate, isUnlocked) {
  const target = new Date(pageData.year, pageData.month - 1, pageData.day)
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  )

  if (today < target) return 'future'
  if (!isUnlocked) return 'locked'
  return 'unlocked'
}

const Page = forwardRef(function Page(
  {
    pageData,
    password,
    currentDate,
    isUnlocked,
    isFlipped,
    zIndex,
    onUnlock,
    justUnlocked,
    onAnimationComplete,
  },
  ref,
) {
  const pageState = getPageState(pageData, currentDate, isUnlocked)
  const formattedDate = `${String(pageData.day).padStart(2, '0')}/06/2026`

  return (
    <div
      ref={ref}
      className="page-3d absolute inset-0 rounded-r-xl rounded-l-sm"
      style={{
        zIndex,
        transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
      }}
    >
      <div className="page-face paper-lined absolute inset-0 overflow-hidden rounded-r-xl rounded-l-sm shadow-md ring-1 ring-amber-900/5">
        <div className="flex h-full flex-col p-7 sm:p-10 lg:p-12">
          <div className="mb-5 border-b border-amber-900/10 pb-4 sm:mb-6 sm:pb-5">
            <p className="font-sans text-xs font-medium tracking-widest text-rose-400 uppercase sm:text-sm">
              {formattedDate}
            </p>
            <h2 className="font-serif text-3xl font-semibold text-rose-900/90 sm:text-4xl lg:text-5xl">
              {pageData.theme}
            </h2>
            <p className="font-serif mt-1 text-base italic text-amber-800/60 sm:text-lg">
              {pageData.subtitle}
            </p>
          </div>

          <div className="relative min-h-0 flex-1">
            {pageState === 'future' && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100/80 shadow-inner sm:h-24 sm:w-24">
                  <Lock className="text-rose-400" size={36} strokeWidth={1.5} />
                </div>
                <p className="font-serif text-xl text-rose-800/70 sm:text-2xl">
                  Aguarde o dia {pageData.day}
                </p>
                <p className="font-sans max-w-xs text-sm text-slate-400 sm:text-base">
                  Esta carta será revelada em {formattedDate}
                </p>
              </div>
            )}

            {pageState !== 'future' && (
              <>
                <LetterContent
                  day={pageData.day}
                  paragraphs={pageData.paragraphs}
                  isPreview={pageState === 'locked'}
                  justUnlocked={justUnlocked}
                  onAnimationComplete={onAnimationComplete}
                />

                {pageState === 'locked' && (
                  <LockScreen
                    day={pageData.day}
                    password={password}
                    onUnlock={onUnlock}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute right-3 bottom-3 font-serif text-[10px] text-amber-900/20">
          ♥
        </div>
      </div>

      <div className="page-face page-back paper-lined absolute inset-0 overflow-hidden rounded-r-xl rounded-l-sm shadow-md ring-1 ring-amber-900/5">
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 h-px w-16 bg-rose-300/40" />
          <p className="font-serif text-xl text-rose-800/50 italic">
            &ldquo;O amor é feito de momentos&rdquo;
          </p>
          <div className="mt-4 h-px w-16 bg-rose-300/40" />
          <HeartDecoration />
        </div>
      </div>
    </div>
  )
})

function HeartDecoration() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-6 h-8 w-8 text-rose-300/50"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export default Page
