import type {
  CurrentWeather,
  ForecastDay,
  HourlyItem,
} from '@/types/weather'
import { fetchWeather as fetchOpenMeteo } from '@/lib/providers/open-meteo'
import { fetchWeather as fetchTomorrowIo } from '@/lib/providers/tomorrow-io'

export type WeatherProviderResult = {
  current: Omit<CurrentWeather, 'city' | 'country' | 'coordinates'>
  forecast: ForecastDay[]
  hourly: HourlyItem[]
}

export type WeatherProvider = {
  fetchWeather(lat: number, lon: number): Promise<WeatherProviderResult>
}

export function getWeatherProvider(): WeatherProvider {
  const provider = process.env.WEATHER_PROVIDER ?? 'open-meteo'

  switch (provider) {
    case 'open-meteo':
      return { fetchWeather: fetchOpenMeteo }
    case 'tomorrow-io':
      return { fetchWeather: fetchTomorrowIo }
    default:
      throw new Error(`Unknown weather provider: ${provider}`)
  }
}
