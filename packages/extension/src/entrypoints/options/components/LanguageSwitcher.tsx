import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  language: string;
  onChange: (language: string) => void;
}

export default function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  const displayNameIntl = new Intl.DisplayNames(language, { type: "language" });
  const { i18n } = useTranslation();
  return (
    <Listbox value={language} onChange={onChange}>
      <ListboxButton className="data-[focus]:-outline-offset-2 relative block h-12 min-w-40 text-nowrap rounded-lg bg-slate-950/5 py-1.5 pr-8 pl-3 text-left text-slate-900 text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:outline-black/25 dark:bg-white/5 dark:text-white dark:data-[focus]:outline-white/25">
        {displayNameIntl.of(language)}
        <i className="i-tabler-chevron-down group pointer-events-none absolute top-4 right-2.5 size-4 fill-white/60" />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="bg-white transition duration-100 ease-in [--anchor-gap:4px] focus:outline-none data-[leave]:data-[closed]:opacity-0 dark:bg-slate-900"
      >
        <div className="w-[var(--button-width)] rounded-xl border border-black/5 bg-black/5 p-1 dark:border-white/5 dark:bg-white/5">
          {Object.keys(i18n.options.resources!).map((language) => (
            <ListboxOption
              key={language}
              value={language}
              className="group flex cursor-pointer select-none items-center gap-2 rounded-lg px-1 py-1.5 data-[focus]:bg-slate-950/10 dark:data-[focus]:bg-white/10"
            >
              <i className="i-tabler-check invisible size-4 text-sky-400 group-data-[selected]:visible" />
              <div className="overflow-hidden overflow-ellipsis text-nowrap text-slate-900 text-sm/6 dark:text-white">
                {displayNameIntl.of(language)}
              </div>
            </ListboxOption>
          ))}
        </div>
      </ListboxOptions>
    </Listbox>
  );
}
