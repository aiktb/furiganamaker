import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import headlessui from "@headlessui/tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "selector",
  plugins: [
    forms,
    typography,
    headlessui({ prefix: "ui" }).handler,
    iconsPlugin({
      collections: getIconCollections(["tabler", "fa6-brands"]),
    }).handler,
  ],
  theme: {
    fontFamily: {
      sans: ["DM Sans", ...defaultTheme.fontFamily.sans],
      mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
    },
  },
} satisfies Config;
