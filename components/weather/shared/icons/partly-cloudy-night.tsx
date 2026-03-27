import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function PartlyCloudyNightIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Partly cloudy night"
    >
      <mask id="crescent-cloudy">
        <rect width="64" height="64" fill="white" />
        <circle cx="30" cy="16" r="8" fill="black" />
      </mask>
      <circle
        cx="24"
        cy="22"
        r="10"
        fill="#E8E4D9"
        mask="url(#crescent-cloudy)"
      />
      <circle cx="42" cy="14" r="1.2" fill="white" fillOpacity="0.7" />
      <circle cx="14" cy="12" r="1" fill="white" fillOpacity="0.6" />
      <ellipse
        cx="34"
        cy="40"
        rx="14"
        ry="8"
        fill="white"
        fillOpacity="0.9"
      />
      <ellipse
        cx="26"
        cy="40"
        rx="10"
        ry="7"
        fill="white"
        fillOpacity="0.85"
      />
      <ellipse
        cx="42"
        cy="40"
        rx="8"
        ry="6"
        fill="white"
        fillOpacity="0.8"
      />
    </svg>
  )
}
