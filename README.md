# Crumb

Crumb is a free food finder for the UCF campus, built for COP4331. Students post leftover or free food the moment they spot it. Everyone nearby can vote on whether it is still there, so every post carries a live freshness score and expires when the food runs out.

## How it works

- Post a drop: what the food is, where it is, and an optional photo.
- Others vote "still here" or "gone" and the confidence score updates live.
- Posts fade from fresh to likely to fading, then expire on their own.
- Accounts need a verified email before posting or voting.

## Project structure

```
api/      Express + MongoDB REST API (TypeScript)
web/      React desktop web app (Vite + TypeScript)
mobile/   Flutter app for iOS and Android
```

## Running it

Each part has its own README with full setup steps. Short version:

**API**
```bash
cd api
npm install
cp .env.example .env   # fill in your values
npm run dev            # http://localhost:5001
```

**Web**
```bash
cd web
npm install
npm run dev            # http://localhost:5173, proxies /api to the API
```

**Mobile**
```bash
cd mobile
flutter pub get
flutter run            # needs Flutter 3.44 or newer
```

The API docs live in `api/openapi.yaml`. Tests: `npm test` in `api/`, `flutter test` in `mobile/`.

## Team

Built by the COP4331 project group, Summer 2026.
