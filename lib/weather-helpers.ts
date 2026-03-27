export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

export function parseTimeHHMM(isoString: string | undefined): string {
  if (!isoString) return '--:--'
  const tIndex = isoString.indexOf('T')
  if (tIndex === -1) return '--:--'
  return isoString.slice(tIndex + 1, tIndex + 6) || '--:--'
}
