# Igicu

Rwanda-focused weather application providing real-time weather data for Rwandan cities via the Open-Meteo API.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — run ESLint
- `pnpm start` — start production server

## Architecture

- **Framework:** Next.js 16 with App Router (RSC enabled)
- **UI:** shadcn/ui (new-york style) + Tailwind CSS v4 + Radix primitives
- **Icons:** lucide-react
- **Charts:** recharts
- **Language:** TypeScript (strict mode)

### Project structure

```text
app/              → Next.js App Router pages and layouts
app/actions/      → Server actions (weather.ts, air-quality.ts)
components/ui/    → shadcn/ui components
components/weather/ → Weather-specific components (weather-app, search-bar, forecast-card, etc.)
hooks/            → Custom React hooks
lib/              → Utility functions (utils.ts with cn() helper)
public/           → Static assets
```

### Key files

- `components/weather/weather-app.tsx` — Main app shell
- `components/weather/types.ts` — TypeScript types for weather data
- `app/actions/weather.ts` — Server actions: weather fetch, city search (geocoding), reverse geocode

## Conventions

- Path alias: `@/*` maps to project root
- Use `cn()` from `@/lib/utils` for conditional class merging
- Components use named exports
- Styling: Tailwind utility classes, CSS variables for theming
- Dark mode via next-themes

## Current state

- Uses **Open-Meteo API** for live weather data (current, hourly, 5-day forecast)
- Default city: Kigali, Rwanda
- City database includes Rwandan cities (Kigali, Huye, Musanze, Rubavu, Muhanga, Rusizi, Nyagatare, Karongi, Rwamagana, Nyanza)
