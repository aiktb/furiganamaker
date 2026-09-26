# Extension

See [Contributing Guide](../../.github/CONTRIBUTING.md#setup-dev-environment).

## Options routing

Options uses TanStack Router file-based routes in `src/entrypoints/options/routes`. Page components and their supporting files live in `src/entrypoints/options/pages` so they are not treated as routes.

The Vite plugin generates `routeTree.gen.ts` during development and builds, and enables automatic route code splitting. `pnpm --filter extension typecheck` generates the same route tree before checking types, including on a clean checkout. Do not edit the generated file.

The router keeps hash history, so links remain `options.html#/playground`, etc. Use `Link` or `linkOptions` for internal navigation and `getOptionsUrl` for typed links from other extension entrypoints.
