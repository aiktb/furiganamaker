# [furiganamaker.app](https://furiganamaker.app)

The official Furigana Maker website, built with TanStack Start. The `/welcome` page guides users through installing the extension.

## Development

From the repository root:

```bash
pnpm install
pnpm --filter website dev
```

Routes live in `src/routes`. TanStack Start generates `src/routeTree.gen.ts`; do not edit it manually. `pnpm --filter website typecheck` also regenerates the route tree, so type checking works on a clean checkout. The router is registered in `src/router.tsx` to type-check internal links and navigation. Use ordinary anchors for external URLs.

## Build and preview

```bash
pnpm --filter website typecheck
pnpm --filter website build
pnpm --filter website start
```

The Cloudflare Vite plugin runs development and production previews in the Workers runtime. Build output is written to `dist/client` and `dist/server`.

## Deployment

This migration replaces the old Cloudflare Pages Functions adapter with the official TanStack Start Cloudflare Workers integration. The existing Pages deployment must be moved to Workers before publishing this build; configure the custom domain for the Worker when switching production traffic.

```bash
pnpm --filter website deploy
```

This builds the site and deploys it using Wrangler. For Cloudflare Workers Builds, run `pnpm --filter website build` from the repository root and deploy with `pnpm --filter website exec wrangler deploy`. The old `build/client` Pages output and Pages Functions entry are no longer used.
