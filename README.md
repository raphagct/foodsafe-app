# FoodSafe

FoodSafe is a mobile-first app built with React + Ionic + Capacitor. It helps users learn about food hygiene, scan QR codes for product traceability, report suspicious food with photos, and keep a local history for offline access.

## Key features
- Interactive educational content about food safety.
- Camera integration to scan QR codes and capture photos.
- Product traceability view from QR scan results.
- Report suspicious food with photo evidence and detailed reports.
- Local history saved for offline access (client-side storage).
- Multi-language UI (UI labels visible in components).
- Supabase client included for optional backend integration.

## Stack
- Language(s): TypeScript (primary), HTML, CSS
- Framework / runtime: React 19 + Ionic React (Ionic ecosystem for UI)
- Native runtime: Capacitor (for Android/iOS builds and native plugins)
- Tooling: Vite, TypeScript, ESLint, Tailwind (dev)
- Notable libraries:
  - @ionic/react, @ionic/react-router — Ionic UI + routing
  - @capacitor/core, @capacitor/cli, @capacitor/camera — native bridge & camera
  - @ionic/pwa-elements — PWA elements (web camera support, etc.)
  - @supabase/supabase-js — optional backend client

## Quick start

Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- Android Studio / Xcode if building native apps with Capacitor

Install
```bash
git clone https://github.com/raphagct/foodsafe-app.git
cd foodsafe-app
npm install
```

Run in the browser (development)
```bash
npm run dev
# open http://localhost:5173 (Vite default)
```

Build for production
```bash
npm run build
```

Preview a production build locally
```bash
npm run preview
```

Add / run native platforms with Capacitor
```bash
# After a production build step (or a dev build depending on workflow)
npm run build
npx cap sync android
npx cap open android

# For iOS
npx cap sync ios
npx cap open ios
```

Notes
- Camera and QR scanning use Capacitor plugins; when testing in the browser, you may rely on @ionic/pwa-elements fallback behavior.
- Make sure to add required platform permissions (camera, storage) in native projects.

## Environment
If you integrate with Supabase or another backend, set these env vars in your environment or a .env file used by your build:
- SUPABASE_URL
- SUPABASE_ANON_KEY

(Adjust names/details to match your actual environment-loading strategy.)

## Project structure (top-level)
```
.
├── capacitor.config.ts        # Capacitor configuration
├── index.html
├── package.json
├── public/
├── src/
│   ├── main.tsx              # app bootstrap, ionic pwa elements init
│   ├── App.tsx               # top-level routes + Ionic router
│   ├── components/           # shared UI components (NavBar, HistorySection, LanguageButton)
│   ├── pages/                # app pages (HomePage, CameraPage, EducationPage, HistoryPage, ReportDetailsPage, TraceabilityPage)
│   ├── theme/                # theme variables and CSS
│   └── utils/                # helper utilities
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

How it fits together
- The app bootstraps in `src/main.tsx` and mounts `src/App.tsx`.
- `App.tsx` wires Ionic and React Router, and `NavBar` (in `src/components`) defines the app tabs and page routes.
- Camera and traceability features are in pages under `src/pages` (CameraPage, TraceabilityPage). History and reporting live under `src/pages/HistoryPage`.
- The app runs as a web app via Vite during development and is packaged for native platforms using Capacitor.

## Development notes and pointers
- UI text currently appears in multiple languages inside components (see `NavBar.tsx` labels). Check `LanguageButton` for language switching behavior.
- The repository contains a Supabase client dependency — if you want server-backed persistence or remote report sync, wire Supabase keys and backend functions.
- Camera and file uploads are handled using Capacitor plugins; when debugging on desktop, `@ionic/pwa-elements` provides web fallbacks.

## Contributing
- Open issues for bugs or feature requests.
- Follow the existing code style (TypeScript + ESLint).
- Create branches off `develop` and submit PRs against `develop`.

## License
Specify a license for the project (e.g. MIT). If you want me to add a LICENSE file, tell me which license to use.

## Useful commands (summary)
```bash
# dev
npm install
npm run dev

# build
npm run build
npm run preview

# Capacitor native workflow
npm run build
npx cap sync
npx cap open android  # or ios
```
