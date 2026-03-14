'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { SearchBar } from '../shared/search-bar'
import { useUnits } from '@/hooks/use-units'

interface WeatherHeaderProps {
  onSearch: (
    city: string,
    country: string,
    lat: number,
    lon: number,
    region?: string
  ) => void
  onUseLocation: () => void
  isLocating: boolean
}

export function WeatherHeader({
  onSearch,
  onUseLocation,
  isLocating,
}: WeatherHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { unitSystem, toggleUnits } = useUnits()

  return (
    <header className="relative z-10 px-4 pt-6 pb-4 md:px-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Igicu
            </h1>
            <p className="text-xs text-muted-foreground">
              Live weather for Rwanda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
              aria-label={
                resolvedTheme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              className="glass rounded-xl p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {resolvedTheme === 'dark' ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
            </button>
            <button
              onClick={toggleUnits}
              aria-label={`Switch to ${unitSystem === 'metric' ? 'imperial' : 'metric'} units`}
              className="glass rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer"
            >
              {unitSystem === 'metric' ? 'Metric · °C' : 'Imperial · °F'}
            </button>
          </div>
        </div>
        <SearchBar
          onSearch={onSearch}
          onUseLocation={onUseLocation}
          isLocating={isLocating}
        />
      </div>
    </header>
  )
}
