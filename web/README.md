# Crumb — Web App

The desktop web client for **Crumb**, a UCF campus free-food finder. Students post
leftover/free food the moment they spot it; everyone nearby votes whether it's still
there, so each post carries a live **freshness** score and expires when the food runs out.

Built with **React 19 + TypeScript + Vite**. Talks to the project API (`../api`,
see `../api/openapi.yaml`). The UI is a faithful build of the design handoff
(_Class project design system web_).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

The dev server proxies `/api` to the API so the browser stays same-origin (no CORS
setup needed). Point it at your API with `API_PROXY_TARGET` (default
`http://localhost:5001`). Run the API separately (`cd ../api && npm run dev`).

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR + `/api` proxy |
| `npm run build` | Type-check (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Oxlint |

## Configuration

Copy `.env.example` to `.env` and adjust:

| Var | Purpose |
|---|---|
| `VITE_API_BASE_URL` | API base. Dev: `/api` (proxied). Prod: the full API origin, e.g. `https://api.crumb.app/api`. |
| `VITE_ASSET_BASE_URL` | Public base for uploaded images (S3/CDN). Post `imageKey` / user `avatarKey` are appended to it. Leave empty to disable remote images — cards then show a food-emoji placeholder. |
| `API_PROXY_TARGET` | Dev-only. Where the Vite proxy sends `/api` (the API server). |

## What's implemented

All 15 screens from the handoff:

- **Auth** — login (with unverified-email banner + resend), register (`.edu` gate,
  password-strength meter, guidelines), verify-email, forgot-password, check-email,
  set-new-password, and the email-verified landing page (`/email-verified`).
- **Dashboard** — top bar (Post + avatar menu), feed rail (search, `All / Fresh /
  Near me / Mine / Dietary` filters), a coordinate-projected campus map with teardrop
  status pins, and the detail panel (freshness meter, voting, activity).
- **Post food** modal — photo upload, type + dietary chips, campus place picker with
  nearest-you suggestions, room field, expiry note.
- **Mine** view + own-post detail (read-only tallies, no self-voting, delete).
- **Empty states** for the dashboard and your-drops.
- **Settings** modal — Profile (avatar upload) and Security (change password).

### Notes & backend dependencies

- **The map** is a stylized, key-free canvas (matching the reference) that projects
  real UCF coordinates from `GET /locations`. Swap in a map SDK later if desired.
- **Images** upload via the API's presigned-S3 flow. If the server has no S3 bucket
  configured, uploads return 503 and the app posts without a photo (with a notice).
- **Display name** is read-only in Settings — the API has no profile-update endpoint yet.
- **Delete** removes a drop locally (posts auto-expire); there is no `DELETE /posts/:id`.
- **Email links:** for verification and password-reset links to land here, the API's
  `APP_URL` must point at this web app's origin (dev default: `http://localhost:5173`).
  In production, also add that origin to the API's `CORS_ORIGINS`. `GET /auth/verify`
  is opened directly from the email client, hits the API, and 302-redirects back to
  `/email-verified` (success) or `/verify-email?error=...` (invalid/expired/missing
  token, or a server error) — it never renders its own HTML. In dev the Vite proxy
  forwards `/api` to the API, so a verify link built from `APP_URL` still reaches it.
