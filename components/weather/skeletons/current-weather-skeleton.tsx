export function CurrentWeatherSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-pulse">
      <div className="flex flex-col gap-6">
        {/* Location row */}
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-white/10 shrink-0 mt-1" />
          <div className="flex flex-col gap-1">
            <div className="w-28 h-5 rounded bg-white/10" />
            <div className="w-20 h-3.5 rounded bg-white/10" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-white/10" />
            <div className="w-12 h-3 rounded bg-white/10" />
          </div>
        </div>
        {/* Temp + icon row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="w-44 h-[72px] md:h-24 rounded-xl bg-white/10" />
            <div className="w-32 h-[22.5px] rounded bg-white/10 mt-2" />
            <div className="w-40 h-4 rounded bg-white/10 mt-3" />
          </div>
          <div className="w-24 h-24 rounded-full bg-white/10 shrink-0" />
        </div>
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/10 h-[58px]" />
          ))}
        </div>
        {/* Sun pills row */}
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/10 h-[52px] flex-1 min-w-25"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
