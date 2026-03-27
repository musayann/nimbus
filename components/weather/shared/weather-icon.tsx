'use client'

import { CloudOff } from 'lucide-react'
import type { WeatherCondition } from '@/types/weather'

interface WeatherIconProps {
  condition: WeatherCondition
  size?: number
  animated?: boolean
  className?: string
}

export function WeatherIcon({
  condition,
  size = 64,
  animated = false,
  className = '',
}: WeatherIconProps) {
  const s = size
  const animClass = animated ? 'weather-icon-animated' : ''

  if (condition === 'sunny') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'partly-cloudy') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'cloudy') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'rainy') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'stormy') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'foggy') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'windy') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'snow') {
    return (
      <svg
        width={s}
        height={s}
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

  if (condition === 'night-clear') {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        className={`${animClass} ${className}`}
        aria-label="Clear night"
      >
        <circle cx="38" cy="28" r="16" fill="#E0E7FF" />
        <circle cx="48" cy="18" r="12" fill="#1a1a2e" />
      </svg>
    )
  }

  if (condition === 'night-cloudy') {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        className={`${animClass} ${className}`}
        aria-label="Cloudy night"
      >
        <circle cx="42" cy="18" r="14" fill="#E0E7FF" />
        <circle cx="54" cy="10" r="10" fill="#1a1a2e" />
        <ellipse
          cx="34"
          cy="40"
          rx="14"
          ry="8"
          fill="#94A3B8"
          fillOpacity="0.85"
        />
        <ellipse
          cx="24"
          cy="42"
          rx="10"
          ry="7"
          fill="#94A3B8"
          fillOpacity="0.8"
        />
        <ellipse cx="44" cy="42" rx="10" ry="8" fill="#94A3B8" fillOpacity="0.75" />
      </svg>
    )
  }

  console.warn(`WeatherIcon: unmatched condition "${condition}"`)
  return (
    <CloudOff size={s} className={className} aria-label="Unknown weather" />
  )
}
