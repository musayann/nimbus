import type { ReactNode } from 'react'
import type { IconRenderProps } from './types'

export function SnowIcon({ size, animClass, className }: IconRenderProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`${animClass} ${className}`}
      aria-label="Snow"
    >
      <ellipse cx="34" cy="22" rx="16" ry="10" fill="#CBD5E1" />
      <ellipse cx="24" cy="24" rx="12" ry="9" fill="#CBD5E1" />
      <ellipse cx="44" cy="24" rx="10" ry="8" fill="#CBD5E1" />
      {[
        [22, 38],
        [32, 44],
        [42, 38],
        [27, 52],
        [37, 50],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#BAE6FD" />
      ))}
    </svg>
  )
}
