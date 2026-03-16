export function ForecastSkeleton() {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="h-5 w-32 rounded bg-white/10 mb-5 animate-pulse" />
      <div className="flex gap-3 overflow-x-hidden pb-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center min-w-20 gap-3 weather-tile rounded-2xl px-2 py-4 animate-pulse"
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
    </div>
  )
}
