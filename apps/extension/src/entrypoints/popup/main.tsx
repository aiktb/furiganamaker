import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/tailwind.css";
import "@/commons/i18n";

import { Root } from "./root";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <Root />
    </ThemeProvider>
  </StrictMode>,
);
