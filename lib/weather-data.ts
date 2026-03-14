import type {
  WeatherCondition,
  CurrentWeather,
  ForecastDay,
  HourlyItem,
} from '@/components/weather/types'
import { roundCoordinates } from '@/lib/geo'

function mapWmoCode(code: number): {
  condition: WeatherCondition
  description: string
} {
  if (code === 0) return { condition: 'sunny', description: 'Clear sky' }
  if (code <= 2)
    return { condition: 'partly-cloudy', description: 'Partly cloudy' }
  if (code === 3) return { condition: 'cloudy', description: 'Overcast' }
  if (code >= 45 && code <= 48)
    return { condition: 'foggy', description: 'Foggy' }
  if (code >= 51 && code <= 57)
    return { condition: 'rainy', description: 'Drizzle' }
  if (code >= 61 && code <= 67)
    return { condition: 'rainy', description: 'Rain' }
  if (code >= 71 && code <= 77)
    return { condition: 'snow', description: 'Snow' }
  if (code >= 80 && code <= 82)
    return { condition: 'rainy', description: 'Rain showers' }
  if (code >= 95 && code <= 99)
    return { condition: 'stormy', description: 'Thunderstorm' }
  return { condition: 'cloudy', description: 'Cloudy' }
}

function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

function parseTimeHHMM(isoString: string | undefined): string {
  if (!isoString) return '--:--'
  const tIndex = isoString.indexOf('T')
  if (tIndex === -1) return '--:--'
  return isoString.slice(tIndex + 1, tIndex + 6) || '--:--'
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<{
  current: Omit<CurrentWeather, 'city' | 'country' | 'coordinates'>
  forecast: ForecastDay[]
  hourly: HourlyItem[]
}> {
  const rounded = roundCoordinates(lat, lon)
  const params = new URLSearchParams({
    latitude: rounded.lat.toString(),
    longitude: rounded.lon.toString(),
    timezone: 'auto',
    forecast_days: '6',
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,uv_index,dew_point_2m',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_max',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) {
    throw new Error('Failed to fetch weather data from upstream')
  }

  const data = await res.json()

  // Current weather
  const { condition, description } = mapWmoCode(data.current.weather_code)
  const sunriseTime = parseTimeHHMM(data.daily.sunrise?.[0])
  const sunsetTime = parseTimeHHMM(data.daily.sunset?.[0])

  const current: Omit<CurrentWeather, 'city' | 'country' | 'coordinates'> = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition,
    description,
    humidity: data.current.relative_humidity_2m,
    dewPoint: Math.round(data.current.dew_point_2m),
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: degreesToCardinal(data.current.wind_direction_10m),
    visibility: Math.round(data.current.visibility / 1000),
    uvIndex: data.current.uv_index,
    pressure: Math.round(data.current.pressure_msl),
    precipitation: data.current.precipitation,
    sunrise: sunriseTime,
    sunset: sunsetTime,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    lastUpdated: Date.now(),
  }

  // Forecast (days 1-5)
  const forecast: ForecastDay[] = []
  const dateFmt = new Intl.DateTimeFormat('en-RW', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const dayFmt = new Intl.DateTimeFormat('en-RW', { weekday: 'short' })

  for (let i = 1; i <= 5; i++) {
    const d = new Date(data.daily.time[i])
    const wmo = mapWmoCode(data.daily.weather_code[i])
    forecast.push({
      date: i === 1 ? 'Tomorrow' : dateFmt.format(d),
      dayName: dayFmt.format(d),
      condition: wmo.condition,
      description: wmo.description,
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      humidity: data.daily.relative_humidity_2m_max[i],
      windSpeed: Math.round(data.daily.wind_speed_10m_max[i]),
      chanceOfRain: data.daily.precipitation_probability_max[i],
    })
  }

  // Hourly (next 12 hours from current hour)
  const currentHour = data.current.time.slice(0, 13) + ':00'
  const currentHourIndex = data.hourly.time.findIndex(
    (t: string) => t === currentHour
  )
  const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0
  const hourly: HourlyItem[] = []
  for (let i = 0; i < 12; i++) {
    const idx = startIndex + i
    if (idx >= data.hourly.time.length) break
    const time = data.hourly.time[idx]
    const hour = i === 0 ? 'Now' : time.split('T')[1].slice(0, 5)
    hourly.push({
      hour,
      temp: Math.round(data.hourly.temperature_2m[idx]),
      condition: mapWmoCode(data.hourly.weather_code[idx]).condition,
      precipitationProbability:
        data.hourly.precipitation_probability[idx] ?? 0,
    })
  }

  return { current, forecast, hourly }
}
