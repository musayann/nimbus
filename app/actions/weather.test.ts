import { fetchWeather } from './weather'

function makeOpenMeteoResponse(overrides: Record<string, unknown> = {}) {
  return {
    current: {
      time: '2026-03-08T14:30',
      temperature_2m: 22.3,
      relative_humidity_2m: 65,
      apparent_temperature: 21.1,
      precipitation: 0.5,
      weather_code: 0,
      wind_speed_10m: 12.7,
      wind_direction_10m: 180,
      pressure_msl: 1013.2,
      visibility: 15000,
      uv_index: 6,
      dew_point_2m: 14.8,
      ...((overrides.current as object) ?? {}),
    },
    daily: {
      time: [
        '2026-03-08',
        '2026-03-09',
        '2026-03-10',
        '2026-03-11',
        '2026-03-12',
        '2026-03-13',
      ],
      weather_code: [0, 2, 3, 45, 63, 95],
      temperature_2m_max: [24, 25, 22, 20, 18, 23],
      temperature_2m_min: [15, 16, 14, 13, 12, 14],
      sunrise: [
        '2026-03-08T06:15',
        '2026-03-09T06:16',
        '2026-03-10T06:16',
        '2026-03-11T06:17',
        '2026-03-12T06:17',
        '2026-03-13T06:18',
      ],
      sunset: [
        '2026-03-08T18:20',
        '2026-03-09T18:19',
        '2026-03-10T18:19',
        '2026-03-11T18:18',
        '2026-03-12T18:18',
        '2026-03-13T18:17',
      ],
      uv_index_max: [8, 7, 5, 4, 3, 6],
      precipitation_sum: [0, 1, 2, 5, 10, 0],
      precipitation_probability_max: [10, 30, 50, 70, 90, 20],
      wind_speed_10m_max: [15, 20, 18, 25, 30, 12],
      relative_humidity_2m_max: [70, 75, 80, 85, 90, 65],
      ...((overrides.daily as object) ?? {}),
    },
    hourly: {
      time: Array.from({ length: 48 }, (_, i) => {
        const h = String(i % 24).padStart(2, '0')
        const day = i < 24 ? '2026-03-08' : '2026-03-09'
        return `${day}T${h}:00`
      }),
      temperature_2m: Array.from({ length: 48 }, (_, i) => 18 + (i % 8)),
      weather_code: Array.from({ length: 48 }, () => 0),
      precipitation_probability: Array.from({ length: 48 }, (_, i) => i * 2),
      ...((overrides.hourly as object) ?? {}),
    },
  }
}

function mockFetchOk(body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(body),
    })
  )
}

function mockFetchError() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
}

