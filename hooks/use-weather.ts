'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { reverseGeocode } from '@/app/actions/location'
import type {
  AirQuality,
  CurrentWeather,
  ForecastDay,
  HourlyItem,
} from '@/types/weather'
import {
  saveWeatherToCache,
  getLastCachedWeather,
  getLastCachedCity,
} from '@/lib/weather-cache'

const DEFAULT_LOCATION = {
  name: 'Kigali',
  feature_code: 'PPLC',
  country: 'Rwanda',
  lat: -1.94995,
  lon: 30.05885,
}

export function useWeather() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [hourly, setHourly] = useState<HourlyItem[]>([])
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const initializedRef = useRef(false)

  const loadCity = useCallback(
    async (
      city: string,
      country: string,
      lat: number,
      lon: number,
      region?: string
    ) => {
      setIsLoading(true)
      setError(null)
      const weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      const result = weatherRes.ok ? await weatherRes.json() : null
      if (result) {
        setAirQuality(result.airQuality ?? null)
        const currentData: CurrentWeather = {
          ...result.current,
          city,
          region,
          country,
          coordinates: { lat, lon },
        }
        setCurrent(currentData)
        setForecast(result.forecast)
        setHourly(result.hourly)
        saveWeatherToCache(currentData, result.forecast, result.hourly)
      } else {
        setError('Could not load weather data. Please try again.')
        toast.error('Failed to load weather data')
      }
      setIsLoading(false)
    },
    []
  )

  const loadDefault = useCallback(() => {
    loadCity(
      DEFAULT_LOCATION.name,
      DEFAULT_LOCATION.country,
      DEFAULT_LOCATION.lat,
      DEFAULT_LOCATION.lon
    )
  }, [loadCity])

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const geo = await reverseGeocode(latitude, longitude)

        const city = geo?.name ?? DEFAULT_LOCATION.name
        const country = geo?.country ?? DEFAULT_LOCATION.country
        const lat = geo?.lat ?? DEFAULT_LOCATION.lat
        const lon = geo?.lon ?? DEFAULT_LOCATION.lon

        await loadCity(city, country, lat, lon)
        setIsLocating(false)
      },
      (err) => {
        setIsLocating(false)
        const message =
          err.code === err.PERMISSION_DENIED
            ? 'Location access denied. Please enable location permissions.'
            : 'Could not determine your location. Please try again.'
        toast.error(message)
      },
      { timeout: 8000 }
    )
  }, [loadCity])

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      if (!navigator.onLine) {
        const cached = getLastCachedWeather()
        if (cached) {
          setCurrent(cached.current)
          setForecast(cached.forecast)
          setHourly(cached.hourly)
          setIsLoading(false)
          return
        }
      }
      const lastCity = getLastCachedCity()
      if (lastCity) {
        loadCity(
          lastCity.name,
          lastCity.country,
          lastCity.lat,
          lastCity.lon,
          lastCity.region
        )
      } else {
        loadDefault()
      }
    }
  }, [loadCity, loadDefault])

  useEffect(() => {
    const handleOnline = () => {
      if (current) {
        loadCity(
          current.city,
          current.country,
          current.coordinates.lat,
          current.coordinates.lon,
          current.region
        )
      } else {
        loadDefault()
      }
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [current, loadCity, loadDefault])

  const switchCity = useCallback(
    (city: string, country: string, lat: number, lon: number, region?: string) => {
      setCurrent(null)
      setForecast([])
      setHourly([])
      setAirQuality(null)
      loadCity(city, country, lat, lon, region)
    },
    [loadCity]
  )

  const sync = useCallback(() => {
    if (current) {
      loadCity(
        current.city,
        current.country,
        current.coordinates.lat,
        current.coordinates.lon,
        current.region
      )
    }
  }, [current, loadCity])

  return {
    current,
    forecast,
    hourly,
    airQuality,
    isLoading,
    error,
    isLocating,
    switchCity,
    loadDefault,
    handleUseLocation,
    sync,
  }
}
