'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { SearchBar } from './search-bar'
import { CurrentWeatherCard } from './current-weather-card'
import { ForecastCard } from './forecast-card'
import { HourlyForecast } from './hourly-forecast'
import { WeatherDetailsCard } from './weather-details-card'
import { AirQualityCard } from './air-quality-card'
import { toast } from 'sonner'
import { fetchWeather } from '@/app/actions/weather'
import { reverseGeocode } from '@/app/actions/location'
import type { CurrentWeather, ForecastDay, HourlyItem } from './types'

const KIGALI = { city: 'Kigali', country: 'Rwanda', lat: -1.9525, lon: 30.115 }

export function WeatherApp() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [hourly, setHourly] = useState<HourlyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const initializedRef = useRef(false)
  const { resolvedTheme, setTheme } = useTheme()

  const loadCity = useCallback(async (city: string, country: string, lat: number, lon: number, region?: string) => {
    setIsLoading(true)
    setError(null)
    const result = await fetchWeather(lat, lon)
    if (result) {
      setCurrent({
        ...result.current,
        city,
        region,
        country,
        coordinates: { lat, lon },
      })
      setForecast(result.forecast)
      setHourly(result.hourly)
    } else {
      setError('Could not load weather data. Please try again.')
      toast.error('Failed to load weather data')
    }
    setIsLoading(false)
  }, [])

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const geo = await reverseGeocode(latitude, longitude)

        const city = geo?.name ?? KIGALI.city
        const country = geo?.country ?? KIGALI.country
        const lat = geo?.lat ?? KIGALI.lat
        const lon = geo?.lon ?? KIGALI.lon

        await loadCity(city, country, lat, lon)
        setIsLocating(false)
      },
      (err) => {
        setIsLocating(false)
        const message = err.code === err.PERMISSION_DENIED
          ? 'Location access denied. Please enable location permissions.'
          : 'Could not determine your location. Please try again.'
        toast.error(message)
      },
      { timeout: 8000 }
    )
  }, [loadCity])

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      loadCity(KIGALI.city, KIGALI.country, KIGALI.lat, KIGALI.lon)
    }
  }, [loadCity])

  return (
    <div className="min-h-screen sky-gradient flex flex-col">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, oklch(0.65 0.18 215), transparent 70%)',
            top: '-15%',
            right: '-15%',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.15 190), transparent 70%)',
            bottom: '10%',
            left: '-10%',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4 md:px-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Igicu</h1>
              <p className="text-xs text-muted-foreground">Live weather for Rwanda</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="glass rounded-xl p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div className="glass rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-medium">
                Metric · °C
              </div>
            </div>
          </div>
          <SearchBar
            onSearch={loadCity}
            onUseLocation={handleUseLocation}
            isLocating={isLocating}
            currentCity={current?.city ?? KIGALI.city}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-0 flex-1 px-4 pb-8 md:px-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {error && !current && (
            <div className="glass rounded-3xl p-8 text-center flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={() => loadCity(KIGALI.city, KIGALI.country, KIGALI.lat, KIGALI.lon)}
                className="text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          {current && (
            <>
              <CurrentWeatherCard weather={current} isLoading={isLoading} onSync={() => loadCity(current.city, current.country, current.coordinates.lat, current.coordinates.lon, current.region)} />
              <HourlyForecast data={hourly} isLoading={isLoading} />
              <AirQualityCard coordinates={current.coordinates} />
              <WeatherDetailsCard weather={current} isLoading={isLoading} />
              <ForecastCard forecast={forecast} isLoading={isLoading} />
              <p className="text-center text-xs text-muted-foreground pb-4">
                Displaying metric measurements · km/h · °C · hPa
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
