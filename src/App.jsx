import { useCallback, useEffect, useState } from 'react'
import BackgroundImage from './components/BackgroundImage'
import MusicAlbum from './components/MusicAlbum'
import FallingHearts from './components/FallingHearts'
import Notebook from './components/Notebook'

const STORAGE_KEY = 'cadernoMemorias'

// Coloque sua imagem em: public/images/background.jpg
// (também aceita .png ou .webp — só mude o caminho aqui)
export const BACKGROUND_IMAGE = '/images/background.jpg'

// ─── Configure as senhas de cada dia aqui ───────────────────────────────────
export const DAY_PASSWORDS = {
  12: 'admiração',
  13: 'detalhes',
  14: 'memórias',
  15: 'gratidão',
  16: 'futuro',
}

export const NOTEBOOK_PAGES = [
  {
    day: 12,
    month: 6,
    year: 2026,
    theme: 'Admiração',
    subtitle: 'O primeiro olhar que ficou',
    paragraphs: [
      'Você para mim é uma das pessoas mais incríveis que eu conheci. Quando eu te vi, já sabia que seria alguém de que eu gostaria tanto, como amigo ou como namorado, mas sabia que teria algo.',
      'Tudo em você é perfeito. Você é muito inteligente, na minha opinião a que fala o inglês melhor da escola, mas você teima em dizer que não.',
      'Você é muito boa no totó, sem dúvidas a melhor goleira da ETRR, que é algo que eu não sabia que iria gostar tanto, mas acabei gostando bastante. Você me ensinou muitas coisas.',
      'A sua beleza, você é toda linda, esse seu cabelo cacheadinho que é muito lindo, seus olhos, seu nariz, tudo em você é perfeito.',
    ],
  },
  {
    day: 13,
    month: 6,
    year: 2026,
    theme: 'Detalhes',
    subtitle: 'Nas pequenas coisas que amo',
    paragraphs: [
      'Lembro do jeito que você franze o nariz quando está concentrada, do café que você prepara sem pedir, do silêncio confortável entre nós.',
      'São os detalhes que construíram nossa história — um olhar, um toque, uma mensagem no meio do dia que diz "estou pensando em você".',
      'Eu guardo cada um desses momentos como quem guarda joias em um baú.',
    ],
  },
  {
    day: 14,
    month: 6,
    year: 2026,
    theme: 'Memórias',
    subtitle: 'Fotografias do nosso tempo',
    paragraphs: [
      'Nossa primeira viagem, aquela noite de chuva em que rimos até doer a barriga, o dia em que dançamos sem música na cozinha.',
      'Memórias não são só do passado — são o alicerce do que ainda vamos viver. Cada lembrança sua é um capítulo que eu releria mil vezes.',
      'Obrigado por me dar tantas páginas bonitas para guardar neste caderno.',
    ],
  },
  {
    day: 15,
    month: 6,
    year: 2026,
    theme: 'Gratidão',
    subtitle: 'Por tudo que você é',
    paragraphs: [
      'Gratidão por me escolher todos os dias, por me ouvir, por acreditar em nós mesmo quando o caminho parecia difícil.',
      'Você me ensinou que amar é um verbo — é cuidar, é aparecer, é ficar. E eu sou profundamente grato por ter você na minha vida.',
      'Que esta gratidão transborde em cada gesto nosso daqui para frente.',
    ],
  },
  {
    day: 16,
    month: 6,
    year: 2026,
    theme: 'Futuro',
    subtitle: 'O que ainda vamos escrever',
    paragraphs: [
      'Olho para frente e vejo nós dois — mais histórias, mais risadas, mais manhãs de café e noites de conversa.',
      'O futuro não me assusta quando imagino sua mão na minha. Quero construir sonhos contigo, página por página.',
      'Feliz Dia dos Namorados. Que o nosso amor continue crescendo, hoje e sempre. Te amo. ♥',
    ],
  },
]

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { unlockedDays: [] }
    const parsed = JSON.parse(raw)
    return { unlockedDays: Array.isArray(parsed.unlockedDays) ? parsed.unlockedDays : [] }
  } catch {
    return { unlockedDays: [] }
  }
}

function saveProgress(unlockedDays) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlockedDays }))
}

function App() {
  const [now, setNow] = useState(() => new Date())
  const [unlockedDays, setUnlockedDays] = useState(() => loadProgress().unlockedDays)
  const [justUnlockedDay, setJustUnlockedDay] = useState(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(tick)
  }, [])

  const isDayUnlocked = useCallback(
    (day) => unlockedDays.includes(day),
    [unlockedDays],
  )

  const handleUnlock = useCallback((day) => {
    setUnlockedDays((prev) => {
      if (prev.includes(day)) return prev
      const next = [...prev, day].sort((a, b) => a - b)
      saveProgress(next)
      return next
    })
    setJustUnlockedDay(day)
  }, [])

  const clearJustUnlocked = useCallback(() => {
    setJustUnlockedDay(null)
  }, [])

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <BackgroundImage src={BACKGROUND_IMAGE} />
      <FallingHearts />
      <MusicAlbum currentPageIndex={currentPageIndex} />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
        <header className="mb-5 text-center sm:mb-8">
          <p className="font-sans text-xs font-medium tracking-[0.35em] text-rose-400/80 uppercase sm:text-sm">
            Dia dos Namorados 2026
          </p>
          <h1 className="font-serif mt-2 text-3xl font-semibold text-rose-950/95 drop-shadow-sm sm:text-5xl">
            Caderno de Memórias
          </h1>
          <p className="font-sans mt-1 text-sm text-rose-900/70 sm:text-base">
            Uma carta por dia, do dia 12 ao 16 de junho
          </p>
        </header>

        <Notebook
          pages={NOTEBOOK_PAGES}
          passwords={DAY_PASSWORDS}
          currentDate={now}
          isDayUnlocked={isDayUnlocked}
          onUnlock={handleUnlock}
          justUnlockedDay={justUnlockedDay}
          onAnimationComplete={clearJustUnlocked}
          onPageChange={setCurrentPageIndex}
        />

      </div>
    </div>
  )
}

export default App
