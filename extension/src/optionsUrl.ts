import type { createOptionsRouter } from "./entrypoints/options/router";

type OptionsPath = keyof ReturnType<typeof createOptionsRouter>["routesByPath"];

// A type-only router import keeps the options UI out of popup/background bundles.
export function getOptionsUrl(path: OptionsPath) {
  return browser.runtime.getURL(`/options.html#${path}`);
}
