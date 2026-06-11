import { useState } from 'react'
import { Heart, Lock, Unlock } from 'lucide-react'

export default function LockScreen({ day, password, onUnlock }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const normalizedInput = input.trim().toLowerCase()
    const normalizedPassword = (password ?? '').trim().toLowerCase()

    if (normalizedInput === normalizedPassword) {
      setError('')
      onUnlock()
      return
    }

    setError('Senha incorreta. Tente novamente com carinho.')
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-xs rounded-2xl border border-white/40 bg-white/30 p-7 shadow-xl backdrop-blur-xl sm:max-w-sm sm:p-8 ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
        style={{
          animation: isShaking
            ? 'shake 0.5s ease-in-out'
            : undefined,
        }}
      >
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100/80">
            <Lock className="text-rose-500" size={22} strokeWidth={1.5} />
          </div>
          <p className="font-serif text-center text-xl text-rose-900/80 sm:text-2xl">
            Carta do dia {day}
          </p>
          <p className="font-sans text-center text-xs text-slate-500">
            Digite a senha secreta para abrir
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError('')
            }}
            placeholder="Sua senha..."
            className="font-sans w-full rounded-xl border border-rose-200/60 bg-white/70 px-4 py-2.5 text-sm text-rose-900 placeholder:text-rose-300/70 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50"
            autoComplete="off"
          />

          {error && (
            <p className="font-sans text-center text-xs text-rose-500">{error}</p>
          )}

          <button
            type="submit"
            className="font-sans flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-rose-600 hover:to-pink-600 active:scale-[0.98]"
          >
            <Unlock size={16} />
            Desbloquear
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <Heart className="text-rose-300/60" size={14} fill="currentColor" />
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
