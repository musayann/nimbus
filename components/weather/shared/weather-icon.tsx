'use client'

import { CloudOff } from 'lucide-react'
import type { WeatherCondition } from '@/types/weather'
import { weatherIcons } from './icons'

interface WeatherIconProps {
  condition: WeatherCondition
  size?: number
  animated?: boolean
  className?: string
  isDay?: boolean
}

export function WeatherIcon({
  condition,
  size = 64,
  animated = false,
  className = '',
  isDay = true,
}: WeatherIconProps) {
  const animClass = animated ? 'weather-icon-animated' : ''

  const renderIcon = weatherIcons[condition]
  if (renderIcon) {
    return renderIcon({ size, animClass, className, isDay })
  }

  console.warn(`WeatherIcon: unmatched condition "${condition}"`)
  return (
    <CloudOff size={size} className={className} aria-label="Unknown weather" />
  )
}
