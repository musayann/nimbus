'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { SearchBar } from './search-bar'
import { CurrentWeatherCard } from './current-weather-card'
import { ForecastCard } from './forecast-card'
import { HourlyForecast } from './hourly-forecast'
import { WeatherDetailsCard } from './weather-details-card'
import { AirQualityCard } from './air-quality-card'
import { fetchWeather } from '@/app/actions/weather'
import { reverseGeocode } from '@/app/actions/location'
import type { CurrentWeather, ForecastDay, HourlyItem } from './types'

const KIGALI = { city: 'Kigali', country: 'Rwanda', lat: -1.9525, lon: 30.115 }

export function WeatherApp() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [hourly, setHourly] = useState<HourlyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLocating, setIsLocating] = useState(false)
  const initializedRef = useRef(false)

  const loadCity = useCallback(async (city: string, country: string, lat: number, lon: number, region?: string) => {
    setIsLoading(true)
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
    }
    setIsLoading(false)
  }, [])

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const geo = await reverseGeocode(latitude, longitude)

        // Use reverse-geocoded location if in Rwanda, otherwise default to Kigali
        const city = geo?.name ?? KIGALI.city
        const country = geo?.country ?? KIGALI.country
        const lat = geo?.lat ?? KIGALI.lat
        const lon = geo?.lon ?? KIGALI.lon

        const result = await fetchWeather(lat, lon)
        if (result) {
          setCurrent({
            ...result.current,
            city,
            country,
            coordinates: { lat, lon },
          })
          setForecast(result.forecast)
          setHourly(result.hourly)
        }
        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
      },
      { timeout: 8000 }
    )
  }, [])

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
            <div className="glass rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-medium">
              Metric · °C
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
          {current && (
            <>
              <CurrentWeatherCard weather={current} isLoading={isLoading} onSync={() => loadCity(current.city, current.country, current.coordinates.lat, current.coordinates.lon, current.region)} />
              <HourlyForecast data={hourly} isLoading={isLoading} />
              <AirQualityCard coordinates={current.coordinates} />
              <WeatherDetailsCard weather={current} isLoading={isLoading} />
              <ForecastCard forecast={forecast} isLoading={isLoading} />
              {/* Footer note */}
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
