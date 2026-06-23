# Big Project

MERN stack web app + Flutter mobile app for COP4331.

## Structure

```
.
├── api/      → Express + MongoDB REST API (TypeScript)
├── web/      → React web client (Vite + TypeScript)
├── mobile/   → Flutter mobile app (Android + iOS)
└── .github/  → CI / workflows
```


## Prerequisites

- **Node.js** ≥ 20 and npm
- **MongoDB** 
- **Flutter** 

## api/ - Express + MongoDB

```bash
cd api
npm install              # first time only
cp .env.example .env     # then edit values as needed
npm run dev              # start with hot reload
```

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Run in watch mode via `tsx`           |
| `npm run build`   | Compile TypeScript to `dist/`         |
| `npm start`       | Run the compiled server from `dist/`  |
| `npm run typecheck` | Type-check without emitting          |

Health check once running: <http://localhost:5001/api/health>

## web/ - React (Vite)

```bash
cd web
npm install              
npm run dev              
```

| Script           | What it does                  |
| ---------------- | ----------------------------- |
| `npm run dev`    | Start the Vite dev server     |
| `npm run build`  | Production build to `dist/`    |
| `npm run preview`| Preview the production build   |

## mobile/ - Flutter

```bash
cd mobile
flutter pub get          
flutter run              
```