import "@/tailwind.css";
import "@/commons/i18n";

import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router";

import ErrorPage from "./components/ErrorPage";
import Root from "./root";
import Changelog from "./routes/Changelog";
import RulesEditor from "./routes/RulesEditor";
import Settings from "./routes/Settings";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Settings /> },
      { path: "/rules-editor", element: <RulesEditor /> },
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
