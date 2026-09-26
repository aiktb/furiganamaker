# [furiganamaker.app](https://furiganamaker.app)

The official Furigana Maker website, built with TanStack Start and hosted on Cloudflare Workers. The `/welcome` page introduces the extension after installation.

## Development

Run the following commands from the repository root:

```bash
pnpm install
pnpm --filter website dev
```

Routes live in `src/routes`. TanStack Start generates `src/routeTree.gen.ts`; do not edit it manually. `pnpm --filter website typecheck` also regenerates the route tree, so type checking works on a clean checkout. The router is registered in `src/router.tsx` to type-check internal links and navigation. Use ordinary anchors for external URLs.

## Build and local preview

```bash
pnpm --filter website typecheck
pnpm --filter website build
pnpm --filter website preview
```

The Cloudflare Vite plugin runs development and local build previews in the Workers runtime. Build output is written to `website/dist/client` (static assets) and `website/dist/server` (the SSR Worker).

TanStack Start prerenders `/` and `/welcome` to HTML at build time. Cloudflare serves these pages as static assets without invoking the SSR Worker, while React hydrates them for client-side interactions. Rebuild and deploy to update the generated HTML. Requests that do not match a static asset still fall back to the Worker, including unknown routes that render the not-found page.

## Deployment

Worker configuration lives in [`wrangler.jsonc`](./wrangler.jsonc). To build and deploy from the repository root with an authenticated Wrangler session:

```bash
pnpm --filter website deploy
```

### Cloudflare Workers Builds

Workers Builds configuration:

| Setting | Value |
| --- | --- |
| Worker name | `furigana-maker` |
| Root directory | `website` |
| Production branch | `main` |
| Build command | `pnpm run build` |
| Deploy command | `pnpm exec wrangler deploy` |
| Non-production branch deploy command | `pnpm exec wrangler preview` |

Build watch paths are relative to the repository root:

```text
website/**
pnpm-lock.yaml
pnpm-workspace.yaml
package.json
```

Wrangler deploys the generated Worker and its static assets together.

### Cloudflare Previews

To build and publish a Preview from the current branch, run from the repository root:

```bash
pnpm --filter website build
pnpm --filter website exec wrangler preview
```

This publishes a remote Preview; `pnpm --filter website preview` only starts a local preview server. The `"previews": {}` block in `wrangler.jsonc` is required by `wrangler preview`. Keep assets and compatibility settings at the top level, as described in the [Cloudflare Preview configuration documentation](https://developers.cloudflare.com/workers/previews/configuration/#wrangler-configuration-file).
