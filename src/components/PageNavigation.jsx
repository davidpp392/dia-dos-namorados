import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'

export default function PageNavigation({
  current,
  total,
  canGoPrev,
  canGoNext,
  isAnimating,
  onPrev,
  onNext,
  currentTheme,
}) {
  return (
    <div className="mt-8 w-full">
      <div className="mx-auto flex max-w-lg items-center justify-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev || isAnimating}
          aria-label="Página anterior"
          className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-rose-200/70 bg-white/60 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-rose-300 hover:bg-white/90 hover:shadow-xl disabled:scale-100 disabled:opacity-30 disabled:shadow-none sm:h-16 sm:w-16"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400/0 to-pink-400/0 transition group-hover:from-rose-400/10 group-hover:to-pink-400/15" />
          <ChevronLeft
            className="relative text-rose-600 transition group-hover:-translate-x-0.5"
            size={26}
            strokeWidth={1.75}
          />
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === current
                    ? 'h-2.5 w-8 bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                    : i < current
                      ? 'h-2 w-2 bg-rose-300/80'
                      : 'h-2 w-2 bg-rose-200/50'
                }`}
              />
            ))}
          </div>

          <div className="w-full rounded-2xl border border-white/60 bg-white/45 px-5 py-3 text-center shadow-inner backdrop-blur-md">
            <p className="font-sans text-[10px] font-semibold tracking-[0.25em] text-rose-400 uppercase">
              Página {current + 1} de {total}
            </p>
            {currentTheme && (
              <p className="font-serif mt-0.5 truncate text-lg text-rose-900/85">
                {currentTheme}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext || isAnimating}
          aria-label="Próxima página"
          className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-rose-200/70 bg-white/60 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-rose-300 hover:bg-white/90 hover:shadow-xl disabled:scale-100 disabled:opacity-30 disabled:shadow-none sm:h-16 sm:w-16"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400/0 to-pink-400/0 transition group-hover:from-rose-400/10 group-hover:to-pink-400/15" />
          <ChevronRight
            className="relative text-rose-600 transition group-hover:translate-x-0.5"
            size={26}
            strokeWidth={1.75}
          />
        </button>
      </div>

      <p className="font-sans mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-rose-400/70">
        <Heart size={11} fill="currentColor" className="text-rose-300" />
        Vire a página com carinho
        <Heart size={11} fill="currentColor" className="text-rose-300" />
      </p>
    </div>
  )
}
