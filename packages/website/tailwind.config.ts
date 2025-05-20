import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import headlessui from "@headlessui/tailwindcss";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
  plugins: [
    forms,
    headlessui({ prefix: "ui" }).handler,
    iconsPlugin({ collections: getIconCollections(["fa6-brands", "mdi"]) }).handler,
  ],
} satisfies Config;
