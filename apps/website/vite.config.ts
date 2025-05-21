import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [cloudflareDevProxy(), reactRouter(), tailwindcss(), devtoolsJson()],
});
