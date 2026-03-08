# Igicu

Rwanda-focused weather app with live forecasts, air quality monitoring, and detailed atmospheric data.

**Live:** [igicu.aros.app](https://igicu.aros.app)

> _Repo codename: nimbus_

## Features

- **Real-time current weather** — temperature, feels-like, humidity, wind, UV index, pressure, visibility, sunrise/sunset
- **12-hour hourly forecast** with temperature bars
- **5-day daily forecast** with rain probability and wind
- **Air quality** from Rwanda's REMA monitoring network (AQI, PM2.5, PM10, O3, NO2)
- **Atmospheric details** — precipitation, dew point, humidity, pressure
- **City search** with autocomplete across all Rwandan locations
- **Geolocation** with Rwanda boundary enforcement (fallback to Kigali)
- **Dark theme** with glassmorphism UI
- **Fully responsive** (mobile-first)
- **Metric units** (°C, km/h, hPa)

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, React Server Components
- [React 19](https://react.dev), TypeScript (strict)
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com)
- [Open-Meteo API](https://open-meteo.com) — weather data
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org) — geocoding
- REMA — air quality data (Rwanda government, public)
- [Vercel Analytics](https://vercel.com/analytics)

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io)

### Setup

```bash
git clone https://github.com/your-username/nimbus.git
cd nimbus
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command      | Description             |
| ------------ | ----------------------- |
| `pnpm dev`   | Start dev server        |
| `pnpm build` | Production build        |
| `pnpm lint`  | Run ESLint              |
| `pnpm start` | Start production server |

## APIs Used

| API                                                            | Auth          | Description                               |
| -------------------------------------------------------------- | ------------- | ----------------------------------------- |
| [Open-Meteo](https://open-meteo.com)                           | None (free)   | Current weather, hourly & daily forecasts |
| [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org) | None (free)   | City search & reverse geocoding           |
| REMA Air Quality                                               | None (public) | Rwanda government air quality monitoring  |

## License

[MIT](LICENSE)
