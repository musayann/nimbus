'use client'

import { useState, useCallback } from 'react'
import { SearchBar } from './search-bar'
import { CurrentWeatherCard } from './current-weather-card'
import { ForecastCard } from './forecast-card'
import { HourlyForecast } from './hourly-forecast'
import { WeatherDetailsCard } from './weather-details-card'
import { mockCurrentWeather, mockForecast } from './mock-data'
import type { CurrentWeather, ForecastDay } from './types'

const cityWeatherOverrides: Record<string, Partial<CurrentWeather>> = {
  Nairobi: { temperature: 24, condition: 'partly-cloudy', description: 'Warm and partly cloudy', humidity: 60, dewPoint: 14, windSpeed: 16, precipitation: 0, airQuality: { aqi: 58, level: 'Moderate', pm25: 14.1, pm10: 28.0, o3: 80.0, no2: 22.0 } },
  Lagos: { temperature: 31, condition: 'sunny', description: 'Hot and humid', humidity: 78, dewPoint: 24, windSpeed: 12, precipitation: 0, airQuality: { aqi: 95, level: 'Moderate', pm25: 22.3, pm10: 42.0, o3: 70.0, no2: 38.0 } },
  London: { temperature: 9, condition: 'rainy', description: 'Light drizzle', humidity: 85, dewPoint: 7, windSpeed: 22, precipitation: 1.4, airQuality: { aqi: 35, level: 'Good', pm25: 7.0, pm10: 14.0, o3: 55.0, no2: 18.0 } },
  Paris: { temperature: 11, condition: 'cloudy', description: 'Overcast skies', humidity: 79, dewPoint: 8, windSpeed: 17, precipitation: 0.2, airQuality: { aqi: 52, level: 'Moderate', pm25: 12.8, pm10: 26.0, o3: 72.0, no2: 30.0 } },
  'New York': { temperature: 5, condition: 'windy', description: 'Cold and breezy', humidity: 55, dewPoint: -3, windSpeed: 30, precipitation: 0, airQuality: { aqi: 45, level: 'Good', pm25: 9.5, pm10: 20.0, o3: 62.0, no2: 24.0 } },
  Tokyo: { temperature: 14, condition: 'partly-cloudy', description: 'Mild spring day', humidity: 62, dewPoint: 6, windSpeed: 10, precipitation: 0, airQuality: { aqi: 68, level: 'Moderate', pm25: 16.5, pm10: 34.0, o3: 85.0, no2: 28.0 } },
  Dubai: { temperature: 36, condition: 'sunny', description: 'Hot and clear', humidity: 35, dewPoint: 18, windSpeed: 8, precipitation: 0, airQuality: { aqi: 78, level: 'Moderate', pm25: 18.0, pm10: 55.0, o3: 90.0, no2: 15.0 } },
  Kampala: { temperature: 25, condition: 'partly-cloudy', description: 'Warm afternoon', humidity: 64, dewPoint: 16, windSpeed: 13, precipitation: 0, airQuality: { aqi: 38, level: 'Good', pm25: 8.8, pm10: 19.0, o3: 60.0, no2: 14.0 } },
  'Dar es Salaam': { temperature: 29, condition: 'sunny', description: 'Clear coastal day', humidity: 72, dewPoint: 22, windSpeed: 15, precipitation: 0, airQuality: { aqi: 44, level: 'Good', pm25: 9.2, pm10: 21.0, o3: 66.0, no2: 16.0 } },
}

export function WeatherApp() {
  const [current, setCurrent] = useState<CurrentWeather>(mockCurrentWeather)
  const [forecast, setForecast] = useState<ForecastDay[]>(mockForecast)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const loadCity = useCallback((city: string, country: string) => {
    setIsLoading(true)
    setTimeout(() => {
      const overrides = cityWeatherOverrides[city] ?? {}
      setCurrent({
        ...mockCurrentWeather,
        city,
        country,
        ...overrides,
        lastUpdated: 'Just now',
      })
      setForecast(mockForecast)
      setIsLoading(false)
    }, 800)
  }, [])

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      () => {
        // In a real app we'd reverse-geocode; mock to Kigali
        setTimeout(() => {
          setCurrent({ ...mockCurrentWeather, lastUpdated: 'Just now' })
          setForecast(mockForecast)
          setIsLocating(false)
        }, 1200)
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
