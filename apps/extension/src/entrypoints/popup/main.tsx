// biome-ignore assist/source/organizeImports: react-scan must be imported before React and React DOM
import { scan } from "react-scan";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/tailwind.css";
import "@/commons/i18n";

import { Root } from "./root";

scan({
  enabled: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <Root />
    </ThemeProvider>
  </StrictMode>,
);
