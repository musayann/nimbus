import type { AirQuality, AirQualityLevel, Coordinates } from '@/types/weather'
import { roundCoordinates } from '@/lib/geo'

interface REMAReading {
  aqi?: number
  PM25?: number
  PM10?: number
  NO2?: number
  O3?: number
  [key: string]: unknown
}

interface REMAFeature {
  geometry: {
    coordinates: [number, number] // [lon, lat]
  }
  properties: {
    aqi: number
    data: REMAReading[]
  }
}

interface REMAResponse {
  features: REMAFeature[]
}

function haversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const sinLat = Math.sin(dLat / 2)
  const sinLon = Math.sin(dLon / 2)
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLon *
      sinLon
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

function levelFromAqi(aqi: number): AirQualityLevel {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

async function getREMAData(): Promise<REMAResponse | null> {
  const res = await fetch('https://aq.rema.gov.rw/load_json', {
    next: { revalidate: 600 },
  } as RequestInit)
  if (!res.ok) return null
  return res.json()
}

export async function fetchAirQuality(
  lat: number,
  lon: number
): Promise<AirQuality | null> {
  const json = await getREMAData()
  if (!json) return null

  const rounded = roundCoordinates(lat, lon)
  const features = json.features
  if (!features || features.length === 0) return null

  let nearest = features[0]
  let minDist = Infinity

  for (const f of features) {
    const [fLon, fLat] = f.geometry.coordinates
    const dist = haversineDistance(
      { lat: rounded.lat, lon: rounded.lon },
      { lat: fLat, lon: fLon }
    )
    if (dist < minDist) {
      minDist = dist
      nearest = f
    }
  }

  const { data } = nearest.properties
  const latest = data[data.length - 1] ?? {}
  const aqi = latest.aqi || 0

  return {
    aqi,
    level: levelFromAqi(aqi),
    pm25: latest.PM25 ?? 0,
    pm10: latest.PM10 ?? 0,
    o3: latest.O3 ?? 0,
    no2: latest.NO2 ?? 0,
  }
}
