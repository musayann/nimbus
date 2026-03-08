import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public')

const BG_COLOR = '#0b223e'
const CLOUD_COLOR = '#2ba4c9'
const CLOUD_PATH =
  'M32,112 C16,112 16,88 32,88 C20,68 44,52 68,52 C84,36 108,44 116,60 C120,56 136,56 144,68 C164,72 164,108 148,112 Z'

function createMaskableSvg(size) {
  // 10% safe-zone padding on each side
  const padding = size * 0.1
  const innerSize = size - padding * 2
  const scale = innerSize / 180

  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BG_COLOR}"/>
  <g transform="translate(${padding}, ${padding}) scale(${scale})">
    <path fill="${CLOUD_COLOR}" d="${CLOUD_PATH}"/>
  </g>
</svg>`)
}

const sizes = [192, 512]

for (const size of sizes) {
  const svg = createMaskableSvg(size)
  const outPath = path.join(outDir, `icon-maskable-${size}x${size}.png`)
  await sharp(svg).png().toFile(outPath)
  console.log(`Created ${outPath}`)
}
