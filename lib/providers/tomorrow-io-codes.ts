import type { WeatherCondition } from '@/types/weather'

const codeMap: Record<
  number,
  { condition: WeatherCondition; description: string }
> = {
  1000: { condition: 'sunny', description: 'Clear' },
  1100: { condition: 'sunny', description: 'Mostly Clear' },
  1101: { condition: 'partly-cloudy', description: 'Partly Cloudy' },
  1102: { condition: 'cloudy', description: 'Mostly Cloudy' },
  1001: { condition: 'cloudy', description: 'Cloudy' },
  2000: { condition: 'foggy', description: 'Fog' },
  2100: { condition: 'foggy', description: 'Light Fog' },
  4000: { condition: 'rainy', description: 'Drizzle' },
  4001: { condition: 'rainy', description: 'Rain' },
  4200: { condition: 'rainy', description: 'Light Rain' },
  4201: { condition: 'rainy', description: 'Heavy Rain' },
  5000: { condition: 'snow', description: 'Snow' },
  5001: { condition: 'snow', description: 'Flurries' },
  5100: { condition: 'snow', description: 'Light Snow' },
  5101: { condition: 'snow', description: 'Heavy Snow' },
  6000: { condition: 'rainy', description: 'Freezing Drizzle' },
  6001: { condition: 'rainy', description: 'Freezing Rain' },
  6200: { condition: 'rainy', description: 'Light Freezing Rain' },
  6201: { condition: 'rainy', description: 'Heavy Freezing Rain' },
  7000: { condition: 'snow', description: 'Ice Pellets' },
  7101: { condition: 'snow', description: 'Heavy Ice Pellets' },
  7102: { condition: 'snow', description: 'Light Ice Pellets' },
  8000: { condition: 'stormy', description: 'Thunderstorm' },
}

export function mapTomorrowCode(code: number): {
  condition: WeatherCondition
  description: string
} {
  return codeMap[code] ?? { condition: 'cloudy', description: 'Cloudy' }
}
