import { ThemeColorMeta } from '@/components/theme-color-meta'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { UnitsProvider } from '@/hooks/use-units'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { THEME_COLORS } from '@/constants'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Igicu – Rwanda Weather',
  description:
    'Live weather forecasts for cities across Rwanda. Current conditions, hourly updates, and 5-day forecasts.',
  keywords: ['Rwanda weather', 'Kigali weather', 'Rwanda forecast', 'Igicu'],
  openGraph: {
    title: 'Igicu – Rwanda Weather',
    description:
      'Live weather forecasts for cities across Rwanda. Current conditions, hourly updates, and 5-day forecasts.',
    siteName: 'Igicu',
    locale: 'en_RW',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Igicu',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-RW" className={inter.variable} suppressHydrationWarning>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UnitsProvider>
            <ThemeColorMeta />
            {children}
            <Toaster />
            <Analytics />
          </UnitsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