function mockFetchNotOk() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchWeather', () => {
  it('returns structured current, forecast, and hourly data', async () => {
    mockFetchOk(makeOpenMeteoResponse())
    const result = await fetchWeather(-1.9403, 29.8739)

    expect(result).not.toBeNull()
    expect(result!.current.temperature).toBe(22)
    expect(result!.current.feelsLike).toBe(21)
    expect(result!.current.humidity).toBe(65)
    expect(result!.current.dewPoint).toBe(15)
    expect(result!.current.windSpeed).toBe(13)
    expect(result!.current.visibility).toBe(15)
    expect(result!.current.uvIndex).toBe(6)
    expect(result!.current.pressure).toBe(1013)
    expect(result!.current.precipitation).toBe(0.5)
    expect(result!.current.high).toBe(24)
    expect(result!.current.low).toBe(15)
    expect(result!.current.lastUpdated).toBeGreaterThan(0)
  })

  describe('WMO code mapping', () => {
    it.each([
      [0, 'sunny', 'Clear sky'],
      [2, 'partly-cloudy', 'Partly cloudy'],
      [3, 'cloudy', 'Overcast'],
      [45, 'foggy', 'Foggy'],
      [53, 'rainy', 'Drizzle'],
      [63, 'rainy', 'Rain'],
      [73, 'snow', 'Snow'],
      [81, 'rainy', 'Rain showers'],
      [95, 'stormy', 'Thunderstorm'],
    ])(
      'maps WMO code %i to condition=%s, description=%s',
      async (code, expectedCondition, expectedDescription) => {
        mockFetchOk(makeOpenMeteoResponse({ current: { weather_code: code } }))
        const result = await fetchWeather(-1.9403, 29.8739)

        expect(result!.current.condition).toBe(expectedCondition)
        expect(result!.current.description).toBe(expectedDescription)
      }
    )
  })

  describe('wind direction conversion', () => {
    it.each([
      [0, 'N'],
      [45, 'NE'],
      [90, 'E'],
      [135, 'SE'],
      [180, 'S'],
      [225, 'SW'],
      [270, 'W'],
      [315, 'NW'],
      [360, 'N'],
    ])('converts %i degrees to %s', async (deg, expected) => {
      mockFetchOk(
        makeOpenMeteoResponse({ current: { wind_direction_10m: deg } })
      )
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result!.current.windDirection).toBe(expected)
    })
  })

  describe('sunrise/sunset parsing', () => {
    it('parses ISO times to HH:MM', async () => {
      mockFetchOk(makeOpenMeteoResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result!.current.sunrise).toBe('06:15')
      expect(result!.current.sunset).toBe('18:20')
    })

    it('returns "--:--" for missing sunrise/sunset', async () => {
      mockFetchOk(
        makeOpenMeteoResponse({
          daily: { sunrise: [undefined], sunset: [undefined] },
        })
      )
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result!.current.sunrise).toBe('--:--')
      expect(result!.current.sunset).toBe('--:--')
    })
  })

  describe('forecast', () => {
    it('returns 5 forecast days', async () => {
      mockFetchOk(makeOpenMeteoResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result!.forecast).toHaveLength(5)
    })

    it('labels first forecast day as "Tomorrow"', async () => {
      mockFetchOk(makeOpenMeteoResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result!.forecast[0].date).toBe('Tomorrow')
    })

    it('maps WMO codes for each forecast day', async () => {
      mockFetchOk(makeOpenMeteoResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      // daily weather_code: [0, 2, 3, 45, 63, 95] — index 0 is today, forecast uses 1-5
      expect(result!.forecast[0].condition).toBe('partly-cloudy') // code 2
      expect(result!.forecast[1].condition).toBe('cloudy') // code 3
      expect(result!.forecast[2].condition).toBe('foggy') // code 45
      expect(result!.forecast[3].condition).toBe('rainy') // code 63
      expect(result!.forecast[4].condition).toBe('stormy') // code 95
    })
  })

  describe('hourly', () => {
    it('starts from current hour', async () => {
      mockFetchOk(makeOpenMeteoResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      // current.time is 2026-03-08T14:30, truncated to 14:00, so startIndex=14
      expect(result!.hourly.length).toBeLessThanOrEqual(12)
      expect(result!.hourly.length).toBeGreaterThan(0)
    })

    it('labels first hourly item as "Now"', async () => {
      mockFetchOk(makeOpenMeteoResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result!.hourly[0].hour).toBe('Now')
    })

    it('labels subsequent hours with HH:MM', async () => {
      mockFetchOk(makeOpenMeteoResponse())
      const result = await fetchWeather(-1.9403, 29.8739)
      // startIndex = 14, so second item is hour 15
      expect(result!.hourly[1].hour).toBe('15:00')
    })
  })

  describe('error handling', () => {
    it('returns null on fetch error', async () => {
      mockFetchError()
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result).toBeNull()
    })

    it('returns null on non-ok response', async () => {
      mockFetchNotOk()
      const result = await fetchWeather(-1.9403, 29.8739)
      expect(result).toBeNull()
    })
  })
})
