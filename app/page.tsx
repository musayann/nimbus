import { BackgroundBlobs } from '@/components/weather/shared/background-blobs'
import { WeatherLayout } from '@/components/weather/sections/weather-layout'

export default function Page() {
  return (
    <div className="min-h-screen sky-gradient">
      <BackgroundBlobs />
      <div className="content-wrapper">
        <WeatherLayout />
      </div>
    </div>
  )
}
