export function WeatherDetailsSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 animate-pulse flex flex-col gap-5">
      <div className="w-40 h-3.5 rounded bg-white/10" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="weather-tile rounded-2xl px-4 py-3.5 flex flex-col gap-2"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-white/10" />
              <div className="w-16 h-3 rounded bg-white/10" />
            </div>
            <div className="w-14 h-5 rounded bg-white/10" />
            <div className="w-20 h-3 rounded bg-white/10" />
            {i === 2 && (
              <div className="h-1.5 rounded-full bg-white/10 mt-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
