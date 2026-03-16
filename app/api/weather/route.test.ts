import { GET } from './route'

function makeOpenMeteoResponse() {
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
    },
    daily: {
      time: [
        '2026-03-08',
        '2026-03-09',
        '2026-03-10',
        '2026-03-11',
        '2026-03-12',
        '2026-03-13',
        '2026-03-14',
        '2026-03-15',
        '2026-03-16',
        '2026-03-17',
        '2026-03-18',
      ],
      weather_code: [0, 2, 3, 45, 63, 95, 0, 2, 3, 53, 81],
      temperature_2m_max: [24, 25, 22, 20, 18, 23, 24, 21, 19, 22, 20],
      temperature_2m_min: [15, 16, 14, 13, 12, 14, 15, 13, 11, 14, 12],
      sunrise: [
        '2026-03-08T06:15',
        '2026-03-09T06:16',
        '2026-03-10T06:16',
        '2026-03-11T06:17',
        '2026-03-12T06:17',
        '2026-03-13T06:18',
        '2026-03-14T06:18',
        '2026-03-15T06:19',
        '2026-03-16T06:19',
        '2026-03-17T06:20',
        '2026-03-18T06:20',
      ],
      sunset: [
        '2026-03-08T18:20',
        '2026-03-09T18:19',
        '2026-03-10T18:19',
        '2026-03-11T18:18',
        '2026-03-12T18:18',
        '2026-03-13T18:17',
        '2026-03-14T18:17',
        '2026-03-15T18:16',
        '2026-03-16T18:16',
        '2026-03-17T18:15',
        '2026-03-18T18:15',
      ],
      uv_index_max: [8, 7, 5, 4, 3, 6, 7, 5, 4, 6, 5],
      precipitation_sum: [0, 1, 2, 5, 10, 0, 1, 3, 7, 2, 4],
      precipitation_probability_max: [10, 30, 50, 70, 90, 20, 15, 40, 60, 35, 55],
      wind_speed_10m_max: [15, 20, 18, 25, 30, 12, 14, 22, 28, 16, 20],
      relative_humidity_2m_max: [70, 75, 80, 85, 90, 65, 72, 78, 88, 74, 82],
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
    },
  }
}

function makeREMAResponse() {
  return {
    features: [
      {
        geometry: { coordinates: [29.88, -1.94] },
        properties: {
          aqi: 42,
          data: [{ aqi: 42, PM25: 12, PM10: 20, NO2: 5, O3: 30 }],
        },
      },
    ],
  }
}

function makeRequest(params?: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/weather')
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
  }
  return new Request(url.toString())
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/weather', () => {
  it('returns 400 when lat or lon is missing', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(400)
  })

  it('returns 400 when lat or lon is not a number', async () => {
    const res = await GET(makeRequest({ lat: 'abc', lon: '30' }))
    expect(res.status).toBe(400)
  })

  it('returns combined weather and air quality data', async () => {
    let callIndex = 0
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => {
        const body =
          callIndex++ === 0 ? makeOpenMeteoResponse() : makeREMAResponse()
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(body),
        })
      })
    )

    const res = await GET(makeRequest({ lat: '-1.9403', lon: '29.8739' }))
    expect(res.status).toBe(200)

    const result = await res.json()
    expect(result).toHaveProperty('current')
    expect(result).toHaveProperty('forecast')
    expect(result).toHaveProperty('hourly')
    expect(result).toHaveProperty('airQuality')
    expect(result.airQuality.aqi).toBe(42)
  })

  it('returns airQuality as null when REMA fetch fails', async () => {
    let callIndex = 0
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => {
        if (callIndex++ === 0) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(makeOpenMeteoResponse()),
          })
        }
        return Promise.reject(new Error('REMA down'))
      })
    )

    const res = await GET(makeRequest({ lat: '-1.9403', lon: '29.8739' }))
    expect(res.status).toBe(200)

    const result = await res.json()
    expect(result.current).toBeDefined()
    expect(result.airQuality).toBeNull()
  })

  describe('error handling', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('returns 500 on weather fetch error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('network error'))
      )
      const res = await GET(makeRequest({ lat: '-1.9403', lon: '29.8739' }))
      expect(res.status).toBe(500)
    })

    it('returns 500 on non-ok upstream response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
      const res = await GET(makeRequest({ lat: '-1.9403', lon: '29.8739' }))
      expect(res.status).toBe(500)
    })
  })
})
