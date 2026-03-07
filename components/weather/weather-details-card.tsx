import type { CurrentWeather } from './types'
import { Droplets, Thermometer, CloudRain, Gauge } from 'lucide-react'

interface WeatherDetailsCardProps {
  weather: CurrentWeather
  isLoading?: boolean
}

export function WeatherDetailsCard({ weather, isLoading }: WeatherDetailsCardProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-6 animate-pulse space-y-4">
        <div className="w-40 h-5 rounded bg-white/10" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    )
  }

  const { precipitation, dewPoint, humidity, pressure } = weather

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        Atmospheric Details
      </h2>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-3">
        <DetailTile
          icon={<CloudRain className="w-4 h-4" />}
          label="Precipitation"
          value={`${precipitation.toFixed(1)} mm`}
          sub="last hour"
        />
        <DetailTile
          icon={<Thermometer className="w-4 h-4" />}
          label="Dew Point"
          value={`${dewPoint}°C`}
          sub={dewPoint >= 20 ? 'Muggy' : dewPoint >= 13 ? 'Comfortable' : 'Dry'}
        />
        <DetailTile
          icon={<Droplets className="w-4 h-4" />}
          label="Humidity"
          value={`${humidity}%`}
          sub="relative"
          bar
          barValue={humidity}
          barMax={100}
        />
        <DetailTile
          icon={<Gauge className="w-4 h-4" />}
          label="Pressure"
          value={`${pressure} hPa`}
          sub={pressure >= 1013 ? 'High' : 'Low'}
        />
      </div>
    </div>
  )
}

interface DetailTileProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  bar?: boolean
  barValue?: number
  barMax?: number
}

function DetailTile({ icon, label, value, sub, bar, barValue = 0, barMax = 100 }: DetailTileProps) {
  return (
    <div className="bg-white/5 rounded-2xl px-4 py-3.5 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xl font-bold text-foreground leading-none">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      {bar && (
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-0.5">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${(barValue / barMax) * 100}%` }}
            role="progressbar"
            aria-valuenow={barValue}
            aria-valuemin={0}
            aria-valuemax={barMax}
          />
        </div>
      )}
    </div>
  )
}
