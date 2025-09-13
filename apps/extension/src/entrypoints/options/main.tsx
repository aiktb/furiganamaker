if (import.meta.env.DEV) {
  const { scan } = await import("react-scan");
  scan({ enabled: true });
}

import * as Sentry from "@sentry/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";

import "@/tailwind.css";
import "@/commons/i18n";

import { ErrorPage } from "./components/ErrorPage";
import { Root } from "./root";
import { Changelog } from "./routes/Changelog";
import { KanjiFilter } from "./routes/KanjiFilter";
import { Playground } from "./routes/Playground";
import { Selector } from "./routes/Selector";
import { Settings } from "./routes/Settings";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Settings /> },
      { path: "/playground", element: <Playground /> },
      { path: "/kanji-filter", element: <KanjiFilter /> },
      { path: "/selector", element: <Selector /> },
      { path: "/changelog", element: <Changelog /> },
    ],
  },
]);

Sentry.init({
  dsn: "https://93bfaefbe956cf67fc9baad45d9c8357@o4507553809498112.ingest.us.sentry.io/4508510108319744",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <RouterProvider router={router} />
      <button
        className="fixed top-4 right-4 z-50 rounded-full bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        onClick={() => {
          throw new Error("This is your first error!");
        }}
      >
        Break the world
      </button>
    </ThemeProvider>
  </StrictMode>,
);
