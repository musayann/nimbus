'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { SearchBar } from './search-bar'
import { CurrentWeatherCard } from './current-weather-card'
import { ForecastCard } from './forecast-card'
import { HourlyForecast } from './hourly-forecast'
import { WeatherDetailsCard } from './weather-details-card'
import { AirQualityCard } from './air-quality-card'
import { cityDatabase } from './mock-data'
import { fetchWeather } from '@/app/actions/weather'
import type { CurrentWeather, ForecastDay, HourlyItem } from './types'

const DEFAULT_CITY = cityDatabase[0]

function haversineDistance(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const sinLat = Math.sin(dLat / 2)
  const sinLon = Math.sin(dLon / 2)
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    sinLon *
    sinLon
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export function WeatherApp() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [hourly, setHourly] = useState<HourlyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLocating, setIsLocating] = useState(false)
  const initializedRef = useRef(false)

  const loadCity = useCallback(async (city: string, country: string) => {
    setIsLoading(true)
    const entry = cityDatabase.find((c) => c.city === city)
    const coords = entry?.coordinates ?? DEFAULT_CITY.coordinates

    const result = await fetchWeather(coords.lat, coords.lon)
    if (result) {
      setCurrent({
        ...result.current,
        city,
        country,
        coordinates: coords,
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
        const result = await fetchWeather(latitude, longitude)

        // Find nearest city from database
        let nearestCity = cityDatabase[0]
        let minDist = Infinity
        for (const entry of cityDatabase) {
          const dist = haversineDistance(
            { lat: latitude, lon: longitude },
            entry.coordinates,
          )
          if (dist < minDist) {
            minDist = dist
            nearestCity = entry
          }
        }

        if (result) {
          setCurrent({
            ...result.current,
            city: nearestCity.city,
            country: nearestCity.country,
            coordinates: { lat: latitude, lon: longitude },
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
      loadCity(DEFAULT_CITY.city, DEFAULT_CITY.country)
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
              <p className="text-xs text-muted-foreground">Weather, beautifully simple</p>
            </div>
            <div className="glass rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-medium">
              Metric · °C
            </div>
          </div>
          <SearchBar
            onSearch={loadCity}
            onUseLocation={handleUseLocation}
            isLocating={isLocating}
            currentCity={current?.city ?? DEFAULT_CITY.city}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-0 flex-1 px-4 pb-8 md:px-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {current && (
            <>
              <CurrentWeatherCard weather={current} isLoading={isLoading} onSync={() => loadCity(current.city, current.country)} />
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
