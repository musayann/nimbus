# Nimbus

Rwanda-focused weather application providing realistic weather data for Rwandan cities.

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

```
app/              → Next.js App Router pages and layouts
components/ui/    → shadcn/ui components
components/weather/ → Weather-specific components (weather-app, search-bar, forecast-card, etc.)
hooks/            → Custom React hooks
lib/              → Utility functions (utils.ts with cn() helper)
public/           → Static assets
```

### Key files

- `components/weather/weather-app.tsx` — Main app shell
- `components/weather/mock-data.ts` — Mock weather data (Kigali default, Rwandan cities prioritized)
- `components/weather/types.ts` — TypeScript types for weather data

## Conventions

- Path alias: `@/*` maps to project root
- Use `cn()` from `@/lib/utils` for conditional class merging
- Components use named exports
- Styling: Tailwind utility classes, CSS variables for theming
- Dark mode via next-themes

## Current state

- Uses **mock data** — no live weather API integration yet
- Default city: Kigali, Rwanda
- City database includes Rwandan cities (Kigali, Butare, Gisenyi, Ruhengeri) and select international cities
