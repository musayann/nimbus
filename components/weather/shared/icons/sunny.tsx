import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'
import { ClearDayIcon } from './clear-day'
import { ClearNightIcon } from './clear-night'

export function SunnyIcon(props: IconRenderProps): ReactNode {
  return props.isDay ? ClearDayIcon(props) : ClearNightIcon(props)
}
