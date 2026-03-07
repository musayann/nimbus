'use client'

import { useState, useEffect } from 'react'
import { Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AirQuality, Coordinates } from './types'
import { fetchAirQuality } from '@/app/actions/air-quality'

interface AirQualityCardProps {
  coordinates: Coordinates
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return 'text-emerald-600 dark:text-emerald-400'
  if (aqi <= 100) return 'text-yellow-600 dark:text-yellow-400'
  if (aqi <= 150) return 'text-orange-600 dark:text-orange-400'
  if (aqi <= 200) return 'text-red-600 dark:text-red-400'
  if (aqi <= 300) return 'text-purple-600 dark:text-purple-400'
  return 'text-rose-700 dark:text-rose-600'
}

function getAqiBarColor(aqi: number): string {
  if (aqi <= 50) return 'bg-emerald-600 dark:bg-emerald-400'
  if (aqi <= 100) return 'bg-yellow-600 dark:bg-yellow-400'
  if (aqi <= 150) return 'bg-orange-600 dark:bg-orange-400'
  if (aqi <= 200) return 'bg-red-600 dark:bg-red-400'
  if (aqi <= 300) return 'bg-purple-600 dark:bg-purple-400'
  return 'bg-rose-700 dark:bg-rose-600'
}

function aqiPercent(aqi: number): number {
  return Math.min((aqi / 300) * 100, 100)
}

export function AirQualityCard({ coordinates }: AirQualityCardProps) {
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null)

  useEffect(() => {
    setAirQuality(null)
    fetchAirQuality(coordinates).then(setAirQuality)
  }, [coordinates, coordinates.lat, coordinates.lon])

  if (!airQuality) return null

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        Air Quality
      </h2>

      <div className="weather-tile rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Air Quality Index</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn('text-2xl font-bold', getAqiColor(airQuality.aqi))}>
              {airQuality.aqi}
            </span>
            <span className="text-xs text-muted-foreground">AQI</span>
          </div>
        </div>

        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--weather-progress-track)' }}>
          <div
            className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-700', getAqiBarColor(airQuality.aqi))}
            style={{ width: `${aqiPercent(airQuality.aqi)}%` }}
            role="progressbar"
            aria-valuenow={airQuality.aqi}
            aria-valuemin={0}
            aria-valuemax={300}
            aria-label={`Air quality index: ${airQuality.aqi}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className={cn('text-xs font-medium', getAqiColor(airQuality.aqi))}>
            {airQuality.level}
          </span>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>PM2.5 <span className="text-foreground font-medium">{airQuality.pm25}</span></span>
            <span>PM10 <span className="text-foreground font-medium">{airQuality.pm10}</span></span>
            <span>O₃ <span className="text-foreground font-medium">{airQuality.o3}</span></span>
            <span>NO₂ <span className="text-foreground font-medium">{airQuality.no2}</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
