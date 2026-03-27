import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function FoggyIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Foggy"
    >
      {[18, 26, 34, 42].map((y, i) => (
        <line
          key={i}
          x1="12"
          y1={y}
          x2="52"
          y2={y}
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity={0.4 + i * 0.15}
        />
      ))}
    </svg>
  )
}
