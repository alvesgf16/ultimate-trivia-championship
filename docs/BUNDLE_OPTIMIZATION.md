# Bundle Size Optimization Guide

## Overview

`apps/web` enforces a **300 KB gzipped** budget per shared JS chunk. The check runs automatically on every CI push and pull request via the `bundle-size` job.

---

## Running Analysis Locally

### Generate a visual bundle report

**macOS / Linux:**

```bash
npm run analyze --workspace=web
```

**Windows PowerShell:**

```powershell
$env:ANALYZE = "true"
npm run build --workspace=web
```

Then open `apps/web/.next/analyze/client.html` in a browser.

The report shows a treemap of every module by size — useful for spotting unexpectedly large dependencies.

### Check budget compliance

After building, run the size check script from the repo root:

```bash
npm run build --workspace=web
node scripts/check-bundle-size.mjs
```

Exit code 0 means all chunks are within budget. Exit code 1 means the budget was exceeded.

---

## CI Integration

The `bundle-size` CI job:

1. Restores the `.next/` build artifacts cached by the `build` job (no rebuild needed)
2. Runs `node scripts/check-bundle-size.mjs`
3. Uploads `apps/web/.next/analyze/` as a GitHub Actions artifact (retained 30 days) when present

The `ci-success` gate depends on `bundle-size` — a budget failure blocks the PR.

To view the HTML report from a CI run: go to the workflow run → **Artifacts** → download `bundle-analysis-<sha>`.

---

## What the Budget Covers

The script scans **top-level `.js` files** in `.next/static/chunks/`. These are the shared initial bundles downloaded on every page visit:

| Chunk                  | Contents          |
| ---------------------- | ----------------- |
| `framework-*.js`       | React + React DOM |
| `main-*.js`            | Next.js runtime   |
| `webpack-*.js`         | Webpack runtime   |
| Other top-level chunks | Shared app code   |

Page-specific chunks in subdirectories (`.next/static/chunks/pages/`, `.next/static/chunks/app/`) are **excluded** — they are lazy-loaded and do not affect initial load time.

---

## Webpack Performance Hints

`apps/web/next.config.js` sets `webpack.performance.hints: 'warning'` with a 300 KB uncompressed threshold per asset. These appear in the build log but **do not fail the build**.

The actual 300 KB gzipped enforcement is handled exclusively by `scripts/check-bundle-size.mjs`.

> **Why `warning` and not `error`?** Next.js framework chunks (React + runtime) alone can be 200–400 KB uncompressed. Setting `error` would cause spurious build failures unrelated to application code.

---

## Optimization Strategies

### 1. Audit with the bundle analyzer

Run `npm run analyze --workspace=web` and look for:

- Large third-party libraries
- Unexpectedly large UI components
- Duplicate packages at different versions

### 2. Dynamic imports for heavy components

```tsx
// Before — loaded eagerly
import HeavyChart from 'some-chart-lib';

// After — loaded on demand
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('some-chart-lib'), { ssr: false });
```

### 3. Tree-shake named exports

```ts
// Bad — imports entire lodash (~70 KB)
import _ from 'lodash';
const result = _.pick(obj, ['a', 'b']);

// Good — imports only `pick`
import pick from 'lodash/pick';
// Or use native destructuring / Object.fromEntries instead
```

### 4. Replace heavy libraries

| Heavy                  | Lightweight alternative                            |
| ---------------------- | -------------------------------------------------- |
| `moment` (~67 KB gzip) | `date-fns` (tree-shakeable) or `dayjs` (~2 KB)     |
| `lodash` (~70 KB gzip) | Native ES methods or `lodash-es` with tree-shaking |
| `axios` (~13 KB gzip)  | Native `fetch` (zero KB, built-in)                 |

### 5. Optimize images

Use `next/image` for automatic WebP conversion, lazy loading, and size optimization. Never `import` images as JS modules — this embeds base64 data into the bundle.

### 6. Review `@repo/ui` exports

The shared UI package exports all components from `src/`. Verify that each component file only imports what it needs and does not re-export unused utilities from heavier libraries.

---

## Detecting Unused Code

Run Knip to find unused exports, dependencies, and files across the entire monorepo:

```bash
npm run unused
```

Knip is configured via `knip.json` in the project root. It understands:

- Turborepo workspace structure
- Next.js App Router entry conventions (`page.tsx`, `layout.tsx`, `route.ts`, etc.)
- NestJS API entry points (`main.ts`, `*.module.ts`)

### Common false positives

- **NestJS decorators**: Services and controllers wired via `@Module()` may appear unused. Add them to the `entry` array in the `apps/api` workspace config in `knip.json`.
- **Next.js special files**: `error.tsx`, `not-found.tsx`, `loading.tsx` are already listed as entries — they should not be flagged.
- **Type-only imports**: Knip understands TypeScript and correctly tracks type imports.

---

## Adjusting the Budget

To change the 300 KB budget, update these values consistently:

1. `BUDGET_BYTES` in [scripts/check-bundle-size.mjs](../scripts/check-bundle-size.mjs)
2. `maxAssetSize` and `maxEntrypointSize` in [apps/web/next.config.js](../apps/web/next.config.js)
3. The description in this document

Open a PR with justification for any budget increase. Budget decreases are always welcome.
