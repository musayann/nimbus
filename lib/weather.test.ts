import { getPressureLabel, getDewPointLabel } from './weather'

describe('getPressureLabel', () => {
  it('returns "High" for pressure >= 1020', () => {
    expect(getPressureLabel(1020)).toBe('High')
    expect(getPressureLabel(1035)).toBe('High')
  })

  it('returns "Low" for pressure <= 1000', () => {
    expect(getPressureLabel(1000)).toBe('Low')
    expect(getPressureLabel(980)).toBe('Low')
  })

  it('returns "Normal" for pressure between 1001 and 1019', () => {
    expect(getPressureLabel(1010)).toBe('Normal')
    expect(getPressureLabel(1001)).toBe('Normal')
    expect(getPressureLabel(1019)).toBe('Normal')
  })
})

describe('getDewPointLabel', () => {
  it('returns "Steamy" for dewPoint >= 24', () => {
    expect(getDewPointLabel(24)).toBe('Steamy')
    expect(getDewPointLabel(30)).toBe('Steamy')
  })

  it('returns "Humid" for dewPoint 21-23', () => {
    expect(getDewPointLabel(21)).toBe('Humid')
    expect(getDewPointLabel(23)).toBe('Humid')
  })

  it('returns "Muggy" for dewPoint 18-20', () => {
    expect(getDewPointLabel(18)).toBe('Muggy')
    expect(getDewPointLabel(20)).toBe('Muggy')
  })

  it('returns "Sticky" for dewPoint 16-17', () => {
    expect(getDewPointLabel(16)).toBe('Sticky')
    expect(getDewPointLabel(17)).toBe('Sticky')
  })

  it('returns "Comfortable" for dewPoint 13-15', () => {
    expect(getDewPointLabel(13)).toBe('Comfortable')
    expect(getDewPointLabel(15)).toBe('Comfortable')
  })

  it('returns "Pleasant" for dewPoint 10-12', () => {
    expect(getDewPointLabel(10)).toBe('Pleasant')
    expect(getDewPointLabel(12)).toBe('Pleasant')
  })

  it('returns "Dry" for dewPoint < 10', () => {
    expect(getDewPointLabel(9)).toBe('Dry')
    expect(getDewPointLabel(0)).toBe('Dry')
    expect(getDewPointLabel(-5)).toBe('Dry')
  })
})
