import { searchCities, reverseGeocode } from './location'

function makeGeocodingResponse(results: Record<string, unknown>[]) {
  return { results }
}

function makeRawResult(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Kigali',
    admin1: 'Kigali',
    admin2: 'Kigali District',
    country: 'Rwanda',
    country_code: 'RW',
    feature_code: 'PPLC',
    latitude: -1.9403,
    longitude: 29.8739,
    ...overrides,
  }
}

function mockFetchOk(body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(body),
    })
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('searchCities', () => {
  it('returns empty array for empty query', async () => {
    const spy = vi.fn()
    vi.stubGlobal('fetch', spy)
    const result = await searchCities('')
    expect(result).toEqual([])
    expect(spy).not.toHaveBeenCalled()
  })

  it('returns empty array for whitespace-only query', async () => {
    const spy = vi.fn()
    vi.stubGlobal('fetch', spy)
    const result = await searchCities('   ')
    expect(result).toEqual([])
    expect(spy).not.toHaveBeenCalled()
  })

  it('filters results to Rwanda only', async () => {
    mockFetchOk(
      makeGeocodingResponse([
        makeRawResult({ name: 'Kigali', country_code: 'RW' }),
        makeRawResult({
          name: 'Kigali',
          country_code: 'CD',
          latitude: -4.0,
          longitude: 21.0,
        }),
      ])
    )
    const result = await searchCities('Kigali')
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Kigali')
  })

  it('strips "District" from admin2 names', async () => {
    mockFetchOk(
      makeGeocodingResponse([
        makeRawResult({
          name: 'Musanze',
          admin1: 'Northern Province',
          admin2: 'Musanze District',
          feature_code: 'PPL',
        }),
      ])
    )
    const result = await searchCities('Musanze')
    // The name should not contain "District"
    expect(result[0].name).not.toContain('District')
  })

  it('deduplicates by feature code priority (PPLC > PPLX > PPL)', async () => {
    mockFetchOk(
      makeGeocodingResponse([
        makeRawResult({
          name: 'Kigali',
          admin1: 'Kigali',
          admin2: 'Kigali District',
          feature_code: 'PPL',
        }),
        makeRawResult({
          name: 'Kigali',
          admin1: 'Kigali',
          admin2: 'Kigali District',
          feature_code: 'PPLC',
        }),
      ])
    )
    const result = await searchCities('Kigali')
    // Should deduplicate to one Kigali with PPLC priority
    const kigaliEntries = result.filter((r) => r.name === 'Kigali')
    expect(kigaliEntries).toHaveLength(1)
    expect(kigaliEntries[0].feature_code).toBe('PPLC')
  })

  it('ranks exact match first, then startsWith, then others', async () => {
    mockFetchOk(
      makeGeocodingResponse([
        makeRawResult({
          name: 'Huye',
          admin1: 'Southern Province',
          admin2: 'Huye District',
          feature_code: 'PPL',
          latitude: -2.5,
          longitude: 29.7,
        }),
        makeRawResult({
          name: 'Huyetown',
          admin1: 'Southern Province',
          admin2: 'Huyetown District',
          feature_code: 'PPL',
          latitude: -2.6,
          longitude: 29.8,
        }),
      ])
    )
    const result = await searchCities('Huye')
    expect(result[0].name).toBe('Huye')
  })

  it('returns empty array on fetch error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network error'))
    )
    const result = await searchCities('Kigali')
    expect(result).toEqual([])
  })

  it('returns empty array when API returns no results', async () => {
    mockFetchOk({ results: undefined })
    const result = await searchCities('Nonexistent')
    expect(result).toEqual([])
  })

  it('returns empty array on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await searchCities('Kigali')
    expect(result).toEqual([])
  })
})

describe('reverseGeocode', () => {
  it('returns GeoResult for Rwanda coordinates', async () => {
    mockFetchOk({
      address: {
        city: 'Kigali',
        country_code: 'rw',
      },
      name: 'Kigali',
    })
    const result = await reverseGeocode(-1.9403, 29.8739)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('Kigali')
    expect(result!.country).toBe('Rwanda')
    expect(result!.lat).toBe(-1.9403)
    expect(result!.lon).toBe(29.8739)
  })

  it('falls back through address fields: city → town → village → municipality → name', async () => {
    // No city, should fall back to town
    mockFetchOk({
      address: { town: 'Musanze', country_code: 'rw' },
      name: 'Some Place',
    })
    let result = await reverseGeocode(-1.5, 29.6)
    expect(result!.name).toBe('Musanze')

    // No city or town, should fall back to village
    mockFetchOk({
      address: { village: 'Kinigi', country_code: 'rw' },
      name: 'Another Place',
    })
    result = await reverseGeocode(-1.5, 29.6)
    expect(result!.name).toBe('Kinigi')

    // No city, town, or village, should fall back to municipality
    mockFetchOk({
      address: { municipality: 'Rubavu', country_code: 'rw' },
      name: 'Yet Another',
    })
    result = await reverseGeocode(-1.7, 29.3)
    expect(result!.name).toBe('Rubavu')

    // No address fields, should fall back to top-level name
    mockFetchOk({
      address: { country_code: 'rw' },
      name: 'Fallback Name',
    })
    result = await reverseGeocode(-1.7, 29.3)
    expect(result!.name).toBe('Fallback Name')
  })

  it('returns null for non-Rwanda location', async () => {
    mockFetchOk({
      address: { city: 'Nairobi', country_code: 'ke' },
      name: 'Nairobi',
    })
    const result = await reverseGeocode(-1.2921, 36.8219)
    expect(result).toBeNull()
  })

  it('returns null on fetch error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network error'))
    )
    const result = await reverseGeocode(-1.9403, 29.8739)
    expect(result).toBeNull()
  })

  it('returns null on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await reverseGeocode(-1.9403, 29.8739)
    expect(result).toBeNull()
  })

  it('returns null when name is missing', async () => {
    mockFetchOk({
      address: { country_code: 'rw' },
    })
    const result = await reverseGeocode(-1.9403, 29.8739)
    expect(result).toBeNull()
  })
})
