import { THEME_COLORS } from '@/constants'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Igicu – Rwanda Weather',
    short_name: 'Igicu',
    description:
      'Live weather forecasts for cities across Rwanda. Current conditions, hourly updates, and 5-day forecasts.',
    start_url: '/',
    display: 'standalone',
    theme_color: THEME_COLORS.light,
    background_color: THEME_COLORS.dark,
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
