export interface GeoResult {
  name: string
  region?: string
  country: string
  feature_code?: string
  lat: number
  lon: number
}

export function roundCoordinates(lat: number, lon: number, decimals = 2) {
  const factor = 10 ** decimals
  return {
    lat: Math.round(lat * factor) / factor,
    lon: Math.round(lon * factor) / factor,
  }
}
