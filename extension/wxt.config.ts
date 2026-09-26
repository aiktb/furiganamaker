import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

const commands = {
  addFurigana: {
    description: "__MSG_shortcutAddFurigana__",
  },
  toggleAutoMode: {
    description: "__MSG_shortcutToggleAutoMode__",
  },
  toggleKanjiFilter: {
    description: "__MSG_shortcutToggleKanjiFilter__",
  },
  toggleFuriganaVisibility: {
    description: "__MSG_shortcutToggleFuriganaVisibility__",
  },
  openPlaygroundPage: {
    description: "__MSG_shortcutOpenPlayground__",
  },
  openOptionsPage: {
    description: "__MSG_shortcutOpenOptions__",
  },
};

export type Command = keyof typeof commands;

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Furigana Maker",
    description: "__MSG_extDescription__",
    permissions: ["contextMenus", "storage"],
    default_locale: "en",
    homepage_url: "https://furiganamaker.app",
    commands,
    browser_specific_settings: {
      gecko: {
        id: "{f610e21f-3434-46e8-8db2-a811f4dbfd5f}",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
  webExt: {
    disabled: true,
  },
  modules: ["@wxt-dev/auto-icons"],
  srcDir: "src",
  autoIcons: {
    baseIconPath: "assets/icons/Logo.svg",
  },
  zip: {
    name: "furigana-maker",
  },
  vite: () => ({
    plugins: [
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
      svgr(),
      tailwindcss(),
    ],
  }),
  hooks: {
    "build:manifestGenerated": ({ config }, manifest) => {
      if (config.mode === "development") {
        // WXT will handle CSP issues in the development environment
        return;
      }
      // lindera-wasm requires 'wasm-unsafe-eval'
      manifest.content_security_policy = {
        extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
      } satisfies Browser.runtime.Manifest["content_security_policy"];
    },
  },
});
