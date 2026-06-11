// ─── Álbum do Caderno — uma faixa por página ────────────────────────────────
// Coloque os arquivos .mp3 em: public/music/
// O nome do arquivo deve bater com o campo `file` de cada faixa.

export const ALBUM_TITLE = 'Nossa Trilha Sonora'
export const ALBUM_ARTIST = 'Caderno de Memórias'

export const PAGE_PLAYLIST = [
  {
    day: 8,
    theme: 'Admiração',
    title: 'Just the Way You Are',
    artist: 'Bruno Mars',
    file: 'just-the-way-you-are.mp3',
    accent: 'from-rose-400 to-pink-500',
  },
  {
    day: 9,
    theme: 'Detalhes',
    title: 'Every Breath You Take',
    artist: 'The Police',
    file: 'every-breath-you-take.mp3',
    accent: 'from-slate-400 to-blue-500',
  },
  {
    day: 10,
    theme: 'Memórias',
    title: 'Lover',
    artist: 'Taylor Swift',
    file: 'lover.mp3',
    accent: 'from-pink-400 to-rose-500',
  },
  {
    day: 11,
    theme: 'Gratidão',
    title: 'Apocalypse',
    artist: 'Cigarettes After Sex',
    file: 'apocalypse.mp3',
    accent: 'from-violet-400 to-indigo-500',
  },
  {
    day: 12,
    theme: 'Futuro',
    title: 'Kiss Me',
    artist: 'Sixpence None the Richer',
    file: 'kiss-me.mp3',
    accent: 'from-amber-400 to-yellow-500',
  },
]

export function getTrackForPage(pageIndex) {
  return PAGE_PLAYLIST[pageIndex] ?? PAGE_PLAYLIST[0]
}

export function getTrackSrc(file) {
  return `/music/${file}`
}
