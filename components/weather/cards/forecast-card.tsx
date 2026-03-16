'use client'

import { WeatherIcon } from '../shared/weather-icon'
import type { ForecastDay } from '@/types/weather'
import { Droplets } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ForecastSkeleton } from '../skeletons/forecast-skeleton'

interface ForecastCardProps {
  forecast: ForecastDay[]
  isLoading?: boolean
}

export function ForecastCard({ forecast, isLoading }: ForecastCardProps) {
  if (isLoading && forecast.length === 0) {
    return <ForecastSkeleton />
  }

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
        10-Day Forecast
      </h2>
      <ScrollArea className="-mx-2 px-2">
        <div className="flex gap-3 min-w-max pb-4">
          {forecast.map((day, i) => (
            <ForecastDayTile key={i} day={day} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

function ForecastDayTile({ day }: { day: ForecastDay }) {
  return (
    <div className="flex flex-col items-center min-w-20 gap-3 weather-tile rounded-2xl px-2 py-4 transition-colors">
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
