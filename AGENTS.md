# Repository Guidelines

## Project Structure & Module Organization
`src/app` holds Next.js route segments, layouts, and data loaders; treat each folder as a self-contained feature. Shared UI lives under `src/components`, with reusable primitives inside `src/components/ui`. Re-export utilities from `src/lib` to keep cross-cutting logic decoupled from pages. The Convex backend logic sits in `convex`, which is generated at build time and should only expose documented functions. Static assets and copy belong in `public`. Keep configuration in the root (`next.config.ts`, `biome.json`, `tsconfig.json`) and update them alongside related code changes.

## Build, Test, and Development Commands
Install dependencies with `bun install`. Run the local dev server via `bun run dev`, and ship-ready bundles with `bun run build`. Use `bun run start` to smoke-test the production build. Lint everything with `bun run lint`, and apply fixes using `bun run format`. When introducing new commands, register them in `package.json` and document expected usage in the PR.

## Coding Style & Naming Conventions
Biome enforces 2-space indentation, trailing commas where valid, and organized imports—do not hand-format around it. Prefer TypeScript types unless React hooks require interfaces. Name React components in PascalCase, utilities in `camelCase`, and files with kebab-case or folder index files (`page.tsx`, `layout.tsx`). Centralize design tokens through Tailwind classes; avoid inline styles unless dynamic. Keep server/client components explicit via `"use client"` directives at the top of the file.

## Testing Guidelines
Automated testing is not configured yet, so contributions that add features should include either unit tests (e.g., with Vitest) or explain the manual verification steps in the PR. Place future tests adjacent to the code (`src/<feature>/__tests__`) and name files `*.test.ts(x)`. Ensure any new test runner is wired through a `bun run test` script and include coverage thresholds when the suite lands.

## Commit & Pull Request Guidelines
Recent commits (`add shadcn`, `add kero image`) follow short imperative titles; continue that pattern and scope one logical change per commit. Reference related issues or task IDs in the body. PRs should outline the motivation, summarize the change, list verification steps (`bun run lint`, `bun run dev` screenshot), and attach UI diffs when relevant. Keep PRs focused—spin follow-up work into separate issues.

## Tooling & Automation
Lefthook runs `bun x ultracite fix` on staged TS/JS/JSON/CSS before commits. Run it manually with `bunx lefthook run pre-commit` if you modify tooling. Update hook config when you add new file types, and mention the change in the PR so others can reinstall hooks.
