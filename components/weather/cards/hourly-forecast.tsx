'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react'
import type { HourlyItem } from '@/types/weather'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { WeatherIcon } from '../shared/weather-icon'
import { HourlyForecastSkeleton } from '../skeletons/hourly-forecast-skeleton'

interface HourlyForecastProps {
  data?: HourlyItem[]
  isLoading?: boolean
}

export function HourlyForecast({ data, isLoading }: HourlyForecastProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const getViewport = useCallback(() => {
    return containerRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    )
  }, [])

  const updateScrollState = useCallback(() => {
    const viewport = getViewport()
    if (!viewport) return
    setCanScrollLeft(viewport.scrollLeft > 0)
    setCanScrollRight(
      viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1
    )
  }, [getViewport])

  useEffect(() => {
    const viewport = getViewport()
    if (!viewport) return

    updateScrollState()
    viewport.addEventListener('scroll', updateScrollState)
    return () => viewport.removeEventListener('scroll', updateScrollState)
  }, [getViewport, updateScrollState, data])

  const scrollLeft = () => {
    getViewport()?.scrollBy({ left: -200, behavior: 'smooth' })
  }

  const scrollRight = () => {
    getViewport()?.scrollBy({ left: 200, behavior: 'smooth' })
  }

  if (isLoading && (!data || data.length === 0)) {
    return <HourlyForecastSkeleton />
  }

  if (!data || data.length === 0) return null
  const maxTemp = Math.max(...data.map((h) => h.temp))
  const minTemp = Math.min(...data.map((h) => h.temp))
  const range = maxTemp - minTemp || 1

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Hourly Forecast
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div ref={containerRef}>
        <ScrollArea className="-mx-2 px-2">
          <div className="flex gap-3 min-w-max pb-3">
            {data.map((item, i) => {
              const barHeight =
                Math.round(((item.temp - minTemp) / range) * 40) + 12
              return (
                <div key={i} className="flex flex-col items-center gap-2 w-14">
                  <span className="text-xs text-muted-foreground font-medium">
                    {item.hour}
                  </span>
                  <WeatherIcon condition={item.condition} size={24} />
                  <div className="flex flex-col items-center justify-end h-14">
                    <div
                      className="w-1 rounded-full bg-primary opacity-70"
                      style={{ height: barHeight }}
                      aria-hidden
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {item.temp}°
                  </span>
                  {item.precipitationProbability > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-medium">
                      <Droplets className="w-3 h-3" />
                      {item.precipitationProbability}%
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
