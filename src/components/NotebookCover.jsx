export default function NotebookCover() {
  return (
    <>
      {/* Capa dura — base do caderno */}
      <div className="notebook-cover absolute inset-0 rounded-r-[1.35rem] rounded-l-xl shadow-2xl" />

      {/* Borda da capa (espessura) */}
      <div className="notebook-cover-edge pointer-events-none absolute inset-y-0 right-0 w-2 rounded-r-[1.35rem]" />

      {/* Cantos da capa */}
      <div className="pointer-events-none absolute top-2 right-2 h-8 w-8 rounded-br-2xl border-r border-b border-rose-900/10" />
      <div className="pointer-events-none absolute right-2 bottom-2 h-8 w-8 rounded-tr-2xl border-t border-r border-rose-900/10" />

      {/* Sombra interna perto da lombada */}
      <div className="pointer-events-none absolute inset-y-2 left-8 right-0 rounded-r-2xl shadow-[inset_14px_0_28px_-12px_rgba(120,53,15,0.22)]" />

      {/* Reflexo sutil na capa */}
      <div className="pointer-events-none absolute inset-0 rounded-r-[1.35rem] rounded-l-xl bg-gradient-to-br from-white/25 via-transparent to-rose-900/5" />
    </>
  )
}
