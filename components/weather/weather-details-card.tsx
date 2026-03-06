'use client'

import type { CurrentWeather } from './types'
import { Droplets, Thermometer, CloudRain, Wind, Gauge, Eye, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeatherDetailsCardProps {
  weather: CurrentWeather
  isLoading?: boolean
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return 'text-emerald-400'
  if (aqi <= 100) return 'text-yellow-400'
  if (aqi <= 150) return 'text-orange-400'
  if (aqi <= 200) return 'text-red-400'
  if (aqi <= 300) return 'text-purple-400'
  return 'text-rose-600'
}

function getAqiBarColor(aqi: number): string {
  if (aqi <= 50) return 'bg-emerald-400'
  if (aqi <= 100) return 'bg-yellow-400'
  if (aqi <= 150) return 'bg-orange-400'
  if (aqi <= 200) return 'bg-red-400'
  if (aqi <= 300) return 'bg-purple-400'
  return 'bg-rose-600'
}

function aqiPercent(aqi: number): number {
  return Math.min((aqi / 300) * 100, 100)
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

  const { airQuality, precipitation, dewPoint, humidity, pressure, visibility } = weather

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        Atmospheric Details
      </h2>

      {/* Air Quality – full-width feature block */}
      <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Air Quality</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn('text-2xl font-bold', getAqiColor(airQuality.aqi))}>
              {airQuality.aqi}
            </span>
            <span className="text-xs text-muted-foreground">AQI</span>
          </div>
        </div>

        {/* AQI bar */}
        <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
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
