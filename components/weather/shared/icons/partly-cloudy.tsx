import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'
import { PartlyCloudyDayIcon } from './partly-cloudy-day'
import { PartlyCloudyNightIcon } from './partly-cloudy-night'

export function PartlyCloudyIcon(props: IconRenderProps): ReactNode {
  return props.isDay ? PartlyCloudyDayIcon(props) : PartlyCloudyNightIcon(props)
}
