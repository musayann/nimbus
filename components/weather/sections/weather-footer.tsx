export function WeatherFooter() {
  return (
    <footer className="relative z-10 px-4 pb-6 pt-2 md:px-8">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-1.5 text-[11px] text-muted-foreground/70">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <span>
            Weather data by{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Open-Meteo
            </a>
          </span>
          <span>
            Geocoding by{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              OpenStreetMap
            </a>
          </span>
          <span>
            Air quality by{' '}
            <a
              href="https://www.rema.gov.rw"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              REMA Rwanda
            </a>
          </span>
        </div>
        <a
          href="/privacy"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}
