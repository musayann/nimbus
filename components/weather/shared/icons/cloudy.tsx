import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function CloudyIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Cloudy"
    >
      <ellipse
        cx="34"
        cy="34"
        rx="16"
        ry="10"
        fill="white"
        fillOpacity="0.8"
      />
      <ellipse
        cx="24"
        cy="36"
        rx="12"
        ry="9"
        fill="white"
        fillOpacity="0.85"
      />
      <ellipse
        cx="44"
        cy="36"
        rx="10"
        ry="8"
        fill="white"
        fillOpacity="0.75"
      />
      <ellipse
        cx="32"
        cy="30"
        rx="11"
        ry="8"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  )
}
