import type { WeatherCondition } from '@/types/weather'
import type { WeatherIconRenderer } from './types'
import { SunnyIcon } from './sunny'
import { PartlyCloudyIcon } from './partly-cloudy'
import { CloudyIcon } from './cloudy'
import { RainyIcon } from './rainy'
import { StormyIcon } from './stormy'
import { FoggyIcon } from './foggy'
import { WindyIcon } from './windy'
import { SnowIcon } from './snow'

export type { IconRenderProps, WeatherIconRenderer } from './types'

export const weatherIcons: Record<WeatherCondition, WeatherIconRenderer> = {
  sunny: SunnyIcon,
  'partly-cloudy': PartlyCloudyIcon,
  cloudy: CloudyIcon,
  rainy: RainyIcon,
  stormy: StormyIcon,
  foggy: FoggyIcon,
  windy: WindyIcon,
  snow: SnowIcon,
}
