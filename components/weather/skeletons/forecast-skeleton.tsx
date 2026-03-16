export function ForecastSkeleton() {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="h-5 w-32 rounded bg-white/10 mb-5 animate-pulse" />
      {/* Desktop: horizontal tiles */}
      <div className="hidden sm:grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 weather-tile rounded-2xl px-2 py-4 animate-pulse"
          >
            <div className="w-8 h-3 rounded bg-white/10" />
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-3.5 rounded bg-white/10" />
              <div className="w-5 h-3 rounded bg-white/10" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-white/10" />
              <div className="w-5 h-3 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
      {/* Mobile: vertical rows */}
      <div className="sm:hidden flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white/5 rounded-2xl px-4 py-3 animate-pulse"
          >
            <div className="flex items-center gap-3 w-28">
              <div className="w-5 h-5 rounded bg-white/10" />
              <div className="flex flex-col gap-1">
                <div className="w-10 h-3.5 rounded bg-white/10" />
                <div className="w-16 h-3 rounded bg-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-white/10" />
                <div className="w-5 h-3 rounded bg-white/10" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-white/10" />
                <div className="w-8 h-3 rounded bg-white/10" />
              </div>
              <div className="w-15 h-3.5 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
