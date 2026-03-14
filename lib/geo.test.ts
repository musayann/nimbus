import { roundCoordinates } from './geo'

describe('roundCoordinates', () => {
  it('rounds to 2 decimal places by default', () => {
    expect(roundCoordinates(-1.9403, 29.8739)).toEqual({
      lat: -1.94,
      lon: 29.87,
    })
  })

  it('rounds to specified decimal places', () => {
    expect(roundCoordinates(-1.9403, 29.8739, 3)).toEqual({
      lat: -1.94,
      lon: 29.874,
    })
  })

  it('handles zero values', () => {
    expect(roundCoordinates(0, 0)).toEqual({ lat: 0, lon: 0 })
  })

  it('handles negative coordinates', () => {
    expect(roundCoordinates(-2.5678, -29.1234)).toEqual({
      lat: -2.57,
      lon: -29.12,
    })
  })

  it('rounds .005 up', () => {
    expect(roundCoordinates(1.005, 2.005)).toEqual({ lat: 1.01, lon: 2.01 })
  })
})
