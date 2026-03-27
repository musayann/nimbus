import type {
  CurrentWeather,
  ForecastDay,
  HourlyItem,
} from '@/types/weather'
import { roundCoordinates } from '@/lib/geo'
import { degreesToCardinal, parseTimeHHMM } from '@/lib/weather-helpers'
import { mapTomorrowCode } from '@/lib/providers/tomorrow-io-codes'

function getApiKey(): string {
  const key = process.env.TOMORROW_IO_API_KEY
  if (!key) {
    throw new Error(
      'TOMORROW_IO_API_KEY environment variable is required when using Tomorrow.io provider'
    )
  }
  return key
}

// Tomorrow.io returns wind speed in m/s with metric units
function msToKmh(ms: number): number {
  return Math.round(ms * 3.6)
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<{
  current: Omit<CurrentWeather, 'city' | 'country' | 'coordinates'>
  forecast: ForecastDay[]
  hourly: HourlyItem[]
}> {
  const apiKey = getApiKey()
  const rounded = roundCoordinates(lat, lon)
  const location = `${rounded.lat},${rounded.lon}`

  const [realtimeRes, forecastRes] = await Promise.all([
    fetch(
      `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${apiKey}&units=metric`
    ),
    fetch(
      `https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${apiKey}&units=metric&timesteps=1h,1d`
    ),
  ])

  if (!realtimeRes.ok) {
    throw new Error('Failed to fetch realtime weather from Tomorrow.io')
  }
  if (!forecastRes.ok) {
    throw new Error('Failed to fetch forecast from Tomorrow.io')
  }

  const realtimeData = await realtimeRes.json()
  const forecastData = await forecastRes.json()

  const rv = realtimeData.data.values
  const daily = forecastData.timelines.daily
  const hourlyTimeline = forecastData.timelines.hourly

  // Current weather
  const { condition, description } = mapTomorrowCode(rv.weatherCode)
  const todayDaily = daily[0]?.values ?? {}

  const current: Omit<CurrentWeather, 'city' | 'country' | 'coordinates'> = {
    temperature: Math.round(rv.temperature),
    feelsLike: Math.round(rv.temperatureApparent),
    condition,
    description,
    humidity: Math.round(rv.humidity),
    dewPoint: Math.round(rv.dewPoint),
    windSpeed: msToKmh(rv.windSpeed),
    windDirection: degreesToCardinal(rv.windDirection),
    visibility: Math.round(rv.visibility),
    uvIndex: rv.uvIndex,
    pressure: Math.round(rv.pressureSurfaceLevel),
    precipitation: todayDaily.precipitationAccumulationSum ?? 0,
    sunrise: parseTimeHHMM(todayDaily.sunriseTime),
    sunset: parseTimeHHMM(todayDaily.sunsetTime),
    high: Math.round(todayDaily.temperatureMax ?? rv.temperature),
    low: Math.round(todayDaily.temperatureMin ?? rv.temperature),
    lastUpdated: Date.now(),
  }

  // Forecast (skip today, take up to 10 days)
  const forecast: ForecastDay[] = []
  const dateFmt = new Intl.DateTimeFormat('en-RW', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const dayFmt = new Intl.DateTimeFormat('en-RW', { weekday: 'short' })

  for (let i = 1; i < daily.length && forecast.length < 10; i++) {
    const day = daily[i]
    const dv = day.values
    const d = new Date(day.time)
    const code = mapTomorrowCode(dv.weatherCodeMax ?? dv.weatherCode ?? 1001)

    forecast.push({
      date: i === 1 ? 'Tomorrow' : dateFmt.format(d),
      dayName: dayFmt.format(d),
      condition: code.condition,
      description: code.description,
      high: Math.round(dv.temperatureMax),
      low: Math.round(dv.temperatureMin),
      humidity: Math.round(dv.humidityMax ?? dv.humidityAvg ?? 0),
      windSpeed: msToKmh(dv.windSpeedMax ?? dv.windSpeedAvg ?? 0),
      chanceOfRain: Math.round(
        dv.precipitationProbabilityMax ?? dv.precipitationProbabilityAvg ?? 0
      ),
    })
  }

  // Hourly (next 12 hours from current hour)
  const now = new Date()
  const hourly: HourlyItem[] = []

  // Find the first hourly entry at or after the current time
  let startIdx = 0
  for (let i = 0; i < hourlyTimeline.length; i++) {
    if (new Date(hourlyTimeline[i].time) >= now) {
      startIdx = i
      break
    }
  }

  for (let i = 0; i < 12; i++) {
    const idx = startIdx + i
    if (idx >= hourlyTimeline.length) break
    const entry = hourlyTimeline[idx]
    const hv = entry.values
    const time = entry.time as string
    const hour =
      i === 0 ? 'Now' : time.slice(time.indexOf('T') + 1, time.indexOf('T') + 6)

    hourly.push({
      hour,
      temp: Math.round(hv.temperature),
      condition: mapTomorrowCode(hv.weatherCode).condition,
      precipitationProbability: hv.precipitationProbability ?? 0,
    })
  }

  return { current, forecast, hourly }
}
