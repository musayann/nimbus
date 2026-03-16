export function HourlyForecastSkeleton() {
  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
        Hourly Forecast
      </h2>
      <div className="overflow-x-hidden pb-2 -mx-2 px-2">
        <div className="flex gap-3 min-w-max">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 w-14 animate-pulse"
            >
              <div className="h-3 w-10 bg-white/10 rounded" />
              <div className="h-5 w-5 bg-white/10 rounded-full" />
              <div className="h-14 w-1 bg-white/10 rounded-full" />
              <div className="h-3 w-8 bg-white/10 rounded" />
              {i % 3 === 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-white/10 rounded" />
                  <div className="w-5 h-2.5 bg-white/10 rounded" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
