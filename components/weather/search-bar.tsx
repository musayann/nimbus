'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, X, Loader2 } from 'lucide-react'
import { searchCities } from '@/app/actions/location'
import { cn } from '@/lib/utils'
import { GeoResult } from '@/lib/geo'

interface SearchBarProps {
  onSearch: (city: string, country: string, lat: number, lon: number, region?: string) => void
  onUseLocation: () => void
  isLocating: boolean
}

export function SearchBar({ onSearch, onUseLocation, isLocating }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeoResult[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setSuggestions([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      const id = ++requestIdRef.current
      const results = await searchCities(query)
      if (id === requestIdRef.current) {
        setSuggestions(results)
        setIsSearching(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setActiveIndex(-1)
  }, [suggestions])

  function handleSelect(result: GeoResult) {
    onSearch(result.name, result.country, result.lat, result.lon, result.region)
    setQuery('')
    setSuggestions([])
    setIsFocused(false)
    inputRef.current?.blur()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      handleSelect(suggestions[activeIndex])
    } else if (suggestions.length > 0) {
      handleSelect(suggestions[0])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case 'Escape':
        e.preventDefault()
        setSuggestions([])
        setIsFocused(false)
        inputRef.current?.blur()
        break
    }
  }

  const showDropdown = isFocused && (suggestions.length > 0 || (query.trim() && !isSearching))
  const showNoResults = isFocused && query.trim() && !isSearching && suggestions.length === 0

  return (
    <div ref={containerRef} className="relative w-full z-50">
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-2xl glass transition-all duration-200',
            isFocused && 'ring-1 ring-primary/60'
          )}
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={`Search place...`}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none min-w-0"
            aria-label="Search for a city"
            aria-expanded={showDropdown || undefined}
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            role="combobox"
            aria-controls="suggestion-list"
            aria-autocomplete="list"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]) }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="w-px h-4 bg-border flex-shrink-0" />
          <button
            type="button"
            onClick={onUseLocation}
            disabled={isLocating}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer flex-shrink-0',
              isLocating
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-primary hover:text-accent'
            )}
            aria-label="Use current location"
          >
            <MapPin className={cn('w-3.5 h-3.5', isLocating && 'animate-pulse')} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>
      </form>

      {(showDropdown || showNoResults) && (
        <div id="suggestion-list" role="listbox" className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-2xl overflow-hidden z-50 shadow-xl">
          {showNoResults ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
          ) : (
            suggestions.map((s, i) => (
              <button
                id={`suggestion-${i}`}
                key={`${s.lat}-${s.lon}`}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onClick={() => handleSelect(s)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors',
                  i === activeIndex && 'bg-white/10'
                )}
              >
                <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground">{s.name}</span>
                {s.region && <span className="text-xs text-muted-foreground">{s.region}</span>}
                <span className="text-xs text-muted-foreground ml-auto">{s.country}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
