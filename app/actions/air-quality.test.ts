import { fetchAirQuality } from './air-quality'

function makeREMAResponse(features: unknown[] = []) {
  return { features }
}

function makeFeature(
  lon: number,
  lat: number,
  aqi: number,
  pollutants: Record<string, number> = {}
) {
  return {
    geometry: { coordinates: [lon, lat] },
    properties: {
      aqi,
      data: [{ aqi, PM25: 12, PM10: 20, NO2: 5, O3: 30, ...pollutants }],
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

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchAirQuality', () => {
  it('returns air quality data from nearest station', async () => {
    const farStation = makeFeature(30.0, -2.5, 80)
    const nearStation = makeFeature(29.88, -1.94, 42)
    mockFetchOk(makeREMAResponse([farStation, nearStation]))

    const result = await fetchAirQuality({ lat: -1.9403, lon: 29.8739 })
    expect(result).not.toBeNull()
    expect(result!.aqi).toBe(42)
    expect(result!.pm25).toBe(12)
    expect(result!.pm10).toBe(20)
    expect(result!.no2).toBe(5)
    expect(result!.o3).toBe(30)
  })

  describe('AQI level mapping', () => {
    it.each([
      [0, 'Good'],
      [50, 'Good'],
      [51, 'Moderate'],
      [100, 'Moderate'],
      [101, 'Unhealthy for Sensitive Groups'],
      [150, 'Unhealthy for Sensitive Groups'],
      [151, 'Unhealthy'],
      [200, 'Unhealthy'],
      [201, 'Very Unhealthy'],
      [300, 'Very Unhealthy'],
      [301, 'Hazardous'],
      [500, 'Hazardous'],
    ])('maps AQI %i to level "%s"', async (aqi, expectedLevel) => {
      mockFetchOk(makeREMAResponse([makeFeature(29.88, -1.94, aqi)]))
      const result = await fetchAirQuality({ lat: -1.9403, lon: 29.8739 })
      expect(result!.level).toBe(expectedLevel)
    })
  })

  it('defaults missing pollutant values to 0', async () => {
    const feature = {
      geometry: { coordinates: [29.88, -1.94] },
      properties: {
        aqi: 30,
        data: [{ aqi: 30 }],
      },
    }
    mockFetchOk(makeREMAResponse([feature]))
    const result = await fetchAirQuality({ lat: -1.9403, lon: 29.8739 })
    expect(result!.pm25).toBe(0)
    expect(result!.pm10).toBe(0)
    expect(result!.no2).toBe(0)
    expect(result!.o3).toBe(0)
  })

  describe('error handling', () => {
    it('returns null on fetch error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('network error'))
      )
      const result = await fetchAirQuality({ lat: -1.9403, lon: 29.8739 })
      expect(result).toBeNull()
    })

    it('returns null on non-ok response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
      const result = await fetchAirQuality({ lat: -1.9403, lon: 29.8739 })
      expect(result).toBeNull()
    })

    it('returns null on empty features', async () => {
      mockFetchOk(makeREMAResponse([]))
      const result = await fetchAirQuality({ lat: -1.9403, lon: 29.8739 })
      expect(result).toBeNull()
    })
  })
})
