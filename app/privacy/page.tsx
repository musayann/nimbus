'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { clearAllCachedData } from '@/lib/weather-cache'
import { toast } from 'sonner'

export default function PrivacyPage() {
  const [cleared, setCleared] = useState(false)

  function handleClearData() {
    clearAllCachedData()
    setCleared(true)
    toast.success('All cached data has been cleared')
  }

  return (
    <div className="min-h-screen sky-gradient">
      <div className="max-w-2xl mx-auto px-4 py-8 md:px-8 content-wrapper">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to Igicu
        </Link>

        <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mt-1">Last updated: March 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">What Igicu Does</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Igicu is an open-source weather application focused on Rwanda. It displays real-time weather data,
              hourly forecasts, 5-day forecasts, and air quality information for Rwandan cities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Data We Collect</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-medium text-foreground/90">Location coordinates</h3>
                <p>
                  When you use the &ldquo;Use my location&rdquo; feature, your browser asks for permission to share
                  your coordinates. This is entirely opt-in. Coordinates are sent to third-party APIs to fetch weather
                  data and are cached locally on your device. We do not store your location on any server.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground/90">Search queries</h3>
                <p>
                  City searches are sent to the Open-Meteo geocoding API to find matching locations. Search queries
                  are not stored by Igicu.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Local Storage</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Igicu uses your browser&rsquo;s localStorage to cache weather data and your last-viewed location so the
              app loads faster on return visits. This data is stored only on your device and is never sent to our
              servers. Specifically, we store:
            </p>
            <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
              <li>Cached weather data (temperature, conditions, forecasts)</li>
              <li>Last-viewed coordinates</li>
              <li>Theme preference (light/dark mode)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Third-Party Services</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-medium text-foreground/90">Vercel Analytics</h3>
                <p>
                  We use Vercel Web Analytics to understand how the app is used (page views, performance metrics,
                  browser and device information). Vercel Analytics does not use cookies and does not collect
                  personally identifiable information. See the{' '}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    Vercel Privacy Policy
                  </a>.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground/90">Open-Meteo API</h3>
                <p>
                  Coordinates are sent to Open-Meteo to retrieve weather and geocoding data. Open-Meteo is a
                  free, open-source weather API. See{' '}
                  <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    open-meteo.com
                  </a>.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground/90">OpenStreetMap Nominatim</h3>
                <p>
                  Coordinates are sent to the OpenStreetMap Nominatim service for reverse geocoding (converting
                  coordinates to city names). See the{' '}
                  <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    OpenStreetMap Copyright
                  </a>.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground/90">REMA Rwanda</h3>
                <p>
                  Coordinates are sent to the Rwanda Environment Management Authority API for air quality data.
                  See{' '}
                  <a href="https://www.rema.gov.rw" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    rema.gov.rw
                  </a>.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground/90">Google Fonts</h3>
                <p>
                  The Inter font is loaded via Next.js font optimization, which self-hosts the font files at build
                  time. No runtime requests are made to Google servers.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Data Retention</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All data cached in localStorage persists until you manually clear it (using the button below or your
              browser settings). Igicu does not maintain any server-side storage of user data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Your Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Under GDPR (EU) and Rwanda Data Protection Law 058/2021, you have the right to:
            </p>
            <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
              <li>Know what data is collected about you (described above)</li>
              <li>Delete your data (clear cached data below, or revoke location permission in your browser)</li>
              <li>Opt out of location sharing (simply decline the browser prompt or never use the feature)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Clear Cached Data</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Remove all Igicu data stored in your browser, including cached weather data and saved location.
            </p>
            <button
              onClick={handleClearData}
              disabled={cleared}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium glass hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} />
              {cleared ? 'Data cleared' : 'Clear all cached data'}
            </button>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Igicu is an open-source project. For privacy-related questions or concerns, please open an issue on{' '}
              <a href="https://github.com/musayann/nimbus" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                GitHub
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
