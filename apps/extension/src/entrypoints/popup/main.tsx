import * as Sentry from "@sentry/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/tailwind.css";
import "@/commons/i18n";

import { Root } from "./root";

Sentry.init({
  dsn: "https://93bfaefbe956cf67fc9baad45d9c8357@o4507553809498112.ingest.us.sentry.io/4508510108319744",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <Root />
    </ThemeProvider>
  </StrictMode>,
);
