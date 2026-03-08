'use client'

import { THEME_COLORS } from '@/constants'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const color =
      resolvedTheme === 'dark' ? THEME_COLORS.dark : THEME_COLORS.light

    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute('content', color))
  }, [resolvedTheme])

  return null
}
