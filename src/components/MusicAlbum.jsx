import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ChevronDown,
  ChevronUp,
  Disc3,
  Music2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  ALBUM_ARTIST,
  ALBUM_TITLE,
  getTrackForPage,
  getTrackSrc,
  PAGE_PLAYLIST,
} from '../data/playlist'

const TARGET_VOLUME = 0.4

function waitForAudio(audio, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      resolve()
      return
    }

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('timeout'))
    }, timeoutMs)

    const onReady = () => {
      cleanup()
      resolve()
    }

    const onError = () => {
      cleanup()
      reject(new Error('error'))
    }

    const cleanup = () => {
      clearTimeout(timer)
      audio.removeEventListener('canplay', onReady)
      audio.removeEventListener('canplaythrough', onReady)
      audio.removeEventListener('error', onError)
    }

    audio.addEventListener('canplay', onReady)
    audio.addEventListener('canplaythrough', onReady)
    audio.addEventListener('error', onError)
  })
}

export default function MusicAlbum({ currentPageIndex }) {
  const audioRef = useRef(null)
  const userStartedRef = useRef(false)
  const mountedRef = useRef(false)
  const mutedRef = useRef(false)
  const loadingRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [error, setError] = useState('')

  const currentTrack = getTrackForPage(currentPageIndex)

  const fadeVolume = useCallback((audio, to, duration = 0.4) => {
    return new Promise((resolve) => {
      gsap.killTweensOf(audio)
      gsap.to(audio, {
        volume: to,
        duration,
        ease: 'power2.inOut',
        onComplete: resolve,
      })
    })
  }, [])

  const loadTrack = useCallback(async (pageIndex, shouldPlay) => {
    const audio = audioRef.current
    if (!audio || loadingRef.current) return false

    const track = getTrackForPage(pageIndex)
    const nextSrc = getTrackSrc(track.file)
    const targetVol = mutedRef.current ? 0 : TARGET_VOLUME

    loadingRef.current = true
    setSwitching(true)
    setReady(false)
    setError('')

    try {
      if (!audio.paused && audio.volume > 0.01) {
        await fadeVolume(audio, 0, 0.2)
      }

      audio.pause()
      audio.src = nextSrc
      audio.load()

      await waitForAudio(audio)

      setReady(true)

      if (shouldPlay) {
        audio.volume = 0
        await audio.play()
        setShowHint(false)
        await fadeVolume(audio, targetVol, 0.4)
      } else {
        audio.volume = 0
      }

      return true
    } catch {
      setReady(false)
      setError(`Não achei: ${track.file}`)
      return false
    } finally {
      loadingRef.current = false
      setSwitching(false)
    }
  }, [fadeVolume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      gsap.killTweensOf(audio)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    const shouldPlay =
      mountedRef.current &&
      userStartedRef.current &&
      audio &&
      !audio.paused

    loadTrack(currentPageIndex, shouldPlay)
    mountedRef.current = true
  }, [currentPageIndex, loadTrack])

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    userStartedRef.current = true
    setShowHint(false)

    if (!ready) {
      const loaded = await loadTrack(currentPageIndex, true)
      if (!loaded) return
      return
    }

    try {
      audio.volume = 0
      await audio.play()
      await fadeVolume(audio, mutedRef.current ? 0 : TARGET_VOLUME, 0.4)
    } catch {
      setError('Toque em play para iniciar')
    }
  }, [currentPageIndex, fadeVolume, loadTrack, ready])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || switching) return

    userStartedRef.current = true

    if (playing) {
      await fadeVolume(audio, 0, 0.2)
      audio.pause()
      return
    }

    await startPlayback()
  }

  const toggleMute = async () => {
    const audio = audioRef.current
    if (!audio) return

    const nextMuted = !muted
    setMuted(nextMuted)
    mutedRef.current = nextMuted

    if (playing) {
      await fadeVolume(audio, nextMuted ? 0 : TARGET_VOLUME, 0.25)
    }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="auto" playsInline />

      {showHint && !playing && (
        <button
          type="button"
          onClick={startPlayback}
          className="font-sans fixed bottom-28 left-1/2 z-40 -translate-x-1/2 animate-pulse rounded-full border border-rose-200/60 bg-white/50 px-5 py-2 text-xs font-medium text-rose-700 shadow-lg backdrop-blur-md transition hover:bg-white/80 sm:bottom-8 sm:left-auto sm:right-[22rem] sm:translate-x-0"
        >
          ♪ Toque para ouvir a trilha
        </button>
      )}

      <div className="fixed right-3 bottom-3 z-50 w-[min(100vw-1.5rem,20rem)] sm:right-4 sm:bottom-4 sm:w-80">
        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/45 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 p-3">
            <div
              className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${currentTrack.accent} shadow-lg ${switching ? 'animate-pulse' : ''}`}
            >
              <Disc3
                className={`text-white/90 ${playing ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                size={28}
                strokeWidth={1.5}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-sans text-[10px] font-semibold tracking-wider text-rose-400 uppercase">
                {ALBUM_TITLE}
              </p>
              <p className="font-sans truncate text-sm font-semibold text-rose-900">
                {currentTrack.title}
              </p>
              <p className="font-sans truncate text-xs text-rose-500/80">
                {currentTrack.artist} · {currentTrack.theme}
              </p>
              {error && (
                <p className="font-sans mt-0.5 truncate text-[10px] text-rose-500">
                  {error}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={togglePlay}
                disabled={switching}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md transition hover:from-rose-600 hover:to-pink-600 disabled:opacity-40"
                aria-label={playing ? 'Pausar' : 'Tocar'}
              >
                {playing ? (
                  <Pause size={17} />
                ) : (
                  <Play size={17} className="ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-600/80 transition hover:bg-rose-100/50"
                aria-label={muted ? 'Ativar som' : 'Silenciar'}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="font-sans flex w-full items-center justify-between border-t border-white/40 bg-white/20 px-3 py-2 text-[11px] font-medium text-rose-600/80 transition hover:bg-white/30"
          >
            <span className="flex items-center gap-1.5">
              <Music2 size={13} />
              Faixas do caderno ({PAGE_PLAYLIST.length})
            </span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <ul className="max-h-48 overflow-y-auto border-t border-white/30 bg-white/25">
              {PAGE_PLAYLIST.map((track, index) => {
                const isActive = index === currentPageIndex
                return (
                  <li
                    key={track.day}
                    className={`flex items-center gap-2.5 px-3 py-2.5 transition ${
                      isActive ? 'bg-rose-100/50' : 'hover:bg-white/30'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white ${track.accent}`}
                    >
                      {track.day}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-sans truncate text-xs font-semibold ${isActive ? 'text-rose-800' : 'text-rose-900/70'}`}
                      >
                        {track.title}
                      </p>
                      <p className="font-sans truncate text-[10px] text-rose-500/70">
                        {track.theme} · {track.artist}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <p className="border-t border-white/30 px-3 py-1.5 text-center text-[9px] text-rose-400/60">
            {ALBUM_ARTIST} · muda ao virar a página
          </p>
        </div>
      </div>
    </>
  )
}
