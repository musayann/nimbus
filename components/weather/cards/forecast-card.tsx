'use client'

import { WeatherIcon } from '../shared/weather-icon'
import type { ForecastDay } from '@/types/weather'
import { Droplets, Wind } from 'lucide-react'

interface ForecastCardProps {
  forecast: ForecastDay[]
  isLoading?: boolean
}

export function ForecastCard({ forecast, isLoading }: ForecastCardProps) {
  if (isLoading) {
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

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
        5-Day Forecast
      </h2>
      {/* Desktop: horizontal list */}
      <div className="hidden sm:grid grid-cols-5 gap-2">
        {forecast.map((day, i) => (
          <ForecastDayTile key={i} day={day} />
        ))}
      </div>
      {/* Mobile: vertical list */}
      <div className="sm:hidden flex flex-col gap-3">
        {forecast.map((day, i) => (
          <ForecastDayRow key={i} day={day} />
        ))}
      </div>
    </div>
  )
}

function ForecastDayTile({ day }: { day: ForecastDay }) {
  return (
    <div className="flex flex-col items-center gap-3 weather-tile rounded-2xl px-2 py-4 transition-colors">
      <span className="text-xs font-semibold text-muted-foreground uppercase">
        {day.dayName}
      </span>
      <WeatherIcon condition={day.condition} size={40} />
      <div className="text-center">
        <p className="text-sm font-bold text-foreground">{day.high}°</p>
        <p className="text-xs text-muted-foreground">{day.low}°</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-primary">
        <Droplets className="w-3 h-3" />
        <span>{day.chanceOfRain}%</span>
      </div>
    </div>
  )
}

function ForecastDayRow({ day }: { day: ForecastDay }) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-2xl px-4 py-3 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3 w-28">
        <WeatherIcon condition={day.condition} className="w-5 h-5" />
        <div>
          <p className="text-sm font-semibold text-foreground">{day.dayName}</p>
          <p className="text-xs text-muted-foreground">{day.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-xs text-primary">
          <Droplets className="w-3 h-3" />
          <span>{day.chanceOfRain}%</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wind className="w-3 h-3" />
          <span>{day.windSpeed}</span>
        </div>
        <div className="text-right w-15">
          <span className="text-sm font-bold text-foreground">{day.high}°</span>
          <span className="text-sm text-muted-foreground"> / {day.low}°</span>
        </div>
      </div>
    </div>
  )
}
