export function ForecastSkeleton() {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="h-5 w-32 rounded bg-white/10 mb-4 animate-pulse" />
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-8 h-3 rounded bg-white/10 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            <div className="w-8 h-4 rounded bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
