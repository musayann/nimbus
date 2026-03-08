'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SyncButtonProps {
  timestamp: number
  isLoading?: boolean
  onSync?: () => void
}

function formatRelative(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 300) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function SyncButton({ timestamp, isLoading, onSync }: SyncButtonProps) {
  const [label, setLabel] = useState(() => formatRelative(timestamp))

  useEffect(() => {
    setLabel(formatRelative(timestamp))
    const id = setInterval(() => setLabel(formatRelative(timestamp)), 30_000)
    return () => clearInterval(id)
  }, [timestamp])

  return (
    <button
      type="button"
      onClick={onSync}
      disabled={isLoading}
      className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
      aria-label="Sync weather data"
    >
      <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
      {label}
    </button>
  )
}
