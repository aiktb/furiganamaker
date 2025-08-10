// biome-ignore assist/source/organizeImports: react-scan must be imported before React and React DOM
import { scan } from "react-scan";
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
import { Selector } from "./routes/Selector";
import { Settings } from "./routes/Settings";

scan({
  enabled: true,
});

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Settings /> },
      { path: "/kanji-filter", element: <KanjiFilter /> },
      { path: "/selector", element: <Selector /> },
      { path: "/changelog", element: <Changelog /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
