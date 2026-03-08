import {
  saveWeatherToCache,
  loadWeatherFromCache,
  getLastCachedCity,
  getLastCachedWeather,
  clearAllCachedData,
} from './weather-cache'
import type {
  CurrentWeather,
  ForecastDay,
  HourlyItem,
} from '@/components/weather/types'

// --- localStorage stub ---
let store: Record<string, string>

const localStorageMock: Storage = {
  get length() {
    return Object.keys(store).length
  },
  key(i: number) {
    return Object.keys(store)[i] ?? null
  },
  getItem(key: string) {
    return store[key] ?? null
  },
  setItem(key: string, value: string) {
    store[key] = value
  },
  removeItem(key: string) {
    delete store[key]
  },
  clear() {
    store = {}
  },
}

beforeEach(() => {
  store = {}
  vi.stubGlobal('localStorage', localStorageMock)
})

afterEach(() => {
  vi.restoreAllMocks()
})

// --- fixtures ---
function makeCurrent(overrides: Partial<CurrentWeather> = {}): CurrentWeather {
  return {
    city: 'Kigali',
    country: 'Rwanda',
    coordinates: { lat: -1.9403, lon: 29.8739 },
    temperature: 22,
    feelsLike: 21,
    condition: 'sunny',
    description: 'Clear sky',
    humidity: 65,
    dewPoint: 15,
    windSpeed: 13,
    windDirection: 'S',
    visibility: 15,
    uvIndex: 6,
    pressure: 1013,
    precipitation: 0,
    sunrise: '06:15',
    sunset: '18:20',
    high: 24,
    low: 15,
    lastUpdated: Date.now(),
    ...overrides,
  }
}

const forecast: ForecastDay[] = [
  {
    date: 'Tomorrow',
    dayName: 'Mon',
    condition: 'partly-cloudy',
    description: 'Partly cloudy',
    high: 25,
    low: 16,
    humidity: 70,
    windSpeed: 20,
    chanceOfRain: 30,
  },
]

const hourly: HourlyItem[] = [
  { hour: 'Now', temp: 22, condition: 'sunny', precipitationProbability: 0 },
  { hour: '15:00', temp: 23, condition: 'sunny', precipitationProbability: 5 },
]

// --- tests ---
describe('saveWeatherToCache / loadWeatherFromCache', () => {
  it('round-trips weather data through cache', () => {
    const current = makeCurrent()
    saveWeatherToCache(current, forecast, hourly)

    const cached = loadWeatherFromCache(-1.9403, 29.8739)
    expect(cached).not.toBeNull()
    expect(cached!.current).toEqual(current)
    expect(cached!.forecast).toEqual(forecast)
    expect(cached!.hourly).toEqual(hourly)
    expect(cached!.cachedAt).toBeGreaterThan(0)
  })

  it('uses coordinate-based cache key (3 decimal places)', () => {
    saveWeatherToCache(makeCurrent(), forecast, hourly)
    expect(store['igicu-weather--1.940_29.874']).toBeDefined()
  })

  it('stores separate entries for different coordinates', () => {
    saveWeatherToCache(makeCurrent(), forecast, hourly)
    saveWeatherToCache(
      makeCurrent({
        city: 'Huye',
        coordinates: { lat: -2.5966, lon: 29.7394 },
      }),
      forecast,
      hourly
    )

    expect(loadWeatherFromCache(-1.9403, 29.8739)).not.toBeNull()
    expect(loadWeatherFromCache(-2.5966, 29.7394)).not.toBeNull()
    expect(loadWeatherFromCache(-1.9403, 29.8739)!.current.city).toBe('Kigali')
    expect(loadWeatherFromCache(-2.5966, 29.7394)!.current.city).toBe('Huye')
  })

  it('returns null for coordinates with no cached data', () => {
    expect(loadWeatherFromCache(0, 0)).toBeNull()
  })

  it('saves last-coords pointer alongside weather data', () => {
    saveWeatherToCache(makeCurrent(), forecast, hourly)
    const raw = store['igicu-weather-last-coords']
    expect(raw).toBeDefined()
    expect(JSON.parse(raw)).toEqual({ lat: -1.9403, lon: 29.8739 })
  })
})

describe('getLastCachedWeather', () => {
  it('returns the most recently saved weather data', () => {
    saveWeatherToCache(makeCurrent(), forecast, hourly)
    const cached = getLastCachedWeather()
    expect(cached).not.toBeNull()
    expect(cached!.current.city).toBe('Kigali')
  })

  it('follows the last-coords pointer after multiple saves', () => {
    saveWeatherToCache(makeCurrent(), forecast, hourly)
    saveWeatherToCache(
      makeCurrent({
        city: 'Huye',
        coordinates: { lat: -2.5966, lon: 29.7394 },
      }),
      forecast,
      hourly
    )

    const cached = getLastCachedWeather()
    expect(cached!.current.city).toBe('Huye')
  })

  it('returns null when no data is cached', () => {
    expect(getLastCachedWeather()).toBeNull()
  })

  it('returns null when last-coords exists but weather data is missing', () => {
    store['igicu-weather-last-coords'] = JSON.stringify({
      lat: -1.94,
      lon: 29.87,
    })
    expect(getLastCachedWeather()).toBeNull()
  })
})

describe('getLastCachedCity', () => {
  it('returns city info from the last cached weather', () => {
    saveWeatherToCache(makeCurrent({ region: 'Kigali City' }), forecast, hourly)
    const city = getLastCachedCity()
    expect(city).toEqual({
      name: 'Kigali',
      country: 'Rwanda',
      lat: -1.9403,
      lon: 29.8739,
      region: 'Kigali City',
    })
  })

  it('returns null when nothing is cached', () => {
    expect(getLastCachedCity()).toBeNull()
  })
})

describe('clearAllCachedData', () => {
  it('removes all igicu-prefixed keys', () => {
    saveWeatherToCache(makeCurrent(), forecast, hourly)
    store['igicu-theme'] = 'dark'
    store['unrelated-key'] = 'keep me'

    clearAllCachedData()

    expect(
      Object.keys(store).filter((k) => k.startsWith('igicu-'))
    ).toHaveLength(0)
    expect(store['unrelated-key']).toBe('keep me')
  })

  it('does nothing when cache is already empty', () => {
    expect(() => clearAllCachedData()).not.toThrow()
  })
})

describe('error resilience', () => {
  it('saveWeatherToCache silently ignores localStorage errors', () => {
    vi.stubGlobal('localStorage', {
      ...localStorageMock,
      setItem: () => {
        throw new DOMException('QuotaExceededError')
      },
    })
    expect(() =>
      saveWeatherToCache(makeCurrent(), forecast, hourly)
    ).not.toThrow()
  })

  it('loadWeatherFromCache returns null on corrupted data', () => {
    store['igicu-weather--1.940_29.874'] = 'not-json{{'
    expect(loadWeatherFromCache(-1.9403, 29.8739)).toBeNull()
  })

  it('getLastCachedWeather returns null on corrupted coords', () => {
    store['igicu-weather-last-coords'] = '{bad json'
    expect(getLastCachedWeather()).toBeNull()
  })
})
