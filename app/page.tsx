import { WeatherApp } from '@/components/weather/weather-app'

export default function Page() {
  return (
    <div className="min-h-screen sky-gradient">
      {/* Background decorative blobs */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute w-150 h-150 rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, oklch(0.65 0.18 215), transparent 70%)',
            top: '-15%',
            right: '-15%',
          }}
        />
        <div
          className="absolute w-100 h-100 rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(circle, oklch(0.72 0.15 190), transparent 70%)',
            bottom: '10%',
            left: '-10%',
          }}
        />
      </div>
      <div className="content-wrapper">
        <WeatherApp />
      </div>
    </div>
  )
}
