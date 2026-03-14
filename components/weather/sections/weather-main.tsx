import { CurrentWeatherCard } from '../cards/current-weather-card'
import { ForecastCard } from '../cards/forecast-card'
import { HourlyForecast } from '../cards/hourly-forecast'
import { WeatherDetailsCard } from '../cards/weather-details-card'
import { AirQualityCard } from '../cards/air-quality-card'
import type {
  AirQuality,
  CurrentWeather,
  ForecastDay,
  HourlyItem,
} from '@/types/weather'

interface WeatherMainProps {
  current: CurrentWeather | null
  forecast: ForecastDay[]
  hourly: HourlyItem[]
  airQuality: AirQuality | null
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onSync: () => void
}

export function WeatherMain({
  current,
  forecast,
  hourly,
  airQuality,
  isLoading,
  error,
  onRetry,
  onSync,
}: WeatherMainProps) {
  return (
    <main className="relative z-0 flex-1 px-4 pb-8 md:px-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {error && !current && (
          <div className="glass rounded-3xl p-8 text-center flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={onRetry}
              className="text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        {(current || isLoading) && (
          <>
            <CurrentWeatherCard
              weather={current}
              isLoading={isLoading}
              onSync={onSync}
            />
            <HourlyForecast data={hourly} isLoading={isLoading} />
            <AirQualityCard data={airQuality} isLoading={isLoading} />
            <WeatherDetailsCard weather={current} isLoading={isLoading} />
            <ForecastCard forecast={forecast} isLoading={isLoading} />
          </>
        )}
        {current && (
          <p className="text-center text-xs text-muted-foreground pb-4">
            Displaying metric measurements · km/h · °C · hPa
          </p>
        )}
      </div>
    </main>
  )
}
