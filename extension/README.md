# Extension

See [Contributing Guide](../../.github/CONTRIBUTING.md#setup-dev-environment).

## Options routing

Options uses TanStack Router file-based routes in `src/entrypoints/options/routes`. Each route file defines both its route and page component. Page-specific components and stores are colocated under `-components` and `-store.ts`, which the route generator ignores. The home page uses `index.tsx` with its supporting files in `-settings`. Shared UI remains in the options `components` directory.

The Vite plugin generates `routeTree.gen.ts` during development and builds, and enables automatic route code splitting. `pnpm --filter extension typecheck` generates the same route tree before checking types, including on a clean checkout. Do not edit the generated file.

The router keeps hash history, so links remain `options.html#/playground`, etc. Use `Link` or `linkOptions` for internal navigation and `getOptionsUrl` for typed links from other extension entrypoints.
