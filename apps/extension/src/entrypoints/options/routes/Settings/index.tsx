import { Switch } from "@headlessui/react";
import { useTranslation } from "react-i18next";

import { ExtStorage } from "@/commons/constants";
import { Page } from "../../components/Page";
import { ExclusionHandler } from "./components/ExclusionHandler";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useMoreSettingsStore } from "./store";

export function Settings() {
  const language = useMoreSettingsStore((state) => state[ExtStorage.Language]);
  const warningDisabled = useMoreSettingsStore((state) => state[ExtStorage.DisableWarning]);
  const coloringKanjiEnabled = useMoreSettingsStore((state) => state[ExtStorage.ColoringKanji]);
  const excludedSites = useMoreSettingsStore((state) => state[ExtStorage.ExcludeSites]);
  const setLanguage = useMoreSettingsStore((state) => state.setLanguage);
  const setExcludeSites = useMoreSettingsStore((state) => state.setExcludeSites);
  const toggleColoringKanji = useMoreSettingsStore((state) => state.toggleColoringKanji);
  const toggleDisableWarning = useMoreSettingsStore((state) => state.toggleDisableWarning);
  const { i18n, t } = useTranslation();

  function handleLanguageChange(newLanguage: string) {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    document.documentElement.lang = newLanguage;
  }

  function handleExclusionListChange(sites: string[]) {
    const unrepeatedSites = Array.from(new Set(sites));
    setExcludeSites(unrepeatedSites);
  }
  return (
    <Page title={t("navSettings")} icon="i-tabler-settings">
      <menu className="flex flex-col items-center justify-between space-y-10 text-pretty lg:max-w-5xl lg:px-8">
        <li className="flex w-full items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
              {t("settingsLanguage")}
            </div>
            <div>{t("settingsLanguageDesc")}</div>
          </div>
          <LanguageSwitcher language={language ?? i18n.language} onChange={handleLanguageChange} />
        </li>
        <li className="flex w-full items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
              {t("settingsDisableWarning")}
            </div>
            <div>{t("settingsDisableWarningDesc")}</div>
          </div>
          <SettingSwitch enabled={warningDisabled} onChange={toggleDisableWarning} />
        </li>
        <li className="flex w-full items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
              {t("settingsColoringKanji")}
            </div>
            <div>{t("settingsColoringKanjiDesc")}</div>
          </div>
          <SettingSwitch enabled={coloringKanjiEnabled} onChange={toggleColoringKanji} />
        </li>
        <ExclusionHandler sites={excludedSites} onChange={handleExclusionListChange} />
      </menu>
    </Page>
  );
}

function SettingSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-slate-900/10 p-1 transition duration-200 ease-in-out hover:backdrop-brightness-75 focus:outline-hidden data-[checked]:bg-sky-500 data-[focus]:outline-1 data-[focus]:outline-white dark:bg-white/10 dark:hover:backdrop-brightness-175"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
        />
      </Switch>
    </div>
  );
}
