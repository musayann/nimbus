export function AirQualitySkeleton() {
  return (
    <div className="glass rounded-3xl p-6 animate-pulse flex flex-col gap-5">
      <div className="w-24 h-3.5 rounded bg-white/10" />
      <div className="weather-tile rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/10" />
            <div className="w-28 h-3.5 rounded bg-white/10" />
          </div>
          <div className="w-12 h-7 rounded bg-white/10" />
        </div>
        <div className="h-2 rounded-full bg-white/10 my-1" />
        <div className="flex items-center justify-between">
          <div className="w-16 h-3 rounded bg-white/10" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-12 h-3 rounded bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
