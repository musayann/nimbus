import { fetchWeather } from './tomorrow-io'

const MOCK_API_KEY = 'test-api-key-123'

function makeRealtimeResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      time: '2026-03-08T14:30:00Z',
      values: {
        temperature: 22.3,
        temperatureApparent: 21.1,
        humidity: 65,
        dewPoint: 14.8,
        windSpeed: 3.5, // m/s
        windDirection: 180,
        visibility: 15,
        uvIndex: 6,
        pressureSurfaceLevel: 1013.2,
        weatherCode: 1000,
        ...((overrides.values as object) ?? {}),
      },
    },
  }
}

function makeForecastResponse(overrides: Record<string, unknown> = {}) {
  const dailyDays = Array.from({ length: 7 }, (_, i) => ({
    time: `2026-03-${String(8 + i).padStart(2, '0')}T00:00:00Z`,
    values: {
      temperatureMax: 24 + i,
      temperatureMin: 14 + i,
      weatherCodeMax: 1000,
      humidityMax: 70 + i,
      windSpeedMax: 4 + i * 0.5, // m/s
      precipitationProbabilityMax: 10 + i * 5,
      precipitationAccumulationSum: 2 + i,
      sunriseTime: `2026-03-${String(8 + i).padStart(2, '0')}T06:15:00Z`,
      sunsetTime: `2026-03-${String(8 + i).padStart(2, '0')}T18:20:00Z`,
      uvIndexMax: 8 - i,
    },
  }))

  const hourlyHours = Array.from({ length: 24 }, (_, i) => ({
    time: `2026-03-08T${String(i).padStart(2, '0')}:00:00Z`,
    values: {
      temperature: 18 + (i % 8),
      weatherCode: 1000,
      precipitationProbability: i * 2,
    },
  }))

  return {
    timelines: {
      daily: (overrides.daily as typeof dailyDays) ?? dailyDays,
      hourly: (overrides.hourly as typeof hourlyHours) ?? hourlyHours,
    },
  }
}

function mockFetchOk(realtimeBody: unknown, forecastBody: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url.includes('/realtime')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(realtimeBody),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(forecastBody),
      })
    })
  )
}

beforeEach(() => {
  vi.stubEnv('TOMORROW_IO_API_KEY', MOCK_API_KEY)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('Tomorrow.io provider', () => {
  it('returns structured current weather data', async () => {
    mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
    const result = await fetchWeather(-1.9403, 29.8739)

    expect(result.current.temperature).toBe(22)
    expect(result.current.feelsLike).toBe(21)
    expect(result.current.humidity).toBe(65)
    expect(result.current.dewPoint).toBe(15)
    expect(result.current.windSpeed).toBe(13) // 3.5 m/s * 3.6 = 12.6 → 13
    expect(result.current.windDirection).toBe('S') // 180°
    expect(result.current.visibility).toBe(15)
    expect(result.current.uvIndex).toBe(6)
    expect(result.current.pressure).toBe(1013)
    expect(result.current.condition).toBe('sunny')
    expect(result.current.description).toBe('Clear')
    expect(result.current.lastUpdated).toBeGreaterThan(0)
  })

  it('gets sunrise/sunset from daily forecast', async () => {
    mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
    const result = await fetchWeather(-1.9403, 29.8739)
    expect(result.current.sunrise).toBe('06:15')
    expect(result.current.sunset).toBe('18:20')
  })

  it('gets high/low from daily forecast', async () => {
    mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
    const result = await fetchWeather(-1.9403, 29.8739)
    expect(result.current.high).toBe(24)
    expect(result.current.low).toBe(14)
  })

  describe('weather code mapping', () => {
    it.each([
      [1000, 'sunny', 'Clear'],
      [1101, 'partly-cloudy', 'Partly Cloudy'],
      [1001, 'cloudy', 'Cloudy'],
      [2000, 'foggy', 'Fog'],
      [4001, 'rainy', 'Rain'],
      [5000, 'snow', 'Snow'],
      [8000, 'stormy', 'Thunderstorm'],
    ])(
      'maps code %i to condition=%s, description=%s',
      async (code, expectedCondition, expectedDescription) => {
        mockFetchOk(
          makeRealtimeResponse({ values: { weatherCode: code } }),
          makeForecastResponse()
        )
        const result = await fetchWeather(-1.9403, 29.8739)
        expect(result.current.condition).toBe(expectedCondition)
        expect(result.current.description).toBe(expectedDescription)
      }
    )
  })

  it('converts wind speed from m/s to km/h', async () => {
    mockFetchOk(
      makeRealtimeResponse({ values: { windSpeed: 10 } }),
      makeForecastResponse()
    )
    const result = await fetchWeather(-1.9403, 29.8739)
    expect(result.current.windSpeed).toBe(36) // 10 * 3.6
  })

  describe('forecast', () => {
    it('returns forecast days skipping today', async () => {
      mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result.forecast.length).toBeGreaterThan(0)
      expect(result.forecast.length).toBeLessThanOrEqual(10)
    })

    it('labels first forecast day as "Tomorrow"', async () => {
      mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result.forecast[0].date).toBe('Tomorrow')
    })
  })

  describe('hourly', () => {
    it('returns up to 12 hourly items', async () => {
      mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result.hourly.length).toBeLessThanOrEqual(12)
      expect(result.hourly.length).toBeGreaterThan(0)
    })

    it('labels first hourly item as "Now"', async () => {
      mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result.hourly[0].hour).toBe('Now')
    })
  })

  it('throws when API key is missing', async () => {
    vi.stubEnv('TOMORROW_IO_API_KEY', '')
    mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
    await expect(fetchWeather(-1.9403, 29.8739)).rejects.toThrow(
      'TOMORROW_IO_API_KEY environment variable is required'
    )
  })

  it('throws on non-ok realtime response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/realtime')) {
          return Promise.resolve({ ok: false })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(makeForecastResponse()),
        })
      })
    )
    await expect(fetchWeather(-1.9403, 29.8739)).rejects.toThrow(
      'Failed to fetch realtime weather from Tomorrow.io'
    )
  })

  it('throws on non-ok forecast response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/realtime')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(makeRealtimeResponse()),
          })
        }
        return Promise.resolve({ ok: false })
      })
    )
    await expect(fetchWeather(-1.9403, 29.8739)).rejects.toThrow(
      'Failed to fetch forecast from Tomorrow.io'
    )
  })

  it('rounds coordinates in API calls', async () => {
    mockFetchOk(makeRealtimeResponse(), makeForecastResponse())
    await fetchWeather(-1.9467, 29.8781)
    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const realtimeUrl = calls[0][0] as string
    expect(realtimeUrl).toContain('location=-1.95%2C29.88')
  })
})
