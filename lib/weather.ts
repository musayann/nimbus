export function getPressureLabel(pressure: number): string {
  if (pressure >= 1020) return 'High'
  if (pressure <= 1000) return 'Low'
  return 'Normal'
}

export function getDewPointLabel(dewPoint: number): string {
  if (dewPoint >= 24) return 'Steamy'
  if (dewPoint >= 21) return 'Humid'
  if (dewPoint >= 18) return 'Muggy'
  if (dewPoint >= 16) return 'Sticky'
  if (dewPoint >= 13) return 'Comfortable'
  if (dewPoint >= 10) return 'Pleasant'
  return 'Dry'
}
