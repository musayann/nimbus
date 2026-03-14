'use client'

import { Droplets } from 'lucide-react'
import type { HourlyItem } from '@/types/weather'
import { WeatherIcon } from '../shared/weather-icon'

interface HourlyForecastProps {
  data?: HourlyItem[]
  isLoading?: boolean
}

export function HourlyForecast({ data, isLoading }: HourlyForecastProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
          Hourly Forecast
        </h2>
        <div className="flex gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 w-14 animate-pulse"
            >
              <div className="h-3 w-10 bg-muted rounded" />
              <div className="h-5 w-5 bg-muted rounded-full" />
              <div className="h-14 w-1 bg-muted rounded-full" />
              <div className="h-3 w-8 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) return null

  const maxTemp = Math.max(...data.map((h) => h.temp))
  const minTemp = Math.min(...data.map((h) => h.temp))
  const range = maxTemp - minTemp || 1

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
        Hourly Forecast
      </h2>
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-3 min-w-max">
          {data.map((item, i) => {
            const barHeight =
              Math.round(((item.temp - minTemp) / range) * 40) + 12
            return (
              <div key={i} className="flex flex-col items-center gap-2 w-14">
                <span className="text-xs text-muted-foreground font-medium">
                  {item.hour}
                </span>
                <WeatherIcon condition={item.condition} size={24} />
                <div className="flex flex-col items-center justify-end h-14">
                  <div
                    className="w-1 rounded-full bg-primary opacity-70"
                    style={{ height: barHeight }}
                    aria-hidden
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.temp}°
                </span>
                {item.precipitationProbability > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-medium">
                    <Droplets className="w-3 h-3" />
                    {item.precipitationProbability}%
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
