import { useState } from 'react'

export default function BackgroundImage({ src }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {!failed ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover object-center"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="app-gradient-fallback h-full w-full" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/25 via-rose-900/15 to-pink-950/30" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
    </div>
  )
}
