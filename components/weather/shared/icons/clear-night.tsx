import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function ClearNightIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Clear night"
    >
      <mask id="crescent-clear">
        <rect width="64" height="64" fill="white" />
        <circle cx="38" cy="26" r="12" fill="black" />
      </mask>
      <circle
        cx="30"
        cy="32"
        r="14"
        fill="#E8E4D9"
        mask="url(#crescent-clear)"
      />
      <circle cx="48" cy="16" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="18" cy="18" r="1.2" fill="white" fillOpacity="0.6" />
      <circle cx="50" cy="38" r="1" fill="white" fillOpacity="0.7" />
      <circle cx="14" cy="42" r="1.3" fill="white" fillOpacity="0.65" />
    </svg>
  )
}
