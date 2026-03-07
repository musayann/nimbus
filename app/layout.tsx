import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

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
    { media: '(prefers-color-scheme: light)', color: '#007ea8' },
    { media: '(prefers-color-scheme: dark)', color: '#00a7d3' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-RW" className={inter.variable} suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
