export function getPressureLabel(pressure: number): string {
  if (pressure >= 1020) return 'High'
  if (pressure <= 1000) return 'Low'
  return 'Normal'
}
