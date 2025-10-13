# Repository Guidelines

## Project Structure & Module Organization
`src/app` defines route segments, layouts, and loaders; treat each folder as a feature module. Shared components live in `src/components`, while primitives and Radix wrappers sit under `src/components/ui`. Cross-cutting utilities belong in `src/lib`. Convex functions are in `convex`—only edit documented entry points and regenerate when the schema changes. Static assets (images, fonts, copy) belong in `public`. Keep configuration in the repo root (`next.config.ts`, `biome.json`, `lefthook.yml`, `tsconfig.json`) and version any meaningful change alongside related code.

## Build, Test, and Development Commands
Install dependencies with `bun install`. Use `bun run dev` for the local Next.js server, `bun run build` for production bundles, and `bun run start` to verify the compiled output. Lint all staged files with `bun run lint`; auto-format via `bun run format`. When you add tooling, extend `package.json` scripts and document the expected workflow in your PR.

## Coding Style & Naming Conventions
Biome enforces 2-space indentation, trailing commas, and sorted imports—avoid manual overrides. Prefer TypeScript types and `zod`-like schemas when sharing shapes between client and Convex. Use PascalCase for React components, camelCase for functions and variables, and kebab-case or index files for routes (`app/donate/page.tsx`). Client components must include `"use client"` as the first statement. Lean on Tailwind for styling; isolate custom CSS in `src/app/globals.css` when utilities fall short.

## Testing Guidelines
A formal test runner is not wired in yet; contributions should either add targeted tests (Vitest is the preferred choice) or spell out manual verification steps. Co-locate tests in `src/<feature>/__tests__` with filenames ending in `.test.tsx`. Expose a `bun run test` script when introducing automated tests, and note any coverage thresholds or flaky cases in the PR.

## Commit & Pull Request Guidelines
History favors short imperative commit titles (`add shadcn`, `add kero image`). Keep each commit focused and reference related issues or tickets in the body. Pull requests should explain the problem, summarize the solution, list verification steps (`bun run lint`, `bun run dev` screenshot, manual demo), and attach UI diffs when visible changes exist. Keep PR scope tight; spin follow-up ideas into separate issues.

## Tooling & Automation
Lefthook triggers `bun x ultracite fix` on staged TS/JS/JSON/CSS files. Run `bunx lefthook run pre-commit` locally after adjusting lint rules or adding file types so contributors refresh hooks. Document any automation updates in the PR description.
