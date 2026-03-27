import { getWeatherProvider } from '@/lib/weather-provider'

export async function fetchWeather(lat: number, lon: number) {
  return getWeatherProvider().fetchWeather(lat, lon)
}
