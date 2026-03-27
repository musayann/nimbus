import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function ClearDayIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Sunny"
    >
      <circle cx="32" cy="32" r="14" fill="#FDB813" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="32"
          y1="32"
          x2={32 + Math.cos((angle * Math.PI) / 180) * 26}
          y2={32 + Math.sin((angle * Math.PI) / 180) * 26}
          stroke="#FDB813"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
