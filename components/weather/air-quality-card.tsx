import { Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AirQuality } from './types'

interface AirQualityCardProps {
  data: AirQuality | null
  isLoading?: boolean
}

const AQI_COLORS = [
  {
    max: 50,
    tailwind: 'text-emerald-600 dark:text-emerald-400',
    hex: '#22c55e',
  },
  {
    max: 100,
    tailwind: 'text-yellow-600 dark:text-yellow-400',
    hex: '#facc15',
  },
  {
    max: 150,
    tailwind: 'text-orange-600 dark:text-orange-400',
    hex: '#f97316',
  },
  { max: 200, tailwind: 'text-red-600 dark:text-red-400', hex: '#ef4444' },
  {
    max: 300,
    tailwind: 'text-purple-600 dark:text-purple-400',
    hex: '#a855f7',
  },
  {
    max: Infinity,
    tailwind: 'text-rose-700 dark:text-rose-600',
    hex: '#881337',
  },
] as const

function getAqiEntry(aqi: number) {
  return AQI_COLORS.find((c) => aqi <= c.max)!
}

function aqiPercent(aqi: number): number {
  return Math.min((aqi / 300) * 100, 100)
}

export function AirQualityCard({
  data: airQuality,
  isLoading,
}: AirQualityCardProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-6 animate-pulse space-y-4">
        <div className="w-28 h-4 rounded bg-white/10" />
        <div className="h-20 rounded-2xl bg-white/10" />
      </div>
    )
  }

  if (!airQuality) return null

  const entry = getAqiEntry(airQuality.aqi)

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-5">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        Air Quality
      </h2>

      <div className="weather-tile rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Air Quality Index
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn('text-2xl font-bold', entry.tailwind)}>
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
            style={{
              background:
                'linear-gradient(to right, #22c55e, #facc15, #f97316, #ef4444, #a855f7, #881337)',
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 z-10"
            style={{ left: `${aqiPercent(airQuality.aqi)}%` }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 shadow-md border-black/75 dark:border-white/75"
              style={{ backgroundColor: entry.hex }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="md:flex items-center justify-between gap-y-1">
            <span className={cn('text-xs font-medium', entry.tailwind)}>
              {airQuality.level}
            </span>
            <div className="flex mt-4 md:mt-0 flex-1 md:flex-none gap-3 justify-between text-xs text-muted-foreground">
              <span>
                PM2.5{' '}
                <span className="text-foreground font-medium">
                  {airQuality.pm25}
                </span>
              </span>
              <span>
                PM10{' '}
                <span className="text-foreground font-medium">
                  {airQuality.pm10}
                </span>
              </span>
              <span>
                O₃{' '}
                <span className="text-foreground font-medium">
                  {airQuality.o3}
                </span>
              </span>
              <span>
                NO₂{' '}
                <span className="text-foreground font-medium">
                  {airQuality.no2}
                </span>
              </span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground text-right">
            All values in µg/m³
          </div>
        </div>
      </div>
    </div>
  )
}
