'use client'

import { useState, useCallback } from 'react'
import { SearchBar } from './search-bar'
import { CurrentWeatherCard } from './current-weather-card'
import { ForecastCard } from './forecast-card'
import { HourlyForecast } from './hourly-forecast'
import { WeatherDetailsCard } from './weather-details-card'
import { AirQualityCard } from './air-quality-card'
import { mockCurrentWeather, mockForecast, cityDatabase } from './mock-data'
import type { CurrentWeather, ForecastDay } from './types'

const cityWeatherOverrides: Record<string, Partial<CurrentWeather>> = {
  Huye: { temperature: 20, condition: 'cloudy', description: 'Cool and overcast', humidity: 75, dewPoint: 14, windSpeed: 10, precipitation: 0.3 },
  Musanze: { temperature: 18, condition: 'foggy', description: 'Misty mountain morning', humidity: 85, dewPoint: 15, windSpeed: 8, precipitation: 0 },
  Rubavu: { temperature: 24, condition: 'partly-cloudy', description: 'Lakeside breeze', humidity: 70, dewPoint: 17, windSpeed: 14, precipitation: 0 },
  Muhanga: { temperature: 21, condition: 'partly-cloudy', description: 'Mild and pleasant', humidity: 68, dewPoint: 14, windSpeed: 11, precipitation: 0 },
  Rusizi: { temperature: 26, condition: 'sunny', description: 'Warm and clear', humidity: 65, dewPoint: 18, windSpeed: 9, precipitation: 0 },
  Nyagatare: { temperature: 27, condition: 'sunny', description: 'Hot savanna sun', humidity: 50, dewPoint: 15, windSpeed: 12, precipitation: 0 },
  Karongi: { temperature: 23, condition: 'partly-cloudy', description: 'Lake Kivu breeze', humidity: 72, dewPoint: 16, windSpeed: 10, precipitation: 0 },
  Rwamagana: { temperature: 24, condition: 'sunny', description: 'Clear eastern skies', humidity: 60, dewPoint: 15, windSpeed: 13, precipitation: 0 },
  Nyanza: { temperature: 21, condition: 'cloudy', description: 'Overcast highlands', humidity: 74, dewPoint: 15, windSpeed: 9, precipitation: 0.1 },
}

export function WeatherApp() {
  const [current, setCurrent] = useState<CurrentWeather>(mockCurrentWeather)
  const [forecast, setForecast] = useState<ForecastDay[]>(mockForecast)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const loadCity = useCallback((city: string, country: string) => {
    setIsLoading(true)
    const entry = cityDatabase.find((c) => c.city === city)
    const coords = entry?.coordinates ?? mockCurrentWeather.coordinates
    const overrides = cityWeatherOverrides[city] ?? {}

    setCurrent({
      ...mockCurrentWeather,
      city,
      country,
      coordinates: coords,
      ...overrides,
      lastUpdated: 'Just now',
    })
    setForecast(mockForecast)
    setIsLoading(false)
  }, [])

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      () => {
        setCurrent({ ...mockCurrentWeather, lastUpdated: 'Just now' })
        setForecast(mockForecast)
        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
      },
      { timeout: 8000 }
    )
  }, [])

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
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Nimbus</h1>
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
            currentCity={current.city}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-4 pb-8 md:px-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <CurrentWeatherCard weather={current} isLoading={isLoading} />
          <HourlyForecast />
          <AirQualityCard coordinates={current.coordinates} />
          <WeatherDetailsCard weather={current} isLoading={isLoading} />
          <ForecastCard forecast={forecast} isLoading={isLoading} />

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground pb-4">
            Displaying metric measurements · km/h · °C · hPa
          </p>
        </div>
      </main>
    </div>
  )
}
