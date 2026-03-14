'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type UnitSystem = 'metric' | 'imperial'

interface UnitsContextValue {
  unitSystem: UnitSystem
  toggleUnits: () => void
  temp: (celsius: number) => number
  speed: (kmh: number) => number
  distance: (km: number) => number
  pressure: (hPa: number) => number
  precip: (mm: number) => number
  tempUnit: string
  speedUnit: string
  distanceUnit: string
  pressureUnit: string
  precipUnit: string
}

const STORAGE_KEY = 'igicu-units'

const UnitsContext = createContext<UnitsContextValue | null>(null)

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'imperial') setUnitSystem('imperial')
  }, [])

  const toggleUnits = useCallback(() => {
    setUnitSystem((prev) => {
      const next = prev === 'metric' ? 'imperial' : 'metric'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const isImperial = unitSystem === 'imperial'

  const temp = useCallback(
    (c: number) => (isImperial ? Math.round(c * 9 / 5 + 32) : c),
    [isImperial]
  )
  const speed = useCallback(
    (kmh: number) =>
      isImperial ? Math.round(kmh * 0.621371) : kmh,
    [isImperial]
  )
  const distance = useCallback(
    (km: number) =>
      isImperial ? +(km * 0.621371).toFixed(1) : km,
    [isImperial]
  )
  const pressure = useCallback(
    (hPa: number) =>
      isImperial ? +(hPa * 0.02953).toFixed(2) : hPa,
    [isImperial]
  )
  const precip = useCallback(
    (mm: number) =>
      isImperial ? +(mm * 0.03937).toFixed(2) : mm,
    [isImperial]
  )

  return (
    <UnitsContext value={{
      unitSystem,
      toggleUnits,
      temp,
      speed,
      distance,
      pressure,
      precip,
      tempUnit: isImperial ? '°F' : '°C',
      speedUnit: isImperial ? 'mph' : 'km/h',
      distanceUnit: isImperial ? 'mi' : 'km',
      pressureUnit: isImperial ? 'inHg' : 'hPa',
      precipUnit: isImperial ? 'in' : 'mm',
    }}>
      {children}
    </UnitsContext>
  )
}

export function useUnits() {
  const ctx = useContext(UnitsContext)
  if (!ctx) throw new Error('useUnits must be used within UnitsProvider')
  return ctx
}
