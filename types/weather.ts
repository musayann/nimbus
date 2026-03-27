export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'foggy'
  | 'windy'
  | 'snow'
  | 'night-clear'
  | 'night-cloudy'

export type AirQualityLevel =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous'

export interface AirQuality {
  aqi: number // 0–500 AQI scale
  level: AirQualityLevel
  pm25: number // µg/m³
  pm10: number // µg/m³
  o3: number // µg/m³
  no2: number // µg/m³
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface CurrentWeather {
  city: string
  region?: string
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
  precipitation: number // mm (today)
  sunrise: string
  sunset: string
  high: number
  low: number
  lastUpdated: number
}

export interface HourlyItem {
  hour: string
  temp: number
  condition: WeatherCondition
  precipitationProbability: number // %
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
