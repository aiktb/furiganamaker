if (import.meta.env.DEV) {
  await import("react-grab");
  const { scan } = await import("react-scan");
  scan({ enabled: true });
}

import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/tailwind.css";
import "@/i18n";

import { createOptionsRouter } from "./router";

const router = createOptionsRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
