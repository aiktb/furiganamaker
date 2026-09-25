import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ErrorPage, NotFoundPage } from "./components/ErrorPage";
import { Root } from "./root";
import { Changelog } from "./routes/Changelog";
import { KanjiFilter } from "./routes/KanjiFilter";
import { Playground } from "./routes/Playground";
import { Selector } from "./routes/Selector";
import { Settings } from "./routes/Settings";

const rootRoute = createRootRoute({
  component: Root,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Settings,
});
const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/playground",
  component: Playground,
});
const kanjiFilterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kanji-filter",
  component: KanjiFilter,
});
const selectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/selector",
  component: Selector,
});
const changelogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/changelog",
  component: Changelog,
});

export const routeTree = rootRoute.addChildren([
  settingsRoute,
  playgroundRoute,
  kanjiFilterRoute,
  selectorRoute,
  changelogRoute,
]);

export function createOptionsRouter() {
  return createRouter({ routeTree, history: createHashHistory() });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createOptionsRouter>;
  }
}
