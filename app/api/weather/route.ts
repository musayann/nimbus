import { NextResponse } from 'next/server'
import { fetchWeather } from '@/lib/weather-data'
import { fetchAirQuality } from '@/lib/air-quality'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latStr = searchParams.get('lat')
  const lonStr = searchParams.get('lon')

  if (!latStr || !lonStr) {
    return NextResponse.json(
      { error: 'Missing required query parameters: lat and lon' },
      { status: 400 }
    )
  }

  const lat = Number(latStr)
  const lon = Number(lonStr)

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json(
      { error: 'lat and lon must be valid numbers' },
      { status: 400 }
    )
  }

  try {
    const [weather, airQuality] = await Promise.all([
      fetchWeather(lat, lon),
      fetchAirQuality(lat, lon).catch(() => null),
    ])

    return NextResponse.json({
      current: weather.current,
      forecast: weather.forecast,
      hourly: weather.hourly,
      airQuality,
    })
  } catch (e) {
    console.error('GET /api/weather failed:', e)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
