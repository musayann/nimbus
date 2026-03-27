import type { ReactNode } from 'react'

export interface IconRenderProps {
  size: number
  animClass: string
  className: string
  isDay: boolean
}

export type WeatherIconRenderer = (props: IconRenderProps) => ReactNode
