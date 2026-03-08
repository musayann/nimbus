import type { CurrentWeather, ForecastDay, HourlyItem } from '@/components/weather/types'

interface CachedWeatherData {
  current: CurrentWeather
  forecast: ForecastDay[]
  hourly: HourlyItem[]
  cachedAt: number
}

const CACHE_PREFIX = 'igicu-weather-'
const LAST_KEY = 'igicu-weather-last-coords'

function cacheKey(lat: number, lon: number): string {
  return `${CACHE_PREFIX}${lat.toFixed(3)}_${lon.toFixed(3)}`
}

export function saveWeatherToCache(
  current: CurrentWeather,
  forecast: ForecastDay[],
  hourly: HourlyItem[],
): void {
  try {
    const { lat, lon } = current.coordinates
    const data: CachedWeatherData = { current, forecast, hourly, cachedAt: Date.now() }
    localStorage.setItem(cacheKey(lat, lon), JSON.stringify(data))
    localStorage.setItem(LAST_KEY, JSON.stringify({ lat, lon }))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function loadWeatherFromCache(
  lat: number,
  lon: number,
): CachedWeatherData | null {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon))
    return raw ? (JSON.parse(raw) as CachedWeatherData) : null
  } catch {
    return null
  }
}

export function getLastCachedCity(): { name: string; country: string; lat: number; lon: number; region?: string } | null {
  try {
    const cached = getLastCachedWeather()
    if (!cached) return null
    const { city, country, coordinates, region } = cached.current
    return { name: city, country, lat: coordinates.lat, lon: coordinates.lon, region }
  } catch {
    return null
  }
}

export function getLastCachedWeather(): CachedWeatherData | null {
  try {
    const coordsRaw = localStorage.getItem(LAST_KEY)
    if (!coordsRaw) return null
    const { lat, lon } = JSON.parse(coordsRaw) as { lat: number; lon: number }
    return loadWeatherFromCache(lat, lon)
  } catch {
    return null
  }
}

export function clearAllCachedData(): void {
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('igicu-')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch {
    // localStorage unavailable — silently ignore
  }
}
