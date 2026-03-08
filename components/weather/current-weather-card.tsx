'use client'

import { WeatherIcon } from './weather-icon'
import type { CurrentWeather } from './types'
import { MapPin, Sunrise, Sunset, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SyncButton } from './sync-button'

interface CurrentWeatherCardProps {
  weather: CurrentWeather
  isLoading?: boolean
  onSync?: () => void
}

export function CurrentWeatherCard({ weather, isLoading, onSync }: CurrentWeatherCardProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center gap-4 min-h-70 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-white/10" />
        <div className="w-32 h-12 rounded-xl bg-white/10" />
        <div className="w-48 h-4 rounded bg-white/10" />
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
      {/* Subtle glow behind icon */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, oklch(0.65 0.18 215), transparent 70%)', transform: 'translate(30%, -30%)' }}
        aria-hidden
      />

      <div className="flex flex-col gap-6">
        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary shrink-0 pt-1" />
          <div className='flex flex-col'>
            <span className="font-semibold text-foreground text-lg leading-tight">{weather.city}</span>
            {weather.region && <span className="text-muted-foreground text-sm">{weather.region}</span>}
          </div>
          <SyncButton timestamp={weather.lastUpdated} isLoading={isLoading} onSync={onSync} />
        </div>

        {/* Main temp + icon */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-start">
              <span className="text-7xl md:text-8xl font-bold text-foreground leading-none tracking-tighter">
                {weather.temperature}
              </span>
              <span className="text-3xl font-light text-muted-foreground mt-2 pl-1">°C</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{weather.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-muted-foreground">
                H <span className="text-foreground font-medium">{weather.high}°</span>
              </span>
              <span className="text-xs text-muted-foreground">
                L <span className="text-foreground font-medium">{weather.low}°</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Feels <span className="text-foreground font-medium">{weather.feelsLike}°</span>
              </span>
            </div>
          </div>
          <WeatherIcon condition={weather.condition} size={96} animated className="flex-shrink-0 drop-shadow-lg" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill label="Humidity" value={`${weather.humidity}%`} />
          <StatPill label="Wind" value={`${weather.windSpeed} km/h ${weather.windDirection}`} />
          <StatPill label="Visibility" value={`${weather.visibility} km`} />
          <StatPill label="UV Index" value={`${weather.uvIndex}`} highlight={weather.uvIndex >= 7} />
        </div>

        {/* Sunrise/Sunset + Pressure */}
        <div className="flex flex-wrap gap-3">
          <SunPill label="Sunrise" value={weather.sunrise} icon={<Sunrise className="w-4 h-4" />} />
          <SunPill label="Sunset" value={weather.sunset} icon={<Sunset className="w-4 h-4" />} />
          <SunPill label="Pressure" value={`${weather.pressure} hPa`} icon={<Gauge className="w-4 h-4" />} />
        </div>      </div>
    </div>
  )
}

function StatPill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="weather-tile rounded-2xl px-3 py-2.5 flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-semibold', highlight ? 'text-accent' : 'text-foreground')}>
        {value}
      </span>
    </div>
  )
}

function SunPill({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 weather-tile rounded-2xl px-3 py-2 flex-1 min-w-25">
      <span className="text-muted-foreground flex-shrink-0" aria-hidden>{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
