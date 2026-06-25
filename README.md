# DOORS website

Private property brokerage site for DOORS (doors-properties.com). Vite + React + TypeScript + Tailwind + shadcn/ui.

Now maintained directly by LAUNCHT (moved off the Famous builder). The public marketing pages render from static data (`src/lib/doorsData.ts`); the client portal and agent studio use Supabase via `src/lib/supabase.ts` + `src/lib/engineApi.ts`.

## Develop
```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build -> dist/
```

## Temporary preview
Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`
(built with `VITE_BASE=/doors-website-preview/`). This is a temporary viewing
link only - the production site will deploy to the doors-properties.com root.

## Backend
The data layer currently points at a temporary Famous-hosted database
(`src/lib/supabase.ts`). This will be repointed to the client's own Supabase
project once provisioned, and the keys rotated.
