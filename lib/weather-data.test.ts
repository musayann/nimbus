import { fetchWeather } from './weather-data'

vi.mock('@/lib/providers/open-meteo', () => ({
  fetchWeather: vi.fn().mockResolvedValue({
    current: { temperature: 22 },
    forecast: [],
    hourly: [],
  }),
}))

vi.mock('@/lib/providers/tomorrow-io', () => ({
  fetchWeather: vi.fn().mockResolvedValue({
    current: { temperature: 23 },
    forecast: [],
    hourly: [],
  }),
}))

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('fetchWeather facade', () => {
  it('delegates to open-meteo provider by default', async () => {
    const result = await fetchWeather(-1.94, 29.87)
    expect(result.current.temperature).toBe(22)
  })

  it('delegates to open-meteo when WEATHER_PROVIDER=open-meteo', async () => {
    vi.stubEnv('WEATHER_PROVIDER', 'open-meteo')
    const result = await fetchWeather(-1.94, 29.87)
    expect(result.current.temperature).toBe(22)
  })

  it('delegates to tomorrow-io when WEATHER_PROVIDER=tomorrow-io', async () => {
    vi.stubEnv('WEATHER_PROVIDER', 'tomorrow-io')
    const result = await fetchWeather(-1.94, 29.87)
    expect(result.current.temperature).toBe(23)
  })

  it('throws on unknown provider', () => {
    vi.stubEnv('WEATHER_PROVIDER', 'invalid')
    expect(() => fetchWeather(-1.94, 29.87)).toThrow(
      'Unknown weather provider: invalid'
    )
  })
})
