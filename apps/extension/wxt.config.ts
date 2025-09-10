import fs from "node:fs/promises";
import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
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
    plugins: [react({ devTarget: "esnext" }), svgr(), tailwindcss()],
    build: {
      target: "esnext",
    },
  }),
  hooks: {
    "build:publicAssets": async ({ config }, publicFiles) => {
      const srcDir = path.resolve(import.meta.dirname, "./node_modules/@sglkc/kuromoji/dict");
      const filenames = await fs.readdir(srcDir);
      const destDir = path.resolve(config.outDir, "dict");
      await fs.mkdir(destDir, { recursive: true });
      const files = filenames.map((filename) => {
        const absoluteSrc = path.resolve(srcDir, filename);
        const relativeDest = path.resolve(destDir, filename);
        return { absoluteSrc, relativeDest };
      });
      publicFiles.push(...files);
    },
  },
});
