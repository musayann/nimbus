'use client'

interface HourlyItem {
  hour: string
  temp: number
  icon: string
}

const mockHourly: HourlyItem[] = [
  { hour: 'Now', temp: 22, icon: '⛅' },
  { hour: '13:00', temp: 23, icon: '⛅' },
  { hour: '14:00', temp: 24, icon: '☀️' },
  { hour: '15:00', temp: 25, icon: '☀️' },
  { hour: '16:00', temp: 24, icon: '🌤' },
  { hour: '17:00', temp: 22, icon: '🌤' },
  { hour: '18:00', temp: 20, icon: '🌥' },
  { hour: '19:00', temp: 18, icon: '🌧' },
  { hour: '20:00', temp: 17, icon: '🌧' },
  { hour: '21:00', temp: 16, icon: '🌧' },
  { hour: '22:00', temp: 16, icon: '🌙' },
  { hour: '23:00', temp: 15, icon: '🌙' },
]

export function HourlyForecast() {
  const maxTemp = Math.max(...mockHourly.map((h) => h.temp))
  const minTemp = Math.min(...mockHourly.map((h) => h.temp))
  const range = maxTemp - minTemp || 1

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
        Hourly Forecast
      </h2>
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-3 min-w-max">
          {mockHourly.map((item, i) => {
            const barHeight = Math.round(((item.temp - minTemp) / range) * 40) + 12
            return (
              <div key={i} className="flex flex-col items-center gap-2 w-14">
                <span className="text-xs text-muted-foreground font-medium">{item.hour}</span>
                <span className="text-lg" aria-hidden>{item.icon}</span>
                <div className="flex flex-col items-center justify-end h-14">
                  <div
                    className="w-1 rounded-full bg-primary opacity-70"
                    style={{ height: barHeight }}
                    aria-hidden
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">{item.temp}°</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
