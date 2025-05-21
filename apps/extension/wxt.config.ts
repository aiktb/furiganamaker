import fs from "node:fs";
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
  toggleFuriganaDisplay: {
    description: "__MSG_shortcutToggleFuriganaDisplay__",
  },
};

export type Command = keyof typeof commands;

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["contextMenus", "storage"],
    default_locale: "en",
    homepage_url: "https://furiganamaker.app",
    commands,
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
    "build:publicAssets": ({ config }, publicFiles) => {
      const srcDir = path.resolve(import.meta.dirname, "./node_modules/@sglkc/kuromoji/dict");
      const filenames = fs.readdirSync(srcDir);
      const destDir = path.resolve(config.outDir, "dict");
      fs.mkdirSync(destDir);
      for (const filename of filenames) {
        const absoluteSrc = path.resolve(srcDir, filename);
        const relativeDest = path.resolve(destDir, filename);
        publicFiles.push({ absoluteSrc, relativeDest });
      }
    },
  },
});
