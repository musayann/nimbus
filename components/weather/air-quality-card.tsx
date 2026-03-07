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

function getAqiHex(aqi: number): string {
  if (aqi <= 50) return '#22c55e'
  if (aqi <= 100) return '#facc15'
  if (aqi <= 150) return '#f97316'
  if (aqi <= 200) return '#ef4444'
  if (aqi <= 300) return '#a855f7'
  return '#881337'
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

        <div
          className="relative h-2 rounded-full my-1"
          role="progressbar"
          aria-valuenow={airQuality.aqi}
          aria-valuemin={0}
          aria-valuemax={300}
          aria-label={`Air quality index: ${airQuality.aqi}`}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(to right, #22c55e, #facc15, #f97316, #ef4444, #a855f7, #881337)' }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 z-10"
            style={{ left: `${aqiPercent(airQuality.aqi)}%` }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 shadow-md border-black/75 dark:border-white/75"
              style={{ backgroundColor: getAqiHex(airQuality.aqi)}}
            />
          </div>
        </div>

        <div className="md:flex items-center justify-between gap-y-1">
          <span className={cn('text-xs font-medium', getAqiColor(airQuality.aqi))}>
            {airQuality.level}
          </span>
          <div className="flex mt-4 md:mt-0 flex-1 md:flex-none gap-3 justify-between text-xs text-muted-foreground">
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
