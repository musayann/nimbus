import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function StormyIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Stormy"
    >
      <ellipse cx="34" cy="20" rx="16" ry="10" fill="#475569" />
      <ellipse cx="22" cy="22" rx="12" ry="9" fill="#475569" />
      <ellipse cx="44" cy="22" rx="10" ry="8" fill="#475569" />
      <ellipse cx="32" cy="16" rx="11" ry="8" fill="#475569" />
      <polygon points="35,30 28,42 33,42 30,54 42,38 36,38" fill="#FDE047" />
      {[
        [20, 34],
        [48, 34],
      ].map(([cx, cy], i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx - 3}
          y2={cy + 7}
          stroke="#7DD3FC"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
