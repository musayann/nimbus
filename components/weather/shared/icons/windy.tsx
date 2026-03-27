import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function WindyIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Windy"
    >
      <path
        d="M10 24 Q30 16 50 24"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.9"
      />
      <path
        d="M10 32 Q32 24 52 32"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.75"
      />
      <path
        d="M10 40 Q28 32 46 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.6"
      />
    </svg>
  )
}
