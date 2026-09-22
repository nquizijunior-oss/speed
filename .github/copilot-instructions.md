# Copilot instructions for this repo

## Project shape
- This is a Vite + React + TypeScript app for an auto-ecole dashboard. The main entry is `src/App.tsx`, which sets up `BrowserRouter`, route guards, and the authenticated shell.
- The app is organized by feature area, not by backend service: `src/pages/` for screens, `src/components/layout/` for shell/navigation, `src/components/ui/` for reusable presentational controls, and `src/components/modals/` for CRUD forms.
- Domain types live in `src/types/index.ts`; seed/mock data lives in `src/data/*.ts` and is imported directly by pages and dashboards (there is no API layer or backend client in this repo).

## State and data flow
- The shared app state is centralized in `src/context/AppContext.tsx` and typed in `src/context/appContextDefinition.ts`.
- `AppContextProvider` initializes `candidats` from `localStorage` and persists it back on change. Use `useAppContext()` instead of ad hoc prop drilling for candidate-related updates.
- Pattern example: `NewCandidatModal` reads `candidats` and calls `addCandidat(newCandidat)`; page-level components then read the context and render filtered/derived views.
- When adding new business entities, follow the existing structure: add a type in `src/types/index.ts`, seed data in `src/data/`, and wire it through the context only if it must persist across screens.

## UI conventions
- The app uses Tailwind CSS with a custom palette (`brand`, `navy`, `ink`, `canvas`, `line`) configured in `tailwind.config.js` and global theme styles in `src/index.css`.
- Components typically use `Card`, `PageHeader`, and `Badge` wrappers instead of one-off class patterns. Reuse those primitives before creating custom UI.
- Most pages are French-language dashboard screens with table/list layouts and filter controls (`Candidats.tsx` is a good reference for search + status filtering).
- Keep route names and labels aligned with the French domain vocabulary already in the app (`candidats`, `examens`, `reservations`, `facturation`, `documents`, `flotte`, `parametres`).

## Workflow and validation
- Install deps: `npm install`
- Start locally: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- This project currently builds successfully; lint is mostly warning-only in the current state, so do not treat warnings as a blocker unless your change introduces new errors.
- There is no test suite in the repo, so verification here is primarily `build` + `lint` after UI or state changes.

## Important repo-specific patterns
- `AppLayout` uses `Outlet` from `react-router-dom`; child pages render inside the shared sidebar/topbar shell and read data from the app context.
- Keep generated/mock data realistic and typed: the app uses static arrays for an operational dashboard, not live data fetching.
- Prefer local component state for form inputs and modal behavior; the repository pattern is simple React state, not form libraries or external state managers.
- If you add a new page, register it in `src/App.tsx` and keep its route naming consistent with the existing `Route path="/..."` conventions.
