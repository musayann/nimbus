'use client'

import { useWeather } from '@/hooks/use-weather'
import { WeatherHeader } from './weather-header'
import { WeatherMain } from './weather-main'
import { WeatherFooter } from './weather-footer'

export function WeatherLayout() {
  const {
    current,
    forecast,
    hourly,
    airQuality,
    isLoading,
    error,
    isLocating,
    loadCity,
    loadDefault,
    handleUseLocation,
    sync,
  } = useWeather()

  return (
    <div className="flex flex-col">
      <WeatherHeader
        onSearch={loadCity}
        onUseLocation={handleUseLocation}
        isLocating={isLocating}
      />
      <WeatherMain
        current={current}
        forecast={forecast}
        hourly={hourly}
        airQuality={airQuality}
        isLoading={isLoading}
        error={error}
        onRetry={loadDefault}
        onSync={sync}
      />
      <WeatherFooter />
    </div>
  )
}
