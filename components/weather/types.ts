export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'foggy'
  | 'windy'
  | 'snow'

export type AirQualityLevel = 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous'

export interface AirQuality {
  aqi: number // 0–500 AQI scale
  level: AirQualityLevel
  pm25: number // µg/m³
  pm10: number // µg/m³
  o3: number  // µg/m³
  no2: number // µg/m³
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface CurrentWeather {
  city: string
  country: string
  coordinates: Coordinates
  temperature: number // °C
  feelsLike: number
  condition: WeatherCondition
  description: string
  humidity: number // %
  dewPoint: number // °C
  windSpeed: number // km/h
  windDirection: string
  visibility: number // km
  uvIndex: number
  pressure: number // hPa
  precipitation: number // mm (last hour)
  sunrise: string
  sunset: string
  high: number
  low: number
  lastUpdated: string
  airQuality: AirQuality | null
}

export interface ForecastDay {
  date: string
  dayName: string
  condition: WeatherCondition
  description: string
  high: number
  low: number
  humidity: number
  windSpeed: number
  chanceOfRain: number
}
