import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function RainyIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Rainy"
    >
      <ellipse cx="34" cy="26" rx="16" ry="10" fill="#94A3B8" />
      <ellipse cx="24" cy="28" rx="12" ry="9" fill="#94A3B8" />
      <ellipse cx="44" cy="28" rx="10" ry="8" fill="#94A3B8" />
      <ellipse cx="32" cy="22" rx="11" ry="8" fill="#94A3B8" />
      {[
        [22, 40],
        [32, 44],
        [42, 40],
        [27, 50],
        [37, 54],
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
