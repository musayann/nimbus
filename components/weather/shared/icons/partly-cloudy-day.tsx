import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function PartlyCloudyDayIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Partly cloudy"
    >
      <circle cx="26" cy="22" r="10" fill="#FDB813" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line
          key={i}
          x1="26"
          y1="22"
          x2={26 + Math.cos((angle * Math.PI) / 180) * 18}
          y2={22 + Math.sin((angle * Math.PI) / 180) * 18}
          stroke="#FDB813"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
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
      <ellipse cx="42" cy="40" rx="8" ry="6" fill="white" fillOpacity="0.8" />
    </svg>
  )
}
